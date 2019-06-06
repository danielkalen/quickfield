import'quickcss';import registerAnimations from'./animations.js';import'@danielkalen/is';import IS from'./checks.js';import'./consolePatch.js';import'quickdom';import'@danielkalen/simplybind';import'./constants/regex.js';import'./helpers.js';import extend from'smart-extend';import REQUIRED_FIELD_METHODS from'./constants/reqFieldMethods.js';import'fastdom';import'./components/condition.js';import'./field/transformSettings.js';import'./field/globalDefaults.js';import Field from'./field/index.js';import'./constants/keyCodes.js';import'./svg/checkmark.js';import'./svg/angleDown.js';import'./svg/caretUp.js';import'./svg/caretDown.js';import'./svg/plus.js';import'./svg/clone.js';import'./svg/remove.js';import'./components/dropdown/template-b961f81f.js';import'./components/dropdown/defaults.js';import'./components/dropdown/index.js';import'text-mask-core';import'text-mask-addons';import'./components/mask.js';import'./constants/colors.js';import'./fields/text/template-233e9413.js';import'./fields/text/defaults.js';import TextField from'./fields/text/index.js';var version = "1.0.97";var createBuilder, quickfield;

createBuilder = function (settingOverrides, templateOverrides) {
  var builder;

  builder = function (settings) {
    if (arguments.length > 1) {
      settings = extend.clone(...arguments);
    }

    if (!IS.object(settings)) {
      settings = {};
    }

    if (settings.type == null) {
      settings.type = 'text';
    }

    if (!Field[settings.type]) {
      throw new Error(`QuickField: '${settings.type}' is not a valid/registered field type`);
    }

    registerAnimations();
    return new Field[settings.type](settings, builder, settingOverrides, templateOverrides);
  };

  builder.register = function (type, targetField) {
    var i, len, requiredMethod;

    if (!IS.string(type) || !IS.function(targetField)) {
      throw new Error("QuickField Registration: invalid arguments");
    }

    for (i = 0, len = REQUIRED_FIELD_METHODS.length; i < len; i++) {
      requiredMethod = REQUIRED_FIELD_METHODS[i];

      if (!targetField.prototype[requiredMethod]) {
        throw new Error(`QuickField Registration: '${requiredMethod}' method is required in order to register the field`);
      }
    }

    Field[type] = targetField;
    return this;
  };

  builder.config = function (newSettings, newTemplates) {
    var config, globalConfig, name$$1, originalTemplates, outputSettings, outputTemplates, ref, templates, type;

    if (!IS.object(newSettings)) {
      throw new Error(`QuickField Config: invalid config object provided ${String(newSettings)}`);
    }

    outputSettings = Object.create(null);

    for (type in newSettings) {
      config = newSettings[type];

      if (type === 'global') {
        outputSettings.globalDefaults = extend.deep.notDeep(Field.shallowSettings).clone(Field.prototype.globalDefaults, config);
      } else if (Field[type]) {
        outputSettings[type] = extend.clone.deep.notDeep(Field.shallowSettings)(Field[type].prototype.defaults, config);
      }
    }

    if (IS.object(newTemplates)) {
      outputTemplates = Object.create(null);
      globalConfig = newTemplates.global;

      if (globalConfig && globalConfig.field && !globalConfig.default) {
        globalConfig.default = globalConfig.field;
      }

      for (type in Field) {
        originalTemplates = (ref = Field[type].prototype) != null ? ref.templates : void 0;
        templates = newTemplates[type] || globalConfig;

        if (!originalTemplates) {
          continue;
        }

        if (!templates) {
          outputTemplates[type] = originalTemplates;
          continue;
        }

        if (templates.field && !templates.default) {
          templates.default = templates.field;
        }

        outputTemplates[type] = Object.create(null);

        for (name$$1 in templates) {
          config = templates[name$$1];

          if (name$$1 === 'field' || !originalTemplates[name$$1]) {
            continue;
          }

          if (globalConfig && globalConfig[name$$1]) {
            config = extend.clone.deep.concat(globalConfig[name$$1], config);
          }

          outputTemplates[type][name$$1] = originalTemplates[name$$1].extend(config);
        }

        for (name$$1 in originalTemplates) {
          config = originalTemplates[name$$1];

          if (!outputTemplates[type][name$$1]) {
            outputTemplates[type][name$$1] = config;
          }
        }
      }
    }

    return createBuilder(outputSettings, outputTemplates);
  };

  Object.defineProperty(builder, 'fields', {
    get: function () {
      return extend.clone.own.notKeys('instances')(Field);
    }
  });
  builder.settingOverrides = settingOverrides;
  builder.templateOverrides = templateOverrides;
  builder.version = version;
  builder.Field = Field;
  return builder;
};
// import NumberField from './fields/number'
// import SelectField from './fields/select'
// import ChoiceField from './fields/choice'
// import TruefalseField from './fields/truefalse'
// import ToggleField from './fields/toggle'
// import GroupField from './fields/group'
// import RepeaterField from './fields/repeater'
// import FileField from './fields/file'
// import CheckboxField from './fields/checkbox'

quickfield = createBuilder();
quickfield.register('text', TextField); // quickfield.register 'textarea', TextareaField
// quickfield.register 'number', NumberField
// quickfield.register 'select', SelectField
// quickfield.register 'choice', ChoiceField
// quickfield.register 'truefalse', TruefalseField
// quickfield.register 'toggle', ToggleField
// quickfield.register 'group', GroupField
// quickfield.register 'repeater', RepeaterField
// quickfield.register 'checkbox', FileField
// quickfield.register 'file', CheckboxField

var quickfield$1 = quickfield;export default quickfield$1;