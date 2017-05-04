extend = import 'smart-extend'
SimplyBind = import '@danielkalen/simplybind/debug'
TrueFalseField = import '../truefalse'

ToggleField = Object.create(null)
ToggleField._templates = import ./templates
ToggleField._defaults = import ./defaults
extend.keys([
	'_attachBindings_elState'
	'_attachBindings_stateTriggers'
	'_attachBindings_display'
])(ToggleField, TrueFalseField)

ToggleField._construct = ()->
	@_value = !!@_value
	@settings.size = parseFloat(@settings.size) or ToggleField._defaults.size
	@settings.style = ToggleField._defaults.style if @settings.style isnt 'centered' and @settings.style isnt 'aligned'
	return

ToggleField._getValue = ()->
	return @_value


ToggleField._setValue = (newValue)->
	@_value = !!newValue


ToggleField._createElements = ()->
	forceOpts = {relatedInstance:@, styleAfterInsert:true}
	@el = @_templates.field.spawn(@settings.templates.field, forceOpts)

	@el
		.state 'alignedStyle', @settings.style is 'aligned'
		.child.innerwrap.raw._quickField = @
	return


ToggleField._attachBindings = ()->
	@_attachBindings_elState()
	@_attachBindings_stateTriggers()
	@_attachBindings_display()
	@_attachBindings_value()
	return


ToggleField._attachBindings_value = ()->
	SimplyBind('_value').of(@)
		.to (value)=> @el.state 'toggled', value
	
	SimplyBind('_value', updateOnBind:false).of(@)
		.to ()=> @emit('input')
		.and.to ()=> @value = @_value

	SimplyBind('event:mouseup touchend').of(@el.child.input)
		.to ()=> @_value = !@_value

	return



ToggleField.validate = (providedValue=@_value)->
	if @settings.validWhenTrue
		return !!providedValue
	else
		return true

















module.exports = ToggleField