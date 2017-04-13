helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom/src'
SimplyBind = import '@danielkalen/simplybind/debug'

ChoiceField = Object.create(null)
ChoiceField._templates = import ./templates
ChoiceField._defaults = import ./defaults

ChoiceField._construct = ()->
	if not @settings.choices?.length
		throw new Error "Choices were not provided for choice field '#{@settings.label or @ID}'"

	@_value = (if @settings.multiple then [] else null) unless @settings.defaultValue
	@lastSelected = null
	@visibleOptionsCount = 0
	@choices = @settings.choices
	@settings.perGroup = Math.min @settings.perGroup, @choices.length+(if @settings.multiple and @settings.showSelectAll then 1 else 0)
	return

ChoiceField._getValue = ()->
	if not @settings.multiple
		@_value?.value
	else
		@_value.map (choice)-> choice.value


ChoiceField._setValue = (newValue)->
	if not @settings.multiple
		@setOptionFromString(newValue)
	else
		newValue = [].concat(newValue) if not IS.array(newValue)
		@setOptionFromString(value) for value in newValue
	return



ChoiceField._createElements = ()->
	forceOpts = {relatedInstance:@, styleAfterInsert:true}
	@el = @_templates.field.spawn(@settings.templates.field, forceOpts)
	
	if @settings.label
		@el.child.label.text = @settings.label
		@el.state 'hasLabel', on

	choices = @settings.choices
	perGroup = @settings.perGroup
	choiceGroups = Array(Math.ceil(choices.length/perGroup)).fill().map (s,index)-> choices.slice(index*perGroup, index*perGroup+perGroup)
	choiceGroups.forEach (choices, groupIndex)=>
		groupEl = @_templates.choiceGroup.spawn(@settings.templates.choiceGroup, forceOpts).appendTo(@el.child.innerwrap)
		choices.forEach (choice, index)=>
			choice.el = @_templates.choice.spawn(@settings.templates.choice, forceOpts).appendTo(groupEl)
			if choice.icon
				iconEl = @_templates.choiceIcon.spawn(@settings.templates.choiceIcon, forceOpts).insertBefore(choice.child.label)
				iconEl.text = choice.icon
			
			choice.el.index = index
			choice.el.totalIndex = index*groupIndex
			choice.el.prop('title', choice.label)
			choice.el.child.label.text = choice.label
			choice.visible = true
			choice.selected = false
			choice.unavailable = false

	@el.child.innerwrap.raw._quickField = @
	return


listener = listenMethod:'on'
ChoiceField._attachBindings = ()->
	@_attachBindings_elState()
	@_attachBindings_stateTriggers()
	@_attachBindings_display()
	@_attachBindings_value()
	@_attachBindings_choices()
	return


ChoiceField._attachBindings_elState = ()->
	SimplyBind('visible').of(@state).to (visible)=> @el.state 'visible', visible
	SimplyBind('hovered').of(@state).to (hovered)=> @el.state 'hover', hovered
	SimplyBind('filled').of(@state).to (filled)=> @el.state 'filled', filled
	SimplyBind('disabled').of(@state).to (disabled)=> @el.state 'disabled', disabled
	SimplyBind('showError').of(@state).to (showError)=> @el.state 'showError', showError
	SimplyBind('showHelp').of(@state).to (showHelp)=> @el.state 'showHelp', showHelp
	SimplyBind('valid').of(@state).to (valid)=>
		@el.state 'valid', valid
		@el.state 'invalid', !valid
	return

ChoiceField._attachBindings_stateTriggers = ()->
	SimplyBind('event:mouseenter', listener).of(@el)
		.to ()=> @state.hovered = true
	
	SimplyBind('event:mouseleave', listener).of(@el)
		.to ()=> @state.hovered = false
	return


ChoiceField._attachBindings_display = ()->
	SimplyBind('width').of(@state)
		.to (width)=> @el.style {width}

	SimplyBind('showError', updateOnBind:false).of(@state)
		.to (error, prevError)=> switch
			when IS.string(error)			then @el.child.help.text = error
			when IS.string(prevError)		then @el.child.help.text = @settings.help

	SimplyBind('visibleOptionsCount').of(@)
		.to (count)=> @el.state 'hasVisibleOptions', !!count
	return


ChoiceField._attachBindings_value = ()->
	SimplyBind('_value').of(@).to (selected)=>
		@state.filled = !!selected?.length
		@state.interacted = true if @state.filled
		@state.valid = @validate()
	
	SimplyBind('array:_value', updateOnBind:false).of(@)
		.to ()=> @emit('input')


	SimplyBind('lastSelected', {updateOnBind:false, updateEvenIfSame:true}).of(@)
		.to (newChoice, prevChoice)=>
			if @settings.multiple
				if newChoice.selected
					newChoice.selected = false
					helpers.removeItem(@_value, newChoice)
				else
					newChoice.selected = true
					@_value.push(newChoice)
			
			else if newChoice isnt prevChoice
				newChoice.selected = true
				prevChoice?.selected = false
				@_value = newChoice
	return


ChoiceField._attachBindings_choices = ()->	
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





ChoiceField.validate = (providedValue=@_value)->
	if @settings.multiple
		providedValue = [].concat(providedValue) if not IS.array(providedValue)
		if not IS.object(providedValue[0])
			providedValue = providedValue.map (choice)-> choice.value
	else
		providedValue = providedValue.value if IS.object(providedValue)


	switch
		when typeof @settings.validWhenSelected is 'number'
			return providedValue?.length >= @settings.validWhenSelected
		
		when @settings.validWhenIsChoice
			if @settings.multiple
				return helpers.includes(providedValue, @settings.validWhenIsChoice)
			else
				return providedValue is @settings.validWhenIsChoice
		
		else return !!providedValue?.length




ChoiceField.findChoice = (providedValue, byLabel)->
	matches = @choices.filter (option)-> providedValue is (if byLabel then option.label else option.value)
	return matches[0]

ChoiceField.findChoiceAny = (providedValue)->
	@findChoice(providedValue) or @findChoice(providedValue, true)

ChoiceField.setOptionFromString = (providedValue, byLabel)->
	targetOption = @findChoiceAny(providedValue, byLabel)
	if targetOption and targetOption isnt @lastSelected
		@lastSelected = targetOption unless @settings.multiple and helpers.includes(@_value, targetOption)
















module.exports = ChoiceField