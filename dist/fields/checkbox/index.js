import'@danielkalen/is';import'../../checks.js';import'quickdom';import SimplyBind from'@danielkalen/simplybind';import'../../constants/regex.js';import {inheritProto}from'../../helpers.js';import'smart-extend';import'fastdom';import'../../components/condition.js';import'../../field/transformSettings.js';import'../../field/globalDefaults.js';import Field from'../../field/index.js';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import'../../svg/caretUp.js';import'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import'../../constants/colors.js';import defaults from'./defaults.js';import {a as template,b as templates}from'./template-0b907bbe.js';import'../choice/template-c88fa95b.js';import'../choice/defaults.js';import ChoiceField from'../choice/index.js';var CheckboxField;

CheckboxField = function () {
  class CheckboxField extends Field {
    constructor() {
      super(...arguments);
      this._value = !!this._value;
      this.settings.size = parseFloat(this.settings.size) || defaults.size;

      if (this.settings.display !== 'block' && this.settings.display !== 'inline') {
        this.settings.display = defaults.display;
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
      this.el.child.innerwrap.raw._quickField = this;
    }

    _attachBindings() {
      this._attachBindings_elState();

      this._attachBindings_stateTriggers();

      this._attachBindings_display();

      this._attachBindings_value();

      setTimeout(() => {
        return SimplyBind('label').of(this.state).to('html').of(this.el.child.label);
      });
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
      SimplyBind("event:click").of(this.el.child.input).to(() => {
        return this.value = !this._value;
      });

      if (this.settings.labelClicks) {
        SimplyBind("event:click").of(this.el.child.label).to(() => {
          return this.value = !this._value;
        });
      }
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
  CheckboxField.prototype.template = template;
  CheckboxField.prototype.templates = templates;
  CheckboxField.prototype.defaults = defaults;
  return CheckboxField;
}.call(undefined);

inheritProto(CheckboxField, ChoiceField, ['_attachBindings_elState', '_attachBindings_stateTriggers', '_attachBindings_display']);
var CheckboxField$1 = CheckboxField;export default CheckboxField$1;