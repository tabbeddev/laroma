<script lang="ts">
	import { fade } from "svelte/transition";
	import { X } from "@lucide/svelte";

	let { notifications = $bindable() }: { notifications: string[] } = $props();
</script>

<div class="notibox">
	{#each notifications as noti}
		<p class="noti flex items-center justify-between" in:fade>
			{noti}
			<X
				size={40}
				onclick={() => {
					notifications.splice(notifications.indexOf(noti), 1);
				}}
			/>
		</p>
	{/each}
</div>
