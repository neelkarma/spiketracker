<script lang="ts">
  import { goto } from "$app/navigation";
  import TeamInfoForm from "$lib/components/TeamInfoForm.svelte";
  import type { TeamInfo } from "$lib/types";
  import type { PageData } from "./$types";

  export let data: PageData;

  let status: "success" | "loading" | "error" | null = null;

  /** this handles the submit event of the TeamInfoForm component */
  const handleSubmit = async (e: CustomEvent<TeamInfo>) => {
    const team = e.detail;

    status = "loading";

    // api request to update the team
    const res = await fetch(`/api/team/${team.id}`, {
      method: "PUT",
      body: JSON.stringify(team),
      headers: {
        "Content-Type": "application/json",
      },
    });

    window.scrollTo({ top: 0 });

    if (res.ok) {
      status = "success";
    } else {
      status = "error";
      console.log(await res.text());
    }
  };

  /** this handles the delete event */
  const handleDelete = async () => {
    status = "loading";

    // api request to delete the team
    const res = await fetch(`/api/team/${data.team.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await goto("/app/teams?success=1");
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
    {:else if status === "error"}
      <div class="notification is-danger">
        Sorry, something went wrong. Please try again after a few minutes.
      </div>
    {/if}

    <h1 class="title block">Edit Team</h1>
    <TeamInfoForm
      data={data.team}
      players={data.players}
      showDelete
      isLoading={status === "loading"}
      on:submit={handleSubmit}
      on:delete={handleDelete}
      on:cancel={() => window.history.back()}
    />
  </div>
</section>
