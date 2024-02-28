<script lang="ts">
  import { goto } from "$app/navigation";

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    goto("/");
  };
</script>

<nav class="navbar is-primary" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/app">
      <h1 class="has-text-weight-bold">SpikeTracker</h1>
    </a>

    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      role="button"
      class="navbar-burger"
      aria-label="menu"
      aria-expanded="false"
      data-target="navbar"
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbar" class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item" href="/app">Dashboard</a>
      <a class="navbar-item" href="/app/matches">Matches</a>
      <a class="navbar-item" href="/app/teams">Teams</a>
      <a class="navbar-item" href="/app/players">Players</a>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <a href="/app/settings" class="has-text-white" title="Settings">
          <i class="fa-solid fa-gear"></i>
        </a>
      </div>
      <div class="navbar-item">
        <a href="/app/help" class="has-text-white" title="Help">
          <i class="fa-solid fa-question-circle"></i>
        </a>
      </div>
      <div class="navbar-item">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a
          on:click={handleLogout}
          class="has-text-white"
          role="button"
          href="#"
          title="Log Out"
        >
          <i class="fa-solid fa-sign-out-alt"></i>
        </a>
      </div>
    </div>
  </div>
</nav>
