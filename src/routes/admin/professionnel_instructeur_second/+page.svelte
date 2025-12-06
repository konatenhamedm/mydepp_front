<script lang="ts">
  import InputSimple from "$components/inputs/InputSimple.svelte";
  import { apiFetch, BASE_URL_API } from "$lib/api";
  import { Button } from "flowbite-svelte";
  import { TrashBinSolid } from "flowbite-svelte-icons";
  import Modale from "$components/Modales/Modale.svelte";
  import { onMount } from "svelte";

  import Abercrome from "$components/_includes/Abercrome.svelte";
  import Pagination from "$components/Pagination.svelte";
  import { pageSize } from "../../../store";
  import { get } from "svelte/store";
  import type { professionnel } from "../../../types";
  import Add from "./Add.svelte";
  import Edit from "./Edit.svelte";
  import Show from "./Show.svelte";
  import Delete from "./Delete.svelte";
  import ShowDetails from "./ShowDetails.svelte";
  import Imputation from "./Imputation.svelte";
  import Menu from "$components/_includes/Menu.svelte";
  import { CookieManager, getAuthCookie } from "$lib/auth";
  import HeaderTable from "$components/_includes/HeaderTable.svelte";
  import LoaderTable from "$components/_includes/LoaderTable.svelte";
  import { AreaChart } from "lucide-svelte";

  let user: any[] = [];

  // Types
  type Permission = "R" | "RD" | "RU" | "CRUD" | "CR" | "CRU" | "null";
  type ActionType =
    | "view"
    | "edit"
    | "delete"
    | "add"
    | "imputation"
    | "details";
  type Action = {
    action: ActionType;
    title: string;
    icon: string;
    color: string;
  };

  // Données
  let main_data: professionnel[] = [];
  let searchQuery = "";
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
  let current_data: any;
  let permission: Permission | null = null;
  let activeTab = "attente";

  let actions: Action[] = [];

  const path: string = "/admin/end-user";

  // Configuration des permissions
  const PERMISSION_MAP: Record<ActionType, Permission[]> = {
    add: ["CRUD", "CRU", "CR"],
    view: ["R", "RD", "RU", "CRUD", "CRU", "CR"],
    edit: ["RU", "CRUD", "CRU"],
    delete: ["RD", "CRUD"],
    imputation: ["CRUD", "CRU"],
    details: ["R", "RD", "RU", "CRUD", "CRU", "CR"],
  };

  const allActions: Action[] = [
    {
      action: "view",
      title: "Voir",
      icon: "eye",
      color: "success",
    },
    // {
    //   action: 'edit',
    //   title: 'Modifier',
    //   icon: 'edit',
    //   color: 'warning',
    // },
    // {
    //   action: 'delete',
    //   title: 'Supprimer',
    //   icon: 'trash-alt',
    //   color: 'danger',
    // },
    // {
    //   action: 'imputation',
    //   title: 'Imputation',
    //   icon: 'user-check',
    //   color: 'warning',
    // },
    // {
    //   action: 'details',
    //   title: 'Détails',
    //   icon: 'info-circle',
    //   color: 'primary',
    // },
  ];

  // Liste des onglets avec leur label
  const tabs = [
    { key: "attente", label: "En attente" },
    { key: "accepte", label: "Accepté" },
    { key: "rejete", label: "Rejeté" },
    { key: "valide", label: "Validé" },
    { key: "refuse", label: "Refusé" },
    { key: "renouvellement", label: "Renouvellement" },
    { key: "a_jour", label: "À jour" },
    { key: "refuse_mise_a_jour", label: "Attente de Mise à jour" },
  ];

  // Fonctions
  function getFilteredActions(perm: Permission | null): Action[] {
    if (!perm) return [];
    return allActions.filter((action) =>
      PERMISSION_MAP[action.action].includes(perm)
    );
  }

  // Fonction pour déterminer quelles actions afficher selon le type d'utilisateur
  function getUserSpecificActions(userType: string): ActionType[] {
    const baseActions: ActionType[] = ["view", "details"];

    switch (userType) {
      case "ADMINISTRATEUR":
        return [];
      case "SOUS-DIRECTEUR-ETAB":
      case "SOUS-DIRECTEUR-PROF":
      case "DIRECTEUR":
        return [...baseActions, "edit", "delete", "imputation"];
      default:
        return baseActions;
    }
  }

  async function fetchData() {
    loading = true;
    try {
      const res = await apiFetch(true, "/professionnel/");
      if (res) {
        main_data = res.data as professionnel[];
        totalItems = res.data.length ?? 0;
        perPage = get(pageSize);

        console.log("main_data", main_data);
      } else {
        console.error("Structure inattendue:", res);
      }
    } catch (error) {
      console.error("Erreur:", error);
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
      case "view":
        openShow = true;
        break;
      case "edit":
        openEdit = true;
        break;
      case "delete":
        openDelete = true;
        break;
      case "imputation":
        openImputation = true;
        break;
      case "details":
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

  const DisablePro = async (item: any) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce professionnel ?")) {
      try {
        const response: any = await fetch(
          `${BASE_URL_API}/professionnel/desactive/${item.personne.id}`,
          {
            method: "POST",
          }
        );

        const jsonData = await response.json();

        if (!response.ok) {
          throw new Error(jsonData.message || "Erreur lors de la connexion");
        }
        await fetchData();
        return jsonData;
      } catch (error) {
        console.error("Erreur de connexion:", error);
        return { token: null };
      }
    }
  };

  // Fonction pour déterminer si une colonne Action doit être affichée
  // Fonction pour déterminer si une colonne Action doit être affichée
  function shouldShowActionColumn(): boolean {
    // ADMINISTRATEUR ne voit JAMAIS la colonne Action
    if (user.type === "ADMINISTRATEUR") return false;
    // alert(activeTab);
    if (activeTab == "accepte") {
      return true;
    } else {
      return false;
    }
  }

  // Fonction pour déterminer les colonnes à afficher
  function getTableHeaders(): string[] {
    const baseHeaders = [
      "Nom",
      "Prénoms",
      "Téléphone",
      "Email",
      "Professionnel de santé",
    ];

    if (user.type === "ADMINISTRATEUR") {
      return [...baseHeaders, "Code", "Imputation"];
      // Pas de 'Action' pour ADMINISTRATEUR
    }

    if (activeTab) {
      const headersWithCode = [...baseHeaders, "Code", "Imputation"];
      if (shouldShowActionColumn()) {
        return [...headersWithCode, "Action"];
      }
      return headersWithCode;
    }

    const headersWithoutCode = [...baseHeaders, "Imputation"];

    if (showActions) {
      return [...headersWithoutCode, "Action"];
    }
    return headersWithoutCode;
  }

  // Cycle de vie
  onMount(async () => {
    user = getAuthCookie();
    await fetchData();
    permission = "CRUD";

    // Filtrer les actions selon le type d'utilisateur
    const allowedActions = getUserSpecificActions(user.type);
    actions = allActions.filter((action) =>
      allowedActions.includes(action.action)
    );

    console.log("Actions autorisées:", actions);
    console.log("Type d'utilisateur:", allowedActions);
  });

  // Réactivité
$: statusCounts = main_data.reduce((acc, item) => {
    const status = item.personne.status;
    
    // Pour l'onglet "attente", ne compter que les professionnels imputés à l'utilisateur connecté
    if (status === "attente") {
      if (item.personne.imputation === user.id) {
        acc[status] = (acc[status] || 0) + 1;
      }
    } else {
      // Pour les autres onglets, compter normalement
      acc[status] = (acc[status] || 0) + 1;
    }
    
    return acc;
  }, {});

$: filteredData = main_data
    .filter((item) => item.personne.status === activeTab)
    .filter((item) => {
      // Si on est dans l'onglet "accepte", filtrer par imputation
      // if (activeTab === "attente") {
      //   return false;
      // }
      if (activeTab === "attente") {
        return item.personne.imputation === user.id;
      }
      // Filtre de recherche
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.personne.nom?.toLowerCase().includes(query) ||
        item.personne.prenoms?.toLowerCase().includes(query) ||
        item.personne.number?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.personne.profession?.libelle?.toLowerCase().includes(query) ||
        item.personne.code?.toLowerCase().includes(query)
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

  $: if (
    !openAdd &&
    !openEdit &&
    !openDelete &&
    !openShow &&
    !openShowDetails &&
    !openImputation
  ) {
    refreshDataIfNeeded();
  }

  $: tableHeaders = getTableHeaders();
  $: activeTab && getTableHeaders();
  $: showActions = shouldShowActionColumn();
</script>

<div
  class="ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]"
>
  <Abercrome
    titre="Gestion des dossiers"
    parent="Dashbord"
    current="dossiers professionnels"
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
          Liste des dossiers professionnels
        </h1>

        {#if PERMISSION_MAP["add"].includes(permission as Permission)}
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
                <!-- {#each tableHeaders as title}
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-200"
                  >
                    {title}
                  </th>
                {/each} -->
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-200"
                >
                  Nom
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-200"
                >
                  Prénoms
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-200"
                >
                  Téléphone
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-200"
                >
                  Email
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-200"
                >
                  Professionnel de santé
                </th>

                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-200"
                >
                  Code
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-200"
                >
                  Imputation
                </th>
                <!-- Actions -->
                {#if activeTab == "attente"}
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-200"
                  >
                    Action
                  </th>
                {/if}
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
                      <div
                        class="flex flex-row gap-2 items-center justify-center mb-2"
                      >
                        <div
                          class="w-3 h-3 rounded-full bg-blue-600 animate-bounce"
                        ></div>
                        <div
                          class="w-3 h-3 rounded-full bg-blue-600 animate-bounce"
                          style="animation-delay: 0.1s"
                        ></div>
                        <div
                          class="w-3 h-3 rounded-full bg-blue-600 animate-bounce"
                          style="animation-delay: 0.2s"
                        ></div>
                      </div>
                      <span class="text-sm">Chargement des données...</span>
                    </div>
                  </td>
                </tr>
              {:else if paginatedData.length === 0}
                <tr>
                  <td
                    colspan={tableHeaders.length}
                    class="py-12 text-center text-gray-500"
                  >
                    <div class="flex flex-col items-center justify-center">
                      <img
                        src="/search_notfound.svg"
                        alt="Aucun résultat trouvé"
                        class="w-24 h-24 mb-4 opacity-60"
                      />
                      <h1 class="text-xl font-semibold text-gray-600 mb-2">
                        Aucun résultat
                      </h1>
                      <p class="text-gray-500 text-sm">
                        Aucun résultat trouvé avec les critères de filtrage
                        actuels
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
                      {item.personne.nom || "-"}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {item.personne.prenoms || "-"}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {item.personne.number || "-"}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {item.email || "-"}
                    </td>
                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {item.personne.profession
                        ? item.personne.profession.libelle
                        : "-"}
                    </td>

                    {#if tableHeaders.includes("Code")}
                      <td class="px-4 text-[14px] py-3 border border-gray-200">
                        {item.personne.code || "-"}
                      </td>
                    {/if}

                    <td class="px-4 text-[14px] py-3 border border-gray-200">
                      {#if item.personne.imputationData}
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {item?.personne?.imputationData?.nom}{" "}{item?.personne?.imputationData?.prenoms}
                        </span>
                      {:else}
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                        >
                          Non attribué
                        </span>
                      {/if}
                    </td>

                    <!-- Actions -->
                    {#if activeTab == "attente"}
                      <td class="px-4 text-[12px] py-3 border border-gray-200">
                        <div class="flex items-center gap-2 justify-end">

                          
                            <button
                              on:click={() => {
                                openShow = true;
                                current_data = item;
                              }}
                              class={`inline-flex h-[30px] items-center  gap-[6px] rounded-[4px] px-[10px] text-[20px] font-semibold capitalize transition duration-300 ease-in-out bg-info hover:bg-info/80 border border-info text-white`}
                              title={"view"}
                            >
                              <i class={`uil uil-eye`}></i>
                            </button>
                           
                        </div>
                      </td>
                    {/if}
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
                Affichage de {startRange} à {endRange} sur {filteredData.length}
                résultat(s)
              </span>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modales -->
<Modale bind:open={openAdd} size="xl" title="Créer un dossier professionnel">
  <Add
    bind:open={openAdd}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale
  bind:open={openEdit}
  size="2xl"
  title="Modifier un dossier professionnel"
>
  <Edit
    bind:open={openEdit}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale
  bind:open={openShow}
  size="2xl"
  title="Détails du dossier professionnel"
>
  <Show
    bind:open={openShow}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale bind:open={openShowDetails} size="2xl" title="Détails complémentaires">
  <ShowDetails
    bind:open={openShowDetails}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale bind:open={openImputation} size="md" title="Imputation">
  <Imputation
    bind:open={openImputation}
    data={current_data}
    on:updated={fetchData}
    userUpdateId={user?.id}
  />
</Modale>

<Modale
  bind:open={openDelete}
  size="xl"
  title="Supprimer dossier professionnel"
>
  <Delete bind:open={openDelete} data={current_data} on:updated={fetchData} />
</Modale>
