DOM = import 'quickdom/src'
SVG = import '../../svg'
TextField = import '../text'

module.exports =
	field: TextField::_templates.field.extend
		children: [
			null # label
			{children:[ # innerwrap
				{type: 'div', options: # input
					type: null
					props:
						tabIndex: 0
					style:
						userSelect: 'none'
						overflow: 'scroll'
						width: (field)-> if not field.settings.autoWidth
							subtract = ''
							subtract += " -#{field.el.child.icon.raw.styleSafe('width', true)}" if field.el.child.icon
							subtract += " -#{field.el.child.caret.styleSafe('width', true)}" if field.el.child.caret
							return "calc(100% + (#{subtract or '0px'}))"
				}
				null # placeholder
				
				['div', {
					ref:'caret'
					style:
						position: 'relative'
						zIndex: 3
						top: (field)-> field.el.child.input.height/2 - 17/2
						display: 'inline-block'
						# width: '17px'
						width: '29px'
						height: '17px'
						paddingRight: '12px'
						boxSizing: 'border-box'
						verticalAlign: 'top'
						outline: 'none'
						pointerEvents: 'none'
						fill: COLOR_GREY
				}, SVG.caretDown]
			]}
		]
	# field: DOM.template ['div', {
	# 	ref: 'field'
	# 	style: extend.clone TextField::_templates.field.options.style
	# }]


	# fieldInnerwrap: DOM.template ['div', {
	# 	ref: 'fieldInnerwrap'
	# 	style: extend.clone TextField::_templates.fieldInnerwrap.options.style
	# }]


	# label: DOM.template ['div', {
	# 	ref: 'label'
	# 	style: extend.clone TextField::_templates.label.options.style
	# }]


	# input: DOM.template ['div', {
	# 	ref: 'input'
	# 	props:
	# 		tabIndex: 0
	# 	style: extend.clone TextField::_templates.input.options.style,
	# 		userSelect: 'none'
	# 		overflow: 'scroll'
	# }]


	# placeholder: DOM.template ['div', {
	# 	ref: 'placeholder'
	# 	style: extend.clone TextField::_templates.placeholder.options.style
	# }]


	# caret: DOM.template ['div', {
	# 	ref:'caret'
	# 	style:
	# 		position: 'relative'
	# 		zIndex: 3
	# 		top: (field)-> parseFloat(field.els.input.height)/2 - 17/2
	# 		display: 'inline-block'
	# 		# width: '17px'
	# 		width: '29px'
	# 		height: '17px'
	# 		paddingRight: '12px'
	# 		boxSizing: 'border-box'
	# 		verticalAlign: 'top'
	# 		outline: 'none'
	# 		pointerEvents: 'none'
	# 		fill: COLOR_GREY
	# }, SVG.caretDown]


	# help: DOM.template ['div', {
	# 	ref: 'help'
	# 	style: extend.clone TextField::_templates.help.options.style
	# }]












