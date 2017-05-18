DOM = import 'quickdom/src'
SVG = import '../../svg'
COLORS = import '../../constants/colors'

module.exports.field = DOM.template(
	['div', {
		ref: 'field'
		style:
			position: 'relative'
			display: 'none'
			width: (field)-> field.state.width
			boxSizing: 'border-box'
			fontFamily: (field)-> field.settings.fontFamily
			$visible: $hasVisibleOptions:
				display: 'inline-block'
			$showError:
				animation: '0.2s fieldErrorShake'
	}
		['div', {
			ref: 'label'
			style:
				display: 'none'
				marginBottom: '12px'
				fontFamily: 'inherit'
				fontSize: '13px'
				fontWeight: 600
				textAlign: 'left'
				color: COLORS.black
				cursor: 'default'
				pointerEvents: 'none'
				userSelect: 'none'
				$showLabel:
					display: 'block'
				$showError:
					color: COLORS.red
		}]
		
		['div', {
			ref: 'innerwrap'
			style:
				position: 'relative'
				boxSizing: 'border-box'
				fontFamily: 'inherit'
		}]

		['div', {
			ref: 'help'
			style:
				marginTop: '10px'
				fontFamily: 'inherit'
				fontSize: '11px'
				color: COLORS.grey
				display: 'none'
				$showError:
					color: COLORS.red
					display: 'block'
				$showHelp:
					display: 'block'
		}]
	]
)

module.exports.action = DOM.template(
	['div',
		styleAfterInsert: true
		style:
			boxSizing: 'border-box'
			padding: 4
			borderTop: ()-> "1px solid #{COLORS.grey_light2}" unless @index is 0


		['div',
			ref: 'icon'
			style:
				color: '#000000'
				fill: '#000000'
				opacity: 0.25
				$hover:
					opacity: 0.6
		]
	]
)

module.exports.collapseAction = module.exports.action.extend(
	ref: 'collapse'
	children:
		icon:
			children: [
				SVG.caretUp.extend
					options: style:
						display: 'block'
						$collapsed:
							display: 'none'
				
				SVG.caretDown.extend
					options: style:
						display: 'none'
						$collapsed:
							display: 'block'
			]
)















