import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { isLeft } from "fp-ts/Either";

export enum Genus {
  Male = "Male",
  Female = "Female",
  Neuter = "Neuter",
}

// Vocabularies

const VocabularyOBJ = t.intersection([
  t.type({
    original: t.string,
    translation: t.array(t.string),
    additional_info: t.union([t.string, t.null]),
    type: t.union([
      t.literal("nouns"),
      t.literal("verbs"),
      t.literal("adjectives"),
      t.literal("others"),
      t.undefined,
    ]),
  }),
  t.partial({
    genitive: t.string,
    genus: t.keyof(Genus),
    first_prs: t.string,
    first_perf: t.string,
    conjugation: t.string,
    female: t.string,
    neuter: t.string,
  }),
]);
export type Vocabulary = t.TypeOf<typeof VocabularyOBJ>;

const Noun = t.intersection([
  VocabularyOBJ,
  t.type({
    genitive: t.string,
    genus: t.keyof(Genus),
  }),
]);

const Verb = t.intersection([
  VocabularyOBJ,
  t.type({
    first_prs: t.string,
    first_perf: t.string,
    conjugation: t.string, // Can't use enum, because then i must add any conjugation from any language
  }),
]);

const Adjective = t.intersection([
  VocabularyOBJ,
  t.type({
    female: t.string,
    neuter: t.string,
  }),
]);

const Vocabularies = t.type({
  nouns: t.record(t.string, Noun),
  verbs: t.record(t.string, Verb),
  adjectives: t.record(t.string, Adjective),
  others: t.record(t.string, VocabularyOBJ),
});

// Practise

const Sentence = t.type({
  original: t.string,
  translation: t.array(t.string),
  distractions: t.array(t.string),
});

// StudySet

export const StudySetOBJ = t.intersection([
  t.type({
    name: t.string,
    description: t.string,
    author: t.string,
    version: t.string,
  }),
  t.partial({
    url: t.string,

    vocabularies: Vocabularies,
    practise_sentences: t.array(Sentence),
    determine_nouns: t.array(t.string),
    determine_verbs: t.array(t.string),
    determine_nouns_options: t.array(t.string),
    determine_verbs_options: t.array(t.string),
  }),
]);

export type StudySet = t.TypeOf<typeof StudySetOBJ>;

export function isStudySet(data: unknown): [false, string] | [true, StudySet] {
  const decoded = StudySetOBJ.decode(data);
  if (isLeft(decoded)) {
    return [
      false,
      "Could not validate: " + PathReporter.report(decoded).join("\n"),
    ];
  } else {
    return [true, decoded.right];
  }
}
