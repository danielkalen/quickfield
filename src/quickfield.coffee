helpers = import 'parts/helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom'
extend = import 'smart-extend'
registerAnimations = import 'parts/animations'
REQUIRED_FIELD_METHODS = import 'parts/constants/reqFieldMethods'
import 'parts/consolePatch'
import 'parts/checks'


QuickField = (options)->
	options = {} unless IS.object(options)
	options.type ?= 'text'

	if not Field[options.type]
		throw new Error "QuickField: '#{options.type}' is not a valid/registered field type"

	registerAnimations()
	new Field[options.type](options)


QuickField.register = (type, targetField)-> if IS.string(type) and IS.function(targetField)
	for requiredMethod in REQUIRED_FIELD_METHODS
		if not targetField::[requiredMethod]
			throw new Error "QuickField Registration: '#{requiredMethod}' method is required in order to register the field"

	Field[type] = targetField


Object.defineProperty QuickField, 'fields', get: ()->
	extend.clone.own.notKeys('instances')(Field)






QuickField.version = import '../package.json $ version'
QuickField.regex = import 'parts/regex'
QuickField.constants = import 'parts/constants'
QuickField.SVG = import 'parts/svg'
QuickField.defaults = import 'parts/field/globalDefaults'
QuickField.Field = Field = import 'parts/field'
import 'parts/field/baseFields'

module.exports = QuickField