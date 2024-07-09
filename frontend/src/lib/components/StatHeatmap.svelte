<script lang="ts">
  import { browser } from "$app/environment";
  import {
    contour,
    density,
    dot,
    identity,
    plot,
    ruleX,
    ruleY,
  } from "@observablehq/plot";

  export let type: "team" | "player" | "match";
  export let id: number;
  export let width = 420;

  const GRID_WIDTH = 13;
  const GRID_HEIGHT = 22;

  let div: HTMLDivElement;
  let data:
    | {
        rating: number;
        action: string;
        x: number;
        y: number;
        isStart: boolean;
      }[]
    | null = null;

  let rating = 3;
  let action = "set";
  let showFrom = true;

  const handleSourceChange = async () => {
    let searchParamsObject: { [key: string]: any } = {};

    switch (type) {
      case "match":
        searchParamsObject.match_id = id;
        break;
      case "player":
        searchParamsObject.player_id = id;
        break;
      case "team":
        searchParamsObject.team_id = id;
        break;
    }

    const searchParams = new URLSearchParams(searchParamsObject).toString();

    const res = await fetch("/api/stats/?" + searchParams);

    if (res.status !== 200) {
      console.log(await res.text());
      alert("Sorry, something went wrong.");
      return;
    }

    const stats = await res.json();
    data = stats.flatMap((stat: any) => [
      {
        rating: stat.rating,
        action: stat.action,
        x: stat.from[0],
        y: stat.from[1],
        isStart: true,
      },
      {
        rating: stat.rating,
        action: stat.action,
        x: stat.to[0],
        y: stat.to[1],
        isStart: false,
      },
    ]);
    console.log(data);
  };

  $: if (browser) {
    type;
    id;
    handleSourceChange();
  }

  $: if (data) {
    const filtered = data.filter(
      (d) =>
        (rating === -1 || d.rating === rating) &&
        d.isStart === showFrom &&
        d.action === action,
    );

    div?.firstChild?.remove();
    div?.append(
      plot({
        x: {
          domain: [0, GRID_WIDTH],
          ticks: GRID_WIDTH,
          grid: true,
        },
        y: {
          domain: [0, GRID_HEIGHT],
          ticks: GRID_HEIGHT,
          grid: true,
        },
        width,
        aspectRatio: 1,
        marks: [
          ruleX([0]),
          ruleY([0]),
          density(filtered, {
            x: "x",
            y: "y",
            thresholds: 10,
          }),
          dot(filtered, {
            x: "x",
            y: "y",
            fill: "black",
          }),
        ],
      }),
    );
  }
</script>

{#if data}
  <div class="is-flex is-flex-direction-column is-align-items-center">
    <div class="is-flex is-flex-wrap-wrap" style="gap: 14px;">
      <label class="label is-flex is-align-items-center">
        <span class="mr-2">Rating:</span>
        <div class="select">
          <select bind:value={rating}>
            <option value={-1}>All</option>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
      </label>
      <label class="label is-flex is-align-items-center">
        <span class="mr-2">Action Type:</span>
        <div class="select">
          <select bind:value={action}>
            <option value="set">Set</option>
            <option value="atk">Attack</option>
            <option value="blk">Block</option>
            <option value="srv">Serve</option>
            <option value="src">Serve Receive</option>
            <option value="frc">Freeball Receive</option>
          </select>
        </div>
      </label>
      <label class="label is-flex is-align-items-center">
        <span class="mr-2">Show where the shot:</span>
        <div class="select">
          <select bind:value={showFrom}>
            <option value={true}>Started</option>
            <option value={false}>Ended</option>
          </select>
        </div>
      </label>
    </div>
    <div bind:this={div} role="img"></div>
  </div>
{:else}
  <div class="has-text-centered">Loading heatmap...</div>
  <div class="skeleton-block"></div>
{/if}
