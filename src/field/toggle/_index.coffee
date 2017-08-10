extend = import 'smart-extend'
SimplyBind = import '@danielkalen/simplybind'
TrueFalseField = import '../truefalse'
import template,* as templates from './template'
import * as defaults from './defaults'

class ToggleField extends import '../'
	template: template
	templates: templates
	defaults: defaults

	constructor: ()->
		super
		@_value = !!@_value
		@settings.size = parseFloat(@settings.size) or defaults.size
		@settings.style = defaults.style if @settings.style isnt 'centered' and @settings.style isnt 'aligned'
		@_createElements()
		@_attachBindings()
		@_constructorEnd()

	_getValue: ()->
		return @_value


	_setValue: (newValue)->
		@_value = !!newValue


	_createElements: ()->
		forceOpts = {relatedInstance:@}
		@el = @template.spawn(@settings.templates.default, forceOpts)

		@el
			.state 'alignedStyle', @settings.style is 'aligned'
			.child.innerwrap.raw._quickField = @
		return


	_attachBindings: ()->
		@_attachBindings_elState()
		@_attachBindings_stateTriggers()
		@_attachBindings_display()
		@_attachBindings_value()
		return


	_attachBindings_value: ()->
		SimplyBind('_value').of(@)
			.to (value)=> @el.state 'toggled', value
		
		SimplyBind('_value', updateOnBind:false).of(@)
			.to (value)=> @emit('input', value)

		SimplyBind('event:mouseup touchend').of(@el.child.input)
			.to ()=> @value = !@_value

		return



	_validate: (providedValue)->
		if @settings.validWhenTrue
			return false if not providedValue
		
		return true





extend.keys([
	'_attachBindings_elState'
	'_attachBindings_stateTriggers'
	'_attachBindings_display'
])(ToggleField::, TrueFalseField::)












module.exports = ToggleField