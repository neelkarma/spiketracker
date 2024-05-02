<script lang="ts">
  import type { PageServerData } from "./$types";

  export let data: PageServerData;
</script>

<div class="content">
  {@html data.html}
</div>
