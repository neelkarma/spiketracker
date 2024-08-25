<script lang="ts">
  import type { PlayerInfo } from "$lib/types";
  import { createEventDispatcher } from "svelte";
  import type { EventHandler } from "svelte/elements";
  import DeleteConfirmModal from "./DeleteConfirmModal.svelte";
  import MultiTeamSelect from "./MultiTeamSelect.svelte";

  export let data: PlayerInfo;
  export let isLoading = false;
  export let submitLabel = "Apply";
  export let showDelete = false;

  const dispatch = createEventDispatcher<{
    submit: PlayerInfo;
    cancel: null;
    delete: null;
  }>();

  let deleteModalOpen = false;
  let teams = data.teams;

  /** Handles the form's submit event. */
  const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (
    e,
  ) => {
    const formData = new FormData(e.currentTarget);
    // We dispatch a submit event with the form data to allow consumers of the components to decide what to do
    dispatch("submit", {
      ...data,
      firstName: formData.get("firstName")!.toString(),
      surname: formData.get("surname")!.toString(),
      id: parseInt(formData.get("id")!.toString()),
      teams,
      visible: !!formData.get("visible")?.toString(),
    });
  };
</script>

<DeleteConfirmModal
  bind:isOpen={deleteModalOpen}
  name="{data.firstName} {data.surname}"
  on:confirm={() => dispatch("delete")}
  on:cancel={() => (deleteModalOpen = false)}
/>

<form on:submit|preventDefault={handleSubmit}>
  <div class="block">
    <h2 class="subtitle">General</h2>
    <div class="field">
      <label for="firstNameInput" class="label">First Name</label>
      <div class="control">
        <input
          type="text"
          class="input"
          id="firstNameInput"
          name="firstName"
          value={data.firstName}
          required
        />
      </div>
    </div>

    <div class="field">
      <label for="surnameInput" class="label">Surname</label>
      <div class="control">
        <input
          type="text"
          class="input"
          id="surnameInput"
          name="surname"
          value={data.surname}
          required
        />
      </div>
    </div>

    <div class="field">
      <label for="idInput" class="label">Student ID</label>
      <div class="control">
        <input
          type="number"
          min={400000000}
          max={999999999}
          class="input"
          id="idInput"
          name="id"
          value={data.id}
          required
        />
      </div>
    </div>

    <div class="field">
      <label for="gradYearInput" class="label">Graduation Year</label>
      <div class="control">
        <input
          type="number"
          min={0}
          class="input"
          id="gradYearInput"
          name="gradYear"
          value={data.gradYear}
          required
        />
      </div>
    </div>

    <div class="field">
      <label class="label" for="teamsInput">Teams</label>
      <MultiTeamSelect inputId="teamsInput" bind:value={teams} required />
    </div>
  </div>

  <div class="block">
    <h2 class="subtitle">Access</h2>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" name="visible" checked={data.visible} />
          Other players can see this player
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
