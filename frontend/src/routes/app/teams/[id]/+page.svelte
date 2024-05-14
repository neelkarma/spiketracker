<script lang="ts">
  import Stat from "$lib/components/Stat.svelte";
  import { SAMPLE_PLAYER_INFO, type PlayerInfo } from "$lib/types";
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

<div class="hero is-primary has-background-primary-dark">
  <div class="hero-body">
    <div class="container">
      <div class="level is-fullwidth">
        <div class="level-left">
          <div>
            <a href="/app/players" class="has-text-link-light is-underlined">
              <span>
                <i class="fas fa-arrow-left"></i>
                Back to All Teams
              </span></a
            >
            <div class="level-item">
              <h1 class="title is-1 has-text-white">{data.name}</h1>
            </div>
          </div>
        </div>
        <div class="level-right has-text-white">
          <div class="level-item">
            <Stat label="W/L" value="{data.wins}-{data.losses}" />
          </div>
          <div class="level-item">
            <Stat label="Set Ratio" value={data.setRatio.toFixed(3)} />
          </div>
          <div class="level-item">
            <Stat label="Kill Rate" value={data.kr.toFixed(3)} />
          </div>
          <div class="level-item">
            <Stat label="Passing Efficiency" value={data.pef.toFixed(3)} />
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
              <td>{ppg}</td>
              <td>{kr.toFixed(3)}</td>
              <td>{pef.toFixed(3)}</td>
              <td>{totalPoints}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/await}
  </div>
</div>
