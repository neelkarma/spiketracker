<section class="section">
  <div class="container">
    <h1 class="title">Help</h1>

    <div class="columns" style="gap: 8px;">
      <div class="column is-narrow has-background-white rounded no-print">
        <aside class="menu">
          <p class="menu-label">Contents</p>
          <ul class="menu-list">
            <li><a href="/app/help/overview">Overview</a></li>
            <li><a href="/app/help/dashboard">Dashboard</a></li>
            <li><a href="/app/help/search-and-sort">Search and Sort</a></li>
            <li><a href="/app/help/scoring">Scoring</a></li>
            <li><a href="/app/help/heatmap">Court Heatmaps</a></li>
            <li><a href="/app/help/players">Players</a></li>
            <li><a href="/app/help/teams">Teams</a></li>
            <li><a href="/app/help/matches">Matches</a></li>
            <li><a href="/app/help/printing">Printing</a></li>
            <li><a href="/app/help/support">Support</a></li>
          </ul>
        </aside>
      </div>
      <div class="column p-6 has-background-white rounded">
        <div class="content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .rounded {
    border-radius: 8px;
  }
</style>
