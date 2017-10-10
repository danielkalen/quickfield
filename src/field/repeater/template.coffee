DOM = import 'quickdom'
COLORS = import '../../constants/colors'
import {collapseIcons} from '../group/template'

export default DOM.template(
	['div'
		ref: 'field'
		style:
			position: 'relative'
			boxSizing: 'border-box'
			verticalAlign: 'top'
			display: 'none'
			width: (field)-> field.state.width
			fontFamily: (field)-> field.settings.fontFamily
			borderRadius: 3
			textAlign: 'left'
			$visible:
				display: 'inline-block'
			$showError:
				animation: '0.2s fieldErrorShake'

		['div'
			ref: 'label'
			style:
				display: 'none'
				fontFamily: 'inherit'
				fontSize: '16px'
				fontWeight: 600
				textAlign: 'left'
				color: COLORS.black
				cursor: 'default'
				userSelect: 'none'
				$showLabel:
					display: 'block'
				$showError:
					color: COLORS.red
		]

		['div'
			ref: 'collapse'
			style:
				position: 'absolute'
				top: 5
				right: 0
				lineHeight: 0
				fontSize: 0
				display: 'none'
				$showLabel: $collapsable:
					display: 'block'

			['div'
				ref: 'icon'
				style:
					width: 17
					height: 17
					color: COLORS.grey
					fill: COLORS.grey
					$hover:
						color: COLORS.grey_dark
						fill: COLORS.grey_dark

				collapseIcons...
			]
		]

		['div'
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
		]
		
		['div'
			ref: 'innerwrap'
			unpassableStates: ['visible','hover','focus','disabled','showLabel','showError','showHelp','collapsed','valid','invalid']
			style:
				position: 'relative'
				boxSizing: 'border-box'
				marginTop: 15
				fontFamily: 'inherit'
				textAlign: 'justify'
				textJustify: 'distribute-all-lines'
				fontSize: 0
				$collapsed:
					display: 'none'

			['div'
				ref: 'addButton'
				style:
					position: 'relative'
					verticalAlign: 'middle'
					boxSizing: 'border-box'
					padding: 12
					backgroundColor: COLORS.grey_semi_light
					borderRadius: 3
					cursor: 'pointer'
					userSelect: 'none'
					lineHeight: '1em'
					textAlign: 'center'
					$disabled:
						display: 'none'
					$inlineStyle:
						display: 'inline-block'
						top: (field)-> (field.settings.groupMargin/2) * -1

				['div'
					style:
						display: 'inline-block'
						width: 15
						height: 15
						color: COLORS.black
						fill: COLORS.black
					
					(import '../../svg/plus')
				]
			]
		]
	]
)



exports.cloneIcon = (import '../../svg/clone').extend(options:style:{width:11})
exports.removeIcon = (import '../../svg/remove').extend(options:style:{width:11})


export blockGroup = {}

export inlineGroup =
	default:
		# options: style:
		# 	verticalAlign: 'middle'
			
		children:
			innerwrap: options:
				style:
					display: 'inline-block'
					verticalAlign: 'middle'
					marginTop: 0
			
			actions: options:
				events: inserted: ()-> @insertAfter(@parent.child.innerwrap)
				style:
					position: 'static'
					verticalAlign: 'middle'
					display: 'inline-table'
			
	
	action:
		['div'
			events: inserted: ()-> @style('borderTop', "1px solid #{COLORS.grey}") if @index
			style:
				boxSizing: 'border-box'
				display: 'table-row'
				padding: 4


			['div'
				ref: 'icon'
				style:
					verticalAlign: 'middle'
					display: 'table-cell'
					color: COLORS.black
					fill: COLORS.black
					opacity: 0.6
					$hover:
						opacity: 1
			]
		]


















