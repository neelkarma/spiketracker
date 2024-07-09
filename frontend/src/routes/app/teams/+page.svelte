<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";
  import TeamCard from "$lib/components/TeamCard.svelte";
  import { type TeamInfo } from "$lib/types";
  import { debounce } from "$lib/utils";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import ActionFeedbackNotification from "$lib/components/ActionFeedbackNotification.svelte";

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

  const handleChange = async (query: string, sortOptions: SortOptions) => {
    const searchParams = new URLSearchParams({
      q: query,
      sort: sortOptions.sortBy,
      reverse: sortOptions.reverse ? "1" : "0",
    }).toString();

    const res = await fetch("/api/teams/?" + searchParams);

    if (res.status !== 200) {
      alert("Sorry, something went wrong.");
      return;
    }

    filteredTeams = await res.json();
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
        <label class="radio">
          <input
            type="radio"
            name="sortby"
            value="name"
            checked={sortOptions.sortBy === "name"}
          />
          Team Name (A-Z)
        </label>
        <label class="radio">
          <input
            type="radio"
            name="sortby"
            value="year"
            checked={sortOptions.sortBy === "year"}
          />
          Year
        </label>
        <label class="radio">
          <input
            type="radio"
            name="sortby"
            value="setRatio"
            checked={sortOptions.sortBy === "setRatio"}
          />
          Set Ratio
        </label>
        <label class="radio">
          <input
            type="radio"
            name="sortby"
            value="kr"
            checked={sortOptions.sortBy === "kr"}
          />
          Kill Rate
        </label>
        <label class="radio">
          <input
            type="radio"
            name="sortby"
            value="pef"
            checked={sortOptions.sortBy === "pef"}
          />
          Passing Efficiency
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
