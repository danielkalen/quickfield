DOM = import 'quickdom'

module.exports = DOM.template(
	['*svg'
		attrs:
			viewBox: '0 0 15 15'
			tabindex: -1
			focusable: false
		style:
			width: '100%'
			height: '100%'
			outline: 'none'

		['*polygon'
			attrs:
				tabindex: -1
				focusable: false
				points: '9 0 6 0 6 6 0 6 0 9 6 9 6 15 9 15 9 9 15 9 15 6 9 6'
		]
	]
)






