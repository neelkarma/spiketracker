<script lang="ts">
  import { goto } from "$app/navigation";

  let isOpen = false;

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
        <a
          href="/app/settings"
          title="Settings"
          class="has-text-white is-hidden-touch"
        >
          <i class="fa-solid fa-gear"></i>
        </a>
        <a href="/app/settings" class="is-hidden-desktop">
          <i class="fa-solid fa-gear"></i>
          <span>Settings</span>
        </a>
      </div>
      <div class="navbar-item">
        <a href="/app/help" title="Help" class="has-text-white is-hidden-touch">
          <i class="fa-solid fa-question-circle"></i>
        </a>
        <a href="/app/help" class="is-hidden-desktop">
          <i class="fa-solid fa-question-circle"></i>
          <span>Help</span>
        </a>
      </div>
      <div class="navbar-item">
        <!-- svelte-ignore a11y-interactive-supports-focus -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          on:click={handleLogout}
          class="has-text-white is-hidden-touch"
          role="button"
          title="Log Out"
        >
          <i class="fa-solid fa-sign-out-alt"></i>
        </a>
        <!-- svelte-ignore a11y-interactive-supports-focus -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          on:click={handleLogout}
          class="is-hidden-desktop"
          role="button"
          title="Log Out"
        >
          <i class="fa-solid fa-sign-out-alt"></i>
          <span>Log Out</span>
        </a>
      </div>
    </div>
  </div>
</nav>
