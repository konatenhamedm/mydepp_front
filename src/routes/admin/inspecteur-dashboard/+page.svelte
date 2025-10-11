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
  import InputSimple from '$components/inputse/InputSimple.svelte';
  import InputSelect from '$components/inputse/InputSelect.svelte';

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
  let dossierFilter = "etablissement";
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

  // Fonctions
  onMount(() => {
    user = getAuthCookie();
    console.log('User from cookie:', user);

    if (user) {
      userType = user.type;
      userId = user.id;
      fetchUserStats();
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
    loading = true;
    try {
      let statsUrl = '/statistique/info-dashboard';
      if (userType && userId) {
        statsUrl = `/statistique/info-dashboard/by/typeuser/${userType}/${userId}`;
      }

      const [statsRes, listeProfessionnels, profRes, allEtab] = await Promise.all([
        apiFetch(true, statsUrl),
        apiFetch(true, `/professionnel/`),
        apiFetch(true, '/profession/'),
        apiFetch(true, '/etablissement/'),
      ]);

      allEtab2 = allEtab.data || [];

      if (statsRes && statsRes.data) {
        stats = {
          ...stats,
          ...statsRes.data,
        };
      }

      if (listeProfessionnels) {
        professionnels = listeProfessionnels.data || [];
      }

      if (profRes) {
        professions = profRes.data || [];
      }

      updateFilteredData();
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      loading = false;
    }
  }

  function updateFilteredData() {
    let tempData = [];

    if (dossierFilter === 'etablissement') {
      tempData = allEtab2;
    } else {
      tempData = professionnels.filter((p) =>
        dossierFilter === 'all'
          ? true
          : dossierFilter === 'accepted'
          ? p.personne?.status === 'accepte'
          : dossierFilter === 'rejected'
          ? p.personne?.status === 'rejete'
          : dossierFilter === 'attente'
          ? p.personne?.status === 'en_attente'
          : dossierFilter === 'validated'
          ? p.personne?.status === 'valide'
          : dossierFilter === 'a_jour'
          ? p.personne?.status === 'a_jour'
          : dossierFilter === 'refuse'
          ? p.personne?.status === 'refuse'
          : dossierFilter === 'renew'
          ? p.personne?.status === 'renouvellement'
          : true
      );
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
    currentPage = 1; // Réinitialiser à la première page après filtrage
  }

  function handleProfessionChange(event: any) {
    selectedProfession = event.target.value;
    updateFilteredData();
  }

  function handleStatusChange(event: any) {
    selectedStatus = event.target.value;
    updateFilteredData();
  }

  function handleCardClick(type: any) {
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

  // Données pour les cartes
  $: cardData = [
    {
      id: 'etablissement',
      title: 'Etablissement',
      subtitle: 'Statistique actuelle',
      value: allEtab2.length,
      icon: 'building',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'attente',
      title: 'Dossiers en attente',
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
      title: 'Dossiers acceptés',
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
      title: 'Dossiers rejetés',
      subtitle: 'Statistique actuelle',
      value: stats.rejete,
      icon: 'x',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      id: 'datetime',
      title: 'Date & Heure',
      subtitle: `à ${currentTime}`,
      value: formattedDate,
      icon: 'calendar',
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
      clock: `M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z`,
      check: `M5 13l4 4L19 7`,
      x: `M6 18L18 6M6 6l12 12`,
      calendar: `M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z`
    };
    return icons[icon] || '';
  };

  // Calculs réactifs pour la pagination
  $: totalItems = filteredProfessionnels.length;
  $: totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  $: if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }
  
  $: paginatedData = filteredProfessionnels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  $: startRange = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  $: endRange = Math.min(currentPage * itemsPerPage, totalItems);

  // Détermine si le filtre de profession doit être affiché
  $: showProfessionFilter = dossierFilter !== 'etablissement';
</script>

<div class="ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]">
  <!-- Grille de cartes améliorée -->
  <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
        <!-- Cartes cliquables -->
        <button
          on:click={() => handleCardClick(card.id)}
          class="text-left bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl {card.bgColor} {card.borderColor} {dossierFilter === card.id ? 'ring-2 ring-offset-2 ' + (card.color === 'green' ? 'ring-green-500' : card.color === 'yellow' ? 'ring-yellow-500' : card.color === 'red' ? 'ring-red-500' : 'ring-blue-500') : ''}"
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
              : `Liste des ${dossierFilter === 'accepted' ? 'dossiers acceptés' : 
                 dossierFilter === 'rejected' ? 'dossiers rejetés' : 
                 dossierFilter === 'attente' ? 'dossiers en attente' : 
                 'professionnels'}`
            }
            headers={dossierFilter === 'etablissement'
              ? ['Entité Juridique', 'Email', 'Téléphone/Adresse', 'Créé le']
              : ['N°', 'Nom & Prénoms', 'Téléphone/Adresse', 'Email', 'Profession / Entité Juridique', 'Statut']}
            data={filteredProfessionnels}
            type={dossierFilter}
          />

          <CsvExporter
            title={dossierFilter === 'etablissement'
              ? 'Liste des établissements'
              : `Liste des ${dossierFilter === 'accepted' ? 'dossiers acceptés' : 
                 dossierFilter === 'rejected' ? 'dossiers rejetés' : 
                 dossierFilter === 'attente' ? 'dossiers en attente' : 
                 'professionnels'}`
            }
            headers={dossierFilter === 'etablissement'
              ? ['Entité Juridique', 'Email', 'Téléphone/Adresse', 'Créé le']
              : ['Nom', 'Prénoms', 'Email', 'Téléphone', 'Profession', 'Statut']}
            data={filteredProfessionnels}
            typeUser={dossierFilter}
            type={dossierFilter}
          />
        </div>
      </div>
    </div>

    <!-- Tableau -->
    <div class="p-6">
      {#if loading}
        <LoaderTable colspan={6} />
      {:else}
        <div class="overflow-x-auto rounded-xl border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <HeaderTable afficheAction={false}
              item={dossierFilter === 'etablissement'
                ? ['Entité Juridique', 'Email', 'Téléphone/Adresse', 'Créé le']
                : ['N°', 'Nom & Prénoms', 'Téléphone/Adresse', 'Email', 'Profession / Entité Juridique', 'Statut']} 
            />
            
            <tbody class="bg-white divide-y divide-gray-200">
              {#if paginatedData.length === 0}
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center text-gray-500">
                      <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-lg font-medium mb-2">Aucun résultat trouvé</p>
                      <p class="text-sm">
                        {dossierFilter === 'etablissement' 
                          ? 'Aucun établissement trouvé' 
                          : 'Aucune donnée ne correspond aux critères de filtrage actuels'}
                      </p>
                    </div>
                  </td>
                </tr>
              {:else}
                {#each paginatedData as item, index}
                  <tr class="hover:bg-gray-50 transition-colors duration-150">
                    {#if dossierFilter === 'etablissement'}
                      <td class="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.personne?.typePersonne?.libelle ?? 'N/A'}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500">{item.email ?? 'N/A'}</td>
                      <td class="px-6 py-4 text-sm text-gray-500">
                        {item.personne?.telephone ? item.personne.telephone : item.personne.adresse ? item.personne.adresse : item.personne.number}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                      </td>
                    {:else}
                      <td class="px-6 py-4 text-sm font-medium text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td class="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.personne?.nom ? item.personne.nom + ' ' + item.personne?.prenoms : item.personne.denomination}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500">
                        {item.personne?.telephone ? item.personne.telephone : item.personne.adresse ? item.personne.adresse : item.personne.number}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500">
                        {item.personne?.email ?? item.email}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500">
                        {item.personne?.profession ? item.personne?.profession?.libelle : item.personne?.typePersonne ? item.personne?.typePersonne?.libelle : 'N/A'}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500">
                        {item.personne?.status ?? 'N/A'}
                      </td>
                    {/if}
                  </tr>
                {/each}
              {/if}
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
</style>