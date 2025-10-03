<script lang="ts">
	import InputSimple from '$components/inputse/InputSimple.svelte';
	import { apiFetch, BASE_URL } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputse/InputSelect.svelte';
	import { onMount } from 'svelte';
	import InputTextArea from '$components/inputse/InputTextArea.svelte';
	import InputUserSelect from '$components/inputse/InputUserSelect.svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;
	let userdata: any = [];
	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	// Initializing the item object with only email and status
	let pays: any = {
		code: '',
		libelle: '',
		flag: ''
	};
	let itemdata: any = [];

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		pays = {
			code: data?.code || '',
			libelle: data?.libelle || '',
			flag: data?.flag || ''
		};
	}

	onMount(() => {});

	async function SaveFunction() {
		isLoad = true;

		try {
			// Example POST request (replace with your actual API call)
			const res = await fetch(BASE_URL + '/update/' + data?.id, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					code: pays.code, // Utiliser pays.code au lieu de pays.name
					libelle: pays.libelle, // Utiliser pays.libelle au lieu de pays.last_name
					flag: pays.flag
				})
			});

			if (res.ok) {
				isLoad = false;
				open = false; // Close the modal
			}
		} catch (error) {
			console.error('Error saving:', error);
		}
	}

	function handleModalClose(event: Event) {
		if (isLoad) {
			event.preventDefault();
		}
	}

	// Gérer l'upload de l'image
	let imageUrl: string | null = null;

	function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			pays.flag = input.files[0];
			imageUrl = URL.createObjectURL(pays.flag); // Créer une URL pour l'aperçu de l'image
		}
	}
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-1 shadow">
	<!-- Card Body -->
	<div class="space-y-6">
		<form action="#" use:init>
			<div class="grid grid-cols-1 gap-6">
				<InputSimple
					fieldName="code"
					label="Code"
					bind:field={pays.code}
					placeholder="Entrez le code"
				/>
				<InputSimple
					fieldName="libelle"
					label="Libellé"
					bind:field={pays.libelle}
					placeholder="Entrez le libellé"
				/>
				<!-- Champ pour uploader l'image -->
				<label for="image-upload" class="mt-4 block text-sm font-medium text-gray-700"
					>Télécharger une image</label
				>
				<input
					type="file"
					id="image-upload"
					accept="image/*"
					on:change={handleImageUpload}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				/>

				{#if imageUrl}
					<div class="mt-4">
						<img
							src={imageUrl}
							alt="Aperçu de l'image"
							class="h-32 w-32 rounded-md border object-cover"
						/>
					</div>
				{/if}
			</div>
		</form>
	</div>

	<!-- Card Footer -->
	<div class="flex justify-end border-t border-gray-200 pt-4">
		{#if isLoad}
			<button
				disabled
				class="cursor-not-allowed rounded bg-blue-500 px-4 py-2 text-white opacity-50"
			>
				<div class="flex items-center space-x-2">
					<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
					<span>Chargement...</span>
				</div>
			</button>
		{:else}
			<button
				on:click={SaveFunction}
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
			>
				Enregistrer
			</button>
		{/if}
	</div>
</div>

<!-- Notification Component -->
{#if showNotification}
	<Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}
