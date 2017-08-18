helpers = import '../../helpers'
IS = import '../../checks'
DOM = import 'quickdom'
SimplyBind = import '@danielkalen/simplybind'
Condition = import '../../components/condition'
import template,* as templates from './template'
import * as defaults from './defaults'

class ChoiceField extends import '../'
	template: template
	templates: templates
	defaults: defaults

	constructor: ()->
		super
		if not @settings.choices?.length
			throw new Error "Choices were not provided for choice field '#{@settings.label or @ID}'"

		@_value = if @settings.multiple then [] else null
		@lastSelected = null
		@visibleChoicesCount = 0
		@choices = @settings.choices
		@settings.validWhenSelected = 1 if @settings.validWhenSelected is true
		@settings.perGroup = Math.min @settings.perGroup, @choices.length+(if @settings.multiple and @settings.showSelectAll then 1 else 0)
		@_createElements()
		@_attachBindings()
		@_constructorEnd()


	_getValue: ()->
		if not @settings.multiple
			@_value?.value
		else
			@_value.map (choice)-> choice.value


	_setValue: (newValue)->
		if not @settings.multiple or not IS.array(newValue)
			@setChoice(newValue)
		else
			@setChoice(value) for value in newValue
		return


	_createElements: ()->
		globalOpts = {relatedInstance:@}
		@el = @template.spawn(@settings.templates.default, globalOpts)
		@choices = []

		choices = @settings.choices
		perGroup = @settings.perGroup
		choiceGroups = Array(Math.ceil(choices.length/perGroup)).fill().map (s,index)-> choices.slice(index*perGroup, index*perGroup+perGroup)
		choiceGroups.forEach (choices, groupIndex)=>
			groupEl = @templates.choiceGroup.spawn(@settings.templates.choiceGroup, globalOpts).appendTo(@el.child.innerwrap)
			
			choices.forEach (choice, index)=>
				@choices.push new Choice(@, choice, index, groupIndex, groupEl)

		@el.child.innerwrap.raw._quickField = @
		return


	_attachBindings: ()->
		@_attachBindings_elState()
		@_attachBindings_stateTriggers()
		@_attachBindings_display()
		@_attachBindings_value()
		choice._attachBindings() for choice in @choices
		return


	_attachBindings_elState: ()->
		SimplyBind('visible').of(@state).to 	(visible)=> @el.state 'visible', visible
		SimplyBind('hovered').of(@state).to 	(hovered)=> @el.state 'hovered', hovered
		SimplyBind('filled').of(@state).to 		(filled)=> @el.state 'filled', filled
		SimplyBind('disabled').of(@state).to 	(disabled)=> @el.state 'disabled', disabled
		SimplyBind('showLabel').of(@state).to 	(showLabel)=> @el.state 'showLabel', showLabel
		SimplyBind('showError').of(@state).to 	(showError)=> @el.state 'showError', showError
		SimplyBind('showHelp').of(@state).to 	(showHelp)=> @el.state 'showHelp', showHelp
		SimplyBind('valid').of(@state).to (valid)=>
			@el.state 'valid', valid
			@el.state 'invalid', !valid
		return


	_attachBindings_stateTriggers: ()->
		SimplyBind('event:mouseenter').of(@el)
			.to ()=> @state.hovered = true
		
		SimplyBind('event:mouseleave').of(@el)
			.to ()=> @state.hovered = false
		return


	_attachBindings_display: ()->
		SimplyBind('width').of(@state)
			.to (width)=> @el.style('width',width).state 'definedWidth', width isnt 'auto'
			.transform (width)=> if @state.isMobile then (@settings.mobileWidth or width) else width
			.updateOn('isMobile').of(@state)

		SimplyBind('visibleChoicesCount').of(@)
			.to (count)=> @el.state 'hasVisibleChoices', !!count
		return


	_attachBindings_value: ()->
		SimplyBind('_value').of(@).to (selected)=>
			@state.filled = !!selected?.length
			@state.interacted = true if @state.filled
			@state.valid = @validate(null, true)
		
		SimplyBind('array:_value', updateOnBind:false).of(@)
			.to ()=> @emit('input', @value)

		return



	_validate: (providedValue)->
		if @settings.multiple
			providedValue = [providedValue] if not IS.array(providedValue)
			if providedValue.length and not IS.object(providedValue[0])
				providedValue = providedValue.map (choice)-> choice.value
		else
			providedValue = providedValue.value if IS.object(providedValue)


		if IS.number(@settings.validWhenSelected)
			return false if not (providedValue?.length >= @settings.validWhenSelected)
		
		if @settings.validWhenIsChoice
			if @settings.multiple
				return false if not helpers.includes(providedValue, @settings.validWhenIsChoice)
			else
				return false if providedValue isnt @settings.validWhenIsChoice
		
		return true


	findChoice: (providedValue, byLabel)->
		matches = @choices.filter (choice)-> switch
			when IS.object(providedValue) then providedValue is choice
			when byLabel then providedValue is choice.label
			else providedValue is choice.value

		return matches[0]


	findChoiceAny: (providedValue)->
		@findChoice(providedValue) or @findChoice(providedValue, true)


	setChoice: (choice)->
		if IS.object(choice) and choice instanceof Choice
			choice.toggle()

		else if choice = @findChoiceAny(choice)
			choice.toggle(on)





class Choice
	constructor: (@field, @settings, @index, groupIndex, groupEl)->
		globalOpts = {relatedInstance:@field}
		{@label, @value, @conditions} = @settings
		@label ?= @value
		@value ?= @label
		@el = @field.templates.choice.spawn(@field.settings.templates.choice, globalOpts).appendTo(groupEl)
		
		if @icon
			iconEl = templates.choiceIcon.spawn(@field.settings.templates.choiceIcon, globalOpts).insertBefore(@el.child.label)
			iconEl.text = @icon
		
		@el.index = @index
		@el.totalIndex = @index*groupIndex
		@el.prop('title', @label)
		@el.child.label.text = @label
		@visible = true
		@selected = false
		@disabled = @settings.disabled or false
		@unavailable = false
		
		if @conditions?.length
			@unavailable = true
			@allFields = @field.allFields

			Condition.init @, @conditions, ()=>
				@unavailable = !Condition.validate(@conditions)


	_attachBindings: ()-> do ()=>
		SimplyBind('visible').of(@)
			.to (visible)=> @el.state 'visible', visible
			.and.to (visible)=> @field.visibleChoicesCount += if visible then 1 else -1

		SimplyBind('selected', updateOnBind:false).of(@)
			.to (selected)=> @el.state 'selected', selected

		SimplyBind('disabled', updateOnBind:false).of(@)
			.to (disabled)=> @el.state 'disabled', disabled
		
		SimplyBind('unavailable', updateOnBind:false).of(@)
			.to (unavailable)=> @el.state 'unavailable', unavailable
			.and.to (unavailable)=> @toggle(off, true) if unavailable

		SimplyBind('event:click').of(@el)
			.to ()=> @field.value = @
			.condition ()=> not @disabled


	toggle: (newValue, unavailable)->
		prevState = @selected
		newState = if IS.defined(newValue) then newValue else !@selected

		if not newState
			if @field.settings.multiple and prevState
				@selected = newState
				helpers.removeItem(@field._value, @)
			
			else
				@selected = newState if IS.defined(newValue)
				@field._value = null if unavailable

		else
			@selected = newState
			if @field.settings.multiple
				@field._value.push(@)
			else
				@field._value?.toggle(off) unless @field._value is @
				@field._value = @

			@field.lastSelected = @





module.exports = ChoiceField