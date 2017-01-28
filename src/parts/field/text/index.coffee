Field.text = textField = (options)->
	@placeholder = ''
	@mask = ''
	Field.call(@, options)
	return @

textField::_templates = import ./templates
textField::_defaults = import ./defaults

textField::_createElements = ()->
	@els.field = a

textField::_attachBindings = ()->
	@els.field




