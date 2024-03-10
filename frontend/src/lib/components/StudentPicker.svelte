<script lang="ts">
  import { debounce } from "$lib/utils";

  interface SearchResult {
    id: number;
    name: string;
    team: string;
  }

  export let value: SearchResult[] = [];

  let isLoading = false;
  let searchedStudents: SearchResult[] = [];

  const makeRequest = async (e: InputEvent) => {
    // const response = await fetch(
    //   "/api/players/search?q=" + (e.currentTarget as HTMLInputElement).value
    // );
    // return response.json();

    // TODO: Fill this with fake shit
    searchedStudents = [
      {
        id: 440805299,
        name: "Neel Sharma",
        team: "1sts",
      },
      {
        id: 440805298,
        name: "Andrew Wang",
        team: "1sts",
      },
    ];
    isLoading = false;
  };

  const debouncedMakeRequest = debounce(makeRequest);
</script>

<nav class="panel">
  <div class="panel-block">
    {#each value as { id, name, team }}
      <span class="tag is-large mr-2">
        {name} ({team})
        <button
          class="delete"
          on:click={() => {
            value = value.filter((v) => v.id !== id);
          }}
        ></button>
      </span>
    {/each}
  </div>
  <div class="panel-block">
    <p class="control has-icons-left">
      <input
        class="input"
        type="text"
        placeholder="Search students..."
        on:input={(e) => {
          isLoading = true;
          debouncedMakeRequest(e);
        }}
      />
      <span class="icon is-left">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
    </p>
  </div>
  {#if isLoading}
    <p class="panel-block">Loading...</p>
  {:else}
    {#each searchedStudents as student}
      <button
        class="panel-block button is-fullwidth"
        on:click={() => {
          if (value.some(({ id }) => id === student.id)) {
            alert("Student already selected.");
            return;
          }
          value = [...value, student];
        }}>{student.name}</button
      >
    {/each}
  {/if}
</nav>
