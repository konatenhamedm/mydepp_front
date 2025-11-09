<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';
  import type { StatsDashboard } from '../../../types';
  import Pdf from '$components/pdf/Pdf.svelte';
  import { getAuthCookie } from '$lib/auth';
  import Pagination from '$components/Pagination.svelte';
  import CsvExporter from '$components/excel/CsvExporter.svelte';
  import Notification from '$components/_includes/Notification.svelte';
  import HeaderTable from '$components/_includes/HeaderTable.svelte';
  import LoaderTable from '$components/_includes/LoaderTable.svelte';

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
  let user: any = null;
  let userType = '';
  let userId = '';
  let permission: Permission | null = null;

  // Stats
  let stats = {
    atttente: 0,
    accepte: 0,
    rejete: 0,
    valide: 0,
    refuse: 0,
    renouvelle: 0,
    a_jour: 0,
  };

  // Données réactives
  let main_data: StatsDashboard | null = null;
  let loading = false;
  let dataLoaded = false;
  let dossierFilter = "etablissement";
  let currentPage = 1;
  const itemsPerPage = 10;
  let professionnels: any[] = [];
  let allEtab2: any[] = [];
  let EtabLength2: any = 0;
  let professions: any[] = [];
  let selectedProfession: string = '';
  let selectedStatus: string = '';
  let filteredProfessionnels: any[] = [];

  // Filtre par statut
  let statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'attente', label: 'En attente' },
    { value: 'accepte', label: 'Accepté' },
    { value: 'rejete', label: 'Rejeté' },
    { value: 'valide', label: 'Validé' },
    { value: 'refuse', label: 'Refusé' },
    { value: 'renouvellement', label: 'Renouvelé' },
    { value: 'a_jour', label: 'À jour' },
  ];

  // Date et heure
  let currentDate = new Date();
  let formattedDate = currentDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  let currentTime = currentDate.toLocaleTimeString('fr-FR');

  // Configuration des permissions
  const PERMISSION_MAP: Record<ActionType, Permission[]> = {
    add: ['CRUD', 'CRU', 'CR'],
    view: ['R', 'RD', 'RU', 'CRUD', 'CRU', 'CR'],
    edit: ['RU', 'CRUD', 'CRU'],
    delete: ['RD', 'CRUD'],
  };

  // Fonctions optimisées
  onMount(() => {
    user = getAuthCookie();
    
    if (user) {
      userType = user.type;
      userId = user.id;
    }

    fetchInitialData();

    const timer = setInterval(() => {
      const now = new Date();
      currentTime = now.toLocaleTimeString('fr-FR');
      formattedDate = now.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  async function fetchUserStats() {
    try {
      const response = await apiFetch(
        true,
        `/statistique/info-dashboard/by/typeuser/${userType}/${userId}`
      );
      if (response && response.data) {
        stats = {
          ...stats,
          ...response.data,
        };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
    }
  }

  async function fetchInitialData() {
    if (dataLoaded && allEtab2.length > 0) return;
    
    loading = true;
    try {
      let statsUrl = '/statistique/info-dashboard';
      if (userType && userId) {
        statsUrl = `/statistique/info-dashboard/by/typeuser/${userType}/${userId}`;
      }

      const [statsRes, listeProfessionnels, profRes, allEtab, EtabLength] = await Promise.all([
        apiFetch(true, statsUrl).catch(() => null),
        apiFetch(true, `/professionnel/`).catch(() => ({ data: [] })),
        apiFetch(true, '/profession/').catch(() => ({ data: [] })),
        apiFetch(true, '/etablissement/').catch(() => ({ data: [] })),
        apiFetch(true, '/statistique/stats-card').catch(() => ({ data: [] })),
      ]);

      allEtab2 = allEtab?.data || [];
      EtabLength2 = EtabLength?.data.etablissement.total || 0;
      if (statsRes?.data) {
        stats = {
          ...stats,
          ...statsRes.data,
        };
      }

      if (listeProfessionnels?.data) {
        professionnels = listeProfessionnels.data;
      }

      if (profRes?.data) {
        professions = profRes.data;
      }

      updateFilteredData();
      dataLoaded = true;
      
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      loading = false;
    }
  }

  function updateFilteredData() {
    if (!dataLoaded) return;
    
    let tempData = [];

    if (dossierFilter === 'etablissement') {
      tempData = allEtab2;
    } else {
      tempData = professionnels.filter((p) => {
        if (dossierFilter === 'all') return true;
        
        const status = p.personne?.status;
        switch (dossierFilter) {
          case 'accepted': return status === 'accepte';
          case 'rejected': return status === 'rejete';
          case 'attente': return status === 'en_attente';
          case 'validated': return status === 'valide';
          case 'a_jour': return status === 'a_jour';
          case 'refuse': return status === 'refuse';
          case 'renew': return status === 'renouvellement';
          default: return true;
        }
      });
    }

    // Appliquer le filtre de profession (sauf pour les établissements)
    if (selectedProfession && dossierFilter !== 'etablissement') {
      const selectedProfessionId = Number(selectedProfession);
      tempData = tempData.filter(
        (p) => p.personne?.profession?.id === selectedProfessionId
      );
    }

    // Appliquer le filtre de statut
    if (selectedStatus) {
      tempData = tempData.filter(
        (p) => p.personne?.status === selectedStatus
      );
    }

    filteredProfessionnels = tempData;
    
    if (currentPage !== 1) {
      currentPage = 1;
    }
  }

  function handleProfessionChange(event: any) {
    selectedProfession = event.target?.value || '';
    updateFilteredData();
  }

  function handleStatusChange(event: any) {
    selectedStatus = event.target?.value || '';
    updateFilteredData();
  }

  function handleCardClick(type: string) {
    console.log('Clic sur la carte:', type);
    dossierFilter = type;
    
    if (type === 'etablissement') {
      selectedProfession = '';
      selectedStatus = '';
    }
    
    updateFilteredData();
  }

  function handlePageChange(event: CustomEvent<number>) {
    currentPage = event.detail;
  }

  // Données pour les cartes - version simplifiée avec seulement établissement
  $: cardData = [
    {
      id: 'etablissement',
      title: 'Etablissement',
      subtitle: 'Statistique actuelle',
      value: EtabLength2,
      icon: 'building',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'datetime',
      title: 'Date & Heure',
      subtitle: `à ${currentTime}`,
      value: formattedDate,
      icon: 'clock',
      color: 'indigo',
      bgColor: 'bg-indigo-500',
      textColor: 'text-white',
      borderColor: 'border-indigo-600',
      isDatetime: true
    }
  ];

  const getIconSvg = (icon: string) => {
    const icons: any = {
      building: `M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4`,
      clock: `M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z`
    };
    return icons[icon] || '';
  };

  // Calculs réactifs pour la pagination
  $: totalItems = filteredProfessionnels.length;
  $: totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  $: if (currentPage > totalPages && totalPages > 0) {
    currentPage = Math.max(1, totalPages);
  }
  
  $: paginatedData = filteredProfessionnels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  $: startRange = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  $: endRange = Math.min(currentPage * itemsPerPage, totalItems);

  // Détermine si le filtre de profession doit être affiché
  $: showProfessionFilter = dossierFilter !== 'etablissement';

  // Réactivité pour mettre à jour les données filtrées
  $: if (dataLoaded) {
    updateFilteredData();
  }
</script>

<div class="ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]">
  <!-- Indicateur de chargement global -->
  {#if loading && !dataLoaded}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 flex flex-col items-center">
        <svg class="animate-spin h-12 w-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-lg font-medium text-gray-700">Chargement des données...</p>
      </div>
    </div>
  {/if}

  <!-- Grille de cartes simplifiée -->
  <div class="grid grid-cols-2 md:grid-cols-2 gap-6 mb-8">
    {#each cardData as card}
      {#if card.id === 'datetime'}
        <!-- Carte Date/Heure spéciale -->
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm font-semibold opacity-90">{card.title}</div>
            <svg class="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconSvg(card.icon)} />
            </svg>
          </div>
          <div class="text-xs opacity-80 mb-2">{card.subtitle}</div>
          <div class="text-xl font-bold">{card.value}</div>
        </div>
      {:else}
        <!-- Carte établissement -->
        <button
          on:click={() => handleCardClick(card.id)}
          class="text-left bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl {card.bgColor} {card.borderColor} {dossierFilter === card.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}"
          type="button"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm font-semibold text-gray-700">{card.title}</div>
            <svg class={`w-5 h-5 ${card.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconSvg(card.icon)} />
            </svg>
          </div>
          <div class="text-xs text-gray-500 mb-2">{card.subtitle}</div>
          <div class={`text-2xl font-bold ${card.textColor}`}>{card.value}</div>
          {#if dossierFilter === card.id}
            <div class="mt-2 w-full bg-gray-200 rounded-full h-1">
              <div class="bg-blue-600 h-1 rounded-full w-3/4"></div>
            </div>
          {/if}
        </button>
      {/if}
    {/each}
  </div>

  <!-- Contenu principal -->
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <!-- En-tête avec filtres et export -->
    <div class="border-b border-gray-200 p-6">
      <div class="flex items-center {showProfessionFilter ? 'justify-between' : 'justify-end'} gap-4">
        <!-- Filtres alignés à gauche - seulement affichés si showProfessionFilter est true -->
        {#if showProfessionFilter}
          <div class="flex space-x-4">
            <div class="w-64">
              <label for="profession" class="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par profession
              </label>
              <select
                id="profession"
                class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                on:change={handleProfessionChange}
                disabled={!dataLoaded}
              >
                <option value="">Toutes les professions</option>
                {#each professions as profession}
                  <option value={profession.id}>{profession.libelle}</option>
                {/each}
              </select>
            </div>

            <div class="w-64">
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par statut
              </label>
              <select
                id="status"
                class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                on:change={handleStatusChange}
                disabled={!dataLoaded}
              >
                {#each statusOptions as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
            </div>
          </div>
        {:else}
          <!-- Espace vide pour maintenir l'alignement quand les filtres sont cachés -->
          <div class="flex-1"></div>
        {/if}

        <!-- Boutons d'export alignés à droite -->
        <div class="flex gap-3 items-end">
          <Pdf
            title={dossierFilter === 'etablissement'
              ? 'Liste des établissements'
              : 'Liste des dossiers'
            }
            headers={dossierFilter === 'etablissement'
              ? ['Entité Juridique', 'Email', 'Téléphone/Adresse', 'Créé le']
              : ['N°', 'Nom & Prénoms', 'Téléphone/Adresse', 'Email', 'Profession / Entité Juridique', 'Statut']}
            data={filteredProfessionnels}
            type={dossierFilter}
            disabled={!dataLoaded || filteredProfessionnels.length === 0}
          />

          <CsvExporter
            title={dossierFilter === 'etablissement'
              ? 'Liste des établissements'
              : 'Liste des dossiers'
            }
            headers={dossierFilter === 'etablissement'
              ? ['Entité Juridique', 'Email', 'Téléphone/Adresse', 'Créé le']
              : ['Nom & Prénoms', 'Email', 'Téléphone/Adresse', 'Profession / Entité Juridique', 'Statut']}
            data={filteredProfessionnels}
            typeUser={dossierFilter}
            type={dossierFilter}
            disabled={!dataLoaded || filteredProfessionnels.length === 0}
          />
        </div>
      </div>
    </div>

    <!-- Tableau -->
    <div class="p-6">
      {#if loading && !dataLoaded}
        <LoaderTable colspan={6} message="Chargement des données en cours..." />
      {:else if !dataLoaded}
        <div class="text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg font-medium text-gray-500 mb-2">Données non chargées</p>
          <button 
            on:click={fetchInitialData}
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Recharger les données
          </button>
        </div>
      {:else if paginatedData.length === 0}
        <div class="text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg font-medium text-gray-500 mb-2">Aucun résultat trouvé</p>
          <p class="text-sm text-gray-400">
            {dossierFilter === 'etablissement' 
              ? 'Aucun établissement trouvé' 
              : 'Aucune donnée ne correspond aux critères de filtrage actuels'}
          </p>
        </div>
      {:else}
        <div class="overflow-x-auto rounded-xl border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <HeaderTable afficheAction={false}
              item={dossierFilter === 'etablissement'
                ? ['Entité Juridique', 'Email', 'Téléphone/Adresse', 'Créé le']
                : ['N°', 'Nom & Prénoms', 'Téléphone/Adresse', 'Email', 'Profession / Entité Juridique', 'Statut']} 
            />
            
            <tbody class="text-gray-700">
              {#each paginatedData as item, index}
                <tr class="hover:bg-gray-50 transition-colors duration-150">
                  {#if dossierFilter === 'etablissement'}
                    <td class="px-4 text-[14px]  py-3 border border-gray-200 font-medium text-gray-900">
                      {item.personne?.typePersonne?.libelle ?? 'N/A'}
                    </td>
                    <td class="px-4 text-[14px]  py-3 border border-gray-200 text-gray-500">{item.email ?? 'N/A'}</td>
                    <td class="px-4 text-[14px]  py-3 border border-gray-200 text-gray-500">
                      {item.personne?.telephone ? item.personne.telephone : item.personne.adresse ? item.personne.adresse : item.personne.number}
                    </td>
                    <td class="px-4 text-[14px]  py-3 border border-gray-200 text-gray-500">
                      {item.created_at ? new Date(item.personne.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                  {:else}
                    <td class="px-4 text-[14px]  py-3 border border-gray-200 font-medium text-gray-900">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td class="px-4 text-[14px]  py-3 border border-gray-200 font-medium text-gray-900">
                      {item.personne?.nom ? item.personne.nom + ' ' + item.personne?.prenoms : item.personne.denomination}
                    </td>
                    <td class="px-4 text-[14px]  py-3 border border-gray-200 text-gray-500">
                      {item.personne?.telephone ? item.personne.telephone : item.personne.adresse ? item.personne.adresse : item.personne.number}
                    </td>
                    <td class="px-4 text-[14px]  py-3 border border-gray-200 text-gray-500">
                      {item.personne?.email ?? item.email}
                    </td>
                    <td class="px-4 text-[14px]  py-3 border border-gray-200 text-gray-500">
                     {item.personne?.profession ? item.personne?.profession?.libelle : item.personne?.typePersonne ? item.personne?.typePersonne?.libelle : 'N/A'}
                    </td>
                    <td class="px-4 text-[14px]  py-3 border border-gray-200 text-gray-500">
                      {item.personne?.status ?? 'N/A'}
                    </td>
                  {/if}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        {#if totalPages > 1}
          <div class="mt-6">
            <Pagination
              {currentPage}
              {totalPages}
              {startRange}
              {endRange}
              {totalItems}
              on:pageChange={handlePageChange}
            />
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>

<style>
  .card-hover {
    transition: all 0.3s ease;
  }
  
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  button {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
</style>