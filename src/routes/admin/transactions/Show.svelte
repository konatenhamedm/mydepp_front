<script lang="ts">
	import InputSimple from '$components/inputse/InputSimple.svelte';
	import { BASE_URL } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputse/InputSelect.svelte';
	import { onMount } from 'svelte';
	import { formatDate } from '$lib/dateUtils';
	function cancelDelete() {
		open = false;
	}
	export let open: boolean = false; // modal control
	let isLoad = false;

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	// Initializing the user object with only email and status
	$: transactionRef = data?.ref || 'N/A';
	$: serviceName = data?.service_name || 'N/A';
	$: serviceCode = data?.serviceCode || 'N/A';
	$: amount = data?.montant ? `${data.montant} ${data.devise || 'N/A'}` : 'N/A';
	$: transactionStatus = data?.status || 'N/A';
	$: creationDate = formatDate(data?.transaction_date) || 'N/A';

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {}

	onMount(() => {});

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
	</div>

	<!-- Card Footer -->
	<div class="flex justify-end border-t border-gray-200 pt-4">
		<button
			style="margin-right: 9px;"
			on:click={cancelDelete}
			disabled={isLoad}
			class="mr-[9px] rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
		>
			Annuler
		</button>
	</div>
</div>

<!-- Notification Component -->
{#if showNotification}
	<Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}
