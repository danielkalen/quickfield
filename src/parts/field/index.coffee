Field = (options)->
	@options = extend.clone.keys(@_defaults).deep.transform(
		'conditions': (conditions)-> [].concat(conditions)
		'options': (options)->
			if IS.objectPlain(options)
				{label,value} for label,value of options
			else if IS.array(options)
				options.map (item)-> if IS.string(item) then {label:item, value:item} else item
	)(@_defaults, options)

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

	console?.warn("Duplicate field IDs found: '#{@ID}'") if @allFields[@ID]
	@_construct()
	@_createElements()
	@_attachBindings()
	return @allFields[@ID] = @

Field.instances = Object.create(null)
currentID = 0

Field::appendTo = (target)->
	@els.field.appendTo(target)

Field::prependTo = (target)->
	@els.field.prependTo(target)

Field::insertAfter = (target)->
	@els.field.insertAfter(target)

Field::insertBefore = (target)->
	@els.field.insertBefore(target)

