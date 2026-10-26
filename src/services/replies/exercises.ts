import type { Exercise, ReplyPair } from '@/types';
import { REPLY_PAIRS } from '@/data/replies';

/**
 * Turns reply pairs into ExerciseRunner exercises.
 *
 * Wrong options come from the same category first, nearest in the dataset's
 * numbering, because a reply from the same kind of conversation is a
 * plausible mistake and one from another is a giveaway. Only when the
 * category runs out do they come from elsewhere.
 */

/** Three texts from other pairs, none equal to the answer or to each other. */
function distractors(
  pair: ReplyPair,
  pool: ReplyPair[],
  text: (p: ReplyPair) => string,
): string[] {
  const fits = new Set(pair.alsoFits ?? []);
  const others = pool
    .filter((p) => p.id !== pair.id && !fits.has(p.num))
    .sort((a, b) => {
      const sameA = a.category === pair.category ? 0 : 1;
      const sameB = b.category === pair.category ? 0 : 1;
      return sameA - sameB || Math.abs(a.num - pair.num) - Math.abs(b.num - pair.num);
    });

  const picked = new Set<string>([text(pair)]);
  for (const p of others) {
    if (picked.size === 4) break;
    picked.add(text(p));
  }
  picked.delete(text(pair));
  return [...picked];
}

/** Alphabetical, so the right answer is not always first. */
function options(answer: string, wrong: string[]): string[] {
  return [answer, ...wrong].sort((a, b) => a.localeCompare(b, 'fi'));
}

/** Mode 1: read the Finnish question, choose the natural Finnish reply. */
export function buildChooseReply(pairs: ReplyPair[], pool: ReplyPair[] = REPLY_PAIRS): Exercise[] {
  // A small pool cannot fill four options, so fall back to the whole set.
  const source = pool.length >= 4 ? pool : REPLY_PAIRS;
  return pairs.map((pair) => ({
    id: `${pair.id}-choose`,
    kind: 'multiple-choice',
    prompt: 'Choose the natural reply',
    question: pair.fi.q,
    options: options(pair.fi.a, distractors(pair, source, (p) => p.fi.a)),
    answer: pair.fi.a,
    explanation: `${pair.en.q} — ${pair.en.a}`,
    explanationTl: `${pair.tl.q} — ${pair.tl.a}`,
  }));
}

/** Mode 4: hear the Finnish reply, choose what it means. */
export function buildListenMeaning(pairs: ReplyPair[], pool: ReplyPair[] = REPLY_PAIRS): Exercise[] {
  const source = pool.length >= 4 ? pool : REPLY_PAIRS;
  return pairs.map((pair) => ({
    id: `${pair.id}-listen`,
    kind: 'multiple-choice',
    prompt: 'Listen. What does it mean?',
    question: '',
    audio: pair.fi.a,
    options: options(pair.en.a, distractors(pair, source, (p) => p.en.a)),
    answer: pair.en.a,
    explanation: pair.fi.a,
    explanationTl: pair.tl.a,
  }));
}
