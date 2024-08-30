<script lang="ts">
  import { page } from "$app/stores";
</script>

<section class="section">
  <div class="container content">
    {#if $page.status === 404}
      <h1>Error 404</h1>
      <h2>The page you have requested does not exist.</h2>
      <a href="/" class="button is-primary">Back to Safety</a>
    {:else}
      <h1>Whoops!</h1>
      <h2>Looks like something went wrong.</h2>
      {#if $page.data.admin}
        <p>Please contact the developers, and send the error details below.</p>
      {:else}
        <p>
          Most likely, you were not allowed access to the page you were going
          to.
        </p>
        <p>If not, please contact your coach for support.</p>
      {/if}
      <details class="mb-2">
        <summary>Click to expand error details.</summary>
        <div>
          <p>Error Code: {$page.status}</p>
          <p>Error Message: <code>{$page.error?.message}</code></p>
        </div>
      </details>
      <a href="/app" class="button is-primary">Back to Safety</a>
    {/if}
  </div>
</section>
