Dropdown = import '../../components/dropdown'
helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom'
extend = import 'smart-extend'
SimplyBind = import '@danielkalen/simplybind'
TextField = import '../text'
import template,* as templates from './template'
import * as defaults from './defaults'

class TextareaField extends import '../'
	template: template
	templates: templates
	defaults: defaults

	_getValue: ()->
		return @_value

	_setValue: (newValue)-> if IS.string(newValue) or IS.number(newValue)
		@_value = String(newValue)


	constructor: ()->
		super
		@_value ?= ''
		@state.height = if @settings.autoHeight then 'auto' else @settings.height
		@state.typing = false
		@cursor = prev:0, current:0

		@_createElements()
		@_attachBindings()
		@_constructorEnd()


	_createElements: ()->
		forceOpts = {relatedInstance:@}
		@el = @template.spawn(@settings.templates.defaults, forceOpts)

		@el.state 'hasLabel', @settings.label
		@el.child.innerwrap.raw._quickField = @el.child.input.raw._quickField = @
		return


	_attachBindings: ()->
		@_attachBindings_elState()
		@_attachBindings_display()
		@_attachBindings_display_autoWidth()
		@_attachBindings_display_autoHeight()
		@_attachBindings_value()
		@_attachBindings_autocomplete()
		@_attachBindings_stateTriggers()
		return


	_attachBindings_display_autoHeight: ()->
		SimplyBind('height', updateEvenIfSame:true).of(@state)
			.transformSelf (value)-> if isNaN(value) and isNaN(parseFloat(value)) then 'auto' else value
			.to (height)=> @el.child.innerwrap.style('height', height)
			.updateOn('event:inserted').of(@)

		if @settings.autoHeight
			SimplyBind('_value', updateEvenIfSame:true, updateOnBind:false).of(@)
				.to('height').of(@state)
					.transform ()=> @_getInputAutoHeight()
					.updateOn('event:inserted').of(@)
			
		return


	_attachBindings_display_autoWidth: ()->
		SimplyBind('width', updateEvenIfSame:true).of(@state)
			.to (width)=> (if @settings.autoWidth then @el.child.innerwrap else @el).style('width', width)
			.transform (width)=> if @state.isMobile then (@settings.mobileWidth or width) else width
			.updateOn('isMobile').of(@state)

		if @settings.autoWidth
			SimplyBind('_value', updateEvenIfSame:true, updateOnBind:false).of(@)
				.to('width').of(@state)
					.transform ()=> @_getInputAutoWidth()
					.updateOn('event:inserted').of(@)
		return


	_attachBindings_value: ()->
		input = @el.child.input.raw

		SimplyBind('event:input').of(input).to ()=>
			@value = input.value

		SimplyBind('_value').of(@)
			.to('value').of(input)
			.and.to (value)=>
				@state.filled = !!value
				@state.interacted = true if value
				@state.valid = @validate(null, true)
				@emit('input', value)
		
		return


	_attachBindings_autocomplete: ()->



	_getInputAutoHeight: ()->
		prevHeight = @el.child.input.raw.style.height
		
		if @_value
			@_setValueIfNotSet()
			@el.child.input.style('height', 0)
			inputHeight = @el.child.input.raw.scrollHeight+2
			inputHeight += @el.child.input.styleParsed('marginTop') + @el.child.input.styleParsed('marginBottom')
		else
			inputHeight = @el.child.placeholder.height
		
		@el.child.input.style('height', prevHeight)
		return Math.min @settings.maxHeight, Math.max(inputHeight, @settings.minHeight)



	_getInputAutoWidth: ()->
		if @_value
			@_setValueIfNotSet()
			@el.child.input.style(width:0, whiteSpace:'nowrap').raw.scrollLeft = 1e+10
			inputPadding = @el.child.input.styleParsed('paddingLeft') or @el.child.input.styleParsed('padding')
			inputWidth = Math.max(@el.child.input.raw.scrollLeft+@el.child.input.raw.offsetWidth, @el.child.input.raw.scrollWidth) + 2 + inputPadding+1
			labelWidth = if @settings.label and @el.child.label.styleSafe('position') is 'absolute' then @el.child.label.rect.width else 0
		else
			inputWidth = @el.child.placeholder.rect.width
			labelWidth = 0
		
		@el.child.input.style(width:'100%', whiteSpace:'normal')
		return Math.min @_getMaxWidth(), Math.max(inputWidth, labelWidth)



extend.notKeys(TextareaField::)(TextareaField::, TextField::)






















module.exports = TextareaField