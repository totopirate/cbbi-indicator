
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                              4 : ( 4.1 ; 4.2 )

// ===================================================================================================================================
//                                4.1 :
//                                Configuration des contrôles utilisateur pour modifier les couleurs et opacités des zones
// ===================================================================================================================================
//                                4.2 :
//                                Redessine les segments colorés selon les couleurs et opacités modifiées par l’utilisateur
// ===================================================================================================================================


// 4.1 :
// ===================================================================================================================================
//                                Configuration des contrôles utilisateur pour modifier les couleurs et opacités des zones

function setupColorControls() {
	const container = document.getElementById('colorControls');
	if (!container) return; // ⛔️ Stoppe la fonction si le conteneur n'existe pas

	container.innerHTML = '';

	zoneColors.forEach((zone, index) => {
		const label = document.createElement('label');
		label.style.flexDirection = 'row';

		// Texte descriptif de la zone
		const text = document.createElement('span');
		text.textContent = `Zone ${index + 1} : `;
		label.appendChild(text);

		// Input couleur (color picker)
		const colorInput = document.createElement('input');
		colorInput.type = 'color';
		colorInput.value = rgbaToHex(zone.color);
		colorInput.dataset.zoneIndex = index;
		label.appendChild(colorInput);

		// Label affichage opacité actuelle
		const opacityLabel = document.createElement('span');
		opacityLabel.className = 'opacity-label';
		opacityLabel.textContent = (zone.alpha).toFixed(2);
		label.appendChild(opacityLabel);

		// Slider opacité
		const opacityInput = document.createElement('input');
		opacityInput.type = 'range';
		opacityInput.min = 0;
		opacityInput.max = 1;
		opacityInput.step = 0.05;
		opacityInput.value = zone.alpha;
		opacityInput.dataset.zoneIndex = index;
		label.appendChild(opacityInput);

		container.appendChild(label);

		// Gestionnaire d’événement pour changement de couleur
		colorInput.oninput = e => {
			const idx = Number(e.target.dataset.zoneIndex);
			const alpha = zoneColors[idx].alpha;
			const hex = e.target.value;
			zoneColors[idx].color = hexToRgba(hex, alpha);
			if (coloredSeries.length > 0) {
				redrawColoredSeries();
			}
		};

		// Gestionnaire d’événement pour changement d’opacité
		opacityInput.oninput = e => {
			const idx = Number(e.target.dataset.zoneIndex);
			const alpha = Number(e.target.value);
			zoneColors[idx].alpha = alpha;
			const hex = rgbaToHex(zoneColors[idx].color);
			zoneColors[idx].color = hexToRgba(hex, alpha);
			opacityLabel.textContent = alpha.toFixed(2);
			if (coloredSeries.length > 0) {
				redrawColoredSeries();
			}
		};
	});
}

// 4.2 :
// ===================================================================================================================================
//                                Redessine les segments colorés selon les couleurs et opacités modifiées par l’utilisateur


function redrawColoredSeries() {
	if (!baseSeries) return;
	const baseData = baseSeries.data();
	if (!baseData || baseData.length === 0) return;
	if (typeof window._fibPrice1 === 'undefined' || typeof window._fibPrice2 === 'undefined') return;
	const price1 = window._fibPrice1;
	const price2 = window._fibPrice2;
	// Suppression des anciennes séries colorées
	coloredSeries.forEach(s => chart.removeSeries(s));
	coloredSeries = [];
	// Niveaux Fibonacci et prix max/min recalculés
	const levels = [0, 0.146, 0.236, 0.382, 0.5, 0.618, 0.786, 0.854, 0.90, 1];
	const maxPrice = Math.max(price1, price2);
	const minPrice = Math.min(price1, price2);
	const fibPrices = levels.map(level => maxPrice - (maxPrice - minPrice) * (1 - level));
	// Fonction locale findZone (identique à drawFibonacciColoredLine)
	function findZone(value) {
		for (let i = 0; i < fibPrices.length - 1; i++) {
			const high = Math.max(fibPrices[i], fibPrices[i + 1]);
			const low = Math.min(fibPrices[i], fibPrices[i + 1]);
			if (value >= low && value <= high) return i;
		}
		return fibPrices.length - 2;
	}
	// Segmenter les données baseData selon les zones Fibonacci
	let segments = [];
	let currentZone = findZone(baseData[0].value);
	let currentSegment = [baseData[0]];
	for (let i = 1; i < baseData.length; i++) {
		const zone = findZone(baseData[i].value);
		if (zone === currentZone) {
			currentSegment.push(baseData[i]);
		} else {
			segments.push({
				zone: currentZone,
				points: currentSegment
			});
			currentZone = zone;
			currentSegment = [baseData[i]];
		}
	}
	if (currentSegment.length) {
		segments.push({
			zone: currentZone,
			points: currentSegment
		});
	}
	// Création des séries colorées avec les couleurs et alphas actuels
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
}
