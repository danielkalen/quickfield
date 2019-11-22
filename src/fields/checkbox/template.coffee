import DOM from 'quickdom'
import COLORS from '../../constants/colors'
import {checkmark} from '../../svg'


export default DOM.template(
	['div'
		ref: 'field'
		style:
			position: 'relative'
			display: 'none'
			width: (field)-> field.state.width
			boxSizing: 'border-box'
			fontFamily: (field)-> field.settings.fontFamily
			textAlign: 'left'
			$visible:
				display: 'inline-block'
			$showError:
				animation: '0.2s fieldErrorShake'

		
		['div'
			ref: 'innerwrap'
			style:
				position: 'relative'
				boxSizing: 'border-box'
				fontFamily: 'inherit'
				display: 'flex'
				flexWrap: 'nowrap'
				alignContent: 'flex-start'
				alignItems: 'flex-start'


			['div'
				ref: 'input'
				style:
					position: 'relative'
					alignSelf: 'start'
					zIndex: 2
					flexGrow: 0
					flexShrink: 0
					width: (field)-> field.settings.size
					height: (field)-> field.settings.size
					margin: '0 auto'
					backgroundColor: (field)-> field.settings.colors.background
					border: "1px solid #{COLORS.grey_light}"
					borderRadius: 3
					cursor: 'pointer'
					$showError:
						borderColor: COLORS.red
					# $toggled:
					# 	borderColor: (field)-> field.settings.colors.symbol

				['div'
					ref: 'checkmark'
					style:
						position: 'absolute'
						zIndex: 2
						left: 0
						right: 0
						top: '50%'
						transform: 'translateY(-50%)'
						width: (field)-> field.settings.size/1.5
						height: (field)-> field.settings.size/1.5
						margin: '0 auto'
						boxSizing: 'border-box'
						lineHeight: 0
						userSelect: 'none'
						display: 'none'
						$toggled:
							display: 'block'

					checkmark.extend(
						style:
							width: '100%'
							height: '100%'
							stroke: (field)-> field.settings.colors.symbol
							outline: 'none'
					)
				]
			]


			['div'
				ref: 'label'
				style:
					display: 'none'
					marginLeft: 5
					fontFamily: 'inherit'
					fontSize: (field)-> field.settings.fontSize
					color: COLORS.black
					cursor: 'default'
					userSelect: 'none'
					$showLabel:
						display: 'block'
					# $showError:
					# 	color: COLORS.red
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
	]
)
