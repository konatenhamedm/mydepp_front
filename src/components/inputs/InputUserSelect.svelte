<script lang="ts">
	type Select = { id: number; nom: string; prenoms: string };
	
	export let label: string = '';
	export let datas: Select[] = [];
	export let id: string = '';
	export let selectedId: any = '';
	export let isSelected: boolean = true;
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let error: string = '';
</script>

<div class="w-full">
	{#if label}
		<label for="{id}" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}
	
	<select
		id="{id}"
		{disabled}
		bind:value={selectedId}
		class={`rounded-4 border min-h-[50px] w-full px-[20px] py-[12px] text-[15px] outline-none
			${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' :'!border-black dark:bg-box-dark-up text-body dark:text-subtitle-dark focus:ring-primary focus:border-primary placeholder:text-[#A0A0A0]'
      }`}
		{required}
	>
		<option value="">Veuillez sélectionner {label}</option>
		{#each datas as data}
			{#if isSelected}
				<option value={data.id}>{data.nom} {data.prenoms}</option>
			{:else}
				<option value={data.nom}>{data.nom} {data.prenoms}</option>
			{/if}
		{/each}
	</select>
	
	{#if error}
		<p class="mt-1 text-sm text-red-500">{error}</p>
	{/if}
</div>