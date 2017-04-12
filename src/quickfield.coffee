do ()->	
	helpers = import 'parts/helpers'
	IS = import '@danielkalen/is'
	DOM = import 'quickdom/src'
	extend = import 'smart-extend'
	REQUIRED_FIELD_METHODS = import 'parts/constants/reqFieldMethods'
	import 'parts/consolePatch'
	import 'parts/animations'
	import 'parts/checks'

	
	QuickField = (options)->
		options = {} unless IS.object(options)
		options.type ?= 'text'

		appendAnimationStyles() if not appendAnimationStyles.appended

		fieldInstance = Object.create(Field[options.type])
		return Field.call(fieldInstance, options)


	QuickField.register = (type, fieldProto)-> if IS.string(type) and IS.object(fieldProto)
		outputProto = Object.create(Field::)
		outputProto[method] = func for method,func of fieldProto

		for requiredMethod in REQUIRED_FIELD_METHODS
			if not outputProto[requiredMethod]
				throw new Error "QuickField Registration: '#{requiredMethod}' method is required in order to register the field"

		Field[type] = outputProto


	Object.defineProperty QuickField, 'fields', get: ()->
		extend.clone.own.notKeys('instances')(Field)






	QuickField.regex = import 'parts/regex'
	QuickField.version = import '../.config/.version'
	QuickField.constants = import 'parts/constants'
	QuickField.SVG = import 'parts/svg'
	QuickField.Field = Field = import 'parts/field'
	import 'parts/field/baseFields'

	
	### istanbul ignore next ###
	if module?.exports?
		module.exports = QuickField
	else if typeof define is 'function' and define.amd
		define ['quickfield'], ()-> QuickField
	else
		@QuickField = QuickField