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
export function formatReadings (rawReadings) {
  let xValues = [];
  const datasets = rawReadings.data.map((datum) => {
    const kwEntries = datum.attributes.readings.kw
    const potentialX = Object.keys(kwEntries);
    if (xValues.length === 0) // sample data only has one entry
      // but would need to figure how to map time to entry, and what to do for missing
      xValues = potentialX;
    const yValues = Object.values(kwEntries);
    return {
      ...dataSetBase,
      label: datum.type,
      borderColor: '#0C463E',
      pointBorderColor: '#136F63',
      data: yValues
    }
  })
  return {
    labels: xValues,
    datasets,
  }
}

export const TimeGroupings = {
  HOURLY: {
    label: "Hourly",
  },
  DAILY: {
    label: "Daily",
  },
  MONTHLY: {
    label: "Monthly",
  },
}
/**
 *  {"data": [
 * {
 *   "id": "2080448990210",
 *   "type": "meter-reading",
 *   "attributes": {
 *       "readings": {
 *           "kw": {
 *               "2022-08-01T00:00:00-07:00": 9.6,
 *                ...
 * }}}}]}
 * return same format, condensed by a time grouping
 * time looks like "2022-08-01T00:00:00-07:00" 
 * currently will condense by averages, could accept a function to do something else*/
export function sortReadingsByTime (rawReadings, grouping) {
  const condenseFunc = ((numbers) => {
    const sum = numbers.reduce((acc,number)=>{ return acc + number },0);
    return sum/numbers.length;
  })
  const newData = rawReadings.data.map((datum) => {
    const kw = datum.attributes.readings.kw;
    const times = Object.keys(kw)
    let newKw = {};
    let timeFunc;
    if (grouping === TimeGroupings.DAILY.label) {
      timeFunc = (time) => time.slice(0,10) // yyyy-mm-dd
    } else if (grouping === TimeGroupings.MONTHLY.label) {
      timeFunc = (time) => time.slice(0,7) // yyyy-mm
    } else if (grouping === TimeGroupings.HOURLY.label) {
      timeFunc = (time) => time.slice(0,13) // yyyy-mm-ddThh
    } else { // no change
      timeFunc = (time) => time
    }
    times.forEach((time) => {
      const newTime = timeFunc(time);
      if (newTime in newKw) {
        newKw[newTime].push(kw[time]);
      } else {
        newKw[newTime] = [kw[time]];
      }
    })

    Object.keys(newKw).forEach((newTime) => {
      const aggregate = condenseFunc(newKw[newTime]);
      newKw[newTime] = aggregate;
    })

    return {
      ...datum, 
      attributes: {
        ...datum.attributes, 
        readings: {
          ...datum.attributes.readings,
          kw: newKw
        }
      }
    }
  });

  return {
    data: newData,
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
export function formatBillsCost (billsData) {
  let xValues = [];
  let datasets = [{
    ...dataSetBase,
    label: 'Cost',
    borderColor: '#0C463E',
    pointBorderColor: '#136F63',
    data: []
  },{
    ...dataSetBase,
    label: 'Cost (TND)',
    borderColor: '#AE2D09',
    pointBorderColor: '#F34213',
    data: []
  }, {
    ...dataSetBase,
    label: 'Cost (Gen)',
    borderColor: '#6A5E11',
    pointBorderColor: '#C2AC1E',
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
export function formatBillsEnergy (billsData) {
  let xValues = [];
  let datasets = [{
    ...dataSetBase,
    label: 'Use (kW)',
    borderColor: '#0C463E',
    pointBorderColor: '#12695D',
    data: []
  },{
    ...dataSetBase,
    label: 'Demand (kW)',
    borderColor: '#8C031A',
    pointBorderColor: '#C80425',
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
  lineTension: 0.3,
  borderColor: 'rgb(205, 130, 158)',
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: 'rgb(205, 130, 138)',
  pointBackgroundColor: 'rgb(255, 255, 255)',
  pointBorderWidth: 10,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: 'rgb(0, 0, 0)',
  pointHoverBorderColor: 'rgba(220, 220, 220, 1)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
}