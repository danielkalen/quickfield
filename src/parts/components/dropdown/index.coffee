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
	@els.container = @_templates.container.spawn(@settings.templates.container, forceOpts)
	@els.list = @_templates.list.spawn(@settings.templates.list, forceOpts).appendTo(@els.container)
	@els.help = @_templates.help.spawn(@settings.templates.help, forceOpts).appendTo(@els.container)

	@options.forEach (option)=>
		option.el = @_templates.option.spawn(options:{props:'title':option.label}, forceOpts).appendTo(@els.list)
		option.el.children[1].text option.label
		option.visible = true
		option.selected = false
		option.unavailable = false

	return



Dropdown::_attachBindings = ()->
	# if @field.type is 'select'
	# 	SimplyBind('event:click', listenMethod:'on').of(@field.els.input)
	# 		.to ()=>
	# 			@isOpen = true
	# 			SimplyBind('event:click').of(document)
	# 				.once.to ()=> @isOpen = false
	# 				.condition (event)=> not DOM(event.target).parentsMatching (parent)=> parent is @field.els.input

	SimplyBind('help').of(@settings)
		.to('textContent').of(@els.help.raw)
		.and.to (showHelp)=> @els.help.state 'showHelp', showHelp

	SimplyBind('visibleOptionsCount').of(@)
		.to (count)=> @els.container.state 'hasVisibleOptions', !!count

	SimplyBind('isOpen', updateOnBind:false).of(@)
		.to (isOpen)=> @els.container.state 'isOpen', isOpen		
		.and.to ()=> @currentHighlighted = null
		.and.to (isOpen)=> if isOpen
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
			@els.list.style 'minWidth', parseFloat(@field.els.input.style('width'))+10


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
					prevOption?.selected = false
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
				@field.els.input.on 'keydown.dropdownNav', (event)=> if @isOpen
					switch event.keyCode
						when KEYCODES.up
							event.preventDefault()
							currentIndex = @visibleOptions.indexOf(@currentHighlighted)
							if currentIndex > 0
								@currentHighlighted = @visibleOptions[currentIndex-1]
							else
								@currentHighlighted = @visibleOptions[@visibleOptions.length-1]

						when KEYCODES.down
							event.preventDefault()
							currentIndex = @visibleOptions.indexOf(@currentHighlighted)
							if currentIndex < @visibleOptions.length-1
								@currentHighlighted = @visibleOptions[currentIndex+1]
							else
								@currentHighlighted = @visibleOptions[0]

						when KEYCODES.enter
							event.preventDefault()
							if @currentHighlighted
								@lastSelected = @currentHighlighted

						when KEYCODES.esc
							event.preventDefault()
							@isOpen = false




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


		if option.conditions?.length
			option.unavailable = true
			option.allFields = @field.allFields

			helpers.initConditions option, option.conditions, ()=>
				option.unavailable = !helpers.validateConditions(option.conditions)


Dropdown::appendTo = (target)->
	@els.container.appendTo(target)


Dropdown::onSelected = (callback)->
	@selectedCallback = callback














