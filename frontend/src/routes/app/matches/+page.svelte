<script lang="ts">
  import { page } from "$app/stores";
  import MatchCardBody from "$lib/components/MatchCardBody.svelte";
  import MatchCardDetailsPart from "$lib/components/MatchCardDetailsPart.svelte";
  import MatchCardTeamsPart from "$lib/components/MatchCardTeamsPart.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { SAMPLE_MATCH_INFO, type MatchInfo } from "$lib/types";
  import { debounce, wait } from "$lib/utils";
  import type { PageData } from "./$types";

  interface SortOptions {
    sortBy: "time" | "team";
    reverse: boolean;
  }

  export let data: PageData;

  let query = "";
  let sortOptions: SortOptions = {
    sortBy: "time",
    reverse: false,
  };
  let filterModalIsOpen = false;

  let filteredUpcomingMatches: MatchInfo[];
  let filteredPastMatches: MatchInfo[];

  const handleChange = async (query: string, sortOptions: SortOptions) => {
    // const data = await fetch("/api/teams", { ... }).then((res) => res.json());

    // simulate network delay
    await wait(1000);
    filteredUpcomingMatches = [SAMPLE_MATCH_INFO];
    filteredPastMatches = [SAMPLE_MATCH_INFO];
  };

  const handleChangeDebounced = debounce(handleChange);

  $: handleChangeDebounced(query, sortOptions);
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

      filterModalIsOpen = false;
    }}
  >
    <div class="title">Sorting Options</div>
    <div class="field">
      <p class="label">Sort By:</p>
      <div class="control">
        <label class="radio">
          <input
            type="radio"
            name="sortby"
            value="name"
            checked={sortOptions.sortBy === "time"}
          />
          Match Time
        </label>
        <label class="radio">
          <input
            type="radio"
            name="sortby"
            value="year"
            checked={sortOptions.sortBy === "team"}
          />
          SBHS Team Name
        </label>
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
    <div class="field is-grouped">
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
          type="email"
          placeholder="Search matches..."
          bind:value={query}
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
    <div class="title is-4">Upcoming Matches</div>
    {#if filteredUpcomingMatches}
      {#each filteredUpcomingMatches as { id, date, oppTeamName, ourTeamName, location }}
        <MatchCardBody>
          <MatchCardDetailsPart {date} {location} />
          <MatchCardTeamsPart {ourTeamName} {oppTeamName} />
          {#if $page.data.admin}
            <div class="level-item">
              <a href="/app/matches/edit/{id}" class="button">Edit</a>
            </div>
          {/if}
        </MatchCardBody>
        <!-- <TeamCard {...match} /> -->
      {/each}
    {:else}
      {#each { length: 5 } as _}
        <div class="skeleton-block"></div>
      {/each}
    {/if}
    <div class="title is-4">Past Matches</div>

    {#if filteredPastMatches}
      {#each filteredUpcomingMatches as { id, date, oppTeamName, ourTeamName, location }}
        <MatchCardBody href="/app/matches/{id}">
          <MatchCardDetailsPart {date} {location} />
          <MatchCardTeamsPart {ourTeamName} {oppTeamName} />
          {#if $page.data.admin}
            <div class="level-item">
              <a href="/app/matches/edit/{id}" class="button">Edit</a>
            </div>
          {/if}
        </MatchCardBody>
      {/each}
    {:else}
      {#each { length: 5 } as _}
        <div class="skeleton-block"></div>
      {/each}
    {/if}
  </div>
</section>

<!-- TODO: Implement the results -->
