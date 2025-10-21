<script lang="ts">
  import Abercrome from '$components/_includes/Abercrome.svelte';
  import CardStat from '$components/CardStat.svelte';
  import {apiFetch} from '$lib/api';
  import {getAuthCookie, getPermission} from '$lib/auth';
  import {onMount} from 'svelte';
  import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    BarElement,
    BarController,
  } from 'chart.js';

  let main_data: any = [];
  let loading = false;
  interface Operateur {
    name: string;
    logo: string;
    volume: string;
    pays: string;
  }
  let userData: any = [];

  /* 	async function fetchData() {
		loading = true; // Active le spinner de chargement
		try {
			const res = await apiFetch(true, '/dashboard');
			if (res) {
				main_data = res.data ;
				console.log('Données récupérées avec succès:', main_data);
			} else {
				console.error('Erreur lors de la récupération des données:', res.statusText);
			}
		} catch (error) {
			console.error('Erreur lors de la récupération des données:', error);
		} finally {
			loading = false; // Désactive le spinner de chargement
		}
	} */

  const operateurs: Operateur[] = [
    {
      name: 'Wave',
      logo: '/wave-1024x1024.png',
      volume: '1.3B XOF',
      pays: 'Mali',
    },
    {
      name: 'Orange',
      logo: '/Orange_logo.svg',
      volume: '1.1B XOF',
      pays: "Côte d'ivoire",
    },
    {
      name: 'MTN ',
      logo: '/MTN_Logo.svg.png',
      volume: '280.0M XOF',
      pays: "Côte d'ivoire",
    },
    {
      name: 'Moov',
      logo: '/moov.png',
      volume: '165.0M XOF',
      pays: 'Niger',
    },
  ];

  const path: string = '/admin/access';

  let permission: string;
  let law: string;

  onMount(async () => {
    //await fetchData();

    userData = getAuthCookie();

    console.log('User Data:', userData);

    law = await getPermission(path);
    permission = law;
    console.log('Permission:', permission);
  });

  let periode = 'Ce mois';
  let operateur = 'Tous';
  let type = 'Tous';

  let lineChart: HTMLCanvasElement;
  let barChart: HTMLCanvasElement;

  onMount(() => {
    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Title,
      BarElement,
      BarController
    );

    // 📊 Graphique ligne (Volume quotidien)
    new Chart(lineChart, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
          {
            label: 'Volume',
            data: [300, 350, 400, 460, 420, 380, 320],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59,130,246,0.2)',
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {legend: {display: false}},
        scales: {y: {beginAtZero: true}},
      },
    });

    // 📊 Graphique barres (pays par type)
    new Chart(barChart, {
      type: 'bar',
      data: {
        labels: ['Dépôt', 'Retrait', 'Transfert', 'Paiement'],
        datasets: [
          {
            label: 'pays',
            data: [70, 95, 60, 120],
            backgroundColor: '#3B82F6',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {legend: {display: false}},
        scales: {y: {beginAtZero: true}},
      },
    });
  });
</script>

<div
  class=" ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]"
>
  <Abercrome titre="Tableau de bord" parent="Dashbord" current="statistques" />
  <!-- Responsive Toggler -->
  <div class="col-span-12">
    <!-- <h1>{JSON.stringify(userData)} </h1>
		<h1>{userData.id}</h1>
	
		<div class="grid grid-cols-12 gap-[25px]">
			<CardStat title="Total missions" total={main_data.nb_missions}  icon="uil uil-arrow-growth" />
			<CardStat title="Total missions immobilisation" total={main_data.nb_missions_immo}  icon="uil uil-arrow-growth" />
			<CardStat title="Total missions stock" total={main_data.nb_missions_stock}  icon="uil uil-arrow-growth" />
			<CardStat title="Montant acquisition total" total={main_data.total_immo_acquisition_amount}  icon="uil uil-usd-circle" />
			
		</div> -->

    <div class="p-1 space-y-3">
      <!-- Filtres -->
      <div class="flex flex-wrap gap-4 bg-white shadow p-6">
        <select bind:value={periode} class="border rounded-lg px-3 py-2">
          <option>Ce mois</option>
          <option>Le mois dernier</option>
          <option>Cette année</option>
        </select>
        <select bind:value={operateur} class="border rounded-lg px-3 py-2">
          <option>Tous</option>
          <option>Orange</option>
          <option>MTN</option>
          <option>Moov</option>
        </select>
        <select bind:value={type} class="border rounded-lg px-3 py-2">
          <option>Tous</option>
          <option>Dépôt</option>
          <option>Retrait</option>
          <option>Transfert</option>
          <option>Paiement</option>
        </select>
      </div>

      <!-- Statistiques principales -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-xl shadow flex flex-col">
          <span class="text-gray-500">Volume total</span>
          <span class="text-2xl font-semibold">2.9B XOF</span>
          <span class="text-sm text-blue-500">+4.2% vs période précédente</span>
        </div>
        <div class="bg-white p-6 rounded-xl shadow flex flex-col">
          <span class="text-gray-500">Transactions</span>
          <span class="text-2xl font-semibold">8 421</span>
          <span class="text-sm text-blue-500">+2.1%</span>
        </div>
        <div class="bg-white p-6 rounded-xl shadow flex flex-col">
          <span class="text-gray-500">pays évaluées</span>
          <span class="text-2xl font-semibold">384.2M XOF</span>
          <span class="text-sm text-blue-500">+3.4%</span>
        </div>
        <div class="bg-white p-6 rounded-xl shadow flex flex-col">
          <span class="text-gray-500">Taux de succès</span>
          <span class="text-2xl font-semibold">97.2%</span>
          <span class="text-sm text-green-500">Stable</span>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="grid grid-cols-2 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-xl shadow">
          <h3 class="text-gray-700 font-semibold mb-4">
            Volume quotidien (XOF)
          </h3>
          <canvas bind:this={lineChart} class="h-56"></canvas>
        </div>
        <div class="bg-white p-6 rounded-xl shadow">
          <h3 class="text-gray-700 font-semibold mb-4">Taxes par type transaction</h3>
          <canvas bind:this={barChart} class="h-56"></canvas>
        </div>
      </div>

      <!-- Mix par opérateur -->
      <div class="bg-white p-6 rounded-xl shadow">
        <!-- Titre -->
        <div class="flex items-center gap-2 mb-4">
          <span
            class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100"
          >
            💳
          </span>
          <h3 class="text-gray-700 font-semibold">Mix par opérateur</h3>
        </div>

        <!-- Tableau -->
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th class="px-4 py-2 font-medium">Opérateur</th>
                <th class="px-4 py-2 font-medium">Volume</th>
                <th class="px-4 py-2 font-medium">Pays</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {#each operateurs as op}
                <tr>
                  <td class="px-4 text-[12px]  py-3 flex items-center gap-3">
                    <img
                      src={op.logo}
                      alt={op.name}
                      class="w-8 h-8 rounded-full object-contain"
                    />
                    <span class="font-medium text-gray-800">{op.name}</span>
                  </td>
                  <td class="px-4 text-[12px]  py-3 text-gray-900">{op.volume}</td>
                  <td class="px-4 text-[12px]  py-3 text-gray-900">{op.pays}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
