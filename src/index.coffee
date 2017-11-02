helpers = import './helpers'
DOM = import 'quickdom'
IS = import './checks'
extend = import 'smart-extend'
registerAnimations = import './animations'
REQUIRED_FIELD_METHODS = import './constants/reqFieldMethods'
import './consolePatch'


newBuilder = (settingOverrides, templateOverrides)->
	builder = (settings)->
		settings = extend.clone(arguments...) if arguments.length > 1
		settings = {} unless IS.object(settings)
		settings.type ?= 'text'


		if not Field[settings.type]
			throw new Error "QuickField: '#{settings.type}' is not a valid/registered field type"

		registerAnimations()
		new Field[settings.type](settings, builder, settingOverrides, templateOverrides)


	builder.register = (type, targetField)->
		if not IS.string(type) or not IS.function(targetField)
			throw new Error "QuickField Registration: invalid arguments"
		for requiredMethod in REQUIRED_FIELD_METHODS
			if not targetField::[requiredMethod]
				throw new Error "QuickField Registration: '#{requiredMethod}' method is required in order to register the field"

		Field[type] = targetField
		return @


	builder.config = (newSettings, newTemplates)->
		throw new Error "QuickField Config: invalid config object provided #{String newSettings}" if not IS.object(newSettings)
		outputSettings = Object.create(null)
		
		for type,config of newSettings
			if type is 'global'
				outputSettings.globalDefaults = extend.deep.notDeep(Field.shallowSettings).clone(Field::globalDefaults, config)
			else if Field[type]
				outputSettings[type] = extend.clone.deep.notDeep(Field.shallowSettings)(Field[type]::defaults, config)

		if IS.object(newTemplates)
			outputTemplates = Object.create(null)
			globalConfig = newTemplates.global
			if globalConfig and globalConfig.field and not globalConfig.default
				globalConfig.default = globalConfig.field
			
			for type of Field
				originalTemplates = Field[type]::?.templates
				templates = newTemplates[type] or globalConfig
				if not originalTemplates
					continue
				if not templates
					outputTemplates[type] = originalTemplates
					continue
				
				if templates.field and not templates.default
					templates.default = templates.field

				outputTemplates[type] = Object.create(null)
				
				for name,config of templates
					continue if name is 'field' or not originalTemplates[name]
					config = extend.clone.deep.concat(globalConfig[name], config) if globalConfig and globalConfig[name]
					outputTemplates[type][name] = originalTemplates[name].extend(config)

				for name,config of originalTemplates when not outputTemplates[type][name]
					outputTemplates[type][name] = config

		return newBuilder(outputSettings, outputTemplates)

	
	Object.defineProperty builder, 'fields', get: ()->
		extend.clone.own.notKeys('instances')(Field)

	builder.settingOverrides = settingOverrides
	builder.templateOverrides = templateOverrides
	builder.version = import '../package.json $ version'
	builder.Field = Field = import './field'
	return builder






QuickField = newBuilder()
QuickField.register 'text', import './field/text'
# QuickField.register 'textarea', import './field/textarea'
# QuickField.register 'number', import './field/number'
# QuickField.register 'select', import './field/select'
# QuickField.register 'choice', import './field/choice'
# QuickField.register 'truefalse', import './field/truefalse'
# QuickField.register 'toggle', import './field/toggle'
# QuickField.register 'group', import './field/group'
# QuickField.register 'repeater', import './field/repeater'
# QuickField.register 'file', import './field/file'
module.exports = QuickField