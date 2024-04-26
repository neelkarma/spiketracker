<script lang="ts">
  import type { MatchInfo } from "$lib/types";
  import MatchCardBody from "./MatchCardBody.svelte";
  import MatchCardDetailsPart from "./MatchCardDetailsPart.svelte";
  import MatchCardScorecardPart from "./MatchCardScorecardPart.svelte";

  export let data: MatchInfo;
</script>

<MatchCardBody>
  <MatchCardDetailsPart date={data.date} location={data.location} />
  {#if data.points}
    <MatchCardScorecardPart
      ourTeamName={data.ourTeamName}
      oppTeamName={data.oppTeamName}
      points={data.points}
    />
  {:else}
    <div class="level-item">
      <p>No Results Yet</p>
      <button class="button" on:click={() => window.location.reload()}
        >Refresh</button
      >
    </div>
  {/if}
  <div class="level-item">
    <a class="button" href="/app/matches/edit/{data.id}">Edit</a>
  </div>
</MatchCardBody>
