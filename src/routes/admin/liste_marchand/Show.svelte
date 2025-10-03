<script lang="ts">
	import { onMount } from 'svelte';
	import Notification from '$components/_includes/Notification.svelte';

	// Props
	export let open: boolean = false; // modal control
	export let data: Record<string, any> = {};

	let isLoad = false;
	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	// Structure locale pour l'affichage
	let item: any = {
		nom: '',
		prenoms: '',
		email: '',
		tel: '',
		app_version: '',
		build_version: '',
		device_type: '',
		last_connection: '',
		pays_id: '',
		role_id: '',
		created_at: '',
		updated_at: '',
	};

	function cancelDelete() {
		open = false;
	}

	function init() {
		if (data) {
			item = { ...item, ...data };
		}
	}

	onMount(() => {
		init();
	});

	function handleModalClose(event: Event) {
		if (isLoad) {
			event.preventDefault();
		}
	}
</script>

<!-- Modal Content Wrapper -->
<div class="bg-white rounded-lg shadow p-4 space-y-4">
	<!-- Card Body -->
	<div class="space-y-6">
		<form action="#" use:init>
			<div class="grid grid-cols-2 gap-4 mb-1">
				<div class="flex flex-col">
					<label class="font-semibold text-gray-700">Nom</label>
					<div class="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
						{item.nom || 'Non spécifié'}
					</div>
				</div>
				<div class="flex flex-col">
					<label class="font-semibold text-gray-700">Prénoms</label>
					<div class="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
						{item.prenoms || 'Non spécifié'}
					</div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4 mb-1">
				<div class="flex flex-col">
					<label class="font-semibold text-gray-700">Email</label>
					<div class="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
						{item.email || 'Non spécifié'}
					</div>
				</div>
				<div class="flex flex-col">
					<label class="font-semibold text-gray-700">Téléphone</label>
					<div class="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
						{item.tel || 'Non spécifié'}
					</div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4 mb-1">
				<div class="flex flex-col">
					<label class="font-semibold text-gray-700">App Version</label>
					<div class="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
						v{item.app_version} (build {item.build_version || '-'})
					</div>
				</div>
				<div class="flex flex-col">
					<label class="font-semibold text-gray-700">Device</label>
					<div class="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
						{item.device_type || 'Non spécifié'}
					</div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4 mb-1">
				<div class="flex flex-col">
					<label class="font-semibold text-gray-700">Dernière connexion</label>
					<div class="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
						{item.last_connection
							? new Date(item.last_connection).toLocaleString()
							: 'Jamais'}
					</div>
				</div>
				<div class="flex flex-col">
					<label class="font-semibold text-gray-700">Rôle</label>
					<div class="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
						{item.role_id || 'Non spécifié'}
					</div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4 mb-1">
				<div class="flex flex-col">
					<label class="font-semibold text-gray-700">Pays</label>
					<div class="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
						{item.pays_id || 'Non spécifié'}
					</div>
				</div>
				<div class="flex flex-col">
					<label class="font-semibold text-gray-700">Créé le</label>
					<div class="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
						{item.created_at
							? new Date(item.created_at).toLocaleDateString()
							: 'Non spécifié'}
					</div>
				</div>
			</div>
		</form>
	</div>

	<!-- Card Footer -->
	<div class="flex justify-end pt-4 border-t border-gray-200">
		<button
			style="margin-right: 9px;"
			on:click={cancelDelete}
			disabled={isLoad}
			class="px-4 py-2 mr-[9px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
		>
			Fermer
		</button>
	</div>
</div>

<!-- Notification Component -->
{#if showNotification}
	<Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}
