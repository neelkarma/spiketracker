<script lang="ts">
  import type { LayoutServerData } from "./$types";

  export let data: LayoutServerData;
</script>

<pre>{JSON.stringify(data, undefined, 2)}</pre>
<form method="POST" action="/auth?/logout">
  <button class="button is-primary">Logout</button>
</form>
<slot />
