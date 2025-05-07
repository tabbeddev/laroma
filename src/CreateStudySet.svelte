<script lang="ts">
  import type { SetManager } from "$lib/setManager.svelte";
  import Checkbox from "./components/Checkbox.svelte";

  let {
    sets,
    notify,
    rtrn,
  }: { sets: SetManager; notify: (message: string) => void; rtrn: () => void } =
    $props();
  let encrypted: boolean = $state(false);

  function create(e: SubmitEvent) {
    e.preventDefault();
    // @ts-ignore it works stop screaming
    const data = new FormData(e.target);

    sets.addUrl({
      url: data.get("l-url") as string,
      key: data.get("l-key") as string | null,
    });
    notify("Lernset hinzugefügt: " + data.get("l-url"));
    rtrn();
  }
</script>

<h1 class="text-3xl underline mb-0.5">Lernset hinzufügen:</h1>
<form onsubmit={create}>
  <input type="url" placeholder="Lernset Adresse" name="l-url" required />
  <br />

  <Checkbox
    bind:checked={encrypted}
    text="Lernset ist verschlüsselt. (Wähle dies, fallst du einen Schlüssel bekommen hast)"
  />
  <br />

  {#if encrypted}
    <input type="password" placeholder="Schlüssel" name="l-key" required />
    <br />
  {/if}

  <button type="submit">Hinzufügen</button>
</form>
<button type="button" onclick={rtrn}>Abbrechen</button>
