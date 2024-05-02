<script lang="ts">
  import Stat from "$lib/components/Stat.svelte";
  import { SAMPLE_PLAYER_INFO, type PlayerInfo } from "$lib/types";
  import { formatAsPercentage } from "$lib/utils";
  import type { PageData } from "./$types";

  export let data: PageData;

  const getTeamPlayerStats = async (): Promise<PlayerInfo[]> => {
    // const res = await fetch(`/api/players/${$page.params.id}/matches`);
    // const matches = await res.json();
    // return matches

    // dummy data
    return [
      SAMPLE_PLAYER_INFO,
      SAMPLE_PLAYER_INFO,
      SAMPLE_PLAYER_INFO,
      SAMPLE_PLAYER_INFO,
    ];
  };
</script>

<div class="hero">
  <div class="hero-body">
    <div class="container">
      <div class="level is-fullwidth">
        <div class="level-left">
          <div class="level-item">
            <h1 class="title is-1">{data.name}</h1>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <Stat label="W/L" value="{data.wins}-{data.losses}" />
          </div>
          <div class="level-item">
            <Stat label="Set Ratio" value={formatAsPercentage(data.setRatio)} />
          </div>
          <div class="level-item">
            <Stat label="Kill Rate" value={formatAsPercentage(data.kr)} />
          </div>
          <div class="level-item">
            <Stat
              label="Passing Efficiency"
              value={formatAsPercentage(data.pef)}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="section">
  <div class="container">
    <h1 class="title">Player List</h1>
    {#await getTeamPlayerStats()}
      Loading...
    {:then players}
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Surname</th>
            <th>Avg PPG</th>
            <th>Avg Kill Rate</th>
            <th>Avg Passing Efficiency</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {#each players as { firstName, surname, ppg, kr, pef, totalPoints }}
            <tr>
              <td>{firstName}</td>
              <td>{surname}</td>
              <td>{formatAsPercentage(ppg)}</td>
              <td>{formatAsPercentage(kr)}</td>
              <td>{formatAsPercentage(pef)}</td>
              <td>{totalPoints}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/await}
  </div>
</div>
