import'@danielkalen/is';import IS from'../../checks.js';import DOM from'quickdom';import SimplyBind from'@danielkalen/simplybind';import'../../constants/regex.js';import'../../helpers.js';import extend from'smart-extend';import'fastdom';import'../../components/condition.js';import'../../field/transformSettings.js';import'../../field/globalDefaults.js';import Field from'../../field/index.js';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import'../../svg/caretUp.js';import'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import'../../constants/colors.js';import defaults from'./defaults.js';import {t as template,b as templates}from'../../template-95fee5f5.js';var GroupField;

GroupField = function () {
  class GroupField extends Field {
    constructor() {
      super(...arguments);
      this._calcFocusState = this._calcFocusState.bind(this);
      this._calcBlurState = this._calcBlurState.bind(this);
      this._emitSubmit = this.emit.bind(this, 'submit');
      this.state.collapsed = this.settings.startCollapsed && this.settings.collapsable;

      if (this._value == null) {
        this._value = Object.create(null);
      }

      this.fields = Object.create(null);
      this.fieldsArray = [];

      this._createElements();

      this._attachBindings();

      this._constructorEnd();
    }

    _getValue() {
      var field, name, ref, values;
      values = Object.create(null);
      ref = this.fields;

      for (name in ref) {
        field = ref[name];
        values[name] = field.value;
      }

      return values;
    }

    _setValue(newValue) {
      var name, value;

      if (IS.object(newValue)) {
        for (name in newValue) {
          value = newValue[name];

          if (this.fields[name]) {
            this.fields[name].value = value;
          }
        }

        return newValue;
      }
    }

    _recalcDisplay() {
      var field, i, len, ref;
      ref = this.fieldsArray;

      for (i = 0, len = ref.length; i < len; i++) {
        field = ref[i];

        if (field._recalcDisplay) {
          field._recalcDisplay();
        }
      }
    }

    _createElements() {
      var config, field, fields, forceOpts, i, len, margin, name, ref, ref1;
      forceOpts = {
        relatedInstance: this
      };
      margin = `0 0 ${this.settings.fieldMargin}px 0`;
      this.el = this.template.spawn(this.settings.templates.default, forceOpts);

      if (this.settings.collapsable) {
        this.addAction('collapse', this.templates.collapseIcons);
      }

      if (IS.array(this.settings.fields)) {
        fields = Object.create(null);
        ref = this.settings.fields;

        for (i = 0, len = ref.length; i < len; i++) {
          field = ref[i];

          if (!field.name) {
            throw new Error(`field ${this.name || this.ID}:group fields provided in array format must have a name`);
          }

          fields[field.name] = field;
        }

        this.settings.fields = fields;
      }

      ref1 = this.settings.fields;

      for (name in ref1) {
        field = ref1[name];
        config = extend({
          margin,
          fieldInstances: this.fields
        }, field, {
          ID: name
        });
        this.fieldsArray.push(this.fields[name] = this.builder(config).appendTo(this.el.child.innerwrap));
        this.fields[name].on('focus', this._calcFocusState).on('blur', this._calcBlurState).on('submit', this._emitSubmit).el.style('verticalAlign', this.settings.fieldAlign).after(' ');
      }

      this.el.child.innerwrap.append(DOM.div({
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }));
      this.el.state('collapsable', this.settings.collapsable);
      this.el.raw._quickField = this.el.childf.innerwrap.raw._quickField = this;
    }

    _attachBindings() {
      this._attachBindings_elState();

      this._attachBindings_display();

      this._attachBindings_stateTriggers();

      this._attachBindings_value();
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
      SimplyBind('collapsed').of(this.state).to(collapsed => {
        return this.el.state('collapsed', collapsed);
      });
      return SimplyBind('valid').of(this.state).to(valid => {
        this.el.state('valid', valid);
        return this.el.state('invalid', !valid);
      });
    }

    _attachBindings_display() {
      var field, i, len, ref;
      SimplyBind('width').of(this.state).to(width => {
        return this.el.style('width', width).state('definedWidth', width !== 'auto');
      }).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);
      ref = this.fieldsArray;

      for (i = 0, len = ref.length; i < len; i++) {
        field = ref[i];
        SimplyBind('disabled').of(this.state).to('disabled').of(field.state);
      }
    }

    _attachBindings_stateTriggers() {
      var toggleCollapse;

      if (this.settings.collapsable) {
        toggleCollapse = () => {
          this.state.collapsed = !this.state.collapsed;
          return this.emit('collapsed', this.state.collapsed);
        };

        SimplyBind('event:click').of(this.el.child.collapse).to(toggleCollapse);
        SimplyBind('event:click').of(this.el.child.label).to(toggleCollapse);
        SimplyBind('collapsed').of(this.state).once.to(() => {
          return this._recalcDisplay();
        }).condition(function (collapsed) {
          return !collapsed;
        });
      }
    }

    _attachBindings_value() {
      var field, fieldName, ref;
      ref = this.fields;

      for (fieldName in ref) {
        field = ref[fieldName];
        SimplyBind('_value').of(field).to(fieldName).of(this._value);
        SimplyBind('_value', {
          updateOnBind: false
        }).of(field).to(value => {
          if (value) {
            this.state.interacted = true;
          }

          this.state.valid = this.validate(void 0, true);
          return this.emit('input', this._value);
        });
      }
    }

    _validate(providedValue, testUnrequired, report) {
      var field, i, isValid, len, ref, someInvalid;
      someInvalid = false;
      ref = this.fieldsArray;

      for (i = 0, len = ref.length; i < len; i++) {
        field = ref[i];

        if (!field.state.visible) {
          continue;
        }

        if (report) {
          isValid = field.validateAndReport(providedValue[field.name], testUnrequired);
        } else {
          isValid = field.validate(providedValue[field.name], testUnrequired);
        }

        if (!isValid) {
          someInvalid = true;
        }
      }

      return !someInvalid;
    }

    _calcFocusState() {
      return this.state.focused = this.fieldsArray.some(function (field) {
        return field.state.focused;
      });
    }

    _calcBlurState() {
      return setTimeout(this._calcFocusState);
    }

    focus() {
      var field, i, len, ref;
      this.state.collapsed = false;
      ref = this.fieldsArray;

      for (i = 0, len = ref.length; i < len; i++) {
        field = ref[i];

        if (field.focus) {
          return field.focus();
        }
      }
    }

    blur() {
      var field, i, len, ref;
      ref = this.fieldsArray;

      for (i = 0, len = ref.length; i < len; i++) {
        field = ref[i];

        if (field.blur) {
          return field.blur();
        }
      }
    }

    addAction(name, icons, callback, prepend) {
      var action, i, icon, len;

      if (icons && !IS.array(icons)) {
        icons = [icons];
      }

      action = this.templates.action.spawn(this.settings.templates.action, {
        relatedInstance: this
      });
      action.ref = action.options.ref = name;

      for (i = 0, len = icons.length; i < len; i++) {
        icon = icons[i];
        action.child.icon.append(icon);
      }

      this.el.child.actions[prepend ? 'prepend' : 'append'](action);

      if (callback) {
        SimplyBind('event:click').of(action).to(callback);
      }

      return action;
    }

  }
  GroupField.prototype.template = template;
  GroupField.prototype.templates = templates;
  GroupField.prototype.defaults = defaults;
  GroupField.prototype.shallowSettings = ['fields'];
  return GroupField;
}.call(undefined);

var GroupField$1 = GroupField;export default GroupField$1;