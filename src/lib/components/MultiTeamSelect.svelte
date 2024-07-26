<script lang="ts">
  import { onMount } from "svelte";

  export let value: { name: string; id: number }[] = [];
  export let required = false;
  export let inputId = "teamsInput";

  let teamsPromise: Promise<{ name: string; id: number }[]>;
  let selectEl: HTMLSelectElement;

  $: valueIds = value.map(({ id }) => id);
  $: if (selectEl && required) {
    selectEl.setCustomValidity(
      value.length === 0 ? "You must select at least one team." : "",
    );
  }

  const fetchTeams = async () => {
    const res = await fetch("/api/teams/");

    if (!res.ok) {
      alert("Sorry, something went wrong");
      return;
    }

    const data = await res.json();
    return data;
  };

  const handleSelect = (
    e: Event & { currentTarget: HTMLSelectElement & EventTarget },
    teams: { name: string; id: number }[],
  ) => {
    const id = e.currentTarget.selectedOptions[0].value;
    //@ts-ignore
    value = [
      ...value,
      teams.find(({ id: teamsId }) => teamsId === Number.parseInt(id))!,
    ];
    e.currentTarget.value = "";
  };

  onMount(() => (teamsPromise = fetchTeams()));
</script>

<div class="control">
  <div class="tags are-medium mb-2">
    {#if value.length}
      {#each value as { name, id }}
        <div class="tag">
          {name}
          <button
            class="delete is-small"
            type="button"
            on:click={() =>
              (value = value.filter(({ id: valueId }) => id !== valueId))}
          ></button>
        </div>
      {/each}
    {:else}
      <p>No teams selected.</p>
    {/if}
  </div>
</div>
<div class="control">
  <div class="select">
    {#if teamsPromise}
      {#await teamsPromise}
        <select name="ourTeamId" id={inputId} disabled>
          <option>Loading...</option>
        </select>
      {:then teams}
        <select
          name="ourTeamId"
          id={inputId}
          on:input={(e) => handleSelect(e, teams)}
          bind:this={selectEl}
        >
          <option value="" selected>Choose...</option>
          {#each teams.filter(({ id }) => !valueIds.includes(id)) as { name, id }}
            <option value={id}>{name}</option>
          {/each}
        </select>
      {:catch}
        <p>Sorry, something went wrong.</p>
        <button class="button" on:click={() => (teamsPromise = fetchTeams())}
          >Retry</button
        >
      {/await}
    {/if}
  </div>
</div>
