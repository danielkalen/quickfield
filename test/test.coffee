window.helpers = import './helpers'
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
	setup ()->
		DOM.div(
			ref: 'testTitle'
			style:{marginTop:20, fontSize:16, fontWeight:600, fontFamily:'system-ui, sans-serif'}
		, @currentTest.title).appendTo(sandbox)
	
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
		suiteSetup ()-> window.control = Field({type:'text', label:'Regular'}).appendTo(sandbox)
		
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

			assert.isAtLeast control.el.height, control.settings.height
			assert.isAtMost control.el.height, control.settings.height+5
			
			assert.isAtLeast fieldA.el.height, 40
			assert.isAtMost fieldA.el.height, 45
			
			assert.isAtLeast fieldB.el.height, 60
			assert.isAtMost fieldB.el.height, 65


		test "custom border", ()->
			custom = Field({type:'text', label:'Custom Border', border:'0 0 2px 0'}).appendTo(sandbox)
			getBorderSides = (el)->
				top:el.style('borderTopWidth'), bottom:el.style('borderBottomWidth'), left:el.style('borderLeftWidth'), right:el.style('borderRightWidth')
			
			assert.deepEqual getBorderSides(control.el.child.innerwrap), {top:'1px', left:'1px', right:'1px', bottom:'1px'}
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
			fieldA = Field({type:'text', label:'Disabled', disabled:true}).appendTo(sandbox)
			fieldB = Field({type:'text', label:'Disabled w/ value', disabled:true, value:'abc123'}).appendTo(sandbox)
			window.assert = assert
			expect(control.value).to.equal ''
			expect(control.el.child.input.raw.value).to.equal ''
			expect(control.el.child.innerwrap.raw).to.have.style 'backgroundColor', 'white'
			expect(fieldA.value).to.equal ''
			expect(fieldA.el.child.input.raw.value).to.equal ''
			expect(fieldA.el.child.innerwrap.raw).to.have.style 'backgroundColor', COLORS.grey_light
			expect(fieldB.value).to.equal 'abc123'
			expect(fieldB.el.child.input.raw.value).to.equal 'abc123'
			expect(fieldB.el.child.innerwrap.raw).to.have.style 'backgroundColor', COLORS.grey_light


		test "options/autocomplete", ()->
			field = Field({type:'text', label:'My options field', choices:['apple', 'banana', 'orange', 'banana republic']}).appendTo(sandbox)


		test "conditions", ()->
			master = Field({type:'text', label:'Master Field', ID:'masterField', mask:'AAA-111', required:true, autoWidth:true}).appendTo(sandbox)
			slave = Field({type:'text', label:'Slave Field', conditions:[target:'masterField'], autoWidth:true}).appendTo(sandbox)


		test "autowidth", ()->
			field = Field({type:'text', label:'Autowidth', autoWidth:true, checkmark:false}).appendTo(sandbox)
			field = Field({type:'textarea', label:'Textarea (autowidth)', autoWidth:true, maxWidth:300}).appendTo(sandbox)


		suite "keyboard/custom-type", ()->
			test "password", ()->
				field = Field({type:'text', label:'Password', keyboard:'password'}).appendTo(sandbox)


			test "email", ()->
				field = Field({type:'text', label:'Email', ID:'email', keyboard:'email', required:true}).appendTo(sandbox)
				field = Field({type:'text', label:'Email', keyboard:'email', mask:{guide:false}, required:true}).appendTo(sandbox)


			test "number (simluated)", ()->
				field = Field({type:'text', label:'Number (simluated)', keyboard:'number', validWhenRegex:/[^0]/, autoWidth:true}).appendTo(sandbox)


		suite "mask", ()->
			test "alpha", ()->
				field = Field({type:'text', label:'Full Name', mask:'aa+ aa+[ aa+]'}).appendTo(sandbox)

			test "numeric", ()->
				field = Field({type:'text', label:'Phone', mask:'#######+'}).appendTo(sandbox)
				field = Field({type:'text', label:'Phone', mask:'(111) 111-1111'}).appendTo(sandbox)

			test "alphanumeric", ()->
				field = Field({type:'text', label:'Licence Plate', mask:{pattern:'aaa-111', transform:(v)-> v.toUpperCase()}}).appendTo(sandbox)

			test "prefix", ()->
				field = Field({type:'text', label:'Dollar', ID:'theDollar', mask:{pattern:'NUMBER', prefix:'$'}, width:'48.5%', mobileWidth:'100%'}).appendTo(sandbox)

			test "date", ()->
				field = Field({type:'text', label:'Date', keyboard:'date', width:'48.5%', mobileWidth:'100%'}).appendTo(sandbox)

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
			assert.equal field.value, 'Apple'

		test "default value", ()->
			field = Field({type:'select', label:'My Choices (default)', choices:['Apple', 'Banana', 'Orange', {label:'Lemon', value:'lime', conditions:{'email':'valid'}}], value:'Banana'}).appendTo(sandbox)
			assert.equal field.value, 'Banana'

		test "cusotm border", ()->
			field = Field({type:'select', label:'Custom Border', choices:['Apple', 'Banana', 'Orange'], border:'0 0 2px 0', margin:'0 0 30px'}).appendTo(sandbox)

		test "no choices", ()->
			field = Field({type:'select', label:'No choices', autoWidth:true}).appendTo(sandbox)

		test "many choices", ()->
			companyNames = (require('faker').company.companyName() for i in [1..50])
			field = Field({type:'select', label:'Many Choices', choices:companyNames, autoWidth:true}).appendTo(sandbox)


	suite "choice field", ()->
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


	suite "truefalse field", ()->
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



