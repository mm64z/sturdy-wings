
<script>
  import Chartjs from "../lib/ChartAdapter.svelte";
  import { billsEnergy } from "../stores";

  let data;
  $: if ($billsEnergy) {
    data = $billsEnergy;
  }
</script>

<Chartjs {data} />