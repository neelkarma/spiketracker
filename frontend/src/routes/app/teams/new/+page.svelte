<script lang="ts">
  import { goto } from "$app/navigation";
  import TeamInfoForm from "$lib/components/TeamInfoForm.svelte";
  import { EMPTY_TEAM_INFO, type TeamInfo } from "$lib/types";
  import { wait } from "$lib/utils";

  let status: "loading" | "error" | null = null;

  const handleSubmit = async (e: CustomEvent<TeamInfo>) => {
    status = "loading";

    // simulate network delay
    await wait(1000);

    // TODO: again, how to give user feedback that it was successful?
    await goto("/app/teams");
  };
</script>

<section class="section">
  <div class="container">
    <h1 class="title">New Match</h1>
    <TeamInfoForm
      submitLabel="Create"
      data={EMPTY_TEAM_INFO}
      on:submit={handleSubmit}
      on:cancel={() => window.history.back()}
    />
  </div>
</section>
