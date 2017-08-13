window.helpers = import './helpers'
promiseEvent = import 'p-event'
DOM = import 'quickdom'
COLORS = import '../src/constants/colors'
chai = import 'chai'
chai.use(import 'chai-dom')
chai.use(import 'chai-style')
chai.use(import 'chai-almost')
chai.use(import 'chai-asserttype')
chai.use(import 'chai-events')
chai.config.truncateThreshold = 1e3
mocha.setup('tdd')
mocha.slow(400)
mocha.timeout(12000)
mocha.bail() unless window.__karma__
assert = chai.assert
expect = chai.expect
@Field = window.quickfield
window.sandbox = null



suite "QuickField", ()->	
	teardown ()->
		lastChild = sandbox.children[sandbox.children.length-1]
		lastChild.remove() if lastChild?.ref is 'testTitle'
	
	suiteSetup ()->
		helpers.restartSandbox()


	suite "creation", ()->
		teardown(helpers.restartSandbox)

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
		suiteSetup ()->
			helpers.addTitle("text field")
			@control = Field({type:'text', label:'Regular'}).appendTo(sandbox)
		teardown ()->
			@control.value = ''

		test "getter/setter", ()->
			getter = (value)-> "example.com/#{value}"
			setter = (value)-> value.toLowerCase()
			fieldA = Field({type:'text', label:'path', getter})
			fieldB = Field({type:'text', label:'path', setter})
			fieldC = Field({type:'text', label:'path', getter, setter})

			expect(fieldA.value).to.equal 'example.com/'
			expect(fieldA.el.child.input.raw.value).to.equal ''
			expect(fieldB.value).to.equal ''
			expect(fieldB.el.child.input.raw.value).to.equal ''
			expect(fieldC.value).to.equal 'example.com/'
			expect(fieldC.el.child.input.raw.value).to.equal ''

			helpers.simulateKeys(fieldA.el.child.input.raw, 'AbC')
			helpers.simulateKeys(fieldB.el.child.input.raw, 'AbC')
			helpers.simulateKeys(fieldC.el.child.input.raw, 'AbC')
			expect(fieldA.value).to.equal 'example.com/AbC'
			expect(fieldA.el.child.input.raw.value).to.equal 'AbC'
			expect(fieldB.value).to.equal 'abc'
			expect(fieldB.el.child.input.raw.value).to.equal 'abc'
			expect(fieldC.value).to.equal 'example.com/abc'
			expect(fieldC.el.child.input.raw.value).to.equal 'abc'

			fieldA.value = 'DeF'
			fieldB.value = 'DeF'
			fieldC.value = 'DeF'
			expect(fieldA.value).to.equal 'example.com/DeF'
			expect(fieldA.el.child.input.raw.value).to.equal 'DeF'
			expect(fieldB.value).to.equal 'def'
			expect(fieldB.el.child.input.raw.value).to.equal 'def'
			expect(fieldC.value).to.equal 'example.com/def'
			expect(fieldC.el.child.input.raw.value).to.equal 'def'


		test "with help message", ()->
			field = Field({type:'text', label:'With Help Message', help:'help <b>message</b> here', margin:'0 0 40px'})
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
			fieldA = Field({type:'text', label:'Custom Height', height:40, fontSize:13, autoWidth:true}).appendTo(sandbox)
			fieldB = Field({type:'text', label:'Custom Height', height:60, fontSize:16, autoWidth:true}).appendTo(sandbox)

			assert.isAtLeast @control.el.height, @control.settings.height
			assert.isAtMost @control.el.height, @control.settings.height+5
			
			assert.isAtLeast fieldA.el.height, 40
			assert.isAtMost fieldA.el.height, 45
			
			assert.isAtLeast fieldB.el.height, 60
			assert.isAtMost fieldB.el.height, 65


		test "custom border", ()->
			custom = Field({type:'text', label:'Custom Border', border:'0 0 2px 0'}).appendTo(sandbox)
			getBorderSides = (el)->
				top:el.style('borderTopWidth'), bottom:el.style('borderBottomWidth'), left:el.style('borderLeftWidth'), right:el.style('borderRightWidth')
			
			assert.deepEqual getBorderSides(@control.el.child.innerwrap), {top:'1px', left:'1px', right:'1px', bottom:'1px'}
			assert.deepEqual getBorderSides(custom.el.child.innerwrap), {top:'0px', left:'0px', right:'0px', bottom:'2px'}


		test "default value", ()->
			fieldA = Field({type:'text'})
			fieldB = Field({type:'text', defaultValue:'valueB'})
			fieldC = Field({type:'text', value:'valueC'})
			assert.equal fieldA.value, ''
			assert.equal fieldA.el.child.input.raw.value, ''
			assert.equal fieldB.value, 'valueB'
			assert.equal fieldB.el.child.input.raw.value, 'valueB'
			assert.equal fieldC.value, 'valueC'
			assert.equal fieldC.el.child.input.raw.value, 'valueC'


		test "disabled", ()->
			fieldA = Field({type:'text', label:'Disabled', autoWidth:true, disabled:true}).appendTo(sandbox)
			fieldB = Field({type:'text', label:'Disabled w/ value', autoWidth:true, disabled:true, value:'abc123'}).appendTo(sandbox)
			window.assert = assert
			expect(@control.value).to.equal ''
			expect(@control.el.child.input.raw.value).to.equal ''
			expect(@control.el.child.innerwrap.raw).to.have.style 'backgroundColor', 'white'
			expect(fieldA.value).to.equal ''
			expect(fieldA.el.child.input.raw.value).to.equal ''
			expect(fieldA.el.child.innerwrap.raw).to.have.style 'backgroundColor', COLORS.grey_light
			expect(fieldB.value).to.equal 'abc123'
			expect(fieldB.el.child.input.raw.value).to.equal 'abc123'
			expect(fieldB.el.child.innerwrap.raw).to.have.style 'backgroundColor', COLORS.grey_light

			# expect(@control.state.focused).to.equal false
			# @control.focus()
			# expect(@control.state.focused).to.equal true

			# expect(fieldA.state.focused).to.equal false
			# fieldA.focus()
			# Promise.delay(5).then ()->
			# 	expect(fieldA.state.focused).to.equal false


		test "conditions", ()->
			master = Field({type:'text', label:'Master Field', ID:'masterField', mask:'aaa-111', required:true, autoWidth:true}).appendTo(sandbox)
			slave = Field({type:'text', label:'Slave Field', conditions:[target:'masterField'], autoWidth:true}).appendTo(sandbox)


		test "autowidth", ()->
			field = Field({type:'text', label:'Autowidth', autoWidth:true, checkmark:false}).appendTo(sandbox)


		suite "options/autocomplete", ()->
			suiteSetup ()->
				@field = Field({type:'text', label:'My options field', choices:['apple', 'banana', 'orange', 'banana republic', {label:'orange split', value:'split'}]}).appendTo(sandbox)
				@choices = @field.dropdown.choices
				@dropdownEl = @field.dropdown.els.container.raw
				@inputEl = @field.el.child.input.raw
			
			teardown ()->
				@field.blur()
				@field.value = ''

			test "triggering", ()->
				Promise.bind(@)
					.then ()->
						expect(@dropdownEl).not.to.be.displayed
						promise = promiseEvent(@field.el.child.input, 'focus')
						@field.focus()
						return promise

					.then ()->
						expect(@dropdownEl).not.to.be.displayed
						helpers.simulateKeys(@inputEl, 'a')
						expect(@dropdownEl).to.be.displayed
						promise = promiseEvent(@field.el.child.input, 'blur')
						@field.blur()
						return promise

					.then ()->
						expect(@dropdownEl).not.to.be.displayed
						@field.focus()
						helpers.simulateAction(@inputEl, 'down')
						expect(@dropdownEl).not.to.be.displayed

					.then ()->
						helpers.simulateKeys(@inputEl, 'a')
						expect(@dropdownEl).to.be.displayed

					.then ()->
						promise = promiseEvent(@field.el.child.input, 'blur')
						@field.blur()
						return promise

					.then ()->
						@field.dropdown.isOpen = true
						expect(@dropdownEl).to.be.displayed
						@field.dropdown.isOpen = false
						expect(@dropdownEl).not.to.be.displayed


			test "highlighting", ()->
				@field.focus()
				
				helpers.simulateKeys(@inputEl, 'a')
				expect(@field.dropdown.currentHighlighted).to.equal null
				
				helpers.simulateAction(@inputEl, 'down')
				expect(@field.dropdown.currentHighlighted).to.equal @choices[0]
				
				helpers.simulateAction(@inputEl, 'down')
				helpers.simulateAction(@inputEl, 'down')
				expect(@field.dropdown.currentHighlighted).to.equal @choices[2]
				
				helpers.simulateAction(@inputEl, 'down')
				helpers.simulateAction(@inputEl, 'down')
				expect(@field.dropdown.currentHighlighted).to.equal @choices[4]
				
				helpers.simulateAction(@inputEl, 'down')
				expect(@field.dropdown.currentHighlighted).to.equal @choices[0]
				
				helpers.simulateAction(@inputEl, 'up')
				expect(@field.dropdown.currentHighlighted).to.equal @choices[4]
				
				helpers.simulateAction(@inputEl, 'up')
				expect(@field.dropdown.currentHighlighted).to.equal @choices[3]

				@field.blur()
				expect(@field.dropdown.currentHighlighted).to.equal null


			test "filtering", ()->
				getVisible = ()=> @choices.filter((choice)-> choice.visible).map((choice)-> choice.value)
				@field.focus()

				expect(getVisible()).to.eql ['apple', 'banana', 'orange', 'banana republic', 'split']
				
				helpers.simulateKeys(@inputEl, 'ban')
				expect(getVisible()).to.eql ['banana', 'banana republic']
				
				helpers.simulateKeys(@inputEl, 'ana')
				expect(getVisible()).to.eql ['banana', 'banana republic']
				
				helpers.simulateKeys(@inputEl, ' ')
				expect(getVisible()).to.eql ['banana republic']
				
				@field.value = 'ora'
				expect(getVisible()).to.eql ['orange', 'split']


			test "selecting", ()->
				@field.focus()

				expect(@field.value).to.equal ''
				
				@choices[1].el.emit 'click'
				expect(@field.value).to.equal 'banana'
				expect(@inputEl.value).to.equal 'banana'
				
				@field.focus(); @field.state.typing = true
				@field.value = 'ora'
				helpers.simulateAction(@inputEl, 'down')
				helpers.simulateAction(@inputEl, 'down')
				expect(@field.dropdown.currentHighlighted).to.equal @choices[4]
				expect(@field.value).to.equal 'ora'
				expect(@inputEl.value).to.equal 'ora'
				
				helpers.simulateAction(@inputEl, 'enter')
				expect(@field.value).to.equal 'split'
				expect(@inputEl.value).to.equal 'orange split'
				
				@field.value = 'orange'
				expect(@field.value).to.equal 'orange'
				expect(@inputEl.value).to.equal 'orange'
				
				@field.value = 'orange split'
				expect(@field.value).to.equal 'split'
				expect(@inputEl.value).to.equal 'orange split'



		suite "keyboard/custom-type", ()->
			test "password", ()->
				field = Field({type:'text', label:'Password', keyboard:'password'}).appendTo(sandbox)


			test "email", ()->
				field = Field({type:'text', label:'Email', ID:'email', keyboard:'email', required:true}).appendTo(sandbox)
				field = Field({type:'text', label:'Email', keyboard:'email', mask:{guide:false}, required:true}).appendTo(sandbox)


			test "number (simluated)", ()->
				field = Field({type:'text', label:'Number (simluated)', keyboard:'number', validWhenRegex:/[^0]/, autoWidth:true}).appendTo(sandbox)


		suite "mask", ()->
			suiteSetup ()-> helpers.addTitle('mask')
			
			test "alpha", ()->
				field = Field({type:'text', label:'Full Name', mask:{
					pattern: 'a'
					guide: false
					setter: (value)->
						split = value.split(/\s+/)
						if split.length > 1
							return if split.length is 4
							split.map((part)-> 'a'.repeat(part.length)).join(' ')+'a'
						else
							'a'.repeat(value.length+1)
				}}).appendTo(sandbox)

			test "numeric", ()->
				field = Field({type:'text', label:'Phone', width:'48.5%', mobileWidth:'100%', mask:'(111) 111-1111'}).appendTo(sandbox)
				field = Field({type:'text', label:'Phone', width:'48.5%', mobileWidth:'100%', mask:{
					pattern: '#'
					guide: false
					setter: (value='')-> '#'.repeat Math.max 7,value.length
				}}).appendTo(sandbox)

			test "alphanumeric", ()->
				field = Field({type:'text', label:'Licence Plate', mask:{pattern:'aaa-111', transform:(v)-> v.toUpperCase()}}).appendTo(sandbox)

			test "prefix", ()->
				field = Field({type:'text', label:'Dollar', mask:{pattern:'NUMBER', prefix:'$', decimal:true, sep:true}}).appendTo(sandbox)

			test "date", ()->
				field = Field({type:'text', label:'Date', keyboard:'date'}).appendTo(sandbox)

			test "literal", ()->
				field = Field({type:'text', label:'Literal', mask:'My N\\ame is a+ K\\alen'}).appendTo(sandbox)

			test "optionals", ()->
				field = Field({type:'text', label:'Optionals', mask:'aaa[AAA]111'}).appendTo(sandbox)

			test "custom patterns", ()->
				field = Field({type:'text', label:'Only specific chars', mask:{pattern:'&&+-aa-111-[ aa+]', customPatterns:
					'&': /[ab12]/
					'a': /[0-4]/
				}}).appendTo(sandbox)


	suite "number field", ()->
		suiteSetup ()->
			helpers.addTitle('number field')

		test "basic", ()->
			field = Field({type:'number', label:'Number', autoWidth:false}).appendTo(sandbox)

		test "getter/setter", ()->
			getter = (value)-> (value or 0) * 10
			setter = (value)-> (value or 0) * 2
			fieldA = Field({type:'number', label:'Number', autoWidth:true, getter})
			fieldB = Field({type:'number', label:'Number', autoWidth:true, setter})
			fieldC = Field({type:'number', label:'Number', autoWidth:true, getter, setter})

			expect(fieldA.value).to.equal 0
			expect(fieldA.el.child.input.raw.value).to.equal ''
			expect(fieldB.value).to.equal 0
			expect(fieldB.el.child.input.raw.value).to.equal ''
			expect(fieldC.value).to.equal 0
			expect(fieldC.el.child.input.raw.value).to.equal ''

			helpers.simulateKeys(fieldA.el.child.input.raw, '3')
			helpers.simulateKeys(fieldB.el.child.input.raw, '3')
			helpers.simulateKeys(fieldC.el.child.input.raw, '3')
			expect(fieldA.value).to.equal 30
			expect(fieldA.el.child.input.raw.value).to.equal '3'
			expect(fieldB.value).to.equal 6
			expect(fieldB.el.child.input.raw.value).to.equal '6'
			expect(fieldC.value).to.equal 60
			expect(fieldC.el.child.input.raw.value).to.equal '6'

			fieldA.value = 12
			fieldB.value = 12
			fieldC.value = 12
			expect(fieldA.value).to.equal 120
			expect(fieldA.el.child.input.raw.value).to.equal '12'
			expect(fieldB.value).to.equal 24
			expect(fieldB.el.child.input.raw.value).to.equal '24'
			expect(fieldC.value).to.equal 240
			expect(fieldC.el.child.input.raw.value).to.equal '24'


		test "min/max", ()->
			field = Field({type:'number', label:'Number (min/max)', minValue:10, maxValue:1000, autoWidth:true}).appendTo(sandbox)


		test "min/max/step", ()->
			field = Field({type:'number', label:'Number (min/max/step)', minValue:10, maxValue:100, step:3, autoWidth:true}).appendTo(sandbox)


		test "min/max/step (enforced)", ()->
			field = Field({type:'number', label:'Number (enforced)', minValue:10, maxValue:100, step:12, enforce:true, autoWidth:true}).appendTo(sandbox)


	suite "textarea field", ()->
		suiteSetup ()->
			helpers.addTitle('textarea field')
	
		test "basic", ()->
			field = Field({type:'textarea', label:'Textarea', width:'300px', height:'250px', autoHeight:false}).appendTo(sandbox)

		test "getter/setter", ()->
			getter = (value)-> "example.com/#{value}"
			setter = (value)-> value.toLowerCase()
			fieldA = Field({type:'textarea', label:'path', getter})
			fieldB = Field({type:'textarea', label:'path', setter})
			fieldC = Field({type:'textarea', label:'path', getter, setter})

			expect(fieldA.value).to.equal 'example.com/'
			expect(fieldA.el.child.input.raw.value).to.equal ''
			expect(fieldB.value).to.equal ''
			expect(fieldB.el.child.input.raw.value).to.equal ''
			expect(fieldC.value).to.equal 'example.com/'
			expect(fieldC.el.child.input.raw.value).to.equal ''

			helpers.simulateKeys(fieldA.el.child.input.raw, 'AbC')
			helpers.simulateKeys(fieldB.el.child.input.raw, 'AbC')
			helpers.simulateKeys(fieldC.el.child.input.raw, 'AbC')
			expect(fieldA.value).to.equal 'example.com/AbC'
			expect(fieldA.el.child.input.raw.value).to.equal 'AbC'
			expect(fieldB.value).to.equal 'abc'
			expect(fieldB.el.child.input.raw.value).to.equal 'abc'
			expect(fieldC.value).to.equal 'example.com/abc'
			expect(fieldC.el.child.input.raw.value).to.equal 'abc'

			fieldA.value = 'DeF'
			fieldB.value = 'DeF'
			fieldC.value = 'DeF'
			expect(fieldA.value).to.equal 'example.com/DeF'
			expect(fieldA.el.child.input.raw.value).to.equal 'DeF'
			expect(fieldB.value).to.equal 'def'
			expect(fieldB.el.child.input.raw.value).to.equal 'def'
			expect(fieldC.value).to.equal 'example.com/def'
			expect(fieldC.el.child.input.raw.value).to.equal 'def'


		test "autoheight", ()->
			field = Field({type:'textarea', label:'Textarea (autoHeight)', width:'300px', maxHeight:500}).appendTo(sandbox)
		
		test "autowidth", ()->
			field = Field({type:'textarea', label:'Textarea (autowidth)', autoWidth:true, maxWidth:300}).appendTo(sandbox)


	suite "select field", ()->
		suiteSetup ()->
			helpers.addTitle('select field')

		test "single selectable", ()->
			field = Field({type:'select', label:'My Choices (single)', choices:['Apple', 'Apple Juice', 'Banana', 'Orange', {label:'Lemon', value:'lime', conditions:{'email':'valid'}}]}).appendTo(sandbox)

		test "multi selectable", ()->
			field = Field({type:'select', label:'My Choices (multi)', choices:['Apple', 'Banana', 'Orange', 'Lime', 'Kiwi'], multiple:true, defaultValue:'Apple'}).appendTo(sandbox)
			assert.equal field.value, 'Apple'

		test "default value", ()->
			field = Field({type:'select', label:'My Choices (default)', choices:['Apple', 'Banana', 'Orange', {label:'Lemon', value:'lime', conditions:{'email':'valid'}}], value:'Banana'}).appendTo(sandbox)
			assert.equal field.value, 'Banana'

		test "cusotm border", ()->
			field = Field({type:'select', label:'Custom Border', choices:['Apple', 'Banana', 'Orange'], border:'0 0 2px 0', margin:'0 0 30px'}).appendTo(sandbox)

		test "no choices", ()->
			field = Field({type:'select', label:'No choices', autoWidth:true}).appendTo(sandbox)

		test "many choices", ()->
			field = Field({type:'select', label:'Many Choices', choices:helpers.companyNames, autoWidth:true}).appendTo(sandbox)


	suite "choice field", ()->
		suiteSetup ()->
			helpers.addTitle('choice field')

		test "single selectable", ()->
			field = Field({type:'choice', label:'My Choices (single)', choices:['Apple', 'Banana', 'Orange']}).appendTo(sandbox)

		test "multi selectable", ()->
			field = Field({type:'choice', label:'My Choices (multi)', choices:['Apple', 'Banana', 'Orange', 'Lime', 'Kiwi'], perGroup:3, multiple:true}).appendTo(sandbox)

		test "default value", ()->
			field = Field({type:'choice', label:'My Choices (single)', choices:['Apple', 'Banana', 'Orange'], value:'Orange'}).appendTo(sandbox)
			assert.equal field.value, 'Orange'
			assert.equal field.findChoice('Orange').selected, true
			
			field = Field({type:'choice', label:'My Choices (multi)', choices:['Apple', 'Banana', 'Orange', 'Lime', 'Kiwi'], multiple:true, value:['Banana', 'Lime']}).appendTo(sandbox)
			assert.deepEqual field.value, ['Banana', 'Lime']
			assert.equal field.findChoice('Banana').selected, true
			assert.equal field.findChoice('Lime').selected, true

		test "conditions", ()->
			master = Field({type:'text', ID:'master', required:true}).appendTo(sandbox)
			field = Field({type:'choice', label:'My Choices (single)', choices:[
				'Apple'
				{label:'Banana', value:'banana', conditions:{'master':/^bana/}}
				'Orange'
				{label:'Lemon', value:'lime', conditions:{'master':'valid'}}
			]}).appendTo(sandbox)

		test "getter/setter", ()->
			getter = (value)-> value?.toUpperCase() or value
			setter = (value)-> if value?.value is 'Banana' then 'Apple' else value
			fieldA = Field({type:'choice', choices:['Apple','Banana','Orange'], getter}).appendTo(sandbox)
			fieldB = Field({type:'choice', choices:['Apple','Banana','Orange'], setter}).appendTo(sandbox)
			fieldC = Field({type:'choice', choices:['Apple','Banana','Orange'], getter, setter}).appendTo(sandbox)

			expect(fieldA.value).to.equal undefined
			expect(fieldA.valueRaw).to.equal null
			expect(fieldB.value).to.equal undefined
			expect(fieldB.valueRaw).to.equal null
			expect(fieldC.value).to.equal undefined
			expect(fieldC.valueRaw).to.equal null

			fieldA.choices[1].el.emit 'click'
			fieldB.choices[1].el.emit 'click'
			fieldC.choices[1].el.emit 'click'
			expect(fieldA.value).to.equal 'BANANA'
			expect(fieldA.valueRaw?.value).to.equal 'Banana'
			expect(fieldB.value).to.equal 'Apple'
			expect(fieldB.valueRaw?.value).to.equal 'Apple'
			expect(fieldC.value).to.equal 'APPLE'
			expect(fieldC.valueRaw?.value).to.equal 'Apple'

			fieldA.value = 'Orange'
			fieldB.value = 'Orange'
			fieldC.value = 'Orange'
			expect(fieldA.value).to.equal 'ORANGE'
			expect(fieldA.valueRaw?.value).to.equal 'Orange'
			expect(fieldB.value).to.equal 'Orange'
			expect(fieldB.valueRaw?.value).to.equal 'Orange'
			expect(fieldC.value).to.equal 'ORANGE'
			expect(fieldC.valueRaw?.value).to.equal 'Orange'


	suite "truefalse field", ()->
		suiteSetup ()->
			helpers.addTitle('truefalse field')
		
		test "basic", ()->
			field = Field({type:'truefalse', label:'Is it true or false?', width:'auto'}).appendTo(sandbox).el.style 'marginRight', 20
			assert.equal field.value, null

		test "default value", ()->
			field = Field({type:'truefalse', label:'It\'s false by default', width:'auto', choiceLabels:['Yes', 'No'], value:false}).appendTo(sandbox)
			field.el.style 'marginRight', 20
			assert.equal field.value, false
			
			field = Field({type:'truefalse', label:'It\'s true by default', width:'auto', choiceLabels:['Yes', 'No'], value:true}).appendTo(sandbox)
			field.el.style 'marginRight', 20
			assert.equal field.value, true


	suite "toggle field", ()->
		suiteSetup ()->
			helpers.addTitle('toggle field')
		
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


	suite "group field", ()->
		setup helpers.addDivider
		suiteSetup ()->
			helpers.addTitle('group field')
			@fields = 
				first:
					type: 'text'
					label: 'First'
					width: '49%'
				second:
					type: 'text'
					label: 'Second'
					width: '49%'
				third:
					type: 'select'
					label: 'Third'
					width: '74%'
					choices: ['Apple', 'Banana', 'Kiwi']
					value: 'Kiwi'
				fourth:
					type: 'toggle'
					label: 'Fourth'
					style: 'aligned'
					width: '24%'
					conditions: third:'Kiwi'
			
			@control = Field({type:'group', label:'Basic Group', width:'70%', fieldMargin:10, @fields}).appendTo(sandbox)
		
		test "basic", ()->
			expect(@control.value).to.eql {first:'', second:'', third:'Kiwi', fourth:false}
			expect(@control.state.interacted).to.equal false

			@control.value = {first:'valueA', third:'Kawa', fourth:true, fifth:'5'}
			expect(@control.value).to.eql {first:'valueA', second:'', third:'Kiwi', fourth:true}
			expect(@control.state.interacted).to.equal true
			
			@control.value = {second:'valueB', third:'Apple'}
			expect(@control.value).to.eql {first:'valueA', second:'valueB', third:'Apple', fourth:true}

			@control.value = null
			expect(@control.value).to.eql {first:'valueA', second:'valueB', third:'Apple', fourth:true}


		test "collapsed by default", ()->
			field = Field({type:'group', width:'70%', fieldMargin:10, startCollapsed:true, @fields}).appendTo(sandbox)
			expect(@control.els.innerwrap.raw).to.be.displayed
			expect(field.els.innerwrap.raw).not.to.be.displayed
			
			@control.state.collapsed = true
			field.state.collapsed = false
			expect(@control.els.innerwrap.raw).not.to.be.displayed
			expect(field.els.innerwrap.raw).to.be.displayed

			@control.els.collapse.emit 'click'
			field.els.collapse.emit 'click'
			expect(@control.els.innerwrap.raw).to.be.displayed
			expect(field.els.innerwrap.raw).not.to.be.displayed











