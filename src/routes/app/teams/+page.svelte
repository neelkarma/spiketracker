<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";
  import TeamCard from "$lib/components/TeamCard.svelte";
  import { type TeamInfo } from "$lib/types";
  import { debounce } from "$lib/utils";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import ActionFeedbackNotification from "$lib/components/ActionFeedbackNotification.svelte";
  import SortOptionsModal from "$lib/components/SortOptionsModal.svelte";

  interface SortOptions {
    sortBy: string;
    reverse: boolean;
  }

  export let data: PageData;

  let query = "";
  let sortOptions: SortOptions = {
    sortBy: "name",
    reverse: false,
  };
  let filterModalIsOpen = false;

  let filteredTeams: TeamInfo[];

  /** this gets called to update the results */
  const handleChange = async (query: string, sortOptions: SortOptions) => {
    // construct the search params and execute api request to search and sort teams
    const searchParams = new URLSearchParams({
      q: query,
      sort: sortOptions.sortBy,
      reverse: sortOptions.reverse ? "1" : "0",
    }).toString();
    const res = await fetch("/api/teams/?" + searchParams);

    if (!res.ok) {
      alert("Sorry, something went wrong.");
      return;
    }

    filteredTeams = await res.json();
  };

  // we debounce the handleChange function to make sure we're not spamming the api
  const handleChangeDebounced = debounce(handleChange);

  onMount(async () => {
    // this is to initialize results on opening the page
    await handleChange(query, sortOptions);
  });
</script>

<SortOptionsModal
  bind:isOpen={filterModalIsOpen}
  options={[
    ["name", "Team Name (A-Z)"],
    ["year", "Year"],
    ["setRatio", "Set Ratio"],
    ["kr", "Kill Rate"],
    ["pef", "Passing Efficiency"],
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
    <h1 class="title">Teams</h1>
    <div class="field is-grouped is-grouped-multiline">
      {#if data.admin}
        <div class="control">
          <a href="/app/teams/new" class="button is-primary">
            <span class="icon">
              <i class="fas fa-plus"></i>
            </span>
            <span>New Team</span>
          </a>
        </div>
      {/if}
      <div class="control has-icons-left is-expanded">
        <input
          class="input"
          type="text"
          placeholder="Search teams..."
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
    {#if filteredTeams}
      {#if filteredTeams.length === 0}
        <div class="block has-text-centered">No teams found.</div>
      {:else}
        {#each filteredTeams as team}
          <TeamCard data={team} />
        {/each}
      {/if}
    {:else}
      {#each { length: 5 } as _}
        <div class="skeleton-block"></div>
      {/each}
    {/if}
  </div>
</section>
