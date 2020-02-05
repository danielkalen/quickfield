import'@danielkalen/is';import'../../checks.js';import'quickdom';import'@danielkalen/simplybind';import'../../constants/regex.js';import {inheritProto}from'../../helpers.js';import'smart-extend';import'fastdom';import'../../components/condition.js';import'../../field/transformSettings.js';import'../../field/globalDefaults.js';import Field from'../../field/index.js';import'../../constants/colors.js';import'../../template-5aefd595.js';import'../choice/defaults.js';import ChoiceField from'../choice/index.js';import {t as template,d as templates}from'../../template-e5ca6869.js';import defaults from'./defaults.js';var TrueFalseField;

TrueFalseField = function () {
  class TrueFalseField extends Field {
    constructor() {
      super(...arguments);
      this.lastSelected = null;
      this.visibleChoicesCount = 2;
      this.choices = this.settings.choices;
      this.choices[0].label = this.settings.choiceLabels[0];
      this.choices[1].label = this.settings.choiceLabels[1];
      this.settings.perGroup = 2;

      this._createElements();

      this._attachBindings();

      this._constructorEnd();
    }

    _getValue() {
      if (this._value === null) {
        return null;
      } else {
        if (this._value.index === 0) {
          return true;
        } else {
          return false;
        }
      }
    }

    _setValue(newValue) {
      var ref;

      if (newValue === this.choices[0]) {
        newValue = this.choices[0].value;
      }

      if (newValue === this.choices[1]) {
        newValue = this.choices[1].value;
      }

      if (newValue === null) {
        this._value = null;

        if ((ref = this.lastSelected) != null) {
          ref.toggle(false);
        }

        return;
      }

      if (typeof newValue === 'string') {
        newValue = newValue.toLowerCase();

        if (newValue === 'false') {
          newValue = false;
        }
      }

      return (newValue ? this.choices[0] : this.choices[1]).toggle();
    }

    _validate(providedValue) {
      if (typeof providedValue === 'string') {
        providedValue = this.findChoice(providedValue);
      }

      if (this.settings.validWhenIsChoice) {
        if (providedValue) {
          if (this.settings.validWhenIsChoice !== providedValue.value) {
            return false;
          }
        } else {
          return false;
        }
      }

      if (this.settings.validWhenSelected) {
        if (!providedValue) {
          return false;
        }
      }

      if (this.settings.validWhenTrue) {
        if ((providedValue != null ? providedValue.index : void 0) !== 0) {
          return false;
        }
      }

      return true;
    }

  }
  TrueFalseField.prototype.template = template;
  TrueFalseField.prototype.templates = templates;
  TrueFalseField.prototype.defaults = defaults;
  return TrueFalseField;
}.call(undefined);

inheritProto(TrueFalseField, ChoiceField, ['_createElements', '_attachBindings', '_attachBindings_elState', '_attachBindings_stateTriggers', '_attachBindings_display', '_attachBindings_value']);
var TrueFalseField$1 = TrueFalseField;export default TrueFalseField$1;