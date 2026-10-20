/**
 * Static content check that runs without a TypeScript runtime.
 *
 * It parses the data files as text and reports the mistakes that are easy to
 * make when adding words and lessons by hand: duplicate ids, duplicate
 * headwords, and cross-references that point at something which no longer
 * exists. The app runs the same checks at runtime (see `validateWords` and the
 * Data audit screen); this script is for the terminal and CI.
 *
 * Run: npm run validate:data
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const wordsDir = join(root, 'src/data/words');
const grammarDir = join(root, 'src/data/grammar');

const read = (file) => readFileSync(file, 'utf8');
const tsFiles = (dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
    .map((f) => join(dir, f));

/** Pulls every `id: '...'` at the top level of an entry object. */
function collectIds(source) {
  return [...source.matchAll(/^\s{2,4}id: '([^']+)'/gm)].map((m) => m[1]);
}

function collectField(source, field) {
  const out = [];
  for (const m of source.matchAll(new RegExp(`${field}: \\[([^\\]]*)\\]`, 'gs'))) {
    for (const r of m[1].matchAll(/'([^']+)'/g)) out.push(r[1]);
  }
  return out;
}

function collectHeadwords(source) {
  return [...source.matchAll(/^\s{4}fi: '((?:[^'\\]|\\.)*)'/gm)].map((m) => m[1]);
}

const problems = [];
const wordIds = new Set();
const headwords = new Map();
const caseVariants = new Map();
const grammarIds = new Set();

for (const file of tsFiles(wordsDir)) {
  const src = read(file);
  const name = file.replace(root + '\\', '').replace(root + '/', '');

  for (const id of collectIds(src)) {
    if (wordIds.has(id)) problems.push(`duplicate word id "${id}" (${name})`);
    wordIds.add(id);
  }
  for (const fi of collectHeadwords(src)) {
    /*
      Case is part of the headword in Finnish: suomi is the language and Suomi
      is the country, englanti and Englanti likewise. So an exact repeat is the
      failure, and a pair that differs only in case is reported below for the
      author to confirm rather than treated as a mistake.
    */
    if (headwords.has(fi)) {
      problems.push(`duplicate headword "${fi}" (${name} and ${headwords.get(fi)})`);
    }
    headwords.set(fi, name);

    const lower = fi.toLowerCase();
    const seen = caseVariants.get(lower);
    if (seen && !seen.includes(fi)) seen.push(fi);
    else if (!seen) caseVariants.set(lower, [fi]);
  }
}

for (const file of tsFiles(grammarDir)) {
  for (const id of collectIds(read(file))) grammarIds.add(id);
}

/*
  Multiple-choice checks. A repeated option renders as two identical buttons
  and makes React drop one of them; an answer that is not among the options
  cannot be chosen at all. Both read fine in the source and are obvious in use.
*/
for (const file of [...tsFiles(grammarDir), join(root, 'src/data/reading.ts')]) {
  const src = read(file);
  const name = file.replace(root + '\\', '').replace(root + '/', '');
  for (const m of src.matchAll(/options: \[([^\]]*)\]/g)) {
    const options = [...m[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((o) => o[1]);
    if (!options.length) continue;
    if (new Set(options).size !== options.length) {
      problems.push(`repeated option in [${options.join(', ')}] (${name})`);
    }
    const tail = src.slice(m.index + m[0].length, m.index + m[0].length + 400);
    const answer = tail.match(/answer: '((?:[^'\\]|\\.)*)'/);
    if (answer && !options.includes(answer[1])) {
      problems.push(`answer "${answer[1]}" is not one of its options (${name})`);
    }
  }
}

/*
  The supplied database is imported under a `db-` prefix at runtime, but only
  where no curated entry already covers the same headword — `importLegacyWords`
  drops the rest. This used to add every id in the file, curated duplicates
  included, so a `related` link to a word that gets merged away passed the check
  here and only failed in the app. It now mirrors the merge.
*/
const legacyRaw = read(join(root, 'src/data/legacy/finnish_learning_database_v0.2.1.js'));
const legacyJson = legacyRaw
  .slice(legacyRaw.indexOf('{'), legacyRaw.lastIndexOf('}') + 1)
  .replace(/;\s*export default[\s\S]*$/, '');

let legacyWords = [];
try {
  legacyWords = JSON.parse(legacyJson).words ?? [];
} catch {
  problems.push('could not parse the supplied v0.2.1 database as JSON');
}

for (const w of legacyWords) {
  if (!headwords.has(w.finnish) && !headwords.has(String(w.finnish ?? '').toLowerCase())) {
    wordIds.add(`db-${w.id}`);
  }
}

for (const file of [...tsFiles(wordsDir), ...tsFiles(grammarDir)]) {
  const src = read(file);
  const name = file.replace(root + '\\', '').replace(root + '/', '');

  for (const ref of [...collectField(src, 'related'), ...collectField(src, 'relatedWords')]) {
    if (!wordIds.has(ref)) problems.push(`"${ref}" is not a known word id (${name})`);
  }
  for (const ref of [...collectField(src, 'grammarRefs'), ...collectField(src, 'relatedGrammar')]) {
    if (!grammarIds.has(ref)) problems.push(`"${ref}" is not a known grammar id (${name})`);
  }
}

/*
  Exercises. Their ids have to be unique across every file, because the runner
  tracks which questions were answered by id, and a `wordId` on a question is a
  link the learner can follow out of it.
*/
const exerciseIds = new Set();
const exerciseFiles = [
  ...tsFiles(grammarDir),
  join(root, 'src/data/reading.ts'),
];
for (const file of exerciseFiles) {
  const src = read(file);
  const name = file.replace(root + '\\', '').replace(root + '/', '');

  for (const m of src.matchAll(/id: '(ex-[^']+)'/g)) {
    if (exerciseIds.has(m[1])) problems.push(`duplicate exercise id "${m[1]}" (${name})`);
    exerciseIds.add(m[1]);
  }
  for (const m of src.matchAll(/wordId: '([^']+)'/g)) {
    if (!wordIds.has(m[1])) problems.push(`"${m[1]}" is not a known word id (${name})`);
  }
  for (const m of src.matchAll(/grammarId: '([^']+)'/g)) {
    if (!grammarIds.has(m[1])) problems.push(`"${m[1]}" is not a known grammar id (${name})`);
  }
}

console.log(
  `known word ids: ${wordIds.size} (curated + imported, before duplicate headwords are merged)`,
);
console.log(`grammar lessons: ${grammarIds.size}`);
console.log(`exercises: ${exerciseIds.size}`);

const pairs = [...caseVariants.values()].filter((v) => v.length > 1);
if (pairs.length) {
  console.log(`
headwords that differ only in case (${pairs.length}) - check each is deliberate:`);
  for (const v of pairs) console.log(`  ${v.join('  /  ')}`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log('No duplicate ids, duplicate headwords or broken cross-references.');
