<script lang="ts">
	import { mergeVocabs } from "$lib/studylib";
	import { isStudySet, type StudySet, type Vocabulary } from "$lib/studysets";

	enum State {
		Main,
		Create,
		Import,
	}

	function importSet(e: SubmitEvent) {
		e.preventDefault();
		// @ts-ignore it works stop screaming
		const data = new FormData(e.target);
		try {
			const json: unknown = JSON.parse(data.get("data") as string);
			const result = isStudySet(json);
			if (result[0]) {
				set = result[1];
				pageState = State.Main;
			} else {
				message = "This is not a Studyset!";
				console.log(result[1]);
			}
		} catch {
			message = "Failed to parse JSON!";
		}
	}

	function createSet(e: SubmitEvent) {
		e.preventDefault();
		// @ts-ignore it works stop screaming
		const data = new FormData(e.target);

		set = {
			author: data.get("c-author") as string,
			name: data.get("c-name") as string,
			version: data.get("c-version") as string,
			description: data.get("c-description") as string,
			vocabularies: { nouns: {}, adjectives: {}, others: {}, verbs: {} },
			determine_nouns: undefined,
			determine_nouns_options: undefined,
			determine_verbs: undefined,
			determine_verbs_options: undefined,
			practise_sentences: undefined,
			url: undefined,
		};
		pageState = State.Main;
	}

	function createVocab(e: SubmitEvent) {
		e.preventDefault();
		if (!set?.vocabularies) return;
		// @ts-ignore it works stop screaming
		const data = new FormData(e.target);

		// @ts-ignore
		const vocab: Vocabulary = {
			original: data.get("original") as string,
			translation: JSON.parse(data.get("translation") as string),
			additional_info: (data.get("additional") as string) || undefined,
		};
		switch (data.get("type") as string) {
			case "nouns": {
				vocab.genitive = data.get("genitive") as string;
				vocab.genus = data.get("genus") as
					| "Male"
					| "Female"
					| "Neuter"
					| undefined;
			}
			case "verbs": {
				vocab.first_prs = data.get("first_prs") as string;
				vocab.first_perf = data.get("first_perf") as string;
				vocab.conjugation = data.get("conjugation") as string;
			}
			case "adjectives": {
				vocab.female = data.get("female") as string;
				vocab.neuter = data.get("neuter") as string;
			}
		}

		// @ts-ignore
		set.vocabularies[data.get("type") as string][
			data.get("original") as string
		] = vocab;
		addPopup = false;
	}

	function copy(): void {
		navigator.clipboard.writeText(JSON.stringify(set));
	}

	let pageState: State = $state(State.Create);
	let message: string = $state("");

	let set: StudySet | undefined = $state();
	let addPopup: boolean = $state(false);
	let type: "verbs" | "nouns" | "adjectives" | "others" | "" = $state("");
</script>

<p>{message}</p>
{#if pageState === State.Main && set}
	<button
		type="button"
		onclick={() => {
			addPopup = true;
			type = "";
		}}
		>Create...
	</button>
	<button type="button" onclick={copy}>Export (Copy)</button>
	<hr />
	{#if set?.vocabularies && Object.keys(mergeVocabs(set))?.length}
		<div class="flex flex-col">
			{#each Object.entries(mergeVocabs(set)) as [key, vocab]}
				<div class="third-bg ruby mb-1! p-0!">
					<button
						type="button"
						onclick={() => {
							vocab.type &&
								set?.vocabularies &&
								delete set?.vocabularies[vocab.type][key as string];
						}}>Delete</button
					>
					<p>
						<span class="text-2xl"
							>{vocab.original} => {vocab.translation.join(", ")}</span
						>
						(Type: {vocab.type}) ({vocab.type === "nouns"
							? `${vocab.genus} - ${vocab.genitive}`
							: ""}
						{vocab.type === "adjectives"
							? `${vocab.female} - ${vocab.neuter}`
							: ""}
						{vocab.type === "verbs"
							? `${vocab.first_prs}, ${vocab.first_perf} - ${vocab.conjugation}`
							: ""}) ({vocab.additional_info})
					</p>
				</div>
			{/each}
		</div>
	{:else}
		<p>No vocabularies...</p>
	{/if}

	{#if addPopup}
		<form
			class="fixed bottom-0 left-0 w-screen text-2xl second-bg"
			onsubmit={(e) => {
				createVocab(e);
			}}
		>
			<p class="text-2xl">Create...</p>
			<input type="text" required placeholder="original" name="original" />
			<input
				type="text"
				required
				placeholder="translation"
				name="translation"
			/>
			<select bind:value={type} required name="type">
				<option disabled value="" selected>Select Type</option>
				<option value="verbs">Verb</option>
				<option value="nouns">Noun</option>
				<option value="adjectives">Adjective</option>
				<option value="others">Other</option>
			</select>
			{#if type === "adjectives"}
				<input type="text" required placeholder="female" name="female" />
				<input type="text" required placeholder="neuter" name="neuter" />
			{:else if type === "nouns"}
				<input type="text" required placeholder="genitive" name="genitive" />
				<select required name="genus">
					<option disabled value="" selected>genus</option>
					<option>Male</option>
					<option>Female</option>
					<option>Neuter</option>
				</select>
			{:else if type === "verbs"}
				<input
					type="text"
					required
					placeholder="first present"
					name="first_prs"
				/>
				<input
					type="text"
					required
					placeholder="first perfect"
					name="first_perf"
				/>
				<input
					type="text"
					required
					placeholder="conjugation"
					name="conjugation"
				/>
			{/if}
			<input type="text" placeholder="additional info" name="additional" />
			<button type="submit">Create</button>
			<button
				type="button"
				onclick={() => {
					addPopup = false;
				}}>Close</button
			>
		</form>
	{/if}
{:else if pageState === State.Import}
	<form
		onsubmit={(d) => {
			importSet(d);
		}}
	>
		<textarea
			class="font-mono"
			placeholder="Place your Studyset here..."
			name="data"
			required
		></textarea>
		<button type="submit">Import...</button>
	</form>
{:else}
	<!-- State.Create -->
	<button
		type="button"
		onclick={() => {
			pageState = State.Import;
		}}
		>Import
	</button>
	<hr />
	<form
		onsubmit={(d) => {
			createSet(d);
		}}
	>
		<input type="text" name="c-name" placeholder="Studyset name" required />
		<input type="text" name="c-author" placeholder="Author" required />
		<input type="text" name="c-version" placeholder="Version" required />
		<input
			type="text"
			name="c-description"
			placeholder="Description"
			required
		/>
		<button type="submit">Create</button>
	</form>
{/if}

<style>
	.ruby {
		display: ruby;

		button {
			width: initial;
			margin: 0;
		}
	}
</style>
