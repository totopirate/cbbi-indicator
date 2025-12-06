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
    "endDate": "2011-10-16",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": null
    }
  },
  {
    "startDate": "2011-10-17",
    "endDate": "2011-12-12",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2011-12-13",
    "endDate": "2011-12-14",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2011-12-15",
    "endDate": "2011-12-16",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2011-12-17",
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
    "endDate": "2013-11-22",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2013-11-23",
    "endDate": "2013-12-06",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2013-12-07",
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
    "endDate": "2013-12-16",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2013-12-17",
    "endDate": "2015-01-03",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-01-04",
    "endDate": "2015-07-11",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-07-12",
    "endDate": "2015-07-15",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-07-16",
    "endDate": "2015-07-23",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-07-24",
    "endDate": "2015-08-08",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2015-08-09",
    "endDate": "2015-10-13",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2015-10-14",
    "endDate": "2017-11-19",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2017-11-20",
    "endDate": "2017-11-27",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2017-11-28",
    "endDate": "2018-01-14",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2018-01-15",
    "endDate": "2018-01-17",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2018-01-18",
    "endDate": "2018-01-19",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2018-01-20",
    "endDate": "2018-01-21",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2018-01-22",
    "endDate": "2018-11-25",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2018-11-26",
    "endDate": "2018-11-29",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2018-11-30",
    "endDate": "2018-11-30",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2018-12-01",
    "endDate": "2019-04-01",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2019-04-02",
    "endDate": "2021-01-06",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-01-07",
    "endDate": "2021-01-12",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-01-13",
    "endDate": "2021-01-13",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-01-14",
    "endDate": "2021-01-16",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-01-17",
    "endDate": "2021-02-05",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-02-06",
    "endDate": "2021-02-09",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-02-10",
    "endDate": "2021-04-22",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-04-23",
    "endDate": "2021-05-01",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-05-02",
    "endDate": "2021-05-04",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-05-05",
    "endDate": "2021-05-05",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-05-06",
    "endDate": "2021-05-10",
    "zone": {
      "min": 90,
      "max": 100,
      "direction": "up"
    }
  },
  {
    "startDate": "2021-05-11",
    "endDate": "2021-05-13",
    "zone": {
      "min": 85.4,
      "max": 90,
      "direction": "down"
    }
  },
  {
    "startDate": "2021-05-14",
    "endDate": "2022-06-18",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-06-19",
    "endDate": "2022-06-20",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-06-21",
    "endDate": "2022-06-21",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-06-22",
    "endDate": "2022-07-19",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2022-07-20",
    "endDate": "2022-08-19",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  },
  {
    "startDate": "2022-08-20",
    "endDate": "2023-01-14",
    "zone": {
      "min": 0,
      "max": 14.6,
      "direction": "down"
    }
  },
  {
    "startDate": "2023-01-15",
    "endDate": "2025-12-06",
    "zone": {
      "min": 14.6,
      "max": 85.4,
      "direction": "up"
    }
  }
];

window.cbbiFiboZonesCycle = cbbiFiboZonesCycle;
