import DOM from 'quickdom'
import {caretUp, caretDown} from '../../svg'
import COLORS from '../../constants/colors'
import textFieldTemplate from '../text/template'

export default textFieldTemplate.extend()


export stepButton = DOM.template(
	['div'
		stateTriggers:
			'active': {on:'mousedown', off:'mouseup', bubbles:false}
		attrs:
			tabindex: -1
		style:
			display: 'inline-block'
			width: '100%'
			height: 17
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
		ref: 'buttons'
		style:
			position: 'relative'
			zIndex: 3
			top: '50%'
			transform: 'translateY(-50%)'
			display: 'inline-block'
			width: 17
			paddingRight: (field)-> field.settings.inputPadding
			outline: 'none'

		stepButton.extend
			children: [caretUp]
			options: ref: 'stepUp'
		
		stepButton.extend
			children: [caretDown]
			options: ref: 'stepDown'
	]
)










