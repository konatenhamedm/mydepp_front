<script lang="ts">
  import { onMount } from 'svelte';
  import InputSimple from '$components/inputse/InputSimple.svelte';
  import Pagination from '$components/Pagination.svelte';
  import Menu from '$components/_includes/Menu.svelte';
  import Abercrome from '$components/_includes/Abercrome.svelte';
  import Modale from '$components/Modales/Modale.svelte';
  import HeaderTable from '$components/_includes/HeaderTable.svelte';
  import LoaderTable from '$components/_includes/LoaderTable.svelte';

  import Show from './Show.svelte';
  import Edit from './Edit.svelte';
  import Delete from './Delete.svelte';
  import Add from './Add.svelte';

  import { apiFetch } from '$lib/api';
  import { pageSize } from '../../../store';
  import { get } from 'svelte/store';

  // Types
  type Permission = 'R' | 'RD' | 'RU' | 'CRUD' | 'CR' | 'CRU' | 'null';
  type ActionType = 'view' | 'edit' | 'delete' | 'add';
  type Action = {
    action: ActionType;
    title: string;
    icon: string;
    color: string;
  };

  // State
  let main_data: any[] = [];
  let filteredData: any[] = [];
  let paginatedData: any[] = [];
  let searchQuery = '';
  let loading = false;

  let currentPage = 1;
  let totalItems = 0;
  let perPage = get(pageSize);
  let totalPages = 1;
  let startRange = 0;
  let endRange = 0;

  // Modal states
  let openDelete = false;
  let openEdit = false;
  let openAdd = false;
  let openShow = false;
  let current_data: any = {};

  // Permissions
  let permission: Permission | null = null;
  let actions: Action[] = [];

  const PERMISSION_MAP: Record<ActionType, Permission[]> = {
    add: ['CRUD', 'CRU', 'CR'],
    view: ['R', 'RD', 'RU', 'CRUD', 'CRU', 'CR'],
    edit: ['RU', 'CRUD', 'CRU'],
    delete: ['RD', 'CRUD']
  };

  const allActions: Action[] = [
    { action: 'view', title: 'Voir', icon: 'eye', color: 'primary' },
    { action: 'edit', title: 'Modifier', icon: 'edit', color: 'warning' },
    { action: 'delete', title: 'Supprimer', icon: 'trash-alt', color: 'danger' }
  ];

  function getFilteredActions(perm: Permission | null): Action[] {
    if (!perm) return [];
    return allActions.filter(action => PERMISSION_MAP[action.action].includes(perm));
  }

  async function fetchData() {
    loading = true;
    try {
      const res = await apiFetch(true, '/admins/all?page=' + currentPage,"POST");

	  console.log(res);
      if (res && res.data) {
        main_data = res.data;
        currentPage = res.current_page ?? 1;
        totalPages = res.last_page ?? 1;
        totalItems = res.total ?? main_data.length;
        perPage = res.per_page ?? get(pageSize);
        startRange = res.from ?? 0;
        endRange = res.to ?? main_data.length;
      } else {
        console.error('Structure inattendue:', res);
      }
    } catch (err) {
      console.error('Erreur:', err);
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
      case 'view': openShow = true; break;
      case 'edit': openEdit = true; break;
      case 'delete': openDelete = true; break;
    }
  };

  function handlePageChange(event: CustomEvent) {
    currentPage = event.detail;
  }

  // Cycle de vie
  onMount(async () => {
    await fetchData();
    permission = "CRUD"; // tu pourras brancher ça avec ton auth
    actions = getFilteredActions(permission);
  });

  // Réactivité
  $: filteredData = main_data.filter(item => {
    return (
      (item.nom?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.prenoms?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.role?.libelle?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  $: totalPages = Math.max(1, Math.ceil(filteredData.length / perPage));

  $: paginatedData = filteredData.length > 0
    ? filteredData.slice((currentPage - 1) * perPage, currentPage * perPage)
    : [];

  $: startRange = filteredData.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
  $: endRange = Math.min(currentPage * perPage, filteredData.length);

  $: if (currentPage > totalPages) currentPage = totalPages;
  $: if (filteredData.length === 0) currentPage = 1;

  $: {
    if (permission) {
      actions = getFilteredActions(permission);
    }
  }
</script>


<div class="ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]">
  <Abercrome titre="Utilisateurs" parent="Dashboard" current="Utilisateurs" />

  <div class="bg-white rounded-10 shadow">
    <!-- Header -->
    <div class="flex items-center justify-between border-b px-[25px] text-[17px] font-medium">
      <h1 class="text-dark mb-0 py-[16px] text-[18px] font-semibold">
        Liste des utilisateurs
      </h1>
      <button
        class="bg-secondary hover:bg-secondary-hbr inline-flex h-[40px] items-center justify-center gap-[6px] rounded-[6px] px-[20px] text-[14px] font-semibold text-white transition"
        on:click={() => ((current_data = {}), (openAdd = true))}
      >
        <i class="uil uil-plus text-[18px]"></i>
        Nouveau
      </button>
    </div>

    <!-- Search -->
    <div class="border-b px-[15px]">
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

    <!-- Table -->
    <div class="p-[20px]">
      <div class="scrollbar overflow-x-auto">
        <table class="min-w-full border border-gray-200 rounded-xl shadow-sm text-sm">
          <HeaderTable item={['Nom', 'Prénoms', 'Email', 'Rôle']} />
          <tbody class="text-gray-700">
            {#if loading && paginatedData.length === 0}
              <tr>
                <td colspan="4" class="py-6 text-center text-gray-500">
                  Chargement en cours...
                </td>
              </tr>
            {:else if paginatedData.length === 0}
              <tr>
                <td colspan="4" class="py-6 text-center text-gray-500">
                  Aucun résultat trouvé
                </td>
              </tr>
            {:else}
              {#each paginatedData as item}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 border">{item.nom}</td>
                  <td class="px-4 py-3 border">{item.prenoms}</td>
                  <td class="px-4 py-3 border">{item.email}</td>
                  <td class="px-4 py-3 border">{item.role?.libelle ?? 'N/A'}</td>
                  <td class="px-4 py-3 border text-right">
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

<!-- Modales -->
<Modale bind:open={openAdd} size="xl" title="Créer un utilisateur">
  <Add bind:open={openAdd} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openEdit} size="xl" title="Modifier un utilisateur">
  <Edit bind:open={openEdit} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openShow} size="xl" title="Détails d'un utilisateur">
  <Show bind:open={openShow} data={current_data} />
</Modale>
<Modale bind:open={openDelete} size="xl" title="Supprimer un utilisateur">
  <Delete bind:open={openDelete} data={current_data} on:updated={fetchData} />
</Modale>
