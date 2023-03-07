import { getBills, getReadings } from "./fetchData"

/**
 * given {"data": [
        {
            "id": "2080448990210",
            "type": "meter-reading",
            "attributes": {
                "readings": {
                    "kw": {
                        "2022-08-01T00:00:00-07:00": 9.6,
                        ...
                    }}}}
 *  return just the readings as 
 * { labels: [x...],
 * datasets: [{
 *  data: [y...]
 * },...]}
 * 
 */
export async function formatReadings () {
  const readingData = await getReadings();
  let xValues = [];
  const datasets = readingData.data.map((datum) => {
    const kwEntries = datum.attributes.readings.kw
    const potentialX = Object.keys(kwEntries);
    xValues = mergeUnique(xValues, potentialX);
    const yValues = Object.values(kwEntries);
    return {
      ...dataSetBase,
      label: datum.type,
      data: yValues
    }
  })
  return {
    labels: xValues,
    datasets,
  }
}

/**
 * given {
    "data": [
        {
            "id": "8982636",
            "type": "bill",
            "attributes": {
                "start": "2022-01-21",
                "end": "2022-02-21",
                "cost": 2278.51,
                "tndCost": 1662.14,
                "genCost": 616.37,
                "use": 7897.2,
                "useUnit": "kW",
                "demand": 28.0,
                "demandUnit": "kW",
                "tariff": "PGETD-B-10-S",
 *  return just the cost,tndCost,genCost as 
 * { labels: [x...],
 * datasets: [{
 *  data: [y...]
 * },...]}
 * 
 */
export async function formatBillsCost () {
  const billsData = await getBills();
  let xValues = [];
  let datasets = [{
    ...dataSetBase,
    label: 'Cost',
    data: []
  },{
    ...dataSetBase,
    label: 'Cost (TND)',
    data: []
  }, {
    ...dataSetBase,
    label: 'Cost (Gen)',
    data: []
  }]
  billsData.data.forEach((datum) => {
    const attributes = datum.attributes;
    xValues.push(attributes.start);
    datasets[0].data.push(attributes.cost);
    datasets[1].data.push(attributes.tndCost);
    datasets[2].data.push(attributes.genCost);
  })
  return {
    labels: xValues,
    datasets,
  }
}

/**
 * given {
    "data": [
        {
            "id": "8982636",
            "type": "bill",
            "attributes": {
                "start": "2022-01-21",
                "end": "2022-02-21",
                "cost": 2278.51,
                "tndCost": 1662.14,
                "genCost": 616.37,
                "use": 7897.2,
                "useUnit": "kW",
                "demand": 28.0,
                "demandUnit": "kW",
                "tariff": "PGETD-B-10-S",
 *  return just the cost,tndCost,genCost as 
 * { labels: [x...],
 * datasets: [{
 *  data: [y...]
 * },...]}
 * 
 */
export async function formatBillsEnergy () {
  const billsData = await getBills();
  let xValues = [];
  let datasets = [{
    ...dataSetBase,
    label: 'Use (kW)',
    data: []
  },{
    ...dataSetBase,
    label: 'Demand (kW)',
    data: []
  }]
  billsData.data.forEach((datum) => {
    const attributes = datum.attributes;
    xValues.push(attributes.start);
    datasets[0].data.push(attributes.use);
    datasets[1].data.push(attributes.demand);
  })
  return {
    labels: xValues,
    datasets,
  }
}

function mergeUnique(array1, array2) {
  const array3 = array1.concat(array2.filter((ele) => {
    return !array1.includes(ele);
  }))
  return array3.sort();
}

const dataSetBase = {
  fill: true,
  lineTension: 0.3,
  backgroundColor: 'rgba(225, 204, 230, .3)',
  borderColor: 'rgb(205, 130, 158)',
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: 'rgb(205, 130,1 58)',
  pointBackgroundColor: 'rgb(255, 255, 255)',
  pointBorderWidth: 10,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: 'rgb(0, 0, 0)',
  pointHoverBorderColor: 'rgba(220, 220, 220,1)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
}