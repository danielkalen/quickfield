(function (require, global) {
require = (function (cache, modules, cx) {
return function (r) {
if (!modules[r]) throw new Error(r + ' is not a module');
return cache[r] ? cache[r].exports : ((cache[r] = {
exports: {}
}, cache[r].exports = modules[r].call(cx, require, cache[r], cache[r].exports)));
};
})({}, {
0: function (require, module, exports) {
var DOM, IS, QuickField, REQUIRED_FIELD_METHODS, extend, helpers, newBuilder, registerAnimations;

helpers = require(1);

DOM = require(2);

IS = require(3);

extend = require(4);

registerAnimations = require(5);

REQUIRED_FIELD_METHODS = require(6);


/* istanbul ignore next */
if (this.console == null) {
  this.console = {};
}


/* istanbul ignore next */

if (console.log == null) {
  console.log = function() {};
}


/* istanbul ignore next */

if (console.warn == null) {
  console.warn = console.log;
}

;

newBuilder = function(settingOverrides, templateOverrides) {
  var Field, builder;
  builder = function(settings) {
    if (!IS.object(settings)) {
      settings = {};
    }
    if (settings.type == null) {
      settings.type = 'text';
    }
    if (!Field[settings.type]) {
      throw new Error("QuickField: '" + settings.type + "' is not a valid/registered field type");
    }
    registerAnimations();
    return new Field[settings.type](settings, builder, settingOverrides, templateOverrides);
  };
  builder.register = function(type, targetField) {
    var i, len, requiredMethod;
    if (!IS.string(type) || !IS["function"](targetField)) {
      throw new Error("QuickField Registration: invalid arguments");
    }
    for (i = 0, len = REQUIRED_FIELD_METHODS.length; i < len; i++) {
      requiredMethod = REQUIRED_FIELD_METHODS[i];
      if (!targetField.prototype[requiredMethod]) {
        throw new Error("QuickField Registration: '" + requiredMethod + "' method is required in order to register the field");
      }
    }
    Field[type] = targetField;
    return this;
  };
  builder.config = function(newSettings, newTemplates) {
    var config, globalConfig, name, originalTemplates, outputSettings, outputTemplates, ref, templates, type;
    if (!IS.object(newSettings)) {
      throw new Error("QuickField Config: invalid config object provided " + (String(newSettings)));
    }
    outputSettings = Object.create(null);
    for (type in newSettings) {
      config = newSettings[type];
      if (type === 'global') {
        outputSettings.globalDefaults = extend.deep.notDeep(Field.shallowSettings).clone(Field.prototype.globalDefaults, config);
      } else if (Field[type]) {
        outputSettings[type] = extend.clone.deep.notDeep(Field.shallowSettings)(Field[type].prototype.defaults, config);
      }
    }
    if (IS.object(newTemplates)) {
      outputTemplates = Object.create(null);
      globalConfig = newTemplates.global;
      if (globalConfig && globalConfig.field && !globalConfig["default"]) {
        globalConfig["default"] = globalConfig.field;
      }
      for (type in Field) {
        originalTemplates = (ref = Field[type].prototype) != null ? ref.templates : void 0;
        templates = newTemplates[type] || globalConfig;
        if (!originalTemplates) {
          continue;
        }
        if (!templates) {
          outputTemplates[type] = originalTemplates;
          continue;
        }
        if (templates.field && !templates["default"]) {
          templates["default"] = templates.field;
        }
        outputTemplates[type] = Object.create(null);
        for (name in templates) {
          config = templates[name];
          if (name === 'field' || !originalTemplates[name]) {
            continue;
          }
          if (globalConfig && globalConfig[name]) {
            config = extend.clone.deep.concat(globalConfig[name], config);
          }
          outputTemplates[type][name] = originalTemplates[name].extend(config);
        }
        for (name in originalTemplates) {
          config = originalTemplates[name];
          if (!outputTemplates[type][name]) {
            outputTemplates[type][name] = config;
          }
        }
      }
    }
    return newBuilder(outputSettings, outputTemplates);
  };
  Object.defineProperty(builder, 'fields', {
    get: function() {
      return extend.clone.own.notKeys('instances')(Field);
    }
  });
  builder.settingOverrides = settingOverrides;
  builder.templateOverrides = templateOverrides;
  builder.version = "1.0.70-b";
  builder.Field = Field = require(9);
  return builder;
};

QuickField = newBuilder();

QuickField.register('text', require(10));

module.exports = QuickField;

;
return module.exports;
},
1: function (require, module, exports) {
var DOM, IS, SimplyBind, helpers, regex;

IS = require(3);

DOM = require(2);

SimplyBind = require(11);

regex = require(12);

helpers = exports;

helpers.noop = function() {};

helpers.includes = function(target, item) {
  return target && target.indexOf(item) !== -1;
};

helpers.repeat = function(string, count) {
  var i;
  return ((function() {
    var j, ref, results1;
    results1 = [];
    for (i = j = 1, ref = count; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      results1.push(string);
    }
    return results1;
  })()).join('');
};

helpers.removeItem = function(target, item) {
  var itemIndex;
  itemIndex = target.indexOf(item);
  if (itemIndex !== -1) {
    return target.splice(itemIndex, 1);
  }
};

helpers.insertAfter = function(target, item, newItem) {
  var itemIndex;
  itemIndex = target.indexOf(item);
  if (itemIndex !== -1) {
    return target.splice(itemIndex, 0, newItem);
  }
};

helpers.find = function(target, fn) {
  var results;
  results = target.filter(fn);
  return results[0];
};

helpers.diff = function(source, comparee) {
  var compareeVal, i, maxLen, result, sourceVal;
  result = [];
  maxLen = Math.max(source.length, comparee.length);
  i = -1;
  while (++i < maxLen) {
    sourceVal = source[i];
    compareeVal = comparee[i];
    if (sourceVal !== compareeVal) {
      if (IS.defined(sourceVal) && !helpers.includes(comparee, sourceVal)) {
        result.push(sourceVal);
      }
      if (IS.defined(compareeVal) && !helpers.includes(source, compareeVal)) {
        result.push(compareeVal);
      }
    }
  }
  return result;
};

helpers.hexToRGBA = function(hex, alpha) {
  var B, G, R;
  if (hex[0] === '#') {
    hex = hex.slice(1);
  }
  R = parseInt(hex.slice(0, 2), 16);
  G = parseInt(hex.slice(2, 4), 16);
  B = parseInt(hex.slice(4, 6), 16);
  return "rgba(" + R + ", " + G + ", " + B + ", " + alpha + ")";
};

helpers.defaultColor = function(color, defaultColor) {
  if (color === 'transparent' || !color) {
    return defaultColor;
  } else {
    return color;
  }
};

helpers.calcPadding = function(desiredHeight, fontSize) {
  return Math.ceil((desiredHeight - fontSize * 1.231) / 2);
};

helpers.unlockScroll = function(excludedEl) {
  window._isLocked = false;
  return DOM(window).off('wheel.lock');
};

helpers.lockScroll = function(excludedEl) {
  if (!window._isLocked) {
    window._isLocked = true;
    return DOM(window).on('wheel.lock', function(event) {
      if (event.target === excludedEl.raw || DOM(event.target).parentMatching(function(parent) {
        return parent === excludedEl;
      })) {
        if (event.wheelDelta > 0 && excludedEl.raw.scrollTop === 0) {
          return event.preventDefault();
        }
        if (event.wheelDelta < 0 && excludedEl.raw.scrollHeight - excludedEl.raw.scrollTop === excludedEl.raw.clientHeight) {
          return event.preventDefault();
        }
      } else {
        return event.preventDefault();
      }
    });
  }
};

helpers.fuzzyMatch = function(needle, haystack, caseSensitive) {
  var hI, hLength, matchedCount, nI, nLength, needleChar;
  nLength = needle.length;
  hLength = haystack.length;
  if (!caseSensitive) {
    needle = needle.toUpperCase();
    haystack = haystack.toUpperCase();
  }
  if (nLength > hLength) {
    return false;
  }
  if (nLength === hLength) {
    return needle === haystack;
  }
  nI = hI = matchedCount = 0;
  while (nI < nLength) {
    needleChar = needle[nI++];
    while (hI < hLength) {
      if (haystack[hI++] === needleChar) {
        matchedCount++;
        break;
      }
    }
  }
  return matchedCount === nLength;
};

helpers.startsWith = function(needle, haystack, caseSensitive) {
  var i;
  if (!caseSensitive) {
    needle = needle.toUpperCase();
    haystack = haystack.toUpperCase();
  }
  if (needle.length > haystack.length) {
    return false;
  }
  if (needle.length === haystack.length) {
    return needle === haystack;
  }
  i = -1;
  while (needle[++i]) {
    if (needle[i] !== haystack[i]) {
      return false;
    }
  }
  return true;
};

helpers.getIndexOfFirstDiff = function(sourceString, compareString) {
  var currentPos, maxLength;
  currentPos = 0;
  maxLength = Math.max(sourceString.length, compareString.length);
  while (currentPos < maxLength) {
    if (sourceString[currentPos] !== compareString[currentPos]) {
      return currentPos;
    }
    currentPos++;
  }
  return null;
};

helpers.parseCssShorthandValue = function(string) {
  var result, values;
  values = string.split(regex.whiteSpace).map(parseFloat);
  result = {};
  switch (values.length) {
    case 1:
      result.top = result.right = result.bottom = result.left = values[0];
      break;
    case 2:
      result.top = result.bottom = values[0];
      result.right = result.left = values[1];
      break;
    case 3:
      result.top = values[0];
      result.right = result.left = values[1];
      result.bottom = values[2];
      break;
    case 4:
      result.top = values[0];
      result.right = values[1];
      result.bottom = values[2];
      result.left = values[3];
  }
  return result;
};

helpers.shorthandSideValue = function(value, side) {
  var values;
  switch (typeof value) {
    case 'number':
      return value;
    case 'string':
      values = helpers.parseCssShorthandValue(value);
      return values[side];
    default:
      return 0;
  }
};

helpers.updateShorthandValue = function(value, side, newValue) {
  var values;
  values = helpers.parseCssShorthandValue('' + (value || 0));
  switch (side) {
    case 'top':
      values.top += newValue;
      break;
    case 'right':
      values.right += newValue;
      break;
    case 'bottom':
      values.bottom += newValue;
      break;
    case 'left':
      values.left += newValue;
      break;
    default:
      Object.keys(values).forEach(function(side) {
        return values[side] += newValue;
      });
  }
  return values.top + "px " + values.right + "px " + values.bottom + "px " + values.left + "px";
};

;
return module.exports;
},
2: function (require, module, exports) {
var QuickDom, svgNamespace;

svgNamespace = 'http://www.w3.org/2000/svg';


/* istanbul ignore next */

var CSS = require(13);


/* istanbul ignore next */

var extend = require(4);

var allowedOptions, allowedTemplateOptions;

allowedTemplateOptions = ['id', 'name', 'type', 'href', 'selected', 'checked', 'className'];

allowedOptions = ['id', 'ref', 'type', 'name', 'text', 'style', 'class', 'className', 'url', 'href', 'selected', 'checked', 'props', 'attrs', 'passStateToChildren', 'stateTriggers'];

;

var helpers, styleCache;

helpers = {};

helpers.includes = function(target, item) {
  return target && target.indexOf(item) !== -1;
};

helpers.removeItem = function(target, item) {
  var itemIndex;
  itemIndex = target.indexOf(item);
  if (itemIndex !== -1) {
    target.splice(itemIndex, 1);
  }
  return target;
};

helpers.normalizeGivenEl = function(targetEl) {
  switch (false) {
    case !IS.string(targetEl):
      return QuickDom.text(targetEl);
    case !IS.domNode(targetEl):
      return QuickDom(targetEl);
    case !IS.template(targetEl):
      return targetEl.spawn();
    default:
      return targetEl;
  }
};

helpers.isStateStyle = function(string) {
  return string[0] === '$' || string[0] === '@';
};

helpers.registerStyle = function(rule, level, important) {
  var cached, i, len, output, prop, props;
  level || (level = 0);
  cached = styleCache.get(rule, level);
  if (cached) {
    return cached;
  }
  output = {
    className: [CSS.register(rule, level, important)],
    fns: [],
    rule: rule
  };
  props = Object.keys(rule);
  for (i = 0, len = props.length; i < len; i++) {
    prop = props[i];
    if (typeof rule[prop] === 'function') {
      output.fns.push([prop, rule[prop]]);
    }
  }
  return styleCache.set(rule, output, level);
};

styleCache = new ((function() {
  function _Class() {
    this.keys = Object.create(null);
    this.values = Object.create(null);
  }

  _Class.prototype.get = function(key, level) {
    var index;
    if (this.keys[level]) {
      index = this.keys[level].indexOf(key);
      if (index !== -1) {
        return this.values[level][index];
      }
    }
  };

  _Class.prototype.set = function(key, value, level) {
    if (!this.keys[level]) {
      this.keys[level] = [];
      this.values[level] = [];
    }
    this.keys[level].push(key);
    this.values[level].push(value);
    return value;
  };

  return _Class;

})());

;

var IS;

IS = require(24);

IS = IS.create('natives', 'dom');

IS.load({
  quickDomEl: function(subject) {
    return subject && subject.constructor.name === QuickElement.name;
  },
  template: function(subject) {
    return subject && subject.constructor.name === QuickTemplate.name;
  }
});

;

var QuickElement;

QuickElement = (function() {
  function QuickElement(type, options) {
    this.type = type;
    this.options = options;
    if (this.type[0] === '*') {
      this.svg = true;
    }
    this.el = this.options.existing || (this.type === 'text' ? document.createTextNode(typeof this.options.text === 'string' ? this.options.text : '') : this.svg ? document.createElementNS(svgNamespace, this.type.slice(1)) : document.createElement(this.type));
    if (this.type === 'text') {
      this.append = this.prepend = this.attr = function() {};
    }
    this._parent = null;
    this._styles = {};
    this._state = [];
    this._children = [];
    this._normalizeOptions();
    this._applyOptions();
    this._attachStateEvents();
    this._proxyParent();
    if (this.options.existing) {
      this._refreshParent();
    }
    this.el._quickElement = this;
  }

  QuickElement.prototype.toJSON = function() {
    var child, children, i, len, output;
    output = [this.type, extend.clone.keys(allowedOptions)(this.options)];
    children = this.children;
    for (i = 0, len = children.length; i < len; i++) {
      child = children[i];
      output.push(child.toJSON());
    }
    return output;
  };

  return QuickElement;

})();


/* istanbul ignore next */

if (QuickElement.name == null) {
  QuickElement.name = 'QuickElement';
}

Object.defineProperties(QuickElement.prototype, {
  'raw': {
    get: function() {
      return this.el;
    }
  },
  '0': {
    get: function() {
      return this.el;
    }
  },
  'css': {
    get: function() {
      return this.style;
    }
  },
  'replaceWith': {
    get: function() {
      return this.replace;
    }
  },
  'removeListener': {
    get: function() {
      return this.off;
    }
  }
});

;

var _filterElements, _getChildRefs, _getIndexByProp, _getParents;

QuickElement.prototype.parentsUntil = function(filter) {
  return _getParents(this, filter);
};

QuickElement.prototype.parentMatching = function(filter) {
  var isRef, nextParent;
  if (IS["function"](filter) || (isRef = IS.string(filter))) {
    nextParent = this.parent;
    while (nextParent) {
      if (isRef) {
        if (nextParent.ref === filter) {
          return nextParent;
        }
      } else {
        if (filter(nextParent)) {
          return nextParent;
        }
      }
      nextParent = nextParent.parent;
    }
  }
};

QuickElement.prototype.query = function(selector) {
  return QuickDom(this.raw.querySelector(selector));
};

QuickElement.prototype.queryAll = function(selector) {
  var i, item, len, output, result;
  result = this.raw.querySelectorAll(selector);
  output = [];
  for (i = 0, len = result.length; i < len; i++) {
    item = result[i];
    output.push(item);
  }
  return new QuickBatch(output);
};

Object.defineProperties(QuickElement.prototype, {
  'children': {
    get: function() {
      var child, i, len, ref1;
      if (this.el.childNodes.length !== this._children.length) {
        this._children.length = 0;
        ref1 = this.el.childNodes;
        for (i = 0, len = ref1.length; i < len; i++) {
          child = ref1[i];
          if (child.nodeType < 4) {
            this._children.push(QuickDom(child));
          }
        }
      }
      return this._children;
    }
  },
  'elementChildren': {
    get: function() {
      return _filterElements(this.children);
    }
  },
  'parent': {
    get: function() {
      if ((!this._parent || this._parent.el !== this.el.parentNode) && !IS.domDoc(this.el.parentNode)) {
        this._parent = QuickDom(this.el.parentNode);
      }
      return this._parent;
    }
  },
  'parents': {
    get: function() {
      return _getParents(this);
    }
  },
  'next': {
    get: function() {
      return QuickDom(this.el.nextSibling);
    }
  },
  'nextEl': {
    get: function() {
      return QuickDom(this.el.nextElementSibling);
    }
  },
  'nextElAll': {
    get: function() {
      return _filterElements(this.nextAll);
    }
  },
  'nextAll': {
    get: function() {
      var nextSibling, siblings;
      siblings = [];
      nextSibling = QuickDom(this.el.nextSibling);
      while (nextSibling) {
        siblings.push(nextSibling);
        nextSibling = nextSibling.next;
      }
      return siblings;
    }
  },
  'prev': {
    get: function() {
      return QuickDom(this.el.previousSibling);
    }
  },
  'prevEl': {
    get: function() {
      return QuickDom(this.el.previousElementSibling);
    }
  },
  'prevElAll': {
    get: function() {
      return _filterElements(this.prevAll);
    }
  },
  'prevAll': {
    get: function() {
      var prevSibling, siblings;
      siblings = [];
      prevSibling = QuickDom(this.el.previousSibling);
      while (prevSibling) {
        siblings.push(prevSibling);
        prevSibling = prevSibling.prev;
      }
      return siblings;
    }
  },
  'siblings': {
    get: function() {
      return this.prevAll.reverse().concat(this.nextAll);
    }
  },
  'elementSiblings': {
    get: function() {
      return _filterElements(this.siblings);
    }
  },
  'child': {
    get: function() {
      return this._childRefs || _getChildRefs(this);
    }
  },
  'childf': {
    get: function() {
      return _getChildRefs(this, true);
    }
  },
  'firstChild': {
    get: function() {
      return this.children[0];
    }
  },
  'lastChild': {
    get: function() {
      var children;
      children = this.children;
      return children[children.length - 1];
    }
  },
  'index': {
    get: function() {
      var parent;
      if (!(parent = this.parent)) {
        return null;
      } else {
        return parent.children.indexOf(this);
      }
    }
  },
  'indexType': {
    get: function() {
      return _getIndexByProp(this, 'type');
    }
  },
  'indexRef': {
    get: function() {
      return _getIndexByProp(this, 'ref');
    }
  }
});

_getParents = function(targetEl, filter) {
  var isRef, nextParent, parents;
  if (!IS["function"](filter) && !(isRef = IS.string(filter))) {
    filter = void 0;
  }
  parents = [];
  nextParent = targetEl.parent;
  while (nextParent) {
    parents.push(nextParent);
    nextParent = nextParent.parent;
    if (isRef) {
      if (nextParent && nextParent.ref === filter) {
        nextParent = null;
      }
    } else if (filter) {
      if (filter(nextParent)) {
        nextParent = null;
      }
    }
  }
  return parents;
};

_getChildRefs = function(target, freshCopy) {
  var child, childRefs, children, el, i, len, ref, refs;
  if (freshCopy || !target._childRefs) {
    target._childRefs = {};
  }
  refs = target._childRefs;
  if (target.ref) {
    refs[target.ref] = target;
  }
  children = target.children;
  if (children.length) {
    for (i = 0, len = children.length; i < len; i++) {
      child = children[i];
      childRefs = _getChildRefs(child, freshCopy);
      for (ref in childRefs) {
        el = childRefs[ref];
        refs[ref] || (refs[ref] = el);
      }
    }
  }
  return refs;
};

_getIndexByProp = function(main, prop) {
  var parent;
  if (!(parent = main.parent)) {
    return null;
  } else {
    return parent.children.filter(function(child) {
      return child[prop] === main[prop];
    }).indexOf(main);
  }
};

_filterElements = function(array) {
  var i, item, len, output;
  if (!array.length) {
    return array;
  } else {
    output = [];
    for (i = 0, len = array.length; i < len; i++) {
      item = array[i];
      if (item.type !== 'text') {
        output.push(item);
      }
    }
    return output;
  }
};

;

var baseStateTriggers;

baseStateTriggers = {
  'hover': {
    on: 'mouseenter',
    off: 'mouseleave',
    bubbles: true
  },
  'focus': {
    on: 'focus',
    off: 'blur',
    bubbles: true
  }
};

QuickElement.prototype._normalizeOptions = function() {
  var base1, base2, base3;
  if (this.options["class"]) {
    this.options.className = this.options["class"];
  }
  if (this.options.url) {
    this.options.href = this.options.url;
  }
  this.related = (base1 = this.options).relatedInstance != null ? base1.relatedInstance : base1.relatedInstance = this;
  if ((base2 = this.options).unpassableStates == null) {
    base2.unpassableStates = [];
  }
  if ((base3 = this.options).passStateToChildren == null) {
    base3.passStateToChildren = true;
  }
  this.options.stateTriggers = this.options.stateTriggers ? extend.clone.deep(baseStateTriggers, this.options.stateTriggers) : baseStateTriggers;
  if (this.type === 'text') {
    extend(this, this._parseTexts(this.options.text, this._texts));
  } else {
    extend(this, this._parseStyles(this.options.style, this._styles));
  }
};

QuickElement.prototype._parseStyles = function(styles, store) {
  var _mediaStates, _providedStates, _providedStatesShared, _stateShared, _styles, base, flattenNestedStates, forceStyle, i, keys, len, specialStates, state, stateStyles, state_, states;
  if (!IS.objectPlain(styles)) {
    return;
  }
  keys = Object.keys(styles);
  states = keys.filter(function(key) {
    return helpers.isStateStyle(key);
  });
  specialStates = helpers.removeItem(states.slice(), '$base');
  _mediaStates = states.filter(function(key) {
    return key[0] === '@';
  }).map(function(state) {
    return state.slice(1);
  });
  _providedStates = states.map(function(state) {
    return state.slice(1);
  });
  _styles = store || {};
  _stateShared = _providedStatesShared = void 0;
  base = !helpers.includes(states, '$base') ? styles : styles.$base;
  _styles.base = helpers.registerStyle(base, 0, forceStyle = this.options.forceStyle);
  if (specialStates.length) {
    flattenNestedStates = function(styleObject, chain, level) {
      var hasNonStateProps, i, len, output, state, stateChain, state_, styleKeys;
      styleKeys = Object.keys(styleObject);
      output = {};
      hasNonStateProps = false;
      for (i = 0, len = styleKeys.length; i < len; i++) {
        state = styleKeys[i];
        if (!helpers.isStateStyle(state)) {
          hasNonStateProps = true;
          output[state] = styleObject[state];
        } else {
          chain.push(state_ = state.slice(1));
          stateChain = new (require(73))(chain);
          if (_stateShared == null) {
            _stateShared = [];
          }
          if (_providedStatesShared == null) {
            _providedStatesShared = [];
          }
          _providedStatesShared.push(stateChain);
          if (state[0] === '@') {
            _mediaStates.push(state_);
          }
          _styles[stateChain.string] = helpers.registerStyle(flattenNestedStates(styleObject[state], chain, level + 1), level + 1, forceStyle);
        }
      }
      if (hasNonStateProps) {
        return output;
      }
    };
    for (i = 0, len = specialStates.length; i < len; i++) {
      state = specialStates[i];
      state_ = state.slice(1);
      stateStyles = flattenNestedStates(styles[state], [state_], 1);
      if (stateStyles) {
        _styles[state_] = helpers.registerStyle(stateStyles, 1);
      }
    }
  }
  return {
    _styles: _styles,
    _mediaStates: _mediaStates,
    _stateShared: _stateShared,
    _providedStates: _providedStates,
    _providedStatesShared: _providedStatesShared
  };
};

QuickElement.prototype._parseTexts = function(texts, store) {
  var _providedStates, _texts, i, len, state, states;
  if (!IS.objectPlain(texts)) {
    return;
  }
  states = Object.keys(texts).map(function(state) {
    return state.slice(1);
  });
  _providedStates = states.filter(function(state) {
    return state !== 'base';
  });
  _texts = store || {};
  _texts = {
    base: ''
  };
  for (i = 0, len = states.length; i < len; i++) {
    state = states[i];
    _texts[state] = texts['$' + state];
  }
  return {
    _texts: _texts,
    _providedStates: _providedStates
  };
};

QuickElement.prototype._applyOptions = function() {
  var event, handler, key, method, ref, ref1, ref2, ref3, ref4, value;
  if (ref = this.options.id || this.options.ref) {
    this.attr('data-ref', this.ref = ref);
  }
  if (this.options.id) {
    this.el.id = this.options.id;
  }
  if (this.options.className) {
    this.el.className = this.options.className;
  }
  if (this.options.src) {
    this.el.src = this.options.src;
  }
  if (this.options.href) {
    this.el.href = this.options.href;
  }
  if (this.options.type) {
    this.el.type = this.options.type;
  }
  if (this.options.name) {
    this.el.name = this.options.name;
  }
  if (this.options.value) {
    this.el.value = this.options.value;
  }
  if (this.options.selected) {
    this.el.selected = this.options.selected;
  }
  if (this.options.checked) {
    this.el.checked = this.options.checked;
  }
  if (this.options.props) {
    ref1 = this.options.props;
    for (key in ref1) {
      value = ref1[key];
      this.prop(key, value);
    }
  }
  if (this.options.attrs) {
    ref2 = this.options.attrs;
    for (key in ref2) {
      value = ref2[key];
      this.attr(key, value);
    }
  }
  this._applyRegisteredStyle(this._styles.base, null, null, this.options.styleAfterInsert);
  if (this._texts) {
    this.text = this._texts.base;
  }
  this.on('inserted', function() {
    var _, mediaStates;
    if (this.options.styleAfterInsert) {
      this.recalcStyle();
    }
    _ = this._inserted = this;
    if ((mediaStates = this._mediaStates) && this._mediaStates.length) {
      return this._mediaStates = new function() {
        var i, len, queryString;
        for (i = 0, len = mediaStates.length; i < len; i++) {
          queryString = mediaStates[i];
          this[queryString] = MediaQuery.register(_, queryString);
        }
        return this;
      };
    }
  }, false, true);
  if (this.options.recalcOnResize) {
    window.addEventListener('resize', (function(_this) {
      return function() {
        return _this.recalcStyle();
      };
    })(this));
  }
  if (this.options.events) {
    ref3 = this.options.events;
    for (event in ref3) {
      handler = ref3[event];
      this.on(event, handler);
    }
  }
  if (this.options.methods) {
    ref4 = this.options.methods;
    for (method in ref4) {
      value = ref4[method];
      if (!this[method]) {
        if (IS["function"](value)) {
          this[method] = value;
        } else if (IS.object(value)) {
          Object.defineProperty(this, method, {
            configurable: true,
            get: value.get,
            set: value.set
          });
        }
      }
    }
  }
  if (this.type !== 'text' && IS.object(this.options.text)) {
    this.append(QuickDom('text', {
      text: this.options.text
    }));
  }
};

QuickElement.prototype._attachStateEvents = function(force) {
  var fn, ref1, state, trigger;
  ref1 = this.options.stateTriggers;
  fn = (function(_this) {
    return function(state, trigger) {
      var disabler, enabler;
      if (!helpers.includes(_this._providedStates, state) && !force && !trigger.force) {
        return;
      }
      enabler = IS.string(trigger) ? trigger : trigger.on;
      if (IS.object(trigger)) {
        disabler = trigger.off;
      }
      _this._listenTo(enabler, function() {
        return _this.state(state, true, trigger.bubbles);
      });
      if (disabler) {
        return _this._listenTo(disabler, function() {
          return _this.state(state, false, trigger.bubbles);
        });
      }
    };
  })(this);
  for (state in ref1) {
    trigger = ref1[state];
    fn(state, trigger);
  }
};

QuickElement.prototype._proxyParent = function() {
  var parent;
  parent = void 0;
  return Object.defineProperty(this, '_parent', {
    get: function() {
      return parent;
    },
    set: function(newParent) {
      var lastParent;
      if (parent = newParent) {
        lastParent = this.parents.slice(-1)[0];
        if (lastParent.raw === document.documentElement) {
          this._unproxyParent(newParent);
        } else {
          parent.on('inserted', (function(_this) {
            return function() {
              if (parent === newParent) {
                return _this._unproxyParent(newParent);
              }
            };
          })(this));
        }
      }
    }
  });
};

QuickElement.prototype._unproxyParent = function(newParent) {
  delete this._parent;
  this._parent = newParent;
  this.emitPrivate('inserted', newParent);
};

;

var regexWhitespace;

regexWhitespace = /\s+/;

QuickElement.prototype.on = function(eventNames, callback, useCapture, isPrivate) {
  var callbackRef, split;
  if (this._eventCallbacks == null) {
    this._eventCallbacks = {
      __refs: {}
    };
  }
  if (IS.string(eventNames) && IS["function"](callback)) {
    split = eventNames.split('.');
    callbackRef = split[1];
    eventNames = split[0];
    if (eventNames === 'inserted' && this._inserted) {
      callback.call(this, this._parent);
      return this;
    }
    eventNames.split(regexWhitespace).forEach((function(_this) {
      return function(eventName) {
        if (!_this._eventCallbacks[eventName]) {
          _this._eventCallbacks[eventName] = [];
          if (!isPrivate) {
            _this._listenTo(eventName, function(event) {
              return _this._invokeHandlers(eventName, event);
            }, useCapture);
          }
        }
        if (callbackRef) {
          _this._eventCallbacks.__refs[callbackRef] = callback;
        }
        return _this._eventCallbacks[eventName].push(callback);
      };
    })(this));
  }
  return this;
};

QuickElement.prototype.once = function(eventNames, callback) {
  var onceCallback;
  if (IS.string(eventNames) && IS["function"](callback)) {
    this.on(eventNames, onceCallback = (function(_this) {
      return function(event) {
        _this.off(eventNames, onceCallback);
        return callback.call(_this, event);
      };
    })(this));
  }
  return this;
};

QuickElement.prototype.off = function(eventNames, callback) {
  var callbackRef, eventName, split;
  if (this._eventCallbacks == null) {
    this._eventCallbacks = {
      __refs: {}
    };
  }
  if (!IS.string(eventNames)) {
    for (eventName in this._eventCallbacks) {
      this.off(eventName);
    }
  } else {
    split = eventNames.split('.');
    callbackRef = split[1];
    eventNames = split[0];
    eventNames.split(regexWhitespace).forEach((function(_this) {
      return function(eventName) {
        if (_this._eventCallbacks[eventName]) {
          if (callback == null) {
            callback = _this._eventCallbacks.__refs[callbackRef];
          }
          if (IS["function"](callback)) {
            return helpers.removeItem(_this._eventCallbacks[eventName], callback);
          } else if (!callbackRef) {
            return _this._eventCallbacks[eventName].length = 0;
          }
        }
      };
    })(this));
  }
  return this;
};

QuickElement.prototype.emit = function(eventName, bubbles, cancelable, data) {
  var event;
  if (bubbles == null) {
    bubbles = true;
  }
  if (cancelable == null) {
    cancelable = true;
  }
  if (eventName && IS.string(eventName)) {
    event = document.createEvent('Event');
    event.initEvent(eventName, bubbles, cancelable);
    if (data && typeof data === 'object') {
      extend(event, data);
    }
    this.el.dispatchEvent(event);
  }
  return this;
};

QuickElement.prototype.emitPrivate = function(eventName, arg) {
  var ref;
  if (eventName && IS.string(eventName) && ((ref = this._eventCallbacks) != null ? ref[eventName] : void 0)) {
    this._invokeHandlers(eventName, arg);
  }
  return this;
};

QuickElement.prototype._invokeHandlers = function(eventName, arg) {
  var callbacks, cb, i, len;
  callbacks = this._eventCallbacks[eventName].slice();
  for (i = 0, len = callbacks.length; i < len; i++) {
    cb = callbacks[i];
    cb.call(this, arg);
  }
};


/* istanbul ignore next */

QuickElement.prototype._listenTo = function(eventName, callback, useCapture) {
  var eventNameToListenFor, listenMethod;
  listenMethod = this.el.addEventListener ? 'addEventListener' : 'attachEvent';
  eventNameToListenFor = this.el.addEventListener ? eventName : "on" + eventName;
  this.el[listenMethod](eventNameToListenFor, callback, useCapture);
  return this;
};

;

var DUMMY_ARRAY;

DUMMY_ARRAY = [];

QuickElement.prototype.state = function(targetState, value, bubbles, source) {
  var activeStates, child, desiredValue, i, j, key, keys, len, prop, ref, toggle;
  if (arguments.length === 1) {
    if (IS.string(targetState)) {
      return helpers.includes(this._state, targetState);
    } else if (IS.object(targetState)) {
      keys = Object.keys(targetState);
      i = -1;
      while (key = keys[++i]) {
        this.state(key, targetState[key]);
      }
      return this;
    }
  } else if (this._statePipeTarget && source !== this) {
    this._statePipeTarget.state(targetState, value, bubbles, this);
    return this;
  } else if (IS.string(targetState)) {
    if (targetState[0] === '$') {
      targetState = targetState.slice(1);
    }
    if (targetState === 'base') {
      return this;
    }
    desiredValue = !!value;
    activeStates = this._getActiveStates(targetState, false);
    if (this.state(targetState) !== desiredValue) {
      prop = this.type === 'text' ? 'Text' : 'Style';
      if (desiredValue) {
        this._state.push(targetState);
        toggle = 'ON';
      } else {
        helpers.removeItem(this._state, targetState);
        toggle = 'OFF';
      }
      this['_turn' + prop + toggle](targetState, activeStates);
      this.emitPrivate("stateChange:" + targetState, desiredValue);
    }
    if (!helpers.includes(this.options.unpassableStates, targetState)) {
      if (bubbles) {
        if (this.parent) {
          this._parent.state(targetState, value, true, source || this);
        }
      } else if (this.options.passStateToChildren) {
        ref = this._children;
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          child.state(targetState, value, false, source || this);
        }
      }
    }
    return this;
  }
};

QuickElement.prototype.toggleState = function(targetState) {
  return this.state(targetState, !this.state(targetState));
};

QuickElement.prototype.resetState = function() {
  var activeState, j, len, ref;
  ref = this._state.slice();
  for (j = 0, len = ref.length; j < len; j++) {
    activeState = ref[j];
    this.state(activeState, false);
  }
  return this;
};

QuickElement.prototype.pipeState = function(targetEl) {
  var activeState, j, len, ref;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl) && targetEl !== this) {
      this._statePipeTarget = targetEl;
      ref = this._state;
      for (j = 0, len = ref.length; j < len; j++) {
        activeState = ref[j];
        targetEl.state(activeState, true);
      }
    }
  } else if (targetEl === false) {
    delete this._statePipeTarget;
  }
  return this;
};

QuickElement.prototype._applyRegisteredStyle = function(targetStyle, superiorStates, includeBase, skipFns) {
  var className, entry, j, k, len, len1, ref, ref1, superiorStyles;
  if (targetStyle) {
    ref = targetStyle.className;
    for (j = 0, len = ref.length; j < len; j++) {
      className = ref[j];
      this.addClass(className);
    }
    if (targetStyle.fns.length && !skipFns) {
      if (superiorStates) {
        superiorStyles = this._resolveFnStyles(superiorStates, includeBase);
      }
      ref1 = targetStyle.fns;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        entry = ref1[k];
        if (!(superiorStyles && superiorStyles[entry[0]])) {
          this.style(entry[0], entry[1]);
        }
      }
    }
  }
};

QuickElement.prototype._removeRegisteredStyle = function(targetStyle, superiorStates, includeBase) {
  var className, entry, j, k, len, len1, ref, ref1, resetValue, superiorStyles;
  ref = targetStyle.className;
  for (j = 0, len = ref.length; j < len; j++) {
    className = ref[j];
    this.removeClass(className);
  }
  if (targetStyle.fns.length) {
    if (superiorStates) {
      superiorStyles = this._resolveFnStyles(superiorStates, includeBase);
    }
    ref1 = targetStyle.fns;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      entry = ref1[k];
      resetValue = superiorStyles && superiorStyles[entry[0]] || null;
      this.style(entry[0], resetValue);
    }
  }
};

QuickElement.prototype._turnStyleON = function(targetState, activeStates) {
  var j, len, sharedStates, skipFns, stateChain;
  skipFns = this.options.styleAfterInsert && !this._inserted;
  if (this._styles[targetState]) {
    this._applyRegisteredStyle(this._styles[targetState], this._getSuperiorStates(targetState, activeStates), false, skipFns);
  }
  if (this._providedStatesShared) {
    sharedStates = this._getSharedStates(targetState);
    for (j = 0, len = sharedStates.length; j < len; j++) {
      stateChain = sharedStates[j];
      if (!helpers.includes(this._stateShared, stateChain.string)) {
        this._stateShared.push(stateChain.string);
      }
      this._applyRegisteredStyle(this._styles[stateChain.string], null, null, skipFns);
    }
  }
};

QuickElement.prototype._turnStyleOFF = function(targetState, activeStates) {
  var activeSharedStates, j, len, sharedStates, stateChain, targetStyle;
  if (this._styles[targetState]) {
    this._removeRegisteredStyle(this._styles[targetState], activeStates, true);
  }
  if (this._providedStatesShared) {
    sharedStates = this._getSharedStates(targetState);
    if (sharedStates.length === 0) {
      return;
    }
    for (j = 0, len = sharedStates.length; j < len; j++) {
      stateChain = sharedStates[j];
      helpers.removeItem(this._stateShared, stateChain.string);
      targetStyle = this._styles[stateChain.string];
      if (targetStyle.fns.length && this._stateShared.length && !activeSharedStates) {
        activeSharedStates = this._stateShared.filter(function(state) {
          return !helpers.includes(state, targetState);
        });
        activeStates = activeStates.concat(activeSharedStates);
      }
      this._removeRegisteredStyle(targetStyle, activeStates, true);
    }
  }
};

QuickElement.prototype._turnTextON = function(targetState, activeStates) {
  var superiorStates, targetText;
  if (this._texts && IS.string(targetText = this._texts[targetState])) {
    superiorStates = this._getSuperiorStates(targetState, activeStates);
    if (!superiorStates.length) {
      this.text = targetText;
    }
  }
};

QuickElement.prototype._turnTextOFF = function(targetState, activeStates) {
  var targetText;
  if (this._texts && IS.string(targetText = this._texts[targetState])) {
    activeStates = activeStates.filter(function(state) {
      return state !== targetState;
    });
    targetText = this._texts[activeStates[activeStates.length - 1]];
    if (targetText == null) {
      targetText = this._texts.base;
    }
    this.text = targetText;
  }
};

QuickElement.prototype._getActiveStates = function(stateToExclude, includeSharedStates) {
  var activeStates, j, len, plainStates, state;
  if (includeSharedStates == null) {
    includeSharedStates = true;
  }
  if (!this._providedStates) {
    return DUMMY_ARRAY;
  }
  activeStates = plainStates = this._state;
  if (stateToExclude) {
    plainStates = [];
    for (j = 0, len = activeStates.length; j < len; j++) {
      state = activeStates[j];
      if (state !== stateToExclude) {
        plainStates.push(state);
      }
    }
  }
  if (!includeSharedStates || !this._providedStatesShared) {
    return plainStates;
  } else {
    return plainStates.concat(this._stateShared);
  }
};

QuickElement.prototype._getSuperiorStates = function(targetState, activeStates) {
  var candidate, j, len, superior, targetStateIndex;
  targetStateIndex = this._providedStates.indexOf(targetState);
  if (targetStateIndex === this._providedStates.length - 1) {
    return DUMMY_ARRAY;
  }
  superior = [];
  for (j = 0, len = activeStates.length; j < len; j++) {
    candidate = activeStates[j];
    if (this._providedStates.indexOf(candidate) > targetStateIndex) {
      superior.push(candidate);
    }
  }
  return superior;
};

QuickElement.prototype._getSharedStates = function(targetState) {
  var activeStates, j, len, ref, sharedStates, stateChain;
  activeStates = this._state;
  sharedStates = [];
  ref = this._providedStatesShared;
  for (j = 0, len = ref.length; j < len; j++) {
    stateChain = ref[j];
    if (stateChain.includes(targetState) && stateChain.isApplicable(targetState, activeStates)) {
      sharedStates.push(stateChain);
    }
  }
  return sharedStates;
};

QuickElement.prototype._resolveFnStyles = function(states, includeBase) {
  var entry, j, k, len, len1, output, ref, state;
  if (includeBase) {
    states = ['base'].concat(states);
  }
  output = {};
  for (j = 0, len = states.length; j < len; j++) {
    state = states[j];
    if (this._styles[state] && this._styles[state].fns.length) {
      ref = this._styles[state].fns;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        entry = ref[k];
        output[entry[0]] = entry[1];
      }
    }
  }
  return output;
};

;


/**
 * Sets/gets the value of a style property. In getter mode the computed property of
 * the style will be returned unless the element is not inserted into the DOM. In
 * webkit browsers all computed properties of a detached node are always an empty
 * string but in gecko they reflect on the actual computed value, hence we need
 * to "normalize" this behavior and make sure that even on gecko an empty string
 * is returned
 * @return {[type]} [description]
 */
var aspectRatioGetter, orientationGetter;

QuickElement.prototype.style = function(property) {
  var args, i, key, keys, result, value;
  if (this.type === 'text') {
    return;
  }
  args = arguments;
  if (IS.string(property)) {
    value = typeof args[1] === 'function' ? args[1].call(this, this.related) : args[1];
    if (args[1] === null && IS.defined(this.currentStateStyle(property)) && !IS["function"](this.currentStateStyle(property))) {
      value = CSS.UNSET;
    }
    result = CSS(this.el, property, value, this.options.forceStyle);
    if (args.length === 1) {

      /* istanbul ignore next */
      if (this._inserted) {
        return result;
      } else if (!result) {
        return result;
      } else {
        return '';
      }
    }
  } else if (IS.object(property)) {
    keys = Object.keys(property);
    i = -1;
    while (key = keys[++i]) {
      this.style(key, property[key]);
    }
  }
  return this;
};


/**
 * Attempts to resolve the value for a given property in the following order if each one isn't a valid value:
 * 1. from computed style (for dom-inserted els)
 * 2. from DOMElement.style object (for non-inserted els; if options.styleAfterInsert, will only have state styles)
 * 3. from provided style options
 * (for non-inserted els; checking only $base since state styles will always be applied to the style object even for non-inserted)
 */

QuickElement.prototype.styleSafe = function(property, skipComputed) {
  var computed, result, sample;
  if (this.type === 'text') {
    return;
  }
  sample = this.el.style[property];
  if (IS.string(sample) || IS.number(sample)) {
    computed = skipComputed ? 0 : this.style(property);
    result = computed || this.el.style[property] || this.currentStateStyle(property) || '';
    if (typeof result === 'function') {
      return result.call(this, this.related);
    } else {
      return result;
    }
  }
  return this;
};

QuickElement.prototype.styleParsed = function(property, skipComputed) {
  return parseFloat(this.styleSafe(property, skipComputed));
};

QuickElement.prototype.recalcStyle = function(recalcChildren) {
  var child, j, len, ref, targetStyles;
  targetStyles = this._resolveFnStyles(this._getActiveStates(), true);
  this.style(targetStyles);
  if (recalcChildren) {
    ref = this._children;
    for (j = 0, len = ref.length; j < len; j++) {
      child = ref[j];
      child.recalcStyle();
    }
  }
  return this;
};

QuickElement.prototype.currentStateStyle = function(property) {
  var i, state, states;
  if (property) {
    if (this._state.length) {
      states = this._state.slice();
      if (this._stateShared && this._stateShared.length) {
        states.push.apply(states, this._stateShared);
      }
      i = states.length;
      while (state = states[--i]) {
        if (this._styles[state] && IS.defined(this._styles[state].rule[property])) {
          return this._styles[state].rule[property];
        }
      }
    }
    if (this._styles.base) {
      return this._styles.base.rule[property];
    }
  }
};

QuickElement.prototype.hide = function() {
  return this.style('display', 'none');
};

QuickElement.prototype.show = function(display) {
  var ref;
  if (!display) {
    display = this.currentStateStyle('display');
    if (display === 'none' || !display) {
      display = 'block';
    }
  }
  if (display == null) {
    display = ((ref = this._styles.base) != null ? ref.display : void 0) || 'block';
  }
  return this.style('display', display);
};

Object.defineProperties(QuickElement.prototype, {
  'orientation': orientationGetter = {
    get: function() {
      if (this.width > this.height) {
        return 'landscape';
      } else {
        return 'portrait';
      }
    }
  },
  'aspectRatio': aspectRatioGetter = {
    get: function() {
      return this.width / this.height;
    }
  },
  'rect': {
    get: function() {
      return this.el.getBoundingClientRect();
    }
  },
  'width': {
    get: function() {
      return parseFloat(this.style('width'));
    },
    set: function(value) {
      return this.style('width', value);
    }
  },
  'height': {
    get: function() {
      return parseFloat(this.style('height'));
    },
    set: function(value) {
      return this.style('height', value);
    }
  }
});

;

QuickElement.prototype.attr = function(attrName, newValue) {
  switch (newValue) {
    case void 0:
      return this.el.getAttribute(attrName);
    case null:
      return this.el.removeAttribute(attrName);
    default:
      this.el.setAttribute(attrName, newValue);
      return this;
  }
};

QuickElement.prototype.prop = function(propName, newValue) {
  switch (newValue) {
    case void 0:
      return this.el[propName];
    default:
      this.el[propName] = newValue;
      return this;
  }
};

;

QuickElement.prototype.toTemplate = function() {
  return QuickDom.template(this);
};

QuickElement.prototype.clone = function() {
  var activeState, callback, callbacks, child, elClone, eventName, i, j, k, len, len1, len2, newEl, options, ref, ref1, ref2;
  elClone = this.el.cloneNode(false);
  options = extend.clone(this.options, {
    existing: elClone
  });
  newEl = new QuickElement(this.type, options);
  ref = this._state;
  for (i = 0, len = ref.length; i < len; i++) {
    activeState = ref[i];
    newEl.state(activeState, true);
  }
  ref1 = this.children;
  for (j = 0, len1 = ref1.length; j < len1; j++) {
    child = ref1[j];
    newEl.append(child.clone());
  }
  ref2 = this._eventCallbacks;
  for (eventName in ref2) {
    callbacks = ref2[eventName];
    for (k = 0, len2 = callbacks.length; k < len2; k++) {
      callback = callbacks[k];
      newEl.on(eventName, callback);
    }
  }
  return newEl;
};

QuickElement.prototype.append = function(targetEl) {
  var prevParent;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      prevParent = targetEl.parent;
      if (prevParent) {
        prevParent._removeChild(targetEl);
      }
      this._children.push(targetEl);
      this.el.appendChild(targetEl.el);
      targetEl._refreshParent();
    }
  }
  return this;
};

QuickElement.prototype.appendTo = function(targetEl) {
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      targetEl.append(this);
    }
  }
  return this;
};

QuickElement.prototype.prepend = function(targetEl) {
  var prevParent;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      prevParent = targetEl.parent;
      if (prevParent) {
        prevParent._removeChild(targetEl);
      }
      this._children.unshift(targetEl);
      this.el.insertBefore(targetEl.el, this.el.firstChild);
      targetEl._refreshParent();
    }
  }
  return this;
};

QuickElement.prototype.prependTo = function(targetEl) {
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      targetEl.prepend(this);
    }
  }
  return this;
};

QuickElement.prototype.after = function(targetEl) {
  var myIndex;
  if (targetEl && this.parent) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      myIndex = this.parent._children.indexOf(this);
      this.parent._children.splice(myIndex + 1, 0, targetEl);
      this.el.parentNode.insertBefore(targetEl.el, this.el.nextSibling);
      targetEl._refreshParent();
    }
  }
  return this;
};

QuickElement.prototype.insertAfter = function(targetEl) {
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      targetEl.after(this);
    }
  }
  return this;
};

QuickElement.prototype.before = function(targetEl) {
  var myIndex;
  if (targetEl && this.parent) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      myIndex = this.parent._children.indexOf(this);
      this.parent._children.splice(myIndex, 0, targetEl);
      this.el.parentNode.insertBefore(targetEl.el, this.el);
      targetEl._refreshParent();
    }
  }
  return this;
};

QuickElement.prototype.insertBefore = function(targetEl) {
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      targetEl.before(this);
    }
  }
  return this;
};

QuickElement.prototype.detach = function() {
  var ref;
  if ((ref = this.parent) != null) {
    ref._removeChild(this);
  }
  return this;
};

QuickElement.prototype.remove = function() {
  var eventName;
  this.detach();
  this.resetState();
  if (this._eventCallbacks) {
    for (eventName in this._eventCallbacks) {
      this._eventCallbacks[eventName].length = 0;
    }
  }
  return this;
};

QuickElement.prototype.empty = function() {
  var child, i, len, ref;
  ref = this.children.slice();
  for (i = 0, len = ref.length; i < len; i++) {
    child = ref[i];
    this._removeChild(child);
  }
  return this;
};

QuickElement.prototype.wrap = function(targetEl) {
  var currentParent;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    currentParent = this.parent;
    if (IS.quickDomEl(targetEl) && targetEl !== this && targetEl !== this.parent) {
      if (currentParent) {
        currentParent._removeChild(this, !targetEl.parent ? targetEl : void 0);
      }
      targetEl.append(this);
    }
  }
  return this;
};

QuickElement.prototype.unwrap = function() {
  var grandParent, parent, parentChildren, parentSibling;
  parent = this.parent;
  if (parent) {
    parentChildren = QuickDom.batch(parent.children);
    parentSibling = parent.next;
    grandParent = parent.parent;
    if (grandParent) {
      parent.detach();
      if (parentSibling) {
        parentChildren.insertBefore(parentSibling);
      } else {
        parentChildren.appendTo(grandParent);
      }
    }
  }
  return this;
};

QuickElement.prototype.replace = function(targetEl) {
  var ref;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl) && targetEl !== this) {
      targetEl.detach();
      if ((ref = this.parent) != null) {
        ref._removeChild(this, targetEl);
      }
      targetEl._refreshParent();
    }
  }
  return this;
};

QuickElement.prototype.hasClass = function(target) {
  return helpers.includes(this.classList, target);
};

QuickElement.prototype.addClass = function(target) {
  var classList, targetIndex;
  classList = this.classList;
  targetIndex = classList.indexOf(target);
  if (targetIndex === -1) {
    classList.push(target);
    this.className = classList.length > 1 ? classList.join(' ') : classList[0];
  }
  return this;
};

QuickElement.prototype.removeClass = function(target) {
  var classList, targetIndex;
  classList = this.classList;
  targetIndex = classList.indexOf(target);
  if (targetIndex !== -1) {
    classList.splice(targetIndex, 1);
    this.className = classList.length ? classList.join(' ') : '';
  }
  return this;
};

QuickElement.prototype.toggleClass = function(target) {
  if (this.hasClass(target)) {
    this.removeClass(target);
  } else {
    this.addClass(target);
  }
  return this;
};

QuickElement.prototype._refreshParent = function() {
  return this.parent;
};

QuickElement.prototype._removeChild = function(targetChild, replacementChild) {
  var indexOfChild;
  indexOfChild = this.children.indexOf(targetChild);
  if (indexOfChild !== -1) {
    if (replacementChild) {
      this.el.replaceChild(replacementChild.el, targetChild.el);
      this._children.splice(indexOfChild, 1, replacementChild);
    } else {
      this.el.removeChild(targetChild.el);
      this._children.splice(indexOfChild, 1);
    }
  }
  return this;
};

Object.defineProperties(QuickElement.prototype, {
  'html': {
    get: function() {
      return this.el.innerHTML;
    },
    set: function(newValue) {
      return this.el.innerHTML = newValue;
    }
  },
  'text': {
    get: function() {
      return this.el.textContent;
    },
    set: function(newValue) {
      return this.el.textContent = newValue;
    }
  },
  'className': {
    get: function() {
      if (this.svg) {
        return this.attr('class') || '';
      } else {
        return this.raw.className;
      }
    },
    set: function(newValue) {
      if (this.svg) {
        return this.attr('class', newValue);
      } else {
        return this.raw.className = newValue;
      }
    }
  },
  'classList': {
    get: function() {
      var list;
      list = this.className.split(/\s+/);
      if (list[list.length - 1] === '') {
        list.pop();
      }
      if (list[0] === '') {
        list.shift();
      }
      return list;
    }
  }
});

;

QuickElement.prototype.updateOptions = function(options) {
  if (IS.object(options)) {
    this.options = options;
    this._normalizeOptions();
    this._applyOptions(this.options);
  }
  return this;
};

QuickElement.prototype.updateStateStyles = function(styles) {
  var i, len, parsed, state, updatedStates;
  if (IS.objectPlain(styles)) {
    extend.deep.concat(this, parsed = this._parseStyles(styles));
    if (parsed._styles) {
      updatedStates = Object.keys(parsed._styles);
      for (i = 0, len = updatedStates.length; i < len; i++) {
        state = updatedStates[i];
        if (this.state(state) || state === 'base') {
          this._applyRegisteredStyle(this._styles[state], this._getActiveStates(state), false);
        }
      }
    }
  }
  return this;
};

QuickElement.prototype.updateStateTexts = function(texts) {
  var parsed;
  if (IS.objectPlain(texts)) {
    extend.deep.concat(this, parsed = this._parseTexts(texts));
  }
  return this;
};

QuickElement.prototype.applyData = function(data) {
  var child, computers, defaults, i, j, key, keys, len, len1, ref;
  if (computers = this.options.computers) {
    defaults = this.options.defaults;
    keys = Object.keys(computers);
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      if (data && data.hasOwnProperty(key)) {
        this._runComputer(key, data[key]);
      } else if (defaults && defaults.hasOwnProperty(key)) {
        this._runComputer(key, defaults[key]);
      }
    }
  }
  ref = this._children;
  for (j = 0, len1 = ref.length; j < len1; j++) {
    child = ref[j];
    child.applyData(data);
  }
};

QuickElement.prototype._runComputer = function(computer, arg) {
  return this.options.computers[computer].call(this, arg);
};

;

;

var QuickWindow;

QuickWindow = {
  type: 'window',
  el: window,
  raw: window,
  _eventCallbacks: {
    __refs: {}
  }
};

QuickWindow.on = QuickElement.prototype.on;

QuickWindow.off = QuickElement.prototype.off;

QuickWindow.emit = QuickElement.prototype.emit;

QuickWindow.emitPrivate = QuickElement.prototype.emitPrivate;

QuickWindow._listenTo = QuickElement.prototype._listenTo;

QuickWindow._invokeHandlers = QuickElement.prototype._invokeHandlers;

Object.defineProperties(QuickWindow, {
  'width': {
    get: function() {
      return window.innerWidth;
    }
  },
  'height': {
    get: function() {
      return window.innerHeight;
    }
  },
  'orientation': orientationGetter,
  'aspectRatio': aspectRatioGetter
});

;

var MediaQuery, ruleDelimiter;

MediaQuery = new function() {
  var callbacks, testRule;
  callbacks = [];
  window.addEventListener('resize', function() {
    var callback, i, len;
    for (i = 0, len = callbacks.length; i < len; i++) {
      callback = callbacks[i];
      callback();
    }
  });
  this.parseQuery = function(target, queryString) {
    var querySplit, rules, source;
    querySplit = queryString.split('(');
    source = querySplit[0];
    source = (function() {
      switch (source) {
        case 'window':
          return QuickWindow;
        case 'parent':
          return target.parent;
        case 'self':
          return target;
        default:
          return target.parentMatching(function(parent) {
            return parent.ref === source.slice(1);
          });
      }
    })();
    rules = querySplit[1].slice(0, -1).split(ruleDelimiter).map(function(rule) {
      var getter, key, keyPrefix, max, min, split, value;
      split = rule.split(':');
      value = parseFloat(split[1]);
      if (isNaN(value)) {
        value = split[1];
      }
      key = split[0];
      keyPrefix = key.slice(0, 4);
      max = keyPrefix === 'max-';
      min = !max && keyPrefix === 'min-';
      if (max || min) {
        key = key.slice(4);
      }
      getter = (function() {
        switch (key) {
          case 'orientation':
            return function() {
              return source.orientation;
            };
          case 'aspect-ratio':
            return function() {
              return source.aspectRatio;
            };
          case 'width':
          case 'height':
            return function() {
              return source[key];
            };
          default:
            return function() {
              var parsedValue, stringValue;
              stringValue = source.style(key);
              parsedValue = parseFloat(stringValue);
              if (isNaN(parsedValue)) {
                return stringValue;
              } else {
                return parsedValue;
              }
            };
        }
      })();
      return {
        key: key,
        value: value,
        min: min,
        max: max,
        getter: getter
      };
    });
    return {
      source: source,
      rules: rules
    };
  };
  this.register = function(target, queryString) {
    var callback, query;
    query = this.parseQuery(target, queryString);
    if (query.source) {
      callbacks.push(callback = function() {
        return testRule(target, query, queryString);
      });
      callback();
    }
    return query;
  };
  testRule = function(target, query, queryString) {
    var currentValue, i, len, passed, ref, rule;
    passed = true;
    ref = query.rules;
    for (i = 0, len = ref.length; i < len; i++) {
      rule = ref[i];
      currentValue = rule.getter();
      passed = (function() {
        switch (false) {
          case !rule.min:
            return currentValue >= rule.value;
          case !rule.max:
            return currentValue <= rule.value;
          default:
            return currentValue === rule.value;
        }
      })();
      if (!passed) {
        break;
      }
    }
    return target.state(queryString, passed);
  };
  return this;
};

ruleDelimiter = /,\s*/;

;

QuickDom = function() {
  var args, argsLength, child, children, element, i, j, len, options, type;
  args = arguments;
  switch (false) {
    case !IS.array(args[0]):
      return QuickDom.apply(null, args[0]);
    case !IS.template(args[0]):
      return args[0].spawn();
    case !IS.quickDomEl(args[0]):
      if (args[1]) {
        return args[0].updateOptions(args[1]);
      } else {
        return args[0];
      }
    case !(IS.domNode(args[0]) || IS.domDoc(args[0])):
      if (args[0]._quickElement) {
        return args[0]._quickElement;
      }
      type = args[0].nodeName.toLowerCase().replace('#', '');
      options = args[1] || {};
      options.existing = args[0];
      return new QuickElement(type, options);
    case args[0] !== window:
      return QuickWindow;
    case !IS.string(args[0]):
      type = args[0].toLowerCase();
      if (type === 'text') {
        options = IS.object(args[1]) ? args[1] : {
          text: args[1] || ''
        };
      } else {
        options = IS.object(args[1]) ? args[1] : {};
      }
      element = new QuickElement(type, options);
      if (args.length > 2) {
        children = [];
        i = 1;
        argsLength = args.length;
        while (++i < argsLength) {
          children.push(args[i]);
        }
        for (j = 0, len = children.length; j < len; j++) {
          child = children[j];
          if (IS.string(child)) {
            child = QuickDom.text(child);
          }
          if (IS.template(child)) {
            child = child.spawn(false);
          }
          if (IS.array(child)) {
            child = QuickDom.apply(null, child);
          }
          if (IS.quickDomEl(child)) {
            child.appendTo(element);
          }
        }
      }
      return element;
    case !(args[0] && (IS.domNode(args[0][0]) || IS.domDoc(args[0][0]))):
      return QuickDom(args[0][0]);
  }
};

QuickDom.template = function(tree) {
  return new QuickTemplate(tree, true);
};

QuickDom.html = function(innerHTML) {
  var children, container;
  container = document.createElement('div');
  container.innerHTML = innerHTML;
  children = Array.prototype.slice.call(container.childNodes);
  return QuickDom.batch(children);
};

QuickDom.query = function(target) {
  return QuickDom(document).query(target);
};

QuickDom.queryAll = function(target) {
  return QuickDom(document).queryAll(target);
};

QuickDom.isTemplate = function(target) {
  return IS.template(target);
};

QuickDom.isQuickEl = function(target) {
  return IS.quickDomEl(target);
};

QuickDom.isEl = function(target) {
  return IS.domEl(target);
};

var QuickBatch;

QuickBatch = (function() {
  function QuickBatch(elements, returnResults1) {
    this.returnResults = returnResults1;
    this.elements = elements.map(function(el) {
      return QuickDom(el);
    });
  }

  QuickBatch.prototype.reverse = function() {
    this.elements = this.elements.reverse();
    return this;
  };

  QuickBatch.prototype["return"] = function(returnNext) {
    if (returnNext) {
      this.returnResults = true;
      return this;
    } else {
      return this.lastResults;
    }
  };

  return QuickBatch;

})();


/* istanbul ignore next */

if (QuickBatch.name == null) {
  QuickBatch.name = 'QuickBatch';
}

Object.keys(QuickElement.prototype).concat('css', 'replaceWith', 'html', 'text').forEach(function(method) {
  return QuickBatch.prototype[method] = function(newValue) {
    var element, results;
    results = this.lastResults = (function() {
      var i, len, ref, results1;
      ref = this.elements;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        element = ref[i];
        if (method === 'html' || method === 'text') {
          if (newValue) {
            results1.push(element[method] = newValue);
          } else {
            results1.push(element[method]);
          }
        } else {
          results1.push(element[method].apply(element, arguments));
        }
      }
      return results1;
    }).apply(this, arguments);
    if (this.returnResults) {
      return results;
    } else {
      return this;
    }
  };
});

QuickDom.batch = function(elements, returnResults) {
  if (!IS.iterable(elements)) {
    throw new Error("Batch: expected an iterable, got " + (String(elements)));
  } else if (!elements.length) {
    throw new Error("Batch: expected a non-empty element collection");
  }
  return new QuickBatch(elements, returnResults);
};

;

var QuickTemplate,
  slice = [].slice;

var extendByRef, extendTemplate;

extendTemplate = function(currentOpts, newOpts, globalOpts) {
  var currentChild, currentChildren, globalOptsTransform, index, maxLength, needsTemplateWrap, newChild, newChildProcessed, newChildren, noChanges, output, ref, remainingNewChildren;
  if (globalOpts) {
    globalOptsTransform = {
      options: function(opts) {
        return extend(opts, globalOpts);
      }
    };
  }
  if (IS.array(newOpts)) {
    newOpts = parseTree(newOpts, false);
  } else if (newOpts && !matchesSchema(newOpts)) {
    newOpts = {
      options: newOpts
    };
  }
  output = extend.deep.nullDeletes.notKeys('children').notDeep(['relatedInstance', 'data']).transform(globalOptsTransform).clone(currentOpts, newOpts);
  currentChildren = currentOpts.children;
  newChildren = (newOpts != null ? newOpts.children : void 0) || [];
  output.children = [];

  /* istanbul ignore next */
  if (IS.array(newChildren)) {
    maxLength = Math.max(currentChildren.length, newChildren.length);
    index = -1;
    while (++index !== maxLength) {
      needsTemplateWrap = noChanges = false;
      currentChild = currentChildren[index];
      newChild = newChildren[index];
      newChildProcessed = (function() {
        switch (false) {
          case !IS.template(newChild):
            return newChild;
          case !IS.array(newChild):
            return needsTemplateWrap = parseTree(newChild);
          case !IS.string(newChild):
            return needsTemplateWrap = {
              type: 'text',
              options: {
                text: newChild
              }
            };
          case !(!newChild && !globalOpts):
            return noChanges = true;
          default:
            return needsTemplateWrap = newChild || true;
        }
      })();
      if (noChanges) {
        newChildProcessed = currentChild;
      } else if (needsTemplateWrap) {
        newChildProcessed = currentChild ? currentChild.extend(newChildProcessed, globalOpts) : new QuickTemplate(extend.clone(schema, newChildProcessed));
      }
      output.children.push(newChildProcessed);
    }
  } else if (IS.object(newChildren)) {
    newChildren = extend.allowNull.clone(newChildren);
    output.children = extendByRef(newChildren, currentChildren, globalOpts);
    remainingNewChildren = newChildren;
    for (ref in remainingNewChildren) {
      newChild = remainingNewChildren[ref];
      newChildProcessed = IS.objectPlain(newChild) && !IS.template(newChild) ? newChild : parseTree(newChild);
      output.children.push(new QuickTemplate(newChildProcessed));
      delete remainingNewChildren[ref];
    }
  }
  return output;
};

extendByRef = function(newChildrenRefs, currentChildren, globalOpts) {
  var currentChild, i, len, newChild, newChildProcessed, output;
  if (!currentChildren.length) {
    return currentChildren;
  } else {
    output = [];
    for (i = 0, len = currentChildren.length; i < len; i++) {
      currentChild = currentChildren[i];
      newChild = newChildrenRefs[currentChild.ref];
      if (newChild) {
        newChildProcessed = currentChild.extend(newChild, globalOpts);
        delete newChildrenRefs[currentChild.ref];
      } else if (newChild === null) {
        delete newChildrenRefs[currentChild.ref];
        continue;
      } else {
        newChildProcessed = (function() {
          switch (false) {
            case !globalOpts:
              return currentChild.extend(null, globalOpts);
            case !Object.keys(newChildrenRefs).length:
              return currentChild.extend();
            default:
              return currentChild;
          }
        })();
      }
      newChildProcessed.children = extendByRef(newChildrenRefs, newChildProcessed.children);
      output.push(newChildProcessed);
    }
    return output;
  }
};

;

var parseErrorPrefix, parseTree;

parseTree = function(tree, parseChildren) {
  var output;
  switch (false) {
    case !IS.array(tree):
      output = {};
      if (!IS.string(tree[0])) {
        throw new Error(parseErrorPrefix + " string for 'type', got '" + (String(tree[0])) + "'");
      } else {
        output.type = tree[0];
      }
      if (tree.length > 1 && !IS.object(tree[1]) && tree[1] !== null) {
        throw new Error(parseErrorPrefix + " object for 'options', got '" + (String(tree[1])) + "'");
      } else {
        output.options = tree[1] ? extend.deep.clone(tree[1]) : schema.options;
        if (tree[1]) {
          output.ref = tree[1].id || tree[1].ref;
        }
      }
      output.children = tree.slice(2);
      if (parseChildren === false) {
        if (tree.length === 3 && IS.objectPlain(tree[2]) && !IS.template(tree[2])) {
          output.children = tree[2];
        }
      } else {
        output.children = output.children.map(QuickDom.template);
      }
      return output;
    case !(IS.string(tree) || IS.domText(tree)):
      return {
        type: 'text',
        options: {
          text: tree.textContent || tree
        },
        children: schema.children
      };
    case !IS.domEl(tree):
      return {
        type: tree.nodeName.toLowerCase(),
        ref: tree.id,
        options: extend.clone.keys(allowedTemplateOptions)(tree),
        children: schema.children.map.call(tree.childNodes, QuickDom.template)
      };
    case !IS.quickDomEl(tree):
      return {
        type: tree.type,
        ref: tree.ref,
        options: extend.clone.deep.notKeys('relatedInstance')(tree.options),
        children: tree.children.map(QuickDom.template)
      };
    case !IS.template(tree):
      return tree;
    default:
      throw new Error(parseErrorPrefix + " (array || string || domEl || quickDomEl || template), got " + (String(tree)));
  }
};

parseErrorPrefix = 'Template Parse Error: expected';

;

var matchesSchema, schema;

schema = {
  type: 'div',
  ref: void 0,
  options: {},
  children: []
};

matchesSchema = function(object) {
  return typeof object.type !== 'undefined' || typeof object.ref !== 'undefined' || typeof object.options !== 'undefined' || typeof object.children !== 'undefined';
};

;

QuickTemplate = (function() {
  function QuickTemplate(config, isTree) {
    var child, i, len, ref;
    if (IS.template(config)) {
      return config;
    }
    config = isTree ? parseTree(config) : config;
    extend(this, config);
    this._hasComputers = !!this.options.computers;
    if (!this._hasComputers && this.children.length) {
      ref = this.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        if (!(child._hasComputers || child.options.computers)) {
          continue;
        }
        this._hasComputers = true;
        break;
      }
    }
  }

  QuickTemplate.prototype.extend = function(newValues, globalOpts) {
    return new QuickTemplate(extendTemplate(this, newValues, globalOpts));
  };

  QuickTemplate.prototype.spawn = function(newValues, globalOpts) {
    var data, element, opts, ref;
    if (newValues && newValues.data) {
      data = newValues.data;
      if (Object.keys(newValues).length === 1) {
        newValues = null;
      }
    }
    if (newValues || globalOpts) {
      opts = extendTemplate(this, newValues, globalOpts);
    } else {
      opts = extend.clone(this);
      opts.options = extend.clone(opts.options);
    }
    element = QuickDom.apply(null, [opts.type, opts.options].concat(slice.call(opts.children)));
    if (this._hasComputers) {
      if (newValues !== false) {
        element.applyData(data);
      }
      if ((ref = element.options.computers) != null ? ref._init : void 0) {
        element._runComputer('_init', data);
      }
    }
    return element;
  };

  return QuickTemplate;

})();


/* istanbul ignore next */

if (QuickTemplate.name == null) {
  QuickTemplate.name = 'QuickTemplate';
}

Object.defineProperty(QuickTemplate.prototype, 'child', {
  get: function() {
    return this._childRefs || _getChildRefs(this);
  }
});

;

var fn, i, len, shortcut, shortcuts,
  slice = [].slice;

shortcuts = ['link:a', 'anchor:a', 'a', 'text', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'section', 'button', 'br', 'ul', 'ol', 'li', 'fieldset', 'input', 'textarea', 'select', 'option', 'form', 'frame', 'hr', 'iframe', 'img', 'picture', 'main', 'nav', 'meta', 'object', 'pre', 'style', 'table', 'tbody', 'th', 'tr', 'td', 'tfoot', 'video'];

fn = function(shortcut) {
  var prop, split, type;
  prop = type = shortcut;
  if (helpers.includes(shortcut, ':')) {
    split = shortcut.split(':');
    prop = split[0];
    type = split[1];
  }
  return QuickDom[prop] = function() {
    return QuickDom.apply(null, [type].concat(slice.call(arguments)));
  };
};
for (i = 0, len = shortcuts.length; i < len; i++) {
  shortcut = shortcuts[i];
  fn(shortcut);
}

;

QuickDom.version = "1.0.81";

QuickDom.CSS = CSS;

module.exports = QuickDom;

;
return module.exports;
},
3: function (require, module, exports) {
var IS;

IS = require(24);

IS = IS.create('natives', 'dom');

IS.load({
  field: function(target) {
    return target && target instanceof require(9);
  },
  regex: function(target) {
    return target instanceof RegExp;
  },
  objectable: function(target) {
    return IS.object(target) || IS["function"](target);
  }
});

module.exports = IS;

;
return module.exports;
},
4: function (require, module, exports) {
var exports, extend, modifiers, newBuilder, normalizeKeys;

extend = require(25);

normalizeKeys = function(keys) {
  var i, key, len, output;
  if (keys) {
    output = {};
    if (typeof keys !== 'object') {
      output[keys] = true;
    } else {
      if (!Array.isArray(keys)) {
        keys = Object.keys(keys);
      }
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        output[key] = true;
      }
    }
    return output;
  }
};

newBuilder = function(isBase) {
  var builder;
  builder = function(target) {
    var theTarget;
    var $_len = arguments.length, $_i = -1, sources = new Array($_len); while (++$_i < $_len) sources[$_i] = arguments[$_i];
    if (builder.options.target) {
      theTarget = builder.options.target;
    } else {
      theTarget = target;
      sources.shift();
    }
    return extend(builder.options, theTarget, sources);
  };
  if (isBase) {
    builder.isBase = true;
  }
  builder.options = {};
  Object.defineProperties(builder, modifiers);
  return builder;
};

modifiers = {
  'deep': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      _.options.deep = true;
      return _;
    }
  },
  'own': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      _.options.own = true;
      return _;
    }
  },
  'allowNull': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      _.options.allowNull = true;
      return _;
    }
  },
  'nullDeletes': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      _.options.nullDeletes = true;
      return _;
    }
  },
  'concat': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      _.options.concat = true;
      return _;
    }
  },
  'clone': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      _.options.target = {};
      return _;
    }
  },
  'notDeep': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      return function(keys) {
        _.options.notDeep = normalizeKeys(keys);
        return _;
      };
    }
  },
  'deepOnly': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      return function(keys) {
        _.options.deepOnly = normalizeKeys(keys);
        return _;
      };
    }
  },
  'keys': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      return function(keys) {
        _.options.keys = normalizeKeys(keys);
        return _;
      };
    }
  },
  'notKeys': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      return function(keys) {
        _.options.notKeys = normalizeKeys(keys);
        return _;
      };
    }
  },
  'transform': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      return function(transform) {
        if (typeof transform === 'function') {
          _.options.globalTransform = transform;
        } else if (transform && typeof transform === 'object') {
          _.options.transforms = transform;
        }
        return _;
      };
    }
  },
  'filter': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      return function(filter) {
        if (typeof filter === 'function') {
          _.options.globalFilter = filter;
        } else if (filter && typeof filter === 'object') {
          _.options.filters = filter;
        }
        return _;
      };
    }
  }
};

module.exports = exports = newBuilder(true);

exports.version = "1.7.3";

;
return module.exports;
},
5: function (require, module, exports) {
var CSS;

CSS = require(27);

module.exports = function() {
  CSS.animation('checkmarkAnimateSuccessTip', {
    '0%, 54%': {
      width: 0,
      left: 0,
      top: 3
    },
    '70%': {
      width: 14,
      left: -2,
      top: 8
    },
    '84%': {
      width: 5,
      left: 5,
      top: 10
    },
    '100%': {
      width: 8,
      left: 3,
      top: 10
    }
  });
  CSS.animation('checkmarkAnimateSuccessLong', {
    '0%, 65%': {
      width: 0,
      right: 12,
      top: 12
    },
    '84%': {
      width: 14,
      right: 0,
      top: 7
    },
    '100%': {
      width: 12,
      right: 2,
      top: 8
    }
  });
  CSS.animation('checkmarkAnimateError', {
    '0%, 65%': {
      transform: 'scale(0.4)',
      opacity: 0
    },
    '84%': {
      transform: 'scale(1.15)'
    },
    '100%': {
      transform: 'scale(1)'
    }
  });
  CSS.animation('checkmarkRotatePlaceholder', {
    '0%, 5%': {
      transform: 'rotate(-45deg)'
    },
    '12%, 100%': {
      transform: 'rotate(-405deg)'
    }
  });
  CSS.animation('fieldErrorShake', {
    '0%, 50%': {
      transform: 'translateX(-10px)'
    },
    '25%, 75%': {
      transform: 'translateX(10px)'
    },
    '100%': {
      transform: 'translateX(0px)'
    }
  });
  return module.exports = function() {};
};

;
return module.exports;
},
6: function (require, module, exports) {
module.exports = ['_getValue', '_setValue', '_validate'];

;
return module.exports;
},
9: function (require, module, exports) {
var Condition, Field, IS, SimplyBind, currentID, extend, fastdom, helpers;

helpers = require(1);

IS = require(3);

extend = require(4);

fastdom = require(28);

SimplyBind = require(11);

Condition = require(29);

currentID = 0;

Field = (function() {
  Field.instances = Object.create(null);

  Field.shallowSettings = ['templates', 'fieldInstances', 'value', 'defaultValue'];

  Field.transformSettings = ({
  'conditions': function(conditions) {
    var results, target, value;
    if (IS.objectPlain(conditions)) {
      results = [];
      for (target in conditions) {
        value = conditions[target];
        results.push({
          target: target,
          value: value
        });
      }
      return results;
    } else if (IS.array(conditions)) {
      return conditions.map(function(item) {
        if (IS.string(item)) {
          return {
            target: item
          };
        } else {
          return item;
        }
      });
    }
  },
  'choices': function(choices) {
    var label, results, value;
    if (IS.objectPlain(choices)) {
      results = [];
      for (label in choices) {
        value = choices[label];
        results.push({
          label: label,
          value: value
        });
      }
      return results;
    } else if (IS.array(choices)) {
      return choices.map(function(item) {
        if (!IS.objectPlain(item)) {
          return {
            label: item,
            value: item
          };
        } else {
          return item;
        }
      });
    }
  },
  'validWhenRegex': function(regex) {
    if (IS.string(regex)) {
      return new RegExp(regex);
    } else {
      return regex;
    }
  }
});

;

  Field.prototype.coreValueProp = '_value';

  Field.prototype.globalDefaults = require(31);

  Object.defineProperties(Field.prototype, {
    'removeListener': {
      get: function() {
        return this.off;
      }
    },
    'els': {
      get: function() {
        return this.el.child;
      }
    },
    'valueRaw': {
      get: function() {
        return this._value;
      }
    },
    'value': {
      get: function() {
        if (this.settings.getter) {
          return this.settings.getter(this._getValue());
        } else {
          return this._getValue();
        }
      },
      set: function(value) {
        return this._setValue(this.settings.setter ? this.settings.setter(value) : value);
      }
    }
  });

  function Field(settings, builder, settingOverrides, templateOverrides) {
    var ref, shallowSettings, transformSettings;
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
      this.template = templateOverrides[settings.type]["default"];
    }
    shallowSettings = this.shallowSettings ? Field.shallowSettings.concat(this.shallowSettings) : Field.shallowSettings;
    transformSettings = this.transformSettings ? Field.transformSettings.concat(this.transformSettings) : Field.transformSettings;
    this.settings = extend.deep.clone.notDeep(shallowSettings).transform(transformSettings)(this.globalDefaults, this.defaults, settings);
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
      this.state.width = (this.settings.width * 100) + "%";
    }
    if ((ref = this.settings.conditions) != null ? ref.length : void 0) {
      this.state.visible = false;
      Condition.init(this, this.settings.conditions);
    }
    if (this.allFields[this.ID]) {
      if (typeof console !== "undefined" && console !== null) {
        console.warn("Duplicate field IDs found: '" + this.ID + "'");
      }
    }
    this.allFields[this.ID] = this;
  }

  Field.prototype._constructorEnd = function() {
    var base;
    this.el.childf;
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
    }).of(this.state).to('help').of(this.state).transform((function(_this) {
      return function(show) {
        if (show && _this.state.error && IS.string(_this.state.error)) {
          return _this.state.error;
        } else {
          return _this.settings.help || _this.state.help;
        }
      };
    })(this));
    SimplyBind('error', {
      updateOnBind: false
    }).of(this.state).to('help').of(this.state).condition((function(_this) {
      return function(error) {
        return error && _this.state.showError;
      };
    })(this));
    SimplyBind('help').of(this.state).to('html').of(this.el.child.help).and.to('showHelp').of(this.state);
    SimplyBind('label').of(this.state).to('text').of(this.el.child.label).and.to('showLabel').of(this.state);
    SimplyBind('margin').of(this.state).to(this.el.style.bind(this.el, 'margin'));
    SimplyBind('padding').of(this.state).to(this.el.style.bind(this.el, 'padding'));
    SimplyBind('showHelp').of(this.state).to((function(_this) {
      return function(show, prevShow) {
        var changeAmount;
        changeAmount = !!show === !!prevShow ? 0 : show ? 20 : prevShow ? -20 : void 0;
        if (changeAmount) {
          return _this.state.margin = helpers.updateShorthandValue(_this.state.margin, 'bottom', changeAmount);
        }
      };
    })(this));
    SimplyBind('focused', {
      updateOnBind: false
    }).of(this.state).to((function(_this) {
      return function(focused) {
        return _this.emit(focused ? 'focus' : 'blur');
      };
    })(this));
    if (this.settings.mobileWidth) {
      SimplyBind((function(_this) {
        return function() {
          return fastdom.measure(function() {
            return _this.state.isMobile = window.innerWidth <= _this.settings.mobileThreshold;
          });
        };
      })(this)).updateOn('event:resize').of(window);
    }
    return this.el.raw._quickField = this;
  };

  Field.prototype._formatWidth = function(width) {
    width = this.state.isMobile ? this.settings.mobileWidth || width : width;
    if (this.settings.distance) {
      width = "calc(" + width + " - " + this.settings.distance + "px)";
    }
    return width;
  };

  Field.prototype.appendTo = function(target) {
    this.el.appendTo(target);
    return this;
  };

  Field.prototype.prependTo = function(target) {
    this.el.prependTo(target);
    return this;
  };

  Field.prototype.insertAfter = function(target) {
    this.el.insertAfter(target);
    return this;
  };

  Field.prototype.insertBefore = function(target) {
    this.el.insertBefore(target);
    return this;
  };

  Field.prototype.detach = function(target) {
    this.el.detach(target);
    return this;
  };

  Field.prototype.remove = function() {
    this.el.remove();
    return this.destroy(false);
  };

  Field.prototype.destroy = function(removeFromDOM) {
    var child, i, len, ref;
    if (removeFromDOM == null) {
      removeFromDOM = true;
    }
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
  };

  Field.prototype.on = function(eventNames, callback, useCapture) {
    this.el.on.call(this.el, eventNames, callback, useCapture, true);
    return this;
  };

  Field.prototype.once = function(eventNames, callback, useCapture) {
    return this.on(eventNames, (function(_this) {
      return function() {
        _this.off(eventNames, callback);
        return callback.apply(_this.el, arguments);
      };
    })(this), useCapture);
  };

  Field.prototype.off = function() {
    this.el.off.apply(this.el, arguments);
    return this;
  };

  Field.prototype.emit = function() {
    this.el.emitPrivate.apply(this.el, arguments);
    return this;
  };

  Field.prototype.validate = function(providedValue, testUnrequired) {
    var isValid;
    if (providedValue == null) {
      providedValue = this[this.coreValueProp];
    }
    isValid = (function() {
      switch (false) {
        case !this.settings.validator:
          return this.settings.validator(providedValue);
        case !(!this.settings.required && !testUnrequired):
          return true;
        case this._validate(providedValue, testUnrequired) !== false:
          return false;
        case !this.settings.required:
          if (this.settings.multiple) {
            return !!(providedValue != null ? providedValue.length : void 0);
          } else {
            return !!providedValue;
          }
          break;
        default:
          return true;
      }
    }).call(this);
    if (isValid && this.settings.clearErrorOnValid) {
      this.state.showError = false;
    }
    return isValid;
  };

  Field.prototype.validateConditions = function(conditions) {
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
  };

  Field.prototype.validateAndReport = function(providedValue) {
    var isValid;
    isValid = this.validate(null, true);
    this.state.showError = isValid;
    return isValid;
  };

  return Field;

})();

module.exports = Field;

;
return module.exports;
},
10: function (require, module, exports) {
var DOM, Dropdown, IS, KEYCODES, Mask, REGEX, SimplyBind, TextField, extend, helpers,
  extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Dropdown = require(32);

Mask = require(33);

REGEX = require(12);

KEYCODES = require(34);

helpers = require(1);

IS = require(3);

DOM = require(2);

extend = require(4);

SimplyBind = require(11);

var templates = require(35), template = templates.default;;

var defaults = require(36);

TextField = (function(superClass) {
  extend1(TextField, superClass);

  TextField.prototype.template = template;

  TextField.prototype.templates = templates;

  TextField.prototype.defaults = defaults;

  function TextField() {
    TextField.__super__.constructor.apply(this, arguments);
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
        this.settings.mask.pattern = (function() {
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
        }).call(this);
      }
    }
    if (this.settings.mask.pattern) {
      this.mask = new Mask(this, this.settings.mask);
    }
    this._createElements();
    this._attachBindings();
    this._constructorEnd();
  }

  TextField.prototype._getValue = function() {
    if (this.dropdown && this.selected && this._value === this.selected.label) {
      return this.selected.value;
    } else {
      return this._value;
    }
  };

  TextField.prototype._setValue = function(newValue) {
    if (IS.string(newValue) || IS.number(newValue)) {
      newValue = String(newValue);
      return this._value = this.mask ? this.mask.setValue(newValue) : newValue;
    }
  };

  TextField.prototype._recalcDisplay = function() {
    if (this.settings.autoWidth) {
      return this._value = this._value;
    }
  };

  TextField.prototype._createElements = function() {
    var globalOpts;
    globalOpts = {
      relatedInstance: this
    };
    this.el = this.template.spawn(this.settings.templates["default"], globalOpts);
    if (this.settings.choices) {
      this.dropdown = new Dropdown(this.settings.choices, this);
      this.dropdown.appendTo(this.el.child.innerwrap);
    }
    if (this.settings.icon) {
      templates.icon.spawn(this.settings.templates.icon, globalOpts).append(this.settings.icon).insertBefore(this.el.child.input);
    }
    if (this.settings.checkmark) {
      templates.checkmark.spawn(this.settings.templates.checkmark, globalOpts).insertAfter(this.el.child.input);
    }
    this.el.child.input.prop('type', (function() {
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
          return 'text';
      }
    }).call(this));
    this.el.state('hasLabel', this.settings.label);
    this.el.child.innerwrap.raw._quickField = this.el.child.input.raw._quickField = this;
    return this.el.childf;
  };

  TextField.prototype._attachBindings = function() {
    this._attachBindings_elState();
    this._attachBindings_display();
    this._attachBindings_display_autoWidth();
    this._attachBindings_value();
    this._attachBindings_autocomplete();
    this._attachBindings_stateTriggers();
  };

  TextField.prototype._attachBindings_elState = function() {
    SimplyBind('visible').of(this.state).to((function(_this) {
      return function(visible) {
        return _this.el.state('visible', visible);
      };
    })(this));
    SimplyBind('hovered').of(this.state).to((function(_this) {
      return function(hovered) {
        return _this.el.state('hover', hovered);
      };
    })(this));
    SimplyBind('focused').of(this.state).to((function(_this) {
      return function(focused) {
        return _this.el.state('focus', focused);
      };
    })(this));
    SimplyBind('filled').of(this.state).to((function(_this) {
      return function(filled) {
        return _this.el.state('filled', filled);
      };
    })(this));
    SimplyBind('disabled').of(this.state).to((function(_this) {
      return function(disabled) {
        return _this.el.state('disabled', disabled);
      };
    })(this));
    SimplyBind('showLabel').of(this.state).to((function(_this) {
      return function(showLabel) {
        return _this.el.state('showLabel', showLabel);
      };
    })(this));
    SimplyBind('showError').of(this.state).to((function(_this) {
      return function(showError) {
        return _this.el.state('showError', showError);
      };
    })(this));
    SimplyBind('showHelp').of(this.state).to((function(_this) {
      return function(showHelp) {
        return _this.el.state('showHelp', showHelp);
      };
    })(this));
    SimplyBind('valid').of(this.state).to((function(_this) {
      return function(valid) {
        _this.el.state('valid', valid);
        return _this.el.state('invalid', !valid);
      };
    })(this));
  };

  TextField.prototype._attachBindings_display = function() {
    SimplyBind('placeholder').of(this.state).to('text').of(this.el.child.placeholder).transform((function(_this) {
      return function(placeholder) {
        switch (false) {
          case !(placeholder === true && _this.settings.label):
            return _this.settings.label;
          case !IS.string(placeholder):
            return placeholder;
          default:
            return '';
        }
      };
    })(this));
    SimplyBind('disabled', {
      updateOnBind: this.state.disabled
    }).of(this.state).to((function(_this) {
      return function(disabled, prev) {
        if (_this.settings.checkmark) {
          if (disabled || (!disabled && (prev != null))) {
            return setTimeout(function() {
              _this.el.child.checkmark_mask1.recalcStyle();
              _this.el.child.checkmark_mask2.recalcStyle();
              return _this.el.child.checkmark_patch.recalcStyle();
            });
          }
        }
      };
    })(this));
  };

  TextField.prototype._attachBindings_display_autoWidth = function() {
    SimplyBind('width', {
      updateEvenIfSame: true
    }).of(this.state).to((function(_this) {
      return function(width) {
        return (_this.settings.autoWidth ? _this.el.child.input : _this.el).style('width', width);
      };
    })(this)).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);
    if (this.settings.autoWidth) {
      SimplyBind('_value', {
        updateEvenIfSame: true,
        updateOnBind: false
      }).of(this).to('width').of(this.state).transform((function(_this) {
        return function() {
          return (_this._getInputAutoWidth()) + "px";
        };
      })(this)).updateOn('event:inserted').of(this.el).updateOn('visible').of(this.state);
    }
  };

  TextField.prototype._attachBindings_value = function() {
    var input, resetInput;
    input = this.el.child.input.raw;
    resetInput = (function(_this) {
      return function() {
        var filled;
        filled = !_this.mask.isEmpty();
        if (!filled) {
          _this.selection(_this.mask.cursor = 0);
          _this._value = '';
          _this.state.filled = false;
        }
        return filled;
      };
    })(this);
    SimplyBind('event:input').of(input).to((function(_this) {
      return function() {
        _this.value = input.value;
        if (_this.mask) {
          _this.selection(_this.mask.cursor);
        }
        return _this.emit('input', _this.value);
      };
    })(this));
    SimplyBind('_value', {
      updateEvenIfSame: !!this.mask
    }).of(this).to('value').of(input).and.to((function(_this) {
      return function(value) {
        var filled;
        filled = !!value;
        if (filled && _this.mask && _this.mask.guide && (!_this.state.focused || _this.mask.cursor === 0)) {
          filled = resetInput();
        }
        _this.state.filled = filled;
        if (filled) {
          _this.state.interacted = true;
        }
        _this.state.valid = _this.validate(null, true);
        if (!_this.state.focused) {
          return _this.emit('input', _this.value);
        }
      };
    })(this));
    SimplyBind('event:keydown').of(this.el.child.input).to((function(_this) {
      return function(event) {
        if (event.keyCode === KEYCODES.enter) {
          _this.emit('submit');
        }
        return _this.emit("key-" + event.keyCode);
      };
    })(this));
    if (this.mask && this.mask.guide) {
      SimplyBind('event:blur').of(this.el.child.input).to(resetInput);
    }
  };

  TextField.prototype._attachBindings_autocomplete = function() {
    if (this.dropdown) {
      SimplyBind.defaultOptions.updateOnBind = false;
      SimplyBind('typing', {
        updateEvenIfSame: true
      }).of(this.state).to((function(_this) {
        return function(isTyping) {
          if (isTyping) {
            if (!_this._value) {
              return;
            }
            if (_this.dropdown.isOpen) {
              return _this.dropdown.list.calcDisplay();
            } else {
              _this.dropdown.isOpen = true;
              return SimplyBind('event:click').of(document).once.to(function() {
                return _this.dropdown.isOpen = false;
              }).condition(function(event) {
                return !DOM(event.target).parentMatching(function(parent) {
                  return parent === _this.el.child.innerwrap;
                });
              });
            }
          } else {
            return _this.dropdown.isOpen = false;
          }
        };
      })(this));
      SimplyBind('_value').of(this).to((function(_this) {
        return function(value) {
          var choice, i, len, ref, shouldBeVisible;
          ref = _this.dropdown.choices;
          for (i = 0, len = ref.length; i < len; i++) {
            choice = ref[i];
            shouldBeVisible = !value ? true : helpers.fuzzyMatch(value, choice.label);
            if (choice.visible !== shouldBeVisible) {
              choice.visible = shouldBeVisible;
            }
          }
          if (_this.dropdown.isOpen && !value) {
            _this.dropdown.isOpen = false;
          }
        };
      })(this));
      this.dropdown.onSelected((function(_this) {
        return function(selectedChoice) {
          _this.selected = selectedChoice;
          _this.value = selectedChoice.label;
          _this.dropdown.isOpen = false;
          return _this.selection(_this.el.child.input.raw.value.length);
        };
      })(this));
      SimplyBind.defaultOptions.updateOnBind = true;
    }
  };

  TextField.prototype._attachBindings_stateTriggers = function() {
    SimplyBind('event:mouseenter').of(this.el.child.input).to((function(_this) {
      return function() {
        return _this.state.hovered = true;
      };
    })(this));
    SimplyBind('event:mouseleave').of(this.el.child.input).to((function(_this) {
      return function() {
        return _this.state.hovered = false;
      };
    })(this));
    SimplyBind('event:focus').of(this.el.child.input).to((function(_this) {
      return function() {
        _this.state.focused = true;
        if (_this.state.disabled) {
          return _this.blur();
        }
      };
    })(this));
    SimplyBind('event:blur').of(this.el.child.input).to((function(_this) {
      return function() {
        return _this.state.typing = _this.state.focused = false;
      };
    })(this));
    SimplyBind('event:input').of(this.el.child.input).to((function(_this) {
      return function() {
        return _this.state.typing = true;
      };
    })(this));
    SimplyBind('event:keydown').of(this.el.child.input).to((function(_this) {
      return function() {
        return _this.cursor.prev = _this.selection().end;
      };
    })(this));
  };

  TextField.prototype._scheduleCursorReset = function() {
    var currentCursor, diffIndex, newCursor;
    diffIndex = helpers.getIndexOfFirstDiff(this.mask.value, this.mask.prev.value);
    currentCursor = this.cursor.current;
    newCursor = this.mask.normalizeCursorPos(currentCursor, this.cursor.prev);
    if (newCursor !== currentCursor) {
      this.selection(newCursor);
    }
  };

  TextField.prototype._setValueIfNotSet = function() {
    if (this.el.child.input.raw.value !== this._value) {
      this.el.child.input.raw.value = this._value;
    }
  };

  TextField.prototype._getInputAutoWidth = function() {
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
  };

  TextField.prototype._getWidthSetting = function(target) {
    var parent, parentWidth, result;
    if (target === 'min' || target === 'max') {
      target += 'Width';
    }
    if (typeof this.settings[target] === 'number') {
      result = this.settings[target];
    } else if (typeof this.settings[target] === 'string') {
      result = parseFloat(this.settings[target]);
      if (helpers.includes(this.settings[target], '%')) {
        if ((parent = this.el.parent) && parent.style('display') === 'block') {
          parentWidth = parent.styleParsed('width') - parent.styleParsed('paddingLeft') - parent.styleParsed('paddingRight') - 2;
          result = parentWidth * (result / 100);
        } else {
          result = 0;
        }
      }
    }
    return result || (target === 'minWidth' ? 0 : 2e308);
  };

  TextField.prototype._validate = function(providedValue) {
    var matchingChoice, ref;
    if (this.settings.validWhenRegex && IS.regex(this.settings.validWhenRegex)) {
      if (!this.settings.validWhenRegex.test(providedValue)) {
        return false;
      }
    }
    if (this.settings.validWhenIsChoice && ((ref = this.settings.choices) != null ? ref.length : void 0)) {
      matchingChoice = this.settings.choices.filter(function(choice) {
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
  };

  TextField.prototype.selection = function(arg) {
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
  };

  TextField.prototype.focus = function() {
    return this.el.child.input.raw.focus();
  };

  TextField.prototype.blur = function() {
    return this.el.child.input.raw.blur();
  };

  return TextField;

})(require(9));

module.exports = TextField;

;
return module.exports;
},
11: function (require, module, exports) {
var arrayMutatorMethods, boundInstances, currentID, defaultOptions, dummyPropertyDescriptor, placeholder, settings;

currentID = 0;

arrayMutatorMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'];

dummyPropertyDescriptor = {};

boundInstances = {};

placeholder = ['{{', '}}'];

settings = Object.create({
  silent: false
}, {
  placeholder: {
    get: function() {
      return placeholder;
    },
    set: function(newPlaceholder) {
      if (checkIf.isArray(newPlaceholder) && newPlaceholder.length === 2) {
        placeholder = newPlaceholder;
        setPholderRegEx();
      }
    }
  }
});

defaultOptions = {
  delay: false,
  throttle: false,
  simpleSelector: false,
  promiseTransforms: false,
  dispatchEvents: false,
  sendArrayCopies: false,
  updateEvenIfSame: false,
  updateOnBind: true
};

var defineProperty, genID, genObj, genProxiedInterface, genSelfUpdater, getDescriptor, setValueNoop;

defineProperty = Object.defineProperty;

getDescriptor = Object.getOwnPropertyDescriptor;

var cachedEvent, changeEvent;

cachedEvent = null;

changeEvent = function() {
  var event;
  if (!cachedEvent) {
    event = cachedEvent = document.createEvent('Event');
    event.initEvent('change', true, false);
    event._sb = true;
  }
  return cachedEvent;
};

;

var requiresDomDescriptorFix;

requiresDomDescriptorFix = (!('className' in Element.prototype)) || !getDescriptor(Element.prototype, 'className').get;

;

var windowPropsToIgnore;

windowPropsToIgnore = ['innerWidth', 'innerHeight', 'outerWidth', 'outerHeight', 'scrollX', 'scrollY', 'pageXOffset', 'pageYOffset', 'screenX', 'screenY', 'screenLeft', 'screenTop'];

;

setValueNoop = function(v, publisher) {
  return this.updateAllSubs(publisher || this);
};

genID = function() {
  return '' + (++currentID);
};

genObj = function() {
  return Object.create(null);
};

genProxiedInterface = function(isSub, completeCallback) {
  return function(subject, customOptions, saveOptions) {
    return SimplyBind(subject, customOptions, saveOptions, isSub, completeCallback);
  };
};

genSelfUpdater = function(binding, fetchValue) {
  return binding.selfUpdater || (binding.selfUpdater = new Binding(function() {
    if (fetchValue) {
      return binding.setValue(binding.fetchDirectValue(), binding, true);
    } else {
      return binding.updateAllSubs(binding);
    }
  }, 'Func', {}));
};

var checkIf, targetIncludes;

targetIncludes = function(target, item) {
  return target && target.indexOf(item) !== -1;
};

checkIf = {
  isDefined: function(subject) {
    return subject !== void 0;
  },
  isArray: function(subject) {
    return subject instanceof Array;
  },
  isObject: function(subject) {
    return typeof subject === 'object' && subject;
  },
  isString: function(subject) {
    return typeof subject === 'string';
  },
  isNumber: function(subject) {
    return typeof subject === 'number';
  },
  isFunction: function(subject) {
    return typeof subject === 'function';
  },
  isBindingInterface: function(subject) {
    return subject instanceof BindingInterface;
  },
  isBinding: function(subject) {
    return subject instanceof Binding;
  },
  isIterable: function(subject) {
    return checkIf.isObject(subject) && checkIf.isNumber(subject.length);
  },
  isDom: function(subject) {
    return subject.nodeName && subject.nodeType === 1;
  },
  isDomInput: function(subject) {
    var nodeName;
    nodeName = subject.nodeName;
    return nodeName === 'INPUT' || nodeName === 'TEXTAREA' || nodeName === 'SELECT';
  },
  isDomRadio: function(subject) {
    return subject.type === 'radio';
  },
  isDomCheckbox: function(subject) {
    return subject.type === 'checkbox';
  },
  isElCollection: function(subject) {
    return (subject instanceof NodeList) || (subject instanceof HTMLCollection) || (window.jQuery && subject instanceof jQuery);
  },
  domElsAreSame: function(iterable) {
    var itemsWithSameType, type;
    type = iterable[0].type;
    itemsWithSameType = [].filter.call(iterable, function(item) {
      return item.type === type;
    });
    return itemsWithSameType.length === iterable.length;
  },
  isDomNode: function(subject) {
    return checkIf.isDom(subject) || subject === window || subject === document;
  }
};

;

var convertToLive, convertToReg, fetchDescriptor;

fetchDescriptor = function(object, property, isProto) {
  var descriptor, objectProto;
  descriptor = getDescriptor(object, property);
  if (descriptor) {
    if (isProto) {
      descriptor.configurable = true;
    }
    return descriptor;
  } else if (objectProto = Object.getPrototypeOf(object)) {
    return fetchDescriptor(objectProto, property, true);
  }
};

convertToLive = function(bindingInstance, object, onlyArrayMethods) {
  var _, context, getterValue, origFn, propertyDescriptor, proxyFn, shouldIndicateUpdateIsFromSelf, shouldWriteLiveProp, slice, typeIsArray;
  _ = bindingInstance;
  if (!_.origDescriptor) {
    _.origDescriptor = fetchDescriptor(object, _.property);
  }
  if (onlyArrayMethods) {
    arrayMutatorMethods.forEach(function(method) {
      return defineProperty(object, method, {
        configurable: true,
        value: function() {
          var result;
          result = Array.prototype[method].apply(object, arguments);
          _.updateAllSubs(_);
          return result;
        }
      });
    });
  } else {
    if (_.type === 'Proxy') {
      origFn = _.origFn = _.value;
      context = object;
      _.value = {
        result: null,
        args: null
      };
      if (checkIf.isFunction(origFn)) {
        slice = [].slice;
        getterValue = proxyFn = function() {
          var args, result;
          args = slice.call(arguments);
          _.value.args = args = _.selfTransform ? _.selfTransform(args) : args;
          _.value.result = result = origFn.apply(context, args);
          _.updateAllSubs(_);
          return result;
        };
        defineProperty(object, _.property, {
          configurable: _.isLiveProp = true,
          get: function() {
            return getterValue;
          },
          set: function(newValue) {
            if (!checkIf.isFunction(newValue)) {
              getterValue = newValue;
            } else if (newValue !== origFn) {
              if (newValue !== proxyFn) {
                origFn = _.origFn = newValue;
              }
              if (getterValue !== proxyFn) {
                getterValue = proxyFn;
              }
            }
          }
        });
      }
    } else if (!targetIncludes(_.type, 'DOM') && !(_.object === window && targetIncludes(windowPropsToIgnore, _.property))) {
      propertyDescriptor = _.origDescriptor || dummyPropertyDescriptor;
      if (propertyDescriptor.get) {
        _.origGetter = propertyDescriptor.get.bind(object);
      }
      if (propertyDescriptor.set) {
        _.origSetter = propertyDescriptor.set.bind(object);
      }
      shouldWriteLiveProp = propertyDescriptor.configurable;
      shouldWriteLiveProp = shouldWriteLiveProp && object.constructor !== CSSStyleDeclaration;
      
      /**
       * There is a bug in webkit/blink engines in which native attributes/properties 
       * of DOM elements are not exposed on the element's prototype and instead is
       * exposed directly on the element instance; when looking up the property descriptor
       * of the element a data descriptor is returned instead of an accessor descriptor
       * (i.e. descriptor with getter/setter) which means we are not able to define our
       * own proxy getter/setters. This was fixed only in April 2015 in Chrome v43 and
       * Safari v10. Although we won't be able to get notified when the objects get
       * their values set, we would at least provide working functionality lacking update
       * listeners. Since v1.14.0 HTMLInputElement::value bindings invoke the original
       * getter and setter methods in Binding::setValue(), and since we want to avoid
       * increasing the amount of logic present in Binding::setValue() for performance
       * reasons, we patch those setters here. We clone the target element and check for
       * the existence of the target property - if it exists then it indicates the target
       * property is a native property (since only native properties are copied over in
       * Element::cloneNode). This patching is only for native properties.
       *
       * https://bugs.webkit.org/show_bug.cgi?id=49739
       * https://bugs.webkit.org/show_bug.cgi?id=75297
       * https://bugs.chromium.org/p/chromium/issues/detail?id=43394
       * https://bugs.chromium.org/p/chromium/issues/detail?id=431492
       * https://bugs.chromium.org/p/chromium/issues/detail?id=13175
       * https://developers.google.com/web/updates/2015/04/DOM-attributes-now-on-the-prototype-chain
       */
      var shouldWriteLiveProp;
      
      if (requiresDomDescriptorFix && _.isDom && _.property in object.cloneNode(false)) {
        _.origDescriptor = shouldWriteLiveProp = false;
        _.isLiveProp = true;
        _.origGetter = function() {
          return _.object[_.property];
        };
        _.origSetter = function(newValue) {
          return _.object[_.property] = newValue;
        };
      }
      
      ;
      if (shouldWriteLiveProp) {
        typeIsArray = _.type === 'Array';
        shouldIndicateUpdateIsFromSelf = !_.origSetter && !typeIsArray;
        defineProperty(object, _.property, {
          configurable: _.isLiveProp = true,
          enumerable: propertyDescriptor.enumerable,
          get: _.origGetter || function() {
            return _.value;
          },
          set: function(newValue) {
            _.setValue(newValue, _, shouldIndicateUpdateIsFromSelf);
          }
        });
        if (typeIsArray) {
          convertToLive(_, object[_.property], true);
        }
      }
    }
  }
};

convertToReg = function(bindingInstance, object, onlyArrayMethods) {
  var _, i, len, method, newDescriptor, results;
  if (onlyArrayMethods) {
    results = [];
    for (i = 0, len = arrayMutatorMethods.length; i < len; i++) {
      method = arrayMutatorMethods[i];
      results.push(delete object[method]);
    }
    return results;
  } else {
    _ = bindingInstance;
    newDescriptor = _.origDescriptor;
    if (!(newDescriptor.set || newDescriptor.get)) {
      newDescriptor.value = _.origFn || _.value;
    }
    return defineProperty(object, _.property, newDescriptor);
  }
};

;

var cloneObject, extendState;

cloneObject = function(object) {
  var clone, key;
  clone = genObj();
  for (key in object) {
    clone[key] = object[key];
  }
  return clone;
};

extendState = function(base, stateToInherit) {
  var i, key, len, stateMapping;
  stateMapping = Object.keys(stateToInherit);
  for (i = 0, len = stateMapping.length; i < len; i++) {
    key = stateMapping[i];
    base[key] = stateToInherit[key];
  }
};

;

var cache;

cache = {
  get: function(object, isFunction, selector, isMultiChoice) {
    var sampleItem;
    if (isFunction) {
      return boundInstances[object._sb_ID];
    } else {
      if (isMultiChoice && object[0]._sb_map) {
        sampleItem = boundInstances[object[0]._sb_map[selector]];
        if (sampleItem.groupBinding) {
          return sampleItem.groupBinding;
        }
      }
      if (object._sb_map && object._sb_map[selector]) {
        return boundInstances[object._sb_map[selector]];
      }
    }
  },
  set: function(B, isFunction) {
    var propsMap, selector;
    if (isFunction) {
      defineProperty(B.object, '_sb_ID', {
        'configurable': true,
        'value': B.ID
      });
    } else {
      selector = B.selector;
      if (B.object._sb_map) {
        B.object._sb_map[selector] = B.ID;
      } else {
        propsMap = {};
        propsMap[selector] = B.ID;
        defineProperty(B.object, '_sb_map', {
          'configurable': true,
          'value': propsMap
        });
      }
    }
  }
};

;

var addToNodeStore, applyPlaceholders, escapeRegEx, pholderRegEx, pholderRegExSplit, scanTextNodesPlaceholders, setPholderRegEx, textContent;

escapeRegEx = /[.*+?^${}()|[\]\\]/g;

pholderRegEx = pholderRegExSplit = null;

setPholderRegEx = function() {
  var end, middle, start;
  start = settings.placeholder[0].replace(escapeRegEx, '\\$&');
  end = settings.placeholder[1].replace(escapeRegEx, '\\$&');
  middle = "[^" + end + "]+";
  pholderRegEx = new RegExp(start + "(" + middle + ")" + end, 'g');
  pholderRegExSplit = new RegExp("" + start + middle + end, 'g');
};

setPholderRegEx();

applyPlaceholders = function(contexts, values, indexMap) {
  var contextPart, i, index, len, output;
  output = '';
  for (index = i = 0, len = contexts.length; i < len; index = ++i) {
    contextPart = contexts[index];
    output += contextPart;
    if (indexMap[index]) {
      output += values[indexMap[index]];
    }
  }
  return output;
};

textContent = 'textContent';

addToNodeStore = function(nodeStore, node, targetPlaceholder) {
  if (nodeStore[targetPlaceholder] == null) {
    nodeStore[targetPlaceholder] = [];
  }
  nodeStore[targetPlaceholder].push(node);
};

scanTextNodesPlaceholders = function(element, nodeStore) {
  var childNodes, i, index, j, len, len1, newFragment, newNode, node, textPiece, textPieces;
  childNodes = Array.prototype.slice.call(element.childNodes);
  for (i = 0, len = childNodes.length; i < len; i++) {
    node = childNodes[i];
    if (node.nodeType !== 3) {
      scanTextNodesPlaceholders(node, nodeStore);
    } else if (node[textContent].match(pholderRegExSplit)) {
      textPieces = node[textContent].split(pholderRegEx);
      if (textPieces.length === 3 && textPieces[0] + textPieces[2] === '') {
        addToNodeStore(nodeStore, node, textPieces[1]);
      } else {
        newFragment = document.createDocumentFragment();
        for (index = j = 0, len1 = textPieces.length; j < len1; index = ++j) {
          textPiece = textPieces[index];
          newNode = newFragment.appendChild(document.createTextNode(textPiece));
          if (index % 2) {
            addToNodeStore(nodeStore, newNode, textPiece);
          }
        }
        node.parentNode.replaceChild(newFragment, node);
      }
    }
  }
};

;

var getErrSource, throwError, throwErrorBadArg, throwWarning;

throwError = function(errorName) {
  throw new Error('SimplyBind: ' + (errors[errorName] || errorName));
};

throwWarning = function(warningName, depth) {
  var errSource, warn;
  if (!settings.silent) {
    errSource = getErrSource(depth);
    warn = errors[warningName];
    warn += "\n\n" + errSource;
    console.warn('SimplyBind: ' + warn);
  }
};

throwErrorBadArg = function(arg) {
  throwError("Invalid argument/s (" + arg + ")", true);
};

getErrSource = function(depth) {
  return ((new Error).stack || '').split('\n').slice(depth + 3).join('\n');
};

;

;

var errors;

errors = {
  invalidParamName: "SimplyBind() and .to() only accept a function, an array, a bound object, a string, or a number.",
  fnOnly: "Only functions are allowed for .transform/.condition/All()",
  badEventArg: "Invalid argument number in .ofEvent()",
  emptyList: "Empty collection provided",
  onlyOneDOMElement: "You can only pass a single DOM element to a binding",
  mixedElList: "'checked' of Mixed list of element cannot be bound"
};

;

;

var SimplyBind;

SimplyBind = function(subject, options, saveOptions, isSub, completeCallback) {
  var interfaceToReturn, newInterface;
  if ((!subject && subject !== 0) || (!checkIf.isString(subject) && !checkIf.isNumber(subject) && !checkIf.isFunction(subject) && !(subject instanceof Array))) {
    if (!checkIf.isBindingInterface(subject)) {
      throwError('invalidParamName');
    }
  }
  if (checkIf.isObject(subject) && !(subject instanceof Array)) {
    interfaceToReturn = completeCallback ? completeCallback(subject) : subject.selfClone();
  } else {
    newInterface = new BindingInterface(options);
    newInterface.saveOptions = saveOptions;
    newInterface.isSub = isSub;
    newInterface.completeCallback = completeCallback;
    if (checkIf.isFunction(subject)) {
      interfaceToReturn = newInterface.setObject(subject, true);
    } else {
      interfaceToReturn = newInterface.setProperty(subject);
    }
  }
  return interfaceToReturn;
};

SimplyBind.version = "1.15.8";

SimplyBind.settings = settings;

SimplyBind.defaultOptions = defaultOptions;

SimplyBind.unBindAll = function(object, bothWays) {
  var boundID, prop, propMap;
  if (object && (checkIf.isObject(object) || checkIf.isFunction(object))) {
    
    /**
     * Conditional Checks:
     *
     * 1) Make sure the subject object is iterable (and thus a possible candidate for being an element collection)
     * 2) Make sure the subject object isn't an array binding (since element collection objects don't get directly bound)
     * 3) Make sure the first element in the collection is a valid object (i.e. isn't undefined and isn't null)
     * 4) Make sure the first element is a DOM object
     */
    var object;
    
    if (checkIf.isIterable(object) && !object._sb_ID && object[0] && (checkIf.isDom(object[0]))) {
      object = object[0];
    }
    
    ;
    propMap = object._sb_map;
    if (object._sb_ID) {
      boundInstances[object._sb_ID].removeAllSubs(bothWays);
    }
    if (propMap) {
      for (prop in propMap) {
        boundID = propMap[prop];
        boundInstances[boundID].removeAllSubs(bothWays);
      }
    }
  }
};

;

;

var Binding;

Binding = function(object, type, state) {
  var parentBinding, parentProperty, subjectValue;
  extendState(this, state);
  this.optionsDefault = this.saveOptions ? this.options : defaultOptions;
  this.type = type;
  this.object = object;
  this.ID = genID();
  this.subs = [];
  this.subsMeta = genObj();
  this.pubsMap = genObj();
  this.attachedEvents = [];
  if (this.type === 'Proxy') {
    this.setValue = setValueNoop;
  }

  /* ========================================================================== */
  if (this.isMultiChoice) {
    this.choices = genObj();
    this.object.forEach((function(_this) {
      return function(choiceEl) {
        var choiceBinding;
        choiceBinding = _this.choices[choiceEl.value] = SimplyBind('checked').of(choiceEl)._;
        choiceBinding.addSub(_this);
        choiceBinding.subsMeta[_this.ID].transformFn = function() {
          return choiceBinding;
        };
        choiceBinding.groupBinding = _this;
      };
    })(this));
  }
  if (!(this.type === 'Event' || (this.type === 'Func' && this.isSub))) {
    if (this.type === 'Pholder') {
      parentProperty = this.descriptor && !targetIncludes(this.descriptor, 'multi') ? this.descriptor + ":" + this.property : this.property;
      parentBinding = this.parentBinding = SimplyBind(parentProperty).of(object)._;
      parentBinding.scanForPholders();
      this.value = parentBinding.pholderValues[this.pholder];
      if (parentBinding.textNodes) {
        this.textNodes = parentBinding.textNodes[this.pholder];
      }
    } else {
      this.value = subjectValue = this.fetchDirectValue();
      if (this.type === 'ObjectProp' && !checkIf.isDefined(subjectValue) && !getDescriptor(this.object, this.property)) {
        this.object[this.property] = subjectValue;
      }
      convertToLive(this, this.object);
    }
  }
  this.attachEvents();
  return boundInstances[this.ID] = this;
};

var eventUpdateHandler;

Binding.prototype = {
  addSub: function(sub, options, updateOnce, updateEvenIfSame) {
    var alreadyHadSub, j, len, metaData, ref, subItem;
    if (sub.isMulti) {
      ref = sub.bindings;
      for (j = 0, len = ref.length; j < len; j++) {
        subItem = ref[j];
        this.addSub(subItem, options, updateOnce, updateEvenIfSame);
      }
    } else {
      if (metaData = this.subsMeta[sub.ID]) {
        alreadyHadSub = true;
      } else {
        sub.pubsMap[this.ID] = this;
        this.subs.unshift(sub);
        metaData = this.subsMeta[sub.ID] = genObj();
        metaData.updateOnce = updateOnce;
        metaData.opts = cloneObject(options);
        if (updateEvenIfSame || this.type === 'Event' || this.type === 'Proxy' || this.type === 'Array') {
          metaData.opts.updateEvenIfSame = true;
        }
        metaData.valueRef = sub.type === 'Func' ? 'valuePassed' : 'value';
      }
    }
    return alreadyHadSub;
  },
  removeSub: function(sub, bothWays) {
    var j, len, ref, subItem;
    if (sub.isMulti) {
      ref = sub.bindings;
      for (j = 0, len = ref.length; j < len; j++) {
        subItem = ref[j];
        this.removeSub(subItem, bothWays);
      }
    } else {
      if (this.subsMeta[sub.ID]) {
        this.subs.splice(this.subs.indexOf(sub), 1);
        delete this.subsMeta[sub.ID];
        delete sub.pubsMap[this.ID];
      }
      if (bothWays) {
        sub.removeSub(this);
        delete this.pubsMap[sub.ID];
      }
    }
    if (this.subs.length === 0 && Object.keys(this.pubsMap).length === 0) {
      this.destroy();
    }
  },
  removeAllSubs: function(bothWays) {
    var j, len, ref, sub;
    ref = this.subs.slice();
    for (j = 0, len = ref.length; j < len; j++) {
      sub = ref[j];
      this.removeSub(sub, bothWays);
    }
  },
  destroy: function() {
    var event, j, len, ref;
    delete boundInstances[this.ID];
    this.removePollInterval();
    if (this.type === 'Event') {
      ref = this.attachedEvents;
      for (j = 0, len = ref.length; j < len; j++) {
        event = ref[j];
        this.unRegisterEvent(event);
      }
    } else if (this.type === 'Func') {
      delete this.object._sb_ID;
    }

    /* istanbul ignore next */
    if (this.isLiveProp && this.origDescriptor) {
      convertToReg(this, this.object);
    }
    if (this.type === 'Array') {
      convertToReg(this, this.value, true);
    }
    if (this.object._sb_map) {
      delete this.object._sb_map[this.selector];
      if (Object.keys(this.object._sb_map).length === 0) {
        delete this.object._sb_map;
      }
    }
  },
  fetchDirectValue: function() {
    var choiceEl, choiceName, ref, results, type;
    type = this.type;
    switch (false) {
      case type !== 'Func':
        return this.object();
      case type !== 'DOMAttr':
        return this.object.getAttribute(this.property) || '';
      case !this.isMultiChoice:
        results = [];
        ref = this.choices;
        for (choiceName in ref) {
          choiceEl = ref[choiceName];
          if (choiceEl.object.checked) {
            if (type === 'DOMRadio') {
              return choiceName;
            } else {
              results.push(choiceName);
            }
          }
        }
        return results;
      default:
        return this.object[this.property];
    }
  },
  setValue: function(newValue, publisher, fromSelf, fromChangeEvent) {
    var choiceBinding, choiceName, entireValue, index, j, k, len, len1, n, newChoiceValue, newChoices, newValueArray, overwritePrevious, parent, prevCursror, prevValue, ref, ref1, ref2, targetChoiceBinding, textNode, value;
    publisher || (publisher = this);
    if (this.selfTransform) {
      newValue = this.selfTransform(newValue);
    }
    if (!fromSelf) {
      switch (this.type) {
        case 'ObjectProp':
          if (!this.isLiveProp) {
            if (newValue !== this.value) {
              this.object[this.property] = newValue;
            }
          } else if (this.isDomInput) {
            if (!fromChangeEvent) {
              this.origSetter(newValue);
              if (settings.dispatchEvents) {
                this.object.dispatchEvent(changeEvent());
              }
            } else if (newValue !== this.origGetter()) {
              prevCursror = this.object.selectionStart;
              this.origSetter(newValue);
              if (prevCursror) {
                this.object.setSelectionRange(prevCursror, prevCursror);
              }
            }
          } else if (this.origSetter) {
            this.origSetter(newValue);
          }
          break;
        case 'Pholder':
          parent = this.parentBinding;
          parent.pholderValues[this.pholder] = newValue;
          entireValue = applyPlaceholders(parent.pholderContexts, parent.pholderValues, parent.pholderIndexMap);
          if (this.textNodes && newValue !== this.value) {
            ref = this.textNodes;
            for (j = 0, len = ref.length; j < len; j++) {
              textNode = ref[j];
              textNode[textContent] = newValue;
            }
          }
          if (this.property !== textContent) {
            parent.setValue(entireValue, publisher);
          }
          break;
        case 'Array':
          if (newValue !== this.value) {
            if (!checkIf.isArray(newValue)) {
              newValue = Array.prototype.concat(newValue);
            }
            convertToReg(this, this.value, true);
            convertToLive(this, newValue = newValue.slice(), true);
            if (this.origSetter) {
              this.origSetter(newValue);
            }
          }
          break;
        case 'Func':
          prevValue = this.valuePassed;
          this.valuePassed = newValue;
          newValue = this.object(newValue, prevValue);
          break;
        case 'Event':
          this.isEmitter = true;
          this.emitEvent(newValue);
          this.isEmitter = false;
          break;
        case 'DOMRadio':
          if (this.isMultiChoice) {
            targetChoiceBinding = checkIf.isBinding(newValue) ? newValue : this.choices[newValue];
            if (targetChoiceBinding) {
              newValue = targetChoiceBinding.object.value;
              ref1 = this.choices;
              for (n in ref1) {
                choiceBinding = ref1[n];
                choiceBinding.setValue(choiceBinding.ID === targetChoiceBinding.ID, publisher);
              }
            } else {
              newValue = this.value;
            }
          } else {
            newValue = !!newValue;
            if (newValue === this.value) {
              return;
            }
            if (this.object.checked !== newValue) {
              this.object.checked = newValue;
            }
            if (newValue && settings.dispatchEvents) {
              this.object.dispatchEvent(changeEvent());
            }
          }
          break;
        case 'DOMCheckbox':
          if (this.isMultiChoice) {
            overwritePrevious = !checkIf.isBinding(newValue);
            newChoices = [].concat(newValue);
            for (index = k = 0, len1 = newChoices.length; k < len1; index = ++k) {
              value = newChoices[index];
              newChoices[index] = checkIf.isBinding(value) ? value : this.choices[value];
            }
            newValueArray = [];
            ref2 = this.choices;
            for (choiceName in ref2) {
              choiceBinding = ref2[choiceName];
              if (overwritePrevious) {
                newChoiceValue = targetIncludes(newChoices, choiceBinding);
              } else {
                newChoiceValue = choiceBinding.value;
              }
              choiceBinding.setValue(newChoiceValue, publisher);
              if (newChoiceValue) {
                newValueArray.push(choiceName);
              }
            }
            newValue = newValueArray;
          } else {
            newValue = !!newValue;
            if (newValue === this.value) {
              return;
            }
            if (this.object.checked !== newValue) {
              this.object.checked = newValue;
              if (settings.dispatchEvents) {
                this.object.dispatchEvent(changeEvent());
              }
            }
          }
          break;
        case 'DOMAttr':
          this.object.setAttribute(this.property, newValue);
      }
    }
    this.value = newValue;
    this.updateAllSubs(publisher);
  },
  updateAllSubs: function(publisher) {
    var arr, i;
    if (i = (arr = this.subs).length) {
      while (i--) {
        this.updateSub(arr[i], publisher);
      }
    }
  },
  updateSub: function(sub, publisher, isDelayedUpdate) {
    var currentTime, meta, newValue, subValue, timePassed, transform;
    if ((publisher === sub) || (publisher !== this && publisher.subsMeta[sub.ID])) {
      return;
    }
    meta = this.subsMeta[sub.ID];
    if (meta.disallowList && meta.disallowList[publisher.ID]) {
      return;
    }
    if (meta.opts.throttle) {
      currentTime = +(new Date);
      timePassed = currentTime - meta.lastUpdate;
      if (timePassed < meta.opts.throttle) {
        clearTimeout(meta.updateTimer);
        return meta.updateTimer = setTimeout((function(_this) {
          return function() {
            if (_this.subsMeta[sub.ID]) {
              return _this.updateSub(sub, publisher);
            }
          };
        })(this), meta.opts.throttle - timePassed);
      } else {
        meta.lastUpdate = currentTime;
      }
    } else if (meta.opts.delay && !isDelayedUpdate) {
      return setTimeout((function(_this) {
        return function() {
          if (_this.subsMeta[sub.ID]) {
            return _this.updateSub(sub, publisher, true);
          }
        };
      })(this), meta.opts.delay);
    }
    newValue = this.type === 'Array' && meta.opts.sendArrayCopies ? this.value.slice() : this.value;
    subValue = sub[meta.valueRef];
    newValue = (transform = meta.transformFn) ? transform(newValue, subValue, sub.object) : newValue;
    if (newValue === subValue && !meta.opts.updateEvenIfSame || meta.conditionFn && !meta.conditionFn(newValue, subValue, sub.object)) {
      return;
    }
    if (meta.opts.promiseTransforms && newValue && checkIf.isFunction(newValue.then)) {
      newValue.then(function(newValue) {
        sub.setValue(newValue, publisher);
      });
    } else {
      sub.setValue(newValue, publisher);
    }
    if (meta.updateOnce) {
      this.removeSub(sub);
    }
  },
  addModifierFn: function(target, subInterfaces, subjectFn, updateOnBind) {
    var base, j, len, subInterface, subMetaData, subscriber;
    if (!checkIf.isFunction(subjectFn)) {
      return throwWarning('fnOnly', 2);
    } else {
      for (j = 0, len = subInterfaces.length; j < len; j++) {
        subInterface = subInterfaces[j];
        subscriber = subInterface._ || subInterface;
        if (subscriber.isMulti) {
          this.addModifierFn(target, subscriber.bindings, subjectFn, updateOnBind);
        } else {
          subMetaData = this.subsMeta[subscriber.ID];
          subMetaData[target] = subjectFn;
          updateOnBind = updateOnBind && !subMetaData.updateOnce;
          if (this.pubsMap[subscriber.ID]) {
            (base = subscriber.subsMeta[this.ID])[target] || (base[target] = subjectFn);
          }
          if ((updateOnBind || this.type === 'Func') && target === 'transformFn') {
            this.updateSub(subscriber, this);
          }
        }
      }
      return true;
    }
  },
  setSelfTransform: function(transformFn, updateOnBind) {
    this.selfTransform = transformFn;
    if (updateOnBind) {
      this.setValue(this.value);
    }
  },
  addDisallowRule: function(targetSub, targetDisallow) {
    var base, disallowList;
    disallowList = (base = this.subsMeta[targetSub.ID]).disallowList != null ? base.disallowList : base.disallowList = genObj();
    disallowList[targetDisallow.ID] = 1;
  },
  scanForPholders: function() {
    var index;
    if (!this.pholderValues) {
      this.pholderValues = genObj();
      this.pholderIndexMap = genObj();
      this.pholderContexts = [];
      if (checkIf.isString(this.value)) {
        this.pholderContexts = this.value.split(pholderRegExSplit);
        index = 0;
        this.value = this.value.replace(pholderRegEx, (function(_this) {
          return function(e, pholder) {
            _this.pholderIndexMap[index++] = pholder;
            return _this.pholderValues[pholder] = pholder;
          };
        })(this));
      }
      if (this.isDom && this.property === textContent) {
        scanTextNodesPlaceholders(this.object, this.textNodes = genObj());
      }
    }
  },
  addPollInterval: function(time) {
    if (this.type !== 'Event') {
      this.removePollInterval();
      return this.pollInterval = setInterval((function(_this) {
        return function() {
          var polledValue;
          polledValue = _this.fetchDirectValue();
          return _this.setValue(polledValue, _this, true);
        };
      })(this), time);
    }
  },
  removePollInterval: function() {
    clearInterval(this.pollInterval);
    return this.pollInterval = null;
  },
  addUpdateListener: function(eventName, targetProperty) {
    this.object.addEventListener(eventName, (function(_this) {
      return function(event) {
        var shouldRedefineValue;
        if (!event._sb) {
          shouldRedefineValue = _this.selfTransform && _this.isDomInput;
          _this.setValue(_this.object[targetProperty], null, !shouldRedefineValue, true);
        }
      };
    })(this), false);
  },
  attachEvents: function() {
    if (this.eventName) {
      this.registerEvent(this.eventName);
    } else if (this.isDomInput) {
      this.addUpdateListener('input', 'value');
      this.addUpdateListener('change', 'value');
    } else if (!this.isMultiChoice && (this.type === 'DOMRadio' || this.type === 'DOMCheckbox')) {
      this.addUpdateListener('change', 'checked');
    }
  },
  registerEvent: function(eventName) {
    this.attachedEvents.push(eventName);
    if (!this.eventHandler) {
      this.eventHandler = eventUpdateHandler.bind(this);
    }
    this.object[this.eventMethods.listen](eventName, this.eventHandler);
  },
  unRegisterEvent: function(eventName) {
    this.attachedEvents.splice(this.attachedEvents.indexOf(eventName), 1);
    this.object[this.eventMethods.remove](eventName, this.eventHandler);
  },
  emitEvent: function(extraData) {
    var eventObject;
    eventObject = this.eventName;
    if (this.eventMethods.emit === 'dispatchEvent') {
      if (!this.eventObject) {
        this.eventObject = document.createEvent('Event');
        this.eventObject.initEvent(this.eventName, true, true);
      }
      this.eventObject.bindingData = extraData;
      eventObject = this.eventObject;
    }
    this.object[this.eventMethods.emit](eventObject, extraData);
  }
};

eventUpdateHandler = function() {
  if (!this.isEmitter) {
    this.setValue(arguments[this.property], null, true);
  }
};

;

;


/**
 * Stage definitions:
 * 
 * 0: Selection:			Got selector, awaiting object.
 * 1: Indication:			Got object, awaiting proxied property / function / Binding-object.
 * 2: Binding Complete:		Complete, awaiting additional (optional) bindings/mutations.
 */
var BindingInterface;

BindingInterface = function(options, inheritedState) {
  var key;
  if (inheritedState) {
    extendState(this, inheritedState);
    this.stage = 1;
  } else {
    this.stage = 0;
    this.subs = [];
    this.optionsPassed = options || (options = {});
    this.options = {};
    for (key in defaultOptions) {
      this.options[key] = options[key] != null ? options[key] : defaultOptions[key];
    }
  }
  return this;
};

var BindingInterfacePrivate;

BindingInterfacePrivate = {
  selfClone: function() {
    return new BindingInterface(null, this);
  },
  defineMainProps: function(binding) {
    this._ = binding;
    return Object.defineProperties(this, {
      'value': {
        get: function() {
          return binding.value;
        }
      },
      'original': {
        get: function() {
          return binding.objects || binding.object;
        }
      },
      'subscribers': {
        get: function() {
          return binding.subs.slice().map(function(sub) {
            return sub.object;
          });
        }
      }
    });
  },
  createBinding: function(subject, newObjectType, bindingInterface, isFunction) {
    var cachedBinding, newBinding;
    this.object = subject;
    cachedBinding = cache.get(subject, isFunction, this.selector, this.isMultiChoice);
    if (cachedBinding) {
      return this.patchCachedBinding(cachedBinding);
    } else {
      newBinding = new Binding(subject, newObjectType, bindingInterface);
      cache.set(newBinding, isFunction);
      return newBinding;
    }
  },
  patchCachedBinding: function(cachedBinding) {
    var key, option, ref, ref1, value;
    if (cachedBinding.type === 'ObjectProp' && !(this.property in this.object)) {
      convertToLive(cachedBinding, this.object);
    }
    if (this.saveOptions) {
      ref = this.optionsPassed;
      for (option in ref) {
        value = ref[option];
        cachedBinding.optionsDefault[option] = value;
      }
    }
    ref1 = cachedBinding.optionsDefault;
    for (key in ref1) {
      value = ref1[key];
      this.options[key] = checkIf.isDefined(this.optionsPassed[key]) ? this.optionsPassed[key] : value;
    }
    return cachedBinding;
  },
  setProperty: function(subject) {
    var split;
    if (checkIf.isNumber(subject)) {
      subject = subject.toString();
    }
    this.selector = this.property = subject;
    if (!this.options.simpleSelector) {
      if (targetIncludes(subject, ':')) {
        split = subject.split(':');
        this.descriptor = split.slice(0, -1).join(':');
        this.property = split[split.length - 1];
      }
      if (targetIncludes(subject, '.')) {
        split = this.property.split('.');
        this.property = split[0];
        this.pholder = split.slice(1).join('.');
      }
      if (targetIncludes(this.descriptor, 'event')) {
        if (targetIncludes(subject, '#')) {
          split = this.property.split('#');
          this.eventName = split[0];
          this.property = split[1];
        } else {
          this.eventName = this.property;
          this.property = 0;
        }
        if (isNaN(parseInt(this.property))) {
          throwWarning('badEventArg', 1);
        }
      }
    }
    return this;
  },
  setObject: function(subject, isFunction) {
    var newObjectType;
    this.stage = 1;
    var isDomCheckbox, isDomRadio, isIterable, sampleItem, subject;
    
    isIterable = subject !== window && checkIf.isIterable(subject) && !subject.nodeType;
    
    sampleItem = isIterable ? subject[0] : subject;
    
    if (!sampleItem) {
      if (isIterable && checkIf.isElCollection(subject)) {
        throwError('emptyList');
      }
    } else if (this.isDom = checkIf.isDom(sampleItem)) {
      if (this.property === 'checked') {
        isDomRadio = sampleItem && checkIf.isDomRadio(sampleItem);
        isDomCheckbox = !isDomRadio && sampleItem && checkIf.isDomCheckbox(sampleItem);
      } else if (this.property === 'value') {
        this.isDomInput = checkIf.isDomInput(sampleItem);
      }
      if (isIterable && !targetIncludes(this.descriptor, 'multi')) {
        if (subject.length === 1) {
          subject = subject[0];
        } else {
          if ((isDomRadio || isDomCheckbox) && !checkIf.domElsAreSame(subject)) {
            return throwWarning('mixedElList', 3);
          } else {
            if (isDomRadio || isDomCheckbox) {
              this.isMultiChoice = true;
              subject = [].slice.call(subject);
            } else {
              subject = subject[0];
              throwWarning('onlyOneDOMElement', 3);
            }
          }
        }
      }
    }
    
    ;
    switch (false) {
      case !isFunction:
        newObjectType = 'Func';
        break;
      case !this.pholder:
        newObjectType = 'Pholder';
        break;
      case !(targetIncludes(this.descriptor, 'array') && checkIf.isArray(subject[this.property])):
        newObjectType = 'Array';
        break;
      case !targetIncludes(this.descriptor, 'event'):
        newObjectType = 'Event';
        this.eventMethods = {
          listen: this.optionsPassed.listenMethod,
          remove: this.optionsPassed.removeMethod,
          emit: this.optionsPassed.emitMethod
        };
        
        if (!subject[this.eventMethods.listen]) {
          this.eventMethods.listen = checkIf.isDomNode(subject) ? 'addEventListener' : 'on';
        }
        
        if (!subject[this.eventMethods.remove]) {
          this.eventMethods.remove = checkIf.isDomNode(subject) ? 'removeEventListener' : 'removeListener';
        }
        
        if (!subject[this.eventMethods.emit]) {
          this.eventMethods.emit = checkIf.isDomNode(subject) ? 'dispatchEvent' : 'emit';
        }
        
        ;
        break;
      case !targetIncludes(this.descriptor, 'func'):
        newObjectType = 'Proxy';
        break;
      case !isDomRadio:
        newObjectType = 'DOMRadio';
        break;
      case !isDomCheckbox:
        newObjectType = 'DOMCheckbox';
        break;
      case !targetIncludes(this.descriptor, 'attr'):
        newObjectType = 'DOMAttr';
        break;
      default:
        newObjectType = 'ObjectProp';
    }
    if (targetIncludes(this.descriptor, 'multi')) {
      if (!subject.length) {
        throwError('emptyList');
      }
      this.defineMainProps(new GroupBinding(this, subject, newObjectType));
    } else {
      this.defineMainProps(this.createBinding(subject, newObjectType, this, isFunction));
    }
    if (targetIncludes(this._.type, 'Event') || targetIncludes(this._.type, 'Proxy')) {
      this.options.updateOnBind = false;
    } else if (targetIncludes(this._.type, 'Func')) {
      this.options.updateOnBind = true;
    }
    if (this.completeCallback) {
      return this.completeCallback(this);
    } else {
      return this;
    }
  },
  addToPublisher: function(publisherInterface) {
    var alreadyHadSub, binding, i, len, ref;
    publisherInterface.stage = 2;
    publisherInterface.subs.push(this);
    alreadyHadSub = publisherInterface._.addSub(this._, publisherInterface.options, publisherInterface.updateOnce);
    if (publisherInterface.updateOnce) {
      delete publisherInterface.updateOnce;
    } else if (publisherInterface.options.updateOnBind && !alreadyHadSub) {
      if (this._.isMulti) {
        ref = this._.bindings;
        for (i = 0, len = ref.length; i < len; i++) {
          binding = ref[i];
          publisherInterface._.updateSub(binding, publisherInterface._);
        }
      } else {
        publisherInterface._.updateSub(this._, publisherInterface._);
      }
    }
  }
};

;

var METHOD_bothWays, METHOD_chainTo, METHOD_condition, METHOD_conditionAll, METHOD_of, METHOD_pollEvery, METHOD_set, METHOD_setOption, METHOD_stopPolling, METHOD_transform, METHOD_transformAll, METHOD_transformSelf, METHOD_unBind;

BindingInterface.prototype = Object.create(BindingInterfacePrivate, {
  of: {
    get: function() {
      if (!this.stage) {
        return METHOD_of;
      }
    }
  },
  set: {
    get: function() {
      if (this.stage) {
        return METHOD_set;
      }
    }
  },
  chainTo: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_chainTo;
      }
    }
  },
  transformSelf: {
    get: function() {
      if (this.stage === 1) {
        return METHOD_transformSelf;
      }
    }
  },
  transform: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_transform;
      }
    }
  },
  transformAll: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_transformAll;
      }
    }
  },
  condition: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_condition;
      }
    }
  },
  conditionAll: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_conditionAll;
      }
    }
  },
  bothWays: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_bothWays;
      }
    }
  },
  unBind: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_unBind;
      }
    }
  },
  pollEvery: {
    get: function() {
      if (this.stage) {
        return METHOD_pollEvery;
      }
    }
  },
  stopPolling: {
    get: function() {
      if (this.stage) {
        return METHOD_stopPolling;
      }
    }
  },
  setOption: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_setOption;
      }
    }
  },
  disallowFrom: {
    get: function() {
      var thisInterface;
      if (this.stage === 2 && (thisInterface = this)) {
        return genProxiedInterface(false, function(disallowInterface) {
          var subInterface;
          subInterface = thisInterface.subs[thisInterface.subs.length - 1];
          thisInterface._.addDisallowRule(subInterface._, disallowInterface._);
          return thisInterface;
        });
      }
    }
  },
  updateOn: {
    get: function() {
      var thisInterface;
      if (this.stage && (thisInterface = this)) {
        return genProxiedInterface(false, function(subInterface) {
          if (subInterface._ !== thisInterface._) {
            thisInterface._.pubsMap[subInterface._.ID] = subInterface._;
            subInterface._.addSub(genSelfUpdater(thisInterface._, true), subInterface.options, false, true);
          }
          return thisInterface;
        });
      }
    }
  },
  removeUpdater: {
    get: function() {
      var selfUpdater, thisInterface;
      if (this.stage && (thisInterface = this) && (selfUpdater = this._.selfUpdater)) {
        return genProxiedInterface(false, function(subInterface) {
          if (subInterface._.subsMeta[selfUpdater.ID]) {
            delete thisInterface._.pubsMap[subInterface._.ID];
            subInterface._.removeSub(selfUpdater);
          }
        });
      }
    }
  },
  to: {
    get: function() {
      var thisInterface;
      if (this.stage === 1 && (thisInterface = this)) {
        return genProxiedInterface(true, function(subInterface) {
          if (subInterface._ !== thisInterface._) {
            subInterface.addToPublisher(thisInterface);
          }
          return thisInterface;
        });
      }
    }
  },
  and: {
    get: function() {
      var cloneBinding, cloneInterface;
      cloneInterface = this.selfClone();
      if (this.stage === 2) {
        return cloneInterface;
      } else if (this.stage === 1) {
        if (!cloneInterface._.isMulti) {
          cloneBinding = cloneInterface._;
          cloneInterface._ = cloneInterface._ = new GroupBinding(cloneInterface);
          cloneInterface._.addBinding(cloneBinding);
        }
        return genProxiedInterface(false, function(siblingInterface) {
          cloneInterface._.addBinding(siblingInterface._);
          return cloneInterface;
        });
      }
    }
  },
  once: {
    get: function() {
      var interfaceToReturn;
      if (this.stage === 1) {
        interfaceToReturn = this.selfClone();
        interfaceToReturn.updateOnce = true;
        return interfaceToReturn;
      }
    }
  },
  update: {
    get: function() {
      return this.set;
    }
  },
  twoWay: {
    get: function() {
      return this.bothWays;
    }
  },
  pipe: {
    get: function() {
      return this.chainTo;
    }
  }
});

METHOD_of = function(object) {
  if (!(checkIf.isObject(object) || checkIf.isFunction(object))) {
    throwErrorBadArg(object);
  }
  if (checkIf.isBindingInterface(object)) {
    object = object.object;
  }
  this.stage = 1;
  return this.setObject(object);
};

METHOD_chainTo = function(subject, specificOptions, saveOptions) {
  return SimplyBind(this.subs[this.subs.length - 1]).to(subject, specificOptions, saveOptions);
};

METHOD_set = function(newValue) {
  this._.setValue(newValue);
  return this;
};

METHOD_transformSelf = function(transformFn) {
  if (!checkIf.isFunction(transformFn)) {
    throwWarning('fnOnly', 1);
  } else {
    this._.setSelfTransform(transformFn, this.options.updateOnBind);
  }
  return this;
};

METHOD_transform = function(transformFn) {
  this._.addModifierFn('transformFn', this.subs.slice(-1), transformFn, this.options.updateOnBind);
  return this;
};

METHOD_transformAll = function(transformFn) {
  this._.addModifierFn('transformFn', this.subs, transformFn, this.options.updateOnBind);
  return this;
};

METHOD_condition = function(conditionFn) {
  this._.addModifierFn('conditionFn', this.subs.slice(-1), conditionFn);
  return this;
};

METHOD_conditionAll = function(conditionFn) {
  this._.addModifierFn('conditionFn', this.subs, conditionFn);
  return this;
};

METHOD_bothWays = function(altTransform) {
  var binding, bindings, i, len, originCondition, originTransform, sub, subBinding, transformToUse;
  sub = this.subs[this.subs.length - 1];
  subBinding = sub._;
  bindings = this._.isMulti ? this._.bindings : [this._];
  subBinding.addSub(this._, sub.options);
  for (i = 0, len = bindings.length; i < len; i++) {
    binding = bindings[i];
    originTransform = binding.subsMeta[subBinding.ID].transformFn;
    originCondition = binding.subsMeta[subBinding.ID].conditionFn;
    if (originTransform || altTransform) {
      transformToUse = checkIf.isFunction(altTransform) ? altTransform : originTransform;
      if (transformToUse && altTransform !== false) {
        subBinding.subsMeta[this._.ID].transformFn = transformToUse;
      }
    }
    if (originCondition) {
      subBinding.subsMeta[this._.ID].conditionFn = originCondition;
    }
  }
  return this;
};

METHOD_unBind = function(bothWays) {
  var i, len, ref, sub;
  ref = this.subs;
  for (i = 0, len = ref.length; i < len; i++) {
    sub = ref[i];
    this._.removeSub(sub._, bothWays);
  }
  return this;
};

METHOD_pollEvery = function(time) {
  this._.addPollInterval(time);
  return this;
};

METHOD_stopPolling = function() {
  this._.removePollInterval();
  return this;
};

METHOD_setOption = function(optionName, newValue) {
  this._.subsMeta[this.subs[this.subs.length - 1]._.ID].opts[optionName] = newValue;
  return this;
};

;

;

var GroupBinding, proto;

GroupBinding = function(bindingInterface, objects, objectType) {
  var bindings, i, len, object;
  bindingInterface.selector = bindingInterface.selector.slice(6);
  extendState(this, this["interface"] = bindingInterface);
  this.isMulti = true;
  this.bindings = bindings = [];
  if (objects) {
    for (i = 0, len = objects.length; i < len; i++) {
      object = objects[i];
      this.addBinding(object, objectType);
    }
  }
  return Object.defineProperties(this, {
    'type': {
      get: function() {
        return bindings.map(function(binding) {
          return binding.type;
        });
      }
    },
    'value': {
      get: function() {
        return bindings.map(function(binding) {
          return binding.value;
        });
      }
    }
  });
};

proto = GroupBinding.prototype = Object.create(BindingInterfacePrivate);

Object.keys(Binding.prototype).forEach(function(methodName) {
  return proto[methodName] = function(a, b, c, d) {
    var binding, i, len, ref;
    ref = this.bindings;
    for (i = 0, len = ref.length; i < len; i++) {
      binding = ref[i];
      if (methodName === 'updateSub') {
        b = binding;
      }
      binding[methodName](a, b, c, d);
    }
  };
});

proto.addBinding = function(object, objectType) {
  this.bindings.push(!objectType ? object : this.createBinding(object, objectType, this["interface"]));
};

;

module.exports = SimplyBind;

;
return module.exports;
},
12: function (require, module, exports) {
module.exports = {
  any: /./,
  whiteSpace: /\s+/,
  numeric: /^\d$/,
  letter: /^[a-zA-Z]$/,
  widenumeric: /^[0-9\!#\$\%\*\+\/\=\?\^\{\|\}\(\)\~\-\.]$/,
  alphanumeric: /^[0-9A-Za-z\!#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\(\)\~\-\ ]$/,
  email: /^[\w\-\.]+@[\w\-\.]+\.[A-Za-z]{2,10}$/
};

;
return module.exports;
},
13: function (require, module, exports) {
var QuickCSS, constants, helpers;

constants = require(42);

helpers = require(43);

QuickCSS = function(targetEl, property, value, important) {
  var computedStyle, i, len, subEl, subProperty, subValue;
  if (helpers.isIterable(targetEl)) {
    for (i = 0, len = targetEl.length; i < len; i++) {
      subEl = targetEl[i];
      QuickCSS(subEl, property, value);
    }
  } else if (typeof property === 'object') {
    for (subProperty in property) {
      subValue = property[subProperty];
      QuickCSS(targetEl, subProperty, subValue);
    }
  } else {
    property = helpers.normalizeProperty(property);
    if (typeof value === 'undefined') {
      computedStyle = targetEl._computedStyle || (targetEl._computedStyle = getComputedStyle(targetEl));
      return computedStyle[property];
    } else if (property) {
      targetEl.style.setProperty(property, helpers.normalizeValue(property, value), important ? constants.IMPORTANT : void 0);
    }
  }
};

QuickCSS.animation = function(name, frames) {
  var frame, generated, prefix, rules;
  if (name && typeof name === 'string' && frames && typeof frames === 'object') {
    prefix = helpers.getPrefix('animation');
    generated = '';
    for (frame in frames) {
      rules = frames[frame];
      generated += frame + " {" + (helpers.ruleToString(rules)) + "}";
    }
    generated = "@" + prefix + "keyframes " + name + " {" + generated + "}";
    return helpers.inlineStyle(generated, true, 0);
  }
};

QuickCSS.register = function(rule, level, important) {
  var className, ref, style;
  if (rule && typeof rule === 'object') {
    level || (level = 0);
    rule = helpers.ruleToString(rule, important);
    if (!(className = (ref = helpers.inlineStyleConfig[level]) != null ? ref[rule] : void 0)) {
      className = helpers.hash(rule);
      style = "." + className + " {" + rule + "}";
      helpers.inlineStyle(style, className, level);
    }
    return className;
  }
};

QuickCSS.clearRegistered = function(level) {
  return helpers.clearInlineStyle(level || 0);
};


/* istanbul ignore next */

QuickCSS.UNSET = (function() {
  switch (false) {
    case !helpers.isValueSupported('display', 'unset'):
      return 'unset';
    case !helpers.isValueSupported('display', 'initial'):
      return 'initial';
    case !helpers.isValueSupported('display', 'inherit'):
      return 'inherit';
  }
})();

QuickCSS.supports = helpers.isValueSupported;

QuickCSS.supportsProperty = helpers.isPropSupported;

QuickCSS.normalizeProperty = helpers.normalizeProperty;

QuickCSS.normalizeValue = helpers.normalizeValue;

QuickCSS.version = "1.3.4";

module.exports = QuickCSS;

;
return module.exports;
},
24: function (require, module, exports) {
var Checks, availSets;

availSets = {
  natives: require(57),
  dom: require(58)
};

Checks = (function() {
  Checks.prototype.create = function() {
    var args;
    if (arguments.length) {
      args = Array.prototype.slice.call(arguments);
    }
    return new Checks(args);
  };

  function Checks(sets) {
    var i, len, set;
    if (sets == null) {
      sets = ['natives'];
    }
    for (i = 0, len = sets.length; i < len; i++) {
      set = sets[i];
      if (availSets[set]) {
        this.load(availSets[set]);
      }
    }
  }

  Checks.prototype.load = function(set) {
    var key, value;
    if (availSets.natives.string(set)) {
      set = availSets[set];
    }
    if (!availSets.natives.objectPlain(set)) {
      return;
    }
    for (key in set) {
      value = set[key];
      this[key] = value;
    }
  };

  return Checks;

})();

module.exports = Checks.prototype.create();

;
return module.exports;
},
25: function (require, module, exports) {
var extend, isArray, isObject, shouldDeepExtend;

isArray = function(target) {
  return Array.isArray(target);
};

isObject = function(target) {
  return target && Object.prototype.toString.call(target) === '[object Object]' || isArray(target);
};

shouldDeepExtend = function(options, target, parentKey) {
  if (options.deep) {
    if (options.notDeep) {
      return !options.notDeep[target];
    } else {
      return true;
    }
  } else if (options.deepOnly) {
    return options.deepOnly[target] || parentKey && shouldDeepExtend(options, parentKey);
  }
};

module.exports = extend = function(options, target, sources, parentKey) {
  var i, key, len, source, sourceValue, subTarget, targetValue;
  if (!target || typeof target !== 'object' && typeof target !== 'function') {
    target = {};
  }
  for (i = 0, len = sources.length; i < len; i++) {
    source = sources[i];
    if (source != null) {
      for (key in source) {
        sourceValue = source[key];
        targetValue = target[key];
        if (sourceValue === target || sourceValue === void 0 || (sourceValue === null && !options.allowNull && !options.nullDeletes) || (options.keys && !options.keys[key]) || (options.notKeys && options.notKeys[key]) || (options.own && !source.hasOwnProperty(key)) || (options.globalFilter && !options.globalFilter(sourceValue, key, source)) || (options.filters && options.filters[key] && !options.filters[key](sourceValue, key, source))) {
          continue;
        }
        if (sourceValue === null && options.nullDeletes) {
          delete target[key];
          continue;
        }
        if (options.globalTransform) {
          sourceValue = options.globalTransform(sourceValue, key, source);
        }
        if (options.transforms && options.transforms[key]) {
          sourceValue = options.transforms[key](sourceValue, key, source);
        }
        switch (false) {
          case !(options.concat && isArray(sourceValue) && isArray(targetValue)):
            target[key] = targetValue.concat(sourceValue);
            break;
          case !(shouldDeepExtend(options, key, parentKey) && isObject(sourceValue)):
            subTarget = isObject(targetValue) ? targetValue : isArray(sourceValue) ? [] : {};
            target[key] = extend(options, subTarget, [sourceValue], key);
            break;
          default:
            target[key] = sourceValue;
        }
      }
    }
  }
  return target;
};

;
return module.exports;
},
27: function (require, module, exports) {
var QuickCSS, constants, helpers;

constants = require(59);

helpers = require(60);

QuickCSS = function(targetEl, property, value) {
  var computedStyle, i, len, subEl, subProperty, subValue;
  if (helpers.isIterable(targetEl)) {
    for (i = 0, len = targetEl.length; i < len; i++) {
      subEl = targetEl[i];
      QuickCSS(subEl, property, value);
    }
  } else if (typeof property === 'object') {
    for (subProperty in property) {
      subValue = property[subProperty];
      QuickCSS(targetEl, subProperty, subValue);
    }
  } else {
    property = helpers.normalizeProperty(property);
    if (typeof value === 'undefined') {
      computedStyle = targetEl._computedStyle || (targetEl._computedStyle = getComputedStyle(targetEl));
      return computedStyle[property];
    } else if (property) {
      targetEl.style[property] = helpers.normalizeValue(property, value);
    }
  }
};

QuickCSS.animation = function(name, frames) {
  var frame, generated, prefix, rules;
  if (name && typeof name === 'string' && frames && typeof frames === 'object') {
    prefix = helpers.getPrefix('animation');
    generated = '';
    for (frame in frames) {
      rules = frames[frame];
      generated += frame + " {" + (helpers.ruleToString(rules)) + "}";
    }
    generated = "@" + prefix + "keyframes " + name + " {" + generated + "}";
    return helpers.inlineStyle(generated, true, 0);
  }
};

QuickCSS.register = function(rule, level) {
  var className, ref, style;
  if (rule && typeof rule === 'object') {
    level || (level = 0);
    rule = helpers.ruleToString(rule);
    if (!(className = (ref = helpers.inlineStyleConfig[level]) != null ? ref[rule] : void 0)) {
      className = helpers.hash(rule);
      style = "." + className + " {" + rule + "}";
      helpers.inlineStyle(style, className, level);
    }
    return className;
  }
};

QuickCSS.clearRegistered = function(level) {
  return helpers.clearInlineStyle(level || 0);
};


/* istanbul ignore next */

QuickCSS.UNSET = (function() {
  switch (false) {
    case !helpers.isValueSupported('display', 'unset'):
      return 'unset';
    case !helpers.isValueSupported('display', 'initial'):
      return 'initial';
    case !helpers.isValueSupported('display', 'inherit'):
      return 'inherit';
  }
})();

QuickCSS.supports = helpers.isValueSupported;

QuickCSS.supportsProperty = helpers.isPropSupported;

QuickCSS.normalizeProperty = helpers.normalizeProperty;

QuickCSS.normalizeValue = helpers.normalizeValue;

QuickCSS.version = "1.3.2";

module.exports = QuickCSS;

;
return module.exports;
},
28: function (require, module, exports) {
!(function(win) {

/**
 * FastDom
 *
 * Eliminates layout thrashing
 * by batching DOM read/write
 * interactions.
 *
 * @author Wilson Page <wilsonpage@me.com>
 * @author Kornel Lesinski <kornel.lesinski@ft.com>
 */

'use strict';

/**
 * Mini logger
 *
 * @return {Function}
 */
var debug = 0 ? console.log.bind(console, '[fastdom]') : function() {};

/**
 * Normalized rAF
 *
 * @type {Function}
 */
var raf = win.requestAnimationFrame
  || win.webkitRequestAnimationFrame
  || win.mozRequestAnimationFrame
  || win.msRequestAnimationFrame
  || function(cb) { return setTimeout(cb, 16); };

/**
 * Initialize a `FastDom`.
 *
 * @constructor
 */
function FastDom() {
  var self = this;
  self.reads = [];
  self.writes = [];
  self.raf = raf.bind(win); // test hook
  debug('initialized', self);
}

FastDom.prototype = {
  constructor: FastDom,

  /**
   * Adds a job to the read batch and
   * schedules a new frame if need be.
   *
   * @param  {Function} fn
   * @public
   */
  measure: function(fn, ctx) {
    debug('measure');
    var task = !ctx ? fn : fn.bind(ctx);
    this.reads.push(task);
    scheduleFlush(this);
    return task;
  },

  /**
   * Adds a job to the
   * write batch and schedules
   * a new frame if need be.
   *
   * @param  {Function} fn
   * @public
   */
  mutate: function(fn, ctx) {
    debug('mutate');
    var task = !ctx ? fn : fn.bind(ctx);
    this.writes.push(task);
    scheduleFlush(this);
    return task;
  },

  /**
   * Clears a scheduled 'read' or 'write' task.
   *
   * @param {Object} task
   * @return {Boolean} success
   * @public
   */
  clear: function(task) {
    debug('clear', task);
    return remove(this.reads, task) || remove(this.writes, task);
  },

  /**
   * Extend this FastDom with some
   * custom functionality.
   *
   * Because fastdom must *always* be a
   * singleton, we're actually extending
   * the fastdom instance. This means tasks
   * scheduled by an extension still enter
   * fastdom's global task queue.
   *
   * The 'super' instance can be accessed
   * from `this.fastdom`.
   *
   * @example
   *
   * var myFastdom = fastdom.extend({
   *   initialize: function() {
   *     // runs on creation
   *   },
   *
   *   // override a method
   *   measure: function(fn) {
   *     // do extra stuff ...
   *
   *     // then call the original
   *     return this.fastdom.measure(fn);
   *   },
   *
   *   ...
   * });
   *
   * @param  {Object} props  properties to mixin
   * @return {FastDom}
   */
  extend: function(props) {
    debug('extend', props);
    if (typeof props != 'object') throw new Error('expected object');

    var child = Object.create(this);
    mixin(child, props);
    child.fastdom = this;

    // run optional creation hook
    if (child.initialize) child.initialize();

    return child;
  },

  // override this with a function
  // to prevent Errors in console
  // when tasks throw
  catch: null
};

/**
 * Schedules a new read/write
 * batch if one isn't pending.
 *
 * @private
 */
function scheduleFlush(fastdom) {
  if (!fastdom.scheduled) {
    fastdom.scheduled = true;
    fastdom.raf(flush.bind(null, fastdom));
    debug('flush scheduled');
  }
}

/**
 * Runs queued `read` and `write` tasks.
 *
 * Errors are caught and thrown by default.
 * If a `.catch` function has been defined
 * it is called instead.
 *
 * @private
 */
function flush(fastdom) {
  debug('flush');

  var writes = fastdom.writes;
  var reads = fastdom.reads;
  var error;

  try {
    debug('flushing reads', reads.length);
    runTasks(reads);
    debug('flushing writes', writes.length);
    runTasks(writes);
  } catch (e) { error = e; }

  fastdom.scheduled = false;

  // If the batch errored we may still have tasks queued
  if (reads.length || writes.length) scheduleFlush(fastdom);

  if (error) {
    debug('task errored', error.message);
    if (fastdom.catch) fastdom.catch(error);
    else throw error;
  }
}

/**
 * We run this inside a try catch
 * so that if any jobs error, we
 * are able to recover and continue
 * to flush the batch until it's empty.
 *
 * @private
 */
function runTasks(tasks) {
  debug('run tasks');
  var task; while (task = tasks.shift()) task();
}

/**
 * Remove an item from an Array.
 *
 * @param  {Array} array
 * @param  {*} item
 * @return {Boolean}
 */
function remove(array, item) {
  var index = array.indexOf(item);
  return !!~index && !!array.splice(index, 1);
}

/**
 * Mixin own properties of source
 * object into the target.
 *
 * @param  {Object} target
 * @param  {Object} source
 */
function mixin(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) target[key] = source[key];
  }
}

// There should never be more than
// one instance of `FastDom` in an app
var exports = win.fastdom = (win.fastdom || new FastDom()); // jshint ignore:line

// Expose to CJS & AMD
if ((typeof define) == 'function') define(function() { return exports; });
else if ((typeof module) == 'object') module.exports = exports;

})( typeof window !== 'undefined' ? window : this);
;
return module.exports;
},
29: function (require, module, exports) {
var Condition, IS, SimplyBind;

IS = require(3);

SimplyBind = require(11);

Condition = (function() {
  function Condition(field1, settings, callback1) {
    var property, target;
    this.field = field1;
    this.settings = settings;
    this.callback = callback1;
    this.satisfied = false;
    this.value = this.settings.value;
    this.property = this.settings.property || '_value';
    if (this.settings.property === 'value') {
      this.property = '_value';
    }
    target = this.field.allFields[this.settings.target] || this.settings.target;
    if (IS.field(target)) {
      this.target = target;
    } else {
      return console.warn("condition target not found for the provided ID '" + this.settings.target + "'", this.field);
    }
    property = IS.array(this.target[this.property]) ? "array:" + this.property : this.property;
    SimplyBind(property, {
      updateOnBind: false
    }).of(this.target).and('visible').of(this.target.state).to(this.callback);
    SimplyBind('satisfied', {
      updateOnBind: false
    }).of(this).to((function(_this) {
      return function(newValue, oldValue) {
        var base;
        if (oldValue != null) {
          return typeof (base = _this.field).emit === "function" ? base.emit('conditionChange', _this) : void 0;
        }
      };
    })(this));
  }

  Condition.prototype.test = function() {
    var comparison, comparisonOperators, passedComparisons, ref, targetValue;
    if (!((ref = this.target) != null ? ref.state.visible : void 0)) {
      return false;
    }
    comparison = (function() {
      switch (false) {
        case !IS.objectPlain(this.value):
          return this.value;
        case !IS.regex(this.value):
          return {
            '$regex': this.value
          };
        case !(this.value === 'valid' && !this.settings.property || !IS.defined(this.value)):
          return 'valid';
        default:
          return {
            '$eq': this.value
          };
      }
    }).call(this);
    if (comparison === 'valid') {
      return this.target.validate();
    }
    targetValue = (function(_this) {
      return function() {
        var nestedObject, propertyChain;
        if (_this.property === '_value') {
          return _this.target.value;
        }
        propertyChain = _this.property.split('.');
        switch (false) {
          case propertyChain.length !== 1:
            return _this.target[_this.property];
          case !IS.defined(_this.target[_this.property]):
            return _this.target[_this.property];
          default:
            nestedObject = _this.target;
            while (IS.object(nestedObject)) {
              nestedObject = nestedObject[propertyChain.pop()];
            }
            return nestedObject;
        }
      };
    })(this)();
    comparisonOperators = Object.keys(comparison);
    passedComparisons = comparisonOperators.filter(function(operator) {
      var seekedValue;
      seekedValue = comparison[operator];
      switch (operator) {
        case '$eq':
          return targetValue === seekedValue;
        case '$ne':
          return targetValue !== seekedValue;
        case '$gt':
          return targetValue > seekedValue;
        case '$gte':
          return targetValue >= seekedValue;
        case '$lt':
          return targetValue < seekedValue;
        case '$lte':
          return targetValue <= seekedValue;
        case '$ct':
          return helpers.includes(targetValue, seekedValue);
        case '$nct':
          return !helpers.includes(targetValue, seekedValue);
        case '$regex':
          return seekedValue.test(targetValue);
        case '$nregex':
          return !seekedValue.test(targetValue);
        case '$mask':
          return helpers.testMask(targetValue, seekedValue);
        default:
          return false;
      }
    });
    return passedComparisons.length === comparisonOperators.length;
  };

  Condition.validate = function(conditions) {
    var validConditions;
    if (conditions) {
      validConditions = conditions.filter(function(condition) {
        return condition.satisfied = condition.test();
      });
      return validConditions.length === conditions.length;
    }
  };

  Condition.init = function(field, conditions, callback) {
    return setTimeout((function(_this) {
      return function() {
        if (callback == null) {
          callback = function() {
            return field.validateConditions();
          };
        }
        field.conditions = conditions.map(function(condition) {
          return new Condition(field, condition, callback);
        });
        return callback();
      };
    })(this));
  };

  return Condition;

})();

module.exports = Condition;

;
return module.exports;
},
31: function (require, module, exports) {
module.exports = {
  fontFamily: 'system-ui, sans-serif',
  templates: {},
  label: false,
  error: '',
  help: '',
  required: false,
  disabled: false,
  defaultValue: null,
  width: '100%',
  mobileWidth: null,
  mobileThreshold: 736,
  border: 1,
  margin: null,
  padding: null,
  distance: null,
  inputPadding: 12,
  fontSize: 14,
  labelSize: null,
  icon: null,
  iconSize: 22,
  getter: null,
  setter: null,
  validator: null,
  clearErrorOnValid: true
};

;
return module.exports;
},
32: function (require, module, exports) {
var Choice, Condition, DOM, Dropdown, IS, KEYCODES, List, SimplyBind, extend, globalDefaults, helpers,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

IS = require(3);

SimplyBind = require(11);

KEYCODES = require(34);

helpers = require(1);

Condition = require(29);

extend = require(4);

DOM = require(2);

globalDefaults = require(31);

var template = require(62);

var defaults = require(63);

Dropdown = (function() {
  Dropdown.prototype.template = template;

  Dropdown.prototype.defaults = defaults;

  Dropdown.prototype._settingFilters = {
    maxHeight: function(value) {
      return IS.number(value);
    }
  };

  function Dropdown(initialChoices, field) {
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
    this._selectedCallback = helpers.noop;
    this._createElements();
    this._attachBindings();
    return this;
  }

  Dropdown.prototype._createElements = function() {
    var choice, globalOpts, i, len, ref;
    globalOpts = {
      relatedInstance: this
    };
    this.els.container = this.template["default"].spawn(this.settings.templates["default"], extend({
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
  };

  Dropdown.prototype._attachBindings = function() {
    this._attachBindings_elState();
    this._attachBindings_display();
    return this._attachBindings_scrollIndicators();
  };

  Dropdown.prototype._attachBindings_elState = function() {
    SimplyBind('help').of(this.settings).to('text').of(this.els.help).and.to((function(_this) {
      return function(showHelp) {
        return _this.els.help.state('showHelp', showHelp);
      };
    })(this));
    SimplyBind('visibleChoicesCount').of(this).to((function(_this) {
      return function(count) {
        return _this.els.container.state('hasVisibleChoices', !!count);
      };
    })(this));
    return SimplyBind('currentHighlighted').of(this).to((function(_this) {
      return function(current, prev) {
        if (prev) {
          prev.el.state('hover', false);
        }
        if (current) {
          return current.el.state('hover', true);
        }
      };
    })(this));
  };

  Dropdown.prototype._attachBindings_display = function() {
    SimplyBind('isOpen', {
      updateOnBind: false
    }).of(this).to((function(_this) {
      return function(isOpen) {
        _this.els.container.state('isOpen', isOpen);
        if (!isOpen) {
          _this.currentHighlighted = null;
        }
        if (_this.settings.lockScroll) {
          if (isOpen) {
            helpers.lockScroll(_this.els.list);
          } else {
            helpers.unlockScroll();
          }
        }
        if (isOpen) {
          _this.list.calcDisplay();
          if (_this.selected && !_this.settings.multiple) {
            return _this.list.scrollToChoice(_this.selected);
          }
        } else {
          return _this.list.setTranslate(0);
        }
      };
    })(this));
    SimplyBind('lastSelected', {
      updateOnBind: false,
      updateEvenIfSame: true
    }).of(this).to((function(_this) {
      return function(newChoice, prevChoice) {
        return _this._selectedCallback(newChoice, prevChoice);
      };
    })(this));
    SimplyBind('focused', {
      updateOnBind: false
    }).of(this.field.state).to((function(_this) {
      return function(focused) {
        if (!focused) {
          return _this.field.el.child.input.off('keydown.dropdownNav');
        } else {
          return _this.field.el.child.input.on('keydown.dropdownNav', function(event) {
            if (_this.isOpen) {
              switch (event.keyCode) {
                case KEYCODES.up:
                  event.preventDefault();
                  return _this.highlightPrev();
                case KEYCODES.down:
                  event.preventDefault();
                  return _this.highlightNext();
                case KEYCODES.enter:
                  event.preventDefault();
                  if (_this.currentHighlighted) {
                    return _this.lastSelected = _this.currentHighlighted;
                  }
                  break;
                case KEYCODES.esc:
                  event.preventDefault();
                  return _this.isOpen = false;
              }
            }
          });
        }
      };
    })(this));
    if (!this.settings.typeBuffer) {
      return;
    }
    SimplyBind('focused', {
      updateOnBind: false
    }).of(this.field.state).to((function(_this) {
      return function(focused) {
        if (!focused) {
          return DOM(document).off('keypress.dropdownTypeBuffer');
        } else {
          return DOM(document).on('keypress.dropdownTypeBuffer', function(event) {
            if (_this.isOpen) {
              event.preventDefault();
              if (!KEYCODES.anyPrintable(event.keyCode)) {
                return;
              }
              return _this.typeBuffer += event.key;
            }
          });
        }
      };
    })(this));
    return SimplyBind('typeBuffer', {
      updateOnBind: false
    }).of(this).to((function(_this) {
      return function() {
        clearTimeout(_this.typeBufferTimeout);
        return _this.typeBufferTimeout = setTimeout(function() {
          return _this.typeBuffer = '';
        }, 1500);
      };
    })(this)).and.to((function(_this) {
      return function(buffer) {
        var choice, i, len, ref;
        if (buffer) {
          ref = _this.visibleChoices;
          for (i = 0, len = ref.length; i < len; i++) {
            choice = ref[i];
            if (helpers.startsWith(buffer, choice.label)) {
              _this.currentHighlighted = choice;
              if (!_this.list.choiceInView(choice)) {
                _this.list.scrollToChoice(choice);
              }
              return;
            }
          }
        }
      };
    })(this));
  };

  Dropdown.prototype._attachBindings_scrollIndicators = function() {
    SimplyBind('scrollTop', {
      updateEvenIfSame: true
    }).of(this.els.list.raw).to((function(_this) {
      return function(scrollTop) {
        var showBottomIndicator, showTopIndicator;
        showTopIndicator = scrollTop > 0;
        showBottomIndicator = _this.els.list.raw.scrollHeight - _this.els.list.raw.clientHeight > scrollTop;
        _this.els.scrollIndicatorUp.state('visible', showTopIndicator);
        return _this.els.scrollIndicatorDown.state('visible', showBottomIndicator);
      };
    })(this)).condition((function(_this) {
      return function() {
        return _this.isOpen && !_this.settings.help && _this.els.list.raw.scrollHeight !== _this.els.list.raw.clientHeight && _this.els.list.raw.clientHeight >= 100;
      };
    })(this)).updateOn('event:scroll').of(this.els.list.raw).updateOn('isOpen').of(this);
    this.els.scrollIndicatorUp.on('mouseenter', (function(_this) {
      return function() {
        return _this.list.startScrolling('up');
      };
    })(this));
    this.els.scrollIndicatorUp.on('mouseleave', (function(_this) {
      return function() {
        return _this.list.stopScrolling();
      };
    })(this));
    this.els.scrollIndicatorDown.on('mouseenter', (function(_this) {
      return function() {
        return _this.list.startScrolling('down');
      };
    })(this));
    return this.els.scrollIndicatorDown.on('mouseleave', (function(_this) {
      return function() {
        return _this.list.stopScrolling();
      };
    })(this));
  };

  Dropdown.prototype.addChoice = function(config) {
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
    this.choices.push(newChoice);
    return newChoice;
  };

  Dropdown.prototype.appendTo = function(target) {
    return this.els.container.appendTo(target);
  };

  Dropdown.prototype.onSelected = function(callback) {
    return this._selectedCallback = callback;
  };

  Dropdown.prototype.findChoice = function(providedValue, byLabel) {
    var matches;
    matches = this.choices.filter(function(choice) {
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
  };

  Dropdown.prototype.findChoiceAny = function(providedValue) {
    return this.findChoice(providedValue) || this.findChoice(providedValue, true);
  };

  Dropdown.prototype.highlightPrev = function() {
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
  };

  Dropdown.prototype.highlightNext = function() {
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
  };

  return Dropdown;

})();

List = (function() {
  function List(dropdown) {
    var ref;
    this.dropdown = dropdown;
    this.choiceInView = bind(this.choiceInView, this);
    ref = this.dropdown, this.els = ref.els, this.field = ref.field, this.settings = ref.settings;
    this.el = this.els.list;
    this.container = this.els.container;
  }

  List.prototype.calcDisplay = function() {
    var bottomCutoff, clippingParent, clippingRect, cutoff, height, isBottomCutoff, isTopCutoff, needsNewHeight, padding, scrollHeight, selfRect, topCutoff, translation, windowCutoff, windowHeight;
    windowHeight = window.innerHeight;
    translation = this.translation || 0;
    clippingParent = this.container.parentMatching(function(parent) {
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
        console.warn("The dropdown for element '" + this.field.ID + "' cannot be displayed as it's hidden by the parent overflow");
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
    windowCutoff = (selfRect.top + height) - windowHeight;
    if (windowCutoff > 0 && height < windowHeight) {
      translation += windowCutoff + 10;
    }
    this.setDimensions(height, this.field.el.child.innerwrap.width + 10);
    return this.setTranslate(translation);
  };

  List.prototype.setDimensions = function(height, width) {
    if (height != null) {
      this.el.style('maxHeight', height);
    }
    if (width != null) {
      return this.el.style('minWidth', width);
    }
  };

  List.prototype.setTranslate = function(translation) {
    this.translation = translation;
    translation *= -1;
    return this.container.style('transform', "translateY(" + translation + "px)");
  };

  List.prototype.scrollToChoice = function(choice, offset) {
    var distaneFromTop, selectedHeight;
    if (offset == null) {
      offset = 3;
    }
    distaneFromTop = choice.el.raw.offsetTop;
    selectedHeight = choice.el.height;
    return this.el.raw.scrollTop = distaneFromTop - selectedHeight * offset;
  };

  List.prototype.scrollDown = function(choice) {
    return this.el.raw.scrollTop += choice.el.height;
  };

  List.prototype.scrollUp = function(choice) {
    return this.el.raw.scrollTop -= choice.el.height;
  };

  List.prototype.choiceInView = function(choice) {
    var choiceRect, downPadding, listRect, upPadding;
    choiceRect = choice.el.rect;
    listRect = this.el.rect;
    upPadding = this.els.scrollIndicatorUp.state('visible') ? parseFloat(this.els.scrollIndicatorUp.styleSafe('height', true)) : void 0;
    downPadding = this.els.scrollIndicatorDown.state('visible') ? parseFloat(this.els.scrollIndicatorDown.styleSafe('height', true)) : void 0;
    return choiceRect.bottom <= listRect.bottom - downPadding && choiceRect.top >= listRect.top + upPadding;
  };

  List.prototype.startScrolling = function(direction) {
    return this.scrollIntervalID = setInterval((function(_this) {
      return function() {
        return _this.el.raw.scrollTop += direction === 'up' ? -20 : 20;
      };
    })(this), 50);
  };

  List.prototype.stopScrolling = function() {
    return clearInterval(this.scrollIntervalID);
  };

  return List;

})();

Choice = (function() {
  function Choice(dropdown, settings, list, index) {
    var ref, ref1;
    this.dropdown = dropdown;
    this.settings = settings;
    this.list = list;
    this.index = index;
    ref = this.settings, this.label = ref.label, this.value = ref.value, this.conditions = ref.conditions;
    if (this.label == null) {
      this.label = this.value;
    }
    if (this.value == null) {
      this.value = this.label;
    }
    this.field = this.dropdown.field;
    this.el = this.dropdown.template.choice.spawn(null, {
      relatedInstance: this.dropdown
    }).appendTo(this.list.el);
    this.el.children[1].text = this.label;
    this.visible = true;
    this.selected = false;
    this.unavailable = false;
    this._attachBindings();
    if ((ref1 = this.conditions) != null ? ref1.length : void 0) {
      this.unavailable = true;
      this.allFields = this.field.allFields;
      Condition.init(this, this.conditions, (function(_this) {
        return function() {
          return _this.unavailable = !Condition.validate(_this.conditions);
        };
      })(this));
    }
  }

  Choice.prototype._attachBindings = function() {
    return (function(_this) {
      return function() {
        SimplyBind('visible').of(_this).to(function(visible, prev) {
          _this.dropdown.visibleChoicesCount += visible ? 1 : -1;
          _this.el.state('visible', visible);
          if (visible) {
            _this.dropdown.visibleChoices.push(_this);
            if (IS.defined(prev)) {
              return _this.dropdown.visibleChoices.sort(function(a, b) {
                return a.index - b.index;
              });
            }
          } else {
            return helpers.removeItem(_this.dropdown.visibleChoices, _this);
          }
        });
        SimplyBind('selected', {
          updateOnBind: false
        }).of(_this).to(function(selected) {
          return _this.el.state('selected', selected);
        });
        SimplyBind('unavailable', {
          updateOnBind: false
        }).of(_this).to(function(unavailable) {
          return _this.el.state('unavailable', unavailable);
        }).and.to(function(unavailable) {
          if (unavailable) {
            return _this.toggle(false, true);
          }
        });
        SimplyBind('event:click').of(_this.el).to(function() {
          return _this.dropdown.lastSelected = _this;
        });
        SimplyBind('event:mousedown').of(_this.el).to(function(event) {
          event.preventDefault();
          return event.stopPropagation();
        });
        return SimplyBind('event:mouseenter').of(_this.el).to(function() {
          return _this.dropdown.currentHighlighted = _this;
        });
      };
    })(this)();
  };

  Choice.prototype.toggle = function(newValue, unavailable) {
    var newState, prevState, ref;
    prevState = this.selected;
    newState = IS.defined(newValue) ? newValue : !this.selected;
    if (!newState) {
      if (this.dropdown.settings.multiple && prevState) {
        this.selected = newState;
        return helpers.removeItem(this.field._value, this);
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
        if ((ref = this.field._value) != null) {
          ref.toggle(false);
        }
        this.field._value = this;
      }
      return this.field.lastSelected = this;
    }
  };

  return Choice;

})();

module.exports = Dropdown;

module.exports.Choice = Choice;

;
return module.exports;
},
33: function (require, module, exports) {
var IS, Mask, REGEX, SimplyBind, defaultPatternChars, extend, helpers, maskAddons, maskCore;

SimplyBind = require(11);

maskCore = require(64);

maskAddons = require(65);

extend = require(4);

IS = require(3);

REGEX = require(12);

helpers = require(1);

defaultPatternChars = {
  '1': REGEX.numeric,
  '#': REGEX.widenumeric,
  'a': REGEX.letter,
  '*': REGEX.any
};

Mask = (function() {
  function Mask(field, config) {
    this.field = field;
    this.config = config;
    this.value = '';
    this.prevValue = '';
    this.cursor = 0;
    this.prevCursor = 0;
    this.pattern = this.patternRaw = this.config.pattern;
    this.patternSetter = this.config.setter;
    this.placeholderChar = this.config.placeholder;
    this.placeholderRegex = new RegExp('\\' + (this.placeholderChar || '_'), 'g');
    this.guide = this.config.guide;
    this.keepCharPositions = this.config.keepCharPositions;
    this.chars = extend.clone(defaultPatternChars, this.config.customPatterns);
    this.setPattern(this.pattern);
  }

  Mask.prototype.getState = function(pattern, rawValue) {
    return {
      rawValue: rawValue,
      guide: this.guide,
      placeholderChar: this.placeholderChar,
      keepCharPositions: this.keepCharPositions,
      currentCaretPosition: this.field.el ? this.field.selection().end : this.cursor,
      previousConformedValue: this.prevValue,
      placeholder: this.getPlaceholder(pattern)
    };
  };

  Mask.prototype.getPlaceholder = function(pattern) {
    var char, j, len, placeholder;
    if (IS["function"](pattern)) {

    } else {
      placeholder = '';
      for (j = 0, len = pattern.length; j < len; j++) {
        char = pattern[j];
        if (IS.regex(char)) {
          placeholder += this.placeholderChar;
        } else {
          placeholder += char;
        }
      }
      return placeholder;
    }
  };

  Mask.prototype.resolvePattern = function(pattern, input, state) {
    var char, copy, i, j, len, offset, trapIndexes;
    pattern = typeof pattern === 'function' ? pattern(input, this.getState(pattern, input)) : pattern;
    offset = 0;
    trapIndexes = [];
    copy = pattern.slice();
    for (i = j = 0, len = copy.length; j < len; i = ++j) {
      char = copy[i];
      if (!(char === '[]')) {
        continue;
      }
      trapIndexes.push(i - offset);
      pattern.splice(i - offset, 1);
      offset++;
    }
    this.prevPattern = this.resolvedPattern;
    this.resolvedPattern = pattern;
    return {
      pattern: pattern,
      caretTrapIndexes: trapIndexes
    };
  };

  Mask.prototype.setPattern = function(string, updateValue, updateField) {
    if (updateValue == null) {
      updateValue = true;
    }
    this.patternRaw = string;
    this.pattern = this.parsePattern(string);
    this.transform = this.parseTransform(string);
    if (updateValue) {
      this.value = this.setValue(this.value);
      if (updateField) {
        return this.field.value = this.value;
      }
    }
  };

  Mask.prototype.parsePattern = function(string) {
    var char, escaped, i, j, len, pattern;
    switch (false) {
      case string !== 'EMAIL':
        return maskAddons.emailMask.mask;
      case string !== 'PHONE':
        this.patternSetter = function(value) {
          return helpers.repeat('#', Math.max(7, value.length));
        };
        this.guide = false;
        return '#';
      case string !== 'NAME':
        this.patternSetter = function(value) {
          value = value.replace(this.placeholderRegex, '').trim();
          return helpers.repeat('a', Math.max(2, value.length));
        };
        return 'a';
      case string !== 'FULLNAME':
        this.patternSetter = function(value) {
          var split;
          if (value[value.length - 1] === ' ') {
            value += 'x';
          }
          split = value.replace(this.placeholderRegex, '').trim().split(/\s+/);
          if (split.length === 4) {
            return;
          }
          return split.map(function(part) {
            return helpers.repeat('a', Math.max(2, part.length));
          }).join(' ');
        };
        return 'a';
      case string !== 'DATE':
        return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
      case !(string[0] === 'DATE' && IS.string(string[1])):
        return string[1].split('').map((function(_this) {
          return function(char) {
            if (REGEX.letter.test(char)) {
              return /\d/;
            } else {
              return char;
            }
          };
        })(this));
      case string !== 'NUMBER':
        return maskAddons.createNumberMask({
          prefix: this.config.prefix || '',
          suffix: this.config.suffix || '',
          includeThousandsSeparator: this.config.sep ? true : false,
          thousandsSeparatorSymbol: IS.string(this.config.sep) ? this.config.sep : void 0,
          allowDecimal: this.config.decimal,
          decimalLimit: IS.number(this.config.decimal) ? this.config.decimal : void 0,
          integerLimit: IS.number(this.config.limit) ? this.config.limit : void 0
        });
      case !IS.array(string):
        return string;
      default:
        pattern = [];
        for (i = j = 0, len = string.length; j < len; i = ++j) {
          char = string[i];
          if (char === '\\') {
            escaped = true;
            continue;
          }
          pattern.push(escaped ? char : this.chars[char] || char);
          escaped = false;
        }
        return pattern;
    }
  };

  Mask.prototype.parseTransform = function(string) {
    switch (false) {
      case string !== 'EMAIL':
        return maskAddons.emailMask.pipe;
      case string !== 'DATE':
        return maskAddons.createAutoCorrectedDatePipe('mm/dd/yyyy');
      case !(string[0] === 'DATE' && IS.string(string[1])):
        return maskAddons.createAutoCorrectedDatePipe(string[1]);
      case !this.config.transform:
        return this.config.transform;
    }
  };

  Mask.prototype.setValue = function(input) {
    var caretTrapIndexes, conformedValue, indexesOfPipedChars, newPattern, pattern, ref, state, transformed;
    if (this.patternSetter) {
      newPattern = this.patternSetter(input) || this.pattern;
      if (newPattern !== this.patternRaw && newPattern !== this.pattern) {
        this.setPattern(newPattern, false);
      }
    }
    ref = this.resolvePattern(this.pattern, input), caretTrapIndexes = ref.caretTrapIndexes, pattern = ref.pattern;
    if (pattern === false) {
      return this.value;
    }
    this.prevValue = this.value;
    this.prevCursor = this.cursor;
    state = this.getState(pattern, input);
    conformedValue = maskCore.conformToMask(input, pattern, state).conformedValue;
    if (this.transform) {
      transformed = this.transform(conformedValue, state);
    }
    if (transformed === false) {
      return this.value;
    }
    if (IS.string(transformed)) {
      conformedValue = transformed;
    } else if (IS.object(transformed)) {
      indexesOfPipedChars = transformed.indexesOfPipedChars;
      conformedValue = transformed.value;
    }
    this.cursor = maskCore.adjustCaretPosition(extend(state, {
      indexesOfPipedChars: indexesOfPipedChars,
      caretTrapIndexes: caretTrapIndexes,
      conformedValue: conformedValue
    }));
    return this.value = conformedValue;
  };

  Mask.prototype.validate = function(input) {
    var char, i, j, len, pattern;
    if (input !== this.value && this.patternSetter) {
      pattern = this.patternSetter(input) || this.pattern;
    } else {
      pattern = this.resolvedPattern;
      if (!pattern) {
        pattern = this.resolvePattern(this.pattern, input).pattern;
      }
    }
    if (pattern === false) {
      return true;
    }
    for (i = j = 0, len = pattern.length; j < len; i = ++j) {
      char = pattern[i];
      switch (false) {
        case !!input[i]:
          return false;
        case !(IS.regex(char) && !char.test(input[i])):
          return false;
        case !(IS.string(char) && input[i] !== char):
          return false;
      }
    }
    return true;
  };

  Mask.prototype.isEmpty = function() {
    var char, i, input, j, len, pattern;
    input = this.value;
    pattern = this.resolvedPattern;
    if (!pattern) {
      if (this.patternSetter) {
        pattern = this.patternSetter(input);
      }
      pattern = this.resolvePattern(pattern || this.pattern, input).pattern;
    }
    if (input === this.config.prefix || input === this.config.suffix) {
      return true;
    }
    for (i = j = 0, len = pattern.length; j < len; i = ++j) {
      char = pattern[i];
      switch (false) {
        case !!input[i]:
          return true;
        case !IS.regex(char):
          return !char.test(input[i]);
      }
    }
    return false;
  };

  return Mask;

})();

module.exports = Mask;

;
return module.exports;
},
34: function (require, module, exports) {
var keyCodes;

module.exports = keyCodes = {
  "delete": 8,
  enter: 13,
  esc: 27,
  ctrl: 17,
  alt: 18,
  shift: 16,
  "super": 91,
  super2: 93,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  hyphen: 45,
  underscore: 95,
  question: 63,
  exclamation: 33,
  frontslash: 47,
  backslash: 92,
  comma: 44,
  period: 46,
  space: 32,
  anyArrow: function(code) {
    return code === keyCodes.up || code === keyCodes.down || code === keyCodes.left || code === keyCodes.right;
  },
  anyModifier: function(code) {
    return code === keyCodes.ctrl || code === keyCodes.alt || code === keyCodes.shift || code === keyCodes["super"] || code === keyCodes.super2;
  },
  anyAlpha: function(code) {
    return (97 <= code && code <= 122) || (65 <= code && code <= 90);
  },
  anyNumeric: function(code) {
    return (48 <= code && code <= 57);
  },
  anyAlphaNumeric: function(code) {
    return keyCodes.anyAlpha(code) || keyCodes.anyNumeric(code);
  },
  anyPrintable: function(code) {
    return keyCodes.anyAlpha(code) || keyCodes.anyNumeric(code) || code === keyCodes.hyphen || code === keyCodes.underscore || code === keyCodes.question || code === keyCodes.exclamation || code === keyCodes.frontslash || code === keyCodes.backslash || code === keyCodes.comma || code === keyCodes.period || code === keyCodes.space;
  }
};

;
return module.exports;
},
35: function (require, module, exports) {
var CHECKMARK_WIDTH, COLORS, DOM, helpers;

DOM = require(2);

helpers = require(1);

COLORS = require(66);

CHECKMARK_WIDTH = 26;

exports.default = DOM.template([
  'div', {
    ref: 'field',
    style: {
      position: 'relative',
      verticalAlign: 'top',
      display: 'none',
      boxSizing: 'border-box',
      fontFamily: function(field) {
        return field.settings.fontFamily;
      },
      textAlign: 'left',
      $visible: {
        display: 'inline-block'
      },
      $showError: {
        animation: '0.2s fieldErrorShake'
      }
    }
  }, [
    'div', {
      ref: 'label',
      styleAfterInsert: true,
      style: {
        position: 'absolute',
        zIndex: 1,
        top: function(field) {
          return this.styleParsed('fontSize', true) * 0.7;
        },
        left: function(field) {
          var ref;
          return helpers.shorthandSideValue(field.settings.padding, 'left') + (((ref = field.el.child.icon) != null ? ref.width : void 0) || 0);
        },
        padding: function(field) {
          return "0 " + field.settings.inputPadding + "px";
        },
        fontFamily: 'inherit',
        fontSize: function(field) {
          return field.settings.labelSize || field.settings.fontSize * (11 / 14);
        },
        fontWeight: 600,
        lineHeight: 1,
        color: COLORS.grey,
        opacity: 0,
        transition: 'opacity 0.2s, color 0.2s',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        cursor: 'default',
        pointerEvents: 'none',
        $filled: {
          $showLabel: {
            opacity: 1
          }
        },
        $focus: {
          color: COLORS.orange
        },
        $showError: {
          color: COLORS.red
        }
      }
    }
  ], [
    'div', {
      ref: 'innerwrap',
      style: {
        position: 'relative',
        height: function(field) {
          return field.settings.height;
        },
        backgroundColor: 'white',
        borderWidth: function(field) {
          return field.settings.border;
        },
        borderStyle: 'solid',
        borderColor: COLORS.grey_light,
        borderRadius: '2px',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        transition: 'border-color 0.2s',
        $focus: {
          borderColor: COLORS.orange
        },
        $showError: {
          borderColor: COLORS.red
        },
        $disabled: {
          borderColor: COLORS.grey_light,
          backgroundColor: COLORS.grey_light
        }
      }
    }, [
      'input', {
        ref: 'input',
        type: 'text',
        styleAfterInsert: true,
        style: {
          position: 'relative',
          zIndex: 3,
          display: 'inline-block',
          verticalAlign: 'top',
          height: function() {
            return this.parent.styleSafe('height', 1) || this.parent.styleSafe('height');
          },
          width: function(field) {
            var iconSibling, inputSibling, padding, paddingLeft, paddingRight, subtract, width;
            if (!field.settings.autoWidth) {
              subtract = 0;
              if (iconSibling = field.el.child.icon) {
                subtract += iconSibling.width;
              }
              if (inputSibling = field.el.child[field.settings.inputSibling]) {
                width = inputSibling.styleParsed('width', 1) || 0;
                padding = inputSibling.styleParsed('padding', 1) || 0;
                paddingLeft = inputSibling.styleParsed('paddingLeft', 1) || padding || 0;
                paddingRight = inputSibling.styleParsed('paddingRight', 1) || padding || 0;
                subtract += width + paddingLeft + paddingRight;
              }
              return "calc(100% - " + subtract + "px)";
            }
          },
          padding: function(field) {
            if (this.padding == null) {
              this.padding = Math.max(0, helpers.calcPadding(field.settings.height, 14) - 3);
            }
            return this.padding + "px " + field.settings.inputPadding + "px";
          },
          margin: '0',
          backgroundColor: 'transparent',
          appearance: 'none',
          border: 'none',
          outline: 'none',
          fontFamily: 'inherit',
          fontSize: function(field) {
            return field.settings.fontSize;
          },
          color: COLORS.black,
          boxSizing: 'border-box',
          boxShadow: 'none',
          whiteSpace: 'nowrap',
          backgroundClip: 'content-box',
          transform: 'translateY(0)',
          transition: 'transform 0.2s, -webkit-transform 0.2s',
          $disabled: {
            cursor: 'not-allowed'
          },
          $filled: {
            $showLabel: {
              transform: function(field) {
                var label, totalHeight, translation, workableHeight;
                if ((this.translation != null) || !(label = field.el.child.label) || label.styleSafe('position', 1) !== 'absolute') {
                  return this.translation;
                }
                totalHeight = this.parent.styleParsed('height', 1);
                workableHeight = totalHeight - (label.styleParsed('fontSize', 1) + label.styleParsed('top', 1) * 2);
                translation = Math.max(0, Math.floor((totalHeight - workableHeight) / 4));
                return "translateY(" + translation + "px)";
              }
            }
          }
        }
      }
    ], [
      'div', {
        ref: 'placeholder',
        styleAfterInsert: true,
        style: {
          position: 'absolute',
          zIndex: 2,
          top: '0px',
          left: function(field) {
            var ref;
            return ((ref = field.el.child.icon) != null ? ref.width : void 0) || 0;
          },
          fontFamily: function(field) {
            return field.el.child.input.styleSafe('fontFamily', 1);
          },
          fontSize: function(field) {
            return field.el.child.input.styleSafe('fontSize', 1);
          },
          padding: function(field) {
            var horiz, verti;
            verti = field.el.child.input.styleParsed('paddingTop', 1) || field.el.child.input.styleParsed('paddingTop');
            horiz = field.el.child.input.styleParsed('paddingLeft', 1) || field.el.child.input.styleParsed('paddingLeft');
            return (verti + 3) + "px " + horiz + "px";
          },
          color: COLORS.black,
          opacity: 0.5,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          transform: 'translateY(0)',
          transition: 'transform 0.2s, -webkit-transform 0.2s',
          $filled: {
            visibility: 'hidden',
            $showLabel: {
              transform: function(field) {
                return field.el.child.input.raw.style.transform;
              }
            }
          }
        }
      }
    ]
  ], [
    'div', {
      ref: 'help',
      styleAfterInsert: true,
      style: {
        position: 'absolute',
        bottom: function() {
          return (this.styleParsed('fontSize', 1) + 10) * -1;
        },
        left: function(field) {
          return helpers.shorthandSideValue(field.settings.padding, 'left');
        },
        fontFamily: 'inherit',
        fontSize: '11px',
        color: COLORS.grey,
        display: 'none',
        $showError: {
          color: COLORS.red
        },
        $showHelp: {
          display: 'block'
        }
      }
    }
  ]
]);

var icon = DOM.template([
  'div', {
    ref: 'icon',
    styleAfterInsert: true,
    style: {
      position: 'relative',
      zIndex: 2,
      display: 'inline-block',
      boxSizing: 'border-box',
      width: function(field) {
        return field.settings.iconSize;
      },
      height: function(field) {
        return field.settings.iconSize;
      },
      fontSize: function(field) {
        return field.settings.iconSize;
      },
      paddingLeft: function(field) {
        return field.settings.inputPadding;
      },
      paddingTop: function(field) {
        return this.parent.styleParsed('height', 1) / 2 - field.settings.iconSize / 2;
      },
      lineHeight: '1em',
      userSelect: 'none'
    },
    methods: {
      width: {
        get: function() {
          if (this._inserted) {
            return this.raw.offsetWidth;
          } else {
            return this.styleParsed('width', 1) || this.related.settings.iconSize;
          }
        }
      }
    }
  }
]);
exports.icon = icon; 

var checkmark = DOM.template([
  'div', {
    ref: 'checkmark',
    styleAfterInsert: true,
    style: {
      position: 'relative',
      zIndex: 4,
      display: 'none',
      width: 26,
      height: '100%',
      paddingTop: function() {
        return this.parent.styleParsed('height', 1) / 2 - 13;
      },
      paddingRight: function(field) {
        return field.settings.inputPadding;
      },
      verticalAlign: 'top',
      $filled: {
        display: 'inline-block'
      }
    }
  }, [
    'div', {
      ref: 'checkmark_innerwrap',
      style: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: COLORS.green,
        transform: 'scale(0.8)',
        $showError: {
          borderColor: COLORS.red
        }
      }
    }, [
      'div', {
        ref: 'checkmark_mask1',
        styleAfterInsert: true,
        style: {
          position: 'absolute',
          top: '-4px',
          left: '-10px',
          width: '15px',
          height: '30px',
          borderRadius: '30px 0 0 30px',
          backgroundColor: function(field) {
            return helpers.defaultColor(field.els.innerwrap.styleSafe('backgroundColor', 1), 'white');
          },
          transform: 'rotate(-45deg)',
          transformOrigin: '15px 15px 0'
        }
      }
    ], [
      'div', {
        ref: 'checkmark_mask2',
        styleAfterInsert: true,
        style: {
          position: 'absolute',
          top: '-5px',
          left: '8px',
          width: '15px',
          height: '30px',
          borderRadius: '0 30px 30px 0',
          backgroundColor: function(field) {
            return helpers.defaultColor(field.els.innerwrap.styleSafe('backgroundColor', 1), 'white');
          },
          transform: 'rotate(-45deg)',
          transformOrigin: '0 15px 0',
          $filled: {
            animation: '4.25s ease-in checkmarkRotatePlaceholder',
            $invalid: {
              animation: ''
            }
          }
        }
      }
    ], [
      'div', {
        ref: 'checkmark_lineWrapper',
        style: {
          $filled: {
            $invalid: {
              position: 'relative',
              zIndex: 2,
              animation: '0.55s checkmarkAnimateError',
              transformOrigin: '50% 10px'
            }
          }
        }
      }, [
        'div', {
          ref: 'checkmark_lineShort',
          style: {
            position: 'absolute',
            zIndex: 2,
            top: '10px',
            left: '3px',
            display: 'block',
            width: '8px',
            height: '3px',
            borderRadius: '2px',
            backgroundColor: COLORS.green,
            transform: 'rotate(45deg)',
            $filled: {
              animation: '0.75s checkmarkAnimateSuccessTip'
            },
            $invalid: {
              backgroundColor: COLORS.red,
              left: '4px',
              top: '8px',
              width: '12px',
              $filled: {
                animation: ''
              }
            }
          }
        }
      ], [
        'div', {
          ref: 'checkmark_lineLong',
          style: {
            position: 'absolute',
            zIndex: 2,
            top: '8px',
            right: '2px',
            display: 'block',
            width: '12px',
            height: '3px',
            borderRadius: '2px',
            backgroundColor: COLORS.green,
            transform: 'rotate(-45deg)',
            $filled: {
              animation: '0.75s checkmarkAnimateSuccessLong'
            },
            $invalid: {
              backgroundColor: COLORS.red,
              top: '8px',
              left: '4px',
              right: 'auto',
              $filled: {
                animation: ''
              }
            }
          }
        }
      ]
    ], [
      'div', {
        ref: 'checkmark_placeholder',
        style: {
          position: 'absolute',
          zIndex: 2,
          top: '-4px',
          left: '-3px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          borderWidth: '3px',
          borderStyle: 'solid',
          borderColor: helpers.hexToRGBA(COLORS.green, 0.4),
          $invalid: {
            borderColor: helpers.hexToRGBA(COLORS.red, 0.4)
          }
        }
      }
    ], [
      'div', {
        ref: 'checkmark_patch',
        styleAfterInsert: true,
        style: {
          position: 'absolute',
          zIndex: 1,
          top: '-2px',
          left: '6px',
          width: '4px',
          height: '28px',
          backgroundColor: function(field) {
            return helpers.defaultColor(field.els.innerwrap.styleSafe('backgroundColor', 1), 'white');
          },
          transform: 'rotate(-45deg)'
        }
      }
    ]
  ]
]);
exports.checkmark = checkmark; 

;
return module.exports;
},
36: function (require, module, exports) {
module.exports = {
  placeholder: true,
  validWhenIsChoice: false,
  validWhenRegex: false,
  autoWidth: false,
  maxWidth: '100%',
  minWidth: 2,
  height: 46,
  checkmark: true,
  keyboard: 'text',
  dropdown: {
    lockScroll: false
  },
  choices: null,
  minLength: null,
  maxLength: null,
  inputSibling: 'checkmark',
  mask: {
    pattern: false,
    placeholder: '_',
    guide: true,
    customPatterns: false
  }
};

;
return module.exports;
},
42: function (require, module, exports) {
exports.REGEX_LEN_VAL = /^\d+(?:[a-z]|\%)+$/i;

exports.REGEX_DIGITS = /\d+$/;

exports.REGEX_SPACE = /\s/;

exports.REGEX_KEBAB = /([A-Z])+/g;

exports.IMPORTANT = 'important';

exports.POSSIBLE_PREFIXES = ['webkit', 'moz', 'ms', 'o'];

exports.REQUIRES_UNIT_VALUE = ['background-position-x', 'background-position-y', 'block-size', 'border-width', 'columnRule-width', 'cx', 'cy', 'font-size', 'grid-column-gap', 'grid-row-gap', 'height', 'inline-size', 'line-height', 'minBlock-size', 'min-height', 'min-inline-size', 'min-width', 'max-height', 'max-width', 'outline-offset', 'outline-width', 'perspective', 'shape-margin', 'stroke-dashoffset', 'stroke-width', 'text-indent', 'width', 'word-spacing', 'top', 'bottom', 'left', 'right', 'x', 'y'];

exports.QUAD_SHORTHANDS = ['margin', 'padding', 'border', 'border-radius'];

exports.DIRECTIONS = ['top', 'bottom', 'left', 'right'];

exports.QUAD_SHORTHANDS.forEach(function(property) {
  var direction, i, len, ref;
  exports.REQUIRES_UNIT_VALUE.push(property);
  ref = exports.DIRECTIONS;
  for (i = 0, len = ref.length; i < len; i++) {
    direction = ref[i];
    exports.REQUIRES_UNIT_VALUE.push(property + '-' + direction);
  }
});

;
return module.exports;
},
43: function (require, module, exports) {
var constants, helpers, sampleStyle, styleConfig;

constants = require(42);

sampleStyle = document.createElement('div').style;

helpers = exports;

helpers.includes = function(target, item) {
  return target && target.indexOf(item) !== -1;
};

helpers.isIterable = function(target) {
  return target && typeof target === 'object' && typeof target.length === 'number' && !target.nodeType;
};

helpers.toKebabCase = function(string) {
  return string.replace(constants.REGEX_KEBAB, function(e, letter) {
    return "-" + (letter.toLowerCase());
  });
};

helpers.isPropSupported = function(property) {
  return typeof sampleStyle[property] !== 'undefined';
};

helpers.isValueSupported = function(property, value) {
  if (window.CSS && window.CSS.supports) {
    return window.CSS.supports(property, value);
  } else {
    sampleStyle[property] = value;
    return sampleStyle[property] === '' + value;
  }
};

helpers.getPrefix = function(property, skipInitialCheck) {
  var j, len1, prefix, ref;
  if (skipInitialCheck || !helpers.isPropSupported(property)) {
    ref = constants.POSSIBLE_PREFIXES;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      prefix = ref[j];

      /* istanbul ignore next */
      if (helpers.isPropSupported("-" + prefix + "-" + property)) {
        return "-" + prefix + "-";
      }
    }
  }
  return '';
};

helpers.normalizeProperty = function(property) {
  property = helpers.toKebabCase(property);
  if (helpers.isPropSupported(property)) {
    return property;
  } else {
    return "" + (helpers.getPrefix(property, true)) + property;
  }
};

helpers.normalizeValue = function(property, value) {
  if (helpers.includes(constants.REQUIRES_UNIT_VALUE, property) && value !== null) {
    value = '' + value;
    if (constants.REGEX_DIGITS.test(value) && !constants.REGEX_LEN_VAL.test(value) && !constants.REGEX_SPACE.test(value)) {
      value += property === 'line-height' ? 'em' : 'px';
    }
  }
  return value;
};

helpers.sort = function(array) {
  var great, i, len, less, pivot;
  if (array.length < 2) {
    return array;
  } else {
    pivot = array[0];
    less = [];
    great = [];
    len = array.length;
    i = 0;
    while (++i !== len) {
      if (array[i] <= pivot) {
        less.push(array[i]);
      } else {
        great.push(array[i]);
      }
    }
    return helpers.sort(less).concat(pivot, helpers.sort(great));
  }
};

helpers.hash = function(string) {
  var hash, i, length;
  hash = 5381;
  i = -1;
  length = string.length;
  while (++i !== string.length) {
    hash = ((hash << 5) - hash) + string.charCodeAt(i);
    hash |= 0;
  }
  return '_' + (hash < 0 ? hash * -2 : hash);
};

helpers.ruleToString = function(rule, important) {
  var j, len1, output, prop, property, props, value;
  output = '';
  props = helpers.sort(Object.keys(rule));
  for (j = 0, len1 = props.length; j < len1; j++) {
    prop = props[j];
    if (typeof rule[prop] === 'string' || typeof rule[prop] === 'number') {
      property = helpers.normalizeProperty(prop);
      value = helpers.normalizeValue(property, rule[prop]);
      if (important) {
        value += " !important";
      }
      output += property + ":" + value + ";";
    }
  }
  return output;
};

helpers.inlineStyleConfig = styleConfig = Object.create(null);

helpers.inlineStyle = function(rule, valueToStore, level) {
  var config, styleEl;
  if (!(config = styleConfig[level])) {
    styleEl = document.createElement('style');
    styleEl.id = "quickcss" + (level || '');
    document.head.appendChild(styleEl);
    styleConfig[level] = config = {
      el: styleEl,
      content: '',
      cache: Object.create(null)
    };
  }
  if (!config.cache[rule]) {
    config.cache[rule] = valueToStore || true;
    config.el.textContent = config.content += rule;
  }
};

helpers.clearInlineStyle = function(level) {
  var config, j, key, keys, len1;
  if (config = styleConfig[level]) {
    if (!config.content) {
      return;
    }
    config.el.textContent = config.content = '';
    keys = Object.keys(config.cache);
    for (j = 0, len1 = keys.length; j < len1; j++) {
      key = keys[j];
      config.cache[key] = null;
    }
  }
};

;
return module.exports;
},
57: function (require, module, exports) {
var exports;

module.exports = exports = {
  defined: function(subject) {
    return subject !== void 0;
  },
  array: function(subject) {
    return subject instanceof Array;
  },
  object: function(subject) {
    return typeof subject === 'object' && subject;
  },
  objectPlain: function(subject) {
    return exports.object(subject) && Object.prototype.toString.call(subject) === '[object Object]' && subject.constructor === Object;
  },
  string: function(subject) {
    return typeof subject === 'string';
  },
  number: function(subject) {
    return typeof subject === 'number' && !isNaN(subject);
  },
  numberLoose: function(subject) {
    return exports.number(subject) || exports.string(subject) && exports.number(Number(subject));
  },
  "function": function(subject) {
    return typeof subject === 'function';
  },
  iterable: function(subject) {
    return exports.object(subject) && exports.number(subject.length);
  }
};

;
return module.exports;
},
58: function (require, module, exports) {
var exports;

module.exports = exports = {
  domDoc: function(subject) {
    return subject && subject.nodeType === 9;
  },
  domEl: function(subject) {
    return subject && subject.nodeType === 1;
  },
  domText: function(subject) {
    return subject && subject.nodeType === 3;
  },
  domNode: function(subject) {
    return exports.domEl(subject) || exports.domText(subject);
  },
  domTextarea: function(subject) {
    return subject && subject.nodeName === 'TEXTAREA';
  },
  domInput: function(subject) {
    return subject && subject.nodeName === 'INPUT';
  },
  domSelect: function(subject) {
    return subject && subject.nodeName === 'SELECT';
  },
  domField: function(subject) {
    return exports.domInput(subject) || exports.domTextarea(subject) || exports.domSelect(subject);
  }
};

;
return module.exports;
},
59: function (require, module, exports) {
exports.REGEX_LEN_VAL = /^\d+(?:[a-z]|\%)+$/i;

exports.REGEX_DIGITS = /\d+$/;

exports.REGEX_SPACE = /\s/;

exports.REGEX_KEBAB = /([A-Z])+/g;

exports.POSSIBLE_PREFIXES = ['webkit', 'moz', 'ms', 'o'];

exports.REQUIRES_UNIT_VALUE = ['background-position-x', 'background-position-y', 'block-size', 'border-width', 'columnRule-width', 'cx', 'cy', 'font-size', 'grid-column-gap', 'grid-row-gap', 'height', 'inline-size', 'line-height', 'minBlock-size', 'min-height', 'min-inline-size', 'min-width', 'max-height', 'max-width', 'outline-offset', 'outline-width', 'perspective', 'shape-margin', 'stroke-dashoffset', 'stroke-width', 'text-indent', 'width', 'word-spacing', 'top', 'bottom', 'left', 'right', 'x', 'y'];

exports.QUAD_SHORTHANDS = ['margin', 'padding', 'border', 'border-radius'];

exports.DIRECTIONS = ['top', 'bottom', 'left', 'right'];

exports.QUAD_SHORTHANDS.forEach(function(property) {
  var direction, i, len, ref;
  exports.REQUIRES_UNIT_VALUE.push(property);
  ref = exports.DIRECTIONS;
  for (i = 0, len = ref.length; i < len; i++) {
    direction = ref[i];
    exports.REQUIRES_UNIT_VALUE.push(property + '-' + direction);
  }
});

;
return module.exports;
},
60: function (require, module, exports) {
var constants, helpers, sampleStyle, styleConfig;

constants = require(59);

sampleStyle = document.createElement('div').style;

helpers = exports;

helpers.includes = function(target, item) {
  return target && target.indexOf(item) !== -1;
};

helpers.isIterable = function(target) {
  return target && typeof target === 'object' && typeof target.length === 'number' && !target.nodeType;
};

helpers.toKebabCase = function(string) {
  return string.replace(constants.REGEX_KEBAB, function(e, letter) {
    return "-" + (letter.toLowerCase());
  });
};

helpers.isPropSupported = function(property) {
  return typeof sampleStyle[property] !== 'undefined';
};

helpers.isValueSupported = function(property, value) {
  if (window.CSS && window.CSS.supports) {
    return window.CSS.supports(property, value);
  } else {
    sampleStyle[property] = value;
    return sampleStyle[property] === '' + value;
  }
};

helpers.getPrefix = function(property, skipInitialCheck) {
  var j, len1, prefix, ref;
  if (skipInitialCheck || !helpers.isPropSupported(property)) {
    ref = constants.POSSIBLE_PREFIXES;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      prefix = ref[j];

      /* istanbul ignore next */
      if (helpers.isPropSupported("-" + prefix + "-" + property)) {
        return "-" + prefix + "-";
      }
    }
  }
  return '';
};

helpers.normalizeProperty = function(property) {
  property = helpers.toKebabCase(property);
  if (helpers.isPropSupported(property)) {
    return property;
  } else {
    return "" + (helpers.getPrefix(property, true)) + property;
  }
};

helpers.normalizeValue = function(property, value) {
  if (helpers.includes(constants.REQUIRES_UNIT_VALUE, property) && value !== null) {
    value = '' + value;
    if (constants.REGEX_DIGITS.test(value) && !constants.REGEX_LEN_VAL.test(value) && !constants.REGEX_SPACE.test(value)) {
      value += property === 'line-height' ? 'em' : 'px';
    }
  }
  return value;
};

helpers.sort = function(array) {
  var great, i, len, less, pivot;
  if (array.length < 2) {
    return array;
  } else {
    pivot = array[0];
    less = [];
    great = [];
    len = array.length;
    i = 0;
    while (++i !== len) {
      if (array[i] <= pivot) {
        less.push(array[i]);
      } else {
        great.push(array[i]);
      }
    }
    return helpers.sort(less).concat(pivot, helpers.sort(great));
  }
};

helpers.hash = function(string) {
  var hash, i, length;
  hash = 5381;
  i = -1;
  length = string.length;
  while (++i !== string.length) {
    hash = ((hash << 5) - hash) + string.charCodeAt(i);
    hash |= 0;
  }
  return '_' + (hash < 0 ? hash * -2 : hash);
};

helpers.ruleToString = function(rule) {
  var j, len1, output, prop, property, props, value;
  output = '';
  props = helpers.sort(Object.keys(rule));
  for (j = 0, len1 = props.length; j < len1; j++) {
    prop = props[j];
    if (typeof rule[prop] === 'string' || typeof rule[prop] === 'number') {
      property = helpers.normalizeProperty(prop);
      value = helpers.normalizeValue(property, rule[prop]);
      output += property + ":" + value + ";";
    }
  }
  return output;
};

helpers.inlineStyleConfig = styleConfig = Object.create(null);

helpers.inlineStyle = function(rule, valueToStore, level) {
  var config, styleEl;
  if (!(config = styleConfig[level])) {
    styleEl = document.createElement('style');
    styleEl.id = "quickcss" + (level || '');
    document.head.appendChild(styleEl);
    styleConfig[level] = config = {
      el: styleEl,
      content: '',
      cache: Object.create(null)
    };
  }
  if (!config.cache[rule]) {
    config.cache[rule] = valueToStore || true;
    config.el.textContent = config.content += rule;
  }
};

helpers.clearInlineStyle = function(level) {
  var config, j, key, keys, len1;
  if (config = styleConfig[level]) {
    if (!config.content) {
      return;
    }
    config.el.textContent = config.content = '';
    keys = Object.keys(config.cache);
    for (j = 0, len1 = keys.length; j < len1; j++) {
      key = keys[j];
      config.cache[key] = null;
    }
  }
};

;
return module.exports;
},
62: function (require, module, exports) {
var DOM, SVG, helpers;

DOM = require(2);

SVG = require(74);

helpers = require(1);

exports.default = DOM.template([
  'div', {
    ref: 'dropdown',
    styleAfterInsert: true,
    style: {
      position: 'absolute',
      zIndex: 10,
      overflow: 'hidden',
      top: function(dropdown) {
        if (dropdown.field.type === 'text') {
          return this.parent.raw.style.height;
        } else {
          return '-7px';
        }
      },
      left: function() {
        if (this.parent.rect.left - 5 < 0) {
          return 0;
        } else {
          return -5;
        }
      },
      display: 'none',
      backgroundColor: '#f6f6f6',
      boxShadow: "0px 6px 10px " + (helpers.hexToRGBA('000000', 0.32)),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#d1d1d1',
      borderRadius: '5px',
      boxSizing: 'border-box',
      padding: '4px 0',
      $isOpen: {
        $hasVisibleChoices: {
          display: 'block'
        }
      }
    }
  }
]);

var list = DOM.template([
  'div', {
    ref: 'list',
    passStateToChildren: false,
    style: {
      position: 'relative',
      overflow: 'scroll',
      overflowScrolling: 'touch',
      overflowStyle: '-ms-autohiding-scrollbar'
    }
  }
]);
exports.list = list; 

var choice = DOM.template([
  'div', {
    style: {
      display: 'none',
      fontSize: '0',
      color: '#000000',
      userSelect: 'none',
      lineHeight: '1em',
      cursor: 'pointer',
      $visible: {
        display: 'block'
      },
      $unavailable: {
        display: 'none'
      },
      $hover: {
        color: '#ffffff',
        backgroundColor: '#4C96FF'
      }
    }
  }, [
    'div', {
      style: {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '20px',
        lineHeight: '20px',
        fontSize: '13px',
        textAlign: 'center',
        color: 'inherit',
        stroke: 'currentColor',
        visibility: 'hidden',
        $selected: {
          visibility: 'visible'
        }
      }
    }, SVG.checkmark
  ], [
    'div', {
      styleAfterInsert: true,
      style: {
        display: 'inline-block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
        maxWidth: function() {
          return "calc(100% - " + (this.prev.styleSafe('width', true)) + ")";
        },
        paddingRight: '10px',
        lineHeight: '20px',
        fontSize: '11px',
        fontFamily: function(dropdown) {
          return dropdown.settings.fontFamily;
        },
        color: 'inherit',
        boxSizing: 'border-box'
      }
    }
  ]
]);
exports.choice = choice; 

var scrollIndicatorUp = DOM.template([
   'div', {
     ref: 'scrollIndicatorUp',
     style: {
       position: 'absolute',
       top: 0,
       left: 0,
       display: 'none',
       width: '100%',
       height: '20px',
       backgroundColor: '#f6f6f6',
       color: '#000000',
       textAlign: 'center',
       $visible: {
         display: 'block'
       }
     }
   }, [
     'div', {
       style: {
         position: 'absolute',
         top: '50%',
         left: 0,
         right: 0,
         width: '15px',
         height: '15px',
         display: 'block',
         margin: '0 auto',
         transform: 'translateY(-50%)'
       }
     }, SVG.caretUp
   ]
 ]);
 exports.scrollIndicatorUp = scrollIndicatorUp; 

var scrollIndicatorDown = DOM.template([
     'div', {
       ref: 'scrollIndicatorDown',
       style: {
         position: 'absolute',
         bottom: 0,
         left: 0,
         display: 'none',
         width: '100%',
         height: '20px',
         backgroundColor: '#f6f6f6',
         color: '#000000',
         textAlign: 'center',
         $visible: {
           display: 'block'
         }
       }
     }, [
       'div', {
         style: {
           position: 'absolute',
           top: '50%',
           left: 0,
           right: 0,
           width: '15px',
           height: '15px',
           display: 'block',
           margin: '0 auto',
           transform: 'translateY(-50%)'
         }
       }, SVG.caretDown
     ]
   ]);
   exports.scrollIndicatorDown = scrollIndicatorDown; 

var help = DOM.template([
           'div', {
             ref: 'help',
             style: {
               display: 'none',
               borderTop: '2px solid rgba(0,0,0,0.05)',
               padding: '4px 12px 1px',
               color: 'rgba(0,0,0,0.5)',
               fontWeight: '500',
               fontSize: '11px',
               userSelect: 'none',
               $showHelp: {
                 display: 'block'
               }
             }
           }
         ]);
         exports.help = help; 

;
return module.exports;
},
63: function (require, module, exports) {
module.exports = {
  maxHeight: 300,
  multiple: false,
  lockScroll: true,
  typeBuffer: false,
  help: '',
  templates: {}
};

;
return module.exports;
},
64: function (require, module, exports) {
!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.textMaskCore=r():e.textMaskCore=r()}(this,function(){return function(e){function r(n){if(t[n])return t[n].exports;var o=t[n]={exports:{},id:n,loaded:!1};return e[n].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var t={};return r.m=e,r.c=t,r.p="",r(0)}([function(e,r,t){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=t(3);Object.defineProperty(r,"conformToMask",{enumerable:!0,get:function(){return n(o).default}});var i=t(2);Object.defineProperty(r,"adjustCaretPosition",{enumerable:!0,get:function(){return n(i).default}});var a=t(5);Object.defineProperty(r,"createTextMaskInputElement",{enumerable:!0,get:function(){return n(a).default}})},function(e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.placeholderChar="_"},function(e,r){"use strict";function t(e){var r=e.previousConformedValue,t=void 0===r?o:r,i=e.previousPlaceholder,a=void 0===i?o:i,u=e.currentCaretPosition,l=void 0===u?0:u,s=e.conformedValue,f=e.rawValue,d=e.placeholderChar,c=e.placeholder,v=e.indexesOfPipedChars,p=void 0===v?n:v,h=e.caretTrapIndexes,g=void 0===h?n:h;if(0===l)return 0;var m=f.length,y=t.length,b=c.length,C=s.length,P=m-y,x=P>0,O=0===y,k=P>1&&!x&&!O;if(k)return l;var j=x&&(t===s||s===c),M=0,T=void 0,w=void 0;if(j)M=l-P;else{var _=s.toLowerCase(),V=f.toLowerCase(),S=V.substr(0,l).split(o),N=S.filter(function(e){return _.indexOf(e)!==-1});w=N[N.length-1];var E=a.substr(0,N.length).split(o).filter(function(e){return e!==d}).length,A=c.substr(0,N.length).split(o).filter(function(e){return e!==d}).length,R=A!==E,I=void 0!==a[N.length-1]&&void 0!==c[N.length-2]&&a[N.length-1]!==d&&a[N.length-1]!==c[N.length-1]&&a[N.length-1]===c[N.length-2];!x&&(R||I)&&E>0&&c.indexOf(w)>-1&&void 0!==f[l]&&(T=!0,w=f[l]);for(var J=p.map(function(e){return _[e]}),q=J.filter(function(e){return e===w}).length,F=N.filter(function(e){return e===w}).length,L=c.substr(0,c.indexOf(d)).split(o).filter(function(e,r){return e===w&&f[r]!==e}).length,W=L+F+q+(T?1:0),z=0,B=0;B<C;B++){var D=_[B];if(M=B+1,D===w&&z++,z>=W)break}}if(x){for(var G=M,H=M;H<=b;H++)if(c[H]===d&&(G=H),c[H]===d||g.indexOf(H)!==-1||H===b)return G}else if(T){for(var K=M-1;K>=0;K--)if(s[K]===w||g.indexOf(K)!==-1||0===K)return K}else for(var Q=M;Q>=0;Q--)if(c[Q-1]===d||g.indexOf(Q)!==-1||0===Q)return Q}Object.defineProperty(r,"__esModule",{value:!0}),r.default=t;var n=[],o=""},function(e,r,t){"use strict";function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:a,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=t.guide,u=void 0===n||n,l=t.previousConformedValue,s=void 0===l?a:l,f=t.placeholderChar,d=void 0===f?i.placeholderChar:f,c=t.placeholder,v=void 0===c?(0,o.convertMaskToPlaceholder)(r,d):c,p=t.currentCaretPosition,h=t.keepCharPositions,g=u===!1&&void 0!==s,m=e.length,y=s.length,b=v.length,C=r.length,P=m-y,x=P>0,O=p+(x?-P:0),k=O+Math.abs(P);if(h===!0&&!x){for(var j=a,M=O;M<k;M++)v[M]===d&&(j+=d);e=e.slice(0,O)+j+e.slice(O,m)}for(var T=e.split(a).map(function(e,r){return{char:e,isNew:r>=O&&r<k}}),w=m-1;w>=0;w--){var _=T[w].char;if(_!==d){var V=w>=O&&y===C;_===v[V?w-P:w]&&T.splice(w,1)}}var S=a,N=!1;e:for(var E=0;E<b;E++){var A=v[E];if(A===d){if(T.length>0)for(;T.length>0;){var R=T.shift(),I=R.char,J=R.isNew;if(I===d&&g!==!0){S+=d;continue e}if(r[E].test(I)){if(h===!0&&J!==!1&&s!==a&&u!==!1&&x){for(var q=T.length,F=null,L=0;L<q;L++){var W=T[L];if(W.char!==d&&W.isNew===!1)break;if(W.char===d){F=L;break}}null!==F?(S+=I,T.splice(F,1)):E--}else S+=I;continue e}N=!0}g===!1&&(S+=v.substr(E,b));break}S+=A}if(g&&x===!1){for(var z=null,B=0;B<S.length;B++)v[B]===d&&(z=B);S=null!==z?S.substr(0,z+1):a}return{conformedValue:S,meta:{someCharsRejected:N}}}Object.defineProperty(r,"__esModule",{value:!0}),r.default=n;var o=t(4),i=t(1),a=""},function(e,r,t){"use strict";function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:l,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:u.placeholderChar;if(e.indexOf(r)!==-1)throw new Error("Placeholder character must not be used as part of the mask. Please specify a character that is not present in your mask as your placeholder character.\n\n"+("The placeholder character that was received is: "+JSON.stringify(r)+"\n\n")+("The mask that was received is: "+JSON.stringify(e)));return e.map(function(e){return e instanceof RegExp?r:e}).join("")}function o(e){return"string"==typeof e||e instanceof String}function i(e){return"number"==typeof e&&void 0===e.length&&!isNaN(e)}function a(e){for(var r=[],t=void 0;t=e.indexOf(s),t!==-1;)r.push(t),e.splice(t,1);return{maskWithoutCaretTraps:e,indexes:r}}Object.defineProperty(r,"__esModule",{value:!0}),r.convertMaskToPlaceholder=n,r.isString=o,r.isNumber=i,r.processCaretTraps=a;var u=t(1),l=[],s="[]"},function(e,r,t){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){var r={previousConformedValue:void 0,previousPlaceholder:void 0};return{state:r,update:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e,o=n.inputElement,s=n.mask,d=n.guide,m=n.pipe,b=n.placeholderChar,C=void 0===b?p.placeholderChar:b,P=n.keepCharPositions,x=void 0!==P&&P,O=n.showMask,k=void 0!==O&&O;if("undefined"==typeof t&&(t=o.value),t!==r.previousConformedValue){("undefined"==typeof s?"undefined":l(s))===y&&void 0!==s.pipe&&void 0!==s.mask&&(m=s.pipe,s=s.mask);var j=void 0,M=void 0;if(s instanceof Array&&(j=(0,v.convertMaskToPlaceholder)(s,C)),s!==!1){var T=a(t),w=o.selectionEnd,_=r.previousConformedValue,V=r.previousPlaceholder,S=void 0;if(("undefined"==typeof s?"undefined":l(s))===h){if(M=s(T,{currentCaretPosition:w,previousConformedValue:_,placeholderChar:C}),M===!1)return;var N=(0,v.processCaretTraps)(M),E=N.maskWithoutCaretTraps,A=N.indexes;M=E,S=A,j=(0,v.convertMaskToPlaceholder)(M,C)}else M=s;var R={previousConformedValue:_,guide:d,placeholderChar:C,pipe:m,placeholder:j,currentCaretPosition:w,keepCharPositions:x},I=(0,c.default)(T,M,R),J=I.conformedValue,q=("undefined"==typeof m?"undefined":l(m))===h,F={};q&&(F=m(J,u({rawValue:T},R)),F===!1?F={value:_,rejected:!0}:(0,v.isString)(F)&&(F={value:F}));var L=q?F.value:J,W=(0,f.default)({previousConformedValue:_,previousPlaceholder:V,conformedValue:L,placeholder:j,rawValue:T,currentCaretPosition:w,placeholderChar:C,indexesOfPipedChars:F.indexesOfPipedChars,caretTrapIndexes:S}),z=L===j&&0===W,B=k?j:g,D=z?B:L;r.previousConformedValue=D,r.previousPlaceholder=j,o.value!==D&&(o.value=D,i(o,W))}}}}}function i(e,r){document.activeElement===e&&(b?C(function(){return e.setSelectionRange(r,r,m)},0):e.setSelectionRange(r,r,m))}function a(e){if((0,v.isString)(e))return e;if((0,v.isNumber)(e))return String(e);if(void 0===e||null===e)return g;throw new Error("The 'value' provided to Text Mask needs to be a string or a number. The value received was:\n\n "+JSON.stringify(e))}Object.defineProperty(r,"__esModule",{value:!0});var u=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e},l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};r.default=o;var s=t(2),f=n(s),d=t(3),c=n(d),v=t(4),p=t(1),h="function",g="",m="none",y="object",b="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),C="undefined"!=typeof requestAnimationFrame?requestAnimationFrame:setTimeout}])});;
return module.exports;
},
65: function (require, module, exports) {
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.textMaskAddons=t():e.textMaskAddons=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(1);Object.defineProperty(t,"createAutoCorrectedDatePipe",{enumerable:!0,get:function(){return r(o).default}});var i=n(2);Object.defineProperty(t,"createNumberMask",{enumerable:!0,get:function(){return r(i).default}});var u=n(3);Object.defineProperty(t,"emailMask",{enumerable:!0,get:function(){return r(u).default}})},function(e,t){"use strict";function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"mm dd yyyy";return function(t){var n=[],r=e.split(/[^dmy]+/),o={dd:31,mm:12,yy:99,yyyy:9999},i={dd:1,mm:1,yy:0,yyyy:1},u=t.split("");r.forEach(function(t){var r=e.indexOf(t),i=parseInt(o[t].toString().substr(0,1),10);parseInt(u[r],10)>i&&(u[r+1]=u[r],u[r]=0,n.push(r))});var c=r.some(function(n){var r=e.indexOf(n),u=n.length,c=t.substr(r,u).replace(/\D/g,""),l=parseInt(c,10);return l>o[n]||c.length===u&&l<i[n]});return!c&&{value:u.join(""),indexesOfPipedChars:n}}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=n},function(e,t){"use strict";function n(){function e(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c,t=e.length;if(e===c||e[0]===h[0]&&1===t)return h.split(c).concat([v]).concat(m.split(c));if(e===S&&M)return h.split(c).concat(["0",S,v]).concat(m.split(c));var n=e.lastIndexOf(S),u=n!==-1,l=e[0]===s&&I,a=void 0,g=void 0,b=void 0;if(e.slice(V*-1)===m&&(e=e.slice(0,V*-1)),u&&(M||D)?(a=e.slice(e.slice(0,$)===h?$:0,n),g=e.slice(n+1,t),g=r(g.replace(f,c))):a=e.slice(0,$)===h?e.slice($):e,N&&("undefined"==typeof N?"undefined":i(N))===p){var O="."===_?"[.]":""+_,j=(a.match(new RegExp(O,"g"))||[]).length;a=a.slice(0,N+j*q)}return a=a.replace(f,c),A||(a=a.replace(/^0+(0$|[^0])/,"$1")),a=x?o(a,_):a,b=r(a),(u&&M||D===!0)&&(e[n-1]!==S&&b.push(y),b.push(S,y),g&&(("undefined"==typeof C?"undefined":i(C))===p&&(g=g.slice(0,C)),b=b.concat(g)),D===!0&&e[n-1]===S&&b.push(v)),$>0&&(b=h.split(c).concat(b)),l&&(b.length===$&&b.push(v),b=[d].concat(b)),m.length>0&&(b=b.concat(m.split(c))),b}var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=t.prefix,h=void 0===n?u:n,g=t.suffix,m=void 0===g?c:g,b=t.includeThousandsSeparator,x=void 0===b||b,O=t.thousandsSeparatorSymbol,_=void 0===O?l:O,j=t.allowDecimal,M=void 0!==j&&j,P=t.decimalSymbol,S=void 0===P?a:P,w=t.decimalLimit,C=void 0===w?2:w,k=t.requireDecimal,D=void 0!==k&&k,E=t.allowNegative,I=void 0!==E&&E,R=t.allowLeadingZeroes,A=void 0!==R&&R,L=t.integerLimit,N=void 0===L?null:L,$=h&&h.length||0,V=m&&m.length||0,q=_&&_.length||0;return e.instanceOf="createNumberMask",e}function r(e){return e.split(c).map(function(e){return v.test(e)?v:e})}function o(e,t){return e.replace(/\B(?=(\d{3})+(?!\d))/g,t)}Object.defineProperty(t,"__esModule",{value:!0});var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=n;var u="$",c="",l=",",a=".",s="-",d=/-/,f=/\D+/g,p="number",v=/\d/,y="[]"},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){e=e.replace(O,v);var n=t.placeholderChar,r=t.currentCaretPosition,o=e.indexOf(y),s=e.lastIndexOf(p),d=s<o?-1:s,f=i(e,o+1,y),h=i(e,d-1,p),g=u(e,o,n),m=c(e,o,d,n),b=l(e,d,n,r);g=a(g),m=a(m),b=a(b,!0);var x=g.concat(f).concat(m).concat(h).concat(b);return x}function i(e,t,n){var r=[];return e[t]===n?r.push(n):r.push(h,n),r.push(h),r}function u(e,t){return t===-1?e:e.slice(0,t)}function c(e,t,n,r){var o=v;return t!==-1&&(o=n===-1?e.slice(t+1,e.length):e.slice(t+1,n)),o=o.replace(new RegExp("[\\s"+r+"]",m),v),o===y?f:o.length<1?g:o[o.length-1]===p?o.slice(0,o.length-1):o}function l(e,t,n,r){var o=v;return t!==-1&&(o=e.slice(t+1,e.length)),o=o.replace(new RegExp("[\\s"+n+".]",m),v),0===o.length?e[t-1]===p&&r!==e.length?f:v:o}function a(e,t){return e.split(v).map(function(e){return e===g?e:t?x:b})}Object.defineProperty(t,"__esModule",{value:!0});var s=n(4),d=r(s),f="*",p=".",v="",y="@",h="[]",g=" ",m="g",b=/[^\s]/,x=/[^.\s]/,O=/\s/g;t.default={mask:o,pipe:d.default}},function(e,t){"use strict";function n(e,t){var n=t.currentCaretPosition,i=t.rawValue,f=t.previousConformedValue,p=t.placeholderChar,v=e;v=r(v);var y=v.indexOf(c),h=null===i.match(new RegExp("[^@\\s."+p+"]"));if(h)return u;if(v.indexOf(a)!==-1||y!==-1&&n!==y+1||i.indexOf(o)===-1&&f!==u&&i.indexOf(l)!==-1)return!1;var g=v.indexOf(o),m=v.slice(g+1,v.length);return(m.match(d)||s).length>1&&v.substr(-1)===l&&n!==i.length&&(v=v.slice(0,v.length-1)),v}function r(e){var t=0;return e.replace(i,function(){return t++,1===t?o:u})}Object.defineProperty(t,"__esModule",{value:!0}),t.default=n;var o="@",i=/@/g,u="",c="@.",l=".",a="..",s=[],d=/\./g}])});;
return module.exports;
},
66: function (require, module, exports) {
module.exports = {
  red: '#cc4820',
  green: '#72c322',
  orange: '#ff9c00',
  black: '#181818',
  grey_dark: '#5e5e5e',
  grey: '#909090',
  grey_semi_light: '#bebebe',
  grey_light: '#d3d3d3',
  grey_light2: '#dddddd',
  grey_light3: '#f2f5f7',
  grey_light4: '#e5e5e5'
};

;
return module.exports;
},
73: function (require, module, exports) {
var StateChain;

module.exports = StateChain = (function() {
  function StateChain(states) {
    this.string = states.join('+');
    this.array = states.slice();
    this.length = states.length;
  }

  StateChain.prototype.includes = function(target) {
    var i, len, ref, state;
    ref = this.array;
    for (i = 0, len = ref.length; i < len; i++) {
      state = ref[i];
      if (state === target) {
        return true;
      }
    }
    return false;
  };

  StateChain.prototype.without = function(target) {
    return this.array.filter(function(state) {
      return state !== target;
    }).join('+');
  };

  StateChain.prototype.isApplicable = function(target, otherActive) {
    var active;
    active = this.array.filter(function(state) {
      return state === target || otherActive.indexOf(state) !== -1;
    });
    return active.length === this.array.length;
  };

  return StateChain;

})();

;
return module.exports;
},
74: function (require, module, exports) {
exports.checkmark = require(88);

exports.angleDown = require(89);

exports.caretUp = require(90);

exports.caretDown = require(91);

exports.plus = require(92);

exports.clone = require(93);

;
return module.exports;
},
88: function (require, module, exports) {
var DOM;

DOM = require(2);

module.exports = DOM.template([
  '*svg', {
    attrs: {
      width: '12px',
      height: '12px',
      viewBox: '5 7 12 12',
      tabindex: -1,
      focusable: false
    },
    style: {
      width: '9px',
      height: '9px'
    }
  }, [
    '*polyline', {
      attrs: {
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        fill: 'none',
        points: '7 13.8888889 9.66666667 17 15 9',
        tabindex: -1,
        focusable: false
      }
    }
  ]
]);

;
return module.exports;
},
89: function (require, module, exports) {
var DOM;

DOM = require(2);

module.exports = DOM.template([
  '*svg', {
    attrs: {
      width: '1792px',
      height: '1792px',
      viewBox: '0 0 1792 1792',
      tabindex: -1,
      focusable: false
    },
    style: {
      width: '100%',
      height: '100%',
      outline: 'none'
    }
  }, [
    '*path', {
      attrs: {
        tabindex: -1,
        focusable: false,
        d: 'M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z'
      }
    }
  ]
]);

;
return module.exports;
},
90: function (require, module, exports) {
var DOM;

DOM = require(2);

module.exports = DOM.template([
  '*svg', {
    attrs: {
      viewBox: '0 0 512 512',
      tabindex: -1,
      focusable: false
    },
    style: {
      width: '100%',
      height: '100%',
      outline: 'none'
    }
  }, [
    '*path', {
      attrs: {
        tabindex: -1,
        focusable: false,
        d: 'M402 347c0 5-2 10-5 13-4 4-8 6-13 6h-256c-5 0-9-2-13-6-3-3-5-8-5-13s2-9 5-12l128-128c4-4 8-6 13-6s9 2 13 6l128 128c3 3 5 7 5 12z'
      }
    }
  ]
]);

;
return module.exports;
},
91: function (require, module, exports) {
var DOM;

DOM = require(2);

module.exports = DOM.template([
  '*svg', {
    attrs: {
      viewBox: '0 0 512 512',
      tabindex: -1,
      focusable: false
    },
    style: {
      width: '100%',
      height: '100%',
      outline: 'none'
    }
  }, [
    '*path', {
      attrs: {
        tabindex: -1,
        focusable: false,
        d: 'M402 201c0 5-2 9-5 13l-128 128c-4 4-8 5-13 5s-9-1-13-5l-128-128c-3-4-5-8-5-13s2-9 5-13c4-3 8-5 13-5h256c5 0 9 2 13 5 3 4 5 8 5 13z'
      }
    }
  ]
]);

;
return module.exports;
},
92: function (require, module, exports) {
var DOM;

DOM = require(2);

module.exports = DOM.template([
  '*svg', {
    attrs: {
      viewBox: '0 0 15 15',
      tabindex: -1,
      focusable: false
    },
    style: {
      width: '100%',
      height: '100%',
      outline: 'none'
    }
  }, [
    '*polygon', {
      attrs: {
        tabindex: -1,
        focusable: false,
        points: '9 0 6 0 6 6 0 6 0 9 6 9 6 15 9 15 9 9 15 9 15 6 9 6'
      }
    }
  ]
]);

;
return module.exports;
},
93: function (require, module, exports) {
var DOM;

DOM = require(2);

module.exports = DOM.template([
  '*svg', {
    attrs: {
      viewBox: '0 0 18 20',
      tabindex: -1,
      focusable: false
    },
    style: {
      width: '100%',
      height: '100%',
      outline: 'none'
    }
  }, [
    '*path', {
      attrs: {
        tabindex: -1,
        focusable: false,
        d: 'M13.414,0 L6,0 C4.897,0 4,0.898 4,2 L4,14 C4,15.103 4.897,16 6,16 L16,16 C17.103,16 18,15.103 18,14 L18,4.586 L13.414,0 Z M16.001,14 L6,14 L6,2 L12,2 L12,6 L16,6 L16.001,14 Z'
      }
    }
  ], [
    '*path', {
      attrs: {
        tabindex: -1,
        focusable: false,
        d: 'M2,6.42379282 L0,6.42379282 L0,18 C0,19.103 0.897,20 2,20 L14,20 L14,18 L2,18 L2,6.42379282 Z'
      }
    }
  ]
]);

;
return module.exports;
}
}, this);
if (typeof define === 'function' && define.umd) {
define(function () {
return require(0);
});
} else if (typeof module === 'object' && module.exports) {
module.exports = require(0);
} else {
return this['quickfield'] = require(0);
}
}).call(this, null, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : this);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSIsImNvbnNvbGVQYXRjaC5jb2ZmZWUiLCIuLi9wYWNrYWdlLmpzb24iLCJoZWxwZXJzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvaW5kZXguY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvYWxsb3dlZE9wdGlvbnMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvaGVscGVycy5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9jaGVja3MuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy93aW5kb3cuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvbWVkaWFRdWVyeS5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9iYXRjaC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy90ZW1wbGF0ZS9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9zaG9ydGN1dHMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9wYWNrYWdlLmpzb24iLCJjaGVja3MuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3NtYXJ0LWV4dGVuZC9zcmMvaW5kZXguY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3NtYXJ0LWV4dGVuZC9ub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3BhY2thZ2UuanNvbiIsImFuaW1hdGlvbnMuY29mZmVlIiwiY29uc3RhbnRzL3JlcUZpZWxkTWV0aG9kcy5jb2ZmZWUiLCJmaWVsZC9pbmRleC5jb2ZmZWUiLCJmaWVsZC9maWVsZC90cmFuc2Zvcm1TZXR0aW5ncy5jb2ZmZWUiLCJmaWVsZC90ZXh0L19pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL19pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9TaW1wbHlCaW5kL19pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nL19pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL2luZGV4LmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL0dyb3VwQmluZGluZy9faW5kZXguY29mZmVlIiwiY29uc3RhbnRzL3JlZ2V4LmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9ub2RlX21vZHVsZXMvcXVpY2tjc3Mvc3JjL2luZGV4LmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9ub2RlX21vZHVsZXMvcXVpY2tjc3Mvbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9wYWNrYWdlLmpzb24iLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL2lzL3NyYy9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3NyYy9leHRlbmQuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrY3NzL3NyYy9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tjc3Mvbm9kZV9tb2R1bGVzL3F1aWNrY3NzL3BhY2thZ2UuanNvbiIsIi4uL25vZGVfbW9kdWxlcy9mYXN0ZG9tL2Zhc3Rkb20uanMiLCJjb21wb25lbnRzL2NvbmRpdGlvbi5jb2ZmZWUiLCJmaWVsZC9nbG9iYWxEZWZhdWx0cy5jb2ZmZWUiLCJjb21wb25lbnRzL2Ryb3Bkb3duL2luZGV4LmNvZmZlZSIsImNvbXBvbmVudHMvbWFzay5jb2ZmZWUiLCJjb25zdGFudHMva2V5Q29kZXMuY29mZmVlIiwiZmllbGQvdGV4dC90ZW1wbGF0ZS5jb2ZmZWUiLCJmaWVsZC90ZXh0L2RlZmF1bHRzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9ub2RlX21vZHVsZXMvcXVpY2tjc3Mvc3JjL2NvbnN0YW50cy5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrY3NzL3NyYy9oZWxwZXJzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vaXMvc3JjL25hdGl2ZXMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9pcy9zcmMvZG9tLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvY29uc3RhbnRzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvaGVscGVycy5jb2ZmZWUiLCJjb21wb25lbnRzL2Ryb3Bkb3duL3RlbXBsYXRlLmNvZmZlZSIsImNvbXBvbmVudHMvZHJvcGRvd24vZGVmYXVsdHMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3RleHQtbWFzay1jb3JlL2Rpc3QvdGV4dE1hc2tDb3JlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3RleHQtbWFzay1hZGRvbnMvZGlzdC90ZXh0TWFza0FkZG9ucy5qcyIsImNvbnN0YW50cy9jb2xvcnMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9lbGVtZW50L3N0YXRlQ2hhaW4uY29mZmVlIiwic3ZnL19pbmRleC5jb2ZmZWUiLCJzdmcvY2hlY2ttYXJrLmNvZmZlZSIsInN2Zy9hbmdsZURvd24uY29mZmVlIiwic3ZnL2NhcmV0VXAuY29mZmVlIiwic3ZnL2NhcmV0RG93bi5jb2ZmZWUiLCJzdmcvcGx1cy5jb2ZmZWUiLCJzdmcvY2xvbmUuY29mZmVlIl0sIm5hbWVzIjpbImltcG9ydDoxIiwiaW1wb3J0OjIiLCJpbXBvcnQ6MyIsImltcG9ydDo0IiwiaW1wb3J0OjUiLCJpbXBvcnQ6NiIsImlubGluZToxIiwiaW1wb3J0OjkiLCJpbXBvcnQ6MTAiLCJpbmxpbmU6MiIsImlubGluZTozIiwiaW5saW5lOjQiLCJpbmxpbmU6NSIsImlubGluZTo2IiwiaW5saW5lOjciLCJpbmxpbmU6OCIsImlubGluZTo5IiwiaW5saW5lOjEwIiwiaW1wb3J0OjgiLCJpbXBvcnQ6NyIsImltcG9ydDoxMSIsImltcG9ydDoxMiIsImV4cG9ydDoxIiwiZXhwb3J0OjIiLCJleHBvcnQ6MyIsImV4cG9ydDo0IiwiZXhwb3J0OjUiLCJleHBvcnQ6NiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O1VBSUVBLFVBQWtCQTs7TUFBU0MsVUFDMUJBOztLQUFRQyxVQUFpQkE7O1NBQVlDLFVBQXFCQTs7cUJBQ3RDQyxVQUdMQTs7eUJBQTRCQyxVQUV6Q0E7O0FDWExDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUsyQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJENkYyWkMsVUFBZ0JBOzs7Ozs7NEJBQWdGQyxXQUFxQkE7Ozs7Ozs7Ozs7Ozs7b0JFbEczaUJDLFVBdUZFQTs7Ozs7Ozs7Ozs7Ozs7OztLQ3JGRlQsVUFBaUJBOztNQUFTQyxVQUFpQkE7O2FBQzlCQyxXQUVKQTs7UUFDUEMsV0FFS0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ053QkgscUJBRTlCQTs7Ozs7QUFBZ0NDLHVCQUVqQ0E7O0FDTkFLOzs7Ozs7QUE0QkNBOztBQzVCREc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbURDQTs7QUNuRERDOzs7Ozs7Ozs7Ozs7Ozs7QUFRQ0E7O0FDUkRDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkN1QkE7O0FDN0N2QkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JDQTs7QUNsQkRDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUZDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pGREM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q0NBOztBQ3ZDREM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1RENBOztBQ3ZEREM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3RG9EQTs7bUJDeERwREMsUUFpR0VBOzs7Ozs7Ozs7OztLQ2pHWWpCLFdBQ05BOzs7Ozs7dUNBR1FDLFVBQWtCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7U0NEM0JELFdBQ01BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQ0piTSxPQTBHRUE7Ozs7Ozs7TUMxR2NOLFdBQ1BBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRFQ7QUFDQTtBQUNBO0FBQ0E7Ozs7VUNBQ0EsVUFBbUJBOztLQUNuQkMsVUFBa0JBOztTQUFZQyxVQUN6QkE7O1VBQWFDLFdBQWdCQTs7YUFDN0JDLFdBR0tBOztZQUFlQyxXQUNGQTs7Ozs7Ozs7OzRCQ1Z4QkM7Ozs7bUNEbUJJWSxXQUNjQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1BvQ1o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQ0hoQk4sV0FFTkE7O09BQzNCQyxXQUNVQTs7UUFDWEMsV0FFU0E7O1dBRWJDLFdBQ2lCQTs7VUFDWEMsVUFBc0JBOztLQUV2QkMsVUFBcUJBOztNQUN6QmMsVUFBaUJBOztTQUFZRCxVQUFxQkE7O2FBQzNDWCxXQUFnQ0E7O0FBQ3hDQywwREFBZ0RBOztBQUFHWSwwQkFDbENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWlVZy9NQyxVQUFZQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVWN2dOZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUM2QkE7O0FDRDdCRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QmtCQTs7QUN2QmxCQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvRnFCQTs7QUNwRnJCQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUIyQkE7O0FDekIzQkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQk9BOzs7Ozs7O0FDL0JQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztZQ1ZjWixXQUVWQTs7VUFBYUMsV0FBa0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O21CQ0huQ0ssT0E2RkVBOzs7Ozs7Ozs7O1dDM0ZLTixXQUVKQTtPQUFTQyxXQUNDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTGI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztZQy9EY0QsV0FFVkE7O1VBQWFDLFdBQWtCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttQkNIbkNLLE9BZ0dFQTs7Ozs7OztBQ2hHRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztLQ2xQYU4sVUFBa0JBOzthQUUvQkMsV0FFZUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0xmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0tDdkJRRCxVQUFxQkE7O2FBQ2ZDLFdBQ1FBOztXQUFjQyxXQUNwQkE7O1VBQWFDLFVBQ2pCQTs7WUFBZUMsV0FFbkJBOztTQUNIQyxVQUNDQTs7TUFBU2MsVUFDSEE7O2lCQUFvQkQsV0FFdkJBOztBQUFHWCwwQkFDSkE7O0FBQUdDLDBCQUVDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2FDakJjUixXQUNQQTs7V0FDakJDLFdBQ0RBOzthQUFnQkMsV0FDWEE7O1NBQVlDLFVBQ1RBOztLQUFRQyxVQUNMQTs7UUFDVEMsV0FDR0E7O1VBQ05jLFVBR0NBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztNQzVDMEJuQixVQUNoQkE7O1VBQWFDLFVBQ25CQTs7U0FBWUMsV0FFU0E7Ozs7QUFFWG9CLDhCQUVHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ1FoQkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBNkNBQTs7QUFBRUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0JBd0R1NEhBOzs7OztBQzlXMTRIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1lDNUI4QnhCLFdBQzlCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7WUMxQjhCQSxXQUM5QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQ0RNQSxVQUFpQkE7O01BQ2hCQyxXQUFrQkE7O1VBRXJCQyxVQUFzQkE7O0FBQzFCb0IsOEJBRUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUNFQzs7Ozs7Ozs7Ozs7O3FCQWNBQTs7QUFBRUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBcUVIQTs7QUFDREM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnREF5Q1FBOztBQUFFQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NEQVUwZkE7O0FBQUVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFBMlZBOzs7OztBQ25MbDJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O29CQ3hDb0IzQixXQUFvQkE7O29CQUNsQkMsV0FDckJBOztrQkFBcUJDLFdBQ25CQTs7b0JBQXVCQyxXQUNyQkE7O2VBQWtCQyxXQUNoQkE7O2dCQUFtQkMsV0FBZ0JBOzs7Ozs7O01DTDFCTCxVQUVSQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUNGUUEsVUFFUkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01DRlFBLFVBRVJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUNGUUEsVUFFUkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQ0ZRQSxVQUVSQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01DRlFBLFVBRVJBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJoZWxwZXJzID0gXyRzbSgnLi9oZWxwZXJzJyApXG5ET00gPSBfJHNtKCdxdWlja2RvbScgKVxuSVMgPSBfJHNtKCcuL2NoZWNrcycgKVxuZXh0ZW5kID0gXyRzbSgnc21hcnQtZXh0ZW5kJyApXG5yZWdpc3RlckFuaW1hdGlvbnMgPSBfJHNtKCcuL2FuaW1hdGlvbnMnIClcblJFUVVJUkVEX0ZJRUxEX01FVEhPRFMgPSBfJHNtKCcuL2NvbnN0YW50cy9yZXFGaWVsZE1ldGhvZHMnIClcbl8kc20oJy4vY29uc29sZVBhdGNoJyApXG5cblxubmV3QnVpbGRlciA9IChzZXR0aW5nT3ZlcnJpZGVzLCB0ZW1wbGF0ZU92ZXJyaWRlcyktPlxuXHRidWlsZGVyID0gKHNldHRpbmdzKS0+XG5cdFx0c2V0dGluZ3MgPSB7fSB1bmxlc3MgSVMub2JqZWN0KHNldHRpbmdzKVxuXHRcdHNldHRpbmdzLnR5cGUgPz0gJ3RleHQnXG5cblx0XHRpZiBub3QgRmllbGRbc2V0dGluZ3MudHlwZV1cblx0XHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrRmllbGQ6ICcje3NldHRpbmdzLnR5cGV9JyBpcyBub3QgYSB2YWxpZC9yZWdpc3RlcmVkIGZpZWxkIHR5cGVcIlxuXG5cdFx0cmVnaXN0ZXJBbmltYXRpb25zKClcblx0XHRuZXcgRmllbGRbc2V0dGluZ3MudHlwZV0oc2V0dGluZ3MsIGJ1aWxkZXIsIHNldHRpbmdPdmVycmlkZXMsIHRlbXBsYXRlT3ZlcnJpZGVzKVxuXG5cblx0YnVpbGRlci5yZWdpc3RlciA9ICh0eXBlLCB0YXJnZXRGaWVsZCktPlxuXHRcdGlmIG5vdCBJUy5zdHJpbmcodHlwZSkgb3Igbm90IElTLmZ1bmN0aW9uKHRhcmdldEZpZWxkKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiUXVpY2tGaWVsZCBSZWdpc3RyYXRpb246IGludmFsaWQgYXJndW1lbnRzXCJcblx0XHRmb3IgcmVxdWlyZWRNZXRob2QgaW4gUkVRVUlSRURfRklFTERfTUVUSE9EU1xuXHRcdFx0aWYgbm90IHRhcmdldEZpZWxkOjpbcmVxdWlyZWRNZXRob2RdXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrRmllbGQgUmVnaXN0cmF0aW9uOiAnI3tyZXF1aXJlZE1ldGhvZH0nIG1ldGhvZCBpcyByZXF1aXJlZCBpbiBvcmRlciB0byByZWdpc3RlciB0aGUgZmllbGRcIlxuXG5cdFx0RmllbGRbdHlwZV0gPSB0YXJnZXRGaWVsZFxuXHRcdHJldHVybiBAXG5cblxuXHRidWlsZGVyLmNvbmZpZyA9IChuZXdTZXR0aW5ncywgbmV3VGVtcGxhdGVzKS0+XG5cdFx0dGhyb3cgbmV3IEVycm9yIFwiUXVpY2tGaWVsZCBDb25maWc6IGludmFsaWQgY29uZmlnIG9iamVjdCBwcm92aWRlZCAje1N0cmluZyBuZXdTZXR0aW5nc31cIiBpZiBub3QgSVMub2JqZWN0KG5ld1NldHRpbmdzKVxuXHRcdG91dHB1dFNldHRpbmdzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdFxuXHRcdGZvciB0eXBlLGNvbmZpZyBvZiBuZXdTZXR0aW5nc1xuXHRcdFx0aWYgdHlwZSBpcyAnZ2xvYmFsJ1xuXHRcdFx0XHRvdXRwdXRTZXR0aW5ncy5nbG9iYWxEZWZhdWx0cyA9IGV4dGVuZC5kZWVwLm5vdERlZXAoRmllbGQuc2hhbGxvd1NldHRpbmdzKS5jbG9uZShGaWVsZDo6Z2xvYmFsRGVmYXVsdHMsIGNvbmZpZylcblx0XHRcdGVsc2UgaWYgRmllbGRbdHlwZV1cblx0XHRcdFx0b3V0cHV0U2V0dGluZ3NbdHlwZV0gPSBleHRlbmQuY2xvbmUuZGVlcC5ub3REZWVwKEZpZWxkLnNoYWxsb3dTZXR0aW5ncykoRmllbGRbdHlwZV06OmRlZmF1bHRzLCBjb25maWcpXG5cblx0XHRpZiBJUy5vYmplY3QobmV3VGVtcGxhdGVzKVxuXHRcdFx0b3V0cHV0VGVtcGxhdGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdFx0Z2xvYmFsQ29uZmlnID0gbmV3VGVtcGxhdGVzLmdsb2JhbFxuXHRcdFx0aWYgZ2xvYmFsQ29uZmlnIGFuZCBnbG9iYWxDb25maWcuZmllbGQgYW5kIG5vdCBnbG9iYWxDb25maWcuZGVmYXVsdFxuXHRcdFx0XHRnbG9iYWxDb25maWcuZGVmYXVsdCA9IGdsb2JhbENvbmZpZy5maWVsZFxuXHRcdFx0XG5cdFx0XHRmb3IgdHlwZSBvZiBGaWVsZFxuXHRcdFx0XHRvcmlnaW5hbFRlbXBsYXRlcyA9IEZpZWxkW3R5cGVdOjo/LnRlbXBsYXRlc1xuXHRcdFx0XHR0ZW1wbGF0ZXMgPSBuZXdUZW1wbGF0ZXNbdHlwZV0gb3IgZ2xvYmFsQ29uZmlnXG5cdFx0XHRcdGlmIG5vdCBvcmlnaW5hbFRlbXBsYXRlc1xuXHRcdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRcdGlmIG5vdCB0ZW1wbGF0ZXNcblx0XHRcdFx0XHRvdXRwdXRUZW1wbGF0ZXNbdHlwZV0gPSBvcmlnaW5hbFRlbXBsYXRlc1xuXHRcdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiB0ZW1wbGF0ZXMuZmllbGQgYW5kIG5vdCB0ZW1wbGF0ZXMuZGVmYXVsdFxuXHRcdFx0XHRcdHRlbXBsYXRlcy5kZWZhdWx0ID0gdGVtcGxhdGVzLmZpZWxkXG5cblx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW3R5cGVdID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdFx0XHRcblx0XHRcdFx0Zm9yIG5hbWUsY29uZmlnIG9mIHRlbXBsYXRlc1xuXHRcdFx0XHRcdGNvbnRpbnVlIGlmIG5hbWUgaXMgJ2ZpZWxkJyBvciBub3Qgb3JpZ2luYWxUZW1wbGF0ZXNbbmFtZV1cblx0XHRcdFx0XHRjb25maWcgPSBleHRlbmQuY2xvbmUuZGVlcC5jb25jYXQoZ2xvYmFsQ29uZmlnW25hbWVdLCBjb25maWcpIGlmIGdsb2JhbENvbmZpZyBhbmQgZ2xvYmFsQ29uZmlnW25hbWVdXG5cdFx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW3R5cGVdW25hbWVdID0gb3JpZ2luYWxUZW1wbGF0ZXNbbmFtZV0uZXh0ZW5kKGNvbmZpZylcblxuXHRcdFx0XHRmb3IgbmFtZSxjb25maWcgb2Ygb3JpZ2luYWxUZW1wbGF0ZXMgd2hlbiBub3Qgb3V0cHV0VGVtcGxhdGVzW3R5cGVdW25hbWVdXG5cdFx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW3R5cGVdW25hbWVdID0gY29uZmlnXG5cblx0XHRyZXR1cm4gbmV3QnVpbGRlcihvdXRwdXRTZXR0aW5ncywgb3V0cHV0VGVtcGxhdGVzKVxuXG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgYnVpbGRlciwgJ2ZpZWxkcycsIGdldDogKCktPlxuXHRcdGV4dGVuZC5jbG9uZS5vd24ubm90S2V5cygnaW5zdGFuY2VzJykoRmllbGQpXG5cblx0YnVpbGRlci5zZXR0aW5nT3ZlcnJpZGVzID0gc2V0dGluZ092ZXJyaWRlc1xuXHRidWlsZGVyLnRlbXBsYXRlT3ZlcnJpZGVzID0gdGVtcGxhdGVPdmVycmlkZXNcblx0YnVpbGRlci52ZXJzaW9uID0gXyRzbSgnLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbicgKVxuXHRidWlsZGVyLkZpZWxkID0gRmllbGQgPSBfJHNtKCcuL2ZpZWxkJyApXG5cdHJldHVybiBidWlsZGVyXG5cblxuXG5cblxuXG5RdWlja0ZpZWxkID0gbmV3QnVpbGRlcigpXG5RdWlja0ZpZWxkLnJlZ2lzdGVyICd0ZXh0JywgXyRzbSgnLi9maWVsZC90ZXh0JyApXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ3RleHRhcmVhJywgXyRzbSgnLi9maWVsZC90ZXh0YXJlYScgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdudW1iZXInLCBfJHNtKCcuL2ZpZWxkL251bWJlcicgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdzZWxlY3QnLCBfJHNtKCcuL2ZpZWxkL3NlbGVjdCcgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdjaG9pY2UnLCBfJHNtKCcuL2ZpZWxkL2Nob2ljZScgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICd0cnVlZmFsc2UnLCBfJHNtKCcuL2ZpZWxkL3RydWVmYWxzZScgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICd0b2dnbGUnLCBfJHNtKCcuL2ZpZWxkL3RvZ2dsZScgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdncm91cCcsIF8kc20oJy4vZmllbGQvZ3JvdXAnIClcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAncmVwZWF0ZXInLCBfJHNtKCcuL2ZpZWxkL3JlcGVhdGVyJyApXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ2ZpbGUnLCBfJHNtKCcuL2ZpZWxkL2ZpbGUnIClcbm1vZHVsZS5leHBvcnRzID0gUXVpY2tGaWVsZCIsIiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcbkBjb25zb2xlID89IHt9XG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5jb25zb2xlLmxvZyA/PSAoKS0+XG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5jb25zb2xlLndhcm4gPz0gY29uc29sZS5sb2ciLCJ7XG4gIFwibmFtZVwiOiBcInF1aWNrZmllbGRcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjcwLWJcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkZhc3QgJiBsaWdodCBmb3JtIGZpZWxkcyBtYW5hZ2VtZW50IHN1cHBvcnRpbmcgcmVhbC10aW1lIGJpbmRpbmdzLCBjdXN0b20gc3R5bGluZywgY3VzdG9tIGZpZWxkcywgSUU5KywgYW5kIG1vcmUuLi5cIixcbiAgXCJtYWluXCI6IFwiZGlzdC9xdWlja2ZpZWxkLmpzXCIsXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9xdWlja2ZpZWxkLmRlYnVnLmpzXCIsXG4gICAgXCIuL2Rpc3QvcXVpY2tmaWVsZC5qc1wiOiBcInNyYy9pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdGV4dFwiOiBcInNyYy9maWVsZC90ZXh0L19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdGV4dGFyZWFcIjogXCJzcmMvZmllbGQvdGV4dGFyZWEvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9udW1iZXJcIjogXCJzcmMvZmllbGQvbnVtYmVyL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvc2VsZWN0XCI6IFwic3JjL2ZpZWxkL3NlbGVjdC9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL2Nob2ljZVwiOiBcInNyYy9maWVsZC9jaG9pY2UvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC90cnVlZmFsc2VcIjogXCJzcmMvZmllbGQvdHJ1ZWZhbHNlL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdG9nZ2xlXCI6IFwic3JjL2ZpZWxkL3RvZ2dsZS9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL2dyb3VwXCI6IFwic3JjL2ZpZWxkL2dyb3VwL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvcmVwZWF0ZXJcIjogXCJzcmMvZmllbGQvcmVwZWF0ZXIvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9maWxlXCI6IFwic3JjL2ZpZWxkL2ZpbGUvX2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwiZmFsc2UgJiYgbnBtIHJ1biB0ZXN0OnRyYXZpcyB8fCB0cnVlXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJ3YXRjaFwiOiBcImNha2UgLWQgd2F0Y2hcIixcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDp0cmF2aXNcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcInRlc3Q6bG9jYWxcIjogXCJvcGVuIHRlc3QvdGVzdHJ1bm5lci5odG1sXCIsXG4gICAgXCJ0ZXN0Om1pbmlmaWVkXCI6IFwibWluaWZpZWQ9MSBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpicm93c2VyXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEVsZWN0cm9uIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6Y2hyb21lXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBDaHJvbWUgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpmaXJlZm94XCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEZpcmVmb3ggLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2ZpZWxkLmdpdFwiXG4gIH0sXG4gIFwiYXV0aG9yXCI6IFwiZGFuaWVsa2FsZW5cIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tmaWVsZC9pc3N1ZXNcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZmllbGQjcmVhZG1lXCIsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBkYW5pZWxrYWxlbi9pc1wiOiBcIl4yLjAuMFwiLFxuICAgIFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRcIjogXCJeMS4xNS44XCIsXG4gICAgXCJmYXN0ZG9tXCI6IFwiXjEuMC42XCIsXG4gICAgXCJsZXZlblwiOiBcIl4yLjAuMFwiLFxuICAgIFwibW92ZS1qc1wiOiBcIl4wLjUuMFwiLFxuICAgIFwicXVpY2tjc3NcIjogXCJeMS4zLjJcIixcbiAgICBcInF1aWNrZG9tXCI6IFwiXjEuMC44MVwiLFxuICAgIFwic21hcnQtZXh0ZW5kXCI6IFwiXjEuNy4zXCIsXG4gICAgXCJ0ZXh0LW1hc2stYWRkb25zXCI6IFwiXjMuNi4wXCIsXG4gICAgXCJ0ZXh0LW1hc2stY29yZVwiOiBcIl41LjAuMVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjaGFsa1wiOiBcIl4yLjAuMVwiLFxuICAgIFwiY29mZmVlLXNjcmlwdFwiOiBcIl4xLjEyLjZcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4zXCIsXG4gICAgXCJrZXlzaW1cIjogXCJnaXRodWI6ZGFuaWVsa2FsZW4va2V5c2ltLmpzXCIsXG4gICAgXCJwYWNrYWdlLWluc3RhbGxcIjogXCJeMS4wLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuMC1zMzVcIixcbiAgICBcInNpbXBseXdhdGNoXCI6IFwiXjMuMC4wLWwyXCJcbiAgfVxufVxuIiwiSVMgPSBfJHNtKCcuL2NoZWNrcycgKVxuRE9NID0gXyRzbSgncXVpY2tkb20nIClcblNpbXBseUJpbmQgPSBfJHNtKCdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCcgKVxucmVnZXggPSBfJHNtKCcuL2NvbnN0YW50cy9yZWdleCcgKVxuXG5oZWxwZXJzID0gZXhwb3J0c1xuaGVscGVycy5ub29wID0gKCktPlxuXG5oZWxwZXJzLmluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPlxuXHR0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuaGVscGVycy5yZXBlYXQgPSAoc3RyaW5nLCBjb3VudCktPlxuXHQoc3RyaW5nIGZvciBpIGluIFsxLi5jb3VudF0pLmpvaW4oJycpXG5cbmhlbHBlcnMucmVtb3ZlSXRlbSA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0aXRlbUluZGV4ID0gdGFyZ2V0LmluZGV4T2YoaXRlbSlcblx0dGFyZ2V0LnNwbGljZShpdGVtSW5kZXgsIDEpIGlmIGl0ZW1JbmRleCBpc250IC0xXG5cbmhlbHBlcnMuaW5zZXJ0QWZ0ZXIgPSAodGFyZ2V0LCBpdGVtLCBuZXdJdGVtKS0+XG5cdGl0ZW1JbmRleCA9IHRhcmdldC5pbmRleE9mKGl0ZW0pXG5cdHRhcmdldC5zcGxpY2UoaXRlbUluZGV4LCAwLCBuZXdJdGVtKSBpZiBpdGVtSW5kZXggaXNudCAtMVxuXG5oZWxwZXJzLmZpbmQgPSAodGFyZ2V0LCBmbiktPlxuXHRyZXN1bHRzID0gdGFyZ2V0LmZpbHRlcihmbilcblx0cmVzdWx0c1swXVxuXG5oZWxwZXJzLmRpZmYgPSAoc291cmNlLCBjb21wYXJlZSktPlxuXHRyZXN1bHQgPSBbXVxuXHRtYXhMZW4gPSBNYXRoLm1heChzb3VyY2UubGVuZ3RoLCBjb21wYXJlZS5sZW5ndGgpXG5cdGkgPSAtMVxuXHRcblx0d2hpbGUgKytpIDwgbWF4TGVuXG5cdFx0c291cmNlVmFsID0gc291cmNlW2ldXG5cdFx0Y29tcGFyZWVWYWwgPSBjb21wYXJlZVtpXVxuXG5cdFx0aWYgc291cmNlVmFsIGlzbnQgY29tcGFyZWVWYWxcblx0XHRcdHJlc3VsdC5wdXNoKHNvdXJjZVZhbCkgaWYgSVMuZGVmaW5lZChzb3VyY2VWYWwpIGFuZCBub3QgaGVscGVycy5pbmNsdWRlcyhjb21wYXJlZSwgc291cmNlVmFsKVxuXHRcdFx0cmVzdWx0LnB1c2goY29tcGFyZWVWYWwpIGlmIElTLmRlZmluZWQoY29tcGFyZWVWYWwpIGFuZCBub3QgaGVscGVycy5pbmNsdWRlcyhzb3VyY2UsIGNvbXBhcmVlVmFsKVxuXG5cdHJldHVybiByZXN1bHRcblxuXG5oZWxwZXJzLmhleFRvUkdCQSA9IChoZXgsIGFscGhhKS0+XG5cdGhleCA9IGhleC5zbGljZSgxKSBpZiBoZXhbMF0gaXMgJyMnXG5cdFIgPSBwYXJzZUludCBoZXguc2xpY2UoMCwyKSwgMTZcblx0RyA9IHBhcnNlSW50IGhleC5zbGljZSgyLDQpLCAxNlxuXHRCID0gcGFyc2VJbnQgaGV4LnNsaWNlKDQsNiksIDE2XG5cdHJldHVybiBcInJnYmEoI3tSfSwgI3tHfSwgI3tCfSwgI3thbHBoYX0pXCJcblxuXG5oZWxwZXJzLmRlZmF1bHRDb2xvciA9IChjb2xvciwgZGVmYXVsdENvbG9yKS0+XG5cdGlmIGNvbG9yIGlzICd0cmFuc3BhcmVudCcgb3Igbm90IGNvbG9yXG5cdFx0cmV0dXJuIGRlZmF1bHRDb2xvclxuXHRlbHNlXG5cdFx0cmV0dXJuIGNvbG9yXG5cblxuaGVscGVycy5jYWxjUGFkZGluZyA9IChkZXNpcmVkSGVpZ2h0LCBmb250U2l6ZSktPlxuXHRNYXRoLmNlaWwgKGRlc2lyZWRIZWlnaHQgLSBmb250U2l6ZSoxLjIzMSkvMlxuXG5cbmhlbHBlcnMudW5sb2NrU2Nyb2xsID0gKGV4Y2x1ZGVkRWwpLT5cblx0d2luZG93Ll9pc0xvY2tlZCA9IGZhbHNlXG5cdERPTSh3aW5kb3cpLm9mZiAnd2hlZWwubG9jaydcblxuXG5oZWxwZXJzLmxvY2tTY3JvbGwgPSAoZXhjbHVkZWRFbCktPiB1bmxlc3Mgd2luZG93Ll9pc0xvY2tlZFxuXHR3aW5kb3cuX2lzTG9ja2VkID0gdHJ1ZVxuXHRET00od2luZG93KS5vbiAnd2hlZWwubG9jaycsIChldmVudCktPlxuXHRcdGlmIGV2ZW50LnRhcmdldCBpcyBleGNsdWRlZEVsLnJhdyBvciBET00oZXZlbnQudGFyZ2V0KS5wYXJlbnRNYXRjaGluZygocGFyZW50KS0+IHBhcmVudCBpcyBleGNsdWRlZEVsKVxuXHRcdFx0aWYgZXZlbnQud2hlZWxEZWx0YSA+IDAgYW5kIGV4Y2x1ZGVkRWwucmF3LnNjcm9sbFRvcCBpcyAwXG5cdFx0XHRcdHJldHVybiBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblx0XHRcdGlmIGV2ZW50LndoZWVsRGVsdGEgPCAwIGFuZCBleGNsdWRlZEVsLnJhdy5zY3JvbGxIZWlnaHQgLSBleGNsdWRlZEVsLnJhdy5zY3JvbGxUb3AgaXMgZXhjbHVkZWRFbC5yYXcuY2xpZW50SGVpZ2h0XG5cdFx0XHRcdHJldHVybiBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblx0XHRlbHNlXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblxuaGVscGVycy5mdXp6eU1hdGNoID0gKG5lZWRsZSwgaGF5c3RhY2ssIGNhc2VTZW5zaXRpdmUpLT5cblx0bkxlbmd0aCA9IG5lZWRsZS5sZW5ndGhcblx0aExlbmd0aCA9IGhheXN0YWNrLmxlbmd0aFxuXHR1bmxlc3MgY2FzZVNlbnNpdGl2ZVxuXHRcdG5lZWRsZSA9IG5lZWRsZS50b1VwcGVyQ2FzZSgpXG5cdFx0aGF5c3RhY2sgPSBoYXlzdGFjay50b1VwcGVyQ2FzZSgpXG5cblx0aWYgbkxlbmd0aCA+IGhMZW5ndGhcblx0XHRyZXR1cm4gZmFsc2Vcblx0aWYgbkxlbmd0aCBpcyBoTGVuZ3RoXG5cdFx0cmV0dXJuIG5lZWRsZSBpcyBoYXlzdGFja1xuXG5cdG5JID0gaEkgPSBtYXRjaGVkQ291bnQgPTBcblx0d2hpbGUgbkkgPCBuTGVuZ3RoXG5cdFx0bmVlZGxlQ2hhciA9IG5lZWRsZVtuSSsrXVxuXHRcdFxuXHRcdHdoaWxlIGhJIDwgaExlbmd0aFxuXHRcdFx0aWYgaGF5c3RhY2tbaEkrK10gaXMgbmVlZGxlQ2hhclxuXHRcdFx0XHRtYXRjaGVkQ291bnQrK1xuXHRcdFx0XHRicmVha1xuXG5cdHJldHVybiBtYXRjaGVkQ291bnQgaXMgbkxlbmd0aFxuXG5cbmhlbHBlcnMuc3RhcnRzV2l0aCA9IChuZWVkbGUsIGhheXN0YWNrLCBjYXNlU2Vuc2l0aXZlKS0+XG5cdHVubGVzcyBjYXNlU2Vuc2l0aXZlXG5cdFx0bmVlZGxlID0gbmVlZGxlLnRvVXBwZXJDYXNlKClcblx0XHRoYXlzdGFjayA9IGhheXN0YWNrLnRvVXBwZXJDYXNlKClcblxuXHRpZiBuZWVkbGUubGVuZ3RoID4gaGF5c3RhY2subGVuZ3RoXG5cdFx0cmV0dXJuIGZhbHNlXG5cdGlmIG5lZWRsZS5sZW5ndGggaXMgaGF5c3RhY2subGVuZ3RoXG5cdFx0cmV0dXJuIG5lZWRsZSBpcyBoYXlzdGFja1xuXG5cdGkgPSAtMVxuXHR3aGlsZSBuZWVkbGVbKytpXVxuXHRcdHJldHVybiBmYWxzZSBpZiBuZWVkbGVbaV0gaXNudCBoYXlzdGFja1tpXVxuXHRyZXR1cm4gdHJ1ZVxuXG5cbmhlbHBlcnMuZ2V0SW5kZXhPZkZpcnN0RGlmZiA9IChzb3VyY2VTdHJpbmcsIGNvbXBhcmVTdHJpbmcpLT5cblx0Y3VycmVudFBvcyA9IDBcblx0bWF4TGVuZ3RoID0gTWF0aC5tYXgoc291cmNlU3RyaW5nLmxlbmd0aCwgY29tcGFyZVN0cmluZy5sZW5ndGgpXG5cdFxuXHR3aGlsZSBjdXJyZW50UG9zIDwgbWF4TGVuZ3RoXG5cdFx0cmV0dXJuIGN1cnJlbnRQb3MgaWYgc291cmNlU3RyaW5nW2N1cnJlbnRQb3NdIGlzbnQgY29tcGFyZVN0cmluZ1tjdXJyZW50UG9zXVxuXHRcdGN1cnJlbnRQb3MrK1xuXHRcblx0cmV0dXJuIG51bGxcblxuXG5cbmhlbHBlcnMucGFyc2VDc3NTaG9ydGhhbmRWYWx1ZSA9IChzdHJpbmcpLT5cblx0dmFsdWVzID0gc3RyaW5nLnNwbGl0KHJlZ2V4LndoaXRlU3BhY2UpLm1hcChwYXJzZUZsb2F0KVxuXHRyZXN1bHQgPSB7fVxuXHRzd2l0Y2ggdmFsdWVzLmxlbmd0aFxuXHRcdHdoZW4gMVxuXHRcdFx0cmVzdWx0LnRvcCA9IHJlc3VsdC5yaWdodCA9IHJlc3VsdC5ib3R0b20gPSByZXN1bHQubGVmdCA9IHZhbHVlc1swXVxuXHRcdHdoZW4gMlxuXHRcdFx0cmVzdWx0LnRvcCA9IHJlc3VsdC5ib3R0b20gPSB2YWx1ZXNbMF1cblx0XHRcdHJlc3VsdC5yaWdodCA9IHJlc3VsdC5sZWZ0ID0gdmFsdWVzWzFdXG5cdFx0d2hlbiAzXG5cdFx0XHRyZXN1bHQudG9wID0gdmFsdWVzWzBdXG5cdFx0XHRyZXN1bHQucmlnaHQgPSByZXN1bHQubGVmdCA9IHZhbHVlc1sxXVxuXHRcdFx0cmVzdWx0LmJvdHRvbSA9IHZhbHVlc1syXVxuXHRcdHdoZW4gNFxuXHRcdFx0cmVzdWx0LnRvcCA9IHZhbHVlc1swXVxuXHRcdFx0cmVzdWx0LnJpZ2h0ID0gdmFsdWVzWzFdXG5cdFx0XHRyZXN1bHQuYm90dG9tID0gdmFsdWVzWzJdXG5cdFx0XHRyZXN1bHQubGVmdCA9IHZhbHVlc1szXVxuXG5cdHJldHVybiByZXN1bHRcblxuXG5oZWxwZXJzLnNob3J0aGFuZFNpZGVWYWx1ZSA9ICh2YWx1ZSwgc2lkZSktPlxuXHRzd2l0Y2ggdHlwZW9mIHZhbHVlXG5cdFx0d2hlbiAnbnVtYmVyJyB0aGVuIHZhbHVlXG5cdFx0d2hlbiAnc3RyaW5nJ1xuXHRcdFx0dmFsdWVzID0gaGVscGVycy5wYXJzZUNzc1Nob3J0aGFuZFZhbHVlKHZhbHVlKVxuXHRcdFx0dmFsdWVzW3NpZGVdXG5cdFx0ZWxzZSAwXG5cblxuaGVscGVycy51cGRhdGVTaG9ydGhhbmRWYWx1ZSA9ICh2YWx1ZSwgc2lkZSwgbmV3VmFsdWUpLT5cblx0dmFsdWVzID0gaGVscGVycy5wYXJzZUNzc1Nob3J0aGFuZFZhbHVlKCcnKyh2YWx1ZSBvciAwKSlcblx0c3dpdGNoIHNpZGVcblx0XHR3aGVuICd0b3AnIHRoZW4gdmFsdWVzLnRvcCArPSBuZXdWYWx1ZVxuXHRcdHdoZW4gJ3JpZ2h0JyB0aGVuIHZhbHVlcy5yaWdodCArPSBuZXdWYWx1ZVxuXHRcdHdoZW4gJ2JvdHRvbScgdGhlbiB2YWx1ZXMuYm90dG9tICs9IG5ld1ZhbHVlXG5cdFx0d2hlbiAnbGVmdCcgdGhlbiB2YWx1ZXMubGVmdCArPSBuZXdWYWx1ZVxuXHRcdGVsc2UgT2JqZWN0LmtleXModmFsdWVzKS5mb3JFYWNoIChzaWRlKS0+IHZhbHVlc1tzaWRlXSArPSBuZXdWYWx1ZVxuXHRcblx0XCIje3ZhbHVlcy50b3B9cHggI3t2YWx1ZXMucmlnaHR9cHggI3t2YWx1ZXMuYm90dG9tfXB4ICN7dmFsdWVzLmxlZnR9cHhcIlxuXG5cblxuXG5cblxuXG5cbiIsInN2Z05hbWVzcGFjZSA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZydcbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcbmltcG9ydCAqIGFzIENTUyBmcm9tICdxdWlja2NzcydcbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcbmltcG9ydCAqIGFzIGV4dGVuZCBmcm9tICdzbWFydC1leHRlbmQnXG5pbXBvcnQgJy4vcGFydHMvYWxsb3dlZE9wdGlvbnMnXG5pbXBvcnQgJy4vcGFydHMvaGVscGVycydcbmltcG9ydCAnLi9wYXJ0cy9jaGVja3MnXG5pbXBvcnQgJy4vcGFydHMvZWxlbWVudCdcbmltcG9ydCAnLi9wYXJ0cy93aW5kb3cnXG5pbXBvcnQgJy4vcGFydHMvbWVkaWFRdWVyeSdcblxuUXVpY2tEb20gPSAoKS0+IGFyZ3M9YXJndW1lbnRzOyBzd2l0Y2hcblx0d2hlbiBJUy5hcnJheShhcmdzWzBdKVxuXHRcdHJldHVybiBRdWlja0RvbShhcmdzWzBdLi4uKVxuXHRcblx0d2hlbiBJUy50ZW1wbGF0ZShhcmdzWzBdKVxuXHRcdHJldHVybiBhcmdzWzBdLnNwYXduKClcblx0XG5cdHdoZW4gSVMucXVpY2tEb21FbChhcmdzWzBdKVxuXHRcdHJldHVybiBpZiBhcmdzWzFdIHRoZW4gYXJnc1swXS51cGRhdGVPcHRpb25zKGFyZ3NbMV0pIGVsc2UgYXJnc1swXVxuXHRcblx0d2hlbiBJUy5kb21Ob2RlKGFyZ3NbMF0pIG9yIElTLmRvbURvYyhhcmdzWzBdKVxuXHRcdGlmIGFyZ3NbMF0uX3F1aWNrRWxlbWVudFxuXHRcdFx0cmV0dXJuIGFyZ3NbMF0uX3F1aWNrRWxlbWVudFxuXHRcdFxuXHRcdHR5cGUgPSBhcmdzWzBdLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnIycsICcnKVxuXHRcdG9wdGlvbnMgPSBhcmdzWzFdIG9yIHt9XG5cdFx0b3B0aW9ucy5leGlzdGluZyA9IGFyZ3NbMF1cblx0XHRyZXR1cm4gbmV3IFF1aWNrRWxlbWVudCh0eXBlLCBvcHRpb25zKVxuXG5cdHdoZW4gYXJnc1swXSBpcyB3aW5kb3dcblx0XHRyZXR1cm4gUXVpY2tXaW5kb3dcblxuXHR3aGVuIElTLnN0cmluZyhhcmdzWzBdKVx0XHRcdFxuXHRcdHR5cGUgPSBhcmdzWzBdLnRvTG93ZXJDYXNlKClcblx0XHRpZiB0eXBlIGlzICd0ZXh0J1xuXHRcdFx0b3B0aW9ucyA9IGlmIElTLm9iamVjdChhcmdzWzFdKSB0aGVuIGFyZ3NbMV0gZWxzZSB7dGV4dDphcmdzWzFdIG9yICcnfVxuXHRcdGVsc2Vcblx0XHRcdG9wdGlvbnMgPSBpZiBJUy5vYmplY3QoYXJnc1sxXSkgdGhlbiBhcmdzWzFdIGVsc2Uge31cblx0XHRcblx0XHRlbGVtZW50ID0gbmV3IFF1aWNrRWxlbWVudCh0eXBlLCBvcHRpb25zKVxuXHRcdGlmIGFyZ3MubGVuZ3RoID4gMlxuXHRcdFx0Y2hpbGRyZW4gPSBbXTsgaSA9IDE7IGFyZ3NMZW5ndGggPSBhcmdzLmxlbmd0aDsgY2hpbGRyZW4ucHVzaChhcmdzW2ldKSB3aGlsZSArK2kgPCBhcmdzTGVuZ3RoXG5cblx0XHRcdGZvciBjaGlsZCBpbiBjaGlsZHJlblxuXHRcdFx0XHRjaGlsZCA9IFF1aWNrRG9tLnRleHQoY2hpbGQpIGlmIElTLnN0cmluZyhjaGlsZClcblx0XHRcdFx0Y2hpbGQgPSBjaGlsZC5zcGF3bihmYWxzZSkgaWYgSVMudGVtcGxhdGUoY2hpbGQpXG5cdFx0XHRcdGNoaWxkID0gUXVpY2tEb20oY2hpbGQuLi4pIGlmIElTLmFycmF5KGNoaWxkKVxuXHRcdFx0XHRjaGlsZC5hcHBlbmRUbyhlbGVtZW50KSBpZiBJUy5xdWlja0RvbUVsKGNoaWxkKVxuXG5cdFx0cmV0dXJuIGVsZW1lbnRcblxuXHR3aGVuIGFyZ3NbMF0gYW5kIChJUy5kb21Ob2RlKGFyZ3NbMF1bMF0pIG9yIElTLmRvbURvYyhhcmdzWzBdWzBdKSlcblx0XHRyZXR1cm4gUXVpY2tEb20oYXJnc1swXVswXSlcblxuXG5RdWlja0RvbS50ZW1wbGF0ZSA9ICh0cmVlKS0+XG5cdG5ldyBRdWlja1RlbXBsYXRlKHRyZWUsIHRydWUpXG5cblxuUXVpY2tEb20uaHRtbCA9IChpbm5lckhUTUwpLT5cblx0Y29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0Y29udGFpbmVyLmlubmVySFRNTCA9IGlubmVySFRNTFxuXHRjaGlsZHJlbiA9IEFycmF5OjpzbGljZS5jYWxsIGNvbnRhaW5lci5jaGlsZE5vZGVzXG5cblx0cmV0dXJuIFF1aWNrRG9tLmJhdGNoKGNoaWxkcmVuKVxuXG5RdWlja0RvbS5xdWVyeSA9ICh0YXJnZXQpLT5cblx0UXVpY2tEb20oZG9jdW1lbnQpLnF1ZXJ5KHRhcmdldClcblxuUXVpY2tEb20ucXVlcnlBbGwgPSAodGFyZ2V0KS0+XG5cdFF1aWNrRG9tKGRvY3VtZW50KS5xdWVyeUFsbCh0YXJnZXQpXG5cblF1aWNrRG9tLmlzVGVtcGxhdGUgPSAodGFyZ2V0KS0+XG5cdElTLnRlbXBsYXRlKHRhcmdldClcblxuUXVpY2tEb20uaXNRdWlja0VsID0gKHRhcmdldCktPlxuXHRJUy5xdWlja0RvbUVsKHRhcmdldClcblxuUXVpY2tEb20uaXNFbCA9ICh0YXJnZXQpLT5cblx0SVMuZG9tRWwodGFyZ2V0KVxuXG5cblxuXG5cbmltcG9ydCAnLi9wYXJ0cy9iYXRjaCdcbmltcG9ydCAnLi9wYXJ0cy90ZW1wbGF0ZSdcbmltcG9ydCAnLi9wYXJ0cy9zaG9ydGN1dHMnXG5RdWlja0RvbS52ZXJzaW9uID0gaW1wb3J0ICcuLi9wYWNrYWdlLmpzb24gJCB2ZXJzaW9uJ1xuUXVpY2tEb20uQ1NTID0gQ1NTXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrRG9tXG5cblxuXG4iLCJhbGxvd2VkVGVtcGxhdGVPcHRpb25zID0gWyAjIFRvIGNvcHkgZnJvbSBET00gRWxlbWVudHNcblx0J2lkJ1xuXHQnbmFtZSdcblx0J3R5cGUnXG5cdCdocmVmJ1xuXHQnc2VsZWN0ZWQnXG5cdCdjaGVja2VkJ1xuXHQnY2xhc3NOYW1lJ1xuXVxuXG5hbGxvd2VkT3B0aW9ucyA9IFsgIyBVc2VkIGluIFF1aWNrRWxlbWVudDo6dG9KU09OXG5cdCdpZCdcblx0J3JlZidcblx0J3R5cGUnXG5cdCduYW1lJ1xuXHQndGV4dCdcblx0J3N0eWxlJ1xuXHQnY2xhc3MnXG5cdCdjbGFzc05hbWUnXG5cdCd1cmwnXG5cdCdocmVmJ1xuXHQnc2VsZWN0ZWQnXG5cdCdjaGVja2VkJ1xuXHQncHJvcHMnXG5cdCdhdHRycydcblx0J3Bhc3NTdGF0ZVRvQ2hpbGRyZW4nXG5cdCdzdGF0ZVRyaWdnZXJzJ1xuXHQjICdyZWxhdGVkSW5zdGFuY2UnXG5dIiwiaGVscGVycyA9IHt9XG5cbmhlbHBlcnMuaW5jbHVkZXMgPSAodGFyZ2V0LCBpdGVtKS0+XG5cdHRhcmdldCBhbmQgdGFyZ2V0LmluZGV4T2YoaXRlbSkgaXNudCAtMVxuXG5oZWxwZXJzLnJlbW92ZUl0ZW0gPSAodGFyZ2V0LCBpdGVtKS0+XG5cdGl0ZW1JbmRleCA9IHRhcmdldC5pbmRleE9mKGl0ZW0pXG5cdHRhcmdldC5zcGxpY2UoaXRlbUluZGV4LCAxKSAgaWYgaXRlbUluZGV4IGlzbnQgLTFcblx0cmV0dXJuIHRhcmdldFxuXG5oZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwgPSAodGFyZ2V0RWwpLT4gc3dpdGNoXG5cdHdoZW4gSVMuc3RyaW5nKHRhcmdldEVsKSB0aGVuIFF1aWNrRG9tLnRleHQodGFyZ2V0RWwpXG5cdHdoZW4gSVMuZG9tTm9kZSh0YXJnZXRFbCkgdGhlbiBRdWlja0RvbSh0YXJnZXRFbClcblx0d2hlbiBJUy50ZW1wbGF0ZSh0YXJnZXRFbCkgdGhlbiB0YXJnZXRFbC5zcGF3bigpXG5cdGVsc2UgdGFyZ2V0RWxcblxuXG5oZWxwZXJzLmlzU3RhdGVTdHlsZSA9IChzdHJpbmcpLT5cblx0c3RyaW5nWzBdIGlzICckJyBvciBzdHJpbmdbMF0gaXMgJ0AnXG5cblxuaGVscGVycy5yZWdpc3RlclN0eWxlID0gKHJ1bGUsIGxldmVsLCBpbXBvcnRhbnQpLT5cblx0bGV2ZWwgfHw9IDBcblx0Y2FjaGVkID0gc3R5bGVDYWNoZS5nZXQocnVsZSwgbGV2ZWwpXG5cdHJldHVybiBjYWNoZWQgaWYgY2FjaGVkXG5cdG91dHB1dCA9IHtjbGFzc05hbWU6W0NTUy5yZWdpc3RlcihydWxlLCBsZXZlbCwgaW1wb3J0YW50KV0sIGZuczpbXSwgcnVsZX1cblx0cHJvcHMgPSBPYmplY3Qua2V5cyhydWxlKVxuXHRcblx0Zm9yIHByb3AgaW4gcHJvcHMgd2hlbiB0eXBlb2YgcnVsZVtwcm9wXSBpcyAnZnVuY3Rpb24nXG5cdFx0b3V0cHV0LmZucy5wdXNoIFtwcm9wLCBydWxlW3Byb3BdXVxuXG5cdHJldHVybiBzdHlsZUNhY2hlLnNldChydWxlLCBvdXRwdXQsIGxldmVsKVxuXG5cbnN0eWxlQ2FjaGUgPSBuZXcgY2xhc3Ncblx0Y29uc3RydWN0b3I6ICgpLT5cblx0XHRAa2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRAdmFsdWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG5cdGdldDogKGtleSwgbGV2ZWwpLT4gaWYgQGtleXNbbGV2ZWxdXG5cdFx0aW5kZXggPSBAa2V5c1tsZXZlbF0uaW5kZXhPZihrZXkpXG5cdFx0cmV0dXJuIEB2YWx1ZXNbbGV2ZWxdW2luZGV4XSBpZiBpbmRleCBpc250IC0xXG5cblx0c2V0OiAoa2V5LCB2YWx1ZSwgbGV2ZWwpLT5cblx0XHRpZiBub3QgQGtleXNbbGV2ZWxdXG5cdFx0XHRAa2V5c1tsZXZlbF0gPSBbXVxuXHRcdFx0QHZhbHVlc1tsZXZlbF0gPSBbXVxuXG5cdFx0QGtleXNbbGV2ZWxdLnB1c2gga2V5XG5cdFx0QHZhbHVlc1tsZXZlbF0ucHVzaCB2YWx1ZVxuXHRcdHJldHVybiB2YWx1ZVxuXG4iLCJJUyA9IGltcG9ydCAnQGRhbmllbGthbGVuL2lzJ1xuSVMgPSBJUy5jcmVhdGUoJ25hdGl2ZXMnLCdkb20nKVxuSVMubG9hZFx0XG5cdHF1aWNrRG9tRWw6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3QuY29uc3RydWN0b3IubmFtZSBpcyBRdWlja0VsZW1lbnQubmFtZVxuXHRcblx0dGVtcGxhdGU6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3QuY29uc3RydWN0b3IubmFtZSBpcyBRdWlja1RlbXBsYXRlLm5hbWVcblx0XG5cdCMgYmF0Y2g6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3QuY29uc3RydWN0b3IubmFtZSBpcyAnUXVpY2tCYXRjaCdcblxuIiwiY2xhc3MgUXVpY2tFbGVtZW50XG5cdGNvbnN0cnVjdG9yOiAoQHR5cGUsIEBvcHRpb25zKS0+XG5cdFx0QHN2ZyA9IHRydWUgaWYgQHR5cGVbMF0gaXMgJyonXG5cdFx0QGVsID0gQG9wdGlvbnMuZXhpc3Rpbmcgb3Jcblx0XHRcdGlmIEB0eXBlIGlzICd0ZXh0JyB0aGVuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGlmIHR5cGVvZiBAb3B0aW9ucy50ZXh0IGlzICdzdHJpbmcnIHRoZW4gQG9wdGlvbnMudGV4dCBlbHNlICcnKVxuXHRcdFx0ZWxzZSBpZiBAc3ZnIHRoZW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Z05hbWVzcGFjZSwgQHR5cGUuc2xpY2UoMSkpXG5cdFx0XHRlbHNlIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoQHR5cGUpXG5cblx0XHRpZiBAdHlwZSBpcyAndGV4dCdcblx0XHRcdEBhcHBlbmQgPSBAcHJlcGVuZCA9IEBhdHRyID0gKCktPlxuXHRcdFx0IyBAX3RleHRzID0ge30gIyBkZWZpbmVkIGNvbmRpdGlvbmFsbHlcblxuXHRcdEBfcGFyZW50ID0gbnVsbFxuXHRcdEBfc3R5bGVzID0ge31cblx0XHRAX3N0YXRlID0gW11cblx0XHRAX2NoaWxkcmVuID0gW11cblx0XHQjIEBfcHJvdmlkZWRTdGF0ZXMgPSBbXVx0XHRcdFx0IyBkZWZpbmVkIGNvbmRpdGlvbmFsbHlcblx0XHQjIEBfcHJvdmlkZWRTdGF0ZXNTaGFyZWQgPSBbXVx0XHQjIGRlZmluZWQgY29uZGl0aW9uYWxseVxuXHRcdCMgQF9ldmVudENhbGxiYWNrcyA9IHtfX3JlZnM6e319XHQjIGRlZmluZWQgY29uZGl0aW9uYWxseVxuXHRcdFxuXHRcdEBfbm9ybWFsaXplT3B0aW9ucygpXG5cdFx0QF9hcHBseU9wdGlvbnMoKVxuXHRcdEBfYXR0YWNoU3RhdGVFdmVudHMoKVxuXHRcdEBfcHJveHlQYXJlbnQoKVxuXHRcdEBfcmVmcmVzaFBhcmVudCgpIGlmIEBvcHRpb25zLmV4aXN0aW5nXG5cdFx0QGVsLl9xdWlja0VsZW1lbnQgPSBAXG5cblxuXHR0b0pTT046ICgpLT5cblx0XHRvdXRwdXQgPSBbQHR5cGUsIGV4dGVuZC5jbG9uZS5rZXlzKGFsbG93ZWRPcHRpb25zKShAb3B0aW9ucyldXG5cdFx0Y2hpbGRyZW4gPSBAY2hpbGRyZW5cblx0XHRvdXRwdXQucHVzaChjaGlsZC50b0pTT04oKSkgZm9yIGNoaWxkIGluIGNoaWxkcmVuXG5cdFx0cmV0dXJuIG91dHB1dFxuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja0VsZW1lbnQubmFtZSA/PSAnUXVpY2tFbGVtZW50J1xuXG5pbXBvcnQgJy4vYWxpYXNlcydcbmltcG9ydCAnLi90cmF2ZXJzaW5nJ1xuaW1wb3J0ICcuL2luaXQnXG5pbXBvcnQgJy4vZXZlbnRzJ1xuaW1wb3J0ICcuL3N0YXRlJ1xuaW1wb3J0ICcuL3N0eWxlJ1xuaW1wb3J0ICcuL2F0dHJpYnV0ZXMtYW5kLXByb3BlcnRpZXMnXG5pbXBvcnQgJy4vbWFuaXB1bGF0aW9uJ1xuaW1wb3J0ICcuL2FwcGxpY2F0aW9uJ1xuIiwiUXVpY2tXaW5kb3cgPSBcblx0dHlwZTogJ3dpbmRvdydcblx0ZWw6IHdpbmRvd1xuXHRyYXc6IHdpbmRvd1xuXHRfZXZlbnRDYWxsYmFja3M6IHtfX3JlZnM6e319XG5cdFxuXG5RdWlja1dpbmRvdy5vbiA9ICBRdWlja0VsZW1lbnQ6Om9uXG5RdWlja1dpbmRvdy5vZmYgPSAgUXVpY2tFbGVtZW50OjpvZmZcblF1aWNrV2luZG93LmVtaXQgPSAgUXVpY2tFbGVtZW50OjplbWl0XG5RdWlja1dpbmRvdy5lbWl0UHJpdmF0ZSA9ICBRdWlja0VsZW1lbnQ6OmVtaXRQcml2YXRlXG5RdWlja1dpbmRvdy5fbGlzdGVuVG8gPSAgUXVpY2tFbGVtZW50OjpfbGlzdGVuVG9cblF1aWNrV2luZG93Ll9pbnZva2VIYW5kbGVycyA9ICBRdWlja0VsZW1lbnQ6Ol9pbnZva2VIYW5kbGVyc1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgUXVpY2tXaW5kb3csXG5cdCd3aWR0aCc6IGdldDogKCktPiB3aW5kb3cuaW5uZXJXaWR0aFxuXHQnaGVpZ2h0JzogZ2V0OiAoKS0+IHdpbmRvdy5pbm5lckhlaWdodFxuXHQnb3JpZW50YXRpb24nOiBvcmllbnRhdGlvbkdldHRlclxuXHQnYXNwZWN0UmF0aW8nOiBhc3BlY3RSYXRpb0dldHRlclxuXG4iLCJNZWRpYVF1ZXJ5ID0gbmV3ICgpLT5cblx0Y2FsbGJhY2tzID0gW11cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgKCktPlxuXHRcdGNhbGxiYWNrKCkgZm9yIGNhbGxiYWNrIGluIGNhbGxiYWNrc1xuXHRcdHJldHVyblxuXG5cdEBwYXJzZVF1ZXJ5ID0gKHRhcmdldCwgcXVlcnlTdHJpbmcpLT5cblx0XHRxdWVyeVNwbGl0ID0gcXVlcnlTdHJpbmcuc3BsaXQoJygnKVxuXHRcdHNvdXJjZSA9IHF1ZXJ5U3BsaXRbMF1cblx0XHRzb3VyY2UgPSBzd2l0Y2ggc291cmNlXG5cdFx0XHR3aGVuICd3aW5kb3cnIHRoZW4gUXVpY2tXaW5kb3dcblx0XHRcdHdoZW4gJ3BhcmVudCcgdGhlbiB0YXJnZXQucGFyZW50XG5cdFx0XHR3aGVuICdzZWxmJyB0aGVuIHRhcmdldFxuXHRcdFx0ZWxzZSB0YXJnZXQucGFyZW50TWF0Y2hpbmcgKHBhcmVudCktPiBwYXJlbnQucmVmIGlzIHNvdXJjZS5zbGljZSgxKVxuXG5cdFx0cnVsZXMgPSBxdWVyeVNwbGl0WzFdXG5cdFx0XHQuc2xpY2UoMCwtMSlcblx0XHRcdC5zcGxpdChydWxlRGVsaW1pdGVyKVxuXHRcdFx0Lm1hcCAocnVsZSktPiBcblx0XHRcdFx0c3BsaXQgPSBydWxlLnNwbGl0KCc6Jylcblx0XHRcdFx0dmFsdWUgPSBwYXJzZUZsb2F0KHNwbGl0WzFdKVxuXHRcdFx0XHR2YWx1ZSA9IHNwbGl0WzFdIGlmIGlzTmFOKHZhbHVlKVxuXHRcdFx0XHRrZXkgPSBzcGxpdFswXVxuXHRcdFx0XHRrZXlQcmVmaXggPSBrZXkuc2xpY2UoMCw0KVxuXHRcdFx0XHRtYXggPSBrZXlQcmVmaXggaXMgJ21heC0nXG5cdFx0XHRcdG1pbiA9IG5vdCBtYXggYW5kIGtleVByZWZpeCBpcyAnbWluLSdcblx0XHRcdFx0a2V5ID0ga2V5LnNsaWNlKDQpIGlmIG1heCBvciBtaW5cblx0XHRcdFx0Z2V0dGVyID0gc3dpdGNoIGtleVxuXHRcdFx0XHRcdHdoZW4gJ29yaWVudGF0aW9uJyB0aGVuICgpLT4gc291cmNlLm9yaWVudGF0aW9uXG5cdFx0XHRcdFx0d2hlbiAnYXNwZWN0LXJhdGlvJyB0aGVuICgpLT4gc291cmNlLmFzcGVjdFJhdGlvXG5cdFx0XHRcdFx0d2hlbiAnd2lkdGgnLCdoZWlnaHQnIHRoZW4gKCktPiBzb3VyY2Vba2V5XVxuXHRcdFx0XHRcdGVsc2UgKCktPlxuXHRcdFx0XHRcdFx0c3RyaW5nVmFsdWUgPSBzb3VyY2Uuc3R5bGUoa2V5KVxuXHRcdFx0XHRcdFx0cGFyc2VkVmFsdWUgPSBwYXJzZUZsb2F0IHN0cmluZ1ZhbHVlXG5cdFx0XHRcdFx0XHRyZXR1cm4gaWYgaXNOYU4ocGFyc2VkVmFsdWUpIHRoZW4gc3RyaW5nVmFsdWUgZWxzZSBwYXJzZWRWYWx1ZVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIHtrZXksdmFsdWUsbWluLG1heCxnZXR0ZXJ9XG5cblx0XHRyZXR1cm4ge3NvdXJjZSwgcnVsZXN9XG5cblxuXHRAcmVnaXN0ZXIgPSAodGFyZ2V0LCBxdWVyeVN0cmluZyktPlxuXHRcdHF1ZXJ5ID0gQHBhcnNlUXVlcnkodGFyZ2V0LCBxdWVyeVN0cmluZylcblx0XHRpZiBxdWVyeS5zb3VyY2Vcblx0XHRcdGNhbGxiYWNrcy5wdXNoIGNhbGxiYWNrID0gKCktPiB0ZXN0UnVsZSh0YXJnZXQsIHF1ZXJ5LCBxdWVyeVN0cmluZylcblx0XHRcdGNhbGxiYWNrKClcblx0XHRyZXR1cm4gcXVlcnlcblxuXG5cdHRlc3RSdWxlID0gKHRhcmdldCwgcXVlcnksIHF1ZXJ5U3RyaW5nKS0+XG5cdFx0cGFzc2VkID0gdHJ1ZVxuXG5cdFx0Zm9yIHJ1bGUgaW4gcXVlcnkucnVsZXNcblx0XHRcdGN1cnJlbnRWYWx1ZSA9IHJ1bGUuZ2V0dGVyKClcblx0XHRcdHBhc3NlZCA9IHN3aXRjaFxuXHRcdFx0XHR3aGVuIHJ1bGUubWluIHRoZW4gY3VycmVudFZhbHVlID49IHJ1bGUudmFsdWVcblx0XHRcdFx0d2hlbiBydWxlLm1heCB0aGVuIGN1cnJlbnRWYWx1ZSA8PSBydWxlLnZhbHVlXG5cdFx0XHRcdGVsc2UgY3VycmVudFZhbHVlIGlzIHJ1bGUudmFsdWVcblxuXHRcdFx0YnJlYWsgaWYgbm90IHBhc3NlZFx0XHRcblx0XHRcblx0XHR0YXJnZXQuc3RhdGUocXVlcnlTdHJpbmcsIHBhc3NlZClcblxuXHRyZXR1cm4gQFxuXG5cblxuXG5ydWxlRGVsaW1pdGVyID0gLyxcXHMqL1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiY2xhc3MgUXVpY2tCYXRjaFxuXHRjb25zdHJ1Y3RvcjogKGVsZW1lbnRzLCBAcmV0dXJuUmVzdWx0cyktPlxuXHRcdEBlbGVtZW50cyA9IGVsZW1lbnRzLm1hcCAoZWwpLT4gUXVpY2tEb20oZWwpXG5cblx0cmV2ZXJzZTogKCktPlxuXHRcdEBlbGVtZW50cyA9IEBlbGVtZW50cy5yZXZlcnNlKClcblx0XHRyZXR1cm4gQFxuXG5cdHJldHVybjogKHJldHVybk5leHQpLT5cblx0XHRpZiByZXR1cm5OZXh0XG5cdFx0XHRAcmV0dXJuUmVzdWx0cyA9IHRydWVcblx0XHRcdHJldHVybiBAXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIEBsYXN0UmVzdWx0c1xuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja0JhdGNoLm5hbWUgPz0gJ1F1aWNrQmF0Y2gnXG5cblxuXG5PYmplY3Qua2V5cyhRdWlja0VsZW1lbnQ6OikuY29uY2F0KCdjc3MnLCAncmVwbGFjZVdpdGgnLCAnaHRtbCcsICd0ZXh0JykuZm9yRWFjaCAobWV0aG9kKS0+XG5cdFF1aWNrQmF0Y2g6OlttZXRob2RdID0gKG5ld1ZhbHVlKS0+XG5cdFx0cmVzdWx0cyA9IEBsYXN0UmVzdWx0cyA9IGZvciBlbGVtZW50IGluIEBlbGVtZW50c1xuXHRcdFx0aWYgbWV0aG9kIGlzICdodG1sJyBvciBtZXRob2QgaXMgJ3RleHQnXG5cdFx0XHRcdGlmIG5ld1ZhbHVlIHRoZW4gZWxlbWVudFttZXRob2RdID0gbmV3VmFsdWUgZWxzZSBlbGVtZW50W21ldGhvZF1cblx0XHRcdGVsc2Vcblx0XHRcdFx0ZWxlbWVudFttZXRob2RdKGFyZ3VtZW50cy4uLilcblx0XHRcblx0XHRyZXR1cm4gaWYgQHJldHVyblJlc3VsdHMgdGhlbiByZXN1bHRzIGVsc2UgQFxuXG5cblF1aWNrRG9tLmJhdGNoID0gKGVsZW1lbnRzLCByZXR1cm5SZXN1bHRzKS0+XG5cdGlmIG5vdCBJUy5pdGVyYWJsZShlbGVtZW50cylcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYXRjaDogZXhwZWN0ZWQgYW4gaXRlcmFibGUsIGdvdCAje1N0cmluZyhlbGVtZW50cyl9XCIpXG5cdGVsc2UgaWYgbm90IGVsZW1lbnRzLmxlbmd0aFxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhdGNoOiBleHBlY3RlZCBhIG5vbi1lbXB0eSBlbGVtZW50IGNvbGxlY3Rpb25cIilcblxuXHRyZXR1cm4gbmV3IFF1aWNrQmF0Y2goZWxlbWVudHMsIHJldHVyblJlc3VsdHMpXG5cblxuIiwiaW1wb3J0ICcuL2V4dGVuZFRlbXBsYXRlJ1xuaW1wb3J0ICcuL3BhcnNlVHJlZSdcbmltcG9ydCAnLi9zY2hlbWEnXG5cbmNsYXNzIFF1aWNrVGVtcGxhdGVcblx0Y29uc3RydWN0b3I6IChjb25maWcsIGlzVHJlZSktPlxuXHRcdHJldHVybiBjb25maWcgaWYgSVMudGVtcGxhdGUoY29uZmlnKVxuXHRcdGNvbmZpZyA9IGlmIGlzVHJlZSB0aGVuIHBhcnNlVHJlZShjb25maWcpIGVsc2UgY29uZmlnXG5cdFx0ZXh0ZW5kIEAsIGNvbmZpZ1xuXHRcdEBfaGFzQ29tcHV0ZXJzID0gISFAb3B0aW9ucy5jb21wdXRlcnNcblxuXHRcdGlmIG5vdCBAX2hhc0NvbXB1dGVycyBhbmQgQGNoaWxkcmVuLmxlbmd0aFxuXHRcdFx0Zm9yIGNoaWxkIGluIEBjaGlsZHJlbiB3aGVuIGNoaWxkLl9oYXNDb21wdXRlcnMgb3IgY2hpbGQub3B0aW9ucy5jb21wdXRlcnNcblx0XHRcdFx0QF9oYXNDb21wdXRlcnMgPSB0cnVlXG5cdFx0XHRcdGJyZWFrXG5cdFxuXHRleHRlbmQ6IChuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpLT5cblx0XHRuZXcgUXVpY2tUZW1wbGF0ZSBleHRlbmRUZW1wbGF0ZShALCBuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpXG5cblx0c3Bhd246IChuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpLT5cblx0XHRpZiBuZXdWYWx1ZXMgYW5kIG5ld1ZhbHVlcy5kYXRhXG5cdFx0XHRkYXRhID0gbmV3VmFsdWVzLmRhdGFcblx0XHRcdG5ld1ZhbHVlcyA9IG51bGwgaWYgT2JqZWN0LmtleXMobmV3VmFsdWVzKS5sZW5ndGggaXMgMVxuXHRcdFxuXHRcdGlmIG5ld1ZhbHVlcyBvciBnbG9iYWxPcHRzXG5cdFx0XHRvcHRzID0gZXh0ZW5kVGVtcGxhdGUoQCwgbmV3VmFsdWVzLCBnbG9iYWxPcHRzKVxuXHRcdGVsc2Vcblx0XHRcdG9wdHMgPSBleHRlbmQuY2xvbmUoQClcblx0XHRcdG9wdHMub3B0aW9ucyA9IGV4dGVuZC5jbG9uZShvcHRzLm9wdGlvbnMpXG5cdFxuXG5cdFx0ZWxlbWVudCA9IFF1aWNrRG9tKG9wdHMudHlwZSwgb3B0cy5vcHRpb25zLCBvcHRzLmNoaWxkcmVuLi4uKVxuXG5cdFx0aWYgQF9oYXNDb21wdXRlcnNcblx0XHRcdGlmIG5ld1ZhbHVlcyBpc250IGZhbHNlXG5cdFx0XHRcdGVsZW1lbnQuYXBwbHlEYXRhKGRhdGEpXG5cdFx0XHRpZiBlbGVtZW50Lm9wdGlvbnMuY29tcHV0ZXJzPy5faW5pdFxuXHRcdFx0XHRlbGVtZW50Ll9ydW5Db21wdXRlcignX2luaXQnLCBkYXRhKVxuXG5cdFx0cmV0dXJuIGVsZW1lbnRcblxuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja1RlbXBsYXRlLm5hbWUgPz0gJ1F1aWNrVGVtcGxhdGUnXG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5IFF1aWNrVGVtcGxhdGU6OiwgJ2NoaWxkJywgZ2V0OiAoKS0+XG5cdEBfY2hpbGRSZWZzIG9yIF9nZXRDaGlsZFJlZnMoQCkgIyBzb3VyY2UgaW4gL3NyYy9wYXJ0cy9lbGVtZW50L3RyYXZlcnNpbmcuY29mZmVlXG5cblxuXG5cblxuXG5cblxuIiwic2hvcnRjdXRzID0gW1xuXHQnbGluazphJ1xuXHQnYW5jaG9yOmEnXG5cdCdhJ1xuXHQndGV4dCdcblx0J2Rpdidcblx0J3NwYW4nXG5cdCdoMSdcblx0J2gyJ1xuXHQnaDMnXG5cdCdoNCdcblx0J2g1J1xuXHQnaDYnXG5cdCdoZWFkZXInXG5cdCdmb290ZXInXG5cdCdzZWN0aW9uJ1xuXHQnYnV0dG9uJ1xuXHQnYnInXG5cdCd1bCdcblx0J29sJ1xuXHQnbGknXG5cdCdmaWVsZHNldCdcblx0J2lucHV0J1xuXHQndGV4dGFyZWEnXG5cdCdzZWxlY3QnXG5cdCdvcHRpb24nXG5cdCdmb3JtJ1xuXHQnZnJhbWUnXG5cdCdocidcblx0J2lmcmFtZSdcblx0J2ltZydcblx0J3BpY3R1cmUnXG5cdCdtYWluJ1xuXHQnbmF2J1xuXHQnbWV0YSdcblx0J29iamVjdCdcblx0J3ByZSdcblx0J3N0eWxlJ1xuXHQndGFibGUnXG5cdCd0Ym9keSdcblx0J3RoJ1xuXHQndHInXG5cdCd0ZCdcblx0J3Rmb290J1xuXHQjICd0ZW1wbGF0ZSdcblx0J3ZpZGVvJ1xuXVxuXG5cbmZvciBzaG9ydGN1dCBpbiBzaG9ydGN1dHMgdGhlbiBkbyAoc2hvcnRjdXQpLT5cblx0cHJvcCA9IHR5cGUgPSBzaG9ydGN1dFxuXHRpZiBoZWxwZXJzLmluY2x1ZGVzKHNob3J0Y3V0LCAnOicpXG5cdFx0c3BsaXQgPSBzaG9ydGN1dC5zcGxpdCgnOicpXG5cdFx0cHJvcCA9IHNwbGl0WzBdXG5cdFx0dHlwZSA9IHNwbGl0WzFdXG5cblx0UXVpY2tEb21bcHJvcF0gPSAoKS0+IFF1aWNrRG9tKHR5cGUsIGFyZ3VtZW50cy4uLilcbiIsIntcbiAgXCJfZnJvbVwiOiBcInF1aWNrZG9tQF4xLjAuNzJcIixcbiAgXCJfaWRcIjogXCJxdWlja2RvbUAxLjAuODFcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1vQ2lzUERIR2Y2bENVZmdsOFRnb2hVUTJuUmRQVWNmaFh3eWFuajFReG1wa0xEd0RiaCtJRkJnb3dTUGxhaG9XamQrUFlVRGNtcDlTRk5mL2pCN3BLQT09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3F1aWNrZG9tXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJyYW5nZVwiLFxuICAgIFwicmVnaXN0cnlcIjogdHJ1ZSxcbiAgICBcInJhd1wiOiBcInF1aWNrZG9tQF4xLjAuNzJcIixcbiAgICBcIm5hbWVcIjogXCJxdWlja2RvbVwiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJxdWlja2RvbVwiLFxuICAgIFwicmF3U3BlY1wiOiBcIl4xLjAuNzJcIixcbiAgICBcInNhdmVTcGVjXCI6IG51bGwsXG4gICAgXCJmZXRjaFNwZWNcIjogXCJeMS4wLjcyXCJcbiAgfSxcbiAgXCJfcmVxdWlyZWRCeVwiOiBbXG4gICAgXCIjVVNFUlwiLFxuICAgIFwiL1wiXG4gIF0sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvcXVpY2tkb20vLS9xdWlja2RvbS0xLjAuODEudGd6XCIsXG4gIFwiX3NoYXN1bVwiOiBcIjliNjBjYzdmMzEyNWI2N2E3ZGJlZWFhZDk5OTg5NGQzNGY2NmY5YzVcIixcbiAgXCJfc3BlY1wiOiBcInF1aWNrZG9tQF4xLjAuNzJcIixcbiAgXCJfd2hlcmVcIjogXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJkYW5pZWxrYWxlblwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9xdWlja2RvbS5kZWJ1Zy5qc1wiLFxuICAgIFwiLi9kaXN0L3F1aWNrZG9tLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tkb20vaXNzdWVzXCJcbiAgfSxcbiAgXCJidW5kbGVEZXBlbmRlbmNpZXNcIjogZmFsc2UsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBkYW5pZWxrYWxlbi9pc1wiOiBcIl4yLjAuMFwiLFxuICAgIFwicXVpY2tjc3NcIjogXCJeMS4zLjRcIixcbiAgICBcInNtYXJ0LWV4dGVuZFwiOiBcIl4xLjcuM1wiXG4gIH0sXG4gIFwiZGVwcmVjYXRlZFwiOiBmYWxzZSxcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkZhc3QgJiBsaWdodCBET00gZWxlbWVudCBtYW5hZ2VtZW50IHN1cHBvcnRpbmcganF1ZXJ5LWxpa2UgbWV0aG9kcywgdGVtcGxhdGVzLCAmIHN0YXRlLWJhc2VkIHN0eWxpbmdcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy41LjBcIixcbiAgICBcImNoYWxrXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJjb2ZmZWUtc2NyaXB0XCI6IFwiXjEuMTIuNlwiLFxuICAgIFwiZXhlY2FcIjogXCJeMC43LjBcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4zXCIsXG4gICAgXCJwcm9taXNlLWJyZWFrXCI6IFwiXjAuMS4yXCIsXG4gICAgXCJzZW12ZXJcIjogXCJeNS4zLjBcIlxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2RvbSNyZWFkbWVcIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwibWFpblwiOiBcImRpc3QvcXVpY2tkb20uanNcIixcbiAgXCJuYW1lXCI6IFwicXVpY2tkb21cIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tkb20uZ2l0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLi8uY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwibnBtIHJ1biB0ZXN0OnRyYXZpc1wiLFxuICAgIFwidGVzdFwiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6YnJvd3NlclwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBFbGVjdHJvbiAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmNocm9tZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgQ2hyb21lIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6ZmlyZWZveFwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBGaXJlZm94IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6a2FybWFcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmxvY2FsXCI6IFwib3BlbiB0ZXN0L3Rlc3RydW5uZXIuaHRtbFwiLFxuICAgIFwidGVzdDptaW5pZmllZFwiOiBcIm1pbmlmaWVkPTEgbnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnRyYXZpc1wiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zICYmIG5wbSBydW4gdGVzdDptaW5pZmllZCAtc1wiLFxuICAgIFwid2F0Y2hcIjogXCJjYWtlIC1kIHdhdGNoXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXN1cGVyXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktcmVuYW1lXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc2ltcGxlXCJcbiAgICBdXG4gIH0sXG4gIFwidmVyc2lvblwiOiBcIjEuMC44MVwiXG59XG4iLCJJUyA9IF8kc20oJ0BkYW5pZWxrYWxlbi9pcycgKVxuSVMgPSBJUy5jcmVhdGUoJ25hdGl2ZXMnLCdkb20nKVxuSVMubG9hZFxuXHRmaWVsZDogKHRhcmdldCktPiB0YXJnZXQgYW5kIHRhcmdldCBpbnN0YW5jZW9mIHJlcXVpcmUoJy4vZmllbGQnKVxuXHRyZWdleDogKHRhcmdldCktPiB0YXJnZXQgaW5zdGFuY2VvZiBSZWdFeHBcblx0b2JqZWN0YWJsZTogKHRhcmdldCktPiBJUy5vYmplY3QodGFyZ2V0KSBvciBJUy5mdW5jdGlvbih0YXJnZXQpXG5cbm1vZHVsZS5leHBvcnRzID0gSVMiLCJleHRlbmQgPSByZXF1aXJlICcuL2V4dGVuZCdcblxubm9ybWFsaXplS2V5cyA9IChrZXlzKS0+IGlmIGtleXNcblx0b3V0cHV0ID0ge31cblx0aWYgdHlwZW9mIGtleXMgaXNudCAnb2JqZWN0J1xuXHRcdG91dHB1dFtrZXlzXSA9IHRydWVcblx0ZWxzZVxuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhrZXlzKSBpZiBub3QgQXJyYXkuaXNBcnJheShrZXlzKVxuXHRcdG91dHB1dFtrZXldID0gdHJ1ZSBmb3Iga2V5IGluIGtleXNcblxuXHRyZXR1cm4gb3V0cHV0XG5cblxubmV3QnVpbGRlciA9IChpc0Jhc2UpLT5cblx0YnVpbGRlciA9ICh0YXJnZXQpLT5cblx0XHRFWFBBTkRfQVJHVU1FTlRTKHNvdXJjZXMpXG5cdFx0aWYgYnVpbGRlci5vcHRpb25zLnRhcmdldFxuXHRcdFx0dGhlVGFyZ2V0ID0gYnVpbGRlci5vcHRpb25zLnRhcmdldFxuXHRcdGVsc2Vcblx0XHRcdHRoZVRhcmdldCA9IHRhcmdldFxuXHRcdFx0c291cmNlcy5zaGlmdCgpXG5cdFx0XG5cdFx0ZXh0ZW5kKGJ1aWxkZXIub3B0aW9ucywgdGhlVGFyZ2V0LCBzb3VyY2VzKVxuXHRcblx0YnVpbGRlci5pc0Jhc2UgPSB0cnVlIGlmIGlzQmFzZVxuXHRidWlsZGVyLm9wdGlvbnMgPSB7fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyhidWlsZGVyLCBtb2RpZmllcnMpXG5cdHJldHVybiBidWlsZGVyXG5cblxubW9kaWZpZXJzID0gXG5cdCdkZWVwJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLmRlZXAgPSB0cnVlXG5cdFx0cmV0dXJuIF9cblxuXHQnb3duJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLm93biA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdhbGxvd051bGwnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMuYWxsb3dOdWxsID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J251bGxEZWxldGVzJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLm51bGxEZWxldGVzID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J2NvbmNhdCc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5jb25jYXQgPSB0cnVlXG5cdFx0cmV0dXJuIF9cblxuXHQnY2xvbmUnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMudGFyZ2V0ID0ge31cblx0XHRyZXR1cm4gX1xuXG5cdCdub3REZWVwJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuIChrZXlzKS0+XG5cdFx0XHRfLm9wdGlvbnMubm90RGVlcCA9IG5vcm1hbGl6ZUtleXMoa2V5cylcdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblx0J2RlZXBPbmx5JzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuIChrZXlzKS0+XG5cdFx0XHRfLm9wdGlvbnMuZGVlcE9ubHkgPSBub3JtYWxpemVLZXlzKGtleXMpXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cdCdrZXlzJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuIChrZXlzKS0+XG5cdFx0XHRfLm9wdGlvbnMua2V5cyA9IG5vcm1hbGl6ZUtleXMoa2V5cylcdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblx0J25vdEtleXMnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKGtleXMpLT5cblx0XHRcdF8ub3B0aW9ucy5ub3RLZXlzID0gbm9ybWFsaXplS2V5cyhrZXlzKVx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXHQndHJhbnNmb3JtJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuICh0cmFuc2Zvcm0pLT5cblx0XHRcdGlmIHR5cGVvZiB0cmFuc2Zvcm0gaXMgJ2Z1bmN0aW9uJ1xuXHRcdFx0XHRfLm9wdGlvbnMuZ2xvYmFsVHJhbnNmb3JtID0gdHJhbnNmb3JtXG5cdFx0XHRlbHNlIGlmIHRyYW5zZm9ybSBhbmQgdHlwZW9mIHRyYW5zZm9ybSBpcyAnb2JqZWN0J1xuXHRcdFx0XHRfLm9wdGlvbnMudHJhbnNmb3JtcyA9IHRyYW5zZm9ybVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cblx0J2ZpbHRlcic6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoZmlsdGVyKS0+XG5cdFx0XHRpZiB0eXBlb2YgZmlsdGVyIGlzICdmdW5jdGlvbidcblx0XHRcdFx0Xy5vcHRpb25zLmdsb2JhbEZpbHRlciA9IGZpbHRlclxuXHRcdFx0ZWxzZSBpZiBmaWx0ZXIgYW5kIHR5cGVvZiBmaWx0ZXIgaXMgJ29iamVjdCdcblx0XHRcdFx0Xy5vcHRpb25zLmZpbHRlcnMgPSBmaWx0ZXJcblx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IG5ld0J1aWxkZXIodHJ1ZSlcbmV4cG9ydHMudmVyc2lvbiA9IGltcG9ydCAnLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbiciLCJ7XG4gIFwiX2FyZ3NcIjogW1xuICAgIFtcbiAgICAgIFwic21hcnQtZXh0ZW5kQDEuNy4zXCIsXG4gICAgICBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIlxuICAgIF1cbiAgXSxcbiAgXCJfZnJvbVwiOiBcInNtYXJ0LWV4dGVuZEAxLjcuM1wiLFxuICBcIl9pZFwiOiBcInNtYXJ0LWV4dGVuZEAxLjcuM1wiLFxuICBcIl9pbkJ1bmRsZVwiOiBmYWxzZSxcbiAgXCJfaW50ZWdyaXR5XCI6IFwic2hhNTEyLVBWRUVWWUREenl4S0EwR05GTGNXWTZvSlNrUUtkYzF3NzE4ZVFwRUhjTnVUU1dZeERLMzVHemhzR2hNa1VVOGxCSWdTRURidDV4NXA0NnBSejNBdWJBPT1cIixcbiAgXCJfbG9jYXRpb25cIjogXCIvc21hcnQtZXh0ZW5kXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJ2ZXJzaW9uXCIsXG4gICAgXCJyZWdpc3RyeVwiOiB0cnVlLFxuICAgIFwicmF3XCI6IFwic21hcnQtZXh0ZW5kQDEuNy4zXCIsXG4gICAgXCJuYW1lXCI6IFwic21hcnQtZXh0ZW5kXCIsXG4gICAgXCJlc2NhcGVkTmFtZVwiOiBcInNtYXJ0LWV4dGVuZFwiLFxuICAgIFwicmF3U3BlY1wiOiBcIjEuNy4zXCIsXG4gICAgXCJzYXZlU3BlY1wiOiBudWxsLFxuICAgIFwiZmV0Y2hTcGVjXCI6IFwiMS43LjNcIlxuICB9LFxuICBcIl9yZXF1aXJlZEJ5XCI6IFtcbiAgICBcIi9cIixcbiAgICBcIi9xdWlja2RvbVwiLFxuICAgIFwiL3NpbXBseXdhdGNoXCJcbiAgXSxcbiAgXCJfcmVzb2x2ZWRcIjogXCJodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy9zbWFydC1leHRlbmQvLS9zbWFydC1leHRlbmQtMS43LjMudGd6XCIsXG4gIFwiX3NwZWNcIjogXCIxLjcuM1wiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcImRhbmllbGthbGVuXCJcbiAgfSxcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3NtYXJ0LWV4dGVuZC5kZWJ1Zy5qc1wiLFxuICAgIFwiLi9kaXN0L3NtYXJ0LWV4dGVuZC5qc1wiOiBcInNyYy9pbmRleC5jb2ZmZWVcIlxuICB9LFxuICBcImJyb3dzZXJpZnlcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwic2ltcGx5aW1wb3J0L2NvbXBhdFwiXG4gICAgXVxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3NtYXJ0LWV4dGVuZC9pc3N1ZXNcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJmYWxhZmVsXCI6IFwiXjIuMS4wXCJcbiAgfSxcbiAgXCJkZXNjcmlwdGlvblwiOiBcIk1lcmdlL2V4dGVuZCBvYmplY3RzIChzaGFsbG93L2RlZXApIHdpdGggZ2xvYmFsL2luZGl2aWR1YWwgZmlsdGVycyBhbmQgbW9yZSBmZWF0dXJlc1wiLFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJiYWRnZS1nZW5cIjogXCJeMS4wLjJcIixcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNC43XCIsXG4gICAgXCJjaGFpXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjb2ZmZWUtcmVnaXN0ZXJcIjogXCJeMC4xLjBcIixcbiAgICBcImNvZmZlZWlmeS1jYWNoZWRcIjogXCJeMi4xLjFcIixcbiAgICBcImV4dGVuZFwiOiBcIl4zLjAuMVwiLFxuICAgIFwiZ29vZ2xlLWNsb3N1cmUtY29tcGlsZXItanNcIjogXCJeMjAxNzA2MjYuMC4wXCIsXG4gICAgXCJtb2NoYVwiOiBcIl4zLjIuMFwiLFxuICAgIFwic2ltcGx5aW1wb3J0XCI6IFwiXjQuMC4wLXMyMVwiLFxuICAgIFwic2ltcGx5d2F0Y2hcIjogXCJeMy4wLjAtbDJcIixcbiAgICBcInVnbGlmeS1qc1wiOiBcIl4zLjAuMjRcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3NtYXJ0LWV4dGVuZCNyZWFkbWVcIixcbiAgXCJrZXl3b3Jkc1wiOiBbXG4gICAgXCJleHRlbmRcIixcbiAgICBcImNsb25lXCIsXG4gICAgXCJmaWx0ZXJcIixcbiAgICBcInNlbGVjdGl2ZVwiLFxuICAgIFwibWVyZ2VcIixcbiAgICBcImFzc2lnblwiLFxuICAgIFwicHJvcGVydGllc1wiXG4gIF0sXG4gIFwibGljZW5zZVwiOiBcIklTQ1wiLFxuICBcIm1haW5cIjogXCJkaXN0L3NtYXJ0LWV4dGVuZC5qc1wiLFxuICBcIm1vY2hhX29wdHNcIjogXCItdSB0ZGQgLS1jb21waWxlcnMgY29mZmVlOmNvZmZlZS1yZWdpc3RlciAtLXNsb3cgMTAwMCAtLXRpbWVvdXQgNTAwMFwiLFxuICBcIm5hbWVcIjogXCJzbWFydC1leHRlbmRcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vc21hcnQtZXh0ZW5kLmdpdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcIm1rZGlyIC1wIGRpc3QvOyBucG0gcnVuIGJ1aWxkOmRlYnVnICYmIG5wbSBydW4gYnVpbGQ6cmVsZWFzZVwiLFxuICAgIFwiYnVpbGQ6ZGVidWdcIjogXCJzaW1wbHlpbXBvcnQgYnVuZGxlIHNyYy9pbmRleC5jb2ZmZWUgLWQgLS10YXJnZXQgbm9kZSAtLXVtZCBzbWFydC1leHRlbmQgPiBkaXN0L3NtYXJ0LWV4dGVuZC5kZWJ1Zy5qc1wiLFxuICAgIFwiYnVpbGQ6cmVsZWFzZVwiOiBcInNpbXBseWltcG9ydCBidW5kbGUgc3JjL2luZGV4LmNvZmZlZSAtLXRhcmdldCBub2RlIC0tdW1kIHNtYXJ0LWV4dGVuZCA+IGRpc3Qvc21hcnQtZXh0ZW5kLmpzXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcIm5wbSBydW4gY292ZXJhZ2U6cnVuICYmIG5wbSBydW4gY292ZXJhZ2U6YmFkZ2VcIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC5jb25maWcvYmFkZ2VzL2NvdmVyYWdlXCIsXG4gICAgXCJjb3ZlcmFnZTpydW5cIjogXCJmb3JDb3ZlcmFnZT10cnVlIGlzdGFuYnVsIGNvdmVyIC0tZGlyIGNvdmVyYWdlIG5vZGVfbW9kdWxlcy9tb2NoYS9iaW4vX21vY2hhIC0tICRucG1fcGFja2FnZV9tb2NoYV9vcHRzXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJwb3N0dmVyc2lvblwiOiBcIm5wbSBydW4gYnVpbGQgJiYgZ2l0IGFkZCAuICYmIGdpdCBjb21taXQgLWEgLW0gJ1tCdWlsZF0nXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcIkNJPTEgbnBtIHJ1biB0ZXN0XCIsXG4gICAgXCJ0ZXN0XCI6IFwibW9jaGEgJG5wbV9wYWNrYWdlX21vY2hhX29wdHNcIixcbiAgICBcIndhdGNoXCI6IFwic2ltcGx5d2F0Y2ggLWcgJ3NyYy8qJyAteCAnbnBtIHJ1biBidWlsZDpkZWJ1ZyAtcydcIlxuICB9LFxuICBcInNpbXBseWltcG9ydFwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJjb2ZmZWVpZnktY2FjaGVkXCIsXG4gICAgICBcIi4vLmNvbmZpZy90cmFuc2Zvcm1zL21hY3Jvc1wiXG4gICAgXSxcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjcuM1wiXG59XG4iLCJDU1MgPSBfJHNtKCdxdWlja2NzcycgKVxubW9kdWxlLmV4cG9ydHMgPSAoKS0+XG4gICAgQ1NTLmFuaW1hdGlvbiAnY2hlY2ttYXJrQW5pbWF0ZVN1Y2Nlc3NUaXAnLFxuICAgICAgICAnMCUsIDU0JSc6ICB7d2lkdGg6MCwgbGVmdDowLCB0b3A6M31cbiAgICAgICAgJzcwJSc6ICAgICAge3dpZHRoOjE0LCBsZWZ0Oi0yLCB0b3A6OH1cbiAgICAgICAgJzg0JSc6ICAgICAge3dpZHRoOjUsIGxlZnQ6NSwgdG9wOjEwfVxuICAgICAgICAnMTAwJSc6ICAgICB7d2lkdGg6OCwgbGVmdDozLCB0b3A6MTB9XG5cblxuICAgIENTUy5hbmltYXRpb24gJ2NoZWNrbWFya0FuaW1hdGVTdWNjZXNzTG9uZycsXG4gICAgICAgICcwJSwgNjUlJzogIHt3aWR0aDowLCByaWdodDoxMiwgdG9wOjEyfVxuICAgICAgICAnODQlJzogICAgICB7d2lkdGg6MTQsIHJpZ2h0OjAsIHRvcDo3fVxuICAgICAgICAnMTAwJSc6ICAgICB7d2lkdGg6MTIsIHJpZ2h0OjIsIHRvcDo4fVxuXG5cbiAgICBDU1MuYW5pbWF0aW9uICdjaGVja21hcmtBbmltYXRlRXJyb3InLFxuICAgICAgICAnMCUsIDY1JSc6ICB0cmFuc2Zvcm06ICdzY2FsZSgwLjQpJywgb3BhY2l0eTogMFxuICAgICAgICAnODQlJzogICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjE1KSdcbiAgICAgICAgJzEwMCUnOiAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknXG5cblxuICAgIENTUy5hbmltYXRpb24gJ2NoZWNrbWFya1JvdGF0ZVBsYWNlaG9sZGVyJyxcbiAgICAgICAgJzAlLCA1JSc6ICAgdHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG4gICAgICAgICcxMiUsIDEwMCUnOnRyYW5zZm9ybTogJ3JvdGF0ZSgtNDA1ZGVnKSdcblxuXG4gICAgQ1NTLmFuaW1hdGlvbiAnZmllbGRFcnJvclNoYWtlJyxcbiAgICAgICAgJzAlLCA1MCUnOiAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtMTBweCknXG4gICAgICAgICcyNSUsIDc1JSc6IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMTBweCknXG4gICAgICAgICcxMDAlJzogICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMHB4KSdcblxuICAgIG1vZHVsZS5leHBvcnRzID0gKCktPlxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFsnX2dldFZhbHVlJywgJ19zZXRWYWx1ZScsICdfdmFsaWRhdGUnXTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSmpiMjV6ZEdGdWRITXZjbVZ4Um1sbGJHUk5aWFJvYjJSekxtTnZabVpsWlNJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYlhYMD0iLCJoZWxwZXJzID0gaW1wb3J0ICcuLi9oZWxwZXJzJ1xuSVMgPSBpbXBvcnQgJy4uL2NoZWNrcydcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuZmFzdGRvbSA9IGltcG9ydCAnZmFzdGRvbSdcblNpbXBseUJpbmQgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kJ1xuQ29uZGl0aW9uID0gaW1wb3J0ICcuLi9jb21wb25lbnRzL2NvbmRpdGlvbidcbmN1cnJlbnRJRCA9IDBcblxuY2xhc3MgRmllbGRcblx0QGluc3RhbmNlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0QHNoYWxsb3dTZXR0aW5ncyA9IFsndGVtcGxhdGVzJywgJ2ZpZWxkSW5zdGFuY2VzJywgJ3ZhbHVlJywgJ2RlZmF1bHRWYWx1ZSddXG5cdEB0cmFuc2Zvcm1TZXR0aW5ncyA9IGltcG9ydCAnLi90cmFuc2Zvcm1TZXR0aW5ncydcblx0Y29yZVZhbHVlUHJvcDogJ192YWx1ZSdcblx0Z2xvYmFsRGVmYXVsdHM6IGltcG9ydCAnLi9nbG9iYWxEZWZhdWx0cydcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyBGaWVsZDo6LFxuXHRcdCdyZW1vdmVMaXN0ZW5lcic6IGdldDogKCktPiBAb2ZmXG5cdFx0J2Vscyc6IGdldDogKCktPiBAZWwuY2hpbGRcblx0XHQndmFsdWVSYXcnOiBnZXQ6ICgpLT4gQF92YWx1ZVxuXHRcdCd2YWx1ZSc6XG5cdFx0XHRnZXQ6ICgpLT4gaWYgQHNldHRpbmdzLmdldHRlciB0aGVuIEBzZXR0aW5ncy5nZXR0ZXIoQF9nZXRWYWx1ZSgpKSBlbHNlIEBfZ2V0VmFsdWUoKVxuXHRcdFx0c2V0OiAodmFsdWUpLT4gQF9zZXRWYWx1ZShpZiBAc2V0dGluZ3Muc2V0dGVyIHRoZW4gQHNldHRpbmdzLnNldHRlcih2YWx1ZSkgZWxzZSB2YWx1ZSlcblx0XG5cdGNvbnN0cnVjdG9yOiAoc2V0dGluZ3MsIEBidWlsZGVyLCBzZXR0aW5nT3ZlcnJpZGVzLCB0ZW1wbGF0ZU92ZXJyaWRlcyktPlxuXHRcdGlmIHNldHRpbmdPdmVycmlkZXNcblx0XHRcdEBnbG9iYWxEZWZhdWx0cyA9IHNldHRpbmdPdmVycmlkZXMuZ2xvYmFsRGVmYXVsdHMgaWYgc2V0dGluZ092ZXJyaWRlcy5nbG9iYWxEZWZhdWx0c1xuXHRcdFx0QGRlZmF1bHRzID0gc2V0dGluZ092ZXJyaWRlc1tzZXR0aW5ncy50eXBlXSBpZiBzZXR0aW5nT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdXG5cdFx0aWYgdGVtcGxhdGVPdmVycmlkZXMgYW5kIHRlbXBsYXRlT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdXG5cdFx0XHRAdGVtcGxhdGVzID0gdGVtcGxhdGVPdmVycmlkZXNbc2V0dGluZ3MudHlwZV1cblx0XHRcdEB0ZW1wbGF0ZSA9IHRlbXBsYXRlT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdLmRlZmF1bHRcblxuXHRcdHNoYWxsb3dTZXR0aW5ncyA9IGlmIEBzaGFsbG93U2V0dGluZ3MgdGhlbiBGaWVsZC5zaGFsbG93U2V0dGluZ3MuY29uY2F0KEBzaGFsbG93U2V0dGluZ3MpIGVsc2UgRmllbGQuc2hhbGxvd1NldHRpbmdzXG5cdFx0dHJhbnNmb3JtU2V0dGluZ3MgPSBpZiBAdHJhbnNmb3JtU2V0dGluZ3MgdGhlbiBGaWVsZC50cmFuc2Zvcm1TZXR0aW5ncy5jb25jYXQoQHRyYW5zZm9ybVNldHRpbmdzKSBlbHNlIEZpZWxkLnRyYW5zZm9ybVNldHRpbmdzXG5cblx0XHRAc2V0dGluZ3MgPSBleHRlbmQuZGVlcC5jbG9uZS5ub3REZWVwKHNoYWxsb3dTZXR0aW5ncykudHJhbnNmb3JtKHRyYW5zZm9ybVNldHRpbmdzKShAZ2xvYmFsRGVmYXVsdHMsIEBkZWZhdWx0cywgc2V0dGluZ3MpXG5cdFx0QElEID0gQHNldHRpbmdzLklEIG9yIGN1cnJlbnRJRCsrKycnXG5cdFx0QHR5cGUgPSBzZXR0aW5ncy50eXBlXG5cdFx0QG5hbWUgPSBzZXR0aW5ncy5uYW1lXG5cdFx0QGFsbEZpZWxkcyA9IEBzZXR0aW5ncy5maWVsZEluc3RhbmNlcyBvciBGaWVsZC5pbnN0YW5jZXNcblx0XHRAX3ZhbHVlID0gbnVsbFxuXHRcdEBfZXZlbnRDYWxsYmFja3MgPSB7fVxuXHRcdEBzdGF0ZSA9XG5cdFx0XHR2YWxpZDogdHJ1ZVxuXHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0Zm9jdXNlZDogZmFsc2Vcblx0XHRcdGhvdmVyZWQ6IGZhbHNlXG5cdFx0XHRmaWxsZWQ6IGZhbHNlXG5cdFx0XHRpbnRlcmFjdGVkOiBmYWxzZVxuXHRcdFx0aXNNb2JpbGU6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogQHNldHRpbmdzLmRpc2FibGVkXG5cdFx0XHRtYXJnaW46IEBzZXR0aW5ncy5tYXJnaW5cblx0XHRcdHBhZGRpbmc6IEBzZXR0aW5ncy5wYWRkaW5nXG5cdFx0XHR3aWR0aDogQHNldHRpbmdzLndpZHRoXG5cdFx0XHRzaG93TGFiZWw6IEBzZXR0aW5ncy5sYWJlbFxuXHRcdFx0bGFiZWw6IEBzZXR0aW5ncy5sYWJlbFxuXHRcdFx0c2hvd0hlbHA6IEBzZXR0aW5ncy5oZWxwXG5cdFx0XHRoZWxwOiBAc2V0dGluZ3MuaGVscFxuXHRcdFx0c2hvd0Vycm9yOiBmYWxzZVxuXHRcdFx0ZXJyb3I6IEBzZXR0aW5ncy5lcnJvclxuXG5cdFx0aWYgSVMuZGVmaW5lZChAc2V0dGluZ3MucGxhY2Vob2xkZXIpXG5cdFx0XHRAc3RhdGUucGxhY2Vob2xkZXIgPSBAc2V0dGluZ3MucGxhY2Vob2xkZXJcblxuXHRcdGlmIElTLm51bWJlcihAc2V0dGluZ3Mud2lkdGgpIGFuZCBAc2V0dGluZ3Mud2lkdGggPD0gMVxuXHRcdFx0QHN0YXRlLndpZHRoID0gXCIje0BzZXR0aW5ncy53aWR0aCoxMDB9JVwiXG5cblx0XHRpZiBAc2V0dGluZ3MuY29uZGl0aW9ucz8ubGVuZ3RoXG5cdFx0XHRAc3RhdGUudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRDb25kaXRpb24uaW5pdChALCBAc2V0dGluZ3MuY29uZGl0aW9ucylcblxuXHRcdGNvbnNvbGU/Lndhcm4oXCJEdXBsaWNhdGUgZmllbGQgSURzIGZvdW5kOiAnI3tASUR9J1wiKSBpZiBAYWxsRmllbGRzW0BJRF1cblx0XHRAYWxsRmllbGRzW0BJRF0gPSBAXG5cblxuXHRfY29uc3RydWN0b3JFbmQ6ICgpLT5cblx0XHRAZWwuY2hpbGRmIy5maWVsZC5vbiAnaW5zZXJ0ZWQnLCAoKT0+IEBlbWl0KCdpbnNlcnRlZCcpXG5cdFx0QGVsLnJhdy5pZCA9IEBJRCBpZiBAc2V0dGluZ3MuSURcblxuXHRcdEBzZXR0aW5ncy5kZWZhdWx0VmFsdWUgPz0gQHNldHRpbmdzLnZhbHVlIGlmIEBzZXR0aW5ncy52YWx1ZT9cblx0XHRpZiBAc2V0dGluZ3MuZGVmYXVsdFZhbHVlP1xuXHRcdFx0QHZhbHVlID0gaWYgQHNldHRpbmdzLm11bHRpcGxlIHRoZW4gW10uY29uY2F0KEBzZXR0aW5ncy5kZWZhdWx0VmFsdWUpIGVsc2UgQHNldHRpbmdzLmRlZmF1bHRWYWx1ZVxuXG5cdFx0U2ltcGx5QmluZCgnc2hvd0Vycm9yJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ2hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudHJhbnNmb3JtIChzaG93KT0+XG5cdFx0XHRcdGlmIHNob3cgYW5kIEBzdGF0ZS5lcnJvciBhbmQgSVMuc3RyaW5nKEBzdGF0ZS5lcnJvcilcblx0XHRcdFx0XHRAc3RhdGUuZXJyb3Jcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBzZXR0aW5ncy5oZWxwIG9yIEBzdGF0ZS5oZWxwXG5cblx0XHRTaW1wbHlCaW5kKCdlcnJvcicsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCdoZWxwJykub2YoQHN0YXRlKVxuXHRcdFx0LmNvbmRpdGlvbiAoZXJyb3IpPT4gZXJyb3IgYW5kIEBzdGF0ZS5zaG93RXJyb3JcblxuXHRcdFNpbXBseUJpbmQoJ2hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ2h0bWwnKS5vZihAZWwuY2hpbGQuaGVscClcblx0XHRcdC5hbmQudG8oJ3Nob3dIZWxwJykub2YoQHN0YXRlKVxuXG5cdFx0U2ltcGx5QmluZCgnbGFiZWwnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ3RleHQnKS5vZihAZWwuY2hpbGQubGFiZWwpXG5cdFx0XHQuYW5kLnRvKCdzaG93TGFiZWwnKS5vZihAc3RhdGUpXG5cblx0XHRTaW1wbHlCaW5kKCdtYXJnaW4nKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gQGVsLnN0eWxlLmJpbmQoQGVsLCAnbWFyZ2luJylcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdwYWRkaW5nJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvIEBlbC5zdHlsZS5iaW5kKEBlbCwgJ3BhZGRpbmcnKVxuXG5cdFx0U2ltcGx5QmluZCgnc2hvd0hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gKHNob3csIHByZXZTaG93KT0+XG5cdFx0XHRcdGNoYW5nZUFtb3VudCA9IGlmICEhc2hvdyBpcyAhIXByZXZTaG93IHRoZW4gMCBlbHNlIGlmIHNob3cgdGhlbiAyMCBlbHNlIGlmIHByZXZTaG93IHRoZW4gLTIwXG5cdFx0XHRcdEBzdGF0ZS5tYXJnaW4gPSBoZWxwZXJzLnVwZGF0ZVNob3J0aGFuZFZhbHVlKEBzdGF0ZS5tYXJnaW4sICdib3R0b20nLCBjaGFuZ2VBbW91bnQpIGlmIGNoYW5nZUFtb3VudFxuXG5cdFx0U2ltcGx5QmluZCgnZm9jdXNlZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHN0YXRlKS50byAoZm9jdXNlZCk9PlxuXHRcdFx0QGVtaXQoaWYgZm9jdXNlZCB0aGVuICdmb2N1cycgZWxzZSAnYmx1cicpXG5cblx0XHRpZiBAc2V0dGluZ3MubW9iaWxlV2lkdGhcblx0XHRcdFNpbXBseUJpbmQgKCk9PlxuXHRcdFx0XHRmYXN0ZG9tLm1lYXN1cmUgKCk9PiBAc3RhdGUuaXNNb2JpbGUgPSB3aW5kb3cuaW5uZXJXaWR0aCA8PSBAc2V0dGluZ3MubW9iaWxlVGhyZXNob2xkXG5cdFx0XHQudXBkYXRlT24oJ2V2ZW50OnJlc2l6ZScpLm9mKHdpbmRvdylcblxuXHRcdHJldHVybiBAZWwucmF3Ll9xdWlja0ZpZWxkID0gQFxuXG5cblx0X2Zvcm1hdFdpZHRoOiAod2lkdGgpLT5cblx0XHR3aWR0aCA9IGlmIEBzdGF0ZS5pc01vYmlsZSB0aGVuIChAc2V0dGluZ3MubW9iaWxlV2lkdGggb3Igd2lkdGgpIGVsc2Ugd2lkdGhcblx0XHR3aWR0aCA9IFwiY2FsYygje3dpZHRofSAtICN7QHNldHRpbmdzLmRpc3RhbmNlfXB4KVwiIGlmIEBzZXR0aW5ncy5kaXN0YW5jZVxuXHRcdHJldHVybiB3aWR0aFxuXG5cblxuXG5cblxuXG5cblx0YXBwZW5kVG86ICh0YXJnZXQpLT5cblx0XHRAZWwuYXBwZW5kVG8odGFyZ2V0KTsgXHRcdHJldHVybiBAXG5cblx0cHJlcGVuZFRvOiAodGFyZ2V0KS0+XG5cdFx0QGVsLnByZXBlbmRUbyh0YXJnZXQpOyBcdFx0cmV0dXJuIEBcblxuXHRpbnNlcnRBZnRlcjogKHRhcmdldCktPlxuXHRcdEBlbC5pbnNlcnRBZnRlcih0YXJnZXQpOyBcdHJldHVybiBAXG5cblx0aW5zZXJ0QmVmb3JlOiAodGFyZ2V0KS0+XG5cdFx0QGVsLmluc2VydEJlZm9yZSh0YXJnZXQpOyBcdHJldHVybiBAXG5cblx0ZGV0YWNoOiAodGFyZ2V0KS0+XG5cdFx0QGVsLmRldGFjaCh0YXJnZXQpOyBcdFx0cmV0dXJuIEBcblxuXHRyZW1vdmU6ICgpLT5cblx0XHRAZWwucmVtb3ZlKClcblx0XHRyZXR1cm4gQGRlc3Ryb3koZmFsc2UpXG5cblx0ZGVzdHJveTogKHJlbW92ZUZyb21ET009dHJ1ZSktPlxuXHRcdFNpbXBseUJpbmQudW5CaW5kQWxsKEApXG5cdFx0U2ltcGx5QmluZC51bkJpbmRBbGwoQHN0YXRlKVxuXHRcdFNpbXBseUJpbmQudW5CaW5kQWxsKEBlbClcblx0XHRTaW1wbHlCaW5kLnVuQmluZEFsbChjaGlsZCkgZm9yIGNoaWxkIGluIEBlbC5jaGlsZFxuXHRcdEBlbC5yZW1vdmUoKSBpZiByZW1vdmVGcm9tRE9NXG5cdFx0QF9kZXN0cm95KCkgaWYgQF9kZXN0cm95XG5cdFx0ZGVsZXRlIEBhbGxGaWVsZHNbQElEXVxuXHRcdHJldHVybiB0cnVlXG5cblx0b246IChldmVudE5hbWVzLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSktPlxuXHRcdEBlbC5vbi5jYWxsKEBlbCwgZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUsIHRydWUpXG5cdFx0cmV0dXJuIEBcblxuXHRvbmNlOiAoZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUpLT5cblx0XHRAb24gZXZlbnROYW1lcywgKCk9PlxuXHRcdFx0QG9mZihldmVudE5hbWVzLCBjYWxsYmFjaylcblx0XHRcdGNhbGxiYWNrLmFwcGx5KEBlbCwgYXJndW1lbnRzKVxuXHRcdCwgdXNlQ2FwdHVyZVxuXG5cdG9mZjogKCktPlxuXHRcdEBlbC5vZmYuYXBwbHkoQGVsLCBhcmd1bWVudHMpXG5cdFx0cmV0dXJuIEBcblxuXHRlbWl0OiAoKS0+XG5cdFx0QGVsLmVtaXRQcml2YXRlLmFwcGx5KEBlbCwgYXJndW1lbnRzKVxuXHRcdHJldHVybiBAXG5cblx0dmFsaWRhdGU6IChwcm92aWRlZFZhbHVlPUBbQGNvcmVWYWx1ZVByb3BdLCB0ZXN0VW5yZXF1aXJlZCktPlxuXHRcdGlzVmFsaWQgPSBzd2l0Y2hcblx0XHRcdHdoZW4gQHNldHRpbmdzLnZhbGlkYXRvciB0aGVuIEBzZXR0aW5ncy52YWxpZGF0b3IocHJvdmlkZWRWYWx1ZSlcblx0XHRcdFxuXHRcdFx0d2hlbiBub3QgQHNldHRpbmdzLnJlcXVpcmVkIGFuZCBub3QgdGVzdFVucmVxdWlyZWQgdGhlbiB0cnVlXG5cblx0XHRcdHdoZW4gQF92YWxpZGF0ZShwcm92aWRlZFZhbHVlLCB0ZXN0VW5yZXF1aXJlZCkgaXMgZmFsc2UgdGhlbiBmYWxzZVxuXG5cdFx0XHR3aGVuIEBzZXR0aW5ncy5yZXF1aXJlZFxuXHRcdFx0XHRpZiBAc2V0dGluZ3MubXVsdGlwbGUgdGhlbiAhIXByb3ZpZGVkVmFsdWU/Lmxlbmd0aCBlbHNlICEhcHJvdmlkZWRWYWx1ZVxuXHRcdFx0XG5cdFx0XHRlbHNlIHRydWVcblxuXHRcdEBzdGF0ZS5zaG93RXJyb3IgPSBmYWxzZSBpZiBpc1ZhbGlkIGFuZCBAc2V0dGluZ3MuY2xlYXJFcnJvck9uVmFsaWRcblx0XHRyZXR1cm4gaXNWYWxpZFxuXG5cdHZhbGlkYXRlQ29uZGl0aW9uczogKGNvbmRpdGlvbnMpLT5cblx0XHRpZiBjb25kaXRpb25zXG5cdFx0XHR0b2dnbGVWaXNpYmlsaXR5ID0gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRjb25kaXRpb25zID0gQGNvbmRpdGlvbnNcblx0XHRcdHRvZ2dsZVZpc2liaWxpdHkgPSB0cnVlXG5cdFx0XG5cdFx0cGFzc2VkQ29uZGl0aW9ucyA9IENvbmRpdGlvbi52YWxpZGF0ZShjb25kaXRpb25zKVxuXHRcdGlmIHRvZ2dsZVZpc2liaWxpdHlcblx0XHRcdHJldHVybiBAc3RhdGUudmlzaWJsZSA9IHBhc3NlZENvbmRpdGlvbnNcblx0XHRlbHNlIFxuXHRcdFx0cmV0dXJuIHBhc3NlZENvbmRpdGlvbnNcblxuXHR2YWxpZGF0ZUFuZFJlcG9ydDogKHByb3ZpZGVkVmFsdWUpLT5cblx0XHRpc1ZhbGlkID0gQHZhbGlkYXRlKG51bGwsIHRydWUpXG5cdFx0QHN0YXRlLnNob3dFcnJvciA9IGlzVmFsaWRcblx0XHRyZXR1cm4gaXNWYWxpZFxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBGaWVsZCIsIidjb25kaXRpb25zJzogKGNvbmRpdGlvbnMpLT5cblx0aWYgSVMub2JqZWN0UGxhaW4oY29uZGl0aW9ucylcblx0XHR7dGFyZ2V0LCB2YWx1ZX0gZm9yIHRhcmdldCx2YWx1ZSBvZiBjb25kaXRpb25zXG5cdGVsc2UgaWYgSVMuYXJyYXkoY29uZGl0aW9ucylcblx0XHRjb25kaXRpb25zLm1hcCAoaXRlbSktPiBpZiBJUy5zdHJpbmcoaXRlbSkgdGhlbiB7dGFyZ2V0Oml0ZW19IGVsc2UgaXRlbVxuXG4nY2hvaWNlcyc6IChjaG9pY2VzKS0+XG5cdGlmIElTLm9iamVjdFBsYWluKGNob2ljZXMpXG5cdFx0e2xhYmVsLHZhbHVlfSBmb3IgbGFiZWwsdmFsdWUgb2YgY2hvaWNlc1xuXHRlbHNlIGlmIElTLmFycmF5KGNob2ljZXMpXG5cdFx0Y2hvaWNlcy5tYXAgKGl0ZW0pLT4gaWYgbm90IElTLm9iamVjdFBsYWluKGl0ZW0pIHRoZW4ge2xhYmVsOml0ZW0sIHZhbHVlOml0ZW19IGVsc2UgaXRlbVxuXG4ndmFsaWRXaGVuUmVnZXgnOiAocmVnZXgpLT5cblx0aWYgSVMuc3RyaW5nKHJlZ2V4KSB0aGVuIG5ldyBSZWdFeHAocmVnZXgpIGVsc2UgcmVnZXgiLCJEcm9wZG93biA9IGltcG9ydCAnLi4vLi4vY29tcG9uZW50cy9kcm9wZG93bidcbk1hc2sgPSBpbXBvcnQgJy4uLy4uL2NvbXBvbmVudHMvbWFzaydcblJFR0VYID0gaW1wb3J0ICcuLi8uLi9jb25zdGFudHMvcmVnZXgnXG5LRVlDT0RFUyA9IGltcG9ydCAnLi4vLi4vY29uc3RhbnRzL2tleUNvZGVzJ1xuaGVscGVycyA9IGltcG9ydCAnLi4vLi4vaGVscGVycydcbklTID0gaW1wb3J0ICcuLi8uLi9jaGVja3MnXG5ET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuZXh0ZW5kID0gaW1wb3J0ICdzbWFydC1leHRlbmQnXG5TaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcbmltcG9ydCB0ZW1wbGF0ZSwqIGFzIHRlbXBsYXRlcyBmcm9tICcuL3RlbXBsYXRlJ1xuaW1wb3J0ICogYXMgZGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0cydcblxuY2xhc3MgVGV4dEZpZWxkIGV4dGVuZHMgaW1wb3J0ICcuLi8nXG5cdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHR0ZW1wbGF0ZXM6IHRlbXBsYXRlc1xuXHRkZWZhdWx0czogZGVmYXVsdHNcblxuXHRjb25zdHJ1Y3RvcjogKCktPlxuXHRcdHN1cGVyXG5cdFx0QF92YWx1ZSA/PSAnJ1xuXHRcdEBzdGF0ZS50eXBpbmcgPSBmYWxzZVxuXHRcdEBjdXJzb3IgPSBwcmV2OjAsIGN1cnJlbnQ6MFxuXG5cdFx0aWYgbm90IEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleFxuXHRcdFx0aWYgQHNldHRpbmdzLmtleWJvYXJkIGlzICdlbWFpbCcgYW5kIEBzZXR0aW5ncy5yZXF1aXJlZFxuXHRcdFx0XHRAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXggPSBSRUdFWC5lbWFpbFxuXHRcdFx0ZWxzZSBpZiBAc2V0dGluZ3MubWFzayBpcyAnTkFNRScgb3IgQHNldHRpbmdzLm1hc2sucGF0dGVybiBpcyAnTkFNRSdcblx0XHRcdFx0QHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4ID0gL15bYS16QS1aXXsyfS9cblx0XHRcdGVsc2UgaWYgQHNldHRpbmdzLm1hc2sgaXMgJ0ZVTExOQU1FJyBvciBAc2V0dGluZ3MubWFzay5wYXR0ZXJuIGlzICdGVUxMTkFNRSdcblx0XHRcdFx0QHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4ID0gL15bYS16QS1aXStcXHMrW2EtekEtWl0rL1xuXG5cdFx0aWYgbm90IEBzZXR0aW5ncy5tYXNrLnBhdHRlcm5cblx0XHRcdGlmIElTLnN0cmluZyhAc2V0dGluZ3MubWFzaylcblx0XHRcdFx0QHNldHRpbmdzLm1hc2sgPSBleHRlbmQuZGVlcC5jbG9uZShAZGVmYXVsdHMubWFzaywgcGF0dGVybjpAc2V0dGluZ3MubWFzaylcblxuXHRcdFx0ZWxzZSBpZiBJUy5vYmplY3QoQHNldHRpbmdzLm1hc2spXG5cdFx0XHRcdEBzZXR0aW5ncy5tYXNrLnBhdHRlcm4gPSBzd2l0Y2ggQHNldHRpbmdzLmtleWJvYXJkXG5cdFx0XHRcdFx0d2hlbiAnZGF0ZScgdGhlbiAnREFURSdcblx0XHRcdFx0XHR3aGVuICdudW1iZXInIHRoZW4gJ05VTUJFUidcblx0XHRcdFx0XHR3aGVuICdwaG9uZScsJ3RlbCcgdGhlbiAnUEhPTkUnXG5cdFx0XHRcdFx0d2hlbiAnZW1haWwnIHRoZW4gJ0VNQUlMJ1xuXHRcdFx0XG5cdFx0QG1hc2sgPSBuZXcgTWFzayhALCBAc2V0dGluZ3MubWFzaykgaWYgQHNldHRpbmdzLm1hc2sucGF0dGVyblxuXHRcdEBfY3JlYXRlRWxlbWVudHMoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3MoKVxuXHRcdEBfY29uc3RydWN0b3JFbmQoKVxuXG5cblx0X2dldFZhbHVlOiAoKS0+XG5cdFx0aWYgQGRyb3Bkb3duIGFuZCBAc2VsZWN0ZWQgYW5kIEBfdmFsdWUgaXMgQHNlbGVjdGVkLmxhYmVsXG5cdFx0XHRyZXR1cm4gQHNlbGVjdGVkLnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIEBfdmFsdWVcblxuXHRfc2V0VmFsdWU6IChuZXdWYWx1ZSktPiBpZiBJUy5zdHJpbmcobmV3VmFsdWUpIG9yIElTLm51bWJlcihuZXdWYWx1ZSlcblx0XHRuZXdWYWx1ZSA9IFN0cmluZyhuZXdWYWx1ZSlcblx0XHRAX3ZhbHVlID0gaWYgQG1hc2sgdGhlbiBAbWFzay5zZXRWYWx1ZShuZXdWYWx1ZSkgZWxzZSBuZXdWYWx1ZVxuXG5cdF9yZWNhbGNEaXNwbGF5OiAoKS0+XG5cdFx0QF92YWx1ZSA9IEBfdmFsdWUgaWYgQHNldHRpbmdzLmF1dG9XaWR0aFxuXG5cblx0X2NyZWF0ZUVsZW1lbnRzOiAoKS0+XG5cdFx0Z2xvYmFsT3B0cyA9IHtyZWxhdGVkSW5zdGFuY2U6QH1cblx0XHRAZWwgPSBAdGVtcGxhdGUuc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5kZWZhdWx0LCBnbG9iYWxPcHRzKVxuXG5cdFx0aWYgQHNldHRpbmdzLmNob2ljZXNcblx0XHRcdEBkcm9wZG93biA9IG5ldyBEcm9wZG93bihAc2V0dGluZ3MuY2hvaWNlcywgQClcblx0XHRcdEBkcm9wZG93bi5hcHBlbmRUbyhAZWwuY2hpbGQuaW5uZXJ3cmFwKVxuXG5cdFx0aWYgQHNldHRpbmdzLmljb25cblx0XHRcdHRlbXBsYXRlcy5pY29uLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuaWNvbiwgZ2xvYmFsT3B0cykuYXBwZW5kKEBzZXR0aW5ncy5pY29uKS5pbnNlcnRCZWZvcmUoQGVsLmNoaWxkLmlucHV0KVxuXG5cdFx0aWYgQHNldHRpbmdzLmNoZWNrbWFya1xuXHRcdFx0dGVtcGxhdGVzLmNoZWNrbWFyay5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmNoZWNrbWFyaywgZ2xvYmFsT3B0cykuaW5zZXJ0QWZ0ZXIoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFxuXHRcdEBlbC5jaGlsZC5pbnB1dC5wcm9wICd0eXBlJywgc3dpdGNoIEBzZXR0aW5ncy5rZXlib2FyZFxuXHRcdFx0d2hlbiAnbnVtYmVyJywndGVsJywncGhvbmUnIHRoZW4gJ3RlbCdcblx0XHRcdHdoZW4gJ3Bhc3N3b3JkJyB0aGVuICdwYXNzd29yZCdcblx0XHRcdHdoZW4gJ3VybCcgdGhlbiAndXJsJ1xuXHRcdFx0IyB3aGVuICdlbWFpbCcgdGhlbiAnZW1haWwnXG5cdFx0XHRlbHNlICd0ZXh0J1xuXG5cdFx0QGVsLnN0YXRlICdoYXNMYWJlbCcsIEBzZXR0aW5ncy5sYWJlbFxuXHRcdEBlbC5jaGlsZC5pbm5lcndyYXAucmF3Ll9xdWlja0ZpZWxkID0gQGVsLmNoaWxkLmlucHV0LnJhdy5fcXVpY2tGaWVsZCA9IEBcblx0XHRyZXR1cm4gQGVsLmNoaWxkZlxuXG5cblx0X2F0dGFjaEJpbmRpbmdzOiAoKS0+XG5cdFx0QF9hdHRhY2hCaW5kaW5nc19lbFN0YXRlKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXkoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3NfZGlzcGxheV9hdXRvV2lkdGgoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3NfdmFsdWUoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3NfYXV0b2NvbXBsZXRlKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX3N0YXRlVHJpZ2dlcnMoKVxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2VsU3RhdGU6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCd2aXNpYmxlJykub2YoQHN0YXRlKS50byBcdCh2aXNpYmxlKT0+IEBlbC5zdGF0ZSAndmlzaWJsZScsIHZpc2libGVcblx0XHRTaW1wbHlCaW5kKCdob3ZlcmVkJykub2YoQHN0YXRlKS50byBcdChob3ZlcmVkKT0+IEBlbC5zdGF0ZSAnaG92ZXInLCBob3ZlcmVkXG5cdFx0U2ltcGx5QmluZCgnZm9jdXNlZCcpLm9mKEBzdGF0ZSkudG8gXHQoZm9jdXNlZCk9PiBAZWwuc3RhdGUgJ2ZvY3VzJywgZm9jdXNlZFxuXHRcdFNpbXBseUJpbmQoJ2ZpbGxlZCcpLm9mKEBzdGF0ZSkudG8gXHRcdChmaWxsZWQpPT4gQGVsLnN0YXRlICdmaWxsZWQnLCBmaWxsZWRcblx0XHRTaW1wbHlCaW5kKCdkaXNhYmxlZCcpLm9mKEBzdGF0ZSkudG8gXHQoZGlzYWJsZWQpPT4gQGVsLnN0YXRlICdkaXNhYmxlZCcsIGRpc2FibGVkXG5cdFx0U2ltcGx5QmluZCgnc2hvd0xhYmVsJykub2YoQHN0YXRlKS50byBcdChzaG93TGFiZWwpPT4gQGVsLnN0YXRlICdzaG93TGFiZWwnLCBzaG93TGFiZWxcblx0XHRTaW1wbHlCaW5kKCdzaG93RXJyb3InKS5vZihAc3RhdGUpLnRvIFx0KHNob3dFcnJvcik9PiBAZWwuc3RhdGUgJ3Nob3dFcnJvcicsIHNob3dFcnJvclxuXHRcdFNpbXBseUJpbmQoJ3Nob3dIZWxwJykub2YoQHN0YXRlKS50byBcdChzaG93SGVscCk9PiBAZWwuc3RhdGUgJ3Nob3dIZWxwJywgc2hvd0hlbHBcblx0XHRTaW1wbHlCaW5kKCd2YWxpZCcpLm9mKEBzdGF0ZSkudG8gKHZhbGlkKT0+XG5cdFx0XHRAZWwuc3RhdGUgJ3ZhbGlkJywgdmFsaWRcblx0XHRcdEBlbC5zdGF0ZSAnaW52YWxpZCcsICF2YWxpZFxuXHRcdFxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXk6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdwbGFjZWhvbGRlcicpLm9mKEBzdGF0ZSlcblx0XHRcdC50bygndGV4dCcpLm9mKEBlbC5jaGlsZC5wbGFjZWhvbGRlcilcblx0XHRcdFx0LnRyYW5zZm9ybSAocGxhY2Vob2xkZXIpPT4gc3dpdGNoXG5cdFx0XHRcdFx0d2hlbiBwbGFjZWhvbGRlciBpcyB0cnVlIGFuZCBAc2V0dGluZ3MubGFiZWwgdGhlbiBAc2V0dGluZ3MubGFiZWxcblx0XHRcdFx0XHR3aGVuIElTLnN0cmluZyhwbGFjZWhvbGRlcikgdGhlbiBwbGFjZWhvbGRlclxuXHRcdFx0XHRcdGVsc2UgJydcblxuXHRcdFNpbXBseUJpbmQoJ2Rpc2FibGVkJywgdXBkYXRlT25CaW5kOkBzdGF0ZS5kaXNhYmxlZCkub2YoQHN0YXRlKVxuXHRcdFx0LnRvIChkaXNhYmxlZCwgcHJldik9PiBpZiBAc2V0dGluZ3MuY2hlY2ttYXJrXG5cdFx0XHRcdGlmIGRpc2FibGVkIG9yIChub3QgZGlzYWJsZWQgYW5kIHByZXY/KSB0aGVuIHNldFRpbWVvdXQgKCk9PlxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jaGVja21hcmtfbWFzazEucmVjYWxjU3R5bGUoKVxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jaGVja21hcmtfbWFzazIucmVjYWxjU3R5bGUoKVxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jaGVja21hcmtfcGF0Y2gucmVjYWxjU3R5bGUoKVxuXHRcdFx0XHRcdCMgQGVsLmNoaWxkLmNoZWNrbWFyay5yZWNhbGNTdHlsZSh0cnVlKVxuXHRcdFxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXlfYXV0b1dpZHRoOiAoKS0+XG5cdFx0U2ltcGx5QmluZCgnd2lkdGgnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUpLm9mKEBzdGF0ZSlcblx0XHRcdC50byAod2lkdGgpPT4gKGlmIEBzZXR0aW5ncy5hdXRvV2lkdGggdGhlbiBAZWwuY2hpbGQuaW5wdXQgZWxzZSBAZWwpLnN0eWxlKCd3aWR0aCcsIHdpZHRoKVxuXHRcdFx0LnRyYW5zZm9ybSBAX2Zvcm1hdFdpZHRoLmJpbmQoQClcblx0XHRcdC51cGRhdGVPbignaXNNb2JpbGUnKS5vZihAc3RhdGUpXG5cblx0XHRpZiBAc2V0dGluZ3MuYXV0b1dpZHRoXG5cdFx0XHRTaW1wbHlCaW5kKCdfdmFsdWUnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQClcblx0XHRcdFx0LnRvKCd3aWR0aCcpLm9mKEBzdGF0ZSlcblx0XHRcdFx0XHQudHJhbnNmb3JtICgpPT4gXCIje0BfZ2V0SW5wdXRBdXRvV2lkdGgoKX1weFwiXG5cdFx0XHRcdFx0LnVwZGF0ZU9uKCdldmVudDppbnNlcnRlZCcpLm9mKEBlbClcblx0XHRcdFx0XHQudXBkYXRlT24oJ3Zpc2libGUnKS5vZihAc3RhdGUpXG5cdFx0XG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfdmFsdWU6ICgpLT5cblx0XHRpbnB1dCA9IEBlbC5jaGlsZC5pbnB1dC5yYXdcblx0XHRcblx0XHRyZXNldElucHV0ID0gKCk9PlxuXHRcdFx0ZmlsbGVkID0gIUBtYXNrLmlzRW1wdHkoKVxuXHRcdFx0aWYgbm90IGZpbGxlZFxuXHRcdFx0XHRAc2VsZWN0aW9uKEBtYXNrLmN1cnNvciA9IDApXG5cdFx0XHRcdEBfdmFsdWUgPSAnJ1xuXHRcdFx0XHRAc3RhdGUuZmlsbGVkID0gZmFsc2Vcblx0XHRcdFxuXHRcdFx0cmV0dXJuIGZpbGxlZFxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmlucHV0Jykub2YoaW5wdXQpLnRvICgpPT5cblx0XHRcdEB2YWx1ZSA9IGlucHV0LnZhbHVlXG5cdFx0XHRAc2VsZWN0aW9uKEBtYXNrLmN1cnNvcikgaWYgQG1hc2tcblx0XHRcdEBlbWl0KCdpbnB1dCcsIEB2YWx1ZSlcblxuXHRcdFNpbXBseUJpbmQoJ192YWx1ZScsIHVwZGF0ZUV2ZW5JZlNhbWU6ISFAbWFzaykub2YoQClcblx0XHRcdC50bygndmFsdWUnKS5vZihpbnB1dClcdFx0XG5cdFx0XHQuYW5kLnRvICh2YWx1ZSk9PlxuXHRcdFx0XHRmaWxsZWQgPSAhIXZhbHVlXG5cdFx0XHRcdGZpbGxlZCA9IHJlc2V0SW5wdXQoKSBpZiBmaWxsZWQgYW5kIEBtYXNrIGFuZCBAbWFzay5ndWlkZSBhbmQgKCFAc3RhdGUuZm9jdXNlZCBvciBAbWFzay5jdXJzb3IgaXMgMClcblx0XHRcdFx0QHN0YXRlLmZpbGxlZCA9IGZpbGxlZFxuXHRcdFx0XHRAc3RhdGUuaW50ZXJhY3RlZCA9IHRydWUgaWYgZmlsbGVkXG5cdFx0XHRcdEBzdGF0ZS52YWxpZCA9IEB2YWxpZGF0ZShudWxsLCB0cnVlKVxuXHRcdFx0XHRAZW1pdCgnaW5wdXQnLCBAdmFsdWUpIHVubGVzcyBAc3RhdGUuZm9jdXNlZFxuXG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6a2V5ZG93bicpLm9mKEBlbC5jaGlsZC5pbnB1dCkudG8gKGV2ZW50KT0+XG5cdFx0XHRAZW1pdCgnc3VibWl0JykgaWYgZXZlbnQua2V5Q29kZSBpcyBLRVlDT0RFUy5lbnRlclxuXHRcdFx0QGVtaXQoXCJrZXktI3tldmVudC5rZXlDb2RlfVwiKVxuXG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6Ymx1cicpLm9mKEBlbC5jaGlsZC5pbnB1dCkudG8ocmVzZXRJbnB1dCkgaWYgQG1hc2sgYW5kIEBtYXNrLmd1aWRlXG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfYXV0b2NvbXBsZXRlOiAoKS0+IGlmIEBkcm9wZG93blxuXHRcdFNpbXBseUJpbmQuZGVmYXVsdE9wdGlvbnMudXBkYXRlT25CaW5kID0gZmFsc2VcblxuXHRcdFNpbXBseUJpbmQoJ3R5cGluZycsIHVwZGF0ZUV2ZW5JZlNhbWU6dHJ1ZSkub2YoQHN0YXRlKS50byAoaXNUeXBpbmcpPT5cblx0XHRcdGlmIGlzVHlwaW5nXG5cdFx0XHRcdHJldHVybiBpZiBub3QgQF92YWx1ZVxuXHRcdFx0XHRpZiBAZHJvcGRvd24uaXNPcGVuXG5cdFx0XHRcdFx0QGRyb3Bkb3duLmxpc3QuY2FsY0Rpc3BsYXkoKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0QGRyb3Bkb3duLmlzT3BlbiA9IHRydWVcblx0XHRcdFx0XHRTaW1wbHlCaW5kKCdldmVudDpjbGljaycpLm9mKGRvY3VtZW50KVxuXHRcdFx0XHRcdFx0Lm9uY2UudG8gKCk9PiBAZHJvcGRvd24uaXNPcGVuID0gZmFsc2Vcblx0XHRcdFx0XHRcdC5jb25kaXRpb24gKGV2ZW50KT0+IG5vdCBET00oZXZlbnQudGFyZ2V0KS5wYXJlbnRNYXRjaGluZyAocGFyZW50KT0+IHBhcmVudCBpcyBAZWwuY2hpbGQuaW5uZXJ3cmFwXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBkcm9wZG93bi5pc09wZW4gPSBmYWxzZVxuXG5cdFx0U2ltcGx5QmluZCgnX3ZhbHVlJykub2YoQCkudG8gKHZhbHVlKT0+XG5cdFx0XHRmb3IgY2hvaWNlIGluIEBkcm9wZG93bi5jaG9pY2VzXG5cdFx0XHRcdHNob3VsZEJlVmlzaWJsZSA9IGlmIG5vdCB2YWx1ZSB0aGVuIHRydWUgZWxzZSBoZWxwZXJzLmZ1enp5TWF0Y2godmFsdWUsIGNob2ljZS5sYWJlbClcblx0XHRcdFx0Y2hvaWNlLnZpc2libGUgPSBzaG91bGRCZVZpc2libGUgaWYgY2hvaWNlLnZpc2libGUgaXNudCBzaG91bGRCZVZpc2libGVcblxuXHRcdFx0aWYgQGRyb3Bkb3duLmlzT3BlbiBhbmQgbm90IHZhbHVlXG5cdFx0XHRcdEBkcm9wZG93bi5pc09wZW4gPSBmYWxzZVxuXHRcdFx0cmV0dXJuXG5cblxuXHRcdEBkcm9wZG93bi5vblNlbGVjdGVkIChzZWxlY3RlZENob2ljZSk9PlxuXHRcdFx0QHNlbGVjdGVkID0gc2VsZWN0ZWRDaG9pY2Vcblx0XHRcdEB2YWx1ZSA9IHNlbGVjdGVkQ2hvaWNlLmxhYmVsXG5cdFx0XHRAZHJvcGRvd24uaXNPcGVuID0gZmFsc2Vcblx0XHRcdEBzZWxlY3Rpb24oQGVsLmNoaWxkLmlucHV0LnJhdy52YWx1ZS5sZW5ndGgpXG5cdFx0XG5cblx0XHRTaW1wbHlCaW5kLmRlZmF1bHRPcHRpb25zLnVwZGF0ZU9uQmluZCA9IHRydWVcblx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc19zdGF0ZVRyaWdnZXJzOiAoKS0+XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6bW91c2VlbnRlcicpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBzdGF0ZS5ob3ZlcmVkID0gdHJ1ZVxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50Om1vdXNlbGVhdmUnKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUuaG92ZXJlZCA9IGZhbHNlXG5cblx0XHRTaW1wbHlCaW5kKCdldmVudDpmb2N1cycpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBzdGF0ZS5mb2N1c2VkID0gdHJ1ZTsgaWYgQHN0YXRlLmRpc2FibGVkIHRoZW4gQGJsdXIoKVxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmJsdXInKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUudHlwaW5nID0gQHN0YXRlLmZvY3VzZWQgPSBmYWxzZVxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmlucHV0Jykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQHN0YXRlLnR5cGluZyA9IHRydWVcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDprZXlkb3duJykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQGN1cnNvci5wcmV2ID0gQHNlbGVjdGlvbigpLmVuZFxuXG5cdFx0cmV0dXJuXG5cblxuXHRfc2NoZWR1bGVDdXJzb3JSZXNldDogKCktPlxuXHRcdGRpZmZJbmRleCA9IGhlbHBlcnMuZ2V0SW5kZXhPZkZpcnN0RGlmZihAbWFzay52YWx1ZSwgQG1hc2sucHJldi52YWx1ZSlcblx0XHRjdXJyZW50Q3Vyc29yID0gQGN1cnNvci5jdXJyZW50XG5cdFx0bmV3Q3Vyc29yID0gQG1hc2subm9ybWFsaXplQ3Vyc29yUG9zKGN1cnJlbnRDdXJzb3IsIEBjdXJzb3IucHJldilcblxuXHRcdGlmIG5ld0N1cnNvciBpc250IGN1cnJlbnRDdXJzb3Jcblx0XHRcdEBzZWxlY3Rpb24obmV3Q3Vyc29yKVxuXHRcdHJldHVyblxuXG5cblx0X3NldFZhbHVlSWZOb3RTZXQ6ICgpLT5cblx0XHRpZiBAZWwuY2hpbGQuaW5wdXQucmF3LnZhbHVlIGlzbnQgQF92YWx1ZVxuXHRcdFx0QGVsLmNoaWxkLmlucHV0LnJhdy52YWx1ZSA9IEBfdmFsdWVcblx0XHRyZXR1cm5cblxuXG5cblx0X2dldElucHV0QXV0b1dpZHRoOiAoKS0+XG5cdFx0aWYgQF92YWx1ZVxuXHRcdFx0QF9zZXRWYWx1ZUlmTm90U2V0KClcblx0XHRcdEBlbC5jaGlsZC5pbnB1dC5zdHlsZSgnd2lkdGgnLCAwKVxuXHRcdFx0QGVsLmNoaWxkLmlucHV0LnJhdy5zY3JvbGxMZWZ0ID0gMWUrMTBcblx0XHRcdGlucHV0V2lkdGggPSBNYXRoLm1heChAZWwuY2hpbGQuaW5wdXQucmF3LnNjcm9sbExlZnQrQGVsLmNoaWxkLmlucHV0LnJhdy5vZmZzZXRXaWR0aCwgQGVsLmNoaWxkLmlucHV0LnJhdy5zY3JvbGxXaWR0aCkgKyAyXG5cdFx0XHRsYWJlbFdpZHRoID0gaWYgQHNldHRpbmdzLmxhYmVsIGFuZCBAZWwuY2hpbGQubGFiZWwuc3R5bGVTYWZlKCdwb3NpdGlvbicpIGlzICdhYnNvbHV0ZScgdGhlbiBAZWwuY2hpbGQubGFiZWwucmVjdC53aWR0aCBlbHNlIDBcblx0XHRlbHNlXG5cdFx0XHRpbnB1dFdpZHRoID0gQGVsLmNoaWxkLnBsYWNlaG9sZGVyLnJlY3Qud2lkdGhcblx0XHRcdGxhYmVsV2lkdGggPSAwXG5cdFx0XG5cdFx0cmV0dXJuIE1hdGgubWluIEBfZ2V0V2lkdGhTZXR0aW5nKCdtYXgnKSwgTWF0aC5tYXgoQF9nZXRXaWR0aFNldHRpbmcoJ21pbicpLCBpbnB1dFdpZHRoLCBsYWJlbFdpZHRoKVxuXG5cblx0X2dldFdpZHRoU2V0dGluZzogKHRhcmdldCktPlxuXHRcdHRhcmdldCArPSAnV2lkdGgnIGlmIHRhcmdldCBpcyAnbWluJyBvciB0YXJnZXQgaXMgJ21heCdcdFx0XG5cdFx0aWYgdHlwZW9mIEBzZXR0aW5nc1t0YXJnZXRdIGlzICdudW1iZXInXG5cdFx0XHRyZXN1bHQgPSBAc2V0dGluZ3NbdGFyZ2V0XVxuXHRcdFxuXHRcdGVsc2UgaWZcdHR5cGVvZiBAc2V0dGluZ3NbdGFyZ2V0XSBpcyAnc3RyaW5nJ1xuXHRcdFx0cmVzdWx0ID0gcGFyc2VGbG9hdChAc2V0dGluZ3NbdGFyZ2V0XSlcblxuXHRcdFx0aWYgaGVscGVycy5pbmNsdWRlcyhAc2V0dGluZ3NbdGFyZ2V0XSwgJyUnKVxuXHRcdFx0XHRpZiAocGFyZW50PUBlbC5wYXJlbnQpIGFuZCBwYXJlbnQuc3R5bGUoJ2Rpc3BsYXknKSBpcyAnYmxvY2snXG5cdFx0XHRcdFx0cGFyZW50V2lkdGggPSBwYXJlbnQuc3R5bGVQYXJzZWQoJ3dpZHRoJykgLSBwYXJlbnQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdMZWZ0JykgLSBwYXJlbnQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdSaWdodCcpIC0gMlxuXHRcdFx0XHRcdHJlc3VsdCA9IHBhcmVudFdpZHRoICogKHJlc3VsdC8xMDApXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXN1bHQgPSAwXG5cblx0XHRyZXR1cm4gcmVzdWx0IG9yIChpZiB0YXJnZXQgaXMgJ21pbldpZHRoJyB0aGVuIDAgZWxzZSBJbmZpbml0eSlcblxuXG5cdF92YWxpZGF0ZTogKHByb3ZpZGVkVmFsdWUpLT5cblx0XHRpZiBAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXggYW5kIElTLnJlZ2V4KEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleClcblx0XHRcdHJldHVybiBmYWxzZSBpZiBub3QgQHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4LnRlc3QocHJvdmlkZWRWYWx1ZSlcblx0XHRcblx0XHRpZiBAc2V0dGluZ3MudmFsaWRXaGVuSXNDaG9pY2UgYW5kIEBzZXR0aW5ncy5jaG9pY2VzPy5sZW5ndGhcblx0XHRcdG1hdGNoaW5nQ2hvaWNlID0gQHNldHRpbmdzLmNob2ljZXMuZmlsdGVyIChjaG9pY2UpLT4gY2hvaWNlLnZhbHVlIGlzIHByb3ZpZGVkVmFsdWVcblx0XHRcdHJldHVybiBmYWxzZSBpZiBub3QgbWF0Y2hpbmdDaG9pY2UubGVuZ3RoXG5cblx0XHRpZiBAc2V0dGluZ3MubWluTGVuZ3RoXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgcHJvdmlkZWRWYWx1ZS5sZW5ndGggPCBAc2V0dGluZ3MubWluTGVuZ3RoXG5cblx0XHRpZiBAc2V0dGluZ3MubWF4TGVuZ3RoXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgcHJvdmlkZWRWYWx1ZS5sZW5ndGggPj0gQHNldHRpbmdzLm1heExlbmd0aFxuXG5cdFx0aWYgQG1hc2tcblx0XHRcdHJldHVybiBmYWxzZSBpZiBub3QgQG1hc2sudmFsaWRhdGUocHJvdmlkZWRWYWx1ZSlcblx0XHRcblx0XHRyZXR1cm4gdHJ1ZVxuXG5cblx0c2VsZWN0aW9uOiAoYXJnKS0+XG5cdFx0aWYgSVMub2JqZWN0KGFyZylcblx0XHRcdHN0YXJ0ID0gYXJnLnN0YXJ0XG5cdFx0XHRlbmQgPSBhcmcuZW5kXG5cdFx0ZWxzZVxuXHRcdFx0c3RhcnQgPSBhcmdcblx0XHRcdGVuZCA9IGFyZ3VtZW50c1sxXVxuXG5cdFx0aWYgc3RhcnQ/XG5cdFx0XHRlbmQgPSBzdGFydCBpZiBub3QgZW5kIG9yIGVuZCA8IHN0YXJ0XG5cdFx0XHRAZWwuY2hpbGQuaW5wdXQucmF3LnNldFNlbGVjdGlvblJhbmdlKHN0YXJ0LCBlbmQpXG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gJ3N0YXJ0JzpAZWwuY2hpbGQuaW5wdXQucmF3LnNlbGVjdGlvblN0YXJ0LCAnZW5kJzpAZWwuY2hpbGQuaW5wdXQucmF3LnNlbGVjdGlvbkVuZFxuXG5cblx0Zm9jdXM6ICgpLT5cblx0XHRAZWwuY2hpbGQuaW5wdXQucmF3LmZvY3VzKClcblxuXHRibHVyOiAoKS0+XG5cdFx0QGVsLmNoaWxkLmlucHV0LnJhdy5ibHVyKClcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dEZpZWxkIiwiaW1wb3J0ICcuL2hlbHBlcnMnXG5pbXBvcnQgJy4vZXJyb3JzQW5kV2FybmluZ3MnXG4iLCJTaW1wbHlCaW5kID0gKHN1YmplY3QsIG9wdGlvbnMsIHNhdmVPcHRpb25zLCBpc1N1YiwgY29tcGxldGVDYWxsYmFjayktPlxuXHRpZiAoIXN1YmplY3QgYW5kIHN1YmplY3QgaXNudCAwKSBvciAoIWNoZWNrSWYuaXNTdHJpbmcoc3ViamVjdCkgYW5kICFjaGVja0lmLmlzTnVtYmVyKHN1YmplY3QpIGFuZCAhY2hlY2tJZi5pc0Z1bmN0aW9uKHN1YmplY3QpIGFuZCBzdWJqZWN0IG5vdCBpbnN0YW5jZW9mIEFycmF5KVxuXHRcdHRocm93RXJyb3IoJ2ludmFsaWRQYXJhbU5hbWUnKSB1bmxlc3MgY2hlY2tJZi5pc0JpbmRpbmdJbnRlcmZhY2Uoc3ViamVjdClcblxuXHRpZiBjaGVja0lmLmlzT2JqZWN0KHN1YmplY3QpIGFuZCBzdWJqZWN0IG5vdCBpbnN0YW5jZW9mIEFycmF5ICMgSW5kaWNhdGVzIGl0J3MgYSBCaW5kaW5nIGluc3RhbmNlIG9iamVjdCBkdWUgdG8gdGhlIGFib3ZlIGNoZWNrXG5cdFx0aW50ZXJmYWNlVG9SZXR1cm4gPSBpZiBjb21wbGV0ZUNhbGxiYWNrIHRoZW4gY29tcGxldGVDYWxsYmFjayhzdWJqZWN0KSBlbHNlIHN1YmplY3Quc2VsZkNsb25lKClcblx0XG5cdGVsc2Vcblx0XHRuZXdJbnRlcmZhY2UgPSBuZXcgQmluZGluZ0ludGVyZmFjZShvcHRpb25zKVxuXHRcdG5ld0ludGVyZmFjZS5zYXZlT3B0aW9ucyA9IHNhdmVPcHRpb25zXG5cdFx0bmV3SW50ZXJmYWNlLmlzU3ViID0gaXNTdWJcblx0XHRuZXdJbnRlcmZhY2UuY29tcGxldGVDYWxsYmFjayA9IGNvbXBsZXRlQ2FsbGJhY2tcblxuXHRcdGlmIGNoZWNrSWYuaXNGdW5jdGlvbihzdWJqZWN0KVxuXHRcdFx0aW50ZXJmYWNlVG9SZXR1cm4gPSBuZXdJbnRlcmZhY2Uuc2V0T2JqZWN0KHN1YmplY3QsIHRydWUpXG5cdFx0ZWxzZVxuXHRcdFx0aW50ZXJmYWNlVG9SZXR1cm4gPSBuZXdJbnRlcmZhY2Uuc2V0UHJvcGVydHkoc3ViamVjdClcblxuXHRyZXR1cm4gaW50ZXJmYWNlVG9SZXR1cm5cblxuXG5cblxuaW1wb3J0ICcuL21ldGhvZHMnIiwiQmluZGluZyA9IChvYmplY3QsIHR5cGUsIHN0YXRlKS0+XG5cdGV4dGVuZFN0YXRlKEAsIHN0YXRlKVxuXHRAb3B0aW9uc0RlZmF1bHQgPSBpZiBAc2F2ZU9wdGlvbnMgdGhlbiBAb3B0aW9ucyBlbHNlIGRlZmF1bHRPcHRpb25zXG5cdEB0eXBlID0gdHlwZVx0XHRcdFx0XHRcdFx0IyBPYmplY3RQcm9wIHwgQXJyYXkgfCBGdW5jIHwgUHJveHkgfCBFdmVudCB8IFBob2xkZXIgfCBET01BdHRyIHwgRE9NQ2hlY2tib3ggfCBET01SYWRpb1xuXHRAb2JqZWN0ID0gb2JqZWN0IFx0XHRcdFx0XHRcdCMgVGhlIHN1YmplY3Qgb2JqZWN0IG9mIHRoaXMgYmluZGluZywgaS5lLiBmdW5jdGlvbiwgYXJyYXksIHt9LCBET00gZWwsIGV0Yy5cblx0QElEID0gZ2VuSUQoKSBcdFx0XHRcdFx0XHRcdCMgQXNzaWduZWQgb25seSBhZnRlciBwYXNzaW5nIGEgdmFsaWQgb2JqZWN0IHRvIC5vZigpXG5cdEBzdWJzID0gW11cdFx0XHRcdFx0XHRcdFx0IyBTdWJzY3JpYmVycyBhcnJheSBsaXN0aW5nIGFsbCBvZiB0aGUgb2JqZWN0cyB0aGF0IHdpbGwgYmUgdXBkYXRlZCB1cG9uIHZhbHVlIHVwZGF0ZVxuXHRAc3Vic01ldGEgPSBnZW5PYmooKVx0XHRcdFx0XHQjIE1hcCBzdWJzY3JpYmVycycgSUQgdG8gdGhlaXIgbWV0YWRhdGEgKGkuZS4gb3B0aW9ucywgdHJhbnNmb3JtLCBjb25kaXRpb24sIG9uZS10aW1lLWJpbmRpbmcsIGV0Yy4pXG5cdEBwdWJzTWFwID0gZ2VuT2JqKClcdFx0XHRcdFx0XHQjIE1hcCBwdWJsaXNoZXJzIChiaW5kaW5ncyB0aGF0IHVwZGF0ZSB0aGlzIGJpbmRpbmcpIGJ5IHRoZWlyIElEXG5cdEBhdHRhY2hlZEV2ZW50cyA9IFtdXHRcdFx0XHRcdCMgQXJyYXkgbGlzdGluZyBhbGwgb2YgdGhlIGV2ZW50cyBjdXJyZW50bHkgbGlzdGVuZWQgb24gQG9iamVjdFxuXHRAc2V0VmFsdWUgPSBzZXRWYWx1ZU5vb3AgaWYgQHR5cGUgaXMgJ1Byb3h5J1xuXG5cdCMgPT09PSBQcm9wZXJ0aWVzIGRlY2xhcmVkIGxhdGVyIG9yIGluaGVyaXRlZCBmcm9tIGJpbmRpbmcgaW50ZXJmYWNlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIEBvcHRpb25zID0gb3B0aW9uc1xuXHQjIEB2YWx1ZSA9IHVuZGVmaW5lZCBcdFx0XHRcdFx0IyBXaWxsIHJlcHJlc2VudCB0aGUgYWN0dWFsIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGJpbmRpbmcvb2JqZWN0XG5cdCMgQHByb3BlcnR5ID0gcHJvcGVydHlcdFx0XHRcdFx0IyBUaGUgcHJvcGVydHkgbmFtZSBvciBhcnJheSBpbmRleCBvciBldmVudCBjYWxsYmFjayBhcmd1bWVudFxuXHQjIEBzZWxlY3RvciA9IHNlbGVjdG9yXHRcdFx0XHRcdCMgVGhlIHByb3BlcnR5IG5hbWUgb3IgYXJyYXkgaW5kZXggb3IgZXZlbnQgY2FsbGJhY2sgYXJndW1lbnRcblx0IyBAb3JpZ0ZuID0gRnVuY3Rpb25cdFx0XHRcdFx0IyBUaGUgb3JpZ2luYWwgcHJveGllZCBmdW5jdGlvbiBwYXNzZWQgdG8gUHJveHkgYmluZGluZ3Ncblx0IyBAY3VzdG9tRXZlbnRNZXRob2QgPSB7fVx0XHRcdFx0IyBOYW1lcyBvZiB0aGUgZXZlbnQgZW1pdHRlci90cmlnZ2VyIG1ldGhvZHMgKGlmIGFwcGxpY2FibGUpXG5cdCMgQHBob2xkZXJDb250ZXh0cyA9IHt9XHRcdFx0XHRcdCMgUGxhY2Vob2xkZXIgc3Vycm91bmRpbmdzIChvcmlnaW5hbCBiaW5kaW5nIHZhbHVlIHNwbGl0IGJ5IHRoZSBwbGFjZWhvbGRlciByZWdFeClcblx0IyBAcGhvbGRlckluZGV4TWFwID0ge31cdFx0XHRcdFx0IyBQbGFjZWhvbGRlciBvY2N1cmVuY2UgbWFwcGluZywgaS5lLiB0aGUgcGxhY2Vob2xkZXIgbmFtZSBmb3IgZWFjaCBwbGFjZWhvbGRlciBvY2N1cmVuY2Vcblx0IyBAcGxhY2Vob2xkZXIgPSBcIlwiXHRcdFx0XHRcdFx0IyBUaGUgbGFzdCBzcGVjaWZpZWQgcGxhY2Vob2xkZXIgdG8gYmluZCB0aGUgdmFsdWUgdG9cblx0IyBAZGVzY3JpcHRvciA9IFtdXHRcdFx0XHRcdFx0IyBEZXNjcmliZXMgdGhlIHR5cGUgb2YgcHJvcGVydHksIGkuZS4gJ2F0dHI6ZGF0YS1uYW1lJyB0byBpbmRpY2F0ZSBhIERPTUF0dHIgdHlwZSBiaW5kaW5nXG5cdCMgQGlzTGl2ZVByb3AgPSBCb29sZWFuXHRcdFx0XHRcdCMgSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRoZSBPYmplY3QvT2JqZWN0J3MgcHJvcGV0eSBoYXZlIGJlZW4gbW9kaWZpZWQgdG8gYmUgYSBsaXZlIHByb3BlcnR5XG5cdCMgQGlzRG9tID0gQm9vbGVhblx0XHRcdFx0XHRcdCMgSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRoZSBiaW5kaW5nJ3Mgb2JqZWN0IGlzIGEgRE9NIG9iamVjdFxuXHQjIEBwb2xsSW50ZXJ2YWwgPSBJRFx0XHRcdFx0XHQjIFRoZSBpbnRlcnZhbCBJRCBvZiB0aGUgdGltZXIgdGhhdCBtYW51YWxseSBwb2xscyB0aGUgb2JqZWN0J3MgdmFsdWUgYXQgYSBzZXQgaW50ZXJ2YWxcblx0IyBAYXJyYXlCaW5kaW5nID0gQmluZGluZ1x0XHRcdFx0IyBSZWZlcmVuY2UgdG8gdGhlIHBhcmVudCBhcnJheSBiaW5kaW5nIChpZiBleGlzdHMpIGZvciBhbiBpbmRleC1vZi1hcnJheSBiaW5kaW5nIChpLmUuIFNpbXBseUJpbmQoYXJyYXkpKVxuXHQjIEBldmVudE5hbWUgPSBcIlwiXHRcdFx0XHRcdFx0IyBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdGhpcyBiaW5kaW5nIGlzIGxpc3RlbmluZyB0byAoZm9yIEV2ZW50IHR5cGUgYmluZGluZ3MpXG5cdCMgQGlzRW1pdHRlciA9IEJvb2xlYW4gXHRcdFx0XHRcdCMgVHJhY2tlciB0byBsZXQgdXMga25vdyB3ZSBzaG91bGRuJ3QgaGFuZGxlIHRoZSBldmVudCB1cGRhdGUgd2UgcmVjZWl2ZWQgYXMgaXQgaXMgdGhlIGV2ZW50IHRoaXMgYmluZGluZyBqdXN0IGVtaXR0ZWRcblx0IyBAZXZlbnRIYW5kbGVyID0gRnVuY3Rpb24gXHRcdFx0XHQjIFRoZSBjYWxsYmFjayB0aGF0IGdldHMgdHJpZ2dlcmVkIHVwb24gYW4gZXZlbnQgZW1pdHRhbmNlIChmb3IgRXZlbiB0eXBlIGJpbmRpbmdzKVxuXHQjIEBldmVudE9iamVjdCA9IEV2ZW50IFx0XHRcdFx0XHQjIFRoZSBkaXNwYXRjaGVkIGV2ZW50IG9iamVjdCAoZm9yIEV2ZW50IHR5cGUgYmluZGluZ3MpXG5cdCMgQHNlbGZUcmFuc2Zvcm0gPSBGdW5jdGlvbiBcdFx0XHQjIFRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gdGhhdCBuZXcgdmFsdWVzIGJlaW5nIHNldCB0byB0aGlzIGJpbmRpbmcgYXJlIGJlaW5nIHBhc3NlZCB0aHJvdWdoIGR1cmluZyBAc2V0VmFsdWUgKGlmIGFwcGxpY2FibGUpXG5cdCMgQHNlbGZVcGRhdGVyID0gRnVuY3Rpb24gXHRcdFx0XHQjIEEgRnVuYy10eXBlIEJpbmRpbmcgd2hpY2ggaW52b2tlcyBAc2V0VmFsdWUoQGZldGNoRGlyZWN0VmFsdWUoKSkgdXBvbiBjaGFuZ2UuIENyZWF0ZWQgaW4gQGNvbnZlcnRUb0xpdmUoKSBmb3IgQXJyYXkgYmluZGluZ3MgJiBpbiBpbnRlcmZhY2UudXBkYXRlT24oKVxuXHQjIEBpc0FzeW5jID0gQm9vbGVhblx0XHRcdFx0XHQjIEluZGljYXRlcyBpZiB0aGlzIGlzIGFuIGFzeW5jIGJpbmRpbmcgKGN1cnJlbnRseSBvbmx5IHVzZWQgZm9yIEV2ZW50IGJpbmRpbmdzKVxuXHQjIyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gIyMjXG5cblx0IyBzaW1wbHlpbXBvcnQ6aWYgQlVORExFX1RBUkdFVCA9ICdicm93c2VyJ1xuXHRpZiBAaXNNdWx0aUNob2ljZSAjIFRydWUgaWYgQG9iamVjdCBpcyBhIHJhZGlvL2NoZWNrYm94IGNvbGxlY3Rpb25cblx0XHRAY2hvaWNlcyA9IGdlbk9iaigpXG5cdFx0XG5cdFx0QG9iamVjdC5mb3JFYWNoIChjaG9pY2VFbCk9PlxuXHRcdFx0Y2hvaWNlQmluZGluZyA9IEBjaG9pY2VzW2Nob2ljZUVsLnZhbHVlXSA9IFNpbXBseUJpbmQoJ2NoZWNrZWQnKS5vZihjaG9pY2VFbCkuX1xuXHRcdFx0Y2hvaWNlQmluZGluZy5hZGRTdWIoQClcblx0XHRcdGNob2ljZUJpbmRpbmcuc3Vic01ldGFbQElEXS50cmFuc2Zvcm1GbiA9ICgpLT4gY2hvaWNlQmluZGluZ1xuXHRcdFx0Y2hvaWNlQmluZGluZy5ncm91cEJpbmRpbmcgPSBAXG5cdFx0XHRyZXR1cm5cblx0IyBzaW1wbHlpbXBvcnQ6ZW5kXG5cdFxuXG5cdHVubGVzcyBAdHlwZSBpcyAnRXZlbnQnIG9yIChAdHlwZSBpcyAnRnVuYycgYW5kIEBpc1N1YikgIyB0aGUgc2Vjb25kIGNvbmRpdGlvbiB3aWxsIHByZXZlbnQgZnVuY3Rpb24gc3Vic2NyaWJlcnMgZnJvbSBiZWluZyBpbnZva2VkIG9uIHRoaXMgYmluZGluZyBjcmVhdGlvblxuXHRcdGlmIEB0eXBlIGlzICdQaG9sZGVyJ1xuXHRcdFx0IyBzaW1wbHlpbXBvcnQ6aWYgQlVORExFX1RBUkdFVCA9ICdicm93c2VyJ1xuXHRcdFx0cGFyZW50UHJvcGVydHkgPSBpZiBAZGVzY3JpcHRvciBhbmQgbm90IHRhcmdldEluY2x1ZGVzKEBkZXNjcmlwdG9yLCAnbXVsdGknKSB0aGVuIFwiI3tAZGVzY3JpcHRvcn06I3tAcHJvcGVydHl9XCIgZWxzZSBAcHJvcGVydHlcblx0XHRcdCMgc2ltcGx5aW1wb3J0OmVuZFxuXHRcdFx0XG5cdFx0XHQjIHNpbXBseWltcG9ydDppZiBCVU5ETEVfVEFSR0VUID0gJ25vZGUnXG5cdFx0XHRwYXJlbnRQcm9wZXJ0eSA9IEBwcm9wZXJ0eVxuXHRcdFx0IyBzaW1wbHlpbXBvcnQ6ZW5kXG5cdFx0XHRcblx0XHRcdHBhcmVudEJpbmRpbmcgPSBAcGFyZW50QmluZGluZyA9IFNpbXBseUJpbmQocGFyZW50UHJvcGVydHkpLm9mKG9iamVjdCkuX1xuXHRcdFx0cGFyZW50QmluZGluZy5zY2FuRm9yUGhvbGRlcnMoKVxuXHRcdFx0QHZhbHVlID0gcGFyZW50QmluZGluZy5waG9sZGVyVmFsdWVzW0BwaG9sZGVyXVxuXHRcdFxuXHRcdFx0IyBzaW1wbHlpbXBvcnQ6aWYgQlVORExFX1RBUkdFVCA9ICdicm93c2VyJ1xuXHRcdFx0QHRleHROb2RlcyA9IHBhcmVudEJpbmRpbmcudGV4dE5vZGVzW0BwaG9sZGVyXSBpZiBwYXJlbnRCaW5kaW5nLnRleHROb2Rlc1xuXHRcdFx0IyBzaW1wbHlpbXBvcnQ6ZW5kXG5cdFx0XG5cblx0XHRlbHNlXG5cdFx0XHRAdmFsdWUgPSBzdWJqZWN0VmFsdWUgPSBAZmV0Y2hEaXJlY3RWYWx1ZSgpXG5cdFx0XG5cdFx0XHRpZiBAdHlwZSBpcyAnT2JqZWN0UHJvcCcgYW5kIG5vdCBjaGVja0lmLmlzRGVmaW5lZChzdWJqZWN0VmFsdWUpIGFuZCBub3QgZ2V0RGVzY3JpcHRvcihAb2JqZWN0LCBAcHJvcGVydHkpXG5cdFx0XHRcdEBvYmplY3RbQHByb3BlcnR5XSA9IHN1YmplY3RWYWx1ZSAjIERlZmluZSB0aGUgcHJvcCBvbiB0aGUgb2JqZWN0IGlmIGl0IG5vbi1leGlzdGVudFxuXG5cdFx0XHRjb252ZXJ0VG9MaXZlKEAsIEBvYmplY3QpXG5cblxuXHRAYXR0YWNoRXZlbnRzKClcblx0cmV0dXJuIGJvdW5kSW5zdGFuY2VzW0BJRF0gPSBAXG5cblxuXG5cblxuaW1wb3J0ICcuL3Byb3RvdHlwZSdcbiIsIiMjIypcbiAqIFN0YWdlIGRlZmluaXRpb25zOlxuICogXG4gKiAwOiBTZWxlY3Rpb246XHRcdFx0R290IHNlbGVjdG9yLCBhd2FpdGluZyBvYmplY3QuXG4gKiAxOiBJbmRpY2F0aW9uOlx0XHRcdEdvdCBvYmplY3QsIGF3YWl0aW5nIHByb3hpZWQgcHJvcGVydHkgLyBmdW5jdGlvbiAvIEJpbmRpbmctb2JqZWN0LlxuICogMjogQmluZGluZyBDb21wbGV0ZTpcdFx0Q29tcGxldGUsIGF3YWl0aW5nIGFkZGl0aW9uYWwgKG9wdGlvbmFsKSBiaW5kaW5ncy9tdXRhdGlvbnMuXG4jIyNcbkJpbmRpbmdJbnRlcmZhY2UgPSAob3B0aW9ucywgaW5oZXJpdGVkU3RhdGUpLT5cblx0aWYgaW5oZXJpdGVkU3RhdGVcblx0XHRleHRlbmRTdGF0ZShALCBpbmhlcml0ZWRTdGF0ZSlcblx0XHRAc3RhZ2UgPSAxXG5cdGVsc2Vcblx0XHRAc3RhZ2UgPSAwXG5cdFx0QHN1YnMgPSBbXVxuXHRcdEBvcHRpb25zUGFzc2VkID0gb3B0aW9ucyB8fD0ge31cblx0XHRAb3B0aW9ucyA9IHt9XG5cdFx0Zm9yIGtleSBvZiBkZWZhdWx0T3B0aW9uc1xuXHRcdFx0QG9wdGlvbnNba2V5XSA9IGlmIG9wdGlvbnNba2V5XT8gdGhlbiBvcHRpb25zW2tleV0gZWxzZSBkZWZhdWx0T3B0aW9uc1trZXldXG5cdFxuXHRyZXR1cm4gQFx0XHRcdFxuXHRcblxuXG5cbmltcG9ydCAnLi9wcm90b3R5cGUtcHJpdmF0ZSdcbmltcG9ydCAnLi9wcm90b3R5cGUtcHVibGljJyIsIkdyb3VwQmluZGluZyA9IChiaW5kaW5nSW50ZXJmYWNlLCBvYmplY3RzLCBvYmplY3RUeXBlKS0+XG5cdGJpbmRpbmdJbnRlcmZhY2Uuc2VsZWN0b3IgPSBiaW5kaW5nSW50ZXJmYWNlLnNlbGVjdG9yLnNsaWNlKDYpICMgVGFrZSBvdXQgdGhlICdtdWx0aTonXG5cdGV4dGVuZFN0YXRlKEAsIEBpbnRlcmZhY2UgPSBiaW5kaW5nSW50ZXJmYWNlKVxuXHRAaXNNdWx0aSA9IHRydWVcblx0QGJpbmRpbmdzID0gYmluZGluZ3MgPSBbXVxuXG5cdGlmIG9iamVjdHNcblx0XHRAYWRkQmluZGluZyhvYmplY3QsIG9iamVjdFR5cGUpIGZvciBvYmplY3QgaW4gb2JqZWN0c1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIEAsXG5cdFx0J3R5cGUnOlx0XHRcdFx0Z2V0OiAoKS0+IGJpbmRpbmdzLm1hcCAoYmluZGluZyktPiBiaW5kaW5nLnR5cGVcblx0XHQndmFsdWUnOiBcdFx0XHRnZXQ6ICgpLT4gYmluZGluZ3MubWFwIChiaW5kaW5nKS0+IGJpbmRpbmcudmFsdWVcblxuXG5cblxuXG5cbnByb3RvID0gR3JvdXBCaW5kaW5nOjogPSBPYmplY3QuY3JlYXRlKEJpbmRpbmdJbnRlcmZhY2VQcml2YXRlKVxuXG5PYmplY3Qua2V5cyhCaW5kaW5nOjopLmZvckVhY2ggKG1ldGhvZE5hbWUpLT5cdFxuXHRwcm90b1ttZXRob2ROYW1lXSA9IChhLGIsYyxkKS0+ICMgRm91ciBhcmd1bWVudHMgaXMgdGhlIG1vc3QgZXZlciBwYXNzZWQgdG8gYW55IG1ldGhvZCBmcm9tIEJpbmRpbmdJbnRlcmZhY2UgbWV0aG9kc1xuXHRcdGZvciBiaW5kaW5nIGluIEBiaW5kaW5nc1xuXHRcdFx0YiA9IGJpbmRpbmcgaWYgbWV0aG9kTmFtZSBpcyAndXBkYXRlU3ViJ1xuXHRcdFx0YmluZGluZ1ttZXRob2ROYW1lXShhLGIsYyxkKVxuXHRcdFxuXHRcdHJldHVyblxuXG5cbnByb3RvLmFkZEJpbmRpbmcgPSAob2JqZWN0LCBvYmplY3RUeXBlKS0+XG5cdEBiaW5kaW5ncy5wdXNoIGlmIG5vdCBvYmplY3RUeXBlIHRoZW4gb2JqZWN0IGVsc2UgQGNyZWF0ZUJpbmRpbmcob2JqZWN0LCBvYmplY3RUeXBlLCBAaW50ZXJmYWNlKVxuXHRyZXR1cm4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgYW55OiAvLi8sXG4gIHdoaXRlU3BhY2U6IC9cXHMrLyxcbiAgbnVtZXJpYzogL15cXGQkLyxcbiAgbGV0dGVyOiAvXlthLXpBLVpdJC8sXG4gIHdpZGVudW1lcmljOiAvXlswLTlcXCEjXFwkXFwlXFwqXFwrXFwvXFw9XFw/XFxeXFx7XFx8XFx9XFwoXFwpXFx+XFwtXFwuXSQvLFxuICBhbHBoYW51bWVyaWM6IC9eWzAtOUEtWmEtelxcISNcXCRcXCVcXCZcXCdcXCpcXCtcXC9cXD1cXD9cXF5cXF9cXGBcXHtcXHxcXH1cXChcXClcXH5cXC1cXCBdJC8sXG4gIGVtYWlsOiAvXltcXHdcXC1cXC5dK0BbXFx3XFwtXFwuXStcXC5bQS1aYS16XXsyLDEwfSQvXG59O1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKamIyNXpkR0Z1ZEhNdmNtVm5aWGd1WTI5bVptVmxJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHRkZlE9PSIsImNvbnN0YW50cyA9IGltcG9ydCAnLi9jb25zdGFudHMnXG5oZWxwZXJzID0gaW1wb3J0ICcuL2hlbHBlcnMnXG5cblF1aWNrQ1NTID0gKHRhcmdldEVsLCBwcm9wZXJ0eSwgdmFsdWUsIGltcG9ydGFudCktPlxuXHRpZiBoZWxwZXJzLmlzSXRlcmFibGUodGFyZ2V0RWwpXG5cdFx0UXVpY2tDU1Moc3ViRWwsIHByb3BlcnR5LCB2YWx1ZSkgZm9yIHN1YkVsIGluIHRhcmdldEVsXG5cdFxuXHRlbHNlIGlmIHR5cGVvZiBwcm9wZXJ0eSBpcyAnb2JqZWN0JyAjIFBhc3NlZCBhIHN0eWxlIG1hcFxuXHRcdFF1aWNrQ1NTKHRhcmdldEVsLCBzdWJQcm9wZXJ0eSwgc3ViVmFsdWUpIGZvciBzdWJQcm9wZXJ0eSxzdWJWYWx1ZSBvZiBwcm9wZXJ0eVxuXHRcblx0ZWxzZVxuXHRcdHByb3BlcnR5ID0gaGVscGVycy5ub3JtYWxpemVQcm9wZXJ0eShwcm9wZXJ0eSlcblx0XHRpZiB0eXBlb2YgdmFsdWUgaXMgJ3VuZGVmaW5lZCdcblx0XHRcdGNvbXB1dGVkU3R5bGUgPSB0YXJnZXRFbC5fY29tcHV0ZWRTdHlsZSB8fD0gZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXRFbClcblx0XHRcdHJldHVybiBjb21wdXRlZFN0eWxlW3Byb3BlcnR5XVxuXHRcdFxuXHRcdGVsc2UgaWYgcHJvcGVydHlcblx0XHRcdHRhcmdldEVsLnN0eWxlLnNldFByb3BlcnR5KHByb3BlcnR5LCBoZWxwZXJzLm5vcm1hbGl6ZVZhbHVlKHByb3BlcnR5LCB2YWx1ZSksIGNvbnN0YW50cy5JTVBPUlRBTlQgaWYgaW1wb3J0YW50KVxuXG5cdHJldHVyblxuXG5cblF1aWNrQ1NTLmFuaW1hdGlvbiA9IChuYW1lLCBmcmFtZXMpLT4gaWYgbmFtZSBhbmQgdHlwZW9mIG5hbWUgaXMgJ3N0cmluZycgYW5kIGZyYW1lcyBhbmQgdHlwZW9mIGZyYW1lcyBpcyAnb2JqZWN0J1xuXHRwcmVmaXggPSBoZWxwZXJzLmdldFByZWZpeCgnYW5pbWF0aW9uJylcblx0Z2VuZXJhdGVkID0gJydcblx0XG5cdGZvciBmcmFtZSxydWxlcyBvZiBmcmFtZXNcblx0XHRnZW5lcmF0ZWQgKz0gXCIje2ZyYW1lfSB7I3toZWxwZXJzLnJ1bGVUb1N0cmluZyhydWxlcyl9fVwiXG5cblx0Z2VuZXJhdGVkID0gXCJAI3twcmVmaXh9a2V5ZnJhbWVzICN7bmFtZX0geyN7Z2VuZXJhdGVkfX1cIlxuXHRoZWxwZXJzLmlubGluZVN0eWxlKGdlbmVyYXRlZCwgdHJ1ZSwgMClcblxuXG5RdWlja0NTUy5yZWdpc3RlciA9IChydWxlLCBsZXZlbCwgaW1wb3J0YW50KS0+IGlmIHJ1bGUgYW5kIHR5cGVvZiBydWxlIGlzICdvYmplY3QnXG5cdGxldmVsIHx8PSAwXG5cdHJ1bGUgPSBoZWxwZXJzLnJ1bGVUb1N0cmluZyhydWxlLCBpbXBvcnRhbnQpXG5cdFxuXHR1bmxlc3MgY2xhc3NOYW1lID0gaGVscGVycy5pbmxpbmVTdHlsZUNvbmZpZ1tsZXZlbF0/W3J1bGVdXG5cdFx0Y2xhc3NOYW1lID0gaGVscGVycy5oYXNoKHJ1bGUpXG5cdFx0c3R5bGUgPSBcIi4je2NsYXNzTmFtZX0geyN7cnVsZX19XCJcblx0XHRoZWxwZXJzLmlubGluZVN0eWxlKHN0eWxlLCBjbGFzc05hbWUsIGxldmVsKVxuXG5cdHJldHVybiBjbGFzc05hbWVcblxuXG5RdWlja0NTUy5jbGVhclJlZ2lzdGVyZWQgPSAobGV2ZWwpLT5cblx0aGVscGVycy5jbGVhcklubGluZVN0eWxlKGxldmVsIG9yIDApXG5cblxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuUXVpY2tDU1MuVU5TRVQgPSBzd2l0Y2hcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCd1bnNldCcpIHRoZW4gJ3Vuc2V0J1xuXHR3aGVuIGhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZCgnZGlzcGxheScsJ2luaXRpYWwnKSB0aGVuICdpbml0aWFsJ1xuXHR3aGVuIGhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZCgnZGlzcGxheScsJ2luaGVyaXQnKSB0aGVuICdpbmhlcml0J1xuXG5RdWlja0NTUy5zdXBwb3J0cyA9IGhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZFxuUXVpY2tDU1Muc3VwcG9ydHNQcm9wZXJ0eSA9IGhlbHBlcnMuaXNQcm9wU3VwcG9ydGVkXG5RdWlja0NTUy5ub3JtYWxpemVQcm9wZXJ0eSA9IGhlbHBlcnMubm9ybWFsaXplUHJvcGVydHlcblF1aWNrQ1NTLm5vcm1hbGl6ZVZhbHVlID0gaGVscGVycy5ub3JtYWxpemVWYWx1ZVxuUXVpY2tDU1MudmVyc2lvbiA9IGltcG9ydCAnLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbidcbm1vZHVsZS5leHBvcnRzID0gUXVpY2tDU1MiLCJ7XG4gIFwiX2Zyb21cIjogXCJxdWlja2Nzc0BeMS4zLjRcIixcbiAgXCJfaWRcIjogXCJxdWlja2Nzc0AxLjMuNFwiLFxuICBcIl9pbkJ1bmRsZVwiOiBmYWxzZSxcbiAgXCJfaW50ZWdyaXR5XCI6IFwic2hhNTEyLVVEd0xOWDVxMHF1RTltVk5jekNSWEJadkdMYms4clVNekMwWDNKS3QyWmFqdlVGd3Z0RWxhREgxRjFXY2tJaTZUM0RHZXZ0Um9LWGtQNkNRZHNZMnlnPT1cIixcbiAgXCJfbG9jYXRpb25cIjogXCIvcXVpY2tkb20vcXVpY2tjc3NcIixcbiAgXCJfcGhhbnRvbUNoaWxkcmVuXCI6IHt9LFxuICBcIl9yZXF1ZXN0ZWRcIjoge1xuICAgIFwidHlwZVwiOiBcInJhbmdlXCIsXG4gICAgXCJyZWdpc3RyeVwiOiB0cnVlLFxuICAgIFwicmF3XCI6IFwicXVpY2tjc3NAXjEuMy40XCIsXG4gICAgXCJuYW1lXCI6IFwicXVpY2tjc3NcIixcbiAgICBcImVzY2FwZWROYW1lXCI6IFwicXVpY2tjc3NcIixcbiAgICBcInJhd1NwZWNcIjogXCJeMS4zLjRcIixcbiAgICBcInNhdmVTcGVjXCI6IG51bGwsXG4gICAgXCJmZXRjaFNwZWNcIjogXCJeMS4zLjRcIlxuICB9LFxuICBcIl9yZXF1aXJlZEJ5XCI6IFtcbiAgICBcIi9xdWlja2RvbVwiXG4gIF0sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvcXVpY2tjc3MvLS9xdWlja2Nzcy0xLjMuNC50Z3pcIixcbiAgXCJfc2hhc3VtXCI6IFwiY2UxNDVjYTUxMWJjNTA2YjJkOWE2MTRlZDViNjFlNzg2OWZlMTFkNVwiLFxuICBcIl9zcGVjXCI6IFwicXVpY2tjc3NAXjEuMy40XCIsXG4gIFwiX3doZXJlXCI6IFwiL1VzZXJzL2RhbmllbGthbGVuL3NhbmRib3gvcXVpY2tmaWVsZC9ub2RlX21vZHVsZXMvcXVpY2tkb21cIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcImRhbmllbGthbGVuXCJcbiAgfSxcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3F1aWNrY3NzLmRlYnVnLmpzXCIsXG4gICAgXCIuL2Rpc3QvcXVpY2tjc3MuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2Nzcy9pc3N1ZXNcIlxuICB9LFxuICBcImJ1bmRsZURlcGVuZGVuY2llc1wiOiBmYWxzZSxcbiAgXCJkZXByZWNhdGVkXCI6IGZhbHNlLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiRmFzdCAmIGxpZ2h0IHdyYXBwZXIgZm9yIGdldHRpbmcvc2V0dGluZyBDU1MgcnVsZXNcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy41LjBcIixcbiAgICBcImNoYWxrXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJjb2ZmZWUtc2NyaXB0XCI6IFwiXjEuMTIuNlwiLFxuICAgIFwiZXhlY2FcIjogXCJeMC43LjBcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4zXCIsXG4gICAgXCJwcm9taXNlLWJyZWFrXCI6IFwiXjAuMS4xXCIsXG4gICAgXCJzZW12ZXJcIjogXCJeNS4zLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuMC1zMjdcIixcbiAgICBcInNpbXBseXdhdGNoXCI6IFwiXjMuMC4wLWwyXCJcbiAgfSxcbiAgXCJkaXJlY3Rvcmllc1wiOiB7XG4gICAgXCJ0ZXN0XCI6IFwidGVzdFwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tjc3MjcmVhZG1lXCIsXG4gIFwibGljZW5zZVwiOiBcIklTQ1wiLFxuICBcIm1haW5cIjogXCJkaXN0L3F1aWNrY3NzLmpzXCIsXG4gIFwibmFtZVwiOiBcInF1aWNrY3NzXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrY3NzLmdpdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcImNha2UgLWQgYnVpbGQgJiYgY2FrZSBidWlsZCAmJiBjYWtlIG1lYXN1cmUgJiYgY3AgLXIgYnVpbGQvKiBkaXN0L1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJjYWtlIGluc3RhbGw6Y292ZXJhZ2U7IG5wbSBydW4gY292ZXJhZ2U6cnVuICYmIG5wbSBydW4gY292ZXJhZ2U6YmFkZ2VcIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnJ1blwiOiBcImNvdmVyYWdlPXRydWUgbnBtIHJ1biB0ZXN0OmVsZWN0cm9uXCIsXG4gICAgXCJjb3ZlcmFnZTpzaG93XCI6IFwib3BlbiBjb3ZlcmFnZS9sY292LXJlcG9ydC9pbmRleC5odG1sXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJwb3N0dmVyc2lvblwiOiBcIm5wbSBydW4gYnVpbGQgJiYgZ2l0IGFkZCAuICYmIGdpdCBjb21taXQgLWEgLW0gJ1tCdWlsZF0nXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcIm5wbSBydW4gdGVzdDp0cmF2aXNcIixcbiAgICBcInRlc3RcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OmJyb3dzZXJcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRWxlY3Ryb24gLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpjaHJvbWVcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIENocm9tZSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmZpcmVmb3hcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRmlyZWZveCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpsb2NhbFwiOiBcIm9wZW4gdGVzdC90ZXN0cnVubmVyLmh0bWxcIixcbiAgICBcInRlc3Q6bWluaWZpZWRcIjogXCJtaW5pZmllZD0xIG5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6c2FmYXJpXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBTYWZhcmkgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYXVjZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIHNhdWNlPTEga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDp0cmF2aXNcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcIndhdGNoXCI6IFwiY2FrZSAtZCB3YXRjaFwiXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjMuNFwiXG59XG4iLCJhdmFpbFNldHMgPSBcblx0bmF0aXZlczogaW1wb3J0ICcuL25hdGl2ZXMnXG5cdGRvbTogaW1wb3J0ICcuL2RvbSdcblxuY2xhc3MgQ2hlY2tzXG5cdGNyZWF0ZTogKCktPlxuXHRcdGFyZ3MgPSBBcnJheTo6c2xpY2UuY2FsbChhcmd1bWVudHMpIGlmIGFyZ3VtZW50cy5sZW5ndGhcblx0XHRuZXcgQ2hlY2tzKGFyZ3MpXG5cdFxuXG5cdGNvbnN0cnVjdG9yOiAoc2V0cyktPlxuXHRcdHNldHMgPz0gWyduYXRpdmVzJ11cblx0XHRcblx0XHRmb3Igc2V0IGluIHNldHNcblx0XHRcdEBsb2FkKGF2YWlsU2V0c1tzZXRdKSBpZiBhdmFpbFNldHNbc2V0XVxuXG5cblx0bG9hZDogKHNldCktPlxuXHRcdHNldCA9IGF2YWlsU2V0c1tzZXRdIGlmIGF2YWlsU2V0cy5uYXRpdmVzLnN0cmluZyhzZXQpXG5cdFx0cmV0dXJuIGlmIG5vdCBhdmFpbFNldHMubmF0aXZlcy5vYmplY3RQbGFpbihzZXQpXG5cdFx0XG5cdFx0Zm9yIGtleSx2YWx1ZSBvZiBzZXRcblx0XHRcdEBba2V5XSA9IHZhbHVlXG5cdFx0XG5cdFx0cmV0dXJuXG5cdFxuXHRcbm1vZHVsZS5leHBvcnRzID0gQ2hlY2tzOjpjcmVhdGUoKSIsInZhciBleHRlbmQsIGlzQXJyYXksIGlzT2JqZWN0LCBzaG91bGREZWVwRXh0ZW5kO1xuXG5pc0FycmF5ID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHRhcmdldCk7XG59O1xuXG5pc09iamVjdCA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICByZXR1cm4gdGFyZ2V0ICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0YXJnZXQpID09PSAnW29iamVjdCBPYmplY3RdJyB8fCBpc0FycmF5KHRhcmdldCk7XG59O1xuXG5zaG91bGREZWVwRXh0ZW5kID0gZnVuY3Rpb24ob3B0aW9ucywgdGFyZ2V0LCBwYXJlbnRLZXkpIHtcbiAgaWYgKG9wdGlvbnMuZGVlcCkge1xuICAgIGlmIChvcHRpb25zLm5vdERlZXApIHtcbiAgICAgIHJldHVybiAhb3B0aW9ucy5ub3REZWVwW3RhcmdldF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIGlmIChvcHRpb25zLmRlZXBPbmx5KSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuZGVlcE9ubHlbdGFyZ2V0XSB8fCBwYXJlbnRLZXkgJiYgc2hvdWxkRGVlcEV4dGVuZChvcHRpb25zLCBwYXJlbnRLZXkpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZCA9IGZ1bmN0aW9uKG9wdGlvbnMsIHRhcmdldCwgc291cmNlcywgcGFyZW50S2V5KSB7XG4gIHZhciBpLCBrZXksIGxlbiwgc291cmNlLCBzb3VyY2VWYWx1ZSwgc3ViVGFyZ2V0LCB0YXJnZXRWYWx1ZTtcbiAgaWYgKCF0YXJnZXQgfHwgdHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHRhcmdldCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRhcmdldCA9IHt9O1xuICB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IHNvdXJjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBzb3VyY2UgPSBzb3VyY2VzW2ldO1xuICAgIGlmIChzb3VyY2UgIT0gbnVsbCkge1xuICAgICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIHNvdXJjZVZhbHVlID0gc291cmNlW2tleV07XG4gICAgICAgIHRhcmdldFZhbHVlID0gdGFyZ2V0W2tleV07XG4gICAgICAgIGlmIChzb3VyY2VWYWx1ZSA9PT0gdGFyZ2V0IHx8IHNvdXJjZVZhbHVlID09PSB2b2lkIDAgfHwgKHNvdXJjZVZhbHVlID09PSBudWxsICYmICFvcHRpb25zLmFsbG93TnVsbCAmJiAhb3B0aW9ucy5udWxsRGVsZXRlcykgfHwgKG9wdGlvbnMua2V5cyAmJiAhb3B0aW9ucy5rZXlzW2tleV0pIHx8IChvcHRpb25zLm5vdEtleXMgJiYgb3B0aW9ucy5ub3RLZXlzW2tleV0pIHx8IChvcHRpb25zLm93biAmJiAhc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHx8IChvcHRpb25zLmdsb2JhbEZpbHRlciAmJiAhb3B0aW9ucy5nbG9iYWxGaWx0ZXIoc291cmNlVmFsdWUsIGtleSwgc291cmNlKSkgfHwgKG9wdGlvbnMuZmlsdGVycyAmJiBvcHRpb25zLmZpbHRlcnNba2V5XSAmJiAhb3B0aW9ucy5maWx0ZXJzW2tleV0oc291cmNlVmFsdWUsIGtleSwgc291cmNlKSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc291cmNlVmFsdWUgPT09IG51bGwgJiYgb3B0aW9ucy5udWxsRGVsZXRlcykge1xuICAgICAgICAgIGRlbGV0ZSB0YXJnZXRba2V5XTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5nbG9iYWxUcmFuc2Zvcm0pIHtcbiAgICAgICAgICBzb3VyY2VWYWx1ZSA9IG9wdGlvbnMuZ2xvYmFsVHJhbnNmb3JtKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMudHJhbnNmb3JtcyAmJiBvcHRpb25zLnRyYW5zZm9ybXNba2V5XSkge1xuICAgICAgICAgIHNvdXJjZVZhbHVlID0gb3B0aW9ucy50cmFuc2Zvcm1zW2tleV0oc291cmNlVmFsdWUsIGtleSwgc291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGZhbHNlKSB7XG4gICAgICAgICAgY2FzZSAhKG9wdGlvbnMuY29uY2F0ICYmIGlzQXJyYXkoc291cmNlVmFsdWUpICYmIGlzQXJyYXkodGFyZ2V0VmFsdWUpKTpcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gdGFyZ2V0VmFsdWUuY29uY2F0KHNvdXJjZVZhbHVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgIShzaG91bGREZWVwRXh0ZW5kKG9wdGlvbnMsIGtleSwgcGFyZW50S2V5KSAmJiBpc09iamVjdChzb3VyY2VWYWx1ZSkpOlxuICAgICAgICAgICAgc3ViVGFyZ2V0ID0gaXNPYmplY3QodGFyZ2V0VmFsdWUpID8gdGFyZ2V0VmFsdWUgOiBpc0FycmF5KHNvdXJjZVZhbHVlKSA/IFtdIDoge307XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IGV4dGVuZChvcHRpb25zLCBzdWJUYXJnZXQsIFtzb3VyY2VWYWx1ZV0sIGtleSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2VWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdmMyMWhjblF0WlhoMFpXNWtMM055WXk5bGVIUmxibVF1WTI5bVptVmxJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHRkZlE9PSIsImNvbnN0YW50cyA9IGltcG9ydCAnLi9jb25zdGFudHMnXG5oZWxwZXJzID0gaW1wb3J0ICcuL2hlbHBlcnMnXG5cblF1aWNrQ1NTID0gKHRhcmdldEVsLCBwcm9wZXJ0eSwgdmFsdWUpLT5cblx0aWYgaGVscGVycy5pc0l0ZXJhYmxlKHRhcmdldEVsKVxuXHRcdFF1aWNrQ1NTKHN1YkVsLCBwcm9wZXJ0eSwgdmFsdWUpIGZvciBzdWJFbCBpbiB0YXJnZXRFbFxuXHRcblx0ZWxzZSBpZiB0eXBlb2YgcHJvcGVydHkgaXMgJ29iamVjdCcgIyBQYXNzZWQgYSBzdHlsZSBtYXBcblx0XHRRdWlja0NTUyh0YXJnZXRFbCwgc3ViUHJvcGVydHksIHN1YlZhbHVlKSBmb3Igc3ViUHJvcGVydHksc3ViVmFsdWUgb2YgcHJvcGVydHlcblx0XG5cdGVsc2Vcblx0XHRwcm9wZXJ0eSA9IGhlbHBlcnMubm9ybWFsaXplUHJvcGVydHkocHJvcGVydHkpXG5cdFx0aWYgdHlwZW9mIHZhbHVlIGlzICd1bmRlZmluZWQnXG5cdFx0XHRjb21wdXRlZFN0eWxlID0gdGFyZ2V0RWwuX2NvbXB1dGVkU3R5bGUgfHw9IGdldENvbXB1dGVkU3R5bGUodGFyZ2V0RWwpXG5cdFx0XHRyZXR1cm4gY29tcHV0ZWRTdHlsZVtwcm9wZXJ0eV1cblx0XHRcblx0XHRlbHNlIGlmIHByb3BlcnR5XG5cdFx0XHR0YXJnZXRFbC5zdHlsZVtwcm9wZXJ0eV0gPSBoZWxwZXJzLm5vcm1hbGl6ZVZhbHVlKHByb3BlcnR5LCB2YWx1ZSlcblxuXHRyZXR1cm5cblxuXG5RdWlja0NTUy5hbmltYXRpb24gPSAobmFtZSwgZnJhbWVzKS0+IGlmIG5hbWUgYW5kIHR5cGVvZiBuYW1lIGlzICdzdHJpbmcnIGFuZCBmcmFtZXMgYW5kIHR5cGVvZiBmcmFtZXMgaXMgJ29iamVjdCdcblx0cHJlZml4ID0gaGVscGVycy5nZXRQcmVmaXgoJ2FuaW1hdGlvbicpXG5cdGdlbmVyYXRlZCA9ICcnXG5cdFxuXHRmb3IgZnJhbWUscnVsZXMgb2YgZnJhbWVzXG5cdFx0Z2VuZXJhdGVkICs9IFwiI3tmcmFtZX0geyN7aGVscGVycy5ydWxlVG9TdHJpbmcocnVsZXMpfX1cIlxuXG5cdGdlbmVyYXRlZCA9IFwiQCN7cHJlZml4fWtleWZyYW1lcyAje25hbWV9IHsje2dlbmVyYXRlZH19XCJcblx0aGVscGVycy5pbmxpbmVTdHlsZShnZW5lcmF0ZWQsIHRydWUsIDApXG5cblxuUXVpY2tDU1MucmVnaXN0ZXIgPSAocnVsZSwgbGV2ZWwpLT4gaWYgcnVsZSBhbmQgdHlwZW9mIHJ1bGUgaXMgJ29iamVjdCdcblx0bGV2ZWwgfHw9IDBcblx0cnVsZSA9IGhlbHBlcnMucnVsZVRvU3RyaW5nKHJ1bGUpXG5cdFxuXHR1bmxlc3MgY2xhc3NOYW1lID0gaGVscGVycy5pbmxpbmVTdHlsZUNvbmZpZ1tsZXZlbF0/W3J1bGVdXG5cdFx0Y2xhc3NOYW1lID0gaGVscGVycy5oYXNoKHJ1bGUpXG5cdFx0c3R5bGUgPSBcIi4je2NsYXNzTmFtZX0geyN7cnVsZX19XCJcblx0XHRoZWxwZXJzLmlubGluZVN0eWxlKHN0eWxlLCBjbGFzc05hbWUsIGxldmVsKVxuXG5cdHJldHVybiBjbGFzc05hbWVcblxuXG5RdWlja0NTUy5jbGVhclJlZ2lzdGVyZWQgPSAobGV2ZWwpLT5cblx0aGVscGVycy5jbGVhcklubGluZVN0eWxlKGxldmVsIG9yIDApXG5cblxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuUXVpY2tDU1MuVU5TRVQgPSBzd2l0Y2hcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCd1bnNldCcpIHRoZW4gJ3Vuc2V0J1xuXHR3aGVuIGhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZCgnZGlzcGxheScsJ2luaXRpYWwnKSB0aGVuICdpbml0aWFsJ1xuXHR3aGVuIGhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZCgnZGlzcGxheScsJ2luaGVyaXQnKSB0aGVuICdpbmhlcml0J1xuXG5RdWlja0NTUy5zdXBwb3J0cyA9IGhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZFxuUXVpY2tDU1Muc3VwcG9ydHNQcm9wZXJ0eSA9IGhlbHBlcnMuaXNQcm9wU3VwcG9ydGVkXG5RdWlja0NTUy5ub3JtYWxpemVQcm9wZXJ0eSA9IGhlbHBlcnMubm9ybWFsaXplUHJvcGVydHlcblF1aWNrQ1NTLm5vcm1hbGl6ZVZhbHVlID0gaGVscGVycy5ub3JtYWxpemVWYWx1ZVxuUXVpY2tDU1MudmVyc2lvbiA9IGltcG9ydCAnLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbidcbm1vZHVsZS5leHBvcnRzID0gUXVpY2tDU1MiLCJ7XG4gIFwiX2FyZ3NcIjogW1xuICAgIFtcbiAgICAgIFwicXVpY2tjc3NAMS4zLjJcIixcbiAgICAgIFwiL1VzZXJzL2RhbmllbGthbGVuL3NhbmRib3gvcXVpY2tmaWVsZFwiXG4gICAgXVxuICBdLFxuICBcIl9mcm9tXCI6IFwicXVpY2tjc3NAMS4zLjJcIixcbiAgXCJfaWRcIjogXCJxdWlja2Nzc0AxLjMuMlwiLFxuICBcIl9pbkJ1bmRsZVwiOiBmYWxzZSxcbiAgXCJfaW50ZWdyaXR5XCI6IFwic2hhNTEyLUxqQlVCbzVyZXFtY0g1RkNDMnRZUW5RV20zNndCMFdYc0JObXM1Z0Q5V055TjdUNFdIOWpsVkdRUC9ubkVubUh0M1NEbnlyYXNUM2VNYkVVRE52WFFRPT1cIixcbiAgXCJfbG9jYXRpb25cIjogXCIvcXVpY2tjc3NcIixcbiAgXCJfcGhhbnRvbUNoaWxkcmVuXCI6IHt9LFxuICBcIl9yZXF1ZXN0ZWRcIjoge1xuICAgIFwidHlwZVwiOiBcInZlcnNpb25cIixcbiAgICBcInJlZ2lzdHJ5XCI6IHRydWUsXG4gICAgXCJyYXdcIjogXCJxdWlja2Nzc0AxLjMuMlwiLFxuICAgIFwibmFtZVwiOiBcInF1aWNrY3NzXCIsXG4gICAgXCJlc2NhcGVkTmFtZVwiOiBcInF1aWNrY3NzXCIsXG4gICAgXCJyYXdTcGVjXCI6IFwiMS4zLjJcIixcbiAgICBcInNhdmVTcGVjXCI6IG51bGwsXG4gICAgXCJmZXRjaFNwZWNcIjogXCIxLjMuMlwiXG4gIH0sXG4gIFwiX3JlcXVpcmVkQnlcIjogW1xuICAgIFwiL1wiXG4gIF0sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvcXVpY2tjc3MvLS9xdWlja2Nzcy0xLjMuMi50Z3pcIixcbiAgXCJfc3BlY1wiOiBcIjEuMy4yXCIsXG4gIFwiX3doZXJlXCI6IFwiL1VzZXJzL2RhbmllbGthbGVuL3NhbmRib3gvcXVpY2tmaWVsZFwiLFxuICBcImF1dGhvclwiOiB7XG4gICAgXCJuYW1lXCI6IFwiZGFuaWVsa2FsZW5cIlxuICB9LFxuICBcImJyb3dzZXJcIjoge1xuICAgIFwiLi9kZWJ1Z1wiOiBcImRpc3QvcXVpY2tjc3MuZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9xdWlja2Nzcy5qc1wiOiBcInNyYy9pbmRleC5jb2ZmZWVcIlxuICB9LFxuICBcImJyb3dzZXJpZnlcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwic2ltcGx5aW1wb3J0L2NvbXBhdFwiXG4gICAgXVxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrY3NzL2lzc3Vlc1wiXG4gIH0sXG4gIFwiZGVzY3JpcHRpb25cIjogXCJGYXN0ICYgbGlnaHQgd3JhcHBlciBmb3IgZ2V0dGluZy9zZXR0aW5nIENTUyBydWxlc1wiLFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY2hhbGtcIjogXCJeMi4wLjFcIixcbiAgICBcImNvZmZlZS1zY3JpcHRcIjogXCJeMS4xMi42XCIsXG4gICAgXCJleGVjYVwiOiBcIl4wLjcuMFwiLFxuICAgIFwiZnMtamV0cGFja1wiOiBcIl4wLjEzLjNcIixcbiAgICBcInByb21pc2UtYnJlYWtcIjogXCJeMC4xLjFcIixcbiAgICBcInNlbXZlclwiOiBcIl41LjMuMFwiLFxuICAgIFwic2ltcGx5aW1wb3J0XCI6IFwiXjQuMC4wLXMyN1wiLFxuICAgIFwic2ltcGx5d2F0Y2hcIjogXCJeMy4wLjAtbDJcIlxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2NzcyNyZWFkbWVcIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwibWFpblwiOiBcImRpc3QvcXVpY2tjc3MuanNcIixcbiAgXCJuYW1lXCI6IFwicXVpY2tjc3NcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tjc3MuZ2l0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLi8uY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwibnBtIHJ1biB0ZXN0OnRyYXZpc1wiLFxuICAgIFwidGVzdFwiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6YnJvd3NlclwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBFbGVjdHJvbiAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmNocm9tZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgQ2hyb21lIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6ZmlyZWZveFwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBGaXJlZm94IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6a2FybWFcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmxvY2FsXCI6IFwib3BlbiB0ZXN0L3Rlc3RydW5uZXIuaHRtbFwiLFxuICAgIFwidGVzdDptaW5pZmllZFwiOiBcIm1pbmlmaWVkPTEgbnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnRyYXZpc1wiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zICYmIG5wbSBydW4gdGVzdDptaW5pZmllZCAtc1wiLFxuICAgIFwid2F0Y2hcIjogXCJjYWtlIC1kIHdhdGNoXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXN1cGVyXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktcmVuYW1lXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc2ltcGxlXCJcbiAgICBdXG4gIH0sXG4gIFwidmVyc2lvblwiOiBcIjEuMy4yXCJcbn1cbiIsIiEoZnVuY3Rpb24od2luKSB7XG5cbi8qKlxuICogRmFzdERvbVxuICpcbiAqIEVsaW1pbmF0ZXMgbGF5b3V0IHRocmFzaGluZ1xuICogYnkgYmF0Y2hpbmcgRE9NIHJlYWQvd3JpdGVcbiAqIGludGVyYWN0aW9ucy5cbiAqXG4gKiBAYXV0aG9yIFdpbHNvbiBQYWdlIDx3aWxzb25wYWdlQG1lLmNvbT5cbiAqIEBhdXRob3IgS29ybmVsIExlc2luc2tpIDxrb3JuZWwubGVzaW5za2lAZnQuY29tPlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNaW5pIGxvZ2dlclxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG52YXIgZGVidWcgPSAwID8gY29uc29sZS5sb2cuYmluZChjb25zb2xlLCAnW2Zhc3Rkb21dJykgOiBmdW5jdGlvbigpIHt9O1xuXG4vKipcbiAqIE5vcm1hbGl6ZWQgckFGXG4gKlxuICogQHR5cGUge0Z1bmN0aW9ufVxuICovXG52YXIgcmFmID0gd2luLnJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IGZ1bmN0aW9uKGNiKSB7IHJldHVybiBzZXRUaW1lb3V0KGNiLCAxNik7IH07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIGBGYXN0RG9tYC5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gRmFzdERvbSgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLnJlYWRzID0gW107XG4gIHNlbGYud3JpdGVzID0gW107XG4gIHNlbGYucmFmID0gcmFmLmJpbmQod2luKTsgLy8gdGVzdCBob29rXG4gIGRlYnVnKCdpbml0aWFsaXplZCcsIHNlbGYpO1xufVxuXG5GYXN0RG9tLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEZhc3REb20sXG5cbiAgLyoqXG4gICAqIEFkZHMgYSBqb2IgdG8gdGhlIHJlYWQgYmF0Y2ggYW5kXG4gICAqIHNjaGVkdWxlcyBhIG5ldyBmcmFtZSBpZiBuZWVkIGJlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgbWVhc3VyZTogZnVuY3Rpb24oZm4sIGN0eCkge1xuICAgIGRlYnVnKCdtZWFzdXJlJyk7XG4gICAgdmFyIHRhc2sgPSAhY3R4ID8gZm4gOiBmbi5iaW5kKGN0eCk7XG4gICAgdGhpcy5yZWFkcy5wdXNoKHRhc2spO1xuICAgIHNjaGVkdWxlRmx1c2godGhpcyk7XG4gICAgcmV0dXJuIHRhc2s7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZHMgYSBqb2IgdG8gdGhlXG4gICAqIHdyaXRlIGJhdGNoIGFuZCBzY2hlZHVsZXNcbiAgICogYSBuZXcgZnJhbWUgaWYgbmVlZCBiZS5cbiAgICpcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIG11dGF0ZTogZnVuY3Rpb24oZm4sIGN0eCkge1xuICAgIGRlYnVnKCdtdXRhdGUnKTtcbiAgICB2YXIgdGFzayA9ICFjdHggPyBmbiA6IGZuLmJpbmQoY3R4KTtcbiAgICB0aGlzLndyaXRlcy5wdXNoKHRhc2spO1xuICAgIHNjaGVkdWxlRmx1c2godGhpcyk7XG4gICAgcmV0dXJuIHRhc2s7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENsZWFycyBhIHNjaGVkdWxlZCAncmVhZCcgb3IgJ3dyaXRlJyB0YXNrLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFza1xuICAgKiBAcmV0dXJuIHtCb29sZWFufSBzdWNjZXNzXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFyOiBmdW5jdGlvbih0YXNrKSB7XG4gICAgZGVidWcoJ2NsZWFyJywgdGFzayk7XG4gICAgcmV0dXJuIHJlbW92ZSh0aGlzLnJlYWRzLCB0YXNrKSB8fCByZW1vdmUodGhpcy53cml0ZXMsIHRhc2spO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeHRlbmQgdGhpcyBGYXN0RG9tIHdpdGggc29tZVxuICAgKiBjdXN0b20gZnVuY3Rpb25hbGl0eS5cbiAgICpcbiAgICogQmVjYXVzZSBmYXN0ZG9tIG11c3QgKmFsd2F5cyogYmUgYVxuICAgKiBzaW5nbGV0b24sIHdlJ3JlIGFjdHVhbGx5IGV4dGVuZGluZ1xuICAgKiB0aGUgZmFzdGRvbSBpbnN0YW5jZS4gVGhpcyBtZWFucyB0YXNrc1xuICAgKiBzY2hlZHVsZWQgYnkgYW4gZXh0ZW5zaW9uIHN0aWxsIGVudGVyXG4gICAqIGZhc3Rkb20ncyBnbG9iYWwgdGFzayBxdWV1ZS5cbiAgICpcbiAgICogVGhlICdzdXBlcicgaW5zdGFuY2UgY2FuIGJlIGFjY2Vzc2VkXG4gICAqIGZyb20gYHRoaXMuZmFzdGRvbWAuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBteUZhc3Rkb20gPSBmYXN0ZG9tLmV4dGVuZCh7XG4gICAqICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAqICAgICAvLyBydW5zIG9uIGNyZWF0aW9uXG4gICAqICAgfSxcbiAgICpcbiAgICogICAvLyBvdmVycmlkZSBhIG1ldGhvZFxuICAgKiAgIG1lYXN1cmU6IGZ1bmN0aW9uKGZuKSB7XG4gICAqICAgICAvLyBkbyBleHRyYSBzdHVmZiAuLi5cbiAgICpcbiAgICogICAgIC8vIHRoZW4gY2FsbCB0aGUgb3JpZ2luYWxcbiAgICogICAgIHJldHVybiB0aGlzLmZhc3Rkb20ubWVhc3VyZShmbik7XG4gICAqICAgfSxcbiAgICpcbiAgICogICAuLi5cbiAgICogfSk7XG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gcHJvcHMgIHByb3BlcnRpZXMgdG8gbWl4aW5cbiAgICogQHJldHVybiB7RmFzdERvbX1cbiAgICovXG4gIGV4dGVuZDogZnVuY3Rpb24ocHJvcHMpIHtcbiAgICBkZWJ1ZygnZXh0ZW5kJywgcHJvcHMpO1xuICAgIGlmICh0eXBlb2YgcHJvcHMgIT0gJ29iamVjdCcpIHRocm93IG5ldyBFcnJvcignZXhwZWN0ZWQgb2JqZWN0Jyk7XG5cbiAgICB2YXIgY2hpbGQgPSBPYmplY3QuY3JlYXRlKHRoaXMpO1xuICAgIG1peGluKGNoaWxkLCBwcm9wcyk7XG4gICAgY2hpbGQuZmFzdGRvbSA9IHRoaXM7XG5cbiAgICAvLyBydW4gb3B0aW9uYWwgY3JlYXRpb24gaG9va1xuICAgIGlmIChjaGlsZC5pbml0aWFsaXplKSBjaGlsZC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gY2hpbGQ7XG4gIH0sXG5cbiAgLy8gb3ZlcnJpZGUgdGhpcyB3aXRoIGEgZnVuY3Rpb25cbiAgLy8gdG8gcHJldmVudCBFcnJvcnMgaW4gY29uc29sZVxuICAvLyB3aGVuIHRhc2tzIHRocm93XG4gIGNhdGNoOiBudWxsXG59O1xuXG4vKipcbiAqIFNjaGVkdWxlcyBhIG5ldyByZWFkL3dyaXRlXG4gKiBiYXRjaCBpZiBvbmUgaXNuJ3QgcGVuZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBzY2hlZHVsZUZsdXNoKGZhc3Rkb20pIHtcbiAgaWYgKCFmYXN0ZG9tLnNjaGVkdWxlZCkge1xuICAgIGZhc3Rkb20uc2NoZWR1bGVkID0gdHJ1ZTtcbiAgICBmYXN0ZG9tLnJhZihmbHVzaC5iaW5kKG51bGwsIGZhc3Rkb20pKTtcbiAgICBkZWJ1ZygnZmx1c2ggc2NoZWR1bGVkJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBSdW5zIHF1ZXVlZCBgcmVhZGAgYW5kIGB3cml0ZWAgdGFza3MuXG4gKlxuICogRXJyb3JzIGFyZSBjYXVnaHQgYW5kIHRocm93biBieSBkZWZhdWx0LlxuICogSWYgYSBgLmNhdGNoYCBmdW5jdGlvbiBoYXMgYmVlbiBkZWZpbmVkXG4gKiBpdCBpcyBjYWxsZWQgaW5zdGVhZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBmbHVzaChmYXN0ZG9tKSB7XG4gIGRlYnVnKCdmbHVzaCcpO1xuXG4gIHZhciB3cml0ZXMgPSBmYXN0ZG9tLndyaXRlcztcbiAgdmFyIHJlYWRzID0gZmFzdGRvbS5yZWFkcztcbiAgdmFyIGVycm9yO1xuXG4gIHRyeSB7XG4gICAgZGVidWcoJ2ZsdXNoaW5nIHJlYWRzJywgcmVhZHMubGVuZ3RoKTtcbiAgICBydW5UYXNrcyhyZWFkcyk7XG4gICAgZGVidWcoJ2ZsdXNoaW5nIHdyaXRlcycsIHdyaXRlcy5sZW5ndGgpO1xuICAgIHJ1blRhc2tzKHdyaXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgZXJyb3IgPSBlOyB9XG5cbiAgZmFzdGRvbS5zY2hlZHVsZWQgPSBmYWxzZTtcblxuICAvLyBJZiB0aGUgYmF0Y2ggZXJyb3JlZCB3ZSBtYXkgc3RpbGwgaGF2ZSB0YXNrcyBxdWV1ZWRcbiAgaWYgKHJlYWRzLmxlbmd0aCB8fCB3cml0ZXMubGVuZ3RoKSBzY2hlZHVsZUZsdXNoKGZhc3Rkb20pO1xuXG4gIGlmIChlcnJvcikge1xuICAgIGRlYnVnKCd0YXNrIGVycm9yZWQnLCBlcnJvci5tZXNzYWdlKTtcbiAgICBpZiAoZmFzdGRvbS5jYXRjaCkgZmFzdGRvbS5jYXRjaChlcnJvcik7XG4gICAgZWxzZSB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG4vKipcbiAqIFdlIHJ1biB0aGlzIGluc2lkZSBhIHRyeSBjYXRjaFxuICogc28gdGhhdCBpZiBhbnkgam9icyBlcnJvciwgd2VcbiAqIGFyZSBhYmxlIHRvIHJlY292ZXIgYW5kIGNvbnRpbnVlXG4gKiB0byBmbHVzaCB0aGUgYmF0Y2ggdW50aWwgaXQncyBlbXB0eS5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBydW5UYXNrcyh0YXNrcykge1xuICBkZWJ1ZygncnVuIHRhc2tzJyk7XG4gIHZhciB0YXNrOyB3aGlsZSAodGFzayA9IHRhc2tzLnNoaWZ0KCkpIHRhc2soKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYW4gaXRlbSBmcm9tIGFuIEFycmF5LlxuICpcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJheVxuICogQHBhcmFtICB7Kn0gaXRlbVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCBpdGVtKSB7XG4gIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG4gIHJldHVybiAhIX5pbmRleCAmJiAhIWFycmF5LnNwbGljZShpbmRleCwgMSk7XG59XG5cbi8qKlxuICogTWl4aW4gb3duIHByb3BlcnRpZXMgb2Ygc291cmNlXG4gKiBvYmplY3QgaW50byB0aGUgdGFyZ2V0LlxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gdGFyZ2V0XG4gKiBAcGFyYW0gIHtPYmplY3R9IHNvdXJjZVxuICovXG5mdW5jdGlvbiBtaXhpbih0YXJnZXQsIHNvdXJjZSkge1xuICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG59XG5cbi8vIFRoZXJlIHNob3VsZCBuZXZlciBiZSBtb3JlIHRoYW5cbi8vIG9uZSBpbnN0YW5jZSBvZiBgRmFzdERvbWAgaW4gYW4gYXBwXG52YXIgZXhwb3J0cyA9IHdpbi5mYXN0ZG9tID0gKHdpbi5mYXN0ZG9tIHx8IG5ldyBGYXN0RG9tKCkpOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuLy8gRXhwb3NlIHRvIENKUyAmIEFNRFxuaWYgKCh0eXBlb2YgZGVmaW5lKSA9PSAnZnVuY3Rpb24nKSBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBleHBvcnRzOyB9KTtcbmVsc2UgaWYgKCh0eXBlb2YgbW9kdWxlKSA9PSAnb2JqZWN0JykgbW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzO1xuXG59KSggdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0aGlzKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUl1TGk5dWIyUmxYMjF2WkhWc1pYTXZabUZ6ZEdSdmJTOW1ZWE4wWkc5dExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHRkZlE9PSIsIklTID0gaW1wb3J0ICcuLi9jaGVja3MnXG5TaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcblxuXG5jbGFzcyBDb25kaXRpb25cblx0Y29uc3RydWN0b3I6IChAZmllbGQsIEBzZXR0aW5ncywgQGNhbGxiYWNrKS0+XG5cdFx0QHNhdGlzZmllZCA9IGZhbHNlXG5cdFx0QHZhbHVlID0gQHNldHRpbmdzLnZhbHVlXG5cdFx0QHByb3BlcnR5ID0gQHNldHRpbmdzLnByb3BlcnR5IG9yICdfdmFsdWUnXG5cdFx0QHByb3BlcnR5ID0gJ192YWx1ZScgaWYgQHNldHRpbmdzLnByb3BlcnR5IGlzICd2YWx1ZSdcblx0XHR0YXJnZXQgPSBAZmllbGQuYWxsRmllbGRzW0BzZXR0aW5ncy50YXJnZXRdIG9yIEBzZXR0aW5ncy50YXJnZXRcdFxuXHRcdFxuXHRcdGlmIElTLmZpZWxkKHRhcmdldClcblx0XHRcdEB0YXJnZXQgPSB0YXJnZXRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gY29uc29sZS53YXJuKFwiY29uZGl0aW9uIHRhcmdldCBub3QgZm91bmQgZm9yIHRoZSBwcm92aWRlZCBJRCAnI3tAc2V0dGluZ3MudGFyZ2V0fSdcIiwgQGZpZWxkKVxuXG5cdFx0cHJvcGVydHkgPSBpZiBJUy5hcnJheShAdGFyZ2V0W0Bwcm9wZXJ0eV0pIHRoZW4gXCJhcnJheToje0Bwcm9wZXJ0eX1cIiBlbHNlIEBwcm9wZXJ0eVxuXG5cdFx0U2ltcGx5QmluZChwcm9wZXJ0eSwgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAdGFyZ2V0KVxuXHRcdFx0LmFuZCgndmlzaWJsZScpLm9mKEB0YXJnZXQuc3RhdGUpXG5cdFx0XHRcdC50byhAY2FsbGJhY2spXG5cblx0XHRTaW1wbHlCaW5kKCdzYXRpc2ZpZWQnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEApXG5cdFx0XHQudG8gKG5ld1ZhbHVlLCBvbGRWYWx1ZSk9PiBAZmllbGQuZW1pdD8oJ2NvbmRpdGlvbkNoYW5nZScsIEApIGlmIG9sZFZhbHVlP1xuXG5cblx0dGVzdDogKCktPlxuXHRcdGlmIG5vdCBAdGFyZ2V0Py5zdGF0ZS52aXNpYmxlXG5cdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdGNvbXBhcmlzb24gPSBzd2l0Y2hcblx0XHRcdHdoZW4gSVMub2JqZWN0UGxhaW4oQHZhbHVlKSB0aGVuIEB2YWx1ZVxuXHRcdFx0d2hlbiBJUy5yZWdleChAdmFsdWUpIHRoZW4gJyRyZWdleCc6QHZhbHVlXG5cdFx0XHR3aGVuIEB2YWx1ZSBpcyAndmFsaWQnIGFuZCBub3QgQHNldHRpbmdzLnByb3BlcnR5IG9yIG5vdCBJUy5kZWZpbmVkKEB2YWx1ZSkgdGhlbiAndmFsaWQnXG5cdFx0XHRlbHNlICckZXEnOkB2YWx1ZVxuXG5cdFx0aWYgY29tcGFyaXNvbiBpcyAndmFsaWQnXG5cdFx0XHRyZXR1cm4gQHRhcmdldC52YWxpZGF0ZSgpXG5cdFx0XG5cdFx0dGFyZ2V0VmFsdWUgPSBkbyAoKT0+XG5cdFx0XHRyZXR1cm4gQHRhcmdldC52YWx1ZSBpZiBAcHJvcGVydHkgaXMgJ192YWx1ZSdcblx0XHRcdHByb3BlcnR5Q2hhaW4gPSBAcHJvcGVydHkuc3BsaXQoJy4nKVxuXHRcdFx0c3dpdGNoXG5cdFx0XHRcdHdoZW4gcHJvcGVydHlDaGFpbi5sZW5ndGggaXMgMVxuXHRcdFx0XHRcdEB0YXJnZXRbQHByb3BlcnR5XVxuXG5cdFx0XHRcdHdoZW4gSVMuZGVmaW5lZChAdGFyZ2V0W0Bwcm9wZXJ0eV0pXG5cdFx0XHRcdFx0QHRhcmdldFtAcHJvcGVydHldXG5cdFx0XHRcdFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bmVzdGVkT2JqZWN0ID0gQHRhcmdldFxuXHRcdFx0XHRcdHdoaWxlIElTLm9iamVjdChuZXN0ZWRPYmplY3QpXG5cdFx0XHRcdFx0XHRuZXN0ZWRPYmplY3QgPSBuZXN0ZWRPYmplY3RbcHJvcGVydHlDaGFpbi5wb3AoKV1cblxuXHRcdFx0XHRcdHJldHVybiBuZXN0ZWRPYmplY3RcblxuXHRcdGNvbXBhcmlzb25PcGVyYXRvcnMgPSBPYmplY3Qua2V5cyhjb21wYXJpc29uKVxuXHRcdHBhc3NlZENvbXBhcmlzb25zID0gY29tcGFyaXNvbk9wZXJhdG9ycy5maWx0ZXIgKG9wZXJhdG9yKS0+XG5cdFx0XHRzZWVrZWRWYWx1ZSA9IGNvbXBhcmlzb25bb3BlcmF0b3JdXG5cdFx0XHRzd2l0Y2ggb3BlcmF0b3Jcblx0XHRcdFx0d2hlbiAnJGVxJ1x0XHR0aGVuIHRhcmdldFZhbHVlIGlzIHNlZWtlZFZhbHVlIFxuXHRcdFx0XHR3aGVuICckbmUnXHRcdHRoZW4gdGFyZ2V0VmFsdWUgaXNudCBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckZ3QnXHRcdHRoZW4gdGFyZ2V0VmFsdWUgPiBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckZ3RlJ1x0XHR0aGVuIHRhcmdldFZhbHVlID49IHNlZWtlZFZhbHVlXG5cdFx0XHRcdHdoZW4gJyRsdCdcdFx0dGhlbiB0YXJnZXRWYWx1ZSA8IHNlZWtlZFZhbHVlXG5cdFx0XHRcdHdoZW4gJyRsdGUnXHRcdHRoZW4gdGFyZ2V0VmFsdWUgPD0gc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGN0J1x0XHR0aGVuIGhlbHBlcnMuaW5jbHVkZXModGFyZ2V0VmFsdWUsIHNlZWtlZFZhbHVlKVxuXHRcdFx0XHR3aGVuICckbmN0J1x0XHR0aGVuIG5vdCBoZWxwZXJzLmluY2x1ZGVzKHRhcmdldFZhbHVlLCBzZWVrZWRWYWx1ZSlcblx0XHRcdFx0d2hlbiAnJHJlZ2V4J1x0dGhlbiBzZWVrZWRWYWx1ZS50ZXN0KHRhcmdldFZhbHVlKVxuXHRcdFx0XHR3aGVuICckbnJlZ2V4J1x0dGhlbiBub3Qgc2Vla2VkVmFsdWUudGVzdCh0YXJnZXRWYWx1ZSlcblx0XHRcdFx0d2hlbiAnJG1hc2snXHR0aGVuIGhlbHBlcnMudGVzdE1hc2sodGFyZ2V0VmFsdWUsIHNlZWtlZFZhbHVlKVxuXHRcdFx0XHRlbHNlIGZhbHNlXG5cblx0XHRyZXR1cm4gcGFzc2VkQ29tcGFyaXNvbnMubGVuZ3RoIGlzIGNvbXBhcmlzb25PcGVyYXRvcnMubGVuZ3RoXG5cblxuXHRAdmFsaWRhdGU6IChjb25kaXRpb25zKS0+IGlmIGNvbmRpdGlvbnNcblx0XHR2YWxpZENvbmRpdGlvbnMgPSBjb25kaXRpb25zLmZpbHRlciAoY29uZGl0aW9uKS0+XG5cdFx0XHRjb25kaXRpb24uc2F0aXNmaWVkID0gY29uZGl0aW9uLnRlc3QoKVxuXHRcdFxuXHRcdHJldHVybiB2YWxpZENvbmRpdGlvbnMubGVuZ3RoIGlzIGNvbmRpdGlvbnMubGVuZ3RoXG5cblxuXHRAaW5pdDogKGZpZWxkLCBjb25kaXRpb25zLCBjYWxsYmFjayktPiBzZXRUaW1lb3V0ICgpPT5cblx0XHRjYWxsYmFjayA/PSAoKT0+IGZpZWxkLnZhbGlkYXRlQ29uZGl0aW9ucygpXG5cdFx0XG5cdFx0ZmllbGQuY29uZGl0aW9ucyA9IGNvbmRpdGlvbnMubWFwIChjb25kaXRpb24pLT5cblx0XHRcdG5ldyBDb25kaXRpb24oZmllbGQsIGNvbmRpdGlvbiwgY2FsbGJhY2spXG5cblx0XHRjYWxsYmFjaygpXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZGl0aW9uIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGZvbnRGYW1pbHk6ICdzeXN0ZW0tdWksIHNhbnMtc2VyaWYnLFxuICB0ZW1wbGF0ZXM6IHt9LFxuICBsYWJlbDogZmFsc2UsXG4gIGVycm9yOiAnJyxcbiAgaGVscDogJycsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gIHdpZHRoOiAnMTAwJScsXG4gIG1vYmlsZVdpZHRoOiBudWxsLFxuICBtb2JpbGVUaHJlc2hvbGQ6IDczNixcbiAgYm9yZGVyOiAxLFxuICBtYXJnaW46IG51bGwsXG4gIHBhZGRpbmc6IG51bGwsXG4gIGRpc3RhbmNlOiBudWxsLFxuICBpbnB1dFBhZGRpbmc6IDEyLFxuICBmb250U2l6ZTogMTQsXG4gIGxhYmVsU2l6ZTogbnVsbCxcbiAgaWNvbjogbnVsbCxcbiAgaWNvblNpemU6IDIyLFxuICBnZXR0ZXI6IG51bGwsXG4gIHNldHRlcjogbnVsbCxcbiAgdmFsaWRhdG9yOiBudWxsLFxuICBjbGVhckVycm9yT25WYWxpZDogdHJ1ZVxufTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSm1hV1ZzWkM5bmJHOWlZV3hFWldaaGRXeDBjeTVqYjJabVpXVWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXMTE5IiwiSVMgPSBpbXBvcnQgJy4uLy4uL2NoZWNrcydcblNpbXBseUJpbmQgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kJ1xuS0VZQ09ERVMgPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9rZXlDb2RlcydcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5Db25kaXRpb24gPSBpbXBvcnQgJy4uL2NvbmRpdGlvbidcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbmdsb2JhbERlZmF1bHRzID0gaW1wb3J0ICcuLi8uLi9maWVsZC9nbG9iYWxEZWZhdWx0cydcbmltcG9ydCAqIGFzIHRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUnXG5pbXBvcnQgKiBhcyBkZWZhdWx0cyBmcm9tICcuL2RlZmF1bHRzJ1xuXG5jbGFzcyBEcm9wZG93blxuXHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0ZGVmYXVsdHM6IGRlZmF1bHRzXG5cdF9zZXR0aW5nRmlsdGVyczogbWF4SGVpZ2h0OiAodmFsdWUpLT4gSVMubnVtYmVyKHZhbHVlKVxuXHRcblx0Y29uc3RydWN0b3I6IChAaW5pdGlhbENob2ljZXMsIEBmaWVsZCktPlxuXHRcdEBpc09wZW4gPSBmYWxzZVxuXHRcdEB0eXBlQnVmZmVyID0gJydcblx0XHRAc2V0dGluZ3MgPSBleHRlbmQuZGVlcC5jbG9uZS5maWx0ZXIoQF9zZXR0aW5nRmlsdGVycykoZ2xvYmFsRGVmYXVsdHMsIEBkZWZhdWx0cywgQGZpZWxkLnNldHRpbmdzLmRyb3Bkb3duKVxuXHRcdEBzZWxlY3RlZCA9IGlmIEBzZXR0aW5ncy5tdWx0aXBsZSB0aGVuIFtdIGVsc2UgbnVsbFxuXHRcdEBsYXN0U2VsZWN0ZWQgPSBudWxsXG5cdFx0QGNob2ljZXMgPSBbXVxuXHRcdEBjdXJyZW50SGlnaGxpZ2h0ZWQgPSBudWxsXG5cdFx0QHZpc2libGVDaG9pY2VzQ291bnQgPSAwXG5cdFx0QHZpc2libGVDaG9pY2VzID0gW11cblx0XHRAZWxzID0ge31cblx0XHRAX3NlbGVjdGVkQ2FsbGJhY2sgPSBoZWxwZXJzLm5vb3Bcblx0XHRcblx0XHRAX2NyZWF0ZUVsZW1lbnRzKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzKClcblx0XHRyZXR1cm4gQFxuXG5cblx0X2NyZWF0ZUVsZW1lbnRzOiAoKS0+XG5cdFx0Z2xvYmFsT3B0cyA9IHtyZWxhdGVkSW5zdGFuY2U6QH1cblx0XHRAZWxzLmNvbnRhaW5lciA9IEB0ZW1wbGF0ZS5kZWZhdWx0LnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuZGVmYXVsdCwgZXh0ZW5kKHtwYXNzU3RhdGVUb0NoaWxkcmVuOmZhbHNlfSwgZ2xvYmFsT3B0cykpXG5cdFx0QGVscy5saXN0ID0gQHRlbXBsYXRlLmxpc3Quc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5saXN0LCBnbG9iYWxPcHRzKS5hcHBlbmRUbyhAZWxzLmNvbnRhaW5lcilcblx0XHRAZWxzLmhlbHAgPSBAdGVtcGxhdGUuaGVscC5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmhlbHAsIGdsb2JhbE9wdHMpLmFwcGVuZFRvKEBlbHMuY29udGFpbmVyKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAgPSBAdGVtcGxhdGUuc2Nyb2xsSW5kaWNhdG9yVXAuc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5zY3JvbGxJbmRpY2F0b3JVcCwgZ2xvYmFsT3B0cykuYXBwZW5kVG8oQGVscy5jb250YWluZXIpXG5cdFx0QGVscy5zY3JvbGxJbmRpY2F0b3JEb3duID0gQHRlbXBsYXRlLnNjcm9sbEluZGljYXRvckRvd24uc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5zY3JvbGxJbmRpY2F0b3JEb3duLCBnbG9iYWxPcHRzKS5hcHBlbmRUbyhAZWxzLmNvbnRhaW5lcilcblxuXHRcdEBsaXN0ID0gbmV3IExpc3QoQClcblx0XHRAYWRkQ2hvaWNlKGNob2ljZSkgZm9yIGNob2ljZSBpbiBAaW5pdGlhbENob2ljZXNcblx0XHRyZXR1cm5cblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzOiAoKS0+XG5cdFx0QF9hdHRhY2hCaW5kaW5nc19lbFN0YXRlKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXkoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3Nfc2Nyb2xsSW5kaWNhdG9ycygpXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfZWxTdGF0ZTogKCktPlxuXHRcdFNpbXBseUJpbmQoJ2hlbHAnKS5vZihAc2V0dGluZ3MpXG5cdFx0XHQudG8oJ3RleHQnKS5vZihAZWxzLmhlbHApXG5cdFx0XHQuYW5kLnRvIChzaG93SGVscCk9PiBAZWxzLmhlbHAuc3RhdGUgJ3Nob3dIZWxwJywgc2hvd0hlbHBcblxuXHRcdFNpbXBseUJpbmQoJ3Zpc2libGVDaG9pY2VzQ291bnQnKS5vZihAKVxuXHRcdFx0LnRvIChjb3VudCk9PiBAZWxzLmNvbnRhaW5lci5zdGF0ZSAnaGFzVmlzaWJsZUNob2ljZXMnLCAhIWNvdW50XG5cdFxuXHRcdFNpbXBseUJpbmQoJ2N1cnJlbnRIaWdobGlnaHRlZCcpLm9mKEApXG5cdFx0XHQudG8gKGN1cnJlbnQsIHByZXYpPT5cblx0XHRcdFx0cHJldi5lbC5zdGF0ZSgnaG92ZXInLCBvZmYpIGlmIHByZXZcblx0XHRcdFx0Y3VycmVudC5lbC5zdGF0ZSgnaG92ZXInLCBvbikgaWYgY3VycmVudFxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXk6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdpc09wZW4nLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEApLnRvIChpc09wZW4pPT5cblx0XHRcdEBlbHMuY29udGFpbmVyLnN0YXRlICdpc09wZW4nLCBpc09wZW5cdFx0XG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gbnVsbCBpZiBub3QgaXNPcGVuXG5cdFxuXHRcdFx0aWYgQHNldHRpbmdzLmxvY2tTY3JvbGxcblx0XHRcdFx0aWYgaXNPcGVuXG5cdFx0XHRcdFx0aGVscGVycy5sb2NrU2Nyb2xsKEBlbHMubGlzdClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGhlbHBlcnMudW5sb2NrU2Nyb2xsKClcblxuXHRcdFx0aWYgaXNPcGVuXG5cdFx0XHRcdEBsaXN0LmNhbGNEaXNwbGF5KClcblx0XHRcdFx0QGxpc3Quc2Nyb2xsVG9DaG9pY2UoQHNlbGVjdGVkKSBpZiBAc2VsZWN0ZWQgYW5kIG5vdCBAc2V0dGluZ3MubXVsdGlwbGVcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGxpc3Quc2V0VHJhbnNsYXRlKDApXG5cblxuXHRcdFNpbXBseUJpbmQoJ2xhc3RTZWxlY3RlZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSwgdXBkYXRlRXZlbklmU2FtZTp0cnVlKS5vZihAKVxuXHRcdFx0LnRvIChuZXdDaG9pY2UsIHByZXZDaG9pY2UpPT4gQF9zZWxlY3RlZENhbGxiYWNrKG5ld0Nob2ljZSwgcHJldkNob2ljZSlcblxuXG5cdFx0U2ltcGx5QmluZCgnZm9jdXNlZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQGZpZWxkLnN0YXRlKS50byAoZm9jdXNlZCk9PlxuXHRcdFx0aWYgbm90IGZvY3VzZWRcblx0XHRcdFx0QGZpZWxkLmVsLmNoaWxkLmlucHV0Lm9mZiAna2V5ZG93bi5kcm9wZG93bk5hdidcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGZpZWxkLmVsLmNoaWxkLmlucHV0Lm9uICdrZXlkb3duLmRyb3Bkb3duTmF2JywgKGV2ZW50KT0+IGlmIEBpc09wZW4gdGhlbiBzd2l0Y2ggZXZlbnQua2V5Q29kZVxuXHRcdFx0XHRcdHdoZW4gS0VZQ09ERVMudXBcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdEBoaWdobGlnaHRQcmV2KClcblxuXHRcdFx0XHRcdHdoZW4gS0VZQ09ERVMuZG93blxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0QGhpZ2hsaWdodE5leHQoKVxuXG5cdFx0XHRcdFx0d2hlbiBLRVlDT0RFUy5lbnRlclxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0QGxhc3RTZWxlY3RlZCA9IEBjdXJyZW50SGlnaGxpZ2h0ZWQgaWYgQGN1cnJlbnRIaWdobGlnaHRlZFxuXG5cdFx0XHRcdFx0d2hlbiBLRVlDT0RFUy5lc2Ncblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdEBpc09wZW4gPSBmYWxzZVxuXG5cdFx0XG5cdFx0cmV0dXJuIGlmIG5vdCBAc2V0dGluZ3MudHlwZUJ1ZmZlclxuXHRcdFNpbXBseUJpbmQoJ2ZvY3VzZWQnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEBmaWVsZC5zdGF0ZSkudG8gKGZvY3VzZWQpPT5cblx0XHRcdGlmIG5vdCBmb2N1c2VkXG5cdFx0XHRcdERPTShkb2N1bWVudCkub2ZmICdrZXlwcmVzcy5kcm9wZG93blR5cGVCdWZmZXInXG5cdFx0XHRlbHNlXG5cdFx0XHRcdERPTShkb2N1bWVudCkub24gJ2tleXByZXNzLmRyb3Bkb3duVHlwZUJ1ZmZlcicsIChldmVudCk9PiBpZiBAaXNPcGVuXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdHJldHVybiBpZiBub3QgS0VZQ09ERVMuYW55UHJpbnRhYmxlKGV2ZW50LmtleUNvZGUpXG5cdFx0XHRcdFx0QHR5cGVCdWZmZXIgKz0gZXZlbnQua2V5XG5cblxuXHRcdFNpbXBseUJpbmQoJ3R5cGVCdWZmZXInLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEApXG5cdFx0XHQudG8gKCk9PlxuXHRcdFx0XHRjbGVhclRpbWVvdXQoQHR5cGVCdWZmZXJUaW1lb3V0KVxuXHRcdFx0XHRAdHlwZUJ1ZmZlclRpbWVvdXQgPSBzZXRUaW1lb3V0ICgpPT5cblx0XHRcdFx0XHRAdHlwZUJ1ZmZlciA9ICcnXG5cdFx0XHRcdCwxNTAwXG5cdFx0XHRcblx0XHRcdC5hbmQudG8gKGJ1ZmZlcik9PiBpZiBidWZmZXJcblx0XHRcdFx0Zm9yIGNob2ljZSBpbiBAdmlzaWJsZUNob2ljZXNcblx0XHRcdFx0XHRpZiBoZWxwZXJzLnN0YXJ0c1dpdGgoYnVmZmVyLCBjaG9pY2UubGFiZWwpXG5cdFx0XHRcdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlXG5cdFx0XHRcdFx0XHRAbGlzdC5zY3JvbGxUb0Nob2ljZShjaG9pY2UpIHVubGVzcyBAbGlzdC5jaG9pY2VJblZpZXcoY2hvaWNlKVxuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX3Njcm9sbEluZGljYXRvcnM6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdzY3JvbGxUb3AnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUpLm9mKEBlbHMubGlzdC5yYXcpXG5cdFx0XHQudG8gKHNjcm9sbFRvcCk9PlxuXHRcdFx0XHRzaG93VG9wSW5kaWNhdG9yID0gc2Nyb2xsVG9wID4gMFxuXHRcdFx0XHRzaG93Qm90dG9tSW5kaWNhdG9yID0gQGVscy5saXN0LnJhdy5zY3JvbGxIZWlnaHQgLSBAZWxzLmxpc3QucmF3LmNsaWVudEhlaWdodCA+IHNjcm9sbFRvcFxuXG5cdFx0XHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAuc3RhdGUgJ3Zpc2libGUnLCBzaG93VG9wSW5kaWNhdG9yXG5cdFx0XHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5zdGF0ZSAndmlzaWJsZScsIHNob3dCb3R0b21JbmRpY2F0b3JcblxuXHRcdFx0LmNvbmRpdGlvbiAoKT0+IEBpc09wZW4gYW5kIG5vdCBAc2V0dGluZ3MuaGVscCBhbmQgQGVscy5saXN0LnJhdy5zY3JvbGxIZWlnaHQgaXNudCBAZWxzLmxpc3QucmF3LmNsaWVudEhlaWdodCBhbmQgQGVscy5saXN0LnJhdy5jbGllbnRIZWlnaHQgPj0gMTAwXG5cdFx0XHQudXBkYXRlT24oJ2V2ZW50OnNjcm9sbCcpLm9mKEBlbHMubGlzdC5yYXcpXG5cdFx0XHQudXBkYXRlT24oJ2lzT3BlbicpLm9mKEApXG5cblx0XHRAZWxzLnNjcm9sbEluZGljYXRvclVwLm9uICdtb3VzZWVudGVyJywgKCk9PiBAbGlzdC5zdGFydFNjcm9sbGluZygndXAnKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAub24gJ21vdXNlbGVhdmUnLCAoKT0+IEBsaXN0LnN0b3BTY3JvbGxpbmcoKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5vbiAnbW91c2VlbnRlcicsICgpPT4gQGxpc3Quc3RhcnRTY3JvbGxpbmcoJ2Rvd24nKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5vbiAnbW91c2VsZWF2ZScsICgpPT4gQGxpc3Quc3RvcFNjcm9sbGluZygpXG5cblxuXHRhZGRDaG9pY2U6IChjb25maWcpLT5cblx0XHRpZiBJUy5hcnJheShjb25maWcpXG5cdFx0XHRAYWRkQ2hvaWNlKGl0ZW0pIGZvciBpdGVtIGluIGNvbmZpZ1xuXHRcdFx0cmV0dXJuXG5cdFx0XG5cdFx0ZWxzZSBpZiBJUy5zdHJpbmcoY29uZmlnKVxuXHRcdFx0Y29uZmlnID0ge2xhYmVsOmNvbmZpZywgdmFsdWU6Y29uZmlnfVxuXHRcdFxuXHRcdGVsc2UgaWYgSVMub2JqZWN0UGxhaW4oY29uZmlnKVxuXHRcdFx0Y29uZmlnLnZhbHVlID89IGNvbmZpZy5sYWJlbFxuXHRcdFx0Y29uZmlnLmxhYmVsID89IGNvbmZpZy52YWx1ZVxuXG5cdFx0ZWxzZSByZXR1cm5cblxuXHRcdG5ld0Nob2ljZSA9IG5ldyBDaG9pY2UoQCwgY29uZmlnLCBAbGlzdCwgQGNob2ljZXMubGVuZ3RoKVxuXHRcdEBjaG9pY2VzLnB1c2gobmV3Q2hvaWNlKVxuXHRcdHJldHVybiBuZXdDaG9pY2VcblxuXG5cdGFwcGVuZFRvOiAodGFyZ2V0KS0+XG5cdFx0QGVscy5jb250YWluZXIuYXBwZW5kVG8odGFyZ2V0KVxuXG5cblx0b25TZWxlY3RlZDogKGNhbGxiYWNrKS0+XG5cdFx0QF9zZWxlY3RlZENhbGxiYWNrID0gY2FsbGJhY2tcblxuXG5cdGZpbmRDaG9pY2U6IChwcm92aWRlZFZhbHVlLCBieUxhYmVsKS0+XG5cdFx0bWF0Y2hlcyA9IEBjaG9pY2VzLmZpbHRlciAoY2hvaWNlKS0+IHN3aXRjaFxuXHRcdFx0d2hlbiBJUy5vYmplY3QocHJvdmlkZWRWYWx1ZSkgdGhlbiBwcm92aWRlZFZhbHVlIGlzIGNob2ljZVxuXHRcdFx0d2hlbiBieUxhYmVsIHRoZW4gcHJvdmlkZWRWYWx1ZSBpcyBjaG9pY2UubGFiZWxcblx0XHRcdGVsc2UgcHJvdmlkZWRWYWx1ZSBpcyBjaG9pY2UudmFsdWVcblxuXHRcdHJldHVybiBtYXRjaGVzWzBdXG5cblxuXHRmaW5kQ2hvaWNlQW55OiAocHJvdmlkZWRWYWx1ZSktPlxuXHRcdEBmaW5kQ2hvaWNlKHByb3ZpZGVkVmFsdWUpIG9yIEBmaW5kQ2hvaWNlKHByb3ZpZGVkVmFsdWUsIHRydWUpXG5cblxuXHRoaWdobGlnaHRQcmV2OiAoKS0+XG5cdFx0Y3VycmVudEluZGV4ID0gQHZpc2libGVDaG9pY2VzLmluZGV4T2YoQGN1cnJlbnRIaWdobGlnaHRlZClcblx0XHRcblx0XHRpZiBjdXJyZW50SW5kZXggPiAwXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzW2N1cnJlbnRJbmRleC0xXVxuXHRcdFx0QGxpc3Quc2Nyb2xsVXAoY2hvaWNlKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblx0XHRlbHNlXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzW0B2aXNpYmxlQ2hvaWNlcy5sZW5ndGgtMV1cblx0XHRcdEBsaXN0LnNjcm9sbFRvQ2hvaWNlKGNob2ljZSwxKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblxuXG5cblx0aGlnaGxpZ2h0TmV4dDogKCktPlxuXHRcdGN1cnJlbnRJbmRleCA9IEB2aXNpYmxlQ2hvaWNlcy5pbmRleE9mKEBjdXJyZW50SGlnaGxpZ2h0ZWQpXG5cdFx0XG5cdFx0aWYgY3VycmVudEluZGV4IDwgQHZpc2libGVDaG9pY2VzLmxlbmd0aC0xXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzW2N1cnJlbnRJbmRleCsxXVxuXHRcdFx0QGxpc3Quc2Nyb2xsRG93bihjaG9pY2UpIHVubGVzcyBAbGlzdC5jaG9pY2VJblZpZXcoY2hvaWNlKVxuXHRcdGVsc2Vcblx0XHRcdEBjdXJyZW50SGlnaGxpZ2h0ZWQgPSBjaG9pY2UgPSBAdmlzaWJsZUNob2ljZXNbMF1cblx0XHRcdEBsaXN0LnNjcm9sbFRvQ2hvaWNlKGNob2ljZSwxKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblxuXG5cblxuXG5cblxuY2xhc3MgTGlzdFxuXHRjb25zdHJ1Y3RvcjogKEBkcm9wZG93biktPlxuXHRcdHtAZWxzLCBAZmllbGQsIEBzZXR0aW5nc30gPSBAZHJvcGRvd25cblx0XHRAZWwgPSBAZWxzLmxpc3Rcblx0XHRAY29udGFpbmVyID0gQGVscy5jb250YWluZXJcblxuXHRjYWxjRGlzcGxheTogKCktPlxuXHRcdHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuXHRcdHRyYW5zbGF0aW9uID0gQHRyYW5zbGF0aW9uIG9yIDBcblx0XHRjbGlwcGluZ1BhcmVudCA9IEBjb250YWluZXIucGFyZW50TWF0Y2hpbmcgKHBhcmVudCktPiBvdmVyZmxvdz1wYXJlbnQuc3R5bGUoJ292ZXJmbG93WScpOyBvdmVyZmxvdyBpcyAnaGlkZGVuJyBvciBvdmVyZmxvdyBpcyAnc2Nyb2xsJ1xuXHRcdHNjcm9sbEhlaWdodCA9IEBlbC5yYXcuc2Nyb2xsSGVpZ2h0IG9yIEluZmluaXR5XG5cdFx0c2VsZlJlY3QgPSBleHRlbmQuY2xvbmUgQGNvbnRhaW5lci5yZWN0XG5cdFx0cGFkZGluZyA9IHNlbGZSZWN0LmhlaWdodCAtIEBlbC5oZWlnaHRcblx0XHRoZWlnaHQgPSBNYXRoLm1pbiBzY3JvbGxIZWlnaHQsIEBzZXR0aW5ncy5tYXhIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodC00MFxuXHRcdHNlbGZSZWN0LmJvdHRvbSA9IHNlbGZSZWN0LnRvcCArIGhlaWdodFxuXG5cdFx0aWYgY2xpcHBpbmdQYXJlbnRcblx0XHRcdGNsaXBwaW5nUmVjdCA9IGNsaXBwaW5nUGFyZW50LnJlY3Rcblx0XHRcdGJvdHRvbUN1dG9mZiA9IHNlbGZSZWN0LmJvdHRvbSAtIGNsaXBwaW5nUmVjdC5ib3R0b21cblx0XHRcdHRvcEN1dG9mZiA9IGNsaXBwaW5nUmVjdC50b3AgLSBzZWxmUmVjdC50b3Bcblx0XHRcdGlzQm90dG9tQ3V0b2ZmID0gYm90dG9tQ3V0b2ZmID4gMFxuXHRcdFx0aXNUb3BDdXRvZmYgPSB0b3BDdXRvZmYgPiAwXG5cblx0XHRcdGlmIHNlbGZSZWN0LnRvcCA+PSBjbGlwcGluZ1JlY3QuYm90dG9tIG9yIGNsaXBwaW5nUmVjdC50b3AgPj0gc2VsZlJlY3QuYm90dG9tXG5cdFx0XHRcdGNvbnNvbGUud2FybihcIlRoZSBkcm9wZG93biBmb3IgZWxlbWVudCAnI3tAZmllbGQuSUR9JyBjYW5ub3QgYmUgZGlzcGxheWVkIGFzIGl0J3MgaGlkZGVuIGJ5IHRoZSBwYXJlbnQgb3ZlcmZsb3dcIilcblx0XHRcdFxuXHRcdFx0ZWxzZSBpZiBpc0JvdHRvbUN1dG9mZiBvciBpc1RvcEN1dG9mZlxuXHRcdFx0XHRuZWVkc05ld0hlaWdodCA9IHRydWVcblx0XHRcdFx0XG5cdFx0XHRcdGlmIHNlbGZSZWN0LnRvcCAtIGJvdHRvbUN1dG9mZiA+IGNsaXBwaW5nUmVjdC50b3AgYW5kIG5vdCBpc1RvcEN1dG9mZlxuXHRcdFx0XHRcdHRyYW5zbGF0aW9uID0gYm90dG9tQ3V0b2ZmXG5cdFx0XHRcdFx0c2VsZlJlY3QudG9wIC09IHRyYW5zbGF0aW9uXG5cdFx0XHRcdFx0c2VsZlJlY3QuYm90dG9tIC09IHRyYW5zbGF0aW9uXG5cdFx0XHRcdFx0Y3V0b2ZmID0gY2xpcHBpbmdSZWN0LnRvcCAtIHNlbGZSZWN0LnRvcFxuXG5cdFx0XHRcdGVsc2UgaWYgc2VsZlJlY3QuYm90dG9tIC0gdG9wQ3V0b2ZmIDwgY2xpcHBpbmdSZWN0LmJvdHRvbVxuXHRcdFx0XHRcdHRyYW5zbGF0aW9uID0gdG9wQ3V0b2ZmICogLTFcblx0XHRcdFx0XHRzZWxmUmVjdC50b3AgKz0gdHJhbnNsYXRpb25cblx0XHRcdFx0XHRzZWxmUmVjdC5ib3R0b20gKz0gdHJhbnNsYXRpb25cblx0XHRcdFx0XHRjdXRvZmYgPSBzZWxmUmVjdC5ib3R0b20gLSBjbGlwcGluZ1JlY3QuYm90dG9tXG5cblxuXHRcdFx0XHRpZiBuZWVkc05ld0hlaWdodCA9IGN1dG9mZiA+IDBcblx0XHRcdFx0XHRoZWlnaHQgPSBjdXRvZmYgLSBwYWRkaW5nXG5cblx0XHRcblx0XHR3aW5kb3dDdXRvZmYgPSAoc2VsZlJlY3QudG9wICsgaGVpZ2h0KSAtIHdpbmRvd0hlaWdodFxuXHRcdFxuXHRcdGlmIHdpbmRvd0N1dG9mZiA+IDAgYW5kIGhlaWdodCA8IHdpbmRvd0hlaWdodFxuXHRcdFx0dHJhbnNsYXRpb24gKz0gd2luZG93Q3V0b2ZmKzEwXG5cblx0XHRAc2V0RGltZW5zaW9ucyhoZWlnaHQsIEBmaWVsZC5lbC5jaGlsZC5pbm5lcndyYXAud2lkdGgrMTApXG5cdFx0QHNldFRyYW5zbGF0ZSh0cmFuc2xhdGlvbilcblxuXG5cdHNldERpbWVuc2lvbnM6IChoZWlnaHQsIHdpZHRoKS0+XG5cdFx0QGVsLnN0eWxlICdtYXhIZWlnaHQnLCBoZWlnaHQgaWYgaGVpZ2h0P1xuXHRcdEBlbC5zdHlsZSAnbWluV2lkdGgnLCB3aWR0aCBpZiB3aWR0aD9cblxuXHRcblx0c2V0VHJhbnNsYXRlOiAodHJhbnNsYXRpb24pLT5cblx0XHRAdHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvblxuXHRcdHRyYW5zbGF0aW9uICo9IC0xXG5cdFx0QGNvbnRhaW5lci5zdHlsZSAndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGVZKCN7dHJhbnNsYXRpb259cHgpXCJcblxuXG5cdHNjcm9sbFRvQ2hvaWNlOiAoY2hvaWNlLG9mZnNldD0zKS0+XG5cdFx0ZGlzdGFuZUZyb21Ub3AgPSBjaG9pY2UuZWwucmF3Lm9mZnNldFRvcFxuXHRcdHNlbGVjdGVkSGVpZ2h0ID0gY2hvaWNlLmVsLmhlaWdodFxuXHRcdFxuXHRcdEBlbC5yYXcuc2Nyb2xsVG9wID0gZGlzdGFuZUZyb21Ub3AgLSBzZWxlY3RlZEhlaWdodCpvZmZzZXRcblxuXHRzY3JvbGxEb3duOiAoY2hvaWNlKS0+XG5cdFx0QGVsLnJhdy5zY3JvbGxUb3AgKz0gY2hvaWNlLmVsLmhlaWdodFxuXG5cdHNjcm9sbFVwOiAoY2hvaWNlKS0+XG5cdFx0QGVsLnJhdy5zY3JvbGxUb3AgLT0gY2hvaWNlLmVsLmhlaWdodFxuXG5cdGNob2ljZUluVmlldzogKGNob2ljZSk9PlxuXHRcdGNob2ljZVJlY3QgPSBjaG9pY2UuZWwucmVjdFxuXHRcdGxpc3RSZWN0ID0gQGVsLnJlY3Rcblx0XHR1cFBhZGRpbmcgPSBpZiBAZWxzLnNjcm9sbEluZGljYXRvclVwLnN0YXRlKCd2aXNpYmxlJykgdGhlbiBwYXJzZUZsb2F0IEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAuc3R5bGVTYWZlKCdoZWlnaHQnLHRydWUpXG5cdFx0ZG93blBhZGRpbmcgPSBpZiBAZWxzLnNjcm9sbEluZGljYXRvckRvd24uc3RhdGUoJ3Zpc2libGUnKSB0aGVuIHBhcnNlRmxvYXQgQGVscy5zY3JvbGxJbmRpY2F0b3JEb3duLnN0eWxlU2FmZSgnaGVpZ2h0Jyx0cnVlKVxuXG5cdFx0Y2hvaWNlUmVjdC5ib3R0b20gPD0gbGlzdFJlY3QuYm90dG9tLWRvd25QYWRkaW5nIGFuZFxuXHRcdGNob2ljZVJlY3QudG9wID49IGxpc3RSZWN0LnRvcCt1cFBhZGRpbmdcblxuXG5cdHN0YXJ0U2Nyb2xsaW5nOiAoZGlyZWN0aW9uKS0+XG5cdFx0QHNjcm9sbEludGVydmFsSUQgPSBzZXRJbnRlcnZhbCAoKT0+XG5cdFx0XHRAZWwucmF3LnNjcm9sbFRvcCArPSBpZiBkaXJlY3Rpb24gaXMgJ3VwJyB0aGVuIC0yMCBlbHNlIDIwXG5cdFx0LCA1MFxuXG5cblx0c3RvcFNjcm9sbGluZzogKCktPlxuXHRcdGNsZWFySW50ZXJ2YWwoQHNjcm9sbEludGVydmFsSUQpXG5cblxuXG5cblxuY2xhc3MgQ2hvaWNlXG5cdGNvbnN0cnVjdG9yOiAoQGRyb3Bkb3duLCBAc2V0dGluZ3MsIEBsaXN0LCBAaW5kZXgpLT5cblx0XHR7QGxhYmVsLCBAdmFsdWUsIEBjb25kaXRpb25zfSA9IEBzZXR0aW5nc1xuXHRcdEBsYWJlbCA/PSBAdmFsdWVcblx0XHRAdmFsdWUgPz0gQGxhYmVsXG5cdFx0QGZpZWxkID0gQGRyb3Bkb3duLmZpZWxkXG5cdFx0QGVsID0gQGRyb3Bkb3duLnRlbXBsYXRlLmNob2ljZS5zcGF3bihudWxsLCB7cmVsYXRlZEluc3RhbmNlOkBkcm9wZG93bn0pLmFwcGVuZFRvKEBsaXN0LmVsKVxuXHRcdEBlbC5jaGlsZHJlblsxXS50ZXh0ID0gQGxhYmVsXG5cdFx0QHZpc2libGUgPSB0cnVlXG5cdFx0QHNlbGVjdGVkID0gZmFsc2Vcblx0XHRAdW5hdmFpbGFibGUgPSBmYWxzZVxuXHRcdFxuXHRcdEBfYXR0YWNoQmluZGluZ3MoKVxuXG5cdFx0aWYgQGNvbmRpdGlvbnM/Lmxlbmd0aFxuXHRcdFx0QHVuYXZhaWxhYmxlID0gdHJ1ZVxuXHRcdFx0QGFsbEZpZWxkcyA9IEBmaWVsZC5hbGxGaWVsZHNcblxuXHRcdFx0Q29uZGl0aW9uLmluaXQgQCwgQGNvbmRpdGlvbnMsICgpPT5cblx0XHRcdFx0QHVuYXZhaWxhYmxlID0gIUNvbmRpdGlvbi52YWxpZGF0ZShAY29uZGl0aW9ucylcblxuXG5cdF9hdHRhY2hCaW5kaW5nczogKCktPiBkbyAoKT0+XG5cdFx0U2ltcGx5QmluZCgndmlzaWJsZScpLm9mKEApLnRvICh2aXNpYmxlLHByZXYpPT5cblx0XHRcdEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlc0NvdW50ICs9IGlmIHZpc2libGUgdGhlbiAxIGVsc2UgLTFcblx0XHRcdEBlbC5zdGF0ZSAndmlzaWJsZScsIHZpc2libGVcblx0XHRcdGlmIHZpc2libGVcblx0XHRcdFx0QGRyb3Bkb3duLnZpc2libGVDaG9pY2VzLnB1c2goQClcblx0XHRcdFx0aWYgSVMuZGVmaW5lZChwcmV2KSAjIGluZGljYXRlcyBzdGF0ZSBoYXMgY2hhbmdlZFxuXHRcdFx0XHRcdEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlcy5zb3J0IChhLGIpLT4gYS5pbmRleCAtIGIuaW5kZXhcblx0XHRcdGVsc2Vcblx0XHRcdFx0aGVscGVycy5yZW1vdmVJdGVtKEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlcywgQClcblxuXHRcdFNpbXBseUJpbmQoJ3NlbGVjdGVkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0LnRvIChzZWxlY3RlZCk9PiBAZWwuc3RhdGUgJ3NlbGVjdGVkJywgc2VsZWN0ZWRcblx0XHRcblx0XHRTaW1wbHlCaW5kKCd1bmF2YWlsYWJsZScsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQClcblx0XHRcdC50byAodW5hdmFpbGFibGUpPT4gQGVsLnN0YXRlICd1bmF2YWlsYWJsZScsIHVuYXZhaWxhYmxlXHRcdFx0XG5cdFx0XHQuYW5kLnRvICh1bmF2YWlsYWJsZSk9PiBAdG9nZ2xlKG9mZiwgdHJ1ZSkgaWYgdW5hdmFpbGFibGVcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmNsaWNrJykub2YoQGVsKVxuXHRcdFx0LnRvICgpPT4gQGRyb3Bkb3duLmxhc3RTZWxlY3RlZCA9IEBcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDptb3VzZWRvd24nKS5vZihAZWwpXG5cdFx0XHQudG8gKGV2ZW50KT0+IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6bW91c2VlbnRlcicpLm9mKEBlbClcblx0XHRcdC50byAoKT0+IEBkcm9wZG93bi5jdXJyZW50SGlnaGxpZ2h0ZWQgPSBAXG5cblxuXHR0b2dnbGU6IChuZXdWYWx1ZSwgdW5hdmFpbGFibGUpLT5cblx0XHRwcmV2U3RhdGUgPSBAc2VsZWN0ZWRcblx0XHRuZXdTdGF0ZSA9IGlmIElTLmRlZmluZWQobmV3VmFsdWUpIHRoZW4gbmV3VmFsdWUgZWxzZSAhQHNlbGVjdGVkXG5cblx0XHRpZiBub3QgbmV3U3RhdGVcblx0XHRcdGlmIEBkcm9wZG93bi5zZXR0aW5ncy5tdWx0aXBsZSBhbmQgcHJldlN0YXRlXG5cdFx0XHRcdEBzZWxlY3RlZCA9IG5ld1N0YXRlXG5cdFx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAZmllbGQuX3ZhbHVlLCBAKVxuXHRcdFx0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBzZWxlY3RlZCA9IG5ld1N0YXRlIGlmIElTLmRlZmluZWQobmV3VmFsdWUpXG5cdFx0XHRcdEBmaWVsZC5fdmFsdWUgPSBudWxsIGlmIHVuYXZhaWxhYmxlXG5cblx0XHRlbHNlXG5cdFx0XHRAc2VsZWN0ZWQgPSBuZXdTdGF0ZVxuXHRcdFx0aWYgQGZpZWxkLnNldHRpbmdzLm11bHRpcGxlXG5cdFx0XHRcdEBmaWVsZC5fdmFsdWUucHVzaChAKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlPy50b2dnbGUob2ZmKVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlID0gQFxuXG5cdFx0XHRAZmllbGQubGFzdFNlbGVjdGVkID0gQFxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IERyb3Bkb3duXG5tb2R1bGUuZXhwb3J0cy5DaG9pY2UgPSBDaG9pY2UiLCJTaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcbm1hc2tDb3JlID0gaW1wb3J0ICd0ZXh0LW1hc2stY29yZSdcbm1hc2tBZGRvbnMgPSBpbXBvcnQgJ3RleHQtbWFzay1hZGRvbnMnXG5leHRlbmQgPSBpbXBvcnQgJ3NtYXJ0LWV4dGVuZCdcbklTID0gaW1wb3J0ICcuLi9jaGVja3MnXG5SRUdFWCA9IGltcG9ydCAnLi4vY29uc3RhbnRzL3JlZ2V4J1xuaGVscGVycyA9IGltcG9ydCAnLi4vaGVscGVycydcbmRlZmF1bHRQYXR0ZXJuQ2hhcnMgPSBcblx0JzEnOiBSRUdFWC5udW1lcmljXG5cdCcjJzogUkVHRVgud2lkZW51bWVyaWNcblx0J2EnOiBSRUdFWC5sZXR0ZXJcblx0JyonOiBSRUdFWC5hbnlcblxuXG5jbGFzcyBNYXNrXG5cdGNvbnN0cnVjdG9yOiAoQGZpZWxkLCBAY29uZmlnKS0+XG5cdFx0QHZhbHVlID0gJydcblx0XHRAcHJldlZhbHVlID0gJydcblx0XHRAY3Vyc29yID0gMFxuXHRcdEBwcmV2Q3Vyc29yID0gMFxuXHRcdEBwYXR0ZXJuID0gQHBhdHRlcm5SYXcgPSBAY29uZmlnLnBhdHRlcm5cblx0XHRAcGF0dGVyblNldHRlciA9IEBjb25maWcuc2V0dGVyXG5cdFx0QHBsYWNlaG9sZGVyQ2hhciA9IEBjb25maWcucGxhY2Vob2xkZXJcblx0XHRAcGxhY2Vob2xkZXJSZWdleCA9IG5ldyBSZWdFeHAoJ1xcXFwnKyhAcGxhY2Vob2xkZXJDaGFyIG9yICdfJyksJ2cnKVxuXHRcdEBndWlkZSA9IEBjb25maWcuZ3VpZGVcblx0XHRAa2VlcENoYXJQb3NpdGlvbnMgPSBAY29uZmlnLmtlZXBDaGFyUG9zaXRpb25zXG5cdFx0QGNoYXJzID0gZXh0ZW5kLmNsb25lIGRlZmF1bHRQYXR0ZXJuQ2hhcnMsIEBjb25maWcuY3VzdG9tUGF0dGVybnNcblxuXHRcdEBzZXRQYXR0ZXJuKEBwYXR0ZXJuKVxuXG5cblx0Z2V0U3RhdGU6IChwYXR0ZXJuLCByYXdWYWx1ZSktPiB7XG5cdFx0cmF3VmFsdWUsIEBndWlkZSwgQHBsYWNlaG9sZGVyQ2hhciwgQGtlZXBDaGFyUG9zaXRpb25zLFxuXHRcdGN1cnJlbnRDYXJldFBvc2l0aW9uOiBpZiBAZmllbGQuZWwgdGhlbiBAZmllbGQuc2VsZWN0aW9uKCkuZW5kIGVsc2UgQGN1cnNvclxuXHRcdHByZXZpb3VzQ29uZm9ybWVkVmFsdWU6IEBwcmV2VmFsdWVcblx0XHRwbGFjZWhvbGRlcjogQGdldFBsYWNlaG9sZGVyKHBhdHRlcm4pXG5cdH1cblxuXHRnZXRQbGFjZWhvbGRlcjogKHBhdHRlcm4pLT5cblx0XHRpZiBJUy5mdW5jdGlvbihwYXR0ZXJuKVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cGxhY2Vob2xkZXIgPSAnJ1xuXHRcdFx0Zm9yIGNoYXIgaW4gcGF0dGVyblxuXHRcdFx0XHRpZiBJUy5yZWdleChjaGFyKVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyICs9IEBwbGFjZWhvbGRlckNoYXJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyICs9IGNoYXJcblxuXHRcdFx0cmV0dXJuIHBsYWNlaG9sZGVyXG5cblxuXHRyZXNvbHZlUGF0dGVybjogKHBhdHRlcm4sIGlucHV0LCBzdGF0ZSktPlxuXHRcdHBhdHRlcm4gPSBcblx0XHRcdGlmIHR5cGVvZiBwYXR0ZXJuIGlzICdmdW5jdGlvbidcblx0XHRcdFx0cGF0dGVybihpbnB1dCwgQGdldFN0YXRlKHBhdHRlcm4sIGlucHV0KSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0cGF0dGVyblxuXG5cdFx0b2Zmc2V0ID0gMFxuXHRcdHRyYXBJbmRleGVzID0gW11cblx0XHRjb3B5ID0gcGF0dGVybi5zbGljZSgpXG5cdFx0Zm9yIGNoYXIsaSBpbiBjb3B5IHdoZW4gY2hhciBpcyAnW10nXG5cdFx0XHR0cmFwSW5kZXhlcy5wdXNoKGktb2Zmc2V0KVxuXHRcdFx0cGF0dGVybi5zcGxpY2UoaS1vZmZzZXQsMSlcblx0XHRcdG9mZnNldCsrXG5cblx0XHRAcHJldlBhdHRlcm4gPSBAcmVzb2x2ZWRQYXR0ZXJuXG5cdFx0QHJlc29sdmVkUGF0dGVybiA9IHBhdHRlcm5cblx0XHRyZXR1cm4ge3BhdHRlcm4sIGNhcmV0VHJhcEluZGV4ZXM6dHJhcEluZGV4ZXN9XG5cblxuXHRzZXRQYXR0ZXJuOiAoc3RyaW5nLCB1cGRhdGVWYWx1ZT10cnVlLCB1cGRhdGVGaWVsZCktPlxuXHRcdEBwYXR0ZXJuUmF3ID0gc3RyaW5nXG5cdFx0QHBhdHRlcm4gPSBAcGFyc2VQYXR0ZXJuKHN0cmluZylcblx0XHRAdHJhbnNmb3JtID0gQHBhcnNlVHJhbnNmb3JtKHN0cmluZylcblxuXHRcdGlmIHVwZGF0ZVZhbHVlXG5cdFx0XHRAdmFsdWUgPSBAc2V0VmFsdWUoQHZhbHVlKVxuXHRcdFx0QGZpZWxkLnZhbHVlID0gQHZhbHVlIGlmIHVwZGF0ZUZpZWxkXG5cblxuXHRwYXJzZVBhdHRlcm46IChzdHJpbmcpLT4gc3dpdGNoXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ0VNQUlMJ1xuXHRcdFx0bWFza0FkZG9ucy5lbWFpbE1hc2subWFza1xuXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ1BIT05FJ1xuXHRcdFx0QHBhdHRlcm5TZXR0ZXIgPSAodmFsdWUpLT4gaGVscGVycy5yZXBlYXQoJyMnLCBNYXRoLm1heCA3LHZhbHVlLmxlbmd0aClcblx0XHRcdEBndWlkZSA9IGZhbHNlXG5cdFx0XHRyZXR1cm4gJyMnXG5cblx0XHR3aGVuIHN0cmluZyBpcyAnTkFNRSdcblx0XHRcdEBwYXR0ZXJuU2V0dGVyID0gKHZhbHVlKS0+XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShAcGxhY2Vob2xkZXJSZWdleCwgJycpLnRyaW0oKVxuXHRcdFx0XHRoZWxwZXJzLnJlcGVhdCgnYScsIE1hdGgubWF4IDIsdmFsdWUubGVuZ3RoKVxuXG5cdFx0XHRyZXR1cm4gJ2EnXG5cblx0XHR3aGVuIHN0cmluZyBpcyAnRlVMTE5BTUUnXG5cdFx0XHRAcGF0dGVyblNldHRlciA9ICh2YWx1ZSktPlxuXHRcdFx0XHRpZiB2YWx1ZVt2YWx1ZS5sZW5ndGgtMV0gaXMgJyAnIHRoZW4gdmFsdWUgKz0gJ3gnXG5cdFx0XHRcdHNwbGl0ID0gdmFsdWUucmVwbGFjZShAcGxhY2Vob2xkZXJSZWdleCwnJykudHJpbSgpLnNwbGl0KC9cXHMrLylcblx0XHRcdFx0cmV0dXJuIGlmIHNwbGl0Lmxlbmd0aCBpcyA0XG5cdFx0XHRcdHNwbGl0Lm1hcCgocGFydCktPiBoZWxwZXJzLnJlcGVhdCgnYScsIE1hdGgubWF4IDIscGFydC5sZW5ndGgpKS5qb2luKCcgJylcblx0XHRcdHJldHVybiAnYSdcblxuXHRcdHdoZW4gc3RyaW5nIGlzICdEQVRFJ1xuXHRcdFx0Wy9cXGQvLCAvXFxkLywgJy8nLCAvXFxkLywgL1xcZC8sICcvJywgL1xcZC8sIC9cXGQvLCAvXFxkLywgL1xcZC9dXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmdbMF0gaXMgJ0RBVEUnIGFuZCBJUy5zdHJpbmcoc3RyaW5nWzFdKVxuXHRcdFx0c3RyaW5nWzFdLnNwbGl0KCcnKS5tYXAoKGNoYXIpPT4gaWYgUkVHRVgubGV0dGVyLnRlc3QoY2hhcikgdGhlbiAvXFxkLyBlbHNlIGNoYXIpXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmcgaXMgJ05VTUJFUidcblx0XHRcdG1hc2tBZGRvbnMuY3JlYXRlTnVtYmVyTWFza1xuXHRcdFx0XHRwcmVmaXg6IEBjb25maWcucHJlZml4IG9yICcnXG5cdFx0XHRcdHN1ZmZpeDogQGNvbmZpZy5zdWZmaXggb3IgJydcblx0XHRcdFx0aW5jbHVkZVRob3VzYW5kc1NlcGFyYXRvcjogaWYgQGNvbmZpZy5zZXAgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRcdFx0dGhvdXNhbmRzU2VwYXJhdG9yU3ltYm9sOiBpZiBJUy5zdHJpbmcoQGNvbmZpZy5zZXApIHRoZW4gQGNvbmZpZy5zZXBcblx0XHRcdFx0YWxsb3dEZWNpbWFsOiBAY29uZmlnLmRlY2ltYWxcblx0XHRcdFx0ZGVjaW1hbExpbWl0OiBpZiBJUy5udW1iZXIoQGNvbmZpZy5kZWNpbWFsKSB0aGVuIEBjb25maWcuZGVjaW1hbFxuXHRcdFx0XHRpbnRlZ2VyTGltaXQ6IGlmIElTLm51bWJlcihAY29uZmlnLmxpbWl0KSB0aGVuIEBjb25maWcubGltaXRcblxuXHRcdHdoZW4gSVMuYXJyYXkoc3RyaW5nKVxuXHRcdFx0cmV0dXJuIHN0cmluZ1xuXG5cdFx0ZWxzZVxuXHRcdFx0cGF0dGVybiA9IFtdXG5cblx0XHRcdGZvciBjaGFyLGkgaW4gc3RyaW5nXG5cdFx0XHRcdGlmIGNoYXIgaXMgJ1xcXFwnXG5cdFx0XHRcdFx0ZXNjYXBlZCA9IHRydWVcblx0XHRcdFx0XHRjb250aW51ZVxuXHRcdFx0XHRcblx0XHRcdFx0cGF0dGVybi5wdXNoIGlmIGVzY2FwZWQgdGhlbiBjaGFyIGVsc2UgKEBjaGFyc1tjaGFyXSBvciBjaGFyKVxuXHRcdFx0XHRlc2NhcGVkID0gZmFsc2VcblxuXHRcdFx0cmV0dXJuIHBhdHRlcm5cblxuXG5cdHBhcnNlVHJhbnNmb3JtOiAoc3RyaW5nKS0+IHN3aXRjaFxuXHRcdHdoZW4gc3RyaW5nIGlzICdFTUFJTCdcblx0XHRcdG1hc2tBZGRvbnMuZW1haWxNYXNrLnBpcGVcblx0XHRcblx0XHR3aGVuIHN0cmluZyBpcyAnREFURSdcblx0XHRcdG1hc2tBZGRvbnMuY3JlYXRlQXV0b0NvcnJlY3RlZERhdGVQaXBlKCdtbS9kZC95eXl5Jylcblx0XHRcblx0XHR3aGVuIHN0cmluZ1swXSBpcyAnREFURScgYW5kIElTLnN0cmluZyhzdHJpbmdbMV0pXG5cdFx0XHRtYXNrQWRkb25zLmNyZWF0ZUF1dG9Db3JyZWN0ZWREYXRlUGlwZShzdHJpbmdbMV0pXG5cblx0XHR3aGVuIEBjb25maWcudHJhbnNmb3JtXG5cdFx0XHRAY29uZmlnLnRyYW5zZm9ybVxuXG5cblxuXHRzZXRWYWx1ZTogKGlucHV0KS0+XG5cdFx0aWYgQHBhdHRlcm5TZXR0ZXJcblx0XHRcdG5ld1BhdHRlcm4gPSBAcGF0dGVyblNldHRlcihpbnB1dCkgb3IgQHBhdHRlcm5cblx0XHRcdEBzZXRQYXR0ZXJuKG5ld1BhdHRlcm4sIGZhbHNlKSBpZiBuZXdQYXR0ZXJuIGlzbnQgQHBhdHRlcm5SYXcgYW5kIG5ld1BhdHRlcm4gaXNudCBAcGF0dGVyblxuXHRcdFxuXHRcdHtjYXJldFRyYXBJbmRleGVzLCBwYXR0ZXJufSA9IEByZXNvbHZlUGF0dGVybihAcGF0dGVybiwgaW5wdXQpXG5cdFx0cmV0dXJuIEB2YWx1ZSBpZiBwYXR0ZXJuIGlzIGZhbHNlXG5cblx0XHRAcHJldlZhbHVlID0gQHZhbHVlXG5cdFx0QHByZXZDdXJzb3IgPSBAY3Vyc29yXG5cdFx0c3RhdGUgPSBAZ2V0U3RhdGUocGF0dGVybiwgaW5wdXQpXG5cdFx0e2NvbmZvcm1lZFZhbHVlfSA9IG1hc2tDb3JlLmNvbmZvcm1Ub01hc2soaW5wdXQsIHBhdHRlcm4sIHN0YXRlKVxuXG5cdFx0dHJhbnNmb3JtZWQgPSBAdHJhbnNmb3JtKGNvbmZvcm1lZFZhbHVlLCBzdGF0ZSkgaWYgQHRyYW5zZm9ybVxuXHRcdGlmIHRyYW5zZm9ybWVkIGlzIGZhbHNlXG5cdFx0XHRyZXR1cm4gQHZhbHVlXG5cdFx0aWYgSVMuc3RyaW5nKHRyYW5zZm9ybWVkKVxuXHRcdFx0Y29uZm9ybWVkVmFsdWUgPSB0cmFuc2Zvcm1lZFxuXHRcdGVsc2UgaWYgSVMub2JqZWN0KHRyYW5zZm9ybWVkKVxuXHRcdFx0aW5kZXhlc09mUGlwZWRDaGFycyA9IHRyYW5zZm9ybWVkLmluZGV4ZXNPZlBpcGVkQ2hhcnNcblx0XHRcdGNvbmZvcm1lZFZhbHVlID0gdHJhbnNmb3JtZWQudmFsdWVcblxuXG5cdFx0QGN1cnNvciA9IG1hc2tDb3JlLmFkanVzdENhcmV0UG9zaXRpb24gZXh0ZW5kIHN0YXRlLCB7XG5cdFx0XHRpbmRleGVzT2ZQaXBlZENoYXJzLCBjYXJldFRyYXBJbmRleGVzLCBjb25mb3JtZWRWYWx1ZVxuXHRcdH1cblxuXHRcdHJldHVybiBAdmFsdWUgPSBjb25mb3JtZWRWYWx1ZVxuXG5cblx0dmFsaWRhdGU6IChpbnB1dCktPlxuXHRcdGlmIGlucHV0IGlzbnQgQHZhbHVlIGFuZCBAcGF0dGVyblNldHRlclxuXHRcdFx0cGF0dGVybiA9IEBwYXR0ZXJuU2V0dGVyKGlucHV0KSBvciBAcGF0dGVyblxuXHRcdGVsc2Vcblx0XHRcdHBhdHRlcm4gPSBAcmVzb2x2ZWRQYXR0ZXJuXG5cdFx0XHR7cGF0dGVybn0gPSBAcmVzb2x2ZVBhdHRlcm4oQHBhdHRlcm4sIGlucHV0KSBpZiBub3QgcGF0dGVyblxuXG5cdFx0cmV0dXJuIHRydWUgaWYgcGF0dGVybiBpcyBmYWxzZVxuXHRcdFxuXHRcdGZvciBjaGFyLGkgaW4gcGF0dGVyblxuXHRcdFx0c3dpdGNoXG5cdFx0XHRcdHdoZW4gbm90IGlucHV0W2ldXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0XHRcdHdoZW4gSVMucmVnZXgoY2hhcikgYW5kIG5vdCBjaGFyLnRlc3QoaW5wdXRbaV0pXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0XHRcdHdoZW4gSVMuc3RyaW5nKGNoYXIpIGFuZCBpbnB1dFtpXSBpc250IGNoYXJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdHJldHVybiB0cnVlXG5cblx0aXNFbXB0eTogKCktPlxuXHRcdGlucHV0ID0gQHZhbHVlXG5cdFx0cGF0dGVybiA9IEByZXNvbHZlZFBhdHRlcm5cblx0XHRpZiBub3QgcGF0dGVyblxuXHRcdFx0cGF0dGVybiA9IEBwYXR0ZXJuU2V0dGVyKGlucHV0KSBpZiBAcGF0dGVyblNldHRlclxuXHRcdFx0e3BhdHRlcm59ID0gQHJlc29sdmVQYXR0ZXJuKHBhdHRlcm4gb3IgQHBhdHRlcm4sIGlucHV0KVxuXHRcdFxuXHRcdHJldHVybiB0cnVlIGlmIGlucHV0IGlzIEBjb25maWcucHJlZml4IG9yIGlucHV0IGlzIEBjb25maWcuc3VmZml4XG5cblx0XHRmb3IgY2hhcixpIGluIHBhdHRlcm5cblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIG5vdCBpbnB1dFtpXVxuXHRcdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRcdHdoZW4gSVMucmVnZXgoY2hhcilcblx0XHRcdFx0XHRyZXR1cm4gIWNoYXIudGVzdChpbnB1dFtpXSlcblx0XHRyZXR1cm4gZmFsc2VcblxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYXNrIiwidmFyIGtleUNvZGVzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleUNvZGVzID0ge1xuICBcImRlbGV0ZVwiOiA4LFxuICBlbnRlcjogMTMsXG4gIGVzYzogMjcsXG4gIGN0cmw6IDE3LFxuICBhbHQ6IDE4LFxuICBzaGlmdDogMTYsXG4gIFwic3VwZXJcIjogOTEsXG4gIHN1cGVyMjogOTMsXG4gIHVwOiAzOCxcbiAgbGVmdDogMzcsXG4gIHJpZ2h0OiAzOSxcbiAgZG93bjogNDAsXG4gIGh5cGhlbjogNDUsXG4gIHVuZGVyc2NvcmU6IDk1LFxuICBxdWVzdGlvbjogNjMsXG4gIGV4Y2xhbWF0aW9uOiAzMyxcbiAgZnJvbnRzbGFzaDogNDcsXG4gIGJhY2tzbGFzaDogOTIsXG4gIGNvbW1hOiA0NCxcbiAgcGVyaW9kOiA0NixcbiAgc3BhY2U6IDMyLFxuICBhbnlBcnJvdzogZnVuY3Rpb24oY29kZSkge1xuICAgIHJldHVybiBjb2RlID09PSBrZXlDb2Rlcy51cCB8fCBjb2RlID09PSBrZXlDb2Rlcy5kb3duIHx8IGNvZGUgPT09IGtleUNvZGVzLmxlZnQgfHwgY29kZSA9PT0ga2V5Q29kZXMucmlnaHQ7XG4gIH0sXG4gIGFueU1vZGlmaWVyOiBmdW5jdGlvbihjb2RlKSB7XG4gICAgcmV0dXJuIGNvZGUgPT09IGtleUNvZGVzLmN0cmwgfHwgY29kZSA9PT0ga2V5Q29kZXMuYWx0IHx8IGNvZGUgPT09IGtleUNvZGVzLnNoaWZ0IHx8IGNvZGUgPT09IGtleUNvZGVzW1wic3VwZXJcIl0gfHwgY29kZSA9PT0ga2V5Q29kZXMuc3VwZXIyO1xuICB9LFxuICBhbnlBbHBoYTogZnVuY3Rpb24oY29kZSkge1xuICAgIHJldHVybiAoOTcgPD0gY29kZSAmJiBjb2RlIDw9IDEyMikgfHwgKDY1IDw9IGNvZGUgJiYgY29kZSA8PSA5MCk7XG4gIH0sXG4gIGFueU51bWVyaWM6IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4gKDQ4IDw9IGNvZGUgJiYgY29kZSA8PSA1Nyk7XG4gIH0sXG4gIGFueUFscGhhTnVtZXJpYzogZnVuY3Rpb24oY29kZSkge1xuICAgIHJldHVybiBrZXlDb2Rlcy5hbnlBbHBoYShjb2RlKSB8fCBrZXlDb2Rlcy5hbnlOdW1lcmljKGNvZGUpO1xuICB9LFxuICBhbnlQcmludGFibGU6IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4ga2V5Q29kZXMuYW55QWxwaGEoY29kZSkgfHwga2V5Q29kZXMuYW55TnVtZXJpYyhjb2RlKSB8fCBjb2RlID09PSBrZXlDb2Rlcy5oeXBoZW4gfHwgY29kZSA9PT0ga2V5Q29kZXMudW5kZXJzY29yZSB8fCBjb2RlID09PSBrZXlDb2Rlcy5xdWVzdGlvbiB8fCBjb2RlID09PSBrZXlDb2Rlcy5leGNsYW1hdGlvbiB8fCBjb2RlID09PSBrZXlDb2Rlcy5mcm9udHNsYXNoIHx8IGNvZGUgPT09IGtleUNvZGVzLmJhY2tzbGFzaCB8fCBjb2RlID09PSBrZXlDb2Rlcy5jb21tYSB8fCBjb2RlID09PSBrZXlDb2Rlcy5wZXJpb2QgfHwgY29kZSA9PT0ga2V5Q29kZXMuc3BhY2U7XG4gIH1cbn07XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUpqYjI1emRHRnVkSE12YTJWNVEyOWtaWE11WTI5bVptVmxJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHRkZlE9PSIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5oZWxwZXJzID0gaW1wb3J0ICcuLi8uLi9oZWxwZXJzJ1xuQ09MT1JTID0gaW1wb3J0ICcuLi8uLi9jb25zdGFudHMvY29sb3JzJ1xuQ0hFQ0tNQVJLX1dJRFRIID0gMjZcblxuZXhwb3J0IGRlZmF1bHQgRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdmaWVsZCdcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHR2ZXJ0aWNhbEFsaWduOiAndG9wJ1xuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0Zm9udEZhbWlseTogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmZvbnRGYW1pbHlcblx0XHRcdHRleHRBbGlnbjogJ2xlZnQnXG5cdFx0XHQkdmlzaWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblx0XHRcdCRzaG93RXJyb3I6XG5cdFx0XHRcdGFuaW1hdGlvbjogJzAuMnMgZmllbGRFcnJvclNoYWtlJ1xuXG5cdFx0WydkaXYnXG5cdFx0XHRyZWY6ICdsYWJlbCdcblx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHR6SW5kZXg6IDFcblx0XHRcdFx0dG9wOiAoZmllbGQpLT4gQHN0eWxlUGFyc2VkKCdmb250U2l6ZScsIHRydWUpICogMC43XG5cdFx0XHRcdGxlZnQ6IChmaWVsZCktPiBoZWxwZXJzLnNob3J0aGFuZFNpZGVWYWx1ZShmaWVsZC5zZXR0aW5ncy5wYWRkaW5nLCAnbGVmdCcpICsgKGZpZWxkLmVsLmNoaWxkLmljb24/LndpZHRoIG9yIDApXG5cdFx0XHRcdHBhZGRpbmc6IChmaWVsZCktPiBcIjAgI3tmaWVsZC5zZXR0aW5ncy5pbnB1dFBhZGRpbmd9cHhcIlxuXHRcdFx0XHRmb250RmFtaWx5OiAnaW5oZXJpdCdcblx0XHRcdFx0Zm9udFNpemU6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5sYWJlbFNpemUgb3IgZmllbGQuc2V0dGluZ3MuZm9udFNpemUgKiAoMTEvMTQpXG5cdFx0XHRcdGZvbnRXZWlnaHQ6IDYwMFxuXHRcdFx0XHRsaW5lSGVpZ2h0OiAxXG5cdFx0XHRcdGNvbG9yOiBDT0xPUlMuZ3JleVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHRyYW5zaXRpb246ICdvcGFjaXR5IDAuMnMsIGNvbG9yIDAuMnMnXG5cdFx0XHRcdHdoaXRlU3BhY2U6ICdub3dyYXAnXG5cdFx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXHRcdFx0XHRjdXJzb3I6ICdkZWZhdWx0J1xuXHRcdFx0XHRwb2ludGVyRXZlbnRzOiAnbm9uZSdcblx0XHRcdFx0JGZpbGxlZDogJHNob3dMYWJlbDpcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdCRmb2N1czpcblx0XHRcdFx0XHRjb2xvcjogQ09MT1JTLm9yYW5nZVxuXHRcdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRcdGNvbG9yOiBDT0xPUlMucmVkXG5cdFx0XVxuXG5cdFx0WydkaXYnXG5cdFx0XHRyZWY6ICdpbm5lcndyYXAnXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdFx0aGVpZ2h0OiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuaGVpZ2h0XG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJ3doaXRlJ1xuXHRcdFx0XHRib3JkZXJXaWR0aDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmJvcmRlclxuXHRcdFx0XHRib3JkZXJTdHlsZTogJ3NvbGlkJ1xuXHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLmdyZXlfbGlnaHRcblx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnMnB4J1xuXHRcdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0XHRmb250RmFtaWx5OiAnaW5oZXJpdCdcblx0XHRcdFx0dHJhbnNpdGlvbjogJ2JvcmRlci1jb2xvciAwLjJzJ1xuXHRcdFx0XHQkZm9jdXM6XG5cdFx0XHRcdFx0Ym9yZGVyQ29sb3I6IENPTE9SUy5vcmFuZ2Vcblx0XHRcdFx0JHNob3dFcnJvcjpcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLnJlZFxuXHRcdFx0XHQkZGlzYWJsZWQ6XG5cdFx0XHRcdFx0Ym9yZGVyQ29sb3I6IENPTE9SUy5ncmV5X2xpZ2h0XG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBDT0xPUlMuZ3JleV9saWdodFxuXG5cdFx0XHRbJ2lucHV0J1xuXHRcdFx0XHRyZWY6ICdpbnB1dCdcblx0XHRcdFx0dHlwZTogJ3RleHQnXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdFx0XHR6SW5kZXg6IDNcblx0XHRcdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuXHRcdFx0XHRcdHZlcnRpY2FsQWxpZ246ICd0b3AnXG5cdFx0XHRcdFx0aGVpZ2h0OiAoKS0+IEBwYXJlbnQuc3R5bGVTYWZlKCdoZWlnaHQnLDEpIG9yIEBwYXJlbnQuc3R5bGVTYWZlKCdoZWlnaHQnKVxuXHRcdFx0XHRcdHdpZHRoOiAoZmllbGQpLT4gaWYgbm90IGZpZWxkLnNldHRpbmdzLmF1dG9XaWR0aFxuXHRcdFx0XHRcdFx0c3VidHJhY3QgPSAwXG5cdFx0XHRcdFx0XHRpZiBpY29uU2libGluZyA9IGZpZWxkLmVsLmNoaWxkLmljb25cblx0XHRcdFx0XHRcdFx0c3VidHJhY3QgKz0gaWNvblNpYmxpbmcud2lkdGhcblx0XHRcdFx0XHRcdGlmIGlucHV0U2libGluZyA9IGZpZWxkLmVsLmNoaWxkW2ZpZWxkLnNldHRpbmdzLmlucHV0U2libGluZ11cblx0XHRcdFx0XHRcdFx0d2lkdGggPSBpbnB1dFNpYmxpbmcuc3R5bGVQYXJzZWQoJ3dpZHRoJywxKSBvciAwXG5cdFx0XHRcdFx0XHRcdHBhZGRpbmcgPSBpbnB1dFNpYmxpbmcuc3R5bGVQYXJzZWQoJ3BhZGRpbmcnLDEpIG9yIDBcblx0XHRcdFx0XHRcdFx0cGFkZGluZ0xlZnQgPSBpbnB1dFNpYmxpbmcuc3R5bGVQYXJzZWQoJ3BhZGRpbmdMZWZ0JywxKSBvciBwYWRkaW5nIG9yIDBcblx0XHRcdFx0XHRcdFx0cGFkZGluZ1JpZ2h0ID0gaW5wdXRTaWJsaW5nLnN0eWxlUGFyc2VkKCdwYWRkaW5nUmlnaHQnLDEpIG9yIHBhZGRpbmcgb3IgMFxuXHRcdFx0XHRcdFx0XHRzdWJ0cmFjdCArPSB3aWR0aCtwYWRkaW5nTGVmdCtwYWRkaW5nUmlnaHRcblx0XHRcdFx0XHRcdHJldHVybiBcImNhbGMoMTAwJSAtICN7c3VidHJhY3R9cHgpXCJcblxuXHRcdFx0XHRcdHBhZGRpbmc6IChmaWVsZCktPlxuXHRcdFx0XHRcdFx0QHBhZGRpbmcgPz0gTWF0aC5tYXggMCwgaGVscGVycy5jYWxjUGFkZGluZyhmaWVsZC5zZXR0aW5ncy5oZWlnaHQsIDE0KS0zXG5cdFx0XHRcdFx0XHRyZXR1cm4gXCIje0BwYWRkaW5nfXB4ICN7ZmllbGQuc2V0dGluZ3MuaW5wdXRQYWRkaW5nfXB4XCJcblx0XHRcdFx0XG5cdFx0XHRcdFx0bWFyZ2luOiAnMCdcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcblx0XHRcdFx0XHRhcHBlYXJhbmNlOiAnbm9uZSdcblx0XHRcdFx0XHRib3JkZXI6ICdub25lJ1xuXHRcdFx0XHRcdG91dGxpbmU6ICdub25lJ1xuXHRcdFx0XHRcdGZvbnRGYW1pbHk6ICdpbmhlcml0J1xuXHRcdFx0XHRcdGZvbnRTaXplOiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuZm9udFNpemVcblx0XHRcdFx0XHRjb2xvcjogQ09MT1JTLmJsYWNrXG5cdFx0XHRcdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCdcblx0XHRcdFx0XHRib3hTaGFkb3c6ICdub25lJ1xuXHRcdFx0XHRcdHdoaXRlU3BhY2U6ICdub3dyYXAnXG5cdFx0XHRcdFx0YmFja2dyb3VuZENsaXA6ICdjb250ZW50LWJveCcgIyBzZW1pLWZpeCBmb3IgeWVsbG93IGF1dG9maWxsIGJhY2tncm91bmRcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ1xuXHRcdFx0XHRcdHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMC4ycywgLXdlYmtpdC10cmFuc2Zvcm0gMC4ycydcblx0XHRcdFx0XHQkZGlzYWJsZWQ6XG5cdFx0XHRcdFx0XHRjdXJzb3I6ICdub3QtYWxsb3dlZCdcblx0XHRcdFx0XHQkZmlsbGVkOiAkc2hvd0xhYmVsOlxuXHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAoZmllbGQpLT5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIEB0cmFuc2xhdGlvbiBpZiBAdHJhbnNsYXRpb24/IG9yIG5vdCAobGFiZWw9ZmllbGQuZWwuY2hpbGQubGFiZWwpIG9yIGxhYmVsLnN0eWxlU2FmZSgncG9zaXRpb24nLDEpIGlzbnQgJ2Fic29sdXRlJ1xuXHRcdFx0XHRcdFx0XHR0b3RhbEhlaWdodCA9IEBwYXJlbnQuc3R5bGVQYXJzZWQoJ2hlaWdodCcsMSlcblx0XHRcdFx0XHRcdFx0d29ya2FibGVIZWlnaHQgPSB0b3RhbEhlaWdodCAtIChsYWJlbC5zdHlsZVBhcnNlZCgnZm9udFNpemUnLDEpICsgbGFiZWwuc3R5bGVQYXJzZWQoJ3RvcCcsMSkqMilcblx0XHRcdFx0XHRcdFx0dHJhbnNsYXRpb24gPSBNYXRoLm1heCAwLCBNYXRoLmZsb29yICh0b3RhbEhlaWdodC13b3JrYWJsZUhlaWdodCkvNFxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJ0cmFuc2xhdGVZKCN7dHJhbnNsYXRpb259cHgpXCJcblx0XHRcdFx0XHRcblx0XHRcdF1cblxuXHRcdFx0WydkaXYnXG5cdFx0XHRcdHJlZjogJ3BsYWNlaG9sZGVyJ1xuXHRcdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0ekluZGV4OiAyXG5cdFx0XHRcdFx0dG9wOiAnMHB4J1xuXHRcdFx0XHRcdGxlZnQ6IChmaWVsZCktPiBmaWVsZC5lbC5jaGlsZC5pY29uPy53aWR0aCBvciAwXG5cdFx0XHRcdFx0Zm9udEZhbWlseTogKGZpZWxkKS0+IGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlU2FmZSgnZm9udEZhbWlseScsMSlcblx0XHRcdFx0XHRmb250U2l6ZTogKGZpZWxkKS0+IGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlU2FmZSgnZm9udFNpemUnLDEpXG5cdFx0XHRcdFx0cGFkZGluZzogKGZpZWxkKS0+XG5cdFx0XHRcdFx0XHR2ZXJ0aSA9IGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlUGFyc2VkKCdwYWRkaW5nVG9wJywxKSBvciBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVBhcnNlZCgncGFkZGluZ1RvcCcpXG5cdFx0XHRcdFx0XHRob3JpeiA9IGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlUGFyc2VkKCdwYWRkaW5nTGVmdCcsMSkgb3IgZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdMZWZ0Jylcblx0XHRcdFx0XHRcdHJldHVybiBcIiN7dmVydGkrM31weCAje2hvcml6fXB4XCJcblxuXHRcdFx0XHRcdGNvbG9yOiBDT0xPUlMuYmxhY2tcblx0XHRcdFx0XHRvcGFjaXR5OiAwLjVcblx0XHRcdFx0XHRwb2ludGVyRXZlbnRzOiAnbm9uZSdcblx0XHRcdFx0XHR1c2VyU2VsZWN0OiAnbm9uZSdcblx0XHRcdFx0XHR3aGl0ZVNwYWNlOiAnbm93cmFwJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknXG5cdFx0XHRcdFx0dHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAwLjJzLCAtd2Via2l0LXRyYW5zZm9ybSAwLjJzJ1xuXHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHR2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuXHRcdFx0XHRcdFx0JHNob3dMYWJlbDpcblx0XHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAoZmllbGQpLT4gZmllbGQuZWwuY2hpbGQuaW5wdXQucmF3LnN0eWxlLnRyYW5zZm9ybVxuXHRcdFx0XVxuXHRcdF1cblx0XHRcblx0XHRbJ2Rpdidcblx0XHRcdHJlZjogJ2hlbHAnXG5cdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0Ym90dG9tOiAoKS0+IChAc3R5bGVQYXJzZWQoJ2ZvbnRTaXplJywxKSsxMCkgKiAtMVxuXHRcdFx0XHRsZWZ0OiAoZmllbGQpLT4gaGVscGVycy5zaG9ydGhhbmRTaWRlVmFsdWUoZmllbGQuc2V0dGluZ3MucGFkZGluZywgJ2xlZnQnKVxuXHRcdFx0XHRmb250RmFtaWx5OiAnaW5oZXJpdCdcblx0XHRcdFx0Zm9udFNpemU6ICcxMXB4J1xuXHRcdFx0XHRjb2xvcjogQ09MT1JTLmdyZXlcblx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRcdCRzaG93RXJyb3I6XG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0JHNob3dIZWxwOlxuXHRcdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IGljb24gPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2ljb24nXG5cdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdHpJbmRleDogMlxuXHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHR3aWR0aDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmljb25TaXplXG5cdFx0XHRoZWlnaHQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZVxuXHRcdFx0Zm9udFNpemU6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZVxuXHRcdFx0cGFkZGluZ0xlZnQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pbnB1dFBhZGRpbmdcblx0XHRcdHBhZGRpbmdUb3A6IChmaWVsZCktPiBAcGFyZW50LnN0eWxlUGFyc2VkKCdoZWlnaHQnLDEpLzIgLSBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZS8yXG5cdFx0XHRsaW5lSGVpZ2h0OiAnMWVtJ1xuXHRcdFx0dXNlclNlbGVjdDogJ25vbmUnXG5cblx0XHRtZXRob2RzOlxuXHRcdFx0d2lkdGg6IGdldDogKCktPlxuXHRcdFx0XHRpZiBAX2luc2VydGVkXG5cdFx0XHRcdFx0QHJhdy5vZmZzZXRXaWR0aFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0QHN0eWxlUGFyc2VkKCd3aWR0aCcsMSkgb3IgQHJlbGF0ZWQuc2V0dGluZ3MuaWNvblNpemVcblx0XHRcdFx0IyBAc3R5bGVQYXJzZWQoJ3dpZHRoJywxKSBvciBAcmF3Lm9mZnNldFdpZHRoIG9yIEByZWxhdGVkLnNldHRpbmdzLmljb25TaXplIG9yIDBcblx0XVxuKVxuXG5cbmV4cG9ydCBjaGVja21hcmsgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2NoZWNrbWFyaydcblx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0ekluZGV4OiA0XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdHdpZHRoOiAyNlxuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdHBhZGRpbmdUb3A6ICgpLT4gQHBhcmVudC5zdHlsZVBhcnNlZCgnaGVpZ2h0JywxKS8yIC0gMTNcblx0XHRcdHBhZGRpbmdSaWdodDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmlucHV0UGFkZGluZ1xuXHRcdFx0dmVydGljYWxBbGlnbjogJ3RvcCdcblx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cblx0XHRbJ2Rpdidcblx0XHRcdHJlZjogJ2NoZWNrbWFya19pbm5lcndyYXAnXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0d2lkdGg6ICcyMHB4J1xuXHRcdFx0XHRoZWlnaHQ6ICcyMHB4J1xuXHRcdFx0XHRib3JkZXJSYWRpdXM6ICc1MCUnXG5cdFx0XHRcdGJvcmRlcldpZHRoOiAnM3B4J1xuXHRcdFx0XHRib3JkZXJTdHlsZTogJ3NvbGlkJ1xuXHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLmdyZWVuXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3NjYWxlKDAuOCknXG5cdFx0XHRcdCMgdHJhbnNmb3JtT3JpZ2luOiAnMTAwJSAwJ1xuXHRcdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMucmVkXG5cblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbWFzazEnXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR0b3A6ICctNHB4J1xuXHRcdFx0XHRcdGxlZnQ6ICctMTBweCdcblx0XHRcdFx0XHR3aWR0aDogJzE1cHgnXG5cdFx0XHRcdFx0aGVpZ2h0OiAnMzBweCdcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICczMHB4IDAgMCAzMHB4J1xuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogKGZpZWxkKS0+IGhlbHBlcnMuZGVmYXVsdENvbG9yIGZpZWxkLmVscy5pbm5lcndyYXAuc3R5bGVTYWZlKCdiYWNrZ3JvdW5kQ29sb3InLDEpLCAnd2hpdGUnXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG5cdFx0XHRcdFx0dHJhbnNmb3JtT3JpZ2luOiAnMTVweCAxNXB4IDAnXG5cdFx0XHRdXG5cdFx0XHRcblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbWFzazInXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR0b3A6ICctNXB4J1xuXHRcdFx0XHRcdGxlZnQ6ICc4cHgnXG5cdFx0XHRcdFx0d2lkdGg6ICcxNXB4J1xuXHRcdFx0XHRcdGhlaWdodDogJzMwcHgnXG5cdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnMCAzMHB4IDMwcHggMCdcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IChmaWVsZCktPiBoZWxwZXJzLmRlZmF1bHRDb2xvciBmaWVsZC5lbHMuaW5uZXJ3cmFwLnN0eWxlU2FmZSgnYmFja2dyb3VuZENvbG9yJywxKSwgJ3doaXRlJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybU9yaWdpbjogJzAgMTVweCAwJ1xuXHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRhbmltYXRpb246ICc0LjI1cyBlYXNlLWluIGNoZWNrbWFya1JvdGF0ZVBsYWNlaG9sZGVyJ1xuXHRcdFx0XHRcdFx0JGludmFsaWQ6XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJydcblx0XHRcdF1cblx0XHRcdFxuXHRcdFx0WydkaXYnXG5cdFx0XHRcdHJlZjogJ2NoZWNrbWFya19saW5lV3JhcHBlcidcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0JGZpbGxlZDogJGludmFsaWQ6XG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0XHRcdFx0ekluZGV4OiAyXG5cdFx0XHRcdFx0XHRhbmltYXRpb246ICcwLjU1cyBjaGVja21hcmtBbmltYXRlRXJyb3InXG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm1PcmlnaW46ICc1MCUgMTBweCdcblxuXHRcdFx0XHRbJ2Rpdidcblx0XHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbGluZVNob3J0J1xuXHRcdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdFx0dG9wOiAnMTBweCdcblx0XHRcdFx0XHRcdGxlZnQ6ICczcHgnXG5cdFx0XHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHRcdFx0XHR3aWR0aDogJzhweCdcblx0XHRcdFx0XHRcdGhlaWdodDogJzNweCdcblx0XHRcdFx0XHRcdGJvcmRlclJhZGl1czogJzJweCdcblx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQ09MT1JTLmdyZWVuXG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGUoNDVkZWcpJ1xuXHRcdFx0XHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnMC43NXMgY2hlY2ttYXJrQW5pbWF0ZVN1Y2Nlc3NUaXAnXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdCRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0XHRcdFx0bGVmdDogJzRweCdcblx0XHRcdFx0XHRcdFx0dG9wOiAnOHB4J1xuXHRcdFx0XHRcdFx0XHR3aWR0aDogJzEycHgnXG5cdFx0XHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnJ1xuXHRcdFx0XHRdXG5cblx0XHRcdFx0WydkaXYnXG5cdFx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX2xpbmVMb25nJ1xuXHRcdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdFx0dG9wOiAnOHB4J1xuXHRcdFx0XHRcdFx0cmlnaHQ6ICcycHgnXG5cdFx0XHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHRcdFx0XHR3aWR0aDogJzEycHgnXG5cdFx0XHRcdFx0XHRoZWlnaHQ6ICczcHgnXG5cdFx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICcycHgnXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5ncmVlblxuXHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG5cdFx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0XHRhbmltYXRpb246ICcwLjc1cyBjaGVja21hcmtBbmltYXRlU3VjY2Vzc0xvbmcnXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdCRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0XHRcdFx0dG9wOiAnOHB4J1xuXHRcdFx0XHRcdFx0XHRsZWZ0OiAnNHB4J1xuXHRcdFx0XHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnJ1xuXHRcdFx0XHRdXG5cdFx0XHRdXG5cdFx0XHRcblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfcGxhY2Vob2xkZXInXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0ekluZGV4OiAyXG5cdFx0XHRcdFx0dG9wOiAnLTRweCdcblx0XHRcdFx0XHRsZWZ0OiAnLTNweCdcblx0XHRcdFx0XHR3aWR0aDogJzIwcHgnXG5cdFx0XHRcdFx0aGVpZ2h0OiAnMjBweCdcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICc1MCUnXG5cdFx0XHRcdFx0Ym9yZGVyV2lkdGg6ICczcHgnXG5cdFx0XHRcdFx0Ym9yZGVyU3R5bGU6ICdzb2xpZCdcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogaGVscGVycy5oZXhUb1JHQkEoQ09MT1JTLmdyZWVuLCAwLjQpXG5cdFx0XHRcdFx0JGludmFsaWQ6XG5cdFx0XHRcdFx0XHRib3JkZXJDb2xvcjogaGVscGVycy5oZXhUb1JHQkEoQ09MT1JTLnJlZCwgMC40KVxuXHRcdFx0XVxuXHRcdFx0XG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX3BhdGNoJ1xuXHRcdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0ekluZGV4OiAxXG5cdFx0XHRcdFx0dG9wOiAnLTJweCdcblx0XHRcdFx0XHRsZWZ0OiAnNnB4J1xuXHRcdFx0XHRcdHdpZHRoOiAnNHB4J1xuXHRcdFx0XHRcdGhlaWdodDogJzI4cHgnXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAoZmllbGQpLT4gaGVscGVycy5kZWZhdWx0Q29sb3IgZmllbGQuZWxzLmlubmVyd3JhcC5zdHlsZVNhZmUoJ2JhY2tncm91bmRDb2xvcicsMSksICd3aGl0ZSdcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSdcblx0XHRcdF1cblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHBsYWNlaG9sZGVyOiB0cnVlLFxuICB2YWxpZFdoZW5Jc0Nob2ljZTogZmFsc2UsXG4gIHZhbGlkV2hlblJlZ2V4OiBmYWxzZSxcbiAgYXV0b1dpZHRoOiBmYWxzZSxcbiAgbWF4V2lkdGg6ICcxMDAlJyxcbiAgbWluV2lkdGg6IDIsXG4gIGhlaWdodDogNDYsXG4gIGNoZWNrbWFyazogdHJ1ZSxcbiAga2V5Ym9hcmQ6ICd0ZXh0JyxcbiAgZHJvcGRvd246IHtcbiAgICBsb2NrU2Nyb2xsOiBmYWxzZVxuICB9LFxuICBjaG9pY2VzOiBudWxsLFxuICBtaW5MZW5ndGg6IG51bGwsXG4gIG1heExlbmd0aDogbnVsbCxcbiAgaW5wdXRTaWJsaW5nOiAnY2hlY2ttYXJrJyxcbiAgbWFzazoge1xuICAgIHBhdHRlcm46IGZhbHNlLFxuICAgIHBsYWNlaG9sZGVyOiAnXycsXG4gICAgZ3VpZGU6IHRydWUsXG4gICAgY3VzdG9tUGF0dGVybnM6IGZhbHNlXG4gIH1cbn07XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUptYVdWc1pDOTBaWGgwTDJSbFptRjFiSFJ6TG1OdlptWmxaU0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiWFgwPSIsImV4cG9ydHMuUkVHRVhfTEVOX1ZBTCA9IC9eXFxkKyg/OlthLXpdfFxcJSkrJC9pO1xuXG5leHBvcnRzLlJFR0VYX0RJR0lUUyA9IC9cXGQrJC87XG5cbmV4cG9ydHMuUkVHRVhfU1BBQ0UgPSAvXFxzLztcblxuZXhwb3J0cy5SRUdFWF9LRUJBQiA9IC8oW0EtWl0pKy9nO1xuXG5leHBvcnRzLklNUE9SVEFOVCA9ICdpbXBvcnRhbnQnO1xuXG5leHBvcnRzLlBPU1NJQkxFX1BSRUZJWEVTID0gWyd3ZWJraXQnLCAnbW96JywgJ21zJywgJ28nXTtcblxuZXhwb3J0cy5SRVFVSVJFU19VTklUX1ZBTFVFID0gWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnLCAnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgJ2Jsb2NrLXNpemUnLCAnYm9yZGVyLXdpZHRoJywgJ2NvbHVtblJ1bGUtd2lkdGgnLCAnY3gnLCAnY3knLCAnZm9udC1zaXplJywgJ2dyaWQtY29sdW1uLWdhcCcsICdncmlkLXJvdy1nYXAnLCAnaGVpZ2h0JywgJ2lubGluZS1zaXplJywgJ2xpbmUtaGVpZ2h0JywgJ21pbkJsb2NrLXNpemUnLCAnbWluLWhlaWdodCcsICdtaW4taW5saW5lLXNpemUnLCAnbWluLXdpZHRoJywgJ21heC1oZWlnaHQnLCAnbWF4LXdpZHRoJywgJ291dGxpbmUtb2Zmc2V0JywgJ291dGxpbmUtd2lkdGgnLCAncGVyc3BlY3RpdmUnLCAnc2hhcGUtbWFyZ2luJywgJ3N0cm9rZS1kYXNob2Zmc2V0JywgJ3N0cm9rZS13aWR0aCcsICd0ZXh0LWluZGVudCcsICd3aWR0aCcsICd3b3JkLXNwYWNpbmcnLCAndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0JywgJ3gnLCAneSddO1xuXG5leHBvcnRzLlFVQURfU0hPUlRIQU5EUyA9IFsnbWFyZ2luJywgJ3BhZGRpbmcnLCAnYm9yZGVyJywgJ2JvcmRlci1yYWRpdXMnXTtcblxuZXhwb3J0cy5ESVJFQ1RJT05TID0gWyd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXTtcblxuZXhwb3J0cy5RVUFEX1NIT1JUSEFORFMuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICB2YXIgZGlyZWN0aW9uLCBpLCBsZW4sIHJlZjtcbiAgZXhwb3J0cy5SRVFVSVJFU19VTklUX1ZBTFVFLnB1c2gocHJvcGVydHkpO1xuICByZWYgPSBleHBvcnRzLkRJUkVDVElPTlM7XG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGRpcmVjdGlvbiA9IHJlZltpXTtcbiAgICBleHBvcnRzLlJFUVVJUkVTX1VOSVRfVkFMVUUucHVzaChwcm9wZXJ0eSArICctJyArIGRpcmVjdGlvbik7XG4gIH1cbn0pO1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12Y1hWcFkydGtiMjB2Ym05a1pWOXRiMlIxYkdWekwzRjFhV05yWTNOekwzTnlZeTlqYjI1emRHRnVkSE11WTI5bVptVmxJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHRkZlE9PSIsImNvbnN0YW50cyA9IGltcG9ydCAnLi9jb25zdGFudHMnXG5zYW1wbGVTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLnN0eWxlXG5cbmhlbHBlcnMgPSBleHBvcnRzXG5cbmhlbHBlcnMuaW5jbHVkZXMgPSAodGFyZ2V0LCBpdGVtKS0+XG5cdHRhcmdldCBhbmQgdGFyZ2V0LmluZGV4T2YoaXRlbSkgaXNudCAtMVxuXG5oZWxwZXJzLmlzSXRlcmFibGUgPSAodGFyZ2V0KS0+XG5cdHRhcmdldCBhbmRcblx0dHlwZW9mIHRhcmdldCBpcyAnb2JqZWN0JyBhbmRcblx0dHlwZW9mIHRhcmdldC5sZW5ndGggaXMgJ251bWJlcicgYW5kXG5cdG5vdCB0YXJnZXQubm9kZVR5cGVcblxuaGVscGVycy50b0tlYmFiQ2FzZSA9IChzdHJpbmcpLT5cblx0c3RyaW5nLnJlcGxhY2UgY29uc3RhbnRzLlJFR0VYX0tFQkFCLCAoZSxsZXR0ZXIpLT4gXCItI3tsZXR0ZXIudG9Mb3dlckNhc2UoKX1cIlxuXG5oZWxwZXJzLmlzUHJvcFN1cHBvcnRlZCA9IChwcm9wZXJ0eSktPlxuXHR0eXBlb2Ygc2FtcGxlU3R5bGVbcHJvcGVydHldIGlzbnQgJ3VuZGVmaW5lZCdcblxuaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkID0gKHByb3BlcnR5LCB2YWx1ZSktPlxuXHRpZiB3aW5kb3cuQ1NTIGFuZCB3aW5kb3cuQ1NTLnN1cHBvcnRzXG5cdFx0cmV0dXJuIHdpbmRvdy5DU1Muc3VwcG9ydHMocHJvcGVydHksIHZhbHVlKVxuXHRlbHNlXG5cdFx0c2FtcGxlU3R5bGVbcHJvcGVydHldID0gdmFsdWVcblx0XHRyZXR1cm4gc2FtcGxlU3R5bGVbcHJvcGVydHldIGlzICcnK3ZhbHVlXG5cbmhlbHBlcnMuZ2V0UHJlZml4ID0gKHByb3BlcnR5LCBza2lwSW5pdGlhbENoZWNrKS0+XG5cdGlmIHNraXBJbml0aWFsQ2hlY2sgb3Igbm90IGhlbHBlcnMuaXNQcm9wU3VwcG9ydGVkKHByb3BlcnR5KVxuXHRcdGZvciBwcmVmaXggaW4gY29uc3RhbnRzLlBPU1NJQkxFX1BSRUZJWEVTXG5cdFx0XHQjIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5cdFx0XHRyZXR1cm4gXCItI3twcmVmaXh9LVwiIGlmIGhlbHBlcnMuaXNQcm9wU3VwcG9ydGVkKFwiLSN7cHJlZml4fS0je3Byb3BlcnR5fVwiKVxuXHRcblx0cmV0dXJuICcnXG5cbmhlbHBlcnMubm9ybWFsaXplUHJvcGVydHkgPSAocHJvcGVydHkpLT5cdFxuXHRwcm9wZXJ0eSA9IGhlbHBlcnMudG9LZWJhYkNhc2UocHJvcGVydHkpXG5cdFxuXHRpZiBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZChwcm9wZXJ0eSlcblx0XHRyZXR1cm4gcHJvcGVydHlcblx0ZWxzZVxuXHRcdHJldHVybiBcIiN7aGVscGVycy5nZXRQcmVmaXgocHJvcGVydHksdHJ1ZSl9I3twcm9wZXJ0eX1cIlxuXG5oZWxwZXJzLm5vcm1hbGl6ZVZhbHVlID0gKHByb3BlcnR5LCB2YWx1ZSktPlxuXHRpZiBoZWxwZXJzLmluY2x1ZGVzKGNvbnN0YW50cy5SRVFVSVJFU19VTklUX1ZBTFVFLCBwcm9wZXJ0eSkgYW5kIHZhbHVlIGlzbnQgbnVsbFxuXHRcdHZhbHVlID0gJycrdmFsdWVcblx0XHRpZiAgY29uc3RhbnRzLlJFR0VYX0RJR0lUUy50ZXN0KHZhbHVlKSBhbmRcblx0XHRcdG5vdCBjb25zdGFudHMuUkVHRVhfTEVOX1ZBTC50ZXN0KHZhbHVlKSBhbmRcblx0XHRcdG5vdCBjb25zdGFudHMuUkVHRVhfU1BBQ0UudGVzdCh2YWx1ZSlcblx0XHRcdFx0dmFsdWUgKz0gaWYgcHJvcGVydHkgaXMgJ2xpbmUtaGVpZ2h0JyB0aGVuICdlbScgZWxzZSAncHgnXG5cblx0cmV0dXJuIHZhbHVlXG5cblxuaGVscGVycy5zb3J0ID0gKGFycmF5KS0+XG5cdGlmIGFycmF5Lmxlbmd0aCA8IDJcblx0XHRyZXR1cm4gYXJyYXlcblx0ZWxzZVxuXHRcdHBpdm90ID0gYXJyYXlbMF07IGxlc3MgPSBbXTsgZ3JlYXQgPSBbXTsgbGVuID0gYXJyYXkubGVuZ3RoOyBpID0gMDtcblx0XHRcblx0XHR3aGlsZSArK2kgaXNudCBsZW5cblx0XHRcdGlmIGFycmF5W2ldIDw9IHBpdm90XG5cdFx0XHRcdGxlc3MucHVzaChhcnJheVtpXSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0Z3JlYXQucHVzaChhcnJheVtpXSlcblxuXHRcdHJldHVybiBoZWxwZXJzLnNvcnQobGVzcykuY29uY2F0KHBpdm90LCBoZWxwZXJzLnNvcnQoZ3JlYXQpKVxuXG5cbmhlbHBlcnMuaGFzaCA9IChzdHJpbmcpLT5cblx0aGFzaCA9IDUzODE7IGkgPSAtMTsgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuXHRcblx0d2hpbGUgKytpIGlzbnQgc3RyaW5nLmxlbmd0aFxuXHRcdGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cdFx0aGFzaCB8PSAwXG5cblx0cmV0dXJuICdfJysoaWYgaGFzaCA8IDAgdGhlbiBoYXNoICogLTIgZWxzZSBoYXNoKVxuXG5cbmhlbHBlcnMucnVsZVRvU3RyaW5nID0gKHJ1bGUsIGltcG9ydGFudCktPlxuXHRvdXRwdXQgPSAnJ1xuXHRwcm9wcyA9IGhlbHBlcnMuc29ydChPYmplY3Qua2V5cyhydWxlKSlcblx0XG5cdGZvciBwcm9wIGluIHByb3BzXG5cdFx0aWYgdHlwZW9mIHJ1bGVbcHJvcF0gaXMgJ3N0cmluZycgb3IgdHlwZW9mIHJ1bGVbcHJvcF0gaXMgJ251bWJlcidcblx0XHRcdHByb3BlcnR5ID0gaGVscGVycy5ub3JtYWxpemVQcm9wZXJ0eShwcm9wKVxuXHRcdFx0dmFsdWUgPSBoZWxwZXJzLm5vcm1hbGl6ZVZhbHVlKHByb3BlcnR5LCBydWxlW3Byb3BdKVxuXHRcdFx0dmFsdWUgKz0gXCIgIWltcG9ydGFudFwiIGlmIGltcG9ydGFudFxuXHRcdFx0b3V0cHV0ICs9IFwiI3twcm9wZXJ0eX06I3t2YWx1ZX07XCJcblx0XG5cdHJldHVybiBvdXRwdXRcblxuaGVscGVycy5pbmxpbmVTdHlsZUNvbmZpZyA9IHN0eWxlQ29uZmlnID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuaGVscGVycy5pbmxpbmVTdHlsZSA9IChydWxlLCB2YWx1ZVRvU3RvcmUsIGxldmVsKS0+XG5cdGlmIG5vdCBjb25maWc9c3R5bGVDb25maWdbbGV2ZWxdXG5cdFx0c3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcblx0XHRzdHlsZUVsLmlkID0gXCJxdWlja2NzcyN7bGV2ZWwgb3IgJyd9XCJcblx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpXG5cdFx0c3R5bGVDb25maWdbbGV2ZWxdID0gY29uZmlnID0gZWw6c3R5bGVFbCwgY29udGVudDonJywgY2FjaGU6T2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcblx0dW5sZXNzIGNvbmZpZy5jYWNoZVtydWxlXVxuXHRcdGNvbmZpZy5jYWNoZVtydWxlXSA9IHZhbHVlVG9TdG9yZSBvciB0cnVlXG5cdFx0Y29uZmlnLmVsLnRleHRDb250ZW50ID0gY29uZmlnLmNvbnRlbnQgKz0gcnVsZVxuXHRcblx0cmV0dXJuXG5cblxuaGVscGVycy5jbGVhcklubGluZVN0eWxlID0gKGxldmVsKS0+IGlmIGNvbmZpZyA9IHN0eWxlQ29uZmlnW2xldmVsXVxuXHRyZXR1cm4gaWYgbm90IGNvbmZpZy5jb250ZW50XG5cdGNvbmZpZy5lbC50ZXh0Q29udGVudCA9IGNvbmZpZy5jb250ZW50ID0gJydcblx0a2V5cyA9IE9iamVjdC5rZXlzKGNvbmZpZy5jYWNoZSlcblx0Y29uZmlnLmNhY2hlW2tleV0gPSBudWxsIGZvciBrZXkgaW4ga2V5c1xuXHRyZXR1cm5cblxuXG5cblxuXG4iLCJ2YXIgZXhwb3J0cztcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0ge1xuICBkZWZpbmVkOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHN1YmplY3QgIT09IHZvaWQgMDtcbiAgfSxcbiAgYXJyYXk6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gc3ViamVjdCBpbnN0YW5jZW9mIEFycmF5O1xuICB9LFxuICBvYmplY3Q6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmIHN1YmplY3Q7XG4gIH0sXG4gIG9iamVjdFBsYWluOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIGV4cG9ydHMub2JqZWN0KHN1YmplY3QpICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdWJqZWN0KSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgJiYgc3ViamVjdC5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xuICB9LFxuICBzdHJpbmc6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIHN1YmplY3QgPT09ICdzdHJpbmcnO1xuICB9LFxuICBudW1iZXI6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIHN1YmplY3QgPT09ICdudW1iZXInICYmICFpc05hTihzdWJqZWN0KTtcbiAgfSxcbiAgbnVtYmVyTG9vc2U6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5udW1iZXIoc3ViamVjdCkgfHwgZXhwb3J0cy5zdHJpbmcoc3ViamVjdCkgJiYgZXhwb3J0cy5udW1iZXIoTnVtYmVyKHN1YmplY3QpKTtcbiAgfSxcbiAgXCJmdW5jdGlvblwiOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzdWJqZWN0ID09PSAnZnVuY3Rpb24nO1xuICB9LFxuICBpdGVyYWJsZTogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBleHBvcnRzLm9iamVjdChzdWJqZWN0KSAmJiBleHBvcnRzLm51bWJlcihzdWJqZWN0Lmxlbmd0aCk7XG4gIH1cbn07XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUl1TGk5dWIyUmxYMjF2WkhWc1pYTXZRR1JoYm1sbGJHdGhiR1Z1TDJsekwzTnlZeTl1WVhScGRtVnpMbU52Wm1abFpTSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJYWDA9IiwidmFyIGV4cG9ydHM7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IHtcbiAgZG9tRG9jOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHN1YmplY3QgJiYgc3ViamVjdC5ub2RlVHlwZSA9PT0gOTtcbiAgfSxcbiAgZG9tRWw6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gc3ViamVjdCAmJiBzdWJqZWN0Lm5vZGVUeXBlID09PSAxO1xuICB9LFxuICBkb21UZXh0OiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHN1YmplY3QgJiYgc3ViamVjdC5ub2RlVHlwZSA9PT0gMztcbiAgfSxcbiAgZG9tTm9kZTogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBleHBvcnRzLmRvbUVsKHN1YmplY3QpIHx8IGV4cG9ydHMuZG9tVGV4dChzdWJqZWN0KTtcbiAgfSxcbiAgZG9tVGV4dGFyZWE6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gc3ViamVjdCAmJiBzdWJqZWN0Lm5vZGVOYW1lID09PSAnVEVYVEFSRUEnO1xuICB9LFxuICBkb21JbnB1dDogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0ICYmIHN1YmplY3Qubm9kZU5hbWUgPT09ICdJTlBVVCc7XG4gIH0sXG4gIGRvbVNlbGVjdDogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0ICYmIHN1YmplY3Qubm9kZU5hbWUgPT09ICdTRUxFQ1QnO1xuICB9LFxuICBkb21GaWVsZDogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBleHBvcnRzLmRvbUlucHV0KHN1YmplY3QpIHx8IGV4cG9ydHMuZG9tVGV4dGFyZWEoc3ViamVjdCkgfHwgZXhwb3J0cy5kb21TZWxlY3Qoc3ViamVjdCk7XG4gIH1cbn07XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUl1TGk5dWIyUmxYMjF2WkhWc1pYTXZRR1JoYm1sbGJHdGhiR1Z1TDJsekwzTnlZeTlrYjIwdVkyOW1abVZsSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJleHBvcnRzLlJFR0VYX0xFTl9WQUwgPSAvXlxcZCsoPzpbYS16XXxcXCUpKyQvaTtcblxuZXhwb3J0cy5SRUdFWF9ESUdJVFMgPSAvXFxkKyQvO1xuXG5leHBvcnRzLlJFR0VYX1NQQUNFID0gL1xccy87XG5cbmV4cG9ydHMuUkVHRVhfS0VCQUIgPSAvKFtBLVpdKSsvZztcblxuZXhwb3J0cy5QT1NTSUJMRV9QUkVGSVhFUyA9IFsnd2Via2l0JywgJ21veicsICdtcycsICdvJ107XG5cbmV4cG9ydHMuUkVRVUlSRVNfVU5JVF9WQUxVRSA9IFsnYmFja2dyb3VuZC1wb3NpdGlvbi14JywgJ2JhY2tncm91bmQtcG9zaXRpb24teScsICdibG9jay1zaXplJywgJ2JvcmRlci13aWR0aCcsICdjb2x1bW5SdWxlLXdpZHRoJywgJ2N4JywgJ2N5JywgJ2ZvbnQtc2l6ZScsICdncmlkLWNvbHVtbi1nYXAnLCAnZ3JpZC1yb3ctZ2FwJywgJ2hlaWdodCcsICdpbmxpbmUtc2l6ZScsICdsaW5lLWhlaWdodCcsICdtaW5CbG9jay1zaXplJywgJ21pbi1oZWlnaHQnLCAnbWluLWlubGluZS1zaXplJywgJ21pbi13aWR0aCcsICdtYXgtaGVpZ2h0JywgJ21heC13aWR0aCcsICdvdXRsaW5lLW9mZnNldCcsICdvdXRsaW5lLXdpZHRoJywgJ3BlcnNwZWN0aXZlJywgJ3NoYXBlLW1hcmdpbicsICdzdHJva2UtZGFzaG9mZnNldCcsICdzdHJva2Utd2lkdGgnLCAndGV4dC1pbmRlbnQnLCAnd2lkdGgnLCAnd29yZC1zcGFjaW5nJywgJ3RvcCcsICdib3R0b20nLCAnbGVmdCcsICdyaWdodCcsICd4JywgJ3knXTtcblxuZXhwb3J0cy5RVUFEX1NIT1JUSEFORFMgPSBbJ21hcmdpbicsICdwYWRkaW5nJywgJ2JvcmRlcicsICdib3JkZXItcmFkaXVzJ107XG5cbmV4cG9ydHMuRElSRUNUSU9OUyA9IFsndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0J107XG5cbmV4cG9ydHMuUVVBRF9TSE9SVEhBTkRTLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgdmFyIGRpcmVjdGlvbiwgaSwgbGVuLCByZWY7XG4gIGV4cG9ydHMuUkVRVUlSRVNfVU5JVF9WQUxVRS5wdXNoKHByb3BlcnR5KTtcbiAgcmVmID0gZXhwb3J0cy5ESVJFQ1RJT05TO1xuICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBkaXJlY3Rpb24gPSByZWZbaV07XG4gICAgZXhwb3J0cy5SRVFVSVJFU19VTklUX1ZBTFVFLnB1c2gocHJvcGVydHkgKyAnLScgKyBkaXJlY3Rpb24pO1xuICB9XG59KTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdmNYVnBZMnRqYzNNdmMzSmpMMk52Ym5OMFlXNTBjeTVqYjJabVpXVWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXMTE5IiwiY29uc3RhbnRzID0gaW1wb3J0ICcuL2NvbnN0YW50cydcbnNhbXBsZVN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jykuc3R5bGVcblxuaGVscGVycyA9IGV4cG9ydHNcblxuaGVscGVycy5pbmNsdWRlcyA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0dGFyZ2V0IGFuZCB0YXJnZXQuaW5kZXhPZihpdGVtKSBpc250IC0xXG5cbmhlbHBlcnMuaXNJdGVyYWJsZSA9ICh0YXJnZXQpLT5cblx0dGFyZ2V0IGFuZFxuXHR0eXBlb2YgdGFyZ2V0IGlzICdvYmplY3QnIGFuZFxuXHR0eXBlb2YgdGFyZ2V0Lmxlbmd0aCBpcyAnbnVtYmVyJyBhbmRcblx0bm90IHRhcmdldC5ub2RlVHlwZVxuXG5oZWxwZXJzLnRvS2ViYWJDYXNlID0gKHN0cmluZyktPlxuXHRzdHJpbmcucmVwbGFjZSBjb25zdGFudHMuUkVHRVhfS0VCQUIsIChlLGxldHRlciktPiBcIi0je2xldHRlci50b0xvd2VyQ2FzZSgpfVwiXG5cbmhlbHBlcnMuaXNQcm9wU3VwcG9ydGVkID0gKHByb3BlcnR5KS0+XG5cdHR5cGVvZiBzYW1wbGVTdHlsZVtwcm9wZXJ0eV0gaXNudCAndW5kZWZpbmVkJ1xuXG5oZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQgPSAocHJvcGVydHksIHZhbHVlKS0+XG5cdGlmIHdpbmRvdy5DU1MgYW5kIHdpbmRvdy5DU1Muc3VwcG9ydHNcblx0XHRyZXR1cm4gd2luZG93LkNTUy5zdXBwb3J0cyhwcm9wZXJ0eSwgdmFsdWUpXG5cdGVsc2Vcblx0XHRzYW1wbGVTdHlsZVtwcm9wZXJ0eV0gPSB2YWx1ZVxuXHRcdHJldHVybiBzYW1wbGVTdHlsZVtwcm9wZXJ0eV0gaXMgJycrdmFsdWVcblxuaGVscGVycy5nZXRQcmVmaXggPSAocHJvcGVydHksIHNraXBJbml0aWFsQ2hlY2spLT5cblx0aWYgc2tpcEluaXRpYWxDaGVjayBvciBub3QgaGVscGVycy5pc1Byb3BTdXBwb3J0ZWQocHJvcGVydHkpXG5cdFx0Zm9yIHByZWZpeCBpbiBjb25zdGFudHMuUE9TU0lCTEVfUFJFRklYRVNcblx0XHRcdCMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblx0XHRcdHJldHVybiBcIi0je3ByZWZpeH0tXCIgaWYgaGVscGVycy5pc1Byb3BTdXBwb3J0ZWQoXCItI3twcmVmaXh9LSN7cHJvcGVydHl9XCIpXG5cdFxuXHRyZXR1cm4gJydcblxuaGVscGVycy5ub3JtYWxpemVQcm9wZXJ0eSA9IChwcm9wZXJ0eSktPlx0XG5cdHByb3BlcnR5ID0gaGVscGVycy50b0tlYmFiQ2FzZShwcm9wZXJ0eSlcblx0XG5cdGlmIGhlbHBlcnMuaXNQcm9wU3VwcG9ydGVkKHByb3BlcnR5KVxuXHRcdHJldHVybiBwcm9wZXJ0eVxuXHRlbHNlXG5cdFx0cmV0dXJuIFwiI3toZWxwZXJzLmdldFByZWZpeChwcm9wZXJ0eSx0cnVlKX0je3Byb3BlcnR5fVwiXG5cbmhlbHBlcnMubm9ybWFsaXplVmFsdWUgPSAocHJvcGVydHksIHZhbHVlKS0+XG5cdGlmIGhlbHBlcnMuaW5jbHVkZXMoY29uc3RhbnRzLlJFUVVJUkVTX1VOSVRfVkFMVUUsIHByb3BlcnR5KSBhbmQgdmFsdWUgaXNudCBudWxsXG5cdFx0dmFsdWUgPSAnJyt2YWx1ZVxuXHRcdGlmICBjb25zdGFudHMuUkVHRVhfRElHSVRTLnRlc3QodmFsdWUpIGFuZFxuXHRcdFx0bm90IGNvbnN0YW50cy5SRUdFWF9MRU5fVkFMLnRlc3QodmFsdWUpIGFuZFxuXHRcdFx0bm90IGNvbnN0YW50cy5SRUdFWF9TUEFDRS50ZXN0KHZhbHVlKVxuXHRcdFx0XHR2YWx1ZSArPSBpZiBwcm9wZXJ0eSBpcyAnbGluZS1oZWlnaHQnIHRoZW4gJ2VtJyBlbHNlICdweCdcblxuXHRyZXR1cm4gdmFsdWVcblxuXG5oZWxwZXJzLnNvcnQgPSAoYXJyYXkpLT5cblx0aWYgYXJyYXkubGVuZ3RoIDwgMlxuXHRcdHJldHVybiBhcnJheVxuXHRlbHNlXG5cdFx0cGl2b3QgPSBhcnJheVswXTsgbGVzcyA9IFtdOyBncmVhdCA9IFtdOyBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPSAwO1xuXHRcdFxuXHRcdHdoaWxlICsraSBpc250IGxlblxuXHRcdFx0aWYgYXJyYXlbaV0gPD0gcGl2b3Rcblx0XHRcdFx0bGVzcy5wdXNoKGFycmF5W2ldKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRncmVhdC5wdXNoKGFycmF5W2ldKVxuXG5cdFx0cmV0dXJuIGhlbHBlcnMuc29ydChsZXNzKS5jb25jYXQocGl2b3QsIGhlbHBlcnMuc29ydChncmVhdCkpXG5cblxuaGVscGVycy5oYXNoID0gKHN0cmluZyktPlxuXHRoYXNoID0gNTM4MTsgaSA9IC0xOyBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG5cdFxuXHR3aGlsZSArK2kgaXNudCBzdHJpbmcubGVuZ3RoXG5cdFx0aGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgc3RyaW5nLmNoYXJDb2RlQXQoaSlcblx0XHRoYXNoIHw9IDBcblxuXHRyZXR1cm4gJ18nKyhpZiBoYXNoIDwgMCB0aGVuIGhhc2ggKiAtMiBlbHNlIGhhc2gpXG5cblxuaGVscGVycy5ydWxlVG9TdHJpbmcgPSAocnVsZSktPlxuXHRvdXRwdXQgPSAnJ1xuXHRwcm9wcyA9IGhlbHBlcnMuc29ydChPYmplY3Qua2V5cyhydWxlKSlcblx0XG5cdGZvciBwcm9wIGluIHByb3BzXG5cdFx0aWYgdHlwZW9mIHJ1bGVbcHJvcF0gaXMgJ3N0cmluZycgb3IgdHlwZW9mIHJ1bGVbcHJvcF0gaXMgJ251bWJlcidcblx0XHRcdHByb3BlcnR5ID0gaGVscGVycy5ub3JtYWxpemVQcm9wZXJ0eShwcm9wKVxuXHRcdFx0dmFsdWUgPSBoZWxwZXJzLm5vcm1hbGl6ZVZhbHVlKHByb3BlcnR5LCBydWxlW3Byb3BdKVxuXHRcdFx0b3V0cHV0ICs9IFwiI3twcm9wZXJ0eX06I3t2YWx1ZX07XCJcblx0XG5cdHJldHVybiBvdXRwdXRcblxuaGVscGVycy5pbmxpbmVTdHlsZUNvbmZpZyA9IHN0eWxlQ29uZmlnID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuaGVscGVycy5pbmxpbmVTdHlsZSA9IChydWxlLCB2YWx1ZVRvU3RvcmUsIGxldmVsKS0+XG5cdGlmIG5vdCBjb25maWc9c3R5bGVDb25maWdbbGV2ZWxdXG5cdFx0c3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcblx0XHRzdHlsZUVsLmlkID0gXCJxdWlja2NzcyN7bGV2ZWwgb3IgJyd9XCJcblx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpXG5cdFx0c3R5bGVDb25maWdbbGV2ZWxdID0gY29uZmlnID0gZWw6c3R5bGVFbCwgY29udGVudDonJywgY2FjaGU6T2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcblx0dW5sZXNzIGNvbmZpZy5jYWNoZVtydWxlXVxuXHRcdGNvbmZpZy5jYWNoZVtydWxlXSA9IHZhbHVlVG9TdG9yZSBvciB0cnVlXG5cdFx0Y29uZmlnLmVsLnRleHRDb250ZW50ID0gY29uZmlnLmNvbnRlbnQgKz0gcnVsZVxuXHRcblx0cmV0dXJuXG5cblxuaGVscGVycy5jbGVhcklubGluZVN0eWxlID0gKGxldmVsKS0+IGlmIGNvbmZpZyA9IHN0eWxlQ29uZmlnW2xldmVsXVxuXHRyZXR1cm4gaWYgbm90IGNvbmZpZy5jb250ZW50XG5cdGNvbmZpZy5lbC50ZXh0Q29udGVudCA9IGNvbmZpZy5jb250ZW50ID0gJydcblx0a2V5cyA9IE9iamVjdC5rZXlzKGNvbmZpZy5jYWNoZSlcblx0Y29uZmlnLmNhY2hlW2tleV0gPSBudWxsIGZvciBrZXkgaW4ga2V5c1xuXHRyZXR1cm5cblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuU1ZHID0gaW1wb3J0ICcuLi8uLi9zdmcnXG5oZWxwZXJzID0gaW1wb3J0ICcuLi8uLi9oZWxwZXJzJ1xuXG5leHBvcnQgZGVmYXVsdCBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2Ryb3Bkb3duJ1xuXHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHR6SW5kZXg6IDEwXG5cdFx0XHRvdmVyZmxvdzogJ2hpZGRlbidcblx0XHRcdHRvcDogKGRyb3Bkb3duKS0+IGlmIGRyb3Bkb3duLmZpZWxkLnR5cGUgaXMgJ3RleHQnIHRoZW4gQHBhcmVudC5yYXcuc3R5bGUuaGVpZ2h0IGVsc2UgJy03cHgnXG5cdFx0XHRsZWZ0OiAoKS0+IGlmIEBwYXJlbnQucmVjdC5sZWZ0IC0gNSA8IDAgdGhlbiAwIGVsc2UgLTVcblx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0IyBiYWNrZ3JvdW5kQ29sb3I6IGhlbHBlcnMuaGV4VG9SR0JBKCdmNmY2ZjYnLCAwLjkpXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjZjZmNmY2J1xuXHRcdFx0Ym94U2hhZG93OiBcIjBweCA2cHggMTBweCAje2hlbHBlcnMuaGV4VG9SR0JBKCcwMDAwMDAnLCAwLjMyKX1cIlxuXHRcdFx0Ym9yZGVyV2lkdGg6ICcxcHgnXG5cdFx0XHRib3JkZXJTdHlsZTogJ3NvbGlkJ1xuXHRcdFx0Ym9yZGVyQ29sb3I6ICcjZDFkMWQxJ1xuXHRcdFx0Ym9yZGVyUmFkaXVzOiAnNXB4J1xuXHRcdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCdcblx0XHRcdHBhZGRpbmc6ICc0cHggMCdcblx0XHRcdCRpc09wZW46ICRoYXNWaXNpYmxlQ2hvaWNlczpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRdXG4pXG5cbmV4cG9ydCBsaXN0ID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdsaXN0J1xuXHRcdHBhc3NTdGF0ZVRvQ2hpbGRyZW46IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0b3ZlcmZsb3c6ICdzY3JvbGwnXG5cdFx0XHRvdmVyZmxvd1Njcm9sbGluZzogJ3RvdWNoJ1xuXHRcdFx0b3ZlcmZsb3dTdHlsZTogJy1tcy1hdXRvaGlkaW5nLXNjcm9sbGJhcidcblx0XVxuKVxuXG5leHBvcnQgY2hvaWNlID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRzdHlsZTpcblx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0Zm9udFNpemU6ICcwJ1xuXHRcdFx0Y29sb3I6ICcjMDAwMDAwJ1xuXHRcdFx0dXNlclNlbGVjdDogJ25vbmUnXG5cdFx0XHRsaW5lSGVpZ2h0OiAnMWVtJ1xuXHRcdFx0Y3Vyc29yOiAncG9pbnRlcidcblx0XHRcdCR2aXNpYmxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHQkdW5hdmFpbGFibGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0JGhvdmVyOlxuXHRcdFx0XHRjb2xvcjogJyNmZmZmZmYnXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJyM0Qzk2RkYnXG5cblx0XHRbJ2RpdicgIyBDaGVja21hcmtcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuXHRcdFx0XHR2ZXJ0aWNhbEFsaWduOid0b3AnXG5cdFx0XHRcdHdpZHRoOiAnMjBweCdcblx0XHRcdFx0IyBoZWlnaHQ6ICgpLT4gQHBhcmVudC5yYXcuc3R5bGUuaGVpZ2h0XG5cdFx0XHRcdCMgbGluZUhlaWdodDogKCktPiBAcGFyZW50LnN0eWxlKCdoZWlnaHQnKVxuXHRcdFx0XHQjIGZvbnRTaXplOiAoKS0+IEBwYXJlbnQuc3R5bGUoJ2hlaWdodCcpXG5cdFx0XHRcdGxpbmVIZWlnaHQ6ICcyMHB4J1xuXHRcdFx0XHRmb250U2l6ZTogJzEzcHgnXG5cdFx0XHRcdHRleHRBbGlnbjogJ2NlbnRlcidcblx0XHRcdFx0Y29sb3I6ICdpbmhlcml0J1xuXHRcdFx0XHRzdHJva2U6ICdjdXJyZW50Q29sb3InXG5cdFx0XHRcdHZpc2liaWxpdHk6ICdoaWRkZW4nXG5cdFx0XHRcdCRzZWxlY3RlZDpcblx0XHRcdFx0XHR2aXNpYmlsaXR5OiAndmlzaWJsZSdcblxuXHRcdFx0U1ZHLmNoZWNrbWFya1xuXHRcdF1cblx0XHRcblx0XHRbJ2RpdicgIyBUZXh0XG5cdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblx0XHRcdFx0b3ZlcmZsb3c6ICdoaWRkZW4nXG5cdFx0XHRcdHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJ1xuXHRcdFx0XHR3aGl0ZVNwYWNlOiAnbm93cmFwJ1xuXHRcdFx0XHR3b3JkV3JhcDogJ25vcm1hbCdcblx0XHRcdFx0bWF4V2lkdGg6ICgpLT4gXCJjYWxjKDEwMCUgLSAje0BwcmV2LnN0eWxlU2FmZSAnd2lkdGgnLCB0cnVlfSlcIlxuXHRcdFx0XHRwYWRkaW5nUmlnaHQ6ICcxMHB4J1xuXHRcdFx0XHRsaW5lSGVpZ2h0OiAnMjBweCdcblx0XHRcdFx0Zm9udFNpemU6ICcxMXB4J1xuXHRcdFx0XHRmb250RmFtaWx5OiAoZHJvcGRvd24pLT4gZHJvcGRvd24uc2V0dGluZ3MuZm9udEZhbWlseVxuXHRcdFx0XHRjb2xvcjogJ2luaGVyaXQnXG5cdFx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XVxuXHRdXG4pXG5cbmV4cG9ydCBzY3JvbGxJbmRpY2F0b3JVcCA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnc2Nyb2xsSW5kaWNhdG9yVXAnXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0dG9wOiAwXG5cdFx0XHRsZWZ0OiAwXG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzIwcHgnXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjZjZmNmY2J1xuXHRcdFx0Y29sb3I6ICcjMDAwMDAwJ1xuXHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJ1xuXHRcdFx0JHZpc2libGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblxuXHRcdFsnZGl2J1xuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdHRvcDogJzUwJSdcblx0XHRcdFx0bGVmdDogMFxuXHRcdFx0XHRyaWdodDogMFxuXHRcdFx0XHR3aWR0aDogJzE1cHgnXG5cdFx0XHRcdGhlaWdodDogJzE1cHgnXG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRcdFx0bWFyZ2luOiAnMCBhdXRvJ1xuXHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJ1xuXHRcblx0XHRcdFNWRy5jYXJldFVwXG5cdFx0XVxuXHRdXG4pXG5cbmV4cG9ydCBzY3JvbGxJbmRpY2F0b3JEb3duID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdzY3JvbGxJbmRpY2F0b3JEb3duJ1xuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdGJvdHRvbTogMFxuXHRcdFx0bGVmdDogMFxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcyMHB4J1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAnI2Y2ZjZmNidcblx0XHRcdGNvbG9yOiAnIzAwMDAwMCdcblx0XHRcdHRleHRBbGlnbjogJ2NlbnRlcidcblx0XHRcdCR2aXNpYmxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cblx0XHRbJ2Rpdidcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHR0b3A6ICc1MCUnXG5cdFx0XHRcdGxlZnQ6IDBcblx0XHRcdFx0cmlnaHQ6IDBcblx0XHRcdFx0d2lkdGg6ICcxNXB4J1xuXHRcdFx0XHRoZWlnaHQ6ICcxNXB4J1xuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHRcdG1hcmdpbjogJzAgYXV0bydcblx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKSdcblxuXHRcdFx0U1ZHLmNhcmV0RG93blxuXHRcdF1cblx0XVxuKVxuXG5leHBvcnQgaGVscCA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnaGVscCdcblx0XHRzdHlsZTpcblx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0Ym9yZGVyVG9wOiAnMnB4IHNvbGlkIHJnYmEoMCwwLDAsMC4wNSknXG5cdFx0XHRwYWRkaW5nOiAnNHB4IDEycHggMXB4J1xuXHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLDAuNSknXG5cdFx0XHRmb250V2VpZ2h0OiAnNTAwJ1xuXHRcdFx0Zm9udFNpemU6ICcxMXB4J1xuXHRcdFx0dXNlclNlbGVjdDogJ25vbmUnXG5cdFx0XHQkc2hvd0hlbHA6XG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XVxuKVxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBtYXhIZWlnaHQ6IDMwMCxcbiAgbXVsdGlwbGU6IGZhbHNlLFxuICBsb2NrU2Nyb2xsOiB0cnVlLFxuICB0eXBlQnVmZmVyOiBmYWxzZSxcbiAgaGVscDogJycsXG4gIHRlbXBsYXRlczoge31cbn07XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUpqYjIxd2IyNWxiblJ6TDJSeWIzQmtiM2R1TDJSbFptRjFiSFJ6TG1OdlptWmxaU0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiWFgwPSIsIiFmdW5jdGlvbihlLHIpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXIoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLHIpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMudGV4dE1hc2tDb3JlPXIoKTplLnRleHRNYXNrQ29yZT1yKCl9KHRoaXMsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcihuKXtpZih0W25dKXJldHVybiB0W25dLmV4cG9ydHM7dmFyIG89dFtuXT17ZXhwb3J0czp7fSxpZDpuLGxvYWRlZDohMX07cmV0dXJuIGVbbl0uY2FsbChvLmV4cG9ydHMsbyxvLmV4cG9ydHMsciksby5sb2FkZWQ9ITAsby5leHBvcnRzfXZhciB0PXt9O3JldHVybiByLm09ZSxyLmM9dCxyLnA9XCJcIixyKDApfShbZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntkZWZhdWx0OmV9fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBvPXQoMyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJjb25mb3JtVG9NYXNrXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG4obykuZGVmYXVsdH19KTt2YXIgaT10KDIpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiYWRqdXN0Q2FyZXRQb3NpdGlvblwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBuKGkpLmRlZmF1bHR9fSk7dmFyIGE9dCg1KTtPYmplY3QuZGVmaW5lUHJvcGVydHkocixcImNyZWF0ZVRleHRNYXNrSW5wdXRFbGVtZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG4oYSkuZGVmYXVsdH19KX0sZnVuY3Rpb24oZSxyKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkocixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxyLnBsYWNlaG9sZGVyQ2hhcj1cIl9cIn0sZnVuY3Rpb24oZSxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KGUpe3ZhciByPWUucHJldmlvdXNDb25mb3JtZWRWYWx1ZSx0PXZvaWQgMD09PXI/bzpyLGk9ZS5wcmV2aW91c1BsYWNlaG9sZGVyLGE9dm9pZCAwPT09aT9vOmksdT1lLmN1cnJlbnRDYXJldFBvc2l0aW9uLGw9dm9pZCAwPT09dT8wOnUscz1lLmNvbmZvcm1lZFZhbHVlLGY9ZS5yYXdWYWx1ZSxkPWUucGxhY2Vob2xkZXJDaGFyLGM9ZS5wbGFjZWhvbGRlcix2PWUuaW5kZXhlc09mUGlwZWRDaGFycyxwPXZvaWQgMD09PXY/bjp2LGg9ZS5jYXJldFRyYXBJbmRleGVzLGc9dm9pZCAwPT09aD9uOmg7aWYoMD09PWwpcmV0dXJuIDA7dmFyIG09Zi5sZW5ndGgseT10Lmxlbmd0aCxiPWMubGVuZ3RoLEM9cy5sZW5ndGgsUD1tLXkseD1QPjAsTz0wPT09eSxrPVA+MSYmIXgmJiFPO2lmKGspcmV0dXJuIGw7dmFyIGo9eCYmKHQ9PT1zfHxzPT09YyksTT0wLFQ9dm9pZCAwLHc9dm9pZCAwO2lmKGopTT1sLVA7ZWxzZXt2YXIgXz1zLnRvTG93ZXJDYXNlKCksVj1mLnRvTG93ZXJDYXNlKCksUz1WLnN1YnN0cigwLGwpLnNwbGl0KG8pLE49Uy5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIF8uaW5kZXhPZihlKSE9PS0xfSk7dz1OW04ubGVuZ3RoLTFdO3ZhciBFPWEuc3Vic3RyKDAsTi5sZW5ndGgpLnNwbGl0KG8pLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZSE9PWR9KS5sZW5ndGgsQT1jLnN1YnN0cigwLE4ubGVuZ3RoKS5zcGxpdChvKS5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIGUhPT1kfSkubGVuZ3RoLFI9QSE9PUUsST12b2lkIDAhPT1hW04ubGVuZ3RoLTFdJiZ2b2lkIDAhPT1jW04ubGVuZ3RoLTJdJiZhW04ubGVuZ3RoLTFdIT09ZCYmYVtOLmxlbmd0aC0xXSE9PWNbTi5sZW5ndGgtMV0mJmFbTi5sZW5ndGgtMV09PT1jW04ubGVuZ3RoLTJdOyF4JiYoUnx8SSkmJkU+MCYmYy5pbmRleE9mKHcpPi0xJiZ2b2lkIDAhPT1mW2xdJiYoVD0hMCx3PWZbbF0pO2Zvcih2YXIgSj1wLm1hcChmdW5jdGlvbihlKXtyZXR1cm4gX1tlXX0pLHE9Si5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIGU9PT13fSkubGVuZ3RoLEY9Ti5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIGU9PT13fSkubGVuZ3RoLEw9Yy5zdWJzdHIoMCxjLmluZGV4T2YoZCkpLnNwbGl0KG8pLmZpbHRlcihmdW5jdGlvbihlLHIpe3JldHVybiBlPT09dyYmZltyXSE9PWV9KS5sZW5ndGgsVz1MK0YrcSsoVD8xOjApLHo9MCxCPTA7QjxDO0IrKyl7dmFyIEQ9X1tCXTtpZihNPUIrMSxEPT09dyYmeisrLHo+PVcpYnJlYWt9fWlmKHgpe2Zvcih2YXIgRz1NLEg9TTtIPD1iO0grKylpZihjW0hdPT09ZCYmKEc9SCksY1tIXT09PWR8fGcuaW5kZXhPZihIKSE9PS0xfHxIPT09YilyZXR1cm4gR31lbHNlIGlmKFQpe2Zvcih2YXIgSz1NLTE7Sz49MDtLLS0paWYoc1tLXT09PXd8fGcuaW5kZXhPZihLKSE9PS0xfHwwPT09SylyZXR1cm4gS31lbHNlIGZvcih2YXIgUT1NO1E+PTA7US0tKWlmKGNbUS0xXT09PWR8fGcuaW5kZXhPZihRKSE9PS0xfHwwPT09USlyZXR1cm4gUX1PYmplY3QuZGVmaW5lUHJvcGVydHkocixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxyLmRlZmF1bHQ9dDt2YXIgbj1bXSxvPVwiXCJ9LGZ1bmN0aW9uKGUscix0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOmEscj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06YSx0PWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXTp7fSxuPXQuZ3VpZGUsdT12b2lkIDA9PT1ufHxuLGw9dC5wcmV2aW91c0NvbmZvcm1lZFZhbHVlLHM9dm9pZCAwPT09bD9hOmwsZj10LnBsYWNlaG9sZGVyQ2hhcixkPXZvaWQgMD09PWY/aS5wbGFjZWhvbGRlckNoYXI6ZixjPXQucGxhY2Vob2xkZXIsdj12b2lkIDA9PT1jPygwLG8uY29udmVydE1hc2tUb1BsYWNlaG9sZGVyKShyLGQpOmMscD10LmN1cnJlbnRDYXJldFBvc2l0aW9uLGg9dC5rZWVwQ2hhclBvc2l0aW9ucyxnPXU9PT0hMSYmdm9pZCAwIT09cyxtPWUubGVuZ3RoLHk9cy5sZW5ndGgsYj12Lmxlbmd0aCxDPXIubGVuZ3RoLFA9bS15LHg9UD4wLE89cCsoeD8tUDowKSxrPU8rTWF0aC5hYnMoUCk7aWYoaD09PSEwJiYheCl7Zm9yKHZhciBqPWEsTT1PO008aztNKyspdltNXT09PWQmJihqKz1kKTtlPWUuc2xpY2UoMCxPKStqK2Uuc2xpY2UoTyxtKX1mb3IodmFyIFQ9ZS5zcGxpdChhKS5tYXAoZnVuY3Rpb24oZSxyKXtyZXR1cm57Y2hhcjplLGlzTmV3OnI+PU8mJnI8a319KSx3PW0tMTt3Pj0wO3ctLSl7dmFyIF89VFt3XS5jaGFyO2lmKF8hPT1kKXt2YXIgVj13Pj1PJiZ5PT09QztfPT09dltWP3ctUDp3XSYmVC5zcGxpY2UodywxKX19dmFyIFM9YSxOPSExO2U6Zm9yKHZhciBFPTA7RTxiO0UrKyl7dmFyIEE9dltFXTtpZihBPT09ZCl7aWYoVC5sZW5ndGg+MClmb3IoO1QubGVuZ3RoPjA7KXt2YXIgUj1ULnNoaWZ0KCksST1SLmNoYXIsSj1SLmlzTmV3O2lmKEk9PT1kJiZnIT09ITApe1MrPWQ7Y29udGludWUgZX1pZihyW0VdLnRlc3QoSSkpe2lmKGg9PT0hMCYmSiE9PSExJiZzIT09YSYmdSE9PSExJiZ4KXtmb3IodmFyIHE9VC5sZW5ndGgsRj1udWxsLEw9MDtMPHE7TCsrKXt2YXIgVz1UW0xdO2lmKFcuY2hhciE9PWQmJlcuaXNOZXc9PT0hMSlicmVhaztpZihXLmNoYXI9PT1kKXtGPUw7YnJlYWt9fW51bGwhPT1GPyhTKz1JLFQuc3BsaWNlKEYsMSkpOkUtLX1lbHNlIFMrPUk7Y29udGludWUgZX1OPSEwfWc9PT0hMSYmKFMrPXYuc3Vic3RyKEUsYikpO2JyZWFrfVMrPUF9aWYoZyYmeD09PSExKXtmb3IodmFyIHo9bnVsbCxCPTA7QjxTLmxlbmd0aDtCKyspdltCXT09PWQmJih6PUIpO1M9bnVsbCE9PXo/Uy5zdWJzdHIoMCx6KzEpOmF9cmV0dXJue2NvbmZvcm1lZFZhbHVlOlMsbWV0YTp7c29tZUNoYXJzUmVqZWN0ZWQ6Tn19fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHIuZGVmYXVsdD1uO3ZhciBvPXQoNCksaT10KDEpLGE9XCJcIn0sZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06bCxyPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTp1LnBsYWNlaG9sZGVyQ2hhcjtpZihlLmluZGV4T2YocikhPT0tMSl0aHJvdyBuZXcgRXJyb3IoXCJQbGFjZWhvbGRlciBjaGFyYWN0ZXIgbXVzdCBub3QgYmUgdXNlZCBhcyBwYXJ0IG9mIHRoZSBtYXNrLiBQbGVhc2Ugc3BlY2lmeSBhIGNoYXJhY3RlciB0aGF0IGlzIG5vdCBwcmVzZW50IGluIHlvdXIgbWFzayBhcyB5b3VyIHBsYWNlaG9sZGVyIGNoYXJhY3Rlci5cXG5cXG5cIisoXCJUaGUgcGxhY2Vob2xkZXIgY2hhcmFjdGVyIHRoYXQgd2FzIHJlY2VpdmVkIGlzOiBcIitKU09OLnN0cmluZ2lmeShyKStcIlxcblxcblwiKSsoXCJUaGUgbWFzayB0aGF0IHdhcyByZWNlaXZlZCBpczogXCIrSlNPTi5zdHJpbmdpZnkoZSkpKTtyZXR1cm4gZS5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuIGUgaW5zdGFuY2VvZiBSZWdFeHA/cjplfSkuam9pbihcIlwiKX1mdW5jdGlvbiBvKGUpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBlfHxlIGluc3RhbmNlb2YgU3RyaW5nfWZ1bmN0aW9uIGkoZSl7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIGUmJnZvaWQgMD09PWUubGVuZ3RoJiYhaXNOYU4oZSl9ZnVuY3Rpb24gYShlKXtmb3IodmFyIHI9W10sdD12b2lkIDA7dD1lLmluZGV4T2YocyksdCE9PS0xOylyLnB1c2godCksZS5zcGxpY2UodCwxKTtyZXR1cm57bWFza1dpdGhvdXRDYXJldFRyYXBzOmUsaW5kZXhlczpyfX1PYmplY3QuZGVmaW5lUHJvcGVydHkocixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxyLmNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcj1uLHIuaXNTdHJpbmc9byxyLmlzTnVtYmVyPWksci5wcm9jZXNzQ2FyZXRUcmFwcz1hO3ZhciB1PXQoMSksbD1bXSxzPVwiW11cIn0sZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntkZWZhdWx0OmV9fWZ1bmN0aW9uIG8oZSl7dmFyIHI9e3ByZXZpb3VzQ29uZm9ybWVkVmFsdWU6dm9pZCAwLHByZXZpb3VzUGxhY2Vob2xkZXI6dm9pZCAwfTtyZXR1cm57c3RhdGU6cix1cGRhdGU6ZnVuY3Rpb24odCl7dmFyIG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOmUsbz1uLmlucHV0RWxlbWVudCxzPW4ubWFzayxkPW4uZ3VpZGUsbT1uLnBpcGUsYj1uLnBsYWNlaG9sZGVyQ2hhcixDPXZvaWQgMD09PWI/cC5wbGFjZWhvbGRlckNoYXI6YixQPW4ua2VlcENoYXJQb3NpdGlvbnMseD12b2lkIDAhPT1QJiZQLE89bi5zaG93TWFzayxrPXZvaWQgMCE9PU8mJk87aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQmJih0PW8udmFsdWUpLHQhPT1yLnByZXZpb3VzQ29uZm9ybWVkVmFsdWUpeyhcInVuZGVmaW5lZFwiPT10eXBlb2Ygcz9cInVuZGVmaW5lZFwiOmwocykpPT09eSYmdm9pZCAwIT09cy5waXBlJiZ2b2lkIDAhPT1zLm1hc2smJihtPXMucGlwZSxzPXMubWFzayk7dmFyIGo9dm9pZCAwLE09dm9pZCAwO2lmKHMgaW5zdGFuY2VvZiBBcnJheSYmKGo9KDAsdi5jb252ZXJ0TWFza1RvUGxhY2Vob2xkZXIpKHMsQykpLHMhPT0hMSl7dmFyIFQ9YSh0KSx3PW8uc2VsZWN0aW9uRW5kLF89ci5wcmV2aW91c0NvbmZvcm1lZFZhbHVlLFY9ci5wcmV2aW91c1BsYWNlaG9sZGVyLFM9dm9pZCAwO2lmKChcInVuZGVmaW5lZFwiPT10eXBlb2Ygcz9cInVuZGVmaW5lZFwiOmwocykpPT09aCl7aWYoTT1zKFQse2N1cnJlbnRDYXJldFBvc2l0aW9uOncscHJldmlvdXNDb25mb3JtZWRWYWx1ZTpfLHBsYWNlaG9sZGVyQ2hhcjpDfSksTT09PSExKXJldHVybjt2YXIgTj0oMCx2LnByb2Nlc3NDYXJldFRyYXBzKShNKSxFPU4ubWFza1dpdGhvdXRDYXJldFRyYXBzLEE9Ti5pbmRleGVzO009RSxTPUEsaj0oMCx2LmNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcikoTSxDKX1lbHNlIE09czt2YXIgUj17cHJldmlvdXNDb25mb3JtZWRWYWx1ZTpfLGd1aWRlOmQscGxhY2Vob2xkZXJDaGFyOkMscGlwZTptLHBsYWNlaG9sZGVyOmosY3VycmVudENhcmV0UG9zaXRpb246dyxrZWVwQ2hhclBvc2l0aW9uczp4fSxJPSgwLGMuZGVmYXVsdCkoVCxNLFIpLEo9SS5jb25mb3JtZWRWYWx1ZSxxPShcInVuZGVmaW5lZFwiPT10eXBlb2YgbT9cInVuZGVmaW5lZFwiOmwobSkpPT09aCxGPXt9O3EmJihGPW0oSix1KHtyYXdWYWx1ZTpUfSxSKSksRj09PSExP0Y9e3ZhbHVlOl8scmVqZWN0ZWQ6ITB9OigwLHYuaXNTdHJpbmcpKEYpJiYoRj17dmFsdWU6Rn0pKTt2YXIgTD1xP0YudmFsdWU6SixXPSgwLGYuZGVmYXVsdCkoe3ByZXZpb3VzQ29uZm9ybWVkVmFsdWU6XyxwcmV2aW91c1BsYWNlaG9sZGVyOlYsY29uZm9ybWVkVmFsdWU6TCxwbGFjZWhvbGRlcjpqLHJhd1ZhbHVlOlQsY3VycmVudENhcmV0UG9zaXRpb246dyxwbGFjZWhvbGRlckNoYXI6QyxpbmRleGVzT2ZQaXBlZENoYXJzOkYuaW5kZXhlc09mUGlwZWRDaGFycyxjYXJldFRyYXBJbmRleGVzOlN9KSx6PUw9PT1qJiYwPT09VyxCPWs/ajpnLEQ9ej9COkw7ci5wcmV2aW91c0NvbmZvcm1lZFZhbHVlPUQsci5wcmV2aW91c1BsYWNlaG9sZGVyPWosby52YWx1ZSE9PUQmJihvLnZhbHVlPUQsaShvLFcpKX19fX19ZnVuY3Rpb24gaShlLHIpe2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ9PT1lJiYoYj9DKGZ1bmN0aW9uKCl7cmV0dXJuIGUuc2V0U2VsZWN0aW9uUmFuZ2UocixyLG0pfSwwKTplLnNldFNlbGVjdGlvblJhbmdlKHIscixtKSl9ZnVuY3Rpb24gYShlKXtpZigoMCx2LmlzU3RyaW5nKShlKSlyZXR1cm4gZTtpZigoMCx2LmlzTnVtYmVyKShlKSlyZXR1cm4gU3RyaW5nKGUpO2lmKHZvaWQgMD09PWV8fG51bGw9PT1lKXJldHVybiBnO3Rocm93IG5ldyBFcnJvcihcIlRoZSAndmFsdWUnIHByb3ZpZGVkIHRvIFRleHQgTWFzayBuZWVkcyB0byBiZSBhIHN0cmluZyBvciBhIG51bWJlci4gVGhlIHZhbHVlIHJlY2VpdmVkIHdhczpcXG5cXG4gXCIrSlNPTi5zdHJpbmdpZnkoZSkpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciB1PU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKGUpe2Zvcih2YXIgcj0xO3I8YXJndW1lbnRzLmxlbmd0aDtyKyspe3ZhciB0PWFyZ3VtZW50c1tyXTtmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSl9cmV0dXJuIGV9LGw9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX07ci5kZWZhdWx0PW87dmFyIHM9dCgyKSxmPW4ocyksZD10KDMpLGM9bihkKSx2PXQoNCkscD10KDEpLGg9XCJmdW5jdGlvblwiLGc9XCJcIixtPVwibm9uZVwiLHk9XCJvYmplY3RcIixiPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBuYXZpZ2F0b3ImJi9BbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxDPVwidW5kZWZpbmVkXCIhPXR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWU/cmVxdWVzdEFuaW1hdGlvbkZyYW1lOnNldFRpbWVvdXR9XSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12ZEdWNGRDMXRZWE5yTFdOdmNtVXZaR2x6ZEM5MFpYaDBUV0Z6YTBOdmNtVXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2VzExOSIsIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXQoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLHQpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMudGV4dE1hc2tBZGRvbnM9dCgpOmUudGV4dE1hc2tBZGRvbnM9dCgpfSh0aGlzLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQocil7aWYobltyXSlyZXR1cm4gbltyXS5leHBvcnRzO3ZhciBvPW5bcl09e2V4cG9ydHM6e30saWQ6cixsb2FkZWQ6ITF9O3JldHVybiBlW3JdLmNhbGwoby5leHBvcnRzLG8sby5leHBvcnRzLHQpLG8ubG9hZGVkPSEwLG8uZXhwb3J0c312YXIgbj17fTtyZXR1cm4gdC5tPWUsdC5jPW4sdC5wPVwiXCIsdCgwKX0oW2Z1bmN0aW9uKGUsdCxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKGUpe3JldHVybiBlJiZlLl9fZXNNb2R1bGU/ZTp7ZGVmYXVsdDplfX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbz1uKDEpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiY3JlYXRlQXV0b0NvcnJlY3RlZERhdGVQaXBlXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHIobykuZGVmYXVsdH19KTt2YXIgaT1uKDIpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiY3JlYXRlTnVtYmVyTWFza1wiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiByKGkpLmRlZmF1bHR9fSk7dmFyIHU9bigzKTtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcImVtYWlsTWFza1wiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiByKHUpLmRlZmF1bHR9fSl9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpcIm1tIGRkIHl5eXlcIjtyZXR1cm4gZnVuY3Rpb24odCl7dmFyIG49W10scj1lLnNwbGl0KC9bXmRteV0rLyksbz17ZGQ6MzEsbW06MTIseXk6OTkseXl5eTo5OTk5fSxpPXtkZDoxLG1tOjEseXk6MCx5eXl5OjF9LHU9dC5zcGxpdChcIlwiKTtyLmZvckVhY2goZnVuY3Rpb24odCl7dmFyIHI9ZS5pbmRleE9mKHQpLGk9cGFyc2VJbnQob1t0XS50b1N0cmluZygpLnN1YnN0cigwLDEpLDEwKTtwYXJzZUludCh1W3JdLDEwKT5pJiYodVtyKzFdPXVbcl0sdVtyXT0wLG4ucHVzaChyKSl9KTt2YXIgYz1yLnNvbWUoZnVuY3Rpb24obil7dmFyIHI9ZS5pbmRleE9mKG4pLHU9bi5sZW5ndGgsYz10LnN1YnN0cihyLHUpLnJlcGxhY2UoL1xcRC9nLFwiXCIpLGw9cGFyc2VJbnQoYywxMCk7cmV0dXJuIGw+b1tuXXx8Yy5sZW5ndGg9PT11JiZsPGlbbl19KTtyZXR1cm4hYyYme3ZhbHVlOnUuam9pbihcIlwiKSxpbmRleGVzT2ZQaXBlZENoYXJzOm59fX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0LmRlZmF1bHQ9bn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKCl7ZnVuY3Rpb24gZSgpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpjLHQ9ZS5sZW5ndGg7aWYoZT09PWN8fGVbMF09PT1oWzBdJiYxPT09dClyZXR1cm4gaC5zcGxpdChjKS5jb25jYXQoW3ZdKS5jb25jYXQobS5zcGxpdChjKSk7aWYoZT09PVMmJk0pcmV0dXJuIGguc3BsaXQoYykuY29uY2F0KFtcIjBcIixTLHZdKS5jb25jYXQobS5zcGxpdChjKSk7dmFyIG49ZS5sYXN0SW5kZXhPZihTKSx1PW4hPT0tMSxsPWVbMF09PT1zJiZJLGE9dm9pZCAwLGc9dm9pZCAwLGI9dm9pZCAwO2lmKGUuc2xpY2UoViotMSk9PT1tJiYoZT1lLnNsaWNlKDAsViotMSkpLHUmJihNfHxEKT8oYT1lLnNsaWNlKGUuc2xpY2UoMCwkKT09PWg/JDowLG4pLGc9ZS5zbGljZShuKzEsdCksZz1yKGcucmVwbGFjZShmLGMpKSk6YT1lLnNsaWNlKDAsJCk9PT1oP2Uuc2xpY2UoJCk6ZSxOJiYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIE4/XCJ1bmRlZmluZWRcIjppKE4pKT09PXApe3ZhciBPPVwiLlwiPT09Xz9cIlsuXVwiOlwiXCIrXyxqPShhLm1hdGNoKG5ldyBSZWdFeHAoTyxcImdcIikpfHxbXSkubGVuZ3RoO2E9YS5zbGljZSgwLE4raipxKX1yZXR1cm4gYT1hLnJlcGxhY2UoZixjKSxBfHwoYT1hLnJlcGxhY2UoL14wKygwJHxbXjBdKS8sXCIkMVwiKSksYT14P28oYSxfKTphLGI9cihhKSwodSYmTXx8RD09PSEwKSYmKGVbbi0xXSE9PVMmJmIucHVzaCh5KSxiLnB1c2goUyx5KSxnJiYoKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBDP1widW5kZWZpbmVkXCI6aShDKSk9PT1wJiYoZz1nLnNsaWNlKDAsQykpLGI9Yi5jb25jYXQoZykpLEQ9PT0hMCYmZVtuLTFdPT09UyYmYi5wdXNoKHYpKSwkPjAmJihiPWguc3BsaXQoYykuY29uY2F0KGIpKSxsJiYoYi5sZW5ndGg9PT0kJiZiLnB1c2godiksYj1bZF0uY29uY2F0KGIpKSxtLmxlbmd0aD4wJiYoYj1iLmNvbmNhdChtLnNwbGl0KGMpKSksYn12YXIgdD1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06e30sbj10LnByZWZpeCxoPXZvaWQgMD09PW4/dTpuLGc9dC5zdWZmaXgsbT12b2lkIDA9PT1nP2M6ZyxiPXQuaW5jbHVkZVRob3VzYW5kc1NlcGFyYXRvcix4PXZvaWQgMD09PWJ8fGIsTz10LnRob3VzYW5kc1NlcGFyYXRvclN5bWJvbCxfPXZvaWQgMD09PU8/bDpPLGo9dC5hbGxvd0RlY2ltYWwsTT12b2lkIDAhPT1qJiZqLFA9dC5kZWNpbWFsU3ltYm9sLFM9dm9pZCAwPT09UD9hOlAsdz10LmRlY2ltYWxMaW1pdCxDPXZvaWQgMD09PXc/Mjp3LGs9dC5yZXF1aXJlRGVjaW1hbCxEPXZvaWQgMCE9PWsmJmssRT10LmFsbG93TmVnYXRpdmUsST12b2lkIDAhPT1FJiZFLFI9dC5hbGxvd0xlYWRpbmdaZXJvZXMsQT12b2lkIDAhPT1SJiZSLEw9dC5pbnRlZ2VyTGltaXQsTj12b2lkIDA9PT1MP251bGw6TCwkPWgmJmgubGVuZ3RofHwwLFY9bSYmbS5sZW5ndGh8fDAscT1fJiZfLmxlbmd0aHx8MDtyZXR1cm4gZS5pbnN0YW5jZU9mPVwiY3JlYXRlTnVtYmVyTWFza1wiLGV9ZnVuY3Rpb24gcihlKXtyZXR1cm4gZS5zcGxpdChjKS5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuIHYudGVzdChlKT92OmV9KX1mdW5jdGlvbiBvKGUsdCl7cmV0dXJuIGUucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZyx0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgaT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24oZSl7cmV0dXJuIHR5cGVvZiBlfTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiBlfTt0LmRlZmF1bHQ9bjt2YXIgdT1cIiRcIixjPVwiXCIsbD1cIixcIixhPVwiLlwiLHM9XCItXCIsZD0vLS8sZj0vXFxEKy9nLHA9XCJudW1iZXJcIix2PS9cXGQvLHk9XCJbXVwifSxmdW5jdGlvbihlLHQsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZX19ZnVuY3Rpb24gbyhlLHQpe2U9ZS5yZXBsYWNlKE8sdik7dmFyIG49dC5wbGFjZWhvbGRlckNoYXIscj10LmN1cnJlbnRDYXJldFBvc2l0aW9uLG89ZS5pbmRleE9mKHkpLHM9ZS5sYXN0SW5kZXhPZihwKSxkPXM8bz8tMTpzLGY9aShlLG8rMSx5KSxoPWkoZSxkLTEscCksZz11KGUsbyxuKSxtPWMoZSxvLGQsbiksYj1sKGUsZCxuLHIpO2c9YShnKSxtPWEobSksYj1hKGIsITApO3ZhciB4PWcuY29uY2F0KGYpLmNvbmNhdChtKS5jb25jYXQoaCkuY29uY2F0KGIpO3JldHVybiB4fWZ1bmN0aW9uIGkoZSx0LG4pe3ZhciByPVtdO3JldHVybiBlW3RdPT09bj9yLnB1c2gobik6ci5wdXNoKGgsbiksci5wdXNoKGgpLHJ9ZnVuY3Rpb24gdShlLHQpe3JldHVybiB0PT09LTE/ZTplLnNsaWNlKDAsdCl9ZnVuY3Rpb24gYyhlLHQsbixyKXt2YXIgbz12O3JldHVybiB0IT09LTEmJihvPW49PT0tMT9lLnNsaWNlKHQrMSxlLmxlbmd0aCk6ZS5zbGljZSh0KzEsbikpLG89by5yZXBsYWNlKG5ldyBSZWdFeHAoXCJbXFxcXHNcIityK1wiXVwiLG0pLHYpLG89PT15P2Y6by5sZW5ndGg8MT9nOm9bby5sZW5ndGgtMV09PT1wP28uc2xpY2UoMCxvLmxlbmd0aC0xKTpvfWZ1bmN0aW9uIGwoZSx0LG4scil7dmFyIG89djtyZXR1cm4gdCE9PS0xJiYobz1lLnNsaWNlKHQrMSxlLmxlbmd0aCkpLG89by5yZXBsYWNlKG5ldyBSZWdFeHAoXCJbXFxcXHNcIituK1wiLl1cIixtKSx2KSwwPT09by5sZW5ndGg/ZVt0LTFdPT09cCYmciE9PWUubGVuZ3RoP2Y6djpvfWZ1bmN0aW9uIGEoZSx0KXtyZXR1cm4gZS5zcGxpdCh2KS5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuIGU9PT1nP2U6dD94OmJ9KX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgcz1uKDQpLGQ9cihzKSxmPVwiKlwiLHA9XCIuXCIsdj1cIlwiLHk9XCJAXCIsaD1cIltdXCIsZz1cIiBcIixtPVwiZ1wiLGI9L1teXFxzXS8seD0vW14uXFxzXS8sTz0vXFxzL2c7dC5kZWZhdWx0PXttYXNrOm8scGlwZTpkLmRlZmF1bHR9fSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oZSx0KXt2YXIgbj10LmN1cnJlbnRDYXJldFBvc2l0aW9uLGk9dC5yYXdWYWx1ZSxmPXQucHJldmlvdXNDb25mb3JtZWRWYWx1ZSxwPXQucGxhY2Vob2xkZXJDaGFyLHY9ZTt2PXIodik7dmFyIHk9di5pbmRleE9mKGMpLGg9bnVsbD09PWkubWF0Y2gobmV3IFJlZ0V4cChcIlteQFxcXFxzLlwiK3ArXCJdXCIpKTtpZihoKXJldHVybiB1O2lmKHYuaW5kZXhPZihhKSE9PS0xfHx5IT09LTEmJm4hPT15KzF8fGkuaW5kZXhPZihvKT09PS0xJiZmIT09dSYmaS5pbmRleE9mKGwpIT09LTEpcmV0dXJuITE7dmFyIGc9di5pbmRleE9mKG8pLG09di5zbGljZShnKzEsdi5sZW5ndGgpO3JldHVybihtLm1hdGNoKGQpfHxzKS5sZW5ndGg+MSYmdi5zdWJzdHIoLTEpPT09bCYmbiE9PWkubGVuZ3RoJiYodj12LnNsaWNlKDAsdi5sZW5ndGgtMSkpLHZ9ZnVuY3Rpb24gcihlKXt2YXIgdD0wO3JldHVybiBlLnJlcGxhY2UoaSxmdW5jdGlvbigpe3JldHVybiB0KyssMT09PXQ/bzp1fSl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5kZWZhdWx0PW47dmFyIG89XCJAXCIsaT0vQC9nLHU9XCJcIixjPVwiQC5cIixsPVwiLlwiLGE9XCIuLlwiLHM9W10sZD0vXFwuL2d9XSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12ZEdWNGRDMXRZWE5yTFdGa1pHOXVjeTlrYVhOMEwzUmxlSFJOWVhOclFXUmtiMjV6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sdGRmUT09IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlZDogJyNjYzQ4MjAnLFxuICBncmVlbjogJyM3MmMzMjInLFxuICBvcmFuZ2U6ICcjZmY5YzAwJyxcbiAgYmxhY2s6ICcjMTgxODE4JyxcbiAgZ3JleV9kYXJrOiAnIzVlNWU1ZScsXG4gIGdyZXk6ICcjOTA5MDkwJyxcbiAgZ3JleV9zZW1pX2xpZ2h0OiAnI2JlYmViZScsXG4gIGdyZXlfbGlnaHQ6ICcjZDNkM2QzJyxcbiAgZ3JleV9saWdodDI6ICcjZGRkZGRkJyxcbiAgZ3JleV9saWdodDM6ICcjZjJmNWY3JyxcbiAgZ3JleV9saWdodDQ6ICcjZTVlNWU1J1xufTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSmpiMjV6ZEdGdWRITXZZMjlzYjNKekxtTnZabVpsWlNJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYlhYMD0iLCJ2YXIgU3RhdGVDaGFpbjtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZUNoYWluID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBTdGF0ZUNoYWluKHN0YXRlcykge1xuICAgIHRoaXMuc3RyaW5nID0gc3RhdGVzLmpvaW4oJysnKTtcbiAgICB0aGlzLmFycmF5ID0gc3RhdGVzLnNsaWNlKCk7XG4gICAgdGhpcy5sZW5ndGggPSBzdGF0ZXMubGVuZ3RoO1xuICB9XG5cbiAgU3RhdGVDaGFpbi5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICB2YXIgaSwgbGVuLCByZWYsIHN0YXRlO1xuICAgIHJlZiA9IHRoaXMuYXJyYXk7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzdGF0ZSA9IHJlZltpXTtcbiAgICAgIGlmIChzdGF0ZSA9PT0gdGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgU3RhdGVDaGFpbi5wcm90b3R5cGUud2l0aG91dCA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLmFycmF5LmZpbHRlcihmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgcmV0dXJuIHN0YXRlICE9PSB0YXJnZXQ7XG4gICAgfSkuam9pbignKycpO1xuICB9O1xuXG4gIFN0YXRlQ2hhaW4ucHJvdG90eXBlLmlzQXBwbGljYWJsZSA9IGZ1bmN0aW9uKHRhcmdldCwgb3RoZXJBY3RpdmUpIHtcbiAgICB2YXIgYWN0aXZlO1xuICAgIGFjdGl2ZSA9IHRoaXMuYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICByZXR1cm4gc3RhdGUgPT09IHRhcmdldCB8fCBvdGhlckFjdGl2ZS5pbmRleE9mKHN0YXRlKSAhPT0gLTE7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFjdGl2ZS5sZW5ndGggPT09IHRoaXMuYXJyYXkubGVuZ3RoO1xuICB9O1xuXG4gIHJldHVybiBTdGF0ZUNoYWluO1xuXG59KSgpO1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12Y1hWcFkydGtiMjB2YzNKakwzQmhjblJ6TDJWc1pXMWxiblF2YzNSaGRHVkRhR0ZwYmk1amIyWm1aV1VpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2VzExOSIsImV4cG9ydHMuY2hlY2ttYXJrID0gaW1wb3J0ICcuL2NoZWNrbWFyaydcbmV4cG9ydHMuYW5nbGVEb3duID0gaW1wb3J0ICcuL2FuZ2xlRG93bidcbmV4cG9ydHMuY2FyZXRVcCA9IGltcG9ydCAnLi9jYXJldFVwJ1xuZXhwb3J0cy5jYXJldERvd24gPSBpbXBvcnQgJy4vY2FyZXREb3duJ1xuZXhwb3J0cy5wbHVzID0gaW1wb3J0ICcuL3BsdXMnXG5leHBvcnRzLmNsb25lID0gaW1wb3J0ICcuL2Nsb25lJ1xuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHdpZHRoOiAnMTJweCdcblx0XHRcdGhlaWdodDogJzEycHgnXG5cdFx0XHR2aWV3Qm94OiAnNSA3IDEyIDEyJ1xuXHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHR3aWR0aDogJzlweCdcblx0XHRcdGhlaWdodDogJzlweCdcblxuXG5cdFx0WycqcG9seWxpbmUnLCB7XG5cdFx0XHRhdHRyczpcblx0XHRcdFx0J3N0cm9rZS13aWR0aCc6ICcyJ1xuXHRcdFx0XHQnc3Ryb2tlLWxpbmVjYXAnOiAncm91bmQnXG5cdFx0XHRcdCdzdHJva2UtbGluZWpvaW4nOiAncm91bmQnXG5cdFx0XHRcdGZpbGw6ICdub25lJ1xuXHRcdFx0XHRwb2ludHM6ICc3IDEzLjg4ODg4ODkgOS42NjY2NjY2NyAxNyAxNSA5J1xuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdH1dXG5cdF1cbilcblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0d2lkdGg6ICcxNzkycHgnXG5cdFx0XHRoZWlnaHQ6ICcxNzkycHgnXG5cdFx0XHR2aWV3Qm94OiAnMCAwIDE3OTIgMTc5Midcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTEzOTUgNzM2cTAgMTMtMTAgMjNsLTQ2NiA0NjZxLTEwIDEwLTIzIDEwdC0yMy0xMGwtNDY2LTQ2NnEtMTAtMTAtMTAtMjN0MTAtMjNsNTAtNTBxMTAtMTAgMjMtMTB0MjMgMTBsMzkzIDM5MyAzOTMtMzkzcTEwLTEwIDIzLTEwdDIzIDEwbDUwIDUwcTEwIDEwIDEwIDIzeidcblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0dmlld0JveDogJzAgMCA1MTIgNTEyJ1xuXHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJ1xuXHRcdFx0b3V0bGluZTogJ25vbmUnXG5cblx0XHRbJypwYXRoJ1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0XHRcdGQ6ICdNNDAyIDM0N2MwIDUtMiAxMC01IDEzLTQgNC04IDYtMTMgNmgtMjU2Yy01IDAtOS0yLTEzLTYtMy0zLTUtOC01LTEzczItOSA1LTEybDEyOC0xMjhjNC00IDgtNiAxMy02czkgMiAxMyA2bDEyOCAxMjhjMyAzIDUgNyA1IDEyeidcblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NLnRlbXBsYXRlKFxuXHRbJypzdmcnXG5cdFx0YXR0cnM6XG5cdFx0XHR2aWV3Qm94OiAnMCAwIDUxMiA1MTInXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBhdGgnXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0ZDogJ000MDIgMjAxYzAgNS0yIDktNSAxM2wtMTI4IDEyOGMtNCA0LTggNS0xMyA1cy05LTEtMTMtNWwtMTI4LTEyOGMtMy00LTUtOC01LTEzczItOSA1LTEzYzQtMyA4LTUgMTMtNWgyNTZjNSAwIDkgMiAxMyA1IDMgNCA1IDggNSAxM3onXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHZpZXdCb3g6ICcwIDAgMTUgMTUnXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBvbHlnb24nXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0cG9pbnRzOiAnOSAwIDYgMCA2IDYgMCA2IDAgOSA2IDkgNiAxNSA5IDE1IDkgOSAxNSA5IDE1IDYgOSA2J1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHZpZXdCb3g6ICcwIDAgMTggMjAnXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBhdGgnXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0ZDogJ00xMy40MTQsMCBMNiwwIEM0Ljg5NywwIDQsMC44OTggNCwyIEw0LDE0IEM0LDE1LjEwMyA0Ljg5NywxNiA2LDE2IEwxNiwxNiBDMTcuMTAzLDE2IDE4LDE1LjEwMyAxOCwxNCBMMTgsNC41ODYgTDEzLjQxNCwwIFogTTE2LjAwMSwxNCBMNiwxNCBMNiwyIEwxMiwyIEwxMiw2IEwxNiw2IEwxNi4wMDEsMTQgWidcblx0XHRdXG5cdFx0XG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTIsNi40MjM3OTI4MiBMMCw2LjQyMzc5MjgyIEwwLDE4IEMwLDE5LjEwMyAwLjg5NywyMCAyLDIwIEwxNCwyMCBMMTQsMTggTDIsMTggTDIsNi40MjM3OTI4MiBaJ1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cblxuIl19