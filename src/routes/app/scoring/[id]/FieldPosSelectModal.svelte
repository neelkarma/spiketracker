<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";
  import { createEventDispatcher } from "svelte";
  import svg from "../../../../assets/Volleyball-Court-1.svg";
  import { ACTION_TYPE_MAPPINGS } from "./mappings";

  const dispatch = createEventDispatcher<{
    submit: {
      from: [number, number];
      to: [number, number];
      action: keyof typeof ACTION_TYPE_MAPPINGS;
      rating: number;
    };
  }>();

  /** these are the fontawesome icons for the ratings */
  const ratingIcons = [
    "fa-face-frown",
    "fa-face-meh",
    "fa-face-smile",
    "fa-face-grin",
  ];

  export let isOpen = false;

  let from: [number, number] | null = null;
  let to: [number, number] | null = null;
  let action: keyof typeof ACTION_TYPE_MAPPINGS = "set";

  /** this is called when a grid cell is clicked */
  const handleGridClick = (x: number, y: number) => {
    if (from === null) {
      from = [x, y];
      return;
    }

    if (to === null) {
      to = [x, y];
      return;
    }
  };

  /** this is called to reset the state */
  const handleReset = () => {
    from = null;
    to = null;
    action = "set";
  };

  /** this is called when submitting the scoring data */
  const handleSubmit = (rating: number) => {
    // we exit early if the data is not complete
    if (from === null || to === null) return;

    dispatch("submit", {
      from,
      to,
      action,
      rating,
    });

    // we reset afterwards
    handleReset();
  };

  // this ensures that the state is reset when the modal is closed
  $: if (!isOpen) {
    handleReset();
  }
</script>

<!-- This is to define popup of scoring ui -->
<Modal bind:isOpen>
  <div class="box">
    {#if from == null}
      <p class="pb-2">1. Select the position the player hit the ball.</p>
    {:else if to == null}
      <p class="pb-2">2. Select where the ball landed.</p>
    {:else}
      <div class="box">
        <div class="field">
          <p class="label">Action Type</p>
          <div class="control">
            {#each Object.entries(ACTION_TYPE_MAPPINGS) as [code, name]}
              <label class="radio pr-2" title={name}>
                <input
                  type="radio"
                  name="actionType"
                  value={code}
                  bind:group={action}
                />
                {code.toUpperCase()}
              </label>
            {/each}
          </div>
        </div>
        <p class="label">Save with Rating:</p>
        <div class="field has-addons">
          {#each { length: 4 } as _, rating}
            <div class="control">
              <button class="button" on:click={() => handleSubmit(rating)}>
                <span class="icon is-small">
                  <i class="fa-solid {ratingIcons[rating]}"></i>
                </span>
                <span>{rating}</span>
              </button>
            </div>
          {/each}
        </div>
        <button class="button is-light" on:click={handleReset}>Reset</button>
      </div>
    {/if}

    <div class="has-text-centered">
      <p class="has-text-weight-bold">Opposition Side</p>
      <div class="grid-container">
        <img
          src={svg}
          class="court-img"
          alt="Volleyball Court Birds-Eye View"
        />
        <div class="grid-overlay">
          {#each { length: 13 * 22 } as _, i}
            {@const x = i % 13}
            {@const y = 21 - Math.floor(i / 13)}
            {@const isPos1 = from && from[0] === x && from[1] === y}
            {@const isPos2 = to && to[0] === x && to[1] === y}

            <button
              class="grid-cell"
              class:pos1={isPos1}
              class:pos2={isPos2}
              on:click={() => handleGridClick(x, y)}
              disabled={from !== null && to !== null}
            >
              {#if isPos1}
                1
              {:else if isPos2}
                2
              {/if}
            </button>
          {/each}
        </div>
      </div>
      <p class="has-text-weight-bold">Our Side</p>
    </div>
  </div>

  <style>
    .grid-container {
      position: relative;
      display: inline-block;
    }

    .court-img {
      display: block;
    }

    .grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(13, 1fr);
      grid-template-rows: repeat(22, 1fr);
      pointer-events: none;
    }

    .grid-cell {
      font-weight: bold;
      color: #ffffff;
      border: 1px solid #00000011;
      pointer-events: auto; /* Enable click events */
      background-color: #ffffff00; /* Adjust cell visibility */
      cursor: pointer;

      &.pos1 {
        background-color: #0000ffaa;
      }

      &.pos2 {
        background-color: #ff0000aa;
      }
    }

    .grid-cell:hover {
      background-color: #00000033;
    }

    .grid-cell:hover:disabled {
      background-color: unset;
    }
  </style>
</Modal>
