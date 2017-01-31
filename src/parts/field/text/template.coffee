{
	field: DOM.template ['div', {
		style:
			position: 'relative'
			display: 'none'
			width: (field)-> field.state.width
			boxSizing: 'border-box'
			fontFamily: (field)-> field.options.fontFamily
			$visible:
				display: 'inline-block'
			$showError:
				animation: '0.2s fieldErrorShake'
	}]

	label: DOM.template ['div', {
		style:
			position: 'absolute'
			zIndex: 1
			top: (field)-> parseFloat(field.els.fieldInnerwrap.style('height'))/4
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


	input: DOM.template ['input', {
		type: 'text'
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
			lineHeight: (field)-> @parent.style('height')
			color: COLOR_BLACK
			transform: 'translateY(0)'
			transition: 'transform 0.2s, -webkit-transform 0.2s'
			$filled:
				transform: (field)-> "translateY(#{parseFloat(field.els.fieldInnerwrap.style('height'))/4}px)"
			$showCheckmark:
				padding: '0 44px 0 12px'
	}]


	placeholder: DOM.template ['div', {
		style:
			position: 'absolute'
			zIndex: 2
			top: '0px'
			left: '0px'
			padding: '0 12px'
			fontFamily: 'inherit'
			fontSize: '14px'
			color: COLOR_BLACK
			opacity: 0.7
			userSelect: 'none'
			$filled:
				display: 'none'
	}]


	help: DOM.template ['div', {
		style:
			position: 'absolute'
			top: (field)-> parseFloat(@parent.style('height'))+4+'px'
			left: '0px'
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


	checkmark: DOM.template ['div', {
		position: 'absolute'
		zIndex: 4
		right: '12px'
		top: ()-> parseFloat(@parent.style('height'))/2 - parseFloat(@style('height'))/2
		width: '20px'
		height: '20px'
		borderRadius: '50%'
		backgroundColor: 'white'
		borderWidth: '3px'
		borderStyle: 'solid'
		borderColor: COLOR_GREEN
		display: 'none'
		visibility: 'hidden'
		$showError:
			borderColor: COLOR_RED
		$showCheckmark:
			visibility: 'visible'
		$filled:
			display: 'block'
	},
		['div', { # Mask 1
			position: 'absolute'
			top: '-4px'
			left: '10px'
			width: '15px'
			height: '30px'
			borderRadius: '30px 0 0 30px'
			backgroundColor: ()-> @parent.style('backgroundColor')
			transform: 'rotate(-45deg)'
			transformOrigin: '15px 15px 0'
		}]
		
		['div', { # Mask 2
			position: 'absolute'
			top: '-5px'
			left: '8px'
			width: '15px'
			height: '30px'
			borderRadius: '0 30px 30px 0'
			backgroundColor: ()-> @parent.style('backgroundColor')
			transform: 'rotate(-45deg)'
			transformOrigin: '0 15px 0'
			$filled:
				animation: '4.25s ease-in checkmarkRotatePlaceholder'
				$showError:
					animation: null
		}]
		
		['div', { # Line wrapper
			$filled: $showError:
				position: 'relative'
				zIndex: 2
				animation: '0.55s checkmarkAnimateError'
				transformOrigin: '50% 10px'
		}
			['div', { # Line 1 (short)
				position: 'absolute'
				zIndex: 2
				top: '10px'
				left: '3px'
				display: 'block'
				width: '8px'
				height: '3px'
				borderRadius: '2px'
				backgroundColor: COLOR_GREEN
				transform: 'rotate(45deg)'
				$filled:
					animation: '0.75s checkmarkAnimateSuccessTip'
				
				$showError:
					backgroundColor: COLOR_RED
					left: '4px'
					top: '8px'
					width: '12px'
					$filled:
						animation: null
			}]

			['div', { # Line 2 (long)
				position: 'absolute'
				zIndex: 2
				top: '8px'
				right: '2px'
				display: 'block'
				width: '12px'
				height: '3px'
				borderRadius: '2px'
				backgroundColor: COLOR_GREEN
				transform: 'rotate(45deg)'
				$filled:
					animation: '0.75s checkmarkAnimateSuccessLong'
				
				$showError:
					backgroundColor: COLOR_RED
					top: '8px'
					left: '4px'
					right: 'auto'
					$filled:
						animation: null
			}]
		]
		
		['div', { # Placeholder
			position: 'absolute'
			zIndex: 2
			top: '-4px'
			left: '-3px'
			width: '20px'
			height: '20px'
			borderRadius: '50%'
			borderWidth: '3px'
			borderStyle: 'solid'
			borderColor: helpers.hexToRGBA(COLOR_GREEN, 0.4)
			$showError:
				borderColor: helpers.hexToRGBA(COLOR_RED, 0.4)
		}]
		
		['div', { # Patch
			position: 'absolute'
			zIndex: 1
			top: '-2px'
			left: '6px'
			width: '4px'
			height: '28px'
			backgroundColor: ()-> @parent.style('backgroundColor')
			transform: 'rotate(-45deg)'
		}]
	]
}













