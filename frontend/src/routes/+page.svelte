<script>
  import { page } from "$app/stores";
</script>

<div class="columns is-mobile is-centered is-vcentered is-fullheight">
  <div class="column is-half">
    {#if $page.url.searchParams.has("error")}
      <div class="notification is-danger" role="alert">
        Error: {$page.url.searchParams.get("error")}
      </div>
    {/if}
    <h1 class="title">SpikeTracker</h1>
    <h5 class="subtitle">Volleyball reporting software for SBHS.</h5>
    <a href="/api/auth/login/sbhs" class="button is-primary">Student Login</a>
    <a class="button" href="/adminauth">Coach Login</a>
  </div>
</div>
