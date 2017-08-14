globalDefaults = import './globalDefaults'
helpers = import '../helpers'
IS = import '@danielkalen/is'
extend = import 'smart-extend'
fastdom = import 'fastdom'
SimplyBind = import '@danielkalen/simplybind'
Condition = import '../components/condition'
currentID = 0

class Field
	@instances = Object.create(null)

	Object.defineProperties Field::,
		'removeListener': get: ()-> @off
		'els': get: ()-> @el.child
		'valueRaw': get: ()-> @_value
		'value':
			get: ()-> if @settings.getter then @settings.getter(@_getValue()) else @_getValue()
			set: (value)-> @_setValue(if @settings.setter then @settings.setter(value) else value)
	
	constructor: (settings)->
		shallowSettings = ['templates', 'fieldInstances', 'value', 'defaultValue']
		shallowSettings.push @shallowSettings... if @shallowSettings
		transformSettings = 
			'conditions': (conditions)->
				if IS.objectPlain(conditions)
					{target, value} for target,value of conditions
				else if IS.array(conditions)
					conditions.map (item)-> if IS.string(item) then {target:item} else item
			
			'choices': (choices)->
				if IS.objectPlain(choices)
					{label,value} for label,value of choices
				else if IS.array(choices)
					choices.map (item)-> if not IS.objectPlain(item) then {label:item, value:item} else item

			'validWhenRegex': (regex)->
				if IS.string(regex) then new RegExp(regex) else regex

		transformSettings.push @transformSettings... if @transformSettings
		@settings = extend.deep.clone.notDeep(shallowSettings).transform(transformSettings)(globalDefaults, @defaults, settings)
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

		if @settings.mobileWidth
			SimplyBind ()=>
				fastdom.measure ()=> @state.isMobile = window.innerWidth <= @settings.mobileThreshold
			.updateOn('event:resize').of(window)

		return @el.raw._quickField = @


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

	on: ()->
		@el.on.apply(@el, arguments)
		return @

	off: ()->
		@el.off.apply(@el, arguments)
		return @

	emit: ()->
		@el.emitPrivate.apply(@el, arguments)
		return @

	validate: (providedValue=@[@coreValueProp], testUnrequired)-> switch
		when @settings.validator
			return @settings.validator(providedValue)
		
		when not @settings.required and not testUnrequired
			return true

		when @_validate(providedValue, testUnrequired) is false
			return false

		when @settings.required
			return !!providedValue
		
		else
			return true

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

	coreValueProp: '_value'






module.exports = Field