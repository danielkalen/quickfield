DOM = import 'quickdom'
COLORS = import '../../constants/colors'

export default DOM.template(
	['div'
		ref: 'field'
		style:
			position: 'relative'
			display: 'none'
			width: (field)-> field.state.width
			boxSizing: 'border-box'
			fontFamily: (field)-> field.settings.fontFamily
			$visible: $hasVisibleChoices:
				display: 'inline-block'
			$showError:
				animation: '0.2s fieldErrorShake'

		['div'
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
		]
		
		['div'
			ref: 'innerwrap'
			style:
				position: 'relative'
				boxSizing: 'border-box'
				fontFamily: 'inherit'
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

export choiceGroup = DOM.template(
	['div'
		ref: 'choiceGroup'
		style: 
			marginBottom: (field)-> field.settings.spacing
			userSelect: 'none'
			fontSize: '0'
			whiteSpace: 'nowrap'
	]
)

export choice = DOM.template(
	['div'
		ref: 'choice'
		styleAfterInsert: true
		style:
			position: 'relative'
			display: 'inline-block'
			width: 'auto'
			marginLeft: (field)-> if @index then "calc(100% - (100% - #{field.settings.spacing}px))"
			# minHeight: '46px'
			padding: '0 12px'
			borderRadius: '2px'
			backgroundColor: 'white'
			fontFamily: 'inherit'
			textAlign: 'center'
			color: COLORS.black
			boxSizing: 'border-box'
			verticalAlign: 'top'
			cursor: 'pointer'
			$definedWidth:
				width: (field)-> "calc((100% - #{field.settings.spacing * (field.settings.perGroup-1)}px) / #{field.settings.perGroup})"
			$selected:
				color: COLORS.orange
			$unavailable:
				display: 'none'
			$disabled:
				cursor: 'not-allowed'
				opacity: 0.7
				color: COLORS.grey

		['div'
			ref: 'border'
			style:
				position: 'absolute'
				zIndex: 2
				top: '0'
				left: '0'
				width: '100%'
				height: '100%'
				borderWidth: '1px'
				borderStyle: 'solid'
				borderColor: COLORS.grey_light
				borderRadius: '2px'
				boxSizing: 'border-box'
				$selected:
					borderColor: 'inherit'
					borderWidth: '2px'
				$disabled:
					borderColor: COLORS.grey_light
		]
		['div'
			ref: 'label'
			style:
				position: 'relative'
				display: 'block'
				padding: '15px 0px'
				fontFamily: 'inherit'
				fontSize: (field)-> field.settings.fontSize
				fontWeight: '500'
		]
	]
)

export choiceIcon = DOM.template(
	['div'
		ref: 'icon'
		style:
			position: 'absolute'
			top: '50%'
			display: 'block'
			fontSize: '20px'
			opacity: 0.16
			transform: 'translateY(-50%)'
	]
)













