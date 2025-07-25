// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                              1 : ( 1.1 , 1.2 , 1.3 , 1.4 , 1.5 , 1.6 )

// ===================================================================================================================================
//                                1.1 :
//                                Récupère un batch d’historique BTC (2000 jours max) via l’API CryptoCompare
// ===================================================================================================================================
//                                1.2 :
//                                Récupère l’historique complet de BTC depuis 2010 (en plusieurs batches)
// ===================================================================================================================================
//                                1.3 :
//                                Transforme les données de prix en échelle logarithmique (log10)
// ===================================================================================================================================
//                                1.4 :
//                                Met à jour l’échelle du graphique (arithmétique ou logarithmique) avec les données correspondantes
// ===================================================================================================================================
//                                1.5 :
//                                Initialise, configure et affiche le graphique BTC avec Lightweight Charts
// ===================================================================================================================================
//                                1.6 :
//                                INIT : Lancement initial du graphique BTC
// ===================================================================================================================================



// 1.1 :
// ===================================================================================================================================
//                                Récupère un batch d’historique BTC (2000 jours max) via l’API CryptoCompare


async function fetchCryptoCompareHistodayBatch(symbol = 'BTC', currency = 'USD', toTs = Math.floor(Date.now() / 1000), limit = 2000) {
	const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}&toTs=${toTs}`;
	const res = await fetch(url);
	const json = await res.json();
	if (json.Response !== 'Success') throw new Error('Erreur API Cryptocompare: ' + json.Message);
	return json.Data.Data;
}



// 1.2 :
// ===================================================================================================================================
//                                Récupère l’historique complet de BTC depuis 2010 (en plusieurs batches)


async function fetchFullHistory() {
	let allData = [];
	let toTs = Math.floor(Date.now() / 1000);
	const oldestTimestamp = Math.floor(new Date('2010-01-01T00:00:00Z').getTime() / 1000);
	const limit = 2000;

	while (toTs > oldestTimestamp) {
		const batch = await fetchCryptoCompareHistodayBatch('BTC', 'USD', toTs, limit);
		if (batch.length === 0) break;

		allData = batch.concat(allData);
		toTs = batch[0].time - 1;
		if (batch[0].time <= oldestTimestamp) break;
	}
	return allData.filter(d => d.time >= oldestTimestamp);
}



// 1.3 :
// ===================================================================================================================================
//                                Transforme les données de prix en échelle logarithmique (log10)


function transformToLog(data) {
	const minPositive = 0.01;
	return data.map(d => {
		const val = d.value < minPositive ? minPositive : d.value;
		return {
			time: d.time,
			value: Math.log10(val),
			originalValue: d.value,
		};
	});
}



// 1.4 :
// ===================================================================================================================================
//                                Met à jour l’échelle du graphique (arithmétique ou logarithmique) avec les données correspondantes


function updateBTCChartData(lineSeries, chart, dataArith, dataLog, currentScale) {
	if (currentScale === 'arith') {
		lineSeries.setData(dataArith.map(d => ({ time: d.time, value: d.value })));
	} else {
		lineSeries.setData(dataLog.map(d => ({ time: d.time, value: d.value })));
	}
	chart.applyOptions({ rightPriceScale: { scaleMargins: { top: 0.2, bottom: 0.2 } } });

	const firstTime = Math.floor(new Date('2010-01-01T00:00:00Z').getTime() / 1000);
	const lastTime = Math.floor(Date.now() / 1000);
	chart.timeScale().setVisibleRange({ from: firstTime, to: lastTime });
}



// 1.5 :
// ===================================================================================================================================
//                                Initialise, configure et affiche le graphique BTC avec Lightweight Charts


async function drawBTCChart() {
	try {
		// ► Chargement de l'historique BTC complet
		const rawData = await fetchFullHistory();

		// ► Données échelle arithmétique
		const dataArith = rawData.map(d => ({
			time: d.time,
			value: d.close,
		}));

		window.btcPriceData = dataArith;

		window.btcPriceDataArith = dataArith; // idem pour les données arithmétiques


		// ► Données échelle logarithmique
		const dataLog = transformToLog(dataArith);

		window.btcPriceDataLog = dataLog; // pour accès aux données log dans les autres fichiers


		// ► Création du graphique
		const chart = LightweightCharts.createChart(document.getElementById('chartBTC'), {
			width: document.getElementById('chart').clientWidth,
			height: 500,
			layout: {
				backgroundColor: '#ffffff',
				textColor: '#000',
			},
			grid: {
				vertLines: { color: '#eee' },
				horzLines: { color: '#eee' },
			},
			crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
			rightPriceScale: { borderColor: '#cccccc', visible: true },
			timeScale: {
				borderColor: '#cccccc',
				timeVisible: true,
				secondsVisible: false,
				rightOffset: 0,
				barSpacing: 2,
				minBarSpacing: 0,
				fixLeftEdge: false,
				handleScroll: { mouseWheel: true },
			},
		});

		// ► Stockage global pour accès externe
		window.chartInstance = chart;

		// ► Série principale (BTC)
		const lineSeries = chart.addLineSeries({
			color: 'blue',
			lineWidth: 2,
			priceFormat: {
				type: 'custom',
				formatter: price => currentScale === 'log' ? (Math.pow(10, price)).toFixed(2) : price.toFixed(2),
			},
		});

		// ► Échelle actuelle (globale)
		window.currentScale = 'arith';

		// ► Affichage initial
		updateBTCChartData(lineSeries, chart, dataArith, dataLog, window.currentScale);

		// ► Gestion du sélecteur d’échelle
		document.getElementById('scaleSelector').addEventListener('change', e => {
			window.currentScale = e.target.value;
			updateBTCChartData(lineSeries, chart, dataArith, dataLog, window.currentScale);
		});

		// ► Redimensionnement dynamique
		window.addEventListener('resize', () => {
			chart.applyOptions({ width: document.getElementById('chart').clientWidth });
		});

	} catch (e) {
		alert(e.message);
		console.error(e);
	}
}



// 1.6 :
// ===================================================================================================================================
//                                INIT : Lancement initial du graphique BTC


drawBTCChart();




updateBTCChartData
