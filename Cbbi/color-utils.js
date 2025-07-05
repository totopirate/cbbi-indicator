// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                              5 :

// ===================================================================================================================================
//                                5.1 :
//                                Fonctions utilitaires de conversion entre rgba et hex
// ===================================================================================================================================

function rgbaToHex(rgba) {
	const result = rgba.match(/rgba?\((\d+), ?(\d+), ?(\d+)(?:, ?([\d.]+))?\)/);
	if (!result) return "#000000";
	let r = parseInt(result[1]).toString(16).padStart(2, "0");
	let g = parseInt(result[2]).toString(16).padStart(2, "0");
	let b = parseInt(result[3]).toString(16).padStart(2, "0");
	return `#${r}${g}${b}`;
}

function hexToRgba(hex, alpha = 1) {
	let r = parseInt(hex.slice(1, 3), 16);
	let g = parseInt(hex.slice(3, 5), 16);
	let b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r},${g},${b},${alpha})`;
}

