<script lang="ts">
  import { page } from "$app/stores";

  export let successMessage = "The operation completed successfully.";
  export let errorMessage =
    "The operation failed to complete successfully. Please try again in a moment.";

  let closed = false;
</script>

{#if !closed}
  {#if $page.url.searchParams.get("success") === "1"}
    <div class="notification is-success no-print">
      <button class="delete" on:click={() => (closed = true)}></button>
      {successMessage}
    </div>
  {:else if $page.url.searchParams.get("success") === "0"}
    <div class="notification is-danger no-print">
      <button class="delete" on:click={() => (closed = true)}></button>
      {errorMessage}
    </div>
  {/if}
{/if}
