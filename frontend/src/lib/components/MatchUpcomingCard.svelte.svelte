<script lang="ts">
  export let date: Date;
  export let location: string;
  export let ourTeamName: string;
  export let oppTeamName: string;
</script>

<div class="box py-1 px-3 compress">
  <div class="level compress">
    <div class="level-item">
      <div>
        <h2 class="title is-5">
          {date.toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
        </h2>
        <h3 class="subtitle is-6">
          {date.toLocaleTimeString("en-AU", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </h3>
        <h3 class="subtitle is-6">{location}</h3>
      </div>
    </div>
    <div class="level-item">
      <table class="table">
        <tbody>
          <tr>
            <th>{ourTeamName}</th>
          </tr>
          <tr>
            <th>{oppTeamName}</th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
