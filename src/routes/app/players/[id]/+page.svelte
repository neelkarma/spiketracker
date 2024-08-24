<script lang="ts">
  import Stat from "$lib/components/Stat.svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import StatHeatmap from "$lib/components/StatHeatmap.svelte";

  export let data: PageData;
</script>

<div class="hero is-primary has-background-primary-dark">
  <div class="hero-body">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <div>
            <a href="/app/players" class="has-text-link-light is-underlined">
              <span>
                <i class="fas fa-arrow-left"></i>
                Back to All Players
              </span></a
            >
            <h1 class="title is-1 has-text-white">
              {data.player.firstName}
              {data.player.surname}
            </h1>
            <h2 class="is-flex has-text-white">
              {#each data.player.teams as team}
                <!-- ik using mr instead of flex gap is kinda sus but i cant find bulma docs for that so too bad -->
                <a
                  class="mr-2 subtitle is-underlined"
                  href="/app/teams/{team.id}">{team.name}</a
                >
              {/each}
            </h2>
          </div>
        </div>
        <div class="level-right has-text-white">
          <div class="level-item">
            <Stat label="PPG" value={data.player.ppg.toFixed(3)} />
          </div>
          <div class="level-item">
            <Stat label="Kill Rate" value={data.player.kr.toFixed(3)} />
          </div>
          <div class="level-item">
            <Stat
              label="Passing Efficiency"
              value={data.player.pef.toFixed(3)}
            />
          </div>
          <div class="level-item">
            <Stat label="Total Points" value={data.player.totalPoints} />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="section">
  <div class="container">
    <h1 class="title">Match History</h1>
    {#if data.matches.length === 0}
      <p>No matches found.</p>
    {:else}
      <div class="table-container">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>Open</th>
              <th>Date</th>
              <th>Opponent</th>
              <th>Team</th>
              <th>Points Scored</th>
              <th>Kill Rate</th>
              <th>Passing Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {#each data.matches as { match, points, kr, pef }}
              <tr>
                <td>
                  <a class="button" href="/app/matches/{match.id}">
                    <span class="icon">
                      <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </span>
                  </a>
                </td>
                <td
                  >{new Date(match.time).toLocaleDateString("en-AU", {
                    hour: "numeric",
                    hour12: true,
                    minute: "2-digit",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    weekday: "short",
                  })}</td
                >
                <td>{match.oppTeamName}</td>
                <td
                  ><a href="/app/teams/{match.ourTeamId}">{match.ourTeamName}</a
                  ></td
                >
                <td>{points}</td>
                <td>{kr.toFixed(3)}</td>
                <td>{pef.toFixed(3)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}

    <h1 class="title page-break-before">Heatmap</h1>
    <div class="box">
      <StatHeatmap type="player" id={data.player.id} />
    </div>
  </div>
</div>
