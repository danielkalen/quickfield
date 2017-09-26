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
  builder.version = "1.0.66";
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSIsImNvbnNvbGVQYXRjaC5jb2ZmZWUiLCIuLi9wYWNrYWdlLmpzb24iLCJoZWxwZXJzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvaW5kZXguY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvYWxsb3dlZE9wdGlvbnMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvaGVscGVycy5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9jaGVja3MuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy93aW5kb3cuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvbWVkaWFRdWVyeS5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9iYXRjaC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy90ZW1wbGF0ZS9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9zaG9ydGN1dHMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9wYWNrYWdlLmpzb24iLCJjaGVja3MuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3NtYXJ0LWV4dGVuZC9zcmMvaW5kZXguY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3NtYXJ0LWV4dGVuZC9ub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3BhY2thZ2UuanNvbiIsImFuaW1hdGlvbnMuY29mZmVlIiwiY29uc3RhbnRzL3JlcUZpZWxkTWV0aG9kcy5jb2ZmZWUiLCJmaWVsZC9pbmRleC5jb2ZmZWUiLCJmaWVsZC9maWVsZC90cmFuc2Zvcm1TZXR0aW5ncy5jb2ZmZWUiLCJmaWVsZC90ZXh0L19pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL19pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9TaW1wbHlCaW5kL19pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nL19pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL2luZGV4LmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL0dyb3VwQmluZGluZy9faW5kZXguY29mZmVlIiwiY29uc3RhbnRzL3JlZ2V4LmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9ub2RlX21vZHVsZXMvcXVpY2tjc3Mvc3JjL2luZGV4LmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9ub2RlX21vZHVsZXMvcXVpY2tjc3Mvbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9wYWNrYWdlLmpzb24iLCIuLi9ub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL2lzL3NyYy9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3NyYy9leHRlbmQuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrY3NzL3NyYy9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tjc3Mvbm9kZV9tb2R1bGVzL3F1aWNrY3NzL3BhY2thZ2UuanNvbiIsIi4uL25vZGVfbW9kdWxlcy9mYXN0ZG9tL2Zhc3Rkb20uanMiLCJjb21wb25lbnRzL2NvbmRpdGlvbi5jb2ZmZWUiLCJmaWVsZC9nbG9iYWxEZWZhdWx0cy5jb2ZmZWUiLCJjb21wb25lbnRzL2Ryb3Bkb3duL2luZGV4LmNvZmZlZSIsImNvbXBvbmVudHMvbWFzay5jb2ZmZWUiLCJjb25zdGFudHMva2V5Q29kZXMuY29mZmVlIiwiZmllbGQvdGV4dC90ZW1wbGF0ZS5jb2ZmZWUiLCJmaWVsZC90ZXh0L2RlZmF1bHRzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9ub2RlX21vZHVsZXMvcXVpY2tjc3Mvc3JjL2NvbnN0YW50cy5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrY3NzL3NyYy9oZWxwZXJzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vaXMvc3JjL25hdGl2ZXMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9pcy9zcmMvZG9tLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvY29uc3RhbnRzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvaGVscGVycy5jb2ZmZWUiLCJjb21wb25lbnRzL2Ryb3Bkb3duL3RlbXBsYXRlLmNvZmZlZSIsImNvbXBvbmVudHMvZHJvcGRvd24vZGVmYXVsdHMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3RleHQtbWFzay1jb3JlL2Rpc3QvdGV4dE1hc2tDb3JlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3RleHQtbWFzay1hZGRvbnMvZGlzdC90ZXh0TWFza0FkZG9ucy5qcyIsImNvbnN0YW50cy9jb2xvcnMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9lbGVtZW50L3N0YXRlQ2hhaW4uY29mZmVlIiwic3ZnL19pbmRleC5jb2ZmZWUiLCJzdmcvY2hlY2ttYXJrLmNvZmZlZSIsInN2Zy9hbmdsZURvd24uY29mZmVlIiwic3ZnL2NhcmV0VXAuY29mZmVlIiwic3ZnL2NhcmV0RG93bi5jb2ZmZWUiLCJzdmcvcGx1cy5jb2ZmZWUiLCJzdmcvY2xvbmUuY29mZmVlIl0sIm5hbWVzIjpbImltcG9ydDoxIiwiaW1wb3J0OjIiLCJpbXBvcnQ6MyIsImltcG9ydDo0IiwiaW1wb3J0OjUiLCJpbXBvcnQ6NiIsImlubGluZToxIiwiaW1wb3J0OjkiLCJpbXBvcnQ6MTAiLCJpbmxpbmU6MiIsImlubGluZTozIiwiaW5saW5lOjQiLCJpbmxpbmU6NSIsImlubGluZTo2IiwiaW5saW5lOjciLCJpbmxpbmU6OCIsImlubGluZTo5IiwiaW5saW5lOjEwIiwiaW1wb3J0OjgiLCJpbXBvcnQ6NyIsImltcG9ydDoxMSIsImltcG9ydDoxMiIsImV4cG9ydDoxIiwiZXhwb3J0OjIiLCJleHBvcnQ6MyIsImV4cG9ydDo0IiwiZXhwb3J0OjUiLCJleHBvcnQ6NiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O1VBSUVBLFVBQWtCQTs7TUFBU0MsVUFDMUJBOztLQUFRQyxVQUFpQkE7O1NBQVlDLFVBQXFCQTs7cUJBQ3RDQyxVQUdMQTs7eUJBQTRCQyxVQUV6Q0E7O0FDWExDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUsyQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJENkYyWkMsVUFBZ0JBOzs7Ozs7NEJBQWdGQyxXQUFxQkE7Ozs7Ozs7Ozs7Ozs7b0JFbEczaUJDLFFBdUZFQTs7Ozs7Ozs7Ozs7Ozs7OztLQ3JGRlQsVUFBaUJBOztNQUFTQyxVQUFpQkE7O2FBQzlCQyxXQUVKQTs7UUFDUEMsV0FFS0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ053QkgscUJBRTlCQTs7Ozs7QUFBZ0NDLHVCQUVqQ0E7O0FDTkFLOzs7Ozs7QUE0QkNBOztBQzVCREc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbURDQTs7QUNuRERDOzs7Ozs7Ozs7Ozs7Ozs7QUFRQ0E7O0FDUkRDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkN1QkE7O0FDN0N2QkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JDQTs7QUNsQkRDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUZDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pGREM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q0NBOztBQ3ZDREM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1RENBOztBQ3ZEREM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3RG9EQTs7bUJDeERwREMsUUFpR0VBOzs7Ozs7Ozs7OztLQ2pHWWpCLFdBQ05BOzs7Ozs7dUNBR1FDLFVBQWtCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7U0NEM0JELFdBQ01BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQ0piTSxPQTBHRUE7Ozs7Ozs7TUMxR2NOLFdBQ1BBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRFQ7QUFDQTtBQUNBO0FBQ0E7Ozs7VUNBQ0EsVUFBbUJBOztLQUNuQkMsVUFBa0JBOztTQUFZQyxVQUN6QkE7O1VBQWFDLFdBQWdCQTs7YUFDN0JDLFdBR0tBOztZQUFlQyxXQUNGQTs7Ozs7Ozs7OzRCQ1Z4QkM7Ozs7bUNEbUJJWSxXQUNjQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1BvQ1o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dDSGhCTixXQUVOQTs7T0FDM0JDLFdBQ1VBOztRQUNYQyxXQUVTQTs7V0FFYkMsV0FDaUJBOztVQUNYQyxVQUFzQkE7O0tBRXZCQyxVQUFxQkE7O01BQ3pCYyxVQUFpQkE7O1NBQVlELFVBQXFCQTs7YUFDM0NYLFdBQWdDQTs7QUFDeENDLDBEQUFnREE7O0FBQUdZLDBCQUNsQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaVVnL01DLFVBQVlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNVY3Z05mOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQzZCQTs7QUNEN0JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCa0JBOztBQ3ZCbEJDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9GcUJBOztBQ3BGckJDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QjJCQTs7QUN6QjNCQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStCT0E7Ozs7Ozs7QUMvQlA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1lDVmNaLFdBRVZBOztVQUFhQyxXQUFrQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUJDSG5DSyxPQTZGRUE7Ozs7Ozs7Ozs7V0MzRktOLFdBRUpBO09BQVNDLFdBQ0NBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNMYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1lDL0RjRCxXQUVWQTs7VUFBYUMsV0FBa0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O21CQ0huQ0ssT0FnR0VBOzs7Ozs7O0FDaEdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0tDbFBhTixVQUFrQkE7O2FBRS9CQyxXQUVlQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTGY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7S0N2QlFELFVBQXFCQTs7YUFDZkMsV0FDUUE7O1dBQWNDLFdBQ3BCQTs7VUFBYUMsVUFDakJBOztZQUFlQyxXQUVuQkE7O1NBQ0hDLFVBQ0NBOztNQUFTYyxVQUNIQTs7aUJBQW9CRCxXQUV2QkE7O0FBQUdYLDBCQUNKQTs7QUFBR0MsMEJBRUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7YUNqQmNSLFdBQ1BBOztXQUNqQkMsV0FDREE7O2FBQWdCQyxXQUNYQTs7U0FBWUMsVUFDVEE7O0tBQVFDLFVBQ0xBOztRQUNUQyxXQUNHQTs7VUFDTmMsVUFHQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O01DNUMwQm5CLFVBQ2hCQTs7VUFBYUMsVUFDbkJBOztTQUFZQyxXQUVTQTs7OztBQUVYb0IsOEJBRUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnUWhCQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkE2Q0FBOztBQUFFQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQkF3RHU0SEE7Ozs7O0FDOVcxNEg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7WUM1QjhCeEIsV0FDOUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztZQzFCOEJBLFdBQzlCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01DRE1BLFVBQWlCQTs7TUFDaEJDLFdBQWtCQTs7VUFFckJDLFVBQXNCQTs7QUFDMUJvQiw4QkFFQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQ0VDOzs7Ozs7Ozs7Ozs7cUJBY0FBOztBQUFFQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFxRUhBOztBQUNEQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dEQXlDUUE7O0FBQUVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0RBVTBmQTs7QUFBRUM7Ozs7Ozs7Ozs7Ozs7Ozs7OzhCQUEyVkE7Ozs7O0FDbkxsMkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7b0JDeENvQjNCLFdBQW9CQTs7b0JBQ2xCQyxXQUNyQkE7O2tCQUFxQkMsV0FDbkJBOztvQkFBdUJDLFdBQ3JCQTs7ZUFBa0JDLFdBQ2hCQTs7Z0JBQW1CQyxXQUFnQkE7Ozs7Ozs7TUNMMUJMLFVBRVJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQ0ZRQSxVQUVSQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUNGUUEsVUFFUkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQ0ZRQSxVQUVSQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01DRlFBLFVBRVJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUNGUUEsVUFFUkEiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbImhlbHBlcnMgPSBfJHNtKCcuL2hlbHBlcnMnIClcbkRPTSA9IF8kc20oJ3F1aWNrZG9tJyApXG5JUyA9IF8kc20oJy4vY2hlY2tzJyApXG5leHRlbmQgPSBfJHNtKCdzbWFydC1leHRlbmQnIClcbnJlZ2lzdGVyQW5pbWF0aW9ucyA9IF8kc20oJy4vYW5pbWF0aW9ucycgKVxuUkVRVUlSRURfRklFTERfTUVUSE9EUyA9IF8kc20oJy4vY29uc3RhbnRzL3JlcUZpZWxkTWV0aG9kcycgKVxuXyRzbSgnLi9jb25zb2xlUGF0Y2gnIClcblxuXG5uZXdCdWlsZGVyID0gKHNldHRpbmdPdmVycmlkZXMsIHRlbXBsYXRlT3ZlcnJpZGVzKS0+XG5cdGJ1aWxkZXIgPSAoc2V0dGluZ3MpLT5cblx0XHRzZXR0aW5ncyA9IHt9IHVubGVzcyBJUy5vYmplY3Qoc2V0dGluZ3MpXG5cdFx0c2V0dGluZ3MudHlwZSA/PSAndGV4dCdcblxuXHRcdGlmIG5vdCBGaWVsZFtzZXR0aW5ncy50eXBlXVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiUXVpY2tGaWVsZDogJyN7c2V0dGluZ3MudHlwZX0nIGlzIG5vdCBhIHZhbGlkL3JlZ2lzdGVyZWQgZmllbGQgdHlwZVwiXG5cblx0XHRyZWdpc3RlckFuaW1hdGlvbnMoKVxuXHRcdG5ldyBGaWVsZFtzZXR0aW5ncy50eXBlXShzZXR0aW5ncywgYnVpbGRlciwgc2V0dGluZ092ZXJyaWRlcywgdGVtcGxhdGVPdmVycmlkZXMpXG5cblxuXHRidWlsZGVyLnJlZ2lzdGVyID0gKHR5cGUsIHRhcmdldEZpZWxkKS0+XG5cdFx0aWYgbm90IElTLnN0cmluZyh0eXBlKSBvciBub3QgSVMuZnVuY3Rpb24odGFyZ2V0RmllbGQpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJRdWlja0ZpZWxkIFJlZ2lzdHJhdGlvbjogaW52YWxpZCBhcmd1bWVudHNcIlxuXHRcdGZvciByZXF1aXJlZE1ldGhvZCBpbiBSRVFVSVJFRF9GSUVMRF9NRVRIT0RTXG5cdFx0XHRpZiBub3QgdGFyZ2V0RmllbGQ6OltyZXF1aXJlZE1ldGhvZF1cblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiUXVpY2tGaWVsZCBSZWdpc3RyYXRpb246ICcje3JlcXVpcmVkTWV0aG9kfScgbWV0aG9kIGlzIHJlcXVpcmVkIGluIG9yZGVyIHRvIHJlZ2lzdGVyIHRoZSBmaWVsZFwiXG5cblx0XHRGaWVsZFt0eXBlXSA9IHRhcmdldEZpZWxkXG5cdFx0cmV0dXJuIEBcblxuXG5cdGJ1aWxkZXIuY29uZmlnID0gKG5ld1NldHRpbmdzLCBuZXdUZW1wbGF0ZXMpLT5cblx0XHR0aHJvdyBuZXcgRXJyb3IgXCJRdWlja0ZpZWxkIENvbmZpZzogaW52YWxpZCBjb25maWcgb2JqZWN0IHByb3ZpZGVkICN7U3RyaW5nIG5ld1NldHRpbmdzfVwiIGlmIG5vdCBJUy5vYmplY3QobmV3U2V0dGluZ3MpXG5cdFx0b3V0cHV0U2V0dGluZ3MgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdFx0XG5cdFx0Zm9yIHR5cGUsY29uZmlnIG9mIG5ld1NldHRpbmdzXG5cdFx0XHRpZiB0eXBlIGlzICdnbG9iYWwnXG5cdFx0XHRcdG91dHB1dFNldHRpbmdzLmdsb2JhbERlZmF1bHRzID0gZXh0ZW5kLmRlZXAubm90RGVlcChGaWVsZC5zaGFsbG93U2V0dGluZ3MpLmNsb25lKEZpZWxkOjpnbG9iYWxEZWZhdWx0cywgY29uZmlnKVxuXHRcdFx0ZWxzZSBpZiBGaWVsZFt0eXBlXVxuXHRcdFx0XHRvdXRwdXRTZXR0aW5nc1t0eXBlXSA9IGV4dGVuZC5jbG9uZS5kZWVwLm5vdERlZXAoRmllbGQuc2hhbGxvd1NldHRpbmdzKShGaWVsZFt0eXBlXTo6ZGVmYXVsdHMsIGNvbmZpZylcblxuXHRcdGlmIElTLm9iamVjdChuZXdUZW1wbGF0ZXMpXG5cdFx0XHRvdXRwdXRUZW1wbGF0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdFx0XHRnbG9iYWxDb25maWcgPSBuZXdUZW1wbGF0ZXMuZ2xvYmFsXG5cdFx0XHRpZiBnbG9iYWxDb25maWcgYW5kIGdsb2JhbENvbmZpZy5maWVsZCBhbmQgbm90IGdsb2JhbENvbmZpZy5kZWZhdWx0XG5cdFx0XHRcdGdsb2JhbENvbmZpZy5kZWZhdWx0ID0gZ2xvYmFsQ29uZmlnLmZpZWxkXG5cdFx0XHRcblx0XHRcdGZvciB0eXBlIG9mIEZpZWxkXG5cdFx0XHRcdG9yaWdpbmFsVGVtcGxhdGVzID0gRmllbGRbdHlwZV06Oj8udGVtcGxhdGVzXG5cdFx0XHRcdHRlbXBsYXRlcyA9IG5ld1RlbXBsYXRlc1t0eXBlXSBvciBnbG9iYWxDb25maWdcblx0XHRcdFx0aWYgbm90IG9yaWdpbmFsVGVtcGxhdGVzXG5cdFx0XHRcdFx0Y29udGludWVcblx0XHRcdFx0aWYgbm90IHRlbXBsYXRlc1xuXHRcdFx0XHRcdG91dHB1dFRlbXBsYXRlc1t0eXBlXSA9IG9yaWdpbmFsVGVtcGxhdGVzXG5cdFx0XHRcdFx0Y29udGludWVcblx0XHRcdFx0XG5cdFx0XHRcdGlmIHRlbXBsYXRlcy5maWVsZCBhbmQgbm90IHRlbXBsYXRlcy5kZWZhdWx0XG5cdFx0XHRcdFx0dGVtcGxhdGVzLmRlZmF1bHQgPSB0ZW1wbGF0ZXMuZmllbGRcblxuXHRcdFx0XHRvdXRwdXRUZW1wbGF0ZXNbdHlwZV0gPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdFx0XHRcdFxuXHRcdFx0XHRmb3IgbmFtZSxjb25maWcgb2YgdGVtcGxhdGVzXG5cdFx0XHRcdFx0Y29udGludWUgaWYgbmFtZSBpcyAnZmllbGQnIG9yIG5vdCBvcmlnaW5hbFRlbXBsYXRlc1tuYW1lXVxuXHRcdFx0XHRcdGNvbmZpZyA9IGV4dGVuZC5jbG9uZS5kZWVwLmNvbmNhdChnbG9iYWxDb25maWdbbmFtZV0sIGNvbmZpZykgaWYgZ2xvYmFsQ29uZmlnIGFuZCBnbG9iYWxDb25maWdbbmFtZV1cblx0XHRcdFx0XHRvdXRwdXRUZW1wbGF0ZXNbdHlwZV1bbmFtZV0gPSBvcmlnaW5hbFRlbXBsYXRlc1tuYW1lXS5leHRlbmQoY29uZmlnKVxuXG5cdFx0XHRcdGZvciBuYW1lLGNvbmZpZyBvZiBvcmlnaW5hbFRlbXBsYXRlcyB3aGVuIG5vdCBvdXRwdXRUZW1wbGF0ZXNbdHlwZV1bbmFtZV1cblx0XHRcdFx0XHRvdXRwdXRUZW1wbGF0ZXNbdHlwZV1bbmFtZV0gPSBjb25maWdcblxuXHRcdHJldHVybiBuZXdCdWlsZGVyKG91dHB1dFNldHRpbmdzLCBvdXRwdXRUZW1wbGF0ZXMpXG5cblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBidWlsZGVyLCAnZmllbGRzJywgZ2V0OiAoKS0+XG5cdFx0ZXh0ZW5kLmNsb25lLm93bi5ub3RLZXlzKCdpbnN0YW5jZXMnKShGaWVsZClcblxuXHRidWlsZGVyLnNldHRpbmdPdmVycmlkZXMgPSBzZXR0aW5nT3ZlcnJpZGVzXG5cdGJ1aWxkZXIudGVtcGxhdGVPdmVycmlkZXMgPSB0ZW1wbGF0ZU92ZXJyaWRlc1xuXHRidWlsZGVyLnZlcnNpb24gPSBfJHNtKCcuLi9wYWNrYWdlLmpzb24gJCB2ZXJzaW9uJyApXG5cdGJ1aWxkZXIuRmllbGQgPSBGaWVsZCA9IF8kc20oJy4vZmllbGQnIClcblx0cmV0dXJuIGJ1aWxkZXJcblxuXG5cblxuXG5cblF1aWNrRmllbGQgPSBuZXdCdWlsZGVyKClcblF1aWNrRmllbGQucmVnaXN0ZXIgJ3RleHQnLCBfJHNtKCcuL2ZpZWxkL3RleHQnIClcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAndGV4dGFyZWEnLCBfJHNtKCcuL2ZpZWxkL3RleHRhcmVhJyApXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ251bWJlcicsIF8kc20oJy4vZmllbGQvbnVtYmVyJyApXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ3NlbGVjdCcsIF8kc20oJy4vZmllbGQvc2VsZWN0JyApXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ2Nob2ljZScsIF8kc20oJy4vZmllbGQvY2hvaWNlJyApXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ3RydWVmYWxzZScsIF8kc20oJy4vZmllbGQvdHJ1ZWZhbHNlJyApXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ3RvZ2dsZScsIF8kc20oJy4vZmllbGQvdG9nZ2xlJyApXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ2dyb3VwJywgXyRzbSgnLi9maWVsZC9ncm91cCcgKVxuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdyZXBlYXRlcicsIF8kc20oJy4vZmllbGQvcmVwZWF0ZXInIClcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnZmlsZScsIF8kc20oJy4vZmllbGQvZmlsZScgKVxubW9kdWxlLmV4cG9ydHMgPSBRdWlja0ZpZWxkIiwiIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuQGNvbnNvbGUgPz0ge31cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcbmNvbnNvbGUubG9nID89ICgpLT5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcbmNvbnNvbGUud2FybiA/PSBjb25zb2xlLmxvZyIsIntcbiAgXCJuYW1lXCI6IFwicXVpY2tmaWVsZFwiLFxuICBcInZlcnNpb25cIjogXCIxLjAuNjZcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkZhc3QgJiBsaWdodCBmb3JtIGZpZWxkcyBtYW5hZ2VtZW50IHN1cHBvcnRpbmcgcmVhbC10aW1lIGJpbmRpbmdzLCBjdXN0b20gc3R5bGluZywgY3VzdG9tIGZpZWxkcywgSUU5KywgYW5kIG1vcmUuLi5cIixcbiAgXCJtYWluXCI6IFwiZGlzdC9xdWlja2ZpZWxkLmpzXCIsXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9xdWlja2ZpZWxkLmRlYnVnLmpzXCIsXG4gICAgXCIuL2Rpc3QvcXVpY2tmaWVsZC5qc1wiOiBcInNyYy9pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdGV4dFwiOiBcInNyYy9maWVsZC90ZXh0L19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdGV4dGFyZWFcIjogXCJzcmMvZmllbGQvdGV4dGFyZWEvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9udW1iZXJcIjogXCJzcmMvZmllbGQvbnVtYmVyL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvc2VsZWN0XCI6IFwic3JjL2ZpZWxkL3NlbGVjdC9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL2Nob2ljZVwiOiBcInNyYy9maWVsZC9jaG9pY2UvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC90cnVlZmFsc2VcIjogXCJzcmMvZmllbGQvdHJ1ZWZhbHNlL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdG9nZ2xlXCI6IFwic3JjL2ZpZWxkL3RvZ2dsZS9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL2dyb3VwXCI6IFwic3JjL2ZpZWxkL2dyb3VwL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvcmVwZWF0ZXJcIjogXCJzcmMvZmllbGQvcmVwZWF0ZXIvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9maWxlXCI6IFwic3JjL2ZpZWxkL2ZpbGUvX2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwiZmFsc2UgJiYgbnBtIHJ1biB0ZXN0OnRyYXZpcyB8fCB0cnVlXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJ3YXRjaFwiOiBcImNha2UgLWQgd2F0Y2hcIixcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDp0cmF2aXNcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcInRlc3Q6bG9jYWxcIjogXCJvcGVuIHRlc3QvdGVzdHJ1bm5lci5odG1sXCIsXG4gICAgXCJ0ZXN0Om1pbmlmaWVkXCI6IFwibWluaWZpZWQ9MSBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpicm93c2VyXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEVsZWN0cm9uIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6Y2hyb21lXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBDaHJvbWUgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpmaXJlZm94XCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEZpcmVmb3ggLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2ZpZWxkLmdpdFwiXG4gIH0sXG4gIFwiYXV0aG9yXCI6IFwiZGFuaWVsa2FsZW5cIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tmaWVsZC9pc3N1ZXNcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZmllbGQjcmVhZG1lXCIsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBkYW5pZWxrYWxlbi9pc1wiOiBcIl4yLjAuMFwiLFxuICAgIFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRcIjogXCJeMS4xNS44XCIsXG4gICAgXCJmYXN0ZG9tXCI6IFwiXjEuMC42XCIsXG4gICAgXCJsZXZlblwiOiBcIl4yLjAuMFwiLFxuICAgIFwibW92ZS1qc1wiOiBcIl4wLjUuMFwiLFxuICAgIFwicXVpY2tjc3NcIjogXCJeMS4zLjJcIixcbiAgICBcInF1aWNrZG9tXCI6IFwiXjEuMC44MVwiLFxuICAgIFwic21hcnQtZXh0ZW5kXCI6IFwiXjEuNy4zXCIsXG4gICAgXCJ0ZXh0LW1hc2stYWRkb25zXCI6IFwiXjMuNi4wXCIsXG4gICAgXCJ0ZXh0LW1hc2stY29yZVwiOiBcIl41LjAuMVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjaGFsa1wiOiBcIl4yLjAuMVwiLFxuICAgIFwiY29mZmVlLXNjcmlwdFwiOiBcIl4xLjEyLjZcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4zXCIsXG4gICAgXCJrZXlzaW1cIjogXCJnaXRodWI6ZGFuaWVsa2FsZW4va2V5c2ltLmpzXCIsXG4gICAgXCJwYWNrYWdlLWluc3RhbGxcIjogXCJeMS4wLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuMC1zMzVcIixcbiAgICBcInNpbXBseXdhdGNoXCI6IFwiXjMuMC4wLWwyXCJcbiAgfVxufVxuIiwiSVMgPSBfJHNtKCcuL2NoZWNrcycgKVxuRE9NID0gXyRzbSgncXVpY2tkb20nIClcblNpbXBseUJpbmQgPSBfJHNtKCdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCcgKVxucmVnZXggPSBfJHNtKCcuL2NvbnN0YW50cy9yZWdleCcgKVxuXG5oZWxwZXJzID0gZXhwb3J0c1xuaGVscGVycy5ub29wID0gKCktPlxuXG5oZWxwZXJzLmluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPlxuXHR0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuaGVscGVycy5yZXBlYXQgPSAoc3RyaW5nLCBjb3VudCktPlxuXHQoc3RyaW5nIGZvciBpIGluIFsxLi5jb3VudF0pLmpvaW4oJycpXG5cbmhlbHBlcnMucmVtb3ZlSXRlbSA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0aXRlbUluZGV4ID0gdGFyZ2V0LmluZGV4T2YoaXRlbSlcblx0dGFyZ2V0LnNwbGljZShpdGVtSW5kZXgsIDEpIGlmIGl0ZW1JbmRleCBpc250IC0xXG5cbmhlbHBlcnMuaW5zZXJ0QWZ0ZXIgPSAodGFyZ2V0LCBpdGVtLCBuZXdJdGVtKS0+XG5cdGl0ZW1JbmRleCA9IHRhcmdldC5pbmRleE9mKGl0ZW0pXG5cdHRhcmdldC5zcGxpY2UoaXRlbUluZGV4LCAwLCBuZXdJdGVtKSBpZiBpdGVtSW5kZXggaXNudCAtMVxuXG5oZWxwZXJzLmZpbmQgPSAodGFyZ2V0LCBmbiktPlxuXHRyZXN1bHRzID0gdGFyZ2V0LmZpbHRlcihmbilcblx0cmVzdWx0c1swXVxuXG5oZWxwZXJzLmRpZmYgPSAoc291cmNlLCBjb21wYXJlZSktPlxuXHRyZXN1bHQgPSBbXVxuXHRtYXhMZW4gPSBNYXRoLm1heChzb3VyY2UubGVuZ3RoLCBjb21wYXJlZS5sZW5ndGgpXG5cdGkgPSAtMVxuXHRcblx0d2hpbGUgKytpIDwgbWF4TGVuXG5cdFx0c291cmNlVmFsID0gc291cmNlW2ldXG5cdFx0Y29tcGFyZWVWYWwgPSBjb21wYXJlZVtpXVxuXG5cdFx0aWYgc291cmNlVmFsIGlzbnQgY29tcGFyZWVWYWxcblx0XHRcdHJlc3VsdC5wdXNoKHNvdXJjZVZhbCkgaWYgSVMuZGVmaW5lZChzb3VyY2VWYWwpIGFuZCBub3QgaGVscGVycy5pbmNsdWRlcyhjb21wYXJlZSwgc291cmNlVmFsKVxuXHRcdFx0cmVzdWx0LnB1c2goY29tcGFyZWVWYWwpIGlmIElTLmRlZmluZWQoY29tcGFyZWVWYWwpIGFuZCBub3QgaGVscGVycy5pbmNsdWRlcyhzb3VyY2UsIGNvbXBhcmVlVmFsKVxuXG5cdHJldHVybiByZXN1bHRcblxuXG5oZWxwZXJzLmhleFRvUkdCQSA9IChoZXgsIGFscGhhKS0+XG5cdGhleCA9IGhleC5zbGljZSgxKSBpZiBoZXhbMF0gaXMgJyMnXG5cdFIgPSBwYXJzZUludCBoZXguc2xpY2UoMCwyKSwgMTZcblx0RyA9IHBhcnNlSW50IGhleC5zbGljZSgyLDQpLCAxNlxuXHRCID0gcGFyc2VJbnQgaGV4LnNsaWNlKDQsNiksIDE2XG5cdHJldHVybiBcInJnYmEoI3tSfSwgI3tHfSwgI3tCfSwgI3thbHBoYX0pXCJcblxuXG5oZWxwZXJzLmRlZmF1bHRDb2xvciA9IChjb2xvciwgZGVmYXVsdENvbG9yKS0+XG5cdGlmIGNvbG9yIGlzICd0cmFuc3BhcmVudCcgb3Igbm90IGNvbG9yXG5cdFx0cmV0dXJuIGRlZmF1bHRDb2xvclxuXHRlbHNlXG5cdFx0cmV0dXJuIGNvbG9yXG5cblxuaGVscGVycy5jYWxjUGFkZGluZyA9IChkZXNpcmVkSGVpZ2h0LCBmb250U2l6ZSktPlxuXHRNYXRoLmNlaWwgKGRlc2lyZWRIZWlnaHQgLSBmb250U2l6ZSoxLjIzMSkvMlxuXG5cbmhlbHBlcnMudW5sb2NrU2Nyb2xsID0gKGV4Y2x1ZGVkRWwpLT5cblx0d2luZG93Ll9pc0xvY2tlZCA9IGZhbHNlXG5cdERPTSh3aW5kb3cpLm9mZiAnd2hlZWwubG9jaydcblxuXG5oZWxwZXJzLmxvY2tTY3JvbGwgPSAoZXhjbHVkZWRFbCktPiB1bmxlc3Mgd2luZG93Ll9pc0xvY2tlZFxuXHR3aW5kb3cuX2lzTG9ja2VkID0gdHJ1ZVxuXHRET00od2luZG93KS5vbiAnd2hlZWwubG9jaycsIChldmVudCktPlxuXHRcdGlmIGV2ZW50LnRhcmdldCBpcyBleGNsdWRlZEVsLnJhdyBvciBET00oZXZlbnQudGFyZ2V0KS5wYXJlbnRNYXRjaGluZygocGFyZW50KS0+IHBhcmVudCBpcyBleGNsdWRlZEVsKVxuXHRcdFx0aWYgZXZlbnQud2hlZWxEZWx0YSA+IDAgYW5kIGV4Y2x1ZGVkRWwucmF3LnNjcm9sbFRvcCBpcyAwXG5cdFx0XHRcdHJldHVybiBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblx0XHRcdGlmIGV2ZW50LndoZWVsRGVsdGEgPCAwIGFuZCBleGNsdWRlZEVsLnJhdy5zY3JvbGxIZWlnaHQgLSBleGNsdWRlZEVsLnJhdy5zY3JvbGxUb3AgaXMgZXhjbHVkZWRFbC5yYXcuY2xpZW50SGVpZ2h0XG5cdFx0XHRcdHJldHVybiBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblx0XHRlbHNlXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblxuaGVscGVycy5mdXp6eU1hdGNoID0gKG5lZWRsZSwgaGF5c3RhY2ssIGNhc2VTZW5zaXRpdmUpLT5cblx0bkxlbmd0aCA9IG5lZWRsZS5sZW5ndGhcblx0aExlbmd0aCA9IGhheXN0YWNrLmxlbmd0aFxuXHR1bmxlc3MgY2FzZVNlbnNpdGl2ZVxuXHRcdG5lZWRsZSA9IG5lZWRsZS50b1VwcGVyQ2FzZSgpXG5cdFx0aGF5c3RhY2sgPSBoYXlzdGFjay50b1VwcGVyQ2FzZSgpXG5cblx0aWYgbkxlbmd0aCA+IGhMZW5ndGhcblx0XHRyZXR1cm4gZmFsc2Vcblx0aWYgbkxlbmd0aCBpcyBoTGVuZ3RoXG5cdFx0cmV0dXJuIG5lZWRsZSBpcyBoYXlzdGFja1xuXG5cdG5JID0gaEkgPSBtYXRjaGVkQ291bnQgPTBcblx0d2hpbGUgbkkgPCBuTGVuZ3RoXG5cdFx0bmVlZGxlQ2hhciA9IG5lZWRsZVtuSSsrXVxuXHRcdFxuXHRcdHdoaWxlIGhJIDwgaExlbmd0aFxuXHRcdFx0aWYgaGF5c3RhY2tbaEkrK10gaXMgbmVlZGxlQ2hhclxuXHRcdFx0XHRtYXRjaGVkQ291bnQrK1xuXHRcdFx0XHRicmVha1xuXG5cdHJldHVybiBtYXRjaGVkQ291bnQgaXMgbkxlbmd0aFxuXG5cbmhlbHBlcnMuc3RhcnRzV2l0aCA9IChuZWVkbGUsIGhheXN0YWNrLCBjYXNlU2Vuc2l0aXZlKS0+XG5cdHVubGVzcyBjYXNlU2Vuc2l0aXZlXG5cdFx0bmVlZGxlID0gbmVlZGxlLnRvVXBwZXJDYXNlKClcblx0XHRoYXlzdGFjayA9IGhheXN0YWNrLnRvVXBwZXJDYXNlKClcblxuXHRpZiBuZWVkbGUubGVuZ3RoID4gaGF5c3RhY2subGVuZ3RoXG5cdFx0cmV0dXJuIGZhbHNlXG5cdGlmIG5lZWRsZS5sZW5ndGggaXMgaGF5c3RhY2subGVuZ3RoXG5cdFx0cmV0dXJuIG5lZWRsZSBpcyBoYXlzdGFja1xuXG5cdGkgPSAtMVxuXHR3aGlsZSBuZWVkbGVbKytpXVxuXHRcdHJldHVybiBmYWxzZSBpZiBuZWVkbGVbaV0gaXNudCBoYXlzdGFja1tpXVxuXHRyZXR1cm4gdHJ1ZVxuXG5cbmhlbHBlcnMuZ2V0SW5kZXhPZkZpcnN0RGlmZiA9IChzb3VyY2VTdHJpbmcsIGNvbXBhcmVTdHJpbmcpLT5cblx0Y3VycmVudFBvcyA9IDBcblx0bWF4TGVuZ3RoID0gTWF0aC5tYXgoc291cmNlU3RyaW5nLmxlbmd0aCwgY29tcGFyZVN0cmluZy5sZW5ndGgpXG5cdFxuXHR3aGlsZSBjdXJyZW50UG9zIDwgbWF4TGVuZ3RoXG5cdFx0cmV0dXJuIGN1cnJlbnRQb3MgaWYgc291cmNlU3RyaW5nW2N1cnJlbnRQb3NdIGlzbnQgY29tcGFyZVN0cmluZ1tjdXJyZW50UG9zXVxuXHRcdGN1cnJlbnRQb3MrK1xuXHRcblx0cmV0dXJuIG51bGxcblxuXG5cbmhlbHBlcnMucGFyc2VDc3NTaG9ydGhhbmRWYWx1ZSA9IChzdHJpbmcpLT5cblx0dmFsdWVzID0gc3RyaW5nLnNwbGl0KHJlZ2V4LndoaXRlU3BhY2UpLm1hcChwYXJzZUZsb2F0KVxuXHRyZXN1bHQgPSB7fVxuXHRzd2l0Y2ggdmFsdWVzLmxlbmd0aFxuXHRcdHdoZW4gMVxuXHRcdFx0cmVzdWx0LnRvcCA9IHJlc3VsdC5yaWdodCA9IHJlc3VsdC5ib3R0b20gPSByZXN1bHQubGVmdCA9IHZhbHVlc1swXVxuXHRcdHdoZW4gMlxuXHRcdFx0cmVzdWx0LnRvcCA9IHJlc3VsdC5ib3R0b20gPSB2YWx1ZXNbMF1cblx0XHRcdHJlc3VsdC5yaWdodCA9IHJlc3VsdC5sZWZ0ID0gdmFsdWVzWzFdXG5cdFx0d2hlbiAzXG5cdFx0XHRyZXN1bHQudG9wID0gdmFsdWVzWzBdXG5cdFx0XHRyZXN1bHQucmlnaHQgPSByZXN1bHQubGVmdCA9IHZhbHVlc1sxXVxuXHRcdFx0cmVzdWx0LmJvdHRvbSA9IHZhbHVlc1syXVxuXHRcdHdoZW4gNFxuXHRcdFx0cmVzdWx0LnRvcCA9IHZhbHVlc1swXVxuXHRcdFx0cmVzdWx0LnJpZ2h0ID0gdmFsdWVzWzFdXG5cdFx0XHRyZXN1bHQuYm90dG9tID0gdmFsdWVzWzJdXG5cdFx0XHRyZXN1bHQubGVmdCA9IHZhbHVlc1szXVxuXG5cdHJldHVybiByZXN1bHRcblxuXG5oZWxwZXJzLnNob3J0aGFuZFNpZGVWYWx1ZSA9ICh2YWx1ZSwgc2lkZSktPlxuXHRzd2l0Y2ggdHlwZW9mIHZhbHVlXG5cdFx0d2hlbiAnbnVtYmVyJyB0aGVuIHZhbHVlXG5cdFx0d2hlbiAnc3RyaW5nJ1xuXHRcdFx0dmFsdWVzID0gaGVscGVycy5wYXJzZUNzc1Nob3J0aGFuZFZhbHVlKHZhbHVlKVxuXHRcdFx0dmFsdWVzW3NpZGVdXG5cdFx0ZWxzZSAwXG5cblxuaGVscGVycy51cGRhdGVTaG9ydGhhbmRWYWx1ZSA9ICh2YWx1ZSwgc2lkZSwgbmV3VmFsdWUpLT5cblx0dmFsdWVzID0gaGVscGVycy5wYXJzZUNzc1Nob3J0aGFuZFZhbHVlKCcnKyh2YWx1ZSBvciAwKSlcblx0c3dpdGNoIHNpZGVcblx0XHR3aGVuICd0b3AnIHRoZW4gdmFsdWVzLnRvcCArPSBuZXdWYWx1ZVxuXHRcdHdoZW4gJ3JpZ2h0JyB0aGVuIHZhbHVlcy5yaWdodCArPSBuZXdWYWx1ZVxuXHRcdHdoZW4gJ2JvdHRvbScgdGhlbiB2YWx1ZXMuYm90dG9tICs9IG5ld1ZhbHVlXG5cdFx0d2hlbiAnbGVmdCcgdGhlbiB2YWx1ZXMubGVmdCArPSBuZXdWYWx1ZVxuXHRcdGVsc2UgT2JqZWN0LmtleXModmFsdWVzKS5mb3JFYWNoIChzaWRlKS0+IHZhbHVlc1tzaWRlXSArPSBuZXdWYWx1ZVxuXHRcblx0XCIje3ZhbHVlcy50b3B9cHggI3t2YWx1ZXMucmlnaHR9cHggI3t2YWx1ZXMuYm90dG9tfXB4ICN7dmFsdWVzLmxlZnR9cHhcIlxuXG5cblxuXG5cblxuXG5cbiIsInN2Z05hbWVzcGFjZSA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZydcbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcbmltcG9ydCAqIGFzIENTUyBmcm9tICdxdWlja2NzcydcbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcbmltcG9ydCAqIGFzIGV4dGVuZCBmcm9tICdzbWFydC1leHRlbmQnXG5pbXBvcnQgJy4vcGFydHMvYWxsb3dlZE9wdGlvbnMnXG5pbXBvcnQgJy4vcGFydHMvaGVscGVycydcbmltcG9ydCAnLi9wYXJ0cy9jaGVja3MnXG5pbXBvcnQgJy4vcGFydHMvZWxlbWVudCdcbmltcG9ydCAnLi9wYXJ0cy93aW5kb3cnXG5pbXBvcnQgJy4vcGFydHMvbWVkaWFRdWVyeSdcblxuUXVpY2tEb20gPSAoKS0+IGFyZ3M9YXJndW1lbnRzOyBzd2l0Y2hcblx0d2hlbiBJUy5hcnJheShhcmdzWzBdKVxuXHRcdHJldHVybiBRdWlja0RvbShhcmdzWzBdLi4uKVxuXHRcblx0d2hlbiBJUy50ZW1wbGF0ZShhcmdzWzBdKVxuXHRcdHJldHVybiBhcmdzWzBdLnNwYXduKClcblx0XG5cdHdoZW4gSVMucXVpY2tEb21FbChhcmdzWzBdKVxuXHRcdHJldHVybiBpZiBhcmdzWzFdIHRoZW4gYXJnc1swXS51cGRhdGVPcHRpb25zKGFyZ3NbMV0pIGVsc2UgYXJnc1swXVxuXHRcblx0d2hlbiBJUy5kb21Ob2RlKGFyZ3NbMF0pIG9yIElTLmRvbURvYyhhcmdzWzBdKVxuXHRcdGlmIGFyZ3NbMF0uX3F1aWNrRWxlbWVudFxuXHRcdFx0cmV0dXJuIGFyZ3NbMF0uX3F1aWNrRWxlbWVudFxuXHRcdFxuXHRcdHR5cGUgPSBhcmdzWzBdLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnIycsICcnKVxuXHRcdG9wdGlvbnMgPSBhcmdzWzFdIG9yIHt9XG5cdFx0b3B0aW9ucy5leGlzdGluZyA9IGFyZ3NbMF1cblx0XHRyZXR1cm4gbmV3IFF1aWNrRWxlbWVudCh0eXBlLCBvcHRpb25zKVxuXG5cdHdoZW4gYXJnc1swXSBpcyB3aW5kb3dcblx0XHRyZXR1cm4gUXVpY2tXaW5kb3dcblxuXHR3aGVuIElTLnN0cmluZyhhcmdzWzBdKVx0XHRcdFxuXHRcdHR5cGUgPSBhcmdzWzBdLnRvTG93ZXJDYXNlKClcblx0XHRpZiB0eXBlIGlzICd0ZXh0J1xuXHRcdFx0b3B0aW9ucyA9IGlmIElTLm9iamVjdChhcmdzWzFdKSB0aGVuIGFyZ3NbMV0gZWxzZSB7dGV4dDphcmdzWzFdIG9yICcnfVxuXHRcdGVsc2Vcblx0XHRcdG9wdGlvbnMgPSBpZiBJUy5vYmplY3QoYXJnc1sxXSkgdGhlbiBhcmdzWzFdIGVsc2Uge31cblx0XHRcblx0XHRlbGVtZW50ID0gbmV3IFF1aWNrRWxlbWVudCh0eXBlLCBvcHRpb25zKVxuXHRcdGlmIGFyZ3MubGVuZ3RoID4gMlxuXHRcdFx0Y2hpbGRyZW4gPSBbXTsgaSA9IDE7IGFyZ3NMZW5ndGggPSBhcmdzLmxlbmd0aDsgY2hpbGRyZW4ucHVzaChhcmdzW2ldKSB3aGlsZSArK2kgPCBhcmdzTGVuZ3RoXG5cblx0XHRcdGZvciBjaGlsZCBpbiBjaGlsZHJlblxuXHRcdFx0XHRjaGlsZCA9IFF1aWNrRG9tLnRleHQoY2hpbGQpIGlmIElTLnN0cmluZyhjaGlsZClcblx0XHRcdFx0Y2hpbGQgPSBjaGlsZC5zcGF3bihmYWxzZSkgaWYgSVMudGVtcGxhdGUoY2hpbGQpXG5cdFx0XHRcdGNoaWxkID0gUXVpY2tEb20oY2hpbGQuLi4pIGlmIElTLmFycmF5KGNoaWxkKVxuXHRcdFx0XHRjaGlsZC5hcHBlbmRUbyhlbGVtZW50KSBpZiBJUy5xdWlja0RvbUVsKGNoaWxkKVxuXG5cdFx0cmV0dXJuIGVsZW1lbnRcblxuXHR3aGVuIGFyZ3NbMF0gYW5kIChJUy5kb21Ob2RlKGFyZ3NbMF1bMF0pIG9yIElTLmRvbURvYyhhcmdzWzBdWzBdKSlcblx0XHRyZXR1cm4gUXVpY2tEb20oYXJnc1swXVswXSlcblxuXG5RdWlja0RvbS50ZW1wbGF0ZSA9ICh0cmVlKS0+XG5cdG5ldyBRdWlja1RlbXBsYXRlKHRyZWUsIHRydWUpXG5cblxuUXVpY2tEb20uaHRtbCA9IChpbm5lckhUTUwpLT5cblx0Y29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0Y29udGFpbmVyLmlubmVySFRNTCA9IGlubmVySFRNTFxuXHRjaGlsZHJlbiA9IEFycmF5OjpzbGljZS5jYWxsIGNvbnRhaW5lci5jaGlsZE5vZGVzXG5cblx0cmV0dXJuIFF1aWNrRG9tLmJhdGNoKGNoaWxkcmVuKVxuXG5RdWlja0RvbS5xdWVyeSA9ICh0YXJnZXQpLT5cblx0UXVpY2tEb20oZG9jdW1lbnQpLnF1ZXJ5KHRhcmdldClcblxuUXVpY2tEb20ucXVlcnlBbGwgPSAodGFyZ2V0KS0+XG5cdFF1aWNrRG9tKGRvY3VtZW50KS5xdWVyeUFsbCh0YXJnZXQpXG5cblF1aWNrRG9tLmlzVGVtcGxhdGUgPSAodGFyZ2V0KS0+XG5cdElTLnRlbXBsYXRlKHRhcmdldClcblxuUXVpY2tEb20uaXNRdWlja0VsID0gKHRhcmdldCktPlxuXHRJUy5xdWlja0RvbUVsKHRhcmdldClcblxuUXVpY2tEb20uaXNFbCA9ICh0YXJnZXQpLT5cblx0SVMuZG9tRWwodGFyZ2V0KVxuXG5cblxuXG5cbmltcG9ydCAnLi9wYXJ0cy9iYXRjaCdcbmltcG9ydCAnLi9wYXJ0cy90ZW1wbGF0ZSdcbmltcG9ydCAnLi9wYXJ0cy9zaG9ydGN1dHMnXG5RdWlja0RvbS52ZXJzaW9uID0gaW1wb3J0ICcuLi9wYWNrYWdlLmpzb24gJCB2ZXJzaW9uJ1xuUXVpY2tEb20uQ1NTID0gQ1NTXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrRG9tXG5cblxuXG4iLCJhbGxvd2VkVGVtcGxhdGVPcHRpb25zID0gWyAjIFRvIGNvcHkgZnJvbSBET00gRWxlbWVudHNcblx0J2lkJ1xuXHQnbmFtZSdcblx0J3R5cGUnXG5cdCdocmVmJ1xuXHQnc2VsZWN0ZWQnXG5cdCdjaGVja2VkJ1xuXHQnY2xhc3NOYW1lJ1xuXVxuXG5hbGxvd2VkT3B0aW9ucyA9IFsgIyBVc2VkIGluIFF1aWNrRWxlbWVudDo6dG9KU09OXG5cdCdpZCdcblx0J3JlZidcblx0J3R5cGUnXG5cdCduYW1lJ1xuXHQndGV4dCdcblx0J3N0eWxlJ1xuXHQnY2xhc3MnXG5cdCdjbGFzc05hbWUnXG5cdCd1cmwnXG5cdCdocmVmJ1xuXHQnc2VsZWN0ZWQnXG5cdCdjaGVja2VkJ1xuXHQncHJvcHMnXG5cdCdhdHRycydcblx0J3Bhc3NTdGF0ZVRvQ2hpbGRyZW4nXG5cdCdzdGF0ZVRyaWdnZXJzJ1xuXHQjICdyZWxhdGVkSW5zdGFuY2UnXG5dIiwiaGVscGVycyA9IHt9XG5cbmhlbHBlcnMuaW5jbHVkZXMgPSAodGFyZ2V0LCBpdGVtKS0+XG5cdHRhcmdldCBhbmQgdGFyZ2V0LmluZGV4T2YoaXRlbSkgaXNudCAtMVxuXG5oZWxwZXJzLnJlbW92ZUl0ZW0gPSAodGFyZ2V0LCBpdGVtKS0+XG5cdGl0ZW1JbmRleCA9IHRhcmdldC5pbmRleE9mKGl0ZW0pXG5cdHRhcmdldC5zcGxpY2UoaXRlbUluZGV4LCAxKSAgaWYgaXRlbUluZGV4IGlzbnQgLTFcblx0cmV0dXJuIHRhcmdldFxuXG5oZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwgPSAodGFyZ2V0RWwpLT4gc3dpdGNoXG5cdHdoZW4gSVMuc3RyaW5nKHRhcmdldEVsKSB0aGVuIFF1aWNrRG9tLnRleHQodGFyZ2V0RWwpXG5cdHdoZW4gSVMuZG9tTm9kZSh0YXJnZXRFbCkgdGhlbiBRdWlja0RvbSh0YXJnZXRFbClcblx0d2hlbiBJUy50ZW1wbGF0ZSh0YXJnZXRFbCkgdGhlbiB0YXJnZXRFbC5zcGF3bigpXG5cdGVsc2UgdGFyZ2V0RWxcblxuXG5oZWxwZXJzLmlzU3RhdGVTdHlsZSA9IChzdHJpbmcpLT5cblx0c3RyaW5nWzBdIGlzICckJyBvciBzdHJpbmdbMF0gaXMgJ0AnXG5cblxuaGVscGVycy5yZWdpc3RlclN0eWxlID0gKHJ1bGUsIGxldmVsLCBpbXBvcnRhbnQpLT5cblx0bGV2ZWwgfHw9IDBcblx0Y2FjaGVkID0gc3R5bGVDYWNoZS5nZXQocnVsZSwgbGV2ZWwpXG5cdHJldHVybiBjYWNoZWQgaWYgY2FjaGVkXG5cdG91dHB1dCA9IHtjbGFzc05hbWU6W0NTUy5yZWdpc3RlcihydWxlLCBsZXZlbCwgaW1wb3J0YW50KV0sIGZuczpbXSwgcnVsZX1cblx0cHJvcHMgPSBPYmplY3Qua2V5cyhydWxlKVxuXHRcblx0Zm9yIHByb3AgaW4gcHJvcHMgd2hlbiB0eXBlb2YgcnVsZVtwcm9wXSBpcyAnZnVuY3Rpb24nXG5cdFx0b3V0cHV0LmZucy5wdXNoIFtwcm9wLCBydWxlW3Byb3BdXVxuXG5cdHJldHVybiBzdHlsZUNhY2hlLnNldChydWxlLCBvdXRwdXQsIGxldmVsKVxuXG5cbnN0eWxlQ2FjaGUgPSBuZXcgY2xhc3Ncblx0Y29uc3RydWN0b3I6ICgpLT5cblx0XHRAa2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRAdmFsdWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG5cdGdldDogKGtleSwgbGV2ZWwpLT4gaWYgQGtleXNbbGV2ZWxdXG5cdFx0aW5kZXggPSBAa2V5c1tsZXZlbF0uaW5kZXhPZihrZXkpXG5cdFx0cmV0dXJuIEB2YWx1ZXNbbGV2ZWxdW2luZGV4XSBpZiBpbmRleCBpc250IC0xXG5cblx0c2V0OiAoa2V5LCB2YWx1ZSwgbGV2ZWwpLT5cblx0XHRpZiBub3QgQGtleXNbbGV2ZWxdXG5cdFx0XHRAa2V5c1tsZXZlbF0gPSBbXVxuXHRcdFx0QHZhbHVlc1tsZXZlbF0gPSBbXVxuXG5cdFx0QGtleXNbbGV2ZWxdLnB1c2gga2V5XG5cdFx0QHZhbHVlc1tsZXZlbF0ucHVzaCB2YWx1ZVxuXHRcdHJldHVybiB2YWx1ZVxuXG4iLCJJUyA9IGltcG9ydCAnQGRhbmllbGthbGVuL2lzJ1xuSVMgPSBJUy5jcmVhdGUoJ25hdGl2ZXMnLCdkb20nKVxuSVMubG9hZFx0XG5cdHF1aWNrRG9tRWw6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3QuY29uc3RydWN0b3IubmFtZSBpcyBRdWlja0VsZW1lbnQubmFtZVxuXHRcblx0dGVtcGxhdGU6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3QuY29uc3RydWN0b3IubmFtZSBpcyBRdWlja1RlbXBsYXRlLm5hbWVcblx0XG5cdCMgYmF0Y2g6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3QuY29uc3RydWN0b3IubmFtZSBpcyAnUXVpY2tCYXRjaCdcblxuIiwiY2xhc3MgUXVpY2tFbGVtZW50XG5cdGNvbnN0cnVjdG9yOiAoQHR5cGUsIEBvcHRpb25zKS0+XG5cdFx0QHN2ZyA9IHRydWUgaWYgQHR5cGVbMF0gaXMgJyonXG5cdFx0QGVsID0gQG9wdGlvbnMuZXhpc3Rpbmcgb3Jcblx0XHRcdGlmIEB0eXBlIGlzICd0ZXh0JyB0aGVuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGlmIHR5cGVvZiBAb3B0aW9ucy50ZXh0IGlzICdzdHJpbmcnIHRoZW4gQG9wdGlvbnMudGV4dCBlbHNlICcnKVxuXHRcdFx0ZWxzZSBpZiBAc3ZnIHRoZW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Z05hbWVzcGFjZSwgQHR5cGUuc2xpY2UoMSkpXG5cdFx0XHRlbHNlIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoQHR5cGUpXG5cblx0XHRpZiBAdHlwZSBpcyAndGV4dCdcblx0XHRcdEBhcHBlbmQgPSBAcHJlcGVuZCA9IEBhdHRyID0gKCktPlxuXHRcdFx0IyBAX3RleHRzID0ge30gIyBkZWZpbmVkIGNvbmRpdGlvbmFsbHlcblxuXHRcdEBfcGFyZW50ID0gbnVsbFxuXHRcdEBfc3R5bGVzID0ge31cblx0XHRAX3N0YXRlID0gW11cblx0XHRAX2NoaWxkcmVuID0gW11cblx0XHQjIEBfcHJvdmlkZWRTdGF0ZXMgPSBbXVx0XHRcdFx0IyBkZWZpbmVkIGNvbmRpdGlvbmFsbHlcblx0XHQjIEBfcHJvdmlkZWRTdGF0ZXNTaGFyZWQgPSBbXVx0XHQjIGRlZmluZWQgY29uZGl0aW9uYWxseVxuXHRcdCMgQF9ldmVudENhbGxiYWNrcyA9IHtfX3JlZnM6e319XHQjIGRlZmluZWQgY29uZGl0aW9uYWxseVxuXHRcdFxuXHRcdEBfbm9ybWFsaXplT3B0aW9ucygpXG5cdFx0QF9hcHBseU9wdGlvbnMoKVxuXHRcdEBfYXR0YWNoU3RhdGVFdmVudHMoKVxuXHRcdEBfcHJveHlQYXJlbnQoKVxuXHRcdEBfcmVmcmVzaFBhcmVudCgpIGlmIEBvcHRpb25zLmV4aXN0aW5nXG5cdFx0QGVsLl9xdWlja0VsZW1lbnQgPSBAXG5cblxuXHR0b0pTT046ICgpLT5cblx0XHRvdXRwdXQgPSBbQHR5cGUsIGV4dGVuZC5jbG9uZS5rZXlzKGFsbG93ZWRPcHRpb25zKShAb3B0aW9ucyldXG5cdFx0Y2hpbGRyZW4gPSBAY2hpbGRyZW5cblx0XHRvdXRwdXQucHVzaChjaGlsZC50b0pTT04oKSkgZm9yIGNoaWxkIGluIGNoaWxkcmVuXG5cdFx0cmV0dXJuIG91dHB1dFxuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja0VsZW1lbnQubmFtZSA/PSAnUXVpY2tFbGVtZW50J1xuXG5pbXBvcnQgJy4vYWxpYXNlcydcbmltcG9ydCAnLi90cmF2ZXJzaW5nJ1xuaW1wb3J0ICcuL2luaXQnXG5pbXBvcnQgJy4vZXZlbnRzJ1xuaW1wb3J0ICcuL3N0YXRlJ1xuaW1wb3J0ICcuL3N0eWxlJ1xuaW1wb3J0ICcuL2F0dHJpYnV0ZXMtYW5kLXByb3BlcnRpZXMnXG5pbXBvcnQgJy4vbWFuaXB1bGF0aW9uJ1xuaW1wb3J0ICcuL2FwcGxpY2F0aW9uJ1xuIiwiUXVpY2tXaW5kb3cgPSBcblx0dHlwZTogJ3dpbmRvdydcblx0ZWw6IHdpbmRvd1xuXHRyYXc6IHdpbmRvd1xuXHRfZXZlbnRDYWxsYmFja3M6IHtfX3JlZnM6e319XG5cdFxuXG5RdWlja1dpbmRvdy5vbiA9ICBRdWlja0VsZW1lbnQ6Om9uXG5RdWlja1dpbmRvdy5vZmYgPSAgUXVpY2tFbGVtZW50OjpvZmZcblF1aWNrV2luZG93LmVtaXQgPSAgUXVpY2tFbGVtZW50OjplbWl0XG5RdWlja1dpbmRvdy5lbWl0UHJpdmF0ZSA9ICBRdWlja0VsZW1lbnQ6OmVtaXRQcml2YXRlXG5RdWlja1dpbmRvdy5fbGlzdGVuVG8gPSAgUXVpY2tFbGVtZW50OjpfbGlzdGVuVG9cblF1aWNrV2luZG93Ll9pbnZva2VIYW5kbGVycyA9ICBRdWlja0VsZW1lbnQ6Ol9pbnZva2VIYW5kbGVyc1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgUXVpY2tXaW5kb3csXG5cdCd3aWR0aCc6IGdldDogKCktPiB3aW5kb3cuaW5uZXJXaWR0aFxuXHQnaGVpZ2h0JzogZ2V0OiAoKS0+IHdpbmRvdy5pbm5lckhlaWdodFxuXHQnb3JpZW50YXRpb24nOiBvcmllbnRhdGlvbkdldHRlclxuXHQnYXNwZWN0UmF0aW8nOiBhc3BlY3RSYXRpb0dldHRlclxuXG4iLCJNZWRpYVF1ZXJ5ID0gbmV3ICgpLT5cblx0Y2FsbGJhY2tzID0gW11cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgKCktPlxuXHRcdGNhbGxiYWNrKCkgZm9yIGNhbGxiYWNrIGluIGNhbGxiYWNrc1xuXHRcdHJldHVyblxuXG5cdEBwYXJzZVF1ZXJ5ID0gKHRhcmdldCwgcXVlcnlTdHJpbmcpLT5cblx0XHRxdWVyeVNwbGl0ID0gcXVlcnlTdHJpbmcuc3BsaXQoJygnKVxuXHRcdHNvdXJjZSA9IHF1ZXJ5U3BsaXRbMF1cblx0XHRzb3VyY2UgPSBzd2l0Y2ggc291cmNlXG5cdFx0XHR3aGVuICd3aW5kb3cnIHRoZW4gUXVpY2tXaW5kb3dcblx0XHRcdHdoZW4gJ3BhcmVudCcgdGhlbiB0YXJnZXQucGFyZW50XG5cdFx0XHR3aGVuICdzZWxmJyB0aGVuIHRhcmdldFxuXHRcdFx0ZWxzZSB0YXJnZXQucGFyZW50TWF0Y2hpbmcgKHBhcmVudCktPiBwYXJlbnQucmVmIGlzIHNvdXJjZS5zbGljZSgxKVxuXG5cdFx0cnVsZXMgPSBxdWVyeVNwbGl0WzFdXG5cdFx0XHQuc2xpY2UoMCwtMSlcblx0XHRcdC5zcGxpdChydWxlRGVsaW1pdGVyKVxuXHRcdFx0Lm1hcCAocnVsZSktPiBcblx0XHRcdFx0c3BsaXQgPSBydWxlLnNwbGl0KCc6Jylcblx0XHRcdFx0dmFsdWUgPSBwYXJzZUZsb2F0KHNwbGl0WzFdKVxuXHRcdFx0XHR2YWx1ZSA9IHNwbGl0WzFdIGlmIGlzTmFOKHZhbHVlKVxuXHRcdFx0XHRrZXkgPSBzcGxpdFswXVxuXHRcdFx0XHRrZXlQcmVmaXggPSBrZXkuc2xpY2UoMCw0KVxuXHRcdFx0XHRtYXggPSBrZXlQcmVmaXggaXMgJ21heC0nXG5cdFx0XHRcdG1pbiA9IG5vdCBtYXggYW5kIGtleVByZWZpeCBpcyAnbWluLSdcblx0XHRcdFx0a2V5ID0ga2V5LnNsaWNlKDQpIGlmIG1heCBvciBtaW5cblx0XHRcdFx0Z2V0dGVyID0gc3dpdGNoIGtleVxuXHRcdFx0XHRcdHdoZW4gJ29yaWVudGF0aW9uJyB0aGVuICgpLT4gc291cmNlLm9yaWVudGF0aW9uXG5cdFx0XHRcdFx0d2hlbiAnYXNwZWN0LXJhdGlvJyB0aGVuICgpLT4gc291cmNlLmFzcGVjdFJhdGlvXG5cdFx0XHRcdFx0d2hlbiAnd2lkdGgnLCdoZWlnaHQnIHRoZW4gKCktPiBzb3VyY2Vba2V5XVxuXHRcdFx0XHRcdGVsc2UgKCktPlxuXHRcdFx0XHRcdFx0c3RyaW5nVmFsdWUgPSBzb3VyY2Uuc3R5bGUoa2V5KVxuXHRcdFx0XHRcdFx0cGFyc2VkVmFsdWUgPSBwYXJzZUZsb2F0IHN0cmluZ1ZhbHVlXG5cdFx0XHRcdFx0XHRyZXR1cm4gaWYgaXNOYU4ocGFyc2VkVmFsdWUpIHRoZW4gc3RyaW5nVmFsdWUgZWxzZSBwYXJzZWRWYWx1ZVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIHtrZXksdmFsdWUsbWluLG1heCxnZXR0ZXJ9XG5cblx0XHRyZXR1cm4ge3NvdXJjZSwgcnVsZXN9XG5cblxuXHRAcmVnaXN0ZXIgPSAodGFyZ2V0LCBxdWVyeVN0cmluZyktPlxuXHRcdHF1ZXJ5ID0gQHBhcnNlUXVlcnkodGFyZ2V0LCBxdWVyeVN0cmluZylcblx0XHRpZiBxdWVyeS5zb3VyY2Vcblx0XHRcdGNhbGxiYWNrcy5wdXNoIGNhbGxiYWNrID0gKCktPiB0ZXN0UnVsZSh0YXJnZXQsIHF1ZXJ5LCBxdWVyeVN0cmluZylcblx0XHRcdGNhbGxiYWNrKClcblx0XHRyZXR1cm4gcXVlcnlcblxuXG5cdHRlc3RSdWxlID0gKHRhcmdldCwgcXVlcnksIHF1ZXJ5U3RyaW5nKS0+XG5cdFx0cGFzc2VkID0gdHJ1ZVxuXG5cdFx0Zm9yIHJ1bGUgaW4gcXVlcnkucnVsZXNcblx0XHRcdGN1cnJlbnRWYWx1ZSA9IHJ1bGUuZ2V0dGVyKClcblx0XHRcdHBhc3NlZCA9IHN3aXRjaFxuXHRcdFx0XHR3aGVuIHJ1bGUubWluIHRoZW4gY3VycmVudFZhbHVlID49IHJ1bGUudmFsdWVcblx0XHRcdFx0d2hlbiBydWxlLm1heCB0aGVuIGN1cnJlbnRWYWx1ZSA8PSBydWxlLnZhbHVlXG5cdFx0XHRcdGVsc2UgY3VycmVudFZhbHVlIGlzIHJ1bGUudmFsdWVcblxuXHRcdFx0YnJlYWsgaWYgbm90IHBhc3NlZFx0XHRcblx0XHRcblx0XHR0YXJnZXQuc3RhdGUocXVlcnlTdHJpbmcsIHBhc3NlZClcblxuXHRyZXR1cm4gQFxuXG5cblxuXG5ydWxlRGVsaW1pdGVyID0gLyxcXHMqL1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiY2xhc3MgUXVpY2tCYXRjaFxuXHRjb25zdHJ1Y3RvcjogKGVsZW1lbnRzLCBAcmV0dXJuUmVzdWx0cyktPlxuXHRcdEBlbGVtZW50cyA9IGVsZW1lbnRzLm1hcCAoZWwpLT4gUXVpY2tEb20oZWwpXG5cblx0cmV2ZXJzZTogKCktPlxuXHRcdEBlbGVtZW50cyA9IEBlbGVtZW50cy5yZXZlcnNlKClcblx0XHRyZXR1cm4gQFxuXG5cdHJldHVybjogKHJldHVybk5leHQpLT5cblx0XHRpZiByZXR1cm5OZXh0XG5cdFx0XHRAcmV0dXJuUmVzdWx0cyA9IHRydWVcblx0XHRcdHJldHVybiBAXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIEBsYXN0UmVzdWx0c1xuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja0JhdGNoLm5hbWUgPz0gJ1F1aWNrQmF0Y2gnXG5cblxuXG5PYmplY3Qua2V5cyhRdWlja0VsZW1lbnQ6OikuY29uY2F0KCdjc3MnLCAncmVwbGFjZVdpdGgnLCAnaHRtbCcsICd0ZXh0JykuZm9yRWFjaCAobWV0aG9kKS0+XG5cdFF1aWNrQmF0Y2g6OlttZXRob2RdID0gKG5ld1ZhbHVlKS0+XG5cdFx0cmVzdWx0cyA9IEBsYXN0UmVzdWx0cyA9IGZvciBlbGVtZW50IGluIEBlbGVtZW50c1xuXHRcdFx0aWYgbWV0aG9kIGlzICdodG1sJyBvciBtZXRob2QgaXMgJ3RleHQnXG5cdFx0XHRcdGlmIG5ld1ZhbHVlIHRoZW4gZWxlbWVudFttZXRob2RdID0gbmV3VmFsdWUgZWxzZSBlbGVtZW50W21ldGhvZF1cblx0XHRcdGVsc2Vcblx0XHRcdFx0ZWxlbWVudFttZXRob2RdKGFyZ3VtZW50cy4uLilcblx0XHRcblx0XHRyZXR1cm4gaWYgQHJldHVyblJlc3VsdHMgdGhlbiByZXN1bHRzIGVsc2UgQFxuXG5cblF1aWNrRG9tLmJhdGNoID0gKGVsZW1lbnRzLCByZXR1cm5SZXN1bHRzKS0+XG5cdGlmIG5vdCBJUy5pdGVyYWJsZShlbGVtZW50cylcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYXRjaDogZXhwZWN0ZWQgYW4gaXRlcmFibGUsIGdvdCAje1N0cmluZyhlbGVtZW50cyl9XCIpXG5cdGVsc2UgaWYgbm90IGVsZW1lbnRzLmxlbmd0aFxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhdGNoOiBleHBlY3RlZCBhIG5vbi1lbXB0eSBlbGVtZW50IGNvbGxlY3Rpb25cIilcblxuXHRyZXR1cm4gbmV3IFF1aWNrQmF0Y2goZWxlbWVudHMsIHJldHVyblJlc3VsdHMpXG5cblxuIiwiaW1wb3J0ICcuL2V4dGVuZFRlbXBsYXRlJ1xuaW1wb3J0ICcuL3BhcnNlVHJlZSdcbmltcG9ydCAnLi9zY2hlbWEnXG5cbmNsYXNzIFF1aWNrVGVtcGxhdGVcblx0Y29uc3RydWN0b3I6IChjb25maWcsIGlzVHJlZSktPlxuXHRcdHJldHVybiBjb25maWcgaWYgSVMudGVtcGxhdGUoY29uZmlnKVxuXHRcdGNvbmZpZyA9IGlmIGlzVHJlZSB0aGVuIHBhcnNlVHJlZShjb25maWcpIGVsc2UgY29uZmlnXG5cdFx0ZXh0ZW5kIEAsIGNvbmZpZ1xuXHRcdEBfaGFzQ29tcHV0ZXJzID0gISFAb3B0aW9ucy5jb21wdXRlcnNcblxuXHRcdGlmIG5vdCBAX2hhc0NvbXB1dGVycyBhbmQgQGNoaWxkcmVuLmxlbmd0aFxuXHRcdFx0Zm9yIGNoaWxkIGluIEBjaGlsZHJlbiB3aGVuIGNoaWxkLl9oYXNDb21wdXRlcnMgb3IgY2hpbGQub3B0aW9ucy5jb21wdXRlcnNcblx0XHRcdFx0QF9oYXNDb21wdXRlcnMgPSB0cnVlXG5cdFx0XHRcdGJyZWFrXG5cdFxuXHRleHRlbmQ6IChuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpLT5cblx0XHRuZXcgUXVpY2tUZW1wbGF0ZSBleHRlbmRUZW1wbGF0ZShALCBuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpXG5cblx0c3Bhd246IChuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpLT5cblx0XHRpZiBuZXdWYWx1ZXMgYW5kIG5ld1ZhbHVlcy5kYXRhXG5cdFx0XHRkYXRhID0gbmV3VmFsdWVzLmRhdGFcblx0XHRcdG5ld1ZhbHVlcyA9IG51bGwgaWYgT2JqZWN0LmtleXMobmV3VmFsdWVzKS5sZW5ndGggaXMgMVxuXHRcdFxuXHRcdGlmIG5ld1ZhbHVlcyBvciBnbG9iYWxPcHRzXG5cdFx0XHRvcHRzID0gZXh0ZW5kVGVtcGxhdGUoQCwgbmV3VmFsdWVzLCBnbG9iYWxPcHRzKVxuXHRcdGVsc2Vcblx0XHRcdG9wdHMgPSBleHRlbmQuY2xvbmUoQClcblx0XHRcdG9wdHMub3B0aW9ucyA9IGV4dGVuZC5jbG9uZShvcHRzLm9wdGlvbnMpXG5cdFxuXG5cdFx0ZWxlbWVudCA9IFF1aWNrRG9tKG9wdHMudHlwZSwgb3B0cy5vcHRpb25zLCBvcHRzLmNoaWxkcmVuLi4uKVxuXG5cdFx0aWYgQF9oYXNDb21wdXRlcnNcblx0XHRcdGlmIG5ld1ZhbHVlcyBpc250IGZhbHNlXG5cdFx0XHRcdGVsZW1lbnQuYXBwbHlEYXRhKGRhdGEpXG5cdFx0XHRpZiBlbGVtZW50Lm9wdGlvbnMuY29tcHV0ZXJzPy5faW5pdFxuXHRcdFx0XHRlbGVtZW50Ll9ydW5Db21wdXRlcignX2luaXQnLCBkYXRhKVxuXG5cdFx0cmV0dXJuIGVsZW1lbnRcblxuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja1RlbXBsYXRlLm5hbWUgPz0gJ1F1aWNrVGVtcGxhdGUnXG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5IFF1aWNrVGVtcGxhdGU6OiwgJ2NoaWxkJywgZ2V0OiAoKS0+XG5cdEBfY2hpbGRSZWZzIG9yIF9nZXRDaGlsZFJlZnMoQCkgIyBzb3VyY2UgaW4gL3NyYy9wYXJ0cy9lbGVtZW50L3RyYXZlcnNpbmcuY29mZmVlXG5cblxuXG5cblxuXG5cblxuIiwic2hvcnRjdXRzID0gW1xuXHQnbGluazphJ1xuXHQnYW5jaG9yOmEnXG5cdCdhJ1xuXHQndGV4dCdcblx0J2Rpdidcblx0J3NwYW4nXG5cdCdoMSdcblx0J2gyJ1xuXHQnaDMnXG5cdCdoNCdcblx0J2g1J1xuXHQnaDYnXG5cdCdoZWFkZXInXG5cdCdmb290ZXInXG5cdCdzZWN0aW9uJ1xuXHQnYnV0dG9uJ1xuXHQnYnInXG5cdCd1bCdcblx0J29sJ1xuXHQnbGknXG5cdCdmaWVsZHNldCdcblx0J2lucHV0J1xuXHQndGV4dGFyZWEnXG5cdCdzZWxlY3QnXG5cdCdvcHRpb24nXG5cdCdmb3JtJ1xuXHQnZnJhbWUnXG5cdCdocidcblx0J2lmcmFtZSdcblx0J2ltZydcblx0J3BpY3R1cmUnXG5cdCdtYWluJ1xuXHQnbmF2J1xuXHQnbWV0YSdcblx0J29iamVjdCdcblx0J3ByZSdcblx0J3N0eWxlJ1xuXHQndGFibGUnXG5cdCd0Ym9keSdcblx0J3RoJ1xuXHQndHInXG5cdCd0ZCdcblx0J3Rmb290J1xuXHQjICd0ZW1wbGF0ZSdcblx0J3ZpZGVvJ1xuXVxuXG5cbmZvciBzaG9ydGN1dCBpbiBzaG9ydGN1dHMgdGhlbiBkbyAoc2hvcnRjdXQpLT5cblx0cHJvcCA9IHR5cGUgPSBzaG9ydGN1dFxuXHRpZiBoZWxwZXJzLmluY2x1ZGVzKHNob3J0Y3V0LCAnOicpXG5cdFx0c3BsaXQgPSBzaG9ydGN1dC5zcGxpdCgnOicpXG5cdFx0cHJvcCA9IHNwbGl0WzBdXG5cdFx0dHlwZSA9IHNwbGl0WzFdXG5cblx0UXVpY2tEb21bcHJvcF0gPSAoKS0+IFF1aWNrRG9tKHR5cGUsIGFyZ3VtZW50cy4uLilcbiIsIntcbiAgXCJfZnJvbVwiOiBcInF1aWNrZG9tQF4xLjAuNzJcIixcbiAgXCJfaWRcIjogXCJxdWlja2RvbUAxLjAuODFcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1vQ2lzUERIR2Y2bENVZmdsOFRnb2hVUTJuUmRQVWNmaFh3eWFuajFReG1wa0xEd0RiaCtJRkJnb3dTUGxhaG9XamQrUFlVRGNtcDlTRk5mL2pCN3BLQT09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3F1aWNrZG9tXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJyYW5nZVwiLFxuICAgIFwicmVnaXN0cnlcIjogdHJ1ZSxcbiAgICBcInJhd1wiOiBcInF1aWNrZG9tQF4xLjAuNzJcIixcbiAgICBcIm5hbWVcIjogXCJxdWlja2RvbVwiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJxdWlja2RvbVwiLFxuICAgIFwicmF3U3BlY1wiOiBcIl4xLjAuNzJcIixcbiAgICBcInNhdmVTcGVjXCI6IG51bGwsXG4gICAgXCJmZXRjaFNwZWNcIjogXCJeMS4wLjcyXCJcbiAgfSxcbiAgXCJfcmVxdWlyZWRCeVwiOiBbXG4gICAgXCIjVVNFUlwiLFxuICAgIFwiL1wiXG4gIF0sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvcXVpY2tkb20vLS9xdWlja2RvbS0xLjAuODEudGd6XCIsXG4gIFwiX3NoYXN1bVwiOiBcIjliNjBjYzdmMzEyNWI2N2E3ZGJlZWFhZDk5OTg5NGQzNGY2NmY5YzVcIixcbiAgXCJfc3BlY1wiOiBcInF1aWNrZG9tQF4xLjAuNzJcIixcbiAgXCJfd2hlcmVcIjogXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJkYW5pZWxrYWxlblwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9xdWlja2RvbS5kZWJ1Zy5qc1wiLFxuICAgIFwiLi9kaXN0L3F1aWNrZG9tLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tkb20vaXNzdWVzXCJcbiAgfSxcbiAgXCJidW5kbGVEZXBlbmRlbmNpZXNcIjogZmFsc2UsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBkYW5pZWxrYWxlbi9pc1wiOiBcIl4yLjAuMFwiLFxuICAgIFwicXVpY2tjc3NcIjogXCJeMS4zLjRcIixcbiAgICBcInNtYXJ0LWV4dGVuZFwiOiBcIl4xLjcuM1wiXG4gIH0sXG4gIFwiZGVwcmVjYXRlZFwiOiBmYWxzZSxcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkZhc3QgJiBsaWdodCBET00gZWxlbWVudCBtYW5hZ2VtZW50IHN1cHBvcnRpbmcganF1ZXJ5LWxpa2UgbWV0aG9kcywgdGVtcGxhdGVzLCAmIHN0YXRlLWJhc2VkIHN0eWxpbmdcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy41LjBcIixcbiAgICBcImNoYWxrXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJjb2ZmZWUtc2NyaXB0XCI6IFwiXjEuMTIuNlwiLFxuICAgIFwiZXhlY2FcIjogXCJeMC43LjBcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4zXCIsXG4gICAgXCJwcm9taXNlLWJyZWFrXCI6IFwiXjAuMS4yXCIsXG4gICAgXCJzZW12ZXJcIjogXCJeNS4zLjBcIlxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2RvbSNyZWFkbWVcIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwibWFpblwiOiBcImRpc3QvcXVpY2tkb20uanNcIixcbiAgXCJuYW1lXCI6IFwicXVpY2tkb21cIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tkb20uZ2l0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLi8uY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwibnBtIHJ1biB0ZXN0OnRyYXZpc1wiLFxuICAgIFwidGVzdFwiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6YnJvd3NlclwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBFbGVjdHJvbiAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmNocm9tZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgQ2hyb21lIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6ZmlyZWZveFwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBGaXJlZm94IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6a2FybWFcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmxvY2FsXCI6IFwib3BlbiB0ZXN0L3Rlc3RydW5uZXIuaHRtbFwiLFxuICAgIFwidGVzdDptaW5pZmllZFwiOiBcIm1pbmlmaWVkPTEgbnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnRyYXZpc1wiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zICYmIG5wbSBydW4gdGVzdDptaW5pZmllZCAtc1wiLFxuICAgIFwid2F0Y2hcIjogXCJjYWtlIC1kIHdhdGNoXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXN1cGVyXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktcmVuYW1lXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc2ltcGxlXCJcbiAgICBdXG4gIH0sXG4gIFwidmVyc2lvblwiOiBcIjEuMC44MVwiXG59XG4iLCJJUyA9IF8kc20oJ0BkYW5pZWxrYWxlbi9pcycgKVxuSVMgPSBJUy5jcmVhdGUoJ25hdGl2ZXMnLCdkb20nKVxuSVMubG9hZFxuXHRmaWVsZDogKHRhcmdldCktPiB0YXJnZXQgYW5kIHRhcmdldCBpbnN0YW5jZW9mIHJlcXVpcmUoJy4vZmllbGQnKVxuXHRyZWdleDogKHRhcmdldCktPiB0YXJnZXQgaW5zdGFuY2VvZiBSZWdFeHBcblx0b2JqZWN0YWJsZTogKHRhcmdldCktPiBJUy5vYmplY3QodGFyZ2V0KSBvciBJUy5mdW5jdGlvbih0YXJnZXQpXG5cbm1vZHVsZS5leHBvcnRzID0gSVMiLCJleHRlbmQgPSByZXF1aXJlICcuL2V4dGVuZCdcblxubm9ybWFsaXplS2V5cyA9IChrZXlzKS0+IGlmIGtleXNcblx0b3V0cHV0ID0ge31cblx0aWYgdHlwZW9mIGtleXMgaXNudCAnb2JqZWN0J1xuXHRcdG91dHB1dFtrZXlzXSA9IHRydWVcblx0ZWxzZVxuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhrZXlzKSBpZiBub3QgQXJyYXkuaXNBcnJheShrZXlzKVxuXHRcdG91dHB1dFtrZXldID0gdHJ1ZSBmb3Iga2V5IGluIGtleXNcblxuXHRyZXR1cm4gb3V0cHV0XG5cblxubmV3QnVpbGRlciA9IChpc0Jhc2UpLT5cblx0YnVpbGRlciA9ICh0YXJnZXQpLT5cblx0XHRFWFBBTkRfQVJHVU1FTlRTKHNvdXJjZXMpXG5cdFx0aWYgYnVpbGRlci5vcHRpb25zLnRhcmdldFxuXHRcdFx0dGhlVGFyZ2V0ID0gYnVpbGRlci5vcHRpb25zLnRhcmdldFxuXHRcdGVsc2Vcblx0XHRcdHRoZVRhcmdldCA9IHRhcmdldFxuXHRcdFx0c291cmNlcy5zaGlmdCgpXG5cdFx0XG5cdFx0ZXh0ZW5kKGJ1aWxkZXIub3B0aW9ucywgdGhlVGFyZ2V0LCBzb3VyY2VzKVxuXHRcblx0YnVpbGRlci5pc0Jhc2UgPSB0cnVlIGlmIGlzQmFzZVxuXHRidWlsZGVyLm9wdGlvbnMgPSB7fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyhidWlsZGVyLCBtb2RpZmllcnMpXG5cdHJldHVybiBidWlsZGVyXG5cblxubW9kaWZpZXJzID0gXG5cdCdkZWVwJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLmRlZXAgPSB0cnVlXG5cdFx0cmV0dXJuIF9cblxuXHQnb3duJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLm93biA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdhbGxvd051bGwnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMuYWxsb3dOdWxsID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J251bGxEZWxldGVzJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLm51bGxEZWxldGVzID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J2NvbmNhdCc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5jb25jYXQgPSB0cnVlXG5cdFx0cmV0dXJuIF9cblxuXHQnY2xvbmUnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMudGFyZ2V0ID0ge31cblx0XHRyZXR1cm4gX1xuXG5cdCdub3REZWVwJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuIChrZXlzKS0+XG5cdFx0XHRfLm9wdGlvbnMubm90RGVlcCA9IG5vcm1hbGl6ZUtleXMoa2V5cylcdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblx0J2RlZXBPbmx5JzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuIChrZXlzKS0+XG5cdFx0XHRfLm9wdGlvbnMuZGVlcE9ubHkgPSBub3JtYWxpemVLZXlzKGtleXMpXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cdCdrZXlzJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuIChrZXlzKS0+XG5cdFx0XHRfLm9wdGlvbnMua2V5cyA9IG5vcm1hbGl6ZUtleXMoa2V5cylcdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblx0J25vdEtleXMnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKGtleXMpLT5cblx0XHRcdF8ub3B0aW9ucy5ub3RLZXlzID0gbm9ybWFsaXplS2V5cyhrZXlzKVx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXHQndHJhbnNmb3JtJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuICh0cmFuc2Zvcm0pLT5cblx0XHRcdGlmIHR5cGVvZiB0cmFuc2Zvcm0gaXMgJ2Z1bmN0aW9uJ1xuXHRcdFx0XHRfLm9wdGlvbnMuZ2xvYmFsVHJhbnNmb3JtID0gdHJhbnNmb3JtXG5cdFx0XHRlbHNlIGlmIHRyYW5zZm9ybSBhbmQgdHlwZW9mIHRyYW5zZm9ybSBpcyAnb2JqZWN0J1xuXHRcdFx0XHRfLm9wdGlvbnMudHJhbnNmb3JtcyA9IHRyYW5zZm9ybVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cblx0J2ZpbHRlcic6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoZmlsdGVyKS0+XG5cdFx0XHRpZiB0eXBlb2YgZmlsdGVyIGlzICdmdW5jdGlvbidcblx0XHRcdFx0Xy5vcHRpb25zLmdsb2JhbEZpbHRlciA9IGZpbHRlclxuXHRcdFx0ZWxzZSBpZiBmaWx0ZXIgYW5kIHR5cGVvZiBmaWx0ZXIgaXMgJ29iamVjdCdcblx0XHRcdFx0Xy5vcHRpb25zLmZpbHRlcnMgPSBmaWx0ZXJcblx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IG5ld0J1aWxkZXIodHJ1ZSlcbmV4cG9ydHMudmVyc2lvbiA9IGltcG9ydCAnLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbiciLCJ7XG4gIFwiX2FyZ3NcIjogW1xuICAgIFtcbiAgICAgIFwic21hcnQtZXh0ZW5kQDEuNy4zXCIsXG4gICAgICBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIlxuICAgIF1cbiAgXSxcbiAgXCJfZnJvbVwiOiBcInNtYXJ0LWV4dGVuZEAxLjcuM1wiLFxuICBcIl9pZFwiOiBcInNtYXJ0LWV4dGVuZEAxLjcuM1wiLFxuICBcIl9pbkJ1bmRsZVwiOiBmYWxzZSxcbiAgXCJfaW50ZWdyaXR5XCI6IFwic2hhNTEyLVBWRUVWWUREenl4S0EwR05GTGNXWTZvSlNrUUtkYzF3NzE4ZVFwRUhjTnVUU1dZeERLMzVHemhzR2hNa1VVOGxCSWdTRURidDV4NXA0NnBSejNBdWJBPT1cIixcbiAgXCJfbG9jYXRpb25cIjogXCIvc21hcnQtZXh0ZW5kXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJ2ZXJzaW9uXCIsXG4gICAgXCJyZWdpc3RyeVwiOiB0cnVlLFxuICAgIFwicmF3XCI6IFwic21hcnQtZXh0ZW5kQDEuNy4zXCIsXG4gICAgXCJuYW1lXCI6IFwic21hcnQtZXh0ZW5kXCIsXG4gICAgXCJlc2NhcGVkTmFtZVwiOiBcInNtYXJ0LWV4dGVuZFwiLFxuICAgIFwicmF3U3BlY1wiOiBcIjEuNy4zXCIsXG4gICAgXCJzYXZlU3BlY1wiOiBudWxsLFxuICAgIFwiZmV0Y2hTcGVjXCI6IFwiMS43LjNcIlxuICB9LFxuICBcIl9yZXF1aXJlZEJ5XCI6IFtcbiAgICBcIi9cIixcbiAgICBcIi9xdWlja2RvbVwiLFxuICAgIFwiL3NpbXBseXdhdGNoXCJcbiAgXSxcbiAgXCJfcmVzb2x2ZWRcIjogXCJodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy9zbWFydC1leHRlbmQvLS9zbWFydC1leHRlbmQtMS43LjMudGd6XCIsXG4gIFwiX3NwZWNcIjogXCIxLjcuM1wiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcImRhbmllbGthbGVuXCJcbiAgfSxcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3NtYXJ0LWV4dGVuZC5kZWJ1Zy5qc1wiLFxuICAgIFwiLi9kaXN0L3NtYXJ0LWV4dGVuZC5qc1wiOiBcInNyYy9pbmRleC5jb2ZmZWVcIlxuICB9LFxuICBcImJyb3dzZXJpZnlcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwic2ltcGx5aW1wb3J0L2NvbXBhdFwiXG4gICAgXVxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3NtYXJ0LWV4dGVuZC9pc3N1ZXNcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJmYWxhZmVsXCI6IFwiXjIuMS4wXCJcbiAgfSxcbiAgXCJkZXNjcmlwdGlvblwiOiBcIk1lcmdlL2V4dGVuZCBvYmplY3RzIChzaGFsbG93L2RlZXApIHdpdGggZ2xvYmFsL2luZGl2aWR1YWwgZmlsdGVycyBhbmQgbW9yZSBmZWF0dXJlc1wiLFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJiYWRnZS1nZW5cIjogXCJeMS4wLjJcIixcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNC43XCIsXG4gICAgXCJjaGFpXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjb2ZmZWUtcmVnaXN0ZXJcIjogXCJeMC4xLjBcIixcbiAgICBcImNvZmZlZWlmeS1jYWNoZWRcIjogXCJeMi4xLjFcIixcbiAgICBcImV4dGVuZFwiOiBcIl4zLjAuMVwiLFxuICAgIFwiZ29vZ2xlLWNsb3N1cmUtY29tcGlsZXItanNcIjogXCJeMjAxNzA2MjYuMC4wXCIsXG4gICAgXCJtb2NoYVwiOiBcIl4zLjIuMFwiLFxuICAgIFwic2ltcGx5aW1wb3J0XCI6IFwiXjQuMC4wLXMyMVwiLFxuICAgIFwic2ltcGx5d2F0Y2hcIjogXCJeMy4wLjAtbDJcIixcbiAgICBcInVnbGlmeS1qc1wiOiBcIl4zLjAuMjRcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3NtYXJ0LWV4dGVuZCNyZWFkbWVcIixcbiAgXCJrZXl3b3Jkc1wiOiBbXG4gICAgXCJleHRlbmRcIixcbiAgICBcImNsb25lXCIsXG4gICAgXCJmaWx0ZXJcIixcbiAgICBcInNlbGVjdGl2ZVwiLFxuICAgIFwibWVyZ2VcIixcbiAgICBcImFzc2lnblwiLFxuICAgIFwicHJvcGVydGllc1wiXG4gIF0sXG4gIFwibGljZW5zZVwiOiBcIklTQ1wiLFxuICBcIm1haW5cIjogXCJkaXN0L3NtYXJ0LWV4dGVuZC5qc1wiLFxuICBcIm1vY2hhX29wdHNcIjogXCItdSB0ZGQgLS1jb21waWxlcnMgY29mZmVlOmNvZmZlZS1yZWdpc3RlciAtLXNsb3cgMTAwMCAtLXRpbWVvdXQgNTAwMFwiLFxuICBcIm5hbWVcIjogXCJzbWFydC1leHRlbmRcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vc21hcnQtZXh0ZW5kLmdpdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcIm1rZGlyIC1wIGRpc3QvOyBucG0gcnVuIGJ1aWxkOmRlYnVnICYmIG5wbSBydW4gYnVpbGQ6cmVsZWFzZVwiLFxuICAgIFwiYnVpbGQ6ZGVidWdcIjogXCJzaW1wbHlpbXBvcnQgYnVuZGxlIHNyYy9pbmRleC5jb2ZmZWUgLWQgLS10YXJnZXQgbm9kZSAtLXVtZCBzbWFydC1leHRlbmQgPiBkaXN0L3NtYXJ0LWV4dGVuZC5kZWJ1Zy5qc1wiLFxuICAgIFwiYnVpbGQ6cmVsZWFzZVwiOiBcInNpbXBseWltcG9ydCBidW5kbGUgc3JjL2luZGV4LmNvZmZlZSAtLXRhcmdldCBub2RlIC0tdW1kIHNtYXJ0LWV4dGVuZCA+IGRpc3Qvc21hcnQtZXh0ZW5kLmpzXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcIm5wbSBydW4gY292ZXJhZ2U6cnVuICYmIG5wbSBydW4gY292ZXJhZ2U6YmFkZ2VcIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC5jb25maWcvYmFkZ2VzL2NvdmVyYWdlXCIsXG4gICAgXCJjb3ZlcmFnZTpydW5cIjogXCJmb3JDb3ZlcmFnZT10cnVlIGlzdGFuYnVsIGNvdmVyIC0tZGlyIGNvdmVyYWdlIG5vZGVfbW9kdWxlcy9tb2NoYS9iaW4vX21vY2hhIC0tICRucG1fcGFja2FnZV9tb2NoYV9vcHRzXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJwb3N0dmVyc2lvblwiOiBcIm5wbSBydW4gYnVpbGQgJiYgZ2l0IGFkZCAuICYmIGdpdCBjb21taXQgLWEgLW0gJ1tCdWlsZF0nXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcIkNJPTEgbnBtIHJ1biB0ZXN0XCIsXG4gICAgXCJ0ZXN0XCI6IFwibW9jaGEgJG5wbV9wYWNrYWdlX21vY2hhX29wdHNcIixcbiAgICBcIndhdGNoXCI6IFwic2ltcGx5d2F0Y2ggLWcgJ3NyYy8qJyAteCAnbnBtIHJ1biBidWlsZDpkZWJ1ZyAtcydcIlxuICB9LFxuICBcInNpbXBseWltcG9ydFwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJjb2ZmZWVpZnktY2FjaGVkXCIsXG4gICAgICBcIi4vLmNvbmZpZy90cmFuc2Zvcm1zL21hY3Jvc1wiXG4gICAgXSxcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjcuM1wiXG59XG4iLCJDU1MgPSBfJHNtKCdxdWlja2NzcycgKVxubW9kdWxlLmV4cG9ydHMgPSAoKS0+XG4gICAgQ1NTLmFuaW1hdGlvbiAnY2hlY2ttYXJrQW5pbWF0ZVN1Y2Nlc3NUaXAnLFxuICAgICAgICAnMCUsIDU0JSc6ICB7d2lkdGg6MCwgbGVmdDowLCB0b3A6M31cbiAgICAgICAgJzcwJSc6ICAgICAge3dpZHRoOjE0LCBsZWZ0Oi0yLCB0b3A6OH1cbiAgICAgICAgJzg0JSc6ICAgICAge3dpZHRoOjUsIGxlZnQ6NSwgdG9wOjEwfVxuICAgICAgICAnMTAwJSc6ICAgICB7d2lkdGg6OCwgbGVmdDozLCB0b3A6MTB9XG5cblxuICAgIENTUy5hbmltYXRpb24gJ2NoZWNrbWFya0FuaW1hdGVTdWNjZXNzTG9uZycsXG4gICAgICAgICcwJSwgNjUlJzogIHt3aWR0aDowLCByaWdodDoxMiwgdG9wOjEyfVxuICAgICAgICAnODQlJzogICAgICB7d2lkdGg6MTQsIHJpZ2h0OjAsIHRvcDo3fVxuICAgICAgICAnMTAwJSc6ICAgICB7d2lkdGg6MTIsIHJpZ2h0OjIsIHRvcDo4fVxuXG5cbiAgICBDU1MuYW5pbWF0aW9uICdjaGVja21hcmtBbmltYXRlRXJyb3InLFxuICAgICAgICAnMCUsIDY1JSc6ICB0cmFuc2Zvcm06ICdzY2FsZSgwLjQpJywgb3BhY2l0eTogMFxuICAgICAgICAnODQlJzogICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjE1KSdcbiAgICAgICAgJzEwMCUnOiAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknXG5cblxuICAgIENTUy5hbmltYXRpb24gJ2NoZWNrbWFya1JvdGF0ZVBsYWNlaG9sZGVyJyxcbiAgICAgICAgJzAlLCA1JSc6ICAgdHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG4gICAgICAgICcxMiUsIDEwMCUnOnRyYW5zZm9ybTogJ3JvdGF0ZSgtNDA1ZGVnKSdcblxuXG4gICAgQ1NTLmFuaW1hdGlvbiAnZmllbGRFcnJvclNoYWtlJyxcbiAgICAgICAgJzAlLCA1MCUnOiAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtMTBweCknXG4gICAgICAgICcyNSUsIDc1JSc6IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMTBweCknXG4gICAgICAgICcxMDAlJzogICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMHB4KSdcblxuICAgIG1vZHVsZS5leHBvcnRzID0gKCktPlxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFsnX2dldFZhbHVlJywgJ19zZXRWYWx1ZScsICdfdmFsaWRhdGUnXTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSmpiMjV6ZEdGdWRITXZjbVZ4Um1sbGJHUk5aWFJvYjJSekxtTnZabVpsWlNJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYlhYMD0iLCJoZWxwZXJzID0gaW1wb3J0ICcuLi9oZWxwZXJzJ1xuSVMgPSBpbXBvcnQgJy4uL2NoZWNrcydcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuZmFzdGRvbSA9IGltcG9ydCAnZmFzdGRvbSdcblNpbXBseUJpbmQgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kJ1xuQ29uZGl0aW9uID0gaW1wb3J0ICcuLi9jb21wb25lbnRzL2NvbmRpdGlvbidcbmN1cnJlbnRJRCA9IDBcblxuY2xhc3MgRmllbGRcblx0QGluc3RhbmNlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0QHNoYWxsb3dTZXR0aW5ncyA9IFsndGVtcGxhdGVzJywgJ2ZpZWxkSW5zdGFuY2VzJywgJ3ZhbHVlJywgJ2RlZmF1bHRWYWx1ZSddXG5cdEB0cmFuc2Zvcm1TZXR0aW5ncyA9IGltcG9ydCAnLi90cmFuc2Zvcm1TZXR0aW5ncydcblx0Y29yZVZhbHVlUHJvcDogJ192YWx1ZSdcblx0Z2xvYmFsRGVmYXVsdHM6IGltcG9ydCAnLi9nbG9iYWxEZWZhdWx0cydcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyBGaWVsZDo6LFxuXHRcdCdyZW1vdmVMaXN0ZW5lcic6IGdldDogKCktPiBAb2ZmXG5cdFx0J2Vscyc6IGdldDogKCktPiBAZWwuY2hpbGRcblx0XHQndmFsdWVSYXcnOiBnZXQ6ICgpLT4gQF92YWx1ZVxuXHRcdCd2YWx1ZSc6XG5cdFx0XHRnZXQ6ICgpLT4gaWYgQHNldHRpbmdzLmdldHRlciB0aGVuIEBzZXR0aW5ncy5nZXR0ZXIoQF9nZXRWYWx1ZSgpKSBlbHNlIEBfZ2V0VmFsdWUoKVxuXHRcdFx0c2V0OiAodmFsdWUpLT4gQF9zZXRWYWx1ZShpZiBAc2V0dGluZ3Muc2V0dGVyIHRoZW4gQHNldHRpbmdzLnNldHRlcih2YWx1ZSkgZWxzZSB2YWx1ZSlcblx0XG5cdGNvbnN0cnVjdG9yOiAoc2V0dGluZ3MsIEBidWlsZGVyLCBzZXR0aW5nT3ZlcnJpZGVzLCB0ZW1wbGF0ZU92ZXJyaWRlcyktPlxuXHRcdGlmIHNldHRpbmdPdmVycmlkZXNcblx0XHRcdEBnbG9iYWxEZWZhdWx0cyA9IHNldHRpbmdPdmVycmlkZXMuZ2xvYmFsRGVmYXVsdHMgaWYgc2V0dGluZ092ZXJyaWRlcy5nbG9iYWxEZWZhdWx0c1xuXHRcdFx0QGRlZmF1bHRzID0gc2V0dGluZ092ZXJyaWRlc1tzZXR0aW5ncy50eXBlXSBpZiBzZXR0aW5nT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdXG5cdFx0aWYgdGVtcGxhdGVPdmVycmlkZXMgYW5kIHRlbXBsYXRlT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdXG5cdFx0XHRAdGVtcGxhdGVzID0gdGVtcGxhdGVPdmVycmlkZXNbc2V0dGluZ3MudHlwZV1cblx0XHRcdEB0ZW1wbGF0ZSA9IHRlbXBsYXRlT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdLmRlZmF1bHRcblxuXHRcdHNoYWxsb3dTZXR0aW5ncyA9IGlmIEBzaGFsbG93U2V0dGluZ3MgdGhlbiBGaWVsZC5zaGFsbG93U2V0dGluZ3MuY29uY2F0KEBzaGFsbG93U2V0dGluZ3MpIGVsc2UgRmllbGQuc2hhbGxvd1NldHRpbmdzXG5cdFx0dHJhbnNmb3JtU2V0dGluZ3MgPSBpZiBAdHJhbnNmb3JtU2V0dGluZ3MgdGhlbiBGaWVsZC50cmFuc2Zvcm1TZXR0aW5ncy5jb25jYXQoQHRyYW5zZm9ybVNldHRpbmdzKSBlbHNlIEZpZWxkLnRyYW5zZm9ybVNldHRpbmdzXG5cblx0XHRAc2V0dGluZ3MgPSBleHRlbmQuZGVlcC5jbG9uZS5ub3REZWVwKHNoYWxsb3dTZXR0aW5ncykudHJhbnNmb3JtKHRyYW5zZm9ybVNldHRpbmdzKShAZ2xvYmFsRGVmYXVsdHMsIEBkZWZhdWx0cywgc2V0dGluZ3MpXG5cdFx0QElEID0gQHNldHRpbmdzLklEIG9yIGN1cnJlbnRJRCsrKycnXG5cdFx0QHR5cGUgPSBzZXR0aW5ncy50eXBlXG5cdFx0QG5hbWUgPSBzZXR0aW5ncy5uYW1lXG5cdFx0QGFsbEZpZWxkcyA9IEBzZXR0aW5ncy5maWVsZEluc3RhbmNlcyBvciBGaWVsZC5pbnN0YW5jZXNcblx0XHRAX3ZhbHVlID0gbnVsbFxuXHRcdEBfZXZlbnRDYWxsYmFja3MgPSB7fVxuXHRcdEBzdGF0ZSA9XG5cdFx0XHR2YWxpZDogdHJ1ZVxuXHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0Zm9jdXNlZDogZmFsc2Vcblx0XHRcdGhvdmVyZWQ6IGZhbHNlXG5cdFx0XHRmaWxsZWQ6IGZhbHNlXG5cdFx0XHRpbnRlcmFjdGVkOiBmYWxzZVxuXHRcdFx0aXNNb2JpbGU6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogQHNldHRpbmdzLmRpc2FibGVkXG5cdFx0XHRtYXJnaW46IEBzZXR0aW5ncy5tYXJnaW5cblx0XHRcdHBhZGRpbmc6IEBzZXR0aW5ncy5wYWRkaW5nXG5cdFx0XHR3aWR0aDogQHNldHRpbmdzLndpZHRoXG5cdFx0XHRzaG93TGFiZWw6IEBzZXR0aW5ncy5sYWJlbFxuXHRcdFx0bGFiZWw6IEBzZXR0aW5ncy5sYWJlbFxuXHRcdFx0c2hvd0hlbHA6IEBzZXR0aW5ncy5oZWxwXG5cdFx0XHRoZWxwOiBAc2V0dGluZ3MuaGVscFxuXHRcdFx0c2hvd0Vycm9yOiBmYWxzZVxuXHRcdFx0ZXJyb3I6IEBzZXR0aW5ncy5lcnJvclxuXG5cdFx0aWYgSVMuZGVmaW5lZChAc2V0dGluZ3MucGxhY2Vob2xkZXIpXG5cdFx0XHRAc3RhdGUucGxhY2Vob2xkZXIgPSBAc2V0dGluZ3MucGxhY2Vob2xkZXJcblxuXHRcdGlmIElTLm51bWJlcihAc2V0dGluZ3Mud2lkdGgpIGFuZCBAc2V0dGluZ3Mud2lkdGggPD0gMVxuXHRcdFx0QHN0YXRlLndpZHRoID0gXCIje0BzZXR0aW5ncy53aWR0aCoxMDB9JVwiXG5cblx0XHRpZiBAc2V0dGluZ3MuY29uZGl0aW9ucz8ubGVuZ3RoXG5cdFx0XHRAc3RhdGUudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRDb25kaXRpb24uaW5pdChALCBAc2V0dGluZ3MuY29uZGl0aW9ucylcblxuXHRcdGNvbnNvbGU/Lndhcm4oXCJEdXBsaWNhdGUgZmllbGQgSURzIGZvdW5kOiAnI3tASUR9J1wiKSBpZiBAYWxsRmllbGRzW0BJRF1cblx0XHRAYWxsRmllbGRzW0BJRF0gPSBAXG5cblxuXHRfY29uc3RydWN0b3JFbmQ6ICgpLT5cblx0XHRAZWwuY2hpbGRmIy5maWVsZC5vbiAnaW5zZXJ0ZWQnLCAoKT0+IEBlbWl0KCdpbnNlcnRlZCcpXG5cdFx0QGVsLnJhdy5pZCA9IEBJRCBpZiBAc2V0dGluZ3MuSURcblxuXHRcdEBzZXR0aW5ncy5kZWZhdWx0VmFsdWUgPz0gQHNldHRpbmdzLnZhbHVlIGlmIEBzZXR0aW5ncy52YWx1ZT9cblx0XHRpZiBAc2V0dGluZ3MuZGVmYXVsdFZhbHVlP1xuXHRcdFx0QHZhbHVlID0gaWYgQHNldHRpbmdzLm11bHRpcGxlIHRoZW4gW10uY29uY2F0KEBzZXR0aW5ncy5kZWZhdWx0VmFsdWUpIGVsc2UgQHNldHRpbmdzLmRlZmF1bHRWYWx1ZVxuXG5cdFx0U2ltcGx5QmluZCgnc2hvd0Vycm9yJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ2hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudHJhbnNmb3JtIChzaG93KT0+XG5cdFx0XHRcdGlmIHNob3cgYW5kIEBzdGF0ZS5lcnJvciBhbmQgSVMuc3RyaW5nKEBzdGF0ZS5lcnJvcilcblx0XHRcdFx0XHRAc3RhdGUuZXJyb3Jcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBzZXR0aW5ncy5oZWxwIG9yIEBzdGF0ZS5oZWxwXG5cblx0XHRTaW1wbHlCaW5kKCdlcnJvcicsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCdoZWxwJykub2YoQHN0YXRlKVxuXHRcdFx0LmNvbmRpdGlvbiAoZXJyb3IpPT4gZXJyb3IgYW5kIEBzdGF0ZS5zaG93RXJyb3JcblxuXHRcdFNpbXBseUJpbmQoJ2hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ2h0bWwnKS5vZihAZWwuY2hpbGQuaGVscClcblx0XHRcdC5hbmQudG8oJ3Nob3dIZWxwJykub2YoQHN0YXRlKVxuXG5cdFx0U2ltcGx5QmluZCgnbGFiZWwnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ3RleHQnKS5vZihAZWwuY2hpbGQubGFiZWwpXG5cdFx0XHQuYW5kLnRvKCdzaG93TGFiZWwnKS5vZihAc3RhdGUpXG5cblx0XHRTaW1wbHlCaW5kKCdtYXJnaW4nKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gQGVsLnN0eWxlLmJpbmQoQGVsLCAnbWFyZ2luJylcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdwYWRkaW5nJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvIEBlbC5zdHlsZS5iaW5kKEBlbCwgJ3BhZGRpbmcnKVxuXG5cdFx0U2ltcGx5QmluZCgnc2hvd0hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gKHNob3csIHByZXZTaG93KT0+XG5cdFx0XHRcdGNoYW5nZUFtb3VudCA9IGlmICEhc2hvdyBpcyAhIXByZXZTaG93IHRoZW4gMCBlbHNlIGlmIHNob3cgdGhlbiAyMCBlbHNlIGlmIHByZXZTaG93IHRoZW4gLTIwXG5cdFx0XHRcdEBzdGF0ZS5tYXJnaW4gPSBoZWxwZXJzLnVwZGF0ZVNob3J0aGFuZFZhbHVlKEBzdGF0ZS5tYXJnaW4sICdib3R0b20nLCBjaGFuZ2VBbW91bnQpIGlmIGNoYW5nZUFtb3VudFxuXG5cdFx0U2ltcGx5QmluZCgnZm9jdXNlZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHN0YXRlKS50byAoZm9jdXNlZCk9PlxuXHRcdFx0QGVtaXQoaWYgZm9jdXNlZCB0aGVuICdmb2N1cycgZWxzZSAnYmx1cicpXG5cblx0XHRpZiBAc2V0dGluZ3MubW9iaWxlV2lkdGhcblx0XHRcdFNpbXBseUJpbmQgKCk9PlxuXHRcdFx0XHRmYXN0ZG9tLm1lYXN1cmUgKCk9PiBAc3RhdGUuaXNNb2JpbGUgPSB3aW5kb3cuaW5uZXJXaWR0aCA8PSBAc2V0dGluZ3MubW9iaWxlVGhyZXNob2xkXG5cdFx0XHQudXBkYXRlT24oJ2V2ZW50OnJlc2l6ZScpLm9mKHdpbmRvdylcblxuXHRcdHJldHVybiBAZWwucmF3Ll9xdWlja0ZpZWxkID0gQFxuXG5cblx0X2Zvcm1hdFdpZHRoOiAod2lkdGgpLT5cblx0XHR3aWR0aCA9IGlmIEBzdGF0ZS5pc01vYmlsZSB0aGVuIChAc2V0dGluZ3MubW9iaWxlV2lkdGggb3Igd2lkdGgpIGVsc2Ugd2lkdGhcblx0XHR3aWR0aCA9IFwiY2FsYygje3dpZHRofSAtICN7QHNldHRpbmdzLmRpc3RhbmNlfXB4KVwiIGlmIEBzZXR0aW5ncy5kaXN0YW5jZVxuXHRcdHJldHVybiB3aWR0aFxuXG5cblxuXG5cblxuXG5cblx0YXBwZW5kVG86ICh0YXJnZXQpLT5cblx0XHRAZWwuYXBwZW5kVG8odGFyZ2V0KTsgXHRcdHJldHVybiBAXG5cblx0cHJlcGVuZFRvOiAodGFyZ2V0KS0+XG5cdFx0QGVsLnByZXBlbmRUbyh0YXJnZXQpOyBcdFx0cmV0dXJuIEBcblxuXHRpbnNlcnRBZnRlcjogKHRhcmdldCktPlxuXHRcdEBlbC5pbnNlcnRBZnRlcih0YXJnZXQpOyBcdHJldHVybiBAXG5cblx0aW5zZXJ0QmVmb3JlOiAodGFyZ2V0KS0+XG5cdFx0QGVsLmluc2VydEJlZm9yZSh0YXJnZXQpOyBcdHJldHVybiBAXG5cblx0ZGV0YWNoOiAodGFyZ2V0KS0+XG5cdFx0QGVsLmRldGFjaCh0YXJnZXQpOyBcdFx0cmV0dXJuIEBcblxuXHRyZW1vdmU6ICgpLT5cblx0XHRAZWwucmVtb3ZlKClcblx0XHRyZXR1cm4gQGRlc3Ryb3koZmFsc2UpXG5cblx0ZGVzdHJveTogKHJlbW92ZUZyb21ET009dHJ1ZSktPlxuXHRcdFNpbXBseUJpbmQudW5CaW5kQWxsKEApXG5cdFx0U2ltcGx5QmluZC51bkJpbmRBbGwoQHN0YXRlKVxuXHRcdFNpbXBseUJpbmQudW5CaW5kQWxsKEBlbClcblx0XHRTaW1wbHlCaW5kLnVuQmluZEFsbChjaGlsZCkgZm9yIGNoaWxkIGluIEBlbC5jaGlsZFxuXHRcdEBlbC5yZW1vdmUoKSBpZiByZW1vdmVGcm9tRE9NXG5cdFx0QF9kZXN0cm95KCkgaWYgQF9kZXN0cm95XG5cdFx0ZGVsZXRlIEBhbGxGaWVsZHNbQElEXVxuXHRcdHJldHVybiB0cnVlXG5cblx0b246IChldmVudE5hbWVzLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSktPlxuXHRcdEBlbC5vbi5jYWxsKEBlbCwgZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUsIHRydWUpXG5cdFx0cmV0dXJuIEBcblxuXHRvZmY6ICgpLT5cblx0XHRAZWwub2ZmLmFwcGx5KEBlbCwgYXJndW1lbnRzKVxuXHRcdHJldHVybiBAXG5cblx0ZW1pdDogKCktPlxuXHRcdEBlbC5lbWl0UHJpdmF0ZS5hcHBseShAZWwsIGFyZ3VtZW50cylcblx0XHRyZXR1cm4gQFxuXG5cdHZhbGlkYXRlOiAocHJvdmlkZWRWYWx1ZT1AW0Bjb3JlVmFsdWVQcm9wXSwgdGVzdFVucmVxdWlyZWQpLT5cblx0XHRpc1ZhbGlkID0gc3dpdGNoXG5cdFx0XHR3aGVuIEBzZXR0aW5ncy52YWxpZGF0b3IgdGhlbiBAc2V0dGluZ3MudmFsaWRhdG9yKHByb3ZpZGVkVmFsdWUpXG5cdFx0XHRcblx0XHRcdHdoZW4gbm90IEBzZXR0aW5ncy5yZXF1aXJlZCBhbmQgbm90IHRlc3RVbnJlcXVpcmVkIHRoZW4gdHJ1ZVxuXG5cdFx0XHR3aGVuIEBfdmFsaWRhdGUocHJvdmlkZWRWYWx1ZSwgdGVzdFVucmVxdWlyZWQpIGlzIGZhbHNlIHRoZW4gZmFsc2VcblxuXHRcdFx0d2hlbiBAc2V0dGluZ3MucmVxdWlyZWRcblx0XHRcdFx0aWYgQHNldHRpbmdzLm11bHRpcGxlIHRoZW4gISFwcm92aWRlZFZhbHVlPy5sZW5ndGggZWxzZSAhIXByb3ZpZGVkVmFsdWVcblx0XHRcdFxuXHRcdFx0ZWxzZSB0cnVlXG5cblx0XHRAc3RhdGUuc2hvd0Vycm9yID0gZmFsc2UgaWYgaXNWYWxpZCBhbmQgQHNldHRpbmdzLmNsZWFyRXJyb3JPblZhbGlkXG5cdFx0cmV0dXJuIGlzVmFsaWRcblxuXHR2YWxpZGF0ZUNvbmRpdGlvbnM6IChjb25kaXRpb25zKS0+XG5cdFx0aWYgY29uZGl0aW9uc1xuXHRcdFx0dG9nZ2xlVmlzaWJpbGl0eSA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0Y29uZGl0aW9ucyA9IEBjb25kaXRpb25zXG5cdFx0XHR0b2dnbGVWaXNpYmlsaXR5ID0gdHJ1ZVxuXHRcdFxuXHRcdHBhc3NlZENvbmRpdGlvbnMgPSBDb25kaXRpb24udmFsaWRhdGUoY29uZGl0aW9ucylcblx0XHRpZiB0b2dnbGVWaXNpYmlsaXR5XG5cdFx0XHRyZXR1cm4gQHN0YXRlLnZpc2libGUgPSBwYXNzZWRDb25kaXRpb25zXG5cdFx0ZWxzZSBcblx0XHRcdHJldHVybiBwYXNzZWRDb25kaXRpb25zXG5cblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRmllbGQiLCInY29uZGl0aW9ucyc6IChjb25kaXRpb25zKS0+XG5cdGlmIElTLm9iamVjdFBsYWluKGNvbmRpdGlvbnMpXG5cdFx0e3RhcmdldCwgdmFsdWV9IGZvciB0YXJnZXQsdmFsdWUgb2YgY29uZGl0aW9uc1xuXHRlbHNlIGlmIElTLmFycmF5KGNvbmRpdGlvbnMpXG5cdFx0Y29uZGl0aW9ucy5tYXAgKGl0ZW0pLT4gaWYgSVMuc3RyaW5nKGl0ZW0pIHRoZW4ge3RhcmdldDppdGVtfSBlbHNlIGl0ZW1cblxuJ2Nob2ljZXMnOiAoY2hvaWNlcyktPlxuXHRpZiBJUy5vYmplY3RQbGFpbihjaG9pY2VzKVxuXHRcdHtsYWJlbCx2YWx1ZX0gZm9yIGxhYmVsLHZhbHVlIG9mIGNob2ljZXNcblx0ZWxzZSBpZiBJUy5hcnJheShjaG9pY2VzKVxuXHRcdGNob2ljZXMubWFwIChpdGVtKS0+IGlmIG5vdCBJUy5vYmplY3RQbGFpbihpdGVtKSB0aGVuIHtsYWJlbDppdGVtLCB2YWx1ZTppdGVtfSBlbHNlIGl0ZW1cblxuJ3ZhbGlkV2hlblJlZ2V4JzogKHJlZ2V4KS0+XG5cdGlmIElTLnN0cmluZyhyZWdleCkgdGhlbiBuZXcgUmVnRXhwKHJlZ2V4KSBlbHNlIHJlZ2V4IiwiRHJvcGRvd24gPSBpbXBvcnQgJy4uLy4uL2NvbXBvbmVudHMvZHJvcGRvd24nXG5NYXNrID0gaW1wb3J0ICcuLi8uLi9jb21wb25lbnRzL21hc2snXG5SRUdFWCA9IGltcG9ydCAnLi4vLi4vY29uc3RhbnRzL3JlZ2V4J1xuS0VZQ09ERVMgPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9rZXlDb2RlcydcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5JUyA9IGltcG9ydCAnLi4vLi4vY2hlY2tzJ1xuRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5pbXBvcnQgdGVtcGxhdGUsKiBhcyB0ZW1wbGF0ZXMgZnJvbSAnLi90ZW1wbGF0ZSdcbmltcG9ydCAqIGFzIGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMnXG5cbmNsYXNzIFRleHRGaWVsZCBleHRlbmRzIGltcG9ydCAnLi4vJ1xuXHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0dGVtcGxhdGVzOiB0ZW1wbGF0ZXNcblx0ZGVmYXVsdHM6IGRlZmF1bHRzXG5cblx0Y29uc3RydWN0b3I6ICgpLT5cblx0XHRzdXBlclxuXHRcdEBfdmFsdWUgPz0gJydcblx0XHRAc3RhdGUudHlwaW5nID0gZmFsc2Vcblx0XHRAY3Vyc29yID0gcHJldjowLCBjdXJyZW50OjBcblxuXHRcdGlmIG5vdCBAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXhcblx0XHRcdGlmIEBzZXR0aW5ncy5rZXlib2FyZCBpcyAnZW1haWwnIGFuZCBAc2V0dGluZ3MucmVxdWlyZWRcblx0XHRcdFx0QHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4ID0gUkVHRVguZW1haWxcblx0XHRcdGVsc2UgaWYgQHNldHRpbmdzLm1hc2sgaXMgJ05BTUUnIG9yIEBzZXR0aW5ncy5tYXNrLnBhdHRlcm4gaXMgJ05BTUUnXG5cdFx0XHRcdEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleCA9IC9eW2EtekEtWl17Mn0vXG5cdFx0XHRlbHNlIGlmIEBzZXR0aW5ncy5tYXNrIGlzICdGVUxMTkFNRScgb3IgQHNldHRpbmdzLm1hc2sucGF0dGVybiBpcyAnRlVMTE5BTUUnXG5cdFx0XHRcdEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleCA9IC9eW2EtekEtWl0rXFxzK1thLXpBLVpdKy9cblxuXHRcdGlmIG5vdCBAc2V0dGluZ3MubWFzay5wYXR0ZXJuXG5cdFx0XHRpZiBJUy5zdHJpbmcoQHNldHRpbmdzLm1hc2spXG5cdFx0XHRcdEBzZXR0aW5ncy5tYXNrID0gZXh0ZW5kLmRlZXAuY2xvbmUoQGRlZmF1bHRzLm1hc2ssIHBhdHRlcm46QHNldHRpbmdzLm1hc2spXG5cblx0XHRcdGVsc2UgaWYgSVMub2JqZWN0KEBzZXR0aW5ncy5tYXNrKVxuXHRcdFx0XHRAc2V0dGluZ3MubWFzay5wYXR0ZXJuID0gc3dpdGNoIEBzZXR0aW5ncy5rZXlib2FyZFxuXHRcdFx0XHRcdHdoZW4gJ2RhdGUnIHRoZW4gJ0RBVEUnXG5cdFx0XHRcdFx0d2hlbiAnbnVtYmVyJyB0aGVuICdOVU1CRVInXG5cdFx0XHRcdFx0d2hlbiAncGhvbmUnLCd0ZWwnIHRoZW4gJ1BIT05FJ1xuXHRcdFx0XHRcdHdoZW4gJ2VtYWlsJyB0aGVuICdFTUFJTCdcblx0XHRcdFxuXHRcdEBtYXNrID0gbmV3IE1hc2soQCwgQHNldHRpbmdzLm1hc2spIGlmIEBzZXR0aW5ncy5tYXNrLnBhdHRlcm5cblx0XHRAX2NyZWF0ZUVsZW1lbnRzKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzKClcblx0XHRAX2NvbnN0cnVjdG9yRW5kKClcblxuXG5cdF9nZXRWYWx1ZTogKCktPlxuXHRcdGlmIEBkcm9wZG93biBhbmQgQHNlbGVjdGVkIGFuZCBAX3ZhbHVlIGlzIEBzZWxlY3RlZC5sYWJlbFxuXHRcdFx0cmV0dXJuIEBzZWxlY3RlZC52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBAX3ZhbHVlXG5cblx0X3NldFZhbHVlOiAobmV3VmFsdWUpLT4gaWYgSVMuc3RyaW5nKG5ld1ZhbHVlKSBvciBJUy5udW1iZXIobmV3VmFsdWUpXG5cdFx0bmV3VmFsdWUgPSBTdHJpbmcobmV3VmFsdWUpXG5cdFx0QF92YWx1ZSA9IGlmIEBtYXNrIHRoZW4gQG1hc2suc2V0VmFsdWUobmV3VmFsdWUpIGVsc2UgbmV3VmFsdWVcblxuXHRfcmVjYWxjRGlzcGxheTogKCktPlxuXHRcdEBfdmFsdWUgPSBAX3ZhbHVlIGlmIEBzZXR0aW5ncy5hdXRvV2lkdGhcblxuXG5cdF9jcmVhdGVFbGVtZW50czogKCktPlxuXHRcdGdsb2JhbE9wdHMgPSB7cmVsYXRlZEluc3RhbmNlOkB9XG5cdFx0QGVsID0gQHRlbXBsYXRlLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuZGVmYXVsdCwgZ2xvYmFsT3B0cylcblxuXHRcdGlmIEBzZXR0aW5ncy5jaG9pY2VzXG5cdFx0XHRAZHJvcGRvd24gPSBuZXcgRHJvcGRvd24oQHNldHRpbmdzLmNob2ljZXMsIEApXG5cdFx0XHRAZHJvcGRvd24uYXBwZW5kVG8oQGVsLmNoaWxkLmlubmVyd3JhcClcblxuXHRcdGlmIEBzZXR0aW5ncy5pY29uXG5cdFx0XHR0ZW1wbGF0ZXMuaWNvbi5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmljb24sIGdsb2JhbE9wdHMpLmFwcGVuZChAc2V0dGluZ3MuaWNvbikuaW5zZXJ0QmVmb3JlKEBlbC5jaGlsZC5pbnB1dClcblxuXHRcdGlmIEBzZXR0aW5ncy5jaGVja21hcmtcblx0XHRcdHRlbXBsYXRlcy5jaGVja21hcmsuc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5jaGVja21hcmssIGdsb2JhbE9wdHMpLmluc2VydEFmdGVyKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcblx0XHRAZWwuY2hpbGQuaW5wdXQucHJvcCAndHlwZScsIHN3aXRjaCBAc2V0dGluZ3Mua2V5Ym9hcmRcblx0XHRcdHdoZW4gJ251bWJlcicsJ3RlbCcsJ3Bob25lJyB0aGVuICd0ZWwnXG5cdFx0XHR3aGVuICdwYXNzd29yZCcgdGhlbiAncGFzc3dvcmQnXG5cdFx0XHR3aGVuICd1cmwnIHRoZW4gJ3VybCdcblx0XHRcdCMgd2hlbiAnZW1haWwnIHRoZW4gJ2VtYWlsJ1xuXHRcdFx0ZWxzZSAndGV4dCdcblxuXHRcdEBlbC5zdGF0ZSAnaGFzTGFiZWwnLCBAc2V0dGluZ3MubGFiZWxcblx0XHRAZWwuY2hpbGQuaW5uZXJ3cmFwLnJhdy5fcXVpY2tGaWVsZCA9IEBlbC5jaGlsZC5pbnB1dC5yYXcuX3F1aWNrRmllbGQgPSBAXG5cdFx0cmV0dXJuIEBlbC5jaGlsZGZcblxuXG5cdF9hdHRhY2hCaW5kaW5nczogKCktPlxuXHRcdEBfYXR0YWNoQmluZGluZ3NfZWxTdGF0ZSgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5KClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXlfYXV0b1dpZHRoKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX3ZhbHVlKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX2F1dG9jb21wbGV0ZSgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc19zdGF0ZVRyaWdnZXJzKClcblx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc19lbFN0YXRlOiAoKS0+XG5cdFx0U2ltcGx5QmluZCgndmlzaWJsZScpLm9mKEBzdGF0ZSkudG8gXHQodmlzaWJsZSk9PiBAZWwuc3RhdGUgJ3Zpc2libGUnLCB2aXNpYmxlXG5cdFx0U2ltcGx5QmluZCgnaG92ZXJlZCcpLm9mKEBzdGF0ZSkudG8gXHQoaG92ZXJlZCk9PiBAZWwuc3RhdGUgJ2hvdmVyJywgaG92ZXJlZFxuXHRcdFNpbXBseUJpbmQoJ2ZvY3VzZWQnKS5vZihAc3RhdGUpLnRvIFx0KGZvY3VzZWQpPT4gQGVsLnN0YXRlICdmb2N1cycsIGZvY3VzZWRcblx0XHRTaW1wbHlCaW5kKCdmaWxsZWQnKS5vZihAc3RhdGUpLnRvIFx0XHQoZmlsbGVkKT0+IEBlbC5zdGF0ZSAnZmlsbGVkJywgZmlsbGVkXG5cdFx0U2ltcGx5QmluZCgnZGlzYWJsZWQnKS5vZihAc3RhdGUpLnRvIFx0KGRpc2FibGVkKT0+IEBlbC5zdGF0ZSAnZGlzYWJsZWQnLCBkaXNhYmxlZFxuXHRcdFNpbXBseUJpbmQoJ3Nob3dMYWJlbCcpLm9mKEBzdGF0ZSkudG8gXHQoc2hvd0xhYmVsKT0+IEBlbC5zdGF0ZSAnc2hvd0xhYmVsJywgc2hvd0xhYmVsXG5cdFx0U2ltcGx5QmluZCgnc2hvd0Vycm9yJykub2YoQHN0YXRlKS50byBcdChzaG93RXJyb3IpPT4gQGVsLnN0YXRlICdzaG93RXJyb3InLCBzaG93RXJyb3Jcblx0XHRTaW1wbHlCaW5kKCdzaG93SGVscCcpLm9mKEBzdGF0ZSkudG8gXHQoc2hvd0hlbHApPT4gQGVsLnN0YXRlICdzaG93SGVscCcsIHNob3dIZWxwXG5cdFx0U2ltcGx5QmluZCgndmFsaWQnKS5vZihAc3RhdGUpLnRvICh2YWxpZCk9PlxuXHRcdFx0QGVsLnN0YXRlICd2YWxpZCcsIHZhbGlkXG5cdFx0XHRAZWwuc3RhdGUgJ2ludmFsaWQnLCAhdmFsaWRcblx0XHRcblx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5OiAoKS0+XG5cdFx0U2ltcGx5QmluZCgncGxhY2Vob2xkZXInKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ3RleHQnKS5vZihAZWwuY2hpbGQucGxhY2Vob2xkZXIpXG5cdFx0XHRcdC50cmFuc2Zvcm0gKHBsYWNlaG9sZGVyKT0+IHN3aXRjaFxuXHRcdFx0XHRcdHdoZW4gcGxhY2Vob2xkZXIgaXMgdHJ1ZSBhbmQgQHNldHRpbmdzLmxhYmVsIHRoZW4gQHNldHRpbmdzLmxhYmVsXG5cdFx0XHRcdFx0d2hlbiBJUy5zdHJpbmcocGxhY2Vob2xkZXIpIHRoZW4gcGxhY2Vob2xkZXJcblx0XHRcdFx0XHRlbHNlICcnXG5cblx0XHRTaW1wbHlCaW5kKCdkaXNhYmxlZCcsIHVwZGF0ZU9uQmluZDpAc3RhdGUuZGlzYWJsZWQpLm9mKEBzdGF0ZSlcblx0XHRcdC50byAoZGlzYWJsZWQsIHByZXYpPT4gaWYgQHNldHRpbmdzLmNoZWNrbWFya1xuXHRcdFx0XHRpZiBkaXNhYmxlZCBvciAobm90IGRpc2FibGVkIGFuZCBwcmV2PykgdGhlbiBzZXRUaW1lb3V0ICgpPT5cblx0XHRcdFx0XHRAZWwuY2hpbGQuY2hlY2ttYXJrX21hc2sxLnJlY2FsY1N0eWxlKClcblx0XHRcdFx0XHRAZWwuY2hpbGQuY2hlY2ttYXJrX21hc2syLnJlY2FsY1N0eWxlKClcblx0XHRcdFx0XHRAZWwuY2hpbGQuY2hlY2ttYXJrX3BhdGNoLnJlY2FsY1N0eWxlKClcblx0XHRcdFx0XHQjIEBlbC5jaGlsZC5jaGVja21hcmsucmVjYWxjU3R5bGUodHJ1ZSlcblx0XHRcblx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5X2F1dG9XaWR0aDogKCktPlxuXHRcdFNpbXBseUJpbmQoJ3dpZHRoJywgdXBkYXRlRXZlbklmU2FtZTp0cnVlKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gKHdpZHRoKT0+IChpZiBAc2V0dGluZ3MuYXV0b1dpZHRoIHRoZW4gQGVsLmNoaWxkLmlucHV0IGVsc2UgQGVsKS5zdHlsZSgnd2lkdGgnLCB3aWR0aClcblx0XHRcdC50cmFuc2Zvcm0gQF9mb3JtYXRXaWR0aC5iaW5kKEApXG5cdFx0XHQudXBkYXRlT24oJ2lzTW9iaWxlJykub2YoQHN0YXRlKVxuXG5cdFx0aWYgQHNldHRpbmdzLmF1dG9XaWR0aFxuXHRcdFx0U2ltcGx5QmluZCgnX3ZhbHVlJywgdXBkYXRlRXZlbklmU2FtZTp0cnVlLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEApXG5cdFx0XHRcdC50bygnd2lkdGgnKS5vZihAc3RhdGUpXG5cdFx0XHRcdFx0LnRyYW5zZm9ybSAoKT0+IFwiI3tAX2dldElucHV0QXV0b1dpZHRoKCl9cHhcIlxuXHRcdFx0XHRcdC51cGRhdGVPbignZXZlbnQ6aW5zZXJ0ZWQnKS5vZihAZWwpXG5cdFx0XHRcdFx0LnVwZGF0ZU9uKCd2aXNpYmxlJykub2YoQHN0YXRlKVxuXHRcdFxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX3ZhbHVlOiAoKS0+XG5cdFx0aW5wdXQgPSBAZWwuY2hpbGQuaW5wdXQucmF3XG5cdFx0XG5cdFx0cmVzZXRJbnB1dCA9ICgpPT5cblx0XHRcdGZpbGxlZCA9ICFAbWFzay5pc0VtcHR5KClcblx0XHRcdGlmIG5vdCBmaWxsZWRcblx0XHRcdFx0QHNlbGVjdGlvbihAbWFzay5jdXJzb3IgPSAwKVxuXHRcdFx0XHRAX3ZhbHVlID0gJydcblx0XHRcdFx0QHN0YXRlLmZpbGxlZCA9IGZhbHNlXG5cdFx0XHRcblx0XHRcdHJldHVybiBmaWxsZWRcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDppbnB1dCcpLm9mKGlucHV0KS50byAoKT0+XG5cdFx0XHRAdmFsdWUgPSBpbnB1dC52YWx1ZVxuXHRcdFx0QHNlbGVjdGlvbihAbWFzay5jdXJzb3IpIGlmIEBtYXNrXG5cdFx0XHRAZW1pdCgnaW5wdXQnLCBAdmFsdWUpXG5cblx0XHRTaW1wbHlCaW5kKCdfdmFsdWUnLCB1cGRhdGVFdmVuSWZTYW1lOiEhQG1hc2spLm9mKEApXG5cdFx0XHQudG8oJ3ZhbHVlJykub2YoaW5wdXQpXHRcdFxuXHRcdFx0LmFuZC50byAodmFsdWUpPT5cblx0XHRcdFx0ZmlsbGVkID0gISF2YWx1ZVxuXHRcdFx0XHRmaWxsZWQgPSByZXNldElucHV0KCkgaWYgZmlsbGVkIGFuZCBAbWFzayBhbmQgQG1hc2suZ3VpZGUgYW5kICghQHN0YXRlLmZvY3VzZWQgb3IgQG1hc2suY3Vyc29yIGlzIDApXG5cdFx0XHRcdEBzdGF0ZS5maWxsZWQgPSBmaWxsZWRcblx0XHRcdFx0QHN0YXRlLmludGVyYWN0ZWQgPSB0cnVlIGlmIGZpbGxlZFxuXHRcdFx0XHRAc3RhdGUudmFsaWQgPSBAdmFsaWRhdGUobnVsbCwgdHJ1ZSlcblx0XHRcdFx0QGVtaXQoJ2lucHV0JywgQHZhbHVlKSB1bmxlc3MgQHN0YXRlLmZvY3VzZWRcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmtleWRvd24nKS5vZihAZWwuY2hpbGQuaW5wdXQpLnRvIChldmVudCk9PlxuXHRcdFx0QGVtaXQoJ3N1Ym1pdCcpIGlmIGV2ZW50LmtleUNvZGUgaXMgS0VZQ09ERVMuZW50ZXJcblx0XHRcdEBlbWl0KFwia2V5LSN7ZXZlbnQua2V5Q29kZX1cIilcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmJsdXInKS5vZihAZWwuY2hpbGQuaW5wdXQpLnRvKHJlc2V0SW5wdXQpIGlmIEBtYXNrIGFuZCBAbWFzay5ndWlkZVxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2F1dG9jb21wbGV0ZTogKCktPiBpZiBAZHJvcGRvd25cblx0XHRTaW1wbHlCaW5kLmRlZmF1bHRPcHRpb25zLnVwZGF0ZU9uQmluZCA9IGZhbHNlXG5cblx0XHRTaW1wbHlCaW5kKCd0eXBpbmcnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUpLm9mKEBzdGF0ZSkudG8gKGlzVHlwaW5nKT0+XG5cdFx0XHRpZiBpc1R5cGluZ1xuXHRcdFx0XHRyZXR1cm4gaWYgbm90IEBfdmFsdWVcblx0XHRcdFx0aWYgQGRyb3Bkb3duLmlzT3BlblxuXHRcdFx0XHRcdEBkcm9wZG93bi5saXN0LmNhbGNEaXNwbGF5KClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBkcm9wZG93bi5pc09wZW4gPSB0cnVlXG5cdFx0XHRcdFx0U2ltcGx5QmluZCgnZXZlbnQ6Y2xpY2snKS5vZihkb2N1bWVudClcblx0XHRcdFx0XHRcdC5vbmNlLnRvICgpPT4gQGRyb3Bkb3duLmlzT3BlbiA9IGZhbHNlXG5cdFx0XHRcdFx0XHQuY29uZGl0aW9uIChldmVudCk9PiBub3QgRE9NKGV2ZW50LnRhcmdldCkucGFyZW50TWF0Y2hpbmcgKHBhcmVudCk9PiBwYXJlbnQgaXMgQGVsLmNoaWxkLmlubmVyd3JhcFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAZHJvcGRvd24uaXNPcGVuID0gZmFsc2VcblxuXHRcdFNpbXBseUJpbmQoJ192YWx1ZScpLm9mKEApLnRvICh2YWx1ZSk9PlxuXHRcdFx0Zm9yIGNob2ljZSBpbiBAZHJvcGRvd24uY2hvaWNlc1xuXHRcdFx0XHRzaG91bGRCZVZpc2libGUgPSBpZiBub3QgdmFsdWUgdGhlbiB0cnVlIGVsc2UgaGVscGVycy5mdXp6eU1hdGNoKHZhbHVlLCBjaG9pY2UubGFiZWwpXG5cdFx0XHRcdGNob2ljZS52aXNpYmxlID0gc2hvdWxkQmVWaXNpYmxlIGlmIGNob2ljZS52aXNpYmxlIGlzbnQgc2hvdWxkQmVWaXNpYmxlXG5cblx0XHRcdGlmIEBkcm9wZG93bi5pc09wZW4gYW5kIG5vdCB2YWx1ZVxuXHRcdFx0XHRAZHJvcGRvd24uaXNPcGVuID0gZmFsc2Vcblx0XHRcdHJldHVyblxuXG5cblx0XHRAZHJvcGRvd24ub25TZWxlY3RlZCAoc2VsZWN0ZWRDaG9pY2UpPT5cblx0XHRcdEBzZWxlY3RlZCA9IHNlbGVjdGVkQ2hvaWNlXG5cdFx0XHRAdmFsdWUgPSBzZWxlY3RlZENob2ljZS5sYWJlbFxuXHRcdFx0QGRyb3Bkb3duLmlzT3BlbiA9IGZhbHNlXG5cdFx0XHRAc2VsZWN0aW9uKEBlbC5jaGlsZC5pbnB1dC5yYXcudmFsdWUubGVuZ3RoKVxuXHRcdFxuXG5cdFx0U2ltcGx5QmluZC5kZWZhdWx0T3B0aW9ucy51cGRhdGVPbkJpbmQgPSB0cnVlXG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3Nfc3RhdGVUcmlnZ2VyczogKCktPlxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50Om1vdXNlZW50ZXInKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUuaG92ZXJlZCA9IHRydWVcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDptb3VzZWxlYXZlJykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQHN0YXRlLmhvdmVyZWQgPSBmYWxzZVxuXG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6Zm9jdXMnKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUuZm9jdXNlZCA9IHRydWU7IGlmIEBzdGF0ZS5kaXNhYmxlZCB0aGVuIEBibHVyKClcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDpibHVyJykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQHN0YXRlLnR5cGluZyA9IEBzdGF0ZS5mb2N1c2VkID0gZmFsc2Vcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDppbnB1dCcpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBzdGF0ZS50eXBpbmcgPSB0cnVlXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6a2V5ZG93bicpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBjdXJzb3IucHJldiA9IEBzZWxlY3Rpb24oKS5lbmRcblxuXHRcdHJldHVyblxuXG5cblx0X3NjaGVkdWxlQ3Vyc29yUmVzZXQ6ICgpLT5cblx0XHRkaWZmSW5kZXggPSBoZWxwZXJzLmdldEluZGV4T2ZGaXJzdERpZmYoQG1hc2sudmFsdWUsIEBtYXNrLnByZXYudmFsdWUpXG5cdFx0Y3VycmVudEN1cnNvciA9IEBjdXJzb3IuY3VycmVudFxuXHRcdG5ld0N1cnNvciA9IEBtYXNrLm5vcm1hbGl6ZUN1cnNvclBvcyhjdXJyZW50Q3Vyc29yLCBAY3Vyc29yLnByZXYpXG5cblx0XHRpZiBuZXdDdXJzb3IgaXNudCBjdXJyZW50Q3Vyc29yXG5cdFx0XHRAc2VsZWN0aW9uKG5ld0N1cnNvcilcblx0XHRyZXR1cm5cblxuXG5cdF9zZXRWYWx1ZUlmTm90U2V0OiAoKS0+XG5cdFx0aWYgQGVsLmNoaWxkLmlucHV0LnJhdy52YWx1ZSBpc250IEBfdmFsdWVcblx0XHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcudmFsdWUgPSBAX3ZhbHVlXG5cdFx0cmV0dXJuXG5cblxuXG5cdF9nZXRJbnB1dEF1dG9XaWR0aDogKCktPlxuXHRcdGlmIEBfdmFsdWVcblx0XHRcdEBfc2V0VmFsdWVJZk5vdFNldCgpXG5cdFx0XHRAZWwuY2hpbGQuaW5wdXQuc3R5bGUoJ3dpZHRoJywgMClcblx0XHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcuc2Nyb2xsTGVmdCA9IDFlKzEwXG5cdFx0XHRpbnB1dFdpZHRoID0gTWF0aC5tYXgoQGVsLmNoaWxkLmlucHV0LnJhdy5zY3JvbGxMZWZ0K0BlbC5jaGlsZC5pbnB1dC5yYXcub2Zmc2V0V2lkdGgsIEBlbC5jaGlsZC5pbnB1dC5yYXcuc2Nyb2xsV2lkdGgpICsgMlxuXHRcdFx0bGFiZWxXaWR0aCA9IGlmIEBzZXR0aW5ncy5sYWJlbCBhbmQgQGVsLmNoaWxkLmxhYmVsLnN0eWxlU2FmZSgncG9zaXRpb24nKSBpcyAnYWJzb2x1dGUnIHRoZW4gQGVsLmNoaWxkLmxhYmVsLnJlY3Qud2lkdGggZWxzZSAwXG5cdFx0ZWxzZVxuXHRcdFx0aW5wdXRXaWR0aCA9IEBlbC5jaGlsZC5wbGFjZWhvbGRlci5yZWN0LndpZHRoXG5cdFx0XHRsYWJlbFdpZHRoID0gMFxuXHRcdFxuXHRcdHJldHVybiBNYXRoLm1pbiBAX2dldFdpZHRoU2V0dGluZygnbWF4JyksIE1hdGgubWF4KEBfZ2V0V2lkdGhTZXR0aW5nKCdtaW4nKSwgaW5wdXRXaWR0aCwgbGFiZWxXaWR0aClcblxuXG5cdF9nZXRXaWR0aFNldHRpbmc6ICh0YXJnZXQpLT5cblx0XHR0YXJnZXQgKz0gJ1dpZHRoJyBpZiB0YXJnZXQgaXMgJ21pbicgb3IgdGFyZ2V0IGlzICdtYXgnXHRcdFxuXHRcdGlmIHR5cGVvZiBAc2V0dGluZ3NbdGFyZ2V0XSBpcyAnbnVtYmVyJ1xuXHRcdFx0cmVzdWx0ID0gQHNldHRpbmdzW3RhcmdldF1cblx0XHRcblx0XHRlbHNlIGlmXHR0eXBlb2YgQHNldHRpbmdzW3RhcmdldF0gaXMgJ3N0cmluZydcblx0XHRcdHJlc3VsdCA9IHBhcnNlRmxvYXQoQHNldHRpbmdzW3RhcmdldF0pXG5cblx0XHRcdGlmIGhlbHBlcnMuaW5jbHVkZXMoQHNldHRpbmdzW3RhcmdldF0sICclJylcblx0XHRcdFx0aWYgKHBhcmVudD1AZWwucGFyZW50KSBhbmQgcGFyZW50LnN0eWxlKCdkaXNwbGF5JykgaXMgJ2Jsb2NrJ1xuXHRcdFx0XHRcdHBhcmVudFdpZHRoID0gcGFyZW50LnN0eWxlUGFyc2VkKCd3aWR0aCcpIC0gcGFyZW50LnN0eWxlUGFyc2VkKCdwYWRkaW5nTGVmdCcpIC0gcGFyZW50LnN0eWxlUGFyc2VkKCdwYWRkaW5nUmlnaHQnKSAtIDJcblx0XHRcdFx0XHRyZXN1bHQgPSBwYXJlbnRXaWR0aCAqIChyZXN1bHQvMTAwKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVzdWx0ID0gMFxuXG5cdFx0cmV0dXJuIHJlc3VsdCBvciAoaWYgdGFyZ2V0IGlzICdtaW5XaWR0aCcgdGhlbiAwIGVsc2UgSW5maW5pdHkpXG5cblxuXHRfdmFsaWRhdGU6IChwcm92aWRlZFZhbHVlKS0+XG5cdFx0aWYgQHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4IGFuZCBJUy5yZWdleChAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXgpXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgbm90IEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleC50ZXN0KHByb3ZpZGVkVmFsdWUpXG5cdFx0XG5cdFx0aWYgQHNldHRpbmdzLnZhbGlkV2hlbklzQ2hvaWNlIGFuZCBAc2V0dGluZ3MuY2hvaWNlcz8ubGVuZ3RoXG5cdFx0XHRtYXRjaGluZ0Nob2ljZSA9IEBzZXR0aW5ncy5jaG9pY2VzLmZpbHRlciAoY2hvaWNlKS0+IGNob2ljZS52YWx1ZSBpcyBwcm92aWRlZFZhbHVlXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgbm90IG1hdGNoaW5nQ2hvaWNlLmxlbmd0aFxuXG5cdFx0aWYgQHNldHRpbmdzLm1pbkxlbmd0aFxuXHRcdFx0cmV0dXJuIGZhbHNlIGlmIHByb3ZpZGVkVmFsdWUubGVuZ3RoIDwgQHNldHRpbmdzLm1pbkxlbmd0aFxuXG5cdFx0aWYgQHNldHRpbmdzLm1heExlbmd0aFxuXHRcdFx0cmV0dXJuIGZhbHNlIGlmIHByb3ZpZGVkVmFsdWUubGVuZ3RoID49IEBzZXR0aW5ncy5tYXhMZW5ndGhcblxuXHRcdGlmIEBtYXNrXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgbm90IEBtYXNrLnZhbGlkYXRlKHByb3ZpZGVkVmFsdWUpXG5cdFx0XG5cdFx0cmV0dXJuIHRydWVcblxuXG5cdHNlbGVjdGlvbjogKGFyZyktPlxuXHRcdGlmIElTLm9iamVjdChhcmcpXG5cdFx0XHRzdGFydCA9IGFyZy5zdGFydFxuXHRcdFx0ZW5kID0gYXJnLmVuZFxuXHRcdGVsc2Vcblx0XHRcdHN0YXJ0ID0gYXJnXG5cdFx0XHRlbmQgPSBhcmd1bWVudHNbMV1cblxuXHRcdGlmIHN0YXJ0P1xuXHRcdFx0ZW5kID0gc3RhcnQgaWYgbm90IGVuZCBvciBlbmQgPCBzdGFydFxuXHRcdFx0QGVsLmNoaWxkLmlucHV0LnJhdy5zZXRTZWxlY3Rpb25SYW5nZShzdGFydCwgZW5kKVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuICdzdGFydCc6QGVsLmNoaWxkLmlucHV0LnJhdy5zZWxlY3Rpb25TdGFydCwgJ2VuZCc6QGVsLmNoaWxkLmlucHV0LnJhdy5zZWxlY3Rpb25FbmRcblxuXG5cdGZvY3VzOiAoKS0+XG5cdFx0QGVsLmNoaWxkLmlucHV0LnJhdy5mb2N1cygpXG5cblx0Ymx1cjogKCktPlxuXHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcuYmx1cigpXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRGaWVsZCIsImltcG9ydCAnLi9oZWxwZXJzJ1xuaW1wb3J0ICcuL2Vycm9yc0FuZFdhcm5pbmdzJ1xuIiwiU2ltcGx5QmluZCA9IChzdWJqZWN0LCBvcHRpb25zLCBzYXZlT3B0aW9ucywgaXNTdWIsIGNvbXBsZXRlQ2FsbGJhY2spLT5cblx0aWYgKCFzdWJqZWN0IGFuZCBzdWJqZWN0IGlzbnQgMCkgb3IgKCFjaGVja0lmLmlzU3RyaW5nKHN1YmplY3QpIGFuZCAhY2hlY2tJZi5pc051bWJlcihzdWJqZWN0KSBhbmQgIWNoZWNrSWYuaXNGdW5jdGlvbihzdWJqZWN0KSBhbmQgc3ViamVjdCBub3QgaW5zdGFuY2VvZiBBcnJheSlcblx0XHR0aHJvd0Vycm9yKCdpbnZhbGlkUGFyYW1OYW1lJykgdW5sZXNzIGNoZWNrSWYuaXNCaW5kaW5nSW50ZXJmYWNlKHN1YmplY3QpXG5cblx0aWYgY2hlY2tJZi5pc09iamVjdChzdWJqZWN0KSBhbmQgc3ViamVjdCBub3QgaW5zdGFuY2VvZiBBcnJheSAjIEluZGljYXRlcyBpdCdzIGEgQmluZGluZyBpbnN0YW5jZSBvYmplY3QgZHVlIHRvIHRoZSBhYm92ZSBjaGVja1xuXHRcdGludGVyZmFjZVRvUmV0dXJuID0gaWYgY29tcGxldGVDYWxsYmFjayB0aGVuIGNvbXBsZXRlQ2FsbGJhY2soc3ViamVjdCkgZWxzZSBzdWJqZWN0LnNlbGZDbG9uZSgpXG5cdFxuXHRlbHNlXG5cdFx0bmV3SW50ZXJmYWNlID0gbmV3IEJpbmRpbmdJbnRlcmZhY2Uob3B0aW9ucylcblx0XHRuZXdJbnRlcmZhY2Uuc2F2ZU9wdGlvbnMgPSBzYXZlT3B0aW9uc1xuXHRcdG5ld0ludGVyZmFjZS5pc1N1YiA9IGlzU3ViXG5cdFx0bmV3SW50ZXJmYWNlLmNvbXBsZXRlQ2FsbGJhY2sgPSBjb21wbGV0ZUNhbGxiYWNrXG5cblx0XHRpZiBjaGVja0lmLmlzRnVuY3Rpb24oc3ViamVjdClcblx0XHRcdGludGVyZmFjZVRvUmV0dXJuID0gbmV3SW50ZXJmYWNlLnNldE9iamVjdChzdWJqZWN0LCB0cnVlKVxuXHRcdGVsc2Vcblx0XHRcdGludGVyZmFjZVRvUmV0dXJuID0gbmV3SW50ZXJmYWNlLnNldFByb3BlcnR5KHN1YmplY3QpXG5cblx0cmV0dXJuIGludGVyZmFjZVRvUmV0dXJuXG5cblxuXG5cbmltcG9ydCAnLi9tZXRob2RzJyIsIkJpbmRpbmcgPSAob2JqZWN0LCB0eXBlLCBzdGF0ZSktPlxuXHRleHRlbmRTdGF0ZShALCBzdGF0ZSlcblx0QG9wdGlvbnNEZWZhdWx0ID0gaWYgQHNhdmVPcHRpb25zIHRoZW4gQG9wdGlvbnMgZWxzZSBkZWZhdWx0T3B0aW9uc1xuXHRAdHlwZSA9IHR5cGVcdFx0XHRcdFx0XHRcdCMgT2JqZWN0UHJvcCB8IEFycmF5IHwgRnVuYyB8IFByb3h5IHwgRXZlbnQgfCBQaG9sZGVyIHwgRE9NQXR0ciB8IERPTUNoZWNrYm94IHwgRE9NUmFkaW9cblx0QG9iamVjdCA9IG9iamVjdCBcdFx0XHRcdFx0XHQjIFRoZSBzdWJqZWN0IG9iamVjdCBvZiB0aGlzIGJpbmRpbmcsIGkuZS4gZnVuY3Rpb24sIGFycmF5LCB7fSwgRE9NIGVsLCBldGMuXG5cdEBJRCA9IGdlbklEKCkgXHRcdFx0XHRcdFx0XHQjIEFzc2lnbmVkIG9ubHkgYWZ0ZXIgcGFzc2luZyBhIHZhbGlkIG9iamVjdCB0byAub2YoKVxuXHRAc3VicyA9IFtdXHRcdFx0XHRcdFx0XHRcdCMgU3Vic2NyaWJlcnMgYXJyYXkgbGlzdGluZyBhbGwgb2YgdGhlIG9iamVjdHMgdGhhdCB3aWxsIGJlIHVwZGF0ZWQgdXBvbiB2YWx1ZSB1cGRhdGVcblx0QHN1YnNNZXRhID0gZ2VuT2JqKClcdFx0XHRcdFx0IyBNYXAgc3Vic2NyaWJlcnMnIElEIHRvIHRoZWlyIG1ldGFkYXRhIChpLmUuIG9wdGlvbnMsIHRyYW5zZm9ybSwgY29uZGl0aW9uLCBvbmUtdGltZS1iaW5kaW5nLCBldGMuKVxuXHRAcHVic01hcCA9IGdlbk9iaigpXHRcdFx0XHRcdFx0IyBNYXAgcHVibGlzaGVycyAoYmluZGluZ3MgdGhhdCB1cGRhdGUgdGhpcyBiaW5kaW5nKSBieSB0aGVpciBJRFxuXHRAYXR0YWNoZWRFdmVudHMgPSBbXVx0XHRcdFx0XHQjIEFycmF5IGxpc3RpbmcgYWxsIG9mIHRoZSBldmVudHMgY3VycmVudGx5IGxpc3RlbmVkIG9uIEBvYmplY3Rcblx0QHNldFZhbHVlID0gc2V0VmFsdWVOb29wIGlmIEB0eXBlIGlzICdQcm94eSdcblxuXHQjID09PT0gUHJvcGVydGllcyBkZWNsYXJlZCBsYXRlciBvciBpbmhlcml0ZWQgZnJvbSBiaW5kaW5nIGludGVyZmFjZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBAb3B0aW9ucyA9IG9wdGlvbnNcblx0IyBAdmFsdWUgPSB1bmRlZmluZWQgXHRcdFx0XHRcdCMgV2lsbCByZXByZXNlbnQgdGhlIGFjdHVhbCBjdXJyZW50IHZhbHVlIG9mIHRoZSBiaW5kaW5nL29iamVjdFxuXHQjIEBwcm9wZXJ0eSA9IHByb3BlcnR5XHRcdFx0XHRcdCMgVGhlIHByb3BlcnR5IG5hbWUgb3IgYXJyYXkgaW5kZXggb3IgZXZlbnQgY2FsbGJhY2sgYXJndW1lbnRcblx0IyBAc2VsZWN0b3IgPSBzZWxlY3Rvclx0XHRcdFx0XHQjIFRoZSBwcm9wZXJ0eSBuYW1lIG9yIGFycmF5IGluZGV4IG9yIGV2ZW50IGNhbGxiYWNrIGFyZ3VtZW50XG5cdCMgQG9yaWdGbiA9IEZ1bmN0aW9uXHRcdFx0XHRcdCMgVGhlIG9yaWdpbmFsIHByb3hpZWQgZnVuY3Rpb24gcGFzc2VkIHRvIFByb3h5IGJpbmRpbmdzXG5cdCMgQGN1c3RvbUV2ZW50TWV0aG9kID0ge31cdFx0XHRcdCMgTmFtZXMgb2YgdGhlIGV2ZW50IGVtaXR0ZXIvdHJpZ2dlciBtZXRob2RzIChpZiBhcHBsaWNhYmxlKVxuXHQjIEBwaG9sZGVyQ29udGV4dHMgPSB7fVx0XHRcdFx0XHQjIFBsYWNlaG9sZGVyIHN1cnJvdW5kaW5ncyAob3JpZ2luYWwgYmluZGluZyB2YWx1ZSBzcGxpdCBieSB0aGUgcGxhY2Vob2xkZXIgcmVnRXgpXG5cdCMgQHBob2xkZXJJbmRleE1hcCA9IHt9XHRcdFx0XHRcdCMgUGxhY2Vob2xkZXIgb2NjdXJlbmNlIG1hcHBpbmcsIGkuZS4gdGhlIHBsYWNlaG9sZGVyIG5hbWUgZm9yIGVhY2ggcGxhY2Vob2xkZXIgb2NjdXJlbmNlXG5cdCMgQHBsYWNlaG9sZGVyID0gXCJcIlx0XHRcdFx0XHRcdCMgVGhlIGxhc3Qgc3BlY2lmaWVkIHBsYWNlaG9sZGVyIHRvIGJpbmQgdGhlIHZhbHVlIHRvXG5cdCMgQGRlc2NyaXB0b3IgPSBbXVx0XHRcdFx0XHRcdCMgRGVzY3JpYmVzIHRoZSB0eXBlIG9mIHByb3BlcnR5LCBpLmUuICdhdHRyOmRhdGEtbmFtZScgdG8gaW5kaWNhdGUgYSBET01BdHRyIHR5cGUgYmluZGluZ1xuXHQjIEBpc0xpdmVQcm9wID0gQm9vbGVhblx0XHRcdFx0XHQjIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgT2JqZWN0L09iamVjdCdzIHByb3BldHkgaGF2ZSBiZWVuIG1vZGlmaWVkIHRvIGJlIGEgbGl2ZSBwcm9wZXJ0eVxuXHQjIEBpc0RvbSA9IEJvb2xlYW5cdFx0XHRcdFx0XHQjIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgYmluZGluZydzIG9iamVjdCBpcyBhIERPTSBvYmplY3Rcblx0IyBAcG9sbEludGVydmFsID0gSURcdFx0XHRcdFx0IyBUaGUgaW50ZXJ2YWwgSUQgb2YgdGhlIHRpbWVyIHRoYXQgbWFudWFsbHkgcG9sbHMgdGhlIG9iamVjdCdzIHZhbHVlIGF0IGEgc2V0IGludGVydmFsXG5cdCMgQGFycmF5QmluZGluZyA9IEJpbmRpbmdcdFx0XHRcdCMgUmVmZXJlbmNlIHRvIHRoZSBwYXJlbnQgYXJyYXkgYmluZGluZyAoaWYgZXhpc3RzKSBmb3IgYW4gaW5kZXgtb2YtYXJyYXkgYmluZGluZyAoaS5lLiBTaW1wbHlCaW5kKGFycmF5KSlcblx0IyBAZXZlbnROYW1lID0gXCJcIlx0XHRcdFx0XHRcdCMgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRoaXMgYmluZGluZyBpcyBsaXN0ZW5pbmcgdG8gKGZvciBFdmVudCB0eXBlIGJpbmRpbmdzKVxuXHQjIEBpc0VtaXR0ZXIgPSBCb29sZWFuIFx0XHRcdFx0XHQjIFRyYWNrZXIgdG8gbGV0IHVzIGtub3cgd2Ugc2hvdWxkbid0IGhhbmRsZSB0aGUgZXZlbnQgdXBkYXRlIHdlIHJlY2VpdmVkIGFzIGl0IGlzIHRoZSBldmVudCB0aGlzIGJpbmRpbmcganVzdCBlbWl0dGVkXG5cdCMgQGV2ZW50SGFuZGxlciA9IEZ1bmN0aW9uIFx0XHRcdFx0IyBUaGUgY2FsbGJhY2sgdGhhdCBnZXRzIHRyaWdnZXJlZCB1cG9uIGFuIGV2ZW50IGVtaXR0YW5jZSAoZm9yIEV2ZW4gdHlwZSBiaW5kaW5ncylcblx0IyBAZXZlbnRPYmplY3QgPSBFdmVudCBcdFx0XHRcdFx0IyBUaGUgZGlzcGF0Y2hlZCBldmVudCBvYmplY3QgKGZvciBFdmVudCB0eXBlIGJpbmRpbmdzKVxuXHQjIEBzZWxmVHJhbnNmb3JtID0gRnVuY3Rpb24gXHRcdFx0IyBUaGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHRoYXQgbmV3IHZhbHVlcyBiZWluZyBzZXQgdG8gdGhpcyBiaW5kaW5nIGFyZSBiZWluZyBwYXNzZWQgdGhyb3VnaCBkdXJpbmcgQHNldFZhbHVlIChpZiBhcHBsaWNhYmxlKVxuXHQjIEBzZWxmVXBkYXRlciA9IEZ1bmN0aW9uIFx0XHRcdFx0IyBBIEZ1bmMtdHlwZSBCaW5kaW5nIHdoaWNoIGludm9rZXMgQHNldFZhbHVlKEBmZXRjaERpcmVjdFZhbHVlKCkpIHVwb24gY2hhbmdlLiBDcmVhdGVkIGluIEBjb252ZXJ0VG9MaXZlKCkgZm9yIEFycmF5IGJpbmRpbmdzICYgaW4gaW50ZXJmYWNlLnVwZGF0ZU9uKClcblx0IyBAaXNBc3luYyA9IEJvb2xlYW5cdFx0XHRcdFx0IyBJbmRpY2F0ZXMgaWYgdGhpcyBpcyBhbiBhc3luYyBiaW5kaW5nIChjdXJyZW50bHkgb25seSB1c2VkIGZvciBFdmVudCBiaW5kaW5ncylcblx0IyMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICMjI1xuXG5cdCMgc2ltcGx5aW1wb3J0OmlmIEJVTkRMRV9UQVJHRVQgPSAnYnJvd3Nlcidcblx0aWYgQGlzTXVsdGlDaG9pY2UgIyBUcnVlIGlmIEBvYmplY3QgaXMgYSByYWRpby9jaGVja2JveCBjb2xsZWN0aW9uXG5cdFx0QGNob2ljZXMgPSBnZW5PYmooKVxuXHRcdFxuXHRcdEBvYmplY3QuZm9yRWFjaCAoY2hvaWNlRWwpPT5cblx0XHRcdGNob2ljZUJpbmRpbmcgPSBAY2hvaWNlc1tjaG9pY2VFbC52YWx1ZV0gPSBTaW1wbHlCaW5kKCdjaGVja2VkJykub2YoY2hvaWNlRWwpLl9cblx0XHRcdGNob2ljZUJpbmRpbmcuYWRkU3ViKEApXG5cdFx0XHRjaG9pY2VCaW5kaW5nLnN1YnNNZXRhW0BJRF0udHJhbnNmb3JtRm4gPSAoKS0+IGNob2ljZUJpbmRpbmdcblx0XHRcdGNob2ljZUJpbmRpbmcuZ3JvdXBCaW5kaW5nID0gQFxuXHRcdFx0cmV0dXJuXG5cdCMgc2ltcGx5aW1wb3J0OmVuZFxuXHRcblxuXHR1bmxlc3MgQHR5cGUgaXMgJ0V2ZW50JyBvciAoQHR5cGUgaXMgJ0Z1bmMnIGFuZCBAaXNTdWIpICMgdGhlIHNlY29uZCBjb25kaXRpb24gd2lsbCBwcmV2ZW50IGZ1bmN0aW9uIHN1YnNjcmliZXJzIGZyb20gYmVpbmcgaW52b2tlZCBvbiB0aGlzIGJpbmRpbmcgY3JlYXRpb25cblx0XHRpZiBAdHlwZSBpcyAnUGhvbGRlcidcblx0XHRcdCMgc2ltcGx5aW1wb3J0OmlmIEJVTkRMRV9UQVJHRVQgPSAnYnJvd3Nlcidcblx0XHRcdHBhcmVudFByb3BlcnR5ID0gaWYgQGRlc2NyaXB0b3IgYW5kIG5vdCB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ211bHRpJykgdGhlbiBcIiN7QGRlc2NyaXB0b3J9OiN7QHByb3BlcnR5fVwiIGVsc2UgQHByb3BlcnR5XG5cdFx0XHQjIHNpbXBseWltcG9ydDplbmRcblx0XHRcdFxuXHRcdFx0IyBzaW1wbHlpbXBvcnQ6aWYgQlVORExFX1RBUkdFVCA9ICdub2RlJ1xuXHRcdFx0cGFyZW50UHJvcGVydHkgPSBAcHJvcGVydHlcblx0XHRcdCMgc2ltcGx5aW1wb3J0OmVuZFxuXHRcdFx0XG5cdFx0XHRwYXJlbnRCaW5kaW5nID0gQHBhcmVudEJpbmRpbmcgPSBTaW1wbHlCaW5kKHBhcmVudFByb3BlcnR5KS5vZihvYmplY3QpLl9cblx0XHRcdHBhcmVudEJpbmRpbmcuc2NhbkZvclBob2xkZXJzKClcblx0XHRcdEB2YWx1ZSA9IHBhcmVudEJpbmRpbmcucGhvbGRlclZhbHVlc1tAcGhvbGRlcl1cblx0XHRcblx0XHRcdCMgc2ltcGx5aW1wb3J0OmlmIEJVTkRMRV9UQVJHRVQgPSAnYnJvd3Nlcidcblx0XHRcdEB0ZXh0Tm9kZXMgPSBwYXJlbnRCaW5kaW5nLnRleHROb2Rlc1tAcGhvbGRlcl0gaWYgcGFyZW50QmluZGluZy50ZXh0Tm9kZXNcblx0XHRcdCMgc2ltcGx5aW1wb3J0OmVuZFxuXHRcdFxuXG5cdFx0ZWxzZVxuXHRcdFx0QHZhbHVlID0gc3ViamVjdFZhbHVlID0gQGZldGNoRGlyZWN0VmFsdWUoKVxuXHRcdFxuXHRcdFx0aWYgQHR5cGUgaXMgJ09iamVjdFByb3AnIGFuZCBub3QgY2hlY2tJZi5pc0RlZmluZWQoc3ViamVjdFZhbHVlKSBhbmQgbm90IGdldERlc2NyaXB0b3IoQG9iamVjdCwgQHByb3BlcnR5KVxuXHRcdFx0XHRAb2JqZWN0W0Bwcm9wZXJ0eV0gPSBzdWJqZWN0VmFsdWUgIyBEZWZpbmUgdGhlIHByb3Agb24gdGhlIG9iamVjdCBpZiBpdCBub24tZXhpc3RlbnRcblxuXHRcdFx0Y29udmVydFRvTGl2ZShALCBAb2JqZWN0KVxuXG5cblx0QGF0dGFjaEV2ZW50cygpXG5cdHJldHVybiBib3VuZEluc3RhbmNlc1tASURdID0gQFxuXG5cblxuXG5cbmltcG9ydCAnLi9wcm90b3R5cGUnXG4iLCIjIyMqXG4gKiBTdGFnZSBkZWZpbml0aW9uczpcbiAqIFxuICogMDogU2VsZWN0aW9uOlx0XHRcdEdvdCBzZWxlY3RvciwgYXdhaXRpbmcgb2JqZWN0LlxuICogMTogSW5kaWNhdGlvbjpcdFx0XHRHb3Qgb2JqZWN0LCBhd2FpdGluZyBwcm94aWVkIHByb3BlcnR5IC8gZnVuY3Rpb24gLyBCaW5kaW5nLW9iamVjdC5cbiAqIDI6IEJpbmRpbmcgQ29tcGxldGU6XHRcdENvbXBsZXRlLCBhd2FpdGluZyBhZGRpdGlvbmFsIChvcHRpb25hbCkgYmluZGluZ3MvbXV0YXRpb25zLlxuIyMjXG5CaW5kaW5nSW50ZXJmYWNlID0gKG9wdGlvbnMsIGluaGVyaXRlZFN0YXRlKS0+XG5cdGlmIGluaGVyaXRlZFN0YXRlXG5cdFx0ZXh0ZW5kU3RhdGUoQCwgaW5oZXJpdGVkU3RhdGUpXG5cdFx0QHN0YWdlID0gMVxuXHRlbHNlXG5cdFx0QHN0YWdlID0gMFxuXHRcdEBzdWJzID0gW11cblx0XHRAb3B0aW9uc1Bhc3NlZCA9IG9wdGlvbnMgfHw9IHt9XG5cdFx0QG9wdGlvbnMgPSB7fVxuXHRcdGZvciBrZXkgb2YgZGVmYXVsdE9wdGlvbnNcblx0XHRcdEBvcHRpb25zW2tleV0gPSBpZiBvcHRpb25zW2tleV0/IHRoZW4gb3B0aW9uc1trZXldIGVsc2UgZGVmYXVsdE9wdGlvbnNba2V5XVxuXHRcblx0cmV0dXJuIEBcdFx0XHRcblx0XG5cblxuXG5pbXBvcnQgJy4vcHJvdG90eXBlLXByaXZhdGUnXG5pbXBvcnQgJy4vcHJvdG90eXBlLXB1YmxpYyciLCJHcm91cEJpbmRpbmcgPSAoYmluZGluZ0ludGVyZmFjZSwgb2JqZWN0cywgb2JqZWN0VHlwZSktPlxuXHRiaW5kaW5nSW50ZXJmYWNlLnNlbGVjdG9yID0gYmluZGluZ0ludGVyZmFjZS5zZWxlY3Rvci5zbGljZSg2KSAjIFRha2Ugb3V0IHRoZSAnbXVsdGk6J1xuXHRleHRlbmRTdGF0ZShALCBAaW50ZXJmYWNlID0gYmluZGluZ0ludGVyZmFjZSlcblx0QGlzTXVsdGkgPSB0cnVlXG5cdEBiaW5kaW5ncyA9IGJpbmRpbmdzID0gW11cblxuXHRpZiBvYmplY3RzXG5cdFx0QGFkZEJpbmRpbmcob2JqZWN0LCBvYmplY3RUeXBlKSBmb3Igb2JqZWN0IGluIG9iamVjdHNcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyBALFxuXHRcdCd0eXBlJzpcdFx0XHRcdGdldDogKCktPiBiaW5kaW5ncy5tYXAgKGJpbmRpbmcpLT4gYmluZGluZy50eXBlXG5cdFx0J3ZhbHVlJzogXHRcdFx0Z2V0OiAoKS0+IGJpbmRpbmdzLm1hcCAoYmluZGluZyktPiBiaW5kaW5nLnZhbHVlXG5cblxuXG5cblxuXG5wcm90byA9IEdyb3VwQmluZGluZzo6ID0gT2JqZWN0LmNyZWF0ZShCaW5kaW5nSW50ZXJmYWNlUHJpdmF0ZSlcblxuT2JqZWN0LmtleXMoQmluZGluZzo6KS5mb3JFYWNoIChtZXRob2ROYW1lKS0+XHRcblx0cHJvdG9bbWV0aG9kTmFtZV0gPSAoYSxiLGMsZCktPiAjIEZvdXIgYXJndW1lbnRzIGlzIHRoZSBtb3N0IGV2ZXIgcGFzc2VkIHRvIGFueSBtZXRob2QgZnJvbSBCaW5kaW5nSW50ZXJmYWNlIG1ldGhvZHNcblx0XHRmb3IgYmluZGluZyBpbiBAYmluZGluZ3Ncblx0XHRcdGIgPSBiaW5kaW5nIGlmIG1ldGhvZE5hbWUgaXMgJ3VwZGF0ZVN1Yidcblx0XHRcdGJpbmRpbmdbbWV0aG9kTmFtZV0oYSxiLGMsZClcblx0XHRcblx0XHRyZXR1cm5cblxuXG5wcm90by5hZGRCaW5kaW5nID0gKG9iamVjdCwgb2JqZWN0VHlwZSktPlxuXHRAYmluZGluZ3MucHVzaCBpZiBub3Qgb2JqZWN0VHlwZSB0aGVuIG9iamVjdCBlbHNlIEBjcmVhdGVCaW5kaW5nKG9iamVjdCwgb2JqZWN0VHlwZSwgQGludGVyZmFjZSlcblx0cmV0dXJuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFueTogLy4vLFxuICB3aGl0ZVNwYWNlOiAvXFxzKy8sXG4gIG51bWVyaWM6IC9eXFxkJC8sXG4gIGxldHRlcjogL15bYS16QS1aXSQvLFxuICB3aWRlbnVtZXJpYzogL15bMC05XFwhI1xcJFxcJVxcKlxcK1xcL1xcPVxcP1xcXlxce1xcfFxcfVxcKFxcKVxcflxcLVxcLl0kLyxcbiAgYWxwaGFudW1lcmljOiAvXlswLTlBLVphLXpcXCEjXFwkXFwlXFwmXFwnXFwqXFwrXFwvXFw9XFw/XFxeXFxfXFxgXFx7XFx8XFx9XFwoXFwpXFx+XFwtXFwgXSQvLFxuICBlbWFpbDogL15bXFx3XFwtXFwuXStAW1xcd1xcLVxcLl0rXFwuW0EtWmEtel17MiwxMH0kL1xufTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSmpiMjV6ZEdGdWRITXZjbVZuWlhndVkyOW1abVZsSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJjb25zdGFudHMgPSBpbXBvcnQgJy4vY29uc3RhbnRzJ1xuaGVscGVycyA9IGltcG9ydCAnLi9oZWxwZXJzJ1xuXG5RdWlja0NTUyA9ICh0YXJnZXRFbCwgcHJvcGVydHksIHZhbHVlLCBpbXBvcnRhbnQpLT5cblx0aWYgaGVscGVycy5pc0l0ZXJhYmxlKHRhcmdldEVsKVxuXHRcdFF1aWNrQ1NTKHN1YkVsLCBwcm9wZXJ0eSwgdmFsdWUpIGZvciBzdWJFbCBpbiB0YXJnZXRFbFxuXHRcblx0ZWxzZSBpZiB0eXBlb2YgcHJvcGVydHkgaXMgJ29iamVjdCcgIyBQYXNzZWQgYSBzdHlsZSBtYXBcblx0XHRRdWlja0NTUyh0YXJnZXRFbCwgc3ViUHJvcGVydHksIHN1YlZhbHVlKSBmb3Igc3ViUHJvcGVydHksc3ViVmFsdWUgb2YgcHJvcGVydHlcblx0XG5cdGVsc2Vcblx0XHRwcm9wZXJ0eSA9IGhlbHBlcnMubm9ybWFsaXplUHJvcGVydHkocHJvcGVydHkpXG5cdFx0aWYgdHlwZW9mIHZhbHVlIGlzICd1bmRlZmluZWQnXG5cdFx0XHRjb21wdXRlZFN0eWxlID0gdGFyZ2V0RWwuX2NvbXB1dGVkU3R5bGUgfHw9IGdldENvbXB1dGVkU3R5bGUodGFyZ2V0RWwpXG5cdFx0XHRyZXR1cm4gY29tcHV0ZWRTdHlsZVtwcm9wZXJ0eV1cblx0XHRcblx0XHRlbHNlIGlmIHByb3BlcnR5XG5cdFx0XHR0YXJnZXRFbC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wZXJ0eSwgaGVscGVycy5ub3JtYWxpemVWYWx1ZShwcm9wZXJ0eSwgdmFsdWUpLCBjb25zdGFudHMuSU1QT1JUQU5UIGlmIGltcG9ydGFudClcblxuXHRyZXR1cm5cblxuXG5RdWlja0NTUy5hbmltYXRpb24gPSAobmFtZSwgZnJhbWVzKS0+IGlmIG5hbWUgYW5kIHR5cGVvZiBuYW1lIGlzICdzdHJpbmcnIGFuZCBmcmFtZXMgYW5kIHR5cGVvZiBmcmFtZXMgaXMgJ29iamVjdCdcblx0cHJlZml4ID0gaGVscGVycy5nZXRQcmVmaXgoJ2FuaW1hdGlvbicpXG5cdGdlbmVyYXRlZCA9ICcnXG5cdFxuXHRmb3IgZnJhbWUscnVsZXMgb2YgZnJhbWVzXG5cdFx0Z2VuZXJhdGVkICs9IFwiI3tmcmFtZX0geyN7aGVscGVycy5ydWxlVG9TdHJpbmcocnVsZXMpfX1cIlxuXG5cdGdlbmVyYXRlZCA9IFwiQCN7cHJlZml4fWtleWZyYW1lcyAje25hbWV9IHsje2dlbmVyYXRlZH19XCJcblx0aGVscGVycy5pbmxpbmVTdHlsZShnZW5lcmF0ZWQsIHRydWUsIDApXG5cblxuUXVpY2tDU1MucmVnaXN0ZXIgPSAocnVsZSwgbGV2ZWwsIGltcG9ydGFudCktPiBpZiBydWxlIGFuZCB0eXBlb2YgcnVsZSBpcyAnb2JqZWN0J1xuXHRsZXZlbCB8fD0gMFxuXHRydWxlID0gaGVscGVycy5ydWxlVG9TdHJpbmcocnVsZSwgaW1wb3J0YW50KVxuXHRcblx0dW5sZXNzIGNsYXNzTmFtZSA9IGhlbHBlcnMuaW5saW5lU3R5bGVDb25maWdbbGV2ZWxdP1tydWxlXVxuXHRcdGNsYXNzTmFtZSA9IGhlbHBlcnMuaGFzaChydWxlKVxuXHRcdHN0eWxlID0gXCIuI3tjbGFzc05hbWV9IHsje3J1bGV9fVwiXG5cdFx0aGVscGVycy5pbmxpbmVTdHlsZShzdHlsZSwgY2xhc3NOYW1lLCBsZXZlbClcblxuXHRyZXR1cm4gY2xhc3NOYW1lXG5cblxuUXVpY2tDU1MuY2xlYXJSZWdpc3RlcmVkID0gKGxldmVsKS0+XG5cdGhlbHBlcnMuY2xlYXJJbmxpbmVTdHlsZShsZXZlbCBvciAwKVxuXG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrQ1NTLlVOU0VUID0gc3dpdGNoXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywndW5zZXQnKSB0aGVuICd1bnNldCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbml0aWFsJykgdGhlbiAnaW5pdGlhbCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbmhlcml0JykgdGhlbiAnaW5oZXJpdCdcblxuUXVpY2tDU1Muc3VwcG9ydHMgPSBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWRcblF1aWNrQ1NTLnN1cHBvcnRzUHJvcGVydHkgPSBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZFxuUXVpY2tDU1Mubm9ybWFsaXplUHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5XG5RdWlja0NTUy5ub3JtYWxpemVWYWx1ZSA9IGhlbHBlcnMubm9ybWFsaXplVmFsdWVcblF1aWNrQ1NTLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrQ1NTIiwie1xuICBcIl9mcm9tXCI6IFwicXVpY2tjc3NAXjEuMy40XCIsXG4gIFwiX2lkXCI6IFwicXVpY2tjc3NAMS4zLjRcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1VRHdMTlg1cTBxdUU5bVZOY3pDUlhCWnZHTGJrOHJVTXpDMFgzSkt0MlphanZVRnd2dEVsYURIMUYxV2NrSWk2VDNER2V2dFJvS1hrUDZDUWRzWTJ5Zz09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3F1aWNrZG9tL3F1aWNrY3NzXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJyYW5nZVwiLFxuICAgIFwicmVnaXN0cnlcIjogdHJ1ZSxcbiAgICBcInJhd1wiOiBcInF1aWNrY3NzQF4xLjMuNFwiLFxuICAgIFwibmFtZVwiOiBcInF1aWNrY3NzXCIsXG4gICAgXCJlc2NhcGVkTmFtZVwiOiBcInF1aWNrY3NzXCIsXG4gICAgXCJyYXdTcGVjXCI6IFwiXjEuMy40XCIsXG4gICAgXCJzYXZlU3BlY1wiOiBudWxsLFxuICAgIFwiZmV0Y2hTcGVjXCI6IFwiXjEuMy40XCJcbiAgfSxcbiAgXCJfcmVxdWlyZWRCeVwiOiBbXG4gICAgXCIvcXVpY2tkb21cIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3F1aWNrY3NzLy0vcXVpY2tjc3MtMS4zLjQudGd6XCIsXG4gIFwiX3NoYXN1bVwiOiBcImNlMTQ1Y2E1MTFiYzUwNmIyZDlhNjE0ZWQ1YjYxZTc4NjlmZTExZDVcIixcbiAgXCJfc3BlY1wiOiBcInF1aWNrY3NzQF4xLjMuNFwiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGQvbm9kZV9tb2R1bGVzL3F1aWNrZG9tXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJkYW5pZWxrYWxlblwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9xdWlja2Nzcy5kZWJ1Zy5qc1wiLFxuICAgIFwiLi9kaXN0L3F1aWNrY3NzLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tjc3MvaXNzdWVzXCJcbiAgfSxcbiAgXCJidW5kbGVEZXBlbmRlbmNpZXNcIjogZmFsc2UsXG4gIFwiZGVwcmVjYXRlZFwiOiBmYWxzZSxcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkZhc3QgJiBsaWdodCB3cmFwcGVyIGZvciBnZXR0aW5nL3NldHRpbmcgQ1NTIHJ1bGVzXCIsXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjaGFsa1wiOiBcIl4yLjAuMVwiLFxuICAgIFwiY29mZmVlLXNjcmlwdFwiOiBcIl4xLjEyLjZcIixcbiAgICBcImV4ZWNhXCI6IFwiXjAuNy4wXCIsXG4gICAgXCJmcy1qZXRwYWNrXCI6IFwiXjAuMTMuM1wiLFxuICAgIFwicHJvbWlzZS1icmVha1wiOiBcIl4wLjEuMVwiLFxuICAgIFwic2VtdmVyXCI6IFwiXjUuMy4wXCIsXG4gICAgXCJzaW1wbHlpbXBvcnRcIjogXCJeNC4wLjAtczI3XCIsXG4gICAgXCJzaW1wbHl3YXRjaFwiOiBcIl4zLjAuMC1sMlwiXG4gIH0sXG4gIFwiZGlyZWN0b3JpZXNcIjoge1xuICAgIFwidGVzdFwiOiBcInRlc3RcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrY3NzI3JlYWRtZVwiLFxuICBcImxpY2Vuc2VcIjogXCJJU0NcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9xdWlja2Nzcy5qc1wiLFxuICBcIm5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2Nzcy5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJjYWtlIC1kIGJ1aWxkICYmIGNha2UgYnVpbGQgJiYgY2FrZSBtZWFzdXJlICYmIGNwIC1yIGJ1aWxkLyogZGlzdC9cIixcbiAgICBcImNvdmVyYWdlXCI6IFwiY2FrZSBpbnN0YWxsOmNvdmVyYWdlOyBucG0gcnVuIGNvdmVyYWdlOnJ1biAmJiBucG0gcnVuIGNvdmVyYWdlOmJhZGdlXCIsXG4gICAgXCJjb3ZlcmFnZTpiYWRnZVwiOiBcImJhZGdlLWdlbiAtZCAuLy5jb25maWcvYmFkZ2VzL2NvdmVyYWdlXCIsXG4gICAgXCJjb3ZlcmFnZTpydW5cIjogXCJjb3ZlcmFnZT10cnVlIG5wbSBydW4gdGVzdDplbGVjdHJvblwiLFxuICAgIFwiY292ZXJhZ2U6c2hvd1wiOiBcIm9wZW4gY292ZXJhZ2UvbGNvdi1yZXBvcnQvaW5kZXguaHRtbFwiLFxuICAgIFwicG9zdHB1Ymxpc2hcIjogXCJnaXQgcHVzaFwiLFxuICAgIFwicG9zdHZlcnNpb25cIjogXCJucG0gcnVuIGJ1aWxkICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJucG0gcnVuIHRlc3Q6dHJhdmlzXCIsXG4gICAgXCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpicm93c2VyXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEVsZWN0cm9uIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6Y2hyb21lXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBDaHJvbWUgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpmaXJlZm94XCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEZpcmVmb3ggLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDprYXJtYVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6bG9jYWxcIjogXCJvcGVuIHRlc3QvdGVzdHJ1bm5lci5odG1sXCIsXG4gICAgXCJ0ZXN0Om1pbmlmaWVkXCI6IFwibWluaWZpZWQ9MSBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OnNhZmFyaVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgU2FmYXJpIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6c2F1Y2VcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBzYXVjZT0xIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6dHJhdmlzXCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgJiYgbnBtIHJ1biB0ZXN0Om1pbmlmaWVkIC1zXCIsXG4gICAgXCJ3YXRjaFwiOiBcImNha2UgLWQgd2F0Y2hcIlxuICB9LFxuICBcInNpbXBseWltcG9ydFwiOiB7XG4gICAgXCJmaW5hbFRyYW5zZm9ybVwiOiBbXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc3VwZXJcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1yZW5hbWVcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zaW1wbGVcIlxuICAgIF1cbiAgfSxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4zLjRcIlxufVxuIiwiYXZhaWxTZXRzID0gXG5cdG5hdGl2ZXM6IGltcG9ydCAnLi9uYXRpdmVzJ1xuXHRkb206IGltcG9ydCAnLi9kb20nXG5cbmNsYXNzIENoZWNrc1xuXHRjcmVhdGU6ICgpLT5cblx0XHRhcmdzID0gQXJyYXk6OnNsaWNlLmNhbGwoYXJndW1lbnRzKSBpZiBhcmd1bWVudHMubGVuZ3RoXG5cdFx0bmV3IENoZWNrcyhhcmdzKVxuXHRcblxuXHRjb25zdHJ1Y3RvcjogKHNldHMpLT5cblx0XHRzZXRzID89IFsnbmF0aXZlcyddXG5cdFx0XG5cdFx0Zm9yIHNldCBpbiBzZXRzXG5cdFx0XHRAbG9hZChhdmFpbFNldHNbc2V0XSkgaWYgYXZhaWxTZXRzW3NldF1cblxuXG5cdGxvYWQ6IChzZXQpLT5cblx0XHRzZXQgPSBhdmFpbFNldHNbc2V0XSBpZiBhdmFpbFNldHMubmF0aXZlcy5zdHJpbmcoc2V0KVxuXHRcdHJldHVybiBpZiBub3QgYXZhaWxTZXRzLm5hdGl2ZXMub2JqZWN0UGxhaW4oc2V0KVxuXHRcdFxuXHRcdGZvciBrZXksdmFsdWUgb2Ygc2V0XG5cdFx0XHRAW2tleV0gPSB2YWx1ZVxuXHRcdFxuXHRcdHJldHVyblxuXHRcblx0XG5tb2R1bGUuZXhwb3J0cyA9IENoZWNrczo6Y3JlYXRlKCkiLCJ2YXIgZXh0ZW5kLCBpc0FycmF5LCBpc09iamVjdCwgc2hvdWxkRGVlcEV4dGVuZDtcblxuaXNBcnJheSA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh0YXJnZXQpO1xufTtcblxuaXNPYmplY3QgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIHRhcmdldCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGFyZ2V0KSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgfHwgaXNBcnJheSh0YXJnZXQpO1xufTtcblxuc2hvdWxkRGVlcEV4dGVuZCA9IGZ1bmN0aW9uKG9wdGlvbnMsIHRhcmdldCwgcGFyZW50S2V5KSB7XG4gIGlmIChvcHRpb25zLmRlZXApIHtcbiAgICBpZiAob3B0aW9ucy5ub3REZWVwKSB7XG4gICAgICByZXR1cm4gIW9wdGlvbnMubm90RGVlcFt0YXJnZXRdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5kZWVwT25seSkge1xuICAgIHJldHVybiBvcHRpb25zLmRlZXBPbmx5W3RhcmdldF0gfHwgcGFyZW50S2V5ICYmIHNob3VsZERlZXBFeHRlbmQob3B0aW9ucywgcGFyZW50S2V5KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQgPSBmdW5jdGlvbihvcHRpb25zLCB0YXJnZXQsIHNvdXJjZXMsIHBhcmVudEtleSkge1xuICB2YXIgaSwga2V5LCBsZW4sIHNvdXJjZSwgc291cmNlVmFsdWUsIHN1YlRhcmdldCwgdGFyZ2V0VmFsdWU7XG4gIGlmICghdGFyZ2V0IHx8IHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnICYmIHR5cGVvZiB0YXJnZXQgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0YXJnZXQgPSB7fTtcbiAgfVxuICBmb3IgKGkgPSAwLCBsZW4gPSBzb3VyY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgc291cmNlID0gc291cmNlc1tpXTtcbiAgICBpZiAoc291cmNlICE9IG51bGwpIHtcbiAgICAgIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgICAgICBzb3VyY2VWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB0YXJnZXRWYWx1ZSA9IHRhcmdldFtrZXldO1xuICAgICAgICBpZiAoc291cmNlVmFsdWUgPT09IHRhcmdldCB8fCBzb3VyY2VWYWx1ZSA9PT0gdm9pZCAwIHx8IChzb3VyY2VWYWx1ZSA9PT0gbnVsbCAmJiAhb3B0aW9ucy5hbGxvd051bGwgJiYgIW9wdGlvbnMubnVsbERlbGV0ZXMpIHx8IChvcHRpb25zLmtleXMgJiYgIW9wdGlvbnMua2V5c1trZXldKSB8fCAob3B0aW9ucy5ub3RLZXlzICYmIG9wdGlvbnMubm90S2V5c1trZXldKSB8fCAob3B0aW9ucy5vd24gJiYgIXNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB8fCAob3B0aW9ucy5nbG9iYWxGaWx0ZXIgJiYgIW9wdGlvbnMuZ2xvYmFsRmlsdGVyKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSkpIHx8IChvcHRpb25zLmZpbHRlcnMgJiYgb3B0aW9ucy5maWx0ZXJzW2tleV0gJiYgIW9wdGlvbnMuZmlsdGVyc1trZXldKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNvdXJjZVZhbHVlID09PSBudWxsICYmIG9wdGlvbnMubnVsbERlbGV0ZXMpIHtcbiAgICAgICAgICBkZWxldGUgdGFyZ2V0W2tleV07XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuZ2xvYmFsVHJhbnNmb3JtKSB7XG4gICAgICAgICAgc291cmNlVmFsdWUgPSBvcHRpb25zLmdsb2JhbFRyYW5zZm9ybShzb3VyY2VWYWx1ZSwga2V5LCBzb3VyY2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnRyYW5zZm9ybXMgJiYgb3B0aW9ucy50cmFuc2Zvcm1zW2tleV0pIHtcbiAgICAgICAgICBzb3VyY2VWYWx1ZSA9IG9wdGlvbnMudHJhbnNmb3Jtc1trZXldKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChmYWxzZSkge1xuICAgICAgICAgIGNhc2UgIShvcHRpb25zLmNvbmNhdCAmJiBpc0FycmF5KHNvdXJjZVZhbHVlKSAmJiBpc0FycmF5KHRhcmdldFZhbHVlKSk6XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHRhcmdldFZhbHVlLmNvbmNhdChzb3VyY2VWYWx1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICEoc2hvdWxkRGVlcEV4dGVuZChvcHRpb25zLCBrZXksIHBhcmVudEtleSkgJiYgaXNPYmplY3Qoc291cmNlVmFsdWUpKTpcbiAgICAgICAgICAgIHN1YlRhcmdldCA9IGlzT2JqZWN0KHRhcmdldFZhbHVlKSA/IHRhcmdldFZhbHVlIDogaXNBcnJheShzb3VyY2VWYWx1ZSkgPyBbXSA6IHt9O1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBleHRlbmQob3B0aW9ucywgc3ViVGFyZ2V0LCBbc291cmNlVmFsdWVdLCBrZXkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUl1TGk5dWIyUmxYMjF2WkhWc1pYTXZjMjFoY25RdFpYaDBaVzVrTDNOeVl5OWxlSFJsYm1RdVkyOW1abVZsSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJjb25zdGFudHMgPSBpbXBvcnQgJy4vY29uc3RhbnRzJ1xuaGVscGVycyA9IGltcG9ydCAnLi9oZWxwZXJzJ1xuXG5RdWlja0NTUyA9ICh0YXJnZXRFbCwgcHJvcGVydHksIHZhbHVlKS0+XG5cdGlmIGhlbHBlcnMuaXNJdGVyYWJsZSh0YXJnZXRFbClcblx0XHRRdWlja0NTUyhzdWJFbCwgcHJvcGVydHksIHZhbHVlKSBmb3Igc3ViRWwgaW4gdGFyZ2V0RWxcblx0XG5cdGVsc2UgaWYgdHlwZW9mIHByb3BlcnR5IGlzICdvYmplY3QnICMgUGFzc2VkIGEgc3R5bGUgbWFwXG5cdFx0UXVpY2tDU1ModGFyZ2V0RWwsIHN1YlByb3BlcnR5LCBzdWJWYWx1ZSkgZm9yIHN1YlByb3BlcnR5LHN1YlZhbHVlIG9mIHByb3BlcnR5XG5cdFxuXHRlbHNlXG5cdFx0cHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5KHByb3BlcnR5KVxuXHRcdGlmIHR5cGVvZiB2YWx1ZSBpcyAndW5kZWZpbmVkJ1xuXHRcdFx0Y29tcHV0ZWRTdHlsZSA9IHRhcmdldEVsLl9jb21wdXRlZFN0eWxlIHx8PSBnZXRDb21wdXRlZFN0eWxlKHRhcmdldEVsKVxuXHRcdFx0cmV0dXJuIGNvbXB1dGVkU3R5bGVbcHJvcGVydHldXG5cdFx0XG5cdFx0ZWxzZSBpZiBwcm9wZXJ0eVxuXHRcdFx0dGFyZ2V0RWwuc3R5bGVbcHJvcGVydHldID0gaGVscGVycy5ub3JtYWxpemVWYWx1ZShwcm9wZXJ0eSwgdmFsdWUpXG5cblx0cmV0dXJuXG5cblxuUXVpY2tDU1MuYW5pbWF0aW9uID0gKG5hbWUsIGZyYW1lcyktPiBpZiBuYW1lIGFuZCB0eXBlb2YgbmFtZSBpcyAnc3RyaW5nJyBhbmQgZnJhbWVzIGFuZCB0eXBlb2YgZnJhbWVzIGlzICdvYmplY3QnXG5cdHByZWZpeCA9IGhlbHBlcnMuZ2V0UHJlZml4KCdhbmltYXRpb24nKVxuXHRnZW5lcmF0ZWQgPSAnJ1xuXHRcblx0Zm9yIGZyYW1lLHJ1bGVzIG9mIGZyYW1lc1xuXHRcdGdlbmVyYXRlZCArPSBcIiN7ZnJhbWV9IHsje2hlbHBlcnMucnVsZVRvU3RyaW5nKHJ1bGVzKX19XCJcblxuXHRnZW5lcmF0ZWQgPSBcIkAje3ByZWZpeH1rZXlmcmFtZXMgI3tuYW1lfSB7I3tnZW5lcmF0ZWR9fVwiXG5cdGhlbHBlcnMuaW5saW5lU3R5bGUoZ2VuZXJhdGVkLCB0cnVlLCAwKVxuXG5cblF1aWNrQ1NTLnJlZ2lzdGVyID0gKHJ1bGUsIGxldmVsKS0+IGlmIHJ1bGUgYW5kIHR5cGVvZiBydWxlIGlzICdvYmplY3QnXG5cdGxldmVsIHx8PSAwXG5cdHJ1bGUgPSBoZWxwZXJzLnJ1bGVUb1N0cmluZyhydWxlKVxuXHRcblx0dW5sZXNzIGNsYXNzTmFtZSA9IGhlbHBlcnMuaW5saW5lU3R5bGVDb25maWdbbGV2ZWxdP1tydWxlXVxuXHRcdGNsYXNzTmFtZSA9IGhlbHBlcnMuaGFzaChydWxlKVxuXHRcdHN0eWxlID0gXCIuI3tjbGFzc05hbWV9IHsje3J1bGV9fVwiXG5cdFx0aGVscGVycy5pbmxpbmVTdHlsZShzdHlsZSwgY2xhc3NOYW1lLCBsZXZlbClcblxuXHRyZXR1cm4gY2xhc3NOYW1lXG5cblxuUXVpY2tDU1MuY2xlYXJSZWdpc3RlcmVkID0gKGxldmVsKS0+XG5cdGhlbHBlcnMuY2xlYXJJbmxpbmVTdHlsZShsZXZlbCBvciAwKVxuXG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrQ1NTLlVOU0VUID0gc3dpdGNoXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywndW5zZXQnKSB0aGVuICd1bnNldCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbml0aWFsJykgdGhlbiAnaW5pdGlhbCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbmhlcml0JykgdGhlbiAnaW5oZXJpdCdcblxuUXVpY2tDU1Muc3VwcG9ydHMgPSBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWRcblF1aWNrQ1NTLnN1cHBvcnRzUHJvcGVydHkgPSBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZFxuUXVpY2tDU1Mubm9ybWFsaXplUHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5XG5RdWlja0NTUy5ub3JtYWxpemVWYWx1ZSA9IGhlbHBlcnMubm9ybWFsaXplVmFsdWVcblF1aWNrQ1NTLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrQ1NTIiwie1xuICBcIl9hcmdzXCI6IFtcbiAgICBbXG4gICAgICBcInF1aWNrY3NzQDEuMy4yXCIsXG4gICAgICBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIlxuICAgIF1cbiAgXSxcbiAgXCJfZnJvbVwiOiBcInF1aWNrY3NzQDEuMy4yXCIsXG4gIFwiX2lkXCI6IFwicXVpY2tjc3NAMS4zLjJcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1MakJVQm81cmVxbWNINUZDQzJ0WVFuUVdtMzZ3QjBXWHNCTm1zNWdEOVdOeU43VDRXSDlqbFZHUVAvbm5Fbm1IdDNTRG55cmFzVDNlTWJFVUROdlhRUT09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3F1aWNrY3NzXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJ2ZXJzaW9uXCIsXG4gICAgXCJyZWdpc3RyeVwiOiB0cnVlLFxuICAgIFwicmF3XCI6IFwicXVpY2tjc3NAMS4zLjJcIixcbiAgICBcIm5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICAgIFwicmF3U3BlY1wiOiBcIjEuMy4yXCIsXG4gICAgXCJzYXZlU3BlY1wiOiBudWxsLFxuICAgIFwiZmV0Y2hTcGVjXCI6IFwiMS4zLjJcIlxuICB9LFxuICBcIl9yZXF1aXJlZEJ5XCI6IFtcbiAgICBcIi9cIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3F1aWNrY3NzLy0vcXVpY2tjc3MtMS4zLjIudGd6XCIsXG4gIFwiX3NwZWNcIjogXCIxLjMuMlwiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcImRhbmllbGthbGVuXCJcbiAgfSxcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3F1aWNrY3NzLmRlYnVnLmpzXCIsXG4gICAgXCIuL2Rpc3QvcXVpY2tjc3MuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2Nzcy9pc3N1ZXNcIlxuICB9LFxuICBcImRlc2NyaXB0aW9uXCI6IFwiRmFzdCAmIGxpZ2h0IHdyYXBwZXIgZm9yIGdldHRpbmcvc2V0dGluZyBDU1MgcnVsZXNcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy41LjBcIixcbiAgICBcImNoYWxrXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJjb2ZmZWUtc2NyaXB0XCI6IFwiXjEuMTIuNlwiLFxuICAgIFwiZXhlY2FcIjogXCJeMC43LjBcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4zXCIsXG4gICAgXCJwcm9taXNlLWJyZWFrXCI6IFwiXjAuMS4xXCIsXG4gICAgXCJzZW12ZXJcIjogXCJeNS4zLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuMC1zMjdcIixcbiAgICBcInNpbXBseXdhdGNoXCI6IFwiXjMuMC4wLWwyXCJcbiAgfSxcbiAgXCJkaXJlY3Rvcmllc1wiOiB7XG4gICAgXCJ0ZXN0XCI6IFwidGVzdFwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tjc3MjcmVhZG1lXCIsXG4gIFwibGljZW5zZVwiOiBcIklTQ1wiLFxuICBcIm1haW5cIjogXCJkaXN0L3F1aWNrY3NzLmpzXCIsXG4gIFwibmFtZVwiOiBcInF1aWNrY3NzXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrY3NzLmdpdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcImNha2UgLWQgYnVpbGQgJiYgY2FrZSBidWlsZCAmJiBjYWtlIG1lYXN1cmUgJiYgY3AgLXIgYnVpbGQvKiBkaXN0L1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJjYWtlIGluc3RhbGw6Y292ZXJhZ2U7IG5wbSBydW4gY292ZXJhZ2U6cnVuICYmIG5wbSBydW4gY292ZXJhZ2U6YmFkZ2VcIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnJ1blwiOiBcImNvdmVyYWdlPXRydWUgbnBtIHJ1biB0ZXN0OmVsZWN0cm9uXCIsXG4gICAgXCJjb3ZlcmFnZTpzaG93XCI6IFwib3BlbiBjb3ZlcmFnZS9sY292LXJlcG9ydC9pbmRleC5odG1sXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJwb3N0dmVyc2lvblwiOiBcIm5wbSBydW4gYnVpbGQgJiYgZ2l0IGFkZCAuICYmIGdpdCBjb21taXQgLWEgLW0gJ1tCdWlsZF0nXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcIm5wbSBydW4gdGVzdDp0cmF2aXNcIixcbiAgICBcInRlc3RcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OmJyb3dzZXJcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRWxlY3Ryb24gLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpjaHJvbWVcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIENocm9tZSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmZpcmVmb3hcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRmlyZWZveCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpsb2NhbFwiOiBcIm9wZW4gdGVzdC90ZXN0cnVubmVyLmh0bWxcIixcbiAgICBcInRlc3Q6bWluaWZpZWRcIjogXCJtaW5pZmllZD0xIG5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6c2FmYXJpXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBTYWZhcmkgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYXVjZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIHNhdWNlPTEga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDp0cmF2aXNcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcIndhdGNoXCI6IFwiY2FrZSAtZCB3YXRjaFwiXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjMuMlwiXG59XG4iLCIhKGZ1bmN0aW9uKHdpbikge1xuXG4vKipcbiAqIEZhc3REb21cbiAqXG4gKiBFbGltaW5hdGVzIGxheW91dCB0aHJhc2hpbmdcbiAqIGJ5IGJhdGNoaW5nIERPTSByZWFkL3dyaXRlXG4gKiBpbnRlcmFjdGlvbnMuXG4gKlxuICogQGF1dGhvciBXaWxzb24gUGFnZSA8d2lsc29ucGFnZUBtZS5jb20+XG4gKiBAYXV0aG9yIEtvcm5lbCBMZXNpbnNraSA8a29ybmVsLmxlc2luc2tpQGZ0LmNvbT5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWluaSBsb2dnZXJcbiAqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xudmFyIGRlYnVnID0gMCA/IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSwgJ1tmYXN0ZG9tXScpIDogZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBOb3JtYWxpemVkIHJBRlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xudmFyIHJhZiA9IHdpbi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi5tc1JlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCBmdW5jdGlvbihjYikgeyByZXR1cm4gc2V0VGltZW91dChjYiwgMTYpOyB9O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBgRmFzdERvbWAuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEZhc3REb20oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5yZWFkcyA9IFtdO1xuICBzZWxmLndyaXRlcyA9IFtdO1xuICBzZWxmLnJhZiA9IHJhZi5iaW5kKHdpbik7IC8vIHRlc3QgaG9va1xuICBkZWJ1ZygnaW5pdGlhbGl6ZWQnLCBzZWxmKTtcbn1cblxuRmFzdERvbS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBGYXN0RG9tLFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgam9iIHRvIHRoZSByZWFkIGJhdGNoIGFuZFxuICAgKiBzY2hlZHVsZXMgYSBuZXcgZnJhbWUgaWYgbmVlZCBiZS5cbiAgICpcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIG1lYXN1cmU6IGZ1bmN0aW9uKGZuLCBjdHgpIHtcbiAgICBkZWJ1ZygnbWVhc3VyZScpO1xuICAgIHZhciB0YXNrID0gIWN0eCA/IGZuIDogZm4uYmluZChjdHgpO1xuICAgIHRoaXMucmVhZHMucHVzaCh0YXNrKTtcbiAgICBzY2hlZHVsZUZsdXNoKHRoaXMpO1xuICAgIHJldHVybiB0YXNrO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgam9iIHRvIHRoZVxuICAgKiB3cml0ZSBiYXRjaCBhbmQgc2NoZWR1bGVzXG4gICAqIGEgbmV3IGZyYW1lIGlmIG5lZWQgYmUuXG4gICAqXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICAgKiBAcHVibGljXG4gICAqL1xuICBtdXRhdGU6IGZ1bmN0aW9uKGZuLCBjdHgpIHtcbiAgICBkZWJ1ZygnbXV0YXRlJyk7XG4gICAgdmFyIHRhc2sgPSAhY3R4ID8gZm4gOiBmbi5iaW5kKGN0eCk7XG4gICAgdGhpcy53cml0ZXMucHVzaCh0YXNrKTtcbiAgICBzY2hlZHVsZUZsdXNoKHRoaXMpO1xuICAgIHJldHVybiB0YXNrO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYSBzY2hlZHVsZWQgJ3JlYWQnIG9yICd3cml0ZScgdGFzay5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHRhc2tcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2Vzc1xuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcjogZnVuY3Rpb24odGFzaykge1xuICAgIGRlYnVnKCdjbGVhcicsIHRhc2spO1xuICAgIHJldHVybiByZW1vdmUodGhpcy5yZWFkcywgdGFzaykgfHwgcmVtb3ZlKHRoaXMud3JpdGVzLCB0YXNrKTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIHRoaXMgRmFzdERvbSB3aXRoIHNvbWVcbiAgICogY3VzdG9tIGZ1bmN0aW9uYWxpdHkuXG4gICAqXG4gICAqIEJlY2F1c2UgZmFzdGRvbSBtdXN0ICphbHdheXMqIGJlIGFcbiAgICogc2luZ2xldG9uLCB3ZSdyZSBhY3R1YWxseSBleHRlbmRpbmdcbiAgICogdGhlIGZhc3Rkb20gaW5zdGFuY2UuIFRoaXMgbWVhbnMgdGFza3NcbiAgICogc2NoZWR1bGVkIGJ5IGFuIGV4dGVuc2lvbiBzdGlsbCBlbnRlclxuICAgKiBmYXN0ZG9tJ3MgZ2xvYmFsIHRhc2sgcXVldWUuXG4gICAqXG4gICAqIFRoZSAnc3VwZXInIGluc3RhbmNlIGNhbiBiZSBhY2Nlc3NlZFxuICAgKiBmcm9tIGB0aGlzLmZhc3Rkb21gLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgbXlGYXN0ZG9tID0gZmFzdGRvbS5leHRlbmQoe1xuICAgKiAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgKiAgICAgLy8gcnVucyBvbiBjcmVhdGlvblxuICAgKiAgIH0sXG4gICAqXG4gICAqICAgLy8gb3ZlcnJpZGUgYSBtZXRob2RcbiAgICogICBtZWFzdXJlOiBmdW5jdGlvbihmbikge1xuICAgKiAgICAgLy8gZG8gZXh0cmEgc3R1ZmYgLi4uXG4gICAqXG4gICAqICAgICAvLyB0aGVuIGNhbGwgdGhlIG9yaWdpbmFsXG4gICAqICAgICByZXR1cm4gdGhpcy5mYXN0ZG9tLm1lYXN1cmUoZm4pO1xuICAgKiAgIH0sXG4gICAqXG4gICAqICAgLi4uXG4gICAqIH0pO1xuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHByb3BzICBwcm9wZXJ0aWVzIHRvIG1peGluXG4gICAqIEByZXR1cm4ge0Zhc3REb219XG4gICAqL1xuICBleHRlbmQ6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgZGVidWcoJ2V4dGVuZCcsIHByb3BzKTtcbiAgICBpZiAodHlwZW9mIHByb3BzICE9ICdvYmplY3QnKSB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIG9iamVjdCcpO1xuXG4gICAgdmFyIGNoaWxkID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICBtaXhpbihjaGlsZCwgcHJvcHMpO1xuICAgIGNoaWxkLmZhc3Rkb20gPSB0aGlzO1xuXG4gICAgLy8gcnVuIG9wdGlvbmFsIGNyZWF0aW9uIGhvb2tcbiAgICBpZiAoY2hpbGQuaW5pdGlhbGl6ZSkgY2hpbGQuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIGNoaWxkO1xuICB9LFxuXG4gIC8vIG92ZXJyaWRlIHRoaXMgd2l0aCBhIGZ1bmN0aW9uXG4gIC8vIHRvIHByZXZlbnQgRXJyb3JzIGluIGNvbnNvbGVcbiAgLy8gd2hlbiB0YXNrcyB0aHJvd1xuICBjYXRjaDogbnVsbFxufTtcblxuLyoqXG4gKiBTY2hlZHVsZXMgYSBuZXcgcmVhZC93cml0ZVxuICogYmF0Y2ggaWYgb25lIGlzbid0IHBlbmRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gc2NoZWR1bGVGbHVzaChmYXN0ZG9tKSB7XG4gIGlmICghZmFzdGRvbS5zY2hlZHVsZWQpIHtcbiAgICBmYXN0ZG9tLnNjaGVkdWxlZCA9IHRydWU7XG4gICAgZmFzdGRvbS5yYWYoZmx1c2guYmluZChudWxsLCBmYXN0ZG9tKSk7XG4gICAgZGVidWcoJ2ZsdXNoIHNjaGVkdWxlZCcpO1xuICB9XG59XG5cbi8qKlxuICogUnVucyBxdWV1ZWQgYHJlYWRgIGFuZCBgd3JpdGVgIHRhc2tzLlxuICpcbiAqIEVycm9ycyBhcmUgY2F1Z2h0IGFuZCB0aHJvd24gYnkgZGVmYXVsdC5cbiAqIElmIGEgYC5jYXRjaGAgZnVuY3Rpb24gaGFzIGJlZW4gZGVmaW5lZFxuICogaXQgaXMgY2FsbGVkIGluc3RlYWQuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZmx1c2goZmFzdGRvbSkge1xuICBkZWJ1ZygnZmx1c2gnKTtcblxuICB2YXIgd3JpdGVzID0gZmFzdGRvbS53cml0ZXM7XG4gIHZhciByZWFkcyA9IGZhc3Rkb20ucmVhZHM7XG4gIHZhciBlcnJvcjtcblxuICB0cnkge1xuICAgIGRlYnVnKCdmbHVzaGluZyByZWFkcycsIHJlYWRzLmxlbmd0aCk7XG4gICAgcnVuVGFza3MocmVhZHMpO1xuICAgIGRlYnVnKCdmbHVzaGluZyB3cml0ZXMnLCB3cml0ZXMubGVuZ3RoKTtcbiAgICBydW5UYXNrcyh3cml0ZXMpO1xuICB9IGNhdGNoIChlKSB7IGVycm9yID0gZTsgfVxuXG4gIGZhc3Rkb20uc2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgLy8gSWYgdGhlIGJhdGNoIGVycm9yZWQgd2UgbWF5IHN0aWxsIGhhdmUgdGFza3MgcXVldWVkXG4gIGlmIChyZWFkcy5sZW5ndGggfHwgd3JpdGVzLmxlbmd0aCkgc2NoZWR1bGVGbHVzaChmYXN0ZG9tKTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICBkZWJ1ZygndGFzayBlcnJvcmVkJywgZXJyb3IubWVzc2FnZSk7XG4gICAgaWYgKGZhc3Rkb20uY2F0Y2gpIGZhc3Rkb20uY2F0Y2goZXJyb3IpO1xuICAgIGVsc2UgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBydW4gdGhpcyBpbnNpZGUgYSB0cnkgY2F0Y2hcbiAqIHNvIHRoYXQgaWYgYW55IGpvYnMgZXJyb3IsIHdlXG4gKiBhcmUgYWJsZSB0byByZWNvdmVyIGFuZCBjb250aW51ZVxuICogdG8gZmx1c2ggdGhlIGJhdGNoIHVudGlsIGl0J3MgZW1wdHkuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcnVuVGFza3ModGFza3MpIHtcbiAgZGVidWcoJ3J1biB0YXNrcycpO1xuICB2YXIgdGFzazsgd2hpbGUgKHRhc2sgPSB0YXNrcy5zaGlmdCgpKSB0YXNrKCk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhbiBBcnJheS5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyYXlcbiAqIEBwYXJhbSAgeyp9IGl0ZW1cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZShhcnJheSwgaXRlbSkge1xuICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuICByZXR1cm4gISF+aW5kZXggJiYgISFhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG4vKipcbiAqIE1peGluIG93biBwcm9wZXJ0aWVzIG9mIHNvdXJjZVxuICogb2JqZWN0IGludG8gdGhlIHRhcmdldC5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRhcmdldFxuICogQHBhcmFtICB7T2JqZWN0fSBzb3VyY2VcbiAqL1xuZnVuY3Rpb24gbWl4aW4odGFyZ2V0LCBzb3VyY2UpIHtcbiAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxufVxuXG4vLyBUaGVyZSBzaG91bGQgbmV2ZXIgYmUgbW9yZSB0aGFuXG4vLyBvbmUgaW5zdGFuY2Ugb2YgYEZhc3REb21gIGluIGFuIGFwcFxudmFyIGV4cG9ydHMgPSB3aW4uZmFzdGRvbSA9ICh3aW4uZmFzdGRvbSB8fCBuZXcgRmFzdERvbSgpKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbi8vIEV4cG9zZSB0byBDSlMgJiBBTURcbmlmICgodHlwZW9mIGRlZmluZSkgPT0gJ2Z1bmN0aW9uJykgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gZXhwb3J0czsgfSk7XG5lbHNlIGlmICgodHlwZW9mIG1vZHVsZSkgPT0gJ29iamVjdCcpIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcblxufSkoIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdGhpcyk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12Wm1GemRHUnZiUzltWVhOMFpHOXRMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJJUyA9IGltcG9ydCAnLi4vY2hlY2tzJ1xuU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5cblxuY2xhc3MgQ29uZGl0aW9uXG5cdGNvbnN0cnVjdG9yOiAoQGZpZWxkLCBAc2V0dGluZ3MsIEBjYWxsYmFjayktPlxuXHRcdEBzYXRpc2ZpZWQgPSBmYWxzZVxuXHRcdEB2YWx1ZSA9IEBzZXR0aW5ncy52YWx1ZVxuXHRcdEBwcm9wZXJ0eSA9IEBzZXR0aW5ncy5wcm9wZXJ0eSBvciAnX3ZhbHVlJ1xuXHRcdEBwcm9wZXJ0eSA9ICdfdmFsdWUnIGlmIEBzZXR0aW5ncy5wcm9wZXJ0eSBpcyAndmFsdWUnXG5cdFx0dGFyZ2V0ID0gQGZpZWxkLmFsbEZpZWxkc1tAc2V0dGluZ3MudGFyZ2V0XSBvciBAc2V0dGluZ3MudGFyZ2V0XHRcblx0XHRcblx0XHRpZiBJUy5maWVsZCh0YXJnZXQpXG5cdFx0XHRAdGFyZ2V0ID0gdGFyZ2V0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGNvbnNvbGUud2FybihcImNvbmRpdGlvbiB0YXJnZXQgbm90IGZvdW5kIGZvciB0aGUgcHJvdmlkZWQgSUQgJyN7QHNldHRpbmdzLnRhcmdldH0nXCIsIEBmaWVsZClcblxuXHRcdHByb3BlcnR5ID0gaWYgSVMuYXJyYXkoQHRhcmdldFtAcHJvcGVydHldKSB0aGVuIFwiYXJyYXk6I3tAcHJvcGVydHl9XCIgZWxzZSBAcHJvcGVydHlcblxuXHRcdFNpbXBseUJpbmQocHJvcGVydHksIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHRhcmdldClcblx0XHRcdC5hbmQoJ3Zpc2libGUnKS5vZihAdGFyZ2V0LnN0YXRlKVxuXHRcdFx0XHQudG8oQGNhbGxiYWNrKVxuXG5cdFx0U2ltcGx5QmluZCgnc2F0aXNmaWVkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0LnRvIChuZXdWYWx1ZSwgb2xkVmFsdWUpPT4gQGZpZWxkLmVtaXQ/KCdjb25kaXRpb25DaGFuZ2UnLCBAKSBpZiBvbGRWYWx1ZT9cblxuXG5cdHRlc3Q6ICgpLT5cblx0XHRpZiBub3QgQHRhcmdldD8uc3RhdGUudmlzaWJsZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRjb21wYXJpc29uID0gc3dpdGNoXG5cdFx0XHR3aGVuIElTLm9iamVjdFBsYWluKEB2YWx1ZSkgdGhlbiBAdmFsdWVcblx0XHRcdHdoZW4gSVMucmVnZXgoQHZhbHVlKSB0aGVuICckcmVnZXgnOkB2YWx1ZVxuXHRcdFx0d2hlbiBAdmFsdWUgaXMgJ3ZhbGlkJyBhbmQgbm90IEBzZXR0aW5ncy5wcm9wZXJ0eSBvciBub3QgSVMuZGVmaW5lZChAdmFsdWUpIHRoZW4gJ3ZhbGlkJ1xuXHRcdFx0ZWxzZSAnJGVxJzpAdmFsdWVcblxuXHRcdGlmIGNvbXBhcmlzb24gaXMgJ3ZhbGlkJ1xuXHRcdFx0cmV0dXJuIEB0YXJnZXQudmFsaWRhdGUoKVxuXHRcdFxuXHRcdHRhcmdldFZhbHVlID0gZG8gKCk9PlxuXHRcdFx0cmV0dXJuIEB0YXJnZXQudmFsdWUgaWYgQHByb3BlcnR5IGlzICdfdmFsdWUnXG5cdFx0XHRwcm9wZXJ0eUNoYWluID0gQHByb3BlcnR5LnNwbGl0KCcuJylcblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIHByb3BlcnR5Q2hhaW4ubGVuZ3RoIGlzIDFcblx0XHRcdFx0XHRAdGFyZ2V0W0Bwcm9wZXJ0eV1cblxuXHRcdFx0XHR3aGVuIElTLmRlZmluZWQoQHRhcmdldFtAcHJvcGVydHldKVxuXHRcdFx0XHRcdEB0YXJnZXRbQHByb3BlcnR5XVxuXHRcdFx0XHRcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG5lc3RlZE9iamVjdCA9IEB0YXJnZXRcblx0XHRcdFx0XHR3aGlsZSBJUy5vYmplY3QobmVzdGVkT2JqZWN0KVxuXHRcdFx0XHRcdFx0bmVzdGVkT2JqZWN0ID0gbmVzdGVkT2JqZWN0W3Byb3BlcnR5Q2hhaW4ucG9wKCldXG5cblx0XHRcdFx0XHRyZXR1cm4gbmVzdGVkT2JqZWN0XG5cblx0XHRjb21wYXJpc29uT3BlcmF0b3JzID0gT2JqZWN0LmtleXMoY29tcGFyaXNvbilcblx0XHRwYXNzZWRDb21wYXJpc29ucyA9IGNvbXBhcmlzb25PcGVyYXRvcnMuZmlsdGVyIChvcGVyYXRvciktPlxuXHRcdFx0c2Vla2VkVmFsdWUgPSBjb21wYXJpc29uW29wZXJhdG9yXVxuXHRcdFx0c3dpdGNoIG9wZXJhdG9yXG5cdFx0XHRcdHdoZW4gJyRlcSdcdFx0dGhlbiB0YXJnZXRWYWx1ZSBpcyBzZWVrZWRWYWx1ZSBcblx0XHRcdFx0d2hlbiAnJG5lJ1x0XHR0aGVuIHRhcmdldFZhbHVlIGlzbnQgc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGd0J1x0XHR0aGVuIHRhcmdldFZhbHVlID4gc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGd0ZSdcdFx0dGhlbiB0YXJnZXRWYWx1ZSA+PSBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckbHQnXHRcdHRoZW4gdGFyZ2V0VmFsdWUgPCBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckbHRlJ1x0XHR0aGVuIHRhcmdldFZhbHVlIDw9IHNlZWtlZFZhbHVlXG5cdFx0XHRcdHdoZW4gJyRjdCdcdFx0dGhlbiBoZWxwZXJzLmluY2x1ZGVzKHRhcmdldFZhbHVlLCBzZWVrZWRWYWx1ZSlcblx0XHRcdFx0d2hlbiAnJG5jdCdcdFx0dGhlbiBub3QgaGVscGVycy5pbmNsdWRlcyh0YXJnZXRWYWx1ZSwgc2Vla2VkVmFsdWUpXG5cdFx0XHRcdHdoZW4gJyRyZWdleCdcdHRoZW4gc2Vla2VkVmFsdWUudGVzdCh0YXJnZXRWYWx1ZSlcblx0XHRcdFx0d2hlbiAnJG5yZWdleCdcdHRoZW4gbm90IHNlZWtlZFZhbHVlLnRlc3QodGFyZ2V0VmFsdWUpXG5cdFx0XHRcdHdoZW4gJyRtYXNrJ1x0dGhlbiBoZWxwZXJzLnRlc3RNYXNrKHRhcmdldFZhbHVlLCBzZWVrZWRWYWx1ZSlcblx0XHRcdFx0ZWxzZSBmYWxzZVxuXG5cdFx0cmV0dXJuIHBhc3NlZENvbXBhcmlzb25zLmxlbmd0aCBpcyBjb21wYXJpc29uT3BlcmF0b3JzLmxlbmd0aFxuXG5cblx0QHZhbGlkYXRlOiAoY29uZGl0aW9ucyktPiBpZiBjb25kaXRpb25zXG5cdFx0dmFsaWRDb25kaXRpb25zID0gY29uZGl0aW9ucy5maWx0ZXIgKGNvbmRpdGlvbiktPlxuXHRcdFx0Y29uZGl0aW9uLnNhdGlzZmllZCA9IGNvbmRpdGlvbi50ZXN0KClcblx0XHRcblx0XHRyZXR1cm4gdmFsaWRDb25kaXRpb25zLmxlbmd0aCBpcyBjb25kaXRpb25zLmxlbmd0aFxuXG5cblx0QGluaXQ6IChmaWVsZCwgY29uZGl0aW9ucywgY2FsbGJhY2spLT4gc2V0VGltZW91dCAoKT0+XG5cdFx0Y2FsbGJhY2sgPz0gKCk9PiBmaWVsZC52YWxpZGF0ZUNvbmRpdGlvbnMoKVxuXHRcdFxuXHRcdGZpZWxkLmNvbmRpdGlvbnMgPSBjb25kaXRpb25zLm1hcCAoY29uZGl0aW9uKS0+XG5cdFx0XHRuZXcgQ29uZGl0aW9uKGZpZWxkLCBjb25kaXRpb24sIGNhbGxiYWNrKVxuXG5cdFx0Y2FsbGJhY2soKVxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmRpdGlvbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBmb250RmFtaWx5OiAnc3lzdGVtLXVpLCBzYW5zLXNlcmlmJyxcbiAgdGVtcGxhdGVzOiB7fSxcbiAgbGFiZWw6IGZhbHNlLFxuICBlcnJvcjogJycsXG4gIGhlbHA6ICcnLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICB3aWR0aDogJzEwMCUnLFxuICBtb2JpbGVXaWR0aDogbnVsbCxcbiAgbW9iaWxlVGhyZXNob2xkOiA3MzYsXG4gIGJvcmRlcjogMSxcbiAgbWFyZ2luOiBudWxsLFxuICBwYWRkaW5nOiBudWxsLFxuICBkaXN0YW5jZTogbnVsbCxcbiAgaW5wdXRQYWRkaW5nOiAxMixcbiAgZm9udFNpemU6IDE0LFxuICBsYWJlbFNpemU6IG51bGwsXG4gIGljb246IG51bGwsXG4gIGljb25TaXplOiAyMixcbiAgZ2V0dGVyOiBudWxsLFxuICBzZXR0ZXI6IG51bGwsXG4gIHZhbGlkYXRvcjogbnVsbCxcbiAgY2xlYXJFcnJvck9uVmFsaWQ6IHRydWVcbn07XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUptYVdWc1pDOW5iRzlpWVd4RVpXWmhkV3gwY3k1amIyWm1aV1VpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2VzExOSIsIklTID0gaW1wb3J0ICcuLi8uLi9jaGVja3MnXG5TaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcbktFWUNPREVTID0gaW1wb3J0ICcuLi8uLi9jb25zdGFudHMva2V5Q29kZXMnXG5oZWxwZXJzID0gaW1wb3J0ICcuLi8uLi9oZWxwZXJzJ1xuQ29uZGl0aW9uID0gaW1wb3J0ICcuLi9jb25kaXRpb24nXG5leHRlbmQgPSBpbXBvcnQgJ3NtYXJ0LWV4dGVuZCdcbkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5nbG9iYWxEZWZhdWx0cyA9IGltcG9ydCAnLi4vLi4vZmllbGQvZ2xvYmFsRGVmYXVsdHMnXG5pbXBvcnQgKiBhcyB0ZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlJ1xuaW1wb3J0ICogYXMgZGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0cydcblxuY2xhc3MgRHJvcGRvd25cblx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdGRlZmF1bHRzOiBkZWZhdWx0c1xuXHRfc2V0dGluZ0ZpbHRlcnM6IG1heEhlaWdodDogKHZhbHVlKS0+IElTLm51bWJlcih2YWx1ZSlcblx0XG5cdGNvbnN0cnVjdG9yOiAoQGluaXRpYWxDaG9pY2VzLCBAZmllbGQpLT5cblx0XHRAaXNPcGVuID0gZmFsc2Vcblx0XHRAdHlwZUJ1ZmZlciA9ICcnXG5cdFx0QHNldHRpbmdzID0gZXh0ZW5kLmRlZXAuY2xvbmUuZmlsdGVyKEBfc2V0dGluZ0ZpbHRlcnMpKGdsb2JhbERlZmF1bHRzLCBAZGVmYXVsdHMsIEBmaWVsZC5zZXR0aW5ncy5kcm9wZG93bilcblx0XHRAc2VsZWN0ZWQgPSBpZiBAc2V0dGluZ3MubXVsdGlwbGUgdGhlbiBbXSBlbHNlIG51bGxcblx0XHRAbGFzdFNlbGVjdGVkID0gbnVsbFxuXHRcdEBjaG9pY2VzID0gW11cblx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gbnVsbFxuXHRcdEB2aXNpYmxlQ2hvaWNlc0NvdW50ID0gMFxuXHRcdEB2aXNpYmxlQ2hvaWNlcyA9IFtdXG5cdFx0QGVscyA9IHt9XG5cdFx0QF9zZWxlY3RlZENhbGxiYWNrID0gaGVscGVycy5ub29wXG5cdFx0XG5cdFx0QF9jcmVhdGVFbGVtZW50cygpXG5cdFx0QF9hdHRhY2hCaW5kaW5ncygpXG5cdFx0cmV0dXJuIEBcblxuXG5cdF9jcmVhdGVFbGVtZW50czogKCktPlxuXHRcdGdsb2JhbE9wdHMgPSB7cmVsYXRlZEluc3RhbmNlOkB9XG5cdFx0QGVscy5jb250YWluZXIgPSBAdGVtcGxhdGUuZGVmYXVsdC5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmRlZmF1bHQsIGV4dGVuZCh7cGFzc1N0YXRlVG9DaGlsZHJlbjpmYWxzZX0sIGdsb2JhbE9wdHMpKVxuXHRcdEBlbHMubGlzdCA9IEB0ZW1wbGF0ZS5saXN0LnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMubGlzdCwgZ2xvYmFsT3B0cykuYXBwZW5kVG8oQGVscy5jb250YWluZXIpXG5cdFx0QGVscy5oZWxwID0gQHRlbXBsYXRlLmhlbHAuc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5oZWxwLCBnbG9iYWxPcHRzKS5hcHBlbmRUbyhAZWxzLmNvbnRhaW5lcilcblx0XHRAZWxzLnNjcm9sbEluZGljYXRvclVwID0gQHRlbXBsYXRlLnNjcm9sbEluZGljYXRvclVwLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuc2Nyb2xsSW5kaWNhdG9yVXAsIGdsb2JhbE9wdHMpLmFwcGVuZFRvKEBlbHMuY29udGFpbmVyKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93biA9IEB0ZW1wbGF0ZS5zY3JvbGxJbmRpY2F0b3JEb3duLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuc2Nyb2xsSW5kaWNhdG9yRG93biwgZ2xvYmFsT3B0cykuYXBwZW5kVG8oQGVscy5jb250YWluZXIpXG5cblx0XHRAbGlzdCA9IG5ldyBMaXN0KEApXG5cdFx0QGFkZENob2ljZShjaG9pY2UpIGZvciBjaG9pY2UgaW4gQGluaXRpYWxDaG9pY2VzXG5cdFx0cmV0dXJuXG5cblxuXG5cdF9hdHRhY2hCaW5kaW5nczogKCktPlxuXHRcdEBfYXR0YWNoQmluZGluZ3NfZWxTdGF0ZSgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5KClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX3Njcm9sbEluZGljYXRvcnMoKVxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2VsU3RhdGU6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdoZWxwJykub2YoQHNldHRpbmdzKVxuXHRcdFx0LnRvKCd0ZXh0Jykub2YoQGVscy5oZWxwKVxuXHRcdFx0LmFuZC50byAoc2hvd0hlbHApPT4gQGVscy5oZWxwLnN0YXRlICdzaG93SGVscCcsIHNob3dIZWxwXG5cblx0XHRTaW1wbHlCaW5kKCd2aXNpYmxlQ2hvaWNlc0NvdW50Jykub2YoQClcblx0XHRcdC50byAoY291bnQpPT4gQGVscy5jb250YWluZXIuc3RhdGUgJ2hhc1Zpc2libGVDaG9pY2VzJywgISFjb3VudFxuXHRcblx0XHRTaW1wbHlCaW5kKCdjdXJyZW50SGlnaGxpZ2h0ZWQnKS5vZihAKVxuXHRcdFx0LnRvIChjdXJyZW50LCBwcmV2KT0+XG5cdFx0XHRcdHByZXYuZWwuc3RhdGUoJ2hvdmVyJywgb2ZmKSBpZiBwcmV2XG5cdFx0XHRcdGN1cnJlbnQuZWwuc3RhdGUoJ2hvdmVyJywgb24pIGlmIGN1cnJlbnRcblxuXG5cdF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5OiAoKS0+XG5cdFx0U2ltcGx5QmluZCgnaXNPcGVuJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKS50byAoaXNPcGVuKT0+XG5cdFx0XHRAZWxzLmNvbnRhaW5lci5zdGF0ZSAnaXNPcGVuJywgaXNPcGVuXHRcdFxuXHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IG51bGwgaWYgbm90IGlzT3BlblxuXHRcblx0XHRcdGlmIEBzZXR0aW5ncy5sb2NrU2Nyb2xsXG5cdFx0XHRcdGlmIGlzT3BlblxuXHRcdFx0XHRcdGhlbHBlcnMubG9ja1Njcm9sbChAZWxzLmxpc3QpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRoZWxwZXJzLnVubG9ja1Njcm9sbCgpXG5cblx0XHRcdGlmIGlzT3BlblxuXHRcdFx0XHRAbGlzdC5jYWxjRGlzcGxheSgpXG5cdFx0XHRcdEBsaXN0LnNjcm9sbFRvQ2hvaWNlKEBzZWxlY3RlZCkgaWYgQHNlbGVjdGVkIGFuZCBub3QgQHNldHRpbmdzLm11bHRpcGxlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBsaXN0LnNldFRyYW5zbGF0ZSgwKVxuXG5cblx0XHRTaW1wbHlCaW5kKCdsYXN0U2VsZWN0ZWQnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UsIHVwZGF0ZUV2ZW5JZlNhbWU6dHJ1ZSkub2YoQClcblx0XHRcdC50byAobmV3Q2hvaWNlLCBwcmV2Q2hvaWNlKT0+IEBfc2VsZWN0ZWRDYWxsYmFjayhuZXdDaG9pY2UsIHByZXZDaG9pY2UpXG5cblxuXHRcdFNpbXBseUJpbmQoJ2ZvY3VzZWQnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEBmaWVsZC5zdGF0ZSkudG8gKGZvY3VzZWQpPT5cblx0XHRcdGlmIG5vdCBmb2N1c2VkXG5cdFx0XHRcdEBmaWVsZC5lbC5jaGlsZC5pbnB1dC5vZmYgJ2tleWRvd24uZHJvcGRvd25OYXYnXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBmaWVsZC5lbC5jaGlsZC5pbnB1dC5vbiAna2V5ZG93bi5kcm9wZG93bk5hdicsIChldmVudCk9PiBpZiBAaXNPcGVuIHRoZW4gc3dpdGNoIGV2ZW50LmtleUNvZGVcblx0XHRcdFx0XHR3aGVuIEtFWUNPREVTLnVwXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0XHRAaGlnaGxpZ2h0UHJldigpXG5cblx0XHRcdFx0XHR3aGVuIEtFWUNPREVTLmRvd25cblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdEBoaWdobGlnaHROZXh0KClcblxuXHRcdFx0XHRcdHdoZW4gS0VZQ09ERVMuZW50ZXJcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdEBsYXN0U2VsZWN0ZWQgPSBAY3VycmVudEhpZ2hsaWdodGVkIGlmIEBjdXJyZW50SGlnaGxpZ2h0ZWRcblxuXHRcdFx0XHRcdHdoZW4gS0VZQ09ERVMuZXNjXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0XHRAaXNPcGVuID0gZmFsc2VcblxuXHRcdFxuXHRcdHJldHVybiBpZiBub3QgQHNldHRpbmdzLnR5cGVCdWZmZXJcblx0XHRTaW1wbHlCaW5kKCdmb2N1c2VkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAZmllbGQuc3RhdGUpLnRvIChmb2N1c2VkKT0+XG5cdFx0XHRpZiBub3QgZm9jdXNlZFxuXHRcdFx0XHRET00oZG9jdW1lbnQpLm9mZiAna2V5cHJlc3MuZHJvcGRvd25UeXBlQnVmZmVyJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRET00oZG9jdW1lbnQpLm9uICdrZXlwcmVzcy5kcm9wZG93blR5cGVCdWZmZXInLCAoZXZlbnQpPT4gaWYgQGlzT3BlblxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRyZXR1cm4gaWYgbm90IEtFWUNPREVTLmFueVByaW50YWJsZShldmVudC5rZXlDb2RlKVxuXHRcdFx0XHRcdEB0eXBlQnVmZmVyICs9IGV2ZW50LmtleVxuXG5cblx0XHRTaW1wbHlCaW5kKCd0eXBlQnVmZmVyJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0LnRvICgpPT5cblx0XHRcdFx0Y2xlYXJUaW1lb3V0KEB0eXBlQnVmZmVyVGltZW91dClcblx0XHRcdFx0QHR5cGVCdWZmZXJUaW1lb3V0ID0gc2V0VGltZW91dCAoKT0+XG5cdFx0XHRcdFx0QHR5cGVCdWZmZXIgPSAnJ1xuXHRcdFx0XHQsMTUwMFxuXHRcdFx0XG5cdFx0XHQuYW5kLnRvIChidWZmZXIpPT4gaWYgYnVmZmVyXG5cdFx0XHRcdGZvciBjaG9pY2UgaW4gQHZpc2libGVDaG9pY2VzXG5cdFx0XHRcdFx0aWYgaGVscGVycy5zdGFydHNXaXRoKGJ1ZmZlciwgY2hvaWNlLmxhYmVsKVxuXHRcdFx0XHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IGNob2ljZVxuXHRcdFx0XHRcdFx0QGxpc3Quc2Nyb2xsVG9DaG9pY2UoY2hvaWNlKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc19zY3JvbGxJbmRpY2F0b3JzOiAoKS0+XG5cdFx0U2ltcGx5QmluZCgnc2Nyb2xsVG9wJywgdXBkYXRlRXZlbklmU2FtZTp0cnVlKS5vZihAZWxzLmxpc3QucmF3KVxuXHRcdFx0LnRvIChzY3JvbGxUb3ApPT5cblx0XHRcdFx0c2hvd1RvcEluZGljYXRvciA9IHNjcm9sbFRvcCA+IDBcblx0XHRcdFx0c2hvd0JvdHRvbUluZGljYXRvciA9IEBlbHMubGlzdC5yYXcuc2Nyb2xsSGVpZ2h0IC0gQGVscy5saXN0LnJhdy5jbGllbnRIZWlnaHQgPiBzY3JvbGxUb3BcblxuXHRcdFx0XHRAZWxzLnNjcm9sbEluZGljYXRvclVwLnN0YXRlICd2aXNpYmxlJywgc2hvd1RvcEluZGljYXRvclxuXHRcdFx0XHRAZWxzLnNjcm9sbEluZGljYXRvckRvd24uc3RhdGUgJ3Zpc2libGUnLCBzaG93Qm90dG9tSW5kaWNhdG9yXG5cblx0XHRcdC5jb25kaXRpb24gKCk9PiBAaXNPcGVuIGFuZCBub3QgQHNldHRpbmdzLmhlbHAgYW5kIEBlbHMubGlzdC5yYXcuc2Nyb2xsSGVpZ2h0IGlzbnQgQGVscy5saXN0LnJhdy5jbGllbnRIZWlnaHQgYW5kIEBlbHMubGlzdC5yYXcuY2xpZW50SGVpZ2h0ID49IDEwMFxuXHRcdFx0LnVwZGF0ZU9uKCdldmVudDpzY3JvbGwnKS5vZihAZWxzLmxpc3QucmF3KVxuXHRcdFx0LnVwZGF0ZU9uKCdpc09wZW4nKS5vZihAKVxuXG5cdFx0QGVscy5zY3JvbGxJbmRpY2F0b3JVcC5vbiAnbW91c2VlbnRlcicsICgpPT4gQGxpc3Quc3RhcnRTY3JvbGxpbmcoJ3VwJylcblx0XHRAZWxzLnNjcm9sbEluZGljYXRvclVwLm9uICdtb3VzZWxlYXZlJywgKCk9PiBAbGlzdC5zdG9wU2Nyb2xsaW5nKClcblx0XHRAZWxzLnNjcm9sbEluZGljYXRvckRvd24ub24gJ21vdXNlZW50ZXInLCAoKT0+IEBsaXN0LnN0YXJ0U2Nyb2xsaW5nKCdkb3duJylcblx0XHRAZWxzLnNjcm9sbEluZGljYXRvckRvd24ub24gJ21vdXNlbGVhdmUnLCAoKT0+IEBsaXN0LnN0b3BTY3JvbGxpbmcoKVxuXG5cblx0YWRkQ2hvaWNlOiAoY29uZmlnKS0+XG5cdFx0aWYgSVMuYXJyYXkoY29uZmlnKVxuXHRcdFx0QGFkZENob2ljZShpdGVtKSBmb3IgaXRlbSBpbiBjb25maWdcblx0XHRcdHJldHVyblxuXHRcdFxuXHRcdGVsc2UgaWYgSVMuc3RyaW5nKGNvbmZpZylcblx0XHRcdGNvbmZpZyA9IHtsYWJlbDpjb25maWcsIHZhbHVlOmNvbmZpZ31cblx0XHRcblx0XHRlbHNlIGlmIElTLm9iamVjdFBsYWluKGNvbmZpZylcblx0XHRcdGNvbmZpZy52YWx1ZSA/PSBjb25maWcubGFiZWxcblx0XHRcdGNvbmZpZy5sYWJlbCA/PSBjb25maWcudmFsdWVcblxuXHRcdGVsc2UgcmV0dXJuXG5cblx0XHRuZXdDaG9pY2UgPSBuZXcgQ2hvaWNlKEAsIGNvbmZpZywgQGxpc3QsIEBjaG9pY2VzLmxlbmd0aClcblx0XHRAY2hvaWNlcy5wdXNoKG5ld0Nob2ljZSlcblx0XHRyZXR1cm4gbmV3Q2hvaWNlXG5cblxuXHRhcHBlbmRUbzogKHRhcmdldCktPlxuXHRcdEBlbHMuY29udGFpbmVyLmFwcGVuZFRvKHRhcmdldClcblxuXG5cdG9uU2VsZWN0ZWQ6IChjYWxsYmFjayktPlxuXHRcdEBfc2VsZWN0ZWRDYWxsYmFjayA9IGNhbGxiYWNrXG5cblxuXHRmaW5kQ2hvaWNlOiAocHJvdmlkZWRWYWx1ZSwgYnlMYWJlbCktPlxuXHRcdG1hdGNoZXMgPSBAY2hvaWNlcy5maWx0ZXIgKGNob2ljZSktPiBzd2l0Y2hcblx0XHRcdHdoZW4gSVMub2JqZWN0KHByb3ZpZGVkVmFsdWUpIHRoZW4gcHJvdmlkZWRWYWx1ZSBpcyBjaG9pY2Vcblx0XHRcdHdoZW4gYnlMYWJlbCB0aGVuIHByb3ZpZGVkVmFsdWUgaXMgY2hvaWNlLmxhYmVsXG5cdFx0XHRlbHNlIHByb3ZpZGVkVmFsdWUgaXMgY2hvaWNlLnZhbHVlXG5cblx0XHRyZXR1cm4gbWF0Y2hlc1swXVxuXG5cblx0ZmluZENob2ljZUFueTogKHByb3ZpZGVkVmFsdWUpLT5cblx0XHRAZmluZENob2ljZShwcm92aWRlZFZhbHVlKSBvciBAZmluZENob2ljZShwcm92aWRlZFZhbHVlLCB0cnVlKVxuXG5cblx0aGlnaGxpZ2h0UHJldjogKCktPlxuXHRcdGN1cnJlbnRJbmRleCA9IEB2aXNpYmxlQ2hvaWNlcy5pbmRleE9mKEBjdXJyZW50SGlnaGxpZ2h0ZWQpXG5cdFx0XG5cdFx0aWYgY3VycmVudEluZGV4ID4gMFxuXHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IGNob2ljZSA9IEB2aXNpYmxlQ2hvaWNlc1tjdXJyZW50SW5kZXgtMV1cblx0XHRcdEBsaXN0LnNjcm9sbFVwKGNob2ljZSkgdW5sZXNzIEBsaXN0LmNob2ljZUluVmlldyhjaG9pY2UpXG5cdFx0ZWxzZVxuXHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IGNob2ljZSA9IEB2aXNpYmxlQ2hvaWNlc1tAdmlzaWJsZUNob2ljZXMubGVuZ3RoLTFdXG5cdFx0XHRAbGlzdC5zY3JvbGxUb0Nob2ljZShjaG9pY2UsMSkgdW5sZXNzIEBsaXN0LmNob2ljZUluVmlldyhjaG9pY2UpXG5cblxuXG5cdGhpZ2hsaWdodE5leHQ6ICgpLT5cblx0XHRjdXJyZW50SW5kZXggPSBAdmlzaWJsZUNob2ljZXMuaW5kZXhPZihAY3VycmVudEhpZ2hsaWdodGVkKVxuXHRcdFxuXHRcdGlmIGN1cnJlbnRJbmRleCA8IEB2aXNpYmxlQ2hvaWNlcy5sZW5ndGgtMVxuXHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IGNob2ljZSA9IEB2aXNpYmxlQ2hvaWNlc1tjdXJyZW50SW5kZXgrMV1cblx0XHRcdEBsaXN0LnNjcm9sbERvd24oY2hvaWNlKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblx0XHRlbHNlXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzWzBdXG5cdFx0XHRAbGlzdC5zY3JvbGxUb0Nob2ljZShjaG9pY2UsMSkgdW5sZXNzIEBsaXN0LmNob2ljZUluVmlldyhjaG9pY2UpXG5cblxuXG5cblxuXG5cbmNsYXNzIExpc3Rcblx0Y29uc3RydWN0b3I6IChAZHJvcGRvd24pLT5cblx0XHR7QGVscywgQGZpZWxkLCBAc2V0dGluZ3N9ID0gQGRyb3Bkb3duXG5cdFx0QGVsID0gQGVscy5saXN0XG5cdFx0QGNvbnRhaW5lciA9IEBlbHMuY29udGFpbmVyXG5cblx0Y2FsY0Rpc3BsYXk6ICgpLT5cblx0XHR3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcblx0XHR0cmFuc2xhdGlvbiA9IEB0cmFuc2xhdGlvbiBvciAwXG5cdFx0Y2xpcHBpbmdQYXJlbnQgPSBAY29udGFpbmVyLnBhcmVudE1hdGNoaW5nIChwYXJlbnQpLT4gb3ZlcmZsb3c9cGFyZW50LnN0eWxlKCdvdmVyZmxvd1knKTsgb3ZlcmZsb3cgaXMgJ2hpZGRlbicgb3Igb3ZlcmZsb3cgaXMgJ3Njcm9sbCdcblx0XHRzY3JvbGxIZWlnaHQgPSBAZWwucmF3LnNjcm9sbEhlaWdodCBvciBJbmZpbml0eVxuXHRcdHNlbGZSZWN0ID0gZXh0ZW5kLmNsb25lIEBjb250YWluZXIucmVjdFxuXHRcdHBhZGRpbmcgPSBzZWxmUmVjdC5oZWlnaHQgLSBAZWwuaGVpZ2h0XG5cdFx0aGVpZ2h0ID0gTWF0aC5taW4gc2Nyb2xsSGVpZ2h0LCBAc2V0dGluZ3MubWF4SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQtNDBcblx0XHRzZWxmUmVjdC5ib3R0b20gPSBzZWxmUmVjdC50b3AgKyBoZWlnaHRcblxuXHRcdGlmIGNsaXBwaW5nUGFyZW50XG5cdFx0XHRjbGlwcGluZ1JlY3QgPSBjbGlwcGluZ1BhcmVudC5yZWN0XG5cdFx0XHRib3R0b21DdXRvZmYgPSBzZWxmUmVjdC5ib3R0b20gLSBjbGlwcGluZ1JlY3QuYm90dG9tXG5cdFx0XHR0b3BDdXRvZmYgPSBjbGlwcGluZ1JlY3QudG9wIC0gc2VsZlJlY3QudG9wXG5cdFx0XHRpc0JvdHRvbUN1dG9mZiA9IGJvdHRvbUN1dG9mZiA+IDBcblx0XHRcdGlzVG9wQ3V0b2ZmID0gdG9wQ3V0b2ZmID4gMFxuXG5cdFx0XHRpZiBzZWxmUmVjdC50b3AgPj0gY2xpcHBpbmdSZWN0LmJvdHRvbSBvciBjbGlwcGluZ1JlY3QudG9wID49IHNlbGZSZWN0LmJvdHRvbVxuXHRcdFx0XHRjb25zb2xlLndhcm4oXCJUaGUgZHJvcGRvd24gZm9yIGVsZW1lbnQgJyN7QGZpZWxkLklEfScgY2Fubm90IGJlIGRpc3BsYXllZCBhcyBpdCdzIGhpZGRlbiBieSB0aGUgcGFyZW50IG92ZXJmbG93XCIpXG5cdFx0XHRcblx0XHRcdGVsc2UgaWYgaXNCb3R0b21DdXRvZmYgb3IgaXNUb3BDdXRvZmZcblx0XHRcdFx0bmVlZHNOZXdIZWlnaHQgPSB0cnVlXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBzZWxmUmVjdC50b3AgLSBib3R0b21DdXRvZmYgPiBjbGlwcGluZ1JlY3QudG9wIGFuZCBub3QgaXNUb3BDdXRvZmZcblx0XHRcdFx0XHR0cmFuc2xhdGlvbiA9IGJvdHRvbUN1dG9mZlxuXHRcdFx0XHRcdHNlbGZSZWN0LnRvcCAtPSB0cmFuc2xhdGlvblxuXHRcdFx0XHRcdHNlbGZSZWN0LmJvdHRvbSAtPSB0cmFuc2xhdGlvblxuXHRcdFx0XHRcdGN1dG9mZiA9IGNsaXBwaW5nUmVjdC50b3AgLSBzZWxmUmVjdC50b3BcblxuXHRcdFx0XHRlbHNlIGlmIHNlbGZSZWN0LmJvdHRvbSAtIHRvcEN1dG9mZiA8IGNsaXBwaW5nUmVjdC5ib3R0b21cblx0XHRcdFx0XHR0cmFuc2xhdGlvbiA9IHRvcEN1dG9mZiAqIC0xXG5cdFx0XHRcdFx0c2VsZlJlY3QudG9wICs9IHRyYW5zbGF0aW9uXG5cdFx0XHRcdFx0c2VsZlJlY3QuYm90dG9tICs9IHRyYW5zbGF0aW9uXG5cdFx0XHRcdFx0Y3V0b2ZmID0gc2VsZlJlY3QuYm90dG9tIC0gY2xpcHBpbmdSZWN0LmJvdHRvbVxuXG5cblx0XHRcdFx0aWYgbmVlZHNOZXdIZWlnaHQgPSBjdXRvZmYgPiAwXG5cdFx0XHRcdFx0aGVpZ2h0ID0gY3V0b2ZmIC0gcGFkZGluZ1xuXG5cdFx0XG5cdFx0d2luZG93Q3V0b2ZmID0gKHNlbGZSZWN0LnRvcCArIGhlaWdodCkgLSB3aW5kb3dIZWlnaHRcblx0XHRcblx0XHRpZiB3aW5kb3dDdXRvZmYgPiAwIGFuZCBoZWlnaHQgPCB3aW5kb3dIZWlnaHRcblx0XHRcdHRyYW5zbGF0aW9uICs9IHdpbmRvd0N1dG9mZisxMFxuXG5cdFx0QHNldERpbWVuc2lvbnMoaGVpZ2h0LCBAZmllbGQuZWwuY2hpbGQuaW5uZXJ3cmFwLndpZHRoKzEwKVxuXHRcdEBzZXRUcmFuc2xhdGUodHJhbnNsYXRpb24pXG5cblxuXHRzZXREaW1lbnNpb25zOiAoaGVpZ2h0LCB3aWR0aCktPlxuXHRcdEBlbC5zdHlsZSAnbWF4SGVpZ2h0JywgaGVpZ2h0IGlmIGhlaWdodD9cblx0XHRAZWwuc3R5bGUgJ21pbldpZHRoJywgd2lkdGggaWYgd2lkdGg/XG5cblx0XG5cdHNldFRyYW5zbGF0ZTogKHRyYW5zbGF0aW9uKS0+XG5cdFx0QHRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb25cblx0XHR0cmFuc2xhdGlvbiAqPSAtMVxuXHRcdEBjb250YWluZXIuc3R5bGUgJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlWSgje3RyYW5zbGF0aW9ufXB4KVwiXG5cblxuXHRzY3JvbGxUb0Nob2ljZTogKGNob2ljZSxvZmZzZXQ9MyktPlxuXHRcdGRpc3RhbmVGcm9tVG9wID0gY2hvaWNlLmVsLnJhdy5vZmZzZXRUb3Bcblx0XHRzZWxlY3RlZEhlaWdodCA9IGNob2ljZS5lbC5oZWlnaHRcblx0XHRcblx0XHRAZWwucmF3LnNjcm9sbFRvcCA9IGRpc3RhbmVGcm9tVG9wIC0gc2VsZWN0ZWRIZWlnaHQqb2Zmc2V0XG5cblx0c2Nyb2xsRG93bjogKGNob2ljZSktPlxuXHRcdEBlbC5yYXcuc2Nyb2xsVG9wICs9IGNob2ljZS5lbC5oZWlnaHRcblxuXHRzY3JvbGxVcDogKGNob2ljZSktPlxuXHRcdEBlbC5yYXcuc2Nyb2xsVG9wIC09IGNob2ljZS5lbC5oZWlnaHRcblxuXHRjaG9pY2VJblZpZXc6IChjaG9pY2UpPT5cblx0XHRjaG9pY2VSZWN0ID0gY2hvaWNlLmVsLnJlY3Rcblx0XHRsaXN0UmVjdCA9IEBlbC5yZWN0XG5cdFx0dXBQYWRkaW5nID0gaWYgQGVscy5zY3JvbGxJbmRpY2F0b3JVcC5zdGF0ZSgndmlzaWJsZScpIHRoZW4gcGFyc2VGbG9hdCBAZWxzLnNjcm9sbEluZGljYXRvclVwLnN0eWxlU2FmZSgnaGVpZ2h0Jyx0cnVlKVxuXHRcdGRvd25QYWRkaW5nID0gaWYgQGVscy5zY3JvbGxJbmRpY2F0b3JEb3duLnN0YXRlKCd2aXNpYmxlJykgdGhlbiBwYXJzZUZsb2F0IEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5zdHlsZVNhZmUoJ2hlaWdodCcsdHJ1ZSlcblxuXHRcdGNob2ljZVJlY3QuYm90dG9tIDw9IGxpc3RSZWN0LmJvdHRvbS1kb3duUGFkZGluZyBhbmRcblx0XHRjaG9pY2VSZWN0LnRvcCA+PSBsaXN0UmVjdC50b3ArdXBQYWRkaW5nXG5cblxuXHRzdGFydFNjcm9sbGluZzogKGRpcmVjdGlvbiktPlxuXHRcdEBzY3JvbGxJbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwgKCk9PlxuXHRcdFx0QGVsLnJhdy5zY3JvbGxUb3AgKz0gaWYgZGlyZWN0aW9uIGlzICd1cCcgdGhlbiAtMjAgZWxzZSAyMFxuXHRcdCwgNTBcblxuXG5cdHN0b3BTY3JvbGxpbmc6ICgpLT5cblx0XHRjbGVhckludGVydmFsKEBzY3JvbGxJbnRlcnZhbElEKVxuXG5cblxuXG5cbmNsYXNzIENob2ljZVxuXHRjb25zdHJ1Y3RvcjogKEBkcm9wZG93biwgQHNldHRpbmdzLCBAbGlzdCwgQGluZGV4KS0+XG5cdFx0e0BsYWJlbCwgQHZhbHVlLCBAY29uZGl0aW9uc30gPSBAc2V0dGluZ3Ncblx0XHRAbGFiZWwgPz0gQHZhbHVlXG5cdFx0QHZhbHVlID89IEBsYWJlbFxuXHRcdEBmaWVsZCA9IEBkcm9wZG93bi5maWVsZFxuXHRcdEBlbCA9IEBkcm9wZG93bi50ZW1wbGF0ZS5jaG9pY2Uuc3Bhd24obnVsbCwge3JlbGF0ZWRJbnN0YW5jZTpAZHJvcGRvd259KS5hcHBlbmRUbyhAbGlzdC5lbClcblx0XHRAZWwuY2hpbGRyZW5bMV0udGV4dCA9IEBsYWJlbFxuXHRcdEB2aXNpYmxlID0gdHJ1ZVxuXHRcdEBzZWxlY3RlZCA9IGZhbHNlXG5cdFx0QHVuYXZhaWxhYmxlID0gZmFsc2Vcblx0XHRcblx0XHRAX2F0dGFjaEJpbmRpbmdzKClcblxuXHRcdGlmIEBjb25kaXRpb25zPy5sZW5ndGhcblx0XHRcdEB1bmF2YWlsYWJsZSA9IHRydWVcblx0XHRcdEBhbGxGaWVsZHMgPSBAZmllbGQuYWxsRmllbGRzXG5cblx0XHRcdENvbmRpdGlvbi5pbml0IEAsIEBjb25kaXRpb25zLCAoKT0+XG5cdFx0XHRcdEB1bmF2YWlsYWJsZSA9ICFDb25kaXRpb24udmFsaWRhdGUoQGNvbmRpdGlvbnMpXG5cblxuXHRfYXR0YWNoQmluZGluZ3M6ICgpLT4gZG8gKCk9PlxuXHRcdFNpbXBseUJpbmQoJ3Zpc2libGUnKS5vZihAKS50byAodmlzaWJsZSxwcmV2KT0+XG5cdFx0XHRAZHJvcGRvd24udmlzaWJsZUNob2ljZXNDb3VudCArPSBpZiB2aXNpYmxlIHRoZW4gMSBlbHNlIC0xXG5cdFx0XHRAZWwuc3RhdGUgJ3Zpc2libGUnLCB2aXNpYmxlXG5cdFx0XHRpZiB2aXNpYmxlXG5cdFx0XHRcdEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlcy5wdXNoKEApXG5cdFx0XHRcdGlmIElTLmRlZmluZWQocHJldikgIyBpbmRpY2F0ZXMgc3RhdGUgaGFzIGNoYW5nZWRcblx0XHRcdFx0XHRAZHJvcGRvd24udmlzaWJsZUNob2ljZXMuc29ydCAoYSxiKS0+IGEuaW5kZXggLSBiLmluZGV4XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAZHJvcGRvd24udmlzaWJsZUNob2ljZXMsIEApXG5cblx0XHRTaW1wbHlCaW5kKCdzZWxlY3RlZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQClcblx0XHRcdC50byAoc2VsZWN0ZWQpPT4gQGVsLnN0YXRlICdzZWxlY3RlZCcsIHNlbGVjdGVkXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgndW5hdmFpbGFibGUnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEApXG5cdFx0XHQudG8gKHVuYXZhaWxhYmxlKT0+IEBlbC5zdGF0ZSAndW5hdmFpbGFibGUnLCB1bmF2YWlsYWJsZVx0XHRcdFxuXHRcdFx0LmFuZC50byAodW5hdmFpbGFibGUpPT4gQHRvZ2dsZShvZmYsIHRydWUpIGlmIHVuYXZhaWxhYmxlXG5cblx0XHRTaW1wbHlCaW5kKCdldmVudDpjbGljaycpLm9mKEBlbClcblx0XHRcdC50byAoKT0+IEBkcm9wZG93bi5sYXN0U2VsZWN0ZWQgPSBAXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6bW91c2Vkb3duJykub2YoQGVsKVxuXHRcdFx0LnRvIChldmVudCk9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50Om1vdXNlZW50ZXInKS5vZihAZWwpXG5cdFx0XHQudG8gKCk9PiBAZHJvcGRvd24uY3VycmVudEhpZ2hsaWdodGVkID0gQFxuXG5cblx0dG9nZ2xlOiAobmV3VmFsdWUsIHVuYXZhaWxhYmxlKS0+XG5cdFx0cHJldlN0YXRlID0gQHNlbGVjdGVkXG5cdFx0bmV3U3RhdGUgPSBpZiBJUy5kZWZpbmVkKG5ld1ZhbHVlKSB0aGVuIG5ld1ZhbHVlIGVsc2UgIUBzZWxlY3RlZFxuXG5cdFx0aWYgbm90IG5ld1N0YXRlXG5cdFx0XHRpZiBAZHJvcGRvd24uc2V0dGluZ3MubXVsdGlwbGUgYW5kIHByZXZTdGF0ZVxuXHRcdFx0XHRAc2VsZWN0ZWQgPSBuZXdTdGF0ZVxuXHRcdFx0XHRoZWxwZXJzLnJlbW92ZUl0ZW0oQGZpZWxkLl92YWx1ZSwgQClcblx0XHRcdFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAc2VsZWN0ZWQgPSBuZXdTdGF0ZSBpZiBJUy5kZWZpbmVkKG5ld1ZhbHVlKVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlID0gbnVsbCBpZiB1bmF2YWlsYWJsZVxuXG5cdFx0ZWxzZVxuXHRcdFx0QHNlbGVjdGVkID0gbmV3U3RhdGVcblx0XHRcdGlmIEBmaWVsZC5zZXR0aW5ncy5tdWx0aXBsZVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlLnB1c2goQClcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGZpZWxkLl92YWx1ZT8udG9nZ2xlKG9mZilcblx0XHRcdFx0QGZpZWxkLl92YWx1ZSA9IEBcblxuXHRcdFx0QGZpZWxkLmxhc3RTZWxlY3RlZCA9IEBcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93blxubW9kdWxlLmV4cG9ydHMuQ2hvaWNlID0gQ2hvaWNlIiwiU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5tYXNrQ29yZSA9IGltcG9ydCAndGV4dC1tYXNrLWNvcmUnXG5tYXNrQWRkb25zID0gaW1wb3J0ICd0ZXh0LW1hc2stYWRkb25zJ1xuZXh0ZW5kID0gaW1wb3J0ICdzbWFydC1leHRlbmQnXG5JUyA9IGltcG9ydCAnLi4vY2hlY2tzJ1xuUkVHRVggPSBpbXBvcnQgJy4uL2NvbnN0YW50cy9yZWdleCdcbmhlbHBlcnMgPSBpbXBvcnQgJy4uL2hlbHBlcnMnXG5kZWZhdWx0UGF0dGVybkNoYXJzID0gXG5cdCcxJzogUkVHRVgubnVtZXJpY1xuXHQnIyc6IFJFR0VYLndpZGVudW1lcmljXG5cdCdhJzogUkVHRVgubGV0dGVyXG5cdCcqJzogUkVHRVguYW55XG5cblxuY2xhc3MgTWFza1xuXHRjb25zdHJ1Y3RvcjogKEBmaWVsZCwgQGNvbmZpZyktPlxuXHRcdEB2YWx1ZSA9ICcnXG5cdFx0QHByZXZWYWx1ZSA9ICcnXG5cdFx0QGN1cnNvciA9IDBcblx0XHRAcHJldkN1cnNvciA9IDBcblx0XHRAcGF0dGVybiA9IEBwYXR0ZXJuUmF3ID0gQGNvbmZpZy5wYXR0ZXJuXG5cdFx0QHBhdHRlcm5TZXR0ZXIgPSBAY29uZmlnLnNldHRlclxuXHRcdEBwbGFjZWhvbGRlckNoYXIgPSBAY29uZmlnLnBsYWNlaG9sZGVyXG5cdFx0QHBsYWNlaG9sZGVyUmVnZXggPSBuZXcgUmVnRXhwKCdcXFxcJysoQHBsYWNlaG9sZGVyQ2hhciBvciAnXycpLCdnJylcblx0XHRAZ3VpZGUgPSBAY29uZmlnLmd1aWRlXG5cdFx0QGtlZXBDaGFyUG9zaXRpb25zID0gQGNvbmZpZy5rZWVwQ2hhclBvc2l0aW9uc1xuXHRcdEBjaGFycyA9IGV4dGVuZC5jbG9uZSBkZWZhdWx0UGF0dGVybkNoYXJzLCBAY29uZmlnLmN1c3RvbVBhdHRlcm5zXG5cblx0XHRAc2V0UGF0dGVybihAcGF0dGVybilcblxuXG5cdGdldFN0YXRlOiAocGF0dGVybiwgcmF3VmFsdWUpLT4ge1xuXHRcdHJhd1ZhbHVlLCBAZ3VpZGUsIEBwbGFjZWhvbGRlckNoYXIsIEBrZWVwQ2hhclBvc2l0aW9ucyxcblx0XHRjdXJyZW50Q2FyZXRQb3NpdGlvbjogaWYgQGZpZWxkLmVsIHRoZW4gQGZpZWxkLnNlbGVjdGlvbigpLmVuZCBlbHNlIEBjdXJzb3Jcblx0XHRwcmV2aW91c0NvbmZvcm1lZFZhbHVlOiBAcHJldlZhbHVlXG5cdFx0cGxhY2Vob2xkZXI6IEBnZXRQbGFjZWhvbGRlcihwYXR0ZXJuKVxuXHR9XG5cblx0Z2V0UGxhY2Vob2xkZXI6IChwYXR0ZXJuKS0+XG5cdFx0aWYgSVMuZnVuY3Rpb24ocGF0dGVybilcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdHBsYWNlaG9sZGVyID0gJydcblx0XHRcdGZvciBjaGFyIGluIHBhdHRlcm5cblx0XHRcdFx0aWYgSVMucmVnZXgoY2hhcilcblx0XHRcdFx0XHRwbGFjZWhvbGRlciArPSBAcGxhY2Vob2xkZXJDaGFyXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRwbGFjZWhvbGRlciArPSBjaGFyXG5cblx0XHRcdHJldHVybiBwbGFjZWhvbGRlclxuXG5cblx0cmVzb2x2ZVBhdHRlcm46IChwYXR0ZXJuLCBpbnB1dCwgc3RhdGUpLT5cblx0XHRwYXR0ZXJuID0gXG5cdFx0XHRpZiB0eXBlb2YgcGF0dGVybiBpcyAnZnVuY3Rpb24nXG5cdFx0XHRcdHBhdHRlcm4oaW5wdXQsIEBnZXRTdGF0ZShwYXR0ZXJuLCBpbnB1dCkpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBhdHRlcm5cblxuXHRcdG9mZnNldCA9IDBcblx0XHR0cmFwSW5kZXhlcyA9IFtdXG5cdFx0Y29weSA9IHBhdHRlcm4uc2xpY2UoKVxuXHRcdGZvciBjaGFyLGkgaW4gY29weSB3aGVuIGNoYXIgaXMgJ1tdJ1xuXHRcdFx0dHJhcEluZGV4ZXMucHVzaChpLW9mZnNldClcblx0XHRcdHBhdHRlcm4uc3BsaWNlKGktb2Zmc2V0LDEpXG5cdFx0XHRvZmZzZXQrK1xuXG5cdFx0QHByZXZQYXR0ZXJuID0gQHJlc29sdmVkUGF0dGVyblxuXHRcdEByZXNvbHZlZFBhdHRlcm4gPSBwYXR0ZXJuXG5cdFx0cmV0dXJuIHtwYXR0ZXJuLCBjYXJldFRyYXBJbmRleGVzOnRyYXBJbmRleGVzfVxuXG5cblx0c2V0UGF0dGVybjogKHN0cmluZywgdXBkYXRlVmFsdWU9dHJ1ZSwgdXBkYXRlRmllbGQpLT5cblx0XHRAcGF0dGVyblJhdyA9IHN0cmluZ1xuXHRcdEBwYXR0ZXJuID0gQHBhcnNlUGF0dGVybihzdHJpbmcpXG5cdFx0QHRyYW5zZm9ybSA9IEBwYXJzZVRyYW5zZm9ybShzdHJpbmcpXG5cblx0XHRpZiB1cGRhdGVWYWx1ZVxuXHRcdFx0QHZhbHVlID0gQHNldFZhbHVlKEB2YWx1ZSlcblx0XHRcdEBmaWVsZC52YWx1ZSA9IEB2YWx1ZSBpZiB1cGRhdGVGaWVsZFxuXG5cblx0cGFyc2VQYXR0ZXJuOiAoc3RyaW5nKS0+IHN3aXRjaFxuXHRcdHdoZW4gc3RyaW5nIGlzICdFTUFJTCdcblx0XHRcdG1hc2tBZGRvbnMuZW1haWxNYXNrLm1hc2tcblxuXHRcdHdoZW4gc3RyaW5nIGlzICdQSE9ORSdcblx0XHRcdEBwYXR0ZXJuU2V0dGVyID0gKHZhbHVlKS0+IGhlbHBlcnMucmVwZWF0KCcjJywgTWF0aC5tYXggNyx2YWx1ZS5sZW5ndGgpXG5cdFx0XHRAZ3VpZGUgPSBmYWxzZVxuXHRcdFx0cmV0dXJuICcjJ1xuXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ05BTUUnXG5cdFx0XHRAcGF0dGVyblNldHRlciA9ICh2YWx1ZSktPlxuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoQHBsYWNlaG9sZGVyUmVnZXgsICcnKS50cmltKClcblx0XHRcdFx0aGVscGVycy5yZXBlYXQoJ2EnLCBNYXRoLm1heCAyLHZhbHVlLmxlbmd0aClcblxuXHRcdFx0cmV0dXJuICdhJ1xuXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ0ZVTExOQU1FJ1xuXHRcdFx0QHBhdHRlcm5TZXR0ZXIgPSAodmFsdWUpLT5cblx0XHRcdFx0aWYgdmFsdWVbdmFsdWUubGVuZ3RoLTFdIGlzICcgJyB0aGVuIHZhbHVlICs9ICd4J1xuXHRcdFx0XHRzcGxpdCA9IHZhbHVlLnJlcGxhY2UoQHBsYWNlaG9sZGVyUmVnZXgsJycpLnRyaW0oKS5zcGxpdCgvXFxzKy8pXG5cdFx0XHRcdHJldHVybiBpZiBzcGxpdC5sZW5ndGggaXMgNFxuXHRcdFx0XHRzcGxpdC5tYXAoKHBhcnQpLT4gaGVscGVycy5yZXBlYXQoJ2EnLCBNYXRoLm1heCAyLHBhcnQubGVuZ3RoKSkuam9pbignICcpXG5cdFx0XHRyZXR1cm4gJ2EnXG5cblx0XHR3aGVuIHN0cmluZyBpcyAnREFURSdcblx0XHRcdFsvXFxkLywgL1xcZC8sICcvJywgL1xcZC8sIC9cXGQvLCAnLycsIC9cXGQvLCAvXFxkLywgL1xcZC8sIC9cXGQvXVxuXHRcdFxuXHRcdHdoZW4gc3RyaW5nWzBdIGlzICdEQVRFJyBhbmQgSVMuc3RyaW5nKHN0cmluZ1sxXSlcblx0XHRcdHN0cmluZ1sxXS5zcGxpdCgnJykubWFwKChjaGFyKT0+IGlmIFJFR0VYLmxldHRlci50ZXN0KGNoYXIpIHRoZW4gL1xcZC8gZWxzZSBjaGFyKVxuXHRcdFxuXHRcdHdoZW4gc3RyaW5nIGlzICdOVU1CRVInXG5cdFx0XHRtYXNrQWRkb25zLmNyZWF0ZU51bWJlck1hc2tcblx0XHRcdFx0cHJlZml4OiBAY29uZmlnLnByZWZpeCBvciAnJ1xuXHRcdFx0XHRzdWZmaXg6IEBjb25maWcuc3VmZml4IG9yICcnXG5cdFx0XHRcdGluY2x1ZGVUaG91c2FuZHNTZXBhcmF0b3I6IGlmIEBjb25maWcuc2VwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cdFx0XHRcdHRob3VzYW5kc1NlcGFyYXRvclN5bWJvbDogaWYgSVMuc3RyaW5nKEBjb25maWcuc2VwKSB0aGVuIEBjb25maWcuc2VwXG5cdFx0XHRcdGFsbG93RGVjaW1hbDogQGNvbmZpZy5kZWNpbWFsXG5cdFx0XHRcdGRlY2ltYWxMaW1pdDogaWYgSVMubnVtYmVyKEBjb25maWcuZGVjaW1hbCkgdGhlbiBAY29uZmlnLmRlY2ltYWxcblx0XHRcdFx0aW50ZWdlckxpbWl0OiBpZiBJUy5udW1iZXIoQGNvbmZpZy5saW1pdCkgdGhlbiBAY29uZmlnLmxpbWl0XG5cblx0XHR3aGVuIElTLmFycmF5KHN0cmluZylcblx0XHRcdHJldHVybiBzdHJpbmdcblxuXHRcdGVsc2Vcblx0XHRcdHBhdHRlcm4gPSBbXVxuXG5cdFx0XHRmb3IgY2hhcixpIGluIHN0cmluZ1xuXHRcdFx0XHRpZiBjaGFyIGlzICdcXFxcJ1xuXHRcdFx0XHRcdGVzY2FwZWQgPSB0cnVlXG5cdFx0XHRcdFx0Y29udGludWVcblx0XHRcdFx0XG5cdFx0XHRcdHBhdHRlcm4ucHVzaCBpZiBlc2NhcGVkIHRoZW4gY2hhciBlbHNlIChAY2hhcnNbY2hhcl0gb3IgY2hhcilcblx0XHRcdFx0ZXNjYXBlZCA9IGZhbHNlXG5cblx0XHRcdHJldHVybiBwYXR0ZXJuXG5cblxuXHRwYXJzZVRyYW5zZm9ybTogKHN0cmluZyktPiBzd2l0Y2hcblx0XHR3aGVuIHN0cmluZyBpcyAnRU1BSUwnXG5cdFx0XHRtYXNrQWRkb25zLmVtYWlsTWFzay5waXBlXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmcgaXMgJ0RBVEUnXG5cdFx0XHRtYXNrQWRkb25zLmNyZWF0ZUF1dG9Db3JyZWN0ZWREYXRlUGlwZSgnbW0vZGQveXl5eScpXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmdbMF0gaXMgJ0RBVEUnIGFuZCBJUy5zdHJpbmcoc3RyaW5nWzFdKVxuXHRcdFx0bWFza0FkZG9ucy5jcmVhdGVBdXRvQ29ycmVjdGVkRGF0ZVBpcGUoc3RyaW5nWzFdKVxuXG5cdFx0d2hlbiBAY29uZmlnLnRyYW5zZm9ybVxuXHRcdFx0QGNvbmZpZy50cmFuc2Zvcm1cblxuXG5cblx0c2V0VmFsdWU6IChpbnB1dCktPlxuXHRcdGlmIEBwYXR0ZXJuU2V0dGVyXG5cdFx0XHRuZXdQYXR0ZXJuID0gQHBhdHRlcm5TZXR0ZXIoaW5wdXQpIG9yIEBwYXR0ZXJuXG5cdFx0XHRAc2V0UGF0dGVybihuZXdQYXR0ZXJuLCBmYWxzZSkgaWYgbmV3UGF0dGVybiBpc250IEBwYXR0ZXJuUmF3IGFuZCBuZXdQYXR0ZXJuIGlzbnQgQHBhdHRlcm5cblx0XHRcblx0XHR7Y2FyZXRUcmFwSW5kZXhlcywgcGF0dGVybn0gPSBAcmVzb2x2ZVBhdHRlcm4oQHBhdHRlcm4sIGlucHV0KVxuXHRcdHJldHVybiBAdmFsdWUgaWYgcGF0dGVybiBpcyBmYWxzZVxuXG5cdFx0QHByZXZWYWx1ZSA9IEB2YWx1ZVxuXHRcdEBwcmV2Q3Vyc29yID0gQGN1cnNvclxuXHRcdHN0YXRlID0gQGdldFN0YXRlKHBhdHRlcm4sIGlucHV0KVxuXHRcdHtjb25mb3JtZWRWYWx1ZX0gPSBtYXNrQ29yZS5jb25mb3JtVG9NYXNrKGlucHV0LCBwYXR0ZXJuLCBzdGF0ZSlcblxuXHRcdHRyYW5zZm9ybWVkID0gQHRyYW5zZm9ybShjb25mb3JtZWRWYWx1ZSwgc3RhdGUpIGlmIEB0cmFuc2Zvcm1cblx0XHRpZiB0cmFuc2Zvcm1lZCBpcyBmYWxzZVxuXHRcdFx0cmV0dXJuIEB2YWx1ZVxuXHRcdGlmIElTLnN0cmluZyh0cmFuc2Zvcm1lZClcblx0XHRcdGNvbmZvcm1lZFZhbHVlID0gdHJhbnNmb3JtZWRcblx0XHRlbHNlIGlmIElTLm9iamVjdCh0cmFuc2Zvcm1lZClcblx0XHRcdGluZGV4ZXNPZlBpcGVkQ2hhcnMgPSB0cmFuc2Zvcm1lZC5pbmRleGVzT2ZQaXBlZENoYXJzXG5cdFx0XHRjb25mb3JtZWRWYWx1ZSA9IHRyYW5zZm9ybWVkLnZhbHVlXG5cblxuXHRcdEBjdXJzb3IgPSBtYXNrQ29yZS5hZGp1c3RDYXJldFBvc2l0aW9uIGV4dGVuZCBzdGF0ZSwge1xuXHRcdFx0aW5kZXhlc09mUGlwZWRDaGFycywgY2FyZXRUcmFwSW5kZXhlcywgY29uZm9ybWVkVmFsdWVcblx0XHR9XG5cblx0XHRyZXR1cm4gQHZhbHVlID0gY29uZm9ybWVkVmFsdWVcblxuXG5cdHZhbGlkYXRlOiAoaW5wdXQpLT5cblx0XHRpZiBpbnB1dCBpc250IEB2YWx1ZSBhbmQgQHBhdHRlcm5TZXR0ZXJcblx0XHRcdHBhdHRlcm4gPSBAcGF0dGVyblNldHRlcihpbnB1dCkgb3IgQHBhdHRlcm5cblx0XHRlbHNlXG5cdFx0XHRwYXR0ZXJuID0gQHJlc29sdmVkUGF0dGVyblxuXHRcdFx0e3BhdHRlcm59ID0gQHJlc29sdmVQYXR0ZXJuKEBwYXR0ZXJuLCBpbnB1dCkgaWYgbm90IHBhdHRlcm5cblxuXHRcdHJldHVybiB0cnVlIGlmIHBhdHRlcm4gaXMgZmFsc2Vcblx0XHRcblx0XHRmb3IgY2hhcixpIGluIHBhdHRlcm5cblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIG5vdCBpbnB1dFtpXVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdFx0XHR3aGVuIElTLnJlZ2V4KGNoYXIpIGFuZCBub3QgY2hhci50ZXN0KGlucHV0W2ldKVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdFx0XHR3aGVuIElTLnN0cmluZyhjaGFyKSBhbmQgaW5wdXRbaV0gaXNudCBjaGFyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRyZXR1cm4gdHJ1ZVxuXG5cdGlzRW1wdHk6ICgpLT5cblx0XHRpbnB1dCA9IEB2YWx1ZVxuXHRcdHBhdHRlcm4gPSBAcmVzb2x2ZWRQYXR0ZXJuXG5cdFx0aWYgbm90IHBhdHRlcm5cblx0XHRcdHBhdHRlcm4gPSBAcGF0dGVyblNldHRlcihpbnB1dCkgaWYgQHBhdHRlcm5TZXR0ZXJcblx0XHRcdHtwYXR0ZXJufSA9IEByZXNvbHZlUGF0dGVybihwYXR0ZXJuIG9yIEBwYXR0ZXJuLCBpbnB1dClcblx0XHRcblx0XHRyZXR1cm4gdHJ1ZSBpZiBpbnB1dCBpcyBAY29uZmlnLnByZWZpeCBvciBpbnB1dCBpcyBAY29uZmlnLnN1ZmZpeFxuXG5cdFx0Zm9yIGNoYXIsaSBpbiBwYXR0ZXJuXG5cdFx0XHRzd2l0Y2hcblx0XHRcdFx0d2hlbiBub3QgaW5wdXRbaV1cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0XHR3aGVuIElTLnJlZ2V4KGNoYXIpXG5cdFx0XHRcdFx0cmV0dXJuICFjaGFyLnRlc3QoaW5wdXRbaV0pXG5cdFx0cmV0dXJuIGZhbHNlXG5cblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFzayIsInZhciBrZXlDb2RlcztcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlDb2RlcyA9IHtcbiAgXCJkZWxldGVcIjogOCxcbiAgZW50ZXI6IDEzLFxuICBlc2M6IDI3LFxuICBjdHJsOiAxNyxcbiAgYWx0OiAxOCxcbiAgc2hpZnQ6IDE2LFxuICBcInN1cGVyXCI6IDkxLFxuICBzdXBlcjI6IDkzLFxuICB1cDogMzgsXG4gIGxlZnQ6IDM3LFxuICByaWdodDogMzksXG4gIGRvd246IDQwLFxuICBoeXBoZW46IDQ1LFxuICB1bmRlcnNjb3JlOiA5NSxcbiAgcXVlc3Rpb246IDYzLFxuICBleGNsYW1hdGlvbjogMzMsXG4gIGZyb250c2xhc2g6IDQ3LFxuICBiYWNrc2xhc2g6IDkyLFxuICBjb21tYTogNDQsXG4gIHBlcmlvZDogNDYsXG4gIHNwYWNlOiAzMixcbiAgYW55QXJyb3c6IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4gY29kZSA9PT0ga2V5Q29kZXMudXAgfHwgY29kZSA9PT0ga2V5Q29kZXMuZG93biB8fCBjb2RlID09PSBrZXlDb2Rlcy5sZWZ0IHx8IGNvZGUgPT09IGtleUNvZGVzLnJpZ2h0O1xuICB9LFxuICBhbnlNb2RpZmllcjogZnVuY3Rpb24oY29kZSkge1xuICAgIHJldHVybiBjb2RlID09PSBrZXlDb2Rlcy5jdHJsIHx8IGNvZGUgPT09IGtleUNvZGVzLmFsdCB8fCBjb2RlID09PSBrZXlDb2Rlcy5zaGlmdCB8fCBjb2RlID09PSBrZXlDb2Rlc1tcInN1cGVyXCJdIHx8IGNvZGUgPT09IGtleUNvZGVzLnN1cGVyMjtcbiAgfSxcbiAgYW55QWxwaGE6IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4gKDk3IDw9IGNvZGUgJiYgY29kZSA8PSAxMjIpIHx8ICg2NSA8PSBjb2RlICYmIGNvZGUgPD0gOTApO1xuICB9LFxuICBhbnlOdW1lcmljOiBmdW5jdGlvbihjb2RlKSB7XG4gICAgcmV0dXJuICg0OCA8PSBjb2RlICYmIGNvZGUgPD0gNTcpO1xuICB9LFxuICBhbnlBbHBoYU51bWVyaWM6IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4ga2V5Q29kZXMuYW55QWxwaGEoY29kZSkgfHwga2V5Q29kZXMuYW55TnVtZXJpYyhjb2RlKTtcbiAgfSxcbiAgYW55UHJpbnRhYmxlOiBmdW5jdGlvbihjb2RlKSB7XG4gICAgcmV0dXJuIGtleUNvZGVzLmFueUFscGhhKGNvZGUpIHx8IGtleUNvZGVzLmFueU51bWVyaWMoY29kZSkgfHwgY29kZSA9PT0ga2V5Q29kZXMuaHlwaGVuIHx8IGNvZGUgPT09IGtleUNvZGVzLnVuZGVyc2NvcmUgfHwgY29kZSA9PT0ga2V5Q29kZXMucXVlc3Rpb24gfHwgY29kZSA9PT0ga2V5Q29kZXMuZXhjbGFtYXRpb24gfHwgY29kZSA9PT0ga2V5Q29kZXMuZnJvbnRzbGFzaCB8fCBjb2RlID09PSBrZXlDb2Rlcy5iYWNrc2xhc2ggfHwgY29kZSA9PT0ga2V5Q29kZXMuY29tbWEgfHwgY29kZSA9PT0ga2V5Q29kZXMucGVyaW9kIHx8IGNvZGUgPT09IGtleUNvZGVzLnNwYWNlO1xuICB9XG59O1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKamIyNXpkR0Z1ZEhNdmEyVjVRMjlrWlhNdVkyOW1abVZsSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuaGVscGVycyA9IGltcG9ydCAnLi4vLi4vaGVscGVycydcbkNPTE9SUyA9IGltcG9ydCAnLi4vLi4vY29uc3RhbnRzL2NvbG9ycydcbkNIRUNLTUFSS19XSURUSCA9IDI2XG5cbmV4cG9ydCBkZWZhdWx0IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnZmllbGQnXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0dmVydGljYWxBbGlnbjogJ3RvcCdcblx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCdcblx0XHRcdGZvbnRGYW1pbHk6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5mb250RmFtaWx5XG5cdFx0XHR0ZXh0QWxpZ246ICdsZWZ0J1xuXHRcdFx0JHZpc2libGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRhbmltYXRpb246ICcwLjJzIGZpZWxkRXJyb3JTaGFrZSdcblxuXHRcdFsnZGl2J1xuXHRcdFx0cmVmOiAnbGFiZWwnXG5cdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0ekluZGV4OiAxXG5cdFx0XHRcdHRvcDogKGZpZWxkKS0+IEBzdHlsZVBhcnNlZCgnZm9udFNpemUnLCB0cnVlKSAqIDAuN1xuXHRcdFx0XHRsZWZ0OiAoZmllbGQpLT4gaGVscGVycy5zaG9ydGhhbmRTaWRlVmFsdWUoZmllbGQuc2V0dGluZ3MucGFkZGluZywgJ2xlZnQnKSArIChmaWVsZC5lbC5jaGlsZC5pY29uPy53aWR0aCBvciAwKVxuXHRcdFx0XHRwYWRkaW5nOiAoZmllbGQpLT4gXCIwICN7ZmllbGQuc2V0dGluZ3MuaW5wdXRQYWRkaW5nfXB4XCJcblx0XHRcdFx0Zm9udEZhbWlseTogJ2luaGVyaXQnXG5cdFx0XHRcdGZvbnRTaXplOiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MubGFiZWxTaXplIG9yIGZpZWxkLnNldHRpbmdzLmZvbnRTaXplICogKDExLzE0KVxuXHRcdFx0XHRmb250V2VpZ2h0OiA2MDBcblx0XHRcdFx0bGluZUhlaWdodDogMVxuXHRcdFx0XHRjb2xvcjogQ09MT1JTLmdyZXlcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnb3BhY2l0eSAwLjJzLCBjb2xvciAwLjJzJ1xuXHRcdFx0XHR3aGl0ZVNwYWNlOiAnbm93cmFwJ1xuXHRcdFx0XHR1c2VyU2VsZWN0OiAnbm9uZSdcblx0XHRcdFx0Y3Vyc29yOiAnZGVmYXVsdCdcblx0XHRcdFx0cG9pbnRlckV2ZW50czogJ25vbmUnXG5cdFx0XHRcdCRmaWxsZWQ6ICRzaG93TGFiZWw6XG5cdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHQkZm9jdXM6XG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5vcmFuZ2Vcblx0XHRcdFx0JHNob3dFcnJvcjpcblx0XHRcdFx0XHRjb2xvcjogQ09MT1JTLnJlZFxuXHRcdF1cblxuXHRcdFsnZGl2J1xuXHRcdFx0cmVmOiAnaW5uZXJ3cmFwJ1xuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHRcdGhlaWdodDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmhlaWdodFxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZSdcblx0XHRcdFx0Ym9yZGVyV2lkdGg6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5ib3JkZXJcblx0XHRcdFx0Ym9yZGVyU3R5bGU6ICdzb2xpZCdcblx0XHRcdFx0Ym9yZGVyQ29sb3I6IENPTE9SUy5ncmV5X2xpZ2h0XG5cdFx0XHRcdGJvcmRlclJhZGl1czogJzJweCdcblx0XHRcdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCdcblx0XHRcdFx0Zm9udEZhbWlseTogJ2luaGVyaXQnXG5cdFx0XHRcdHRyYW5zaXRpb246ICdib3JkZXItY29sb3IgMC4ycydcblx0XHRcdFx0JGZvY3VzOlxuXHRcdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMub3JhbmdlXG5cdFx0XHRcdCRzaG93RXJyb3I6XG5cdFx0XHRcdFx0Ym9yZGVyQ29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0JGRpc2FibGVkOlxuXHRcdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMuZ3JleV9saWdodFxuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQ09MT1JTLmdyZXlfbGlnaHRcblxuXHRcdFx0WydpbnB1dCdcblx0XHRcdFx0cmVmOiAnaW5wdXQnXG5cdFx0XHRcdHR5cGU6ICd0ZXh0J1xuXHRcdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHRcdFx0ekluZGV4OiAzXG5cdFx0XHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblx0XHRcdFx0XHR2ZXJ0aWNhbEFsaWduOiAndG9wJ1xuXHRcdFx0XHRcdGhlaWdodDogKCktPiBAcGFyZW50LnN0eWxlU2FmZSgnaGVpZ2h0JywxKSBvciBAcGFyZW50LnN0eWxlU2FmZSgnaGVpZ2h0Jylcblx0XHRcdFx0XHR3aWR0aDogKGZpZWxkKS0+IGlmIG5vdCBmaWVsZC5zZXR0aW5ncy5hdXRvV2lkdGhcblx0XHRcdFx0XHRcdHN1YnRyYWN0ID0gMFxuXHRcdFx0XHRcdFx0aWYgaWNvblNpYmxpbmcgPSBmaWVsZC5lbC5jaGlsZC5pY29uXG5cdFx0XHRcdFx0XHRcdHN1YnRyYWN0ICs9IGljb25TaWJsaW5nLndpZHRoXG5cdFx0XHRcdFx0XHRpZiBpbnB1dFNpYmxpbmcgPSBmaWVsZC5lbC5jaGlsZFtmaWVsZC5zZXR0aW5ncy5pbnB1dFNpYmxpbmddXG5cdFx0XHRcdFx0XHRcdHdpZHRoID0gaW5wdXRTaWJsaW5nLnN0eWxlUGFyc2VkKCd3aWR0aCcsMSkgb3IgMFxuXHRcdFx0XHRcdFx0XHRwYWRkaW5nID0gaW5wdXRTaWJsaW5nLnN0eWxlUGFyc2VkKCdwYWRkaW5nJywxKSBvciAwXG5cdFx0XHRcdFx0XHRcdHBhZGRpbmdMZWZ0ID0gaW5wdXRTaWJsaW5nLnN0eWxlUGFyc2VkKCdwYWRkaW5nTGVmdCcsMSkgb3IgcGFkZGluZyBvciAwXG5cdFx0XHRcdFx0XHRcdHBhZGRpbmdSaWdodCA9IGlucHV0U2libGluZy5zdHlsZVBhcnNlZCgncGFkZGluZ1JpZ2h0JywxKSBvciBwYWRkaW5nIG9yIDBcblx0XHRcdFx0XHRcdFx0c3VidHJhY3QgKz0gd2lkdGgrcGFkZGluZ0xlZnQrcGFkZGluZ1JpZ2h0XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJjYWxjKDEwMCUgLSAje3N1YnRyYWN0fXB4KVwiXG5cblx0XHRcdFx0XHRwYWRkaW5nOiAoZmllbGQpLT5cblx0XHRcdFx0XHRcdEBwYWRkaW5nID89IE1hdGgubWF4IDAsIGhlbHBlcnMuY2FsY1BhZGRpbmcoZmllbGQuc2V0dGluZ3MuaGVpZ2h0LCAxNCktM1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiI3tAcGFkZGluZ31weCAje2ZpZWxkLnNldHRpbmdzLmlucHV0UGFkZGluZ31weFwiXG5cdFx0XHRcdFxuXHRcdFx0XHRcdG1hcmdpbjogJzAnXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXG5cdFx0XHRcdFx0YXBwZWFyYW5jZTogJ25vbmUnXG5cdFx0XHRcdFx0Ym9yZGVyOiAnbm9uZSdcblx0XHRcdFx0XHRvdXRsaW5lOiAnbm9uZSdcblx0XHRcdFx0XHRmb250RmFtaWx5OiAnaW5oZXJpdCdcblx0XHRcdFx0XHRmb250U2l6ZTogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmZvbnRTaXplXG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5ibGFja1xuXHRcdFx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRcdFx0Ym94U2hhZG93OiAnbm9uZSdcblx0XHRcdFx0XHR3aGl0ZVNwYWNlOiAnbm93cmFwJ1xuXHRcdFx0XHRcdGJhY2tncm91bmRDbGlwOiAnY29udGVudC1ib3gnICMgc2VtaS1maXggZm9yIHllbGxvdyBhdXRvZmlsbCBiYWNrZ3JvdW5kXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSdcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDAuMnMsIC13ZWJraXQtdHJhbnNmb3JtIDAuMnMnXG5cdFx0XHRcdFx0JGRpc2FibGVkOlxuXHRcdFx0XHRcdFx0Y3Vyc29yOiAnbm90LWFsbG93ZWQnXG5cdFx0XHRcdFx0JGZpbGxlZDogJHNob3dMYWJlbDpcblx0XHRcdFx0XHRcdHRyYW5zZm9ybTogKGZpZWxkKS0+XG5cdFx0XHRcdFx0XHRcdHJldHVybiBAdHJhbnNsYXRpb24gaWYgQHRyYW5zbGF0aW9uPyBvciBub3QgKGxhYmVsPWZpZWxkLmVsLmNoaWxkLmxhYmVsKSBvciBsYWJlbC5zdHlsZVNhZmUoJ3Bvc2l0aW9uJywxKSBpc250ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHRcdFx0dG90YWxIZWlnaHQgPSBAcGFyZW50LnN0eWxlUGFyc2VkKCdoZWlnaHQnLDEpXG5cdFx0XHRcdFx0XHRcdHdvcmthYmxlSGVpZ2h0ID0gdG90YWxIZWlnaHQgLSAobGFiZWwuc3R5bGVQYXJzZWQoJ2ZvbnRTaXplJywxKSArIGxhYmVsLnN0eWxlUGFyc2VkKCd0b3AnLDEpKjIpXG5cdFx0XHRcdFx0XHRcdHRyYW5zbGF0aW9uID0gTWF0aC5tYXggMCwgTWF0aC5mbG9vciAodG90YWxIZWlnaHQtd29ya2FibGVIZWlnaHQpLzRcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFwidHJhbnNsYXRlWSgje3RyYW5zbGF0aW9ufXB4KVwiXG5cdFx0XHRcdFx0XG5cdFx0XHRdXG5cblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdwbGFjZWhvbGRlcidcblx0XHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdHRvcDogJzBweCdcblx0XHRcdFx0XHRsZWZ0OiAoZmllbGQpLT4gZmllbGQuZWwuY2hpbGQuaWNvbj8ud2lkdGggb3IgMFxuXHRcdFx0XHRcdGZvbnRGYW1pbHk6IChmaWVsZCktPiBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVNhZmUoJ2ZvbnRGYW1pbHknLDEpXG5cdFx0XHRcdFx0Zm9udFNpemU6IChmaWVsZCktPiBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVNhZmUoJ2ZvbnRTaXplJywxKVxuXHRcdFx0XHRcdHBhZGRpbmc6IChmaWVsZCktPlxuXHRcdFx0XHRcdFx0dmVydGkgPSBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVBhcnNlZCgncGFkZGluZ1RvcCcsMSkgb3IgZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdUb3AnKVxuXHRcdFx0XHRcdFx0aG9yaXogPSBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVBhcnNlZCgncGFkZGluZ0xlZnQnLDEpIG9yIGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlUGFyc2VkKCdwYWRkaW5nTGVmdCcpXG5cdFx0XHRcdFx0XHRyZXR1cm4gXCIje3ZlcnRpKzN9cHggI3tob3Jpen1weFwiXG5cblx0XHRcdFx0XHRjb2xvcjogQ09MT1JTLmJsYWNrXG5cdFx0XHRcdFx0b3BhY2l0eTogMC41XG5cdFx0XHRcdFx0cG9pbnRlckV2ZW50czogJ25vbmUnXG5cdFx0XHRcdFx0dXNlclNlbGVjdDogJ25vbmUnXG5cdFx0XHRcdFx0d2hpdGVTcGFjZTogJ25vd3JhcCdcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ1xuXHRcdFx0XHRcdHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMC4ycywgLXdlYmtpdC10cmFuc2Zvcm0gMC4ycydcblx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0dmlzaWJpbGl0eTogJ2hpZGRlbidcblx0XHRcdFx0XHRcdCRzaG93TGFiZWw6XG5cdFx0XHRcdFx0XHRcdHRyYW5zZm9ybTogKGZpZWxkKS0+IGZpZWxkLmVsLmNoaWxkLmlucHV0LnJhdy5zdHlsZS50cmFuc2Zvcm1cblx0XHRcdF1cblx0XHRdXG5cdFx0XG5cdFx0WydkaXYnXG5cdFx0XHRyZWY6ICdoZWxwJ1xuXHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdGJvdHRvbTogKCktPiAoQHN0eWxlUGFyc2VkKCdmb250U2l6ZScsMSkrMTApICogLTFcblx0XHRcdFx0bGVmdDogKGZpZWxkKS0+IGhlbHBlcnMuc2hvcnRoYW5kU2lkZVZhbHVlKGZpZWxkLnNldHRpbmdzLnBhZGRpbmcsICdsZWZ0Jylcblx0XHRcdFx0Zm9udEZhbWlseTogJ2luaGVyaXQnXG5cdFx0XHRcdGZvbnRTaXplOiAnMTFweCdcblx0XHRcdFx0Y29sb3I6IENPTE9SUy5ncmV5XG5cdFx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRcdGNvbG9yOiBDT0xPUlMucmVkXG5cdFx0XHRcdCRzaG93SGVscDpcblx0XHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XVxuXHRdXG4pXG5cbmV4cG9ydCBpY29uID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdpY29uJ1xuXHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHR6SW5kZXg6IDJcblx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0d2lkdGg6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZVxuXHRcdFx0aGVpZ2h0OiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuaWNvblNpemVcblx0XHRcdGZvbnRTaXplOiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuaWNvblNpemVcblx0XHRcdHBhZGRpbmdMZWZ0OiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuaW5wdXRQYWRkaW5nXG5cdFx0XHRwYWRkaW5nVG9wOiAoZmllbGQpLT4gQHBhcmVudC5zdHlsZVBhcnNlZCgnaGVpZ2h0JywxKS8yIC0gZmllbGQuc2V0dGluZ3MuaWNvblNpemUvMlxuXHRcdFx0bGluZUhlaWdodDogJzFlbSdcblx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXG5cdFx0bWV0aG9kczpcblx0XHRcdHdpZHRoOiBnZXQ6ICgpLT5cblx0XHRcdFx0aWYgQF9pbnNlcnRlZFxuXHRcdFx0XHRcdEByYXcub2Zmc2V0V2lkdGhcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBzdHlsZVBhcnNlZCgnd2lkdGgnLDEpIG9yIEByZWxhdGVkLnNldHRpbmdzLmljb25TaXplXG5cdFx0XHRcdCMgQHN0eWxlUGFyc2VkKCd3aWR0aCcsMSkgb3IgQHJhdy5vZmZzZXRXaWR0aCBvciBAcmVsYXRlZC5zZXR0aW5ncy5pY29uU2l6ZSBvciAwXG5cdF1cbilcblxuXG5leHBvcnQgY2hlY2ttYXJrID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdjaGVja21hcmsnXG5cdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdHpJbmRleDogNFxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHR3aWR0aDogMjZcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRwYWRkaW5nVG9wOiAoKS0+IEBwYXJlbnQuc3R5bGVQYXJzZWQoJ2hlaWdodCcsMSkvMiAtIDEzXG5cdFx0XHRwYWRkaW5nUmlnaHQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pbnB1dFBhZGRpbmdcblx0XHRcdHZlcnRpY2FsQWxpZ246ICd0b3AnXG5cdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuXG5cdFx0WydkaXYnXG5cdFx0XHRyZWY6ICdjaGVja21hcmtfaW5uZXJ3cmFwJ1xuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHdpZHRoOiAnMjBweCdcblx0XHRcdFx0aGVpZ2h0OiAnMjBweCdcblx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnNTAlJ1xuXHRcdFx0XHRib3JkZXJXaWR0aDogJzNweCdcblx0XHRcdFx0Ym9yZGVyU3R5bGU6ICdzb2xpZCdcblx0XHRcdFx0Ym9yZGVyQ29sb3I6IENPTE9SUy5ncmVlblxuXHRcdFx0XHR0cmFuc2Zvcm06ICdzY2FsZSgwLjgpJ1xuXHRcdFx0XHQjIHRyYW5zZm9ybU9yaWdpbjogJzEwMCUgMCdcblx0XHRcdFx0JHNob3dFcnJvcjpcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLnJlZFxuXG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX21hc2sxJ1xuXHRcdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0dG9wOiAnLTRweCdcblx0XHRcdFx0XHRsZWZ0OiAnLTEwcHgnXG5cdFx0XHRcdFx0d2lkdGg6ICcxNXB4J1xuXHRcdFx0XHRcdGhlaWdodDogJzMwcHgnXG5cdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnMzBweCAwIDAgMzBweCdcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IChmaWVsZCktPiBoZWxwZXJzLmRlZmF1bHRDb2xvciBmaWVsZC5lbHMuaW5uZXJ3cmFwLnN0eWxlU2FmZSgnYmFja2dyb3VuZENvbG9yJywxKSwgJ3doaXRlJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybU9yaWdpbjogJzE1cHggMTVweCAwJ1xuXHRcdFx0XVxuXHRcdFx0XG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX21hc2syJ1xuXHRcdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0dG9wOiAnLTVweCdcblx0XHRcdFx0XHRsZWZ0OiAnOHB4J1xuXHRcdFx0XHRcdHdpZHRoOiAnMTVweCdcblx0XHRcdFx0XHRoZWlnaHQ6ICczMHB4J1xuXHRcdFx0XHRcdGJvcmRlclJhZGl1czogJzAgMzBweCAzMHB4IDAnXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAoZmllbGQpLT4gaGVscGVycy5kZWZhdWx0Q29sb3IgZmllbGQuZWxzLmlubmVyd3JhcC5zdHlsZVNhZmUoJ2JhY2tncm91bmRDb2xvcicsMSksICd3aGl0ZSdcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSdcblx0XHRcdFx0XHR0cmFuc2Zvcm1PcmlnaW46ICcwIDE1cHggMCdcblx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnNC4yNXMgZWFzZS1pbiBjaGVja21hcmtSb3RhdGVQbGFjZWhvbGRlcidcblx0XHRcdFx0XHRcdCRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0XHRhbmltYXRpb246ICcnXG5cdFx0XHRdXG5cdFx0XHRcblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbGluZVdyYXBwZXInXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdCRmaWxsZWQ6ICRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnMC41NXMgY2hlY2ttYXJrQW5pbWF0ZUVycm9yJ1xuXHRcdFx0XHRcdFx0dHJhbnNmb3JtT3JpZ2luOiAnNTAlIDEwcHgnXG5cblx0XHRcdFx0WydkaXYnXG5cdFx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX2xpbmVTaG9ydCdcblx0XHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0XHR6SW5kZXg6IDJcblx0XHRcdFx0XHRcdHRvcDogJzEwcHgnXG5cdFx0XHRcdFx0XHRsZWZ0OiAnM3B4J1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0XHRcdFx0d2lkdGg6ICc4cHgnXG5cdFx0XHRcdFx0XHRoZWlnaHQ6ICczcHgnXG5cdFx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICcycHgnXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5ncmVlblxuXHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKDQ1ZGVnKSdcblx0XHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJzAuNzVzIGNoZWNrbWFya0FuaW1hdGVTdWNjZXNzVGlwJ1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQkaW52YWxpZDpcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBDT0xPUlMucmVkXG5cdFx0XHRcdFx0XHRcdGxlZnQ6ICc0cHgnXG5cdFx0XHRcdFx0XHRcdHRvcDogJzhweCdcblx0XHRcdFx0XHRcdFx0d2lkdGg6ICcxMnB4J1xuXHRcdFx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJydcblx0XHRcdFx0XVxuXG5cdFx0XHRcdFsnZGl2J1xuXHRcdFx0XHRcdHJlZjogJ2NoZWNrbWFya19saW5lTG9uZydcblx0XHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0XHR6SW5kZXg6IDJcblx0XHRcdFx0XHRcdHRvcDogJzhweCdcblx0XHRcdFx0XHRcdHJpZ2h0OiAnMnB4J1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0XHRcdFx0d2lkdGg6ICcxMnB4J1xuXHRcdFx0XHRcdFx0aGVpZ2h0OiAnM3B4J1xuXHRcdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnMnB4J1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBDT0xPUlMuZ3JlZW5cblx0XHRcdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuXHRcdFx0XHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnMC43NXMgY2hlY2ttYXJrQW5pbWF0ZVN1Y2Nlc3NMb25nJ1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQkaW52YWxpZDpcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBDT0xPUlMucmVkXG5cdFx0XHRcdFx0XHRcdHRvcDogJzhweCdcblx0XHRcdFx0XHRcdFx0bGVmdDogJzRweCdcblx0XHRcdFx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJydcblx0XHRcdFx0XVxuXHRcdFx0XVxuXHRcdFx0XG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX3BsYWNlaG9sZGVyJ1xuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdHRvcDogJy00cHgnXG5cdFx0XHRcdFx0bGVmdDogJy0zcHgnXG5cdFx0XHRcdFx0d2lkdGg6ICcyMHB4J1xuXHRcdFx0XHRcdGhlaWdodDogJzIwcHgnXG5cdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnNTAlJ1xuXHRcdFx0XHRcdGJvcmRlcldpZHRoOiAnM3B4J1xuXHRcdFx0XHRcdGJvcmRlclN0eWxlOiAnc29saWQnXG5cdFx0XHRcdFx0Ym9yZGVyQ29sb3I6IGhlbHBlcnMuaGV4VG9SR0JBKENPTE9SUy5ncmVlbiwgMC40KVxuXHRcdFx0XHRcdCRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I6IGhlbHBlcnMuaGV4VG9SR0JBKENPTE9SUy5yZWQsIDAuNClcblx0XHRcdF1cblx0XHRcdFxuXHRcdFx0WydkaXYnXG5cdFx0XHRcdHJlZjogJ2NoZWNrbWFya19wYXRjaCdcblx0XHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHRcdHpJbmRleDogMVxuXHRcdFx0XHRcdHRvcDogJy0ycHgnXG5cdFx0XHRcdFx0bGVmdDogJzZweCdcblx0XHRcdFx0XHR3aWR0aDogJzRweCdcblx0XHRcdFx0XHRoZWlnaHQ6ICcyOHB4J1xuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogKGZpZWxkKS0+IGhlbHBlcnMuZGVmYXVsdENvbG9yIGZpZWxkLmVscy5pbm5lcndyYXAuc3R5bGVTYWZlKCdiYWNrZ3JvdW5kQ29sb3InLDEpLCAnd2hpdGUnXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG5cdFx0XHRdXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBwbGFjZWhvbGRlcjogdHJ1ZSxcbiAgdmFsaWRXaGVuSXNDaG9pY2U6IGZhbHNlLFxuICB2YWxpZFdoZW5SZWdleDogZmFsc2UsXG4gIGF1dG9XaWR0aDogZmFsc2UsXG4gIG1heFdpZHRoOiAnMTAwJScsXG4gIG1pbldpZHRoOiAyLFxuICBoZWlnaHQ6IDQ2LFxuICBjaGVja21hcms6IHRydWUsXG4gIGtleWJvYXJkOiAndGV4dCcsXG4gIGRyb3Bkb3duOiB7XG4gICAgbG9ja1Njcm9sbDogZmFsc2VcbiAgfSxcbiAgY2hvaWNlczogbnVsbCxcbiAgbWluTGVuZ3RoOiBudWxsLFxuICBtYXhMZW5ndGg6IG51bGwsXG4gIGlucHV0U2libGluZzogJ2NoZWNrbWFyaycsXG4gIG1hc2s6IHtcbiAgICBwYXR0ZXJuOiBmYWxzZSxcbiAgICBwbGFjZWhvbGRlcjogJ18nLFxuICAgIGd1aWRlOiB0cnVlLFxuICAgIGN1c3RvbVBhdHRlcm5zOiBmYWxzZVxuICB9XG59O1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKbWFXVnNaQzkwWlhoMEwyUmxabUYxYkhSekxtTnZabVpsWlNJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYlhYMD0iLCJleHBvcnRzLlJFR0VYX0xFTl9WQUwgPSAvXlxcZCsoPzpbYS16XXxcXCUpKyQvaTtcblxuZXhwb3J0cy5SRUdFWF9ESUdJVFMgPSAvXFxkKyQvO1xuXG5leHBvcnRzLlJFR0VYX1NQQUNFID0gL1xccy87XG5cbmV4cG9ydHMuUkVHRVhfS0VCQUIgPSAvKFtBLVpdKSsvZztcblxuZXhwb3J0cy5JTVBPUlRBTlQgPSAnaW1wb3J0YW50JztcblxuZXhwb3J0cy5QT1NTSUJMRV9QUkVGSVhFUyA9IFsnd2Via2l0JywgJ21veicsICdtcycsICdvJ107XG5cbmV4cG9ydHMuUkVRVUlSRVNfVU5JVF9WQUxVRSA9IFsnYmFja2dyb3VuZC1wb3NpdGlvbi14JywgJ2JhY2tncm91bmQtcG9zaXRpb24teScsICdibG9jay1zaXplJywgJ2JvcmRlci13aWR0aCcsICdjb2x1bW5SdWxlLXdpZHRoJywgJ2N4JywgJ2N5JywgJ2ZvbnQtc2l6ZScsICdncmlkLWNvbHVtbi1nYXAnLCAnZ3JpZC1yb3ctZ2FwJywgJ2hlaWdodCcsICdpbmxpbmUtc2l6ZScsICdsaW5lLWhlaWdodCcsICdtaW5CbG9jay1zaXplJywgJ21pbi1oZWlnaHQnLCAnbWluLWlubGluZS1zaXplJywgJ21pbi13aWR0aCcsICdtYXgtaGVpZ2h0JywgJ21heC13aWR0aCcsICdvdXRsaW5lLW9mZnNldCcsICdvdXRsaW5lLXdpZHRoJywgJ3BlcnNwZWN0aXZlJywgJ3NoYXBlLW1hcmdpbicsICdzdHJva2UtZGFzaG9mZnNldCcsICdzdHJva2Utd2lkdGgnLCAndGV4dC1pbmRlbnQnLCAnd2lkdGgnLCAnd29yZC1zcGFjaW5nJywgJ3RvcCcsICdib3R0b20nLCAnbGVmdCcsICdyaWdodCcsICd4JywgJ3knXTtcblxuZXhwb3J0cy5RVUFEX1NIT1JUSEFORFMgPSBbJ21hcmdpbicsICdwYWRkaW5nJywgJ2JvcmRlcicsICdib3JkZXItcmFkaXVzJ107XG5cbmV4cG9ydHMuRElSRUNUSU9OUyA9IFsndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0J107XG5cbmV4cG9ydHMuUVVBRF9TSE9SVEhBTkRTLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgdmFyIGRpcmVjdGlvbiwgaSwgbGVuLCByZWY7XG4gIGV4cG9ydHMuUkVRVUlSRVNfVU5JVF9WQUxVRS5wdXNoKHByb3BlcnR5KTtcbiAgcmVmID0gZXhwb3J0cy5ESVJFQ1RJT05TO1xuICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBkaXJlY3Rpb24gPSByZWZbaV07XG4gICAgZXhwb3J0cy5SRVFVSVJFU19VTklUX1ZBTFVFLnB1c2gocHJvcGVydHkgKyAnLScgKyBkaXJlY3Rpb24pO1xuICB9XG59KTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdmNYVnBZMnRrYjIwdmJtOWtaVjl0YjJSMWJHVnpMM0YxYVdOclkzTnpMM055WXk5amIyNXpkR0Z1ZEhNdVkyOW1abVZsSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJjb25zdGFudHMgPSBpbXBvcnQgJy4vY29uc3RhbnRzJ1xuc2FtcGxlU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKS5zdHlsZVxuXG5oZWxwZXJzID0gZXhwb3J0c1xuXG5oZWxwZXJzLmluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPlxuXHR0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuaGVscGVycy5pc0l0ZXJhYmxlID0gKHRhcmdldCktPlxuXHR0YXJnZXQgYW5kXG5cdHR5cGVvZiB0YXJnZXQgaXMgJ29iamVjdCcgYW5kXG5cdHR5cGVvZiB0YXJnZXQubGVuZ3RoIGlzICdudW1iZXInIGFuZFxuXHRub3QgdGFyZ2V0Lm5vZGVUeXBlXG5cbmhlbHBlcnMudG9LZWJhYkNhc2UgPSAoc3RyaW5nKS0+XG5cdHN0cmluZy5yZXBsYWNlIGNvbnN0YW50cy5SRUdFWF9LRUJBQiwgKGUsbGV0dGVyKS0+IFwiLSN7bGV0dGVyLnRvTG93ZXJDYXNlKCl9XCJcblxuaGVscGVycy5pc1Byb3BTdXBwb3J0ZWQgPSAocHJvcGVydHkpLT5cblx0dHlwZW9mIHNhbXBsZVN0eWxlW3Byb3BlcnR5XSBpc250ICd1bmRlZmluZWQnXG5cbmhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZCA9IChwcm9wZXJ0eSwgdmFsdWUpLT5cblx0aWYgd2luZG93LkNTUyBhbmQgd2luZG93LkNTUy5zdXBwb3J0c1xuXHRcdHJldHVybiB3aW5kb3cuQ1NTLnN1cHBvcnRzKHByb3BlcnR5LCB2YWx1ZSlcblx0ZWxzZVxuXHRcdHNhbXBsZVN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlXG5cdFx0cmV0dXJuIHNhbXBsZVN0eWxlW3Byb3BlcnR5XSBpcyAnJyt2YWx1ZVxuXG5oZWxwZXJzLmdldFByZWZpeCA9IChwcm9wZXJ0eSwgc2tpcEluaXRpYWxDaGVjayktPlxuXHRpZiBza2lwSW5pdGlhbENoZWNrIG9yIG5vdCBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZChwcm9wZXJ0eSlcblx0XHRmb3IgcHJlZml4IGluIGNvbnN0YW50cy5QT1NTSUJMRV9QUkVGSVhFU1xuXHRcdFx0IyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuXHRcdFx0cmV0dXJuIFwiLSN7cHJlZml4fS1cIiBpZiBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZChcIi0je3ByZWZpeH0tI3twcm9wZXJ0eX1cIilcblx0XG5cdHJldHVybiAnJ1xuXG5oZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5ID0gKHByb3BlcnR5KS0+XHRcblx0cHJvcGVydHkgPSBoZWxwZXJzLnRvS2ViYWJDYXNlKHByb3BlcnR5KVxuXHRcblx0aWYgaGVscGVycy5pc1Byb3BTdXBwb3J0ZWQocHJvcGVydHkpXG5cdFx0cmV0dXJuIHByb3BlcnR5XG5cdGVsc2Vcblx0XHRyZXR1cm4gXCIje2hlbHBlcnMuZ2V0UHJlZml4KHByb3BlcnR5LHRydWUpfSN7cHJvcGVydHl9XCJcblxuaGVscGVycy5ub3JtYWxpemVWYWx1ZSA9IChwcm9wZXJ0eSwgdmFsdWUpLT5cblx0aWYgaGVscGVycy5pbmNsdWRlcyhjb25zdGFudHMuUkVRVUlSRVNfVU5JVF9WQUxVRSwgcHJvcGVydHkpIGFuZCB2YWx1ZSBpc250IG51bGxcblx0XHR2YWx1ZSA9ICcnK3ZhbHVlXG5cdFx0aWYgIGNvbnN0YW50cy5SRUdFWF9ESUdJVFMudGVzdCh2YWx1ZSkgYW5kXG5cdFx0XHRub3QgY29uc3RhbnRzLlJFR0VYX0xFTl9WQUwudGVzdCh2YWx1ZSkgYW5kXG5cdFx0XHRub3QgY29uc3RhbnRzLlJFR0VYX1NQQUNFLnRlc3QodmFsdWUpXG5cdFx0XHRcdHZhbHVlICs9IGlmIHByb3BlcnR5IGlzICdsaW5lLWhlaWdodCcgdGhlbiAnZW0nIGVsc2UgJ3B4J1xuXG5cdHJldHVybiB2YWx1ZVxuXG5cbmhlbHBlcnMuc29ydCA9IChhcnJheSktPlxuXHRpZiBhcnJheS5sZW5ndGggPCAyXG5cdFx0cmV0dXJuIGFycmF5XG5cdGVsc2Vcblx0XHRwaXZvdCA9IGFycmF5WzBdOyBsZXNzID0gW107IGdyZWF0ID0gW107IGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA9IDA7XG5cdFx0XG5cdFx0d2hpbGUgKytpIGlzbnQgbGVuXG5cdFx0XHRpZiBhcnJheVtpXSA8PSBwaXZvdFxuXHRcdFx0XHRsZXNzLnB1c2goYXJyYXlbaV0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGdyZWF0LnB1c2goYXJyYXlbaV0pXG5cblx0XHRyZXR1cm4gaGVscGVycy5zb3J0KGxlc3MpLmNvbmNhdChwaXZvdCwgaGVscGVycy5zb3J0KGdyZWF0KSlcblxuXG5oZWxwZXJzLmhhc2ggPSAoc3RyaW5nKS0+XG5cdGhhc2ggPSA1MzgxOyBpID0gLTE7IGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcblx0XG5cdHdoaWxlICsraSBpc250IHN0cmluZy5sZW5ndGhcblx0XHRoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBzdHJpbmcuY2hhckNvZGVBdChpKVxuXHRcdGhhc2ggfD0gMFxuXG5cdHJldHVybiAnXycrKGlmIGhhc2ggPCAwIHRoZW4gaGFzaCAqIC0yIGVsc2UgaGFzaClcblxuXG5oZWxwZXJzLnJ1bGVUb1N0cmluZyA9IChydWxlLCBpbXBvcnRhbnQpLT5cblx0b3V0cHV0ID0gJydcblx0cHJvcHMgPSBoZWxwZXJzLnNvcnQoT2JqZWN0LmtleXMocnVsZSkpXG5cdFxuXHRmb3IgcHJvcCBpbiBwcm9wc1xuXHRcdGlmIHR5cGVvZiBydWxlW3Byb3BdIGlzICdzdHJpbmcnIG9yIHR5cGVvZiBydWxlW3Byb3BdIGlzICdudW1iZXInXG5cdFx0XHRwcm9wZXJ0eSA9IGhlbHBlcnMubm9ybWFsaXplUHJvcGVydHkocHJvcClcblx0XHRcdHZhbHVlID0gaGVscGVycy5ub3JtYWxpemVWYWx1ZShwcm9wZXJ0eSwgcnVsZVtwcm9wXSlcblx0XHRcdHZhbHVlICs9IFwiICFpbXBvcnRhbnRcIiBpZiBpbXBvcnRhbnRcblx0XHRcdG91dHB1dCArPSBcIiN7cHJvcGVydHl9OiN7dmFsdWV9O1wiXG5cdFxuXHRyZXR1cm4gb3V0cHV0XG5cbmhlbHBlcnMuaW5saW5lU3R5bGVDb25maWcgPSBzdHlsZUNvbmZpZyA9IE9iamVjdC5jcmVhdGUobnVsbClcbmhlbHBlcnMuaW5saW5lU3R5bGUgPSAocnVsZSwgdmFsdWVUb1N0b3JlLCBsZXZlbCktPlxuXHRpZiBub3QgY29uZmlnPXN0eWxlQ29uZmlnW2xldmVsXVxuXHRcdHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG5cdFx0c3R5bGVFbC5pZCA9IFwicXVpY2tjc3Mje2xldmVsIG9yICcnfVwiXG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKVxuXHRcdHN0eWxlQ29uZmlnW2xldmVsXSA9IGNvbmZpZyA9IGVsOnN0eWxlRWwsIGNvbnRlbnQ6JycsIGNhY2hlOk9iamVjdC5jcmVhdGUobnVsbClcblx0XG5cdHVubGVzcyBjb25maWcuY2FjaGVbcnVsZV1cblx0XHRjb25maWcuY2FjaGVbcnVsZV0gPSB2YWx1ZVRvU3RvcmUgb3IgdHJ1ZVxuXHRcdGNvbmZpZy5lbC50ZXh0Q29udGVudCA9IGNvbmZpZy5jb250ZW50ICs9IHJ1bGVcblx0XG5cdHJldHVyblxuXG5cbmhlbHBlcnMuY2xlYXJJbmxpbmVTdHlsZSA9IChsZXZlbCktPiBpZiBjb25maWcgPSBzdHlsZUNvbmZpZ1tsZXZlbF1cblx0cmV0dXJuIGlmIG5vdCBjb25maWcuY29udGVudFxuXHRjb25maWcuZWwudGV4dENvbnRlbnQgPSBjb25maWcuY29udGVudCA9ICcnXG5cdGtleXMgPSBPYmplY3Qua2V5cyhjb25maWcuY2FjaGUpXG5cdGNvbmZpZy5jYWNoZVtrZXldID0gbnVsbCBmb3Iga2V5IGluIGtleXNcblx0cmV0dXJuXG5cblxuXG5cblxuIiwidmFyIGV4cG9ydHM7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IHtcbiAgZGVmaW5lZDogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0ICE9PSB2b2lkIDA7XG4gIH0sXG4gIGFycmF5OiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHN1YmplY3QgaW5zdGFuY2VvZiBBcnJheTtcbiAgfSxcbiAgb2JqZWN0OiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJiBzdWJqZWN0O1xuICB9LFxuICBvYmplY3RQbGFpbjogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBleHBvcnRzLm9iamVjdChzdWJqZWN0KSAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IE9iamVjdF0nICYmIHN1YmplY3QuY29uc3RydWN0b3IgPT09IE9iamVjdDtcbiAgfSxcbiAgc3RyaW5nOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzdWJqZWN0ID09PSAnc3RyaW5nJztcbiAgfSxcbiAgbnVtYmVyOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzdWJqZWN0ID09PSAnbnVtYmVyJyAmJiAhaXNOYU4oc3ViamVjdCk7XG4gIH0sXG4gIG51bWJlckxvb3NlOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIGV4cG9ydHMubnVtYmVyKHN1YmplY3QpIHx8IGV4cG9ydHMuc3RyaW5nKHN1YmplY3QpICYmIGV4cG9ydHMubnVtYmVyKE51bWJlcihzdWJqZWN0KSk7XG4gIH0sXG4gIFwiZnVuY3Rpb25cIjogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygc3ViamVjdCA9PT0gJ2Z1bmN0aW9uJztcbiAgfSxcbiAgaXRlcmFibGU6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5vYmplY3Qoc3ViamVjdCkgJiYgZXhwb3J0cy5udW1iZXIoc3ViamVjdC5sZW5ndGgpO1xuICB9XG59O1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12UUdSaGJtbGxiR3RoYkdWdUwybHpMM055WXk5dVlYUnBkbVZ6TG1OdlptWmxaU0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiWFgwPSIsInZhciBleHBvcnRzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSB7XG4gIGRvbURvYzogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0ICYmIHN1YmplY3Qubm9kZVR5cGUgPT09IDk7XG4gIH0sXG4gIGRvbUVsOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHN1YmplY3QgJiYgc3ViamVjdC5ub2RlVHlwZSA9PT0gMTtcbiAgfSxcbiAgZG9tVGV4dDogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0ICYmIHN1YmplY3Qubm9kZVR5cGUgPT09IDM7XG4gIH0sXG4gIGRvbU5vZGU6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5kb21FbChzdWJqZWN0KSB8fCBleHBvcnRzLmRvbVRleHQoc3ViamVjdCk7XG4gIH0sXG4gIGRvbVRleHRhcmVhOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHN1YmplY3QgJiYgc3ViamVjdC5ub2RlTmFtZSA9PT0gJ1RFWFRBUkVBJztcbiAgfSxcbiAgZG9tSW5wdXQ6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gc3ViamVjdCAmJiBzdWJqZWN0Lm5vZGVOYW1lID09PSAnSU5QVVQnO1xuICB9LFxuICBkb21TZWxlY3Q6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gc3ViamVjdCAmJiBzdWJqZWN0Lm5vZGVOYW1lID09PSAnU0VMRUNUJztcbiAgfSxcbiAgZG9tRmllbGQ6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5kb21JbnB1dChzdWJqZWN0KSB8fCBleHBvcnRzLmRvbVRleHRhcmVhKHN1YmplY3QpIHx8IGV4cG9ydHMuZG9tU2VsZWN0KHN1YmplY3QpO1xuICB9XG59O1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12UUdSaGJtbGxiR3RoYkdWdUwybHpMM055WXk5a2IyMHVZMjltWm1WbElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sdGRmUT09IiwiZXhwb3J0cy5SRUdFWF9MRU5fVkFMID0gL15cXGQrKD86W2Etel18XFwlKSskL2k7XG5cbmV4cG9ydHMuUkVHRVhfRElHSVRTID0gL1xcZCskLztcblxuZXhwb3J0cy5SRUdFWF9TUEFDRSA9IC9cXHMvO1xuXG5leHBvcnRzLlJFR0VYX0tFQkFCID0gLyhbQS1aXSkrL2c7XG5cbmV4cG9ydHMuUE9TU0lCTEVfUFJFRklYRVMgPSBbJ3dlYmtpdCcsICdtb3onLCAnbXMnLCAnbyddO1xuXG5leHBvcnRzLlJFUVVJUkVTX1VOSVRfVkFMVUUgPSBbJ2JhY2tncm91bmQtcG9zaXRpb24teCcsICdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknLCAnYmxvY2stc2l6ZScsICdib3JkZXItd2lkdGgnLCAnY29sdW1uUnVsZS13aWR0aCcsICdjeCcsICdjeScsICdmb250LXNpemUnLCAnZ3JpZC1jb2x1bW4tZ2FwJywgJ2dyaWQtcm93LWdhcCcsICdoZWlnaHQnLCAnaW5saW5lLXNpemUnLCAnbGluZS1oZWlnaHQnLCAnbWluQmxvY2stc2l6ZScsICdtaW4taGVpZ2h0JywgJ21pbi1pbmxpbmUtc2l6ZScsICdtaW4td2lkdGgnLCAnbWF4LWhlaWdodCcsICdtYXgtd2lkdGgnLCAnb3V0bGluZS1vZmZzZXQnLCAnb3V0bGluZS13aWR0aCcsICdwZXJzcGVjdGl2ZScsICdzaGFwZS1tYXJnaW4nLCAnc3Ryb2tlLWRhc2hvZmZzZXQnLCAnc3Ryb2tlLXdpZHRoJywgJ3RleHQtaW5kZW50JywgJ3dpZHRoJywgJ3dvcmQtc3BhY2luZycsICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnLCAneCcsICd5J107XG5cbmV4cG9ydHMuUVVBRF9TSE9SVEhBTkRTID0gWydtYXJnaW4nLCAncGFkZGluZycsICdib3JkZXInLCAnYm9yZGVyLXJhZGl1cyddO1xuXG5leHBvcnRzLkRJUkVDVElPTlMgPSBbJ3RvcCcsICdib3R0b20nLCAnbGVmdCcsICdyaWdodCddO1xuXG5leHBvcnRzLlFVQURfU0hPUlRIQU5EUy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gIHZhciBkaXJlY3Rpb24sIGksIGxlbiwgcmVmO1xuICBleHBvcnRzLlJFUVVJUkVTX1VOSVRfVkFMVUUucHVzaChwcm9wZXJ0eSk7XG4gIHJlZiA9IGV4cG9ydHMuRElSRUNUSU9OUztcbiAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZGlyZWN0aW9uID0gcmVmW2ldO1xuICAgIGV4cG9ydHMuUkVRVUlSRVNfVU5JVF9WQUxVRS5wdXNoKHByb3BlcnR5ICsgJy0nICsgZGlyZWN0aW9uKTtcbiAgfVxufSk7XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUl1TGk5dWIyUmxYMjF2WkhWc1pYTXZjWFZwWTJ0amMzTXZjM0pqTDJOdmJuTjBZVzUwY3k1amIyWm1aV1VpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2VzExOSIsImNvbnN0YW50cyA9IGltcG9ydCAnLi9jb25zdGFudHMnXG5zYW1wbGVTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLnN0eWxlXG5cbmhlbHBlcnMgPSBleHBvcnRzXG5cbmhlbHBlcnMuaW5jbHVkZXMgPSAodGFyZ2V0LCBpdGVtKS0+XG5cdHRhcmdldCBhbmQgdGFyZ2V0LmluZGV4T2YoaXRlbSkgaXNudCAtMVxuXG5oZWxwZXJzLmlzSXRlcmFibGUgPSAodGFyZ2V0KS0+XG5cdHRhcmdldCBhbmRcblx0dHlwZW9mIHRhcmdldCBpcyAnb2JqZWN0JyBhbmRcblx0dHlwZW9mIHRhcmdldC5sZW5ndGggaXMgJ251bWJlcicgYW5kXG5cdG5vdCB0YXJnZXQubm9kZVR5cGVcblxuaGVscGVycy50b0tlYmFiQ2FzZSA9IChzdHJpbmcpLT5cblx0c3RyaW5nLnJlcGxhY2UgY29uc3RhbnRzLlJFR0VYX0tFQkFCLCAoZSxsZXR0ZXIpLT4gXCItI3tsZXR0ZXIudG9Mb3dlckNhc2UoKX1cIlxuXG5oZWxwZXJzLmlzUHJvcFN1cHBvcnRlZCA9IChwcm9wZXJ0eSktPlxuXHR0eXBlb2Ygc2FtcGxlU3R5bGVbcHJvcGVydHldIGlzbnQgJ3VuZGVmaW5lZCdcblxuaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkID0gKHByb3BlcnR5LCB2YWx1ZSktPlxuXHRpZiB3aW5kb3cuQ1NTIGFuZCB3aW5kb3cuQ1NTLnN1cHBvcnRzXG5cdFx0cmV0dXJuIHdpbmRvdy5DU1Muc3VwcG9ydHMocHJvcGVydHksIHZhbHVlKVxuXHRlbHNlXG5cdFx0c2FtcGxlU3R5bGVbcHJvcGVydHldID0gdmFsdWVcblx0XHRyZXR1cm4gc2FtcGxlU3R5bGVbcHJvcGVydHldIGlzICcnK3ZhbHVlXG5cbmhlbHBlcnMuZ2V0UHJlZml4ID0gKHByb3BlcnR5LCBza2lwSW5pdGlhbENoZWNrKS0+XG5cdGlmIHNraXBJbml0aWFsQ2hlY2sgb3Igbm90IGhlbHBlcnMuaXNQcm9wU3VwcG9ydGVkKHByb3BlcnR5KVxuXHRcdGZvciBwcmVmaXggaW4gY29uc3RhbnRzLlBPU1NJQkxFX1BSRUZJWEVTXG5cdFx0XHQjIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5cdFx0XHRyZXR1cm4gXCItI3twcmVmaXh9LVwiIGlmIGhlbHBlcnMuaXNQcm9wU3VwcG9ydGVkKFwiLSN7cHJlZml4fS0je3Byb3BlcnR5fVwiKVxuXHRcblx0cmV0dXJuICcnXG5cbmhlbHBlcnMubm9ybWFsaXplUHJvcGVydHkgPSAocHJvcGVydHkpLT5cdFxuXHRwcm9wZXJ0eSA9IGhlbHBlcnMudG9LZWJhYkNhc2UocHJvcGVydHkpXG5cdFxuXHRpZiBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZChwcm9wZXJ0eSlcblx0XHRyZXR1cm4gcHJvcGVydHlcblx0ZWxzZVxuXHRcdHJldHVybiBcIiN7aGVscGVycy5nZXRQcmVmaXgocHJvcGVydHksdHJ1ZSl9I3twcm9wZXJ0eX1cIlxuXG5oZWxwZXJzLm5vcm1hbGl6ZVZhbHVlID0gKHByb3BlcnR5LCB2YWx1ZSktPlxuXHRpZiBoZWxwZXJzLmluY2x1ZGVzKGNvbnN0YW50cy5SRVFVSVJFU19VTklUX1ZBTFVFLCBwcm9wZXJ0eSkgYW5kIHZhbHVlIGlzbnQgbnVsbFxuXHRcdHZhbHVlID0gJycrdmFsdWVcblx0XHRpZiAgY29uc3RhbnRzLlJFR0VYX0RJR0lUUy50ZXN0KHZhbHVlKSBhbmRcblx0XHRcdG5vdCBjb25zdGFudHMuUkVHRVhfTEVOX1ZBTC50ZXN0KHZhbHVlKSBhbmRcblx0XHRcdG5vdCBjb25zdGFudHMuUkVHRVhfU1BBQ0UudGVzdCh2YWx1ZSlcblx0XHRcdFx0dmFsdWUgKz0gaWYgcHJvcGVydHkgaXMgJ2xpbmUtaGVpZ2h0JyB0aGVuICdlbScgZWxzZSAncHgnXG5cblx0cmV0dXJuIHZhbHVlXG5cblxuaGVscGVycy5zb3J0ID0gKGFycmF5KS0+XG5cdGlmIGFycmF5Lmxlbmd0aCA8IDJcblx0XHRyZXR1cm4gYXJyYXlcblx0ZWxzZVxuXHRcdHBpdm90ID0gYXJyYXlbMF07IGxlc3MgPSBbXTsgZ3JlYXQgPSBbXTsgbGVuID0gYXJyYXkubGVuZ3RoOyBpID0gMDtcblx0XHRcblx0XHR3aGlsZSArK2kgaXNudCBsZW5cblx0XHRcdGlmIGFycmF5W2ldIDw9IHBpdm90XG5cdFx0XHRcdGxlc3MucHVzaChhcnJheVtpXSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0Z3JlYXQucHVzaChhcnJheVtpXSlcblxuXHRcdHJldHVybiBoZWxwZXJzLnNvcnQobGVzcykuY29uY2F0KHBpdm90LCBoZWxwZXJzLnNvcnQoZ3JlYXQpKVxuXG5cbmhlbHBlcnMuaGFzaCA9IChzdHJpbmcpLT5cblx0aGFzaCA9IDUzODE7IGkgPSAtMTsgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuXHRcblx0d2hpbGUgKytpIGlzbnQgc3RyaW5nLmxlbmd0aFxuXHRcdGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cdFx0aGFzaCB8PSAwXG5cblx0cmV0dXJuICdfJysoaWYgaGFzaCA8IDAgdGhlbiBoYXNoICogLTIgZWxzZSBoYXNoKVxuXG5cbmhlbHBlcnMucnVsZVRvU3RyaW5nID0gKHJ1bGUpLT5cblx0b3V0cHV0ID0gJydcblx0cHJvcHMgPSBoZWxwZXJzLnNvcnQoT2JqZWN0LmtleXMocnVsZSkpXG5cdFxuXHRmb3IgcHJvcCBpbiBwcm9wc1xuXHRcdGlmIHR5cGVvZiBydWxlW3Byb3BdIGlzICdzdHJpbmcnIG9yIHR5cGVvZiBydWxlW3Byb3BdIGlzICdudW1iZXInXG5cdFx0XHRwcm9wZXJ0eSA9IGhlbHBlcnMubm9ybWFsaXplUHJvcGVydHkocHJvcClcblx0XHRcdHZhbHVlID0gaGVscGVycy5ub3JtYWxpemVWYWx1ZShwcm9wZXJ0eSwgcnVsZVtwcm9wXSlcblx0XHRcdG91dHB1dCArPSBcIiN7cHJvcGVydHl9OiN7dmFsdWV9O1wiXG5cdFxuXHRyZXR1cm4gb3V0cHV0XG5cbmhlbHBlcnMuaW5saW5lU3R5bGVDb25maWcgPSBzdHlsZUNvbmZpZyA9IE9iamVjdC5jcmVhdGUobnVsbClcbmhlbHBlcnMuaW5saW5lU3R5bGUgPSAocnVsZSwgdmFsdWVUb1N0b3JlLCBsZXZlbCktPlxuXHRpZiBub3QgY29uZmlnPXN0eWxlQ29uZmlnW2xldmVsXVxuXHRcdHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG5cdFx0c3R5bGVFbC5pZCA9IFwicXVpY2tjc3Mje2xldmVsIG9yICcnfVwiXG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKVxuXHRcdHN0eWxlQ29uZmlnW2xldmVsXSA9IGNvbmZpZyA9IGVsOnN0eWxlRWwsIGNvbnRlbnQ6JycsIGNhY2hlOk9iamVjdC5jcmVhdGUobnVsbClcblx0XG5cdHVubGVzcyBjb25maWcuY2FjaGVbcnVsZV1cblx0XHRjb25maWcuY2FjaGVbcnVsZV0gPSB2YWx1ZVRvU3RvcmUgb3IgdHJ1ZVxuXHRcdGNvbmZpZy5lbC50ZXh0Q29udGVudCA9IGNvbmZpZy5jb250ZW50ICs9IHJ1bGVcblx0XG5cdHJldHVyblxuXG5cbmhlbHBlcnMuY2xlYXJJbmxpbmVTdHlsZSA9IChsZXZlbCktPiBpZiBjb25maWcgPSBzdHlsZUNvbmZpZ1tsZXZlbF1cblx0cmV0dXJuIGlmIG5vdCBjb25maWcuY29udGVudFxuXHRjb25maWcuZWwudGV4dENvbnRlbnQgPSBjb25maWcuY29udGVudCA9ICcnXG5cdGtleXMgPSBPYmplY3Qua2V5cyhjb25maWcuY2FjaGUpXG5cdGNvbmZpZy5jYWNoZVtrZXldID0gbnVsbCBmb3Iga2V5IGluIGtleXNcblx0cmV0dXJuXG5cblxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblNWRyA9IGltcG9ydCAnLi4vLi4vc3ZnJ1xuaGVscGVycyA9IGltcG9ydCAnLi4vLi4vaGVscGVycydcblxuZXhwb3J0IGRlZmF1bHQgRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdkcm9wZG93bidcblx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0ekluZGV4OiAxMFxuXHRcdFx0b3ZlcmZsb3c6ICdoaWRkZW4nXG5cdFx0XHR0b3A6IChkcm9wZG93biktPiBpZiBkcm9wZG93bi5maWVsZC50eXBlIGlzICd0ZXh0JyB0aGVuIEBwYXJlbnQucmF3LnN0eWxlLmhlaWdodCBlbHNlICctN3B4J1xuXHRcdFx0bGVmdDogKCktPiBpZiBAcGFyZW50LnJlY3QubGVmdCAtIDUgPCAwIHRoZW4gMCBlbHNlIC01XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdCMgYmFja2dyb3VuZENvbG9yOiBoZWxwZXJzLmhleFRvUkdCQSgnZjZmNmY2JywgMC45KVxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAnI2Y2ZjZmNidcblx0XHRcdGJveFNoYWRvdzogXCIwcHggNnB4IDEwcHggI3toZWxwZXJzLmhleFRvUkdCQSgnMDAwMDAwJywgMC4zMil9XCJcblx0XHRcdGJvcmRlcldpZHRoOiAnMXB4J1xuXHRcdFx0Ym9yZGVyU3R5bGU6ICdzb2xpZCdcblx0XHRcdGJvcmRlckNvbG9yOiAnI2QxZDFkMSdcblx0XHRcdGJvcmRlclJhZGl1czogJzVweCdcblx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRwYWRkaW5nOiAnNHB4IDAnXG5cdFx0XHQkaXNPcGVuOiAkaGFzVmlzaWJsZUNob2ljZXM6XG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XVxuKVxuXG5leHBvcnQgbGlzdCA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnbGlzdCdcblx0XHRwYXNzU3RhdGVUb0NoaWxkcmVuOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdG92ZXJmbG93OiAnc2Nyb2xsJ1xuXHRcdFx0b3ZlcmZsb3dTY3JvbGxpbmc6ICd0b3VjaCdcblx0XHRcdG92ZXJmbG93U3R5bGU6ICctbXMtYXV0b2hpZGluZy1zY3JvbGxiYXInXG5cdF1cbilcblxuZXhwb3J0IGNob2ljZSA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0c3R5bGU6XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdGZvbnRTaXplOiAnMCdcblx0XHRcdGNvbG9yOiAnIzAwMDAwMCdcblx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXHRcdFx0bGluZUhlaWdodDogJzFlbSdcblx0XHRcdGN1cnNvcjogJ3BvaW50ZXInXG5cdFx0XHQkdmlzaWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0JHVuYXZhaWxhYmxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdCRob3Zlcjpcblx0XHRcdFx0Y29sb3I6ICcjZmZmZmZmJ1xuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjNEM5NkZGJ1xuXG5cdFx0WydkaXYnICMgQ2hlY2ttYXJrXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblx0XHRcdFx0dmVydGljYWxBbGlnbjondG9wJ1xuXHRcdFx0XHR3aWR0aDogJzIwcHgnXG5cdFx0XHRcdCMgaGVpZ2h0OiAoKS0+IEBwYXJlbnQucmF3LnN0eWxlLmhlaWdodFxuXHRcdFx0XHQjIGxpbmVIZWlnaHQ6ICgpLT4gQHBhcmVudC5zdHlsZSgnaGVpZ2h0Jylcblx0XHRcdFx0IyBmb250U2l6ZTogKCktPiBAcGFyZW50LnN0eWxlKCdoZWlnaHQnKVxuXHRcdFx0XHRsaW5lSGVpZ2h0OiAnMjBweCdcblx0XHRcdFx0Zm9udFNpemU6ICcxM3B4J1xuXHRcdFx0XHR0ZXh0QWxpZ246ICdjZW50ZXInXG5cdFx0XHRcdGNvbG9yOiAnaW5oZXJpdCdcblx0XHRcdFx0c3Ryb2tlOiAnY3VycmVudENvbG9yJ1xuXHRcdFx0XHR2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuXHRcdFx0XHQkc2VsZWN0ZWQ6XG5cdFx0XHRcdFx0dmlzaWJpbGl0eTogJ3Zpc2libGUnXG5cblx0XHRcdFNWRy5jaGVja21hcmtcblx0XHRdXG5cdFx0XG5cdFx0WydkaXYnICMgVGV4dFxuXHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHRcdG92ZXJmbG93OiAnaGlkZGVuJ1xuXHRcdFx0XHR0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcydcblx0XHRcdFx0d2hpdGVTcGFjZTogJ25vd3JhcCdcblx0XHRcdFx0d29yZFdyYXA6ICdub3JtYWwnXG5cdFx0XHRcdG1heFdpZHRoOiAoKS0+IFwiY2FsYygxMDAlIC0gI3tAcHJldi5zdHlsZVNhZmUgJ3dpZHRoJywgdHJ1ZX0pXCJcblx0XHRcdFx0cGFkZGluZ1JpZ2h0OiAnMTBweCdcblx0XHRcdFx0bGluZUhlaWdodDogJzIwcHgnXG5cdFx0XHRcdGZvbnRTaXplOiAnMTFweCdcblx0XHRcdFx0Zm9udEZhbWlseTogKGRyb3Bkb3duKS0+IGRyb3Bkb3duLnNldHRpbmdzLmZvbnRGYW1pbHlcblx0XHRcdFx0Y29sb3I6ICdpbmhlcml0J1xuXHRcdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdF1cblx0XVxuKVxuXG5leHBvcnQgc2Nyb2xsSW5kaWNhdG9yVXAgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ3Njcm9sbEluZGljYXRvclVwJ1xuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdHRvcDogMFxuXHRcdFx0bGVmdDogMFxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcyMHB4J1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAnI2Y2ZjZmNidcblx0XHRcdGNvbG9yOiAnIzAwMDAwMCdcblx0XHRcdHRleHRBbGlnbjogJ2NlbnRlcidcblx0XHRcdCR2aXNpYmxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cblx0XHRbJ2Rpdidcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHR0b3A6ICc1MCUnXG5cdFx0XHRcdGxlZnQ6IDBcblx0XHRcdFx0cmlnaHQ6IDBcblx0XHRcdFx0d2lkdGg6ICcxNXB4J1xuXHRcdFx0XHRoZWlnaHQ6ICcxNXB4J1xuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHRcdG1hcmdpbjogJzAgYXV0bydcblx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKSdcblx0XG5cdFx0XHRTVkcuY2FyZXRVcFxuXHRcdF1cblx0XVxuKVxuXG5leHBvcnQgc2Nyb2xsSW5kaWNhdG9yRG93biA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnc2Nyb2xsSW5kaWNhdG9yRG93bidcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRib3R0b206IDBcblx0XHRcdGxlZnQ6IDBcblx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMjBweCdcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNmNmY2ZjYnXG5cdFx0XHRjb2xvcjogJyMwMDAwMDAnXG5cdFx0XHR0ZXh0QWxpZ246ICdjZW50ZXInXG5cdFx0XHQkdmlzaWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXG5cdFx0WydkaXYnXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0dG9wOiAnNTAlJ1xuXHRcdFx0XHRsZWZ0OiAwXG5cdFx0XHRcdHJpZ2h0OiAwXG5cdFx0XHRcdHdpZHRoOiAnMTVweCdcblx0XHRcdFx0aGVpZ2h0OiAnMTVweCdcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0XHRtYXJnaW46ICcwIGF1dG8nXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknXG5cblx0XHRcdFNWRy5jYXJldERvd25cblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IGhlbHAgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2hlbHAnXG5cdFx0c3R5bGU6XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdGJvcmRlclRvcDogJzJweCBzb2xpZCByZ2JhKDAsMCwwLDAuMDUpJ1xuXHRcdFx0cGFkZGluZzogJzRweCAxMnB4IDFweCdcblx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwLjUpJ1xuXHRcdFx0Zm9udFdlaWdodDogJzUwMCdcblx0XHRcdGZvbnRTaXplOiAnMTFweCdcblx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXHRcdFx0JHNob3dIZWxwOlxuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdF1cbilcblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWF4SGVpZ2h0OiAzMDAsXG4gIG11bHRpcGxlOiBmYWxzZSxcbiAgbG9ja1Njcm9sbDogdHJ1ZSxcbiAgdHlwZUJ1ZmZlcjogZmFsc2UsXG4gIGhlbHA6ICcnLFxuICB0ZW1wbGF0ZXM6IHt9XG59O1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKamIyMXdiMjVsYm5SekwyUnliM0JrYjNkdUwyUmxabUYxYkhSekxtTnZabVpsWlNJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYlhYMD0iLCIhZnVuY3Rpb24oZSxyKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1yKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxyKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLnRleHRNYXNrQ29yZT1yKCk6ZS50ZXh0TWFza0NvcmU9cigpfSh0aGlzLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHIobil7aWYodFtuXSlyZXR1cm4gdFtuXS5leHBvcnRzO3ZhciBvPXRbbl09e2V4cG9ydHM6e30saWQ6bixsb2FkZWQ6ITF9O3JldHVybiBlW25dLmNhbGwoby5leHBvcnRzLG8sby5leHBvcnRzLHIpLG8ubG9hZGVkPSEwLG8uZXhwb3J0c312YXIgdD17fTtyZXR1cm4gci5tPWUsci5jPXQsci5wPVwiXCIscigwKX0oW2Z1bmN0aW9uKGUscix0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKGUpe3JldHVybiBlJiZlLl9fZXNNb2R1bGU/ZTp7ZGVmYXVsdDplfX1PYmplY3QuZGVmaW5lUHJvcGVydHkocixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbz10KDMpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiY29uZm9ybVRvTWFza1wiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBuKG8pLmRlZmF1bHR9fSk7dmFyIGk9dCgyKTtPYmplY3QuZGVmaW5lUHJvcGVydHkocixcImFkanVzdENhcmV0UG9zaXRpb25cIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbihpKS5kZWZhdWx0fX0pO3ZhciBhPXQoNSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJjcmVhdGVUZXh0TWFza0lucHV0RWxlbWVudFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBuKGEpLmRlZmF1bHR9fSl9LGZ1bmN0aW9uKGUscil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksci5wbGFjZWhvbGRlckNoYXI9XCJfXCJ9LGZ1bmN0aW9uKGUscil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlKXt2YXIgcj1lLnByZXZpb3VzQ29uZm9ybWVkVmFsdWUsdD12b2lkIDA9PT1yP286cixpPWUucHJldmlvdXNQbGFjZWhvbGRlcixhPXZvaWQgMD09PWk/bzppLHU9ZS5jdXJyZW50Q2FyZXRQb3NpdGlvbixsPXZvaWQgMD09PXU/MDp1LHM9ZS5jb25mb3JtZWRWYWx1ZSxmPWUucmF3VmFsdWUsZD1lLnBsYWNlaG9sZGVyQ2hhcixjPWUucGxhY2Vob2xkZXIsdj1lLmluZGV4ZXNPZlBpcGVkQ2hhcnMscD12b2lkIDA9PT12P246dixoPWUuY2FyZXRUcmFwSW5kZXhlcyxnPXZvaWQgMD09PWg/bjpoO2lmKDA9PT1sKXJldHVybiAwO3ZhciBtPWYubGVuZ3RoLHk9dC5sZW5ndGgsYj1jLmxlbmd0aCxDPXMubGVuZ3RoLFA9bS15LHg9UD4wLE89MD09PXksaz1QPjEmJiF4JiYhTztpZihrKXJldHVybiBsO3ZhciBqPXgmJih0PT09c3x8cz09PWMpLE09MCxUPXZvaWQgMCx3PXZvaWQgMDtpZihqKU09bC1QO2Vsc2V7dmFyIF89cy50b0xvd2VyQ2FzZSgpLFY9Zi50b0xvd2VyQ2FzZSgpLFM9Vi5zdWJzdHIoMCxsKS5zcGxpdChvKSxOPVMuZmlsdGVyKGZ1bmN0aW9uKGUpe3JldHVybiBfLmluZGV4T2YoZSkhPT0tMX0pO3c9TltOLmxlbmd0aC0xXTt2YXIgRT1hLnN1YnN0cigwLE4ubGVuZ3RoKS5zcGxpdChvKS5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIGUhPT1kfSkubGVuZ3RoLEE9Yy5zdWJzdHIoMCxOLmxlbmd0aCkuc3BsaXQobykuZmlsdGVyKGZ1bmN0aW9uKGUpe3JldHVybiBlIT09ZH0pLmxlbmd0aCxSPUEhPT1FLEk9dm9pZCAwIT09YVtOLmxlbmd0aC0xXSYmdm9pZCAwIT09Y1tOLmxlbmd0aC0yXSYmYVtOLmxlbmd0aC0xXSE9PWQmJmFbTi5sZW5ndGgtMV0hPT1jW04ubGVuZ3RoLTFdJiZhW04ubGVuZ3RoLTFdPT09Y1tOLmxlbmd0aC0yXTsheCYmKFJ8fEkpJiZFPjAmJmMuaW5kZXhPZih3KT4tMSYmdm9pZCAwIT09ZltsXSYmKFQ9ITAsdz1mW2xdKTtmb3IodmFyIEo9cC5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuIF9bZV19KSxxPUouZmlsdGVyKGZ1bmN0aW9uKGUpe3JldHVybiBlPT09d30pLmxlbmd0aCxGPU4uZmlsdGVyKGZ1bmN0aW9uKGUpe3JldHVybiBlPT09d30pLmxlbmd0aCxMPWMuc3Vic3RyKDAsYy5pbmRleE9mKGQpKS5zcGxpdChvKS5maWx0ZXIoZnVuY3Rpb24oZSxyKXtyZXR1cm4gZT09PXcmJmZbcl0hPT1lfSkubGVuZ3RoLFc9TCtGK3ErKFQ/MTowKSx6PTAsQj0wO0I8QztCKyspe3ZhciBEPV9bQl07aWYoTT1CKzEsRD09PXcmJnorKyx6Pj1XKWJyZWFrfX1pZih4KXtmb3IodmFyIEc9TSxIPU07SDw9YjtIKyspaWYoY1tIXT09PWQmJihHPUgpLGNbSF09PT1kfHxnLmluZGV4T2YoSCkhPT0tMXx8SD09PWIpcmV0dXJuIEd9ZWxzZSBpZihUKXtmb3IodmFyIEs9TS0xO0s+PTA7Sy0tKWlmKHNbS109PT13fHxnLmluZGV4T2YoSykhPT0tMXx8MD09PUspcmV0dXJuIEt9ZWxzZSBmb3IodmFyIFE9TTtRPj0wO1EtLSlpZihjW1EtMV09PT1kfHxnLmluZGV4T2YoUSkhPT0tMXx8MD09PVEpcmV0dXJuIFF9T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksci5kZWZhdWx0PXQ7dmFyIG49W10sbz1cIlwifSxmdW5jdGlvbihlLHIsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTphLHI9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOmEsdD1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06e30sbj10Lmd1aWRlLHU9dm9pZCAwPT09bnx8bixsPXQucHJldmlvdXNDb25mb3JtZWRWYWx1ZSxzPXZvaWQgMD09PWw/YTpsLGY9dC5wbGFjZWhvbGRlckNoYXIsZD12b2lkIDA9PT1mP2kucGxhY2Vob2xkZXJDaGFyOmYsYz10LnBsYWNlaG9sZGVyLHY9dm9pZCAwPT09Yz8oMCxvLmNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcikocixkKTpjLHA9dC5jdXJyZW50Q2FyZXRQb3NpdGlvbixoPXQua2VlcENoYXJQb3NpdGlvbnMsZz11PT09ITEmJnZvaWQgMCE9PXMsbT1lLmxlbmd0aCx5PXMubGVuZ3RoLGI9di5sZW5ndGgsQz1yLmxlbmd0aCxQPW0teSx4PVA+MCxPPXArKHg/LVA6MCksaz1PK01hdGguYWJzKFApO2lmKGg9PT0hMCYmIXgpe2Zvcih2YXIgaj1hLE09TztNPGs7TSsrKXZbTV09PT1kJiYoais9ZCk7ZT1lLnNsaWNlKDAsTykraitlLnNsaWNlKE8sbSl9Zm9yKHZhciBUPWUuc3BsaXQoYSkubWFwKGZ1bmN0aW9uKGUscil7cmV0dXJue2NoYXI6ZSxpc05ldzpyPj1PJiZyPGt9fSksdz1tLTE7dz49MDt3LS0pe3ZhciBfPVRbd10uY2hhcjtpZihfIT09ZCl7dmFyIFY9dz49TyYmeT09PUM7Xz09PXZbVj93LVA6d10mJlQuc3BsaWNlKHcsMSl9fXZhciBTPWEsTj0hMTtlOmZvcih2YXIgRT0wO0U8YjtFKyspe3ZhciBBPXZbRV07aWYoQT09PWQpe2lmKFQubGVuZ3RoPjApZm9yKDtULmxlbmd0aD4wOyl7dmFyIFI9VC5zaGlmdCgpLEk9Ui5jaGFyLEo9Ui5pc05ldztpZihJPT09ZCYmZyE9PSEwKXtTKz1kO2NvbnRpbnVlIGV9aWYocltFXS50ZXN0KEkpKXtpZihoPT09ITAmJkohPT0hMSYmcyE9PWEmJnUhPT0hMSYmeCl7Zm9yKHZhciBxPVQubGVuZ3RoLEY9bnVsbCxMPTA7TDxxO0wrKyl7dmFyIFc9VFtMXTtpZihXLmNoYXIhPT1kJiZXLmlzTmV3PT09ITEpYnJlYWs7aWYoVy5jaGFyPT09ZCl7Rj1MO2JyZWFrfX1udWxsIT09Rj8oUys9SSxULnNwbGljZShGLDEpKTpFLS19ZWxzZSBTKz1JO2NvbnRpbnVlIGV9Tj0hMH1nPT09ITEmJihTKz12LnN1YnN0cihFLGIpKTticmVha31TKz1BfWlmKGcmJng9PT0hMSl7Zm9yKHZhciB6PW51bGwsQj0wO0I8Uy5sZW5ndGg7QisrKXZbQl09PT1kJiYoej1CKTtTPW51bGwhPT16P1Muc3Vic3RyKDAseisxKTphfXJldHVybntjb25mb3JtZWRWYWx1ZTpTLG1ldGE6e3NvbWVDaGFyc1JlamVjdGVkOk59fX1PYmplY3QuZGVmaW5lUHJvcGVydHkocixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxyLmRlZmF1bHQ9bjt2YXIgbz10KDQpLGk9dCgxKSxhPVwiXCJ9LGZ1bmN0aW9uKGUscix0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOmwscj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06dS5wbGFjZWhvbGRlckNoYXI7aWYoZS5pbmRleE9mKHIpIT09LTEpdGhyb3cgbmV3IEVycm9yKFwiUGxhY2Vob2xkZXIgY2hhcmFjdGVyIG11c3Qgbm90IGJlIHVzZWQgYXMgcGFydCBvZiB0aGUgbWFzay4gUGxlYXNlIHNwZWNpZnkgYSBjaGFyYWN0ZXIgdGhhdCBpcyBub3QgcHJlc2VudCBpbiB5b3VyIG1hc2sgYXMgeW91ciBwbGFjZWhvbGRlciBjaGFyYWN0ZXIuXFxuXFxuXCIrKFwiVGhlIHBsYWNlaG9sZGVyIGNoYXJhY3RlciB0aGF0IHdhcyByZWNlaXZlZCBpczogXCIrSlNPTi5zdHJpbmdpZnkocikrXCJcXG5cXG5cIikrKFwiVGhlIG1hc2sgdGhhdCB3YXMgcmVjZWl2ZWQgaXM6IFwiK0pTT04uc3RyaW5naWZ5KGUpKSk7cmV0dXJuIGUubWFwKGZ1bmN0aW9uKGUpe3JldHVybiBlIGluc3RhbmNlb2YgUmVnRXhwP3I6ZX0pLmpvaW4oXCJcIil9ZnVuY3Rpb24gbyhlKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZXx8ZSBpbnN0YW5jZW9mIFN0cmluZ31mdW5jdGlvbiBpKGUpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiBlJiZ2b2lkIDA9PT1lLmxlbmd0aCYmIWlzTmFOKGUpfWZ1bmN0aW9uIGEoZSl7Zm9yKHZhciByPVtdLHQ9dm9pZCAwO3Q9ZS5pbmRleE9mKHMpLHQhPT0tMTspci5wdXNoKHQpLGUuc3BsaWNlKHQsMSk7cmV0dXJue21hc2tXaXRob3V0Q2FyZXRUcmFwczplLGluZGV4ZXM6cn19T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksci5jb252ZXJ0TWFza1RvUGxhY2Vob2xkZXI9bixyLmlzU3RyaW5nPW8sci5pc051bWJlcj1pLHIucHJvY2Vzc0NhcmV0VHJhcHM9YTt2YXIgdT10KDEpLGw9W10scz1cIltdXCJ9LGZ1bmN0aW9uKGUscix0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKGUpe3JldHVybiBlJiZlLl9fZXNNb2R1bGU/ZTp7ZGVmYXVsdDplfX1mdW5jdGlvbiBvKGUpe3ZhciByPXtwcmV2aW91c0NvbmZvcm1lZFZhbHVlOnZvaWQgMCxwcmV2aW91c1BsYWNlaG9sZGVyOnZvaWQgMH07cmV0dXJue3N0YXRlOnIsdXBkYXRlOmZ1bmN0aW9uKHQpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTplLG89bi5pbnB1dEVsZW1lbnQscz1uLm1hc2ssZD1uLmd1aWRlLG09bi5waXBlLGI9bi5wbGFjZWhvbGRlckNoYXIsQz12b2lkIDA9PT1iP3AucGxhY2Vob2xkZXJDaGFyOmIsUD1uLmtlZXBDaGFyUG9zaXRpb25zLHg9dm9pZCAwIT09UCYmUCxPPW4uc2hvd01hc2ssaz12b2lkIDAhPT1PJiZPO2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiB0JiYodD1vLnZhbHVlKSx0IT09ci5wcmV2aW91c0NvbmZvcm1lZFZhbHVlKXsoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHM/XCJ1bmRlZmluZWRcIjpsKHMpKT09PXkmJnZvaWQgMCE9PXMucGlwZSYmdm9pZCAwIT09cy5tYXNrJiYobT1zLnBpcGUscz1zLm1hc2spO3ZhciBqPXZvaWQgMCxNPXZvaWQgMDtpZihzIGluc3RhbmNlb2YgQXJyYXkmJihqPSgwLHYuY29udmVydE1hc2tUb1BsYWNlaG9sZGVyKShzLEMpKSxzIT09ITEpe3ZhciBUPWEodCksdz1vLnNlbGVjdGlvbkVuZCxfPXIucHJldmlvdXNDb25mb3JtZWRWYWx1ZSxWPXIucHJldmlvdXNQbGFjZWhvbGRlcixTPXZvaWQgMDtpZigoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHM/XCJ1bmRlZmluZWRcIjpsKHMpKT09PWgpe2lmKE09cyhULHtjdXJyZW50Q2FyZXRQb3NpdGlvbjp3LHByZXZpb3VzQ29uZm9ybWVkVmFsdWU6XyxwbGFjZWhvbGRlckNoYXI6Q30pLE09PT0hMSlyZXR1cm47dmFyIE49KDAsdi5wcm9jZXNzQ2FyZXRUcmFwcykoTSksRT1OLm1hc2tXaXRob3V0Q2FyZXRUcmFwcyxBPU4uaW5kZXhlcztNPUUsUz1BLGo9KDAsdi5jb252ZXJ0TWFza1RvUGxhY2Vob2xkZXIpKE0sQyl9ZWxzZSBNPXM7dmFyIFI9e3ByZXZpb3VzQ29uZm9ybWVkVmFsdWU6XyxndWlkZTpkLHBsYWNlaG9sZGVyQ2hhcjpDLHBpcGU6bSxwbGFjZWhvbGRlcjpqLGN1cnJlbnRDYXJldFBvc2l0aW9uOncsa2VlcENoYXJQb3NpdGlvbnM6eH0sST0oMCxjLmRlZmF1bHQpKFQsTSxSKSxKPUkuY29uZm9ybWVkVmFsdWUscT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIG0/XCJ1bmRlZmluZWRcIjpsKG0pKT09PWgsRj17fTtxJiYoRj1tKEosdSh7cmF3VmFsdWU6VH0sUikpLEY9PT0hMT9GPXt2YWx1ZTpfLHJlamVjdGVkOiEwfTooMCx2LmlzU3RyaW5nKShGKSYmKEY9e3ZhbHVlOkZ9KSk7dmFyIEw9cT9GLnZhbHVlOkosVz0oMCxmLmRlZmF1bHQpKHtwcmV2aW91c0NvbmZvcm1lZFZhbHVlOl8scHJldmlvdXNQbGFjZWhvbGRlcjpWLGNvbmZvcm1lZFZhbHVlOkwscGxhY2Vob2xkZXI6aixyYXdWYWx1ZTpULGN1cnJlbnRDYXJldFBvc2l0aW9uOncscGxhY2Vob2xkZXJDaGFyOkMsaW5kZXhlc09mUGlwZWRDaGFyczpGLmluZGV4ZXNPZlBpcGVkQ2hhcnMsY2FyZXRUcmFwSW5kZXhlczpTfSksej1MPT09aiYmMD09PVcsQj1rP2o6ZyxEPXo/QjpMO3IucHJldmlvdXNDb25mb3JtZWRWYWx1ZT1ELHIucHJldmlvdXNQbGFjZWhvbGRlcj1qLG8udmFsdWUhPT1EJiYoby52YWx1ZT1ELGkobyxXKSl9fX19fWZ1bmN0aW9uIGkoZSxyKXtkb2N1bWVudC5hY3RpdmVFbGVtZW50PT09ZSYmKGI/QyhmdW5jdGlvbigpe3JldHVybiBlLnNldFNlbGVjdGlvblJhbmdlKHIscixtKX0sMCk6ZS5zZXRTZWxlY3Rpb25SYW5nZShyLHIsbSkpfWZ1bmN0aW9uIGEoZSl7aWYoKDAsdi5pc1N0cmluZykoZSkpcmV0dXJuIGU7aWYoKDAsdi5pc051bWJlcikoZSkpcmV0dXJuIFN0cmluZyhlKTtpZih2b2lkIDA9PT1lfHxudWxsPT09ZSlyZXR1cm4gZzt0aHJvdyBuZXcgRXJyb3IoXCJUaGUgJ3ZhbHVlJyBwcm92aWRlZCB0byBUZXh0IE1hc2sgbmVlZHMgdG8gYmUgYSBzdHJpbmcgb3IgYSBudW1iZXIuIFRoZSB2YWx1ZSByZWNlaXZlZCB3YXM6XFxuXFxuIFwiK0pTT04uc3RyaW5naWZ5KGUpKX1PYmplY3QuZGVmaW5lUHJvcGVydHkocixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgdT1PYmplY3QuYXNzaWdufHxmdW5jdGlvbihlKXtmb3IodmFyIHI9MTtyPGFyZ3VtZW50cy5sZW5ndGg7cisrKXt2YXIgdD1hcmd1bWVudHNbcl07Zm9yKHZhciBuIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbikmJihlW25dPXRbbl0pfXJldHVybiBlfSxsPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbihlKXtyZXR1cm4gdHlwZW9mIGV9OmZ1bmN0aW9uKGUpe3JldHVybiBlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJmUuY29uc3RydWN0b3I9PT1TeW1ib2wmJmUhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIGV9O3IuZGVmYXVsdD1vO3ZhciBzPXQoMiksZj1uKHMpLGQ9dCgzKSxjPW4oZCksdj10KDQpLHA9dCgxKSxoPVwiZnVuY3Rpb25cIixnPVwiXCIsbT1cIm5vbmVcIix5PVwib2JqZWN0XCIsYj1cInVuZGVmaW5lZFwiIT10eXBlb2YgbmF2aWdhdG9yJiYvQW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksQz1cInVuZGVmaW5lZFwiIT10eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lP3JlcXVlc3RBbmltYXRpb25GcmFtZTpzZXRUaW1lb3V0fV0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdmRHVjRkQzF0WVhOckxXTnZjbVV2WkdsemRDOTBaWGgwVFdGemEwTnZjbVV1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNlcxMTkiLCIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSx0KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLnRleHRNYXNrQWRkb25zPXQoKTplLnRleHRNYXNrQWRkb25zPXQoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtmdW5jdGlvbiB0KHIpe2lmKG5bcl0pcmV0dXJuIG5bcl0uZXhwb3J0czt2YXIgbz1uW3JdPXtleHBvcnRzOnt9LGlkOnIsbG9hZGVkOiExfTtyZXR1cm4gZVtyXS5jYWxsKG8uZXhwb3J0cyxvLG8uZXhwb3J0cyx0KSxvLmxvYWRlZD0hMCxvLmV4cG9ydHN9dmFyIG49e307cmV0dXJuIHQubT1lLHQuYz1uLHQucD1cIlwiLHQoMCl9KFtmdW5jdGlvbihlLHQsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG89bigxKTtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcImNyZWF0ZUF1dG9Db3JyZWN0ZWREYXRlUGlwZVwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiByKG8pLmRlZmF1bHR9fSk7dmFyIGk9bigyKTtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcImNyZWF0ZU51bWJlck1hc2tcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcihpKS5kZWZhdWx0fX0pO3ZhciB1PW4oMyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJlbWFpbE1hc2tcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcih1KS5kZWZhdWx0fX0pfSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06XCJtbSBkZCB5eXl5XCI7cmV0dXJuIGZ1bmN0aW9uKHQpe3ZhciBuPVtdLHI9ZS5zcGxpdCgvW15kbXldKy8pLG89e2RkOjMxLG1tOjEyLHl5Ojk5LHl5eXk6OTk5OX0saT17ZGQ6MSxtbToxLHl5OjAseXl5eToxfSx1PXQuc3BsaXQoXCJcIik7ci5mb3JFYWNoKGZ1bmN0aW9uKHQpe3ZhciByPWUuaW5kZXhPZih0KSxpPXBhcnNlSW50KG9bdF0udG9TdHJpbmcoKS5zdWJzdHIoMCwxKSwxMCk7cGFyc2VJbnQodVtyXSwxMCk+aSYmKHVbcisxXT11W3JdLHVbcl09MCxuLnB1c2gocikpfSk7dmFyIGM9ci5zb21lKGZ1bmN0aW9uKG4pe3ZhciByPWUuaW5kZXhPZihuKSx1PW4ubGVuZ3RoLGM9dC5zdWJzdHIocix1KS5yZXBsYWNlKC9cXEQvZyxcIlwiKSxsPXBhcnNlSW50KGMsMTApO3JldHVybiBsPm9bbl18fGMubGVuZ3RoPT09dSYmbDxpW25dfSk7cmV0dXJuIWMmJnt2YWx1ZTp1LmpvaW4oXCJcIiksaW5kZXhlc09mUGlwZWRDaGFyczpufX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5kZWZhdWx0PW59LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbigpe2Z1bmN0aW9uIGUoKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06Yyx0PWUubGVuZ3RoO2lmKGU9PT1jfHxlWzBdPT09aFswXSYmMT09PXQpcmV0dXJuIGguc3BsaXQoYykuY29uY2F0KFt2XSkuY29uY2F0KG0uc3BsaXQoYykpO2lmKGU9PT1TJiZNKXJldHVybiBoLnNwbGl0KGMpLmNvbmNhdChbXCIwXCIsUyx2XSkuY29uY2F0KG0uc3BsaXQoYykpO3ZhciBuPWUubGFzdEluZGV4T2YoUyksdT1uIT09LTEsbD1lWzBdPT09cyYmSSxhPXZvaWQgMCxnPXZvaWQgMCxiPXZvaWQgMDtpZihlLnNsaWNlKFYqLTEpPT09bSYmKGU9ZS5zbGljZSgwLFYqLTEpKSx1JiYoTXx8RCk/KGE9ZS5zbGljZShlLnNsaWNlKDAsJCk9PT1oPyQ6MCxuKSxnPWUuc2xpY2UobisxLHQpLGc9cihnLnJlcGxhY2UoZixjKSkpOmE9ZS5zbGljZSgwLCQpPT09aD9lLnNsaWNlKCQpOmUsTiYmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBOP1widW5kZWZpbmVkXCI6aShOKSk9PT1wKXt2YXIgTz1cIi5cIj09PV8/XCJbLl1cIjpcIlwiK18saj0oYS5tYXRjaChuZXcgUmVnRXhwKE8sXCJnXCIpKXx8W10pLmxlbmd0aDthPWEuc2xpY2UoMCxOK2oqcSl9cmV0dXJuIGE9YS5yZXBsYWNlKGYsYyksQXx8KGE9YS5yZXBsYWNlKC9eMCsoMCR8W14wXSkvLFwiJDFcIikpLGE9eD9vKGEsXyk6YSxiPXIoYSksKHUmJk18fEQ9PT0hMCkmJihlW24tMV0hPT1TJiZiLnB1c2goeSksYi5wdXNoKFMseSksZyYmKChcInVuZGVmaW5lZFwiPT10eXBlb2YgQz9cInVuZGVmaW5lZFwiOmkoQykpPT09cCYmKGc9Zy5zbGljZSgwLEMpKSxiPWIuY29uY2F0KGcpKSxEPT09ITAmJmVbbi0xXT09PVMmJmIucHVzaCh2KSksJD4wJiYoYj1oLnNwbGl0KGMpLmNvbmNhdChiKSksbCYmKGIubGVuZ3RoPT09JCYmYi5wdXNoKHYpLGI9W2RdLmNvbmNhdChiKSksbS5sZW5ndGg+MCYmKGI9Yi5jb25jYXQobS5zcGxpdChjKSkpLGJ9dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LG49dC5wcmVmaXgsaD12b2lkIDA9PT1uP3U6bixnPXQuc3VmZml4LG09dm9pZCAwPT09Zz9jOmcsYj10LmluY2x1ZGVUaG91c2FuZHNTZXBhcmF0b3IseD12b2lkIDA9PT1ifHxiLE89dC50aG91c2FuZHNTZXBhcmF0b3JTeW1ib2wsXz12b2lkIDA9PT1PP2w6TyxqPXQuYWxsb3dEZWNpbWFsLE09dm9pZCAwIT09aiYmaixQPXQuZGVjaW1hbFN5bWJvbCxTPXZvaWQgMD09PVA/YTpQLHc9dC5kZWNpbWFsTGltaXQsQz12b2lkIDA9PT13PzI6dyxrPXQucmVxdWlyZURlY2ltYWwsRD12b2lkIDAhPT1rJiZrLEU9dC5hbGxvd05lZ2F0aXZlLEk9dm9pZCAwIT09RSYmRSxSPXQuYWxsb3dMZWFkaW5nWmVyb2VzLEE9dm9pZCAwIT09UiYmUixMPXQuaW50ZWdlckxpbWl0LE49dm9pZCAwPT09TD9udWxsOkwsJD1oJiZoLmxlbmd0aHx8MCxWPW0mJm0ubGVuZ3RofHwwLHE9XyYmXy5sZW5ndGh8fDA7cmV0dXJuIGUuaW5zdGFuY2VPZj1cImNyZWF0ZU51bWJlck1hc2tcIixlfWZ1bmN0aW9uIHIoZSl7cmV0dXJuIGUuc3BsaXQoYykubWFwKGZ1bmN0aW9uKGUpe3JldHVybiB2LnRlc3QoZSk/djplfSl9ZnVuY3Rpb24gbyhlLHQpe3JldHVybiBlLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csdCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGk9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX07dC5kZWZhdWx0PW47dmFyIHU9XCIkXCIsYz1cIlwiLGw9XCIsXCIsYT1cIi5cIixzPVwiLVwiLGQ9Ly0vLGY9L1xcRCsvZyxwPVwibnVtYmVyXCIsdj0vXFxkLyx5PVwiW11cIn0sZnVuY3Rpb24oZSx0LG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIoZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntkZWZhdWx0OmV9fWZ1bmN0aW9uIG8oZSx0KXtlPWUucmVwbGFjZShPLHYpO3ZhciBuPXQucGxhY2Vob2xkZXJDaGFyLHI9dC5jdXJyZW50Q2FyZXRQb3NpdGlvbixvPWUuaW5kZXhPZih5KSxzPWUubGFzdEluZGV4T2YocCksZD1zPG8/LTE6cyxmPWkoZSxvKzEseSksaD1pKGUsZC0xLHApLGc9dShlLG8sbiksbT1jKGUsbyxkLG4pLGI9bChlLGQsbixyKTtnPWEoZyksbT1hKG0pLGI9YShiLCEwKTt2YXIgeD1nLmNvbmNhdChmKS5jb25jYXQobSkuY29uY2F0KGgpLmNvbmNhdChiKTtyZXR1cm4geH1mdW5jdGlvbiBpKGUsdCxuKXt2YXIgcj1bXTtyZXR1cm4gZVt0XT09PW4/ci5wdXNoKG4pOnIucHVzaChoLG4pLHIucHVzaChoKSxyfWZ1bmN0aW9uIHUoZSx0KXtyZXR1cm4gdD09PS0xP2U6ZS5zbGljZSgwLHQpfWZ1bmN0aW9uIGMoZSx0LG4scil7dmFyIG89djtyZXR1cm4gdCE9PS0xJiYobz1uPT09LTE/ZS5zbGljZSh0KzEsZS5sZW5ndGgpOmUuc2xpY2UodCsxLG4pKSxvPW8ucmVwbGFjZShuZXcgUmVnRXhwKFwiW1xcXFxzXCIrcitcIl1cIixtKSx2KSxvPT09eT9mOm8ubGVuZ3RoPDE/ZzpvW28ubGVuZ3RoLTFdPT09cD9vLnNsaWNlKDAsby5sZW5ndGgtMSk6b31mdW5jdGlvbiBsKGUsdCxuLHIpe3ZhciBvPXY7cmV0dXJuIHQhPT0tMSYmKG89ZS5zbGljZSh0KzEsZS5sZW5ndGgpKSxvPW8ucmVwbGFjZShuZXcgUmVnRXhwKFwiW1xcXFxzXCIrbitcIi5dXCIsbSksdiksMD09PW8ubGVuZ3RoP2VbdC0xXT09PXAmJnIhPT1lLmxlbmd0aD9mOnY6b31mdW5jdGlvbiBhKGUsdCl7cmV0dXJuIGUuc3BsaXQodikubWFwKGZ1bmN0aW9uKGUpe3JldHVybiBlPT09Zz9lOnQ/eDpifSl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHM9big0KSxkPXIocyksZj1cIipcIixwPVwiLlwiLHY9XCJcIix5PVwiQFwiLGg9XCJbXVwiLGc9XCIgXCIsbT1cImdcIixiPS9bXlxcc10vLHg9L1teLlxcc10vLE89L1xccy9nO3QuZGVmYXVsdD17bWFzazpvLHBpcGU6ZC5kZWZhdWx0fX0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKGUsdCl7dmFyIG49dC5jdXJyZW50Q2FyZXRQb3NpdGlvbixpPXQucmF3VmFsdWUsZj10LnByZXZpb3VzQ29uZm9ybWVkVmFsdWUscD10LnBsYWNlaG9sZGVyQ2hhcix2PWU7dj1yKHYpO3ZhciB5PXYuaW5kZXhPZihjKSxoPW51bGw9PT1pLm1hdGNoKG5ldyBSZWdFeHAoXCJbXkBcXFxccy5cIitwK1wiXVwiKSk7aWYoaClyZXR1cm4gdTtpZih2LmluZGV4T2YoYSkhPT0tMXx8eSE9PS0xJiZuIT09eSsxfHxpLmluZGV4T2Yobyk9PT0tMSYmZiE9PXUmJmkuaW5kZXhPZihsKSE9PS0xKXJldHVybiExO3ZhciBnPXYuaW5kZXhPZihvKSxtPXYuc2xpY2UoZysxLHYubGVuZ3RoKTtyZXR1cm4obS5tYXRjaChkKXx8cykubGVuZ3RoPjEmJnYuc3Vic3RyKC0xKT09PWwmJm4hPT1pLmxlbmd0aCYmKHY9di5zbGljZSgwLHYubGVuZ3RoLTEpKSx2fWZ1bmN0aW9uIHIoZSl7dmFyIHQ9MDtyZXR1cm4gZS5yZXBsYWNlKGksZnVuY3Rpb24oKXtyZXR1cm4gdCsrLDE9PT10P286dX0pfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuZGVmYXVsdD1uO3ZhciBvPVwiQFwiLGk9L0AvZyx1PVwiXCIsYz1cIkAuXCIsbD1cIi5cIixhPVwiLi5cIixzPVtdLGQ9L1xcLi9nfV0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdmRHVjRkQzF0WVhOckxXRmtaRzl1Y3k5a2FYTjBMM1JsZUhSTllYTnJRV1JrYjI1ekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHRkZlE9PSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICByZWQ6ICcjY2M0ODIwJyxcbiAgZ3JlZW46ICcjNzJjMzIyJyxcbiAgb3JhbmdlOiAnI2ZmOWMwMCcsXG4gIGJsYWNrOiAnIzE4MTgxOCcsXG4gIGdyZXlfZGFyazogJyM1ZTVlNWUnLFxuICBncmV5OiAnIzkwOTA5MCcsXG4gIGdyZXlfc2VtaV9saWdodDogJyNiZWJlYmUnLFxuICBncmV5X2xpZ2h0OiAnI2QzZDNkMycsXG4gIGdyZXlfbGlnaHQyOiAnI2RkZGRkZCcsXG4gIGdyZXlfbGlnaHQzOiAnI2YyZjVmNycsXG4gIGdyZXlfbGlnaHQ0OiAnI2U1ZTVlNSdcbn07XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUpqYjI1emRHRnVkSE12WTI5c2IzSnpMbU52Wm1abFpTSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJYWDA9IiwidmFyIFN0YXRlQ2hhaW47XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGVDaGFpbiA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gU3RhdGVDaGFpbihzdGF0ZXMpIHtcbiAgICB0aGlzLnN0cmluZyA9IHN0YXRlcy5qb2luKCcrJyk7XG4gICAgdGhpcy5hcnJheSA9IHN0YXRlcy5zbGljZSgpO1xuICAgIHRoaXMubGVuZ3RoID0gc3RhdGVzLmxlbmd0aDtcbiAgfVxuXG4gIFN0YXRlQ2hhaW4ucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgdmFyIGksIGxlbiwgcmVmLCBzdGF0ZTtcbiAgICByZWYgPSB0aGlzLmFycmF5O1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc3RhdGUgPSByZWZbaV07XG4gICAgICBpZiAoc3RhdGUgPT09IHRhcmdldCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIFN0YXRlQ2hhaW4ucHJvdG90eXBlLndpdGhvdXQgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5hcnJheS5maWx0ZXIoZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZSAhPT0gdGFyZ2V0O1xuICAgIH0pLmpvaW4oJysnKTtcbiAgfTtcblxuICBTdGF0ZUNoYWluLnByb3RvdHlwZS5pc0FwcGxpY2FibGUgPSBmdW5jdGlvbih0YXJnZXQsIG90aGVyQWN0aXZlKSB7XG4gICAgdmFyIGFjdGl2ZTtcbiAgICBhY3RpdmUgPSB0aGlzLmFycmF5LmZpbHRlcihmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgcmV0dXJuIHN0YXRlID09PSB0YXJnZXQgfHwgb3RoZXJBY3RpdmUuaW5kZXhPZihzdGF0ZSkgIT09IC0xO1xuICAgIH0pO1xuICAgIHJldHVybiBhY3RpdmUubGVuZ3RoID09PSB0aGlzLmFycmF5Lmxlbmd0aDtcbiAgfTtcblxuICByZXR1cm4gU3RhdGVDaGFpbjtcblxufSkoKTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdmNYVnBZMnRrYjIwdmMzSmpMM0JoY25SekwyVnNaVzFsYm5RdmMzUmhkR1ZEYUdGcGJpNWpiMlptWldVaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNlcxMTkiLCJleHBvcnRzLmNoZWNrbWFyayA9IGltcG9ydCAnLi9jaGVja21hcmsnXG5leHBvcnRzLmFuZ2xlRG93biA9IGltcG9ydCAnLi9hbmdsZURvd24nXG5leHBvcnRzLmNhcmV0VXAgPSBpbXBvcnQgJy4vY2FyZXRVcCdcbmV4cG9ydHMuY2FyZXREb3duID0gaW1wb3J0ICcuL2NhcmV0RG93bidcbmV4cG9ydHMucGx1cyA9IGltcG9ydCAnLi9wbHVzJ1xuZXhwb3J0cy5jbG9uZSA9IGltcG9ydCAnLi9jbG9uZSdcbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NLnRlbXBsYXRlKFxuXHRbJypzdmcnXG5cdFx0YXR0cnM6XG5cdFx0XHR3aWR0aDogJzEycHgnXG5cdFx0XHRoZWlnaHQ6ICcxMnB4J1xuXHRcdFx0dmlld0JveDogJzUgNyAxMiAxMidcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICc5cHgnXG5cdFx0XHRoZWlnaHQ6ICc5cHgnXG5cblxuXHRcdFsnKnBvbHlsaW5lJywge1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAnMidcblx0XHRcdFx0J3N0cm9rZS1saW5lY2FwJzogJ3JvdW5kJ1xuXHRcdFx0XHQnc3Ryb2tlLWxpbmVqb2luJzogJ3JvdW5kJ1xuXHRcdFx0XHRmaWxsOiAnbm9uZSdcblx0XHRcdFx0cG9pbnRzOiAnNyAxMy44ODg4ODg5IDkuNjY2NjY2NjcgMTcgMTUgOSdcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHR9XVxuXHRdXG4pXG5cblxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHdpZHRoOiAnMTc5MnB4J1xuXHRcdFx0aGVpZ2h0OiAnMTc5MnB4J1xuXHRcdFx0dmlld0JveDogJzAgMCAxNzkyIDE3OTInXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBhdGgnXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0ZDogJ00xMzk1IDczNnEwIDEzLTEwIDIzbC00NjYgNDY2cS0xMCAxMC0yMyAxMHQtMjMtMTBsLTQ2Ni00NjZxLTEwLTEwLTEwLTIzdDEwLTIzbDUwLTUwcTEwLTEwIDIzLTEwdDIzIDEwbDM5MyAzOTMgMzkzLTM5M3ExMC0xMCAyMy0xMHQyMyAxMGw1MCA1MHExMCAxMCAxMCAyM3onXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHZpZXdCb3g6ICcwIDAgNTEyIDUxMidcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTQwMiAzNDdjMCA1LTIgMTAtNSAxMy00IDQtOCA2LTEzIDZoLTI1NmMtNSAwLTktMi0xMy02LTMtMy01LTgtNS0xM3MyLTkgNS0xMmwxMjgtMTI4YzQtNCA4LTYgMTMtNnM5IDIgMTMgNmwxMjggMTI4YzMgMyA1IDcgNSAxMnonXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0dmlld0JveDogJzAgMCA1MTIgNTEyJ1xuXHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJ1xuXHRcdFx0b3V0bGluZTogJ25vbmUnXG5cblx0XHRbJypwYXRoJ1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0XHRcdGQ6ICdNNDAyIDIwMWMwIDUtMiA5LTUgMTNsLTEyOCAxMjhjLTQgNC04IDUtMTMgNXMtOS0xLTEzLTVsLTEyOC0xMjhjLTMtNC01LTgtNS0xM3MyLTkgNS0xM2M0LTMgOC01IDEzLTVoMjU2YzUgMCA5IDIgMTMgNSAzIDQgNSA4IDUgMTN6J1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NLnRlbXBsYXRlKFxuXHRbJypzdmcnXG5cdFx0YXR0cnM6XG5cdFx0XHR2aWV3Qm94OiAnMCAwIDE1IDE1J1xuXHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJ1xuXHRcdFx0b3V0bGluZTogJ25vbmUnXG5cblx0XHRbJypwb2x5Z29uJ1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0XHRcdHBvaW50czogJzkgMCA2IDAgNiA2IDAgNiAwIDkgNiA5IDYgMTUgOSAxNSA5IDkgMTUgOSAxNSA2IDkgNidcblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NLnRlbXBsYXRlKFxuXHRbJypzdmcnXG5cdFx0YXR0cnM6XG5cdFx0XHR2aWV3Qm94OiAnMCAwIDE4IDIwJ1xuXHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJ1xuXHRcdFx0b3V0bGluZTogJ25vbmUnXG5cblx0XHRbJypwYXRoJ1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0XHRcdGQ6ICdNMTMuNDE0LDAgTDYsMCBDNC44OTcsMCA0LDAuODk4IDQsMiBMNCwxNCBDNCwxNS4xMDMgNC44OTcsMTYgNiwxNiBMMTYsMTYgQzE3LjEwMywxNiAxOCwxNS4xMDMgMTgsMTQgTDE4LDQuNTg2IEwxMy40MTQsMCBaIE0xNi4wMDEsMTQgTDYsMTQgTDYsMiBMMTIsMiBMMTIsNiBMMTYsNiBMMTYuMDAxLDE0IFonXG5cdFx0XVxuXHRcdFxuXHRcdFsnKnBhdGgnXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0ZDogJ00yLDYuNDIzNzkyODIgTDAsNi40MjM3OTI4MiBMMCwxOCBDMCwxOS4xMDMgMC44OTcsMjAgMiwyMCBMMTQsMjAgTDE0LDE4IEwyLDE4IEwyLDYuNDIzNzkyODIgWidcblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG5cbiJdfQ==