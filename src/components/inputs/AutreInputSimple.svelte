<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { onClickOutside } from '$lib/utils/onClickOutside'; // adapte le chemin si besoin
  
    export let options: { id: string; libelle: string }[] = [];
    export let selected: { id: string; libelle: string } | null = null;
  
    const dispatch = createEventDispatcher();
  
    let search = '';
    let open = false;
    let container: HTMLDivElement;
  
    function selectOption(option: { id: string; libelle: string }) {
      selected = option;
      dispatch('change', selected);
      open = false;
      search = '';
    }
  
    $: filtered = options.filter((o) =>
      o.libelle.toLowerCase().includes(search.toLowerCase())
    );
  </script>
  
  <div
    bind:this={container}
    use:onClickOutside={() => (open = false)}
    class="relative w-full max-w-md"
  >
    <label class="block mb-2 text-sm font-medium text-gray-700">Select Option</label>
  
    <!-- Zone cliquable -->
    <div
      class="p-2 border rounded-md bg-white shadow-sm cursor-pointer border-black"
      on:click={() => (open = !open)}
    >
      {#if selected}
        <span class="text-sm text-gray-800">{selected.libelle}</span>
      {:else}
        <span class="text-sm text-gray-400">Select an option...</span>
      {/if}
    </div>
  
    <!-- Dropdown avec position absolue -->
    {#if open}
      <div class="relative">
        <input
          type="text"
          bind:value={search}
          class="w-full px-3 py-1 border border-gray-300 text-sm rounded-t-md"
          placeholder="Search..."
          autofocus
        />
  
        <ul
          class="absolute left-0 right-0 bg-white border border-t-0 rounded-b-md shadow-lg max-h-60 overflow-auto z-10"
        >
          {#each filtered as option}
            <li
              class="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
              on:click={() => selectOption(option)}
            >
              {option.libelle}
            </li>
          {/each}
          {#if filtered.length === 0}
            <li class="px-4 py-2 text-sm text-gray-500">No results</li>
          {/if}
        </ul>
      </div>
    {/if}
  </div>
  