<script lang="ts">
  // Importing necessary modules
  import { browser } from "$app/environment";
  // Checks if the code is running in a browser environment
  import { density, dot, plot, ruleX, ruleY } from "@observablehq/plot";
  // Importing functions from Observable Plot for creating plots

  export let type: "team" | "player" | "match"; // Define the type of stats to display (team, player, or match)
  export let id: number; // The specific ID of the team, player, or match
  export let width = 420; // Default width for the heatmap in pixels

  // defining heatmap dimensions
  const GRID_WIDTH = 13;
  const GRID_HEIGHT = 22;

  let div: HTMLDivElement; // A reference to the div element where the plot will be rendered
  let data:
    | {
        rating: number;
        action: string;
        x: number;
        y: number;
        isContactPoint: boolean; // true is for contact and false is for landing
      }[]
    | null = null; // Svelte requirement to update data, will be fixed in v5

  // default options
  let rating = 3;
  let action = "set";
  let showContact = true;

  const handleSourceChange = async () => {
    // Function to fetch and process stats data based on the type and id

    let searchParamsObject: { [key: string]: any } = {}; // Object to hold search parameters for the API request

    // Add the appropriate search parameter based on the type of data
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

    const searchParams = new URLSearchParams(searchParamsObject).toString(); // Convert the search parameters to a query string

    // Fetch the stats data from the API
    const res = await fetch("/api/stats/?" + searchParams);

    if (!res.ok) {
      console.log(await res.text());
      alert("Sorry, something went wrong.");
      return;
    }

    const stats = await res.json(); // Parse the JSON response

    data = stats.flatMap((stat: any) => [
      {
        rating: stat.rating,
        action: stat.action,
        x: stat.from[0], // X-coordinate for the start of the action
        y: stat.from[1], // Y-coordinate for the start of the action
        isContactPoint: true, // Mark as start
      },
      {
        rating: stat.rating,
        action: stat.action,
        x: stat.to[0], // X-coordinate for the end of the action
        y: stat.to[1], // Y-coordinate for the end of the action
        isContactPoint: false, // Mark as end
      },
    ]);
  };

  // Reactive block to fetch data when type or id changes
  $: if (browser) {
    type;
    id;
    handleSourceChange(); // Fetch data whenever type or id changes
  }

  // Reactive block to update the plot when data changes
  $: if (data) {
    const filtered = data.filter(
      (d) =>
        (rating === -1 || d.rating === rating) && // Filter by rating
        d.isContactPoint === showContact && // Filter by whether to show start or end
        d.action === action // Filter by action type
    );

    div?.firstChild?.remove(); // Remove the existing plot if it exists

    // Append the new plot to the div
    div?.append(
      plot({
        x: {
          domain: [0, GRID_WIDTH], // Set the domain for the x-axis
          ticks: GRID_WIDTH, // Set the number of ticks on the x-axis
          grid: true, // Enable grid lines
        },
        y: {
          domain: [0, GRID_HEIGHT],
          ticks: GRID_HEIGHT,
          grid: true,
        },
        width,
        aspectRatio: 1,
        marks: [
          // Add court markings to the plot
          ruleX([0, 13]),
          ruleY([0, 8.4, 13.6, 22]),
          ruleX([2, 11], { y1: 2, y2: 20 }),
          ruleX([2, 11], { y1: 2, y2: 20 }),
          ruleY([2, 11, 20], { x1: 2, x2: 11 }),

          // Plot the data points as density and dots
          density(filtered, {
            x: "x",
            y: "y",
            thresholds: 10, // contour density
          }),
          dot(filtered, {
            x: "x",
            y: "y",
            fill: "black",
          }),
        ],
      })
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
          <input type="radio" value={true} bind:group={showContact} />
          Contacted
        </label>
        <label class="radio">
          <input type="radio" value={false} bind:group={showContact} />
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
