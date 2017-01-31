do ()->	
	### istanbul ignore next ###
	# import * as CSS from 'quickcss'
	### istanbul ignore next ###
	import * as DOM from 'quickdom/src'
	### istanbul ignore next ###
	import * as extend from 'smart-extend'
	### istanbul ignore next ###
	import * as IS from '@danielkalen/is'
	### istanbul ignore next ###
	import * as SimplyBind from '@danielkalen/simplybind'

	
	QuickField = (options)->
		options = {} unless IS.object(options)
		options.type ?= 'text'

		fieldInstance = Object.create(Field[options.type]::)
		return Field.call(fieldInstance, options)


	QuickField.registerField = (type, fieldProto)-> if IS.string(type) and IS.object(fieldProto)
		outputProto = Object.create(Field::)
		for method,func of fieldProto
			outputProto[if method[0] is '_' then method else "_#{method}"] = func

		Field[type] = outputProto









	import 'parts/regex'
	import 'parts/helpers'
	import 'parts/components'
	import 'parts/field'
	QuickField.version = import '../.config/.version'
	
	
	### istanbul ignore next ###
	if exports?.module?
		module.exports = QuickField
	else if typeof define is 'function' and define.amd
		define ['quickfield'], ()-> QuickField
	else
		@Field = QuickField