<script lang="ts">
    import { onMount } from 'svelte';
    import Highcharts from 'highcharts';
    import Exporting from 'highcharts/modules/exporting';
    import ExportData from 'highcharts/modules/export-data';
  
    export let data: any = [];

    export let container;
    export let title: string = '';
    export let subtitle: string = '';
    export let type: string = '';

  
    let chart: any;
  
    onMount(() => {
      if (typeof window !== 'undefined') {
        Exporting(Highcharts);
        ExportData(Highcharts);
  
        chart = Highcharts.chart(container, {
          chart: {
            type: 'column',
          },
          title: {
            text: 'Répartition par '+ subtitle,
          },
          xAxis: {
            type: 'category',
            title: {
              text: subtitle
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Nombre'
            }
          },
          legend: {
            enabled: false,
          },
          tooltip: {
            pointFormat: '<b>{point.y}</b> '+type,
          },
          series: [
            {
              name: 'Nombre',
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
                  'downloadCSV',
                  'downloadXLS',
                  'viewData',
                ],
              },
            },
          },
        });
      }
    });
  
    // Met à jour les données si elles changent
    $: if (chart && data.length > 0) {
      chart.series[0].setData(data);
    }
  </script>

    
<div class="col-span-1 p-1">
    <div class="box">
      <div class="box-header with-border flex justify-between items-center">
        <h4 class="box-title text-xl font-medium">
          {title}

        </h4>
      </div>
      <!-- /.box-header -->
      <div class="box-body">
        <div class="table-responsive">
          <div class="w-full grid grid-cols-4">
            <div></div>
          </div>
          <!-- body -->
  
          <div id="{container}" style="width: 100%; height: 400px;"></div>
        </div>
      </div>
      <!-- /.box-body -->
    </div>
  </div>





  