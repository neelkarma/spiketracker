<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let title: string;

  const dispatch = createEventDispatcher<{ submit: void }>();
</script>

<nav class="navbar is-primary" aria-label="main navigation">
  <div id="navbar" class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item" href="/app">Back</a>
    </div>
    <div class="navbar-item has-text-weight-bold">{title}</div>
    <div class="navbar-end">
      <a class="navbar-item" on:click={() => dispatch("submit")}>Submit</a>
    </div>
  </div>
</nav>
