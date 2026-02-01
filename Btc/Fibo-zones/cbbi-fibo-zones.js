



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
// ====================================================================================================================================
//                                Palette des couleurs des zones fibo (du plus petit au plus grand)


// Palette des couleurs des zones fibo (du plus petit au plus grand)
const zonebtcColors = [
  { min: 0.45, max: 14.6, color: 'rgba(216, 176, 240, 0.9)' },
  { min: 14.60, max: 23.60, color: 'rgba(233, 157, 15, 0.9)' },
  { min: 23.59, max: 38.20, color: 'rgba(231, 231, 28, 0.9)' },
  { min: 38.20, max: 50.00, color: 'rgba(43, 146, 23, 0.9)' },
  { min: 50.00, max: 61.80, color: 'rgba(9, 217, 245, 0.9)' },
  { min: 61.80, max: 78.60, color: 'rgba(107, 145, 224, 0.9)' },
  { min: 78.60, max: 85.40, color: 'rgba(216, 11, 11, 0.9)' },
  { min: 85.40, max: 90.00, color: 'rgba(195, 195, 196, 0.9)' },
  { min: 90.00, max: 100, color: 'rgba(0, 0, 0, 0.9)' },
];






//  5.2 :
// ===================================================================================================================================
//                                Fonction qui colore la ligne BTC par segments selon zones fibo


let coloredLineSegments = [];
let segmentsVisible = false;

// Parse la zone "min-max" en {min, max} float
function parseZone(zoneInput) {
  if (typeof zoneInput === 'string') {
    const parts = zoneInput.split('-').map(s => parseFloat(s));
    return { min: parts[0], max: parts[1] };
  } else if (typeof zoneInput === 'object' && zoneInput.min !== undefined && zoneInput.max !== undefined) {
    return zoneInput; // déjà bien formaté
  } else {
    console.error('Format de zone non reconnu :', zoneInput);
    return { min: 0, max: 0 };
  }
}


// Trouve la couleur dans zonebtcColors selon la zone (avec recoupement)
function getColorForZone(zoneStr) {
  const { min: zoneMin, max: zoneMax } = parseZone(zoneStr);

  for (const zone of zonebtcColors) {
    // Recoupement souple : les zones se chevauchent
    if (!(zoneMax <= zone.min || zoneMin >= zone.max)) {
      return zone.color;
    }
  }
  return 'rgba(0,0,0,0.5)'; // couleur défaut
}


function toggleCBBILineSegments(chart, cbbiFiboZones) {
  if (segmentsVisible) {
    coloredLineSegments.forEach(series => chart.removeSeries(series));
    coloredLineSegments = [];
    segmentsVisible = false;
    return;
  }

  const btcDataToUse = window.currentScale === 'log' ? window.btcPriceDataLog : window.btcPriceDataArith;

  cbbiFiboZones.forEach(zone => {
    const startTime = Math.floor(new Date(zone.startDate).getTime() / 1000);
    const endTime = Math.floor(new Date(zone.endDate).getTime() / 1000);
    const color = getColorForZone(zone.zone);

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
      coloredLineSegments.push(lineSeries);
    }
  });

  segmentsVisible = true;
}


//  5.3 :
// ===================================================================================================================================
//                                Ecouteur bouton clic

document.getElementById('zonefibobtcBtn').addEventListener('click', () => {
  if (window.chartInstance && window.btcPriceData && window.cbbiFiboZones) {
    toggleCBBILineSegments(window.chartInstance, window.cbbiFiboZones, window.btcPriceData);
  } else {
    console.warn('Le graphique BTC, les données BTC ou les zones CBBI/Fibo ne sont pas encore initialisés.');
  }
});





//  5.4 :
// ===================================================================================================================================
//                                Données CBBI fibo zones intégrées directement (extrait, complète avec tes données)


const cbbiFiboZones = [
  {
    "startDate": "2011-06-27",
    "endDate": "2011-06-28",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2011-06-29",
    "endDate": "2011-06-30",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2011-07-01",
    "endDate": "2011-08-03",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2011-08-04",
    "endDate": "2011-08-06",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2011-08-07",
    "endDate": "2011-08-07",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2011-08-08",
    "endDate": "2011-08-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2011-08-20",
    "endDate": "2011-08-20",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2011-08-21",
    "endDate": "2011-08-26",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2011-08-27",
    "endDate": "2011-08-27",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2011-08-28",
    "endDate": "2011-09-03",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2011-09-04",
    "endDate": "2011-09-10",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2011-09-11",
    "endDate": "2011-09-11",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-09-12",
    "endDate": "2011-09-18",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2011-09-19",
    "endDate": "2011-09-19",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-09-20",
    "endDate": "2011-09-26",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2011-09-27",
    "endDate": "2011-09-30",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-10-01",
    "endDate": "2011-10-01",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2011-10-02",
    "endDate": "2011-10-04",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-10-05",
    "endDate": "2011-10-05",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2011-10-06",
    "endDate": "2011-10-06",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-10-07",
    "endDate": "2011-10-07",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2011-10-08",
    "endDate": "2011-10-12",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-10-13",
    "endDate": "2011-10-13",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2011-10-14",
    "endDate": "2011-10-15",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-10-16",
    "endDate": "2011-11-08",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2011-11-09",
    "endDate": "2011-11-09",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-11-10",
    "endDate": "2011-11-30",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2011-12-01",
    "endDate": "2011-12-01",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-12-02",
    "endDate": "2011-12-02",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2011-12-03",
    "endDate": "2011-12-03",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-12-04",
    "endDate": "2011-12-04",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2011-12-05",
    "endDate": "2011-12-05",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-12-06",
    "endDate": "2011-12-18",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2011-12-19",
    "endDate": "2011-12-24",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-12-25",
    "endDate": "2011-12-27",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2011-12-28",
    "endDate": "2011-12-29",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-12-30",
    "endDate": "2011-12-30",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2011-12-31",
    "endDate": "2011-12-31",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-01-01",
    "endDate": "2012-01-06",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-01-07",
    "endDate": "2012-01-07",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-01-08",
    "endDate": "2012-01-08",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-01-09",
    "endDate": "2012-01-09",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-01-10",
    "endDate": "2012-01-10",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-01-11",
    "endDate": "2012-01-11",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-01-12",
    "endDate": "2012-01-12",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-01-13",
    "endDate": "2012-01-13",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-01-14",
    "endDate": "2012-01-16",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-01-17",
    "endDate": "2012-01-17",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-01-18",
    "endDate": "2012-02-14",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-02-15",
    "endDate": "2012-02-24",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-02-25",
    "endDate": "2012-02-25",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-02-26",
    "endDate": "2012-02-26",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-02-27",
    "endDate": "2012-02-29",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-03-01",
    "endDate": "2012-03-06",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-03-07",
    "endDate": "2012-03-10",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-03-11",
    "endDate": "2012-03-11",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-03-12",
    "endDate": "2012-03-12",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-03-13",
    "endDate": "2012-03-13",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-03-14",
    "endDate": "2012-03-14",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-03-15",
    "endDate": "2012-03-15",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-03-16",
    "endDate": "2012-03-20",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-03-21",
    "endDate": "2012-03-23",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-03-24",
    "endDate": "2012-03-24",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-03-25",
    "endDate": "2012-03-30",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-03-31",
    "endDate": "2012-03-31",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-04-01",
    "endDate": "2012-04-09",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-04-10",
    "endDate": "2012-04-10",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-04-11",
    "endDate": "2012-04-18",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-04-19",
    "endDate": "2012-04-23",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-04-24",
    "endDate": "2012-04-25",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-04-26",
    "endDate": "2012-04-29",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-04-30",
    "endDate": "2012-05-04",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-05-05",
    "endDate": "2012-05-08",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-05-09",
    "endDate": "2012-05-26",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-05-27",
    "endDate": "2012-05-27",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-05-28",
    "endDate": "2012-06-03",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-06-04",
    "endDate": "2012-06-04",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-06-05",
    "endDate": "2012-06-09",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-06-10",
    "endDate": "2012-06-10",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-06-11",
    "endDate": "2012-06-15",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-06-16",
    "endDate": "2012-06-18",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-06-19",
    "endDate": "2012-06-19",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-06-20",
    "endDate": "2012-06-23",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-06-24",
    "endDate": "2012-06-24",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-06-25",
    "endDate": "2012-06-26",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-06-27",
    "endDate": "2012-06-28",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-06-29",
    "endDate": "2012-06-29",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-06-30",
    "endDate": "2012-06-30",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-07-01",
    "endDate": "2012-07-29",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-07-30",
    "endDate": "2012-07-31",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-08-01",
    "endDate": "2012-08-02",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-08-03",
    "endDate": "2012-08-04",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-08-05",
    "endDate": "2012-08-05",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-08-06",
    "endDate": "2012-08-21",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-08-22",
    "endDate": "2012-08-24",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-08-25",
    "endDate": "2012-09-02",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-09-03",
    "endDate": "2012-09-03",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-09-04",
    "endDate": "2012-10-31",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-11-01",
    "endDate": "2012-11-01",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-11-02",
    "endDate": "2012-11-03",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-11-04",
    "endDate": "2012-11-04",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-11-05",
    "endDate": "2012-11-07",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-11-08",
    "endDate": "2012-11-08",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-11-09",
    "endDate": "2012-11-09",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-11-10",
    "endDate": "2012-11-10",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-11-11",
    "endDate": "2012-11-11",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-11-12",
    "endDate": "2012-11-13",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-11-14",
    "endDate": "2012-11-14",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-11-15",
    "endDate": "2012-11-15",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-11-16",
    "endDate": "2012-11-29",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-11-30",
    "endDate": "2012-11-30",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-12-01",
    "endDate": "2012-12-01",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-12-02",
    "endDate": "2012-12-07",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-12-08",
    "endDate": "2012-12-08",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-12-09",
    "endDate": "2012-12-09",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-12-10",
    "endDate": "2012-12-11",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-12-12",
    "endDate": "2013-01-18",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2013-01-19",
    "endDate": "2013-01-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2013-01-20",
    "endDate": "2013-01-21",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2013-01-22",
    "endDate": "2013-02-15",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2013-02-16",
    "endDate": "2013-02-16",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-02-17",
    "endDate": "2013-02-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2013-02-20",
    "endDate": "2013-03-16",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-03-17",
    "endDate": "2013-03-18",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-03-19",
    "endDate": "2013-03-19",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-03-20",
    "endDate": "2013-04-04",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-04-05",
    "endDate": "2013-04-09",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2013-04-10",
    "endDate": "2013-04-10",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2013-04-11",
    "endDate": "2013-04-11",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2013-04-12",
    "endDate": "2013-06-08",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-06-09",
    "endDate": "2013-06-09",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-06-10",
    "endDate": "2013-06-10",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-06-11",
    "endDate": "2013-06-11",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-06-12",
    "endDate": "2013-06-13",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-06-14",
    "endDate": "2013-08-31",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-09-01",
    "endDate": "2013-09-02",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-09-03",
    "endDate": "2013-09-13",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-09-14",
    "endDate": "2013-09-14",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-09-15",
    "endDate": "2013-10-07",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-10-08",
    "endDate": "2013-10-08",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-10-09",
    "endDate": "2013-10-11",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-10-12",
    "endDate": "2013-10-13",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-10-14",
    "endDate": "2013-10-14",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-10-15",
    "endDate": "2013-10-15",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-10-16",
    "endDate": "2013-10-17",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-10-18",
    "endDate": "2013-10-18",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-10-19",
    "endDate": "2013-10-19",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-10-20",
    "endDate": "2013-11-10",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-11-11",
    "endDate": "2013-11-11",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2013-11-12",
    "endDate": "2013-11-13",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-11-14",
    "endDate": "2013-11-18",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2013-11-19",
    "endDate": "2013-11-19",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2013-11-20",
    "endDate": "2013-11-20",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2013-11-21",
    "endDate": "2013-11-22",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2013-11-23",
    "endDate": "2013-12-07",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2013-12-08",
    "endDate": "2013-12-09",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2013-12-10",
    "endDate": "2013-12-11",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2013-12-12",
    "endDate": "2013-12-15",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2013-12-16",
    "endDate": "2013-12-16",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2013-12-17",
    "endDate": "2013-12-17",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2013-12-18",
    "endDate": "2013-12-20",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2013-12-21",
    "endDate": "2013-12-23",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-12-24",
    "endDate": "2013-12-24",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2013-12-25",
    "endDate": "2013-12-25",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-12-26",
    "endDate": "2013-12-27",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2013-12-28",
    "endDate": "2013-12-28",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-12-29",
    "endDate": "2013-12-30",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2013-12-31",
    "endDate": "2013-12-31",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-01-01",
    "endDate": "2014-01-01",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2014-01-02",
    "endDate": "2014-01-02",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-01-03",
    "endDate": "2014-01-15",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2014-01-16",
    "endDate": "2014-01-19",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-01-20",
    "endDate": "2014-01-20",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2014-01-21",
    "endDate": "2014-01-21",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-01-22",
    "endDate": "2014-01-23",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2014-01-24",
    "endDate": "2014-01-26",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-01-27",
    "endDate": "2014-01-27",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2014-01-28",
    "endDate": "2014-03-01",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-03-02",
    "endDate": "2014-03-03",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-03-04",
    "endDate": "2014-03-17",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-03-18",
    "endDate": "2014-03-18",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-03-19",
    "endDate": "2014-03-21",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-03-22",
    "endDate": "2014-03-22",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-03-23",
    "endDate": "2014-03-24",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-03-25",
    "endDate": "2014-03-26",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-03-27",
    "endDate": "2014-03-27",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-03-28",
    "endDate": "2014-04-06",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-04-07",
    "endDate": "2014-04-09",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-04-10",
    "endDate": "2014-04-10",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-04-11",
    "endDate": "2014-04-12",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-04-13",
    "endDate": "2014-04-14",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-04-15",
    "endDate": "2014-04-15",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-04-16",
    "endDate": "2014-04-27",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-04-28",
    "endDate": "2014-04-30",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-05-01",
    "endDate": "2014-05-01",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-05-02",
    "endDate": "2014-05-27",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-05-28",
    "endDate": "2014-05-28",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-05-29",
    "endDate": "2014-05-29",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-05-30",
    "endDate": "2014-05-30",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-05-31",
    "endDate": "2014-05-31",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-06-01",
    "endDate": "2014-06-17",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-06-18",
    "endDate": "2014-06-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-06-20",
    "endDate": "2014-06-20",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-06-21",
    "endDate": "2014-06-21",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-06-22",
    "endDate": "2014-06-23",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-06-24",
    "endDate": "2014-06-27",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-06-28",
    "endDate": "2014-06-28",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-06-29",
    "endDate": "2014-07-03",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-07-04",
    "endDate": "2014-07-04",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-07-05",
    "endDate": "2014-08-24",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-08-25",
    "endDate": "2014-08-25",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-08-26",
    "endDate": "2014-08-30",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-08-31",
    "endDate": "2014-09-02",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-09-03",
    "endDate": "2014-09-04",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-09-05",
    "endDate": "2014-09-05",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-09-06",
    "endDate": "2014-09-06",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-09-07",
    "endDate": "2014-09-12",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-09-13",
    "endDate": "2014-09-13",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-09-14",
    "endDate": "2014-10-05",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-10-06",
    "endDate": "2014-10-08",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2014-10-09",
    "endDate": "2014-10-10",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-10-11",
    "endDate": "2014-10-11",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2014-10-12",
    "endDate": "2014-10-25",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-10-26",
    "endDate": "2014-10-28",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2014-10-29",
    "endDate": "2014-10-29",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-10-30",
    "endDate": "2014-10-30",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2014-10-31",
    "endDate": "2014-10-31",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-11-01",
    "endDate": "2014-11-12",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2014-11-13",
    "endDate": "2014-11-18",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-11-19",
    "endDate": "2014-12-07",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2014-12-08",
    "endDate": "2014-12-08",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-12-09",
    "endDate": "2015-01-04",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-01-05",
    "endDate": "2015-01-09",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-01-10",
    "endDate": "2015-01-10",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-01-11",
    "endDate": "2015-01-27",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-01-28",
    "endDate": "2015-01-28",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-01-29",
    "endDate": "2015-03-09",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-03-10",
    "endDate": "2015-03-11",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-03-12",
    "endDate": "2015-07-09",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-07-10",
    "endDate": "2015-07-15",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-07-16",
    "endDate": "2015-07-16",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-07-17",
    "endDate": "2015-07-17",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-07-18",
    "endDate": "2015-07-23",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-07-24",
    "endDate": "2015-08-05",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-08-06",
    "endDate": "2015-08-06",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-08-07",
    "endDate": "2015-08-08",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-08-09",
    "endDate": "2015-08-09",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-08-10",
    "endDate": "2015-08-11",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-08-12",
    "endDate": "2015-08-16",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-08-17",
    "endDate": "2015-08-17",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-08-18",
    "endDate": "2015-09-09",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-09-10",
    "endDate": "2015-09-10",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-09-11",
    "endDate": "2015-09-25",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-09-26",
    "endDate": "2015-09-26",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-09-27",
    "endDate": "2015-09-28",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-09-29",
    "endDate": "2015-09-29",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-09-30",
    "endDate": "2015-10-09",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-10-10",
    "endDate": "2015-10-10",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-10-11",
    "endDate": "2015-10-13",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-10-14",
    "endDate": "2015-11-01",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-11-02",
    "endDate": "2015-11-12",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2015-11-13",
    "endDate": "2015-11-13",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-11-14",
    "endDate": "2015-11-18",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2015-11-19",
    "endDate": "2015-11-19",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-11-20",
    "endDate": "2015-11-20",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2015-11-21",
    "endDate": "2015-11-22",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-11-23",
    "endDate": "2015-11-23",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2015-11-24",
    "endDate": "2015-11-25",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-11-26",
    "endDate": "2015-11-26",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2015-11-27",
    "endDate": "2015-11-27",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-11-28",
    "endDate": "2016-06-04",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-06-05",
    "endDate": "2016-06-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-06-20",
    "endDate": "2016-06-20",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2016-06-21",
    "endDate": "2016-08-03",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-08-04",
    "endDate": "2016-08-04",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-08-05",
    "endDate": "2016-08-05",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-08-06",
    "endDate": "2016-08-07",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-08-08",
    "endDate": "2016-08-08",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-08-09",
    "endDate": "2016-08-12",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-08-13",
    "endDate": "2016-08-13",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-08-14",
    "endDate": "2016-08-29",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-08-30",
    "endDate": "2016-08-30",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-08-31",
    "endDate": "2016-09-03",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-09-04",
    "endDate": "2016-09-04",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-09-05",
    "endDate": "2016-09-09",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-09-10",
    "endDate": "2016-09-15",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-09-16",
    "endDate": "2016-09-16",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-09-17",
    "endDate": "2016-09-17",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-09-18",
    "endDate": "2016-09-20",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-09-21",
    "endDate": "2016-09-21",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-09-22",
    "endDate": "2016-09-24",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-09-25",
    "endDate": "2016-09-25",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-09-26",
    "endDate": "2016-09-26",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-09-27",
    "endDate": "2016-09-27",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-09-28",
    "endDate": "2016-10-04",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-10-05",
    "endDate": "2016-10-06",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-10-07",
    "endDate": "2016-10-07",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-10-08",
    "endDate": "2016-10-09",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-10-10",
    "endDate": "2016-10-17",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-10-18",
    "endDate": "2016-10-18",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-10-19",
    "endDate": "2016-10-20",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-10-21",
    "endDate": "2016-12-29",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-12-30",
    "endDate": "2016-12-30",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2016-12-31",
    "endDate": "2017-01-01",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-01-02",
    "endDate": "2017-01-06",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-01-07",
    "endDate": "2017-01-09",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-01-10",
    "endDate": "2017-01-10",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-01-11",
    "endDate": "2017-02-01",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-02-02",
    "endDate": "2017-02-02",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-02-03",
    "endDate": "2017-02-04",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-02-05",
    "endDate": "2017-02-05",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-02-06",
    "endDate": "2017-02-06",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-02-07",
    "endDate": "2017-02-10",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-02-11",
    "endDate": "2017-02-12",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-02-13",
    "endDate": "2017-02-14",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-02-15",
    "endDate": "2017-02-15",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-02-16",
    "endDate": "2017-02-16",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-02-17",
    "endDate": "2017-02-17",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-02-18",
    "endDate": "2017-03-24",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-03-25",
    "endDate": "2017-03-27",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-03-28",
    "endDate": "2017-03-28",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-03-29",
    "endDate": "2017-04-01",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-04-02",
    "endDate": "2017-04-03",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-04-04",
    "endDate": "2017-04-04",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-04-05",
    "endDate": "2017-05-06",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-05-07",
    "endDate": "2017-05-08",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-05-09",
    "endDate": "2017-05-09",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-05-10",
    "endDate": "2017-08-12",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-08-13",
    "endDate": "2017-08-13",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-08-14",
    "endDate": "2017-08-14",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-08-15",
    "endDate": "2017-08-19",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-08-20",
    "endDate": "2017-08-22",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-08-23",
    "endDate": "2017-08-23",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-08-24",
    "endDate": "2017-08-26",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-08-27",
    "endDate": "2017-08-31",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-09-01",
    "endDate": "2017-09-01",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2017-09-02",
    "endDate": "2017-09-09",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-09-10",
    "endDate": "2017-09-10",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-09-11",
    "endDate": "2017-09-13",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-09-14",
    "endDate": "2017-10-12",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-10-13",
    "endDate": "2017-10-27",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-10-28",
    "endDate": "2017-10-28",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-10-29",
    "endDate": "2017-11-01",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-11-02",
    "endDate": "2017-11-02",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2017-11-03",
    "endDate": "2017-11-04",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-11-05",
    "endDate": "2017-11-09",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2017-11-10",
    "endDate": "2017-11-10",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-11-11",
    "endDate": "2017-11-11",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-11-12",
    "endDate": "2017-11-12",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-11-13",
    "endDate": "2017-11-13",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2017-11-14",
    "endDate": "2017-11-14",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-11-15",
    "endDate": "2017-11-16",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2017-11-17",
    "endDate": "2017-11-17",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2017-11-18",
    "endDate": "2017-11-20",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2017-11-21",
    "endDate": "2017-11-21",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2017-11-22",
    "endDate": "2017-11-22",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2017-11-23",
    "endDate": "2017-11-23",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2017-11-24",
    "endDate": "2017-11-25",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2017-11-26",
    "endDate": "2018-01-15",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2018-01-16",
    "endDate": "2018-01-22",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2018-01-23",
    "endDate": "2018-01-30",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2018-01-31",
    "endDate": "2018-02-03",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2018-02-04",
    "endDate": "2018-02-04",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2018-02-05",
    "endDate": "2018-02-20",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2018-02-21",
    "endDate": "2018-02-21",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2018-02-22",
    "endDate": "2018-03-02",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2018-03-03",
    "endDate": "2018-03-03",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2018-03-04",
    "endDate": "2018-03-30",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2018-03-31",
    "endDate": "2018-03-31",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2018-04-01",
    "endDate": "2018-04-01",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2018-04-02",
    "endDate": "2018-04-02",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2018-04-03",
    "endDate": "2018-04-03",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2018-04-04",
    "endDate": "2018-04-16",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2018-04-17",
    "endDate": "2018-04-19",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2018-04-20",
    "endDate": "2018-04-20",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2018-04-21",
    "endDate": "2018-05-10",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2018-05-11",
    "endDate": "2018-05-11",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2018-05-12",
    "endDate": "2018-05-12",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2018-05-13",
    "endDate": "2018-05-15",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2018-05-16",
    "endDate": "2018-05-16",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2018-05-17",
    "endDate": "2018-06-09",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2018-06-10",
    "endDate": "2018-07-23",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-07-24",
    "endDate": "2018-07-27",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2018-07-28",
    "endDate": "2018-07-28",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-07-29",
    "endDate": "2018-07-29",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2018-07-30",
    "endDate": "2018-07-30",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-07-31",
    "endDate": "2018-07-31",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2018-08-01",
    "endDate": "2018-08-13",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-08-14",
    "endDate": "2018-08-14",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2018-08-15",
    "endDate": "2018-09-09",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-09-10",
    "endDate": "2018-09-11",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2018-09-12",
    "endDate": "2018-09-12",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-09-13",
    "endDate": "2018-09-18",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2018-09-19",
    "endDate": "2018-09-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-09-20",
    "endDate": "2018-09-21",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2018-09-22",
    "endDate": "2018-09-23",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-09-24",
    "endDate": "2018-09-27",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2018-09-28",
    "endDate": "2018-10-01",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-10-02",
    "endDate": "2018-11-20",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2018-11-21",
    "endDate": "2018-11-25",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2018-11-26",
    "endDate": "2018-11-28",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2018-11-29",
    "endDate": "2018-11-29",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2018-11-30",
    "endDate": "2018-12-03",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2018-12-04",
    "endDate": "2018-12-04",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2018-12-05",
    "endDate": "2018-12-21",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2018-12-22",
    "endDate": "2018-12-25",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2018-12-26",
    "endDate": "2018-12-26",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2018-12-27",
    "endDate": "2018-12-27",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2018-12-28",
    "endDate": "2018-12-29",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2018-12-30",
    "endDate": "2018-12-30",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2018-12-31",
    "endDate": "2019-01-02",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2019-01-03",
    "endDate": "2019-01-03",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-01-04",
    "endDate": "2019-01-04",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2019-01-05",
    "endDate": "2019-01-05",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-01-06",
    "endDate": "2019-01-07",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2019-01-08",
    "endDate": "2019-01-10",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-01-11",
    "endDate": "2019-02-21",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2019-02-22",
    "endDate": "2019-02-22",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-02-23",
    "endDate": "2019-03-15",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2019-03-16",
    "endDate": "2019-03-16",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-03-17",
    "endDate": "2019-03-17",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2019-03-18",
    "endDate": "2019-03-20",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-03-21",
    "endDate": "2019-03-21",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2019-03-22",
    "endDate": "2019-03-22",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-03-23",
    "endDate": "2019-03-26",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2019-03-27",
    "endDate": "2019-04-02",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-04-03",
    "endDate": "2019-04-13",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2019-04-14",
    "endDate": "2019-04-14",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-04-15",
    "endDate": "2019-05-11",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2019-05-12",
    "endDate": "2019-05-26",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-05-27",
    "endDate": "2019-05-30",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-05-31",
    "endDate": "2019-06-17",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-06-18",
    "endDate": "2019-06-25",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-06-26",
    "endDate": "2019-06-27",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2019-06-28",
    "endDate": "2019-06-28",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-06-29",
    "endDate": "2019-06-29",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2019-06-30",
    "endDate": "2019-07-03",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-07-04",
    "endDate": "2019-07-05",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2019-07-06",
    "endDate": "2019-07-07",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-07-08",
    "endDate": "2019-07-09",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2019-07-10",
    "endDate": "2019-09-22",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-09-23",
    "endDate": "2019-09-23",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-09-24",
    "endDate": "2019-09-24",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-09-25",
    "endDate": "2019-11-21",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-11-22",
    "endDate": "2019-11-22",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2019-11-23",
    "endDate": "2019-11-23",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-11-24",
    "endDate": "2019-11-27",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2019-11-28",
    "endDate": "2019-11-28",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-11-29",
    "endDate": "2019-12-03",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2019-12-04",
    "endDate": "2019-12-04",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-12-05",
    "endDate": "2019-12-20",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2019-12-21",
    "endDate": "2019-12-21",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-12-22",
    "endDate": "2020-01-06",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-01-07",
    "endDate": "2020-03-09",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-03-10",
    "endDate": "2020-03-12",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-03-13",
    "endDate": "2020-03-19",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2020-03-20",
    "endDate": "2020-03-22",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-03-23",
    "endDate": "2020-03-23",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2020-03-24",
    "endDate": "2020-03-24",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-03-25",
    "endDate": "2020-03-25",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2020-03-26",
    "endDate": "2020-04-29",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-04-30",
    "endDate": "2020-05-10",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-05-11",
    "endDate": "2020-05-11",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-05-12",
    "endDate": "2020-05-21",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-05-22",
    "endDate": "2020-05-26",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-05-27",
    "endDate": "2020-06-17",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-06-18",
    "endDate": "2020-06-18",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-06-19",
    "endDate": "2020-07-16",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-07-17",
    "endDate": "2020-07-19",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-07-20",
    "endDate": "2020-08-02",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-08-03",
    "endDate": "2020-08-03",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-08-04",
    "endDate": "2020-08-05",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-08-06",
    "endDate": "2020-08-16",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-08-17",
    "endDate": "2020-08-17",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-08-18",
    "endDate": "2020-08-22",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-08-23",
    "endDate": "2020-08-23",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-08-24",
    "endDate": "2020-08-24",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-08-25",
    "endDate": "2020-08-27",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-08-28",
    "endDate": "2020-08-28",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-08-29",
    "endDate": "2020-08-31",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-09-01",
    "endDate": "2020-09-02",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-09-03",
    "endDate": "2020-09-06",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-09-07",
    "endDate": "2020-09-07",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-09-08",
    "endDate": "2020-09-16",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-09-17",
    "endDate": "2020-09-17",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-09-18",
    "endDate": "2020-09-24",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-09-25",
    "endDate": "2020-09-25",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-09-26",
    "endDate": "2020-10-12",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-10-13",
    "endDate": "2020-10-13",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-10-14",
    "endDate": "2020-10-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-10-20",
    "endDate": "2020-11-04",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-11-05",
    "endDate": "2020-11-07",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2020-11-08",
    "endDate": "2020-11-08",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-11-09",
    "endDate": "2020-11-10",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2020-11-11",
    "endDate": "2020-11-12",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-11-13",
    "endDate": "2020-11-13",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2020-11-14",
    "endDate": "2020-11-14",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-11-15",
    "endDate": "2020-12-26",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2020-12-27",
    "endDate": "2021-01-02",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-01-03",
    "endDate": "2021-01-03",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-01-04",
    "endDate": "2021-01-04",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2021-01-05",
    "endDate": "2021-01-05",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-01-06",
    "endDate": "2021-01-15",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2021-01-16",
    "endDate": "2021-01-18",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-01-19",
    "endDate": "2021-01-19",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2021-01-20",
    "endDate": "2021-01-23",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-01-24",
    "endDate": "2021-01-24",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-01-25",
    "endDate": "2021-01-26",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-01-27",
    "endDate": "2021-01-28",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-01-29",
    "endDate": "2021-01-31",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-02-01",
    "endDate": "2021-02-01",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-02-02",
    "endDate": "2021-02-03",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-02-04",
    "endDate": "2021-05-13",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2021-05-14",
    "endDate": "2021-05-16",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-05-17",
    "endDate": "2021-05-19",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-05-20",
    "endDate": "2021-06-21",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-06-22",
    "endDate": "2021-06-22",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2021-06-23",
    "endDate": "2021-06-25",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-06-26",
    "endDate": "2021-06-30",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2021-07-01",
    "endDate": "2021-07-01",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-07-02",
    "endDate": "2021-07-02",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2021-07-03",
    "endDate": "2021-07-14",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-07-15",
    "endDate": "2021-07-15",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2021-07-16",
    "endDate": "2021-07-19",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-07-20",
    "endDate": "2021-07-21",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2021-07-22",
    "endDate": "2021-07-22",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-07-23",
    "endDate": "2021-07-23",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2021-07-24",
    "endDate": "2021-08-20",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-08-21",
    "endDate": "2021-08-21",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-08-22",
    "endDate": "2021-09-05",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-09-06",
    "endDate": "2021-09-06",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-09-07",
    "endDate": "2021-10-09",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-10-10",
    "endDate": "2021-10-10",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-10-11",
    "endDate": "2021-10-12",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-10-13",
    "endDate": "2021-10-13",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-10-14",
    "endDate": "2021-10-14",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-10-15",
    "endDate": "2021-10-24",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-10-25",
    "endDate": "2021-10-25",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-10-26",
    "endDate": "2021-11-18",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-11-19",
    "endDate": "2021-11-23",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-11-24",
    "endDate": "2021-11-24",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-11-25",
    "endDate": "2021-12-29",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-12-30",
    "endDate": "2021-12-30",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2021-12-31",
    "endDate": "2022-01-06",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2022-01-07",
    "endDate": "2022-01-12",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-01-13",
    "endDate": "2022-01-13",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2022-01-14",
    "endDate": "2022-01-18",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-01-19",
    "endDate": "2022-01-20",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2022-01-21",
    "endDate": "2022-02-11",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-02-12",
    "endDate": "2022-02-12",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2022-02-13",
    "endDate": "2022-02-20",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-02-21",
    "endDate": "2022-02-21",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-02-22",
    "endDate": "2022-02-23",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-02-24",
    "endDate": "2022-02-25",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-02-26",
    "endDate": "2022-04-15",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-04-16",
    "endDate": "2022-04-16",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-04-17",
    "endDate": "2022-04-17",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-04-18",
    "endDate": "2022-04-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-04-20",
    "endDate": "2022-04-21",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-04-22",
    "endDate": "2022-04-22",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-04-23",
    "endDate": "2022-04-25",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-04-26",
    "endDate": "2022-04-26",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-04-27",
    "endDate": "2022-04-27",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-04-28",
    "endDate": "2022-04-30",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-05-01",
    "endDate": "2022-05-01",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-05-02",
    "endDate": "2022-05-04",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-05-05",
    "endDate": "2022-05-05",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-05-06",
    "endDate": "2022-05-11",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-05-12",
    "endDate": "2022-05-12",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2022-05-13",
    "endDate": "2022-05-13",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-05-14",
    "endDate": "2022-05-15",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2022-05-16",
    "endDate": "2022-05-17",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-05-18",
    "endDate": "2022-05-22",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2022-05-23",
    "endDate": "2022-05-23",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-05-24",
    "endDate": "2022-06-05",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2022-06-06",
    "endDate": "2022-06-08",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-06-09",
    "endDate": "2022-06-15",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2022-06-16",
    "endDate": "2022-06-30",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-07-01",
    "endDate": "2022-07-02",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-07-03",
    "endDate": "2022-07-03",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-07-04",
    "endDate": "2022-07-05",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-07-06",
    "endDate": "2022-07-10",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-07-11",
    "endDate": "2022-07-11",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-07-12",
    "endDate": "2022-07-12",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-07-13",
    "endDate": "2022-07-14",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-07-15",
    "endDate": "2022-08-18",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-08-19",
    "endDate": "2022-08-19",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2022-08-20",
    "endDate": "2022-08-26",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-08-27",
    "endDate": "2022-08-27",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-08-28",
    "endDate": "2022-08-28",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-08-29",
    "endDate": "2022-08-29",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-08-30",
    "endDate": "2022-08-30",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-08-31",
    "endDate": "2022-09-03",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-09-04",
    "endDate": "2022-09-04",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-09-05",
    "endDate": "2022-09-09",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-09-10",
    "endDate": "2022-09-13",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-09-14",
    "endDate": "2022-09-17",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-09-18",
    "endDate": "2022-09-18",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-09-19",
    "endDate": "2022-09-29",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-09-30",
    "endDate": "2022-10-01",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-10-02",
    "endDate": "2022-10-03",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-10-04",
    "endDate": "2022-10-10",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-10-11",
    "endDate": "2022-10-25",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-10-26",
    "endDate": "2022-11-01",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-11-02",
    "endDate": "2022-11-02",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-11-03",
    "endDate": "2022-11-08",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-11-09",
    "endDate": "2023-01-05",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2023-01-06",
    "endDate": "2023-01-06",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2023-01-07",
    "endDate": "2023-01-09",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2023-01-10",
    "endDate": "2023-01-10",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2023-01-11",
    "endDate": "2023-01-11",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2023-01-12",
    "endDate": "2023-01-20",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2023-01-21",
    "endDate": "2023-01-23",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-01-24",
    "endDate": "2023-01-24",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2023-01-25",
    "endDate": "2023-01-30",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-01-31",
    "endDate": "2023-01-31",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2023-02-01",
    "endDate": "2023-02-24",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-02-25",
    "endDate": "2023-02-25",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2023-02-26",
    "endDate": "2023-03-09",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-03-10",
    "endDate": "2023-03-10",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2023-03-11",
    "endDate": "2023-03-17",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-03-18",
    "endDate": "2023-03-27",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-03-28",
    "endDate": "2023-03-28",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-03-29",
    "endDate": "2023-04-09",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-04-10",
    "endDate": "2023-04-10",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-04-11",
    "endDate": "2023-04-24",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-04-25",
    "endDate": "2023-04-25",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-04-26",
    "endDate": "2023-05-06",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-05-07",
    "endDate": "2023-05-09",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2023-05-10",
    "endDate": "2023-06-13",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-06-14",
    "endDate": "2023-06-14",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-06-15",
    "endDate": "2023-06-29",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-06-30",
    "endDate": "2023-06-30",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2023-07-01",
    "endDate": "2023-07-01",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-07-02",
    "endDate": "2023-07-02",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2023-07-03",
    "endDate": "2023-07-06",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-07-07",
    "endDate": "2023-07-09",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2023-07-10",
    "endDate": "2023-08-18",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-08-19",
    "endDate": "2023-08-19",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-08-20",
    "endDate": "2023-08-24",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-08-25",
    "endDate": "2023-08-28",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-08-29",
    "endDate": "2023-08-29",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-08-30",
    "endDate": "2023-08-30",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-08-31",
    "endDate": "2023-09-04",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-09-05",
    "endDate": "2023-09-09",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-09-10",
    "endDate": "2023-09-11",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-09-12",
    "endDate": "2023-09-13",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-09-14",
    "endDate": "2023-09-21",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-09-22",
    "endDate": "2023-09-22",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-09-23",
    "endDate": "2023-09-24",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-09-25",
    "endDate": "2023-09-26",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-09-27",
    "endDate": "2023-10-24",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-10-25",
    "endDate": "2023-12-02",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2023-12-03",
    "endDate": "2024-01-14",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-01-15",
    "endDate": "2024-01-15",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-01-16",
    "endDate": "2024-01-23",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-01-24",
    "endDate": "2024-01-25",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-01-26",
    "endDate": "2024-02-28",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-02-29",
    "endDate": "2024-03-01",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-03-02",
    "endDate": "2024-03-02",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-03-03",
    "endDate": "2024-03-10",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-03-11",
    "endDate": "2024-03-11",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-03-12",
    "endDate": "2024-03-12",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-03-13",
    "endDate": "2024-03-14",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-03-15",
    "endDate": "2024-04-16",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-04-17",
    "endDate": "2024-04-18",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-04-19",
    "endDate": "2024-04-19",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-04-20",
    "endDate": "2024-04-20",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-04-21",
    "endDate": "2024-04-24",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-04-25",
    "endDate": "2024-05-21",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-05-22",
    "endDate": "2024-05-25",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-05-26",
    "endDate": "2024-05-30",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-05-31",
    "endDate": "2024-05-31",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-06-01",
    "endDate": "2024-06-06",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-06-07",
    "endDate": "2024-06-07",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-06-08",
    "endDate": "2024-06-09",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-06-10",
    "endDate": "2024-07-28",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-07-29",
    "endDate": "2024-07-29",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-07-30",
    "endDate": "2024-08-18",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-08-19",
    "endDate": "2024-08-19",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-08-20",
    "endDate": "2024-09-05",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-09-06",
    "endDate": "2024-09-06",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-09-07",
    "endDate": "2024-09-07",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-09-08",
    "endDate": "2024-09-11",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-09-12",
    "endDate": "2024-09-12",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-09-13",
    "endDate": "2024-09-14",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-09-15",
    "endDate": "2024-09-15",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-09-16",
    "endDate": "2024-09-16",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-09-17",
    "endDate": "2024-09-17",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-09-18",
    "endDate": "2024-09-19",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-09-20",
    "endDate": "2024-11-11",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-11-12",
    "endDate": "2024-11-17",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-11-18",
    "endDate": "2024-11-19",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-11-20",
    "endDate": "2024-11-20",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-11-21",
    "endDate": "2024-11-23",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-11-24",
    "endDate": "2024-11-24",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-11-25",
    "endDate": "2024-11-25",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-11-26",
    "endDate": "2024-11-27",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-11-28",
    "endDate": "2024-11-28",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-11-29",
    "endDate": "2024-11-29",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-11-30",
    "endDate": "2024-12-01",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-12-02",
    "endDate": "2024-12-02",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-12-03",
    "endDate": "2024-12-23",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-12-24",
    "endDate": "2024-12-24",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-12-25",
    "endDate": "2024-12-25",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-12-26",
    "endDate": "2024-12-26",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-12-27",
    "endDate": "2024-12-27",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-12-28",
    "endDate": "2024-12-28",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-12-29",
    "endDate": "2024-12-30",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2024-12-31",
    "endDate": "2025-01-01",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-01-02",
    "endDate": "2025-01-02",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2025-01-03",
    "endDate": "2025-01-03",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-01-04",
    "endDate": "2025-01-05",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2025-01-06",
    "endDate": "2025-01-11",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-01-12",
    "endDate": "2025-01-12",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2025-01-13",
    "endDate": "2025-01-13",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-01-14",
    "endDate": "2025-01-14",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2025-01-15",
    "endDate": "2025-01-16",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-01-17",
    "endDate": "2025-01-17",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2025-01-18",
    "endDate": "2025-01-18",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-01-19",
    "endDate": "2025-01-30",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2025-01-31",
    "endDate": "2025-01-31",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-02-01",
    "endDate": "2025-02-03",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2025-02-04",
    "endDate": "2025-02-04",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-02-05",
    "endDate": "2025-02-08",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2025-02-09",
    "endDate": "2025-02-28",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-03-01",
    "endDate": "2025-03-02",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-03-03",
    "endDate": "2025-03-04",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-03-05",
    "endDate": "2025-03-05",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-03-06",
    "endDate": "2025-03-06",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-03-07",
    "endDate": "2025-03-08",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-03-09",
    "endDate": "2025-03-09",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-03-10",
    "endDate": "2025-03-12",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-03-13",
    "endDate": "2025-03-13",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-03-14",
    "endDate": "2025-04-24",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-04-25",
    "endDate": "2025-04-25",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-04-26",
    "endDate": "2025-04-27",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-04-28",
    "endDate": "2025-04-30",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-05-01",
    "endDate": "2025-05-01",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-05-02",
    "endDate": "2025-05-05",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-05-06",
    "endDate": "2025-05-06",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-05-07",
    "endDate": "2025-05-27",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-05-28",
    "endDate": "2025-05-28",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2025-05-29",
    "endDate": "2025-06-21",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-06-22",
    "endDate": "2025-06-24",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-06-25",
    "endDate": "2025-07-14",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-07-15",
    "endDate": "2025-07-15",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2025-07-16",
    "endDate": "2025-07-16",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-07-17",
    "endDate": "2025-07-28",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2025-07-29",
    "endDate": "2025-08-13",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-08-14",
    "endDate": "2025-08-14",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2025-08-15",
    "endDate": "2025-10-22",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-10-23",
    "endDate": "2025-10-23",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-10-24",
    "endDate": "2025-10-28",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-10-29",
    "endDate": "2025-10-29",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-10-30",
    "endDate": "2025-10-30",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-10-31",
    "endDate": "2025-11-01",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-11-02",
    "endDate": "2025-11-03",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-11-04",
    "endDate": "2025-12-29",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-12-30",
    "endDate": "2025-12-30",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2025-12-31",
    "endDate": "2026-01-10",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2026-01-11",
    "endDate": "2026-01-11",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2026-01-12",
    "endDate": "2026-01-23",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2026-01-24",
    "endDate": "2026-01-25",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2026-01-26",
    "endDate": "2026-01-26",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2026-01-27",
    "endDate": "2026-01-30",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  }
];


// Exemple d'usage :
// Imaginons que btcPriceData est un tableau [{time: timestamp_sec, value: prixBTC}, ...]
// et que `chart` est ton graphique LightweightCharts.

// toggleCBBILineSegments(chart, cbbiFiboZones, btcPriceData);

window.cbbiFiboZones = cbbiFiboZones;
