<script lang="ts">
  import { page } from "$app/stores";
  import landingImg from "../assets/landing.jpg";
</script>

<div class="columns is-centered is-vcentered is-fullheight">
  <div class="column is-half">
    <img src={landingImg} alt="SBHS Volleyball Team spiking a ball" />
  </div>
  <div class="column is-half">
    <div class="column is-four-fifths pl-5">
      {#if $page.url.searchParams.has("error")}
        {@const error = $page.url.searchParams.get("error")}
        <div class="notification is-danger">
          {#if error === "forbidden"}
            You have not been allowed access to SpikeTracker. If you think this
            is a mistake, please contact your coach.
          {:else}
            Something unexpected occurred. Please try again later.
          {/if}
        </div>
      {/if}
      <h1 class="title mb-1">
        <span class="icon mr-1">
          <i class="fa-solid fa-volleyball"></i>
        </span>
        SpikeTracker
      </h1>
      <h5 class="subtitle">Volleyball reporting software for SBHS.</h5>
      <a href="/api/auth/login/sbhs" class="button is-primary">Student Login</a>
      <a class="button" href="/adminauth">Coach Login</a>
    </div>
  </div>
</div>
