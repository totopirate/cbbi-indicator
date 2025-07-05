// cbbi-zone-detector.js

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                              4 : ( 4.1 , 4.2 , 4.3 , 4.4 , 4.5 , 4.4 , 4.7 , 4.8 )

// ===================================================================================================================================
//                                4.1 :
//                                Import des modules nécessaires : fs pour fichier, https pour requête web
// ===================================================================================================================================
//                                4.2 :
//                                Définition des niveaux Fibonacci (du plus petit au plus grand)
// ===================================================================================================================================
//                                4.4 :
//                                Calcul des niveaux CBBI à partir des niveaux Fibonacci et valeurs extrêmes
// ===================================================================================================================================
//                                4.5 :
//                                Fonction findZone :
//                                Trouve la zone fibo correspondant à une valeur donnée (entre deux niveaux)
// ===================================================================================================================================
//                                4.6 :
//                                Fonction groupByZone :
//                                Regroupe les périodes consécutives où la valeur reste dans la même zone fibo
// ===================================================================================================================================
//                                4.7 :
//                                Fonction fetchJSON :
//                                Récupère des données JSON depuis une URL via HTTPS et exécute un callback
// ===================================================================================================================================
//                                4.8 :
//                                URL de la source CBBI et lancement principal du script
// ===================================================================================================================================



//  4.1 :
// ===================================================================================================================================
//                                Import des modules nécessaires : fs pour fichier, https pour requête web


const fs = require('fs');
const https = require('https');



//  4.2 :
// ===================================================================================================================================
//                                Définition des niveaux Fibonacci (du plus petit au plus grand)


const fiboLevels = [0, 0.146, 0.236, 0.382, 0.5, 0.618, 0.786, 0.854, 0.90, 1];



//  4.3 :
// ===================================================================================================================================
//                                Définition des valeurs extrêmes pour calculer les niveaux CBBI


const fibPrice1 = 100;
const fibPrice2 = 0;



//  4.4 :
// ===================================================================================================================================
//                                Calcul des niveaux CBBI à partir des niveaux Fibonacci et valeurs extrêmes
//                                (Arrondi ajouté pour éviter les erreurs de virgule flottante)


const maxVal = Math.max(fibPrice1, fibPrice2);
const minVal = Math.min(fibPrice1, fibPrice2);
const cbbiLevels = fiboLevels.map(level => {
  const raw = maxVal - (maxVal - minVal) * (1 - level);
  return Math.round(raw * 10) / 10; // ← arrondi à 1 décimale
});



//  4.5 :
// ===================================================================================================================================
//                                Fonction findZone :
//                                Trouve la zone fibo correspondant à une valeur donnée (entre deux niveaux)


function findZone(value, levels) {
  for (let i = 0; i < levels.length - 1; i++) {
    const high = Math.max(levels[i], levels[i + 1]);
    const low = Math.min(levels[i], levels[i + 1]);
    if (value >= low && value <= high) {
      return { min: low, max: high };
    }
  }
  return null;
}



//  4.6 :
// ===================================================================================================================================
//                                Fonction groupByZone :
//                                Regroupe les périodes consécutives où la valeur reste dans la même zone fibo


function groupByZone(data, levels) {
  if (data.length === 0) return [];

  const zones = [];
  let currentZone = findZone(data[0].value, levels);
  let startDate = data[0].time;
  let endDate = data[0].time;

  for (let i = 1; i < data.length; i++) {
    const zone = findZone(data[i].value, levels);
    if (!zone || !currentZone || zone.min !== currentZone.min || zone.max !== currentZone.max) {
      // Nouvelle zone détectée → sauvegarde l’ancienne période
      zones.push({ startDate, endDate, zone: currentZone });
      startDate = data[i].time;
      currentZone = zone;
    }
    endDate = data[i].time;
  }

  // Enregistrement du dernier segment
  zones.push({ startDate, endDate, zone: currentZone });

  return zones;
}



//  4.7 :
// ===================================================================================================================================
//                                Fonction fetchJSON :
//                                Récupère des données JSON depuis une URL via HTTPS et exécute un callback


function fetchJSON(url, callback) {
  https.get(url, res => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        callback(null, json);
      } catch (err) {
        callback(err);
      }
    });
  }).on('error', err => callback(err));
}



//  4.8 :
// ===================================================================================================================================
//                                URL de la source CBBI et lancement principal du script


const url = 'https://colintalkscrypto.com/cbbi/data/latest.json';

fetchJSON(url, (err, json) => {
  if (err) {
    console.error('Erreur lors de la récupération des données:', err);
    return;
  }

  // Reformate les données brutes en tableau { time: 'YYYY-MM-DD', value }
  const timestamps = Object.keys(json.Confidence);
  const values = Object.values(json.Confidence);
  const data = timestamps.map((ts, i) => {
    const date = new Date(Number(ts) * 1000).toISOString().split('T')[0];
    return { time: date, value: values[i] * 100 };
  });

  // Regroupe les données en zones CBBI consécutives
  const rawZones = groupByZone(data, cbbiLevels);

  const zones = rawZones.map(({ startDate, endDate, zone }) => ({
    startDate,
    endDate,
    zone: {
      min: Math.round(zone.min * 10) / 10,
      max: Math.round(zone.max * 10) / 10
    }
  }));

  // Fonction pour modifier le fichier JS et injecter les zones dans la déclaration const cbbiFiboZones = [...]
  function updateCbbiFiboZonesFile(newZones) {
    const filePath = 'Btc/Fibo-zones/cbbi-fibo-zones.js';

    if (!fs.existsSync(filePath)) {
      console.error(`Le fichier '${filePath}' n'existe pas.`);
      return;
    }

    let fileContent = fs.readFileSync(filePath, 'utf8');

    // Regex pour trouver la déclaration const cbbiFiboZones = [ ... ];
    // Match non-greedy de tout ce qui est entre [ et ] suivi de ;
    const regex = /const cbbiFiboZones\s*=\s*\[[\s\S]*?\];/m;

    // Construire la nouvelle chaîne à injecter avec JSON formaté joliment
    const newArrayString = 'const cbbiFiboZones = ' + JSON.stringify(newZones, null, 2) + ';';

    if (regex.test(fileContent)) {
      fileContent = fileContent.replace(regex, newArrayString);
    } else {
      console.warn("La déclaration 'const cbbiFiboZones = [...]' n'a pas été trouvée dans le fichier.");
      return;
    }

    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`Fichier '${filePath}' mis à jour avec ${newZones.length} zones.`);
  }

  // Appel de la fonction pour mettre à jour le fichier JS
  updateCbbiFiboZonesFile(zones);
});
