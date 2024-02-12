<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte";
  import type { LayoutServerData } from "./$types";

  export let data: LayoutServerData;
</script>

<NavBar />
<pre>{JSON.stringify(data, undefined, 2)}</pre>
<form method="POST" action="/auth?/logout">
  <button class="button is-primary">Logout</button>
</form>
<slot />
