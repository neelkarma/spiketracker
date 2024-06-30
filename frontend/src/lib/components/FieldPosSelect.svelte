<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import svg from "../../assets/Volleyball-Court-1.svg";

  const dispatch = createEventDispatcher<{
    submit: {
      pos1: [number, number];
      pos2: [number, number];
      actionType: string;
      rating: number;
    };
  }>();

  const ratingIcons = [
    "fa-face-frown",
    "fa-face-meh",
    "fa-face-smile",
    "fa-face-grin",
  ];

  let pos1: [number, number] | null = null;
  let pos2: [number, number] | null = null;
  let actionType = "set";

  const handleGridClick = (x: number, y: number) => {
    if (pos1 === null) {
      pos1 = [x, y];
      return;
    }

    if (pos2 === null) {
      pos2 = [x, y];
      return;
    }
  };

  const handleReset = () => {
    pos1 = null;
    pos2 = null;
  };

  const handleSubmit = (rating: number) => {
    if (pos1 === null || pos2 === null) return;
    dispatch("submit", {
      pos1,
      pos2,
      actionType,
      rating,
    });

    pos1 = null;
    pos2 = null;
    actionType = "set";
  };
</script>

<div>
  {#if pos1 == null}
    <p class="pb-2">1. Select the position the player hit the ball.</p>
  {:else if pos2 == null}
    <p class="pb-2">2. Select where the ball landed.</p>
  {:else}
    <div class="box">
      <div class="field">
        <p class="label">Action Type</p>
        <div class="control">
          <label class="radio">
            <input
              type="radio"
              name="actionType"
              value="set"
              bind:group={actionType}
            />
            SET
          </label>
          <label class="radio">
            <input
              type="radio"
              name="actionType"
              value="atk"
              bind:group={actionType}
            />
            ATK
          </label>
          <label class="radio">
            <input
              type="radio"
              name="actionType"
              value="blk"
              bind:group={actionType}
            />
            BLK
          </label>
          <label class="radio">
            <input
              type="radio"
              name="actionType"
              value="srv"
              bind:group={actionType}
            />
            SRV
          </label>
          <label class="radio">
            <input
              type="radio"
              name="actionType"
              value="src"
              bind:group={actionType}
            />
            SRC
          </label>
          <label class="radio">
            <input
              type="radio"
              name="actionType"
              value="frc"
              bind:group={actionType}
            />
            FRC
          </label>
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

  <div class="grid-container">
    <img src={svg} class="court-img" alt="Volleyball Court Birds-Eye View" />
    <div class="grid-overlay">
      {#each { length: 13 * 22 } as _, i}
        {@const x = i % 20}
        {@const y = Math.floor(i / 20)}
        {@const isPos1 = pos1 && pos1[0] === x && pos1[1] === y}
        {@const isPos2 = pos2 && pos2[0] === x && pos2[1] === y}

        <button
          class="grid-cell"
          class:pos1={isPos1}
          class:pos2={isPos2}
          on:click={() => handleGridClick(x, y)}
          disabled={pos1 !== null && pos2 !== null}
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
