<script>
    import { onMount } from 'svelte';
    import Highcharts from 'highcharts';
 
  

  
    let chartD;
  
    onMount(() => {
        chartD = Highcharts.chart('container3', {
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 45, // Inclinaison
            beta: 0   // Rotation
          }
        },
        title: {
          text: 'Ventes par catégorie en 3D'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            innerSize: 100,  // Pour créer l'effet donut
            depth: 45,       // Profondeur pour l'effet 3D
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          name: 'Parts',
          colorByPoint: true,
          data: [{
            name: 'Électronique',
            y: 35.41,
            sliced: true,
            selected: true
          }, {
            name: 'Vêtements',
            y: 24.84
          }, {
            name: 'Maison',
            y: 15.85
          }, {
            name: 'Livres',
            y: 10.67
          }, {
            name: 'Autres',
            y: 13.23
          }]
        }],   exporting: {
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
    });
  </script>
  
  <div id="container3" style="width:100%; height:200px;"></div>
  