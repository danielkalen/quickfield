do ()->	
	### istanbul ignore next ###
	import * as DOM from 'quickdom/src'
	### istanbul ignore next ###
	import * as stringDistance from 'leven'
	### istanbul ignore next ###
	import * as extend from 'smart-extend'
	### istanbul ignore next ###
	import * as IS from '@danielkalen/is'
	### istanbul ignore next ###
	import * as SimplyBind from '@danielkalen/simplybind/debug'

	
	QuickField = (options)->
		options = {} unless IS.object(options)
		options.type ?= 'text'

		appendAnimationStyles() if not appendAnimationStyles.appended

		fieldInstance = Object.create(Field[options.type]::)
		return Field.call(fieldInstance, options)


	QuickField.registerField = (type, fieldProto)-> if IS.string(type) and IS.object(fieldProto)
		outputProto = Object.create(Field::)
		for method,func of fieldProto
			method = if method[0] is '_' then method.slice(1) else method
			method = '_'+method if helpers.includes(REQUIRED_FIELD_METHODS, method) and method isnt 'validate'
			outputProto[method] = func

		for requiredMethod in REQUIRED_FIELD_METHODS
			if not outputProto['_'+requiredMethod] or outputProto[requiredMethod]
				throw new Error "Field Registration: '#{requiredMethod}' is required in order to register the field"

		Field[type] = outputProto


	Object.defineProperty QuickField, 'fields', get: ()->
		extend.clone.own.notKeys('instances')(Field)









	import 'parts/consolePatch'
	import 'parts/constants'
	import 'parts/animations'
	import 'parts/svg'
	import 'parts/checks'
	import 'parts/regex'
	import 'parts/helpers'
	import 'parts/components'
	import 'parts/field'
	QuickField.SVG = SVG
	QuickField.version = import '../.config/.version'
	
	
	### istanbul ignore next ###
	if module?.exports?
		module.exports = QuickField
	else if typeof define is 'function' and define.amd
		define ['quickfield'], ()-> QuickField
	else
		@Field = QuickField