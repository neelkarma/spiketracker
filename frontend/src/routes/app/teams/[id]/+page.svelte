<script lang="ts">
  import Stat from "$lib/components/Stat.svelte";
  import StatHeatmap from "$lib/components/StatHeatmap.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="hero is-primary has-background-primary-dark">
  <div class="hero-body">
    <div class="container">
      <div class="level is-fullwidth">
        <div class="level-left">
          <div>
            <a
              href="/app/teams"
              class="has-text-link-light is-underlined no-print"
            >
              <span>
                <i class="fas fa-arrow-left"></i>
                Back to All Teams
              </span></a
            >
            <div class="level-item">
              <h1 class="title is-1 has-text-white">{data.team.name}</h1>
            </div>
          </div>
        </div>
        <div class="level-right has-text-white">
          <div class="level-item">
            <Stat label="W/L" value="{data.team.wins}-{data.team.losses}" />
          </div>
          <div class="level-item">
            <Stat label="Set Ratio" value={data.team.setRatio.toFixed(3)} />
          </div>
          <div class="level-item">
            <Stat label="Kill Rate" value={data.team.kr.toFixed(3)} />
          </div>
          <div class="level-item">
            <Stat label="Passing Efficiency" value={data.team.pef.toFixed(3)} />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="section">
  <div class="container">
    <h1 class="title">Player List</h1>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th class="no-print">Open</th>
          <th>First Name</th>
          <th>Surname</th>
          <th>Avg PPG</th>
          <th>Avg Kill Rate</th>
          <th>Avg Passing Efficiency</th>
          <th>Total Points</th>
        </tr>
      </thead>
      <tbody>
        {#each data.players as { id, firstName, surname, ppg, kr, pef, points }}
          <tr>
            <td class="no-print">
              <a href="/app/players/{id}" class="button">
                <span class="icon">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </span>
              </a>
            </td>
            <td>{firstName}</td>
            <td>{surname}</td>
            <td>{ppg}</td>
            <td>{kr.toFixed(3)}</td>
            <td>{pef.toFixed(3)}</td>
            <td>{points}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <h1 class="title">Heatmap</h1>
    <div class="box">
      <StatHeatmap type="team" id={data.team.id} />
    </div>
  </div>
</div>
