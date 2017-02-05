Field.text = textField = ()-> @
textField:: = Object.create(Field::)
textField::_templates = import ./templates
textField::_defaults = import ./defaults

textField::_construct = ()->
	@state.typing = false
	@cursor = prev:0, current:0
	@mask = new Mask(@options.mask, @options.maskPlaceholder) if @options.mask
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
	if @options.keyboard is 'password'
		@els.passwordPlaceholder = 

	if @options.options
		@dropdown = new Dropdown(@options.options, @)
		@dropdown.appendTo(@els.fieldInnerwrap)

	if @options.label
		@els.label.text(@options.label)
		@els.field.state 'hasLabel', on

	if @options.checkmark
		@els.field.state 'showCheckmark', on

	@els.input.prop 'type', switch @options.keyboard
		when 'number','tel','phone' then 'tel'
		when 'email' then 'email'
		when 'url' then 'url'
		# when 'text','search' then 'text'
		else 'text'
	
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
	
	SimplyBind('event:keydown', listener).of(@els.input)
		.to ()=> @cursor.prev = @selection().end


	## ==========================================================================
	## Display
	## ========================================================================== 
	SimplyBind('width').of(@state)
		.to (width)=> @els.field.style {width}

	SimplyBind('showError', updateOnBind:false).of(@state)
		.to (error, prevError)=> switch
			when IS.string(error)			then @els.help.text(error)
			when IS.string(prevError)		then @els.help.text(@options.help)

	SimplyBind('placeholder').of(@options)
		.to('textContent').of(@els.placeholder.raw)
			.transform (placeholder)=> switch
				when placeholder is true and @options.label then @options.label
				when IS.string(placeholder) then placeholder
				else ''

	## ==========================================================================
	## Value
	## ==========================================================================
	SimplyBind('value').of(@els.input.raw)
		.transformSelf (newValue)=>
			if not @mask
				return newValue
			else
				@mask.setValue(newValue)
				@cursor.current = @selection().start
				newValue = if @mask.valueRaw then @mask.value else ''
				return newValue

		.to('value').of(@).bothWays()


	SimplyBind('value').of(@).to (value)=>
		value = @mask.valueRaw if @mask
		@state.filled = !!value
		@state.interacted = true if value
		@state.valid = @validate()
	
	if @options.mask
		SimplyBind('value', updateEvenIfSame:true).of(@els.input.raw)
			.to (value)=> @_scheduleCursorReset() if @state.focused


	## ==========================================================================
	## Autocomplete dropdown
	## ==========================================================================
	if @dropdown
		SimplyBind('typing', updateEvenIfSame:true).of(@state)
			.to (isTyping)=>
				if isTyping
					@dropdown.isOpen = true
					SimplyBind('event:click').of(document)
						.once.to ()=> @dropdown.isOpen = false
						.condition (event)=> not DOM(event.target).parentMatching (parent)=> parent is @els.input
				else
					setTimeout ()=>
						@dropdown.isOpen = false
					, 300


		SimplyBind('value', updateOnBind:false).of(@)
			.to (value)=>
				value = @mask.valueRaw if @mask
				for option in @dropdown.options
					shouldBeVisible = if not value then true else helpers.fuzzyMatch(value, option.value)
					option.visible = shouldBeVisible if option.visible isnt shouldBeVisible

				if @dropdown.isOpen and not value
					@dropdown.isOpen = false
				return

		@dropdown.onSelected (selectedOption)=>
			@value = selectedOption.label
			@valueReal = selectedOption.value if selectedOption.value isnt selectedOption.label

	return





textField::validate = (providedValue=@value)-> switch
	when @mask then @mask.validate(providedValue)

	when @options.validWhenIsOption and @options.options?.length
		matchingOption = @options.options.filter (option)-> option.value is providedValue
		return !!matchingOption.length

	else
		return !!providedValue




textField::_scheduleCursorReset = ()->
	diffIndex = helpers.getIndexOfFirstDiff(@mask.value, @mask.prev.value)
	currentCursor = @cursor.current
	newCursor = @mask.normalizeCursorPos(currentCursor, @cursor.prev)

	if newCursor isnt currentCursor
		@selection(newCursor)
	return



textField::selection = (arg)->
	if IS.object(arg)
		start = arg.start
		end = arg.end
	else
		start = arg

	if start?
		end = start if not end or end < start
		@els.input.raw.setSelectionRange(start, end)
		return
	else
		return 'start':@els.input.raw.selectionStart, 'end':@els.input.raw.selectionEnd
















