<script>
    export let isChecked;
  export let label;
    function toggleCheckbox() {
      isChecked = !isChecked;
      console.log(`Checkbox is ${isChecked ? 'checked' : 'unchecked'}`);
    }
  </script>
  
  <label>
    <input type="checkbox" bind:checked={isChecked} on:change={toggleCheckbox}>
    {label}
  </label>
  