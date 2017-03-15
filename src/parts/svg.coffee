SVG = 
	checkmark: DOM.template ['*svg', {
		attrs:
			width: '12px'
			height: '12px'
			viewBox: '5 7 12 12'
		style:
			width: '9px'
			height: '9px'
	}
		['*polyline', {
			attrs: 
				'stroke-width': '2'
				'stroke-linecap': 'round'
				'stroke-linejoin': 'round'
				fill: 'none'
				points: '7 13.8888889 9.66666667 17 15 9'
		}]
	]


	angleDown: DOM.template ['*svg', {
		attrs:
			width: '1792px'
			height: '1792px'
			viewBox: '0 0 1792 1792'
		style:
			width: '100%'
			height: '100%'
	}
		['*path' {
			attrs: d: 'M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z'
		}]
	]
