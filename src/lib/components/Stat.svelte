<script lang="ts">
  export let label: string;
  export let value: string | number;
</script>

<!-- it's unholy the amount of times this exact code is needed throughout the application. -->
<!-- this might seem like a tiny component, but it is used *everywhere*. -->
<div {...$$restProps} class="has-text-centered-mobile {$$restProps.class}">
  <p class="heading">{label}</p>
  <p class="title">{value}</p>
</div>
