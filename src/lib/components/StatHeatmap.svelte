<script lang="ts">
  import { browser } from "$app/environment";
  import { density, dot, plot, ruleX, ruleY } from "@observablehq/plot";

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

    if (!res.ok) {
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
          // these inscribe the court markings onto the graph
          ruleX([0, 13]),
          ruleY([0, 8.4, 13.6, 22]),
          ruleX([2, 11], { y1: 2, y2: 20 }),
          ruleX([2, 11], { y1: 2, y2: 20 }),
          ruleY([2, 11, 20], { x1: 2, x2: 11 }),

          // these plot the actual data
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
    <div
      class="is-flex is-flex-wrap-wrap no-print is-align-items-center mb-4"
      style="gap: 14px;"
    >
      <span class="is-flex is-align-items-center">
        <label for="ratingSelect" class="has-text-weight-bold mr-2"
          >Rating:</label
        >
        <div class="select">
          <select id="ratingSelect" bind:value={rating}>
            <option value={-1}>All</option>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
      </span>
      <span class="is-flex is-align-items-center">
        <label for="actionSelect" class="has-text-weight-bold mr-2"
          >Action Type:</label
        >
        <div class="select">
          <select id="actionSelect" bind:value={action}>
            <option value="set">Set</option>
            <option value="atk">Attack</option>
            <option value="blk">Block</option>
            <option value="srv">Serve</option>
            <option value="src">Serve Receive</option>
            <option value="frc">Freeball Receive</option>
          </select>
        </div>
      </span>
      <span class="is-flex is-align-items-center">
        <span class="has-text-weight-bold mr-2">Show where the shot:</span>
        <label class="radio mr-2">
          <input type="radio" value={true} bind:group={showFrom} />
          Contacted
        </label>
        <label class="radio">
          <input type="radio" value={false} bind:group={showFrom} />
          Landed
        </label>
      </span>
    </div>
    <p class="has-text-centered has-text-weight-bold">Opponent Side</p>
    <div bind:this={div} role="img"></div>
    <p class="has-text-centered has-text-weight-bold">Our Side</p>
  </div>
{:else}
  <div class="has-text-centered">Loading heatmap...</div>
  <div class="skeleton-block"></div>
{/if}
