<script lang="ts">
  import { onClickOutside } from '$lib/utils/onClickOutside'; // ou créez votre propre directive

  export let options: { id: string; nom: string;prenoms:string }[] = [];
  export let selected: { id: string; nom: string ;prenoms:string }[] = [];
  let search = '';
  let open = false;

  function selectOption(option:any) {
    if (!selected.find((s) => s.id === option.id)) {
      selected = [...selected, option];
    }
    search = '';
    open = false;
  }

  function removeOption(id:any) {
    selected = selected.filter((o) => o.id !== id);
  }

  $: filtered = options.filter(
    (o) =>
      o.nom.toLowerCase().includes(search.toLowerCase()) &&
      !selected.find((s) => s.id === o.id)
  );

  let container: HTMLDivElement;
</script>

<div bind:this={container} class="relative w-full " use:onClickOutside={() => open = false}>
  <label class="block mb-2 text-sm font-medium text-gray-700">Select Options</label>
  <div
    class="flex flex-wrap items-center gap-2 p-2 border rounded-md bg-white shadow-sm cursor-text border !border-black"
    on:click={() => (open = true)}>
    {#each selected as sel}
      <span class="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
        {sel.nom} {sel.prenoms}
        <button
          class="ml-1 text-blue-500 hover:text-blue-800"
          on:click={() => removeOption(sel.id)}>×</button>
      </span>
    {/each}
    <input
      class="flex-1 p-1 text-sm outline-none border-none"
      type="text"
      placeholder="Type to search..."
      bind:value={search}
      on:focus={() => (open = true)} />
  </div>

  {#if open && filtered.length > 0}
    <ul class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
      {#each filtered as option}
        <li
          class="px-4 py-2 hover:bg-blue-100 cursor-pointer"
          on:click={() => selectOption(option)}>
          {option.nom} {option.prenoms}
        </li>
      {/each}
    </ul>
  {/if}
</div>
