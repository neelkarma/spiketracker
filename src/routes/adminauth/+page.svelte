<script lang="ts">
  import type { FormEventHandler } from "svelte/elements";

  let error: string | null = null;
  let isLoading = false;

  /** this handles the submit event of the login form. */
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    isLoading = true;

    const password = new FormData(e.currentTarget).get("password")!;
    const res = await fetch("/api/auth/login/admin", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      // the login was successful - redirect to the home page
      window.location.href = "/";
    } else {
      // the login was not successful - show the user the issue
      const data = await res.json();
      error = data.message;
    }

    isLoading = false;
  };
</script>

<div class="columns is-mobile is-centered is-vcentered is-fullheight">
  <form class="column is-half" on:submit|preventDefault={handleSubmit}>
    {#if error}
      <div class="notification is-danger" role="alert">
        {error}
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
      <button class="button is-primary" class:is-loading={isLoading}
        >Login</button
      >
      <a href="/" class="button">Back</a>
    </div>
  </form>
</div>
