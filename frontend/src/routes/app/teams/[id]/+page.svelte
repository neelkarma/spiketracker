<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="hero is-primary">
  <div class="hero-body has-text-centered">
    <div class="container">
      <h2 class="title">{data.date.toDateString()}</h2>
      <h3 class="subtitle">{data.location}</h3>
      <div class="columns is-centered">
        <h2 class="column is-5 has-text-right title">{data.ourTeamName}</h2>
        <h1 class="column is-2 title">
          {data.sets.reduce((acc, { ourScore }) => acc + ourScore, 0)}
          :
          {data.sets.reduce((acc, { oppScore }) => acc + oppScore, 0)}
        </h1>

        <h2 class="column is-5 has-text-left title">{data.oppTeamName}</h2>
      </div>
      <div class="columns is-centered"></div>
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
