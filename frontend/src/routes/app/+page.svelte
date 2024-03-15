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

<div class="columns is-mobile">
  <div class="column is-half">
    <strong>Matches to Approve</strong>
    <div class="container">
      <div class="notification is-secondary">
        <div class="box">
          <div class="columns">
            <div class="column is-3">
              <h1>2 Jan</h1>
              <p>9:00-10:00</p>
              <h2>SBHS Gym</h2>
            </div>
            <div class="column is-8">
              <div class="container">
                <div class="columns">
                  <div class="column is-one-fifth">SBHS</div>
                  <div class="column">Q1</div>
                  <div class="column">Q2</div>
                  <div class="column">Q3</div>
                  <div class="column">Q4</div>
                </div>
              </div>
              <div class="container">
                <div class="columns">
                  <div class="column is-one-fifth">Newington</div>
                  <div class="column">Q1</div>
                  <div class="column">Q2</div>
                  <div class="column">Q3</div>
                  <div class="column">Q4</div>
                </div>
              </div>
            </div>
            <div class="column">
              <h1>APPROVE</h1>
              <img src="/images/tick.png" alt="My Image" />
              <h1>EDIT</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column">
      <strong>Admin Actions</strong>
      <div class="container">
        <div class="notification is-secondary">
          <div class="box">
            <div class="columns">
              <div class="column"></div>
              <div class="column"></div>
              <div class="column"></div>
              <div class="column"></div>
            </div>
          </div>
          <div class="box"></div>
          <div class="box"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="column is-half">
    <strong>Upcoming Matches</strong>
    <div class="container">
      <div class="notification is-secondary">
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
      </div>
    </div>
  </div>
</div>

<pre>{JSON.stringify(data, undefined, 2)}</pre>
