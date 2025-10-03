<script>
    let isChecked = false;
  
    function toggleCheckbox() {
      isChecked = !isChecked;
      console.log(`Checkbox is ${isChecked ? 'checked' : 'unchecked'}`);
    }
  </script>
  
  <label>
    <input type="checkbox" bind:checked={isChecked} on:change={toggleCheckbox}>
    Accept terms and conditions
  </label>
  