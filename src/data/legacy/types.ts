/**
 * Shape of the supplied `finnish_learning_database_v0.2.1.js`.
 *
 * The original file is kept verbatim in this folder as the record of what was
 * provided. Nothing reads it directly except `legacy-adapter.ts`, which
 * converts and audits it into the app's own schema.
 */

export interface LegacyWord {
  id: string;
  finnish: string;
  english: string;
  tagalog: string;
  word_type: string;
  vartalo?: string;
  verbityyppi?: number;
  level: string;
  topic: string;
  forms?: Record<string, string>;
  example: string;
  example_english: string;
  example_tagalog: string;
  related_words?: string[];
  rections?: unknown;
  source_book?: string;
  source_chapter?: string;
  notes?: string;
}

export interface LegacyGrammar {
  id: string;
  title: string;
  level: string;
  topic: string;
  rule: string;
  examples: string[];
}

export interface LegacyTopic {
  id: string;
  name_fi: string;
  name_en: string;
  name_tl: string;
}

export interface LegacyDatabase {
  version: string;
  app: string;
  purpose: string;
  language_support: string[];
  note: string;
  stats: { words: number; grammar_items: number };
  words: LegacyWord[];
  grammar: LegacyGrammar[];
  topics: LegacyTopic[];
  schema: {
    required_word_fields: string[];
    optional_fields: string[];
    note: string;
  };
}
