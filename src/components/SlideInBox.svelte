<script>
	import { slide } from "svelte/transition";

	let { props = {axis: "y", duration: 200}, children } = $props();
</script>

<div in:slide={props}>
	{@render children()}
</div>