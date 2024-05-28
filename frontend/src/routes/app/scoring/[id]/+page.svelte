<script lang="ts">
  import ScoringNavBar from "$lib/components/ScoringNavBar.svelte";
  import type { TeamInfo } from "$lib/types";
  import svg from "../../../../assets/volleyball-court.svg?raw";

  export let data: TeamInfo;

  const handleClick = (e: MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gridX = Math.floor((x / rect.width) * 20);
    const gridY = Math.floor((y / rect.height) * 20);

    console.log(gridX, gridY);
  };
</script>

<ScoringNavBar />
<div class="columns is-fullheight">
  <div class="column is-narrow p-5">
    <div class="field">
      <label for="set-input" class="label">Current Set</label>
      <div class="control">
        <div class="select">
          <select id="set-input">
            <option value="1">Set 1</option>
            <option value="2">Set 2</option>
            <option value="3">Set 3</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <div class="column">
    <div on:click={handleClick}>{@html svg}</div>
  </div>
  <div class="column is-narrow"></div>
</div>
