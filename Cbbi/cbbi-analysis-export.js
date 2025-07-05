// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                              6 :

// ===================================================================================================================================
//                                6.1 :
//                                CROISEMENT CBBI ↔ FIBONACCI + EXPORT DES DONNÉES POUR GOOGLE SHEET 
// ===================================================================================================================================

function detectAndExportCrossings() {
	if (!window.cbbiSegments || !window.btcData || !window._fibPrice1 || !window._fibPrice2) {
		console.warn("Données manquantes pour détecter les croisements");
		return;
	}
	const fibLevels = [0, 0.146, 0.236, 0.382, 0.5, 0.618, 0.786, 0.854, 0.90, 1];
	const max = Math.max(window._fibPrice1, window._fibPrice2);
	const min = Math.min(window._fibPrice1, window._fibPrice2);
	const fibValues = fibLevels.map(lvl => max - (max - min) * (1 - lvl));
	const crossings = [];
	const cbbiRawData = window.cbbiSegments.flatMap(seg => seg.points);
	for (let i = 1; i < cbbiRawData.length; i++) {
		const prev = cbbiRawData[i - 1];
		const curr = cbbiRawData[i];
		fibValues.forEach((fiboVal, idx) => {
			const crossed = (prev.value < fiboVal && curr.value >= fiboVal) || (prev.value > fiboVal && curr.value <= fiboVal);
			if (crossed) {
				// Date ISO (yyyy-mm-dd)
				const date = curr.time;
				const cbbi = curr.value;
				const fibLevel = fibLevels[idx];
				// Trouver le prix BTC à la même date (ou plus proche)
				const btcAtDate = window.btcData.find(b => {
					const btcDate = new Date(b.time * 1000).toISOString().split("T")[0];
					return btcDate === date;
				});
				if (!btcAtDate) return;
				crossings.push({
					date,
					cbbi: Number(cbbi.toFixed(2)),
					fibLevel: Number(fibLevel.toFixed(3)),
					btcPrice: Number(btcAtDate.value.toFixed(2)),
				});
			}
		});
	}
	// Ajout des écarts (temps + %)
	const enriched = crossings.map((entry, i, arr) => {
		if (i === 0) return { ...entry,
			daysSinceLast: 0,
			btcChangePercent: 0
		};
		const prev = arr[i - 1];
		const daysSinceLast = Math.round((new Date(entry.date) - new Date(prev.date)) / (1000 * 3600 * 24));
		const btcChangePercent = ((entry.btcPrice - prev.btcPrice) / prev.btcPrice * 100).toFixed(2);
		return { ...entry,
			daysSinceLast,
			btcChangePercent: Number(btcChangePercent),
		};
	});
	window.exportData = enriched;
	console.table(enriched);
	// Conversion en CSV
	const header = "Date,CBBI,FibLevel,BTC Price ($),Days Since Last,BTC Change (%)";
	const csvRows = enriched.map(e => [e.date, e.cbbi, e.fibLevel, e.btcPrice, e.daysSinceLast, e.btcChangePercent].join(","));
	const csvContent = [header, ...csvRows].join("\n");
	// Création du fichier Blob et téléchargement automatique
	const blob = new Blob([csvContent], {
		type: "text/csv;charset=utf-8;"
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.setAttribute("href", url);
	link.setAttribute("download", "croisements_cbbi_fibonacci_btc.csv");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
setTimeout(() => detectAndExportCrossings(), 2000); // attend 2s que tout soit chargé


