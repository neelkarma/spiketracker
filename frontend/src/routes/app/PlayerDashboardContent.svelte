<script>
  import { page } from "$app/stores";

  import Stat from "$lib/components/Stat.svelte";
  import StatHeatmap from "$lib/components/StatHeatmap.svelte";
  import TeamCard from "$lib/components/TeamCard.svelte";
</script>

<div class="block">
  <div class="title">Your Stats</div>
  <div class="box" style="height: 100%;">
    <div class="fixed-grid has-4-cols has-2-cols-mobile">
      <div class="grid">
        <div class="cell">
          <Stat label="Kill Rate" value={$page.data.kr.toFixed(3)} />
        </div>
        <div class="cell">
          <Stat label="Passing Efficiency" value={$page.data.pef.toFixed(3)} />
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
  <div class="box">
    <StatHeatmap type="player" id={$page.data.id} width={280} />
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
  {#if $page.data.teams.length === 0}
    <div class="block">
      You are currently not a member of any team. Please ask your coach to add
      you to one.
    </div>
  {:else}
    {#each $page.data.teams as team}
      <TeamCard data={team} />
    {/each}
  {/if}
</div>
