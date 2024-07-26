<script lang="ts">
  import type { PageData } from "./$types";
  import CoachDashboardContent from "./CoachDashboardContent.svelte";
  import PlayerDashboardContent from "./PlayerDashboardContent.svelte";

  export let data: PageData;
</script>

<section class="section">
  <div class="container">
    {#if data.currentlyScoring}
      <div class="notification is-primary">
        <div class="level">
          <div class="level-left">
            <div class="level-item has-text-weight-bold">
              There are matches currently open for scoring.
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <a href="/app/matches" class="button has-text-weight-bold">
                Go
              </a>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <h1 class="title is-4">
      Welcome, {#if data.admin}Coach{:else}{data.firstName}{/if}.
    </h1>

    {#if data.admin}
      <CoachDashboardContent />
    {:else}
      <PlayerDashboardContent />
    {/if}
  </div>
</section>
