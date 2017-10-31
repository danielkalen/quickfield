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
  builder.version = "1.0.73";
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
        changeAmount = !!show === !!prevShow ? 0 : show ? 25 : prevShow ? -25 : void 0;
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
    this.state.showError = !isValid;
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
      this.templates.icon.spawn(this.settings.templates.icon, globalOpts).append(this.settings.icon).insertBefore(this.el.child.input);
    }
    if (this.settings.checkmark) {
      this.templates.checkmark.spawn(this.settings.templates.checkmark, globalOpts).insertAfter(this.el.child.input);
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
        top: '110%',
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSIsImNvbnNvbGVQYXRjaC5jb2ZmZWUiLCIuLi9wYWNrYWdlLmpzb24iLCJoZWxwZXJzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvaW5kZXguY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvYWxsb3dlZE9wdGlvbnMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvaGVscGVycy5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9jaGVja3MuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy93aW5kb3cuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvbWVkaWFRdWVyeS5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9iYXRjaC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy90ZW1wbGF0ZS9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9zaG9ydGN1dHMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9wYWNrYWdlLmpzb24iLCJjaGVja3MuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3NtYXJ0LWV4dGVuZC9zcmMvaW5kZXguY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3NtYXJ0LWV4dGVuZC9ub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3BhY2thZ2UuanNvbiIsImFuaW1hdGlvbnMuY29mZmVlIiwiY29uc3RhbnRzL3JlcUZpZWxkTWV0aG9kcy5jb2ZmZWUiLCJmaWVsZC9pbmRleC5jb2ZmZWUiLCJmaWVsZC9maWVsZC90cmFuc2Zvcm1TZXR0aW5ncy5jb2ZmZWUiLCJmaWVsZC90ZXh0L19pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL19pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9TaW1wbHlCaW5kL19pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nL19pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL2luZGV4LmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL0dyb3VwQmluZGluZy9faW5kZXguY29mZmVlIiwiY29uc3RhbnRzL3JlZ2V4LmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9ub2RlX21vZHVsZXMvcXVpY2tjc3Mvc3JjL2luZGV4LmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9ub2RlX21vZHVsZXMvcXVpY2tjc3Mvbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9wYWNrYWdlLmpzb24iLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL2lzL3NyYy9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3NyYy9leHRlbmQuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrY3NzL3NyYy9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tjc3Mvbm9kZV9tb2R1bGVzL3F1aWNrY3NzL3BhY2thZ2UuanNvbiIsIi4uL25vZGVfbW9kdWxlcy9mYXN0ZG9tL2Zhc3Rkb20uanMiLCJjb21wb25lbnRzL2NvbmRpdGlvbi5jb2ZmZWUiLCJmaWVsZC9nbG9iYWxEZWZhdWx0cy5jb2ZmZWUiLCJjb21wb25lbnRzL2Ryb3Bkb3duL2luZGV4LmNvZmZlZSIsImNvbXBvbmVudHMvbWFzay5jb2ZmZWUiLCJjb25zdGFudHMva2V5Q29kZXMuY29mZmVlIiwiZmllbGQvdGV4dC90ZW1wbGF0ZS5jb2ZmZWUiLCJmaWVsZC90ZXh0L2RlZmF1bHRzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9ub2RlX21vZHVsZXMvcXVpY2tjc3Mvc3JjL2NvbnN0YW50cy5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrY3NzL3NyYy9oZWxwZXJzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vaXMvc3JjL25hdGl2ZXMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9pcy9zcmMvZG9tLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvY29uc3RhbnRzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvaGVscGVycy5jb2ZmZWUiLCJjb21wb25lbnRzL2Ryb3Bkb3duL3RlbXBsYXRlLmNvZmZlZSIsImNvbXBvbmVudHMvZHJvcGRvd24vZGVmYXVsdHMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3RleHQtbWFzay1jb3JlL2Rpc3QvdGV4dE1hc2tDb3JlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3RleHQtbWFzay1hZGRvbnMvZGlzdC90ZXh0TWFza0FkZG9ucy5qcyIsImNvbnN0YW50cy9jb2xvcnMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9lbGVtZW50L3N0YXRlQ2hhaW4uY29mZmVlIiwic3ZnL19pbmRleC5jb2ZmZWUiLCJzdmcvY2hlY2ttYXJrLmNvZmZlZSIsInN2Zy9hbmdsZURvd24uY29mZmVlIiwic3ZnL2NhcmV0VXAuY29mZmVlIiwic3ZnL2NhcmV0RG93bi5jb2ZmZWUiLCJzdmcvcGx1cy5jb2ZmZWUiLCJzdmcvY2xvbmUuY29mZmVlIl0sIm5hbWVzIjpbImltcG9ydDoxIiwiaW1wb3J0OjIiLCJpbXBvcnQ6MyIsImltcG9ydDo0IiwiaW1wb3J0OjUiLCJpbXBvcnQ6NiIsImlubGluZToxIiwiaW1wb3J0OjkiLCJpbXBvcnQ6MTAiLCJpbmxpbmU6MiIsImlubGluZTozIiwiaW5saW5lOjQiLCJpbmxpbmU6NSIsImlubGluZTo2IiwiaW5saW5lOjciLCJpbmxpbmU6OCIsImlubGluZTo5IiwiaW5saW5lOjEwIiwiaW1wb3J0OjgiLCJpbXBvcnQ6NyIsImltcG9ydDoxMSIsImltcG9ydDoxMiIsImV4cG9ydDoxIiwiZXhwb3J0OjIiLCJleHBvcnQ6MyIsImV4cG9ydDo0IiwiZXhwb3J0OjUiLCJleHBvcnQ6NiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O1VBSUVBLFVBQWtCQTs7TUFBU0MsVUFDMUJBOztLQUFRQyxVQUFpQkE7O1NBQVlDLFVBQXFCQTs7cUJBQ3RDQyxVQUdMQTs7eUJBQTRCQyxVQUV6Q0E7O0FDWExDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUsyQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJENkYyWkMsVUFBZ0JBOzs7Ozs7NEJBQWdGQyxXQUFxQkE7Ozs7Ozs7Ozs7Ozs7b0JFbEczaUJDLFFBdUZFQTs7Ozs7Ozs7Ozs7Ozs7OztLQ3JGRlQsVUFBaUJBOztNQUFTQyxVQUFpQkE7O2FBQzlCQyxXQUVKQTs7UUFDUEMsV0FFS0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ053QkgscUJBRTlCQTs7Ozs7QUFBZ0NDLHVCQUVqQ0E7O0FDTkFLOzs7Ozs7QUE0QkNBOztBQzVCREc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbURDQTs7QUNuRERDOzs7Ozs7Ozs7Ozs7Ozs7QUFRQ0E7O0FDUkRDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkN1QkE7O0FDN0N2QkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JDQTs7QUNsQkRDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUZDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pGREM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q0NBOztBQ3ZDREM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1RENBOztBQ3ZEREM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3RG9EQTs7bUJDeERwREMsUUFpR0VBOzs7Ozs7Ozs7OztLQ2pHWWpCLFdBQ05BOzs7Ozs7dUNBR1FDLFVBQWtCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7U0NEM0JELFdBQ01BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQ0piTSxPQTBHRUE7Ozs7Ozs7TUMxR2NOLFdBQ1BBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRFQ7QUFDQTtBQUNBO0FBQ0E7Ozs7VUNBQ0EsVUFBbUJBOztLQUNuQkMsVUFBa0JBOztTQUFZQyxVQUN6QkE7O1VBQWFDLFdBQWdCQTs7YUFDN0JDLFdBR0tBOztZQUFlQyxXQUNGQTs7Ozs7Ozs7OzRCQ1Z4QkM7Ozs7bUNEbUJJWSxXQUNjQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1BvQ1o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQ0hoQk4sV0FFTkE7O09BQzNCQyxXQUNVQTs7UUFDWEMsV0FFU0E7O1dBRWJDLFdBQ2lCQTs7VUFDWEMsVUFBc0JBOztLQUV2QkMsVUFBcUJBOztNQUN6QmMsVUFBaUJBOztTQUFZRCxVQUFxQkE7O2FBQzNDWCxXQUFnQ0E7O0FBQ3hDQywwREFBZ0RBOztBQUFHWSwwQkFDbENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWlVdy9NQyxVQUFZQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVWcmhOZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUM2QkE7O0FDRDdCRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QmtCQTs7QUN2QmxCQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvRnFCQTs7QUNwRnJCQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUIyQkE7O0FDekIzQkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQk9BOzs7Ozs7O0FDL0JQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztZQ1ZjWixXQUVWQTs7VUFBYUMsV0FBa0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O21CQ0huQ0ssT0E2RkVBOzs7Ozs7Ozs7O1dDM0ZLTixXQUVKQTtPQUFTQyxXQUNDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTGI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztZQy9EY0QsV0FFVkE7O1VBQWFDLFdBQWtCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttQkNIbkNLLE9BZ0dFQTs7Ozs7OztBQ2hHRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztLQ2xQYU4sVUFBa0JBOzthQUUvQkMsV0FFZUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0xmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0tDdkJRRCxVQUFxQkE7O2FBQ2ZDLFdBQ1FBOztXQUFjQyxXQUNwQkE7O1VBQWFDLFVBQ2pCQTs7WUFBZUMsV0FFbkJBOztTQUNIQyxVQUNDQTs7TUFBU2MsVUFDSEE7O2lCQUFvQkQsV0FFdkJBOztBQUFHWCwwQkFDSkE7O0FBQUdDLDBCQUVDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2FDakJjUixXQUNQQTs7V0FDakJDLFdBQ0RBOzthQUFnQkMsV0FDWEE7O1NBQVlDLFVBQ1RBOztLQUFRQyxVQUNMQTs7UUFDVEMsV0FDR0E7O1VBQ05jLFVBR0NBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztNQzVDMEJuQixVQUNoQkE7O1VBQWFDLFVBQ25CQTs7U0FBWUMsV0FFU0E7Ozs7QUFFWG9CLDhCQUVHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZQU0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBK0NkQTs7QUFBRUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0JBeURpMUhBOzs7OztBQzlXLzFIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1lDNUI4QnhCLFdBQzlCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7WUMxQjhCQSxXQUM5QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQ0RNQSxVQUFpQkE7O01BQ2hCQyxXQUFrQkE7O1VBRXJCQyxVQUFzQkE7O0FBQzFCb0IsOEJBRUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUNFQzs7Ozs7Ozs7Ozs7O3FCQWNBQTs7QUFBRUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBcUVIQTs7QUFDREM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnREF5Q1FBOztBQUFFQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NEQVUwZkE7O0FBQUVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFBMlZBOzs7OztBQ25MbDJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O29CQ3hDb0IzQixXQUFvQkE7O29CQUNsQkMsV0FDckJBOztrQkFBcUJDLFdBQ25CQTs7b0JBQXVCQyxXQUNyQkE7O2VBQWtCQyxXQUNoQkE7O2dCQUFtQkMsV0FBZ0JBOzs7Ozs7O01DTDFCTCxVQUVSQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUNGUUEsVUFFUkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01DRlFBLFVBRVJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUNGUUEsVUFFUkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQ0ZRQSxVQUVSQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01DRlFBLFVBRVJBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJoZWxwZXJzID0gXyRzbSgnLi9oZWxwZXJzJyApXG5ET00gPSBfJHNtKCdxdWlja2RvbScgKVxuSVMgPSBfJHNtKCcuL2NoZWNrcycgKVxuZXh0ZW5kID0gXyRzbSgnc21hcnQtZXh0ZW5kJyApXG5yZWdpc3RlckFuaW1hdGlvbnMgPSBfJHNtKCcuL2FuaW1hdGlvbnMnIClcblJFUVVJUkVEX0ZJRUxEX01FVEhPRFMgPSBfJHNtKCcuL2NvbnN0YW50cy9yZXFGaWVsZE1ldGhvZHMnIClcbl8kc20oJy4vY29uc29sZVBhdGNoJyApXG5cblxubmV3QnVpbGRlciA9IChzZXR0aW5nT3ZlcnJpZGVzLCB0ZW1wbGF0ZU92ZXJyaWRlcyktPlxuXHRidWlsZGVyID0gKHNldHRpbmdzKS0+XG5cdFx0c2V0dGluZ3MgPSB7fSB1bmxlc3MgSVMub2JqZWN0KHNldHRpbmdzKVxuXHRcdHNldHRpbmdzLnR5cGUgPz0gJ3RleHQnXG5cblx0XHRpZiBub3QgRmllbGRbc2V0dGluZ3MudHlwZV1cblx0XHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrRmllbGQ6ICcje3NldHRpbmdzLnR5cGV9JyBpcyBub3QgYSB2YWxpZC9yZWdpc3RlcmVkIGZpZWxkIHR5cGVcIlxuXG5cdFx0cmVnaXN0ZXJBbmltYXRpb25zKClcblx0XHRuZXcgRmllbGRbc2V0dGluZ3MudHlwZV0oc2V0dGluZ3MsIGJ1aWxkZXIsIHNldHRpbmdPdmVycmlkZXMsIHRlbXBsYXRlT3ZlcnJpZGVzKVxuXG5cblx0YnVpbGRlci5yZWdpc3RlciA9ICh0eXBlLCB0YXJnZXRGaWVsZCktPlxuXHRcdGlmIG5vdCBJUy5zdHJpbmcodHlwZSkgb3Igbm90IElTLmZ1bmN0aW9uKHRhcmdldEZpZWxkKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiUXVpY2tGaWVsZCBSZWdpc3RyYXRpb246IGludmFsaWQgYXJndW1lbnRzXCJcblx0XHRmb3IgcmVxdWlyZWRNZXRob2QgaW4gUkVRVUlSRURfRklFTERfTUVUSE9EU1xuXHRcdFx0aWYgbm90IHRhcmdldEZpZWxkOjpbcmVxdWlyZWRNZXRob2RdXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrRmllbGQgUmVnaXN0cmF0aW9uOiAnI3tyZXF1aXJlZE1ldGhvZH0nIG1ldGhvZCBpcyByZXF1aXJlZCBpbiBvcmRlciB0byByZWdpc3RlciB0aGUgZmllbGRcIlxuXG5cdFx0RmllbGRbdHlwZV0gPSB0YXJnZXRGaWVsZFxuXHRcdHJldHVybiBAXG5cblxuXHRidWlsZGVyLmNvbmZpZyA9IChuZXdTZXR0aW5ncywgbmV3VGVtcGxhdGVzKS0+XG5cdFx0dGhyb3cgbmV3IEVycm9yIFwiUXVpY2tGaWVsZCBDb25maWc6IGludmFsaWQgY29uZmlnIG9iamVjdCBwcm92aWRlZCAje1N0cmluZyBuZXdTZXR0aW5nc31cIiBpZiBub3QgSVMub2JqZWN0KG5ld1NldHRpbmdzKVxuXHRcdG91dHB1dFNldHRpbmdzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdFxuXHRcdGZvciB0eXBlLGNvbmZpZyBvZiBuZXdTZXR0aW5nc1xuXHRcdFx0aWYgdHlwZSBpcyAnZ2xvYmFsJ1xuXHRcdFx0XHRvdXRwdXRTZXR0aW5ncy5nbG9iYWxEZWZhdWx0cyA9IGV4dGVuZC5kZWVwLm5vdERlZXAoRmllbGQuc2hhbGxvd1NldHRpbmdzKS5jbG9uZShGaWVsZDo6Z2xvYmFsRGVmYXVsdHMsIGNvbmZpZylcblx0XHRcdGVsc2UgaWYgRmllbGRbdHlwZV1cblx0XHRcdFx0b3V0cHV0U2V0dGluZ3NbdHlwZV0gPSBleHRlbmQuY2xvbmUuZGVlcC5ub3REZWVwKEZpZWxkLnNoYWxsb3dTZXR0aW5ncykoRmllbGRbdHlwZV06OmRlZmF1bHRzLCBjb25maWcpXG5cblx0XHRpZiBJUy5vYmplY3QobmV3VGVtcGxhdGVzKVxuXHRcdFx0b3V0cHV0VGVtcGxhdGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdFx0Z2xvYmFsQ29uZmlnID0gbmV3VGVtcGxhdGVzLmdsb2JhbFxuXHRcdFx0aWYgZ2xvYmFsQ29uZmlnIGFuZCBnbG9iYWxDb25maWcuZmllbGQgYW5kIG5vdCBnbG9iYWxDb25maWcuZGVmYXVsdFxuXHRcdFx0XHRnbG9iYWxDb25maWcuZGVmYXVsdCA9IGdsb2JhbENvbmZpZy5maWVsZFxuXHRcdFx0XG5cdFx0XHRmb3IgdHlwZSBvZiBGaWVsZFxuXHRcdFx0XHRvcmlnaW5hbFRlbXBsYXRlcyA9IEZpZWxkW3R5cGVdOjo/LnRlbXBsYXRlc1xuXHRcdFx0XHR0ZW1wbGF0ZXMgPSBuZXdUZW1wbGF0ZXNbdHlwZV0gb3IgZ2xvYmFsQ29uZmlnXG5cdFx0XHRcdGlmIG5vdCBvcmlnaW5hbFRlbXBsYXRlc1xuXHRcdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRcdGlmIG5vdCB0ZW1wbGF0ZXNcblx0XHRcdFx0XHRvdXRwdXRUZW1wbGF0ZXNbdHlwZV0gPSBvcmlnaW5hbFRlbXBsYXRlc1xuXHRcdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiB0ZW1wbGF0ZXMuZmllbGQgYW5kIG5vdCB0ZW1wbGF0ZXMuZGVmYXVsdFxuXHRcdFx0XHRcdHRlbXBsYXRlcy5kZWZhdWx0ID0gdGVtcGxhdGVzLmZpZWxkXG5cblx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW3R5cGVdID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdFx0XHRcblx0XHRcdFx0Zm9yIG5hbWUsY29uZmlnIG9mIHRlbXBsYXRlc1xuXHRcdFx0XHRcdGNvbnRpbnVlIGlmIG5hbWUgaXMgJ2ZpZWxkJyBvciBub3Qgb3JpZ2luYWxUZW1wbGF0ZXNbbmFtZV1cblx0XHRcdFx0XHRjb25maWcgPSBleHRlbmQuY2xvbmUuZGVlcC5jb25jYXQoZ2xvYmFsQ29uZmlnW25hbWVdLCBjb25maWcpIGlmIGdsb2JhbENvbmZpZyBhbmQgZ2xvYmFsQ29uZmlnW25hbWVdXG5cdFx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW3R5cGVdW25hbWVdID0gb3JpZ2luYWxUZW1wbGF0ZXNbbmFtZV0uZXh0ZW5kKGNvbmZpZylcblxuXHRcdFx0XHRmb3IgbmFtZSxjb25maWcgb2Ygb3JpZ2luYWxUZW1wbGF0ZXMgd2hlbiBub3Qgb3V0cHV0VGVtcGxhdGVzW3R5cGVdW25hbWVdXG5cdFx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW3R5cGVdW25hbWVdID0gY29uZmlnXG5cblx0XHRyZXR1cm4gbmV3QnVpbGRlcihvdXRwdXRTZXR0aW5ncywgb3V0cHV0VGVtcGxhdGVzKVxuXG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgYnVpbGRlciwgJ2ZpZWxkcycsIGdldDogKCktPlxuXHRcdGV4dGVuZC5jbG9uZS5vd24ubm90S2V5cygnaW5zdGFuY2VzJykoRmllbGQpXG5cblx0YnVpbGRlci5zZXR0aW5nT3ZlcnJpZGVzID0gc2V0dGluZ092ZXJyaWRlc1xuXHRidWlsZGVyLnRlbXBsYXRlT3ZlcnJpZGVzID0gdGVtcGxhdGVPdmVycmlkZXNcblx0YnVpbGRlci52ZXJzaW9uID0gXyRzbSgnLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbicgKVxuXHRidWlsZGVyLkZpZWxkID0gRmllbGQgPSBfJHNtKCcuL2ZpZWxkJyApXG5cdHJldHVybiBidWlsZGVyXG5cblxuXG5cblxuXG5RdWlja0ZpZWxkID0gbmV3QnVpbGRlcigpXG5RdWlja0ZpZWxkLnJlZ2lzdGVyICd0ZXh0JywgXyRzbSgnLi9maWVsZC90ZXh0JyApXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ3RleHRhcmVhJywgXyRzbSgnLi9maWVsZC90ZXh0YXJlYScgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdudW1iZXInLCBfJHNtKCcuL2ZpZWxkL251bWJlcicgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdzZWxlY3QnLCBfJHNtKCcuL2ZpZWxkL3NlbGVjdCcgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdjaG9pY2UnLCBfJHNtKCcuL2ZpZWxkL2Nob2ljZScgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICd0cnVlZmFsc2UnLCBfJHNtKCcuL2ZpZWxkL3RydWVmYWxzZScgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICd0b2dnbGUnLCBfJHNtKCcuL2ZpZWxkL3RvZ2dsZScgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdncm91cCcsIF8kc20oJy4vZmllbGQvZ3JvdXAnIClcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAncmVwZWF0ZXInLCBfJHNtKCcuL2ZpZWxkL3JlcGVhdGVyJyApXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ2ZpbGUnLCBfJHNtKCcuL2ZpZWxkL2ZpbGUnIClcbm1vZHVsZS5leHBvcnRzID0gUXVpY2tGaWVsZCIsIiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcbkBjb25zb2xlID89IHt9XG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5jb25zb2xlLmxvZyA/PSAoKS0+XG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5jb25zb2xlLndhcm4gPz0gY29uc29sZS5sb2ciLCJ7XG4gIFwibmFtZVwiOiBcInF1aWNrZmllbGRcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjczXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJGYXN0ICYgbGlnaHQgZm9ybSBmaWVsZHMgbWFuYWdlbWVudCBzdXBwb3J0aW5nIHJlYWwtdGltZSBiaW5kaW5ncywgY3VzdG9tIHN0eWxpbmcsIGN1c3RvbSBmaWVsZHMsIElFOSssIGFuZCBtb3JlLi4uXCIsXG4gIFwibWFpblwiOiBcImRpc3QvcXVpY2tmaWVsZC5qc1wiLFxuICBcImJyb3dzZXJcIjoge1xuICAgIFwiLi9kZWJ1Z1wiOiBcImRpc3QvcXVpY2tmaWVsZC5kZWJ1Zy5qc1wiLFxuICAgIFwiLi9kaXN0L3F1aWNrZmllbGQuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL3RleHRcIjogXCJzcmMvZmllbGQvdGV4dC9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL3RleHRhcmVhXCI6IFwic3JjL2ZpZWxkL3RleHRhcmVhL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvbnVtYmVyXCI6IFwic3JjL2ZpZWxkL251bWJlci9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL3NlbGVjdFwiOiBcInNyYy9maWVsZC9zZWxlY3QvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9jaG9pY2VcIjogXCJzcmMvZmllbGQvY2hvaWNlL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdHJ1ZWZhbHNlXCI6IFwic3JjL2ZpZWxkL3RydWVmYWxzZS9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL3RvZ2dsZVwiOiBcInNyYy9maWVsZC90b2dnbGUvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9ncm91cFwiOiBcInNyYy9maWVsZC9ncm91cC9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL3JlcGVhdGVyXCI6IFwic3JjL2ZpZWxkL3JlcGVhdGVyL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvZmlsZVwiOiBcInNyYy9maWVsZC9maWxlL19pbmRleC5jb2ZmZWVcIlxuICB9LFxuICBcImJyb3dzZXJpZnlcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwic2ltcGx5aW1wb3J0L2NvbXBhdFwiXG4gICAgXVxuICB9LFxuICBcInNpbXBseWltcG9ydFwiOiB7XG4gICAgXCJmaW5hbFRyYW5zZm9ybVwiOiBbXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc3VwZXJcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1yZW5hbWVcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zaW1wbGVcIlxuICAgIF1cbiAgfSxcbiAgXCJkaXJlY3Rvcmllc1wiOiB7XG4gICAgXCJ0ZXN0XCI6IFwidGVzdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJwb3N0dmVyc2lvblwiOiBcIm5wbSBydW4gYnVpbGQgJiYgZ2l0IGFkZCAuICYmIGdpdCBjb21taXQgLWEgLW0gJ1tCdWlsZF0nXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcImZhbHNlICYmIG5wbSBydW4gdGVzdDp0cmF2aXMgfHwgdHJ1ZVwiLFxuICAgIFwicG9zdHB1Ymxpc2hcIjogXCJnaXQgcHVzaFwiLFxuICAgIFwid2F0Y2hcIjogXCJjYWtlIC1kIHdhdGNoXCIsXG4gICAgXCJidWlsZFwiOiBcImNha2UgLWQgYnVpbGQgJiYgY2FrZSBidWlsZCAmJiBjYWtlIG1lYXN1cmUgJiYgY3AgLXIgYnVpbGQvKiBkaXN0L1wiLFxuICAgIFwidGVzdFwiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6dHJhdmlzXCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgJiYgbnBtIHJ1biB0ZXN0Om1pbmlmaWVkIC1zXCIsXG4gICAgXCJ0ZXN0OmxvY2FsXCI6IFwib3BlbiB0ZXN0L3Rlc3RydW5uZXIuaHRtbFwiLFxuICAgIFwidGVzdDptaW5pZmllZFwiOiBcIm1pbmlmaWVkPTEgbnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDprYXJtYVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6YnJvd3NlclwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBFbGVjdHJvbiAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmNocm9tZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgQ2hyb21lIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6ZmlyZWZveFwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBGaXJlZm94IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6c2FmYXJpXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBTYWZhcmkgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYXVjZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIHNhdWNlPTEga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJjYWtlIGluc3RhbGw6Y292ZXJhZ2U7IG5wbSBydW4gY292ZXJhZ2U6cnVuICYmIG5wbSBydW4gY292ZXJhZ2U6YmFkZ2VcIixcbiAgICBcImNvdmVyYWdlOnJ1blwiOiBcImNvdmVyYWdlPXRydWUgbnBtIHJ1biB0ZXN0OmVsZWN0cm9uXCIsXG4gICAgXCJjb3ZlcmFnZTpiYWRnZVwiOiBcImJhZGdlLWdlbiAtZCAuLy5jb25maWcvYmFkZ2VzL2NvdmVyYWdlXCIsXG4gICAgXCJjb3ZlcmFnZTpzaG93XCI6IFwib3BlbiBjb3ZlcmFnZS9sY292LXJlcG9ydC9pbmRleC5odG1sXCJcbiAgfSxcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tmaWVsZC5naXRcIlxuICB9LFxuICBcImF1dGhvclwiOiBcImRhbmllbGthbGVuXCIsXG4gIFwibGljZW5zZVwiOiBcIklTQ1wiLFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZmllbGQvaXNzdWVzXCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2ZpZWxkI3JlYWRtZVwiLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAZGFuaWVsa2FsZW4vaXNcIjogXCJeMi4wLjBcIixcbiAgICBcIkBkYW5pZWxrYWxlbi9zaW1wbHliaW5kXCI6IFwiXjEuMTUuOFwiLFxuICAgIFwiZmFzdGRvbVwiOiBcIl4xLjAuNlwiLFxuICAgIFwibGV2ZW5cIjogXCJeMi4wLjBcIixcbiAgICBcIm1vdmUtanNcIjogXCJeMC41LjBcIixcbiAgICBcInF1aWNrY3NzXCI6IFwiXjEuMy4yXCIsXG4gICAgXCJxdWlja2RvbVwiOiBcIl4xLjAuODFcIixcbiAgICBcInNtYXJ0LWV4dGVuZFwiOiBcIl4xLjcuM1wiLFxuICAgIFwidGV4dC1tYXNrLWFkZG9uc1wiOiBcIl4zLjYuMFwiLFxuICAgIFwidGV4dC1tYXNrLWNvcmVcIjogXCJeNS4wLjFcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY2hhbGtcIjogXCJeMi4wLjFcIixcbiAgICBcImNvZmZlZS1zY3JpcHRcIjogXCJeMS4xMi42XCIsXG4gICAgXCJmcy1qZXRwYWNrXCI6IFwiXjAuMTMuM1wiLFxuICAgIFwia2V5c2ltXCI6IFwiZ2l0aHViOmRhbmllbGthbGVuL2tleXNpbS5qc1wiLFxuICAgIFwicGFja2FnZS1pbnN0YWxsXCI6IFwiXjEuMC4wXCIsXG4gICAgXCJzaW1wbHlpbXBvcnRcIjogXCJeNC4wLjAtczM1XCIsXG4gICAgXCJzaW1wbHl3YXRjaFwiOiBcIl4zLjAuMC1sMlwiXG4gIH1cbn1cbiIsIklTID0gXyRzbSgnLi9jaGVja3MnIClcbkRPTSA9IF8kc20oJ3F1aWNrZG9tJyApXG5TaW1wbHlCaW5kID0gXyRzbSgnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnIClcbnJlZ2V4ID0gXyRzbSgnLi9jb25zdGFudHMvcmVnZXgnIClcblxuaGVscGVycyA9IGV4cG9ydHNcbmhlbHBlcnMubm9vcCA9ICgpLT5cblxuaGVscGVycy5pbmNsdWRlcyA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0dGFyZ2V0IGFuZCB0YXJnZXQuaW5kZXhPZihpdGVtKSBpc250IC0xXG5cbmhlbHBlcnMucmVwZWF0ID0gKHN0cmluZywgY291bnQpLT5cblx0KHN0cmluZyBmb3IgaSBpbiBbMS4uY291bnRdKS5qb2luKCcnKVxuXG5oZWxwZXJzLnJlbW92ZUl0ZW0gPSAodGFyZ2V0LCBpdGVtKS0+XG5cdGl0ZW1JbmRleCA9IHRhcmdldC5pbmRleE9mKGl0ZW0pXG5cdHRhcmdldC5zcGxpY2UoaXRlbUluZGV4LCAxKSBpZiBpdGVtSW5kZXggaXNudCAtMVxuXG5oZWxwZXJzLmluc2VydEFmdGVyID0gKHRhcmdldCwgaXRlbSwgbmV3SXRlbSktPlxuXHRpdGVtSW5kZXggPSB0YXJnZXQuaW5kZXhPZihpdGVtKVxuXHR0YXJnZXQuc3BsaWNlKGl0ZW1JbmRleCwgMCwgbmV3SXRlbSkgaWYgaXRlbUluZGV4IGlzbnQgLTFcblxuaGVscGVycy5maW5kID0gKHRhcmdldCwgZm4pLT5cblx0cmVzdWx0cyA9IHRhcmdldC5maWx0ZXIoZm4pXG5cdHJlc3VsdHNbMF1cblxuaGVscGVycy5kaWZmID0gKHNvdXJjZSwgY29tcGFyZWUpLT5cblx0cmVzdWx0ID0gW11cblx0bWF4TGVuID0gTWF0aC5tYXgoc291cmNlLmxlbmd0aCwgY29tcGFyZWUubGVuZ3RoKVxuXHRpID0gLTFcblx0XG5cdHdoaWxlICsraSA8IG1heExlblxuXHRcdHNvdXJjZVZhbCA9IHNvdXJjZVtpXVxuXHRcdGNvbXBhcmVlVmFsID0gY29tcGFyZWVbaV1cblxuXHRcdGlmIHNvdXJjZVZhbCBpc250IGNvbXBhcmVlVmFsXG5cdFx0XHRyZXN1bHQucHVzaChzb3VyY2VWYWwpIGlmIElTLmRlZmluZWQoc291cmNlVmFsKSBhbmQgbm90IGhlbHBlcnMuaW5jbHVkZXMoY29tcGFyZWUsIHNvdXJjZVZhbClcblx0XHRcdHJlc3VsdC5wdXNoKGNvbXBhcmVlVmFsKSBpZiBJUy5kZWZpbmVkKGNvbXBhcmVlVmFsKSBhbmQgbm90IGhlbHBlcnMuaW5jbHVkZXMoc291cmNlLCBjb21wYXJlZVZhbClcblxuXHRyZXR1cm4gcmVzdWx0XG5cblxuaGVscGVycy5oZXhUb1JHQkEgPSAoaGV4LCBhbHBoYSktPlxuXHRoZXggPSBoZXguc2xpY2UoMSkgaWYgaGV4WzBdIGlzICcjJ1xuXHRSID0gcGFyc2VJbnQgaGV4LnNsaWNlKDAsMiksIDE2XG5cdEcgPSBwYXJzZUludCBoZXguc2xpY2UoMiw0KSwgMTZcblx0QiA9IHBhcnNlSW50IGhleC5zbGljZSg0LDYpLCAxNlxuXHRyZXR1cm4gXCJyZ2JhKCN7Un0sICN7R30sICN7Qn0sICN7YWxwaGF9KVwiXG5cblxuaGVscGVycy5kZWZhdWx0Q29sb3IgPSAoY29sb3IsIGRlZmF1bHRDb2xvciktPlxuXHRpZiBjb2xvciBpcyAndHJhbnNwYXJlbnQnIG9yIG5vdCBjb2xvclxuXHRcdHJldHVybiBkZWZhdWx0Q29sb3Jcblx0ZWxzZVxuXHRcdHJldHVybiBjb2xvclxuXG5cbmhlbHBlcnMuY2FsY1BhZGRpbmcgPSAoZGVzaXJlZEhlaWdodCwgZm9udFNpemUpLT5cblx0TWF0aC5jZWlsIChkZXNpcmVkSGVpZ2h0IC0gZm9udFNpemUqMS4yMzEpLzJcblxuXG5oZWxwZXJzLnVubG9ja1Njcm9sbCA9IChleGNsdWRlZEVsKS0+XG5cdHdpbmRvdy5faXNMb2NrZWQgPSBmYWxzZVxuXHRET00od2luZG93KS5vZmYgJ3doZWVsLmxvY2snXG5cblxuaGVscGVycy5sb2NrU2Nyb2xsID0gKGV4Y2x1ZGVkRWwpLT4gdW5sZXNzIHdpbmRvdy5faXNMb2NrZWRcblx0d2luZG93Ll9pc0xvY2tlZCA9IHRydWVcblx0RE9NKHdpbmRvdykub24gJ3doZWVsLmxvY2snLCAoZXZlbnQpLT5cblx0XHRpZiBldmVudC50YXJnZXQgaXMgZXhjbHVkZWRFbC5yYXcgb3IgRE9NKGV2ZW50LnRhcmdldCkucGFyZW50TWF0Y2hpbmcoKHBhcmVudCktPiBwYXJlbnQgaXMgZXhjbHVkZWRFbClcblx0XHRcdGlmIGV2ZW50LndoZWVsRGVsdGEgPiAwIGFuZCBleGNsdWRlZEVsLnJhdy5zY3JvbGxUb3AgaXMgMFxuXHRcdFx0XHRyZXR1cm4gZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0XHRpZiBldmVudC53aGVlbERlbHRhIDwgMCBhbmQgZXhjbHVkZWRFbC5yYXcuc2Nyb2xsSGVpZ2h0IC0gZXhjbHVkZWRFbC5yYXcuc2Nyb2xsVG9wIGlzIGV4Y2x1ZGVkRWwucmF3LmNsaWVudEhlaWdodFxuXHRcdFx0XHRyZXR1cm4gZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0ZWxzZVxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cbmhlbHBlcnMuZnV6enlNYXRjaCA9IChuZWVkbGUsIGhheXN0YWNrLCBjYXNlU2Vuc2l0aXZlKS0+XG5cdG5MZW5ndGggPSBuZWVkbGUubGVuZ3RoXG5cdGhMZW5ndGggPSBoYXlzdGFjay5sZW5ndGhcblx0dW5sZXNzIGNhc2VTZW5zaXRpdmVcblx0XHRuZWVkbGUgPSBuZWVkbGUudG9VcHBlckNhc2UoKVxuXHRcdGhheXN0YWNrID0gaGF5c3RhY2sudG9VcHBlckNhc2UoKVxuXG5cdGlmIG5MZW5ndGggPiBoTGVuZ3RoXG5cdFx0cmV0dXJuIGZhbHNlXG5cdGlmIG5MZW5ndGggaXMgaExlbmd0aFxuXHRcdHJldHVybiBuZWVkbGUgaXMgaGF5c3RhY2tcblxuXHRuSSA9IGhJID0gbWF0Y2hlZENvdW50ID0wXG5cdHdoaWxlIG5JIDwgbkxlbmd0aFxuXHRcdG5lZWRsZUNoYXIgPSBuZWVkbGVbbkkrK11cblx0XHRcblx0XHR3aGlsZSBoSSA8IGhMZW5ndGhcblx0XHRcdGlmIGhheXN0YWNrW2hJKytdIGlzIG5lZWRsZUNoYXJcblx0XHRcdFx0bWF0Y2hlZENvdW50Kytcblx0XHRcdFx0YnJlYWtcblxuXHRyZXR1cm4gbWF0Y2hlZENvdW50IGlzIG5MZW5ndGhcblxuXG5oZWxwZXJzLnN0YXJ0c1dpdGggPSAobmVlZGxlLCBoYXlzdGFjaywgY2FzZVNlbnNpdGl2ZSktPlxuXHR1bmxlc3MgY2FzZVNlbnNpdGl2ZVxuXHRcdG5lZWRsZSA9IG5lZWRsZS50b1VwcGVyQ2FzZSgpXG5cdFx0aGF5c3RhY2sgPSBoYXlzdGFjay50b1VwcGVyQ2FzZSgpXG5cblx0aWYgbmVlZGxlLmxlbmd0aCA+IGhheXN0YWNrLmxlbmd0aFxuXHRcdHJldHVybiBmYWxzZVxuXHRpZiBuZWVkbGUubGVuZ3RoIGlzIGhheXN0YWNrLmxlbmd0aFxuXHRcdHJldHVybiBuZWVkbGUgaXMgaGF5c3RhY2tcblxuXHRpID0gLTFcblx0d2hpbGUgbmVlZGxlWysraV1cblx0XHRyZXR1cm4gZmFsc2UgaWYgbmVlZGxlW2ldIGlzbnQgaGF5c3RhY2tbaV1cblx0cmV0dXJuIHRydWVcblxuXG5oZWxwZXJzLmdldEluZGV4T2ZGaXJzdERpZmYgPSAoc291cmNlU3RyaW5nLCBjb21wYXJlU3RyaW5nKS0+XG5cdGN1cnJlbnRQb3MgPSAwXG5cdG1heExlbmd0aCA9IE1hdGgubWF4KHNvdXJjZVN0cmluZy5sZW5ndGgsIGNvbXBhcmVTdHJpbmcubGVuZ3RoKVxuXHRcblx0d2hpbGUgY3VycmVudFBvcyA8IG1heExlbmd0aFxuXHRcdHJldHVybiBjdXJyZW50UG9zIGlmIHNvdXJjZVN0cmluZ1tjdXJyZW50UG9zXSBpc250IGNvbXBhcmVTdHJpbmdbY3VycmVudFBvc11cblx0XHRjdXJyZW50UG9zKytcblx0XG5cdHJldHVybiBudWxsXG5cblxuXG5oZWxwZXJzLnBhcnNlQ3NzU2hvcnRoYW5kVmFsdWUgPSAoc3RyaW5nKS0+XG5cdHZhbHVlcyA9IHN0cmluZy5zcGxpdChyZWdleC53aGl0ZVNwYWNlKS5tYXAocGFyc2VGbG9hdClcblx0cmVzdWx0ID0ge31cblx0c3dpdGNoIHZhbHVlcy5sZW5ndGhcblx0XHR3aGVuIDFcblx0XHRcdHJlc3VsdC50b3AgPSByZXN1bHQucmlnaHQgPSByZXN1bHQuYm90dG9tID0gcmVzdWx0LmxlZnQgPSB2YWx1ZXNbMF1cblx0XHR3aGVuIDJcblx0XHRcdHJlc3VsdC50b3AgPSByZXN1bHQuYm90dG9tID0gdmFsdWVzWzBdXG5cdFx0XHRyZXN1bHQucmlnaHQgPSByZXN1bHQubGVmdCA9IHZhbHVlc1sxXVxuXHRcdHdoZW4gM1xuXHRcdFx0cmVzdWx0LnRvcCA9IHZhbHVlc1swXVxuXHRcdFx0cmVzdWx0LnJpZ2h0ID0gcmVzdWx0LmxlZnQgPSB2YWx1ZXNbMV1cblx0XHRcdHJlc3VsdC5ib3R0b20gPSB2YWx1ZXNbMl1cblx0XHR3aGVuIDRcblx0XHRcdHJlc3VsdC50b3AgPSB2YWx1ZXNbMF1cblx0XHRcdHJlc3VsdC5yaWdodCA9IHZhbHVlc1sxXVxuXHRcdFx0cmVzdWx0LmJvdHRvbSA9IHZhbHVlc1syXVxuXHRcdFx0cmVzdWx0LmxlZnQgPSB2YWx1ZXNbM11cblxuXHRyZXR1cm4gcmVzdWx0XG5cblxuaGVscGVycy5zaG9ydGhhbmRTaWRlVmFsdWUgPSAodmFsdWUsIHNpZGUpLT5cblx0c3dpdGNoIHR5cGVvZiB2YWx1ZVxuXHRcdHdoZW4gJ251bWJlcicgdGhlbiB2YWx1ZVxuXHRcdHdoZW4gJ3N0cmluZydcblx0XHRcdHZhbHVlcyA9IGhlbHBlcnMucGFyc2VDc3NTaG9ydGhhbmRWYWx1ZSh2YWx1ZSlcblx0XHRcdHZhbHVlc1tzaWRlXVxuXHRcdGVsc2UgMFxuXG5cbmhlbHBlcnMudXBkYXRlU2hvcnRoYW5kVmFsdWUgPSAodmFsdWUsIHNpZGUsIG5ld1ZhbHVlKS0+XG5cdHZhbHVlcyA9IGhlbHBlcnMucGFyc2VDc3NTaG9ydGhhbmRWYWx1ZSgnJysodmFsdWUgb3IgMCkpXG5cdHN3aXRjaCBzaWRlXG5cdFx0d2hlbiAndG9wJyB0aGVuIHZhbHVlcy50b3AgKz0gbmV3VmFsdWVcblx0XHR3aGVuICdyaWdodCcgdGhlbiB2YWx1ZXMucmlnaHQgKz0gbmV3VmFsdWVcblx0XHR3aGVuICdib3R0b20nIHRoZW4gdmFsdWVzLmJvdHRvbSArPSBuZXdWYWx1ZVxuXHRcdHdoZW4gJ2xlZnQnIHRoZW4gdmFsdWVzLmxlZnQgKz0gbmV3VmFsdWVcblx0XHRlbHNlIE9iamVjdC5rZXlzKHZhbHVlcykuZm9yRWFjaCAoc2lkZSktPiB2YWx1ZXNbc2lkZV0gKz0gbmV3VmFsdWVcblx0XG5cdFwiI3t2YWx1ZXMudG9wfXB4ICN7dmFsdWVzLnJpZ2h0fXB4ICN7dmFsdWVzLmJvdHRvbX1weCAje3ZhbHVlcy5sZWZ0fXB4XCJcblxuXG5cblxuXG5cblxuXG4iLCJzdmdOYW1lc3BhY2UgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5pbXBvcnQgKiBhcyBDU1MgZnJvbSAncXVpY2tjc3MnXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5pbXBvcnQgKiBhcyBleHRlbmQgZnJvbSAnc21hcnQtZXh0ZW5kJ1xuaW1wb3J0ICcuL3BhcnRzL2FsbG93ZWRPcHRpb25zJ1xuaW1wb3J0ICcuL3BhcnRzL2hlbHBlcnMnXG5pbXBvcnQgJy4vcGFydHMvY2hlY2tzJ1xuaW1wb3J0ICcuL3BhcnRzL2VsZW1lbnQnXG5pbXBvcnQgJy4vcGFydHMvd2luZG93J1xuaW1wb3J0ICcuL3BhcnRzL21lZGlhUXVlcnknXG5cblF1aWNrRG9tID0gKCktPiBhcmdzPWFyZ3VtZW50czsgc3dpdGNoXG5cdHdoZW4gSVMuYXJyYXkoYXJnc1swXSlcblx0XHRyZXR1cm4gUXVpY2tEb20oYXJnc1swXS4uLilcblx0XG5cdHdoZW4gSVMudGVtcGxhdGUoYXJnc1swXSlcblx0XHRyZXR1cm4gYXJnc1swXS5zcGF3bigpXG5cdFxuXHR3aGVuIElTLnF1aWNrRG9tRWwoYXJnc1swXSlcblx0XHRyZXR1cm4gaWYgYXJnc1sxXSB0aGVuIGFyZ3NbMF0udXBkYXRlT3B0aW9ucyhhcmdzWzFdKSBlbHNlIGFyZ3NbMF1cblx0XG5cdHdoZW4gSVMuZG9tTm9kZShhcmdzWzBdKSBvciBJUy5kb21Eb2MoYXJnc1swXSlcblx0XHRpZiBhcmdzWzBdLl9xdWlja0VsZW1lbnRcblx0XHRcdHJldHVybiBhcmdzWzBdLl9xdWlja0VsZW1lbnRcblx0XHRcblx0XHR0eXBlID0gYXJnc1swXS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyMnLCAnJylcblx0XHRvcHRpb25zID0gYXJnc1sxXSBvciB7fVxuXHRcdG9wdGlvbnMuZXhpc3RpbmcgPSBhcmdzWzBdXG5cdFx0cmV0dXJuIG5ldyBRdWlja0VsZW1lbnQodHlwZSwgb3B0aW9ucylcblxuXHR3aGVuIGFyZ3NbMF0gaXMgd2luZG93XG5cdFx0cmV0dXJuIFF1aWNrV2luZG93XG5cblx0d2hlbiBJUy5zdHJpbmcoYXJnc1swXSlcdFx0XHRcblx0XHR0eXBlID0gYXJnc1swXS50b0xvd2VyQ2FzZSgpXG5cdFx0aWYgdHlwZSBpcyAndGV4dCdcblx0XHRcdG9wdGlvbnMgPSBpZiBJUy5vYmplY3QoYXJnc1sxXSkgdGhlbiBhcmdzWzFdIGVsc2Uge3RleHQ6YXJnc1sxXSBvciAnJ31cblx0XHRlbHNlXG5cdFx0XHRvcHRpb25zID0gaWYgSVMub2JqZWN0KGFyZ3NbMV0pIHRoZW4gYXJnc1sxXSBlbHNlIHt9XG5cdFx0XG5cdFx0ZWxlbWVudCA9IG5ldyBRdWlja0VsZW1lbnQodHlwZSwgb3B0aW9ucylcblx0XHRpZiBhcmdzLmxlbmd0aCA+IDJcblx0XHRcdGNoaWxkcmVuID0gW107IGkgPSAxOyBhcmdzTGVuZ3RoID0gYXJncy5sZW5ndGg7IGNoaWxkcmVuLnB1c2goYXJnc1tpXSkgd2hpbGUgKytpIDwgYXJnc0xlbmd0aFxuXG5cdFx0XHRmb3IgY2hpbGQgaW4gY2hpbGRyZW5cblx0XHRcdFx0Y2hpbGQgPSBRdWlja0RvbS50ZXh0KGNoaWxkKSBpZiBJUy5zdHJpbmcoY2hpbGQpXG5cdFx0XHRcdGNoaWxkID0gY2hpbGQuc3Bhd24oZmFsc2UpIGlmIElTLnRlbXBsYXRlKGNoaWxkKVxuXHRcdFx0XHRjaGlsZCA9IFF1aWNrRG9tKGNoaWxkLi4uKSBpZiBJUy5hcnJheShjaGlsZClcblx0XHRcdFx0Y2hpbGQuYXBwZW5kVG8oZWxlbWVudCkgaWYgSVMucXVpY2tEb21FbChjaGlsZClcblxuXHRcdHJldHVybiBlbGVtZW50XG5cblx0d2hlbiBhcmdzWzBdIGFuZCAoSVMuZG9tTm9kZShhcmdzWzBdWzBdKSBvciBJUy5kb21Eb2MoYXJnc1swXVswXSkpXG5cdFx0cmV0dXJuIFF1aWNrRG9tKGFyZ3NbMF1bMF0pXG5cblxuUXVpY2tEb20udGVtcGxhdGUgPSAodHJlZSktPlxuXHRuZXcgUXVpY2tUZW1wbGF0ZSh0cmVlLCB0cnVlKVxuXG5cblF1aWNrRG9tLmh0bWwgPSAoaW5uZXJIVE1MKS0+XG5cdGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdGNvbnRhaW5lci5pbm5lckhUTUwgPSBpbm5lckhUTUxcblx0Y2hpbGRyZW4gPSBBcnJheTo6c2xpY2UuY2FsbCBjb250YWluZXIuY2hpbGROb2Rlc1xuXG5cdHJldHVybiBRdWlja0RvbS5iYXRjaChjaGlsZHJlbilcblxuUXVpY2tEb20ucXVlcnkgPSAodGFyZ2V0KS0+XG5cdFF1aWNrRG9tKGRvY3VtZW50KS5xdWVyeSh0YXJnZXQpXG5cblF1aWNrRG9tLnF1ZXJ5QWxsID0gKHRhcmdldCktPlxuXHRRdWlja0RvbShkb2N1bWVudCkucXVlcnlBbGwodGFyZ2V0KVxuXG5RdWlja0RvbS5pc1RlbXBsYXRlID0gKHRhcmdldCktPlxuXHRJUy50ZW1wbGF0ZSh0YXJnZXQpXG5cblF1aWNrRG9tLmlzUXVpY2tFbCA9ICh0YXJnZXQpLT5cblx0SVMucXVpY2tEb21FbCh0YXJnZXQpXG5cblF1aWNrRG9tLmlzRWwgPSAodGFyZ2V0KS0+XG5cdElTLmRvbUVsKHRhcmdldClcblxuXG5cblxuXG5pbXBvcnQgJy4vcGFydHMvYmF0Y2gnXG5pbXBvcnQgJy4vcGFydHMvdGVtcGxhdGUnXG5pbXBvcnQgJy4vcGFydHMvc2hvcnRjdXRzJ1xuUXVpY2tEb20udmVyc2lvbiA9IGltcG9ydCAnLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbidcblF1aWNrRG9tLkNTUyA9IENTU1xubW9kdWxlLmV4cG9ydHMgPSBRdWlja0RvbVxuXG5cblxuIiwiYWxsb3dlZFRlbXBsYXRlT3B0aW9ucyA9IFsgIyBUbyBjb3B5IGZyb20gRE9NIEVsZW1lbnRzXG5cdCdpZCdcblx0J25hbWUnXG5cdCd0eXBlJ1xuXHQnaHJlZidcblx0J3NlbGVjdGVkJ1xuXHQnY2hlY2tlZCdcblx0J2NsYXNzTmFtZSdcbl1cblxuYWxsb3dlZE9wdGlvbnMgPSBbICMgVXNlZCBpbiBRdWlja0VsZW1lbnQ6OnRvSlNPTlxuXHQnaWQnXG5cdCdyZWYnXG5cdCd0eXBlJ1xuXHQnbmFtZSdcblx0J3RleHQnXG5cdCdzdHlsZSdcblx0J2NsYXNzJ1xuXHQnY2xhc3NOYW1lJ1xuXHQndXJsJ1xuXHQnaHJlZidcblx0J3NlbGVjdGVkJ1xuXHQnY2hlY2tlZCdcblx0J3Byb3BzJ1xuXHQnYXR0cnMnXG5cdCdwYXNzU3RhdGVUb0NoaWxkcmVuJ1xuXHQnc3RhdGVUcmlnZ2Vycydcblx0IyAncmVsYXRlZEluc3RhbmNlJ1xuXSIsImhlbHBlcnMgPSB7fVxuXG5oZWxwZXJzLmluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPlxuXHR0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuaGVscGVycy5yZW1vdmVJdGVtID0gKHRhcmdldCwgaXRlbSktPlxuXHRpdGVtSW5kZXggPSB0YXJnZXQuaW5kZXhPZihpdGVtKVxuXHR0YXJnZXQuc3BsaWNlKGl0ZW1JbmRleCwgMSkgIGlmIGl0ZW1JbmRleCBpc250IC0xXG5cdHJldHVybiB0YXJnZXRcblxuaGVscGVycy5ub3JtYWxpemVHaXZlbkVsID0gKHRhcmdldEVsKS0+IHN3aXRjaFxuXHR3aGVuIElTLnN0cmluZyh0YXJnZXRFbCkgdGhlbiBRdWlja0RvbS50ZXh0KHRhcmdldEVsKVxuXHR3aGVuIElTLmRvbU5vZGUodGFyZ2V0RWwpIHRoZW4gUXVpY2tEb20odGFyZ2V0RWwpXG5cdHdoZW4gSVMudGVtcGxhdGUodGFyZ2V0RWwpIHRoZW4gdGFyZ2V0RWwuc3Bhd24oKVxuXHRlbHNlIHRhcmdldEVsXG5cblxuaGVscGVycy5pc1N0YXRlU3R5bGUgPSAoc3RyaW5nKS0+XG5cdHN0cmluZ1swXSBpcyAnJCcgb3Igc3RyaW5nWzBdIGlzICdAJ1xuXG5cbmhlbHBlcnMucmVnaXN0ZXJTdHlsZSA9IChydWxlLCBsZXZlbCwgaW1wb3J0YW50KS0+XG5cdGxldmVsIHx8PSAwXG5cdGNhY2hlZCA9IHN0eWxlQ2FjaGUuZ2V0KHJ1bGUsIGxldmVsKVxuXHRyZXR1cm4gY2FjaGVkIGlmIGNhY2hlZFxuXHRvdXRwdXQgPSB7Y2xhc3NOYW1lOltDU1MucmVnaXN0ZXIocnVsZSwgbGV2ZWwsIGltcG9ydGFudCldLCBmbnM6W10sIHJ1bGV9XG5cdHByb3BzID0gT2JqZWN0LmtleXMocnVsZSlcblx0XG5cdGZvciBwcm9wIGluIHByb3BzIHdoZW4gdHlwZW9mIHJ1bGVbcHJvcF0gaXMgJ2Z1bmN0aW9uJ1xuXHRcdG91dHB1dC5mbnMucHVzaCBbcHJvcCwgcnVsZVtwcm9wXV1cblxuXHRyZXR1cm4gc3R5bGVDYWNoZS5zZXQocnVsZSwgb3V0cHV0LCBsZXZlbClcblxuXG5zdHlsZUNhY2hlID0gbmV3IGNsYXNzXG5cdGNvbnN0cnVjdG9yOiAoKS0+XG5cdFx0QGtleXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdFx0QHZhbHVlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuXHRnZXQ6IChrZXksIGxldmVsKS0+IGlmIEBrZXlzW2xldmVsXVxuXHRcdGluZGV4ID0gQGtleXNbbGV2ZWxdLmluZGV4T2Yoa2V5KVxuXHRcdHJldHVybiBAdmFsdWVzW2xldmVsXVtpbmRleF0gaWYgaW5kZXggaXNudCAtMVxuXG5cdHNldDogKGtleSwgdmFsdWUsIGxldmVsKS0+XG5cdFx0aWYgbm90IEBrZXlzW2xldmVsXVxuXHRcdFx0QGtleXNbbGV2ZWxdID0gW11cblx0XHRcdEB2YWx1ZXNbbGV2ZWxdID0gW11cblxuXHRcdEBrZXlzW2xldmVsXS5wdXNoIGtleVxuXHRcdEB2YWx1ZXNbbGV2ZWxdLnB1c2ggdmFsdWVcblx0XHRyZXR1cm4gdmFsdWVcblxuIiwiSVMgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9pcydcbklTID0gSVMuY3JlYXRlKCduYXRpdmVzJywnZG9tJylcbklTLmxvYWRcdFxuXHRxdWlja0RvbUVsOiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0LmNvbnN0cnVjdG9yLm5hbWUgaXMgUXVpY2tFbGVtZW50Lm5hbWVcblx0XG5cdHRlbXBsYXRlOiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0LmNvbnN0cnVjdG9yLm5hbWUgaXMgUXVpY2tUZW1wbGF0ZS5uYW1lXG5cdFxuXHQjIGJhdGNoOiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0LmNvbnN0cnVjdG9yLm5hbWUgaXMgJ1F1aWNrQmF0Y2gnXG5cbiIsImNsYXNzIFF1aWNrRWxlbWVudFxuXHRjb25zdHJ1Y3RvcjogKEB0eXBlLCBAb3B0aW9ucyktPlxuXHRcdEBzdmcgPSB0cnVlIGlmIEB0eXBlWzBdIGlzICcqJ1xuXHRcdEBlbCA9IEBvcHRpb25zLmV4aXN0aW5nIG9yXG5cdFx0XHRpZiBAdHlwZSBpcyAndGV4dCcgdGhlbiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpZiB0eXBlb2YgQG9wdGlvbnMudGV4dCBpcyAnc3RyaW5nJyB0aGVuIEBvcHRpb25zLnRleHQgZWxzZSAnJylcblx0XHRcdGVsc2UgaWYgQHN2ZyB0aGVuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmdOYW1lc3BhY2UsIEB0eXBlLnNsaWNlKDEpKVxuXHRcdFx0ZWxzZSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KEB0eXBlKVxuXG5cdFx0aWYgQHR5cGUgaXMgJ3RleHQnXG5cdFx0XHRAYXBwZW5kID0gQHByZXBlbmQgPSBAYXR0ciA9ICgpLT5cblx0XHRcdCMgQF90ZXh0cyA9IHt9ICMgZGVmaW5lZCBjb25kaXRpb25hbGx5XG5cblx0XHRAX3BhcmVudCA9IG51bGxcblx0XHRAX3N0eWxlcyA9IHt9XG5cdFx0QF9zdGF0ZSA9IFtdXG5cdFx0QF9jaGlsZHJlbiA9IFtdXG5cdFx0IyBAX3Byb3ZpZGVkU3RhdGVzID0gW11cdFx0XHRcdCMgZGVmaW5lZCBjb25kaXRpb25hbGx5XG5cdFx0IyBAX3Byb3ZpZGVkU3RhdGVzU2hhcmVkID0gW11cdFx0IyBkZWZpbmVkIGNvbmRpdGlvbmFsbHlcblx0XHQjIEBfZXZlbnRDYWxsYmFja3MgPSB7X19yZWZzOnt9fVx0IyBkZWZpbmVkIGNvbmRpdGlvbmFsbHlcblx0XHRcblx0XHRAX25vcm1hbGl6ZU9wdGlvbnMoKVxuXHRcdEBfYXBwbHlPcHRpb25zKClcblx0XHRAX2F0dGFjaFN0YXRlRXZlbnRzKClcblx0XHRAX3Byb3h5UGFyZW50KClcblx0XHRAX3JlZnJlc2hQYXJlbnQoKSBpZiBAb3B0aW9ucy5leGlzdGluZ1xuXHRcdEBlbC5fcXVpY2tFbGVtZW50ID0gQFxuXG5cblx0dG9KU09OOiAoKS0+XG5cdFx0b3V0cHV0ID0gW0B0eXBlLCBleHRlbmQuY2xvbmUua2V5cyhhbGxvd2VkT3B0aW9ucykoQG9wdGlvbnMpXVxuXHRcdGNoaWxkcmVuID0gQGNoaWxkcmVuXG5cdFx0b3V0cHV0LnB1c2goY2hpbGQudG9KU09OKCkpIGZvciBjaGlsZCBpbiBjaGlsZHJlblxuXHRcdHJldHVybiBvdXRwdXRcblxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuUXVpY2tFbGVtZW50Lm5hbWUgPz0gJ1F1aWNrRWxlbWVudCdcblxuaW1wb3J0ICcuL2FsaWFzZXMnXG5pbXBvcnQgJy4vdHJhdmVyc2luZydcbmltcG9ydCAnLi9pbml0J1xuaW1wb3J0ICcuL2V2ZW50cydcbmltcG9ydCAnLi9zdGF0ZSdcbmltcG9ydCAnLi9zdHlsZSdcbmltcG9ydCAnLi9hdHRyaWJ1dGVzLWFuZC1wcm9wZXJ0aWVzJ1xuaW1wb3J0ICcuL21hbmlwdWxhdGlvbidcbmltcG9ydCAnLi9hcHBsaWNhdGlvbidcbiIsIlF1aWNrV2luZG93ID0gXG5cdHR5cGU6ICd3aW5kb3cnXG5cdGVsOiB3aW5kb3dcblx0cmF3OiB3aW5kb3dcblx0X2V2ZW50Q2FsbGJhY2tzOiB7X19yZWZzOnt9fVxuXHRcblxuUXVpY2tXaW5kb3cub24gPSAgUXVpY2tFbGVtZW50OjpvblxuUXVpY2tXaW5kb3cub2ZmID0gIFF1aWNrRWxlbWVudDo6b2ZmXG5RdWlja1dpbmRvdy5lbWl0ID0gIFF1aWNrRWxlbWVudDo6ZW1pdFxuUXVpY2tXaW5kb3cuZW1pdFByaXZhdGUgPSAgUXVpY2tFbGVtZW50OjplbWl0UHJpdmF0ZVxuUXVpY2tXaW5kb3cuX2xpc3RlblRvID0gIFF1aWNrRWxlbWVudDo6X2xpc3RlblRvXG5RdWlja1dpbmRvdy5faW52b2tlSGFuZGxlcnMgPSAgUXVpY2tFbGVtZW50OjpfaW52b2tlSGFuZGxlcnNcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIFF1aWNrV2luZG93LFxuXHQnd2lkdGgnOiBnZXQ6ICgpLT4gd2luZG93LmlubmVyV2lkdGhcblx0J2hlaWdodCc6IGdldDogKCktPiB3aW5kb3cuaW5uZXJIZWlnaHRcblx0J29yaWVudGF0aW9uJzogb3JpZW50YXRpb25HZXR0ZXJcblx0J2FzcGVjdFJhdGlvJzogYXNwZWN0UmF0aW9HZXR0ZXJcblxuIiwiTWVkaWFRdWVyeSA9IG5ldyAoKS0+XG5cdGNhbGxiYWNrcyA9IFtdXG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsICgpLT5cblx0XHRjYWxsYmFjaygpIGZvciBjYWxsYmFjayBpbiBjYWxsYmFja3Ncblx0XHRyZXR1cm5cblxuXHRAcGFyc2VRdWVyeSA9ICh0YXJnZXQsIHF1ZXJ5U3RyaW5nKS0+XG5cdFx0cXVlcnlTcGxpdCA9IHF1ZXJ5U3RyaW5nLnNwbGl0KCcoJylcblx0XHRzb3VyY2UgPSBxdWVyeVNwbGl0WzBdXG5cdFx0c291cmNlID0gc3dpdGNoIHNvdXJjZVxuXHRcdFx0d2hlbiAnd2luZG93JyB0aGVuIFF1aWNrV2luZG93XG5cdFx0XHR3aGVuICdwYXJlbnQnIHRoZW4gdGFyZ2V0LnBhcmVudFxuXHRcdFx0d2hlbiAnc2VsZicgdGhlbiB0YXJnZXRcblx0XHRcdGVsc2UgdGFyZ2V0LnBhcmVudE1hdGNoaW5nIChwYXJlbnQpLT4gcGFyZW50LnJlZiBpcyBzb3VyY2Uuc2xpY2UoMSlcblxuXHRcdHJ1bGVzID0gcXVlcnlTcGxpdFsxXVxuXHRcdFx0LnNsaWNlKDAsLTEpXG5cdFx0XHQuc3BsaXQocnVsZURlbGltaXRlcilcblx0XHRcdC5tYXAgKHJ1bGUpLT4gXG5cdFx0XHRcdHNwbGl0ID0gcnVsZS5zcGxpdCgnOicpXG5cdFx0XHRcdHZhbHVlID0gcGFyc2VGbG9hdChzcGxpdFsxXSlcblx0XHRcdFx0dmFsdWUgPSBzcGxpdFsxXSBpZiBpc05hTih2YWx1ZSlcblx0XHRcdFx0a2V5ID0gc3BsaXRbMF1cblx0XHRcdFx0a2V5UHJlZml4ID0ga2V5LnNsaWNlKDAsNClcblx0XHRcdFx0bWF4ID0ga2V5UHJlZml4IGlzICdtYXgtJ1xuXHRcdFx0XHRtaW4gPSBub3QgbWF4IGFuZCBrZXlQcmVmaXggaXMgJ21pbi0nXG5cdFx0XHRcdGtleSA9IGtleS5zbGljZSg0KSBpZiBtYXggb3IgbWluXG5cdFx0XHRcdGdldHRlciA9IHN3aXRjaCBrZXlcblx0XHRcdFx0XHR3aGVuICdvcmllbnRhdGlvbicgdGhlbiAoKS0+IHNvdXJjZS5vcmllbnRhdGlvblxuXHRcdFx0XHRcdHdoZW4gJ2FzcGVjdC1yYXRpbycgdGhlbiAoKS0+IHNvdXJjZS5hc3BlY3RSYXRpb1xuXHRcdFx0XHRcdHdoZW4gJ3dpZHRoJywnaGVpZ2h0JyB0aGVuICgpLT4gc291cmNlW2tleV1cblx0XHRcdFx0XHRlbHNlICgpLT5cblx0XHRcdFx0XHRcdHN0cmluZ1ZhbHVlID0gc291cmNlLnN0eWxlKGtleSlcblx0XHRcdFx0XHRcdHBhcnNlZFZhbHVlID0gcGFyc2VGbG9hdCBzdHJpbmdWYWx1ZVxuXHRcdFx0XHRcdFx0cmV0dXJuIGlmIGlzTmFOKHBhcnNlZFZhbHVlKSB0aGVuIHN0cmluZ1ZhbHVlIGVsc2UgcGFyc2VkVmFsdWVcblx0XHRcdFx0XG5cdFx0XHRcdHJldHVybiB7a2V5LHZhbHVlLG1pbixtYXgsZ2V0dGVyfVxuXG5cdFx0cmV0dXJuIHtzb3VyY2UsIHJ1bGVzfVxuXG5cblx0QHJlZ2lzdGVyID0gKHRhcmdldCwgcXVlcnlTdHJpbmcpLT5cblx0XHRxdWVyeSA9IEBwYXJzZVF1ZXJ5KHRhcmdldCwgcXVlcnlTdHJpbmcpXG5cdFx0aWYgcXVlcnkuc291cmNlXG5cdFx0XHRjYWxsYmFja3MucHVzaCBjYWxsYmFjayA9ICgpLT4gdGVzdFJ1bGUodGFyZ2V0LCBxdWVyeSwgcXVlcnlTdHJpbmcpXG5cdFx0XHRjYWxsYmFjaygpXG5cdFx0cmV0dXJuIHF1ZXJ5XG5cblxuXHR0ZXN0UnVsZSA9ICh0YXJnZXQsIHF1ZXJ5LCBxdWVyeVN0cmluZyktPlxuXHRcdHBhc3NlZCA9IHRydWVcblxuXHRcdGZvciBydWxlIGluIHF1ZXJ5LnJ1bGVzXG5cdFx0XHRjdXJyZW50VmFsdWUgPSBydWxlLmdldHRlcigpXG5cdFx0XHRwYXNzZWQgPSBzd2l0Y2hcblx0XHRcdFx0d2hlbiBydWxlLm1pbiB0aGVuIGN1cnJlbnRWYWx1ZSA+PSBydWxlLnZhbHVlXG5cdFx0XHRcdHdoZW4gcnVsZS5tYXggdGhlbiBjdXJyZW50VmFsdWUgPD0gcnVsZS52YWx1ZVxuXHRcdFx0XHRlbHNlIGN1cnJlbnRWYWx1ZSBpcyBydWxlLnZhbHVlXG5cblx0XHRcdGJyZWFrIGlmIG5vdCBwYXNzZWRcdFx0XG5cdFx0XG5cdFx0dGFyZ2V0LnN0YXRlKHF1ZXJ5U3RyaW5nLCBwYXNzZWQpXG5cblx0cmV0dXJuIEBcblxuXG5cblxucnVsZURlbGltaXRlciA9IC8sXFxzKi9cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsImNsYXNzIFF1aWNrQmF0Y2hcblx0Y29uc3RydWN0b3I6IChlbGVtZW50cywgQHJldHVyblJlc3VsdHMpLT5cblx0XHRAZWxlbWVudHMgPSBlbGVtZW50cy5tYXAgKGVsKS0+IFF1aWNrRG9tKGVsKVxuXG5cdHJldmVyc2U6ICgpLT5cblx0XHRAZWxlbWVudHMgPSBAZWxlbWVudHMucmV2ZXJzZSgpXG5cdFx0cmV0dXJuIEBcblxuXHRyZXR1cm46IChyZXR1cm5OZXh0KS0+XG5cdFx0aWYgcmV0dXJuTmV4dFxuXHRcdFx0QHJldHVyblJlc3VsdHMgPSB0cnVlXG5cdFx0XHRyZXR1cm4gQFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBAbGFzdFJlc3VsdHNcblxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuUXVpY2tCYXRjaC5uYW1lID89ICdRdWlja0JhdGNoJ1xuXG5cblxuT2JqZWN0LmtleXMoUXVpY2tFbGVtZW50OjopLmNvbmNhdCgnY3NzJywgJ3JlcGxhY2VXaXRoJywgJ2h0bWwnLCAndGV4dCcpLmZvckVhY2ggKG1ldGhvZCktPlxuXHRRdWlja0JhdGNoOjpbbWV0aG9kXSA9IChuZXdWYWx1ZSktPlxuXHRcdHJlc3VsdHMgPSBAbGFzdFJlc3VsdHMgPSBmb3IgZWxlbWVudCBpbiBAZWxlbWVudHNcblx0XHRcdGlmIG1ldGhvZCBpcyAnaHRtbCcgb3IgbWV0aG9kIGlzICd0ZXh0J1xuXHRcdFx0XHRpZiBuZXdWYWx1ZSB0aGVuIGVsZW1lbnRbbWV0aG9kXSA9IG5ld1ZhbHVlIGVsc2UgZWxlbWVudFttZXRob2RdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGVsZW1lbnRbbWV0aG9kXShhcmd1bWVudHMuLi4pXG5cdFx0XG5cdFx0cmV0dXJuIGlmIEByZXR1cm5SZXN1bHRzIHRoZW4gcmVzdWx0cyBlbHNlIEBcblxuXG5RdWlja0RvbS5iYXRjaCA9IChlbGVtZW50cywgcmV0dXJuUmVzdWx0cyktPlxuXHRpZiBub3QgSVMuaXRlcmFibGUoZWxlbWVudHMpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmF0Y2g6IGV4cGVjdGVkIGFuIGl0ZXJhYmxlLCBnb3QgI3tTdHJpbmcoZWxlbWVudHMpfVwiKVxuXHRlbHNlIGlmIG5vdCBlbGVtZW50cy5sZW5ndGhcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYXRjaDogZXhwZWN0ZWQgYSBub24tZW1wdHkgZWxlbWVudCBjb2xsZWN0aW9uXCIpXG5cblx0cmV0dXJuIG5ldyBRdWlja0JhdGNoKGVsZW1lbnRzLCByZXR1cm5SZXN1bHRzKVxuXG5cbiIsImltcG9ydCAnLi9leHRlbmRUZW1wbGF0ZSdcbmltcG9ydCAnLi9wYXJzZVRyZWUnXG5pbXBvcnQgJy4vc2NoZW1hJ1xuXG5jbGFzcyBRdWlja1RlbXBsYXRlXG5cdGNvbnN0cnVjdG9yOiAoY29uZmlnLCBpc1RyZWUpLT5cblx0XHRyZXR1cm4gY29uZmlnIGlmIElTLnRlbXBsYXRlKGNvbmZpZylcblx0XHRjb25maWcgPSBpZiBpc1RyZWUgdGhlbiBwYXJzZVRyZWUoY29uZmlnKSBlbHNlIGNvbmZpZ1xuXHRcdGV4dGVuZCBALCBjb25maWdcblx0XHRAX2hhc0NvbXB1dGVycyA9ICEhQG9wdGlvbnMuY29tcHV0ZXJzXG5cblx0XHRpZiBub3QgQF9oYXNDb21wdXRlcnMgYW5kIEBjaGlsZHJlbi5sZW5ndGhcblx0XHRcdGZvciBjaGlsZCBpbiBAY2hpbGRyZW4gd2hlbiBjaGlsZC5faGFzQ29tcHV0ZXJzIG9yIGNoaWxkLm9wdGlvbnMuY29tcHV0ZXJzXG5cdFx0XHRcdEBfaGFzQ29tcHV0ZXJzID0gdHJ1ZVxuXHRcdFx0XHRicmVha1xuXHRcblx0ZXh0ZW5kOiAobmV3VmFsdWVzLCBnbG9iYWxPcHRzKS0+XG5cdFx0bmV3IFF1aWNrVGVtcGxhdGUgZXh0ZW5kVGVtcGxhdGUoQCwgbmV3VmFsdWVzLCBnbG9iYWxPcHRzKVxuXG5cdHNwYXduOiAobmV3VmFsdWVzLCBnbG9iYWxPcHRzKS0+XG5cdFx0aWYgbmV3VmFsdWVzIGFuZCBuZXdWYWx1ZXMuZGF0YVxuXHRcdFx0ZGF0YSA9IG5ld1ZhbHVlcy5kYXRhXG5cdFx0XHRuZXdWYWx1ZXMgPSBudWxsIGlmIE9iamVjdC5rZXlzKG5ld1ZhbHVlcykubGVuZ3RoIGlzIDFcblx0XHRcblx0XHRpZiBuZXdWYWx1ZXMgb3IgZ2xvYmFsT3B0c1xuXHRcdFx0b3B0cyA9IGV4dGVuZFRlbXBsYXRlKEAsIG5ld1ZhbHVlcywgZ2xvYmFsT3B0cylcblx0XHRlbHNlXG5cdFx0XHRvcHRzID0gZXh0ZW5kLmNsb25lKEApXG5cdFx0XHRvcHRzLm9wdGlvbnMgPSBleHRlbmQuY2xvbmUob3B0cy5vcHRpb25zKVxuXHRcblxuXHRcdGVsZW1lbnQgPSBRdWlja0RvbShvcHRzLnR5cGUsIG9wdHMub3B0aW9ucywgb3B0cy5jaGlsZHJlbi4uLilcblxuXHRcdGlmIEBfaGFzQ29tcHV0ZXJzXG5cdFx0XHRpZiBuZXdWYWx1ZXMgaXNudCBmYWxzZVxuXHRcdFx0XHRlbGVtZW50LmFwcGx5RGF0YShkYXRhKVxuXHRcdFx0aWYgZWxlbWVudC5vcHRpb25zLmNvbXB1dGVycz8uX2luaXRcblx0XHRcdFx0ZWxlbWVudC5fcnVuQ29tcHV0ZXIoJ19pbml0JywgZGF0YSlcblxuXHRcdHJldHVybiBlbGVtZW50XG5cblxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuUXVpY2tUZW1wbGF0ZS5uYW1lID89ICdRdWlja1RlbXBsYXRlJ1xuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBRdWlja1RlbXBsYXRlOjosICdjaGlsZCcsIGdldDogKCktPlxuXHRAX2NoaWxkUmVmcyBvciBfZ2V0Q2hpbGRSZWZzKEApICMgc291cmNlIGluIC9zcmMvcGFydHMvZWxlbWVudC90cmF2ZXJzaW5nLmNvZmZlZVxuXG5cblxuXG5cblxuXG5cbiIsInNob3J0Y3V0cyA9IFtcblx0J2xpbms6YSdcblx0J2FuY2hvcjphJ1xuXHQnYSdcblx0J3RleHQnXG5cdCdkaXYnXG5cdCdzcGFuJ1xuXHQnaDEnXG5cdCdoMidcblx0J2gzJ1xuXHQnaDQnXG5cdCdoNSdcblx0J2g2J1xuXHQnaGVhZGVyJ1xuXHQnZm9vdGVyJ1xuXHQnc2VjdGlvbidcblx0J2J1dHRvbidcblx0J2JyJ1xuXHQndWwnXG5cdCdvbCdcblx0J2xpJ1xuXHQnZmllbGRzZXQnXG5cdCdpbnB1dCdcblx0J3RleHRhcmVhJ1xuXHQnc2VsZWN0J1xuXHQnb3B0aW9uJ1xuXHQnZm9ybSdcblx0J2ZyYW1lJ1xuXHQnaHInXG5cdCdpZnJhbWUnXG5cdCdpbWcnXG5cdCdwaWN0dXJlJ1xuXHQnbWFpbidcblx0J25hdidcblx0J21ldGEnXG5cdCdvYmplY3QnXG5cdCdwcmUnXG5cdCdzdHlsZSdcblx0J3RhYmxlJ1xuXHQndGJvZHknXG5cdCd0aCdcblx0J3RyJ1xuXHQndGQnXG5cdCd0Zm9vdCdcblx0IyAndGVtcGxhdGUnXG5cdCd2aWRlbydcbl1cblxuXG5mb3Igc2hvcnRjdXQgaW4gc2hvcnRjdXRzIHRoZW4gZG8gKHNob3J0Y3V0KS0+XG5cdHByb3AgPSB0eXBlID0gc2hvcnRjdXRcblx0aWYgaGVscGVycy5pbmNsdWRlcyhzaG9ydGN1dCwgJzonKVxuXHRcdHNwbGl0ID0gc2hvcnRjdXQuc3BsaXQoJzonKVxuXHRcdHByb3AgPSBzcGxpdFswXVxuXHRcdHR5cGUgPSBzcGxpdFsxXVxuXG5cdFF1aWNrRG9tW3Byb3BdID0gKCktPiBRdWlja0RvbSh0eXBlLCBhcmd1bWVudHMuLi4pXG4iLCJ7XG4gIFwiX2Zyb21cIjogXCJxdWlja2RvbUBeMS4wLjcyXCIsXG4gIFwiX2lkXCI6IFwicXVpY2tkb21AMS4wLjgxXCIsXG4gIFwiX2luQnVuZGxlXCI6IGZhbHNlLFxuICBcIl9pbnRlZ3JpdHlcIjogXCJzaGE1MTItb0Npc1BESEdmNmxDVWZnbDhUZ29oVVEyblJkUFVjZmhYd3lhbmoxUXhtcGtMRHdEYmgrSUZCZ293U1BsYWhvV2pkK1BZVURjbXA5U0ZOZi9qQjdwS0E9PVwiLFxuICBcIl9sb2NhdGlvblwiOiBcIi9xdWlja2RvbVwiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwicmFuZ2VcIixcbiAgICBcInJlZ2lzdHJ5XCI6IHRydWUsXG4gICAgXCJyYXdcIjogXCJxdWlja2RvbUBeMS4wLjcyXCIsXG4gICAgXCJuYW1lXCI6IFwicXVpY2tkb21cIixcbiAgICBcImVzY2FwZWROYW1lXCI6IFwicXVpY2tkb21cIixcbiAgICBcInJhd1NwZWNcIjogXCJeMS4wLjcyXCIsXG4gICAgXCJzYXZlU3BlY1wiOiBudWxsLFxuICAgIFwiZmV0Y2hTcGVjXCI6IFwiXjEuMC43MlwiXG4gIH0sXG4gIFwiX3JlcXVpcmVkQnlcIjogW1xuICAgIFwiI1VTRVJcIixcbiAgICBcIi9cIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3F1aWNrZG9tLy0vcXVpY2tkb20tMS4wLjgxLnRnelwiLFxuICBcIl9zaGFzdW1cIjogXCI5YjYwY2M3ZjMxMjViNjdhN2RiZWVhYWQ5OTk4OTRkMzRmNjZmOWM1XCIsXG4gIFwiX3NwZWNcIjogXCJxdWlja2RvbUBeMS4wLjcyXCIsXG4gIFwiX3doZXJlXCI6IFwiL1VzZXJzL2RhbmllbGthbGVuL3NhbmRib3gvcXVpY2tmaWVsZFwiLFxuICBcImF1dGhvclwiOiB7XG4gICAgXCJuYW1lXCI6IFwiZGFuaWVsa2FsZW5cIlxuICB9LFxuICBcImJyb3dzZXJcIjoge1xuICAgIFwiLi9kZWJ1Z1wiOiBcImRpc3QvcXVpY2tkb20uZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9xdWlja2RvbS5qc1wiOiBcInNyYy9pbmRleC5jb2ZmZWVcIlxuICB9LFxuICBcImJyb3dzZXJpZnlcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwic2ltcGx5aW1wb3J0L2NvbXBhdFwiXG4gICAgXVxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZG9tL2lzc3Vlc1wiXG4gIH0sXG4gIFwiYnVuZGxlRGVwZW5kZW5jaWVzXCI6IGZhbHNlLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAZGFuaWVsa2FsZW4vaXNcIjogXCJeMi4wLjBcIixcbiAgICBcInF1aWNrY3NzXCI6IFwiXjEuMy40XCIsXG4gICAgXCJzbWFydC1leHRlbmRcIjogXCJeMS43LjNcIlxuICB9LFxuICBcImRlcHJlY2F0ZWRcIjogZmFsc2UsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJGYXN0ICYgbGlnaHQgRE9NIGVsZW1lbnQgbWFuYWdlbWVudCBzdXBwb3J0aW5nIGpxdWVyeS1saWtlIG1ldGhvZHMsIHRlbXBsYXRlcywgJiBzdGF0ZS1iYXNlZCBzdHlsaW5nXCIsXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjaGFsa1wiOiBcIl4yLjAuMVwiLFxuICAgIFwiY29mZmVlLXNjcmlwdFwiOiBcIl4xLjEyLjZcIixcbiAgICBcImV4ZWNhXCI6IFwiXjAuNy4wXCIsXG4gICAgXCJmcy1qZXRwYWNrXCI6IFwiXjAuMTMuM1wiLFxuICAgIFwicHJvbWlzZS1icmVha1wiOiBcIl4wLjEuMlwiLFxuICAgIFwic2VtdmVyXCI6IFwiXjUuMy4wXCJcbiAgfSxcbiAgXCJkaXJlY3Rvcmllc1wiOiB7XG4gICAgXCJ0ZXN0XCI6IFwidGVzdFwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tkb20jcmVhZG1lXCIsXG4gIFwibGljZW5zZVwiOiBcIklTQ1wiLFxuICBcIm1haW5cIjogXCJkaXN0L3F1aWNrZG9tLmpzXCIsXG4gIFwibmFtZVwiOiBcInF1aWNrZG9tXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZG9tLmdpdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcImNha2UgLWQgYnVpbGQgJiYgY2FrZSBidWlsZCAmJiBjYWtlIG1lYXN1cmUgJiYgY3AgLXIgYnVpbGQvKiBkaXN0L1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJjYWtlIGluc3RhbGw6Y292ZXJhZ2U7IG5wbSBydW4gY292ZXJhZ2U6cnVuICYmIG5wbSBydW4gY292ZXJhZ2U6YmFkZ2VcIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnJ1blwiOiBcImNvdmVyYWdlPXRydWUgbnBtIHJ1biB0ZXN0OmVsZWN0cm9uXCIsXG4gICAgXCJjb3ZlcmFnZTpzaG93XCI6IFwib3BlbiBjb3ZlcmFnZS9sY292LXJlcG9ydC9pbmRleC5odG1sXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJwb3N0dmVyc2lvblwiOiBcIm5wbSBydW4gYnVpbGQgJiYgZ2l0IGFkZCAuICYmIGdpdCBjb21taXQgLWEgLW0gJ1tCdWlsZF0nXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcIm5wbSBydW4gdGVzdDp0cmF2aXNcIixcbiAgICBcInRlc3RcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OmJyb3dzZXJcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRWxlY3Ryb24gLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpjaHJvbWVcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIENocm9tZSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmZpcmVmb3hcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRmlyZWZveCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpsb2NhbFwiOiBcIm9wZW4gdGVzdC90ZXN0cnVubmVyLmh0bWxcIixcbiAgICBcInRlc3Q6bWluaWZpZWRcIjogXCJtaW5pZmllZD0xIG5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6c2FmYXJpXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBTYWZhcmkgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYXVjZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIHNhdWNlPTEga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDp0cmF2aXNcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcIndhdGNoXCI6IFwiY2FrZSAtZCB3YXRjaFwiXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjAuODFcIlxufVxuIiwiSVMgPSBfJHNtKCdAZGFuaWVsa2FsZW4vaXMnIClcbklTID0gSVMuY3JlYXRlKCduYXRpdmVzJywnZG9tJylcbklTLmxvYWRcblx0ZmllbGQ6ICh0YXJnZXQpLT4gdGFyZ2V0IGFuZCB0YXJnZXQgaW5zdGFuY2VvZiByZXF1aXJlKCcuL2ZpZWxkJylcblx0cmVnZXg6ICh0YXJnZXQpLT4gdGFyZ2V0IGluc3RhbmNlb2YgUmVnRXhwXG5cdG9iamVjdGFibGU6ICh0YXJnZXQpLT4gSVMub2JqZWN0KHRhcmdldCkgb3IgSVMuZnVuY3Rpb24odGFyZ2V0KVxuXG5tb2R1bGUuZXhwb3J0cyA9IElTIiwiZXh0ZW5kID0gcmVxdWlyZSAnLi9leHRlbmQnXG5cbm5vcm1hbGl6ZUtleXMgPSAoa2V5cyktPiBpZiBrZXlzXG5cdG91dHB1dCA9IHt9XG5cdGlmIHR5cGVvZiBrZXlzIGlzbnQgJ29iamVjdCdcblx0XHRvdXRwdXRba2V5c10gPSB0cnVlXG5cdGVsc2Vcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoa2V5cykgaWYgbm90IEFycmF5LmlzQXJyYXkoa2V5cylcblx0XHRvdXRwdXRba2V5XSA9IHRydWUgZm9yIGtleSBpbiBrZXlzXG5cblx0cmV0dXJuIG91dHB1dFxuXG5cbm5ld0J1aWxkZXIgPSAoaXNCYXNlKS0+XG5cdGJ1aWxkZXIgPSAodGFyZ2V0KS0+XG5cdFx0RVhQQU5EX0FSR1VNRU5UUyhzb3VyY2VzKVxuXHRcdGlmIGJ1aWxkZXIub3B0aW9ucy50YXJnZXRcblx0XHRcdHRoZVRhcmdldCA9IGJ1aWxkZXIub3B0aW9ucy50YXJnZXRcblx0XHRlbHNlXG5cdFx0XHR0aGVUYXJnZXQgPSB0YXJnZXRcblx0XHRcdHNvdXJjZXMuc2hpZnQoKVxuXHRcdFxuXHRcdGV4dGVuZChidWlsZGVyLm9wdGlvbnMsIHRoZVRhcmdldCwgc291cmNlcylcblx0XG5cdGJ1aWxkZXIuaXNCYXNlID0gdHJ1ZSBpZiBpc0Jhc2Vcblx0YnVpbGRlci5vcHRpb25zID0ge31cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoYnVpbGRlciwgbW9kaWZpZXJzKVxuXHRyZXR1cm4gYnVpbGRlclxuXG5cbm1vZGlmaWVycyA9IFxuXHQnZGVlcCc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5kZWVwID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J293bic6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5vd24gPSB0cnVlXG5cdFx0cmV0dXJuIF9cblxuXHQnYWxsb3dOdWxsJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLmFsbG93TnVsbCA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdudWxsRGVsZXRlcyc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5udWxsRGVsZXRlcyA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdjb25jYXQnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMuY29uY2F0ID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J2Nsb25lJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLnRhcmdldCA9IHt9XG5cdFx0cmV0dXJuIF9cblxuXHQnbm90RGVlcCc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLm5vdERlZXAgPSBub3JtYWxpemVLZXlzKGtleXMpXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cdCdkZWVwT25seSc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLmRlZXBPbmx5ID0gbm9ybWFsaXplS2V5cyhrZXlzKVx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXHQna2V5cyc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLmtleXMgPSBub3JtYWxpemVLZXlzKGtleXMpXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cdCdub3RLZXlzJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuIChrZXlzKS0+XG5cdFx0XHRfLm9wdGlvbnMubm90S2V5cyA9IG5vcm1hbGl6ZUtleXMoa2V5cylcdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblx0J3RyYW5zZm9ybSc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAodHJhbnNmb3JtKS0+XG5cdFx0XHRpZiB0eXBlb2YgdHJhbnNmb3JtIGlzICdmdW5jdGlvbidcblx0XHRcdFx0Xy5vcHRpb25zLmdsb2JhbFRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuXHRcdFx0ZWxzZSBpZiB0cmFuc2Zvcm0gYW5kIHR5cGVvZiB0cmFuc2Zvcm0gaXMgJ29iamVjdCdcblx0XHRcdFx0Xy5vcHRpb25zLnRyYW5zZm9ybXMgPSB0cmFuc2Zvcm1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXG5cdCdmaWx0ZXInOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKGZpbHRlciktPlxuXHRcdFx0aWYgdHlwZW9mIGZpbHRlciBpcyAnZnVuY3Rpb24nXG5cdFx0XHRcdF8ub3B0aW9ucy5nbG9iYWxGaWx0ZXIgPSBmaWx0ZXJcblx0XHRcdGVsc2UgaWYgZmlsdGVyIGFuZCB0eXBlb2YgZmlsdGVyIGlzICdvYmplY3QnXG5cdFx0XHRcdF8ub3B0aW9ucy5maWx0ZXJzID0gZmlsdGVyXG5cdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBuZXdCdWlsZGVyKHRydWUpXG5leHBvcnRzLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nIiwie1xuICBcIl9hcmdzXCI6IFtcbiAgICBbXG4gICAgICBcInNtYXJ0LWV4dGVuZEAxLjcuM1wiLFxuICAgICAgXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCJcbiAgICBdXG4gIF0sXG4gIFwiX2Zyb21cIjogXCJzbWFydC1leHRlbmRAMS43LjNcIixcbiAgXCJfaWRcIjogXCJzbWFydC1leHRlbmRAMS43LjNcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1QVkVFVllERHp5eEtBMEdORkxjV1k2b0pTa1FLZGMxdzcxOGVRcEVIY051VFNXWXhESzM1R3poc0doTWtVVThsQklnU0VEYnQ1eDVwNDZwUnozQXViQT09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3NtYXJ0LWV4dGVuZFwiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwidmVyc2lvblwiLFxuICAgIFwicmVnaXN0cnlcIjogdHJ1ZSxcbiAgICBcInJhd1wiOiBcInNtYXJ0LWV4dGVuZEAxLjcuM1wiLFxuICAgIFwibmFtZVwiOiBcInNtYXJ0LWV4dGVuZFwiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJzbWFydC1leHRlbmRcIixcbiAgICBcInJhd1NwZWNcIjogXCIxLjcuM1wiLFxuICAgIFwic2F2ZVNwZWNcIjogbnVsbCxcbiAgICBcImZldGNoU3BlY1wiOiBcIjEuNy4zXCJcbiAgfSxcbiAgXCJfcmVxdWlyZWRCeVwiOiBbXG4gICAgXCIvXCIsXG4gICAgXCIvcXVpY2tkb21cIixcbiAgICBcIi9zaW1wbHl3YXRjaFwiXG4gIF0sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvc21hcnQtZXh0ZW5kLy0vc21hcnQtZXh0ZW5kLTEuNy4zLnRnelwiLFxuICBcIl9zcGVjXCI6IFwiMS43LjNcIixcbiAgXCJfd2hlcmVcIjogXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJkYW5pZWxrYWxlblwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9zbWFydC1leHRlbmQuZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9zbWFydC1leHRlbmQuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zbWFydC1leHRlbmQvaXNzdWVzXCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiZmFsYWZlbFwiOiBcIl4yLjEuMFwiXG4gIH0sXG4gIFwiZGVzY3JpcHRpb25cIjogXCJNZXJnZS9leHRlbmQgb2JqZWN0cyAoc2hhbGxvdy9kZWVwKSB3aXRoIGdsb2JhbC9pbmRpdmlkdWFsIGZpbHRlcnMgYW5kIG1vcmUgZmVhdHVyZXNcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmFkZ2UtZ2VuXCI6IFwiXjEuMC4yXCIsXG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjQuN1wiLFxuICAgIFwiY2hhaVwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY29mZmVlLXJlZ2lzdGVyXCI6IFwiXjAuMS4wXCIsXG4gICAgXCJjb2ZmZWVpZnktY2FjaGVkXCI6IFwiXjIuMS4xXCIsXG4gICAgXCJleHRlbmRcIjogXCJeMy4wLjFcIixcbiAgICBcImdvb2dsZS1jbG9zdXJlLWNvbXBpbGVyLWpzXCI6IFwiXjIwMTcwNjI2LjAuMFwiLFxuICAgIFwibW9jaGFcIjogXCJeMy4yLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuMC1zMjFcIixcbiAgICBcInNpbXBseXdhdGNoXCI6IFwiXjMuMC4wLWwyXCIsXG4gICAgXCJ1Z2xpZnktanNcIjogXCJeMy4wLjI0XCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zbWFydC1leHRlbmQjcmVhZG1lXCIsXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwiZXh0ZW5kXCIsXG4gICAgXCJjbG9uZVwiLFxuICAgIFwiZmlsdGVyXCIsXG4gICAgXCJzZWxlY3RpdmVcIixcbiAgICBcIm1lcmdlXCIsXG4gICAgXCJhc3NpZ25cIixcbiAgICBcInByb3BlcnRpZXNcIlxuICBdLFxuICBcImxpY2Vuc2VcIjogXCJJU0NcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9zbWFydC1leHRlbmQuanNcIixcbiAgXCJtb2NoYV9vcHRzXCI6IFwiLXUgdGRkIC0tY29tcGlsZXJzIGNvZmZlZTpjb2ZmZWUtcmVnaXN0ZXIgLS1zbG93IDEwMDAgLS10aW1lb3V0IDUwMDBcIixcbiAgXCJuYW1lXCI6IFwic21hcnQtZXh0ZW5kXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3NtYXJ0LWV4dGVuZC5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJta2RpciAtcCBkaXN0LzsgbnBtIHJ1biBidWlsZDpkZWJ1ZyAmJiBucG0gcnVuIGJ1aWxkOnJlbGVhc2VcIixcbiAgICBcImJ1aWxkOmRlYnVnXCI6IFwic2ltcGx5aW1wb3J0IGJ1bmRsZSBzcmMvaW5kZXguY29mZmVlIC1kIC0tdGFyZ2V0IG5vZGUgLS11bWQgc21hcnQtZXh0ZW5kID4gZGlzdC9zbWFydC1leHRlbmQuZGVidWcuanNcIixcbiAgICBcImJ1aWxkOnJlbGVhc2VcIjogXCJzaW1wbHlpbXBvcnQgYnVuZGxlIHNyYy9pbmRleC5jb2ZmZWUgLS10YXJnZXQgbm9kZSAtLXVtZCBzbWFydC1leHRlbmQgPiBkaXN0L3NtYXJ0LWV4dGVuZC5qc1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJucG0gcnVuIGNvdmVyYWdlOnJ1biAmJiBucG0gcnVuIGNvdmVyYWdlOmJhZGdlXCIsXG4gICAgXCJjb3ZlcmFnZTpiYWRnZVwiOiBcImJhZGdlLWdlbiAtZCAuY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiZm9yQ292ZXJhZ2U9dHJ1ZSBpc3RhbmJ1bCBjb3ZlciAtLWRpciBjb3ZlcmFnZSBub2RlX21vZHVsZXMvbW9jaGEvYmluL19tb2NoYSAtLSAkbnBtX3BhY2thZ2VfbW9jaGFfb3B0c1wiLFxuICAgIFwicG9zdHB1Ymxpc2hcIjogXCJnaXQgcHVzaFwiLFxuICAgIFwicG9zdHZlcnNpb25cIjogXCJucG0gcnVuIGJ1aWxkICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJDST0xIG5wbSBydW4gdGVzdFwiLFxuICAgIFwidGVzdFwiOiBcIm1vY2hhICRucG1fcGFja2FnZV9tb2NoYV9vcHRzXCIsXG4gICAgXCJ3YXRjaFwiOiBcInNpbXBseXdhdGNoIC1nICdzcmMvKicgLXggJ25wbSBydW4gYnVpbGQ6ZGVidWcgLXMnXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiY29mZmVlaWZ5LWNhY2hlZFwiLFxuICAgICAgXCIuLy5jb25maWcvdHJhbnNmb3Jtcy9tYWNyb3NcIlxuICAgIF0sXG4gICAgXCJmaW5hbFRyYW5zZm9ybVwiOiBbXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc3VwZXJcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1yZW5hbWVcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zaW1wbGVcIlxuICAgIF1cbiAgfSxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS43LjNcIlxufVxuIiwiQ1NTID0gXyRzbSgncXVpY2tjc3MnIClcbm1vZHVsZS5leHBvcnRzID0gKCktPlxuICAgIENTUy5hbmltYXRpb24gJ2NoZWNrbWFya0FuaW1hdGVTdWNjZXNzVGlwJyxcbiAgICAgICAgJzAlLCA1NCUnOiAge3dpZHRoOjAsIGxlZnQ6MCwgdG9wOjN9XG4gICAgICAgICc3MCUnOiAgICAgIHt3aWR0aDoxNCwgbGVmdDotMiwgdG9wOjh9XG4gICAgICAgICc4NCUnOiAgICAgIHt3aWR0aDo1LCBsZWZ0OjUsIHRvcDoxMH1cbiAgICAgICAgJzEwMCUnOiAgICAge3dpZHRoOjgsIGxlZnQ6MywgdG9wOjEwfVxuXG5cbiAgICBDU1MuYW5pbWF0aW9uICdjaGVja21hcmtBbmltYXRlU3VjY2Vzc0xvbmcnLFxuICAgICAgICAnMCUsIDY1JSc6ICB7d2lkdGg6MCwgcmlnaHQ6MTIsIHRvcDoxMn1cbiAgICAgICAgJzg0JSc6ICAgICAge3dpZHRoOjE0LCByaWdodDowLCB0b3A6N31cbiAgICAgICAgJzEwMCUnOiAgICAge3dpZHRoOjEyLCByaWdodDoyLCB0b3A6OH1cblxuXG4gICAgQ1NTLmFuaW1hdGlvbiAnY2hlY2ttYXJrQW5pbWF0ZUVycm9yJyxcbiAgICAgICAgJzAlLCA2NSUnOiAgdHJhbnNmb3JtOiAnc2NhbGUoMC40KScsIG9wYWNpdHk6IDBcbiAgICAgICAgJzg0JSc6ICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4xNSknXG4gICAgICAgICcxMDAlJzogICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJ1xuXG5cbiAgICBDU1MuYW5pbWF0aW9uICdjaGVja21hcmtSb3RhdGVQbGFjZWhvbGRlcicsXG4gICAgICAgICcwJSwgNSUnOiAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuICAgICAgICAnMTIlLCAxMDAlJzp0cmFuc2Zvcm06ICdyb3RhdGUoLTQwNWRlZyknXG5cblxuICAgIENTUy5hbmltYXRpb24gJ2ZpZWxkRXJyb3JTaGFrZScsXG4gICAgICAgICcwJSwgNTAlJzogIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwcHgpJ1xuICAgICAgICAnMjUlLCA3NSUnOiB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDEwcHgpJ1xuICAgICAgICAnMTAwJSc6ICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCknXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9ICgpLT5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBbJ19nZXRWYWx1ZScsICdfc2V0VmFsdWUnLCAnX3ZhbGlkYXRlJ107XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUpqYjI1emRHRnVkSE12Y21WeFJtbGxiR1JOWlhSb2IyUnpMbU52Wm1abFpTSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJYWDA9IiwiaGVscGVycyA9IGltcG9ydCAnLi4vaGVscGVycydcbklTID0gaW1wb3J0ICcuLi9jaGVja3MnXG5leHRlbmQgPSBpbXBvcnQgJ3NtYXJ0LWV4dGVuZCdcbmZhc3Rkb20gPSBpbXBvcnQgJ2Zhc3Rkb20nXG5TaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcbkNvbmRpdGlvbiA9IGltcG9ydCAnLi4vY29tcG9uZW50cy9jb25kaXRpb24nXG5jdXJyZW50SUQgPSAwXG5cbmNsYXNzIEZpZWxkXG5cdEBpbnN0YW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdEBzaGFsbG93U2V0dGluZ3MgPSBbJ3RlbXBsYXRlcycsICdmaWVsZEluc3RhbmNlcycsICd2YWx1ZScsICdkZWZhdWx0VmFsdWUnXVxuXHRAdHJhbnNmb3JtU2V0dGluZ3MgPSBpbXBvcnQgJy4vdHJhbnNmb3JtU2V0dGluZ3MnXG5cdGNvcmVWYWx1ZVByb3A6ICdfdmFsdWUnXG5cdGdsb2JhbERlZmF1bHRzOiBpbXBvcnQgJy4vZ2xvYmFsRGVmYXVsdHMnXG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMgRmllbGQ6Oixcblx0XHQncmVtb3ZlTGlzdGVuZXInOiBnZXQ6ICgpLT4gQG9mZlxuXHRcdCdlbHMnOiBnZXQ6ICgpLT4gQGVsLmNoaWxkXG5cdFx0J3ZhbHVlUmF3JzogZ2V0OiAoKS0+IEBfdmFsdWVcblx0XHQndmFsdWUnOlxuXHRcdFx0Z2V0OiAoKS0+IGlmIEBzZXR0aW5ncy5nZXR0ZXIgdGhlbiBAc2V0dGluZ3MuZ2V0dGVyKEBfZ2V0VmFsdWUoKSkgZWxzZSBAX2dldFZhbHVlKClcblx0XHRcdHNldDogKHZhbHVlKS0+IEBfc2V0VmFsdWUoaWYgQHNldHRpbmdzLnNldHRlciB0aGVuIEBzZXR0aW5ncy5zZXR0ZXIodmFsdWUpIGVsc2UgdmFsdWUpXG5cdFxuXHRjb25zdHJ1Y3RvcjogKHNldHRpbmdzLCBAYnVpbGRlciwgc2V0dGluZ092ZXJyaWRlcywgdGVtcGxhdGVPdmVycmlkZXMpLT5cblx0XHRpZiBzZXR0aW5nT3ZlcnJpZGVzXG5cdFx0XHRAZ2xvYmFsRGVmYXVsdHMgPSBzZXR0aW5nT3ZlcnJpZGVzLmdsb2JhbERlZmF1bHRzIGlmIHNldHRpbmdPdmVycmlkZXMuZ2xvYmFsRGVmYXVsdHNcblx0XHRcdEBkZWZhdWx0cyA9IHNldHRpbmdPdmVycmlkZXNbc2V0dGluZ3MudHlwZV0gaWYgc2V0dGluZ092ZXJyaWRlc1tzZXR0aW5ncy50eXBlXVxuXHRcdGlmIHRlbXBsYXRlT3ZlcnJpZGVzIGFuZCB0ZW1wbGF0ZU92ZXJyaWRlc1tzZXR0aW5ncy50eXBlXVxuXHRcdFx0QHRlbXBsYXRlcyA9IHRlbXBsYXRlT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdXG5cdFx0XHRAdGVtcGxhdGUgPSB0ZW1wbGF0ZU92ZXJyaWRlc1tzZXR0aW5ncy50eXBlXS5kZWZhdWx0XG5cblx0XHRzaGFsbG93U2V0dGluZ3MgPSBpZiBAc2hhbGxvd1NldHRpbmdzIHRoZW4gRmllbGQuc2hhbGxvd1NldHRpbmdzLmNvbmNhdChAc2hhbGxvd1NldHRpbmdzKSBlbHNlIEZpZWxkLnNoYWxsb3dTZXR0aW5nc1xuXHRcdHRyYW5zZm9ybVNldHRpbmdzID0gaWYgQHRyYW5zZm9ybVNldHRpbmdzIHRoZW4gRmllbGQudHJhbnNmb3JtU2V0dGluZ3MuY29uY2F0KEB0cmFuc2Zvcm1TZXR0aW5ncykgZWxzZSBGaWVsZC50cmFuc2Zvcm1TZXR0aW5nc1xuXG5cdFx0QHNldHRpbmdzID0gZXh0ZW5kLmRlZXAuY2xvbmUubm90RGVlcChzaGFsbG93U2V0dGluZ3MpLnRyYW5zZm9ybSh0cmFuc2Zvcm1TZXR0aW5ncykoQGdsb2JhbERlZmF1bHRzLCBAZGVmYXVsdHMsIHNldHRpbmdzKVxuXHRcdEBJRCA9IEBzZXR0aW5ncy5JRCBvciBjdXJyZW50SUQrKysnJ1xuXHRcdEB0eXBlID0gc2V0dGluZ3MudHlwZVxuXHRcdEBuYW1lID0gc2V0dGluZ3MubmFtZVxuXHRcdEBhbGxGaWVsZHMgPSBAc2V0dGluZ3MuZmllbGRJbnN0YW5jZXMgb3IgRmllbGQuaW5zdGFuY2VzXG5cdFx0QF92YWx1ZSA9IG51bGxcblx0XHRAX2V2ZW50Q2FsbGJhY2tzID0ge31cblx0XHRAc3RhdGUgPVxuXHRcdFx0dmFsaWQ6IHRydWVcblx0XHRcdHZpc2libGU6IHRydWVcblx0XHRcdGZvY3VzZWQ6IGZhbHNlXG5cdFx0XHRob3ZlcmVkOiBmYWxzZVxuXHRcdFx0ZmlsbGVkOiBmYWxzZVxuXHRcdFx0aW50ZXJhY3RlZDogZmFsc2Vcblx0XHRcdGlzTW9iaWxlOiBmYWxzZVxuXHRcdFx0ZGlzYWJsZWQ6IEBzZXR0aW5ncy5kaXNhYmxlZFxuXHRcdFx0bWFyZ2luOiBAc2V0dGluZ3MubWFyZ2luXG5cdFx0XHRwYWRkaW5nOiBAc2V0dGluZ3MucGFkZGluZ1xuXHRcdFx0d2lkdGg6IEBzZXR0aW5ncy53aWR0aFxuXHRcdFx0c2hvd0xhYmVsOiBAc2V0dGluZ3MubGFiZWxcblx0XHRcdGxhYmVsOiBAc2V0dGluZ3MubGFiZWxcblx0XHRcdHNob3dIZWxwOiBAc2V0dGluZ3MuaGVscFxuXHRcdFx0aGVscDogQHNldHRpbmdzLmhlbHBcblx0XHRcdHNob3dFcnJvcjogZmFsc2Vcblx0XHRcdGVycm9yOiBAc2V0dGluZ3MuZXJyb3JcblxuXHRcdGlmIElTLmRlZmluZWQoQHNldHRpbmdzLnBsYWNlaG9sZGVyKVxuXHRcdFx0QHN0YXRlLnBsYWNlaG9sZGVyID0gQHNldHRpbmdzLnBsYWNlaG9sZGVyXG5cblx0XHRpZiBJUy5udW1iZXIoQHNldHRpbmdzLndpZHRoKSBhbmQgQHNldHRpbmdzLndpZHRoIDw9IDFcblx0XHRcdEBzdGF0ZS53aWR0aCA9IFwiI3tAc2V0dGluZ3Mud2lkdGgqMTAwfSVcIlxuXG5cdFx0aWYgQHNldHRpbmdzLmNvbmRpdGlvbnM/Lmxlbmd0aFxuXHRcdFx0QHN0YXRlLnZpc2libGUgPSBmYWxzZVxuXHRcdFx0Q29uZGl0aW9uLmluaXQoQCwgQHNldHRpbmdzLmNvbmRpdGlvbnMpXG5cblx0XHRjb25zb2xlPy53YXJuKFwiRHVwbGljYXRlIGZpZWxkIElEcyBmb3VuZDogJyN7QElEfSdcIikgaWYgQGFsbEZpZWxkc1tASURdXG5cdFx0QGFsbEZpZWxkc1tASURdID0gQFxuXG5cblx0X2NvbnN0cnVjdG9yRW5kOiAoKS0+XG5cdFx0QGVsLmNoaWxkZiMuZmllbGQub24gJ2luc2VydGVkJywgKCk9PiBAZW1pdCgnaW5zZXJ0ZWQnKVxuXHRcdEBlbC5yYXcuaWQgPSBASUQgaWYgQHNldHRpbmdzLklEXG5cblx0XHRAc2V0dGluZ3MuZGVmYXVsdFZhbHVlID89IEBzZXR0aW5ncy52YWx1ZSBpZiBAc2V0dGluZ3MudmFsdWU/XG5cdFx0aWYgQHNldHRpbmdzLmRlZmF1bHRWYWx1ZT9cblx0XHRcdEB2YWx1ZSA9IGlmIEBzZXR0aW5ncy5tdWx0aXBsZSB0aGVuIFtdLmNvbmNhdChAc2V0dGluZ3MuZGVmYXVsdFZhbHVlKSBlbHNlIEBzZXR0aW5ncy5kZWZhdWx0VmFsdWVcblxuXHRcdFNpbXBseUJpbmQoJ3Nob3dFcnJvcicsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCdoZWxwJykub2YoQHN0YXRlKVxuXHRcdFx0LnRyYW5zZm9ybSAoc2hvdyk9PlxuXHRcdFx0XHRpZiBzaG93IGFuZCBAc3RhdGUuZXJyb3IgYW5kIElTLnN0cmluZyhAc3RhdGUuZXJyb3IpXG5cdFx0XHRcdFx0QHN0YXRlLmVycm9yXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRAc2V0dGluZ3MuaGVscCBvciBAc3RhdGUuaGVscFxuXG5cdFx0U2ltcGx5QmluZCgnZXJyb3InLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEBzdGF0ZSlcblx0XHRcdC50bygnaGVscCcpLm9mKEBzdGF0ZSlcblx0XHRcdC5jb25kaXRpb24gKGVycm9yKT0+IGVycm9yIGFuZCBAc3RhdGUuc2hvd0Vycm9yXG5cblx0XHRTaW1wbHlCaW5kKCdoZWxwJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCdodG1sJykub2YoQGVsLmNoaWxkLmhlbHApXG5cdFx0XHQuYW5kLnRvKCdzaG93SGVscCcpLm9mKEBzdGF0ZSlcblxuXHRcdFNpbXBseUJpbmQoJ2xhYmVsJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCd0ZXh0Jykub2YoQGVsLmNoaWxkLmxhYmVsKVxuXHRcdFx0LmFuZC50bygnc2hvd0xhYmVsJykub2YoQHN0YXRlKVxuXG5cdFx0U2ltcGx5QmluZCgnbWFyZ2luJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvIEBlbC5zdHlsZS5iaW5kKEBlbCwgJ21hcmdpbicpXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgncGFkZGluZycpLm9mKEBzdGF0ZSlcblx0XHRcdC50byBAZWwuc3R5bGUuYmluZChAZWwsICdwYWRkaW5nJylcblxuXHRcdFNpbXBseUJpbmQoJ3Nob3dIZWxwJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvIChzaG93LCBwcmV2U2hvdyk9PlxuXHRcdFx0XHRjaGFuZ2VBbW91bnQgPSBpZiAhIXNob3cgaXMgISFwcmV2U2hvdyB0aGVuIDAgZWxzZSBpZiBzaG93IHRoZW4gMjUgZWxzZSBpZiBwcmV2U2hvdyB0aGVuIC0yNVxuXHRcdFx0XHRAc3RhdGUubWFyZ2luID0gaGVscGVycy51cGRhdGVTaG9ydGhhbmRWYWx1ZShAc3RhdGUubWFyZ2luLCAnYm90dG9tJywgY2hhbmdlQW1vdW50KSBpZiBjaGFuZ2VBbW91bnRcblxuXHRcdFNpbXBseUJpbmQoJ2ZvY3VzZWQnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEBzdGF0ZSkudG8gKGZvY3VzZWQpPT5cblx0XHRcdEBlbWl0KGlmIGZvY3VzZWQgdGhlbiAnZm9jdXMnIGVsc2UgJ2JsdXInKVxuXG5cdFx0aWYgQHNldHRpbmdzLm1vYmlsZVdpZHRoXG5cdFx0XHRTaW1wbHlCaW5kICgpPT5cblx0XHRcdFx0ZmFzdGRvbS5tZWFzdXJlICgpPT4gQHN0YXRlLmlzTW9iaWxlID0gd2luZG93LmlubmVyV2lkdGggPD0gQHNldHRpbmdzLm1vYmlsZVRocmVzaG9sZFxuXHRcdFx0LnVwZGF0ZU9uKCdldmVudDpyZXNpemUnKS5vZih3aW5kb3cpXG5cblx0XHRyZXR1cm4gQGVsLnJhdy5fcXVpY2tGaWVsZCA9IEBcblxuXG5cdF9mb3JtYXRXaWR0aDogKHdpZHRoKS0+XG5cdFx0d2lkdGggPSBpZiBAc3RhdGUuaXNNb2JpbGUgdGhlbiAoQHNldHRpbmdzLm1vYmlsZVdpZHRoIG9yIHdpZHRoKSBlbHNlIHdpZHRoXG5cdFx0d2lkdGggPSBcImNhbGMoI3t3aWR0aH0gLSAje0BzZXR0aW5ncy5kaXN0YW5jZX1weClcIiBpZiBAc2V0dGluZ3MuZGlzdGFuY2Vcblx0XHRyZXR1cm4gd2lkdGhcblxuXG5cblxuXG5cblxuXG5cdGFwcGVuZFRvOiAodGFyZ2V0KS0+XG5cdFx0QGVsLmFwcGVuZFRvKHRhcmdldCk7IFx0XHRyZXR1cm4gQFxuXG5cdHByZXBlbmRUbzogKHRhcmdldCktPlxuXHRcdEBlbC5wcmVwZW5kVG8odGFyZ2V0KTsgXHRcdHJldHVybiBAXG5cblx0aW5zZXJ0QWZ0ZXI6ICh0YXJnZXQpLT5cblx0XHRAZWwuaW5zZXJ0QWZ0ZXIodGFyZ2V0KTsgXHRyZXR1cm4gQFxuXG5cdGluc2VydEJlZm9yZTogKHRhcmdldCktPlxuXHRcdEBlbC5pbnNlcnRCZWZvcmUodGFyZ2V0KTsgXHRyZXR1cm4gQFxuXG5cdGRldGFjaDogKHRhcmdldCktPlxuXHRcdEBlbC5kZXRhY2godGFyZ2V0KTsgXHRcdHJldHVybiBAXG5cblx0cmVtb3ZlOiAoKS0+XG5cdFx0QGVsLnJlbW92ZSgpXG5cdFx0cmV0dXJuIEBkZXN0cm95KGZhbHNlKVxuXG5cdGRlc3Ryb3k6IChyZW1vdmVGcm9tRE9NPXRydWUpLT5cblx0XHRTaW1wbHlCaW5kLnVuQmluZEFsbChAKVxuXHRcdFNpbXBseUJpbmQudW5CaW5kQWxsKEBzdGF0ZSlcblx0XHRTaW1wbHlCaW5kLnVuQmluZEFsbChAZWwpXG5cdFx0U2ltcGx5QmluZC51bkJpbmRBbGwoY2hpbGQpIGZvciBjaGlsZCBpbiBAZWwuY2hpbGRcblx0XHRAZWwucmVtb3ZlKCkgaWYgcmVtb3ZlRnJvbURPTVxuXHRcdEBfZGVzdHJveSgpIGlmIEBfZGVzdHJveVxuXHRcdGRlbGV0ZSBAYWxsRmllbGRzW0BJRF1cblx0XHRyZXR1cm4gdHJ1ZVxuXG5cdG9uOiAoZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUpLT5cblx0XHRAZWwub24uY2FsbChAZWwsIGV2ZW50TmFtZXMsIGNhbGxiYWNrLCB1c2VDYXB0dXJlLCB0cnVlKVxuXHRcdHJldHVybiBAXG5cblx0b25jZTogKGV2ZW50TmFtZXMsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKS0+XG5cdFx0QG9uIGV2ZW50TmFtZXMsICgpPT5cblx0XHRcdEBvZmYoZXZlbnROYW1lcywgY2FsbGJhY2spXG5cdFx0XHRjYWxsYmFjay5hcHBseShAZWwsIGFyZ3VtZW50cylcblx0XHQsIHVzZUNhcHR1cmVcblxuXHRvZmY6ICgpLT5cblx0XHRAZWwub2ZmLmFwcGx5KEBlbCwgYXJndW1lbnRzKVxuXHRcdHJldHVybiBAXG5cblx0ZW1pdDogKCktPlxuXHRcdEBlbC5lbWl0UHJpdmF0ZS5hcHBseShAZWwsIGFyZ3VtZW50cylcblx0XHRyZXR1cm4gQFxuXG5cdHZhbGlkYXRlOiAocHJvdmlkZWRWYWx1ZT1AW0Bjb3JlVmFsdWVQcm9wXSwgdGVzdFVucmVxdWlyZWQpLT5cblx0XHRpc1ZhbGlkID0gc3dpdGNoXG5cdFx0XHR3aGVuIEBzZXR0aW5ncy52YWxpZGF0b3IgdGhlbiBAc2V0dGluZ3MudmFsaWRhdG9yKHByb3ZpZGVkVmFsdWUpXG5cdFx0XHRcblx0XHRcdHdoZW4gbm90IEBzZXR0aW5ncy5yZXF1aXJlZCBhbmQgbm90IHRlc3RVbnJlcXVpcmVkIHRoZW4gdHJ1ZVxuXG5cdFx0XHR3aGVuIEBfdmFsaWRhdGUocHJvdmlkZWRWYWx1ZSwgdGVzdFVucmVxdWlyZWQpIGlzIGZhbHNlIHRoZW4gZmFsc2VcblxuXHRcdFx0d2hlbiBAc2V0dGluZ3MucmVxdWlyZWRcblx0XHRcdFx0aWYgQHNldHRpbmdzLm11bHRpcGxlIHRoZW4gISFwcm92aWRlZFZhbHVlPy5sZW5ndGggZWxzZSAhIXByb3ZpZGVkVmFsdWVcblx0XHRcdFxuXHRcdFx0ZWxzZSB0cnVlXG5cblx0XHRAc3RhdGUuc2hvd0Vycm9yID0gZmFsc2UgaWYgaXNWYWxpZCBhbmQgQHNldHRpbmdzLmNsZWFyRXJyb3JPblZhbGlkXG5cdFx0cmV0dXJuIGlzVmFsaWRcblxuXHR2YWxpZGF0ZUNvbmRpdGlvbnM6IChjb25kaXRpb25zKS0+XG5cdFx0aWYgY29uZGl0aW9uc1xuXHRcdFx0dG9nZ2xlVmlzaWJpbGl0eSA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0Y29uZGl0aW9ucyA9IEBjb25kaXRpb25zXG5cdFx0XHR0b2dnbGVWaXNpYmlsaXR5ID0gdHJ1ZVxuXHRcdFxuXHRcdHBhc3NlZENvbmRpdGlvbnMgPSBDb25kaXRpb24udmFsaWRhdGUoY29uZGl0aW9ucylcblx0XHRpZiB0b2dnbGVWaXNpYmlsaXR5XG5cdFx0XHRyZXR1cm4gQHN0YXRlLnZpc2libGUgPSBwYXNzZWRDb25kaXRpb25zXG5cdFx0ZWxzZSBcblx0XHRcdHJldHVybiBwYXNzZWRDb25kaXRpb25zXG5cblx0dmFsaWRhdGVBbmRSZXBvcnQ6IChwcm92aWRlZFZhbHVlKS0+XG5cdFx0aXNWYWxpZCA9IEB2YWxpZGF0ZShudWxsLCB0cnVlKVxuXHRcdEBzdGF0ZS5zaG93RXJyb3IgPSAhaXNWYWxpZFxuXHRcdHJldHVybiBpc1ZhbGlkXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpZWxkIiwiJ2NvbmRpdGlvbnMnOiAoY29uZGl0aW9ucyktPlxuXHRpZiBJUy5vYmplY3RQbGFpbihjb25kaXRpb25zKVxuXHRcdHt0YXJnZXQsIHZhbHVlfSBmb3IgdGFyZ2V0LHZhbHVlIG9mIGNvbmRpdGlvbnNcblx0ZWxzZSBpZiBJUy5hcnJheShjb25kaXRpb25zKVxuXHRcdGNvbmRpdGlvbnMubWFwIChpdGVtKS0+IGlmIElTLnN0cmluZyhpdGVtKSB0aGVuIHt0YXJnZXQ6aXRlbX0gZWxzZSBpdGVtXG5cbidjaG9pY2VzJzogKGNob2ljZXMpLT5cblx0aWYgSVMub2JqZWN0UGxhaW4oY2hvaWNlcylcblx0XHR7bGFiZWwsdmFsdWV9IGZvciBsYWJlbCx2YWx1ZSBvZiBjaG9pY2VzXG5cdGVsc2UgaWYgSVMuYXJyYXkoY2hvaWNlcylcblx0XHRjaG9pY2VzLm1hcCAoaXRlbSktPiBpZiBub3QgSVMub2JqZWN0UGxhaW4oaXRlbSkgdGhlbiB7bGFiZWw6aXRlbSwgdmFsdWU6aXRlbX0gZWxzZSBpdGVtXG5cbid2YWxpZFdoZW5SZWdleCc6IChyZWdleCktPlxuXHRpZiBJUy5zdHJpbmcocmVnZXgpIHRoZW4gbmV3IFJlZ0V4cChyZWdleCkgZWxzZSByZWdleCIsIkRyb3Bkb3duID0gaW1wb3J0ICcuLi8uLi9jb21wb25lbnRzL2Ryb3Bkb3duJ1xuTWFzayA9IGltcG9ydCAnLi4vLi4vY29tcG9uZW50cy9tYXNrJ1xuUkVHRVggPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9yZWdleCdcbktFWUNPREVTID0gaW1wb3J0ICcuLi8uLi9jb25zdGFudHMva2V5Q29kZXMnXG5oZWxwZXJzID0gaW1wb3J0ICcuLi8uLi9oZWxwZXJzJ1xuSVMgPSBpbXBvcnQgJy4uLy4uL2NoZWNrcydcbkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5leHRlbmQgPSBpbXBvcnQgJ3NtYXJ0LWV4dGVuZCdcblNpbXBseUJpbmQgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kJ1xuaW1wb3J0IHRlbXBsYXRlLCogYXMgdGVtcGxhdGVzIGZyb20gJy4vdGVtcGxhdGUnXG5pbXBvcnQgKiBhcyBkZWZhdWx0cyBmcm9tICcuL2RlZmF1bHRzJ1xuXG5jbGFzcyBUZXh0RmllbGQgZXh0ZW5kcyBpbXBvcnQgJy4uLydcblx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdHRlbXBsYXRlczogdGVtcGxhdGVzXG5cdGRlZmF1bHRzOiBkZWZhdWx0c1xuXG5cdGNvbnN0cnVjdG9yOiAoKS0+XG5cdFx0c3VwZXJcblx0XHRAX3ZhbHVlID89ICcnXG5cdFx0QHN0YXRlLnR5cGluZyA9IGZhbHNlXG5cdFx0QGN1cnNvciA9IHByZXY6MCwgY3VycmVudDowXG5cblx0XHRpZiBub3QgQHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4XG5cdFx0XHRpZiBAc2V0dGluZ3Mua2V5Ym9hcmQgaXMgJ2VtYWlsJyBhbmQgQHNldHRpbmdzLnJlcXVpcmVkXG5cdFx0XHRcdEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleCA9IFJFR0VYLmVtYWlsXG5cdFx0XHRlbHNlIGlmIEBzZXR0aW5ncy5tYXNrIGlzICdOQU1FJyBvciBAc2V0dGluZ3MubWFzay5wYXR0ZXJuIGlzICdOQU1FJ1xuXHRcdFx0XHRAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXggPSAvXlthLXpBLVpdezJ9L1xuXHRcdFx0ZWxzZSBpZiBAc2V0dGluZ3MubWFzayBpcyAnRlVMTE5BTUUnIG9yIEBzZXR0aW5ncy5tYXNrLnBhdHRlcm4gaXMgJ0ZVTExOQU1FJ1xuXHRcdFx0XHRAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXggPSAvXlthLXpBLVpdK1xccytbYS16QS1aXSsvXG5cblx0XHRpZiBub3QgQHNldHRpbmdzLm1hc2sucGF0dGVyblxuXHRcdFx0aWYgSVMuc3RyaW5nKEBzZXR0aW5ncy5tYXNrKVxuXHRcdFx0XHRAc2V0dGluZ3MubWFzayA9IGV4dGVuZC5kZWVwLmNsb25lKEBkZWZhdWx0cy5tYXNrLCBwYXR0ZXJuOkBzZXR0aW5ncy5tYXNrKVxuXG5cdFx0XHRlbHNlIGlmIElTLm9iamVjdChAc2V0dGluZ3MubWFzaylcblx0XHRcdFx0QHNldHRpbmdzLm1hc2sucGF0dGVybiA9IHN3aXRjaCBAc2V0dGluZ3Mua2V5Ym9hcmRcblx0XHRcdFx0XHR3aGVuICdkYXRlJyB0aGVuICdEQVRFJ1xuXHRcdFx0XHRcdHdoZW4gJ251bWJlcicgdGhlbiAnTlVNQkVSJ1xuXHRcdFx0XHRcdHdoZW4gJ3Bob25lJywndGVsJyB0aGVuICdQSE9ORSdcblx0XHRcdFx0XHR3aGVuICdlbWFpbCcgdGhlbiAnRU1BSUwnXG5cdFx0XHRcblx0XHRAbWFzayA9IG5ldyBNYXNrKEAsIEBzZXR0aW5ncy5tYXNrKSBpZiBAc2V0dGluZ3MubWFzay5wYXR0ZXJuXG5cdFx0QF9jcmVhdGVFbGVtZW50cygpXG5cdFx0QF9hdHRhY2hCaW5kaW5ncygpXG5cdFx0QF9jb25zdHJ1Y3RvckVuZCgpXG5cblxuXHRfZ2V0VmFsdWU6ICgpLT5cblx0XHRpZiBAZHJvcGRvd24gYW5kIEBzZWxlY3RlZCBhbmQgQF92YWx1ZSBpcyBAc2VsZWN0ZWQubGFiZWxcblx0XHRcdHJldHVybiBAc2VsZWN0ZWQudmFsdWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gQF92YWx1ZVxuXG5cdF9zZXRWYWx1ZTogKG5ld1ZhbHVlKS0+IGlmIElTLnN0cmluZyhuZXdWYWx1ZSkgb3IgSVMubnVtYmVyKG5ld1ZhbHVlKVxuXHRcdG5ld1ZhbHVlID0gU3RyaW5nKG5ld1ZhbHVlKVxuXHRcdEBfdmFsdWUgPSBpZiBAbWFzayB0aGVuIEBtYXNrLnNldFZhbHVlKG5ld1ZhbHVlKSBlbHNlIG5ld1ZhbHVlXG5cblx0X3JlY2FsY0Rpc3BsYXk6ICgpLT5cblx0XHRAX3ZhbHVlID0gQF92YWx1ZSBpZiBAc2V0dGluZ3MuYXV0b1dpZHRoXG5cblxuXHRfY3JlYXRlRWxlbWVudHM6ICgpLT5cblx0XHRnbG9iYWxPcHRzID0ge3JlbGF0ZWRJbnN0YW5jZTpAfVxuXHRcdEBlbCA9IEB0ZW1wbGF0ZS5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmRlZmF1bHQsIGdsb2JhbE9wdHMpXG5cblx0XHRpZiBAc2V0dGluZ3MuY2hvaWNlc1xuXHRcdFx0QGRyb3Bkb3duID0gbmV3IERyb3Bkb3duKEBzZXR0aW5ncy5jaG9pY2VzLCBAKVxuXHRcdFx0QGRyb3Bkb3duLmFwcGVuZFRvKEBlbC5jaGlsZC5pbm5lcndyYXApXG5cblx0XHRpZiBAc2V0dGluZ3MuaWNvblxuXHRcdFx0QHRlbXBsYXRlcy5pY29uLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuaWNvbiwgZ2xvYmFsT3B0cykuYXBwZW5kKEBzZXR0aW5ncy5pY29uKS5pbnNlcnRCZWZvcmUoQGVsLmNoaWxkLmlucHV0KVxuXG5cdFx0aWYgQHNldHRpbmdzLmNoZWNrbWFya1xuXHRcdFx0QHRlbXBsYXRlcy5jaGVja21hcmsuc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5jaGVja21hcmssIGdsb2JhbE9wdHMpLmluc2VydEFmdGVyKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcblx0XHRAZWwuY2hpbGQuaW5wdXQucHJvcCAndHlwZScsIHN3aXRjaCBAc2V0dGluZ3Mua2V5Ym9hcmRcblx0XHRcdHdoZW4gJ251bWJlcicsJ3RlbCcsJ3Bob25lJyB0aGVuICd0ZWwnXG5cdFx0XHR3aGVuICdwYXNzd29yZCcgdGhlbiAncGFzc3dvcmQnXG5cdFx0XHR3aGVuICd1cmwnIHRoZW4gJ3VybCdcblx0XHRcdCMgd2hlbiAnZW1haWwnIHRoZW4gJ2VtYWlsJ1xuXHRcdFx0ZWxzZSAndGV4dCdcblxuXHRcdEBlbC5zdGF0ZSAnaGFzTGFiZWwnLCBAc2V0dGluZ3MubGFiZWxcblx0XHRAZWwuY2hpbGQuaW5uZXJ3cmFwLnJhdy5fcXVpY2tGaWVsZCA9IEBlbC5jaGlsZC5pbnB1dC5yYXcuX3F1aWNrRmllbGQgPSBAXG5cdFx0cmV0dXJuIEBlbC5jaGlsZGZcblxuXG5cdF9hdHRhY2hCaW5kaW5nczogKCktPlxuXHRcdEBfYXR0YWNoQmluZGluZ3NfZWxTdGF0ZSgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5KClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXlfYXV0b1dpZHRoKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX3ZhbHVlKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX2F1dG9jb21wbGV0ZSgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc19zdGF0ZVRyaWdnZXJzKClcblx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc19lbFN0YXRlOiAoKS0+XG5cdFx0U2ltcGx5QmluZCgndmlzaWJsZScpLm9mKEBzdGF0ZSkudG8gXHQodmlzaWJsZSk9PiBAZWwuc3RhdGUgJ3Zpc2libGUnLCB2aXNpYmxlXG5cdFx0U2ltcGx5QmluZCgnaG92ZXJlZCcpLm9mKEBzdGF0ZSkudG8gXHQoaG92ZXJlZCk9PiBAZWwuc3RhdGUgJ2hvdmVyJywgaG92ZXJlZFxuXHRcdFNpbXBseUJpbmQoJ2ZvY3VzZWQnKS5vZihAc3RhdGUpLnRvIFx0KGZvY3VzZWQpPT4gQGVsLnN0YXRlICdmb2N1cycsIGZvY3VzZWRcblx0XHRTaW1wbHlCaW5kKCdmaWxsZWQnKS5vZihAc3RhdGUpLnRvIFx0XHQoZmlsbGVkKT0+IEBlbC5zdGF0ZSAnZmlsbGVkJywgZmlsbGVkXG5cdFx0U2ltcGx5QmluZCgnZGlzYWJsZWQnKS5vZihAc3RhdGUpLnRvIFx0KGRpc2FibGVkKT0+IEBlbC5zdGF0ZSAnZGlzYWJsZWQnLCBkaXNhYmxlZFxuXHRcdFNpbXBseUJpbmQoJ3Nob3dMYWJlbCcpLm9mKEBzdGF0ZSkudG8gXHQoc2hvd0xhYmVsKT0+IEBlbC5zdGF0ZSAnc2hvd0xhYmVsJywgc2hvd0xhYmVsXG5cdFx0U2ltcGx5QmluZCgnc2hvd0Vycm9yJykub2YoQHN0YXRlKS50byBcdChzaG93RXJyb3IpPT4gQGVsLnN0YXRlICdzaG93RXJyb3InLCBzaG93RXJyb3Jcblx0XHRTaW1wbHlCaW5kKCdzaG93SGVscCcpLm9mKEBzdGF0ZSkudG8gXHQoc2hvd0hlbHApPT4gQGVsLnN0YXRlICdzaG93SGVscCcsIHNob3dIZWxwXG5cdFx0U2ltcGx5QmluZCgndmFsaWQnKS5vZihAc3RhdGUpLnRvICh2YWxpZCk9PlxuXHRcdFx0QGVsLnN0YXRlICd2YWxpZCcsIHZhbGlkXG5cdFx0XHRAZWwuc3RhdGUgJ2ludmFsaWQnLCAhdmFsaWRcblx0XHRcblx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5OiAoKS0+XG5cdFx0U2ltcGx5QmluZCgncGxhY2Vob2xkZXInKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ3RleHQnKS5vZihAZWwuY2hpbGQucGxhY2Vob2xkZXIpXG5cdFx0XHRcdC50cmFuc2Zvcm0gKHBsYWNlaG9sZGVyKT0+IHN3aXRjaFxuXHRcdFx0XHRcdHdoZW4gcGxhY2Vob2xkZXIgaXMgdHJ1ZSBhbmQgQHNldHRpbmdzLmxhYmVsIHRoZW4gQHNldHRpbmdzLmxhYmVsXG5cdFx0XHRcdFx0d2hlbiBJUy5zdHJpbmcocGxhY2Vob2xkZXIpIHRoZW4gcGxhY2Vob2xkZXJcblx0XHRcdFx0XHRlbHNlICcnXG5cblx0XHRTaW1wbHlCaW5kKCdkaXNhYmxlZCcsIHVwZGF0ZU9uQmluZDpAc3RhdGUuZGlzYWJsZWQpLm9mKEBzdGF0ZSlcblx0XHRcdC50byAoZGlzYWJsZWQsIHByZXYpPT4gaWYgQHNldHRpbmdzLmNoZWNrbWFya1xuXHRcdFx0XHRpZiBkaXNhYmxlZCBvciAobm90IGRpc2FibGVkIGFuZCBwcmV2PykgdGhlbiBzZXRUaW1lb3V0ICgpPT5cblx0XHRcdFx0XHRAZWwuY2hpbGQuY2hlY2ttYXJrX21hc2sxLnJlY2FsY1N0eWxlKClcblx0XHRcdFx0XHRAZWwuY2hpbGQuY2hlY2ttYXJrX21hc2syLnJlY2FsY1N0eWxlKClcblx0XHRcdFx0XHRAZWwuY2hpbGQuY2hlY2ttYXJrX3BhdGNoLnJlY2FsY1N0eWxlKClcblx0XHRcdFx0XHQjIEBlbC5jaGlsZC5jaGVja21hcmsucmVjYWxjU3R5bGUodHJ1ZSlcblx0XHRcblx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5X2F1dG9XaWR0aDogKCktPlxuXHRcdFNpbXBseUJpbmQoJ3dpZHRoJywgdXBkYXRlRXZlbklmU2FtZTp0cnVlKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gKHdpZHRoKT0+IChpZiBAc2V0dGluZ3MuYXV0b1dpZHRoIHRoZW4gQGVsLmNoaWxkLmlucHV0IGVsc2UgQGVsKS5zdHlsZSgnd2lkdGgnLCB3aWR0aClcblx0XHRcdC50cmFuc2Zvcm0gQF9mb3JtYXRXaWR0aC5iaW5kKEApXG5cdFx0XHQudXBkYXRlT24oJ2lzTW9iaWxlJykub2YoQHN0YXRlKVxuXG5cdFx0aWYgQHNldHRpbmdzLmF1dG9XaWR0aFxuXHRcdFx0U2ltcGx5QmluZCgnX3ZhbHVlJywgdXBkYXRlRXZlbklmU2FtZTp0cnVlLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEApXG5cdFx0XHRcdC50bygnd2lkdGgnKS5vZihAc3RhdGUpXG5cdFx0XHRcdFx0LnRyYW5zZm9ybSAoKT0+IFwiI3tAX2dldElucHV0QXV0b1dpZHRoKCl9cHhcIlxuXHRcdFx0XHRcdC51cGRhdGVPbignZXZlbnQ6aW5zZXJ0ZWQnKS5vZihAZWwpXG5cdFx0XHRcdFx0LnVwZGF0ZU9uKCd2aXNpYmxlJykub2YoQHN0YXRlKVxuXHRcdFxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX3ZhbHVlOiAoKS0+XG5cdFx0aW5wdXQgPSBAZWwuY2hpbGQuaW5wdXQucmF3XG5cdFx0XG5cdFx0cmVzZXRJbnB1dCA9ICgpPT5cblx0XHRcdGZpbGxlZCA9ICFAbWFzay5pc0VtcHR5KClcblx0XHRcdGlmIG5vdCBmaWxsZWRcblx0XHRcdFx0QHNlbGVjdGlvbihAbWFzay5jdXJzb3IgPSAwKVxuXHRcdFx0XHRAX3ZhbHVlID0gJydcblx0XHRcdFx0QHN0YXRlLmZpbGxlZCA9IGZhbHNlXG5cdFx0XHRcblx0XHRcdHJldHVybiBmaWxsZWRcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDppbnB1dCcpLm9mKGlucHV0KS50byAoKT0+XG5cdFx0XHRAdmFsdWUgPSBpbnB1dC52YWx1ZVxuXHRcdFx0QHNlbGVjdGlvbihAbWFzay5jdXJzb3IpIGlmIEBtYXNrXG5cdFx0XHRAZW1pdCgnaW5wdXQnLCBAdmFsdWUpXG5cblx0XHRTaW1wbHlCaW5kKCdfdmFsdWUnLCB1cGRhdGVFdmVuSWZTYW1lOiEhQG1hc2spLm9mKEApXG5cdFx0XHQudG8oJ3ZhbHVlJykub2YoaW5wdXQpXHRcdFxuXHRcdFx0LmFuZC50byAodmFsdWUpPT5cblx0XHRcdFx0ZmlsbGVkID0gISF2YWx1ZVxuXHRcdFx0XHRmaWxsZWQgPSByZXNldElucHV0KCkgaWYgZmlsbGVkIGFuZCBAbWFzayBhbmQgQG1hc2suZ3VpZGUgYW5kICghQHN0YXRlLmZvY3VzZWQgb3IgQG1hc2suY3Vyc29yIGlzIDApXG5cdFx0XHRcdEBzdGF0ZS5maWxsZWQgPSBmaWxsZWRcblx0XHRcdFx0QHN0YXRlLmludGVyYWN0ZWQgPSB0cnVlIGlmIGZpbGxlZFxuXHRcdFx0XHRAc3RhdGUudmFsaWQgPSBAdmFsaWRhdGUobnVsbCwgdHJ1ZSlcblx0XHRcdFx0QGVtaXQoJ2lucHV0JywgQHZhbHVlKSB1bmxlc3MgQHN0YXRlLmZvY3VzZWRcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmtleWRvd24nKS5vZihAZWwuY2hpbGQuaW5wdXQpLnRvIChldmVudCk9PlxuXHRcdFx0QGVtaXQoJ3N1Ym1pdCcpIGlmIGV2ZW50LmtleUNvZGUgaXMgS0VZQ09ERVMuZW50ZXJcblx0XHRcdEBlbWl0KFwia2V5LSN7ZXZlbnQua2V5Q29kZX1cIilcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmJsdXInKS5vZihAZWwuY2hpbGQuaW5wdXQpLnRvKHJlc2V0SW5wdXQpIGlmIEBtYXNrIGFuZCBAbWFzay5ndWlkZVxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2F1dG9jb21wbGV0ZTogKCktPiBpZiBAZHJvcGRvd25cblx0XHRTaW1wbHlCaW5kLmRlZmF1bHRPcHRpb25zLnVwZGF0ZU9uQmluZCA9IGZhbHNlXG5cblx0XHRTaW1wbHlCaW5kKCd0eXBpbmcnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUpLm9mKEBzdGF0ZSkudG8gKGlzVHlwaW5nKT0+XG5cdFx0XHRpZiBpc1R5cGluZ1xuXHRcdFx0XHRyZXR1cm4gaWYgbm90IEBfdmFsdWVcblx0XHRcdFx0aWYgQGRyb3Bkb3duLmlzT3BlblxuXHRcdFx0XHRcdEBkcm9wZG93bi5saXN0LmNhbGNEaXNwbGF5KClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBkcm9wZG93bi5pc09wZW4gPSB0cnVlXG5cdFx0XHRcdFx0U2ltcGx5QmluZCgnZXZlbnQ6Y2xpY2snKS5vZihkb2N1bWVudClcblx0XHRcdFx0XHRcdC5vbmNlLnRvICgpPT4gQGRyb3Bkb3duLmlzT3BlbiA9IGZhbHNlXG5cdFx0XHRcdFx0XHQuY29uZGl0aW9uIChldmVudCk9PiBub3QgRE9NKGV2ZW50LnRhcmdldCkucGFyZW50TWF0Y2hpbmcgKHBhcmVudCk9PiBwYXJlbnQgaXMgQGVsLmNoaWxkLmlubmVyd3JhcFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAZHJvcGRvd24uaXNPcGVuID0gZmFsc2VcblxuXHRcdFNpbXBseUJpbmQoJ192YWx1ZScpLm9mKEApLnRvICh2YWx1ZSk9PlxuXHRcdFx0Zm9yIGNob2ljZSBpbiBAZHJvcGRvd24uY2hvaWNlc1xuXHRcdFx0XHRzaG91bGRCZVZpc2libGUgPSBpZiBub3QgdmFsdWUgdGhlbiB0cnVlIGVsc2UgaGVscGVycy5mdXp6eU1hdGNoKHZhbHVlLCBjaG9pY2UubGFiZWwpXG5cdFx0XHRcdGNob2ljZS52aXNpYmxlID0gc2hvdWxkQmVWaXNpYmxlIGlmIGNob2ljZS52aXNpYmxlIGlzbnQgc2hvdWxkQmVWaXNpYmxlXG5cblx0XHRcdGlmIEBkcm9wZG93bi5pc09wZW4gYW5kIG5vdCB2YWx1ZVxuXHRcdFx0XHRAZHJvcGRvd24uaXNPcGVuID0gZmFsc2Vcblx0XHRcdHJldHVyblxuXG5cblx0XHRAZHJvcGRvd24ub25TZWxlY3RlZCAoc2VsZWN0ZWRDaG9pY2UpPT5cblx0XHRcdEBzZWxlY3RlZCA9IHNlbGVjdGVkQ2hvaWNlXG5cdFx0XHRAdmFsdWUgPSBzZWxlY3RlZENob2ljZS5sYWJlbFxuXHRcdFx0QGRyb3Bkb3duLmlzT3BlbiA9IGZhbHNlXG5cdFx0XHRAc2VsZWN0aW9uKEBlbC5jaGlsZC5pbnB1dC5yYXcudmFsdWUubGVuZ3RoKVxuXHRcdFxuXG5cdFx0U2ltcGx5QmluZC5kZWZhdWx0T3B0aW9ucy51cGRhdGVPbkJpbmQgPSB0cnVlXG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3Nfc3RhdGVUcmlnZ2VyczogKCktPlxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50Om1vdXNlZW50ZXInKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUuaG92ZXJlZCA9IHRydWVcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDptb3VzZWxlYXZlJykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQHN0YXRlLmhvdmVyZWQgPSBmYWxzZVxuXG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6Zm9jdXMnKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUuZm9jdXNlZCA9IHRydWU7IGlmIEBzdGF0ZS5kaXNhYmxlZCB0aGVuIEBibHVyKClcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDpibHVyJykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQHN0YXRlLnR5cGluZyA9IEBzdGF0ZS5mb2N1c2VkID0gZmFsc2Vcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDppbnB1dCcpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBzdGF0ZS50eXBpbmcgPSB0cnVlXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6a2V5ZG93bicpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBjdXJzb3IucHJldiA9IEBzZWxlY3Rpb24oKS5lbmRcblxuXHRcdHJldHVyblxuXG5cblx0X3NjaGVkdWxlQ3Vyc29yUmVzZXQ6ICgpLT5cblx0XHRkaWZmSW5kZXggPSBoZWxwZXJzLmdldEluZGV4T2ZGaXJzdERpZmYoQG1hc2sudmFsdWUsIEBtYXNrLnByZXYudmFsdWUpXG5cdFx0Y3VycmVudEN1cnNvciA9IEBjdXJzb3IuY3VycmVudFxuXHRcdG5ld0N1cnNvciA9IEBtYXNrLm5vcm1hbGl6ZUN1cnNvclBvcyhjdXJyZW50Q3Vyc29yLCBAY3Vyc29yLnByZXYpXG5cblx0XHRpZiBuZXdDdXJzb3IgaXNudCBjdXJyZW50Q3Vyc29yXG5cdFx0XHRAc2VsZWN0aW9uKG5ld0N1cnNvcilcblx0XHRyZXR1cm5cblxuXG5cdF9zZXRWYWx1ZUlmTm90U2V0OiAoKS0+XG5cdFx0aWYgQGVsLmNoaWxkLmlucHV0LnJhdy52YWx1ZSBpc250IEBfdmFsdWVcblx0XHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcudmFsdWUgPSBAX3ZhbHVlXG5cdFx0cmV0dXJuXG5cblxuXG5cdF9nZXRJbnB1dEF1dG9XaWR0aDogKCktPlxuXHRcdGlmIEBfdmFsdWVcblx0XHRcdEBfc2V0VmFsdWVJZk5vdFNldCgpXG5cdFx0XHRAZWwuY2hpbGQuaW5wdXQuc3R5bGUoJ3dpZHRoJywgMClcblx0XHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcuc2Nyb2xsTGVmdCA9IDFlKzEwXG5cdFx0XHRpbnB1dFdpZHRoID0gTWF0aC5tYXgoQGVsLmNoaWxkLmlucHV0LnJhdy5zY3JvbGxMZWZ0K0BlbC5jaGlsZC5pbnB1dC5yYXcub2Zmc2V0V2lkdGgsIEBlbC5jaGlsZC5pbnB1dC5yYXcuc2Nyb2xsV2lkdGgpICsgMlxuXHRcdFx0bGFiZWxXaWR0aCA9IGlmIEBzZXR0aW5ncy5sYWJlbCBhbmQgQGVsLmNoaWxkLmxhYmVsLnN0eWxlU2FmZSgncG9zaXRpb24nKSBpcyAnYWJzb2x1dGUnIHRoZW4gQGVsLmNoaWxkLmxhYmVsLnJlY3Qud2lkdGggZWxzZSAwXG5cdFx0ZWxzZVxuXHRcdFx0aW5wdXRXaWR0aCA9IEBlbC5jaGlsZC5wbGFjZWhvbGRlci5yZWN0LndpZHRoXG5cdFx0XHRsYWJlbFdpZHRoID0gMFxuXHRcdFxuXHRcdHJldHVybiBNYXRoLm1pbiBAX2dldFdpZHRoU2V0dGluZygnbWF4JyksIE1hdGgubWF4KEBfZ2V0V2lkdGhTZXR0aW5nKCdtaW4nKSwgaW5wdXRXaWR0aCwgbGFiZWxXaWR0aClcblxuXG5cdF9nZXRXaWR0aFNldHRpbmc6ICh0YXJnZXQpLT5cblx0XHR0YXJnZXQgKz0gJ1dpZHRoJyBpZiB0YXJnZXQgaXMgJ21pbicgb3IgdGFyZ2V0IGlzICdtYXgnXHRcdFxuXHRcdGlmIHR5cGVvZiBAc2V0dGluZ3NbdGFyZ2V0XSBpcyAnbnVtYmVyJ1xuXHRcdFx0cmVzdWx0ID0gQHNldHRpbmdzW3RhcmdldF1cblx0XHRcblx0XHRlbHNlIGlmXHR0eXBlb2YgQHNldHRpbmdzW3RhcmdldF0gaXMgJ3N0cmluZydcblx0XHRcdHJlc3VsdCA9IHBhcnNlRmxvYXQoQHNldHRpbmdzW3RhcmdldF0pXG5cblx0XHRcdGlmIGhlbHBlcnMuaW5jbHVkZXMoQHNldHRpbmdzW3RhcmdldF0sICclJylcblx0XHRcdFx0aWYgKHBhcmVudD1AZWwucGFyZW50KSBhbmQgcGFyZW50LnN0eWxlKCdkaXNwbGF5JykgaXMgJ2Jsb2NrJ1xuXHRcdFx0XHRcdHBhcmVudFdpZHRoID0gcGFyZW50LnN0eWxlUGFyc2VkKCd3aWR0aCcpIC0gcGFyZW50LnN0eWxlUGFyc2VkKCdwYWRkaW5nTGVmdCcpIC0gcGFyZW50LnN0eWxlUGFyc2VkKCdwYWRkaW5nUmlnaHQnKSAtIDJcblx0XHRcdFx0XHRyZXN1bHQgPSBwYXJlbnRXaWR0aCAqIChyZXN1bHQvMTAwKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVzdWx0ID0gMFxuXG5cdFx0cmV0dXJuIHJlc3VsdCBvciAoaWYgdGFyZ2V0IGlzICdtaW5XaWR0aCcgdGhlbiAwIGVsc2UgSW5maW5pdHkpXG5cblxuXHRfdmFsaWRhdGU6IChwcm92aWRlZFZhbHVlKS0+XG5cdFx0aWYgQHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4IGFuZCBJUy5yZWdleChAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXgpXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgbm90IEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleC50ZXN0KHByb3ZpZGVkVmFsdWUpXG5cdFx0XG5cdFx0aWYgQHNldHRpbmdzLnZhbGlkV2hlbklzQ2hvaWNlIGFuZCBAc2V0dGluZ3MuY2hvaWNlcz8ubGVuZ3RoXG5cdFx0XHRtYXRjaGluZ0Nob2ljZSA9IEBzZXR0aW5ncy5jaG9pY2VzLmZpbHRlciAoY2hvaWNlKS0+IGNob2ljZS52YWx1ZSBpcyBwcm92aWRlZFZhbHVlXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgbm90IG1hdGNoaW5nQ2hvaWNlLmxlbmd0aFxuXG5cdFx0aWYgQHNldHRpbmdzLm1pbkxlbmd0aFxuXHRcdFx0cmV0dXJuIGZhbHNlIGlmIHByb3ZpZGVkVmFsdWUubGVuZ3RoIDwgQHNldHRpbmdzLm1pbkxlbmd0aFxuXG5cdFx0aWYgQHNldHRpbmdzLm1heExlbmd0aFxuXHRcdFx0cmV0dXJuIGZhbHNlIGlmIHByb3ZpZGVkVmFsdWUubGVuZ3RoID49IEBzZXR0aW5ncy5tYXhMZW5ndGhcblxuXHRcdGlmIEBtYXNrXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgbm90IEBtYXNrLnZhbGlkYXRlKHByb3ZpZGVkVmFsdWUpXG5cdFx0XG5cdFx0cmV0dXJuIHRydWVcblxuXG5cdHNlbGVjdGlvbjogKGFyZyktPlxuXHRcdGlmIElTLm9iamVjdChhcmcpXG5cdFx0XHRzdGFydCA9IGFyZy5zdGFydFxuXHRcdFx0ZW5kID0gYXJnLmVuZFxuXHRcdGVsc2Vcblx0XHRcdHN0YXJ0ID0gYXJnXG5cdFx0XHRlbmQgPSBhcmd1bWVudHNbMV1cblxuXHRcdGlmIHN0YXJ0P1xuXHRcdFx0ZW5kID0gc3RhcnQgaWYgbm90IGVuZCBvciBlbmQgPCBzdGFydFxuXHRcdFx0QGVsLmNoaWxkLmlucHV0LnJhdy5zZXRTZWxlY3Rpb25SYW5nZShzdGFydCwgZW5kKVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuICdzdGFydCc6QGVsLmNoaWxkLmlucHV0LnJhdy5zZWxlY3Rpb25TdGFydCwgJ2VuZCc6QGVsLmNoaWxkLmlucHV0LnJhdy5zZWxlY3Rpb25FbmRcblxuXG5cdGZvY3VzOiAoKS0+XG5cdFx0QGVsLmNoaWxkLmlucHV0LnJhdy5mb2N1cygpXG5cblx0Ymx1cjogKCktPlxuXHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcuYmx1cigpXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRGaWVsZCIsImltcG9ydCAnLi9oZWxwZXJzJ1xuaW1wb3J0ICcuL2Vycm9yc0FuZFdhcm5pbmdzJ1xuIiwiU2ltcGx5QmluZCA9IChzdWJqZWN0LCBvcHRpb25zLCBzYXZlT3B0aW9ucywgaXNTdWIsIGNvbXBsZXRlQ2FsbGJhY2spLT5cblx0aWYgKCFzdWJqZWN0IGFuZCBzdWJqZWN0IGlzbnQgMCkgb3IgKCFjaGVja0lmLmlzU3RyaW5nKHN1YmplY3QpIGFuZCAhY2hlY2tJZi5pc051bWJlcihzdWJqZWN0KSBhbmQgIWNoZWNrSWYuaXNGdW5jdGlvbihzdWJqZWN0KSBhbmQgc3ViamVjdCBub3QgaW5zdGFuY2VvZiBBcnJheSlcblx0XHR0aHJvd0Vycm9yKCdpbnZhbGlkUGFyYW1OYW1lJykgdW5sZXNzIGNoZWNrSWYuaXNCaW5kaW5nSW50ZXJmYWNlKHN1YmplY3QpXG5cblx0aWYgY2hlY2tJZi5pc09iamVjdChzdWJqZWN0KSBhbmQgc3ViamVjdCBub3QgaW5zdGFuY2VvZiBBcnJheSAjIEluZGljYXRlcyBpdCdzIGEgQmluZGluZyBpbnN0YW5jZSBvYmplY3QgZHVlIHRvIHRoZSBhYm92ZSBjaGVja1xuXHRcdGludGVyZmFjZVRvUmV0dXJuID0gaWYgY29tcGxldGVDYWxsYmFjayB0aGVuIGNvbXBsZXRlQ2FsbGJhY2soc3ViamVjdCkgZWxzZSBzdWJqZWN0LnNlbGZDbG9uZSgpXG5cdFxuXHRlbHNlXG5cdFx0bmV3SW50ZXJmYWNlID0gbmV3IEJpbmRpbmdJbnRlcmZhY2Uob3B0aW9ucylcblx0XHRuZXdJbnRlcmZhY2Uuc2F2ZU9wdGlvbnMgPSBzYXZlT3B0aW9uc1xuXHRcdG5ld0ludGVyZmFjZS5pc1N1YiA9IGlzU3ViXG5cdFx0bmV3SW50ZXJmYWNlLmNvbXBsZXRlQ2FsbGJhY2sgPSBjb21wbGV0ZUNhbGxiYWNrXG5cblx0XHRpZiBjaGVja0lmLmlzRnVuY3Rpb24oc3ViamVjdClcblx0XHRcdGludGVyZmFjZVRvUmV0dXJuID0gbmV3SW50ZXJmYWNlLnNldE9iamVjdChzdWJqZWN0LCB0cnVlKVxuXHRcdGVsc2Vcblx0XHRcdGludGVyZmFjZVRvUmV0dXJuID0gbmV3SW50ZXJmYWNlLnNldFByb3BlcnR5KHN1YmplY3QpXG5cblx0cmV0dXJuIGludGVyZmFjZVRvUmV0dXJuXG5cblxuXG5cbmltcG9ydCAnLi9tZXRob2RzJyIsIkJpbmRpbmcgPSAob2JqZWN0LCB0eXBlLCBzdGF0ZSktPlxuXHRleHRlbmRTdGF0ZShALCBzdGF0ZSlcblx0QG9wdGlvbnNEZWZhdWx0ID0gaWYgQHNhdmVPcHRpb25zIHRoZW4gQG9wdGlvbnMgZWxzZSBkZWZhdWx0T3B0aW9uc1xuXHRAdHlwZSA9IHR5cGVcdFx0XHRcdFx0XHRcdCMgT2JqZWN0UHJvcCB8IEFycmF5IHwgRnVuYyB8IFByb3h5IHwgRXZlbnQgfCBQaG9sZGVyIHwgRE9NQXR0ciB8IERPTUNoZWNrYm94IHwgRE9NUmFkaW9cblx0QG9iamVjdCA9IG9iamVjdCBcdFx0XHRcdFx0XHQjIFRoZSBzdWJqZWN0IG9iamVjdCBvZiB0aGlzIGJpbmRpbmcsIGkuZS4gZnVuY3Rpb24sIGFycmF5LCB7fSwgRE9NIGVsLCBldGMuXG5cdEBJRCA9IGdlbklEKCkgXHRcdFx0XHRcdFx0XHQjIEFzc2lnbmVkIG9ubHkgYWZ0ZXIgcGFzc2luZyBhIHZhbGlkIG9iamVjdCB0byAub2YoKVxuXHRAc3VicyA9IFtdXHRcdFx0XHRcdFx0XHRcdCMgU3Vic2NyaWJlcnMgYXJyYXkgbGlzdGluZyBhbGwgb2YgdGhlIG9iamVjdHMgdGhhdCB3aWxsIGJlIHVwZGF0ZWQgdXBvbiB2YWx1ZSB1cGRhdGVcblx0QHN1YnNNZXRhID0gZ2VuT2JqKClcdFx0XHRcdFx0IyBNYXAgc3Vic2NyaWJlcnMnIElEIHRvIHRoZWlyIG1ldGFkYXRhIChpLmUuIG9wdGlvbnMsIHRyYW5zZm9ybSwgY29uZGl0aW9uLCBvbmUtdGltZS1iaW5kaW5nLCBldGMuKVxuXHRAcHVic01hcCA9IGdlbk9iaigpXHRcdFx0XHRcdFx0IyBNYXAgcHVibGlzaGVycyAoYmluZGluZ3MgdGhhdCB1cGRhdGUgdGhpcyBiaW5kaW5nKSBieSB0aGVpciBJRFxuXHRAYXR0YWNoZWRFdmVudHMgPSBbXVx0XHRcdFx0XHQjIEFycmF5IGxpc3RpbmcgYWxsIG9mIHRoZSBldmVudHMgY3VycmVudGx5IGxpc3RlbmVkIG9uIEBvYmplY3Rcblx0QHNldFZhbHVlID0gc2V0VmFsdWVOb29wIGlmIEB0eXBlIGlzICdQcm94eSdcblxuXHQjID09PT0gUHJvcGVydGllcyBkZWNsYXJlZCBsYXRlciBvciBpbmhlcml0ZWQgZnJvbSBiaW5kaW5nIGludGVyZmFjZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBAb3B0aW9ucyA9IG9wdGlvbnNcblx0IyBAdmFsdWUgPSB1bmRlZmluZWQgXHRcdFx0XHRcdCMgV2lsbCByZXByZXNlbnQgdGhlIGFjdHVhbCBjdXJyZW50IHZhbHVlIG9mIHRoZSBiaW5kaW5nL29iamVjdFxuXHQjIEBwcm9wZXJ0eSA9IHByb3BlcnR5XHRcdFx0XHRcdCMgVGhlIHByb3BlcnR5IG5hbWUgb3IgYXJyYXkgaW5kZXggb3IgZXZlbnQgY2FsbGJhY2sgYXJndW1lbnRcblx0IyBAc2VsZWN0b3IgPSBzZWxlY3Rvclx0XHRcdFx0XHQjIFRoZSBwcm9wZXJ0eSBuYW1lIG9yIGFycmF5IGluZGV4IG9yIGV2ZW50IGNhbGxiYWNrIGFyZ3VtZW50XG5cdCMgQG9yaWdGbiA9IEZ1bmN0aW9uXHRcdFx0XHRcdCMgVGhlIG9yaWdpbmFsIHByb3hpZWQgZnVuY3Rpb24gcGFzc2VkIHRvIFByb3h5IGJpbmRpbmdzXG5cdCMgQGN1c3RvbUV2ZW50TWV0aG9kID0ge31cdFx0XHRcdCMgTmFtZXMgb2YgdGhlIGV2ZW50IGVtaXR0ZXIvdHJpZ2dlciBtZXRob2RzIChpZiBhcHBsaWNhYmxlKVxuXHQjIEBwaG9sZGVyQ29udGV4dHMgPSB7fVx0XHRcdFx0XHQjIFBsYWNlaG9sZGVyIHN1cnJvdW5kaW5ncyAob3JpZ2luYWwgYmluZGluZyB2YWx1ZSBzcGxpdCBieSB0aGUgcGxhY2Vob2xkZXIgcmVnRXgpXG5cdCMgQHBob2xkZXJJbmRleE1hcCA9IHt9XHRcdFx0XHRcdCMgUGxhY2Vob2xkZXIgb2NjdXJlbmNlIG1hcHBpbmcsIGkuZS4gdGhlIHBsYWNlaG9sZGVyIG5hbWUgZm9yIGVhY2ggcGxhY2Vob2xkZXIgb2NjdXJlbmNlXG5cdCMgQHBsYWNlaG9sZGVyID0gXCJcIlx0XHRcdFx0XHRcdCMgVGhlIGxhc3Qgc3BlY2lmaWVkIHBsYWNlaG9sZGVyIHRvIGJpbmQgdGhlIHZhbHVlIHRvXG5cdCMgQGRlc2NyaXB0b3IgPSBbXVx0XHRcdFx0XHRcdCMgRGVzY3JpYmVzIHRoZSB0eXBlIG9mIHByb3BlcnR5LCBpLmUuICdhdHRyOmRhdGEtbmFtZScgdG8gaW5kaWNhdGUgYSBET01BdHRyIHR5cGUgYmluZGluZ1xuXHQjIEBpc0xpdmVQcm9wID0gQm9vbGVhblx0XHRcdFx0XHQjIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgT2JqZWN0L09iamVjdCdzIHByb3BldHkgaGF2ZSBiZWVuIG1vZGlmaWVkIHRvIGJlIGEgbGl2ZSBwcm9wZXJ0eVxuXHQjIEBpc0RvbSA9IEJvb2xlYW5cdFx0XHRcdFx0XHQjIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgYmluZGluZydzIG9iamVjdCBpcyBhIERPTSBvYmplY3Rcblx0IyBAcG9sbEludGVydmFsID0gSURcdFx0XHRcdFx0IyBUaGUgaW50ZXJ2YWwgSUQgb2YgdGhlIHRpbWVyIHRoYXQgbWFudWFsbHkgcG9sbHMgdGhlIG9iamVjdCdzIHZhbHVlIGF0IGEgc2V0IGludGVydmFsXG5cdCMgQGFycmF5QmluZGluZyA9IEJpbmRpbmdcdFx0XHRcdCMgUmVmZXJlbmNlIHRvIHRoZSBwYXJlbnQgYXJyYXkgYmluZGluZyAoaWYgZXhpc3RzKSBmb3IgYW4gaW5kZXgtb2YtYXJyYXkgYmluZGluZyAoaS5lLiBTaW1wbHlCaW5kKGFycmF5KSlcblx0IyBAZXZlbnROYW1lID0gXCJcIlx0XHRcdFx0XHRcdCMgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRoaXMgYmluZGluZyBpcyBsaXN0ZW5pbmcgdG8gKGZvciBFdmVudCB0eXBlIGJpbmRpbmdzKVxuXHQjIEBpc0VtaXR0ZXIgPSBCb29sZWFuIFx0XHRcdFx0XHQjIFRyYWNrZXIgdG8gbGV0IHVzIGtub3cgd2Ugc2hvdWxkbid0IGhhbmRsZSB0aGUgZXZlbnQgdXBkYXRlIHdlIHJlY2VpdmVkIGFzIGl0IGlzIHRoZSBldmVudCB0aGlzIGJpbmRpbmcganVzdCBlbWl0dGVkXG5cdCMgQGV2ZW50SGFuZGxlciA9IEZ1bmN0aW9uIFx0XHRcdFx0IyBUaGUgY2FsbGJhY2sgdGhhdCBnZXRzIHRyaWdnZXJlZCB1cG9uIGFuIGV2ZW50IGVtaXR0YW5jZSAoZm9yIEV2ZW4gdHlwZSBiaW5kaW5ncylcblx0IyBAZXZlbnRPYmplY3QgPSBFdmVudCBcdFx0XHRcdFx0IyBUaGUgZGlzcGF0Y2hlZCBldmVudCBvYmplY3QgKGZvciBFdmVudCB0eXBlIGJpbmRpbmdzKVxuXHQjIEBzZWxmVHJhbnNmb3JtID0gRnVuY3Rpb24gXHRcdFx0IyBUaGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHRoYXQgbmV3IHZhbHVlcyBiZWluZyBzZXQgdG8gdGhpcyBiaW5kaW5nIGFyZSBiZWluZyBwYXNzZWQgdGhyb3VnaCBkdXJpbmcgQHNldFZhbHVlIChpZiBhcHBsaWNhYmxlKVxuXHQjIEBzZWxmVXBkYXRlciA9IEZ1bmN0aW9uIFx0XHRcdFx0IyBBIEZ1bmMtdHlwZSBCaW5kaW5nIHdoaWNoIGludm9rZXMgQHNldFZhbHVlKEBmZXRjaERpcmVjdFZhbHVlKCkpIHVwb24gY2hhbmdlLiBDcmVhdGVkIGluIEBjb252ZXJ0VG9MaXZlKCkgZm9yIEFycmF5IGJpbmRpbmdzICYgaW4gaW50ZXJmYWNlLnVwZGF0ZU9uKClcblx0IyBAaXNBc3luYyA9IEJvb2xlYW5cdFx0XHRcdFx0IyBJbmRpY2F0ZXMgaWYgdGhpcyBpcyBhbiBhc3luYyBiaW5kaW5nIChjdXJyZW50bHkgb25seSB1c2VkIGZvciBFdmVudCBiaW5kaW5ncylcblx0IyMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICMjI1xuXG5cdCMgc2ltcGx5aW1wb3J0OmlmIEJVTkRMRV9UQVJHRVQgPSAnYnJvd3Nlcidcblx0aWYgQGlzTXVsdGlDaG9pY2UgIyBUcnVlIGlmIEBvYmplY3QgaXMgYSByYWRpby9jaGVja2JveCBjb2xsZWN0aW9uXG5cdFx0QGNob2ljZXMgPSBnZW5PYmooKVxuXHRcdFxuXHRcdEBvYmplY3QuZm9yRWFjaCAoY2hvaWNlRWwpPT5cblx0XHRcdGNob2ljZUJpbmRpbmcgPSBAY2hvaWNlc1tjaG9pY2VFbC52YWx1ZV0gPSBTaW1wbHlCaW5kKCdjaGVja2VkJykub2YoY2hvaWNlRWwpLl9cblx0XHRcdGNob2ljZUJpbmRpbmcuYWRkU3ViKEApXG5cdFx0XHRjaG9pY2VCaW5kaW5nLnN1YnNNZXRhW0BJRF0udHJhbnNmb3JtRm4gPSAoKS0+IGNob2ljZUJpbmRpbmdcblx0XHRcdGNob2ljZUJpbmRpbmcuZ3JvdXBCaW5kaW5nID0gQFxuXHRcdFx0cmV0dXJuXG5cdCMgc2ltcGx5aW1wb3J0OmVuZFxuXHRcblxuXHR1bmxlc3MgQHR5cGUgaXMgJ0V2ZW50JyBvciAoQHR5cGUgaXMgJ0Z1bmMnIGFuZCBAaXNTdWIpICMgdGhlIHNlY29uZCBjb25kaXRpb24gd2lsbCBwcmV2ZW50IGZ1bmN0aW9uIHN1YnNjcmliZXJzIGZyb20gYmVpbmcgaW52b2tlZCBvbiB0aGlzIGJpbmRpbmcgY3JlYXRpb25cblx0XHRpZiBAdHlwZSBpcyAnUGhvbGRlcidcblx0XHRcdCMgc2ltcGx5aW1wb3J0OmlmIEJVTkRMRV9UQVJHRVQgPSAnYnJvd3Nlcidcblx0XHRcdHBhcmVudFByb3BlcnR5ID0gaWYgQGRlc2NyaXB0b3IgYW5kIG5vdCB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ211bHRpJykgdGhlbiBcIiN7QGRlc2NyaXB0b3J9OiN7QHByb3BlcnR5fVwiIGVsc2UgQHByb3BlcnR5XG5cdFx0XHQjIHNpbXBseWltcG9ydDplbmRcblx0XHRcdFxuXHRcdFx0IyBzaW1wbHlpbXBvcnQ6aWYgQlVORExFX1RBUkdFVCA9ICdub2RlJ1xuXHRcdFx0cGFyZW50UHJvcGVydHkgPSBAcHJvcGVydHlcblx0XHRcdCMgc2ltcGx5aW1wb3J0OmVuZFxuXHRcdFx0XG5cdFx0XHRwYXJlbnRCaW5kaW5nID0gQHBhcmVudEJpbmRpbmcgPSBTaW1wbHlCaW5kKHBhcmVudFByb3BlcnR5KS5vZihvYmplY3QpLl9cblx0XHRcdHBhcmVudEJpbmRpbmcuc2NhbkZvclBob2xkZXJzKClcblx0XHRcdEB2YWx1ZSA9IHBhcmVudEJpbmRpbmcucGhvbGRlclZhbHVlc1tAcGhvbGRlcl1cblx0XHRcblx0XHRcdCMgc2ltcGx5aW1wb3J0OmlmIEJVTkRMRV9UQVJHRVQgPSAnYnJvd3Nlcidcblx0XHRcdEB0ZXh0Tm9kZXMgPSBwYXJlbnRCaW5kaW5nLnRleHROb2Rlc1tAcGhvbGRlcl0gaWYgcGFyZW50QmluZGluZy50ZXh0Tm9kZXNcblx0XHRcdCMgc2ltcGx5aW1wb3J0OmVuZFxuXHRcdFxuXG5cdFx0ZWxzZVxuXHRcdFx0QHZhbHVlID0gc3ViamVjdFZhbHVlID0gQGZldGNoRGlyZWN0VmFsdWUoKVxuXHRcdFxuXHRcdFx0aWYgQHR5cGUgaXMgJ09iamVjdFByb3AnIGFuZCBub3QgY2hlY2tJZi5pc0RlZmluZWQoc3ViamVjdFZhbHVlKSBhbmQgbm90IGdldERlc2NyaXB0b3IoQG9iamVjdCwgQHByb3BlcnR5KVxuXHRcdFx0XHRAb2JqZWN0W0Bwcm9wZXJ0eV0gPSBzdWJqZWN0VmFsdWUgIyBEZWZpbmUgdGhlIHByb3Agb24gdGhlIG9iamVjdCBpZiBpdCBub24tZXhpc3RlbnRcblxuXHRcdFx0Y29udmVydFRvTGl2ZShALCBAb2JqZWN0KVxuXG5cblx0QGF0dGFjaEV2ZW50cygpXG5cdHJldHVybiBib3VuZEluc3RhbmNlc1tASURdID0gQFxuXG5cblxuXG5cbmltcG9ydCAnLi9wcm90b3R5cGUnXG4iLCIjIyMqXG4gKiBTdGFnZSBkZWZpbml0aW9uczpcbiAqIFxuICogMDogU2VsZWN0aW9uOlx0XHRcdEdvdCBzZWxlY3RvciwgYXdhaXRpbmcgb2JqZWN0LlxuICogMTogSW5kaWNhdGlvbjpcdFx0XHRHb3Qgb2JqZWN0LCBhd2FpdGluZyBwcm94aWVkIHByb3BlcnR5IC8gZnVuY3Rpb24gLyBCaW5kaW5nLW9iamVjdC5cbiAqIDI6IEJpbmRpbmcgQ29tcGxldGU6XHRcdENvbXBsZXRlLCBhd2FpdGluZyBhZGRpdGlvbmFsIChvcHRpb25hbCkgYmluZGluZ3MvbXV0YXRpb25zLlxuIyMjXG5CaW5kaW5nSW50ZXJmYWNlID0gKG9wdGlvbnMsIGluaGVyaXRlZFN0YXRlKS0+XG5cdGlmIGluaGVyaXRlZFN0YXRlXG5cdFx0ZXh0ZW5kU3RhdGUoQCwgaW5oZXJpdGVkU3RhdGUpXG5cdFx0QHN0YWdlID0gMVxuXHRlbHNlXG5cdFx0QHN0YWdlID0gMFxuXHRcdEBzdWJzID0gW11cblx0XHRAb3B0aW9uc1Bhc3NlZCA9IG9wdGlvbnMgfHw9IHt9XG5cdFx0QG9wdGlvbnMgPSB7fVxuXHRcdGZvciBrZXkgb2YgZGVmYXVsdE9wdGlvbnNcblx0XHRcdEBvcHRpb25zW2tleV0gPSBpZiBvcHRpb25zW2tleV0/IHRoZW4gb3B0aW9uc1trZXldIGVsc2UgZGVmYXVsdE9wdGlvbnNba2V5XVxuXHRcblx0cmV0dXJuIEBcdFx0XHRcblx0XG5cblxuXG5pbXBvcnQgJy4vcHJvdG90eXBlLXByaXZhdGUnXG5pbXBvcnQgJy4vcHJvdG90eXBlLXB1YmxpYyciLCJHcm91cEJpbmRpbmcgPSAoYmluZGluZ0ludGVyZmFjZSwgb2JqZWN0cywgb2JqZWN0VHlwZSktPlxuXHRiaW5kaW5nSW50ZXJmYWNlLnNlbGVjdG9yID0gYmluZGluZ0ludGVyZmFjZS5zZWxlY3Rvci5zbGljZSg2KSAjIFRha2Ugb3V0IHRoZSAnbXVsdGk6J1xuXHRleHRlbmRTdGF0ZShALCBAaW50ZXJmYWNlID0gYmluZGluZ0ludGVyZmFjZSlcblx0QGlzTXVsdGkgPSB0cnVlXG5cdEBiaW5kaW5ncyA9IGJpbmRpbmdzID0gW11cblxuXHRpZiBvYmplY3RzXG5cdFx0QGFkZEJpbmRpbmcob2JqZWN0LCBvYmplY3RUeXBlKSBmb3Igb2JqZWN0IGluIG9iamVjdHNcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyBALFxuXHRcdCd0eXBlJzpcdFx0XHRcdGdldDogKCktPiBiaW5kaW5ncy5tYXAgKGJpbmRpbmcpLT4gYmluZGluZy50eXBlXG5cdFx0J3ZhbHVlJzogXHRcdFx0Z2V0OiAoKS0+IGJpbmRpbmdzLm1hcCAoYmluZGluZyktPiBiaW5kaW5nLnZhbHVlXG5cblxuXG5cblxuXG5wcm90byA9IEdyb3VwQmluZGluZzo6ID0gT2JqZWN0LmNyZWF0ZShCaW5kaW5nSW50ZXJmYWNlUHJpdmF0ZSlcblxuT2JqZWN0LmtleXMoQmluZGluZzo6KS5mb3JFYWNoIChtZXRob2ROYW1lKS0+XHRcblx0cHJvdG9bbWV0aG9kTmFtZV0gPSAoYSxiLGMsZCktPiAjIEZvdXIgYXJndW1lbnRzIGlzIHRoZSBtb3N0IGV2ZXIgcGFzc2VkIHRvIGFueSBtZXRob2QgZnJvbSBCaW5kaW5nSW50ZXJmYWNlIG1ldGhvZHNcblx0XHRmb3IgYmluZGluZyBpbiBAYmluZGluZ3Ncblx0XHRcdGIgPSBiaW5kaW5nIGlmIG1ldGhvZE5hbWUgaXMgJ3VwZGF0ZVN1Yidcblx0XHRcdGJpbmRpbmdbbWV0aG9kTmFtZV0oYSxiLGMsZClcblx0XHRcblx0XHRyZXR1cm5cblxuXG5wcm90by5hZGRCaW5kaW5nID0gKG9iamVjdCwgb2JqZWN0VHlwZSktPlxuXHRAYmluZGluZ3MucHVzaCBpZiBub3Qgb2JqZWN0VHlwZSB0aGVuIG9iamVjdCBlbHNlIEBjcmVhdGVCaW5kaW5nKG9iamVjdCwgb2JqZWN0VHlwZSwgQGludGVyZmFjZSlcblx0cmV0dXJuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFueTogLy4vLFxuICB3aGl0ZVNwYWNlOiAvXFxzKy8sXG4gIG51bWVyaWM6IC9eXFxkJC8sXG4gIGxldHRlcjogL15bYS16QS1aXSQvLFxuICB3aWRlbnVtZXJpYzogL15bMC05XFwhI1xcJFxcJVxcKlxcK1xcL1xcPVxcP1xcXlxce1xcfFxcfVxcKFxcKVxcflxcLVxcLl0kLyxcbiAgYWxwaGFudW1lcmljOiAvXlswLTlBLVphLXpcXCEjXFwkXFwlXFwmXFwnXFwqXFwrXFwvXFw9XFw/XFxeXFxfXFxgXFx7XFx8XFx9XFwoXFwpXFx+XFwtXFwgXSQvLFxuICBlbWFpbDogL15bXFx3XFwtXFwuXStAW1xcd1xcLVxcLl0rXFwuW0EtWmEtel17MiwxMH0kL1xufTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSmpiMjV6ZEdGdWRITXZjbVZuWlhndVkyOW1abVZsSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJjb25zdGFudHMgPSBpbXBvcnQgJy4vY29uc3RhbnRzJ1xuaGVscGVycyA9IGltcG9ydCAnLi9oZWxwZXJzJ1xuXG5RdWlja0NTUyA9ICh0YXJnZXRFbCwgcHJvcGVydHksIHZhbHVlLCBpbXBvcnRhbnQpLT5cblx0aWYgaGVscGVycy5pc0l0ZXJhYmxlKHRhcmdldEVsKVxuXHRcdFF1aWNrQ1NTKHN1YkVsLCBwcm9wZXJ0eSwgdmFsdWUpIGZvciBzdWJFbCBpbiB0YXJnZXRFbFxuXHRcblx0ZWxzZSBpZiB0eXBlb2YgcHJvcGVydHkgaXMgJ29iamVjdCcgIyBQYXNzZWQgYSBzdHlsZSBtYXBcblx0XHRRdWlja0NTUyh0YXJnZXRFbCwgc3ViUHJvcGVydHksIHN1YlZhbHVlKSBmb3Igc3ViUHJvcGVydHksc3ViVmFsdWUgb2YgcHJvcGVydHlcblx0XG5cdGVsc2Vcblx0XHRwcm9wZXJ0eSA9IGhlbHBlcnMubm9ybWFsaXplUHJvcGVydHkocHJvcGVydHkpXG5cdFx0aWYgdHlwZW9mIHZhbHVlIGlzICd1bmRlZmluZWQnXG5cdFx0XHRjb21wdXRlZFN0eWxlID0gdGFyZ2V0RWwuX2NvbXB1dGVkU3R5bGUgfHw9IGdldENvbXB1dGVkU3R5bGUodGFyZ2V0RWwpXG5cdFx0XHRyZXR1cm4gY29tcHV0ZWRTdHlsZVtwcm9wZXJ0eV1cblx0XHRcblx0XHRlbHNlIGlmIHByb3BlcnR5XG5cdFx0XHR0YXJnZXRFbC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wZXJ0eSwgaGVscGVycy5ub3JtYWxpemVWYWx1ZShwcm9wZXJ0eSwgdmFsdWUpLCBjb25zdGFudHMuSU1QT1JUQU5UIGlmIGltcG9ydGFudClcblxuXHRyZXR1cm5cblxuXG5RdWlja0NTUy5hbmltYXRpb24gPSAobmFtZSwgZnJhbWVzKS0+IGlmIG5hbWUgYW5kIHR5cGVvZiBuYW1lIGlzICdzdHJpbmcnIGFuZCBmcmFtZXMgYW5kIHR5cGVvZiBmcmFtZXMgaXMgJ29iamVjdCdcblx0cHJlZml4ID0gaGVscGVycy5nZXRQcmVmaXgoJ2FuaW1hdGlvbicpXG5cdGdlbmVyYXRlZCA9ICcnXG5cdFxuXHRmb3IgZnJhbWUscnVsZXMgb2YgZnJhbWVzXG5cdFx0Z2VuZXJhdGVkICs9IFwiI3tmcmFtZX0geyN7aGVscGVycy5ydWxlVG9TdHJpbmcocnVsZXMpfX1cIlxuXG5cdGdlbmVyYXRlZCA9IFwiQCN7cHJlZml4fWtleWZyYW1lcyAje25hbWV9IHsje2dlbmVyYXRlZH19XCJcblx0aGVscGVycy5pbmxpbmVTdHlsZShnZW5lcmF0ZWQsIHRydWUsIDApXG5cblxuUXVpY2tDU1MucmVnaXN0ZXIgPSAocnVsZSwgbGV2ZWwsIGltcG9ydGFudCktPiBpZiBydWxlIGFuZCB0eXBlb2YgcnVsZSBpcyAnb2JqZWN0J1xuXHRsZXZlbCB8fD0gMFxuXHRydWxlID0gaGVscGVycy5ydWxlVG9TdHJpbmcocnVsZSwgaW1wb3J0YW50KVxuXHRcblx0dW5sZXNzIGNsYXNzTmFtZSA9IGhlbHBlcnMuaW5saW5lU3R5bGVDb25maWdbbGV2ZWxdP1tydWxlXVxuXHRcdGNsYXNzTmFtZSA9IGhlbHBlcnMuaGFzaChydWxlKVxuXHRcdHN0eWxlID0gXCIuI3tjbGFzc05hbWV9IHsje3J1bGV9fVwiXG5cdFx0aGVscGVycy5pbmxpbmVTdHlsZShzdHlsZSwgY2xhc3NOYW1lLCBsZXZlbClcblxuXHRyZXR1cm4gY2xhc3NOYW1lXG5cblxuUXVpY2tDU1MuY2xlYXJSZWdpc3RlcmVkID0gKGxldmVsKS0+XG5cdGhlbHBlcnMuY2xlYXJJbmxpbmVTdHlsZShsZXZlbCBvciAwKVxuXG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrQ1NTLlVOU0VUID0gc3dpdGNoXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywndW5zZXQnKSB0aGVuICd1bnNldCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbml0aWFsJykgdGhlbiAnaW5pdGlhbCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbmhlcml0JykgdGhlbiAnaW5oZXJpdCdcblxuUXVpY2tDU1Muc3VwcG9ydHMgPSBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWRcblF1aWNrQ1NTLnN1cHBvcnRzUHJvcGVydHkgPSBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZFxuUXVpY2tDU1Mubm9ybWFsaXplUHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5XG5RdWlja0NTUy5ub3JtYWxpemVWYWx1ZSA9IGhlbHBlcnMubm9ybWFsaXplVmFsdWVcblF1aWNrQ1NTLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrQ1NTIiwie1xuICBcIl9mcm9tXCI6IFwicXVpY2tjc3NAXjEuMy40XCIsXG4gIFwiX2lkXCI6IFwicXVpY2tjc3NAMS4zLjRcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1VRHdMTlg1cTBxdUU5bVZOY3pDUlhCWnZHTGJrOHJVTXpDMFgzSkt0MlphanZVRnd2dEVsYURIMUYxV2NrSWk2VDNER2V2dFJvS1hrUDZDUWRzWTJ5Zz09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3F1aWNrZG9tL3F1aWNrY3NzXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJyYW5nZVwiLFxuICAgIFwicmVnaXN0cnlcIjogdHJ1ZSxcbiAgICBcInJhd1wiOiBcInF1aWNrY3NzQF4xLjMuNFwiLFxuICAgIFwibmFtZVwiOiBcInF1aWNrY3NzXCIsXG4gICAgXCJlc2NhcGVkTmFtZVwiOiBcInF1aWNrY3NzXCIsXG4gICAgXCJyYXdTcGVjXCI6IFwiXjEuMy40XCIsXG4gICAgXCJzYXZlU3BlY1wiOiBudWxsLFxuICAgIFwiZmV0Y2hTcGVjXCI6IFwiXjEuMy40XCJcbiAgfSxcbiAgXCJfcmVxdWlyZWRCeVwiOiBbXG4gICAgXCIvcXVpY2tkb21cIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3F1aWNrY3NzLy0vcXVpY2tjc3MtMS4zLjQudGd6XCIsXG4gIFwiX3NoYXN1bVwiOiBcImNlMTQ1Y2E1MTFiYzUwNmIyZDlhNjE0ZWQ1YjYxZTc4NjlmZTExZDVcIixcbiAgXCJfc3BlY1wiOiBcInF1aWNrY3NzQF4xLjMuNFwiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGQvbm9kZV9tb2R1bGVzL3F1aWNrZG9tXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJkYW5pZWxrYWxlblwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9xdWlja2Nzcy5kZWJ1Zy5qc1wiLFxuICAgIFwiLi9kaXN0L3F1aWNrY3NzLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tjc3MvaXNzdWVzXCJcbiAgfSxcbiAgXCJidW5kbGVEZXBlbmRlbmNpZXNcIjogZmFsc2UsXG4gIFwiZGVwcmVjYXRlZFwiOiBmYWxzZSxcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkZhc3QgJiBsaWdodCB3cmFwcGVyIGZvciBnZXR0aW5nL3NldHRpbmcgQ1NTIHJ1bGVzXCIsXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjaGFsa1wiOiBcIl4yLjAuMVwiLFxuICAgIFwiY29mZmVlLXNjcmlwdFwiOiBcIl4xLjEyLjZcIixcbiAgICBcImV4ZWNhXCI6IFwiXjAuNy4wXCIsXG4gICAgXCJmcy1qZXRwYWNrXCI6IFwiXjAuMTMuM1wiLFxuICAgIFwicHJvbWlzZS1icmVha1wiOiBcIl4wLjEuMVwiLFxuICAgIFwic2VtdmVyXCI6IFwiXjUuMy4wXCIsXG4gICAgXCJzaW1wbHlpbXBvcnRcIjogXCJeNC4wLjAtczI3XCIsXG4gICAgXCJzaW1wbHl3YXRjaFwiOiBcIl4zLjAuMC1sMlwiXG4gIH0sXG4gIFwiZGlyZWN0b3JpZXNcIjoge1xuICAgIFwidGVzdFwiOiBcInRlc3RcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrY3NzI3JlYWRtZVwiLFxuICBcImxpY2Vuc2VcIjogXCJJU0NcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9xdWlja2Nzcy5qc1wiLFxuICBcIm5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2Nzcy5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJjYWtlIC1kIGJ1aWxkICYmIGNha2UgYnVpbGQgJiYgY2FrZSBtZWFzdXJlICYmIGNwIC1yIGJ1aWxkLyogZGlzdC9cIixcbiAgICBcImNvdmVyYWdlXCI6IFwiY2FrZSBpbnN0YWxsOmNvdmVyYWdlOyBucG0gcnVuIGNvdmVyYWdlOnJ1biAmJiBucG0gcnVuIGNvdmVyYWdlOmJhZGdlXCIsXG4gICAgXCJjb3ZlcmFnZTpiYWRnZVwiOiBcImJhZGdlLWdlbiAtZCAuLy5jb25maWcvYmFkZ2VzL2NvdmVyYWdlXCIsXG4gICAgXCJjb3ZlcmFnZTpydW5cIjogXCJjb3ZlcmFnZT10cnVlIG5wbSBydW4gdGVzdDplbGVjdHJvblwiLFxuICAgIFwiY292ZXJhZ2U6c2hvd1wiOiBcIm9wZW4gY292ZXJhZ2UvbGNvdi1yZXBvcnQvaW5kZXguaHRtbFwiLFxuICAgIFwicG9zdHB1Ymxpc2hcIjogXCJnaXQgcHVzaFwiLFxuICAgIFwicG9zdHZlcnNpb25cIjogXCJucG0gcnVuIGJ1aWxkICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJucG0gcnVuIHRlc3Q6dHJhdmlzXCIsXG4gICAgXCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpicm93c2VyXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEVsZWN0cm9uIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6Y2hyb21lXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBDaHJvbWUgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpmaXJlZm94XCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEZpcmVmb3ggLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDprYXJtYVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6bG9jYWxcIjogXCJvcGVuIHRlc3QvdGVzdHJ1bm5lci5odG1sXCIsXG4gICAgXCJ0ZXN0Om1pbmlmaWVkXCI6IFwibWluaWZpZWQ9MSBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OnNhZmFyaVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgU2FmYXJpIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6c2F1Y2VcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBzYXVjZT0xIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6dHJhdmlzXCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgJiYgbnBtIHJ1biB0ZXN0Om1pbmlmaWVkIC1zXCIsXG4gICAgXCJ3YXRjaFwiOiBcImNha2UgLWQgd2F0Y2hcIlxuICB9LFxuICBcInNpbXBseWltcG9ydFwiOiB7XG4gICAgXCJmaW5hbFRyYW5zZm9ybVwiOiBbXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc3VwZXJcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1yZW5hbWVcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zaW1wbGVcIlxuICAgIF1cbiAgfSxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4zLjRcIlxufVxuIiwiYXZhaWxTZXRzID0gXG5cdG5hdGl2ZXM6IGltcG9ydCAnLi9uYXRpdmVzJ1xuXHRkb206IGltcG9ydCAnLi9kb20nXG5cbmNsYXNzIENoZWNrc1xuXHRjcmVhdGU6ICgpLT5cblx0XHRhcmdzID0gQXJyYXk6OnNsaWNlLmNhbGwoYXJndW1lbnRzKSBpZiBhcmd1bWVudHMubGVuZ3RoXG5cdFx0bmV3IENoZWNrcyhhcmdzKVxuXHRcblxuXHRjb25zdHJ1Y3RvcjogKHNldHMpLT5cblx0XHRzZXRzID89IFsnbmF0aXZlcyddXG5cdFx0XG5cdFx0Zm9yIHNldCBpbiBzZXRzXG5cdFx0XHRAbG9hZChhdmFpbFNldHNbc2V0XSkgaWYgYXZhaWxTZXRzW3NldF1cblxuXG5cdGxvYWQ6IChzZXQpLT5cblx0XHRzZXQgPSBhdmFpbFNldHNbc2V0XSBpZiBhdmFpbFNldHMubmF0aXZlcy5zdHJpbmcoc2V0KVxuXHRcdHJldHVybiBpZiBub3QgYXZhaWxTZXRzLm5hdGl2ZXMub2JqZWN0UGxhaW4oc2V0KVxuXHRcdFxuXHRcdGZvciBrZXksdmFsdWUgb2Ygc2V0XG5cdFx0XHRAW2tleV0gPSB2YWx1ZVxuXHRcdFxuXHRcdHJldHVyblxuXHRcblx0XG5tb2R1bGUuZXhwb3J0cyA9IENoZWNrczo6Y3JlYXRlKCkiLCJ2YXIgZXh0ZW5kLCBpc0FycmF5LCBpc09iamVjdCwgc2hvdWxkRGVlcEV4dGVuZDtcblxuaXNBcnJheSA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh0YXJnZXQpO1xufTtcblxuaXNPYmplY3QgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIHRhcmdldCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGFyZ2V0KSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgfHwgaXNBcnJheSh0YXJnZXQpO1xufTtcblxuc2hvdWxkRGVlcEV4dGVuZCA9IGZ1bmN0aW9uKG9wdGlvbnMsIHRhcmdldCwgcGFyZW50S2V5KSB7XG4gIGlmIChvcHRpb25zLmRlZXApIHtcbiAgICBpZiAob3B0aW9ucy5ub3REZWVwKSB7XG4gICAgICByZXR1cm4gIW9wdGlvbnMubm90RGVlcFt0YXJnZXRdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5kZWVwT25seSkge1xuICAgIHJldHVybiBvcHRpb25zLmRlZXBPbmx5W3RhcmdldF0gfHwgcGFyZW50S2V5ICYmIHNob3VsZERlZXBFeHRlbmQob3B0aW9ucywgcGFyZW50S2V5KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQgPSBmdW5jdGlvbihvcHRpb25zLCB0YXJnZXQsIHNvdXJjZXMsIHBhcmVudEtleSkge1xuICB2YXIgaSwga2V5LCBsZW4sIHNvdXJjZSwgc291cmNlVmFsdWUsIHN1YlRhcmdldCwgdGFyZ2V0VmFsdWU7XG4gIGlmICghdGFyZ2V0IHx8IHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnICYmIHR5cGVvZiB0YXJnZXQgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0YXJnZXQgPSB7fTtcbiAgfVxuICBmb3IgKGkgPSAwLCBsZW4gPSBzb3VyY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgc291cmNlID0gc291cmNlc1tpXTtcbiAgICBpZiAoc291cmNlICE9IG51bGwpIHtcbiAgICAgIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgICAgICBzb3VyY2VWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB0YXJnZXRWYWx1ZSA9IHRhcmdldFtrZXldO1xuICAgICAgICBpZiAoc291cmNlVmFsdWUgPT09IHRhcmdldCB8fCBzb3VyY2VWYWx1ZSA9PT0gdm9pZCAwIHx8IChzb3VyY2VWYWx1ZSA9PT0gbnVsbCAmJiAhb3B0aW9ucy5hbGxvd051bGwgJiYgIW9wdGlvbnMubnVsbERlbGV0ZXMpIHx8IChvcHRpb25zLmtleXMgJiYgIW9wdGlvbnMua2V5c1trZXldKSB8fCAob3B0aW9ucy5ub3RLZXlzICYmIG9wdGlvbnMubm90S2V5c1trZXldKSB8fCAob3B0aW9ucy5vd24gJiYgIXNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB8fCAob3B0aW9ucy5nbG9iYWxGaWx0ZXIgJiYgIW9wdGlvbnMuZ2xvYmFsRmlsdGVyKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSkpIHx8IChvcHRpb25zLmZpbHRlcnMgJiYgb3B0aW9ucy5maWx0ZXJzW2tleV0gJiYgIW9wdGlvbnMuZmlsdGVyc1trZXldKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNvdXJjZVZhbHVlID09PSBudWxsICYmIG9wdGlvbnMubnVsbERlbGV0ZXMpIHtcbiAgICAgICAgICBkZWxldGUgdGFyZ2V0W2tleV07XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuZ2xvYmFsVHJhbnNmb3JtKSB7XG4gICAgICAgICAgc291cmNlVmFsdWUgPSBvcHRpb25zLmdsb2JhbFRyYW5zZm9ybShzb3VyY2VWYWx1ZSwga2V5LCBzb3VyY2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnRyYW5zZm9ybXMgJiYgb3B0aW9ucy50cmFuc2Zvcm1zW2tleV0pIHtcbiAgICAgICAgICBzb3VyY2VWYWx1ZSA9IG9wdGlvbnMudHJhbnNmb3Jtc1trZXldKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChmYWxzZSkge1xuICAgICAgICAgIGNhc2UgIShvcHRpb25zLmNvbmNhdCAmJiBpc0FycmF5KHNvdXJjZVZhbHVlKSAmJiBpc0FycmF5KHRhcmdldFZhbHVlKSk6XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHRhcmdldFZhbHVlLmNvbmNhdChzb3VyY2VWYWx1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICEoc2hvdWxkRGVlcEV4dGVuZChvcHRpb25zLCBrZXksIHBhcmVudEtleSkgJiYgaXNPYmplY3Qoc291cmNlVmFsdWUpKTpcbiAgICAgICAgICAgIHN1YlRhcmdldCA9IGlzT2JqZWN0KHRhcmdldFZhbHVlKSA/IHRhcmdldFZhbHVlIDogaXNBcnJheShzb3VyY2VWYWx1ZSkgPyBbXSA6IHt9O1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBleHRlbmQob3B0aW9ucywgc3ViVGFyZ2V0LCBbc291cmNlVmFsdWVdLCBrZXkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUl1TGk5dWIyUmxYMjF2WkhWc1pYTXZjMjFoY25RdFpYaDBaVzVrTDNOeVl5OWxlSFJsYm1RdVkyOW1abVZsSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJjb25zdGFudHMgPSBpbXBvcnQgJy4vY29uc3RhbnRzJ1xuaGVscGVycyA9IGltcG9ydCAnLi9oZWxwZXJzJ1xuXG5RdWlja0NTUyA9ICh0YXJnZXRFbCwgcHJvcGVydHksIHZhbHVlKS0+XG5cdGlmIGhlbHBlcnMuaXNJdGVyYWJsZSh0YXJnZXRFbClcblx0XHRRdWlja0NTUyhzdWJFbCwgcHJvcGVydHksIHZhbHVlKSBmb3Igc3ViRWwgaW4gdGFyZ2V0RWxcblx0XG5cdGVsc2UgaWYgdHlwZW9mIHByb3BlcnR5IGlzICdvYmplY3QnICMgUGFzc2VkIGEgc3R5bGUgbWFwXG5cdFx0UXVpY2tDU1ModGFyZ2V0RWwsIHN1YlByb3BlcnR5LCBzdWJWYWx1ZSkgZm9yIHN1YlByb3BlcnR5LHN1YlZhbHVlIG9mIHByb3BlcnR5XG5cdFxuXHRlbHNlXG5cdFx0cHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5KHByb3BlcnR5KVxuXHRcdGlmIHR5cGVvZiB2YWx1ZSBpcyAndW5kZWZpbmVkJ1xuXHRcdFx0Y29tcHV0ZWRTdHlsZSA9IHRhcmdldEVsLl9jb21wdXRlZFN0eWxlIHx8PSBnZXRDb21wdXRlZFN0eWxlKHRhcmdldEVsKVxuXHRcdFx0cmV0dXJuIGNvbXB1dGVkU3R5bGVbcHJvcGVydHldXG5cdFx0XG5cdFx0ZWxzZSBpZiBwcm9wZXJ0eVxuXHRcdFx0dGFyZ2V0RWwuc3R5bGVbcHJvcGVydHldID0gaGVscGVycy5ub3JtYWxpemVWYWx1ZShwcm9wZXJ0eSwgdmFsdWUpXG5cblx0cmV0dXJuXG5cblxuUXVpY2tDU1MuYW5pbWF0aW9uID0gKG5hbWUsIGZyYW1lcyktPiBpZiBuYW1lIGFuZCB0eXBlb2YgbmFtZSBpcyAnc3RyaW5nJyBhbmQgZnJhbWVzIGFuZCB0eXBlb2YgZnJhbWVzIGlzICdvYmplY3QnXG5cdHByZWZpeCA9IGhlbHBlcnMuZ2V0UHJlZml4KCdhbmltYXRpb24nKVxuXHRnZW5lcmF0ZWQgPSAnJ1xuXHRcblx0Zm9yIGZyYW1lLHJ1bGVzIG9mIGZyYW1lc1xuXHRcdGdlbmVyYXRlZCArPSBcIiN7ZnJhbWV9IHsje2hlbHBlcnMucnVsZVRvU3RyaW5nKHJ1bGVzKX19XCJcblxuXHRnZW5lcmF0ZWQgPSBcIkAje3ByZWZpeH1rZXlmcmFtZXMgI3tuYW1lfSB7I3tnZW5lcmF0ZWR9fVwiXG5cdGhlbHBlcnMuaW5saW5lU3R5bGUoZ2VuZXJhdGVkLCB0cnVlLCAwKVxuXG5cblF1aWNrQ1NTLnJlZ2lzdGVyID0gKHJ1bGUsIGxldmVsKS0+IGlmIHJ1bGUgYW5kIHR5cGVvZiBydWxlIGlzICdvYmplY3QnXG5cdGxldmVsIHx8PSAwXG5cdHJ1bGUgPSBoZWxwZXJzLnJ1bGVUb1N0cmluZyhydWxlKVxuXHRcblx0dW5sZXNzIGNsYXNzTmFtZSA9IGhlbHBlcnMuaW5saW5lU3R5bGVDb25maWdbbGV2ZWxdP1tydWxlXVxuXHRcdGNsYXNzTmFtZSA9IGhlbHBlcnMuaGFzaChydWxlKVxuXHRcdHN0eWxlID0gXCIuI3tjbGFzc05hbWV9IHsje3J1bGV9fVwiXG5cdFx0aGVscGVycy5pbmxpbmVTdHlsZShzdHlsZSwgY2xhc3NOYW1lLCBsZXZlbClcblxuXHRyZXR1cm4gY2xhc3NOYW1lXG5cblxuUXVpY2tDU1MuY2xlYXJSZWdpc3RlcmVkID0gKGxldmVsKS0+XG5cdGhlbHBlcnMuY2xlYXJJbmxpbmVTdHlsZShsZXZlbCBvciAwKVxuXG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrQ1NTLlVOU0VUID0gc3dpdGNoXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywndW5zZXQnKSB0aGVuICd1bnNldCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbml0aWFsJykgdGhlbiAnaW5pdGlhbCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbmhlcml0JykgdGhlbiAnaW5oZXJpdCdcblxuUXVpY2tDU1Muc3VwcG9ydHMgPSBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWRcblF1aWNrQ1NTLnN1cHBvcnRzUHJvcGVydHkgPSBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZFxuUXVpY2tDU1Mubm9ybWFsaXplUHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5XG5RdWlja0NTUy5ub3JtYWxpemVWYWx1ZSA9IGhlbHBlcnMubm9ybWFsaXplVmFsdWVcblF1aWNrQ1NTLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrQ1NTIiwie1xuICBcIl9hcmdzXCI6IFtcbiAgICBbXG4gICAgICBcInF1aWNrY3NzQDEuMy4yXCIsXG4gICAgICBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIlxuICAgIF1cbiAgXSxcbiAgXCJfZnJvbVwiOiBcInF1aWNrY3NzQDEuMy4yXCIsXG4gIFwiX2lkXCI6IFwicXVpY2tjc3NAMS4zLjJcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1MakJVQm81cmVxbWNINUZDQzJ0WVFuUVdtMzZ3QjBXWHNCTm1zNWdEOVdOeU43VDRXSDlqbFZHUVAvbm5Fbm1IdDNTRG55cmFzVDNlTWJFVUROdlhRUT09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3F1aWNrY3NzXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJ2ZXJzaW9uXCIsXG4gICAgXCJyZWdpc3RyeVwiOiB0cnVlLFxuICAgIFwicmF3XCI6IFwicXVpY2tjc3NAMS4zLjJcIixcbiAgICBcIm5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICAgIFwicmF3U3BlY1wiOiBcIjEuMy4yXCIsXG4gICAgXCJzYXZlU3BlY1wiOiBudWxsLFxuICAgIFwiZmV0Y2hTcGVjXCI6IFwiMS4zLjJcIlxuICB9LFxuICBcIl9yZXF1aXJlZEJ5XCI6IFtcbiAgICBcIi9cIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3F1aWNrY3NzLy0vcXVpY2tjc3MtMS4zLjIudGd6XCIsXG4gIFwiX3NwZWNcIjogXCIxLjMuMlwiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcImRhbmllbGthbGVuXCJcbiAgfSxcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3F1aWNrY3NzLmRlYnVnLmpzXCIsXG4gICAgXCIuL2Rpc3QvcXVpY2tjc3MuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2Nzcy9pc3N1ZXNcIlxuICB9LFxuICBcImRlc2NyaXB0aW9uXCI6IFwiRmFzdCAmIGxpZ2h0IHdyYXBwZXIgZm9yIGdldHRpbmcvc2V0dGluZyBDU1MgcnVsZXNcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy41LjBcIixcbiAgICBcImNoYWxrXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJjb2ZmZWUtc2NyaXB0XCI6IFwiXjEuMTIuNlwiLFxuICAgIFwiZXhlY2FcIjogXCJeMC43LjBcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4zXCIsXG4gICAgXCJwcm9taXNlLWJyZWFrXCI6IFwiXjAuMS4xXCIsXG4gICAgXCJzZW12ZXJcIjogXCJeNS4zLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuMC1zMjdcIixcbiAgICBcInNpbXBseXdhdGNoXCI6IFwiXjMuMC4wLWwyXCJcbiAgfSxcbiAgXCJkaXJlY3Rvcmllc1wiOiB7XG4gICAgXCJ0ZXN0XCI6IFwidGVzdFwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tjc3MjcmVhZG1lXCIsXG4gIFwibGljZW5zZVwiOiBcIklTQ1wiLFxuICBcIm1haW5cIjogXCJkaXN0L3F1aWNrY3NzLmpzXCIsXG4gIFwibmFtZVwiOiBcInF1aWNrY3NzXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrY3NzLmdpdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcImNha2UgLWQgYnVpbGQgJiYgY2FrZSBidWlsZCAmJiBjYWtlIG1lYXN1cmUgJiYgY3AgLXIgYnVpbGQvKiBkaXN0L1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJjYWtlIGluc3RhbGw6Y292ZXJhZ2U7IG5wbSBydW4gY292ZXJhZ2U6cnVuICYmIG5wbSBydW4gY292ZXJhZ2U6YmFkZ2VcIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnJ1blwiOiBcImNvdmVyYWdlPXRydWUgbnBtIHJ1biB0ZXN0OmVsZWN0cm9uXCIsXG4gICAgXCJjb3ZlcmFnZTpzaG93XCI6IFwib3BlbiBjb3ZlcmFnZS9sY292LXJlcG9ydC9pbmRleC5odG1sXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJwb3N0dmVyc2lvblwiOiBcIm5wbSBydW4gYnVpbGQgJiYgZ2l0IGFkZCAuICYmIGdpdCBjb21taXQgLWEgLW0gJ1tCdWlsZF0nXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcIm5wbSBydW4gdGVzdDp0cmF2aXNcIixcbiAgICBcInRlc3RcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OmJyb3dzZXJcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRWxlY3Ryb24gLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpjaHJvbWVcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIENocm9tZSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmZpcmVmb3hcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRmlyZWZveCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpsb2NhbFwiOiBcIm9wZW4gdGVzdC90ZXN0cnVubmVyLmh0bWxcIixcbiAgICBcInRlc3Q6bWluaWZpZWRcIjogXCJtaW5pZmllZD0xIG5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6c2FmYXJpXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBTYWZhcmkgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYXVjZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIHNhdWNlPTEga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDp0cmF2aXNcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcIndhdGNoXCI6IFwiY2FrZSAtZCB3YXRjaFwiXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjMuMlwiXG59XG4iLCIhKGZ1bmN0aW9uKHdpbikge1xuXG4vKipcbiAqIEZhc3REb21cbiAqXG4gKiBFbGltaW5hdGVzIGxheW91dCB0aHJhc2hpbmdcbiAqIGJ5IGJhdGNoaW5nIERPTSByZWFkL3dyaXRlXG4gKiBpbnRlcmFjdGlvbnMuXG4gKlxuICogQGF1dGhvciBXaWxzb24gUGFnZSA8d2lsc29ucGFnZUBtZS5jb20+XG4gKiBAYXV0aG9yIEtvcm5lbCBMZXNpbnNraSA8a29ybmVsLmxlc2luc2tpQGZ0LmNvbT5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWluaSBsb2dnZXJcbiAqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xudmFyIGRlYnVnID0gMCA/IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSwgJ1tmYXN0ZG9tXScpIDogZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBOb3JtYWxpemVkIHJBRlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xudmFyIHJhZiA9IHdpbi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi5tc1JlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCBmdW5jdGlvbihjYikgeyByZXR1cm4gc2V0VGltZW91dChjYiwgMTYpOyB9O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBgRmFzdERvbWAuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEZhc3REb20oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5yZWFkcyA9IFtdO1xuICBzZWxmLndyaXRlcyA9IFtdO1xuICBzZWxmLnJhZiA9IHJhZi5iaW5kKHdpbik7IC8vIHRlc3QgaG9va1xuICBkZWJ1ZygnaW5pdGlhbGl6ZWQnLCBzZWxmKTtcbn1cblxuRmFzdERvbS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBGYXN0RG9tLFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgam9iIHRvIHRoZSByZWFkIGJhdGNoIGFuZFxuICAgKiBzY2hlZHVsZXMgYSBuZXcgZnJhbWUgaWYgbmVlZCBiZS5cbiAgICpcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIG1lYXN1cmU6IGZ1bmN0aW9uKGZuLCBjdHgpIHtcbiAgICBkZWJ1ZygnbWVhc3VyZScpO1xuICAgIHZhciB0YXNrID0gIWN0eCA/IGZuIDogZm4uYmluZChjdHgpO1xuICAgIHRoaXMucmVhZHMucHVzaCh0YXNrKTtcbiAgICBzY2hlZHVsZUZsdXNoKHRoaXMpO1xuICAgIHJldHVybiB0YXNrO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgam9iIHRvIHRoZVxuICAgKiB3cml0ZSBiYXRjaCBhbmQgc2NoZWR1bGVzXG4gICAqIGEgbmV3IGZyYW1lIGlmIG5lZWQgYmUuXG4gICAqXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICAgKiBAcHVibGljXG4gICAqL1xuICBtdXRhdGU6IGZ1bmN0aW9uKGZuLCBjdHgpIHtcbiAgICBkZWJ1ZygnbXV0YXRlJyk7XG4gICAgdmFyIHRhc2sgPSAhY3R4ID8gZm4gOiBmbi5iaW5kKGN0eCk7XG4gICAgdGhpcy53cml0ZXMucHVzaCh0YXNrKTtcbiAgICBzY2hlZHVsZUZsdXNoKHRoaXMpO1xuICAgIHJldHVybiB0YXNrO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYSBzY2hlZHVsZWQgJ3JlYWQnIG9yICd3cml0ZScgdGFzay5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHRhc2tcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2Vzc1xuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcjogZnVuY3Rpb24odGFzaykge1xuICAgIGRlYnVnKCdjbGVhcicsIHRhc2spO1xuICAgIHJldHVybiByZW1vdmUodGhpcy5yZWFkcywgdGFzaykgfHwgcmVtb3ZlKHRoaXMud3JpdGVzLCB0YXNrKTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIHRoaXMgRmFzdERvbSB3aXRoIHNvbWVcbiAgICogY3VzdG9tIGZ1bmN0aW9uYWxpdHkuXG4gICAqXG4gICAqIEJlY2F1c2UgZmFzdGRvbSBtdXN0ICphbHdheXMqIGJlIGFcbiAgICogc2luZ2xldG9uLCB3ZSdyZSBhY3R1YWxseSBleHRlbmRpbmdcbiAgICogdGhlIGZhc3Rkb20gaW5zdGFuY2UuIFRoaXMgbWVhbnMgdGFza3NcbiAgICogc2NoZWR1bGVkIGJ5IGFuIGV4dGVuc2lvbiBzdGlsbCBlbnRlclxuICAgKiBmYXN0ZG9tJ3MgZ2xvYmFsIHRhc2sgcXVldWUuXG4gICAqXG4gICAqIFRoZSAnc3VwZXInIGluc3RhbmNlIGNhbiBiZSBhY2Nlc3NlZFxuICAgKiBmcm9tIGB0aGlzLmZhc3Rkb21gLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgbXlGYXN0ZG9tID0gZmFzdGRvbS5leHRlbmQoe1xuICAgKiAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgKiAgICAgLy8gcnVucyBvbiBjcmVhdGlvblxuICAgKiAgIH0sXG4gICAqXG4gICAqICAgLy8gb3ZlcnJpZGUgYSBtZXRob2RcbiAgICogICBtZWFzdXJlOiBmdW5jdGlvbihmbikge1xuICAgKiAgICAgLy8gZG8gZXh0cmEgc3R1ZmYgLi4uXG4gICAqXG4gICAqICAgICAvLyB0aGVuIGNhbGwgdGhlIG9yaWdpbmFsXG4gICAqICAgICByZXR1cm4gdGhpcy5mYXN0ZG9tLm1lYXN1cmUoZm4pO1xuICAgKiAgIH0sXG4gICAqXG4gICAqICAgLi4uXG4gICAqIH0pO1xuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHByb3BzICBwcm9wZXJ0aWVzIHRvIG1peGluXG4gICAqIEByZXR1cm4ge0Zhc3REb219XG4gICAqL1xuICBleHRlbmQ6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgZGVidWcoJ2V4dGVuZCcsIHByb3BzKTtcbiAgICBpZiAodHlwZW9mIHByb3BzICE9ICdvYmplY3QnKSB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIG9iamVjdCcpO1xuXG4gICAgdmFyIGNoaWxkID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICBtaXhpbihjaGlsZCwgcHJvcHMpO1xuICAgIGNoaWxkLmZhc3Rkb20gPSB0aGlzO1xuXG4gICAgLy8gcnVuIG9wdGlvbmFsIGNyZWF0aW9uIGhvb2tcbiAgICBpZiAoY2hpbGQuaW5pdGlhbGl6ZSkgY2hpbGQuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIGNoaWxkO1xuICB9LFxuXG4gIC8vIG92ZXJyaWRlIHRoaXMgd2l0aCBhIGZ1bmN0aW9uXG4gIC8vIHRvIHByZXZlbnQgRXJyb3JzIGluIGNvbnNvbGVcbiAgLy8gd2hlbiB0YXNrcyB0aHJvd1xuICBjYXRjaDogbnVsbFxufTtcblxuLyoqXG4gKiBTY2hlZHVsZXMgYSBuZXcgcmVhZC93cml0ZVxuICogYmF0Y2ggaWYgb25lIGlzbid0IHBlbmRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gc2NoZWR1bGVGbHVzaChmYXN0ZG9tKSB7XG4gIGlmICghZmFzdGRvbS5zY2hlZHVsZWQpIHtcbiAgICBmYXN0ZG9tLnNjaGVkdWxlZCA9IHRydWU7XG4gICAgZmFzdGRvbS5yYWYoZmx1c2guYmluZChudWxsLCBmYXN0ZG9tKSk7XG4gICAgZGVidWcoJ2ZsdXNoIHNjaGVkdWxlZCcpO1xuICB9XG59XG5cbi8qKlxuICogUnVucyBxdWV1ZWQgYHJlYWRgIGFuZCBgd3JpdGVgIHRhc2tzLlxuICpcbiAqIEVycm9ycyBhcmUgY2F1Z2h0IGFuZCB0aHJvd24gYnkgZGVmYXVsdC5cbiAqIElmIGEgYC5jYXRjaGAgZnVuY3Rpb24gaGFzIGJlZW4gZGVmaW5lZFxuICogaXQgaXMgY2FsbGVkIGluc3RlYWQuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZmx1c2goZmFzdGRvbSkge1xuICBkZWJ1ZygnZmx1c2gnKTtcblxuICB2YXIgd3JpdGVzID0gZmFzdGRvbS53cml0ZXM7XG4gIHZhciByZWFkcyA9IGZhc3Rkb20ucmVhZHM7XG4gIHZhciBlcnJvcjtcblxuICB0cnkge1xuICAgIGRlYnVnKCdmbHVzaGluZyByZWFkcycsIHJlYWRzLmxlbmd0aCk7XG4gICAgcnVuVGFza3MocmVhZHMpO1xuICAgIGRlYnVnKCdmbHVzaGluZyB3cml0ZXMnLCB3cml0ZXMubGVuZ3RoKTtcbiAgICBydW5UYXNrcyh3cml0ZXMpO1xuICB9IGNhdGNoIChlKSB7IGVycm9yID0gZTsgfVxuXG4gIGZhc3Rkb20uc2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgLy8gSWYgdGhlIGJhdGNoIGVycm9yZWQgd2UgbWF5IHN0aWxsIGhhdmUgdGFza3MgcXVldWVkXG4gIGlmIChyZWFkcy5sZW5ndGggfHwgd3JpdGVzLmxlbmd0aCkgc2NoZWR1bGVGbHVzaChmYXN0ZG9tKTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICBkZWJ1ZygndGFzayBlcnJvcmVkJywgZXJyb3IubWVzc2FnZSk7XG4gICAgaWYgKGZhc3Rkb20uY2F0Y2gpIGZhc3Rkb20uY2F0Y2goZXJyb3IpO1xuICAgIGVsc2UgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBydW4gdGhpcyBpbnNpZGUgYSB0cnkgY2F0Y2hcbiAqIHNvIHRoYXQgaWYgYW55IGpvYnMgZXJyb3IsIHdlXG4gKiBhcmUgYWJsZSB0byByZWNvdmVyIGFuZCBjb250aW51ZVxuICogdG8gZmx1c2ggdGhlIGJhdGNoIHVudGlsIGl0J3MgZW1wdHkuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcnVuVGFza3ModGFza3MpIHtcbiAgZGVidWcoJ3J1biB0YXNrcycpO1xuICB2YXIgdGFzazsgd2hpbGUgKHRhc2sgPSB0YXNrcy5zaGlmdCgpKSB0YXNrKCk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhbiBBcnJheS5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyYXlcbiAqIEBwYXJhbSAgeyp9IGl0ZW1cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZShhcnJheSwgaXRlbSkge1xuICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuICByZXR1cm4gISF+aW5kZXggJiYgISFhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG4vKipcbiAqIE1peGluIG93biBwcm9wZXJ0aWVzIG9mIHNvdXJjZVxuICogb2JqZWN0IGludG8gdGhlIHRhcmdldC5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRhcmdldFxuICogQHBhcmFtICB7T2JqZWN0fSBzb3VyY2VcbiAqL1xuZnVuY3Rpb24gbWl4aW4odGFyZ2V0LCBzb3VyY2UpIHtcbiAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxufVxuXG4vLyBUaGVyZSBzaG91bGQgbmV2ZXIgYmUgbW9yZSB0aGFuXG4vLyBvbmUgaW5zdGFuY2Ugb2YgYEZhc3REb21gIGluIGFuIGFwcFxudmFyIGV4cG9ydHMgPSB3aW4uZmFzdGRvbSA9ICh3aW4uZmFzdGRvbSB8fCBuZXcgRmFzdERvbSgpKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbi8vIEV4cG9zZSB0byBDSlMgJiBBTURcbmlmICgodHlwZW9mIGRlZmluZSkgPT0gJ2Z1bmN0aW9uJykgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gZXhwb3J0czsgfSk7XG5lbHNlIGlmICgodHlwZW9mIG1vZHVsZSkgPT0gJ29iamVjdCcpIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcblxufSkoIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdGhpcyk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12Wm1GemRHUnZiUzltWVhOMFpHOXRMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJJUyA9IGltcG9ydCAnLi4vY2hlY2tzJ1xuU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5cblxuY2xhc3MgQ29uZGl0aW9uXG5cdGNvbnN0cnVjdG9yOiAoQGZpZWxkLCBAc2V0dGluZ3MsIEBjYWxsYmFjayktPlxuXHRcdEBzYXRpc2ZpZWQgPSBmYWxzZVxuXHRcdEB2YWx1ZSA9IEBzZXR0aW5ncy52YWx1ZVxuXHRcdEBwcm9wZXJ0eSA9IEBzZXR0aW5ncy5wcm9wZXJ0eSBvciAnX3ZhbHVlJ1xuXHRcdEBwcm9wZXJ0eSA9ICdfdmFsdWUnIGlmIEBzZXR0aW5ncy5wcm9wZXJ0eSBpcyAndmFsdWUnXG5cdFx0dGFyZ2V0ID0gQGZpZWxkLmFsbEZpZWxkc1tAc2V0dGluZ3MudGFyZ2V0XSBvciBAc2V0dGluZ3MudGFyZ2V0XHRcblx0XHRcblx0XHRpZiBJUy5maWVsZCh0YXJnZXQpXG5cdFx0XHRAdGFyZ2V0ID0gdGFyZ2V0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGNvbnNvbGUud2FybihcImNvbmRpdGlvbiB0YXJnZXQgbm90IGZvdW5kIGZvciB0aGUgcHJvdmlkZWQgSUQgJyN7QHNldHRpbmdzLnRhcmdldH0nXCIsIEBmaWVsZClcblxuXHRcdHByb3BlcnR5ID0gaWYgSVMuYXJyYXkoQHRhcmdldFtAcHJvcGVydHldKSB0aGVuIFwiYXJyYXk6I3tAcHJvcGVydHl9XCIgZWxzZSBAcHJvcGVydHlcblxuXHRcdFNpbXBseUJpbmQocHJvcGVydHksIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHRhcmdldClcblx0XHRcdC5hbmQoJ3Zpc2libGUnKS5vZihAdGFyZ2V0LnN0YXRlKVxuXHRcdFx0XHQudG8oQGNhbGxiYWNrKVxuXG5cdFx0U2ltcGx5QmluZCgnc2F0aXNmaWVkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0LnRvIChuZXdWYWx1ZSwgb2xkVmFsdWUpPT4gQGZpZWxkLmVtaXQ/KCdjb25kaXRpb25DaGFuZ2UnLCBAKSBpZiBvbGRWYWx1ZT9cblxuXG5cdHRlc3Q6ICgpLT5cblx0XHRpZiBub3QgQHRhcmdldD8uc3RhdGUudmlzaWJsZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRjb21wYXJpc29uID0gc3dpdGNoXG5cdFx0XHR3aGVuIElTLm9iamVjdFBsYWluKEB2YWx1ZSkgdGhlbiBAdmFsdWVcblx0XHRcdHdoZW4gSVMucmVnZXgoQHZhbHVlKSB0aGVuICckcmVnZXgnOkB2YWx1ZVxuXHRcdFx0d2hlbiBAdmFsdWUgaXMgJ3ZhbGlkJyBhbmQgbm90IEBzZXR0aW5ncy5wcm9wZXJ0eSBvciBub3QgSVMuZGVmaW5lZChAdmFsdWUpIHRoZW4gJ3ZhbGlkJ1xuXHRcdFx0ZWxzZSAnJGVxJzpAdmFsdWVcblxuXHRcdGlmIGNvbXBhcmlzb24gaXMgJ3ZhbGlkJ1xuXHRcdFx0cmV0dXJuIEB0YXJnZXQudmFsaWRhdGUoKVxuXHRcdFxuXHRcdHRhcmdldFZhbHVlID0gZG8gKCk9PlxuXHRcdFx0cmV0dXJuIEB0YXJnZXQudmFsdWUgaWYgQHByb3BlcnR5IGlzICdfdmFsdWUnXG5cdFx0XHRwcm9wZXJ0eUNoYWluID0gQHByb3BlcnR5LnNwbGl0KCcuJylcblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIHByb3BlcnR5Q2hhaW4ubGVuZ3RoIGlzIDFcblx0XHRcdFx0XHRAdGFyZ2V0W0Bwcm9wZXJ0eV1cblxuXHRcdFx0XHR3aGVuIElTLmRlZmluZWQoQHRhcmdldFtAcHJvcGVydHldKVxuXHRcdFx0XHRcdEB0YXJnZXRbQHByb3BlcnR5XVxuXHRcdFx0XHRcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG5lc3RlZE9iamVjdCA9IEB0YXJnZXRcblx0XHRcdFx0XHR3aGlsZSBJUy5vYmplY3QobmVzdGVkT2JqZWN0KVxuXHRcdFx0XHRcdFx0bmVzdGVkT2JqZWN0ID0gbmVzdGVkT2JqZWN0W3Byb3BlcnR5Q2hhaW4ucG9wKCldXG5cblx0XHRcdFx0XHRyZXR1cm4gbmVzdGVkT2JqZWN0XG5cblx0XHRjb21wYXJpc29uT3BlcmF0b3JzID0gT2JqZWN0LmtleXMoY29tcGFyaXNvbilcblx0XHRwYXNzZWRDb21wYXJpc29ucyA9IGNvbXBhcmlzb25PcGVyYXRvcnMuZmlsdGVyIChvcGVyYXRvciktPlxuXHRcdFx0c2Vla2VkVmFsdWUgPSBjb21wYXJpc29uW29wZXJhdG9yXVxuXHRcdFx0c3dpdGNoIG9wZXJhdG9yXG5cdFx0XHRcdHdoZW4gJyRlcSdcdFx0dGhlbiB0YXJnZXRWYWx1ZSBpcyBzZWVrZWRWYWx1ZSBcblx0XHRcdFx0d2hlbiAnJG5lJ1x0XHR0aGVuIHRhcmdldFZhbHVlIGlzbnQgc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGd0J1x0XHR0aGVuIHRhcmdldFZhbHVlID4gc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGd0ZSdcdFx0dGhlbiB0YXJnZXRWYWx1ZSA+PSBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckbHQnXHRcdHRoZW4gdGFyZ2V0VmFsdWUgPCBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckbHRlJ1x0XHR0aGVuIHRhcmdldFZhbHVlIDw9IHNlZWtlZFZhbHVlXG5cdFx0XHRcdHdoZW4gJyRjdCdcdFx0dGhlbiBoZWxwZXJzLmluY2x1ZGVzKHRhcmdldFZhbHVlLCBzZWVrZWRWYWx1ZSlcblx0XHRcdFx0d2hlbiAnJG5jdCdcdFx0dGhlbiBub3QgaGVscGVycy5pbmNsdWRlcyh0YXJnZXRWYWx1ZSwgc2Vla2VkVmFsdWUpXG5cdFx0XHRcdHdoZW4gJyRyZWdleCdcdHRoZW4gc2Vla2VkVmFsdWUudGVzdCh0YXJnZXRWYWx1ZSlcblx0XHRcdFx0d2hlbiAnJG5yZWdleCdcdHRoZW4gbm90IHNlZWtlZFZhbHVlLnRlc3QodGFyZ2V0VmFsdWUpXG5cdFx0XHRcdHdoZW4gJyRtYXNrJ1x0dGhlbiBoZWxwZXJzLnRlc3RNYXNrKHRhcmdldFZhbHVlLCBzZWVrZWRWYWx1ZSlcblx0XHRcdFx0ZWxzZSBmYWxzZVxuXG5cdFx0cmV0dXJuIHBhc3NlZENvbXBhcmlzb25zLmxlbmd0aCBpcyBjb21wYXJpc29uT3BlcmF0b3JzLmxlbmd0aFxuXG5cblx0QHZhbGlkYXRlOiAoY29uZGl0aW9ucyktPiBpZiBjb25kaXRpb25zXG5cdFx0dmFsaWRDb25kaXRpb25zID0gY29uZGl0aW9ucy5maWx0ZXIgKGNvbmRpdGlvbiktPlxuXHRcdFx0Y29uZGl0aW9uLnNhdGlzZmllZCA9IGNvbmRpdGlvbi50ZXN0KClcblx0XHRcblx0XHRyZXR1cm4gdmFsaWRDb25kaXRpb25zLmxlbmd0aCBpcyBjb25kaXRpb25zLmxlbmd0aFxuXG5cblx0QGluaXQ6IChmaWVsZCwgY29uZGl0aW9ucywgY2FsbGJhY2spLT4gc2V0VGltZW91dCAoKT0+XG5cdFx0Y2FsbGJhY2sgPz0gKCk9PiBmaWVsZC52YWxpZGF0ZUNvbmRpdGlvbnMoKVxuXHRcdFxuXHRcdGZpZWxkLmNvbmRpdGlvbnMgPSBjb25kaXRpb25zLm1hcCAoY29uZGl0aW9uKS0+XG5cdFx0XHRuZXcgQ29uZGl0aW9uKGZpZWxkLCBjb25kaXRpb24sIGNhbGxiYWNrKVxuXG5cdFx0Y2FsbGJhY2soKVxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmRpdGlvbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBmb250RmFtaWx5OiAnc3lzdGVtLXVpLCBzYW5zLXNlcmlmJyxcbiAgdGVtcGxhdGVzOiB7fSxcbiAgbGFiZWw6IGZhbHNlLFxuICBlcnJvcjogJycsXG4gIGhlbHA6ICcnLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICB3aWR0aDogJzEwMCUnLFxuICBtb2JpbGVXaWR0aDogbnVsbCxcbiAgbW9iaWxlVGhyZXNob2xkOiA3MzYsXG4gIGJvcmRlcjogMSxcbiAgbWFyZ2luOiBudWxsLFxuICBwYWRkaW5nOiBudWxsLFxuICBkaXN0YW5jZTogbnVsbCxcbiAgaW5wdXRQYWRkaW5nOiAxMixcbiAgZm9udFNpemU6IDE0LFxuICBsYWJlbFNpemU6IG51bGwsXG4gIGljb246IG51bGwsXG4gIGljb25TaXplOiAyMixcbiAgZ2V0dGVyOiBudWxsLFxuICBzZXR0ZXI6IG51bGwsXG4gIHZhbGlkYXRvcjogbnVsbCxcbiAgY2xlYXJFcnJvck9uVmFsaWQ6IHRydWVcbn07XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUptYVdWc1pDOW5iRzlpWVd4RVpXWmhkV3gwY3k1amIyWm1aV1VpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2VzExOSIsIklTID0gaW1wb3J0ICcuLi8uLi9jaGVja3MnXG5TaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcbktFWUNPREVTID0gaW1wb3J0ICcuLi8uLi9jb25zdGFudHMva2V5Q29kZXMnXG5oZWxwZXJzID0gaW1wb3J0ICcuLi8uLi9oZWxwZXJzJ1xuQ29uZGl0aW9uID0gaW1wb3J0ICcuLi9jb25kaXRpb24nXG5leHRlbmQgPSBpbXBvcnQgJ3NtYXJ0LWV4dGVuZCdcbkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5nbG9iYWxEZWZhdWx0cyA9IGltcG9ydCAnLi4vLi4vZmllbGQvZ2xvYmFsRGVmYXVsdHMnXG5pbXBvcnQgKiBhcyB0ZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlJ1xuaW1wb3J0ICogYXMgZGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0cydcblxuY2xhc3MgRHJvcGRvd25cblx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdGRlZmF1bHRzOiBkZWZhdWx0c1xuXHRfc2V0dGluZ0ZpbHRlcnM6IG1heEhlaWdodDogKHZhbHVlKS0+IElTLm51bWJlcih2YWx1ZSlcblx0XG5cdGNvbnN0cnVjdG9yOiAoQGluaXRpYWxDaG9pY2VzLCBAZmllbGQpLT5cblx0XHRAaXNPcGVuID0gZmFsc2Vcblx0XHRAdHlwZUJ1ZmZlciA9ICcnXG5cdFx0QHNldHRpbmdzID0gZXh0ZW5kLmRlZXAuY2xvbmUuZmlsdGVyKEBfc2V0dGluZ0ZpbHRlcnMpKGdsb2JhbERlZmF1bHRzLCBAZGVmYXVsdHMsIEBmaWVsZC5zZXR0aW5ncy5kcm9wZG93bilcblx0XHRAc2VsZWN0ZWQgPSBpZiBAc2V0dGluZ3MubXVsdGlwbGUgdGhlbiBbXSBlbHNlIG51bGxcblx0XHRAbGFzdFNlbGVjdGVkID0gbnVsbFxuXHRcdEBjaG9pY2VzID0gW11cblx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gbnVsbFxuXHRcdEB2aXNpYmxlQ2hvaWNlc0NvdW50ID0gMFxuXHRcdEB2aXNpYmxlQ2hvaWNlcyA9IFtdXG5cdFx0QGVscyA9IHt9XG5cdFx0QF9zZWxlY3RlZENhbGxiYWNrID0gaGVscGVycy5ub29wXG5cdFx0XG5cdFx0QF9jcmVhdGVFbGVtZW50cygpXG5cdFx0QF9hdHRhY2hCaW5kaW5ncygpXG5cdFx0cmV0dXJuIEBcblxuXG5cdF9jcmVhdGVFbGVtZW50czogKCktPlxuXHRcdGdsb2JhbE9wdHMgPSB7cmVsYXRlZEluc3RhbmNlOkB9XG5cdFx0QGVscy5jb250YWluZXIgPSBAdGVtcGxhdGUuZGVmYXVsdC5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmRlZmF1bHQsIGV4dGVuZCh7cGFzc1N0YXRlVG9DaGlsZHJlbjpmYWxzZX0sIGdsb2JhbE9wdHMpKVxuXHRcdEBlbHMubGlzdCA9IEB0ZW1wbGF0ZS5saXN0LnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMubGlzdCwgZ2xvYmFsT3B0cykuYXBwZW5kVG8oQGVscy5jb250YWluZXIpXG5cdFx0QGVscy5oZWxwID0gQHRlbXBsYXRlLmhlbHAuc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5oZWxwLCBnbG9iYWxPcHRzKS5hcHBlbmRUbyhAZWxzLmNvbnRhaW5lcilcblx0XHRAZWxzLnNjcm9sbEluZGljYXRvclVwID0gQHRlbXBsYXRlLnNjcm9sbEluZGljYXRvclVwLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuc2Nyb2xsSW5kaWNhdG9yVXAsIGdsb2JhbE9wdHMpLmFwcGVuZFRvKEBlbHMuY29udGFpbmVyKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93biA9IEB0ZW1wbGF0ZS5zY3JvbGxJbmRpY2F0b3JEb3duLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuc2Nyb2xsSW5kaWNhdG9yRG93biwgZ2xvYmFsT3B0cykuYXBwZW5kVG8oQGVscy5jb250YWluZXIpXG5cblx0XHRAbGlzdCA9IG5ldyBMaXN0KEApXG5cdFx0QGFkZENob2ljZShjaG9pY2UpIGZvciBjaG9pY2UgaW4gQGluaXRpYWxDaG9pY2VzXG5cdFx0cmV0dXJuXG5cblxuXG5cdF9hdHRhY2hCaW5kaW5nczogKCktPlxuXHRcdEBfYXR0YWNoQmluZGluZ3NfZWxTdGF0ZSgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5KClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX3Njcm9sbEluZGljYXRvcnMoKVxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2VsU3RhdGU6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdoZWxwJykub2YoQHNldHRpbmdzKVxuXHRcdFx0LnRvKCd0ZXh0Jykub2YoQGVscy5oZWxwKVxuXHRcdFx0LmFuZC50byAoc2hvd0hlbHApPT4gQGVscy5oZWxwLnN0YXRlICdzaG93SGVscCcsIHNob3dIZWxwXG5cblx0XHRTaW1wbHlCaW5kKCd2aXNpYmxlQ2hvaWNlc0NvdW50Jykub2YoQClcblx0XHRcdC50byAoY291bnQpPT4gQGVscy5jb250YWluZXIuc3RhdGUgJ2hhc1Zpc2libGVDaG9pY2VzJywgISFjb3VudFxuXHRcblx0XHRTaW1wbHlCaW5kKCdjdXJyZW50SGlnaGxpZ2h0ZWQnKS5vZihAKVxuXHRcdFx0LnRvIChjdXJyZW50LCBwcmV2KT0+XG5cdFx0XHRcdHByZXYuZWwuc3RhdGUoJ2hvdmVyJywgb2ZmKSBpZiBwcmV2XG5cdFx0XHRcdGN1cnJlbnQuZWwuc3RhdGUoJ2hvdmVyJywgb24pIGlmIGN1cnJlbnRcblxuXG5cdF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5OiAoKS0+XG5cdFx0U2ltcGx5QmluZCgnaXNPcGVuJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKS50byAoaXNPcGVuKT0+XG5cdFx0XHRAZWxzLmNvbnRhaW5lci5zdGF0ZSAnaXNPcGVuJywgaXNPcGVuXHRcdFxuXHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IG51bGwgaWYgbm90IGlzT3BlblxuXHRcblx0XHRcdGlmIEBzZXR0aW5ncy5sb2NrU2Nyb2xsXG5cdFx0XHRcdGlmIGlzT3BlblxuXHRcdFx0XHRcdGhlbHBlcnMubG9ja1Njcm9sbChAZWxzLmxpc3QpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRoZWxwZXJzLnVubG9ja1Njcm9sbCgpXG5cblx0XHRcdGlmIGlzT3BlblxuXHRcdFx0XHRAbGlzdC5jYWxjRGlzcGxheSgpXG5cdFx0XHRcdEBsaXN0LnNjcm9sbFRvQ2hvaWNlKEBzZWxlY3RlZCkgaWYgQHNlbGVjdGVkIGFuZCBub3QgQHNldHRpbmdzLm11bHRpcGxlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBsaXN0LnNldFRyYW5zbGF0ZSgwKVxuXG5cblx0XHRTaW1wbHlCaW5kKCdsYXN0U2VsZWN0ZWQnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UsIHVwZGF0ZUV2ZW5JZlNhbWU6dHJ1ZSkub2YoQClcblx0XHRcdC50byAobmV3Q2hvaWNlLCBwcmV2Q2hvaWNlKT0+IEBfc2VsZWN0ZWRDYWxsYmFjayhuZXdDaG9pY2UsIHByZXZDaG9pY2UpXG5cblxuXHRcdFNpbXBseUJpbmQoJ2ZvY3VzZWQnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEBmaWVsZC5zdGF0ZSkudG8gKGZvY3VzZWQpPT5cblx0XHRcdGlmIG5vdCBmb2N1c2VkXG5cdFx0XHRcdEBmaWVsZC5lbC5jaGlsZC5pbnB1dC5vZmYgJ2tleWRvd24uZHJvcGRvd25OYXYnXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBmaWVsZC5lbC5jaGlsZC5pbnB1dC5vbiAna2V5ZG93bi5kcm9wZG93bk5hdicsIChldmVudCk9PiBpZiBAaXNPcGVuIHRoZW4gc3dpdGNoIGV2ZW50LmtleUNvZGVcblx0XHRcdFx0XHR3aGVuIEtFWUNPREVTLnVwXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0XHRAaGlnaGxpZ2h0UHJldigpXG5cblx0XHRcdFx0XHR3aGVuIEtFWUNPREVTLmRvd25cblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdEBoaWdobGlnaHROZXh0KClcblxuXHRcdFx0XHRcdHdoZW4gS0VZQ09ERVMuZW50ZXJcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdEBsYXN0U2VsZWN0ZWQgPSBAY3VycmVudEhpZ2hsaWdodGVkIGlmIEBjdXJyZW50SGlnaGxpZ2h0ZWRcblxuXHRcdFx0XHRcdHdoZW4gS0VZQ09ERVMuZXNjXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0XHRAaXNPcGVuID0gZmFsc2VcblxuXHRcdFxuXHRcdHJldHVybiBpZiBub3QgQHNldHRpbmdzLnR5cGVCdWZmZXJcblx0XHRTaW1wbHlCaW5kKCdmb2N1c2VkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAZmllbGQuc3RhdGUpLnRvIChmb2N1c2VkKT0+XG5cdFx0XHRpZiBub3QgZm9jdXNlZFxuXHRcdFx0XHRET00oZG9jdW1lbnQpLm9mZiAna2V5cHJlc3MuZHJvcGRvd25UeXBlQnVmZmVyJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRET00oZG9jdW1lbnQpLm9uICdrZXlwcmVzcy5kcm9wZG93blR5cGVCdWZmZXInLCAoZXZlbnQpPT4gaWYgQGlzT3BlblxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRyZXR1cm4gaWYgbm90IEtFWUNPREVTLmFueVByaW50YWJsZShldmVudC5rZXlDb2RlKVxuXHRcdFx0XHRcdEB0eXBlQnVmZmVyICs9IGV2ZW50LmtleVxuXG5cblx0XHRTaW1wbHlCaW5kKCd0eXBlQnVmZmVyJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0LnRvICgpPT5cblx0XHRcdFx0Y2xlYXJUaW1lb3V0KEB0eXBlQnVmZmVyVGltZW91dClcblx0XHRcdFx0QHR5cGVCdWZmZXJUaW1lb3V0ID0gc2V0VGltZW91dCAoKT0+XG5cdFx0XHRcdFx0QHR5cGVCdWZmZXIgPSAnJ1xuXHRcdFx0XHQsMTUwMFxuXHRcdFx0XG5cdFx0XHQuYW5kLnRvIChidWZmZXIpPT4gaWYgYnVmZmVyXG5cdFx0XHRcdGZvciBjaG9pY2UgaW4gQHZpc2libGVDaG9pY2VzXG5cdFx0XHRcdFx0aWYgaGVscGVycy5zdGFydHNXaXRoKGJ1ZmZlciwgY2hvaWNlLmxhYmVsKVxuXHRcdFx0XHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IGNob2ljZVxuXHRcdFx0XHRcdFx0QGxpc3Quc2Nyb2xsVG9DaG9pY2UoY2hvaWNlKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc19zY3JvbGxJbmRpY2F0b3JzOiAoKS0+XG5cdFx0U2ltcGx5QmluZCgnc2Nyb2xsVG9wJywgdXBkYXRlRXZlbklmU2FtZTp0cnVlKS5vZihAZWxzLmxpc3QucmF3KVxuXHRcdFx0LnRvIChzY3JvbGxUb3ApPT5cblx0XHRcdFx0c2hvd1RvcEluZGljYXRvciA9IHNjcm9sbFRvcCA+IDBcblx0XHRcdFx0c2hvd0JvdHRvbUluZGljYXRvciA9IEBlbHMubGlzdC5yYXcuc2Nyb2xsSGVpZ2h0IC0gQGVscy5saXN0LnJhdy5jbGllbnRIZWlnaHQgPiBzY3JvbGxUb3BcblxuXHRcdFx0XHRAZWxzLnNjcm9sbEluZGljYXRvclVwLnN0YXRlICd2aXNpYmxlJywgc2hvd1RvcEluZGljYXRvclxuXHRcdFx0XHRAZWxzLnNjcm9sbEluZGljYXRvckRvd24uc3RhdGUgJ3Zpc2libGUnLCBzaG93Qm90dG9tSW5kaWNhdG9yXG5cblx0XHRcdC5jb25kaXRpb24gKCk9PiBAaXNPcGVuIGFuZCBub3QgQHNldHRpbmdzLmhlbHAgYW5kIEBlbHMubGlzdC5yYXcuc2Nyb2xsSGVpZ2h0IGlzbnQgQGVscy5saXN0LnJhdy5jbGllbnRIZWlnaHQgYW5kIEBlbHMubGlzdC5yYXcuY2xpZW50SGVpZ2h0ID49IDEwMFxuXHRcdFx0LnVwZGF0ZU9uKCdldmVudDpzY3JvbGwnKS5vZihAZWxzLmxpc3QucmF3KVxuXHRcdFx0LnVwZGF0ZU9uKCdpc09wZW4nKS5vZihAKVxuXG5cdFx0QGVscy5zY3JvbGxJbmRpY2F0b3JVcC5vbiAnbW91c2VlbnRlcicsICgpPT4gQGxpc3Quc3RhcnRTY3JvbGxpbmcoJ3VwJylcblx0XHRAZWxzLnNjcm9sbEluZGljYXRvclVwLm9uICdtb3VzZWxlYXZlJywgKCk9PiBAbGlzdC5zdG9wU2Nyb2xsaW5nKClcblx0XHRAZWxzLnNjcm9sbEluZGljYXRvckRvd24ub24gJ21vdXNlZW50ZXInLCAoKT0+IEBsaXN0LnN0YXJ0U2Nyb2xsaW5nKCdkb3duJylcblx0XHRAZWxzLnNjcm9sbEluZGljYXRvckRvd24ub24gJ21vdXNlbGVhdmUnLCAoKT0+IEBsaXN0LnN0b3BTY3JvbGxpbmcoKVxuXG5cblx0YWRkQ2hvaWNlOiAoY29uZmlnKS0+XG5cdFx0aWYgSVMuYXJyYXkoY29uZmlnKVxuXHRcdFx0QGFkZENob2ljZShpdGVtKSBmb3IgaXRlbSBpbiBjb25maWdcblx0XHRcdHJldHVyblxuXHRcdFxuXHRcdGVsc2UgaWYgSVMuc3RyaW5nKGNvbmZpZylcblx0XHRcdGNvbmZpZyA9IHtsYWJlbDpjb25maWcsIHZhbHVlOmNvbmZpZ31cblx0XHRcblx0XHRlbHNlIGlmIElTLm9iamVjdFBsYWluKGNvbmZpZylcblx0XHRcdGNvbmZpZy52YWx1ZSA/PSBjb25maWcubGFiZWxcblx0XHRcdGNvbmZpZy5sYWJlbCA/PSBjb25maWcudmFsdWVcblxuXHRcdGVsc2UgcmV0dXJuXG5cblx0XHRuZXdDaG9pY2UgPSBuZXcgQ2hvaWNlKEAsIGNvbmZpZywgQGxpc3QsIEBjaG9pY2VzLmxlbmd0aClcblx0XHRAY2hvaWNlcy5wdXNoKG5ld0Nob2ljZSlcblx0XHRyZXR1cm4gbmV3Q2hvaWNlXG5cblxuXHRhcHBlbmRUbzogKHRhcmdldCktPlxuXHRcdEBlbHMuY29udGFpbmVyLmFwcGVuZFRvKHRhcmdldClcblxuXG5cdG9uU2VsZWN0ZWQ6IChjYWxsYmFjayktPlxuXHRcdEBfc2VsZWN0ZWRDYWxsYmFjayA9IGNhbGxiYWNrXG5cblxuXHRmaW5kQ2hvaWNlOiAocHJvdmlkZWRWYWx1ZSwgYnlMYWJlbCktPlxuXHRcdG1hdGNoZXMgPSBAY2hvaWNlcy5maWx0ZXIgKGNob2ljZSktPiBzd2l0Y2hcblx0XHRcdHdoZW4gSVMub2JqZWN0KHByb3ZpZGVkVmFsdWUpIHRoZW4gcHJvdmlkZWRWYWx1ZSBpcyBjaG9pY2Vcblx0XHRcdHdoZW4gYnlMYWJlbCB0aGVuIHByb3ZpZGVkVmFsdWUgaXMgY2hvaWNlLmxhYmVsXG5cdFx0XHRlbHNlIHByb3ZpZGVkVmFsdWUgaXMgY2hvaWNlLnZhbHVlXG5cblx0XHRyZXR1cm4gbWF0Y2hlc1swXVxuXG5cblx0ZmluZENob2ljZUFueTogKHByb3ZpZGVkVmFsdWUpLT5cblx0XHRAZmluZENob2ljZShwcm92aWRlZFZhbHVlKSBvciBAZmluZENob2ljZShwcm92aWRlZFZhbHVlLCB0cnVlKVxuXG5cblx0aGlnaGxpZ2h0UHJldjogKCktPlxuXHRcdGN1cnJlbnRJbmRleCA9IEB2aXNpYmxlQ2hvaWNlcy5pbmRleE9mKEBjdXJyZW50SGlnaGxpZ2h0ZWQpXG5cdFx0XG5cdFx0aWYgY3VycmVudEluZGV4ID4gMFxuXHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IGNob2ljZSA9IEB2aXNpYmxlQ2hvaWNlc1tjdXJyZW50SW5kZXgtMV1cblx0XHRcdEBsaXN0LnNjcm9sbFVwKGNob2ljZSkgdW5sZXNzIEBsaXN0LmNob2ljZUluVmlldyhjaG9pY2UpXG5cdFx0ZWxzZVxuXHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IGNob2ljZSA9IEB2aXNpYmxlQ2hvaWNlc1tAdmlzaWJsZUNob2ljZXMubGVuZ3RoLTFdXG5cdFx0XHRAbGlzdC5zY3JvbGxUb0Nob2ljZShjaG9pY2UsMSkgdW5sZXNzIEBsaXN0LmNob2ljZUluVmlldyhjaG9pY2UpXG5cblxuXG5cdGhpZ2hsaWdodE5leHQ6ICgpLT5cblx0XHRjdXJyZW50SW5kZXggPSBAdmlzaWJsZUNob2ljZXMuaW5kZXhPZihAY3VycmVudEhpZ2hsaWdodGVkKVxuXHRcdFxuXHRcdGlmIGN1cnJlbnRJbmRleCA8IEB2aXNpYmxlQ2hvaWNlcy5sZW5ndGgtMVxuXHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IGNob2ljZSA9IEB2aXNpYmxlQ2hvaWNlc1tjdXJyZW50SW5kZXgrMV1cblx0XHRcdEBsaXN0LnNjcm9sbERvd24oY2hvaWNlKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblx0XHRlbHNlXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzWzBdXG5cdFx0XHRAbGlzdC5zY3JvbGxUb0Nob2ljZShjaG9pY2UsMSkgdW5sZXNzIEBsaXN0LmNob2ljZUluVmlldyhjaG9pY2UpXG5cblxuXG5cblxuXG5cbmNsYXNzIExpc3Rcblx0Y29uc3RydWN0b3I6IChAZHJvcGRvd24pLT5cblx0XHR7QGVscywgQGZpZWxkLCBAc2V0dGluZ3N9ID0gQGRyb3Bkb3duXG5cdFx0QGVsID0gQGVscy5saXN0XG5cdFx0QGNvbnRhaW5lciA9IEBlbHMuY29udGFpbmVyXG5cblx0Y2FsY0Rpc3BsYXk6ICgpLT5cblx0XHR3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcblx0XHR0cmFuc2xhdGlvbiA9IEB0cmFuc2xhdGlvbiBvciAwXG5cdFx0Y2xpcHBpbmdQYXJlbnQgPSBAY29udGFpbmVyLnBhcmVudE1hdGNoaW5nIChwYXJlbnQpLT4gb3ZlcmZsb3c9cGFyZW50LnN0eWxlKCdvdmVyZmxvd1knKTsgb3ZlcmZsb3cgaXMgJ2hpZGRlbicgb3Igb3ZlcmZsb3cgaXMgJ3Njcm9sbCdcblx0XHRzY3JvbGxIZWlnaHQgPSBAZWwucmF3LnNjcm9sbEhlaWdodCBvciBJbmZpbml0eVxuXHRcdHNlbGZSZWN0ID0gZXh0ZW5kLmNsb25lIEBjb250YWluZXIucmVjdFxuXHRcdHBhZGRpbmcgPSBzZWxmUmVjdC5oZWlnaHQgLSBAZWwuaGVpZ2h0XG5cdFx0aGVpZ2h0ID0gTWF0aC5taW4gc2Nyb2xsSGVpZ2h0LCBAc2V0dGluZ3MubWF4SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQtNDBcblx0XHRzZWxmUmVjdC5ib3R0b20gPSBzZWxmUmVjdC50b3AgKyBoZWlnaHRcblxuXHRcdGlmIGNsaXBwaW5nUGFyZW50XG5cdFx0XHRjbGlwcGluZ1JlY3QgPSBjbGlwcGluZ1BhcmVudC5yZWN0XG5cdFx0XHRib3R0b21DdXRvZmYgPSBzZWxmUmVjdC5ib3R0b20gLSBjbGlwcGluZ1JlY3QuYm90dG9tXG5cdFx0XHR0b3BDdXRvZmYgPSBjbGlwcGluZ1JlY3QudG9wIC0gc2VsZlJlY3QudG9wXG5cdFx0XHRpc0JvdHRvbUN1dG9mZiA9IGJvdHRvbUN1dG9mZiA+IDBcblx0XHRcdGlzVG9wQ3V0b2ZmID0gdG9wQ3V0b2ZmID4gMFxuXG5cdFx0XHRpZiBzZWxmUmVjdC50b3AgPj0gY2xpcHBpbmdSZWN0LmJvdHRvbSBvciBjbGlwcGluZ1JlY3QudG9wID49IHNlbGZSZWN0LmJvdHRvbVxuXHRcdFx0XHRjb25zb2xlLndhcm4oXCJUaGUgZHJvcGRvd24gZm9yIGVsZW1lbnQgJyN7QGZpZWxkLklEfScgY2Fubm90IGJlIGRpc3BsYXllZCBhcyBpdCdzIGhpZGRlbiBieSB0aGUgcGFyZW50IG92ZXJmbG93XCIpXG5cdFx0XHRcblx0XHRcdGVsc2UgaWYgaXNCb3R0b21DdXRvZmYgb3IgaXNUb3BDdXRvZmZcblx0XHRcdFx0bmVlZHNOZXdIZWlnaHQgPSB0cnVlXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBzZWxmUmVjdC50b3AgLSBib3R0b21DdXRvZmYgPiBjbGlwcGluZ1JlY3QudG9wIGFuZCBub3QgaXNUb3BDdXRvZmZcblx0XHRcdFx0XHR0cmFuc2xhdGlvbiA9IGJvdHRvbUN1dG9mZlxuXHRcdFx0XHRcdHNlbGZSZWN0LnRvcCAtPSB0cmFuc2xhdGlvblxuXHRcdFx0XHRcdHNlbGZSZWN0LmJvdHRvbSAtPSB0cmFuc2xhdGlvblxuXHRcdFx0XHRcdGN1dG9mZiA9IGNsaXBwaW5nUmVjdC50b3AgLSBzZWxmUmVjdC50b3BcblxuXHRcdFx0XHRlbHNlIGlmIHNlbGZSZWN0LmJvdHRvbSAtIHRvcEN1dG9mZiA8IGNsaXBwaW5nUmVjdC5ib3R0b21cblx0XHRcdFx0XHR0cmFuc2xhdGlvbiA9IHRvcEN1dG9mZiAqIC0xXG5cdFx0XHRcdFx0c2VsZlJlY3QudG9wICs9IHRyYW5zbGF0aW9uXG5cdFx0XHRcdFx0c2VsZlJlY3QuYm90dG9tICs9IHRyYW5zbGF0aW9uXG5cdFx0XHRcdFx0Y3V0b2ZmID0gc2VsZlJlY3QuYm90dG9tIC0gY2xpcHBpbmdSZWN0LmJvdHRvbVxuXG5cblx0XHRcdFx0aWYgbmVlZHNOZXdIZWlnaHQgPSBjdXRvZmYgPiAwXG5cdFx0XHRcdFx0aGVpZ2h0ID0gY3V0b2ZmIC0gcGFkZGluZ1xuXG5cdFx0XG5cdFx0d2luZG93Q3V0b2ZmID0gKHNlbGZSZWN0LnRvcCArIGhlaWdodCkgLSB3aW5kb3dIZWlnaHRcblx0XHRcblx0XHRpZiB3aW5kb3dDdXRvZmYgPiAwIGFuZCBoZWlnaHQgPCB3aW5kb3dIZWlnaHRcblx0XHRcdHRyYW5zbGF0aW9uICs9IHdpbmRvd0N1dG9mZisxMFxuXG5cdFx0QHNldERpbWVuc2lvbnMoaGVpZ2h0LCBAZmllbGQuZWwuY2hpbGQuaW5uZXJ3cmFwLndpZHRoKzEwKVxuXHRcdEBzZXRUcmFuc2xhdGUodHJhbnNsYXRpb24pXG5cblxuXHRzZXREaW1lbnNpb25zOiAoaGVpZ2h0LCB3aWR0aCktPlxuXHRcdEBlbC5zdHlsZSAnbWF4SGVpZ2h0JywgaGVpZ2h0IGlmIGhlaWdodD9cblx0XHRAZWwuc3R5bGUgJ21pbldpZHRoJywgd2lkdGggaWYgd2lkdGg/XG5cblx0XG5cdHNldFRyYW5zbGF0ZTogKHRyYW5zbGF0aW9uKS0+XG5cdFx0QHRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb25cblx0XHR0cmFuc2xhdGlvbiAqPSAtMVxuXHRcdEBjb250YWluZXIuc3R5bGUgJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlWSgje3RyYW5zbGF0aW9ufXB4KVwiXG5cblxuXHRzY3JvbGxUb0Nob2ljZTogKGNob2ljZSxvZmZzZXQ9MyktPlxuXHRcdGRpc3RhbmVGcm9tVG9wID0gY2hvaWNlLmVsLnJhdy5vZmZzZXRUb3Bcblx0XHRzZWxlY3RlZEhlaWdodCA9IGNob2ljZS5lbC5oZWlnaHRcblx0XHRcblx0XHRAZWwucmF3LnNjcm9sbFRvcCA9IGRpc3RhbmVGcm9tVG9wIC0gc2VsZWN0ZWRIZWlnaHQqb2Zmc2V0XG5cblx0c2Nyb2xsRG93bjogKGNob2ljZSktPlxuXHRcdEBlbC5yYXcuc2Nyb2xsVG9wICs9IGNob2ljZS5lbC5oZWlnaHRcblxuXHRzY3JvbGxVcDogKGNob2ljZSktPlxuXHRcdEBlbC5yYXcuc2Nyb2xsVG9wIC09IGNob2ljZS5lbC5oZWlnaHRcblxuXHRjaG9pY2VJblZpZXc6IChjaG9pY2UpPT5cblx0XHRjaG9pY2VSZWN0ID0gY2hvaWNlLmVsLnJlY3Rcblx0XHRsaXN0UmVjdCA9IEBlbC5yZWN0XG5cdFx0dXBQYWRkaW5nID0gaWYgQGVscy5zY3JvbGxJbmRpY2F0b3JVcC5zdGF0ZSgndmlzaWJsZScpIHRoZW4gcGFyc2VGbG9hdCBAZWxzLnNjcm9sbEluZGljYXRvclVwLnN0eWxlU2FmZSgnaGVpZ2h0Jyx0cnVlKVxuXHRcdGRvd25QYWRkaW5nID0gaWYgQGVscy5zY3JvbGxJbmRpY2F0b3JEb3duLnN0YXRlKCd2aXNpYmxlJykgdGhlbiBwYXJzZUZsb2F0IEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5zdHlsZVNhZmUoJ2hlaWdodCcsdHJ1ZSlcblxuXHRcdGNob2ljZVJlY3QuYm90dG9tIDw9IGxpc3RSZWN0LmJvdHRvbS1kb3duUGFkZGluZyBhbmRcblx0XHRjaG9pY2VSZWN0LnRvcCA+PSBsaXN0UmVjdC50b3ArdXBQYWRkaW5nXG5cblxuXHRzdGFydFNjcm9sbGluZzogKGRpcmVjdGlvbiktPlxuXHRcdEBzY3JvbGxJbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwgKCk9PlxuXHRcdFx0QGVsLnJhdy5zY3JvbGxUb3AgKz0gaWYgZGlyZWN0aW9uIGlzICd1cCcgdGhlbiAtMjAgZWxzZSAyMFxuXHRcdCwgNTBcblxuXG5cdHN0b3BTY3JvbGxpbmc6ICgpLT5cblx0XHRjbGVhckludGVydmFsKEBzY3JvbGxJbnRlcnZhbElEKVxuXG5cblxuXG5cbmNsYXNzIENob2ljZVxuXHRjb25zdHJ1Y3RvcjogKEBkcm9wZG93biwgQHNldHRpbmdzLCBAbGlzdCwgQGluZGV4KS0+XG5cdFx0e0BsYWJlbCwgQHZhbHVlLCBAY29uZGl0aW9uc30gPSBAc2V0dGluZ3Ncblx0XHRAbGFiZWwgPz0gQHZhbHVlXG5cdFx0QHZhbHVlID89IEBsYWJlbFxuXHRcdEBmaWVsZCA9IEBkcm9wZG93bi5maWVsZFxuXHRcdEBlbCA9IEBkcm9wZG93bi50ZW1wbGF0ZS5jaG9pY2Uuc3Bhd24obnVsbCwge3JlbGF0ZWRJbnN0YW5jZTpAZHJvcGRvd259KS5hcHBlbmRUbyhAbGlzdC5lbClcblx0XHRAZWwuY2hpbGRyZW5bMV0udGV4dCA9IEBsYWJlbFxuXHRcdEB2aXNpYmxlID0gdHJ1ZVxuXHRcdEBzZWxlY3RlZCA9IGZhbHNlXG5cdFx0QHVuYXZhaWxhYmxlID0gZmFsc2Vcblx0XHRcblx0XHRAX2F0dGFjaEJpbmRpbmdzKClcblxuXHRcdGlmIEBjb25kaXRpb25zPy5sZW5ndGhcblx0XHRcdEB1bmF2YWlsYWJsZSA9IHRydWVcblx0XHRcdEBhbGxGaWVsZHMgPSBAZmllbGQuYWxsRmllbGRzXG5cblx0XHRcdENvbmRpdGlvbi5pbml0IEAsIEBjb25kaXRpb25zLCAoKT0+XG5cdFx0XHRcdEB1bmF2YWlsYWJsZSA9ICFDb25kaXRpb24udmFsaWRhdGUoQGNvbmRpdGlvbnMpXG5cblxuXHRfYXR0YWNoQmluZGluZ3M6ICgpLT4gZG8gKCk9PlxuXHRcdFNpbXBseUJpbmQoJ3Zpc2libGUnKS5vZihAKS50byAodmlzaWJsZSxwcmV2KT0+XG5cdFx0XHRAZHJvcGRvd24udmlzaWJsZUNob2ljZXNDb3VudCArPSBpZiB2aXNpYmxlIHRoZW4gMSBlbHNlIC0xXG5cdFx0XHRAZWwuc3RhdGUgJ3Zpc2libGUnLCB2aXNpYmxlXG5cdFx0XHRpZiB2aXNpYmxlXG5cdFx0XHRcdEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlcy5wdXNoKEApXG5cdFx0XHRcdGlmIElTLmRlZmluZWQocHJldikgIyBpbmRpY2F0ZXMgc3RhdGUgaGFzIGNoYW5nZWRcblx0XHRcdFx0XHRAZHJvcGRvd24udmlzaWJsZUNob2ljZXMuc29ydCAoYSxiKS0+IGEuaW5kZXggLSBiLmluZGV4XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAZHJvcGRvd24udmlzaWJsZUNob2ljZXMsIEApXG5cblx0XHRTaW1wbHlCaW5kKCdzZWxlY3RlZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQClcblx0XHRcdC50byAoc2VsZWN0ZWQpPT4gQGVsLnN0YXRlICdzZWxlY3RlZCcsIHNlbGVjdGVkXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgndW5hdmFpbGFibGUnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEApXG5cdFx0XHQudG8gKHVuYXZhaWxhYmxlKT0+IEBlbC5zdGF0ZSAndW5hdmFpbGFibGUnLCB1bmF2YWlsYWJsZVx0XHRcdFxuXHRcdFx0LmFuZC50byAodW5hdmFpbGFibGUpPT4gQHRvZ2dsZShvZmYsIHRydWUpIGlmIHVuYXZhaWxhYmxlXG5cblx0XHRTaW1wbHlCaW5kKCdldmVudDpjbGljaycpLm9mKEBlbClcblx0XHRcdC50byAoKT0+IEBkcm9wZG93bi5sYXN0U2VsZWN0ZWQgPSBAXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6bW91c2Vkb3duJykub2YoQGVsKVxuXHRcdFx0LnRvIChldmVudCk9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50Om1vdXNlZW50ZXInKS5vZihAZWwpXG5cdFx0XHQudG8gKCk9PiBAZHJvcGRvd24uY3VycmVudEhpZ2hsaWdodGVkID0gQFxuXG5cblx0dG9nZ2xlOiAobmV3VmFsdWUsIHVuYXZhaWxhYmxlKS0+XG5cdFx0cHJldlN0YXRlID0gQHNlbGVjdGVkXG5cdFx0bmV3U3RhdGUgPSBpZiBJUy5kZWZpbmVkKG5ld1ZhbHVlKSB0aGVuIG5ld1ZhbHVlIGVsc2UgIUBzZWxlY3RlZFxuXG5cdFx0aWYgbm90IG5ld1N0YXRlXG5cdFx0XHRpZiBAZHJvcGRvd24uc2V0dGluZ3MubXVsdGlwbGUgYW5kIHByZXZTdGF0ZVxuXHRcdFx0XHRAc2VsZWN0ZWQgPSBuZXdTdGF0ZVxuXHRcdFx0XHRoZWxwZXJzLnJlbW92ZUl0ZW0oQGZpZWxkLl92YWx1ZSwgQClcblx0XHRcdFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAc2VsZWN0ZWQgPSBuZXdTdGF0ZSBpZiBJUy5kZWZpbmVkKG5ld1ZhbHVlKVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlID0gbnVsbCBpZiB1bmF2YWlsYWJsZVxuXG5cdFx0ZWxzZVxuXHRcdFx0QHNlbGVjdGVkID0gbmV3U3RhdGVcblx0XHRcdGlmIEBmaWVsZC5zZXR0aW5ncy5tdWx0aXBsZVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlLnB1c2goQClcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGZpZWxkLl92YWx1ZT8udG9nZ2xlKG9mZilcblx0XHRcdFx0QGZpZWxkLl92YWx1ZSA9IEBcblxuXHRcdFx0QGZpZWxkLmxhc3RTZWxlY3RlZCA9IEBcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93blxubW9kdWxlLmV4cG9ydHMuQ2hvaWNlID0gQ2hvaWNlIiwiU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5tYXNrQ29yZSA9IGltcG9ydCAndGV4dC1tYXNrLWNvcmUnXG5tYXNrQWRkb25zID0gaW1wb3J0ICd0ZXh0LW1hc2stYWRkb25zJ1xuZXh0ZW5kID0gaW1wb3J0ICdzbWFydC1leHRlbmQnXG5JUyA9IGltcG9ydCAnLi4vY2hlY2tzJ1xuUkVHRVggPSBpbXBvcnQgJy4uL2NvbnN0YW50cy9yZWdleCdcbmhlbHBlcnMgPSBpbXBvcnQgJy4uL2hlbHBlcnMnXG5kZWZhdWx0UGF0dGVybkNoYXJzID0gXG5cdCcxJzogUkVHRVgubnVtZXJpY1xuXHQnIyc6IFJFR0VYLndpZGVudW1lcmljXG5cdCdhJzogUkVHRVgubGV0dGVyXG5cdCcqJzogUkVHRVguYW55XG5cblxuY2xhc3MgTWFza1xuXHRjb25zdHJ1Y3RvcjogKEBmaWVsZCwgQGNvbmZpZyktPlxuXHRcdEB2YWx1ZSA9ICcnXG5cdFx0QHByZXZWYWx1ZSA9ICcnXG5cdFx0QGN1cnNvciA9IDBcblx0XHRAcHJldkN1cnNvciA9IDBcblx0XHRAcGF0dGVybiA9IEBwYXR0ZXJuUmF3ID0gQGNvbmZpZy5wYXR0ZXJuXG5cdFx0QHBhdHRlcm5TZXR0ZXIgPSBAY29uZmlnLnNldHRlclxuXHRcdEBwbGFjZWhvbGRlckNoYXIgPSBAY29uZmlnLnBsYWNlaG9sZGVyXG5cdFx0QHBsYWNlaG9sZGVyUmVnZXggPSBuZXcgUmVnRXhwKCdcXFxcJysoQHBsYWNlaG9sZGVyQ2hhciBvciAnXycpLCdnJylcblx0XHRAZ3VpZGUgPSBAY29uZmlnLmd1aWRlXG5cdFx0QGtlZXBDaGFyUG9zaXRpb25zID0gQGNvbmZpZy5rZWVwQ2hhclBvc2l0aW9uc1xuXHRcdEBjaGFycyA9IGV4dGVuZC5jbG9uZSBkZWZhdWx0UGF0dGVybkNoYXJzLCBAY29uZmlnLmN1c3RvbVBhdHRlcm5zXG5cblx0XHRAc2V0UGF0dGVybihAcGF0dGVybilcblxuXG5cdGdldFN0YXRlOiAocGF0dGVybiwgcmF3VmFsdWUpLT4ge1xuXHRcdHJhd1ZhbHVlLCBAZ3VpZGUsIEBwbGFjZWhvbGRlckNoYXIsIEBrZWVwQ2hhclBvc2l0aW9ucyxcblx0XHRjdXJyZW50Q2FyZXRQb3NpdGlvbjogaWYgQGZpZWxkLmVsIHRoZW4gQGZpZWxkLnNlbGVjdGlvbigpLmVuZCBlbHNlIEBjdXJzb3Jcblx0XHRwcmV2aW91c0NvbmZvcm1lZFZhbHVlOiBAcHJldlZhbHVlXG5cdFx0cGxhY2Vob2xkZXI6IEBnZXRQbGFjZWhvbGRlcihwYXR0ZXJuKVxuXHR9XG5cblx0Z2V0UGxhY2Vob2xkZXI6IChwYXR0ZXJuKS0+XG5cdFx0aWYgSVMuZnVuY3Rpb24ocGF0dGVybilcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdHBsYWNlaG9sZGVyID0gJydcblx0XHRcdGZvciBjaGFyIGluIHBhdHRlcm5cblx0XHRcdFx0aWYgSVMucmVnZXgoY2hhcilcblx0XHRcdFx0XHRwbGFjZWhvbGRlciArPSBAcGxhY2Vob2xkZXJDaGFyXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRwbGFjZWhvbGRlciArPSBjaGFyXG5cblx0XHRcdHJldHVybiBwbGFjZWhvbGRlclxuXG5cblx0cmVzb2x2ZVBhdHRlcm46IChwYXR0ZXJuLCBpbnB1dCwgc3RhdGUpLT5cblx0XHRwYXR0ZXJuID0gXG5cdFx0XHRpZiB0eXBlb2YgcGF0dGVybiBpcyAnZnVuY3Rpb24nXG5cdFx0XHRcdHBhdHRlcm4oaW5wdXQsIEBnZXRTdGF0ZShwYXR0ZXJuLCBpbnB1dCkpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBhdHRlcm5cblxuXHRcdG9mZnNldCA9IDBcblx0XHR0cmFwSW5kZXhlcyA9IFtdXG5cdFx0Y29weSA9IHBhdHRlcm4uc2xpY2UoKVxuXHRcdGZvciBjaGFyLGkgaW4gY29weSB3aGVuIGNoYXIgaXMgJ1tdJ1xuXHRcdFx0dHJhcEluZGV4ZXMucHVzaChpLW9mZnNldClcblx0XHRcdHBhdHRlcm4uc3BsaWNlKGktb2Zmc2V0LDEpXG5cdFx0XHRvZmZzZXQrK1xuXG5cdFx0QHByZXZQYXR0ZXJuID0gQHJlc29sdmVkUGF0dGVyblxuXHRcdEByZXNvbHZlZFBhdHRlcm4gPSBwYXR0ZXJuXG5cdFx0cmV0dXJuIHtwYXR0ZXJuLCBjYXJldFRyYXBJbmRleGVzOnRyYXBJbmRleGVzfVxuXG5cblx0c2V0UGF0dGVybjogKHN0cmluZywgdXBkYXRlVmFsdWU9dHJ1ZSwgdXBkYXRlRmllbGQpLT5cblx0XHRAcGF0dGVyblJhdyA9IHN0cmluZ1xuXHRcdEBwYXR0ZXJuID0gQHBhcnNlUGF0dGVybihzdHJpbmcpXG5cdFx0QHRyYW5zZm9ybSA9IEBwYXJzZVRyYW5zZm9ybShzdHJpbmcpXG5cblx0XHRpZiB1cGRhdGVWYWx1ZVxuXHRcdFx0QHZhbHVlID0gQHNldFZhbHVlKEB2YWx1ZSlcblx0XHRcdEBmaWVsZC52YWx1ZSA9IEB2YWx1ZSBpZiB1cGRhdGVGaWVsZFxuXG5cblx0cGFyc2VQYXR0ZXJuOiAoc3RyaW5nKS0+IHN3aXRjaFxuXHRcdHdoZW4gc3RyaW5nIGlzICdFTUFJTCdcblx0XHRcdG1hc2tBZGRvbnMuZW1haWxNYXNrLm1hc2tcblxuXHRcdHdoZW4gc3RyaW5nIGlzICdQSE9ORSdcblx0XHRcdEBwYXR0ZXJuU2V0dGVyID0gKHZhbHVlKS0+IGhlbHBlcnMucmVwZWF0KCcjJywgTWF0aC5tYXggNyx2YWx1ZS5sZW5ndGgpXG5cdFx0XHRAZ3VpZGUgPSBmYWxzZVxuXHRcdFx0cmV0dXJuICcjJ1xuXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ05BTUUnXG5cdFx0XHRAcGF0dGVyblNldHRlciA9ICh2YWx1ZSktPlxuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoQHBsYWNlaG9sZGVyUmVnZXgsICcnKS50cmltKClcblx0XHRcdFx0aGVscGVycy5yZXBlYXQoJ2EnLCBNYXRoLm1heCAyLHZhbHVlLmxlbmd0aClcblxuXHRcdFx0cmV0dXJuICdhJ1xuXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ0ZVTExOQU1FJ1xuXHRcdFx0QHBhdHRlcm5TZXR0ZXIgPSAodmFsdWUpLT5cblx0XHRcdFx0aWYgdmFsdWVbdmFsdWUubGVuZ3RoLTFdIGlzICcgJyB0aGVuIHZhbHVlICs9ICd4J1xuXHRcdFx0XHRzcGxpdCA9IHZhbHVlLnJlcGxhY2UoQHBsYWNlaG9sZGVyUmVnZXgsJycpLnRyaW0oKS5zcGxpdCgvXFxzKy8pXG5cdFx0XHRcdHJldHVybiBpZiBzcGxpdC5sZW5ndGggaXMgNFxuXHRcdFx0XHRzcGxpdC5tYXAoKHBhcnQpLT4gaGVscGVycy5yZXBlYXQoJ2EnLCBNYXRoLm1heCAyLHBhcnQubGVuZ3RoKSkuam9pbignICcpXG5cdFx0XHRyZXR1cm4gJ2EnXG5cblx0XHR3aGVuIHN0cmluZyBpcyAnREFURSdcblx0XHRcdFsvXFxkLywgL1xcZC8sICcvJywgL1xcZC8sIC9cXGQvLCAnLycsIC9cXGQvLCAvXFxkLywgL1xcZC8sIC9cXGQvXVxuXHRcdFxuXHRcdHdoZW4gc3RyaW5nWzBdIGlzICdEQVRFJyBhbmQgSVMuc3RyaW5nKHN0cmluZ1sxXSlcblx0XHRcdHN0cmluZ1sxXS5zcGxpdCgnJykubWFwKChjaGFyKT0+IGlmIFJFR0VYLmxldHRlci50ZXN0KGNoYXIpIHRoZW4gL1xcZC8gZWxzZSBjaGFyKVxuXHRcdFxuXHRcdHdoZW4gc3RyaW5nIGlzICdOVU1CRVInXG5cdFx0XHRtYXNrQWRkb25zLmNyZWF0ZU51bWJlck1hc2tcblx0XHRcdFx0cHJlZml4OiBAY29uZmlnLnByZWZpeCBvciAnJ1xuXHRcdFx0XHRzdWZmaXg6IEBjb25maWcuc3VmZml4IG9yICcnXG5cdFx0XHRcdGluY2x1ZGVUaG91c2FuZHNTZXBhcmF0b3I6IGlmIEBjb25maWcuc2VwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cdFx0XHRcdHRob3VzYW5kc1NlcGFyYXRvclN5bWJvbDogaWYgSVMuc3RyaW5nKEBjb25maWcuc2VwKSB0aGVuIEBjb25maWcuc2VwXG5cdFx0XHRcdGFsbG93RGVjaW1hbDogQGNvbmZpZy5kZWNpbWFsXG5cdFx0XHRcdGRlY2ltYWxMaW1pdDogaWYgSVMubnVtYmVyKEBjb25maWcuZGVjaW1hbCkgdGhlbiBAY29uZmlnLmRlY2ltYWxcblx0XHRcdFx0aW50ZWdlckxpbWl0OiBpZiBJUy5udW1iZXIoQGNvbmZpZy5saW1pdCkgdGhlbiBAY29uZmlnLmxpbWl0XG5cblx0XHR3aGVuIElTLmFycmF5KHN0cmluZylcblx0XHRcdHJldHVybiBzdHJpbmdcblxuXHRcdGVsc2Vcblx0XHRcdHBhdHRlcm4gPSBbXVxuXG5cdFx0XHRmb3IgY2hhcixpIGluIHN0cmluZ1xuXHRcdFx0XHRpZiBjaGFyIGlzICdcXFxcJ1xuXHRcdFx0XHRcdGVzY2FwZWQgPSB0cnVlXG5cdFx0XHRcdFx0Y29udGludWVcblx0XHRcdFx0XG5cdFx0XHRcdHBhdHRlcm4ucHVzaCBpZiBlc2NhcGVkIHRoZW4gY2hhciBlbHNlIChAY2hhcnNbY2hhcl0gb3IgY2hhcilcblx0XHRcdFx0ZXNjYXBlZCA9IGZhbHNlXG5cblx0XHRcdHJldHVybiBwYXR0ZXJuXG5cblxuXHRwYXJzZVRyYW5zZm9ybTogKHN0cmluZyktPiBzd2l0Y2hcblx0XHR3aGVuIHN0cmluZyBpcyAnRU1BSUwnXG5cdFx0XHRtYXNrQWRkb25zLmVtYWlsTWFzay5waXBlXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmcgaXMgJ0RBVEUnXG5cdFx0XHRtYXNrQWRkb25zLmNyZWF0ZUF1dG9Db3JyZWN0ZWREYXRlUGlwZSgnbW0vZGQveXl5eScpXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmdbMF0gaXMgJ0RBVEUnIGFuZCBJUy5zdHJpbmcoc3RyaW5nWzFdKVxuXHRcdFx0bWFza0FkZG9ucy5jcmVhdGVBdXRvQ29ycmVjdGVkRGF0ZVBpcGUoc3RyaW5nWzFdKVxuXG5cdFx0d2hlbiBAY29uZmlnLnRyYW5zZm9ybVxuXHRcdFx0QGNvbmZpZy50cmFuc2Zvcm1cblxuXG5cblx0c2V0VmFsdWU6IChpbnB1dCktPlxuXHRcdGlmIEBwYXR0ZXJuU2V0dGVyXG5cdFx0XHRuZXdQYXR0ZXJuID0gQHBhdHRlcm5TZXR0ZXIoaW5wdXQpIG9yIEBwYXR0ZXJuXG5cdFx0XHRAc2V0UGF0dGVybihuZXdQYXR0ZXJuLCBmYWxzZSkgaWYgbmV3UGF0dGVybiBpc250IEBwYXR0ZXJuUmF3IGFuZCBuZXdQYXR0ZXJuIGlzbnQgQHBhdHRlcm5cblx0XHRcblx0XHR7Y2FyZXRUcmFwSW5kZXhlcywgcGF0dGVybn0gPSBAcmVzb2x2ZVBhdHRlcm4oQHBhdHRlcm4sIGlucHV0KVxuXHRcdHJldHVybiBAdmFsdWUgaWYgcGF0dGVybiBpcyBmYWxzZVxuXG5cdFx0QHByZXZWYWx1ZSA9IEB2YWx1ZVxuXHRcdEBwcmV2Q3Vyc29yID0gQGN1cnNvclxuXHRcdHN0YXRlID0gQGdldFN0YXRlKHBhdHRlcm4sIGlucHV0KVxuXHRcdHtjb25mb3JtZWRWYWx1ZX0gPSBtYXNrQ29yZS5jb25mb3JtVG9NYXNrKGlucHV0LCBwYXR0ZXJuLCBzdGF0ZSlcblxuXHRcdHRyYW5zZm9ybWVkID0gQHRyYW5zZm9ybShjb25mb3JtZWRWYWx1ZSwgc3RhdGUpIGlmIEB0cmFuc2Zvcm1cblx0XHRpZiB0cmFuc2Zvcm1lZCBpcyBmYWxzZVxuXHRcdFx0cmV0dXJuIEB2YWx1ZVxuXHRcdGlmIElTLnN0cmluZyh0cmFuc2Zvcm1lZClcblx0XHRcdGNvbmZvcm1lZFZhbHVlID0gdHJhbnNmb3JtZWRcblx0XHRlbHNlIGlmIElTLm9iamVjdCh0cmFuc2Zvcm1lZClcblx0XHRcdGluZGV4ZXNPZlBpcGVkQ2hhcnMgPSB0cmFuc2Zvcm1lZC5pbmRleGVzT2ZQaXBlZENoYXJzXG5cdFx0XHRjb25mb3JtZWRWYWx1ZSA9IHRyYW5zZm9ybWVkLnZhbHVlXG5cblxuXHRcdEBjdXJzb3IgPSBtYXNrQ29yZS5hZGp1c3RDYXJldFBvc2l0aW9uIGV4dGVuZCBzdGF0ZSwge1xuXHRcdFx0aW5kZXhlc09mUGlwZWRDaGFycywgY2FyZXRUcmFwSW5kZXhlcywgY29uZm9ybWVkVmFsdWVcblx0XHR9XG5cblx0XHRyZXR1cm4gQHZhbHVlID0gY29uZm9ybWVkVmFsdWVcblxuXG5cdHZhbGlkYXRlOiAoaW5wdXQpLT5cblx0XHRpZiBpbnB1dCBpc250IEB2YWx1ZSBhbmQgQHBhdHRlcm5TZXR0ZXJcblx0XHRcdHBhdHRlcm4gPSBAcGF0dGVyblNldHRlcihpbnB1dCkgb3IgQHBhdHRlcm5cblx0XHRlbHNlXG5cdFx0XHRwYXR0ZXJuID0gQHJlc29sdmVkUGF0dGVyblxuXHRcdFx0e3BhdHRlcm59ID0gQHJlc29sdmVQYXR0ZXJuKEBwYXR0ZXJuLCBpbnB1dCkgaWYgbm90IHBhdHRlcm5cblxuXHRcdHJldHVybiB0cnVlIGlmIHBhdHRlcm4gaXMgZmFsc2Vcblx0XHRcblx0XHRmb3IgY2hhcixpIGluIHBhdHRlcm5cblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIG5vdCBpbnB1dFtpXVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdFx0XHR3aGVuIElTLnJlZ2V4KGNoYXIpIGFuZCBub3QgY2hhci50ZXN0KGlucHV0W2ldKVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdFx0XHR3aGVuIElTLnN0cmluZyhjaGFyKSBhbmQgaW5wdXRbaV0gaXNudCBjaGFyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRyZXR1cm4gdHJ1ZVxuXG5cdGlzRW1wdHk6ICgpLT5cblx0XHRpbnB1dCA9IEB2YWx1ZVxuXHRcdHBhdHRlcm4gPSBAcmVzb2x2ZWRQYXR0ZXJuXG5cdFx0aWYgbm90IHBhdHRlcm5cblx0XHRcdHBhdHRlcm4gPSBAcGF0dGVyblNldHRlcihpbnB1dCkgaWYgQHBhdHRlcm5TZXR0ZXJcblx0XHRcdHtwYXR0ZXJufSA9IEByZXNvbHZlUGF0dGVybihwYXR0ZXJuIG9yIEBwYXR0ZXJuLCBpbnB1dClcblx0XHRcblx0XHRyZXR1cm4gdHJ1ZSBpZiBpbnB1dCBpcyBAY29uZmlnLnByZWZpeCBvciBpbnB1dCBpcyBAY29uZmlnLnN1ZmZpeFxuXG5cdFx0Zm9yIGNoYXIsaSBpbiBwYXR0ZXJuXG5cdFx0XHRzd2l0Y2hcblx0XHRcdFx0d2hlbiBub3QgaW5wdXRbaV1cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0XHR3aGVuIElTLnJlZ2V4KGNoYXIpXG5cdFx0XHRcdFx0cmV0dXJuICFjaGFyLnRlc3QoaW5wdXRbaV0pXG5cdFx0cmV0dXJuIGZhbHNlXG5cblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFzayIsInZhciBrZXlDb2RlcztcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlDb2RlcyA9IHtcbiAgXCJkZWxldGVcIjogOCxcbiAgZW50ZXI6IDEzLFxuICBlc2M6IDI3LFxuICBjdHJsOiAxNyxcbiAgYWx0OiAxOCxcbiAgc2hpZnQ6IDE2LFxuICBcInN1cGVyXCI6IDkxLFxuICBzdXBlcjI6IDkzLFxuICB1cDogMzgsXG4gIGxlZnQ6IDM3LFxuICByaWdodDogMzksXG4gIGRvd246IDQwLFxuICBoeXBoZW46IDQ1LFxuICB1bmRlcnNjb3JlOiA5NSxcbiAgcXVlc3Rpb246IDYzLFxuICBleGNsYW1hdGlvbjogMzMsXG4gIGZyb250c2xhc2g6IDQ3LFxuICBiYWNrc2xhc2g6IDkyLFxuICBjb21tYTogNDQsXG4gIHBlcmlvZDogNDYsXG4gIHNwYWNlOiAzMixcbiAgYW55QXJyb3c6IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4gY29kZSA9PT0ga2V5Q29kZXMudXAgfHwgY29kZSA9PT0ga2V5Q29kZXMuZG93biB8fCBjb2RlID09PSBrZXlDb2Rlcy5sZWZ0IHx8IGNvZGUgPT09IGtleUNvZGVzLnJpZ2h0O1xuICB9LFxuICBhbnlNb2RpZmllcjogZnVuY3Rpb24oY29kZSkge1xuICAgIHJldHVybiBjb2RlID09PSBrZXlDb2Rlcy5jdHJsIHx8IGNvZGUgPT09IGtleUNvZGVzLmFsdCB8fCBjb2RlID09PSBrZXlDb2Rlcy5zaGlmdCB8fCBjb2RlID09PSBrZXlDb2Rlc1tcInN1cGVyXCJdIHx8IGNvZGUgPT09IGtleUNvZGVzLnN1cGVyMjtcbiAgfSxcbiAgYW55QWxwaGE6IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4gKDk3IDw9IGNvZGUgJiYgY29kZSA8PSAxMjIpIHx8ICg2NSA8PSBjb2RlICYmIGNvZGUgPD0gOTApO1xuICB9LFxuICBhbnlOdW1lcmljOiBmdW5jdGlvbihjb2RlKSB7XG4gICAgcmV0dXJuICg0OCA8PSBjb2RlICYmIGNvZGUgPD0gNTcpO1xuICB9LFxuICBhbnlBbHBoYU51bWVyaWM6IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4ga2V5Q29kZXMuYW55QWxwaGEoY29kZSkgfHwga2V5Q29kZXMuYW55TnVtZXJpYyhjb2RlKTtcbiAgfSxcbiAgYW55UHJpbnRhYmxlOiBmdW5jdGlvbihjb2RlKSB7XG4gICAgcmV0dXJuIGtleUNvZGVzLmFueUFscGhhKGNvZGUpIHx8IGtleUNvZGVzLmFueU51bWVyaWMoY29kZSkgfHwgY29kZSA9PT0ga2V5Q29kZXMuaHlwaGVuIHx8IGNvZGUgPT09IGtleUNvZGVzLnVuZGVyc2NvcmUgfHwgY29kZSA9PT0ga2V5Q29kZXMucXVlc3Rpb24gfHwgY29kZSA9PT0ga2V5Q29kZXMuZXhjbGFtYXRpb24gfHwgY29kZSA9PT0ga2V5Q29kZXMuZnJvbnRzbGFzaCB8fCBjb2RlID09PSBrZXlDb2Rlcy5iYWNrc2xhc2ggfHwgY29kZSA9PT0ga2V5Q29kZXMuY29tbWEgfHwgY29kZSA9PT0ga2V5Q29kZXMucGVyaW9kIHx8IGNvZGUgPT09IGtleUNvZGVzLnNwYWNlO1xuICB9XG59O1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKamIyNXpkR0Z1ZEhNdmEyVjVRMjlrWlhNdVkyOW1abVZsSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuaGVscGVycyA9IGltcG9ydCAnLi4vLi4vaGVscGVycydcbkNPTE9SUyA9IGltcG9ydCAnLi4vLi4vY29uc3RhbnRzL2NvbG9ycydcbkNIRUNLTUFSS19XSURUSCA9IDI2XG5cbmV4cG9ydCBkZWZhdWx0IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnZmllbGQnXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0dmVydGljYWxBbGlnbjogJ3RvcCdcblx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCdcblx0XHRcdGZvbnRGYW1pbHk6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5mb250RmFtaWx5XG5cdFx0XHR0ZXh0QWxpZ246ICdsZWZ0J1xuXHRcdFx0JHZpc2libGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRhbmltYXRpb246ICcwLjJzIGZpZWxkRXJyb3JTaGFrZSdcblxuXHRcdFsnZGl2J1xuXHRcdFx0cmVmOiAnbGFiZWwnXG5cdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0ekluZGV4OiAxXG5cdFx0XHRcdHRvcDogKGZpZWxkKS0+IEBzdHlsZVBhcnNlZCgnZm9udFNpemUnLCB0cnVlKSAqIDAuN1xuXHRcdFx0XHRsZWZ0OiAoZmllbGQpLT4gaGVscGVycy5zaG9ydGhhbmRTaWRlVmFsdWUoZmllbGQuc2V0dGluZ3MucGFkZGluZywgJ2xlZnQnKSArIChmaWVsZC5lbC5jaGlsZC5pY29uPy53aWR0aCBvciAwKVxuXHRcdFx0XHRwYWRkaW5nOiAoZmllbGQpLT4gXCIwICN7ZmllbGQuc2V0dGluZ3MuaW5wdXRQYWRkaW5nfXB4XCJcblx0XHRcdFx0Zm9udEZhbWlseTogJ2luaGVyaXQnXG5cdFx0XHRcdGZvbnRTaXplOiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MubGFiZWxTaXplIG9yIGZpZWxkLnNldHRpbmdzLmZvbnRTaXplICogKDExLzE0KVxuXHRcdFx0XHRmb250V2VpZ2h0OiA2MDBcblx0XHRcdFx0bGluZUhlaWdodDogMVxuXHRcdFx0XHRjb2xvcjogQ09MT1JTLmdyZXlcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnb3BhY2l0eSAwLjJzLCBjb2xvciAwLjJzJ1xuXHRcdFx0XHR3aGl0ZVNwYWNlOiAnbm93cmFwJ1xuXHRcdFx0XHR1c2VyU2VsZWN0OiAnbm9uZSdcblx0XHRcdFx0Y3Vyc29yOiAnZGVmYXVsdCdcblx0XHRcdFx0cG9pbnRlckV2ZW50czogJ25vbmUnXG5cdFx0XHRcdCRmaWxsZWQ6ICRzaG93TGFiZWw6XG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHQkZm9jdXM6XG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5vcmFuZ2Vcblx0XHRcdFx0JHNob3dFcnJvcjpcblx0XHRcdFx0XHRjb2xvcjogQ09MT1JTLnJlZFxuXHRcdF1cblxuXHRcdFsnZGl2J1xuXHRcdFx0cmVmOiAnaW5uZXJ3cmFwJ1xuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHRcdGhlaWdodDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmhlaWdodFxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZSdcblx0XHRcdFx0Ym9yZGVyV2lkdGg6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5ib3JkZXJcblx0XHRcdFx0Ym9yZGVyU3R5bGU6ICdzb2xpZCdcblx0XHRcdFx0Ym9yZGVyQ29sb3I6IENPTE9SUy5ncmV5X2xpZ2h0XG5cdFx0XHRcdGJvcmRlclJhZGl1czogJzJweCdcblx0XHRcdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCdcblx0XHRcdFx0Zm9udEZhbWlseTogJ2luaGVyaXQnXG5cdFx0XHRcdHRyYW5zaXRpb246ICdib3JkZXItY29sb3IgMC4ycydcblx0XHRcdFx0JGZvY3VzOlxuXHRcdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMub3JhbmdlXG5cdFx0XHRcdCRzaG93RXJyb3I6XG5cdFx0XHRcdFx0Ym9yZGVyQ29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0JGRpc2FibGVkOlxuXHRcdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMuZ3JleV9saWdodFxuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQ09MT1JTLmdyZXlfbGlnaHRcblxuXHRcdFx0WydpbnB1dCdcblx0XHRcdFx0cmVmOiAnaW5wdXQnXG5cdFx0XHRcdHR5cGU6ICd0ZXh0J1xuXHRcdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHRcdFx0ekluZGV4OiAzXG5cdFx0XHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblx0XHRcdFx0XHR2ZXJ0aWNhbEFsaWduOiAndG9wJ1xuXHRcdFx0XHRcdGhlaWdodDogKCktPiBAcGFyZW50LnN0eWxlU2FmZSgnaGVpZ2h0JywxKSBvciBAcGFyZW50LnN0eWxlU2FmZSgnaGVpZ2h0Jylcblx0XHRcdFx0XHR3aWR0aDogKGZpZWxkKS0+IGlmIG5vdCBmaWVsZC5zZXR0aW5ncy5hdXRvV2lkdGhcblx0XHRcdFx0XHRcdHN1YnRyYWN0ID0gMFxuXHRcdFx0XHRcdFx0aWYgaWNvblNpYmxpbmcgPSBmaWVsZC5lbC5jaGlsZC5pY29uXG5cdFx0XHRcdFx0XHRcdHN1YnRyYWN0ICs9IGljb25TaWJsaW5nLndpZHRoXG5cdFx0XHRcdFx0XHRpZiBpbnB1dFNpYmxpbmcgPSBmaWVsZC5lbC5jaGlsZFtmaWVsZC5zZXR0aW5ncy5pbnB1dFNpYmxpbmddXG5cdFx0XHRcdFx0XHRcdHdpZHRoID0gaW5wdXRTaWJsaW5nLnN0eWxlUGFyc2VkKCd3aWR0aCcsMSkgb3IgMFxuXHRcdFx0XHRcdFx0XHRwYWRkaW5nID0gaW5wdXRTaWJsaW5nLnN0eWxlUGFyc2VkKCdwYWRkaW5nJywxKSBvciAwXG5cdFx0XHRcdFx0XHRcdHBhZGRpbmdMZWZ0ID0gaW5wdXRTaWJsaW5nLnN0eWxlUGFyc2VkKCdwYWRkaW5nTGVmdCcsMSkgb3IgcGFkZGluZyBvciAwXG5cdFx0XHRcdFx0XHRcdHBhZGRpbmdSaWdodCA9IGlucHV0U2libGluZy5zdHlsZVBhcnNlZCgncGFkZGluZ1JpZ2h0JywxKSBvciBwYWRkaW5nIG9yIDBcblx0XHRcdFx0XHRcdFx0c3VidHJhY3QgKz0gd2lkdGgrcGFkZGluZ0xlZnQrcGFkZGluZ1JpZ2h0XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJjYWxjKDEwMCUgLSAje3N1YnRyYWN0fXB4KVwiXG5cblx0XHRcdFx0XHRwYWRkaW5nOiAoZmllbGQpLT5cblx0XHRcdFx0XHRcdEBwYWRkaW5nID89IE1hdGgubWF4IDAsIGhlbHBlcnMuY2FsY1BhZGRpbmcoZmllbGQuc2V0dGluZ3MuaGVpZ2h0LCAxNCktM1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiI3tAcGFkZGluZ31weCAje2ZpZWxkLnNldHRpbmdzLmlucHV0UGFkZGluZ31weFwiXG5cdFx0XHRcdFxuXHRcdFx0XHRcdG1hcmdpbjogJzAnXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXG5cdFx0XHRcdFx0YXBwZWFyYW5jZTogJ25vbmUnXG5cdFx0XHRcdFx0Ym9yZGVyOiAnbm9uZSdcblx0XHRcdFx0XHRvdXRsaW5lOiAnbm9uZSdcblx0XHRcdFx0XHRmb250RmFtaWx5OiAnaW5oZXJpdCdcblx0XHRcdFx0XHRmb250U2l6ZTogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmZvbnRTaXplXG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5ibGFja1xuXHRcdFx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRcdFx0Ym94U2hhZG93OiAnbm9uZSdcblx0XHRcdFx0XHR3aGl0ZVNwYWNlOiAnbm93cmFwJ1xuXHRcdFx0XHRcdGJhY2tncm91bmRDbGlwOiAnY29udGVudC1ib3gnICMgc2VtaS1maXggZm9yIHllbGxvdyBhdXRvZmlsbCBiYWNrZ3JvdW5kXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSdcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDAuMnMsIC13ZWJraXQtdHJhbnNmb3JtIDAuMnMnXG5cdFx0XHRcdFx0JGRpc2FibGVkOlxuXHRcdFx0XHRcdFx0Y3Vyc29yOiAnbm90LWFsbG93ZWQnXG5cdFx0XHRcdFx0JGZpbGxlZDogJHNob3dMYWJlbDpcblx0XHRcdFx0XHRcdHRyYW5zZm9ybTogKGZpZWxkKS0+XG5cdFx0XHRcdFx0XHRcdHJldHVybiBAdHJhbnNsYXRpb24gaWYgQHRyYW5zbGF0aW9uPyBvciBub3QgKGxhYmVsPWZpZWxkLmVsLmNoaWxkLmxhYmVsKSBvciBsYWJlbC5zdHlsZVNhZmUoJ3Bvc2l0aW9uJywxKSBpc250ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHRcdFx0dG90YWxIZWlnaHQgPSBAcGFyZW50LnN0eWxlUGFyc2VkKCdoZWlnaHQnLDEpXG5cdFx0XHRcdFx0XHRcdHdvcmthYmxlSGVpZ2h0ID0gdG90YWxIZWlnaHQgLSAobGFiZWwuc3R5bGVQYXJzZWQoJ2ZvbnRTaXplJywxKSArIGxhYmVsLnN0eWxlUGFyc2VkKCd0b3AnLDEpKjIpXG5cdFx0XHRcdFx0XHRcdHRyYW5zbGF0aW9uID0gTWF0aC5tYXggMCwgTWF0aC5mbG9vciAodG90YWxIZWlnaHQtd29ya2FibGVIZWlnaHQpLzRcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwidHJhbnNsYXRlWSgje3RyYW5zbGF0aW9ufXB4KVwiXG5cdFx0XHRcdFx0XG5cdFx0XHRdXG5cblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdwbGFjZWhvbGRlcidcblx0XHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdHRvcDogJzBweCdcblx0XHRcdFx0XHRsZWZ0OiAoZmllbGQpLT4gZmllbGQuZWwuY2hpbGQuaWNvbj8ud2lkdGggb3IgMFxuXHRcdFx0XHRcdGZvbnRGYW1pbHk6IChmaWVsZCktPiBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVNhZmUoJ2ZvbnRGYW1pbHknLDEpXG5cdFx0XHRcdFx0Zm9udFNpemU6IChmaWVsZCktPiBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVNhZmUoJ2ZvbnRTaXplJywxKVxuXHRcdFx0XHRcdHBhZGRpbmc6IChmaWVsZCktPlxuXHRcdFx0XHRcdFx0dmVydGkgPSBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVBhcnNlZCgncGFkZGluZ1RvcCcsMSkgb3IgZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdUb3AnKVxuXHRcdFx0XHRcdFx0aG9yaXogPSBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVBhcnNlZCgncGFkZGluZ0xlZnQnLDEpIG9yIGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlUGFyc2VkKCdwYWRkaW5nTGVmdCcpXG5cdFx0XHRcdFx0XHRyZXR1cm4gXCIje3ZlcnRpKzN9cHggI3tob3Jpen1weFwiXG5cblx0XHRcdFx0XHRjb2xvcjogQ09MT1JTLmJsYWNrXG5cdFx0XHRcdFx0b3BhY2l0eTogMC41XG5cdFx0XHRcdFx0cG9pbnRlckV2ZW50czogJ25vbmUnXG5cdFx0XHRcdFx0dXNlclNlbGVjdDogJ25vbmUnXG5cdFx0XHRcdFx0d2hpdGVTcGFjZTogJ25vd3JhcCdcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ1xuXHRcdFx0XHRcdHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMC4ycywgLXdlYmtpdC10cmFuc2Zvcm0gMC4ycydcblx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0dmlzaWJpbGl0eTogJ2hpZGRlbidcblx0XHRcdFx0XHRcdCRzaG93TGFiZWw6XG5cdFx0XHRcdFx0XHRcdHRyYW5zZm9ybTogKGZpZWxkKS0+IGZpZWxkLmVsLmNoaWxkLmlucHV0LnJhdy5zdHlsZS50cmFuc2Zvcm1cblx0XHRcdF1cblx0XHRdXG5cdFx0XG5cdFx0WydkaXYnXG5cdFx0XHRyZWY6ICdoZWxwJ1xuXHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdHRvcDogJzExMCUnXG5cdFx0XHRcdGxlZnQ6IChmaWVsZCktPiBoZWxwZXJzLnNob3J0aGFuZFNpZGVWYWx1ZShmaWVsZC5zZXR0aW5ncy5wYWRkaW5nLCAnbGVmdCcpXG5cdFx0XHRcdGZvbnRGYW1pbHk6ICdpbmhlcml0J1xuXHRcdFx0XHRmb250U2l6ZTogJzExcHgnXG5cdFx0XHRcdGNvbG9yOiBDT0xPUlMuZ3JleVxuXHRcdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdFx0JHNob3dFcnJvcjpcblx0XHRcdFx0XHRjb2xvcjogQ09MT1JTLnJlZFxuXHRcdFx0XHQkc2hvd0hlbHA6XG5cdFx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdF1cblx0XVxuKVxuXG5leHBvcnQgaWNvbiA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnaWNvbidcblx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0ekluZGV4OiAyXG5cdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuXHRcdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCdcblx0XHRcdHdpZHRoOiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuaWNvblNpemVcblx0XHRcdGhlaWdodDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmljb25TaXplXG5cdFx0XHRmb250U2l6ZTogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmljb25TaXplXG5cdFx0XHRwYWRkaW5nTGVmdDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmlucHV0UGFkZGluZ1xuXHRcdFx0cGFkZGluZ1RvcDogKGZpZWxkKS0+IEBwYXJlbnQuc3R5bGVQYXJzZWQoJ2hlaWdodCcsMSkvMiAtIGZpZWxkLnNldHRpbmdzLmljb25TaXplLzJcblx0XHRcdGxpbmVIZWlnaHQ6ICcxZW0nXG5cdFx0XHR1c2VyU2VsZWN0OiAnbm9uZSdcblxuXHRcdG1ldGhvZHM6XG5cdFx0XHR3aWR0aDogZ2V0OiAoKS0+XG5cdFx0XHRcdGlmIEBfaW5zZXJ0ZWRcblx0XHRcdFx0XHRAcmF3Lm9mZnNldFdpZHRoXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRAc3R5bGVQYXJzZWQoJ3dpZHRoJywxKSBvciBAcmVsYXRlZC5zZXR0aW5ncy5pY29uU2l6ZVxuXHRcdFx0XHQjIEBzdHlsZVBhcnNlZCgnd2lkdGgnLDEpIG9yIEByYXcub2Zmc2V0V2lkdGggb3IgQHJlbGF0ZWQuc2V0dGluZ3MuaWNvblNpemUgb3IgMFxuXHRdXG4pXG5cblxuZXhwb3J0IGNoZWNrbWFyayA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnY2hlY2ttYXJrJ1xuXHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHR6SW5kZXg6IDRcblx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0d2lkdGg6IDI2XG5cdFx0XHRoZWlnaHQ6ICcxMDAlJ1xuXHRcdFx0cGFkZGluZ1RvcDogKCktPiBAcGFyZW50LnN0eWxlUGFyc2VkKCdoZWlnaHQnLDEpLzIgLSAxM1xuXHRcdFx0cGFkZGluZ1JpZ2h0OiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuaW5wdXRQYWRkaW5nXG5cdFx0XHR2ZXJ0aWNhbEFsaWduOiAndG9wJ1xuXHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblxuXHRcdFsnZGl2J1xuXHRcdFx0cmVmOiAnY2hlY2ttYXJrX2lubmVyd3JhcCdcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHR3aWR0aDogJzIwcHgnXG5cdFx0XHRcdGhlaWdodDogJzIwcHgnXG5cdFx0XHRcdGJvcmRlclJhZGl1czogJzUwJSdcblx0XHRcdFx0Ym9yZGVyV2lkdGg6ICczcHgnXG5cdFx0XHRcdGJvcmRlclN0eWxlOiAnc29saWQnXG5cdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMuZ3JlZW5cblx0XHRcdFx0dHJhbnNmb3JtOiAnc2NhbGUoMC44KSdcblx0XHRcdFx0IyB0cmFuc2Zvcm1PcmlnaW46ICcxMDAlIDAnXG5cdFx0XHRcdCRzaG93RXJyb3I6XG5cdFx0XHRcdFx0Ym9yZGVyQ29sb3I6IENPTE9SUy5yZWRcblxuXHRcdFx0WydkaXYnXG5cdFx0XHRcdHJlZjogJ2NoZWNrbWFya19tYXNrMSdcblx0XHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHRcdHRvcDogJy00cHgnXG5cdFx0XHRcdFx0bGVmdDogJy0xMHB4J1xuXHRcdFx0XHRcdHdpZHRoOiAnMTVweCdcblx0XHRcdFx0XHRoZWlnaHQ6ICczMHB4J1xuXHRcdFx0XHRcdGJvcmRlclJhZGl1czogJzMwcHggMCAwIDMwcHgnXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAoZmllbGQpLT4gaGVscGVycy5kZWZhdWx0Q29sb3IgZmllbGQuZWxzLmlubmVyd3JhcC5zdHlsZVNhZmUoJ2JhY2tncm91bmRDb2xvcicsMSksICd3aGl0ZSdcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSdcblx0XHRcdFx0XHR0cmFuc2Zvcm1PcmlnaW46ICcxNXB4IDE1cHggMCdcblx0XHRcdF1cblx0XHRcdFxuXHRcdFx0WydkaXYnXG5cdFx0XHRcdHJlZjogJ2NoZWNrbWFya19tYXNrMidcblx0XHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHRcdHRvcDogJy01cHgnXG5cdFx0XHRcdFx0bGVmdDogJzhweCdcblx0XHRcdFx0XHR3aWR0aDogJzE1cHgnXG5cdFx0XHRcdFx0aGVpZ2h0OiAnMzBweCdcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICcwIDMwcHggMzBweCAwJ1xuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogKGZpZWxkKS0+IGhlbHBlcnMuZGVmYXVsdENvbG9yIGZpZWxkLmVscy5pbm5lcndyYXAuc3R5bGVTYWZlKCdiYWNrZ3JvdW5kQ29sb3InLDEpLCAnd2hpdGUnXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG5cdFx0XHRcdFx0dHJhbnNmb3JtT3JpZ2luOiAnMCAxNXB4IDAnXG5cdFx0XHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJzQuMjVzIGVhc2UtaW4gY2hlY2ttYXJrUm90YXRlUGxhY2Vob2xkZXInXG5cdFx0XHRcdFx0XHQkaW52YWxpZDpcblx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnJ1xuXHRcdFx0XVxuXHRcdFx0XG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX2xpbmVXcmFwcGVyJ1xuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHQkZmlsbGVkOiAkaW52YWxpZDpcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHRcdFx0XHR6SW5kZXg6IDJcblx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJzAuNTVzIGNoZWNrbWFya0FuaW1hdGVFcnJvcidcblx0XHRcdFx0XHRcdHRyYW5zZm9ybU9yaWdpbjogJzUwJSAxMHB4J1xuXG5cdFx0XHRcdFsnZGl2J1xuXHRcdFx0XHRcdHJlZjogJ2NoZWNrbWFya19saW5lU2hvcnQnXG5cdFx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHRcdFx0ekluZGV4OiAyXG5cdFx0XHRcdFx0XHR0b3A6ICcxMHB4J1xuXHRcdFx0XHRcdFx0bGVmdDogJzNweCdcblx0XHRcdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRcdFx0XHRcdHdpZHRoOiAnOHB4J1xuXHRcdFx0XHRcdFx0aGVpZ2h0OiAnM3B4J1xuXHRcdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnMnB4J1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBDT0xPUlMuZ3JlZW5cblx0XHRcdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZSg0NWRlZyknXG5cdFx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0XHRhbmltYXRpb246ICcwLjc1cyBjaGVja21hcmtBbmltYXRlU3VjY2Vzc1RpcCdcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0JGludmFsaWQ6XG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQ09MT1JTLnJlZFxuXHRcdFx0XHRcdFx0XHRsZWZ0OiAnNHB4J1xuXHRcdFx0XHRcdFx0XHR0b3A6ICc4cHgnXG5cdFx0XHRcdFx0XHRcdHdpZHRoOiAnMTJweCdcblx0XHRcdFx0XHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0XHRcdFx0XHRhbmltYXRpb246ICcnXG5cdFx0XHRcdF1cblxuXHRcdFx0XHRbJ2Rpdidcblx0XHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbGluZUxvbmcnXG5cdFx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHRcdFx0ekluZGV4OiAyXG5cdFx0XHRcdFx0XHR0b3A6ICc4cHgnXG5cdFx0XHRcdFx0XHRyaWdodDogJzJweCdcblx0XHRcdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRcdFx0XHRcdHdpZHRoOiAnMTJweCdcblx0XHRcdFx0XHRcdGhlaWdodDogJzNweCdcblx0XHRcdFx0XHRcdGJvcmRlclJhZGl1czogJzJweCdcblx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQ09MT1JTLmdyZWVuXG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSdcblx0XHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJzAuNzVzIGNoZWNrbWFya0FuaW1hdGVTdWNjZXNzTG9uZydcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0JGludmFsaWQ6XG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQ09MT1JTLnJlZFxuXHRcdFx0XHRcdFx0XHR0b3A6ICc4cHgnXG5cdFx0XHRcdFx0XHRcdGxlZnQ6ICc0cHgnXG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAnYXV0bydcblx0XHRcdFx0XHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0XHRcdFx0XHRhbmltYXRpb246ICcnXG5cdFx0XHRcdF1cblx0XHRcdF1cblx0XHRcdFxuXHRcdFx0WydkaXYnXG5cdFx0XHRcdHJlZjogJ2NoZWNrbWFya19wbGFjZWhvbGRlcidcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR6SW5kZXg6IDJcblx0XHRcdFx0XHR0b3A6ICctNHB4J1xuXHRcdFx0XHRcdGxlZnQ6ICctM3B4J1xuXHRcdFx0XHRcdHdpZHRoOiAnMjBweCdcblx0XHRcdFx0XHRoZWlnaHQ6ICcyMHB4J1xuXHRcdFx0XHRcdGJvcmRlclJhZGl1czogJzUwJSdcblx0XHRcdFx0XHRib3JkZXJXaWR0aDogJzNweCdcblx0XHRcdFx0XHRib3JkZXJTdHlsZTogJ3NvbGlkJ1xuXHRcdFx0XHRcdGJvcmRlckNvbG9yOiBoZWxwZXJzLmhleFRvUkdCQShDT0xPUlMuZ3JlZW4sIDAuNClcblx0XHRcdFx0XHQkaW52YWxpZDpcblx0XHRcdFx0XHRcdGJvcmRlckNvbG9yOiBoZWxwZXJzLmhleFRvUkdCQShDT0xPUlMucmVkLCAwLjQpXG5cdFx0XHRdXG5cdFx0XHRcblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfcGF0Y2gnXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR6SW5kZXg6IDFcblx0XHRcdFx0XHR0b3A6ICctMnB4J1xuXHRcdFx0XHRcdGxlZnQ6ICc2cHgnXG5cdFx0XHRcdFx0d2lkdGg6ICc0cHgnXG5cdFx0XHRcdFx0aGVpZ2h0OiAnMjhweCdcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IChmaWVsZCktPiBoZWxwZXJzLmRlZmF1bHRDb2xvciBmaWVsZC5lbHMuaW5uZXJ3cmFwLnN0eWxlU2FmZSgnYmFja2dyb3VuZENvbG9yJywxKSwgJ3doaXRlJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuXHRcdFx0XVxuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcGxhY2Vob2xkZXI6IHRydWUsXG4gIHZhbGlkV2hlbklzQ2hvaWNlOiBmYWxzZSxcbiAgdmFsaWRXaGVuUmVnZXg6IGZhbHNlLFxuICBhdXRvV2lkdGg6IGZhbHNlLFxuICBtYXhXaWR0aDogJzEwMCUnLFxuICBtaW5XaWR0aDogMixcbiAgaGVpZ2h0OiA0NixcbiAgY2hlY2ttYXJrOiB0cnVlLFxuICBrZXlib2FyZDogJ3RleHQnLFxuICBkcm9wZG93bjoge1xuICAgIGxvY2tTY3JvbGw6IGZhbHNlXG4gIH0sXG4gIGNob2ljZXM6IG51bGwsXG4gIG1pbkxlbmd0aDogbnVsbCxcbiAgbWF4TGVuZ3RoOiBudWxsLFxuICBpbnB1dFNpYmxpbmc6ICdjaGVja21hcmsnLFxuICBtYXNrOiB7XG4gICAgcGF0dGVybjogZmFsc2UsXG4gICAgcGxhY2Vob2xkZXI6ICdfJyxcbiAgICBndWlkZTogdHJ1ZSxcbiAgICBjdXN0b21QYXR0ZXJuczogZmFsc2VcbiAgfVxufTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSm1hV1ZzWkM5MFpYaDBMMlJsWm1GMWJIUnpMbU52Wm1abFpTSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJYWDA9IiwiZXhwb3J0cy5SRUdFWF9MRU5fVkFMID0gL15cXGQrKD86W2Etel18XFwlKSskL2k7XG5cbmV4cG9ydHMuUkVHRVhfRElHSVRTID0gL1xcZCskLztcblxuZXhwb3J0cy5SRUdFWF9TUEFDRSA9IC9cXHMvO1xuXG5leHBvcnRzLlJFR0VYX0tFQkFCID0gLyhbQS1aXSkrL2c7XG5cbmV4cG9ydHMuSU1QT1JUQU5UID0gJ2ltcG9ydGFudCc7XG5cbmV4cG9ydHMuUE9TU0lCTEVfUFJFRklYRVMgPSBbJ3dlYmtpdCcsICdtb3onLCAnbXMnLCAnbyddO1xuXG5leHBvcnRzLlJFUVVJUkVTX1VOSVRfVkFMVUUgPSBbJ2JhY2tncm91bmQtcG9zaXRpb24teCcsICdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknLCAnYmxvY2stc2l6ZScsICdib3JkZXItd2lkdGgnLCAnY29sdW1uUnVsZS13aWR0aCcsICdjeCcsICdjeScsICdmb250LXNpemUnLCAnZ3JpZC1jb2x1bW4tZ2FwJywgJ2dyaWQtcm93LWdhcCcsICdoZWlnaHQnLCAnaW5saW5lLXNpemUnLCAnbGluZS1oZWlnaHQnLCAnbWluQmxvY2stc2l6ZScsICdtaW4taGVpZ2h0JywgJ21pbi1pbmxpbmUtc2l6ZScsICdtaW4td2lkdGgnLCAnbWF4LWhlaWdodCcsICdtYXgtd2lkdGgnLCAnb3V0bGluZS1vZmZzZXQnLCAnb3V0bGluZS13aWR0aCcsICdwZXJzcGVjdGl2ZScsICdzaGFwZS1tYXJnaW4nLCAnc3Ryb2tlLWRhc2hvZmZzZXQnLCAnc3Ryb2tlLXdpZHRoJywgJ3RleHQtaW5kZW50JywgJ3dpZHRoJywgJ3dvcmQtc3BhY2luZycsICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnLCAneCcsICd5J107XG5cbmV4cG9ydHMuUVVBRF9TSE9SVEhBTkRTID0gWydtYXJnaW4nLCAncGFkZGluZycsICdib3JkZXInLCAnYm9yZGVyLXJhZGl1cyddO1xuXG5leHBvcnRzLkRJUkVDVElPTlMgPSBbJ3RvcCcsICdib3R0b20nLCAnbGVmdCcsICdyaWdodCddO1xuXG5leHBvcnRzLlFVQURfU0hPUlRIQU5EUy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gIHZhciBkaXJlY3Rpb24sIGksIGxlbiwgcmVmO1xuICBleHBvcnRzLlJFUVVJUkVTX1VOSVRfVkFMVUUucHVzaChwcm9wZXJ0eSk7XG4gIHJlZiA9IGV4cG9ydHMuRElSRUNUSU9OUztcbiAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZGlyZWN0aW9uID0gcmVmW2ldO1xuICAgIGV4cG9ydHMuUkVRVUlSRVNfVU5JVF9WQUxVRS5wdXNoKHByb3BlcnR5ICsgJy0nICsgZGlyZWN0aW9uKTtcbiAgfVxufSk7XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUl1TGk5dWIyUmxYMjF2WkhWc1pYTXZjWFZwWTJ0a2IyMHZibTlrWlY5dGIyUjFiR1Z6TDNGMWFXTnJZM056TDNOeVl5OWpiMjV6ZEdGdWRITXVZMjltWm1WbElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sdGRmUT09IiwiY29uc3RhbnRzID0gaW1wb3J0ICcuL2NvbnN0YW50cydcbnNhbXBsZVN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jykuc3R5bGVcblxuaGVscGVycyA9IGV4cG9ydHNcblxuaGVscGVycy5pbmNsdWRlcyA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0dGFyZ2V0IGFuZCB0YXJnZXQuaW5kZXhPZihpdGVtKSBpc250IC0xXG5cbmhlbHBlcnMuaXNJdGVyYWJsZSA9ICh0YXJnZXQpLT5cblx0dGFyZ2V0IGFuZFxuXHR0eXBlb2YgdGFyZ2V0IGlzICdvYmplY3QnIGFuZFxuXHR0eXBlb2YgdGFyZ2V0Lmxlbmd0aCBpcyAnbnVtYmVyJyBhbmRcblx0bm90IHRhcmdldC5ub2RlVHlwZVxuXG5oZWxwZXJzLnRvS2ViYWJDYXNlID0gKHN0cmluZyktPlxuXHRzdHJpbmcucmVwbGFjZSBjb25zdGFudHMuUkVHRVhfS0VCQUIsIChlLGxldHRlciktPiBcIi0je2xldHRlci50b0xvd2VyQ2FzZSgpfVwiXG5cbmhlbHBlcnMuaXNQcm9wU3VwcG9ydGVkID0gKHByb3BlcnR5KS0+XG5cdHR5cGVvZiBzYW1wbGVTdHlsZVtwcm9wZXJ0eV0gaXNudCAndW5kZWZpbmVkJ1xuXG5oZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQgPSAocHJvcGVydHksIHZhbHVlKS0+XG5cdGlmIHdpbmRvdy5DU1MgYW5kIHdpbmRvdy5DU1Muc3VwcG9ydHNcblx0XHRyZXR1cm4gd2luZG93LkNTUy5zdXBwb3J0cyhwcm9wZXJ0eSwgdmFsdWUpXG5cdGVsc2Vcblx0XHRzYW1wbGVTdHlsZVtwcm9wZXJ0eV0gPSB2YWx1ZVxuXHRcdHJldHVybiBzYW1wbGVTdHlsZVtwcm9wZXJ0eV0gaXMgJycrdmFsdWVcblxuaGVscGVycy5nZXRQcmVmaXggPSAocHJvcGVydHksIHNraXBJbml0aWFsQ2hlY2spLT5cblx0aWYgc2tpcEluaXRpYWxDaGVjayBvciBub3QgaGVscGVycy5pc1Byb3BTdXBwb3J0ZWQocHJvcGVydHkpXG5cdFx0Zm9yIHByZWZpeCBpbiBjb25zdGFudHMuUE9TU0lCTEVfUFJFRklYRVNcblx0XHRcdCMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblx0XHRcdHJldHVybiBcIi0je3ByZWZpeH0tXCIgaWYgaGVscGVycy5pc1Byb3BTdXBwb3J0ZWQoXCItI3twcmVmaXh9LSN7cHJvcGVydHl9XCIpXG5cdFxuXHRyZXR1cm4gJydcblxuaGVscGVycy5ub3JtYWxpemVQcm9wZXJ0eSA9IChwcm9wZXJ0eSktPlx0XG5cdHByb3BlcnR5ID0gaGVscGVycy50b0tlYmFiQ2FzZShwcm9wZXJ0eSlcblx0XG5cdGlmIGhlbHBlcnMuaXNQcm9wU3VwcG9ydGVkKHByb3BlcnR5KVxuXHRcdHJldHVybiBwcm9wZXJ0eVxuXHRlbHNlXG5cdFx0cmV0dXJuIFwiI3toZWxwZXJzLmdldFByZWZpeChwcm9wZXJ0eSx0cnVlKX0je3Byb3BlcnR5fVwiXG5cbmhlbHBlcnMubm9ybWFsaXplVmFsdWUgPSAocHJvcGVydHksIHZhbHVlKS0+XG5cdGlmIGhlbHBlcnMuaW5jbHVkZXMoY29uc3RhbnRzLlJFUVVJUkVTX1VOSVRfVkFMVUUsIHByb3BlcnR5KSBhbmQgdmFsdWUgaXNudCBudWxsXG5cdFx0dmFsdWUgPSAnJyt2YWx1ZVxuXHRcdGlmICBjb25zdGFudHMuUkVHRVhfRElHSVRTLnRlc3QodmFsdWUpIGFuZFxuXHRcdFx0bm90IGNvbnN0YW50cy5SRUdFWF9MRU5fVkFMLnRlc3QodmFsdWUpIGFuZFxuXHRcdFx0bm90IGNvbnN0YW50cy5SRUdFWF9TUEFDRS50ZXN0KHZhbHVlKVxuXHRcdFx0XHR2YWx1ZSArPSBpZiBwcm9wZXJ0eSBpcyAnbGluZS1oZWlnaHQnIHRoZW4gJ2VtJyBlbHNlICdweCdcblxuXHRyZXR1cm4gdmFsdWVcblxuXG5oZWxwZXJzLnNvcnQgPSAoYXJyYXkpLT5cblx0aWYgYXJyYXkubGVuZ3RoIDwgMlxuXHRcdHJldHVybiBhcnJheVxuXHRlbHNlXG5cdFx0cGl2b3QgPSBhcnJheVswXTsgbGVzcyA9IFtdOyBncmVhdCA9IFtdOyBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPSAwO1xuXHRcdFxuXHRcdHdoaWxlICsraSBpc250IGxlblxuXHRcdFx0aWYgYXJyYXlbaV0gPD0gcGl2b3Rcblx0XHRcdFx0bGVzcy5wdXNoKGFycmF5W2ldKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRncmVhdC5wdXNoKGFycmF5W2ldKVxuXG5cdFx0cmV0dXJuIGhlbHBlcnMuc29ydChsZXNzKS5jb25jYXQocGl2b3QsIGhlbHBlcnMuc29ydChncmVhdCkpXG5cblxuaGVscGVycy5oYXNoID0gKHN0cmluZyktPlxuXHRoYXNoID0gNTM4MTsgaSA9IC0xOyBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG5cdFxuXHR3aGlsZSArK2kgaXNudCBzdHJpbmcubGVuZ3RoXG5cdFx0aGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgc3RyaW5nLmNoYXJDb2RlQXQoaSlcblx0XHRoYXNoIHw9IDBcblxuXHRyZXR1cm4gJ18nKyhpZiBoYXNoIDwgMCB0aGVuIGhhc2ggKiAtMiBlbHNlIGhhc2gpXG5cblxuaGVscGVycy5ydWxlVG9TdHJpbmcgPSAocnVsZSwgaW1wb3J0YW50KS0+XG5cdG91dHB1dCA9ICcnXG5cdHByb3BzID0gaGVscGVycy5zb3J0KE9iamVjdC5rZXlzKHJ1bGUpKVxuXHRcblx0Zm9yIHByb3AgaW4gcHJvcHNcblx0XHRpZiB0eXBlb2YgcnVsZVtwcm9wXSBpcyAnc3RyaW5nJyBvciB0eXBlb2YgcnVsZVtwcm9wXSBpcyAnbnVtYmVyJ1xuXHRcdFx0cHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5KHByb3ApXG5cdFx0XHR2YWx1ZSA9IGhlbHBlcnMubm9ybWFsaXplVmFsdWUocHJvcGVydHksIHJ1bGVbcHJvcF0pXG5cdFx0XHR2YWx1ZSArPSBcIiAhaW1wb3J0YW50XCIgaWYgaW1wb3J0YW50XG5cdFx0XHRvdXRwdXQgKz0gXCIje3Byb3BlcnR5fToje3ZhbHVlfTtcIlxuXHRcblx0cmV0dXJuIG91dHB1dFxuXG5oZWxwZXJzLmlubGluZVN0eWxlQ29uZmlnID0gc3R5bGVDb25maWcgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5oZWxwZXJzLmlubGluZVN0eWxlID0gKHJ1bGUsIHZhbHVlVG9TdG9yZSwgbGV2ZWwpLT5cblx0aWYgbm90IGNvbmZpZz1zdHlsZUNvbmZpZ1tsZXZlbF1cblx0XHRzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuXHRcdHN0eWxlRWwuaWQgPSBcInF1aWNrY3NzI3tsZXZlbCBvciAnJ31cIlxuXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbClcblx0XHRzdHlsZUNvbmZpZ1tsZXZlbF0gPSBjb25maWcgPSBlbDpzdHlsZUVsLCBjb250ZW50OicnLCBjYWNoZTpPYmplY3QuY3JlYXRlKG51bGwpXG5cdFxuXHR1bmxlc3MgY29uZmlnLmNhY2hlW3J1bGVdXG5cdFx0Y29uZmlnLmNhY2hlW3J1bGVdID0gdmFsdWVUb1N0b3JlIG9yIHRydWVcblx0XHRjb25maWcuZWwudGV4dENvbnRlbnQgPSBjb25maWcuY29udGVudCArPSBydWxlXG5cdFxuXHRyZXR1cm5cblxuXG5oZWxwZXJzLmNsZWFySW5saW5lU3R5bGUgPSAobGV2ZWwpLT4gaWYgY29uZmlnID0gc3R5bGVDb25maWdbbGV2ZWxdXG5cdHJldHVybiBpZiBub3QgY29uZmlnLmNvbnRlbnRcblx0Y29uZmlnLmVsLnRleHRDb250ZW50ID0gY29uZmlnLmNvbnRlbnQgPSAnJ1xuXHRrZXlzID0gT2JqZWN0LmtleXMoY29uZmlnLmNhY2hlKVxuXHRjb25maWcuY2FjaGVba2V5XSA9IG51bGwgZm9yIGtleSBpbiBrZXlzXG5cdHJldHVyblxuXG5cblxuXG5cbiIsInZhciBleHBvcnRzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSB7XG4gIGRlZmluZWQ6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gc3ViamVjdCAhPT0gdm9pZCAwO1xuICB9LFxuICBhcnJheTogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0IGluc3RhbmNlb2YgQXJyYXk7XG4gIH0sXG4gIG9iamVjdDogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiYgc3ViamVjdDtcbiAgfSxcbiAgb2JqZWN0UGxhaW46IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5vYmplY3Qoc3ViamVjdCkgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBPYmplY3RdJyAmJiBzdWJqZWN0LmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XG4gIH0sXG4gIHN0cmluZzogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygc3ViamVjdCA9PT0gJ3N0cmluZyc7XG4gIH0sXG4gIG51bWJlcjogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygc3ViamVjdCA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHN1YmplY3QpO1xuICB9LFxuICBudW1iZXJMb29zZTogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBleHBvcnRzLm51bWJlcihzdWJqZWN0KSB8fCBleHBvcnRzLnN0cmluZyhzdWJqZWN0KSAmJiBleHBvcnRzLm51bWJlcihOdW1iZXIoc3ViamVjdCkpO1xuICB9LFxuICBcImZ1bmN0aW9uXCI6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIHN1YmplY3QgPT09ICdmdW5jdGlvbic7XG4gIH0sXG4gIGl0ZXJhYmxlOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIGV4cG9ydHMub2JqZWN0KHN1YmplY3QpICYmIGV4cG9ydHMubnVtYmVyKHN1YmplY3QubGVuZ3RoKTtcbiAgfVxufTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdlFHUmhibWxsYkd0aGJHVnVMMmx6TDNOeVl5OXVZWFJwZG1WekxtTnZabVpsWlNJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYlhYMD0iLCJ2YXIgZXhwb3J0cztcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0ge1xuICBkb21Eb2M6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gc3ViamVjdCAmJiBzdWJqZWN0Lm5vZGVUeXBlID09PSA5O1xuICB9LFxuICBkb21FbDogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0ICYmIHN1YmplY3Qubm9kZVR5cGUgPT09IDE7XG4gIH0sXG4gIGRvbVRleHQ6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gc3ViamVjdCAmJiBzdWJqZWN0Lm5vZGVUeXBlID09PSAzO1xuICB9LFxuICBkb21Ob2RlOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuZG9tRWwoc3ViamVjdCkgfHwgZXhwb3J0cy5kb21UZXh0KHN1YmplY3QpO1xuICB9LFxuICBkb21UZXh0YXJlYTogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0ICYmIHN1YmplY3Qubm9kZU5hbWUgPT09ICdURVhUQVJFQSc7XG4gIH0sXG4gIGRvbUlucHV0OiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHN1YmplY3QgJiYgc3ViamVjdC5ub2RlTmFtZSA9PT0gJ0lOUFVUJztcbiAgfSxcbiAgZG9tU2VsZWN0OiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHN1YmplY3QgJiYgc3ViamVjdC5ub2RlTmFtZSA9PT0gJ1NFTEVDVCc7XG4gIH0sXG4gIGRvbUZpZWxkOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuZG9tSW5wdXQoc3ViamVjdCkgfHwgZXhwb3J0cy5kb21UZXh0YXJlYShzdWJqZWN0KSB8fCBleHBvcnRzLmRvbVNlbGVjdChzdWJqZWN0KTtcbiAgfVxufTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdlFHUmhibWxsYkd0aGJHVnVMMmx6TDNOeVl5OWtiMjB1WTI5bVptVmxJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHRkZlE9PSIsImV4cG9ydHMuUkVHRVhfTEVOX1ZBTCA9IC9eXFxkKyg/OlthLXpdfFxcJSkrJC9pO1xuXG5leHBvcnRzLlJFR0VYX0RJR0lUUyA9IC9cXGQrJC87XG5cbmV4cG9ydHMuUkVHRVhfU1BBQ0UgPSAvXFxzLztcblxuZXhwb3J0cy5SRUdFWF9LRUJBQiA9IC8oW0EtWl0pKy9nO1xuXG5leHBvcnRzLlBPU1NJQkxFX1BSRUZJWEVTID0gWyd3ZWJraXQnLCAnbW96JywgJ21zJywgJ28nXTtcblxuZXhwb3J0cy5SRVFVSVJFU19VTklUX1ZBTFVFID0gWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnLCAnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgJ2Jsb2NrLXNpemUnLCAnYm9yZGVyLXdpZHRoJywgJ2NvbHVtblJ1bGUtd2lkdGgnLCAnY3gnLCAnY3knLCAnZm9udC1zaXplJywgJ2dyaWQtY29sdW1uLWdhcCcsICdncmlkLXJvdy1nYXAnLCAnaGVpZ2h0JywgJ2lubGluZS1zaXplJywgJ2xpbmUtaGVpZ2h0JywgJ21pbkJsb2NrLXNpemUnLCAnbWluLWhlaWdodCcsICdtaW4taW5saW5lLXNpemUnLCAnbWluLXdpZHRoJywgJ21heC1oZWlnaHQnLCAnbWF4LXdpZHRoJywgJ291dGxpbmUtb2Zmc2V0JywgJ291dGxpbmUtd2lkdGgnLCAncGVyc3BlY3RpdmUnLCAnc2hhcGUtbWFyZ2luJywgJ3N0cm9rZS1kYXNob2Zmc2V0JywgJ3N0cm9rZS13aWR0aCcsICd0ZXh0LWluZGVudCcsICd3aWR0aCcsICd3b3JkLXNwYWNpbmcnLCAndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0JywgJ3gnLCAneSddO1xuXG5leHBvcnRzLlFVQURfU0hPUlRIQU5EUyA9IFsnbWFyZ2luJywgJ3BhZGRpbmcnLCAnYm9yZGVyJywgJ2JvcmRlci1yYWRpdXMnXTtcblxuZXhwb3J0cy5ESVJFQ1RJT05TID0gWyd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXTtcblxuZXhwb3J0cy5RVUFEX1NIT1JUSEFORFMuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICB2YXIgZGlyZWN0aW9uLCBpLCBsZW4sIHJlZjtcbiAgZXhwb3J0cy5SRVFVSVJFU19VTklUX1ZBTFVFLnB1c2gocHJvcGVydHkpO1xuICByZWYgPSBleHBvcnRzLkRJUkVDVElPTlM7XG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGRpcmVjdGlvbiA9IHJlZltpXTtcbiAgICBleHBvcnRzLlJFUVVJUkVTX1VOSVRfVkFMVUUucHVzaChwcm9wZXJ0eSArICctJyArIGRpcmVjdGlvbik7XG4gIH1cbn0pO1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12Y1hWcFkydGpjM012YzNKakwyTnZibk4wWVc1MGN5NWpiMlptWldVaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNlcxMTkiLCJjb25zdGFudHMgPSBpbXBvcnQgJy4vY29uc3RhbnRzJ1xuc2FtcGxlU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKS5zdHlsZVxuXG5oZWxwZXJzID0gZXhwb3J0c1xuXG5oZWxwZXJzLmluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPlxuXHR0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuaGVscGVycy5pc0l0ZXJhYmxlID0gKHRhcmdldCktPlxuXHR0YXJnZXQgYW5kXG5cdHR5cGVvZiB0YXJnZXQgaXMgJ29iamVjdCcgYW5kXG5cdHR5cGVvZiB0YXJnZXQubGVuZ3RoIGlzICdudW1iZXInIGFuZFxuXHRub3QgdGFyZ2V0Lm5vZGVUeXBlXG5cbmhlbHBlcnMudG9LZWJhYkNhc2UgPSAoc3RyaW5nKS0+XG5cdHN0cmluZy5yZXBsYWNlIGNvbnN0YW50cy5SRUdFWF9LRUJBQiwgKGUsbGV0dGVyKS0+IFwiLSN7bGV0dGVyLnRvTG93ZXJDYXNlKCl9XCJcblxuaGVscGVycy5pc1Byb3BTdXBwb3J0ZWQgPSAocHJvcGVydHkpLT5cblx0dHlwZW9mIHNhbXBsZVN0eWxlW3Byb3BlcnR5XSBpc250ICd1bmRlZmluZWQnXG5cbmhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZCA9IChwcm9wZXJ0eSwgdmFsdWUpLT5cblx0aWYgd2luZG93LkNTUyBhbmQgd2luZG93LkNTUy5zdXBwb3J0c1xuXHRcdHJldHVybiB3aW5kb3cuQ1NTLnN1cHBvcnRzKHByb3BlcnR5LCB2YWx1ZSlcblx0ZWxzZVxuXHRcdHNhbXBsZVN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlXG5cdFx0cmV0dXJuIHNhbXBsZVN0eWxlW3Byb3BlcnR5XSBpcyAnJyt2YWx1ZVxuXG5oZWxwZXJzLmdldFByZWZpeCA9IChwcm9wZXJ0eSwgc2tpcEluaXRpYWxDaGVjayktPlxuXHRpZiBza2lwSW5pdGlhbENoZWNrIG9yIG5vdCBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZChwcm9wZXJ0eSlcblx0XHRmb3IgcHJlZml4IGluIGNvbnN0YW50cy5QT1NTSUJMRV9QUkVGSVhFU1xuXHRcdFx0IyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuXHRcdFx0cmV0dXJuIFwiLSN7cHJlZml4fS1cIiBpZiBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZChcIi0je3ByZWZpeH0tI3twcm9wZXJ0eX1cIilcblx0XG5cdHJldHVybiAnJ1xuXG5oZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5ID0gKHByb3BlcnR5KS0+XHRcblx0cHJvcGVydHkgPSBoZWxwZXJzLnRvS2ViYWJDYXNlKHByb3BlcnR5KVxuXHRcblx0aWYgaGVscGVycy5pc1Byb3BTdXBwb3J0ZWQocHJvcGVydHkpXG5cdFx0cmV0dXJuIHByb3BlcnR5XG5cdGVsc2Vcblx0XHRyZXR1cm4gXCIje2hlbHBlcnMuZ2V0UHJlZml4KHByb3BlcnR5LHRydWUpfSN7cHJvcGVydHl9XCJcblxuaGVscGVycy5ub3JtYWxpemVWYWx1ZSA9IChwcm9wZXJ0eSwgdmFsdWUpLT5cblx0aWYgaGVscGVycy5pbmNsdWRlcyhjb25zdGFudHMuUkVRVUlSRVNfVU5JVF9WQUxVRSwgcHJvcGVydHkpIGFuZCB2YWx1ZSBpc250IG51bGxcblx0XHR2YWx1ZSA9ICcnK3ZhbHVlXG5cdFx0aWYgIGNvbnN0YW50cy5SRUdFWF9ESUdJVFMudGVzdCh2YWx1ZSkgYW5kXG5cdFx0XHRub3QgY29uc3RhbnRzLlJFR0VYX0xFTl9WQUwudGVzdCh2YWx1ZSkgYW5kXG5cdFx0XHRub3QgY29uc3RhbnRzLlJFR0VYX1NQQUNFLnRlc3QodmFsdWUpXG5cdFx0XHRcdHZhbHVlICs9IGlmIHByb3BlcnR5IGlzICdsaW5lLWhlaWdodCcgdGhlbiAnZW0nIGVsc2UgJ3B4J1xuXG5cdHJldHVybiB2YWx1ZVxuXG5cbmhlbHBlcnMuc29ydCA9IChhcnJheSktPlxuXHRpZiBhcnJheS5sZW5ndGggPCAyXG5cdFx0cmV0dXJuIGFycmF5XG5cdGVsc2Vcblx0XHRwaXZvdCA9IGFycmF5WzBdOyBsZXNzID0gW107IGdyZWF0ID0gW107IGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA9IDA7XG5cdFx0XG5cdFx0d2hpbGUgKytpIGlzbnQgbGVuXG5cdFx0XHRpZiBhcnJheVtpXSA8PSBwaXZvdFxuXHRcdFx0XHRsZXNzLnB1c2goYXJyYXlbaV0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGdyZWF0LnB1c2goYXJyYXlbaV0pXG5cblx0XHRyZXR1cm4gaGVscGVycy5zb3J0KGxlc3MpLmNvbmNhdChwaXZvdCwgaGVscGVycy5zb3J0KGdyZWF0KSlcblxuXG5oZWxwZXJzLmhhc2ggPSAoc3RyaW5nKS0+XG5cdGhhc2ggPSA1MzgxOyBpID0gLTE7IGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcblx0XG5cdHdoaWxlICsraSBpc250IHN0cmluZy5sZW5ndGhcblx0XHRoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBzdHJpbmcuY2hhckNvZGVBdChpKVxuXHRcdGhhc2ggfD0gMFxuXG5cdHJldHVybiAnXycrKGlmIGhhc2ggPCAwIHRoZW4gaGFzaCAqIC0yIGVsc2UgaGFzaClcblxuXG5oZWxwZXJzLnJ1bGVUb1N0cmluZyA9IChydWxlKS0+XG5cdG91dHB1dCA9ICcnXG5cdHByb3BzID0gaGVscGVycy5zb3J0KE9iamVjdC5rZXlzKHJ1bGUpKVxuXHRcblx0Zm9yIHByb3AgaW4gcHJvcHNcblx0XHRpZiB0eXBlb2YgcnVsZVtwcm9wXSBpcyAnc3RyaW5nJyBvciB0eXBlb2YgcnVsZVtwcm9wXSBpcyAnbnVtYmVyJ1xuXHRcdFx0cHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5KHByb3ApXG5cdFx0XHR2YWx1ZSA9IGhlbHBlcnMubm9ybWFsaXplVmFsdWUocHJvcGVydHksIHJ1bGVbcHJvcF0pXG5cdFx0XHRvdXRwdXQgKz0gXCIje3Byb3BlcnR5fToje3ZhbHVlfTtcIlxuXHRcblx0cmV0dXJuIG91dHB1dFxuXG5oZWxwZXJzLmlubGluZVN0eWxlQ29uZmlnID0gc3R5bGVDb25maWcgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5oZWxwZXJzLmlubGluZVN0eWxlID0gKHJ1bGUsIHZhbHVlVG9TdG9yZSwgbGV2ZWwpLT5cblx0aWYgbm90IGNvbmZpZz1zdHlsZUNvbmZpZ1tsZXZlbF1cblx0XHRzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuXHRcdHN0eWxlRWwuaWQgPSBcInF1aWNrY3NzI3tsZXZlbCBvciAnJ31cIlxuXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbClcblx0XHRzdHlsZUNvbmZpZ1tsZXZlbF0gPSBjb25maWcgPSBlbDpzdHlsZUVsLCBjb250ZW50OicnLCBjYWNoZTpPYmplY3QuY3JlYXRlKG51bGwpXG5cdFxuXHR1bmxlc3MgY29uZmlnLmNhY2hlW3J1bGVdXG5cdFx0Y29uZmlnLmNhY2hlW3J1bGVdID0gdmFsdWVUb1N0b3JlIG9yIHRydWVcblx0XHRjb25maWcuZWwudGV4dENvbnRlbnQgPSBjb25maWcuY29udGVudCArPSBydWxlXG5cdFxuXHRyZXR1cm5cblxuXG5oZWxwZXJzLmNsZWFySW5saW5lU3R5bGUgPSAobGV2ZWwpLT4gaWYgY29uZmlnID0gc3R5bGVDb25maWdbbGV2ZWxdXG5cdHJldHVybiBpZiBub3QgY29uZmlnLmNvbnRlbnRcblx0Y29uZmlnLmVsLnRleHRDb250ZW50ID0gY29uZmlnLmNvbnRlbnQgPSAnJ1xuXHRrZXlzID0gT2JqZWN0LmtleXMoY29uZmlnLmNhY2hlKVxuXHRjb25maWcuY2FjaGVba2V5XSA9IG51bGwgZm9yIGtleSBpbiBrZXlzXG5cdHJldHVyblxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5TVkcgPSBpbXBvcnQgJy4uLy4uL3N2ZydcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5cbmV4cG9ydCBkZWZhdWx0IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnZHJvcGRvd24nXG5cdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdHpJbmRleDogMTBcblx0XHRcdG92ZXJmbG93OiAnaGlkZGVuJ1xuXHRcdFx0dG9wOiAoZHJvcGRvd24pLT4gaWYgZHJvcGRvd24uZmllbGQudHlwZSBpcyAndGV4dCcgdGhlbiBAcGFyZW50LnJhdy5zdHlsZS5oZWlnaHQgZWxzZSAnLTdweCdcblx0XHRcdGxlZnQ6ICgpLT4gaWYgQHBhcmVudC5yZWN0LmxlZnQgLSA1IDwgMCB0aGVuIDAgZWxzZSAtNVxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHQjIGJhY2tncm91bmRDb2xvcjogaGVscGVycy5oZXhUb1JHQkEoJ2Y2ZjZmNicsIDAuOSlcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNmNmY2ZjYnXG5cdFx0XHRib3hTaGFkb3c6IFwiMHB4IDZweCAxMHB4ICN7aGVscGVycy5oZXhUb1JHQkEoJzAwMDAwMCcsIDAuMzIpfVwiXG5cdFx0XHRib3JkZXJXaWR0aDogJzFweCdcblx0XHRcdGJvcmRlclN0eWxlOiAnc29saWQnXG5cdFx0XHRib3JkZXJDb2xvcjogJyNkMWQxZDEnXG5cdFx0XHRib3JkZXJSYWRpdXM6ICc1cHgnXG5cdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0cGFkZGluZzogJzRweCAwJ1xuXHRcdFx0JGlzT3BlbjogJGhhc1Zpc2libGVDaG9pY2VzOlxuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdF1cbilcblxuZXhwb3J0IGxpc3QgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2xpc3QnXG5cdFx0cGFzc1N0YXRlVG9DaGlsZHJlbjogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHRvdmVyZmxvdzogJ3Njcm9sbCdcblx0XHRcdG92ZXJmbG93U2Nyb2xsaW5nOiAndG91Y2gnXG5cdFx0XHRvdmVyZmxvd1N0eWxlOiAnLW1zLWF1dG9oaWRpbmctc2Nyb2xsYmFyJ1xuXHRdXG4pXG5cbmV4cG9ydCBjaG9pY2UgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHN0eWxlOlxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRmb250U2l6ZTogJzAnXG5cdFx0XHRjb2xvcjogJyMwMDAwMDAnXG5cdFx0XHR1c2VyU2VsZWN0OiAnbm9uZSdcblx0XHRcdGxpbmVIZWlnaHQ6ICcxZW0nXG5cdFx0XHRjdXJzb3I6ICdwb2ludGVyJ1xuXHRcdFx0JHZpc2libGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRcdCR1bmF2YWlsYWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHQkaG92ZXI6XG5cdFx0XHRcdGNvbG9yOiAnI2ZmZmZmZidcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAnIzRDOTZGRidcblxuXHRcdFsnZGl2JyAjIENoZWNrbWFya1xuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHRcdHZlcnRpY2FsQWxpZ246J3RvcCdcblx0XHRcdFx0d2lkdGg6ICcyMHB4J1xuXHRcdFx0XHQjIGhlaWdodDogKCktPiBAcGFyZW50LnJhdy5zdHlsZS5oZWlnaHRcblx0XHRcdFx0IyBsaW5lSGVpZ2h0OiAoKS0+IEBwYXJlbnQuc3R5bGUoJ2hlaWdodCcpXG5cdFx0XHRcdCMgZm9udFNpemU6ICgpLT4gQHBhcmVudC5zdHlsZSgnaGVpZ2h0Jylcblx0XHRcdFx0bGluZUhlaWdodDogJzIwcHgnXG5cdFx0XHRcdGZvbnRTaXplOiAnMTNweCdcblx0XHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJ1xuXHRcdFx0XHRjb2xvcjogJ2luaGVyaXQnXG5cdFx0XHRcdHN0cm9rZTogJ2N1cnJlbnRDb2xvcidcblx0XHRcdFx0dmlzaWJpbGl0eTogJ2hpZGRlbidcblx0XHRcdFx0JHNlbGVjdGVkOlxuXHRcdFx0XHRcdHZpc2liaWxpdHk6ICd2aXNpYmxlJ1xuXG5cdFx0XHRTVkcuY2hlY2ttYXJrXG5cdFx0XVxuXHRcdFxuXHRcdFsnZGl2JyAjIFRleHRcblx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuXHRcdFx0XHRvdmVyZmxvdzogJ2hpZGRlbidcblx0XHRcdFx0dGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnXG5cdFx0XHRcdHdoaXRlU3BhY2U6ICdub3dyYXAnXG5cdFx0XHRcdHdvcmRXcmFwOiAnbm9ybWFsJ1xuXHRcdFx0XHRtYXhXaWR0aDogKCktPiBcImNhbGMoMTAwJSAtICN7QHByZXYuc3R5bGVTYWZlICd3aWR0aCcsIHRydWV9KVwiXG5cdFx0XHRcdHBhZGRpbmdSaWdodDogJzEwcHgnXG5cdFx0XHRcdGxpbmVIZWlnaHQ6ICcyMHB4J1xuXHRcdFx0XHRmb250U2l6ZTogJzExcHgnXG5cdFx0XHRcdGZvbnRGYW1pbHk6IChkcm9wZG93biktPiBkcm9wZG93bi5zZXR0aW5ncy5mb250RmFtaWx5XG5cdFx0XHRcdGNvbG9yOiAnaW5oZXJpdCdcblx0XHRcdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCdcblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IHNjcm9sbEluZGljYXRvclVwID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdzY3JvbGxJbmRpY2F0b3JVcCdcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHR0b3A6IDBcblx0XHRcdGxlZnQ6IDBcblx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMjBweCdcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNmNmY2ZjYnXG5cdFx0XHRjb2xvcjogJyMwMDAwMDAnXG5cdFx0XHR0ZXh0QWxpZ246ICdjZW50ZXInXG5cdFx0XHQkdmlzaWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXG5cdFx0WydkaXYnXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0dG9wOiAnNTAlJ1xuXHRcdFx0XHRsZWZ0OiAwXG5cdFx0XHRcdHJpZ2h0OiAwXG5cdFx0XHRcdHdpZHRoOiAnMTVweCdcblx0XHRcdFx0aGVpZ2h0OiAnMTVweCdcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0XHRtYXJnaW46ICcwIGF1dG8nXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknXG5cdFxuXHRcdFx0U1ZHLmNhcmV0VXBcblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IHNjcm9sbEluZGljYXRvckRvd24gPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ3Njcm9sbEluZGljYXRvckRvd24nXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0Ym90dG9tOiAwXG5cdFx0XHRsZWZ0OiAwXG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzIwcHgnXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjZjZmNmY2J1xuXHRcdFx0Y29sb3I6ICcjMDAwMDAwJ1xuXHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJ1xuXHRcdFx0JHZpc2libGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblxuXHRcdFsnZGl2J1xuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdHRvcDogJzUwJSdcblx0XHRcdFx0bGVmdDogMFxuXHRcdFx0XHRyaWdodDogMFxuXHRcdFx0XHR3aWR0aDogJzE1cHgnXG5cdFx0XHRcdGhlaWdodDogJzE1cHgnXG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRcdFx0bWFyZ2luOiAnMCBhdXRvJ1xuXHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJ1xuXG5cdFx0XHRTVkcuY2FyZXREb3duXG5cdFx0XVxuXHRdXG4pXG5cbmV4cG9ydCBoZWxwID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdoZWxwJ1xuXHRcdHN0eWxlOlxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRib3JkZXJUb3A6ICcycHggc29saWQgcmdiYSgwLDAsMCwwLjA1KSdcblx0XHRcdHBhZGRpbmc6ICc0cHggMTJweCAxcHgnXG5cdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMC41KSdcblx0XHRcdGZvbnRXZWlnaHQ6ICc1MDAnXG5cdFx0XHRmb250U2l6ZTogJzExcHgnXG5cdFx0XHR1c2VyU2VsZWN0OiAnbm9uZSdcblx0XHRcdCRzaG93SGVscDpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRdXG4pXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1heEhlaWdodDogMzAwLFxuICBtdWx0aXBsZTogZmFsc2UsXG4gIGxvY2tTY3JvbGw6IHRydWUsXG4gIHR5cGVCdWZmZXI6IGZhbHNlLFxuICBoZWxwOiAnJyxcbiAgdGVtcGxhdGVzOiB7fVxufTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSmpiMjF3YjI1bGJuUnpMMlJ5YjNCa2IzZHVMMlJsWm1GMWJIUnpMbU52Wm1abFpTSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJYWDA9IiwiIWZ1bmN0aW9uKGUscil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9cigpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW10scik6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/ZXhwb3J0cy50ZXh0TWFza0NvcmU9cigpOmUudGV4dE1hc2tDb3JlPXIoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtmdW5jdGlvbiByKG4pe2lmKHRbbl0pcmV0dXJuIHRbbl0uZXhwb3J0czt2YXIgbz10W25dPXtleHBvcnRzOnt9LGlkOm4sbG9hZGVkOiExfTtyZXR1cm4gZVtuXS5jYWxsKG8uZXhwb3J0cyxvLG8uZXhwb3J0cyxyKSxvLmxvYWRlZD0hMCxvLmV4cG9ydHN9dmFyIHQ9e307cmV0dXJuIHIubT1lLHIuYz10LHIucD1cIlwiLHIoMCl9KFtmdW5jdGlvbihlLHIsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG89dCgzKTtPYmplY3QuZGVmaW5lUHJvcGVydHkocixcImNvbmZvcm1Ub01hc2tcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbihvKS5kZWZhdWx0fX0pO3ZhciBpPXQoMik7T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJhZGp1c3RDYXJldFBvc2l0aW9uXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG4oaSkuZGVmYXVsdH19KTt2YXIgYT10KDUpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiY3JlYXRlVGV4dE1hc2tJbnB1dEVsZW1lbnRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbihhKS5kZWZhdWx0fX0pfSxmdW5jdGlvbihlLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHIucGxhY2Vob2xkZXJDaGFyPVwiX1wifSxmdW5jdGlvbihlLHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHQoZSl7dmFyIHI9ZS5wcmV2aW91c0NvbmZvcm1lZFZhbHVlLHQ9dm9pZCAwPT09cj9vOnIsaT1lLnByZXZpb3VzUGxhY2Vob2xkZXIsYT12b2lkIDA9PT1pP286aSx1PWUuY3VycmVudENhcmV0UG9zaXRpb24sbD12b2lkIDA9PT11PzA6dSxzPWUuY29uZm9ybWVkVmFsdWUsZj1lLnJhd1ZhbHVlLGQ9ZS5wbGFjZWhvbGRlckNoYXIsYz1lLnBsYWNlaG9sZGVyLHY9ZS5pbmRleGVzT2ZQaXBlZENoYXJzLHA9dm9pZCAwPT09dj9uOnYsaD1lLmNhcmV0VHJhcEluZGV4ZXMsZz12b2lkIDA9PT1oP246aDtpZigwPT09bClyZXR1cm4gMDt2YXIgbT1mLmxlbmd0aCx5PXQubGVuZ3RoLGI9Yy5sZW5ndGgsQz1zLmxlbmd0aCxQPW0teSx4PVA+MCxPPTA9PT15LGs9UD4xJiYheCYmIU87aWYoaylyZXR1cm4gbDt2YXIgaj14JiYodD09PXN8fHM9PT1jKSxNPTAsVD12b2lkIDAsdz12b2lkIDA7aWYoailNPWwtUDtlbHNle3ZhciBfPXMudG9Mb3dlckNhc2UoKSxWPWYudG9Mb3dlckNhc2UoKSxTPVYuc3Vic3RyKDAsbCkuc3BsaXQobyksTj1TLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gXy5pbmRleE9mKGUpIT09LTF9KTt3PU5bTi5sZW5ndGgtMV07dmFyIEU9YS5zdWJzdHIoMCxOLmxlbmd0aCkuc3BsaXQobykuZmlsdGVyKGZ1bmN0aW9uKGUpe3JldHVybiBlIT09ZH0pLmxlbmd0aCxBPWMuc3Vic3RyKDAsTi5sZW5ndGgpLnNwbGl0KG8pLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZSE9PWR9KS5sZW5ndGgsUj1BIT09RSxJPXZvaWQgMCE9PWFbTi5sZW5ndGgtMV0mJnZvaWQgMCE9PWNbTi5sZW5ndGgtMl0mJmFbTi5sZW5ndGgtMV0hPT1kJiZhW04ubGVuZ3RoLTFdIT09Y1tOLmxlbmd0aC0xXSYmYVtOLmxlbmd0aC0xXT09PWNbTi5sZW5ndGgtMl07IXgmJihSfHxJKSYmRT4wJiZjLmluZGV4T2Yodyk+LTEmJnZvaWQgMCE9PWZbbF0mJihUPSEwLHc9ZltsXSk7Zm9yKHZhciBKPXAubWFwKGZ1bmN0aW9uKGUpe3JldHVybiBfW2VdfSkscT1KLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZT09PXd9KS5sZW5ndGgsRj1OLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZT09PXd9KS5sZW5ndGgsTD1jLnN1YnN0cigwLGMuaW5kZXhPZihkKSkuc3BsaXQobykuZmlsdGVyKGZ1bmN0aW9uKGUscil7cmV0dXJuIGU9PT13JiZmW3JdIT09ZX0pLmxlbmd0aCxXPUwrRitxKyhUPzE6MCksej0wLEI9MDtCPEM7QisrKXt2YXIgRD1fW0JdO2lmKE09QisxLEQ9PT13JiZ6Kyssej49VylicmVha319aWYoeCl7Zm9yKHZhciBHPU0sSD1NO0g8PWI7SCsrKWlmKGNbSF09PT1kJiYoRz1IKSxjW0hdPT09ZHx8Zy5pbmRleE9mKEgpIT09LTF8fEg9PT1iKXJldHVybiBHfWVsc2UgaWYoVCl7Zm9yKHZhciBLPU0tMTtLPj0wO0stLSlpZihzW0tdPT09d3x8Zy5pbmRleE9mKEspIT09LTF8fDA9PT1LKXJldHVybiBLfWVsc2UgZm9yKHZhciBRPU07UT49MDtRLS0paWYoY1tRLTFdPT09ZHx8Zy5pbmRleE9mKFEpIT09LTF8fDA9PT1RKXJldHVybiBRfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHIuZGVmYXVsdD10O3ZhciBuPVtdLG89XCJcIn0sZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06YSxyPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTphLHQ9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOnt9LG49dC5ndWlkZSx1PXZvaWQgMD09PW58fG4sbD10LnByZXZpb3VzQ29uZm9ybWVkVmFsdWUscz12b2lkIDA9PT1sP2E6bCxmPXQucGxhY2Vob2xkZXJDaGFyLGQ9dm9pZCAwPT09Zj9pLnBsYWNlaG9sZGVyQ2hhcjpmLGM9dC5wbGFjZWhvbGRlcix2PXZvaWQgMD09PWM/KDAsby5jb252ZXJ0TWFza1RvUGxhY2Vob2xkZXIpKHIsZCk6YyxwPXQuY3VycmVudENhcmV0UG9zaXRpb24saD10LmtlZXBDaGFyUG9zaXRpb25zLGc9dT09PSExJiZ2b2lkIDAhPT1zLG09ZS5sZW5ndGgseT1zLmxlbmd0aCxiPXYubGVuZ3RoLEM9ci5sZW5ndGgsUD1tLXkseD1QPjAsTz1wKyh4Py1QOjApLGs9TytNYXRoLmFicyhQKTtpZihoPT09ITAmJiF4KXtmb3IodmFyIGo9YSxNPU87TTxrO00rKyl2W01dPT09ZCYmKGorPWQpO2U9ZS5zbGljZSgwLE8pK2orZS5zbGljZShPLG0pfWZvcih2YXIgVD1lLnNwbGl0KGEpLm1hcChmdW5jdGlvbihlLHIpe3JldHVybntjaGFyOmUsaXNOZXc6cj49TyYmcjxrfX0pLHc9bS0xO3c+PTA7dy0tKXt2YXIgXz1UW3ddLmNoYXI7aWYoXyE9PWQpe3ZhciBWPXc+PU8mJnk9PT1DO189PT12W1Y/dy1QOnddJiZULnNwbGljZSh3LDEpfX12YXIgUz1hLE49ITE7ZTpmb3IodmFyIEU9MDtFPGI7RSsrKXt2YXIgQT12W0VdO2lmKEE9PT1kKXtpZihULmxlbmd0aD4wKWZvcig7VC5sZW5ndGg+MDspe3ZhciBSPVQuc2hpZnQoKSxJPVIuY2hhcixKPVIuaXNOZXc7aWYoST09PWQmJmchPT0hMCl7Uys9ZDtjb250aW51ZSBlfWlmKHJbRV0udGVzdChJKSl7aWYoaD09PSEwJiZKIT09ITEmJnMhPT1hJiZ1IT09ITEmJngpe2Zvcih2YXIgcT1ULmxlbmd0aCxGPW51bGwsTD0wO0w8cTtMKyspe3ZhciBXPVRbTF07aWYoVy5jaGFyIT09ZCYmVy5pc05ldz09PSExKWJyZWFrO2lmKFcuY2hhcj09PWQpe0Y9TDticmVha319bnVsbCE9PUY/KFMrPUksVC5zcGxpY2UoRiwxKSk6RS0tfWVsc2UgUys9STtjb250aW51ZSBlfU49ITB9Zz09PSExJiYoUys9di5zdWJzdHIoRSxiKSk7YnJlYWt9Uys9QX1pZihnJiZ4PT09ITEpe2Zvcih2YXIgej1udWxsLEI9MDtCPFMubGVuZ3RoO0IrKyl2W0JdPT09ZCYmKHo9Qik7Uz1udWxsIT09ej9TLnN1YnN0cigwLHorMSk6YX1yZXR1cm57Y29uZm9ybWVkVmFsdWU6UyxtZXRhOntzb21lQ2hhcnNSZWplY3RlZDpOfX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksci5kZWZhdWx0PW47dmFyIG89dCg0KSxpPXQoMSksYT1cIlwifSxmdW5jdGlvbihlLHIsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpsLHI9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOnUucGxhY2Vob2xkZXJDaGFyO2lmKGUuaW5kZXhPZihyKSE9PS0xKXRocm93IG5ldyBFcnJvcihcIlBsYWNlaG9sZGVyIGNoYXJhY3RlciBtdXN0IG5vdCBiZSB1c2VkIGFzIHBhcnQgb2YgdGhlIG1hc2suIFBsZWFzZSBzcGVjaWZ5IGEgY2hhcmFjdGVyIHRoYXQgaXMgbm90IHByZXNlbnQgaW4geW91ciBtYXNrIGFzIHlvdXIgcGxhY2Vob2xkZXIgY2hhcmFjdGVyLlxcblxcblwiKyhcIlRoZSBwbGFjZWhvbGRlciBjaGFyYWN0ZXIgdGhhdCB3YXMgcmVjZWl2ZWQgaXM6IFwiK0pTT04uc3RyaW5naWZ5KHIpK1wiXFxuXFxuXCIpKyhcIlRoZSBtYXNrIHRoYXQgd2FzIHJlY2VpdmVkIGlzOiBcIitKU09OLnN0cmluZ2lmeShlKSkpO3JldHVybiBlLm1hcChmdW5jdGlvbihlKXtyZXR1cm4gZSBpbnN0YW5jZW9mIFJlZ0V4cD9yOmV9KS5qb2luKFwiXCIpfWZ1bmN0aW9uIG8oZSl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGV8fGUgaW5zdGFuY2VvZiBTdHJpbmd9ZnVuY3Rpb24gaShlKXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgZSYmdm9pZCAwPT09ZS5sZW5ndGgmJiFpc05hTihlKX1mdW5jdGlvbiBhKGUpe2Zvcih2YXIgcj1bXSx0PXZvaWQgMDt0PWUuaW5kZXhPZihzKSx0IT09LTE7KXIucHVzaCh0KSxlLnNwbGljZSh0LDEpO3JldHVybnttYXNrV2l0aG91dENhcmV0VHJhcHM6ZSxpbmRleGVzOnJ9fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHIuY29udmVydE1hc2tUb1BsYWNlaG9sZGVyPW4sci5pc1N0cmluZz1vLHIuaXNOdW1iZXI9aSxyLnByb2Nlc3NDYXJldFRyYXBzPWE7dmFyIHU9dCgxKSxsPVtdLHM9XCJbXVwifSxmdW5jdGlvbihlLHIsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZX19ZnVuY3Rpb24gbyhlKXt2YXIgcj17cHJldmlvdXNDb25mb3JtZWRWYWx1ZTp2b2lkIDAscHJldmlvdXNQbGFjZWhvbGRlcjp2b2lkIDB9O3JldHVybntzdGF0ZTpyLHVwZGF0ZTpmdW5jdGlvbih0KXt2YXIgbj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06ZSxvPW4uaW5wdXRFbGVtZW50LHM9bi5tYXNrLGQ9bi5ndWlkZSxtPW4ucGlwZSxiPW4ucGxhY2Vob2xkZXJDaGFyLEM9dm9pZCAwPT09Yj9wLnBsYWNlaG9sZGVyQ2hhcjpiLFA9bi5rZWVwQ2hhclBvc2l0aW9ucyx4PXZvaWQgMCE9PVAmJlAsTz1uLnNob3dNYXNrLGs9dm9pZCAwIT09TyYmTztpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgdCYmKHQ9by52YWx1ZSksdCE9PXIucHJldmlvdXNDb25mb3JtZWRWYWx1ZSl7KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBzP1widW5kZWZpbmVkXCI6bChzKSk9PT15JiZ2b2lkIDAhPT1zLnBpcGUmJnZvaWQgMCE9PXMubWFzayYmKG09cy5waXBlLHM9cy5tYXNrKTt2YXIgaj12b2lkIDAsTT12b2lkIDA7aWYocyBpbnN0YW5jZW9mIEFycmF5JiYoaj0oMCx2LmNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcikocyxDKSkscyE9PSExKXt2YXIgVD1hKHQpLHc9by5zZWxlY3Rpb25FbmQsXz1yLnByZXZpb3VzQ29uZm9ybWVkVmFsdWUsVj1yLnByZXZpb3VzUGxhY2Vob2xkZXIsUz12b2lkIDA7aWYoKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBzP1widW5kZWZpbmVkXCI6bChzKSk9PT1oKXtpZihNPXMoVCx7Y3VycmVudENhcmV0UG9zaXRpb246dyxwcmV2aW91c0NvbmZvcm1lZFZhbHVlOl8scGxhY2Vob2xkZXJDaGFyOkN9KSxNPT09ITEpcmV0dXJuO3ZhciBOPSgwLHYucHJvY2Vzc0NhcmV0VHJhcHMpKE0pLEU9Ti5tYXNrV2l0aG91dENhcmV0VHJhcHMsQT1OLmluZGV4ZXM7TT1FLFM9QSxqPSgwLHYuY29udmVydE1hc2tUb1BsYWNlaG9sZGVyKShNLEMpfWVsc2UgTT1zO3ZhciBSPXtwcmV2aW91c0NvbmZvcm1lZFZhbHVlOl8sZ3VpZGU6ZCxwbGFjZWhvbGRlckNoYXI6QyxwaXBlOm0scGxhY2Vob2xkZXI6aixjdXJyZW50Q2FyZXRQb3NpdGlvbjp3LGtlZXBDaGFyUG9zaXRpb25zOnh9LEk9KDAsYy5kZWZhdWx0KShULE0sUiksSj1JLmNvbmZvcm1lZFZhbHVlLHE9KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBtP1widW5kZWZpbmVkXCI6bChtKSk9PT1oLEY9e307cSYmKEY9bShKLHUoe3Jhd1ZhbHVlOlR9LFIpKSxGPT09ITE/Rj17dmFsdWU6XyxyZWplY3RlZDohMH06KDAsdi5pc1N0cmluZykoRikmJihGPXt2YWx1ZTpGfSkpO3ZhciBMPXE/Ri52YWx1ZTpKLFc9KDAsZi5kZWZhdWx0KSh7cHJldmlvdXNDb25mb3JtZWRWYWx1ZTpfLHByZXZpb3VzUGxhY2Vob2xkZXI6Vixjb25mb3JtZWRWYWx1ZTpMLHBsYWNlaG9sZGVyOmoscmF3VmFsdWU6VCxjdXJyZW50Q2FyZXRQb3NpdGlvbjp3LHBsYWNlaG9sZGVyQ2hhcjpDLGluZGV4ZXNPZlBpcGVkQ2hhcnM6Ri5pbmRleGVzT2ZQaXBlZENoYXJzLGNhcmV0VHJhcEluZGV4ZXM6U30pLHo9TD09PWomJjA9PT1XLEI9az9qOmcsRD16P0I6TDtyLnByZXZpb3VzQ29uZm9ybWVkVmFsdWU9RCxyLnByZXZpb3VzUGxhY2Vob2xkZXI9aixvLnZhbHVlIT09RCYmKG8udmFsdWU9RCxpKG8sVykpfX19fX1mdW5jdGlvbiBpKGUscil7ZG9jdW1lbnQuYWN0aXZlRWxlbWVudD09PWUmJihiP0MoZnVuY3Rpb24oKXtyZXR1cm4gZS5zZXRTZWxlY3Rpb25SYW5nZShyLHIsbSl9LDApOmUuc2V0U2VsZWN0aW9uUmFuZ2UocixyLG0pKX1mdW5jdGlvbiBhKGUpe2lmKCgwLHYuaXNTdHJpbmcpKGUpKXJldHVybiBlO2lmKCgwLHYuaXNOdW1iZXIpKGUpKXJldHVybiBTdHJpbmcoZSk7aWYodm9pZCAwPT09ZXx8bnVsbD09PWUpcmV0dXJuIGc7dGhyb3cgbmV3IEVycm9yKFwiVGhlICd2YWx1ZScgcHJvdmlkZWQgdG8gVGV4dCBNYXNrIG5lZWRzIHRvIGJlIGEgc3RyaW5nIG9yIGEgbnVtYmVyLiBUaGUgdmFsdWUgcmVjZWl2ZWQgd2FzOlxcblxcbiBcIitKU09OLnN0cmluZ2lmeShlKSl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHU9T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24oZSl7Zm9yKHZhciByPTE7cjxhcmd1bWVudHMubGVuZ3RoO3IrKyl7dmFyIHQ9YXJndW1lbnRzW3JdO2Zvcih2YXIgbiBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pJiYoZVtuXT10W25dKX1yZXR1cm4gZX0sbD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24oZSl7cmV0dXJuIHR5cGVvZiBlfTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiBlfTtyLmRlZmF1bHQ9bzt2YXIgcz10KDIpLGY9bihzKSxkPXQoMyksYz1uKGQpLHY9dCg0KSxwPXQoMSksaD1cImZ1bmN0aW9uXCIsZz1cIlwiLG09XCJub25lXCIseT1cIm9iamVjdFwiLGI9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG5hdmlnYXRvciYmL0FuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLEM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZT9yZXF1ZXN0QW5pbWF0aW9uRnJhbWU6c2V0VGltZW91dH1dKX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUl1TGk5dWIyUmxYMjF2WkhWc1pYTXZkR1Y0ZEMxdFlYTnJMV052Y21VdlpHbHpkQzkwWlhoMFRXRnphME52Y21VdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXMTE5IiwiIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9dCgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW10sdCk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/ZXhwb3J0cy50ZXh0TWFza0FkZG9ucz10KCk6ZS50ZXh0TWFza0FkZG9ucz10KCl9KHRoaXMsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdChyKXtpZihuW3JdKXJldHVybiBuW3JdLmV4cG9ydHM7dmFyIG89bltyXT17ZXhwb3J0czp7fSxpZDpyLGxvYWRlZDohMX07cmV0dXJuIGVbcl0uY2FsbChvLmV4cG9ydHMsbyxvLmV4cG9ydHMsdCksby5sb2FkZWQ9ITAsby5leHBvcnRzfXZhciBuPXt9O3JldHVybiB0Lm09ZSx0LmM9bix0LnA9XCJcIix0KDApfShbZnVuY3Rpb24oZSx0LG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIoZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntkZWZhdWx0OmV9fU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBvPW4oMSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJjcmVhdGVBdXRvQ29ycmVjdGVkRGF0ZVBpcGVcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcihvKS5kZWZhdWx0fX0pO3ZhciBpPW4oMik7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJjcmVhdGVOdW1iZXJNYXNrXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHIoaSkuZGVmYXVsdH19KTt2YXIgdT1uKDMpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiZW1haWxNYXNrXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHIodSkuZGVmYXVsdH19KX0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOlwibW0gZGQgeXl5eVwiO3JldHVybiBmdW5jdGlvbih0KXt2YXIgbj1bXSxyPWUuc3BsaXQoL1teZG15XSsvKSxvPXtkZDozMSxtbToxMix5eTo5OSx5eXl5Ojk5OTl9LGk9e2RkOjEsbW06MSx5eTowLHl5eXk6MX0sdT10LnNwbGl0KFwiXCIpO3IuZm9yRWFjaChmdW5jdGlvbih0KXt2YXIgcj1lLmluZGV4T2YodCksaT1wYXJzZUludChvW3RdLnRvU3RyaW5nKCkuc3Vic3RyKDAsMSksMTApO3BhcnNlSW50KHVbcl0sMTApPmkmJih1W3IrMV09dVtyXSx1W3JdPTAsbi5wdXNoKHIpKX0pO3ZhciBjPXIuc29tZShmdW5jdGlvbihuKXt2YXIgcj1lLmluZGV4T2YobiksdT1uLmxlbmd0aCxjPXQuc3Vic3RyKHIsdSkucmVwbGFjZSgvXFxEL2csXCJcIiksbD1wYXJzZUludChjLDEwKTtyZXR1cm4gbD5vW25dfHxjLmxlbmd0aD09PXUmJmw8aVtuXX0pO3JldHVybiFjJiZ7dmFsdWU6dS5qb2luKFwiXCIpLGluZGV4ZXNPZlBpcGVkQ2hhcnM6bn19fU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuZGVmYXVsdD1ufSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oKXtmdW5jdGlvbiBlKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOmMsdD1lLmxlbmd0aDtpZihlPT09Y3x8ZVswXT09PWhbMF0mJjE9PT10KXJldHVybiBoLnNwbGl0KGMpLmNvbmNhdChbdl0pLmNvbmNhdChtLnNwbGl0KGMpKTtpZihlPT09UyYmTSlyZXR1cm4gaC5zcGxpdChjKS5jb25jYXQoW1wiMFwiLFMsdl0pLmNvbmNhdChtLnNwbGl0KGMpKTt2YXIgbj1lLmxhc3RJbmRleE9mKFMpLHU9biE9PS0xLGw9ZVswXT09PXMmJkksYT12b2lkIDAsZz12b2lkIDAsYj12b2lkIDA7aWYoZS5zbGljZShWKi0xKT09PW0mJihlPWUuc2xpY2UoMCxWKi0xKSksdSYmKE18fEQpPyhhPWUuc2xpY2UoZS5zbGljZSgwLCQpPT09aD8kOjAsbiksZz1lLnNsaWNlKG4rMSx0KSxnPXIoZy5yZXBsYWNlKGYsYykpKTphPWUuc2xpY2UoMCwkKT09PWg/ZS5zbGljZSgkKTplLE4mJihcInVuZGVmaW5lZFwiPT10eXBlb2YgTj9cInVuZGVmaW5lZFwiOmkoTikpPT09cCl7dmFyIE89XCIuXCI9PT1fP1wiWy5dXCI6XCJcIitfLGo9KGEubWF0Y2gobmV3IFJlZ0V4cChPLFwiZ1wiKSl8fFtdKS5sZW5ndGg7YT1hLnNsaWNlKDAsTitqKnEpfXJldHVybiBhPWEucmVwbGFjZShmLGMpLEF8fChhPWEucmVwbGFjZSgvXjArKDAkfFteMF0pLyxcIiQxXCIpKSxhPXg/byhhLF8pOmEsYj1yKGEpLCh1JiZNfHxEPT09ITApJiYoZVtuLTFdIT09UyYmYi5wdXNoKHkpLGIucHVzaChTLHkpLGcmJigoXCJ1bmRlZmluZWRcIj09dHlwZW9mIEM/XCJ1bmRlZmluZWRcIjppKEMpKT09PXAmJihnPWcuc2xpY2UoMCxDKSksYj1iLmNvbmNhdChnKSksRD09PSEwJiZlW24tMV09PT1TJiZiLnB1c2godikpLCQ+MCYmKGI9aC5zcGxpdChjKS5jb25jYXQoYikpLGwmJihiLmxlbmd0aD09PSQmJmIucHVzaCh2KSxiPVtkXS5jb25jYXQoYikpLG0ubGVuZ3RoPjAmJihiPWIuY29uY2F0KG0uc3BsaXQoYykpKSxifXZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTp7fSxuPXQucHJlZml4LGg9dm9pZCAwPT09bj91Om4sZz10LnN1ZmZpeCxtPXZvaWQgMD09PWc/YzpnLGI9dC5pbmNsdWRlVGhvdXNhbmRzU2VwYXJhdG9yLHg9dm9pZCAwPT09Ynx8YixPPXQudGhvdXNhbmRzU2VwYXJhdG9yU3ltYm9sLF89dm9pZCAwPT09Tz9sOk8saj10LmFsbG93RGVjaW1hbCxNPXZvaWQgMCE9PWomJmosUD10LmRlY2ltYWxTeW1ib2wsUz12b2lkIDA9PT1QP2E6UCx3PXQuZGVjaW1hbExpbWl0LEM9dm9pZCAwPT09dz8yOncsaz10LnJlcXVpcmVEZWNpbWFsLEQ9dm9pZCAwIT09ayYmayxFPXQuYWxsb3dOZWdhdGl2ZSxJPXZvaWQgMCE9PUUmJkUsUj10LmFsbG93TGVhZGluZ1plcm9lcyxBPXZvaWQgMCE9PVImJlIsTD10LmludGVnZXJMaW1pdCxOPXZvaWQgMD09PUw/bnVsbDpMLCQ9aCYmaC5sZW5ndGh8fDAsVj1tJiZtLmxlbmd0aHx8MCxxPV8mJl8ubGVuZ3RofHwwO3JldHVybiBlLmluc3RhbmNlT2Y9XCJjcmVhdGVOdW1iZXJNYXNrXCIsZX1mdW5jdGlvbiByKGUpe3JldHVybiBlLnNwbGl0KGMpLm1hcChmdW5jdGlvbihlKXtyZXR1cm4gdi50ZXN0KGUpP3Y6ZX0pfWZ1bmN0aW9uIG8oZSx0KXtyZXR1cm4gZS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBpPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbihlKXtyZXR1cm4gdHlwZW9mIGV9OmZ1bmN0aW9uKGUpe3JldHVybiBlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJmUuY29uc3RydWN0b3I9PT1TeW1ib2wmJmUhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIGV9O3QuZGVmYXVsdD1uO3ZhciB1PVwiJFwiLGM9XCJcIixsPVwiLFwiLGE9XCIuXCIscz1cIi1cIixkPS8tLyxmPS9cXEQrL2cscD1cIm51bWJlclwiLHY9L1xcZC8seT1cIltdXCJ9LGZ1bmN0aW9uKGUsdCxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKGUpe3JldHVybiBlJiZlLl9fZXNNb2R1bGU/ZTp7ZGVmYXVsdDplfX1mdW5jdGlvbiBvKGUsdCl7ZT1lLnJlcGxhY2UoTyx2KTt2YXIgbj10LnBsYWNlaG9sZGVyQ2hhcixyPXQuY3VycmVudENhcmV0UG9zaXRpb24sbz1lLmluZGV4T2YoeSkscz1lLmxhc3RJbmRleE9mKHApLGQ9czxvPy0xOnMsZj1pKGUsbysxLHkpLGg9aShlLGQtMSxwKSxnPXUoZSxvLG4pLG09YyhlLG8sZCxuKSxiPWwoZSxkLG4scik7Zz1hKGcpLG09YShtKSxiPWEoYiwhMCk7dmFyIHg9Zy5jb25jYXQoZikuY29uY2F0KG0pLmNvbmNhdChoKS5jb25jYXQoYik7cmV0dXJuIHh9ZnVuY3Rpb24gaShlLHQsbil7dmFyIHI9W107cmV0dXJuIGVbdF09PT1uP3IucHVzaChuKTpyLnB1c2goaCxuKSxyLnB1c2goaCkscn1mdW5jdGlvbiB1KGUsdCl7cmV0dXJuIHQ9PT0tMT9lOmUuc2xpY2UoMCx0KX1mdW5jdGlvbiBjKGUsdCxuLHIpe3ZhciBvPXY7cmV0dXJuIHQhPT0tMSYmKG89bj09PS0xP2Uuc2xpY2UodCsxLGUubGVuZ3RoKTplLnNsaWNlKHQrMSxuKSksbz1vLnJlcGxhY2UobmV3IFJlZ0V4cChcIltcXFxcc1wiK3IrXCJdXCIsbSksdiksbz09PXk/ZjpvLmxlbmd0aDwxP2c6b1tvLmxlbmd0aC0xXT09PXA/by5zbGljZSgwLG8ubGVuZ3RoLTEpOm99ZnVuY3Rpb24gbChlLHQsbixyKXt2YXIgbz12O3JldHVybiB0IT09LTEmJihvPWUuc2xpY2UodCsxLGUubGVuZ3RoKSksbz1vLnJlcGxhY2UobmV3IFJlZ0V4cChcIltcXFxcc1wiK24rXCIuXVwiLG0pLHYpLDA9PT1vLmxlbmd0aD9lW3QtMV09PT1wJiZyIT09ZS5sZW5ndGg/Zjp2Om99ZnVuY3Rpb24gYShlLHQpe3JldHVybiBlLnNwbGl0KHYpLm1hcChmdW5jdGlvbihlKXtyZXR1cm4gZT09PWc/ZTp0P3g6Yn0pfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBzPW4oNCksZD1yKHMpLGY9XCIqXCIscD1cIi5cIix2PVwiXCIseT1cIkBcIixoPVwiW11cIixnPVwiIFwiLG09XCJnXCIsYj0vW15cXHNdLyx4PS9bXi5cXHNdLyxPPS9cXHMvZzt0LmRlZmF1bHQ9e21hc2s6byxwaXBlOmQuZGVmYXVsdH19LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbihlLHQpe3ZhciBuPXQuY3VycmVudENhcmV0UG9zaXRpb24saT10LnJhd1ZhbHVlLGY9dC5wcmV2aW91c0NvbmZvcm1lZFZhbHVlLHA9dC5wbGFjZWhvbGRlckNoYXIsdj1lO3Y9cih2KTt2YXIgeT12LmluZGV4T2YoYyksaD1udWxsPT09aS5tYXRjaChuZXcgUmVnRXhwKFwiW15AXFxcXHMuXCIrcCtcIl1cIikpO2lmKGgpcmV0dXJuIHU7aWYodi5pbmRleE9mKGEpIT09LTF8fHkhPT0tMSYmbiE9PXkrMXx8aS5pbmRleE9mKG8pPT09LTEmJmYhPT11JiZpLmluZGV4T2YobCkhPT0tMSlyZXR1cm4hMTt2YXIgZz12LmluZGV4T2YobyksbT12LnNsaWNlKGcrMSx2Lmxlbmd0aCk7cmV0dXJuKG0ubWF0Y2goZCl8fHMpLmxlbmd0aD4xJiZ2LnN1YnN0cigtMSk9PT1sJiZuIT09aS5sZW5ndGgmJih2PXYuc2xpY2UoMCx2Lmxlbmd0aC0xKSksdn1mdW5jdGlvbiByKGUpe3ZhciB0PTA7cmV0dXJuIGUucmVwbGFjZShpLGZ1bmN0aW9uKCl7cmV0dXJuIHQrKywxPT09dD9vOnV9KX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0LmRlZmF1bHQ9bjt2YXIgbz1cIkBcIixpPS9AL2csdT1cIlwiLGM9XCJALlwiLGw9XCIuXCIsYT1cIi4uXCIscz1bXSxkPS9cXC4vZ31dKX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUl1TGk5dWIyUmxYMjF2WkhWc1pYTXZkR1Y0ZEMxdFlYTnJMV0ZrWkc5dWN5OWthWE4wTDNSbGVIUk5ZWE5yUVdSa2IyNXpMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVkOiAnI2NjNDgyMCcsXG4gIGdyZWVuOiAnIzcyYzMyMicsXG4gIG9yYW5nZTogJyNmZjljMDAnLFxuICBibGFjazogJyMxODE4MTgnLFxuICBncmV5X2Rhcms6ICcjNWU1ZTVlJyxcbiAgZ3JleTogJyM5MDkwOTAnLFxuICBncmV5X3NlbWlfbGlnaHQ6ICcjYmViZWJlJyxcbiAgZ3JleV9saWdodDogJyNkM2QzZDMnLFxuICBncmV5X2xpZ2h0MjogJyNkZGRkZGQnLFxuICBncmV5X2xpZ2h0MzogJyNmMmY1ZjcnLFxuICBncmV5X2xpZ2h0NDogJyNlNWU1ZTUnXG59O1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKamIyNXpkR0Z1ZEhNdlkyOXNiM0p6TG1OdlptWmxaU0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiWFgwPSIsInZhciBTdGF0ZUNoYWluO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRlQ2hhaW4gPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFN0YXRlQ2hhaW4oc3RhdGVzKSB7XG4gICAgdGhpcy5zdHJpbmcgPSBzdGF0ZXMuam9pbignKycpO1xuICAgIHRoaXMuYXJyYXkgPSBzdGF0ZXMuc2xpY2UoKTtcbiAgICB0aGlzLmxlbmd0aCA9IHN0YXRlcy5sZW5ndGg7XG4gIH1cblxuICBTdGF0ZUNoYWluLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgIHZhciBpLCBsZW4sIHJlZiwgc3RhdGU7XG4gICAgcmVmID0gdGhpcy5hcnJheTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0YXRlID0gcmVmW2ldO1xuICAgICAgaWYgKHN0YXRlID09PSB0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBTdGF0ZUNoYWluLnByb3RvdHlwZS53aXRob3V0ID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICByZXR1cm4gc3RhdGUgIT09IHRhcmdldDtcbiAgICB9KS5qb2luKCcrJyk7XG4gIH07XG5cbiAgU3RhdGVDaGFpbi5wcm90b3R5cGUuaXNBcHBsaWNhYmxlID0gZnVuY3Rpb24odGFyZ2V0LCBvdGhlckFjdGl2ZSkge1xuICAgIHZhciBhY3RpdmU7XG4gICAgYWN0aXZlID0gdGhpcy5hcnJheS5maWx0ZXIoZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZSA9PT0gdGFyZ2V0IHx8IG90aGVyQWN0aXZlLmluZGV4T2Yoc3RhdGUpICE9PSAtMTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWN0aXZlLmxlbmd0aCA9PT0gdGhpcy5hcnJheS5sZW5ndGg7XG4gIH07XG5cbiAgcmV0dXJuIFN0YXRlQ2hhaW47XG5cbn0pKCk7XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUl1TGk5dWIyUmxYMjF2WkhWc1pYTXZjWFZwWTJ0a2IyMHZjM0pqTDNCaGNuUnpMMlZzWlcxbGJuUXZjM1JoZEdWRGFHRnBiaTVqYjJabVpXVWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXMTE5IiwiZXhwb3J0cy5jaGVja21hcmsgPSBpbXBvcnQgJy4vY2hlY2ttYXJrJ1xuZXhwb3J0cy5hbmdsZURvd24gPSBpbXBvcnQgJy4vYW5nbGVEb3duJ1xuZXhwb3J0cy5jYXJldFVwID0gaW1wb3J0ICcuL2NhcmV0VXAnXG5leHBvcnRzLmNhcmV0RG93biA9IGltcG9ydCAnLi9jYXJldERvd24nXG5leHBvcnRzLnBsdXMgPSBpbXBvcnQgJy4vcGx1cydcbmV4cG9ydHMuY2xvbmUgPSBpbXBvcnQgJy4vY2xvbmUnXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0d2lkdGg6ICcxMnB4J1xuXHRcdFx0aGVpZ2h0OiAnMTJweCdcblx0XHRcdHZpZXdCb3g6ICc1IDcgMTIgMTInXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnOXB4J1xuXHRcdFx0aGVpZ2h0OiAnOXB4J1xuXG5cblx0XHRbJypwb2x5bGluZScsIHtcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogJzInXG5cdFx0XHRcdCdzdHJva2UtbGluZWNhcCc6ICdyb3VuZCdcblx0XHRcdFx0J3N0cm9rZS1saW5lam9pbic6ICdyb3VuZCdcblx0XHRcdFx0ZmlsbDogJ25vbmUnXG5cdFx0XHRcdHBvaW50czogJzcgMTMuODg4ODg4OSA5LjY2NjY2NjY3IDE3IDE1IDknXG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0fV1cblx0XVxuKVxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NLnRlbXBsYXRlKFxuXHRbJypzdmcnXG5cdFx0YXR0cnM6XG5cdFx0XHR3aWR0aDogJzE3OTJweCdcblx0XHRcdGhlaWdodDogJzE3OTJweCdcblx0XHRcdHZpZXdCb3g6ICcwIDAgMTc5MiAxNzkyJ1xuXHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJ1xuXHRcdFx0b3V0bGluZTogJ25vbmUnXG5cblx0XHRbJypwYXRoJ1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0XHRcdGQ6ICdNMTM5NSA3MzZxMCAxMy0xMCAyM2wtNDY2IDQ2NnEtMTAgMTAtMjMgMTB0LTIzLTEwbC00NjYtNDY2cS0xMC0xMC0xMC0yM3QxMC0yM2w1MC01MHExMC0xMCAyMy0xMHQyMyAxMGwzOTMgMzkzIDM5My0zOTNxMTAtMTAgMjMtMTB0MjMgMTBsNTAgNTBxMTAgMTAgMTAgMjN6J1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NLnRlbXBsYXRlKFxuXHRbJypzdmcnXG5cdFx0YXR0cnM6XG5cdFx0XHR2aWV3Qm94OiAnMCAwIDUxMiA1MTInXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBhdGgnXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0ZDogJ000MDIgMzQ3YzAgNS0yIDEwLTUgMTMtNCA0LTggNi0xMyA2aC0yNTZjLTUgMC05LTItMTMtNi0zLTMtNS04LTUtMTNzMi05IDUtMTJsMTI4LTEyOGM0LTQgOC02IDEzLTZzOSAyIDEzIDZsMTI4IDEyOGMzIDMgNSA3IDUgMTJ6J1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHZpZXdCb3g6ICcwIDAgNTEyIDUxMidcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTQwMiAyMDFjMCA1LTIgOS01IDEzbC0xMjggMTI4Yy00IDQtOCA1LTEzIDVzLTktMS0xMy01bC0xMjgtMTI4Yy0zLTQtNS04LTUtMTNzMi05IDUtMTNjNC0zIDgtNSAxMy01aDI1NmM1IDAgOSAyIDEzIDUgMyA0IDUgOCA1IDEzeidcblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0dmlld0JveDogJzAgMCAxNSAxNSdcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcG9seWdvbidcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRwb2ludHM6ICc5IDAgNiAwIDYgNiAwIDYgMCA5IDYgOSA2IDE1IDkgMTUgOSA5IDE1IDkgMTUgNiA5IDYnXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0dmlld0JveDogJzAgMCAxOCAyMCdcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTEzLjQxNCwwIEw2LDAgQzQuODk3LDAgNCwwLjg5OCA0LDIgTDQsMTQgQzQsMTUuMTAzIDQuODk3LDE2IDYsMTYgTDE2LDE2IEMxNy4xMDMsMTYgMTgsMTUuMTAzIDE4LDE0IEwxOCw0LjU4NiBMMTMuNDE0LDAgWiBNMTYuMDAxLDE0IEw2LDE0IEw2LDIgTDEyLDIgTDEyLDYgTDE2LDYgTDE2LjAwMSwxNCBaJ1xuXHRcdF1cblx0XHRcblx0XHRbJypwYXRoJ1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0XHRcdGQ6ICdNMiw2LjQyMzc5MjgyIEwwLDYuNDIzNzkyODIgTDAsMTggQzAsMTkuMTAzIDAuODk3LDIwIDIsMjAgTDE0LDIwIEwxNCwxOCBMMiwxOCBMMiw2LjQyMzc5MjgyIFonXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuXG4iXX0=