Field.choice = choiceField = ()-> @
choiceField:: = Object.create(Field::)
choiceField::_templates = import ./templates
choiceField::_defaults = import ./defaults

choiceField::_construct = ()->
	if not @settings.choices?.length
		throw new Error "Choices were not provided for choice field '#{@settings.label or @ID}'"

	@value = (if @settings.multiple then [] else null) unless @settings.defaultValue
	@lastSelected = null
	@visibleOptionsCount = 0
	@choices = @settings.choices
	@settings.perGroup = Math.min @settings.perGroup, @choices.length+(if @settings.multiple and @settings.showSelectAll then 1 else 0)
	return


choiceField::_createElements = ()->
	forceOpts = {relatedInstance:@, styleAfterInsert:true}
	@els.field = 			@_templates.field.spawn(@settings.templates.field, forceOpts)
	@els.fieldInnerwrap = 	@_templates.fieldInnerwrap.spawn(@settings.templates.fieldInnerwrap, forceOpts)	.appendTo(@els.field)
	@els.label = 			@_templates.label.spawn(@settings.templates.label, forceOpts)					.prependTo(@els.field)
	@els.help = 			@_templates.help.spawn(@settings.templates.help, forceOpts)						
	
	if @settings.label
		@els.label.text(@settings.label)
		@els.field.state 'hasLabel', on

	choices = @settings.choices
	perGroup = @settings.perGroup
	choiceGroups = Array(Math.ceil(choices.length/perGroup)).fill().map (s,index)-> choices.slice(index*perGroup, index*perGroup+perGroup)
	choiceGroups.forEach (choices, groupIndex)=>
		groupEl = @_templates.choiceGroup.spawn(@settings.templates.choiceGroup, forceOpts).appendTo(@els.fieldInnerwrap)
		choices.forEach (choice, index)=>
			choice.el = @_templates.choice.spawn(@settings.templates.choice, forceOpts).appendTo(groupEl)
			choice.labelEl = @_templates.choiceLabel.spawn(@settings.templates.choiceLabel, forceOpts).appendTo(choice.el)
			choice.iconEl = @_templates.choiceIcon.spawn(@settings.templates.choiceIcon, forceOpts).insertBefore(choice.labelEl) if choice.icon
			choice.el.index = index
			choice.el.totalIndex = index*groupIndex
			choice.el.prop('title', choice.label)
			choice.el.children[1].text choice.label
			choice.iconEl.append choice.label if choice.icon
			choice.visible = true
			choice.selected = false
			choice.unavailable = false

	@els.help.appendTo(@els.fieldInnerwrap)
	@els.fieldInnerwrap.raw._quickField = @
	return


choiceField::_attachBindings = ()->
	listener = listenMethod:'on'
	## ==========================================================================
	## Element state
	## ========================================================================== 
	SimplyBind('visible').of(@state).to (visible)=> @els.field.state 'visible', visible
	SimplyBind('hovered').of(@state).to (hovered)=> @els.field.state 'hover', hovered
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
	SimplyBind('event:mouseenter', listener).of(@els.field)
		.to ()=> @state.hovered = true
	
	SimplyBind('event:mouseleave', listener).of(@els.field)
		.to ()=> @state.hovered = false


	## ==========================================================================
	## Display
	## ========================================================================== 
	SimplyBind('width').of(@state)
		.to (width)=> @els.field.style {width}

	SimplyBind('showError', updateOnBind:false).of(@state)
		.to (error, prevError)=> switch
			when IS.string(error)			then @els.help.text(error)
			when IS.string(prevError)		then @els.help.text(@settings.help)

	SimplyBind('visibleOptionsCount').of(@)
		.to (count)=> @els.field.state 'hasVisibleOptions', !!count

	## ==========================================================================
	## Value
	## ==========================================================================
	SimplyBind('value').of(@).to (value)=>
		@state.filled = !!value?.length
		@state.interacted = true if @state.filled
		@state.valid = @validate()
	
	SimplyBind('array:value', updateOnBind:false).of(@)
		.to ()=> @emit('input')


	SimplyBind('lastSelected', {updateOnBind:false, updateEvenIfSame:true}).of(@)
		.to (newChoice, prevChoice)=>
			if @settings.multiple
				if newChoice.selected
					newChoice.selected = false
					helpers.removeItem(@value, newChoice.value)
				else
					newChoice.selected = true
					@value.push(newChoice.value)
			
			else if newChoice isnt prevChoice
				newChoice.selected = true
				prevChoice?.selected = false
				@value = newChoice.value
	
	
	@choices.forEach (choice)=>	
		SimplyBind('visible').of(choice)
			.to (visible)-> choice.el.state 'visible', visible
			.and.to (visible)=> @visibleOptionsCount += if visible then 1 else -1

		SimplyBind('selected', updateOnBind:false).of(choice)
			.to (selected)-> choice.el.state 'selected', selected
		
		SimplyBind('unavailable', updateOnBind:false).of(choice)
			.to (unavailable)-> choice.el.state 'unavailable', unavailable
			.and.to ()=> @lastSelected = choice
				.condition (unavailable)=> unavailable and @settings.multiple and choice.selected

		SimplyBind('event:click', listenMethod:'on').of(choice.el)
			.to ()=> @lastSelected = choice


		if choice.conditions?.length
			choice.unavailable = true
			choice.allFields = @allFields

			helpers.initConditions choice, choice.conditions, ()=>
				choice.unavailable = !helpers.validateConditions(choice.conditions)
			
	

	return





choiceField::validate = (providedValue=@value)-> switch
	when typeof @settings.validWhenSelected is 'number' then providedValue?.length >= @settings.validWhenSelected
	
	when @settings.validWhenIsChoice
		matchingOption = @choices.filter (choice)-> choice.value is providedValue
		return !!matchingOption.length
	
	else return !!providedValue?.length


















