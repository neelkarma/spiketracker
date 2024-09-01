<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte";
  import { page } from "$app/stores";

  // we don't show the print button on certain routes, since some routes aren't designed for printing
  // case in point: the new and edit pages for teams, matches and players
  $: showPrintButton = !["new", "edit"].some((seg) =>
    $page.url.pathname.split("/").includes(seg),
  );
</script>

<NavBar />
<slot />
<footer class="footer has-text-centered">
  <p>SpikeTracker &copy; (2024)</p>
  {#if showPrintButton}
    <button class="button mt-2" on:click={() => window.print()}>
      <span class="icon">
        <i class="fa-solid fa-print"></i>
      </span>
      <span>Print current page</span>
    </button>
  {/if}
</footer>
