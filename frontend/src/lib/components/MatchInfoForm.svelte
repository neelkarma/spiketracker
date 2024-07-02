<script lang="ts">
  import type { MatchInfo } from "$lib/types";
  import { dateToDateTimeLocalInputString, wait } from "$lib/utils";
  import { createEventDispatcher, onMount } from "svelte";
  import type { EventHandler } from "svelte/elements";
  import DeleteConfirmModal from "./DeleteConfirmModal.svelte";

  export let data: MatchInfo;
  export let isLoading = false;
  export let submitLabel = "Apply";
  export let showDelete = false;

  const dispatch = createEventDispatcher<{
    submit: MatchInfo;
    cancel: null;
    delete: null;
  }>();

  let visible = data.visible;
  let scoring = data.scoring;
  $: if (!visible) scoring = false;
  let teamsPromise: Promise<{ name: string; id: number }[]>;
  let deleteModalOpen = false;

  const fetchTeams = async () => {
    // simualte network lag
    await wait(1000);

    return [
      {
        name: "SBHS 1sts",
        id: 0,
      },
      {
        name: "SBHS 2nds",
        id: 1,
      },
    ];
  };

  onMount(() => (teamsPromise = fetchTeams()));

  const pointsArrayFromFormData = (formData: FormData) => {
    const out = [];
    for (let i = 0; formData.has(`our-${i}`); i++) {
      out.push({
        our: Number.parseInt(formData.get(`our-${i}`)!.toString()),
        opp: Number.parseInt(formData.get(`opp-${i}`)!.toString()),
      });
    }
    return out;
  };

  const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (
    e,
  ) => {
    const teams = await teamsPromise;

    const formData = new FormData(e.currentTarget);
    const pointsOverridden = !!formData.get("pointsOverridden")?.toString();
    const ourTeamId = Number.parseInt(formData.get("ourTeamId")!.toString());

    dispatch("submit", {
      id: data.id,
      ourTeamId,
      ourTeamName: teams.find(({ id }) => ourTeamId === id)!.name,
      oppTeamName: formData.get("oppTeamName")!.toString(),
      location: formData.get("location")!.toString(),
      time: formData.get("date")!.toString(),
      points: pointsArrayFromFormData(formData),
      visible: !!formData.get("visible")?.toString(),
      scoring: !!formData.get("scoring")?.toString(),
    });
  };
</script>

<DeleteConfirmModal
  bind:isOpen={deleteModalOpen}
  name="{new Date(data.time).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })} - {data.ourTeamName} vs {data.oppTeamName}"
  on:confirm={() => dispatch("delete")}
  on:cancel={() => (deleteModalOpen = false)}
/>

<form on:submit|preventDefault={handleSubmit}>
  <div class="block">
    <h2 class="subtitle">General</h2>
    <div class="field">
      <label for="ourTeamIdInput" class="label">Our Team</label>
      <div class="control">
        <div class="select">
          {#if teamsPromise}
            {#await teamsPromise}
              <select name="ourTeamId" id="ourTeamIdInput" disabled>
                <option>Loading...</option>
              </select>
            {:then teams}
              <select name="ourTeamId" id="ourTeamIdInput">
                {#each teams as { name, id }}
                  <option value={id} selected={name === data.ourTeamName}
                    >{name}</option
                  >
                {/each}
              </select>
            {:catch}
              <p>Sorry, something went wrong.</p>
              <button
                class="button"
                on:click={() => (teamsPromise = fetchTeams())}>Retry</button
              >
            {/await}
          {/if}
        </div>
      </div>
    </div>
    <div class="field">
      <label for="oppTeamNameInput" class="label">Opposition Team Name</label>
      <div class="control">
        <input
          type="text"
          class="input"
          id="oppTeamNameInput"
          name="oppTeamName"
          value={data.oppTeamName}
          required
        />
      </div>
    </div>
    <div class="field">
      <label for="locationInput" class="label">Location of Match</label>
      <div class="control">
        <input
          type="text"
          class="input"
          id="locationInput"
          name="location"
          value={data.location}
          required
        />
      </div>
    </div>
    <div class="field">
      <label for="dateInput" class="label">Date and Time of Match</label>
      <div class="control">
        <input
          type="datetime-local"
          class="input"
          id="dateInput"
          name="date"
          value={dateToDateTimeLocalInputString(new Date(data.time))}
          required
        />
      </div>
    </div>
  </div>

  <div class="block">
    <h2 class="subtitle">Access</h2>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" name="visible" bind:checked={visible} />
          Players can see this match
        </label>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input
            type="checkbox"
            name="scoring"
            bind:checked={scoring}
            disabled={!visible}
          />
          Players can score this match
        </label>
      </div>
    </div>
  </div>

  {#if data.points}
    <div class="block">
      <h2 class="subtitle">Points</h2>
      <div class="buttons">
        <button
          class="button"
          disabled={data.points.length === 5}
          on:click={() => {
            if (!data.points) return;
            if (data.points.length === 5) return;
            data.points.push({ our: 0, opp: 0 });
            data.points = data.points;
          }}>Add Set</button
        >
        <button
          class="button"
          disabled={data.points.length === 1}
          on:click={() => {
            if (!data.points) return;
            if (data.points.length === 1) return;
            data.points.pop();
            data.points = data.points;
          }}>Remove Set</button
        >
      </div>
      <table class="table">
        <tbody>
          <tr>
            <th>{data.ourTeamName}</th>
            {#each data.points as { our }, i}
              <td>
                <input
                  type="number"
                  min={0}
                  class="input"
                  bind:value={our}
                  name="our-{i}"
                />
              </td>
            {/each}
          </tr>
          <tr>
            <th>{data.oppTeamName}</th>
            {#each data.points as { opp }, i}
              <td>
                <input
                  type="number"
                  min={0}
                  class="input"
                  value={opp}
                  name="opp-{i}"
                />
              </td>
            {/each}
          </tr>
        </tbody>
      </table>
    </div>
  {/if}

  <div class="buttons">
    {#await teamsPromise}
      <button class="button is-primary" type="submit" disabled>Apply</button>
    {:then}
      <button
        class="button is-primary"
        class:is-loading={isLoading}
        type="submit">{submitLabel}</button
      >
    {/await}
    {#if showDelete}
      <button
        class="button is-danger"
        type="button"
        on:click={() => (deleteModalOpen = true)}>Delete</button
      >
    {/if}
    <button class="button" type="button" on:click={() => dispatch("cancel")}
      >Cancel</button
    >
  </div>
</form>
