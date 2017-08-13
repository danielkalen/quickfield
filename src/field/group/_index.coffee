helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom'
SimplyBind = import '@danielkalen/simplybind'
import template,* as templates from './template'
import * as defaults from './defaults'

class GroupField extends import '../'
	template: template
	templates: templates
	defaults: defaults


	constructor: ()->
		super
		@state.collapsed = @settings.startCollapsed
		@_value ?= Object.create(null)
		@fields = Object.create(null)
		@fieldsArray = []
		
		@_createElements()
		@_attachBindings()
		@_constructorEnd()


	_getValue: ()->
		values = Object.create(null)
		for name,field of @fields
			values[name] = field.value
		return values

	_setValue: (newValue)-> if IS.object(newValue)
		for name,value of newValue
			@fields[name].value = value if @fields[name]
		return newValue


	_createElements: ()->
		forceOpts = {relatedInstance:@}
		margin = "0 0 #{@settings.fieldMargin}px 0"
		@el = @template.spawn(@settings.templates.defaults, forceOpts)

		if IS.array(@settings.fields)
			fields = Object.create(null)
			for field in @settings.fields
				throw new Error("field #{@name or @ID}:group fields provided in array format must have a name") if not field.name
				fields[field.name] = field
			
			@settings.fields = fields

		QuickField = import '../../'
		for name,field of @settings.fields
			field.margin ?= margin
			field.fieldInstances ||= @fields
			field.ID = name
			@fieldsArray.push @fields[name] = QuickField(field).appendTo(@el.child.innerwrap)
			@fields[name].el.style('verticalAlign','middle').after ' '

		@el.child.innerwrap.append DOM.div(style:{display:'inline-block', width:'100%'})
		@el.state 'collapsable', @settings.collapsable
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
		
		for field in @fieldsArray
			isValid = field.validate(providedValue[field.name], testUnrequired)
			return false if not isValid

		return true


	focus: ()->
		@state.collapsed = false
		for field in @fieldsArray when field.focus
			return field.focus()
		return

	blur: ()->
		for field in @fieldsArray when field.blur
			return field.blur()
		return
















module.exports = GroupField