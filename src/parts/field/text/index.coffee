Field.text = TextField = ()-> @
TextField:: = Object.create(Field::)
TextField::_templates = import ./templates
TextField::_defaults = import ./defaults

TextField::_construct = ()->
	@state.typing = false
	@cursor = prev:0, current:0
	@helpMessage = if @settings.alwaysShowHelp then @settings.help else ''
	if not @settings.mask then @settings.mask = switch @settings.keyboard
		when 'number','phone','tel' then '1+'
		when 'email' then '*+@*+.aa+'
		
	@mask = new Mask(@settings.mask, @settings.maskPlaceholder, @settings.maskGuide) if @settings.mask
	return

TextField::_getValue = ()->
	return @_value

TextField::_setValue = (newValue)->
	@_value = newValue if IS.string(newValue) or IS.number(newValue)


TextField::_createElements = ()->
	forceOpts = {relatedInstance:@, styleAfterInsert:true}
	@el = @_templates.field.spawn(@settings.templates.field, forceOpts)

	if @settings.choices
		@dropdown = new Dropdown(@settings.choices, @)
		@dropdown.appendTo(@el.child.innerwrap)

	if @settings.icon
		iconChar = @settings.icon if IS.string(@settings.icon)
		@_templates.icon.spawn(@settings.templates.icon, forceOpts, iconChar).insertBefore(@el.child.input)

	if @settings.checkmark
		@_templates.checkmark.spawn(@settings.templates.checkmark, forceOpts).appendTo(@el.child.innerwrap)
	
	@el.child.input.prop 'type', switch @settings.keyboard
		when 'number','tel','phone' then 'tel'
		when 'password' then 'password'
		when 'url' then 'url'
		# when 'email' then 'email'
		else 'text'

	@el.state 'hasLabel', @settings.label
	@el.child.innerwrap.raw._quickField = @el.child.input.raw._quickField = @
	return


listener = listenMethod:'on'
TextField::_attachBindings = ()->
	@_attachBindings_elState()
	@_attachBindings_display()
	@_attachBindings_display_autoWidth()
	@_attachBindings_value()
	@_attachBindings_autocomplete()
	@_attachBindings_stateTriggers()
	return


TextField::_attachBindings_elState = ()->
	## ==========================================================================
	## Element state
	## ========================================================================== 
	SimplyBind('visible').of(@state).to (visible)=> @el.state 'visible', visible
	SimplyBind('hovered').of(@state).to (hovered)=> @el.state 'hover', hovered
	SimplyBind('focused').of(@state).to (focused)=> @el.state 'focus', focused
	SimplyBind('filled').of(@state).to (filled)=> @el.state 'filled', filled
	SimplyBind('disabled').of(@state).to (disabled)=> @el.state 'disabled', disabled
	SimplyBind('showError').of(@state).to (showError)=> @el.state 'showError', showError
	SimplyBind('showHelp').of(@state).to (showHelp)=> @el.state 'showHelp', showHelp
	SimplyBind('valid').of(@state).to (valid)=>
		@el.state 'valid', valid
		@el.state 'invalid', !valid
	return


TextField::_attachBindings_display = ()->
	## ==========================================================================
	## Display
	## ========================================================================== 
	SimplyBind('showError', updateOnBind:false).of(@state)
		.to (error, prevError)=> switch
			when IS.string(error)			then @el.child.help.text(error)
			when IS.string(prevError)		then @el.child.help.text(@helpMessage)

	SimplyBind('label').of(@settings)
		.to('textContent').of(@el.child.label.raw)

	SimplyBind('placeholder').of(@settings)
		.to('textContent').of(@el.child.placeholder.raw)
			.transform (placeholder)=> switch
				when placeholder is true and @settings.label then @settings.label
				when IS.string(placeholder) then placeholder
				else ''

	SimplyBind('helpMessage').of(@)
		.to('textContent').of(@el.child.help.raw)
		.condition ()=> not @state.showError
	return


TextField::_attachBindings_display_autoWidth = ()->
	SimplyBind('width', updateEvenIfSame:true).of(@state)
		.to (width)=> (if @settings.autoWidth then @el.child.input else @el).style {width}

	if @settings.autoWidth
		SimplyBind('_value', updateEvenIfSame:true, updateOnBind:false).of(@)
			.to (hasValue)=>
				if hasValue
					@el.child.input.style('width', 0)
					@el.child.input.raw.scrollLeft = 1e+10
					inputWidth = Math.max(@el.child.input.raw.scrollLeft+@el.child.input.raw.offsetWidth, @el.child.input.raw.scrollWidth) + 2
					labelWidth = if @el.child.label.styleSafe('position') is 'absolute' then @el.child.label.rect.width else 0
				else
					inputWidth = @el.child.placeholder.rect.width
					labelWidth = 0
				
				finalWidth = Math.max(inputWidth, labelWidth)
				@state.width = "#{finalWidth}px"
			
			.updateOn('event:inserted', listenMethod:'on').of(@)
	return


TextField::_attachBindings_value = ()->
	## ==========================================================================
	## Value
	## ==========================================================================
	SimplyBind('value').of(@el.child.input.raw)
		.transformSelf (newValue)=>
			if not @mask
				return newValue
			else
				@mask.setValue(newValue)
				@cursor.current = @selection().start
				newValue = if @mask.valueRaw then @mask.value else ''
				return newValue

		.to('_value').of(@).bothWays()
			.pipe('valueRaw').of(@)
				.transform (value)=> if @mask then @mask.valueRaw else value

	SimplyBind('valueRaw').of(@).to (value)=>
		@state.filled = !!value
		@state.interacted = true if value
		@state.valid = @validate()
		@emit('input')
	
	if @settings.mask
		SimplyBind('value', updateEvenIfSame:true).of(@el.child.input.raw)
			.to (value)=> @_scheduleCursorReset() if @state.focused
	return



TextField::_attachBindings_autocomplete = ()->
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
					.condition (event)=> not DOM(event.target).parentMatching (parent)=> parent is @el.child.innerwrap
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
			@_value = selectedOption.label
			@valueRaw = selectedOption.value if selectedOption.value isnt selectedOption.label
			@dropdown.isOpen = false
			@selection(@el.child.input.raw.value.length)
	return


TextField::_attachBindings_stateTriggers = ()->
	## ==========================================================================
	## State event triggers
	## ========================================================================== 
	SimplyBind('event:mouseenter', listener).of(@el.child.input)
		.to ()=> @state.hovered = true
	
	SimplyBind('event:mouseleave', listener).of(@el.child.input)
		.to ()=> @state.hovered = false

	SimplyBind('event:focus', listener).of(@el.child.input)
		.to ()=> @state.focused = true; if @state.disabled then @blur()
	
	SimplyBind('event:blur', listener).of(@el.child.input)
		.to ()=> @state.typing = @state.focused = false
	
	SimplyBind('event:input', listener).of(@el.child.input)
		.to ()=> @state.typing = true
	
	SimplyBind('event:keydown', listener).of(@el.child.input)
		.to ()=> @cursor.prev = @selection().end

	return





TextField::validate = (providedValue=@_value)-> switch
	when @settings.validWhenRegex and IS.regex(@settings.validWhenRegex) then @settings.validWhenRegex.test(providedValue)
	
	when @settings.validWhenIsChoice and @settings.choices?.length
		matchingOption = @settings.choices.filter (option)-> option.value is providedValue
		return !!matchingOption.length

	when @mask then @mask.validate(providedValue)
	
	else return !!providedValue




TextField::_scheduleCursorReset = ()->
	diffIndex = helpers.getIndexOfFirstDiff(@mask.value, @mask.prev.value)
	currentCursor = @cursor.current
	newCursor = @mask.normalizeCursorPos(currentCursor, @cursor.prev)

	if newCursor isnt currentCursor
		@selection(newCursor)
	return



TextField::selection = (arg)->
	if IS.object(arg)
		start = arg.start
		end = arg.end
	else
		start = arg

	if start?
		end = start if not end or end < start
		@el.child.input.raw.setSelectionRange(start, end)
		return
	else
		return 'start':@el.child.input.raw.selectionStart, 'end':@el.child.input.raw.selectionEnd


TextField::focus = ()->
	@el.child.input.raw.focus()

TextField::blur = ()->
	@el.child.input.raw.blur()















