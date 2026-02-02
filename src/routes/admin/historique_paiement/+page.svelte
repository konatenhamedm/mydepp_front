<script lang="ts">
  import InputSimple from '$components/inputs/InputSimple.svelte';
  import { apiFetch } from '$lib/api';
  import { Button, Select } from 'flowbite-svelte';
  import Modale from '$components/Modales/Modale.svelte';
  import { onMount } from 'svelte';
  import Abercrome from '$components/_includes/Abercrome.svelte';
  import Pagination from '$components/Pagination.svelte';
  import { pageSize } from '../../../store';
  import { get } from 'svelte/store';
  import type { Transaction } from '../../../types';
  import Show from './Show.svelte';
  import Delete from './Delete.svelte';
  import RecuPaiement from './RecuPaiement.svelte';
  import Menu from '$components/_includes/Menu.svelte';
  import HeaderTable from '$components/_includes/HeaderTable.svelte';
  import { getAuthCookie } from '$lib/auth';
  import { formatDate } from '$lib/dateUtils';
  import { formatAmount } from '$lib/formatAmount';
  import PdfPaiement from '$components/pdf/PdfPaiement.svelte';
  import CsvExporter from '$components/excel/CsvExporter.svelte';

  // Types
  type Permission = 'R' | 'RD' | 'RU' | 'CRUD' | 'CR' | 'CRU' | 'null';
  type ActionType = 'view' | 'edit' | 'delete' | 'add';
  type Action = {
    action: ActionType;
    title: string;
    icon: string;
    color: string;
  };

  export let data;
  let user = data.user;

  let main_data: Transaction[] = [];
  let searchQuery = '';
  let selectedAmount: any = '';
  let startDate: any | null = null;
  let endDate: any | null = null;
  let currentPage = 1;
  let totalItems = 0;
  let perPage = get(pageSize);
  let loading = false;
  let openDelete = false;
  let openEdit = false;
  let openShow = false;
  let current_data = {};
  let permission: Permission | null = null;
  let amountOptions: any = [];

  let actions: Action[] = [];

  const path: string = '/admin/paiements';

  // Configuration des permissions
  const PERMISSION_MAP: Record<ActionType, Permission[]> = {
    add: ['CRUD', 'CRU', 'CR'],
    view: ['R', 'RD', 'RU', 'CRUD', 'CRU', 'CR'],
    edit: ['RU', 'CRUD', 'CRU'],
    delete: ['RD', 'CRUD'],
  };

  const allActions: Action[] = [
    {
      action: 'view',
      title: 'Voir',
      icon: 'eye',
      color: 'success',
    },
    {
      action: 'edit',
      title: 'Modifier',
      icon: 'print',
      color: 'warning',
    },
    /* {
      action: 'delete',
      title: 'Supprimer',
      icon: 'trash-alt',
      color: 'danger',
    }, */
  ];

  // Fonctions
  function getFilteredActions(perm: Permission | null): Action[] {
    if (!perm) return [];
    return allActions.filter((action) =>
      PERMISSION_MAP[action.action].includes(perm)
    );
  }

  async function fetchData() {
    loading = true;
    try {
      const res = await apiFetch(true, '/paiement/historique/professionnel');
      console.log(res);

      if (res) {
        main_data = res.data as Transaction[];
        
        // Infos pagination
        currentPage = 1;
        totalPages = Math.max(1, Math.ceil(res.data.length / get(pageSize)));
        totalItems = res.data.length ?? 0;
        perPage = get(pageSize);
        startRange = res.data.length > 0 ? 1 : 0;
        endRange = res.data.length > 0 ? res.data.length : 0;
      } else {
        console.error('Structure inattendue:', res);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      loading = false;
    }
  }

  async function fetchMontant() {
    try {
      const res = await apiFetch(true, '/profession/api/montants');
      if (res) {
        amountOptions = res.data;
      } else {
        console.error('Erreur lors de la récupération des montants:', res.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des montants:', error);
    }
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
        openDelete = false;
        break;
    }
  };

  function handlePageChange(event: CustomEvent) {
    currentPage = event.detail;
  }

  function getBgColor(color: number): string {
    switch (color) {
      case 1:
        return 'bg-success border-success';
      case 0:
        return 'bg-danger border-danger';
      default:
        return 'bg-gray-300';
    }
  }

  function getStatus(status: number): string {
    switch (status) {
      case 1:
        return 'Paiement effectué';
      case 0:
        return 'Paiement échoué';
      default:
        return 'Inconnu';
    }
  }

  // Cycle de vie
  onMount(async () => {
    user = getAuthCookie();
    await fetchData();
    await fetchMontant();
    permission = 'CRUD';
    actions = getFilteredActions(permission);
    console.log('Actions disponibles:', permission);
  });

  // Réactivité
  $: filteredData = main_data.filter((item) => {
    console.log('Filtrage de l\'élément:', item);
    const textMatch =
      item.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user?.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user?.prenoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user?.profession?.libelle.toLowerCase().includes(searchQuery.toLowerCase());
    let amountMatch = true;
    if (selectedAmount) {
      amountMatch = parseInt(item.montant, 10) === parseInt(selectedAmount, 10);
    }

    let dateMatch = true;
    if (startDate) {
      const itemDate = new Date(item.createdAt);
      const start = new Date(startDate);
      dateMatch = itemDate >= start;
    }
    if (endDate) {
      const itemDate = new Date(item.createdAt);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateMatch = dateMatch && itemDate <= end;
    }

    return textMatch && amountMatch && dateMatch;
  });

  $: totalPages = Math.max(1, Math.ceil(filteredData.length / get(pageSize)));

  $: paginatedData =
    filteredData.length > 0
      ? filteredData.slice(
          (currentPage - 1) * get(pageSize),
          currentPage * get(pageSize)
        )
      : [];

  $: startRange =
    filteredData.length === 0 ? 0 : (currentPage - 1) * get(pageSize) + 1;
  $: endRange = Math.min(currentPage * get(pageSize), filteredData.length);

  $: if (currentPage > totalPages) currentPage = totalPages;
  $: if (filteredData.length === 0) currentPage = 1;

  $: if (!openEdit && !openDelete && !openShow) {
    refreshDataIfNeeded();
  }

  $: {
    if (permission) {
      actions = getFilteredActions(permission);
      console.log('Actions mises à jour:', actions);
    }
  }
</script>

<div
  class="ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]"
>
  <Abercrome titre="Parametres" parent="Dashbord" current="Historique Paiements" />
  
  <!-- Responsive Toggler -->
  <div class="col-span-12">
    <div
      class="dark:bg-box-dark text-body dark:text-subtitle-dark rounded-10 relative m-0 bg-white p-0 text-[15px] shadow"
    >
      <div
        class="text-dark dark:text-title-dark border-regular dark:border-box-dark-up flex flex-wrap items-center justify-between border-b px-[25px] text-[17px] font-medium max-sm:h-auto max-sm:flex-col"
      >
        <h1
          class="text-dark dark:text-title-dark mb-0 inline-flex items-center overflow-hidden py-[16px] text-[18px] font-semibold text-ellipsis whitespace-nowrap"
        >
          Liste des historiques de paiement
        </h1>

        <div class="flex gap-2">
          <PdfPaiement
            title="Historique_Paiements"
            headers={[
              'Nom et Prénoms',
              'Contact',
              'Profession',
              'Reference',
              'Type',
              'Email',
              'Etat',
              'Montant',
              'Date',
            ]}
            data={filteredData}
            type="paiement"
            typeUser={user.type}
          />
          <CsvExporter
            title="Historique_Paiements"
            headers={[
              'Nom et prénoms',
              'Contact',
              'Profession',
              'Reference',
              'Type',
              'Email',
              'Etat',
              'Montant',
              'Date',
            ]}
            data={filteredData}
            type="paiement"
            typeUser={user.type}
          />
        </div>
      </div>

      <div
        class="text-dark dark:text-title-dark border-regular dark:border-box-dark-up flex flex-wrap items-center justify-between border-b px-[15px] text-[17px] font-medium max-sm:h-auto max-sm:flex-col"
      >
        <div class="grid w-full grid-cols-4 gap-4 py-4">
          <InputSimple
            type="text"
            existelabel={false}
            bind:field={searchQuery}
            label="Rechercher"
            fieldName="search"
            placeholder="Recherche"
          />

          {#if !['INSTRUCTEUR', 'SOUS-DIRECTEUR'].includes(user.type)}
            <Select bind:value={selectedAmount} class="w-full">
              <!-- <option value="">Tous les montants</option> -->
              {#each amountOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </Select>
          {/if}

          <InputSimple
            type="date"
            existelabel={false}
            bind:field={startDate}
            label="Date début"
            fieldName="startDate"
            placeholder="Date début"
          />

          <InputSimple
            type="date"
            existelabel={false}
            bind:field={endDate}
            label="Date fin"
            fieldName="endDate"
            placeholder="Date fin"
          />
        </div>
      </div>

      <div class="p-[20px]">
        <div class="scrollbar overflow-x-auto">
          <table
            class="min-w-full border border-gray-200 rounded-xl shadow-sm text-sm"
          >
            <!-- Header -->
            {#if !['INSTRUCTEUR','INSTRUCTEUR-PROF',"SOUS-DIRECTEUR-PROF", 'SOUS-DIRECTEUR'].includes(user.type)}
              <HeaderTable item={['Nom', 'Prénoms', 'Profession', 'Reference', 'Type', 'Moyen paiement', 'Email', 'Etat', 'Montant', 'Date', 'Action']} />
            {:else}
              <HeaderTable item={['Nom', 'Prénoms', 'Profession', 'Reference', 'Type', 'Moyen paiement', 'Email', 'Etat', 'Date', 'Action']} />
            {/if}
            
            <!-- Body -->
            <tbody class="text-gray-700">
              {#if loading && paginatedData.length === 0}
                <tr>
                  <td colspan="12" class="py-6 text-[14px] text-center text-gray-500">
                    Chargement en cours...
                  </td>
                </tr>
              {:else if paginatedData.length === 0}
                <tr>
                  <td colspan="12" class="py-6 text-[12px] text-center text-gray-500">
                    Aucun résultat trouvé avec les critères de filtrage actuels
                  </td>
                </tr>
              {:else}
                {#each paginatedData as item, i}
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 text-[14px] py-3 border border-gray-200">{item?.user?.nom}</td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">{item?.user?.prenoms}</td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">{item?.user?.profession?.libelle}</td>
                   <!--  <td class="px-4 text-[14px] py-3 border border-gray-200">{item?.user?.number}</td> -->
                    <td class="px-4 text-[14px] py-3 border border-gray-200">{item?.reference}</td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">{item.type}</td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">{item.channel}</td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">{item.email}</td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      <span class={`py-[0.1875rem] px-[0.8125rem] text-xs rounded-[1.25rem] text-white w-[77px] leading-[1.5] ${getBgColor(item.state)}`}>
                        {getStatus(item.state)}
                      </span>
                    </td>
                    {#if !['INSTRUCTEUR', 'SOUS-DIRECTEUR'].includes(user.type)}
                      <td class="px-4 text-[14px] py-3 border border-gray-200 text-right">
                        {formatAmount(parseInt(item.montant, 10))}
                      </td>
                    {/if}
                    <td class="px-4 text-[14px] py-3 border border-gray-200">{formatDate(item.createdAt)}</td>
                    <td class="px-4 text-[12px] py-3 border border-gray-200 text-right">
                      <Menu {item} onAction={handleAction} {actions} />
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>

          <!-- Pagination -->
          {#if filteredData.length > 0 && totalPages > 1}
            <div class="mt-4">
              <Pagination
                {currentPage}
                {totalPages}
                {startRange}
                {endRange}
                totalItems={filteredData.length}
                on:pageChange={handlePageChange}
              />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<Modale bind:open={openShow} size="xl" title="Détails du paiement">
  <Show bind:open={openShow} data={current_data} on:updated={fetchData} />
</Modale>

<Modale bind:open={openEdit} size="xl" title="Reçu de paiement">

  <RecuPaiement bind:open={openEdit} data={current_data} />

</Modale>
<!-- 
<Modale bind:open={openDelete} size="lg" title="Supprimer le paiement">
  <Delete bind:open={openDelete} data={current_data} on:updated={fetchData} />
</Modale> -->