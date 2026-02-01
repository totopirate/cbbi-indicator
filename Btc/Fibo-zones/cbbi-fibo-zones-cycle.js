// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                              5 : ( 5.1 , 5.2 )

// ===================================================================================================================================
//                                5.1 :
//                                Palette des couleurs des zones fibo (du plus petit au plus grand)
// ===================================================================================================================================
//                                5.2 :
//                                Coloration par segment de la ligne BTC selon zones fibo du CBBI
// ===================================================================================================================================
//                                5.3 :
//                                Ecouteur bouton clic
// ===================================================================================================================================
//                                5.4 :
//                                Données CBBI fibo zones intégrées directement (extrait, complète avec tes données)
// ===================================================================================================================================


//  5.1 :
// ===================================================================================================================================
//                                Palette des couleurs des zones fibo (du plus petit au plus grand)
// Avec couleur différente selon direction up/down

const zonebtcColorsCycle = [
  { min: 0.45, max: 14.6, colorUp: 'rgba(216, 176, 240, 0.9)', colorDown: 'rgba(216, 176, 240, 0.91)' },
  { min: 14.6, max: 85.40, colorUp: 'rgba(100, 220, 100, 0.9)', colorDown: 'rgb(180, 26, 15)' },

  { min: 85.40, max: 100, colorUp: 'rgba(0, 0, 0, 0.9)', colorDown: 'rgba(0, 0, 0, 0.91)' },
];





//  5.2 :
// ===================================================================================================================================
//                                Fonction qui colore la ligne BTC par segments selon zones fibo et direction

let coloredLineSegmentsCycle = [];
let segmentsVisibleCycle = false;

// Parse la zone "min-max" en {min, max} float
function parseZoneCycle(zoneInput) {
  if (typeof zoneInput === 'string') {
    const parts = zoneInput.split('-').map(s => parseFloat(s));
    return { min: parts[0], max: parts[1] };
  } else if (typeof zoneInput === 'object' && zoneInput.min !== undefined && zoneInput.max !== undefined) {
    return zoneInput; // déjà bien formaté
  } else {
    console.error('Format de zone non reconnu (cycle) :', zoneInput);
    return { min: 0, max: 0 };
  }
}

// Trouve la couleur dans zonebtcColorsCycle selon la zone et la direction
function getColorForZoneCycle(zone) {
  const { min, max, direction } = zone;

  // Trouver la zone de base
  const baseZone = zonebtcColorsCycle.find(z => !(max <= z.min || min >= z.max));
  if (!baseZone) return 'rgba(0,0,0,0.5)'; // couleur défaut

  if (direction === 'up') {
    return baseZone.colorUp;
  } else if (direction === 'down') {
    return baseZone.colorDown;
  } else {
    // Si direction null, couleur neutre grise
    return 'rgba(120, 120, 120, 0.7)';
  }
}

function toggleCBBILineSegmentsCycle(chart, cbbiFiboZonesCycle) {
  if (segmentsVisibleCycle) {
    coloredLineSegmentsCycle.forEach(series => chart.removeSeries(series));
    coloredLineSegmentsCycle = [];
    segmentsVisibleCycle = false;
    return;
  }

  const btcDataToUse = window.currentScale === 'log' ? window.btcPriceDataLog : window.btcPriceDataArith;

  cbbiFiboZonesCycle.forEach(zone => {
    const startTime = Math.floor(new Date(zone.startDate).getTime() / 1000);
    const endTime = Math.floor(new Date(zone.endDate).getTime() / 1000);

    const color = getColorForZoneCycle(zone.zone);

    const segmentData = btcDataToUse.filter(d => d.time >= startTime && d.time <= endTime);

    if (segmentData.length > 1) {
      const lineSeries = chart.addLineSeries({
        color: color,
        lineWidth: 3,
        lastValueVisible: false,
        priceLineVisible: false,
        crossHairMarkerVisible: false,
      });

      lineSeries.setData(segmentData);
      coloredLineSegmentsCycle.push(lineSeries);
    }
  });

  segmentsVisibleCycle = true;
}


//  5.3 :
// ===================================================================================================================================
//                                Ecouteur bouton clic

document.getElementById('zonefibobtcBtnCycle').addEventListener('click', () => {
  if (window.chartInstance && window.btcPriceData && window.cbbiFiboZonesCycle) {
    toggleCBBILineSegmentsCycle(window.chartInstance, window.cbbiFiboZonesCycle);
  } else {
    console.warn('Le graphique BTC, les données BTC ou les zones CBBI/Fibo (cycle) ne sont pas encore initialisés.');
  }
});


//  5.4 :
// ===================================================================================================================================
//                                Données CBBI fibo zones intégrées directement (extrait, complète avec tes données)

const cbbiFiboZonesCycle = [
  {
    "startDate": "2011-06-27",
    "endDate": "2011-10-12",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": null
    }
  },
  {
    "startDate": "2011-10-13",
    "endDate": "2011-10-13",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2011-10-14",
    "endDate": "2011-10-15",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2011-10-16",
    "endDate": "2011-11-08",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2011-11-09",
    "endDate": "2011-11-09",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2011-11-10",
    "endDate": "2011-11-30",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2011-12-01",
    "endDate": "2011-12-01",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2011-12-02",
    "endDate": "2011-12-02",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2011-12-03",
    "endDate": "2011-12-03",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2011-12-04",
    "endDate": "2011-12-04",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2011-12-05",
    "endDate": "2011-12-05",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2011-12-06",
    "endDate": "2011-12-18",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2011-12-19",
    "endDate": "2013-04-09",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2013-04-10",
    "endDate": "2013-04-10",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2013-04-11",
    "endDate": "2013-11-18",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2013-11-19",
    "endDate": "2013-11-19",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2013-11-20",
    "endDate": "2013-11-20",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2013-11-21",
    "endDate": "2013-11-22",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2013-11-23",
    "endDate": "2013-12-07",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2013-12-08",
    "endDate": "2013-12-09",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2013-12-10",
    "endDate": "2013-12-11",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2013-12-12",
    "endDate": "2013-12-15",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2013-12-16",
    "endDate": "2013-12-16",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2013-12-17",
    "endDate": "2013-12-17",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2013-12-18",
    "endDate": "2015-01-04",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-01-05",
    "endDate": "2015-01-09",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-01-10",
    "endDate": "2015-01-10",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-01-11",
    "endDate": "2015-01-27",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-01-28",
    "endDate": "2015-01-28",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-01-29",
    "endDate": "2015-03-09",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-03-10",
    "endDate": "2015-03-11",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-03-12",
    "endDate": "2015-07-09",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-07-10",
    "endDate": "2015-07-15",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-07-16",
    "endDate": "2015-07-16",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-07-17",
    "endDate": "2015-07-17",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-07-18",
    "endDate": "2015-07-23",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-07-24",
    "endDate": "2015-08-05",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-08-06",
    "endDate": "2015-08-06",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-08-07",
    "endDate": "2015-08-08",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-08-09",
    "endDate": "2015-08-09",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-08-10",
    "endDate": "2015-08-11",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-08-12",
    "endDate": "2015-08-16",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-08-17",
    "endDate": "2015-08-17",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-08-18",
    "endDate": "2015-09-09",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-09-10",
    "endDate": "2015-09-10",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-09-11",
    "endDate": "2015-09-25",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-09-26",
    "endDate": "2015-09-26",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-09-27",
    "endDate": "2015-09-28",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-09-29",
    "endDate": "2015-09-29",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-09-30",
    "endDate": "2015-10-09",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-10-10",
    "endDate": "2015-10-10",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-10-11",
    "endDate": "2015-10-13",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-10-14",
    "endDate": "2017-08-31",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2017-09-01",
    "endDate": "2017-09-01",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2017-09-02",
    "endDate": "2017-11-01",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2017-11-02",
    "endDate": "2017-11-02",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2017-11-03",
    "endDate": "2017-11-04",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2017-11-05",
    "endDate": "2017-11-09",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2017-11-10",
    "endDate": "2017-11-12",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2017-11-13",
    "endDate": "2017-11-13",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2017-11-14",
    "endDate": "2017-11-14",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2017-11-15",
    "endDate": "2017-11-16",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2017-11-17",
    "endDate": "2017-11-17",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2017-11-18",
    "endDate": "2017-11-20",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2017-11-21",
    "endDate": "2017-11-21",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2017-11-22",
    "endDate": "2017-11-22",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2017-11-23",
    "endDate": "2017-11-23",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2017-11-24",
    "endDate": "2017-11-25",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2017-11-26",
    "endDate": "2018-01-15",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2018-01-16",
    "endDate": "2018-01-22",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2018-01-23",
    "endDate": "2018-11-25",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2018-11-26",
    "endDate": "2018-11-28",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2018-11-29",
    "endDate": "2018-11-29",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2018-11-30",
    "endDate": "2018-12-03",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2018-12-04",
    "endDate": "2018-12-04",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2018-12-05",
    "endDate": "2018-12-21",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2018-12-22",
    "endDate": "2018-12-25",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2018-12-26",
    "endDate": "2018-12-26",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2018-12-27",
    "endDate": "2018-12-27",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2018-12-28",
    "endDate": "2018-12-29",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2018-12-30",
    "endDate": "2018-12-30",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2018-12-31",
    "endDate": "2019-01-02",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2019-01-03",
    "endDate": "2019-01-03",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2019-01-04",
    "endDate": "2019-01-04",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2019-01-05",
    "endDate": "2019-01-05",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2019-01-06",
    "endDate": "2019-01-07",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2019-01-08",
    "endDate": "2019-01-10",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2019-01-11",
    "endDate": "2019-02-21",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2019-02-22",
    "endDate": "2019-02-22",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2019-02-23",
    "endDate": "2019-03-15",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2019-03-16",
    "endDate": "2019-03-16",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2019-03-17",
    "endDate": "2019-03-17",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2019-03-18",
    "endDate": "2019-03-20",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2019-03-21",
    "endDate": "2019-03-21",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2019-03-22",
    "endDate": "2019-03-22",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2019-03-23",
    "endDate": "2019-03-26",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2019-03-27",
    "endDate": "2021-01-02",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-01-03",
    "endDate": "2021-01-03",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-01-04",
    "endDate": "2021-01-04",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-01-05",
    "endDate": "2021-01-05",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-01-06",
    "endDate": "2021-01-15",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-01-16",
    "endDate": "2021-01-18",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-01-19",
    "endDate": "2021-01-19",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-01-20",
    "endDate": "2021-01-23",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-01-24",
    "endDate": "2021-01-24",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-01-25",
    "endDate": "2021-01-26",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-01-27",
    "endDate": "2021-01-28",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-01-29",
    "endDate": "2021-01-31",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-02-01",
    "endDate": "2021-02-01",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-02-02",
    "endDate": "2021-02-03",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-02-04",
    "endDate": "2021-05-13",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-05-14",
    "endDate": "2021-05-16",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-05-17",
    "endDate": "2021-10-24",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-10-25",
    "endDate": "2021-10-25",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-10-26",
    "endDate": "2022-06-30",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-07-01",
    "endDate": "2022-07-02",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-07-03",
    "endDate": "2022-07-03",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-07-04",
    "endDate": "2022-07-05",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-07-06",
    "endDate": "2022-07-10",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-07-11",
    "endDate": "2022-07-11",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-07-12",
    "endDate": "2022-07-12",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-07-13",
    "endDate": "2022-07-14",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-07-15",
    "endDate": "2022-08-26",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-08-27",
    "endDate": "2022-08-27",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-08-28",
    "endDate": "2022-08-28",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-08-29",
    "endDate": "2022-08-29",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-08-30",
    "endDate": "2022-08-30",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-08-31",
    "endDate": "2022-09-03",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-09-04",
    "endDate": "2022-09-04",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-09-05",
    "endDate": "2022-09-09",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-09-10",
    "endDate": "2022-09-13",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-09-14",
    "endDate": "2022-09-17",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-09-18",
    "endDate": "2022-09-18",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-09-19",
    "endDate": "2022-09-29",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-09-30",
    "endDate": "2022-10-01",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-10-02",
    "endDate": "2022-10-03",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-10-04",
    "endDate": "2022-10-10",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-10-11",
    "endDate": "2022-10-25",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-10-26",
    "endDate": "2022-11-01",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-11-02",
    "endDate": "2022-11-02",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-11-03",
    "endDate": "2022-11-08",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-11-09",
    "endDate": "2023-01-05",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2023-01-06",
    "endDate": "2023-01-06",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2023-01-07",
    "endDate": "2023-01-09",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2023-01-10",
    "endDate": "2023-01-10",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2023-01-11",
    "endDate": "2023-01-11",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2023-01-12",
    "endDate": "2024-03-10",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-03-11",
    "endDate": "2024-03-11",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-03-12",
    "endDate": "2024-03-12",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2024-03-13",
    "endDate": "2024-03-14",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-03-15",
    "endDate": "2024-04-19",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2024-04-20",
    "endDate": "2024-04-20",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-04-21",
    "endDate": "2024-06-06",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2024-06-07",
    "endDate": "2024-06-07",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-06-08",
    "endDate": "2024-11-17",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2024-11-18",
    "endDate": "2024-11-19",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-11-20",
    "endDate": "2024-11-20",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2024-11-21",
    "endDate": "2024-11-23",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-11-24",
    "endDate": "2024-11-24",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2024-11-25",
    "endDate": "2024-11-25",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-11-26",
    "endDate": "2024-11-27",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2024-11-28",
    "endDate": "2024-11-28",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-11-29",
    "endDate": "2024-11-29",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2024-11-30",
    "endDate": "2024-12-01",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-12-02",
    "endDate": "2024-12-02",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2024-12-03",
    "endDate": "2024-12-23",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-12-24",
    "endDate": "2024-12-24",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2024-12-25",
    "endDate": "2024-12-25",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-12-26",
    "endDate": "2024-12-26",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2024-12-27",
    "endDate": "2024-12-27",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-12-28",
    "endDate": "2024-12-28",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2024-12-29",
    "endDate": "2024-12-30",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2024-12-31",
    "endDate": "2025-01-01",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2025-01-02",
    "endDate": "2025-01-02",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2025-01-03",
    "endDate": "2025-01-03",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2025-01-04",
    "endDate": "2025-01-05",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2025-01-06",
    "endDate": "2025-01-11",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2025-01-12",
    "endDate": "2025-01-12",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2025-01-13",
    "endDate": "2025-01-13",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2025-01-14",
    "endDate": "2025-01-14",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2025-01-15",
    "endDate": "2025-01-16",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2025-01-17",
    "endDate": "2025-01-17",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2025-01-18",
    "endDate": "2025-01-18",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2025-01-19",
    "endDate": "2025-01-30",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2025-01-31",
    "endDate": "2025-01-31",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2025-02-01",
    "endDate": "2025-02-03",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2025-02-04",
    "endDate": "2025-02-04",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2025-02-05",
    "endDate": "2025-02-08",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2025-02-09",
    "endDate": "2025-05-27",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2025-05-28",
    "endDate": "2025-05-28",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2025-05-29",
    "endDate": "2025-07-14",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2025-07-15",
    "endDate": "2025-07-15",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2025-07-16",
    "endDate": "2025-07-16",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2025-07-17",
    "endDate": "2025-07-28",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2025-07-29",
    "endDate": "2025-08-13",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2025-08-14",
    "endDate": "2025-08-14",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2025-08-15",
    "endDate": "2026-01-30",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  }
];

window.cbbiFiboZonesCycle = cbbiFiboZonesCycle;
