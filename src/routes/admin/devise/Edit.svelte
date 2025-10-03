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
	let devise: any = {
		code: '',
		symbole: '',
		nb_decimal: 0
	};
	let itemdata: any = [];

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		devise = {
			code: data?.code || '',
			symbole: data?.symbole || '',
			nb_decimal: data?.nb_decimal || 0
		};
	}

	onMount(() => {});

	async function SaveFunction() {
		isLoad = true;

		try {
			// Example POST request (replace with your actual API call)
			const res = await apiFetch(true,'/devies/update/' + data?.id, "PUT", {

				code: devise.code, 
					symbole: devise.symbole,
					nb_decimal: devise.nb_decimal
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
			devise.flag = input.files[0];
			imageUrl = URL.createObjectURL(devise.flag); // Créer une URL pour l'aperçu de l'image
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
					bind:field={devise.code}
					placeholder="Entrez le code du devise"
				/>

				<InputSimple
					fieldName="symbole"
					label="Symbole"
					bind:field={devise.symbole}
					placeholder="Entrez le symbole du devise"
				/>

				<InputSimple
					fieldName="nb_decimal"
					label="Nombre decimal"
					bind:field={devise.nb_decimal}
					placeholder="Entrez le nombre décimal du devise"
				/>

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
