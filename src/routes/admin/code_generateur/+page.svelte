<script lang="ts">
  import InputSimple from '$components/inputs/InputSimple.svelte';
  import {apiFetch, BASE_URL_API} from '$lib/api';
  import {Button, Modal, Select} from 'flowbite-svelte';
  import Notification from '$components/_includes/Notification.svelte';
  import InputSelect from '$components/inputs/InputSelect.svelte';
  import Modale from '$components/Modales/Modale.svelte';
  import {onMount} from 'svelte';
  import Edit from './Edit.svelte';
  import Abercrome from '$components/_includes/Abercrome.svelte';
  import Pagination from '$components/Pagination.svelte';
  import {pageSize} from '../../../store';
  import {get} from 'svelte/store';
  import type {CodeGenerateur} from '../../../types';
  import Add from './Add.svelte';
  import Show from './Show.svelte';
  import Delete from './Delete.svelte';
  import Menu from '$components/_includes/Menu.svelte';
  import {getPermission} from '$lib/auth';
  import HeaderTable from '$components/_includes/HeaderTable.svelte';
  import LoaderTable from '$components/_includes/LoaderTable.svelte';
  import {getAuthCookie} from '$lib/auth';
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
  let user: any = [];

  let main_data: CodeGenerateur[] = [];
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

  const path: string = '/admin/code_generateur';

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
      const res = await apiFetch(true, `/codeGenerateur/`);

      console.log(res);

      if (res) {
        main_data = res.data as CodeGenerateur[];

        // Infos pagination venant de Laravel
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
    console.log('Actions disponibles:', permission);
  });

  // Réactivité
  $: filteredData = main_data.filter((item) => {
    return item.code.toLowerCase().includes(searchQuery.toLowerCase());
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

  $: if (!openAdd && !openEdit && !openDelete) {
    refreshDataIfNeeded();
  }

  $: {
    if (permission) {
      actions = getFilteredActions(permission);
      console.log('Actions mises à jour:', actions);
    }
  }

    function formatDateForInput(dateString: string) {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (e) {
      console.error("Erreur de formatage de date:", e);
      return "";
    }
  }
</script>

<div
  class=" ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]"
>
  <Abercrome titre="Parametres" parent="Dashbord" current="code generateur" />
  <!-- Responsive Toggler -->
  <div class="col-span-12">
    <div
      class="dark:bg-box-dark text-body dark:text-subtitle-dark rounded-10 relative m-0 bg-white p-0 text-[15px] shadow"
    >
      <div
        class=" text-dark dark:text-title-dark border-regular dark:border-box-dark-up flex flex-wrap items-center justify-between border-b px-[25px] text-[17px] font-medium max-sm:h-auto max-sm:flex-col"
      >
        <h1
          class="text-dark dark:text-title-dark mb-0 inline-flex items-center overflow-hidden py-[16px] text-[18px] font-semibold text-ellipsis whitespace-nowrap"
        >
          Liste des codes 
        </h1>

        <!-- {#if PERMISSION_MAP['add'].includes(permission as Permission)} -->
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
        <!--  {/if} -->
      </div>
      <div
        class=" text-dark dark:text-title-dark border-regular dark:border-box-dark-up flex flex-wrap items-center justify-between border-b px-[15px] text-[17px] font-medium max-sm:h-auto max-sm:flex-col"
      >
        <div class="grid w-full grid-cols-4 pt-2">
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
          <table
            class="min-w-full border border-gray-200 rounded-xl shadow-sm text-sm"
          >
            <!-- Header -->
            <HeaderTable item={["Date création","code","Civilite","Profession","Date naissance"]} />
            <!-- Body -->
            <tbody class="text-gray-700">
              {#if loading && paginatedData.length === 0}
                <tr>
                  <td colspan="4" class="py-6 text-[14px]  text-center text-gray-500">
                    Chargement en cours...
                  </td>
                </tr>
              {:else if paginatedData.length === 0}
                <tr>
                  <td colspan="4" class="py-6 text-[12]  text-center text-gray-500">
                    Aucun résultat trouvé avec les critères de filtrage actuels
                  </td>
                </tr>
              {:else}
                {#each paginatedData as item, i}
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 text-[14px]  py-3 border border-gray-200">
                      
                      {formatDateForInput(item.dateCreation)}</td
                    >
                    <td class="px-4 text-[14px]  py-3 border border-gray-200">
                      
                      {item.code}</td
                    >
                    <td class="px-4 text-[14px]  py-3 border border-gray-200">
                      
                      {item.civilite.libelle}</td
                    >
                    <td class="px-4 text-[14px]  py-3 border border-gray-200"
                      >{item.profession.libelle}</td
                    >
                    <td class="px-4 text-[14px]  py-3 border border-gray-200"
                      >{formatDateForInput(item.dateNaissance)}</td
                    >
                    <td class="px-4 text-[12px]  py-3 border border-gray-200 text-right">
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

<Modale bind:open={openAdd} size="xl" title="Créer une civilité">
  <Add bind:open={openAdd} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openEdit} size="xl" title="Modifier une civilité">
  <Edit bind:open={openEdit} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openShow} size="xl" title="Détails d'une civilité">
  <Show bind:open={openShow} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openDelete} size="xl" title="Supprimer civilité">
  <Delete bind:open={openDelete} data={current_data} on:updated={fetchData} />
</Modale>
