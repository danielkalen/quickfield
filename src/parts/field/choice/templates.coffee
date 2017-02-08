{
	field: DOM.template ['div', {
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
	}]


	fieldInnerwrap: DOM.template ['div', {
		style:
			position: 'relative'
			boxSizing: 'border-box'
			fontFamily: 'inherit'
	}]


	label: DOM.template ['div', {
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


	choiceGroup: DOM.template ['div', {
		style: 
			marginBottom: (field)-> field.settings.spacing
			userSelect: 'none'
			# textAlign: 'justify'
			fontSize: '0'
	}]
	
	choice: DOM.template ['div', {
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
		['div', { # Border
			style:
				position: 'absolute'
				zIndex: 2
				top: '0'
				left: '0'
				width: '100%'
				height: '100%'
				boxSizing: 'border-box'
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
	]

	choiceLabel: DOM.template ['div', {
		style:
			position: 'relative'
			# top: ()-> (parseFloat(this.style('height'))+parseFloat(this.style('paddingTop')))/2 + 'px'
			# top: '50%'
			display: 'block'
			padding: '15px 0px'
			fontFamily: 'inherit'
			fontSize: '14px'
			fontWeight: '500'
			# transform: 'translateY(-50%)'
	}]


	choiceIcon: DOM.template ['div', {
		style:
			position: 'absolute'
			top: '50%'
			display: 'block'
			fontSize: '20px'
			opacity: 0.16
			transform: 'translateY(-50%)'
	}]

	help: DOM.template ['div', {
		style:
			marginTop: '10px'
			fontFamily: 'inherit'
			fontSize: '11px'
			color: COLOR_GREY
			display: 'none'
			$showError:
				color: COLOR_RED
			$showHelp:
				display: 'block'
			$showError:
				display: 'block'
	}]
}













