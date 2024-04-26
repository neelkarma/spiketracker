<script lang="ts">
  import Stat from "$lib/components/Stat.svelte";
  import { SAMPLE_MATCH_INFO, type MatchInfo } from "$lib/types";
  import { formatAsPercentage } from "$lib/utils";
  import type { PageData } from "./$types";

  export let data: PageData;

  const getMatchHistory = async (): Promise<
    {
      match: MatchInfo;
      points: number;
      kr: number;
      pef: number;
    }[]
  > => {
    // const res = await fetch(`/api/players/${$page.params.id}/matches`);
    // const matches = await res.json();
    // return matches

    // dummy data
    return [
      {
        match: SAMPLE_MATCH_INFO,
        points: 12,
        kr: 0.5,
        pef: 0.7,
      },
      {
        match: {
          ...SAMPLE_MATCH_INFO,
          id: 1,
        },
        points: 14,
        kr: 0.4,
        pef: 0.2,
      },
    ];
  };
</script>

<div class="hero is-primary">
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
            <h1 class="title is-1">{data.firstName} {data.surname}</h1>
            <h2 class="is-flex">
              {#each data.teams as team}
                <!-- ik using mr instead of flex gap is kinda sus but i cant find bulma docs for that so too bad -->
                <a
                  class="mr-2 subtitle is-underlined"
                  href="/app/teams/{team.id}">{team.name}</a
                >
              {/each}
            </h2>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <Stat label="Avg PPG" value={data.ppg} />
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
          <div class="level-item">
            <Stat label="Total Points" value={data.totalPoints} />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="section">
  <div class="container">
    <h1 class="title">Match History</h1>
    {#await getMatchHistory()}
      <!-- TODO: Have a better loading thing - maybe componentize it -->
      Loading...
    {:then matches}
      {#if matches.length === 0}
        <!-- TODO: Make this look nicer -->
        <p>No matches found.</p>
      {:else}
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
            {#each matches as { match, points, kr, pef }}
              <tr>
                <td>
                  <a class="button" href="/app/matches/{match.id}">
                    <span class="icon">
                      <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </span>
                  </a>
                </td>
                <td
                  >{match.date.toLocaleDateString("en-AU", {
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
                <td>{formatAsPercentage(kr)}</td>
                <td>{formatAsPercentage(pef)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    {/await}
  </div>
</div>
