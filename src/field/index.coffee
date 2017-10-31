helpers = import '../helpers'
IS = import '../checks'
extend = import 'smart-extend'
fastdom = import 'fastdom'
SimplyBind = import '@danielkalen/simplybind'
Condition = import '../components/condition'
currentID = 0

class Field
	@instances = Object.create(null)
	@shallowSettings = ['templates', 'fieldInstances', 'value', 'defaultValue']
	@transformSettings = import './transformSettings'
	coreValueProp: '_value'
	globalDefaults: import './globalDefaults'

	Object.defineProperties Field::,
		'removeListener': get: ()-> @off
		'els': get: ()-> @el.child
		'valueRaw': get: ()-> @_value
		'value':
			get: ()-> if @settings.getter then @settings.getter(@_getValue()) else @_getValue()
			set: (value)-> @_setValue(if @settings.setter then @settings.setter(value) else value)
	
	constructor: (settings, @builder, settingOverrides, templateOverrides)->
		if settingOverrides
			@globalDefaults = settingOverrides.globalDefaults if settingOverrides.globalDefaults
			@defaults = settingOverrides[settings.type] if settingOverrides[settings.type]
		if templateOverrides and templateOverrides[settings.type]
			@templates = templateOverrides[settings.type]
			@template = templateOverrides[settings.type].default

		shallowSettings = if @shallowSettings then Field.shallowSettings.concat(@shallowSettings) else Field.shallowSettings
		transformSettings = if @transformSettings then Field.transformSettings.concat(@transformSettings) else Field.transformSettings

		@settings = extend.deep.clone.notDeep(shallowSettings).transform(transformSettings)(@globalDefaults, @defaults, settings)
		@ID = @settings.ID or currentID+++''
		@type = settings.type
		@name = settings.name
		@allFields = @settings.fieldInstances or Field.instances
		@_value = null
		@_eventCallbacks = {}
		@state =
			valid: true
			visible: true
			focused: false
			hovered: false
			filled: false
			interacted: false
			isMobile: false
			disabled: @settings.disabled
			margin: @settings.margin
			padding: @settings.padding
			width: @settings.width
			showLabel: @settings.label
			label: @settings.label
			showHelp: @settings.help
			help: @settings.help
			showError: false
			error: @settings.error

		if IS.defined(@settings.placeholder)
			@state.placeholder = @settings.placeholder

		if IS.number(@settings.width) and @settings.width <= 1
			@state.width = "#{@settings.width*100}%"

		if @settings.conditions?.length
			@state.visible = false
			Condition.init(@, @settings.conditions)

		console?.warn("Duplicate field IDs found: '#{@ID}'") if @allFields[@ID]
		@allFields[@ID] = @


	_constructorEnd: ()->
		@el.childf#.field.on 'inserted', ()=> @emit('inserted')
		@el.raw.id = @ID if @settings.ID

		@settings.defaultValue ?= @settings.value if @settings.value?
		if @settings.defaultValue?
			@value = if @settings.multiple then [].concat(@settings.defaultValue) else @settings.defaultValue

		SimplyBind('showError', updateOnBind:false).of(@state)
			.to('help').of(@state)
			.transform (show)=>
				if show and @state.error and IS.string(@state.error)
					@state.error
				else
					@settings.help or @state.help

		SimplyBind('error', updateOnBind:false).of(@state)
			.to('help').of(@state)
			.condition (error)=> error and @state.showError

		SimplyBind('help').of(@state)
			.to('html').of(@el.child.help)
			.and.to('showHelp').of(@state)

		SimplyBind('label').of(@state)
			.to('text').of(@el.child.label)
			.and.to('showLabel').of(@state)

		SimplyBind('margin').of(@state)
			.to @el.style.bind(@el, 'margin')
		
		SimplyBind('padding').of(@state)
			.to @el.style.bind(@el, 'padding')

		SimplyBind('showHelp').of(@state)
			.to (show, prevShow)=>
				changeAmount = if !!show is !!prevShow then 0 else if show then 25 else if prevShow then -25
				@state.margin = helpers.updateShorthandValue(@state.margin, 'bottom', changeAmount) if changeAmount

		SimplyBind('focused', updateOnBind:false).of(@state).to (focused)=>
			@emit(if focused then 'focus' else 'blur')

		if @settings.mobileWidth
			SimplyBind ()=>
				fastdom.measure ()=> @state.isMobile = window.innerWidth <= @settings.mobileThreshold
			.updateOn('event:resize').of(window)

		return @el.raw._quickField = @


	_formatWidth: (width)->
		width = if @state.isMobile then (@settings.mobileWidth or width) else width
		width = "calc(#{width} - #{@settings.distance}px)" if @settings.distance
		return width








	appendTo: (target)->
		@el.appendTo(target); 		return @

	prependTo: (target)->
		@el.prependTo(target); 		return @

	insertAfter: (target)->
		@el.insertAfter(target); 	return @

	insertBefore: (target)->
		@el.insertBefore(target); 	return @

	detach: (target)->
		@el.detach(target); 		return @

	remove: ()->
		@el.remove()
		return @destroy(false)

	destroy: (removeFromDOM=true)->
		SimplyBind.unBindAll(@)
		SimplyBind.unBindAll(@state)
		SimplyBind.unBindAll(@el)
		SimplyBind.unBindAll(child) for child in @el.child
		@el.remove() if removeFromDOM
		@_destroy() if @_destroy
		delete @allFields[@ID]
		return true

	on: (eventNames, callback, useCapture)->
		@el.on.call(@el, eventNames, callback, useCapture, true)
		return @

	once: (eventNames, callback, useCapture)->
		@on eventNames, ()=>
			@off(eventNames, callback)
			callback.apply(@el, arguments)
		, useCapture

	off: ()->
		@el.off.apply(@el, arguments)
		return @

	emit: ()->
		@el.emitPrivate.apply(@el, arguments)
		return @

	validate: (providedValue=@[@coreValueProp], testUnrequired)->
		isValid = switch
			when @settings.validator then @settings.validator(providedValue)
			
			when not @settings.required and not testUnrequired then true

			when @_validate(providedValue, testUnrequired) is false then false

			when @settings.required
				if @settings.multiple then !!providedValue?.length else !!providedValue
			
			else true

		@state.showError = false if isValid and @settings.clearErrorOnValid
		return isValid

	validateConditions: (conditions)->
		if conditions
			toggleVisibility = false
		else
			conditions = @conditions
			toggleVisibility = true
		
		passedConditions = Condition.validate(conditions)
		if toggleVisibility
			return @state.visible = passedConditions
		else 
			return passedConditions

	validateAndReport: (providedValue)->
		isValid = @validate(null, true)
		@state.showError = !isValid
		return isValid






module.exports = Field