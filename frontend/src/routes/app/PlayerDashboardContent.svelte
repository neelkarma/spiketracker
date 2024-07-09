<script>
  import { page } from "$app/stores";

  import Stat from "$lib/components/Stat.svelte";
  import TeamCard from "$lib/components/TeamCard.svelte";
</script>

<div class="block">
  <div class="title">Your Stats</div>
  <div class="columns">
    <div class="column">
      <div class="box">
        <div class="fixed-grid">
          <div class="grid">
            <div class="cell">
              <Stat label="Kill Rate" value={$page.data.kr.toFixed(3)} />
            </div>
            <div class="cell">
              <Stat
                label="Passing Efficiency"
                value={$page.data.pef.toFixed(3)}
              />
            </div>
            <div class="cell">
              <Stat label="Total Points" value={$page.data.totalPoints} />
            </div>
            <div class="cell">
              <Stat label="Total Matches" value={$page.data.matchIds.length} />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column">
      <div class="box">(todo: insert heatmap here)</div>
    </div>
  </div>
</div>

<div class="block">
  <div class="title">
    {#if $page.data.teams.length === 1}
      Your Team
    {:else}
      Your Teams
    {/if}
  </div>
  {#each $page.data.teams as team}
    <TeamCard data={team} />
  {/each}
</div>
