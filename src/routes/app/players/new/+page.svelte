<script lang="ts">
  import { goto } from "$app/navigation";
  import PlayerInfoForm from "$lib/components/PlayerInfoForm.svelte";
  import { EMPTY_PLAYER_INFO, type PlayerInfo } from "$lib/types";

  let status: "loading" | "error" | null = null;

  /** handles the submit event of the PlayerInfoForm, creating the player */
  const handleSubmit = async (e: CustomEvent<PlayerInfo>) => {
    status = "loading";

    // makes the api call to create the new player
    const res = await fetch("/api/player/", {
      method: "POST",
      body: JSON.stringify(e.detail),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      await goto("/app/players?success=1");
    } else {
      console.log(await res.text());
      status = "error";
      window.scrollTo({ top: 0 });
    }
  };
</script>

<section class="section">
  <div class="container">
    <h1 class="title">New Player</h1>
    {#if status === "error"}
      <div class="notification is-danger">
        Sorry, something went wrong. Is the student's ID correct?
      </div>
    {/if}
    <PlayerInfoForm
      submitLabel="Add"
      data={EMPTY_PLAYER_INFO}
      on:submit={handleSubmit}
      on:cancel={() => window.history.back()}
    />
  </div>
</section>
