<script lang="ts">
  import { fade } from "svelte/transition";
  import SecondButton from "./components/SecondButton.svelte";
  import type { SetManager } from "$lib/setManager.svelte";
  import {
    ChevronLeft,
    ClipboardIcon,
    CreditCard,
    FilePlus,
    FlaskConical,
    Save,
    Upload,
    X,
  } from "@lucide/svelte";
  import { isStudySet, type StudySet } from "$lib/studysets";
  import EditVocabs from "./creator-pages/EditVocabs.svelte";
  import { save } from "./creator-pages/download";

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
        "Das ist kein valides Lernset. Bitte beachte, dass Lernset entschlüsseln noch nicht unterstützt ist. Bitte beachte auch, dass durch einen Bug alte Lernsets nicht unterstützt sind.",
      );
    }

    const files = (document.getElementById("c-import") as HTMLInputElement)
      .files;
    if (files !== null) {
      try {
        editingSet = JSON.parse(await files[0].text()) as StudySet;

        if (!isStudySet(editingSet)[0]) return fail();
      } catch {
        return fail();
      }
      appState = State.Edit;
    }
  }

  function goback() {
    if (
      confirm(
        "Dabei werden alle ungespeicherten Änderungen verworfen. Fortfahren?",
      )
    ) {
      appState = State.Home;
    }
  }

	function test() {
		if (editingSet && confirm("Dabei wird lAroma Lernset Creator geschlossen und alle ungespeicherten Änderungen verworfen. Fortfahren?")) {
			set.sets[editingSet.name] = editingSet;
			set.sets[editingSet.name].description += " (aus Lernset Creator geladen)";
			close();
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
        class="text-2xl rounded-sm intro2 bg-cyan-100 text-cyan-900"
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
      <div class="flex items-end gap-1 justify-center">
        <h1 class="text-5xl text-cyan-100">lAroma</h1>
        <span class="text-2xl rounded-sm bg-cyan-100 text-cyan-900 px-1">
          Lernset Creator
        </span>
      </div>

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
      accept=".json"
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
        title="Speichern"
        Icon={Save}
        onclick={() => {
          save(editingSet);
        }}
      />
			<SecondButton
				title="In lAroma testen"
				Icon={FlaskConical}
				onclick={test} />
      <SecondButton
        title="Zurück"
        Icon={ChevronLeft}
        subtitle="Zurück zum Hauptmenü"
        onclick={goback}
      />
    </div>
  {:else if appState === State.EditVocabs && editingSet}
    <EditVocabs
      bind:editingSet
      close={() => {
        appState = State.Edit;
      }}
    />
  {/if}
</bg>
