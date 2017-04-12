Dropdown = import '../../components/dropdown'
Mask = import '../../components/mask'
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
	'_attachBindings_elState'
	'_attachBindings_display'
	'_attachBindings_display_autoWidth'
	'_attachBindings_stateTriggers'
	'validate'
	'selection'
	'focus'
	'blur'
])(TextareaField, TextField)

TextareaField._construct = ()->
	@state.typing = false
	@cursor = prev:0, current:0
	@helpMessage = if @settings.alwaysShowHelp then @settings.help else ''
		
	return


TextareaField._createElements = ()->
	forceOpts = {relatedInstance:@, styleAfterInsert:true}
	@el = @_templates.field.spawn(@settings.templates.field, forceOpts)

	@el.state 'hasLabel', @settings.label
	@el.child.innerwrap.raw._quickField = @el.child.input.raw._quickField = @
	return


TextareaField._attachBindings = ()->
	@_attachBindings_elState()
	@_attachBindings_display()
	@_attachBindings_display_autoHeight()
	@_attachBindings_display_autoWidth()
	@_attachBindings_value()
	@_attachBindings_autocomplete()
	@_attachBindings_stateTriggers()
	return


TextField._attachBindings_display_autoHeight = ()->
	if @settings.autoHeight and false
		SimplyBind('_value', updateEvenIfSame:true, updateOnBind:false).of(@)
			.to (hasValue)=>
				if hasValue
					@el.child.input.style('height', 0)
					@el.child.input.raw.scrollLeft = 1e+10
					inputHeight = Math.max(@el.child.input.raw.scrollLeft+@el.child.input.raw.offsetHeight, @el.child.input.raw.scrollHeight) + 2
					labelHeight = if @el.child.label.styleSafe('position') is 'absolute' then @el.child.label.rect.height else 0
				else
					inputHeight = @el.child.placeholder.rect.height
					labelHeight = 0
				
				finalHeight = Math.max(inputHeight, labelHeight, minWidth)
				@el.child.input.height = "#{finalHeight}px"
			
			.updateOn('event:inserted').of(@)
	return


TextareaField._attachBindings_value = ()->
	SimplyBind('value').of(@el.child.input.raw)
		.to('_value').of(@).bothWays()
			.pipe('valueRaw').of(@)
				.transform (value)=> if @mask then @mask.valueRaw else value

	SimplyBind('_value').of(@).to (value)=>
		@state.filled = !!value
		@state.interacted = true if value
		@state.valid = @validate()
		@emit('input')
	
	return






























module.exports = TextareaField