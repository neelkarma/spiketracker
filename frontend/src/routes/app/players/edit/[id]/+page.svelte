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

    // simulate network
    await wait(1000);

    window.scrollTo({ top: 0 });
    status = "success";
  };

  const handleDelete = async (e: CustomEvent) => {
    status = "loading";

    // simulate network
    await wait(1000);

    // TODO: how to give user feedback of success?
    await goto("/app/players");
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
