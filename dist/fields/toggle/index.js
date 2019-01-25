import'@danielkalen/is';import'../../checks.js';import'quickdom';import SimplyBind from'@danielkalen/simplybind';import'../../constants/regex.js';import {inheritProto}from'../../helpers.js';import'smart-extend';import'fastdom';import'../../components/condition.js';import'../../field/transformSettings.js';import'../../field/globalDefaults.js';import Field from'../../field/index.js';import'../../constants/colors.js';import'../choice/defaults.js';import'../choice/template-c88fa95b.js';import'../choice/index.js';import defaults from'./defaults.js';import'../truefalse/template-3d6c54a0.js';import'../truefalse/defaults.js';import TrueFalseField from'../truefalse/index.js';import {a as template,b as templates}from'./template-bf7b99c1.js';var ToggleField;

ToggleField = function () {
  class ToggleField extends Field {
    constructor() {
      super(...arguments);
      this._value = !!this._value;
      this.settings.size = parseFloat(this.settings.size) || defaults.size;

      if (this.settings.style !== 'centered' && this.settings.style !== 'aligned') {
        this.settings.style = defaults.style;
      }

      this._createElements();

      this._attachBindings();

      this._constructorEnd();
    }

    _getValue() {
      return this._value;
    }

    _setValue(newValue) {
      return this._value = !!newValue;
    }

    _createElements() {
      var forceOpts;
      forceOpts = {
        relatedInstance: this
      };
      this.el = this.template.spawn(this.settings.templates.default, forceOpts);
      this.el.state('alignedStyle', this.settings.style === 'aligned').child.innerwrap.raw._quickField = this;
    }

    _attachBindings() {
      this._attachBindings_elState();

      this._attachBindings_stateTriggers();

      this._attachBindings_display();

      this._attachBindings_value();
    }

    _attachBindings_value() {
      SimplyBind('_value').of(this).to(value => {
        return this.el.state('toggled', value);
      });
      SimplyBind('_value', {
        updateOnBind: false
      }).of(this).to(value => {
        return this.emit('input', value);
      });
      SimplyBind(`event:${this.settings.triggerEvent}`).of(this.el.child.input).to(() => {
        return this.value = !this._value;
      });
    }

    _validate(providedValue) {
      if (this.settings.validWhenTrue) {
        if (!providedValue) {
          return false;
        }
      }

      return true;
    }

  }
  ToggleField.prototype.template = template;
  ToggleField.prototype.templates = templates;
  ToggleField.prototype.defaults = defaults;
  return ToggleField;
}.call(undefined);

inheritProto(ToggleField, TrueFalseField, ['_attachBindings_elState', '_attachBindings_stateTriggers', '_attachBindings_display']);
var ToggleField$1 = ToggleField;export default ToggleField$1;