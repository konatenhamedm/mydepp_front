<script lang="ts">
  import InputSimple from '$components/inputs/InputSimple.svelte';
  import { apiFetch, BASE_URL } from '$lib/api';
  import { onMount } from 'svelte';
  import Edit from './Edit.svelte';
  import Abercrome from '$components/_includes/Abercrome.svelte';
  import Pagination from '$components/Pagination.svelte';
  import type { Magasin } from '../../../types';
  import Add from './Add.svelte';
  import Show from './Show.svelte';
  import Delete from './Delete.svelte';
  import Menu from '$components/_includes/Menu.svelte';
  import { getPermission } from '$lib/auth';
  import HeaderTable from '$components/_includes/HeaderTable.svelte';
  import Modale from '$components/Modales/Modale.svelte';
	import { getAuthCookie } from '$lib/auth';

  // Types
  type Permission = 'R' | 'RD' | 'RU' | 'CRUD' | 'CR' | 'CRU' | 'null';
  type ActionType = 'view' | 'edit' | 'delete' | 'add' | 'menu';
  type Action = {
    action: ActionType;
    title: string;
    icon: string;
    color: string;
  };
	let user: any = [];
  // Données
  let main_data: Magasin[] = [];
  let searchQuery = '';
  let currentPage = 1;
  let totalPages = 1;
  let totalItems = 0;
  let perPage = 15;
  let startRange = 0;
  let endRange = 0;
  let loading = false;

  let openDelete = false;
  let openEdit = false;
  let openMenu = false;
  let openAdd = false;
  let openShow = false;
  let current_data: any = {};
  let permission: Permission | null = null;
  let actions: Action[] = [];

  const path: string = '/admin/categorie';

  // Configuration des permissions
  const PERMISSION_MAP: Record<ActionType, Permission[]> = {
    add: ['CRUD', 'CRU', 'CR'],
    view: ['R', 'RD', 'RU', 'CRUD', 'CRU', 'CR'],
    edit: ['RU', 'CRUD', 'CRU'],
    menu: ['RU', 'CRUD', 'CRU'],
    delete: ['RD', 'CRUD'],
  };

  const allActions: Action[] = [
    { action: 'view', title: 'Voir', icon: 'eye', color: 'primary' },
    /* { action: 'edit', title: 'Modifier', icon: 'edit', color: 'warning' },
    { action: 'delete', title: 'Supprimer', icon: 'trash-alt', color: 'danger' }, */
  ];

  // Récupérer les actions selon permission
  function getFilteredActions(perm: Permission | null): Action[] {
    if (!perm) return [];
    return allActions.filter((action) =>
      PERMISSION_MAP[action.action].includes(perm)
    );
  }

  // Fonction pour récupérer les données depuis l’API
  async function fetchData() {
    loading = true;
    try {

        const res = await apiFetch(true, `/magasins/all?page=${currentPage}`);

      console.log("res", res);

      if (res) {
        main_data = res.data as Magasin[];

        console.log(main_data);

        // Infos pagination venant de Laravel
        currentPage = res.current_page;
        totalPages = res.last_page;
        totalItems = res.total;
        perPage = res.per_page;
        startRange = res.from ?? 0;
        endRange = res.to ?? 0;
      } else {
        console.error('Structure inattendue:', res);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    } finally {
      loading = false;
    }
  }

 

  // Cycle de vie
  onMount(async () => {
		user = getAuthCookie();

    await fetchData();
   
    actions = getFilteredActions('CRUD');
  });

  // Rafraîchir données si besoin
  async function refreshDataIfNeeded() {
    await fetchData();
  }

  // Gérer les actions
  const handleAction = (action: ActionType, item: any) => {
    current_data = item;
    switch (action) {
      case 'view':
        openShow = true;
        break;
      case 'edit':
        openEdit = false;
        break;
      case 'delete':
        openDelete = false;
        break;
      case 'menu':
        openMenu = false;
        break;
    }
  };

  // Gérer changement de page
  function handlePageChange(event: CustomEvent) {
    currentPage = event.detail;
    fetchData();
  }

  // Rafraîchit quand une modale se ferme
  $: if (!openAdd && !openEdit && !openDelete) {
    refreshDataIfNeeded();
  }

  // Met à jour les actions selon permission
  $: if (permission) {
    actions = getFilteredActions(permission);
  }
</script>

<div
  class="ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]"
>
  <Abercrome titre="magasins" parent="Dashbord" current="magasins" />

  <div class="col-span-12">
    <div
      class="dark:bg-box-dark text-body dark:text-subtitle-dark rounded-10 relative m-0 bg-white p-0 text-[15px] shadow"
    >
      <!-- Header -->
      <div
        class="text-dark dark:text-title-dark border-regular dark:border-box-dark-up flex flex-wrap items-center justify-between border-b px-[25px] text-[17px] font-medium"
      >
        <h1 class="text-dark dark:text-title-dark py-[16px] text-[18px] font-semibold">
          Liste des magasins
        </h1>

      <!--   <button
          class="bg-secondary border-secondary hover:bg-secondary-hbr inline-flex h-[40px] items-center justify-center gap-[6px] rounded-[6px] border px-[20px] text-[14px] font-semibold text-white capitalize"
          on:click={() => ((current_data = {}), (openAdd = true))}
        >
          <i class="uil uil-plus text-[18px]"></i>
          Nouveau
        </button> -->
      </div>

      <!-- Search -->
      <div
        class="text-dark dark:text-title-dark border-regular dark:border-box-dark-up flex items-center border-b px-[15px]"
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

      <!-- Table -->
      <div class="p-[20px]">
        <div class="scrollbar overflow-x-auto">
          <table class="min-w-full border border-gray-200 rounded-xl shadow-sm text-sm">
            <HeaderTable item={['Tél', 'Email', 'Propriétaire', 'Devise', 'Libellé']} afficheAction={true} />

            <tbody class="text-gray-700">
              {#if loading && main_data.length === 0}
                <tr>
                  <td colspan="5" class="py-6 text-center text-gray-500">
                    Chargement en cours...
                  </td>
                </tr>
              {:else if main_data.length === 0}
                <tr>
                  <td colspan="5" class="py-6 text-center text-gray-500">
                    Aucun résultat trouvé
                  </td>
                </tr>
              {:else}
                {#each main_data as item}
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3 border">{item.tel || '-'}</td>
                    <td class="px-4 py-3 border">{item.email || '-'}</td>
                    <td class="px-4 py-3 border">
                      {item.owner.nom} {item.owner?.prenoms}
                    </td>
                    <td class="px-4 py-3 border">
                      {item.pays_devise.devise?.code}
                    </td>
                    <td class="px-4 py-3 border capitalize">{item.libelle}</td>
                    <td class="px-4 py-3 border text-right">
                      <Menu {item} onAction={handleAction} {actions} />
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>

          <!-- Pagination -->
          {#if totalPages > 1}
            <div class="mt-4">
              <Pagination
                {currentPage}
                {totalPages}
                {startRange}
                {endRange}
                totalItems={totalItems}
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
<Modale bind:open={openAdd} size="xl" title="Créer un magasin">
  <Add bind:open={openAdd} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openEdit} size="xl" title="Modifier un magasin">
  <Edit bind:open={openEdit} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openShow} size="xl" title="Détails du magasin">
  <Show bind:open={openShow} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openDelete} size="xl" title="Supprimer le magasin">
  <Delete bind:open={openDelete} data={current_data} on:updated={fetchData} />
</Modale>
