<script lang="ts">
  import { onMount } from 'svelte';
  import type { StatsDashboard } from '../../types';
  import { apiFetch, BASE_URL_API } from '$lib/api';
  import Pdf from '$components/pdf/Pdf.svelte';
  import { Button, Select } from 'flowbite-svelte';
  import Pagination from '$components/Pagination.svelte';
  import CsvExporter from '$components/excel/CsvExporter.svelte';
  import Notification from '$components/_includes/Notification.svelte';
  import HeaderTable from '$components/_includes/HeaderTable.svelte';
  import LoaderTable from '$components/_includes/LoaderTable.svelte';
  import InputSimple from '$components/inputse/InputSimple.svelte';
  import InputSelect from '$components/inputse/InputSelect.svelte';

  export let data;
 
  $: notificationMessage = "";
  $: notificationType = "";
  $: showNotification = false;

  // Données réactives
  let main_data: StatsDashboard | null = null;
  let loading = false;
  let activeTab: 'professionnel' | 'etablissement' | 'pro' = 'professionnel';
  let currentPage = 1;
  const itemsPerPage = 10;
  let professionnels: any[] = [];
  let professionnelsAjour: any[] = [];
  let etablissements: any[] = [];
  let professions: any[] = [];
  let selectedProfession: string = '';
  let filteredProfessionnels: any[] = [];
  let filteredProfessionnelsAjour: any[] = [];
  let filteredEtablissements: any[] = [];

  // Date et heure
  let currentDate = new Date();
  let formattedDate = currentDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  let currentTime = currentDate.toLocaleTimeString('fr-FR');

  async function fetchInitialData() {
    loading = true;
    try {
      const [statsRes, proRes, etabRes, profRes] = await Promise.all([
        apiFetch(true, '/statistique/info-dashboard'),
        apiFetch(true, '/professionnel/'),
        apiFetch(true, '/etablissement/'),
        apiFetch(true, '/profession/'),
      ]);

      if (statsRes) main_data = statsRes.data;
      if (proRes) {
        professionnels = proRes.data || [];
        professionnelsAjour = professionnels.filter(
          (p) => p.personne?.status === 'a_jour'
        );
      }
      if (etabRes) etablissements = etabRes.data || [];
      if (profRes) professions = profRes.data || [];

      updateFilteredData();
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      loading = false;
    }
  }

  function updateFilteredData() {
    if (!selectedProfession || selectedProfession === '' || activeTab === 'etablissement') {
      // Pour les établissements, on ignore le filtre de profession
      filteredProfessionnels = professionnels;
      filteredProfessionnelsAjour = professionnelsAjour;
      filteredEtablissements = etablissements;
    } else {
      filteredProfessionnels = professionnels.filter((p) => {
        if (!p.personne || !p.personne.profession) return false;
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
    
    // Réinitialiser la page courante après filtrage
    currentPage = 1;
  }

  function handleProfessionChange(event: any) {
    selectedProfession = event.target?.value || '';
    updateFilteredData();
  }

  function handleCardClick(type: 'professionnel' | 'etablissement' | 'pro') {
    activeTab = type;
    currentPage = 1;
    
    // Si on clique sur établissement, on réinitialise le filtre de profession
    if (type === 'etablissement') {
      selectedProfession = '';
    }
    
    updateFilteredData();
  }

  onMount(() => {
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

  // Calculs réactifs pour la pagination et les totaux
  $: currentData = 
    activeTab === 'professionnel' ? filteredProfessionnels :
    activeTab === 'etablissement' ? filteredEtablissements :
    filteredProfessionnelsAjour;

  $: totalItems = currentData.length;
  $: totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Correction de la pagination - s'assurer que currentPage est valide
  $: if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }
  
  $: paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  $: startRange = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  $: endRange = Math.min(currentPage * itemsPerPage, totalItems);

  // Détermine si le filtre doit être affiché
  $: showProfessionFilter = activeTab !== 'etablissement';

  function handlePageChange(event: CustomEvent<number>) {
    currentPage = event.detail;
  }

  async function handleChangeStatus(id: any, status: string, reason: string = "") {
    try {
      const res = await fetch(BASE_URL_API + "/etablissement/active/" + id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: status,
          raison: reason
        })
      });

      if (res.ok) {
        notificationMessage = "Status mis à jour avec succès!";
        notificationType = "success";
        showNotification = true;
      }
    } catch (error) {
      notificationMessage = "Une erreur est survenue lors de l'enregistrement";
      notificationType = "error";
      showNotification = true;
      console.error("Error saving:", error);
    }
  }

  // Données pour les cartes avec les totaux CORRIGÉS
  $: cardData = [
    {
      id: 'visite',
      title: 'Visite total',
      subtitle: 'ce mois',
      value: '5',
      icon: 'calendar',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      showFilter: true
    },
    {
      id: 'pro',
      title: 'Professionnel(s)',
      subtitle: 'à jour',
      value: filteredProfessionnelsAjour.length,
      icon: 'user-check',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      showFilter: true
    },
    {
      id: 'professionnel',
      title: 'Professionnel(s)',
      subtitle: 'total',
      value: filteredProfessionnels.length,
      icon: 'users',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      showFilter: true
    },
    {
      id: 'etablissement',
      title: 'Etablissement(s)',
      subtitle: 'total',
      value: filteredEtablissements.length,
      icon: 'building',
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      showFilter: false // Pas de filtre pour les établissements
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
      isDatetime: true,
      showFilter: true
    }
  ];

  const getIconSvg = (icon: string) => {
    const icons: any = {
      calendar: `M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z`,
      'user-check': `M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z`,
      users: `M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z`,
      building: `M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4`,
      clock: `M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z`
    };
    return icons[icon] || '';
  };
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
      {:else if card.id === 'visite'}
        <!-- Carte Visite (statique) -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm font-semibold text-gray-600">{card.title}</div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconSvg(card.icon)} />
            </svg>
          </div>
          <div class="text-xs text-gray-400 mb-2">{card.subtitle}</div>
          <div class="text-2xl font-bold text-blue-600">{card.value}</div>
        </div>
      {:else}
        <!-- Cartes cliquables -->
        <button
          on:click={() => handleCardClick(card.id as any)}
          class="text-left bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl {card.bgColor} {card.borderColor} {activeTab === card.id ? 'ring-2 ring-offset-2 ' + (card.color === 'green' ? 'ring-green-500' : card.color === 'purple' ? 'ring-purple-500' : 'ring-orange-500') : ''}"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm font-semibold text-gray-700">{card.title}</div>
            <svg class={`w-5 h-5 ${card.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconSvg(card.icon)} />
            </svg>
          </div>
          <div class="text-xs text-gray-500 mb-2">{card.subtitle}</div>
          <div class={`text-2xl font-bold ${card.textColor}`}>{card.value}</div>
          {#if activeTab === card.id}
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
    <!-- En-tête avec filtre et export -->
    <div class="border-b border-gray-200 p-6">
      <div class="flex items-center {showProfessionFilter ? 'justify-between' : 'justify-end'} gap-4">
        <!-- Filtre aligné à gauche - seulement affiché si showProfessionFilter est true -->
        {#if showProfessionFilter}
          <div class="flex-1 max-w-md">
            <label for="profession" class="block text-sm font-medium text-gray-700 mb-2">
              Filtrer par profession
            </label>
            <select
              id="profession"
              class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
              on:change={handleProfessionChange}
            >
              <option value="" selected={selectedProfession === ''}>
                Toutes les professions
              </option>
              {#each professions as profession}
                <option value={profession.id} selected={selectedProfession === profession.id}>
                  {profession.libelle}
                </option>
              {/each}
            </select>
          </div>
        {:else}
          <!-- Espace vide pour maintenir l'alignement quand le filtre est caché -->
          <div class="flex-1"></div>
        {/if}

        <!-- Boutons d'export alignés à droite -->
        <div class="flex gap-3 items-end">
          <Pdf
            title={activeTab === 'professionnel'
              ? selectedProfession && showProfessionFilter
                ? `Liste des professionnels - ${professions.find((p) => p.id === selectedProfession)?.libelle || ''}`
                : 'Liste des professionnels'
              : activeTab === 'etablissement'
                ? 'Liste des établissements'
                : selectedProfession && showProfessionFilter
                  ? `Liste des professionnels à jour - ${professions.find((p) => p.id === selectedProfession)?.libelle || ''}`
                  : 'Liste des professionnels à jour'}
            headers={activeTab === 'professionnel' || activeTab === 'pro'
              ? ['Nom', 'Prénoms', 'Téléphone', 'Email', 'Profession']
              : ['Entité Juridique', 'Email', 'Imputation', 'Créé le']}
            data={currentData}
            type={activeTab}
          />

          <CsvExporter
            title={activeTab === 'professionnel'
              ? selectedProfession && showProfessionFilter
                ? `Liste des professionnels - ${professions.find((p) => p.id === selectedProfession)?.libelle || ''}`
                : 'Liste des professionnels'
              : activeTab === 'etablissement'
                ? 'Liste des établissements'
                : selectedProfession && showProfessionFilter
                  ? `Liste des professionnels à jour - ${professions.find((p) => p.id === selectedProfession)?.libelle || ''}`
                  : 'Liste des professionnels à jour'}
            headers={activeTab === 'professionnel' || activeTab === 'pro'
              ? ['Nom', 'Prénoms', 'Email', 'Téléphone', 'Profession']
              : ['Entité Juridique', 'Email', 'Imputation', 'Créé le']}
            data={currentData}
            typeUser={activeTab}
            type={activeTab}
          />
        </div>
      </div>
    </div>

    <!-- Tableau -->
    <div class="p-6">
      {#if loading}
        <LoaderTable colspan={5} />
      {:else}
        <div class="overflow-x-auto rounded-xl border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <HeaderTable afficheAction={false}
              item={activeTab === 'professionnel' || activeTab === 'pro'
                ? ['Nom', 'Prénoms', 'Téléphone', 'Email', 'Profession']
                : ['Entité Juridique', 'Email', 'Imputation', 'Créé le']} 
            />
            
            <tbody class="bg-white divide-y divide-gray-200">
              {#if paginatedData.length === 0}
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center text-gray-500">
                      <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-lg font-medium mb-2">Aucun résultat trouvé</p>
                      <p class="text-sm">
                        {activeTab === 'etablissement' 
                          ? 'Aucun établissement trouvé' 
                          : 'Aucune donnée ne correspond aux critères de filtrage actuels'}
                      </p>
                    </div>
                  </td>
                </tr>
              {:else}
                {#each paginatedData as item}
                  <tr class="hover:bg-gray-50 transition-colors duration-150">
                    {#if activeTab === 'professionnel' || activeTab === 'pro'}
                      <td class="px-6 py-4 text-sm font-medium text-gray-900">{item.personne?.nom ?? 'N/A'}</td>
                      <td class="px-6 py-4 text-sm text-gray-500">{item.personne?.prenoms ?? 'N/A'}</td>
                      <td class="px-6 py-4 text-sm text-gray-500">{item.personne?.number ?? 'N/A'}</td>
                      <td class="px-6 py-4 text-sm text-gray-500">{item.personne?.email ?? 'N/A'}</td>
                      <td class="px-6 py-4 text-sm text-gray-500">{item.personne?.profession?.libelle ?? 'N/A'}</td>
                    {:else}
                      <td class="px-6 py-4 text-sm font-medium text-gray-900">{item.personne?.profession ? item.personne?.profession?.libelle : item.personne?.typePersonne ? item.personne?.typePersonne?.libelle : 'N/A'}</td>
                      <td class="px-6 py-4 text-sm text-gray-500">{item.email ?? 'N/A'}</td>
                      <td class="px-6 py-4 text-sm text-gray-500">{item.personne?.imputationData?.username ?? 'N/A'}</td>
                      <td class="px-6 py-4 text-sm text-gray-500">{item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : 'N/A'}</td>
                    {/if}
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>

        <!-- Pagination CORRIGÉE -->
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

{#if showNotification}
  <Notification
    message={notificationMessage}
    type={notificationType}
    duration={5000}
  />
{/if}

<style>
  .card-hover {
    transition: all 0.3s ease;
  }
  
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
</style>