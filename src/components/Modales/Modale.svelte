<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
  
    export let open = false;
    export let title = 'Modal';
    export let size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' = 'md';

  
    const dispatch = createEventDispatcher();
  
    const close = () => {
      open = false;
      dispatch('close');
    };
  
    $: dialogSizeClass = {
  sm: 'min-[576px]:max-w-[300px]',
  md: 'min-[576px]:max-w-[500px]',
  lg: 'min-[576px]:max-w-[700px]',
  xl: 'min-[576px]:max-w-[900px]',
  '2xl': 'min-[576px]:max-w-[1140px]',
  full: 'w-full min-h-screen min-[576px]:max-w-none px-4',
}[size];
  </script>
  
  {#if open}
  <div
  class="fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none bg-black/50"
  tabindex="-1"
  aria-labelledby="themedModalLabel"
  aria-hidden="true"
>
      <div
        class={`pointer-events-none relative w-auto translate-y-[0] opacity-100 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 ${dialogSizeClass}`}
      >
        <div
          class="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600"
          on:click|stopPropagation
        >
          <!-- Header -->
          <div class="flex items-center justify-between bg-[#00baff] p-4 border-b border-opacity-100 rounded-t-md border-regular dark:border-box-dark-up">
            <h5 class="text-[16px] font-semibold leading-normal text-white dark:text-title-dark uppercase" id="themedModalLabel">
              {title}
            </h5>
            <button type="button" class="hover:opacity-75" on:click={close}>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white dark:text-title-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <!-- Body -->
          <div class="relative flex-auto p-4">
            <slot />
          </div>
  
          <!-- Footer -->
         <!--  <div class="flex flex-wrap items-center justify-end gap-2 p-4 border-t border-opacity-100 rounded-b-md border-regular dark:border-box-dark-up">
            <slot name="footer">
              <button type="button" class="bg-secondary text-white px-6 py-2 rounded" on:click={close}>
                Fermer
              </button>
            </slot>
          </div> -->
        </div>
      </div>
    </div>
  {/if}
  