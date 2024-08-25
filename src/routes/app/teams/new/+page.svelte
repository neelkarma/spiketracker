<script lang="ts">
  import { goto } from "$app/navigation";
  import TeamInfoForm from "$lib/components/TeamInfoForm.svelte";
  import { EMPTY_TEAM_INFO, type TeamInfo } from "$lib/types";

  let status: "loading" | "error" | null = null;

  /** this handles the submit event of the TeamInfoForm component */
  const handleSubmit = async (e: CustomEvent<TeamInfo>) => {
    status = "loading";

    // api request to create the team
    const res = await fetch("/api/team/", {
      method: "POST",
      body: JSON.stringify(e.detail),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      await goto("/app/teams?success=1");
    } else {
      console.log(await res.text());
      status = "error";
      window.scrollTo({ top: 0 });
    }
  };
</script>

<section class="section">
  <div class="container">
    <h1 class="title">New Team</h1>
    {#if status === "error"}
      <div class="notification is-danger">
        Sorry, something went wrong. Please try again in a few moments.
      </div>
    {/if}
    <TeamInfoForm
      submitLabel="Create"
      data={EMPTY_TEAM_INFO}
      on:submit={handleSubmit}
      on:cancel={() => window.history.back()}
    />
  </div>
</section>
