import'@danielkalen/is';import IS from'../../checks.js';import DOM from'quickdom';import SimplyBind from'@danielkalen/simplybind';import REGEX from'../../constants/regex.js';import {fuzzyMatch,getIndexOfFirstDiff,includes}from'../../helpers.js';import extend from'smart-extend';import'fastdom';import'../../components/condition.js';import'../../field/transformSettings.js';import'../../field/globalDefaults.js';import Field from'../../field/index.js';import KEYCODES from'../../constants/keyCodes.js';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import'../../svg/caretUp.js';import'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import'../../components/dropdown/template-b961f81f.js';import'../../components/dropdown/defaults.js';import Dropdown from'../../components/dropdown/index.js';import'text-mask-core';import'text-mask-addons';import Mask from'../../components/mask.js';import'../../constants/colors.js';import {a as textFieldTemplate,b as templates}from'./template-233e9413.js';import defaults from'./defaults.js';var TextField;

TextField = function () {
  class TextField extends Field {
    constructor() {
      super(...arguments);

      if (this._value == null) {
        this._value = '';
      }

      this.state.typing = false;
      this.cursor = {
        prev: 0,
        current: 0
      };

      if (!this.settings.validWhenRegex) {
        if (this.settings.keyboard === 'email' && this.settings.required) {
          this.settings.validWhenRegex = REGEX.email;
        } else if (this.settings.mask === 'NAME' || this.settings.mask.pattern === 'NAME') {
          this.settings.validWhenRegex = /^[a-zA-Z]{2}/;
        } else if (this.settings.mask === 'FULLNAME' || this.settings.mask.pattern === 'FULLNAME') {
          this.settings.validWhenRegex = /^[a-zA-Z]+\s+[a-zA-Z]+/;
        }
      }

      if (!this.settings.mask.pattern) {
        if (IS.string(this.settings.mask)) {
          this.settings.mask = extend.deep.clone(this.defaults.mask, {
            pattern: this.settings.mask
          });
        } else if (IS.object(this.settings.mask)) {
          this.settings.mask.pattern = function () {
            switch (this.settings.keyboard) {
              case 'date':
                return 'DATE';

              case 'number':
                return 'NUMBER';

              case 'phone':
              case 'tel':
                return 'PHONE';

              case 'email':
                return 'EMAIL';
            }
          }.call(this);
        }
      }

      if (this.settings.mask.pattern) {
        this.mask = new Mask(this, this.settings.mask);
      }

      this._createElements();

      this._attachBindings();

      this._constructorEnd();
    }

    _getValue() {
      if (this.dropdown && this.selected && this._value === this.selected.label) {
        return this.selected.value;
      } else {
        return this._value;
      }
    }

    _setValue(newValue) {
      if (IS.string(newValue) || IS.number(newValue)) {
        newValue = String(newValue);
        return this._value = this.mask ? this.mask.setValue(newValue) : newValue;
      }
    }

    _recalcDisplay() {
      if (this.settings.autoWidth) {
        return this._value = this._value;
      }
    }

    _createElements() {
      var globalOpts;
      globalOpts = {
        relatedInstance: this
      };
      this.el = this.template.spawn(this.settings.templates.default, globalOpts);

      if (this.settings.choices) {
        this.dropdown = new Dropdown(this.settings.choices, this);
        this.dropdown.appendTo(this.el.child.innerwrap);
      }

      if (this.settings.icon) {
        this.templates.icon.spawn(this.settings.templates.icon, globalOpts).append(this.settings.icon).insertBefore(this.el.child.input);
      }

      if (this.settings.checkmark) {
        this.templates.checkmark.spawn(this.settings.templates.checkmark, globalOpts).insertAfter(this.el.child.input);
      }

      this.el.child.input.prop('type', function () {
        switch (this.settings.keyboard) {
          case 'number':
          case 'tel':
          case 'phone':
            return 'tel';

          case 'password':
            return 'password';

          case 'url':
            return 'url';

          default:
            // when 'email' then 'email'
            return 'text';
        }
      }.call(this));
      this.el.state('hasLabel', this.settings.label);
      this.el.child.innerwrap.raw._quickField = this.el.child.input.raw._quickField = this;
      return this.el.childf;
    }

    _attachBindings() {
      this._attachBindings_elState();

      this._attachBindings_display();

      this._attachBindings_display_autoWidth();

      this._attachBindings_value();

      this._attachBindings_autocomplete();

      this._attachBindings_stateTriggers();
    }

    _attachBindings_elState() {
      SimplyBind('visible').of(this.state).to(visible => {
        return this.el.state('visible', visible);
      });
      SimplyBind('hovered').of(this.state).to(hovered => {
        return this.el.state('hover', hovered);
      });
      SimplyBind('focused').of(this.state).to(focused => {
        return this.el.state('focus', focused);
      });
      SimplyBind('filled').of(this.state).to(filled => {
        return this.el.state('filled', filled);
      });
      SimplyBind('disabled').of(this.state).to(disabled => {
        return this.el.state('disabled', disabled);
      });
      SimplyBind('showLabel').of(this.state).to(showLabel => {
        return this.el.state('showLabel', showLabel);
      });
      SimplyBind('showError').of(this.state).to(showError => {
        return this.el.state('showError', showError);
      });
      SimplyBind('showHelp').of(this.state).to(showHelp => {
        return this.el.state('showHelp', showHelp);
      });
      SimplyBind('valid').of(this.state).to(valid => {
        this.el.state('valid', valid);
        return this.el.state('invalid', !valid);
      });
    }

    _attachBindings_display() {
      SimplyBind('placeholder').of(this.state).to('text').of(this.el.child.placeholder).transform(placeholder => {
        switch (false) {
          case !(placeholder === true && this.settings.label):
            return this.settings.label;

          case !IS.string(placeholder):
            return placeholder;

          default:
            return '';
        }
      });
      SimplyBind('disabled', {
        updateOnBind: this.state.disabled
      }).of(this.state).to((disabled, prev) => {
        if (this.settings.checkmark) {
          if (disabled || !disabled && prev != null) {
            return setTimeout(() => {
              this.el.child.checkmark_mask1.recalcStyle();
              this.el.child.checkmark_mask2.recalcStyle();
              return this.el.child.checkmark_patch.recalcStyle();
            });
          }
        }
      });
    } // @el.child.checkmark.recalcStyle(true)


    _attachBindings_display_autoWidth() {
      SimplyBind('width', {
        updateEvenIfSame: true
      }).of(this.state).to(width => {
        return (this.settings.autoWidth ? this.el.child.input : this.el).style('width', width);
      }).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);

      if (this.settings.autoWidth) {
        SimplyBind('_value', {
          updateEvenIfSame: true,
          updateOnBind: false
        }).of(this).to('width').of(this.state).transform(() => {
          return `${this._getInputAutoWidth()}px`;
        }).updateOn('event:inserted').of(this.el).updateOn('visible').of(this.state);
      }
    }

    _attachBindings_value() {
      var input, resetInput;
      input = this.el.child.input.raw;

      resetInput = () => {
        var filled;
        filled = !this.mask.isEmpty();

        if (!filled) {
          this.selection(this.mask.cursor = 0);
          this._value = '';
          this.state.filled = false;
        }

        return filled;
      };

      SimplyBind('event:input').of(input).to(() => {
        this.value = input.value;

        if (this.mask) {
          this.selection(this.mask.cursor);
        }

        return this.emit('input', this.value);
      });
      SimplyBind('_value', {
        updateEvenIfSame: !!this.mask
      }).of(this).to('value').of(input).and.to(value => {
        var filled;
        filled = !!value;

        if (filled && this.mask && this.mask.guide && (!this.state.focused || this.mask.cursor === 0)) {
          filled = resetInput();
        }

        this.state.filled = filled;

        if (filled) {
          this.state.interacted = true;
        }

        this.state.valid = this.validate(void 0, true);

        if (!this.state.focused) {
          return this.emit('input', this.value);
        }
      });
      SimplyBind('event:keydown').of(this.el.child.input).to(event => {
        if (event.keyCode === KEYCODES.enter) {
          this.emit('submit');
        }

        return this.emit(`key-${event.keyCode}`);
      });

      if (this.mask && this.mask.guide) {
        SimplyBind('event:blur').of(this.el.child.input).to(resetInput);
      }
    }

    _attachBindings_autocomplete() {
      if (this.dropdown) {
        SimplyBind.defaultOptions.updateOnBind = false;
        SimplyBind('typing', {
          updateEvenIfSame: true
        }).of(this.state).to(isTyping => {
          if (isTyping) {
            if (!this._value) {
              return;
            }

            if (this.dropdown.isOpen) {
              return this.dropdown.list.calcDisplay();
            } else {
              this.dropdown.isOpen = true;
              return SimplyBind('event:click').of(document).once.to(() => {
                return this.dropdown.isOpen = false;
              }).condition(event => {
                return !DOM(event.target).parentMatching(parent => {
                  return parent === this.el.child.innerwrap;
                });
              });
            }
          } else {
            return this.dropdown.isOpen = false;
          }
        });
        SimplyBind('_value').of(this).to(value => {
          var choice, i, len, ref, shouldBeVisible;
          ref = this.dropdown.choices;

          for (i = 0, len = ref.length; i < len; i++) {
            choice = ref[i];
            shouldBeVisible = !value ? true : fuzzyMatch(value, choice.label);

            if (choice.visible !== shouldBeVisible) {
              choice.visible = shouldBeVisible;
            }
          }

          if (this.dropdown.isOpen && !value) {
            this.dropdown.isOpen = false;
          }
        });
        this.dropdown.onSelected(selectedChoice => {
          this.selected = selectedChoice;
          this.value = selectedChoice.label;
          this.dropdown.isOpen = false;
          return this.selection(this.el.child.input.raw.value.length);
        });
        SimplyBind.defaultOptions.updateOnBind = true;
      }
    }

    _attachBindings_stateTriggers() {
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
        return this.state.typing = this.state.focused = false;
      });
      SimplyBind('event:input').of(this.el.child.input).to(() => {
        return this.state.typing = true;
      });
      SimplyBind('event:keydown').of(this.el.child.input).to(() => {
        return this.cursor.prev = this.selection().end;
      });
    }

    _scheduleCursorReset() {
      var currentCursor, diffIndex, newCursor;
      diffIndex = getIndexOfFirstDiff(this.mask.value, this.mask.prev.value);
      currentCursor = this.cursor.current;
      newCursor = this.mask.normalizeCursorPos(currentCursor, this.cursor.prev);

      if (newCursor !== currentCursor) {
        this.selection(newCursor);
      }
    }

    _setValueIfNotSet() {
      if (this.el.child.input.raw.value !== this._value) {
        this.el.child.input.raw.value = this._value;
      }
    }

    _getInputAutoWidth() {
      var inputWidth, labelWidth;

      if (this._value) {
        this._setValueIfNotSet();

        this.el.child.input.style('width', 0);
        this.el.child.input.raw.scrollLeft = 1e+10;
        inputWidth = Math.max(this.el.child.input.raw.scrollLeft + this.el.child.input.raw.offsetWidth, this.el.child.input.raw.scrollWidth) + 2;
        labelWidth = this.settings.label && this.el.child.label.styleSafe('position') === 'absolute' ? this.el.child.label.rect.width : 0;
      } else {
        inputWidth = this.el.child.placeholder.rect.width;
        labelWidth = 0;
      }

      return Math.min(this._getWidthSetting('max'), Math.max(this._getWidthSetting('min'), inputWidth, labelWidth));
    }

    _getWidthSetting(target) {
      var parent, parentWidth, result;

      if (target === 'min' || target === 'max') {
        target += 'Width';
      }

      if (typeof this.settings[target] === 'number') {
        result = this.settings[target];
      } else if (typeof this.settings[target] === 'string') {
        result = parseFloat(this.settings[target]);

        if (includes(this.settings[target], '%')) {
          if ((parent = this.el.parent) && parent.style('display') === 'block') {
            parentWidth = parent.styleParsed('width') - parent.styleParsed('paddingLeft') - parent.styleParsed('paddingRight') - 2;
            result = parentWidth * (result / 100);
          } else {
            result = 0;
          }
        }
      }

      return result || (target === 'minWidth' ? 0 : 2e308);
    }

    _validate(providedValue) {
      var matchingChoice, ref;

      if (this.settings.validWhenRegex && IS.regex(this.settings.validWhenRegex)) {
        if (!this.settings.validWhenRegex.test(providedValue)) {
          return false;
        }
      }

      if (this.settings.validWhenIsChoice && ((ref = this.settings.choices) != null ? ref.length : void 0)) {
        matchingChoice = this.settings.choices.filter(function (choice) {
          return choice.value === providedValue;
        });

        if (!matchingChoice.length) {
          return false;
        }
      }

      if (this.settings.minLength) {
        if (providedValue.length < this.settings.minLength) {
          return false;
        }
      }

      if (this.settings.maxLength) {
        if (providedValue.length >= this.settings.maxLength) {
          return false;
        }
      }

      if (this.mask) {
        if (!this.mask.validate(providedValue)) {
          return false;
        }
      }

      return true;
    }

    selection(arg) {
      var end, start;

      if (IS.object(arg)) {
        start = arg.start;
        end = arg.end;
      } else {
        start = arg;
        end = arguments[1];
      }

      if (start != null) {
        if (!end || end < start) {
          end = start;
        }

        this.el.child.input.raw.setSelectionRange(start, end);
      } else {
        return {
          'start': this.el.child.input.raw.selectionStart,
          'end': this.el.child.input.raw.selectionEnd
        };
      }
    }

    focus() {
      return this.el.child.input.raw.focus();
    }

    blur() {
      return this.el.child.input.raw.blur();
    }

  }
  TextField.prototype.template = textFieldTemplate;
  TextField.prototype.templates = templates;
  TextField.prototype.defaults = defaults;
  return TextField;
}.call(undefined);

var TextField$1 = TextField;export default TextField$1;