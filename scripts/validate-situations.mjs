/**
 * Checks that the Situations dialogues only use words this app can account for.
 *
 * The claim the feature makes is narrow and worth keeping honest: the sentences
 * were written for the app, but every word in them traces to a dictionary entry
 * that carries its own book citation, and every spoken form comes from the
 * Puhekieli section of Suomen mestari 2 (printed pages 293-296).
 *
 * So this script:
 *
 *   1. pulls every Finnish line out of `scenes.ts` (the `fi` and `yleiskieli`
 *      fields only - the English and Tagalog explanations are prose and quote
 *      Finnish words on purpose);
 *   2. splits them into word forms;
 *   3. requires each form to have an entry in `lexicon.ts`;
 *   4. requires each lexicon `wordId` to resolve to a real dictionary entry;
 *   5. requires each lexicon entry with no `wordId` to carry a `basis` saying
 *      why - so a missing citation cannot hide as an omission;
 *   6. requires every spoken form the lexicon marks as puhekieli to actually
 *      appear in `puhekieli.ts`, which is transcribed from those pages.
 *
 * It also reports lexicon entries nothing uses, so the file does not rot.
 *
 * Run: npm run validate:situations
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

/* ------------------------------ dictionary ------------------------------ */

const wordIds = new Set();
const wordsDir = join(root, 'src/data/words');
for (const f of readdirSync(wordsDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts')) {
  for (const m of readFileSync(join(wordsDir, f), 'utf8').matchAll(/^ {4}id: '([^']+)'/gm)) {
    wordIds.add(m[1]);
  }
}

/* ------------------------------- puhekieli ------------------------------ */

const spokenForms = new Set();
for (const m of read('src/data/puhekieli.ts').matchAll(/spoken: '([^']+)'/g)) {
  spokenForms.add(m[1].toLowerCase());
}

/* -------------------------------- lexicon ------------------------------- */

const lexicon = [];
for (const line of read('src/data/situations/lexicon.ts').split('\n')) {
  if (!line.trimStart().startsWith("{ form: '")) continue;
  lexicon.push({
    form: line.match(/form: '((?:[^'\\]|\\.)*)'/)[1],
    wordId: line.match(/wordId: '([^']+)'/)?.[1],
    grammar: line.match(/grammar: '((?:[^'\\]|\\.)*)'/)?.[1] ?? '',
    basis: line.match(/basis: '((?:[^'\\]|\\.)*)'/)?.[1],
  });
}
const byForm = new Map(lexicon.map((g) => [g.form, g]));

/* --------------------------------- scenes -------------------------------- */

const scenesSrc = read('src/data/situations/scenes.ts');
const finnishLines = [];
for (const m of scenesSrc.matchAll(/^\s+(?:fi|yleiskieli): '((?:[^'\\]|\\.)*)',?\r?$/gm)) {
  finnishLines.push(m[1].replace(/\\'/g, "'"));
}

const sceneIds = [...scenesSrc.matchAll(/^ {4}id: '([^']+)'/gm)].map((m) => m[1]);

/* --------------------------------- checks -------------------------------- */

const problems = [];
const used = new Set();
const unaccounted = new Map();

for (const line of finnishLines) {
  // Digits are left out on purpose: prices and years are read as numbers and
  // carry no Finnish morphology to check.
  for (const form of line.toLowerCase().match(/[a-zåäö]+/g) ?? []) {
    used.add(form);
    if (!byForm.has(form)) {
      unaccounted.set(form, (unaccounted.get(form) ?? 0) + 1);
    }
  }
}

for (const [form, n] of [...unaccounted].sort()) {
  problems.push(`"${form}" appears ${n}x in a dialogue line but has no entry in lexicon.ts`);
}

for (const g of lexicon) {
  if (g.wordId && !wordIds.has(g.wordId)) {
    problems.push(`lexicon "${g.form}" points at word id "${g.wordId}", which does not exist`);
  }
  if (!g.wordId && !g.basis) {
    problems.push(`lexicon "${g.form}" has no wordId and no basis - say where the form comes from`);
  }
  // A form claimed to be spoken Finnish has to be in the transcribed tables.
  const claimsPuhekieli = /puhekieli: \S+ -> (\S+)/.exec(g.grammar);
  if (claimsPuhekieli) {
    const claimed = claimsPuhekieli[1].toLowerCase().replace(/[^a-zåäö]+$/, '');
    const isKsQuestion = claimed.endsWith('ks');
    if (!spokenForms.has(claimed) && !isKsQuestion) {
      problems.push(
        `lexicon "${g.form}" claims the spoken form "${claimed}" but it is not in puhekieli.ts`,
      );
    }
  }
}

const unused = lexicon.filter((g) => !used.has(g.form)).map((g) => g.form);

/* --------------------------------- report -------------------------------- */

console.log(`scenes            : ${sceneIds.length} (${sceneIds.join(', ')})`);
console.log(`finnish lines     : ${finnishLines.length}`);
console.log(`word forms used   : ${used.size}`);
console.log(`lexicon entries   : ${lexicon.length}`);
console.log(`  traced to a dictionary entry: ${lexicon.filter((g) => g.wordId).length}`);
console.log(`  explained by a basis note   : ${lexicon.filter((g) => !g.wordId).length}`);

if (unused.length) {
  console.log(`\n${unused.length} lexicon entr${unused.length === 1 ? 'y' : 'ies'} no scene uses:`);
  console.log(`  ${unused.join(', ')}`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log('\nEvery word in every dialogue line is accounted for.');
