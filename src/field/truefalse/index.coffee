extend = import 'smart-extend'
SimplyBind = import '@danielkalen/simplybind'
ChoiceField = import '../choice'
import template,* as templates from './template'
import * as defaults from './defaults'

class TrueFalseField extends import '../'
	template: template
	templates: templates
	defaults: defaults

	constructor: ()->	
		super
		@lastSelected = null
		@visibleChoicesCount = 2
		@choices = @settings.choices
		@choices[0].label = @settings.choiceLabels[0]
		@choices[1].label = @settings.choiceLabels[1]
		@settings.perGroup = 2
		@_createElements()
		@_attachBindings()
		@_constructorEnd()

	_getValue: ()->
		if @_value is null
			return null
		else
			if @_value.index is 0 then true else false

	_setValue: (newValue)->
		if newValue is null
			@_value = null
			@lastSelected?.selected = false
			return

		if typeof newValue is 'string'
			newValue = newValue.toLowerCase()
			newValue = false if newValue is 'false'
			
		@lastSelected = if newValue then @choices[0] else @choices[1]


	validate: (providedValue=@_value)->
		providedValue = @findChoice(providedValue) if typeof providedValue is 'string'
		
		switch
			when @settings.validWhenIsChoice
				if providedValue
					return @settings.validWhenIsChoice is providedValue.value
				else
					return false

			when @settings.validWhenSelected
				return !!providedValue

			when @settings.validWhenTrue
				return providedValue?.index is 0

			else return if @settings.required then !!providedValue else true












extend.keys([
	'_createElements'
	'_attachBindings'
	'_attachBindings_elState'
	'_attachBindings_stateTriggers'
	'_attachBindings_display'
	'_attachBindings_value'
	'_attachBindings_choices'
])(TrueFalseField::, ChoiceField::)





module.exports = TrueFalseField