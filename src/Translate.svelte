<script lang="ts">
	import type { StudySet } from "$lib/studysets";
	import { scale } from "svelte/transition";
	import Check from "./components/icons/study/Check.svelte";
	import Next from "./components/icons/study/Next.svelte";
	import SecondButton from "./components/SecondButton.svelte";

	function checkSentence(sentence: (typeof sentences)[0]) {
		hasTranslated = translated.equals(sentence.translation);
	}

	function next() {
		hasTranslated = undefined;
		translated = [];
		sentence_index++;
	}

	let { set, hardMode }: { set: StudySet; hardMode: boolean } = $props();

	let translated: string[] = $state([]);
	let hasTranslated: boolean | undefined = $state();

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
	{@const translation = (
		hardMode
			? [...sentence.translation, ...sentence.distractions]
			: sentence.translation
	).toShuffled()}
	<div class="third-bg text-center">
		<p class="font-bold text-2xl underline">Übersetze:</p>
		<p class="text-2xl">{sentence.original}</p>
	</div>

	<div class="third-bg text-2xl flex flex-wrap">
		{#if translated.length}
			{#each translated as word, index}
				<span
					class="second-bg cursor-pointer"
					in:scale
					out:scale
					onclick={() => {
						translated.splice(index, 1);
					}}
					>{word}
				</span>
			{/each}
		{:else}
			<p class="leading-6! text-base">
				Wähle unten die Wörter in der richtigen Reihenfolge aus um den Satz zu
				übersetzen.
			</p>
		{/if}
	</div>

	<div class="fixed bottom-0 left-0 w-screen text-2xl">
		{#if hasTranslated !== undefined}
			<div
				class="second-bg"
				class:bg-green-800!={hasTranslated}
				class:text-white={hasTranslated}
			>
				<p class="font-bold">
					{hasTranslated ? "Gut gemacht!" : "Noch nicht ganz..."}
				</p>
				{#if !hasTranslated}
					<div class="text-base">
						<p>Richtig wäre:</p>
						<p class="italic">{sentence.translation.join(" ")}</p>
					</div>
				{/if}
			</div>
			<SecondButton title="Weiter" Icon={Next} onclick={next} />
		{:else}
			<div class="third-bg flex flex-wrap gap-0.5">
				{#each translation as word}
					{@const used = translated.includes(word)}
					<span
						class="second-bg cursor-pointer"
						class:disabled={translated.includes(word)}
						onclick={() => {
							if (!used) {
								translated.push(word);
							} else {
								translated.splice(translated.indexOf(word), 1);
							}
						}}
						>{word}
					</span>
				{/each}
			</div>
			<SecondButton
				title="Fertig!"
				Icon={Check}
				onclick={() => {
					checkSentence(sentence);
				}}
			/>
		{/if}
	</div>
{/if}
