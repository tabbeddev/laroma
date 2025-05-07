<script lang="ts">
  import { scale } from "svelte/transition";

  const {
    items = $bindable(),
    placeholder,
  }: { items: string[]; placeholder: string } = $props();

  function onkeydown(e: KeyboardEvent) {
    if (e.code === "Enter") {
      e.preventDefault();
      if (text !== "") {
        items.push(text);
        text = "";
      }
    }
  }

  let text: string = $state("");
</script>

<hr />
<div class="third-bg flex flex-wrap w-[98%] mx-[1vw]! items-center gap-0.5">
	<span>Übersetzungsmöglichkeiten:</span>
  {#each items as word, index}
    <span
      class="second-bg cursor-pointer mb-0!"
      in:scale
      out:scale
      title="Klicke zum Entfernen"
      onclick={() => {
        items.splice(index, 1);
      }}
      >{word}
    </span>
  {/each}
</div>

<input type="text" bind:value={text} {onkeydown} {placeholder} />
<hr />
