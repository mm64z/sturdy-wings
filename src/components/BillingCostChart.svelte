
<script>
  import Chartjs from "../lib/ChartAdapter.svelte";
  import { billsCosts } from "../stores";

  let data;
  $: if ($billsCosts) {
    data = $billsCosts;
  }
</script>

<Chartjs {data} />