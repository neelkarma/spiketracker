<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="columns is-mobile is-centered is-vcentered is-fullheight">
  <form method="POST" action="/auth?/sbhsLogin" class="column is-half">
    {#if $page.url.searchParams.has("error")}
      <div class="notification is-danger" role="alert">
        Error: {$page.url.searchParams.get("error")}
      </div>
    {/if}
    <h1 class="title">SpikeTracker</h1>
    <h5 class="subtitle">Volleyball reporting software for SBHS.</h5>
    <button class="button is-primary">Student Login</button>
    <a class="button" href="/auth/admin">Coach Login</a>
  </form>
</div>
