<script lang="ts">
	import InputSimple from '$components/inputse/InputSimple.svelte';
	import { apiFetch, BASE_URL } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputse/InputSelect.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { User } from '../../../types';
	import InputTextArea from '$components/inputse/InputTextArea.svelte';
	import InputUserSelect from '$components/inputse/InputUserSelect.svelte';
	import { formatDate } from '$lib/dateUtils';

	export let open: boolean = false; // modal control
	let isLoad = false;

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	let userdata: any = [];

	// Initializing the user object with only email and status
	let priorite: string = '';
	let categorie: string = '';
	let libelle = '';
	let description = '';
	const dispatch = createEventDispatcher();

	const ticketTypes = [
		{ value: 'transaction', label: 'Transactions' },
		{ value: 'securiteCompte', label: 'Sécurité & Compte' },
		{ value: 'CartePaiement', label: 'Carte et Paiement' },
		{ value: 'PromotionService', label: 'Promotions et Service' }
	];

	const priorityLevels = [
		{ value: 'high', label: 'Élevée' },
		{ value: 'medium', label: 'Moyenne' },
		{ value: 'low', label: 'Basse' }
	];

	function getPriorityColor(priority: string) {
		switch (priority) {
			case 'high':
				return 'bg-red-500 text-white';
			case 'medium':
				return 'bg-yellow-500 text-white';
			case 'low':
				return 'bg-green-500 text-white';
			default:
				return 'bg-gray-200 text-gray-700';
		}
	}

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {}

	async function SaveFunction() {
		isLoad = true;

		const ticketData = {
			libelle: libelle,
			description: description,
			transaction_id: String(data?.id),
			priorite: priorite,
			type_reclamation: categorie
		};

		try {
			const res = await fetch(
				'https://flznzu5x07.execute-api.us-east-1.amazonaws.com/ticket/store',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(ticketData)
				}
			);

			if (res.ok) {
				isLoad = false;
				open = false;
				notificationMessage = 'Ticket ajouté a la transaction avec succès!';
				notificationType = 'success';
				showNotification = true;
				dispatch('added');
			}
		} catch (error) {
			console.error("Erreur lors de l'envoi du ticket:", error);
			isLoad = false;
		}
	}

	function selectPriority(priority: string) {
		priorite = priority;
	}

	$: transactionRef = data?.ref || 'N/A';
	$: serviceName = data?.service_name || 'N/A';
	$: serviceCode = data?.serviceCode || 'N/A';
	$: amount = data?.montant ? `${data.montant} ${data.devise || 'N/A'}` : 'N/A';
	$: transactionStatus = data?.status || 'N/A';
	$: creationDate = formatDate(data?.transaction_date) || 'N/A';
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
		<div class="mb-4 grid grid-cols-2 gap-6">
			<div class="flex flex-col items-start">
				<label class="font-semibold text-gray-700">Référence de la transaction</label>
				<div class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700">
					{transactionRef}
				</div>
			</div>
			<div class="flex flex-col items-start">
				<label class="font-semibold text-gray-700">Nom du service</label>
				<div class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700">
					{serviceName}
				</div>
			</div>
		</div>

		<div class="mb-4 grid grid-cols-2 gap-6">
			<div class="flex flex-col items-start">
				<label class="font-semibold text-gray-700">Code du service</label>
				<div class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700">
					{serviceCode}
				</div>
			</div>
			<div class="flex flex-col items-start">
				<label class="font-semibold text-gray-700">Montant</label>
				<div class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700">
					{amount}
				</div>
			</div>
		</div>

		<div class="mb-4 grid grid-cols-2 gap-6">
			<div class="flex flex-col items-start">
				<label class="font-semibold text-gray-700">Status actuel de la transaction</label>
				<div class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700">
					{transactionStatus}
				</div>
			</div>
			<div class="flex flex-col items-start">
				<label class="font-semibold text-gray-700">Date de création</label>
				<div class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700">
					{creationDate}
				</div>
			</div>
		</div>

		<form action="#">
			<div class="mb-4 grid grid-cols-3 gap-6">
				<div>
					<label for="categorie" class="mb-2 block text-sm font-normal text-black"
						>Sélectionner une catégorie</label
					>
					<select
						id="categorie"
						bind:value={categorie}
						class="w-full rounded-md border p-2 text-black"
					>
						{#each ticketTypes as type}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				</div>
				<div>
					<InputSimple
						fieldName="libelle"
						label="Libellé"
						bind:field={libelle}
						placeholder="Entrez le libellé"
					/>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium">Priorité</label>
					<div class="flex gap-2">
						{#each priorityLevels as priority}
							<button
								type="button"
								class={`rounded-md px-4 py-2 text-sm font-medium ${
									priorite === priority.value
										? getPriorityColor(priority.value)
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}
								on:click={() => selectPriority(priority.value)}
							>
								{priority.label}
							</button>
						{/each}
					</div>
				</div>
			</div>
			<!-- Champ de commentaire -->
			<div class="flex flex-col items-start">
				<label class="font-semibold text-gray-700">Description</label>
				<textarea
					bind:value={description}
					class="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700"
					placeholder="Ajoutez la description..."
					rows="3"
				></textarea>
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
