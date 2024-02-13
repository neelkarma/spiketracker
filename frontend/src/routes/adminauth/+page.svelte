<script lang="ts">
  let error: string | null = null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const password = e.target.password.value;
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
  <form class="column is-half" on:submit={handleSubmit}>
    <a class="button" href="/">Back</a>

    {#if error}
      <div class="notification is-danger" role="alert">
        Error: {error}
      </div>
    {/if}

    <label>
      Password
      <input type="password" name="password" />
    </label>
    <button class="button is-primary">Login</button>
  </form>
</div>
