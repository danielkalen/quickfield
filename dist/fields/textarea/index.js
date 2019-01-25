import'@danielkalen/is';import IS from'../../checks.js';import'quickdom';import SimplyBind from'@danielkalen/simplybind';import'../../constants/regex.js';import {inheritProto}from'../../helpers.js';import'smart-extend';import'fastdom';import'../../components/condition.js';import'../../field/transformSettings.js';import'../../field/globalDefaults.js';import Field from'../../field/index.js';import'../../constants/keyCodes.js';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import'../../svg/caretUp.js';import'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import'../../components/dropdown/template-b961f81f.js';import'../../components/dropdown/defaults.js';import'../../components/dropdown/index.js';import'text-mask-core';import'text-mask-addons';import'../../components/mask.js';import'../../constants/colors.js';import'../text/template-233e9413.js';import'../text/defaults.js';import TextField from'../text/index.js';import defaults from'./defaults.js';import {a as template,b as templates}from'./template-65feda05.js';var TextareaField;

TextareaField = function () {
  class TextareaField extends Field {
    constructor() {
      super(...arguments);

      if (this._value == null) {
        this._value = '';
      }

      this.state.height = this.settings.autoHeight ? 'auto' : this.settings.height;
      this.state.typing = false;
      this.cursor = {
        prev: 0,
        current: 0
      };

      this._createElements();

      this._attachBindings();

      this._constructorEnd();
    }

    _getValue() {
      return this._value;
    }

    _setValue(newValue) {
      if (IS.string(newValue) || IS.number(newValue)) {
        return this._value = String(newValue);
      }
    }

    _recalcDisplay() {
      if (this.settings.autoHeight || this.settings.autoWidth) {
        return this._value = this._value;
      }
    }

    _createElements() {
      var forceOpts;
      forceOpts = {
        relatedInstance: this
      };
      this.el = this.template.spawn(this.settings.templates.defaults, forceOpts);
      this.el.state('hasLabel', this.settings.label);
      this.el.child.innerwrap.raw._quickField = this.el.child.input.raw._quickField = this;
    }

    _attachBindings() {
      this._attachBindings_elState();

      this._attachBindings_display();

      this._attachBindings_display_autoWidth();

      this._attachBindings_display_autoHeight();

      this._attachBindings_value();

      this._attachBindings_autocomplete();

      this._attachBindings_stateTriggers();
    }

    _attachBindings_display_autoHeight() {
      SimplyBind('height', {
        updateEvenIfSame: true
      }).of(this.state).transformSelf(function (value) {
        if (isNaN(value) && isNaN(parseFloat(value))) {
          return 'auto';
        } else {
          return value;
        }
      }).to(height => {
        return this.el.child.innerwrap.style('height', height);
      }).updateOn('event:inserted').of(this);

      if (this.settings.autoHeight) {
        SimplyBind('_value', {
          updateEvenIfSame: true,
          updateOnBind: false
        }).of(this).to('height').of(this.state).transform(() => {
          return this._getInputAutoHeight();
        }).updateOn('event:inserted').of(this);
      }
    }

    _attachBindings_display_autoWidth() {
      SimplyBind('width', {
        updateEvenIfSame: true
      }).of(this.state).to(width => {
        return (this.settings.autoWidth ? this.el.child.innerwrap : this.el).style('width', width);
      }).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);

      if (this.settings.autoWidth) {
        SimplyBind('_value', {
          updateEvenIfSame: true,
          updateOnBind: false
        }).of(this).to('width').of(this.state).transform(() => {
          return this._getInputAutoWidth();
        }).updateOn('event:inserted').of(this);
      }
    }

    _attachBindings_value() {
      var input;
      input = this.el.child.input.raw;
      SimplyBind('event:input').of(input).to(() => {
        return this.value = input.value;
      });
      SimplyBind('_value').of(this).to('value').of(input).and.to(value => {
        this.state.filled = !!value;

        if (value) {
          this.state.interacted = true;
        }

        this.state.valid = this.validate(void 0, true);
        return this.emit('input', value);
      });
    }

    _attachBindings_autocomplete() {}

    _getInputAutoHeight() {
      var inputHeight, prevHeight;
      prevHeight = this.el.child.input.raw.style.height;

      if (this._value) {
        this._setValueIfNotSet();

        this.el.child.input.style('height', 0);
        inputHeight = this.el.child.input.raw.scrollHeight + 2;
        inputHeight += this.el.child.input.styleParsed('marginTop') + this.el.child.input.styleParsed('marginBottom');
      } else {
        inputHeight = this.el.child.placeholder.height;
      }

      this.el.child.input.style('height', prevHeight);
      return Math.min(this.settings.maxHeight, Math.max(inputHeight, this.settings.minHeight));
    }

    _getInputAutoWidth() {
      var inputPadding, inputWidth, labelWidth;

      if (this._value) {
        this._setValueIfNotSet();

        this.el.child.input.style({
          width: 0,
          whiteSpace: 'nowrap'
        }).raw.scrollLeft = 1e+10;
        inputPadding = this.el.child.input.styleParsed('paddingLeft') || this.el.child.input.styleParsed('padding');
        inputWidth = Math.max(this.el.child.input.raw.scrollLeft + this.el.child.input.raw.offsetWidth, this.el.child.input.raw.scrollWidth) + 2 + inputPadding + 1;
        labelWidth = this.settings.label && this.el.child.label.styleSafe('position') === 'absolute' ? this.el.child.label.rect.width : 0;
      } else {
        inputWidth = this.el.child.placeholder.rect.width;
        labelWidth = 0;
      }

      this.el.child.input.style({
        width: '100%',
        whiteSpace: 'normal'
      });
      return Math.min(this._getWidthSetting('max'), Math.max(this._getWidthSetting('min'), inputWidth, labelWidth));
    }

  }
  TextareaField.prototype.template = template;
  TextareaField.prototype.templates = templates;
  TextareaField.prototype.defaults = defaults;
  inheritProto(TextareaField, TextField);
  return TextareaField;
}.call(undefined);

var TextareaField$1 = TextareaField;export default TextareaField$1;