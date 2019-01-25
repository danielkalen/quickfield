import DOM from 'quickdom'
import IS from './checks'
import extend from 'smart-extend'
import registerAnimations from './animations'
import REQUIRED_FIELD_METHODS from './constants/reqFieldMethods'
import './consolePatch'
import {version} from '../package.json'
import Field from './field'


createBuilder = (settingOverrides, templateOverrides)->
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

		return createBuilder(outputSettings, outputTemplates)

	
	Object.defineProperty builder, 'fields', get: ()->
		extend.clone.own.notKeys('instances')(Field)

	builder.settingOverrides = settingOverrides
	builder.templateOverrides = templateOverrides
	builder.version = version
	builder.Field = Field
	return builder






import TextField from './fields/text'
# import TextareaField from './fields/textarea'
# import NumberField from './fields/number'
# import SelectField from './fields/select'
# import ChoiceField from './fields/choice'
# import TruefalseField from './fields/truefalse'
# import ToggleField from './fields/toggle'
# import GroupField from './fields/group'
# import RepeaterField from './fields/repeater'
# import FileField from './fields/file'
# import CheckboxField from './fields/checkbox'

quickfield = createBuilder()
quickfield.register 'text', TextField
# quickfield.register 'textarea', TextareaField
# quickfield.register 'number', NumberField
# quickfield.register 'select', SelectField
# quickfield.register 'choice', ChoiceField
# quickfield.register 'truefalse', TruefalseField
# quickfield.register 'toggle', ToggleField
# quickfield.register 'group', GroupField
# quickfield.register 'repeater', RepeaterField
# quickfield.register 'checkbox', FileField
# quickfield.register 'file', CheckboxField

export default quickfield