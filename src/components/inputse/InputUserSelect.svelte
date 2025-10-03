<script lang="ts">
type Select = {id:number,nom:string,prenoms:string }
export let label;
export let datas: Select[] = [];
export let id;
export let selectedId : any ;
export let isSelected = true;
export let disabled: boolean = false;

</script>


<div class="w-full  ">
    <label for="{id}" class="block mb-2 text-sm font-medium text-gray-900">{label}</label>
    <select id="{id}"     disabled={disabled} bind:value={selectedId} class="rounded-4 border !border-black dark:bg-box-dark-up text-body dark:text-subtitle-dark focus:ring-primary focus:border-primary min-h-[50px] w-full border border-black px-[20px] py-[12px] text-[15px] outline-none placeholder:text-[#A0A0A0]">
      <option value="">Veillez selectionnez {label}</option>
      {#each datas as data }
     {#if isSelected }
     <option  value="{data.id}"  >{data.nom} {data.prenoms}</option>
     {:else }
     <option  value="{data.nom}"  >{data.nom} {data.prenoms}</option>
     {/if }
     {/each}

    </select>
  </div>

