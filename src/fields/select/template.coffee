import DOM from 'quickdom'
import COLORS from '../../constants/colors'
import {caretDown} from '../../svg'
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
				# overflow: 'scroll'
				overflow: 'hidden'
		]

		'caret': ['div'
			ref: 'caret'
			styleAfterInsert: true
			style:
				position: 'relative'
				zIndex: 3
				top: (field)-> (@parent.styleParsed 'height', true)/2 - @styleParsed('height')/2
				display: 'inline-block'
				width: 17
				height: 17
				paddingRight: (field)-> field.settings.inputPadding
				verticalAlign: 'top'
				outline: 'none'
				pointerEvents: 'none'
				fill: COLORS.grey

			caretDown
		]

		'nativeInput': ['select'
			ref: 'nativeInput'
			style:
				position: 'absolute'
				zIndex: 4
				left: 0
				top: 0
				display: 'none'
				width: '100%'
				height: '100%'
				opacity: 0
				$displayNative:
					display: 'block'
			
			methods:
				activate: ()->
					@setupChoices()

					@state 'displayNative', on
					@on 'change', ()=>
						@related.value = @raw.value
				
				setupChoices: ()->
					currentValue = @related.value
					options = @related.settings.choices
						.map ({label, value})->
							label ?= value
							value ?= label
							selected = if value is currentValue then 'selected' else ''
							return "<option #{selected} value=\"#{value}\">#{label}</option>"
						.join '\n'
					
					@html = """
						<option></option>
						#{options}
					"""
		]







