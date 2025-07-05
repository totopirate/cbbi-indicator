
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                              1 : ( 1.1 ; 1.2 )

// ===================================================================================================================================
//                                1.1 :
//                                CBBI-FIBONACCI.JS - Gestion du graphique CBBI et zones Fibonacci colorées
// ===================================================================================================================================
//                                1.2 :
//                                Initialisation du graphique CBBI au chargement
// ===================================================================================================================================


// 1.1 :
// ===================================================================================================================================
//                                CBBI-FIBONACCI.JS - Gestion du graphique CBBI et zones Fibonacci colorées

// Variables globales du graphique, séries et lignes Fibonacci
let chart;
let fibLines = [];
let coloredSeries = [];
let baseSeries;
// Couleurs des zones Fibonacci (rgba + alpha)
let zoneColors = [{
	color: 'rgba(216, 176, 240, 0.9)',
	alpha: 0.9
}, {
	color: 'rgba(233, 157, 15, 0.9)',
	alpha: 0.9
}, {
	color: 'rgba(201, 201, 38, 0.9)',
	alpha: 0.9
}, {
	color: 'rgba(43, 146, 23, 0.9)',
	alpha: 0.9
}, {
	color: 'rgba(9, 217, 245, 0.9)',
	alpha: 0.9
}, {
	color: 'rgba(107, 145, 224, 0.9)',
	alpha: 0.9
}, {
	color: 'rgba(216, 11, 11, 0.9)',
	alpha: 0.9
}, {
	color: 'rgba(164, 164, 165, 0.9)',
	alpha: 0.9
}, {
	color: 'rgba(0, 0, 0, 0.9)',
	alpha: 0.9
}, ];


// 1.2 :
// ===================================================================================================================================
//                                Initialisation du graphique CBBI au chargement

fetchAndDrawChart();



// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                              2 : ( 2.1 , 2.2 )

// ===================================================================================================================================
//                                2.1 :
//                                Fonction principale : Récupérer les données CBBI et dessiner le graphique initial
// ===================================================================================================================================
//                                2.2 :
//                                Redimensionnement automatique du graphique à la taille du container
// ===================================================================================================================================



// 2.1 :
// ===================================================================================================================================
//                                Fonction principale : Récupérer les données CBBI et dessiner le graphique initial

async function fetchAndDrawChart() {
	// Récupération des données JSON (timestamps + valeurs CBBI)
	const response = await fetch("https://colintalkscrypto.com/cbbi/data/latest.json");
	const json = await response.json();
	const timestamps = Object.keys(json.Confidence);
	const values = Object.values(json.Confidence);
	// Transformation des timestamps UNIX en dates ISO, valeurs multipliées par 100
	const data = timestamps.map((ts, i) => {
		const date = new Date(Number(ts) * 1000);
		return {
			time: date.toISOString().split("T")[0],
			value: values[i] * 100,
		};
	});
	// Création du graphique avec LightweightCharts
	chart = LightweightCharts.createChart(document.getElementById("chart"), {
		width: document.getElementById("chart").clientWidth,
		height: 500,
		layout: {
			background: {
				color: "#fff"
			},
			textColor: "#000"
		},
		grid: {
			vertLines: {
				color: "#eee"
			},
			horzLines: {
				color: "#eee"
			}
		},
		timeScale: {
			timeVisible: true,
			secondsVisible: false,
			rightOffset: 50,
			barSpacing: 5,
			minBarSpacing: 0.1,
		},
		handleScroll: {
			mouseWheel: true,
			pressedMouseMove: true
		},
		handleScale: {
			mouseWheel: true,
			pinch: true,
			axisPressedMouseMove: true
		},
		priceScale: {
			borderVisible: true
		},
		crosshair: {
			mode: LightweightCharts.CrosshairMode.Normal,
			vertLine: {
				color: 'rgba(0,0,0,0.5)',
				width: 1
			},
			horzLine: {
				color: 'rgba(0,0,0,0.5)',
				width: 1
			},
		},
	});
	// Ajout de la série principale en ligne bleue
	baseSeries = chart.addLineSeries({
		color: 'blue',
		lineWidth: 2
	});
	baseSeries.setData(data);
	chart.timeScale().fitContent();
	// Initialisation des contrôles de couleur pour les zones
	setupColorControls();
	// Bouton pour dessiner la ligne Fibonacci avec les valeurs saisies
	document.getElementById('btnDrawFibo').onclick = () => {
		const value1 = parseFloat(document.getElementById('value1').value);
		const value2 = parseFloat(document.getElementById('value2').value);
		if (isNaN(value1) || isNaN(value2)) {
			alert("Merci de renseigner deux valeurs numériques valides.");
			return;
		}
		// Stockage global temporaire des prix pour réutilisation
		window._fibPrice1 = value1;
		window._fibPrice2 = value2;
		drawFibonacciColoredLine(value1, value2, data);
	};
	// Bouton pour effacer toutes les lignes Fibonacci et zones colorées
	document.getElementById('btnClearFibo').onclick = () => {
		clearFibonacci();
	};
}



// 2.2 :
// ===================================================================================================================================
//                                Redimensionnement automatique du graphique à la taille du container

window.addEventListener('resize', () => {
	if (chart) {
		chart.resize(document.getElementById('chart').clientWidth, 500);
	}
});








