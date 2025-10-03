<script lang="ts">
  export let label: string;
  export let existelabel: boolean = true;
  export let field: any;
  export let type: string = "text";
  export let fieldName: string;
  export let placeholder: string = '';
  export let disabled: boolean = false;
</script>

<div class="mb-4">
  {#if existelabel}
    <label
      for={fieldName}
      class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200 capitalize"
    >
      {label}
    </label>
  {/if}

  <input
    name={fieldName}
    {type}
    id={fieldName}
    class="w-full min-h-[50px] rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 
           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
           disabled:bg-gray-100 disabled:cursor-not-allowed transition"
    {placeholder}
    bind:value={field}
    {disabled}
  />
</div>
