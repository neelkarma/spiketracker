<script lang="ts">
  import { page } from "$app/stores";
  import { formatAsPercentage } from "$lib/utils";
  import Stat from "./Stat.svelte";

  export let id: number;
  export let name: string;
  export let memberCount: number;
  export let wins: number;
  export let losses: number;
  export let setRatio: number;
  export let killRate: number;
  export let passingEfficiency: number;
</script>

<a class="box" href="/app/teams/{id}">
  <div class="level">
    <div class="level-left">
      <div class="level-item">
        <div>
          <p class="title mb-5">{name}</p>
          <p class="subtitle">{memberCount} Members</p>
        </div>
      </div>
    </div>
    <div class="level-right">
      <Stat label="W/L" value="{wins}-{losses}" class="mr-4" />
      <Stat
        label="Set Ratio"
        value={formatAsPercentage(setRatio)}
        class="mr-4"
      />
      <Stat
        label="Kill Rate"
        value={formatAsPercentage(killRate)}
        class="mr-4"
      />
      <Stat
        label="Passing Efficiency"
        value={formatAsPercentage(passingEfficiency)}
        class="mr-4"
      />
      {#if $page.data.admin}
        <div class="level-item">
          <button
            class="button"
            on:click|stopPropagation|preventDefault={() => {}}
          >
            <span class="icon">
              <i class="fa-solid fa-pencil"></i>
            </span>
            <span>Edit</span>
          </button>
        </div>
      {/if}
    </div>
  </div>
</a>
