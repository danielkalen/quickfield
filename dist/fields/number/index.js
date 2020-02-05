import'@danielkalen/is';import'../../checks.js';import'quickdom';import SimplyBind from'@danielkalen/simplybind';import'../../constants/regex.js';import {inheritProto}from'../../helpers.js';import extend from'smart-extend';import'fastdom';import'../../components/condition.js';import'../../field/transformSettings.js';import'../../field/globalDefaults.js';import Field from'../../field/index.js';import KEYCODES from'../../constants/keyCodes.js';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import'../../svg/caretUp.js';import'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import'../../template-f2a8f8f1.js';import'../../components/dropdown/defaults.js';import'../../components/dropdown/index.js';import'text-mask-core';import'text-mask-addons';import'../../components/mask.js';import'../../constants/colors.js';import'../../template-689295d2.js';import'../text/defaults.js';import TextField from'../text/index.js';import defaults from'./defaults.js';import {t as template,a as templates,b as buttons}from'../../template-f41ef25a.js';var NumberField;

NumberField = function () {
  class NumberField extends Field {
    constructor() {
      var ref;
      super(...arguments);

      if (this._value == null) {
        this._value = '';
      }

      if (this.settings.enforce && this.settings.minValue && this.settings.minValue !== -2e308) {
        this._value || (this._value = this.settings.minValue);
      }

      this.settings.step = Number(this.settings.step) || 1;
      this.state.typing = false;
      this.cursor = {
        prev: 0,
        current: 0
      };
      this.precision = ((ref = this.settings.step.toString().split('.')[1]) != null ? ref.length : void 0) || 0;

      this._createElements();

      this._attachBindings();

      this._constructorEnd();
    }

    _getValue() {
      return Number(this._value) || 0;
    }

    _setValue(newValue) {
      return this._value = this._normalizeValue(newValue, this.settings.enforce);
    }

    _createElements() {
      var globalOpts;
      globalOpts = {
        relatedInstance: this
      };
      this.el = this.template.spawn(this.settings.templates.defaults, globalOpts);

      if (this.settings.buttons) {
        buttons.spawn(this.settings.templates.buttons, globalOpts).insertAfter(this.el.child.input);
      }

      this.el.state('hasLabel', this.settings.label);
      this.el.child.innerwrap.raw._quickField = this.el.childf.input.raw._quickField = this;
    }

    _attachBindings() {
      this._attachBindings_elState();

      this._attachBindings_display();

      this._attachBindings_display_autoWidth();

      this._attachBindings_value();

      this._attachBindings_stateTriggers();

      this._attachBindings_stepEvents();
    }

    _attachBindings_value() {
      var input;
      input = this.el.child.input.raw;
      SimplyBind('event:input').of(input).to(() => {
        var newValue, selectNumberPart;
        this.cursor.prev = this.cursor.current;
        this.cursor.current = this.selection().end;
        newValue = input.value;

        if (newValue[newValue.length - 1] === '-') {
          if (this.settings.minValue > -1) {
            newValue = this._value;
          } else {
            newValue = -1;
            selectNumberPart = true;
          }
        }

        this._setValue(newValue);

        if (this.state.focused) {
          if (selectNumberPart) {
            return this.selection(1, 2);
          } else {
            return this.selection(this.cursor.current, this.cursor.current + (String(this._value).length - newValue.length));
          }
        }
      });
      SimplyBind('_value').of(this).to('value').of(input).and.to(value => {
        this.state.filled = !!String(value);

        if (String(value)) {
          this.state.interacted = true;
        }

        this.state.valid = this.validate(void 0, true);
        return this.emit('input', value);
      });
      SimplyBind('event:blur').of(input).to(() => {
        var value;

        if (!this.settings.enforce) {
          value = Number(this._value) || 0;

          if (value === 0 || !this.state.interacted && value === this.settings.minValue) {
            return this._value = '';
          }
        }
      });
      SimplyBind('event:keydown').of(this.el.child.input).to(event => {
        if (event.keyCode === KEYCODES.enter) {
          this.emit('submit');
        }

        return this.emit(`key-${event.keyCode}`);
      });
    }

    _attachBindings_stepEvents() {
      var stopPropagation;
      SimplyBind('event:keydown').of(this.el.child.input).to(event => {
        switch (event.keyCode) {
          case KEYCODES.up:
            event.preventDefault();
            return this.stepUp();

          case KEYCODES.down:
            event.preventDefault();
            return this.stepDown();
        }
      });

      if (this.settings.buttons) {
        stopPropagation = function (event) {
          event.preventDefault();
          return event.stopPropagation();
        };

        SimplyBind('event:click').of(this.el.child.stepUp).to(this.stepUp.bind(this)).and.to(stopPropagation);
        SimplyBind('event:click').of(this.el.child.stepDown).to(this.stepDown.bind(this)).and.to(stopPropagation);
      }
    }

    _setValueIfNotSet() {
      if (Number(this.el.child.input.raw.value) !== this._value) {
        return this.el.child.input.raw.value = this._value;
      }
    }

    _normalizeValue(value, enforce) {
      value = value ? parseFloat(value) || 0 : 0;

      if (value % this.settings.step && enforce) {
        if (value < this.settings.step) {
          value = this.settings.step;
        } else {
          value = this._roundToNearest(value, this.settings.step);
        }
      }

      if (value < this.settings.minValue) {
        value = this.settings.minValue;
      }

      if (value > this.settings.maxValue) {
        value = this.settings.maxValue;
      }

      return value;
    }

    _roundToNearest(value, target) {
      var multiplier;
      value = (value || 0).toFixed(this.precision) * 1;
      multiplier = target < 1 ? 1 / target : 1;
      target *= multiplier;
      value *= multiplier;
      value = Math.ceil(value / target) * target / multiplier;
      return value;
    }

    stepUp() {
      var newValue, rounded;
      rounded = this._roundToNearest(this._value, this.settings.step);
      newValue = Math.min(rounded + this.settings.step, this._value + this.settings.step);
      return this._setValue(this._roundToNearest(newValue, this.settings.step));
    }

    stepDown() {
      var newValue, rounded;
      rounded = this._roundToNearest(this._value, this.settings.step);
      newValue = Math.max(rounded - this.settings.step, this._value - this.settings.step);
      return this._setValue(this._roundToNearest(newValue, this.settings.step));
    }

  }
  NumberField.prototype.template = template;
  NumberField.prototype.templates = templates;
  NumberField.prototype.defaults = defaults;
  inheritProto(NumberField, TextField);
  return NumberField;
}.call(undefined);

extend.notKeys(NumberField.prototype)(NumberField.prototype, TextField.prototype);
var NumberField$1 = NumberField;export default NumberField$1;