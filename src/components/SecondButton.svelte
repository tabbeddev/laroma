<script lang="ts">
	import type { Icon as IconType } from "@lucide/svelte";

	let {
		onclick = () => {},
		title,
		subtitle = undefined,
		Icon = undefined,
		classes = [],
		disabled = false,
	}: {
		onclick?: Function;
		title: string;
		subtitle?: string;
		Icon?: typeof IconType;
		classes?: string[];
		disabled?: boolean;
	} = $props();
</script>

<div
	class={["second-bg", "cursor-pointer", ...classes, disabled && "disabled", "text-left"]}
	onclick={() => {
		!disabled && onclick();
	}}
>
	{#if Icon}
		<div class="flex items-center">
			<div class="shrink-0">
				<Icon size={40} />
			</div>

			<div class="ml-1">
				<p>{title}</p>
				<p class="font-light">{subtitle}</p>
			</div>
		</div>
	{:else}
		<p>{title}</p>
		<p class="font-light">{subtitle}</p>
	{/if}
</div>
