<script lang="ts">
	type Select = { id: number; libelle: string };
	export let label: string;
	export let datas: Select[] = [];
	export let id: string;
	export let selectedId: any;
	export let isSelected: boolean = true;
	export let disabled: boolean = false;
</script>

<div class="w-full mx-auto">
	<label for={id} class="block mb-2 text-sm font-medium text-gray-900">{label}</label>
	<select
		id={id}
		disabled={disabled}
		bind:value={selectedId}
		class="w-full min-h-[50px] px-5 py-3 text-[15px] rounded-md
            border !border-black outline-none ring-0
            bg-white text-black dark:bg-box-dark-up dark:text-subtitle-dark
            focus:border-black focus:ring-0"
	>
		<option value="">Veuillez sélectionner {label}</option>
		{#each datas as data}
			{#if isSelected}
				<option value={data.id}>{data.libelle}</option>
			{:else}
				<option value={data.libelle}>{data.libelle}</option>
			{/if}
		{/each}
	</select>
</div>
