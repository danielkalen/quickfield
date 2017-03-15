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
	return @allFields[@ID] = @



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




import './text'
# import './textarea'
import './select'
# import './file'
# import './truefalse'
import './choice'
# import './group'
# import './repeater'









