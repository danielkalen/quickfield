import'@danielkalen/is';import IS from'../../checks.js';import'quickdom';import SimplyBind from'@danielkalen/simplybind';import'../../constants/regex.js';import {includes,insertAfter,removeItem}from'../../helpers.js';import extend from'smart-extend';import'fastdom';import'../../components/condition.js';import'../../field/transformSettings.js';import'../../field/globalDefaults.js';import Field from'../../field/index.js';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import'../../svg/caretUp.js';import'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import'../../constants/colors.js';import'../../template-95fee5f5.js';import {t as template,a as templates}from'../../template-cba7297e.js';import defaults from'./defaults.js';import dragula from'dragula';(function(){
	var css = ".gu-mirror {\n  position: fixed !important;\n  margin: 0 !important;\n  z-index: 9999 !important;\n  opacity: 0.8;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)\";\n  filter: alpha(opacity=80);\n}\n.gu-hide {\n  display: none !important;\n}\n.gu-unselectable {\n  -webkit-user-select: none !important;\n  -moz-user-select: none !important;\n  -ms-user-select: none !important;\n  user-select: none !important;\n}\n.gu-transit {\n  opacity: 0.2;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=20)\";\n  filter: alpha(opacity=20);\n}\n";
	var head = document.getElementsByTagName('head')[0];
	var sheet = document.createElement('style');
	
	sheet.setAttribute('data-file', '/Users/danielkalen/sandbox/quickfield/node_modules/dragula/dist/dragula.css');
	sheet.innerHTML = css;
	head.appendChild(sheet);
})();var RepeaterField;

RepeaterField = function () {
  class RepeaterField extends Field {
    constructor() {
      var base, diff;
      super(...arguments);
      this._calcFocusState = this._calcFocusState.bind(this);
      this._calcBlurState = this._calcBlurState.bind(this);
      this._emitSubmit = this.emit.bind(this, 'submit');
      this.groupLabel = IS.string(this.settings.numbering) ? this.settings.numbering : 'Item';
      this.labelRegex = new RegExp(`^${this.groupLabel} \\d+(?:\: )?`);
      this.state.collapsed = this.settings.startCollapsed && this.settings.collapsable;

      if (this._value == null) {
        this._value = [];
      }

      this.settings._groupSettings = extend.notKeys(['inline', 'block']).clone(this.settings.groupSettings);
      this.settings.groupSettings = extend.keys(['inline', 'block']).clone(this.settings.groupSettings);

      if (this.settings.style === 'block') {
        this.settings.autoWidth = true;
      }

      if (this.settings.field) {
        this.settings.singleMode = true;
      }

      if (this.settings.singleMode) {
        this.settings.fields = [this.settings.field || this.settings.fields];
      }

      if ((base = this.settings).value == null) {
        base.value = [];
      }

      if (this.settings.minItems && this.settings.value.length < this.settings.minItems) {
        diff = this.settings.minItems - this.settings.value.length;

        while (--diff) {
          this.settings.value.push(null);
        }
      }

      this._createElements();

      this._attachBindings();

      this._constructorEnd();
    }

    _getValue() {
      var group, i, index, len, ref, values;
      values = [];
      ref = this._value;

      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        group = ref[index];
        values[index] = group.value;
      }

      return values;
    }

    _setValue(newValue) {
      var i, index, len, value;

      if (!IS.array(newValue)) {
        this.addItem(newValue, false, true);
      } else {
        for (index = i = 0, len = newValue.length; i < len; index = ++i) {
          value = newValue[index];

          if (this._value[index] != null) {
            this._value[index].value = value;
          } else {
            this.addItem(value, false, true);
          }
        }
      }

      return newValue;
    }

    _createElements() {
      var forceOpts;
      forceOpts = {
        relatedInstance: this
      };
      this.el = this.template.spawn(this.settings.templates.default, forceOpts);
      this.el.state('collapsable', this.settings.collapsable);
      this.el.state(`${this.settings.style}Style`, true);
      this.el.raw._quickField = this.el.childf.innerwrap.raw._quickField = this;

      if (this.settings.dragdrop) {
        this.dragger = dragula([this.el.child.innerwrap.raw], {
          revertOnSpill: true,
          invalid: function (el) {
            var ref;
            return ((ref = el._quickElement) != null ? ref.ref : void 0) === 'addButton';
          }
        }); // moves: (_, __, el)-> el._quickElement?.ref is 'header'

        this.dragger.on('drop', () => {
          return this.reOrganize();
        });
      }
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
      var group, i, len, ref;
      SimplyBind('width').of(this.state).to(width => {
        return this.el.style('width', width).state('definedWidth', width !== 'auto');
      }).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);
      SimplyBind('showError', {
        updateOnBind: false
      }).of(this.state).to(showError => {
        var group, i, len, ref, results;
        ref = this._value;
        results = [];

        for (i = 0, len = ref.length; i < len; i++) {
          group = ref[i];
          results.push(group.state.showError = showError);
        }

        return results;
      });
      ref = this._value;

      for (i = 0, len = ref.length; i < len; i++) {
        group = ref[i];
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
      SimplyBind('array:_value', {
        updateOnBind: true
      }).of(this).to((value, prevValue) => {
        if (value.length) {
          this._recalcLabels();
        }

        if (prevValue) {
          this.state.interacted = true;
          return this.state.valid = this.validate(void 0, true);
        }
      });
      SimplyBind('event:click').of(this.el.child.addButton).to(() => {
        return this.addItem().focus();
      });
    }

    _validate(providedValue, testUnrequired) {
      var group, i, isValid, len, ref;
      ref = this._value;

      for (i = 0, len = ref.length; i < len; i++) {
        group = ref[i];
        isValid = group.validate(providedValue[group.name], testUnrequired);

        if (!isValid) {
          return false;
        }
      }

      return true;
    }

    _calcFocusState() {
      return this.state.focused = this._value.some(function (field) {
        return field.state.focused;
      });
    }

    _calcBlurState() {
      return setTimeout(this._calcFocusState);
    }

    focus() {
      var ref;
      return (ref = this._value[0]) != null ? ref.focus() : void 0;
    }

    blur() {
      var field, i, len, ref;
      ref = this._value;

      for (i = 0, len = ref.length; i < len; i++) {
        field = ref[i];

        if (field.blur) {
          field.blur();
        }
      }
    }

    _recalcLabels() {
      var group, i, index, len, ref;

      if (this.settings.style === 'block') {
        if (!this.settings.numbering && !this.settings.dynamicLabel) {
          return;
        }

        ref = this._value;

        for (index = i = 0, len = ref.length; i < len; index = ++i) {
          group = ref[index];

          this._recalcLabel(group, index);
        }
      }
    }

    _recalcLabel(group, index) {
      var existingLabel, newLabel;

      if (this.settings.dynamicLabel && group.fields[this.settings.dynamicLabel]) {
        newLabel = group.fields[this.settings.dynamicLabel].value;
      } else {
        existingLabel = group.state.label || '';
        existingLabel = existingLabel.replace(this.labelRegex, '');
        newLabel = `${this.groupLabel} ${index + 1}`;

        if (existingLabel) {
          newLabel += `: ${existingLabel}`;
        }
      }

      return group.state.label = newLabel;
    }

    _recalcDisplay() {
      var group, i, len, ref;
      ref = this._value;

      for (i = 0, len = ref.length; i < len; i++) {
        group = ref[i];

        if (group._recalcDisplay) {
          group._recalcDisplay();
        }
      }
    }

    addItem(value, skipInsert, skipEmit) {
      var firstField, group, margin, refreshChildren, required, settings;

      if (this.settings.maxItems && this._value.length === this.settings.maxItems || this.state.disabled) {
        return;
      }

      margin = this.settings.style === 'inline' ? `0 ${this.settings.groupMargin}px ${this.settings.groupMargin}px 0` : `0 0 ${this.settings.groupMargin}px 0`;
      required = this.settings.required;
      settings = extend({
        type: 'group',
        fields: this.settings.fields,
        required,
        margin,
        value
      }, this.settings._groupSettings, this.settings.groupSettings[this.settings.style]);

      if (this.settings.singleMode) {
        firstField = this.settings.fields[0].name;

        settings.getter = function (fields) {
          return fields[firstField];
        };

        settings.setter = function (value) {
          return {
            [`${firstField}`]: value
          };
        };
      }

      group = this.builder(settings);
      group.el.child.actions.append(this.settings.groupSettings[this.settings.style]);

      if (this.settings.cloneable) {
        group.addAction('clone', this.templates.cloneIcon, this.cloneItem.bind(this, group), this.settings.style === 'block');
      }

      if (this.settings.removeable) {
        group.addAction('remove', this.templates.removeIcon, this.removeItem.bind(this, group), this.settings.style === 'block');
      }

      group.on('focus', this._calcFocusState);
      group.on('blur', this._calcBlurState);
      group.on('submit', this._emitSubmit);
      SimplyBind('event:input').of(group).to(() => {
        return this.emit('input', this._value, group);
      });
      SimplyBind('disabled').of(this.state).to('disabled').of(group.state);
      refreshChildren = group.el.childf;

      if (this.settings.dynamicLabel) {
        group.on('input', () => {
          return this._recalcLabel(group);
        });
      }

      if (this.settings.autoRemoveEmpty) {
        group.once('blur', () => {
          if (!group.state.interacted) {
            return this.removeItem(group);
          }
        });
      }

      if (!this.settings.autoWidth) {
        group.state.width = this.settings.groupWidth;
        group.el.child.innerwrap.once('inserted', function () {
          return this.style('width', `calc(100% - ${this.parent.child.actions.width || 17}px)`);
        });
      }

      if (!skipInsert) {
        group.insertBefore(this.el.child.addButton);

        if (!skipEmit) {
          this.emit('itemAdd', group);
        }

        this._value.push(group);
      }

      return group;
    }

    cloneItem(group) {
      var clone;

      if (this.settings.maxItems && this._value.length === this.settings.maxItems || this.state.disabled) {
        return;
      }

      if (!includes(this._value, group)) {
        return;
      }

      clone = this.addItem(group.value, true);
      clone.insertAfter(group.el);
      insertAfter(this._value, group, clone);
      this.emit('itemAdd', clone);
      this.emit('itemClone', clone);
      this.reOrganize();
      return clone;
    }

    removeItem(group) {
      var ref, removed, targetIndex;

      if (this.settings.minItems && this._value.length === this.settings.minItems || this.state.disabled) {
        return;
      }

      targetIndex = Math.max(1, this._value.indexOf(group));

      if (removed = removeItem(this._value, group)) {
        group.destroy();
        this.emit('itemRemove', group);

        if ((ref = this._value[targetIndex - 1]) != null) {
          ref.focus();
        }
      }

      this.reOrganize();
      return !!removed;
    }

    reOrganize() {
      var children;
      children = [].slice.call(this.el.child.innerwrap.raw.childNodes, 0, -1);
      return this._value = children.map(function (entry) {
        return entry._quickField;
      });
    }

  }
  RepeaterField.prototype.template = template;
  RepeaterField.prototype.templates = templates;
  RepeaterField.prototype.defaults = defaults;
  RepeaterField.prototype.shallowSettings = ['fields'];
  return RepeaterField;
}.call(undefined);

var RepeaterField$1 = RepeaterField;export default RepeaterField$1;