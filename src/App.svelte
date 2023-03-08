<script>
  import { onMount } from 'svelte';
  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';

  import BillingCostChart from "./components/BillingCostChart.svelte";
  import BillingEnergyChart from "./components/BillingEnergyChart.svelte";
  import ReadingsChart from "./components/ReadingsChart.svelte";
  import { billsCosts, billsEnergy, rawReadings,  } from "./stores";
  import { formatBillsCost, formatBillsEnergy } from "./utils/formatData";
    import { getBills, getReadings } from './utils/fetchData';

  let items = [
    { label: "Billing Cost",
		 value: 1,
		 component: BillingCostChart
		},
    { label: "Billing Energy",
		 value: 2,
		 component: BillingEnergyChart
		},
    { label: "Readings",
		 value: 3,
		 component: ReadingsChart
		}
  ];

  let active = items[0].label;

  onMount(async () => {
    const rawBillingData = await getBills();
    const rawReadingData = await getReadings();
    $billsCosts = formatBillsCost(rawBillingData);
    $billsEnergy = formatBillsEnergy(rawBillingData);
    $rawReadings = rawReadingData;
  })

</script>

<div id="main">
  <TabBar tabs={items.map((i) => i.label)} let:tab bind:active>
    <Tab {tab}>
      <Label>{tab}</Label>
    </Tab>
  </TabBar>
  {#each items as item}
    {#if item.label === active}
      <svelte:component this={item.component}/>
    {/if}
  {/each}
</div>


<style>
  #main {
    width: 80vw;
    height: 80vh;
  }
</style>