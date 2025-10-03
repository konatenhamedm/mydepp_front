<script lang="ts">
  import Abercrome from '$components/_includes/Abercrome.svelte';
  import { onMount } from 'svelte';
  import {
    Chart, LineController, LineElement, PointElement, LinearScale,
    Title, CategoryScale, BarElement, BarController, PieController,
    ArcElement, Tooltip, Legend
  } from 'chart.js';
  import { apiFetch } from '$lib/api';
  import { Users, Store, ShoppingCart, BarChart3 } from 'lucide-svelte';
  import KpiCard from '$components/KpiCard.svelte';

  // --- data
  let dataRaw: any = null;
  let dataView: any = null;
  let loading = false;
  let error: string | null = null;

  // --- filtres
  let periode: 'mois' | 'trimestre' | 'semestre' | 'annee' = 'mois';
  let mois = '09';
  let tranche = '1';
  let annee = '2025';
  let anneesOptions: string[] = ['2024', '2025'];

  // --- charts
  let lineChart: HTMLCanvasElement;
  let cmdChart: HTMLCanvasElement;
  let barChart: HTMLCanvasElement;
  let pieChart: HTMLCanvasElement;
  let lineInstance: Chart | null = null;
  let cmdInstance: Chart | null = null;
  let barInstance: Chart | null = null;
  let pieInstance: Chart | null = null;

  const colors = ['#3b82f6','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16','#06b6d4'];

  // --- utils
  function extractYears(): string[] {
    const set = new Set<string>();
    const allDays: string[] = [
      ...(dataRaw?.ventes?.by_day?.map((d: any) => d.day) ?? []),
      ...(dataRaw?.commandes?.by_day?.map((d: any) => d.day) ?? []),
    ];
    for (const d of allDays) {
      const y = d?.slice(0, 4);
      if (y) set.add(y);
    }
    return Array.from(set).sort();
  }

  function monthsOfQuarter(q: string) {
    return { '1':['01','02','03'],'2':['04','05','06'],'3':['07','08','09'],'4':['10','11','12'] }[q] ?? [];
  }
  function monthsOfSemester(s: string) {
    return { '1':['01','02','03','04','05','06'],'2':['07','08','09','10','11','12'] }[s] ?? [];
  }

  function applyFiltersLocal() {
    if (!dataRaw) return;
    const out: any = JSON.parse(JSON.stringify(dataRaw));

    const filterDay = (day: string) => {
      if (!day) return false;
      const y = day.slice(0,4); const m = day.slice(5,7);
      if (y !== annee) return false;
      if (periode==='annee') return true;
      if (periode==='mois') return m===mois;
      if (periode==='trimestre') return monthsOfQuarter(tranche).includes(m);
      if (periode==='semestre') return monthsOfSemester(tranche).includes(m);
      return true;
    };

    const ventesDays = (dataRaw?.ventes?.by_day ?? []).filter((d:any)=>filterDay(d.day));
    out.ventes.by_day = ventesDays;
    out.ventes.nb = ventesDays.reduce((s:number,d:any)=>s+(d.nb||0),0);

    const cmdDays = (dataRaw?.commandes?.by_day ?? []).filter((d:any)=>filterDay(d.day));
    out.commandes.by_day = cmdDays;
    out.commandes.nb = cmdDays.reduce((s:number,d:any)=>s+(d.nb||0),0);

    dataView = out;
  }

  async function fetchDashboard() {
    loading = true; error = null;
    try {
      const res = await apiFetch(true, '/dashboard');
      if (!res) throw new Error("Réponse vide de l'API");
      dataRaw = res;
      const years = extractYears();
      if (years.length) { anneesOptions = years; if (!anneesOptions.includes(annee)) annee = anneesOptions.at(-1) as string; }
      applyFiltersLocal();
      setTimeout(updateCharts, 50);
    } catch (e:any) { error = e.message; } 
    finally { loading = false; }
  }

  function updateCharts() {
    if (!dataView) return;
    if (lineInstance) lineInstance.destroy();
    if (cmdInstance) cmdInstance.destroy();
    if (barInstance) barInstance.destroy();
    if (pieInstance) pieInstance.destroy();

    // ventes
    lineInstance = new Chart(lineChart, {
      type: 'line',
      data: { labels: dataView.ventes?.by_day?.map((v:any)=>v.day) ?? [],
              datasets:[{label:'Ventes',data:dataView.ventes?.by_day?.map((v:any)=>v.nb) ?? [],
              borderColor:'#4075d7',backgroundColor:'rgba(64,117,215,0.2)',tension:0.3,fill:true}]},
      options:{responsive:true,plugins:{legend:{display:false}}}
    });

    // commandes
    cmdInstance = new Chart(cmdChart, {
      type: 'line',
      data: { labels: dataView.commandes?.by_day?.map((v:any)=>v.day) ?? [],
              datasets:[{label:'Commandes',data:dataView.commandes?.by_day?.map((v:any)=>v.nb) ?? [],
              borderColor:'#f43f5e',backgroundColor:'rgba(244,63,94,0.2)',tension:0.3,fill:true}]},
      options:{responsive:true,plugins:{legend:{display:false}}}
    });

    // users by pays
    barInstance = new Chart(barChart, {
      type:'bar',
      data:{ labels:dataView.users?.by_pays?.map((u:any)=>u.libelle) ?? [],
             datasets:[{label:'Utilisateurs',data:dataView.users?.by_pays?.map((u:any)=>u.nb) ?? [],
             backgroundColor:colors,borderRadius:6}]},
      options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}
    });

    // abonnements
    pieInstance = new Chart(pieChart, {
      type:'pie',
      data:{ labels:['Actifs','Gratuits','Expirés'],
             datasets:[{data:[dataView.abn?.actif ?? 0,dataView.abn?.free ?? 0,dataView.abn?.passed ?? 0],
             backgroundColor:['#3b82f6','#facc15','#ef4444']}]},
      options:{plugins:{legend:{position:'bottom'}}}
    });
  }

  function appliquerFiltres() {
    applyFiltersLocal();
    updateCharts();
  }

  onMount(()=>{
    Chart.register(LineController,LineElement,PointElement,LinearScale,CategoryScale,Title,
                   BarElement,BarController,PieController,ArcElement,Tooltip,Legend);
    fetchDashboard();
  });
</script>

<div class="mx-[30px] mt-[15px] mb-[30px]">
  <Abercrome titre="Tableau de bord" parent="Dashboard" current="Statistiques" />

  <!-- filtres -->
  <div class="mb-6 p-4 bg-white rounded-lg shadow flex flex-wrap gap-4 items-end">
    <div>
      <label class="block text-sm font-medium text-gray-700">Période</label>
      <select bind:value={periode} class="border rounded-lg px-3 py-2">
        <option value="mois">Mois</option><option value="trimestre">Trimestre</option>
        <option value="semestre">Semestre</option><option value="annee">Année</option>
      </select>
    </div>
    {#if periode==='mois'}
      <div>
        <label class="block text-sm font-medium text-gray-700">Mois</label>
        <select bind:value={mois} class="border rounded-lg px-3 py-2">
          <option value="01">Janvier</option><option value="02">Février</option><option value="03">Mars</option>
          <option value="04">Avril</option><option value="05">Mai</option><option value="06">Juin</option>
          <option value="07">Juillet</option><option value="08">Août</option><option value="09">Septembre</option>
          <option value="10">Octobre</option><option value="11">Novembre</option><option value="12">Décembre</option>
        </select>
      </div>
    {/if}
    {#if periode==='trimestre'}
      <div>
        <label class="block text-sm font-medium text-gray-700">Trimestre</label>
        <select bind:value={tranche} class="border rounded-lg px-3 py-2">
          <option value="1">1er Trimestre</option><option value="2">2ème Trimestre</option>
          <option value="3">3ème Trimestre</option><option value="4">4ème Trimestre</option>
        </select>
      </div>
    {/if}
    {#if periode==='semestre'}
      <div>
        <label class="block text-sm font-medium text-gray-700">Semestre</label>
        <select bind:value={tranche} class="border rounded-lg px-3 py-2">
          <option value="1">1er Semestre</option><option value="2">2ème Semestre</option>
        </select>
      </div>
    {/if}
    <div>
      <label class="block text-sm font-medium text-gray-700">Année</label>
      <select bind:value={annee} class="border rounded-lg px-3 py-2">
        {#each anneesOptions as y}<option value={y}>{y}</option>{/each}
      </select>
    </div>
    <button on:click={appliquerFiltres} class="ml-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60" disabled={loading}>
      Rechercher
    </button>
  </div>

  {#if loading}
    <p class="p-4 text-blue-500">⏳ Chargement...</p>
  {:else if error}
    <p class="p-4 text-red-500">❌ {error}</p>
  {:else if dataView}
    <!-- KPI -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <KpiCard icon={Users} label="Utilisateurs" value={dataView.users.total} color="blue"/>
      <KpiCard icon={Users} label="Employeurs" value={dataView.users.owner} color="indigo"/>
      <KpiCard icon={Users} label="Employés" value={dataView.users.employe} color="green"/>
      <KpiCard icon={Users} label="Non-KYC" value={dataView.users.not_kyc} color="red"/>
      <KpiCard icon={Store} label="Magasins" value={dataView.magasin} color="teal"/>
      <KpiCard icon={BarChart3} label="Abonnements actifs" value={dataView.abn.actif} color="blue"/>
      <KpiCard icon={BarChart3} label="Abonnements gratuits" value={dataView.abn.free} color="yellow"/>
      <KpiCard icon={BarChart3} label="Abonnements expirés" value={dataView.abn.passed} color="red"/>
    </div>

    <!-- Graphiques ligne 1 -->
    <div class="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white p-6 rounded-xl shadow"><h3 class="mb-4">📈 Ventes quotidiennes</h3><canvas bind:this={lineChart}></canvas></div>
      <div class="bg-white p-6 rounded-xl shadow"><h3 class="mb-4">📦 Commandes quotidiennes</h3><canvas bind:this={cmdChart}></canvas></div>
    </div>

    <!-- Graphiques ligne 2 -->
    <div class="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
      <!-- Utilisateurs par pays -->
      <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="mb-4 text-gray-700 font-semibold">📊 Utilisateurs par pays</h3>
        <canvas bind:this={barChart}></canvas>
      </div>
      
      
      
      <!-- Répartition abonnements -->
      <div class="bg-white p-6 rounded-xl shadow flex flex-col items-center ">
        <h3 class="mb-4 text-gray-700 font-semibold">🥧 Répartition abonnements</h3>
        <canvas bind:this={pieChart} class="max-w-[220px] max-h-[220px]"></canvas>
        <div class="mt-4 text-sm text-gray-600">
          <p>✔️ Actifs : <span class="font-bold text-blue-600">{dataView.abn?.actif}</span></p>
          <p>🟡 Gratuits : <span class="font-bold text-yellow-500">{dataView.abn?.free}</span></p>
          <p>❌ Expirés : <span class="font-bold text-red-600">{dataView.abn?.passed}</span></p>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <!-- Tableau recap par pays -->
      <div class="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <h3 class="mb-4 text-gray-700 font-semibold">📋 Répartition par pays</h3>
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100 text-gray-600 text-sm">
              <th class="border px-4 py-2 text-left">Pays</th>
              <th class="border px-4 py-2 text-center">Utilisateurs</th>
            </tr>
          </thead>
          <tbody>
            {#each dataView.users?.by_pays ?? [] as u}
              <tr class="hover:bg-gray-50">
                <td class="border px-4 py-2">{u.libelle}</td>
                <td class="border px-4 py-2 text-center font-semibold text-gray-700">{u.nb}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
