<script lang="ts">
  import { mergeVocabs } from "$lib/studylib";
  import type { StudySet, Vocabulary } from "$lib/studysets";
  import { crossfade } from "svelte/transition";
  import SecondButton from "./components/SecondButton.svelte";
  import { Check, ChevronRight } from "@lucide/svelte";

  function swap(obj: Object): any {
    return Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));
  }

  function getSet(entries: number): Vocabulary[] {
    const e: Vocabulary[] = [];
    const items = Object.values(vocabs);
    while (e.length < entries && e.length !== items.length) {
      const i = items.randomItem();
      if (!e.includes(i)) e.push(i);
    }
    return e;
  }

  function moveTo(target: string): void {
    if (showSolution) return;
    if (selected && !Object.values(matches).includes(target)) {
      matches[selected] = target;
      selected = undefined;
    }
  }

  function moveBack(target: string): void {
    if (showSolution) return;
    for (const [key, value] of Object.entries(matches)) {
      if (value === target) {
        delete matches[key];
        return;
      }
    }
  }

  function createNew(): void {
    matchSet = getSet(hardMode ? 11 : 6);
    matches = {};
    selected = undefined;
    showSolution = false;
  }

  let {
    set,
    hardMode,
  }: {
    set: StudySet;
    hardMode: boolean;
  } = $props();

  const vocabs = mergeVocabs(set);

  let matchSet = $state(getSet(hardMode ? 8 : 5));
  let match1 = $derived(matchSet.toShuffled());

  let matches: Record<string, string> = $state({});
  let swappedMatches: Record<string, string> = $derived(swap(matches));

  let selected: string | undefined = $state();
  let showSolution: boolean = $state(false);

  const [send, receive] = crossfade({ duration: (d) => Math.sqrt(d * 500) });
</script>

<p class="text-2xl third-bg">Ordne den Wörtern die richtige Übersetzung zu:</p>
<div class="centered">
  <table style="min-width: 100vw;">
    <tbody>
      {#each matchSet as entry, index}
        {@const entry1 = match1[index]}
        <tr class="flex justify-between">
          <td>
            {#if !matches[entry.original]}
              <div
                class="second-bg mr-1 text-2xl"
                class:bg-blue-500!={selected === entry.original}
                onclick={() => {
                  selected = entry.original;
                }}
                out:send={{ key: entry.original }}
                in:receive={{ key: swappedMatches[entry.original] }}
              >
                {entry.original}
              </div>
            {/if}
          </td>
          <td>
            <div style="display: block ruby;">
              {#if swappedMatches[entry1.original]}
                <div
                  class="second-bg text-2xl italic"
                  in:receive={{ key: swappedMatches[entry1.original] }}
                  out:send={{ key: matches[entry1.original] }}
                  onclick={() => moveBack(entry1.original)}
                  class:bg-green-800!={showSolution &&
                    entry1.original === swappedMatches[entry1.original]}
                  class:bg-red-800!={showSolution &&
                    entry1.original !== swappedMatches[entry1.original]}
                  class:text-white!={showSolution}
                >
                  {swappedMatches[entry1.original]}
                </div>
              {/if}
              <div
                class="second-bg font-light"
                class:disabled={!selected || swappedMatches[entry1.original]}
                class:text-2xl={!Object.values(matches).includes(
                  entry1.original,
                )}
                onclick={() => moveTo(entry1.original)}
              >
                {entry1.translation.randomItem()}
              </div>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<div class="fixed bottom-0 left-0 w-screen text-2xl">
  {#if showSolution}
    {@const points = Object.entries(matches).reduce(
      (old, [a, b]) => old + (a === b ? 1 : 0),
      0,
    )}
    <div class="second-bg text-base!">
      <p class="text-2xl">Ergebnis:</p>
      <p class="font-bold">{points} / {matchSet.length} Punkte</p>
      {#if points !== matchSet.length}
        <p class="text-2xl">Lösungen:</p>
        <ul class="list-disc list-inside">
          {#each matchSet as entry}
            {#if matches[entry.original] !== entry.original}
              <li>
                {entry.original} wäre "{entry.translation.join(", ")}" gewesen.
              </li>
            {/if}
          {/each}
        </ul>
      {:else}
        <p class="font-bold italic text-center text-2xl">Perfekt!</p>
      {/if}
    </div>
    <SecondButton title="Weiter" Icon={ChevronRight} onclick={createNew} />
  {:else}
    <SecondButton
      title="Fertig"
      Icon={Check}
      onclick={() => {
        showSolution = true;
      }}
      disabled={matchSet.some((entry) => !matches[entry.original])}
    />
  {/if}
</div>
