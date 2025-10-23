<script lang="ts">
	export let label: string = "";
	export let datas: any[] = [];
	export let id: string = "";
	export let selectedId: any = "";
	export let isSelected: boolean = true;
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let error: string = "";
</script>

<div class="w-full mx-auto">
	{#if label}
		<label
			for={id}
			class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}
	<select
		{id}
		{disabled}
		bind:value={selectedId}
		class={`w-full min-h-[50px] px-5 py-3 text-[15px] rounded-md outline-none ring-0
			${
				error
					? "border-red-500 focus:border-red-500 focus:ring-red-500"
					: "border !border-black bg-white text-black dark:bg-box-dark-up dark:text-subtitle-dark focus:border-black focus:ring-0"
			}`}
		{required}
	>
		<option value="">Veuillez sélectionner {label}</option>
		{#each datas as data}
			{#if isSelected}
				<option value={data.id}>{data.email}</option>
			{:else}
				<option value={data.libelle}>{data.email}</option>
			{/if}
		{/each}
	</select>

	{#if error}
		<p class="mt-1 text-sm text-red-500">{error}</p>
	{/if}
</div>
