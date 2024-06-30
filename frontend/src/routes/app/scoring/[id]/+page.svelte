<script lang="ts">
  import FieldPosSelect from "$lib/components/FieldPosSelect.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import PlayerPicker from "$lib/components/PlayerPicker.svelte";
  import QuickPicker from "$lib/components/QuickPicker.svelte";
  import ScoringNavBar from "$lib/components/ScoringNavBar.svelte";

  export let data;

  let playerScoring: { name: string; id: number } | null = null;
  let scoringData: {
    name: string;
    id: number;
    pos1: [number, number];
    pos2: [number, number];
    actionType: string;
    rating: number;
  }[] = [];

  $: playerItems = data.players.map(({ id, name }) => ({
    label: name,
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
    pos1: [number, number];
    pos2: [number, number];
    actionType: string;
    rating: number;
  }) => {
    if (!playerScoring) return;
    scoringData.unshift({
      ...playerScoring,
      ...data,
    });
    scoringData = scoringData;
    playerScoring = null;
  };
</script>

<Modal isOpen={playerScoring !== null}>
  <div class="box">
    <FieldPosSelect on:submit={(e) => handleScoringSubmit(e.detail)} />
  </div>
</Modal>

<ScoringNavBar
  title="Scoring {data.match.ourTeamName} vs {data.match.oppTeamName} @ {data
    .match.location}"
/>
<section class="section">
  <div class="container">
    <!-- TODO: Integrate QuickPicker component -->
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
          {#each scoringData as { name, actionType, rating }, i}
            <tr>
              <td>{name}</td>
              <td>{actionType}</td>
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
