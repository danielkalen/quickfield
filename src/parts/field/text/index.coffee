Field.text = textField = ()-> @
textField:: = Object.create(Field::)
textField::_templates = import ./templates
textField::_defaults = import ./defaults

textField::_construct = ()->
	@state.typing = false
	@helpMessage = if @options.alwaysShowHelp then @options.help else ''
		
	return


textField::_createElements = ()->
	forceOpts = {relatedInstance:@, styleAfterInsert:true}
	@els.field = 			@_templates.field.spawn(@options.templates.field, forceOpts)
	@els.fieldInnerwrap = 	@_templates.fieldInnerwrap.spawn(@options.templates.fieldInnerwrap, forceOpts)	.appendTo(@els.field)
	@els.label = 			@_templates.label.spawn(@options.templates.label, forceOpts)					.prependTo(@els.field)
	@els.input = 			@_templates.input.spawn(@options.templates.input, forceOpts)					.appendTo(@els.fieldInnerwrap)
	@els.placeholder = 		@_templates.placeholder.spawn(@options.templates.placeholder, forceOpts)		.appendTo(@els.fieldInnerwrap)
	@els.help = 			@_templates.help.spawn(@options.templates.help, forceOpts)						.appendTo(@els.fieldInnerwrap)
	@els.checkmark = 		@_templates.checkmark.spawn(@options.templates.checkmark, forceOpts)			.appendTo(@els.fieldInnerwrap)
	if @options.options
		@dropdown = new Dropdown(@options.options, @)
		@dropdown.appendTo(@els.fieldInnerwrap)

	if @options.placeholder
		targetPlaceholder = if @options.placeholder is true and @options.label then @options.label else @options.placeholder or ''
		@els.placeholder.text(targetPlaceholder) if IS.string(targetPlaceholder)

	if @options.label
		@els.label.text(@options.label)

	@els.field.state('showCheckmark', on) if @options.checkmark
	return


textField::_attachBindings = ()->
	listener = listenMethod:'on'
	## ==========================================================================
	## Element state
	## ========================================================================== 
	SimplyBind('visible').of(@state).to (visible)=> @els.field.state 'visible', visible
	SimplyBind('hovered').of(@state).to (hovered)=> @els.field.state 'hover', hovered
	SimplyBind('focused').of(@state).to (focused)=> @els.field.state 'focus', focused
	SimplyBind('filled').of(@state).to (filled)=> @els.field.state 'filled', filled
	SimplyBind('disabled').of(@state).to (disabled)=> @els.field.state 'disabled', disabled
	SimplyBind('showError').of(@state).to (showError)=> @els.field.state 'showError', showError
	SimplyBind('showHelp').of(@state).to (showHelp)=> @els.field.state 'showHelp', showHelp
	SimplyBind('valid').of(@state).to (valid)=>
		@els.field.state 'valid', valid
		@els.field.state 'invalid', !valid


	## ==========================================================================
	## State event triggers
	## ========================================================================== 
	SimplyBind('event:mouseenter', listener).of(@els.input)
		.to ()=> @state.hovered = true
	
	SimplyBind('event:mouseleave', listener).of(@els.input)
		.to ()=> @state.hovered = false

	SimplyBind('event:focus', listener).of(@els.input)
		.to ()=> @state.focused = true; if @state.disabled then @els.input.raw.blur()
	
	SimplyBind('event:blur', listener).of(@els.input)
		.to ()=> @state.focused = @state.typing = false
	
	SimplyBind('event:input', listener).of(@els.input)
		.to ()=> @state.typing = true


	## ==========================================================================
	## Display
	## ========================================================================== 
	SimplyBind('width').of(@state)
		.to (width)=> @els.field.style {width}

	SimplyBind('showError', updateOnBind:false).of(@state)
		.to (error, prevError)=> switch
			when IS.string(error)			then @els.help.text(error)
			when IS.string(prevError)		then @els.help.text(@options.help)

	## ==========================================================================
	## Value
	## ==========================================================================
	SimplyBind('value').of(@els.input.raw)
		.transformSelf (value)=>
			maskedValue = helpers.conformToMask(value, @options.mask, @options.maskPlaceholder)
			currentSelection = @selection()
			setTimeout ()=> @selection(currentSelection)
			return maskedValue
		.to('value').of(@).bothWays()

	SimplyBind('value').of(@).to (value)=>
		@state.filled = !!value
		@state.interacted = true if value
		@state.valid = @_validate()


	## ==========================================================================
	## Autocomplete dropdown
	## ==========================================================================
	return if not @dropdown
	SimplyBind('typing').of(@state)
		.to('isOpen').of(@dropdown)

	SimplyBind('value', updateOnBind:false).of(@)
		.to (value)=>
			for option in @dropdown.options
				shouldBeVisible = if not value then true else helpers.fuzzyMatch(value, option.value)
				option.visible = shouldBeVisible if options.visible isnt shouldBeVisible
			return

	@dropdown.onSelected (selectedOption)=>
		@value = selectedOption.label
		@valueReal = selectedOption.value if selectedOption.value isnt selectedOption.label

	return





textField::_validate = (providedValue, mask=@options.mask, maskPlaceholder=@options.maskPlaceholder)->
	if providedValue
		value = helpers.conformToMask(String(providedValue), mask, maskPlaceholder)
	else
		value = @value

	switch
		when mask then helpers.testMask(value, mask, maskPlaceholder)
	
		when @options.validWhenIsOption and @options.options.length
			matchingOption = @options.options.filter (option)-> option.value is value
			return !!matchingOption.length
	
		else
			return !!value





textField::selection = (newValue)->
	if newValue?
		if IS.number(newValue) or not isNaN(newValue)
			newValue = parseFloat(newValue)
			newSelection = [newValue, newValue]
		else if IS.array(newValue) and newValue.length is 2
			newSelection = newValue

	if newSelection
		@els.input.raw.setSelectionRange(newSelection[0], newSelection[1], @els.input.raw.selectionDirection)
		return
	else
		return [@els.input.raw.selectionStart, @els.input.raw.selectionEnd]
















