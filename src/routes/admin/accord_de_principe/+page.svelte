<script lang="ts">
  import InputSimple from '$components/inputs/InputSimple.svelte';
  import { apiFetch } from '$lib/api';
  import { Button } from 'flowbite-svelte';
  import Modale from '$components/Modales/Modale.svelte';
  import { onMount } from 'svelte';

  import Abercrome from '$components/_includes/Abercrome.svelte';
  import Pagination from '$components/Pagination.svelte';
  import { pageSize } from '../../../store';
  import { get } from 'svelte/store';
  import type { GetEtablissementData, PersonneGetEtablissementData } from '../../../types';
  import Add from './Add.svelte';
  import Edit from './Edit.svelte';
  import Show from './Show.svelte';
  import Delete from './Delete.svelte';
  import Imputation from './Imputation.svelte';
  import ShowDetails from './ShowDetails.svelte';
  import Menu from '$components/_includes/Menu.svelte';
  import { getAuthCookie } from '$lib/auth';
  import HeaderTable from '$components/_includes/HeaderTable.svelte';

 
  let user: any = [];

  // Types
  type Permission = 'R' | 'RD' | 'RU' | 'CRUD' | 'CR' | 'CRU' | 'null';
  type ActionType = 'view' | 'edit' | 'delete' | 'add' | 'imputation' | 'details';
  type Action = {
    action: ActionType;
    title: string;
    icon: string;
    color: string;
  };

  // Données
  let main_data: GetEtablissementData[] = [];
  let searchQuery = '';
  let currentPage = 1;
  let totalItems = 0;
  let perPage = get(pageSize);
  let loading = false;
  let openDelete = false;
  let openEdit = false;
  let openAdd = false;
  let openShow = false;
  let openShowDetails = false;
  let openImputation = false;
  let current_data = {};
  let permission: Permission | null = null;
  let activeTab = 'acp_attente_dossier_depot_service_courrier';

  let actions: Action[] = [];

  const path: string = '/admin/etablissements-acp';

  // Configuration des permissions
  const PERMISSION_MAP: Record<ActionType, Permission[]> = {
    add: ['CRUD', 'CRU', 'CR'],
    view: ['R', 'RD', 'RU', 'CRUD', 'CRU', 'CR'],
    edit: ['RU', 'CRUD', 'CRU'],
    delete: ['RD', 'CRUD'],
    imputation: ['CRUD', 'CRU'],
    details: ['R', 'RD', 'RU', 'CRUD', 'CRU', 'CR'],
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
      icon: 'edit',
      color: 'warning',
    },
    {
      action: 'delete',
      title: 'Supprimer',
      icon: 'trash-alt',
      color: 'danger',
    },
    {
      action: 'imputation',
      title: 'Imputation',
      icon: 'user-check',
      color: 'info',
    },
    {
      action: 'details',
      title: 'Détails',
      icon: 'info-circle',
      color: 'primary',
    },
  ];

  // Liste des onglets ACP
  const tabs = [
    { key: 'acp_attente_dossier_depot_service_courrier', label: 'Attente dossier' },
    { key: 'acp_dossier_attente_validation_directrice', label: 'Attente validation' },
    { key: 'acp_dossier_valide_directrice', label: 'Dossier validé' },
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
      const res = await apiFetch(true, '/etablissement/');
      if (res) {
        main_data = res.data as GetEtablissementData[];
        totalItems = main_data.length;
        perPage = get(pageSize);
      } else {
        console.error('Structure inattendue:', res);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      loading = false;
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
        openDelete = true;
        break;
      case 'imputation':
        openImputation = true;
        break;
      case 'details':
        openShowDetails = true;
        break;
    }
  };

  function handlePageChange(event: CustomEvent) {
    currentPage = event.detail;
  }

  function handleTabChange(tabKey: string) {
    activeTab = tabKey;
    currentPage = 1;
  }

  // Fonction pour déterminer les colonnes à afficher
  function getTableHeaders(): string[] {
    const baseHeaders = ['Email', 'Téléphone/Adresse', 'Entité Juridique', 'Imputation'];
    
    // Ajouter la colonne Action pour les utilisateurs autorisés
    if (user.type === 'SOUS-DIRECTEUR-ETAB' || user.type === 'SOUS-DIRECTEUR-PROF' || user.type === 'DIRECTEUR') {
      return [...baseHeaders, 'Action'];
    }
    
    return baseHeaders;
  }

  // Cycle de vie
  onMount(async () => {
    user = getAuthCookie();
    await fetchData();
    permission = 'CRUD';
    actions = getFilteredActions(permission);
  });

  // Réactivité
  $: statusCounts = main_data.reduce((acc, item) => {
    acc[item.personne.status] = (acc[item.personne.status] || 0) + 1;
    return acc;
  }, {});

  $: filteredData = main_data
    .filter((item) => item.personne.status === activeTab)
    .filter((item) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const personne: PersonneGetEtablissementData = item.personne;
      return (
        item.email?.toLowerCase().includes(query) ||
        personne.telephone?.toLowerCase().includes(query) ||
        personne.adresse?.toLowerCase().includes(query) ||
        personne.denomination?.toLowerCase().includes(query) ||
        personne.nomRepresentant?.toLowerCase().includes(query) ||
        personne.typePersonne?.libelle?.toLowerCase().includes(query) ||
        personne.imputationData?.username?.toLowerCase().includes(query)
      );
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

  $: if (!openAdd && !openEdit && !openDelete && !openShow && !openShowDetails && !openImputation) {
    refreshDataIfNeeded();
  }

  $: {
    if (permission) {
      actions = getFilteredActions(permission);
    }
  }

  $: tableHeaders = getTableHeaders();
  $: showActions = user.type === 'SOUS-DIRECTEUR-ETAB' || user.type === 'SOUS-DIRECTEUR-PROF' || user.type === 'DIRECTEUR';
</script>

<div
  class="ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]"
>
  <Abercrome
    titre="Gestion des dossiers"
    parent="Dashbord"
    current="Établissements ACP"
  />

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
          Liste des dossiers ACP
        </h1>

        {#if PERMISSION_MAP['add'].includes(permission as Permission)}
          <button
            class="bg-blue-600 hover:bg-blue-700 inline-flex h-[40px] items-center justify-center gap-[6px] rounded-[6px] border-1 border-solid px-[20px] text-[14px] leading-[22px] font-semibold whitespace-nowrap text-white capitalize transition duration-300 ease-in-out"
            on:click={() => ((current_data = {}), (openAdd = true))}
          >
            <i class="uil uil-plus text-[18px]"></i>
            Nouveau
          </button>
        {/if}
      </div>

      <!-- Onglets -->
      <div
        class="text-dark dark:text-title-dark border-regular dark:border-box-dark-up flex flex-wrap items-center border-b px-[15px] text-[17px] font-medium"
      >
        <div class="flex gap-2 py-3 overflow-x-auto">
          {#each tabs as tab}
           <button
              class="px-4 py-2 rounded-md transition-colors duration-200 text-sm whitespace-nowrap font-medium border
                {activeTab === tab.key
                  ? 'bg-blue-600 text-black border-blue-600 shadow-sm'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}"
              on:click={() => handleTabChange(tab.key)}
            >
              {tab.label}
              <span
                class="badge rounded-full px-2 py-0.5 text-xs ml-2 font-semibold
                  {activeTab === tab.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-700'}"
              >
                {statusCounts[tab.key] || 0}
              </span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Recherche -->
      <div
        class="text-dark dark:text-title-dark border-regular dark:border-box-dark-up flex flex-wrap items-center justify-between border-b px-[15px] text-[17px] font-medium max-sm:h-auto max-sm:flex-col"
      >
        <div class="grid w-full grid-cols-4 pt-2">
          <InputSimple
            type="text"
            existelabel={false}
            bind:field={searchQuery}
            label="Rechercher"
            fieldName="search"
            placeholder="Rechercher..."
          />
        </div>
      </div>

      <!-- Tableau -->
      <div class="p-[20px]">
        <div class="scrollbar overflow-x-auto">
          <table
            class="min-w-full border border-gray-200 rounded-xl shadow-sm text-sm"
          >
            <!-- Header -->
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                {#each tableHeaders as title}
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-200"
                  >
                    {title}
                  </th>
                {/each}
              </tr>
            </thead>

            <!-- Body -->
            <tbody class="text-gray-700 bg-white">
              {#if loading && paginatedData.length === 0}
                <tr>
                  <td
                    colspan={tableHeaders.length}
                    class="py-8 text-[14px] text-center text-gray-500"
                  >
                    <div class="flex flex-col items-center justify-center">
                      <div class="flex flex-row gap-2 items-center justify-center mb-2">
                        <div class="w-3 h-3 rounded-full bg-blue-600 animate-bounce"></div>
                        <div class="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style="animation-delay: 0.2s"></div>
                      </div>
                      <span class="text-sm">Chargement des données...</span>
                    </div>
                  </td>
                </tr>
              {:else if paginatedData.length === 0}
                <tr>
                  <td colspan={tableHeaders.length} class="py-12 text-center text-gray-500">
                    <div class="flex flex-col items-center justify-center">
                      <img
                        src="/search_notfound.svg"
                        alt="Aucun résultat trouvé"
                        class="w-24 h-24 mb-4 opacity-60"
                      />
                      <h1 class="text-xl font-semibold text-gray-600 mb-2">Aucun résultat</h1>
                      <p class="text-gray-500 text-sm">
                        Aucun résultat trouvé avec les critères de filtrage actuels
                      </p>
                    </div>
                  </td>
                </tr>
              {:else}
                {#each paginatedData as item}
                  <tr
                    class="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-200"
                  >
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {item.email || '-'}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {#if item.personne.telephone}
                        {item.personne.telephone}
                      {:else if item.personne.adresse}
                        {item.personne.adresse}
                      {:else}
                        -
                      {/if}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {#if item.personne.denomination}
                        {item.personne.denomination}
                      {:else if item.personne.nomRepresentant}
                        {item.personne.nomRepresentant}
                      {:else if item.personne.typePersonne?.libelle}
                        {item.personne.typePersonne.libelle}
                      {:else}
                        -
                      {/if}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {#if item.personne.imputationData}
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.personne.imputationData.username}
                        </span>
                      {:else}
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Non assigné
                        </span>
                      {/if}
                    </td>

                    <!-- Actions -->
                    {#if showActions}
                      <td class="px-4 text-[12px] py-3 border border-gray-200 text-right">
                        <Menu {item} onAction={handleAction} {actions} />
                      </td>
                    {/if}
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

<!-- Modales -->
<Modale bind:open={openAdd} size="xl" title="Créer un établissement ACP">
  <Add
    bind:open={openAdd}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale bind:open={openEdit} size="xl" title="Modifier un établissement ACP">
  <Edit
    bind:open={openEdit}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale bind:open={openShow} size="xl" title="Détails de l'établissement ACP">
  <Show
    bind:open={openShow}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale bind:open={openShowDetails} size="xl" title="Détails complémentaires">
  <ShowDetails
    bind:open={openShowDetails}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale bind:open={openImputation} size="xs" title="Imputation">
  <Imputation
    bind:open={openImputation}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale bind:open={openDelete} size="xl" title="Supprimer l'établissement ACP">
  <Delete
    bind:open={openDelete}
    data={current_data}
    on:updated={fetchData}
  />
</Modale>

<style>
  .tab {
    @apply px-4 py-2 rounded-lg border border-gray-300 text-gray-700;
  }
  .tab-active {
    @apply text-white border-transparent;
  }
</style>