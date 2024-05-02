<script lang="ts">
  export let ourTeamName: string;
  export let oppTeamName: string;
  export let points: { our: number; opp: number }[];

  $: ourSetsWon = points.map(({ our, opp }) => our > opp);
  $: totalSets = points.reduce(
    ({ our: ourAcc, opp: oppAcc }, { our, opp }) => ({
      our: ourAcc + (our > opp ? 1 : 0),
      opp: oppAcc + (opp > our ? 1 : 0),
    }),
    { our: 0, opp: 0 }
  );
  $: ourWin = totalSets.our > totalSets.opp;
</script>

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
