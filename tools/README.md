# tools/ — safe scene writing

## `write-scene.cjs` — atomic write + normalized-path verify

**The bug it fixes.** On this Windows box, Git-Bash spells paths `/d/projects/...`
while Node's `process.cwd()` reports `D:\projects\...`. The drive letter's **case
differs** (`d:` vs `D:`). Windows' filesystem is case-insensitive, so both point at
the *same* file — but any code that compares path **strings** (a "verify after
write" step, or a build step that de-dupes chapters by raw path) sees two different
files. It concludes the freshly written chapter "isn't there" and re-creates or
truncates it. That is how **Chapter Nine — The Nine Cities** got clobbered.

**The fix, two parts:**

1. **Atomic write** — write to a temp file in the same directory, `fsync`, then
   `rename()` into place. A reader never sees a half-written or zero-byte file.
2. **Normalized-path verify** — after writing, read the file back through a
   canonicalized path (lower-cased drive letter, forward slashes, `realpath`) and
   compare **bytes, not path strings**. Casing can never fool the check again.

### Use it

```bash
# from a source file:
node tools/write-scene.cjs chapters/10-the-long-cold-remembered.md /tmp/draft.md

# or from stdin:
cat draft.md | node tools/write-scene.cjs chapters/10-the-long-cold-remembered.md
```

It prints the bytes written, the **normalized** path it verified through, and a
SHA-256. If the round-trip does not match, it **throws** — a clobber can never pass
silently.

### From code

```js
const { writeSceneAtomic, normalizePath, samePath } = require('./tools/write-scene.cjs');
writeSceneAtomic('chapters/10-....md', text); // atomic + verified, or throws
samePath('d:/a', 'D:/a'); // => true  (casing-insensitive on the drive)
```

### Test

```bash
node test/write-scene.test.cjs
```

Reproduces the casing bug, then proves the fix (5 checks). Never skip a case to go
green.
