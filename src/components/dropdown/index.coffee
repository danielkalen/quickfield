IS = import '../../checks'
SimplyBind = import '@danielkalen/simplybind'
KEYCODES = import '../../constants/keyCodes'
helpers = import '../../helpers'
Condition = import '../condition'
extend = import 'smart-extend'
DOM = import 'quickdom'
globalDefaults = import '../../field/globalDefaults'
import * as template from './template'
import * as defaults from './defaults'

class Dropdown
	template: template
	defaults: defaults
	_settingFilters: maxHeight: (value)-> IS.number(value)
	
	constructor: (@initialChoices, @field)->
		@isOpen = false
		@typeBuffer = ''
		@settings = extend.deep.clone.filter(@_settingFilters)(globalDefaults, @defaults, @field.settings.dropdown)
		@selected = if @settings.multiple then [] else null
		@lastSelected = null
		@choices = []
		@currentHighlighted = null
		@visibleChoicesCount = 0
		@visibleChoices = []
		@els = {}
		@_selectedCallback = helpers.noop
		
		@_createElements()
		@_attachBindings()
		return @


	_createElements: ()->
		globalOpts = {relatedInstance:@}
		@els.container = @template.default.spawn(@settings.templates.default, extend({passStateToChildren:false}, globalOpts))
		@els.list = @template.list.spawn(@settings.templates.list, globalOpts).appendTo(@els.container)
		@els.help = @template.help.spawn(@settings.templates.help, globalOpts).appendTo(@els.container)
		@els.scrollIndicatorUp = @template.scrollIndicatorUp.spawn(@settings.templates.scrollIndicatorUp, globalOpts).appendTo(@els.container)
		@els.scrollIndicatorDown = @template.scrollIndicatorDown.spawn(@settings.templates.scrollIndicatorDown, globalOpts).appendTo(@els.container)

		@list = new List(@)
		@addChoice(choice) for choice in @initialChoices
		return



	_attachBindings: ()->
		@_attachBindings_elState()
		@_attachBindings_display()
		@_attachBindings_scrollIndicators()


	_attachBindings_elState: ()->
		SimplyBind('help').of(@settings)
			.to('text').of(@els.help)
			.and.to (showHelp)=> @els.help.state 'showHelp', showHelp

		SimplyBind('visibleChoicesCount').of(@)
			.to (count)=> @els.container.state 'hasVisibleChoices', !!count
	
		SimplyBind('currentHighlighted').of(@)
			.to (current, prev)=>
				prev.el.state('hover', off) if prev
				current.el.state('hover', on) if current


	_attachBindings_display: ()->
		SimplyBind('isOpen', updateOnBind:false).of(@).to (isOpen)=>
			@els.container.state 'isOpen', isOpen		
			@currentHighlighted = null if not isOpen
	
			if @settings.lockScroll
				if isOpen
					helpers.lockScroll(@els.list)
				else
					helpers.unlockScroll()

			if isOpen
				@list.calcDisplay()
				@list.scrollToChoice(@selected) if @selected and not @settings.multiple
			else
				@list.setTranslate(0)


		SimplyBind('lastSelected', updateOnBind:false, updateEvenIfSame:true).of(@)
			.to (newChoice, prevChoice)=> @_selectedCallback(newChoice, prevChoice)


		SimplyBind('focused', updateOnBind:false).of(@field.state).to (focused)=>
			if not focused
				@field.el.child.input.off 'keydown.dropdownNav'
			else
				@field.el.child.input.on 'keydown.dropdownNav', (event)=> if @isOpen then switch event.keyCode
					when KEYCODES.up
						event.preventDefault()
						@highlightPrev()

					when KEYCODES.down
						event.preventDefault()
						@highlightNext()

					when KEYCODES.enter
						event.preventDefault()
						@lastSelected = @currentHighlighted if @currentHighlighted

					when KEYCODES.esc
						event.preventDefault()
						@isOpen = false

		
		return if not @settings.typeBuffer
		SimplyBind('focused', updateOnBind:false).of(@field.state).to (focused)=>
			if not focused
				DOM(document).off 'keypress.dropdownTypeBuffer'
			else
				DOM(document).on 'keypress.dropdownTypeBuffer', (event)=> if @isOpen
					event.preventDefault()
					return if not KEYCODES.anyPrintable(event.keyCode)
					@typeBuffer += event.key


		SimplyBind('typeBuffer', updateOnBind:false).of(@)
			.to ()=>
				clearTimeout(@typeBufferTimeout)
				@typeBufferTimeout = setTimeout ()=>
					@typeBuffer = ''
				,1500
			
			.and.to (buffer)=> if buffer
				for choice in @visibleChoices
					if helpers.startsWith(buffer, choice.label)
						@currentHighlighted = choice
						@list.scrollToChoice(choice) unless @list.choiceInView(choice)
						return
				return


	_attachBindings_scrollIndicators: ()->
		SimplyBind('scrollTop', updateEvenIfSame:true).of(@els.list.raw)
			.to (scrollTop)=>
				showTopIndicator = scrollTop > 0
				showBottomIndicator = @els.list.raw.scrollHeight - @els.list.raw.clientHeight > scrollTop

				@els.scrollIndicatorUp.state 'visible', showTopIndicator
				@els.scrollIndicatorDown.state 'visible', showBottomIndicator

			.condition ()=> @isOpen and not @settings.help and @els.list.raw.scrollHeight isnt @els.list.raw.clientHeight and @els.list.raw.clientHeight >= 100
			.updateOn('event:scroll').of(@els.list.raw)
			.updateOn('isOpen').of(@)

		@els.scrollIndicatorUp.on 'mouseenter', ()=> @list.startScrolling('up')
		@els.scrollIndicatorUp.on 'mouseleave', ()=> @list.stopScrolling()
		@els.scrollIndicatorDown.on 'mouseenter', ()=> @list.startScrolling('down')
		@els.scrollIndicatorDown.on 'mouseleave', ()=> @list.stopScrolling()


	addChoice: (config)->
		if IS.array(config)
			@addChoice(item) for item in config
			return
		
		else if IS.string(config)
			config = {label:config, value:config}
		
		else if IS.objectPlain(config)
			config.value ?= config.label
			config.label ?= config.value

		else return

		newChoice = new Choice(@, config, @list, @choices.length)
		@choices.push(newChoice)
		return newChoice


	appendTo: (target)->
		@els.container.appendTo(target)


	onSelected: (callback)->
		@_selectedCallback = callback


	findChoice: (providedValue, byLabel)->
		matches = @choices.filter (choice)-> switch
			when IS.object(providedValue) then providedValue is choice
			when byLabel then providedValue is choice.label
			else providedValue is choice.value

		return matches[0]


	findChoiceAny: (providedValue)->
		@findChoice(providedValue) or @findChoice(providedValue, true)


	highlightPrev: ()->
		currentIndex = @visibleChoices.indexOf(@currentHighlighted)
		
		if currentIndex > 0
			@currentHighlighted = choice = @visibleChoices[currentIndex-1]
			@list.scrollUp(choice) unless @list.choiceInView(choice)
		else
			@currentHighlighted = choice = @visibleChoices[@visibleChoices.length-1]
			@list.scrollToChoice(choice,1) unless @list.choiceInView(choice)



	highlightNext: ()->
		currentIndex = @visibleChoices.indexOf(@currentHighlighted)
		
		if currentIndex < @visibleChoices.length-1
			@currentHighlighted = choice = @visibleChoices[currentIndex+1]
			@list.scrollDown(choice) unless @list.choiceInView(choice)
		else
			@currentHighlighted = choice = @visibleChoices[0]
			@list.scrollToChoice(choice,1) unless @list.choiceInView(choice)







class List
	constructor: (@dropdown)->
		{@els, @field, @settings} = @dropdown
		@el = @els.list
		@container = @els.container

	calcDisplay: ()->
		windowHeight = window.innerHeight
		translation = @translation or 0
		clippingParent = @container.parentMatching (parent)-> overflow=parent.style('overflowY'); overflow is 'hidden' or overflow is 'scroll'
		scrollHeight = @el.raw.scrollHeight or Infinity
		selfRect = extend.clone @container.rect
		padding = selfRect.height - @el.height
		height = Math.min scrollHeight, @settings.maxHeight, window.innerHeight-40
		selfRect.bottom = selfRect.top + height

		if clippingParent
			clippingRect = clippingParent.rect
			bottomCutoff = selfRect.bottom - clippingRect.bottom
			topCutoff = clippingRect.top - selfRect.top
			isBottomCutoff = bottomCutoff > 0
			isTopCutoff = topCutoff > 0

			if selfRect.top >= clippingRect.bottom or clippingRect.top >= selfRect.bottom
				console.warn("The dropdown for element '#{@field.ID}' cannot be displayed as it's hidden by the parent overflow")
			
			else if isBottomCutoff or isTopCutoff
				needsNewHeight = true
				
				if selfRect.top - bottomCutoff > clippingRect.top and not isTopCutoff
					translation = bottomCutoff
					selfRect.top -= translation
					selfRect.bottom -= translation
					cutoff = clippingRect.top - selfRect.top

				else if selfRect.bottom - topCutoff < clippingRect.bottom
					translation = topCutoff * -1
					selfRect.top += translation
					selfRect.bottom += translation
					cutoff = selfRect.bottom - clippingRect.bottom


				if needsNewHeight = cutoff > 0
					height = cutoff - padding

		
		windowCutoff = (selfRect.top + height) - windowHeight
		
		if windowCutoff > 0 and height < windowHeight
			translation += windowCutoff+10

		@setDimensions(height, @field.el.child.innerwrap.width+10)
		@setTranslate(translation)


	setDimensions: (height, width)->
		@el.style 'maxHeight', height if height?
		@el.style 'minWidth', width if width?

	
	setTranslate: (translation)->
		@translation = translation
		translation *= -1
		@container.style 'transform', "translateY(#{translation}px)"


	scrollToChoice: (choice,offset=3)->
		distaneFromTop = choice.el.raw.offsetTop
		selectedHeight = choice.el.height
		
		@el.raw.scrollTop = distaneFromTop - selectedHeight*offset

	scrollDown: (choice)->
		@el.raw.scrollTop += choice.el.height

	scrollUp: (choice)->
		@el.raw.scrollTop -= choice.el.height

	choiceInView: (choice)=>
		choiceRect = choice.el.rect
		listRect = @el.rect
		upPadding = if @els.scrollIndicatorUp.state('visible') then parseFloat @els.scrollIndicatorUp.styleSafe('height',true)
		downPadding = if @els.scrollIndicatorDown.state('visible') then parseFloat @els.scrollIndicatorDown.styleSafe('height',true)

		choiceRect.bottom <= listRect.bottom-downPadding and
		choiceRect.top >= listRect.top+upPadding


	startScrolling: (direction)->
		@scrollIntervalID = setInterval ()=>
			@el.raw.scrollTop += if direction is 'up' then -20 else 20
		, 50


	stopScrolling: ()->
		clearInterval(@scrollIntervalID)





class Choice
	constructor: (@dropdown, @settings, @list, @index)->
		{@label, @value, @conditions} = @settings
		@label ?= @value
		@value ?= @label
		@field = @dropdown.field
		@el = @dropdown.template.choice.spawn(null, {relatedInstance:@dropdown}).appendTo(@list.el)
		@el.children[1].text = @label
		@visible = true
		@selected = false
		@unavailable = false
		
		@_attachBindings()

		if @conditions?.length
			@unavailable = true
			@allFields = @field.allFields

			Condition.init @, @conditions, ()=>
				@unavailable = !Condition.validate(@conditions)


	_attachBindings: ()-> do ()=>
		SimplyBind('visible').of(@).to (visible,prev)=>
			@dropdown.visibleChoicesCount += if visible then 1 else -1
			@el.state 'visible', visible
			if visible
				@dropdown.visibleChoices.push(@)
				if IS.defined(prev) # indicates state has changed
					@dropdown.visibleChoices.sort (a,b)-> a.index - b.index
			else
				helpers.removeItem(@dropdown.visibleChoices, @)

		SimplyBind('selected', updateOnBind:false).of(@)
			.to (selected)=> @el.state 'selected', selected
		
		SimplyBind('unavailable', updateOnBind:false).of(@)
			.to (unavailable)=> @el.state 'unavailable', unavailable			
			.and.to (unavailable)=> @toggle(off, true) if unavailable

		SimplyBind('event:click').of(@el)
			.to ()=> @dropdown.lastSelected = @
		
		SimplyBind('event:mousedown').of(@el)
			.to (event)=> event.preventDefault(); event.stopPropagation()
		
		SimplyBind('event:mouseenter').of(@el)
			.to ()=> @dropdown.currentHighlighted = @


	toggle: (newValue, unavailable)->
		prevState = @selected
		newState = if IS.defined(newValue) then newValue else !@selected

		if not newState
			if @dropdown.settings.multiple and prevState
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
				@field._value?.toggle(off)
				@field._value = @

			@field.lastSelected = @













module.exports = Dropdown
module.exports.Choice = Choice