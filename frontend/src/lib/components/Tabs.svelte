<script lang="ts">
  export let tabs: { label: string; value: string }[];
  export let value: string;
</script>

<div class="tabs">
  <ul>
    {#each tabs as { label, value: v }}
      <li class:is-active={value === v}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={() => (value = v)}>{label}</a>
      </li>
    {/each}
  </ul>
</div>
