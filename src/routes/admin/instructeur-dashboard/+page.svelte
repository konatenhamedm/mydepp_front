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
  let dataLoaded = false; // Nouveau flag pour suivre le chargement initial
  let dossierFilter = "all";
  let currentPage = 1;
  const itemsPerPage = 10;
  let professionnels: any[] = [];
  let allEtab2: any[] = [];
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
    
    console.log("nzlkhlkz", userId);
    // Chargement initial des données
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
    // Ne recharger que si les données ne sont pas déjà chargées
    if (dataLoaded && professionnels.length > 0) return;
    
    loading = true;
    try {
      let statsUrl = '/statistique/info-dashboard';
      if (userType && userId) {
        statsUrl = `/statistique/info-dashboard/by/typeuser/${userType}/${userId}`;
      }

      // Chargement parallèle optimisé
      const [statsRes, listeProfessionnels, profRes, allEtab] = await Promise.all([
        apiFetch(true, statsUrl).catch(() => null),
        apiFetch(true, `/professionnel/`).catch(() => ({ data: [] })),
        apiFetch(true, '/profession/').catch(() => ({ data: [] })),
        apiFetch(true, '/etablissement/').catch(() => ({ data: [] })),
      ]);

      allEtab2 = allEtab?.data || [];

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
      dataLoaded = true; // Marquer les données comme chargées
      
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      loading = false;
    }
  }

  // Fonction de filtrage optimisée
  function updateFilteredData() {
    if (!dataLoaded) return; // Ne pas filtrer si les données ne sont pas chargées
    
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
    
    // Réinitialiser la pagination seulement si nécessaire
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

  // Fonction corrigée pour le clic sur les cartes
  function handleCardClick(type: string) {
    console.log('Clic sur la carte:', type); // Debug
    dossierFilter = type;
    
    // Réinitialiser les filtres quand on change de type
    if (type === 'etablissement') {
      selectedProfession = '';
      selectedStatus = '';
    }
    
    updateFilteredData();
  }

  function handlePageChange(event: CustomEvent<number>) {
    currentPage = event.detail;
  }

  // Données pour les cartes - rendues réactives
  $: cardData = [
    {
      id: 'all',
      title: 'Tous les dossiers',
      subtitle: 'Statistique actuelle',
      value: stats.atttente + stats.accepte + stats.rejete + stats.valide + stats.refuse + stats.renouvelle + stats.a_jour + allEtab2.length,
      icon: 'folder',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'attente',
      title: 'En attente',
      subtitle: 'Statistique actuelle',
      value: stats.atttente,
      icon: 'clock',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'accepted',
      title: 'Acceptés',
      subtitle: 'Statistique actuelle',
      value: stats.accepte,
      icon: 'check',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      id: 'rejected',
      title: 'Rejetés',
      subtitle: 'Statistique actuelle',
      value: stats.rejete,
      icon: 'x',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      id: 'validated',
      title: 'Validés',
      subtitle: 'Statistique actuelle',
      value: stats.valide,
      icon: 'shield-check',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      id: 'a_jour',
      title: 'À jour',
      subtitle: 'Statistique actuelle',
      value: stats.a_jour,
      icon: 'calendar',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'etablissement',
      title: 'Etablissement',
      subtitle: 'Statistique actuelle',
      value: allEtab2.length,
      icon: 'building',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
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
      folder: `M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z`,
      clock: `M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z`,
      check: `M5 13l4 4L19 7`,
      x: `M6 18L18 6M6 6l12 12`,
      'shield-check': `M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z`,
      calendar: `M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z`,
      building: `M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4`
    };
    return icons[icon] || '';
  };

  // Calculs réactifs pour la pagination - optimisés
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

  // Réactivité pour mettre à jour les données filtrées quand les données sources changent
  $: if (dataLoaded) {
    updateFilteredData();
  }
</script>

<div class="sm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]">
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

  <!-- Grille de cartes améliorée -->
  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
    {#each cardData as card}
      {#if card.id === 'datetime'}
        <!-- Carte Date/Heure spéciale -->
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-4 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs font-semibold opacity-90">{card.title}</div>
            <svg class="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconSvg(card.icon)} />
            </svg>
          </div>
          <div class="text-xs opacity-80 mb-2">{card.subtitle}</div>
          <div class="text-lg font-bold">{card.value}</div>
        </div>
      {:else}
        <!-- Cartes cliquables - version corrigée -->
        <button
          on:click={() => handleCardClick(card.id)}
          class="text-left bg-white rounded-xl shadow-lg p-4 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl {card.bgColor} {card.borderColor} {dossierFilter === card.id ? 'ring-2 ring-offset-2 ' + (card.color === 'green' ? 'ring-green-500' : card.color === 'yellow' ? 'ring-yellow-500' : card.color === 'red' ? 'ring-red-500' : card.color === 'purple' ? 'ring-purple-500' : 'ring-blue-500') : ''}"
          type="button"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs font-semibold text-gray-700 truncate">{card.title}</div>
            <svg class={`w-4 h-4 ${card.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconSvg(card.icon)} />
            </svg>
          </div>
          <div class="text-xs text-gray-500 mb-2">{card.subtitle}</div>
          <div class={`text-lg font-bold ${card.textColor}`}>{card.value}</div>
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
              : dossierFilter === 'all'
              ? 'Liste de tous les dossiers'
              : `Liste des ${dossierFilter === 'accepted' ? 'dossiers acceptés' : 
                 dossierFilter === 'rejected' ? 'dossiers rejetés' : 
                 dossierFilter === 'attente' ? 'dossiers en attente' :
                 dossierFilter === 'validated' ? 'dossiers validés' :
                 dossierFilter === 'a_jour' ? 'dossiers à jour' : 
                 'dossiers'}`
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
              : dossierFilter === 'all'
              ? 'Liste de tous les dossiers'
              : `Liste des ${dossierFilter === 'accepted' ? 'dossiers acceptés' : 
                 dossierFilter === 'rejected' ? 'dossiers rejetés' : 
                 dossierFilter === 'attente' ? 'dossiers en attente' :
                 dossierFilter === 'validated' ? 'dossiers validés' :
                 dossierFilter === 'a_jour' ? 'dossiers à jour' : 
                 'dossiers'}`
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
            <HeaderTable  afficheAction
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
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : 'N/A'}
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

  /* Amélioration de la performance des animations */
  button {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
</style>