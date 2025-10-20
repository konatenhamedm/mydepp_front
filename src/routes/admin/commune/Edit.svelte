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
	let villes: any = [];
	// Initializing the item object with only email and status
	let devise: any = {
		libelle: "",
		ville: "",
	};
	let itemdata: any = [];

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		devise = {
			libelle: data?.libelle || "",
			ville: data?.ville?.id || "",
		};
	}

	onMount(() => {});

	async function SaveFunction() {
		isLoad = true;

		try {
			// Example POST request (replace with your actual API call)
			const res = await apiFetch(
				true,
				"/commune/update/" + data?.id,
				"PUT",
				{
					libelle: devise.libelle,
					ville: devise.ville,
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

	async function getData() {
		try {
			const res = await fetch(BASE_URL_API + "/ville/");
			const data = await res.json();
			villes = data.data;
		} catch (error) {
			console.error("Error fetching villes:", error);
		}
	}

	onMount(async () => {
		await getData();
	});
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-1">
	<!-- Card Body -->
	<div class="space-y-6">
		<form action="#" use:init>
			<div class="grid grid-cols-1 gap-6">
					<InputSimple
					fieldName="libelle"
					type="text"
					label="Libelle"
					bind:field={devise.libelle}
					placeholder="Entrez le libelle du devise"
					required={true}
				/>

				<InputSelect
					label="Ville"
					bind:selectedId={devise.ville}
					datas={villes}
					id="ville"
					required={true}
				></InputSelect>
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
