import'@danielkalen/is';import IS from'../../checks.js';import DOM from'quickdom';import SimplyBind from'@danielkalen/simplybind';import'../../constants/regex.js';import {inheritProto,includes}from'../../helpers.js';import'smart-extend';import'fastdom';import'../../components/condition.js';import'../../field/transformSettings.js';import'../../field/globalDefaults.js';import Field from'../../field/index.js';import'../../constants/keyCodes.js';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import'../../svg/caretUp.js';import'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import'../../components/dropdown/template-b961f81f.js';import'../../components/dropdown/defaults.js';import Dropdown from'../../components/dropdown/index.js';import'text-mask-core';import'text-mask-addons';import'../../components/mask.js';import'../../constants/colors.js';import'../text/template-233e9413.js';import'../text/defaults.js';import TextField from'../text/index.js';import defaults from'./defaults.js';import {a as template,b as templates}from'./template-6bbcddd0.js';var SelectField;

SelectField = function () {
  class SelectField extends Field {
    constructor() {
      var base;
      super(...arguments);
      this.settings.dropdown.multiple = this.settings.multiple;

      if (this.settings.multiple) {
        if ((base = this.settings.dropdown).help == null) {
          base.help = 'Tip: press ESC to close this menu';
        }
      }

      this._value = this.settings.multiple ? [] : null;
      this.dropdown = new Dropdown(this.settings.choices, this);

      this._createElements();

      this._attachBindings();

      this._constructorEnd();
    }

    _getValue() {
      var ref;

      if (!this.settings.multiple) {
        return (ref = this._value) != null ? ref.value : void 0;
      } else {
        return this._value.map(function (choice) {
          return choice.value;
        });
      }
    }

    _setValue(newValue) {
      var i, len, value;

      if (!this.settings.multiple || !IS.array(newValue)) {
        this.setChoice(newValue);
      } else {
        for (i = 0, len = newValue.length; i < len; i++) {
          value = newValue[i];
          this.setChoice(value);
        }
      }
    }

    _recalcDisplay() {
      if (this.settings.autoWidth) {
        return this.valueLabel = this.valueLabel;
      }
    }

    _createElements() {
      var forceOpts;
      forceOpts = {
        relatedInstance: this
      };
      this.el = this.template.spawn(this.settings.templates.default, forceOpts);
      this.dropdown.appendTo(this.el.child.innerwrap);
      this.el.child.placeholder.insertBefore(this.el.child.input);

      if (this.settings.label) {
        this.el.child.label.text = this.settings.label;
        this.el.state('hasLabel', true);
      }

      this.el.child.innerwrap.raw._quickField = this.el.child.input.raw._quickField = this;
    }

    _attachBindings() {
      this._attachBindings_elState();

      this._attachBindings_value();

      this._attachBindings_display();

      this._attachBindings_display_autoWidth();

      this._attachBindings_dropdown();

      this._attachBindings_stateTriggers();
    }

    _attachBindings_display_autoWidth() {
      SimplyBind('width', {
        updateEvenIfSame: true
      }).of(this.state).to(width => {
        return (this.settings.autoWidth ? this.el.child.input : this.el).style({
          width
        });
      }).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);

      if (this.settings.autoWidth) {
        SimplyBind('valueLabel', {
          updateEvenIfSame: true,
          updateOnBind: false
        }).of(this).to('width').of(this.state).transform(() => {
          return this._getInputAutoWidth();
        }).updateOn('event:inserted').of(this);
      }
    }

    _getInputAutoWidth() {
      var inputWidth, labelWidth;

      if (this.valueLabel) {
        this.el.child.input.style('width', 0);
        inputWidth = this.el.child.input.raw.scrollWidth + 2;
        labelWidth = this.el.child.label.styleSafe('position') === 'absolute' ? this.el.child.label.rect.width : 0;
      } else {
        inputWidth = this.el.child.placeholder.rect.width;
        labelWidth = 0;
      }

      return Math.max(inputWidth, labelWidth);
    }

    _attachBindings_value() {
      SimplyBind('array:_value').of(this).to(selected => {
        this.state.filled = this.settings.multiple ? !!(selected != null ? selected.length : void 0) : !!selected;

        if (this.state.filled) {
          this.state.interacted = true;
        }

        this.state.valid = this.validate(void 0, true);
        return this.emit('input', this.value);
      }).and.to('valueLabel').of(this).transform(selected => {
        if (!selected) {
          return '';
        } else {
          if (this.settings.multiple) {
            return selected.map(function (choice) {
              return choice.label;
            }).join(', ');
          } else {
            return selected.label;
          }
        }
      });
      SimplyBind('valueLabel').of(this).to('text').of(this.el.child.input).transform(label => {
        if (this.settings.labelFormat) {
          return this.settings.labelFormat(label);
        } else {
          return label;
        }
      });
    }

    _attachBindings_dropdown() {
      SimplyBind('event:click').of(this.el.child.input).to(event => {
        var escListener;

        if (!(this.state.disabled || this.dropdown.choices.length === 0)) {
          this.dropdown.isOpen = true;
          this.focus();
          DOM(document).on('click.dropdown', event => {
            if (DOM(event.target).parentMatching(parent => {
              return parent === this.el.child.innerwrap;
            })) {
              return;
            }

            return this.dropdown.isOpen = false;
          }, true);
          escListener = SimplyBind('event:keydown').of(document).once.to(() => {
            return this.dropdown.isOpen = false;
          }).condition(function (event) {
            return event.keyCode === 27;
          });
          return SimplyBind('isOpen', {
            updateOnBind: false
          }).of(this.dropdown).once.to(function () {
            escListener.unBind();
            return DOM(document).off('click.dropdown');
          }).condition(function (isOpen) {
            return !isOpen;
          });
        }
      });
      SimplyBind('event:click').of(this.el.child.innerwrap).to(event => {
        event.stopPropagation();
        return this.el.child.input.emitPrivate('click');
      }).condition(event => {
        return event.target === this.el.child.innerwrap.raw;
      });
      SimplyBind('focused', {
        updateOnBind: false
      }).of(this.state).to(focused => {
        var triggeringKeycodes;

        if (!focused) {
          return this.el.child.input.off('keydown.dropdownTrigger');
        } else {
          triggeringKeycodes = [32, 37, 38, 39, 40];
          return this.el.child.input.on('keydown.dropdownTrigger', event => {
            var ref;

            if (includes(triggeringKeycodes, event.keyCode) && !this.dropdown.isOpen) {
              this.dropdown.isOpen = true;

              if ((ref = this.dropdown.lastSelected) != null ? ref.selected : void 0) {
                this.dropdown.currentHighlighted = this.dropdown.lastSelected;
              }

              return event.preventDefault();
            } else if (event.keyCode === 9 && this.dropdown.isOpen) {
              // Prevent tab key
              return event.preventDefault();
            }
          });
        }
      });
      this.dropdown.onSelected(choice => {
        if (!(choice.selected && !this.settings.multiple)) {
          this.value = choice;
        }

        if (!this.settings.multiple) {
          return this.dropdown.isOpen = false;
        }
      });
    }

    _attachBindings_stateTriggers() {
      //# ==========================================================================
      //# State event triggers
      //# ========================================================================== 
      SimplyBind('event:mouseenter').of(this.el.child.input).to(() => {
        return this.state.hovered = true;
      });
      SimplyBind('event:mouseleave').of(this.el.child.input).to(() => {
        return this.state.hovered = false;
      });
      SimplyBind('event:focus').of(this.el.child.input).to(() => {
        this.state.focused = true;

        if (this.state.disabled) {
          return this.blur();
        }
      });
      SimplyBind('event:blur').of(this.el.child.input).to(() => {
        return this.state.focused = false;
      });
    }

    _validate(providedValue) {
      var matchingChoice, ref, ref1;

      if (this.settings.validWhenRegex && IS.regex(this.settings.validWhenRegex)) {
        switch (false) {
          case !this.settings.multiple:
            if (!(() => {
              var validChoices;

              if (providedValue.length === 0) {
                return false;
              }

              validChoices = providedValue.filter(choice => {
                return this.settings.validWhenRegex.test(choice);
              });

              if (this.settings.validWhenChoseMin === 2e308 || !IS.number(this.settings.validWhenChoseMin)) {
                return validChoices.length === providedValue.length;
              } else {
                return validChoices.length >= this.settings.validWhenChoseMin;
              }
            })()) {
              return false;
            }

            break;

          default:
            if (!this.settings.validWhenRegex.test(providedValue)) {
              return false;
            }

        }
      }

      if (this.settings.validWhenIsChoice && ((ref = this.dropdown.choices) != null ? ref.length : void 0)) {
        matchingChoice = this.dropdown.choices.filter(function (option) {
          return option.value === providedValue;
        });

        if (!!!matchingChoice.length) {
          return false;
        }
      }

      if (this.settings.multiple && -1 > (ref1 = this.settings.validWhenChoseMin) && ref1 < 2e308) {
        if (!providedValue.length >= this.settings.validWhenChoseMin) {
          return false;
        }
      }

      if (this.settings.multiple && this.settings.required) {
        if (!providedValue.length) {
          return false;
        }
      }

      return true;
    }

    addChoice(choice) {
      return this.dropdown.addChoice(choice);
    }

    setChoice(choice) {
      var match, ref;

      if (IS.object(choice) && choice instanceof Dropdown.Choice) {
        return choice.toggle();
      } else if (match = this.dropdown.findChoiceAny(choice)) {
        return match.toggle(true);
      } else {
        return (ref = this.addChoice(choice)) != null ? ref.toggle(true) : void 0;
      }
    }

  }
  SelectField.prototype.template = template;
  SelectField.prototype.templates = templates;
  SelectField.prototype.defaults = defaults;
  SelectField.prototype.coreValueProp = 'value';
  return SelectField;
}.call(undefined);

inheritProto(SelectField, TextField, ['_getMaxWidth', '_attachBindings_elState', '_attachBindings_display', 'focus', 'blur']);
var SelectField$1 = SelectField;export default SelectField$1;