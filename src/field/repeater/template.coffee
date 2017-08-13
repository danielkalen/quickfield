DOM = import 'quickdom'
SVG = import '../../svg'
COLORS = import '../../constants/colors'

export action = DOM.template(
	['div'
		styleAfterInsert: true
		style:
			boxSizing: 'border-box'
			padding: 4
			borderTop: ()-> "1px solid #{COLORS.grey_light2}" unless @index is 0


		['div'
			ref: 'icon'
			style:
				color: COLORS.black
				fill: COLORS.black
				opacity: 0.25
				$hover:
					opacity: 0.6
		]
	]
)