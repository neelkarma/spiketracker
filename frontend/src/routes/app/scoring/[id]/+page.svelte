<script lang="ts">
  import ScoringNavBar from "$lib/components/ScoringNavBar.svelte";
  import type { TeamInfo } from "$lib/types";

  export let data: TeamInfo;
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
  <div class="column"></div>
  <div class="column is-narrow"></div>
</div>
