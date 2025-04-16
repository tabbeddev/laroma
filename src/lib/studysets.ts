import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { isLeft } from "fp-ts/Either";

enum Genus {
  Male = "Male",
  Female = "Female",
  Neuter = "Neuter",
}

// Vocabularies

const VocabularyOBJ = t.type({
  original: t.string,
  translation: t.array(t.string),
  additional_info: t.union([t.string, t.undefined]),
  type: t.union([
    t.literal("nouns"),
    t.literal("verbs"),
    t.literal("adjectives"),
    t.literal("others"),
		t.undefined
  ]),
  genitive: t.union([t.string, t.undefined]),
  genus: t.union([t.keyof(Genus), t.undefined]),
  first_prs: t.union([t.string, t.undefined]),
  first_perf: t.union([t.string, t.undefined]),
  conjugation: t.union([t.string, t.undefined]),
  female: t.union([t.string, t.undefined]),
  neuter: t.union([t.string, t.undefined]),
});
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

export const StudySetOBJ = t.type({
  name: t.string,
  description: t.string,
  author: t.string,
  version: t.string,
  url: t.union([t.string, t.undefined]),

  vocabularies: t.union([Vocabularies, t.undefined]),
  practise_sentences: t.union([t.array(Sentence), t.undefined]),
  determine_nouns: t.union([t.array(t.string), t.undefined]),
  determine_verbs: t.union([t.array(t.string), t.undefined]),
  determine_nouns_options: t.union([t.array(t.string), t.undefined]),
  determine_verbs_options: t.union([t.array(t.string), t.undefined]),
});

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
