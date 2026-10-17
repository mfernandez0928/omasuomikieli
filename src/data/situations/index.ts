import type { RolePlay, SceneGloss } from '@/types';
import { SCENES } from './scenes';
import { GLOSS_BY_FORM, SCENE_LEXICON } from './lexicon';

export { SCENES, SCENE_LEXICON, GLOSS_BY_FORM };

export const SCENE_BY_ID = new Map(SCENES.map((s) => [s.id, s]));

export function getScene(id: string): RolePlay | undefined {
  return SCENE_BY_ID.get(id);
}

/** How many choices the learner makes in a scene. */
export function sceneTurnCount(scene: RolePlay): number {
  return scene.turns.length;
}

/**
 * Splits a Finnish line into pieces so the UI can make each word tappable,
 * keeping punctuation and spacing as separate, untappable pieces.
 */
export interface LinePiece {
  text: string;
  gloss?: SceneGloss;
}

export function splitLine(fi: string): LinePiece[] {
  const pieces: LinePiece[] = [];
  // Letters (including Finnish vowels) form words; everything else is kept
  // verbatim so the sentence reads exactly as written.
  for (const chunk of fi.split(/([A-Za-zÅÄÖåäö]+)/)) {
    if (!chunk) continue;
    const gloss = GLOSS_BY_FORM.get(chunk.toLowerCase());
    pieces.push(gloss ? { text: chunk, gloss } : { text: chunk });
  }
  return pieces;
}
