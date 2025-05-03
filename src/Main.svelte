<script lang="ts">
	import Notifications from "./components/Notifications.svelte";
	import SecondButton from "./components/SecondButton.svelte";
	import Card from "./components/icons/Card.svelte";
	import MatchIcon from "./components/icons/Match.svelte";
	import Determine from "./components/icons/Determine.svelte";
	import TextIcon from "./components/icons/Text.svelte";
	import Word from "./components/icons/Word.svelte";
	import Set from "./components/icons/Set.svelte";
	import Flashcards from "./Flashcards.svelte";
	import Close from "./components/icons/Close.svelte";
	import { getSRS } from "$lib/srs";
	import CreateStudySet from "./CreateStudySet.svelte";
	import type { SetManager } from "$lib/setManager.svelte";
	import Trash from "./components/icons/Trash.svelte";
	import Check from "./components/icons/study/Check.svelte";
	import Plus from "./components/icons/Plus.svelte";
	import Warn from "./components/icons/Warn.svelte";
	import Checkbox from "./components/Checkbox.svelte";
	import SlideInBox from "./components/SlideInBox.svelte";
	import Translate from "./Translate.svelte";
	import Match from "./Match.svelte";
	import type { StudySet } from "$lib/studysets";
	import TranslateToText from "./TranslateToText.svelte";

	enum State {
		Home,
		ChangeStudySet,
		EliminationSets,
		AddStudySet,
		// Study
		Flashcards,
		Match,
		// Train
		Translate,
		TranslateToText,
	}

	let { sets }: { sets: SetManager } = $props();

	function convErrorCode(code: string, key: string | null): string {
		switch (code) {
			case "failed": {
				return "Konnte nicht geladen werden";
			}

			case "invalid": {
				if (key) {
					return "Ungültig - Falscher Schlüssel eingegeben?";
				} else {
					return "Ungültig - Kein Schlüssel eingegeben?";
				}
			}

			case "notaset": {
				return "Ungültig - Kein Lernset";
			}
		}
		return "UnknownError";
	}

	function navToChange(): void {
		if (appState == State.Home) appState = State.ChangeStudySet;
	}

	function validateStudyset(set: string | null) {
		if (set) {
			if (set in sets.sets) {
				localStorage.setItem("studyset", set);
			} else {
				console.warn("Studyset does not exist. Trying to clear it...");
				set = null;
				localStorage.removeItem("studyset");
			}
		}
		return set;
	}

	function notify(message: string): void {
		notifications.push(message);

		setTimeout(() => {
			notifications.splice(notifications.indexOf(message), 1);
		}, 5000);
	}

	function resetSRS() {
		const srs = getSRS();
		srs.data = {};
		console.log(srs.data);
		srs.saveSRS();
	}

	function nextStudyStamp(): [string, boolean, string] {
		const [stamp, set] = getSRS().findNextStudyTime();
		if (stamp == Infinity)
			return ["Kein Lernset wurde bisher gelernt.", false, ""];

		const date = new Date(stamp).toLocaleString(undefined, {
			weekday: "short",
			day: "numeric",
			month: "long",
		});

		if (stamp > Date.now()) {
			return [set + " sollte wiederholt am " + date + ".", false, ""];
		} else {
			return [set + " sollte wiederholt werden.", true, set];
		}
	}

	let dev_mode: boolean = $state(false);

	let notifications: string[] = $state([]);
	let appState: State = $state(State.Home);
	let expressMode: boolean = $state(false);
	let hardMode: boolean = $state(false);

	let nextStudy: [string, boolean, string] = $state(nextStudyStamp());

	let studyset: string | null = $state(
		validateStudyset(localStorage.getItem("studyset")),
	);
	// @ts-ignore
	let currentSet: StudySet = $derived(studyset ? sets.sets[studyset] : null);

	// Write studyset changes to localStorage
	$effect(() => {
		studyset = validateStudyset(studyset);
	});

	setInterval(() => {
		nextStudy = nextStudyStamp();
	}, 5 * 60);
</script>

{#if appState === State.Home}
	<div class="second-bg boxed mb-2! cursor-pointer" onclick={navToChange}>
		{#if studyset}
			<div class="flex items-center">
				<Set />
				<div class="ml-1">
					<p class="text-2xl font-bold">{currentSet.name}</p>
					<p>{currentSet.description}</p>
				</div>
			</div>
		{:else}
			<p class="texr-2xl font-bold text-red-400">Kein Lernset ausgewählt!</p>
		{/if}
		<span class="font-light italic">Hier klicken zum ändern</span>
	</div>

	<SlideInBox>
		<SecondButton
			title={nextStudy[0]}
			Icon={nextStudy[1] && Warn}
			onclick={() => {
				if (nextStudy[1]) {
					studyset = nextStudy[2];
					appState = State.Flashcards;
				}
			}}
		/>

		{#if studyset}
			<h1
				class="text-3xl underline mb-0.5"
				onclick={() => {
					dev_mode = true;
				}}
			>
				Lernoptionen
			</h1>

			{#if currentSet.vocabularies && Object.keys(currentSet.vocabularies)?.length}
				<Checkbox bind:checked={expressMode} text="Expresslernen" />

				<h2 class="text-2xl mb-0.5">Vokabeln:</h2>
				<SecondButton
					title="Karteikarten"
					subtitle="Du überprüfst selber, ob du deine Vokabeln kannst"
					Icon={Card}
					onclick={() => {
						appState = State.Flashcards;
					}}
				/>
			{/if}

			{#if currentSet.determine_verbs?.length && currentSet.determine_nouns?.length}
				<h2 class="text-2xl mb-0.5">Bestimmen:</h2>
			{/if}

			{#if currentSet.determine_verbs?.length && currentSet.determine_verbs_options?.length}
				<SecondButton
					title="Verben bestimmen"
					subtitle="Bestimme Genus verbi, Tempus, Numerus und Fall"
					Icon={Determine}
					onclick={() => {
						notify("Kommt bald!");
					}}
				/>
			{/if}
			{#if currentSet.determine_nouns?.length && currentSet.determine_nouns_options?.length}
				<SecondButton
					title="Nomen bestimmen"
					subtitle="Bestimme Numerus, Genus und Kasus"
					Icon={Determine}
					onclick={() => {
						notify("Kommt bald!");
					}}
				/>
			{/if}

			{#if currentSet.practise_sentences?.length || (currentSet.vocabularies && Object.keys(currentSet.vocabularies)?.length)}
				<h1 class="text-3xl underline mb-0.5">Testen</h1>
				<Checkbox bind:checked={hardMode} text="Schwerer" />
			{/if}
			{#if currentSet.practise_sentences?.length}
				<SecondButton
					title="Übersetzen"
					subtitle="Übersetze einzelne Sätze mit vorgegebenen Wörtern"
					Icon={Word}
					onclick={() => {
						appState = State.Translate;
					}}
				/>

				<SecondButton
					title="Übersetzen (Text)"
					subtitle="Übersetze einzelne Sätze"
					Icon={TextIcon}
					onclick={() => {
						appState = State.TranslateToText;
					}}
				/>
			{/if}
			{#if currentSet.vocabularies && Object.keys(currentSet.vocabularies)?.length}
				<SecondButton
					title="Zuordnen"
					subtitle="Ordne den Wörtern die Übersetzung zu"
					Icon={MatchIcon}
					onclick={() => {
						appState = State.Match;
					}}
				/>
			{/if}

			<p>
				Optionen, die nicht angezeigt werden, werden nicht vom Lernset
				unterstützt.
			</p>

			{#if dev_mode}
				<h1 class="text-2xl">Debugfunktionen</h1>
				<SecondButton title="SRS zurücksetzen" onclick={resetSRS} />
			{/if}
		{:else}
			<div class="centered">
				<h1 class="text-2xl">Willkommen zu lAroma!</h1>
				<p>Um anzufangen, wähle zuerst ein Lernset aus.</p>
			</div>
		{/if}
	</SlideInBox>
{:else if appState === State.ChangeStudySet}
	<SlideInBox>
		<h1 class="text-3xl underline mb-0.5">Lernset wählen</h1>
		{#if Object.keys(sets.sets).length}
			{#each Object.keys(sets.sets) as set}
				<SecondButton
					onclick={() => {
						studyset = set;
						appState = State.Home;
					}}
					title={sets.sets[set].name}
					subtitle={sets.sets[set].description +
						` [${sets.sets[set].author} - ${sets.sets[set].version}]`}
					Icon={Set}
				/>
			{/each}
		{:else}
			<p>Keine Lernsets hinzugefügt.</p>
		{/if}
		{#each sets.invalid_urls as [url, error]}
			{@const url2 = new URL(url.url)}
			<SecondButton
				Icon={Warn}
				title={url2.pathname}
				subtitle={convErrorCode(error, url.key)}
			/>
		{/each}
		<hr />
		<SecondButton
			title="Lernset hinzufügen"
			subtitle="Füge ein Lernset aus dem Internet hinzu"
			onclick={() => {
				appState = State.AddStudySet;
			}}
			Icon={Plus}
		/>
		<SecondButton
			title="Eliminierungsmodus"
			onclick={() => {
				appState = State.EliminationSets;
			}}
			Icon={Trash}
		/>
	</SlideInBox>
{:else if appState === State.EliminationSets}
	<SlideInBox>
		<h1 class="text-3xl underline mb-0.5">Lernsets löschen</h1>
		{#if Object.keys(sets.sets).length}
			{#each Object.values(sets.sets) as set}
				<SecondButton
					onclick={() => {
						if (!set.url) return;
						notify("Lernset entfernt: " + set.url);
						sets.removeUrl(set.url);
					}}
					title={set.name}
					subtitle={set.description}
					Icon={Trash}
				/>
			{/each}
		{:else}
			<p>Hier ist nichts zum eliminieren</p>
		{/if}
		{#each sets.invalid_urls as [url, error]}
			{@const url2 = new URL(url.url)}
			<SecondButton
				onclick={() => {
					sets.removeUrl(url.url);
				}}
				Icon={Warn}
				title={url2.pathname}
				subtitle={convErrorCode(error, url.key)}
			/>
		{/each}

		<hr />
		<SecondButton
			title="Fertig"
			onclick={() => {
				appState = State.ChangeStudySet;
			}}
			Icon={Check}
		/>
	</SlideInBox>
{:else if appState === State.AddStudySet}
	<SlideInBox>
		<CreateStudySet
			{sets}
			{notify}
			rtrn={() => {
				appState = State.ChangeStudySet;
			}}
		/>
	</SlideInBox>
{:else if studyset}
	<SlideInBox>
		<div
			class="second-bg boxed mb-2! cursor-pointer"
			onclick={() => {
				appState = State.Home;
			}}
		>
			<div class="flex items-center">
				<Close />
				<p class="text-2xl">Beenden</p>
			</div>
		</div>
		{#if appState === State.Flashcards}
			<Flashcards set={currentSet || {}} {notify} {expressMode} {studyset} />
		{:else if appState === State.Match}
			<Match set={currentSet || {}} {hardMode} />
		{:else if appState === State.Translate}
			<Translate set={currentSet || {}} {hardMode} />
		{:else if appState === State.TranslateToText}
			<TranslateToText set={currentSet || {}} {hardMode} />
		{/if}
	</SlideInBox>
{/if}

<Notifications bind:notifications />
