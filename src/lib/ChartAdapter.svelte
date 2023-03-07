<script>
  import { Line } from 'svelte-chartjs';
  import zoomPlugin from 'chartjs-plugin-zoom';

  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  } from 'chart.js';

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    zoomPlugin,
  );

  export let data;
</script>

<Line {data} options={{ 
  responsive: true, 
  plugins: {
    zoom: {
      pan: {
        enabled: true,
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        mode: 'x',
      }
    }
  }}} />
