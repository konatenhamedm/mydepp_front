<script lang="ts">
  export let label: string = '';
  export let id: string = 'password';
  export let value: string = '';
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let error: string = '';

  let showPassword = false;
</script>

<div class="w-full mx-auto">
  {#if label}
    <label for={id} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}

  <div class="relative">
    <input
      id={id}
      bind:value={value}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      {disabled}
      {required}
      class={`w-full min-h-[50px] px-5 py-3 text-[15px] rounded-md outline-none ring-0 pr-12
        ${error 
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
          : 'border !border-black bg-white text-black dark:bg-box-dark-up dark:text-subtitle-dark focus:border-black focus:ring-0'}
      `}
    />

    <!-- Bouton toggle affichage -->
    <button
      type="button"
      class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
      on:click={() => (showPassword = !showPassword)}
      tabindex="-1"
    >
      {#if showPassword}
        👁️‍🗨️
      {:else}
        👁️
      {/if}
    </button>
  </div>

  {#if error}
    <p class="mt-1 text-sm text-red-500">{error}</p>
  {/if}
</div>
