<script lang="ts">
  import InputSimple from '$components/inputs/InputSimple.svelte';
  import { apiFetch } from '$lib/api';
  import { Button } from 'flowbite-svelte';
  import { EyeOutline } from 'flowbite-svelte-icons';
  import Modale from '$components/Modales/Modale.svelte';
  import { onMount } from 'svelte';

  import Abercrome from '$components/_includes/Abercrome.svelte';
  import Pagination from '$components/Pagination.svelte';
  import { pageSize } from '../../../store';
  import { get } from 'svelte/store';
  import type { professionnel } from '../../../types';
  import Add from './Add.svelte';
  import Edit from './Edit.svelte';
  import Show from './Show.svelte';
  import Delete from './Delete.svelte';
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
  let main_data: professionnel[] = [];
  let searchQuery = '';
  let currentPage = 1;
  let totalItems = 0;
  let perPage = get(pageSize);
  let loading = false;
  let openDelete = false;
  let openEdit = false;
  let openAdd = false;
  let openShow = false;
  let current_data = {};
  let permission: Permission | null = null;

  let actions: Action[] = [];

  const path: string = '/admin/dossiers-attente';

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
      const res = await apiFetch(true, "/professionnel/attente");
      if (res) {
        main_data = res.data as professionnel[];
        totalItems = res.data.length ?? 0;
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
    }
  };

  function handlePageChange(event: CustomEvent) {
    currentPage = event.detail;
  }

  // Cycle de vie
  onMount(async () => {
    user = getAuthCookie();
    await fetchData();
    permission = 'CRUD';
    actions = getFilteredActions(permission);
  });

  // Réactivité - Adaptation au format correct de données
  $: filteredData = main_data.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.personne?.nom?.toLowerCase().includes(query) ||
      item.personne?.prenoms?.toLowerCase().includes(query) ||
      item.personne?.number?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.personne?.profession?.libelle?.toLowerCase().includes(query) ||
      item.personne?.code?.toLowerCase().includes(query)
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

  $: if (!openAdd && !openEdit && !openDelete && !openShow) {
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
    current="dossiers en attente"
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
          Liste des dossiers en attente
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
            <HeaderTable item={['Nom', 'Prénoms', 'Téléphone', 'Email', 'Profession', 'Code', 'Action']} />

            <!-- Body -->
            <tbody class="text-gray-700">
              {#if loading && paginatedData.length === 0}
                <tr>
                  <td colspan="7" class="py-8 text-[14px] text-center text-gray-500">
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
                  <td colspan="7" class="py-12 text-center text-gray-500">
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
                      {item.personne?.nom || '-'}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {item.personne?.prenoms || '-'}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {item.personne?.number || '-'}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {item.email || '-'}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {item.personne?.profession?.libelle || '-'}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {item.personne?.code || '-'}
                    </td>
                    <td class="px-4 text-[12px] py-3 border border-gray-200 text-right">
                      <div class="flex items-center gap-2 justify-end">
                        <Button
                          color="blue"
                          size="sm"
                          class="gap-2 px-3 bg-blue-600 hover:bg-blue-700"
                          on:click={() => {
                            current_data = item;
                            openShow = true;
                          }}
                        >
                          <EyeOutline size="sm" class="mr-1" />
                          <span class="hidden sm:inline">Voir</span>
                        </Button>
                        
                        {#if PERMISSION_MAP['edit'].includes(permission as Permission)}
                          <Button
                            color="yellow"
                            size="sm"
                            class="gap-2 px-3 bg-yellow-600 hover:bg-yellow-700"
                            on:click={() => {
                              current_data = item;
                              openEdit = true;
                            }}
                          >
                            <i class="uil uil-edit text-[14px] mr-1"></i>
                            <span class="hidden sm:inline">Modifier</span>
                          </Button>
                        {/if}

                        {#if PERMISSION_MAP['delete'].includes(permission as Permission)}
                          <Button
                            color="red"
                            size="sm"
                            class="gap-2 px-3 bg-red-600 hover:bg-red-700"
                            on:click={() => {
                              current_data = item;
                              openDelete = true;
                            }}
                          >
                            <i class="uil uil-trash-alt text-[14px] mr-1"></i>
                            <span class="hidden sm:inline">Supprimer</span>
                          </Button>
                        {/if}
                      </div>
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
<Modale bind:open={openAdd} size="xl" title="Créer un dossier">
  <Add
    bind:open={openAdd}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale bind:open={openEdit} size="xl" title="Modifier un dossier">
  <Edit
    bind:open={openEdit}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale bind:open={openShow} size="xl" title="Détails du dossier">
  <Show
    bind:open={openShow}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale bind:open={openDelete} size="xl" title="Supprimer le dossier">
  <Delete
    bind:open={openDelete}
    data={current_data}
    on:updated={fetchData}
  />
</Modale>