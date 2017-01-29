Field = (options)->
	@options = extend.clone.keys(@_defaults).deep(@_defaults, options)
	@value = null
	@els = {}
	@state =
		valid: true
		visible: true
		disabled: false
		focused: false
		hovered: false
		filled: false
		interacted: false
		width: '100%'

	@_construct()
	@_createElements()
	@_attachBindings()
	return @

Field::appendTo = (target)->
	@els.field.appendTo(target)

Field::prependTo = (target)->
	@els.field.prependTo(target)

Field::insertAfter = (target)->
	@els.field.insertAfter(target)

Field::insertBefore = (target)->
	@els.field.insertBefore(target)

