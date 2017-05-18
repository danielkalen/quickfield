faker = require 'faker'
DOM = require 'quickdom/src'
mocha.setup('tdd')
mocha.slow(400)
mocha.timeout(12000)
mocha.bail() unless window.location.hostname
expect = chai.expect
@Field = QuickField
sandbox$ = sandbox = null
restartSandbox = ()->
	sandbox$?.remove()
	sandbox$ = $('<div id="sandbox" style="border:1px solid; padding:20px; box-sizing:border-box"></div>').appendTo(document.body)
	sandbox = sandbox$[0]



suite "QuickField", ()->
	setup(restartSandbox)

	test "", ()->
		Field({type:'text', placeholder:'No Label', ID:'noLabel', help:'help <b>message</b> here', margin:'0 0 30px'}).appendTo(sandbox)
		Field({type:'text', label:'Licence Plate', ID:'plate', mask:'AAA-111', maskPlaceholder:'_', padding:'0 0 30px'}).appendTo(sandbox)
		Field({type:'text', label:'Dollar', ID:'theDollar', mask:'$1+', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Date', mask:'11/11/1111', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Literal', mask:'My N\\ame is a+ K\\alen', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Optionals', mask:'aaa[AAA]111', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Full Name', mask:'aa+ aa+[ aa+]', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Phone', mask:'#######+', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Password', keyboard:'password'}).appendTo(sandbox)
		Field({type:'text', label:'Disabled', disabled:true}).appendTo(sandbox)
		Field({type:'text', label:'Disabled w/ value', disabled:true, value:'abc123'}).appendTo(sandbox)
		# Field({type:'text', label:'My Nice Field', mask:'AAA-111'}).appendTo(sandbox)
		Field({type:'text', label:'My options field', choices:['apple', 'banana', 'orange', 'banana republic']}).appendTo(sandbox)
		Field({type:'text', label:'My Nice Field', conditions:[target:'plate', property:'value']}).appendTo(sandbox)
		Field({type:'text', label:'Pre-filled', defaultValue:'This value is prefilled'}).appendTo(sandbox)
		Field({type:'text', label:'Email', ID:'email', keyboard:'email', maskPlaceholder:'_'}).appendTo(sandbox)
		Field({type:'text', label:'Email', keyboard:'email', maskGuide:false}).appendTo(sandbox)
		Field({type:'text', label:'Number', keyboard:'number', validWhenRegex:/[^0]/, autoWidth:true}).appendTo(sandbox)
		Field({type:'text', label:'Autowidth', autoWidth:true, checkmark:false}).appendTo(sandbox)
		Field({type:'textarea', label:'Textarea (autowidth)', autoWidth:true, maxWidth:300}).appendTo(sandbox)
		DOM.div().appendTo(sandbox)
		Field({type:'textarea', label:'Textarea (autoHeight)', width:'300px', maxHeight:500}).appendTo(sandbox)
		DOM.div().appendTo(sandbox)
		Field({type:'textarea', label:'Textarea', width:'300px', height:'250px', autoHeight:false}).appendTo(sandbox)
		DOM.div().appendTo(sandbox)
		
		companyNames = (faker.company.companyName() for i in [1..50])
		Field({type:'select', label:'Many Choices', choices:companyNames, autoWidth:true}).appendTo(sandbox)
		Field({type:'select', label:'My Choices (single)', choices:['Apple', 'Banana', 'Orange', {label:'Lemon', value:'lime', conditions:{'email':'valid'}}]}).appendTo(sandbox)
		Field({type:'select', label:'My Choices (default)', choices:['Apple', 'Banana', 'Orange', {label:'Lemon', value:'lime', conditions:{'email':'valid'}}], defaultValue:'Banana'}).appendTo(sandbox)
		Field({type:'select', label:'My Choices (multi)', choices:['Apple', 'Banana', 'Orange', 'Lime', 'Kiwi'], multiple:true, defaultValue:'Apple'}).appendTo(sandbox)
		
		Field({type:'choice', label:'My Choices (single)', choices:['Apple', 'Banana', 'Orange', {label:'Lemon', value:'lime', conditions:{'email':'valid'}}]}).appendTo(sandbox)
		Field({type:'choice', label:'My Choices (multi)', choices:['Apple', 'Banana', 'Orange', 'Lime', 'Kiwi'], perGroup:3, multiple:true}).appendTo(sandbox)
		Field({type:'truefalse', label:'Is it true or false?', width:'auto'}).appendTo(sandbox).el.style 'marginRight', 20
		Field({type:'truefalse', label:'It\'s false by default', width:'auto', choiceLabels:['Yes', 'No'], defaultValue:false}).appendTo(sandbox).el.style 'marginRight', 20
		Field({type:'truefalse', label:'It\'s true by default', width:'auto', choiceLabels:['Yes', 'No'], defaultValue:true}).appendTo(sandbox).el.style 'marginRight', 20
		DOM.div().appendTo(sandbox)
		Field({type:'toggle', label:'The toggle field', width:'auto'}).appendTo(sandbox).el.style 'marginRight', 20
		Field({type:'toggle', label:'Toggled by default', width:'130px', defaultValue:1}).appendTo(sandbox).el.style 'marginRight', 20
		Field({type:'toggle', label:'Custom size toggle', width:'auto', size:40}).appendTo(sandbox).el.style 'marginRight', 20
		DOM.div(style: marginTop:30).appendTo(sandbox)
		Field({type:'toggle', label:'Aligned style', style:'aligned', width:'auto'}).appendTo(sandbox)
		DOM.div(style: marginTop:10).appendTo(sandbox)
		Field({type:'toggle', label:'Aligned style with defined width', style:'aligned', width:'400px'}).appendTo(sandbox)
		DOM.div(style: marginTop:10).appendTo(sandbox)
		Field({type:'toggle', label:'Aligned style with defined width', style:'aligned', width:'200px'}).appendTo(sandbox)















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
