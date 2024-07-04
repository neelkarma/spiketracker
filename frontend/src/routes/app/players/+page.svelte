<script lang="ts">
  import { page } from "$app/stores";
  import Modal from "$lib/components/Modal.svelte";
  import { type PlayerInfo } from "$lib/types";
  import { debounce } from "$lib/utils";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import ActionFeedbackNotification from "$lib/components/ActionFeedbackNotification.svelte";

  interface SortOptions {
    sortBy:
      | "firstName"
      | "surname"
      | "ppg"
      | "kr"
      | "pef"
      | "totalPoints"
      | "gradYear";
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

    if (res.status !== 200) {
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
        {#each [["firstName", "First Name (A-Z)"], ["surname", "Surname (A-Z)"], ["ppg", "Avg PPG (Desc)"], ["kr", "Kill Rate (Desc)"], ["pef", "Passing Efficiency (Desc)"], ["totalPoints", "Total Points (Desc)"], ["gradYear", "Graduation Year (Desc)"]] as [value, label]}
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
    <ActionFeedbackNotification />
    <h1 class="title">Players</h1>
    <div class="field is-grouped">
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
          type="email"
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
      <div class="table-container">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>Open</th>
              <th>First Name</th>
              <th>Surname</th>
              <th>Team(s)</th>
              <th>Avg PPG</th>
              <th>Kill Rate</th>
              <th>Passing Efficiency</th>
              <th>Total Points</th>
              {#if $page.data.admin}
                <th>Edit</th>
              {/if}
            </tr>
          </thead>
          <tbody>
            {#each filteredPlayers as { id, firstName, surname, teams, ppg, kr, pef, totalPoints }}
              <tr>
                <td
                  ><a href="/app/players/{id}" class="button"
                    ><span class="icon"
                      ><i class="fa-solid fa-arrow-up-right-from-square"
                      ></i></span
                    ></a
                  >
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
                  <td
                    ><a href="/app/players/edit/{id}" class="button"
                      ><span class="icon"
                        ><i class="fa-solid fa-pencil"></i></span
                      ></a
                    ></td
                  >
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      {#each { length: 10 } as _}
        <div class="skeleton-block"></div>
      {/each}
    {/if}
  </div>
</section>
