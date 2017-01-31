Field.text = textField = ()-> @
textField:: = Object.create(Field::)
textField::_templates = import ./templates
textField::_defaults = import ./defaults

textField::_construct = ()->
	@helpMessage = if @options.alwaysShowHelp then @options.help else ''
	
	for name of @options.templates
		@options.templates[name] = extend(options:{relatedInstance:@}, @options.templates[name])
	
	return


textField::_createElements = ()->
	@els.field = 			DOM(@_templates.field).spawn(@options.templates.field)
	@els.label = 			DOM(@_templates.label).spawn(@options.templates.label)					.appendTo(@els.field)
	@els.fieldInnerwrap = 	DOM(@_templates.fieldInnerwrap).spawn(@options.templates.fieldInnerwrap).appendTo(@els.field)
	@els.input = 			DOM(@_templates.input).spawn(@options.templates.input)					.appendTo(@els.fieldInnerwrap)
	@els.placeholder = 		DOM(@_templates.placeholder).spawn(@options.templates.placeholder)		.appendTo(@els.fieldInnerwrap)
	@els.help = 			DOM(@_templates.help).spawn(@options.templates.help)					.appendTo(@els.fieldInnerwrap)
	@els.checkmark = 		DOM(@_templates.checkmark).spawn(@options.templates.checkmark)			.appendTo(@els.fieldInnerwrap)
	if @options.options
		@dropdown = new Dropdown(@options.options, @)
		@dropdown.appendTo(@els.fieldInnerwrap)

	@els.field.setState('showCheckmark') if @options.checkmark
	return


textField::_attachBindings = ()->
	listener = listenMethod:'on'
	SimplyBind('hovered').of(@state).to (hovered)=> @els.field.setState 'hover', hovered
	SimplyBind('focused').of(@state).to (focused)=> @els.field.setState 'focus', focused
	SimplyBind('filled').of(@state).to (filled)=> @els.field.setState 'filled', filled
	SimplyBind('disabled').of(@state).to (disabled)=> @els.field.setState 'disabled', disabled
	SimplyBind('showError').of(@state).to (showError)=> @els.field.setState 'showError', showError
	SimplyBind('showHelp').of(@state).to (showHelp)=> @els.field.setState 'showHelp', showHelp

	SimplyBind('event:mouseenter', listener).of(@els.input)
		.to ()=> @state.hovered = true
	
	SimplyBind('event:mouseleave', listener).of(@els.input)
		.to ()=> @state.hovered = false

	SimplyBind('event:focus', listener).of(@els.input)
		.to ()=> @state.focused = true; if @state.disabled then @els.input.raw.blur()
	
	SimplyBind('event:blur', listener).of(@els.input)
		.to ()=> @state.focused = false

	SimplyBind('width').of(@state)
		.to (width)=> @els.field.style {width}

	SimplyBind('showError', updateOnBind:false).of(@state)
		.to (error, prevError)=> switch
			when IS.string(error)			then @els.help.text(error)
			when IS.string(prevError)		then @els.help.text(@options.help)

	SimplyBind('value').of(@els.input.raw).transformSelf (value)=> helpers.conformToMask(value, @options.mask, @options.maskPlaceholder)
		.to('value').of(@).bothWays()

	SimplyBind('value').of(@).to (value)=>
		@state.filled = !!value
		@state.interacted = true if value
		@state.valid = @_validate()




textField::_validate = (providedValue)->
	if providedValue
		value = helpers.conformToMask(String(providedValue), @options.mask, @options.maskPlaceholder)
	else
		value = @value

	if @options.mask
		return helpers.testMask(value, @options.mask, @options.maskPlaceholder)
	
	else if @options.validWhenIsOption and @options.options.length
		matchingOption = @options.options.filter (option)-> option.value is value
		return !!matchingOption.length
	
	else
		return !!valid






