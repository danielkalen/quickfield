IS = import '@danielkalen/is'
SimplyBind = import '@danielkalen/simplybind'
KEYCODES = import '../../constants/keyCodes'
helpers = import '../../helpers'
extend = import 'smart-extend'
globalDefaults = import '../../field/globalDefaults'
import * as template from './template'
import * as defaults from './defaults'

class Dropdown
	template: template
	defaults: defaults
	_settingFilters: maxHeight: (value)-> IS.number(value)
	
	constructor: (@initialChoices, @field)->
		@isOpen = false
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
		SimplyBind('isOpen', updateOnBind:false).of(@)
			.to (isOpen)=>
				@els.container.state 'isOpen', isOpen		
				@currentHighlighted = null if not isOpen
				if @settings.lockScroll
					if isOpen
						helpers.lockScroll(@els.list)
					else
						helpers.unlockScroll()

				if isOpen
					@list_setMaxHeight()
					@list_scrollToSelected()


		SimplyBind('lastSelected', updateOnBind:false, updateEvenIfSame:true).of(@)
			.to (newChoice, prevChoice)=>
				if @settings.storeSelected
					if @settings.multiple
						if newChoice.selected
							newChoice.selected = false
							helpers.removeItem(@selected, newChoice)
						else
							newChoice.selected = true
							@selected.push(newChoice)
					else
						newChoice.selected = true
						prevChoice?.selected = false unless newChoice is prevChoice
						@selected = newChoice

				@_selectedCallback(newChoice, prevChoice)

				

		SimplyBind('focused', updateOnBind:false).of(@field.state)
			.to (focused)=>
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
							@selectHighlighted()

						when KEYCODES.esc
							event.preventDefault()
							@isOpen = false
	

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

		@els.scrollIndicatorUp.on 'mouseenter', ()=> @list_startScrolling('up')
		@els.scrollIndicatorUp.on 'mouseleave', ()=> @list_stopScrolling()
		@els.scrollIndicatorDown.on 'mouseenter', ()=> @list_startScrolling('down')
		@els.scrollIndicatorDown.on 'mouseleave', ()=> @list_stopScrolling()


	addChoice: (choice)->
		if IS.array(choice)
			@addChoice(item) for item in choice
			return
		
		else if IS.string(choice)
			choice = {label:choice, value:choice}
		
		else if IS.objectPlain(choice)
			choice.value ?= choice.label
			choice.label ?= choice.value

		else return

		choice.index = index = @choices.length
		choice.el = @template.choice.spawn(choices:{props:'title':choice.label}, {relatedInstance:@}).appendTo(@els.list)
		choice.el.children[1].text = choice.label
		choice.visible = true
		choice.selected = false
		choice.unavailable = false
		
		SimplyBind('visible').of(choice)
			.to (visible)=> @visibleChoicesCount += if visible then 1 else -1
			.and.to (visible)=>
				choice.el.state 'visible', visible
				if visible
					@visibleChoices.push(choice)
					@visibleChoices.sort (a,b)-> a.index - b.index
				else
					helpers.removeItem(@visibleChoices, choice)

		SimplyBind('selected', updateOnBind:false).of(choice)
			.to (selected)-> choice.el.state 'selected', selected
		
		SimplyBind('unavailable', updateOnBind:false).of(choice)
			.to (unavailable)-> choice.el.state 'unavailable', unavailable			
			.and.to ()=> @lastSelected = choice
				.condition (unavailable)=> unavailable and @settings.multiple and choice.selected


		SimplyBind('event:click').of(choice.el)
			.to ()=> @lastSelected = choice
		
		SimplyBind('event:mouseenter').of(choice.el)
			.to ()=> @currentHighlighted = choice


		if choice.conditions?.length
			choice.unavailable = true
			choice.allFields = @field.allFields

			helpers.initConditions choice, choice.conditions, ()=>
				choice.unavailable = !helpers.validateConditions(choice.conditions)

		@choices.push(choice)


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

	getLabelOfChoice: (providedValue)->
		matches = @choices.filter (choice)-> providedValue is choice.value
		return matches[0]?.label or ''


	setChoiceFromString: (providedValue, byLabel)->
		targetChoice = @findChoiceAny(providedValue, byLabel)
		if targetChoice and targetChoice isnt @lastSelected
			@lastSelected = targetChoice unless @settings.multiple and helpers.includes(@selected, targetChoice)


	highlightPrev: ()->
		currentIndex = @visibleChoices.indexOf(@currentHighlighted)
		if currentIndex > 0
			@currentHighlighted = @visibleChoices[currentIndex-1]
		else
			@currentHighlighted = @visibleChoices[@visibleChoices.length-1]


	highlightNext: ()->
		currentIndex = @visibleChoices.indexOf(@currentHighlighted)
		if currentIndex < @visibleChoices.length-1
			@currentHighlighted = @visibleChoices[currentIndex+1]
		else
			@currentHighlighted = @visibleChoices[0]


	selectHighlighted: ()->
		if @currentHighlighted
			@lastSelected = @currentHighlighted


	list_setMaxHeight: ()->
		targetMaxHeight = @settings.maxHeight
		clippingParent = @els.container.parentMatching (parent)-> overflow=parent.style('overflowY'); overflow is 'hidden' or overflow is 'scroll'

		if clippingParent
			selfRect = @els.container.rect
			clippingRect = clippingParent.rect
			cutoff = (selfRect.top + @settings.maxHeight) - clippingRect.bottom

			if selfRect.top >= clippingRect.bottom
				console.warn("The dropdown for element '#{@field.ID}' cannot be displayed as it's hidden by the parent overflow")
			else if cutoff > 0
				padding = selfRect.height - @els.list.rect.height
				targetMaxHeight = cutoff - padding
		
		@els.list.style 'maxHeight', targetMaxHeight
		@els.list.style 'minWidth', @field.el.child.innerwrap.width+10


	list_scrollToSelected: ()-> if @selected and not @settings.multiple
		distaneFromTop = @selected.el.raw.offsetTop
		selectedHeight = @selected.el.raw.clientHeight
		
		@els.list.raw.scrollTop = distaneFromTop - selectedHeight*3


	list_startScrolling: (direction)->
		@scrollIntervalID = setInterval ()=>
			@els.list.raw.scrollTop += if direction is 'up' then -20 else 20
		, 50

	list_stopScrolling: ()->
		clearInterval(@scrollIntervalID)
























module.exports = Dropdown