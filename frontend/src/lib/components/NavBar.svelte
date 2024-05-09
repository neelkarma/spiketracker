<script lang="ts">
  import { logout } from "$lib/utils";

  let isOpen = false;
</script>

<nav class="navbar is-primary" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/app">
      <span class="icon-text">
        <span class="icon is-size-4">
          <i class="fa-solid fa-volleyball"></i>
        </span>
        <span class="has-text-weight-bold">SpikeTracker</span>
      </span>
    </a>

    <!-- svelte-ignore a11y-interactive-supports-focus -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      role="button"
      class="navbar-burger"
      aria-label="menu"
      aria-expanded="false"
      data-target="navbar"
      on:click={() => (isOpen = !isOpen)}
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbar" class="navbar-menu" class:is-active={isOpen}>
    <div class="navbar-start">
      <a class="navbar-item" href="/app">Dashboard</a>
      <a class="navbar-item" href="/app/matches">Matches</a>
      <a class="navbar-item" href="/app/teams">Teams</a>
      <a class="navbar-item" href="/app/players">Players</a>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <a href="/app/settings" class="has-text-white">
          <i class="fa-solid fa-gear"></i>
          <span class="is-hidden-desktop">Settings</span>
        </a>
      </div>
      <div class="navbar-item">
        <a href="/app/help" class="has-text-white">
          <i class="fa-solid fa-question-circle"></i>
          <span class="is-hidden-desktop">Help</span>
        </a>
      </div>
      <div class="navbar-item">
        <!-- svelte-ignore a11y-interactive-supports-focus -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          on:click={logout}
          role="button"
          title="Log Out"
          class="has-text-white"
        >
          <i class="fa-solid fa-sign-out-alt"></i>
          <span class="is-hidden-desktop">Log Out</span>
        </a>
      </div>
    </div>
  </div>
</nav>
