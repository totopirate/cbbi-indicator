



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
    "endDate": "2011-07-15",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2011-07-16",
    "endDate": "2011-07-19",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2011-07-20",
    "endDate": "2011-07-25",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2011-07-26",
    "endDate": "2011-08-05",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2011-08-06",
    "endDate": "2011-08-14",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2011-08-15",
    "endDate": "2011-08-24",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2011-08-25",
    "endDate": "2011-09-06",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2011-09-07",
    "endDate": "2011-10-07",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2011-10-08",
    "endDate": "2011-10-17",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-10-18",
    "endDate": "2011-12-11",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2011-12-12",
    "endDate": "2011-12-14",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2011-12-15",
    "endDate": "2011-12-16",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2011-12-17",
    "endDate": "2011-12-31",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-01-01",
    "endDate": "2012-02-14",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-02-15",
    "endDate": "2012-03-15",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-03-16",
    "endDate": "2012-03-18",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-03-19",
    "endDate": "2012-04-20",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-04-21",
    "endDate": "2012-04-21",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-04-22",
    "endDate": "2012-06-22",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-06-23",
    "endDate": "2012-06-23",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-06-24",
    "endDate": "2012-06-28",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2012-06-29",
    "endDate": "2012-08-10",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-08-11",
    "endDate": "2012-08-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-08-20",
    "endDate": "2012-08-27",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-08-28",
    "endDate": "2012-08-29",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-08-30",
    "endDate": "2012-09-06",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-09-07",
    "endDate": "2012-09-07",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-09-08",
    "endDate": "2012-09-09",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-09-10",
    "endDate": "2012-10-22",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-10-23",
    "endDate": "2012-10-23",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2012-10-24",
    "endDate": "2012-10-24",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2012-10-25",
    "endDate": "2013-01-21",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2013-01-22",
    "endDate": "2013-02-20",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2013-02-21",
    "endDate": "2013-02-23",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-02-24",
    "endDate": "2013-02-24",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2013-02-25",
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
    "endDate": "2013-07-04",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-07-05",
    "endDate": "2013-07-10",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2013-07-11",
    "endDate": "2013-10-21",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2013-10-22",
    "endDate": "2013-11-14",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-11-15",
    "endDate": "2013-11-18",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2013-11-19",
    "endDate": "2013-11-22",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2013-11-23",
    "endDate": "2013-12-06",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2013-12-07",
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
    "endDate": "2013-12-16",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2013-12-17",
    "endDate": "2013-12-17",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2013-12-18",
    "endDate": "2013-12-18",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-12-19",
    "endDate": "2013-12-20",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2013-12-21",
    "endDate": "2013-12-25",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2013-12-26",
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
    "endDate": "2014-01-16",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2014-01-17",
    "endDate": "2014-02-24",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-02-25",
    "endDate": "2014-02-25",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-02-26",
    "endDate": "2014-02-28",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-03-01",
    "endDate": "2014-03-03",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-03-04",
    "endDate": "2014-03-20",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2014-03-21",
    "endDate": "2014-04-04",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-04-05",
    "endDate": "2014-04-15",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-04-16",
    "endDate": "2014-04-25",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-04-26",
    "endDate": "2014-05-31",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-06-01",
    "endDate": "2014-06-12",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2014-06-13",
    "endDate": "2014-08-18",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-08-19",
    "endDate": "2014-08-27",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-08-28",
    "endDate": "2014-08-30",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2014-08-31",
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
    "endDate": "2014-10-23",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-10-24",
    "endDate": "2014-11-12",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2014-11-13",
    "endDate": "2014-11-15",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2014-11-16",
    "endDate": "2015-01-03",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-01-04",
    "endDate": "2015-07-11",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-07-12",
    "endDate": "2015-07-15",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-07-16",
    "endDate": "2015-07-23",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-07-24",
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
    "endDate": "2015-10-13",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2015-10-14",
    "endDate": "2015-11-02",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2015-11-03",
    "endDate": "2015-11-10",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2015-11-11",
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
    "endDate": "2016-06-09",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-06-10",
    "endDate": "2016-06-10",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-06-11",
    "endDate": "2016-07-10",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-07-11",
    "endDate": "2016-07-11",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-07-12",
    "endDate": "2016-07-12",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-07-13",
    "endDate": "2016-07-15",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-07-16",
    "endDate": "2016-07-21",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-07-22",
    "endDate": "2016-10-29",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-10-30",
    "endDate": "2016-10-30",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-10-31",
    "endDate": "2016-11-02",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-11-03",
    "endDate": "2016-11-03",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-11-04",
    "endDate": "2016-11-07",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-11-08",
    "endDate": "2016-11-12",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2016-11-13",
    "endDate": "2016-11-15",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2016-11-16",
    "endDate": "2017-03-01",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-03-02",
    "endDate": "2017-03-08",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-03-09",
    "endDate": "2017-03-12",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-03-13",
    "endDate": "2017-03-16",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-03-17",
    "endDate": "2017-04-28",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2017-04-29",
    "endDate": "2017-05-22",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-05-23",
    "endDate": "2017-07-14",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-07-15",
    "endDate": "2017-07-19",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2017-07-20",
    "endDate": "2017-08-31",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-09-01",
    "endDate": "2017-09-03",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-09-04",
    "endDate": "2017-09-07",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-09-08",
    "endDate": "2017-09-08",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-09-09",
    "endDate": "2017-10-14",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-10-15",
    "endDate": "2017-10-17",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-10-18",
    "endDate": "2017-10-18",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-10-19",
    "endDate": "2017-10-26",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-10-27",
    "endDate": "2017-10-28",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-10-29",
    "endDate": "2017-11-11",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-11-12",
    "endDate": "2017-11-12",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2017-11-13",
    "endDate": "2017-11-19",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2017-11-20",
    "endDate": "2017-11-27",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2017-11-28",
    "endDate": "2018-01-14",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2018-01-15",
    "endDate": "2018-01-17",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2018-01-18",
    "endDate": "2018-01-19",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2018-01-20",
    "endDate": "2018-01-21",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2018-01-22",
    "endDate": "2018-01-30",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2018-01-31",
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
    "endDate": "2018-03-05",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2018-03-06",
    "endDate": "2018-03-06",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2018-03-07",
    "endDate": "2018-03-30",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2018-03-31",
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
    "endDate": "2018-06-10",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2018-06-11",
    "endDate": "2018-07-24",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-07-25",
    "endDate": "2018-07-26",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2018-07-27",
    "endDate": "2018-08-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-08-20",
    "endDate": "2018-08-21",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2018-08-22",
    "endDate": "2018-08-22",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-08-23",
    "endDate": "2018-08-23",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2018-08-24",
    "endDate": "2018-09-06",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2018-09-07",
    "endDate": "2018-11-20",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2018-11-21",
    "endDate": "2018-11-26",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2018-11-27",
    "endDate": "2018-11-29",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2018-11-30",
    "endDate": "2018-11-30",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2018-12-01",
    "endDate": "2019-04-01",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2019-04-02",
    "endDate": "2019-04-10",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-04-11",
    "endDate": "2019-04-11",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2019-04-12",
    "endDate": "2019-04-17",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-04-18",
    "endDate": "2019-04-19",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2019-04-20",
    "endDate": "2019-04-20",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-04-21",
    "endDate": "2019-04-26",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2019-04-27",
    "endDate": "2019-04-27",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-04-28",
    "endDate": "2019-04-29",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2019-04-30",
    "endDate": "2019-04-30",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2019-05-01",
    "endDate": "2019-05-13",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2019-05-14",
    "endDate": "2019-06-22",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-06-23",
    "endDate": "2019-07-16",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-07-17",
    "endDate": "2019-07-18",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-07-19",
    "endDate": "2019-07-23",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-07-24",
    "endDate": "2019-07-25",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-07-26",
    "endDate": "2019-07-26",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-07-27",
    "endDate": "2019-07-31",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-08-01",
    "endDate": "2019-08-17",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-08-18",
    "endDate": "2019-08-18",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-08-19",
    "endDate": "2019-08-25",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-08-26",
    "endDate": "2019-08-26",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-08-27",
    "endDate": "2019-08-28",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-08-29",
    "endDate": "2019-09-02",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-09-03",
    "endDate": "2019-09-16",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-09-17",
    "endDate": "2019-09-17",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-09-18",
    "endDate": "2019-09-18",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2019-09-19",
    "endDate": "2019-10-23",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-10-24",
    "endDate": "2019-10-25",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2019-10-26",
    "endDate": "2019-11-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2019-11-20",
    "endDate": "2020-01-14",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-01-15",
    "endDate": "2020-01-23",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-01-24",
    "endDate": "2020-01-27",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-01-28",
    "endDate": "2020-02-28",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-02-29",
    "endDate": "2020-02-29",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-03-01",
    "endDate": "2020-03-01",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-03-02",
    "endDate": "2020-03-02",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-03-03",
    "endDate": "2020-03-08",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-03-09",
    "endDate": "2020-03-12",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-03-13",
    "endDate": "2020-03-20",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2020-03-21",
    "endDate": "2020-03-21",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-03-22",
    "endDate": "2020-03-23",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2020-03-24",
    "endDate": "2020-03-29",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-03-30",
    "endDate": "2020-03-30",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2020-03-31",
    "endDate": "2020-05-01",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-05-02",
    "endDate": "2020-05-11",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-05-12",
    "endDate": "2020-06-05",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-06-06",
    "endDate": "2020-06-06",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-06-07",
    "endDate": "2020-07-27",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2020-07-28",
    "endDate": "2020-11-02",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2020-11-03",
    "endDate": "2020-11-20",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-11-21",
    "endDate": "2020-11-22",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2020-11-23",
    "endDate": "2020-11-23",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-11-24",
    "endDate": "2020-11-26",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2020-11-27",
    "endDate": "2020-11-30",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-12-01",
    "endDate": "2020-12-08",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2020-12-09",
    "endDate": "2020-12-12",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2020-12-13",
    "endDate": "2021-01-01",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-01-02",
    "endDate": "2021-01-06",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-01-07",
    "endDate": "2021-01-12",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-01-13",
    "endDate": "2021-01-13",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-01-14",
    "endDate": "2021-01-16",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-01-17",
    "endDate": "2021-01-27",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-01-28",
    "endDate": "2021-01-28",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-01-29",
    "endDate": "2021-02-05",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-02-06",
    "endDate": "2021-02-09",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-02-10",
    "endDate": "2021-04-22",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2021-04-23",
    "endDate": "2021-05-01",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-05-02",
    "endDate": "2021-05-04",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2021-05-05",
    "endDate": "2021-05-05",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-05-06",
    "endDate": "2021-05-10",
    "zone": {
      "min": 90,
      "max": 100
    }
  },
  {
    "startDate": "2021-05-11",
    "endDate": "2021-05-13",
    "zone": {
      "min": 85.4,
      "max": 90
    }
  },
  {
    "startDate": "2021-05-14",
    "endDate": "2021-05-18",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-05-19",
    "endDate": "2021-06-25",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-06-26",
    "endDate": "2021-06-27",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2021-06-28",
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
    "endDate": "2021-07-11",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-07-12",
    "endDate": "2021-07-13",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2021-07-14",
    "endDate": "2021-07-14",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-07-15",
    "endDate": "2021-07-25",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2021-07-26",
    "endDate": "2021-10-18",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-10-19",
    "endDate": "2021-10-27",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-10-28",
    "endDate": "2021-10-28",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-10-29",
    "endDate": "2021-10-30",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-10-31",
    "endDate": "2021-11-02",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-11-03",
    "endDate": "2021-11-03",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-11-04",
    "endDate": "2021-11-08",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2021-11-09",
    "endDate": "2021-11-16",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2021-11-17",
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
    "endDate": "2022-01-02",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2022-01-03",
    "endDate": "2022-01-21",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-01-22",
    "endDate": "2022-01-31",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-02-01",
    "endDate": "2022-02-02",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-02-03",
    "endDate": "2022-02-04",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-02-05",
    "endDate": "2022-02-18",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-02-19",
    "endDate": "2022-02-28",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-03-01",
    "endDate": "2022-03-04",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-03-05",
    "endDate": "2022-03-24",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-03-25",
    "endDate": "2022-04-07",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2022-04-08",
    "endDate": "2022-05-09",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2022-05-10",
    "endDate": "2022-06-13",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2022-06-14",
    "endDate": "2022-06-18",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-06-19",
    "endDate": "2022-06-20",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-06-21",
    "endDate": "2022-06-21",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-06-22",
    "endDate": "2022-07-19",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2022-07-20",
    "endDate": "2022-08-19",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2022-08-20",
    "endDate": "2023-01-14",
    "zone": {
      "min": 0,
      "max": 14.6
    }
  },
  {
    "startDate": "2023-01-15",
    "endDate": "2023-02-15",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2023-02-16",
    "endDate": "2023-02-23",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-02-24",
    "endDate": "2023-03-13",
    "zone": {
      "min": 14.6,
      "max": 23.6
    }
  },
  {
    "startDate": "2023-03-14",
    "endDate": "2023-04-11",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-04-12",
    "endDate": "2023-04-12",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-04-13",
    "endDate": "2023-04-13",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-04-14",
    "endDate": "2023-04-15",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-04-16",
    "endDate": "2023-04-16",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-04-17",
    "endDate": "2023-04-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-04-20",
    "endDate": "2023-04-30",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-05-01",
    "endDate": "2023-05-01",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-05-02",
    "endDate": "2023-05-05",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-05-06",
    "endDate": "2023-05-06",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-05-07",
    "endDate": "2023-06-21",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-06-22",
    "endDate": "2023-07-20",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-07-21",
    "endDate": "2023-07-21",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-07-22",
    "endDate": "2023-07-24",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-07-25",
    "endDate": "2023-07-29",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-07-30",
    "endDate": "2023-07-31",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-08-01",
    "endDate": "2023-08-01",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-08-02",
    "endDate": "2023-08-03",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-08-04",
    "endDate": "2023-08-08",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-08-09",
    "endDate": "2023-08-09",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-08-10",
    "endDate": "2023-08-13",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-08-14",
    "endDate": "2023-08-15",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-08-16",
    "endDate": "2023-10-20",
    "zone": {
      "min": 23.6,
      "max": 38.2
    }
  },
  {
    "startDate": "2023-10-21",
    "endDate": "2023-11-10",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-11-11",
    "endDate": "2023-11-12",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2023-11-13",
    "endDate": "2023-11-15",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-11-16",
    "endDate": "2023-11-16",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2023-11-17",
    "endDate": "2023-11-19",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-11-20",
    "endDate": "2023-11-20",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2023-11-21",
    "endDate": "2023-11-23",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-11-24",
    "endDate": "2023-11-26",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2023-11-27",
    "endDate": "2023-11-30",
    "zone": {
      "min": 38.2,
      "max": 50
    }
  },
  {
    "startDate": "2023-12-01",
    "endDate": "2024-01-10",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-01-11",
    "endDate": "2024-01-11",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-01-12",
    "endDate": "2024-02-11",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-02-12",
    "endDate": "2024-03-08",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-03-09",
    "endDate": "2024-03-16",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-03-17",
    "endDate": "2024-03-17",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-03-18",
    "endDate": "2024-03-18",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-03-19",
    "endDate": "2024-03-26",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-03-27",
    "endDate": "2024-04-02",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-04-03",
    "endDate": "2024-07-04",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-07-05",
    "endDate": "2024-07-15",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-07-16",
    "endDate": "2024-08-04",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-08-05",
    "endDate": "2024-09-28",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-09-29",
    "endDate": "2024-09-29",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-09-30",
    "endDate": "2024-10-14",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2024-10-15",
    "endDate": "2024-11-18",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-11-19",
    "endDate": "2024-11-26",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-11-27",
    "endDate": "2024-11-27",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-11-28",
    "endDate": "2024-12-27",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-12-28",
    "endDate": "2024-12-28",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2024-12-29",
    "endDate": "2024-12-30",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2024-12-31",
    "endDate": "2025-01-01",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-01-02",
    "endDate": "2025-01-07",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-01-08",
    "endDate": "2025-01-11",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-01-12",
    "endDate": "2025-01-12",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-01-13",
    "endDate": "2025-01-16",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-01-17",
    "endDate": "2025-02-03",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-02-04",
    "endDate": "2025-02-04",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-02-05",
    "endDate": "2025-02-08",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-02-09",
    "endDate": "2025-04-08",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-04-09",
    "endDate": "2025-04-09",
    "zone": {
      "min": 50,
      "max": 61.8
    }
  },
  {
    "startDate": "2025-04-10",
    "endDate": "2025-05-22",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-05-23",
    "endDate": "2025-05-23",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-05-24",
    "endDate": "2025-05-27",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-05-28",
    "endDate": "2025-05-29",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-05-30",
    "endDate": "2025-07-13",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-07-14",
    "endDate": "2025-07-28",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-07-29",
    "endDate": "2025-07-30",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-07-31",
    "endDate": "2025-07-31",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-08-01",
    "endDate": "2025-08-12",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-08-13",
    "endDate": "2025-08-14",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-08-15",
    "endDate": "2025-08-16",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  },
  {
    "startDate": "2025-08-17",
    "endDate": "2025-08-18",
    "zone": {
      "min": 78.6,
      "max": 85.4
    }
  },
  {
    "startDate": "2025-08-19",
    "endDate": "2025-10-01",
    "zone": {
      "min": 61.8,
      "max": 78.6
    }
  }
];


// Exemple d'usage :
// Imaginons que btcPriceData est un tableau [{time: timestamp_sec, value: prixBTC}, ...]
// et que `chart` est ton graphique LightweightCharts.

// toggleCBBILineSegments(chart, cbbiFiboZones, btcPriceData);

window.cbbiFiboZones = cbbiFiboZones;
