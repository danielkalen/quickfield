faker = require 'faker'
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
		window.field = Field({type:'text', label:'Licence Plate', ID:'plate', mask:'AAA-111', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Dollar', ID:'theDollar', mask:'$1+', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Date', mask:'11/11/1111', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Literal', mask:'My N\\ame is a+ K\\alen', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Optionals', mask:'aaa[AAA]111', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Full Name', mask:'aa+ aa+[ aa+]', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Phone', mask:'#######+', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Password', keyboard:'password'}).appendTo(sandbox)
		# window.field = Field({type:'text', label:'My Nice Field', mask:'AAA-111'}).appendTo(sandbox)
		window.field = Field({type:'text', label:'My options field', choices:['apple', 'banana', 'orange', 'banana republic']}).appendTo(sandbox)
		window.field = Field({type:'text', label:'My Nice Field', conditions:[target:'plate', property:'value']}).appendTo(sandbox)
		window.field = Field({type:'text', label:'Number', keyboard:'number', validWhenRegex:/[^0]/}).appendTo(sandbox)
		window.field = Field({type:'text', label:'Email', ID:'email', keyboard:'email'}).appendTo(sandbox)
		companyNames = (faker.company.companyName() for i in [1..50])
		window.field = Field({type:'select', label:'Many Choices', choices:companyNames}).appendTo(sandbox)
		window.field = Field({type:'select', label:'My Choices (single)', choices:['Apple', 'Banana', 'Orange', {label:'Lemon', value:'lime', conditions:{'email':'valid'}}]}).appendTo(sandbox)
		window.field = Field({type:'select', label:'My Choices (multi)', choices:['Apple', 'Banana', 'Orange', 'Lime', 'Kiwi'], multiple:true}).appendTo(sandbox)
		window.field = Field({type:'choice', label:'My Choices (single)', choices:['Apple', 'Banana', 'Orange', {label:'Lemon', value:'lime', conditions:{'email':'valid'}}]}).appendTo(sandbox)
		window.field = Field({type:'choice', label:'My Choices (multi)', choices:['Apple', 'Banana', 'Orange', 'Lime', 'Kiwi'], perGroup:3, multiple:true}).appendTo(sandbox)
		















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
