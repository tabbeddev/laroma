<script lang="ts">
  import type { StudySet, Vocabulary } from "./lib/studysets";
  import { mergeVocabs } from "./lib/studylib";
  import { type SRS, getSRS } from "$lib/srs";
  import { Check, RefreshCw, X } from "@lucide/svelte";

  function convert(type: string): string {
    switch (type) {
      case "nouns":
        return "Nomen";
      case "verbs":
        return "Verb";
      case "adjectives":
        return "Adjektiv";

      case "Male":
        return "Männlich";
      case "Female":
        return "Weiblich";
      case "Neuter":
        return "Neutrum";
    }
    return "--- ERROR ---";
  }

  function _debug(obj: any): typeof obj {
    console.warn(obj);
    return obj;
  }

  function next(knew_it: boolean): void {
    const vocab_name = vocab_data[vocab_index][0];
    if (srs) {
      if (knew_it) {
        srs.progressVocab(studyset, vocab_name);
        msgString = `Bravo! ${vocab_data[vocab_index][1].original} ist jetzt in Runde ${srs.data[studyset][vocab_name].step}`;
      } else {
        srs.resetVocab(studyset, vocab_name);
        msgString = `${vocab_data[vocab_index][1].original} wird wiederholt`;
      }
    }

    if (!knew_it && !shownInfo) {
      notify("Vokabeln, die du nicht wusstest, kommen später noch einmal dran");
      shownInfo = true;
      vocab_data.push(vocab_data[vocab_index]);
    }

    showSolution = false;
    vocab_index++;
  }

  let {
    set,
    notify,
    expressMode,
    studyset,
  }: {
    set: StudySet;
    notify: (message: string) => void;
    expressMode: boolean;
    studyset: string;
  } = $props();

  let vocab_data: [string, Vocabulary][] = $state([]);

  // svelte-ignore non_reactive_update
  let srs: SRS | undefined;

  const merged = mergeVocabs(set);

  if (expressMode) {
    vocab_data = Object.entries(merged).toShuffled();
  } else {
    srs = getSRS();

    for (const vocab of Object.keys(merged)) {
      srs.initVocab(studyset, vocab);
    }
    srs.saveSRS();

    // @ts-ignore
    vocab_data = srs
      .getDueVocabs(studyset)
      .map((voc) => [voc, merged[voc]])
      .toShuffled();
  }

  let vocab_index = $state(0);
  let showSolution = $state(false);
  let msgString: string | undefined = $state();
  let shownInfo = false;
</script>

{#if vocab_index === vocab_data.length}
  <div class="centered">
    {#if srs}
      {@const nextStudy = srs.findNextStudyTime()}
      <h1 class="text-3xl">Du bist fertig für heute!</h1>

      {#if nextStudy[0] !== Infinity}
        <p class="text-light">
          Lerne das nächste Mal am {new Date(nextStudy[0]).toLocaleString(
            undefined,
            {
              weekday: "short",
              day: "numeric",
              month: "long",
            },
          )} "{nextStudy[1]}"
        </p>
      {/if}
    {:else}
      <h1 class="text-3xl">Du bist fertig!</h1>
      <p class="text-light">Dann probiere es doch nochmal im normalen Modus.</p>
    {/if}
  </div>
{:else}
  {@const vocab = vocab_data[vocab_index][1]}
  <div class="third-bg text-center">
    {#if vocab.type && vocab.type !== "others"}
      <p>{convert(vocab.type)}</p>
      <hr />
    {/if}

    <p class="font-bold text-3xl mt-1 mb-1">{vocab.original}</p>

    {#if vocab.additional_info}
      <hr />
      <p>{vocab.additional_info}</p>
    {/if}
  </div>

  {#if showSolution}
    <p class="text-center text-2xl mt-5">Lösung:</p>
    <div class="third-bg text-center">
      <p class="text-2xl">{vocab.translation.join(", ")}</p>

      {#if vocab.genitive && vocab.genus}
        <hr />
        <p>Genitiv: <i>{vocab.genitive}</i></p>
        <p>{convert(vocab.genus)}</p>
      {/if}

      {#if vocab.first_prs && vocab.first_perf && vocab.conjugation}
        <hr />
        <p>1. Person Präsens: <i>{vocab.first_prs}</i></p>
        <p>1. Person Perfekt: <i>{vocab.first_perf}</i></p>
        <hr />
        <p>{vocab.conjugation}</p>
      {/if}

      {#if vocab.female && vocab.neuter}
        <hr />
        <p>Weiblich: <i>{vocab.female}</i></p>
        <p>Neutrum: <i>{vocab.neuter}</i></p>
      {/if}
    </div>
  {/if}

  <div class="fixed bottom-0 left-0 w-screen text-2xl">
    <p class="text-center">{msgString}</p>
    <div
      class="second-bg cursor-pointer flex items-center gap-1"
      class:bg-blue-500!={showSolution}
      class:text-white={showSolution}
      onclick={() => {
        showSolution = !showSolution;
      }}
    >
      <RefreshCw size={40} />
      <p>Lösung anzeigen</p>
    </div>
    <div
      class="second-bg cursor-pointer bg-red-800! text-white flex items-center gap-1"
      onclick={() => {
        next(false);
      }}
    >
      <Check size={40} />
      <p>Wusste ich nicht</p>
    </div>
    <div
      class="second-bg cursor-pointer bg-green-800! text-white flex items-center gap-1"
      onclick={() => {
        next(true);
      }}
    >
      <X size={40} />
      <p>Wusste ich</p>
    </div>
  </div>
{/if}
