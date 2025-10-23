<script lang="ts">
	import { apiFetch, BASE_URL_API } from '$lib/api';
	import { Button, Modal } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import { onMount } from 'svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		// Initialisation si nécessaire
	}

	async function confirmDelete() {
		isLoad = true;

		try {
			// Example POST request (replace with your actual API call)
			const res = await apiFetch(true,`/typePersonne/delete/` + data?.id,"DELETE");

			if (res) {
				isLoad = false;
				open = false; // Close the modal
			}
		} catch (error) {
			console.error('Error saving:', error);
		}
	}

	function cancelDelete() {
		open = false;
	}

	function handleModalClose(event: Event) {
		if (isLoad) {
			event.preventDefault();
		}
	}
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-1">
	<!-- Message d'alerte -->
	<div class="text-center">
		<h3 class="mb-4 text-lg font-medium text-gray-900">Confirmer la suppression</h3>
		<p class="text-gray-500">
			Êtes-vous sûr de vouloir supprimer cet enregistrement ({data?.libelle}) ? Cette action est
			irréversible.
		</p>
	</div>

	<!-- Boutons d'action -->
	<div class="flex justify-end space-x-3 border-t border-gray-200 pt-4">
		<button
			style="margin-right: 9px;"
			on:click={cancelDelete}
			disabled={isLoad}
			class="mr-[9px] rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
		>
			Annuler
		</button>
		{#if isLoad}
			<button
				disabled
				class="cursor-not-allowed rounded bg-red-500 px-4 py-2 text-white opacity-50"
			>
				<div class="flex items-center space-x-2">
					<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
					<span>Suppression...</span>
				</div>
			</button>
		{:else}
			<button
				on:click={confirmDelete}
				class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
			>
				Confirmer la suppression
			</button>
		{/if}
	</div>
</div>

<!-- Notification Component -->
{#if showNotification}
	<Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}
