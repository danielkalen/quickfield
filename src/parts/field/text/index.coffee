Dropdown = import '../../components/dropdown'
Mask = import '../../components/mask'
KEYCODES = import '../../constants/keyCodes'
helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom'
SimplyBind = import '@danielkalen/simplybind'
import template,* as templates from './template'
import * as defaults from './defaults'

class TextField extends import '../'
	template: template
	templates: templates
	defaults: defaults

	constructor: ()->
		super
		@_value ?= ''
		@state.typing = false
		@cursor = prev:0, current:0
		if not @settings.mask then @settings.mask = switch @settings.keyboard
			when 'number','phone','tel' then '1+'
			when 'email' then '*+@*+.aa+'
			
		@mask = new Mask(@settings.mask, @settings.maskPlaceholder, @settings.maskGuide) if @settings.mask
		@_createElements()
		@_attachBindings()
		@_constructorEnd()


	_getValue: ()->
		return if @mask and @mask.valueRaw then @mask.value else @_value

	_setValue: (newValue)->
		@_value = String(newValue) if IS.string(newValue) or IS.number(newValue)


	_createElements: ()->
		globalOpts = {relatedInstance:@}
		@el = @template.spawn(@settings.templates.default, globalOpts)

		if @settings.choices
			@dropdown = new Dropdown(@settings.choices, @)
			@dropdown.appendTo(@el.child.innerwrap)

		if @settings.icon
			iconChar = @settings.icon if IS.string(@settings.icon)
			templates.icon.spawn(@settings.templates.icon, globalOpts, iconChar).insertBefore(@el.child.input)

		if @settings.checkmark
			templates.checkmark.spawn(@settings.templates.checkmark, globalOpts).insertAfter(@el.child.input)
		
		@el.child.input.prop 'type', switch @settings.keyboard
			when 'number','tel','phone' then 'tel'
			when 'password' then 'password'
			when 'url' then 'url'
			# when 'email' then 'email'
			else 'text'

		@el.state 'hasLabel', @settings.label
		@el.child.innerwrap.raw._quickField = @el.child.input.raw._quickField = @
		return


	_attachBindings: ()->
		@_attachBindings_elState()
		@_attachBindings_display()
		@_attachBindings_display_autoWidth()
		@_attachBindings_value()
		@_attachBindings_autocomplete()
		@_attachBindings_stateTriggers()
		return


	_attachBindings_elState: ()->
		SimplyBind('visible').of(@state).to 	(visible)=> @el.state 'visible', visible
		SimplyBind('hovered').of(@state).to 	(hovered)=> @el.state 'hover', hovered
		SimplyBind('focused').of(@state).to 	(focused)=> @el.state 'focus', focused
		SimplyBind('filled').of(@state).to 		(filled)=> @el.state 'filled', filled
		SimplyBind('disabled').of(@state).to 	(disabled)=> @el.state 'disabled', disabled
		SimplyBind('showLabel').of(@state).to 	(showLabel)=> @el.state 'showLabel', showLabel
		SimplyBind('showError').of(@state).to 	(showError)=> @el.state 'showError', showError
		SimplyBind('showHelp').of(@state).to 	(showHelp)=> @el.state 'showHelp', showHelp
		SimplyBind('valid').of(@state).to (valid)=>
			@el.state 'valid', valid
			@el.state 'invalid', !valid
		return


	_attachBindings_display: ()->
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

		SimplyBind('placeholder').of(@state)
			.to('text').of(@el.child.placeholder)
				.transform (placeholder)=> switch
					when placeholder is true and @settings.label then @settings.label
					when IS.string(placeholder) then placeholder
					else ''

		SimplyBind('disabled', updateOnBind:@state.disabled).of(@state)
			.to (disabled, prev)=> if @settings.checkmark
				if disabled or (not disabled and prev?) then setTimeout ()=>
					@el.child.checkmark_mask1.recalcStyle()
					@el.child.checkmark_mask2.recalcStyle()
					@el.child.checkmark_patch.recalcStyle()
					# @el.child.checkmark.recalcStyle(true)

		SimplyBind('margin').of(@state).to @el.style.bind(@el, 'margin')
		SimplyBind('padding').of(@state).to @el.style.bind(@el, 'padding')
		
		return


	_attachBindings_display_autoWidth: ()->
		SimplyBind('width', updateEvenIfSame:true).of(@state)
			.to (width)=> (if @settings.autoWidth then @el.child.input else @el).style {width}

		if @settings.autoWidth
			SimplyBind('_value', updateEvenIfSame:true, updateOnBind:false).of(@)
				.to('width').of(@state)
					.transform ()=> "#{@_getInputAutoWidth()}px"
					.updateOn('event:inserted').of(@)
		return



	_attachBindings_value: ()->
		SimplyBind('value').of(@el.child.input.raw)
			.transformSelf (newValue='')=>
				if not @mask
					return newValue
				else
					@mask.setValue(newValue)
					@cursor.current = @selection().start
					newValue = if @mask.valueRaw then @mask.value else ''
					return newValue

		SimplyBind('_value').of(@)
			.to('value').of(@el.child.input.raw).bothWays()
			.and.to('valueRaw').of(@)
				.transform (value)=> if @mask then @mask.valueRaw else value


		SimplyBind('valueRaw').of(@).to (value)=>
			@state.filled = !!value
			@state.interacted = true if value
			@state.valid = @validate()
			@emit('input', value)
		

		SimplyBind('event:keydown').of(@el.child.input)
			.to (event)=>
				@emit('submit') if event.keyCode is KEYCODES.enter
				@emit("key-#{event.keyCode}")
		
		if @settings.mask
			SimplyBind('value', updateEvenIfSame:true).of(@el.child.input.raw)
				.to (value)=> @_scheduleCursorReset() if @state.focused

			# SimplyBind('event:keydown').of(@el.child.input)
			# 	.to (event)=> console.log(keycode(event))
			# SimplyBind('event:keyup').of(@el.child.input)
			# 	.to (event)=> console.warn(keycode(event))
			SimplyBind('event:keydown').of(@el.child.input)
				.to (event)=>
					current = @selection().start
					@selection('start':current+1, 'end':current+1)

				.condition (event)=>
					currentSelection = @selection()
					
					@_value and
					currentSelection.start is currentSelection.end and
					event.keyCode isnt KEYCODES.delete and
					not KEYCODES.anyArrow(event.keyCode) and
					@mask.isLiteralAtPos(currentSelection.start) and
					not @mask.isRepeatableAtPos(currentSelection.start)
			


		return



	_attachBindings_autocomplete: ()->
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
				for choice in @dropdown.choices
					shouldBeVisible = if not value then true else helpers.fuzzyMatch(value, choice.value)
					choice.visible = shouldBeVisible if choice.visible isnt shouldBeVisible

				if @dropdown.isOpen and not value
					@dropdown.isOpen = false
				return

			@dropdown.onSelected (selectedOption)=>
				@_value = selectedOption.label
				@valueRaw = selectedOption.value if selectedOption.value isnt selectedOption.label
				@dropdown.isOpen = false
				@selection(@el.child.input.raw.value.length)
		return


	_attachBindings_stateTriggers: ()->
		SimplyBind('event:mouseenter').of(@el.child.input)
			.to ()=> @state.hovered = true
		
		SimplyBind('event:mouseleave').of(@el.child.input)
			.to ()=> @state.hovered = false

		SimplyBind('event:focus').of(@el.child.input)
			.to ()=> @state.focused = true; if @state.disabled then @blur()
		
		SimplyBind('event:blur').of(@el.child.input)
			.to ()=> @state.typing = @state.focused = false
		
		SimplyBind('event:input').of(@el.child.input)
			.to ()=> @state.typing = true
		
		SimplyBind('event:keydown').of(@el.child.input)
			.to ()=> @cursor.prev = @selection().end

		return



	_scheduleCursorReset: ()->
		diffIndex = helpers.getIndexOfFirstDiff(@mask.value, @mask.prev.value)
		currentCursor = @cursor.current
		newCursor = @mask.normalizeCursorPos(currentCursor, @cursor.prev)

		if newCursor isnt currentCursor
			@selection(newCursor)
		return

	_setValueIfNotSet: ()->
		if @el.child.input.raw.value isnt @_value
			@el.child.input.raw.value = @_value
		return



	_getInputAutoWidth: ()->
		if @_value
			@_setValueIfNotSet()
			@el.child.input.style('width', 0)
			@el.child.input.raw.scrollLeft = 1e+10
			inputWidth = Math.max(@el.child.input.raw.scrollLeft+@el.child.input.raw.offsetWidth, @el.child.input.raw.scrollWidth) + 2
			labelWidth = if @settings.label and @el.child.label.styleSafe('position') is 'absolute' then @el.child.label.rect.width else 0
		else
			inputWidth = @el.child.placeholder.rect.width
			labelWidth = 0
		
		return Math.min @_getMaxWidth(), Math.max(inputWidth, labelWidth)



	_getMaxWidth: ()->
		if typeof @settings.maxWidth is 'number'
			maxWidth = @settings.maxWidth
		
		else if	typeof @settings.maxWidth is 'string'
			maxWidth = parseFloat(@settings.maxWidth)

			if helpers.includes(@settings.maxWidth, '%')
				if parent=@el.parent
					parentWidth = parent.styleParsed('width') - parent.styleParsed('paddingLeft') - parent.styleParsed('paddingRight') - 2
					maxWidth = parentWidth * (maxWidth/100)
				else
					maxWidth = 0

		return maxWidth or Infinity




	validate: (providedValue=@_value)-> switch
		when @settings.validWhenRegex and IS.regex(@settings.validWhenRegex) then @settings.validWhenRegex.test(providedValue)
		
		when @settings.validWhenIsChoice and @settings.choices?.length
			matchingOption = @settings.choices.filter (choice)-> choice.value is providedValue
			return !!matchingOption.length

		when @mask then @mask.validate(providedValue)
		
		else return if @settings.required then !!providedValue else true



	selection: (arg)->
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


	focus: ()->
		@el.child.input.raw.focus()

	blur: ()->
		@el.child.input.raw.blur()















module.exports = TextField