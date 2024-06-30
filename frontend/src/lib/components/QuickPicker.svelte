<script lang="ts" generics="T">
  import { createEventDispatcher } from "svelte";

  // TODO: Use fuzzy searching with fuse.js

  type Item = {
    label: string;
    value: T;
  };

  export let title: string;
  export let items: Item[];
  let recents: Item[] = [];
  let filterString = "";

  const dispatch = createEventDispatcher<{ click: Item }>();

  const handleClick = (item: Item) => {
    // move item to the top of recents if already present within
    const existingIndex = recents.findIndex(
      ({ value }) => value === item.value,
    );
    if (existingIndex !== -1) {
      recents.splice(existingIndex, 1);
    }
    recents.unshift(item);

    // limit to 7 items (max num of players in court)
    recents.length = Math.min(recents.length, 7);
    recents = recents; // trigger update
    filterString = "";
    dispatch("click", item);
  };
</script>

<div class="panel">
  <p class="panel-heading">{title}</p>
  <div class="panel-block">
    <div class="control has-icons-left">
      <input
        type="text"
        class="input"
        placeholder="Filter players..."
        bind:value={filterString}
      />
      <span class="icon is-left">
        <i class="fa-solid fa-magnifying-glass"></i>
      </span>
    </div>
  </div>
  <!-- I know this is terrible for accessibility, but bulma has forced my hand -->
  {#if filterString.length === 0}
    {#each recents as { label, value }}
      <a class="panel-block" on:click={() => handleClick({ label, value })}>
        {label}
      </a>
    {/each}
  {:else}
    {#each items.filter(({ label }) => label
        .toLowerCase()
        .includes(filterString.toLowerCase())) as { label, value }}
      <a class="panel-block" on:click={() => handleClick({ label, value })}>
        {label}
      </a>
    {/each}
  {/if}
</div>
