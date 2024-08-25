<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Modal from "./Modal.svelte";

  interface SortOptions {
    sortBy: string;
    reverse: boolean;
  }

  export let isOpen = false;
  export let options: [string, string][];
  export let value: SortOptions;

  const dispatch = createEventDispatcher<{ submit: SortOptions }>();
</script>

<Modal bind:isOpen canClose={false}>
  <form
    class="box"
    on:submit|preventDefault={(e) => {
      const formData = new FormData(e.currentTarget);

      dispatch("submit", {
        //@ts-ignore
        sortBy: formData.get("sortby").toString(),
        reverse: formData.has("reverse"),
      });
    }}
  >
    <h1 class="title">Sorting Options</h1>
    <div class="field">
      <p class="label">Sort By:</p>
      <div class="control">
        {#each options as [key, label]}
          <label class="radio pr-2">
            <input
              type="radio"
              name="sortby"
              value={key}
              checked={value.sortBy === key}
            />
            {label}
          </label>
        {/each}
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" name="reverse" checked={value.reverse} />
          Reverse Order
        </label>
      </div>
    </div>
    <div class="field">
      <div class="control is-grouped">
        <button class="button is-primary">Apply</button>
      </div>
    </div>
  </form>
</Modal>
