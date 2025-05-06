<script lang="ts">
  // @ts-nocheck

  import "$lib/commonlib";
  import "../style/app.css";
  import "../style/checkmark.css";
  import { onMount } from "svelte";

  let { children } = $props();

  function handleError(e: ErrorEvent): void {
    error = e;
  }

  let error: ErrorEvent | undefined = $state();
</script>

<svelte:head>
  <meta name="description" content="Sprachen einfach lernen" />
  <meta name="keywords" content="Sprachen, Latein, Lernen" />
  <link rel="manifest" href="manifest.json" />
  <title>lAroma - Sprachen einfach lernen</title>
</svelte:head>

<svelte:window onerror={handleError} />

{#if error}
  <h1 class="text-2xl">An error occured</h1>
  <p>Please reload the page to avoid further problems.</p>
  <button type="button" onclick={() => location.reload()}>Reload page</button>
  <h2>More details:</h2>
  <p class="font-mono">
    {error.message} @ {new URL(error.filename).pathname} : {error.lineno}:{error.colno}
  </p>
  <span class="underline"
    >Please report this issue <a
      href="https://github.com/Niklas20114552/clockpi/issues"
      target="_blank"
      class="text-blue-400">here.</a
    ><br />Please also see the console for more details.</span
  >
{:else}
  {@render children()}
{/if}
