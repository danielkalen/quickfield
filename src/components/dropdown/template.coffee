import DOM from 'quickdom'
import {hexToRGBA} from '../../helpers'
import {checkmark, caretUp, caretDown} from '../../svg'

export default DOM.template(
	['div'
		ref: 'dropdown'
		styleAfterInsert: true
		style:
			position: 'absolute'
			zIndex: 10
			overflow: 'hidden'
			top: (dropdown)-> if dropdown.field.type is 'text' then @parent.raw.style.height else '-7px'
			left: ()-> if @parent.rect.left - 5 < 0 then 0 else -5
			display: 'none'
			# backgroundColor: hexToRGBA('f6f6f6', 0.9)
			backgroundColor: '#f6f6f6'
			boxShadow: "0px 6px 10px #{hexToRGBA('000000', 0.32)}"
			borderWidth: '1px'
			borderStyle: 'solid'
			borderColor: '#d1d1d1'
			borderRadius: '5px'
			boxSizing: 'border-box'
			padding: '4px 0'
			$isOpen: $hasVisibleChoices:
				display: 'block'
	]
)

export list = DOM.template(
	['div'
		ref: 'list'
		passStateToChildren: false
		style:
			position: 'relative'
			overflow: 'scroll'
			overflowScrolling: 'touch'
			overflowStyle: '-ms-autohiding-scrollbar'
	]
)

export choice = DOM.template(
	['div'
		style:
			display: 'none'
			fontSize: '0'
			color: '#000000'
			userSelect: 'none'
			lineHeight: '1em'
			cursor: 'pointer'
			$visible:
				display: 'block'
			$unavailable:
				display: 'none'
			$hover:
				color: '#ffffff'
				backgroundColor: '#4C96FF'

		['div' # Checkmark
			style:
				display: 'inline-block'
				verticalAlign:'top'
				width: '20px'
				# height: ()-> @parent.raw.style.height
				# lineHeight: ()-> @parent.style('height')
				# fontSize: ()-> @parent.style('height')
				lineHeight: '20px'
				fontSize: '13px'
				textAlign: 'center'
				color: 'inherit'
				stroke: 'currentColor'
				visibility: 'hidden'
				$selected:
					visibility: 'visible'

			checkmark
		]
		
		['div' # Text
			styleAfterInsert: true
			style:
				display: 'inline-block'
				overflow: 'hidden'
				textOverflow: 'ellipsis'
				whiteSpace: 'nowrap'
				wordWrap: 'normal'
				maxWidth: ()-> "calc(100% - #{@prev.styleSafe 'width', true})"
				paddingRight: '10px'
				lineHeight: '20px'
				fontSize: '11px'
				fontFamily: (dropdown)-> dropdown.settings.fontFamily
				color: 'inherit'
				boxSizing: 'border-box'
		]
	]
)

export scrollIndicatorUp = DOM.template(
	['div'
		ref: 'scrollIndicatorUp'
		style:
			position: 'absolute'
			top: 0
			left: 0
			display: 'none'
			width: '100%'
			height: '20px'
			backgroundColor: '#f6f6f6'
			color: '#000000'
			textAlign: 'center'
			$visible:
				display: 'block'

		['div'
			style:
				position: 'absolute'
				top: '50%'
				left: 0
				right: 0
				width: '15px'
				height: '15px'
				display: 'block'
				margin: '0 auto'
				transform: 'translateY(-50%)'
	
			caretUp
		]
	]
)

export scrollIndicatorDown = DOM.template(
	['div'
		ref: 'scrollIndicatorDown'
		style:
			position: 'absolute'
			bottom: 0
			left: 0
			display: 'none'
			width: '100%'
			height: '20px'
			backgroundColor: '#f6f6f6'
			color: '#000000'
			textAlign: 'center'
			$visible:
				display: 'block'

		['div'
			style:
				position: 'absolute'
				top: '50%'
				left: 0
				right: 0
				width: '15px'
				height: '15px'
				display: 'block'
				margin: '0 auto'
				transform: 'translateY(-50%)'

			caretDown
		]
	]
)

export help = DOM.template(
	['div'
		ref: 'help'
		style:
			display: 'none'
			borderTop: '2px solid rgba(0,0,0,0.05)'
			padding: '4px 12px 1px'
			color: 'rgba(0,0,0,0.5)'
			fontWeight: '500'
			fontSize: '11px'
			userSelect: 'none'
			$showHelp:
				display: 'block'
	]
)


