<script lang="ts">
	let {
		checked = $bindable(),
		text,
		props = {},
	}: { checked: boolean; text: string; props?: any } = $props();
</script>

<label class="checkbox">
	<input type="checkbox" bind:checked {...props} />
	<span class="checkmark"></span>
	{text}
</label>
