<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="hero is-primary">
  <div class="hero-body has-text-centered">
    <div class="container">
      <h2 class="title">{data.date.toDateString()}</h2>
      <h3 class="subtitle">{data.location}</h3>
      <div class="columns is-centered is-vcentered">
        <div class="column is-5">
          <h2 class="has-text-right title">{data.ourTeamName}</h2>
        </div>
        <div class="column is-2">
          <h1 class="title is-1">
            {data.points.reduce((acc, { our }) => acc + our, 0)}
            :
            {data.points.reduce((acc, { opp }) => acc + opp, 0)}
          </h1>
        </div>
        <div class="column is-5">
          <h2 class="has-text-left title">{data.oppTeamName}</h2>
        </div>
      </div>
      <div class="columns is-centered">
        {#each data.points as { our, opp }}
          <div class="column is-1 is-flex is-justify-content-center">
            <h3 class="subtitle" class:has-text-weight-bold={our > opp}>
              {our}
            </h3>
            <h3 class="subtitle">-</h3>
            <h3 class="subtitle" class:has-text-weight-bold={opp > our}>
              {opp}
            </h3>
          </div>
        {/each}
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
