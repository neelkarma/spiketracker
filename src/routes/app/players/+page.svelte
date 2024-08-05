<script lang="ts">
  import { page } from "$app/stores";
  import Modal from "$lib/components/Modal.svelte";
  import { type PlayerInfo } from "$lib/types";
  import { debounce } from "$lib/utils";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import ActionFeedbackNotification from "$lib/components/ActionFeedbackNotification.svelte";
  import SortOptionsModal from "$lib/components/SortOptionsModal.svelte";
  import { filter } from "@observablehq/plot";

  interface SortOptions {
    sortBy: string;
    reverse: boolean;
  }

  export let data: PageData;

  let query = "";
  let sortOptions: SortOptions = {
    sortBy: "surname",
    reverse: false,
  };
  let filterModalIsOpen = false;

  let filteredPlayers: PlayerInfo[];

  const handleChange = async (query: string, sortOptions: SortOptions) => {
    const searchParams = new URLSearchParams({
      q: query,
      sort: sortOptions.sortBy,
      reverse: sortOptions.reverse ? "1" : "0",
    }).toString();

    const res = await fetch("/api/players/?" + searchParams);

    if (!res.ok) {
      alert("Something went wrong, sorry.");
      console.log(await res.text());
      return;
    }

    filteredPlayers = await res.json();
  };

  const handleChangeDebounced = debounce(handleChange);

  onMount(async () => {
    await handleChange(query, sortOptions);
  });
</script>

<SortOptionsModal
  bind:isOpen={filterModalIsOpen}
  options={[
    ["firstName", "First Name (A-Z)"],
    ["surname", "Surname (A-Z)"],
    ["ppg", "PPG (Desc)"],
    ["kr", "Kill Rate (Desc)"],
    ["pef", "Passing Efficiency (Desc)"],
    ["totalPoints", "Total Points (Desc)"],
    ["gradYear", "Graduation Year (Desc)"],
  ]}
  value={sortOptions}
  on:submit={(e) => {
    sortOptions = e.detail;
    handleChange(query, sortOptions);
    filterModalIsOpen = false;
  }}
/>

<section class="section">
  <div class="container">
    <ActionFeedbackNotification />
    <h1 class="title">Players</h1>
    <div class="field is-grouped is-grouped-multiline">
      {#if data.admin}
        <div class="control">
          <a href="/app/players/new" class="button is-primary">
            <span class="icon">
              <i class="fas fa-plus"></i>
            </span>
            <span>Add Player</span>
          </a>
        </div>
      {/if}
      <div class="control has-icons-left is-expanded">
        <input
          class="input"
          type="text"
          placeholder="Search players..."
          bind:value={query}
          on:input={() => handleChangeDebounced(query, sortOptions)}
        />
        <span class="icon is-left">
          <i class="fas fa-search"></i>
        </span>
      </div>
      <div class="control">
        <button class="button" on:click={() => (filterModalIsOpen = true)}>
          <span class="icon">
            <i class="fas fa-sliders"></i>
          </span>
          <span>Sorting Options</span>
        </button>
      </div>
    </div>
    {#if filteredPlayers}
      {#if filteredPlayers.length === 0}
        <div class="block has-text-centered">No players found.</div>
      {:else}
        <div class="table-container">
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th class="no-print">Open</th>
                <th>First Name</th>
                <th>Surname</th>
                <th>Team(s)</th>
                <th>PPG</th>
                <th>Kill Rate</th>
                <th>Passing Efficiency</th>
                <th>Total Points</th>
                {#if $page.data.admin}
                  <th>Visibility</th>
                  <th class="no-print">Edit</th>
                {/if}
              </tr>
            </thead>
            <tbody>
              {#each filteredPlayers as { id, firstName, surname, teams, ppg, kr, pef, totalPoints, visible }}
                <tr>
                  <td class="no-print">
                    <a href="/app/players/{id}" class="button">
                      <span class="icon">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                      </span>
                    </a>
                  </td>
                  <td>{firstName}</td>
                  <td>{surname}</td>
                  <td
                    >{#each teams as { name: teamName, id: teamId }}<a
                        href="/app/teams/{teamId}">{teamName}</a
                      >
                    {/each}</td
                  >
                  <td>{ppg}</td>
                  <td>{kr.toFixed(3)}</td>
                  <td>{pef.toFixed(3)}</td>
                  <td>{totalPoints}</td>
                  {#if $page.data.admin}
                    <td>
                      <span class="icon">
                        {#if visible}
                          <i
                            class="fa-solid fa-eye"
                            title="All players can see this players."
                          ></i>
                        {:else}
                          <i
                            class="fa-solid fa-eye-slash"
                            title="Only you can see this player."
                          ></i>
                        {/if}
                      </span>
                    </td>
                    <td class="no-print">
                      <a href="/app/players/edit/{id}" class="button">
                        <span class="icon">
                          <i class="fa-solid fa-pencil"></i>
                        </span>
                      </a>
                    </td>
                  {/if}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    {:else}
      {#each { length: 10 } as _}
        <div class="skeleton-block"></div>
      {/each}
    {/if}
  </div>
</section>
