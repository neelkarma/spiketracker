<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { MatchInfo } from "$lib/types";

  export let data: MatchInfo;

  $: date = new Date(data.time);
  $: hasScoringPermission = $page.data.admin || data.scoring;
</script>

<div class="box">
  <div class="level">
    <div class="level-left">
      <div class="level-item">
        <div>
          <p class="title is-5 pb-1">
            {#if $page.data.admin}
              <span class="icon is-medium">
                {#if data.visible && data.scoring}
                  <i
                    class="fa-solid fa-pencil"
                    title="All players can score this match."
                  ></i>
                {:else if data.visible}
                  <i
                    class="fa-solid fa-eye"
                    title="All players can see this match."
                  ></i>
                {:else}
                  <i
                    class="fa-solid fa-eye-slash"
                    title="Only you can see this match."
                  ></i>
                {/if}
              </span>
            {/if}
            {data.ourTeamName} vs. {data.oppTeamName}
          </p>
          <span class="tag is-medium">
            <span class="icon-text">
              <span class="icon">
                <i class="fa-solid fa-clock"></i>
              </span>
              <span>
                {date.toLocaleString("en-AU", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </span>
          </span>
          <span class="tag is-medium">
            <span class="icon-text">
              <span class="icon">
                <i class="fa-solid fa-location-dot"></i>
              </span>
              <span>
                {data.location}
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
    <div class="level-right">
      <div class="buttons">
        {#if $page.data.admin}
          <a class="button" href="/app/matches/edit/{data.id}">
            <span class="icon">
              <i class="fa-solid fa-pencil"></i>
            </span>
            <span>Edit</span>
          </a>
        {/if}
        <button
          class="button"
          class:is-primary={hasScoringPermission}
          on:click={() => goto(`/app/scoring/${data.id}`)}
          disabled={!hasScoringPermission}
          title={hasScoringPermission
            ? undefined
            : "Your coach has not enabled scoring for this match yet."}
        >
          Enter Scoring
        </button>
      </div>
    </div>
  </div>
</div>
