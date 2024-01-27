<script lang="ts">
  export let form;
</script>

<div class="fullheight d-flex align-items-center justify-content-center">
  <form
    method="POST"
    action="/auth/admin?/adminLogin"
    class="d-flex flex-column gap-1"
  >
    <a href="/">Back</a>
    {#if form?.reason}
      <span>{form.reason}</span>
    {/if}
    <label for="password-field" class="form-label mb-0">Enter Password:</label>
    <input
      type="password"
      name="password"
      minlength={1}
      id="password-field"
      class="form-control"
    />
    <button class="btn btn-primary">Login</button>
  </form>
</div>
