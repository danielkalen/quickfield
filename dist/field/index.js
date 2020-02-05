import'@danielkalen/is';import IS from'../checks.js';import'quickdom';import SimplyBind from'@danielkalen/simplybind';import'../constants/regex.js';import {updateShorthandValue}from'../helpers.js';import extend from'smart-extend';import fastdom from'fastdom';import Condition from'../components/condition.js';import transformSettings from'./transformSettings.js';import globalDefaults from'./globalDefaults.js';var Field, currentID;
currentID = 0;

Field = function () {
  class Field {
    constructor(settings, builder, settingOverrides, templateOverrides) {
      var ref, shallowSettings, transformSettings_;
      this.builder = builder;

      if (settingOverrides) {
        if (settingOverrides.globalDefaults) {
          this.globalDefaults = settingOverrides.globalDefaults;
        }

        if (settingOverrides[settings.type]) {
          this.defaults = settingOverrides[settings.type];
        }
      }

      if (templateOverrides && templateOverrides[settings.type]) {
        this.templates = templateOverrides[settings.type];
        this.template = templateOverrides[settings.type].default;
      }

      shallowSettings = this.shallowSettings ? Field.shallowSettings.concat(this.shallowSettings) : Field.shallowSettings;
      transformSettings_ = this.transformSettings ? Field.transformSettings.concat(this.transformSettings) : Field.transformSettings;
      this.settings = extend.deep.clone.notDeep(shallowSettings).transform(transformSettings_)(this.globalDefaults, this.defaults, settings);
      this.ID = this.settings.ID || currentID++ + '';
      this.type = settings.type;
      this.name = settings.name;
      this.allFields = this.settings.fieldInstances || Field.instances;
      this._value = null;
      this._eventCallbacks = {};
      this.state = {
        valid: true,
        visible: true,
        focused: false,
        hovered: false,
        filled: false,
        interacted: false,
        isMobile: false,
        disabled: this.settings.disabled,
        margin: this.settings.margin,
        padding: this.settings.padding,
        width: this.settings.width,
        showLabel: this.settings.label,
        label: this.settings.label,
        showHelp: this.settings.help,
        help: this.settings.help,
        showError: false,
        error: this.settings.error
      };

      if (IS.defined(this.settings.placeholder)) {
        this.state.placeholder = this.settings.placeholder;
      }

      if (IS.number(this.settings.width) && this.settings.width <= 1) {
        this.state.width = `${this.settings.width * 100}%`;
      }

      if ((ref = this.settings.conditions) != null ? ref.length : void 0) {
        this.state.visible = false;
        Condition.init(this, this.settings.conditions);
      }

      if (this.allFields[this.ID]) {
        if (typeof console !== "undefined" && console !== null) {
          console.warn(`Duplicate field IDs found: '${this.ID}'`);
        }
      }

      this.allFields[this.ID] = this;
    }

    _constructorEnd() {
      var base, handler, ref, target;
      this.el.childf; //.field.on 'inserted', ()=> @emit('inserted')

      if (this.settings.ID) {
        this.el.raw.id = this.ID;
      }

      if (this.settings.value != null) {
        if ((base = this.settings).defaultValue == null) {
          base.defaultValue = this.settings.value;
        }
      }

      if (this.settings.defaultValue != null) {
        this.value = this.settings.multiple ? [].concat(this.settings.defaultValue) : this.settings.defaultValue;
      }

      SimplyBind('showError', {
        updateOnBind: false
      }).of(this.state).to('help').of(this.state).transform(show => {
        if (show && this.state.error && IS.string(this.state.error)) {
          return this.state.error;
        } else {
          return this.settings.help || this.state.help;
        }
      });
      SimplyBind('error', {
        updateOnBind: false
      }).of(this.state).to('help').of(this.state).condition(error => {
        return error && this.state.showError;
      });
      SimplyBind('help').of(this.state).to('html').of(this.el.child.help).and.to('showHelp').of(this.state);
      SimplyBind('label').of(this.state).to('text').of(this.el.child.label).and.to('showLabel').of(this.state);
      SimplyBind('margin').of(this.state).to(this.el.style.bind(this.el, 'margin'));
      SimplyBind('padding').of(this.state).to(this.el.style.bind(this.el, 'padding'));
      SimplyBind('showHelp').of(this.state).to((show, prevShow) => {
        var changeAmount;

        if (this.settings.makeRoomForHelp) {
          changeAmount = !!show === !!prevShow ? 0 : show ? 25 : prevShow ? -25 : void 0;

          if (changeAmount) {
            return this.state.margin = updateShorthandValue(this.state.margin, 'bottom', changeAmount);
          }
        }
      });
      SimplyBind('focused', {
        updateOnBind: false
      }).of(this.state).to(focused => {
        return this.emit(focused ? 'focus' : 'blur');
      });

      if (this.settings.mobileWidth) {
        SimplyBind(() => {
          return fastdom.measure(() => {
            return this.state.isMobile = window.innerWidth <= this.settings.mobileThreshold;
          });
        }).updateOn('event:resize').of(window);
      }

      if (IS.object(this.settings.events)) {
        ref = this.settings.events;

        for (target in ref) {
          handler = ref[target];
          this.on(target, handler);
        }
      }

      this.emit('created', this);
      return this.el.raw._quickField = this;
    }

    _formatWidth(width) {
      width = this.state.isMobile ? this.settings.mobileWidth || width : width;

      if (this.settings.distance && width !== '100%') {
        width = `calc(${width} - ${this.settings.distance}px)`;
      }

      return width;
    }

    appendTo(target) {
      this.el.appendTo(target);
      return this;
    }

    prependTo(target) {
      this.el.prependTo(target);
      return this;
    }

    insertAfter(target) {
      this.el.insertAfter(target);
      return this;
    }

    insertBefore(target) {
      this.el.insertBefore(target);
      return this;
    }

    detach(target) {
      this.el.detach(target);
      return this;
    }

    remove() {
      this.el.remove();
      return this.destroy(false);
    }

    destroy(removeFromDOM = true) {
      var child, i, len, ref;
      SimplyBind.unBindAll(this);
      SimplyBind.unBindAll(this.state);
      SimplyBind.unBindAll(this.el);
      ref = this.el.child;

      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        SimplyBind.unBindAll(child);
      }

      if (removeFromDOM) {
        this.el.remove();
      }

      if (this._destroy) {
        this._destroy();
      }

      delete this.allFields[this.ID];
      return true;
    }

    on(eventNames, callback, useCapture) {
      this.el.on.call(this.el, eventNames, callback, useCapture, true);
      return this;
    }

    once(eventNames, callback, useCapture) {
      return this.on(eventNames, () => {
        this.off(eventNames, callback);
        return callback.apply(this.el, arguments);
      }, useCapture);
    }

    off() {
      this.el.off.apply(this.el, arguments);
      return this;
    }

    emit() {
      this.el.emitPrivate.apply(this.el, arguments);
      return this;
    }

    validate(providedValue = this[this.coreValueProp], testUnrequired, report) {
      var isValid;

      isValid = function () {
        switch (false) {
          case !this.settings.validator:
            return this.settings.validator.call(this, providedValue, testUnrequired, report);

          case !(!this.settings.required && !testUnrequired):
            return true;

          case this._validate(providedValue, testUnrequired, report) !== false:
            return false;

          case !this.settings.required:
            switch (false) {
              case !this.settings.multiple:
                return !!(providedValue != null ? providedValue.length : void 0);

              case typeof providedValue !== 'string':
                return !!providedValue;

              default:
                return providedValue != null;
            }

          default:
            return true;
        }
      }.call(this);

      if (isValid && this.settings.clearErrorOnValid) {
        this.state.showError = false;
      }

      return isValid;
    }

    validateConditions(conditions) {
      var passedConditions, toggleVisibility;

      if (conditions) {
        toggleVisibility = false;
      } else {
        conditions = this.conditions;
        toggleVisibility = true;
      }

      passedConditions = Condition.validate(conditions);

      if (toggleVisibility) {
        return this.state.visible = passedConditions;
      } else {
        return passedConditions;
      }
    }

    validateAndReport(providedValue, testUnrequired) {
      var isValid;
      isValid = this.validate(providedValue, testUnrequired, true);
      this.state.showError = !isValid;
      return isValid;
    }

  }
  Field.instances = Object.create(null);
  Field.shallowSettings = ['templates', 'fieldInstances', 'value', 'defaultValue'];
  Field.transformSettings = transformSettings;
  Field.prototype.globalDefaults = globalDefaults;
  Field.prototype.coreValueProp = '_value';
  Object.defineProperties(Field.prototype, {
    'removeListener': {
      get: function () {
        return this.off;
      }
    },
    'els': {
      get: function () {
        return this.el.child;
      }
    },
    'valueRaw': {
      get: function () {
        return this._value;
      }
    },
    'value': {
      get: function () {
        if (this.settings.getter) {
          return this.settings.getter(this._getValue());
        } else {
          return this._getValue();
        }
      },
      set: function (value) {
        return this._setValue(this.settings.setter ? this.settings.setter(value) : value);
      }
    }
  });
  return Field;
}.call(undefined);

var Field$1 = Field;export default Field$1;