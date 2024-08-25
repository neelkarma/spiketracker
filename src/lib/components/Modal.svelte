<script lang="ts">
  export let isOpen = false;
  export let canClose = true;

  function handleClose() {
    if (canClose) isOpen = false;
  }
</script>

<div class="modal" class:is-active={isOpen}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-background" on:click={handleClose}></div>
  <div class="modal-content"><slot /></div>
  {#if canClose}
    <button
      class="modal-close is-large"
      aria-label="close"
      on:click={() => (isOpen = false)}
    ></button>
  {/if}
</div>
