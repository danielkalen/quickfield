helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom'
SimplyBind = import '@danielkalen/simplybind'
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
		if not @settings.multiple
			@setChoiceFromString(newValue)
		else
			newValue = [].concat(newValue) if not IS.array(newValue)
			@setChoiceFromString(value) for value in newValue
		return



	_createElements: ()->
		forceOpts = {relatedInstance:@}
		@el = @template.spawn(@settings.templates.default, forceOpts)

		choices = @settings.choices
		perGroup = @settings.perGroup
		choiceGroups = Array(Math.ceil(choices.length/perGroup)).fill().map (s,index)-> choices.slice(index*perGroup, index*perGroup+perGroup)
		choiceGroups.forEach (choices, groupIndex)=>
			groupEl = templates.choiceGroup.spawn(@settings.templates.choiceGroup, forceOpts).appendTo(@el.child.innerwrap)
			choices.forEach (choice, index)=>
				choice.el = templates.choice.spawn(@settings.templates.choice, forceOpts).appendTo(groupEl)
				if choice.icon
					iconEl = templates.choiceIcon.spawn(@settings.templates.choiceIcon, forceOpts).insertBefore(choice.child.label)
					iconEl.text = choice.icon
				
				choice.index = index
				choice.el.index = index
				choice.el.totalIndex = index*groupIndex
				choice.el.prop('title', choice.label)
				choice.el.child.label.text = choice.label
				choice.visible = true
				choice.selected = false
				choice.disabled ?= false
				choice.unavailable = false

		@el.child.innerwrap.raw._quickField = @
		return


	_attachBindings: ()->
		@_attachBindings_elState()
		@_attachBindings_stateTriggers()
		@_attachBindings_display()
		@_attachBindings_value()
		@_attachBindings_choices()
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
		
		SimplyBind('showError', updateOnBind:false).of(@state)
			.to (showError)=>
				if showError
					@state.help = @state.error if @state.error and IS.string(@state.error)
				else
					@state.help = @state.help

		SimplyBind('label').of(@state)
			.to('text').of(@el.child.label)
			.and.to('showLabel').of(@state)

		SimplyBind('help').of(@state)
			.to('html').of(@el.child.help)
			.and.to('showHelp').of(@state)

		SimplyBind('visibleChoicesCount').of(@)
			.to (count)=> @el.state 'hasVisibleChoices', !!count

		SimplyBind('margin').of(@state).to @el.style.bind(@el, 'margin')
		SimplyBind('padding').of(@state).to @el.style.bind(@el, 'padding')
		return


	_attachBindings_value: ()->
		SimplyBind('_value').of(@).to (selected)=>
			@state.filled = !!selected?.length
			@state.interacted = true if @state.filled
			@state.valid = @validate()
		
		SimplyBind('array:_value', updateOnBind:false).of(@)
			.to ()=> @emit('input', @value)


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


	_attachBindings_choices: ()->	
		@choices.forEach (choice)=>	
			SimplyBind('visible').of(choice)
				.to (visible)-> choice.el.state 'visible', visible
				.and.to (visible)=> @visibleChoicesCount += if visible then 1 else -1

			SimplyBind('selected', updateOnBind:false).of(choice)
				.to (selected)-> choice.el.state 'selected', selected

			SimplyBind('disabled', updateOnBind:false).of(choice)
				.to (disabled)-> choice.el.state 'disabled', disabled
			
			SimplyBind('unavailable', updateOnBind:false).of(choice)
				.to (unavailable)-> choice.el.state 'unavailable', unavailable
				.and.to ()=> @lastSelected = choice
					.condition (unavailable)=> unavailable and @settings.multiple and choice.selected

			SimplyBind('event:click').of(choice.el)
				.to ()=> @lastSelected = choice
				.condition ()-> not choice.disabled


			if choice.conditions?.length
				choice.unavailable = true
				choice.allFields = @allFields

				helpers.initConditions choice, choice.conditions, ()=>
					choice.unavailable = !helpers.validateConditions(choice.conditions)
				
		return





	validate: (providedValue=@_value)->
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
			
			else return if @settings.required then !!providedValue?.length else true


	findChoice: (providedValue, byLabel)->
		matches = @choices.filter (choice)-> switch
			when IS.object(providedValue) then providedValue is choice
			when byLabel then providedValue is choice.label
			else providedValue is choice.value

		return matches[0]


	findChoiceAny: (providedValue)->
		@findChoice(providedValue) or @findChoice(providedValue, true)

	setChoiceFromString: (providedValue, byLabel)->
		targetChoice = @findChoiceAny(providedValue, byLabel)
		if targetChoice and targetChoice isnt @lastSelected
			@lastSelected = targetChoice unless @settings.multiple and helpers.includes(@_value, targetChoice)
















module.exports = ChoiceField