<script lang="ts">
  import { mergeVocabs } from "$lib/studylib";
  import type { StudySet, Vocabulary } from "$lib/studysets";
  import { Trash2 } from "@lucide/svelte";
  import { scale } from "svelte/transition";

  function search(
    editingSet: StudySet,
    searchTerm?: string,
  ): [string, Vocabulary][] {
    let result = Object.entries(mergeVocabs(editingSet));
    if (searchTerm && searchTerm !== "") {
      result = result.filter(
        ([_, value]) =>
          value.original.includes(searchTerm) ||
          value.translation.map((e) => e.includes(searchTerm)).includes(true),
      );
    }

    return result;
  }

  const { editingSet }: { editingSet: StudySet } = $props();
  let searchTerm: string | undefined = $state();

  let results: ReturnType<typeof search> = $derived(
    search(editingSet, searchTerm),
  );
</script>

<input type="text" bind:value={searchTerm} placeholder="Suche nach Vokabeln" />
{#if results.length > 0}
  {#each results as [key, vocab]}
    <div class="third-bg flex mb-1! p-0! items-center" in:scale out:scale>
      <Trash2
        size={32}
        onclick={() => {
          vocab.type &&
            editingSet?.vocabularies &&
            delete editingSet?.vocabularies[vocab.type][key as string];
        }}
				class="shrink-0"
      />

      <p>
        <span class="text-2xl"
          >{vocab.original} => {vocab.translation.join(", ")}</span
        >
        (Typ: {vocab.type}) ({vocab.type === "nouns"
          ? `${vocab.genus} - ${vocab.genitive}`
          : ""}
        {vocab.type === "adjectives" ? `${vocab.female} - ${vocab.neuter}` : ""}
        {vocab.type === "verbs"
          ? `${vocab.first_prs}, ${vocab.first_perf} - ${vocab.conjugation}`
          : ""}) ({vocab.additional_info})
      </p>
    </div>
  {/each}
{:else}
  <p>
    {searchTerm || false
      ? "Kein Ergebnis gefunden"
      : "Keine Vokabeln hinzugefügt"}
  </p>
{/if}
