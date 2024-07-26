<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";
  import { type MatchInfo } from "$lib/types";
  import { debounce } from "$lib/utils";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import UnscoredMatchCard from "./UnscoredMatchCard.svelte";
  import ScoredMatchCard from "./ScoredMatchCard.svelte";

  interface SortOptions {
    sortBy: string;
    reverse: boolean;
  }

  export let data: PageData;

  let query = "";
  let sortOptions: SortOptions = {
    sortBy: "time",
    reverse: false,
  };
  let filterModalIsOpen = false;

  let filteredOngoingMatches: MatchInfo[];
  let filteredUpcomingMatches: MatchInfo[];
  let filteredPastMatches: MatchInfo[];

  const handleChange = async (query: string, sortOptions: SortOptions) => {
    const searchParams = new URLSearchParams({
      q: query,
      sort: sortOptions.sortBy,
      reverse: sortOptions.reverse ? "1" : "0",
    }).toString();

    const res = await fetch("/api/matches/?" + searchParams);

    if (res.status !== 200) {
      alert("Something went wrong, sorry.");
      console.log(await res.text());
      return;
    }

    const matches: MatchInfo[] = await res.json();
    const now = Date.now();

    const ongoing = [];
    const upcoming = [];
    const past = [];

    for (const match of matches) {
      if (match.scoring) {
        ongoing.push(match);
        continue;
      }

      const matchTime = new Date(match.time);
      if (matchTime.getTime() > now) {
        upcoming.push(match);
      } else {
        past.push(match);
      }
    }

    filteredOngoingMatches = ongoing;
    filteredUpcomingMatches = upcoming;
    filteredPastMatches = past;
  };

  const handleChangeDebounced = debounce(handleChange);

  onMount(async () => {
    await handleChange(query, sortOptions);
  });
</script>

<Modal bind:isOpen={filterModalIsOpen}>
  <form
    class="box"
    on:submit|preventDefault={(e) => {
      const formData = new FormData(e.currentTarget);

      sortOptions = {
        //@ts-ignore
        sortBy: formData.get("sortby"),
        reverse: formData.has("reverse"),
      };

      handleChange(query, sortOptions);

      filterModalIsOpen = false;
    }}
  >
    <div class="title">Sorting Options</div>
    <div class="field">
      <p class="label">Sort By:</p>
      <div class="control">
        {#each [["time", "Match Time"], ["ourTeamName", "SBHS Team Name"], ["oppTeamName", "Opposition Team Name"]] as [value, label]}
          <label class="radio">
            <input
              type="radio"
              name="sortby"
              {value}
              checked={sortOptions.sortBy === value}
            />
            {label}
          </label>
        {/each}
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" name="reverse" checked={sortOptions.reverse} />
          Reverse Order
        </label>
      </div>
    </div>
    <div class="field">
      <div class="control is-grouped">
        <button class="button is-primary">Apply</button>
        <button
          class="button"
          type="button"
          on:click={() => (filterModalIsOpen = false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</Modal>

<section class="section">
  <div class="container">
    <h1 class="title">Matches</h1>
    <div class="field is-grouped is-grouped-multiline">
      {#if data.admin}
        <div class="control">
          <a href="/app/matches/new" class="button is-primary">
            <span class="icon">
              <i class="fas fa-plus"></i>
            </span>
            <span>New Match</span>
          </a>
        </div>
      {/if}
      <div class="control has-icons-left is-expanded">
        <input
          class="input"
          type="text"
          placeholder="Search matches..."
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
    <div class="my-5"></div>
    <div class="title is-4">Ongoing Matches</div>
    {#if filteredOngoingMatches}
      {#if filteredOngoingMatches.length === 0}
        <p>No ongoing matches found.</p>
      {:else}
        {#each filteredOngoingMatches as match}
          <UnscoredMatchCard data={match} />
        {/each}
      {/if}
    {:else}
      {#each { length: 2 } as _}
        <div class="skeleton-block"></div>
      {/each}
    {/if}

    <div class="my-5"></div>
    <div class="title is-4">Upcoming Matches</div>
    {#if filteredUpcomingMatches}
      {#if filteredUpcomingMatches.length === 0}
        <p>No upcoming matches found.</p>
      {:else}
        {#each filteredUpcomingMatches as match}
          <UnscoredMatchCard data={match} />
        {/each}
      {/if}
    {:else}
      {#each { length: 2 } as _}
        <div class="skeleton-block"></div>
      {/each}
    {/if}

    <div class="my-5"></div>
    <div class="title is-4">Past Matches</div>
    {#if filteredPastMatches}
      {#if filteredPastMatches.length === 0}
        <p>No past matches found.</p>
      {:else}
        {#each filteredPastMatches as match}
          <ScoredMatchCard data={match} />
        {/each}
      {/if}
    {:else}
      {#each { length: 2 } as _}
        <div class="skeleton-block"></div>
      {/each}
    {/if}
  </div>
</section>
