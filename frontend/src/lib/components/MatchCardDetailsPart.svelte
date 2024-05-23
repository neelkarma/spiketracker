<script lang="ts">
  export let date: Date;
  export let location: string;
</script>

<div class="level-item">
  <div>
    <h2 class="title is-5">
      {date.toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
    </h2>
    <h3 class="subtitle is-7">
      {date.toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </h3>
    <h3 class="subtitle is-7">{location}</h3>
  </div>
</div>
