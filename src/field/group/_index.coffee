helpers = import '../../helpers'
IS = import '../../checks'
DOM = import 'quickdom'
SimplyBind = import '@danielkalen/simplybind'
extend = import 'smart-extend'
import template,* as templates from './template'
import * as defaults from './defaults'

class GroupField extends import '../'
	template: template
	templates: templates
	defaults: defaults
	shallowSettings: ['fields']

	constructor: ()->
		super
		@_calcFocusState = @_calcFocusState.bind(@)
		@_calcBlurState = @_calcBlurState.bind(@)
		@_emitSubmit = @emit.bind(@, 'submit')
		@state.collapsed = @settings.startCollapsed and @settings.collapsable
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

	_recalcDisplay: ()->
		for field in @fieldsArray
			field._recalcDisplay() if field._recalcDisplay
		return

	_createElements: ()->
		forceOpts = {relatedInstance:@}
		margin = "0 0 #{@settings.fieldMargin}px 0"
		@el = @template.spawn(@settings.templates.default, forceOpts)

		if @settings.collapsable
			@addAction('collapse', @templates.collapseIcons)

		if IS.array(@settings.fields)
			fields = Object.create(null)
			for field in @settings.fields
				throw new Error("field #{@name or @ID}:group fields provided in array format must have a name") if not field.name
				fields[field.name] = field
			
			@settings.fields = fields

		for name,field of @settings.fields
			config = extend {margin, fieldInstances:@fields}, field, {ID:name}
			@fieldsArray.push @fields[name] = @builder(config).appendTo(@el.child.innerwrap)
			@fields[name]
				.on 'focus', @_calcFocusState
				.on 'blur', @_calcBlurState
				.on 'submit', @_emitSubmit
				.el.style('verticalAlign',@settings.fieldAlign).after ' '

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
			.transform @_formatWidth.bind(@)
			.updateOn('isMobile').of(@state)
		
		SimplyBind('showError', updateOnBind:false).of(@state).to (showError)=>
			field.state.showError = showError for field in @fieldsArray

		for field in @fieldsArray
			SimplyBind('disabled').of(@state).to('disabled').of(field.state)

		return


	_attachBindings_stateTriggers: ()->
		if @settings.collapsable
			toggleCollapse = ()=>
				@state.collapsed = !@state.collapsed
				@emit('collapsed', @state.collapsed)
			
			SimplyBind('event:click').of(@el.child.collapse).to(toggleCollapse)
			SimplyBind('event:click').of(@el.child.label).to(toggleCollapse)
			SimplyBind('collapsed').of(@state)
				.once.to ()=> @_recalcDisplay()
				.condition (collapsed)-> not collapsed

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


	_calcFocusState: ()->
		@state.focused = @fieldsArray.some (field)-> field.state.focused

	_calcBlurState: ()->
		setTimeout @_calcFocusState


	focus: ()->
		@state.collapsed = false
		for field in @fieldsArray when field.focus
			return field.focus()
		return

	blur: ()->
		for field in @fieldsArray when field.blur
			return field.blur()
		return

	addAction: (name, icons, callback, prepend)->
		icons = [icons] if icons and not IS.array(icons)
		action = @templates.action.spawn(@settings.templates.action, {relatedInstance:@})
		action.ref = action.options.ref = name
		action.child.icon.append(icon) for icon in icons
		@el.child.actions[if prepend then 'prepend' else 'append'](action)
		
		SimplyBind('event:click').of(action).to(callback) if callback
		
		return action














module.exports = GroupField