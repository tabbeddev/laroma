<script lang="ts">
  import type { StudySet } from "$lib/studysets";
  import { Check, ChevronRight } from "@lucide/svelte";
  import SecondButton from "./components/SecondButton.svelte";

  function transformSentence(orig: string[]): string {
    return orig
      .join(" ")
      .replaceAll(" .", ".")
      .replaceAll(". !", "!")
      .replaceAll(" ?", "?")
      .replaceAll(" ;", ";")
      .replaceAll(" ,", ",");
  }

  function checkKey(e: KeyboardEvent) {
    if (e.code === "Enter") checkSentence(sentences[sentence_index]);
  }

  function next() {
    hasTranslated = undefined;
    translated = "";
    sentence_index++;
  }

  function checkSentence(sentence: (typeof sentences)[0]) {
    const solution = transformSentence(sentence.translation);
    if (hardMode) {
      return (hasTranslated = translated?.trim() === solution);
    } else {
      return (hasTranslated =
        translated?.toLowerCase().trim() === solution.toLowerCase());
    }
  }

  let { set, hardMode }: { set: StudySet; hardMode: boolean } = $props();

  let hasTranslated: boolean | undefined = $state();
  let translated: string | undefined = $state();

  const sentences = set.practise_sentences?.toShuffled() || [];
  let sentence_index = $state(0);
</script>

{#if sentence_index === sentences.length}
  <div class="centered">
    <h1 class="text-3xl">Du bist fertig!</h1>
    <p class="text-light">Gut gemacht!</p>
  </div>
{:else}
  {@const sentence = sentences[sentence_index]}

  <div class="third-bg text-center">
    <p class="font-bold text-2xl underline">Übersetze:</p>
    <p class="text-2xl">{sentence.original}</p>
  </div>

  <input type="text"
    placeholder="Gebe hier die Übersetzung ein..."
    bind:value={translated}
    disabled={hasTranslated !== undefined}
    onkeydown={checkKey}
  />

  {#if hasTranslated !== undefined}
    {@const solution = transformSentence(sentence.translation)}

    <SecondButton title="Weiter" Icon={ChevronRight} onclick={next} />

    <div
      class="second-bg"
      class:bg-green-800!={hasTranslated}
      class:text-white={hasTranslated}
    >
      <p class="font-bold text-2xl">
        {hasTranslated ? "Richtig!" : "Noch nicht ganz..."}
      </p>
      {#if !hasTranslated}
        <div>
          <p>Richtig wäre:</p>
          <p class="italic">{solution}</p>
        </div>
      {/if}

      {#if translated?.trim() !== solution}
        {#if hasTranslated}
          <p>
            <i>...aber:&nbsp;</i>Beachte auch die Groß- und Kleinschreibung!
          </p>
        {:else if hardMode}
          <br />
          <p>
            <strong>Hinweis:&nbsp;</strong>Da du im schweren Modus bist, wird
            Groß- und Kleinschreibung auch beachtet.
          </p>
        {/if}
      {/if}
    </div>
  {:else}
    <SecondButton
      title="Fertig!"
      Icon={Check}
      disabled={(translated ?? "") === ""}
      onclick={() => {
        checkSentence(sentence);
      }}
    />
  {/if}
{/if}
