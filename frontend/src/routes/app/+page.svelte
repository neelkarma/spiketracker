<script lang="ts">
  import MatchApproveCard from "$lib/components/MatchApproveCard.svelte";
  import MatchUpcomingCard from "$lib/components/MatchUpcomingCard.svelte.svelte";
  import Stat from "$lib/components/Stat.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<section class="section pt-5">
  <div class="container is-flex is-flex-direction-column">
    <div class="columns is-desktop is-align-self-center">
      {#if data.admin}
        <div class="column is-narrow">
          <div class="box">
            <h1 class="title is-4">Matches to Approve</h1>
            {#each { length: 5 } as _}
              <div class="is-align-self-center mb-3">
                <MatchApproveCard
                  date={new Date(2024, 0, 2, 9, 0)}
                  location="SBHS Gymnasium"
                  ourTeamName="SBHS 1sts"
                  oppTeamName="Newington 2nds"
                  points={[
                    { our: 25, opp: 20 },
                    { our: 26, opp: 14 },
                    { our: 28, opp: 23 },
                  ]}
                  matchId={1}
                />
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div class="column is-narrow">
          <div class="box">
            <h1 class="title is-4">Your Stats</h1>
            <Stat label="Avg PPG" value={12} class="mb-2"></Stat>
            <Stat label="Kill Rate" value="50%" class="mb-2"></Stat>
            <Stat label="Passing Efficiency" value="50%" class="mb-2"></Stat>
            <Stat label="Total Points" value={100} class="mb-2"></Stat>
          </div>
        </div>
      {/if}
      <div class="column is-narrow">
        <div class="box">
          <h1 class="title is-4">Upcoming Matches</h1>
          <div class="is-flex is-flex-direction-column">
            {#each { length: 5 } as _}
              <div class="is-align-self-center mb-3">
                <MatchUpcomingCard
                  date={new Date(2024, 0, 2, 9, 0)}
                  location="SBHS Gymnasium"
                  ourTeamName="SBHS 1sts"
                  oppTeamName="Newington 2nds"
                />
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
