extend = import 'smart-extend'
SimplyBind = import '@danielkalen/simplybind/debug'
ChoiceField = import '../choice'

TrueFalseField = Object.create(null)
TrueFalseField._templates = import ./templates
TrueFalseField._defaults = import ./defaults
extend.keys([
	'_createElements'
	'_attachBindings'
	'_attachBindings_elState'
	'_attachBindings_stateTriggers'
	'_attachBindings_display'
	'_attachBindings_value'
	'_attachBindings_choices'
])(TrueFalseField, ChoiceField)

TrueFalseField._construct = ()->
	@_value = !!@_value if @settings.defaultValue
	@lastSelected = null
	@visibleOptionsCount = 2
	@choices = @settings.choices
	@settings.perGroup = 2
	return

TrueFalseField._getValue = ()->
	if @_value is null
		return null
	else
		if @_value.index is 0 then true else false

TrueFalseField._setValue = (newValue)->
	if newValue is null
		@_value = null
		@lastSelected?.selected = false
		return

	if typeof newValue is 'string'
		newValue = newValue.toLowerCase()
		newValue = false if newValue is 'false'
		
	@lastSelected = if newValue then @choices[0] else @choices[1]


TrueFalseField.validate = (providedValue=@_value)-> switch
	when @settings.validWhenIsChoice
		if typeof providedValue is 'string'
			return @settings.validWhenIsChoice is providedValue
		else if providedValue
			return @settings.validWhenIsChoice is providedValue.value
		else
			return false

	when @settings.validWhenSelected
		return !!providedValue

	when @settings.validWhenTrue
		return providedValue?.index is 0

	else false

















module.exports = TrueFalseField