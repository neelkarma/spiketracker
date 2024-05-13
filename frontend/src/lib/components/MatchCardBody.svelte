<script lang="ts">
  export let compress = true;
  export let href: string | undefined = undefined;
</script>

{#if href}
  <a {href} class="box py-1 px-3" class:compress>
    <div class="level" class:compress><slot /></div>
  </a>
{:else}
  <div class="box py-1 px-3" class:compress>
    <div class="level" class:compress><slot /></div>
  </div>
{/if}
