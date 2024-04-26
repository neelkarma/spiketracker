<script lang="ts">
  import { page } from "$app/stores";
  import type { TeamInfo } from "$lib/types";
  import { formatAsPercentage } from "$lib/utils";
  import Stat from "./Stat.svelte";

  export let data: TeamInfo;
</script>

<a class="box" href="/app/teams/{data.id}">
  <div class="level">
    <div class="level-left">
      <div class="level-item">
        <div>
          <p class="title mb-5">{data.name}</p>
          <p class="subtitle">{data.playerIds.length} Members</p>
        </div>
      </div>
    </div>
    <div class="level-right">
      <Stat label="W/L" value="{data.wins}-{data.losses}" class="mr-4" />
      <Stat
        label="Set Ratio"
        value={formatAsPercentage(data.setRatio)}
        class="mr-4"
      />
      <Stat
        label="Kill Rate"
        value={formatAsPercentage(data.kr)}
        class="mr-4"
      />
      <Stat
        label="Passing Efficiency"
        value={formatAsPercentage(data.pef)}
        class="mr-4"
      />
      {#if $page.data.admin}
        <div class="level-item">
          <a class="button" href="/app/teams/edit/{data.id}">
            <span class="icon">
              <i class="fa-solid fa-pencil"></i>
            </span>
            <span>Edit</span>
          </a>
        </div>
      {/if}
    </div>
  </div>
</a>
