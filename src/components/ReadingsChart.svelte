
<script>
  import Chartjs from "../lib/Chartjs.svelte";
  import { readings } from "../stores";

  let data;
  $: if ($readings) {
    data = $readings;
  }
</script>

<Chartjs {data} />