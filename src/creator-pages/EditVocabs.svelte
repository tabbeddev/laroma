<script module lang="ts">
  export enum PopupState {
    Closed,
    AddMenu,
    AddNoun,
    AddVerb,
    AddAdjective,
    AddOther,
  }
</script>

<script lang="ts">
  import type { StudySet, Vocabulary } from "$lib/studysets";
  import { ChevronLeft, Plus } from "@lucide/svelte";
  import SecondButton from "../components/SecondButton.svelte";
  import VocabList from "../components/VocabList.svelte";
  import CreateVocab from "./CreateVocab.svelte";

  function create(
    original: string,
    translations: string[],
    additional: string,
		keyclosed: boolean,
    genitive?: string,
    genus?: string,
    female?: string,
    neuter?: string,
    first_prs?: string,
    first_perf?: string,
    conjugation?: string,
  ): void {
		if (!editingSet.vocabularies) return;
		const type = getTypeByState();
		const object = Object.fromEntries(Object.entries({original, translation: translations, additional_info: additional, genitive, genus, conjugation, female, first_perf, first_prs, neuter} as Vocabulary).filter(([key, value]) => value)) as Vocabulary;
		
		editingSet.vocabularies[type][original] = object;

		popup = keyclosed ? PopupState.AddMenu : PopupState.Closed;
	}

	function getTypeByState() {
		switch (popup) {
			case PopupState.AddAdjective: return "adjectives";
			case PopupState.AddNoun: return "nouns";
			case PopupState.AddVerb: return "verbs";
		}
		return "others"
	}

  const { editingSet = $bindable(), close }: { editingSet: StudySet; close: Function } =
    $props();

  let popup = $state(PopupState.Closed);
</script>

<div class="overflow-y-scroll h-screen">
  <SecondButton Icon={ChevronLeft} title="Zurück zum Lernset" onclick={close} />
  <SecondButton
    Icon={Plus}
    title="Neue Vokabel erstellen"
    onclick={() => {
      popup = PopupState.AddMenu;
    }}
  />
  <h1 class="text-2xl underline">Vokabeln:</h1>
  <VocabList {editingSet} />
</div>

{#if popup !== PopupState.Closed}
  <div class="bg-black opacity-50 fixed top-0 left-0 w-screen h-screen"></div>
  <div
    class="bg-[rgba(200,200,200,0.5)] backdrop-blur-md fixed top-1/2 left-1/2 -translate-1/2 w-[90vw] h-[90vh] rounded-2xl p-2 text-white"
  >
    {#if popup === PopupState.AddMenu}
      <h1 class="text-2xl font-medium">Vokabel erstellen</h1>
      <button
        type="button"
        onclick={() => {
          popup = PopupState.AddNoun;
        }}>Nomen</button
      >
      <button
        type="button"
        onclick={() => {
          popup = PopupState.AddVerb;
        }}>Verb</button
      >
      <button
        type="button"
        onclick={() => {
          popup = PopupState.AddAdjective;
        }}>Adjektiv</button
      >
      <button
        type="button"
        onclick={() => {
          popup = PopupState.AddOther;
        }}>Sonstiges</button
      >
    {:else if [PopupState.AddAdjective, PopupState.AddNoun, PopupState.AddOther, PopupState.AddVerb].includes(popup)}
      <CreateVocab {popup} {create} />
    {/if}
    <button
      type="button"
      class="mt-5!"
      onclick={() => {
        popup = PopupState.Closed;
      }}>Abbrechen</button
    >
  </div>
{/if}
