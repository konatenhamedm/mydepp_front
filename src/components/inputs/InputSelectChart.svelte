<script lang="ts">
	type Select = { id: number | string; libelle: string };

	export let label: string = '';
	export let datas: Select[] = [];
	export let id: string = '';
	export let selectedId: string | number | null = '';
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let error: string = '';
	export let useIdAsValue: boolean = true; // équivaut à ton "isSelected"
</script>

<div class="w-full mx-auto space-y-1">
	{#if label}
		<label
			for={id}
			class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>
			{label}
			{#if required}
				<span class="text-red-500 ml-1">*</span>
			{/if}
		</label>
	{/if}

	<select
		id={id}
		bind:value={selectedId}
		disabled={disabled}
		required={required}
		class={`w-full min-h-[48px] px-4 py-2.5 text-[15px] rounded-md
			bg-white text-black dark:bg-box-dark-up dark:text-subtitle-dark
			outline-none ring-0 transition
			${error
				? 'border border-red-500 focus:border-red-500 focus:ring-red-500'
				: 'border border-gray-300 focus:border-black focus:ring-0'}
			${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
	>
		<option value="">Veuillez sélectionner {label}</option>
		{#each datas as data (data.id)}
			<option value={useIdAsValue ? data.id : data.libelle}>
				{data.libelle}
			</option>
		{/each}
	</select>

	{#if error}
		<p class="mt-1 text-sm text-red-500">{error}</p>
	{/if}
</div>
