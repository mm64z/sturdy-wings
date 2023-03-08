
<script>
  import Radio from '@smui/radio';
  import FormField from '@smui/form-field';

  import Chartjs from "../lib/ChartAdapter.svelte";
  import { rawReadings } from "../stores";
  import { formatReadings, sortReadingsByTime, TimeGroupings } from '../utils/formatData';

  const options = Object.values(TimeGroupings);

  let rawData;
  let selected = TimeGroupings.DAILY.label;
  let formattedData;

  $: if ($rawReadings) {
    rawData = $rawReadings;
  }

  $: if (rawData && selected) {
    formattedData = formatReadings(sortReadingsByTime(rawData, selected));
  }
</script>

<div class="grouping-select">
  {#each options as option}
    <FormField>
      <Radio
        bind:group={selected}
        value={option.label}
      />
      <span slot="label">
        {option.label}
      </span>
    </FormField>
  {/each}
</div>
<Chartjs data={formattedData} />

<style>
  .grouping-select > :global(div) {
    display: inline-block;
    margin: 0 0.5em;
  }
</style>