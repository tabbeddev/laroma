<script lang="ts">
  import ArrayEdit from "../components/ArrayEdit.svelte";
  import { PopupState } from "./EditVocabs.svelte";

  const { popup, create }: { popup: PopupState; create: Function } = $props();

  function onsubmit(e?: Event, keyclosed?: boolean): void {
    if (e) e.preventDefault();
    if (translations.length === 0) return;
    create(
      original,
      translations,
      additional,
      Boolean(keyclosed),
      genitive,
      genus,
      female,
      neuter,
      first_prs,
      first_perf,
      conjugation,
    );
  }

  function onkeydown(e: KeyboardEvent): void {
    if (e.ctrlKey && e.code === "Enter") {
      return onsubmit(undefined, true);
    } else if (e.code === "Enter") {
      e.preventDefault();
      return;
    }
  }

  let original: string = $state("");
  let translations: string[] = $state([]);

  let genitive: string | undefined = $state();
  let genus: string | undefined = $state();

  let female: string | undefined = $state();
  let neuter: string | undefined = $state();

  let first_prs: string | undefined = $state();
  let first_perf: string | undefined = $state();
  let conjugation: string | undefined = $state();

  let additional: string = $state("");
</script>

<h1 class="text-2xl font-medium">Vokabel erstellen</h1>
<form {onsubmit}>
  <input
    {onkeydown}
    type="text"
    required
    placeholder="Vokabel"
    bind:value={original}
  />
  <ArrayEdit
    bind:items={translations}
    placeholder="Übersetzungsmöglichkeit eingeben..."
  />

  {#if popup === PopupState.AddNoun}
    <input
      {onkeydown}
      type="text"
      required
      placeholder="Genitiv-Form"
      bind:value={genitive}
    />
    <select required name="genus" bind:value={genus}>
      <option disabled value="" selected>Bitte Geschlecht auswählen</option>
      <option value="Male">Männlich</option>
      <option value="Female">Weiblich</option>
      <option value="Neuter">Neutrum</option>
    </select>
  {:else if popup === PopupState.AddAdjective}
    <input
      {onkeydown}
      type="text"
      required
      placeholder="Weibliche Form"
      bind:value={female}
    />
    <input
      {onkeydown}
      type="text"
      required
      placeholder="Neutrum Form"
      bind:value={neuter}
    />
  {:else if popup === PopupState.AddVerb}
    <input
      {onkeydown}
      type="text"
      required
      placeholder="Form: 1. Person - Präsens"
      bind:value={first_prs}
    />
    <input
      {onkeydown}
      type="text"
      required
      placeholder="Form: 1. Person - Perfekt"
      bind:value={first_perf}
    />
    <input
      {onkeydown}
      type="text"
      required
      placeholder="Konjugationsname"
      bind:value={conjugation}
    />
  {/if}
  <input
    {onkeydown}
    type="text"
    placeholder="Sonstige Infos"
    bind:value={additional}
  />
  <button type="submit">Erstellen</button>
  <p>
    Tip: Auf Erstellen klicken, erstellt die Vokabel und schließt das Fenster.
    Aber Strg+Enter erstellt die Vokabel und kehrt zum Erstellungsfenster
    zurück.
  </p>
</form>
