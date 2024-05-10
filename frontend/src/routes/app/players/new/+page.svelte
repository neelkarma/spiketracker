<script lang="ts">
  import { goto } from "$app/navigation";
  import PlayerInfoForm from "$lib/components/PlayerInfoForm.svelte";
  import { EMPTY_PLAYER_INFO, type PlayerInfo } from "$lib/types";
  import { wait } from "$lib/utils";

  let status: "loading" | "error" | null = null;

  const handleSubmit = async (e: CustomEvent<PlayerInfo>) => {
    status = "loading";

    // simulate network delay
    await wait(1000);

    // TODO: again, how to give user feedback that it was successful?
    await goto("/app/players");
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
