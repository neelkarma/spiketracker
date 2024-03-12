<script lang="ts">
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

<div class="container is-max-desktop">
  <div class="notification is-secondary">
    <div class="box">
      <div class="table-container"></div>
      <div class="section">
        <div class="container">
          <h1 class="title">{"SBHS 1sts"}</h1>
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
    </div>
  </div>
</div>
<pre>{JSON.stringify(data, undefined, 2)}</pre>
