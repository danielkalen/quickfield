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

	@_createElements()
	@_attachBindings()
	return @
