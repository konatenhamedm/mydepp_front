<script lang="ts">
  import { onMount } from 'svelte';
  import Highcharts from 'highcharts';
  import Exporting from 'highcharts/modules/exporting';
  import ExportData from 'highcharts/modules/export-data';

  export let data: any = [];

  let pie3: any;

  onMount(() => {
    if (typeof window !== 'undefined') {
      // Initialise les modules d'export
      Exporting(Highcharts);
      ExportData(Highcharts);

      pie3 = Highcharts.chart('container3', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            },
            showInLegend: true
          }
        },
        series: [{
          name: 'Parts',
          colorByPoint: true,
          data: data
        }],
        exporting: {
          enabled: true,
          buttons: {
            contextButton: {
              menuItems: [
                'downloadPNG',
                'downloadJPEG',
                'downloadPDF',
                'downloadSVG',
                'separator',
                'downloadCSV',     // ✅ Ajout CSV
                'downloadXLS',     // ✅ Ajout Excel
                'viewData'         // ✅ Voir les données sous forme de tableau
              ]
            }
          }
        }
      });
    }
  });

  // Met à jour les données si elles changent
  $: if (pie3 && data.length > 0) {
    pie3.series[0].setData(data);
  }
</script>

<!-- Conteneur du graphique -->
<div id="container3" style="width: 100%; height: 400px;"></div>
