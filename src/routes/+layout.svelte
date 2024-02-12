<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte";
  import "../styles.scss";
</script>

<svelte:head>
  <title>SpikeTracker</title>
</svelte:head>

<NavBar />
<slot />
