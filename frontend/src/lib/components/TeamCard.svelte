<script lang="ts">
  import { page } from "$app/stores";
  import type { TeamInfo } from "$lib/types";
  import Stat from "./Stat.svelte";

  export let data: TeamInfo;
</script>

<a class="box" href="/app/teams/{data.id}">
  <div class="level">
    <div class="level-left">
      <div class="level-item">
        <div>
          <p class="title mb-5">
            {#if $page.data.admin}
              <span class="icon" style="font-size: 1.25rem;">
                {#if data.visible}
                  <i
                    class="fa-solid fa-eye"
                    title="All players can see this team."
                  ></i>
                {:else}
                  <i
                    class="fa-solid fa-eye-slash"
                    title="Only you can see this team."
                  ></i>
                {/if}
              </span>
            {/if}
            <span>{data.name}</span>
          </p>
          <p class="subtitle">{data.playerIds.length} Members</p>
        </div>
      </div>
    </div>
    <div class="level-right">
      <Stat label="W/L" value="{data.wins}-{data.losses}" class="mr-4" />
      <Stat label="Set Ratio" value={data.setRatio.toFixed(3)} class="mr-4" />
      <Stat label="Kill Rate" value={data.kr.toFixed(3)} class="mr-4" />
      <Stat
        label="Passing Efficiency"
        value={data.pef.toFixed(3)}
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
