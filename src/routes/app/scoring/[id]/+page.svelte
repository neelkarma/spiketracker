<script lang="ts">
  // these import the specialist components
  import FieldPosSelectModal from "./FieldPosSelectModal.svelte";
  // scoring ui popup
  import Modal from "$lib/components/Modal.svelte";
  // confirm submission popup
  import QuickPicker from "$lib/components/QuickPicker.svelte";
  // player search in scoring

  import { beforeNavigate, goto } from "$app/navigation";
  // import the path
  import { ACTION_TYPE_MAPPINGS } from "./mappings.js";
  // import the predfined structure of stats

  export let data;

  let playerScoring: { name: string; id: number } | null = null;
  let scoringData: {
    name: string;
    playerId: number;
    from: [number, number];
    to: [number, number];
    action: keyof typeof ACTION_TYPE_MAPPINGS;
    rating: number;
  }[] = [];
  let confirmDialogOpen = false;
  let submitStatus: "idle" | "loading" | "error" = "idle";

  $: playerItems = (<any[]>data.players).map(
    ({
      id,
      firstName,
      surname,
    }: {
      id: number;
      firstName: string;
      surname: string;
    }) => ({
      label: `${firstName} ${surname}`,
      value: id,
    }),
  );

  /** this is called whenever a player is selected from the list */
  const handlePlayerSelect = ({
    label: name,
    value: id,
  }: {
    label: string;
    value: number;
  }) => {
    // by setting playerScoring, we also open the modal.
    playerScoring = { name, id };
  };

  /** this is called when new scoring data is added */
  const handleScoringSubmit = (data: {
    from: [number, number];
    to: [number, number];
    action: keyof typeof ACTION_TYPE_MAPPINGS;
    rating: number;
  }) => {
    if (!playerScoring) return;
    // this adds the new data to the array of scoring data
    scoringData.unshift({
      name: playerScoring.name,
      playerId: playerScoring.id,
      ...data,
    });

    /** this might look weird, but it's necessary for svelte to see that scoringData has changed
    svelte only tracks assignments, not mutations
    it sucks, but apparently it's fixed in v5 **/
    scoringData = scoringData;

    // reset playerScoring to dismiss the modal
    playerScoring = null;
  };

  /** this is called when submitting the final scoring data */
  const handleSubmit = async () => {
    submitStatus = "loading";

    const res = await fetch(`/api/stats/${data.match.id}`, {
      // sending
      method: "PUT",
      body: JSON.stringify(scoringData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      // if something goes wrong an error message is displayed
      console.log(await res.text());
      submitStatus = "error";
      return;
    }

    goto("/app/matches?success=1");
  };

  // this is for preventing users from leaving when there's unsubmitted scoring data
  beforeNavigate(({ type, cancel }) => {
    if (scoringData.length === 0 || submitStatus === "loading") return;
    if (type === "leave") {
      cancel();
    } else if (
      !confirm(
        "Warning: Your scoring data is unsaved, and will be lost if you leave now. Press 'Ok' if you still want to leave.",
      )
    ) {
      cancel();
    }
  });
</script>

<!-- This is class of the confirmation popup -->
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

<!-- This is the class of the scoring ui popup -->
<FieldPosSelectModal
  isOpen={playerScoring !== null}
  on:submit={(e) => handleScoringSubmit(e.detail)}
/>

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
            <a href="/app/matches" class="button">Exit</a>
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
        No scoring data to display. Please add scoring data for a player by
        selecting their name above first.
      </p>
    {:else}
      <div class="table-container">
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
      </div>
    {/if}
  </div>
</section>
