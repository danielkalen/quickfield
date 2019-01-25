import DOM from 'quickdom'

export default DOM.template(
	['*svg'
		attrs:
			viewBox: '0 0 512 512'
			tabindex: -1
			focusable: false
		style:
			width: '100%'
			height: '100%'
			outline: 'none'

		['*path'
			attrs:
				tabindex: -1
				focusable: false
				d: 'M402 201c0 5-2 9-5 13l-128 128c-4 4-8 5-13 5s-9-1-13-5l-128-128c-3-4-5-8-5-13s2-9 5-13c4-3 8-5 13-5h256c5 0 9 2 13 5 3 4 5 8 5 13z'
		]
	]
)





