// @ts-expect-error - the supplied database is plain JS and is kept verbatim.
import { finnishLearningData } from './finnish_learning_database_v0.2.1.js';
import type { LegacyDatabase } from './types';

export const LEGACY_DB = finnishLearningData as LegacyDatabase;
export type { LegacyDatabase, LegacyWord, LegacyGrammar, LegacyTopic } from './types';
