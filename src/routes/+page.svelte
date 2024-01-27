<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="fullheight d-flex align-items-center justify-content-center">
  <form
    method="POST"
    action="/auth?/sbhsLogin"
    class="d-flex flex-column gap-1"
  >
    {#if $page.url.searchParams.has("error")}
      <div class="alert alert-danger" role="alert">
        {$page.url.searchParams.get("error")}
      </div>
    {/if}
    <h1>SpikeTracker</h1>
    <h5>Volleyball reporting software for SBHS.</h5>
    <button class="btn btn-primary">Student Login</button>
    <a class="btn btn-dark" href="/auth/admin">Coach Login</a>
  </form>
</div>
