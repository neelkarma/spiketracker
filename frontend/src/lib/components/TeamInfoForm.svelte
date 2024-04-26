<script lang="ts">
  import type { PlayerInfo, TeamInfo } from "$lib/types";
  import { createEventDispatcher } from "svelte";
  import type { EventHandler } from "svelte/elements";
  import DeleteConfirmModal from "./DeleteConfirmModal.svelte";
  import PlayerPicker from "./PlayerPicker.svelte";

  export let data: TeamInfo;
  export let players: PlayerInfo[] = [];
  export let isLoading = false;
  export let submitLabel = "Apply";
  export let showDelete = false;

  const dispatch = createEventDispatcher<{
    submit: TeamInfo;
    cancel: void;
    delete: void;
  }>();

  let deleteModalOpen = false;

  const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (
    e
  ) => {
    const formData = new FormData(e.currentTarget);
    dispatch("submit", {
      ...data,
      playerIds: players.map(({ id }) => id),
      name: formData.get("name")!.toString(),
      visible: !!formData.get("visible")?.toString(),
    });
  };
</script>

<DeleteConfirmModal
  bind:isOpen={deleteModalOpen}
  name={data.name}
  on:confirm={() => dispatch("delete")}
  on:cancel={() => (deleteModalOpen = false)}
/>

<form on:submit|preventDefault={handleSubmit}>
  <div class="block">
    <h2 class="subtitle">General</h2>
    <div class="field">
      <label for="nameInput" class="label">Team Name</label>
      <div class="control">
        <input
          type="text"
          class="input"
          id="nameInput"
          name="name"
          value={data.name}
          required
        />
      </div>
    </div>

    <div class="field">
      <label class="label" for="playersInput">Players</label>
      <PlayerPicker bind:value={players} inputId="playersInput" required />
    </div>
  </div>

  <div class="block">
    <h2 class="subtitle">Access</h2>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" name="visible" checked={data.visible} />
          Players can see this team
        </label>
      </div>
    </div>
  </div>

  <div class="buttons">
    <button class="button is-primary" class:is-loading={isLoading} type="submit"
      >{submitLabel}</button
    >
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
