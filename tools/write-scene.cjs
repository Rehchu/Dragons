#!/usr/bin/env node
'use strict';

/*
 * write-scene.js — safely write a saga scene/chapter file and verify it landed.
 *
 * THE BUG THIS DEFEATS
 * --------------------
 * On this Windows box, Git-Bash paths look like `/d/projects/...` while Node
 * reports `process.cwd()` as `D:\projects\...`. The drive letter's CASE differs
 * (`d:` vs `D:`). Windows' filesystem is case-insensitive, so BOTH strings point
 * at the SAME file — but naive JS code that compares path STRINGS treats them as
 * two different files.
 *
 * A "verify after write" step that compares raw path strings (or a build step
 * that de-dupes chapters by raw path) therefore concludes the freshly written
 * chapter "isn't there", and re-creates / clobbers it with a placeholder or a
 * truncated stub. That is how the Nine Cities chapter got clobbered.
 *
 * THE FIX (two parts)
 * -------------------
 *   1. ATOMIC WRITE: write to a temp file in the same directory, fsync, then
 *      rename() into place. rename() is atomic on one volume, so a reader never
 *      sees a half-written or zero-byte file — no torn/clobbered content.
 *   2. NORMALIZED-PATH VERIFY: after writing, read the file back through a
 *      canonicalized path (fs.realpathSync + a lower-cased drive letter) and
 *      compare BYTES, not path strings. Casing can never fool the check again.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

/**
 * Canonicalize a path so casing of the *volume* (drive letter OR UNC
 * `\\server\share` root) never causes a false mismatch. Returns an absolute
 * path with forward slashes and a lower-cased volume — a stable key you can
 * compare regardless of how the path was originally spelled:
 *   `d:\` vs `D:\` vs `/d/` vs `/D/`                (drive letters)
 *   `\\SERVER\Share\..` vs `\\server\share\..`       (UNC network shares)
 *
 * Only the volume is case-folded, matching Windows semantics. The rest of the
 * path is left as-is so this stays correct on case-sensitive (POSIX) systems.
 */
function normalizePath(p) {
  let abs = path.resolve(p);
  // Best-effort real path (resolves symlinks + OS-canonical casing). If the file
  // does not exist yet, fall back to the resolved-but-unreal path.
  try {
    abs = fs.realpathSync.native ? fs.realpathSync.native(abs) : fs.realpathSync(abs);
  } catch (_) {
    /* file may not exist yet — that's fine for the pre-write key */
  }
  // Normalize separators to forward slashes first so one regex handles both the
  // `\\server\share` and `//server/share` spellings of a UNC root.
  abs = abs.replace(/\\/g, '/');

  // UNC path: `//server/share/rest...`  ->  lower-case ONLY `//server/share`.
  // Windows treats the host + share case-insensitively; the rest may not be.
  const unc = abs.match(/^\/\/([^/]+)\/([^/]+)(\/.*)?$/);
  if (unc) {
    const server = unc[1].toLowerCase();
    const share = unc[2].toLowerCase();
    const rest = unc[3] || '';
    return `//${server}/${share}${rest}`;
  }

  // Drive-letter path: lower-case a leading `D:` -> `d:`.
  return abs.replace(/^([A-Za-z]):/, (_m, d) => d.toLowerCase() + ':');
}

/** True iff two paths point at the same file, casing-insensitive on the drive. */
function samePath(a, b) {
  return normalizePath(a) === normalizePath(b);
}

/**
 * Atomically write `content` to `targetPath`, then verify by reading it back
 * through a normalized path and comparing bytes.
 *
 * Throws if the round-trip does not match — so a clobber can NEVER pass silently.
 * Returns { path, normalized, bytes, sha256 } on success.
 */
function writeSceneAtomic(targetPath, content) {
  const abs = path.resolve(targetPath);
  const dir = path.dirname(abs);
  fs.mkdirSync(dir, { recursive: true });

  const buf = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');

  // 1) ATOMIC WRITE: temp file in the SAME dir (so rename stays on one volume).
  const tmp = path.join(
    dir,
    `.${path.basename(abs)}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`
  );

  // Track whether the temp file still exists so ANY failure below cleans it up
  // instead of leaving orphan `.tmp` litter in the chapters directory.
  let tmpExists = false;
  try {
    const fd = fs.openSync(tmp, 'wx');
    tmpExists = true;
    try {
      fs.writeSync(fd, buf, 0, buf.length, 0);
      fs.fsyncSync(fd); // flush the file's bytes to disk before the rename
    } finally {
      fs.closeSync(fd);
    }

    fs.renameSync(tmp, abs); // atomic replace
    tmpExists = false; // the temp name is gone once the rename succeeds

    // 1b) DIRECTORY FSYNC: flush the directory entry so the rename itself is
    // durable across a power loss (the new name must survive, not just bytes).
    // fsyncDir tries 'r+' (works on Windows) then 'r' (POSIX); it returns whether
    // the flush actually succeeded so the result can report real durability.
    const dirDurable = fsyncDir(dir);

    // 2) NORMALIZED-PATH VERIFY: read back through the canonical path, compare bytes.
    const verifyPath = normalizePath(abs);
    const readBack = fs.readFileSync(verifyPath);
    if (readBack.length !== buf.length || !readBack.equals(buf)) {
      throw new Error(
        `write-scene verify FAILED: ${abs}\n` +
          `  wrote ${buf.length} bytes, read back ${readBack.length} via ${verifyPath}`
      );
    }

    return {
      path: abs,
      normalized: verifyPath,
      bytes: buf.length,
      sha256: crypto.createHash('sha256').update(buf).digest('hex'),
      dirDurable, // true iff the containing directory was actually fsync'd
    };
  } catch (err) {
    // ORPHAN CLEANUP: never leave a half-written temp file behind on failure.
    if (tmpExists) {
      try { fs.unlinkSync(tmp); } catch (_) { /* nothing more we can do */ }
    }
    throw err;
  }
}

/**
 * fsync a directory so a create/rename inside it is durable across a power loss
 * (the new dir entry must survive, not just the file's bytes).
 *
 * Opening a directory for fsync is the POSIX idiom. The catch on Windows: a
 * directory opened read-only (`'r'`) throws EPERM on fsync, so the naive POSIX
 * call is a SILENT NO-OP on the very box this tool serves. Empirically, opening
 * the directory READ-WRITE (`'r+'`) lets `fsyncSync` succeed on Windows (it maps
 * to FlushFileBuffers on the directory handle). So we try `'r+'` first, then
 * fall back to `'r'` for POSIX platforms that only permit a read handle.
 *
 * Returns true iff the directory was actually fsync'd; false if no handle/flush
 * combination worked here (genuinely unsupported). Callers may treat false as
 * "atomic rename still holds, but no extra durability was added."
 */
function fsyncDir(dir) {
  // Order matters: 'r+' works for directories on Windows; 'r' is the POSIX idiom.
  for (const flag of ['r+', 'r']) {
    let dfd;
    try {
      dfd = fs.openSync(dir, flag);
    } catch (_) {
      continue; // this flag can't open the dir here — try the next
    }
    try {
      fs.fsyncSync(dfd);
      return true; // the directory entry is now durably flushed
    } catch (_) {
      /* this handle can't be fsync'd — try the next flag */
    } finally {
      try { fs.closeSync(dfd); } catch (_) {}
    }
  }
  return false; // no supported way to fsync a directory on this platform
}

module.exports = { writeSceneAtomic, normalizePath, samePath };

// CLI: node tools/write-scene.js <target> [<sourceFile>]   (else reads stdin)
if (require.main === module) {
  const [, , target, source] = process.argv;
  if (!target) {
    console.error('usage: node tools/write-scene.js <target.md> [source.md]  (stdin if no source)');
    process.exit(2);
  }
  const content = source ? fs.readFileSync(source) : fs.readFileSync(0);
  const res = writeSceneAtomic(target, content);
  console.log(`OK  ${res.bytes} bytes -> ${res.path}`);
  console.log(`    verified via ${res.normalized}`);
  console.log(`    sha256 ${res.sha256}`);
}
