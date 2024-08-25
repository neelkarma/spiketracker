<script lang="ts">
  import { goto } from "$app/navigation";
  import MatchInfoForm from "$lib/components/MatchInfoForm.svelte";
  import { EMPTY_MATCH_INFO, type MatchInfo } from "$lib/types";

  let status: "loading" | "error" | null = null;

  /** This handles the submit event of the MatchInfoForm component */
  const handleSubmit = async (e: CustomEvent<MatchInfo>) => {
    status = "loading";

    // create the match with an api request
    const res = await fetch("/api/match/", {
      method: "POST",
      body: JSON.stringify(e.detail),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      await goto("/app/matches?success=1");
    } else {
      console.log(await res.text());
      status = "error";
      window.scrollTo({ top: 0 });
    }
  };
</script>

<section class="section">
  <div class="container">
    {#if status === "error"}
      <div class="notification is-danger">
        Sorry, something went wrong. Please try again in a few minutes.
      </div>
    {/if}
    <h1 class="title">New Match</h1>
    <MatchInfoForm
      submitLabel="Create"
      data={EMPTY_MATCH_INFO}
      on:submit={handleSubmit}
      on:cancel={() => window.history.back()}
    />
  </div>
</section>
