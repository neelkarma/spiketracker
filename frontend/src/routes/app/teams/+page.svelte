<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";
  import TeamCard from "$lib/components/TeamCard.svelte";
  import { debounce } from "$lib/utils";

  interface SortOptions {
    sortBy: "name" | "year";
    reverse: boolean;
  }

  let query = "";
  let sortOptions: SortOptions = {
    sortBy: "name",
    reverse: false,
  };
  let filterModalIsOpen = false;

  let filteredTeams: any[] = [];

  const handleChange = (query: string, sortOptions: SortOptions) => {
    // const data = await fetch("/api/teams", { ... }).then((res) => res.json());

    filteredTeams = [
      {
        id: 1,
        name: "High 1sts",
        memberCount: 19,
        wins: 19,
        losses: 2,
        setRatio: 0.5,
        killRate: 0.5,
        passingEfficiency: 0.5,
      },
    ];
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
    <div class="title">Sort Options</div>
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
    <h1 class="title">Teams</h1>
    <div class="field is-grouped">
      <div class="control has-icons-left is-expanded">
        <input
          class="input"
          type="email"
          placeholder="Search teams..."
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
          <span>Filter and Sort</span>
        </button>
      </div>
    </div>
    {#each filteredTeams as team}
      <TeamCard {...team} />
    {/each}
  </div>
</section>

<!-- TODO: Implement the results -->
