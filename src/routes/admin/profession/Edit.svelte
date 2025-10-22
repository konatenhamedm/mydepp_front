<script lang="ts">
	import InputSimple from "$components/inputs/InputSimple.svelte";
	import { apiFetch, BASE_URL_API } from "$lib/api";
	import { Button, Modal, Select } from "flowbite-svelte";
	import Notification from "$components/_includes/Notification.svelte";
	import InputSelect from "$components/inputs/InputSelect.svelte";
	import { onMount } from "svelte";
	import InputTextArea from "$components/inputs/InputTextArea.svelte";
	import InputUserSelect from "$components/inputs/InputUserSelect.svelte";

	export let open: boolean = false; // modal control
	let isLoad = false;
	let userdata: any = [];
	let showNotification = false;
	let notificationMessage = "";
	let notificationType = "info";
	let typeProfessions: any = [];
	// Initializing the item object with only email and status
	let devise: any = {
		code: "",
		libelle: "",
		typeProfession: "",
		montantRenouvellement: "",
		montantNouvelleDemande: "",
		chronoMax: "",
	};
	let itemdata: any = [];

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		devise = {
			code: data?.code || "",
			libelle: data?.libelle || "",
			typeProfession: data?.typeProfession.id || "",
			montantRenouvellement: data?.montantRenouvellement || "",
			montantNouvelleDemande: data?.montantNouvelleDemande || "",
			chronoMax: data?.chronoMax || "",
		};
	}

	onMount(() => {});

	async function SaveFunction() {
		isLoad = true;

		try {
			// Example POST request (replace with your actual API call)
			const res = await apiFetch(
				true,
				"/devies/update/" + data?.id,
				"PUT",
				{
					code: devise.code,
					symbole: devise.symbole,
					nb_decimal: devise.nb_decimal,
				},
			);

			if (res.ok) {
				isLoad = false;
				open = false; // Close the modal
			}
		} catch (error) {
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

	function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			devise.flag = input.files[0];
			imageUrl = URL.createObjectURL(devise.flag); // Créer une URL pour l'aperçu de l'image
		}
	}
	async function getTypeProfession() {
		try {
			const res = await fetch(BASE_URL_API + "/typeProfession");
			const data = await res.json();
			typeProfessions = data.data;
		} catch (error) {
			console.error("Error fetching villes:", error);
		}
	}

	onMount(async () => {
		await getTypeProfession();
	});
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-1">
	<!-- Card Body -->
	<div class="space-y-6">
<form action="#" use:init>
			<div class="grid grid-cols-2 gap-6 md:grid-cols-2">
				<!-- Champ pour le code du devise -->
				<InputSimple
					fieldName="code"
					type="text"
					label="Code"
					bind:field={devise.code}
					placeholder="Entrez le code du devise"
				/>

				<InputSimple
					fieldName="libelle"
					type="text"
					label="Libelle"
					bind:field={devise.libelle}
					placeholder="Entrez le libelle du devise"
				/>

				<InputSimple
					fieldName="codeGeneration"
					type="text"
					label="Code generation"
					bind:field={devise.codeGeneration}
					placeholder="Entrez le code generation du devise"
				/>

			<InputSelect
					label="Type profession"
					bind:selectedId={devise.typeProfession}
					datas={typeProfessions}
					id="typeProfession"
					required={true}
				></InputSelect>

				<InputSimple
					fieldName="montantRenouvellement"
					type="text"
					label="Montant renouvellement"
					bind:field={devise.montantRenouvellement}
					placeholder="Entrez le montant renouvellement du devise"
				/>

				<InputSimple
					fieldName="montantNouvelleDemande"
					type="text"
					label="Montant nouvelle demande"
					bind:field={devise.montantNouvelleDemande}
				/>

				
			</div>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<InputSimple
					fieldName="chronoMax"
					type="number"
					label="Chrono max"
					bind:field={devise.chronoMax}
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
					<div
						class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"
					></div>
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
	<Notification
		message={notificationMessage}
		type={notificationType}
		duration={5000}
	/>
{/if}
