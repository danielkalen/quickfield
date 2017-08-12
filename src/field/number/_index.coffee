helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom'
extend = import 'smart-extend'
SimplyBind = import '@danielkalen/simplybind'
TextField = import '../text'
KEYCODES = import '../../constants/keyCodes'
import template,* as templates from './template'
import * as defaults from './defaults'

class NumberField extends import '../'
	template: template
	templates: templates
	defaults: defaults

	constructor: ()->
		super
		@_value ?= ''
		@_value ||= @settings.minValue if @settings.enforce and @settings.minValue and @settings.minValue isnt -Infinity
		@settings.step = Number(@settings.step) or 1
		@state.typing = false
		@cursor = prev:0, current:0

		@_createElements()
		@_attachBindings()
		@_constructorEnd()
	
	_getValue: ()->
		return Number(@_value) or 0

	_setValue: (newValue)->
		# newValue = Number(newValue)
		# @_value = newValue unless isNaN(newValue)
		@_value = @_normalizeValue(newValue, @settings.enforce)

	_createElements: ()->
		globalOpts = {relatedInstance:@}
		@el = @template.spawn(@settings.templates.defaults, globalOpts)

		if @settings.buttons
			templates.buttons.spawn(@settings.templates.buttons, globalOpts).insertAfter(@el.child.input)

		@el.state 'hasLabel', @settings.label
		@el.child.innerwrap.raw._quickField = @el.childf.input.raw._quickField = @
		return


	_attachBindings: ()->
		@_attachBindings_elState()
		@_attachBindings_display()
		@_attachBindings_display_autoWidth()
		@_attachBindings_value()
		@_attachBindings_stateTriggers()
		@_attachBindings_stepEvents()
		return


	_attachBindings_value: ()->
		input = @el.child.input.raw
		
		SimplyBind('event:input').of(input).to ()=>
			@cursor.prev = @cursor.current
			@cursor.current = @selection().end
			prevValue = @_value
			newValue = input.value
			if newValue is '-'
				newValue = -1
				selectNumberPart = true

			@value = newValue
			if @state.focused
				if selectNumberPart
					@selection(1,2)
				else
					@selection(@cursor.current + (String(@_value).length-newValue.length))

		SimplyBind('_value').of(@)
			.to('value').of(input)
			.and.to (value)=>
				@state.filled = !!String(value)
				@state.interacted = true if String(value)
				@state.valid = @validate(null, true)
				@emit('input', value)


		SimplyBind('event:blur').of(input).to ()=> unless @settings.enforce
			value = Number(@_value) or 0
			@_value = '' if value is 0 or (not @state.interacted and value is @settings.minValue)
		
		return


	_attachBindings_stepEvents: ()->
		SimplyBind('event:keydown').of(@el.child.input).to (event)=> switch event.keyCode
			when KEYCODES.up
				event.preventDefault()
				@stepUp()
			when KEYCODES.down
				event.preventDefault()
				@stepDown()
		

		if @settings.buttons
			stopPropagation = (event)-> event.preventDefault(); event.stopPropagation()
			SimplyBind('event:click').of(@el.child.stepUp).to(@stepUp.bind(@)).and.to stopPropagation
			SimplyBind('event:click').of(@el.child.stepDown).to(@stepDown.bind(@)).and.to stopPropagation

		return
	
	_setValueIfNotSet: ()->
		if Number(@el.child.input.raw.value) isnt @_value
			@el.child.input.raw.value = @_value

	_normalizeValue: (value, enforce)->
		value = if value then (parseFloat(value) or 0) else 0
		if value % @settings.step and enforce
			if value < @settings.step
				value = @settings.step
			else
				value = @_roundToNearest(value, @settings.step)
		
		value = @settings.minValue if value < @settings.minValue
		value = @settings.maxValue if value > @settings.maxValue

		return value

	_roundToNearest: (value, target)->
		multiplier = if target < 1 then 1/target else 1
		target *= multiplier
		value *= multiplier
		value = (Math.ceil(value / target) * target)/multiplier
		return value

	stepUp: ()->
		rounded = @_roundToNearest(@_value, @settings.step)
		newValue = Math.min(rounded+@settings.step, @_value+@settings.step)
		@value = @_roundToNearest(newValue, @settings.step)

	stepDown: ()->
		rounded = @_roundToNearest(@_value, @settings.step)
		newValue = Math.max(rounded-@settings.step, @_value-@settings.step)
		@value = @_roundToNearest(newValue, @settings.step)


extend.keys([
	'_getMaxWidth'
	'_attachBindings_elState'
	'_attachBindings_display'
	'_attachBindings_display_autoWidth'
	'_attachBindings_stateTriggers'
	'_getInputAutoWidth'
	'_scheduleCursorReset'
	'_validate'
	'selection'
	'focus'
	'blur'
])(NumberField::, TextField::)






















module.exports = NumberField