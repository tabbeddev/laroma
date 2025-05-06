<script lang="ts">
	import { fade } from "svelte/transition";
	import Main from "../Main.svelte";
	import getSetManager from "$lib/setManager.svelte";

	let intro = $state(true);
	const sets = getSetManager();
	const loaded = sets.loadAll();
</script>

{#if intro}
	<bg
		class="sparkles"
		out:fade={{ duration: 500 }}
		onclick={() => {
			intro = false;
		}}
	>
		<div class="centered">
			<h1 class="text-5xl text-purple-400 intro">lAroma</h1>
			<h2
				class="text-2xl text-purple-300 intro"
				onanimationend={() => {
					setTimeout(() => {
						intro = false;
					}, 500);
				}}
			>
				Intelligentes Lernen (oder so)
			</h2>
		</div>
	</bg>
{:else}
	{#await loaded}
		<div class="centered" out:fade={{ duration: 200 }}>
			<p class="text-3xl">Bitte warten...</p>
			<p class="text-light">Die Lernsets laden länger als üblich...</p>
		</div>
	{:then}
		<div in:fade={{ delay: 200, duration: 200 }}>
			<Main {sets} />
		</div>
	{/await}
{/if}
