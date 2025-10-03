<script lang="ts">
	import { BASE_URL_API_UPLOAD } from '$lib/api';
	import { onDestroy } from 'svelte';

	export let label: string;
	export let existelabel: boolean = true;
	export let field: any;
	export let fieldName: string;
	export let placeholder: string = '';
	export let disabled: boolean = false;
	export let accept: string = 'image/*';
	export let multiple: boolean = false;
	export let showPreview: boolean = true; // Nouvelle prop pour contrôler l'affichage de la prévisualisation
	export let link: any = '';

	let previewUrl: string = '';
	let error: string = '';

	function handleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const files = input.files;
		error = '';

		if (files && files[0]) {
			const file = files[0];

			if (!file.type.match('image.*')) {
				error = 'Veuillez sélectionner un fichier image valide';
				previewUrl = '';
				field = null;
				return;
			}

			field = multiple ? files : file;

			const reader = new FileReader();
			reader.onload = (e) => {
				previewUrl = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	onDestroy(() => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
	});
</script>

<div class="mb-2">
	{#if existelabel}
		<label
			for={fieldName}
			class="dark:text-title-dark mb-2 block text-sm font-medium text-gray-900 capitalize"
		>
			{label}
		</label>
	{/if}

	<div class="flex items-center gap-4">
		<!-- { previewUrl } -->

		{#if link != '' && !previewUrl}
			{#if link && showPreview}
				<div class="flex-shrink-0">
					<img
						src={BASE_URL_API_UPLOAD+link}
						alt="Aperçu de l'image"
						class="h-16 w-16 rounded-md border border-gray-300 object-cover"
					/>
				</div>
			{/if}
		{:else }
    {#if previewUrl && showPreview}
    <div class="flex-shrink-0">
      <img
        src={previewUrl}
        alt="Aperçu de l'image"
        class="h-16 w-16 rounded-md border border-gray-300 object-cover"
      />
    </div>
  {/if}

			
		{/if}

		<div class="flex-1">
			<input
				type="file"
				name={fieldName}
				id={fieldName}
				class="min-h-[50px] w-full rounded-md border !border-black bg-white
                       px-5 py-3 text-[15px] text-black
                       ring-0 outline-none
                       placeholder:text-[#A0A0A0] focus:border-black focus:ring-0"
				{accept}
				{multiple}
				{placeholder}
				{disabled}
				on:change={handleChange}
			/>

			{#if error}
				<div class="mt-1 text-sm text-red-600">{error}</div>
			{/if}
		</div>
	</div>
</div>
