<script lang="ts">
  export let value: number;
  let inputEl: HTMLInputElement;

  $: if (inputEl) {
    if (isNaN(value) || value < 100000000 || value > 999999999) {
      inputEl.setCustomValidity("Please enter a 9-digit number.");
    } else {
      inputEl.setCustomValidity("");
    }
  }
</script>

<input type="number" bind:value bind:this={inputEl} {...$$restProps} />
