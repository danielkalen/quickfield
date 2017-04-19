Dropdown = import '../../components/dropdown'
helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom/src'
extend = import 'smart-extend'
SimplyBind = import '@danielkalen/simplybind/debug'
TextField = import '../text'

SelectField = Object.create(null)
SelectField._templates = import ./templates
SelectField._defaults = import ./defaults
extend.keys([
	'_getMaxWidth'
	'_attachBindings_elState'
	'_attachBindings_display'
	# '_attachBindings_display_autoWidth'
	'focus'
	'blur'
])(SelectField, TextField)

SelectField._construct = ()->
	if not @settings.choices?.length
		throw new Error "Choices were not provided for choice field '#{@settings.label or @ID}'"
	
	@settings.dropdownOptions.multiple = @settings.multiple
	@settings.dropdownOptions.help = 'Tip: press ESC to close this menu' if @settings.multiple
	@dropdown = new Dropdown(@settings.choices, @)
	@_setValue(@_value) if @_value # True when @settings.defaultValue
	return

SelectField._getValue = ()->
	if not @settings.multiple
		@dropdown.selected?.value
	else
		@dropdown.selected.map (choice)-> choice.value


SelectField._setValue = (newValue)->
	if not @settings.multiple
		@dropdown.setOptionFromString(newValue)
	else
		newValue = [].concat(newValue) if not IS.array(newValue)
		@dropdown.setOptionFromString(value) for value in newValue
	return


SelectField._createElements = ()->
	forceOpts = {relatedInstance:@, styleAfterInsert:true}
	@el = @_templates.field.spawn(@settings.templates.field, forceOpts)
	@dropdown.appendTo(@el.child.innerwrap)
	@el.child.placeholder.insertBefore(@el.child.input)

	if @settings.label
		@el.child.label.text = @settings.label
		@el.state 'hasLabel', on

	@el.child.innerwrap.raw._quickField = @el.child.input.raw._quickField = @
	return


SelectField._attachBindings = ()->
	@_attachBindings_elState()
	@_attachBindings_value()
	@_attachBindings_display()
	@_attachBindings_display_autoWidth()
	@_attachBindings_dropdown()
	@_attachBindings_stateTriggers()
	return


SelectField._attachBindings_display_autoWidth = ()->
	SimplyBind('width', updateEvenIfSame:true).of(@state)
		.to (width)=> (if @settings.autoWidth then @el.child.input else @el).style {width}

	if @settings.autoWidth
		SimplyBind('valueLabel', updateEvenIfSame:true, updateOnBind:false).of(@)
			.to('width').of(@state)
				.transform ()=> @_getInputAutoWidth()
				.updateOn('event:inserted').of(@)
	return


SelectField._getInputAutoWidth = ()->
	if @valueLabel
		@el.child.input.style('width', 0)
		inputWidth = @el.child.input.raw.scrollWidth + 2
		labelWidth = if @el.child.label.styleSafe('position') is 'absolute' then @el.child.label.rect.width else 0
	else
		inputWidth = @el.child.placeholder.rect.width
		labelWidth = 0
	
	return Math.max(inputWidth, labelWidth)



SelectField._attachBindings_value = ()->
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
		.to('text').of(@el.child.input)
			.transform (label)=> if @settings.labelFormat then @settings.labelFormat(label) else label
		.and.to (value)=>
			@state.filled = !!value
			@state.interacted = true if value
			@state.valid = @validate()
	
	SimplyBind('array:selected', updateOnBind:false).of(@)
		.to ()=> @emit('input')
	return


SelectField._attachBindings_dropdown = ()->
	## ==========================================================================
	## Dropdown
	## ==========================================================================
	SimplyBind('event:click').of(@el.child.input).to ()=> unless @state.disabled
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


SelectField._attachBindings_stateTriggers = ()->
	## ==========================================================================
	## State event triggers
	## ========================================================================== 
	SimplyBind('event:mouseenter').of(@el.child.input)
		.to ()=> @state.hovered = true
	
	SimplyBind('event:mouseleave').of(@el.child.input)
		.to ()=> @state.hovered = false

	SimplyBind('event:focus').of(@el.child.input)
		.to ()=> @state.focused = true; if @state.disabled then @blur()
	
	SimplyBind('event:blur').of(@el.child.input)
		.to ()=> @state.focused = false
	
	return





SelectField.validate = (providedValue=@value)-> switch
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



SelectField.focus = ()->
	@el.child.input.raw.focus()

SelectField.blur = ()->
	@el.child.input.raw.blur()
















module.exports = SelectField