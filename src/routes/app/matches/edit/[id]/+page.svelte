<script lang="ts">
  import { goto } from "$app/navigation";
  import MatchInfoForm from "$lib/components/MatchInfoForm.svelte";
  import type { MatchInfo } from "$lib/types";
  import type { PageData } from "./$types";

  export let data: PageData;

  let status: "success" | "loading" | "error" | null = null;

  /** This handles the submit event of the MatchInfoForm component */
  const handleSubmit = async (e: CustomEvent<MatchInfo>) => {
    const match = e.detail;

    status = "loading";

    // make api request to update match
    const res = await fetch(`/api/match/${match.id}`, {
      method: "PUT",
      body: JSON.stringify(match),
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

  /** This handles the delete event of the MatchInfoForm */
  const handleDelete = async () => {
    status = "loading";

    // make the api request to delete the match
    const res = await fetch(`/api/match/${data.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await goto("/app/matches?success=1");
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
        Sorry, something went wrong. Please try again in a few minutes.
      </div>
    {/if}

    <h1 class="title block">Edit Match</h1>
    <MatchInfoForm
      {data}
      showDelete
      isLoading={status === "loading"}
      on:submit={handleSubmit}
      on:delete={handleDelete}
      on:cancel={() => window.history.back()}
    />
  </div>
</section>
