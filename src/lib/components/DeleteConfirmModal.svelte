<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Modal from "./Modal.svelte";

  export let name: string;
  export let isOpen: boolean;

  let cancelBtn: HTMLButtonElement;
  onMount(() => cancelBtn.focus());

  const dispatch = createEventDispatcher<{ confirm: null; cancel: null }>();
</script>

<Modal bind:isOpen>
  <div class="box">
    <h1 class="title">Deletion Confirmation</h1>
    <p class="block">
      You are about to delete "{name}".
      <strong>This action is irreversible.</strong>
      Click "Delete" to confirm the deletion.
    </p>
    <div class="buttons">
      <button
        class="button is-danger"
        on:click={() => {
          isOpen = false;
          dispatch("confirm");
        }}>Delete</button
      >
      <button
        class="button"
        on:click={() => (isOpen = false)}
        bind:this={cancelBtn}>Cancel</button
      >
    </div>
  </div>
</Modal>
