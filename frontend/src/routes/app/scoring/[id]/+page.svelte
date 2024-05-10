<script lang="ts">
  import type { TeamInfo } from "$lib/types";

  export let data: TeamInfo;
</script>

<div class="columns">
  <div class="column is-narrow"></div>
  <div class="column"></div>
  <div class="column is-narrow"></div>
</div>
<div>aaaaaaaa</div>
<pre>{JSON.stringify(data, undefined, 2)}</pre>
