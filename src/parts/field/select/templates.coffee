{
	field: DOM.template ['div', {
		style:
			position: 'relative'
			display: 'none'
			width: (field)-> field.state.width
			boxSizing: 'border-box'
			fontFamily: (field)-> field.settings.fontFamily
			$visible:
				display: 'inline-block'
			$showError:
				animation: '0.2s fieldErrorShake'
	}]


	fieldInnerwrap: DOM.template ['div', {
		style:
			position: 'relative'
			height: '46px'
			backgroundColor: 'white'
			borderWidth: '1px'
			borderStyle: 'solid'
			borderColor: COLOR_GREY_LIGHT
			borderRadius: '2px'
			boxSizing: 'border-box'
			fontFamily: 'inherit'
			transition: 'border-color 0.2s'
			$focus:
				borderColor: COLOR_ORANGE
			$showError:
				borderColor: COLOR_RED
			$disabled:
				borderColor: COLOR_GREY_LIGHT
				backgroundColor: COLOR_GREY_LIGHT
	}]


	label: DOM.template ['div', {
		style:
			position: 'absolute'
			zIndex: 1
			top: (field)-> parseFloat(field.els.fieldInnerwrap.raw.style.height)/6
			left: '12px'
			fontFamily: 'inherit'
			fontSize: '11px'
			fontWeight: 600
			lineHeight: '1em'
			color: COLOR_GREY
			opacity: 0
			transition: 'opacity 0.2s, color 0.2s'
			cursor: 'default'
			pointerEvents: 'none'
			$filled:
				opacity: 1
			$focus:
				color: COLOR_ORANGE
			$showError:
				color: COLOR_RED
	}]


	input: DOM.template ['div', {
		style:
			position: 'absolute'
			zIndex: 3
			top: '0px'
			left: '0px'
			display: 'block'
			width: '100%'
			height: '100%'
			margin: '0'
			padding: '0 12px'
			backgroundColor: 'transparent'
			appearance: 'none'
			border: 'none'
			outline: 'none'
			fontFamily: 'inherit'
			fontSize: '14px'
			lineHeight: ()-> @parent.raw.style.height
			color: COLOR_BLACK
			boxSizing: 'border-box'
			transform: 'translateY(0)'
			transition: 'transform 0.2s, -webkit-transform 0.2s'
			$filled: $hasLabel:
				transform: (field)-> "translateY(#{parseFloat(field.els.fieldInnerwrap.style('height'))/8}px)"
			$showCheckmark:
				padding: '0 44px 0 12px'
	}]


	placeholder: DOM.template ['div', {
		style:
			position: 'absolute'
			zIndex: 2
			top: '0px'
			left: '0px'
			lineHeight: ()-> @parent.raw.style.height
			padding: '0 12px'
			fontFamily: 'inherit'
			fontSize: '14px'
			color: COLOR_BLACK
			opacity: 0.5
			userSelect: 'none'
			transform: 'translateY(0)'
			transition: 'transform 0.2s, -webkit-transform 0.2s'
			$filled:
				visibility: 'hidden'
				$hasLabel:
					transform: (field)-> "translateY(#{parseFloat(field.els.fieldInnerwrap.style('height'))/8}px)"
	}]


	caret: DOM.template ['div', {
		style:
			position: 'absolute'
			zIndex: 3
			top: (field)-> parseFloat(field.els.input.raw.style.height)/2 - 17/2
			right: '12px'
			width: '17px'
			height: '17px'
	} SVG.angleDown]


	help: DOM.template ['div', {
		style:
			position: 'absolute'
			top: (field)-> parseFloat(@parent.raw.style.height)+4+'px'
			left: '0px'
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
}













