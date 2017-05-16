Dropdown = import '../../components/dropdown'
helpers = import '../../helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom/src'
extend = import 'smart-extend'
SimplyBind = import '@danielkalen/simplybind/debug'
TextField = import '../text'

TextareaField = Object.create(null)
TextareaField._templates = import ./templates
TextareaField._defaults = import ./defaults
extend.keys([
	'_getValue'
	'_setValue'
	'_setValueIfNotSet'
	'_getMaxWidth'
	'_attachBindings_elState'
	'_attachBindings_display'
	'_attachBindings_stateTriggers'
	'validate'
	'selection'
	'focus'
	'blur'
])(TextareaField, TextField)

TextareaField._construct = ()->
	@_value ?= ''
	@state.height = if @settings.autoHeight then 'auto' else @settings.height
	@state.typing = false
	@cursor = prev:0, current:0
		
	return


TextareaField._createElements = ()->
	forceOpts = {relatedInstance:@}
	@el = @_templates.field.spawn(@settings.templates.field, forceOpts)

	@el.state 'hasLabel', @settings.label
	@el.child.innerwrap.raw._quickField = @el.child.input.raw._quickField = @
	return


TextareaField._attachBindings = ()->
	@_attachBindings_elState()
	@_attachBindings_display()
	@_attachBindings_display_autoWidth()
	@_attachBindings_display_autoHeight()
	@_attachBindings_value()
	@_attachBindings_autocomplete()
	@_attachBindings_stateTriggers()
	return


TextareaField._attachBindings_display_autoHeight = ()->	
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


TextareaField._attachBindings_display_autoWidth = ()->
	SimplyBind('width', updateEvenIfSame:true).of(@state)
		.to (width)=> (if @settings.autoWidth then @el.child.innerwrap else @el).style('width', width)

	if @settings.autoWidth
		SimplyBind('_value', updateEvenIfSame:true, updateOnBind:false).of(@)
			.to('width').of(@state)
				.transform ()=> @_getInputAutoWidth()
				.updateOn('event:inserted').of(@)
	return


TextareaField._attachBindings_value = ()->
	SimplyBind('_value').of(@)
		.to('value').of(@el.child.input.raw).bothWays()
		.and.to('valueRaw').of(@)
			.transform (value)=> if @mask then @mask.valueRaw else value

	SimplyBind('_value').of(@).to (value)=>
		@state.filled = !!value
		@state.interacted = true if value
		@state.valid = @validate()
		@emit('input', value)
	
	return


TextareaField._attachBindings_autocomplete = ()->



TextareaField._getInputAutoHeight = ()->
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



TextareaField._getInputAutoWidth = ()->
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


























module.exports = TextareaField