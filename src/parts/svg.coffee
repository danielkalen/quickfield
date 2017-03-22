SVG = 
	checkmark: DOM.template ['*svg', {
		attrs:
			width: '12px'
			height: '12px'
			viewBox: '5 7 12 12'
			tabindex: -1
			focusable: false
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
				tabindex: -1
				focusable: false
		}]
	]


	angleDown: DOM.template ['*svg', {
		attrs:
			width: '1792px'
			height: '1792px'
			viewBox: '0 0 1792 1792'
			tabindex: -1
			focusable: false
		style:
			width: '100%'
			height: '100%'
			outline: 'none'
	}
		['*path', {
			attrs:
				tabindex: -1
				focusable: false
				d: 'M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z'
		}]
	]


	caretUp: DOM.template ['*svg', {
		attrs:
			viewBox: '0 0 512 512'
			tabindex: -1
			focusable: false
		style:
			width: '100%'
			height: '100%'
	}
		['*path', {
			attrs:
				tabindex: -1
				focusable: false
				d: 'M402 347c0 5-2 10-5 13-4 4-8 6-13 6h-256c-5 0-9-2-13-6-3-3-5-8-5-13s2-9 5-12l128-128c4-4 8-6 13-6s9 2 13 6l128 128c3 3 5 7 5 12z'
		}]
	]


	caretDown: DOM.template ['*svg', {
		attrs:
			viewBox: '0 0 512 512'
			tabindex: -1
			focusable: false
		style:
			width: '100%'
			height: '100%'
	}
		['*path', {
			attrs:
				tabindex: -1
				focusable: false
				d: 'M402 201c0 5-2 9-5 13l-128 128c-4 4-8 5-13 5s-9-1-13-5l-128-128c-3-4-5-8-5-13s2-9 5-13c4-3 8-5 13-5h256c5 0 9 2 13 5 3 4 5 8 5 13z'
		}]
	]
