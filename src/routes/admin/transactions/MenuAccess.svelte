<script lang="ts">

	import InputSimple from '$components/inputse/InputSimple.svelte';
	import { apiFetch,BASE_URL } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputse/InputSelect.svelte';
	import { onMount } from 'svelte';
	import InputTextArea from '$components/inputse/InputTextArea.svelte';
	import InputUserSelect from '$components/inputse/InputUserSelect.svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;
let userdata :any = [];
	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	// Initializing the item object with only email and status
	let item: any = {
		libelle: '',
	};

	let itemdata : any = [];


	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {

        item.libelle = data?.libelle
    }

	onMount(() => {});

	async function SaveFunction() {
		isLoad = true;
		try {
			const res = await apiFetch(false , '/utilites/update/'+data?.id, "PUT",{
					libelle: item.libelle
					
				});
		
			console.log('content res', res);

			if (res) {
				isLoad = false;
				open = false;
				notificationMessage = 'Utilisateur modifié avec succès!';
				notificationType = 'success';
				showNotification = true;
			} else {
				
				notificationMessage = res.message;
				notificationType = 'error';
				showNotification = true;
			}
		} catch (error) {
			isLoad = false;

			// Afficher une notification d'erreur
			notificationMessage = error?.message;
			notificationType = 'error';
			showNotification = true;

			console.error('Error saving:', error);
		}
	}

	function handleModalClose(event: Event) {
		if (isLoad) {
			event.preventDefault();
		}
	}
	async function getData() {
    try {
      const res = await apiFetch(true,  "/auth/users/all");
      const data = await res.data;
      userdata = data;
    } catch (error) {
      console.error("Error fetching villes:", error);
    }
  }

	onMount(async () => {
      await getData();
  });

</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-1 shadow">
	<!-- Card Body -->
	<div class="space-y-6">
		<form action="#" use:init>
			<!-- Champ Email -->
			<div class="grid grid-cols-1 gap-3">
				<InputSimple
					type="text"
					fieldName="libelle"
					label="Libelle"
					bind:field={item.libelle}
					placeholder="Entrez le nom de l'équipe"
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
