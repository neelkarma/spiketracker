<script lang="ts">
  import { page } from "$app/stores";
  import Modal from "$lib/components/Modal.svelte";
  import Stat from "$lib/components/Stat.svelte";

  let showLockdownConfirmModal = false;
  let lockdownLoading = false;

  const handleConfirmLockdown = async () => {
    lockdownLoading = true;
    const res = await fetch("/api/matches/lockdown");
    if (res.status !== 200) {
      alert("Sorry, something went wrong. Please try again in a few minutes.");
      lockdownLoading = false;
      return;
    }
    lockdownLoading = false;
    alert("The operation was successful. The page will now reload.");
    window.location.reload();
  };
</script>

<Modal bind:isOpen={showLockdownConfirmModal}>
  <div class="box">
    <div class="block">
      <h1 class="title">Confirm Disabling All Scoring</h1>
      <p>
        This will disable all players' ability to score any match. Scoring
        permissions can be re-enabled on a per-match basis through each match's
        respective edit menu. Proceed?
      </p>
    </div>
    <div class="buttons">
      <button
        class="button is-danger"
        class:is-loading={lockdownLoading}
        on:click={handleConfirmLockdown}>Yes</button
      >
      <button class="button" on:click={() => (showLockdownConfirmModal = false)}
        >No</button
      >
    </div>
  </div>
</Modal>

<div class="block">
  <h2 class="title">Quick Actions</h2>
  <div class="fixed-grid has-1-cols-mobile">
    <div class="grid">
      <div class="cell">
        <a href="/app/matches/new" class="box mb-0">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <span class="icon">
                  <i class="fa-solid fa-plus"></i>
                </span>
              </div>
              <div class="level-item">
                <p class="title is-5">New Match</p>
              </div>
            </div>
          </div>
        </a>
      </div>
      <div class="cell">
        <a href="/app/players/new" class="box mb-0">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <span class="icon">
                  <i class="fa-solid fa-user-plus"></i>
                </span>
              </div>
              <div class="level-item">
                <p class="title is-5">Add Player</p>
              </div>
            </div>
          </div>
        </a>
      </div>
      <div class="cell">
        <a href="/app/teams/new" class="box mb-0">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <span class="icon">
                  <i class="fa-solid fa-plus"></i>
                </span>
              </div>
              <div class="level-item">
                <p class="title is-5">New Team</p>
              </div>
            </div>
          </div>
        </a>
      </div>
      <div class="cell">
        <a on:click={() => (showLockdownConfirmModal = true)} class="box mb-0">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <span class="icon">
                  <i class="fa-solid fa-lock"></i>
                </span>
              </div>
              <div class="level-item">
                <p class="title is-5">Disable All Scoring</p>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</div>

<div class="block">
  <h2 class="title">Overall Stats</h2>
  <div class="box">
    <div class="fixed-grid has-3-cols has-2-cols-mobile">
      <div class="grid">
        <div class="cell">
          <Stat label="Team Count" value={$page.data.teams} />
        </div>
        <div class="cell">
          <Stat label="Players Registered" value={$page.data.players} />
        </div>
        <div class="cell">
          <Stat label="Matches Created" value={$page.data.matches} />
        </div>
        <div class="cell">
          <Stat label="Combined Points" value={$page.data.points} />
        </div>
        <div class="cell">
          <Stat label="Combined Kill Rate" value={$page.data.kr.toFixed(3)} />
        </div>
        <div class="cell">
          <Stat
            label="Combined Passing Efficiency"
            value={$page.data.pef.toFixed(3)}
          />
        </div>
      </div>
    </div>
  </div>
</div>
