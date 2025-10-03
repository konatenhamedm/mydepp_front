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

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	let userdata: any = [];

	// Initializing the user object with only email and status
	let pays: any = {
		code: '',
		libelle: '',
		taille_phone: 0
	};

	

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {}

	async function SaveFunction() {
		isLoad = true;
		try {
			const res = await apiFetch(true,'/pays/create', "POST", {
				code: pays.code,
					libelle: pays.libelle,
					taille_phone: pays.taille_phone
			});

			if (res) {
				isLoad = false;
				open = false;
				notificationMessage = 'Pays créé avec succès!';
				notificationType = 'success';
				showNotification = true;
			}
		} catch (error) {
			console.error('Error saving:', error);
		}
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			pays.flag = input.files[0];
		}
	}

	function handleModalClose(event: Event) {
		if (isLoad) {
			event.preventDefault();
		}
	}
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-1 shadow">
	<!-- Card Body -->
	<div class="space-y-6">
		<form action="#" use:init>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Champ pour le code du pays -->
				<InputSimple
					fieldName="code"
					label="Code"
					bind:field={pays.code}
					placeholder="Entrez le code du pays"
				/>

				<InputSimple
					fieldName="libelle"
					label="Libellé"
					bind:field={pays.libelle}
					placeholder="Entrez le nom du pays"
				/>

				<InputSimple
					fieldName="taille_phone"
					label="Taille phone"
					bind:field={pays.taille_phone}
					placeholder="Entrez la taille du phone"
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
