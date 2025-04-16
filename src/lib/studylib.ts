// @ts-nocheck wtf
import type { StudySet, Vocabulary } from "./studysets.ts";

export function mergeVocabs(set: StudySet): Record<string, Vocabulary> {
  const merged = {};

  for (const [s_type, vocabs] of Object.entries(set.vocabularies)) {
    for (const [title, vocab] of Object.entries(vocabs)) {
      merged[title] = { ...vocab, type: s_type };
    }
  }

  return merged;
}
