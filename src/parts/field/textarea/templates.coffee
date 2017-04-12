DOM = import 'quickdom/src'
SVG = import '../../svg'
TextField = import '../text'
COLORS = import '../../constants/colors'

module.exports =
	field: TextField._templates.field.extend()
		# children: [
		# 	null # label
		# 	{children:[ # innerwrap
		# 		{type: 'div', options: # input
		# 			type: null
		# 			props:
		# 				tabIndex: 0
		# 			style:
		# 				lineHeight: ()-> @parent.styleSafe('height')
		# 				cursor: 'default'
		# 				userSelect: 'none'
		# 				overflow: 'scroll'
		# 				width: (field)-> if not field.settings.autoWidth
		# 					subtract = ''
		# 					subtract += " -#{field.el.child.icon.raw.styleSafe('width', true)}" if field.el.child.icon
		# 					subtract += " -#{field.el.child.caret.styleSafe('width', true)}" if field.el.child.caret
		# 					return "calc(100% + (#{subtract or '0px'}))"
		# 		}
		# 		null # placeholder
				
		# 		['div', {
		# 			ref:'caret'
		# 			style:
		# 				position: 'relative'
		# 				zIndex: 3
		# 				top: (field)-> field.el.child.input.height/2 - 17/2
		# 				display: 'inline-block'
		# 				# width: '17px'
		# 				width: '29px'
		# 				height: '17px'
		# 				paddingRight: '12px'
		# 				boxSizing: 'border-box'
		# 				verticalAlign: 'top'
		# 				outline: 'none'
		# 				pointerEvents: 'none'
		# 				fill: COLORS.grey
		# 		}, SVG.caretDown]
		# 	]}
		# ]











