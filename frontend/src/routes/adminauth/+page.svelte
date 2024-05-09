<script lang="ts">
  import type { FormEventHandler } from "svelte/elements";

  let error: string | null = null;

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    const password = new FormData(e.currentTarget).get("password")!;
    const res = await fetch("/api/auth/login/admin", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = "/";
    } else {
      error = data.reason;
    }
  };
</script>

<div class="columns is-mobile is-centered is-vcentered is-fullheight">
  <form class="column is-half" on:submit|preventDefault={handleSubmit}>
    {#if error}
      <div class="notification is-danger" role="alert">
        Error: {error}
      </div>
    {/if}

    <div class="field">
      <label for="password-input">Password</label>
      <div class="control">
        <input
          id="password-input"
          class="input"
          type="password"
          name="password"
        />
      </div>
    </div>
    <div class="buttons">
      <button class="button is-primary">Login</button>
      <a href="/" class="button">Back</a>
    </div>
  </form>
</div>
