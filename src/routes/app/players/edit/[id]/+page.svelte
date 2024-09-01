<script lang="ts">
  import { goto } from "$app/navigation";
  import PlayerInfoForm from "$lib/components/PlayerInfoForm.svelte";
  import type { PlayerInfo } from "$lib/types";
  import type { PageData } from "./$types";

  export let data: PageData;

  let status: "loading" | "error" | null = null;

  /** This handles the submit event of the PlayerInfoForm component */
  const handleSubmit = async (e: CustomEvent<PlayerInfo>) => {
    const player = e.detail;

    status = "loading";

    // make api call to update the player
    const res = await fetch(`/api/player/${player.id}`, {
      method: "PUT",
      body: JSON.stringify(player),
      headers: {
        "Content-Type": "application/json",
      },
    });

    window.scrollTo({ top: 0 });

    if (res.ok) {
      goto("/app/players?success=1");
    } else {
      status = "error";
      console.log(await res.text());
    }
  };

  /** this handles the delete event of the PlayerInfoForm component */
  const handleDelete = async () => {
    status = "loading";

    // api call to delete the player
    const res = await fetch(`/api/player/${data.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // we redirect back to the player list on success
      await goto("/app/players?success=1");
    } else {
      status = "error";
      console.log(await res.text());
    }
  };
</script>

<section class="section">
  <div class="container">
    {#if status === "error"}
      <div class="notification is-danger">
        Sorry, something went wrong. Is the student's ID correct?
      </div>
    {/if}

    <h1 class="title block">Edit Player</h1>
    <PlayerInfoForm
      {data}
      showDelete
      isLoading={status === "loading"}
      on:submit={handleSubmit}
      on:delete={handleDelete}
      on:cancel={() => window.history.back()}
    />
  </div>
</section>
