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
        id: 0,
        playernum: 123,
        firstName: "ovuvuevuevue enyetuenwuevue ugbemugbem osas",
        surname: "ovuvuevuevue enyetuenwuevue ugbemugbem osas",
        position: "Setter",
      },
      {
        id: 0,
        playernum: 0,
        firstName: "Guppy",
        surname: "Gup",
        position: "Defensive Specialist",
      },
      {
        id: 0,
        playernum: 0,
        firstName: "Guppy",
        surname: "Gup",
        position: "Middle Blocker",
      },
      {
        id: 0,
        playernum: 0,
        firstName: "Guppy",
        surname: "Gup",
        position: "Outside Hitter",
      },
      {
        id: 0,
        playernum: 0,
        firstName: "Guppy",
        surname: "Gup",
        position: "Opposite Hitter",
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
            <th>No.</th>
            <th>Firstname</th>
            <th>Surname</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {#each players as { playernum, firstName, surname, position, id }}
            <tr>
              <td>{playernum}</td>
              <td>{firstName}</td>
              <td>{surname}</td>
              <td>{position}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/await}
  </div>
</div>
