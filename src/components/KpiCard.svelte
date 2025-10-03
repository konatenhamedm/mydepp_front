<script lang="ts">
  import type { ComponentType } from 'svelte';

  export let icon: ComponentType;
  export let label: string;
  export let value: number | string;
  export let color: string = "blue"; // bg-blue-100 text-blue-600
</script>

<div class="bg-white p-6 rounded-xl shadow flex items-center gap-4">
  <div class={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
    <svelte:component this={icon} size="24" />
  </div>
  <div>
    <span class="text-gray-500">{label}</span>
    <span class="block text-2xl font-semibold">{value}</span>
  </div>
</div>
