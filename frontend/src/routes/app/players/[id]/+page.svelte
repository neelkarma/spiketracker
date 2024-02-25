<script lang="ts">
  import Stat from "$lib/components/Stat.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
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
          <Stat label="Avg PPG" value={data.stats.ppg} />
          <Stat label="Kill Rate" value="{data.stats.kr}%" />
          <Stat label="Passing Efficiency" value="{data.stats.pef}%" />
          <Stat label="Total Points" value={data.stats.totalPoints} />
        </div>
      </div>
    </div>
  </div>
</div>
<div class="section">
  <div class="container">
    <h1 class="title">Match History</h1>
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
    </table>
  </div>
</div>
