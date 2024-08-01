<script lang="ts" generics="T">
  import { createEventDispatcher } from "svelte";

  // TODO: Use fuzzy searching with fuse.js

  type Item = {
    label: string;
    value: T;
  };

  export let title: string;
  export let items: Item[];
  let filterString = "";

  const dispatch = createEventDispatcher<{ click: Item }>();

  const handleClick = (item: Item) => {
    // move the selected item to the top of the list
    const itemIndex = items.findIndex((other) => item.value === other.value);
    items.splice(itemIndex, 1);
    items.unshift(item);
    items = items;

    filterString = "";
    dispatch("click", item);
  };
</script>

<div class="panel has-background-white">
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
  {#each items.filter(({ label }) => label
      .toLowerCase()
      .includes(filterString.toLowerCase())) as { label, value }}
    <a class="panel-block" on:click={() => handleClick({ label, value })}>
      {label}
    </a>
  {/each}
</div>
