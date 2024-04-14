<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { FormEventHandler } from "svelte/elements";
  import Modal from "./Modal.svelte";

  export let date: Date;
  export let location: string;
  export let ourTeamName: string;
  export let oppTeamName: string;
  export let points: { our: number; opp: number }[];
  export let matchId: number;

  let editModalOpen = false;
  let isApproving = false;

  $: ourSetsWon = points.map(({ our, opp }) => our > opp);
  $: totalSets = points.reduce(
    ({ our: ourAcc, opp: oppAcc }, { our, opp }) => ({
      our: ourAcc + (our > opp ? 1 : 0),
      opp: oppAcc + (opp > our ? 1 : 0),
    }),
    { our: 0, opp: 0 }
  );
  $: ourWin = totalSets.our > totalSets.opp;

  const dispatch = createEventDispatcher<{ approved: void }>();

  const handleApprove = () => {
    try {
      isApproving = true;
      // prolly some backend call here
      dispatch("approved");
    } finally {
      isApproving = false;
    }
  };

  const handleEditAndApprove: FormEventHandler<HTMLFormElement> = (e) => {
    try {
      isApproving = true;
      // prolly some more backend call here
      editModalOpen = false;
      dispatch("approved");
    } finally {
      isApproving = false;
    }
  };
</script>

<Modal bind:isOpen={editModalOpen}>
  <form class="box" on:submit|preventDefault={handleEditAndApprove}>
    <h1 class="title">Edit Points</h1>
    <table class="table">
      <tbody>
        <tr>
          <th>{ourTeamName}</th>
          {#each points as { our: ourPoints }, i}
            <td>
              <input
                type="number"
                min={0}
                class="input"
                value={ourPoints}
                name="our-{i}"
              />
            </td>
          {/each}
        </tr>
        <tr>
          <th>{oppTeamName}</th>
          {#each points as { opp: oppPoints }, i}
            <td>
              <input
                type="number"
                min={0}
                class="input"
                value={oppPoints}
                name="opp-{i}"
              />
            </td>
          {/each}
        </tr>
      </tbody>
    </table>
    <div class="buttons">
      <button
        class="button is-primary"
        class:is-loading={isApproving}
        type="submit">Edit and Approve</button
      >
      <button
        class="button"
        type="button"
        on:click={() => (editModalOpen = false)}>Cancel</button
      >
    </div>
  </form>
</Modal>

<div class="box py-1 px-3 compress">
  <div class="level compress">
    <div class="level-item">
      <div>
        <h2 class="title is-5">
          {date.toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
        </h2>
        <h3 class="subtitle is-6">
          {date.toLocaleTimeString("en-AU", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </h3>
        <h3 class="subtitle is-6">{location}</h3>
      </div>
    </div>
    <div class="level-item">
      <table class="table">
        <tbody>
          <tr>
            <th>{ourTeamName}</th>
            {#each points as { our: ourPoints }, i}
              <td class:has-text-weight-bold={ourSetsWon[i]}>{ourPoints}</td>
            {/each}
            <td class:has-text-weight-bold={ourWin}>{totalSets.our}</td>
          </tr>
          <tr>
            <th>{oppTeamName}</th>
            {#each points as { opp: oppPoints }, i}
              <td class:has-text-weight-bold={!ourSetsWon[i]}>{oppPoints}</td>
            {/each}
            <td class:has-text-weight-bold={!ourWin}>{totalSets.opp}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="level-item">
      <div class="is-flex is-flex-direction-column gap-1">
        <button class="button is-primary" class:is-loading={isApproving}
          >Approve</button
        >
        <button class="button" on:click={() => (editModalOpen = true)}
          >Edit</button
        >
      </div>
    </div>
  </div>
</div>
