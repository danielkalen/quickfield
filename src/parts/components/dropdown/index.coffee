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
	
	constructor: (@initialOptions, @field)->
		@isOpen = false
		@settings = extend.deep.clone.filter(@_settingFilters)(globalDefaults, @defaults, @field.settings.dropdownOptions)
		@selected = if @settings.multiple then [] else null
		@lastSelected = null
		@options = []
		@currentHighlighted = null
		@visibleOptionsCount = 0
		@visibleOptions = []
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

		@addOption(option) for option in @initialOptions
		return



	_attachBindings: ()->
		SimplyBind('help').of(@settings)
			.to('text').of(@els.help)
			.and.to (showHelp)=> @els.help.state 'showHelp', showHelp

		SimplyBind('visibleOptionsCount').of(@)
			.to (count)=> @els.container.state 'hasVisibleOptions', !!count

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
			.to (newOption, prevOption)=>
				if @settings.storeSelected
					if @settings.multiple
						if newOption.selected
							newOption.selected = false
							helpers.removeItem(@selected, newOption)
						else
							newOption.selected = true
							@selected.push(newOption)
					else
						newOption.selected = true
						prevOption?.selected = false unless newOption is prevOption
						@selected = newOption

				@_selectedCallback(newOption, prevOption)



		SimplyBind('currentHighlighted').of(@)
			.to (current, prev)=>
				prev.el.state('hover', off) if prev
				current.el.state('hover', on) if current
				

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




	addOption: (option)->
		if IS.array(option)
			@addOption(item) for item in option
			return
		
		else if IS.string(option)
			option = {label:option, value:option}
		
		else if IS.objectPlain(option)
			option.value ?= option.label
			option.label ?= option.value

		else return

		option.index = index = @options.length
		option.el = @template.option.spawn(options:{props:'title':option.label}, {relatedInstance:@}).appendTo(@els.list)
		option.el.children[1].text = option.label
		option.visible = true
		option.selected = false
		option.unavailable = false
		
		SimplyBind('visible').of(option)
			.to (visible)=> @visibleOptionsCount += if visible then 1 else -1
			.and.to (visible)=>
				option.el.state 'visible', visible
				if visible
					@visibleOptions.push(option)
					@visibleOptions.sort (a,b)-> a.index - b.index
				else
					helpers.removeItem(@visibleOptions, option)

		SimplyBind('selected', updateOnBind:false).of(option)
			.to (selected)-> option.el.state 'selected', selected
		
		SimplyBind('unavailable', updateOnBind:false).of(option)
			.to (unavailable)-> option.el.state 'unavailable', unavailable			
			.and.to ()=> @lastSelected = option
				.condition (unavailable)=> unavailable and @settings.multiple and option.selected


		SimplyBind('event:click').of(option.el)
			.to ()=> @lastSelected = option
		
		SimplyBind('event:mouseenter').of(option.el)
			.to ()=> @currentHighlighted = option


		if option.conditions?.length
			option.unavailable = true
			option.allFields = @field.allFields

			helpers.initConditions option, option.conditions, ()=>
				option.unavailable = !helpers.validateConditions(option.conditions)

		@options.push(option)


	appendTo: (target)->
		@els.container.appendTo(target)


	onSelected: (callback)->
		@_selectedCallback = callback


	findOption: (providedValue, byLabel)->
		matches = @options.filter (option)-> switch
			when IS.object(providedValue) then providedValue is option
			when byLabel then providedValue is option.label
			else providedValue is option.value

		return matches[0]

	findOptionAny: (providedValue)->
		@findOption(providedValue) or @findOption(providedValue, true)

	getLabelOfOption: (providedValue)->
		matches = @options.filter (option)-> providedValue is option.value
		return matches[0]?.label or ''


	setOptionFromString: (providedValue, byLabel)->
		targetOption = @findOptionAny(providedValue, byLabel)
		if targetOption and targetOption isnt @lastSelected
			@lastSelected = targetOption unless @settings.multiple and helpers.includes(@selected, targetOption)


	highlightPrev: ()->
		currentIndex = @visibleOptions.indexOf(@currentHighlighted)
		if currentIndex > 0
			@currentHighlighted = @visibleOptions[currentIndex-1]
		else
			@currentHighlighted = @visibleOptions[@visibleOptions.length-1]


	highlightNext: ()->
		currentIndex = @visibleOptions.indexOf(@currentHighlighted)
		if currentIndex < @visibleOptions.length-1
			@currentHighlighted = @visibleOptions[currentIndex+1]
		else
			@currentHighlighted = @visibleOptions[0]


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