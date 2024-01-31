<script lang="ts">
  export let form;
</script>

<div class="columns is-mobile is-centered is-vcentered is-fullheight">
  <form method="POST" action="/auth/admin?/adminLogin" class="column is-half">
    <a class="button is-link is-light mb-2" href="/">Back</a>
    {#if form?.reason}
      <span class="notification is-danger">{form.reason}</span>
    {/if}

    <div class="field">
      <label for="password-field" class="label">Enter Password:</label>
      <div class="control">
        <input
          class="input"
          type="password"
          name="password"
          minlength={1}
          id="password-field"
        />
      </div>
    </div>

    <div class="field">
      <div class="control">
        <button class="button is-primary">Login</button>
      </div>
    </div>
  </form>
</div>
