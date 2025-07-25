// =========================================================================================================
// Cfgi-chart.js - Affichage du graphique CFGI avec 5 zones fixes : 0-20 / 20-40 / 40-60 / 60-80 / 80-100
// =========================================================================================================

let chartCFGI;
let baseSeriesCFGI;
let fibLinesCFGI = [];
let coloredSeriesCFGI = [];

const zoneColorsCFGI = [
	{ color: 'rgba(25, 136, 10, 0.8)' }, // 0-20
	{ color: 'rgba(60, 221, 28, 0.58)' },  // 20-40
	{ color: 'rgba(235, 235, 74, 0.64)' },  // 40-60
	{ color: 'rgba(233, 157, 15, 0.64)'  },   // 60-80
	{ color: 'rgba(224, 19, 19, 0.81)' },   // 80-100
];

fetchAndDrawCFGIChart();

async function fetchAndDrawCFGIChart() {
	const response = await fetch("https://api.alternative.me/fng/?limit=0&format=json");
	const json = await response.json();
	const dataRaw = json.data.reverse();
	const data = dataRaw.map(item => ({
		time: new Date(Number(item.timestamp) * 1000).toISOString().split("T")[0],
		value: Number(item.value),
	}));

	chartCFGI = LightweightCharts.createChart(document.getElementById("chartCFGI"), {
		width: document.getElementById("chartCFGI").clientWidth,
		height: 500,
		layout: { background: { color: "#fff" }, textColor: "#000" },
		grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
		timeScale: { timeVisible: true, rightOffset: 50, barSpacing: 5 },
		handleScroll: { mouseWheel: true, pressedMouseMove: true },
		handleScale: { mouseWheel: true, pinch: true, axisPressedMouseMove: true },
		priceScale: { borderVisible: true },
		crosshair: {
			mode: LightweightCharts.CrosshairMode.Normal,
			vertLine: { color: 'rgba(0,0,0,0.5)', width: 1 },
			horzLine: { color: 'rgba(0,0,0,0.5)', width: 1 }
		},
	});

	chartCFGI.timeScale().applyOptions({
		minBarSpacing: 0.01,
		fixLeftEdge: false,
		fixRightEdge: false,
	});

	baseSeriesCFGI = chartCFGI.addLineSeries({ color: 'rgba(0, 0, 255, 0.21)', lineWidth: 2 });
	baseSeriesCFGI.setData(data);
	chartCFGI.timeScale().fitContent();

	// Boutons
	document.getElementById('btnDrawFiboCFGI').onclick = () => drawFixedFibonacciZones(data);
	document.getElementById('btnClearFiboCFGI').onclick = clearFibonacciCFGI;
}

window.addEventListener('resize', () => {
	if (chartCFGI) {
		chartCFGI.resize(document.getElementById('chartCFGI').clientWidth, 500);
	}
});

// Zones fixes : 0-20, 20-40, ..., 80-100
function drawFixedFibonacciZones(data) {
	clearFibonacciCFGI();

	const fibLevels = [0, 20, 40, 60, 80, 100];

	// Lignes horizontales
	fibLevels.forEach(level => {
		const line = baseSeriesCFGI.createPriceLine({
			price: level,
			color: 'rgba(255,0,0,0.7)',
			lineWidth: 1,
			lineStyle: LightweightCharts.LineStyle.Solid,
			axisLabelVisible: true,
			title: `Zone ${level}`,
		});
		fibLinesCFGI.push(line);
	});

	function findZone(value) {
		for (let i = 0; i < fibLevels.length - 1; i++) {
			if (value >= fibLevels[i] && value < fibLevels[i + 1]) return i;
		}
		return fibLevels.length - 2;
	}

	let segments = [];
	let currentZone = findZone(data[0].value);
	let currentSegment = [data[0]];

	for (let i = 1; i < data.length; i++) {
		const point = data[i];
		const zone = findZone(point.value);

		if (zone === currentZone) {
			currentSegment.push(point);
		} else {
			// Ajoute un point fictif de transition à la limite des zones
			const transitionValue = fibLevels[Math.max(currentZone, zone)];
			const prevPoint = data[i - 1];

			const tPrev = new Date(prevPoint.time).getTime();
			const tCurr = new Date(point.time).getTime();
			const tMid = new Date((tPrev + tCurr) / 2).toISOString().split("T")[0];

			const transitionPoint = { time: tMid, value: transitionValue };

			// Termine le segment courant avec ce point de transition
			currentSegment.push(transitionPoint);
			segments.push({ zone: currentZone, points: [...currentSegment] });

			// Commence un nouveau segment à partir de ce même point fictif
			currentSegment = [transitionPoint, point];
			currentZone = zone;
		}
	}
	if (currentSegment.length) {
		segments.push({ zone: currentZone, points: [...currentSegment] });
	}

	// Supprime les anciens segments colorés
	coloredSeriesCFGI.forEach(s => chartCFGI.removeSeries(s));
	coloredSeriesCFGI = [];

	// Crée les nouveaux segments colorés avec continuité
	segments.forEach(({ zone, points }) => {
		const color = zoneColorsCFGI[zone] ? zoneColorsCFGI[zone].color : 'rgba(0,0,0,0.4)';
		const series = chartCFGI.addLineSeries({
			color: color,
			lineWidth: 3,
			priceLineVisible: false,
			lastValueVisible: false,
		});
		series.setData(points);
		coloredSeriesCFGI.push(series);
	});
}

function clearFibonacciCFGI() {
	fibLinesCFGI.forEach(line => baseSeriesCFGI.removePriceLine(line));
	fibLinesCFGI = [];

	coloredSeriesCFGI.forEach(series => chartCFGI.removeSeries(series));
	coloredSeriesCFGI = [];
}
