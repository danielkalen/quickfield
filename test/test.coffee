mocha.setup('tdd')
mocha.slow(400)
mocha.timeout(12000)
mocha.bail() unless window.location.hostname
expect = chai.expect
should = chai.should()
sandbox$ = sandbox = null
restartSandbox = ()->
	sandbox$?.remove()
	sandbox$ = $('<div id="sandbox" style="border:1px solid; padding:20px; box-sizing:border-box"></div>').appendTo(document.body)
	sandbox = sandbox$[0]



suite "QuickField", ()->
	setup(restartSandbox)

	test "", ()->
		window.field = Field({type:'text', label:'Licence Plate', mask:'AAA-111', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Dollar', mask:'$1+', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Date', mask:'11/11/1111', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Literal', mask:'My N\\ame is a+ K\\alen', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Optionals', mask:'aaa[AAA]111', maskPlaceholder:'_'}).appendTo(sandbox)
		# window.field = Field({type:'text', label:'My Nice Field', mask:'AAA-111'}).appendTo(sandbox)
		window.field = Field({type:'text', label:'My options field', options:['apple', 'banana', 'orange']}).appendTo(sandbox)















HTMLElement::onEvent = (eventName, callback)->
	if @addEventListener
		@addEventListener(eventName, callback)
	else
		@attachEvent("on#{eventName}", callback)


HTMLElement::removeEvent = (eventName, callback)->
	if @removeEventListener
		@removeEventListener(eventName, callback)
	else
		@detachEvent("on#{eventName}", callback)


HTMLElement::emitEvent = (eventName)->
	event = document.createEvent('Event')
	event.initEvent(eventName, true, false)
	@dispatchEvent(event)
