import'@danielkalen/is';import IS from'../../checks.js';import'quickdom';import SimplyBind from'@danielkalen/simplybind';import'../../constants/regex.js';import {removeItem,includes}from'../../helpers.js';import'smart-extend';import'fastdom';import Condition from'../../components/condition.js';import'../../field/transformSettings.js';import'../../field/globalDefaults.js';import Field from'../../field/index.js';import'../../constants/colors.js';import {t as template,d as templates}from'../../template-5aefd595.js';import defaults from'./defaults.js';var Choice, ChoiceField;

ChoiceField = function () {
  class ChoiceField extends Field {
    constructor() {
      var ref;
      super(...arguments);

      if (!((ref = this.settings.choices) != null ? ref.length : void 0)) {
        throw new Error(`Choices were not provided for choice field '${this.settings.label || this.ID}'`);
      }

      this._value = this.settings.multiple ? [] : null;
      this.lastSelected = null;
      this.visibleChoicesCount = 0;
      this.choices = this.settings.choices;

      if (this.settings.validWhenSelected === true) {
        this.settings.validWhenSelected = 1;
      }

      this.settings.perGroup = Math.min(this.settings.perGroup, this.choices.length + (this.settings.multiple && this.settings.showSelectAll ? 1 : 0));

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

    _createElements() {
      var choiceGroups, choices, globalOpts, perGroup;
      globalOpts = {
        relatedInstance: this
      };
      this.el = this.template.spawn(this.settings.templates.default, globalOpts);
      this.choices = [];
      choices = this.settings.choices;
      perGroup = this.settings.perGroup;
      choiceGroups = Array(Math.ceil(choices.length / perGroup)).fill().map(function (s, index) {
        return choices.slice(index * perGroup, index * perGroup + perGroup);
      });
      choiceGroups.forEach((choices, groupIndex) => {
        var groupEl;
        groupEl = this.templates.choiceGroup.spawn(this.settings.templates.choiceGroup, globalOpts).appendTo(this.el.child.innerwrap);
        return choices.forEach((choice, index) => {
          return this.choices.push(new Choice(this, choice, index, groupIndex, groupEl));
        });
      });
      this.el.child.innerwrap.raw._quickField = this;
    }

    _attachBindings() {
      var choice, i, len, ref;

      this._attachBindings_elState();

      this._attachBindings_stateTriggers();

      this._attachBindings_display();

      this._attachBindings_value();

      ref = this.choices;

      for (i = 0, len = ref.length; i < len; i++) {
        choice = ref[i];

        choice._attachBindings();
      }
    }

    _attachBindings_elState() {
      SimplyBind('visible').of(this.state).to(visible => {
        return this.el.state('visible', visible);
      });
      SimplyBind('hovered').of(this.state).to(hovered => {
        return this.el.state('hovered', hovered);
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

    _attachBindings_stateTriggers() {
      SimplyBind('event:mouseenter').of(this.el).to(() => {
        return this.state.hovered = true;
      });
      SimplyBind('event:mouseleave').of(this.el).to(() => {
        return this.state.hovered = false;
      });
    }

    _attachBindings_display() {
      SimplyBind('width').of(this.state).to(width => {
        return this.el.style('width', width).state('definedWidth', width !== 'auto');
      }).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);
      SimplyBind('visibleChoicesCount').of(this).to(count => {
        return this.el.state('hasVisibleChoices', !!count);
      });
    }

    _attachBindings_value() {
      SimplyBind('_value').of(this).to(selected => {
        this.state.filled = !!(selected != null ? selected.length : void 0);

        if (this.state.filled) {
          this.state.interacted = true;
        }

        return this.state.valid = this.validate(void 0, true);
      });
      SimplyBind('array:_value', {
        updateOnBind: false
      }).of(this).to(() => {
        return this.emit('input', this.value);
      });
    }

    _validate(providedValue) {
      if (this.settings.multiple) {
        if (!IS.array(providedValue)) {
          providedValue = [providedValue];
        }

        if (providedValue.length && !IS.object(providedValue[0])) {
          providedValue = providedValue.map(function (choice) {
            return choice.value;
          });
        }
      } else {
        if (IS.object(providedValue)) {
          providedValue = providedValue.value;
        }
      }

      if (IS.number(this.settings.validWhenSelected)) {
        if (!((providedValue != null ? providedValue.length : void 0) >= this.settings.validWhenSelected)) {
          return false;
        }
      }

      if (this.settings.validWhenIsChoice) {
        if (this.settings.multiple) {
          if (!includes(providedValue, this.settings.validWhenIsChoice)) {
            return false;
          }
        } else {
          if (providedValue !== this.settings.validWhenIsChoice) {
            return false;
          }
        }
      }

      return true;
    }

    findChoice(providedValue, byLabel) {
      var matches;
      matches = this.choices.filter(function (choice) {
        switch (false) {
          case !IS.object(providedValue):
            return providedValue === choice;

          case !byLabel:
            return providedValue === choice.label;

          default:
            return providedValue === choice.value;
        }
      });
      return matches[0];
    }

    findChoiceAny(providedValue) {
      return this.findChoice(providedValue) || this.findChoice(providedValue, true);
    }

    setChoice(choice) {
      if (IS.object(choice) && choice instanceof Choice) {
        return choice.toggle();
      } else if (choice = this.findChoiceAny(choice)) {
        return choice.toggle(true);
      }
    }

  }
  ChoiceField.prototype.template = template;
  ChoiceField.prototype.templates = templates;
  ChoiceField.prototype.defaults = defaults;
  return ChoiceField;
}.call(undefined);

Choice = class Choice {
  constructor(field, settings, index1, groupIndex, groupEl) {
    var globalOpts, iconEl, ref;
    this.field = field;
    this.settings = settings;
    this.index = index1;
    globalOpts = {
      relatedInstance: this.field
    };
    ({
      label: this.label,
      value: this.value,
      conditions: this.conditions
    } = this.settings);

    if (this.label == null) {
      this.label = this.value;
    }

    if (this.value == null) {
      this.value = this.label;
    }

    this.el = this.field.templates.choice.spawn(this.field.settings.templates.choice, globalOpts).appendTo(groupEl);

    if (this.icon) {
      iconEl = this.templates.choiceIcon.spawn(this.field.settings.templates.choiceIcon, globalOpts).insertBefore(this.el.child.label);
      iconEl.text = this.icon;
    }

    if (this.el.index == null) {
      this.el.index = this.index;
    }

    this.el.totalIndex = this.index * groupIndex;
    this.el.prop('title', this.label);
    this.el.child.label.text = this.label;
    this.visible = true;
    this.selected = false;
    this.disabled = this.settings.disabled || false;
    this.unavailable = false;

    if ((ref = this.conditions) != null ? ref.length : void 0) {
      this.unavailable = true;
      this.allFields = this.field.allFields;
      Condition.init(this, this.conditions, () => {
        return this.unavailable = !Condition.validate(this.conditions);
      });
    }
  }

  _attachBindings() {
    return (() => {
      SimplyBind('visible').of(this).to(visible => {
        return this.el.state('visible', visible);
      }).and.to(visible => {
        return this.field.visibleChoicesCount += visible ? 1 : -1;
      });
      SimplyBind('selected', {
        updateOnBind: false
      }).of(this).to(selected => {
        return this.el.state('selected', selected);
      });
      SimplyBind('disabled', {
        updateOnBind: false
      }).of(this).to(disabled => {
        return this.el.state('disabled', disabled);
      });
      SimplyBind('unavailable', {
        updateOnBind: false
      }).of(this).to(unavailable => {
        return this.el.state('unavailable', unavailable);
      }).and.to(unavailable => {
        if (unavailable) {
          return this.toggle(false, true);
        }
      });
      return SimplyBind('event:click').of(this.el).to(() => {
        return this.field.value = this;
      }).condition(() => {
        return !this.disabled;
      });
    })();
  }

  toggle(newValue, unavailable) {
    var newState, prevState, ref;
    prevState = this.selected;
    newState = IS.defined(newValue) ? newValue : !this.selected;

    if (!newState) {
      if (this.field.settings.multiple && prevState) {
        this.selected = newState;
        return removeItem(this.field._value, this);
      } else {
        if (IS.defined(newValue)) {
          this.selected = newState;
        }

        if (unavailable) {
          return this.field._value = null;
        }
      }
    } else {
      this.selected = newState;

      if (this.field.settings.multiple) {
        this.field._value.push(this);
      } else {
        if (this.field._value !== this) {
          if ((ref = this.field._value) != null) {
            ref.toggle(false);
          }
        }

        this.field._value = this;
      }

      return this.field.lastSelected = this;
    }
  }

};
var ChoiceField$1 = ChoiceField;export default ChoiceField$1;export{Choice};