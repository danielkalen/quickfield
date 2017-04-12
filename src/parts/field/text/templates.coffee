DOM = import 'quickdom/src'
COLORS = import '../../constants/colors'

module.exports =
	field: DOM.template ['div', {
		ref: 'field'
		style:
			position: 'relative'
			display: 'none'
			boxSizing: 'border-box'
			fontFamily: (field)-> field.settings.fontFamily
			$visible:
				display: 'inline-block'
			$showError:
				animation: '0.2s fieldErrorShake'
	}
		['div', {
			ref: 'label'
			style:
				position: 'absolute'
				zIndex: 1
				top: (field)-> parseFloat(field.el.child.innerwrap.styleSafe 'height')/6
				left: (field)-> parseFloat(field.el.child.icon?.styleSafe 'width') or 0
				padding: '0 12px'
				fontFamily: 'inherit'
				fontSize: '11px'
				fontWeight: 600
				lineHeight: '1em'
				color: COLORS.grey
				opacity: 0
				transition: 'opacity 0.2s, color 0.2s'
				whiteSpace: 'nowrap'
				userSelect: 'none'
				cursor: 'default'
				pointerEvents: 'none'
				$filled:
					opacity: 1
				$focus:
					color: COLORS.orange
				$showError:
					color: COLORS.red
		}]

		['div', {
			ref: 'innerwrap'
			style:
				position: 'relative'
				height: '46px'
				backgroundColor: 'white'
				borderWidth: '1px'
				borderStyle: 'solid'
				borderColor: COLORS.grey_light
				borderRadius: '2px'
				boxSizing: 'border-box'
				fontFamily: 'inherit'
				transition: 'border-color 0.2s'
				$focus:
					borderColor: COLORS.orange
				$showError:
					borderColor: COLORS.red
				$disabled:
					borderColor: COLORS.grey_light
					backgroundColor: COLORS.grey_light
		}
			['input', {
				ref: 'input'
				type: 'text'
				style:
					position: 'relative'
					zIndex: 3
					display: 'inline-block'
					verticalAlign: 'top'
					width: (field)-> if not field.settings.autoWidth
						subtract = ''
						subtract += " -#{field.el.child.icon.raw.styleSafe('width', true)}" if field.el.child.icon
						subtract += " -#{field.el.child.checkmark.styleSafe('width', true)}" if field.el.child.checkmark
						return "calc(100% + (#{subtract or '0px'}))"
					height: ()-> @parent.styleSafe('height')
					margin: '0'
					padding: '0 12px'
					backgroundColor: 'transparent'
					appearance: 'none'
					border: 'none'
					outline: 'none'
					fontFamily: 'inherit'
					fontSize: '14px'
					lineHeight: ()-> @parent.styleSafe('height')
					color: COLORS.black
					boxSizing: 'border-box'
					whiteSpace: 'nowrap'
					transform: 'translateY(0)'
					transition: 'transform 0.2s, -webkit-transform 0.2s'
					$filled: $hasLabel:
						transform: (field)-> "translateY(#{@parent.height/8}px)"
					$showCheckmark:
						padding: '0 44px 0 12px'
			}]

			['div', {
				ref: 'placeholder'
				style:
					position: 'absolute'
					zIndex: 2
					top: '0px'
					left: (field)-> field.el.child.icon?.styleSafe('width') or 0
					lineHeight: ()-> @parent.styleSafe('height')
					padding: (field)-> field.el.child.input.styleSafe('padding')
					fontFamily: (field)-> field.el.child.input.styleSafe('fontFamily')
					fontSize: (field)-> field.el.child.input.styleSafe('fontSize')
					color: COLORS.black
					opacity: 0.5
					userSelect: 'none'
					whiteSpace: 'nowrap'
					transform: 'translateY(0)'
					transition: 'transform 0.2s, -webkit-transform 0.2s'
					$filled:
						visibility: 'hidden'
						$hasLabel:
							transform: (field)-> "translateY(#{@parent.height/8}px)"
			}]
		]
		
		['div', {
			ref: 'help'
			style:
				position: 'absolute'
				top: (field)-> parseFloat(@parent.styleSafe('height'))+4+'px'
				left: '0px'
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



	checkmark: DOM.template ['div', {
		ref: 'checkmark'
		style:
			position: 'relative'
			zIndex: 4
			display: 'none'
			width: '38px'
			height: '100%'
			paddingTop: ()-> parseFloat(@parent.styleSafe('height'))/2 - 13
			paddingRight: '12px'
			verticalAlign: 'top'
			boxSizing: 'border-box'
			$filled:
				display: 'inline-block'
	}
		['div', {
			style:
				width: '20px'
				height: '20px'
				borderRadius: '50%'
				backgroundColor: 'white'
				borderWidth: '3px'
				borderStyle: 'solid'
				borderColor: COLORS.green
				transform: 'scale(0.8)'
				# transformOrigin: '100% 0'
				$showError:
					borderColor: COLORS.red
		}
			['div', { # Mask 1
				style:
					position: 'absolute'
					top: '-4px'
					left: '-10px'
					width: '15px'
					height: '30px'
					borderRadius: '30px 0 0 30px'
					backgroundColor: ()-> @parent.raw.style.backgroundColor
					transform: 'rotate(-45deg)'
					transformOrigin: '15px 15px 0'
			}]
			
			['div', { # Mask 2
				style:
					position: 'absolute'
					top: '-5px'
					left: '8px'
					width: '15px'
					height: '30px'
					borderRadius: '0 30px 30px 0'
					backgroundColor: ()-> @parent.raw.style.backgroundColor
					transform: 'rotate(-45deg)'
					transformOrigin: '0 15px 0'
					$filled:
						animation: '4.25s ease-in checkmarkRotatePlaceholder'
						$invalid:
							animation: ''
				}]
			
			['div', { # Line wrapper
				style:
					$filled: $invalid:
						position: 'relative'
						zIndex: 2
						animation: '0.55s checkmarkAnimateError'
						transformOrigin: '50% 10px'
			}
				['div', { # Line 1 (short)
					style:
						position: 'absolute'
						zIndex: 2
						top: '10px'
						left: '3px'
						display: 'block'
						width: '8px'
						height: '3px'
						borderRadius: '2px'
						backgroundColor: COLORS.green
						transform: 'rotate(45deg)'
						$filled:
							animation: '0.75s checkmarkAnimateSuccessTip'
						
						$invalid:
							backgroundColor: COLORS.red
							left: '4px'
							top: '8px'
							width: '12px'
							$filled:
								animation: ''
				}]

				['div', { # Line 2 (long)
					style:
						position: 'absolute'
						zIndex: 2
						top: '8px'
						right: '2px'
						display: 'block'
						width: '12px'
						height: '3px'
						borderRadius: '2px'
						backgroundColor: COLORS.green
						transform: 'rotate(-45deg)'
						$filled:
							animation: '0.75s checkmarkAnimateSuccessLong'
						
						$invalid:
							backgroundColor: COLORS.red
							top: '8px'
							left: '4px'
							right: 'auto'
							$filled:
								animation: ''
				}]
			]
			
			['div', { # Placeholder
				style:
					position: 'absolute'
					zIndex: 2
					top: '-4px'
					left: '-3px'
					width: '20px'
					height: '20px'
					borderRadius: '50%'
					borderWidth: '3px'
					borderStyle: 'solid'
					borderColor: helpers.hexToRGBA(COLORS.green, 0.4)
					$invalid:
						borderColor: helpers.hexToRGBA(COLORS.red, 0.4)
			}]
			
			['div', { # Patch
				style:
					position: 'absolute'
					zIndex: 1
					top: '-2px'
					left: '6px'
					width: '4px'
					height: '28px'
					backgroundColor: ()-> @parent.raw.style.backgroundColor
					transform: 'rotate(-45deg)'
			}]
		]
	]














