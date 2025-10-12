<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';
  import { formatAmount } from '$lib/formatAmount';
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
    montantTotal: 0,
    nombreSuccess: 0,
    nombreFail: 0,
    toDayTransactionFail: 0,
    toDayTransactionSuccess: 0,
  };

  // Données réactives
  let main_data: any = null;
  let loading = false;
  let dataLoaded = false;
  let currentPage = 1;
  const itemsPerPage = 10;
  let professionnels: any[] = [];
  let professionnelsAjour: any[] = [];
  let etablissements: any[] = [];
  let professions: any[] = [];
  let selectedProfession: string = '';
  let selectedStatus: string = '';
  let filteredProfessionnels: any[] = [];
  let filteredProfessionnelsAjour: any[] = [];
  let filteredEtablissements: any[] = [];
  let showAmount = false;

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

  // Onglets actifs
  let activeTab: 'professionnel' | 'etablissement' | 'pro' = 'professionnel';

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
    fetchStats();

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

  async function fetchStats() {
    try {
      const response = await apiFetch(
        true,
        `/statistique/info-dashboard/by/typeuser/${userType}/${userId}`
      );

      if (response && response.data) {
        stats = {
          montantTotal: response.data.montantTotal || 0,
          nombreSuccess: response.data.nombreSuccess || 0,
          nombreFail: response.data.nombreFail || 0,
          toDayTransactionFail: response.data.toDayTransactionFail || 0,
          toDayTransactionSuccess: response.data.toDayTransactionSuccess || 0,
        };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
    }
  }

  async function fetchInitialData() {
    if (dataLoaded && professionnels.length > 0) return;
    
    loading = true;
    try {
      const [proRes, etabRes, profRes] = await Promise.all([
        apiFetch(true, '/professionnel/').catch(() => ({ data: [] })),
        apiFetch(true, '/etablissement/').catch(() => ({ data: [] })),
        apiFetch(true, '/profession/').catch(() => ({ data: [] })),
      ]);

      if (proRes?.data) {
        professionnels = proRes.data;
        professionnelsAjour = professionnels.filter(
          (p) => p.personne?.status === 'a_jour'
        );
      }

      if (etabRes?.data) {
        etablissements = etabRes.data;
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
    
    // Filtrer par profession
    if (!selectedProfession || selectedProfession === '') {
      filteredProfessionnels = professionnels;
      filteredProfessionnelsAjour = professionnelsAjour;
      filteredEtablissements = etablissements;
    } else {
      filteredProfessionnels = professionnels.filter((p) => {
        if (!p.personne) return false;
        if (!p.personne.profession) return false;
        return String(p.personne.profession.id) === String(selectedProfession);
      });

      filteredProfessionnelsAjour = professionnelsAjour.filter((p) => {
        if (!p.personne || !p.personne.profession) return false;
        return String(p.personne.profession.id) === String(selectedProfession);
      });

      filteredEtablissements = etablissements.filter((e) => {
        if (!e.personne || !e.personne.profession) return false;
        return String(e.personne.profession.id) === String(selectedProfession);
      });
    }

    // Appliquer le filtre de statut si sélectionné
    if (selectedStatus) {
      filteredProfessionnels = filteredProfessionnels.filter(
        (p) => p.personne?.status === selectedStatus
      );
      filteredProfessionnelsAjour = filteredProfessionnelsAjour.filter(
        (p) => p.personne?.status === selectedStatus
      );
      filteredEtablissements = filteredEtablissements.filter(
        (e) => e.personne?.status === selectedStatus
      );
    }
    
    if (currentPage !== 1) {
      currentPage = 1;
    }
  }

  function toggleAmount() {
    showAmount = !showAmount;
  }

  function handleProfessionChange(event: any) {
    selectedProfession = event.target?.value || '';
    updateFilteredData();
  }

  function handleStatusChange(event: any) {
    selectedStatus = event.target?.value || '';
    updateFilteredData();
  }

  function handleTabChange(tab: 'professionnel' | 'etablissement' | 'pro') {
    activeTab = tab;
    currentPage = 1;
  }

  function handlePageChange(event: CustomEvent<number>) {
    currentPage = event.detail;
  }

  // Données pour les cartes - adaptées aux statistiques de transactions
  $: cardData = [
    {
      id: 'montant',
      title: 'Montant Total',
      subtitle: 'Cumul des transactions',
      value: showAmount ? `${stats.montantTotal.toLocaleString('fr-FR')} FCFA` : '••••••• FCFA',
      icon: 'currency',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      hasToggle: true
    },
    {
      id: 'success',
      title: 'Transactions réussies',
      subtitle: 'Total historique',
      value: stats.nombreSuccess.toString(),
      icon: 'check-circle',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'fail',
      title: 'Transactions échouées',
      subtitle: 'Total historique',
      value: stats.nombreFail.toString(),
      icon: 'x-circle',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      id: 'today-success',
      title: 'Réussies aujourd\'hui',
      subtitle: 'Ce jour',
      value: stats.toDayTransactionSuccess.toString(),
      icon: 'check',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      id: 'today-fail',
      title: 'Échouées aujourd\'hui',
      subtitle: 'Ce jour',
      value: stats.toDayTransactionFail.toString(),
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
      currency: `M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z`,
      'check-circle': `M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z`,
      'x-circle': `M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z`,
      check: `M5 13l4 4L19 7`,
      x: `M6 18L18 6M6 6l12 12`,
      clock: `M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z`,
      folder: `M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z`
    };
    return icons[icon] || '';
  };

  // Calculs réactifs pour la pagination
  $: currentData = activeTab === 'professionnel' 
    ? filteredProfessionnels 
    : activeTab === 'etablissement' 
      ? filteredEtablissements 
      : filteredProfessionnelsAjour;

  $: totalItems = currentData.length;
  $: totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  $: if (currentPage > totalPages && totalPages > 0) {
    currentPage = Math.max(1, totalPages);
  }
  
  $: paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  $: startRange = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  $: endRange = Math.min(currentPage * itemsPerPage, totalItems);

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

  <!-- Grille de cartes améliorée -->
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
      {:else if card.id === 'montant'}
        <!-- Carte Montant avec toggle -->
        <div class="text-left bg-white rounded-xl shadow-lg p-4 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl {card.bgColor} {card.borderColor}">
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs font-semibold text-gray-700 truncate">{card.title}</div>
            <div class="flex items-center">
              <button
                on:click={toggleAmount}
                class="text-gray-500 hover:text-gray-700 mr-2 transition-colors"
                type="button"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {#if showAmount}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  {:else}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  {/if}
                </svg>
              </button>
              <svg class={`w-4 h-4 ${card.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconSvg(card.icon)} />
              </svg>
            </div>
          </div>
          <div class="text-xs text-gray-500 mb-2">{card.subtitle}</div>
          <div class={`text-lg font-bold ${card.textColor}`}>{card.value}</div>
        </div>
      {:else}
        <!-- Cartes normales -->
        <div class="text-left bg-white rounded-xl shadow-lg p-4 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl {card.bgColor} {card.borderColor}">
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs font-semibold text-gray-700 truncate">{card.title}</div>
            <svg class={`w-4 h-4 ${card.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconSvg(card.icon)} />
            </svg>
          </div>
          <div class="text-xs text-gray-500 mb-2">{card.subtitle}</div>
          <div class={`text-lg font-bold ${card.textColor}`}>{card.value}</div>
        </div>
      {/if}
    {/each}
  </div>

  <!-- Onglets de navigation -->
<div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border border-gray-100">
  <div class="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
    <nav class="flex -mb-px">
      <button
        class="relative py-5 px-8 text-center font-medium text-sm transition-all duration-300 group flex-1 min-w-0 {activeTab === 'professionnel' 
          ? 'text-blue-600 bg-white border-b-2 border-blue-500 shadow-sm' 
          : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50 border-b-2 border-transparent'}"
        on:click={() => handleTabChange('professionnel')}
      >
        <div class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4 {activeTab === 'professionnel' ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400'}" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Tous les professionnels</span>
        </div>
        {#if activeTab === 'professionnel'}
          <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full -mb-1.5 shadow-lg shadow-blue-200"></div>
        {/if}
      </button>

      <button
        class="relative py-5 px-8 text-center font-medium text-sm transition-all duration-300 group flex-1 min-w-0 {activeTab === 'etablissement' 
          ? 'text-blue-600 bg-white border-b-2 border-blue-500 shadow-sm' 
          : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50 border-b-2 border-transparent'}"
        on:click={() => handleTabChange('etablissement')}
      >
        <div class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4 {activeTab === 'etablissement' ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400'}" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>Établissements</span>
        </div>
        {#if activeTab === 'etablissement'}
          <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full -mb-1.5 shadow-lg shadow-blue-200"></div>
        {/if}
      </button>

      <button
        class="relative py-5 px-8 text-center font-medium text-sm transition-all duration-300 group flex-1 min-w-0 {activeTab === 'pro' 
          ? 'text-blue-600 bg-white border-b-2 border-blue-500 shadow-sm' 
          : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50 border-b-2 border-transparent'}"
        on:click={() => handleTabChange('pro')}
      >
        <div class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4 {activeTab === 'pro' ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400'}" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Professionnels à jour</span>
        </div>
        {#if activeTab === 'pro'}
          <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full -mb-1.5 shadow-lg shadow-blue-200"></div>
        {/if}
      </button>
    </nav>
  </div>
</div>

  <!-- Contenu principal -->
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <!-- En-tête avec filtres et export -->
    <div class="border-b border-gray-200 p-6">
      <div class="flex items-center justify-between gap-4">
        <!-- Filtres alignés à gauche -->
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

        <!-- Boutons d'export alignés à droite -->
        <div class="flex gap-3 items-end">
          <Pdf
            title={activeTab === 'professionnel'
              ? selectedProfession
                ? `Liste des professionnels - ${professions.find((p) => p.id === Number(selectedProfession))?.libelle || ''}`
                : 'Liste des professionnels'
              : activeTab === 'etablissement'
                ? selectedProfession
                  ? `Liste des établissements - ${professions.find((p) => p.id === Number(selectedProfession))?.libelle || ''}`
                  : 'Liste des établissements'
                : selectedProfession
                  ? `Liste des professionnels à jour - ${professions.find((p) => p.id === Number(selectedProfession))?.libelle || ''}`
                  : 'Liste des professionnels à jour'}
            headers={activeTab === 'professionnel' || activeTab === 'pro'
              ? ['N°', 'Nom', 'Prénoms', 'Téléphone', 'Email', 'Profession']
              : ['N°', 'Nom', 'Adresse', 'Téléphone', 'Email', 'Profession']}
            data={currentData}
            type={activeTab}
            disabled={!dataLoaded || currentData.length === 0}
          />

          <CsvExporter
            title={activeTab === 'professionnel'
              ? selectedProfession
                ? `Liste des professionnels - ${professions.find((p) => p.id === Number(selectedProfession))?.libelle || ''}`
                : 'Liste des professionnels'
              : activeTab === 'etablissement'
                ? selectedProfession
                  ? `Liste des établissements - ${professions.find((p) => p.id === Number(selectedProfession))?.libelle || ''}`
                  : 'Liste des établissements'
                : selectedProfession
                  ? `Liste des professionnels à jour - ${professions.find((p) => p.id === Number(selectedProfession))?.libelle || ''}`
                  : 'Liste des professionnels à jour'}
            headers={activeTab === 'professionnel' || activeTab === 'pro'
              ? ['Nom', 'Prénoms', 'Email', 'Téléphone', 'Profession']
              : ['Nom', 'Adresse', 'Téléphone', 'Email', 'Profession']}
            data={currentData}
            typeUser={activeTab}
            type={activeTab}
            disabled={!dataLoaded || currentData.length === 0}
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
            Aucune donnée ne correspond aux critères de filtrage actuels
          </p>
        </div>
      {:else}
        <div class="overflow-x-auto rounded-xl border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <HeaderTable 
              afficheAction={false}
              item={activeTab === 'professionnel' || activeTab === 'pro'
                ? ['N°', 'Nom', 'Prénoms', 'Téléphone', 'Email', 'Profession']
                : ['N°', 'Nom', 'Adresse', 'Téléphone', 'Email', 'Profession']} 
            />
            
            <tbody class="text-gray-700">
              {#each paginatedData as item, index}
                <tr class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="px-4 text-[14px]  py-3 border border-gray-200 font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td class="px-4 text-[14px]  py-3 border border-gray-200 font-medium text-gray-900">
                    {item.personne?.nom ?? item.username ?? 'N/A'}
                  </td>
                  {#if activeTab === 'professionnel' || activeTab === 'pro'}
                    <td class="px-4 text-[14px]  py-3 border border-gray-200 text-gray-500">
                      {item.personne?.prenoms ?? 'N/A'}
                    </td>
                  {:else}
                    <td class="px-4 text-[14px]  py-3 border border-gray-200 text-gray-500">
                      {item.adresse ?? 'N/A'}
                    </td>
                  {/if}
                  <td class="px-4 text-[14px]  py-3 border border-gray-200 text-gray-500">
                    {item.personne?.number ?? item.number ?? 'N/A'}
                  </td>
                  <td class="px-4 text-[14px]  py-3 border border-gray-200 text-gray-500">
                    {item.personne?.email ?? item.email ?? 'N/A'}
                  </td>
                  <td class="px-4 text-[14px]  py-3 border border-gray-200 text-gray-500">
                    {item.personne?.profession?.libelle ?? 'N/A'}
                  </td>
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