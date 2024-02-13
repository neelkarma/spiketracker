<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte";

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    window.location.href = "/";
  };
</script>

<NavBar />
<button on:click={handleLogout} class="button is-primary">Logout</button>
<slot />
