<script lang="ts">
  import { SAMPLE_PLAYER_INFO, type PlayerInfo } from "$lib/types";
  import { debounce } from "$lib/utils";

  export let value: PlayerInfo[] = [];
  export let inputId = "";
  export let required = false;

  let isLoading = false;
  let filteredPlayers: PlayerInfo[] = [];
  let inputEl: HTMLInputElement;
  let searchQuery = "";

  $: if (inputEl && required) {
    inputEl.setCustomValidity(
      value.length === 0 ? "You must specify at least one player." : "",
    );
  }

  const fetchFilteredPlayers = async () => {
    if (searchQuery.length === 0) {
      isLoading = false;
      filteredPlayers = [];
      return;
    }

    const searchParams = new URLSearchParams({
      q: searchQuery,
    }).toString();
    const res = await fetch("/api/players/?" + searchParams);
    filteredPlayers = await res.json();
    isLoading = false;
  };

  const debouncedMakeRequest = debounce(fetchFilteredPlayers);
</script>

<div class="panel">
  <div class="panel-block">
    {#if value.length}
      <div class="tags are-medium">
        {#each value as { id, firstName, surname }}
          <span class="tag">
            {firstName}
            {surname} ({id})
            <button
              class="delete is-small"
              type="button"
              on:click={() => {
                value = value.filter((v) => v.id !== id);
              }}
            ></button>
          </span>
        {/each}
      </div>
    {:else}
      <p>No players added.</p>
    {/if}
  </div>
  <div class="panel-block">
    <p class="control has-icons-left">
      <input
        class="input"
        type="text"
        placeholder="Search players..."
        id={inputId}
        bind:value={searchQuery}
        on:input={() => {
          isLoading = true;
          debouncedMakeRequest();
        }}
        bind:this={inputEl}
      />
      <span class="icon is-left">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
    </p>
  </div>
  {#if isLoading}
    <p class="panel-block">Loading...</p>
  {:else}
    {#each filteredPlayers.filter((player) => !value.some((other) => player.id === other.id)) as player}
      <button
        class="panel-block button is-fullwidth"
        type="button"
        on:click={() => {
          if (value.some(({ id }) => id === player.id)) {
            alert("Student already selected.");
            return;
          }
          value = [...value, player];
        }}>{player.firstName} {player.surname} ({player.id})</button
      >
    {/each}
  {/if}
</div>
