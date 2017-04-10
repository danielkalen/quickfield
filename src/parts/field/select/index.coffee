Dropdown = import '../../components/dropdown'
helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom/src'
SimplyBind = import '@danielkalen/simplybind/debug'

SelectField = ()-> @
SelectField:: = Object.create(Field::)
SelectField::_templates = import ./templates
SelectField::_defaults = import ./defaults

SelectField::_construct = ()->
	if not @settings.choices?.length
		throw new Error "Choices were not provided for choice field '#{@settings.label or @ID}'"
	
	@state.showHelp = if @settings.alwaysShowHelp then @settings.help else false
	@settings.dropdownOptions.multiple = @settings.multiple
	@settings.dropdownOptions.help = 'Tip: press ESC to close this menu' if @settings.multiple
	@dropdown = new Dropdown(@settings.choices, @)
	@_setValue(@_value) if @_value # True when @settings.defaultValue
	return

SelectField::_getValue = ()->
	if not @settings.multiple
		@dropdown.selected?.value
	else
		@dropdown.selected.map (choice)-> choice.value


SelectField::_setValue = (newValue)->
	if not @settings.multiple
		@dropdown.setOptionFromString(newValue)
	else
		newValue = [].concat(newValue) if not IS.array(newValue)
		@dropdown.setOptionFromString(value) for value in newValue
	return


SelectField::_createElements = ()->
	forceOpts = {relatedInstance:@, styleAfterInsert:true}
	@el = @_templates.field.spawn(@settings.templates.field, forceOpts)
	@dropdown.appendTo(@el.child.innerwrap)
	@el.child.placeholder.insertBefore(@el.child.input)

	if @settings.label
		@el.child.label.text(@settings.label)
		@el.state 'hasLabel', on

	@el.child.innerwrap.raw._quickField = @el.child.input.raw._quickField = @
	return


listener = listenMethod:'on'
SelectField::_attachBindings = ()->
	@_attachBindings_elState()
	@_attachBindings_display()
	@_attachBindings_display_autoWidth()
	@_attachBindings_value()
	@_attachBindings_dropdown()
	@_attachBindings_stateTriggers()
	return


SelectField::_attachBindings_elState = ()->
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


SelectField::_attachBindings_display = ()->
	## ==========================================================================
	## Display
	## ========================================================================== 
	SimplyBind('showHelp').of(@state)
		.to('textContent').of(@el.child.input.raw)
			.transform (message)-> if message then message else ''
			.condition ()=> not @state.showError

	SimplyBind('showError', updateOnBind:false).of(@state)
		.to (error, prevError)=> switch
			when IS.string(error)			then @el.child.input.text(error)
			when IS.string(prevError)		then @el.child.input.text(@state.showError)

	SimplyBind('placeholder').of(@settings)
		.to('textContent').of(@el.child.placeholder.raw)
			.transform (placeholder)=> switch
				when placeholder is true and @settings.label then @settings.label
				when IS.string(placeholder) then placeholder
				else ''
	return

SelectField::_attachBindings_display_autoWidth = ()->
	# ==== Autowidth =================================================================================
	SimplyBind('width', updateEvenIfSame:true).of(@state)
		.to (width)=> (if @settings.autoWidth then @el.child.input else @el).style {width}

	if @settings.autoWidth then setTimeout ()=>
		SimplyBind('valueLabel', updateEvenIfSame:true, updateOnBind:false).of(@)
			.to (hasValue)=>
				if hasValue
					@el.child.input.style('width', 0)
					inputWidth = @el.child.input.raw.scrollWidth + 2
					labelWidth = if @el.child.label.styleSafe('position') is 'absolute' then @el.child.label.rect.width else 0
				else
					inputWidth = @el.child.placeholder.rect.width
					labelWidth = 0
				
				finalWidth = Math.max(inputWidth, labelWidth)
				@state.width = "#{finalWidth}px"
						
			.updateOn('event:inserted', listenMethod:'on').of(@)
	return


SelectField::_attachBindings_value = ()->
	## ==========================================================================
	## Value
	## ==========================================================================
	SimplyBind('array:selected').of(@dropdown)
		.to('_value').of(@)
		.and.to('valueLabel').of(@)
			.transform (selected)=> if selected
				if @settings.multiple
					selected.map((choice)-> choice.label).join(', ')
				else
					selected.label

	SimplyBind('valueLabel').of(@)
		.to('textContent').of(@el.child.input.raw)
			.transform (label)=> if @settings.labelFormat then @settings.labelFormat(label) else label
		.and.to (value)=>
			@state.filled = !!value
			@state.interacted = true if value
			@state.valid = @validate()
	
	SimplyBind('array:selected', updateOnBind:false).of(@)
		.to ()=> @emit('input')
	return


SelectField::_attachBindings_dropdown = ()->
	## ==========================================================================
	## Dropdown
	## ==========================================================================
	SimplyBind('event:click', listener).of(@el.child.input).to ()=> unless @state.disabled
		@dropdown.isOpen = true
		
		clickListener = 
		SimplyBind('event:click').of(document)
			.once.to ()=> @dropdown.isOpen = false
			.condition (event)=> not DOM(event.target).parentMatching (parent)=> parent is @el.child.innerwrap
		
		escListener = 
		SimplyBind('event:keydown').of(document)
			.once.to ()=> @dropdown.isOpen = false
			.condition (event)-> event.keyCode is 27

		SimplyBind('isOpen', updateOnBind:false).of(@dropdown)
			.once.to ()-> clickListener.unBind(); escListener.unBind();
			.condition (isOpen)-> not isOpen



	SimplyBind('focused', updateOnBind:false).of(@state).to (focused)=>
		if not focused
			@el.child.input.off 'keydown.dropdownTrigger'
		else
			triggeringKeycodes = [32, 37, 38, 39, 40]
			
			@el.child.input.on 'keydown.dropdownTrigger', (event)=>
				if helpers.includes(triggeringKeycodes, event.keyCode) and not @dropdown.isOpen
					@dropdown.isOpen = true
					@dropdown.currentHighlighted = @dropdown.lastSelected if @dropdown.lastSelected?.selected
					event.preventDefault()

				else if event.keyCode is 9 and @dropdown.isOpen # Prevent tab key
					event.preventDefault()


	@dropdown.onSelected (selectedOption)=>
		@dropdown.isOpen = false unless @settings.multiple
	return


SelectField::_attachBindings_stateTriggers = ()->
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
		matchingChoice = @settings.choices.filter (option)-> option.value is providedValue
		return !!matchingChoice.length

	when @settings.multiple and -1 > @settings.validWhenChoseMin < Infinity
		providedValue.length >= @settings.validWhenChoseMin

	when @settings.multiple then providedValue.length

	else !!providedValue



SelectField::focus = ()->
	@el.child.input.raw.focus()

SelectField::blur = ()->
	@el.child.input.raw.blur()
















module.exports = SelectField