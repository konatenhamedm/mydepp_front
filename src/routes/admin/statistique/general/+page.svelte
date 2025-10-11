<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';
  import { getAuthCookie } from '$lib/auth';
  import InputSelectChart from '$components/inputs/InputSelectChart.svelte';
  import Donut from '$components/statistiques/Donut.svelte';
  import Pie from '$components/statistiques/Pie.svelte';
  import Hist1 from '$components/statistiques/histogrames/Hist1.svelte';
  import Hist2 from '$components/statistiques/histogrames/Hist2.svelte';
  import SkeletonChart from '$components/_skeletons/SkeletonChart.svelte';
  import TableauCroise from '$components/statistiques/TableauCroise.svelte';
  import Pyramide from '$components/statistiques/Pyramide.svelte';
  import type { Stats } from '../../../../types';
  import Abercrome from '$components/_includes/Abercrome.svelte';


  // Données réactives
  let main_data: Stats[] = [];
  let stats: any = [];
  let loading = false;
  let dataLoaded = false;

  // Filtres
  let periode: any = 'null';
  let annee: any = 'null';
  let mois: any = 'null';
  let tranche: any = 'null';

  // Données pour les filtres
  const moisDatas = [
    { libelle: "Janvier", id: "1" },
    { libelle: "Février", id: "2" },
    { libelle: "Mars", id: "3" },
    { libelle: "Avril", id: "4" },
    { libelle: "Mai", id: "5" },
    { libelle: "Juin", id: "6" },
    { libelle: "Juillet", id: "7" },
    { libelle: "Août", id: "8" },
    { libelle: "Septembre", id: "9" },
    { libelle: "Octobre", id: "10" },
    { libelle: "Novembre", id: "11" },
    { libelle: "Décembre", id: "12" }
  ];

  const trimestres = [
    { libelle: "Premier trimestre", id: "1" },
    { libelle: "Deuxième trimestre", id: "2" },
    { libelle: "Troisième trimestre", id: "3" },
    { libelle: "Quatrième trimestre", id: "4" }
  ];

  const semestres = [
    { libelle: "Premier semestre", id: "1" },
    { libelle: "Deuxième semestre", id: "2" }
  ];

  // Fonctions optimisées
  onMount(async () => {
    await fetchInitialData();
  });

  async function fetchInitialData() {
    if (dataLoaded) return;
    
    loading = true;
    try {
      const res = await apiFetch(true, `/statistique/generale?periode=${periode}&annee=${annee}&mois=${mois}&tranche=${tranche}`);

      if (res) {
        main_data = res.data.nombre as Stats[];
        stats = res.data;
        dataLoaded = true;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      loading = false;
    }
  }

  async function appliquerFiltres() {
    dataLoaded = false;
    await fetchInitialData();
  }

  function resetFiltres() {
    periode = 'null';
    annee = 'null';
    mois = 'null';
    tranche = 'null';
    dataLoaded = false;
    fetchInitialData();
  }
</script>

<div class="ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]">
  <!-- En-tête -->
  <Abercrome titre="Statistiques" parent="Dashbord" current="Statistiques" />

  <!-- Indicateur de chargement global -->
  {#if loading && !dataLoaded}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 flex flex-col items-center">
        <svg class="animate-spin h-12 w-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-lg font-medium text-gray-700">Chargement des données statistiques...</p>
      </div>
    </div>
  {/if}

  <!-- Section des filtres améliorée -->
  <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Filtres de période</h2>
      <button
        on:click={resetFiltres}
        class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Réinitialiser
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 flex flex-wrap gap-4 items-end">
      <!-- Période -->
      <div>
        <InputSelectChart
          label="Période"
          bind:selectedId={periode}
          datas={[
            { libelle: "Mois", id: "mois" },
            { libelle: "Trimestre", id: "trimestre" },
            { libelle: "Semestre", id: "semestre" },
            { libelle: "Année", id: "annee" }
          ]}
          id="periode"
        />
      </div>
    
      <!-- Mois (si période = mois) -->
      {#if periode === 'mois'}
        <div>
          <InputSelectChart
            label="Mois"
            bind:selectedId={mois}
            datas={moisDatas}
            id="mois"
          />
        </div>
      {/if}
    
      <!-- Tranche Trimestre (si période = trimestre) -->
      {#if periode === 'trimestre'}
        <div>
          <InputSelectChart
            label="Trimestre"
            bind:selectedId={tranche}
            datas={trimestres}
            id="trimestre"
          />
        </div>
      {/if}
    
      <!-- Tranche Semestre (si période = semestre) -->
      {#if periode === 'semestre'}
        <div>
          <InputSelectChart
            label="Semestre"
            bind:selectedId={tranche}
            datas={semestres}
            id="semestre"
          />
        </div>
      {/if}
    
      <!-- Année (toujours affichée) -->
      <div>
        <InputSelectChart
          label="Année"
          bind:selectedId={annee}
          datas={stats.all_annees || []}
          id="annee"
        />
      </div>

      <!-- Bouton de recherche -->
      <button
        on:click={appliquerFiltres}
        class="bg-secondary border-secondary hover:bg-secondary-hbr inline-flex h-[40px] items-center justify-center gap-[6px] rounded-[6px] border-1 border-solid px-[5px] text-[14px] leading-[22px] font-semibold whitespace-nowrap text-white capitalize transition duration-300 ease-in-out"
        disabled={loading}
      >
        {#if loading}
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Chargement...</span>
        {:else}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Appliquer</span>
        {/if}
      </button>
    </div>
  </div>

  <!-- Grille de graphiques améliorée -->
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
  {#if loading && !dataLoaded}
    <!-- Squelettes de chargement -->
    {#each Array(6) as _, i}
      <div class="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <SkeletonChart />
      </div>
    {/each}
  {:else if !dataLoaded}
    <!-- État vide -->
    <div class="col-span-full text-center py-12">
      <svg
        class="w-16 h-16 text-gray-300 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <p class="text-lg font-medium text-gray-500 mb-2">Aucune donnée statistique</p>
      <p class="text-sm text-gray-400 mb-4">
        Les données statistiques n'ont pas encore été chargées
      </p>
      <button
        on:click={fetchInitialData}
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Charger les données
      </button>
    </div>
  {:else}
    <!-- ✅ 2 cartes par ligne, auto-responsive -->
    <div class="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
      <Hist1 data={stats.pays} container="container1" title="Répartition par pays" />
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
      <Hist2
        data={stats.professions}
        container="container2"
        title="Répartition par profession"
        subtitle="Professions"
        type="Professionnels"
      />
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
      <Hist1 data={stats.regions} container="container3" title="Répartition par région" />
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
      <Hist2
        data={stats.regions}
        container="container8"
        title="Répartition par région"
        subtitle="Régions"
        type="Professionnels"
      />
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
      <Hist1 data={stats.villes} container="container5" title="Répartition par ville" />
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
      <Hist2
        data={stats.annees}
        container="container6"
        title="Répartition par année"
        subtitle="Années"
        type="Professionnels"
      />
    </div>

    <!-- ✅ Pyramide sur deux colonnes -->
    <div
      class="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl sm:col-span-2"
    >
      <Pyramide apiData={stats} />
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
      <Hist2
        data={stats.tranches_age}
        container="container4"
        title="Répartition par tranche d'âge"
        subtitle="Tranches d'âge"
        type="Professionnels"
      />
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
      <Hist2
        data={stats.genres}
        container="container7"
        title="Répartition par civilité"
        subtitle="Civilités"
        type="Professionnels"
      />
    </div>

    <!-- ✅ Tableau croisé sur deux colonnes -->
    <div
      class="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl sm:col-span-2"
    >
      <TableauCroise apiData={stats} />
    </div>
  {/if}
</div>
</div>

<style>
  .grid > * {
    min-width: 0;
  }

  .transition {
    transition: all 0.3s ease;
  }
</style>
