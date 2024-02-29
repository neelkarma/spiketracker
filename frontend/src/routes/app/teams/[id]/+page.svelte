<script lang="ts">
  import Stat from "$lib/components/Stat.svelte";
  import { formatAsPercentage } from "$lib/utils";
  import type { PageData } from "./$types";

  export let data: PageData;

  const getTeamPlayerStats = async () => {
    // const res = await fetch(`/api/players/${$page.params.id}/matches`);
    // const matches = await res.json();
    // return matches

    // dummy data
    return [
      {
        name: "SBHS 1sts",
        id: 1,
        wins: 1,
        losses: 1,
        setRatio: 0.5,
        kr: 0.5,
        pef: 0.5,
        players: [
          {
            playernum: 0,
            firstName: "Guppy",
            surname: "Gup",
            position: "Setter",
          },
        ],
      },
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
          <Stat label="W/L" value="{data.wins}-{data.losses}" />
          <Stat label="Set Ratio" value={formatAsPercentage(data.setRatio)} />
          <Stat label="Kill Rate" value={formatAsPercentage(data.kr)} />
          <Stat
            label="Passing Efficiency"
            value={formatAsPercentage(data.pef)}
          />
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
            <th>No.</th>
            <th>Firstname</th>
            <th>Surname</th>
            <th>Position</th>
          </tr>
        </thead>
        {#each players as { playerNum, firstName, surname, position }}
          <tr>
            <td>
              <a class="button" href="/app/teams/{id}">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </td>
            <td>{playerNum}</td>
            <td>{firstName}</td>
            <td>{surname}</td>
            <td>{position}</td>
          </tr>
        {/each}
      </table>
    {/await}
  </div>
</div>

<!--
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
-->
