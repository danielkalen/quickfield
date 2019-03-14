import'@danielkalen/is';import IS from'../../checks.js';import DOM from'quickdom';import SimplyBind from'@danielkalen/simplybind';import'../../constants/regex.js';import {removeItem,noop,lockScroll,unlockScroll,startsWith}from'../../helpers.js';import extend from'smart-extend';import Condition from'../condition.js';import globalDefaults from'../../field/globalDefaults.js';import KEYCODES from'../../constants/keyCodes.js';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import'../../svg/caretUp.js';import'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import {a as template}from'./template-b961f81f.js';import defaults from'./defaults.js';var Choice, Dropdown, List;

Dropdown = function () {
  class Dropdown {
    constructor(initialChoices, field) {
      this.initialChoices = initialChoices;
      this.field = field;
      this.isOpen = false;
      this.typeBuffer = '';
      this.settings = extend.deep.clone.filter(this._settingFilters)(globalDefaults, this.defaults, this.field.settings.dropdown);
      this.selected = this.settings.multiple ? [] : null;
      this.lastSelected = null;
      this.choices = [];
      this.currentHighlighted = null;
      this.visibleChoicesCount = 0;
      this.visibleChoices = [];
      this.els = {};
      this._selectedCallback = noop;

      this._createElements();

      this._attachBindings();

      return this;
    }

    _createElements() {
      var choice, globalOpts, i, len, ref;
      globalOpts = {
        relatedInstance: this
      };
      this.els.container = this.template.default.spawn(this.settings.templates.default, extend({
        passStateToChildren: false
      }, globalOpts));
      this.els.list = this.template.list.spawn(this.settings.templates.list, globalOpts).appendTo(this.els.container);
      this.els.help = this.template.help.spawn(this.settings.templates.help, globalOpts).appendTo(this.els.container);
      this.els.scrollIndicatorUp = this.template.scrollIndicatorUp.spawn(this.settings.templates.scrollIndicatorUp, globalOpts).appendTo(this.els.container);
      this.els.scrollIndicatorDown = this.template.scrollIndicatorDown.spawn(this.settings.templates.scrollIndicatorDown, globalOpts).appendTo(this.els.container);
      this.list = new List(this);
      ref = this.initialChoices;

      for (i = 0, len = ref.length; i < len; i++) {
        choice = ref[i];
        this.addChoice(choice);
      }
    }

    _attachBindings() {
      this._attachBindings_elState();

      this._attachBindings_display();

      return this._attachBindings_scrollIndicators();
    }

    _attachBindings_elState() {
      SimplyBind('help').of(this.settings).to('text').of(this.els.help).and.to(showHelp => {
        return this.els.help.state('showHelp', showHelp);
      });
      SimplyBind('visibleChoicesCount').of(this).to(count => {
        return this.els.container.state('hasVisibleChoices', !!count);
      });
      return SimplyBind('currentHighlighted').of(this).to((current, prev) => {
        if (prev) {
          prev.el.state('hover', false);
        }

        if (current) {
          return current.el.state('hover', true);
        }
      });
    }

    _attachBindings_display() {
      SimplyBind('isOpen', {
        updateOnBind: false
      }).of(this).to(isOpen => {
        this.els.container.state('isOpen', isOpen);

        if (!isOpen) {
          this.currentHighlighted = null;
        }

        if (this.settings.lockScroll) {
          if (isOpen) {
            lockScroll(this.els.list);
          } else {
            unlockScroll();
          }
        }

        if (isOpen) {
          this.list.appendChoices();
          this.list.calcDisplay();

          if (this.selected && !this.settings.multiple) {
            return this.list.scrollToChoice(this.selected);
          }
        } else {
          return this.list.setTranslate(0);
        }
      });
      SimplyBind('lastSelected', {
        updateOnBind: false,
        updateEvenIfSame: true
      }).of(this).to((newChoice, prevChoice) => {
        return this._selectedCallback(newChoice, prevChoice);
      });
      SimplyBind('focused', {
        updateOnBind: false
      }).of(this.field.state).to(focused => {
        if (!focused) {
          return this.field.el.child.input.off('keydown.dropdownNav');
        } else {
          return this.field.el.child.input.on('keydown.dropdownNav', event => {
            if (this.isOpen) {
              switch (event.keyCode) {
                case KEYCODES.up:
                  event.preventDefault();
                  return this.highlightPrev();

                case KEYCODES.down:
                  event.preventDefault();
                  return this.highlightNext();

                case KEYCODES.enter:
                  event.preventDefault();

                  if (this.currentHighlighted) {
                    return this.lastSelected = this.currentHighlighted;
                  }

                  break;

                case KEYCODES.esc:
                  event.preventDefault();
                  return this.isOpen = false;
              }
            }
          });
        }
      });

      if (!this.settings.typeBuffer) {
        return;
      }

      SimplyBind('focused', {
        updateOnBind: false
      }).of(this.field.state).to(focused => {
        if (!focused) {
          return DOM(document).off('keypress.dropdownTypeBuffer');
        } else {
          return DOM(document).on('keypress.dropdownTypeBuffer', event => {
            if (this.isOpen) {
              event.preventDefault();

              if (!KEYCODES.anyPrintable(event.keyCode)) {
                return;
              }

              return this.typeBuffer += event.key;
            }
          });
        }
      });
      return SimplyBind('typeBuffer', {
        updateOnBind: false
      }).of(this).to(() => {
        clearTimeout(this.typeBufferTimeout);
        return this.typeBufferTimeout = setTimeout(() => {
          return this.typeBuffer = '';
        }, 1500);
      }).and.to(buffer => {
        var choice, i, len, ref;

        if (buffer) {
          ref = this.visibleChoices;

          for (i = 0, len = ref.length; i < len; i++) {
            choice = ref[i];

            if (startsWith(buffer, choice.label)) {
              this.currentHighlighted = choice;

              if (!this.list.choiceInView(choice)) {
                this.list.scrollToChoice(choice);
              }

              return;
            }
          }
        }
      });
    }

    _attachBindings_scrollIndicators() {
      SimplyBind('scrollTop', {
        updateEvenIfSame: true
      }).of(this.els.list.raw).to(scrollTop => {
        return this._updateScrollIndicatorVisibility();
      }).condition(() => {
        return this.isOpen && !this.settings.help && this.els.list.raw.scrollHeight !== this.els.list.raw.clientHeight && this.els.list.raw.clientHeight >= 100;
      }).updateOn('event:scroll').of(this.els.list.raw).updateOn('isOpen').of(this);
      this.els.scrollIndicatorUp.on('mouseenter', () => {
        return this.list.startScrolling('up');
      });
      this.els.scrollIndicatorUp.on('mouseleave', () => {
        return this.list.stopScrolling();
      });
      this.els.scrollIndicatorDown.on('mouseenter', () => {
        return this.list.startScrolling('down');
      });
      return this.els.scrollIndicatorDown.on('mouseleave', () => {
        return this.list.stopScrolling();
      });
    }

    _updateScrollIndicatorVisibility() {
      var scrollTop, showBottomIndicator, showTopIndicator;
      scrollTop = this.els.list.raw;
      showTopIndicator = scrollTop > 0;
      showBottomIndicator = this.els.list.raw.scrollHeight - this.els.list.raw.clientHeight > scrollTop;
      this.els.scrollIndicatorUp.state('visible', showTopIndicator);
      return this.els.scrollIndicatorDown.state('visible', showBottomIndicator);
    }

    addChoice(config) {
      var i, item, len, newChoice;

      if (IS.array(config)) {
        for (i = 0, len = config.length; i < len; i++) {
          item = config[i];
          this.addChoice(item);
        }

        return;
      } else if (IS.string(config)) {
        config = {
          label: config,
          value: config
        };
      } else if (IS.objectPlain(config)) {
        if (config.value == null) {
          config.value = config.label;
        }

        if (config.label == null) {
          config.label = config.value;
        }
      } else {
        return;
      }

      newChoice = new Choice(this, config, this.list, this.choices.length);

      if (this.list.appendedChoices) {
        newChoice.init();
      }

      this.choices.push(newChoice);
      return newChoice;
    }

    removeChoice(choice) {
      var i, item, len;

      if (IS.array(choice)) {
        for (i = 0, len = choice.length; i < len; i++) {
          item = choice[i];
          this.removeChoice(item);
        }

        return;
      } else {
        choice = this.findChoiceAny(choice);
      }

      if (!choice) {
        return;
      }

      return choice.remove();
    }

    replaceChoices(newChoices) {
      this.removeChoice(this.choices.slice());
      this.addChoice(newChoices);
    }

    appendTo(target) {
      return this.els.container.appendTo(target);
    }

    onSelected(callback) {
      return this._selectedCallback = callback;
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

    highlightPrev() {
      var choice, currentIndex;
      currentIndex = this.visibleChoices.indexOf(this.currentHighlighted);

      if (currentIndex > 0) {
        this.currentHighlighted = choice = this.visibleChoices[currentIndex - 1];

        if (!this.list.choiceInView(choice)) {
          return this.list.scrollUp(choice);
        }
      } else {
        this.currentHighlighted = choice = this.visibleChoices[this.visibleChoices.length - 1];

        if (!this.list.choiceInView(choice)) {
          return this.list.scrollToChoice(choice, 1);
        }
      }
    }

    highlightNext() {
      var choice, currentIndex;
      currentIndex = this.visibleChoices.indexOf(this.currentHighlighted);

      if (currentIndex < this.visibleChoices.length - 1) {
        this.currentHighlighted = choice = this.visibleChoices[currentIndex + 1];

        if (!this.list.choiceInView(choice)) {
          return this.list.scrollDown(choice);
        }
      } else {
        this.currentHighlighted = choice = this.visibleChoices[0];

        if (!this.list.choiceInView(choice)) {
          return this.list.scrollToChoice(choice, 1);
        }
      }
    }

  }
  Dropdown.prototype.template = template;
  Dropdown.prototype.defaults = defaults;
  Dropdown.prototype._settingFilters = {
    maxHeight: function (value) {
      return IS.number(value);
    }
  };
  return Dropdown;
}.call(undefined);

List = class List {
  constructor(dropdown) {
    this.choiceInView = this.choiceInView.bind(this);
    this.dropdown = dropdown;
    ({
      els: this.els,
      field: this.field,
      settings: this.settings
    } = this.dropdown);
    this.el = this.els.list;
    this.container = this.els.container;
    this.appendedChoices = false;
  }

  appendChoices() {
    var choice, i, len, ref;

    if (this.appendedChoices) {
      return;
    }

    ref = this.dropdown.choices;

    for (i = 0, len = ref.length; i < len; i++) {
      choice = ref[i];
      choice.init();
    }

    return this.appendedChoices = true;
  }

  calcDisplay() {
    var bottomCutoff, clippingParent, clippingRect, cutoff, height, isBottomCutoff, isTopCutoff, needsNewHeight, padding, scrollHeight, selfRect, topCutoff, translation, windowCutoff, windowHeight;
    windowHeight = window.innerHeight;
    translation = this.translation || 0;
    clippingParent = this.container.parentMatching(function (parent) {
      var overflow;
      overflow = parent.style('overflowY');
      return overflow === 'hidden' || overflow === 'scroll';
    });
    scrollHeight = this.el.raw.scrollHeight || 2e308;
    selfRect = extend.clone(this.container.rect);
    padding = selfRect.height - this.el.height;
    height = Math.min(scrollHeight, this.settings.maxHeight, window.innerHeight - 40);
    selfRect.bottom = selfRect.top + height;

    if (clippingParent) {
      clippingRect = clippingParent.rect;
      bottomCutoff = selfRect.bottom - clippingRect.bottom;
      topCutoff = clippingRect.top - selfRect.top;
      isBottomCutoff = bottomCutoff > 0;
      isTopCutoff = topCutoff > 0;

      if (selfRect.top >= clippingRect.bottom || clippingRect.top >= selfRect.bottom) {
        console.warn(`The dropdown for element '${this.field.ID}' cannot be displayed as it's hidden by the parent overflow`);
      } else if (isBottomCutoff || isTopCutoff) {
        needsNewHeight = true;

        if (selfRect.top - bottomCutoff > clippingRect.top && !isTopCutoff) {
          translation = bottomCutoff;
          selfRect.top -= translation;
          selfRect.bottom -= translation;
          cutoff = clippingRect.top - selfRect.top;
        } else if (selfRect.bottom - topCutoff < clippingRect.bottom) {
          translation = topCutoff * -1;
          selfRect.top += translation;
          selfRect.bottom += translation;
          cutoff = selfRect.bottom - clippingRect.bottom;
        }

        if (needsNewHeight = cutoff > 0) {
          height = cutoff - padding;
        }
      }
    }

    windowCutoff = selfRect.top + height - windowHeight;

    if (windowCutoff > 0 && height < windowHeight) {
      translation += windowCutoff + 10;
    }

    this.setDimensions(height, this.field.el.child.innerwrap.width + 10);
    return this.setTranslate(translation);
  }

  setDimensions(height, width) {
    if (height != null) {
      this.el.style('maxHeight', height);
    }

    if (width != null) {
      return this.el.style('minWidth', width);
    }
  }

  setTranslate(translation) {
    this.translation = translation;
    translation *= -1;
    return this.container.style('transform', `translateY(${translation}px)`);
  }

  scrollToChoice(choice, offset = 3) {
    var distaneFromTop, selectedHeight;
    distaneFromTop = choice.el.raw.offsetTop;
    selectedHeight = choice.el.height;
    return this.el.raw.scrollTop = distaneFromTop - selectedHeight * offset;
  }

  scrollDown(choice) {
    return this.el.raw.scrollTop += choice.el.height;
  }

  scrollUp(choice) {
    return this.el.raw.scrollTop -= choice.el.height;
  }

  choiceInView(choice) {
    var choiceRect, downPadding, listRect, upPadding;
    choiceRect = choice.el.rect;
    listRect = this.el.rect;
    upPadding = this.els.scrollIndicatorUp.state('visible') ? parseFloat(this.els.scrollIndicatorUp.styleSafe('height', true)) : void 0;
    downPadding = this.els.scrollIndicatorDown.state('visible') ? parseFloat(this.els.scrollIndicatorDown.styleSafe('height', true)) : void 0;
    return choiceRect.bottom <= listRect.bottom - downPadding && choiceRect.top >= listRect.top + upPadding;
  }

  startScrolling(direction) {
    return this.scrollIntervalID = setInterval(() => {
      return this.el.raw.scrollTop += direction === 'up' ? -20 : 20;
    }, 50);
  }

  stopScrolling() {
    return clearInterval(this.scrollIntervalID);
  }

};
Choice = class Choice {
  constructor(dropdown, settings, list, index) {
    var ref;
    this.dropdown = dropdown;
    this.settings = settings;
    this.list = list;
    this.index = index;
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

    this.field = this.dropdown.field;
    this.visible = true;
    this.selected = false;
    this.unavailable = false;
    this.initialized = false;

    if ((ref = this.conditions) != null ? ref.length : void 0) {
      this.unavailable = true;
      this.allFields = this.field.allFields;
      Condition.init(this, this.conditions, () => {
        return this.unavailable = !Condition.validate(this.conditions);
      });
    }
  }

  init() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.el = this.dropdown.template.choice.spawn(null, {
      relatedInstance: this.dropdown
    });
    this.el.children[1].text = this.label;
    this.el.appendTo(this.list.el);
    return this._attachBindings();
  }

  remove() {
    if (!this.initialized) {
      return;
    }

    return this.el.remove();
  }

  _attachBindings() {
    return (() => {
      SimplyBind('visible').of(this).to((visible, prev) => {
        this.dropdown.visibleChoicesCount += visible ? 1 : -1;
        this.el.state('visible', visible);

        if (visible) {
          this.dropdown.visibleChoices.push(this);

          if (IS.defined(prev)) {
            // indicates state has changed
            return this.dropdown.visibleChoices.sort(function (a, b) {
              return a.index - b.index;
            });
          }
        } else {
          return removeItem(this.dropdown.visibleChoices, this);
        }
      });
      SimplyBind('selected').of(this).to(selected => {
        return this.el.state('selected', selected);
      });
      SimplyBind('unavailable').of(this).to(unavailable => {
        return this.el.state('unavailable', unavailable);
      }).and.to(unavailable => {
        if (unavailable) {
          return this.toggle(false, true);
        }
      });
      SimplyBind('event:click').of(this.el).to(() => {
        return this.dropdown.lastSelected = this;
      });
      SimplyBind('event:mousedown').of(this.el).to(event => {
        event.preventDefault();
        return event.stopPropagation();
      });
      return SimplyBind('event:mouseenter').of(this.el).to(() => {
        return this.dropdown.currentHighlighted = this;
      });
    })();
  }

  toggle(newValue, unavailable) {
    var newState, prevState, ref, wasSelected;
    prevState = this.selected;
    newState = IS.defined(newValue) ? newValue : !this.selected;

    if (!newState) {
      if (this.dropdown.settings.multiple && prevState) {
        this.selected = newState;
        return removeItem(this.field._value, this);
      } else {
        wasSelected = this.selected;

        if (IS.defined(newValue)) {
          this.selected = newState;
        }

        if (unavailable && wasSelected) {
          return this.field._value = null;
        }
      }
    } else {
      this.selected = newState;

      if (this.field.settings.multiple) {
        this.field._value.push(this);
      } else {
        if ((ref = this.field._value) != null) {
          ref.toggle(false);
        }

        this.field._value = this;
      }

      return this.field.lastSelected = this;
    }
  }

};
var Dropdown$1 = Dropdown;export default Dropdown$1;export{Choice};