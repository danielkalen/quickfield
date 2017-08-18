DOM = import 'quickdom'
COLORS = import '../../constants/colors'
helpers = import '../../helpers'

export default DOM.template(
	['div'
		ref: 'field'
		style:
			position: 'relative'
			verticalAlign: 'top'
			display: 'none'
			boxSizing: 'border-box'
			fontFamily: (field)-> field.settings.fontFamily
			textAlign: 'left'
			$visible:
				display: 'inline-block'
			$showError:
				animation: '0.2s fieldErrorShake'

		['div'
			ref: 'label'
			styleAfterInsert: true
			style:
				position: 'absolute'
				zIndex: 1
				top: (field)-> @styleParsed('fontSize', true) * 0.7
				left: (field)-> (field.el.child.icon?.styleParsed('width') or 0) + helpers.shorthandSideValue(field.settings.padding, 'left')
				padding: (field)-> "0 #{field.settings.inputPadding}px"
				fontFamily: 'inherit'
				fontSize: (field)-> field.settings.labelSize or field.settings.fontSize * (11/14)
				fontWeight: 600
				lineHeight: 1
				color: COLORS.grey
				opacity: 0
				transition: 'opacity 0.2s, color 0.2s'
				whiteSpace: 'nowrap'
				userSelect: 'none'
				cursor: 'default'
				pointerEvents: 'none'
				$filled: $showLabel:
					opacity: 1
				$focus:
					color: COLORS.orange
				$showError:
					color: COLORS.red
		]

		['div'
			ref: 'innerwrap'
			style:
				position: 'relative'
				height: (field)-> field.settings.height
				backgroundColor: 'white'
				borderWidth: (field)-> field.settings.border
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

			['input'
				ref: 'input'
				type: 'text'
				styleAfterInsert: true
				style:
					position: 'relative'
					zIndex: 3
					display: 'inline-block'
					verticalAlign: 'top'
					width: (field)-> if not field.settings.autoWidth
						subtract = ''
						subtract += " -#{field.el.child.icon.raw.styleParsed('width', true)}px" if field.el.child.icon
						subtract += " -#{field.el.child[field.settings.inputSibling].styleParsed('width', true)}px" if field.el.child[field.settings.inputSibling]
						return "calc(100% + (#{subtract or '0px'}))"
					height: ()-> @parent.styleSafe('height', true) or @parent.styleSafe('height')
					padding: (field)->
						@padding ?= Math.max 0, helpers.calcPadding(field.settings.height, 14)-3
						return "#{@padding}px #{field.settings.inputPadding}px"
				
					margin: '0'
					backgroundColor: 'transparent'
					appearance: 'none'
					border: 'none'
					outline: 'none'
					fontFamily: 'inherit'
					fontSize: (field)-> field.settings.fontSize
					color: COLORS.black
					boxSizing: 'border-box'
					boxShadow: 'none'
					whiteSpace: 'nowrap'
					backgroundClip: 'content-box' # semi-fix for yellow autofill background
					transform: 'translateY(0)'
					transition: 'transform 0.2s, -webkit-transform 0.2s'
					$disabled:
						cursor: 'not-allowed'
					$showCheckmark:
						padding: (field)-> "0 44px 0 #{field.settings.inputPadding}px"
					$filled: $showLabel:
						transform: (field)->
							return @translation if @translation? or not (label=field.el.child.label) or label.styleSafe('position',1) isnt 'absolute'
							totalHeight = @parent.styleParsed('height',1)
							workableHeight = totalHeight - (label.styleParsed('fontSize',1) + label.styleParsed('top',1)*2)
							translation = Math.max 0, Math.floor (totalHeight-workableHeight)/4
							return "translateY(#{translation}px)"
					
			]

			['div'
				ref: 'placeholder'
				styleAfterInsert: true
				style:
					position: 'absolute'
					zIndex: 2
					top: '0px'
					left: (field)-> field.el.child.icon?.styleSafe('width') or 0
					fontFamily: (field)-> field.el.child.input.styleSafe('fontFamily',1)
					fontSize: (field)-> field.el.child.input.styleSafe('fontSize',1)
					padding: (field)->
						horiz = field.el.child.input.styleParsed('paddingLeft',1) or field.el.child.input.styleParsed('paddingLeft')
						verti = field.el.child.input.styleParsed('paddingTop',1) or field.el.child.input.styleParsed('paddingTop')
						return "#{verti+3}px #{horiz}px"

					color: COLORS.black
					opacity: 0.5
					pointerEvents: 'none'
					userSelect: 'none'
					whiteSpace: 'nowrap'
					transform: 'translateY(0)'
					transition: 'transform 0.2s, -webkit-transform 0.2s'
					$filled:
						visibility: 'hidden'
						$showLabel:
							transform: (field)-> field.el.child.input.raw.style.transform
			]
		]
		
		['div'
			ref: 'help'
			styleAfterInsert: true
			style:
				position: 'absolute'
				bottom: ()-> (@styleParsed('fontSize',1)+10) * -1
				left: (field)-> helpers.shorthandSideValue(field.settings.padding, 'left')
				fontFamily: 'inherit'
				fontSize: '11px'
				color: COLORS.grey
				display: 'none'
				$showError:
					color: COLORS.red
				$showHelp:
					display: 'block'
		]
	]
)


exports.checkmark = DOM.template(
	['div'
		ref: 'checkmark'
		styleAfterInsert: true
		style:
			position: 'relative'
			zIndex: 4
			display: 'none'
			width: 38
			height: '100%'
			paddingTop: ()-> @parent.styleParsed('height',1)/2 - 13
			paddingRight: 12
			verticalAlign: 'top'
			boxSizing: 'border-box'
			$filled:
				display: 'inline-block'

		['div'
			ref: 'checkmark_innerwrap'
			style:
				width: '20px'
				height: '20px'
				borderRadius: '50%'
				borderWidth: '3px'
				borderStyle: 'solid'
				borderColor: COLORS.green
				transform: 'scale(0.8)'
				# transformOrigin: '100% 0'
				$showError:
					borderColor: COLORS.red

			['div'
				ref: 'checkmark_mask1'
				styleAfterInsert: true
				style:
					position: 'absolute'
					top: '-4px'
					left: '-10px'
					width: '15px'
					height: '30px'
					borderRadius: '30px 0 0 30px'
					backgroundColor: (field)-> helpers.defaultColor field.els.innerwrap.styleSafe('backgroundColor',1), 'white'
					transform: 'rotate(-45deg)'
					transformOrigin: '15px 15px 0'
			]
			
			['div'
				ref: 'checkmark_mask2'
				styleAfterInsert: true
				style:
					position: 'absolute'
					top: '-5px'
					left: '8px'
					width: '15px'
					height: '30px'
					borderRadius: '0 30px 30px 0'
					backgroundColor: (field)-> helpers.defaultColor field.els.innerwrap.styleSafe('backgroundColor',1), 'white'
					transform: 'rotate(-45deg)'
					transformOrigin: '0 15px 0'
					$filled:
						animation: '4.25s ease-in checkmarkRotatePlaceholder'
						$invalid:
							animation: ''
			]
			
			['div'
				ref: 'checkmark_lineWrapper'
				style:
					$filled: $invalid:
						position: 'relative'
						zIndex: 2
						animation: '0.55s checkmarkAnimateError'
						transformOrigin: '50% 10px'

				['div'
					ref: 'checkmark_lineShort'
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
				]

				['div'
					ref: 'checkmark_lineLong'
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
				]
			]
			
			['div'
				ref: 'checkmark_placeholder'
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
			]
			
			['div'
				ref: 'checkmark_patch'
				styleAfterInsert: true
				style:
					position: 'absolute'
					zIndex: 1
					top: '-2px'
					left: '6px'
					width: '4px'
					height: '28px'
					backgroundColor: (field)-> helpers.defaultColor field.els.innerwrap.styleSafe('backgroundColor',1), 'white'
					transform: 'rotate(-45deg)'
			]
		]
	]
)













