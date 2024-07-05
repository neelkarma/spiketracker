<script lang="ts">
  import MatchApproveCard from "$lib/components/MatchApproveCard.svelte";
  import MatchUpcomingCard from "$lib/components/MatchUpcomingCard.svelte.svelte";
  import Stat from "$lib/components/Stat.svelte";
  import { SAMPLE_MATCH_INFO } from "$lib/types";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<section class="section pt-5">
  <div class="container is-flex is-flex-direction-column">
    <div class="columns is-desktop is-align-self-center">
      {#if data.admin}
        <div class="column is-narrow">
          <div class="box" style="background-color: #094369">
            <h1 class="title is-4" style="color: white">Matches to Approve</h1>
          </div>
          <div class="box" style="background-color: #91a3b0">
            <!-- #90b5ce-->
            {#each { length: 5 } as _}
              <div class="is-align-self-center mb-3">
                <MatchApproveCard data={SAMPLE_MATCH_INFO} />
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
        <div class="box" style="background-color: #094369">
          <h1 class="title is-4" style="color: white">Upcoming Matches</h1>
        </div>
        <div class="box" style="background-color: #91a3b0">
          <div class="is-flex is-flex-direction-column">
            {#each { length: 5 } as _}
              <div class="is-align-self-center mb-3">
                <MatchUpcomingCard data={SAMPLE_MATCH_INFO} />
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
