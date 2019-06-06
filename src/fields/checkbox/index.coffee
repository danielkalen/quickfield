import DOM from 'quickdom'
import SimplyBind from '@danielkalen/simplybind'
import Field from '../../field'
import {inheritProto} from '../../helpers'
import template,* as templates from './template'
import defaults from './defaults'
import ChoiceField from '../choice'


class CheckboxField extends Field
	template: template
	templates: templates
	defaults: defaults
	
	constructor: ()->
		super(arguments...)
		@_value = !!@_value
		@settings.size = parseFloat(@settings.size) or defaults.size
		@settings.display = defaults.display if @settings.display isnt 'block' and @settings.display isnt 'inline'
		
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

		@el.child.innerwrap.raw._quickField = @
		return


	_attachBindings: ()->
		@_attachBindings_elState()
		@_attachBindings_stateTriggers()
		@_attachBindings_display()
		@_attachBindings_value()

		setTimeout ()=>
			SimplyBind('label').of(@state)
				.to('html').of(@el.child.label)
		
		return
	

	_attachBindings_value: ()->
		SimplyBind('_value').of(@)
			.to (value)=> @el.state 'toggled', value
		
		SimplyBind('_value', updateOnBind:false).of(@)
			.to (value)=> @emit('input', value)

		SimplyBind("event:click").of(@el.child.input)
			.to ()=> @value = !@_value

		if @settings.labelClicks
			SimplyBind("event:click").of(@el.child.label)
				.to ()=> @value = !@_value

		return


	_validate: (providedValue)->
		if @settings.validWhenTrue
			return false if not providedValue
		
		return true


inheritProto(CheckboxField, ChoiceField, [
	'_attachBindings_elState'
	'_attachBindings_stateTriggers'
	'_attachBindings_display'
])

export default CheckboxField