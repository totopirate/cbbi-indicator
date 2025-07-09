// cbbi-zone-detector-cycle.js

// ------------------------------------------------------------------------------------------------------------------------------------------------------
// 4 : Modules, définitions, fonctions (4.1 à 4.8)

// ===================================================================================================================================
// 4.1 : Import des modules nécessaires : fs pour gestion fichiers, https pour requêtes web sécurisées
// ===================================================================================================================================
const fs = require('fs');
const https = require('https');

// ===================================================================================================================================
// 4.2 : Définition des niveaux Fibonacci (du plus petit au plus grand) pour calcul CBBI
// ===================================================================================================================================
const fiboLevels = [0, 0.146, 0.854, 0.90, 1];

// ===================================================================================================================================
// 4.3 : Valeurs extrêmes pour calculer les niveaux CBBI (ex : max et min prix)
// ===================================================================================================================================
const fibPrice1 = 100;
const fibPrice2 = 0;

// ===================================================================================================================================
// 4.4 : Calcul des niveaux CBBI à partir des niveaux Fibonacci et des valeurs extrêmes
// ===================================================================================================================================
const maxVal = Math.max(fibPrice1, fibPrice2);
const minVal = Math.min(fibPrice1, fibPrice2);

const cbbiLevels = fiboLevels.map(level => {
  const raw = maxVal - (maxVal - minVal) * (1 - level);
  return Math.round(raw * 10) / 10; // arrondi à 1 décimale
});

// ===================================================================================================================================
// 4.5 : Fonction findZone(value, levels)
// Recherche dans quelle zone (intervalle entre deux niveaux consécutifs) se trouve la valeur donnée
// ===================================================================================================================================
function findZone(value, levels) {
  for (let i = 0; i < levels.length - 1; i++) {
    const a = levels[i];
    const b = levels[i + 1];
    const low = Math.min(a, b);
    const high = Math.max(a, b);
    if (value >= low && value <= high) {
      return { min: a, max: b };
    }
  }
  return null; // pas trouvé
}

// ===================================================================================================================================
// 4.6 : Fonction groupByZone(data, levels)
// Regroupe les périodes consécutives où la valeur reste dans la même zone Fibonacci
// Calcule la direction (up/down) en comparant l’indice des zones consécutives
// ===================================================================================================================================


function groupByZone(data, levels) {
  if (data.length === 0) return [];

  const zones = [];

  function getLevelIndex(value) {
    return levels.findIndex(level => level === value);
  }

  let currentZone = findZone(data[0].value, levels);
  let startDate = data[0].time;
  let endDate = data[0].time;
  let prevZone = null; // zone précédente pour comparer direction

  for (let i = 1; i < data.length; i++) {
    const zone = findZone(data[i].value, levels);

    if (!zone || !currentZone || zone.min !== currentZone.min || zone.max !== currentZone.max) {

      // Calcul direction en comparant la zone actuelle avec la zone précédente
      let direction = null;
      if (prevZone) {
        const prevIndex = getLevelIndex(prevZone.min);
        const currIndex = getLevelIndex(currentZone.min);
        direction = currIndex < prevIndex ? "down" : "up";
      }

      zones.push({
        startDate,
        endDate,
        zone: {
          min: Math.round(currentZone.min * 10) / 10,
          max: Math.round(currentZone.max * 10) / 10,
          direction: direction
        }
      });

      prevZone = currentZone;  // MAJ zone précédente
      currentZone = zone;
      startDate = data[i].time;
    }

    endDate = data[i].time;
  }

  // Ajout dernière zone
  if (currentZone) {
    let direction = null;
    if (prevZone) {
      const prevIndex = getLevelIndex(prevZone.min);
      const currIndex = getLevelIndex(currentZone.min);
      direction = currIndex < prevIndex ? "down" : "up";
    }

    zones.push({
      startDate,
      endDate,
      zone: {
        min: Math.round(currentZone.min * 10) / 10,
        max: Math.round(currentZone.max * 10) / 10,
        direction: direction
      }
    });
  }

  return zones;
}



// ===================================================================================================================================
// 4.7 : Fonction fetchJSON(url, callback)
// Télécharge et parse un JSON depuis une URL HTTPS, appelle callback(err, json)
// ===================================================================================================================================
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

// ===================================================================================================================================
// 4.8 : Récupération des données CBBI, traitement et mise à jour du fichier cbbi-fibo-zones-cycle.js
// ===================================================================================================================================
const url = 'https://colintalkscrypto.com/cbbi/data/latest.json';

fetchJSON(url, (err, json) => {
  if (err) {
    console.error('Erreur lors de la récupération des données:', err);
    return;
  }

  const timestamps = Object.keys(json.Confidence);
  const values = Object.values(json.Confidence);
  const data = timestamps.map((ts, i) => {
    const date = new Date(Number(ts) * 1000).toISOString().split('T')[0];
    return { time: date, value: values[i] * 100 };
  });

  const zones = groupByZone(data, cbbiLevels);

  function updateCbbiFiboZonesFile(newZones) {
    const filePath = 'Btc/Fibo-zones/cbbi-fibo-zones-cycle.js';

    if (!fs.existsSync(filePath)) {
      console.error(`Le fichier '${filePath}' n'existe pas.`);
      return;
    }

    let fileContent = fs.readFileSync(filePath, 'utf8');
    const regex = /const cbbiFiboZonesCycle\s*=\s*\[[\s\S]*?\];/m;
    const newArrayString = 'const cbbiFiboZonesCycle = ' + JSON.stringify(newZones, null, 2) + ';';

    if (regex.test(fileContent)) {
      fileContent = fileContent.replace(regex, newArrayString);
    } else {
      console.warn("La déclaration 'const cbbiFiboZonesCycle = [...]' n'a pas été trouvée dans le fichier.");
      return;
    }

    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`Fichier '${filePath}' mis à jour avec ${newZones.length} zones.`);
  }

  updateCbbiFiboZonesFile(zones);
});
