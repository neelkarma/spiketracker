<script lang="ts">
  import type { LayoutServerData } from "./$types";

  export let data: LayoutServerData;
</script>

<pre>{JSON.stringify(data, undefined, 2)}</pre>
<div class="nav flex-column">
  <div class="nav-item">
    <a class="nav-link" href="/">Dashboard</a>
  </div>
</div>
<form method="POST" action="/auth?/logout">
  <button class="btn btn-primary">Logout</button>
</form>
<slot />
