import DOM from 'quickdom'

export default DOM.template(
	['*svg'
		attrs:
			width: '12px'
			height: '12px'
			viewBox: '5 7 12 12'
			tabindex: -1
			focusable: false
		style:
			width: '9px'
			height: '9px'


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
)





