#!/usr/bin/env node
/*
 * ch01-revision.test.cjs
 *
 * Locks in the Chapter One revision from docs/REVISION-BRIEF-CH01.md so it
 * cannot silently regress. The brief asks for three moves and forbids several
 * others; this check asserts each one against the actual manuscript bytes.
 *
 * Run: node test/ch01-revision.test.cjs
 *
 * It is a content contract, not a code test. If a future edit loosens the
 * chronicle voice or un-promotes Peryn, this fails loudly and on purpose.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CH01 = fs.readFileSync(path.join(ROOT, 'chapters', '01-the-ashford-breach.md'), 'utf8');
const CH02 = fs.readFileSync(path.join(ROOT, 'chapters', '02-the-taking-of-the-wyrm.md'), 'utf8');

let failures = 0;
function ok(label, cond) {
  const mark = cond ? 'ok  ' : 'FAIL';
  if (!cond) failures++;
  console.log(`  ${mark} ${label}`);
}
function words(s) {
  return (s.trim().match(/\S+/g) || []).length;
}

console.log('\nChapter One revision — the brief, made checkable\n');

// 1. Peryn gets a real entrance, not a dash-clause aside.
ok('Peryn is introduced as a person ("His name was Peryn.")',
  /His name was Peryn\./.test(CH01));
ok('Peryn beat keeps the survivor\'s dialogue verbatim',
  /They were an \*introduction\*\./.test(CH01));
ok('Peryn beat keeps the best gesture ("underlined it twice")',
  /underlined it twice/.test(CH01));
ok('Peryn beat carries motive: why the Archive sent the junior',
  /was not senior/.test(CH01) && /Archive/.test(CH01));

// 2. The young outrider is named Aldric at the hollow.
ok('Aldric ban Sorel is named in Chapter One',
  /Aldric ban Sorel/.test(CH01));
const hollowIdx = CH01.indexOf('clean cold hollow');
const aldricIdx = CH01.indexOf('Aldric ban Sorel');
ok('Aldric is named in the closing "Ash Settles" movement (near the hollow)',
  aldricIdx > -1 && hollowIdx > -1 && Math.abs(aldricIdx - hollowIdx) < 1600);
ok('Aldric is "afraid... of the right thing" at the hollow',
  /afraid, and he did not yet know it, of the right thing/.test(CH01));

// 3. The boy, the spearman, and the twelve stay nameless.
ok('Boy\'s thesis line is intact (anonymity as a statement)',
  /His name does not matter to the histories and it will not be recorded here/.test(CH01));
ok('The first spearman stays "named in no record"',
  /a man named in no record/.test(CH01));
ok('The garrison stays a number ("twelve men of the border levy")',
  /twelve men of the border levy/.test(CH01));

// 4. Voice / structure preserved: headings and the closing italic tease.
for (const h of ['## The Egg', '## What Came Before', '## The Three Words', '## The Ash Settles']) {
  ok(`heading preserved: "${h}"`, CH01.includes(h));
}
ok('closing italic tease is intact ("So begins the saga.")',
  /\*So begins the saga\./.test(CH01));

// 5. Word budget: the brief targets 2,500–2,700 and forbids passing 3,000.
const w = words(CH01);
ok(`word count in target band 2500–2700 (actual ${w})`, w >= 2500 && w <= 2700);
ok(`word count under the 3000 hard ceiling (actual ${w})`, w < 3000);

// 6. Chapter Two links the two sightings without rewriting its opening line.
ok('Ch.2 opening line is untouched',
  /His name was Aldric ban Sorel, and this was the first time he saw it\./.test(CH02));
ok('Ch.2 adds the clause tying back to the Ashford hollow',
  /riding as one of the outriders/.test(CH02) && /swept and empty hollow/.test(CH02));
ok('Ch.2 keeps the two sightings distinct ("It was not the first time it had frightened him")',
  /It was not the first time it had frightened him/.test(CH02));

// 7. Anonymity discipline: no NEW anonymous stand-in smuggled in for Aldric.
// After the revision, the outrider passages should name Aldric, not float an
// extra "a young one" placeholder alongside him.
ok('no leftover un-named "young one" outrider standing beside the named Aldric',
  !/a young one, knelt at the edge/.test(CH01));

// 8. The brief's "What NOT to do" list — the refusals that make the chapter work.
// These guard against a well-meaning future edit quietly bolting on the very
// things the brief forbids. The prose honours all of them today; lock it in.
ok('no prologue or dramatis-personae page bolted on',
  !/^\s*(prologue|dramatis personae|cast of characters)\b/im.test(CH01));
ok('chapter does not open on Aldric waking up (opens on the boy and the egg)',
  /^The boy found it\./m.test(CH01) &&
  !/Aldric[^.]*\b(woke|awoke|opened his eyes)\b/i.test(CH01));
ok('the three words are never spelled out (the refusal is the promise)',
  !/the three words were[:\s]|the words were:/i.test(CH01) &&
  /she would not repeat the three words/.test(CH01));

console.log('');
if (failures) {
  console.log(`${failures} check(s) FAILED — the Ch.01 revision has regressed against its brief.\n`);
  process.exit(1);
}
console.log('All Chapter One brief constraints hold. Peryn has his entrance; Aldric has his name; the boy keeps his silence.\n');
