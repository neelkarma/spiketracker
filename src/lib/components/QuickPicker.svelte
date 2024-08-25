<script lang="ts" generics="T">
  import { createEventDispatcher } from "svelte";

  type Item = {
    label: string;
    value: T;
  };

  /** The title of the quick picker panel. */
  export let title: string;
  /** The items in the quick picker. */
  export let items: Item[];

  let filterString = "";

  const dispatch = createEventDispatcher<{ click: Item }>();

  const handleClick = (item: Item) => {
    // move the selected item to the top of the list
    const itemIndex = items.findIndex((other) => item.value === other.value);
    items.splice(itemIndex, 1);
    items.unshift(item);

    // we do this to trigger svelte's reactivity, since it only registers that a variable has changed when it's assigned, not mutated
    // kinda stupid, but it is what it is
    // (i heard svelte v5 fixes this with it's runes system - we should migrate when it comes out)
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
  {#each items.filter(({ label }) => label
      .toLowerCase()
      .includes(filterString.toLowerCase())) as { label, value }}
    <!-- I know this is terrible for accessibility, but bulma has forced my hand -->
    <!-- svelte-ignore a11y-missing-attribute a11y-no-static-element-interactions a11y-click-events-have-key-events -->
    <a class="panel-block" on:click={() => handleClick({ label, value })}>
      {label}
    </a>
  {/each}
</div>
