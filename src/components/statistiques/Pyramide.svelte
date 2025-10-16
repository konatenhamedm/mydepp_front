<script lang="ts">
    import { onMount } from 'svelte';
    import Highcharts from 'highcharts';
    import exporting from 'highcharts/modules/exporting';
    import exportData from 'highcharts/modules/export-data';
    import highchartsMore from 'highcharts/highcharts-more';
  
    interface Civilite {
      libelle: 'Monsieur' | 'Madame';
    }
  
    interface TableauCroiseItem {
      tranche_age: string;
      civilite: Civilite;
      count: number;
    }
  
    interface Statistiques {
      tableau_croise: TableauCroiseItem[];
    }
  
    interface ApiData {
      statistiques?: Statistiques;
    }
  
    interface ChartData {
      categories: string[];
      male: number[];
      female: number[];
    }
  
    export let apiData: ApiData;
  
    // Initialize Highcharts modules
    if (typeof window !== 'undefined') {
      highchartsMore(Highcharts);
      exporting(Highcharts);
      exportData(Highcharts);
    }
  
    let chartContainer: HTMLElement;
    let chart: Highcharts.Chart;
  
    // Prepare data for Highcharts
    $: chartData = preparePyramidData();
  
    function preparePyramidData(): ChartData {
      const ageRanges = [
        '< 25 ans',
        '25-34 ans',
        '35-44 ans',
        '45-54 ans',
        '55 ans et plus',
      ];
  
      const initialData: ChartData = {
        categories: ageRanges,
        male: Array(ageRanges.length).fill(0),
        female: Array(ageRanges.length).fill(0)
      };
  
      if (!apiData?.statistiques?.tableau_croise) return initialData;
  
      apiData.statistiques.tableau_croise.forEach((item) => {
        const ageIndex = ageRanges.indexOf(item.tranche_age);
        if (ageIndex === -1) return;
  
        if (item.civilite.libelle === 'Monsieur') {
          initialData.male[ageIndex] += item.count;
        } else if (item.civilite.libelle === 'Madame') {
          initialData.female[ageIndex] += item.count;
        }
      });
  
      return initialData;
    }
  
    onMount(() => {
      if (!chartData) return;
  
      chart = new Highcharts.Chart({
        chart: {
          type: 'bar',
          renderTo: chartContainer,
          backgroundColor: 'transparent',
        },
        title: {
          text: 'Pyramide des âges par sexe',
        },
        subtitle: {
          text: 'Répartition des diplômés',
        },
        xAxis: [
          {
            categories: chartData.categories,
            reversed: false,
            labels: {
              step: 1,
            },
          },
          {
            opposite: true,
            reversed: false,
            categories: chartData.categories,
            linkedTo: 0,
            labels: {
              step: 1,
            },
          },
        ],
        yAxis: {
          title: {
            text: null,
          },
          labels: {
            formatter: function () {
              return Math.abs(this.value as number).toString();
            },
          },
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            borderWidth: 0,
            groupPadding: 0.1,
          },
        },
        tooltip: {
          formatter: function () {
            return (
              `<b>${this.series.name}, ${this.point.category}</b><br/>` +
              `Nombre: ${Math.abs(this.point.y as number)}`
            );
          },
        },
        legend: {
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical',
        },
        series: [
          {
            name: 'Madame',
            data: chartData.female.map((value) => -value), // Negative for left side
            color: '#FF66CC',
            type: 'bar'
          },
          {
            name: 'Monsieur',
            data: chartData.male,
            color: '#6699FF',
            type: 'bar'
          },
        ],
        exporting: {
          buttons: {
            contextButton: {
              menuItems: [
                'downloadPNG',
                'downloadJPEG',
                'downloadPDF',
                'downloadCSV',
              ],
            },
          },
        },
      });
  
      return () => {
        if (chart) {
          chart.destroy();
        }
      };
    });
  </script>
  
  <div class="col-span-1 p-1">
    <div class="box">
      <div class="box-header with-border flex justify-between items-center">
        <h4 class="box-title text-xl font-medium export-buttons"></h4>

        
      </div>
      <!-- /.box-header -->
      <div class="box-body">
        <div class="table-responsive">
          <div class="w-full grid grid-cols-4">
            <div></div>
          </div>
          <!-- body -->
          <div
            class="chart-container"
            style="width: 100%; height: 400px;"
            bind:this={chartContainer}
          ></div>
        </div>
      </div>
      <!-- /.box-body -->
    </div>
  </div>
  
  <style>
    .chart-container {
      width: 100%;
      height: 500px;
      margin: 1rem 0;
      border-radius: 8px;
    }
  
    @media (max-width: 768px) {
      .chart-container {
        height: 400px;
      }
    }
    .export-buttons {
    display: flex;
    gap: 10px;
   
  }
  </style>