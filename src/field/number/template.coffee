DOM = import 'quickdom'
SVG = import '../../svg'
COLORS = import '../../constants/colors'
helpers = import '../../helpers'
import textFieldTemplate from '../text/template'

export default textFieldTemplate.extend()


export stepButton = DOM.template(
	['div'
		attrs:
			tabindex: -1
		style:
			display: 'inline-block'
			width: '100%'
			height: '17px'
			boxSizing: 'border-box'
			verticalAlign: 'top'
			outline: 'none'
			cursor: 'pointer'
			fill: COLORS.grey
			$active:
				fill: COLORS.grey_dark
	]
)


export buttons = DOM.template(
	['div'
		# styleAfterInsert: true
		style:
			position: 'relative'
			zIndex: 3
			boxSizing: 'border-box'
			# top: ()-> @parent.height/2 - @styleParsed('height')/2
			top: '50%'
			transform: 'translateY(-50%)'
			display: 'inline-block'
			width: '29px'
			paddingRight: '12px'
			outline: 'none'

		stepButton.extend
			children: [SVG.caretUp]
			options: ref: 'stepUp'
		
		stepButton.extend
			children: [SVG.caretDown]
			options: ref: 'stepDown'
	]
)










