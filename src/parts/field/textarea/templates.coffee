DOM = import 'quickdom'
SVG = import '../../svg'
TextField = import '../text'
COLORS = import '../../constants/colors'
helpers = import '../../helpers'

module.exports =
	field: TextField._templates.field.extend
		options:
			style:
				verticalAlign: 'top'
		
		children:
			'innerwrap':
				options:
					style:
						overflow: 'hidden'
						height: (field)-> field.settings.minHeight or 46
						width: (field)-> '100%' unless field.settings.autoWidth

			'label':
				options:
					style:
						left: (field)-> helpers.shorthandSideValue(field.settings.padding, 'left')
						top: '7.6px'

			'input':
				type: 'textarea'
				options:
					type: null
					styleAfterInsert: true
					style:
						resize: 'none'
						whiteSpace: 'normal'
						width: '100%'
						height: ()-> "calc(100% - #{@styleSafe 'marginTop'} - #{@styleSafe 'marginBottom'})"
						margin: '0'
						marginTop: '15px'
						marginBottom: '12px'
						padding: '0 12px'
						$filled: $showLabel:
							transform: (field)-> if (label=field.el.child.label) and label.style('position') is 'absolute'
								translation = (label.height + label.styleParsed('top')) - @styleParsed('marginTop') + 1
								return "translateY(#{translation}px)"

			'placeholder':
				options:
					styleAfterInsert: true
					style:
						left: 0
						padding: (field)->
							horiz = field.el.child.input.styleSafe('paddingLeft')
							verti = field.el.child.input.styleSafe('marginTop')
							# return "#{verti}px #{horiz}px"
							return "#{verti} #{horiz}"











