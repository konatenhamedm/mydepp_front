<script lang="ts">
	import InputSimple from '$components/inputse/InputSimple.svelte';
	import { apiFetch } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputse/InputSelect.svelte';
	import Modale from '$components/Modales/Modale.svelte';
	import { onMount } from 'svelte';
	import Edit from './Edit.svelte';
	import Abercrome from '$components/_includes/Abercrome.svelte';
	import Pagination from '$components/Pagination.svelte';
	import { pageSize } from '../../../store';
	import { EyeOutline } from 'flowbite-svelte-icons';
	import { get } from 'svelte/store';
	import type {  } from '../../../types';
	import Add from './AddTicket.svelte';
	import Show from './Show.svelte';
	import Delete from './Delete.svelte';
	import Menu from '$components/_includes/Menu.svelte';
	import { getPermission } from '$lib/auth';
	import HeaderTable from '$components/_includes/HeaderTable.svelte';
	import LoaderTable from '$components/_includes/LoaderTable.svelte';
	import AddTicket from './AddTicket.svelte';
	import { formatDate } from '$lib/dateUtils';

	// Types
	type Permission = 'R' | 'RD' | 'RU' | 'CRUD' | 'CR' | 'CRU' | 'null';
	type ActionType = 'view' | 'edit' | 'delete' | 'add' | 'menu';
	type Action = {
		action: ActionType;
		title: string;
		icon: string;
		color: string;
	};

	type TransactionType = {
		value: string;
		label: string;
	};

	const transactionTypes: TransactionType[] = [
		{ value: 'bToB', label: 'B to B' },
		{ value: 'bToC', label: 'B to C' },
		{ value: 'paiementServiceLeBedoo', label: 'Paiement Service LeBedoo' },
		{ value: 'cToC', label: 'C to C' },
		{ value: 'cToB', label: 'C to B' },
		{ value: 'depotCompteBancaire', label: 'Dépôt Compte Bancaire' },
		{ value: 'depotMobileMoney', label: 'Dépôt Mobile Money' },
		{ value: 'depotCarteBancaire', label: 'Dépôt Carte Bancaire' },
		{ value: 'retraitCarteBancaire', label: 'Retrait Carte Bancaire' },
		{ value: 'retraitCompteBancaire', label: 'Retrait Compte Bancaire' },
		{ value: 'retraitMobileMoney', label: 'Retrait Mobile Money' },
		{ value: 'transfertMobileMoney', label: 'Transfert Mobile Money' },
		{ value: 'transfertLeBedoo', label: 'Transfert LeBedoo' }
	];

	// Données
	let current_data: any = {};
	let main_data: any[] = [];
	let totalItems = 0;
	let limit = get(pageSize);
	let searchQuery = '';
	let currentPage = 1;
	let loading = false;
	let openDelete = false;
	let openEdit = false;
	let openMenu = false;
	let openAdd = false;
	let openShow = false;
	let permission: Permission | null = null;
	let selectedService = '';
	let selectedType = '';
	let dateDebut = '';
	let dateFin = '';
	let services: any[] = [];

	let actions: Action[] = [];

	const path: string = '/admin/transactions';

	// Configuration des permissions
	const PERMISSION_MAP: Record<ActionType, Permission[]> = {
		add: ['CRUD', 'CRU', 'CR'],
		view: ['R', 'RD', 'RU', 'CRUD', 'CRU', 'CR'],
		edit: ['RU', 'CRUD', 'CRU'],
		menu: ['RU', 'CRUD', 'CRU'],
		delete: ['RD', 'CRUD']
	};

	const allActions: Action[] = [
		{
			action: 'view',
			title: 'Voir',
			icon: 'eye',
			color: 'primary'
		}
	];

	// Fonctions
	function getFilteredActions(perm: Permission | null): Action[] {
		if (!perm) return [];
		return allActions.filter((action) => PERMISSION_MAP[action.action].includes(perm));
	}

	async function fetchServices() {
		try {
			const response = await apiFetch(true, '/services/all');
			if (response?.result) {
				services = response.result.map((service: any) => ({
					id: service.id,
					libelle: service.libelle
				}));
				console.log('Services filtrés :', services);
			}
		} catch (error) {
			console.error('Erreur lors de la récupération des services :', error);
		}
	}

	async function fetchData() {
		loading = true;
		try {
			const queryParams = new URLSearchParams({
				page: currentPage.toString(),
				limit: limit.toString(),
				service: selectedService || '',
				type: selectedType || '',
				dateDebut: dateDebut || '',
				dateFin: dateFin || ''
			}).toString();

			const response = await apiFetch(false, `wallet/transaction/Transaction?${queryParams}`);
			if (response?.data) {
				main_data = response.data.data;
				totalItems = response.data.total;
				totalPages = response.data.totalPages;
			} else {
				console.error('Erreur lors de la récupération des données : structure inattendue');
			}
		} catch (error) {
			console.error('Erreur lors de la récupération des données :', error);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		await fetchData();
		await fetchServices();

		//law = await getPermission(path);
		//permission = law;
	});

	function applyFilters() {
		currentPage = 1;
		fetchData();
	}
	async function refreshDataIfNeeded() {
		await fetchData();
	}

	const handleAction = (action: ActionType, item: any) => {
		current_data = item;
		switch (action) {
			case 'view':
				openShow = true;
				break;
			case 'edit':
				openEdit = true;
				break;
			case 'delete':
				openDelete = true;
				break;
			case 'menu':
				openMenu = true;
				break;
		}
	};

	function handlePageChange(event: CustomEvent) {
		currentPage = event.detail;
	}

	// Cycle de vie
	onMount(async () => {
		await fetchData();
		permission = await getPermission(path);
		actions = getFilteredActions(permission);
		console.log('Actions disponibles:', permission);
	});

	$: filteredData = searchQuery
		? main_data.filter(
				(item) =>
					item.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.status.toLowerCase().includes(searchQuery.toLowerCase())
			)
		: main_data;

	$: totalPages = Math.max(1, Math.ceil(filteredData.length / get(pageSize)));

	$: paginatedData =
		filteredData.length > 0
			? filteredData.slice((currentPage - 1) * get(pageSize), currentPage * get(pageSize))
			: [];

	$: startRange = filteredData.length === 0 ? 0 : (currentPage - 1) * get(pageSize) + 1;
	$: endRange = Math.min(currentPage * get(pageSize), filteredData.length);

	$: if (currentPage > totalPages) currentPage = totalPages;
	$: if (filteredData.length === 0) currentPage = 1;

	$: if (!openAdd && !openEdit && !openDelete) {
		refreshDataIfNeeded();
	}

	$: {
		if (permission) {
			actions = getFilteredActions(permission);
			console.log('Actions mises à jour:', actions);
		}
	}
</script>

<div class=" ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]">
	<Abercrome titre="Transactions" parent="Dashbord" current="transactions" />
	<!-- Responsive Toggler -->
	<div class="col-span-12">
		<div
			class="dark:bg-box-dark text-body dark:text-subtitle-dark rounded-10 relative m-0 bg-white p-0 text-[15px]"
		>
			<div
				class=" text-dark dark:text-title-dark border-regular dark:border-box-dark-up flex flex-wrap items-center justify-between border-b px-[25px] text-[17px] font-medium max-sm:h-auto max-sm:flex-col"
			>
				<h1
					class="text-dark dark:text-title-dark mb-0 inline-flex items-center overflow-hidden py-[16px] text-[18px] font-semibold text-ellipsis whitespace-nowrap"
				>
					Liste des transactions
				</h1>

				{#if PERMISSION_MAP['add'].includes(permission as Permission)}
					<button
						class="bg-secondary border-secondary hover:bg-secondary-hbr inline-flex h-[40px] items-center justify-center gap-[6px] rounded-[6px] border-1 border-solid px-[20px] text-[14px] leading-[22px] font-semibold whitespace-nowrap text-white capitalize transition duration-300 ease-in-out"
						data-te-ripple-init=""
						data-te-ripple-color="light"
						style=""
						on:click={() => ((current_data = {}), (openAdd = true))}
					>
						<i class="uil uil-plus text-[18px]"></i>
						Nouveau
					</button>
				{/if}
			</div>
			<div
				class=" text-dark dark:text-title-dark border-regular dark:border-box-dark-up flex flex-wrap items-center justify-between border-b px-[15px] text-[17px] font-medium max-sm:h-auto max-sm:flex-col"
			>
				<div class="grid w-full grid-cols-4">
					<InputSimple
						type="text"
						existelabel={false}
						bind:field={searchQuery}
						label="Rechercher"
						fieldName="search"
						placeholder="Recherche"
					/>
				</div>
			</div>
			<div class="p-[20px]">
				<div class="scrollbar overflow-x-auto">
					<div class="mb-7 grid w-full grid-cols-5 items-end gap-4">
						<!-- Filtre par service -->
						<div>
							<label for="service" class="block text-sm font-medium text-gray-700">Service</label>
							<!-- <select id="service" bind:value={selectedService} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">Tous les services</option>
                                        {#each services as service}
                                            <option value={service.id}>{service.libelle}</option>
                                        {/each}
                                    </select> -->

							<select
								bind:value={selectedType}
								class="w-64 rounded-lg border bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							>
								<option value="">Tous les services</option>
								{#each services as service}
									<option value={service.id}>{service.libelle}</option>
								{/each}
							</select>
						</div>

						<!-- Filtre par type de transaction -->
						<div>
							<label for="type" class="block text-sm font-medium text-gray-700"
								>Type de transaction</label
							>
							<select
								id="type"
								bind:value={selectedType}
								class="form-select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							>
								<option value="">Tous les types</option>
								{#each transactionTypes as type}
									<option value={type.value}>{type.label}</option>
								{/each}
							</select>
						</div>

						<!-- Filtre par date de début -->
						<div>
							<label for="dateDebut" class="block text-sm font-medium text-gray-700"
								>Date de début</label
							>
							<input
								type="date"
								id="dateDebut"
								bind:value={dateDebut}
								class="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<!-- Filtre par date de fin -->
						<div>
							<label for="dateFin" class="block text-sm font-medium text-gray-700"
								>Date de fin</label
							>
							<input
								type="date"
								id="dateFin"
								bind:value={dateFin}
								class="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<!-- Bouton d'application des filtres -->
						<div class="flex">
							<Button color="blue" size="sm" class="px-3 py-2" on:click={applyFilters}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM4 10h16M10 14h4m-4 4h4"
									/>
								</svg>
							</Button>
						</div>
					</div>

					<table
						class="min-w-full border-collapse border border-gray-300 text-start text-sm font-light"
					>
						<HeaderTable
							item={[
								'Réference',
								'Type transaction',
								'libellé de transaction',
								'Montant',
								'Date de transaction'
							]}
						/>
						<tbody>
							{#if loading && paginatedData.length === 0}
								<LoaderTable />
							{:else if paginatedData.length === 0}
								<tr>
									<td colspan="6" class="py-4 text-center">
										Aucun résultat trouvé avec les critères de filtrage actuels
									</td>
								</tr>
							{:else}
								{#each paginatedData as item, i}
									<tr class="group">
										<td
											class="text-dark dark:text-title-dark w-[60px] rounded-s-[6px] border border-gray-300 px-[25px] py-2.5 text-start font-medium"
										>
											<div class="mb-[0.125rem] block min-h-[1.5rem]">
												<input
													class="border-normal checked:border-primary checked:bg-primary dark:border-box-dark-up dark:checked:border-primary dark:checked:bg-primary checkboxItemExport relative me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-1 border-solid outline-none before:pointer-events-none before:absolute before:h-[10px] before:w-[0.5px] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:content-[''] after:top-[2px] checked:before:opacity-[0.16] checked:after:absolute checked:after:ms-[5px] checked:after:mt-0 checked:after:block checked:after:h-[10px] checked:after:w-[5px] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] ltr:float-left rtl:float-right"
													type="checkbox"
													value=""
													aria-label="..."
												/>
											</div>
										</td>
										<td
											class="text-dark dark:text-title-dark border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
										>
											{item.ref}</td
										>
										<td
											class="text-dark dark:text-title-dark border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
										>
											{item.transaction_type}</td
										>
										<td
											class="text-dark dark:text-title-dark border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
										>
											{item.libelle}</td
										>
										<td
											class="text-dark dark:text-title-dark border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
										>
											{item.montant}</td
										>
										<td
											class="text-dark dark:text-title-dark border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
										>
											{formatDate(item.transaction_date)}</td
										>
										<td
											class="text-dark dark:text-title-dark rounded-e-[6px] border border-gray-300 px-4 py-2.5 text-end text-[14px] font-normal capitalize"
											style="text-align: center;"
										>
											<Menu {item} onAction={handleAction} {actions} />
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
					{#if filteredData.length > 0 && totalPages > 1}
						<Pagination
							{currentPage}
							{totalPages}
							{startRange}
							{endRange}
							totalItems={filteredData.length}
							on:pageChange={handlePageChange}
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<Modale bind:open={openAdd} size="xl" title="Créer une transaction">
	<AddTicket bind:open={openAdd} data={current_data} size="2xl" on:added={fetchData} />
</Modale>
<Modale bind:open={openEdit} size="xl" title="Modifier une transaction">
	<Edit bind:open={openEdit} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openShow} size="2xl" title="Détails d'une transaction">
	<Show bind:open={openShow} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openDelete} size="xl" title="Supprimer la transaction">
	<Delete bind:open={openDelete} data={current_data} on:updated={fetchData} />
</Modale>
