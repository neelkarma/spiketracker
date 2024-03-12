<script lang="ts">
  export let label: string;
  export let value: string | number;
</script>

<div class="level-item" {...$$restProps}>
  <div>
    <p class="heading">{label}</p>
    <p class="title">{value}</p>
  </div>
</div>
