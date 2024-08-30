<script lang="ts">
  import StatHeatmap from "$lib/components/StatHeatmap.svelte";
  import { calculateSetsWon } from "$lib/utils";
  import type { PageData } from "./$types";

  export let data: PageData;

  // this contains the number of sets won for both our team and the opposition team
  $: setsWon = calculateSetsWon(data.match.points);
</script>

<!-- header with general match details -->
<div class="hero is-primary has-background-primary-dark">
  <div class="hero-body has-text-centered">
    <div class="container">
      <div class="level-left">
        <div>
          <a
            href="/app/matches"
            class="has-text-link-light is-underlined no-print"
          >
            <span>
              <i class="fas fa-arrow-left"></i>
              Back to All Matches
            </span></a
          >
        </div>
      </div>
      <h2 class="title has-text-white">
        {new Date(data.match.time).toDateString()}
      </h2>
      <h3 class="subtitle has-text-white">{data.match.location}</h3>
      <div class="columns is-centered is-vcentered">
        <div class="column is-5">
          <h2 class="has-text-right title">
            <a
              href="/app/teams/{data.match.teamId}"
              class="has-text-white is-underlined"
            >
              {data.match.ourTeamName}
            </a>
          </h2>
        </div>
        <div class="column is-2">
          <h1 class="title is-1 has-text-white">
            {setsWon.our}
            :
            {setsWon.opp}
          </h1>
        </div>
        <div class="column is-5">
          <h2 class="has-text-left title has-text-white">
            {data.match.oppTeamName}
          </h2>
        </div>
      </div>
      <div class="columns is-centered">
        {#each data.match.points as { our, opp }}
          <div class="column is-1 is-flex is-justify-content-center">
            <h3
              class="subtitle has-text-white"
              class:has-text-weight-bold={our > opp}
            >
              {our}
            </h3>
            <h3 class="subtitle has-text-white">-</h3>
            <h3
              class="subtitle has-text-white"
              class:has-text-weight-bold={opp > our}
            >
              {opp}
            </h3>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- table with rows of statistics for each player -->
<div class="section">
  <div class="container">
    <div class="block">
      <h1 class="title">Statistics by Player</h1>
      <div class="table-container">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th class="no-print">Open</th>
              <th>First Name</th>
              <th>Surname</th>
              <th>Points</th>
              <th>Kill Rate</th>
              <th>Passing Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {#each data.players as { player, kr, pef, points }}
              <tr>
                <td class="no-print">
                  <a href="/app/players/{player.id}" class="button">
                    <span class="icon">
                      <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </span>
                  </a>
                </td>
                <td>{player.firstName}</td>
                <td>{player.surname}</td>
                <td>{points}</td>
                <td>{kr.toFixed(3)}</td>
                <td>{pef.toFixed(3)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- stat heatmap for the match -->
    <div class="block page-break-before">
      <h1 class="title">Heatmap</h1>
      <div class="box">
        <StatHeatmap type="match" id={data.match.id} />
      </div>
    </div>
  </div>
</div>
