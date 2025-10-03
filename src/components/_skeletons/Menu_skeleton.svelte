
<script lang="ts">
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

  
</script>

<ul class="space-y-2 p-4">
  {#each Array(3) as _}
    <li class="space-y-1">
      <Skeleton class="h-3 w-24 rounded bg-muted" />
      <Skeleton class="h-4 w-40 rounded bg-muted" />
      <div class="ps-4 space-y-1">
        <Skeleton class="h-3 w-32 rounded bg-muted" />
        <Skeleton class="h-3 w-28 rounded bg-muted" />
      </div>
    </li>
  {/each}
</ul>