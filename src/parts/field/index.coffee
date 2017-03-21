Field = (settings)->
	@settings = extend.deep.clone.deep.transform(
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
	)(@_defaults, settings)
	@type = settings.type
	@allFields = @settings.fieldInstances or Field.instances
	@value = if @settings.defaultValue? then @settings.defaultValue else null
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
		showHelp: false
		width: '100%'

	if @settings.conditions?.length
		@state.visible = false
		helpers.initConditions @, @settings.conditions, ()=> @validateConditions()

	console?.warn("Duplicate field IDs found: '#{@ID}'") if @allFields[@ID]
	@_construct()
	@_createElements()
	@_attachBindings()
	return @allFields[@ID] = @els.field.raw._quickField = @



Field.instances = Object.create(null)
currentID = 0
Object.defineProperty Field::, 'valueRaw', get: ()-> @value

Field::appendTo = (target)->
	@els.field.appendTo(target); 		return @

Field::prependTo = (target)->
	@els.field.prependTo(target); 		return @

Field::insertAfter = (target)->
	@els.field.insertAfter(target); 	return @

Field::insertBefore = (target)->
	@els.field.insertBefore(target); 	return @

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


import './text'
# import './textarea'
import './select'
# import './file'
# import './truefalse'
import './choice'
# import './group'
# import './repeater'









