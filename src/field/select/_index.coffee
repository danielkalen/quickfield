Dropdown = import '../../components/dropdown'
helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom'
extend = import 'smart-extend'
SimplyBind = import '@danielkalen/simplybind'
TextField = import '../text'
import template,* as templates from './template'
import * as defaults from './defaults'

class SelectField extends import '../'
	template: template
	templates: templates
	defaults: defaults
	coreValueProp: 'value'

	constructor: ()->
		super		
		@settings.dropdown.multiple = @settings.multiple
		@settings.dropdown.help ?= 'Tip: press ESC to close this menu' if @settings.multiple
		@_value = if @settings.multiple then [] else null
		@dropdown = new Dropdown(@settings.choices, @)
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
		forceOpts = {relatedInstance:@}
		@el = @template.spawn(@settings.templates.default, forceOpts)
		@dropdown.appendTo(@el.child.innerwrap)
		@el.child.placeholder.insertBefore(@el.child.input)

		if @settings.label
			@el.child.label.text = @settings.label
			@el.state 'hasLabel', on

		@el.child.innerwrap.raw._quickField = @el.child.input.raw._quickField = @
		return


	_attachBindings: ()->
		@_attachBindings_elState()
		@_attachBindings_value()
		@_attachBindings_display()
		@_attachBindings_display_autoWidth()
		@_attachBindings_dropdown()
		@_attachBindings_stateTriggers()
		return


	_attachBindings_display_autoWidth: ()->
		SimplyBind('width', updateEvenIfSame:true).of(@state)
			.to (width)=> (if @settings.autoWidth then @el.child.input else @el).style {width}
			.transform (width)=> if @state.isMobile then (@settings.mobileWidth or width) else width
			.updateOn('isMobile').of(@state)

		if @settings.autoWidth
			SimplyBind('valueLabel', updateEvenIfSame:true, updateOnBind:false).of(@)
				.to('width').of(@state)
					.transform ()=> @_getInputAutoWidth()
					.updateOn('event:inserted').of(@)

		return


	_getInputAutoWidth: ()->
		if @valueLabel
			@el.child.input.style('width', 0)
			inputWidth = @el.child.input.raw.scrollWidth + 2
			labelWidth = if @el.child.label.styleSafe('position') is 'absolute' then @el.child.label.rect.width else 0
		else
			inputWidth = @el.child.placeholder.rect.width
			labelWidth = 0
		
		return Math.max(inputWidth, labelWidth)



	_attachBindings_value: ()->
		SimplyBind('array:_value').of(@)
			.to (selected)=>
				@state.filled = !!selected?.length
				@state.interacted = true if @state.filled
				@state.valid = @validate(null, true)
				@emit('input', @value)
			
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
				@state.valid = @validate(null, true)

		return


	_attachBindings_dropdown: ()->
		SimplyBind('event:click').of(@el.child.input).to (event)=> unless @state.disabled or @dropdown.choices.length is 0
			@dropdown.isOpen = true
			@focus()
			
			DOM(document).on 'click.dropdown', (event)=>
				return if DOM(event.target).parentMatching((parent)=> parent is @el.child.innerwrap)
				@dropdown.isOpen = false
			, true
			
			escListener = 
			SimplyBind('event:keydown').of(document)
				.once.to ()=> @dropdown.isOpen = false
				.condition (event)-> event.keyCode is 27

			SimplyBind('isOpen', updateOnBind:false).of(@dropdown)
				.once.to ()-> escListener.unBind(); DOM(document).off('click.dropdown')
				.condition (isOpen)-> not isOpen


		SimplyBind('event:click').of(@el.child.innerwrap)
			.to (event)=> event.stopPropagation(); @el.child.input.emitPrivate 'click'
			.condition (event)=> event.target is @el.child.innerwrap.raw



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


		@dropdown.onSelected (choice)=>
			@value = choice unless choice.selected and not @settings.multiple
			@dropdown.isOpen = false unless @settings.multiple

		return


	_attachBindings_stateTriggers: ()->
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



	_validate: (providedValue)->
		if @settings.validWhenRegex and IS.regex(@settings.validWhenRegex) then switch
			when @settings.multiple then return false if not do ()=>
				return false if providedValue.length is 0
				validChoices = providedValue.filter (choice)=> @settings.validWhenRegex.test(choice)
				
				if @settings.validWhenChoseMin is Infinity or not IS.number(@settings.validWhenChoseMin)
					validChoices.length is providedValue.length
				else
					validChoices.length >= @settings.validWhenChoseMin

			else
				return false if not @settings.validWhenRegex.test(providedValue)
		

		if @settings.validWhenIsChoice and @dropdown.choices?.length
			matchingChoice = @dropdown.choices.filter (option)-> option.value is providedValue
			return false if not !!matchingChoice.length

		if @settings.multiple and -1 > @settings.validWhenChoseMin < Infinity
			return false if not providedValue.length >= @settings.validWhenChoseMin

		if @settings.multiple and @settings.required
			return false if not providedValue.length

		return true


	addChoice: (choice)->
		@dropdown.addChoice(choice)

	setChoice: (choice)->
		if IS.object(choice) and choice instanceof Dropdown.Choice
			choice.toggle()

		else if choice = @dropdown.findChoiceAny(choice)
			choice.toggle(on)


extend.keys([
	'_getMaxWidth'
	'_attachBindings_elState'
	'_attachBindings_display'
	'focus'
	'blur'
])(SelectField::, TextField::)















module.exports = SelectField