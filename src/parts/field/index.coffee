globalDefaults = import './globalDefaults'
helpers = import '../helpers'
IS = import '@danielkalen/is'
extend = import 'smart-extend'
currentID = 0

Field = (settings)->
	@settings = extend.deep.clone.deep.notDeep('templates').transform(
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
	)(globalDefaults, @_defaults, settings)
	@type = settings.type
	@allFields = @settings.fieldInstances or Field.instances
	@_value = null
	@ID = @settings.ID or currentID+++''
	@els = {}
	@_eventCallbacks = {}
	@state =
		valid: true
		visible: true
		disabled: false
		focused: false
		hovered: false
		filled: false
		interacted: false
		showError: false
		width: @settings.width
		showHelp: @settings.alwaysShowHelp
		showLabel: @settings.label
		label: @settings.label
		help: @settings.help

	if IS.defined(@settings.placeholder)
		@state.placeholder = @settings.placeholder

	if @settings.conditions?.length
		@state.visible = false
		helpers.initConditions @, @settings.conditions, ()=> @validateConditions()

	Object.defineProperty @, 'value', {get:@_getValue, set:@_setValue}

	console?.warn("Duplicate field IDs found: '#{@ID}'") if @allFields[@ID]
	@_construct()
	@_createElements()
	@_attachBindings()
	@el.childf.field.onInserted ()=> @emit('inserted')

	if @settings.defaultValue?
		@_setValue if @settings.multiple then [].concat(@settings.defaultValue) else @settings.defaultValue

	return @allFields[@ID] = @el.raw._quickField = @



Field.instances = Object.create(null)
Object.defineProperty Field::, 'valueRaw', get: ()-> @_value

Field::appendTo = (target)->
	@el.appendTo(target); 		return @

Field::prependTo = (target)->
	@el.prependTo(target); 		return @

Field::insertAfter = (target)->
	@el.insertAfter(target); 	return @

Field::insertBefore = (target)->
	@el.insertBefore(target); 	return @

Field::validateConditions = (conditions)->
	if conditions
		toggleVisibility = false
	else
		conditions = @settings.conditions
		toggleVisibility = true
	
	passedConditions = helpers.validateConditions(conditions)
	if toggleVisibility
		return @state.visible = passedConditions
	else 
		return passedConditions

Field::on = (eventName, callback)->
	if IS.string(eventName) and IS.function(callback)
		@_eventCallbacks[eventName] ?= []
		@_eventCallbacks[eventName].push(callback)

	return @

Field::off = (eventName, callback)->
	if @_eventCallbacks[eventName]
		if IS.function(callback)
			helpers.removeItem(@_eventCallbacks[eventName], callback)
		else
			@_eventCallbacks[eventName] = {}

	return @


Field::emit = (eventName, args...)->
	if @_eventCallbacks[eventName]
		callback(@, args...) for callback in @_eventCallbacks[eventName]

	return @








module.exports = Field