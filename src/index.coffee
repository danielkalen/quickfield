helpers = import './helpers'
IS = import '@danielkalen/is'
DOM = import 'quickdom'
extend = import 'smart-extend'
registerAnimations = import './animations'
REQUIRED_FIELD_METHODS = import './constants/reqFieldMethods'
import './consolePatch'
import './checks'


QuickField = (settings)->
	settings = {} unless IS.object(settings)
	settings.type ?= 'text'

	if not Field[settings.type]
		throw new Error "QuickField: '#{settings.type}' is not a valid/registered field type"

	registerAnimations()
	new Field[settings.type](settings)


QuickField.register = (type, targetField)-> if IS.string(type) and IS.function(targetField)
	for requiredMethod in REQUIRED_FIELD_METHODS
		if not targetField::[requiredMethod]
			throw new Error "QuickField Registration: '#{requiredMethod}' method is required in order to register the field"

	Field[type] = targetField


Object.defineProperty QuickField, 'fields', get: ()->
	extend.clone.own.notKeys('instances')(Field)






QuickField.version = import '../package.json $ version'
QuickField.constants = import './constants'
QuickField.SVG = import './svg'
QuickField.defaults = import './field/globalDefaults'
QuickField.Field = Field = import './field'
import './field/baseFields'

module.exports = QuickField