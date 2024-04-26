<script lang="ts">
  export let compress = true;
</script>

<div class="box py-1 px-3" class:compress>
  <div class="level" class:compress><slot /></div>
</div>
