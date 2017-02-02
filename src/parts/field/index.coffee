Field = (options)->
	@options = extend.deep.clone.keys(@_defaults).deep.transform(
		'conditions': (conditions)->
			if IS.objectPlain(conditions)
				{ID, value, property:'value'} for ID,value of conditions
			else if IS.array(conditions)
				conditions.map (item)-> item.property ?= 'value'; item
		
		'options': (options)->
			if IS.objectPlain(options)
				{label,value} for label,value of options
			else if IS.array(options)
				options.map (item)-> if not IS.objectPlain(item) then {label:item, value:item} else item
	)(@_defaults, options)
	@type = options.type
	@allFields = @options.fieldInstances or Field.instances
	@value = if @options.defaultValue? then @options.defaultValue else null
	@ID = @options.ID or currentID+++''
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

	for name of @options.templates
		@options.templates[name] = extend(options:{relatedInstance:@}, @options.templates[name])

	if @options.conditions?.length
		@state.visible = false
		helpers.initConditions @, @options.conditions, ()=> @validateConditions()

	console?.warn("Duplicate field IDs found: '#{@ID}'") if @allFields[@ID]
	@_construct()
	@_createElements()
	@_attachBindings()
	return @allFields[@ID] = @



Field.instances = Object.create(null)
currentID = 0

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
		conditions = @options.conditions
	
	passedConditions = helpers.validateConditions(conditions)
	if toggleVisibility
		return @state.visible = passedConditions
	else 
		return passedConditions




import './text'
# import './textarea'
# import './select'
# import './file'
# import './truefalse'
# import './choice'
# import './group'
# import './repeater'









