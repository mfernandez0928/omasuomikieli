import type { RolePlay, SceneGloss } from '@/types';
import { SCENES } from './scenes';
import { GLOSS_BY_FORM, SCENE_LEXICON } from './lexicon';

export { SCENES, SCENE_LEXICON, GLOSS_BY_FORM };

const SCENE_BY_ID = new Map(SCENES.map((s) => [s.id, s]));

export function getScene(id: string): RolePlay | undefined {
  return SCENE_BY_ID.get(id);
}

/** A run of letters carrying a gloss, or the punctuation and spacing between. */
export interface LinePiece {
  text: string;
  gloss?: SceneGloss;
}

/** Splits a line into word and non-word pieces so the UI can make words tappable. */
export function splitLine(fi: string): LinePiece[] {
  const pieces: LinePiece[] = [];
  // Letters form words; punctuation and spacing pass through unchanged.
  for (const chunk of fi.split(/([A-Za-zÅÄÖåäö]+)/)) {
    if (!chunk) continue;
    const gloss = GLOSS_BY_FORM.get(chunk.toLowerCase());
    pieces.push(gloss ? { text: chunk, gloss } : { text: chunk });
  }
  return pieces;
}
