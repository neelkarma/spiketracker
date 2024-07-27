<script lang="ts">
  import FieldPosSelect from "./FieldPosSelect.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import QuickPicker from "$lib/components/QuickPicker.svelte";
  import { ACTION_TYPE_MAPPINGS } from "./mappings.js";
  import { goto } from "$app/navigation";

  export let data;

  let playerScoring: { name: string; id: number } | null = null;
  let scoringData: {
    name: string;
    playerId: number;
    from: [number, number];
    to: [number, number];
    action: string;
    rating: number;
  }[] = [];
  let confirmDialogOpen = false;
  let submitStatus: "idle" | "loading" | "error" = "idle";

  $: playerItems = data.players.map(({ id, firstName, surname }) => ({
    label: `${firstName} ${surname}`,
    value: id,
  }));

  const handlePlayerSelect = ({
    label: name,
    value: id,
  }: {
    label: string;
    value: number;
  }) => {
    playerScoring = { name, id };
  };

  const handleScoringSubmit = (data: {
    from: [number, number];
    to: [number, number];
    action: string;
    rating: number;
  }) => {
    if (!playerScoring) return;
    scoringData.unshift({
      name: playerScoring.name,
      playerId: playerScoring.id,
      ...data,
    });
    scoringData = scoringData;
    playerScoring = null;
  };

  const handleSubmit = async () => {
    submitStatus = "loading";

    const res = await fetch(`/api/stats/${data.match.id}`, {
      method: "PUT",
      body: JSON.stringify(scoringData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.log(await res.text());
      submitStatus = "error";
      return;
    }

    goto("/app/matches?success=1");
  };
</script>

<Modal bind:isOpen={confirmDialogOpen}>
  <div class="box">
    <p class="title is-4 mb-3">Confirm Submission</p>
    <p class="mb-3">
      Are you sure you want to submit the provided scoring data?
      <strong>You will not be able to make any changes after you submit.</strong
      >
    </p>
    <div class="buttons">
      <button
        class="button"
        class:is-loading={submitStatus === "loading"}
        on:click={handleSubmit}>Yes</button
      >
      <button
        class="button is-primary"
        on:click={() => (confirmDialogOpen = false)}>No</button
      >
    </div>
  </div>
</Modal>

<Modal isOpen={playerScoring !== null}>
  <div class="box">
    <FieldPosSelect on:submit={(e) => handleScoringSubmit(e.detail)} />
  </div>
</Modal>

<section class="section">
  <div class="container">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <h1 class="title is-5">
            Scoring {data.match.ourTeamName} vs {data.match.oppTeamName} @ {data
              .match.location}
          </h1>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div class="buttons">
            <a href="/app" class="button">Exit</a>
            <button
              on:click={() => (confirmDialogOpen = true)}
              class="button is-primary">Submit</button
            >
          </div>
        </div>
      </div>
    </div>
    <QuickPicker
      title="Add action for player..."
      items={playerItems}
      on:click={(e) => handlePlayerSelect(e.detail)}
    />
    {#if scoringData.length === 0}
      <p class="has-text-centered">
        No scoring data to display. Use the above search box to add scoring data
        for a player first.
      </p>
    {:else}
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Action Type</th>
            <th>Rating</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {#each scoringData as { name, action, rating }, i}
            <tr>
              <td>{name}</td>
              <td>{ACTION_TYPE_MAPPINGS[action]}</td>
              <td>{rating}</td>
              <td>
                <button
                  class="button is-danger"
                  on:click={() => {
                    scoringData.splice(i, 1);
                    scoringData = scoringData;
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</section>
