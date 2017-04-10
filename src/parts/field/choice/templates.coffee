DOM = import 'quickdom/src'

module.exports =
	field: DOM.template ['div', {
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
				color: COLOR_BLACK
				cursor: 'default'
				pointerEvents: 'none'
				$hasLabel:
					display: 'block'
				$focus:
					color: COLOR_ORANGE
				$showError:
					color: COLOR_RED
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
				color: COLOR_GREY
				display: 'none'
				$showError:
					color: COLOR_RED
					display: 'block'
				$showHelp:
					display: 'block'
		}]
	]


	choiceGroup: DOM.template ['div', {
		ref: 'choiceGroup'
		style: 
			marginBottom: (field)-> field.settings.spacing
			userSelect: 'none'
			fontSize: '0'
	}]
	
	choice: DOM.template ['div', {
		ref: 'choice'
		style:
			position: 'relative'
			display: 'inline-block'
			width: (field)-> "calc((100% - #{field.settings.spacing * (field.settings.perGroup-1)}px) / #{field.settings.perGroup})"
			marginLeft: (field)-> if @index then "calc(100% - (100% - #{field.settings.spacing}px))"
			# minHeight: '46px'
			padding: '0 12px'
			borderRadius: '2px'
			backgroundColor: 'white'
			fontFamily: 'inherit'
			textAlign: 'center'
			color: COLOR_BLACK
			boxSizing: 'border-box'
			verticalAlign: 'top'
			cursor: 'pointer'
			$selected:
				color: COLOR_ORANGE
			$unavailable:
				display: 'none'
	}
		['div', {
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
				borderColor: COLOR_GREY_LIGHT
				borderRadius: '2px'
				boxSizing: 'border-box'
				$selected:
					borderColor: 'inherit'
					borderWidth: '2px'
				$disabled:
					backgroundColor: COLOR_GREY_LIGHT
		}]
		['div', {
			ref: 'label'
			style:
				position: 'relative'
				display: 'block'
				padding: '15px 0px'
				fontFamily: 'inherit'
				fontSize: '14px'
				fontWeight: '500'
		}]
	]

	choiceIcon: DOM.template ['div', {
		ref: 'icon'
		style:
			position: 'absolute'
			top: '50%'
			display: 'block'
			fontSize: '20px'
			opacity: 0.16
			transform: 'translateY(-50%)'
	}]













