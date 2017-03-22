Field.select = SelectField = ()-> @
SelectField:: = Object.create(Field::)
SelectField::_templates = import ./templates
SelectField::_defaults = import ./defaults

SelectField::_construct = ()->
	if not @settings.choices?.length
		throw new Error "Choices were not provided for choice field '#{@settings.label or @ID}'"
	
	@value = (if @settings.multiple then [] else null) unless @settings.defaultValue
	@state.showHelp = if @settings.alwaysShowHelp then @settings.help else false
	@settings.dropdownOptions.multiple = @settings.multiple
	@settings.dropdownOptions.help = 'Tip: press ESC to close this menu' if @settings.multiple
	return


SelectField::_createElements = ()->
	forceOpts = {relatedInstance:@, styleAfterInsert:true}
	@els.field = 			@_templates.field.spawn(@settings.templates.field, forceOpts)
	@els.fieldInnerwrap = 	@_templates.fieldInnerwrap.spawn(@settings.templates.fieldInnerwrap, forceOpts)	.appendTo(@els.field)
	@els.label = 			@_templates.label.spawn(@settings.templates.label, forceOpts)					.prependTo(@els.field)
	@els.input = 			@_templates.input.spawn(@settings.templates.input, forceOpts)					.appendTo(@els.fieldInnerwrap)
	@els.placeholder = 		@_templates.placeholder.spawn(@settings.templates.placeholder, forceOpts)		.insertBefore(@els.input)
	@els.help = 			@_templates.help.spawn(@settings.templates.help, forceOpts)						.appendTo(@els.fieldInnerwrap)
	@els.caret = 			@_templates.caret.spawn(@settings.templates.caret, forceOpts)					.appendTo(@els.fieldInnerwrap)
	@els.checkmark = @els.caret # Alias since SelectField copies style logic form TextField and requires this ref
	@dropdown = new Dropdown(@settings.choices, @)
	@dropdown.appendTo(@els.fieldInnerwrap)

	if @settings.label
		@els.label.text(@settings.label)
		@els.field.state 'hasLabel', on

	@els.fieldInnerwrap.raw._quickField = @els.input.raw._quickField = @
	return


SelectField::_attachBindings = ()->
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
	SimplyBind('showHelp').of(@state)
		.to('textContent').of(@els.help.raw)
			.transform (message)-> if message then message else ''
			.condition ()=> not @state.showError

	SimplyBind('showError', updateOnBind:false).of(@state)
		.to (error, prevError)=> switch
			when IS.string(error)			then @els.help.text(error)
			when IS.string(prevError)		then @els.help.text(@state.showError)

	SimplyBind('placeholder').of(@settings)
		.to('textContent').of(@els.placeholder.raw)
			.transform (placeholder)=> switch
				when placeholder is true and @settings.label then @settings.label
				when IS.string(placeholder) then placeholder
				else ''

	# ==== Autowidth =================================================================================
	SimplyBind('width', updateEvenIfSame:true).of(@state)
		.to (width)=> (if @settings.autoWidth then @els.input else @els.field).style {width}

	if @settings.autoWidth then setTimeout ()=>
		SimplyBind('valueLabel', updateEvenIfSame:true, updateOnBind:false).of(@)
			.to (hasValue)=>
				if hasValue
					@els.input.style('width', 0)
					inputWidth = @els.input.raw.scrollWidth + 2
					labelWidth = if @els.label.styleSafe('position') is 'absolute' then @els.label.rect.width else 0
				else
					inputWidth = @els.placeholder.rect.width
					labelWidth = 0
				
				finalWidth = Math.max(inputWidth, labelWidth)
				@state.width = "#{finalWidth}px"
						
			.updateOn('event:inserted', listenMethod:'on').of(@)



	## ==========================================================================
	## Value
	## ==========================================================================
	SimplyBind('array:selected', updateOnBind:false).of(@dropdown)
		.to('value').of(@).transform (selected)=> if not selected then selected else
			if @settings.multiple
				selected.map (choice)=> choice.value
			else
				selected.value

	SimplyBind('value').of(@)
		.to('array:selected').of(@dropdown).transform (selected)=>
			if @settings.multiple
				if not selected then []
				else
					selected
						.map (choiceValue)=> @dropdown.findOption(choiceValue)
						.filter (validValue)-> validValue
			else
				if not selected then null
				else @dropdown.findOption(selected)


	SimplyBind('value').of(@)
		.to('valueLabel').of(@).transform (selected)=> switch
			when @settings.multiple then selected.map(@dropdown.getLabelOfOption.bind(@dropdown)).join(', ')
			when typeof selected isnt 'string' then ''
			else @dropdown.getLabelOfOption(selected)

	SimplyBind('valueLabel').of(@)
		.to('textContent').of(@els.input.raw)
			.transform (label)=> if @settings.labelFormat then @settings.labelFormat(label) else label
		.and.to (value)=>
			@state.filled = !!value
			@state.interacted = true if value
			@state.valid = @validate()
	
	SimplyBind('array:value', updateOnBind:false).of(@)
		.to ()=> @emit('input')

	## ==========================================================================
	## Dropdown
	## ==========================================================================
	SimplyBind('event:click', listener).of(@els.input).to ()=> unless @state.disabled
		@dropdown.isOpen = true
		
		clickListener = 
		SimplyBind('event:click').of(document)
			.once.to ()=> @dropdown.isOpen = false
			.condition (event)=> not DOM(event.target).parentMatching (parent)=> parent is @els.fieldInnerwrap
		
		escListener = 
		SimplyBind('event:keydown').of(document)
			.once.to ()=> @dropdown.isOpen = false
			.condition (event)-> event.keyCode is 27

		SimplyBind('isOpen', updateOnBind:false).of(@dropdown)
			.once.to ()-> clickListener.unBind(); escListener.unBind();
			.condition (isOpen)-> not isOpen



	SimplyBind('focused', updateOnBind:false).of(@state).to (focused)=>
		if not focused
			@els.input.off 'keydown.dropdownTrigger'
		else
			triggeringKeycodes = [32, 37, 38, 39, 40]
			
			@els.input.on 'keydown.dropdownTrigger', (event)=>
				if helpers.includes(triggeringKeycodes, event.keyCode) and not @dropdown.isOpen
					@dropdown.isOpen = true
					@dropdown.currentHighlighted = @dropdown.lastSelected if @dropdown.lastSelected?.selected
					event.preventDefault()

				else if event.keyCode is 9 and @dropdown.isOpen # Prevent tab key
					event.preventDefault()


	@dropdown.onSelected (selectedOption)=>
		@dropdown.isOpen = false unless @settings.multiple


	## ==========================================================================
	## State event triggers
	## ========================================================================== 
	SimplyBind('event:mouseenter', listener).of(@els.input)
		.to ()=> @state.hovered = true
	
	SimplyBind('event:mouseleave', listener).of(@els.input)
		.to ()=> @state.hovered = false

	SimplyBind('event:focus', listener).of(@els.input)
		.to ()=> @state.focused = true; if @state.disabled then @blur()
	
	SimplyBind('event:blur', listener).of(@els.input)
		.to ()=> @state.focused = false
	
	return





SelectField::validate = (providedValue=@value)-> switch
	when @settings.validWhenRegex and IS.regex(@settings.validWhenRegex) then switch
		when @settings.multiple then do ()=>
			return false if providedValue.length is 0
			validChoices = providedValue.filter (choice)=> @settings.validWhenRegex.test(choice)
			
			if @settings.validWhenChoseMin is Infinity or not IS.number(@settings.validWhenChoseMin)
				validChoices.length is providedValue.length
			else
				validChoices.length >= @settings.validWhenChoseMin

		else @settings.validWhenRegex.test(providedValue)
	

	when @settings.validWhenIsChoice and @settings.choices?.length
		matchingOption = @settings.choices.filter (option)-> option.value is providedValue
		return !!matchingOption.length

	when @settings.multiple and -1 > @settings.validWhenChoseMin < Infinity
		providedValue.length >= @settings.validWhenChoseMin

	when @settings.multiple then providedValue.length

	else !!providedValue



SelectField::focus = ()->
	@els.input.raw.focus()

SelectField::blur = ()->
	@els.input.raw.blur()
















