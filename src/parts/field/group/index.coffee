helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom'
SimplyBind = import '@danielkalen/simplybind'
import template,* as templates from './template'
import * as defaults from './defaults'

GroupField = Object.create(null)
GroupField.templates = templates
GroupField.defaults = defaults

GroupField._construct = ()->
	@_value = {} if not IS.objectPlain(@_value)
	@_fields = @settings.fields.map (fieldSettings)-> QuickField(fieldSettings)
	@_createElements()
	@_attachBindings()
	return

GroupField._getValue = ()->
	return @_value

GroupField._setValue = (newValue)->
	@_value = newValue if IS.string(newValue) or IS.number(newValue)


GroupField._createElements = ()->
	forceOpts = {relatedInstance:@}
	@el = @template.spawn(@settings.templates.default, forceOpts)
	field.appendTo(@el) for field in @_fields

	if @settings.collapsable
		templates.collapseAction.spawn(@settings.templates.collapseAction, forceOpts).appendTo(@el.child.actions)

	@el.state 'hasLabel', @settings.label
	@el.child.innerwrap.raw._quickField = @el.child.input.raw._quickField = @
	return


GroupField._attachBindings = ()->
	@_attachBindings_elState()
	@_attachBindings_display()
	@_attachBindings_value()
	@_attachBindings_stateTriggers()
	return


GroupField._attachBindings_elState = ()->
	SimplyBind('visible').of(@state).to 	@el.state.bind(@el, 'visible')
	SimplyBind('filled').of(@state).to 		@el.state.bind(@el, 'filled')
	SimplyBind('disabled').of(@state).to 	@el.state.bind(@el, 'disabled')
	SimplyBind('showLabel').of(@state).to 	@el.state.bind(@el, 'showLabel')
	SimplyBind('showError').of(@state).to 	@el.state.bind(@el, 'showError')
	SimplyBind('showHelp').of(@state).to 	@el.state.bind(@el, 'showHelp')
	SimplyBind('valid').of(@state).to (valid)=>
		@el.state 'valid', valid
		@el.state 'invalid', !valid
	return


GroupField._attachBindings_display = ()->
	SimplyBind('showError', updateOnBind:false).of(@state)
		.to (showError)=>
			if showError
				@state.help = @state.error if @state.error and IS.string(@state.error)
			else
				@state.help = @state.help

	SimplyBind('label').of(@state)
		.to('text').of(@el.child.label)
		.and.to('showLabel').of(@state)

	SimplyBind('help').of(@state)
		.to('html').of(@el.child.help)
		.and.to('showHelp').of(@state)

	SimplyBind('margin').of(@state).to @el.style.bind(@el, 'margin')
	SimplyBind('padding').of(@state).to @el.style.bind(@el, 'padding')
	
	return



GroupField._attachBindings_value = ()->
	SimplyBind('_value').of(@)
		.to('value').of(@el.child.input.raw).bothWays()
		.and.to('valueRaw').of(@)
			.transform (value)=> if @mask then @mask.valueRaw else value


	SimplyBind('valueRaw').of(@).to (value)=>
		@state.filled = !!value
		@state.interacted = true if value
		@state.valid = @validate()
		@emit('input', value)

	return




GroupField._attachBindings_stateTriggers = ()->
	SimplyBind('event:mouseenter').of(@el.child.input)
		.to ()=> @state.hovered = true
	
	SimplyBind('event:mouseleave').of(@el.child.input)
		.to ()=> @state.hovered = false

	SimplyBind('event:focus').of(@el.child.input)
		.to ()=> @state.focused = true; if @state.disabled then @blur()
	
	SimplyBind('event:blur').of(@el.child.input)
		.to ()=> @state.typing = @state.focused = false
	
	SimplyBind('event:input').of(@el.child.input)
		.to ()=> @state.typing = true
	
	SimplyBind('event:keydown').of(@el.child.input)
		.to ()=> @cursor.prev = @selection().end

	return







GroupField.validate = (providedValue=@_value)-> switch
	when @settings.validWhenRegex and IS.regex(@settings.validWhenRegex) then @settings.validWhenRegex.test(providedValue)
	
	when @settings.validWhenIsChoice and @settings.choices?.length
		matchingOption = @settings.choices.filter (option)-> option.value is providedValue
		return !!matchingOption.length

	when @mask then @mask.validate(providedValue)
	
	else return !!providedValue



GroupField.focus = ()->
	@_fields[0].focus()

GroupField.blur = ()->
	@_fields[0].blur()















module.exports = GroupField