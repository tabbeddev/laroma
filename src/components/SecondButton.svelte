<script lang="ts">
	let {
		onclick = undefined,
		title,
		subtitle = undefined,
		Icon = undefined,
		classes = [],
		disabled = false,
	} = $props();
</script>

<div
	class={["second-bg", "cursor-pointer", ...classes, disabled && "disabled"]}
	onclick={() => {
		!disabled && onclick();
	}}
>
	{#if Icon}
		<div class="flex items-center">
			<div class="shrink-0">
				<Icon />
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
