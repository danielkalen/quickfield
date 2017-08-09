faker = require 'faker'
DOM = require 'quickdom'
mocha.setup('tdd')
mocha.slow(400)
mocha.timeout(12000)
mocha.bail() unless window.location.hostname
assert = chai.assert
@Field = window.quickfield
sandbox = null
restartSandbox = ()->
	if sandbox
		delete Field.instances[id] for id,field of Field.instances
		sandbox.remove()
	
	sandbox = DOM.div(id:'sandbox', style:{border:'1px solid', padding:'20px', boxSizing:'border-box'}).appendTo(document.body)



suite "QuickField", ()->
	setup ()->
		DOM.div(style:{marginTop:20, fontSize:18, fontWeight:600}, @currentTest.title).appendTo(sandbox)
	
	suiteSetup ()->
		restartSandbox()


	suite "creation", ()->
		teardown(restartSandbox)

		test "text field", ()->
			field = Field(type:'text').appendTo(sandbox)
			assert.equal field.el.parent, sandbox
			assert.equal field.el.child.input.attr('type'), 'text'

		test "textarea field", ()->
			field = Field(type:'textarea').appendTo(sandbox)
			assert.equal field.el.parent, sandbox

		test "number field", ()->
			field = Field(type:'number').appendTo(sandbox)
			assert.equal field.el.parent, sandbox

		test "select field", ()->
			field = Field(type:'select').appendTo(sandbox)
			assert.equal field.el.parent, sandbox

		test "choice field", ()->
			field = Field(type:'choice', choices:['a','b']).appendTo(sandbox)
			assert.equal field.el.parent, sandbox

		test "truefalse field", ()->
			field = Field(type:'truefalse').appendTo(sandbox)
			assert.equal field.el.parent, sandbox

		test "toggle field", ()->
			field = Field(type:'toggle').appendTo(sandbox)
			assert.equal field.el.parent, sandbox


	suite "text field", ()->
		test "with help message", ()->
			field = Field({type:'text', label:'With Help Message', help:'help <b>message</b> here', margin:'0 0 40px'}).appendTo(sandbox)
			assert.include field.el.text, 'help message here'
			assert.equal field.el.child.help.html, 'help <b>message</b> here'
		

		test "without label", ()->
			withLabel = Field({type:'text', label:'With Label'}).appendTo(sandbox)
			withoutLabel = Field({type:'text', placeholder:'Without Label'}).appendTo(sandbox)
			
			assert.equal withLabel.el.child.placeholder.html, 'With Label'
			assert.equal withLabel.el.child.label.html, 'With Label'
			# assert.equal withLabel.el.child.label.style('opacity'), '1'
			
			assert.equal withoutLabel.el.child.placeholder.html, 'Without Label'
			assert.notEqual withoutLabel.el.child.label.html, 'Without Label'
			# assert.equal withoutLabel.el.child.label.style('opacity'), '0'

			initialTop =
				withLabel: withLabel.el.child.input.rect.top
				withoutLabel: withoutLabel.el.child.input.rect.top
			
			withLabel.value = 'abc123'
			withoutLabel.value = 'abc123'

			Promise.delay(200)
				.then ()->
					assert.notEqual withLabel.el.child.input.rect.top, initialTop.withLabel
					assert.equal withoutLabel.el.child.input.rect.top, initialTop.withoutLabel


		test "custom height/fontsize", ()->
			fieldA = Field({type:'text', label:'Reg Height', autoWidth:true}).appendTo(sandbox)
			fieldB = Field({type:'text', label:'Custom Height', ID:'customHeightA', height:40, fontSize:13, autoWidth:true}).appendTo(sandbox)
			fieldC = Field({type:'text', label:'Custom Height', ID:'customHeightB', height:60, fontSize:16, autoWidth:true}).appendTo(sandbox)

			assert.isAtLeast fieldA.el.height, fieldA.settings.height
			assert.isAtMost fieldA.el.height, fieldA.settings.height+5
			
			assert.isAtLeast fieldB.el.height, 40
			assert.isAtMost fieldB.el.height, 45
			
			assert.isAtLeast fieldC.el.height, 60
			assert.isAtMost fieldC.el.height, 65


		test "custom border", ()->
			field = Field({type:'text', label:'Custom Border', border:'0 0 2px 0', margin:'0 0 30px'}).appendTo(sandbox)


		test "default value", ()->
			field = Field({type:'text', label:'Pre-filled', defaultValue:'This value is prefilled'}).appendTo(sandbox)
			field = Field({type:'text', label:'Pre-filled', value:'This value is prefilled'}).appendTo(sandbox)


		test "disabled", ()->
			field = Field({type:'text', label:'Disabled', disabled:true}).appendTo(sandbox)
			field = Field({type:'text', label:'Disabled w/ value', disabled:true, value:'abc123'}).appendTo(sandbox)


		test "options/autocomplete", ()->
			field = Field({type:'text', label:'My options field', choices:['apple', 'banana', 'orange', 'banana republic']}).appendTo(sandbox)


		test "conditions", ()->
			field = Field({type:'text', label:'My Nice Field', conditions:[target:'plate', property:'value']}).appendTo(sandbox)


		test "autowidth", ()->
			field =Field({type:'text', label:'Autowidth', autoWidth:true, checkmark:false}).appendTo(sandbox)
			field =Field({type:'textarea', label:'Textarea (autowidth)', autoWidth:true, maxWidth:300}).appendTo(sandbox)


		suite "keyboard/custom-type", ()->
			test "password", ()->
				field = Field({type:'text', label:'Password', keyboard:'password'}).appendTo(sandbox)


			test "email", ()->
				field = Field({type:'text', label:'Email', ID:'email', keyboard:'email', maskPlaceholder:'_'}).appendTo(sandbox)
				field = Field({type:'text', label:'Email', keyboard:'email', maskGuide:false}).appendTo(sandbox)


			test "number (simluated)", ()->
				field = Field({type:'text', label:'Number (simluated)', keyboard:'number', validWhenRegex:/[^0]/, autoWidth:true}).appendTo(sandbox)


		suite "mask", ()->
			test "alpha", ()->
				field = Field({type:'text', label:'Full Name', mask:'aa+ aa+[ aa+]', maskPlaceholder:'_'}).appendTo(sandbox)

			test "numeric", ()->
				field = Field({type:'text', label:'Phone', mask:'#######+', maskPlaceholder:'_'}).appendTo(sandbox)
				field = Field({type:'text', label:'Phone', mask:'(111) 111-1111', maskPlaceholder:'_'}).appendTo(sandbox)

			test "alphanumeric", ()->
				field = Field({type:'text', label:'Licence Plate', ID:'plate', mask:'AAA-111', maskPlaceholder:'_', padding:'0 0 30px'}).appendTo(sandbox)

			test "prefix", ()->
				field = Field({type:'text', label:'Dollar', ID:'theDollar', mask:'$1+', maskPlaceholder:'_', width:'48.5%', mobileWidth:'100%'}).appendTo(sandbox)

			test "date", ()->
				field = Field({type:'text', label:'Date', mask:'11/11/1111', maskPlaceholder:'_', width:'48.5%', mobileWidth:'100%'}).appendTo(sandbox)

			test "literal", ()->
				field = Field({type:'text', label:'Literal', mask:'My N\\ame is a+ K\\alen', maskPlaceholder:'_'}).appendTo(sandbox)

			test "optionals", ()->
				field = Field({type:'text', label:'Optionals', mask:'aaa[AAA]111', maskPlaceholder:'_'}).appendTo(sandbox)

			test "custom patterns", ()->
				field = Field({type:'text', label:'Only specific chars', mask:'&&+-aa-111-[ aa+]', maskPlaceholder:'_', maskPatterns:
					'&': (v)-> /[ab12]/.test(v)
					'a': (v)-> /[0-4]/.test(v)
				}).appendTo(sandbox)


	suite "number field", ()->
		test "basic", ()->
			field = Field({type:'number', label:'Number', autoWidth:false}).appendTo(sandbox)


		test "min/max", ()->
			field = Field({type:'number', label:'Number (min/max)', minValue:10, maxValue:1000, autoWidth:true}).appendTo(sandbox)


		test "min/max/step", ()->
			field = Field({type:'number', label:'Number (min/max/step)', minValue:10, maxValue:100, step:3, autoWidth:true}).appendTo(sandbox)


		test "min/max/step (enforced)", ()->
			field = Field({type:'number', label:'Number (enforced)', minValue:10, maxValue:100, step:12, enforce:true, autoWidth:true}).appendTo(sandbox)


	suite "textarea field", ()->
		test "basic", ()->
			field = Field({type:'textarea', label:'Textarea', width:'300px', height:'250px', autoHeight:false}).appendTo(sandbox)

		test "autoheight", ()->
			field = Field({type:'textarea', label:'Textarea (autoHeight)', width:'300px', maxHeight:500}).appendTo(sandbox)


	suite "select field", ()->
		test "single selectable", ()->
			field = Field({type:'select', label:'My Choices (single)', choices:['Apple', 'Apple Juice', 'Banana', 'Orange', {label:'Lemon', value:'lime', conditions:{'email':'valid'}}]}).appendTo(sandbox)

		test "multi selectable", ()->
			field = Field({type:'select', label:'My Choices (multi)', choices:['Apple', 'Banana', 'Orange', 'Lime', 'Kiwi'], multiple:true, defaultValue:'Apple'}).appendTo(sandbox)

		test "default value", ()->
			field = Field({type:'select', label:'My Choices (default)', choices:['Apple', 'Banana', 'Orange', {label:'Lemon', value:'lime', conditions:{'email':'valid'}}], defaultValue:'Banana'}).appendTo(sandbox)

		test "cusotm border", ()->
			field = Field({type:'select', label:'Custom Border', choices:['Apple', 'Banana', 'Orange'], border:'0 0 2px 0', margin:'0 0 30px'}).appendTo(sandbox)

		test "no choices", ()->
			field = Field({type:'select', label:'No choices', autoWidth:true}).appendTo(sandbox)

		test "many choices", ()->
			companyNames = (faker.company.companyName() for i in [1..50])
			field = Field({type:'select', label:'Many Choices', choices:companyNames, autoWidth:true}).appendTo(sandbox)


	suite "choice field", ()->
		test "single selectable", ()->
			field = Field({type:'choice', label:'My Choices (single)', choices:['Apple', 'Banana', 'Orange', {label:'Lemon', value:'lime', conditions:{'email':'valid'}}]}).appendTo(sandbox)

		test "multi selectable", ()->
			field = Field({type:'choice', label:'My Choices (multi)', choices:['Apple', 'Banana', 'Orange', 'Lime', 'Kiwi'], perGroup:3, multiple:true}).appendTo(sandbox)


	suite "truefalse field", ()->
		test "basic", ()->
			field = Field({type:'truefalse', label:'Is it true or false?', width:'auto'}).appendTo(sandbox).el.style 'marginRight', 20

		test "default value", ()->
			field = Field({type:'truefalse', label:'It\'s false by default', width:'auto', choiceLabels:['Yes', 'No'], defaultValue:false}).appendTo(sandbox).el.style 'marginRight', 20
			field = Field({type:'truefalse', label:'It\'s true by default', width:'auto', choiceLabels:['Yes', 'No'], value:true}).appendTo(sandbox).el.style 'marginRight', 20

	suite "toggle field", ()->
		test "basic", ()->
			field = Field({type:'toggle', label:'The toggle field', width:'auto'}).appendTo(sandbox).el.style 'marginRight', 20

		test "default value", ()->
			field = Field({type:'toggle', label:'Toggled by default', width:'130px', defaultValue:1}).appendTo(sandbox).el.style 'marginRight', 20

		test "custom size", ()->
			field = Field({type:'toggle', label:'Custom size toggle', width:'auto', size:40}).appendTo(sandbox).el.style 'marginRight', 20

		test "aligned style", ()->
			field = Field({type:'toggle', label:'Aligned style', style:'aligned', width:'auto'}).appendTo(sandbox)

		test "aligned style + defined width", ()->
			field = Field({type:'toggle', label:'Aligned style with defined width', style:'aligned', width:'400px'}).appendTo(sandbox)
			field = Field({type:'toggle', label:'Aligned style with defined width', style:'aligned', width:'200px'}).appendTo(sandbox)





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
