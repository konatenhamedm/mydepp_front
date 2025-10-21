<script lang="ts">
  export let item: any = [];
  export let afficheAction: boolean = true;
</script>

<thead class=" text-white text-left" style="background-color: #151111">
  <tr>
    {#each item as title}
      <th
        class="px-4 py-3 border border-gray-200 text-[14px] font-medium uppercase"
        >{title}</th
      >
    {/each}
    {#if afficheAction}
      <th
        style="width: 10px;text-align: center; "
        class="px-4 py-3 border border-gray-200 text-[14px] text-center font-medium uppercase"
        >Actions</th
      >
    {/if}
  </tr>
</thead>
