DOM = import 'quickdom'
SVG = import '../../svg'
COLORS = import '../../constants/colors'
import textFieldTemplate from '../text/template'

export default textFieldTemplate.extend
	children: innerwrap: children:
		'input': ['div'
			props: tabIndex: 0
			style:
				marginTop: 3
				height: 'auto'
				cursor: 'default'
				userSelect: 'none'
				overflow: 'scroll'
		]

		'caret': ['div'
			ref: 'caret'
			styleAfterInsert: true
			style:
				position: 'relative'
				zIndex: 3
				top: (field)-> @parent.height/2 - @styleParsed('height')/2
				display: 'inline-block'
				width: '29px'
				height: '17px'
				paddingRight: '12px'
				boxSizing: 'border-box'
				verticalAlign: 'top'
				outline: 'none'
				pointerEvents: 'none'
				fill: COLORS.grey

			SVG.caretDown
		]







