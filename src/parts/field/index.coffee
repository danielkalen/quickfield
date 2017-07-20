globalDefaults = import './globalDefaults'
helpers = import '../helpers'
IS = import '@danielkalen/is'
extend = import 'smart-extend'
currentID = 0

class Field
	@instances = Object.create(null)

	Object.defineProperties Field::,
		'valueRaw': get: ()-> @_value
		'value':
			get: ()-> @_getValue()
			set: (value)-> @_setValue(value)
	
	constructor: (settings)->
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
		)(globalDefaults, @defaults, settings)
		@ID = @settings.ID or currentID+++''
		@type = settings.type
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

		if @settings.conditions?.length
			@state.visible = false
			helpers.initConditions @, @settings.conditions, ()=> @validateConditions()

		console?.warn("Duplicate field IDs found: '#{@ID}'") if @allFields[@ID]
		@allFields[@ID] = @


	_constructorEnd: ()->
		@el.childf.field.onInserted ()=> @emit('inserted')
		@el.raw.id = @ID if @settings.ID

		@settings.defaultValue ?= @settings.value if @settings.value?
		if @settings.defaultValue?
			@_setValue if @settings.multiple then [].concat(@settings.defaultValue) else @settings.defaultValue

		return @el.raw._quickField = @


	appendTo: (target)->
		@el.appendTo(target); 		return @

	prependTo: (target)->
		@el.prependTo(target); 		return @

	insertAfter: (target)->
		@el.insertAfter(target); 	return @

	insertBefore: (target)->
		@el.insertBefore(target); 	return @

	validateConditions: (conditions)->
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

	on: (eventName, callback)->
		if IS.string(eventName) and IS.function(callback)
			@_eventCallbacks[eventName] ?= []
			@_eventCallbacks[eventName].push(callback)

		return @

	off: (eventName, callback)->
		if @_eventCallbacks[eventName]
			if IS.function(callback)
				helpers.removeItem(@_eventCallbacks[eventName], callback)
			else
				@_eventCallbacks[eventName] = {}

		return @


	emit: (eventName, args...)->
		if @_eventCallbacks[eventName]
			callback.apply(@, args) for callback in @_eventCallbacks[eventName]

		return @








module.exports = Field