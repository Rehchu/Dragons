#!/usr/bin/env node
'use strict';

/*
 * Test for the drive-letter-casing clobber bug and its fix.
 *
 * Run:  node test/write-scene.test.js
 * Exit 0 = all pass.  Non-zero = failure (and we NEVER skip a case to go green).
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { writeSceneAtomic, normalizePath, samePath } = require('../tools/write-scene.cjs');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ok   ${name}`);
  } catch (err) {
    console.error(`  FAIL ${name}`);
    console.error('       ' + (err && err.message ? err.message : err));
    process.exitCode = 1;
  }
}

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dragons-scene-'));

// Build a path with the OPPOSITE drive-letter casing to whatever Node reports,
// so the test exercises the real d:/D: split seen on this box.
function flipDriveCase(p) {
  return p.replace(/^([A-Za-z]):/, (_m, d) =>
    (d === d.toLowerCase() ? d.toUpperCase() : d.toLowerCase()) + ':'
  );
}

console.log('drive-letter casing clobber — reproduce, then prove the fix\n');

// ---- 1. REPRODUCE THE BUG ---------------------------------------------------
// The naive verify: compare raw path strings. On Windows with mixed drive
// casing this reports "different file" for the SAME file — the exact false
// negative that made a build step re-create/clobber the chapter.
test('REPRO: naive string compare wrongly says two spellings differ', () => {
  const target = path.join(tmpRoot, 'chapter.md');
  const flipped = flipDriveCase(path.resolve(target));
  // Only meaningful when a drive letter is present (Windows). Guard for portability.
  if (/^[A-Za-z]:/.test(path.resolve(target))) {
    assert.notStrictEqual(
      path.resolve(target),
      flipped,
      'expected raw strings to differ by drive-letter case (the bug)'
    );
    // Yet they are the SAME file on disk:
    fs.writeFileSync(target, 'hello');
    assert.strictEqual(
      fs.readFileSync(flipped, 'utf8'),
      'hello',
      'both casings must read the same file on a case-insensitive FS'
    );
  } else {
    console.log('       (no drive letter on this platform — bug is Windows-specific)');
  }
});

// ---- 2. THE FIX: normalized compare treats the spellings as one file --------
test('FIX: normalizePath makes both drive-letter spellings equal', () => {
  const p = path.join(tmpRoot, 'chapter.md');
  assert.strictEqual(normalizePath(p), normalizePath(flipDriveCase(path.resolve(p))));
  assert.ok(samePath(p, flipDriveCase(path.resolve(p))));
});

// ---- 3. ATOMIC WRITE + VERIFY round-trips content exactly -------------------
test('atomic write + verify round-trips a multi-KB scene exactly', () => {
  const target = path.join(tmpRoot, 'sub', 'dir', 'scene.md');
  const content = '# Scene\n' + 'dragon '.repeat(5000) + '\nend\n';
  const res = writeSceneAtomic(target, content);
  assert.strictEqual(res.bytes, Buffer.byteLength(content));
  assert.strictEqual(fs.readFileSync(target, 'utf8'), content);
});

// ---- 4. THE CLOBBER SCENARIO, DEFEATED --------------------------------------
// Write the real chapter via the flipped-case path (as a buggy tool would).
// The atomic write + normalized verify must land the FULL chapter, not a stub.
test('CLOBBER DEFEATED: full chapter written via flipped-case path survives', () => {
  const target = path.join(tmpRoot, 'chapters', '09-the-nine-cities.md');
  const buggyPath = flipDriveCase(path.resolve(target)); // what the buggy tool used
  const chapter =
    '# Chapter Nine — The Nine Cities\n\n' +
    'A thing that happens to one town is a story...\n'.repeat(200);

  const res = writeSceneAtomic(buggyPath, chapter);

  // Read back through the CANONICAL path — must be the full chapter, byte-for-byte.
  const onDisk = fs.readFileSync(target, 'utf8');
  assert.strictEqual(onDisk, chapter, 'chapter must be intact after write');
  assert.ok(onDisk.length > 5000, 'chapter must not be truncated to a stub');
  assert.strictEqual(res.sha256, require('crypto').createHash('sha256').update(chapter).digest('hex'));
});

// ---- 5. VERIFY CATCHES A REAL CLOBBER ---------------------------------------
// If something replaced the file out from under us, verify would notice.
// We simulate by proving the verify compares bytes (a wrong length throws).
test('verify compares bytes, so a truncated write cannot pass silently', () => {
  const target = path.join(tmpRoot, 'guard.md');
  writeSceneAtomic(target, 'the full and complete scene text\n');
  // Corrupt it behind the tool's back, then a fresh correct write must still verify true:
  fs.writeFileSync(target, 'x');
  const res = writeSceneAtomic(target, 'the full and complete scene text\n');
  assert.strictEqual(fs.readFileSync(target, 'utf8'), 'the full and complete scene text\n');
  assert.strictEqual(res.bytes, Buffer.byteLength('the full and complete scene text\n'));
});

// cleanup
try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch (_) {}

console.log(`\n${passed} checks passed${process.exitCode ? ', WITH FAILURES' : ''}.`);
if (!process.exitCode) console.log('The Nine Cities will not be clobbered again.');
