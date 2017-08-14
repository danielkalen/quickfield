helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom'
SimplyBind = import '@danielkalen/simplybind'
extend = import 'smart-extend'
import template,* as templates from './template'
import * as defaults from './defaults'

class RepeaterField extends import '../'
	template: template
	templates: templates
	defaults: defaults
	shallowSettings: ['fields']

	constructor: ()->
		super
		@groupLabel = if IS.string(@settings.numbering) then @settings.numbering else 'Item'
		@labelRegex = new RegExp("^#{@groupLabel} \\d+(?:\: )?")
		@_value ?= []
		@settings._groupSettings = extend.notKeys(['inline','block']).clone(@settings.groupSettings)
		@settings.groupSettings = extend.keys(['inline','block']).clone(@settings.groupSettings)
		@settings.autoWidth = true if @settings.style is 'block'
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
		for group,index in @_value
			values[index] = group.value
		return values

	_setValue: (newValue)->
		if not IS.array(newValue)
			@addItem(newValue, false, true)
		else
			for value,index in newValue
				if @_value[index]?
					@_value[index].value = value
				else
					@addItem(value, false, true)

		return newValue


	_createElements: ()->
		forceOpts = {relatedInstance:@}
		@el = @template.spawn(@settings.templates.default, forceOpts)
		@el.state 'collapsable', @settings.collapsable
		@el.state "#{@settings.style}Style", on
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
			SimplyBind('collapsed').of(@state)
				.once.to ()=> @_recalcDisplay()
				.condition (collapsed)-> not collapsed

		return


	_attachBindings_value: ()->
		SimplyBind('array:_value').of(@, updateOnBind:false)
			.to (value, prevValue)=>
				@_recalcLabels() if value.length
				if prevValue
					@state.interacted = true
					@state.valid = @validate(null, true)

		SimplyBind('event:click').of(@el.child.addButton)
			.to ()=> @addItem()
		
		return


	_validate: (providedValue, testUnrequired)->
		someInvalid = false
		
		for group in @_value
			isValid = group.validate(providedValue[group.name], testUnrequired)
			return false if not isValid

		return true


	focus: ()->
		@_value[0]?.focus()

	blur: ()->
		for field in @_value when field.blur
			field.blur()
		return

	_recalcLabels: ()-> if @settings.numbering and @settings.style is 'block'
		for group,index in @_value
			existingLabel = group.state.label or ''
			existingLabel = existingLabel.replace @labelRegex,''
			newLabel = "#{@groupLabel} #{index+1}"
			newLabel += ": #{existingLabel}" if existingLabel
			group.state.label = newLabel
		return

	_recalcDisplay: ()->
		for group in @_value
			group._recalcDisplay() if group._recalcDisplay
		return


	addItem: (value, skipInsert, skipEmit)->
		return if @settings.maxItems and @_value.length is @settings.maxItems or @state.disabled
		margin = if @settings.style is 'inline' then "0 #{@settings.groupMargin}px #{@settings.groupMargin}px 0" else "0 0 #{@settings.groupMargin}px 0"
		settings = extend {type:'group', fields:@settings.fields, margin, value}, @settings._groupSettings, @settings.groupSettings[@settings.style]

		if @settings.singleMode
			firstField = Object.keys(@settings.fields)[0]
			settings.getter = (fields)-> fields[firstField]
			settings.setter = (value)-> {"#{firstField}":value}
		
		group = @builder(settings)
		group.el.child.actions.append(@settings.groupSettings[@settings.style])
		group.addAction 'clone', @templates.cloneIcon, @cloneItem.bind(@, group), (@settings.style is 'block') if @settings.cloneable
		group.addAction 'remove', @templates.removeIcon, @removeItem.bind(@, group), (@settings.style is 'block') if @settings.removeable
		SimplyBind('event:input').of(group).to ()=> @emit('input', @_value, group)
		SimplyBind('disabled').of(@state).to('disabled').of(group.state)
		refreshChildren = group.el.childf

		unless @settings.autoWidth
			group.state.width = @settings.groupWidth
			group.el.child.innerwrap.once 'inserted', ()->
				@style('width', "calc(100% - #{@parent.child.actions.width or 17}px)")

		unless skipInsert
			group.insertBefore(@el.child.addButton)
			@emit('itemAdd', group) unless skipEmit
			@_value.push(group)
		
		return group


	cloneItem: (group)->
		return if @settings.maxItems and @_value.length is @settings.maxItems or @state.disabled
		return if not helpers.includes(@_value, group)
		clone = @addItem(group.value, true)
		clone.insertAfter(group)
		helpers.insertAfter(@_value, group, clone)
		@emit('itemAdd', clone)
		@emit('itemClone', clone)

		return clone


	removeItem: (group)->
		return if @settings.minItems and @_value.length is @settings.minItems or @state.disabled
		
		if removed = helpers.removeItem(@_value, group)
			group.destroy()
			@emit('itemRemove', group)

		return !!removed















module.exports = RepeaterField