helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom'
SimplyBind = import '@danielkalen/simplybind'
import template,* as templates from './template'
import * as defaults from './defaults'

class RepeaterField extends import '../'
	template: template
	templates: templates
	defaults: defaults

	constructor: ()->
		super
		@_value ?= []
		@settings.fields = [@settings.fields] if @settings.singleMode
		@settings.value ?= []

		if @settings.minItems and @settings.value.length < @settings.minItems
			diff = @settings.minItems - @settings.value.length
			@settings.value.push(null) while --diff
		
		@_createElements()
		@_attachBindings()
		@_constructorEnd()


	_getValue: ()->
		values = []
		for field,index in @_value
			values[index] = field.value
		return values

	_setValue: (newValue)-> if IS.array(newValue)
		for index,value in newValue
			if @_value[index]?
				@_value[index].value = newValue
			else
				@addItem(value)
				
		return newValue


	_createElements: ()->
		forceOpts = {relatedInstance:@}
		@el = @template.spawn(@settings.templates.default, forceOpts)
		@el.state "#{if @settings.inline then 'inline' else 'block'}Style", on
		@el.raw._quickField = @el.childf.innerwrap.raw._quickField = @
		return


	_attachBindings: ()->
		@_attachBindings_elState()
		@_attachBindings_display()
		@_attachBindings_stateTriggers()
		@_attachBindings_value()
		return


	_attachBindings_elState: ()->
		SimplyBind('visible').of(@state).to 	(visible)=> @el.state 'visible', visible
		SimplyBind('hovered').of(@state).to 	(hovered)=> @el.state 'hover', hovered
		SimplyBind('focused').of(@state).to 	(focused)=> @el.state 'focus', focused
		SimplyBind('disabled').of(@state).to 	(disabled)=> @el.state 'disabled', disabled
		SimplyBind('showLabel').of(@state).to 	(showLabel)=> @el.state 'showLabel', showLabel
		SimplyBind('showError').of(@state).to 	(showError)=> @el.state 'showError', showError
		SimplyBind('showHelp').of(@state).to 	(showHelp)=> @el.state 'showHelp', showHelp
		SimplyBind('collapsed').of(@state).to 	(collapsed)=> @el.state 'collapsed', collapsed
		SimplyBind('valid').of(@state).to (valid)=>
			@el.state 'valid', valid
			@el.state 'invalid', !valid


	_attachBindings_display: ()->
		SimplyBind('width').of(@state)
			.to (width)=> @el.style('width',width).state 'definedWidth', width isnt 'auto'
			.transform (width)=> if @state.isMobile then (@settings.mobileWidth or width) else width
			.updateOn('isMobile').of(@state)
		
		SimplyBind('showError', updateOnBind:false).of(@state)
			.to (showError)=>
				field.state.showError = showError for field in @fieldsArray
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


	_attachBindings_stateTriggers: ()->
		if @settings.collapsable
			toggleCollapse = ()=>
				@state.collapsed = !@state.collapsed
				@emit('collapsed', @state.collapsed)
			
			SimplyBind('event:click').of(@el.child.collapse).to(toggleCollapse)
			SimplyBind('event:click').of(@el.child.label).to(toggleCollapse)

		return


	_attachBindings_value: ()->
		for fieldName,field of @fields
			SimplyBind('_value').of(field)
				.to(fieldName).of(@_value)
			
			SimplyBind('_value', updateOnBind:false).of(field)
				.to (value)=>
					@state.interacted = true if value
					@state.valid = @validate(null, true)
					@emit('input', @_value)
		
		return


	_validate: (providedValue, testUnrequired)->
		someInvalid = false
		
		for group in @_value
			isValid = group.validate(providedValue[group.name], testUnrequired)
			return false if not isValid

		return true


	focus: ()->
		for field in @_value when field.focus
			return field.focus()
		return

	blur: ()->
		for field in @_value when field.blur
			return field.blur()
		return

	addItem: (item, noAppend)->
		return if @settings.maxItems and @_value.length is @settings.maxItems
		QuickField = import '../../'
		settings = extend {fields:@settings.fields, margin:"0 0 #{@settings.fieldMargin}px 0"}, @settings.groupOptions

		if @settings.singleMode
			settings.getter = (fields)-> fields[Object.keys(fields)[0]]
		
		@_value.push item = QuickField(settings)
		
		item.insertBefore(@el.child.addAction) unless noAppend
		return item















module.exports = RepeaterField