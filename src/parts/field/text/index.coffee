Field.text = textField = ()-> @
textField:: = Object.create(Field::)
textField::_templates = import ./templates
textField::_defaults = import ./defaults

textField::_construct = ()->
	@state.typing = false
	@cursor = prev:0, current:0
	@helpMessage = if @settings.alwaysShowHelp then @settings.help else ''
	if not @settings.mask then @settings.mask = switch @settings.keyboard
		when 'number','phone','tel' then '1+'
		when 'email' then '*+@*+.aa+'
		
	@mask = new Mask(@settings.mask, @settings.maskPlaceholder, @settings.maskGuide) if @settings.mask
	return


textField::_createElements = ()->
	forceOpts = {relatedInstance:@, styleAfterInsert:true}
	@els.field = 			@_templates.field.spawn(@settings.templates.field, forceOpts)
	@els.fieldInnerwrap = 	@_templates.fieldInnerwrap.spawn(@settings.templates.fieldInnerwrap, forceOpts)	.appendTo(@els.field)
	@els.label = 			@_templates.label.spawn(@settings.templates.label, forceOpts)					.prependTo(@els.field)
	@els.input = 			@_templates.input.spawn(@settings.templates.input, forceOpts)					.appendTo(@els.fieldInnerwrap)
	@els.placeholder = 		@_templates.placeholder.spawn(@settings.templates.placeholder, forceOpts)		.appendTo(@els.fieldInnerwrap)
	@els.help = 			@_templates.help.spawn(@settings.templates.help, forceOpts)						.appendTo(@els.fieldInnerwrap)
	@els.checkmark = 		@_templates.checkmark.spawn(@settings.templates.checkmark, forceOpts)			.appendTo(@els.fieldInnerwrap)

	if @settings.choices
		@dropdown = new Dropdown(@settings.choices, @)
		@dropdown.appendTo(@els.fieldInnerwrap)

	if @settings.label
		@els.label.text(@settings.label)
		@els.field.state 'hasLabel', on

	if @settings.checkmark
		@els.field.state 'showCheckmark', on

	@els.input.prop 'type', switch @settings.keyboard
		when 'number','tel','phone' then 'tel'
		when 'password' then 'password'
		when 'url' then 'url'
		# when 'email' then 'email'
		# when 'text','search' then 'text'
		else 'text'
	
	@els.field.raw._quickField = @els.input.raw._quickField = @
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
	## Display
	## ========================================================================== 
	SimplyBind('width').of(@state)
		.to (width)=> @els.field.style {width}

	SimplyBind('showError', updateOnBind:false).of(@state)
		.to (error, prevError)=> switch
			when IS.string(error)			then @els.help.text(error)
			when IS.string(prevError)		then @els.help.text(@settings.help)

	SimplyBind('placeholder').of(@settings)
		.to('textContent').of(@els.placeholder.raw)
			.transform (placeholder)=> switch
				when placeholder is true and @settings.label then @settings.label
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


	SimplyBind('value').of(@)
		.to('valueRaw').of(@).transform (value)=> if @mask then @mask.valueRaw else value

	SimplyBind('valueRaw').of(@).to (value)=>
		@state.filled = !!value
		@state.interacted = true if value
		@state.valid = @validate()
	
	if @settings.mask
		SimplyBind('value', updateEvenIfSame:true).of(@els.input.raw)
			.to (value)=> @_scheduleCursorReset() if @state.focused


	## ==========================================================================
	## Autocomplete dropdown
	## ==========================================================================
	if @dropdown
		SimplyBind('typing', updateEvenIfSame:true).of(@state).to (isTyping)=>
			if isTyping
				return if not @valueRaw
				@dropdown.isOpen = true
				SimplyBind('event:click').of(document)
					.once.to ()=> @dropdown.isOpen = false
					.condition (event)=> not DOM(event.target).parentMatching (parent)=> parent is @els.input
			else
				setTimeout ()=>
					@dropdown.isOpen = false
				, 300


		SimplyBind('valueRaw', updateOnBind:false).of(@).to (value)=>
			for option in @dropdown.options
				shouldBeVisible = if not value then true else helpers.fuzzyMatch(value, option.value)
				option.visible = shouldBeVisible if option.visible isnt shouldBeVisible

			if @dropdown.isOpen and not value
				@dropdown.isOpen = false
			return

		@dropdown.onSelected (selectedOption)=>
			@value = selectedOption.label
			@valueRaw = selectedOption.value if selectedOption.value isnt selectedOption.label
			@dropdown.isOpen = false
			@selection(@els.input.raw.value.length)


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
		.to ()=> @state.typing = @state.focused = false
	
	SimplyBind('event:input', listener).of(@els.input)
		.to ()=> @state.typing = true
	
	SimplyBind('event:keydown', listener).of(@els.input)
		.to ()=> @cursor.prev = @selection().end

	return





textField::validate = (providedValue=@value)-> switch
	when @settings.validWhenRegex and IS.regex(@settings.validWhenRegex) then @settings.validWhenRegex.test(providedValue)
	
	when @settings.validWhenIsChoice and @settings.choices?.length
		matchingOption = @settings.choices.filter (option)-> option.value is providedValue
		return !!matchingOption.length

	when @mask then @mask.validate(providedValue)
	
	else return !!providedValue




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


textField::focus = ()->
	@els.input.raw.focus()

textField::blur = ()->
	@els.input.raw.blur()















