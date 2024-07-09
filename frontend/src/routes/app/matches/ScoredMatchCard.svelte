<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { MatchInfo } from "$lib/types";

  export let data: MatchInfo;

  const calculateSetsWon = (points: { our: number; opp: number }[]) => {
    let ourSets = 0;
    let oppSets = 0;

    for (const { our, opp } of points) {
      if (our > opp) {
        ourSets += 1;
      } else if (opp > our) {
        oppSets += 1;
      }
    }

    return { our: ourSets, opp: oppSets };
  };

  $: date = new Date(data.time);
  $: setsWon = calculateSetsWon(data.points);
  $: hasScoringPermission = $page.data.admin || data.scoring;
</script>

<a class="box" href="/app/matches/{data.id}">
  <div class="level">
    <div class="level-left">
      {#if $page.data.admin}
        <div class="level-item">
          <span class="icon">
            {#if data.visible && data.scoring}
              <i
                class="fa-solid fa-pencil"
                style="font-size: 1.25rem;"
                title="All players can score this match."
              ></i>
            {:else if data.visible}
              <i
                class="fa-solid fa-eye"
                style="font-size: 1.25rem;"
                title="All players can see this match."
              ></i>
            {:else}
              <i
                class="fa-solid fa-eye-slash"
                style="font-size: 1.25rem;"
                title="Only you can see this match."
              ></i>
            {/if}
          </span>
        </div>
      {/if}
      <div class="level-item">
        <table class="table mb-0">
          <tbody>
            <tr>
              <th>{data.ourTeamName}</th>
              {#each data.points as { our, opp }}
                {#if our > opp}
                  <td class="has-text-weight-bold">{our}</td>
                {:else}
                  <td>{our}</td>
                {/if}
              {/each}
              {#if setsWon.our > setsWon.opp}
                <td class="has-text-weight-bold">{setsWon.our}</td>
              {:else}
                <td>{setsWon.our}</td>
              {/if}
            </tr>
            <tr>
              <th>{data.oppTeamName}</th>
              {#each data.points as { our, opp }}
                {#if opp > our}
                  <td class="has-text-weight-bold">{opp}</td>
                {:else}
                  <td>{opp}</td>
                {/if}
              {/each}
              {#if setsWon.opp > setsWon.our}
                <td class="has-text-weight-bold">{setsWon.opp}</td>
              {:else}
                <td>{setsWon.opp}</td>
              {/if}
            </tr>
          </tbody>
        </table>
      </div>
      <div class="level-item">
        <div>
          <span class="tag is-medium mb-1" style="width: 100%;">
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
          <br />
          <span class="tag is-medium" style="width: 100%;">
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
          on:click={(e) => {
            e.preventDefault(); // this prevents the parent anchor tag from being triggered
            goto(`/app/scoring/${data.id}`);
          }}
          disabled={!hasScoringPermission}
          title={hasScoringPermission
            ? undefined
            : "Your coach has not enabled scoring for this match."}
        >
          Enter Scoring
        </button>
      </div>
    </div>
  </div>
</a>
