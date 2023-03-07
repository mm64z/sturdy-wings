
<script>
  import Chartjs from "../lib/Chartjs.svelte";
  import { billsCosts } from "../stores";

  let data;
  $: if ($billsCosts) {
    data = $billsCosts;
  }
</script>

<Chartjs {data} />