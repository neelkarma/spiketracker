<script lang="ts">
  import type { PlayerInfo } from "$lib/types";
  import { debounce } from "$lib/utils";

  /** The picked players. This should be bound. */
  export let value: PlayerInfo[] = [];
  /** The HTML input id. Use for accessibilty - i.e. when pairing with an HTML label element */
  export let inputId = "";
  /** Whether there must be at least 1 selected player or not. */
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

  /** This gets called to refresh the filtered player list. */
  const fetchFilteredPlayers = async () => {
    // edge case where the search query is empty - we simply don't display any players
    if (searchQuery.length === 0) {
      isLoading = false;
      filteredPlayers = [];
      return;
    }

    // construct and execute api request
    const searchParams = new URLSearchParams({
      q: searchQuery,
    }).toString();
    const res = await fetch("/api/players/?" + searchParams);

    if (!res.ok) {
      alert("Sorry, something went wrong.");
      isLoading = false;
      return;
    }

    filteredPlayers = await res.json();
    isLoading = false;
  };

  // We debounce the filtered players request to make sure we don't spam the API with requests
  const debouncedMakeRequest = debounce(fetchFilteredPlayers);
</script>

<div class="panel has-background-white">
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
