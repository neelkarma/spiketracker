<script lang="ts">
  import { goto } from "$app/navigation";
  import PlayerInfoForm from "$lib/components/PlayerInfoForm.svelte";
  import type { PlayerInfo } from "$lib/types";
  import { wait } from "$lib/utils";
  import type { PageData } from "./$types";

  export let data: PageData;

  let status: "success" | "loading" | "error" | null = null;

  const handleSubmit = async (e: CustomEvent<PlayerInfo>) => {
    const player = e.detail;

    status = "loading";

    const res = await fetch(`/api/player/${player.id}`, {
      method: "PUT",
      body: JSON.stringify(player),
    });

    window.scrollTo({ top: 0 });
    if (res.status === 200) {
      status = "success";
    } else {
      status = "error";
      console.log(await res.text());
    }
  };

  const handleDelete = async (e: CustomEvent) => {
    status = "loading";

    const res = await fetch(`/api/player/${data.id}`, {
      method: "DELETE",
    });

    if (res.status === 200) {
      await goto("/app/players?success=1");
    } else {
      status = "error";
      console.log(await res.text());
    }
  };
</script>

<section class="section">
  <div class="container">
    {#if status === "success"}
      <div class="notification is-success">Successfully updated.</div>
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
