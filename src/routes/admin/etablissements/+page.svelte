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
  import Show from './Show.svelte';
  import Menu from '$components/_includes/Menu.svelte';
  import { getAuthCookie } from '$lib/auth';
  import HeaderTable from '$components/_includes/HeaderTable.svelte';

 
  let user: any = [];

  // Types
  type Permission = 'R' | 'RD' | 'RU' | 'CRUD' | 'CR' | 'CRU' | 'null';
  type ActionType = 'view' | 'edit' | 'delete' | 'add';
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
  let openShow = false;
  let current_data = {};
  let permission: Permission | null = null;
  let activeTab = 'acp_attente_dossier_depot_service_courrier';

  let actions: Action[] = [];

  const path: string = '/admin/etablissements-tous';

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
      icon: 'edit',
      color: 'warning',
    },
    {
      action: 'delete',
      title: 'Supprimer',
      icon: 'trash-alt',
      color: 'danger',
    },
  ];

  // Liste des onglets
  const tabs = [
    { key: 'acp_attente_dossier_depot_service_courrier', label: 'ACP de dépôt de dossier' },
    { key: 'acp_dossier_attente_validation_directrice', label: 'ACP validation directrice' },
    { key: 'acp_dossier_valide_directrice', label: 'ACP Validé par la directrice' },
    { key: 'oep_demande_initie', label: 'Initié' },
    { key: 'oep_dossier_imputer', label: 'OEP dossier imputer' },
    { key: 'oep_dossier_imputer_conforme_attente_planification_visite', label: 'OEP dossier conforme en attente' },
    { key: 'oep_dossier_imputer_non_conforme', label: 'OEP imputer non conforme' },
    { key: 'oep_dossier_visite_programme', label: 'OEP visite programmé' },
    { key: 'oep_visite_effectue_attente_validation_directrice', label: 'OEP visite effectuée en attente de validation directrice' },
    { key: 'oep_dossier_valide', label: 'OEP Validé' },
    { key: 'oep_dossier_rejette', label: 'OEP Rejeté' },
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
      const res = await apiFetch(true, "/etablissement/");
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
    }
  };

  function handlePageChange(event: CustomEvent) {
    currentPage = event.detail;
  }

  function handleTabChange(tabKey: string) {
    activeTab = tabKey;
    currentPage = 1;
  }

  // Fonction pour calculer les compteurs des onglets
  function getTabCount(tabKey: string): number {
    if (tabKey === 'all') return main_data.length;
    return main_data.filter(item => item.personne.status === tabKey).length;
  }

  // Cycle de vie
  onMount(async () => {
    user = getAuthCookie();
    await fetchData();
    permission = 'CRUD';
    actions = getFilteredActions(permission);
  });

  // Réactivité
  $: filteredData = main_data.filter((item) => {
    const matchesTab = activeTab === 'all' ? true : item.personne.status === activeTab;
    
    if (!matchesTab) return false;
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const personne: PersonneGetEtablissementData = item.personne;
    return (
      personne.denomination?.toLowerCase().includes(query) ||
      personne.nomRepresentant?.toLowerCase().includes(query) ||
      personne.typePersonne?.libelle?.toLowerCase().includes(query) ||
      personne.telephone?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      personne.emailAutre?.toLowerCase().includes(query) ||
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

  $: if (!openShow) {
    refreshDataIfNeeded();
  }

  $: {
    if (permission) {
      actions = getFilteredActions(permission);
    }
  }
</script>

<div
  class="ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]"
>
  <Abercrome
    titre="Parametres"
    parent="Dashbord"
    current="tous les établissements"
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
          Liste de tous les établissements
        </h1>
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
                {getTabCount(tab.key)}
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
            <HeaderTable afficheAction={false} item={["Nature entreprise", "Contact", "Email", "Imputation"]} />

            <!-- Body -->
            <tbody class="text-gray-700">
              {#if loading && paginatedData.length === 0}
                <tr>
                  <td colspan="4" class="py-8 text-[14px] text-center text-gray-500">
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
                  <td colspan="4" class="py-12 text-center text-gray-500">
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
                  <tr class="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-200">
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
                      {item.personne.telephone || '-'}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {item.personne.emailAutre || item.email || '-'}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {#if item.personne.imputationData}
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.personne.imputationData.username}
                        </span>
                      {:else}
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          N/A
                        </span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>

          <!-- Pagination -->
          {#if filteredData.length > 0 && totalPages > 1}
            <div class="mt-6">
              <Pagination
                {currentPage}
                {totalPages}
                {startRange}
                {endRange}
                totalItems={filteredData.length}
                on:pageChange={handlePageChange}
              />
            </div>
          {:else if filteredData.length > 0}
            <div class="mt-4 text-center">
              <span class="text-sm text-gray-600">
                Affichage de {startRange} à {endRange} sur {filteredData.length} résultat(s)
              </span>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modales -->
<Modale bind:open={openShow} size="full" title="Détails de l'établissement">
  <Show
    bind:open={openShow}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
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