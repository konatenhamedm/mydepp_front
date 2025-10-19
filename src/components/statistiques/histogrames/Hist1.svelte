<script lang="ts">
    import {onMount} from 'svelte';
    import Highcharts from 'highcharts';
    import Exporting from 'highcharts/modules/exporting';
    import ExportData from 'highcharts/modules/export-data';
  
    export let data: any = [];
    export let container;

    export let title: string = '';
  
    let pie3: any;
  
    onMount(() => {
      if (typeof window !== 'undefined') {
        // Initialise les modules d'export
        Exporting(Highcharts);
        ExportData(Highcharts);
  
        pie3 = Highcharts.chart(container, {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
          },
          title: {
            text: '',
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
          },
          accessibility: {
            point: {
              valueSuffix: '%',
            },
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              },
              showInLegend: true,
            },
          },
          series: [
            {
              name: 'Parts',
              colorByPoint: true,
              data: data,
            },
          ],
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
                  'downloadCSV', // ✅ Ajout CSV
                  'downloadXLS', // ✅ Ajout Excel
                  'viewData', // ✅ Voir les données sous forme de tableau
                ],
              },
            },
          },
        });
      }
    });
  
    // Met à jour les données si elles changent
    $: if (pie3 && data.length > 0) {
      pie3.series[0].setData(data);
    }
  </script>
  
  <div class="col-span-2 p-1">
    <div class="box">
      <div class="box-header with-border flex justify-between items-center">
        <h4 class="box-title text-xl font-medium">
          {title}
        </h4>
      </div>
      <!-- /.box-header -->
      <div class="box-body">
        <div class="table-responsive">
          <div class="w-full grid grid-cols-2">
            <div></div>
          </div>
          <!-- body -->
  
          <div id="{container}" style="width: 100%; height: 400px;"></div>

        </div>
      </div>
      <!-- /.box-body -->
    </div>
  </div>