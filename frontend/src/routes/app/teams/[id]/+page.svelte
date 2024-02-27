<script lang="ts">
  import Stat from "$lib/components/Stat.svelte";
  import { formatAsPercentage } from "$lib/utils";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="hero">
  <div class="hero-body">
    <div class="container">
      <div class="level is-fullwidth">
        <div class="level-left">
          <div class="level-item">
            <h1 class="title is-1">{data.name}</h1>
          </div>
        </div>
        <div class="level-right">
          <Stat label="W/L" value="{data.wins}-{data.losses}" />
          <Stat label="Set Ratio" value={formatAsPercentage(data.setRatio)} />
          <Stat label="Kill Rate" value={formatAsPercentage(data.kr)} />
          <Stat
            label="Passing Efficiency"
            value={formatAsPercentage(data.pef)}
          />
        </div>
      </div>
    </div>
  </div>
</div>
<div class="section">
  <div class="container">
    <h1 class="title">Statistics by Player</h1>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Open</th>
          <th>Name</th>
        </tr>
      </thead>
    </table>
  </div>
</div>
