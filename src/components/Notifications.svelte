<script lang="ts">
	import { fade } from "svelte/transition";
	import Close from "./icons/Close.svelte";

	let { notifications = $bindable() }: { notifications: string[] } = $props();
</script>

<div class="notibox">
	{#each notifications as noti}
		<p class="noti flex items-center justify-between" in:fade>
			{noti}
			<Close
				onclick={() => {
					notifications.splice(notifications.indexOf(noti), 1);
				}}
			/>
		</p>
	{/each}
</div>
