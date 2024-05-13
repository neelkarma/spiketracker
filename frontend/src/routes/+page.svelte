<script>
  import { page } from "$app/stores";
  import landingImg from "../assets/landing.jpg";
</script>

<div class="columns is-centered is-vcentered is-fullheight">
  <div class="column is-half">
    <img src={landingImg} alt="SBHS Volleyball Team spiking a ball" />
  </div>
  <div class="column is-half">
    {#if $page.url.searchParams.has("error")}
      <div class="notification is-danger" role="alert">
        Error: {$page.url.searchParams.get("error")}
      </div>
    {/if}
    <div class="column is-four-fifths pl-5">
      <h1 class="title">SpikeTracker</h1>
      <h5 class="subtitle">Volleyball reporting software for SBHS.</h5>
      <a href="/api/auth/login/sbhs" class="button is-primary">Student Login</a>
      <a class="button" href="/adminauth">Coach Login</a>
    </div>
  </div>
</div>
