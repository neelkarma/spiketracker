<script lang="ts">
  export let label: string;
  export let value: string | number;
</script>

<div {...$$restProps} class="has-text-centered-mobile {$$restProps.class}">
  <p class="heading">{label}</p>
  <p class="title">{value}</p>
</div>
