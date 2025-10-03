<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let currentPage: number = 1;
  export let totalPages: number = 1;
  export let startRange: number = 0;
  export let endRange: number = 0;
  export let totalItems: number = 0;

  const dispatch = createEventDispatcher();

  function goToPage(page: number) {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;

    if (page !== currentPage) {
      dispatch('pageChange', page);
    }
  }

  function getPagesToDisplay() {
    const delta = 2; 
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > delta + 2) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - (delta + 1)) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  }
</script>

<div class="grid grid-cols-12 items-center gap-4">
  <div class="col-span-3 p-2">
    <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
      Affichage
      <span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
      sur un total de
      <span class="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
    </span>
  </div>

  <div class="col-span-9">
    <nav aria-label="Pagination">
      <ul class="flex items-center gap-2 justify-end">
        <li>
          <button
            class="btn"
            on:click={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Page précédente"
          >
            ‹
          </button>
        </li>
        {#each getPagesToDisplay() as page}
          <li>
            {#if page === '...'}
              <span class="px-2">…</span>
            {:else}
              <button
                class="btn {page === currentPage ? 'active' : ''}"
                aria-current={page === currentPage ? 'page' : undefined}
                on:click={() => goToPage(page as number)}
              >
                {page}
              </button>
            {/if}
          </li>
        {/each}
        <li>
          <button
            class="btn"
            on:click={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Page suivante"
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  </div>
</div>

<style>
  .btn {
    padding: 0.25rem 0.75rem;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
    font-size: 1rem;
    border-radius: 4px;
  }
  .btn[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn.active {
    background: #00baff;
    color: white;
    border-color: #00baff;
    font-weight: bold;
  }
</style>
