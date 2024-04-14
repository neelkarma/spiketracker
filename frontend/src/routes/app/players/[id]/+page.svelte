<script lang="ts">
  import Stat from "$lib/components/Stat.svelte";
  import { formatAsPercentage } from "$lib/utils";
  import type { PageData } from "./$types";

  export let data: PageData;

  const getMatchHistory = async () => {
    // const res = await fetch(`/api/players/${$page.params.id}/matches`);
    // const matches = await res.json();
    // return matches

    // dummy data
    return [
      {
        id: 1,
        date: new Date(),
        opponent: "Newington 1sts",
        totalPoints: 12,
        kr: 0.5,
        pef: 0.7,
      },
      {
        id: 2,
        date: new Date(),
        opponent: "Newington 2nds",
        totalPoints: 14,
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
            <a href="/app/players" class="is-underlined">
              <span>
                <i class="fas fa-arrow-left"></i>
                Back to All Players
              </span></a
            >
            <h1 class="title is-1">{data.name}</h1>
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
            <Stat label="Avg PPG" value={data.stats.ppg} />
          </div>
          <div class="level-item">
            <Stat label="Kill Rate" value={formatAsPercentage(data.stats.kr)} />
          </div>
          <div class="level-item">
            <Stat
              label="Passing Efficiency"
              value={formatAsPercentage(data.stats.pef)}
            />
          </div>
          <div class="level-item">
            <Stat label="Total Points" value={data.stats.totalPoints} />
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
              <th>Total Pts</th>
              <th>KR%</th>
              <th>PEF%</th>
            </tr>
          </thead>
          <tbody>
            {#each matches as { id, date, opponent, totalPoints, kr, pef }}
              <tr>
                <td>
                  <a class="button" href="/app/matches/{id}">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                </td>
                <td>{date.toDateString()}</td>
                <td>{opponent}</td>
                <td>{totalPoints}</td>
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
