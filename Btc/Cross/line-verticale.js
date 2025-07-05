// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                              3 : ( 3.1 , 3.2 )

// ===================================================================================================================================
//                                3.1 :
//                                Ajoute ou supprime les lignes verticales des croisements alternatifs sur le graphique BTC
// ===================================================================================================================================
//                                3.2 :
//                                Ecouteur bouton clic
// ===================================================================================================================================
//                                3.3 :
//                                Données croisements alternatifs intégrées
// ===================================================================================================================================



//  3.1 :
// ===================================================================================================================================
//                                Ajoute ou supprime les lignes verticales des croisements alternatifs sur le graphique BTC

let altCrossingLines = [];
let altCrossingsVisible = false;

function toggleAltCrossingLines(chart, currentScale) {
  if (altCrossingsVisible) {
    altCrossingLines.forEach(line => chart.removeSeries(line));
    altCrossingLines = [];
    altCrossingsVisible = false;
    return;
  }

  const priceScale = chart.priceScale('right');
  const priceRange = priceScale.priceRange ? priceScale.priceRange() : null;
  let minPrice = priceRange ? priceRange.min : 0;
  let maxPrice = priceRange ? priceRange.max : 1000000;

  if (currentScale === 'log') {
    minPrice = Math.log10(minPrice > 0 ? minPrice : 0.01);
    maxPrice = Math.log10(maxPrice > 0 ? maxPrice : 100000);
  }

  altCbbiCrossings.forEach(cross => {
    const timeInSeconds = Math.floor(new Date(cross.date).getTime() / 1000);

    const lineSeries = chart.addLineSeries({
      color: cross.direction === 'up' ? '#00ccff' : '#ff6600', // couleurs différentes
      lineWidth: 0.8,
      priceLineVisible: false,
      lastValueVisible: false,
      crossHairMarkerVisible: false,
    });

    lineSeries.setData([
      { time: timeInSeconds, value: minPrice },
      { time: timeInSeconds, value: maxPrice },
    ]);

    altCrossingLines.push(lineSeries);
  });

  altCrossingsVisible = true;
}



//  3.2 :
// ===================================================================================================================================
//                                Ecouteur bouton clic

document.getElementById('toggleAltBtn').addEventListener('click', () => {
  if (window.chartInstance) {
    toggleAltCrossingLines(window.chartInstance, window.currentScale);
  } else {
    console.warn('Le graphique BTC n’est pas encore initialisé.');
  }
});



//  3.3 :
// ===================================================================================================================================
//                                Données croisements alternatifs intégrées

const altCbbiCrossings = [
  {
    "date": "2012-11-28",   
    "cbbi": 62.73,
    "level": 62.97,
    "direction": "up"
  },
  {
    "date": "2016-07-09",  
    "cbbi": 65.43,
    "level": 62.97,
    "direction": "up"
  },
  {
    "date": "2020-05-11",   
    "cbbi": 62.93,
    "level": 62.97,
    "direction": "up"
  },
  {
    "date": "2024-04-19",  	 
    "cbbi": 62,
    "level": 62.97,
    "direction": "up"
  }



];
