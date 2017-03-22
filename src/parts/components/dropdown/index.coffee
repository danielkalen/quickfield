Dropdown = (@options, @field)->
	@isOpen = false
	@settings = extend.deep.clone.keys(@_defaults).filter(@_settingFilters)(@_defaults, @field.settings.dropdownOptions)
	@selected = if @settings.multiple then [] else null
	@lastSelected = null
	@currentHighlighted = null
	@visibleOptionsCount = 0
	@visibleOptions = []
	@els = {}
	
	@_createElements()
	@_attachBindings()
	return @

Dropdown::_templates = import './templates'
Dropdown::_defaults = import './defaults'
Dropdown::_settingFilters = maxHeight: (value)-> IS.number(value)

Dropdown::_createElements = ()->
	forceOpts = {relatedInstance:@, styleAfterInsert:true}
	@els.container = @_templates.container.spawn(@settings.templates.container, extend({passStateToChildren:false}, forceOpts))
	@els.list = @_templates.list.spawn(@settings.templates.list, forceOpts).appendTo(@els.container)
	@els.help = @_templates.help.spawn(@settings.templates.help, forceOpts).appendTo(@els.container)
	@els.scrollIndicatorUp = @_templates.scrollIndicatorUp.spawn(@settings.templates.scrollIndicatorUp, forceOpts).appendTo(@els.container)
	@els.scrollIndicatorDown = @_templates.scrollIndicatorDown.spawn(@settings.templates.scrollIndicatorDown, forceOpts).appendTo(@els.container)

	@options.forEach (option)=>
		option.el = @_templates.option.spawn(options:{props:'title':option.label}, forceOpts).appendTo(@els.list)
		option.el.children[1].text option.label
		option.visible = true
		option.selected = false
		option.unavailable = false

	return



Dropdown::_attachBindings = ()->
	SimplyBind('help').of(@settings)
		.to('textContent').of(@els.help.raw)
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

			@selectedCallback(newOption, prevOption)


	SimplyBind('currentHighlighted').of(@)
		.to (current, prev)=>
			prev.el.state('hover', off) if prev
			current.el.state('hover', on) if current
			

	SimplyBind('focused').of(@field.state)
		.to (focused)=>
			if not focused
				@field.els.input.off 'keydown.dropdownNav'
			else
				@field.els.input.on 'keydown.dropdownNav', (event)=> if @isOpen then switch event.keyCode
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


	@options.forEach (option, index)=>	
		option.index = index
		
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


		SimplyBind('event:click', listenMethod:'on').of(option.el)
			.to ()=> @lastSelected = option
		
		SimplyBind('event:mouseenter', listenMethod:'on').of(option.el)
			.to ()=> @currentHighlighted = option


		if option.conditions?.length
			option.unavailable = true
			option.allFields = @field.allFields

			helpers.initConditions option, option.conditions, ()=>
				option.unavailable = !helpers.validateConditions(option.conditions)




Dropdown::appendTo = (target)->
	@els.container.appendTo(target)


Dropdown::onSelected = (callback)->
	@selectedCallback = callback


Dropdown::findOption = (providedValue, byLabel)->
	matches = @options.filter (option)-> providedValue is (if byLabel then option.label else option.value)
	return if @settings.multiple then matches else matches[0]


Dropdown::getLabelOfOption = (providedValue)->
	matches = @options.filter (option)-> providedValue is option.value
	return matches[0]?.label or ''



Dropdown::highlightPrev = ()->
	currentIndex = @visibleOptions.indexOf(@currentHighlighted)
	if currentIndex > 0
		@currentHighlighted = @visibleOptions[currentIndex-1]
	else
		@currentHighlighted = @visibleOptions[@visibleOptions.length-1]


Dropdown::highlightNext = ()->
	currentIndex = @visibleOptions.indexOf(@currentHighlighted)
	if currentIndex < @visibleOptions.length-1
		@currentHighlighted = @visibleOptions[currentIndex+1]
	else
		@currentHighlighted = @visibleOptions[0]


Dropdown::selectHighlighted = ()->
	if @currentHighlighted
		@lastSelected = @currentHighlighted


Dropdown::list_setMaxHeight = ()->
	targetMaxHeight = @settings.maxHeight
	clippingParent = @els.container.parentMatching (parent)-> parent.style('overflow') isnt 'visible'

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
	@els.list.style 'minWidth', parseFloat(@field.els.fieldInnerwrap.style('width'))+10


Dropdown::list_scrollToSelected = ()-> if @selected and not @settings.multiple
	distaneFromTop = @selected.el.raw.offsetTop
	selectedHeight = @selected.el.raw.clientHeight
	
	@els.list.raw.scrollTop = distaneFromTop - selectedHeight*3


Dropdown::list_startScrolling = (direction)->
	@scrollIntervalID = setInterval ()=>
		@els.list.raw.scrollTop += if direction is 'up' then -20 else 20
	, 50

Dropdown::list_stopScrolling = ()->
	clearInterval(@scrollIntervalID)
























