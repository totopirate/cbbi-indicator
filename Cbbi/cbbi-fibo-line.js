


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                              3 : ( 3.1 , 3.2 )


// ===================================================================================================================================
//                                3.1 :
//                                Dessine les lignes Fibonacci + trace les segments colorés sur les zones selon les valeurs données
// ===================================================================================================================================
//                                3.2 :
//                                Efface toutes les lignes Fibonacci et séries colorées du graphique
// ===================================================================================================================================



// 3.1 :
// ===================================================================================================================================
//                                Dessine les lignes Fibonacci + trace les segments colorés sur les zones selon les valeurs données

function drawFibonacciColoredLine(price1, price2, data) {
	clearFibonacci();
	const levels = [0, 0.146, 0.236, 0.382, 0.5, 0.618, 0.786, 0.854, 0.90, 1];
	const maxPrice = Math.max(price1, price2);
	const minPrice = Math.min(price1, price2);
	levels.forEach(level => {
		const fibPrice = maxPrice - (maxPrice - minPrice) * (1 - level);
		const line = baseSeries.createPriceLine({
			price: fibPrice,
			color: 'rgba(255,0,0,0.7)',
			lineWidth: 1,
			lineStyle: LightweightCharts.LineStyle.Solid,
			axisLabelVisible: true,
			title: `Fib ${(level*100).toFixed(1)}%`,
		});
		fibLines.push(line);
	});
	const fibPrices = levels.map(level => maxPrice - (maxPrice - minPrice) * (1 - level));

	function findZone(value) {
		for (let i = 0; i < fibPrices.length - 1; i++) {
			const high = Math.max(fibPrices[i], fibPrices[i + 1]);
			const low = Math.min(fibPrices[i], fibPrices[i + 1]);
			if (value >= low && value <= high) return i;
		}
		return fibPrices.length - 2;
	}
	let segments = [];
	let currentZone = findZone(data[0].value);
	let currentSegment = [data[0]];
	for (let i = 1; i < data.length; i++) {
		const zone = findZone(data[i].value);
		if (zone === currentZone) {
			currentSegment.push(data[i]);
		} else {
			segments.push({
				zone: currentZone,
				points: currentSegment,
				startTime: currentSegment[0].time,
				endTime: currentSegment[currentSegment.length - 1].time
			});
			currentZone = zone;
			currentSegment = [data[i]];
		}
	}
	if (currentSegment.length) {
		segments.push({
			zone: currentZone,
			points: currentSegment,
			startTime: currentSegment[0].time,
			endTime: currentSegment[currentSegment.length - 1].time
		});
	}
	// ✅ POINT 1 : Sauvegarde des segments dans une variable globale
	window.cbbiSegments = segments;
	coloredSeries.forEach(s => chart.removeSeries(s));
	coloredSeries = [];
	segments.forEach(({
		zone,
		points
	}) => {
		const rgbaColor = zoneColors[zone] ? zoneColors[zone].color : 'rgba(0,0,0,0.4)';
		const series = chart.addLineSeries({
			color: rgbaColor,
			lineWidth: 3,
			priceLineVisible: false,
			lastValueVisible: false,
		});
		series.setData(points);
		coloredSeries.push(series);
	});
	// ✅ POINT 2 : Coloration du BTC via fichier externe
	if (typeof colorBTCFromCBBISegments === 'function' && window.cbbiSegments) {
		colorBTCFromCBBISegments(window.cbbiSegments);
	}
	if (window.cbbiSegments && window.btcData) {
		setTimeout(() => detectAndExportCrossings(), 500); // délai léger pour garantir le chargement
	}




    
}




// 3.2 :
// ===================================================================================================================================
//                                Efface toutes les lignes Fibonacci et séries colorées du graphique

function clearFibonacci() {
	fibLines.forEach(line => baseSeries.removePriceLine(line));
	fibLines = [];
	coloredSeries.forEach(series => chart.removeSeries(series));
	coloredSeries = [];
	if (window.btcColoredSeries) {
		window.btcColoredSeries.forEach(s => window.btcChart.removeSeries(s));
		window.btcColoredSeries = [];
	}
}
