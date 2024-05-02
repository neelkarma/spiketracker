<script lang="ts">
  import { page } from "$app/stores";
  import type { MatchInfo } from "$lib/types";
  import MatchCardBody from "./MatchCardBody.svelte";
  import MatchCardDetailsPart from "./MatchCardDetailsPart.svelte";
  import MatchCardTeamsPart from "./MatchCardTeamsPart.svelte";

  export let data: MatchInfo;
</script>

<MatchCardBody>
  <MatchCardDetailsPart date={data.date} location={data.location} />
  <MatchCardTeamsPart
    ourTeamName={data.ourTeamName}
    oppTeamName={data.oppTeamName}
  />
  {#if $page.data.admin}
    <div class="level-item">
      <a class="button" href="/app/matches/edit/{data.id}">Edit</a>
    </div>
  {/if}
</MatchCardBody>
