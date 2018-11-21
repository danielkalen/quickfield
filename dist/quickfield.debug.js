(function (require, global) {
require = (function (cache, modules, cx) {
var loader = function (r) {
if (!modules[r]) throw new Error(r + ' is not a module');
return cache[r] ? cache[r].exports : ((cache[r] = {
exports: {}
}, cache[r].exports = modules[r].call(cx, require, cache[r], cache[r].exports)));
};
loader.modules = modules;
return loader;
})({}, {
0: function (require, module, exports) {
var DOM, IS, QuickField, REQUIRED_FIELD_METHODS, extend, helpers, newBuilder, registerAnimations;
helpers = require(1);
DOM = require(2);
IS = require(3);
extend = require(4);
registerAnimations = require(5);
REQUIRED_FIELD_METHODS = require(6);
if (this.console == null) {
this.console = {};
}
if (console.log == null) {
console.log = function () {};
}
if (console.warn == null) {
console.warn = console.log;
}
;
newBuilder = function (settingOverrides, templateOverrides) {
var Field, builder;
builder = function (settings) {
if (arguments.length > 1) {
settings = extend.clone.apply(extend, arguments);
}
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
builder.register = function (type, targetField) {
var i, len, requiredMethod;
if (!IS.string(type) || !IS["function"](targetField)) {
throw new Error("QuickField Registration: invalid arguments");
}
for ((i = 0, len = REQUIRED_FIELD_METHODS.length); i < len; i++) {
requiredMethod = REQUIRED_FIELD_METHODS[i];
if (!targetField.prototype[requiredMethod]) {
throw new Error("QuickField Registration: '" + requiredMethod + "' method is required in order to register the field");
}
}
Field[type] = targetField;
return this;
};
builder.config = function (newSettings, newTemplates) {
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
get: function () {
return extend.clone.own.notKeys('instances')(Field);
}
});
builder.settingOverrides = settingOverrides;
builder.templateOverrides = templateOverrides;
builder.version = "1.0.81";
builder.Field = Field = require(9);
return builder;
};
QuickField = newBuilder();
QuickField.register('text', require(10));
module.exports = QuickField;
return module.exports;
},
1: function (require, module, exports) {
var DOM, IS, SimplyBind, helpers, regex;
IS = require(3);
DOM = require(2);
SimplyBind = require(11);
regex = require(12);
helpers = exports;
helpers.noop = function () {};
helpers.includes = function (target, item) {
return target && target.indexOf(item) !== -1;
};
helpers.repeat = function (string, count) {
var i;
return ((function () {
var j, ref, results1;
results1 = [];
for ((i = j = 1, ref = count); 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
results1.push(string);
}
return results1;
})()).join('');
};
helpers.removeItem = function (target, item) {
var itemIndex;
itemIndex = target.indexOf(item);
if (itemIndex !== -1) {
return target.splice(itemIndex, 1);
}
};
helpers.insertAfter = function (target, item, newItem) {
var itemIndex;
itemIndex = target.indexOf(item);
if (itemIndex !== -1) {
return target.splice(itemIndex, 0, newItem);
}
};
helpers.find = function (target, fn) {
var results;
results = target.filter(fn);
return results[0];
};
helpers.diff = function (source, comparee) {
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
helpers.hexToRGBA = function (hex, alpha) {
var B, G, R;
if (hex[0] === '#') {
hex = hex.slice(1);
}
R = parseInt(hex.slice(0, 2), 16);
G = parseInt(hex.slice(2, 4), 16);
B = parseInt(hex.slice(4, 6), 16);
return "rgba(" + R + ", " + G + ", " + B + ", " + alpha + ")";
};
helpers.defaultColor = function (color, defaultColor) {
if (color === 'transparent' || !color) {
return defaultColor;
} else {
return color;
}
};
helpers.calcPadding = function (desiredHeight, fontSize) {
return Math.ceil((desiredHeight - fontSize * 1.231) / 2);
};
helpers.unlockScroll = function (excludedEl) {
window._isLocked = false;
return DOM(window).off('wheel.lock');
};
helpers.lockScroll = function (excludedEl) {
if (!window._isLocked) {
window._isLocked = true;
return DOM(window).on('wheel.lock', function (event) {
if (event.target === excludedEl.raw || DOM(event.target).parentMatching(function (parent) {
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
helpers.fuzzyMatch = function (needle, haystack, caseSensitive) {
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
helpers.startsWith = function (needle, haystack, caseSensitive) {
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
helpers.getIndexOfFirstDiff = function (sourceString, compareString) {
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
helpers.parseCssShorthandValue = function (string) {
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
helpers.shorthandSideValue = function (value, side) {
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
helpers.updateShorthandValue = function (value, side, newValue) {
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
Object.keys(values).forEach(function (side) {
return values[side] += newValue;
});
}
return values.top + "px " + values.right + "px " + values.bottom + "px " + values.left + "px";
};
return module.exports;
},
2: function (require, module, exports) {
var QuickDom, svgNamespace;
svgNamespace = 'http://www.w3.org/2000/svg';
var CSS = require(13);
var extend = require(4);
var allowedOptions, allowedTemplateOptions;
allowedTemplateOptions = ['id', 'name', 'type', 'href', 'selected', 'checked', 'className'];
allowedOptions = ['id', 'ref', 'type', 'name', 'text', 'style', 'class', 'className', 'url', 'href', 'selected', 'checked', 'props', 'attrs', 'passStateToChildren', 'stateTriggers'];
;
var helpers, styleCache;
helpers = {};
helpers.includes = function (target, item) {
return target && target.indexOf(item) !== -1;
};
helpers.removeItem = function (target, item) {
var itemIndex;
itemIndex = target.indexOf(item);
if (itemIndex !== -1) {
target.splice(itemIndex, 1);
}
return target;
};
helpers.normalizeGivenEl = function (targetEl) {
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
helpers.isStateStyle = function (string) {
return string[0] === '$' || string[0] === '@';
};
helpers.registerStyle = function (rule, level, important) {
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
for ((i = 0, len = props.length); i < len; i++) {
prop = props[i];
if (typeof rule[prop] === 'function') {
output.fns.push([prop, rule[prop]]);
}
}
return styleCache.set(rule, output, level);
};
styleCache = new ((function () {
function _Class() {
this.keys = Object.create(null);
this.values = Object.create(null);
}
_Class.prototype.get = function (key, level) {
var index;
if (this.keys[level]) {
index = this.keys[level].indexOf(key);
if (index !== -1) {
return this.values[level][index];
}
}
};
_Class.prototype.set = function (key, value, level) {
if (!this.keys[level]) {
this.keys[level] = [];
this.values[level] = [];
}
this.keys[level].push(key);
this.values[level].push(value);
return value;
};
return _Class;
})())();
;
var IS;
IS = require(24);
IS = IS.create('natives', 'dom');
IS.load({
quickDomEl: function (subject) {
return subject && subject.constructor.name === QuickElement.name;
},
template: function (subject) {
return subject && subject.constructor.name === QuickTemplate.name;
}
});
;
var QuickElement;
QuickElement = (function () {
function QuickElement(type, options) {
this.type = type;
this.options = options;
if (this.type[0] === '*') {
this.svg = true;
}
this.el = this.options.existing || (this.type === 'text' ? document.createTextNode(typeof this.options.text === 'string' ? this.options.text : '') : this.svg ? document.createElementNS(svgNamespace, this.type.slice(1)) : document.createElement(this.type));
if (this.type === 'text') {
this.append = this.prepend = this.attr = function () {};
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
QuickElement.prototype.toJSON = function () {
var child, children, i, len, output;
output = [this.type, extend.clone.keys(allowedOptions)(this.options)];
children = this.children;
for ((i = 0, len = children.length); i < len; i++) {
child = children[i];
output.push(child.toJSON());
}
return output;
};
return QuickElement;
})();
if (QuickElement.name == null) {
QuickElement.name = 'QuickElement';
}
Object.defineProperties(QuickElement.prototype, {
'raw': {
get: function () {
return this.el;
}
},
'0': {
get: function () {
return this.el;
}
},
'css': {
get: function () {
return this.style;
}
},
'replaceWith': {
get: function () {
return this.replace;
}
},
'removeListener': {
get: function () {
return this.off;
}
}
});
;
var _filterElements, _getChildRefs, _getIndexByProp, _getParents;
QuickElement.prototype.parentsUntil = function (filter) {
return _getParents(this, filter);
};
QuickElement.prototype.parentMatching = function (filter) {
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
QuickElement.prototype.query = function (selector) {
return QuickDom(this.raw.querySelector(selector));
};
QuickElement.prototype.queryAll = function (selector) {
var i, item, len, output, result;
result = this.raw.querySelectorAll(selector);
output = [];
for ((i = 0, len = result.length); i < len; i++) {
item = result[i];
output.push(item);
}
return new QuickBatch(output);
};
Object.defineProperties(QuickElement.prototype, {
'children': {
get: function () {
var child, i, len, ref1;
if (this.el.childNodes.length !== this._children.length) {
this._children.length = 0;
ref1 = this.el.childNodes;
for ((i = 0, len = ref1.length); i < len; i++) {
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
get: function () {
return _filterElements(this.children);
}
},
'parent': {
get: function () {
if ((!this._parent || this._parent.el !== this.el.parentNode) && !IS.domDoc(this.el.parentNode)) {
this._parent = QuickDom(this.el.parentNode);
}
return this._parent;
}
},
'parents': {
get: function () {
return _getParents(this);
}
},
'next': {
get: function () {
return QuickDom(this.el.nextSibling);
}
},
'nextEl': {
get: function () {
return QuickDom(this.el.nextElementSibling);
}
},
'nextElAll': {
get: function () {
return _filterElements(this.nextAll);
}
},
'nextAll': {
get: function () {
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
get: function () {
return QuickDom(this.el.previousSibling);
}
},
'prevEl': {
get: function () {
return QuickDom(this.el.previousElementSibling);
}
},
'prevElAll': {
get: function () {
return _filterElements(this.prevAll);
}
},
'prevAll': {
get: function () {
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
get: function () {
return this.prevAll.reverse().concat(this.nextAll);
}
},
'elementSiblings': {
get: function () {
return _filterElements(this.siblings);
}
},
'child': {
get: function () {
return this._childRefs || _getChildRefs(this);
}
},
'childf': {
get: function () {
return _getChildRefs(this, true);
}
},
'firstChild': {
get: function () {
return this.children[0];
}
},
'lastChild': {
get: function () {
var children;
children = this.children;
return children[children.length - 1];
}
},
'index': {
get: function () {
var parent;
if (!(parent = this.parent)) {
return null;
} else {
return parent.children.indexOf(this);
}
}
},
'indexType': {
get: function () {
return _getIndexByProp(this, 'type');
}
},
'indexRef': {
get: function () {
return _getIndexByProp(this, 'ref');
}
}
});
_getParents = function (targetEl, filter) {
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
_getChildRefs = function (target, freshCopy) {
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
for ((i = 0, len = children.length); i < len; i++) {
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
_getIndexByProp = function (main, prop) {
var parent;
if (!(parent = main.parent)) {
return null;
} else {
return parent.children.filter(function (child) {
return child[prop] === main[prop];
}).indexOf(main);
}
};
_filterElements = function (array) {
var i, item, len, output;
if (!array.length) {
return array;
} else {
output = [];
for ((i = 0, len = array.length); i < len; i++) {
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
QuickElement.prototype._normalizeOptions = function () {
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
QuickElement.prototype._parseStyles = function (styles, store) {
var _mediaStates, _providedStates, _providedStatesShared, _stateShared, _styles, base, flattenNestedStates, forceStyle, i, keys, len, specialStates, state, stateStyles, state_, states;
if (!IS.objectPlain(styles)) {
return;
}
keys = Object.keys(styles);
states = keys.filter(function (key) {
return helpers.isStateStyle(key);
});
specialStates = helpers.removeItem(states.slice(), '$base');
_mediaStates = states.filter(function (key) {
return key[0] === '@';
}).map(function (state) {
return state.slice(1);
});
_providedStates = states.map(function (state) {
return state.slice(1);
});
_styles = store || ({});
_stateShared = _providedStatesShared = void 0;
base = !helpers.includes(states, '$base') ? styles : styles.$base;
_styles.base = helpers.registerStyle(base, 0, forceStyle = this.options.forceStyle);
if (specialStates.length) {
flattenNestedStates = function (styleObject, chain, level) {
var hasNonStateProps, i, len, output, state, stateChain, state_, styleKeys;
styleKeys = Object.keys(styleObject);
output = {};
hasNonStateProps = false;
for ((i = 0, len = styleKeys.length); i < len; i++) {
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
for ((i = 0, len = specialStates.length); i < len; i++) {
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
QuickElement.prototype._parseTexts = function (texts, store) {
var _providedStates, _texts, i, len, state, states;
if (!IS.objectPlain(texts)) {
return;
}
states = Object.keys(texts).map(function (state) {
return state.slice(1);
});
_providedStates = states.filter(function (state) {
return state !== 'base';
});
_texts = store || ({});
_texts = {
base: ''
};
for ((i = 0, len = states.length); i < len; i++) {
state = states[i];
_texts[state] = texts['$' + state];
}
return {
_texts: _texts,
_providedStates: _providedStates
};
};
QuickElement.prototype._applyOptions = function () {
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
this.on('inserted', function () {
var _, mediaStates;
if (this.options.styleAfterInsert) {
this.recalcStyle();
}
_ = this._inserted = this;
if ((mediaStates = this._mediaStates) && this._mediaStates.length) {
return this._mediaStates = new (function () {
var i, len, queryString;
for ((i = 0, len = mediaStates.length); i < len; i++) {
queryString = mediaStates[i];
this[queryString] = MediaQuery.register(_, queryString);
}
return this;
})();
}
}, false, true);
if (this.options.recalcOnResize) {
window.addEventListener('resize', (function (_this) {
return function () {
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
QuickElement.prototype._attachStateEvents = function (force) {
var fn, ref1, state, trigger;
ref1 = this.options.stateTriggers;
fn = (function (_this) {
return function (state, trigger) {
var disabler, enabler;
if (!helpers.includes(_this._providedStates, state) && !force && !trigger.force) {
return;
}
enabler = IS.string(trigger) ? trigger : trigger.on;
if (IS.object(trigger)) {
disabler = trigger.off;
}
_this._listenTo(enabler, function () {
return _this.state(state, true, trigger.bubbles);
});
if (disabler) {
return _this._listenTo(disabler, function () {
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
QuickElement.prototype._proxyParent = function () {
var parent;
parent = void 0;
return Object.defineProperty(this, '_parent', {
get: function () {
return parent;
},
set: function (newParent) {
var lastParent;
if (parent = newParent) {
lastParent = this.parents.slice(-1)[0];
if (lastParent.raw === document.documentElement) {
this._unproxyParent(newParent);
} else {
parent.on('inserted', (function (_this) {
return function () {
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
QuickElement.prototype._unproxyParent = function (newParent) {
delete this._parent;
this._parent = newParent;
this.emitPrivate('inserted', newParent);
};
;
var regexWhitespace;
regexWhitespace = /\s+/;
QuickElement.prototype.on = function (eventNames, callback, useCapture, isPrivate) {
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
eventNames.split(regexWhitespace).forEach((function (_this) {
return function (eventName) {
if (!_this._eventCallbacks[eventName]) {
_this._eventCallbacks[eventName] = [];
if (!isPrivate) {
_this._listenTo(eventName, function (event) {
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
QuickElement.prototype.once = function (eventNames, callback) {
var onceCallback;
if (IS.string(eventNames) && IS["function"](callback)) {
this.on(eventNames, onceCallback = (function (_this) {
return function (event) {
_this.off(eventNames, onceCallback);
return callback.call(_this, event);
};
})(this));
}
return this;
};
QuickElement.prototype.off = function (eventNames, callback) {
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
eventNames.split(regexWhitespace).forEach((function (_this) {
return function (eventName) {
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
QuickElement.prototype.emit = function (eventName, bubbles, cancelable, data) {
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
QuickElement.prototype.emitPrivate = function (eventName, arg) {
var ref;
if (eventName && IS.string(eventName) && ((ref = this._eventCallbacks) != null ? ref[eventName] : void 0)) {
this._invokeHandlers(eventName, arg);
}
return this;
};
QuickElement.prototype._invokeHandlers = function (eventName, arg) {
var callbacks, cb, i, len;
callbacks = this._eventCallbacks[eventName].slice();
for ((i = 0, len = callbacks.length); i < len; i++) {
cb = callbacks[i];
cb.call(this, arg);
}
};
QuickElement.prototype._listenTo = function (eventName, callback, useCapture) {
var eventNameToListenFor, listenMethod;
listenMethod = this.el.addEventListener ? 'addEventListener' : 'attachEvent';
eventNameToListenFor = this.el.addEventListener ? eventName : "on" + eventName;
this.el[listenMethod](eventNameToListenFor, callback, useCapture);
return this;
};
;
var DUMMY_ARRAY;
DUMMY_ARRAY = [];
QuickElement.prototype.state = function (targetState, value, bubbles, source) {
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
for ((j = 0, len = ref.length); j < len; j++) {
child = ref[j];
child.state(targetState, value, false, source || this);
}
}
}
return this;
}
};
QuickElement.prototype.toggleState = function (targetState) {
return this.state(targetState, !this.state(targetState));
};
QuickElement.prototype.resetState = function () {
var activeState, j, len, ref;
ref = this._state.slice();
for ((j = 0, len = ref.length); j < len; j++) {
activeState = ref[j];
this.state(activeState, false);
}
return this;
};
QuickElement.prototype.pipeState = function (targetEl) {
var activeState, j, len, ref;
if (targetEl) {
targetEl = helpers.normalizeGivenEl(targetEl);
if (IS.quickDomEl(targetEl) && targetEl !== this) {
this._statePipeTarget = targetEl;
ref = this._state;
for ((j = 0, len = ref.length); j < len; j++) {
activeState = ref[j];
targetEl.state(activeState, true);
}
}
} else if (targetEl === false) {
delete this._statePipeTarget;
}
return this;
};
QuickElement.prototype._applyRegisteredStyle = function (targetStyle, superiorStates, includeBase, skipFns) {
var className, entry, j, k, len, len1, ref, ref1, superiorStyles;
if (targetStyle) {
ref = targetStyle.className;
for ((j = 0, len = ref.length); j < len; j++) {
className = ref[j];
this.addClass(className);
}
if (targetStyle.fns.length && !skipFns) {
if (superiorStates) {
superiorStyles = this._resolveFnStyles(superiorStates, includeBase);
}
ref1 = targetStyle.fns;
for ((k = 0, len1 = ref1.length); k < len1; k++) {
entry = ref1[k];
if (!(superiorStyles && superiorStyles[entry[0]])) {
this.style(entry[0], entry[1]);
}
}
}
}
};
QuickElement.prototype._removeRegisteredStyle = function (targetStyle, superiorStates, includeBase) {
var className, entry, j, k, len, len1, ref, ref1, resetValue, superiorStyles;
ref = targetStyle.className;
for ((j = 0, len = ref.length); j < len; j++) {
className = ref[j];
this.removeClass(className);
}
if (targetStyle.fns.length) {
if (superiorStates) {
superiorStyles = this._resolveFnStyles(superiorStates, includeBase);
}
ref1 = targetStyle.fns;
for ((k = 0, len1 = ref1.length); k < len1; k++) {
entry = ref1[k];
resetValue = superiorStyles && superiorStyles[entry[0]] || null;
this.style(entry[0], resetValue);
}
}
};
QuickElement.prototype._turnStyleON = function (targetState, activeStates) {
var j, len, sharedStates, skipFns, stateChain;
skipFns = this.options.styleAfterInsert && !this._inserted;
if (this._styles[targetState]) {
this._applyRegisteredStyle(this._styles[targetState], this._getSuperiorStates(targetState, activeStates), false, skipFns);
}
if (this._providedStatesShared) {
sharedStates = this._getSharedStates(targetState);
for ((j = 0, len = sharedStates.length); j < len; j++) {
stateChain = sharedStates[j];
if (!helpers.includes(this._stateShared, stateChain.string)) {
this._stateShared.push(stateChain.string);
}
this._applyRegisteredStyle(this._styles[stateChain.string], null, null, skipFns);
}
}
};
QuickElement.prototype._turnStyleOFF = function (targetState, activeStates) {
var activeSharedStates, j, len, sharedStates, stateChain, targetStyle;
if (this._styles[targetState]) {
this._removeRegisteredStyle(this._styles[targetState], activeStates, true);
}
if (this._providedStatesShared) {
sharedStates = this._getSharedStates(targetState);
if (sharedStates.length === 0) {
return;
}
for ((j = 0, len = sharedStates.length); j < len; j++) {
stateChain = sharedStates[j];
helpers.removeItem(this._stateShared, stateChain.string);
targetStyle = this._styles[stateChain.string];
if (targetStyle.fns.length && this._stateShared.length && !activeSharedStates) {
activeSharedStates = this._stateShared.filter(function (state) {
return !helpers.includes(state, targetState);
});
activeStates = activeStates.concat(activeSharedStates);
}
this._removeRegisteredStyle(targetStyle, activeStates, true);
}
}
};
QuickElement.prototype._turnTextON = function (targetState, activeStates) {
var superiorStates, targetText;
if (this._texts && IS.string(targetText = this._texts[targetState])) {
superiorStates = this._getSuperiorStates(targetState, activeStates);
if (!superiorStates.length) {
this.text = targetText;
}
}
};
QuickElement.prototype._turnTextOFF = function (targetState, activeStates) {
var targetText;
if (this._texts && IS.string(targetText = this._texts[targetState])) {
activeStates = activeStates.filter(function (state) {
return state !== targetState;
});
targetText = this._texts[activeStates[activeStates.length - 1]];
if (targetText == null) {
targetText = this._texts.base;
}
this.text = targetText;
}
};
QuickElement.prototype._getActiveStates = function (stateToExclude, includeSharedStates) {
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
for ((j = 0, len = activeStates.length); j < len; j++) {
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
QuickElement.prototype._getSuperiorStates = function (targetState, activeStates) {
var candidate, j, len, superior, targetStateIndex;
targetStateIndex = this._providedStates.indexOf(targetState);
if (targetStateIndex === this._providedStates.length - 1) {
return DUMMY_ARRAY;
}
superior = [];
for ((j = 0, len = activeStates.length); j < len; j++) {
candidate = activeStates[j];
if (this._providedStates.indexOf(candidate) > targetStateIndex) {
superior.push(candidate);
}
}
return superior;
};
QuickElement.prototype._getSharedStates = function (targetState) {
var activeStates, j, len, ref, sharedStates, stateChain;
activeStates = this._state;
sharedStates = [];
ref = this._providedStatesShared;
for ((j = 0, len = ref.length); j < len; j++) {
stateChain = ref[j];
if (stateChain.includes(targetState) && stateChain.isApplicable(targetState, activeStates)) {
sharedStates.push(stateChain);
}
}
return sharedStates;
};
QuickElement.prototype._resolveFnStyles = function (states, includeBase) {
var entry, j, k, len, len1, output, ref, state;
if (includeBase) {
states = ['base'].concat(states);
}
output = {};
for ((j = 0, len = states.length); j < len; j++) {
state = states[j];
if (this._styles[state] && this._styles[state].fns.length) {
ref = this._styles[state].fns;
for ((k = 0, len1 = ref.length); k < len1; k++) {
entry = ref[k];
output[entry[0]] = entry[1];
}
}
}
return output;
};
;
var aspectRatioGetter, orientationGetter;
QuickElement.prototype.style = function (property) {
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
QuickElement.prototype.styleSafe = function (property, skipComputed) {
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
QuickElement.prototype.styleParsed = function (property, skipComputed) {
return parseFloat(this.styleSafe(property, skipComputed));
};
QuickElement.prototype.recalcStyle = function (recalcChildren) {
var child, j, len, ref, targetStyles;
targetStyles = this._resolveFnStyles(this._getActiveStates(), true);
this.style(targetStyles);
if (recalcChildren) {
ref = this._children;
for ((j = 0, len = ref.length); j < len; j++) {
child = ref[j];
child.recalcStyle();
}
}
return this;
};
QuickElement.prototype.currentStateStyle = function (property) {
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
QuickElement.prototype.hide = function () {
return this.style('display', 'none');
};
QuickElement.prototype.show = function (display) {
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
get: function () {
if (this.width > this.height) {
return 'landscape';
} else {
return 'portrait';
}
}
},
'aspectRatio': aspectRatioGetter = {
get: function () {
return this.width / this.height;
}
},
'rect': {
get: function () {
return this.el.getBoundingClientRect();
}
},
'width': {
get: function () {
return parseFloat(this.style('width'));
},
set: function (value) {
return this.style('width', value);
}
},
'height': {
get: function () {
return parseFloat(this.style('height'));
},
set: function (value) {
return this.style('height', value);
}
}
});
;
QuickElement.prototype.attr = function (attrName, newValue) {
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
QuickElement.prototype.prop = function (propName, newValue) {
switch (newValue) {
case void 0:
return this.el[propName];
default:
this.el[propName] = newValue;
return this;
}
};
;
QuickElement.prototype.toTemplate = function () {
return QuickDom.template(this);
};
QuickElement.prototype.clone = function () {
var activeState, callback, callbacks, child, elClone, eventName, i, j, k, len, len1, len2, newEl, options, ref, ref1, ref2;
elClone = this.el.cloneNode(false);
options = extend.clone(this.options, {
existing: elClone
});
newEl = new QuickElement(this.type, options);
ref = this._state;
for ((i = 0, len = ref.length); i < len; i++) {
activeState = ref[i];
newEl.state(activeState, true);
}
ref1 = this.children;
for ((j = 0, len1 = ref1.length); j < len1; j++) {
child = ref1[j];
newEl.append(child.clone());
}
ref2 = this._eventCallbacks;
for (eventName in ref2) {
callbacks = ref2[eventName];
for ((k = 0, len2 = callbacks.length); k < len2; k++) {
callback = callbacks[k];
newEl.on(eventName, callback);
}
}
return newEl;
};
QuickElement.prototype.append = function (targetEl) {
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
QuickElement.prototype.appendTo = function (targetEl) {
if (targetEl) {
targetEl = helpers.normalizeGivenEl(targetEl);
if (IS.quickDomEl(targetEl)) {
targetEl.append(this);
}
}
return this;
};
QuickElement.prototype.prepend = function (targetEl) {
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
QuickElement.prototype.prependTo = function (targetEl) {
if (targetEl) {
targetEl = helpers.normalizeGivenEl(targetEl);
if (IS.quickDomEl(targetEl)) {
targetEl.prepend(this);
}
}
return this;
};
QuickElement.prototype.after = function (targetEl) {
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
QuickElement.prototype.insertAfter = function (targetEl) {
if (targetEl) {
targetEl = helpers.normalizeGivenEl(targetEl);
if (IS.quickDomEl(targetEl)) {
targetEl.after(this);
}
}
return this;
};
QuickElement.prototype.before = function (targetEl) {
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
QuickElement.prototype.insertBefore = function (targetEl) {
if (targetEl) {
targetEl = helpers.normalizeGivenEl(targetEl);
if (IS.quickDomEl(targetEl)) {
targetEl.before(this);
}
}
return this;
};
QuickElement.prototype.detach = function () {
var ref;
if ((ref = this.parent) != null) {
ref._removeChild(this);
}
return this;
};
QuickElement.prototype.remove = function () {
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
QuickElement.prototype.empty = function () {
var child, i, len, ref;
ref = this.children.slice();
for ((i = 0, len = ref.length); i < len; i++) {
child = ref[i];
this._removeChild(child);
}
return this;
};
QuickElement.prototype.wrap = function (targetEl) {
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
QuickElement.prototype.unwrap = function () {
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
QuickElement.prototype.replace = function (targetEl) {
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
QuickElement.prototype.hasClass = function (target) {
return helpers.includes(this.classList, target);
};
QuickElement.prototype.addClass = function (target) {
var classList, targetIndex;
classList = this.classList;
targetIndex = classList.indexOf(target);
if (targetIndex === -1) {
classList.push(target);
this.className = classList.length > 1 ? classList.join(' ') : classList[0];
}
return this;
};
QuickElement.prototype.removeClass = function (target) {
var classList, targetIndex;
classList = this.classList;
targetIndex = classList.indexOf(target);
if (targetIndex !== -1) {
classList.splice(targetIndex, 1);
this.className = classList.length ? classList.join(' ') : '';
}
return this;
};
QuickElement.prototype.toggleClass = function (target) {
if (this.hasClass(target)) {
this.removeClass(target);
} else {
this.addClass(target);
}
return this;
};
QuickElement.prototype._refreshParent = function () {
return this.parent;
};
QuickElement.prototype._removeChild = function (targetChild, replacementChild) {
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
get: function () {
return this.el.innerHTML;
},
set: function (newValue) {
return this.el.innerHTML = newValue;
}
},
'text': {
get: function () {
return this.el.textContent;
},
set: function (newValue) {
return this.el.textContent = newValue;
}
},
'className': {
get: function () {
if (this.svg) {
return this.attr('class') || '';
} else {
return this.raw.className;
}
},
set: function (newValue) {
if (this.svg) {
return this.attr('class', newValue);
} else {
return this.raw.className = newValue;
}
}
},
'classList': {
get: function () {
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
QuickElement.prototype.updateOptions = function (options) {
if (IS.object(options)) {
this.options = options;
this._normalizeOptions();
this._applyOptions(this.options);
}
return this;
};
QuickElement.prototype.updateStateStyles = function (styles) {
var i, len, parsed, state, updatedStates;
if (IS.objectPlain(styles)) {
extend.deep.concat(this, parsed = this._parseStyles(styles));
if (parsed._styles) {
updatedStates = Object.keys(parsed._styles);
for ((i = 0, len = updatedStates.length); i < len; i++) {
state = updatedStates[i];
if (this.state(state) || state === 'base') {
this._applyRegisteredStyle(this._styles[state], this._getActiveStates(state), false);
}
}
}
}
return this;
};
QuickElement.prototype.updateStateTexts = function (texts) {
var parsed;
if (IS.objectPlain(texts)) {
extend.deep.concat(this, parsed = this._parseTexts(texts));
}
return this;
};
QuickElement.prototype.applyData = function (data) {
var child, computers, defaults, i, j, key, keys, len, len1, ref;
if (computers = this.options.computers) {
defaults = this.options.defaults;
keys = Object.keys(computers);
for ((i = 0, len = keys.length); i < len; i++) {
key = keys[i];
if (data && data.hasOwnProperty(key)) {
this._runComputer(key, data[key]);
} else if (defaults && defaults.hasOwnProperty(key)) {
this._runComputer(key, defaults[key]);
}
}
}
ref = this._children;
for ((j = 0, len1 = ref.length); j < len1; j++) {
child = ref[j];
child.applyData(data);
}
};
QuickElement.prototype._runComputer = function (computer, arg) {
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
get: function () {
return window.innerWidth;
}
},
'height': {
get: function () {
return window.innerHeight;
}
},
'orientation': orientationGetter,
'aspectRatio': aspectRatioGetter
});
;
var MediaQuery, ruleDelimiter;
MediaQuery = new (function () {
var callbacks, testRule;
callbacks = [];
window.addEventListener('resize', function () {
var callback, i, len;
for ((i = 0, len = callbacks.length); i < len; i++) {
callback = callbacks[i];
callback();
}
});
this.parseQuery = function (target, queryString) {
var querySplit, rules, source;
querySplit = queryString.split('(');
source = querySplit[0];
source = (function () {
switch (source) {
case 'window':
return QuickWindow;
case 'parent':
return target.parent;
case 'self':
return target;
default:
return target.parentMatching(function (parent) {
return parent.ref === source.slice(1);
});
}
})();
rules = querySplit[1].slice(0, -1).split(ruleDelimiter).map(function (rule) {
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
getter = (function () {
switch (key) {
case 'orientation':
return function () {
return source.orientation;
};
case 'aspect-ratio':
return function () {
return source.aspectRatio;
};
case 'width':
case 'height':
return function () {
return source[key];
};
default:
return function () {
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
this.register = function (target, queryString) {
var callback, query;
query = this.parseQuery(target, queryString);
if (query.source) {
callbacks.push(callback = function () {
return testRule(target, query, queryString);
});
callback();
}
return query;
};
testRule = function (target, query, queryString) {
var currentValue, i, len, passed, ref, rule;
passed = true;
ref = query.rules;
for ((i = 0, len = ref.length); i < len; i++) {
rule = ref[i];
currentValue = rule.getter();
passed = (function () {
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
})();
ruleDelimiter = /,\s*/;
;
QuickDom = function () {
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
options = args[1] || ({});
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
for ((j = 0, len = children.length); j < len; j++) {
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
QuickDom.template = function (tree) {
return new QuickTemplate(tree, true);
};
QuickDom.html = function (innerHTML) {
var children, container;
container = document.createElement('div');
container.innerHTML = innerHTML;
children = Array.prototype.slice.call(container.childNodes);
return QuickDom.batch(children);
};
QuickDom.query = function (target) {
return QuickDom(document).query(target);
};
QuickDom.queryAll = function (target) {
return QuickDom(document).queryAll(target);
};
QuickDom.isTemplate = function (target) {
return IS.template(target);
};
QuickDom.isQuickEl = function (target) {
return IS.quickDomEl(target);
};
QuickDom.isEl = function (target) {
return IS.domEl(target);
};
var QuickBatch;
QuickBatch = (function () {
function QuickBatch(elements, returnResults1) {
this.returnResults = returnResults1;
this.elements = elements.map(function (el) {
return QuickDom(el);
});
}
QuickBatch.prototype.reverse = function () {
this.elements = this.elements.reverse();
return this;
};
QuickBatch.prototype["return"] = function (returnNext) {
if (returnNext) {
this.returnResults = true;
return this;
} else {
return this.lastResults;
}
};
return QuickBatch;
})();
if (QuickBatch.name == null) {
QuickBatch.name = 'QuickBatch';
}
Object.keys(QuickElement.prototype).concat('css', 'replaceWith', 'html', 'text').forEach(function (method) {
return QuickBatch.prototype[method] = function (newValue) {
var element, results;
results = this.lastResults = (function () {
var i, len, ref, results1;
ref = this.elements;
results1 = [];
for ((i = 0, len = ref.length); i < len; i++) {
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
QuickDom.batch = function (elements, returnResults) {
if (!IS.iterable(elements)) {
throw new Error("Batch: expected an iterable, got " + (String(elements)));
} else if (!elements.length) {
throw new Error("Batch: expected a non-empty element collection");
}
return new QuickBatch(elements, returnResults);
};
;
var QuickTemplate, slice = [].slice;
var extendByRef, extendTemplate;
extendTemplate = function (currentOpts, newOpts, globalOpts) {
var currentChild, currentChildren, globalOptsTransform, index, maxLength, needsTemplateWrap, newChild, newChildProcessed, newChildren, noChanges, output, ref, remainingNewChildren;
if (globalOpts) {
globalOptsTransform = {
options: function (opts) {
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
if (IS.array(newChildren)) {
maxLength = Math.max(currentChildren.length, newChildren.length);
index = -1;
while (++index !== maxLength) {
needsTemplateWrap = noChanges = false;
currentChild = currentChildren[index];
newChild = newChildren[index];
newChildProcessed = (function () {
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
extendByRef = function (newChildrenRefs, currentChildren, globalOpts) {
var currentChild, i, len, newChild, newChildProcessed, output;
if (!currentChildren.length) {
return currentChildren;
} else {
output = [];
for ((i = 0, len = currentChildren.length); i < len; i++) {
currentChild = currentChildren[i];
newChild = newChildrenRefs[currentChild.ref];
if (newChild) {
newChildProcessed = currentChild.extend(newChild, globalOpts);
delete newChildrenRefs[currentChild.ref];
} else if (newChild === null) {
delete newChildrenRefs[currentChild.ref];
continue;
} else {
newChildProcessed = (function () {
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
parseTree = function (tree, parseChildren) {
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
matchesSchema = function (object) {
return typeof object.type !== 'undefined' || typeof object.ref !== 'undefined' || typeof object.options !== 'undefined' || typeof object.children !== 'undefined';
};
;
QuickTemplate = (function () {
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
for ((i = 0, len = ref.length); i < len; i++) {
child = ref[i];
if (!(child._hasComputers || child.options.computers)) {
continue;
}
this._hasComputers = true;
break;
}
}
}
QuickTemplate.prototype.extend = function (newValues, globalOpts) {
return new QuickTemplate(extendTemplate(this, newValues, globalOpts));
};
QuickTemplate.prototype.spawn = function (newValues, globalOpts) {
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
if (QuickTemplate.name == null) {
QuickTemplate.name = 'QuickTemplate';
}
Object.defineProperty(QuickTemplate.prototype, 'child', {
get: function () {
return this._childRefs || _getChildRefs(this);
}
});
;
var fn, i, len, shortcut, shortcuts, slice = [].slice;
shortcuts = ['link:a', 'anchor:a', 'a', 'text', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'section', 'button', 'br', 'ul', 'ol', 'li', 'fieldset', 'input', 'textarea', 'select', 'option', 'form', 'frame', 'hr', 'iframe', 'img', 'picture', 'main', 'nav', 'meta', 'object', 'pre', 'style', 'table', 'tbody', 'th', 'tr', 'td', 'tfoot', 'video'];
fn = function (shortcut) {
var prop, split, type;
prop = type = shortcut;
if (helpers.includes(shortcut, ':')) {
split = shortcut.split(':');
prop = split[0];
type = split[1];
}
return QuickDom[prop] = function () {
return QuickDom.apply(null, [type].concat(slice.call(arguments)));
};
};
for ((i = 0, len = shortcuts.length); i < len; i++) {
shortcut = shortcuts[i];
fn(shortcut);
}
;
QuickDom.version = "1.0.81";
QuickDom.CSS = CSS;
module.exports = QuickDom;
return module.exports;
},
3: function (require, module, exports) {
var IS;
IS = require(24);
IS = IS.create('natives', 'dom');
IS.load({
field: function (target) {
return target && target instanceof require(9);
},
regex: function (target) {
return target instanceof RegExp;
},
objectable: function (target) {
return IS.object(target) || IS["function"](target);
}
});
module.exports = IS;
return module.exports;
},
4: function (require, module, exports) {
var exports, extend, modifiers, newBuilder, normalizeKeys;
extend = require(25);
normalizeKeys = function (keys) {
var i, key, len, output;
if (keys) {
output = {};
if (typeof keys !== 'object') {
output[keys] = true;
} else {
if (!Array.isArray(keys)) {
keys = Object.keys(keys);
}
for ((i = 0, len = keys.length); i < len; i++) {
key = keys[i];
output[key] = true;
}
}
return output;
}
};
newBuilder = function (isBase) {
var builder;
builder = function (target) {
var theTarget;
var $_len = arguments.length, $_i = -1, sources = new Array($_len);
while (++$_i < $_len) sources[$_i] = arguments[$_i];
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
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.deep = true;
return _;
}
},
'own': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.own = true;
return _;
}
},
'allowNull': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.allowNull = true;
return _;
}
},
'nullDeletes': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.nullDeletes = true;
return _;
}
},
'concat': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.concat = true;
return _;
}
},
'clone': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.target = {};
return _;
}
},
'notDeep': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (keys) {
_.options.notDeep = normalizeKeys(keys);
return _;
};
}
},
'deepOnly': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (keys) {
_.options.deepOnly = normalizeKeys(keys);
return _;
};
}
},
'keys': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (keys) {
_.options.keys = normalizeKeys(keys);
return _;
};
}
},
'notKeys': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (keys) {
_.options.notKeys = normalizeKeys(keys);
return _;
};
}
},
'transform': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (transform) {
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
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (filter) {
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
return module.exports;
},
5: function (require, module, exports) {
var CSS;
CSS = require(27);
module.exports = function () {
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
return module.exports = function () {};
};
return module.exports;
},
6: function (require, module, exports) {
module.exports = ['_getValue', '_setValue', '_validate'];
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
Field = (function () {
Field.instances = Object.create(null);
Field.shallowSettings = ['templates', 'fieldInstances', 'value', 'defaultValue'];
Field.transformSettings = ({
'conditions': function (conditions) {
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
return conditions.map(function (item) {
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
'choices': function (choices) {
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
return choices.map(function (item) {
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
'validWhenRegex': function (regex) {
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
Field.prototype._constructorEnd = function () {
var base, handler, ref, target;
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
}).of(this.state).to('help').of(this.state).transform((function (_this) {
return function (show) {
if (show && _this.state.error && IS.string(_this.state.error)) {
return _this.state.error;
} else {
return _this.settings.help || _this.state.help;
}
};
})(this));
SimplyBind('error', {
updateOnBind: false
}).of(this.state).to('help').of(this.state).condition((function (_this) {
return function (error) {
return error && _this.state.showError;
};
})(this));
SimplyBind('help').of(this.state).to('html').of(this.el.child.help).and.to('showHelp').of(this.state);
SimplyBind('label').of(this.state).to('text').of(this.el.child.label).and.to('showLabel').of(this.state);
SimplyBind('margin').of(this.state).to(this.el.style.bind(this.el, 'margin'));
SimplyBind('padding').of(this.state).to(this.el.style.bind(this.el, 'padding'));
SimplyBind('showHelp').of(this.state).to((function (_this) {
return function (show, prevShow) {
var changeAmount;
if (_this.settings.makeRoomForHelp) {
changeAmount = !!show === !!prevShow ? 0 : show ? 25 : prevShow ? -25 : void 0;
if (changeAmount) {
return _this.state.margin = helpers.updateShorthandValue(_this.state.margin, 'bottom', changeAmount);
}
}
};
})(this));
SimplyBind('focused', {
updateOnBind: false
}).of(this.state).to((function (_this) {
return function (focused) {
return _this.emit(focused ? 'focus' : 'blur');
};
})(this));
if (this.settings.mobileWidth) {
SimplyBind((function (_this) {
return function () {
return fastdom.measure(function () {
return _this.state.isMobile = window.innerWidth <= _this.settings.mobileThreshold;
});
};
})(this)).updateOn('event:resize').of(window);
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
};
Field.prototype._formatWidth = function (width) {
width = this.state.isMobile ? this.settings.mobileWidth || width : width;
if (this.settings.distance && width !== '100%') {
width = "calc(" + width + " - " + this.settings.distance + "px)";
}
return width;
};
Field.prototype.appendTo = function (target) {
this.el.appendTo(target);
return this;
};
Field.prototype.prependTo = function (target) {
this.el.prependTo(target);
return this;
};
Field.prototype.insertAfter = function (target) {
this.el.insertAfter(target);
return this;
};
Field.prototype.insertBefore = function (target) {
this.el.insertBefore(target);
return this;
};
Field.prototype.detach = function (target) {
this.el.detach(target);
return this;
};
Field.prototype.remove = function () {
this.el.remove();
return this.destroy(false);
};
Field.prototype.destroy = function (removeFromDOM) {
var child, i, len, ref;
if (removeFromDOM == null) {
removeFromDOM = true;
}
SimplyBind.unBindAll(this);
SimplyBind.unBindAll(this.state);
SimplyBind.unBindAll(this.el);
ref = this.el.child;
for ((i = 0, len = ref.length); i < len; i++) {
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
Field.prototype.on = function (eventNames, callback, useCapture) {
this.el.on.call(this.el, eventNames, callback, useCapture, true);
return this;
};
Field.prototype.once = function (eventNames, callback, useCapture) {
return this.on(eventNames, (function (_this) {
return function () {
_this.off(eventNames, callback);
return callback.apply(_this.el, arguments);
};
})(this), useCapture);
};
Field.prototype.off = function () {
this.el.off.apply(this.el, arguments);
return this;
};
Field.prototype.emit = function () {
this.el.emitPrivate.apply(this.el, arguments);
return this;
};
Field.prototype.validate = function (providedValue, testUnrequired, report) {
var isValid;
if (providedValue == null) {
providedValue = this[this.coreValueProp];
}
isValid = (function () {
switch (false) {
case !this.settings.validator:
return this.settings.validator(providedValue);
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
Field.prototype.validateConditions = function (conditions) {
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
Field.prototype.validateAndReport = function (providedValue, testUnrequired) {
var isValid;
isValid = this.validate(providedValue, testUnrequired, true);
this.state.showError = !isValid;
return isValid;
};
return Field;
})();
module.exports = Field;
return module.exports;
},
10: function (require, module, exports) {
var DOM, Dropdown, IS, KEYCODES, Mask, REGEX, SimplyBind, TextField, extend, helpers, extend1 = function (child, parent) {
for (var key in parent) {
if (hasProp.call(parent, key)) child[key] = parent[key];
}
function ctor() {
this.constructor = child;
}
ctor.prototype = parent.prototype;
child.prototype = new ctor();
child.__super__ = parent.prototype;
return child;
}, hasProp = ({}).hasOwnProperty;
Dropdown = require(32);
Mask = require(33);
REGEX = require(12);
KEYCODES = require(34);
helpers = require(1);
IS = require(3);
DOM = require(2);
extend = require(4);
SimplyBind = require(11);
var templates = require(35);
var defaults = require(36);
TextField = (function (superClass) {
extend1(TextField, superClass);
TextField.prototype.template = templates.default;
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
this.settings.mask.pattern = (function () {
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
TextField.prototype._getValue = function () {
if (this.dropdown && this.selected && this._value === this.selected.label) {
return this.selected.value;
} else {
return this._value;
}
};
TextField.prototype._setValue = function (newValue) {
if (IS.string(newValue) || IS.number(newValue)) {
newValue = String(newValue);
return this._value = this.mask ? this.mask.setValue(newValue) : newValue;
}
};
TextField.prototype._recalcDisplay = function () {
if (this.settings.autoWidth) {
return this._value = this._value;
}
};
TextField.prototype._createElements = function () {
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
this.el.child.input.prop('type', (function () {
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
TextField.prototype._attachBindings = function () {
this._attachBindings_elState();
this._attachBindings_display();
this._attachBindings_display_autoWidth();
this._attachBindings_value();
this._attachBindings_autocomplete();
this._attachBindings_stateTriggers();
};
TextField.prototype._attachBindings_elState = function () {
SimplyBind('visible').of(this.state).to((function (_this) {
return function (visible) {
return _this.el.state('visible', visible);
};
})(this));
SimplyBind('hovered').of(this.state).to((function (_this) {
return function (hovered) {
return _this.el.state('hover', hovered);
};
})(this));
SimplyBind('focused').of(this.state).to((function (_this) {
return function (focused) {
return _this.el.state('focus', focused);
};
})(this));
SimplyBind('filled').of(this.state).to((function (_this) {
return function (filled) {
return _this.el.state('filled', filled);
};
})(this));
SimplyBind('disabled').of(this.state).to((function (_this) {
return function (disabled) {
return _this.el.state('disabled', disabled);
};
})(this));
SimplyBind('showLabel').of(this.state).to((function (_this) {
return function (showLabel) {
return _this.el.state('showLabel', showLabel);
};
})(this));
SimplyBind('showError').of(this.state).to((function (_this) {
return function (showError) {
return _this.el.state('showError', showError);
};
})(this));
SimplyBind('showHelp').of(this.state).to((function (_this) {
return function (showHelp) {
return _this.el.state('showHelp', showHelp);
};
})(this));
SimplyBind('valid').of(this.state).to((function (_this) {
return function (valid) {
_this.el.state('valid', valid);
return _this.el.state('invalid', !valid);
};
})(this));
};
TextField.prototype._attachBindings_display = function () {
SimplyBind('placeholder').of(this.state).to('text').of(this.el.child.placeholder).transform((function (_this) {
return function (placeholder) {
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
}).of(this.state).to((function (_this) {
return function (disabled, prev) {
if (_this.settings.checkmark) {
if (disabled || (!disabled && (prev != null))) {
return setTimeout(function () {
_this.el.child.checkmark_mask1.recalcStyle();
_this.el.child.checkmark_mask2.recalcStyle();
return _this.el.child.checkmark_patch.recalcStyle();
});
}
}
};
})(this));
};
TextField.prototype._attachBindings_display_autoWidth = function () {
SimplyBind('width', {
updateEvenIfSame: true
}).of(this.state).to((function (_this) {
return function (width) {
return (_this.settings.autoWidth ? _this.el.child.input : _this.el).style('width', width);
};
})(this)).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);
if (this.settings.autoWidth) {
SimplyBind('_value', {
updateEvenIfSame: true,
updateOnBind: false
}).of(this).to('width').of(this.state).transform((function (_this) {
return function () {
return (_this._getInputAutoWidth()) + "px";
};
})(this)).updateOn('event:inserted').of(this.el).updateOn('visible').of(this.state);
}
};
TextField.prototype._attachBindings_value = function () {
var input, resetInput;
input = this.el.child.input.raw;
resetInput = (function (_this) {
return function () {
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
SimplyBind('event:input').of(input).to((function (_this) {
return function () {
_this.value = input.value;
if (_this.mask) {
_this.selection(_this.mask.cursor);
}
return _this.emit('input', _this.value);
};
})(this));
SimplyBind('_value', {
updateEvenIfSame: !!this.mask
}).of(this).to('value').of(input).and.to((function (_this) {
return function (value) {
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
SimplyBind('event:keydown').of(this.el.child.input).to((function (_this) {
return function (event) {
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
TextField.prototype._attachBindings_autocomplete = function () {
if (this.dropdown) {
SimplyBind.defaultOptions.updateOnBind = false;
SimplyBind('typing', {
updateEvenIfSame: true
}).of(this.state).to((function (_this) {
return function (isTyping) {
if (isTyping) {
if (!_this._value) {
return;
}
if (_this.dropdown.isOpen) {
return _this.dropdown.list.calcDisplay();
} else {
_this.dropdown.isOpen = true;
return SimplyBind('event:click').of(document).once.to(function () {
return _this.dropdown.isOpen = false;
}).condition(function (event) {
return !DOM(event.target).parentMatching(function (parent) {
return parent === _this.el.child.innerwrap;
});
});
}
} else {
return _this.dropdown.isOpen = false;
}
};
})(this));
SimplyBind('_value').of(this).to((function (_this) {
return function (value) {
var choice, i, len, ref, shouldBeVisible;
ref = _this.dropdown.choices;
for ((i = 0, len = ref.length); i < len; i++) {
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
this.dropdown.onSelected((function (_this) {
return function (selectedChoice) {
_this.selected = selectedChoice;
_this.value = selectedChoice.label;
_this.dropdown.isOpen = false;
return _this.selection(_this.el.child.input.raw.value.length);
};
})(this));
SimplyBind.defaultOptions.updateOnBind = true;
}
};
TextField.prototype._attachBindings_stateTriggers = function () {
SimplyBind('event:mouseenter').of(this.el.child.input).to((function (_this) {
return function () {
return _this.state.hovered = true;
};
})(this));
SimplyBind('event:mouseleave').of(this.el.child.input).to((function (_this) {
return function () {
return _this.state.hovered = false;
};
})(this));
SimplyBind('event:focus').of(this.el.child.input).to((function (_this) {
return function () {
_this.state.focused = true;
if (_this.state.disabled) {
return _this.blur();
}
};
})(this));
SimplyBind('event:blur').of(this.el.child.input).to((function (_this) {
return function () {
return _this.state.typing = _this.state.focused = false;
};
})(this));
SimplyBind('event:input').of(this.el.child.input).to((function (_this) {
return function () {
return _this.state.typing = true;
};
})(this));
SimplyBind('event:keydown').of(this.el.child.input).to((function (_this) {
return function () {
return _this.cursor.prev = _this.selection().end;
};
})(this));
};
TextField.prototype._scheduleCursorReset = function () {
var currentCursor, diffIndex, newCursor;
diffIndex = helpers.getIndexOfFirstDiff(this.mask.value, this.mask.prev.value);
currentCursor = this.cursor.current;
newCursor = this.mask.normalizeCursorPos(currentCursor, this.cursor.prev);
if (newCursor !== currentCursor) {
this.selection(newCursor);
}
};
TextField.prototype._setValueIfNotSet = function () {
if (this.el.child.input.raw.value !== this._value) {
this.el.child.input.raw.value = this._value;
}
};
TextField.prototype._getInputAutoWidth = function () {
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
TextField.prototype._getWidthSetting = function (target) {
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
TextField.prototype._validate = function (providedValue) {
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
};
TextField.prototype.selection = function (arg) {
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
TextField.prototype.focus = function () {
return this.el.child.input.raw.focus();
};
TextField.prototype.blur = function () {
return this.el.child.input.raw.blur();
};
return TextField;
})(require(9));
module.exports = TextField;
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
get: function () {
return placeholder;
},
set: function (newPlaceholder) {
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
changeEvent = function () {
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
requiresDomDescriptorFix = (!(('className' in Element.prototype))) || !getDescriptor(Element.prototype, 'className').get;
;
var windowPropsToIgnore;
windowPropsToIgnore = ['innerWidth', 'innerHeight', 'outerWidth', 'outerHeight', 'scrollX', 'scrollY', 'pageXOffset', 'pageYOffset', 'screenX', 'screenY', 'screenLeft', 'screenTop'];
;
setValueNoop = function (v, publisher) {
return this.updateAllSubs(publisher || this);
};
genID = function () {
return '' + (++currentID);
};
genObj = function () {
return Object.create(null);
};
genProxiedInterface = function (isSub, completeCallback) {
return function (subject, customOptions, saveOptions) {
return SimplyBind(subject, customOptions, saveOptions, isSub, completeCallback);
};
};
genSelfUpdater = function (binding, fetchValue) {
return binding.selfUpdater || (binding.selfUpdater = new Binding(function () {
if (fetchValue) {
return binding.setValue(binding.fetchDirectValue(), binding, true);
} else {
return binding.updateAllSubs(binding);
}
}, 'Func', {}));
};
var checkIf, targetIncludes;
targetIncludes = function (target, item) {
return target && target.indexOf(item) !== -1;
};
checkIf = {
isDefined: function (subject) {
return subject !== void 0;
},
isArray: function (subject) {
return subject instanceof Array;
},
isObject: function (subject) {
return typeof subject === 'object' && subject;
},
isString: function (subject) {
return typeof subject === 'string';
},
isNumber: function (subject) {
return typeof subject === 'number';
},
isFunction: function (subject) {
return typeof subject === 'function';
},
isBindingInterface: function (subject) {
return subject instanceof BindingInterface;
},
isBinding: function (subject) {
return subject instanceof Binding;
},
isIterable: function (subject) {
return checkIf.isObject(subject) && checkIf.isNumber(subject.length);
},
isDom: function (subject) {
return subject.nodeName && subject.nodeType === 1;
},
isDomInput: function (subject) {
var nodeName;
nodeName = subject.nodeName;
return nodeName === 'INPUT' || nodeName === 'TEXTAREA' || nodeName === 'SELECT';
},
isDomRadio: function (subject) {
return subject.type === 'radio';
},
isDomCheckbox: function (subject) {
return subject.type === 'checkbox';
},
isElCollection: function (subject) {
return (subject instanceof NodeList) || (subject instanceof HTMLCollection) || (window.jQuery && subject instanceof jQuery);
},
domElsAreSame: function (iterable) {
var itemsWithSameType, type;
type = iterable[0].type;
itemsWithSameType = [].filter.call(iterable, function (item) {
return item.type === type;
});
return itemsWithSameType.length === iterable.length;
},
isDomNode: function (subject) {
return checkIf.isDom(subject) || subject === window || subject === document;
}
};
;
var convertToLive, convertToReg, fetchDescriptor;
fetchDescriptor = function (object, property, isProto) {
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
convertToLive = function (bindingInstance, object, onlyArrayMethods) {
var _, context, getterValue, origFn, propertyDescriptor, proxyFn, shouldIndicateUpdateIsFromSelf, shouldWriteLiveProp, slice, typeIsArray;
_ = bindingInstance;
if (!_.origDescriptor) {
_.origDescriptor = fetchDescriptor(object, _.property);
}
if (onlyArrayMethods) {
arrayMutatorMethods.forEach(function (method) {
return defineProperty(object, method, {
configurable: true,
value: function () {
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
getterValue = proxyFn = function () {
var args, result;
args = slice.call(arguments);
_.value.args = args = _.selfTransform ? _.selfTransform(args) : args;
_.value.result = result = origFn.apply(context, args);
_.updateAllSubs(_);
return result;
};
defineProperty(object, _.property, {
configurable: _.isLiveProp = true,
get: function () {
return getterValue;
},
set: function (newValue) {
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
var shouldWriteLiveProp;
if (requiresDomDescriptorFix && _.isDom && (_.property in object.cloneNode(false))) {
_.origDescriptor = shouldWriteLiveProp = false;
_.isLiveProp = true;
_.origGetter = function () {
return _.object[_.property];
};
_.origSetter = function (newValue) {
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
get: _.origGetter || (function () {
return _.value;
}),
set: function (newValue) {
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
convertToReg = function (bindingInstance, object, onlyArrayMethods) {
var _, i, len, method, newDescriptor, results;
if (onlyArrayMethods) {
results = [];
for ((i = 0, len = arrayMutatorMethods.length); i < len; i++) {
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
cloneObject = function (object) {
var clone, key;
clone = genObj();
for (key in object) {
clone[key] = object[key];
}
return clone;
};
extendState = function (base, stateToInherit) {
var i, key, len, stateMapping;
stateMapping = Object.keys(stateToInherit);
for ((i = 0, len = stateMapping.length); i < len; i++) {
key = stateMapping[i];
base[key] = stateToInherit[key];
}
};
;
var cache;
cache = {
get: function (object, isFunction, selector, isMultiChoice) {
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
set: function (B, isFunction) {
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
setPholderRegEx = function () {
var end, middle, start;
start = settings.placeholder[0].replace(escapeRegEx, '\\$&');
end = settings.placeholder[1].replace(escapeRegEx, '\\$&');
middle = "[^" + end + "]+";
pholderRegEx = new RegExp(start + "(" + middle + ")" + end, 'g');
pholderRegExSplit = new RegExp("" + start + middle + end, 'g');
};
setPholderRegEx();
applyPlaceholders = function (contexts, values, indexMap) {
var contextPart, i, index, len, output;
output = '';
for ((index = i = 0, len = contexts.length); i < len; index = ++i) {
contextPart = contexts[index];
output += contextPart;
if (indexMap[index]) {
output += values[indexMap[index]];
}
}
return output;
};
textContent = 'textContent';
addToNodeStore = function (nodeStore, node, targetPlaceholder) {
if (nodeStore[targetPlaceholder] == null) {
nodeStore[targetPlaceholder] = [];
}
nodeStore[targetPlaceholder].push(node);
};
scanTextNodesPlaceholders = function (element, nodeStore) {
var childNodes, i, index, j, len, len1, newFragment, newNode, node, textPiece, textPieces;
childNodes = Array.prototype.slice.call(element.childNodes);
for ((i = 0, len = childNodes.length); i < len; i++) {
node = childNodes[i];
if (node.nodeType !== 3) {
scanTextNodesPlaceholders(node, nodeStore);
} else if (node[textContent].match(pholderRegExSplit)) {
textPieces = node[textContent].split(pholderRegEx);
if (textPieces.length === 3 && textPieces[0] + textPieces[2] === '') {
addToNodeStore(nodeStore, node, textPieces[1]);
} else {
newFragment = document.createDocumentFragment();
for ((index = j = 0, len1 = textPieces.length); j < len1; index = ++j) {
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
throwError = function (errorName) {
throw new Error('SimplyBind: ' + (errors[errorName] || errorName));
};
throwWarning = function (warningName, depth) {
var errSource, warn;
if (!settings.silent) {
errSource = getErrSource(depth);
warn = errors[warningName];
warn += "\n\n" + errSource;
console.warn('SimplyBind: ' + warn);
}
};
throwErrorBadArg = function (arg) {
throwError("Invalid argument/s (" + arg + ")", true);
};
getErrSource = function (depth) {
return ((new Error()).stack || '').split('\n').slice(depth + 3).join('\n');
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
SimplyBind = function (subject, options, saveOptions, isSub, completeCallback) {
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
SimplyBind.unBindAll = function (object, bothWays) {
var boundID, prop, propMap;
if (object && (checkIf.isObject(object) || checkIf.isFunction(object))) {
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
Binding = function (object, type, state) {
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
if (this.isMultiChoice) {
this.choices = genObj();
this.object.forEach((function (_this) {
return function (choiceEl) {
var choiceBinding;
choiceBinding = _this.choices[choiceEl.value] = SimplyBind('checked').of(choiceEl)._;
choiceBinding.addSub(_this);
choiceBinding.subsMeta[_this.ID].transformFn = function () {
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
addSub: function (sub, options, updateOnce, updateEvenIfSame) {
var alreadyHadSub, j, len, metaData, ref, subItem;
if (sub.isMulti) {
ref = sub.bindings;
for ((j = 0, len = ref.length); j < len; j++) {
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
removeSub: function (sub, bothWays) {
var j, len, ref, subItem;
if (sub.isMulti) {
ref = sub.bindings;
for ((j = 0, len = ref.length); j < len; j++) {
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
removeAllSubs: function (bothWays) {
var j, len, ref, sub;
ref = this.subs.slice();
for ((j = 0, len = ref.length); j < len; j++) {
sub = ref[j];
this.removeSub(sub, bothWays);
}
},
destroy: function () {
var event, j, len, ref;
delete boundInstances[this.ID];
this.removePollInterval();
if (this.type === 'Event') {
ref = this.attachedEvents;
for ((j = 0, len = ref.length); j < len; j++) {
event = ref[j];
this.unRegisterEvent(event);
}
} else if (this.type === 'Func') {
delete this.object._sb_ID;
}
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
fetchDirectValue: function () {
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
setValue: function (newValue, publisher, fromSelf, fromChangeEvent) {
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
for ((j = 0, len = ref.length); j < len; j++) {
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
for ((index = k = 0, len1 = newChoices.length); k < len1; index = ++k) {
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
updateAllSubs: function (publisher) {
var arr, i;
if (i = (arr = this.subs).length) {
while (i--) {
this.updateSub(arr[i], publisher);
}
}
},
updateSub: function (sub, publisher, isDelayedUpdate) {
var currentTime, meta, newValue, subValue, timePassed, transform;
if ((publisher === sub) || (publisher !== this && publisher.subsMeta[sub.ID])) {
return;
}
meta = this.subsMeta[sub.ID];
if (meta.disallowList && meta.disallowList[publisher.ID]) {
return;
}
if (meta.opts.throttle) {
currentTime = +(new Date());
timePassed = currentTime - meta.lastUpdate;
if (timePassed < meta.opts.throttle) {
clearTimeout(meta.updateTimer);
return meta.updateTimer = setTimeout((function (_this) {
return function () {
if (_this.subsMeta[sub.ID]) {
return _this.updateSub(sub, publisher);
}
};
})(this), meta.opts.throttle - timePassed);
} else {
meta.lastUpdate = currentTime;
}
} else if (meta.opts.delay && !isDelayedUpdate) {
return setTimeout((function (_this) {
return function () {
if (_this.subsMeta[sub.ID]) {
return _this.updateSub(sub, publisher, true);
}
};
})(this), meta.opts.delay);
}
newValue = this.type === 'Array' && meta.opts.sendArrayCopies ? this.value.slice() : this.value;
subValue = sub[meta.valueRef];
newValue = ((transform = meta.transformFn)) ? transform(newValue, subValue, sub.object) : newValue;
if (newValue === subValue && !meta.opts.updateEvenIfSame || meta.conditionFn && !meta.conditionFn(newValue, subValue, sub.object)) {
return;
}
if (meta.opts.promiseTransforms && newValue && checkIf.isFunction(newValue.then)) {
newValue.then(function (newValue) {
sub.setValue(newValue, publisher);
});
} else {
sub.setValue(newValue, publisher);
}
if (meta.updateOnce) {
this.removeSub(sub);
}
},
addModifierFn: function (target, subInterfaces, subjectFn, updateOnBind) {
var base, j, len, subInterface, subMetaData, subscriber;
if (!checkIf.isFunction(subjectFn)) {
return throwWarning('fnOnly', 2);
} else {
for ((j = 0, len = subInterfaces.length); j < len; j++) {
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
setSelfTransform: function (transformFn, updateOnBind) {
this.selfTransform = transformFn;
if (updateOnBind) {
this.setValue(this.value);
}
},
addDisallowRule: function (targetSub, targetDisallow) {
var base, disallowList;
disallowList = (base = this.subsMeta[targetSub.ID]).disallowList != null ? base.disallowList : base.disallowList = genObj();
disallowList[targetDisallow.ID] = 1;
},
scanForPholders: function () {
var index;
if (!this.pholderValues) {
this.pholderValues = genObj();
this.pholderIndexMap = genObj();
this.pholderContexts = [];
if (checkIf.isString(this.value)) {
this.pholderContexts = this.value.split(pholderRegExSplit);
index = 0;
this.value = this.value.replace(pholderRegEx, (function (_this) {
return function (e, pholder) {
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
addPollInterval: function (time) {
if (this.type !== 'Event') {
this.removePollInterval();
return this.pollInterval = setInterval((function (_this) {
return function () {
var polledValue;
polledValue = _this.fetchDirectValue();
return _this.setValue(polledValue, _this, true);
};
})(this), time);
}
},
removePollInterval: function () {
clearInterval(this.pollInterval);
return this.pollInterval = null;
},
addUpdateListener: function (eventName, targetProperty) {
this.object.addEventListener(eventName, (function (_this) {
return function (event) {
var shouldRedefineValue;
if (!event._sb) {
shouldRedefineValue = _this.selfTransform && _this.isDomInput;
_this.setValue(_this.object[targetProperty], null, !shouldRedefineValue, true);
}
};
})(this), false);
},
attachEvents: function () {
if (this.eventName) {
this.registerEvent(this.eventName);
} else if (this.isDomInput) {
this.addUpdateListener('input', 'value');
this.addUpdateListener('change', 'value');
} else if (!this.isMultiChoice && (this.type === 'DOMRadio' || this.type === 'DOMCheckbox')) {
this.addUpdateListener('change', 'checked');
}
},
registerEvent: function (eventName) {
this.attachedEvents.push(eventName);
if (!this.eventHandler) {
this.eventHandler = eventUpdateHandler.bind(this);
}
this.object[this.eventMethods.listen](eventName, this.eventHandler);
},
unRegisterEvent: function (eventName) {
this.attachedEvents.splice(this.attachedEvents.indexOf(eventName), 1);
this.object[this.eventMethods.remove](eventName, this.eventHandler);
},
emitEvent: function (extraData) {
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
eventUpdateHandler = function () {
if (!this.isEmitter) {
this.setValue(arguments[this.property], null, true);
}
};
;
;
var BindingInterface;
BindingInterface = function (options, inheritedState) {
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
selfClone: function () {
return new BindingInterface(null, this);
},
defineMainProps: function (binding) {
this._ = binding;
return Object.defineProperties(this, {
'value': {
get: function () {
return binding.value;
}
},
'original': {
get: function () {
return binding.objects || binding.object;
}
},
'subscribers': {
get: function () {
return binding.subs.slice().map(function (sub) {
return sub.object;
});
}
}
});
},
createBinding: function (subject, newObjectType, bindingInterface, isFunction) {
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
patchCachedBinding: function (cachedBinding) {
var key, option, ref, ref1, value;
if (cachedBinding.type === 'ObjectProp' && !((this.property in this.object))) {
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
setProperty: function (subject) {
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
setObject: function (subject, isFunction) {
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
addToPublisher: function (publisherInterface) {
var alreadyHadSub, binding, i, len, ref;
publisherInterface.stage = 2;
publisherInterface.subs.push(this);
alreadyHadSub = publisherInterface._.addSub(this._, publisherInterface.options, publisherInterface.updateOnce);
if (publisherInterface.updateOnce) {
delete publisherInterface.updateOnce;
} else if (publisherInterface.options.updateOnBind && !alreadyHadSub) {
if (this._.isMulti) {
ref = this._.bindings;
for ((i = 0, len = ref.length); i < len; i++) {
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
get: function () {
if (!this.stage) {
return METHOD_of;
}
}
},
set: {
get: function () {
if (this.stage) {
return METHOD_set;
}
}
},
chainTo: {
get: function () {
if (this.stage === 2) {
return METHOD_chainTo;
}
}
},
transformSelf: {
get: function () {
if (this.stage === 1) {
return METHOD_transformSelf;
}
}
},
transform: {
get: function () {
if (this.stage === 2) {
return METHOD_transform;
}
}
},
transformAll: {
get: function () {
if (this.stage === 2) {
return METHOD_transformAll;
}
}
},
condition: {
get: function () {
if (this.stage === 2) {
return METHOD_condition;
}
}
},
conditionAll: {
get: function () {
if (this.stage === 2) {
return METHOD_conditionAll;
}
}
},
bothWays: {
get: function () {
if (this.stage === 2) {
return METHOD_bothWays;
}
}
},
unBind: {
get: function () {
if (this.stage === 2) {
return METHOD_unBind;
}
}
},
pollEvery: {
get: function () {
if (this.stage) {
return METHOD_pollEvery;
}
}
},
stopPolling: {
get: function () {
if (this.stage) {
return METHOD_stopPolling;
}
}
},
setOption: {
get: function () {
if (this.stage === 2) {
return METHOD_setOption;
}
}
},
disallowFrom: {
get: function () {
var thisInterface;
if (this.stage === 2 && (thisInterface = this)) {
return genProxiedInterface(false, function (disallowInterface) {
var subInterface;
subInterface = thisInterface.subs[thisInterface.subs.length - 1];
thisInterface._.addDisallowRule(subInterface._, disallowInterface._);
return thisInterface;
});
}
}
},
updateOn: {
get: function () {
var thisInterface;
if (this.stage && (thisInterface = this)) {
return genProxiedInterface(false, function (subInterface) {
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
get: function () {
var selfUpdater, thisInterface;
if (this.stage && (thisInterface = this) && (selfUpdater = this._.selfUpdater)) {
return genProxiedInterface(false, function (subInterface) {
if (subInterface._.subsMeta[selfUpdater.ID]) {
delete thisInterface._.pubsMap[subInterface._.ID];
subInterface._.removeSub(selfUpdater);
}
});
}
}
},
to: {
get: function () {
var thisInterface;
if (this.stage === 1 && (thisInterface = this)) {
return genProxiedInterface(true, function (subInterface) {
if (subInterface._ !== thisInterface._) {
subInterface.addToPublisher(thisInterface);
}
return thisInterface;
});
}
}
},
and: {
get: function () {
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
return genProxiedInterface(false, function (siblingInterface) {
cloneInterface._.addBinding(siblingInterface._);
return cloneInterface;
});
}
}
},
once: {
get: function () {
var interfaceToReturn;
if (this.stage === 1) {
interfaceToReturn = this.selfClone();
interfaceToReturn.updateOnce = true;
return interfaceToReturn;
}
}
},
update: {
get: function () {
return this.set;
}
},
twoWay: {
get: function () {
return this.bothWays;
}
},
pipe: {
get: function () {
return this.chainTo;
}
}
});
METHOD_of = function (object) {
if (!(checkIf.isObject(object) || checkIf.isFunction(object))) {
throwErrorBadArg(object);
}
if (checkIf.isBindingInterface(object)) {
object = object.object;
}
this.stage = 1;
return this.setObject(object);
};
METHOD_chainTo = function (subject, specificOptions, saveOptions) {
return SimplyBind(this.subs[this.subs.length - 1]).to(subject, specificOptions, saveOptions);
};
METHOD_set = function (newValue) {
this._.setValue(newValue);
return this;
};
METHOD_transformSelf = function (transformFn) {
if (!checkIf.isFunction(transformFn)) {
throwWarning('fnOnly', 1);
} else {
this._.setSelfTransform(transformFn, this.options.updateOnBind);
}
return this;
};
METHOD_transform = function (transformFn) {
this._.addModifierFn('transformFn', this.subs.slice(-1), transformFn, this.options.updateOnBind);
return this;
};
METHOD_transformAll = function (transformFn) {
this._.addModifierFn('transformFn', this.subs, transformFn, this.options.updateOnBind);
return this;
};
METHOD_condition = function (conditionFn) {
this._.addModifierFn('conditionFn', this.subs.slice(-1), conditionFn);
return this;
};
METHOD_conditionAll = function (conditionFn) {
this._.addModifierFn('conditionFn', this.subs, conditionFn);
return this;
};
METHOD_bothWays = function (altTransform) {
var binding, bindings, i, len, originCondition, originTransform, sub, subBinding, transformToUse;
sub = this.subs[this.subs.length - 1];
subBinding = sub._;
bindings = this._.isMulti ? this._.bindings : [this._];
subBinding.addSub(this._, sub.options);
for ((i = 0, len = bindings.length); i < len; i++) {
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
METHOD_unBind = function (bothWays) {
var i, len, ref, sub;
ref = this.subs;
for ((i = 0, len = ref.length); i < len; i++) {
sub = ref[i];
this._.removeSub(sub._, bothWays);
}
return this;
};
METHOD_pollEvery = function (time) {
this._.addPollInterval(time);
return this;
};
METHOD_stopPolling = function () {
this._.removePollInterval();
return this;
};
METHOD_setOption = function (optionName, newValue) {
this._.subsMeta[this.subs[this.subs.length - 1]._.ID].opts[optionName] = newValue;
return this;
};
;
;
var GroupBinding, proto;
GroupBinding = function (bindingInterface, objects, objectType) {
var bindings, i, len, object;
bindingInterface.selector = bindingInterface.selector.slice(6);
extendState(this, this["interface"] = bindingInterface);
this.isMulti = true;
this.bindings = bindings = [];
if (objects) {
for ((i = 0, len = objects.length); i < len; i++) {
object = objects[i];
this.addBinding(object, objectType);
}
}
return Object.defineProperties(this, {
'type': {
get: function () {
return bindings.map(function (binding) {
return binding.type;
});
}
},
'value': {
get: function () {
return bindings.map(function (binding) {
return binding.value;
});
}
}
});
};
proto = GroupBinding.prototype = Object.create(BindingInterfacePrivate);
Object.keys(Binding.prototype).forEach(function (methodName) {
return proto[methodName] = function (a, b, c, d) {
var binding, i, len, ref;
ref = this.bindings;
for ((i = 0, len = ref.length); i < len; i++) {
binding = ref[i];
if (methodName === 'updateSub') {
b = binding;
}
binding[methodName](a, b, c, d);
}
};
});
proto.addBinding = function (object, objectType) {
this.bindings.push(!objectType ? object : this.createBinding(object, objectType, this["interface"]));
};
;
module.exports = SimplyBind;
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
return module.exports;
},
13: function (require, module, exports) {
var QuickCSS, constants, helpers;
constants = require(42);
helpers = require(43);
QuickCSS = function (targetEl, property, value, important) {
var computedStyle, i, len, subEl, subProperty, subValue;
if (helpers.isIterable(targetEl)) {
for ((i = 0, len = targetEl.length); i < len; i++) {
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
QuickCSS.animation = function (name, frames) {
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
QuickCSS.register = function (rule, level, important) {
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
QuickCSS.clearRegistered = function (level) {
return helpers.clearInlineStyle(level || 0);
};
QuickCSS.UNSET = (function () {
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
return module.exports;
},
24: function (require, module, exports) {
var Checks, availSets;
availSets = {
natives: require(57),
dom: require(58)
};
Checks = (function () {
Checks.prototype.create = function () {
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
for ((i = 0, len = sets.length); i < len; i++) {
set = sets[i];
if (availSets[set]) {
this.load(availSets[set]);
}
}
}
Checks.prototype.load = function (set) {
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
return module.exports;
},
25: function (require, module, exports) {
var extend, isArray, isObject, shouldDeepExtend;
isArray = function (target) {
return Array.isArray(target);
};
isObject = function (target) {
return target && Object.prototype.toString.call(target) === '[object Object]' || isArray(target);
};
shouldDeepExtend = function (options, target, parentKey) {
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
module.exports = extend = function (options, target, sources, parentKey) {
var i, key, len, source, sourceValue, subTarget, targetValue;
if (!target || typeof target !== 'object' && typeof target !== 'function') {
target = {};
}
for ((i = 0, len = sources.length); i < len; i++) {
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
return module.exports;
},
27: function (require, module, exports) {
var QuickCSS, constants, helpers;
constants = require(59);
helpers = require(60);
QuickCSS = function (targetEl, property, value) {
var computedStyle, i, len, subEl, subProperty, subValue;
if (helpers.isIterable(targetEl)) {
for ((i = 0, len = targetEl.length); i < len; i++) {
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
QuickCSS.animation = function (name, frames) {
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
QuickCSS.register = function (rule, level) {
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
QuickCSS.clearRegistered = function (level) {
return helpers.clearInlineStyle(level || 0);
};
QuickCSS.UNSET = (function () {
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
return module.exports;
},
28: function (require, module, exports) {
!(function (win) {
'use strict';
var debug = 0 ? console.log.bind(console, '[fastdom]') : function () {};
var raf = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || (function (cb) {
return setTimeout(cb, 16);
});
function FastDom() {
var self = this;
self.reads = [];
self.writes = [];
self.raf = raf.bind(win);
debug('initialized', self);
}
FastDom.prototype = {
constructor: FastDom,
measure: function (fn, ctx) {
debug('measure');
var task = !ctx ? fn : fn.bind(ctx);
this.reads.push(task);
scheduleFlush(this);
return task;
},
mutate: function (fn, ctx) {
debug('mutate');
var task = !ctx ? fn : fn.bind(ctx);
this.writes.push(task);
scheduleFlush(this);
return task;
},
clear: function (task) {
debug('clear', task);
return remove(this.reads, task) || remove(this.writes, task);
},
extend: function (props) {
debug('extend', props);
if (typeof props != 'object') throw new Error('expected object');
var child = Object.create(this);
mixin(child, props);
child.fastdom = this;
if (child.initialize) child.initialize();
return child;
},
catch: null
};
function scheduleFlush(fastdom) {
if (!fastdom.scheduled) {
fastdom.scheduled = true;
fastdom.raf(flush.bind(null, fastdom));
debug('flush scheduled');
}
}
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
} catch (e) {
error = e;
}
fastdom.scheduled = false;
if (reads.length || writes.length) scheduleFlush(fastdom);
if (error) {
debug('task errored', error.message);
if (fastdom.catch) fastdom.catch(error); else throw error;
}
}
function runTasks(tasks) {
debug('run tasks');
var task;
while (task = tasks.shift()) task();
}
function remove(array, item) {
var index = array.indexOf(item);
return !!~index && !!array.splice(index, 1);
}
function mixin(target, source) {
for (var key in source) {
if (source.hasOwnProperty(key)) target[key] = source[key];
}
}
var exports = win.fastdom = (win.fastdom || new FastDom());
if ((typeof define) == 'function') define(function () {
return exports;
}); else if ((typeof module) == 'object') module.exports = exports;
})(typeof window !== 'undefined' ? window : this);
return module.exports;
},
29: function (require, module, exports) {
var Condition, IS, SimplyBind;
IS = require(3);
SimplyBind = require(11);
Condition = (function () {
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
}).of(this).to((function (_this) {
return function (newValue, oldValue) {
var base;
if (oldValue != null) {
return typeof (base = _this.field).emit === "function" ? base.emit('conditionChange', _this) : void 0;
}
};
})(this));
}
Condition.prototype.test = function () {
var comparison, comparisonOperators, passedComparisons, ref, targetValue;
if (!((ref = this.target) != null ? ref.state.visible : void 0)) {
return false;
}
comparison = (function () {
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
targetValue = (function (_this) {
return function () {
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
passedComparisons = comparisonOperators.filter(function (operator) {
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
Condition.validate = function (conditions) {
var validConditions;
if (conditions) {
validConditions = conditions.filter(function (condition) {
return condition.satisfied = condition.test();
});
return validConditions.length === conditions.length;
}
};
Condition.init = function (field, conditions, callback) {
return setTimeout((function (_this) {
return function () {
if (callback == null) {
callback = function () {
return field.validateConditions();
};
}
field.conditions = conditions.map(function (condition) {
return new Condition(field, condition, callback);
});
return callback();
};
})(this));
};
return Condition;
})();
module.exports = Condition;
return module.exports;
},
31: function (require, module, exports) {
module.exports = {
fontFamily: 'system-ui, sans-serif',
templates: {},
events: null,
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
clearErrorOnValid: true,
makeRoomForHelp: true
};
return module.exports;
},
32: function (require, module, exports) {
var Choice, Condition, DOM, Dropdown, IS, KEYCODES, List, SimplyBind, extend, globalDefaults, helpers, bind = function (fn, me) {
return function () {
return fn.apply(me, arguments);
};
};
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
Dropdown = (function () {
Dropdown.prototype.template = template;
Dropdown.prototype.defaults = defaults;
Dropdown.prototype._settingFilters = {
maxHeight: function (value) {
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
Dropdown.prototype._createElements = function () {
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
for ((i = 0, len = ref.length); i < len; i++) {
choice = ref[i];
this.addChoice(choice);
}
};
Dropdown.prototype._attachBindings = function () {
this._attachBindings_elState();
this._attachBindings_display();
return this._attachBindings_scrollIndicators();
};
Dropdown.prototype._attachBindings_elState = function () {
SimplyBind('help').of(this.settings).to('text').of(this.els.help).and.to((function (_this) {
return function (showHelp) {
return _this.els.help.state('showHelp', showHelp);
};
})(this));
SimplyBind('visibleChoicesCount').of(this).to((function (_this) {
return function (count) {
return _this.els.container.state('hasVisibleChoices', !!count);
};
})(this));
return SimplyBind('currentHighlighted').of(this).to((function (_this) {
return function (current, prev) {
if (prev) {
prev.el.state('hover', false);
}
if (current) {
return current.el.state('hover', true);
}
};
})(this));
};
Dropdown.prototype._attachBindings_display = function () {
SimplyBind('isOpen', {
updateOnBind: false
}).of(this).to((function (_this) {
return function (isOpen) {
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
}).of(this).to((function (_this) {
return function (newChoice, prevChoice) {
return _this._selectedCallback(newChoice, prevChoice);
};
})(this));
SimplyBind('focused', {
updateOnBind: false
}).of(this.field.state).to((function (_this) {
return function (focused) {
if (!focused) {
return _this.field.el.child.input.off('keydown.dropdownNav');
} else {
return _this.field.el.child.input.on('keydown.dropdownNav', function (event) {
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
}).of(this.field.state).to((function (_this) {
return function (focused) {
if (!focused) {
return DOM(document).off('keypress.dropdownTypeBuffer');
} else {
return DOM(document).on('keypress.dropdownTypeBuffer', function (event) {
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
}).of(this).to((function (_this) {
return function () {
clearTimeout(_this.typeBufferTimeout);
return _this.typeBufferTimeout = setTimeout(function () {
return _this.typeBuffer = '';
}, 1500);
};
})(this)).and.to((function (_this) {
return function (buffer) {
var choice, i, len, ref;
if (buffer) {
ref = _this.visibleChoices;
for ((i = 0, len = ref.length); i < len; i++) {
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
Dropdown.prototype._attachBindings_scrollIndicators = function () {
SimplyBind('scrollTop', {
updateEvenIfSame: true
}).of(this.els.list.raw).to((function (_this) {
return function (scrollTop) {
var showBottomIndicator, showTopIndicator;
showTopIndicator = scrollTop > 0;
showBottomIndicator = _this.els.list.raw.scrollHeight - _this.els.list.raw.clientHeight > scrollTop;
_this.els.scrollIndicatorUp.state('visible', showTopIndicator);
return _this.els.scrollIndicatorDown.state('visible', showBottomIndicator);
};
})(this)).condition((function (_this) {
return function () {
return _this.isOpen && !_this.settings.help && _this.els.list.raw.scrollHeight !== _this.els.list.raw.clientHeight && _this.els.list.raw.clientHeight >= 100;
};
})(this)).updateOn('event:scroll').of(this.els.list.raw).updateOn('isOpen').of(this);
this.els.scrollIndicatorUp.on('mouseenter', (function (_this) {
return function () {
return _this.list.startScrolling('up');
};
})(this));
this.els.scrollIndicatorUp.on('mouseleave', (function (_this) {
return function () {
return _this.list.stopScrolling();
};
})(this));
this.els.scrollIndicatorDown.on('mouseenter', (function (_this) {
return function () {
return _this.list.startScrolling('down');
};
})(this));
return this.els.scrollIndicatorDown.on('mouseleave', (function (_this) {
return function () {
return _this.list.stopScrolling();
};
})(this));
};
Dropdown.prototype.addChoice = function (config) {
var i, item, len, newChoice;
if (IS.array(config)) {
for ((i = 0, len = config.length); i < len; i++) {
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
Dropdown.prototype.appendTo = function (target) {
return this.els.container.appendTo(target);
};
Dropdown.prototype.onSelected = function (callback) {
return this._selectedCallback = callback;
};
Dropdown.prototype.findChoice = function (providedValue, byLabel) {
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
};
Dropdown.prototype.findChoiceAny = function (providedValue) {
return this.findChoice(providedValue) || this.findChoice(providedValue, true);
};
Dropdown.prototype.highlightPrev = function () {
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
Dropdown.prototype.highlightNext = function () {
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
List = (function () {
function List(dropdown) {
var ref;
this.dropdown = dropdown;
this.choiceInView = bind(this.choiceInView, this);
(ref = this.dropdown, this.els = ref.els, this.field = ref.field, this.settings = ref.settings);
this.el = this.els.list;
this.container = this.els.container;
}
List.prototype.calcDisplay = function () {
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
List.prototype.setDimensions = function (height, width) {
if (height != null) {
this.el.style('maxHeight', height);
}
if (width != null) {
return this.el.style('minWidth', width);
}
};
List.prototype.setTranslate = function (translation) {
this.translation = translation;
translation *= -1;
return this.container.style('transform', "translateY(" + translation + "px)");
};
List.prototype.scrollToChoice = function (choice, offset) {
var distaneFromTop, selectedHeight;
if (offset == null) {
offset = 3;
}
distaneFromTop = choice.el.raw.offsetTop;
selectedHeight = choice.el.height;
return this.el.raw.scrollTop = distaneFromTop - selectedHeight * offset;
};
List.prototype.scrollDown = function (choice) {
return this.el.raw.scrollTop += choice.el.height;
};
List.prototype.scrollUp = function (choice) {
return this.el.raw.scrollTop -= choice.el.height;
};
List.prototype.choiceInView = function (choice) {
var choiceRect, downPadding, listRect, upPadding;
choiceRect = choice.el.rect;
listRect = this.el.rect;
upPadding = this.els.scrollIndicatorUp.state('visible') ? parseFloat(this.els.scrollIndicatorUp.styleSafe('height', true)) : void 0;
downPadding = this.els.scrollIndicatorDown.state('visible') ? parseFloat(this.els.scrollIndicatorDown.styleSafe('height', true)) : void 0;
return choiceRect.bottom <= listRect.bottom - downPadding && choiceRect.top >= listRect.top + upPadding;
};
List.prototype.startScrolling = function (direction) {
return this.scrollIntervalID = setInterval((function (_this) {
return function () {
return _this.el.raw.scrollTop += direction === 'up' ? -20 : 20;
};
})(this), 50);
};
List.prototype.stopScrolling = function () {
return clearInterval(this.scrollIntervalID);
};
return List;
})();
Choice = (function () {
function Choice(dropdown, settings, list, index) {
var ref, ref1;
this.dropdown = dropdown;
this.settings = settings;
this.list = list;
this.index = index;
(ref = this.settings, this.label = ref.label, this.value = ref.value, this.conditions = ref.conditions);
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
Condition.init(this, this.conditions, (function (_this) {
return function () {
return _this.unavailable = !Condition.validate(_this.conditions);
};
})(this));
}
}
Choice.prototype._attachBindings = function () {
return (function (_this) {
return function () {
SimplyBind('visible').of(_this).to(function (visible, prev) {
_this.dropdown.visibleChoicesCount += visible ? 1 : -1;
_this.el.state('visible', visible);
if (visible) {
_this.dropdown.visibleChoices.push(_this);
if (IS.defined(prev)) {
return _this.dropdown.visibleChoices.sort(function (a, b) {
return a.index - b.index;
});
}
} else {
return helpers.removeItem(_this.dropdown.visibleChoices, _this);
}
});
SimplyBind('selected', {
updateOnBind: false
}).of(_this).to(function (selected) {
return _this.el.state('selected', selected);
});
SimplyBind('unavailable', {
updateOnBind: false
}).of(_this).to(function (unavailable) {
return _this.el.state('unavailable', unavailable);
}).and.to(function (unavailable) {
if (unavailable) {
return _this.toggle(false, true);
}
});
SimplyBind('event:click').of(_this.el).to(function () {
return _this.dropdown.lastSelected = _this;
});
SimplyBind('event:mousedown').of(_this.el).to(function (event) {
event.preventDefault();
return event.stopPropagation();
});
return SimplyBind('event:mouseenter').of(_this.el).to(function () {
return _this.dropdown.currentHighlighted = _this;
});
};
})(this)();
};
Choice.prototype.toggle = function (newValue, unavailable) {
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
Mask = (function () {
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
Mask.prototype.getState = function (pattern, rawValue) {
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
Mask.prototype.getPlaceholder = function (pattern) {
var char, j, len, placeholder;
if (IS["function"](pattern)) {} else {
placeholder = '';
for ((j = 0, len = pattern.length); j < len; j++) {
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
Mask.prototype.resolvePattern = function (pattern, input, state) {
var char, copy, i, j, len, offset, trapIndexes;
pattern = typeof pattern === 'function' ? pattern(input, this.getState(pattern, input)) : pattern;
offset = 0;
trapIndexes = [];
copy = pattern.slice();
for ((i = j = 0, len = copy.length); j < len; i = ++j) {
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
Mask.prototype.setPattern = function (string, updateValue, updateField) {
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
Mask.prototype.parsePattern = function (string) {
var char, escaped, i, j, len, pattern;
switch (false) {
case string !== 'EMAIL':
return maskAddons.emailMask.mask;
case string !== 'PHONE':
this.patternSetter = function (value) {
return helpers.repeat('#', Math.max(7, value.length));
};
this.guide = false;
return '#';
case string !== 'NAME':
this.patternSetter = function (value) {
value = value.replace(this.placeholderRegex, '').trim();
return helpers.repeat('a', Math.max(2, value.length));
};
return 'a';
case string !== 'FULLNAME':
this.patternSetter = function (value) {
var split;
if (value[value.length - 1] === ' ') {
value += 'x';
}
split = value.replace(this.placeholderRegex, '').trim().split(/\s+/);
if (split.length === 4) {
return;
}
return split.map(function (part) {
return helpers.repeat('a', Math.max(2, part.length));
}).join(' ');
};
return 'a';
case string !== 'DATE':
return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
case !(string[0] === 'DATE' && IS.string(string[1])):
return string[1].split('').map((function (_this) {
return function (char) {
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
for ((i = j = 0, len = string.length); j < len; i = ++j) {
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
Mask.prototype.parseTransform = function (string) {
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
Mask.prototype.setValue = function (input) {
var caretTrapIndexes, conformedValue, indexesOfPipedChars, newPattern, pattern, ref, state, transformed;
if (this.patternSetter) {
newPattern = this.patternSetter(input) || this.pattern;
if (newPattern !== this.patternRaw && newPattern !== this.pattern) {
this.setPattern(newPattern, false);
}
}
(ref = this.resolvePattern(this.pattern, input), caretTrapIndexes = ref.caretTrapIndexes, pattern = ref.pattern);
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
Mask.prototype.validate = function (input) {
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
for ((i = j = 0, len = pattern.length); j < len; i = ++j) {
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
Mask.prototype.isEmpty = function () {
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
for ((i = j = 0, len = pattern.length); j < len; i = ++j) {
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
anyArrow: function (code) {
return code === keyCodes.up || code === keyCodes.down || code === keyCodes.left || code === keyCodes.right;
},
anyModifier: function (code) {
return code === keyCodes.ctrl || code === keyCodes.alt || code === keyCodes.shift || code === keyCodes["super"] || code === keyCodes.super2;
},
anyAlpha: function (code) {
return (97 <= code && code <= 122) || (65 <= code && code <= 90);
},
anyNumeric: function (code) {
return (48 <= code && code <= 57);
},
anyAlphaNumeric: function (code) {
return keyCodes.anyAlpha(code) || keyCodes.anyNumeric(code);
},
anyPrintable: function (code) {
return keyCodes.anyAlpha(code) || keyCodes.anyNumeric(code) || code === keyCodes.hyphen || code === keyCodes.underscore || code === keyCodes.question || code === keyCodes.exclamation || code === keyCodes.frontslash || code === keyCodes.backslash || code === keyCodes.comma || code === keyCodes.period || code === keyCodes.space;
}
};
return module.exports;
},
35: function (require, module, exports) {
var CHECKMARK_WIDTH, COLORS, DOM, helpers;
DOM = require(2);
helpers = require(1);
COLORS = require(66);
CHECKMARK_WIDTH = 26;
exports.default = DOM.template(['div', {
ref: 'field',
style: {
position: 'relative',
verticalAlign: 'top',
display: 'none',
boxSizing: 'border-box',
fontFamily: function (field) {
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
}, ['div', {
ref: 'label',
styleAfterInsert: true,
style: {
position: 'absolute',
zIndex: 1,
top: function (field) {
return this.styleParsed('fontSize', true) * 0.7;
},
left: function (field) {
var ref;
return helpers.shorthandSideValue(field.settings.padding, 'left') + (((ref = field.el.child.icon) != null ? ref.width : void 0) || 0);
},
padding: function (field) {
return "0 " + field.settings.inputPadding + "px";
},
fontFamily: 'inherit',
fontSize: function (field) {
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
}], ['div', {
ref: 'innerwrap',
style: {
position: 'relative',
height: function (field) {
return field.settings.height;
},
backgroundColor: 'white',
borderWidth: function (field) {
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
}, ['input', {
ref: 'input',
type: 'text',
styleAfterInsert: true,
style: {
position: 'relative',
zIndex: 3,
display: 'inline-block',
verticalAlign: 'top',
height: function () {
return this.parent.styleSafe('height', 1) || this.parent.styleSafe('height');
},
width: function (field) {
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
padding: function (field) {
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
fontSize: function (field) {
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
transform: function (field) {
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
}], ['div', {
ref: 'placeholder',
styleAfterInsert: true,
style: {
position: 'absolute',
zIndex: 2,
top: '0px',
left: function (field) {
var ref;
return ((ref = field.el.child.icon) != null ? ref.width : void 0) || 0;
},
fontFamily: function (field) {
return field.el.child.input.styleSafe('fontFamily', 1);
},
fontSize: function (field) {
return field.el.child.input.styleSafe('fontSize', 1);
},
padding: function (field) {
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
transform: function (field) {
return field.el.child.input.raw.style.transform;
}
}
}
}
}]], ['div', {
ref: 'help',
styleAfterInsert: true,
style: {
position: 'absolute',
top: '110%',
left: function (field) {
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
}]]);

var icon = exports.icon = DOM.template(['div', {
ref: 'icon',
styleAfterInsert: true,
style: {
position: 'relative',
zIndex: 2,
display: 'inline-block',
boxSizing: 'border-box',
width: function (field) {
return field.settings.iconSize;
},
height: function (field) {
return field.settings.iconSize;
},
fontSize: function (field) {
return field.settings.iconSize;
},
paddingLeft: function (field) {
return field.settings.inputPadding;
},
paddingTop: function (field) {
return this.parent.styleParsed('height', 1) / 2 - field.settings.iconSize / 2;
},
lineHeight: '1em',
userSelect: 'none'
},
methods: {
width: {
get: function () {
if (this._inserted) {
return this.raw.offsetWidth;
} else {
return this.styleParsed('width', 1) || this.related.settings.iconSize;
}
}
}
}
}]);
var checkmark = exports.checkmark = DOM.template(['div', {
ref: 'checkmark',
styleAfterInsert: true,
style: {
position: 'relative',
zIndex: 4,
display: 'none',
width: 26,
height: '100%',
paddingTop: function () {
return this.parent.styleParsed('height', 1) / 2 - 13;
},
paddingRight: function (field) {
return field.settings.inputPadding;
},
verticalAlign: 'top',
$filled: {
display: 'inline-block'
}
}
}, ['div', {
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
}, ['div', {
ref: 'checkmark_mask1',
styleAfterInsert: true,
style: {
position: 'absolute',
top: '-4px',
left: '-10px',
width: '15px',
height: '30px',
borderRadius: '30px 0 0 30px',
backgroundColor: function (field) {
return helpers.defaultColor(field.els.innerwrap.styleSafe('backgroundColor', 1), 'white');
},
transform: 'rotate(-45deg)',
transformOrigin: '15px 15px 0'
}
}], ['div', {
ref: 'checkmark_mask2',
styleAfterInsert: true,
style: {
position: 'absolute',
top: '-5px',
left: '8px',
width: '15px',
height: '30px',
borderRadius: '0 30px 30px 0',
backgroundColor: function (field) {
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
}], ['div', {
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
}, ['div', {
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
}], ['div', {
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
}]], ['div', {
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
}], ['div', {
ref: 'checkmark_patch',
styleAfterInsert: true,
style: {
position: 'absolute',
zIndex: 1,
top: '-2px',
left: '6px',
width: '4px',
height: '28px',
backgroundColor: function (field) {
return helpers.defaultColor(field.els.innerwrap.styleSafe('backgroundColor', 1), 'white');
},
transform: 'rotate(-45deg)'
}
}]]]);
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
exports.QUAD_SHORTHANDS.forEach(function (property) {
var direction, i, len, ref;
exports.REQUIRES_UNIT_VALUE.push(property);
ref = exports.DIRECTIONS;
for ((i = 0, len = ref.length); i < len; i++) {
direction = ref[i];
exports.REQUIRES_UNIT_VALUE.push(property + '-' + direction);
}
});
return module.exports;
},
43: function (require, module, exports) {
var constants, helpers, sampleStyle, styleConfig;
constants = require(42);
sampleStyle = document.createElement('div').style;
helpers = exports;
helpers.includes = function (target, item) {
return target && target.indexOf(item) !== -1;
};
helpers.isIterable = function (target) {
return target && typeof target === 'object' && typeof target.length === 'number' && !target.nodeType;
};
helpers.toKebabCase = function (string) {
return string.replace(constants.REGEX_KEBAB, function (e, letter) {
return "-" + (letter.toLowerCase());
});
};
helpers.isPropSupported = function (property) {
return typeof sampleStyle[property] !== 'undefined';
};
helpers.isValueSupported = function (property, value) {
if (window.CSS && window.CSS.supports) {
return window.CSS.supports(property, value);
} else {
sampleStyle[property] = value;
return sampleStyle[property] === '' + value;
}
};
helpers.getPrefix = function (property, skipInitialCheck) {
var j, len1, prefix, ref;
if (skipInitialCheck || !helpers.isPropSupported(property)) {
ref = constants.POSSIBLE_PREFIXES;
for ((j = 0, len1 = ref.length); j < len1; j++) {
prefix = ref[j];
if (helpers.isPropSupported("-" + prefix + "-" + property)) {
return "-" + prefix + "-";
}
}
}
return '';
};
helpers.normalizeProperty = function (property) {
property = helpers.toKebabCase(property);
if (helpers.isPropSupported(property)) {
return property;
} else {
return "" + (helpers.getPrefix(property, true)) + property;
}
};
helpers.normalizeValue = function (property, value) {
if (helpers.includes(constants.REQUIRES_UNIT_VALUE, property) && value !== null) {
value = '' + value;
if (constants.REGEX_DIGITS.test(value) && !constants.REGEX_LEN_VAL.test(value) && !constants.REGEX_SPACE.test(value)) {
value += property === 'line-height' ? 'em' : 'px';
}
}
return value;
};
helpers.sort = function (array) {
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
helpers.hash = function (string) {
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
helpers.ruleToString = function (rule, important) {
var j, len1, output, prop, property, props, value;
output = '';
props = helpers.sort(Object.keys(rule));
for ((j = 0, len1 = props.length); j < len1; j++) {
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
helpers.inlineStyle = function (rule, valueToStore, level) {
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
helpers.clearInlineStyle = function (level) {
var config, j, key, keys, len1;
if (config = styleConfig[level]) {
if (!config.content) {
return;
}
config.el.textContent = config.content = '';
keys = Object.keys(config.cache);
for ((j = 0, len1 = keys.length); j < len1; j++) {
key = keys[j];
config.cache[key] = null;
}
}
};
return module.exports;
},
57: function (require, module, exports) {
var exports;
module.exports = exports = {
defined: function (subject) {
return subject !== void 0;
},
array: function (subject) {
return subject instanceof Array;
},
object: function (subject) {
return typeof subject === 'object' && subject;
},
objectPlain: function (subject) {
return exports.object(subject) && Object.prototype.toString.call(subject) === '[object Object]' && subject.constructor === Object;
},
string: function (subject) {
return typeof subject === 'string';
},
number: function (subject) {
return typeof subject === 'number' && !isNaN(subject);
},
numberLoose: function (subject) {
return exports.number(subject) || exports.string(subject) && exports.number(Number(subject));
},
"function": function (subject) {
return typeof subject === 'function';
},
iterable: function (subject) {
return exports.object(subject) && exports.number(subject.length);
}
};
return module.exports;
},
58: function (require, module, exports) {
var exports;
module.exports = exports = {
domDoc: function (subject) {
return subject && subject.nodeType === 9;
},
domEl: function (subject) {
return subject && subject.nodeType === 1;
},
domText: function (subject) {
return subject && subject.nodeType === 3;
},
domNode: function (subject) {
return exports.domEl(subject) || exports.domText(subject);
},
domTextarea: function (subject) {
return subject && subject.nodeName === 'TEXTAREA';
},
domInput: function (subject) {
return subject && subject.nodeName === 'INPUT';
},
domSelect: function (subject) {
return subject && subject.nodeName === 'SELECT';
},
domField: function (subject) {
return exports.domInput(subject) || exports.domTextarea(subject) || exports.domSelect(subject);
}
};
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
exports.QUAD_SHORTHANDS.forEach(function (property) {
var direction, i, len, ref;
exports.REQUIRES_UNIT_VALUE.push(property);
ref = exports.DIRECTIONS;
for ((i = 0, len = ref.length); i < len; i++) {
direction = ref[i];
exports.REQUIRES_UNIT_VALUE.push(property + '-' + direction);
}
});
return module.exports;
},
60: function (require, module, exports) {
var constants, helpers, sampleStyle, styleConfig;
constants = require(59);
sampleStyle = document.createElement('div').style;
helpers = exports;
helpers.includes = function (target, item) {
return target && target.indexOf(item) !== -1;
};
helpers.isIterable = function (target) {
return target && typeof target === 'object' && typeof target.length === 'number' && !target.nodeType;
};
helpers.toKebabCase = function (string) {
return string.replace(constants.REGEX_KEBAB, function (e, letter) {
return "-" + (letter.toLowerCase());
});
};
helpers.isPropSupported = function (property) {
return typeof sampleStyle[property] !== 'undefined';
};
helpers.isValueSupported = function (property, value) {
if (window.CSS && window.CSS.supports) {
return window.CSS.supports(property, value);
} else {
sampleStyle[property] = value;
return sampleStyle[property] === '' + value;
}
};
helpers.getPrefix = function (property, skipInitialCheck) {
var j, len1, prefix, ref;
if (skipInitialCheck || !helpers.isPropSupported(property)) {
ref = constants.POSSIBLE_PREFIXES;
for ((j = 0, len1 = ref.length); j < len1; j++) {
prefix = ref[j];
if (helpers.isPropSupported("-" + prefix + "-" + property)) {
return "-" + prefix + "-";
}
}
}
return '';
};
helpers.normalizeProperty = function (property) {
property = helpers.toKebabCase(property);
if (helpers.isPropSupported(property)) {
return property;
} else {
return "" + (helpers.getPrefix(property, true)) + property;
}
};
helpers.normalizeValue = function (property, value) {
if (helpers.includes(constants.REQUIRES_UNIT_VALUE, property) && value !== null) {
value = '' + value;
if (constants.REGEX_DIGITS.test(value) && !constants.REGEX_LEN_VAL.test(value) && !constants.REGEX_SPACE.test(value)) {
value += property === 'line-height' ? 'em' : 'px';
}
}
return value;
};
helpers.sort = function (array) {
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
helpers.hash = function (string) {
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
helpers.ruleToString = function (rule) {
var j, len1, output, prop, property, props, value;
output = '';
props = helpers.sort(Object.keys(rule));
for ((j = 0, len1 = props.length); j < len1; j++) {
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
helpers.inlineStyle = function (rule, valueToStore, level) {
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
helpers.clearInlineStyle = function (level) {
var config, j, key, keys, len1;
if (config = styleConfig[level]) {
if (!config.content) {
return;
}
config.el.textContent = config.content = '';
keys = Object.keys(config.cache);
for ((j = 0, len1 = keys.length); j < len1; j++) {
key = keys[j];
config.cache[key] = null;
}
}
};
return module.exports;
},
62: function (require, module, exports) {
var DOM, SVG, helpers;
DOM = require(2);
SVG = require(74);
helpers = require(1);
exports.default = DOM.template(['div', {
ref: 'dropdown',
styleAfterInsert: true,
style: {
position: 'absolute',
zIndex: 10,
overflow: 'hidden',
top: function (dropdown) {
if (dropdown.field.type === 'text') {
return this.parent.raw.style.height;
} else {
return '-7px';
}
},
left: function () {
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
}]);

var list = exports.list = DOM.template(['div', {
ref: 'list',
passStateToChildren: false,
style: {
position: 'relative',
overflow: 'scroll',
overflowScrolling: 'touch',
overflowStyle: '-ms-autohiding-scrollbar'
}
}]);
var choice = exports.choice = DOM.template(['div', {
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
}, ['div', {
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
}, SVG.checkmark], ['div', {
styleAfterInsert: true,
style: {
display: 'inline-block',
overflow: 'hidden',
textOverflow: 'ellipsis',
whiteSpace: 'nowrap',
wordWrap: 'normal',
maxWidth: function () {
return "calc(100% - " + (this.prev.styleSafe('width', true)) + ")";
},
paddingRight: '10px',
lineHeight: '20px',
fontSize: '11px',
fontFamily: function (dropdown) {
return dropdown.settings.fontFamily;
},
color: 'inherit',
boxSizing: 'border-box'
}
}]]);
var scrollIndicatorUp = exports.scrollIndicatorUp = DOM.template(['div', {
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
}, ['div', {
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
}, SVG.caretUp]]);
var scrollIndicatorDown = exports.scrollIndicatorDown = DOM.template(['div', {
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
}, ['div', {
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
}, SVG.caretDown]]);
var help = exports.help = DOM.template(['div', {
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
}]);
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
return module.exports;
},
64: function (require, module, exports) {
!(function (e, r) {
"object" == typeof exports && "object" == typeof module ? module.exports = r() : "function" == typeof define && define.amd ? define([], r) : "object" == typeof exports ? exports.textMaskCore = r() : e.textMaskCore = r();
})(this, function () {
return (function (e) {
function r(n) {
if (t[n]) return t[n].exports;
var o = t[n] = {
exports: {},
id: n,
loaded: !1
};
return (e[n].call(o.exports, o, o.exports, r), o.loaded = !0, o.exports);
}
var t = {};
return (r.m = e, r.c = t, r.p = "", r(0));
})([function (e, r, t) {
"use strict";
function n(e) {
return e && e.__esModule ? e : {
default: e
};
}
Object.defineProperty(r, "__esModule", {
value: !0
});
var o = t(3);
Object.defineProperty(r, "conformToMask", {
enumerable: !0,
get: function () {
return n(o).default;
}
});
var i = t(2);
Object.defineProperty(r, "adjustCaretPosition", {
enumerable: !0,
get: function () {
return n(i).default;
}
});
var a = t(5);
Object.defineProperty(r, "createTextMaskInputElement", {
enumerable: !0,
get: function () {
return n(a).default;
}
});
}, function (e, r) {
"use strict";
(Object.defineProperty(r, "__esModule", {
value: !0
}), r.placeholderChar = "_");
}, function (e, r) {
"use strict";
function t(e) {
var r = e.previousConformedValue, t = void 0 === r ? o : r, i = e.previousPlaceholder, a = void 0 === i ? o : i, u = e.currentCaretPosition, l = void 0 === u ? 0 : u, s = e.conformedValue, f = e.rawValue, d = e.placeholderChar, c = e.placeholder, v = e.indexesOfPipedChars, p = void 0 === v ? n : v, h = e.caretTrapIndexes, g = void 0 === h ? n : h;
if (0 === l) return 0;
var m = f.length, y = t.length, b = c.length, C = s.length, P = m - y, x = P > 0, O = 0 === y, k = P > 1 && !x && !O;
if (k) return l;
var j = x && (t === s || s === c), M = 0, T = void 0, w = void 0;
if (j) M = l - P; else {
var _ = s.toLowerCase(), V = f.toLowerCase(), S = V.substr(0, l).split(o), N = S.filter(function (e) {
return _.indexOf(e) !== -1;
});
w = N[N.length - 1];
var E = a.substr(0, N.length).split(o).filter(function (e) {
return e !== d;
}).length, A = c.substr(0, N.length).split(o).filter(function (e) {
return e !== d;
}).length, R = A !== E, I = void 0 !== a[N.length - 1] && void 0 !== c[N.length - 2] && a[N.length - 1] !== d && a[N.length - 1] !== c[N.length - 1] && a[N.length - 1] === c[N.length - 2];
!x && (R || I) && E > 0 && c.indexOf(w) > -1 && void 0 !== f[l] && ((T = !0, w = f[l]));
for (var J = p.map(function (e) {
return _[e];
}), q = J.filter(function (e) {
return e === w;
}).length, F = N.filter(function (e) {
return e === w;
}).length, L = c.substr(0, c.indexOf(d)).split(o).filter(function (e, r) {
return e === w && f[r] !== e;
}).length, W = L + F + q + (T ? 1 : 0), z = 0, B = 0; B < C; B++) {
var D = _[B];
if ((M = B + 1, D === w && z++, z >= W)) break;
}
}
if (x) {
for (var G = M, H = M; H <= b; H++) if ((c[H] === d && (G = H), c[H] === d || g.indexOf(H) !== -1 || H === b)) return G;
} else if (T) {
for (var K = M - 1; K >= 0; K--) if (s[K] === w || g.indexOf(K) !== -1 || 0 === K) return K;
} else for (var Q = M; Q >= 0; Q--) if (c[Q - 1] === d || g.indexOf(Q) !== -1 || 0 === Q) return Q;
}
(Object.defineProperty(r, "__esModule", {
value: !0
}), r.default = t);
var n = [], o = "";
}, function (e, r, t) {
"use strict";
function n() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : a, t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, n = t.guide, u = void 0 === n || n, l = t.previousConformedValue, s = void 0 === l ? a : l, f = t.placeholderChar, d = void 0 === f ? i.placeholderChar : f, c = t.placeholder, v = void 0 === c ? ((0, o.convertMaskToPlaceholder))(r, d) : c, p = t.currentCaretPosition, h = t.keepCharPositions, g = u === !1 && void 0 !== s, m = e.length, y = s.length, b = v.length, C = r.length, P = m - y, x = P > 0, O = p + (x ? -P : 0), k = O + Math.abs(P);
if (h === !0 && !x) {
for (var j = a, M = O; M < k; M++) v[M] === d && (j += d);
e = e.slice(0, O) + j + e.slice(O, m);
}
for (var T = e.split(a).map(function (e, r) {
return {
char: e,
isNew: r >= O && r < k
};
}), w = m - 1; w >= 0; w--) {
var _ = T[w].char;
if (_ !== d) {
var V = w >= O && y === C;
_ === v[V ? w - P : w] && T.splice(w, 1);
}
}
var S = a, N = !1;
e: for (var E = 0; E < b; E++) {
var A = v[E];
if (A === d) {
if (T.length > 0) for (; T.length > 0; ) {
var R = T.shift(), I = R.char, J = R.isNew;
if (I === d && g !== !0) {
S += d;
continue e;
}
if (r[E].test(I)) {
if (h === !0 && J !== !1 && s !== a && u !== !1 && x) {
for (var q = T.length, F = null, L = 0; L < q; L++) {
var W = T[L];
if (W.char !== d && W.isNew === !1) break;
if (W.char === d) {
F = L;
break;
}
}
null !== F ? ((S += I, T.splice(F, 1))) : E--;
} else S += I;
continue e;
}
N = !0;
}
g === !1 && (S += v.substr(E, b));
break;
}
S += A;
}
if (g && x === !1) {
for (var z = null, B = 0; B < S.length; B++) v[B] === d && (z = B);
S = null !== z ? S.substr(0, z + 1) : a;
}
return {
conformedValue: S,
meta: {
someCharsRejected: N
}
};
}
(Object.defineProperty(r, "__esModule", {
value: !0
}), r.default = n);
var o = t(4), i = t(1), a = "";
}, function (e, r, t) {
"use strict";
function n() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : l, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : u.placeholderChar;
if (e.indexOf(r) !== -1) throw new Error("Placeholder character must not be used as part of the mask. Please specify a character that is not present in your mask as your placeholder character.\n\n" + ("The placeholder character that was received is: " + JSON.stringify(r) + "\n\n") + ("The mask that was received is: " + JSON.stringify(e)));
return e.map(function (e) {
return e instanceof RegExp ? r : e;
}).join("");
}
function o(e) {
return "string" == typeof e || e instanceof String;
}
function i(e) {
return "number" == typeof e && void 0 === e.length && !isNaN(e);
}
function a(e) {
for (var r = [], t = void 0; (t = e.indexOf(s), t !== -1); ) (r.push(t), e.splice(t, 1));
return {
maskWithoutCaretTraps: e,
indexes: r
};
}
(Object.defineProperty(r, "__esModule", {
value: !0
}), r.convertMaskToPlaceholder = n, r.isString = o, r.isNumber = i, r.processCaretTraps = a);
var u = t(1), l = [], s = "[]";
}, function (e, r, t) {
"use strict";
function n(e) {
return e && e.__esModule ? e : {
default: e
};
}
function o(e) {
var r = {
previousConformedValue: void 0,
previousPlaceholder: void 0
};
return {
state: r,
update: function (t) {
var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e, o = n.inputElement, s = n.mask, d = n.guide, m = n.pipe, b = n.placeholderChar, C = void 0 === b ? p.placeholderChar : b, P = n.keepCharPositions, x = void 0 !== P && P, O = n.showMask, k = void 0 !== O && O;
if (("undefined" == typeof t && (t = o.value), t !== r.previousConformedValue)) {
("undefined" == typeof s ? "undefined" : l(s)) === y && void 0 !== s.pipe && void 0 !== s.mask && ((m = s.pipe, s = s.mask));
var j = void 0, M = void 0;
if ((s instanceof Array && (j = ((0, v.convertMaskToPlaceholder))(s, C)), s !== !1)) {
var T = a(t), w = o.selectionEnd, _ = r.previousConformedValue, V = r.previousPlaceholder, S = void 0;
if (("undefined" == typeof s ? "undefined" : l(s)) === h) {
if ((M = s(T, {
currentCaretPosition: w,
previousConformedValue: _,
placeholderChar: C
}), M === !1)) return;
var N = ((0, v.processCaretTraps))(M), E = N.maskWithoutCaretTraps, A = N.indexes;
(M = E, S = A, j = ((0, v.convertMaskToPlaceholder))(M, C));
} else M = s;
var R = {
previousConformedValue: _,
guide: d,
placeholderChar: C,
pipe: m,
placeholder: j,
currentCaretPosition: w,
keepCharPositions: x
}, I = ((0, c.default))(T, M, R), J = I.conformedValue, q = ("undefined" == typeof m ? "undefined" : l(m)) === h, F = {};
q && ((F = m(J, u({
rawValue: T
}, R)), F === !1 ? F = {
value: _,
rejected: !0
} : ((0, v.isString))(F) && (F = {
value: F
})));
var L = q ? F.value : J, W = ((0, f.default))({
previousConformedValue: _,
previousPlaceholder: V,
conformedValue: L,
placeholder: j,
rawValue: T,
currentCaretPosition: w,
placeholderChar: C,
indexesOfPipedChars: F.indexesOfPipedChars,
caretTrapIndexes: S
}), z = L === j && 0 === W, B = k ? j : g, D = z ? B : L;
(r.previousConformedValue = D, r.previousPlaceholder = j, o.value !== D && ((o.value = D, i(o, W))));
}
}
}
};
}
function i(e, r) {
document.activeElement === e && (b ? C(function () {
return e.setSelectionRange(r, r, m);
}, 0) : e.setSelectionRange(r, r, m));
}
function a(e) {
if (((0, v.isString))(e)) return e;
if (((0, v.isNumber))(e)) return String(e);
if (void 0 === e || null === e) return g;
throw new Error("The 'value' provided to Text Mask needs to be a string or a number. The value received was:\n\n " + JSON.stringify(e));
}
Object.defineProperty(r, "__esModule", {
value: !0
});
var u = Object.assign || (function (e) {
for (var r = 1; r < arguments.length; r++) {
var t = arguments[r];
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
}
return e;
}), l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
return typeof e;
} : function (e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
r.default = o;
var s = t(2), f = n(s), d = t(3), c = n(d), v = t(4), p = t(1), h = "function", g = "", m = "none", y = "object", b = "undefined" != typeof navigator && (/Android/i).test(navigator.userAgent), C = "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : setTimeout;
}]);
});
return module.exports;
},
65: function (require, module, exports) {
!(function (e, t) {
"object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.textMaskAddons = t() : e.textMaskAddons = t();
})(this, function () {
return (function (e) {
function t(r) {
if (n[r]) return n[r].exports;
var o = n[r] = {
exports: {},
id: r,
loaded: !1
};
return (e[r].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports);
}
var n = {};
return (t.m = e, t.c = n, t.p = "", t(0));
})([function (e, t, n) {
"use strict";
function r(e) {
return e && e.__esModule ? e : {
default: e
};
}
Object.defineProperty(t, "__esModule", {
value: !0
});
var o = n(1);
Object.defineProperty(t, "createAutoCorrectedDatePipe", {
enumerable: !0,
get: function () {
return r(o).default;
}
});
var i = n(2);
Object.defineProperty(t, "createNumberMask", {
enumerable: !0,
get: function () {
return r(i).default;
}
});
var u = n(3);
Object.defineProperty(t, "emailMask", {
enumerable: !0,
get: function () {
return r(u).default;
}
});
}, function (e, t) {
"use strict";
function n() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "mm dd yyyy";
return function (t) {
var n = [], r = e.split(/[^dmy]+/), o = {
dd: 31,
mm: 12,
yy: 99,
yyyy: 9999
}, i = {
dd: 1,
mm: 1,
yy: 0,
yyyy: 1
}, u = t.split("");
r.forEach(function (t) {
var r = e.indexOf(t), i = parseInt(o[t].toString().substr(0, 1), 10);
parseInt(u[r], 10) > i && ((u[r + 1] = u[r], u[r] = 0, n.push(r)));
});
var c = r.some(function (n) {
var r = e.indexOf(n), u = n.length, c = t.substr(r, u).replace(/\D/g, ""), l = parseInt(c, 10);
return l > o[n] || c.length === u && l < i[n];
});
return !c && ({
value: u.join(""),
indexesOfPipedChars: n
});
};
}
(Object.defineProperty(t, "__esModule", {
value: !0
}), t.default = n);
}, function (e, t) {
"use strict";
function n() {
function e() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : c, t = e.length;
if (e === c || e[0] === h[0] && 1 === t) return h.split(c).concat([v]).concat(m.split(c));
if (e === S && M) return h.split(c).concat(["0", S, v]).concat(m.split(c));
var n = e.lastIndexOf(S), u = n !== -1, l = e[0] === s && I, a = void 0, g = void 0, b = void 0;
if ((e.slice(V * -1) === m && (e = e.slice(0, V * -1)), u && (M || D) ? ((a = e.slice(e.slice(0, $) === h ? $ : 0, n), g = e.slice(n + 1, t), g = r(g.replace(f, c)))) : a = e.slice(0, $) === h ? e.slice($) : e, N && ("undefined" == typeof N ? "undefined" : i(N)) === p)) {
var O = "." === _ ? "[.]" : "" + _, j = (a.match(new RegExp(O, "g")) || []).length;
a = a.slice(0, N + j * q);
}
return (a = a.replace(f, c), A || (a = a.replace(/^0+(0$|[^0])/, "$1")), a = x ? o(a, _) : a, b = r(a), (u && M || D === !0) && ((e[n - 1] !== S && b.push(y), b.push(S, y), g && ((("undefined" == typeof C ? "undefined" : i(C)) === p && (g = g.slice(0, C)), b = b.concat(g))), D === !0 && e[n - 1] === S && b.push(v))), $ > 0 && (b = h.split(c).concat(b)), l && ((b.length === $ && b.push(v), b = [d].concat(b))), m.length > 0 && (b = b.concat(m.split(c))), b);
}
var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = t.prefix, h = void 0 === n ? u : n, g = t.suffix, m = void 0 === g ? c : g, b = t.includeThousandsSeparator, x = void 0 === b || b, O = t.thousandsSeparatorSymbol, _ = void 0 === O ? l : O, j = t.allowDecimal, M = void 0 !== j && j, P = t.decimalSymbol, S = void 0 === P ? a : P, w = t.decimalLimit, C = void 0 === w ? 2 : w, k = t.requireDecimal, D = void 0 !== k && k, E = t.allowNegative, I = void 0 !== E && E, R = t.allowLeadingZeroes, A = void 0 !== R && R, L = t.integerLimit, N = void 0 === L ? null : L, $ = h && h.length || 0, V = m && m.length || 0, q = _ && _.length || 0;
return (e.instanceOf = "createNumberMask", e);
}
function r(e) {
return e.split(c).map(function (e) {
return v.test(e) ? v : e;
});
}
function o(e, t) {
return e.replace(/\B(?=(\d{3})+(?!\d))/g, t);
}
Object.defineProperty(t, "__esModule", {
value: !0
});
var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
return typeof e;
} : function (e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
t.default = n;
var u = "$", c = "", l = ",", a = ".", s = "-", d = /-/, f = /\D+/g, p = "number", v = /\d/, y = "[]";
}, function (e, t, n) {
"use strict";
function r(e) {
return e && e.__esModule ? e : {
default: e
};
}
function o(e, t) {
e = e.replace(O, v);
var n = t.placeholderChar, r = t.currentCaretPosition, o = e.indexOf(y), s = e.lastIndexOf(p), d = s < o ? -1 : s, f = i(e, o + 1, y), h = i(e, d - 1, p), g = u(e, o, n), m = c(e, o, d, n), b = l(e, d, n, r);
(g = a(g), m = a(m), b = a(b, !0));
var x = g.concat(f).concat(m).concat(h).concat(b);
return x;
}
function i(e, t, n) {
var r = [];
return (e[t] === n ? r.push(n) : r.push(h, n), r.push(h), r);
}
function u(e, t) {
return t === -1 ? e : e.slice(0, t);
}
function c(e, t, n, r) {
var o = v;
return (t !== -1 && (o = n === -1 ? e.slice(t + 1, e.length) : e.slice(t + 1, n)), o = o.replace(new RegExp("[\\s" + r + "]", m), v), o === y ? f : o.length < 1 ? g : o[o.length - 1] === p ? o.slice(0, o.length - 1) : o);
}
function l(e, t, n, r) {
var o = v;
return (t !== -1 && (o = e.slice(t + 1, e.length)), o = o.replace(new RegExp("[\\s" + n + ".]", m), v), 0 === o.length ? e[t - 1] === p && r !== e.length ? f : v : o);
}
function a(e, t) {
return e.split(v).map(function (e) {
return e === g ? e : t ? x : b;
});
}
Object.defineProperty(t, "__esModule", {
value: !0
});
var s = n(4), d = r(s), f = "*", p = ".", v = "", y = "@", h = "[]", g = " ", m = "g", b = /[^\s]/, x = /[^.\s]/, O = /\s/g;
t.default = {
mask: o,
pipe: d.default
};
}, function (e, t) {
"use strict";
function n(e, t) {
var n = t.currentCaretPosition, i = t.rawValue, f = t.previousConformedValue, p = t.placeholderChar, v = e;
v = r(v);
var y = v.indexOf(c), h = null === i.match(new RegExp("[^@\\s." + p + "]"));
if (h) return u;
if (v.indexOf(a) !== -1 || y !== -1 && n !== y + 1 || i.indexOf(o) === -1 && f !== u && i.indexOf(l) !== -1) return !1;
var g = v.indexOf(o), m = v.slice(g + 1, v.length);
return ((m.match(d) || s).length > 1 && v.substr(-1) === l && n !== i.length && (v = v.slice(0, v.length - 1)), v);
}
function r(e) {
var t = 0;
return e.replace(i, function () {
return (t++, 1 === t ? o : u);
});
}
(Object.defineProperty(t, "__esModule", {
value: !0
}), t.default = n);
var o = "@", i = /@/g, u = "", c = "@.", l = ".", a = "..", s = [], d = /\./g;
}]);
});
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
return module.exports;
},
73: function (require, module, exports) {
var StateChain;
module.exports = StateChain = (function () {
function StateChain(states) {
this.string = states.join('+');
this.array = states.slice();
this.length = states.length;
}
StateChain.prototype.includes = function (target) {
var i, len, ref, state;
ref = this.array;
for ((i = 0, len = ref.length); i < len; i++) {
state = ref[i];
if (state === target) {
return true;
}
}
return false;
};
StateChain.prototype.without = function (target) {
return this.array.filter(function (state) {
return state !== target;
}).join('+');
};
StateChain.prototype.isApplicable = function (target, otherActive) {
var active;
active = this.array.filter(function (state) {
return state === target || otherActive.indexOf(state) !== -1;
});
return active.length === this.array.length;
};
return StateChain;
})();
return module.exports;
},
74: function (require, module, exports) {
exports.checkmark = require(88);
exports.angleDown = require(89);
exports.caretUp = require(90);
exports.caretDown = require(91);
exports.plus = require(92);
exports.clone = require(93);
return module.exports;
},
88: function (require, module, exports) {
var DOM;
DOM = require(2);
module.exports = DOM.template(['*svg', {
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
}, ['*polyline', {
attrs: {
'stroke-width': '2',
'stroke-linecap': 'round',
'stroke-linejoin': 'round',
fill: 'none',
points: '7 13.8888889 9.66666667 17 15 9',
tabindex: -1,
focusable: false
}
}]]);
return module.exports;
},
89: function (require, module, exports) {
var DOM;
DOM = require(2);
module.exports = DOM.template(['*svg', {
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
}, ['*path', {
attrs: {
tabindex: -1,
focusable: false,
d: 'M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z'
}
}]]);
return module.exports;
},
90: function (require, module, exports) {
var DOM;
DOM = require(2);
module.exports = DOM.template(['*svg', {
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
}, ['*path', {
attrs: {
tabindex: -1,
focusable: false,
d: 'M402 347c0 5-2 10-5 13-4 4-8 6-13 6h-256c-5 0-9-2-13-6-3-3-5-8-5-13s2-9 5-12l128-128c4-4 8-6 13-6s9 2 13 6l128 128c3 3 5 7 5 12z'
}
}]]);
return module.exports;
},
91: function (require, module, exports) {
var DOM;
DOM = require(2);
module.exports = DOM.template(['*svg', {
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
}, ['*path', {
attrs: {
tabindex: -1,
focusable: false,
d: 'M402 201c0 5-2 9-5 13l-128 128c-4 4-8 5-13 5s-9-1-13-5l-128-128c-3-4-5-8-5-13s2-9 5-13c4-3 8-5 13-5h256c5 0 9 2 13 5 3 4 5 8 5 13z'
}
}]]);
return module.exports;
},
92: function (require, module, exports) {
var DOM;
DOM = require(2);
module.exports = DOM.template(['*svg', {
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
}, ['*polygon', {
attrs: {
tabindex: -1,
focusable: false,
points: '9 0 6 0 6 6 0 6 0 9 6 9 6 15 9 15 9 9 15 9 15 6 9 6'
}
}]]);
return module.exports;
},
93: function (require, module, exports) {
var DOM;
DOM = require(2);
module.exports = DOM.template(['*svg', {
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
}, ['*path', {
attrs: {
tabindex: -1,
focusable: false,
d: 'M13.414,0 L6,0 C4.897,0 4,0.898 4,2 L4,14 C4,15.103 4.897,16 6,16 L16,16 C17.103,16 18,15.103 18,14 L18,4.586 L13.414,0 Z M16.001,14 L6,14 L6,2 L12,2 L12,6 L16,6 L16.001,14 Z'
}
}], ['*path', {
attrs: {
tabindex: -1,
focusable: false,
d: 'M2,6.42379282 L0,6.42379282 L0,18 C0,19.103 0.897,20 2,20 L14,20 L14,18 L2,18 L2,6.42379282 Z'
}
}]]);
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


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSIsImNvbnNvbGVQYXRjaC5jb2ZmZWUiLCIuLi9wYWNrYWdlLmpzb24iLCJoZWxwZXJzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvaW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9hbGxvd2VkT3B0aW9ucy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2hlbHBlcnMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9jaGVja3MuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9lbGVtZW50L2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9hbGlhc2VzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC90cmF2ZXJzaW5nLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9pbml0LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9ldmVudHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9lbGVtZW50L3N0YXRlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9zdHlsZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2VsZW1lbnQvYXR0cmlidXRlcy1hbmQtcHJvcGVydGllcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2VsZW1lbnQvbWFuaXB1bGF0aW9uLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9hcHBsaWNhdGlvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL3dpbmRvdy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL21lZGlhUXVlcnkuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9iYXRjaC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL3RlbXBsYXRlL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvdGVtcGxhdGUvZXh0ZW5kVGVtcGxhdGUuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy90ZW1wbGF0ZS9wYXJzZVRyZWUuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy90ZW1wbGF0ZS9zY2hlbWEuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9zaG9ydGN1dHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3BhY2thZ2UuanNvbiIsImNoZWNrcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3NyYy9pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3BhY2thZ2UuanNvbiIsImFuaW1hdGlvbnMuY29mZmVlIiwiY29uc3RhbnRzL3JlcUZpZWxkTWV0aG9kcy5jb2ZmZWUiLCJmaWVsZC9pbmRleC5jb2ZmZWUiLCJmaWVsZC90cmFuc2Zvcm1TZXR0aW5ncy5jb2ZmZWUiLCJmaWVsZC90ZXh0L19pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9faW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL2hlbHBlcnMvX2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2NoYW5nZUV2ZW50LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL3JlcXVpcmVzRG9tRGVzY3JpcHRvckZpeC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvaGVscGVycy93aW5kb3dQcm9wc1RvSWdub3JlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2NoZWNrcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvaGVscGVycy9kZXNjcmlwdG9yLW1vZC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvaGVscGVycy93ZWJraXREb21EZXNjcmlwdG9yRml4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2Nsb25pbmcuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL2hlbHBlcnMvY2FjaGUuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL2hlbHBlcnMvcGxhY2Vob2xkZXJzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2Vycm9ycy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvZXJyb3JzQW5kV2FybmluZ3MuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9TaW1wbHlCaW5kL19pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL1NpbXBseUJpbmQvbWV0aG9kcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvcGFja2FnZS5qc29uIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9TaW1wbHlCaW5kL21ldGhvZHMudW5CaW5kQWxsLXBhcnNlRE9NT2JqZWN0LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvQmluZGluZy9faW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nL3Byb3RvdHlwZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL0JpbmRpbmcvcHJvdG90eXBlLnNldFZhbHVlLU9iamVjdFByb3AtRE9NVmFsdWUuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nL3Byb3RvdHlwZS5zZXRWYWx1ZS1ET01UeXBlcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL0JpbmRpbmdJbnRlcmZhY2UvaW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL3Byb3RvdHlwZS1wcml2YXRlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvQmluZGluZ0ludGVyZmFjZS9wcm90b3R5cGUtcHJpdmF0ZS5zZXRPYmplY3QtcGFyc2VET01PYmplY3QuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL3Byb3RvdHlwZS1wcml2YXRlLnNldE9iamVjdC1kZWZpbmVFdmVudE1ldGhvZHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL3Byb3RvdHlwZS1wdWJsaWMuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9Hcm91cEJpbmRpbmcvX2luZGV4LmNvZmZlZSIsImNvbnN0YW50cy9yZWdleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrY3NzL3NyYy9pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrY3NzL3BhY2thZ2UuanNvbiIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vaXMvc3JjL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9zbWFydC1leHRlbmQvc3JjL2V4dGVuZC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tjc3Mvc3JjL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2Nzcy9wYWNrYWdlLmpzb24iLCJub2RlX21vZHVsZXMvZmFzdGRvbS9mYXN0ZG9tLmpzIiwiY29tcG9uZW50cy9jb25kaXRpb24uY29mZmVlIiwiZmllbGQvZ2xvYmFsRGVmYXVsdHMuY29mZmVlIiwiY29tcG9uZW50cy9kcm9wZG93bi9pbmRleC5jb2ZmZWUiLCJjb21wb25lbnRzL21hc2suY29mZmVlIiwiY29uc3RhbnRzL2tleUNvZGVzLmNvZmZlZSIsImZpZWxkL3RleHQvdGVtcGxhdGUuY29mZmVlIiwiZmllbGQvdGV4dC9kZWZhdWx0cy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrY3NzL3NyYy9jb25zdGFudHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvaGVscGVycy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL2lzL3NyYy9uYXRpdmVzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vaXMvc3JjL2RvbS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tjc3Mvc3JjL2NvbnN0YW50cy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tjc3Mvc3JjL2hlbHBlcnMuY29mZmVlIiwiY29tcG9uZW50cy9kcm9wZG93bi90ZW1wbGF0ZS5jb2ZmZWUiLCJjb21wb25lbnRzL2Ryb3Bkb3duL2RlZmF1bHRzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy90ZXh0LW1hc2stY29yZS9kaXN0L3RleHRNYXNrQ29yZS5qcyIsIm5vZGVfbW9kdWxlcy90ZXh0LW1hc2stYWRkb25zL2Rpc3QvdGV4dE1hc2tBZGRvbnMuanMiLCJjb25zdGFudHMvY29sb3JzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9zdGF0ZUNoYWluLmNvZmZlZSIsInN2Zy9faW5kZXguY29mZmVlIiwic3ZnL2NoZWNrbWFyay5jb2ZmZWUiLCJzdmcvYW5nbGVEb3duLmNvZmZlZSIsInN2Zy9jYXJldFVwLmNvZmZlZSIsInN2Zy9jYXJldERvd24uY29mZmVlIiwic3ZnL3BsdXMuY29mZmVlIiwic3ZnL2Nsb25lLmNvZmZlZSJdLCJuYW1lcyI6WyJET00iLCJJUyIsImV4dGVuZCIsInJlZ2lzdGVyQW5pbWF0aW9ucyIsIlJFUVVJUkVEX0ZJRUxEX01FVEhPRFMiLCJjb25zb2xlIiwibG9nIiwid2FybiIsIm5ld0J1aWxkZXIiLCJzZXR0aW5nT3ZlcnJpZGVzIiwidGVtcGxhdGVPdmVycmlkZXMiLCJGaWVsZCIsInNldHRpbmdzIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiY2xvbmUiLCJhcHBseSIsIm9iamVjdCIsInR5cGUiLCJFcnJvciIsImJ1aWxkZXIiLCJyZWdpc3RlciIsInRhcmdldEZpZWxkIiwiaSIsInN0cmluZyIsInByb3RvdHlwZSIsInJlcXVpcmVkTWV0aG9kIiwiY29uZmlnIiwibmV3U2V0dGluZ3MiLCJuZXdUZW1wbGF0ZXMiLCJTdHJpbmciLCJvdXRwdXRTZXR0aW5ncyIsIk9iamVjdCIsImNyZWF0ZSIsImdsb2JhbERlZmF1bHRzIiwiZGVlcCIsIm5vdERlZXAiLCJzaGFsbG93U2V0dGluZ3MiLCJkZWZhdWx0cyIsIm91dHB1dFRlbXBsYXRlcyIsImdsb2JhbENvbmZpZyIsImdsb2JhbCIsImZpZWxkIiwib3JpZ2luYWxUZW1wbGF0ZXMiLCJ0ZW1wbGF0ZXMiLCJuYW1lIiwiY29uY2F0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJvd24iLCJub3RLZXlzIiwidmVyc2lvbiIsIlF1aWNrRmllbGQiLCJtb2R1bGUiLCJleHBvcnRzIiwiU2ltcGx5QmluZCIsInJlZ2V4IiwiaGVscGVycyIsIm5vb3AiLCJpbmNsdWRlcyIsInRhcmdldCIsIml0ZW0iLCJpbmRleE9mIiwicmVwZWF0IiwiY291bnQiLCJyZXN1bHRzMSIsImpvaW4iLCJyZW1vdmVJdGVtIiwiaXRlbUluZGV4Iiwic3BsaWNlIiwiaW5zZXJ0QWZ0ZXIiLCJuZXdJdGVtIiwiZmluZCIsImZuIiwicmVzdWx0cyIsImZpbHRlciIsImRpZmYiLCJzb3VyY2UiLCJjb21wYXJlZSIsImNvbXBhcmVlVmFsIiwibWF4TGVuIiwiTWF0aCIsIm1heCIsInNvdXJjZVZhbCIsImRlZmluZWQiLCJyZXN1bHQiLCJwdXNoIiwiaGV4VG9SR0JBIiwiaGV4IiwiYWxwaGEiLCJCIiwic2xpY2UiLCJSIiwicGFyc2VJbnQiLCJHIiwiZGVmYXVsdENvbG9yIiwiY29sb3IiLCJjYWxjUGFkZGluZyIsImRlc2lyZWRIZWlnaHQiLCJmb250U2l6ZSIsImNlaWwiLCJ1bmxvY2tTY3JvbGwiLCJleGNsdWRlZEVsIiwid2luZG93IiwiX2lzTG9ja2VkIiwib2ZmIiwibG9ja1Njcm9sbCIsIm9uIiwiZXZlbnQiLCJyYXciLCJwYXJlbnRNYXRjaGluZyIsInBhcmVudCIsIndoZWVsRGVsdGEiLCJzY3JvbGxUb3AiLCJwcmV2ZW50RGVmYXVsdCIsInNjcm9sbEhlaWdodCIsImNsaWVudEhlaWdodCIsImZ1enp5TWF0Y2giLCJuZWVkbGUiLCJoYXlzdGFjayIsImNhc2VTZW5zaXRpdmUiLCJoSSIsImhMZW5ndGgiLCJ0b1VwcGVyQ2FzZSIsIm5MZW5ndGgiLCJuSSIsIm1hdGNoZWRDb3VudCIsIm5lZWRsZUNoYXIiLCJzdGFydHNXaXRoIiwiZ2V0SW5kZXhPZkZpcnN0RGlmZiIsInNvdXJjZVN0cmluZyIsImNvbXBhcmVTdHJpbmciLCJjdXJyZW50UG9zIiwibWF4TGVuZ3RoIiwicGFyc2VDc3NTaG9ydGhhbmRWYWx1ZSIsInNwbGl0Iiwid2hpdGVTcGFjZSIsIm1hcCIsInBhcnNlRmxvYXQiLCJ2YWx1ZXMiLCJ0b3AiLCJyaWdodCIsImJvdHRvbSIsImxlZnQiLCJzaG9ydGhhbmRTaWRlVmFsdWUiLCJ2YWx1ZSIsInNpZGUiLCJ1cGRhdGVTaG9ydGhhbmRWYWx1ZSIsIm5ld1ZhbHVlIiwia2V5cyIsImZvckVhY2giLCJRdWlja0RvbSIsImFsbG93ZWRPcHRpb25zIiwibm9ybWFsaXplR2l2ZW5FbCIsInRhcmdldEVsIiwidGV4dCIsImRvbU5vZGUiLCJ0ZW1wbGF0ZSIsInNwYXduIiwiaXNTdGF0ZVN0eWxlIiwicmVnaXN0ZXJTdHlsZSIsInJ1bGUiLCJsZXZlbCIsImltcG9ydGFudCIsImNhY2hlZCIsInN0eWxlQ2FjaGUiLCJvdXRwdXQiLCJjbGFzc05hbWUiLCJDU1MiLCJmbnMiLCJwcm9wcyIsInByb3AiLCJzZXQiLCJrZXkiLCJpbmRleCIsImxvYWQiLCJxdWlja0RvbUVsIiwic3ViamVjdCIsImNvbnN0cnVjdG9yIiwiUXVpY2tFbGVtZW50IiwiUXVpY2tUZW1wbGF0ZSIsIm9wdGlvbnMiLCJzdmciLCJlbCIsImV4aXN0aW5nIiwiZG9jdW1lbnQiLCJjcmVhdGVUZXh0Tm9kZSIsImNyZWF0ZUVsZW1lbnROUyIsInN2Z05hbWVzcGFjZSIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmQiLCJwcmVwZW5kIiwiYXR0ciIsIl9wYXJlbnQiLCJfc3R5bGVzIiwiX3N0YXRlIiwiX2NoaWxkcmVuIiwiX25vcm1hbGl6ZU9wdGlvbnMiLCJfYXBwbHlPcHRpb25zIiwiX2F0dGFjaFN0YXRlRXZlbnRzIiwiX3Byb3h5UGFyZW50IiwiX3JlZnJlc2hQYXJlbnQiLCJfcXVpY2tFbGVtZW50IiwidG9KU09OIiwiY2hpbGQiLCJjaGlsZHJlbiIsImRlZmluZVByb3BlcnRpZXMiLCJzdHlsZSIsInJlcGxhY2UiLCJfZmlsdGVyRWxlbWVudHMiLCJwYXJlbnRzVW50aWwiLCJfZ2V0UGFyZW50cyIsImlzUmVmIiwibmV4dFBhcmVudCIsInJlZiIsInF1ZXJ5Iiwic2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yIiwicXVlcnlBbGwiLCJxdWVyeVNlbGVjdG9yQWxsIiwiUXVpY2tCYXRjaCIsImNoaWxkTm9kZXMiLCJyZWYxIiwibm9kZVR5cGUiLCJwYXJlbnROb2RlIiwiZG9tRG9jIiwibmV4dFNpYmxpbmciLCJuZXh0RWxlbWVudFNpYmxpbmciLCJuZXh0QWxsIiwic2libGluZ3MiLCJuZXh0IiwicHJldmlvdXNTaWJsaW5nIiwicHJldmlvdXNFbGVtZW50U2libGluZyIsInByZXZBbGwiLCJwcmV2U2libGluZyIsInByZXYiLCJyZXZlcnNlIiwiX2NoaWxkUmVmcyIsIl9nZXRDaGlsZFJlZnMiLCJfZ2V0SW5kZXhCeVByb3AiLCJwYXJlbnRzIiwiZnJlc2hDb3B5IiwicmVmcyIsImNoaWxkUmVmcyIsIm1haW4iLCJhcnJheSIsImJhc2VTdGF0ZVRyaWdnZXJzIiwiYnViYmxlcyIsImJhc2UxIiwidXJsIiwiaHJlZiIsInJlbGF0ZWQiLCJyZWxhdGVkSW5zdGFuY2UiLCJ1bnBhc3NhYmxlU3RhdGVzIiwicGFzc1N0YXRlVG9DaGlsZHJlbiIsInN0YXRlVHJpZ2dlcnMiLCJfcGFyc2VUZXh0cyIsIl90ZXh0cyIsIl9wYXJzZVN0eWxlcyIsInN0eWxlcyIsInN0b3JlIiwiX21lZGlhU3RhdGVzIiwib2JqZWN0UGxhaW4iLCJzdGF0ZXMiLCJzcGVjaWFsU3RhdGVzIiwic3RhdGUiLCJfcHJvdmlkZWRTdGF0ZXMiLCJfc3RhdGVTaGFyZWQiLCJfcHJvdmlkZWRTdGF0ZXNTaGFyZWQiLCJiYXNlIiwiJGJhc2UiLCJmb3JjZVN0eWxlIiwiZmxhdHRlbk5lc3RlZFN0YXRlcyIsInN0eWxlT2JqZWN0IiwiY2hhaW4iLCJoYXNOb25TdGF0ZVByb3BzIiwic3RhdGVfIiwic3RhdGVDaGFpbiIsInN0YXRlU3R5bGVzIiwidGV4dHMiLCJpZCIsInNyYyIsInNlbGVjdGVkIiwiY2hlY2tlZCIsImF0dHJzIiwicmVmMiIsIl9hcHBseVJlZ2lzdGVyZWRTdHlsZSIsInN0eWxlQWZ0ZXJJbnNlcnQiLCJfIiwicmVjYWxjU3R5bGUiLCJfaW5zZXJ0ZWQiLCJtZWRpYVN0YXRlcyIsInF1ZXJ5U3RyaW5nIiwiTWVkaWFRdWVyeSIsInJlY2FsY09uUmVzaXplIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl90aGlzIiwiZXZlbnRzIiwicmVmMyIsImhhbmRsZXIiLCJtZXRob2RzIiwicmVmNCIsIm1ldGhvZCIsImNvbmZpZ3VyYWJsZSIsImZvcmNlIiwidHJpZ2dlciIsImRpc2FibGVyIiwiZW5hYmxlciIsIl9saXN0ZW5UbyIsIm5ld1BhcmVudCIsImxhc3RQYXJlbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJfdW5wcm94eVBhcmVudCIsImVtaXRQcml2YXRlIiwicmVnZXhXaGl0ZXNwYWNlIiwiZXZlbnROYW1lcyIsImNhbGxiYWNrIiwidXNlQ2FwdHVyZSIsImlzUHJpdmF0ZSIsImNhbGxiYWNrUmVmIiwiX2V2ZW50Q2FsbGJhY2tzIiwiX19yZWZzIiwiY2FsbCIsImV2ZW50TmFtZSIsIl9pbnZva2VIYW5kbGVycyIsIm9uY2UiLCJvbmNlQ2FsbGJhY2siLCJlbWl0IiwiY2FuY2VsYWJsZSIsImRhdGEiLCJjcmVhdGVFdmVudCIsImluaXRFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJhcmciLCJjYWxsYmFja3MiLCJldmVudE5hbWVUb0xpc3RlbkZvciIsImxpc3Rlbk1ldGhvZCIsIkRVTU1ZX0FSUkFZIiwidGFyZ2V0U3RhdGUiLCJhY3RpdmVTdGF0ZXMiLCJfc3RhdGVQaXBlVGFyZ2V0IiwiZGVzaXJlZFZhbHVlIiwiX2dldEFjdGl2ZVN0YXRlcyIsInRvZ2dsZSIsInRvZ2dsZVN0YXRlIiwicmVzZXRTdGF0ZSIsImFjdGl2ZVN0YXRlIiwicGlwZVN0YXRlIiwidGFyZ2V0U3R5bGUiLCJzdXBlcmlvclN0YXRlcyIsImluY2x1ZGVCYXNlIiwic2tpcEZucyIsImFkZENsYXNzIiwic3VwZXJpb3JTdHlsZXMiLCJfcmVzb2x2ZUZuU3R5bGVzIiwiZW50cnkiLCJfcmVtb3ZlUmVnaXN0ZXJlZFN0eWxlIiwicmVtb3ZlQ2xhc3MiLCJyZXNldFZhbHVlIiwiX3R1cm5TdHlsZU9OIiwiaiIsIl9nZXRTdXBlcmlvclN0YXRlcyIsInNoYXJlZFN0YXRlcyIsIl9nZXRTaGFyZWRTdGF0ZXMiLCJfdHVyblN0eWxlT0ZGIiwiYWN0aXZlU2hhcmVkU3RhdGVzIiwiX3R1cm5UZXh0T04iLCJ0YXJnZXRUZXh0IiwiX3R1cm5UZXh0T0ZGIiwic3RhdGVUb0V4Y2x1ZGUiLCJpbmNsdWRlU2hhcmVkU3RhdGVzIiwicGxhaW5TdGF0ZXMiLCJjYW5kaWRhdGUiLCJ0YXJnZXRTdGF0ZUluZGV4Iiwic3VwZXJpb3IiLCJpc0FwcGxpY2FibGUiLCJhc3BlY3RSYXRpb0dldHRlciIsInByb3BlcnR5IiwiYXJncyIsImN1cnJlbnRTdGF0ZVN0eWxlIiwiVU5TRVQiLCJzdHlsZVNhZmUiLCJza2lwQ29tcHV0ZWQiLCJjb21wdXRlZCIsInNhbXBsZSIsIm51bWJlciIsInN0eWxlUGFyc2VkIiwicmVjYWxjQ2hpbGRyZW4iLCJ0YXJnZXRTdHlsZXMiLCJoaWRlIiwic2hvdyIsImRpc3BsYXkiLCJvcmllbnRhdGlvbkdldHRlciIsIndpZHRoIiwiaGVpZ2h0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiYXR0ck5hbWUiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJwcm9wTmFtZSIsInRvVGVtcGxhdGUiLCJjbG9uZU5vZGUiLCJlbENsb25lIiwibmV3RWwiLCJrIiwicHJldlBhcmVudCIsIl9yZW1vdmVDaGlsZCIsImFwcGVuZENoaWxkIiwiYXBwZW5kVG8iLCJ1bnNoaWZ0IiwiaW5zZXJ0QmVmb3JlIiwiZmlyc3RDaGlsZCIsInByZXBlbmRUbyIsImFmdGVyIiwibXlJbmRleCIsImJlZm9yZSIsImRldGFjaCIsInJlbW92ZSIsImVtcHR5Iiwid3JhcCIsImN1cnJlbnRQYXJlbnQiLCJ1bndyYXAiLCJncmFuZFBhcmVudCIsInBhcmVudENoaWxkcmVuIiwiYmF0Y2giLCJwYXJlbnRTaWJsaW5nIiwiaGFzQ2xhc3MiLCJjbGFzc0xpc3QiLCJ0YXJnZXRJbmRleCIsInRvZ2dsZUNsYXNzIiwidGFyZ2V0Q2hpbGQiLCJyZXBsYWNlbWVudENoaWxkIiwiaW5kZXhPZkNoaWxkIiwicmVwbGFjZUNoaWxkIiwicmVtb3ZlQ2hpbGQiLCJpbm5lckhUTUwiLCJ0ZXh0Q29udGVudCIsImxpc3QiLCJwb3AiLCJzaGlmdCIsInVwZGF0ZU9wdGlvbnMiLCJ1cGRhdGVTdGF0ZVN0eWxlcyIsInBhcnNlZCIsInVwZGF0ZWRTdGF0ZXMiLCJ1cGRhdGVTdGF0ZVRleHRzIiwiYXBwbHlEYXRhIiwiY29tcHV0ZXJzIiwiaGFzT3duUHJvcGVydHkiLCJfcnVuQ29tcHV0ZXIiLCJjb21wdXRlciIsIlF1aWNrV2luZG93IiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0IiwicGFyc2VRdWVyeSIsInF1ZXJ5U3BsaXQiLCJydWxlcyIsInJ1bGVEZWxpbWl0ZXIiLCJnZXR0ZXIiLCJpc05hTiIsImtleVByZWZpeCIsIm1pbiIsIm9yaWVudGF0aW9uIiwiYXNwZWN0UmF0aW8iLCJwYXJzZWRWYWx1ZSIsInN0cmluZ1ZhbHVlIiwidGVzdFJ1bGUiLCJjdXJyZW50VmFsdWUiLCJwYXNzZWQiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiZWxlbWVudCIsImFyZ3NMZW5ndGgiLCJ0cmVlIiwiaHRtbCIsImNvbnRhaW5lciIsIkFycmF5IiwiaXNUZW1wbGF0ZSIsImlzUXVpY2tFbCIsImlzRWwiLCJkb21FbCIsImVsZW1lbnRzIiwicmV0dXJuUmVzdWx0czEiLCJyZXR1cm5SZXN1bHRzIiwicmV0dXJuTmV4dCIsImxhc3RSZXN1bHRzIiwiaXRlcmFibGUiLCJjdXJyZW50T3B0cyIsIm5ld09wdHMiLCJnbG9iYWxPcHRzIiwiY3VycmVudENoaWxkIiwiZ2xvYmFsT3B0c1RyYW5zZm9ybSIsIm9wdHMiLCJwYXJzZVRyZWUiLCJtYXRjaGVzU2NoZW1hIiwibnVsbERlbGV0ZXMiLCJ0cmFuc2Zvcm0iLCJjdXJyZW50Q2hpbGRyZW4iLCJuZXdDaGlsZHJlbiIsIm5lZWRzVGVtcGxhdGVXcmFwIiwibm9DaGFuZ2VzIiwibmV3Q2hpbGQiLCJuZXdDaGlsZFByb2Nlc3NlZCIsInNjaGVtYSIsImFsbG93TnVsbCIsImV4dGVuZEJ5UmVmIiwicmVtYWluaW5nTmV3Q2hpbGRyZW4iLCJuZXdDaGlsZHJlblJlZnMiLCJwYXJzZUVycm9yUHJlZml4IiwicGFyc2VDaGlsZHJlbiIsImRvbVRleHQiLCJhbGxvd2VkVGVtcGxhdGVPcHRpb25zIiwiaXNUcmVlIiwiX2hhc0NvbXB1dGVycyIsIm5ld1ZhbHVlcyIsImV4dGVuZFRlbXBsYXRlIiwiX2luaXQiLCJzaG9ydGN1dCIsIlJlZ0V4cCIsIm9iamVjdGFibGUiLCJub3JtYWxpemVLZXlzIiwiaXNBcnJheSIsImlzQmFzZSIsInRoZVRhcmdldCIsIiRfaSIsInNvdXJjZXMiLCJtb2RpZmllcnMiLCJkZWVwT25seSIsImdsb2JhbFRyYW5zZm9ybSIsInRyYW5zZm9ybXMiLCJnbG9iYWxGaWx0ZXIiLCJmaWx0ZXJzIiwiYW5pbWF0aW9uIiwib3BhY2l0eSIsIkNvbmRpdGlvbiIsImZhc3Rkb20iLCJjdXJyZW50SUQiLCJpbnN0YW5jZXMiLCJ0cmFuc2Zvcm1TZXR0aW5ncyIsImNvbmRpdGlvbnMiLCJjaG9pY2VzIiwibGFiZWwiLCJjb3JlVmFsdWVQcm9wIiwiX3ZhbHVlIiwiX2dldFZhbHVlIiwiX3NldFZhbHVlIiwic2V0dGVyIiwiSUQiLCJhbGxGaWVsZHMiLCJmaWVsZEluc3RhbmNlcyIsInZhbGlkIiwidmlzaWJsZSIsImZvY3VzZWQiLCJob3ZlcmVkIiwiZmlsbGVkIiwiaW50ZXJhY3RlZCIsImlzTW9iaWxlIiwiZGlzYWJsZWQiLCJtYXJnaW4iLCJwYWRkaW5nIiwic2hvd0xhYmVsIiwic2hvd0hlbHAiLCJoZWxwIiwic2hvd0Vycm9yIiwiZXJyb3IiLCJwbGFjZWhvbGRlciIsImluaXQiLCJfY29uc3RydWN0b3JFbmQiLCJjaGlsZGYiLCJkZWZhdWx0VmFsdWUiLCJtdWx0aXBsZSIsInVwZGF0ZU9uQmluZCIsIm9mIiwidG8iLCJjb25kaXRpb24iLCJhbmQiLCJiaW5kIiwicHJldlNob3ciLCJjaGFuZ2VBbW91bnQiLCJtYWtlUm9vbUZvckhlbHAiLCJtb2JpbGVXaWR0aCIsIm1lYXN1cmUiLCJtb2JpbGVUaHJlc2hvbGQiLCJ1cGRhdGVPbiIsIl9xdWlja0ZpZWxkIiwiX2Zvcm1hdFdpZHRoIiwiZGlzdGFuY2UiLCJkZXN0cm95IiwicmVtb3ZlRnJvbURPTSIsInVuQmluZEFsbCIsIl9kZXN0cm95IiwidmFsaWRhdGUiLCJwcm92aWRlZFZhbHVlIiwidGVzdFVucmVxdWlyZWQiLCJyZXBvcnQiLCJpc1ZhbGlkIiwidmFsaWRhdG9yIiwicmVxdWlyZWQiLCJfdmFsaWRhdGUiLCJjbGVhckVycm9yT25WYWxpZCIsInZhbGlkYXRlQ29uZGl0aW9ucyIsInBhc3NlZENvbmRpdGlvbnMiLCJ0b2dnbGVWaXNpYmlsaXR5IiwidmFsaWRhdGVBbmRSZXBvcnQiLCJNYXNrIiwiUkVHRVgiLCJLRVlDT0RFUyIsIlRleHRGaWVsZCIsInR5cGluZyIsImN1cnNvciIsImN1cnJlbnQiLCJ2YWxpZFdoZW5SZWdleCIsImtleWJvYXJkIiwiZW1haWwiLCJtYXNrIiwicGF0dGVybiIsIl9jcmVhdGVFbGVtZW50cyIsIl9hdHRhY2hCaW5kaW5ncyIsImRyb3Bkb3duIiwic2V0VmFsdWUiLCJfcmVjYWxjRGlzcGxheSIsImF1dG9XaWR0aCIsIkRyb3Bkb3duIiwiaW5uZXJ3cmFwIiwiaWNvbiIsImlucHV0IiwiY2hlY2ttYXJrIiwiX2F0dGFjaEJpbmRpbmdzX2VsU3RhdGUiLCJfYXR0YWNoQmluZGluZ3NfZGlzcGxheSIsIl9hdHRhY2hCaW5kaW5nc19kaXNwbGF5X2F1dG9XaWR0aCIsIl9hdHRhY2hCaW5kaW5nc192YWx1ZSIsIl9hdHRhY2hCaW5kaW5nc19hdXRvY29tcGxldGUiLCJfYXR0YWNoQmluZGluZ3Nfc3RhdGVUcmlnZ2VycyIsInNldFRpbWVvdXQiLCJjaGVja21hcmtfbWFzazEiLCJjaGVja21hcmtfbWFzazIiLCJjaGVja21hcmtfcGF0Y2giLCJ1cGRhdGVFdmVuSWZTYW1lIiwiX2dldElucHV0QXV0b1dpZHRoIiwicmVzZXRJbnB1dCIsImlzRW1wdHkiLCJzZWxlY3Rpb24iLCJndWlkZSIsImtleUNvZGUiLCJlbnRlciIsImRlZmF1bHRPcHRpb25zIiwiaXNUeXBpbmciLCJpc09wZW4iLCJjYWxjRGlzcGxheSIsImNob2ljZSIsInNob3VsZEJlVmlzaWJsZSIsIm9uU2VsZWN0ZWQiLCJzZWxlY3RlZENob2ljZSIsImJsdXIiLCJlbmQiLCJfc2NoZWR1bGVDdXJzb3JSZXNldCIsImN1cnJlbnRDdXJzb3IiLCJuZXdDdXJzb3IiLCJub3JtYWxpemVDdXJzb3JQb3MiLCJfc2V0VmFsdWVJZk5vdFNldCIsImlucHV0V2lkdGgiLCJzY3JvbGxMZWZ0Iiwib2Zmc2V0V2lkdGgiLCJzY3JvbGxXaWR0aCIsImxhYmVsV2lkdGgiLCJyZWN0IiwiX2dldFdpZHRoU2V0dGluZyIsInBhcmVudFdpZHRoIiwibWF0Y2hpbmdDaG9pY2UiLCJ0ZXN0IiwidmFsaWRXaGVuSXNDaG9pY2UiLCJtaW5MZW5ndGgiLCJzdGFydCIsInNldFNlbGVjdGlvblJhbmdlIiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25FbmQiLCJmb2N1cyIsImFycmF5TXV0YXRvck1ldGhvZHMiLCJkdW1teVByb3BlcnR5RGVzY3JpcHRvciIsImJvdW5kSW5zdGFuY2VzIiwic2lsZW50IiwibmV3UGxhY2Vob2xkZXIiLCJjaGVja0lmIiwic2V0UGhvbGRlclJlZ0V4IiwiZGVsYXkiLCJ0aHJvdHRsZSIsInNpbXBsZVNlbGVjdG9yIiwicHJvbWlzZVRyYW5zZm9ybXMiLCJkaXNwYXRjaEV2ZW50cyIsInNlbmRBcnJheUNvcGllcyIsImdldERlc2NyaXB0b3IiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJjYWNoZWRFdmVudCIsImNoYW5nZUV2ZW50IiwiX3NiIiwicmVxdWlyZXNEb21EZXNjcmlwdG9yRml4IiwiRWxlbWVudCIsIndpbmRvd1Byb3BzVG9JZ25vcmUiLCJzZXRWYWx1ZU5vb3AiLCJ2IiwicHVibGlzaGVyIiwidXBkYXRlQWxsU3VicyIsImdlbklEIiwiZ2VuT2JqIiwiZ2VuUHJveGllZEludGVyZmFjZSIsImlzU3ViIiwiY29tcGxldGVDYWxsYmFjayIsImN1c3RvbU9wdGlvbnMiLCJzYXZlT3B0aW9ucyIsImdlblNlbGZVcGRhdGVyIiwiYmluZGluZyIsImZldGNoVmFsdWUiLCJzZWxmVXBkYXRlciIsIkJpbmRpbmciLCJmZXRjaERpcmVjdFZhbHVlIiwiaXNEZWZpbmVkIiwiaXNPYmplY3QiLCJpc1N0cmluZyIsImlzTnVtYmVyIiwiaXNGdW5jdGlvbiIsImlzQmluZGluZ0ludGVyZmFjZSIsIkJpbmRpbmdJbnRlcmZhY2UiLCJpc0JpbmRpbmciLCJpc0l0ZXJhYmxlIiwiaXNEb20iLCJpc0RvbUlucHV0IiwiaXNEb21SYWRpbyIsImlzRG9tQ2hlY2tib3giLCJpc0VsQ29sbGVjdGlvbiIsIk5vZGVMaXN0IiwiSFRNTENvbGxlY3Rpb24iLCJqUXVlcnkiLCJkb21FbHNBcmVTYW1lIiwiaXRlbXNXaXRoU2FtZVR5cGUiLCJpc0RvbU5vZGUiLCJjb252ZXJ0VG9MaXZlIiwiaXNQcm90byIsImRlc2NyaXB0b3IiLCJvYmplY3RQcm90byIsImdldFByb3RvdHlwZU9mIiwiZmV0Y2hEZXNjcmlwdG9yIiwiYmluZGluZ0luc3RhbmNlIiwib25seUFycmF5TWV0aG9kcyIsIm9yaWdEZXNjcmlwdG9yIiwib3JpZ0ZuIiwiY29udGV4dCIsImdldHRlclZhbHVlIiwicHJveHlGbiIsInNlbGZUcmFuc2Zvcm0iLCJpc0xpdmVQcm9wIiwidGFyZ2V0SW5jbHVkZXMiLCJwcm9wZXJ0eURlc2NyaXB0b3IiLCJvcmlnR2V0dGVyIiwib3JpZ1NldHRlciIsInNob3VsZFdyaXRlTGl2ZVByb3AiLCJDU1NTdHlsZURlY2xhcmF0aW9uIiwidHlwZUlzQXJyYXkiLCJzaG91bGRJbmRpY2F0ZVVwZGF0ZUlzRnJvbVNlbGYiLCJlbnVtZXJhYmxlIiwiY29udmVydFRvUmVnIiwibmV3RGVzY3JpcHRvciIsImNsb25lT2JqZWN0IiwiZXh0ZW5kU3RhdGUiLCJzdGF0ZVRvSW5oZXJpdCIsImNhY2hlIiwiaXNNdWx0aUNob2ljZSIsInNhbXBsZUl0ZW0iLCJfc2JfSUQiLCJfc2JfbWFwIiwiZ3JvdXBCaW5kaW5nIiwicHJvcHNNYXAiLCJhZGRUb05vZGVTdG9yZSIsInBob2xkZXJSZWdFeCIsInBob2xkZXJSZWdFeFNwbGl0IiwiZXNjYXBlUmVnRXgiLCJtaWRkbGUiLCJhcHBseVBsYWNlaG9sZGVycyIsImNvbnRleHRzIiwiaW5kZXhNYXAiLCJjb250ZXh0UGFydCIsIm5vZGVTdG9yZSIsIm5vZGUiLCJ0YXJnZXRQbGFjZWhvbGRlciIsInNjYW5UZXh0Tm9kZXNQbGFjZWhvbGRlcnMiLCJtYXRjaCIsInRleHRQaWVjZXMiLCJuZXdGcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJuZXdOb2RlIiwidGV4dFBpZWNlIiwiZ2V0RXJyU291cmNlIiwiZXJyb3JOYW1lIiwiZXJyb3JzIiwidGhyb3dXYXJuaW5nIiwid2FybmluZ05hbWUiLCJkZXB0aCIsImVyclNvdXJjZSIsInRocm93RXJyb3JCYWRBcmciLCJ0aHJvd0Vycm9yIiwic3RhY2siLCJpbnZhbGlkUGFyYW1OYW1lIiwiZm5Pbmx5IiwiYmFkRXZlbnRBcmciLCJlbXB0eUxpc3QiLCJvbmx5T25lRE9NRWxlbWVudCIsIm1peGVkRWxMaXN0IiwiaW50ZXJmYWNlVG9SZXR1cm4iLCJzZWxmQ2xvbmUiLCJuZXdJbnRlcmZhY2UiLCJzZXRPYmplY3QiLCJzZXRQcm9wZXJ0eSIsImJvdGhXYXlzIiwiYm91bmRJRCIsInByb3BNYXAiLCJyZW1vdmVBbGxTdWJzIiwicGFyZW50QmluZGluZyIsIm9wdGlvbnNEZWZhdWx0Iiwic3VicyIsInN1YnNNZXRhIiwicHVic01hcCIsImF0dGFjaGVkRXZlbnRzIiwiY2hvaWNlRWwiLCJjaG9pY2VCaW5kaW5nIiwiYWRkU3ViIiwidHJhbnNmb3JtRm4iLCJwYXJlbnRQcm9wZXJ0eSIsInNjYW5Gb3JQaG9sZGVycyIsInBob2xkZXJWYWx1ZXMiLCJwaG9sZGVyIiwidGV4dE5vZGVzIiwic3ViamVjdFZhbHVlIiwiYXR0YWNoRXZlbnRzIiwiZXZlbnRVcGRhdGVIYW5kbGVyIiwic3ViIiwidXBkYXRlT25jZSIsImFscmVhZHlIYWRTdWIiLCJpc011bHRpIiwic3ViSXRlbSIsIm1ldGFEYXRhIiwidmFsdWVSZWYiLCJyZW1vdmVTdWIiLCJyZW1vdmVQb2xsSW50ZXJ2YWwiLCJ1blJlZ2lzdGVyRXZlbnQiLCJmcm9tU2VsZiIsImZyb21DaGFuZ2VFdmVudCIsImNob2ljZU5hbWUiLCJlbnRpcmVWYWx1ZSIsImxlbiIsImxlbjEiLCJuIiwibmV3Q2hvaWNlVmFsdWUiLCJuZXdDaG9pY2VzIiwibmV3VmFsdWVBcnJheSIsIm92ZXJ3cml0ZVByZXZpb3VzIiwicHJldkN1cnNyb3IiLCJwcmV2VmFsdWUiLCJ0YXJnZXRDaG9pY2VCaW5kaW5nIiwidGV4dE5vZGUiLCJ2YWx1ZVBhc3NlZCIsImlzRW1pdHRlciIsImVtaXRFdmVudCIsImFyciIsInVwZGF0ZVN1YiIsImlzRGVsYXllZFVwZGF0ZSIsImN1cnJlbnRUaW1lIiwibWV0YSIsInN1YlZhbHVlIiwidGltZVBhc3NlZCIsImRpc2FsbG93TGlzdCIsIkRhdGUiLCJsYXN0VXBkYXRlIiwiY2xlYXJUaW1lb3V0IiwidXBkYXRlVGltZXIiLCJjb25kaXRpb25GbiIsInRoZW4iLCJhZGRNb2RpZmllckZuIiwic3ViSW50ZXJmYWNlcyIsInN1YmplY3RGbiIsInN1YkludGVyZmFjZSIsInN1Yk1ldGFEYXRhIiwic3Vic2NyaWJlciIsImJpbmRpbmdzIiwic2V0U2VsZlRyYW5zZm9ybSIsImFkZERpc2FsbG93UnVsZSIsInRhcmdldFN1YiIsInRhcmdldERpc2FsbG93IiwicGhvbGRlckluZGV4TWFwIiwicGhvbGRlckNvbnRleHRzIiwiZSIsImFkZFBvbGxJbnRlcnZhbCIsInRpbWUiLCJwb2xsSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInBvbGxlZFZhbHVlIiwiY2xlYXJJbnRlcnZhbCIsImFkZFVwZGF0ZUxpc3RlbmVyIiwidGFyZ2V0UHJvcGVydHkiLCJzaG91bGRSZWRlZmluZVZhbHVlIiwicmVnaXN0ZXJFdmVudCIsImV2ZW50SGFuZGxlciIsImV2ZW50TWV0aG9kcyIsImxpc3RlbiIsImV4dHJhRGF0YSIsImV2ZW50T2JqZWN0IiwiYmluZGluZ0RhdGEiLCJpbmhlcml0ZWRTdGF0ZSIsInN0YWdlIiwib3B0aW9uc1Bhc3NlZCIsIkJpbmRpbmdJbnRlcmZhY2VQcml2YXRlIiwiZGVmaW5lTWFpblByb3BzIiwib2JqZWN0cyIsImNyZWF0ZUJpbmRpbmciLCJuZXdPYmplY3RUeXBlIiwiYmluZGluZ0ludGVyZmFjZSIsImNhY2hlZEJpbmRpbmciLCJwYXRjaENhY2hlZEJpbmRpbmciLCJuZXdCaW5kaW5nIiwib3B0aW9uIiwidG9TdHJpbmciLCJyZW1vdmVNZXRob2QiLCJlbWl0TWV0aG9kIiwiR3JvdXBCaW5kaW5nIiwiYWRkVG9QdWJsaXNoZXIiLCJwdWJsaXNoZXJJbnRlcmZhY2UiLCJNRVRIT0RfYm90aFdheXMiLCJNRVRIT0Rfb2YiLCJNRVRIT0Rfc2V0IiwiY2hhaW5UbyIsIk1FVEhPRF9jaGFpblRvIiwidHJhbnNmb3JtU2VsZiIsIk1FVEhPRF90cmFuc2Zvcm1TZWxmIiwiTUVUSE9EX3RyYW5zZm9ybSIsInRyYW5zZm9ybUFsbCIsIk1FVEhPRF90cmFuc2Zvcm1BbGwiLCJNRVRIT0RfY29uZGl0aW9uIiwiY29uZGl0aW9uQWxsIiwiTUVUSE9EX2NvbmRpdGlvbkFsbCIsInVuQmluZCIsIk1FVEhPRF91bkJpbmQiLCJwb2xsRXZlcnkiLCJNRVRIT0RfcG9sbEV2ZXJ5Iiwic3RvcFBvbGxpbmciLCJNRVRIT0Rfc3RvcFBvbGxpbmciLCJzZXRPcHRpb24iLCJNRVRIT0Rfc2V0T3B0aW9uIiwiZGlzYWxsb3dGcm9tIiwidGhpc0ludGVyZmFjZSIsImRpc2FsbG93SW50ZXJmYWNlIiwicmVtb3ZlVXBkYXRlciIsImNsb25lQmluZGluZyIsImNsb25lSW50ZXJmYWNlIiwiYWRkQmluZGluZyIsInNpYmxpbmdJbnRlcmZhY2UiLCJ1cGRhdGUiLCJ0d29XYXkiLCJwaXBlIiwic3BlY2lmaWNPcHRpb25zIiwiYWx0VHJhbnNmb3JtIiwic3ViQmluZGluZyIsIm9yaWdpblRyYW5zZm9ybSIsIm9yaWdpbkNvbmRpdGlvbiIsInRyYW5zZm9ybVRvVXNlIiwib3B0aW9uTmFtZSIsIm9iamVjdFR5cGUiLCJwcm90byIsIm1ldGhvZE5hbWUiLCJhIiwiYiIsImMiLCJkIiwiYW55IiwibnVtZXJpYyIsImxldHRlciIsIndpZGVudW1lcmljIiwiYWxwaGFudW1lcmljIiwiUXVpY2tDU1MiLCJjb21wdXRlZFN0eWxlIiwic3ViRWwiLCJzdWJQcm9wZXJ0eSIsIm5vcm1hbGl6ZVByb3BlcnR5IiwiX2NvbXB1dGVkU3R5bGUiLCJnZXRDb21wdXRlZFN0eWxlIiwibm9ybWFsaXplVmFsdWUiLCJjb25zdGFudHMiLCJJTVBPUlRBTlQiLCJmcmFtZXMiLCJmcmFtZSIsInByZWZpeCIsImdldFByZWZpeCIsImdlbmVyYXRlZCIsInJ1bGVUb1N0cmluZyIsImlubGluZVN0eWxlIiwiaGFzaCIsImNsZWFyUmVnaXN0ZXJlZCIsImNsZWFySW5saW5lU3R5bGUiLCJpc1ZhbHVlU3VwcG9ydGVkIiwic3VwcG9ydHMiLCJzdXBwb3J0c1Byb3BlcnR5IiwiaXNQcm9wU3VwcG9ydGVkIiwiQ2hlY2tzIiwibmF0aXZlcyIsImRvbSIsInNldHMiLCJhdmFpbFNldHMiLCJzaG91bGREZWVwRXh0ZW5kIiwicGFyZW50S2V5Iiwic291cmNlVmFsdWUiLCJ0YXJnZXRWYWx1ZSIsInN1YlRhcmdldCIsIndpbiIsImRlYnVnIiwicmFmIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwid2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYiIsInNlbGYiLCJyZWFkcyIsIndyaXRlcyIsIkZhc3REb20iLCJjdHgiLCJ0YXNrIiwic2NoZWR1bGVGbHVzaCIsIm11dGF0ZSIsImNsZWFyIiwibWl4aW4iLCJpbml0aWFsaXplIiwiY2F0Y2giLCJzY2hlZHVsZWQiLCJmbHVzaCIsInJ1blRhc2tzIiwibWVzc2FnZSIsInRhc2tzIiwiZGVmaW5lIiwiZmllbGQxIiwiY2FsbGJhY2sxIiwic2F0aXNmaWVkIiwib2xkVmFsdWUiLCJjb21wYXJpc29uIiwibmVzdGVkT2JqZWN0IiwicHJvcGVydHlDaGFpbiIsImNvbXBhcmlzb25PcGVyYXRvcnMiLCJwYXNzZWRDb21wYXJpc29ucyIsIm9wZXJhdG9yIiwic2Vla2VkVmFsdWUiLCJ0ZXN0TWFzayIsInZhbGlkQ29uZGl0aW9ucyIsImZvbnRGYW1pbHkiLCJib3JkZXIiLCJpbnB1dFBhZGRpbmciLCJsYWJlbFNpemUiLCJpY29uU2l6ZSIsIkNob2ljZSIsIl9zZXR0aW5nRmlsdGVycyIsIm1heEhlaWdodCIsImluaXRpYWxDaG9pY2VzIiwidHlwZUJ1ZmZlciIsImxhc3RTZWxlY3RlZCIsImN1cnJlbnRIaWdobGlnaHRlZCIsInZpc2libGVDaG9pY2VzQ291bnQiLCJ2aXNpYmxlQ2hvaWNlcyIsImVscyIsIl9zZWxlY3RlZENhbGxiYWNrIiwic2Nyb2xsSW5kaWNhdG9yVXAiLCJzY3JvbGxJbmRpY2F0b3JEb3duIiwiTGlzdCIsImFkZENob2ljZSIsIl9hdHRhY2hCaW5kaW5nc19zY3JvbGxJbmRpY2F0b3JzIiwic2Nyb2xsVG9DaG9pY2UiLCJzZXRUcmFuc2xhdGUiLCJuZXdDaG9pY2UiLCJwcmV2Q2hvaWNlIiwidXAiLCJoaWdobGlnaHRQcmV2IiwiZG93biIsImhpZ2hsaWdodE5leHQiLCJlc2MiLCJhbnlQcmludGFibGUiLCJ0eXBlQnVmZmVyVGltZW91dCIsImJ1ZmZlciIsImNob2ljZUluVmlldyIsInNob3dCb3R0b21JbmRpY2F0b3IiLCJzaG93VG9wSW5kaWNhdG9yIiwic3RhcnRTY3JvbGxpbmciLCJzdG9wU2Nyb2xsaW5nIiwiZmluZENob2ljZSIsImJ5TGFiZWwiLCJtYXRjaGVzIiwiZmluZENob2ljZUFueSIsImN1cnJlbnRJbmRleCIsInNjcm9sbFVwIiwic2Nyb2xsRG93biIsImJvdHRvbUN1dG9mZiIsInRyYW5zbGF0aW9uIiwiY2xpcHBpbmdQYXJlbnQiLCJvdmVyZmxvdyIsInNlbGZSZWN0IiwiY2xpcHBpbmdSZWN0IiwidG9wQ3V0b2ZmIiwiaXNCb3R0b21DdXRvZmYiLCJpc1RvcEN1dG9mZiIsIm5lZWRzTmV3SGVpZ2h0IiwiY3V0b2ZmIiwid2luZG93Q3V0b2ZmIiwid2luZG93SGVpZ2h0Iiwic2V0RGltZW5zaW9ucyIsIm9mZnNldCIsImRpc3RhbmVGcm9tVG9wIiwib2Zmc2V0VG9wIiwic2VsZWN0ZWRIZWlnaHQiLCJjaG9pY2VSZWN0IiwibGlzdFJlY3QiLCJ1cFBhZGRpbmciLCJkb3duUGFkZGluZyIsImRpcmVjdGlvbiIsInNjcm9sbEludGVydmFsSUQiLCJ1bmF2YWlsYWJsZSIsInNvcnQiLCJzdG9wUHJvcGFnYXRpb24iLCJuZXdTdGF0ZSIsInByZXZTdGF0ZSIsIm1hc2tDb3JlIiwibWFza0FkZG9ucyIsImRlZmF1bHRQYXR0ZXJuQ2hhcnMiLCJwcmV2Q3Vyc29yIiwicGF0dGVyblJhdyIsInBhdHRlcm5TZXR0ZXIiLCJwbGFjZWhvbGRlckNoYXIiLCJwbGFjZWhvbGRlclJlZ2V4Iiwia2VlcENoYXJQb3NpdGlvbnMiLCJjaGFycyIsImN1c3RvbVBhdHRlcm5zIiwic2V0UGF0dGVybiIsImdldFN0YXRlIiwicmF3VmFsdWUiLCJjdXJyZW50Q2FyZXRQb3NpdGlvbiIsInByZXZpb3VzQ29uZm9ybWVkVmFsdWUiLCJnZXRQbGFjZWhvbGRlciIsImNoYXIiLCJyZXNvbHZlUGF0dGVybiIsInRyYXBJbmRleGVzIiwiY29weSIsInByZXZQYXR0ZXJuIiwicmVzb2x2ZWRQYXR0ZXJuIiwiY2FyZXRUcmFwSW5kZXhlcyIsInVwZGF0ZVZhbHVlIiwidXBkYXRlRmllbGQiLCJwYXJzZVBhdHRlcm4iLCJwYXJzZVRyYW5zZm9ybSIsImVtYWlsTWFzayIsInRyaW0iLCJwYXJ0IiwiY3JlYXRlTnVtYmVyTWFzayIsInN1ZmZpeCIsImluY2x1ZGVUaG91c2FuZHNTZXBhcmF0b3IiLCJzZXAiLCJ0aG91c2FuZHNTZXBhcmF0b3JTeW1ib2wiLCJhbGxvd0RlY2ltYWwiLCJkZWNpbWFsIiwiZGVjaW1hbExpbWl0IiwiaW50ZWdlckxpbWl0IiwibGltaXQiLCJlc2NhcGVkIiwiY3JlYXRlQXV0b0NvcnJlY3RlZERhdGVQaXBlIiwibmV3UGF0dGVybiIsImNvbmZvcm1lZFZhbHVlIiwiY29uZm9ybVRvTWFzayIsInRyYW5zZm9ybWVkIiwiaW5kZXhlc09mUGlwZWRDaGFycyIsImFkanVzdENhcmV0UG9zaXRpb24iLCJrZXlDb2RlcyIsImN0cmwiLCJhbHQiLCJzdXBlcjIiLCJoeXBoZW4iLCJ1bmRlcnNjb3JlIiwicXVlc3Rpb24iLCJleGNsYW1hdGlvbiIsImZyb250c2xhc2giLCJiYWNrc2xhc2giLCJjb21tYSIsInBlcmlvZCIsInNwYWNlIiwiYW55QXJyb3ciLCJjb2RlIiwiYW55TW9kaWZpZXIiLCJhbnlBbHBoYSIsImFueU51bWVyaWMiLCJhbnlBbHBoYU51bWVyaWMiLCJDSEVDS01BUktfV0lEVEgiLCJDT0xPUlMiLCJwb3NpdGlvbiIsInZlcnRpY2FsQWxpZ24iLCJib3hTaXppbmciLCJ0ZXh0QWxpZ24iLCIkdmlzaWJsZSIsIiRzaG93RXJyb3IiLCJ6SW5kZXgiLCJmb250V2VpZ2h0IiwibGluZUhlaWdodCIsImdyZXkiLCJ0cmFuc2l0aW9uIiwidXNlclNlbGVjdCIsInBvaW50ZXJFdmVudHMiLCIkZmlsbGVkIiwiJHNob3dMYWJlbCIsIiRmb2N1cyIsIm9yYW5nZSIsInJlZCIsImJhY2tncm91bmRDb2xvciIsImJvcmRlcldpZHRoIiwiYm9yZGVyU3R5bGUiLCJib3JkZXJDb2xvciIsImdyZXlfbGlnaHQiLCJib3JkZXJSYWRpdXMiLCIkZGlzYWJsZWQiLCJpY29uU2libGluZyIsImlucHV0U2libGluZyIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1JpZ2h0Iiwic3VidHJhY3QiLCJhcHBlYXJhbmNlIiwib3V0bGluZSIsImJsYWNrIiwiYm94U2hhZG93IiwiYmFja2dyb3VuZENsaXAiLCJ0b3RhbEhlaWdodCIsIndvcmthYmxlSGVpZ2h0IiwiZmxvb3IiLCJob3JpeiIsInZlcnRpIiwidmlzaWJpbGl0eSIsIiRzaG93SGVscCIsInBhZGRpbmdUb3AiLCJncmVlbiIsInRyYW5zZm9ybU9yaWdpbiIsIiRpbnZhbGlkIiwibWF4V2lkdGgiLCJtaW5XaWR0aCIsIlJFR0VYX0xFTl9WQUwiLCJSRUdFWF9ESUdJVFMiLCJSRUdFWF9TUEFDRSIsIlJFR0VYX0tFQkFCIiwiUE9TU0lCTEVfUFJFRklYRVMiLCJSRVFVSVJFU19VTklUX1ZBTFVFIiwiUVVBRF9TSE9SVEhBTkRTIiwiRElSRUNUSU9OUyIsInNhbXBsZVN0eWxlIiwidG9LZWJhYkNhc2UiLCJza2lwSW5pdGlhbENoZWNrIiwiZ3JlYXQiLCJwaXZvdCIsImxlc3MiLCJjaGFyQ29kZUF0IiwiaW5saW5lU3R5bGVDb25maWciLCJzdHlsZUNvbmZpZyIsInZhbHVlVG9TdG9yZSIsInN0eWxlRWwiLCJoZWFkIiwiY29udGVudCIsIm51bWJlckxvb3NlIiwiTnVtYmVyIiwiZG9tVGV4dGFyZWEiLCJkb21JbnB1dCIsImRvbVNlbGVjdCIsImRvbUZpZWxkIiwiU1ZHIiwiJGlzT3BlbiIsIiRoYXNWaXNpYmxlQ2hvaWNlcyIsIm92ZXJmbG93U2Nyb2xsaW5nIiwib3ZlcmZsb3dTdHlsZSIsIiR1bmF2YWlsYWJsZSIsIiRob3ZlciIsInN0cm9rZSIsIiRzZWxlY3RlZCIsInRleHRPdmVyZmxvdyIsIndvcmRXcmFwIiwiY2FyZXRVcCIsImNhcmV0RG93biIsImJvcmRlclRvcCIsInIiLCJhbWQiLCJ0ZXh0TWFza0NvcmUiLCJ0IiwibyIsImxvYWRlZCIsIm0iLCJwIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJwcmV2aW91c1BsYWNlaG9sZGVyIiwidSIsImwiLCJzIiwiZiIsImgiLCJnIiwieSIsIkMiLCJQIiwieCIsIk8iLCJNIiwiVCIsInciLCJWIiwiUyIsInN1YnN0ciIsIk4iLCJFIiwiQSIsIkkiLCJKIiwicSIsIkYiLCJMIiwiVyIsInoiLCJEIiwiSCIsIksiLCJRIiwiY29udmVydE1hc2tUb1BsYWNlaG9sZGVyIiwiYWJzIiwiaXNOZXciLCJzb21lQ2hhcnNSZWplY3RlZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJtYXNrV2l0aG91dENhcmV0VHJhcHMiLCJpbmRleGVzIiwicHJvY2Vzc0NhcmV0VHJhcHMiLCJpbnB1dEVsZW1lbnQiLCJzaG93TWFzayIsInJlamVjdGVkIiwiYWN0aXZlRWxlbWVudCIsImFzc2lnbiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidGV4dE1hc2tBZGRvbnMiLCJkZCIsIm1tIiwieXkiLCJ5eXl5Iiwic29tZSIsImxhc3RJbmRleE9mIiwiJCIsImRlY2ltYWxTeW1ib2wiLCJyZXF1aXJlRGVjaW1hbCIsImFsbG93TmVnYXRpdmUiLCJhbGxvd0xlYWRpbmdaZXJvZXMiLCJpbnN0YW5jZU9mIiwiZ3JleV9kYXJrIiwiZ3JleV9zZW1pX2xpZ2h0IiwiZ3JleV9saWdodDIiLCJncmV5X2xpZ2h0MyIsImdyZXlfbGlnaHQ0IiwiU3RhdGVDaGFpbiIsIndpdGhvdXQiLCJvdGhlckFjdGl2ZSIsImFjdGl2ZSIsImFuZ2xlRG93biIsInBsdXMiLCJ2aWV3Qm94IiwidGFiaW5kZXgi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Q1BDLFFBQVE7QUFDUjZ6QixTQUFTOztHQUVWLENBQUMsU0FDQTM2QjtPQUNDMGpDO1VBQVUsQ0FBQztBQUNYQyxXQUFXO0FBQ1g5WSxHQUFHOzs7Ozs7QUNqQlB6OEI7TUFFTTtBQUFOcUQsT0FBT0MsVUFBVXRELElBQUk2SixTQUNwQixDQUFDLFFBQ0ErSDtPQUNDeWpDO1NBQVM7QUFDVEMsVUFBVSxDQUFDO0FBQ1hDLFdBQVc7O0FBQ1p4b0MsT0FDQzBMO09BQU87QUFDUEMsUUFBUTtBQUNSNnpCLFNBQVM7O0dBRVYsQ0FBQyxTQUNBMzZCO09BQ0MwakM7VUFBVSxDQUFDO0FBQ1hDLFdBQVc7QUFDWDlZLEdBQUc7Ozs7OztBQ2pCUHo4QjtNQUVNO0FBQU5xRCxPQUFPQyxVQUFVdEQsSUFBSTZKLFNBQ3BCLENBQUMsUUFDQStIO09BQ0N5akM7U0FBUztBQUNUQyxVQUFVLENBQUM7QUFDWEMsV0FBVzs7QUFDWnhvQyxPQUNDMEw7T0FBTztBQUNQQyxRQUFRO0FBQ1I2ekIsU0FBUzs7R0FFVixDQUFDLFlBQ0EzNkI7T0FDQzBqQztVQUFVLENBQUM7QUFDWEMsV0FBVztBQUNYRSxRQUFROzs7Ozs7QUNqQlp6MUM7TUFFTTtBQUFOcUQsT0FBT0MsVUFBVXRELElBQUk2SixTQUNwQixDQUFDLFFBQ0ErSDtPQUNDeWpDO1NBQVM7QUFDVEMsVUFBVSxDQUFDO0FBQ1hDLFdBQVc7O0FBQ1p4b0MsT0FDQzBMO09BQU87QUFDUEMsUUFBUTtBQUNSNnpCLFNBQVM7O0dBRVYsQ0FBQyxTQUNBMzZCO09BQ0MwakM7VUFBVSxDQUFDO0FBQ1hDLFdBQVc7QUFDWDlZLEdBQUc7O0lBR0wsQ0FBQyxTQUNBN3FCO09BQ0MwakM7VUFBVSxDQUFDO0FBQ1hDLFdBQVc7QUFDWDlZLEdBQUciLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaGVscGVycyA9IGltcG9ydCAnLi9oZWxwZXJzJ1xuRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbklTID0gaW1wb3J0ICcuL2NoZWNrcydcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xucmVnaXN0ZXJBbmltYXRpb25zID0gaW1wb3J0ICcuL2FuaW1hdGlvbnMnXG5SRVFVSVJFRF9GSUVMRF9NRVRIT0RTID0gaW1wb3J0ICcuL2NvbnN0YW50cy9yZXFGaWVsZE1ldGhvZHMnXG5pbXBvcnQgJy4vY29uc29sZVBhdGNoJ1xuXG5cbm5ld0J1aWxkZXIgPSAoc2V0dGluZ092ZXJyaWRlcywgdGVtcGxhdGVPdmVycmlkZXMpLT5cblx0YnVpbGRlciA9IChzZXR0aW5ncyktPlxuXHRcdHNldHRpbmdzID0gZXh0ZW5kLmNsb25lKGFyZ3VtZW50cy4uLikgaWYgYXJndW1lbnRzLmxlbmd0aCA+IDFcblx0XHRzZXR0aW5ncyA9IHt9IHVubGVzcyBJUy5vYmplY3Qoc2V0dGluZ3MpXG5cdFx0c2V0dGluZ3MudHlwZSA/PSAndGV4dCdcblxuXG5cdFx0aWYgbm90IEZpZWxkW3NldHRpbmdzLnR5cGVdXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJRdWlja0ZpZWxkOiAnI3tzZXR0aW5ncy50eXBlfScgaXMgbm90IGEgdmFsaWQvcmVnaXN0ZXJlZCBmaWVsZCB0eXBlXCJcblxuXHRcdHJlZ2lzdGVyQW5pbWF0aW9ucygpXG5cdFx0bmV3IEZpZWxkW3NldHRpbmdzLnR5cGVdKHNldHRpbmdzLCBidWlsZGVyLCBzZXR0aW5nT3ZlcnJpZGVzLCB0ZW1wbGF0ZU92ZXJyaWRlcylcblxuXG5cdGJ1aWxkZXIucmVnaXN0ZXIgPSAodHlwZSwgdGFyZ2V0RmllbGQpLT5cblx0XHRpZiBub3QgSVMuc3RyaW5nKHR5cGUpIG9yIG5vdCBJUy5mdW5jdGlvbih0YXJnZXRGaWVsZClcblx0XHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrRmllbGQgUmVnaXN0cmF0aW9uOiBpbnZhbGlkIGFyZ3VtZW50c1wiXG5cdFx0Zm9yIHJlcXVpcmVkTWV0aG9kIGluIFJFUVVJUkVEX0ZJRUxEX01FVEhPRFNcblx0XHRcdGlmIG5vdCB0YXJnZXRGaWVsZDo6W3JlcXVpcmVkTWV0aG9kXVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJRdWlja0ZpZWxkIFJlZ2lzdHJhdGlvbjogJyN7cmVxdWlyZWRNZXRob2R9JyBtZXRob2QgaXMgcmVxdWlyZWQgaW4gb3JkZXIgdG8gcmVnaXN0ZXIgdGhlIGZpZWxkXCJcblxuXHRcdEZpZWxkW3R5cGVdID0gdGFyZ2V0RmllbGRcblx0XHRyZXR1cm4gQFxuXG5cblx0YnVpbGRlci5jb25maWcgPSAobmV3U2V0dGluZ3MsIG5ld1RlbXBsYXRlcyktPlxuXHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrRmllbGQgQ29uZmlnOiBpbnZhbGlkIGNvbmZpZyBvYmplY3QgcHJvdmlkZWQgI3tTdHJpbmcgbmV3U2V0dGluZ3N9XCIgaWYgbm90IElTLm9iamVjdChuZXdTZXR0aW5ncylcblx0XHRvdXRwdXRTZXR0aW5ncyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRcblx0XHRmb3IgdHlwZSxjb25maWcgb2YgbmV3U2V0dGluZ3Ncblx0XHRcdGlmIHR5cGUgaXMgJ2dsb2JhbCdcblx0XHRcdFx0b3V0cHV0U2V0dGluZ3MuZ2xvYmFsRGVmYXVsdHMgPSBleHRlbmQuZGVlcC5ub3REZWVwKEZpZWxkLnNoYWxsb3dTZXR0aW5ncykuY2xvbmUoRmllbGQ6Omdsb2JhbERlZmF1bHRzLCBjb25maWcpXG5cdFx0XHRlbHNlIGlmIEZpZWxkW3R5cGVdXG5cdFx0XHRcdG91dHB1dFNldHRpbmdzW3R5cGVdID0gZXh0ZW5kLmNsb25lLmRlZXAubm90RGVlcChGaWVsZC5zaGFsbG93U2V0dGluZ3MpKEZpZWxkW3R5cGVdOjpkZWZhdWx0cywgY29uZmlnKVxuXG5cdFx0aWYgSVMub2JqZWN0KG5ld1RlbXBsYXRlcylcblx0XHRcdG91dHB1dFRlbXBsYXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRcdGdsb2JhbENvbmZpZyA9IG5ld1RlbXBsYXRlcy5nbG9iYWxcblx0XHRcdGlmIGdsb2JhbENvbmZpZyBhbmQgZ2xvYmFsQ29uZmlnLmZpZWxkIGFuZCBub3QgZ2xvYmFsQ29uZmlnLmRlZmF1bHRcblx0XHRcdFx0Z2xvYmFsQ29uZmlnLmRlZmF1bHQgPSBnbG9iYWxDb25maWcuZmllbGRcblx0XHRcdFxuXHRcdFx0Zm9yIHR5cGUgb2YgRmllbGRcblx0XHRcdFx0b3JpZ2luYWxUZW1wbGF0ZXMgPSBGaWVsZFt0eXBlXTo6Py50ZW1wbGF0ZXNcblx0XHRcdFx0dGVtcGxhdGVzID0gbmV3VGVtcGxhdGVzW3R5cGVdIG9yIGdsb2JhbENvbmZpZ1xuXHRcdFx0XHRpZiBub3Qgb3JpZ2luYWxUZW1wbGF0ZXNcblx0XHRcdFx0XHRjb250aW51ZVxuXHRcdFx0XHRpZiBub3QgdGVtcGxhdGVzXG5cdFx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW3R5cGVdID0gb3JpZ2luYWxUZW1wbGF0ZXNcblx0XHRcdFx0XHRjb250aW51ZVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgdGVtcGxhdGVzLmZpZWxkIGFuZCBub3QgdGVtcGxhdGVzLmRlZmF1bHRcblx0XHRcdFx0XHR0ZW1wbGF0ZXMuZGVmYXVsdCA9IHRlbXBsYXRlcy5maWVsZFxuXG5cdFx0XHRcdG91dHB1dFRlbXBsYXRlc1t0eXBlXSA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRcdFx0XG5cdFx0XHRcdGZvciBuYW1lLGNvbmZpZyBvZiB0ZW1wbGF0ZXNcblx0XHRcdFx0XHRjb250aW51ZSBpZiBuYW1lIGlzICdmaWVsZCcgb3Igbm90IG9yaWdpbmFsVGVtcGxhdGVzW25hbWVdXG5cdFx0XHRcdFx0Y29uZmlnID0gZXh0ZW5kLmNsb25lLmRlZXAuY29uY2F0KGdsb2JhbENvbmZpZ1tuYW1lXSwgY29uZmlnKSBpZiBnbG9iYWxDb25maWcgYW5kIGdsb2JhbENvbmZpZ1tuYW1lXVxuXHRcdFx0XHRcdG91dHB1dFRlbXBsYXRlc1t0eXBlXVtuYW1lXSA9IG9yaWdpbmFsVGVtcGxhdGVzW25hbWVdLmV4dGVuZChjb25maWcpXG5cblx0XHRcdFx0Zm9yIG5hbWUsY29uZmlnIG9mIG9yaWdpbmFsVGVtcGxhdGVzIHdoZW4gbm90IG91dHB1dFRlbXBsYXRlc1t0eXBlXVtuYW1lXVxuXHRcdFx0XHRcdG91dHB1dFRlbXBsYXRlc1t0eXBlXVtuYW1lXSA9IGNvbmZpZ1xuXG5cdFx0cmV0dXJuIG5ld0J1aWxkZXIob3V0cHV0U2V0dGluZ3MsIG91dHB1dFRlbXBsYXRlcylcblxuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5IGJ1aWxkZXIsICdmaWVsZHMnLCBnZXQ6ICgpLT5cblx0XHRleHRlbmQuY2xvbmUub3duLm5vdEtleXMoJ2luc3RhbmNlcycpKEZpZWxkKVxuXG5cdGJ1aWxkZXIuc2V0dGluZ092ZXJyaWRlcyA9IHNldHRpbmdPdmVycmlkZXNcblx0YnVpbGRlci50ZW1wbGF0ZU92ZXJyaWRlcyA9IHRlbXBsYXRlT3ZlcnJpZGVzXG5cdGJ1aWxkZXIudmVyc2lvbiA9IGltcG9ydCAnLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbidcblx0YnVpbGRlci5GaWVsZCA9IEZpZWxkID0gaW1wb3J0ICcuL2ZpZWxkJ1xuXHRyZXR1cm4gYnVpbGRlclxuXG5cblxuXG5cblxuUXVpY2tGaWVsZCA9IG5ld0J1aWxkZXIoKVxuUXVpY2tGaWVsZC5yZWdpc3RlciAndGV4dCcsIGltcG9ydCAnLi9maWVsZC90ZXh0J1xuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICd0ZXh0YXJlYScsIGltcG9ydCAnLi9maWVsZC90ZXh0YXJlYSdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnbnVtYmVyJywgaW1wb3J0ICcuL2ZpZWxkL251bWJlcidcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnc2VsZWN0JywgaW1wb3J0ICcuL2ZpZWxkL3NlbGVjdCdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnY2hvaWNlJywgaW1wb3J0ICcuL2ZpZWxkL2Nob2ljZSdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAndHJ1ZWZhbHNlJywgaW1wb3J0ICcuL2ZpZWxkL3RydWVmYWxzZSdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAndG9nZ2xlJywgaW1wb3J0ICcuL2ZpZWxkL3RvZ2dsZSdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnZ3JvdXAnLCBpbXBvcnQgJy4vZmllbGQvZ3JvdXAnXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ3JlcGVhdGVyJywgaW1wb3J0ICcuL2ZpZWxkL3JlcGVhdGVyJ1xuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdmaWxlJywgaW1wb3J0ICcuL2ZpZWxkL2ZpbGUnXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrRmllbGQiLCIjIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5AY29uc29sZSA/PSB7fVxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuY29uc29sZS5sb2cgPz0gKCktPlxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuY29uc29sZS53YXJuID89IGNvbnNvbGUubG9nIiwie1xuICBcIm5hbWVcIjogXCJxdWlja2ZpZWxkXCIsXG4gIFwidmVyc2lvblwiOiBcIjEuMC44MVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiRmFzdCAmIGxpZ2h0IGZvcm0gZmllbGRzIG1hbmFnZW1lbnQgc3VwcG9ydGluZyByZWFsLXRpbWUgYmluZGluZ3MsIGN1c3RvbSBzdHlsaW5nLCBjdXN0b20gZmllbGRzLCBJRTkrLCBhbmQgbW9yZS4uLlwiLFxuICBcIm1haW5cIjogXCJkaXN0L3F1aWNrZmllbGQuanNcIixcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3F1aWNrZmllbGQuZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9xdWlja2ZpZWxkLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZFwiOiBcInNyYy9maWVsZC9pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdGV4dFwiOiBcInNyYy9maWVsZC90ZXh0L19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdGV4dGFyZWFcIjogXCJzcmMvZmllbGQvdGV4dGFyZWEvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9udW1iZXJcIjogXCJzcmMvZmllbGQvbnVtYmVyL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvc2VsZWN0XCI6IFwic3JjL2ZpZWxkL3NlbGVjdC9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL2Nob2ljZVwiOiBcInNyYy9maWVsZC9jaG9pY2UvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC90cnVlZmFsc2VcIjogXCJzcmMvZmllbGQvdHJ1ZWZhbHNlL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdG9nZ2xlXCI6IFwic3JjL2ZpZWxkL3RvZ2dsZS9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL2dyb3VwXCI6IFwic3JjL2ZpZWxkL2dyb3VwL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvcmVwZWF0ZXJcIjogXCJzcmMvZmllbGQvcmVwZWF0ZXIvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9maWxlXCI6IFwic3JjL2ZpZWxkL2ZpbGUvX2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwiZmFsc2UgJiYgbnBtIHJ1biB0ZXN0OnRyYXZpcyB8fCB0cnVlXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJ3YXRjaFwiOiBcImNha2UgLWQgd2F0Y2hcIixcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDp0cmF2aXNcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcInRlc3Q6bG9jYWxcIjogXCJvcGVuIHRlc3QvdGVzdHJ1bm5lci5odG1sXCIsXG4gICAgXCJ0ZXN0Om1pbmlmaWVkXCI6IFwibWluaWZpZWQ9MSBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpicm93c2VyXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEVsZWN0cm9uIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6Y2hyb21lXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBDaHJvbWUgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpmaXJlZm94XCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEZpcmVmb3ggLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2ZpZWxkLmdpdFwiXG4gIH0sXG4gIFwiYXV0aG9yXCI6IFwiZGFuaWVsa2FsZW5cIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tmaWVsZC9pc3N1ZXNcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZmllbGQjcmVhZG1lXCIsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBkYW5pZWxrYWxlbi9pc1wiOiBcIl4yLjAuMFwiLFxuICAgIFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRcIjogXCJeMS4xNS44XCIsXG4gICAgXCJmYXN0ZG9tXCI6IFwiXjEuMC42XCIsXG4gICAgXCJsZXZlblwiOiBcIl4yLjAuMFwiLFxuICAgIFwibW92ZS1qc1wiOiBcIl4wLjUuMFwiLFxuICAgIFwicXVpY2tjc3NcIjogXCJeMS4zLjJcIixcbiAgICBcInF1aWNrZG9tXCI6IFwiXjEuMC44MVwiLFxuICAgIFwic21hcnQtZXh0ZW5kXCI6IFwiXjEuNy4zXCIsXG4gICAgXCJ0ZXh0LW1hc2stYWRkb25zXCI6IFwiXjMuNi4wXCIsXG4gICAgXCJ0ZXh0LW1hc2stY29yZVwiOiBcIl41LjAuMVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjaGFsa1wiOiBcIl4yLjAuMVwiLFxuICAgIFwiY29mZmVlLXNjcmlwdFwiOiBcIl4xLjEyLjZcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMi4yLjBcIixcbiAgICBcImtleXNpbVwiOiBcImdpdGh1YjpkYW5pZWxrYWxlbi9rZXlzaW0uanNcIixcbiAgICBcInBhY2thZ2UtaW5zdGFsbFwiOiBcIl4xLjIuNlwiLFxuICAgIFwic2ltcGx5aW1wb3J0XCI6IFwiXjQuMC42XCIsXG4gICAgXCJzaW1wbHl3YXRjaFwiOiBcIl4zLjAuMFwiXG4gIH1cbn1cbiIsIklTID0gaW1wb3J0ICcuL2NoZWNrcydcbkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5TaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcbnJlZ2V4ID0gaW1wb3J0ICcuL2NvbnN0YW50cy9yZWdleCdcblxuaGVscGVycyA9IGV4cG9ydHNcbmhlbHBlcnMubm9vcCA9ICgpLT5cblxuaGVscGVycy5pbmNsdWRlcyA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0dGFyZ2V0IGFuZCB0YXJnZXQuaW5kZXhPZihpdGVtKSBpc250IC0xXG5cbmhlbHBlcnMucmVwZWF0ID0gKHN0cmluZywgY291bnQpLT5cblx0KHN0cmluZyBmb3IgaSBpbiBbMS4uY291bnRdKS5qb2luKCcnKVxuXG5oZWxwZXJzLnJlbW92ZUl0ZW0gPSAodGFyZ2V0LCBpdGVtKS0+XG5cdGl0ZW1JbmRleCA9IHRhcmdldC5pbmRleE9mKGl0ZW0pXG5cdHRhcmdldC5zcGxpY2UoaXRlbUluZGV4LCAxKSBpZiBpdGVtSW5kZXggaXNudCAtMVxuXG5oZWxwZXJzLmluc2VydEFmdGVyID0gKHRhcmdldCwgaXRlbSwgbmV3SXRlbSktPlxuXHRpdGVtSW5kZXggPSB0YXJnZXQuaW5kZXhPZihpdGVtKVxuXHR0YXJnZXQuc3BsaWNlKGl0ZW1JbmRleCwgMCwgbmV3SXRlbSkgaWYgaXRlbUluZGV4IGlzbnQgLTFcblxuaGVscGVycy5maW5kID0gKHRhcmdldCwgZm4pLT5cblx0cmVzdWx0cyA9IHRhcmdldC5maWx0ZXIoZm4pXG5cdHJlc3VsdHNbMF1cblxuaGVscGVycy5kaWZmID0gKHNvdXJjZSwgY29tcGFyZWUpLT5cblx0cmVzdWx0ID0gW11cblx0bWF4TGVuID0gTWF0aC5tYXgoc291cmNlLmxlbmd0aCwgY29tcGFyZWUubGVuZ3RoKVxuXHRpID0gLTFcblx0XG5cdHdoaWxlICsraSA8IG1heExlblxuXHRcdHNvdXJjZVZhbCA9IHNvdXJjZVtpXVxuXHRcdGNvbXBhcmVlVmFsID0gY29tcGFyZWVbaV1cblxuXHRcdGlmIHNvdXJjZVZhbCBpc250IGNvbXBhcmVlVmFsXG5cdFx0XHRyZXN1bHQucHVzaChzb3VyY2VWYWwpIGlmIElTLmRlZmluZWQoc291cmNlVmFsKSBhbmQgbm90IGhlbHBlcnMuaW5jbHVkZXMoY29tcGFyZWUsIHNvdXJjZVZhbClcblx0XHRcdHJlc3VsdC5wdXNoKGNvbXBhcmVlVmFsKSBpZiBJUy5kZWZpbmVkKGNvbXBhcmVlVmFsKSBhbmQgbm90IGhlbHBlcnMuaW5jbHVkZXMoc291cmNlLCBjb21wYXJlZVZhbClcblxuXHRyZXR1cm4gcmVzdWx0XG5cblxuaGVscGVycy5oZXhUb1JHQkEgPSAoaGV4LCBhbHBoYSktPlxuXHRoZXggPSBoZXguc2xpY2UoMSkgaWYgaGV4WzBdIGlzICcjJ1xuXHRSID0gcGFyc2VJbnQgaGV4LnNsaWNlKDAsMiksIDE2XG5cdEcgPSBwYXJzZUludCBoZXguc2xpY2UoMiw0KSwgMTZcblx0QiA9IHBhcnNlSW50IGhleC5zbGljZSg0LDYpLCAxNlxuXHRyZXR1cm4gXCJyZ2JhKCN7Un0sICN7R30sICN7Qn0sICN7YWxwaGF9KVwiXG5cblxuaGVscGVycy5kZWZhdWx0Q29sb3IgPSAoY29sb3IsIGRlZmF1bHRDb2xvciktPlxuXHRpZiBjb2xvciBpcyAndHJhbnNwYXJlbnQnIG9yIG5vdCBjb2xvclxuXHRcdHJldHVybiBkZWZhdWx0Q29sb3Jcblx0ZWxzZVxuXHRcdHJldHVybiBjb2xvclxuXG5cbmhlbHBlcnMuY2FsY1BhZGRpbmcgPSAoZGVzaXJlZEhlaWdodCwgZm9udFNpemUpLT5cblx0TWF0aC5jZWlsIChkZXNpcmVkSGVpZ2h0IC0gZm9udFNpemUqMS4yMzEpLzJcblxuXG5oZWxwZXJzLnVubG9ja1Njcm9sbCA9IChleGNsdWRlZEVsKS0+XG5cdHdpbmRvdy5faXNMb2NrZWQgPSBmYWxzZVxuXHRET00od2luZG93KS5vZmYgJ3doZWVsLmxvY2snXG5cblxuaGVscGVycy5sb2NrU2Nyb2xsID0gKGV4Y2x1ZGVkRWwpLT4gdW5sZXNzIHdpbmRvdy5faXNMb2NrZWRcblx0d2luZG93Ll9pc0xvY2tlZCA9IHRydWVcblx0RE9NKHdpbmRvdykub24gJ3doZWVsLmxvY2snLCAoZXZlbnQpLT5cblx0XHRpZiBldmVudC50YXJnZXQgaXMgZXhjbHVkZWRFbC5yYXcgb3IgRE9NKGV2ZW50LnRhcmdldCkucGFyZW50TWF0Y2hpbmcoKHBhcmVudCktPiBwYXJlbnQgaXMgZXhjbHVkZWRFbClcblx0XHRcdGlmIGV2ZW50LndoZWVsRGVsdGEgPiAwIGFuZCBleGNsdWRlZEVsLnJhdy5zY3JvbGxUb3AgaXMgMFxuXHRcdFx0XHRyZXR1cm4gZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0XHRpZiBldmVudC53aGVlbERlbHRhIDwgMCBhbmQgZXhjbHVkZWRFbC5yYXcuc2Nyb2xsSGVpZ2h0IC0gZXhjbHVkZWRFbC5yYXcuc2Nyb2xsVG9wIGlzIGV4Y2x1ZGVkRWwucmF3LmNsaWVudEhlaWdodFxuXHRcdFx0XHRyZXR1cm4gZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0ZWxzZVxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cbmhlbHBlcnMuZnV6enlNYXRjaCA9IChuZWVkbGUsIGhheXN0YWNrLCBjYXNlU2Vuc2l0aXZlKS0+XG5cdG5MZW5ndGggPSBuZWVkbGUubGVuZ3RoXG5cdGhMZW5ndGggPSBoYXlzdGFjay5sZW5ndGhcblx0dW5sZXNzIGNhc2VTZW5zaXRpdmVcblx0XHRuZWVkbGUgPSBuZWVkbGUudG9VcHBlckNhc2UoKVxuXHRcdGhheXN0YWNrID0gaGF5c3RhY2sudG9VcHBlckNhc2UoKVxuXG5cdGlmIG5MZW5ndGggPiBoTGVuZ3RoXG5cdFx0cmV0dXJuIGZhbHNlXG5cdGlmIG5MZW5ndGggaXMgaExlbmd0aFxuXHRcdHJldHVybiBuZWVkbGUgaXMgaGF5c3RhY2tcblxuXHRuSSA9IGhJID0gbWF0Y2hlZENvdW50ID0wXG5cdHdoaWxlIG5JIDwgbkxlbmd0aFxuXHRcdG5lZWRsZUNoYXIgPSBuZWVkbGVbbkkrK11cblx0XHRcblx0XHR3aGlsZSBoSSA8IGhMZW5ndGhcblx0XHRcdGlmIGhheXN0YWNrW2hJKytdIGlzIG5lZWRsZUNoYXJcblx0XHRcdFx0bWF0Y2hlZENvdW50Kytcblx0XHRcdFx0YnJlYWtcblxuXHRyZXR1cm4gbWF0Y2hlZENvdW50IGlzIG5MZW5ndGhcblxuXG5oZWxwZXJzLnN0YXJ0c1dpdGggPSAobmVlZGxlLCBoYXlzdGFjaywgY2FzZVNlbnNpdGl2ZSktPlxuXHR1bmxlc3MgY2FzZVNlbnNpdGl2ZVxuXHRcdG5lZWRsZSA9IG5lZWRsZS50b1VwcGVyQ2FzZSgpXG5cdFx0aGF5c3RhY2sgPSBoYXlzdGFjay50b1VwcGVyQ2FzZSgpXG5cblx0aWYgbmVlZGxlLmxlbmd0aCA+IGhheXN0YWNrLmxlbmd0aFxuXHRcdHJldHVybiBmYWxzZVxuXHRpZiBuZWVkbGUubGVuZ3RoIGlzIGhheXN0YWNrLmxlbmd0aFxuXHRcdHJldHVybiBuZWVkbGUgaXMgaGF5c3RhY2tcblxuXHRpID0gLTFcblx0d2hpbGUgbmVlZGxlWysraV1cblx0XHRyZXR1cm4gZmFsc2UgaWYgbmVlZGxlW2ldIGlzbnQgaGF5c3RhY2tbaV1cblx0cmV0dXJuIHRydWVcblxuXG5oZWxwZXJzLmdldEluZGV4T2ZGaXJzdERpZmYgPSAoc291cmNlU3RyaW5nLCBjb21wYXJlU3RyaW5nKS0+XG5cdGN1cnJlbnRQb3MgPSAwXG5cdG1heExlbmd0aCA9IE1hdGgubWF4KHNvdXJjZVN0cmluZy5sZW5ndGgsIGNvbXBhcmVTdHJpbmcubGVuZ3RoKVxuXHRcblx0d2hpbGUgY3VycmVudFBvcyA8IG1heExlbmd0aFxuXHRcdHJldHVybiBjdXJyZW50UG9zIGlmIHNvdXJjZVN0cmluZ1tjdXJyZW50UG9zXSBpc250IGNvbXBhcmVTdHJpbmdbY3VycmVudFBvc11cblx0XHRjdXJyZW50UG9zKytcblx0XG5cdHJldHVybiBudWxsXG5cblxuXG5oZWxwZXJzLnBhcnNlQ3NzU2hvcnRoYW5kVmFsdWUgPSAoc3RyaW5nKS0+XG5cdHZhbHVlcyA9IHN0cmluZy5zcGxpdChyZWdleC53aGl0ZVNwYWNlKS5tYXAocGFyc2VGbG9hdClcblx0cmVzdWx0ID0ge31cblx0c3dpdGNoIHZhbHVlcy5sZW5ndGhcblx0XHR3aGVuIDFcblx0XHRcdHJlc3VsdC50b3AgPSByZXN1bHQucmlnaHQgPSByZXN1bHQuYm90dG9tID0gcmVzdWx0LmxlZnQgPSB2YWx1ZXNbMF1cblx0XHR3aGVuIDJcblx0XHRcdHJlc3VsdC50b3AgPSByZXN1bHQuYm90dG9tID0gdmFsdWVzWzBdXG5cdFx0XHRyZXN1bHQucmlnaHQgPSByZXN1bHQubGVmdCA9IHZhbHVlc1sxXVxuXHRcdHdoZW4gM1xuXHRcdFx0cmVzdWx0LnRvcCA9IHZhbHVlc1swXVxuXHRcdFx0cmVzdWx0LnJpZ2h0ID0gcmVzdWx0LmxlZnQgPSB2YWx1ZXNbMV1cblx0XHRcdHJlc3VsdC5ib3R0b20gPSB2YWx1ZXNbMl1cblx0XHR3aGVuIDRcblx0XHRcdHJlc3VsdC50b3AgPSB2YWx1ZXNbMF1cblx0XHRcdHJlc3VsdC5yaWdodCA9IHZhbHVlc1sxXVxuXHRcdFx0cmVzdWx0LmJvdHRvbSA9IHZhbHVlc1syXVxuXHRcdFx0cmVzdWx0LmxlZnQgPSB2YWx1ZXNbM11cblxuXHRyZXR1cm4gcmVzdWx0XG5cblxuaGVscGVycy5zaG9ydGhhbmRTaWRlVmFsdWUgPSAodmFsdWUsIHNpZGUpLT5cblx0c3dpdGNoIHR5cGVvZiB2YWx1ZVxuXHRcdHdoZW4gJ251bWJlcicgdGhlbiB2YWx1ZVxuXHRcdHdoZW4gJ3N0cmluZydcblx0XHRcdHZhbHVlcyA9IGhlbHBlcnMucGFyc2VDc3NTaG9ydGhhbmRWYWx1ZSh2YWx1ZSlcblx0XHRcdHZhbHVlc1tzaWRlXVxuXHRcdGVsc2UgMFxuXG5cbmhlbHBlcnMudXBkYXRlU2hvcnRoYW5kVmFsdWUgPSAodmFsdWUsIHNpZGUsIG5ld1ZhbHVlKS0+XG5cdHZhbHVlcyA9IGhlbHBlcnMucGFyc2VDc3NTaG9ydGhhbmRWYWx1ZSgnJysodmFsdWUgb3IgMCkpXG5cdHN3aXRjaCBzaWRlXG5cdFx0d2hlbiAndG9wJyB0aGVuIHZhbHVlcy50b3AgKz0gbmV3VmFsdWVcblx0XHR3aGVuICdyaWdodCcgdGhlbiB2YWx1ZXMucmlnaHQgKz0gbmV3VmFsdWVcblx0XHR3aGVuICdib3R0b20nIHRoZW4gdmFsdWVzLmJvdHRvbSArPSBuZXdWYWx1ZVxuXHRcdHdoZW4gJ2xlZnQnIHRoZW4gdmFsdWVzLmxlZnQgKz0gbmV3VmFsdWVcblx0XHRlbHNlIE9iamVjdC5rZXlzKHZhbHVlcykuZm9yRWFjaCAoc2lkZSktPiB2YWx1ZXNbc2lkZV0gKz0gbmV3VmFsdWVcblx0XG5cdFwiI3t2YWx1ZXMudG9wfXB4ICN7dmFsdWVzLnJpZ2h0fXB4ICN7dmFsdWVzLmJvdHRvbX1weCAje3ZhbHVlcy5sZWZ0fXB4XCJcblxuXG5cblxuXG5cblxuXG4iLCJzdmdOYW1lc3BhY2UgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5pbXBvcnQgKiBhcyBDU1MgZnJvbSAncXVpY2tjc3MnXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5pbXBvcnQgKiBhcyBleHRlbmQgZnJvbSAnc21hcnQtZXh0ZW5kJ1xuaW1wb3J0ICcuL3BhcnRzL2FsbG93ZWRPcHRpb25zJ1xuaW1wb3J0ICcuL3BhcnRzL2hlbHBlcnMnXG5pbXBvcnQgJy4vcGFydHMvY2hlY2tzJ1xuaW1wb3J0ICcuL3BhcnRzL2VsZW1lbnQnXG5pbXBvcnQgJy4vcGFydHMvd2luZG93J1xuaW1wb3J0ICcuL3BhcnRzL21lZGlhUXVlcnknXG5cblF1aWNrRG9tID0gKCktPiBhcmdzPWFyZ3VtZW50czsgc3dpdGNoXG5cdHdoZW4gSVMuYXJyYXkoYXJnc1swXSlcblx0XHRyZXR1cm4gUXVpY2tEb20oYXJnc1swXS4uLilcblx0XG5cdHdoZW4gSVMudGVtcGxhdGUoYXJnc1swXSlcblx0XHRyZXR1cm4gYXJnc1swXS5zcGF3bigpXG5cdFxuXHR3aGVuIElTLnF1aWNrRG9tRWwoYXJnc1swXSlcblx0XHRyZXR1cm4gaWYgYXJnc1sxXSB0aGVuIGFyZ3NbMF0udXBkYXRlT3B0aW9ucyhhcmdzWzFdKSBlbHNlIGFyZ3NbMF1cblx0XG5cdHdoZW4gSVMuZG9tTm9kZShhcmdzWzBdKSBvciBJUy5kb21Eb2MoYXJnc1swXSlcblx0XHRpZiBhcmdzWzBdLl9xdWlja0VsZW1lbnRcblx0XHRcdHJldHVybiBhcmdzWzBdLl9xdWlja0VsZW1lbnRcblx0XHRcblx0XHR0eXBlID0gYXJnc1swXS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyMnLCAnJylcblx0XHRvcHRpb25zID0gYXJnc1sxXSBvciB7fVxuXHRcdG9wdGlvbnMuZXhpc3RpbmcgPSBhcmdzWzBdXG5cdFx0cmV0dXJuIG5ldyBRdWlja0VsZW1lbnQodHlwZSwgb3B0aW9ucylcblxuXHR3aGVuIGFyZ3NbMF0gaXMgd2luZG93XG5cdFx0cmV0dXJuIFF1aWNrV2luZG93XG5cblx0d2hlbiBJUy5zdHJpbmcoYXJnc1swXSlcdFx0XHRcblx0XHR0eXBlID0gYXJnc1swXS50b0xvd2VyQ2FzZSgpXG5cdFx0aWYgdHlwZSBpcyAndGV4dCdcblx0XHRcdG9wdGlvbnMgPSBpZiBJUy5vYmplY3QoYXJnc1sxXSkgdGhlbiBhcmdzWzFdIGVsc2Uge3RleHQ6YXJnc1sxXSBvciAnJ31cblx0XHRlbHNlXG5cdFx0XHRvcHRpb25zID0gaWYgSVMub2JqZWN0KGFyZ3NbMV0pIHRoZW4gYXJnc1sxXSBlbHNlIHt9XG5cdFx0XG5cdFx0ZWxlbWVudCA9IG5ldyBRdWlja0VsZW1lbnQodHlwZSwgb3B0aW9ucylcblx0XHRpZiBhcmdzLmxlbmd0aCA+IDJcblx0XHRcdGNoaWxkcmVuID0gW107IGkgPSAxOyBhcmdzTGVuZ3RoID0gYXJncy5sZW5ndGg7IGNoaWxkcmVuLnB1c2goYXJnc1tpXSkgd2hpbGUgKytpIDwgYXJnc0xlbmd0aFxuXG5cdFx0XHRmb3IgY2hpbGQgaW4gY2hpbGRyZW5cblx0XHRcdFx0Y2hpbGQgPSBRdWlja0RvbS50ZXh0KGNoaWxkKSBpZiBJUy5zdHJpbmcoY2hpbGQpXG5cdFx0XHRcdGNoaWxkID0gY2hpbGQuc3Bhd24oZmFsc2UpIGlmIElTLnRlbXBsYXRlKGNoaWxkKVxuXHRcdFx0XHRjaGlsZCA9IFF1aWNrRG9tKGNoaWxkLi4uKSBpZiBJUy5hcnJheShjaGlsZClcblx0XHRcdFx0Y2hpbGQuYXBwZW5kVG8oZWxlbWVudCkgaWYgSVMucXVpY2tEb21FbChjaGlsZClcblxuXHRcdHJldHVybiBlbGVtZW50XG5cblx0d2hlbiBhcmdzWzBdIGFuZCAoSVMuZG9tTm9kZShhcmdzWzBdWzBdKSBvciBJUy5kb21Eb2MoYXJnc1swXVswXSkpXG5cdFx0cmV0dXJuIFF1aWNrRG9tKGFyZ3NbMF1bMF0pXG5cblxuUXVpY2tEb20udGVtcGxhdGUgPSAodHJlZSktPlxuXHRuZXcgUXVpY2tUZW1wbGF0ZSh0cmVlLCB0cnVlKVxuXG5cblF1aWNrRG9tLmh0bWwgPSAoaW5uZXJIVE1MKS0+XG5cdGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdGNvbnRhaW5lci5pbm5lckhUTUwgPSBpbm5lckhUTUxcblx0Y2hpbGRyZW4gPSBBcnJheTo6c2xpY2UuY2FsbCBjb250YWluZXIuY2hpbGROb2Rlc1xuXG5cdHJldHVybiBRdWlja0RvbS5iYXRjaChjaGlsZHJlbilcblxuUXVpY2tEb20ucXVlcnkgPSAodGFyZ2V0KS0+XG5cdFF1aWNrRG9tKGRvY3VtZW50KS5xdWVyeSh0YXJnZXQpXG5cblF1aWNrRG9tLnF1ZXJ5QWxsID0gKHRhcmdldCktPlxuXHRRdWlja0RvbShkb2N1bWVudCkucXVlcnlBbGwodGFyZ2V0KVxuXG5RdWlja0RvbS5pc1RlbXBsYXRlID0gKHRhcmdldCktPlxuXHRJUy50ZW1wbGF0ZSh0YXJnZXQpXG5cblF1aWNrRG9tLmlzUXVpY2tFbCA9ICh0YXJnZXQpLT5cblx0SVMucXVpY2tEb21FbCh0YXJnZXQpXG5cblF1aWNrRG9tLmlzRWwgPSAodGFyZ2V0KS0+XG5cdElTLmRvbUVsKHRhcmdldClcblxuXG5cblxuXG5pbXBvcnQgJy4vcGFydHMvYmF0Y2gnXG5pbXBvcnQgJy4vcGFydHMvdGVtcGxhdGUnXG5pbXBvcnQgJy4vcGFydHMvc2hvcnRjdXRzJ1xuUXVpY2tEb20udmVyc2lvbiA9IGltcG9ydCAnLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbidcblF1aWNrRG9tLkNTUyA9IENTU1xubW9kdWxlLmV4cG9ydHMgPSBRdWlja0RvbVxuXG5cblxuIiwiYWxsb3dlZFRlbXBsYXRlT3B0aW9ucyA9IFsgIyBUbyBjb3B5IGZyb20gRE9NIEVsZW1lbnRzXG5cdCdpZCdcblx0J25hbWUnXG5cdCd0eXBlJ1xuXHQnaHJlZidcblx0J3NlbGVjdGVkJ1xuXHQnY2hlY2tlZCdcblx0J2NsYXNzTmFtZSdcbl1cblxuYWxsb3dlZE9wdGlvbnMgPSBbICMgVXNlZCBpbiBRdWlja0VsZW1lbnQ6OnRvSlNPTlxuXHQnaWQnXG5cdCdyZWYnXG5cdCd0eXBlJ1xuXHQnbmFtZSdcblx0J3RleHQnXG5cdCdzdHlsZSdcblx0J2NsYXNzJ1xuXHQnY2xhc3NOYW1lJ1xuXHQndXJsJ1xuXHQnaHJlZidcblx0J3NlbGVjdGVkJ1xuXHQnY2hlY2tlZCdcblx0J3Byb3BzJ1xuXHQnYXR0cnMnXG5cdCdwYXNzU3RhdGVUb0NoaWxkcmVuJ1xuXHQnc3RhdGVUcmlnZ2Vycydcblx0IyAncmVsYXRlZEluc3RhbmNlJ1xuXSIsImhlbHBlcnMgPSB7fVxuXG5oZWxwZXJzLmluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPlxuXHR0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuaGVscGVycy5yZW1vdmVJdGVtID0gKHRhcmdldCwgaXRlbSktPlxuXHRpdGVtSW5kZXggPSB0YXJnZXQuaW5kZXhPZihpdGVtKVxuXHR0YXJnZXQuc3BsaWNlKGl0ZW1JbmRleCwgMSkgIGlmIGl0ZW1JbmRleCBpc250IC0xXG5cdHJldHVybiB0YXJnZXRcblxuaGVscGVycy5ub3JtYWxpemVHaXZlbkVsID0gKHRhcmdldEVsKS0+IHN3aXRjaFxuXHR3aGVuIElTLnN0cmluZyh0YXJnZXRFbCkgdGhlbiBRdWlja0RvbS50ZXh0KHRhcmdldEVsKVxuXHR3aGVuIElTLmRvbU5vZGUodGFyZ2V0RWwpIHRoZW4gUXVpY2tEb20odGFyZ2V0RWwpXG5cdHdoZW4gSVMudGVtcGxhdGUodGFyZ2V0RWwpIHRoZW4gdGFyZ2V0RWwuc3Bhd24oKVxuXHRlbHNlIHRhcmdldEVsXG5cblxuaGVscGVycy5pc1N0YXRlU3R5bGUgPSAoc3RyaW5nKS0+XG5cdHN0cmluZ1swXSBpcyAnJCcgb3Igc3RyaW5nWzBdIGlzICdAJ1xuXG5cbmhlbHBlcnMucmVnaXN0ZXJTdHlsZSA9IChydWxlLCBsZXZlbCwgaW1wb3J0YW50KS0+XG5cdGxldmVsIHx8PSAwXG5cdGNhY2hlZCA9IHN0eWxlQ2FjaGUuZ2V0KHJ1bGUsIGxldmVsKVxuXHRyZXR1cm4gY2FjaGVkIGlmIGNhY2hlZFxuXHRvdXRwdXQgPSB7Y2xhc3NOYW1lOltDU1MucmVnaXN0ZXIocnVsZSwgbGV2ZWwsIGltcG9ydGFudCldLCBmbnM6W10sIHJ1bGV9XG5cdHByb3BzID0gT2JqZWN0LmtleXMocnVsZSlcblx0XG5cdGZvciBwcm9wIGluIHByb3BzIHdoZW4gdHlwZW9mIHJ1bGVbcHJvcF0gaXMgJ2Z1bmN0aW9uJ1xuXHRcdG91dHB1dC5mbnMucHVzaCBbcHJvcCwgcnVsZVtwcm9wXV1cblxuXHRyZXR1cm4gc3R5bGVDYWNoZS5zZXQocnVsZSwgb3V0cHV0LCBsZXZlbClcblxuXG5zdHlsZUNhY2hlID0gbmV3IGNsYXNzXG5cdGNvbnN0cnVjdG9yOiAoKS0+XG5cdFx0QGtleXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdFx0QHZhbHVlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuXHRnZXQ6IChrZXksIGxldmVsKS0+IGlmIEBrZXlzW2xldmVsXVxuXHRcdGluZGV4ID0gQGtleXNbbGV2ZWxdLmluZGV4T2Yoa2V5KVxuXHRcdHJldHVybiBAdmFsdWVzW2xldmVsXVtpbmRleF0gaWYgaW5kZXggaXNudCAtMVxuXG5cdHNldDogKGtleSwgdmFsdWUsIGxldmVsKS0+XG5cdFx0aWYgbm90IEBrZXlzW2xldmVsXVxuXHRcdFx0QGtleXNbbGV2ZWxdID0gW11cblx0XHRcdEB2YWx1ZXNbbGV2ZWxdID0gW11cblxuXHRcdEBrZXlzW2xldmVsXS5wdXNoIGtleVxuXHRcdEB2YWx1ZXNbbGV2ZWxdLnB1c2ggdmFsdWVcblx0XHRyZXR1cm4gdmFsdWVcblxuIiwiSVMgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9pcydcbklTID0gSVMuY3JlYXRlKCduYXRpdmVzJywnZG9tJylcbklTLmxvYWRcdFxuXHRxdWlja0RvbUVsOiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0LmNvbnN0cnVjdG9yLm5hbWUgaXMgUXVpY2tFbGVtZW50Lm5hbWVcblx0XG5cdHRlbXBsYXRlOiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0LmNvbnN0cnVjdG9yLm5hbWUgaXMgUXVpY2tUZW1wbGF0ZS5uYW1lXG5cdFxuXHQjIGJhdGNoOiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0LmNvbnN0cnVjdG9yLm5hbWUgaXMgJ1F1aWNrQmF0Y2gnXG5cbiIsImNsYXNzIFF1aWNrRWxlbWVudFxuXHRjb25zdHJ1Y3RvcjogKEB0eXBlLCBAb3B0aW9ucyktPlxuXHRcdEBzdmcgPSB0cnVlIGlmIEB0eXBlWzBdIGlzICcqJ1xuXHRcdEBlbCA9IEBvcHRpb25zLmV4aXN0aW5nIG9yXG5cdFx0XHRpZiBAdHlwZSBpcyAndGV4dCcgdGhlbiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpZiB0eXBlb2YgQG9wdGlvbnMudGV4dCBpcyAnc3RyaW5nJyB0aGVuIEBvcHRpb25zLnRleHQgZWxzZSAnJylcblx0XHRcdGVsc2UgaWYgQHN2ZyB0aGVuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmdOYW1lc3BhY2UsIEB0eXBlLnNsaWNlKDEpKVxuXHRcdFx0ZWxzZSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KEB0eXBlKVxuXG5cdFx0aWYgQHR5cGUgaXMgJ3RleHQnXG5cdFx0XHRAYXBwZW5kID0gQHByZXBlbmQgPSBAYXR0ciA9ICgpLT5cblx0XHRcdCMgQF90ZXh0cyA9IHt9ICMgZGVmaW5lZCBjb25kaXRpb25hbGx5XG5cblx0XHRAX3BhcmVudCA9IG51bGxcblx0XHRAX3N0eWxlcyA9IHt9XG5cdFx0QF9zdGF0ZSA9IFtdXG5cdFx0QF9jaGlsZHJlbiA9IFtdXG5cdFx0IyBAX3Byb3ZpZGVkU3RhdGVzID0gW11cdFx0XHRcdCMgZGVmaW5lZCBjb25kaXRpb25hbGx5XG5cdFx0IyBAX3Byb3ZpZGVkU3RhdGVzU2hhcmVkID0gW11cdFx0IyBkZWZpbmVkIGNvbmRpdGlvbmFsbHlcblx0XHQjIEBfZXZlbnRDYWxsYmFja3MgPSB7X19yZWZzOnt9fVx0IyBkZWZpbmVkIGNvbmRpdGlvbmFsbHlcblx0XHRcblx0XHRAX25vcm1hbGl6ZU9wdGlvbnMoKVxuXHRcdEBfYXBwbHlPcHRpb25zKClcblx0XHRAX2F0dGFjaFN0YXRlRXZlbnRzKClcblx0XHRAX3Byb3h5UGFyZW50KClcblx0XHRAX3JlZnJlc2hQYXJlbnQoKSBpZiBAb3B0aW9ucy5leGlzdGluZ1xuXHRcdEBlbC5fcXVpY2tFbGVtZW50ID0gQFxuXG5cblx0dG9KU09OOiAoKS0+XG5cdFx0b3V0cHV0ID0gW0B0eXBlLCBleHRlbmQuY2xvbmUua2V5cyhhbGxvd2VkT3B0aW9ucykoQG9wdGlvbnMpXVxuXHRcdGNoaWxkcmVuID0gQGNoaWxkcmVuXG5cdFx0b3V0cHV0LnB1c2goY2hpbGQudG9KU09OKCkpIGZvciBjaGlsZCBpbiBjaGlsZHJlblxuXHRcdHJldHVybiBvdXRwdXRcblxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuUXVpY2tFbGVtZW50Lm5hbWUgPz0gJ1F1aWNrRWxlbWVudCdcblxuaW1wb3J0ICcuL2FsaWFzZXMnXG5pbXBvcnQgJy4vdHJhdmVyc2luZydcbmltcG9ydCAnLi9pbml0J1xuaW1wb3J0ICcuL2V2ZW50cydcbmltcG9ydCAnLi9zdGF0ZSdcbmltcG9ydCAnLi9zdHlsZSdcbmltcG9ydCAnLi9hdHRyaWJ1dGVzLWFuZC1wcm9wZXJ0aWVzJ1xuaW1wb3J0ICcuL21hbmlwdWxhdGlvbidcbmltcG9ydCAnLi9hcHBsaWNhdGlvbidcbiIsIk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIFF1aWNrRWxlbWVudDo6LFxuXHQncmF3JzogZ2V0OiAoKS0+IEBlbFxuXHQnMCc6IGdldDogKCktPiBAZWxcblx0J2Nzcyc6IGdldDogKCktPiBAc3R5bGVcblx0J3JlcGxhY2VXaXRoJzogZ2V0OiAoKS0+IEByZXBsYWNlXG5cdCdyZW1vdmVMaXN0ZW5lcic6IGdldDogKCktPiBAb2ZmXG5cbiIsIlF1aWNrRWxlbWVudDo6cGFyZW50c1VudGlsID0gKGZpbHRlciktPlxuXHRfZ2V0UGFyZW50cyhALCBmaWx0ZXIpXG5cblF1aWNrRWxlbWVudDo6cGFyZW50TWF0Y2hpbmcgPSAoZmlsdGVyKS0+XG5cdGlmIElTLmZ1bmN0aW9uKGZpbHRlcikgb3IgaXNSZWY9SVMuc3RyaW5nKGZpbHRlcilcblx0XHRuZXh0UGFyZW50ID0gQHBhcmVudFxuXHRcdHdoaWxlIG5leHRQYXJlbnRcblx0XHRcdGlmIGlzUmVmXG5cdFx0XHRcdHJldHVybiBuZXh0UGFyZW50IGlmIG5leHRQYXJlbnQucmVmIGlzIGZpbHRlclxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gbmV4dFBhcmVudCBpZiBmaWx0ZXIobmV4dFBhcmVudClcblxuXHRcdFx0bmV4dFBhcmVudCA9IG5leHRQYXJlbnQucGFyZW50XG5cdFx0XG5cdHJldHVyblxuXG5RdWlja0VsZW1lbnQ6OnF1ZXJ5ID0gKHNlbGVjdG9yKS0+XG5cdFF1aWNrRG9tIEByYXcucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcblxuUXVpY2tFbGVtZW50OjpxdWVyeUFsbCA9IChzZWxlY3RvciktPlxuXHRyZXN1bHQgPSBAcmF3LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG5cdG91dHB1dCA9IFtdOyBvdXRwdXQucHVzaChpdGVtKSBmb3IgaXRlbSBpbiByZXN1bHRcblx0cmV0dXJuIG5ldyBRdWlja0JhdGNoKG91dHB1dClcblxuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIFF1aWNrRWxlbWVudDo6LFxuXHQnY2hpbGRyZW4nOiBnZXQ6ICgpLT5cblx0XHRpZiBAZWwuY2hpbGROb2Rlcy5sZW5ndGggaXNudCBAX2NoaWxkcmVuLmxlbmd0aCAjIFJlLWNvbGxlY3QgY2hpbGRyZW5cdFxuXHRcdFx0QF9jaGlsZHJlbi5sZW5ndGggPSAwICMgRW1wdHkgb3V0IGNoaWxkcmVuIGFycmF5XG5cdFx0XHRAX2NoaWxkcmVuLnB1c2goUXVpY2tEb20oY2hpbGQpKSBmb3IgY2hpbGQgaW4gQGVsLmNoaWxkTm9kZXMgd2hlbiBjaGlsZC5ub2RlVHlwZSA8IDRcblxuXHRcdHJldHVybiBAX2NoaWxkcmVuXG5cblx0J2VsZW1lbnRDaGlsZHJlbic6IGdldDogKCktPlxuXHRcdF9maWx0ZXJFbGVtZW50cyhAY2hpbGRyZW4pXG5cblx0J3BhcmVudCc6IGdldDogKCktPlxuXHRcdGlmIChub3QgQF9wYXJlbnQgb3IgQF9wYXJlbnQuZWwgaXNudCBAZWwucGFyZW50Tm9kZSkgYW5kIG5vdCBJUy5kb21Eb2MoQGVsLnBhcmVudE5vZGUpXG5cdFx0XHRAX3BhcmVudCA9IFF1aWNrRG9tKEBlbC5wYXJlbnROb2RlKVxuXG5cdFx0cmV0dXJuIEBfcGFyZW50XG5cblxuXHQncGFyZW50cyc6IGdldDogKCktPlxuXHRcdF9nZXRQYXJlbnRzKEApXG5cblx0J25leHQnOiBnZXQ6ICgpLT5cblx0XHRRdWlja0RvbShAZWwubmV4dFNpYmxpbmcpXG5cdFxuXHQnbmV4dEVsJzogZ2V0OiAoKS0+XG5cdFx0UXVpY2tEb20oQGVsLm5leHRFbGVtZW50U2libGluZylcblx0XG5cdCduZXh0RWxBbGwnOiBnZXQ6ICgpLT5cblx0XHRfZmlsdGVyRWxlbWVudHMoQG5leHRBbGwpXG5cblx0J25leHRBbGwnOiBnZXQ6ICgpLT5cblx0XHRzaWJsaW5ncyA9IFtdXG5cdFx0bmV4dFNpYmxpbmcgPSBRdWlja0RvbShAZWwubmV4dFNpYmxpbmcpXG5cdFx0d2hpbGUgbmV4dFNpYmxpbmdcblx0XHRcdHNpYmxpbmdzLnB1c2gobmV4dFNpYmxpbmcpXG5cdFx0XHRuZXh0U2libGluZyA9IG5leHRTaWJsaW5nLm5leHRcblxuXHRcdHJldHVybiBzaWJsaW5nc1xuXG5cdCdwcmV2JzogZ2V0OiAoKS0+XG5cdFx0UXVpY2tEb20oQGVsLnByZXZpb3VzU2libGluZylcblx0XG5cdCdwcmV2RWwnOiBnZXQ6ICgpLT5cblx0XHRRdWlja0RvbShAZWwucHJldmlvdXNFbGVtZW50U2libGluZylcblx0XG5cdCdwcmV2RWxBbGwnOiBnZXQ6ICgpLT5cblx0XHRfZmlsdGVyRWxlbWVudHMoQHByZXZBbGwpXG5cblx0J3ByZXZBbGwnOiBnZXQ6ICgpLT5cblx0XHRzaWJsaW5ncyA9IFtdXG5cdFx0cHJldlNpYmxpbmcgPSBRdWlja0RvbShAZWwucHJldmlvdXNTaWJsaW5nKVxuXHRcdHdoaWxlIHByZXZTaWJsaW5nXG5cdFx0XHRzaWJsaW5ncy5wdXNoKHByZXZTaWJsaW5nKVxuXHRcdFx0cHJldlNpYmxpbmcgPSBwcmV2U2libGluZy5wcmV2XG5cblx0XHRyZXR1cm4gc2libGluZ3NcblxuXHQnc2libGluZ3MnOiBnZXQ6ICgpLT5cblx0XHRAcHJldkFsbC5yZXZlcnNlKCkuY29uY2F0KEBuZXh0QWxsKVxuXG5cdCdlbGVtZW50U2libGluZ3MnOiBnZXQ6ICgpLT5cblx0XHRfZmlsdGVyRWxlbWVudHMoQHNpYmxpbmdzKVxuXHRcblx0J2NoaWxkJzogZ2V0OiAoKS0+XG5cdFx0QF9jaGlsZFJlZnMgb3IgX2dldENoaWxkUmVmcyhAKVxuXG5cdCdjaGlsZGYnOiBnZXQ6ICgpLT5cblx0XHRfZ2V0Q2hpbGRSZWZzKEAsIHRydWUpXG5cblx0J2ZpcnN0Q2hpbGQnOiBnZXQ6ICgpLT5cblx0XHRAY2hpbGRyZW5bMF1cblxuXHQnbGFzdENoaWxkJzogZ2V0OiAoKS0+XG5cdFx0Y2hpbGRyZW4gPSBAY2hpbGRyZW5cblx0XHRjaGlsZHJlbltjaGlsZHJlbi5sZW5ndGgtMV1cblxuXHQnaW5kZXgnOiBnZXQ6ICgpLT5cblx0XHRpZiBub3QgcGFyZW50PUBwYXJlbnRcblx0XHRcdHJldHVybiBudWxsXG5cdFx0ZWxzZVxuXHRcdFx0cGFyZW50LmNoaWxkcmVuLmluZGV4T2YoQClcblxuXHQnaW5kZXhUeXBlJzogZ2V0OiAoKS0+XG5cdFx0X2dldEluZGV4QnlQcm9wKEAsICd0eXBlJylcblxuXHQnaW5kZXhSZWYnOiBnZXQ6ICgpLT5cblx0XHRfZ2V0SW5kZXhCeVByb3AoQCwgJ3JlZicpXG5cblxuXG5fZ2V0UGFyZW50cyA9ICh0YXJnZXRFbCwgZmlsdGVyKS0+XG5cdGZpbHRlciA9IHVuZGVmaW5lZCBpZiBub3QgSVMuZnVuY3Rpb24oZmlsdGVyKSBhbmQgbm90IGlzUmVmPUlTLnN0cmluZyhmaWx0ZXIpXG5cdHBhcmVudHMgPSBbXVxuXHRuZXh0UGFyZW50ID0gdGFyZ2V0RWwucGFyZW50XG5cdHdoaWxlIG5leHRQYXJlbnRcblx0XHRwYXJlbnRzLnB1c2gobmV4dFBhcmVudClcblx0XHRuZXh0UGFyZW50ID0gbmV4dFBhcmVudC5wYXJlbnRcblx0XHRpZiBpc1JlZlxuXHRcdFx0bmV4dFBhcmVudCA9IG51bGwgaWYgbmV4dFBhcmVudCBhbmQgbmV4dFBhcmVudC5yZWYgaXMgZmlsdGVyXG5cdFx0ZWxzZSBpZiBmaWx0ZXJcblx0XHRcdG5leHRQYXJlbnQgPSBudWxsIGlmIGZpbHRlcihuZXh0UGFyZW50KVxuXG5cdHJldHVybiBwYXJlbnRzXG5cblxuX2dldENoaWxkUmVmcyA9ICh0YXJnZXQsIGZyZXNoQ29weSktPlxuXHR0YXJnZXQuX2NoaWxkUmVmcyA9IHt9IGlmIGZyZXNoQ29weSBvciBub3QgdGFyZ2V0Ll9jaGlsZFJlZnNcblx0cmVmcyA9IHRhcmdldC5fY2hpbGRSZWZzXG5cdHJlZnNbdGFyZ2V0LnJlZl0gPSB0YXJnZXQgaWYgdGFyZ2V0LnJlZlxuXHRjaGlsZHJlbiA9IHRhcmdldC5jaGlsZHJlblxuXG5cdGlmIGNoaWxkcmVuLmxlbmd0aFxuXHRcdGZvciBjaGlsZCBpbiBjaGlsZHJlblxuXHRcdFx0Y2hpbGRSZWZzID0gX2dldENoaWxkUmVmcyhjaGlsZCwgZnJlc2hDb3B5KVxuXHRcdFx0cmVmc1tyZWZdIHx8PSBlbCBmb3IgcmVmLGVsIG9mIGNoaWxkUmVmc1xuXG5cdHJldHVybiByZWZzXG5cblxuX2dldEluZGV4QnlQcm9wID0gKG1haW4sIHByb3ApLT5cblx0aWYgbm90IHBhcmVudD1tYWluLnBhcmVudFxuXHRcdHJldHVybiBudWxsXG5cdGVsc2Vcblx0XHRwYXJlbnQuY2hpbGRyZW5cblx0XHRcdC5maWx0ZXIgKGNoaWxkKS0+IGNoaWxkW3Byb3BdIGlzIG1haW5bcHJvcF1cblx0XHRcdC5pbmRleE9mKG1haW4pXG5cblxuX2ZpbHRlckVsZW1lbnRzID0gKGFycmF5KS0+XG5cdGlmIG5vdCBhcnJheS5sZW5ndGhcblx0XHRyZXR1cm4gYXJyYXlcblx0ZWxzZVxuXHRcdG91dHB1dCA9IFtdXG5cdFx0b3V0cHV0LnB1c2goaXRlbSkgZm9yIGl0ZW0gaW4gYXJyYXkgd2hlbiBpdGVtLnR5cGUgaXNudCAndGV4dCdcblx0XHRyZXR1cm4gb3V0cHV0XG5cblxuXG4iLCJiYXNlU3RhdGVUcmlnZ2VycyA9XG5cdCdob3Zlcic6IHtvbjonbW91c2VlbnRlcicsIG9mZjonbW91c2VsZWF2ZScsIGJ1YmJsZXM6dHJ1ZX1cblx0J2ZvY3VzJzoge29uOidmb2N1cycsIG9mZjonYmx1cicsIGJ1YmJsZXM6dHJ1ZX1cblxuXG5RdWlja0VsZW1lbnQ6Ol9ub3JtYWxpemVPcHRpb25zID0gKCktPlxuXHRAb3B0aW9ucy5jbGFzc05hbWUgPSBAb3B0aW9ucy5jbGFzcyBpZiBAb3B0aW9ucy5jbGFzc1xuXHRAb3B0aW9ucy5ocmVmID0gQG9wdGlvbnMudXJsIGlmIEBvcHRpb25zLnVybFxuXHRAcmVsYXRlZCA9IEBvcHRpb25zLnJlbGF0ZWRJbnN0YW5jZSA/PSBAXG5cdEBvcHRpb25zLnVucGFzc2FibGVTdGF0ZXMgPz0gW11cblx0QG9wdGlvbnMucGFzc1N0YXRlVG9DaGlsZHJlbiA/PSB0cnVlXG5cdEBvcHRpb25zLnN0YXRlVHJpZ2dlcnMgPVxuXHRcdGlmIEBvcHRpb25zLnN0YXRlVHJpZ2dlcnNcblx0XHRcdGV4dGVuZC5jbG9uZS5kZWVwKGJhc2VTdGF0ZVRyaWdnZXJzLCBAb3B0aW9ucy5zdGF0ZVRyaWdnZXJzKVxuXHRcdGVsc2Vcblx0XHRcdGJhc2VTdGF0ZVRyaWdnZXJzXG5cdFxuXHRpZiBAdHlwZSBpcyAndGV4dCdcblx0XHRleHRlbmQgQCwgQF9wYXJzZVRleHRzKEBvcHRpb25zLnRleHQsIEBfdGV4dHMpXG5cdGVsc2Vcblx0XHRleHRlbmQgQCwgQF9wYXJzZVN0eWxlcyhAb3B0aW9ucy5zdHlsZSwgQF9zdHlsZXMpXG5cdFxuXHRyZXR1cm5cblxuXG5RdWlja0VsZW1lbnQ6Ol9wYXJzZVN0eWxlcyA9IChzdHlsZXMsIHN0b3JlKS0+XG5cdHJldHVybiBpZiBub3QgSVMub2JqZWN0UGxhaW4oc3R5bGVzKVxuXHRrZXlzID0gT2JqZWN0LmtleXMoc3R5bGVzKVxuXHRzdGF0ZXMgPSBrZXlzLmZpbHRlciAoa2V5KS0+IGhlbHBlcnMuaXNTdGF0ZVN0eWxlKGtleSlcblx0c3BlY2lhbFN0YXRlcyA9IGhlbHBlcnMucmVtb3ZlSXRlbShzdGF0ZXMuc2xpY2UoKSwgJyRiYXNlJylcblx0X21lZGlhU3RhdGVzID0gc3RhdGVzLmZpbHRlcigoa2V5KS0+IGtleVswXSBpcyAnQCcpLm1hcCAoc3RhdGUpLT4gc3RhdGUuc2xpY2UoMSlcblx0X3Byb3ZpZGVkU3RhdGVzID0gc3RhdGVzLm1hcCAoc3RhdGUpLT4gc3RhdGUuc2xpY2UoMSkgIyBSZW1vdmUgJyQnIHByZWZpeFxuXHRfc3R5bGVzID0gc3RvcmUgb3Ige31cblx0X3N0YXRlU2hhcmVkID0gX3Byb3ZpZGVkU3RhdGVzU2hhcmVkID0gdW5kZWZpbmVkXG5cblx0YmFzZSA9IGlmIG5vdCBoZWxwZXJzLmluY2x1ZGVzKHN0YXRlcywgJyRiYXNlJykgdGhlbiBzdHlsZXMgZWxzZSBzdHlsZXMuJGJhc2Vcblx0X3N0eWxlcy5iYXNlID0gaGVscGVycy5yZWdpc3RlclN0eWxlKGJhc2UsIDAsIGZvcmNlU3R5bGU9QG9wdGlvbnMuZm9yY2VTdHlsZSlcblxuXG5cdGlmIHNwZWNpYWxTdGF0ZXMubGVuZ3RoXG5cdFx0ZmxhdHRlbk5lc3RlZFN0YXRlcyA9IChzdHlsZU9iamVjdCwgY2hhaW4sIGxldmVsKS0+XG5cdFx0XHRzdHlsZUtleXMgPSBPYmplY3Qua2V5cyhzdHlsZU9iamVjdClcblx0XHRcdG91dHB1dCA9IHt9XG5cdFx0XHRoYXNOb25TdGF0ZVByb3BzID0gZmFsc2Vcblx0XHRcdFxuXHRcdFx0Zm9yIHN0YXRlIGluIHN0eWxlS2V5c1xuXHRcdFx0XHRpZiBub3QgaGVscGVycy5pc1N0YXRlU3R5bGUoc3RhdGUpXG5cdFx0XHRcdFx0aGFzTm9uU3RhdGVQcm9wcyA9IHRydWVcblx0XHRcdFx0XHRvdXRwdXRbc3RhdGVdID0gc3R5bGVPYmplY3Rbc3RhdGVdXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRjaGFpbi5wdXNoKHN0YXRlXyA9IHN0YXRlLnNsaWNlKDEpKVxuXHRcdFx0XHRcdHN0YXRlQ2hhaW4gPSBuZXcgKGltcG9ydCAnLi9zdGF0ZUNoYWluJykoY2hhaW4pXG5cdFx0XHRcdFx0X3N0YXRlU2hhcmVkID89IFtdXG5cdFx0XHRcdFx0X3Byb3ZpZGVkU3RhdGVzU2hhcmVkID89IFtdXG5cdFx0XHRcdFx0X3Byb3ZpZGVkU3RhdGVzU2hhcmVkLnB1c2goc3RhdGVDaGFpbilcblx0XHRcdFx0XHRfbWVkaWFTdGF0ZXMucHVzaChzdGF0ZV8pIGlmIHN0YXRlWzBdIGlzICdAJ1xuXHRcdFx0XHRcdF9zdHlsZXNbc3RhdGVDaGFpbi5zdHJpbmddID0gaGVscGVycy5yZWdpc3RlclN0eWxlIGZsYXR0ZW5OZXN0ZWRTdGF0ZXMoc3R5bGVPYmplY3Rbc3RhdGVdLCBjaGFpbiwgbGV2ZWwrMSksIGxldmVsKzEsIGZvcmNlU3R5bGVcblx0XHRcdFxuXHRcdFx0cmV0dXJuIGlmIGhhc05vblN0YXRlUHJvcHMgdGhlbiBvdXRwdXRcblxuXHRcdGZvciBzdGF0ZSBpbiBzcGVjaWFsU3RhdGVzXG5cdFx0XHRzdGF0ZV8gPSBzdGF0ZS5zbGljZSgxKVxuXHRcdFx0XG5cdFx0XHRzdGF0ZVN0eWxlcyA9IGZsYXR0ZW5OZXN0ZWRTdGF0ZXMoc3R5bGVzW3N0YXRlXSwgW3N0YXRlX10sIDEpXG5cdFx0XHRfc3R5bGVzW3N0YXRlX10gPSBoZWxwZXJzLnJlZ2lzdGVyU3R5bGUoc3RhdGVTdHlsZXMsIDEpIGlmIHN0YXRlU3R5bGVzXG5cblxuXHRyZXR1cm4ge19zdHlsZXMsIF9tZWRpYVN0YXRlcywgX3N0YXRlU2hhcmVkLCBfcHJvdmlkZWRTdGF0ZXMsIF9wcm92aWRlZFN0YXRlc1NoYXJlZH1cblxuXG5cblF1aWNrRWxlbWVudDo6X3BhcnNlVGV4dHMgPSAodGV4dHMsIHN0b3JlKS0+XG5cdHJldHVybiBpZiBub3QgSVMub2JqZWN0UGxhaW4odGV4dHMpXG5cdHN0YXRlcyA9IE9iamVjdC5rZXlzKHRleHRzKS5tYXAgKHN0YXRlKS0+IHN0YXRlLnNsaWNlKDEpXG5cdF9wcm92aWRlZFN0YXRlcyA9IHN0YXRlcy5maWx0ZXIgKHN0YXRlKS0+IHN0YXRlIGlzbnQgJ2Jhc2UnXG5cdF90ZXh0cyA9IHN0b3JlIG9yIHt9XG5cdF90ZXh0cyA9IGJhc2U6Jydcblx0X3RleHRzW3N0YXRlXSA9IHRleHRzWyckJytzdGF0ZV0gZm9yIHN0YXRlIGluIHN0YXRlc1xuXHRcblx0cmV0dXJuIHtfdGV4dHMsIF9wcm92aWRlZFN0YXRlc31cblxuXG5RdWlja0VsZW1lbnQ6Ol9hcHBseU9wdGlvbnMgPSAoKS0+XG5cdGlmIHJlZj0oQG9wdGlvbnMuaWQgb3IgQG9wdGlvbnMucmVmKSB0aGVuIEBhdHRyKCdkYXRhLXJlZicsIEByZWY9cmVmKVxuXHRpZiBAb3B0aW9ucy5pZCB0aGVuIEBlbC5pZCA9IEBvcHRpb25zLmlkXG5cdGlmIEBvcHRpb25zLmNsYXNzTmFtZSB0aGVuIEBlbC5jbGFzc05hbWUgPSBAb3B0aW9ucy5jbGFzc05hbWVcblx0aWYgQG9wdGlvbnMuc3JjIHRoZW4gQGVsLnNyYyA9IEBvcHRpb25zLnNyY1xuXHRpZiBAb3B0aW9ucy5ocmVmIHRoZW4gQGVsLmhyZWYgPSBAb3B0aW9ucy5ocmVmXG5cdGlmIEBvcHRpb25zLnR5cGUgdGhlbiBAZWwudHlwZSA9IEBvcHRpb25zLnR5cGVcblx0aWYgQG9wdGlvbnMubmFtZSB0aGVuIEBlbC5uYW1lID0gQG9wdGlvbnMubmFtZVxuXHRpZiBAb3B0aW9ucy52YWx1ZSB0aGVuIEBlbC52YWx1ZSA9IEBvcHRpb25zLnZhbHVlXG5cdGlmIEBvcHRpb25zLnNlbGVjdGVkIHRoZW4gQGVsLnNlbGVjdGVkID0gQG9wdGlvbnMuc2VsZWN0ZWRcblx0aWYgQG9wdGlvbnMuY2hlY2tlZCB0aGVuIEBlbC5jaGVja2VkID0gQG9wdGlvbnMuY2hlY2tlZFxuXHRpZiBAb3B0aW9ucy5wcm9wcyB0aGVuIEBwcm9wKGtleSx2YWx1ZSkgZm9yIGtleSx2YWx1ZSBvZiBAb3B0aW9ucy5wcm9wc1xuXHRpZiBAb3B0aW9ucy5hdHRycyB0aGVuIEBhdHRyKGtleSx2YWx1ZSkgZm9yIGtleSx2YWx1ZSBvZiBAb3B0aW9ucy5hdHRyc1xuXHRAX2FwcGx5UmVnaXN0ZXJlZFN0eWxlKEBfc3R5bGVzLmJhc2UsIG51bGwsIG51bGwsIEBvcHRpb25zLnN0eWxlQWZ0ZXJJbnNlcnQpXG5cdEB0ZXh0ID0gQF90ZXh0cy5iYXNlIGlmIEBfdGV4dHNcblxuXHRAb24gJ2luc2VydGVkJywgKCktPlxuXHRcdGlmIEBvcHRpb25zLnN0eWxlQWZ0ZXJJbnNlcnRcblx0XHRcdEByZWNhbGNTdHlsZSgpXG5cblx0XHRfID0gQF9pbnNlcnRlZCA9IEBcblxuXHRcdGlmIChtZWRpYVN0YXRlcz1AX21lZGlhU3RhdGVzKSBhbmQgQF9tZWRpYVN0YXRlcy5sZW5ndGhcblx0XHRcdEBfbWVkaWFTdGF0ZXMgPSBuZXcgKCktPlxuXHRcdFx0XHRmb3IgcXVlcnlTdHJpbmcgaW4gbWVkaWFTdGF0ZXNcblx0XHRcdFx0XHRAW3F1ZXJ5U3RyaW5nXSA9IE1lZGlhUXVlcnkucmVnaXN0ZXIoXywgcXVlcnlTdHJpbmcpXG5cdFx0XHRcdFxuXHRcdFx0XHRyZXR1cm4gQFxuXHQsIGZhbHNlLCB0cnVlXG5cblx0aWYgQG9wdGlvbnMucmVjYWxjT25SZXNpemVcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgKCk9PiBAcmVjYWxjU3R5bGUoKVxuXG5cdGlmIEBvcHRpb25zLmV2ZW50c1xuXHRcdEBvbihldmVudCwgaGFuZGxlcikgZm9yIGV2ZW50LGhhbmRsZXIgb2YgQG9wdGlvbnMuZXZlbnRzXG5cblx0aWYgQG9wdGlvbnMubWV0aG9kc1xuXHRcdGZvciBtZXRob2QsdmFsdWUgb2YgQG9wdGlvbnMubWV0aG9kcyB3aGVuIG5vdCBAW21ldGhvZF1cblx0XHRcdGlmIElTLmZ1bmN0aW9uKHZhbHVlKVxuXHRcdFx0XHRAW21ldGhvZF0gPSB2YWx1ZVxuXHRcdFx0ZWxzZSBpZiBJUy5vYmplY3QodmFsdWUpXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBALCBtZXRob2QsIHtjb25maWd1cmFibGU6dHJ1ZSwgZ2V0OnZhbHVlLmdldCwgc2V0OnZhbHVlLnNldH1cblxuXHRpZiBAdHlwZSBpc250ICd0ZXh0JyBhbmQgSVMub2JqZWN0KEBvcHRpb25zLnRleHQpXG5cdFx0QGFwcGVuZCBRdWlja0RvbSgndGV4dCcsIHRleHQ6QG9wdGlvbnMudGV4dClcblx0cmV0dXJuXG5cblxuUXVpY2tFbGVtZW50OjpfYXR0YWNoU3RhdGVFdmVudHMgPSAoZm9yY2UpLT5cblx0Zm9yIHN0YXRlLHRyaWdnZXIgb2YgQG9wdGlvbnMuc3RhdGVUcmlnZ2VycyB0aGVuIGRvIChzdGF0ZSx0cmlnZ2VyKT0+XG5cdFx0cmV0dXJuIGlmIG5vdCBoZWxwZXJzLmluY2x1ZGVzKEBfcHJvdmlkZWRTdGF0ZXMsIHN0YXRlKSBhbmQgbm90IGZvcmNlIGFuZCBub3QgdHJpZ2dlci5mb3JjZVxuXHRcdGVuYWJsZXIgPSBpZiBJUy5zdHJpbmcodHJpZ2dlcikgdGhlbiB0cmlnZ2VyIGVsc2UgdHJpZ2dlci5vblxuXHRcdGRpc2FibGVyID0gdHJpZ2dlci5vZmYgaWYgSVMub2JqZWN0KHRyaWdnZXIpXG5cblx0XHRAX2xpc3RlblRvIGVuYWJsZXIsICgpPT4gQHN0YXRlKHN0YXRlLCBvbiwgdHJpZ2dlci5idWJibGVzKVxuXHRcdGlmIGRpc2FibGVyIHRoZW4gQF9saXN0ZW5UbyBkaXNhYmxlciwgKCk9PiBAc3RhdGUoc3RhdGUsIG9mZiwgdHJpZ2dlci5idWJibGVzKVxuXHRcblx0cmV0dXJuXG5cblxuXG5RdWlja0VsZW1lbnQ6Ol9wcm94eVBhcmVudCA9ICgpLT5cblx0cGFyZW50ID0gdW5kZWZpbmVkXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBALCAnX3BhcmVudCcsXG5cdFx0Z2V0OiAoKS0+IHBhcmVudFxuXHRcdHNldDogKG5ld1BhcmVudCktPiBpZiBwYXJlbnQ9bmV3UGFyZW50XG5cdFx0XHRsYXN0UGFyZW50ID0gQHBhcmVudHMuc2xpY2UoLTEpWzBdXG5cdFx0XHRpZiBsYXN0UGFyZW50LnJhdyBpcyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcblx0XHRcdFx0QF91bnByb3h5UGFyZW50KG5ld1BhcmVudClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cGFyZW50Lm9uICdpbnNlcnRlZCcsICgpPT5cblx0XHRcdFx0XHRAX3VucHJveHlQYXJlbnQobmV3UGFyZW50KSBpZiBwYXJlbnQgaXMgbmV3UGFyZW50XG5cdFx0XHRyZXR1cm5cblxuXG5RdWlja0VsZW1lbnQ6Ol91bnByb3h5UGFyZW50ID0gKG5ld1BhcmVudCktPlxuXHRkZWxldGUgQF9wYXJlbnRcblx0QF9wYXJlbnQgPSBuZXdQYXJlbnRcblx0QGVtaXRQcml2YXRlKCdpbnNlcnRlZCcsIG5ld1BhcmVudClcblx0cmV0dXJuXG5cblxuXG5cbiIsInJlZ2V4V2hpdGVzcGFjZSA9IC9cXHMrL1xuXG5RdWlja0VsZW1lbnQ6Om9uID0gKGV2ZW50TmFtZXMsIGNhbGxiYWNrLCB1c2VDYXB0dXJlLCBpc1ByaXZhdGUpLT5cblx0QF9ldmVudENhbGxiYWNrcyA/PSB7X19yZWZzOnt9fVxuXHRcblx0aWYgSVMuc3RyaW5nKGV2ZW50TmFtZXMpIGFuZCBJUy5mdW5jdGlvbihjYWxsYmFjaylcblx0XHRzcGxpdCA9IGV2ZW50TmFtZXMuc3BsaXQoJy4nKVxuXHRcdGNhbGxiYWNrUmVmID0gc3BsaXRbMV1cblx0XHRldmVudE5hbWVzID0gc3BsaXRbMF1cblx0XHRcblx0XHRpZiBldmVudE5hbWVzIGlzICdpbnNlcnRlZCcgYW5kIEBfaW5zZXJ0ZWRcblx0XHRcdGNhbGxiYWNrLmNhbGwoQCwgQF9wYXJlbnQpXG5cdFx0XHRyZXR1cm4gQFxuXHRcdFxuXHRcdGV2ZW50TmFtZXMuc3BsaXQocmVnZXhXaGl0ZXNwYWNlKS5mb3JFYWNoIChldmVudE5hbWUpPT5cblx0XHRcdGlmIG5vdCBAX2V2ZW50Q2FsbGJhY2tzW2V2ZW50TmFtZV1cblx0XHRcdFx0QF9ldmVudENhbGxiYWNrc1tldmVudE5hbWVdID0gW11cdFx0XG5cdFx0XHRcdFxuXHRcdFx0XHR1bmxlc3MgaXNQcml2YXRlIHRoZW4gQF9saXN0ZW5UbyBldmVudE5hbWUsIChldmVudCk9PlxuXHRcdFx0XHRcdEBfaW52b2tlSGFuZGxlcnMoZXZlbnROYW1lLCBldmVudClcblx0XHRcdFx0LCB1c2VDYXB0dXJlXG5cblx0XHRcdEBfZXZlbnRDYWxsYmFja3MuX19yZWZzW2NhbGxiYWNrUmVmXSA9IGNhbGxiYWNrIGlmIGNhbGxiYWNrUmVmXG5cdFx0XHRAX2V2ZW50Q2FsbGJhY2tzW2V2ZW50TmFtZV0ucHVzaChjYWxsYmFjaylcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6b25jZSA9IChldmVudE5hbWVzLCBjYWxsYmFjayktPlxuXHRpZiBJUy5zdHJpbmcoZXZlbnROYW1lcykgYW5kIElTLmZ1bmN0aW9uKGNhbGxiYWNrKVxuXHRcdEBvbiBldmVudE5hbWVzLCBvbmNlQ2FsbGJhY2s9KGV2ZW50KT0+XG5cdFx0XHRAb2ZmKGV2ZW50TmFtZXMsIG9uY2VDYWxsYmFjaylcblx0XHRcdGNhbGxiYWNrLmNhbGwoQCwgZXZlbnQpXG5cdFxuXHRyZXR1cm4gQFxuXG5cblxuUXVpY2tFbGVtZW50OjpvZmYgPSAoZXZlbnROYW1lcywgY2FsbGJhY2spLT5cblx0QF9ldmVudENhbGxiYWNrcyA/PSB7X19yZWZzOnt9fVxuXHRpZiBub3QgSVMuc3RyaW5nKGV2ZW50TmFtZXMpXG5cdFx0QG9mZihldmVudE5hbWUpIGZvciBldmVudE5hbWUgb2YgQF9ldmVudENhbGxiYWNrc1xuXHRcblx0ZWxzZVxuXHRcdHNwbGl0ID0gZXZlbnROYW1lcy5zcGxpdCgnLicpXG5cdFx0Y2FsbGJhY2tSZWYgPSBzcGxpdFsxXVxuXHRcdGV2ZW50TmFtZXMgPSBzcGxpdFswXVxuXHRcdGV2ZW50TmFtZXMuc3BsaXQocmVnZXhXaGl0ZXNwYWNlKS5mb3JFYWNoIChldmVudE5hbWUpPT5cblx0XHRcdGlmIEBfZXZlbnRDYWxsYmFja3NbZXZlbnROYW1lXVxuXHRcdFx0XHRjYWxsYmFjayA/PSBAX2V2ZW50Q2FsbGJhY2tzLl9fcmVmc1tjYWxsYmFja1JlZl1cblxuXHRcdFx0XHRpZiBJUy5mdW5jdGlvbihjYWxsYmFjaylcblx0XHRcdFx0XHRoZWxwZXJzLnJlbW92ZUl0ZW0oQF9ldmVudENhbGxiYWNrc1tldmVudE5hbWVdLCBjYWxsYmFjaylcblx0XHRcdFx0ZWxzZSBpZiBub3QgY2FsbGJhY2tSZWZcblx0XHRcdFx0XHRAX2V2ZW50Q2FsbGJhY2tzW2V2ZW50TmFtZV0ubGVuZ3RoID0gMFxuXG5cdHJldHVybiBAXG5cblxuXG5RdWlja0VsZW1lbnQ6OmVtaXQgPSAoZXZlbnROYW1lLCBidWJibGVzPXRydWUsIGNhbmNlbGFibGU9dHJ1ZSwgZGF0YSktPlxuXHRpZiBldmVudE5hbWUgYW5kIElTLnN0cmluZyhldmVudE5hbWUpXG5cdFx0ZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKVxuXHRcdGV2ZW50LmluaXRFdmVudChldmVudE5hbWUsIGJ1YmJsZXMsIGNhbmNlbGFibGUpXG5cdFx0ZXh0ZW5kKGV2ZW50LCBkYXRhKSBpZiBkYXRhIGFuZCB0eXBlb2YgZGF0YSBpcyAnb2JqZWN0J1xuXHRcdEBlbC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjplbWl0UHJpdmF0ZSA9IChldmVudE5hbWUsIGFyZyktPlxuXHRpZiBldmVudE5hbWUgYW5kIElTLnN0cmluZyhldmVudE5hbWUpIGFuZCBAX2V2ZW50Q2FsbGJhY2tzP1tldmVudE5hbWVdXG5cdFx0QF9pbnZva2VIYW5kbGVycyhldmVudE5hbWUsIGFyZylcblx0XG5cdHJldHVybiBAXG5cblxuXG5RdWlja0VsZW1lbnQ6Ol9pbnZva2VIYW5kbGVycyA9IChldmVudE5hbWUsIGFyZyktPlxuXHRjYWxsYmFja3MgPSBAX2V2ZW50Q2FsbGJhY2tzW2V2ZW50TmFtZV0uc2xpY2UoKVxuXHRjYi5jYWxsKEAsIGFyZykgZm9yIGNiIGluIGNhbGxiYWNrc1xuXHRyZXR1cm5cblxuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja0VsZW1lbnQ6Ol9saXN0ZW5UbyA9IChldmVudE5hbWUsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKS0+XG5cdGxpc3Rlbk1ldGhvZCA9IGlmIEBlbC5hZGRFdmVudExpc3RlbmVyIHRoZW4gJ2FkZEV2ZW50TGlzdGVuZXInIGVsc2UgJ2F0dGFjaEV2ZW50J1xuXHRldmVudE5hbWVUb0xpc3RlbkZvciA9IGlmIEBlbC5hZGRFdmVudExpc3RlbmVyIHRoZW4gZXZlbnROYW1lIGVsc2UgXCJvbiN7ZXZlbnROYW1lfVwiXG5cdFxuXHRAZWxbbGlzdGVuTWV0aG9kXShldmVudE5hbWVUb0xpc3RlbkZvciwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpXG5cdHJldHVybiBAXG5cblxuXG5cbiIsIkRVTU1ZX0FSUkFZID0gW11cblxuXG5RdWlja0VsZW1lbnQ6OnN0YXRlID0gKHRhcmdldFN0YXRlLCB2YWx1ZSwgYnViYmxlcywgc291cmNlKS0+XG5cdGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMVxuXHRcdGlmIElTLnN0cmluZyh0YXJnZXRTdGF0ZSlcblx0XHRcdHJldHVybiBoZWxwZXJzLmluY2x1ZGVzKEBfc3RhdGUsIHRhcmdldFN0YXRlKVxuXHRcdFxuXHRcdGVsc2UgaWYgSVMub2JqZWN0KHRhcmdldFN0YXRlKVxuXHRcdFx0a2V5cyA9IE9iamVjdC5rZXlzKHRhcmdldFN0YXRlKVxuXHRcdFx0aSA9IC0xXG5cdFx0XHRAc3RhdGUoa2V5LCB0YXJnZXRTdGF0ZVtrZXldKSB3aGlsZSBrZXk9a2V5c1srK2ldXG5cdFx0XHRyZXR1cm4gQFxuXG5cdGVsc2UgaWYgQF9zdGF0ZVBpcGVUYXJnZXQgYW5kIHNvdXJjZSBpc250IEBcblx0XHRAX3N0YXRlUGlwZVRhcmdldC5zdGF0ZSh0YXJnZXRTdGF0ZSwgdmFsdWUsIGJ1YmJsZXMsIEApXG5cdFx0cmV0dXJuIEBcblx0XG5cdGVsc2UgaWYgSVMuc3RyaW5nKHRhcmdldFN0YXRlKVxuXHRcdHRhcmdldFN0YXRlID0gdGFyZ2V0U3RhdGUuc2xpY2UoMSkgaWYgdGFyZ2V0U3RhdGVbMF0gaXMgJyQnXG5cdFx0cmV0dXJuIEAgaWYgdGFyZ2V0U3RhdGUgaXMgJ2Jhc2UnXG5cdFx0ZGVzaXJlZFZhbHVlID0gISF2YWx1ZSAjIENvbnZlcnQgdGhlIHZhbHVlIHRvIGEgYm9vbGVhblxuXHRcdGFjdGl2ZVN0YXRlcyA9IEBfZ2V0QWN0aXZlU3RhdGVzKHRhcmdldFN0YXRlLCBmYWxzZSlcblx0XHRcblx0XHQjID09PT0gVG9nZ2xlIHN0eWxlcyBmb3IgdGhpcyBzdGF0ZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRpZiBAc3RhdGUodGFyZ2V0U3RhdGUpIGlzbnQgZGVzaXJlZFZhbHVlXG5cdFx0XHRwcm9wID0gaWYgQHR5cGUgaXMgJ3RleHQnIHRoZW4gJ1RleHQnIGVsc2UgJ1N0eWxlJ1xuXHRcdFxuXHRcdFx0aWYgZGVzaXJlZFZhbHVlICNpcyBvblxuXHRcdFx0XHRAX3N0YXRlLnB1c2godGFyZ2V0U3RhdGUpXG5cdFx0XHRcdHRvZ2dsZSA9ICdPTidcblx0XHRcdGVsc2Vcblx0XHRcdFx0aGVscGVycy5yZW1vdmVJdGVtKEBfc3RhdGUsIHRhcmdldFN0YXRlKVxuXHRcdFx0XHR0b2dnbGUgPSAnT0ZGJ1xuXHRcdFx0XG5cdFx0XHRAWydfdHVybicrcHJvcCt0b2dnbGVdKHRhcmdldFN0YXRlLCBhY3RpdmVTdGF0ZXMpXG5cdFx0XHRAZW1pdFByaXZhdGUgXCJzdGF0ZUNoYW5nZToje3RhcmdldFN0YXRlfVwiLCBkZXNpcmVkVmFsdWVcblxuXG5cdFx0IyA9PT09IFBhc3Mgc3RhdGUgdG8gcGFyZW50L2NoaWxkcmVuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdGlmIG5vdCBoZWxwZXJzLmluY2x1ZGVzKEBvcHRpb25zLnVucGFzc2FibGVTdGF0ZXMsIHRhcmdldFN0YXRlKVxuXHRcdFx0aWYgYnViYmxlc1xuXHRcdFx0XHRAX3BhcmVudC5zdGF0ZSh0YXJnZXRTdGF0ZSwgdmFsdWUsIHRydWUsIHNvdXJjZSBvciBAKSBpZiBAcGFyZW50XG5cdFx0XHRlbHNlIGlmIEBvcHRpb25zLnBhc3NTdGF0ZVRvQ2hpbGRyZW5cblx0XHRcdFx0Y2hpbGQuc3RhdGUodGFyZ2V0U3RhdGUsIHZhbHVlLCBmYWxzZSwgc291cmNlIG9yIEApIGZvciBjaGlsZCBpbiBAX2NoaWxkcmVuXG5cdFx0XG5cdFx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnRvZ2dsZVN0YXRlID0gKHRhcmdldFN0YXRlKS0+XG5cdEBzdGF0ZSh0YXJnZXRTdGF0ZSwgIUBzdGF0ZSh0YXJnZXRTdGF0ZSkpXG5cblxuUXVpY2tFbGVtZW50OjpyZXNldFN0YXRlID0gKCktPlxuXHRmb3IgYWN0aXZlU3RhdGUgaW4gQF9zdGF0ZS5zbGljZSgpXG5cdFx0QHN0YXRlKGFjdGl2ZVN0YXRlLCBvZmYpXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnBpcGVTdGF0ZSA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbCkgYW5kIHRhcmdldEVsIGlzbnQgQFxuXHRcdFx0QF9zdGF0ZVBpcGVUYXJnZXQgPSB0YXJnZXRFbFxuXHRcdFx0dGFyZ2V0RWwuc3RhdGUoYWN0aXZlU3RhdGUsIG9uKSBmb3IgYWN0aXZlU3RhdGUgaW4gQF9zdGF0ZVxuXG5cdGVsc2UgaWYgdGFyZ2V0RWwgaXMgZmFsc2Vcblx0XHRkZWxldGUgQF9zdGF0ZVBpcGVUYXJnZXRcblxuXHRyZXR1cm4gQFxuXG5cblxuXG5RdWlja0VsZW1lbnQ6Ol9hcHBseVJlZ2lzdGVyZWRTdHlsZSA9ICh0YXJnZXRTdHlsZSwgc3VwZXJpb3JTdGF0ZXMsIGluY2x1ZGVCYXNlLCBza2lwRm5zKS0+IGlmIHRhcmdldFN0eWxlXG5cdEBhZGRDbGFzcyhjbGFzc05hbWUpIGZvciBjbGFzc05hbWUgaW4gdGFyZ2V0U3R5bGUuY2xhc3NOYW1lXG5cdFxuXHRpZiB0YXJnZXRTdHlsZS5mbnMubGVuZ3RoIGFuZCBub3Qgc2tpcEZuc1xuXHRcdHN1cGVyaW9yU3R5bGVzID0gQF9yZXNvbHZlRm5TdHlsZXMoc3VwZXJpb3JTdGF0ZXMsIGluY2x1ZGVCYXNlKSBpZiBzdXBlcmlvclN0YXRlc1xuXHRcdFxuXHRcdGZvciBlbnRyeSBpbiB0YXJnZXRTdHlsZS5mbnNcblx0XHRcdEBzdHlsZShlbnRyeVswXSwgZW50cnlbMV0pIHVubGVzcyBzdXBlcmlvclN0eWxlcyBhbmQgc3VwZXJpb3JTdHlsZXNbZW50cnlbMF1dXG5cdFxuXHRyZXR1cm5cblxuXG5RdWlja0VsZW1lbnQ6Ol9yZW1vdmVSZWdpc3RlcmVkU3R5bGUgPSAodGFyZ2V0U3R5bGUsIHN1cGVyaW9yU3RhdGVzLCBpbmNsdWRlQmFzZSktPlxuXHRAcmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKSBmb3IgY2xhc3NOYW1lIGluIHRhcmdldFN0eWxlLmNsYXNzTmFtZVxuXG5cdGlmIHRhcmdldFN0eWxlLmZucy5sZW5ndGhcblx0XHRzdXBlcmlvclN0eWxlcyA9IEBfcmVzb2x2ZUZuU3R5bGVzKHN1cGVyaW9yU3RhdGVzLCBpbmNsdWRlQmFzZSkgaWYgc3VwZXJpb3JTdGF0ZXNcblx0XHRcblx0XHRmb3IgZW50cnkgaW4gdGFyZ2V0U3R5bGUuZm5zXG5cdFx0XHRyZXNldFZhbHVlID0gc3VwZXJpb3JTdHlsZXMgYW5kIHN1cGVyaW9yU3R5bGVzW2VudHJ5WzBdXSBvciBudWxsXG5cdFx0XHRAc3R5bGUoZW50cnlbMF0sIHJlc2V0VmFsdWUpXG5cblx0cmV0dXJuXG5cblxuXG5cblF1aWNrRWxlbWVudDo6X3R1cm5TdHlsZU9OID0gKHRhcmdldFN0YXRlLCBhY3RpdmVTdGF0ZXMpLT5cblx0c2tpcEZucyA9IEBvcHRpb25zLnN0eWxlQWZ0ZXJJbnNlcnQgYW5kIG5vdCBAX2luc2VydGVkXG5cdGlmIEBfc3R5bGVzW3RhcmdldFN0YXRlXVxuXHRcdEBfYXBwbHlSZWdpc3RlcmVkU3R5bGUoQF9zdHlsZXNbdGFyZ2V0U3RhdGVdLCBAX2dldFN1cGVyaW9yU3RhdGVzKHRhcmdldFN0YXRlLCBhY3RpdmVTdGF0ZXMpLCBmYWxzZSwgc2tpcEZucylcblxuXG5cdGlmIEBfcHJvdmlkZWRTdGF0ZXNTaGFyZWRcblx0XHRzaGFyZWRTdGF0ZXMgPSBAX2dldFNoYXJlZFN0YXRlcyh0YXJnZXRTdGF0ZSlcblx0XHRcblx0XHRmb3Igc3RhdGVDaGFpbiBpbiBzaGFyZWRTdGF0ZXNcblx0XHRcdEBfc3RhdGVTaGFyZWQucHVzaChzdGF0ZUNoYWluLnN0cmluZykgdW5sZXNzIGhlbHBlcnMuaW5jbHVkZXMoQF9zdGF0ZVNoYXJlZCwgc3RhdGVDaGFpbi5zdHJpbmcpXG5cdFx0XHRAX2FwcGx5UmVnaXN0ZXJlZFN0eWxlKEBfc3R5bGVzW3N0YXRlQ2hhaW4uc3RyaW5nXSwgbnVsbCwgbnVsbCwgc2tpcEZucylcblxuXHRyZXR1cm5cblxuXG5RdWlja0VsZW1lbnQ6Ol90dXJuU3R5bGVPRkYgPSAodGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcyktPlxuXHRpZiBAX3N0eWxlc1t0YXJnZXRTdGF0ZV1cblx0XHRAX3JlbW92ZVJlZ2lzdGVyZWRTdHlsZShAX3N0eWxlc1t0YXJnZXRTdGF0ZV0sIGFjdGl2ZVN0YXRlcywgdHJ1ZSlcblxuXHRpZiBAX3Byb3ZpZGVkU3RhdGVzU2hhcmVkXG5cdFx0c2hhcmVkU3RhdGVzID0gQF9nZXRTaGFyZWRTdGF0ZXModGFyZ2V0U3RhdGUpXG5cdFx0cmV0dXJuIGlmIHNoYXJlZFN0YXRlcy5sZW5ndGggaXMgMFxuXG5cdFx0Zm9yIHN0YXRlQ2hhaW4gaW4gc2hhcmVkU3RhdGVzXG5cdFx0XHRoZWxwZXJzLnJlbW92ZUl0ZW0oQF9zdGF0ZVNoYXJlZCwgc3RhdGVDaGFpbi5zdHJpbmcpXG5cdFx0XHR0YXJnZXRTdHlsZSA9IEBfc3R5bGVzW3N0YXRlQ2hhaW4uc3RyaW5nXVxuXHRcdFx0XG5cdFx0XHRpZiB0YXJnZXRTdHlsZS5mbnMubGVuZ3RoIGFuZCBAX3N0YXRlU2hhcmVkLmxlbmd0aCBhbmQgbm90IGFjdGl2ZVNoYXJlZFN0YXRlc1xuXHRcdFx0XHRhY3RpdmVTaGFyZWRTdGF0ZXMgPSBAX3N0YXRlU2hhcmVkLmZpbHRlciAoc3RhdGUpLT4gbm90IGhlbHBlcnMuaW5jbHVkZXMoc3RhdGUsIHRhcmdldFN0YXRlKVxuXHRcdFx0XHRhY3RpdmVTdGF0ZXMgPSBhY3RpdmVTdGF0ZXMuY29uY2F0KGFjdGl2ZVNoYXJlZFN0YXRlcylcblx0XHRcdFxuXHRcdFx0QF9yZW1vdmVSZWdpc3RlcmVkU3R5bGUodGFyZ2V0U3R5bGUsIGFjdGl2ZVN0YXRlcywgdHJ1ZSlcblxuXHRyZXR1cm5cblxuXG5cblF1aWNrRWxlbWVudDo6X3R1cm5UZXh0T04gPSAodGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcyktPlxuXHRpZiBAX3RleHRzIGFuZCBJUy5zdHJpbmcodGFyZ2V0VGV4dCA9IEBfdGV4dHNbdGFyZ2V0U3RhdGVdKVxuXHRcdHN1cGVyaW9yU3RhdGVzID0gQF9nZXRTdXBlcmlvclN0YXRlcyh0YXJnZXRTdGF0ZSwgYWN0aXZlU3RhdGVzKVxuXHRcdFxuXHRcdEB0ZXh0ID0gdGFyZ2V0VGV4dCB1bmxlc3Mgc3VwZXJpb3JTdGF0ZXMubGVuZ3RoXG5cdHJldHVyblxuXG5cblF1aWNrRWxlbWVudDo6X3R1cm5UZXh0T0ZGID0gKHRhcmdldFN0YXRlLCBhY3RpdmVTdGF0ZXMpLT5cblx0aWYgQF90ZXh0cyBhbmQgSVMuc3RyaW5nKHRhcmdldFRleHQgPSBAX3RleHRzW3RhcmdldFN0YXRlXSlcblx0XHRhY3RpdmVTdGF0ZXMgPSBhY3RpdmVTdGF0ZXMuZmlsdGVyIChzdGF0ZSktPiBzdGF0ZSBpc250IHRhcmdldFN0YXRlXG5cdFx0dGFyZ2V0VGV4dCA9IEBfdGV4dHNbYWN0aXZlU3RhdGVzW2FjdGl2ZVN0YXRlcy5sZW5ndGgtMV1dXG5cdFx0dGFyZ2V0VGV4dCA/PSBAX3RleHRzLmJhc2Vcblx0XHRcblx0XHRAdGV4dCA9IHRhcmdldFRleHRcblx0cmV0dXJuXG5cblxuXG5cblx0XG5cblxuXG5cblF1aWNrRWxlbWVudDo6X2dldEFjdGl2ZVN0YXRlcyA9IChzdGF0ZVRvRXhjbHVkZSwgaW5jbHVkZVNoYXJlZFN0YXRlcz10cnVlKS0+XG5cdHJldHVybiBEVU1NWV9BUlJBWSBpZiBub3QgQF9wcm92aWRlZFN0YXRlc1xuXHRhY3RpdmVTdGF0ZXMgPSBwbGFpblN0YXRlcyA9IEBfc3RhdGVcblx0aWYgc3RhdGVUb0V4Y2x1ZGVcblx0XHRwbGFpblN0YXRlcyA9IFtdXG5cdFx0cGxhaW5TdGF0ZXMucHVzaChzdGF0ZSkgZm9yIHN0YXRlIGluIGFjdGl2ZVN0YXRlcyB3aGVuIHN0YXRlIGlzbnQgc3RhdGVUb0V4Y2x1ZGVcblx0XG5cdGlmIG5vdCBpbmNsdWRlU2hhcmVkU3RhdGVzIG9yIG5vdCBAX3Byb3ZpZGVkU3RhdGVzU2hhcmVkXG5cdFx0cmV0dXJuIHBsYWluU3RhdGVzXG5cdGVsc2Vcblx0XHRyZXR1cm4gcGxhaW5TdGF0ZXMuY29uY2F0KEBfc3RhdGVTaGFyZWQpXG5cblxuUXVpY2tFbGVtZW50OjpfZ2V0U3VwZXJpb3JTdGF0ZXMgPSAodGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcyktPlxuXHR0YXJnZXRTdGF0ZUluZGV4ID0gQF9wcm92aWRlZFN0YXRlcy5pbmRleE9mKHRhcmdldFN0YXRlKVxuXHRyZXR1cm4gRFVNTVlfQVJSQVkgaWYgdGFyZ2V0U3RhdGVJbmRleCBpcyBAX3Byb3ZpZGVkU3RhdGVzLmxlbmd0aCAtIDFcblx0XG5cdHN1cGVyaW9yID0gW11cblx0Zm9yIGNhbmRpZGF0ZSBpbiBhY3RpdmVTdGF0ZXNcblx0XHRzdXBlcmlvci5wdXNoKGNhbmRpZGF0ZSkgaWYgQF9wcm92aWRlZFN0YXRlcy5pbmRleE9mKGNhbmRpZGF0ZSkgPiB0YXJnZXRTdGF0ZUluZGV4XG5cblx0cmV0dXJuIHN1cGVyaW9yXG5cblxuUXVpY2tFbGVtZW50OjpfZ2V0U2hhcmVkU3RhdGVzID0gKHRhcmdldFN0YXRlKS0+XG5cdGFjdGl2ZVN0YXRlcyA9IEBfc3RhdGVcblx0c2hhcmVkU3RhdGVzID0gW11cblxuXHRmb3Igc3RhdGVDaGFpbiBpbiBAX3Byb3ZpZGVkU3RhdGVzU2hhcmVkXG5cdFx0c2hhcmVkU3RhdGVzLnB1c2goc3RhdGVDaGFpbikgaWYgc3RhdGVDaGFpbi5pbmNsdWRlcyh0YXJnZXRTdGF0ZSkgYW5kIHN0YXRlQ2hhaW4uaXNBcHBsaWNhYmxlKHRhcmdldFN0YXRlLCBhY3RpdmVTdGF0ZXMpXG5cblx0cmV0dXJuIHNoYXJlZFN0YXRlc1xuXG5cblF1aWNrRWxlbWVudDo6X3Jlc29sdmVGblN0eWxlcyA9IChzdGF0ZXMsIGluY2x1ZGVCYXNlKS0+XG5cdHN0YXRlcyA9IFsnYmFzZSddLmNvbmNhdChzdGF0ZXMpIGlmIGluY2x1ZGVCYXNlXG5cdG91dHB1dCA9IHt9XG5cdFxuXHRmb3Igc3RhdGUgaW4gc3RhdGVzIHdoZW4gQF9zdHlsZXNbc3RhdGVdIGFuZCBAX3N0eWxlc1tzdGF0ZV0uZm5zLmxlbmd0aFxuXHRcdG91dHB1dFtlbnRyeVswXV0gPSBlbnRyeVsxXSBmb3IgZW50cnkgaW4gQF9zdHlsZXNbc3RhdGVdLmZuc1xuXG5cdHJldHVybiBvdXRwdXRcblxuXG5cblxuXG5cblxuXG5cbiIsIiMjIypcbiAqIFNldHMvZ2V0cyB0aGUgdmFsdWUgb2YgYSBzdHlsZSBwcm9wZXJ0eS4gSW4gZ2V0dGVyIG1vZGUgdGhlIGNvbXB1dGVkIHByb3BlcnR5IG9mXG4gKiB0aGUgc3R5bGUgd2lsbCBiZSByZXR1cm5lZCB1bmxlc3MgdGhlIGVsZW1lbnQgaXMgbm90IGluc2VydGVkIGludG8gdGhlIERPTS4gSW5cbiAqIHdlYmtpdCBicm93c2VycyBhbGwgY29tcHV0ZWQgcHJvcGVydGllcyBvZiBhIGRldGFjaGVkIG5vZGUgYXJlIGFsd2F5cyBhbiBlbXB0eVxuICogc3RyaW5nIGJ1dCBpbiBnZWNrbyB0aGV5IHJlZmxlY3Qgb24gdGhlIGFjdHVhbCBjb21wdXRlZCB2YWx1ZSwgaGVuY2Ugd2UgbmVlZFxuICogdG8gXCJub3JtYWxpemVcIiB0aGlzIGJlaGF2aW9yIGFuZCBtYWtlIHN1cmUgdGhhdCBldmVuIG9uIGdlY2tvIGFuIGVtcHR5IHN0cmluZ1xuICogaXMgcmV0dXJuZWRcbiAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuIyMjXG5RdWlja0VsZW1lbnQ6OnN0eWxlID0gKHByb3BlcnR5KS0+XG5cdHJldHVybiBpZiBAdHlwZSBpcyAndGV4dCdcblx0YXJncyA9IGFyZ3VtZW50c1xuXHRcblx0aWYgSVMuc3RyaW5nKHByb3BlcnR5KVxuXHRcdHZhbHVlID0gaWYgdHlwZW9mIGFyZ3NbMV0gaXMgJ2Z1bmN0aW9uJyB0aGVuIGFyZ3NbMV0uY2FsbChALCBAcmVsYXRlZCkgZWxzZSBhcmdzWzFdXG5cdFx0dmFsdWUgPSBDU1MuVU5TRVQgaWYgYXJnc1sxXSBpcyBudWxsIGFuZCBJUy5kZWZpbmVkKEBjdXJyZW50U3RhdGVTdHlsZShwcm9wZXJ0eSkpIGFuZCBub3QgSVMuZnVuY3Rpb24oQGN1cnJlbnRTdGF0ZVN0eWxlKHByb3BlcnR5KSlcblx0XHRyZXN1bHQgPSBDU1MoQGVsLCBwcm9wZXJ0eSwgdmFsdWUsIEBvcHRpb25zLmZvcmNlU3R5bGUpXG5cdFx0XG5cdFx0aWYgYXJncy5sZW5ndGggaXMgMVxuXHRcdFx0IyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuXHRcdFx0cmV0dXJuIGlmIEBfaW5zZXJ0ZWQgdGhlbiByZXN1bHQgZWxzZSBpZiBub3QgcmVzdWx0IHRoZW4gcmVzdWx0IGVsc2UgJydcblxuXHRlbHNlIGlmIElTLm9iamVjdChwcm9wZXJ0eSlcblx0XHRrZXlzID0gT2JqZWN0LmtleXMocHJvcGVydHkpOyBpID0gLTFcblx0XHRAc3R5bGUoa2V5LCBwcm9wZXJ0eVtrZXldKSB3aGlsZSBrZXk9a2V5c1srK2ldXG5cblx0cmV0dXJuIEBcblxuXG4jIyMqXG4gKiBBdHRlbXB0cyB0byByZXNvbHZlIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBwcm9wZXJ0eSBpbiB0aGUgZm9sbG93aW5nIG9yZGVyIGlmIGVhY2ggb25lIGlzbid0IGEgdmFsaWQgdmFsdWU6XG4gKiAxLiBmcm9tIGNvbXB1dGVkIHN0eWxlIChmb3IgZG9tLWluc2VydGVkIGVscylcbiAqIDIuIGZyb20gRE9NRWxlbWVudC5zdHlsZSBvYmplY3QgKGZvciBub24taW5zZXJ0ZWQgZWxzOyBpZiBvcHRpb25zLnN0eWxlQWZ0ZXJJbnNlcnQsIHdpbGwgb25seSBoYXZlIHN0YXRlIHN0eWxlcylcbiAqIDMuIGZyb20gcHJvdmlkZWQgc3R5bGUgb3B0aW9uc1xuICogKGZvciBub24taW5zZXJ0ZWQgZWxzOyBjaGVja2luZyBvbmx5ICRiYXNlIHNpbmNlIHN0YXRlIHN0eWxlcyB3aWxsIGFsd2F5cyBiZSBhcHBsaWVkIHRvIHRoZSBzdHlsZSBvYmplY3QgZXZlbiBmb3Igbm9uLWluc2VydGVkKVxuIyMjXG5RdWlja0VsZW1lbnQ6OnN0eWxlU2FmZSA9IChwcm9wZXJ0eSwgc2tpcENvbXB1dGVkKS0+XG5cdHJldHVybiBpZiBAdHlwZSBpcyAndGV4dCdcblx0c2FtcGxlID0gQGVsLnN0eWxlW3Byb3BlcnR5XVxuXG5cdGlmIElTLnN0cmluZyhzYW1wbGUpIG9yIElTLm51bWJlcihzYW1wbGUpXG5cdFx0Y29tcHV0ZWQgPSBpZiBza2lwQ29tcHV0ZWQgdGhlbiAwIGVsc2UgQHN0eWxlKHByb3BlcnR5KVxuXHRcdHJlc3VsdCA9IGNvbXB1dGVkIG9yIEBlbC5zdHlsZVtwcm9wZXJ0eV0gb3IgQGN1cnJlbnRTdGF0ZVN0eWxlKHByb3BlcnR5KSBvciAnJ1xuXHRcdHJldHVybiBpZiB0eXBlb2YgcmVzdWx0IGlzICdmdW5jdGlvbicgdGhlbiByZXN1bHQuY2FsbChALCBAcmVsYXRlZCkgZWxzZSByZXN1bHRcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6c3R5bGVQYXJzZWQgPSAocHJvcGVydHksIHNraXBDb21wdXRlZCktPlxuXHRwYXJzZUZsb2F0IEBzdHlsZVNhZmUocHJvcGVydHksIHNraXBDb21wdXRlZClcblxuXG5RdWlja0VsZW1lbnQ6OnJlY2FsY1N0eWxlID0gKHJlY2FsY0NoaWxkcmVuKS0+XG5cdHRhcmdldFN0eWxlcyA9IEBfcmVzb2x2ZUZuU3R5bGVzKEBfZ2V0QWN0aXZlU3RhdGVzKCksIHRydWUpXG5cblx0QHN0eWxlKHRhcmdldFN0eWxlcylcblx0XG5cdGlmIHJlY2FsY0NoaWxkcmVuXG5cdFx0Y2hpbGQucmVjYWxjU3R5bGUoKSBmb3IgY2hpbGQgaW4gQF9jaGlsZHJlblxuXHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OmN1cnJlbnRTdGF0ZVN0eWxlID0gKHByb3BlcnR5KS0+IGlmIHByb3BlcnR5XG5cdGlmIEBfc3RhdGUubGVuZ3RoXG5cdFx0c3RhdGVzID0gQF9zdGF0ZS5zbGljZSgpXG5cdFx0c3RhdGVzLnB1c2goQF9zdGF0ZVNoYXJlZC4uLikgaWYgQF9zdGF0ZVNoYXJlZCBhbmQgQF9zdGF0ZVNoYXJlZC5sZW5ndGhcblx0XHRpID0gc3RhdGVzLmxlbmd0aFxuXHRcdHdoaWxlIHN0YXRlID0gc3RhdGVzWy0taV1cblx0XHRcdHJldHVybiBAX3N0eWxlc1tzdGF0ZV0ucnVsZVtwcm9wZXJ0eV0gaWYgQF9zdHlsZXNbc3RhdGVdIGFuZCBJUy5kZWZpbmVkKEBfc3R5bGVzW3N0YXRlXS5ydWxlW3Byb3BlcnR5XSlcblxuXHRyZXR1cm4gQF9zdHlsZXMuYmFzZS5ydWxlW3Byb3BlcnR5XSBpZiBAX3N0eWxlcy5iYXNlXG5cblxuUXVpY2tFbGVtZW50OjpoaWRlID0gKCktPlxuXHRAc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcblxuXG5RdWlja0VsZW1lbnQ6OnNob3cgPSAoZGlzcGxheSktPlxuXHRpZiBub3QgZGlzcGxheVxuXHRcdGRpc3BsYXkgPSBAY3VycmVudFN0YXRlU3R5bGUoJ2Rpc3BsYXknKVxuXHRcdGRpc3BsYXkgPSAnYmxvY2snIGlmIGRpc3BsYXkgaXMgJ25vbmUnIG9yIG5vdCBkaXNwbGF5XG5cdFxuXHRkaXNwbGF5ID89IEBfc3R5bGVzLmJhc2U/LmRpc3BsYXkgb3IgJ2Jsb2NrJ1xuXHRAc3R5bGUgJ2Rpc3BsYXknLCBkaXNwbGF5XG5cblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBRdWlja0VsZW1lbnQ6Oixcblx0J29yaWVudGF0aW9uJzogb3JpZW50YXRpb25HZXR0ZXIgPSBnZXQ6ICgpLT4gaWYgQHdpZHRoID4gQGhlaWdodCB0aGVuICdsYW5kc2NhcGUnIGVsc2UgJ3BvcnRyYWl0J1xuXHQnYXNwZWN0UmF0aW8nOiBhc3BlY3RSYXRpb0dldHRlciA9IGdldDogKCktPiBAd2lkdGgvQGhlaWdodFxuXHQncmVjdCc6IGdldDogKCktPiBAZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0J3dpZHRoJzpcblx0XHRnZXQ6ICgpLT4gcGFyc2VGbG9hdCBAc3R5bGUoJ3dpZHRoJylcblx0XHRzZXQ6ICh2YWx1ZSktPiBAc3R5bGUgJ3dpZHRoJywgdmFsdWVcblx0J2hlaWdodCc6XG5cdFx0Z2V0OiAoKS0+IHBhcnNlRmxvYXQgQHN0eWxlKCdoZWlnaHQnKVxuXHRcdHNldDogKHZhbHVlKS0+IEBzdHlsZSAnaGVpZ2h0JywgdmFsdWVcblxuXG4iLCJRdWlja0VsZW1lbnQ6OmF0dHIgPSAoYXR0ck5hbWUsIG5ld1ZhbHVlKS0+IHN3aXRjaCBuZXdWYWx1ZVxuXHR3aGVuIHVuZGVmaW5lZCB0aGVuIEBlbC5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpXG5cdHdoZW4gbnVsbCB0aGVuIEBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpXG5cdGVsc2Vcblx0XHRAZWwuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBuZXdWYWx1ZSlcblx0XHRyZXR1cm4gQFxuXG5cblxuUXVpY2tFbGVtZW50Ojpwcm9wID0gKHByb3BOYW1lLCBuZXdWYWx1ZSktPiBzd2l0Y2ggbmV3VmFsdWVcblx0d2hlbiB1bmRlZmluZWQgdGhlbiBAZWxbcHJvcE5hbWVdXG5cdGVsc2Vcblx0XHRAZWxbcHJvcE5hbWVdID0gbmV3VmFsdWVcblx0XHRyZXR1cm4gQCIsIlF1aWNrRWxlbWVudDo6dG9UZW1wbGF0ZSA9ICgpLT5cblx0UXVpY2tEb20udGVtcGxhdGUoQClcblxuXG5RdWlja0VsZW1lbnQ6OmNsb25lID0gKCktPlxuXHRlbENsb25lID0gQGVsLmNsb25lTm9kZShmYWxzZSlcblx0b3B0aW9ucyA9IGV4dGVuZC5jbG9uZShAb3B0aW9ucywge2V4aXN0aW5nOmVsQ2xvbmV9KVxuXHRcblx0bmV3RWwgPSBuZXcgUXVpY2tFbGVtZW50KEB0eXBlLCBvcHRpb25zKVxuXHRuZXdFbC5zdGF0ZShhY3RpdmVTdGF0ZSwgb24pIGZvciBhY3RpdmVTdGF0ZSBpbiBAX3N0YXRlXG5cdG5ld0VsLmFwcGVuZChjaGlsZC5jbG9uZSgpKSBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG5cdGZvciBldmVudE5hbWUsIGNhbGxiYWNrcyBvZiBAX2V2ZW50Q2FsbGJhY2tzXG5cdFx0bmV3RWwub24oZXZlbnROYW1lLCBjYWxsYmFjaykgZm9yIGNhbGxiYWNrIGluIGNhbGxiYWNrc1xuXHRcblx0cmV0dXJuIG5ld0VsXG5cblxuUXVpY2tFbGVtZW50OjphcHBlbmQgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblx0XHRcblx0XHRpZiBJUy5xdWlja0RvbUVsKHRhcmdldEVsKVxuXHRcdFx0cHJldlBhcmVudCA9IHRhcmdldEVsLnBhcmVudFxuXHRcdFx0cHJldlBhcmVudC5fcmVtb3ZlQ2hpbGQodGFyZ2V0RWwpIGlmIHByZXZQYXJlbnRcblx0XHRcdEBfY2hpbGRyZW4ucHVzaCh0YXJnZXRFbClcblx0XHRcdEBlbC5hcHBlbmRDaGlsZCh0YXJnZXRFbC5lbClcblx0XHRcdHRhcmdldEVsLl9yZWZyZXNoUGFyZW50KCkgIyBGb3JjZSByZS1mcmVzaCB0YXJnZXRFbC5fcGFyZW50IHZhbHVlIHRvIHRyaWdnZXIgaW5zZXJ0ZWQgY2FsbGJhY2tcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6YXBwZW5kVG8gPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblx0XHRcblx0XHRpZiBJUy5xdWlja0RvbUVsKHRhcmdldEVsKVxuXHRcdFx0dGFyZ2V0RWwuYXBwZW5kKEApXG5cdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6cHJlcGVuZCA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXHRcdFxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHRwcmV2UGFyZW50ID0gdGFyZ2V0RWwucGFyZW50XG5cdFx0XHRwcmV2UGFyZW50Ll9yZW1vdmVDaGlsZCh0YXJnZXRFbCkgaWYgcHJldlBhcmVudFxuXHRcdFx0QF9jaGlsZHJlbi51bnNoaWZ0KHRhcmdldEVsKVxuXHRcdFx0QGVsLmluc2VydEJlZm9yZSh0YXJnZXRFbC5lbCwgQGVsLmZpcnN0Q2hpbGQpXG5cdFx0XHR0YXJnZXRFbC5fcmVmcmVzaFBhcmVudCgpICMgRm9yY2UgcmUtZnJlc2ggdGFyZ2V0RWwuX3BhcmVudCB2YWx1ZSB0byB0cmlnZ2VyIGluc2VydGVkIGNhbGxiYWNrXG5cdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6cHJlcGVuZFRvID0gKHRhcmdldEVsKS0+XG5cdGlmIHRhcmdldEVsXG5cdFx0dGFyZ2V0RWwgPSBoZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwodGFyZ2V0RWwpXG5cdFx0XG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbClcblx0XHRcdHRhcmdldEVsLnByZXBlbmQoQClcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6YWZ0ZXIgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWwgYW5kIEBwYXJlbnRcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHRteUluZGV4ID0gQHBhcmVudC5fY2hpbGRyZW4uaW5kZXhPZihAKVxuXHRcdFx0QHBhcmVudC5fY2hpbGRyZW4uc3BsaWNlKG15SW5kZXgrMSwgMCwgdGFyZ2V0RWwpXG5cdFx0XHRAZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGFyZ2V0RWwuZWwsIEBlbC5uZXh0U2libGluZylcblx0XHRcdHRhcmdldEVsLl9yZWZyZXNoUGFyZW50KCkgIyBGb3JjZSByZS1mcmVzaCB0YXJnZXRFbC5fcGFyZW50IHZhbHVlIHRvIHRyaWdnZXIgaW5zZXJ0ZWQgY2FsbGJhY2tcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6aW5zZXJ0QWZ0ZXIgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblx0XHRcblx0XHRpZiBJUy5xdWlja0RvbUVsKHRhcmdldEVsKVxuXHRcdFx0dGFyZ2V0RWwuYWZ0ZXIoQClcblx0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpiZWZvcmUgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWwgYW5kIEBwYXJlbnRcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHRteUluZGV4ID0gQHBhcmVudC5fY2hpbGRyZW4uaW5kZXhPZihAKVxuXHRcdFx0QHBhcmVudC5fY2hpbGRyZW4uc3BsaWNlKG15SW5kZXgsIDAsIHRhcmdldEVsKVxuXHRcdFx0QGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRhcmdldEVsLmVsLCBAZWwpXG5cdFx0XHR0YXJnZXRFbC5fcmVmcmVzaFBhcmVudCgpICMgRm9yY2UgcmUtZnJlc2ggdGFyZ2V0RWwuX3BhcmVudCB2YWx1ZSB0byB0cmlnZ2VyIGluc2VydGVkIGNhbGxiYWNrXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6Omluc2VydEJlZm9yZSA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXHRcdFxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHR0YXJnZXRFbC5iZWZvcmUoQClcblx0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpkZXRhY2ggPSAoKS0+XG5cdEBwYXJlbnQ/Ll9yZW1vdmVDaGlsZChAKVxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6cmVtb3ZlID0gKCktPlxuXHRAZGV0YWNoKClcblx0QHJlc2V0U3RhdGUoKVxuXHRpZiBAX2V2ZW50Q2FsbGJhY2tzXG5cdFx0QF9ldmVudENhbGxiYWNrc1tldmVudE5hbWVdLmxlbmd0aCA9IDAgZm9yIGV2ZW50TmFtZSBvZiBAX2V2ZW50Q2FsbGJhY2tzXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjplbXB0eSA9ICgpLT5cblx0QF9yZW1vdmVDaGlsZChjaGlsZCkgZm9yIGNoaWxkIGluIEBjaGlsZHJlbi5zbGljZSgpXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50Ojp3cmFwID0gKHRhcmdldEVsKS0+XG5cdGlmIHRhcmdldEVsXG5cdFx0dGFyZ2V0RWwgPSBoZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwodGFyZ2V0RWwpXG5cdFx0Y3VycmVudFBhcmVudCA9IEBwYXJlbnRcblxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpIGFuZCB0YXJnZXRFbCBpc250IEAgYW5kIHRhcmdldEVsIGlzbnQgQHBhcmVudFxuXHRcdFx0aWYgY3VycmVudFBhcmVudFxuXHRcdFx0XHRjdXJyZW50UGFyZW50Ll9yZW1vdmVDaGlsZChALCBpZiBub3QgdGFyZ2V0RWwucGFyZW50IHRoZW4gdGFyZ2V0RWwpXG5cdFx0XHRcblx0XHRcdHRhcmdldEVsLmFwcGVuZChAKVxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50Ojp1bndyYXAgPSAoKS0+XG5cdHBhcmVudCA9IEBwYXJlbnRcblx0aWYgcGFyZW50XG5cdFx0cGFyZW50Q2hpbGRyZW4gPSBRdWlja0RvbS5iYXRjaChwYXJlbnQuY2hpbGRyZW4pXG5cdFx0cGFyZW50U2libGluZyA9IHBhcmVudC5uZXh0XG5cdFx0Z3JhbmRQYXJlbnQgPSBwYXJlbnQucGFyZW50XG5cdFx0aWYgZ3JhbmRQYXJlbnRcblx0XHRcdHBhcmVudC5kZXRhY2goKVxuXG5cdFx0XHRpZiBwYXJlbnRTaWJsaW5nXG5cdFx0XHRcdHBhcmVudENoaWxkcmVuLmluc2VydEJlZm9yZShwYXJlbnRTaWJsaW5nKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwYXJlbnRDaGlsZHJlbi5hcHBlbmRUbyhncmFuZFBhcmVudClcblx0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpyZXBsYWNlID0gKHRhcmdldEVsKS0+XG5cdGlmIHRhcmdldEVsXG5cdFx0dGFyZ2V0RWwgPSBoZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwodGFyZ2V0RWwpXG5cdFxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpIGFuZCB0YXJnZXRFbCBpc250IEBcblx0XHRcdHRhcmdldEVsLmRldGFjaCgpXG5cdFx0XHRAcGFyZW50Py5fcmVtb3ZlQ2hpbGQoQCwgdGFyZ2V0RWwpXG5cdFx0XHR0YXJnZXRFbC5fcmVmcmVzaFBhcmVudCgpICMgRm9yY2UgcmUtZnJlc2ggdGFyZ2V0RWwuX3BhcmVudCB2YWx1ZSB0byB0cmlnZ2VyIGluc2VydGVkIGNhbGxiYWNrXG5cdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6aGFzQ2xhc3MgPSAodGFyZ2V0KS0+XG5cdGhlbHBlcnMuaW5jbHVkZXMoQGNsYXNzTGlzdCwgdGFyZ2V0KVxuXG5cblF1aWNrRWxlbWVudDo6YWRkQ2xhc3MgPSAodGFyZ2V0KS0+XG5cdGNsYXNzTGlzdCA9IEBjbGFzc0xpc3Rcblx0dGFyZ2V0SW5kZXggPSBjbGFzc0xpc3QuaW5kZXhPZih0YXJnZXQpXG5cblx0aWYgdGFyZ2V0SW5kZXggaXMgLTFcblx0XHRjbGFzc0xpc3QucHVzaCh0YXJnZXQpXG5cdFx0QGNsYXNzTmFtZSA9IGlmIGNsYXNzTGlzdC5sZW5ndGggPiAxIHRoZW4gY2xhc3NMaXN0LmpvaW4oJyAnKSBlbHNlIGNsYXNzTGlzdFswXVxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpyZW1vdmVDbGFzcyA9ICh0YXJnZXQpLT5cblx0Y2xhc3NMaXN0ID0gQGNsYXNzTGlzdFxuXHR0YXJnZXRJbmRleCA9IGNsYXNzTGlzdC5pbmRleE9mKHRhcmdldClcblx0XG5cdGlmIHRhcmdldEluZGV4IGlzbnQgLTFcblx0XHRjbGFzc0xpc3Quc3BsaWNlKHRhcmdldEluZGV4LCAxKVxuXHRcdEBjbGFzc05hbWUgPSBpZiBjbGFzc0xpc3QubGVuZ3RoIHRoZW4gY2xhc3NMaXN0LmpvaW4oJyAnKSBlbHNlICcnXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnRvZ2dsZUNsYXNzID0gKHRhcmdldCktPlxuXHRpZiBAaGFzQ2xhc3ModGFyZ2V0KVxuXHRcdEByZW1vdmVDbGFzcyh0YXJnZXQpXG5cdGVsc2Vcblx0XHRAYWRkQ2xhc3ModGFyZ2V0KVxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpfcmVmcmVzaFBhcmVudCA9ICgpLT5cblx0QHBhcmVudFxuXG5cblF1aWNrRWxlbWVudDo6X3JlbW92ZUNoaWxkID0gKHRhcmdldENoaWxkLCByZXBsYWNlbWVudENoaWxkKS0+XG5cdGluZGV4T2ZDaGlsZCA9IEBjaGlsZHJlbi5pbmRleE9mKHRhcmdldENoaWxkKVxuXHRpZiBpbmRleE9mQ2hpbGQgaXNudCAtMVxuXHRcdGlmIHJlcGxhY2VtZW50Q2hpbGRcblx0XHRcdEBlbC5yZXBsYWNlQ2hpbGQocmVwbGFjZW1lbnRDaGlsZC5lbCwgdGFyZ2V0Q2hpbGQuZWwpXG5cdFx0XHRAX2NoaWxkcmVuLnNwbGljZShpbmRleE9mQ2hpbGQsIDEsIHJlcGxhY2VtZW50Q2hpbGQpXG5cdFx0ZWxzZVxuXHRcdFx0QGVsLnJlbW92ZUNoaWxkKHRhcmdldENoaWxkLmVsKVxuXHRcdFx0QF9jaGlsZHJlbi5zcGxpY2UoaW5kZXhPZkNoaWxkLCAxKVxuXHRcdFxuXG5cdHJldHVybiBAXG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgUXVpY2tFbGVtZW50OjosXG5cdCdodG1sJzpcblx0XHRnZXQ6ICgpLT4gQGVsLmlubmVySFRNTFxuXHRcdHNldDogKG5ld1ZhbHVlKS0+IEBlbC5pbm5lckhUTUwgPSBuZXdWYWx1ZVxuXHRcblx0J3RleHQnOlxuXHRcdGdldDogKCktPiBAZWwudGV4dENvbnRlbnRcblx0XHRzZXQ6IChuZXdWYWx1ZSktPiBAZWwudGV4dENvbnRlbnQgPSBuZXdWYWx1ZVxuXG5cdCdjbGFzc05hbWUnOlxuXHRcdGdldDogKCktPiBpZiBAc3ZnIHRoZW4gKEBhdHRyKCdjbGFzcycpIG9yICcnKSBlbHNlIEByYXcuY2xhc3NOYW1lXG5cdFx0c2V0OiAobmV3VmFsdWUpLT4gaWYgQHN2ZyB0aGVuIEBhdHRyKCdjbGFzcycsIG5ld1ZhbHVlKSBlbHNlIEByYXcuY2xhc3NOYW1lID0gbmV3VmFsdWVcblxuXHQnY2xhc3NMaXN0Jzpcblx0XHRnZXQ6ICgpLT5cblx0XHRcdGxpc3QgPSBAY2xhc3NOYW1lLnNwbGl0KC9cXHMrLylcblx0XHRcdGxpc3QucG9wKCkgaWYgbGlzdFtsaXN0Lmxlbmd0aC0xXSBpcyAnJ1xuXHRcdFx0bGlzdC5zaGlmdCgpIGlmIGxpc3RbMF0gaXMgJydcblx0XHRcdHJldHVybiBsaXN0XG5cblxuXG5cblxuXG5cbiIsIlF1aWNrRWxlbWVudDo6dXBkYXRlT3B0aW9ucyA9IChvcHRpb25zKS0+XG5cdGlmIElTLm9iamVjdChvcHRpb25zKSBcblx0XHRAb3B0aW9ucyA9IG9wdGlvbnNcblx0XHRAX25vcm1hbGl6ZU9wdGlvbnMoKVxuXHRcdEBfYXBwbHlPcHRpb25zKEBvcHRpb25zKVxuXHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnVwZGF0ZVN0YXRlU3R5bGVzID0gKHN0eWxlcyktPlxuXHRpZiBJUy5vYmplY3RQbGFpbihzdHlsZXMpXG5cdFx0ZXh0ZW5kLmRlZXAuY29uY2F0IEAsIHBhcnNlZCA9IEBfcGFyc2VTdHlsZXMoc3R5bGVzKVxuXG5cdFx0aWYgcGFyc2VkLl9zdHlsZXNcblx0XHRcdHVwZGF0ZWRTdGF0ZXMgPSBPYmplY3Qua2V5cyhwYXJzZWQuX3N0eWxlcylcblx0XHRcdFxuXHRcdFx0Zm9yIHN0YXRlIGluIHVwZGF0ZWRTdGF0ZXMgd2hlbiBAc3RhdGUoc3RhdGUpIG9yIHN0YXRlIGlzICdiYXNlJ1xuXHRcdFx0XHRAX2FwcGx5UmVnaXN0ZXJlZFN0eWxlKEBfc3R5bGVzW3N0YXRlXSwgQF9nZXRBY3RpdmVTdGF0ZXMoc3RhdGUpLCBmYWxzZSlcblx0XHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnVwZGF0ZVN0YXRlVGV4dHMgPSAodGV4dHMpLT5cblx0aWYgSVMub2JqZWN0UGxhaW4odGV4dHMpXG5cdFx0ZXh0ZW5kLmRlZXAuY29uY2F0IEAsIHBhcnNlZCA9IEBfcGFyc2VUZXh0cyh0ZXh0cylcblx0XG5cdHJldHVybiBAXG5cblxuXG5RdWlja0VsZW1lbnQ6OmFwcGx5RGF0YSA9IChkYXRhKS0+XG5cdGlmIGNvbXB1dGVycyA9IEBvcHRpb25zLmNvbXB1dGVyc1xuXHRcdGRlZmF1bHRzID0gQG9wdGlvbnMuZGVmYXVsdHNcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoY29tcHV0ZXJzKVxuXHRcdFxuXHRcdGZvciBrZXkgaW4ga2V5c1xuXHRcdFx0aWYgZGF0YSBhbmQgZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpXG5cdFx0XHRcdEBfcnVuQ29tcHV0ZXIoa2V5LCBkYXRhW2tleV0pXG5cdFx0XHRcblx0XHRcdGVsc2UgaWYgZGVmYXVsdHMgYW5kIGRlZmF1bHRzLmhhc093blByb3BlcnR5KGtleSlcblx0XHRcdFx0QF9ydW5Db21wdXRlcihrZXksIGRlZmF1bHRzW2tleV0pXG5cblxuXHRjaGlsZC5hcHBseURhdGEoZGF0YSkgZm9yIGNoaWxkIGluIEBfY2hpbGRyZW5cblx0cmV0dXJuXG5cblxuUXVpY2tFbGVtZW50OjpfcnVuQ29tcHV0ZXIgPSAoY29tcHV0ZXIsIGFyZyktPlxuXHRAb3B0aW9ucy5jb21wdXRlcnNbY29tcHV0ZXJdLmNhbGwoQCwgYXJnKVxuXG5cblxuXG5cblxuIiwiUXVpY2tXaW5kb3cgPSBcblx0dHlwZTogJ3dpbmRvdydcblx0ZWw6IHdpbmRvd1xuXHRyYXc6IHdpbmRvd1xuXHRfZXZlbnRDYWxsYmFja3M6IHtfX3JlZnM6e319XG5cdFxuXG5RdWlja1dpbmRvdy5vbiA9ICBRdWlja0VsZW1lbnQ6Om9uXG5RdWlja1dpbmRvdy5vZmYgPSAgUXVpY2tFbGVtZW50OjpvZmZcblF1aWNrV2luZG93LmVtaXQgPSAgUXVpY2tFbGVtZW50OjplbWl0XG5RdWlja1dpbmRvdy5lbWl0UHJpdmF0ZSA9ICBRdWlja0VsZW1lbnQ6OmVtaXRQcml2YXRlXG5RdWlja1dpbmRvdy5fbGlzdGVuVG8gPSAgUXVpY2tFbGVtZW50OjpfbGlzdGVuVG9cblF1aWNrV2luZG93Ll9pbnZva2VIYW5kbGVycyA9ICBRdWlja0VsZW1lbnQ6Ol9pbnZva2VIYW5kbGVyc1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgUXVpY2tXaW5kb3csXG5cdCd3aWR0aCc6IGdldDogKCktPiB3aW5kb3cuaW5uZXJXaWR0aFxuXHQnaGVpZ2h0JzogZ2V0OiAoKS0+IHdpbmRvdy5pbm5lckhlaWdodFxuXHQnb3JpZW50YXRpb24nOiBvcmllbnRhdGlvbkdldHRlclxuXHQnYXNwZWN0UmF0aW8nOiBhc3BlY3RSYXRpb0dldHRlclxuXG4iLCJNZWRpYVF1ZXJ5ID0gbmV3ICgpLT5cblx0Y2FsbGJhY2tzID0gW11cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgKCktPlxuXHRcdGNhbGxiYWNrKCkgZm9yIGNhbGxiYWNrIGluIGNhbGxiYWNrc1xuXHRcdHJldHVyblxuXG5cdEBwYXJzZVF1ZXJ5ID0gKHRhcmdldCwgcXVlcnlTdHJpbmcpLT5cblx0XHRxdWVyeVNwbGl0ID0gcXVlcnlTdHJpbmcuc3BsaXQoJygnKVxuXHRcdHNvdXJjZSA9IHF1ZXJ5U3BsaXRbMF1cblx0XHRzb3VyY2UgPSBzd2l0Y2ggc291cmNlXG5cdFx0XHR3aGVuICd3aW5kb3cnIHRoZW4gUXVpY2tXaW5kb3dcblx0XHRcdHdoZW4gJ3BhcmVudCcgdGhlbiB0YXJnZXQucGFyZW50XG5cdFx0XHR3aGVuICdzZWxmJyB0aGVuIHRhcmdldFxuXHRcdFx0ZWxzZSB0YXJnZXQucGFyZW50TWF0Y2hpbmcgKHBhcmVudCktPiBwYXJlbnQucmVmIGlzIHNvdXJjZS5zbGljZSgxKVxuXG5cdFx0cnVsZXMgPSBxdWVyeVNwbGl0WzFdXG5cdFx0XHQuc2xpY2UoMCwtMSlcblx0XHRcdC5zcGxpdChydWxlRGVsaW1pdGVyKVxuXHRcdFx0Lm1hcCAocnVsZSktPiBcblx0XHRcdFx0c3BsaXQgPSBydWxlLnNwbGl0KCc6Jylcblx0XHRcdFx0dmFsdWUgPSBwYXJzZUZsb2F0KHNwbGl0WzFdKVxuXHRcdFx0XHR2YWx1ZSA9IHNwbGl0WzFdIGlmIGlzTmFOKHZhbHVlKVxuXHRcdFx0XHRrZXkgPSBzcGxpdFswXVxuXHRcdFx0XHRrZXlQcmVmaXggPSBrZXkuc2xpY2UoMCw0KVxuXHRcdFx0XHRtYXggPSBrZXlQcmVmaXggaXMgJ21heC0nXG5cdFx0XHRcdG1pbiA9IG5vdCBtYXggYW5kIGtleVByZWZpeCBpcyAnbWluLSdcblx0XHRcdFx0a2V5ID0ga2V5LnNsaWNlKDQpIGlmIG1heCBvciBtaW5cblx0XHRcdFx0Z2V0dGVyID0gc3dpdGNoIGtleVxuXHRcdFx0XHRcdHdoZW4gJ29yaWVudGF0aW9uJyB0aGVuICgpLT4gc291cmNlLm9yaWVudGF0aW9uXG5cdFx0XHRcdFx0d2hlbiAnYXNwZWN0LXJhdGlvJyB0aGVuICgpLT4gc291cmNlLmFzcGVjdFJhdGlvXG5cdFx0XHRcdFx0d2hlbiAnd2lkdGgnLCdoZWlnaHQnIHRoZW4gKCktPiBzb3VyY2Vba2V5XVxuXHRcdFx0XHRcdGVsc2UgKCktPlxuXHRcdFx0XHRcdFx0c3RyaW5nVmFsdWUgPSBzb3VyY2Uuc3R5bGUoa2V5KVxuXHRcdFx0XHRcdFx0cGFyc2VkVmFsdWUgPSBwYXJzZUZsb2F0IHN0cmluZ1ZhbHVlXG5cdFx0XHRcdFx0XHRyZXR1cm4gaWYgaXNOYU4ocGFyc2VkVmFsdWUpIHRoZW4gc3RyaW5nVmFsdWUgZWxzZSBwYXJzZWRWYWx1ZVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIHtrZXksdmFsdWUsbWluLG1heCxnZXR0ZXJ9XG5cblx0XHRyZXR1cm4ge3NvdXJjZSwgcnVsZXN9XG5cblxuXHRAcmVnaXN0ZXIgPSAodGFyZ2V0LCBxdWVyeVN0cmluZyktPlxuXHRcdHF1ZXJ5ID0gQHBhcnNlUXVlcnkodGFyZ2V0LCBxdWVyeVN0cmluZylcblx0XHRpZiBxdWVyeS5zb3VyY2Vcblx0XHRcdGNhbGxiYWNrcy5wdXNoIGNhbGxiYWNrID0gKCktPiB0ZXN0UnVsZSh0YXJnZXQsIHF1ZXJ5LCBxdWVyeVN0cmluZylcblx0XHRcdGNhbGxiYWNrKClcblx0XHRyZXR1cm4gcXVlcnlcblxuXG5cdHRlc3RSdWxlID0gKHRhcmdldCwgcXVlcnksIHF1ZXJ5U3RyaW5nKS0+XG5cdFx0cGFzc2VkID0gdHJ1ZVxuXG5cdFx0Zm9yIHJ1bGUgaW4gcXVlcnkucnVsZXNcblx0XHRcdGN1cnJlbnRWYWx1ZSA9IHJ1bGUuZ2V0dGVyKClcblx0XHRcdHBhc3NlZCA9IHN3aXRjaFxuXHRcdFx0XHR3aGVuIHJ1bGUubWluIHRoZW4gY3VycmVudFZhbHVlID49IHJ1bGUudmFsdWVcblx0XHRcdFx0d2hlbiBydWxlLm1heCB0aGVuIGN1cnJlbnRWYWx1ZSA8PSBydWxlLnZhbHVlXG5cdFx0XHRcdGVsc2UgY3VycmVudFZhbHVlIGlzIHJ1bGUudmFsdWVcblxuXHRcdFx0YnJlYWsgaWYgbm90IHBhc3NlZFx0XHRcblx0XHRcblx0XHR0YXJnZXQuc3RhdGUocXVlcnlTdHJpbmcsIHBhc3NlZClcblxuXHRyZXR1cm4gQFxuXG5cblxuXG5ydWxlRGVsaW1pdGVyID0gLyxcXHMqL1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiY2xhc3MgUXVpY2tCYXRjaFxuXHRjb25zdHJ1Y3RvcjogKGVsZW1lbnRzLCBAcmV0dXJuUmVzdWx0cyktPlxuXHRcdEBlbGVtZW50cyA9IGVsZW1lbnRzLm1hcCAoZWwpLT4gUXVpY2tEb20oZWwpXG5cblx0cmV2ZXJzZTogKCktPlxuXHRcdEBlbGVtZW50cyA9IEBlbGVtZW50cy5yZXZlcnNlKClcblx0XHRyZXR1cm4gQFxuXG5cdHJldHVybjogKHJldHVybk5leHQpLT5cblx0XHRpZiByZXR1cm5OZXh0XG5cdFx0XHRAcmV0dXJuUmVzdWx0cyA9IHRydWVcblx0XHRcdHJldHVybiBAXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIEBsYXN0UmVzdWx0c1xuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja0JhdGNoLm5hbWUgPz0gJ1F1aWNrQmF0Y2gnXG5cblxuXG5PYmplY3Qua2V5cyhRdWlja0VsZW1lbnQ6OikuY29uY2F0KCdjc3MnLCAncmVwbGFjZVdpdGgnLCAnaHRtbCcsICd0ZXh0JykuZm9yRWFjaCAobWV0aG9kKS0+XG5cdFF1aWNrQmF0Y2g6OlttZXRob2RdID0gKG5ld1ZhbHVlKS0+XG5cdFx0cmVzdWx0cyA9IEBsYXN0UmVzdWx0cyA9IGZvciBlbGVtZW50IGluIEBlbGVtZW50c1xuXHRcdFx0aWYgbWV0aG9kIGlzICdodG1sJyBvciBtZXRob2QgaXMgJ3RleHQnXG5cdFx0XHRcdGlmIG5ld1ZhbHVlIHRoZW4gZWxlbWVudFttZXRob2RdID0gbmV3VmFsdWUgZWxzZSBlbGVtZW50W21ldGhvZF1cblx0XHRcdGVsc2Vcblx0XHRcdFx0ZWxlbWVudFttZXRob2RdKGFyZ3VtZW50cy4uLilcblx0XHRcblx0XHRyZXR1cm4gaWYgQHJldHVyblJlc3VsdHMgdGhlbiByZXN1bHRzIGVsc2UgQFxuXG5cblF1aWNrRG9tLmJhdGNoID0gKGVsZW1lbnRzLCByZXR1cm5SZXN1bHRzKS0+XG5cdGlmIG5vdCBJUy5pdGVyYWJsZShlbGVtZW50cylcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYXRjaDogZXhwZWN0ZWQgYW4gaXRlcmFibGUsIGdvdCAje1N0cmluZyhlbGVtZW50cyl9XCIpXG5cdGVsc2UgaWYgbm90IGVsZW1lbnRzLmxlbmd0aFxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhdGNoOiBleHBlY3RlZCBhIG5vbi1lbXB0eSBlbGVtZW50IGNvbGxlY3Rpb25cIilcblxuXHRyZXR1cm4gbmV3IFF1aWNrQmF0Y2goZWxlbWVudHMsIHJldHVyblJlc3VsdHMpXG5cblxuIiwiaW1wb3J0ICcuL2V4dGVuZFRlbXBsYXRlJ1xuaW1wb3J0ICcuL3BhcnNlVHJlZSdcbmltcG9ydCAnLi9zY2hlbWEnXG5cbmNsYXNzIFF1aWNrVGVtcGxhdGVcblx0Y29uc3RydWN0b3I6IChjb25maWcsIGlzVHJlZSktPlxuXHRcdHJldHVybiBjb25maWcgaWYgSVMudGVtcGxhdGUoY29uZmlnKVxuXHRcdGNvbmZpZyA9IGlmIGlzVHJlZSB0aGVuIHBhcnNlVHJlZShjb25maWcpIGVsc2UgY29uZmlnXG5cdFx0ZXh0ZW5kIEAsIGNvbmZpZ1xuXHRcdEBfaGFzQ29tcHV0ZXJzID0gISFAb3B0aW9ucy5jb21wdXRlcnNcblxuXHRcdGlmIG5vdCBAX2hhc0NvbXB1dGVycyBhbmQgQGNoaWxkcmVuLmxlbmd0aFxuXHRcdFx0Zm9yIGNoaWxkIGluIEBjaGlsZHJlbiB3aGVuIGNoaWxkLl9oYXNDb21wdXRlcnMgb3IgY2hpbGQub3B0aW9ucy5jb21wdXRlcnNcblx0XHRcdFx0QF9oYXNDb21wdXRlcnMgPSB0cnVlXG5cdFx0XHRcdGJyZWFrXG5cdFxuXHRleHRlbmQ6IChuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpLT5cblx0XHRuZXcgUXVpY2tUZW1wbGF0ZSBleHRlbmRUZW1wbGF0ZShALCBuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpXG5cblx0c3Bhd246IChuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpLT5cblx0XHRpZiBuZXdWYWx1ZXMgYW5kIG5ld1ZhbHVlcy5kYXRhXG5cdFx0XHRkYXRhID0gbmV3VmFsdWVzLmRhdGFcblx0XHRcdG5ld1ZhbHVlcyA9IG51bGwgaWYgT2JqZWN0LmtleXMobmV3VmFsdWVzKS5sZW5ndGggaXMgMVxuXHRcdFxuXHRcdGlmIG5ld1ZhbHVlcyBvciBnbG9iYWxPcHRzXG5cdFx0XHRvcHRzID0gZXh0ZW5kVGVtcGxhdGUoQCwgbmV3VmFsdWVzLCBnbG9iYWxPcHRzKVxuXHRcdGVsc2Vcblx0XHRcdG9wdHMgPSBleHRlbmQuY2xvbmUoQClcblx0XHRcdG9wdHMub3B0aW9ucyA9IGV4dGVuZC5jbG9uZShvcHRzLm9wdGlvbnMpXG5cdFxuXG5cdFx0ZWxlbWVudCA9IFF1aWNrRG9tKG9wdHMudHlwZSwgb3B0cy5vcHRpb25zLCBvcHRzLmNoaWxkcmVuLi4uKVxuXG5cdFx0aWYgQF9oYXNDb21wdXRlcnNcblx0XHRcdGlmIG5ld1ZhbHVlcyBpc250IGZhbHNlXG5cdFx0XHRcdGVsZW1lbnQuYXBwbHlEYXRhKGRhdGEpXG5cdFx0XHRpZiBlbGVtZW50Lm9wdGlvbnMuY29tcHV0ZXJzPy5faW5pdFxuXHRcdFx0XHRlbGVtZW50Ll9ydW5Db21wdXRlcignX2luaXQnLCBkYXRhKVxuXG5cdFx0cmV0dXJuIGVsZW1lbnRcblxuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja1RlbXBsYXRlLm5hbWUgPz0gJ1F1aWNrVGVtcGxhdGUnXG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5IFF1aWNrVGVtcGxhdGU6OiwgJ2NoaWxkJywgZ2V0OiAoKS0+XG5cdEBfY2hpbGRSZWZzIG9yIF9nZXRDaGlsZFJlZnMoQCkgIyBzb3VyY2UgaW4gL3NyYy9wYXJ0cy9lbGVtZW50L3RyYXZlcnNpbmcuY29mZmVlXG5cblxuXG5cblxuXG5cblxuIiwiZXh0ZW5kVGVtcGxhdGUgPSAoY3VycmVudE9wdHMsIG5ld09wdHMsIGdsb2JhbE9wdHMpLT5cblx0aWYgZ2xvYmFsT3B0cyB0aGVuIGdsb2JhbE9wdHNUcmFuc2Zvcm0gPSBvcHRpb25zOiAob3B0cyktPiBleHRlbmQob3B0cywgZ2xvYmFsT3B0cylcblx0aWYgSVMuYXJyYXkobmV3T3B0cylcblx0XHRuZXdPcHRzID0gcGFyc2VUcmVlKG5ld09wdHMsIGZhbHNlKVxuXHRlbHNlIGlmIG5ld09wdHMgYW5kIG5vdCBtYXRjaGVzU2NoZW1hKG5ld09wdHMpXG5cdFx0bmV3T3B0cyA9IG9wdGlvbnM6bmV3T3B0c1xuXG5cblx0b3V0cHV0ID0gZXh0ZW5kLmRlZXAubnVsbERlbGV0ZXMubm90S2V5cygnY2hpbGRyZW4nKS5ub3REZWVwKFsncmVsYXRlZEluc3RhbmNlJywnZGF0YSddKS50cmFuc2Zvcm0oZ2xvYmFsT3B0c1RyYW5zZm9ybSkuY2xvbmUoY3VycmVudE9wdHMsIG5ld09wdHMpXG5cdGN1cnJlbnRDaGlsZHJlbiA9IGN1cnJlbnRPcHRzLmNoaWxkcmVuXG5cdG5ld0NoaWxkcmVuID0gbmV3T3B0cz8uY2hpbGRyZW4gb3IgW11cblx0b3V0cHV0LmNoaWxkcmVuID0gW11cblxuXHQjIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5cdGlmIElTLmFycmF5KG5ld0NoaWxkcmVuKVxuXHRcdG1heExlbmd0aCA9IE1hdGgubWF4KGN1cnJlbnRDaGlsZHJlbi5sZW5ndGgsIG5ld0NoaWxkcmVuLmxlbmd0aClcblx0XHRpbmRleCA9IC0xXG5cdFx0d2hpbGUgKytpbmRleCBpc250IG1heExlbmd0aFxuXHRcdFx0bmVlZHNUZW1wbGF0ZVdyYXAgPSBub0NoYW5nZXMgPSBmYWxzZVxuXHRcdFx0Y3VycmVudENoaWxkID0gY3VycmVudENoaWxkcmVuW2luZGV4XVxuXHRcdFx0bmV3Q2hpbGQgPSBuZXdDaGlsZHJlbltpbmRleF1cblx0XHRcdG5ld0NoaWxkUHJvY2Vzc2VkID0gc3dpdGNoXG5cdFx0XHRcdHdoZW4gSVMudGVtcGxhdGUobmV3Q2hpbGQpIHRoZW4gbmV3Q2hpbGRcblx0XHRcdFx0d2hlbiBJUy5hcnJheShuZXdDaGlsZCkgdGhlbiBuZWVkc1RlbXBsYXRlV3JhcCA9IHBhcnNlVHJlZShuZXdDaGlsZClcblx0XHRcdFx0d2hlbiBJUy5zdHJpbmcobmV3Q2hpbGQpIHRoZW4gbmVlZHNUZW1wbGF0ZVdyYXAgPSB7dHlwZTondGV4dCcsIG9wdGlvbnM6e3RleHQ6bmV3Q2hpbGR9fVxuXHRcdFx0XHR3aGVuIG5vdCBuZXdDaGlsZCBhbmQgbm90IGdsb2JhbE9wdHMgdGhlbiBub0NoYW5nZXMgPSB0cnVlXG5cdFx0XHRcdGVsc2UgbmVlZHNUZW1wbGF0ZVdyYXAgPSBuZXdDaGlsZCBvciB0cnVlXG5cblxuXHRcdFx0aWYgbm9DaGFuZ2VzXG5cdFx0XHRcdG5ld0NoaWxkUHJvY2Vzc2VkID0gY3VycmVudENoaWxkXG5cdFx0XHRcblx0XHRcdGVsc2UgaWYgbmVlZHNUZW1wbGF0ZVdyYXBcblx0XHRcdFx0bmV3Q2hpbGRQcm9jZXNzZWQgPSBcblx0XHRcdFx0XHRpZiBjdXJyZW50Q2hpbGRcblx0XHRcdFx0XHRcdGN1cnJlbnRDaGlsZC5leHRlbmQobmV3Q2hpbGRQcm9jZXNzZWQsIGdsb2JhbE9wdHMpXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0bmV3IFF1aWNrVGVtcGxhdGUoZXh0ZW5kLmNsb25lKHNjaGVtYSwgbmV3Q2hpbGRQcm9jZXNzZWQpKVxuXG5cdFx0XHRvdXRwdXQuY2hpbGRyZW4ucHVzaCBuZXdDaGlsZFByb2Nlc3NlZFxuXHRcblx0XG5cdGVsc2UgaWYgSVMub2JqZWN0KG5ld0NoaWxkcmVuKVxuXHRcdG5ld0NoaWxkcmVuID0gZXh0ZW5kLmFsbG93TnVsbC5jbG9uZSBuZXdDaGlsZHJlblxuXHRcdG91dHB1dC5jaGlsZHJlbiA9IGV4dGVuZEJ5UmVmKG5ld0NoaWxkcmVuLCBjdXJyZW50Q2hpbGRyZW4sIGdsb2JhbE9wdHMpXG5cdFx0cmVtYWluaW5nTmV3Q2hpbGRyZW4gPSBuZXdDaGlsZHJlblxuXHRcdFxuXHRcdGZvciByZWYsbmV3Q2hpbGQgb2YgcmVtYWluaW5nTmV3Q2hpbGRyZW5cblx0XHRcdG5ld0NoaWxkUHJvY2Vzc2VkID0gaWYgSVMub2JqZWN0UGxhaW4obmV3Q2hpbGQpIGFuZCBub3QgSVMudGVtcGxhdGUobmV3Q2hpbGQpIHRoZW4gbmV3Q2hpbGQgZWxzZSBwYXJzZVRyZWUobmV3Q2hpbGQpXG5cdFx0XHRvdXRwdXQuY2hpbGRyZW4ucHVzaCBuZXcgUXVpY2tUZW1wbGF0ZSBuZXdDaGlsZFByb2Nlc3NlZFxuXHRcdFx0ZGVsZXRlIHJlbWFpbmluZ05ld0NoaWxkcmVuW3JlZl1cblxuXG5cdHJldHVybiBvdXRwdXRcblxuXG5cblxuZXh0ZW5kQnlSZWYgPSAobmV3Q2hpbGRyZW5SZWZzLCBjdXJyZW50Q2hpbGRyZW4sIGdsb2JhbE9wdHMpLT4gaWYgbm90IGN1cnJlbnRDaGlsZHJlbi5sZW5ndGggdGhlbiBjdXJyZW50Q2hpbGRyZW4gZWxzZVxuXHRvdXRwdXQgPSBbXVxuXHRcblx0Zm9yIGN1cnJlbnRDaGlsZCBpbiBjdXJyZW50Q2hpbGRyZW5cblx0XHRuZXdDaGlsZCA9IG5ld0NoaWxkcmVuUmVmc1tjdXJyZW50Q2hpbGQucmVmXVxuXHRcdGlmIG5ld0NoaWxkXG5cdFx0XHRuZXdDaGlsZFByb2Nlc3NlZCA9IGN1cnJlbnRDaGlsZC5leHRlbmQobmV3Q2hpbGQsIGdsb2JhbE9wdHMpXG5cdFx0XHRkZWxldGUgbmV3Q2hpbGRyZW5SZWZzW2N1cnJlbnRDaGlsZC5yZWZdXG5cdFx0XG5cdFx0ZWxzZSBpZiBuZXdDaGlsZCBpcyBudWxsXG5cdFx0XHRkZWxldGUgbmV3Q2hpbGRyZW5SZWZzW2N1cnJlbnRDaGlsZC5yZWZdXG5cdFx0XHRjb250aW51ZVxuXHRcdFxuXHRcdGVsc2Vcblx0XHRcdG5ld0NoaWxkUHJvY2Vzc2VkID0gc3dpdGNoXG5cdFx0XHRcdHdoZW4gZ2xvYmFsT3B0cyB0aGVuIGN1cnJlbnRDaGlsZC5leHRlbmQobnVsbCwgZ2xvYmFsT3B0cylcblx0XHRcdFx0d2hlbiBPYmplY3Qua2V5cyhuZXdDaGlsZHJlblJlZnMpLmxlbmd0aCB0aGVuIGN1cnJlbnRDaGlsZC5leHRlbmQoKVxuXHRcdFx0XHRlbHNlIGN1cnJlbnRDaGlsZFxuXG5cdFx0bmV3Q2hpbGRQcm9jZXNzZWQuY2hpbGRyZW4gPSBleHRlbmRCeVJlZihuZXdDaGlsZHJlblJlZnMsIG5ld0NoaWxkUHJvY2Vzc2VkLmNoaWxkcmVuKVxuXHRcdG91dHB1dC5wdXNoKG5ld0NoaWxkUHJvY2Vzc2VkKVxuXG5cdHJldHVybiBvdXRwdXRcblxuXG5cblxuIiwicGFyc2VUcmVlID0gKHRyZWUsIHBhcnNlQ2hpbGRyZW4pLT4gc3dpdGNoXG5cdHdoZW4gSVMuYXJyYXkodHJlZSlcblx0XHRvdXRwdXQgPSB7fVxuXG5cdFx0aWYgbm90IElTLnN0cmluZyh0cmVlWzBdKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiI3twYXJzZUVycm9yUHJlZml4fSBzdHJpbmcgZm9yICd0eXBlJywgZ290ICcje1N0cmluZyh0cmVlWzBdKX0nXCJcblx0XHRlbHNlXG5cdFx0XHRvdXRwdXQudHlwZSA9IHRyZWVbMF1cblx0XHRcblx0XHRpZiB0cmVlLmxlbmd0aCA+IDEgYW5kIG5vdCBJUy5vYmplY3QodHJlZVsxXSkgYW5kIHRyZWVbMV0gaXNudCBudWxsXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCIje3BhcnNlRXJyb3JQcmVmaXh9IG9iamVjdCBmb3IgJ29wdGlvbnMnLCBnb3QgJyN7U3RyaW5nKHRyZWVbMV0pfSdcIlxuXHRcdGVsc2Vcblx0XHRcdG91dHB1dC5vcHRpb25zID0gaWYgdHJlZVsxXSB0aGVuIGV4dGVuZC5kZWVwLmNsb25lKHRyZWVbMV0pIGVsc2Ugc2NoZW1hLm9wdGlvbnNcblx0XHRcdG91dHB1dC5yZWYgPSB0cmVlWzFdLmlkIG9yIHRyZWVbMV0ucmVmIGlmIHRyZWVbMV1cblxuXHRcdG91dHB1dC5jaGlsZHJlbiA9IHRyZWUuc2xpY2UoMilcblx0XHRpZiBwYXJzZUNoaWxkcmVuIGlzIGZhbHNlXG5cdFx0XHRvdXRwdXQuY2hpbGRyZW4gPSB0cmVlWzJdIGlmIHRyZWUubGVuZ3RoIGlzIDMgYW5kIElTLm9iamVjdFBsYWluKHRyZWVbMl0pIGFuZCBub3QgSVMudGVtcGxhdGUodHJlZVsyXSlcblx0XHRlbHNlXG5cdFx0XHRvdXRwdXQuY2hpbGRyZW4gPSBvdXRwdXQuY2hpbGRyZW4ubWFwKFF1aWNrRG9tLnRlbXBsYXRlKVxuXHRcdHJldHVybiBvdXRwdXRcblxuXG5cdHdoZW4gSVMuc3RyaW5nKHRyZWUpIG9yIElTLmRvbVRleHQodHJlZSlcblx0XHR0eXBlOid0ZXh0Jywgb3B0aW9uczp7dGV4dDogdHJlZS50ZXh0Q29udGVudCBvciB0cmVlfSwgY2hpbGRyZW46c2NoZW1hLmNoaWxkcmVuXG5cblx0d2hlbiBJUy5kb21FbCh0cmVlKVxuXHRcdHR5cGU6IHRyZWUubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuXHRcdHJlZjogdHJlZS5pZFxuXHRcdG9wdGlvbnM6IGV4dGVuZC5jbG9uZS5rZXlzKGFsbG93ZWRUZW1wbGF0ZU9wdGlvbnMpKHRyZWUpXG5cdFx0Y2hpbGRyZW46IHNjaGVtYS5jaGlsZHJlbi5tYXAuY2FsbCh0cmVlLmNoaWxkTm9kZXMsIFF1aWNrRG9tLnRlbXBsYXRlKVxuXG5cdHdoZW4gSVMucXVpY2tEb21FbCh0cmVlKVxuXHRcdHR5cGU6IHRyZWUudHlwZVxuXHRcdHJlZjogdHJlZS5yZWZcblx0XHRvcHRpb25zOiBleHRlbmQuY2xvbmUuZGVlcC5ub3RLZXlzKCdyZWxhdGVkSW5zdGFuY2UnKSh0cmVlLm9wdGlvbnMpXG5cdFx0Y2hpbGRyZW46IHRyZWUuY2hpbGRyZW4ubWFwKFF1aWNrRG9tLnRlbXBsYXRlKVxuXG5cdHdoZW4gSVMudGVtcGxhdGUodHJlZSlcblx0XHRyZXR1cm4gdHJlZVxuXG5cdGVsc2Vcblx0XHR0aHJvdyBuZXcgRXJyb3IgXCIje3BhcnNlRXJyb3JQcmVmaXh9IChhcnJheSB8fCBzdHJpbmcgfHwgZG9tRWwgfHwgcXVpY2tEb21FbCB8fCB0ZW1wbGF0ZSksIGdvdCAje1N0cmluZyh0cmVlKX1cIlxuXG5cblxuXG5wYXJzZUVycm9yUHJlZml4ID0gJ1RlbXBsYXRlIFBhcnNlIEVycm9yOiBleHBlY3RlZCciLCJzY2hlbWEgPSBcblx0dHlwZTogJ2Rpdidcblx0cmVmOiB1bmRlZmluZWRcblx0b3B0aW9uczoge31cblx0Y2hpbGRyZW46IFtdXG5cblxubWF0Y2hlc1NjaGVtYSA9IChvYmplY3QpLT5cblx0dHlwZW9mIG9iamVjdC50eXBlIGlzbnQgJ3VuZGVmaW5lZCcgb3Jcblx0dHlwZW9mIG9iamVjdC5yZWYgaXNudCAndW5kZWZpbmVkJyBvclxuXHR0eXBlb2Ygb2JqZWN0Lm9wdGlvbnMgaXNudCAndW5kZWZpbmVkJyBvclxuXHR0eXBlb2Ygb2JqZWN0LmNoaWxkcmVuIGlzbnQgJ3VuZGVmaW5lZCdcblxuXG5cbiIsInNob3J0Y3V0cyA9IFtcblx0J2xpbms6YSdcblx0J2FuY2hvcjphJ1xuXHQnYSdcblx0J3RleHQnXG5cdCdkaXYnXG5cdCdzcGFuJ1xuXHQnaDEnXG5cdCdoMidcblx0J2gzJ1xuXHQnaDQnXG5cdCdoNSdcblx0J2g2J1xuXHQnaGVhZGVyJ1xuXHQnZm9vdGVyJ1xuXHQnc2VjdGlvbidcblx0J2J1dHRvbidcblx0J2JyJ1xuXHQndWwnXG5cdCdvbCdcblx0J2xpJ1xuXHQnZmllbGRzZXQnXG5cdCdpbnB1dCdcblx0J3RleHRhcmVhJ1xuXHQnc2VsZWN0J1xuXHQnb3B0aW9uJ1xuXHQnZm9ybSdcblx0J2ZyYW1lJ1xuXHQnaHInXG5cdCdpZnJhbWUnXG5cdCdpbWcnXG5cdCdwaWN0dXJlJ1xuXHQnbWFpbidcblx0J25hdidcblx0J21ldGEnXG5cdCdvYmplY3QnXG5cdCdwcmUnXG5cdCdzdHlsZSdcblx0J3RhYmxlJ1xuXHQndGJvZHknXG5cdCd0aCdcblx0J3RyJ1xuXHQndGQnXG5cdCd0Zm9vdCdcblx0IyAndGVtcGxhdGUnXG5cdCd2aWRlbydcbl1cblxuXG5mb3Igc2hvcnRjdXQgaW4gc2hvcnRjdXRzIHRoZW4gZG8gKHNob3J0Y3V0KS0+XG5cdHByb3AgPSB0eXBlID0gc2hvcnRjdXRcblx0aWYgaGVscGVycy5pbmNsdWRlcyhzaG9ydGN1dCwgJzonKVxuXHRcdHNwbGl0ID0gc2hvcnRjdXQuc3BsaXQoJzonKVxuXHRcdHByb3AgPSBzcGxpdFswXVxuXHRcdHR5cGUgPSBzcGxpdFsxXVxuXG5cdFF1aWNrRG9tW3Byb3BdID0gKCktPiBRdWlja0RvbSh0eXBlLCBhcmd1bWVudHMuLi4pXG4iLCJ7XG4gIFwiX2Zyb21cIjogXCJxdWlja2RvbUBeMS4wLjcyXCIsXG4gIFwiX2lkXCI6IFwicXVpY2tkb21AMS4wLjgxXCIsXG4gIFwiX2luQnVuZGxlXCI6IGZhbHNlLFxuICBcIl9pbnRlZ3JpdHlcIjogXCJzaGE1MTItb0Npc1BESEdmNmxDVWZnbDhUZ29oVVEyblJkUFVjZmhYd3lhbmoxUXhtcGtMRHdEYmgrSUZCZ293U1BsYWhvV2pkK1BZVURjbXA5U0ZOZi9qQjdwS0E9PVwiLFxuICBcIl9sb2NhdGlvblwiOiBcIi9xdWlja2RvbVwiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwicmFuZ2VcIixcbiAgICBcInJlZ2lzdHJ5XCI6IHRydWUsXG4gICAgXCJyYXdcIjogXCJxdWlja2RvbUBeMS4wLjcyXCIsXG4gICAgXCJuYW1lXCI6IFwicXVpY2tkb21cIixcbiAgICBcImVzY2FwZWROYW1lXCI6IFwicXVpY2tkb21cIixcbiAgICBcInJhd1NwZWNcIjogXCJeMS4wLjcyXCIsXG4gICAgXCJzYXZlU3BlY1wiOiBudWxsLFxuICAgIFwiZmV0Y2hTcGVjXCI6IFwiXjEuMC43MlwiXG4gIH0sXG4gIFwiX3JlcXVpcmVkQnlcIjogW1xuICAgIFwiI1VTRVJcIixcbiAgICBcIi9cIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3F1aWNrZG9tLy0vcXVpY2tkb20tMS4wLjgxLnRnelwiLFxuICBcIl9zaGFzdW1cIjogXCI5YjYwY2M3ZjMxMjViNjdhN2RiZWVhYWQ5OTk4OTRkMzRmNjZmOWM1XCIsXG4gIFwiX3NwZWNcIjogXCJxdWlja2RvbUBeMS4wLjcyXCIsXG4gIFwiX3doZXJlXCI6IFwiL1VzZXJzL2RhbmllbGthbGVuL3NhbmRib3gvcXVpY2tmaWVsZFwiLFxuICBcImF1dGhvclwiOiB7XG4gICAgXCJuYW1lXCI6IFwiZGFuaWVsa2FsZW5cIlxuICB9LFxuICBcImJyb3dzZXJcIjoge1xuICAgIFwiLi9kZWJ1Z1wiOiBcImRpc3QvcXVpY2tkb20uZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9xdWlja2RvbS5qc1wiOiBcInNyYy9pbmRleC5jb2ZmZWVcIlxuICB9LFxuICBcImJyb3dzZXJpZnlcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwic2ltcGx5aW1wb3J0L2NvbXBhdFwiXG4gICAgXVxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZG9tL2lzc3Vlc1wiXG4gIH0sXG4gIFwiYnVuZGxlRGVwZW5kZW5jaWVzXCI6IGZhbHNlLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAZGFuaWVsa2FsZW4vaXNcIjogXCJeMi4wLjBcIixcbiAgICBcInF1aWNrY3NzXCI6IFwiXjEuMy40XCIsXG4gICAgXCJzbWFydC1leHRlbmRcIjogXCJeMS43LjNcIlxuICB9LFxuICBcImRlcHJlY2F0ZWRcIjogZmFsc2UsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJGYXN0ICYgbGlnaHQgRE9NIGVsZW1lbnQgbWFuYWdlbWVudCBzdXBwb3J0aW5nIGpxdWVyeS1saWtlIG1ldGhvZHMsIHRlbXBsYXRlcywgJiBzdGF0ZS1iYXNlZCBzdHlsaW5nXCIsXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjaGFsa1wiOiBcIl4yLjAuMVwiLFxuICAgIFwiY29mZmVlLXNjcmlwdFwiOiBcIl4xLjEyLjZcIixcbiAgICBcImV4ZWNhXCI6IFwiXjAuNy4wXCIsXG4gICAgXCJmcy1qZXRwYWNrXCI6IFwiXjAuMTMuM1wiLFxuICAgIFwicHJvbWlzZS1icmVha1wiOiBcIl4wLjEuMlwiLFxuICAgIFwic2VtdmVyXCI6IFwiXjUuMy4wXCJcbiAgfSxcbiAgXCJkaXJlY3Rvcmllc1wiOiB7XG4gICAgXCJ0ZXN0XCI6IFwidGVzdFwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tkb20jcmVhZG1lXCIsXG4gIFwibGljZW5zZVwiOiBcIklTQ1wiLFxuICBcIm1haW5cIjogXCJkaXN0L3F1aWNrZG9tLmpzXCIsXG4gIFwibmFtZVwiOiBcInF1aWNrZG9tXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZG9tLmdpdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcImNha2UgLWQgYnVpbGQgJiYgY2FrZSBidWlsZCAmJiBjYWtlIG1lYXN1cmUgJiYgY3AgLXIgYnVpbGQvKiBkaXN0L1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJjYWtlIGluc3RhbGw6Y292ZXJhZ2U7IG5wbSBydW4gY292ZXJhZ2U6cnVuICYmIG5wbSBydW4gY292ZXJhZ2U6YmFkZ2VcIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnJ1blwiOiBcImNvdmVyYWdlPXRydWUgbnBtIHJ1biB0ZXN0OmVsZWN0cm9uXCIsXG4gICAgXCJjb3ZlcmFnZTpzaG93XCI6IFwib3BlbiBjb3ZlcmFnZS9sY292LXJlcG9ydC9pbmRleC5odG1sXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJwb3N0dmVyc2lvblwiOiBcIm5wbSBydW4gYnVpbGQgJiYgZ2l0IGFkZCAuICYmIGdpdCBjb21taXQgLWEgLW0gJ1tCdWlsZF0nXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcIm5wbSBydW4gdGVzdDp0cmF2aXNcIixcbiAgICBcInRlc3RcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OmJyb3dzZXJcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRWxlY3Ryb24gLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpjaHJvbWVcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIENocm9tZSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmZpcmVmb3hcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRmlyZWZveCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpsb2NhbFwiOiBcIm9wZW4gdGVzdC90ZXN0cnVubmVyLmh0bWxcIixcbiAgICBcInRlc3Q6bWluaWZpZWRcIjogXCJtaW5pZmllZD0xIG5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6c2FmYXJpXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBTYWZhcmkgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYXVjZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIHNhdWNlPTEga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDp0cmF2aXNcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcIndhdGNoXCI6IFwiY2FrZSAtZCB3YXRjaFwiXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjAuODFcIlxufVxuIiwiSVMgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9pcydcbklTID0gSVMuY3JlYXRlKCduYXRpdmVzJywnZG9tJylcbklTLmxvYWRcblx0ZmllbGQ6ICh0YXJnZXQpLT4gdGFyZ2V0IGFuZCB0YXJnZXQgaW5zdGFuY2VvZiByZXF1aXJlKCcuL2ZpZWxkJylcblx0cmVnZXg6ICh0YXJnZXQpLT4gdGFyZ2V0IGluc3RhbmNlb2YgUmVnRXhwXG5cdG9iamVjdGFibGU6ICh0YXJnZXQpLT4gSVMub2JqZWN0KHRhcmdldCkgb3IgSVMuZnVuY3Rpb24odGFyZ2V0KVxuXG5tb2R1bGUuZXhwb3J0cyA9IElTIiwiZXh0ZW5kID0gcmVxdWlyZSAnLi9leHRlbmQnXG5cbm5vcm1hbGl6ZUtleXMgPSAoa2V5cyktPiBpZiBrZXlzXG5cdG91dHB1dCA9IHt9XG5cdGlmIHR5cGVvZiBrZXlzIGlzbnQgJ29iamVjdCdcblx0XHRvdXRwdXRba2V5c10gPSB0cnVlXG5cdGVsc2Vcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoa2V5cykgaWYgbm90IEFycmF5LmlzQXJyYXkoa2V5cylcblx0XHRvdXRwdXRba2V5XSA9IHRydWUgZm9yIGtleSBpbiBrZXlzXG5cblx0cmV0dXJuIG91dHB1dFxuXG5cbm5ld0J1aWxkZXIgPSAoaXNCYXNlKS0+XG5cdGJ1aWxkZXIgPSAodGFyZ2V0KS0+XG5cdFx0RVhQQU5EX0FSR1VNRU5UUyhzb3VyY2VzKVxuXHRcdGlmIGJ1aWxkZXIub3B0aW9ucy50YXJnZXRcblx0XHRcdHRoZVRhcmdldCA9IGJ1aWxkZXIub3B0aW9ucy50YXJnZXRcblx0XHRlbHNlXG5cdFx0XHR0aGVUYXJnZXQgPSB0YXJnZXRcblx0XHRcdHNvdXJjZXMuc2hpZnQoKVxuXHRcdFxuXHRcdGV4dGVuZChidWlsZGVyLm9wdGlvbnMsIHRoZVRhcmdldCwgc291cmNlcylcblx0XG5cdGJ1aWxkZXIuaXNCYXNlID0gdHJ1ZSBpZiBpc0Jhc2Vcblx0YnVpbGRlci5vcHRpb25zID0ge31cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoYnVpbGRlciwgbW9kaWZpZXJzKVxuXHRyZXR1cm4gYnVpbGRlclxuXG5cbm1vZGlmaWVycyA9IFxuXHQnZGVlcCc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5kZWVwID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J293bic6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5vd24gPSB0cnVlXG5cdFx0cmV0dXJuIF9cblxuXHQnYWxsb3dOdWxsJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLmFsbG93TnVsbCA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdudWxsRGVsZXRlcyc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5udWxsRGVsZXRlcyA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdjb25jYXQnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMuY29uY2F0ID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J2Nsb25lJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLnRhcmdldCA9IHt9XG5cdFx0cmV0dXJuIF9cblxuXHQnbm90RGVlcCc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLm5vdERlZXAgPSBub3JtYWxpemVLZXlzKGtleXMpXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cdCdkZWVwT25seSc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLmRlZXBPbmx5ID0gbm9ybWFsaXplS2V5cyhrZXlzKVx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXHQna2V5cyc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLmtleXMgPSBub3JtYWxpemVLZXlzKGtleXMpXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cdCdub3RLZXlzJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuIChrZXlzKS0+XG5cdFx0XHRfLm9wdGlvbnMubm90S2V5cyA9IG5vcm1hbGl6ZUtleXMoa2V5cylcdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblx0J3RyYW5zZm9ybSc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAodHJhbnNmb3JtKS0+XG5cdFx0XHRpZiB0eXBlb2YgdHJhbnNmb3JtIGlzICdmdW5jdGlvbidcblx0XHRcdFx0Xy5vcHRpb25zLmdsb2JhbFRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuXHRcdFx0ZWxzZSBpZiB0cmFuc2Zvcm0gYW5kIHR5cGVvZiB0cmFuc2Zvcm0gaXMgJ29iamVjdCdcblx0XHRcdFx0Xy5vcHRpb25zLnRyYW5zZm9ybXMgPSB0cmFuc2Zvcm1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXG5cdCdmaWx0ZXInOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKGZpbHRlciktPlxuXHRcdFx0aWYgdHlwZW9mIGZpbHRlciBpcyAnZnVuY3Rpb24nXG5cdFx0XHRcdF8ub3B0aW9ucy5nbG9iYWxGaWx0ZXIgPSBmaWx0ZXJcblx0XHRcdGVsc2UgaWYgZmlsdGVyIGFuZCB0eXBlb2YgZmlsdGVyIGlzICdvYmplY3QnXG5cdFx0XHRcdF8ub3B0aW9ucy5maWx0ZXJzID0gZmlsdGVyXG5cdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBuZXdCdWlsZGVyKHRydWUpXG5leHBvcnRzLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nIiwie1xuICBcIl9hcmdzXCI6IFtcbiAgICBbXG4gICAgICBcInNtYXJ0LWV4dGVuZEAxLjcuM1wiLFxuICAgICAgXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCJcbiAgICBdXG4gIF0sXG4gIFwiX2Zyb21cIjogXCJzbWFydC1leHRlbmRAMS43LjNcIixcbiAgXCJfaWRcIjogXCJzbWFydC1leHRlbmRAMS43LjNcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1QVkVFVllERHp5eEtBMEdORkxjV1k2b0pTa1FLZGMxdzcxOGVRcEVIY051VFNXWXhESzM1R3poc0doTWtVVThsQklnU0VEYnQ1eDVwNDZwUnozQXViQT09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3NtYXJ0LWV4dGVuZFwiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwidmVyc2lvblwiLFxuICAgIFwicmVnaXN0cnlcIjogdHJ1ZSxcbiAgICBcInJhd1wiOiBcInNtYXJ0LWV4dGVuZEAxLjcuM1wiLFxuICAgIFwibmFtZVwiOiBcInNtYXJ0LWV4dGVuZFwiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJzbWFydC1leHRlbmRcIixcbiAgICBcInJhd1NwZWNcIjogXCIxLjcuM1wiLFxuICAgIFwic2F2ZVNwZWNcIjogbnVsbCxcbiAgICBcImZldGNoU3BlY1wiOiBcIjEuNy4zXCJcbiAgfSxcbiAgXCJfcmVxdWlyZWRCeVwiOiBbXG4gICAgXCIvXCIsXG4gICAgXCIvcXVpY2tkb21cIixcbiAgICBcIi9zaW1wbHl3YXRjaFwiXG4gIF0sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvc21hcnQtZXh0ZW5kLy0vc21hcnQtZXh0ZW5kLTEuNy4zLnRnelwiLFxuICBcIl9zcGVjXCI6IFwiMS43LjNcIixcbiAgXCJfd2hlcmVcIjogXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJkYW5pZWxrYWxlblwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9zbWFydC1leHRlbmQuZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9zbWFydC1leHRlbmQuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zbWFydC1leHRlbmQvaXNzdWVzXCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiZmFsYWZlbFwiOiBcIl4yLjEuMFwiXG4gIH0sXG4gIFwiZGVzY3JpcHRpb25cIjogXCJNZXJnZS9leHRlbmQgb2JqZWN0cyAoc2hhbGxvdy9kZWVwKSB3aXRoIGdsb2JhbC9pbmRpdmlkdWFsIGZpbHRlcnMgYW5kIG1vcmUgZmVhdHVyZXNcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmFkZ2UtZ2VuXCI6IFwiXjEuMC4yXCIsXG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjQuN1wiLFxuICAgIFwiY2hhaVwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY29mZmVlLXJlZ2lzdGVyXCI6IFwiXjAuMS4wXCIsXG4gICAgXCJjb2ZmZWVpZnktY2FjaGVkXCI6IFwiXjIuMS4xXCIsXG4gICAgXCJleHRlbmRcIjogXCJeMy4wLjFcIixcbiAgICBcImdvb2dsZS1jbG9zdXJlLWNvbXBpbGVyLWpzXCI6IFwiXjIwMTcwNjI2LjAuMFwiLFxuICAgIFwibW9jaGFcIjogXCJeMy4yLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuMC1zMjFcIixcbiAgICBcInNpbXBseXdhdGNoXCI6IFwiXjMuMC4wLWwyXCIsXG4gICAgXCJ1Z2xpZnktanNcIjogXCJeMy4wLjI0XCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zbWFydC1leHRlbmQjcmVhZG1lXCIsXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwiZXh0ZW5kXCIsXG4gICAgXCJjbG9uZVwiLFxuICAgIFwiZmlsdGVyXCIsXG4gICAgXCJzZWxlY3RpdmVcIixcbiAgICBcIm1lcmdlXCIsXG4gICAgXCJhc3NpZ25cIixcbiAgICBcInByb3BlcnRpZXNcIlxuICBdLFxuICBcImxpY2Vuc2VcIjogXCJJU0NcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9zbWFydC1leHRlbmQuanNcIixcbiAgXCJtb2NoYV9vcHRzXCI6IFwiLXUgdGRkIC0tY29tcGlsZXJzIGNvZmZlZTpjb2ZmZWUtcmVnaXN0ZXIgLS1zbG93IDEwMDAgLS10aW1lb3V0IDUwMDBcIixcbiAgXCJuYW1lXCI6IFwic21hcnQtZXh0ZW5kXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3NtYXJ0LWV4dGVuZC5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJta2RpciAtcCBkaXN0LzsgbnBtIHJ1biBidWlsZDpkZWJ1ZyAmJiBucG0gcnVuIGJ1aWxkOnJlbGVhc2VcIixcbiAgICBcImJ1aWxkOmRlYnVnXCI6IFwic2ltcGx5aW1wb3J0IGJ1bmRsZSBzcmMvaW5kZXguY29mZmVlIC1kIC0tdGFyZ2V0IG5vZGUgLS11bWQgc21hcnQtZXh0ZW5kID4gZGlzdC9zbWFydC1leHRlbmQuZGVidWcuanNcIixcbiAgICBcImJ1aWxkOnJlbGVhc2VcIjogXCJzaW1wbHlpbXBvcnQgYnVuZGxlIHNyYy9pbmRleC5jb2ZmZWUgLS10YXJnZXQgbm9kZSAtLXVtZCBzbWFydC1leHRlbmQgPiBkaXN0L3NtYXJ0LWV4dGVuZC5qc1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJucG0gcnVuIGNvdmVyYWdlOnJ1biAmJiBucG0gcnVuIGNvdmVyYWdlOmJhZGdlXCIsXG4gICAgXCJjb3ZlcmFnZTpiYWRnZVwiOiBcImJhZGdlLWdlbiAtZCAuY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiZm9yQ292ZXJhZ2U9dHJ1ZSBpc3RhbmJ1bCBjb3ZlciAtLWRpciBjb3ZlcmFnZSBub2RlX21vZHVsZXMvbW9jaGEvYmluL19tb2NoYSAtLSAkbnBtX3BhY2thZ2VfbW9jaGFfb3B0c1wiLFxuICAgIFwicG9zdHB1Ymxpc2hcIjogXCJnaXQgcHVzaFwiLFxuICAgIFwicG9zdHZlcnNpb25cIjogXCJucG0gcnVuIGJ1aWxkICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJDST0xIG5wbSBydW4gdGVzdFwiLFxuICAgIFwidGVzdFwiOiBcIm1vY2hhICRucG1fcGFja2FnZV9tb2NoYV9vcHRzXCIsXG4gICAgXCJ3YXRjaFwiOiBcInNpbXBseXdhdGNoIC1nICdzcmMvKicgLXggJ25wbSBydW4gYnVpbGQ6ZGVidWcgLXMnXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiY29mZmVlaWZ5LWNhY2hlZFwiLFxuICAgICAgXCIuLy5jb25maWcvdHJhbnNmb3Jtcy9tYWNyb3NcIlxuICAgIF0sXG4gICAgXCJmaW5hbFRyYW5zZm9ybVwiOiBbXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc3VwZXJcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1yZW5hbWVcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zaW1wbGVcIlxuICAgIF1cbiAgfSxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS43LjNcIlxufVxuIiwiQ1NTID0gaW1wb3J0ICdxdWlja2Nzcydcbm1vZHVsZS5leHBvcnRzID0gKCktPlxuICAgIENTUy5hbmltYXRpb24gJ2NoZWNrbWFya0FuaW1hdGVTdWNjZXNzVGlwJyxcbiAgICAgICAgJzAlLCA1NCUnOiAge3dpZHRoOjAsIGxlZnQ6MCwgdG9wOjN9XG4gICAgICAgICc3MCUnOiAgICAgIHt3aWR0aDoxNCwgbGVmdDotMiwgdG9wOjh9XG4gICAgICAgICc4NCUnOiAgICAgIHt3aWR0aDo1LCBsZWZ0OjUsIHRvcDoxMH1cbiAgICAgICAgJzEwMCUnOiAgICAge3dpZHRoOjgsIGxlZnQ6MywgdG9wOjEwfVxuXG5cbiAgICBDU1MuYW5pbWF0aW9uICdjaGVja21hcmtBbmltYXRlU3VjY2Vzc0xvbmcnLFxuICAgICAgICAnMCUsIDY1JSc6ICB7d2lkdGg6MCwgcmlnaHQ6MTIsIHRvcDoxMn1cbiAgICAgICAgJzg0JSc6ICAgICAge3dpZHRoOjE0LCByaWdodDowLCB0b3A6N31cbiAgICAgICAgJzEwMCUnOiAgICAge3dpZHRoOjEyLCByaWdodDoyLCB0b3A6OH1cblxuXG4gICAgQ1NTLmFuaW1hdGlvbiAnY2hlY2ttYXJrQW5pbWF0ZUVycm9yJyxcbiAgICAgICAgJzAlLCA2NSUnOiAgdHJhbnNmb3JtOiAnc2NhbGUoMC40KScsIG9wYWNpdHk6IDBcbiAgICAgICAgJzg0JSc6ICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4xNSknXG4gICAgICAgICcxMDAlJzogICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJ1xuXG5cbiAgICBDU1MuYW5pbWF0aW9uICdjaGVja21hcmtSb3RhdGVQbGFjZWhvbGRlcicsXG4gICAgICAgICcwJSwgNSUnOiAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuICAgICAgICAnMTIlLCAxMDAlJzp0cmFuc2Zvcm06ICdyb3RhdGUoLTQwNWRlZyknXG5cblxuICAgIENTUy5hbmltYXRpb24gJ2ZpZWxkRXJyb3JTaGFrZScsXG4gICAgICAgICcwJSwgNTAlJzogIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwcHgpJ1xuICAgICAgICAnMjUlLCA3NSUnOiB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDEwcHgpJ1xuICAgICAgICAnMTAwJSc6ICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCknXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9ICgpLT5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBbJ19nZXRWYWx1ZScsICdfc2V0VmFsdWUnLCAnX3ZhbGlkYXRlJ10iLCJoZWxwZXJzID0gaW1wb3J0ICcuLi9oZWxwZXJzJ1xuSVMgPSBpbXBvcnQgJy4uL2NoZWNrcydcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuZmFzdGRvbSA9IGltcG9ydCAnZmFzdGRvbSdcblNpbXBseUJpbmQgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kJ1xuQ29uZGl0aW9uID0gaW1wb3J0ICcuLi9jb21wb25lbnRzL2NvbmRpdGlvbidcbmN1cnJlbnRJRCA9IDBcblxuY2xhc3MgRmllbGRcblx0QGluc3RhbmNlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0QHNoYWxsb3dTZXR0aW5ncyA9IFsndGVtcGxhdGVzJywgJ2ZpZWxkSW5zdGFuY2VzJywgJ3ZhbHVlJywgJ2RlZmF1bHRWYWx1ZSddXG5cdEB0cmFuc2Zvcm1TZXR0aW5ncyA9IGltcG9ydCAnLi90cmFuc2Zvcm1TZXR0aW5ncydcblx0Y29yZVZhbHVlUHJvcDogJ192YWx1ZSdcblx0Z2xvYmFsRGVmYXVsdHM6IGltcG9ydCAnLi9nbG9iYWxEZWZhdWx0cydcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyBGaWVsZDo6LFxuXHRcdCdyZW1vdmVMaXN0ZW5lcic6IGdldDogKCktPiBAb2ZmXG5cdFx0J2Vscyc6IGdldDogKCktPiBAZWwuY2hpbGRcblx0XHQndmFsdWVSYXcnOiBnZXQ6ICgpLT4gQF92YWx1ZVxuXHRcdCd2YWx1ZSc6XG5cdFx0XHRnZXQ6ICgpLT4gaWYgQHNldHRpbmdzLmdldHRlciB0aGVuIEBzZXR0aW5ncy5nZXR0ZXIoQF9nZXRWYWx1ZSgpKSBlbHNlIEBfZ2V0VmFsdWUoKVxuXHRcdFx0c2V0OiAodmFsdWUpLT4gQF9zZXRWYWx1ZShpZiBAc2V0dGluZ3Muc2V0dGVyIHRoZW4gQHNldHRpbmdzLnNldHRlcih2YWx1ZSkgZWxzZSB2YWx1ZSlcblx0XG5cdGNvbnN0cnVjdG9yOiAoc2V0dGluZ3MsIEBidWlsZGVyLCBzZXR0aW5nT3ZlcnJpZGVzLCB0ZW1wbGF0ZU92ZXJyaWRlcyktPlxuXHRcdGlmIHNldHRpbmdPdmVycmlkZXNcblx0XHRcdEBnbG9iYWxEZWZhdWx0cyA9IHNldHRpbmdPdmVycmlkZXMuZ2xvYmFsRGVmYXVsdHMgaWYgc2V0dGluZ092ZXJyaWRlcy5nbG9iYWxEZWZhdWx0c1xuXHRcdFx0QGRlZmF1bHRzID0gc2V0dGluZ092ZXJyaWRlc1tzZXR0aW5ncy50eXBlXSBpZiBzZXR0aW5nT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdXG5cdFx0aWYgdGVtcGxhdGVPdmVycmlkZXMgYW5kIHRlbXBsYXRlT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdXG5cdFx0XHRAdGVtcGxhdGVzID0gdGVtcGxhdGVPdmVycmlkZXNbc2V0dGluZ3MudHlwZV1cblx0XHRcdEB0ZW1wbGF0ZSA9IHRlbXBsYXRlT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdLmRlZmF1bHRcblxuXHRcdHNoYWxsb3dTZXR0aW5ncyA9IGlmIEBzaGFsbG93U2V0dGluZ3MgdGhlbiBGaWVsZC5zaGFsbG93U2V0dGluZ3MuY29uY2F0KEBzaGFsbG93U2V0dGluZ3MpIGVsc2UgRmllbGQuc2hhbGxvd1NldHRpbmdzXG5cdFx0dHJhbnNmb3JtU2V0dGluZ3MgPSBpZiBAdHJhbnNmb3JtU2V0dGluZ3MgdGhlbiBGaWVsZC50cmFuc2Zvcm1TZXR0aW5ncy5jb25jYXQoQHRyYW5zZm9ybVNldHRpbmdzKSBlbHNlIEZpZWxkLnRyYW5zZm9ybVNldHRpbmdzXG5cblx0XHRAc2V0dGluZ3MgPSBleHRlbmQuZGVlcC5jbG9uZS5ub3REZWVwKHNoYWxsb3dTZXR0aW5ncykudHJhbnNmb3JtKHRyYW5zZm9ybVNldHRpbmdzKShAZ2xvYmFsRGVmYXVsdHMsIEBkZWZhdWx0cywgc2V0dGluZ3MpXG5cdFx0QElEID0gQHNldHRpbmdzLklEIG9yIGN1cnJlbnRJRCsrKycnXG5cdFx0QHR5cGUgPSBzZXR0aW5ncy50eXBlXG5cdFx0QG5hbWUgPSBzZXR0aW5ncy5uYW1lXG5cdFx0QGFsbEZpZWxkcyA9IEBzZXR0aW5ncy5maWVsZEluc3RhbmNlcyBvciBGaWVsZC5pbnN0YW5jZXNcblx0XHRAX3ZhbHVlID0gbnVsbFxuXHRcdEBfZXZlbnRDYWxsYmFja3MgPSB7fVxuXHRcdEBzdGF0ZSA9XG5cdFx0XHR2YWxpZDogdHJ1ZVxuXHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0Zm9jdXNlZDogZmFsc2Vcblx0XHRcdGhvdmVyZWQ6IGZhbHNlXG5cdFx0XHRmaWxsZWQ6IGZhbHNlXG5cdFx0XHRpbnRlcmFjdGVkOiBmYWxzZVxuXHRcdFx0aXNNb2JpbGU6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogQHNldHRpbmdzLmRpc2FibGVkXG5cdFx0XHRtYXJnaW46IEBzZXR0aW5ncy5tYXJnaW5cblx0XHRcdHBhZGRpbmc6IEBzZXR0aW5ncy5wYWRkaW5nXG5cdFx0XHR3aWR0aDogQHNldHRpbmdzLndpZHRoXG5cdFx0XHRzaG93TGFiZWw6IEBzZXR0aW5ncy5sYWJlbFxuXHRcdFx0bGFiZWw6IEBzZXR0aW5ncy5sYWJlbFxuXHRcdFx0c2hvd0hlbHA6IEBzZXR0aW5ncy5oZWxwXG5cdFx0XHRoZWxwOiBAc2V0dGluZ3MuaGVscFxuXHRcdFx0c2hvd0Vycm9yOiBmYWxzZVxuXHRcdFx0ZXJyb3I6IEBzZXR0aW5ncy5lcnJvclxuXG5cdFx0aWYgSVMuZGVmaW5lZChAc2V0dGluZ3MucGxhY2Vob2xkZXIpXG5cdFx0XHRAc3RhdGUucGxhY2Vob2xkZXIgPSBAc2V0dGluZ3MucGxhY2Vob2xkZXJcblxuXHRcdGlmIElTLm51bWJlcihAc2V0dGluZ3Mud2lkdGgpIGFuZCBAc2V0dGluZ3Mud2lkdGggPD0gMVxuXHRcdFx0QHN0YXRlLndpZHRoID0gXCIje0BzZXR0aW5ncy53aWR0aCoxMDB9JVwiXG5cblx0XHRpZiBAc2V0dGluZ3MuY29uZGl0aW9ucz8ubGVuZ3RoXG5cdFx0XHRAc3RhdGUudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRDb25kaXRpb24uaW5pdChALCBAc2V0dGluZ3MuY29uZGl0aW9ucylcblxuXHRcdGNvbnNvbGU/Lndhcm4oXCJEdXBsaWNhdGUgZmllbGQgSURzIGZvdW5kOiAnI3tASUR9J1wiKSBpZiBAYWxsRmllbGRzW0BJRF1cblx0XHRAYWxsRmllbGRzW0BJRF0gPSBAXG5cblxuXHRfY29uc3RydWN0b3JFbmQ6ICgpLT5cblx0XHRAZWwuY2hpbGRmIy5maWVsZC5vbiAnaW5zZXJ0ZWQnLCAoKT0+IEBlbWl0KCdpbnNlcnRlZCcpXG5cdFx0QGVsLnJhdy5pZCA9IEBJRCBpZiBAc2V0dGluZ3MuSURcblxuXHRcdEBzZXR0aW5ncy5kZWZhdWx0VmFsdWUgPz0gQHNldHRpbmdzLnZhbHVlIGlmIEBzZXR0aW5ncy52YWx1ZT9cblx0XHRpZiBAc2V0dGluZ3MuZGVmYXVsdFZhbHVlP1xuXHRcdFx0QHZhbHVlID0gaWYgQHNldHRpbmdzLm11bHRpcGxlIHRoZW4gW10uY29uY2F0KEBzZXR0aW5ncy5kZWZhdWx0VmFsdWUpIGVsc2UgQHNldHRpbmdzLmRlZmF1bHRWYWx1ZVxuXG5cdFx0U2ltcGx5QmluZCgnc2hvd0Vycm9yJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ2hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudHJhbnNmb3JtIChzaG93KT0+XG5cdFx0XHRcdGlmIHNob3cgYW5kIEBzdGF0ZS5lcnJvciBhbmQgSVMuc3RyaW5nKEBzdGF0ZS5lcnJvcilcblx0XHRcdFx0XHRAc3RhdGUuZXJyb3Jcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBzZXR0aW5ncy5oZWxwIG9yIEBzdGF0ZS5oZWxwXG5cblx0XHRTaW1wbHlCaW5kKCdlcnJvcicsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCdoZWxwJykub2YoQHN0YXRlKVxuXHRcdFx0LmNvbmRpdGlvbiAoZXJyb3IpPT4gZXJyb3IgYW5kIEBzdGF0ZS5zaG93RXJyb3JcblxuXHRcdFNpbXBseUJpbmQoJ2hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ2h0bWwnKS5vZihAZWwuY2hpbGQuaGVscClcblx0XHRcdC5hbmQudG8oJ3Nob3dIZWxwJykub2YoQHN0YXRlKVxuXG5cdFx0U2ltcGx5QmluZCgnbGFiZWwnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ3RleHQnKS5vZihAZWwuY2hpbGQubGFiZWwpXG5cdFx0XHQuYW5kLnRvKCdzaG93TGFiZWwnKS5vZihAc3RhdGUpXG5cblx0XHRTaW1wbHlCaW5kKCdtYXJnaW4nKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gQGVsLnN0eWxlLmJpbmQoQGVsLCAnbWFyZ2luJylcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdwYWRkaW5nJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvIEBlbC5zdHlsZS5iaW5kKEBlbCwgJ3BhZGRpbmcnKVxuXG5cdFx0U2ltcGx5QmluZCgnc2hvd0hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gKHNob3csIHByZXZTaG93KT0+IGlmIEBzZXR0aW5ncy5tYWtlUm9vbUZvckhlbHBcblx0XHRcdFx0Y2hhbmdlQW1vdW50ID0gaWYgISFzaG93IGlzICEhcHJldlNob3cgdGhlbiAwIGVsc2UgaWYgc2hvdyB0aGVuIDI1IGVsc2UgaWYgcHJldlNob3cgdGhlbiAtMjVcblx0XHRcdFx0QHN0YXRlLm1hcmdpbiA9IGhlbHBlcnMudXBkYXRlU2hvcnRoYW5kVmFsdWUoQHN0YXRlLm1hcmdpbiwgJ2JvdHRvbScsIGNoYW5nZUFtb3VudCkgaWYgY2hhbmdlQW1vdW50XG5cblx0XHRTaW1wbHlCaW5kKCdmb2N1c2VkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAc3RhdGUpLnRvIChmb2N1c2VkKT0+XG5cdFx0XHRAZW1pdChpZiBmb2N1c2VkIHRoZW4gJ2ZvY3VzJyBlbHNlICdibHVyJylcblxuXHRcdGlmIEBzZXR0aW5ncy5tb2JpbGVXaWR0aFxuXHRcdFx0U2ltcGx5QmluZCAoKT0+XG5cdFx0XHRcdGZhc3Rkb20ubWVhc3VyZSAoKT0+IEBzdGF0ZS5pc01vYmlsZSA9IHdpbmRvdy5pbm5lcldpZHRoIDw9IEBzZXR0aW5ncy5tb2JpbGVUaHJlc2hvbGRcblx0XHRcdC51cGRhdGVPbignZXZlbnQ6cmVzaXplJykub2Yod2luZG93KVxuXG5cdFx0aWYgSVMub2JqZWN0KEBzZXR0aW5ncy5ldmVudHMpXG5cdFx0XHRAb24odGFyZ2V0LGhhbmRsZXIpIGZvciB0YXJnZXQsaGFuZGxlciBvZiBAc2V0dGluZ3MuZXZlbnRzXG5cblx0XHRAZW1pdCAnY3JlYXRlZCcsIEBcblx0XHRyZXR1cm4gQGVsLnJhdy5fcXVpY2tGaWVsZCA9IEBcblxuXG5cdF9mb3JtYXRXaWR0aDogKHdpZHRoKS0+XG5cdFx0d2lkdGggPSBpZiBAc3RhdGUuaXNNb2JpbGUgdGhlbiAoQHNldHRpbmdzLm1vYmlsZVdpZHRoIG9yIHdpZHRoKSBlbHNlIHdpZHRoXG5cdFx0aWYgQHNldHRpbmdzLmRpc3RhbmNlIGFuZCB3aWR0aCBpc250ICcxMDAlJ1xuXHRcdFx0d2lkdGggPSBcImNhbGMoI3t3aWR0aH0gLSAje0BzZXR0aW5ncy5kaXN0YW5jZX1weClcIlxuXHRcdHJldHVybiB3aWR0aFxuXG5cblxuXG5cblxuXG5cblx0YXBwZW5kVG86ICh0YXJnZXQpLT5cblx0XHRAZWwuYXBwZW5kVG8odGFyZ2V0KTsgXHRcdHJldHVybiBAXG5cblx0cHJlcGVuZFRvOiAodGFyZ2V0KS0+XG5cdFx0QGVsLnByZXBlbmRUbyh0YXJnZXQpOyBcdFx0cmV0dXJuIEBcblxuXHRpbnNlcnRBZnRlcjogKHRhcmdldCktPlxuXHRcdEBlbC5pbnNlcnRBZnRlcih0YXJnZXQpOyBcdHJldHVybiBAXG5cblx0aW5zZXJ0QmVmb3JlOiAodGFyZ2V0KS0+XG5cdFx0QGVsLmluc2VydEJlZm9yZSh0YXJnZXQpOyBcdHJldHVybiBAXG5cblx0ZGV0YWNoOiAodGFyZ2V0KS0+XG5cdFx0QGVsLmRldGFjaCh0YXJnZXQpOyBcdFx0cmV0dXJuIEBcblxuXHRyZW1vdmU6ICgpLT5cblx0XHRAZWwucmVtb3ZlKClcblx0XHRyZXR1cm4gQGRlc3Ryb3koZmFsc2UpXG5cblx0ZGVzdHJveTogKHJlbW92ZUZyb21ET009dHJ1ZSktPlxuXHRcdFNpbXBseUJpbmQudW5CaW5kQWxsKEApXG5cdFx0U2ltcGx5QmluZC51bkJpbmRBbGwoQHN0YXRlKVxuXHRcdFNpbXBseUJpbmQudW5CaW5kQWxsKEBlbClcblx0XHRTaW1wbHlCaW5kLnVuQmluZEFsbChjaGlsZCkgZm9yIGNoaWxkIGluIEBlbC5jaGlsZFxuXHRcdEBlbC5yZW1vdmUoKSBpZiByZW1vdmVGcm9tRE9NXG5cdFx0QF9kZXN0cm95KCkgaWYgQF9kZXN0cm95XG5cdFx0ZGVsZXRlIEBhbGxGaWVsZHNbQElEXVxuXHRcdHJldHVybiB0cnVlXG5cblx0b246IChldmVudE5hbWVzLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSktPlxuXHRcdEBlbC5vbi5jYWxsKEBlbCwgZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUsIHRydWUpXG5cdFx0cmV0dXJuIEBcblxuXHRvbmNlOiAoZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUpLT5cblx0XHRAb24gZXZlbnROYW1lcywgKCk9PlxuXHRcdFx0QG9mZihldmVudE5hbWVzLCBjYWxsYmFjaylcblx0XHRcdGNhbGxiYWNrLmFwcGx5KEBlbCwgYXJndW1lbnRzKVxuXHRcdCwgdXNlQ2FwdHVyZVxuXG5cdG9mZjogKCktPlxuXHRcdEBlbC5vZmYuYXBwbHkoQGVsLCBhcmd1bWVudHMpXG5cdFx0cmV0dXJuIEBcblxuXHRlbWl0OiAoKS0+XG5cdFx0QGVsLmVtaXRQcml2YXRlLmFwcGx5KEBlbCwgYXJndW1lbnRzKVxuXHRcdHJldHVybiBAXG5cblx0dmFsaWRhdGU6IChwcm92aWRlZFZhbHVlPUBbQGNvcmVWYWx1ZVByb3BdLCB0ZXN0VW5yZXF1aXJlZCwgcmVwb3J0KS0+XG5cdFx0aXNWYWxpZCA9IHN3aXRjaFxuXHRcdFx0d2hlbiBAc2V0dGluZ3MudmFsaWRhdG9yIHRoZW4gQHNldHRpbmdzLnZhbGlkYXRvcihwcm92aWRlZFZhbHVlKVxuXHRcdFx0XG5cdFx0XHR3aGVuIG5vdCBAc2V0dGluZ3MucmVxdWlyZWQgYW5kIG5vdCB0ZXN0VW5yZXF1aXJlZCB0aGVuIHRydWVcblxuXHRcdFx0d2hlbiBAX3ZhbGlkYXRlKHByb3ZpZGVkVmFsdWUsIHRlc3RVbnJlcXVpcmVkLCByZXBvcnQpIGlzIGZhbHNlIHRoZW4gZmFsc2VcblxuXHRcdFx0d2hlbiBAc2V0dGluZ3MucmVxdWlyZWQgdGhlbiBzd2l0Y2hcblx0XHRcdFx0d2hlbiBAc2V0dGluZ3MubXVsdGlwbGUgdGhlbiAhIXByb3ZpZGVkVmFsdWU/Lmxlbmd0aFxuXHRcdFx0XHR3aGVuIHR5cGVvZiBwcm92aWRlZFZhbHVlIGlzICdzdHJpbmcnIHRoZW4gISFwcm92aWRlZFZhbHVlXG5cdFx0XHRcdGVsc2UgcHJvdmlkZWRWYWx1ZT9cblx0XHRcdFxuXHRcdFx0ZWxzZSB0cnVlXG5cblx0XHRAc3RhdGUuc2hvd0Vycm9yID0gZmFsc2UgaWYgaXNWYWxpZCBhbmQgQHNldHRpbmdzLmNsZWFyRXJyb3JPblZhbGlkXG5cdFx0cmV0dXJuIGlzVmFsaWRcblxuXHR2YWxpZGF0ZUNvbmRpdGlvbnM6IChjb25kaXRpb25zKS0+XG5cdFx0aWYgY29uZGl0aW9uc1xuXHRcdFx0dG9nZ2xlVmlzaWJpbGl0eSA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0Y29uZGl0aW9ucyA9IEBjb25kaXRpb25zXG5cdFx0XHR0b2dnbGVWaXNpYmlsaXR5ID0gdHJ1ZVxuXHRcdFxuXHRcdHBhc3NlZENvbmRpdGlvbnMgPSBDb25kaXRpb24udmFsaWRhdGUoY29uZGl0aW9ucylcblx0XHRpZiB0b2dnbGVWaXNpYmlsaXR5XG5cdFx0XHRyZXR1cm4gQHN0YXRlLnZpc2libGUgPSBwYXNzZWRDb25kaXRpb25zXG5cdFx0ZWxzZSBcblx0XHRcdHJldHVybiBwYXNzZWRDb25kaXRpb25zXG5cblx0dmFsaWRhdGVBbmRSZXBvcnQ6IChwcm92aWRlZFZhbHVlLCB0ZXN0VW5yZXF1aXJlZCktPlxuXHRcdGlzVmFsaWQgPSBAdmFsaWRhdGUocHJvdmlkZWRWYWx1ZSwgdGVzdFVucmVxdWlyZWQsIHRydWUpXG5cdFx0QHN0YXRlLnNob3dFcnJvciA9ICFpc1ZhbGlkXG5cdFx0cmV0dXJuIGlzVmFsaWRcblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRmllbGQiLCInY29uZGl0aW9ucyc6IChjb25kaXRpb25zKS0+XG5cdGlmIElTLm9iamVjdFBsYWluKGNvbmRpdGlvbnMpXG5cdFx0e3RhcmdldCwgdmFsdWV9IGZvciB0YXJnZXQsdmFsdWUgb2YgY29uZGl0aW9uc1xuXHRlbHNlIGlmIElTLmFycmF5KGNvbmRpdGlvbnMpXG5cdFx0Y29uZGl0aW9ucy5tYXAgKGl0ZW0pLT4gaWYgSVMuc3RyaW5nKGl0ZW0pIHRoZW4ge3RhcmdldDppdGVtfSBlbHNlIGl0ZW1cblxuJ2Nob2ljZXMnOiAoY2hvaWNlcyktPlxuXHRpZiBJUy5vYmplY3RQbGFpbihjaG9pY2VzKVxuXHRcdHtsYWJlbCx2YWx1ZX0gZm9yIGxhYmVsLHZhbHVlIG9mIGNob2ljZXNcblx0ZWxzZSBpZiBJUy5hcnJheShjaG9pY2VzKVxuXHRcdGNob2ljZXMubWFwIChpdGVtKS0+IGlmIG5vdCBJUy5vYmplY3RQbGFpbihpdGVtKSB0aGVuIHtsYWJlbDppdGVtLCB2YWx1ZTppdGVtfSBlbHNlIGl0ZW1cblxuJ3ZhbGlkV2hlblJlZ2V4JzogKHJlZ2V4KS0+XG5cdGlmIElTLnN0cmluZyhyZWdleCkgdGhlbiBuZXcgUmVnRXhwKHJlZ2V4KSBlbHNlIHJlZ2V4IiwiRHJvcGRvd24gPSBpbXBvcnQgJy4uLy4uL2NvbXBvbmVudHMvZHJvcGRvd24nXG5NYXNrID0gaW1wb3J0ICcuLi8uLi9jb21wb25lbnRzL21hc2snXG5SRUdFWCA9IGltcG9ydCAnLi4vLi4vY29uc3RhbnRzL3JlZ2V4J1xuS0VZQ09ERVMgPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9rZXlDb2RlcydcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5JUyA9IGltcG9ydCAnLi4vLi4vY2hlY2tzJ1xuRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5pbXBvcnQgdGVtcGxhdGUsKiBhcyB0ZW1wbGF0ZXMgZnJvbSAnLi90ZW1wbGF0ZSdcbmltcG9ydCAqIGFzIGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMnXG5cbmNsYXNzIFRleHRGaWVsZCBleHRlbmRzIGltcG9ydCAnLi4vJ1xuXHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0dGVtcGxhdGVzOiB0ZW1wbGF0ZXNcblx0ZGVmYXVsdHM6IGRlZmF1bHRzXG5cblx0Y29uc3RydWN0b3I6ICgpLT5cblx0XHRzdXBlclxuXHRcdEBfdmFsdWUgPz0gJydcblx0XHRAc3RhdGUudHlwaW5nID0gZmFsc2Vcblx0XHRAY3Vyc29yID0gcHJldjowLCBjdXJyZW50OjBcblxuXHRcdGlmIG5vdCBAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXhcblx0XHRcdGlmIEBzZXR0aW5ncy5rZXlib2FyZCBpcyAnZW1haWwnIGFuZCBAc2V0dGluZ3MucmVxdWlyZWRcblx0XHRcdFx0QHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4ID0gUkVHRVguZW1haWxcblx0XHRcdGVsc2UgaWYgQHNldHRpbmdzLm1hc2sgaXMgJ05BTUUnIG9yIEBzZXR0aW5ncy5tYXNrLnBhdHRlcm4gaXMgJ05BTUUnXG5cdFx0XHRcdEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleCA9IC9eW2EtekEtWl17Mn0vXG5cdFx0XHRlbHNlIGlmIEBzZXR0aW5ncy5tYXNrIGlzICdGVUxMTkFNRScgb3IgQHNldHRpbmdzLm1hc2sucGF0dGVybiBpcyAnRlVMTE5BTUUnXG5cdFx0XHRcdEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleCA9IC9eW2EtekEtWl0rXFxzK1thLXpBLVpdKy9cblxuXHRcdGlmIG5vdCBAc2V0dGluZ3MubWFzay5wYXR0ZXJuXG5cdFx0XHRpZiBJUy5zdHJpbmcoQHNldHRpbmdzLm1hc2spXG5cdFx0XHRcdEBzZXR0aW5ncy5tYXNrID0gZXh0ZW5kLmRlZXAuY2xvbmUoQGRlZmF1bHRzLm1hc2ssIHBhdHRlcm46QHNldHRpbmdzLm1hc2spXG5cblx0XHRcdGVsc2UgaWYgSVMub2JqZWN0KEBzZXR0aW5ncy5tYXNrKVxuXHRcdFx0XHRAc2V0dGluZ3MubWFzay5wYXR0ZXJuID0gc3dpdGNoIEBzZXR0aW5ncy5rZXlib2FyZFxuXHRcdFx0XHRcdHdoZW4gJ2RhdGUnIHRoZW4gJ0RBVEUnXG5cdFx0XHRcdFx0d2hlbiAnbnVtYmVyJyB0aGVuICdOVU1CRVInXG5cdFx0XHRcdFx0d2hlbiAncGhvbmUnLCd0ZWwnIHRoZW4gJ1BIT05FJ1xuXHRcdFx0XHRcdHdoZW4gJ2VtYWlsJyB0aGVuICdFTUFJTCdcblx0XHRcdFxuXHRcdEBtYXNrID0gbmV3IE1hc2soQCwgQHNldHRpbmdzLm1hc2spIGlmIEBzZXR0aW5ncy5tYXNrLnBhdHRlcm5cblx0XHRAX2NyZWF0ZUVsZW1lbnRzKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzKClcblx0XHRAX2NvbnN0cnVjdG9yRW5kKClcblxuXG5cdF9nZXRWYWx1ZTogKCktPlxuXHRcdGlmIEBkcm9wZG93biBhbmQgQHNlbGVjdGVkIGFuZCBAX3ZhbHVlIGlzIEBzZWxlY3RlZC5sYWJlbFxuXHRcdFx0cmV0dXJuIEBzZWxlY3RlZC52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBAX3ZhbHVlXG5cblx0X3NldFZhbHVlOiAobmV3VmFsdWUpLT4gaWYgSVMuc3RyaW5nKG5ld1ZhbHVlKSBvciBJUy5udW1iZXIobmV3VmFsdWUpXG5cdFx0bmV3VmFsdWUgPSBTdHJpbmcobmV3VmFsdWUpXG5cdFx0QF92YWx1ZSA9IGlmIEBtYXNrIHRoZW4gQG1hc2suc2V0VmFsdWUobmV3VmFsdWUpIGVsc2UgbmV3VmFsdWVcblxuXHRfcmVjYWxjRGlzcGxheTogKCktPlxuXHRcdEBfdmFsdWUgPSBAX3ZhbHVlIGlmIEBzZXR0aW5ncy5hdXRvV2lkdGhcblxuXG5cdF9jcmVhdGVFbGVtZW50czogKCktPlxuXHRcdGdsb2JhbE9wdHMgPSB7cmVsYXRlZEluc3RhbmNlOkB9XG5cdFx0QGVsID0gQHRlbXBsYXRlLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuZGVmYXVsdCwgZ2xvYmFsT3B0cylcblxuXHRcdGlmIEBzZXR0aW5ncy5jaG9pY2VzXG5cdFx0XHRAZHJvcGRvd24gPSBuZXcgRHJvcGRvd24oQHNldHRpbmdzLmNob2ljZXMsIEApXG5cdFx0XHRAZHJvcGRvd24uYXBwZW5kVG8oQGVsLmNoaWxkLmlubmVyd3JhcClcblxuXHRcdGlmIEBzZXR0aW5ncy5pY29uXG5cdFx0XHRAdGVtcGxhdGVzLmljb24uc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5pY29uLCBnbG9iYWxPcHRzKS5hcHBlbmQoQHNldHRpbmdzLmljb24pLmluc2VydEJlZm9yZShAZWwuY2hpbGQuaW5wdXQpXG5cblx0XHRpZiBAc2V0dGluZ3MuY2hlY2ttYXJrXG5cdFx0XHRAdGVtcGxhdGVzLmNoZWNrbWFyay5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmNoZWNrbWFyaywgZ2xvYmFsT3B0cykuaW5zZXJ0QWZ0ZXIoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFxuXHRcdEBlbC5jaGlsZC5pbnB1dC5wcm9wICd0eXBlJywgc3dpdGNoIEBzZXR0aW5ncy5rZXlib2FyZFxuXHRcdFx0d2hlbiAnbnVtYmVyJywndGVsJywncGhvbmUnIHRoZW4gJ3RlbCdcblx0XHRcdHdoZW4gJ3Bhc3N3b3JkJyB0aGVuICdwYXNzd29yZCdcblx0XHRcdHdoZW4gJ3VybCcgdGhlbiAndXJsJ1xuXHRcdFx0IyB3aGVuICdlbWFpbCcgdGhlbiAnZW1haWwnXG5cdFx0XHRlbHNlICd0ZXh0J1xuXG5cdFx0QGVsLnN0YXRlICdoYXNMYWJlbCcsIEBzZXR0aW5ncy5sYWJlbFxuXHRcdEBlbC5jaGlsZC5pbm5lcndyYXAucmF3Ll9xdWlja0ZpZWxkID0gQGVsLmNoaWxkLmlucHV0LnJhdy5fcXVpY2tGaWVsZCA9IEBcblx0XHRyZXR1cm4gQGVsLmNoaWxkZlxuXG5cblx0X2F0dGFjaEJpbmRpbmdzOiAoKS0+XG5cdFx0QF9hdHRhY2hCaW5kaW5nc19lbFN0YXRlKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXkoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3NfZGlzcGxheV9hdXRvV2lkdGgoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3NfdmFsdWUoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3NfYXV0b2NvbXBsZXRlKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX3N0YXRlVHJpZ2dlcnMoKVxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2VsU3RhdGU6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCd2aXNpYmxlJykub2YoQHN0YXRlKS50byBcdCh2aXNpYmxlKT0+IEBlbC5zdGF0ZSAndmlzaWJsZScsIHZpc2libGVcblx0XHRTaW1wbHlCaW5kKCdob3ZlcmVkJykub2YoQHN0YXRlKS50byBcdChob3ZlcmVkKT0+IEBlbC5zdGF0ZSAnaG92ZXInLCBob3ZlcmVkXG5cdFx0U2ltcGx5QmluZCgnZm9jdXNlZCcpLm9mKEBzdGF0ZSkudG8gXHQoZm9jdXNlZCk9PiBAZWwuc3RhdGUgJ2ZvY3VzJywgZm9jdXNlZFxuXHRcdFNpbXBseUJpbmQoJ2ZpbGxlZCcpLm9mKEBzdGF0ZSkudG8gXHRcdChmaWxsZWQpPT4gQGVsLnN0YXRlICdmaWxsZWQnLCBmaWxsZWRcblx0XHRTaW1wbHlCaW5kKCdkaXNhYmxlZCcpLm9mKEBzdGF0ZSkudG8gXHQoZGlzYWJsZWQpPT4gQGVsLnN0YXRlICdkaXNhYmxlZCcsIGRpc2FibGVkXG5cdFx0U2ltcGx5QmluZCgnc2hvd0xhYmVsJykub2YoQHN0YXRlKS50byBcdChzaG93TGFiZWwpPT4gQGVsLnN0YXRlICdzaG93TGFiZWwnLCBzaG93TGFiZWxcblx0XHRTaW1wbHlCaW5kKCdzaG93RXJyb3InKS5vZihAc3RhdGUpLnRvIFx0KHNob3dFcnJvcik9PiBAZWwuc3RhdGUgJ3Nob3dFcnJvcicsIHNob3dFcnJvclxuXHRcdFNpbXBseUJpbmQoJ3Nob3dIZWxwJykub2YoQHN0YXRlKS50byBcdChzaG93SGVscCk9PiBAZWwuc3RhdGUgJ3Nob3dIZWxwJywgc2hvd0hlbHBcblx0XHRTaW1wbHlCaW5kKCd2YWxpZCcpLm9mKEBzdGF0ZSkudG8gKHZhbGlkKT0+XG5cdFx0XHRAZWwuc3RhdGUgJ3ZhbGlkJywgdmFsaWRcblx0XHRcdEBlbC5zdGF0ZSAnaW52YWxpZCcsICF2YWxpZFxuXHRcdFxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXk6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdwbGFjZWhvbGRlcicpLm9mKEBzdGF0ZSlcblx0XHRcdC50bygndGV4dCcpLm9mKEBlbC5jaGlsZC5wbGFjZWhvbGRlcilcblx0XHRcdFx0LnRyYW5zZm9ybSAocGxhY2Vob2xkZXIpPT4gc3dpdGNoXG5cdFx0XHRcdFx0d2hlbiBwbGFjZWhvbGRlciBpcyB0cnVlIGFuZCBAc2V0dGluZ3MubGFiZWwgdGhlbiBAc2V0dGluZ3MubGFiZWxcblx0XHRcdFx0XHR3aGVuIElTLnN0cmluZyhwbGFjZWhvbGRlcikgdGhlbiBwbGFjZWhvbGRlclxuXHRcdFx0XHRcdGVsc2UgJydcblxuXHRcdFNpbXBseUJpbmQoJ2Rpc2FibGVkJywgdXBkYXRlT25CaW5kOkBzdGF0ZS5kaXNhYmxlZCkub2YoQHN0YXRlKVxuXHRcdFx0LnRvIChkaXNhYmxlZCwgcHJldik9PiBpZiBAc2V0dGluZ3MuY2hlY2ttYXJrXG5cdFx0XHRcdGlmIGRpc2FibGVkIG9yIChub3QgZGlzYWJsZWQgYW5kIHByZXY/KSB0aGVuIHNldFRpbWVvdXQgKCk9PlxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jaGVja21hcmtfbWFzazEucmVjYWxjU3R5bGUoKVxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jaGVja21hcmtfbWFzazIucmVjYWxjU3R5bGUoKVxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jaGVja21hcmtfcGF0Y2gucmVjYWxjU3R5bGUoKVxuXHRcdFx0XHRcdCMgQGVsLmNoaWxkLmNoZWNrbWFyay5yZWNhbGNTdHlsZSh0cnVlKVxuXHRcdFxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXlfYXV0b1dpZHRoOiAoKS0+XG5cdFx0U2ltcGx5QmluZCgnd2lkdGgnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUpLm9mKEBzdGF0ZSlcblx0XHRcdC50byAod2lkdGgpPT4gKGlmIEBzZXR0aW5ncy5hdXRvV2lkdGggdGhlbiBAZWwuY2hpbGQuaW5wdXQgZWxzZSBAZWwpLnN0eWxlKCd3aWR0aCcsIHdpZHRoKVxuXHRcdFx0LnRyYW5zZm9ybSBAX2Zvcm1hdFdpZHRoLmJpbmQoQClcblx0XHRcdC51cGRhdGVPbignaXNNb2JpbGUnKS5vZihAc3RhdGUpXG5cblx0XHRpZiBAc2V0dGluZ3MuYXV0b1dpZHRoXG5cdFx0XHRTaW1wbHlCaW5kKCdfdmFsdWUnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQClcblx0XHRcdFx0LnRvKCd3aWR0aCcpLm9mKEBzdGF0ZSlcblx0XHRcdFx0XHQudHJhbnNmb3JtICgpPT4gXCIje0BfZ2V0SW5wdXRBdXRvV2lkdGgoKX1weFwiXG5cdFx0XHRcdFx0LnVwZGF0ZU9uKCdldmVudDppbnNlcnRlZCcpLm9mKEBlbClcblx0XHRcdFx0XHQudXBkYXRlT24oJ3Zpc2libGUnKS5vZihAc3RhdGUpXG5cdFx0XG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfdmFsdWU6ICgpLT5cblx0XHRpbnB1dCA9IEBlbC5jaGlsZC5pbnB1dC5yYXdcblx0XHRcblx0XHRyZXNldElucHV0ID0gKCk9PlxuXHRcdFx0ZmlsbGVkID0gIUBtYXNrLmlzRW1wdHkoKVxuXHRcdFx0aWYgbm90IGZpbGxlZFxuXHRcdFx0XHRAc2VsZWN0aW9uKEBtYXNrLmN1cnNvciA9IDApXG5cdFx0XHRcdEBfdmFsdWUgPSAnJ1xuXHRcdFx0XHRAc3RhdGUuZmlsbGVkID0gZmFsc2Vcblx0XHRcdFxuXHRcdFx0cmV0dXJuIGZpbGxlZFxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmlucHV0Jykub2YoaW5wdXQpLnRvICgpPT5cblx0XHRcdEB2YWx1ZSA9IGlucHV0LnZhbHVlXG5cdFx0XHRAc2VsZWN0aW9uKEBtYXNrLmN1cnNvcikgaWYgQG1hc2tcblx0XHRcdEBlbWl0KCdpbnB1dCcsIEB2YWx1ZSlcblxuXHRcdFNpbXBseUJpbmQoJ192YWx1ZScsIHVwZGF0ZUV2ZW5JZlNhbWU6ISFAbWFzaykub2YoQClcblx0XHRcdC50bygndmFsdWUnKS5vZihpbnB1dClcdFx0XG5cdFx0XHQuYW5kLnRvICh2YWx1ZSk9PlxuXHRcdFx0XHRmaWxsZWQgPSAhIXZhbHVlXG5cdFx0XHRcdGZpbGxlZCA9IHJlc2V0SW5wdXQoKSBpZiBmaWxsZWQgYW5kIEBtYXNrIGFuZCBAbWFzay5ndWlkZSBhbmQgKCFAc3RhdGUuZm9jdXNlZCBvciBAbWFzay5jdXJzb3IgaXMgMClcblx0XHRcdFx0QHN0YXRlLmZpbGxlZCA9IGZpbGxlZFxuXHRcdFx0XHRAc3RhdGUuaW50ZXJhY3RlZCA9IHRydWUgaWYgZmlsbGVkXG5cdFx0XHRcdEBzdGF0ZS52YWxpZCA9IEB2YWxpZGF0ZShudWxsLCB0cnVlKVxuXHRcdFx0XHRAZW1pdCgnaW5wdXQnLCBAdmFsdWUpIHVubGVzcyBAc3RhdGUuZm9jdXNlZFxuXG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6a2V5ZG93bicpLm9mKEBlbC5jaGlsZC5pbnB1dCkudG8gKGV2ZW50KT0+XG5cdFx0XHRAZW1pdCgnc3VibWl0JykgaWYgZXZlbnQua2V5Q29kZSBpcyBLRVlDT0RFUy5lbnRlclxuXHRcdFx0QGVtaXQoXCJrZXktI3tldmVudC5rZXlDb2RlfVwiKVxuXG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6Ymx1cicpLm9mKEBlbC5jaGlsZC5pbnB1dCkudG8ocmVzZXRJbnB1dCkgaWYgQG1hc2sgYW5kIEBtYXNrLmd1aWRlXG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfYXV0b2NvbXBsZXRlOiAoKS0+IGlmIEBkcm9wZG93blxuXHRcdFNpbXBseUJpbmQuZGVmYXVsdE9wdGlvbnMudXBkYXRlT25CaW5kID0gZmFsc2VcblxuXHRcdFNpbXBseUJpbmQoJ3R5cGluZycsIHVwZGF0ZUV2ZW5JZlNhbWU6dHJ1ZSkub2YoQHN0YXRlKS50byAoaXNUeXBpbmcpPT5cblx0XHRcdGlmIGlzVHlwaW5nXG5cdFx0XHRcdHJldHVybiBpZiBub3QgQF92YWx1ZVxuXHRcdFx0XHRpZiBAZHJvcGRvd24uaXNPcGVuXG5cdFx0XHRcdFx0QGRyb3Bkb3duLmxpc3QuY2FsY0Rpc3BsYXkoKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0QGRyb3Bkb3duLmlzT3BlbiA9IHRydWVcblx0XHRcdFx0XHRTaW1wbHlCaW5kKCdldmVudDpjbGljaycpLm9mKGRvY3VtZW50KVxuXHRcdFx0XHRcdFx0Lm9uY2UudG8gKCk9PiBAZHJvcGRvd24uaXNPcGVuID0gZmFsc2Vcblx0XHRcdFx0XHRcdC5jb25kaXRpb24gKGV2ZW50KT0+IG5vdCBET00oZXZlbnQudGFyZ2V0KS5wYXJlbnRNYXRjaGluZyAocGFyZW50KT0+IHBhcmVudCBpcyBAZWwuY2hpbGQuaW5uZXJ3cmFwXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBkcm9wZG93bi5pc09wZW4gPSBmYWxzZVxuXG5cdFx0U2ltcGx5QmluZCgnX3ZhbHVlJykub2YoQCkudG8gKHZhbHVlKT0+XG5cdFx0XHRmb3IgY2hvaWNlIGluIEBkcm9wZG93bi5jaG9pY2VzXG5cdFx0XHRcdHNob3VsZEJlVmlzaWJsZSA9IGlmIG5vdCB2YWx1ZSB0aGVuIHRydWUgZWxzZSBoZWxwZXJzLmZ1enp5TWF0Y2godmFsdWUsIGNob2ljZS5sYWJlbClcblx0XHRcdFx0Y2hvaWNlLnZpc2libGUgPSBzaG91bGRCZVZpc2libGUgaWYgY2hvaWNlLnZpc2libGUgaXNudCBzaG91bGRCZVZpc2libGVcblxuXHRcdFx0aWYgQGRyb3Bkb3duLmlzT3BlbiBhbmQgbm90IHZhbHVlXG5cdFx0XHRcdEBkcm9wZG93bi5pc09wZW4gPSBmYWxzZVxuXHRcdFx0cmV0dXJuXG5cblxuXHRcdEBkcm9wZG93bi5vblNlbGVjdGVkIChzZWxlY3RlZENob2ljZSk9PlxuXHRcdFx0QHNlbGVjdGVkID0gc2VsZWN0ZWRDaG9pY2Vcblx0XHRcdEB2YWx1ZSA9IHNlbGVjdGVkQ2hvaWNlLmxhYmVsXG5cdFx0XHRAZHJvcGRvd24uaXNPcGVuID0gZmFsc2Vcblx0XHRcdEBzZWxlY3Rpb24oQGVsLmNoaWxkLmlucHV0LnJhdy52YWx1ZS5sZW5ndGgpXG5cdFx0XG5cblx0XHRTaW1wbHlCaW5kLmRlZmF1bHRPcHRpb25zLnVwZGF0ZU9uQmluZCA9IHRydWVcblx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc19zdGF0ZVRyaWdnZXJzOiAoKS0+XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6bW91c2VlbnRlcicpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBzdGF0ZS5ob3ZlcmVkID0gdHJ1ZVxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50Om1vdXNlbGVhdmUnKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUuaG92ZXJlZCA9IGZhbHNlXG5cblx0XHRTaW1wbHlCaW5kKCdldmVudDpmb2N1cycpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBzdGF0ZS5mb2N1c2VkID0gdHJ1ZTsgaWYgQHN0YXRlLmRpc2FibGVkIHRoZW4gQGJsdXIoKVxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmJsdXInKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUudHlwaW5nID0gQHN0YXRlLmZvY3VzZWQgPSBmYWxzZVxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmlucHV0Jykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQHN0YXRlLnR5cGluZyA9IHRydWVcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDprZXlkb3duJykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQGN1cnNvci5wcmV2ID0gQHNlbGVjdGlvbigpLmVuZFxuXG5cdFx0cmV0dXJuXG5cblxuXHRfc2NoZWR1bGVDdXJzb3JSZXNldDogKCktPlxuXHRcdGRpZmZJbmRleCA9IGhlbHBlcnMuZ2V0SW5kZXhPZkZpcnN0RGlmZihAbWFzay52YWx1ZSwgQG1hc2sucHJldi52YWx1ZSlcblx0XHRjdXJyZW50Q3Vyc29yID0gQGN1cnNvci5jdXJyZW50XG5cdFx0bmV3Q3Vyc29yID0gQG1hc2subm9ybWFsaXplQ3Vyc29yUG9zKGN1cnJlbnRDdXJzb3IsIEBjdXJzb3IucHJldilcblxuXHRcdGlmIG5ld0N1cnNvciBpc250IGN1cnJlbnRDdXJzb3Jcblx0XHRcdEBzZWxlY3Rpb24obmV3Q3Vyc29yKVxuXHRcdHJldHVyblxuXG5cblx0X3NldFZhbHVlSWZOb3RTZXQ6ICgpLT5cblx0XHRpZiBAZWwuY2hpbGQuaW5wdXQucmF3LnZhbHVlIGlzbnQgQF92YWx1ZVxuXHRcdFx0QGVsLmNoaWxkLmlucHV0LnJhdy52YWx1ZSA9IEBfdmFsdWVcblx0XHRyZXR1cm5cblxuXG5cblx0X2dldElucHV0QXV0b1dpZHRoOiAoKS0+XG5cdFx0aWYgQF92YWx1ZVxuXHRcdFx0QF9zZXRWYWx1ZUlmTm90U2V0KClcblx0XHRcdEBlbC5jaGlsZC5pbnB1dC5zdHlsZSgnd2lkdGgnLCAwKVxuXHRcdFx0QGVsLmNoaWxkLmlucHV0LnJhdy5zY3JvbGxMZWZ0ID0gMWUrMTBcblx0XHRcdGlucHV0V2lkdGggPSBNYXRoLm1heChAZWwuY2hpbGQuaW5wdXQucmF3LnNjcm9sbExlZnQrQGVsLmNoaWxkLmlucHV0LnJhdy5vZmZzZXRXaWR0aCwgQGVsLmNoaWxkLmlucHV0LnJhdy5zY3JvbGxXaWR0aCkgKyAyXG5cdFx0XHRsYWJlbFdpZHRoID0gaWYgQHNldHRpbmdzLmxhYmVsIGFuZCBAZWwuY2hpbGQubGFiZWwuc3R5bGVTYWZlKCdwb3NpdGlvbicpIGlzICdhYnNvbHV0ZScgdGhlbiBAZWwuY2hpbGQubGFiZWwucmVjdC53aWR0aCBlbHNlIDBcblx0XHRlbHNlXG5cdFx0XHRpbnB1dFdpZHRoID0gQGVsLmNoaWxkLnBsYWNlaG9sZGVyLnJlY3Qud2lkdGhcblx0XHRcdGxhYmVsV2lkdGggPSAwXG5cdFx0XG5cdFx0cmV0dXJuIE1hdGgubWluIEBfZ2V0V2lkdGhTZXR0aW5nKCdtYXgnKSwgTWF0aC5tYXgoQF9nZXRXaWR0aFNldHRpbmcoJ21pbicpLCBpbnB1dFdpZHRoLCBsYWJlbFdpZHRoKVxuXG5cblx0X2dldFdpZHRoU2V0dGluZzogKHRhcmdldCktPlxuXHRcdHRhcmdldCArPSAnV2lkdGgnIGlmIHRhcmdldCBpcyAnbWluJyBvciB0YXJnZXQgaXMgJ21heCdcdFx0XG5cdFx0aWYgdHlwZW9mIEBzZXR0aW5nc1t0YXJnZXRdIGlzICdudW1iZXInXG5cdFx0XHRyZXN1bHQgPSBAc2V0dGluZ3NbdGFyZ2V0XVxuXHRcdFxuXHRcdGVsc2UgaWZcdHR5cGVvZiBAc2V0dGluZ3NbdGFyZ2V0XSBpcyAnc3RyaW5nJ1xuXHRcdFx0cmVzdWx0ID0gcGFyc2VGbG9hdChAc2V0dGluZ3NbdGFyZ2V0XSlcblxuXHRcdFx0aWYgaGVscGVycy5pbmNsdWRlcyhAc2V0dGluZ3NbdGFyZ2V0XSwgJyUnKVxuXHRcdFx0XHRpZiAocGFyZW50PUBlbC5wYXJlbnQpIGFuZCBwYXJlbnQuc3R5bGUoJ2Rpc3BsYXknKSBpcyAnYmxvY2snXG5cdFx0XHRcdFx0cGFyZW50V2lkdGggPSBwYXJlbnQuc3R5bGVQYXJzZWQoJ3dpZHRoJykgLSBwYXJlbnQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdMZWZ0JykgLSBwYXJlbnQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdSaWdodCcpIC0gMlxuXHRcdFx0XHRcdHJlc3VsdCA9IHBhcmVudFdpZHRoICogKHJlc3VsdC8xMDApXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXN1bHQgPSAwXG5cblx0XHRyZXR1cm4gcmVzdWx0IG9yIChpZiB0YXJnZXQgaXMgJ21pbldpZHRoJyB0aGVuIDAgZWxzZSBJbmZpbml0eSlcblxuXG5cdF92YWxpZGF0ZTogKHByb3ZpZGVkVmFsdWUpLT5cblx0XHRpZiBAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXggYW5kIElTLnJlZ2V4KEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleClcblx0XHRcdHJldHVybiBmYWxzZSBpZiBub3QgQHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4LnRlc3QocHJvdmlkZWRWYWx1ZSlcblx0XHRcblx0XHRpZiBAc2V0dGluZ3MudmFsaWRXaGVuSXNDaG9pY2UgYW5kIEBzZXR0aW5ncy5jaG9pY2VzPy5sZW5ndGhcblx0XHRcdG1hdGNoaW5nQ2hvaWNlID0gQHNldHRpbmdzLmNob2ljZXMuZmlsdGVyIChjaG9pY2UpLT4gY2hvaWNlLnZhbHVlIGlzIHByb3ZpZGVkVmFsdWVcblx0XHRcdHJldHVybiBmYWxzZSBpZiBub3QgbWF0Y2hpbmdDaG9pY2UubGVuZ3RoXG5cblx0XHRpZiBAc2V0dGluZ3MubWluTGVuZ3RoXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgcHJvdmlkZWRWYWx1ZS5sZW5ndGggPCBAc2V0dGluZ3MubWluTGVuZ3RoXG5cblx0XHRpZiBAc2V0dGluZ3MubWF4TGVuZ3RoXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgcHJvdmlkZWRWYWx1ZS5sZW5ndGggPj0gQHNldHRpbmdzLm1heExlbmd0aFxuXG5cdFx0aWYgQG1hc2tcblx0XHRcdHJldHVybiBmYWxzZSBpZiBub3QgQG1hc2sudmFsaWRhdGUocHJvdmlkZWRWYWx1ZSlcblx0XHRcblx0XHRyZXR1cm4gdHJ1ZVxuXG5cblx0c2VsZWN0aW9uOiAoYXJnKS0+XG5cdFx0aWYgSVMub2JqZWN0KGFyZylcblx0XHRcdHN0YXJ0ID0gYXJnLnN0YXJ0XG5cdFx0XHRlbmQgPSBhcmcuZW5kXG5cdFx0ZWxzZVxuXHRcdFx0c3RhcnQgPSBhcmdcblx0XHRcdGVuZCA9IGFyZ3VtZW50c1sxXVxuXG5cdFx0aWYgc3RhcnQ/XG5cdFx0XHRlbmQgPSBzdGFydCBpZiBub3QgZW5kIG9yIGVuZCA8IHN0YXJ0XG5cdFx0XHRAZWwuY2hpbGQuaW5wdXQucmF3LnNldFNlbGVjdGlvblJhbmdlKHN0YXJ0LCBlbmQpXG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gJ3N0YXJ0JzpAZWwuY2hpbGQuaW5wdXQucmF3LnNlbGVjdGlvblN0YXJ0LCAnZW5kJzpAZWwuY2hpbGQuaW5wdXQucmF3LnNlbGVjdGlvbkVuZFxuXG5cblx0Zm9jdXM6ICgpLT5cblx0XHRAZWwuY2hpbGQuaW5wdXQucmF3LmZvY3VzKClcblxuXHRibHVyOiAoKS0+XG5cdFx0QGVsLmNoaWxkLmlucHV0LnJhdy5ibHVyKClcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dEZpZWxkIiwiY3VycmVudElEID0gMFxuYXJyYXlNdXRhdG9yTWV0aG9kcyA9IFsncHVzaCcsJ3BvcCcsJ3NoaWZ0JywndW5zaGlmdCcsJ3NwbGljZScsJ3JldmVyc2UnLCdzb3J0J11cbmR1bW15UHJvcGVydHlEZXNjcmlwdG9yID0ge31cbmJvdW5kSW5zdGFuY2VzID0ge31cbnBsYWNlaG9sZGVyID0gWyd7eycsICd9fSddXG5zZXR0aW5ncyA9IE9iamVjdC5jcmVhdGVcblx0c2lsZW50Olx0XHRcdFx0XHRmYWxzZVxuLFxuXHRwbGFjZWhvbGRlcjpcblx0XHRnZXQ6ICgpLT4gcGxhY2Vob2xkZXJcblx0XHRzZXQ6IChuZXdQbGFjZWhvbGRlciktPiBpZiBjaGVja0lmLmlzQXJyYXkobmV3UGxhY2Vob2xkZXIpIGFuZCBuZXdQbGFjZWhvbGRlci5sZW5ndGggaXMgMlxuXHRcdFx0cGxhY2Vob2xkZXIgPSBuZXdQbGFjZWhvbGRlclxuXHRcdFx0c2V0UGhvbGRlclJlZ0V4KClcblx0XHRcdHJldHVyblxuXG5cbmRlZmF1bHRPcHRpb25zID0gXG5cdGRlbGF5Olx0XHRcdFx0XHRmYWxzZVxuXHR0aHJvdHRsZTpcdFx0XHRcdGZhbHNlXG5cdHNpbXBsZVNlbGVjdG9yOlx0XHRcdGZhbHNlXG5cdHByb21pc2VUcmFuc2Zvcm1zOlx0XHRmYWxzZVxuXHRkaXNwYXRjaEV2ZW50czpcdFx0XHRmYWxzZVxuXHRzZW5kQXJyYXlDb3BpZXM6XHRcdGZhbHNlXG5cdHVwZGF0ZUV2ZW5JZlNhbWU6XHRcdGZhbHNlXG5cdHVwZGF0ZU9uQmluZDpcdFx0XHR0cnVlXG5cblxuaW1wb3J0ICcuL21pc2MnXG5pbXBvcnQgJy4vU2ltcGx5QmluZCdcbmltcG9ydCAnLi9CaW5kaW5nJ1xuaW1wb3J0ICcuL0JpbmRpbmdJbnRlcmZhY2UnXG5pbXBvcnQgJy4vR3JvdXBCaW5kaW5nJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNpbXBseUJpbmQiLCJpbXBvcnQgJy4vaGVscGVycydcbmltcG9ydCAnLi9lcnJvcnNBbmRXYXJuaW5ncydcbiIsImRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5XG5nZXREZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvclxuXG5pbXBvcnQgJy4vY2hhbmdlRXZlbnQnXG5pbXBvcnQgJy4vcmVxdWlyZXNEb21EZXNjcmlwdG9yRml4J1xuaW1wb3J0ICcuL3dpbmRvd1Byb3BzVG9JZ25vcmUnXG5cblxuc2V0VmFsdWVOb29wID0gKHYsIHB1Ymxpc2hlciktPiBAdXBkYXRlQWxsU3VicyhwdWJsaXNoZXIgb3IgQClcblxuZ2VuSUQgPSAoKS0+ICcnKygrK2N1cnJlbnRJRClcblxuZ2VuT2JqID0gKCktPiBPYmplY3QuY3JlYXRlKG51bGwpXG5cbmdlblByb3hpZWRJbnRlcmZhY2UgPSAoaXNTdWIsIGNvbXBsZXRlQ2FsbGJhY2spLT4gKHN1YmplY3QsIGN1c3RvbU9wdGlvbnMsIHNhdmVPcHRpb25zKS0+XG5cdFNpbXBseUJpbmQoc3ViamVjdCwgY3VzdG9tT3B0aW9ucywgc2F2ZU9wdGlvbnMsIGlzU3ViLCBjb21wbGV0ZUNhbGxiYWNrKVxuXG5nZW5TZWxmVXBkYXRlciA9IChiaW5kaW5nLCBmZXRjaFZhbHVlKS0+XG5cdGJpbmRpbmcuc2VsZlVwZGF0ZXIgb3Jcblx0YmluZGluZy5zZWxmVXBkYXRlciA9IG5ldyBCaW5kaW5nICgpLT5cblx0XHRpZiBmZXRjaFZhbHVlIHRoZW4gYmluZGluZy5zZXRWYWx1ZShiaW5kaW5nLmZldGNoRGlyZWN0VmFsdWUoKSwgYmluZGluZywgdHJ1ZSkgZWxzZSBiaW5kaW5nLnVwZGF0ZUFsbFN1YnMoYmluZGluZylcblx0LCAnRnVuYycsIHt9XG5cblxuIyA9PT09IENoZWNrcyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCAnLi9jaGVja3MnXG5cblxuIyA9PT09IERlc2NyaXB0b3IgTW9kaWZpY2F0aW9uID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0ICcuL2Rlc2NyaXB0b3ItbW9kJ1xuXG5cbiMgPT09PSBPYmplY3QgY2xvbmluZyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCAnLi9jbG9uaW5nJ1xuXG5cbiMgPT09PSBCaW5kaW5nIENhY2hlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0ICcuL2NhY2hlJ1xuXG5cbiMgPT09PSBQbGFjZWhvbGRlcnMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgJy4vcGxhY2Vob2xkZXJzJ1xuXG5cbiMgPT09PSBFcnJvcnMgKyBXYXJuaW5ncyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCAnLi9lcnJvcnMnXG5cblxuXG5cblxuXG5cbiIsImNhY2hlZEV2ZW50ID0gbnVsbFxuXG5jaGFuZ2VFdmVudCA9ICgpLT5cblx0aWYgbm90IGNhY2hlZEV2ZW50XG5cdFx0ZXZlbnQgPSBjYWNoZWRFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpXG5cdFx0ZXZlbnQuaW5pdEV2ZW50KCdjaGFuZ2UnLCB0cnVlLCBmYWxzZSlcblx0XHRldmVudC5fc2IgPSB0cnVlXG5cblx0cmV0dXJuIGNhY2hlZEV2ZW50IiwicmVxdWlyZXNEb21EZXNjcmlwdG9yRml4ID0gKCdjbGFzc05hbWUnIG5vdCBvZiBFbGVtZW50OjopIG9yIG5vdCBnZXREZXNjcmlwdG9yKEVsZW1lbnQ6OiwgJ2NsYXNzTmFtZScpLmdldCIsIndpbmRvd1Byb3BzVG9JZ25vcmUgPSBbXG5cdCdpbm5lcldpZHRoJ1xuXHQnaW5uZXJIZWlnaHQnXG5cdCdvdXRlcldpZHRoJ1xuXHQnb3V0ZXJIZWlnaHQnXG5cdCdzY3JvbGxYJ1xuXHQnc2Nyb2xsWSdcblx0J3BhZ2VYT2Zmc2V0J1xuXHQncGFnZVlPZmZzZXQnXG5cdCdzY3JlZW5YJ1xuXHQnc2NyZWVuWSdcblx0J3NjcmVlbkxlZnQnXG5cdCdzY3JlZW5Ub3AnXG5dIiwidGFyZ2V0SW5jbHVkZXMgPSAodGFyZ2V0LCBpdGVtKS0+IHRhcmdldCBhbmQgdGFyZ2V0LmluZGV4T2YoaXRlbSkgaXNudCAtMVxuXG5jaGVja0lmID1cblx0aXNEZWZpbmVkOiAoc3ViamVjdCktPiBzdWJqZWN0IGlzbnQgdW5kZWZpbmVkXG5cdFxuXHRpc0FycmF5OiAoc3ViamVjdCktPiBzdWJqZWN0IGluc3RhbmNlb2YgQXJyYXlcblx0XG5cdGlzT2JqZWN0OiAoc3ViamVjdCktPiB0eXBlb2Ygc3ViamVjdCBpcyAnb2JqZWN0JyBhbmQgc3ViamVjdCAjIDJuZCBjaGVjayBpcyB0byB0ZXN0IGFnYWluc3QgJ251bGwnIHZhbHVlc1xuXG5cdGlzU3RyaW5nOiAoc3ViamVjdCktPiB0eXBlb2Ygc3ViamVjdCBpcyAnc3RyaW5nJ1xuXHRcblx0aXNOdW1iZXI6IChzdWJqZWN0KS0+IHR5cGVvZiBzdWJqZWN0IGlzICdudW1iZXInXG5cdFxuXHRpc0Z1bmN0aW9uOiAoc3ViamVjdCktPiB0eXBlb2Ygc3ViamVjdCBpcyAnZnVuY3Rpb24nXG5cblx0aXNCaW5kaW5nSW50ZXJmYWNlOiAoc3ViamVjdCktPiBzdWJqZWN0IGluc3RhbmNlb2YgQmluZGluZ0ludGVyZmFjZVxuXHRcblx0aXNCaW5kaW5nOiAoc3ViamVjdCktPiBzdWJqZWN0IGluc3RhbmNlb2YgQmluZGluZ1xuXG5cdGlzSXRlcmFibGU6IChzdWJqZWN0KS0+IGNoZWNrSWYuaXNPYmplY3Qoc3ViamVjdCkgYW5kIGNoZWNrSWYuaXNOdW1iZXIoc3ViamVjdC5sZW5ndGgpXG5cblx0aXNEb206IChzdWJqZWN0KS0+IHN1YmplY3Qubm9kZU5hbWUgYW5kIHN1YmplY3Qubm9kZVR5cGUgaXMgMVxuXG5cdGlzRG9tSW5wdXQ6IChzdWJqZWN0KS0+XG5cdFx0bm9kZU5hbWUgPSBzdWJqZWN0Lm5vZGVOYW1lXG5cdFx0cmV0dXJuIG5vZGVOYW1lIGlzICdJTlBVVCcgb3Igbm9kZU5hbWUgaXMgJ1RFWFRBUkVBJyBvciBub2RlTmFtZSBpcyAnU0VMRUNUJ1xuXG5cdGlzRG9tUmFkaW86IChzdWJqZWN0KS0+IHN1YmplY3QudHlwZSBpcyAncmFkaW8nXG5cblx0aXNEb21DaGVja2JveDogKHN1YmplY3QpLT4gc3ViamVjdC50eXBlIGlzICdjaGVja2JveCdcblxuXHRpc0VsQ29sbGVjdGlvbjogKHN1YmplY3QpLT4gKHN1YmplY3QgaW5zdGFuY2VvZiBOb2RlTGlzdCkgb3IgKHN1YmplY3QgaW5zdGFuY2VvZiBIVE1MQ29sbGVjdGlvbikgb3IgKHdpbmRvdy5qUXVlcnkgYW5kIHN1YmplY3QgaW5zdGFuY2VvZiBqUXVlcnkpXG5cblx0ZG9tRWxzQXJlU2FtZTogKGl0ZXJhYmxlKS0+XG5cdFx0dHlwZSA9IGl0ZXJhYmxlWzBdLnR5cGVcblx0XHRpdGVtc1dpdGhTYW1lVHlwZSA9IFtdLmZpbHRlci5jYWxsIGl0ZXJhYmxlLCAoaXRlbSktPiBpdGVtLnR5cGUgaXMgdHlwZVxuXG5cdFx0cmV0dXJuIGl0ZW1zV2l0aFNhbWVUeXBlLmxlbmd0aCBpcyBpdGVyYWJsZS5sZW5ndGhcblxuXHRpc0RvbU5vZGU6IChzdWJqZWN0KS0+IGNoZWNrSWYuaXNEb20oc3ViamVjdCkgb3Igc3ViamVjdCBpcyB3aW5kb3cgb3Igc3ViamVjdCBpcyBkb2N1bWVudCIsImZldGNoRGVzY3JpcHRvciA9IChvYmplY3QsIHByb3BlcnR5LCBpc1Byb3RvKS0+XG5cdGRlc2NyaXB0b3IgPSBnZXREZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpXG5cdGlmIGRlc2NyaXB0b3Jcblx0XHRkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWUgaWYgaXNQcm90b1xuXHRcdHJldHVybiBkZXNjcmlwdG9yXG5cdFxuXHRlbHNlIGlmIG9iamVjdFByb3RvPU9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpXG5cdFx0cmV0dXJuIGZldGNoRGVzY3JpcHRvcihvYmplY3RQcm90bywgcHJvcGVydHksIHRydWUpXG5cblxuY29udmVydFRvTGl2ZSA9IChiaW5kaW5nSW5zdGFuY2UsIG9iamVjdCwgb25seUFycmF5TWV0aG9kcyktPlxuXHRfID0gYmluZGluZ0luc3RhbmNlXG5cdF8ub3JpZ0Rlc2NyaXB0b3IgPSBmZXRjaERlc2NyaXB0b3Iob2JqZWN0LCBfLnByb3BlcnR5KSBpZiBub3QgXy5vcmlnRGVzY3JpcHRvclxuXG5cdGlmIG9ubHlBcnJheU1ldGhvZHNcblx0XHRhcnJheU11dGF0b3JNZXRob2RzLmZvckVhY2ggKG1ldGhvZCktPiAjIFVzaW5nIGZvckVhY2ggYmVjYXVzZSB3ZSBuZWVkIGEgY2xvc3VyZSBoZXJlXG5cdFx0XHRkZWZpbmVQcm9wZXJ0eSBvYmplY3QsIG1ldGhvZCwgXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdFx0XHR2YWx1ZTogKCktPlxuXHRcdFx0XHRcdHJlc3VsdCA9IEFycmF5OjpbbWV0aG9kXS5hcHBseSBvYmplY3QsIGFyZ3VtZW50c1xuXHRcdFx0XHRcdF8udXBkYXRlQWxsU3VicyhfKVxuXHRcdFx0XHRcdHJldHVybiByZXN1bHRcblxuXHRlbHNlXG5cdFx0aWYgXy50eXBlIGlzICdQcm94eSdcblx0XHRcdG9yaWdGbiA9IF8ub3JpZ0ZuID0gXy52YWx1ZVxuXHRcdFx0Y29udGV4dCA9IG9iamVjdFxuXHRcdFx0Xy52YWx1ZSA9IHJlc3VsdDpudWxsLCBhcmdzOm51bGxcblxuXHRcdFx0aWYgY2hlY2tJZi5pc0Z1bmN0aW9uKG9yaWdGbilcblx0XHRcdFx0c2xpY2UgPSBbXS5zbGljZVxuXHRcdFx0XHRnZXR0ZXJWYWx1ZSA9IHByb3h5Rm4gPSAoKS0+IFxuXHRcdFx0XHRcdGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cylcblx0XHRcdFx0XHRfLnZhbHVlLmFyZ3MgPSBhcmdzID0gaWYgXy5zZWxmVHJhbnNmb3JtIHRoZW4gXy5zZWxmVHJhbnNmb3JtKGFyZ3MpIGVsc2UgYXJnc1xuXHRcdFx0XHRcdF8udmFsdWUucmVzdWx0ID0gcmVzdWx0ID0gb3JpZ0ZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG5cdFx0XHRcdFx0Xy51cGRhdGVBbGxTdWJzKF8pXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdFx0XHRcblx0XHRcdFx0ZGVmaW5lUHJvcGVydHkgb2JqZWN0LCBfLnByb3BlcnR5LCBcblx0XHRcdFx0XHRjb25maWd1cmFibGU6IF8uaXNMaXZlUHJvcCA9IHRydWVcblx0XHRcdFx0XHRnZXQ6ICgpLT4gZ2V0dGVyVmFsdWVcblx0XHRcdFx0XHRzZXQ6IChuZXdWYWx1ZSktPlxuXHRcdFx0XHRcdFx0aWYgbm90IGNoZWNrSWYuaXNGdW5jdGlvbihuZXdWYWx1ZSlcblx0XHRcdFx0XHRcdFx0Z2V0dGVyVmFsdWUgPSBuZXdWYWx1ZVxuXG5cdFx0XHRcdFx0XHRlbHNlIGlmIG5ld1ZhbHVlIGlzbnQgb3JpZ0ZuXG5cdFx0XHRcdFx0XHRcdG9yaWdGbiA9IF8ub3JpZ0ZuID0gbmV3VmFsdWVcdGlmIG5ld1ZhbHVlIGlzbnQgcHJveHlGblxuXHRcdFx0XHRcdFx0XHRnZXR0ZXJWYWx1ZSA9IHByb3h5Rm5cdFx0XHRpZiBnZXR0ZXJWYWx1ZSBpc250IHByb3h5Rm5cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdFxuXG5cdFx0ZWxzZSBpZiBub3QgdGFyZ2V0SW5jbHVkZXMoXy50eXBlLCAnRE9NJykgYW5kIG5vdCAoXy5vYmplY3QgaXMgd2luZG93IGFuZCB0YXJnZXRJbmNsdWRlcyh3aW5kb3dQcm9wc1RvSWdub3JlLCBfLnByb3BlcnR5KSlcblx0XHRcblx0XHRcdCMgJ09iamVjdFByb3AnIG9yICdBcnJheScgdHlwZSBiaW5kaW5nc1xuXHRcdFx0cHJvcGVydHlEZXNjcmlwdG9yID0gXy5vcmlnRGVzY3JpcHRvciBvciBkdW1teVByb3BlcnR5RGVzY3JpcHRvclxuXHRcdFx0Xy5vcmlnR2V0dGVyID0gcHJvcGVydHlEZXNjcmlwdG9yLmdldC5iaW5kKG9iamVjdCkgaWYgcHJvcGVydHlEZXNjcmlwdG9yLmdldFxuXHRcdFx0Xy5vcmlnU2V0dGVyID0gcHJvcGVydHlEZXNjcmlwdG9yLnNldC5iaW5kKG9iamVjdCkgaWYgcHJvcGVydHlEZXNjcmlwdG9yLnNldFxuXHRcdFx0c2hvdWxkV3JpdGVMaXZlUHJvcCA9IHByb3BlcnR5RGVzY3JpcHRvci5jb25maWd1cmFibGVcblxuXHRcdFx0c2hvdWxkV3JpdGVMaXZlUHJvcCA9IHNob3VsZFdyaXRlTGl2ZVByb3AgYW5kIG9iamVjdC5jb25zdHJ1Y3RvciBpc250IENTU1N0eWxlRGVjbGFyYXRpb25cblx0XHRcdGltcG9ydCAnLi93ZWJraXREb21EZXNjcmlwdG9yRml4J1xuXHRcdFx0XG5cdFx0XHRpZiBzaG91bGRXcml0ZUxpdmVQcm9wXG5cdFx0XHRcdHR5cGVJc0FycmF5ID0gXy50eXBlIGlzICdBcnJheSdcblx0XHRcdFx0c2hvdWxkSW5kaWNhdGVVcGRhdGVJc0Zyb21TZWxmID0gbm90IF8ub3JpZ1NldHRlciBhbmQgbm90IHR5cGVJc0FycmF5XG5cdFx0XHRcdFxuXHRcdFx0XHRkZWZpbmVQcm9wZXJ0eSBvYmplY3QsIF8ucHJvcGVydHksXG5cdFx0XHRcdFx0Y29uZmlndXJhYmxlOiBfLmlzTGl2ZVByb3AgPSB0cnVlXG5cdFx0XHRcdFx0ZW51bWVyYWJsZTogcHJvcGVydHlEZXNjcmlwdG9yLmVudW1lcmFibGVcblx0XHRcdFx0XHRnZXQ6IF8ub3JpZ0dldHRlciBvciAoKS0+IF8udmFsdWVcblx0XHRcdFx0XHRzZXQ6IChuZXdWYWx1ZSktPiBfLnNldFZhbHVlKG5ld1ZhbHVlLCBfLCBzaG91bGRJbmRpY2F0ZVVwZGF0ZUlzRnJvbVNlbGYpOyByZXR1cm5cblxuXHRcdFx0XG5cdFx0XHRcdGlmIHR5cGVJc0FycmF5XG5cdFx0XHRcdFx0Y29udmVydFRvTGl2ZShfLCBvYmplY3RbXy5wcm9wZXJ0eV0sIHRydWUpXG5cblx0cmV0dXJuXG5cblxuXG5cblxuY29udmVydFRvUmVnID0gKGJpbmRpbmdJbnN0YW5jZSwgb2JqZWN0LCBvbmx5QXJyYXlNZXRob2RzKS0+XG5cdGlmIG9ubHlBcnJheU1ldGhvZHNcblx0XHRkZWxldGUgb2JqZWN0W21ldGhvZF0gZm9yIG1ldGhvZCBpbiBhcnJheU11dGF0b3JNZXRob2RzXG5cdGVsc2Vcblx0XHRfID0gYmluZGluZ0luc3RhbmNlXG5cdFx0bmV3RGVzY3JpcHRvciA9IF8ub3JpZ0Rlc2NyaXB0b3Jcblx0XHRuZXdEZXNjcmlwdG9yLnZhbHVlID0gKF8ub3JpZ0ZuIG9yIF8udmFsdWUpIHVubGVzcyBuZXdEZXNjcmlwdG9yLnNldCBvciBuZXdEZXNjcmlwdG9yLmdldFxuXHRcdGRlZmluZVByb3BlcnR5IG9iamVjdCwgXy5wcm9wZXJ0eSwgbmV3RGVzY3JpcHRvclxuXG5cblxuIiwiIyMjKlxuICogVGhlcmUgaXMgYSBidWcgaW4gd2Via2l0L2JsaW5rIGVuZ2luZXMgaW4gd2hpY2ggbmF0aXZlIGF0dHJpYnV0ZXMvcHJvcGVydGllcyBcbiAqIG9mIERPTSBlbGVtZW50cyBhcmUgbm90IGV4cG9zZWQgb24gdGhlIGVsZW1lbnQncyBwcm90b3R5cGUgYW5kIGluc3RlYWQgaXNcbiAqIGV4cG9zZWQgZGlyZWN0bHkgb24gdGhlIGVsZW1lbnQgaW5zdGFuY2U7IHdoZW4gbG9va2luZyB1cCB0aGUgcHJvcGVydHkgZGVzY3JpcHRvclxuICogb2YgdGhlIGVsZW1lbnQgYSBkYXRhIGRlc2NyaXB0b3IgaXMgcmV0dXJuZWQgaW5zdGVhZCBvZiBhbiBhY2Nlc3NvciBkZXNjcmlwdG9yXG4gKiAoaS5lLiBkZXNjcmlwdG9yIHdpdGggZ2V0dGVyL3NldHRlcikgd2hpY2ggbWVhbnMgd2UgYXJlIG5vdCBhYmxlIHRvIGRlZmluZSBvdXJcbiAqIG93biBwcm94eSBnZXR0ZXIvc2V0dGVycy4gVGhpcyB3YXMgZml4ZWQgb25seSBpbiBBcHJpbCAyMDE1IGluIENocm9tZSB2NDMgYW5kXG4gKiBTYWZhcmkgdjEwLiBBbHRob3VnaCB3ZSB3b24ndCBiZSBhYmxlIHRvIGdldCBub3RpZmllZCB3aGVuIHRoZSBvYmplY3RzIGdldFxuICogdGhlaXIgdmFsdWVzIHNldCwgd2Ugd291bGQgYXQgbGVhc3QgcHJvdmlkZSB3b3JraW5nIGZ1bmN0aW9uYWxpdHkgbGFja2luZyB1cGRhdGVcbiAqIGxpc3RlbmVycy4gU2luY2UgdjEuMTQuMCBIVE1MSW5wdXRFbGVtZW50Ojp2YWx1ZSBiaW5kaW5ncyBpbnZva2UgdGhlIG9yaWdpbmFsXG4gKiBnZXR0ZXIgYW5kIHNldHRlciBtZXRob2RzIGluIEJpbmRpbmc6OnNldFZhbHVlKCksIGFuZCBzaW5jZSB3ZSB3YW50IHRvIGF2b2lkXG4gKiBpbmNyZWFzaW5nIHRoZSBhbW91bnQgb2YgbG9naWMgcHJlc2VudCBpbiBCaW5kaW5nOjpzZXRWYWx1ZSgpIGZvciBwZXJmb3JtYW5jZVxuICogcmVhc29ucywgd2UgcGF0Y2ggdGhvc2Ugc2V0dGVycyBoZXJlLiBXZSBjbG9uZSB0aGUgdGFyZ2V0IGVsZW1lbnQgYW5kIGNoZWNrIGZvclxuICogdGhlIGV4aXN0ZW5jZSBvZiB0aGUgdGFyZ2V0IHByb3BlcnR5IC0gaWYgaXQgZXhpc3RzIHRoZW4gaXQgaW5kaWNhdGVzIHRoZSB0YXJnZXRcbiAqIHByb3BlcnR5IGlzIGEgbmF0aXZlIHByb3BlcnR5IChzaW5jZSBvbmx5IG5hdGl2ZSBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgb3ZlciBpblxuICogRWxlbWVudDo6Y2xvbmVOb2RlKS4gVGhpcyBwYXRjaGluZyBpcyBvbmx5IGZvciBuYXRpdmUgcHJvcGVydGllcy5cbiAqXG4gKiBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NDk3MzlcbiAqIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD03NTI5N1xuICogaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDMzOTRcbiAqIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQzMTQ5MlxuICogaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9MTMxNzVcbiAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi91cGRhdGVzLzIwMTUvMDQvRE9NLWF0dHJpYnV0ZXMtbm93LW9uLXRoZS1wcm90b3R5cGUtY2hhaW5cbiMjI1xuXG5pZiByZXF1aXJlc0RvbURlc2NyaXB0b3JGaXggYW5kIF8uaXNEb20gYW5kIF8ucHJvcGVydHkgb2Ygb2JqZWN0LmNsb25lTm9kZShmYWxzZSlcblx0Xy5vcmlnRGVzY3JpcHRvciA9IHNob3VsZFdyaXRlTGl2ZVByb3AgPSBmYWxzZVxuXHRfLmlzTGl2ZVByb3AgPSB0cnVlXG5cdF8ub3JpZ0dldHRlciA9ICgpLT4gXy5vYmplY3RbXy5wcm9wZXJ0eV1cblx0Xy5vcmlnU2V0dGVyID0gKG5ld1ZhbHVlKS0+IF8ub2JqZWN0W18ucHJvcGVydHldID0gbmV3VmFsdWUiLCJjbG9uZU9iamVjdCA9IChvYmplY3QpLT5cblx0Y2xvbmUgPSBnZW5PYmooKVxuXHRjbG9uZVtrZXldID0gb2JqZWN0W2tleV0gZm9yIGtleSBvZiBvYmplY3Rcblx0cmV0dXJuIGNsb25lXG5cbmV4dGVuZFN0YXRlID0gKGJhc2UsIHN0YXRlVG9Jbmhlcml0KS0+XG5cdHN0YXRlTWFwcGluZyA9IE9iamVjdC5rZXlzKHN0YXRlVG9Jbmhlcml0KVxuXHRiYXNlW2tleV0gPSBzdGF0ZVRvSW5oZXJpdFtrZXldIGZvciBrZXkgaW4gc3RhdGVNYXBwaW5nXG5cdHJldHVyblxuIiwiY2FjaGUgPVx0XG5cdGdldDogKG9iamVjdCwgaXNGdW5jdGlvbiwgc2VsZWN0b3IsIGlzTXVsdGlDaG9pY2UpLT5cblx0XHRpZiBpc0Z1bmN0aW9uXG5cdFx0XHRyZXR1cm4gYm91bmRJbnN0YW5jZXNbb2JqZWN0Ll9zYl9JRF1cblx0XHRlbHNlXG5cdFx0XHRpZiBpc011bHRpQ2hvaWNlIGFuZCBvYmplY3RbMF0uX3NiX21hcFxuXHRcdFx0XHRzYW1wbGVJdGVtID0gYm91bmRJbnN0YW5jZXNbIG9iamVjdFswXS5fc2JfbWFwW3NlbGVjdG9yXSBdXG5cdFx0XHRcdFxuXHRcdFx0XHRyZXR1cm4gc2FtcGxlSXRlbS5ncm91cEJpbmRpbmcgaWYgc2FtcGxlSXRlbS5ncm91cEJpbmRpbmdcblxuXHRcdFx0aWYgb2JqZWN0Ll9zYl9tYXAgYW5kIG9iamVjdC5fc2JfbWFwW3NlbGVjdG9yXVxuXHRcdFx0XHRyZXR1cm4gYm91bmRJbnN0YW5jZXNbIG9iamVjdC5fc2JfbWFwW3NlbGVjdG9yXSBdXG5cblxuXHRzZXQ6IChCLCBpc0Z1bmN0aW9uKS0+ICMgQiA9PT09IEJpbmRpbmcgT2JqZWN0XG5cdFx0aWYgaXNGdW5jdGlvblxuXHRcdFx0ZGVmaW5lUHJvcGVydHkgQi5vYmplY3QsICdfc2JfSUQnLCB7J2NvbmZpZ3VyYWJsZSc6dHJ1ZSwgJ3ZhbHVlJzpCLklEfVxuXG5cdFx0ZWxzZVxuXHRcdFx0c2VsZWN0b3IgPSBCLnNlbGVjdG9yXG5cblx0XHRcdGlmIEIub2JqZWN0Ll9zYl9tYXBcblx0XHRcdFx0Qi5vYmplY3QuX3NiX21hcFtzZWxlY3Rvcl0gPSBCLklEXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHByb3BzTWFwID0ge31cblx0XHRcdFx0cHJvcHNNYXBbc2VsZWN0b3JdID0gQi5JRFxuXHRcdFx0XHRcblx0XHRcdFx0ZGVmaW5lUHJvcGVydHkgQi5vYmplY3QsICdfc2JfbWFwJywgeydjb25maWd1cmFibGUnOnRydWUsICd2YWx1ZSc6cHJvcHNNYXB9XG5cdFx0cmV0dXJuIiwiZXNjYXBlUmVnRXggPSAvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2dcbnBob2xkZXJSZWdFeCA9IHBob2xkZXJSZWdFeFNwbGl0ID0gbnVsbFxuXG5zZXRQaG9sZGVyUmVnRXggPSAoKS0+XG5cdHN0YXJ0ID0gc2V0dGluZ3MucGxhY2Vob2xkZXJbMF0ucmVwbGFjZShlc2NhcGVSZWdFeCwgJ1xcXFwkJicpXG5cdGVuZCA9IHNldHRpbmdzLnBsYWNlaG9sZGVyWzFdLnJlcGxhY2UoZXNjYXBlUmVnRXgsICdcXFxcJCYnKVxuXHRtaWRkbGUgPSBcIlteI3tlbmR9XStcIlxuXHRwaG9sZGVyUmVnRXggPSBuZXcgUmVnRXhwKFwiI3tzdGFydH0oI3ttaWRkbGV9KSN7ZW5kfVwiLCAnZycpXG5cdHBob2xkZXJSZWdFeFNwbGl0ID0gbmV3IFJlZ0V4cChcIiN7c3RhcnR9I3ttaWRkbGV9I3tlbmR9XCIsICdnJylcblx0cmV0dXJuXG5cbnNldFBob2xkZXJSZWdFeCgpICMgQ3JlYXRlIHRoZSByZWdFeCBvbiBpbml0XG5cblxuXG5hcHBseVBsYWNlaG9sZGVycyA9IChjb250ZXh0cywgdmFsdWVzLCBpbmRleE1hcCktPlxuXHRvdXRwdXQgPSAnJ1xuXHRmb3IgY29udGV4dFBhcnQsaW5kZXggaW4gY29udGV4dHNcblx0XHRvdXRwdXQgKz0gY29udGV4dFBhcnRcblx0XHRvdXRwdXQgKz0gdmFsdWVzW2luZGV4TWFwW2luZGV4XV0gaWYgaW5kZXhNYXBbaW5kZXhdXG5cdFxuXHRyZXR1cm4gb3V0cHV0XG5cblxudGV4dENvbnRlbnQgPSAndGV4dENvbnRlbnQnXG5cbmFkZFRvTm9kZVN0b3JlID0gKG5vZGVTdG9yZSwgbm9kZSwgdGFyZ2V0UGxhY2Vob2xkZXIpLT5cblx0bm9kZVN0b3JlW3RhcmdldFBsYWNlaG9sZGVyXSA/PSBbXVxuXHRub2RlU3RvcmVbdGFyZ2V0UGxhY2Vob2xkZXJdLnB1c2gobm9kZSlcblx0cmV0dXJuXG5cblxuc2NhblRleHROb2Rlc1BsYWNlaG9sZGVycyA9IChlbGVtZW50LCBub2RlU3RvcmUpLT5cblx0Y2hpbGROb2RlcyA9IEFycmF5OjpzbGljZS5jYWxsKGVsZW1lbnQuY2hpbGROb2Rlcylcblx0Zm9yIG5vZGUgaW4gY2hpbGROb2Rlc1xuXHRcdGlmIG5vZGUubm9kZVR5cGUgaXNudCAzIFxuXHRcdFx0c2NhblRleHROb2Rlc1BsYWNlaG9sZGVycyhub2RlLCBub2RlU3RvcmUpXG5cdFx0XG5cdFx0ZWxzZSBpZiBub2RlW3RleHRDb250ZW50XS5tYXRjaChwaG9sZGVyUmVnRXhTcGxpdClcblx0XHRcdHRleHRQaWVjZXMgPSBub2RlW3RleHRDb250ZW50XS5zcGxpdChwaG9sZGVyUmVnRXgpXG5cblx0XHRcdGlmIHRleHRQaWVjZXMubGVuZ3RoIGlzIDMgYW5kIHRleHRQaWVjZXNbMF0rdGV4dFBpZWNlc1syXSBpcyAnJyAjIFRoZSBlbnRpcmUgdGV4dE5vZGUgaXMganVzdCB0aGUgcGxhY2Vob2xkZXJcblx0XHRcdFx0YWRkVG9Ob2RlU3RvcmUobm9kZVN0b3JlLCBub2RlLCB0ZXh0UGllY2VzWzFdKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRuZXdGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXG5cdFx0XHRcdGZvciB0ZXh0UGllY2UsaW5kZXggaW4gdGV4dFBpZWNlc1xuXHRcdFx0XHRcdG5ld05vZGUgPSBuZXdGcmFnbWVudC5hcHBlbmRDaGlsZCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0UGllY2UpXG5cdFx0XHRcdFx0aWYgaW5kZXggJSAyICMgaXMgYW4gb2RkIGluZGV4LCBpbmRpY2F0aW5nIHRoYXQgYmVmb3JlIHRoaXMgdGV4dCBwaWVjZSBzaG91bGQgY29tZSBhIHBsYWNlaG9sZGVyIG5vZGVcblx0XHRcdFx0XHRcdGFkZFRvTm9kZVN0b3JlKG5vZGVTdG9yZSwgbmV3Tm9kZSwgdGV4dFBpZWNlKVxuXG5cdFx0XHRcdG5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3RnJhZ21lbnQsIG5vZGUpXG5cblx0cmV0dXJuXG5cblxuXG4iLCJ0aHJvd0Vycm9yID0gKGVycm9yTmFtZSktPlxuXHR0aHJvdyBuZXcgRXJyb3IgJ1NpbXBseUJpbmQ6ICcrKGVycm9yc1tlcnJvck5hbWVdIG9yIGVycm9yTmFtZSlcblxudGhyb3dXYXJuaW5nID0gKHdhcm5pbmdOYW1lLCBkZXB0aCktPiB1bmxlc3Mgc2V0dGluZ3Muc2lsZW50XG5cdGVyclNvdXJjZSA9IGdldEVyclNvdXJjZShkZXB0aClcblx0d2FybiA9IGVycm9yc1t3YXJuaW5nTmFtZV1cblx0d2FybiArPSBcIlxcblxcblwiK2VyclNvdXJjZVxuXHRjb25zb2xlLndhcm4oJ1NpbXBseUJpbmQ6ICcrd2Fybilcblx0cmV0dXJuXG5cbnRocm93RXJyb3JCYWRBcmcgPSAoYXJnKS0+XG5cdHRocm93RXJyb3IgXCJJbnZhbGlkIGFyZ3VtZW50L3MgKCN7YXJnfSlcIiwgdHJ1ZVxuXHRyZXR1cm5cblxuZ2V0RXJyU291cmNlID0gKGRlcHRoKS0+XG5cdCgobmV3IEVycm9yKS5zdGFjayBvciAnJylcblx0XHQuc3BsaXQoJ1xcbicpXG5cdFx0LnNsaWNlKGRlcHRoKzMpXG5cdFx0LmpvaW4oJ1xcbicpXG5cblxuIiwiZXJyb3JzID0gXG5cdGludmFsaWRQYXJhbU5hbWU6IFwiU2ltcGx5QmluZCgpIGFuZCAudG8oKSBvbmx5IGFjY2VwdCBhIGZ1bmN0aW9uLCBhbiBhcnJheSwgYSBib3VuZCBvYmplY3QsIGEgc3RyaW5nLCBvciBhIG51bWJlci5cIlxuXHRmbk9ubHk6IFwiT25seSBmdW5jdGlvbnMgYXJlIGFsbG93ZWQgZm9yIC50cmFuc2Zvcm0vLmNvbmRpdGlvbi9BbGwoKVwiXG5cdGJhZEV2ZW50QXJnOiBcIkludmFsaWQgYXJndW1lbnQgbnVtYmVyIGluIC5vZkV2ZW50KClcIlxuXHRlbXB0eUxpc3Q6IFwiRW1wdHkgY29sbGVjdGlvbiBwcm92aWRlZFwiXG5cdFxuXHRvbmx5T25lRE9NRWxlbWVudDogXCJZb3UgY2FuIG9ubHkgcGFzcyBhIHNpbmdsZSBET00gZWxlbWVudCB0byBhIGJpbmRpbmdcIlxuXHRtaXhlZEVsTGlzdDogXCInY2hlY2tlZCcgb2YgTWl4ZWQgbGlzdCBvZiBlbGVtZW50IGNhbm5vdCBiZSBib3VuZFwiXG4iLCJTaW1wbHlCaW5kID0gKHN1YmplY3QsIG9wdGlvbnMsIHNhdmVPcHRpb25zLCBpc1N1YiwgY29tcGxldGVDYWxsYmFjayktPlxuXHRpZiAoIXN1YmplY3QgYW5kIHN1YmplY3QgaXNudCAwKSBvciAoIWNoZWNrSWYuaXNTdHJpbmcoc3ViamVjdCkgYW5kICFjaGVja0lmLmlzTnVtYmVyKHN1YmplY3QpIGFuZCAhY2hlY2tJZi5pc0Z1bmN0aW9uKHN1YmplY3QpIGFuZCBzdWJqZWN0IG5vdCBpbnN0YW5jZW9mIEFycmF5KVxuXHRcdHRocm93RXJyb3IoJ2ludmFsaWRQYXJhbU5hbWUnKSB1bmxlc3MgY2hlY2tJZi5pc0JpbmRpbmdJbnRlcmZhY2Uoc3ViamVjdClcblxuXHRpZiBjaGVja0lmLmlzT2JqZWN0KHN1YmplY3QpIGFuZCBzdWJqZWN0IG5vdCBpbnN0YW5jZW9mIEFycmF5ICMgSW5kaWNhdGVzIGl0J3MgYSBCaW5kaW5nIGluc3RhbmNlIG9iamVjdCBkdWUgdG8gdGhlIGFib3ZlIGNoZWNrXG5cdFx0aW50ZXJmYWNlVG9SZXR1cm4gPSBpZiBjb21wbGV0ZUNhbGxiYWNrIHRoZW4gY29tcGxldGVDYWxsYmFjayhzdWJqZWN0KSBlbHNlIHN1YmplY3Quc2VsZkNsb25lKClcblx0XG5cdGVsc2Vcblx0XHRuZXdJbnRlcmZhY2UgPSBuZXcgQmluZGluZ0ludGVyZmFjZShvcHRpb25zKVxuXHRcdG5ld0ludGVyZmFjZS5zYXZlT3B0aW9ucyA9IHNhdmVPcHRpb25zXG5cdFx0bmV3SW50ZXJmYWNlLmlzU3ViID0gaXNTdWJcblx0XHRuZXdJbnRlcmZhY2UuY29tcGxldGVDYWxsYmFjayA9IGNvbXBsZXRlQ2FsbGJhY2tcblxuXHRcdGlmIGNoZWNrSWYuaXNGdW5jdGlvbihzdWJqZWN0KVxuXHRcdFx0aW50ZXJmYWNlVG9SZXR1cm4gPSBuZXdJbnRlcmZhY2Uuc2V0T2JqZWN0KHN1YmplY3QsIHRydWUpXG5cdFx0ZWxzZVxuXHRcdFx0aW50ZXJmYWNlVG9SZXR1cm4gPSBuZXdJbnRlcmZhY2Uuc2V0UHJvcGVydHkoc3ViamVjdClcblxuXHRyZXR1cm4gaW50ZXJmYWNlVG9SZXR1cm5cblxuXG5cblxuaW1wb3J0ICcuL21ldGhvZHMnIiwiU2ltcGx5QmluZC52ZXJzaW9uID0gaW1wb3J0ICcuLi8uLi9wYWNrYWdlLmpzb24gJCB2ZXJzaW9uJ1xuU2ltcGx5QmluZC5zZXR0aW5ncyA9IHNldHRpbmdzXG5TaW1wbHlCaW5kLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnNcblxuXG5cblNpbXBseUJpbmQudW5CaW5kQWxsID0gKG9iamVjdCwgYm90aFdheXMpLT5cblx0aWYgb2JqZWN0IGFuZCAoY2hlY2tJZi5pc09iamVjdChvYmplY3QpIG9yIGNoZWNrSWYuaXNGdW5jdGlvbihvYmplY3QpKVxuXHRcdGltcG9ydCAnLi9tZXRob2RzLnVuQmluZEFsbC1wYXJzZURPTU9iamVjdC5jb2ZmZWUnXG5cdFx0cHJvcE1hcCA9IG9iamVjdC5fc2JfbWFwXHRcdFxuXG5cdFx0aWYgb2JqZWN0Ll9zYl9JRFxuXHRcdFx0Ym91bmRJbnN0YW5jZXNbb2JqZWN0Ll9zYl9JRF0ucmVtb3ZlQWxsU3Vicyhib3RoV2F5cylcblx0XHRcblx0XHRpZiBwcm9wTWFwXG5cdFx0XHRib3VuZEluc3RhbmNlc1tib3VuZElEXS5yZW1vdmVBbGxTdWJzKGJvdGhXYXlzKSBmb3IgcHJvcCwgYm91bmRJRCBvZiBwcm9wTWFwXG5cblx0cmV0dXJuXG5cbiIsIntcbiAgXCJfYXJnc1wiOiBbXG4gICAgW1xuICAgICAgXCJAZGFuaWVsa2FsZW4vc2ltcGx5YmluZEAxLjE1LjhcIixcbiAgICAgIFwiL1VzZXJzL2RhbmllbGthbGVuL3NhbmRib3gvcXVpY2tmaWVsZFwiXG4gICAgXVxuICBdLFxuICBcIl9mcm9tXCI6IFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRAMS4xNS44XCIsXG4gIFwiX2lkXCI6IFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRAMS4xNS44XCIsXG4gIFwiX2luQnVuZGxlXCI6IGZhbHNlLFxuICBcIl9pbnRlZ3JpdHlcIjogXCJzaGE1MTItcmtsK3dIYmJDb1BvMkEzVk5EQXQ1dXlWWCtsQkhvZU5aZkRBb0lWTnNsUkVVQUY5WktrUDZzWXA5eXFGTE5ZM2ptcjhsK3l5TXFNR3N4cUJaR3o1OHc9PVwiLFxuICBcIl9sb2NhdGlvblwiOiBcIi9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZFwiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwidmVyc2lvblwiLFxuICAgIFwicmVnaXN0cnlcIjogdHJ1ZSxcbiAgICBcInJhd1wiOiBcIkBkYW5pZWxrYWxlbi9zaW1wbHliaW5kQDEuMTUuOFwiLFxuICAgIFwibmFtZVwiOiBcIkBkYW5pZWxrYWxlbi9zaW1wbHliaW5kXCIsXG4gICAgXCJlc2NhcGVkTmFtZVwiOiBcIkBkYW5pZWxrYWxlbiUyZnNpbXBseWJpbmRcIixcbiAgICBcInNjb3BlXCI6IFwiQGRhbmllbGthbGVuXCIsXG4gICAgXCJyYXdTcGVjXCI6IFwiMS4xNS44XCIsXG4gICAgXCJzYXZlU3BlY1wiOiBudWxsLFxuICAgIFwiZmV0Y2hTcGVjXCI6IFwiMS4xNS44XCJcbiAgfSxcbiAgXCJfcmVxdWlyZWRCeVwiOiBbXG4gICAgXCIvXCJcbiAgXSxcbiAgXCJfcmVzb2x2ZWRcIjogXCJodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC8tL3NpbXBseWJpbmQtMS4xNS44LnRnelwiLFxuICBcIl9zcGVjXCI6IFwiMS4xNS44XCIsXG4gIFwiX3doZXJlXCI6IFwiL1VzZXJzL2RhbmllbGthbGVuL3NhbmRib3gvcXVpY2tmaWVsZFwiLFxuICBcImF1dGhvclwiOiB7XG4gICAgXCJuYW1lXCI6IFwiZGFuaWVsa2FsZW5cIlxuICB9LFxuICBcImJyb3dzZXJcIjoge1xuICAgIFwiLi9kaXN0L3NpbXBseWJpbmQubm9kZS5kZWJ1Zy5qc1wiOiBcInNyYy9pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3NpbXBseWJpbmQuZGVidWcuanNcIlxuICB9LFxuICBcImJyb3dzZXJpZnlcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwic2ltcGx5aW1wb3J0L2NvbXBhdFwiXG4gICAgXVxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3NpbXBseWJpbmQvaXNzdWVzXCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge30sXG4gIFwiZGVzY3JpcHRpb25cIjogXCJNYWdpY2FsbHkgc2ltcGxlLCBmcmFtZXdvcmstbGVzcyBvbmUtd2F5L3R3by13YXkgZGF0YSBiaW5kaW5nIGZvciBmcm9udGVuZC9iYWNrZW5kIGluIH41a2IuXCIsXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjb2ZmZWUtc2NyaXB0XCI6IFwiXjEuMTIuNlwiLFxuICAgIFwiZnMtamV0cGFja1wiOiBcIl4wLjEzLjFcIixcbiAgICBcInByb21pc2UtYnJlYWtcIjogXCJeMC4xLjFcIixcbiAgICBcInNlbXZlclwiOiBcIl41LjMuMFwiLFxuICAgIFwic2ltcGx5aW1wb3J0XCI6IFwiXjQuMC4wLXM0XCIsXG4gICAgXCJzaW1wbHl3YXRjaFwiOiBcIl4zLjAuMC1sMlwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vc2ltcGx5YmluZCNyZWFkbWVcIixcbiAgXCJrZXl3b3Jkc1wiOiBbXG4gICAgXCJiaW5kXCIsXG4gICAgXCJiaW5kaW5nXCIsXG4gICAgXCJkb20tYmluZGluZ1wiLFxuICAgIFwib25lLXdheVwiLFxuICAgIFwidHdvLXdheVwiXG4gIF0sXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcIm1haW5cIjogXCJkaXN0L3NpbXBseWJpbmQubm9kZS5kZWJ1Zy5qc1wiLFxuICBcIm5hbWVcIjogXCJAZGFuaWVsa2FsZW4vc2ltcGx5YmluZFwiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zaW1wbHliaW5kLmdpdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJiZW5jaG1hcmtzXCI6IFwiY2FrZSBpbnN0YWxsOmJlbmNoOyBucG0gcnVuIGJlbmNobWFya3M6YnVpbGQgJiYgbnBtIHJ1biBiZW5jaG1hcmtzOnNlcnZlXCIsXG4gICAgXCJiZW5jaG1hcmtzOmJ1aWxkXCI6IFwiYmVuY2htYXJrcyBidWlsZCAtcyBiZW5jaG1hcmtzL3NyYyAtZCBiZW5jaG1hcmtzL2Rlc3RcIixcbiAgICBcImJlbmNobWFya3M6cnVuXCI6IFwiYmVuY2htYXJrcyBydW4gLWQgYmVuY2htYXJrcy9kZXN0XCIsXG4gICAgXCJiZW5jaG1hcmtzOnNlcnZlXCI6IFwiYmVuY2htYXJrcyBzZXJ2ZSAtZCBiZW5jaG1hcmtzL2Rlc3RcIixcbiAgICBcImJlbmNobWFya3M6dXBkYXRlXCI6IFwiY2FrZSBpbnN0YWxsOmJlbmNoOyBjYWtlIHVwZGF0ZVNCQmVuY2g7IG5wbSBydW4gYmVuY2htYXJrczpidWlsZFwiLFxuICAgIFwiYnVpbGRcIjogXCJjYWtlIC1kIGJ1aWxkICYmIGNha2UgYnVpbGQgJiYgY2FrZSBtZWFzdXJlICYmIGNwIC1yIGJ1aWxkLyogZGlzdC9cIixcbiAgICBcImNvdmVyYWdlXCI6IFwiY2FrZSBpbnN0YWxsOmNvdmVyYWdlOyBucG0gcnVuIGNvdmVyYWdlOnJ1biAmJiBucG0gcnVuIGNvdmVyYWdlOmJhZGdlXCIsXG4gICAgXCJjb3ZlcmFnZTpiYWRnZVwiOiBcImJhZGdlLWdlbiAtZCAuLy5jb25maWcvYmFkZ2VzL2NvdmVyYWdlXCIsXG4gICAgXCJjb3ZlcmFnZTpydW5cIjogXCJpc3RhbmJ1bCBjb3ZlciAtLWRpciBjb3ZlcmFnZS9ub2RlIG5vZGVfbW9kdWxlcy9tb2NoYS9iaW4vX21vY2hhIC0tIC11IHRkZCAtYiB0ZXN0L3Rlc3RIZWxwZXJzLmpzIHRlc3QvdGVzdC5qc1wiLFxuICAgIFwicG9zdHB1Ymxpc2hcIjogXCJnaXQgcHVzaFwiLFxuICAgIFwicG9zdHZlcnNpb25cIjogXCJucG0gcnVuIGJ1aWxkICYmIG5wbSBydW4gYmVuY2htYXJrczp1cGRhdGUgJiYgZ2l0IGFkZCAuICYmIGdpdCBjb21taXQgLWEgLW0gJ1tCdWlsZF0nXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcIm5wbSBydW4gdGVzdFwiLFxuICAgIFwidGVzdFwiOiBcIm5wbSBydW4gdGVzdDpub2RlIC1zICYmIG5wbSBydW4gdGVzdDpicm93c2VyIC1zICYmIG5wbSBydW4gdGVzdDptaW5pZmllZCAtc1wiLFxuICAgIFwidGVzdDpicm93c2VyXCI6IFwiY2FrZSBpbnN0YWxsOmthcm1hOyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBFbGVjdHJvbiAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmJyb3dzZXI6bG9jYWxcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgb3BlbiB0ZXN0L3Rlc3RydW5uZXIuaHRtbFwiLFxuICAgIFwidGVzdDprYXJtYVwiOiBcImNha2UgaW5zdGFsbDprYXJtYTsga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDptaW5pZmllZFwiOiBcIm1pbmlmaWVkPTEgbnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpub2RlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IG1vY2hhIC11IHRkZCAtLWNvbXBpbGVycyBjb2ZmZWU6Y29mZmVlLXJlZ2lzdGVyIHRlc3Qvbm9kZS5jb2ZmZWVcIixcbiAgICBcInRlc3Q6c2F1Y2VcIjogXCJjYWtlIGluc3RhbGw6a2FybWE7IHNhdWNlPTEga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwid2F0Y2hcIjogXCJjYWtlIC1kIHdhdGNoXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXN1cGVyXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktcmVuYW1lXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc2ltcGxlXCJcbiAgICBdXG4gIH0sXG4gIFwidmVyc2lvblwiOiBcIjEuMTUuOFwiXG59XG4iLCIjIyMqXG4gKiBDb25kaXRpb25hbCBDaGVja3M6XG4gKlxuICogMSkgTWFrZSBzdXJlIHRoZSBzdWJqZWN0IG9iamVjdCBpcyBpdGVyYWJsZSAoYW5kIHRodXMgYSBwb3NzaWJsZSBjYW5kaWRhdGUgZm9yIGJlaW5nIGFuIGVsZW1lbnQgY29sbGVjdGlvbilcbiAqIDIpIE1ha2Ugc3VyZSB0aGUgc3ViamVjdCBvYmplY3QgaXNuJ3QgYW4gYXJyYXkgYmluZGluZyAoc2luY2UgZWxlbWVudCBjb2xsZWN0aW9uIG9iamVjdHMgZG9uJ3QgZ2V0IGRpcmVjdGx5IGJvdW5kKVxuICogMykgTWFrZSBzdXJlIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uIGlzIGEgdmFsaWQgb2JqZWN0IChpLmUuIGlzbid0IHVuZGVmaW5lZCBhbmQgaXNuJ3QgbnVsbClcbiAqIDQpIE1ha2Ugc3VyZSB0aGUgZmlyc3QgZWxlbWVudCBpcyBhIERPTSBvYmplY3RcbiMjI1xuaWYgY2hlY2tJZi5pc0l0ZXJhYmxlKG9iamVjdCkgYW5kIG5vdCBvYmplY3QuX3NiX0lEIGFuZCBvYmplY3RbMF0gYW5kIChjaGVja0lmLmlzRG9tKG9iamVjdFswXSkpXG5cdG9iamVjdCA9IG9iamVjdFswXSIsIkJpbmRpbmcgPSAob2JqZWN0LCB0eXBlLCBzdGF0ZSktPlxuXHRleHRlbmRTdGF0ZShALCBzdGF0ZSlcblx0QG9wdGlvbnNEZWZhdWx0ID0gaWYgQHNhdmVPcHRpb25zIHRoZW4gQG9wdGlvbnMgZWxzZSBkZWZhdWx0T3B0aW9uc1xuXHRAdHlwZSA9IHR5cGVcdFx0XHRcdFx0XHRcdCMgT2JqZWN0UHJvcCB8IEFycmF5IHwgRnVuYyB8IFByb3h5IHwgRXZlbnQgfCBQaG9sZGVyIHwgRE9NQXR0ciB8IERPTUNoZWNrYm94IHwgRE9NUmFkaW9cblx0QG9iamVjdCA9IG9iamVjdCBcdFx0XHRcdFx0XHQjIFRoZSBzdWJqZWN0IG9iamVjdCBvZiB0aGlzIGJpbmRpbmcsIGkuZS4gZnVuY3Rpb24sIGFycmF5LCB7fSwgRE9NIGVsLCBldGMuXG5cdEBJRCA9IGdlbklEKCkgXHRcdFx0XHRcdFx0XHQjIEFzc2lnbmVkIG9ubHkgYWZ0ZXIgcGFzc2luZyBhIHZhbGlkIG9iamVjdCB0byAub2YoKVxuXHRAc3VicyA9IFtdXHRcdFx0XHRcdFx0XHRcdCMgU3Vic2NyaWJlcnMgYXJyYXkgbGlzdGluZyBhbGwgb2YgdGhlIG9iamVjdHMgdGhhdCB3aWxsIGJlIHVwZGF0ZWQgdXBvbiB2YWx1ZSB1cGRhdGVcblx0QHN1YnNNZXRhID0gZ2VuT2JqKClcdFx0XHRcdFx0IyBNYXAgc3Vic2NyaWJlcnMnIElEIHRvIHRoZWlyIG1ldGFkYXRhIChpLmUuIG9wdGlvbnMsIHRyYW5zZm9ybSwgY29uZGl0aW9uLCBvbmUtdGltZS1iaW5kaW5nLCBldGMuKVxuXHRAcHVic01hcCA9IGdlbk9iaigpXHRcdFx0XHRcdFx0IyBNYXAgcHVibGlzaGVycyAoYmluZGluZ3MgdGhhdCB1cGRhdGUgdGhpcyBiaW5kaW5nKSBieSB0aGVpciBJRFxuXHRAYXR0YWNoZWRFdmVudHMgPSBbXVx0XHRcdFx0XHQjIEFycmF5IGxpc3RpbmcgYWxsIG9mIHRoZSBldmVudHMgY3VycmVudGx5IGxpc3RlbmVkIG9uIEBvYmplY3Rcblx0QHNldFZhbHVlID0gc2V0VmFsdWVOb29wIGlmIEB0eXBlIGlzICdQcm94eSdcblxuXHQjID09PT0gUHJvcGVydGllcyBkZWNsYXJlZCBsYXRlciBvciBpbmhlcml0ZWQgZnJvbSBiaW5kaW5nIGludGVyZmFjZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBAb3B0aW9ucyA9IG9wdGlvbnNcblx0IyBAdmFsdWUgPSB1bmRlZmluZWQgXHRcdFx0XHRcdCMgV2lsbCByZXByZXNlbnQgdGhlIGFjdHVhbCBjdXJyZW50IHZhbHVlIG9mIHRoZSBiaW5kaW5nL29iamVjdFxuXHQjIEBwcm9wZXJ0eSA9IHByb3BlcnR5XHRcdFx0XHRcdCMgVGhlIHByb3BlcnR5IG5hbWUgb3IgYXJyYXkgaW5kZXggb3IgZXZlbnQgY2FsbGJhY2sgYXJndW1lbnRcblx0IyBAc2VsZWN0b3IgPSBzZWxlY3Rvclx0XHRcdFx0XHQjIFRoZSBwcm9wZXJ0eSBuYW1lIG9yIGFycmF5IGluZGV4IG9yIGV2ZW50IGNhbGxiYWNrIGFyZ3VtZW50XG5cdCMgQG9yaWdGbiA9IEZ1bmN0aW9uXHRcdFx0XHRcdCMgVGhlIG9yaWdpbmFsIHByb3hpZWQgZnVuY3Rpb24gcGFzc2VkIHRvIFByb3h5IGJpbmRpbmdzXG5cdCMgQGN1c3RvbUV2ZW50TWV0aG9kID0ge31cdFx0XHRcdCMgTmFtZXMgb2YgdGhlIGV2ZW50IGVtaXR0ZXIvdHJpZ2dlciBtZXRob2RzIChpZiBhcHBsaWNhYmxlKVxuXHQjIEBwaG9sZGVyQ29udGV4dHMgPSB7fVx0XHRcdFx0XHQjIFBsYWNlaG9sZGVyIHN1cnJvdW5kaW5ncyAob3JpZ2luYWwgYmluZGluZyB2YWx1ZSBzcGxpdCBieSB0aGUgcGxhY2Vob2xkZXIgcmVnRXgpXG5cdCMgQHBob2xkZXJJbmRleE1hcCA9IHt9XHRcdFx0XHRcdCMgUGxhY2Vob2xkZXIgb2NjdXJlbmNlIG1hcHBpbmcsIGkuZS4gdGhlIHBsYWNlaG9sZGVyIG5hbWUgZm9yIGVhY2ggcGxhY2Vob2xkZXIgb2NjdXJlbmNlXG5cdCMgQHBsYWNlaG9sZGVyID0gXCJcIlx0XHRcdFx0XHRcdCMgVGhlIGxhc3Qgc3BlY2lmaWVkIHBsYWNlaG9sZGVyIHRvIGJpbmQgdGhlIHZhbHVlIHRvXG5cdCMgQGRlc2NyaXB0b3IgPSBbXVx0XHRcdFx0XHRcdCMgRGVzY3JpYmVzIHRoZSB0eXBlIG9mIHByb3BlcnR5LCBpLmUuICdhdHRyOmRhdGEtbmFtZScgdG8gaW5kaWNhdGUgYSBET01BdHRyIHR5cGUgYmluZGluZ1xuXHQjIEBpc0xpdmVQcm9wID0gQm9vbGVhblx0XHRcdFx0XHQjIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgT2JqZWN0L09iamVjdCdzIHByb3BldHkgaGF2ZSBiZWVuIG1vZGlmaWVkIHRvIGJlIGEgbGl2ZSBwcm9wZXJ0eVxuXHQjIEBpc0RvbSA9IEJvb2xlYW5cdFx0XHRcdFx0XHQjIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgYmluZGluZydzIG9iamVjdCBpcyBhIERPTSBvYmplY3Rcblx0IyBAcG9sbEludGVydmFsID0gSURcdFx0XHRcdFx0IyBUaGUgaW50ZXJ2YWwgSUQgb2YgdGhlIHRpbWVyIHRoYXQgbWFudWFsbHkgcG9sbHMgdGhlIG9iamVjdCdzIHZhbHVlIGF0IGEgc2V0IGludGVydmFsXG5cdCMgQGFycmF5QmluZGluZyA9IEJpbmRpbmdcdFx0XHRcdCMgUmVmZXJlbmNlIHRvIHRoZSBwYXJlbnQgYXJyYXkgYmluZGluZyAoaWYgZXhpc3RzKSBmb3IgYW4gaW5kZXgtb2YtYXJyYXkgYmluZGluZyAoaS5lLiBTaW1wbHlCaW5kKGFycmF5KSlcblx0IyBAZXZlbnROYW1lID0gXCJcIlx0XHRcdFx0XHRcdCMgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRoaXMgYmluZGluZyBpcyBsaXN0ZW5pbmcgdG8gKGZvciBFdmVudCB0eXBlIGJpbmRpbmdzKVxuXHQjIEBpc0VtaXR0ZXIgPSBCb29sZWFuIFx0XHRcdFx0XHQjIFRyYWNrZXIgdG8gbGV0IHVzIGtub3cgd2Ugc2hvdWxkbid0IGhhbmRsZSB0aGUgZXZlbnQgdXBkYXRlIHdlIHJlY2VpdmVkIGFzIGl0IGlzIHRoZSBldmVudCB0aGlzIGJpbmRpbmcganVzdCBlbWl0dGVkXG5cdCMgQGV2ZW50SGFuZGxlciA9IEZ1bmN0aW9uIFx0XHRcdFx0IyBUaGUgY2FsbGJhY2sgdGhhdCBnZXRzIHRyaWdnZXJlZCB1cG9uIGFuIGV2ZW50IGVtaXR0YW5jZSAoZm9yIEV2ZW4gdHlwZSBiaW5kaW5ncylcblx0IyBAZXZlbnRPYmplY3QgPSBFdmVudCBcdFx0XHRcdFx0IyBUaGUgZGlzcGF0Y2hlZCBldmVudCBvYmplY3QgKGZvciBFdmVudCB0eXBlIGJpbmRpbmdzKVxuXHQjIEBzZWxmVHJhbnNmb3JtID0gRnVuY3Rpb24gXHRcdFx0IyBUaGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHRoYXQgbmV3IHZhbHVlcyBiZWluZyBzZXQgdG8gdGhpcyBiaW5kaW5nIGFyZSBiZWluZyBwYXNzZWQgdGhyb3VnaCBkdXJpbmcgQHNldFZhbHVlIChpZiBhcHBsaWNhYmxlKVxuXHQjIEBzZWxmVXBkYXRlciA9IEZ1bmN0aW9uIFx0XHRcdFx0IyBBIEZ1bmMtdHlwZSBCaW5kaW5nIHdoaWNoIGludm9rZXMgQHNldFZhbHVlKEBmZXRjaERpcmVjdFZhbHVlKCkpIHVwb24gY2hhbmdlLiBDcmVhdGVkIGluIEBjb252ZXJ0VG9MaXZlKCkgZm9yIEFycmF5IGJpbmRpbmdzICYgaW4gaW50ZXJmYWNlLnVwZGF0ZU9uKClcblx0IyBAaXNBc3luYyA9IEJvb2xlYW5cdFx0XHRcdFx0IyBJbmRpY2F0ZXMgaWYgdGhpcyBpcyBhbiBhc3luYyBiaW5kaW5nIChjdXJyZW50bHkgb25seSB1c2VkIGZvciBFdmVudCBiaW5kaW5ncylcblx0IyMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICMjI1xuXG5cdGlmIEBpc011bHRpQ2hvaWNlICMgVHJ1ZSBpZiBAb2JqZWN0IGlzIGEgcmFkaW8vY2hlY2tib3ggY29sbGVjdGlvblxuXHRcdEBjaG9pY2VzID0gZ2VuT2JqKClcblx0XHRcblx0XHRAb2JqZWN0LmZvckVhY2ggKGNob2ljZUVsKT0+XG5cdFx0XHRjaG9pY2VCaW5kaW5nID0gQGNob2ljZXNbY2hvaWNlRWwudmFsdWVdID0gU2ltcGx5QmluZCgnY2hlY2tlZCcpLm9mKGNob2ljZUVsKS5fXG5cdFx0XHRjaG9pY2VCaW5kaW5nLmFkZFN1YihAKVxuXHRcdFx0Y2hvaWNlQmluZGluZy5zdWJzTWV0YVtASURdLnRyYW5zZm9ybUZuID0gKCktPiBjaG9pY2VCaW5kaW5nXG5cdFx0XHRjaG9pY2VCaW5kaW5nLmdyb3VwQmluZGluZyA9IEBcblx0XHRcdHJldHVyblxuXHRcblxuXHR1bmxlc3MgQHR5cGUgaXMgJ0V2ZW50JyBvciAoQHR5cGUgaXMgJ0Z1bmMnIGFuZCBAaXNTdWIpICMgdGhlIHNlY29uZCBjb25kaXRpb24gd2lsbCBwcmV2ZW50IGZ1bmN0aW9uIHN1YnNjcmliZXJzIGZyb20gYmVpbmcgaW52b2tlZCBvbiB0aGlzIGJpbmRpbmcgY3JlYXRpb25cblx0XHRpZiBAdHlwZSBpcyAnUGhvbGRlcidcblx0XHRcdHBhcmVudFByb3BlcnR5ID0gaWYgQGRlc2NyaXB0b3IgYW5kIG5vdCB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ211bHRpJykgdGhlbiBcIiN7QGRlc2NyaXB0b3J9OiN7QHByb3BlcnR5fVwiIGVsc2UgQHByb3BlcnR5XG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0cGFyZW50QmluZGluZyA9IEBwYXJlbnRCaW5kaW5nID0gU2ltcGx5QmluZChwYXJlbnRQcm9wZXJ0eSkub2Yob2JqZWN0KS5fXG5cdFx0XHRwYXJlbnRCaW5kaW5nLnNjYW5Gb3JQaG9sZGVycygpXG5cdFx0XHRAdmFsdWUgPSBwYXJlbnRCaW5kaW5nLnBob2xkZXJWYWx1ZXNbQHBob2xkZXJdXG5cdFx0XG5cdFx0XHRAdGV4dE5vZGVzID0gcGFyZW50QmluZGluZy50ZXh0Tm9kZXNbQHBob2xkZXJdIGlmIHBhcmVudEJpbmRpbmcudGV4dE5vZGVzXG5cdFx0XG5cblx0XHRlbHNlXG5cdFx0XHRAdmFsdWUgPSBzdWJqZWN0VmFsdWUgPSBAZmV0Y2hEaXJlY3RWYWx1ZSgpXG5cdFx0XG5cdFx0XHRpZiBAdHlwZSBpcyAnT2JqZWN0UHJvcCcgYW5kIG5vdCBjaGVja0lmLmlzRGVmaW5lZChzdWJqZWN0VmFsdWUpIGFuZCBub3QgZ2V0RGVzY3JpcHRvcihAb2JqZWN0LCBAcHJvcGVydHkpXG5cdFx0XHRcdEBvYmplY3RbQHByb3BlcnR5XSA9IHN1YmplY3RWYWx1ZSAjIERlZmluZSB0aGUgcHJvcCBvbiB0aGUgb2JqZWN0IGlmIGl0IG5vbi1leGlzdGVudFxuXG5cdFx0XHRjb252ZXJ0VG9MaXZlKEAsIEBvYmplY3QpXG5cblxuXHRAYXR0YWNoRXZlbnRzKClcblx0cmV0dXJuIGJvdW5kSW5zdGFuY2VzW0BJRF0gPSBAXG5cblxuXG5cblxuaW1wb3J0ICcuL3Byb3RvdHlwZSdcbiIsIkJpbmRpbmc6OiA9XG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMjIFN1YnNjcmliZXIgTWFuYWdlbWVudFxuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcblx0YWRkU3ViOiAoc3ViLCBvcHRpb25zLCB1cGRhdGVPbmNlLCB1cGRhdGVFdmVuSWZTYW1lKS0+XG5cdFx0aWYgc3ViLmlzTXVsdGlcblx0XHRcdEBhZGRTdWIoc3ViSXRlbSwgb3B0aW9ucywgdXBkYXRlT25jZSwgdXBkYXRlRXZlbklmU2FtZSkgZm9yIHN1Ykl0ZW0gaW4gc3ViLmJpbmRpbmdzXG5cdFx0ZWxzZVxuXHRcdFx0aWYgbWV0YURhdGE9QHN1YnNNZXRhW3N1Yi5JRF1cblx0XHRcdFx0YWxyZWFkeUhhZFN1YiA9IHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0c3ViLnB1YnNNYXBbQElEXSA9IEBcblx0XHRcdFx0QHN1YnMudW5zaGlmdChzdWIpXG5cdFx0XHRcdFxuXHRcdFx0XHRtZXRhRGF0YSA9IEBzdWJzTWV0YVtzdWIuSURdID0gZ2VuT2JqKClcblx0XHRcdFx0bWV0YURhdGEudXBkYXRlT25jZSA9IHVwZGF0ZU9uY2Vcblx0XHRcdFx0bWV0YURhdGEub3B0cyA9IGNsb25lT2JqZWN0KG9wdGlvbnMpXG5cdFx0XHRcdG1ldGFEYXRhLm9wdHMudXBkYXRlRXZlbklmU2FtZSA9IHRydWUgaWYgdXBkYXRlRXZlbklmU2FtZSBvciBAdHlwZSBpcyAnRXZlbnQnIG9yIEB0eXBlIGlzICdQcm94eScgb3IgQHR5cGUgaXMgJ0FycmF5J1xuXHRcdFx0XHRtZXRhRGF0YS52YWx1ZVJlZiA9IGlmIHN1Yi50eXBlIGlzICdGdW5jJyB0aGVuICd2YWx1ZVBhc3NlZCcgZWxzZSAndmFsdWUnXG5cdFx0XHRcblx0XHRyZXR1cm4gYWxyZWFkeUhhZFN1YlxuXG5cblxuXHRyZW1vdmVTdWI6IChzdWIsIGJvdGhXYXlzKS0+XG5cdFx0aWYgc3ViLmlzTXVsdGlcblx0XHRcdEByZW1vdmVTdWIoc3ViSXRlbSwgYm90aFdheXMpIGZvciBzdWJJdGVtIGluIHN1Yi5iaW5kaW5nc1xuXHRcdGVsc2Vcblx0XHRcdGlmIEBzdWJzTWV0YVtzdWIuSURdXG5cdFx0XHRcdEBzdWJzLnNwbGljZShAc3Vicy5pbmRleE9mKHN1YiksIDEpXG5cdFx0XHRcdGRlbGV0ZSBAc3Vic01ldGFbc3ViLklEXVxuXHRcdFx0XHRkZWxldGUgc3ViLnB1YnNNYXBbQElEXVxuXG5cdFx0XHRpZiBib3RoV2F5c1xuXHRcdFx0XHRzdWIucmVtb3ZlU3ViKEApXG5cdFx0XHRcdGRlbGV0ZSBAcHVic01hcFtzdWIuSURdXG5cblx0XHRpZiBAc3Vicy5sZW5ndGggaXMgMCBhbmQgT2JqZWN0LmtleXMoQHB1YnNNYXApLmxlbmd0aCBpcyAwXG5cdFx0XHRAZGVzdHJveSgpICMgU2luY2UgaXQncyBubyBsb25nZXIgYSBzdWJzY3JpYmVyIG9yIGhhcyBhbnkgc3Vic2NyaWJlcnNcblx0XG5cdFx0cmV0dXJuXG5cblx0XG5cblx0cmVtb3ZlQWxsU3ViczogKGJvdGhXYXlzKS0+XG5cdFx0QHJlbW92ZVN1YihzdWIsIGJvdGhXYXlzKSBmb3Igc3ViIGluIEBzdWJzLnNsaWNlKClcblx0XHRyZXR1cm5cblxuXG5cblxuXHRkZXN0cm95OiAoKS0+ICMgUmVzZXRzIG9iamVjdCB0byBpbml0aWFsIHN0YXRlIChwcmUtYmluZGluZyBzdGF0ZSlcblx0XHRkZWxldGUgYm91bmRJbnN0YW5jZXNbQElEXVxuXHRcdEByZW1vdmVQb2xsSW50ZXJ2YWwoKVxuXHRcdFxuXHRcdGlmIEB0eXBlIGlzICdFdmVudCdcblx0XHRcdEB1blJlZ2lzdGVyRXZlbnQoZXZlbnQpIGZvciBldmVudCBpbiBAYXR0YWNoZWRFdmVudHNcblx0XHRcblx0XHRlbHNlIGlmIEB0eXBlIGlzICdGdW5jJ1xuXHRcdFx0ZGVsZXRlIEBvYmplY3QuX3NiX0lEXG5cblx0XHQjIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5cdFx0Y29udmVydFRvUmVnKEAsIEBvYmplY3QpIGlmIEBpc0xpdmVQcm9wIGFuZCBAb3JpZ0Rlc2NyaXB0b3Jcblx0XHRjb252ZXJ0VG9SZWcoQCwgQHZhbHVlLCB0cnVlKSBpZiBAdHlwZSBpcyAnQXJyYXknXG5cdFx0XG5cdFx0aWYgQG9iamVjdC5fc2JfbWFwXG5cdFx0XHRkZWxldGUgQG9iamVjdC5fc2JfbWFwW0BzZWxlY3Rvcl1cblx0XHRcdGRlbGV0ZSBAb2JqZWN0Ll9zYl9tYXAgaWYgT2JqZWN0LmtleXMoQG9iamVjdC5fc2JfbWFwKS5sZW5ndGggaXMgMFxuXG5cblx0XHRyZXR1cm5cblxuXG5cblxuXG5cblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyMgVmFsdWUgc2V0L2dldFxuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcblx0ZmV0Y2hEaXJlY3RWYWx1ZTogKCktPlxuXHRcdHR5cGUgPSBAdHlwZVxuXHRcdHN3aXRjaFxuXHRcdFx0d2hlbiB0eXBlIGlzICdGdW5jJyB0aGVuIEBvYmplY3QoKVxuXHRcdFx0XG5cdFx0XHR3aGVuIHR5cGUgaXMgJ0RPTUF0dHInIHRoZW4gQG9iamVjdC5nZXRBdHRyaWJ1dGUoQHByb3BlcnR5KSBvciAnJ1xuXG5cdFx0XHR3aGVuIEBpc011bHRpQ2hvaWNlXG5cdFx0XHRcdHJlc3VsdHMgPSBbXVxuXHRcdFx0XHRmb3IgY2hvaWNlTmFtZSxjaG9pY2VFbCBvZiBAY2hvaWNlc1xuXHRcdFx0XHRcdGlmIGNob2ljZUVsLm9iamVjdC5jaGVja2VkXG5cdFx0XHRcdFx0XHRpZiB0eXBlIGlzICdET01SYWRpbydcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNob2ljZU5hbWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoIGNob2ljZU5hbWVcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0c1xuXHRcdFxuXHRcdFx0ZWxzZSBAb2JqZWN0W0Bwcm9wZXJ0eV1cblx0XG5cblxuXG5cdHNldFZhbHVlOiAobmV3VmFsdWUsIHB1Ymxpc2hlciwgZnJvbVNlbGYsIGZyb21DaGFuZ2VFdmVudCktPiAjIGZyb21TZWxmPT09dHJ1ZSB3aGVuIGNhbGxlZCBmcm9tIGV2ZW50VXBkYXRlSGFuZGxlciBvciBwcm9wZXJ0eSBkZXNjcmlwdG9yIHNldHRlciAodW5sZXNzIGl0J3MgYW4gQXJyYXkgYmluZGluZylcblx0XHRwdWJsaXNoZXIgfHw9IEBcblx0XHRuZXdWYWx1ZSA9IEBzZWxmVHJhbnNmb3JtKG5ld1ZhbHVlKSBpZiBAc2VsZlRyYW5zZm9ybVxuXHRcdFxuXHRcdHVubGVzcyBmcm9tU2VsZiB0aGVuIHN3aXRjaCBAdHlwZVxuXHRcdFx0d2hlbiAnT2JqZWN0UHJvcCdcblx0XHRcdFx0aWYgbm90IEBpc0xpdmVQcm9wXG5cdFx0XHRcdFx0QG9iamVjdFtAcHJvcGVydHldID0gbmV3VmFsdWUgaWYgbmV3VmFsdWUgaXNudCBAdmFsdWVcblx0XHRcdFx0aW1wb3J0SW5saW5lICcuL3Byb3RvdHlwZS5zZXRWYWx1ZS1PYmplY3RQcm9wLURPTVZhbHVlJ1xuXHRcdFx0XHRlbHNlIGlmIEBvcmlnU2V0dGVyXG5cdFx0XHRcdFx0QG9yaWdTZXR0ZXIobmV3VmFsdWUpXG5cblxuXHRcdFx0d2hlbiAnUGhvbGRlcidcblx0XHRcdFx0cGFyZW50ID0gQHBhcmVudEJpbmRpbmdcblx0XHRcdFx0cGFyZW50LnBob2xkZXJWYWx1ZXNbQHBob2xkZXJdID0gbmV3VmFsdWVcblx0XHRcdFx0ZW50aXJlVmFsdWUgPSBhcHBseVBsYWNlaG9sZGVycyhwYXJlbnQucGhvbGRlckNvbnRleHRzLCBwYXJlbnQucGhvbGRlclZhbHVlcywgcGFyZW50LnBob2xkZXJJbmRleE1hcClcblxuXHRcdFx0XHRpZiBAdGV4dE5vZGVzIGFuZCBuZXdWYWx1ZSBpc250IEB2YWx1ZVxuXHRcdFx0XHRcdGZvciB0ZXh0Tm9kZSBpbiBAdGV4dE5vZGVzXG5cdFx0XHRcdFx0XHR0ZXh0Tm9kZVt0ZXh0Q29udGVudF0gPSBuZXdWYWx1ZVxuXHRcdFx0XHRcblx0XHRcdFx0cGFyZW50LnNldFZhbHVlKGVudGlyZVZhbHVlLCBwdWJsaXNoZXIpIHVubGVzcyBAcHJvcGVydHkgaXMgdGV4dENvbnRlbnRcblx0XHRcdFx0XG5cblxuXHRcdFx0d2hlbiAnQXJyYXknXG5cdFx0XHRcdGlmIG5ld1ZhbHVlIGlzbnQgQHZhbHVlXG5cdFx0XHRcdFx0bmV3VmFsdWUgPSBBcnJheTo6Y29uY2F0KG5ld1ZhbHVlKSBpZiBub3QgY2hlY2tJZi5pc0FycmF5KG5ld1ZhbHVlKVxuXHRcdFx0XHRcdGNvbnZlcnRUb1JlZyhALCBAdmFsdWUsIHRydWUpXG5cdFx0XHRcdFx0Y29udmVydFRvTGl2ZShALCBuZXdWYWx1ZT1uZXdWYWx1ZS5zbGljZSgpLCB0cnVlKVxuXHRcdFx0XHRcdEBvcmlnU2V0dGVyKG5ld1ZhbHVlKSBpZiBAb3JpZ1NldHRlciAjIFdpbGwgdXBkYXRlIGFueSBvdGhlciBwcmV2aW91cyBub24tQXJyYXkgYmluZGluZ3MgdG8gdGhlIHNhbWUgb2JqZWN0IHByb3BlcnR5XG5cblxuXHRcdFx0d2hlbiAnRnVuYydcblx0XHRcdFx0cHJldlZhbHVlID0gQHZhbHVlUGFzc2VkXG5cdFx0XHRcdEB2YWx1ZVBhc3NlZCA9IG5ld1ZhbHVlXG5cdFx0XHRcdG5ld1ZhbHVlID0gQG9iamVjdChuZXdWYWx1ZSwgcHJldlZhbHVlKVxuXG5cdFx0XHR3aGVuICdFdmVudCdcblx0XHRcdFx0QGlzRW1pdHRlciA9IHRydWVcblx0XHRcdFx0QGVtaXRFdmVudChuZXdWYWx1ZSlcblx0XHRcdFx0QGlzRW1pdHRlciA9IGZhbHNlXG5cdFx0XG5cdFx0XHRpbXBvcnRJbmxpbmUgJy4vcHJvdG90eXBlLnNldFZhbHVlLURPTVR5cGVzJ1xuXHRcdFxuXHRcdEB2YWx1ZSA9IG5ld1ZhbHVlXG5cdFx0QHVwZGF0ZUFsbFN1YnMocHVibGlzaGVyKVxuXG5cdFx0cmV0dXJuXG5cblxuXG5cblxuXHR1cGRhdGVBbGxTdWJzOiAocHVibGlzaGVyKS0+IGlmIGk9KGFycj1Ac3VicykubGVuZ3RoICMgVWdseSBzaG9ydGN1dCBmb3IgaW5kZXggZGVmaW5pdGlvbiBpbiBvcmRlciB0byBsaW1pdCBsb2dpYyByZXBpdGlpb25cblx0XHRAdXBkYXRlU3ViKGFycltpXSwgcHVibGlzaGVyKSB3aGlsZSBpLS1cblx0XHRyZXR1cm5cblxuXG5cblx0XHRcdFxuXG5cdHVwZGF0ZVN1YjogKHN1YiwgcHVibGlzaGVyLCBpc0RlbGF5ZWRVcGRhdGUpLT5cblx0XHRyZXR1cm4gaWYgKHB1Ymxpc2hlciBpcyBzdWIpIG9yIChwdWJsaXNoZXIgaXNudCBAIGFuZCBwdWJsaXNoZXIuc3Vic01ldGFbc3ViLklEXSkgIyBpbmRpY2F0ZXMgdGhpcyBpcyBhbiBpbmZpbml0ZSBsb29wXG5cdFx0bWV0YSA9IEBzdWJzTWV0YVtzdWIuSURdXG5cblx0XHRpZiBtZXRhLmRpc2FsbG93TGlzdCBhbmQgbWV0YS5kaXNhbGxvd0xpc3RbcHVibGlzaGVyLklEXVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiBtZXRhLm9wdHMudGhyb3R0bGVcblx0XHRcdGN1cnJlbnRUaW1lID0gKyhuZXcgRGF0ZSlcblx0XHRcdHRpbWVQYXNzZWQgPSBjdXJyZW50VGltZSAtIG1ldGEubGFzdFVwZGF0ZVxuXHRcdFx0XG5cdFx0XHRpZiB0aW1lUGFzc2VkIDwgbWV0YS5vcHRzLnRocm90dGxlXG5cdFx0XHRcdGNsZWFyVGltZW91dChtZXRhLnVwZGF0ZVRpbWVyKVxuXHRcdFx0XHRyZXR1cm4gbWV0YS51cGRhdGVUaW1lciA9XG5cdFx0XHRcdFx0c2V0VGltZW91dCAoKT0+XG5cdFx0XHRcdFx0XHRAdXBkYXRlU3ViKHN1YiwgcHVibGlzaGVyKSBpZiBAc3Vic01ldGFbc3ViLklEXVxuXHRcdFx0XHRcdCwgbWV0YS5vcHRzLnRocm90dGxlLXRpbWVQYXNzZWRcblx0XHRcdFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRtZXRhLmxhc3RVcGRhdGUgPSBjdXJyZW50VGltZVxuXG5cdFx0ZWxzZSBpZiBtZXRhLm9wdHMuZGVsYXkgYW5kIG5vdCBpc0RlbGF5ZWRVcGRhdGVcblx0XHRcdHJldHVybiBzZXRUaW1lb3V0ICgpPT5cblx0XHRcdFx0QHVwZGF0ZVN1YihzdWIsIHB1Ymxpc2hlciwgdHJ1ZSkgaWYgQHN1YnNNZXRhW3N1Yi5JRF1cblx0XHRcdCwgbWV0YS5vcHRzLmRlbGF5XG5cblxuXHRcdG5ld1ZhbHVlID0gaWYgQHR5cGUgaXMgJ0FycmF5JyBhbmQgbWV0YS5vcHRzLnNlbmRBcnJheUNvcGllcyB0aGVuIEB2YWx1ZS5zbGljZSgpIGVsc2UgQHZhbHVlXG5cdFx0c3ViVmFsdWUgPSBzdWJbbWV0YS52YWx1ZVJlZl1cblx0XHRuZXdWYWx1ZSA9IGlmIHRyYW5zZm9ybT1tZXRhLnRyYW5zZm9ybUZuIHRoZW4gdHJhbnNmb3JtKG5ld1ZhbHVlLCBzdWJWYWx1ZSwgc3ViLm9iamVjdCkgZWxzZSBuZXdWYWx1ZVxuXG5cdFx0cmV0dXJuIGlmIG5ld1ZhbHVlIGlzIHN1YlZhbHVlIGFuZCBub3QgbWV0YS5vcHRzLnVwZGF0ZUV2ZW5JZlNhbWUgb3Jcblx0XHRcdG1ldGEuY29uZGl0aW9uRm4gYW5kIG5vdCBtZXRhLmNvbmRpdGlvbkZuKG5ld1ZhbHVlLCBzdWJWYWx1ZSwgc3ViLm9iamVjdClcblxuXHRcdCMgV2h5IGRvIHdlIG5lZWQgdGhlICdwcm9taXNlVHJhbnNmb3Jtcycgb3B0aW9uIHdoZW4gd2UgY2FuIGp1c3QgY2hlY2sgZm9yIHRoZSBleGlzdGFuY2Ugb2YgLnRoZW4gbWV0aG9kP1xuXHRcdCMgQmVjYXVzZSB0ZXN0cyBzaG93IHRoYXQgd2hlbiBzZWFyY2hpbmcgZm9yIHRoZSAudGhlbiBwcm9wIG9uIHRoZSBvYmplY3QgcmVzdWx0cyBpbiBhIHBlcmZvcm1hbmNlIHNsb3dkb3duIG9mIHVwIHRvIDMwJSFcblx0XHQjIENoZWNraW5nIGlmIHRoZSBwcm9taXNlVHJhbnNmb3JtcyBvcHRpb24gaXMgZW5hYmxlZCBmaXJzdCBlbGltaW5hdGVzIHVubmVjZXNzYXJ5IGxvb2t1cHMgJiBzbG93ZG93bnMuXG5cdFx0aWYgbWV0YS5vcHRzLnByb21pc2VUcmFuc2Zvcm1zIGFuZCBuZXdWYWx1ZSBhbmQgY2hlY2tJZi5pc0Z1bmN0aW9uKG5ld1ZhbHVlLnRoZW4pXG5cdFx0XHRuZXdWYWx1ZS50aGVuIChuZXdWYWx1ZSktPiBzdWIuc2V0VmFsdWUobmV3VmFsdWUsIHB1Ymxpc2hlcik7IHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdHN1Yi5zZXRWYWx1ZShuZXdWYWx1ZSwgcHVibGlzaGVyKVxuXG5cdFx0QHJlbW92ZVN1YihzdWIpIGlmIG1ldGEudXBkYXRlT25jZVxuXHRcdHJldHVyblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMjIFRyYW5zZm9ybXMgJiBDb25kaXRpb25zXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdGFkZE1vZGlmaWVyRm46ICh0YXJnZXQsIHN1YkludGVyZmFjZXMsIHN1YmplY3RGbiwgdXBkYXRlT25CaW5kKS0+XG5cdFx0aWYgbm90IGNoZWNrSWYuaXNGdW5jdGlvbihzdWJqZWN0Rm4pXG5cdFx0XHR0aHJvd1dhcm5pbmcoJ2ZuT25seScsMilcblxuXHRcdGVsc2Vcblx0XHRcdGZvciBzdWJJbnRlcmZhY2UgaW4gc3ViSW50ZXJmYWNlc1xuXHRcdFx0XHRzdWJzY3JpYmVyID0gc3ViSW50ZXJmYWNlLl8gb3Igc3ViSW50ZXJmYWNlICMgU2Vjb25kIGlzIGNob3NlbiB3aGVuIHRoZSBwYXNzZWQgc3Vic2NyaWJlciBpbnRlcmZhY2VzIG11bHRpLWJpbmRpbmcgKGlzIGEgcmVjdXJzaXZlIGNhbGwgb2YgdGhpcyBtZXRob2QpXG5cblx0XHRcdFx0aWYgc3Vic2NyaWJlci5pc011bHRpXG5cdFx0XHRcdFx0QGFkZE1vZGlmaWVyRm4odGFyZ2V0LCBzdWJzY3JpYmVyLmJpbmRpbmdzLCBzdWJqZWN0Rm4sIHVwZGF0ZU9uQmluZClcblx0XHRcdFx0XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRzdWJNZXRhRGF0YSA9IEBzdWJzTWV0YVtzdWJzY3JpYmVyLklEXVxuXHRcdFx0XHRcdHN1Yk1ldGFEYXRhW3RhcmdldF0gPSBzdWJqZWN0Rm5cblx0XHRcdFx0XHR1cGRhdGVPbkJpbmQgPSB1cGRhdGVPbkJpbmQgYW5kIG5vdCBzdWJNZXRhRGF0YS51cGRhdGVPbmNlXG5cblx0XHRcdFx0XHRpZiBAcHVic01hcFtzdWJzY3JpYmVyLklEXVxuXHRcdFx0XHRcdFx0c3Vic2NyaWJlci5zdWJzTWV0YVtASURdW3RhcmdldF0gfHw9IHN1YmplY3RGbiAjIFdpbGwgbm90IHJlcGxhY2UgZXhpc3RpbmcgbW9kaWZpZXIgZnVuY3Rpb24gaWYgZXhpc3RzXG5cblx0XHRcdFx0XHRAdXBkYXRlU3ViKHN1YnNjcmliZXIsIEApIGlmICh1cGRhdGVPbkJpbmQgb3IgQHR5cGUgaXMgJ0Z1bmMnKSBhbmQgdGFyZ2V0IGlzICd0cmFuc2Zvcm1GbidcblxuXHRcdFx0cmV0dXJuIHRydWVcblxuXG5cblx0c2V0U2VsZlRyYW5zZm9ybTogKHRyYW5zZm9ybUZuLCB1cGRhdGVPbkJpbmQpLT5cblx0XHRAc2VsZlRyYW5zZm9ybSA9IHRyYW5zZm9ybUZuXG5cdFx0QHNldFZhbHVlKEB2YWx1ZSkgaWYgdXBkYXRlT25CaW5kXG5cdFx0cmV0dXJuXG5cblxuXG5cblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyMgQWxsb3cvRGlzYWxsb3cgcnVsZXNcblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gXG5cdGFkZERpc2FsbG93UnVsZTogKHRhcmdldFN1YiwgdGFyZ2V0RGlzYWxsb3cpLT5cblx0XHRkaXNhbGxvd0xpc3QgPSBAc3Vic01ldGFbdGFyZ2V0U3ViLklEXS5kaXNhbGxvd0xpc3QgPz0gZ2VuT2JqKClcblx0XHRkaXNhbGxvd0xpc3RbdGFyZ2V0RGlzYWxsb3cuSURdID0gMVxuXHRcdHJldHVyblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMjIFBsYWNlaG9sZGVyc1xuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcblx0c2NhbkZvclBob2xkZXJzOiAoKS0+IHVubGVzcyBAcGhvbGRlclZhbHVlc1xuXHRcdEBwaG9sZGVyVmFsdWVzID0gZ2VuT2JqKClcblx0XHRAcGhvbGRlckluZGV4TWFwID0gZ2VuT2JqKClcblx0XHRAcGhvbGRlckNvbnRleHRzID0gW11cblxuXHRcdGlmIGNoZWNrSWYuaXNTdHJpbmcoQHZhbHVlKVxuXHRcdFx0QHBob2xkZXJDb250ZXh0cyA9IEB2YWx1ZS5zcGxpdCBwaG9sZGVyUmVnRXhTcGxpdFxuXHRcdFx0XG5cdFx0XHRpbmRleCA9IDBcblx0XHRcdEB2YWx1ZSA9IEB2YWx1ZS5yZXBsYWNlIHBob2xkZXJSZWdFeCwgKGUsIHBob2xkZXIpPT5cblx0XHRcdFx0QHBob2xkZXJJbmRleE1hcFtpbmRleCsrXSA9IHBob2xkZXJcblx0XHRcdFx0QHBob2xkZXJWYWx1ZXNbcGhvbGRlcl0gPSBwaG9sZGVyXG5cdFx0XG5cdFx0c2NhblRleHROb2Rlc1BsYWNlaG9sZGVycyhAb2JqZWN0LCBAdGV4dE5vZGVzPWdlbk9iaigpKSBpZiBAaXNEb20gYW5kIEBwcm9wZXJ0eSBpcyB0ZXh0Q29udGVudFxuXHRcdHJldHVyblxuXHRcblxuXG5cblxuXG5cblxuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIyBQb2xsaW5nXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IFxuXHRhZGRQb2xsSW50ZXJ2YWw6ICh0aW1lKS0+IGlmIEB0eXBlIGlzbnQgJ0V2ZW50J1xuXHRcdEByZW1vdmVQb2xsSW50ZXJ2YWwoKVxuXHRcdFxuXHRcdEBwb2xsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCAoKT0+XG5cdFx0XHRwb2xsZWRWYWx1ZSA9IEBmZXRjaERpcmVjdFZhbHVlKClcblxuXHRcdFx0QHNldFZhbHVlIHBvbGxlZFZhbHVlLCBALCB0cnVlXG5cdFx0LCB0aW1lXG5cblxuXHRyZW1vdmVQb2xsSW50ZXJ2YWw6ICgpLT5cblx0XHRjbGVhckludGVydmFsKEBwb2xsSW50ZXJ2YWwpXG5cdFx0QHBvbGxJbnRlcnZhbCA9IG51bGxcblxuXG5cblxuXG5cblxuXG5cblxuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIyBFdmVudHNcblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gXG5cdFxuXHRhZGRVcGRhdGVMaXN0ZW5lcjogKGV2ZW50TmFtZSwgdGFyZ2V0UHJvcGVydHkpLT5cblx0XHRAb2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIgZXZlbnROYW1lLCAoZXZlbnQpPT5cblx0XHRcdHVubGVzcyBldmVudC5fc2Jcblx0XHRcdFx0c2hvdWxkUmVkZWZpbmVWYWx1ZSA9IEBzZWxmVHJhbnNmb3JtIGFuZCBAaXNEb21JbnB1dFxuXHRcdFx0XHRAc2V0VmFsdWUoQG9iamVjdFt0YXJnZXRQcm9wZXJ0eV0sIG51bGwsICFzaG91bGRSZWRlZmluZVZhbHVlLCB0cnVlKVxuXG5cdFx0XHRyZXR1cm5cblx0XHRcblx0XHQsIGZhbHNlXG5cdFx0cmV0dXJuXG5cdFxuXG5cdGF0dGFjaEV2ZW50czogKCktPlxuXHRcdGlmIEBldmVudE5hbWVcblx0XHRcdEByZWdpc3RlckV2ZW50KEBldmVudE5hbWUpXG5cdFx0XG5cdFx0ZWxzZSBpZiBAaXNEb21JbnB1dFxuXHRcdFx0QGFkZFVwZGF0ZUxpc3RlbmVyKCdpbnB1dCcsICd2YWx1ZScpXG5cdFx0XHRAYWRkVXBkYXRlTGlzdGVuZXIoJ2NoYW5nZScsICd2YWx1ZScpXG5cblx0XHRlbHNlIGlmIG5vdCBAaXNNdWx0aUNob2ljZSBhbmQgKEB0eXBlIGlzICdET01SYWRpbycgb3IgQHR5cGUgaXMgJ0RPTUNoZWNrYm94Jylcblx0XHRcdEBhZGRVcGRhdGVMaXN0ZW5lcignY2hhbmdlJywgJ2NoZWNrZWQnKVxuXG5cdFx0cmV0dXJuXG5cdFxuXG5cblx0cmVnaXN0ZXJFdmVudDogKGV2ZW50TmFtZSktPlxuXHRcdEBhdHRhY2hlZEV2ZW50cy5wdXNoKGV2ZW50TmFtZSlcblx0XHRAZXZlbnRIYW5kbGVyID0gZXZlbnRVcGRhdGVIYW5kbGVyLmJpbmQoQCkgdW5sZXNzIEBldmVudEhhbmRsZXJcblx0XHRcblx0XHRAb2JqZWN0W0BldmVudE1ldGhvZHMubGlzdGVuXShldmVudE5hbWUsIEBldmVudEhhbmRsZXIpXG5cdFx0cmV0dXJuXG5cblxuXG5cdHVuUmVnaXN0ZXJFdmVudDogKGV2ZW50TmFtZSktPlxuXHRcdEBhdHRhY2hlZEV2ZW50cy5zcGxpY2UgQGF0dGFjaGVkRXZlbnRzLmluZGV4T2YoZXZlbnROYW1lKSwgMVxuXG5cdFx0QG9iamVjdFtAZXZlbnRNZXRob2RzLnJlbW92ZV0oZXZlbnROYW1lLCBAZXZlbnRIYW5kbGVyKVxuXHRcdHJldHVyblxuXG5cblxuXHRlbWl0RXZlbnQ6IChleHRyYURhdGEpLT5cblx0XHRldmVudE9iamVjdCA9IEBldmVudE5hbWVcblx0XHRcblx0XHRpZiBAZXZlbnRNZXRob2RzLmVtaXQgaXMgJ2Rpc3BhdGNoRXZlbnQnXG5cdFx0XHR1bmxlc3MgQGV2ZW50T2JqZWN0XG5cdFx0XHRcdEBldmVudE9iamVjdCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpXG5cdFx0XHRcdEBldmVudE9iamVjdC5pbml0RXZlbnQoQGV2ZW50TmFtZSwgdHJ1ZSwgdHJ1ZSlcblxuXHRcdFx0QGV2ZW50T2JqZWN0LmJpbmRpbmdEYXRhID0gZXh0cmFEYXRhXG5cdFx0XHRldmVudE9iamVjdCA9IEBldmVudE9iamVjdFxuXG5cdFx0QG9iamVjdFtAZXZlbnRNZXRob2RzLmVtaXRdKGV2ZW50T2JqZWN0LCBleHRyYURhdGEpXG5cdFx0cmV0dXJuXG5cblxuXG5cbmV2ZW50VXBkYXRlSGFuZGxlciA9ICgpLT4gdW5sZXNzIEBpc0VtaXR0ZXJcblx0QHNldFZhbHVlKGFyZ3VtZW50c1tAcHJvcGVydHldLCBudWxsLCB0cnVlKVxuXHRyZXR1cm5cblxuXG5cblxuXG4iLCJlbHNlIGlmIEBpc0RvbUlucHV0XG5cdGlmIG5vdCBmcm9tQ2hhbmdlRXZlbnRcblx0XHRAb3JpZ1NldHRlcihuZXdWYWx1ZSlcblx0XHRAb2JqZWN0LmRpc3BhdGNoRXZlbnQoY2hhbmdlRXZlbnQoKSkgaWYgc2V0dGluZ3MuZGlzcGF0Y2hFdmVudHNcblx0XG5cdGVsc2UgaWYgbmV3VmFsdWUgaXNudCBAb3JpZ0dldHRlcigpICMgSU1QTElDSVQ6IGFuZCBmcm9tQ2hhbmdlRXZlbnRcblx0XHRwcmV2Q3Vyc3JvciA9IEBvYmplY3Quc2VsZWN0aW9uU3RhcnRcblx0XHRAb3JpZ1NldHRlcihuZXdWYWx1ZSlcblx0XHRAb2JqZWN0LnNldFNlbGVjdGlvblJhbmdlKHByZXZDdXJzcm9yLCBwcmV2Q3Vyc3JvcikgaWYgcHJldkN1cnNyb3IiLCJ3aGVuICdET01SYWRpbydcblx0aWYgQGlzTXVsdGlDaG9pY2UgIyBUaGUgbmV3VmFsdWUgdmFyIHdpbGwgaG9sZCB0aGUgcmFkaW8gZmllbGQgYmluZGluZyBhcyBpdHMgdmFsdWUgaWYgdGhlIHVwZGF0ZSBpcyBjb21pbmcgZnJvbSB0aGUgcmFkaW8gZmllbGQncyBjaGFuZ2UgZXZlbnRcblx0XHR0YXJnZXRDaG9pY2VCaW5kaW5nID0gaWYgY2hlY2tJZi5pc0JpbmRpbmcobmV3VmFsdWUpIHRoZW4gbmV3VmFsdWUgZWxzZSBAY2hvaWNlc1tuZXdWYWx1ZV1cblxuXHRcdGlmIHRhcmdldENob2ljZUJpbmRpbmdcblx0XHRcdG5ld1ZhbHVlID0gdGFyZ2V0Q2hvaWNlQmluZGluZy5vYmplY3QudmFsdWVcblx0XHRcblx0XHRcdGZvciBuLGNob2ljZUJpbmRpbmcgb2YgQGNob2ljZXNcblx0XHRcdFx0Y2hvaWNlQmluZGluZy5zZXRWYWx1ZShjaG9pY2VCaW5kaW5nLklEIGlzIHRhcmdldENob2ljZUJpbmRpbmcuSUQsIHB1Ymxpc2hlcilcblx0XHRlbHNlXG5cdFx0XHRuZXdWYWx1ZSA9IEB2YWx1ZSAjIFNldCB0byBwcmV2IHZhbHVlXG5cdFxuXHRlbHNlXG5cdFx0bmV3VmFsdWUgPSAhIW5ld1ZhbHVlICMgQ29udmVydCB0byBCb29sZWFuXG5cdFx0cmV0dXJuIGlmIG5ld1ZhbHVlIGlzIEB2YWx1ZVxuXHRcdEBvYmplY3QuY2hlY2tlZCA9IG5ld1ZhbHVlIHVubGVzcyBAb2JqZWN0LmNoZWNrZWQgaXMgbmV3VmFsdWVcblx0XHRAb2JqZWN0LmRpc3BhdGNoRXZlbnQoY2hhbmdlRXZlbnQoKSkgaWYgbmV3VmFsdWUgYW5kIHNldHRpbmdzLmRpc3BhdGNoRXZlbnRzICMgT25seSBlbWl0IGlmIHRoZSB2YWx1ZSBpcyB0cnVlIChpbiBvcmRlciB0byBjb25mb3JtIHRvIHdlYiBzdGFuZGFyZHMpXG5cblxud2hlbiAnRE9NQ2hlY2tib3gnXG5cdGlmIEBpc011bHRpQ2hvaWNlICMgVGhlIG5ld1ZhbHVlIHZhciB3aWxsIGhvbGQgdGhlIGNoZWNrYm94IGZpZWxkIGJpbmRpbmcgYXMgaXRzIHZhbHVlIGlmIHRoZSB1cGRhdGUgaXMgY29taW5nIGZyb20gdGhlIGNoZWNrYm94IGZpZWxkJ3MgY2hhbmdlIGV2ZW50XG5cdFx0b3ZlcndyaXRlUHJldmlvdXMgPSBub3QgY2hlY2tJZi5pc0JpbmRpbmcobmV3VmFsdWUpICMgTWVhbnMgdGhhdCBhIG5ldyBhcnJheSB3YXMgc3VwcGxpZWRcblx0XHRuZXdDaG9pY2VzID0gW10uY29uY2F0KG5ld1ZhbHVlKSAjIFRoaXMgKm5vcm1hbGl6ZXMqIHRoZSBuZXcgdmFsdWUgaW50byBhbiBhcnJheVxuXHRcdFxuXHRcdGZvciB2YWx1ZSxpbmRleCBpbiBuZXdDaG9pY2VzXG5cdFx0XHRuZXdDaG9pY2VzW2luZGV4XSA9IGlmIGNoZWNrSWYuaXNCaW5kaW5nKHZhbHVlKSB0aGVuIHZhbHVlIGVsc2UgQGNob2ljZXNbdmFsdWVdXG5cdFx0XG5cdFx0bmV3VmFsdWVBcnJheSA9IFtdXG5cdFx0Zm9yIGNob2ljZU5hbWUsY2hvaWNlQmluZGluZyBvZiBAY2hvaWNlc1xuXHRcdFx0aWYgb3ZlcndyaXRlUHJldmlvdXNcblx0XHRcdFx0bmV3Q2hvaWNlVmFsdWUgPSB0YXJnZXRJbmNsdWRlcyhuZXdDaG9pY2VzLCBjaG9pY2VCaW5kaW5nKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRuZXdDaG9pY2VWYWx1ZSA9IGNob2ljZUJpbmRpbmcudmFsdWVcblx0XHRcdFxuXHRcdFx0Y2hvaWNlQmluZGluZy5zZXRWYWx1ZShuZXdDaG9pY2VWYWx1ZSwgcHVibGlzaGVyKVxuXHRcdFx0bmV3VmFsdWVBcnJheS5wdXNoKGNob2ljZU5hbWUpIGlmIG5ld0Nob2ljZVZhbHVlXG5cblx0XHRuZXdWYWx1ZSA9IG5ld1ZhbHVlQXJyYXlcblxuXG5cdGVsc2Vcblx0XHRuZXdWYWx1ZSA9ICEhbmV3VmFsdWUgIyBDb252ZXJ0IHRvIEJvb2xlYW5cblx0XHRyZXR1cm4gaWYgbmV3VmFsdWUgaXMgQHZhbHVlXG5cdFx0dW5sZXNzIEBvYmplY3QuY2hlY2tlZCBpcyBuZXdWYWx1ZVxuXHRcdFx0QG9iamVjdC5jaGVja2VkID0gbmV3VmFsdWVcblx0XHRcdEBvYmplY3QuZGlzcGF0Y2hFdmVudChjaGFuZ2VFdmVudCgpKSBpZiBzZXR0aW5ncy5kaXNwYXRjaEV2ZW50c1xuXG5cblxud2hlbiAnRE9NQXR0cidcblx0QG9iamVjdC5zZXRBdHRyaWJ1dGUoQHByb3BlcnR5LCBuZXdWYWx1ZSlcbiIsIiMjIypcbiAqIFN0YWdlIGRlZmluaXRpb25zOlxuICogXG4gKiAwOiBTZWxlY3Rpb246XHRcdFx0R290IHNlbGVjdG9yLCBhd2FpdGluZyBvYmplY3QuXG4gKiAxOiBJbmRpY2F0aW9uOlx0XHRcdEdvdCBvYmplY3QsIGF3YWl0aW5nIHByb3hpZWQgcHJvcGVydHkgLyBmdW5jdGlvbiAvIEJpbmRpbmctb2JqZWN0LlxuICogMjogQmluZGluZyBDb21wbGV0ZTpcdFx0Q29tcGxldGUsIGF3YWl0aW5nIGFkZGl0aW9uYWwgKG9wdGlvbmFsKSBiaW5kaW5ncy9tdXRhdGlvbnMuXG4jIyNcbkJpbmRpbmdJbnRlcmZhY2UgPSAob3B0aW9ucywgaW5oZXJpdGVkU3RhdGUpLT5cblx0aWYgaW5oZXJpdGVkU3RhdGVcblx0XHRleHRlbmRTdGF0ZShALCBpbmhlcml0ZWRTdGF0ZSlcblx0XHRAc3RhZ2UgPSAxXG5cdGVsc2Vcblx0XHRAc3RhZ2UgPSAwXG5cdFx0QHN1YnMgPSBbXVxuXHRcdEBvcHRpb25zUGFzc2VkID0gb3B0aW9ucyB8fD0ge31cblx0XHRAb3B0aW9ucyA9IHt9XG5cdFx0Zm9yIGtleSBvZiBkZWZhdWx0T3B0aW9uc1xuXHRcdFx0QG9wdGlvbnNba2V5XSA9IGlmIG9wdGlvbnNba2V5XT8gdGhlbiBvcHRpb25zW2tleV0gZWxzZSBkZWZhdWx0T3B0aW9uc1trZXldXG5cdFxuXHRyZXR1cm4gQFx0XHRcdFxuXHRcblxuXG5cbmltcG9ydCAnLi9wcm90b3R5cGUtcHJpdmF0ZSdcbmltcG9ydCAnLi9wcm90b3R5cGUtcHVibGljJyIsIkJpbmRpbmdJbnRlcmZhY2VQcml2YXRlID1cblx0c2VsZkNsb25lOiAoKS0+IG5ldyBCaW5kaW5nSW50ZXJmYWNlKG51bGwsIEApXG5cdFxuXHRkZWZpbmVNYWluUHJvcHM6IChiaW5kaW5nKS0+XG5cdFx0QF8gPSBiaW5kaW5nXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMgQCxcblx0XHRcdCd2YWx1ZSc6XHRcdGdldDogKCktPiBiaW5kaW5nLnZhbHVlXG5cdFx0XHQnb3JpZ2luYWwnOlx0XHRnZXQ6ICgpLT4gYmluZGluZy5vYmplY3RzIG9yIGJpbmRpbmcub2JqZWN0XG5cdFx0XHQnc3Vic2NyaWJlcnMnOlx0Z2V0OiAoKS0+IGJpbmRpbmcuc3Vicy5zbGljZSgpLm1hcCAoc3ViKS0+IHN1Yi5vYmplY3RcblxuXG5cblxuXHRjcmVhdGVCaW5kaW5nOiAoc3ViamVjdCwgbmV3T2JqZWN0VHlwZSwgYmluZGluZ0ludGVyZmFjZSwgaXNGdW5jdGlvbiktPlxuXHRcdEBvYmplY3QgPSBzdWJqZWN0XG5cdFx0Y2FjaGVkQmluZGluZyA9IGNhY2hlLmdldChzdWJqZWN0LCBpc0Z1bmN0aW9uLCBAc2VsZWN0b3IsIEBpc011bHRpQ2hvaWNlKVxuXHRcdFxuXHRcdGlmIGNhY2hlZEJpbmRpbmcgIyBFeGl0IGVhcmx5IGJ5IHJldHVybmluZyB0aGUgc3ViamVjdCBmcm9tIGNhY2hlIGlmIGlzIGFscmVhZHkgaW4gdGhlcmVcblx0XHRcdHJldHVybiBAcGF0Y2hDYWNoZWRCaW5kaW5nKGNhY2hlZEJpbmRpbmcpXG5cblx0XHRlbHNlXG5cdFx0XHRuZXdCaW5kaW5nID0gbmV3IEJpbmRpbmcoc3ViamVjdCwgbmV3T2JqZWN0VHlwZSwgYmluZGluZ0ludGVyZmFjZSlcblx0XHRcdGNhY2hlLnNldChuZXdCaW5kaW5nLCBpc0Z1bmN0aW9uKVxuXHRcdFx0cmV0dXJuIG5ld0JpbmRpbmdcblxuXG5cblx0cGF0Y2hDYWNoZWRCaW5kaW5nOiAoY2FjaGVkQmluZGluZyktPlxuXHRcdGlmIGNhY2hlZEJpbmRpbmcudHlwZSBpcyAnT2JqZWN0UHJvcCcgYW5kIEBwcm9wZXJ0eSBub3Qgb2YgQG9iamVjdCAjIFRoaXMgcHJvcGVydHkgd2FzIG1hbnVhbGx5IGRlbGV0ZWQgYW5kIG5lZWRzIGl0cyBwcm9wIHRvIGJlIHJlLWRlZmluZWQgYXMgYSBsaXZlIG9uZVxuXHRcdFx0Y29udmVydFRvTGl2ZShjYWNoZWRCaW5kaW5nLCBAb2JqZWN0KVxuXG5cdFx0aWYgQHNhdmVPcHRpb25zXG5cdFx0XHRjYWNoZWRCaW5kaW5nLm9wdGlvbnNEZWZhdWx0W29wdGlvbl0gPSB2YWx1ZSBmb3Igb3B0aW9uLHZhbHVlIG9mIEBvcHRpb25zUGFzc2VkXG5cblx0XHRmb3Iga2V5LHZhbHVlIG9mIGNhY2hlZEJpbmRpbmcub3B0aW9uc0RlZmF1bHRcblx0XHRcdEBvcHRpb25zW2tleV0gPSBpZiBjaGVja0lmLmlzRGVmaW5lZChAb3B0aW9uc1Bhc3NlZFtrZXldKSB0aGVuIEBvcHRpb25zUGFzc2VkW2tleV0gZWxzZSB2YWx1ZVxuXHRcdFxuXHRcdHJldHVybiBjYWNoZWRCaW5kaW5nXG5cblxuXG5cdHNldFByb3BlcnR5OiAoc3ViamVjdCktPlxuXHRcdHN1YmplY3QgPSBzdWJqZWN0LnRvU3RyaW5nKCkgaWYgY2hlY2tJZi5pc051bWJlcihzdWJqZWN0KVxuXHRcdEBzZWxlY3RvciA9IEBwcm9wZXJ0eSA9IHN1YmplY3RcblxuXHRcdFxuXHRcdHVubGVzcyBAb3B0aW9ucy5zaW1wbGVTZWxlY3RvclxuXHRcdFx0aWYgdGFyZ2V0SW5jbHVkZXMoc3ViamVjdCwgJzonKVxuXHRcdFx0XHRzcGxpdCA9IHN1YmplY3Quc3BsaXQoJzonKVxuXHRcdFx0XHRAZGVzY3JpcHRvciA9IHNwbGl0LnNsaWNlKDAsIC0xKS5qb2luKCc6Jylcblx0XHRcdFx0QHByb3BlcnR5ID0gc3BsaXRbc3BsaXQubGVuZ3RoLTFdXG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0aWYgdGFyZ2V0SW5jbHVkZXMoc3ViamVjdCwgJy4nKSAjIFBsYWNlaG9sZGVyIGV4dHJhY3Rpb25cblx0XHRcdFx0c3BsaXQgPSBAcHJvcGVydHkuc3BsaXQoJy4nKSAjIFdlIHVzZSAnQHByb3BlcnR5JyBpbnN0ZWFkIG9mICdzdWJqZWN0JyBiZWNhdXNlIGl0IG1heSBoYXZlIGJlZW4gbW9kaWZpZWQgYnkgdGhlIHByZXZpb3VzICc6JyBkZXNjcmlwdG9yIGNoZWNrXG5cdFx0XHRcdEBwcm9wZXJ0eSA9IHNwbGl0WzBdXHRcdFx0XHRcblx0XHRcdFx0QHBob2xkZXIgPSBzcGxpdC5zbGljZSgxKS5qb2luKCcuJylcblxuXG5cblx0XHRcdGlmIHRhcmdldEluY2x1ZGVzKEBkZXNjcmlwdG9yLCAnZXZlbnQnKVxuXHRcdFx0XHRpZiB0YXJnZXRJbmNsdWRlcyhzdWJqZWN0LCAnIycpXG5cdFx0XHRcdFx0c3BsaXQgPSBAcHJvcGVydHkuc3BsaXQoJyMnKVxuXHRcdFx0XHRcdEBldmVudE5hbWUgPSBzcGxpdFswXVxuXHRcdFx0XHRcdEBwcm9wZXJ0eSA9IHNwbGl0WzFdXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRAZXZlbnROYW1lID0gQHByb3BlcnR5XG5cdFx0XHRcdFx0QHByb3BlcnR5ID0gMFxuXG5cdFx0XHRcdHRocm93V2FybmluZygnYmFkRXZlbnRBcmcnLDEpIGlmIGlzTmFOIHBhcnNlSW50KEBwcm9wZXJ0eSlcblxuXHRcdHJldHVybiBAXG5cblxuXG5cdHNldE9iamVjdDogKHN1YmplY3QsIGlzRnVuY3Rpb24pLT5cblx0XHRAc3RhZ2UgPSAxXG5cdFx0aW1wb3J0ICcuL3Byb3RvdHlwZS1wcml2YXRlLnNldE9iamVjdC1wYXJzZURPTU9iamVjdCdcblx0XHRcblx0XHRzd2l0Y2hcblx0XHRcdHdoZW4gaXNGdW5jdGlvblxuXHRcdFx0XHRuZXdPYmplY3RUeXBlID0gJ0Z1bmMnXG5cdFx0XHRcblx0XHRcdHdoZW4gQHBob2xkZXJcblx0XHRcdFx0bmV3T2JqZWN0VHlwZSA9ICdQaG9sZGVyJ1xuXHRcdFx0XG5cdFx0XHR3aGVuIHRhcmdldEluY2x1ZGVzKEBkZXNjcmlwdG9yLCAnYXJyYXknKSBhbmQgY2hlY2tJZi5pc0FycmF5KHN1YmplY3RbQHByb3BlcnR5XSlcblx0XHRcdFx0bmV3T2JqZWN0VHlwZSA9ICdBcnJheSdcblx0XHRcdFxuXHRcdFx0d2hlbiB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ2V2ZW50Jylcblx0XHRcdFx0bmV3T2JqZWN0VHlwZSA9ICdFdmVudCdcblx0XHRcdFx0aW1wb3J0ICcuL3Byb3RvdHlwZS1wcml2YXRlLnNldE9iamVjdC1kZWZpbmVFdmVudE1ldGhvZHMnXG5cblx0XHRcdHdoZW4gdGFyZ2V0SW5jbHVkZXMoQGRlc2NyaXB0b3IsICdmdW5jJylcblx0XHRcdFx0bmV3T2JqZWN0VHlwZSA9ICdQcm94eSdcblx0XHRcdFxuXHRcdFx0d2hlbiBpc0RvbVJhZGlvIFxuXHRcdFx0XHRuZXdPYmplY3RUeXBlID0gJ0RPTVJhZGlvJ1xuXG5cdFx0XHR3aGVuIGlzRG9tQ2hlY2tib3ggXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnRE9NQ2hlY2tib3gnXG5cblx0XHRcdHdoZW4gdGFyZ2V0SW5jbHVkZXMoQGRlc2NyaXB0b3IsICdhdHRyJylcblx0XHRcdFx0bmV3T2JqZWN0VHlwZSA9ICdET01BdHRyJ1xuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnT2JqZWN0UHJvcCdcblx0XHRcblxuXHRcdGlmIHRhcmdldEluY2x1ZGVzKEBkZXNjcmlwdG9yLCAnbXVsdGknKVxuXHRcdFx0dGhyb3dFcnJvcignZW1wdHlMaXN0JykgaWYgbm90IHN1YmplY3QubGVuZ3RoXG5cdFx0XHRAZGVmaW5lTWFpblByb3BzIG5ldyBHcm91cEJpbmRpbmcoQCwgc3ViamVjdCwgbmV3T2JqZWN0VHlwZSlcblx0XHRlbHNlXG5cdFx0XHRAZGVmaW5lTWFpblByb3BzIEBjcmVhdGVCaW5kaW5nKHN1YmplY3QsIG5ld09iamVjdFR5cGUsIEAsIGlzRnVuY3Rpb24pXG5cblxuXHRcdGlmIHRhcmdldEluY2x1ZGVzKEBfLnR5cGUsICdFdmVudCcpIG9yIHRhcmdldEluY2x1ZGVzKEBfLnR5cGUsICdQcm94eScpXG5cdFx0XHRAb3B0aW9ucy51cGRhdGVPbkJpbmQgPSBmYWxzZVxuXHRcdGVsc2UgaWYgdGFyZ2V0SW5jbHVkZXMoQF8udHlwZSwgJ0Z1bmMnKVxuXHRcdFx0QG9wdGlvbnMudXBkYXRlT25CaW5kID0gdHJ1ZVxuXG5cblx0XHRpZiBAY29tcGxldGVDYWxsYmFja1xuXHRcdFx0cmV0dXJuIEBjb21wbGV0ZUNhbGxiYWNrKEApXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIEBcblxuXG5cblxuXHRhZGRUb1B1Ymxpc2hlcjogKHB1Ymxpc2hlckludGVyZmFjZSktPlxuXHRcdHB1Ymxpc2hlckludGVyZmFjZS5zdGFnZSA9IDJcblx0XHRwdWJsaXNoZXJJbnRlcmZhY2Uuc3Vicy5wdXNoKEApXG5cdFx0YWxyZWFkeUhhZFN1YiA9IHB1Ymxpc2hlckludGVyZmFjZS5fLmFkZFN1YihAXywgcHVibGlzaGVySW50ZXJmYWNlLm9wdGlvbnMsIHB1Ymxpc2hlckludGVyZmFjZS51cGRhdGVPbmNlKVxuXG5cdFx0aWYgcHVibGlzaGVySW50ZXJmYWNlLnVwZGF0ZU9uY2Vcblx0XHRcdGRlbGV0ZSBwdWJsaXNoZXJJbnRlcmZhY2UudXBkYXRlT25jZVxuXHRcdFxuXHRcdGVsc2UgaWYgcHVibGlzaGVySW50ZXJmYWNlLm9wdGlvbnMudXBkYXRlT25CaW5kIGFuZCBub3QgYWxyZWFkeUhhZFN1YlxuXHRcdFx0aWYgQF8uaXNNdWx0aVxuXHRcdFx0XHRwdWJsaXNoZXJJbnRlcmZhY2UuXy51cGRhdGVTdWIoYmluZGluZywgcHVibGlzaGVySW50ZXJmYWNlLl8pIGZvciBiaW5kaW5nIGluIEBfLmJpbmRpbmdzXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHB1Ymxpc2hlckludGVyZmFjZS5fLnVwZGF0ZVN1YihAXywgcHVibGlzaGVySW50ZXJmYWNlLl8pXG5cblx0XHRyZXR1cm5cblxuXG5cblxuXG4iLCJpc0l0ZXJhYmxlID0gc3ViamVjdCBpc250IHdpbmRvdyBhbmQgY2hlY2tJZi5pc0l0ZXJhYmxlKHN1YmplY3QpIGFuZCBub3Qgc3ViamVjdC5ub2RlVHlwZVxuc2FtcGxlSXRlbSA9IGlmIGlzSXRlcmFibGUgdGhlbiBzdWJqZWN0WzBdIGVsc2Ugc3ViamVjdFxuXG5pZiBub3Qgc2FtcGxlSXRlbVxuXHR0aHJvd0Vycm9yKCdlbXB0eUxpc3QnKSBpZiBpc0l0ZXJhYmxlIGFuZCBjaGVja0lmLmlzRWxDb2xsZWN0aW9uKHN1YmplY3QpXG5cbmVsc2UgaWYgQGlzRG9tID0gY2hlY2tJZi5pc0RvbShzYW1wbGVJdGVtKVxuXG5cdGlmIEBwcm9wZXJ0eSBpcyAnY2hlY2tlZCdcblx0XHRpc0RvbVJhZGlvID0gc2FtcGxlSXRlbSBhbmQgY2hlY2tJZi5pc0RvbVJhZGlvKHNhbXBsZUl0ZW0pXG5cdFx0aXNEb21DaGVja2JveCA9IG5vdCBpc0RvbVJhZGlvIGFuZCBzYW1wbGVJdGVtIGFuZCBjaGVja0lmLmlzRG9tQ2hlY2tib3goc2FtcGxlSXRlbSlcblx0XG5cdGVsc2UgaWYgQHByb3BlcnR5IGlzICd2YWx1ZSdcblx0XHRAaXNEb21JbnB1dCA9IGNoZWNrSWYuaXNEb21JbnB1dChzYW1wbGVJdGVtKVxuXHRcblxuXHRpZiBpc0l0ZXJhYmxlIGFuZCBub3QgdGFyZ2V0SW5jbHVkZXMoQGRlc2NyaXB0b3IsICdtdWx0aScpXG5cdFx0aWYgc3ViamVjdC5sZW5ndGggaXMgMVxuXHRcdFx0c3ViamVjdCA9IHN1YmplY3RbMF1cblxuXHRcdGVsc2Vcblx0XHRcdGlmIChpc0RvbVJhZGlvIG9yIGlzRG9tQ2hlY2tib3gpIGFuZCBub3QgY2hlY2tJZi5kb21FbHNBcmVTYW1lKHN1YmplY3QpXG5cdFx0XHRcdHJldHVybiB0aHJvd1dhcm5pbmcoJ21peGVkRWxMaXN0JywzKVx0XHRcdFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBpc0RvbVJhZGlvIG9yIGlzRG9tQ2hlY2tib3hcblx0XHRcdFx0XHRAaXNNdWx0aUNob2ljZSA9IHRydWVcblx0XHRcdFx0XHRzdWJqZWN0ID0gW10uc2xpY2UuY2FsbChzdWJqZWN0KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c3ViamVjdCA9IHN1YmplY3RbMF1cblx0XHRcdFx0XHR0aHJvd1dhcm5pbmcoJ29ubHlPbmVET01FbGVtZW50JywzKVxuXG5cblxuXG4iLCJAZXZlbnRNZXRob2RzID0gbGlzdGVuOkBvcHRpb25zUGFzc2VkLmxpc3Rlbk1ldGhvZCwgcmVtb3ZlOkBvcHRpb25zUGFzc2VkLnJlbW92ZU1ldGhvZCwgZW1pdDpAb3B0aW9uc1Bhc3NlZC5lbWl0TWV0aG9kXG5cblxuXG5pZiBub3Qgc3ViamVjdFtAZXZlbnRNZXRob2RzLmxpc3Rlbl1cblx0QGV2ZW50TWV0aG9kcy5saXN0ZW4gPSBpZiBjaGVja0lmLmlzRG9tTm9kZShzdWJqZWN0KSB0aGVuICdhZGRFdmVudExpc3RlbmVyJyBlbHNlICdvbidcblxuaWYgbm90IHN1YmplY3RbQGV2ZW50TWV0aG9kcy5yZW1vdmVdXG5cdEBldmVudE1ldGhvZHMucmVtb3ZlID0gaWYgY2hlY2tJZi5pc0RvbU5vZGUoc3ViamVjdCkgdGhlbiAncmVtb3ZlRXZlbnRMaXN0ZW5lcicgZWxzZSAncmVtb3ZlTGlzdGVuZXInXG5cbmlmIG5vdCBzdWJqZWN0W0BldmVudE1ldGhvZHMuZW1pdF1cblx0QGV2ZW50TWV0aG9kcy5lbWl0ID0gaWYgY2hlY2tJZi5pc0RvbU5vZGUoc3ViamVjdCkgdGhlbiAnZGlzcGF0Y2hFdmVudCcgZWxzZSAnZW1pdCciLCJCaW5kaW5nSW50ZXJmYWNlOjogPSBPYmplY3QuY3JlYXRlIEJpbmRpbmdJbnRlcmZhY2VQcml2YXRlLFxuXHRvZjpcdFx0XHRcdFx0Z2V0OiAoKS0+IE1FVEhPRF9vZiBpZiBub3QgQHN0YWdlXHRcdFx0Iz09PSBpZiBzdGFnZSBpcyAwXG5cdHNldDpcdFx0XHRcdGdldDogKCktPiBNRVRIT0Rfc2V0IGlmIEBzdGFnZVx0XHRcdFx0Iz09PSBpZiBzdGFnZSBpcyAxIG9yIDJcblx0Y2hhaW5UbzpcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX2NoYWluVG8gaWYgQHN0YWdlIGlzIDJcblx0dHJhbnNmb3JtU2VsZjpcdFx0Z2V0OiAoKS0+IE1FVEhPRF90cmFuc2Zvcm1TZWxmIGlmIEBzdGFnZSBpcyAxXG5cdHRyYW5zZm9ybTpcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX3RyYW5zZm9ybSBpZiBAc3RhZ2UgaXMgMlxuXHR0cmFuc2Zvcm1BbGw6XHRcdGdldDogKCktPiBNRVRIT0RfdHJhbnNmb3JtQWxsIGlmIEBzdGFnZSBpcyAyXG5cdGNvbmRpdGlvbjpcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX2NvbmRpdGlvbiBpZiBAc3RhZ2UgaXMgMlxuXHRjb25kaXRpb25BbGw6XHRcdGdldDogKCktPiBNRVRIT0RfY29uZGl0aW9uQWxsIGlmIEBzdGFnZSBpcyAyXG5cdGJvdGhXYXlzOlx0XHRcdGdldDogKCktPiBNRVRIT0RfYm90aFdheXMgaWYgQHN0YWdlIGlzIDJcblx0dW5CaW5kOlx0XHRcdFx0Z2V0OiAoKS0+IE1FVEhPRF91bkJpbmQgaWYgQHN0YWdlIGlzIDJcblx0cG9sbEV2ZXJ5Olx0XHRcdGdldDogKCktPiBNRVRIT0RfcG9sbEV2ZXJ5IGlmIEBzdGFnZSAjPT09IGlmIHN0YWdlIGlzIDEgb3IgMlxuXHRzdG9wUG9sbGluZzpcdFx0Z2V0OiAoKS0+IE1FVEhPRF9zdG9wUG9sbGluZyBpZiBAc3RhZ2UgIz09PSBpZiBzdGFnZSBpcyAxIG9yIDJcblx0c2V0T3B0aW9uOlx0XHRcdGdldDogKCktPiBNRVRIT0Rfc2V0T3B0aW9uIGlmIEBzdGFnZSBpcyAyXG5cdGRpc2FsbG93RnJvbTpcdFx0Z2V0OiAoKS0+IGlmIEBzdGFnZSBpcyAyIGFuZCAodGhpc0ludGVyZmFjZT1AKVxuXHRcdFx0XHRcdFx0XHRnZW5Qcm94aWVkSW50ZXJmYWNlIGZhbHNlLCAoZGlzYWxsb3dJbnRlcmZhY2UpLT5cblx0XHRcdFx0XHRcdFx0XHRzdWJJbnRlcmZhY2UgPSB0aGlzSW50ZXJmYWNlLnN1YnNbdGhpc0ludGVyZmFjZS5zdWJzLmxlbmd0aC0xXVxuXHRcdFx0XHRcdFx0XHRcdHRoaXNJbnRlcmZhY2UuXy5hZGREaXNhbGxvd1J1bGUoc3ViSW50ZXJmYWNlLl8sIGRpc2FsbG93SW50ZXJmYWNlLl8pXG5cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpc0ludGVyZmFjZVxuXHRcblx0dXBkYXRlT246XHRcdFx0Z2V0OiAoKS0+IGlmIEBzdGFnZSBhbmQgKHRoaXNJbnRlcmZhY2U9QCkgIz09PSBpZiBzdGFnZSBpcyAxIG9yIDJcblx0XHRcdFx0XHRcdFx0Z2VuUHJveGllZEludGVyZmFjZSBmYWxzZSwgKHN1YkludGVyZmFjZSktPlxuXHRcdFx0XHRcdFx0XHRcdGlmIHN1YkludGVyZmFjZS5fIGlzbnQgdGhpc0ludGVyZmFjZS5fXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzSW50ZXJmYWNlLl8ucHVic01hcFtzdWJJbnRlcmZhY2UuXy5JRF0gPSBzdWJJbnRlcmZhY2UuX1xuXHRcdFx0XHRcdFx0XHRcdFx0c3ViSW50ZXJmYWNlLl8uYWRkU3ViIGdlblNlbGZVcGRhdGVyKHRoaXNJbnRlcmZhY2UuXywgdHJ1ZSksIHN1YkludGVyZmFjZS5vcHRpb25zLCBmYWxzZSwgdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzSW50ZXJmYWNlXG5cdFxuXG5cdHJlbW92ZVVwZGF0ZXI6XHRcdGdldDogKCktPiBpZiBAc3RhZ2UgYW5kICh0aGlzSW50ZXJmYWNlPUApIGFuZCAoc2VsZlVwZGF0ZXI9QF8uc2VsZlVwZGF0ZXIpICM9PT0gaWYgc3RhZ2UgaXMgMSBvciAyXG5cdFx0XHRcdFx0XHRcdGdlblByb3hpZWRJbnRlcmZhY2UgZmFsc2UsIChzdWJJbnRlcmZhY2UpLT5cblx0XHRcdFx0XHRcdFx0XHRpZiBzdWJJbnRlcmZhY2UuXy5zdWJzTWV0YVtzZWxmVXBkYXRlci5JRF1cblx0XHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSB0aGlzSW50ZXJmYWNlLl8ucHVic01hcFtzdWJJbnRlcmZhY2UuXy5JRF1cblx0XHRcdFx0XHRcdFx0XHRcdHN1YkludGVyZmFjZS5fLnJlbW92ZVN1YihzZWxmVXBkYXRlcilcblxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblxuXG5cblx0dG86XHRcdFx0XHRcdGdldDogKCktPiBpZiBAc3RhZ2UgaXMgMSBhbmQgKHRoaXNJbnRlcmZhY2U9QClcblx0XHRcdFx0XHRcdFx0Z2VuUHJveGllZEludGVyZmFjZSB0cnVlLCAoc3ViSW50ZXJmYWNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0aWYgc3ViSW50ZXJmYWNlLl8gaXNudCB0aGlzSW50ZXJmYWNlLl9cblx0XHRcdFx0XHRcdFx0XHRcdHN1YkludGVyZmFjZS5hZGRUb1B1Ymxpc2hlcih0aGlzSW50ZXJmYWNlKVxuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzSW50ZXJmYWNlXG5cdFxuXG5cdGFuZDpcdFx0XHRcdGdldDogKCktPlxuXHRcdFx0XHRcdFx0XHRjbG9uZUludGVyZmFjZSA9IEBzZWxmQ2xvbmUoKVxuXHRcdFx0XHRcdFx0XHRpZiBAc3RhZ2UgaXMgMlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBjbG9uZUludGVyZmFjZVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgQHN0YWdlIGlzIDFcblx0XHRcdFx0XHRcdFx0XHRpZiBub3QgY2xvbmVJbnRlcmZhY2UuXy5pc011bHRpXG5cdFx0XHRcdFx0XHRcdFx0XHRjbG9uZUJpbmRpbmcgPSBjbG9uZUludGVyZmFjZS5fXG5cdFx0XHRcdFx0XHRcdFx0XHRjbG9uZUludGVyZmFjZS5fID0gY2xvbmVJbnRlcmZhY2UuXyA9IG5ldyBHcm91cEJpbmRpbmcoY2xvbmVJbnRlcmZhY2UpXG5cdFx0XHRcdFx0XHRcdFx0XHRjbG9uZUludGVyZmFjZS5fLmFkZEJpbmRpbmcoY2xvbmVCaW5kaW5nKVxuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBnZW5Qcm94aWVkSW50ZXJmYWNlIGZhbHNlLCAoc2libGluZ0ludGVyZmFjZSktPlxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xvbmVJbnRlcmZhY2UuXy5hZGRCaW5kaW5nKHNpYmxpbmdJbnRlcmZhY2UuXylcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBjbG9uZUludGVyZmFjZVxuXHRcblxuXHRvbmNlOlx0XHRcdFx0Z2V0OiAoKS0+IGlmIEBzdGFnZSBpcyAxXG5cdFx0XHRcdFx0XHRcdGludGVyZmFjZVRvUmV0dXJuID0gQHNlbGZDbG9uZSgpXG5cdFx0XHRcdFx0XHRcdGludGVyZmFjZVRvUmV0dXJuLnVwZGF0ZU9uY2UgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBpbnRlcmZhY2VUb1JldHVyblxuXG5cdCMgPT09PSBBbGlhc2VzID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHR1cGRhdGU6XHRcdFx0XHRnZXQ6ICgpLT4gQHNldFxuXHR0d29XYXk6XHRcdFx0XHRnZXQ6ICgpLT4gQGJvdGhXYXlzXG5cdHBpcGU6XHRcdFx0XHRnZXQ6ICgpLT4gQGNoYWluVG9cblxuXG5cblxuTUVUSE9EX29mID0gKG9iamVjdCktPlxuXHR0aHJvd0Vycm9yQmFkQXJnKG9iamVjdCkgdW5sZXNzIGNoZWNrSWYuaXNPYmplY3Qob2JqZWN0KSBvciBjaGVja0lmLmlzRnVuY3Rpb24ob2JqZWN0KVxuXHRcblx0aWYgY2hlY2tJZi5pc0JpbmRpbmdJbnRlcmZhY2Uob2JqZWN0KVxuXHRcdG9iamVjdCA9IG9iamVjdC5vYmplY3RcblxuXHRAc3RhZ2UgPSAxXG5cdHJldHVybiBAc2V0T2JqZWN0KG9iamVjdClcblxuXG5cblxuXG5NRVRIT0RfY2hhaW5UbyA9IChzdWJqZWN0LCBzcGVjaWZpY09wdGlvbnMsIHNhdmVPcHRpb25zKS0+XG5cdHJldHVybiBTaW1wbHlCaW5kKEBzdWJzW0BzdWJzLmxlbmd0aC0xXSkudG8oc3ViamVjdCwgc3BlY2lmaWNPcHRpb25zLCBzYXZlT3B0aW9ucylcblxuXG5cblxuXG5NRVRIT0Rfc2V0ID0gKG5ld1ZhbHVlKS0+XG5cdEBfLnNldFZhbHVlKG5ld1ZhbHVlKVxuXHRyZXR1cm4gQFxuXG5cblxuXG5cblxuXG5cbk1FVEhPRF90cmFuc2Zvcm1TZWxmID0gKHRyYW5zZm9ybUZuKS0+ICMgQXBwbGllZCBvbmx5IHRvIHRoZSBsYXN0IHN1YlxuXHRpZiBub3QgY2hlY2tJZi5pc0Z1bmN0aW9uKHRyYW5zZm9ybUZuKVxuXHRcdHRocm93V2FybmluZygnZm5Pbmx5JywxKVxuXHRlbHNlXG5cdFx0QF8uc2V0U2VsZlRyYW5zZm9ybSh0cmFuc2Zvcm1GbiwgQG9wdGlvbnMudXBkYXRlT25CaW5kKVxuXHRcdFxuXHRyZXR1cm4gQFxuXG5cbk1FVEhPRF90cmFuc2Zvcm0gPSAodHJhbnNmb3JtRm4pLT4gIyBBcHBsaWVkIG9ubHkgdG8gdGhlIGxhc3Qgc3ViXG5cdEBfLmFkZE1vZGlmaWVyRm4oJ3RyYW5zZm9ybUZuJywgQHN1YnMuc2xpY2UoLTEpLCB0cmFuc2Zvcm1GbiwgQG9wdGlvbnMudXBkYXRlT25CaW5kKVxuXHRyZXR1cm4gQFxuXG5cbk1FVEhPRF90cmFuc2Zvcm1BbGwgPSAodHJhbnNmb3JtRm4pLT4gIyBBcHBsaWVkIHRvIGVudHJpZSBzdWJzIHNldFx0XHRcblx0QF8uYWRkTW9kaWZpZXJGbigndHJhbnNmb3JtRm4nLCBAc3VicywgdHJhbnNmb3JtRm4sIEBvcHRpb25zLnVwZGF0ZU9uQmluZClcblx0cmV0dXJuIEBcblxuXG5cblxuXG5cbk1FVEhPRF9jb25kaXRpb24gPSAoY29uZGl0aW9uRm4pLT4gIyBBcHBsaWVkIG9ubHkgdG8gdGhlIGxhc3Qgc3ViXG5cdEBfLmFkZE1vZGlmaWVyRm4oJ2NvbmRpdGlvbkZuJywgQHN1YnMuc2xpY2UoLTEpLCBjb25kaXRpb25Gbilcblx0cmV0dXJuIEBcblxuXG5NRVRIT0RfY29uZGl0aW9uQWxsID0gKGNvbmRpdGlvbkZuKS0+ICMgQXBwbGllZCB0byBlbnRyaWUgc3VicyBzZXRcblx0QF8uYWRkTW9kaWZpZXJGbignY29uZGl0aW9uRm4nLCBAc3VicywgY29uZGl0aW9uRm4pXG5cdHJldHVybiBAXG5cblxuXG5cblxuXG5cbk1FVEhPRF9ib3RoV2F5cyA9IChhbHRUcmFuc2Zvcm0pLT4gIyBBcHBsaWVkIG9ubHkgdG8gdGhlIGxhc3Qgc3ViXG5cdHN1YiA9IEBzdWJzW0BzdWJzLmxlbmd0aC0xXSAjIExhc3QgUHJveGllZFxuXHRzdWJCaW5kaW5nID0gc3ViLl9cblx0YmluZGluZ3MgPSBpZiBAXy5pc011bHRpIHRoZW4gQF8uYmluZGluZ3MgZWxzZSBbQF9dXG5cblx0c3ViQmluZGluZy5hZGRTdWIoQF8sIHN1Yi5vcHRpb25zKVxuXHRcblx0Zm9yIGJpbmRpbmcgaW4gYmluZGluZ3Ncblx0XHRvcmlnaW5UcmFuc2Zvcm0gPSBiaW5kaW5nLnN1YnNNZXRhW3N1YkJpbmRpbmcuSURdLnRyYW5zZm9ybUZuXG5cdFx0b3JpZ2luQ29uZGl0aW9uID0gYmluZGluZy5zdWJzTWV0YVtzdWJCaW5kaW5nLklEXS5jb25kaXRpb25GblxuXG5cdFx0aWYgb3JpZ2luVHJhbnNmb3JtIG9yIGFsdFRyYW5zZm9ybVxuXHRcdFx0dHJhbnNmb3JtVG9Vc2UgPSBpZiBjaGVja0lmLmlzRnVuY3Rpb24oYWx0VHJhbnNmb3JtKSB0aGVuIGFsdFRyYW5zZm9ybSBlbHNlIG9yaWdpblRyYW5zZm9ybVxuXHRcdFx0c3ViQmluZGluZy5zdWJzTWV0YVtAXy5JRF0udHJhbnNmb3JtRm4gPSB0cmFuc2Zvcm1Ub1VzZSBpZiB0cmFuc2Zvcm1Ub1VzZSBhbmQgYWx0VHJhbnNmb3JtIGlzbnQgZmFsc2VcblxuXHRcdGlmIG9yaWdpbkNvbmRpdGlvblxuXHRcdFx0c3ViQmluZGluZy5zdWJzTWV0YVtAXy5JRF0uY29uZGl0aW9uRm4gPSBvcmlnaW5Db25kaXRpb25cblxuXHRyZXR1cm4gQFxuXG5cblxuTUVUSE9EX3VuQmluZCA9IChib3RoV2F5cyktPiAjIEFwcGxpZWQgdG8gYWxsIHN1YnNcblx0QF8ucmVtb3ZlU3ViKHN1Yi5fLCBib3RoV2F5cykgZm9yIHN1YiBpbiBAc3Vic1xuXHRyZXR1cm4gQFxuXG5cblxuXG5cbk1FVEhPRF9wb2xsRXZlcnkgPSAodGltZSktPlxuXHRAXy5hZGRQb2xsSW50ZXJ2YWwodGltZSlcblx0cmV0dXJuIEBcblxuXG5cbk1FVEhPRF9zdG9wUG9sbGluZyA9ICgpLT5cblx0QF8ucmVtb3ZlUG9sbEludGVydmFsKClcblx0cmV0dXJuIEBcblxuXG5cbk1FVEhPRF9zZXRPcHRpb24gPSAob3B0aW9uTmFtZSwgbmV3VmFsdWUpLT5cblx0QF8uc3Vic01ldGFbQHN1YnNbQHN1YnMubGVuZ3RoLTFdLl8uSURdLm9wdHNbb3B0aW9uTmFtZV0gPSBuZXdWYWx1ZVx0XG5cdHJldHVybiBAXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJHcm91cEJpbmRpbmcgPSAoYmluZGluZ0ludGVyZmFjZSwgb2JqZWN0cywgb2JqZWN0VHlwZSktPlxuXHRiaW5kaW5nSW50ZXJmYWNlLnNlbGVjdG9yID0gYmluZGluZ0ludGVyZmFjZS5zZWxlY3Rvci5zbGljZSg2KSAjIFRha2Ugb3V0IHRoZSAnbXVsdGk6J1xuXHRleHRlbmRTdGF0ZShALCBAaW50ZXJmYWNlID0gYmluZGluZ0ludGVyZmFjZSlcblx0QGlzTXVsdGkgPSB0cnVlXG5cdEBiaW5kaW5ncyA9IGJpbmRpbmdzID0gW11cblxuXHRpZiBvYmplY3RzXG5cdFx0QGFkZEJpbmRpbmcob2JqZWN0LCBvYmplY3RUeXBlKSBmb3Igb2JqZWN0IGluIG9iamVjdHNcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyBALFxuXHRcdCd0eXBlJzpcdFx0XHRcdGdldDogKCktPiBiaW5kaW5ncy5tYXAgKGJpbmRpbmcpLT4gYmluZGluZy50eXBlXG5cdFx0J3ZhbHVlJzogXHRcdFx0Z2V0OiAoKS0+IGJpbmRpbmdzLm1hcCAoYmluZGluZyktPiBiaW5kaW5nLnZhbHVlXG5cblxuXG5cblxuXG5wcm90byA9IEdyb3VwQmluZGluZzo6ID0gT2JqZWN0LmNyZWF0ZShCaW5kaW5nSW50ZXJmYWNlUHJpdmF0ZSlcblxuT2JqZWN0LmtleXMoQmluZGluZzo6KS5mb3JFYWNoIChtZXRob2ROYW1lKS0+XHRcblx0cHJvdG9bbWV0aG9kTmFtZV0gPSAoYSxiLGMsZCktPiAjIEZvdXIgYXJndW1lbnRzIGlzIHRoZSBtb3N0IGV2ZXIgcGFzc2VkIHRvIGFueSBtZXRob2QgZnJvbSBCaW5kaW5nSW50ZXJmYWNlIG1ldGhvZHNcblx0XHRmb3IgYmluZGluZyBpbiBAYmluZGluZ3Ncblx0XHRcdGIgPSBiaW5kaW5nIGlmIG1ldGhvZE5hbWUgaXMgJ3VwZGF0ZVN1Yidcblx0XHRcdGJpbmRpbmdbbWV0aG9kTmFtZV0oYSxiLGMsZClcblx0XHRcblx0XHRyZXR1cm5cblxuXG5wcm90by5hZGRCaW5kaW5nID0gKG9iamVjdCwgb2JqZWN0VHlwZSktPlxuXHRAYmluZGluZ3MucHVzaCBpZiBub3Qgb2JqZWN0VHlwZSB0aGVuIG9iamVjdCBlbHNlIEBjcmVhdGVCaW5kaW5nKG9iamVjdCwgb2JqZWN0VHlwZSwgQGludGVyZmFjZSlcblx0cmV0dXJuIiwibW9kdWxlLmV4cG9ydHMgPSBcblx0YW55OiAvLi9cblx0d2hpdGVTcGFjZTogL1xccysvXG5cdG51bWVyaWM6IC9eXFxkJC9cblx0bGV0dGVyOiAvXlthLXpBLVpdJC9cblx0IyBhbHBoYW51bWVyaWM6IC9bXFxkYS16QS1aXS9cblx0d2lkZW51bWVyaWM6IC9eWzAtOVxcISNcXCRcXCVcXCpcXCtcXC9cXD1cXD9cXF5cXHtcXHxcXH1cXChcXClcXH5cXC1cXC5dJC9cblx0YWxwaGFudW1lcmljOiAvXlswLTlBLVphLXpcXCEjXFwkXFwlXFwmXFwnXFwqXFwrXFwvXFw9XFw/XFxeXFxfXFxgXFx7XFx8XFx9XFwoXFwpXFx+XFwtXFwgXSQvXG5cdGVtYWlsOiAvXltcXHdcXC1cXC5dK0BbXFx3XFwtXFwuXStcXC5bQS1aYS16XXsyLDEwfSQvIiwiY29uc3RhbnRzID0gaW1wb3J0ICcuL2NvbnN0YW50cydcbmhlbHBlcnMgPSBpbXBvcnQgJy4vaGVscGVycydcblxuUXVpY2tDU1MgPSAodGFyZ2V0RWwsIHByb3BlcnR5LCB2YWx1ZSwgaW1wb3J0YW50KS0+XG5cdGlmIGhlbHBlcnMuaXNJdGVyYWJsZSh0YXJnZXRFbClcblx0XHRRdWlja0NTUyhzdWJFbCwgcHJvcGVydHksIHZhbHVlKSBmb3Igc3ViRWwgaW4gdGFyZ2V0RWxcblx0XG5cdGVsc2UgaWYgdHlwZW9mIHByb3BlcnR5IGlzICdvYmplY3QnICMgUGFzc2VkIGEgc3R5bGUgbWFwXG5cdFx0UXVpY2tDU1ModGFyZ2V0RWwsIHN1YlByb3BlcnR5LCBzdWJWYWx1ZSkgZm9yIHN1YlByb3BlcnR5LHN1YlZhbHVlIG9mIHByb3BlcnR5XG5cdFxuXHRlbHNlXG5cdFx0cHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5KHByb3BlcnR5KVxuXHRcdGlmIHR5cGVvZiB2YWx1ZSBpcyAndW5kZWZpbmVkJ1xuXHRcdFx0Y29tcHV0ZWRTdHlsZSA9IHRhcmdldEVsLl9jb21wdXRlZFN0eWxlIHx8PSBnZXRDb21wdXRlZFN0eWxlKHRhcmdldEVsKVxuXHRcdFx0cmV0dXJuIGNvbXB1dGVkU3R5bGVbcHJvcGVydHldXG5cdFx0XG5cdFx0ZWxzZSBpZiBwcm9wZXJ0eVxuXHRcdFx0dGFyZ2V0RWwuc3R5bGUuc2V0UHJvcGVydHkocHJvcGVydHksIGhlbHBlcnMubm9ybWFsaXplVmFsdWUocHJvcGVydHksIHZhbHVlKSwgY29uc3RhbnRzLklNUE9SVEFOVCBpZiBpbXBvcnRhbnQpXG5cblx0cmV0dXJuXG5cblxuUXVpY2tDU1MuYW5pbWF0aW9uID0gKG5hbWUsIGZyYW1lcyktPiBpZiBuYW1lIGFuZCB0eXBlb2YgbmFtZSBpcyAnc3RyaW5nJyBhbmQgZnJhbWVzIGFuZCB0eXBlb2YgZnJhbWVzIGlzICdvYmplY3QnXG5cdHByZWZpeCA9IGhlbHBlcnMuZ2V0UHJlZml4KCdhbmltYXRpb24nKVxuXHRnZW5lcmF0ZWQgPSAnJ1xuXHRcblx0Zm9yIGZyYW1lLHJ1bGVzIG9mIGZyYW1lc1xuXHRcdGdlbmVyYXRlZCArPSBcIiN7ZnJhbWV9IHsje2hlbHBlcnMucnVsZVRvU3RyaW5nKHJ1bGVzKX19XCJcblxuXHRnZW5lcmF0ZWQgPSBcIkAje3ByZWZpeH1rZXlmcmFtZXMgI3tuYW1lfSB7I3tnZW5lcmF0ZWR9fVwiXG5cdGhlbHBlcnMuaW5saW5lU3R5bGUoZ2VuZXJhdGVkLCB0cnVlLCAwKVxuXG5cblF1aWNrQ1NTLnJlZ2lzdGVyID0gKHJ1bGUsIGxldmVsLCBpbXBvcnRhbnQpLT4gaWYgcnVsZSBhbmQgdHlwZW9mIHJ1bGUgaXMgJ29iamVjdCdcblx0bGV2ZWwgfHw9IDBcblx0cnVsZSA9IGhlbHBlcnMucnVsZVRvU3RyaW5nKHJ1bGUsIGltcG9ydGFudClcblx0XG5cdHVubGVzcyBjbGFzc05hbWUgPSBoZWxwZXJzLmlubGluZVN0eWxlQ29uZmlnW2xldmVsXT9bcnVsZV1cblx0XHRjbGFzc05hbWUgPSBoZWxwZXJzLmhhc2gocnVsZSlcblx0XHRzdHlsZSA9IFwiLiN7Y2xhc3NOYW1lfSB7I3tydWxlfX1cIlxuXHRcdGhlbHBlcnMuaW5saW5lU3R5bGUoc3R5bGUsIGNsYXNzTmFtZSwgbGV2ZWwpXG5cblx0cmV0dXJuIGNsYXNzTmFtZVxuXG5cblF1aWNrQ1NTLmNsZWFyUmVnaXN0ZXJlZCA9IChsZXZlbCktPlxuXHRoZWxwZXJzLmNsZWFySW5saW5lU3R5bGUobGV2ZWwgb3IgMClcblxuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja0NTUy5VTlNFVCA9IHN3aXRjaFxuXHR3aGVuIGhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZCgnZGlzcGxheScsJ3Vuc2V0JykgdGhlbiAndW5zZXQnXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywnaW5pdGlhbCcpIHRoZW4gJ2luaXRpYWwnXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywnaW5oZXJpdCcpIHRoZW4gJ2luaGVyaXQnXG5cblF1aWNrQ1NTLnN1cHBvcnRzID0gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkXG5RdWlja0NTUy5zdXBwb3J0c1Byb3BlcnR5ID0gaGVscGVycy5pc1Byb3BTdXBwb3J0ZWRcblF1aWNrQ1NTLm5vcm1hbGl6ZVByb3BlcnR5ID0gaGVscGVycy5ub3JtYWxpemVQcm9wZXJ0eVxuUXVpY2tDU1Mubm9ybWFsaXplVmFsdWUgPSBoZWxwZXJzLm5vcm1hbGl6ZVZhbHVlXG5RdWlja0NTUy52ZXJzaW9uID0gaW1wb3J0ICcuLi9wYWNrYWdlLmpzb24gJCB2ZXJzaW9uJ1xubW9kdWxlLmV4cG9ydHMgPSBRdWlja0NTUyIsIntcbiAgXCJfZnJvbVwiOiBcInF1aWNrY3NzQF4xLjMuNFwiLFxuICBcIl9pZFwiOiBcInF1aWNrY3NzQDEuMy40XCIsXG4gIFwiX2luQnVuZGxlXCI6IGZhbHNlLFxuICBcIl9pbnRlZ3JpdHlcIjogXCJzaGE1MTItVUR3TE5YNXEwcXVFOW1WTmN6Q1JYQlp2R0xiazhyVU16QzBYM0pLdDJaYWp2VUZ3dnRFbGFESDFGMVdja0lpNlQzREdldnRSb0tYa1A2Q1Fkc1kyeWc9PVwiLFxuICBcIl9sb2NhdGlvblwiOiBcIi9xdWlja2RvbS9xdWlja2Nzc1wiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwicmFuZ2VcIixcbiAgICBcInJlZ2lzdHJ5XCI6IHRydWUsXG4gICAgXCJyYXdcIjogXCJxdWlja2Nzc0BeMS4zLjRcIixcbiAgICBcIm5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICAgIFwicmF3U3BlY1wiOiBcIl4xLjMuNFwiLFxuICAgIFwic2F2ZVNwZWNcIjogbnVsbCxcbiAgICBcImZldGNoU3BlY1wiOiBcIl4xLjMuNFwiXG4gIH0sXG4gIFwiX3JlcXVpcmVkQnlcIjogW1xuICAgIFwiL3F1aWNrZG9tXCJcbiAgXSxcbiAgXCJfcmVzb2x2ZWRcIjogXCJodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy9xdWlja2Nzcy8tL3F1aWNrY3NzLTEuMy40LnRnelwiLFxuICBcIl9zaGFzdW1cIjogXCJjZTE0NWNhNTExYmM1MDZiMmQ5YTYxNGVkNWI2MWU3ODY5ZmUxMWQ1XCIsXG4gIFwiX3NwZWNcIjogXCJxdWlja2Nzc0BeMS4zLjRcIixcbiAgXCJfd2hlcmVcIjogXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkL25vZGVfbW9kdWxlcy9xdWlja2RvbVwiLFxuICBcImF1dGhvclwiOiB7XG4gICAgXCJuYW1lXCI6IFwiZGFuaWVsa2FsZW5cIlxuICB9LFxuICBcImJyb3dzZXJcIjoge1xuICAgIFwiLi9kZWJ1Z1wiOiBcImRpc3QvcXVpY2tjc3MuZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9xdWlja2Nzcy5qc1wiOiBcInNyYy9pbmRleC5jb2ZmZWVcIlxuICB9LFxuICBcImJyb3dzZXJpZnlcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwic2ltcGx5aW1wb3J0L2NvbXBhdFwiXG4gICAgXVxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrY3NzL2lzc3Vlc1wiXG4gIH0sXG4gIFwiYnVuZGxlRGVwZW5kZW5jaWVzXCI6IGZhbHNlLFxuICBcImRlcHJlY2F0ZWRcIjogZmFsc2UsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJGYXN0ICYgbGlnaHQgd3JhcHBlciBmb3IgZ2V0dGluZy9zZXR0aW5nIENTUyBydWxlc1wiLFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY2hhbGtcIjogXCJeMi4wLjFcIixcbiAgICBcImNvZmZlZS1zY3JpcHRcIjogXCJeMS4xMi42XCIsXG4gICAgXCJleGVjYVwiOiBcIl4wLjcuMFwiLFxuICAgIFwiZnMtamV0cGFja1wiOiBcIl4wLjEzLjNcIixcbiAgICBcInByb21pc2UtYnJlYWtcIjogXCJeMC4xLjFcIixcbiAgICBcInNlbXZlclwiOiBcIl41LjMuMFwiLFxuICAgIFwic2ltcGx5aW1wb3J0XCI6IFwiXjQuMC4wLXMyN1wiLFxuICAgIFwic2ltcGx5d2F0Y2hcIjogXCJeMy4wLjAtbDJcIlxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2NzcyNyZWFkbWVcIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwibWFpblwiOiBcImRpc3QvcXVpY2tjc3MuanNcIixcbiAgXCJuYW1lXCI6IFwicXVpY2tjc3NcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tjc3MuZ2l0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLi8uY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwibnBtIHJ1biB0ZXN0OnRyYXZpc1wiLFxuICAgIFwidGVzdFwiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6YnJvd3NlclwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBFbGVjdHJvbiAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmNocm9tZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgQ2hyb21lIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6ZmlyZWZveFwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBGaXJlZm94IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6a2FybWFcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmxvY2FsXCI6IFwib3BlbiB0ZXN0L3Rlc3RydW5uZXIuaHRtbFwiLFxuICAgIFwidGVzdDptaW5pZmllZFwiOiBcIm1pbmlmaWVkPTEgbnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnRyYXZpc1wiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zICYmIG5wbSBydW4gdGVzdDptaW5pZmllZCAtc1wiLFxuICAgIFwid2F0Y2hcIjogXCJjYWtlIC1kIHdhdGNoXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXN1cGVyXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktcmVuYW1lXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc2ltcGxlXCJcbiAgICBdXG4gIH0sXG4gIFwidmVyc2lvblwiOiBcIjEuMy40XCJcbn1cbiIsImF2YWlsU2V0cyA9IFxuXHRuYXRpdmVzOiBpbXBvcnQgJy4vbmF0aXZlcydcblx0ZG9tOiBpbXBvcnQgJy4vZG9tJ1xuXG5jbGFzcyBDaGVja3Ncblx0Y3JlYXRlOiAoKS0+XG5cdFx0YXJncyA9IEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cykgaWYgYXJndW1lbnRzLmxlbmd0aFxuXHRcdG5ldyBDaGVja3MoYXJncylcblx0XG5cblx0Y29uc3RydWN0b3I6IChzZXRzKS0+XG5cdFx0c2V0cyA/PSBbJ25hdGl2ZXMnXVxuXHRcdFxuXHRcdGZvciBzZXQgaW4gc2V0c1xuXHRcdFx0QGxvYWQoYXZhaWxTZXRzW3NldF0pIGlmIGF2YWlsU2V0c1tzZXRdXG5cblxuXHRsb2FkOiAoc2V0KS0+XG5cdFx0c2V0ID0gYXZhaWxTZXRzW3NldF0gaWYgYXZhaWxTZXRzLm5hdGl2ZXMuc3RyaW5nKHNldClcblx0XHRyZXR1cm4gaWYgbm90IGF2YWlsU2V0cy5uYXRpdmVzLm9iamVjdFBsYWluKHNldClcblx0XHRcblx0XHRmb3Iga2V5LHZhbHVlIG9mIHNldFxuXHRcdFx0QFtrZXldID0gdmFsdWVcblx0XHRcblx0XHRyZXR1cm5cblx0XG5cdFxubW9kdWxlLmV4cG9ydHMgPSBDaGVja3M6OmNyZWF0ZSgpIiwiaXNBcnJheSA9ICh0YXJnZXQpLT5cblx0QXJyYXkuaXNBcnJheSh0YXJnZXQpXG5cbmlzT2JqZWN0ID0gKHRhcmdldCktPlxuXHR0YXJnZXQgYW5kIE9iamVjdDo6dG9TdHJpbmcuY2FsbCh0YXJnZXQpIGlzICdbb2JqZWN0IE9iamVjdF0nIG9yIGlzQXJyYXkodGFyZ2V0KVxuXG5zaG91bGREZWVwRXh0ZW5kID0gKG9wdGlvbnMsIHRhcmdldCwgcGFyZW50S2V5KS0+XG5cdGlmIG9wdGlvbnMuZGVlcFxuXHRcdGlmIG9wdGlvbnMubm90RGVlcCB0aGVuIG5vdCBvcHRpb25zLm5vdERlZXBbdGFyZ2V0XSBlbHNlIHRydWVcblxuXHRlbHNlIGlmIG9wdGlvbnMuZGVlcE9ubHlcblx0XHRvcHRpb25zLmRlZXBPbmx5W3RhcmdldF0gb3IgcGFyZW50S2V5IGFuZCBzaG91bGREZWVwRXh0ZW5kKG9wdGlvbnMsIHBhcmVudEtleSlcblxuXHQjIGVsc2UgZmFsc2VcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZCA9IChvcHRpb25zLCB0YXJnZXQsIHNvdXJjZXMsIHBhcmVudEtleSktPlxuXHR0YXJnZXQgPSB7fSBpZiBub3QgdGFyZ2V0IG9yIHR5cGVvZiB0YXJnZXQgaXNudCAnb2JqZWN0JyBhbmQgdHlwZW9mIHRhcmdldCBpc250ICdmdW5jdGlvbidcblxuXHRmb3Igc291cmNlIGluIHNvdXJjZXMgd2hlbiBzb3VyY2U/XG5cdFx0Zm9yIGtleSBvZiBzb3VyY2Vcblx0XHRcdHNvdXJjZVZhbHVlID0gc291cmNlW2tleV1cblx0XHRcdHRhcmdldFZhbHVlID0gdGFyZ2V0W2tleV1cblx0XHRcdFxuXHRcdFx0Y29udGludWUgaWYgc291cmNlVmFsdWUgaXMgdGFyZ2V0IG9yXG5cdFx0XHRcdFx0XHRzb3VyY2VWYWx1ZSBpcyB1bmRlZmluZWQgb3Jcblx0XHRcdFx0XHRcdChzb3VyY2VWYWx1ZSBpcyBudWxsIGFuZCBub3Qgb3B0aW9ucy5hbGxvd051bGwgYW5kIG5vdCBvcHRpb25zLm51bGxEZWxldGVzKSBvclxuXHRcdFx0XHRcdFx0KG9wdGlvbnMua2V5cyBhbmQgbm90IG9wdGlvbnMua2V5c1trZXldKSBvclxuXHRcdFx0XHRcdFx0KG9wdGlvbnMubm90S2V5cyBhbmQgb3B0aW9ucy5ub3RLZXlzW2tleV0pIG9yXG5cdFx0XHRcdFx0XHQob3B0aW9ucy5vd24gYW5kIG5vdCBzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkgb3Jcblx0XHRcdFx0XHRcdChvcHRpb25zLmdsb2JhbEZpbHRlciBhbmQgbm90IG9wdGlvbnMuZ2xvYmFsRmlsdGVyKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSkpIG9yXG5cdFx0XHRcdFx0XHQob3B0aW9ucy5maWx0ZXJzIGFuZCBvcHRpb25zLmZpbHRlcnNba2V5XSBhbmQgbm90IG9wdGlvbnMuZmlsdGVyc1trZXldKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSkpXG5cdFx0XHRcblx0XHRcdGlmIHNvdXJjZVZhbHVlIGlzIG51bGwgYW5kIG9wdGlvbnMubnVsbERlbGV0ZXNcblx0XHRcdFx0ZGVsZXRlIHRhcmdldFtrZXldXG5cdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRpZiBvcHRpb25zLmdsb2JhbFRyYW5zZm9ybVxuXHRcdFx0XHRzb3VyY2VWYWx1ZSA9IG9wdGlvbnMuZ2xvYmFsVHJhbnNmb3JtKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSlcblx0XHRcdGlmIG9wdGlvbnMudHJhbnNmb3JtcyBhbmQgb3B0aW9ucy50cmFuc2Zvcm1zW2tleV1cblx0XHRcdFx0c291cmNlVmFsdWUgPSBvcHRpb25zLnRyYW5zZm9ybXNba2V5XShzb3VyY2VWYWx1ZSwga2V5LCBzb3VyY2UpXG5cdFxuXHRcdFx0c3dpdGNoXG5cdFx0XHRcdHdoZW4gb3B0aW9ucy5jb25jYXQgYW5kIGlzQXJyYXkoc291cmNlVmFsdWUpIGFuZCBpc0FycmF5KHRhcmdldFZhbHVlKVxuXHRcdFx0XHRcdHRhcmdldFtrZXldID0gdGFyZ2V0VmFsdWUuY29uY2F0KHNvdXJjZVZhbHVlKVxuXHRcdFx0XHRcblx0XHRcdFx0d2hlbiBzaG91bGREZWVwRXh0ZW5kKG9wdGlvbnMsIGtleSwgcGFyZW50S2V5KSBhbmQgaXNPYmplY3Qoc291cmNlVmFsdWUpXG5cdFx0XHRcdFx0c3ViVGFyZ2V0ID0gaWYgaXNPYmplY3QodGFyZ2V0VmFsdWUpIHRoZW4gdGFyZ2V0VmFsdWUgZWxzZSBpZiBpc0FycmF5KHNvdXJjZVZhbHVlKSB0aGVuIFtdIGVsc2Uge31cblx0XHRcdFx0XHR0YXJnZXRba2V5XSA9IGV4dGVuZChvcHRpb25zLCBzdWJUYXJnZXQsIFtzb3VyY2VWYWx1ZV0sIGtleSlcblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGFyZ2V0W2tleV0gPSBzb3VyY2VWYWx1ZVxuXG5cblx0cmV0dXJuIHRhcmdldFxuXG5cblxuXG5cblxuXG4iLCJjb25zdGFudHMgPSBpbXBvcnQgJy4vY29uc3RhbnRzJ1xuaGVscGVycyA9IGltcG9ydCAnLi9oZWxwZXJzJ1xuXG5RdWlja0NTUyA9ICh0YXJnZXRFbCwgcHJvcGVydHksIHZhbHVlKS0+XG5cdGlmIGhlbHBlcnMuaXNJdGVyYWJsZSh0YXJnZXRFbClcblx0XHRRdWlja0NTUyhzdWJFbCwgcHJvcGVydHksIHZhbHVlKSBmb3Igc3ViRWwgaW4gdGFyZ2V0RWxcblx0XG5cdGVsc2UgaWYgdHlwZW9mIHByb3BlcnR5IGlzICdvYmplY3QnICMgUGFzc2VkIGEgc3R5bGUgbWFwXG5cdFx0UXVpY2tDU1ModGFyZ2V0RWwsIHN1YlByb3BlcnR5LCBzdWJWYWx1ZSkgZm9yIHN1YlByb3BlcnR5LHN1YlZhbHVlIG9mIHByb3BlcnR5XG5cdFxuXHRlbHNlXG5cdFx0cHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5KHByb3BlcnR5KVxuXHRcdGlmIHR5cGVvZiB2YWx1ZSBpcyAndW5kZWZpbmVkJ1xuXHRcdFx0Y29tcHV0ZWRTdHlsZSA9IHRhcmdldEVsLl9jb21wdXRlZFN0eWxlIHx8PSBnZXRDb21wdXRlZFN0eWxlKHRhcmdldEVsKVxuXHRcdFx0cmV0dXJuIGNvbXB1dGVkU3R5bGVbcHJvcGVydHldXG5cdFx0XG5cdFx0ZWxzZSBpZiBwcm9wZXJ0eVxuXHRcdFx0dGFyZ2V0RWwuc3R5bGVbcHJvcGVydHldID0gaGVscGVycy5ub3JtYWxpemVWYWx1ZShwcm9wZXJ0eSwgdmFsdWUpXG5cblx0cmV0dXJuXG5cblxuUXVpY2tDU1MuYW5pbWF0aW9uID0gKG5hbWUsIGZyYW1lcyktPiBpZiBuYW1lIGFuZCB0eXBlb2YgbmFtZSBpcyAnc3RyaW5nJyBhbmQgZnJhbWVzIGFuZCB0eXBlb2YgZnJhbWVzIGlzICdvYmplY3QnXG5cdHByZWZpeCA9IGhlbHBlcnMuZ2V0UHJlZml4KCdhbmltYXRpb24nKVxuXHRnZW5lcmF0ZWQgPSAnJ1xuXHRcblx0Zm9yIGZyYW1lLHJ1bGVzIG9mIGZyYW1lc1xuXHRcdGdlbmVyYXRlZCArPSBcIiN7ZnJhbWV9IHsje2hlbHBlcnMucnVsZVRvU3RyaW5nKHJ1bGVzKX19XCJcblxuXHRnZW5lcmF0ZWQgPSBcIkAje3ByZWZpeH1rZXlmcmFtZXMgI3tuYW1lfSB7I3tnZW5lcmF0ZWR9fVwiXG5cdGhlbHBlcnMuaW5saW5lU3R5bGUoZ2VuZXJhdGVkLCB0cnVlLCAwKVxuXG5cblF1aWNrQ1NTLnJlZ2lzdGVyID0gKHJ1bGUsIGxldmVsKS0+IGlmIHJ1bGUgYW5kIHR5cGVvZiBydWxlIGlzICdvYmplY3QnXG5cdGxldmVsIHx8PSAwXG5cdHJ1bGUgPSBoZWxwZXJzLnJ1bGVUb1N0cmluZyhydWxlKVxuXHRcblx0dW5sZXNzIGNsYXNzTmFtZSA9IGhlbHBlcnMuaW5saW5lU3R5bGVDb25maWdbbGV2ZWxdP1tydWxlXVxuXHRcdGNsYXNzTmFtZSA9IGhlbHBlcnMuaGFzaChydWxlKVxuXHRcdHN0eWxlID0gXCIuI3tjbGFzc05hbWV9IHsje3J1bGV9fVwiXG5cdFx0aGVscGVycy5pbmxpbmVTdHlsZShzdHlsZSwgY2xhc3NOYW1lLCBsZXZlbClcblxuXHRyZXR1cm4gY2xhc3NOYW1lXG5cblxuUXVpY2tDU1MuY2xlYXJSZWdpc3RlcmVkID0gKGxldmVsKS0+XG5cdGhlbHBlcnMuY2xlYXJJbmxpbmVTdHlsZShsZXZlbCBvciAwKVxuXG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrQ1NTLlVOU0VUID0gc3dpdGNoXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywndW5zZXQnKSB0aGVuICd1bnNldCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbml0aWFsJykgdGhlbiAnaW5pdGlhbCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbmhlcml0JykgdGhlbiAnaW5oZXJpdCdcblxuUXVpY2tDU1Muc3VwcG9ydHMgPSBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWRcblF1aWNrQ1NTLnN1cHBvcnRzUHJvcGVydHkgPSBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZFxuUXVpY2tDU1Mubm9ybWFsaXplUHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5XG5RdWlja0NTUy5ub3JtYWxpemVWYWx1ZSA9IGhlbHBlcnMubm9ybWFsaXplVmFsdWVcblF1aWNrQ1NTLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrQ1NTIiwie1xuICBcIl9hcmdzXCI6IFtcbiAgICBbXG4gICAgICBcInF1aWNrY3NzQDEuMy4yXCIsXG4gICAgICBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIlxuICAgIF1cbiAgXSxcbiAgXCJfZnJvbVwiOiBcInF1aWNrY3NzQDEuMy4yXCIsXG4gIFwiX2lkXCI6IFwicXVpY2tjc3NAMS4zLjJcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1MakJVQm81cmVxbWNINUZDQzJ0WVFuUVdtMzZ3QjBXWHNCTm1zNWdEOVdOeU43VDRXSDlqbFZHUVAvbm5Fbm1IdDNTRG55cmFzVDNlTWJFVUROdlhRUT09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3F1aWNrY3NzXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJ2ZXJzaW9uXCIsXG4gICAgXCJyZWdpc3RyeVwiOiB0cnVlLFxuICAgIFwicmF3XCI6IFwicXVpY2tjc3NAMS4zLjJcIixcbiAgICBcIm5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICAgIFwicmF3U3BlY1wiOiBcIjEuMy4yXCIsXG4gICAgXCJzYXZlU3BlY1wiOiBudWxsLFxuICAgIFwiZmV0Y2hTcGVjXCI6IFwiMS4zLjJcIlxuICB9LFxuICBcIl9yZXF1aXJlZEJ5XCI6IFtcbiAgICBcIi9cIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3F1aWNrY3NzLy0vcXVpY2tjc3MtMS4zLjIudGd6XCIsXG4gIFwiX3NwZWNcIjogXCIxLjMuMlwiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcImRhbmllbGthbGVuXCJcbiAgfSxcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3F1aWNrY3NzLmRlYnVnLmpzXCIsXG4gICAgXCIuL2Rpc3QvcXVpY2tjc3MuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2Nzcy9pc3N1ZXNcIlxuICB9LFxuICBcImRlc2NyaXB0aW9uXCI6IFwiRmFzdCAmIGxpZ2h0IHdyYXBwZXIgZm9yIGdldHRpbmcvc2V0dGluZyBDU1MgcnVsZXNcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy41LjBcIixcbiAgICBcImNoYWxrXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJjb2ZmZWUtc2NyaXB0XCI6IFwiXjEuMTIuNlwiLFxuICAgIFwiZXhlY2FcIjogXCJeMC43LjBcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4zXCIsXG4gICAgXCJwcm9taXNlLWJyZWFrXCI6IFwiXjAuMS4xXCIsXG4gICAgXCJzZW12ZXJcIjogXCJeNS4zLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuMC1zMjdcIixcbiAgICBcInNpbXBseXdhdGNoXCI6IFwiXjMuMC4wLWwyXCJcbiAgfSxcbiAgXCJkaXJlY3Rvcmllc1wiOiB7XG4gICAgXCJ0ZXN0XCI6IFwidGVzdFwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tjc3MjcmVhZG1lXCIsXG4gIFwibGljZW5zZVwiOiBcIklTQ1wiLFxuICBcIm1haW5cIjogXCJkaXN0L3F1aWNrY3NzLmpzXCIsXG4gIFwibmFtZVwiOiBcInF1aWNrY3NzXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrY3NzLmdpdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcImNha2UgLWQgYnVpbGQgJiYgY2FrZSBidWlsZCAmJiBjYWtlIG1lYXN1cmUgJiYgY3AgLXIgYnVpbGQvKiBkaXN0L1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJjYWtlIGluc3RhbGw6Y292ZXJhZ2U7IG5wbSBydW4gY292ZXJhZ2U6cnVuICYmIG5wbSBydW4gY292ZXJhZ2U6YmFkZ2VcIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnJ1blwiOiBcImNvdmVyYWdlPXRydWUgbnBtIHJ1biB0ZXN0OmVsZWN0cm9uXCIsXG4gICAgXCJjb3ZlcmFnZTpzaG93XCI6IFwib3BlbiBjb3ZlcmFnZS9sY292LXJlcG9ydC9pbmRleC5odG1sXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJwb3N0dmVyc2lvblwiOiBcIm5wbSBydW4gYnVpbGQgJiYgZ2l0IGFkZCAuICYmIGdpdCBjb21taXQgLWEgLW0gJ1tCdWlsZF0nXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcIm5wbSBydW4gdGVzdDp0cmF2aXNcIixcbiAgICBcInRlc3RcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OmJyb3dzZXJcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRWxlY3Ryb24gLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpjaHJvbWVcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIENocm9tZSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmZpcmVmb3hcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRmlyZWZveCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpsb2NhbFwiOiBcIm9wZW4gdGVzdC90ZXN0cnVubmVyLmh0bWxcIixcbiAgICBcInRlc3Q6bWluaWZpZWRcIjogXCJtaW5pZmllZD0xIG5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6c2FmYXJpXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBTYWZhcmkgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYXVjZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIHNhdWNlPTEga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDp0cmF2aXNcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcIndhdGNoXCI6IFwiY2FrZSAtZCB3YXRjaFwiXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjMuMlwiXG59XG4iLCIhKGZ1bmN0aW9uKHdpbikge1xuXG4vKipcbiAqIEZhc3REb21cbiAqXG4gKiBFbGltaW5hdGVzIGxheW91dCB0aHJhc2hpbmdcbiAqIGJ5IGJhdGNoaW5nIERPTSByZWFkL3dyaXRlXG4gKiBpbnRlcmFjdGlvbnMuXG4gKlxuICogQGF1dGhvciBXaWxzb24gUGFnZSA8d2lsc29ucGFnZUBtZS5jb20+XG4gKiBAYXV0aG9yIEtvcm5lbCBMZXNpbnNraSA8a29ybmVsLmxlc2luc2tpQGZ0LmNvbT5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWluaSBsb2dnZXJcbiAqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xudmFyIGRlYnVnID0gMCA/IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSwgJ1tmYXN0ZG9tXScpIDogZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBOb3JtYWxpemVkIHJBRlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xudmFyIHJhZiA9IHdpbi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi5tc1JlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCBmdW5jdGlvbihjYikgeyByZXR1cm4gc2V0VGltZW91dChjYiwgMTYpOyB9O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBgRmFzdERvbWAuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEZhc3REb20oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5yZWFkcyA9IFtdO1xuICBzZWxmLndyaXRlcyA9IFtdO1xuICBzZWxmLnJhZiA9IHJhZi5iaW5kKHdpbik7IC8vIHRlc3QgaG9va1xuICBkZWJ1ZygnaW5pdGlhbGl6ZWQnLCBzZWxmKTtcbn1cblxuRmFzdERvbS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBGYXN0RG9tLFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgam9iIHRvIHRoZSByZWFkIGJhdGNoIGFuZFxuICAgKiBzY2hlZHVsZXMgYSBuZXcgZnJhbWUgaWYgbmVlZCBiZS5cbiAgICpcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIG1lYXN1cmU6IGZ1bmN0aW9uKGZuLCBjdHgpIHtcbiAgICBkZWJ1ZygnbWVhc3VyZScpO1xuICAgIHZhciB0YXNrID0gIWN0eCA/IGZuIDogZm4uYmluZChjdHgpO1xuICAgIHRoaXMucmVhZHMucHVzaCh0YXNrKTtcbiAgICBzY2hlZHVsZUZsdXNoKHRoaXMpO1xuICAgIHJldHVybiB0YXNrO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgam9iIHRvIHRoZVxuICAgKiB3cml0ZSBiYXRjaCBhbmQgc2NoZWR1bGVzXG4gICAqIGEgbmV3IGZyYW1lIGlmIG5lZWQgYmUuXG4gICAqXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICAgKiBAcHVibGljXG4gICAqL1xuICBtdXRhdGU6IGZ1bmN0aW9uKGZuLCBjdHgpIHtcbiAgICBkZWJ1ZygnbXV0YXRlJyk7XG4gICAgdmFyIHRhc2sgPSAhY3R4ID8gZm4gOiBmbi5iaW5kKGN0eCk7XG4gICAgdGhpcy53cml0ZXMucHVzaCh0YXNrKTtcbiAgICBzY2hlZHVsZUZsdXNoKHRoaXMpO1xuICAgIHJldHVybiB0YXNrO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYSBzY2hlZHVsZWQgJ3JlYWQnIG9yICd3cml0ZScgdGFzay5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHRhc2tcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2Vzc1xuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcjogZnVuY3Rpb24odGFzaykge1xuICAgIGRlYnVnKCdjbGVhcicsIHRhc2spO1xuICAgIHJldHVybiByZW1vdmUodGhpcy5yZWFkcywgdGFzaykgfHwgcmVtb3ZlKHRoaXMud3JpdGVzLCB0YXNrKTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIHRoaXMgRmFzdERvbSB3aXRoIHNvbWVcbiAgICogY3VzdG9tIGZ1bmN0aW9uYWxpdHkuXG4gICAqXG4gICAqIEJlY2F1c2UgZmFzdGRvbSBtdXN0ICphbHdheXMqIGJlIGFcbiAgICogc2luZ2xldG9uLCB3ZSdyZSBhY3R1YWxseSBleHRlbmRpbmdcbiAgICogdGhlIGZhc3Rkb20gaW5zdGFuY2UuIFRoaXMgbWVhbnMgdGFza3NcbiAgICogc2NoZWR1bGVkIGJ5IGFuIGV4dGVuc2lvbiBzdGlsbCBlbnRlclxuICAgKiBmYXN0ZG9tJ3MgZ2xvYmFsIHRhc2sgcXVldWUuXG4gICAqXG4gICAqIFRoZSAnc3VwZXInIGluc3RhbmNlIGNhbiBiZSBhY2Nlc3NlZFxuICAgKiBmcm9tIGB0aGlzLmZhc3Rkb21gLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgbXlGYXN0ZG9tID0gZmFzdGRvbS5leHRlbmQoe1xuICAgKiAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgKiAgICAgLy8gcnVucyBvbiBjcmVhdGlvblxuICAgKiAgIH0sXG4gICAqXG4gICAqICAgLy8gb3ZlcnJpZGUgYSBtZXRob2RcbiAgICogICBtZWFzdXJlOiBmdW5jdGlvbihmbikge1xuICAgKiAgICAgLy8gZG8gZXh0cmEgc3R1ZmYgLi4uXG4gICAqXG4gICAqICAgICAvLyB0aGVuIGNhbGwgdGhlIG9yaWdpbmFsXG4gICAqICAgICByZXR1cm4gdGhpcy5mYXN0ZG9tLm1lYXN1cmUoZm4pO1xuICAgKiAgIH0sXG4gICAqXG4gICAqICAgLi4uXG4gICAqIH0pO1xuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHByb3BzICBwcm9wZXJ0aWVzIHRvIG1peGluXG4gICAqIEByZXR1cm4ge0Zhc3REb219XG4gICAqL1xuICBleHRlbmQ6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgZGVidWcoJ2V4dGVuZCcsIHByb3BzKTtcbiAgICBpZiAodHlwZW9mIHByb3BzICE9ICdvYmplY3QnKSB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIG9iamVjdCcpO1xuXG4gICAgdmFyIGNoaWxkID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICBtaXhpbihjaGlsZCwgcHJvcHMpO1xuICAgIGNoaWxkLmZhc3Rkb20gPSB0aGlzO1xuXG4gICAgLy8gcnVuIG9wdGlvbmFsIGNyZWF0aW9uIGhvb2tcbiAgICBpZiAoY2hpbGQuaW5pdGlhbGl6ZSkgY2hpbGQuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIGNoaWxkO1xuICB9LFxuXG4gIC8vIG92ZXJyaWRlIHRoaXMgd2l0aCBhIGZ1bmN0aW9uXG4gIC8vIHRvIHByZXZlbnQgRXJyb3JzIGluIGNvbnNvbGVcbiAgLy8gd2hlbiB0YXNrcyB0aHJvd1xuICBjYXRjaDogbnVsbFxufTtcblxuLyoqXG4gKiBTY2hlZHVsZXMgYSBuZXcgcmVhZC93cml0ZVxuICogYmF0Y2ggaWYgb25lIGlzbid0IHBlbmRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gc2NoZWR1bGVGbHVzaChmYXN0ZG9tKSB7XG4gIGlmICghZmFzdGRvbS5zY2hlZHVsZWQpIHtcbiAgICBmYXN0ZG9tLnNjaGVkdWxlZCA9IHRydWU7XG4gICAgZmFzdGRvbS5yYWYoZmx1c2guYmluZChudWxsLCBmYXN0ZG9tKSk7XG4gICAgZGVidWcoJ2ZsdXNoIHNjaGVkdWxlZCcpO1xuICB9XG59XG5cbi8qKlxuICogUnVucyBxdWV1ZWQgYHJlYWRgIGFuZCBgd3JpdGVgIHRhc2tzLlxuICpcbiAqIEVycm9ycyBhcmUgY2F1Z2h0IGFuZCB0aHJvd24gYnkgZGVmYXVsdC5cbiAqIElmIGEgYC5jYXRjaGAgZnVuY3Rpb24gaGFzIGJlZW4gZGVmaW5lZFxuICogaXQgaXMgY2FsbGVkIGluc3RlYWQuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZmx1c2goZmFzdGRvbSkge1xuICBkZWJ1ZygnZmx1c2gnKTtcblxuICB2YXIgd3JpdGVzID0gZmFzdGRvbS53cml0ZXM7XG4gIHZhciByZWFkcyA9IGZhc3Rkb20ucmVhZHM7XG4gIHZhciBlcnJvcjtcblxuICB0cnkge1xuICAgIGRlYnVnKCdmbHVzaGluZyByZWFkcycsIHJlYWRzLmxlbmd0aCk7XG4gICAgcnVuVGFza3MocmVhZHMpO1xuICAgIGRlYnVnKCdmbHVzaGluZyB3cml0ZXMnLCB3cml0ZXMubGVuZ3RoKTtcbiAgICBydW5UYXNrcyh3cml0ZXMpO1xuICB9IGNhdGNoIChlKSB7IGVycm9yID0gZTsgfVxuXG4gIGZhc3Rkb20uc2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgLy8gSWYgdGhlIGJhdGNoIGVycm9yZWQgd2UgbWF5IHN0aWxsIGhhdmUgdGFza3MgcXVldWVkXG4gIGlmIChyZWFkcy5sZW5ndGggfHwgd3JpdGVzLmxlbmd0aCkgc2NoZWR1bGVGbHVzaChmYXN0ZG9tKTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICBkZWJ1ZygndGFzayBlcnJvcmVkJywgZXJyb3IubWVzc2FnZSk7XG4gICAgaWYgKGZhc3Rkb20uY2F0Y2gpIGZhc3Rkb20uY2F0Y2goZXJyb3IpO1xuICAgIGVsc2UgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBydW4gdGhpcyBpbnNpZGUgYSB0cnkgY2F0Y2hcbiAqIHNvIHRoYXQgaWYgYW55IGpvYnMgZXJyb3IsIHdlXG4gKiBhcmUgYWJsZSB0byByZWNvdmVyIGFuZCBjb250aW51ZVxuICogdG8gZmx1c2ggdGhlIGJhdGNoIHVudGlsIGl0J3MgZW1wdHkuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcnVuVGFza3ModGFza3MpIHtcbiAgZGVidWcoJ3J1biB0YXNrcycpO1xuICB2YXIgdGFzazsgd2hpbGUgKHRhc2sgPSB0YXNrcy5zaGlmdCgpKSB0YXNrKCk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhbiBBcnJheS5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyYXlcbiAqIEBwYXJhbSAgeyp9IGl0ZW1cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZShhcnJheSwgaXRlbSkge1xuICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuICByZXR1cm4gISF+aW5kZXggJiYgISFhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG4vKipcbiAqIE1peGluIG93biBwcm9wZXJ0aWVzIG9mIHNvdXJjZVxuICogb2JqZWN0IGludG8gdGhlIHRhcmdldC5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRhcmdldFxuICogQHBhcmFtICB7T2JqZWN0fSBzb3VyY2VcbiAqL1xuZnVuY3Rpb24gbWl4aW4odGFyZ2V0LCBzb3VyY2UpIHtcbiAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxufVxuXG4vLyBUaGVyZSBzaG91bGQgbmV2ZXIgYmUgbW9yZSB0aGFuXG4vLyBvbmUgaW5zdGFuY2Ugb2YgYEZhc3REb21gIGluIGFuIGFwcFxudmFyIGV4cG9ydHMgPSB3aW4uZmFzdGRvbSA9ICh3aW4uZmFzdGRvbSB8fCBuZXcgRmFzdERvbSgpKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbi8vIEV4cG9zZSB0byBDSlMgJiBBTURcbmlmICgodHlwZW9mIGRlZmluZSkgPT0gJ2Z1bmN0aW9uJykgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gZXhwb3J0czsgfSk7XG5lbHNlIGlmICgodHlwZW9mIG1vZHVsZSkgPT0gJ29iamVjdCcpIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcblxufSkoIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdGhpcyk7XG4iLCJJUyA9IGltcG9ydCAnLi4vY2hlY2tzJ1xuU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5cblxuY2xhc3MgQ29uZGl0aW9uXG5cdGNvbnN0cnVjdG9yOiAoQGZpZWxkLCBAc2V0dGluZ3MsIEBjYWxsYmFjayktPlxuXHRcdEBzYXRpc2ZpZWQgPSBmYWxzZVxuXHRcdEB2YWx1ZSA9IEBzZXR0aW5ncy52YWx1ZVxuXHRcdEBwcm9wZXJ0eSA9IEBzZXR0aW5ncy5wcm9wZXJ0eSBvciAnX3ZhbHVlJ1xuXHRcdEBwcm9wZXJ0eSA9ICdfdmFsdWUnIGlmIEBzZXR0aW5ncy5wcm9wZXJ0eSBpcyAndmFsdWUnXG5cdFx0dGFyZ2V0ID0gQGZpZWxkLmFsbEZpZWxkc1tAc2V0dGluZ3MudGFyZ2V0XSBvciBAc2V0dGluZ3MudGFyZ2V0XHRcblx0XHRcblx0XHRpZiBJUy5maWVsZCh0YXJnZXQpXG5cdFx0XHRAdGFyZ2V0ID0gdGFyZ2V0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGNvbnNvbGUud2FybihcImNvbmRpdGlvbiB0YXJnZXQgbm90IGZvdW5kIGZvciB0aGUgcHJvdmlkZWQgSUQgJyN7QHNldHRpbmdzLnRhcmdldH0nXCIsIEBmaWVsZClcblxuXHRcdHByb3BlcnR5ID0gaWYgSVMuYXJyYXkoQHRhcmdldFtAcHJvcGVydHldKSB0aGVuIFwiYXJyYXk6I3tAcHJvcGVydHl9XCIgZWxzZSBAcHJvcGVydHlcblxuXHRcdFNpbXBseUJpbmQocHJvcGVydHksIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHRhcmdldClcblx0XHRcdC5hbmQoJ3Zpc2libGUnKS5vZihAdGFyZ2V0LnN0YXRlKVxuXHRcdFx0XHQudG8oQGNhbGxiYWNrKVxuXG5cdFx0U2ltcGx5QmluZCgnc2F0aXNmaWVkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0LnRvIChuZXdWYWx1ZSwgb2xkVmFsdWUpPT4gQGZpZWxkLmVtaXQ/KCdjb25kaXRpb25DaGFuZ2UnLCBAKSBpZiBvbGRWYWx1ZT9cblxuXG5cdHRlc3Q6ICgpLT5cblx0XHRpZiBub3QgQHRhcmdldD8uc3RhdGUudmlzaWJsZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRjb21wYXJpc29uID0gc3dpdGNoXG5cdFx0XHR3aGVuIElTLm9iamVjdFBsYWluKEB2YWx1ZSkgdGhlbiBAdmFsdWVcblx0XHRcdHdoZW4gSVMucmVnZXgoQHZhbHVlKSB0aGVuICckcmVnZXgnOkB2YWx1ZVxuXHRcdFx0d2hlbiBAdmFsdWUgaXMgJ3ZhbGlkJyBhbmQgbm90IEBzZXR0aW5ncy5wcm9wZXJ0eSBvciBub3QgSVMuZGVmaW5lZChAdmFsdWUpIHRoZW4gJ3ZhbGlkJ1xuXHRcdFx0ZWxzZSAnJGVxJzpAdmFsdWVcblxuXHRcdGlmIGNvbXBhcmlzb24gaXMgJ3ZhbGlkJ1xuXHRcdFx0cmV0dXJuIEB0YXJnZXQudmFsaWRhdGUoKVxuXHRcdFxuXHRcdHRhcmdldFZhbHVlID0gZG8gKCk9PlxuXHRcdFx0cmV0dXJuIEB0YXJnZXQudmFsdWUgaWYgQHByb3BlcnR5IGlzICdfdmFsdWUnXG5cdFx0XHRwcm9wZXJ0eUNoYWluID0gQHByb3BlcnR5LnNwbGl0KCcuJylcblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIHByb3BlcnR5Q2hhaW4ubGVuZ3RoIGlzIDFcblx0XHRcdFx0XHRAdGFyZ2V0W0Bwcm9wZXJ0eV1cblxuXHRcdFx0XHR3aGVuIElTLmRlZmluZWQoQHRhcmdldFtAcHJvcGVydHldKVxuXHRcdFx0XHRcdEB0YXJnZXRbQHByb3BlcnR5XVxuXHRcdFx0XHRcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG5lc3RlZE9iamVjdCA9IEB0YXJnZXRcblx0XHRcdFx0XHR3aGlsZSBJUy5vYmplY3QobmVzdGVkT2JqZWN0KVxuXHRcdFx0XHRcdFx0bmVzdGVkT2JqZWN0ID0gbmVzdGVkT2JqZWN0W3Byb3BlcnR5Q2hhaW4ucG9wKCldXG5cblx0XHRcdFx0XHRyZXR1cm4gbmVzdGVkT2JqZWN0XG5cblx0XHRjb21wYXJpc29uT3BlcmF0b3JzID0gT2JqZWN0LmtleXMoY29tcGFyaXNvbilcblx0XHRwYXNzZWRDb21wYXJpc29ucyA9IGNvbXBhcmlzb25PcGVyYXRvcnMuZmlsdGVyIChvcGVyYXRvciktPlxuXHRcdFx0c2Vla2VkVmFsdWUgPSBjb21wYXJpc29uW29wZXJhdG9yXVxuXHRcdFx0c3dpdGNoIG9wZXJhdG9yXG5cdFx0XHRcdHdoZW4gJyRlcSdcdFx0dGhlbiB0YXJnZXRWYWx1ZSBpcyBzZWVrZWRWYWx1ZSBcblx0XHRcdFx0d2hlbiAnJG5lJ1x0XHR0aGVuIHRhcmdldFZhbHVlIGlzbnQgc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGd0J1x0XHR0aGVuIHRhcmdldFZhbHVlID4gc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGd0ZSdcdFx0dGhlbiB0YXJnZXRWYWx1ZSA+PSBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckbHQnXHRcdHRoZW4gdGFyZ2V0VmFsdWUgPCBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckbHRlJ1x0XHR0aGVuIHRhcmdldFZhbHVlIDw9IHNlZWtlZFZhbHVlXG5cdFx0XHRcdHdoZW4gJyRjdCdcdFx0dGhlbiBoZWxwZXJzLmluY2x1ZGVzKHRhcmdldFZhbHVlLCBzZWVrZWRWYWx1ZSlcblx0XHRcdFx0d2hlbiAnJG5jdCdcdFx0dGhlbiBub3QgaGVscGVycy5pbmNsdWRlcyh0YXJnZXRWYWx1ZSwgc2Vla2VkVmFsdWUpXG5cdFx0XHRcdHdoZW4gJyRyZWdleCdcdHRoZW4gc2Vla2VkVmFsdWUudGVzdCh0YXJnZXRWYWx1ZSlcblx0XHRcdFx0d2hlbiAnJG5yZWdleCdcdHRoZW4gbm90IHNlZWtlZFZhbHVlLnRlc3QodGFyZ2V0VmFsdWUpXG5cdFx0XHRcdHdoZW4gJyRtYXNrJ1x0dGhlbiBoZWxwZXJzLnRlc3RNYXNrKHRhcmdldFZhbHVlLCBzZWVrZWRWYWx1ZSlcblx0XHRcdFx0ZWxzZSBmYWxzZVxuXG5cdFx0cmV0dXJuIHBhc3NlZENvbXBhcmlzb25zLmxlbmd0aCBpcyBjb21wYXJpc29uT3BlcmF0b3JzLmxlbmd0aFxuXG5cblx0QHZhbGlkYXRlOiAoY29uZGl0aW9ucyktPiBpZiBjb25kaXRpb25zXG5cdFx0dmFsaWRDb25kaXRpb25zID0gY29uZGl0aW9ucy5maWx0ZXIgKGNvbmRpdGlvbiktPlxuXHRcdFx0Y29uZGl0aW9uLnNhdGlzZmllZCA9IGNvbmRpdGlvbi50ZXN0KClcblx0XHRcblx0XHRyZXR1cm4gdmFsaWRDb25kaXRpb25zLmxlbmd0aCBpcyBjb25kaXRpb25zLmxlbmd0aFxuXG5cblx0QGluaXQ6IChmaWVsZCwgY29uZGl0aW9ucywgY2FsbGJhY2spLT4gc2V0VGltZW91dCAoKT0+XG5cdFx0Y2FsbGJhY2sgPz0gKCk9PiBmaWVsZC52YWxpZGF0ZUNvbmRpdGlvbnMoKVxuXHRcdFxuXHRcdGZpZWxkLmNvbmRpdGlvbnMgPSBjb25kaXRpb25zLm1hcCAoY29uZGl0aW9uKS0+XG5cdFx0XHRuZXcgQ29uZGl0aW9uKGZpZWxkLCBjb25kaXRpb24sIGNhbGxiYWNrKVxuXG5cdFx0Y2FsbGJhY2soKVxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmRpdGlvbiIsIm1vZHVsZS5leHBvcnRzID1cblx0Zm9udEZhbWlseTogJ3N5c3RlbS11aSwgc2Fucy1zZXJpZidcblx0dGVtcGxhdGVzOiB7fVxuXHRldmVudHM6IG51bGxcblx0bGFiZWw6IGZhbHNlXG5cdGVycm9yOiAnJ1xuXHRoZWxwOiAnJ1xuXHRyZXF1aXJlZDogZmFsc2Vcblx0ZGlzYWJsZWQ6IGZhbHNlXG5cdGRlZmF1bHRWYWx1ZTogbnVsbFxuXHR3aWR0aDogJzEwMCUnXG5cdG1vYmlsZVdpZHRoOiBudWxsXG5cdG1vYmlsZVRocmVzaG9sZDogNzM2XG5cdGJvcmRlcjogMVxuXHRtYXJnaW46IG51bGxcblx0cGFkZGluZzogbnVsbFxuXHRkaXN0YW5jZTogbnVsbFxuXHRpbnB1dFBhZGRpbmc6IDEyXG5cdGZvbnRTaXplOiAxNFxuXHRsYWJlbFNpemU6IG51bGxcblx0aWNvbjogbnVsbFxuXHRpY29uU2l6ZTogMjJcblx0Z2V0dGVyOiBudWxsXG5cdHNldHRlcjogbnVsbFxuXHR2YWxpZGF0b3I6IG51bGxcblx0Y2xlYXJFcnJvck9uVmFsaWQ6IHRydWVcblx0bWFrZVJvb21Gb3JIZWxwOiB0cnVlIiwiSVMgPSBpbXBvcnQgJy4uLy4uL2NoZWNrcydcblNpbXBseUJpbmQgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kJ1xuS0VZQ09ERVMgPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9rZXlDb2RlcydcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5Db25kaXRpb24gPSBpbXBvcnQgJy4uL2NvbmRpdGlvbidcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbmdsb2JhbERlZmF1bHRzID0gaW1wb3J0ICcuLi8uLi9maWVsZC9nbG9iYWxEZWZhdWx0cydcbmltcG9ydCAqIGFzIHRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUnXG5pbXBvcnQgKiBhcyBkZWZhdWx0cyBmcm9tICcuL2RlZmF1bHRzJ1xuXG5jbGFzcyBEcm9wZG93blxuXHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0ZGVmYXVsdHM6IGRlZmF1bHRzXG5cdF9zZXR0aW5nRmlsdGVyczogbWF4SGVpZ2h0OiAodmFsdWUpLT4gSVMubnVtYmVyKHZhbHVlKVxuXHRcblx0Y29uc3RydWN0b3I6IChAaW5pdGlhbENob2ljZXMsIEBmaWVsZCktPlxuXHRcdEBpc09wZW4gPSBmYWxzZVxuXHRcdEB0eXBlQnVmZmVyID0gJydcblx0XHRAc2V0dGluZ3MgPSBleHRlbmQuZGVlcC5jbG9uZS5maWx0ZXIoQF9zZXR0aW5nRmlsdGVycykoZ2xvYmFsRGVmYXVsdHMsIEBkZWZhdWx0cywgQGZpZWxkLnNldHRpbmdzLmRyb3Bkb3duKVxuXHRcdEBzZWxlY3RlZCA9IGlmIEBzZXR0aW5ncy5tdWx0aXBsZSB0aGVuIFtdIGVsc2UgbnVsbFxuXHRcdEBsYXN0U2VsZWN0ZWQgPSBudWxsXG5cdFx0QGNob2ljZXMgPSBbXVxuXHRcdEBjdXJyZW50SGlnaGxpZ2h0ZWQgPSBudWxsXG5cdFx0QHZpc2libGVDaG9pY2VzQ291bnQgPSAwXG5cdFx0QHZpc2libGVDaG9pY2VzID0gW11cblx0XHRAZWxzID0ge31cblx0XHRAX3NlbGVjdGVkQ2FsbGJhY2sgPSBoZWxwZXJzLm5vb3Bcblx0XHRcblx0XHRAX2NyZWF0ZUVsZW1lbnRzKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzKClcblx0XHRyZXR1cm4gQFxuXG5cblx0X2NyZWF0ZUVsZW1lbnRzOiAoKS0+XG5cdFx0Z2xvYmFsT3B0cyA9IHtyZWxhdGVkSW5zdGFuY2U6QH1cblx0XHRAZWxzLmNvbnRhaW5lciA9IEB0ZW1wbGF0ZS5kZWZhdWx0LnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuZGVmYXVsdCwgZXh0ZW5kKHtwYXNzU3RhdGVUb0NoaWxkcmVuOmZhbHNlfSwgZ2xvYmFsT3B0cykpXG5cdFx0QGVscy5saXN0ID0gQHRlbXBsYXRlLmxpc3Quc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5saXN0LCBnbG9iYWxPcHRzKS5hcHBlbmRUbyhAZWxzLmNvbnRhaW5lcilcblx0XHRAZWxzLmhlbHAgPSBAdGVtcGxhdGUuaGVscC5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmhlbHAsIGdsb2JhbE9wdHMpLmFwcGVuZFRvKEBlbHMuY29udGFpbmVyKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAgPSBAdGVtcGxhdGUuc2Nyb2xsSW5kaWNhdG9yVXAuc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5zY3JvbGxJbmRpY2F0b3JVcCwgZ2xvYmFsT3B0cykuYXBwZW5kVG8oQGVscy5jb250YWluZXIpXG5cdFx0QGVscy5zY3JvbGxJbmRpY2F0b3JEb3duID0gQHRlbXBsYXRlLnNjcm9sbEluZGljYXRvckRvd24uc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5zY3JvbGxJbmRpY2F0b3JEb3duLCBnbG9iYWxPcHRzKS5hcHBlbmRUbyhAZWxzLmNvbnRhaW5lcilcblxuXHRcdEBsaXN0ID0gbmV3IExpc3QoQClcblx0XHRAYWRkQ2hvaWNlKGNob2ljZSkgZm9yIGNob2ljZSBpbiBAaW5pdGlhbENob2ljZXNcblx0XHRyZXR1cm5cblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzOiAoKS0+XG5cdFx0QF9hdHRhY2hCaW5kaW5nc19lbFN0YXRlKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXkoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3Nfc2Nyb2xsSW5kaWNhdG9ycygpXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfZWxTdGF0ZTogKCktPlxuXHRcdFNpbXBseUJpbmQoJ2hlbHAnKS5vZihAc2V0dGluZ3MpXG5cdFx0XHQudG8oJ3RleHQnKS5vZihAZWxzLmhlbHApXG5cdFx0XHQuYW5kLnRvIChzaG93SGVscCk9PiBAZWxzLmhlbHAuc3RhdGUgJ3Nob3dIZWxwJywgc2hvd0hlbHBcblxuXHRcdFNpbXBseUJpbmQoJ3Zpc2libGVDaG9pY2VzQ291bnQnKS5vZihAKVxuXHRcdFx0LnRvIChjb3VudCk9PiBAZWxzLmNvbnRhaW5lci5zdGF0ZSAnaGFzVmlzaWJsZUNob2ljZXMnLCAhIWNvdW50XG5cdFxuXHRcdFNpbXBseUJpbmQoJ2N1cnJlbnRIaWdobGlnaHRlZCcpLm9mKEApXG5cdFx0XHQudG8gKGN1cnJlbnQsIHByZXYpPT5cblx0XHRcdFx0cHJldi5lbC5zdGF0ZSgnaG92ZXInLCBvZmYpIGlmIHByZXZcblx0XHRcdFx0Y3VycmVudC5lbC5zdGF0ZSgnaG92ZXInLCBvbikgaWYgY3VycmVudFxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXk6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdpc09wZW4nLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEApLnRvIChpc09wZW4pPT5cblx0XHRcdEBlbHMuY29udGFpbmVyLnN0YXRlICdpc09wZW4nLCBpc09wZW5cdFx0XG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gbnVsbCBpZiBub3QgaXNPcGVuXG5cdFxuXHRcdFx0aWYgQHNldHRpbmdzLmxvY2tTY3JvbGxcblx0XHRcdFx0aWYgaXNPcGVuXG5cdFx0XHRcdFx0aGVscGVycy5sb2NrU2Nyb2xsKEBlbHMubGlzdClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGhlbHBlcnMudW5sb2NrU2Nyb2xsKClcblxuXHRcdFx0aWYgaXNPcGVuXG5cdFx0XHRcdEBsaXN0LmNhbGNEaXNwbGF5KClcblx0XHRcdFx0QGxpc3Quc2Nyb2xsVG9DaG9pY2UoQHNlbGVjdGVkKSBpZiBAc2VsZWN0ZWQgYW5kIG5vdCBAc2V0dGluZ3MubXVsdGlwbGVcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGxpc3Quc2V0VHJhbnNsYXRlKDApXG5cblxuXHRcdFNpbXBseUJpbmQoJ2xhc3RTZWxlY3RlZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSwgdXBkYXRlRXZlbklmU2FtZTp0cnVlKS5vZihAKVxuXHRcdFx0LnRvIChuZXdDaG9pY2UsIHByZXZDaG9pY2UpPT4gQF9zZWxlY3RlZENhbGxiYWNrKG5ld0Nob2ljZSwgcHJldkNob2ljZSlcblxuXG5cdFx0U2ltcGx5QmluZCgnZm9jdXNlZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQGZpZWxkLnN0YXRlKS50byAoZm9jdXNlZCk9PlxuXHRcdFx0aWYgbm90IGZvY3VzZWRcblx0XHRcdFx0QGZpZWxkLmVsLmNoaWxkLmlucHV0Lm9mZiAna2V5ZG93bi5kcm9wZG93bk5hdidcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGZpZWxkLmVsLmNoaWxkLmlucHV0Lm9uICdrZXlkb3duLmRyb3Bkb3duTmF2JywgKGV2ZW50KT0+IGlmIEBpc09wZW4gdGhlbiBzd2l0Y2ggZXZlbnQua2V5Q29kZVxuXHRcdFx0XHRcdHdoZW4gS0VZQ09ERVMudXBcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdEBoaWdobGlnaHRQcmV2KClcblxuXHRcdFx0XHRcdHdoZW4gS0VZQ09ERVMuZG93blxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0QGhpZ2hsaWdodE5leHQoKVxuXG5cdFx0XHRcdFx0d2hlbiBLRVlDT0RFUy5lbnRlclxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0QGxhc3RTZWxlY3RlZCA9IEBjdXJyZW50SGlnaGxpZ2h0ZWQgaWYgQGN1cnJlbnRIaWdobGlnaHRlZFxuXG5cdFx0XHRcdFx0d2hlbiBLRVlDT0RFUy5lc2Ncblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdEBpc09wZW4gPSBmYWxzZVxuXG5cdFx0XG5cdFx0cmV0dXJuIGlmIG5vdCBAc2V0dGluZ3MudHlwZUJ1ZmZlclxuXHRcdFNpbXBseUJpbmQoJ2ZvY3VzZWQnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEBmaWVsZC5zdGF0ZSkudG8gKGZvY3VzZWQpPT5cblx0XHRcdGlmIG5vdCBmb2N1c2VkXG5cdFx0XHRcdERPTShkb2N1bWVudCkub2ZmICdrZXlwcmVzcy5kcm9wZG93blR5cGVCdWZmZXInXG5cdFx0XHRlbHNlXG5cdFx0XHRcdERPTShkb2N1bWVudCkub24gJ2tleXByZXNzLmRyb3Bkb3duVHlwZUJ1ZmZlcicsIChldmVudCk9PiBpZiBAaXNPcGVuXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdHJldHVybiBpZiBub3QgS0VZQ09ERVMuYW55UHJpbnRhYmxlKGV2ZW50LmtleUNvZGUpXG5cdFx0XHRcdFx0QHR5cGVCdWZmZXIgKz0gZXZlbnQua2V5XG5cblxuXHRcdFNpbXBseUJpbmQoJ3R5cGVCdWZmZXInLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEApXG5cdFx0XHQudG8gKCk9PlxuXHRcdFx0XHRjbGVhclRpbWVvdXQoQHR5cGVCdWZmZXJUaW1lb3V0KVxuXHRcdFx0XHRAdHlwZUJ1ZmZlclRpbWVvdXQgPSBzZXRUaW1lb3V0ICgpPT5cblx0XHRcdFx0XHRAdHlwZUJ1ZmZlciA9ICcnXG5cdFx0XHRcdCwxNTAwXG5cdFx0XHRcblx0XHRcdC5hbmQudG8gKGJ1ZmZlcik9PiBpZiBidWZmZXJcblx0XHRcdFx0Zm9yIGNob2ljZSBpbiBAdmlzaWJsZUNob2ljZXNcblx0XHRcdFx0XHRpZiBoZWxwZXJzLnN0YXJ0c1dpdGgoYnVmZmVyLCBjaG9pY2UubGFiZWwpXG5cdFx0XHRcdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlXG5cdFx0XHRcdFx0XHRAbGlzdC5zY3JvbGxUb0Nob2ljZShjaG9pY2UpIHVubGVzcyBAbGlzdC5jaG9pY2VJblZpZXcoY2hvaWNlKVxuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX3Njcm9sbEluZGljYXRvcnM6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdzY3JvbGxUb3AnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUpLm9mKEBlbHMubGlzdC5yYXcpXG5cdFx0XHQudG8gKHNjcm9sbFRvcCk9PlxuXHRcdFx0XHRzaG93VG9wSW5kaWNhdG9yID0gc2Nyb2xsVG9wID4gMFxuXHRcdFx0XHRzaG93Qm90dG9tSW5kaWNhdG9yID0gQGVscy5saXN0LnJhdy5zY3JvbGxIZWlnaHQgLSBAZWxzLmxpc3QucmF3LmNsaWVudEhlaWdodCA+IHNjcm9sbFRvcFxuXG5cdFx0XHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAuc3RhdGUgJ3Zpc2libGUnLCBzaG93VG9wSW5kaWNhdG9yXG5cdFx0XHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5zdGF0ZSAndmlzaWJsZScsIHNob3dCb3R0b21JbmRpY2F0b3JcblxuXHRcdFx0LmNvbmRpdGlvbiAoKT0+IEBpc09wZW4gYW5kIG5vdCBAc2V0dGluZ3MuaGVscCBhbmQgQGVscy5saXN0LnJhdy5zY3JvbGxIZWlnaHQgaXNudCBAZWxzLmxpc3QucmF3LmNsaWVudEhlaWdodCBhbmQgQGVscy5saXN0LnJhdy5jbGllbnRIZWlnaHQgPj0gMTAwXG5cdFx0XHQudXBkYXRlT24oJ2V2ZW50OnNjcm9sbCcpLm9mKEBlbHMubGlzdC5yYXcpXG5cdFx0XHQudXBkYXRlT24oJ2lzT3BlbicpLm9mKEApXG5cblx0XHRAZWxzLnNjcm9sbEluZGljYXRvclVwLm9uICdtb3VzZWVudGVyJywgKCk9PiBAbGlzdC5zdGFydFNjcm9sbGluZygndXAnKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAub24gJ21vdXNlbGVhdmUnLCAoKT0+IEBsaXN0LnN0b3BTY3JvbGxpbmcoKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5vbiAnbW91c2VlbnRlcicsICgpPT4gQGxpc3Quc3RhcnRTY3JvbGxpbmcoJ2Rvd24nKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5vbiAnbW91c2VsZWF2ZScsICgpPT4gQGxpc3Quc3RvcFNjcm9sbGluZygpXG5cblxuXHRhZGRDaG9pY2U6IChjb25maWcpLT5cblx0XHRpZiBJUy5hcnJheShjb25maWcpXG5cdFx0XHRAYWRkQ2hvaWNlKGl0ZW0pIGZvciBpdGVtIGluIGNvbmZpZ1xuXHRcdFx0cmV0dXJuXG5cdFx0XG5cdFx0ZWxzZSBpZiBJUy5zdHJpbmcoY29uZmlnKVxuXHRcdFx0Y29uZmlnID0ge2xhYmVsOmNvbmZpZywgdmFsdWU6Y29uZmlnfVxuXHRcdFxuXHRcdGVsc2UgaWYgSVMub2JqZWN0UGxhaW4oY29uZmlnKVxuXHRcdFx0Y29uZmlnLnZhbHVlID89IGNvbmZpZy5sYWJlbFxuXHRcdFx0Y29uZmlnLmxhYmVsID89IGNvbmZpZy52YWx1ZVxuXG5cdFx0ZWxzZSByZXR1cm5cblxuXHRcdG5ld0Nob2ljZSA9IG5ldyBDaG9pY2UoQCwgY29uZmlnLCBAbGlzdCwgQGNob2ljZXMubGVuZ3RoKVxuXHRcdEBjaG9pY2VzLnB1c2gobmV3Q2hvaWNlKVxuXHRcdHJldHVybiBuZXdDaG9pY2VcblxuXG5cdGFwcGVuZFRvOiAodGFyZ2V0KS0+XG5cdFx0QGVscy5jb250YWluZXIuYXBwZW5kVG8odGFyZ2V0KVxuXG5cblx0b25TZWxlY3RlZDogKGNhbGxiYWNrKS0+XG5cdFx0QF9zZWxlY3RlZENhbGxiYWNrID0gY2FsbGJhY2tcblxuXG5cdGZpbmRDaG9pY2U6IChwcm92aWRlZFZhbHVlLCBieUxhYmVsKS0+XG5cdFx0bWF0Y2hlcyA9IEBjaG9pY2VzLmZpbHRlciAoY2hvaWNlKS0+IHN3aXRjaFxuXHRcdFx0d2hlbiBJUy5vYmplY3QocHJvdmlkZWRWYWx1ZSkgdGhlbiBwcm92aWRlZFZhbHVlIGlzIGNob2ljZVxuXHRcdFx0d2hlbiBieUxhYmVsIHRoZW4gcHJvdmlkZWRWYWx1ZSBpcyBjaG9pY2UubGFiZWxcblx0XHRcdGVsc2UgcHJvdmlkZWRWYWx1ZSBpcyBjaG9pY2UudmFsdWVcblxuXHRcdHJldHVybiBtYXRjaGVzWzBdXG5cblxuXHRmaW5kQ2hvaWNlQW55OiAocHJvdmlkZWRWYWx1ZSktPlxuXHRcdEBmaW5kQ2hvaWNlKHByb3ZpZGVkVmFsdWUpIG9yIEBmaW5kQ2hvaWNlKHByb3ZpZGVkVmFsdWUsIHRydWUpXG5cblxuXHRoaWdobGlnaHRQcmV2OiAoKS0+XG5cdFx0Y3VycmVudEluZGV4ID0gQHZpc2libGVDaG9pY2VzLmluZGV4T2YoQGN1cnJlbnRIaWdobGlnaHRlZClcblx0XHRcblx0XHRpZiBjdXJyZW50SW5kZXggPiAwXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzW2N1cnJlbnRJbmRleC0xXVxuXHRcdFx0QGxpc3Quc2Nyb2xsVXAoY2hvaWNlKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblx0XHRlbHNlXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzW0B2aXNpYmxlQ2hvaWNlcy5sZW5ndGgtMV1cblx0XHRcdEBsaXN0LnNjcm9sbFRvQ2hvaWNlKGNob2ljZSwxKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblxuXG5cblx0aGlnaGxpZ2h0TmV4dDogKCktPlxuXHRcdGN1cnJlbnRJbmRleCA9IEB2aXNpYmxlQ2hvaWNlcy5pbmRleE9mKEBjdXJyZW50SGlnaGxpZ2h0ZWQpXG5cdFx0XG5cdFx0aWYgY3VycmVudEluZGV4IDwgQHZpc2libGVDaG9pY2VzLmxlbmd0aC0xXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzW2N1cnJlbnRJbmRleCsxXVxuXHRcdFx0QGxpc3Quc2Nyb2xsRG93bihjaG9pY2UpIHVubGVzcyBAbGlzdC5jaG9pY2VJblZpZXcoY2hvaWNlKVxuXHRcdGVsc2Vcblx0XHRcdEBjdXJyZW50SGlnaGxpZ2h0ZWQgPSBjaG9pY2UgPSBAdmlzaWJsZUNob2ljZXNbMF1cblx0XHRcdEBsaXN0LnNjcm9sbFRvQ2hvaWNlKGNob2ljZSwxKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblxuXG5cblxuXG5cblxuY2xhc3MgTGlzdFxuXHRjb25zdHJ1Y3RvcjogKEBkcm9wZG93biktPlxuXHRcdHtAZWxzLCBAZmllbGQsIEBzZXR0aW5nc30gPSBAZHJvcGRvd25cblx0XHRAZWwgPSBAZWxzLmxpc3Rcblx0XHRAY29udGFpbmVyID0gQGVscy5jb250YWluZXJcblxuXHRjYWxjRGlzcGxheTogKCktPlxuXHRcdHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuXHRcdHRyYW5zbGF0aW9uID0gQHRyYW5zbGF0aW9uIG9yIDBcblx0XHRjbGlwcGluZ1BhcmVudCA9IEBjb250YWluZXIucGFyZW50TWF0Y2hpbmcgKHBhcmVudCktPiBvdmVyZmxvdz1wYXJlbnQuc3R5bGUoJ292ZXJmbG93WScpOyBvdmVyZmxvdyBpcyAnaGlkZGVuJyBvciBvdmVyZmxvdyBpcyAnc2Nyb2xsJ1xuXHRcdHNjcm9sbEhlaWdodCA9IEBlbC5yYXcuc2Nyb2xsSGVpZ2h0IG9yIEluZmluaXR5XG5cdFx0c2VsZlJlY3QgPSBleHRlbmQuY2xvbmUgQGNvbnRhaW5lci5yZWN0XG5cdFx0cGFkZGluZyA9IHNlbGZSZWN0LmhlaWdodCAtIEBlbC5oZWlnaHRcblx0XHRoZWlnaHQgPSBNYXRoLm1pbiBzY3JvbGxIZWlnaHQsIEBzZXR0aW5ncy5tYXhIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodC00MFxuXHRcdHNlbGZSZWN0LmJvdHRvbSA9IHNlbGZSZWN0LnRvcCArIGhlaWdodFxuXG5cdFx0aWYgY2xpcHBpbmdQYXJlbnRcblx0XHRcdGNsaXBwaW5nUmVjdCA9IGNsaXBwaW5nUGFyZW50LnJlY3Rcblx0XHRcdGJvdHRvbUN1dG9mZiA9IHNlbGZSZWN0LmJvdHRvbSAtIGNsaXBwaW5nUmVjdC5ib3R0b21cblx0XHRcdHRvcEN1dG9mZiA9IGNsaXBwaW5nUmVjdC50b3AgLSBzZWxmUmVjdC50b3Bcblx0XHRcdGlzQm90dG9tQ3V0b2ZmID0gYm90dG9tQ3V0b2ZmID4gMFxuXHRcdFx0aXNUb3BDdXRvZmYgPSB0b3BDdXRvZmYgPiAwXG5cblx0XHRcdGlmIHNlbGZSZWN0LnRvcCA+PSBjbGlwcGluZ1JlY3QuYm90dG9tIG9yIGNsaXBwaW5nUmVjdC50b3AgPj0gc2VsZlJlY3QuYm90dG9tXG5cdFx0XHRcdGNvbnNvbGUud2FybihcIlRoZSBkcm9wZG93biBmb3IgZWxlbWVudCAnI3tAZmllbGQuSUR9JyBjYW5ub3QgYmUgZGlzcGxheWVkIGFzIGl0J3MgaGlkZGVuIGJ5IHRoZSBwYXJlbnQgb3ZlcmZsb3dcIilcblx0XHRcdFxuXHRcdFx0ZWxzZSBpZiBpc0JvdHRvbUN1dG9mZiBvciBpc1RvcEN1dG9mZlxuXHRcdFx0XHRuZWVkc05ld0hlaWdodCA9IHRydWVcblx0XHRcdFx0XG5cdFx0XHRcdGlmIHNlbGZSZWN0LnRvcCAtIGJvdHRvbUN1dG9mZiA+IGNsaXBwaW5nUmVjdC50b3AgYW5kIG5vdCBpc1RvcEN1dG9mZlxuXHRcdFx0XHRcdHRyYW5zbGF0aW9uID0gYm90dG9tQ3V0b2ZmXG5cdFx0XHRcdFx0c2VsZlJlY3QudG9wIC09IHRyYW5zbGF0aW9uXG5cdFx0XHRcdFx0c2VsZlJlY3QuYm90dG9tIC09IHRyYW5zbGF0aW9uXG5cdFx0XHRcdFx0Y3V0b2ZmID0gY2xpcHBpbmdSZWN0LnRvcCAtIHNlbGZSZWN0LnRvcFxuXG5cdFx0XHRcdGVsc2UgaWYgc2VsZlJlY3QuYm90dG9tIC0gdG9wQ3V0b2ZmIDwgY2xpcHBpbmdSZWN0LmJvdHRvbVxuXHRcdFx0XHRcdHRyYW5zbGF0aW9uID0gdG9wQ3V0b2ZmICogLTFcblx0XHRcdFx0XHRzZWxmUmVjdC50b3AgKz0gdHJhbnNsYXRpb25cblx0XHRcdFx0XHRzZWxmUmVjdC5ib3R0b20gKz0gdHJhbnNsYXRpb25cblx0XHRcdFx0XHRjdXRvZmYgPSBzZWxmUmVjdC5ib3R0b20gLSBjbGlwcGluZ1JlY3QuYm90dG9tXG5cblxuXHRcdFx0XHRpZiBuZWVkc05ld0hlaWdodCA9IGN1dG9mZiA+IDBcblx0XHRcdFx0XHRoZWlnaHQgPSBjdXRvZmYgLSBwYWRkaW5nXG5cblx0XHRcblx0XHR3aW5kb3dDdXRvZmYgPSAoc2VsZlJlY3QudG9wICsgaGVpZ2h0KSAtIHdpbmRvd0hlaWdodFxuXHRcdFxuXHRcdGlmIHdpbmRvd0N1dG9mZiA+IDAgYW5kIGhlaWdodCA8IHdpbmRvd0hlaWdodFxuXHRcdFx0dHJhbnNsYXRpb24gKz0gd2luZG93Q3V0b2ZmKzEwXG5cblx0XHRAc2V0RGltZW5zaW9ucyhoZWlnaHQsIEBmaWVsZC5lbC5jaGlsZC5pbm5lcndyYXAud2lkdGgrMTApXG5cdFx0QHNldFRyYW5zbGF0ZSh0cmFuc2xhdGlvbilcblxuXG5cdHNldERpbWVuc2lvbnM6IChoZWlnaHQsIHdpZHRoKS0+XG5cdFx0QGVsLnN0eWxlICdtYXhIZWlnaHQnLCBoZWlnaHQgaWYgaGVpZ2h0P1xuXHRcdEBlbC5zdHlsZSAnbWluV2lkdGgnLCB3aWR0aCBpZiB3aWR0aD9cblxuXHRcblx0c2V0VHJhbnNsYXRlOiAodHJhbnNsYXRpb24pLT5cblx0XHRAdHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvblxuXHRcdHRyYW5zbGF0aW9uICo9IC0xXG5cdFx0QGNvbnRhaW5lci5zdHlsZSAndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGVZKCN7dHJhbnNsYXRpb259cHgpXCJcblxuXG5cdHNjcm9sbFRvQ2hvaWNlOiAoY2hvaWNlLG9mZnNldD0zKS0+XG5cdFx0ZGlzdGFuZUZyb21Ub3AgPSBjaG9pY2UuZWwucmF3Lm9mZnNldFRvcFxuXHRcdHNlbGVjdGVkSGVpZ2h0ID0gY2hvaWNlLmVsLmhlaWdodFxuXHRcdFxuXHRcdEBlbC5yYXcuc2Nyb2xsVG9wID0gZGlzdGFuZUZyb21Ub3AgLSBzZWxlY3RlZEhlaWdodCpvZmZzZXRcblxuXHRzY3JvbGxEb3duOiAoY2hvaWNlKS0+XG5cdFx0QGVsLnJhdy5zY3JvbGxUb3AgKz0gY2hvaWNlLmVsLmhlaWdodFxuXG5cdHNjcm9sbFVwOiAoY2hvaWNlKS0+XG5cdFx0QGVsLnJhdy5zY3JvbGxUb3AgLT0gY2hvaWNlLmVsLmhlaWdodFxuXG5cdGNob2ljZUluVmlldzogKGNob2ljZSk9PlxuXHRcdGNob2ljZVJlY3QgPSBjaG9pY2UuZWwucmVjdFxuXHRcdGxpc3RSZWN0ID0gQGVsLnJlY3Rcblx0XHR1cFBhZGRpbmcgPSBpZiBAZWxzLnNjcm9sbEluZGljYXRvclVwLnN0YXRlKCd2aXNpYmxlJykgdGhlbiBwYXJzZUZsb2F0IEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAuc3R5bGVTYWZlKCdoZWlnaHQnLHRydWUpXG5cdFx0ZG93blBhZGRpbmcgPSBpZiBAZWxzLnNjcm9sbEluZGljYXRvckRvd24uc3RhdGUoJ3Zpc2libGUnKSB0aGVuIHBhcnNlRmxvYXQgQGVscy5zY3JvbGxJbmRpY2F0b3JEb3duLnN0eWxlU2FmZSgnaGVpZ2h0Jyx0cnVlKVxuXG5cdFx0Y2hvaWNlUmVjdC5ib3R0b20gPD0gbGlzdFJlY3QuYm90dG9tLWRvd25QYWRkaW5nIGFuZFxuXHRcdGNob2ljZVJlY3QudG9wID49IGxpc3RSZWN0LnRvcCt1cFBhZGRpbmdcblxuXG5cdHN0YXJ0U2Nyb2xsaW5nOiAoZGlyZWN0aW9uKS0+XG5cdFx0QHNjcm9sbEludGVydmFsSUQgPSBzZXRJbnRlcnZhbCAoKT0+XG5cdFx0XHRAZWwucmF3LnNjcm9sbFRvcCArPSBpZiBkaXJlY3Rpb24gaXMgJ3VwJyB0aGVuIC0yMCBlbHNlIDIwXG5cdFx0LCA1MFxuXG5cblx0c3RvcFNjcm9sbGluZzogKCktPlxuXHRcdGNsZWFySW50ZXJ2YWwoQHNjcm9sbEludGVydmFsSUQpXG5cblxuXG5cblxuY2xhc3MgQ2hvaWNlXG5cdGNvbnN0cnVjdG9yOiAoQGRyb3Bkb3duLCBAc2V0dGluZ3MsIEBsaXN0LCBAaW5kZXgpLT5cblx0XHR7QGxhYmVsLCBAdmFsdWUsIEBjb25kaXRpb25zfSA9IEBzZXR0aW5nc1xuXHRcdEBsYWJlbCA/PSBAdmFsdWVcblx0XHRAdmFsdWUgPz0gQGxhYmVsXG5cdFx0QGZpZWxkID0gQGRyb3Bkb3duLmZpZWxkXG5cdFx0QGVsID0gQGRyb3Bkb3duLnRlbXBsYXRlLmNob2ljZS5zcGF3bihudWxsLCB7cmVsYXRlZEluc3RhbmNlOkBkcm9wZG93bn0pLmFwcGVuZFRvKEBsaXN0LmVsKVxuXHRcdEBlbC5jaGlsZHJlblsxXS50ZXh0ID0gQGxhYmVsXG5cdFx0QHZpc2libGUgPSB0cnVlXG5cdFx0QHNlbGVjdGVkID0gZmFsc2Vcblx0XHRAdW5hdmFpbGFibGUgPSBmYWxzZVxuXHRcdFxuXHRcdEBfYXR0YWNoQmluZGluZ3MoKVxuXG5cdFx0aWYgQGNvbmRpdGlvbnM/Lmxlbmd0aFxuXHRcdFx0QHVuYXZhaWxhYmxlID0gdHJ1ZVxuXHRcdFx0QGFsbEZpZWxkcyA9IEBmaWVsZC5hbGxGaWVsZHNcblxuXHRcdFx0Q29uZGl0aW9uLmluaXQgQCwgQGNvbmRpdGlvbnMsICgpPT5cblx0XHRcdFx0QHVuYXZhaWxhYmxlID0gIUNvbmRpdGlvbi52YWxpZGF0ZShAY29uZGl0aW9ucylcblxuXG5cdF9hdHRhY2hCaW5kaW5nczogKCktPiBkbyAoKT0+XG5cdFx0U2ltcGx5QmluZCgndmlzaWJsZScpLm9mKEApLnRvICh2aXNpYmxlLHByZXYpPT5cblx0XHRcdEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlc0NvdW50ICs9IGlmIHZpc2libGUgdGhlbiAxIGVsc2UgLTFcblx0XHRcdEBlbC5zdGF0ZSAndmlzaWJsZScsIHZpc2libGVcblx0XHRcdGlmIHZpc2libGVcblx0XHRcdFx0QGRyb3Bkb3duLnZpc2libGVDaG9pY2VzLnB1c2goQClcblx0XHRcdFx0aWYgSVMuZGVmaW5lZChwcmV2KSAjIGluZGljYXRlcyBzdGF0ZSBoYXMgY2hhbmdlZFxuXHRcdFx0XHRcdEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlcy5zb3J0IChhLGIpLT4gYS5pbmRleCAtIGIuaW5kZXhcblx0XHRcdGVsc2Vcblx0XHRcdFx0aGVscGVycy5yZW1vdmVJdGVtKEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlcywgQClcblxuXHRcdFNpbXBseUJpbmQoJ3NlbGVjdGVkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0LnRvIChzZWxlY3RlZCk9PiBAZWwuc3RhdGUgJ3NlbGVjdGVkJywgc2VsZWN0ZWRcblx0XHRcblx0XHRTaW1wbHlCaW5kKCd1bmF2YWlsYWJsZScsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQClcblx0XHRcdC50byAodW5hdmFpbGFibGUpPT4gQGVsLnN0YXRlICd1bmF2YWlsYWJsZScsIHVuYXZhaWxhYmxlXHRcdFx0XG5cdFx0XHQuYW5kLnRvICh1bmF2YWlsYWJsZSk9PiBAdG9nZ2xlKG9mZiwgdHJ1ZSkgaWYgdW5hdmFpbGFibGVcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmNsaWNrJykub2YoQGVsKVxuXHRcdFx0LnRvICgpPT4gQGRyb3Bkb3duLmxhc3RTZWxlY3RlZCA9IEBcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDptb3VzZWRvd24nKS5vZihAZWwpXG5cdFx0XHQudG8gKGV2ZW50KT0+IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6bW91c2VlbnRlcicpLm9mKEBlbClcblx0XHRcdC50byAoKT0+IEBkcm9wZG93bi5jdXJyZW50SGlnaGxpZ2h0ZWQgPSBAXG5cblxuXHR0b2dnbGU6IChuZXdWYWx1ZSwgdW5hdmFpbGFibGUpLT5cblx0XHRwcmV2U3RhdGUgPSBAc2VsZWN0ZWRcblx0XHRuZXdTdGF0ZSA9IGlmIElTLmRlZmluZWQobmV3VmFsdWUpIHRoZW4gbmV3VmFsdWUgZWxzZSAhQHNlbGVjdGVkXG5cblx0XHRpZiBub3QgbmV3U3RhdGVcblx0XHRcdGlmIEBkcm9wZG93bi5zZXR0aW5ncy5tdWx0aXBsZSBhbmQgcHJldlN0YXRlXG5cdFx0XHRcdEBzZWxlY3RlZCA9IG5ld1N0YXRlXG5cdFx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAZmllbGQuX3ZhbHVlLCBAKVxuXHRcdFx0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBzZWxlY3RlZCA9IG5ld1N0YXRlIGlmIElTLmRlZmluZWQobmV3VmFsdWUpXG5cdFx0XHRcdEBmaWVsZC5fdmFsdWUgPSBudWxsIGlmIHVuYXZhaWxhYmxlXG5cblx0XHRlbHNlXG5cdFx0XHRAc2VsZWN0ZWQgPSBuZXdTdGF0ZVxuXHRcdFx0aWYgQGZpZWxkLnNldHRpbmdzLm11bHRpcGxlXG5cdFx0XHRcdEBmaWVsZC5fdmFsdWUucHVzaChAKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlPy50b2dnbGUob2ZmKVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlID0gQFxuXG5cdFx0XHRAZmllbGQubGFzdFNlbGVjdGVkID0gQFxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IERyb3Bkb3duXG5tb2R1bGUuZXhwb3J0cy5DaG9pY2UgPSBDaG9pY2UiLCJTaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcbm1hc2tDb3JlID0gaW1wb3J0ICd0ZXh0LW1hc2stY29yZSdcbm1hc2tBZGRvbnMgPSBpbXBvcnQgJ3RleHQtbWFzay1hZGRvbnMnXG5leHRlbmQgPSBpbXBvcnQgJ3NtYXJ0LWV4dGVuZCdcbklTID0gaW1wb3J0ICcuLi9jaGVja3MnXG5SRUdFWCA9IGltcG9ydCAnLi4vY29uc3RhbnRzL3JlZ2V4J1xuaGVscGVycyA9IGltcG9ydCAnLi4vaGVscGVycydcbmRlZmF1bHRQYXR0ZXJuQ2hhcnMgPSBcblx0JzEnOiBSRUdFWC5udW1lcmljXG5cdCcjJzogUkVHRVgud2lkZW51bWVyaWNcblx0J2EnOiBSRUdFWC5sZXR0ZXJcblx0JyonOiBSRUdFWC5hbnlcblxuXG5jbGFzcyBNYXNrXG5cdGNvbnN0cnVjdG9yOiAoQGZpZWxkLCBAY29uZmlnKS0+XG5cdFx0QHZhbHVlID0gJydcblx0XHRAcHJldlZhbHVlID0gJydcblx0XHRAY3Vyc29yID0gMFxuXHRcdEBwcmV2Q3Vyc29yID0gMFxuXHRcdEBwYXR0ZXJuID0gQHBhdHRlcm5SYXcgPSBAY29uZmlnLnBhdHRlcm5cblx0XHRAcGF0dGVyblNldHRlciA9IEBjb25maWcuc2V0dGVyXG5cdFx0QHBsYWNlaG9sZGVyQ2hhciA9IEBjb25maWcucGxhY2Vob2xkZXJcblx0XHRAcGxhY2Vob2xkZXJSZWdleCA9IG5ldyBSZWdFeHAoJ1xcXFwnKyhAcGxhY2Vob2xkZXJDaGFyIG9yICdfJyksJ2cnKVxuXHRcdEBndWlkZSA9IEBjb25maWcuZ3VpZGVcblx0XHRAa2VlcENoYXJQb3NpdGlvbnMgPSBAY29uZmlnLmtlZXBDaGFyUG9zaXRpb25zXG5cdFx0QGNoYXJzID0gZXh0ZW5kLmNsb25lIGRlZmF1bHRQYXR0ZXJuQ2hhcnMsIEBjb25maWcuY3VzdG9tUGF0dGVybnNcblxuXHRcdEBzZXRQYXR0ZXJuKEBwYXR0ZXJuKVxuXG5cblx0Z2V0U3RhdGU6IChwYXR0ZXJuLCByYXdWYWx1ZSktPiB7XG5cdFx0cmF3VmFsdWUsIEBndWlkZSwgQHBsYWNlaG9sZGVyQ2hhciwgQGtlZXBDaGFyUG9zaXRpb25zLFxuXHRcdGN1cnJlbnRDYXJldFBvc2l0aW9uOiBpZiBAZmllbGQuZWwgdGhlbiBAZmllbGQuc2VsZWN0aW9uKCkuZW5kIGVsc2UgQGN1cnNvclxuXHRcdHByZXZpb3VzQ29uZm9ybWVkVmFsdWU6IEBwcmV2VmFsdWVcblx0XHRwbGFjZWhvbGRlcjogQGdldFBsYWNlaG9sZGVyKHBhdHRlcm4pXG5cdH1cblxuXHRnZXRQbGFjZWhvbGRlcjogKHBhdHRlcm4pLT5cblx0XHRpZiBJUy5mdW5jdGlvbihwYXR0ZXJuKVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cGxhY2Vob2xkZXIgPSAnJ1xuXHRcdFx0Zm9yIGNoYXIgaW4gcGF0dGVyblxuXHRcdFx0XHRpZiBJUy5yZWdleChjaGFyKVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyICs9IEBwbGFjZWhvbGRlckNoYXJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyICs9IGNoYXJcblxuXHRcdFx0cmV0dXJuIHBsYWNlaG9sZGVyXG5cblxuXHRyZXNvbHZlUGF0dGVybjogKHBhdHRlcm4sIGlucHV0LCBzdGF0ZSktPlxuXHRcdHBhdHRlcm4gPSBcblx0XHRcdGlmIHR5cGVvZiBwYXR0ZXJuIGlzICdmdW5jdGlvbidcblx0XHRcdFx0cGF0dGVybihpbnB1dCwgQGdldFN0YXRlKHBhdHRlcm4sIGlucHV0KSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0cGF0dGVyblxuXG5cdFx0b2Zmc2V0ID0gMFxuXHRcdHRyYXBJbmRleGVzID0gW11cblx0XHRjb3B5ID0gcGF0dGVybi5zbGljZSgpXG5cdFx0Zm9yIGNoYXIsaSBpbiBjb3B5IHdoZW4gY2hhciBpcyAnW10nXG5cdFx0XHR0cmFwSW5kZXhlcy5wdXNoKGktb2Zmc2V0KVxuXHRcdFx0cGF0dGVybi5zcGxpY2UoaS1vZmZzZXQsMSlcblx0XHRcdG9mZnNldCsrXG5cblx0XHRAcHJldlBhdHRlcm4gPSBAcmVzb2x2ZWRQYXR0ZXJuXG5cdFx0QHJlc29sdmVkUGF0dGVybiA9IHBhdHRlcm5cblx0XHRyZXR1cm4ge3BhdHRlcm4sIGNhcmV0VHJhcEluZGV4ZXM6dHJhcEluZGV4ZXN9XG5cblxuXHRzZXRQYXR0ZXJuOiAoc3RyaW5nLCB1cGRhdGVWYWx1ZT10cnVlLCB1cGRhdGVGaWVsZCktPlxuXHRcdEBwYXR0ZXJuUmF3ID0gc3RyaW5nXG5cdFx0QHBhdHRlcm4gPSBAcGFyc2VQYXR0ZXJuKHN0cmluZylcblx0XHRAdHJhbnNmb3JtID0gQHBhcnNlVHJhbnNmb3JtKHN0cmluZylcblxuXHRcdGlmIHVwZGF0ZVZhbHVlXG5cdFx0XHRAdmFsdWUgPSBAc2V0VmFsdWUoQHZhbHVlKVxuXHRcdFx0QGZpZWxkLnZhbHVlID0gQHZhbHVlIGlmIHVwZGF0ZUZpZWxkXG5cblxuXHRwYXJzZVBhdHRlcm46IChzdHJpbmcpLT4gc3dpdGNoXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ0VNQUlMJ1xuXHRcdFx0bWFza0FkZG9ucy5lbWFpbE1hc2subWFza1xuXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ1BIT05FJ1xuXHRcdFx0QHBhdHRlcm5TZXR0ZXIgPSAodmFsdWUpLT4gaGVscGVycy5yZXBlYXQoJyMnLCBNYXRoLm1heCA3LHZhbHVlLmxlbmd0aClcblx0XHRcdEBndWlkZSA9IGZhbHNlXG5cdFx0XHRyZXR1cm4gJyMnXG5cblx0XHR3aGVuIHN0cmluZyBpcyAnTkFNRSdcblx0XHRcdEBwYXR0ZXJuU2V0dGVyID0gKHZhbHVlKS0+XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShAcGxhY2Vob2xkZXJSZWdleCwgJycpLnRyaW0oKVxuXHRcdFx0XHRoZWxwZXJzLnJlcGVhdCgnYScsIE1hdGgubWF4IDIsdmFsdWUubGVuZ3RoKVxuXG5cdFx0XHRyZXR1cm4gJ2EnXG5cblx0XHR3aGVuIHN0cmluZyBpcyAnRlVMTE5BTUUnXG5cdFx0XHRAcGF0dGVyblNldHRlciA9ICh2YWx1ZSktPlxuXHRcdFx0XHRpZiB2YWx1ZVt2YWx1ZS5sZW5ndGgtMV0gaXMgJyAnIHRoZW4gdmFsdWUgKz0gJ3gnXG5cdFx0XHRcdHNwbGl0ID0gdmFsdWUucmVwbGFjZShAcGxhY2Vob2xkZXJSZWdleCwnJykudHJpbSgpLnNwbGl0KC9cXHMrLylcblx0XHRcdFx0cmV0dXJuIGlmIHNwbGl0Lmxlbmd0aCBpcyA0XG5cdFx0XHRcdHNwbGl0Lm1hcCgocGFydCktPiBoZWxwZXJzLnJlcGVhdCgnYScsIE1hdGgubWF4IDIscGFydC5sZW5ndGgpKS5qb2luKCcgJylcblx0XHRcdHJldHVybiAnYSdcblxuXHRcdHdoZW4gc3RyaW5nIGlzICdEQVRFJ1xuXHRcdFx0Wy9cXGQvLCAvXFxkLywgJy8nLCAvXFxkLywgL1xcZC8sICcvJywgL1xcZC8sIC9cXGQvLCAvXFxkLywgL1xcZC9dXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmdbMF0gaXMgJ0RBVEUnIGFuZCBJUy5zdHJpbmcoc3RyaW5nWzFdKVxuXHRcdFx0c3RyaW5nWzFdLnNwbGl0KCcnKS5tYXAoKGNoYXIpPT4gaWYgUkVHRVgubGV0dGVyLnRlc3QoY2hhcikgdGhlbiAvXFxkLyBlbHNlIGNoYXIpXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmcgaXMgJ05VTUJFUidcblx0XHRcdG1hc2tBZGRvbnMuY3JlYXRlTnVtYmVyTWFza1xuXHRcdFx0XHRwcmVmaXg6IEBjb25maWcucHJlZml4IG9yICcnXG5cdFx0XHRcdHN1ZmZpeDogQGNvbmZpZy5zdWZmaXggb3IgJydcblx0XHRcdFx0aW5jbHVkZVRob3VzYW5kc1NlcGFyYXRvcjogaWYgQGNvbmZpZy5zZXAgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRcdFx0dGhvdXNhbmRzU2VwYXJhdG9yU3ltYm9sOiBpZiBJUy5zdHJpbmcoQGNvbmZpZy5zZXApIHRoZW4gQGNvbmZpZy5zZXBcblx0XHRcdFx0YWxsb3dEZWNpbWFsOiBAY29uZmlnLmRlY2ltYWxcblx0XHRcdFx0ZGVjaW1hbExpbWl0OiBpZiBJUy5udW1iZXIoQGNvbmZpZy5kZWNpbWFsKSB0aGVuIEBjb25maWcuZGVjaW1hbFxuXHRcdFx0XHRpbnRlZ2VyTGltaXQ6IGlmIElTLm51bWJlcihAY29uZmlnLmxpbWl0KSB0aGVuIEBjb25maWcubGltaXRcblxuXHRcdHdoZW4gSVMuYXJyYXkoc3RyaW5nKVxuXHRcdFx0cmV0dXJuIHN0cmluZ1xuXG5cdFx0ZWxzZVxuXHRcdFx0cGF0dGVybiA9IFtdXG5cblx0XHRcdGZvciBjaGFyLGkgaW4gc3RyaW5nXG5cdFx0XHRcdGlmIGNoYXIgaXMgJ1xcXFwnXG5cdFx0XHRcdFx0ZXNjYXBlZCA9IHRydWVcblx0XHRcdFx0XHRjb250aW51ZVxuXHRcdFx0XHRcblx0XHRcdFx0cGF0dGVybi5wdXNoIGlmIGVzY2FwZWQgdGhlbiBjaGFyIGVsc2UgKEBjaGFyc1tjaGFyXSBvciBjaGFyKVxuXHRcdFx0XHRlc2NhcGVkID0gZmFsc2VcblxuXHRcdFx0cmV0dXJuIHBhdHRlcm5cblxuXG5cdHBhcnNlVHJhbnNmb3JtOiAoc3RyaW5nKS0+IHN3aXRjaFxuXHRcdHdoZW4gc3RyaW5nIGlzICdFTUFJTCdcblx0XHRcdG1hc2tBZGRvbnMuZW1haWxNYXNrLnBpcGVcblx0XHRcblx0XHR3aGVuIHN0cmluZyBpcyAnREFURSdcblx0XHRcdG1hc2tBZGRvbnMuY3JlYXRlQXV0b0NvcnJlY3RlZERhdGVQaXBlKCdtbS9kZC95eXl5Jylcblx0XHRcblx0XHR3aGVuIHN0cmluZ1swXSBpcyAnREFURScgYW5kIElTLnN0cmluZyhzdHJpbmdbMV0pXG5cdFx0XHRtYXNrQWRkb25zLmNyZWF0ZUF1dG9Db3JyZWN0ZWREYXRlUGlwZShzdHJpbmdbMV0pXG5cblx0XHR3aGVuIEBjb25maWcudHJhbnNmb3JtXG5cdFx0XHRAY29uZmlnLnRyYW5zZm9ybVxuXG5cblxuXHRzZXRWYWx1ZTogKGlucHV0KS0+XG5cdFx0aWYgQHBhdHRlcm5TZXR0ZXJcblx0XHRcdG5ld1BhdHRlcm4gPSBAcGF0dGVyblNldHRlcihpbnB1dCkgb3IgQHBhdHRlcm5cblx0XHRcdEBzZXRQYXR0ZXJuKG5ld1BhdHRlcm4sIGZhbHNlKSBpZiBuZXdQYXR0ZXJuIGlzbnQgQHBhdHRlcm5SYXcgYW5kIG5ld1BhdHRlcm4gaXNudCBAcGF0dGVyblxuXHRcdFxuXHRcdHtjYXJldFRyYXBJbmRleGVzLCBwYXR0ZXJufSA9IEByZXNvbHZlUGF0dGVybihAcGF0dGVybiwgaW5wdXQpXG5cdFx0cmV0dXJuIEB2YWx1ZSBpZiBwYXR0ZXJuIGlzIGZhbHNlXG5cblx0XHRAcHJldlZhbHVlID0gQHZhbHVlXG5cdFx0QHByZXZDdXJzb3IgPSBAY3Vyc29yXG5cdFx0c3RhdGUgPSBAZ2V0U3RhdGUocGF0dGVybiwgaW5wdXQpXG5cdFx0e2NvbmZvcm1lZFZhbHVlfSA9IG1hc2tDb3JlLmNvbmZvcm1Ub01hc2soaW5wdXQsIHBhdHRlcm4sIHN0YXRlKVxuXG5cdFx0dHJhbnNmb3JtZWQgPSBAdHJhbnNmb3JtKGNvbmZvcm1lZFZhbHVlLCBzdGF0ZSkgaWYgQHRyYW5zZm9ybVxuXHRcdGlmIHRyYW5zZm9ybWVkIGlzIGZhbHNlXG5cdFx0XHRyZXR1cm4gQHZhbHVlXG5cdFx0aWYgSVMuc3RyaW5nKHRyYW5zZm9ybWVkKVxuXHRcdFx0Y29uZm9ybWVkVmFsdWUgPSB0cmFuc2Zvcm1lZFxuXHRcdGVsc2UgaWYgSVMub2JqZWN0KHRyYW5zZm9ybWVkKVxuXHRcdFx0aW5kZXhlc09mUGlwZWRDaGFycyA9IHRyYW5zZm9ybWVkLmluZGV4ZXNPZlBpcGVkQ2hhcnNcblx0XHRcdGNvbmZvcm1lZFZhbHVlID0gdHJhbnNmb3JtZWQudmFsdWVcblxuXG5cdFx0QGN1cnNvciA9IG1hc2tDb3JlLmFkanVzdENhcmV0UG9zaXRpb24gZXh0ZW5kIHN0YXRlLCB7XG5cdFx0XHRpbmRleGVzT2ZQaXBlZENoYXJzLCBjYXJldFRyYXBJbmRleGVzLCBjb25mb3JtZWRWYWx1ZVxuXHRcdH1cblxuXHRcdHJldHVybiBAdmFsdWUgPSBjb25mb3JtZWRWYWx1ZVxuXG5cblx0dmFsaWRhdGU6IChpbnB1dCktPlxuXHRcdGlmIGlucHV0IGlzbnQgQHZhbHVlIGFuZCBAcGF0dGVyblNldHRlclxuXHRcdFx0cGF0dGVybiA9IEBwYXR0ZXJuU2V0dGVyKGlucHV0KSBvciBAcGF0dGVyblxuXHRcdGVsc2Vcblx0XHRcdHBhdHRlcm4gPSBAcmVzb2x2ZWRQYXR0ZXJuXG5cdFx0XHR7cGF0dGVybn0gPSBAcmVzb2x2ZVBhdHRlcm4oQHBhdHRlcm4sIGlucHV0KSBpZiBub3QgcGF0dGVyblxuXG5cdFx0cmV0dXJuIHRydWUgaWYgcGF0dGVybiBpcyBmYWxzZVxuXHRcdFxuXHRcdGZvciBjaGFyLGkgaW4gcGF0dGVyblxuXHRcdFx0c3dpdGNoXG5cdFx0XHRcdHdoZW4gbm90IGlucHV0W2ldXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0XHRcdHdoZW4gSVMucmVnZXgoY2hhcikgYW5kIG5vdCBjaGFyLnRlc3QoaW5wdXRbaV0pXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0XHRcdHdoZW4gSVMuc3RyaW5nKGNoYXIpIGFuZCBpbnB1dFtpXSBpc250IGNoYXJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdHJldHVybiB0cnVlXG5cblx0aXNFbXB0eTogKCktPlxuXHRcdGlucHV0ID0gQHZhbHVlXG5cdFx0cGF0dGVybiA9IEByZXNvbHZlZFBhdHRlcm5cblx0XHRpZiBub3QgcGF0dGVyblxuXHRcdFx0cGF0dGVybiA9IEBwYXR0ZXJuU2V0dGVyKGlucHV0KSBpZiBAcGF0dGVyblNldHRlclxuXHRcdFx0e3BhdHRlcm59ID0gQHJlc29sdmVQYXR0ZXJuKHBhdHRlcm4gb3IgQHBhdHRlcm4sIGlucHV0KVxuXHRcdFxuXHRcdHJldHVybiB0cnVlIGlmIGlucHV0IGlzIEBjb25maWcucHJlZml4IG9yIGlucHV0IGlzIEBjb25maWcuc3VmZml4XG5cblx0XHRmb3IgY2hhcixpIGluIHBhdHRlcm5cblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIG5vdCBpbnB1dFtpXVxuXHRcdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRcdHdoZW4gSVMucmVnZXgoY2hhcilcblx0XHRcdFx0XHRyZXR1cm4gIWNoYXIudGVzdChpbnB1dFtpXSlcblx0XHRyZXR1cm4gZmFsc2VcblxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYXNrIiwibW9kdWxlLmV4cG9ydHMgPSBrZXlDb2RlcyA9XG5cdGRlbGV0ZTogOFxuXHRlbnRlcjogMTNcblx0ZXNjOiAyN1xuXHRjdHJsOiAxN1xuXHRhbHQ6IDE4XG5cdHNoaWZ0OiAxNlxuXHRzdXBlcjogOTFcblx0c3VwZXIyOiA5M1xuXHR1cDogMzhcblx0bGVmdDogMzdcblx0cmlnaHQ6IDM5XG5cdGRvd246IDQwXG5cdGh5cGhlbjogNDVcblx0dW5kZXJzY29yZTogOTVcblx0cXVlc3Rpb246IDYzXG5cdGV4Y2xhbWF0aW9uOiAzM1xuXHRmcm9udHNsYXNoOiA0N1xuXHRiYWNrc2xhc2g6IDkyXG5cdGNvbW1hOiA0NFxuXHRwZXJpb2Q6IDQ2XG5cdHNwYWNlOiAzMlxuXG5cdGFueUFycm93OiAoY29kZSktPlxuXHRcdGNvZGUgaXMga2V5Q29kZXMudXAgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmRvd24gb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmxlZnQgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLnJpZ2h0XG5cdFxuXHRhbnlNb2RpZmllcjogKGNvZGUpLT5cblx0XHRjb2RlIGlzIGtleUNvZGVzLmN0cmwgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmFsdCBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMuc2hpZnQgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLnN1cGVyIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5zdXBlcjJcblx0XG5cdGFueUFscGhhOiAoY29kZSktPlxuXHRcdDk3IDw9IGNvZGUgPD0gMTIyIG9yXG5cdFx0NjUgPD0gY29kZSA8PSA5MFxuXG5cdGFueU51bWVyaWM6IChjb2RlKS0+XG5cdFx0NDggPD0gY29kZSA8PSA1N1xuXG5cblx0YW55QWxwaGFOdW1lcmljOiAoY29kZSktPlxuXHRcdGtleUNvZGVzLmFueUFscGhhKGNvZGUpIG9yXG5cdFx0a2V5Q29kZXMuYW55TnVtZXJpYyhjb2RlKVxuXG5cdGFueVByaW50YWJsZTogKGNvZGUpLT5cblx0XHRrZXlDb2Rlcy5hbnlBbHBoYShjb2RlKSBvclxuXHRcdGtleUNvZGVzLmFueU51bWVyaWMoY29kZSkgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmh5cGhlbiBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMudW5kZXJzY29yZSBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMucXVlc3Rpb24gb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmV4Y2xhbWF0aW9uIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5mcm9udHNsYXNoIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5iYWNrc2xhc2ggb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmNvbW1hIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5wZXJpb2Qgb3IgXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5zcGFjZVxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5DT0xPUlMgPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9jb2xvcnMnXG5DSEVDS01BUktfV0lEVEggPSAyNlxuXG5leHBvcnQgZGVmYXVsdCBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2ZpZWxkJ1xuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdHZlcnRpY2FsQWxpZ246ICd0b3AnXG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRmb250RmFtaWx5OiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuZm9udEZhbWlseVxuXHRcdFx0dGV4dEFsaWduOiAnbGVmdCdcblx0XHRcdCR2aXNpYmxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuXHRcdFx0JHNob3dFcnJvcjpcblx0XHRcdFx0YW5pbWF0aW9uOiAnMC4ycyBmaWVsZEVycm9yU2hha2UnXG5cblx0XHRbJ2Rpdidcblx0XHRcdHJlZjogJ2xhYmVsJ1xuXHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdHpJbmRleDogMVxuXHRcdFx0XHR0b3A6IChmaWVsZCktPiBAc3R5bGVQYXJzZWQoJ2ZvbnRTaXplJywgdHJ1ZSkgKiAwLjdcblx0XHRcdFx0bGVmdDogKGZpZWxkKS0+IGhlbHBlcnMuc2hvcnRoYW5kU2lkZVZhbHVlKGZpZWxkLnNldHRpbmdzLnBhZGRpbmcsICdsZWZ0JykgKyAoZmllbGQuZWwuY2hpbGQuaWNvbj8ud2lkdGggb3IgMClcblx0XHRcdFx0cGFkZGluZzogKGZpZWxkKS0+IFwiMCAje2ZpZWxkLnNldHRpbmdzLmlucHV0UGFkZGluZ31weFwiXG5cdFx0XHRcdGZvbnRGYW1pbHk6ICdpbmhlcml0J1xuXHRcdFx0XHRmb250U2l6ZTogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmxhYmVsU2l6ZSBvciBmaWVsZC5zZXR0aW5ncy5mb250U2l6ZSAqICgxMS8xNClcblx0XHRcdFx0Zm9udFdlaWdodDogNjAwXG5cdFx0XHRcdGxpbmVIZWlnaHQ6IDFcblx0XHRcdFx0Y29sb3I6IENPTE9SUy5ncmV5XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0dHJhbnNpdGlvbjogJ29wYWNpdHkgMC4ycywgY29sb3IgMC4ycydcblx0XHRcdFx0d2hpdGVTcGFjZTogJ25vd3JhcCdcblx0XHRcdFx0dXNlclNlbGVjdDogJ25vbmUnXG5cdFx0XHRcdGN1cnNvcjogJ2RlZmF1bHQnXG5cdFx0XHRcdHBvaW50ZXJFdmVudHM6ICdub25lJ1xuXHRcdFx0XHQkZmlsbGVkOiAkc2hvd0xhYmVsOlxuXHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0JGZvY3VzOlxuXHRcdFx0XHRcdGNvbG9yOiBDT0xPUlMub3JhbmdlXG5cdFx0XHRcdCRzaG93RXJyb3I6XG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5yZWRcblx0XHRdXG5cblx0XHRbJ2Rpdidcblx0XHRcdHJlZjogJ2lubmVyd3JhcCdcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0XHRoZWlnaHQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5oZWlnaHRcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAnd2hpdGUnXG5cdFx0XHRcdGJvcmRlcldpZHRoOiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuYm9yZGVyXG5cdFx0XHRcdGJvcmRlclN0eWxlOiAnc29saWQnXG5cdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMuZ3JleV9saWdodFxuXHRcdFx0XHRib3JkZXJSYWRpdXM6ICcycHgnXG5cdFx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRcdGZvbnRGYW1pbHk6ICdpbmhlcml0J1xuXHRcdFx0XHR0cmFuc2l0aW9uOiAnYm9yZGVyLWNvbG9yIDAuMnMnXG5cdFx0XHRcdCRmb2N1czpcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLm9yYW5nZVxuXHRcdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMucmVkXG5cdFx0XHRcdCRkaXNhYmxlZDpcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLmdyZXlfbGlnaHRcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5ncmV5X2xpZ2h0XG5cblx0XHRcdFsnaW5wdXQnXG5cdFx0XHRcdHJlZjogJ2lucHV0J1xuXHRcdFx0XHR0eXBlOiAndGV4dCdcblx0XHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0XHRcdHpJbmRleDogM1xuXHRcdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHRcdFx0dmVydGljYWxBbGlnbjogJ3RvcCdcblx0XHRcdFx0XHRoZWlnaHQ6ICgpLT4gQHBhcmVudC5zdHlsZVNhZmUoJ2hlaWdodCcsMSkgb3IgQHBhcmVudC5zdHlsZVNhZmUoJ2hlaWdodCcpXG5cdFx0XHRcdFx0d2lkdGg6IChmaWVsZCktPiBpZiBub3QgZmllbGQuc2V0dGluZ3MuYXV0b1dpZHRoXG5cdFx0XHRcdFx0XHRzdWJ0cmFjdCA9IDBcblx0XHRcdFx0XHRcdGlmIGljb25TaWJsaW5nID0gZmllbGQuZWwuY2hpbGQuaWNvblxuXHRcdFx0XHRcdFx0XHRzdWJ0cmFjdCArPSBpY29uU2libGluZy53aWR0aFxuXHRcdFx0XHRcdFx0aWYgaW5wdXRTaWJsaW5nID0gZmllbGQuZWwuY2hpbGRbZmllbGQuc2V0dGluZ3MuaW5wdXRTaWJsaW5nXVxuXHRcdFx0XHRcdFx0XHR3aWR0aCA9IGlucHV0U2libGluZy5zdHlsZVBhcnNlZCgnd2lkdGgnLDEpIG9yIDBcblx0XHRcdFx0XHRcdFx0cGFkZGluZyA9IGlucHV0U2libGluZy5zdHlsZVBhcnNlZCgncGFkZGluZycsMSkgb3IgMFxuXHRcdFx0XHRcdFx0XHRwYWRkaW5nTGVmdCA9IGlucHV0U2libGluZy5zdHlsZVBhcnNlZCgncGFkZGluZ0xlZnQnLDEpIG9yIHBhZGRpbmcgb3IgMFxuXHRcdFx0XHRcdFx0XHRwYWRkaW5nUmlnaHQgPSBpbnB1dFNpYmxpbmcuc3R5bGVQYXJzZWQoJ3BhZGRpbmdSaWdodCcsMSkgb3IgcGFkZGluZyBvciAwXG5cdFx0XHRcdFx0XHRcdHN1YnRyYWN0ICs9IHdpZHRoK3BhZGRpbmdMZWZ0K3BhZGRpbmdSaWdodFxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiY2FsYygxMDAlIC0gI3tzdWJ0cmFjdH1weClcIlxuXG5cdFx0XHRcdFx0cGFkZGluZzogKGZpZWxkKS0+XG5cdFx0XHRcdFx0XHRAcGFkZGluZyA/PSBNYXRoLm1heCAwLCBoZWxwZXJzLmNhbGNQYWRkaW5nKGZpZWxkLnNldHRpbmdzLmhlaWdodCwgMTQpLTNcblx0XHRcdFx0XHRcdHJldHVybiBcIiN7QHBhZGRpbmd9cHggI3tmaWVsZC5zZXR0aW5ncy5pbnB1dFBhZGRpbmd9cHhcIlxuXHRcdFx0XHRcblx0XHRcdFx0XHRtYXJnaW46ICcwJ1xuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xuXHRcdFx0XHRcdGFwcGVhcmFuY2U6ICdub25lJ1xuXHRcdFx0XHRcdGJvcmRlcjogJ25vbmUnXG5cdFx0XHRcdFx0b3V0bGluZTogJ25vbmUnXG5cdFx0XHRcdFx0Zm9udEZhbWlseTogJ2luaGVyaXQnXG5cdFx0XHRcdFx0Zm9udFNpemU6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5mb250U2l6ZVxuXHRcdFx0XHRcdGNvbG9yOiBDT0xPUlMuYmxhY2tcblx0XHRcdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0XHRcdGJveFNoYWRvdzogJ25vbmUnXG5cdFx0XHRcdFx0d2hpdGVTcGFjZTogJ25vd3JhcCdcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ2xpcDogJ2NvbnRlbnQtYm94JyAjIHNlbWktZml4IGZvciB5ZWxsb3cgYXV0b2ZpbGwgYmFja2dyb3VuZFxuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknXG5cdFx0XHRcdFx0dHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAwLjJzLCAtd2Via2l0LXRyYW5zZm9ybSAwLjJzJ1xuXHRcdFx0XHRcdCRkaXNhYmxlZDpcblx0XHRcdFx0XHRcdGN1cnNvcjogJ25vdC1hbGxvd2VkJ1xuXHRcdFx0XHRcdCRmaWxsZWQ6ICRzaG93TGFiZWw6XG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm06IChmaWVsZCktPlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQHRyYW5zbGF0aW9uIGlmIEB0cmFuc2xhdGlvbj8gb3Igbm90IChsYWJlbD1maWVsZC5lbC5jaGlsZC5sYWJlbCkgb3IgbGFiZWwuc3R5bGVTYWZlKCdwb3NpdGlvbicsMSkgaXNudCAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0XHRcdHRvdGFsSGVpZ2h0ID0gQHBhcmVudC5zdHlsZVBhcnNlZCgnaGVpZ2h0JywxKVxuXHRcdFx0XHRcdFx0XHR3b3JrYWJsZUhlaWdodCA9IHRvdGFsSGVpZ2h0IC0gKGxhYmVsLnN0eWxlUGFyc2VkKCdmb250U2l6ZScsMSkgKyBsYWJlbC5zdHlsZVBhcnNlZCgndG9wJywxKSoyKVxuXHRcdFx0XHRcdFx0XHR0cmFuc2xhdGlvbiA9IE1hdGgubWF4IDAsIE1hdGguZmxvb3IgKHRvdGFsSGVpZ2h0LXdvcmthYmxlSGVpZ2h0KS80XG5cdFx0XHRcdFx0XHRcdHJldHVybiBcInRyYW5zbGF0ZVkoI3t0cmFuc2xhdGlvbn1weClcIlxuXHRcdFx0XHRcdFxuXHRcdFx0XVxuXG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAncGxhY2Vob2xkZXInXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR6SW5kZXg6IDJcblx0XHRcdFx0XHR0b3A6ICcwcHgnXG5cdFx0XHRcdFx0bGVmdDogKGZpZWxkKS0+IGZpZWxkLmVsLmNoaWxkLmljb24/LndpZHRoIG9yIDBcblx0XHRcdFx0XHRmb250RmFtaWx5OiAoZmllbGQpLT4gZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVTYWZlKCdmb250RmFtaWx5JywxKVxuXHRcdFx0XHRcdGZvbnRTaXplOiAoZmllbGQpLT4gZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVTYWZlKCdmb250U2l6ZScsMSlcblx0XHRcdFx0XHRwYWRkaW5nOiAoZmllbGQpLT5cblx0XHRcdFx0XHRcdHZlcnRpID0gZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdUb3AnLDEpIG9yIGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlUGFyc2VkKCdwYWRkaW5nVG9wJylcblx0XHRcdFx0XHRcdGhvcml6ID0gZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdMZWZ0JywxKSBvciBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVBhcnNlZCgncGFkZGluZ0xlZnQnKVxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiI3t2ZXJ0aSszfXB4ICN7aG9yaXp9cHhcIlxuXG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5ibGFja1xuXHRcdFx0XHRcdG9wYWNpdHk6IDAuNVxuXHRcdFx0XHRcdHBvaW50ZXJFdmVudHM6ICdub25lJ1xuXHRcdFx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXHRcdFx0XHRcdHdoaXRlU3BhY2U6ICdub3dyYXAnXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSdcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDAuMnMsIC13ZWJraXQtdHJhbnNmb3JtIDAuMnMnXG5cdFx0XHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0XHRcdHZpc2liaWxpdHk6ICdoaWRkZW4nXG5cdFx0XHRcdFx0XHQkc2hvd0xhYmVsOlxuXHRcdFx0XHRcdFx0XHR0cmFuc2Zvcm06IChmaWVsZCktPiBmaWVsZC5lbC5jaGlsZC5pbnB1dC5yYXcuc3R5bGUudHJhbnNmb3JtXG5cdFx0XHRdXG5cdFx0XVxuXHRcdFxuXHRcdFsnZGl2J1xuXHRcdFx0cmVmOiAnaGVscCdcblx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHR0b3A6ICcxMTAlJ1xuXHRcdFx0XHRsZWZ0OiAoZmllbGQpLT4gaGVscGVycy5zaG9ydGhhbmRTaWRlVmFsdWUoZmllbGQuc2V0dGluZ3MucGFkZGluZywgJ2xlZnQnKVxuXHRcdFx0XHRmb250RmFtaWx5OiAnaW5oZXJpdCdcblx0XHRcdFx0Zm9udFNpemU6ICcxMXB4J1xuXHRcdFx0XHRjb2xvcjogQ09MT1JTLmdyZXlcblx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRcdCRzaG93RXJyb3I6XG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0JHNob3dIZWxwOlxuXHRcdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IGljb24gPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2ljb24nXG5cdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdHpJbmRleDogMlxuXHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHR3aWR0aDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmljb25TaXplXG5cdFx0XHRoZWlnaHQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZVxuXHRcdFx0Zm9udFNpemU6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZVxuXHRcdFx0cGFkZGluZ0xlZnQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pbnB1dFBhZGRpbmdcblx0XHRcdHBhZGRpbmdUb3A6IChmaWVsZCktPiBAcGFyZW50LnN0eWxlUGFyc2VkKCdoZWlnaHQnLDEpLzIgLSBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZS8yXG5cdFx0XHRsaW5lSGVpZ2h0OiAnMWVtJ1xuXHRcdFx0dXNlclNlbGVjdDogJ25vbmUnXG5cblx0XHRtZXRob2RzOlxuXHRcdFx0d2lkdGg6IGdldDogKCktPlxuXHRcdFx0XHRpZiBAX2luc2VydGVkXG5cdFx0XHRcdFx0QHJhdy5vZmZzZXRXaWR0aFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0QHN0eWxlUGFyc2VkKCd3aWR0aCcsMSkgb3IgQHJlbGF0ZWQuc2V0dGluZ3MuaWNvblNpemVcblx0XHRcdFx0IyBAc3R5bGVQYXJzZWQoJ3dpZHRoJywxKSBvciBAcmF3Lm9mZnNldFdpZHRoIG9yIEByZWxhdGVkLnNldHRpbmdzLmljb25TaXplIG9yIDBcblx0XVxuKVxuXG5cbmV4cG9ydCBjaGVja21hcmsgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2NoZWNrbWFyaydcblx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0ekluZGV4OiA0XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdHdpZHRoOiAyNlxuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdHBhZGRpbmdUb3A6ICgpLT4gQHBhcmVudC5zdHlsZVBhcnNlZCgnaGVpZ2h0JywxKS8yIC0gMTNcblx0XHRcdHBhZGRpbmdSaWdodDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmlucHV0UGFkZGluZ1xuXHRcdFx0dmVydGljYWxBbGlnbjogJ3RvcCdcblx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cblx0XHRbJ2Rpdidcblx0XHRcdHJlZjogJ2NoZWNrbWFya19pbm5lcndyYXAnXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0d2lkdGg6ICcyMHB4J1xuXHRcdFx0XHRoZWlnaHQ6ICcyMHB4J1xuXHRcdFx0XHRib3JkZXJSYWRpdXM6ICc1MCUnXG5cdFx0XHRcdGJvcmRlcldpZHRoOiAnM3B4J1xuXHRcdFx0XHRib3JkZXJTdHlsZTogJ3NvbGlkJ1xuXHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLmdyZWVuXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3NjYWxlKDAuOCknXG5cdFx0XHRcdCMgdHJhbnNmb3JtT3JpZ2luOiAnMTAwJSAwJ1xuXHRcdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMucmVkXG5cblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbWFzazEnXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR0b3A6ICctNHB4J1xuXHRcdFx0XHRcdGxlZnQ6ICctMTBweCdcblx0XHRcdFx0XHR3aWR0aDogJzE1cHgnXG5cdFx0XHRcdFx0aGVpZ2h0OiAnMzBweCdcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICczMHB4IDAgMCAzMHB4J1xuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogKGZpZWxkKS0+IGhlbHBlcnMuZGVmYXVsdENvbG9yIGZpZWxkLmVscy5pbm5lcndyYXAuc3R5bGVTYWZlKCdiYWNrZ3JvdW5kQ29sb3InLDEpLCAnd2hpdGUnXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG5cdFx0XHRcdFx0dHJhbnNmb3JtT3JpZ2luOiAnMTVweCAxNXB4IDAnXG5cdFx0XHRdXG5cdFx0XHRcblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbWFzazInXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR0b3A6ICctNXB4J1xuXHRcdFx0XHRcdGxlZnQ6ICc4cHgnXG5cdFx0XHRcdFx0d2lkdGg6ICcxNXB4J1xuXHRcdFx0XHRcdGhlaWdodDogJzMwcHgnXG5cdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnMCAzMHB4IDMwcHggMCdcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IChmaWVsZCktPiBoZWxwZXJzLmRlZmF1bHRDb2xvciBmaWVsZC5lbHMuaW5uZXJ3cmFwLnN0eWxlU2FmZSgnYmFja2dyb3VuZENvbG9yJywxKSwgJ3doaXRlJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybU9yaWdpbjogJzAgMTVweCAwJ1xuXHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRhbmltYXRpb246ICc0LjI1cyBlYXNlLWluIGNoZWNrbWFya1JvdGF0ZVBsYWNlaG9sZGVyJ1xuXHRcdFx0XHRcdFx0JGludmFsaWQ6XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJydcblx0XHRcdF1cblx0XHRcdFxuXHRcdFx0WydkaXYnXG5cdFx0XHRcdHJlZjogJ2NoZWNrbWFya19saW5lV3JhcHBlcidcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0JGZpbGxlZDogJGludmFsaWQ6XG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0XHRcdFx0ekluZGV4OiAyXG5cdFx0XHRcdFx0XHRhbmltYXRpb246ICcwLjU1cyBjaGVja21hcmtBbmltYXRlRXJyb3InXG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm1PcmlnaW46ICc1MCUgMTBweCdcblxuXHRcdFx0XHRbJ2Rpdidcblx0XHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbGluZVNob3J0J1xuXHRcdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdFx0dG9wOiAnMTBweCdcblx0XHRcdFx0XHRcdGxlZnQ6ICczcHgnXG5cdFx0XHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHRcdFx0XHR3aWR0aDogJzhweCdcblx0XHRcdFx0XHRcdGhlaWdodDogJzNweCdcblx0XHRcdFx0XHRcdGJvcmRlclJhZGl1czogJzJweCdcblx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQ09MT1JTLmdyZWVuXG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGUoNDVkZWcpJ1xuXHRcdFx0XHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnMC43NXMgY2hlY2ttYXJrQW5pbWF0ZVN1Y2Nlc3NUaXAnXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdCRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0XHRcdFx0bGVmdDogJzRweCdcblx0XHRcdFx0XHRcdFx0dG9wOiAnOHB4J1xuXHRcdFx0XHRcdFx0XHR3aWR0aDogJzEycHgnXG5cdFx0XHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnJ1xuXHRcdFx0XHRdXG5cblx0XHRcdFx0WydkaXYnXG5cdFx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX2xpbmVMb25nJ1xuXHRcdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdFx0dG9wOiAnOHB4J1xuXHRcdFx0XHRcdFx0cmlnaHQ6ICcycHgnXG5cdFx0XHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHRcdFx0XHR3aWR0aDogJzEycHgnXG5cdFx0XHRcdFx0XHRoZWlnaHQ6ICczcHgnXG5cdFx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICcycHgnXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5ncmVlblxuXHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG5cdFx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0XHRhbmltYXRpb246ICcwLjc1cyBjaGVja21hcmtBbmltYXRlU3VjY2Vzc0xvbmcnXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdCRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0XHRcdFx0dG9wOiAnOHB4J1xuXHRcdFx0XHRcdFx0XHRsZWZ0OiAnNHB4J1xuXHRcdFx0XHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnJ1xuXHRcdFx0XHRdXG5cdFx0XHRdXG5cdFx0XHRcblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfcGxhY2Vob2xkZXInXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0ekluZGV4OiAyXG5cdFx0XHRcdFx0dG9wOiAnLTRweCdcblx0XHRcdFx0XHRsZWZ0OiAnLTNweCdcblx0XHRcdFx0XHR3aWR0aDogJzIwcHgnXG5cdFx0XHRcdFx0aGVpZ2h0OiAnMjBweCdcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICc1MCUnXG5cdFx0XHRcdFx0Ym9yZGVyV2lkdGg6ICczcHgnXG5cdFx0XHRcdFx0Ym9yZGVyU3R5bGU6ICdzb2xpZCdcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogaGVscGVycy5oZXhUb1JHQkEoQ09MT1JTLmdyZWVuLCAwLjQpXG5cdFx0XHRcdFx0JGludmFsaWQ6XG5cdFx0XHRcdFx0XHRib3JkZXJDb2xvcjogaGVscGVycy5oZXhUb1JHQkEoQ09MT1JTLnJlZCwgMC40KVxuXHRcdFx0XVxuXHRcdFx0XG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX3BhdGNoJ1xuXHRcdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0ekluZGV4OiAxXG5cdFx0XHRcdFx0dG9wOiAnLTJweCdcblx0XHRcdFx0XHRsZWZ0OiAnNnB4J1xuXHRcdFx0XHRcdHdpZHRoOiAnNHB4J1xuXHRcdFx0XHRcdGhlaWdodDogJzI4cHgnXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAoZmllbGQpLT4gaGVscGVycy5kZWZhdWx0Q29sb3IgZmllbGQuZWxzLmlubmVyd3JhcC5zdHlsZVNhZmUoJ2JhY2tncm91bmRDb2xvcicsMSksICd3aGl0ZSdcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSdcblx0XHRcdF1cblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPVxuXHRwbGFjZWhvbGRlcjogdHJ1ZVxuXHR2YWxpZFdoZW5Jc0Nob2ljZTogZmFsc2Vcblx0dmFsaWRXaGVuUmVnZXg6IGZhbHNlXG5cdGF1dG9XaWR0aDogZmFsc2Vcblx0bWF4V2lkdGg6ICcxMDAlJ1xuXHRtaW5XaWR0aDogMlxuXHRoZWlnaHQ6IDQ2XG5cdGNoZWNrbWFyazogdHJ1ZVxuXHRrZXlib2FyZDogJ3RleHQnXG5cdGRyb3Bkb3duOiB7bG9ja1Njcm9sbDpmYWxzZX1cblx0Y2hvaWNlczogbnVsbFxuXHRtaW5MZW5ndGg6IG51bGxcblx0bWF4TGVuZ3RoOiBudWxsXG5cdGlucHV0U2libGluZzogJ2NoZWNrbWFyaydcblx0bWFzazpcblx0XHRwYXR0ZXJuOiBmYWxzZVxuXHRcdHBsYWNlaG9sZGVyOiAnXydcblx0XHRndWlkZTogdHJ1ZVxuXHRcdGN1c3RvbVBhdHRlcm5zOiBmYWxzZSIsImV4cG9ydHMuUkVHRVhfTEVOX1ZBTCA9IC9eXFxkKyg/OlthLXpdfFxcJSkrJC9pXG5leHBvcnRzLlJFR0VYX0RJR0lUUyA9IC9cXGQrJC9cbmV4cG9ydHMuUkVHRVhfU1BBQ0UgPSAvXFxzL1xuZXhwb3J0cy5SRUdFWF9LRUJBQiA9IC8oW0EtWl0pKy9nXG5leHBvcnRzLklNUE9SVEFOVCA9ICdpbXBvcnRhbnQnXG5cbmV4cG9ydHMuUE9TU0lCTEVfUFJFRklYRVMgPSBbXG5cdCd3ZWJraXQnXG5cdCdtb3onXG5cdCdtcydcblx0J28nXG5dXG5leHBvcnRzLlJFUVVJUkVTX1VOSVRfVkFMVUUgPSBbXG5cdCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnXG5cdCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknXG5cdCdibG9jay1zaXplJ1xuXHQnYm9yZGVyLXdpZHRoJ1xuXHQnY29sdW1uUnVsZS13aWR0aCdcblx0J2N4J1xuXHQnY3knXG5cdCdmb250LXNpemUnXG5cdCdncmlkLWNvbHVtbi1nYXAnXG5cdCdncmlkLXJvdy1nYXAnXG5cdCdoZWlnaHQnXG5cdCdpbmxpbmUtc2l6ZSdcblx0J2xpbmUtaGVpZ2h0J1xuXHQnbWluQmxvY2stc2l6ZSdcblx0J21pbi1oZWlnaHQnXG5cdCdtaW4taW5saW5lLXNpemUnXG5cdCdtaW4td2lkdGgnXG5cdCdtYXgtaGVpZ2h0J1xuXHQnbWF4LXdpZHRoJ1xuXHQnb3V0bGluZS1vZmZzZXQnXG5cdCdvdXRsaW5lLXdpZHRoJ1xuXHQncGVyc3BlY3RpdmUnXG5cdCdzaGFwZS1tYXJnaW4nXG5cdCdzdHJva2UtZGFzaG9mZnNldCdcblx0J3N0cm9rZS13aWR0aCdcblx0J3RleHQtaW5kZW50J1xuXHQnd2lkdGgnXG5cdCd3b3JkLXNwYWNpbmcnXG5cdCd0b3AnXG5cdCdib3R0b20nXG5cdCdsZWZ0J1xuXHQncmlnaHQnXG5cdCd4J1xuXHQneSdcbl1cblxuZXhwb3J0cy5RVUFEX1NIT1JUSEFORFMgPSBbXG5cdCdtYXJnaW4nXG5cdCdwYWRkaW5nJ1xuXHQnYm9yZGVyJ1xuXHQnYm9yZGVyLXJhZGl1cydcbl1cbmV4cG9ydHMuRElSRUNUSU9OUyA9IFsndG9wJywnYm90dG9tJywnbGVmdCcsJ3JpZ2h0J11cblxuZXhwb3J0cy5RVUFEX1NIT1JUSEFORFMuZm9yRWFjaCAocHJvcGVydHkpLT5cblx0ZXhwb3J0cy5SRVFVSVJFU19VTklUX1ZBTFVFLnB1c2ggcHJvcGVydHlcblx0Zm9yIGRpcmVjdGlvbiBpbiBleHBvcnRzLkRJUkVDVElPTlNcblx0XHRleHBvcnRzLlJFUVVJUkVTX1VOSVRfVkFMVUUucHVzaCBwcm9wZXJ0eSsnLScrZGlyZWN0aW9uXG5cdHJldHVyblxuXG5cblxuXG5cbiIsImNvbnN0YW50cyA9IGltcG9ydCAnLi9jb25zdGFudHMnXG5zYW1wbGVTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLnN0eWxlXG5cbmhlbHBlcnMgPSBleHBvcnRzXG5cbmhlbHBlcnMuaW5jbHVkZXMgPSAodGFyZ2V0LCBpdGVtKS0+XG5cdHRhcmdldCBhbmQgdGFyZ2V0LmluZGV4T2YoaXRlbSkgaXNudCAtMVxuXG5oZWxwZXJzLmlzSXRlcmFibGUgPSAodGFyZ2V0KS0+XG5cdHRhcmdldCBhbmRcblx0dHlwZW9mIHRhcmdldCBpcyAnb2JqZWN0JyBhbmRcblx0dHlwZW9mIHRhcmdldC5sZW5ndGggaXMgJ251bWJlcicgYW5kXG5cdG5vdCB0YXJnZXQubm9kZVR5cGVcblxuaGVscGVycy50b0tlYmFiQ2FzZSA9IChzdHJpbmcpLT5cblx0c3RyaW5nLnJlcGxhY2UgY29uc3RhbnRzLlJFR0VYX0tFQkFCLCAoZSxsZXR0ZXIpLT4gXCItI3tsZXR0ZXIudG9Mb3dlckNhc2UoKX1cIlxuXG5oZWxwZXJzLmlzUHJvcFN1cHBvcnRlZCA9IChwcm9wZXJ0eSktPlxuXHR0eXBlb2Ygc2FtcGxlU3R5bGVbcHJvcGVydHldIGlzbnQgJ3VuZGVmaW5lZCdcblxuaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkID0gKHByb3BlcnR5LCB2YWx1ZSktPlxuXHRpZiB3aW5kb3cuQ1NTIGFuZCB3aW5kb3cuQ1NTLnN1cHBvcnRzXG5cdFx0cmV0dXJuIHdpbmRvdy5DU1Muc3VwcG9ydHMocHJvcGVydHksIHZhbHVlKVxuXHRlbHNlXG5cdFx0c2FtcGxlU3R5bGVbcHJvcGVydHldID0gdmFsdWVcblx0XHRyZXR1cm4gc2FtcGxlU3R5bGVbcHJvcGVydHldIGlzICcnK3ZhbHVlXG5cbmhlbHBlcnMuZ2V0UHJlZml4ID0gKHByb3BlcnR5LCBza2lwSW5pdGlhbENoZWNrKS0+XG5cdGlmIHNraXBJbml0aWFsQ2hlY2sgb3Igbm90IGhlbHBlcnMuaXNQcm9wU3VwcG9ydGVkKHByb3BlcnR5KVxuXHRcdGZvciBwcmVmaXggaW4gY29uc3RhbnRzLlBPU1NJQkxFX1BSRUZJWEVTXG5cdFx0XHQjIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5cdFx0XHRyZXR1cm4gXCItI3twcmVmaXh9LVwiIGlmIGhlbHBlcnMuaXNQcm9wU3VwcG9ydGVkKFwiLSN7cHJlZml4fS0je3Byb3BlcnR5fVwiKVxuXHRcblx0cmV0dXJuICcnXG5cbmhlbHBlcnMubm9ybWFsaXplUHJvcGVydHkgPSAocHJvcGVydHkpLT5cdFxuXHRwcm9wZXJ0eSA9IGhlbHBlcnMudG9LZWJhYkNhc2UocHJvcGVydHkpXG5cdFxuXHRpZiBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZChwcm9wZXJ0eSlcblx0XHRyZXR1cm4gcHJvcGVydHlcblx0ZWxzZVxuXHRcdHJldHVybiBcIiN7aGVscGVycy5nZXRQcmVmaXgocHJvcGVydHksdHJ1ZSl9I3twcm9wZXJ0eX1cIlxuXG5oZWxwZXJzLm5vcm1hbGl6ZVZhbHVlID0gKHByb3BlcnR5LCB2YWx1ZSktPlxuXHRpZiBoZWxwZXJzLmluY2x1ZGVzKGNvbnN0YW50cy5SRVFVSVJFU19VTklUX1ZBTFVFLCBwcm9wZXJ0eSkgYW5kIHZhbHVlIGlzbnQgbnVsbFxuXHRcdHZhbHVlID0gJycrdmFsdWVcblx0XHRpZiAgY29uc3RhbnRzLlJFR0VYX0RJR0lUUy50ZXN0KHZhbHVlKSBhbmRcblx0XHRcdG5vdCBjb25zdGFudHMuUkVHRVhfTEVOX1ZBTC50ZXN0KHZhbHVlKSBhbmRcblx0XHRcdG5vdCBjb25zdGFudHMuUkVHRVhfU1BBQ0UudGVzdCh2YWx1ZSlcblx0XHRcdFx0dmFsdWUgKz0gaWYgcHJvcGVydHkgaXMgJ2xpbmUtaGVpZ2h0JyB0aGVuICdlbScgZWxzZSAncHgnXG5cblx0cmV0dXJuIHZhbHVlXG5cblxuaGVscGVycy5zb3J0ID0gKGFycmF5KS0+XG5cdGlmIGFycmF5Lmxlbmd0aCA8IDJcblx0XHRyZXR1cm4gYXJyYXlcblx0ZWxzZVxuXHRcdHBpdm90ID0gYXJyYXlbMF07IGxlc3MgPSBbXTsgZ3JlYXQgPSBbXTsgbGVuID0gYXJyYXkubGVuZ3RoOyBpID0gMDtcblx0XHRcblx0XHR3aGlsZSArK2kgaXNudCBsZW5cblx0XHRcdGlmIGFycmF5W2ldIDw9IHBpdm90XG5cdFx0XHRcdGxlc3MucHVzaChhcnJheVtpXSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0Z3JlYXQucHVzaChhcnJheVtpXSlcblxuXHRcdHJldHVybiBoZWxwZXJzLnNvcnQobGVzcykuY29uY2F0KHBpdm90LCBoZWxwZXJzLnNvcnQoZ3JlYXQpKVxuXG5cbmhlbHBlcnMuaGFzaCA9IChzdHJpbmcpLT5cblx0aGFzaCA9IDUzODE7IGkgPSAtMTsgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuXHRcblx0d2hpbGUgKytpIGlzbnQgc3RyaW5nLmxlbmd0aFxuXHRcdGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cdFx0aGFzaCB8PSAwXG5cblx0cmV0dXJuICdfJysoaWYgaGFzaCA8IDAgdGhlbiBoYXNoICogLTIgZWxzZSBoYXNoKVxuXG5cbmhlbHBlcnMucnVsZVRvU3RyaW5nID0gKHJ1bGUsIGltcG9ydGFudCktPlxuXHRvdXRwdXQgPSAnJ1xuXHRwcm9wcyA9IGhlbHBlcnMuc29ydChPYmplY3Qua2V5cyhydWxlKSlcblx0XG5cdGZvciBwcm9wIGluIHByb3BzXG5cdFx0aWYgdHlwZW9mIHJ1bGVbcHJvcF0gaXMgJ3N0cmluZycgb3IgdHlwZW9mIHJ1bGVbcHJvcF0gaXMgJ251bWJlcidcblx0XHRcdHByb3BlcnR5ID0gaGVscGVycy5ub3JtYWxpemVQcm9wZXJ0eShwcm9wKVxuXHRcdFx0dmFsdWUgPSBoZWxwZXJzLm5vcm1hbGl6ZVZhbHVlKHByb3BlcnR5LCBydWxlW3Byb3BdKVxuXHRcdFx0dmFsdWUgKz0gXCIgIWltcG9ydGFudFwiIGlmIGltcG9ydGFudFxuXHRcdFx0b3V0cHV0ICs9IFwiI3twcm9wZXJ0eX06I3t2YWx1ZX07XCJcblx0XG5cdHJldHVybiBvdXRwdXRcblxuaGVscGVycy5pbmxpbmVTdHlsZUNvbmZpZyA9IHN0eWxlQ29uZmlnID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuaGVscGVycy5pbmxpbmVTdHlsZSA9IChydWxlLCB2YWx1ZVRvU3RvcmUsIGxldmVsKS0+XG5cdGlmIG5vdCBjb25maWc9c3R5bGVDb25maWdbbGV2ZWxdXG5cdFx0c3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcblx0XHRzdHlsZUVsLmlkID0gXCJxdWlja2NzcyN7bGV2ZWwgb3IgJyd9XCJcblx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpXG5cdFx0c3R5bGVDb25maWdbbGV2ZWxdID0gY29uZmlnID0gZWw6c3R5bGVFbCwgY29udGVudDonJywgY2FjaGU6T2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcblx0dW5sZXNzIGNvbmZpZy5jYWNoZVtydWxlXVxuXHRcdGNvbmZpZy5jYWNoZVtydWxlXSA9IHZhbHVlVG9TdG9yZSBvciB0cnVlXG5cdFx0Y29uZmlnLmVsLnRleHRDb250ZW50ID0gY29uZmlnLmNvbnRlbnQgKz0gcnVsZVxuXHRcblx0cmV0dXJuXG5cblxuaGVscGVycy5jbGVhcklubGluZVN0eWxlID0gKGxldmVsKS0+IGlmIGNvbmZpZyA9IHN0eWxlQ29uZmlnW2xldmVsXVxuXHRyZXR1cm4gaWYgbm90IGNvbmZpZy5jb250ZW50XG5cdGNvbmZpZy5lbC50ZXh0Q29udGVudCA9IGNvbmZpZy5jb250ZW50ID0gJydcblx0a2V5cyA9IE9iamVjdC5rZXlzKGNvbmZpZy5jYWNoZSlcblx0Y29uZmlnLmNhY2hlW2tleV0gPSBudWxsIGZvciBrZXkgaW4ga2V5c1xuXHRyZXR1cm5cblxuXG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPVxuXHRkZWZpbmVkOiAoc3ViamVjdCktPiBzdWJqZWN0IGlzbnQgdW5kZWZpbmVkXG5cdFxuXHRhcnJheTogKHN1YmplY3QpLT4gc3ViamVjdCBpbnN0YW5jZW9mIEFycmF5XG5cdFxuXHRvYmplY3Q6IChzdWJqZWN0KS0+IHR5cGVvZiBzdWJqZWN0IGlzICdvYmplY3QnIGFuZCBzdWJqZWN0ICMgMm5kIGNoZWNrIGlzIHRvIHRlc3QgYWdhaW5zdCAnbnVsbCcgdmFsdWVzXG5cblx0b2JqZWN0UGxhaW46IChzdWJqZWN0KS0+IGV4cG9ydHMub2JqZWN0KHN1YmplY3QpIGFuZCBPYmplY3Q6OnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgaXMgJ1tvYmplY3QgT2JqZWN0XScgYW5kIHN1YmplY3QuY29uc3RydWN0b3IgaXMgT2JqZWN0XG5cblx0c3RyaW5nOiAoc3ViamVjdCktPiB0eXBlb2Ygc3ViamVjdCBpcyAnc3RyaW5nJ1xuXHRcblx0bnVtYmVyOiAoc3ViamVjdCktPiB0eXBlb2Ygc3ViamVjdCBpcyAnbnVtYmVyJyBhbmQgbm90IGlzTmFOKHN1YmplY3QpXG5cblx0bnVtYmVyTG9vc2U6IChzdWJqZWN0KS0+IGV4cG9ydHMubnVtYmVyKHN1YmplY3QpIG9yIGV4cG9ydHMuc3RyaW5nKHN1YmplY3QpIGFuZCBleHBvcnRzLm51bWJlcihOdW1iZXIgc3ViamVjdClcblx0XG5cdGZ1bmN0aW9uOiAoc3ViamVjdCktPiB0eXBlb2Ygc3ViamVjdCBpcyAnZnVuY3Rpb24nXG5cblx0aXRlcmFibGU6IChzdWJqZWN0KS0+IGV4cG9ydHMub2JqZWN0KHN1YmplY3QpIGFuZCBleHBvcnRzLm51bWJlcihzdWJqZWN0Lmxlbmd0aCkiLCJtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBcblx0ZG9tRG9jOiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0Lm5vZGVUeXBlIGlzIDlcblxuXHRkb21FbDogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5ub2RlVHlwZSBpcyAxXG5cblx0ZG9tVGV4dDogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5ub2RlVHlwZSBpcyAzXG5cblx0ZG9tTm9kZTogKHN1YmplY3QpLT4gZXhwb3J0cy5kb21FbChzdWJqZWN0KSBvciBleHBvcnRzLmRvbVRleHQoc3ViamVjdClcblxuXHRkb21UZXh0YXJlYTogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5ub2RlTmFtZSBpcyAnVEVYVEFSRUEnXG5cdFxuXHRkb21JbnB1dDogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5ub2RlTmFtZSBpcyAnSU5QVVQnXG5cdFxuXHRkb21TZWxlY3Q6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3Qubm9kZU5hbWUgaXMgJ1NFTEVDVCdcblx0XG5cdGRvbUZpZWxkOiAoc3ViamVjdCktPiBleHBvcnRzLmRvbUlucHV0KHN1YmplY3QpIG9yIGV4cG9ydHMuZG9tVGV4dGFyZWEoc3ViamVjdCkgb3IgZXhwb3J0cy5kb21TZWxlY3Qoc3ViamVjdCkiLCJleHBvcnRzLlJFR0VYX0xFTl9WQUwgPSAvXlxcZCsoPzpbYS16XXxcXCUpKyQvaVxuZXhwb3J0cy5SRUdFWF9ESUdJVFMgPSAvXFxkKyQvXG5leHBvcnRzLlJFR0VYX1NQQUNFID0gL1xccy9cbmV4cG9ydHMuUkVHRVhfS0VCQUIgPSAvKFtBLVpdKSsvZ1xuXG5leHBvcnRzLlBPU1NJQkxFX1BSRUZJWEVTID0gW1xuXHQnd2Via2l0J1xuXHQnbW96J1xuXHQnbXMnXG5cdCdvJ1xuXVxuZXhwb3J0cy5SRVFVSVJFU19VTklUX1ZBTFVFID0gW1xuXHQnYmFja2dyb3VuZC1wb3NpdGlvbi14J1xuXHQnYmFja2dyb3VuZC1wb3NpdGlvbi15J1xuXHQnYmxvY2stc2l6ZSdcblx0J2JvcmRlci13aWR0aCdcblx0J2NvbHVtblJ1bGUtd2lkdGgnXG5cdCdjeCdcblx0J2N5J1xuXHQnZm9udC1zaXplJ1xuXHQnZ3JpZC1jb2x1bW4tZ2FwJ1xuXHQnZ3JpZC1yb3ctZ2FwJ1xuXHQnaGVpZ2h0J1xuXHQnaW5saW5lLXNpemUnXG5cdCdsaW5lLWhlaWdodCdcblx0J21pbkJsb2NrLXNpemUnXG5cdCdtaW4taGVpZ2h0J1xuXHQnbWluLWlubGluZS1zaXplJ1xuXHQnbWluLXdpZHRoJ1xuXHQnbWF4LWhlaWdodCdcblx0J21heC13aWR0aCdcblx0J291dGxpbmUtb2Zmc2V0J1xuXHQnb3V0bGluZS13aWR0aCdcblx0J3BlcnNwZWN0aXZlJ1xuXHQnc2hhcGUtbWFyZ2luJ1xuXHQnc3Ryb2tlLWRhc2hvZmZzZXQnXG5cdCdzdHJva2Utd2lkdGgnXG5cdCd0ZXh0LWluZGVudCdcblx0J3dpZHRoJ1xuXHQnd29yZC1zcGFjaW5nJ1xuXHQndG9wJ1xuXHQnYm90dG9tJ1xuXHQnbGVmdCdcblx0J3JpZ2h0J1xuXHQneCdcblx0J3knXG5dXG5cbmV4cG9ydHMuUVVBRF9TSE9SVEhBTkRTID0gW1xuXHQnbWFyZ2luJ1xuXHQncGFkZGluZydcblx0J2JvcmRlcidcblx0J2JvcmRlci1yYWRpdXMnXG5dXG5leHBvcnRzLkRJUkVDVElPTlMgPSBbJ3RvcCcsJ2JvdHRvbScsJ2xlZnQnLCdyaWdodCddXG5cbmV4cG9ydHMuUVVBRF9TSE9SVEhBTkRTLmZvckVhY2ggKHByb3BlcnR5KS0+XG5cdGV4cG9ydHMuUkVRVUlSRVNfVU5JVF9WQUxVRS5wdXNoIHByb3BlcnR5XG5cdGZvciBkaXJlY3Rpb24gaW4gZXhwb3J0cy5ESVJFQ1RJT05TXG5cdFx0ZXhwb3J0cy5SRVFVSVJFU19VTklUX1ZBTFVFLnB1c2ggcHJvcGVydHkrJy0nK2RpcmVjdGlvblxuXHRyZXR1cm5cblxuXG5cblxuXG4iLCJjb25zdGFudHMgPSBpbXBvcnQgJy4vY29uc3RhbnRzJ1xuc2FtcGxlU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKS5zdHlsZVxuXG5oZWxwZXJzID0gZXhwb3J0c1xuXG5oZWxwZXJzLmluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPlxuXHR0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuaGVscGVycy5pc0l0ZXJhYmxlID0gKHRhcmdldCktPlxuXHR0YXJnZXQgYW5kXG5cdHR5cGVvZiB0YXJnZXQgaXMgJ29iamVjdCcgYW5kXG5cdHR5cGVvZiB0YXJnZXQubGVuZ3RoIGlzICdudW1iZXInIGFuZFxuXHRub3QgdGFyZ2V0Lm5vZGVUeXBlXG5cbmhlbHBlcnMudG9LZWJhYkNhc2UgPSAoc3RyaW5nKS0+XG5cdHN0cmluZy5yZXBsYWNlIGNvbnN0YW50cy5SRUdFWF9LRUJBQiwgKGUsbGV0dGVyKS0+IFwiLSN7bGV0dGVyLnRvTG93ZXJDYXNlKCl9XCJcblxuaGVscGVycy5pc1Byb3BTdXBwb3J0ZWQgPSAocHJvcGVydHkpLT5cblx0dHlwZW9mIHNhbXBsZVN0eWxlW3Byb3BlcnR5XSBpc250ICd1bmRlZmluZWQnXG5cbmhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZCA9IChwcm9wZXJ0eSwgdmFsdWUpLT5cblx0aWYgd2luZG93LkNTUyBhbmQgd2luZG93LkNTUy5zdXBwb3J0c1xuXHRcdHJldHVybiB3aW5kb3cuQ1NTLnN1cHBvcnRzKHByb3BlcnR5LCB2YWx1ZSlcblx0ZWxzZVxuXHRcdHNhbXBsZVN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlXG5cdFx0cmV0dXJuIHNhbXBsZVN0eWxlW3Byb3BlcnR5XSBpcyAnJyt2YWx1ZVxuXG5oZWxwZXJzLmdldFByZWZpeCA9IChwcm9wZXJ0eSwgc2tpcEluaXRpYWxDaGVjayktPlxuXHRpZiBza2lwSW5pdGlhbENoZWNrIG9yIG5vdCBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZChwcm9wZXJ0eSlcblx0XHRmb3IgcHJlZml4IGluIGNvbnN0YW50cy5QT1NTSUJMRV9QUkVGSVhFU1xuXHRcdFx0IyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuXHRcdFx0cmV0dXJuIFwiLSN7cHJlZml4fS1cIiBpZiBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZChcIi0je3ByZWZpeH0tI3twcm9wZXJ0eX1cIilcblx0XG5cdHJldHVybiAnJ1xuXG5oZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5ID0gKHByb3BlcnR5KS0+XHRcblx0cHJvcGVydHkgPSBoZWxwZXJzLnRvS2ViYWJDYXNlKHByb3BlcnR5KVxuXHRcblx0aWYgaGVscGVycy5pc1Byb3BTdXBwb3J0ZWQocHJvcGVydHkpXG5cdFx0cmV0dXJuIHByb3BlcnR5XG5cdGVsc2Vcblx0XHRyZXR1cm4gXCIje2hlbHBlcnMuZ2V0UHJlZml4KHByb3BlcnR5LHRydWUpfSN7cHJvcGVydHl9XCJcblxuaGVscGVycy5ub3JtYWxpemVWYWx1ZSA9IChwcm9wZXJ0eSwgdmFsdWUpLT5cblx0aWYgaGVscGVycy5pbmNsdWRlcyhjb25zdGFudHMuUkVRVUlSRVNfVU5JVF9WQUxVRSwgcHJvcGVydHkpIGFuZCB2YWx1ZSBpc250IG51bGxcblx0XHR2YWx1ZSA9ICcnK3ZhbHVlXG5cdFx0aWYgIGNvbnN0YW50cy5SRUdFWF9ESUdJVFMudGVzdCh2YWx1ZSkgYW5kXG5cdFx0XHRub3QgY29uc3RhbnRzLlJFR0VYX0xFTl9WQUwudGVzdCh2YWx1ZSkgYW5kXG5cdFx0XHRub3QgY29uc3RhbnRzLlJFR0VYX1NQQUNFLnRlc3QodmFsdWUpXG5cdFx0XHRcdHZhbHVlICs9IGlmIHByb3BlcnR5IGlzICdsaW5lLWhlaWdodCcgdGhlbiAnZW0nIGVsc2UgJ3B4J1xuXG5cdHJldHVybiB2YWx1ZVxuXG5cbmhlbHBlcnMuc29ydCA9IChhcnJheSktPlxuXHRpZiBhcnJheS5sZW5ndGggPCAyXG5cdFx0cmV0dXJuIGFycmF5XG5cdGVsc2Vcblx0XHRwaXZvdCA9IGFycmF5WzBdOyBsZXNzID0gW107IGdyZWF0ID0gW107IGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA9IDA7XG5cdFx0XG5cdFx0d2hpbGUgKytpIGlzbnQgbGVuXG5cdFx0XHRpZiBhcnJheVtpXSA8PSBwaXZvdFxuXHRcdFx0XHRsZXNzLnB1c2goYXJyYXlbaV0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGdyZWF0LnB1c2goYXJyYXlbaV0pXG5cblx0XHRyZXR1cm4gaGVscGVycy5zb3J0KGxlc3MpLmNvbmNhdChwaXZvdCwgaGVscGVycy5zb3J0KGdyZWF0KSlcblxuXG5oZWxwZXJzLmhhc2ggPSAoc3RyaW5nKS0+XG5cdGhhc2ggPSA1MzgxOyBpID0gLTE7IGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcblx0XG5cdHdoaWxlICsraSBpc250IHN0cmluZy5sZW5ndGhcblx0XHRoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBzdHJpbmcuY2hhckNvZGVBdChpKVxuXHRcdGhhc2ggfD0gMFxuXG5cdHJldHVybiAnXycrKGlmIGhhc2ggPCAwIHRoZW4gaGFzaCAqIC0yIGVsc2UgaGFzaClcblxuXG5oZWxwZXJzLnJ1bGVUb1N0cmluZyA9IChydWxlKS0+XG5cdG91dHB1dCA9ICcnXG5cdHByb3BzID0gaGVscGVycy5zb3J0KE9iamVjdC5rZXlzKHJ1bGUpKVxuXHRcblx0Zm9yIHByb3AgaW4gcHJvcHNcblx0XHRpZiB0eXBlb2YgcnVsZVtwcm9wXSBpcyAnc3RyaW5nJyBvciB0eXBlb2YgcnVsZVtwcm9wXSBpcyAnbnVtYmVyJ1xuXHRcdFx0cHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5KHByb3ApXG5cdFx0XHR2YWx1ZSA9IGhlbHBlcnMubm9ybWFsaXplVmFsdWUocHJvcGVydHksIHJ1bGVbcHJvcF0pXG5cdFx0XHRvdXRwdXQgKz0gXCIje3Byb3BlcnR5fToje3ZhbHVlfTtcIlxuXHRcblx0cmV0dXJuIG91dHB1dFxuXG5oZWxwZXJzLmlubGluZVN0eWxlQ29uZmlnID0gc3R5bGVDb25maWcgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5oZWxwZXJzLmlubGluZVN0eWxlID0gKHJ1bGUsIHZhbHVlVG9TdG9yZSwgbGV2ZWwpLT5cblx0aWYgbm90IGNvbmZpZz1zdHlsZUNvbmZpZ1tsZXZlbF1cblx0XHRzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuXHRcdHN0eWxlRWwuaWQgPSBcInF1aWNrY3NzI3tsZXZlbCBvciAnJ31cIlxuXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbClcblx0XHRzdHlsZUNvbmZpZ1tsZXZlbF0gPSBjb25maWcgPSBlbDpzdHlsZUVsLCBjb250ZW50OicnLCBjYWNoZTpPYmplY3QuY3JlYXRlKG51bGwpXG5cdFxuXHR1bmxlc3MgY29uZmlnLmNhY2hlW3J1bGVdXG5cdFx0Y29uZmlnLmNhY2hlW3J1bGVdID0gdmFsdWVUb1N0b3JlIG9yIHRydWVcblx0XHRjb25maWcuZWwudGV4dENvbnRlbnQgPSBjb25maWcuY29udGVudCArPSBydWxlXG5cdFxuXHRyZXR1cm5cblxuXG5oZWxwZXJzLmNsZWFySW5saW5lU3R5bGUgPSAobGV2ZWwpLT4gaWYgY29uZmlnID0gc3R5bGVDb25maWdbbGV2ZWxdXG5cdHJldHVybiBpZiBub3QgY29uZmlnLmNvbnRlbnRcblx0Y29uZmlnLmVsLnRleHRDb250ZW50ID0gY29uZmlnLmNvbnRlbnQgPSAnJ1xuXHRrZXlzID0gT2JqZWN0LmtleXMoY29uZmlnLmNhY2hlKVxuXHRjb25maWcuY2FjaGVba2V5XSA9IG51bGwgZm9yIGtleSBpbiBrZXlzXG5cdHJldHVyblxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5TVkcgPSBpbXBvcnQgJy4uLy4uL3N2ZydcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5cbmV4cG9ydCBkZWZhdWx0IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnZHJvcGRvd24nXG5cdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdHpJbmRleDogMTBcblx0XHRcdG92ZXJmbG93OiAnaGlkZGVuJ1xuXHRcdFx0dG9wOiAoZHJvcGRvd24pLT4gaWYgZHJvcGRvd24uZmllbGQudHlwZSBpcyAndGV4dCcgdGhlbiBAcGFyZW50LnJhdy5zdHlsZS5oZWlnaHQgZWxzZSAnLTdweCdcblx0XHRcdGxlZnQ6ICgpLT4gaWYgQHBhcmVudC5yZWN0LmxlZnQgLSA1IDwgMCB0aGVuIDAgZWxzZSAtNVxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHQjIGJhY2tncm91bmRDb2xvcjogaGVscGVycy5oZXhUb1JHQkEoJ2Y2ZjZmNicsIDAuOSlcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNmNmY2ZjYnXG5cdFx0XHRib3hTaGFkb3c6IFwiMHB4IDZweCAxMHB4ICN7aGVscGVycy5oZXhUb1JHQkEoJzAwMDAwMCcsIDAuMzIpfVwiXG5cdFx0XHRib3JkZXJXaWR0aDogJzFweCdcblx0XHRcdGJvcmRlclN0eWxlOiAnc29saWQnXG5cdFx0XHRib3JkZXJDb2xvcjogJyNkMWQxZDEnXG5cdFx0XHRib3JkZXJSYWRpdXM6ICc1cHgnXG5cdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0cGFkZGluZzogJzRweCAwJ1xuXHRcdFx0JGlzT3BlbjogJGhhc1Zpc2libGVDaG9pY2VzOlxuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdF1cbilcblxuZXhwb3J0IGxpc3QgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2xpc3QnXG5cdFx0cGFzc1N0YXRlVG9DaGlsZHJlbjogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHRvdmVyZmxvdzogJ3Njcm9sbCdcblx0XHRcdG92ZXJmbG93U2Nyb2xsaW5nOiAndG91Y2gnXG5cdFx0XHRvdmVyZmxvd1N0eWxlOiAnLW1zLWF1dG9oaWRpbmctc2Nyb2xsYmFyJ1xuXHRdXG4pXG5cbmV4cG9ydCBjaG9pY2UgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHN0eWxlOlxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRmb250U2l6ZTogJzAnXG5cdFx0XHRjb2xvcjogJyMwMDAwMDAnXG5cdFx0XHR1c2VyU2VsZWN0OiAnbm9uZSdcblx0XHRcdGxpbmVIZWlnaHQ6ICcxZW0nXG5cdFx0XHRjdXJzb3I6ICdwb2ludGVyJ1xuXHRcdFx0JHZpc2libGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRcdCR1bmF2YWlsYWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHQkaG92ZXI6XG5cdFx0XHRcdGNvbG9yOiAnI2ZmZmZmZidcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAnIzRDOTZGRidcblxuXHRcdFsnZGl2JyAjIENoZWNrbWFya1xuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHRcdHZlcnRpY2FsQWxpZ246J3RvcCdcblx0XHRcdFx0d2lkdGg6ICcyMHB4J1xuXHRcdFx0XHQjIGhlaWdodDogKCktPiBAcGFyZW50LnJhdy5zdHlsZS5oZWlnaHRcblx0XHRcdFx0IyBsaW5lSGVpZ2h0OiAoKS0+IEBwYXJlbnQuc3R5bGUoJ2hlaWdodCcpXG5cdFx0XHRcdCMgZm9udFNpemU6ICgpLT4gQHBhcmVudC5zdHlsZSgnaGVpZ2h0Jylcblx0XHRcdFx0bGluZUhlaWdodDogJzIwcHgnXG5cdFx0XHRcdGZvbnRTaXplOiAnMTNweCdcblx0XHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJ1xuXHRcdFx0XHRjb2xvcjogJ2luaGVyaXQnXG5cdFx0XHRcdHN0cm9rZTogJ2N1cnJlbnRDb2xvcidcblx0XHRcdFx0dmlzaWJpbGl0eTogJ2hpZGRlbidcblx0XHRcdFx0JHNlbGVjdGVkOlxuXHRcdFx0XHRcdHZpc2liaWxpdHk6ICd2aXNpYmxlJ1xuXG5cdFx0XHRTVkcuY2hlY2ttYXJrXG5cdFx0XVxuXHRcdFxuXHRcdFsnZGl2JyAjIFRleHRcblx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuXHRcdFx0XHRvdmVyZmxvdzogJ2hpZGRlbidcblx0XHRcdFx0dGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnXG5cdFx0XHRcdHdoaXRlU3BhY2U6ICdub3dyYXAnXG5cdFx0XHRcdHdvcmRXcmFwOiAnbm9ybWFsJ1xuXHRcdFx0XHRtYXhXaWR0aDogKCktPiBcImNhbGMoMTAwJSAtICN7QHByZXYuc3R5bGVTYWZlICd3aWR0aCcsIHRydWV9KVwiXG5cdFx0XHRcdHBhZGRpbmdSaWdodDogJzEwcHgnXG5cdFx0XHRcdGxpbmVIZWlnaHQ6ICcyMHB4J1xuXHRcdFx0XHRmb250U2l6ZTogJzExcHgnXG5cdFx0XHRcdGZvbnRGYW1pbHk6IChkcm9wZG93biktPiBkcm9wZG93bi5zZXR0aW5ncy5mb250RmFtaWx5XG5cdFx0XHRcdGNvbG9yOiAnaW5oZXJpdCdcblx0XHRcdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCdcblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IHNjcm9sbEluZGljYXRvclVwID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdzY3JvbGxJbmRpY2F0b3JVcCdcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHR0b3A6IDBcblx0XHRcdGxlZnQ6IDBcblx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMjBweCdcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNmNmY2ZjYnXG5cdFx0XHRjb2xvcjogJyMwMDAwMDAnXG5cdFx0XHR0ZXh0QWxpZ246ICdjZW50ZXInXG5cdFx0XHQkdmlzaWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXG5cdFx0WydkaXYnXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0dG9wOiAnNTAlJ1xuXHRcdFx0XHRsZWZ0OiAwXG5cdFx0XHRcdHJpZ2h0OiAwXG5cdFx0XHRcdHdpZHRoOiAnMTVweCdcblx0XHRcdFx0aGVpZ2h0OiAnMTVweCdcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0XHRtYXJnaW46ICcwIGF1dG8nXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknXG5cdFxuXHRcdFx0U1ZHLmNhcmV0VXBcblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IHNjcm9sbEluZGljYXRvckRvd24gPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ3Njcm9sbEluZGljYXRvckRvd24nXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0Ym90dG9tOiAwXG5cdFx0XHRsZWZ0OiAwXG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzIwcHgnXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjZjZmNmY2J1xuXHRcdFx0Y29sb3I6ICcjMDAwMDAwJ1xuXHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJ1xuXHRcdFx0JHZpc2libGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblxuXHRcdFsnZGl2J1xuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdHRvcDogJzUwJSdcblx0XHRcdFx0bGVmdDogMFxuXHRcdFx0XHRyaWdodDogMFxuXHRcdFx0XHR3aWR0aDogJzE1cHgnXG5cdFx0XHRcdGhlaWdodDogJzE1cHgnXG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRcdFx0bWFyZ2luOiAnMCBhdXRvJ1xuXHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJ1xuXG5cdFx0XHRTVkcuY2FyZXREb3duXG5cdFx0XVxuXHRdXG4pXG5cbmV4cG9ydCBoZWxwID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdoZWxwJ1xuXHRcdHN0eWxlOlxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRib3JkZXJUb3A6ICcycHggc29saWQgcmdiYSgwLDAsMCwwLjA1KSdcblx0XHRcdHBhZGRpbmc6ICc0cHggMTJweCAxcHgnXG5cdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMC41KSdcblx0XHRcdGZvbnRXZWlnaHQ6ICc1MDAnXG5cdFx0XHRmb250U2l6ZTogJzExcHgnXG5cdFx0XHR1c2VyU2VsZWN0OiAnbm9uZSdcblx0XHRcdCRzaG93SGVscDpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRdXG4pXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBcblx0bWF4SGVpZ2h0OiAzMDBcblx0bXVsdGlwbGU6IGZhbHNlXG5cdGxvY2tTY3JvbGw6IHRydWVcblx0dHlwZUJ1ZmZlcjogZmFsc2Vcblx0aGVscDogJydcblx0dGVtcGxhdGVzOiB7fSIsIiFmdW5jdGlvbihlLHIpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXIoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLHIpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMudGV4dE1hc2tDb3JlPXIoKTplLnRleHRNYXNrQ29yZT1yKCl9KHRoaXMsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcihuKXtpZih0W25dKXJldHVybiB0W25dLmV4cG9ydHM7dmFyIG89dFtuXT17ZXhwb3J0czp7fSxpZDpuLGxvYWRlZDohMX07cmV0dXJuIGVbbl0uY2FsbChvLmV4cG9ydHMsbyxvLmV4cG9ydHMsciksby5sb2FkZWQ9ITAsby5leHBvcnRzfXZhciB0PXt9O3JldHVybiByLm09ZSxyLmM9dCxyLnA9XCJcIixyKDApfShbZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntkZWZhdWx0OmV9fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBvPXQoMyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJjb25mb3JtVG9NYXNrXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG4obykuZGVmYXVsdH19KTt2YXIgaT10KDIpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiYWRqdXN0Q2FyZXRQb3NpdGlvblwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBuKGkpLmRlZmF1bHR9fSk7dmFyIGE9dCg1KTtPYmplY3QuZGVmaW5lUHJvcGVydHkocixcImNyZWF0ZVRleHRNYXNrSW5wdXRFbGVtZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG4oYSkuZGVmYXVsdH19KX0sZnVuY3Rpb24oZSxyKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkocixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxyLnBsYWNlaG9sZGVyQ2hhcj1cIl9cIn0sZnVuY3Rpb24oZSxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KGUpe3ZhciByPWUucHJldmlvdXNDb25mb3JtZWRWYWx1ZSx0PXZvaWQgMD09PXI/bzpyLGk9ZS5wcmV2aW91c1BsYWNlaG9sZGVyLGE9dm9pZCAwPT09aT9vOmksdT1lLmN1cnJlbnRDYXJldFBvc2l0aW9uLGw9dm9pZCAwPT09dT8wOnUscz1lLmNvbmZvcm1lZFZhbHVlLGY9ZS5yYXdWYWx1ZSxkPWUucGxhY2Vob2xkZXJDaGFyLGM9ZS5wbGFjZWhvbGRlcix2PWUuaW5kZXhlc09mUGlwZWRDaGFycyxwPXZvaWQgMD09PXY/bjp2LGg9ZS5jYXJldFRyYXBJbmRleGVzLGc9dm9pZCAwPT09aD9uOmg7aWYoMD09PWwpcmV0dXJuIDA7dmFyIG09Zi5sZW5ndGgseT10Lmxlbmd0aCxiPWMubGVuZ3RoLEM9cy5sZW5ndGgsUD1tLXkseD1QPjAsTz0wPT09eSxrPVA+MSYmIXgmJiFPO2lmKGspcmV0dXJuIGw7dmFyIGo9eCYmKHQ9PT1zfHxzPT09YyksTT0wLFQ9dm9pZCAwLHc9dm9pZCAwO2lmKGopTT1sLVA7ZWxzZXt2YXIgXz1zLnRvTG93ZXJDYXNlKCksVj1mLnRvTG93ZXJDYXNlKCksUz1WLnN1YnN0cigwLGwpLnNwbGl0KG8pLE49Uy5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIF8uaW5kZXhPZihlKSE9PS0xfSk7dz1OW04ubGVuZ3RoLTFdO3ZhciBFPWEuc3Vic3RyKDAsTi5sZW5ndGgpLnNwbGl0KG8pLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZSE9PWR9KS5sZW5ndGgsQT1jLnN1YnN0cigwLE4ubGVuZ3RoKS5zcGxpdChvKS5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIGUhPT1kfSkubGVuZ3RoLFI9QSE9PUUsST12b2lkIDAhPT1hW04ubGVuZ3RoLTFdJiZ2b2lkIDAhPT1jW04ubGVuZ3RoLTJdJiZhW04ubGVuZ3RoLTFdIT09ZCYmYVtOLmxlbmd0aC0xXSE9PWNbTi5sZW5ndGgtMV0mJmFbTi5sZW5ndGgtMV09PT1jW04ubGVuZ3RoLTJdOyF4JiYoUnx8SSkmJkU+MCYmYy5pbmRleE9mKHcpPi0xJiZ2b2lkIDAhPT1mW2xdJiYoVD0hMCx3PWZbbF0pO2Zvcih2YXIgSj1wLm1hcChmdW5jdGlvbihlKXtyZXR1cm4gX1tlXX0pLHE9Si5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIGU9PT13fSkubGVuZ3RoLEY9Ti5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIGU9PT13fSkubGVuZ3RoLEw9Yy5zdWJzdHIoMCxjLmluZGV4T2YoZCkpLnNwbGl0KG8pLmZpbHRlcihmdW5jdGlvbihlLHIpe3JldHVybiBlPT09dyYmZltyXSE9PWV9KS5sZW5ndGgsVz1MK0YrcSsoVD8xOjApLHo9MCxCPTA7QjxDO0IrKyl7dmFyIEQ9X1tCXTtpZihNPUIrMSxEPT09dyYmeisrLHo+PVcpYnJlYWt9fWlmKHgpe2Zvcih2YXIgRz1NLEg9TTtIPD1iO0grKylpZihjW0hdPT09ZCYmKEc9SCksY1tIXT09PWR8fGcuaW5kZXhPZihIKSE9PS0xfHxIPT09YilyZXR1cm4gR31lbHNlIGlmKFQpe2Zvcih2YXIgSz1NLTE7Sz49MDtLLS0paWYoc1tLXT09PXd8fGcuaW5kZXhPZihLKSE9PS0xfHwwPT09SylyZXR1cm4gS31lbHNlIGZvcih2YXIgUT1NO1E+PTA7US0tKWlmKGNbUS0xXT09PWR8fGcuaW5kZXhPZihRKSE9PS0xfHwwPT09USlyZXR1cm4gUX1PYmplY3QuZGVmaW5lUHJvcGVydHkocixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxyLmRlZmF1bHQ9dDt2YXIgbj1bXSxvPVwiXCJ9LGZ1bmN0aW9uKGUscix0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOmEscj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06YSx0PWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXTp7fSxuPXQuZ3VpZGUsdT12b2lkIDA9PT1ufHxuLGw9dC5wcmV2aW91c0NvbmZvcm1lZFZhbHVlLHM9dm9pZCAwPT09bD9hOmwsZj10LnBsYWNlaG9sZGVyQ2hhcixkPXZvaWQgMD09PWY/aS5wbGFjZWhvbGRlckNoYXI6ZixjPXQucGxhY2Vob2xkZXIsdj12b2lkIDA9PT1jPygwLG8uY29udmVydE1hc2tUb1BsYWNlaG9sZGVyKShyLGQpOmMscD10LmN1cnJlbnRDYXJldFBvc2l0aW9uLGg9dC5rZWVwQ2hhclBvc2l0aW9ucyxnPXU9PT0hMSYmdm9pZCAwIT09cyxtPWUubGVuZ3RoLHk9cy5sZW5ndGgsYj12Lmxlbmd0aCxDPXIubGVuZ3RoLFA9bS15LHg9UD4wLE89cCsoeD8tUDowKSxrPU8rTWF0aC5hYnMoUCk7aWYoaD09PSEwJiYheCl7Zm9yKHZhciBqPWEsTT1PO008aztNKyspdltNXT09PWQmJihqKz1kKTtlPWUuc2xpY2UoMCxPKStqK2Uuc2xpY2UoTyxtKX1mb3IodmFyIFQ9ZS5zcGxpdChhKS5tYXAoZnVuY3Rpb24oZSxyKXtyZXR1cm57Y2hhcjplLGlzTmV3OnI+PU8mJnI8a319KSx3PW0tMTt3Pj0wO3ctLSl7dmFyIF89VFt3XS5jaGFyO2lmKF8hPT1kKXt2YXIgVj13Pj1PJiZ5PT09QztfPT09dltWP3ctUDp3XSYmVC5zcGxpY2UodywxKX19dmFyIFM9YSxOPSExO2U6Zm9yKHZhciBFPTA7RTxiO0UrKyl7dmFyIEE9dltFXTtpZihBPT09ZCl7aWYoVC5sZW5ndGg+MClmb3IoO1QubGVuZ3RoPjA7KXt2YXIgUj1ULnNoaWZ0KCksST1SLmNoYXIsSj1SLmlzTmV3O2lmKEk9PT1kJiZnIT09ITApe1MrPWQ7Y29udGludWUgZX1pZihyW0VdLnRlc3QoSSkpe2lmKGg9PT0hMCYmSiE9PSExJiZzIT09YSYmdSE9PSExJiZ4KXtmb3IodmFyIHE9VC5sZW5ndGgsRj1udWxsLEw9MDtMPHE7TCsrKXt2YXIgVz1UW0xdO2lmKFcuY2hhciE9PWQmJlcuaXNOZXc9PT0hMSlicmVhaztpZihXLmNoYXI9PT1kKXtGPUw7YnJlYWt9fW51bGwhPT1GPyhTKz1JLFQuc3BsaWNlKEYsMSkpOkUtLX1lbHNlIFMrPUk7Y29udGludWUgZX1OPSEwfWc9PT0hMSYmKFMrPXYuc3Vic3RyKEUsYikpO2JyZWFrfVMrPUF9aWYoZyYmeD09PSExKXtmb3IodmFyIHo9bnVsbCxCPTA7QjxTLmxlbmd0aDtCKyspdltCXT09PWQmJih6PUIpO1M9bnVsbCE9PXo/Uy5zdWJzdHIoMCx6KzEpOmF9cmV0dXJue2NvbmZvcm1lZFZhbHVlOlMsbWV0YTp7c29tZUNoYXJzUmVqZWN0ZWQ6Tn19fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHIuZGVmYXVsdD1uO3ZhciBvPXQoNCksaT10KDEpLGE9XCJcIn0sZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06bCxyPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTp1LnBsYWNlaG9sZGVyQ2hhcjtpZihlLmluZGV4T2YocikhPT0tMSl0aHJvdyBuZXcgRXJyb3IoXCJQbGFjZWhvbGRlciBjaGFyYWN0ZXIgbXVzdCBub3QgYmUgdXNlZCBhcyBwYXJ0IG9mIHRoZSBtYXNrLiBQbGVhc2Ugc3BlY2lmeSBhIGNoYXJhY3RlciB0aGF0IGlzIG5vdCBwcmVzZW50IGluIHlvdXIgbWFzayBhcyB5b3VyIHBsYWNlaG9sZGVyIGNoYXJhY3Rlci5cXG5cXG5cIisoXCJUaGUgcGxhY2Vob2xkZXIgY2hhcmFjdGVyIHRoYXQgd2FzIHJlY2VpdmVkIGlzOiBcIitKU09OLnN0cmluZ2lmeShyKStcIlxcblxcblwiKSsoXCJUaGUgbWFzayB0aGF0IHdhcyByZWNlaXZlZCBpczogXCIrSlNPTi5zdHJpbmdpZnkoZSkpKTtyZXR1cm4gZS5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuIGUgaW5zdGFuY2VvZiBSZWdFeHA/cjplfSkuam9pbihcIlwiKX1mdW5jdGlvbiBvKGUpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBlfHxlIGluc3RhbmNlb2YgU3RyaW5nfWZ1bmN0aW9uIGkoZSl7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIGUmJnZvaWQgMD09PWUubGVuZ3RoJiYhaXNOYU4oZSl9ZnVuY3Rpb24gYShlKXtmb3IodmFyIHI9W10sdD12b2lkIDA7dD1lLmluZGV4T2YocyksdCE9PS0xOylyLnB1c2godCksZS5zcGxpY2UodCwxKTtyZXR1cm57bWFza1dpdGhvdXRDYXJldFRyYXBzOmUsaW5kZXhlczpyfX1PYmplY3QuZGVmaW5lUHJvcGVydHkocixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxyLmNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcj1uLHIuaXNTdHJpbmc9byxyLmlzTnVtYmVyPWksci5wcm9jZXNzQ2FyZXRUcmFwcz1hO3ZhciB1PXQoMSksbD1bXSxzPVwiW11cIn0sZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntkZWZhdWx0OmV9fWZ1bmN0aW9uIG8oZSl7dmFyIHI9e3ByZXZpb3VzQ29uZm9ybWVkVmFsdWU6dm9pZCAwLHByZXZpb3VzUGxhY2Vob2xkZXI6dm9pZCAwfTtyZXR1cm57c3RhdGU6cix1cGRhdGU6ZnVuY3Rpb24odCl7dmFyIG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOmUsbz1uLmlucHV0RWxlbWVudCxzPW4ubWFzayxkPW4uZ3VpZGUsbT1uLnBpcGUsYj1uLnBsYWNlaG9sZGVyQ2hhcixDPXZvaWQgMD09PWI/cC5wbGFjZWhvbGRlckNoYXI6YixQPW4ua2VlcENoYXJQb3NpdGlvbnMseD12b2lkIDAhPT1QJiZQLE89bi5zaG93TWFzayxrPXZvaWQgMCE9PU8mJk87aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQmJih0PW8udmFsdWUpLHQhPT1yLnByZXZpb3VzQ29uZm9ybWVkVmFsdWUpeyhcInVuZGVmaW5lZFwiPT10eXBlb2Ygcz9cInVuZGVmaW5lZFwiOmwocykpPT09eSYmdm9pZCAwIT09cy5waXBlJiZ2b2lkIDAhPT1zLm1hc2smJihtPXMucGlwZSxzPXMubWFzayk7dmFyIGo9dm9pZCAwLE09dm9pZCAwO2lmKHMgaW5zdGFuY2VvZiBBcnJheSYmKGo9KDAsdi5jb252ZXJ0TWFza1RvUGxhY2Vob2xkZXIpKHMsQykpLHMhPT0hMSl7dmFyIFQ9YSh0KSx3PW8uc2VsZWN0aW9uRW5kLF89ci5wcmV2aW91c0NvbmZvcm1lZFZhbHVlLFY9ci5wcmV2aW91c1BsYWNlaG9sZGVyLFM9dm9pZCAwO2lmKChcInVuZGVmaW5lZFwiPT10eXBlb2Ygcz9cInVuZGVmaW5lZFwiOmwocykpPT09aCl7aWYoTT1zKFQse2N1cnJlbnRDYXJldFBvc2l0aW9uOncscHJldmlvdXNDb25mb3JtZWRWYWx1ZTpfLHBsYWNlaG9sZGVyQ2hhcjpDfSksTT09PSExKXJldHVybjt2YXIgTj0oMCx2LnByb2Nlc3NDYXJldFRyYXBzKShNKSxFPU4ubWFza1dpdGhvdXRDYXJldFRyYXBzLEE9Ti5pbmRleGVzO009RSxTPUEsaj0oMCx2LmNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcikoTSxDKX1lbHNlIE09czt2YXIgUj17cHJldmlvdXNDb25mb3JtZWRWYWx1ZTpfLGd1aWRlOmQscGxhY2Vob2xkZXJDaGFyOkMscGlwZTptLHBsYWNlaG9sZGVyOmosY3VycmVudENhcmV0UG9zaXRpb246dyxrZWVwQ2hhclBvc2l0aW9uczp4fSxJPSgwLGMuZGVmYXVsdCkoVCxNLFIpLEo9SS5jb25mb3JtZWRWYWx1ZSxxPShcInVuZGVmaW5lZFwiPT10eXBlb2YgbT9cInVuZGVmaW5lZFwiOmwobSkpPT09aCxGPXt9O3EmJihGPW0oSix1KHtyYXdWYWx1ZTpUfSxSKSksRj09PSExP0Y9e3ZhbHVlOl8scmVqZWN0ZWQ6ITB9OigwLHYuaXNTdHJpbmcpKEYpJiYoRj17dmFsdWU6Rn0pKTt2YXIgTD1xP0YudmFsdWU6SixXPSgwLGYuZGVmYXVsdCkoe3ByZXZpb3VzQ29uZm9ybWVkVmFsdWU6XyxwcmV2aW91c1BsYWNlaG9sZGVyOlYsY29uZm9ybWVkVmFsdWU6TCxwbGFjZWhvbGRlcjpqLHJhd1ZhbHVlOlQsY3VycmVudENhcmV0UG9zaXRpb246dyxwbGFjZWhvbGRlckNoYXI6QyxpbmRleGVzT2ZQaXBlZENoYXJzOkYuaW5kZXhlc09mUGlwZWRDaGFycyxjYXJldFRyYXBJbmRleGVzOlN9KSx6PUw9PT1qJiYwPT09VyxCPWs/ajpnLEQ9ej9COkw7ci5wcmV2aW91c0NvbmZvcm1lZFZhbHVlPUQsci5wcmV2aW91c1BsYWNlaG9sZGVyPWosby52YWx1ZSE9PUQmJihvLnZhbHVlPUQsaShvLFcpKX19fX19ZnVuY3Rpb24gaShlLHIpe2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ9PT1lJiYoYj9DKGZ1bmN0aW9uKCl7cmV0dXJuIGUuc2V0U2VsZWN0aW9uUmFuZ2UocixyLG0pfSwwKTplLnNldFNlbGVjdGlvblJhbmdlKHIscixtKSl9ZnVuY3Rpb24gYShlKXtpZigoMCx2LmlzU3RyaW5nKShlKSlyZXR1cm4gZTtpZigoMCx2LmlzTnVtYmVyKShlKSlyZXR1cm4gU3RyaW5nKGUpO2lmKHZvaWQgMD09PWV8fG51bGw9PT1lKXJldHVybiBnO3Rocm93IG5ldyBFcnJvcihcIlRoZSAndmFsdWUnIHByb3ZpZGVkIHRvIFRleHQgTWFzayBuZWVkcyB0byBiZSBhIHN0cmluZyBvciBhIG51bWJlci4gVGhlIHZhbHVlIHJlY2VpdmVkIHdhczpcXG5cXG4gXCIrSlNPTi5zdHJpbmdpZnkoZSkpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciB1PU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKGUpe2Zvcih2YXIgcj0xO3I8YXJndW1lbnRzLmxlbmd0aDtyKyspe3ZhciB0PWFyZ3VtZW50c1tyXTtmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSl9cmV0dXJuIGV9LGw9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX07ci5kZWZhdWx0PW87dmFyIHM9dCgyKSxmPW4ocyksZD10KDMpLGM9bihkKSx2PXQoNCkscD10KDEpLGg9XCJmdW5jdGlvblwiLGc9XCJcIixtPVwibm9uZVwiLHk9XCJvYmplY3RcIixiPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBuYXZpZ2F0b3ImJi9BbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxDPVwidW5kZWZpbmVkXCIhPXR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWU/cmVxdWVzdEFuaW1hdGlvbkZyYW1lOnNldFRpbWVvdXR9XSl9KTsiLCIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSx0KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLnRleHRNYXNrQWRkb25zPXQoKTplLnRleHRNYXNrQWRkb25zPXQoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtmdW5jdGlvbiB0KHIpe2lmKG5bcl0pcmV0dXJuIG5bcl0uZXhwb3J0czt2YXIgbz1uW3JdPXtleHBvcnRzOnt9LGlkOnIsbG9hZGVkOiExfTtyZXR1cm4gZVtyXS5jYWxsKG8uZXhwb3J0cyxvLG8uZXhwb3J0cyx0KSxvLmxvYWRlZD0hMCxvLmV4cG9ydHN9dmFyIG49e307cmV0dXJuIHQubT1lLHQuYz1uLHQucD1cIlwiLHQoMCl9KFtmdW5jdGlvbihlLHQsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG89bigxKTtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcImNyZWF0ZUF1dG9Db3JyZWN0ZWREYXRlUGlwZVwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiByKG8pLmRlZmF1bHR9fSk7dmFyIGk9bigyKTtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcImNyZWF0ZU51bWJlck1hc2tcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcihpKS5kZWZhdWx0fX0pO3ZhciB1PW4oMyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJlbWFpbE1hc2tcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcih1KS5kZWZhdWx0fX0pfSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06XCJtbSBkZCB5eXl5XCI7cmV0dXJuIGZ1bmN0aW9uKHQpe3ZhciBuPVtdLHI9ZS5zcGxpdCgvW15kbXldKy8pLG89e2RkOjMxLG1tOjEyLHl5Ojk5LHl5eXk6OTk5OX0saT17ZGQ6MSxtbToxLHl5OjAseXl5eToxfSx1PXQuc3BsaXQoXCJcIik7ci5mb3JFYWNoKGZ1bmN0aW9uKHQpe3ZhciByPWUuaW5kZXhPZih0KSxpPXBhcnNlSW50KG9bdF0udG9TdHJpbmcoKS5zdWJzdHIoMCwxKSwxMCk7cGFyc2VJbnQodVtyXSwxMCk+aSYmKHVbcisxXT11W3JdLHVbcl09MCxuLnB1c2gocikpfSk7dmFyIGM9ci5zb21lKGZ1bmN0aW9uKG4pe3ZhciByPWUuaW5kZXhPZihuKSx1PW4ubGVuZ3RoLGM9dC5zdWJzdHIocix1KS5yZXBsYWNlKC9cXEQvZyxcIlwiKSxsPXBhcnNlSW50KGMsMTApO3JldHVybiBsPm9bbl18fGMubGVuZ3RoPT09dSYmbDxpW25dfSk7cmV0dXJuIWMmJnt2YWx1ZTp1LmpvaW4oXCJcIiksaW5kZXhlc09mUGlwZWRDaGFyczpufX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5kZWZhdWx0PW59LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbigpe2Z1bmN0aW9uIGUoKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06Yyx0PWUubGVuZ3RoO2lmKGU9PT1jfHxlWzBdPT09aFswXSYmMT09PXQpcmV0dXJuIGguc3BsaXQoYykuY29uY2F0KFt2XSkuY29uY2F0KG0uc3BsaXQoYykpO2lmKGU9PT1TJiZNKXJldHVybiBoLnNwbGl0KGMpLmNvbmNhdChbXCIwXCIsUyx2XSkuY29uY2F0KG0uc3BsaXQoYykpO3ZhciBuPWUubGFzdEluZGV4T2YoUyksdT1uIT09LTEsbD1lWzBdPT09cyYmSSxhPXZvaWQgMCxnPXZvaWQgMCxiPXZvaWQgMDtpZihlLnNsaWNlKFYqLTEpPT09bSYmKGU9ZS5zbGljZSgwLFYqLTEpKSx1JiYoTXx8RCk/KGE9ZS5zbGljZShlLnNsaWNlKDAsJCk9PT1oPyQ6MCxuKSxnPWUuc2xpY2UobisxLHQpLGc9cihnLnJlcGxhY2UoZixjKSkpOmE9ZS5zbGljZSgwLCQpPT09aD9lLnNsaWNlKCQpOmUsTiYmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBOP1widW5kZWZpbmVkXCI6aShOKSk9PT1wKXt2YXIgTz1cIi5cIj09PV8/XCJbLl1cIjpcIlwiK18saj0oYS5tYXRjaChuZXcgUmVnRXhwKE8sXCJnXCIpKXx8W10pLmxlbmd0aDthPWEuc2xpY2UoMCxOK2oqcSl9cmV0dXJuIGE9YS5yZXBsYWNlKGYsYyksQXx8KGE9YS5yZXBsYWNlKC9eMCsoMCR8W14wXSkvLFwiJDFcIikpLGE9eD9vKGEsXyk6YSxiPXIoYSksKHUmJk18fEQ9PT0hMCkmJihlW24tMV0hPT1TJiZiLnB1c2goeSksYi5wdXNoKFMseSksZyYmKChcInVuZGVmaW5lZFwiPT10eXBlb2YgQz9cInVuZGVmaW5lZFwiOmkoQykpPT09cCYmKGc9Zy5zbGljZSgwLEMpKSxiPWIuY29uY2F0KGcpKSxEPT09ITAmJmVbbi0xXT09PVMmJmIucHVzaCh2KSksJD4wJiYoYj1oLnNwbGl0KGMpLmNvbmNhdChiKSksbCYmKGIubGVuZ3RoPT09JCYmYi5wdXNoKHYpLGI9W2RdLmNvbmNhdChiKSksbS5sZW5ndGg+MCYmKGI9Yi5jb25jYXQobS5zcGxpdChjKSkpLGJ9dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LG49dC5wcmVmaXgsaD12b2lkIDA9PT1uP3U6bixnPXQuc3VmZml4LG09dm9pZCAwPT09Zz9jOmcsYj10LmluY2x1ZGVUaG91c2FuZHNTZXBhcmF0b3IseD12b2lkIDA9PT1ifHxiLE89dC50aG91c2FuZHNTZXBhcmF0b3JTeW1ib2wsXz12b2lkIDA9PT1PP2w6TyxqPXQuYWxsb3dEZWNpbWFsLE09dm9pZCAwIT09aiYmaixQPXQuZGVjaW1hbFN5bWJvbCxTPXZvaWQgMD09PVA/YTpQLHc9dC5kZWNpbWFsTGltaXQsQz12b2lkIDA9PT13PzI6dyxrPXQucmVxdWlyZURlY2ltYWwsRD12b2lkIDAhPT1rJiZrLEU9dC5hbGxvd05lZ2F0aXZlLEk9dm9pZCAwIT09RSYmRSxSPXQuYWxsb3dMZWFkaW5nWmVyb2VzLEE9dm9pZCAwIT09UiYmUixMPXQuaW50ZWdlckxpbWl0LE49dm9pZCAwPT09TD9udWxsOkwsJD1oJiZoLmxlbmd0aHx8MCxWPW0mJm0ubGVuZ3RofHwwLHE9XyYmXy5sZW5ndGh8fDA7cmV0dXJuIGUuaW5zdGFuY2VPZj1cImNyZWF0ZU51bWJlck1hc2tcIixlfWZ1bmN0aW9uIHIoZSl7cmV0dXJuIGUuc3BsaXQoYykubWFwKGZ1bmN0aW9uKGUpe3JldHVybiB2LnRlc3QoZSk/djplfSl9ZnVuY3Rpb24gbyhlLHQpe3JldHVybiBlLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csdCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGk9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX07dC5kZWZhdWx0PW47dmFyIHU9XCIkXCIsYz1cIlwiLGw9XCIsXCIsYT1cIi5cIixzPVwiLVwiLGQ9Ly0vLGY9L1xcRCsvZyxwPVwibnVtYmVyXCIsdj0vXFxkLyx5PVwiW11cIn0sZnVuY3Rpb24oZSx0LG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIoZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntkZWZhdWx0OmV9fWZ1bmN0aW9uIG8oZSx0KXtlPWUucmVwbGFjZShPLHYpO3ZhciBuPXQucGxhY2Vob2xkZXJDaGFyLHI9dC5jdXJyZW50Q2FyZXRQb3NpdGlvbixvPWUuaW5kZXhPZih5KSxzPWUubGFzdEluZGV4T2YocCksZD1zPG8/LTE6cyxmPWkoZSxvKzEseSksaD1pKGUsZC0xLHApLGc9dShlLG8sbiksbT1jKGUsbyxkLG4pLGI9bChlLGQsbixyKTtnPWEoZyksbT1hKG0pLGI9YShiLCEwKTt2YXIgeD1nLmNvbmNhdChmKS5jb25jYXQobSkuY29uY2F0KGgpLmNvbmNhdChiKTtyZXR1cm4geH1mdW5jdGlvbiBpKGUsdCxuKXt2YXIgcj1bXTtyZXR1cm4gZVt0XT09PW4/ci5wdXNoKG4pOnIucHVzaChoLG4pLHIucHVzaChoKSxyfWZ1bmN0aW9uIHUoZSx0KXtyZXR1cm4gdD09PS0xP2U6ZS5zbGljZSgwLHQpfWZ1bmN0aW9uIGMoZSx0LG4scil7dmFyIG89djtyZXR1cm4gdCE9PS0xJiYobz1uPT09LTE/ZS5zbGljZSh0KzEsZS5sZW5ndGgpOmUuc2xpY2UodCsxLG4pKSxvPW8ucmVwbGFjZShuZXcgUmVnRXhwKFwiW1xcXFxzXCIrcitcIl1cIixtKSx2KSxvPT09eT9mOm8ubGVuZ3RoPDE/ZzpvW28ubGVuZ3RoLTFdPT09cD9vLnNsaWNlKDAsby5sZW5ndGgtMSk6b31mdW5jdGlvbiBsKGUsdCxuLHIpe3ZhciBvPXY7cmV0dXJuIHQhPT0tMSYmKG89ZS5zbGljZSh0KzEsZS5sZW5ndGgpKSxvPW8ucmVwbGFjZShuZXcgUmVnRXhwKFwiW1xcXFxzXCIrbitcIi5dXCIsbSksdiksMD09PW8ubGVuZ3RoP2VbdC0xXT09PXAmJnIhPT1lLmxlbmd0aD9mOnY6b31mdW5jdGlvbiBhKGUsdCl7cmV0dXJuIGUuc3BsaXQodikubWFwKGZ1bmN0aW9uKGUpe3JldHVybiBlPT09Zz9lOnQ/eDpifSl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHM9big0KSxkPXIocyksZj1cIipcIixwPVwiLlwiLHY9XCJcIix5PVwiQFwiLGg9XCJbXVwiLGc9XCIgXCIsbT1cImdcIixiPS9bXlxcc10vLHg9L1teLlxcc10vLE89L1xccy9nO3QuZGVmYXVsdD17bWFzazpvLHBpcGU6ZC5kZWZhdWx0fX0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKGUsdCl7dmFyIG49dC5jdXJyZW50Q2FyZXRQb3NpdGlvbixpPXQucmF3VmFsdWUsZj10LnByZXZpb3VzQ29uZm9ybWVkVmFsdWUscD10LnBsYWNlaG9sZGVyQ2hhcix2PWU7dj1yKHYpO3ZhciB5PXYuaW5kZXhPZihjKSxoPW51bGw9PT1pLm1hdGNoKG5ldyBSZWdFeHAoXCJbXkBcXFxccy5cIitwK1wiXVwiKSk7aWYoaClyZXR1cm4gdTtpZih2LmluZGV4T2YoYSkhPT0tMXx8eSE9PS0xJiZuIT09eSsxfHxpLmluZGV4T2Yobyk9PT0tMSYmZiE9PXUmJmkuaW5kZXhPZihsKSE9PS0xKXJldHVybiExO3ZhciBnPXYuaW5kZXhPZihvKSxtPXYuc2xpY2UoZysxLHYubGVuZ3RoKTtyZXR1cm4obS5tYXRjaChkKXx8cykubGVuZ3RoPjEmJnYuc3Vic3RyKC0xKT09PWwmJm4hPT1pLmxlbmd0aCYmKHY9di5zbGljZSgwLHYubGVuZ3RoLTEpKSx2fWZ1bmN0aW9uIHIoZSl7dmFyIHQ9MDtyZXR1cm4gZS5yZXBsYWNlKGksZnVuY3Rpb24oKXtyZXR1cm4gdCsrLDE9PT10P286dX0pfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuZGVmYXVsdD1uO3ZhciBvPVwiQFwiLGk9L0AvZyx1PVwiXCIsYz1cIkAuXCIsbD1cIi5cIixhPVwiLi5cIixzPVtdLGQ9L1xcLi9nfV0pfSk7IiwibW9kdWxlLmV4cG9ydHMgPSBcblx0cmVkOiAnI2NjNDgyMCdcblx0Z3JlZW46ICcjNzJjMzIyJ1xuXHRvcmFuZ2U6ICcjZmY5YzAwJ1xuXHRibGFjazogJyMxODE4MTgnXG5cdGdyZXlfZGFyazogJyM1ZTVlNWUnXG5cdGdyZXk6ICcjOTA5MDkwJ1xuXHRncmV5X3NlbWlfbGlnaHQ6ICcjYmViZWJlJ1xuXHRncmV5X2xpZ2h0OiAnI2QzZDNkMydcblx0Z3JleV9saWdodDI6ICcjZGRkZGRkJ1xuXHRncmV5X2xpZ2h0MzogJyNmMmY1ZjcnXG5cdGdyZXlfbGlnaHQ0OiAnI2U1ZTVlNSdcbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3RhdGVDaGFpblxuXHRjb25zdHJ1Y3RvcjogKHN0YXRlcyktPlxuXHRcdEBzdHJpbmcgPSBzdGF0ZXMuam9pbignKycpXG5cdFx0QGFycmF5ID0gc3RhdGVzLnNsaWNlKClcblx0XHRAbGVuZ3RoID0gc3RhdGVzLmxlbmd0aFxuXG5cdGluY2x1ZGVzOiAodGFyZ2V0KS0+XG5cdFx0Zm9yIHN0YXRlIGluIEBhcnJheVxuXHRcdFx0cmV0dXJuIHRydWUgaWYgc3RhdGUgaXMgdGFyZ2V0XG5cblx0XHRyZXR1cm4gZmFsc2VcblxuXHR3aXRob3V0OiAodGFyZ2V0KS0+XG5cdFx0QGFycmF5XG5cdFx0XHQuZmlsdGVyIChzdGF0ZSktPiBzdGF0ZSBpc250IHRhcmdldFxuXHRcdFx0LmpvaW4gJysnXG5cblxuXHRpc0FwcGxpY2FibGU6ICh0YXJnZXQsIG90aGVyQWN0aXZlKS0+XG5cdFx0YWN0aXZlID0gQGFycmF5LmZpbHRlciAoc3RhdGUpLT5cblx0XHRcdHN0YXRlIGlzIHRhcmdldCBvclxuXHRcdFx0b3RoZXJBY3RpdmUuaW5kZXhPZihzdGF0ZSkgaXNudCAtMVxuXG5cdFx0cmV0dXJuIGFjdGl2ZS5sZW5ndGggaXMgQGFycmF5Lmxlbmd0aCIsImV4cG9ydHMuY2hlY2ttYXJrID0gaW1wb3J0ICcuL2NoZWNrbWFyaydcbmV4cG9ydHMuYW5nbGVEb3duID0gaW1wb3J0ICcuL2FuZ2xlRG93bidcbmV4cG9ydHMuY2FyZXRVcCA9IGltcG9ydCAnLi9jYXJldFVwJ1xuZXhwb3J0cy5jYXJldERvd24gPSBpbXBvcnQgJy4vY2FyZXREb3duJ1xuZXhwb3J0cy5wbHVzID0gaW1wb3J0ICcuL3BsdXMnXG5leHBvcnRzLmNsb25lID0gaW1wb3J0ICcuL2Nsb25lJ1xuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHdpZHRoOiAnMTJweCdcblx0XHRcdGhlaWdodDogJzEycHgnXG5cdFx0XHR2aWV3Qm94OiAnNSA3IDEyIDEyJ1xuXHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHR3aWR0aDogJzlweCdcblx0XHRcdGhlaWdodDogJzlweCdcblxuXG5cdFx0WycqcG9seWxpbmUnLCB7XG5cdFx0XHRhdHRyczpcblx0XHRcdFx0J3N0cm9rZS13aWR0aCc6ICcyJ1xuXHRcdFx0XHQnc3Ryb2tlLWxpbmVjYXAnOiAncm91bmQnXG5cdFx0XHRcdCdzdHJva2UtbGluZWpvaW4nOiAncm91bmQnXG5cdFx0XHRcdGZpbGw6ICdub25lJ1xuXHRcdFx0XHRwb2ludHM6ICc3IDEzLjg4ODg4ODkgOS42NjY2NjY2NyAxNyAxNSA5J1xuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdH1dXG5cdF1cbilcblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0d2lkdGg6ICcxNzkycHgnXG5cdFx0XHRoZWlnaHQ6ICcxNzkycHgnXG5cdFx0XHR2aWV3Qm94OiAnMCAwIDE3OTIgMTc5Midcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTEzOTUgNzM2cTAgMTMtMTAgMjNsLTQ2NiA0NjZxLTEwIDEwLTIzIDEwdC0yMy0xMGwtNDY2LTQ2NnEtMTAtMTAtMTAtMjN0MTAtMjNsNTAtNTBxMTAtMTAgMjMtMTB0MjMgMTBsMzkzIDM5MyAzOTMtMzkzcTEwLTEwIDIzLTEwdDIzIDEwbDUwIDUwcTEwIDEwIDEwIDIzeidcblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0dmlld0JveDogJzAgMCA1MTIgNTEyJ1xuXHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJ1xuXHRcdFx0b3V0bGluZTogJ25vbmUnXG5cblx0XHRbJypwYXRoJ1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0XHRcdGQ6ICdNNDAyIDM0N2MwIDUtMiAxMC01IDEzLTQgNC04IDYtMTMgNmgtMjU2Yy01IDAtOS0yLTEzLTYtMy0zLTUtOC01LTEzczItOSA1LTEybDEyOC0xMjhjNC00IDgtNiAxMy02czkgMiAxMyA2bDEyOCAxMjhjMyAzIDUgNyA1IDEyeidcblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NLnRlbXBsYXRlKFxuXHRbJypzdmcnXG5cdFx0YXR0cnM6XG5cdFx0XHR2aWV3Qm94OiAnMCAwIDUxMiA1MTInXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBhdGgnXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0ZDogJ000MDIgMjAxYzAgNS0yIDktNSAxM2wtMTI4IDEyOGMtNCA0LTggNS0xMyA1cy05LTEtMTMtNWwtMTI4LTEyOGMtMy00LTUtOC01LTEzczItOSA1LTEzYzQtMyA4LTUgMTMtNWgyNTZjNSAwIDkgMiAxMyA1IDMgNCA1IDggNSAxM3onXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHZpZXdCb3g6ICcwIDAgMTUgMTUnXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBvbHlnb24nXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0cG9pbnRzOiAnOSAwIDYgMCA2IDYgMCA2IDAgOSA2IDkgNiAxNSA5IDE1IDkgOSAxNSA5IDE1IDYgOSA2J1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHZpZXdCb3g6ICcwIDAgMTggMjAnXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBhdGgnXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0ZDogJ00xMy40MTQsMCBMNiwwIEM0Ljg5NywwIDQsMC44OTggNCwyIEw0LDE0IEM0LDE1LjEwMyA0Ljg5NywxNiA2LDE2IEwxNiwxNiBDMTcuMTAzLDE2IDE4LDE1LjEwMyAxOCwxNCBMMTgsNC41ODYgTDEzLjQxNCwwIFogTTE2LjAwMSwxNCBMNiwxNCBMNiwyIEwxMiwyIEwxMiw2IEwxNiw2IEwxNi4wMDEsMTQgWidcblx0XHRdXG5cdFx0XG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTIsNi40MjM3OTI4MiBMMCw2LjQyMzc5MjgyIEwwLDE4IEMwLDE5LjEwMyAwLjg5NywyMCAyLDIwIEwxNCwyMCBMMTQsMTggTDIsMTggTDIsNi40MjM3OTI4MiBaJ1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cblxuIl19