<script lang="ts">
  import { Button, Input, Label, Modal, Textarea } from "flowbite-svelte";

  export let label: string;
  export let field: any;
  export let fieldName: string;
  export let placeholder: string = "";
  export let disabled: boolean = false;

  let showPassword = false; // To toggle password visibility
  // export let requis: boolean = false; // Si nécessaire, décommentez et utilisez correctement
</script>

<Label class="col-span-6 space-y-1 sm:col-span-3">
  <span>{label}</span>
 
  <div class="relative flex w-full">
    {#if showPassword}
      <input
        id="Password"
        bind:value={field}
        class="border rounded w-full py-3 px-3 leading-tight border-gray-200 bg-gray-100 focus:outline-none focus:border-indigo-700 focus:bg-white text-gray-700 pr-16 font-mono js-password"
        type="text"
        {placeholder}
        {disabled}
        {...$$restProps}
      />
    {:else}
      <input
        id="Password"
        bind:value={field}
        class="border rounded w-full py-3 px-3 leading-tight border-gray-200 bg-gray-100 focus:outline-none focus:border-indigo-700 focus:bg-white text-gray-700 pr-16 font-mono js-password"
        type="password"
        {placeholder}
        {disabled}
        {...$$restProps}
      />
    {/if}
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
      on:click={() => (showPassword = !showPassword)}
    >
      {#if showPassword}
        👁️‍🗨️
      {:else}
        👁️
      {/if}
    </button>
    <!-- <input class=" border-1 rounded w-full py-3 px-3 leading-tight border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-700 focus:bg-white text-gray-700 pr-16 font-mono js-password" id="password" type="password" name="login[password]" autocomplete="off" placeholder="*********" value="1234@abc" required="" /> -->
  </div>
</Label>
