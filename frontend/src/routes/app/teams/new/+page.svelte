<script lang="ts">
  import { goto } from "$app/navigation";
  import TeamInfoForm from "$lib/components/TeamInfoForm.svelte";
  import { EMPTY_TEAM_INFO, type TeamInfo } from "$lib/types";
  import { wait } from "$lib/utils";

  let status: "loading" | "error" | null = null;

  const handleSubmit = async (e: CustomEvent<TeamInfo>) => {
    status = "loading";

    const res = await fetch("/api/team/", {
      method: "POST",
      body: JSON.stringify(e.detail),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
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
    <TeamInfoForm
      submitLabel="Create"
      data={EMPTY_TEAM_INFO}
      on:submit={handleSubmit}
      on:cancel={() => window.history.back()}
    />
  </div>
</section>
