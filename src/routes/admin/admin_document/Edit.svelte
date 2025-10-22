<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
	import InputTextArea from '$components/inputs/InputTextArea.svelte';
	import InputUserSelect from '$components/inputs/InputUserSelect.svelte';
    import ImageInputNew from '$components/inputs/ImageInputNew.svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;
	let userdata: any = [];
	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	// Initializing the item object with only email and status
	let icons: any = {
		libelle: '',
		path: null
	};
	let itemdata: any = [];

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		icons = {
			libelle: data?.libelle || '',
			path: data?.path || null
		};
	}

	onMount(() => {});

async function SaveFunction() {
		const formData = new FormData();
		formData.append("libelle", icons.libelle);

		if (icons.path instanceof File) {
			// Vérifie que c'est bien un fichier
			formData.append("path", icons.path);
		}
		console.log(formData);

		isLoad = true;
		try {
			const res = await fetch(BASE_URL_API + "/adminDocument/update/" + data?.id, {
				method: "POST",
				body: formData,
			});

			if (res.ok) {
				isLoad = false;
				open = false;
				notificationMessage = "document créé avec succès!";
				notificationType = "success";
				showNotification = true;
			}
		} catch (error) {
			notificationMessage = "Une erreur crée lors de l enregistrement";
			notificationType = "error";
			showNotification = true;
			isLoad = false;
			console.error("Error saving:", error);
		}
	}

	function handleModalClose(event: Event) {
		if (isLoad) {
			event.preventDefault();
		}
	}

	// Gérer l'upload de l'image
	let imageUrl: string | null = null;


</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-1">
	<!-- Card Body -->
	<div class="space-y-6">
		<form action="#" use:init>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<InputSimple
					type="text"
					label="Libelle"
					fieldName="libelle"
					bind:field={icons.libelle}
				/>
				<!-- Champ pour le code du devise -->
				<ImageInputNew
					label="Image"
					fieldName="image_url"
					bind:field={icons.path}
					placeholder="Sélectionnez une image"
					showPreview={true}
					link={icons.path ? icons.path?.path + '/' + icons.path?.alt : ""}
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
