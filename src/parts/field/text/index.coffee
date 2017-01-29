Field.text = textField = ()-> @
textField:: = Object.create(Field::)
textField::_templates = import ./templates
textField::_defaults = import ./defaults

textField::_construct = ()->
	@placeholder = ''
	@mark = ''
	for name of @options.templates
		@options.templates[name] = extend(options:{relatedInstance:@}, @options.templates[name])
	return

textField::_createElements = ()->
	@els.field = @_templates.field.spawn(@options.templates.field)
	@els.label = @_templates.label.spawn(@options.templates.label)
	@els.display = @_templates.display.spawn(@options.templates.display)
	@els.input = @_templates.input.spawn(@options.templates.input)
	@els.help = @_templates.help.spawn(@options.templates.help)

textField::_attachBindings = ()->
	@els.field




