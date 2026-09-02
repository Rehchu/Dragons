#!/usr/bin/env node
'use strict';

/*
 * Hardening tests for tools/write-scene.cjs.
 *
 * Three durability/correctness gaps the base tool left open — reproduced here
 * first (they FAIL against the un-hardened tool), then proven fixed:
 *
 *   1. DIRECTORY FSYNC   — after rename(), the *directory* must be fsync'd so the
 *                          new dir entry survives a power loss (rename durability).
 *   2. ORPHAN .tmp CLEANUP — if any step throws after the temp file is created,
 *                          the temp file must be removed, never left as litter.
 *   3. UNC-AWARE NORMALIZE — `\\SERVER\Share\..` and `\\server\share\..` name the
 *                          same file on Windows; normalizePath must agree.
 *
 * Run:  node test/write-scene.harden.test.cjs
 * Exit 0 = all pass.  We NEVER skip a case to go green.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');

const toolPath = require.resolve('../tools/write-scene.cjs');
const { writeSceneAtomic, normalizePath, samePath } = require(toolPath);

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ok   ${name}`);
  } catch (err) {
    console.error(`  FAIL ${name}`);
    console.error('       ' + (err && err.stack ? err.stack : err));
    process.exitCode = 1;
  }
}

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dragons-harden-'));

console.log('hardening write-scene — durability, cleanup, UNC\n');

// ---- 1. DIRECTORY FSYNC -----------------------------------------------------
// We can't crash the box, but we CAN prove the fsync REALLY happened. The old
// version of this test spied on fs.fsyncSync and recorded the fd BEFORE calling
// through to the real fsync — so it went green even when the real fsync threw
// EPERM (which it does on a directory opened `'r'` on Windows). That proved
// nothing: the tool's dir-fsync was a silent no-op on the very box it serves.
//
// The corrected test records a directory fd as fsync'd ONLY when the real
// fsyncSync returns without throwing, AND cross-checks the tool's own
// `dirDurable` flag. If dir fsync is genuinely impossible on this platform,
// we say so out loud rather than pass vacuously.
test('DIR FSYNC: the target directory is really fsync\'d after rename', () => {
  const target = path.join(tmpRoot, 'durable', 'scene.md');
  const dir = path.dirname(path.resolve(target));

  const realOpenSync = fs.openSync;
  const realFsyncSync = fs.fsyncSync;
  const dirFds = new Set();
  const dirFdsTrulyFsynced = new Set();

  fs.openSync = function (p, ...rest) {
    const fd = realOpenSync.call(fs, p, ...rest);
    try {
      if (path.resolve(String(p)) === dir) dirFds.add(fd);
    } catch (_) {}
    return fd;
  };
  fs.fsyncSync = function (fd) {
    // Call the REAL fsync first. Only record success if it did NOT throw — this
    // is what closes the vacuous-pass hole. A directory fd that EPERMs is never
    // counted as durable.
    const r = realFsyncSync.call(fs, fd);
    if (dirFds.has(fd)) dirFdsTrulyFsynced.add(fd);
    return r;
  };

  let res;
  try {
    res = writeSceneAtomic(target, 'durable content\n');
  } finally {
    fs.openSync = realOpenSync;
    fs.fsyncSync = realFsyncSync;
  }

  const dirTrulyFsynced = dirFdsTrulyFsynced.size > 0;

  // The tool's reported durability flag must agree with what we observed.
  assert.strictEqual(
    res.dirDurable,
    dirTrulyFsynced,
    'tool\'s dirDurable flag must match whether a real directory fsync succeeded'
  );

  // Probe whether THIS platform can fsync a directory at all (try 'r+' then 'r',
  // mirroring the tool). If it can, the tool MUST have done it.
  let platformCanFsyncDir = false;
  for (const flag of ['r+', 'r']) {
    let dfd;
    try {
      dfd = realOpenSync.call(fs, dir, flag);
    } catch (_) { continue; }
    try { realFsyncSync.call(fs, dfd); platformCanFsyncDir = true; }
    catch (_) { /* try next flag */ }
    finally { try { fs.closeSync(dfd); } catch (_) {} }
    if (platformCanFsyncDir) break;
  }

  if (platformCanFsyncDir) {
    assert.ok(
      dirTrulyFsynced,
      'this platform CAN fsync a directory, so the tool must actually do it (no silent no-op)'
    );
  } else {
    console.log('       (directory fsync genuinely unsupported here — tool reports dirDurable=false)');
    assert.strictEqual(res.dirDurable, false, 'unsupported platform must report dirDurable=false');
  }
});

// ---- 2. ORPHAN .tmp CLEANUP -------------------------------------------------
// Force a throw AFTER the temp file exists (make rename fail). The tool must
// remove the temp file on the way out — no ".tmp" litter left behind.
test('ORPHAN CLEANUP: a failed write leaves no .tmp file behind', () => {
  const dir = path.join(tmpRoot, 'cleanup');
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, 'scene.md');

  const realRenameSync = fs.renameSync;
  fs.renameSync = function () {
    throw new Error('injected rename failure');
  };

  let threw = false;
  try {
    writeSceneAtomic(target, 'content that never lands\n');
  } catch (_) {
    threw = true;
  } finally {
    fs.renameSync = realRenameSync;
  }

  assert.ok(threw, 'writeSceneAtomic must propagate the failure, not swallow it');
  const leftovers = fs.readdirSync(dir).filter((f) => f.endsWith('.tmp'));
  assert.deepStrictEqual(
    leftovers,
    [],
    `expected no orphan .tmp files, found: ${leftovers.join(', ')}`
  );
});

// ---- 3. UNC-AWARE NORMALIZE -------------------------------------------------
// On Windows, \\SERVER\Share\.. and \\server\share\.. are the SAME file. The
// normalized key must be identical regardless of case — the drive-letter fix
// left UNC paths un-normalized (the same clobber bug, on a network share).
// The realistic clobber vector on a share is the SERVER/SHARE root spelled with
// different case (how the share was mounted/typed) — `\\SERVER\Share` vs
// `\\server\share` — while the path *within* the share is the same. Windows
// treats the host+share case-insensitively, so these are ONE file. The volume
// fold must make the normalized keys equal.
test('UNC: normalizePath folds case-differing server/share to one file', () => {
  const upper = String.raw`\\SERVER\Share\chapters\09-the-nine-cities.md`;
  const lower = String.raw`\\server\share\chapters\09-the-nine-cities.md`;

  // Only assert the case-insensitivity when this platform actually preserves a
  // UNC prefix (Windows). On POSIX these are just filenames and case matters.
  const looksUNC = /^[\\/]{2}[^\\/]/.test(path.resolve(upper));
  if (looksUNC) {
    assert.strictEqual(
      normalizePath(upper),
      normalizePath(lower),
      'UNC server/share must normalize case-insensitively (same file)'
    );
    assert.ok(samePath(upper, lower), 'samePath must agree for UNC spellings');
  } else {
    console.log('       (no UNC prefix preserved on this platform — Windows-specific)');
  }
});

// ---- 4. UNC PREFIX PRESERVED (no data mangling) -----------------------------
// The normalized form must keep the double-slash UNC prefix; it must NOT collapse
// \\SERVER\Share into //SERVER... losing the leading slash, nor merge segments.
// Only the VOLUME (server + share) is case-folded — matching the drive-letter
// precedent, which lower-cases `D:` but never the rest of the path. The
// within-share segments are preserved verbatim (the remote FS may be
// case-sensitive; we must not silently rewrite a name we didn't verify equal).
test('UNC: normalized form folds only the volume, preserves inner segments', () => {
  const p = String.raw`\\SERVER\Share\Dir\File.md`;
  const looksUNC = /^[\\/]{2}[^\\/]/.test(path.resolve(p));
  if (looksUNC) {
    const norm = normalizePath(p);
    assert.ok(/^\/\/[^/]/.test(norm), `expected a //server prefix, got: ${norm}`);
    // Volume lower-cased, inner path preserved, single forward slashes throughout.
    assert.strictEqual(norm, '//server/share/Dir/File.md');
  } else {
    console.log('       (no UNC prefix preserved on this platform — Windows-specific)');
  }
});

// cleanup
try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch (_) {}

console.log(`\n${passed} checks passed${process.exitCode ? ', WITH FAILURES' : ''}.`);
if (!process.exitCode) console.log('The saga survives power loss, litters no tmp, and network shares can\'t fool the verify.');
