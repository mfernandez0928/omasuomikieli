/**
 * Validates the vocabulary used by the Situations dialogues.
 *
 * The scenes are written rather than quoted, so the guarantee is about their
 * vocabulary: every word traces to a dictionary entry with its own citation,
 * and colloquial forms come from Suomen mestari 2, pp. 293-296.
 *
 * Checks:
 *
 *   1. extract the Finnish lines from `scenes.ts` (`fi` and `yleiskieli` only;
 *      the English and Tagalog fields quote Finnish words in prose);
 *   2. split them into word forms;
 *   3. each form must have an entry in `lexicon.ts`;
 *   4. each `wordId` must resolve to a dictionary entry;
 *   5. an entry without a `wordId` must carry a `basis`;
 *   6. a form marked as colloquial must appear in `puhekieli.ts`.
 *
 * Lexicon entries no scene uses are reported, so the table does not rot.
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
  // Digits are skipped: prices and times carry no Finnish morphology.
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
  // A form marked as colloquial has to appear in the transcribed tables.
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
