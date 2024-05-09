<section class="section">
  <div class="container">
    <h1 class="title">Help</h1>

    <div class="columns">
      <div class="column is-narrow">
        <aside class="menu">
          <p class="menu-label">Users</p>
          <ul class="menu-list">
            <li><a href="/app/help/quick-start">Quick Help</a></li>

            <li><a href="/app/help/dashboard">Dashboard</a></li>
            <li><a href="/app/help/search-and-sort">Search and Sort</a></li>
            <li><a href="/app/help/matches">Matches</a></li>
            <li><a href="/app/help/players">Players</a></li>
            <li><a href="/app/help/teams">Teams</a></li>
          </ul>
          <p class="menu-label">Administration</p>
          <ul class="menu-list">
            <li><a href="/app/help/scoring">Scoring</a></li>
            <li><a href="/app/help/reviewing-matches">Reviewing Matches</a></li>
            <li><a href="/app/help/team-settings">Team Settings</a></li>
            <li><a href="/app/help/andrew-wang">Andrew Wang</a></li>
          </ul>
        </aside>
      </div>
      <div class="column p-6 has-background-light" id="content">
        <slot />
      </div>
    </div>
  </div>
</section>

<style>
  #content {
    border-radius: 16px;
  }
</style>
