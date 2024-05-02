<script lang="ts">
  import { goto } from "$app/navigation";
  import MatchInfoForm from "$lib/components/MatchInfoForm.svelte";
  import { EMPTY_MATCH_INFO, type MatchInfo } from "$lib/types";
  import { wait } from "$lib/utils";

  let status: "loading" | "error" | null = null;

  const handleSubmit = async (e: CustomEvent<MatchInfo>) => {
    status = "loading";

    // simulate network delay
    await wait(1000);

    // TODO: again, how to give user feedback that it was successful?
    await goto("/app/matches");
  };
</script>

<section class="section">
  <div class="container">
    <h1 class="title">New Match</h1>
    <MatchInfoForm
      submitLabel="Create"
      data={EMPTY_MATCH_INFO}
      on:submit={handleSubmit}
      on:cancel={() => window.history.back()}
    />
  </div>
</section>
