<script lang="ts">
  import { goto } from "$app/navigation";
  import PlayerInfoForm from "$lib/components/PlayerInfoForm.svelte";
  import { EMPTY_PLAYER_INFO, type PlayerInfo } from "$lib/types";

  let status: "loading" | "error" | null = null;

  const handleSubmit = async (e: CustomEvent<PlayerInfo>) => {
    status = "loading";

    const res = await fetch("/api/player", {
      method: "POST",
      body: JSON.stringify(e.detail),
    });

    if (res.status === 200) {
      await goto("/app/players?success=1");
    } else {
      console.log(await res.text());
      await goto("/app/players?success=0");
    }
  };
</script>

<section class="section">
  <div class="container">
    <h1 class="title">New Player</h1>
    <PlayerInfoForm
      submitLabel="Add"
      data={EMPTY_PLAYER_INFO}
      on:submit={handleSubmit}
      on:cancel={() => window.history.back()}
    />
  </div>
</section>
