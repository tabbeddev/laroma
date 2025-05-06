<script lang="ts">
  import { fade } from "svelte/transition";
  import SecondButton from "./components/SecondButton.svelte";
  import type { SetManager } from "$lib/setManager.svelte";
  import {
    ChevronLeft,
    ClipboardIcon,
    CreditCard,
    FilePlus,
    Upload,
    X,
  } from "@lucide/svelte";
  import type { StudySet } from "$lib/studysets";

  enum State {
    Intro,
    Home,
    Create,
    Import,
    Edit,
    EditVocabs,
  }

  function createSet(e: Event): void {
    e.preventDefault();
    editingSet = {
      author: (
        document.querySelector('input[name="c-author"]') as HTMLInputElement
      ).value,
      name: (document.querySelector('input[name="c-name"]') as HTMLInputElement)
        .value,
      description: (
        document.querySelector(
          'input[name="c-description"]',
        ) as HTMLInputElement
      ).value,
      version: (
        document.querySelector('input[name="c-version"]') as HTMLInputElement
      ).value,
      vocabularies: { nouns: {}, adjectives: {}, others: {}, verbs: {} },
    };
    appState = State.Edit;
  }

  async function importFile(e: Event): Promise<void> {
    e.preventDefault();
    function fail() {
      notify(
        "Das ist kein valides Lernset. Bitte beachte, dass Lernset entschlüsseln noch nicht unterstützt ist.",
      );
    }

    const files = (document.getElementById("c-import") as HTMLInputElement)
      .files;
    if (files !== null) {
      try {
        editingSet = JSON.parse(await files[0].text()) as StudySet;

        if (
          !editingSet.name ||
          !editingSet.description ||
          !editingSet.author ||
          !editingSet.version
        )
          return fail();
      } catch {
        return fail();
      }
      appState = State.Edit;
    }
  }

  const {
    close,
    set,
    notify,
  }: { close: Function; set: SetManager; notify: (message: string) => void } =
    $props();

  let appState = $state(State.Intro);
  let editingSet: StudySet | undefined = $state();
</script>

<bg
  class="sparkles"
  out:fade={{ duration: 500 }}
  class:change-bg={appState === State.Intro}
  class:creator-fresh={[State.Home, State.Create].includes(appState)}
  class:creator-pale={![State.Home, State.Intro, State.Create].includes(
    appState,
  )}
  onclick={() => {
    if (appState === State.Intro) appState = State.Home;
  }}
>
  {#if appState === State.Intro}
    <div class="centered flex min-w-fit! items-end gap-1">
      <h1 class="text-5xl text-cyan-100 from-purple">lAroma</h1>
      <span
        class="text-2xl text-cyan-100 intro2"
        onanimationend={() => {
          setTimeout(() => {
            appState = State.Home;
          }, 750);
        }}
      >
        Lernset Creator
      </span>
    </div>
  {:else if appState === State.Home}
    <div class="centered" in:fade>
      <h1 class="text-3xl font-bold text-white">lAroma Lernset Creator</h1>
      <p class="text-white">Wähle eine Option aus:</p>
      <SecondButton
        onclick={() => {
          appState = State.Create;
        }}
        title="Neu"
        Icon={FilePlus}
        subtitle="Erstelle ein neues Lernset"
      />
      <SecondButton
        onclick={() => {
          (document.getElementById("c-import") as HTMLInputElement).click();
        }}
        title="Öffnen"
        Icon={Upload}
        subtitle="Lade ein bestehendes Lernset hoch"
      />
      <SecondButton
        onclick={() => {
          appState = State.Import;
        }}
        title="Importieren"
        Icon={ClipboardIcon}
      />
      <SecondButton
        onclick={close}
        title="Beenden"
        Icon={X}
        subtitle="Zurück zu lAroma"
      />
    </div>
    <input
      type="file"
      id="c-import"
      style="display: none;"
      onchange={importFile}
      accept="text/json"
    />
  {:else if appState === State.Create}
    <div class="centered" in:fade>
      <p class="text-2xl">Lernset erstellen:</p>
      <form onsubmit={createSet}>
        <input type="text" name="c-name" placeholder="Lernset Name" required />
        <input type="text" name="c-author" placeholder="Ersteller" required />
        <input type="text" name="c-version" placeholder="Version" required />
        <input
          type="text"
          name="c-description"
          placeholder="Beschreibung"
          required
        />
        <button type="submit">Fertig</button>
      </form>
    </div>
  {:else if appState === State.Edit && editingSet}
    <div class="centered" in:fade>
      <p class="text-2xl font-medium">{editingSet.name}</p>
      <p>
        {editingSet.description} [{editingSet.author} - {editingSet.version}]
      </p>
      <SecondButton
        title="Vokabeln bearbeiten"
        Icon={CreditCard}
        subtitle="Vokabeln erstellen, bearbeiten oder löschen"
        onclick={() => {
          appState = State.EditVocabs;
        }}
      />
      <SecondButton
        title="Zurück"
        Icon={ChevronLeft}
        subtitle="Zurück zum Hauptmenü"
      />
    </div>
  {/if}
</bg>
