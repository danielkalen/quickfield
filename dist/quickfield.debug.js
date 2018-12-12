function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (require, global) {
  require = function (cache, modules, cx) {
    var loader = function loader(r) {
      if (!modules[r]) throw new Error(r + ' is not a module');
      return cache[r] ? cache[r].exports : (cache[r] = {
        exports: {}
      }, cache[r].exports = modules[r].call(cx, require, cache[r], cache[r].exports));
    };

    loader.modules = modules;
    return loader;
  }({}, {
    0: function _(require, module, exports) {
      var DOM, IS, QuickField, REQUIRED_FIELD_METHODS, extend, helpers, _newBuilder, registerAnimations;

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

      _newBuilder = function newBuilder(settingOverrides, templateOverrides) {
        var Field, _builder;

        _builder = function builder(settings) {
          if (arguments.length > 1) {
            var _extend;

            settings = (_extend = extend).clone.apply(_extend, arguments);
          }

          if (!IS.object(settings)) {
            settings = {};
          }

          if (settings.type == null) {
            settings.type = 'text';
          }

          if (!Field[settings.type]) {
            throw new Error("QuickField: '".concat(settings.type, "' is not a valid/registered field type"));
          }

          registerAnimations();
          return new Field[settings.type](settings, _builder, settingOverrides, templateOverrides);
        };

        _builder.register = function (type, targetField) {
          var i, len, requiredMethod;

          if (!IS.string(type) || !IS.function(targetField)) {
            throw new Error("QuickField Registration: invalid arguments");
          }

          for (i = 0, len = REQUIRED_FIELD_METHODS.length; i < len; i++) {
            requiredMethod = REQUIRED_FIELD_METHODS[i];

            if (!targetField.prototype[requiredMethod]) {
              throw new Error("QuickField Registration: '".concat(requiredMethod, "' method is required in order to register the field"));
            }
          }

          Field[type] = targetField;
          return this;
        };

        _builder.config = function (newSettings, newTemplates) {
          var config, globalConfig, name, originalTemplates, outputSettings, outputTemplates, ref, templates, type;

          if (!IS.object(newSettings)) {
            throw new Error("QuickField Config: invalid config object provided ".concat(String(newSettings)));
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

            if (globalConfig && globalConfig.field && !globalConfig.default) {
              globalConfig.default = globalConfig.field;
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

              if (templates.field && !templates.default) {
                templates.default = templates.field;
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

          return _newBuilder(outputSettings, outputTemplates);
        };

        Object.defineProperty(_builder, 'fields', {
          get: function get() {
            return extend.clone.own.notKeys('instances')(Field);
          }
        });
        _builder.settingOverrides = settingOverrides;
        _builder.templateOverrides = templateOverrides;
        _builder.version = "1.0.86";
        _builder.Field = Field = require(9);
        return _builder;
      };

      QuickField = _newBuilder();
      QuickField.register('text', require(10));
      module.exports = QuickField;
      return module.exports;
    },
    1: function _(require, module, exports) {
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
        return function () {
          var j, ref, results1;
          results1 = [];

          for (i = j = 1, ref = count; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
            results1.push(string);
          }

          return results1;
        }().join('');
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
        return "rgba(".concat(R, ", ").concat(G, ", ").concat(B, ", ").concat(alpha, ")");
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

        switch (_typeof(value)) {
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

        return "".concat(values.top, "px ").concat(values.right, "px ").concat(values.bottom, "px ").concat(values.left, "px");
      };

      helpers.inheritProto = function (child, parent, keys) {
        var j, key, len, ref;
        ref = Object.getOwnPropertyNames(parent.prototype);

        for (j = 0, len = ref.length; j < len; j++) {
          key = ref[j];

          if (keys && !keys.includes(key)) {
            continue;
          }

          if (!child.prototype[key]) {
            child.prototype[key] = parent.prototype[key];
          }
        }

        return child;
      };

      return module.exports;
    },
    2: function _(require, module, exports) {
      var _QuickDom;

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
            return _QuickDom.text(targetEl);

          case !IS.domNode(targetEl):
            return _QuickDom(targetEl);

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

        for (i = 0, len = props.length; i < len; i++) {
          prop = props[i];

          if (typeof rule[prop] === 'function') {
            output.fns.push([prop, rule[prop]]);
          }
        }

        return styleCache.set(rule, output, level);
      };

      styleCache = new (
      /*#__PURE__*/
      function () {
        function _class() {
          _classCallCheck(this, _class);

          this.keys = Object.create(null);
          this.values = Object.create(null);
        }

        _createClass(_class, [{
          key: "get",
          value: function get(key, level) {
            var index;

            if (this.keys[level]) {
              index = this.keys[level].indexOf(key);

              if (index !== -1) {
                return this.values[level][index];
              }
            }
          }
        }, {
          key: "set",
          value: function set(key, value, level) {
            if (!this.keys[level]) {
              this.keys[level] = [];
              this.values[level] = [];
            }

            this.keys[level].push(key);
            this.values[level].push(value);
            return value;
          }
        }]);

        return _class;
      }())();
      ;
      var IS;
      IS = require(24);
      IS = IS.create('natives', 'dom');
      IS.load({
        quickDomEl: function quickDomEl(subject) {
          return subject && subject.constructor.name === QuickElement.name;
        },
        template: function template(subject) {
          return subject && subject.constructor.name === QuickTemplate.name;
        }
      });
      ;
      var QuickElement, svgNamespace;
      svgNamespace = 'http://www.w3.org/2000/svg';

      QuickElement = function () {
        var QuickElement =
        /*#__PURE__*/
        function () {
          function QuickElement(type, options) {
            _classCallCheck(this, QuickElement);

            this.type = type;
            this.options = options;
            QuickElement.count++;

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

          _createClass(QuickElement, [{
            key: "toJSON",
            value: function toJSON() {
              var child, children, i, len, output;
              output = [this.type, extend.clone.keys(allowedOptions)(this.options)];
              children = this.children;

              for (i = 0, len = children.length; i < len; i++) {
                child = children[i];
                output.push(child.toJSON());
              }

              return output;
            }
          }]);

          return QuickElement;
        }();

        ;
        QuickElement.count = 0;
        return QuickElement;
      }.call(this);

      if (QuickElement.name == null) {
        QuickElement.name = 'QuickElement';
      }

      Object.defineProperties(QuickElement.prototype, {
        'raw': {
          get: function get() {
            return this.el;
          }
        },
        '0': {
          get: function get() {
            return this.el;
          }
        },
        'css': {
          get: function get() {
            return this.style;
          }
        },
        'replaceWith': {
          get: function get() {
            return this.replace;
          }
        },
        'removeListener': {
          get: function get() {
            return this.off;
          }
        }
      });
      ;

      var _filterElements, _getChildRefs2, _getIndexByProp, _getParents;

      QuickElement.prototype.parentsUntil = function (filter) {
        return _getParents(this, filter);
      };

      QuickElement.prototype.parentMatching = function (filter) {
        var isRef, nextParent;

        if (IS.function(filter) || (isRef = IS.string(filter))) {
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
        return _QuickDom(this.raw.querySelector(selector));
      };

      QuickElement.prototype.queryAll = function (selector) {
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
          get: function get() {
            var child, i, len, ref1;

            if (this.el.childNodes.length !== this._children.length) {
              this._children.length = 0;
              ref1 = this.el.childNodes;

              for (i = 0, len = ref1.length; i < len; i++) {
                child = ref1[i];

                if (child.nodeType < 4) {
                  this._children.push(_QuickDom(child));
                }
              }
            }

            return this._children;
          }
        },
        'elementChildren': {
          get: function get() {
            return _filterElements(this.children);
          }
        },
        'parent': {
          get: function get() {
            if ((!this._parent || this._parent.el !== this.el.parentNode) && !IS.domDoc(this.el.parentNode)) {
              this._parent = _QuickDom(this.el.parentNode);
            }

            return this._parent;
          }
        },
        'parents': {
          get: function get() {
            return _getParents(this);
          }
        },
        'next': {
          get: function get() {
            return _QuickDom(this.el.nextSibling);
          }
        },
        'nextEl': {
          get: function get() {
            return _QuickDom(this.el.nextElementSibling);
          }
        },
        'nextElAll': {
          get: function get() {
            return _filterElements(this.nextAll);
          }
        },
        'nextAll': {
          get: function get() {
            var nextSibling, siblings;
            siblings = [];
            nextSibling = _QuickDom(this.el.nextSibling);

            while (nextSibling) {
              siblings.push(nextSibling);
              nextSibling = nextSibling.next;
            }

            return siblings;
          }
        },
        'prev': {
          get: function get() {
            return _QuickDom(this.el.previousSibling);
          }
        },
        'prevEl': {
          get: function get() {
            return _QuickDom(this.el.previousElementSibling);
          }
        },
        'prevElAll': {
          get: function get() {
            return _filterElements(this.prevAll);
          }
        },
        'prevAll': {
          get: function get() {
            var prevSibling, siblings;
            siblings = [];
            prevSibling = _QuickDom(this.el.previousSibling);

            while (prevSibling) {
              siblings.push(prevSibling);
              prevSibling = prevSibling.prev;
            }

            return siblings;
          }
        },
        'siblings': {
          get: function get() {
            return this.prevAll.reverse().concat(this.nextAll);
          }
        },
        'elementSiblings': {
          get: function get() {
            return _filterElements(this.siblings);
          }
        },
        'child': {
          get: function get() {
            return this._childRefs || _getChildRefs2(this);
          }
        },
        'childf': {
          get: function get() {
            return _getChildRefs2(this, true);
          }
        },
        'firstChild': {
          get: function get() {
            return this.children[0];
          }
        },
        'lastChild': {
          get: function get() {
            var children;
            children = this.children;
            return children[children.length - 1];
          }
        },
        'index': {
          get: function get() {
            var parent;

            if (!(parent = this.parent)) {
              return null;
            } else {
              return parent.children.indexOf(this);
            }
          }
        },
        'indexType': {
          get: function get() {
            return _getIndexByProp(this, 'type');
          }
        },
        'indexRef': {
          get: function get() {
            return _getIndexByProp(this, 'ref');
          }
        }
      });

      _getParents = function _getParents(targetEl, filter) {
        var isRef, nextParent, parents;

        if (!IS.function(filter) && !(isRef = IS.string(filter))) {
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

      _getChildRefs2 = function _getChildRefs(target, freshCopy) {
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
            childRefs = _getChildRefs2(child, freshCopy);

            for (ref in childRefs) {
              el = childRefs[ref];
              refs[ref] || (refs[ref] = el);
            }
          }
        }

        return refs;
      };

      _getIndexByProp = function _getIndexByProp(main, prop) {
        var parent;

        if (!(parent = main.parent)) {
          return null;
        } else {
          return parent.children.filter(function (child) {
            return child[prop] === main[prop];
          }).indexOf(main);
        }
      };

      _filterElements = function _filterElements(array) {
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
      var CACHED_FN_INSERTED, baseStateTriggers;
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
        var base1, base2, base3, base4, base5;

        if (this.options.relatedInstance) {
          (base1 = this.options).related || (base1.related = this.options.relatedInstance);
          this.options.relatedInstance = null;
        }

        this.related = (base2 = this.options).related != null ? base2.related : base2.related = this;

        if (this.options.class) {
          this.options.className = this.options.class;
        }

        if (this.options.url) {
          this.options.href = this.options.url;
        }

        if ((base3 = this.options).unpassableStates == null) {
          base3.unpassableStates = [];
        }

        if ((base4 = this.options).passStateToChildren == null) {
          base4.passStateToChildren = true;
        }

        if ((base5 = this.options).passDataToChildren == null) {
          base5.passDataToChildren = true;
        }

        this.options.stateTriggers = this.options.stateTriggers ? extend.clone.deep(baseStateTriggers, this.options.stateTriggers) : baseStateTriggers;

        if (this.type === 'text') {
          extend(this, this._parseTexts(this.options.text, this._texts));
        } else {
          extend(this, this._parseStyles(this.options.style, this._styles));
        }
      };

      QuickElement.prototype._parseStyles = function (styles, store) {
        var _mediaStates, _providedStates, _providedStatesShared, _stateShared, _styles, base, _flattenNestedStates, forceStyle, i, keys, len, specialStates, state, stateStyles, state_, states;

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
        _styles = store || {};
        _stateShared = _providedStatesShared = void 0;
        base = !helpers.includes(states, '$base') ? styles : styles.$base;
        _styles.base = helpers.registerStyle(base, 0, forceStyle = this.options.forceStyle);

        if (specialStates.length) {
          _flattenNestedStates = function flattenNestedStates(styleObject, chain, level) {
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
                stateChain = new (require(69))(chain);

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

                _styles[stateChain.string] = helpers.registerStyle(_flattenNestedStates(styleObject[state], chain, level + 1), level + 1, forceStyle);
              }
            }

            if (hasNonStateProps) {
              return output;
            }
          };

          for (i = 0, len = specialStates.length; i < len; i++) {
            state = specialStates[i];
            state_ = state.slice(1);
            stateStyles = _flattenNestedStates(styles[state], [state_], 1);

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

      QuickElement.prototype._applyOptions = function () {
        var _this = this;

        var event, handler, method, ref, ref1, ref2, value;

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
          this.prop(this.options.props);
        }

        if (this.options.attrs) {
          this.attr(this.options.attrs);
        }

        this._applyRegisteredStyle(this._styles.base, null, null, this.options.styleAfterInsert);

        if (this._texts) {
          this.text = this._texts.base;
        }

        this.on('inserted', CACHED_FN_INSERTED, false, true);

        if (this.options.invokeComputersOnce) {
          this._invokedComputers = {};
        }

        if (this.options.recalcOnResize) {
          window.addEventListener('resize', function () {
            return _this.recalcStyle();
          });
        }

        if (this.options.events) {
          ref1 = this.options.events;

          for (event in ref1) {
            handler = ref1[event];
            this.on(event, handler);
          }
        }

        if (this.options.methods) {
          ref2 = this.options.methods;

          for (method in ref2) {
            value = ref2[method];

            if (!this[method]) {
              if (IS.function(value)) {
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
          this.append(_QuickDom('text', {
            text: this.options.text
          }));
        }
      };

      QuickElement.prototype._postCreation = function (data) {
        if (this.options.computers) {
          if (data && this.options.data) {
            data = extend.clone(this.options.data, data);
          }

          data || (data = this.options.data);
          this.applyData(data, false);

          if (this.options.computers._init) {
            this._runComputer('_init', data);
          }
        }

        if (this.options.state) {
          this.state(this.options.state);
        }
      };

      QuickElement.prototype._attachStateEvents = function (force) {
        var _this2 = this;

        var states;
        states = Object.keys(this.options.stateTriggers);
        states.forEach(function (state) {
          var disabler, enabler, trigger;
          trigger = _this2.options.stateTriggers[state];

          if (!helpers.includes(_this2._providedStates, state) && !force && !trigger.force) {
            return;
          }

          enabler = IS.string(trigger) ? trigger : trigger.on;

          if (IS.object(trigger)) {
            disabler = trigger.off;
          }

          _this2._listenTo(enabler, function () {
            return _this2.state(state, true, trigger.bubbles);
          });

          if (disabler) {
            return _this2._listenTo(disabler, function () {
              return _this2.state(state, false, trigger.bubbles);
            });
          }
        });
      };

      QuickElement.prototype._proxyParent = function () {
        var parent;
        parent = void 0;
        return Object.defineProperty(this, '_parent', {
          get: function get() {
            return parent;
          },
          set: function set(newParent) {
            var _this3 = this;

            var lastParent;

            if (parent = newParent) {
              lastParent = this.parents.slice(-1)[0];

              if (lastParent.raw === document.documentElement) {
                this._unproxyParent(newParent);
              } else {
                parent.on('inserted', function () {
                  if (parent === newParent) {
                    return _this3._unproxyParent(newParent);
                  }
                });
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

      CACHED_FN_INSERTED = function CACHED_FN_INSERTED() {
        var i, len, mediaStates, queryString, results;
        this._inserted = this;

        if (this.options.styleAfterInsert) {
          this.recalcStyle();
        }

        if ((mediaStates = this._mediaStates) && this._mediaStates.length) {
          this._mediaStates = Object.create(null);
          results = [];

          for (i = 0, len = mediaStates.length; i < len; i++) {
            queryString = mediaStates[i];
            results.push(this._mediaStates[queryString] = MediaQuery.register(this, queryString));
          }

          return results;
        }
      };

      ;
      var regexWhitespace;
      regexWhitespace = /\s+/;

      QuickElement.prototype.on = function (eventNames, callback, useCapture, isPrivate) {
        var _this4 = this;

        var callbackRef, split;

        if (this._eventCallbacks == null) {
          this._eventCallbacks = {
            __refs: {}
          };
        }

        if (IS.string(eventNames) && IS.function(callback)) {
          split = eventNames.split('.');
          callbackRef = split[1];
          eventNames = split[0];

          if (eventNames === 'inserted' && this._inserted) {
            callback.call(this, this._parent);
            return this;
          }

          eventNames.split(regexWhitespace).forEach(function (eventName) {
            if (!_this4._eventCallbacks[eventName]) {
              _this4._eventCallbacks[eventName] = [];

              if (!isPrivate) {
                _this4._listenTo(eventName, function (event) {
                  return _this4._invokeHandlers(eventName, event);
                }, useCapture);
              }
            }

            if (callbackRef) {
              _this4._eventCallbacks.__refs[callbackRef] = callback;
            }

            return _this4._eventCallbacks[eventName].push(callback);
          });
        }

        return this;
      };

      QuickElement.prototype.once = function (eventNames, callback) {
        var _this5 = this;

        var _onceCallback;

        if (IS.string(eventNames) && IS.function(callback)) {
          this.on(eventNames, _onceCallback = function onceCallback(event) {
            _this5.off(eventNames, _onceCallback);

            return callback.call(_this5, event);
          });
        }

        return this;
      };

      QuickElement.prototype.off = function (eventNames, callback) {
        var _this6 = this;

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
          eventNames.split(regexWhitespace).forEach(function (eventName) {
            if (_this6._eventCallbacks[eventName]) {
              if (callback == null) {
                callback = _this6._eventCallbacks.__refs[callbackRef];
              }

              if (IS.function(callback)) {
                return helpers.removeItem(_this6._eventCallbacks[eventName], callback);
              } else if (!callbackRef) {
                return _this6._eventCallbacks[eventName].length = 0;
              }
            }
          });
        }

        return this;
      };

      QuickElement.prototype.emit = function (eventName) {
        var bubbles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var cancelable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var data = arguments.length > 3 ? arguments[3] : undefined;
        var event;

        if (eventName && IS.string(eventName)) {
          event = document.createEvent('Event');
          event.initEvent(eventName, bubbles, cancelable);

          if (data && _typeof(data) === 'object') {
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

        for (i = 0, len = callbacks.length; i < len; i++) {
          cb = callbacks[i];
          cb.call(this, arg);
        }
      };

      QuickElement.prototype._listenTo = function (eventName, callback, useCapture) {
        var eventNameToListenFor, listenMethod;
        listenMethod = this.el.addEventListener ? 'addEventListener' : 'attachEvent';
        eventNameToListenFor = this.el.addEventListener ? eventName : "on".concat(eventName);
        this.el[listenMethod](eventNameToListenFor, callback, useCapture);
        return this;
      };

      ;
      var DUMMY_ARRAY;
      DUMMY_ARRAY = [];

      QuickElement.prototype.state = function (targetState, value, bubbles, source) {
        var activeStates, child, desiredValue, i, j, key, keys, len, prop, ref, toggle;

        if (arguments.length === 0) {
          return this._state.slice();
        }

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
            this.emitPrivate("stateChange:".concat(targetState), desiredValue);
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

      QuickElement.prototype.toggleState = function (targetState) {
        return this.state(targetState, !this.state(targetState));
      };

      QuickElement.prototype.resetState = function () {
        var activeState, j, len, ref;
        ref = this._state.slice();

        for (j = 0, len = ref.length; j < len; j++) {
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

      QuickElement.prototype._applyRegisteredStyle = function (targetStyle, superiorStates, includeBase, skipFns) {
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

      QuickElement.prototype._removeRegisteredStyle = function (targetStyle, superiorStates, includeBase) {
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

      QuickElement.prototype._turnStyleON = function (targetState, activeStates) {
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

          for (j = 0, len = sharedStates.length; j < len; j++) {
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

      QuickElement.prototype._getActiveStates = function (stateToExclude) {
        var includeSharedStates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var activeStates, j, len, plainStates, state;

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

      QuickElement.prototype._getSuperiorStates = function (targetState, activeStates) {
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

      QuickElement.prototype._getSharedStates = function (targetState) {
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

      QuickElement.prototype._resolveFnStyles = function (states, includeBase) {
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
      var aspectRatioGetter, orientationGetter;

      QuickElement.prototype.style = function (property) {
        var _this7 = this;

        var args, i, key, keys, result, value;

        if (this.type === 'text') {
          return;
        }

        args = arguments;

        if (IS.string(property)) {
          value = typeof args[1] === 'function' ? args[1].call(this, this.related) : args[1];

          if (args[1] === null && IS.defined(this.currentStateStyle(property)) && !IS.function(this.currentStateStyle(property))) {
            value = CSS.UNSET;
          }

          if (value && typeof value.then === 'function') {
            value.then(function (value) {
              return CSS(_this7.el, property, value, _this7.options.forceStyle);
            });
          } else {
            result = CSS(this.el, property, value, this.options.forceStyle);
          }

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

          for (j = 0, len = ref.length; j < len; j++) {
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
              var _states;

              (_states = states).push.apply(_states, _toConsumableArray(this._stateShared));
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
          get: function get() {
            if (this.width > this.height) {
              return 'landscape';
            } else {
              return 'portrait';
            }
          }
        },
        'aspectRatio': aspectRatioGetter = {
          get: function get() {
            return this.width / this.height;
          }
        },
        'rect': {
          get: function get() {
            return this.el.getBoundingClientRect();
          }
        },
        'width': {
          get: function get() {
            return parseFloat(this.style('width'));
          },
          set: function set(value) {
            return this.style('width', value);
          }
        },
        'height': {
          get: function get() {
            return parseFloat(this.style('height'));
          },
          set: function set(value) {
            return this.style('height', value);
          }
        }
      });
      ;

      QuickElement.prototype.attr = function (target, newValue) {
        var i, key, keys;

        if (arguments.length === 1) {
          if (typeof target === 'string') {
            return this.el.getAttribute(target);
          }

          if (IS.object(target)) {
            keys = Object.keys(target);
            i = -1;

            while (key = keys[++i]) {
              this.attr(key, target[key]);
            }
          }
        } else if (newValue === null) {
          return this.el.removeAttribute(target);
        } else {
          this.el.setAttribute(target, newValue);
        }

        return this;
      };

      QuickElement.prototype.prop = function (target, newValue) {
        var i, key, keys;

        if (arguments.length === 1) {
          if (typeof target === 'string') {
            return this.el[target];
          }

          if (IS.object(target)) {
            keys = Object.keys(target);
            i = -1;

            while (key = keys[++i]) {
              this.prop(key, target[key]);
            }
          }
        } else {
          this.el[target] = newValue;
        }

        return this;
      };

      ;

      QuickElement.prototype.toTemplate = function () {
        return _QuickDom.template(this);
      };

      QuickElement.prototype.clone = function () {
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

        for (i = 0, len = ref.length; i < len; i++) {
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
          parentChildren = _QuickDom.batch(parent.children);
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

      QuickElement.prototype.setRef = function (target) {
        this.ref = this.options.ref = target;
        this.attr('data-ref', target);
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
          get: function get() {
            return this.el.innerHTML;
          },
          set: function set(newValue) {
            return this.el.innerHTML = newValue;
          }
        },
        'text': {
          get: function get() {
            return this.el.textContent;
          },
          set: function set(newValue) {
            return this.el.textContent = newValue;
          }
        },
        'className': {
          get: function get() {
            if (this.svg) {
              return this.attr('class') || '';
            } else {
              return this.raw.className;
            }
          },
          set: function set(newValue) {
            if (this.svg) {
              return this.attr('class', newValue);
            } else {
              return this.raw.className = newValue;
            }
          }
        },
        'classList': {
          get: function get() {
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

      QuickElement.prototype.updateStateTexts = function (texts) {
        var parsed;

        if (IS.objectPlain(texts)) {
          extend.deep.concat(this, parsed = this._parseTexts(texts));
        }

        return this;
      };

      QuickElement.prototype.applyData = function (data, passThrough) {
        var child, computers, defaults, i, j, key, keys, len, len1, ref;

        if (this.options.passDataToChildren && this._children.length && (passThrough != null ? passThrough : passThrough = true)) {
          ref = this._children;

          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            child.applyData(data);
          }
        }

        if (computers = this.options.computers) {
          defaults = this.options.defaults;
          keys = Object.keys(computers);

          for (j = 0, len1 = keys.length; j < len1; j++) {
            key = keys[j];

            if (this.options.invokeComputersOnce) {
              if (this._invokedComputers[key]) {
                continue;
              }

              this._invokedComputers[key] = 1;
            }

            if (data && data.hasOwnProperty(key)) {
              this._runComputer(key, data[key], data);
            } else if (defaults && defaults.hasOwnProperty(key)) {
              this._runComputer(key, defaults[key], data);
            }
          }
        }

        return this;
      };

      QuickElement.prototype._runComputer = function (computer, arg, data) {
        return this.options.computers[computer].call(this, arg, data);
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
          get: function get() {
            return window.innerWidth;
          }
        },
        'height': {
          get: function get() {
            return window.innerHeight;
          }
        },
        'orientation': orientationGetter,
        'aspectRatio': aspectRatioGetter
      });
      ;
      var MediaQuery, ruleDelimiter;
      MediaQuery = new function () {
        var callbacks, testRule;
        callbacks = [];
        window.addEventListener('resize', function () {
          var callback, i, len;

          for (i = 0, len = callbacks.length; i < len; i++) {
            callback = callbacks[i];
            callback();
          }
        });

        this.parseQuery = function (target, queryString) {
          var querySplit, rules, source;
          querySplit = queryString.split('(');
          source = querySplit[0];

          source = function () {
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
          }();

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

            getter = function () {
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
            }();

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
            callbacks.push(callback = function callback() {
              return testRule(target, query, queryString);
            });
            callback();
          }

          return query;
        };

        testRule = function testRule(target, query, queryString) {
          var currentValue, i, len, passed, ref, rule;
          passed = true;
          ref = query.rules;

          for (i = 0, len = ref.length; i < len; i++) {
            rule = ref[i];
            currentValue = rule.getter();

            passed = function () {
              switch (false) {
                case !rule.min:
                  return currentValue >= rule.value;

                case !rule.max:
                  return currentValue <= rule.value;

                default:
                  return currentValue === rule.value;
              }
            }();

            if (!passed) {
              break;
            }
          }

          return target.state(queryString, passed);
        };

        return this;
      }();
      ruleDelimiter = /,\s*/;
      ;

      _QuickDom = function QuickDom() {
        var arg, args, element, i, j, len, prevCount;
        args = new Array(arguments.length);

        for (i = j = 0, len = arguments.length; j < len; i = ++j) {
          arg = arguments[i];
          args[i] = arg;
        }

        prevCount = QuickElement.count;
        element = _QuickDom.create(args);

        if (element && element._postCreation && QuickElement.count !== prevCount) {
          element._postCreation();
        }

        return element;
      };

      _QuickDom.create = function (args) {
        var argsLength, child, children, element, i, j, len, options, type;

        switch (false) {
          case !IS.array(args[0]):
            return _QuickDom.apply(void 0, _toConsumableArray(args[0]));

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
              children = new Array(argsLength = args.length);
              i = 1;

              while (++i < argsLength) {
                children[i + 1] = args[i];
              }

              for (j = 0, len = children.length; j < len; j++) {
                child = children[j];

                if (IS.string(child)) {
                  child = _QuickDom.text(child);
                }

                if (IS.array(child)) {
                  child = _QuickDom.apply(void 0, _toConsumableArray(child));
                }

                if (IS.quickDomEl(child)) {
                  element.append(child);
                }
              }
            }

            return element;

          case !(args[0] && (IS.domNode(args[0][0]) || IS.domDoc(args[0][0]))):
            return _QuickDom(args[0][0]);
        }
      };

      _QuickDom.template = function (tree) {
        return new QuickTemplate(tree, true);
      };

      _QuickDom.html = function (innerHTML) {
        var children, container;
        container = document.createElement('div');
        container.innerHTML = innerHTML;
        children = Array.prototype.slice.call(container.childNodes);
        return _QuickDom.batch(children);
      };

      _QuickDom.query = function (target) {
        return _QuickDom(document).query(target);
      };

      _QuickDom.queryAll = function (target) {
        return _QuickDom(document).queryAll(target);
      };

      _QuickDom.isTemplate = function (target) {
        return IS.template(target);
      };

      _QuickDom.isQuickEl = function (target) {
        return IS.quickDomEl(target);
      };

      _QuickDom.isEl = function (target) {
        return IS.domEl(target);
      };

      var QuickBatch;

      QuickBatch =
      /*#__PURE__*/
      function () {
        function QuickBatch(elements, returnResults1) {
          _classCallCheck(this, QuickBatch);

          this.returnResults = returnResults1;
          this.elements = elements.map(function (el) {
            return _QuickDom(el);
          });
        }

        _createClass(QuickBatch, [{
          key: "reverse",
          value: function reverse() {
            this.elements = this.elements.reverse();
            return this;
          }
        }, {
          key: "return",
          value: function _return(returnNext) {
            if (returnNext) {
              this.returnResults = true;
              return this;
            } else {
              return this.lastResults;
            }
          }
        }]);

        return QuickBatch;
      }();

      if (QuickBatch.name == null) {
        QuickBatch.name = 'QuickBatch';
      }

      Object.keys(QuickElement.prototype).concat('css', 'replaceWith', 'html', 'text').forEach(function (method) {
        return QuickBatch.prototype[method] = function (newValue) {
          var element, results;

          results = this.lastResults = function () {
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
                var _element;

                results1.push((_element = element)[method].apply(_element, arguments));
              }
            }

            return results1;
          }.apply(this, arguments);

          if (this.returnResults) {
            return results;
          } else {
            return this;
          }
        };
      });

      _QuickDom.batch = function (elements, returnResults) {
        if (!IS.iterable(elements)) {
          throw new Error("Batch: expected an iterable, got ".concat(String(elements)));
        } else if (!elements.length) {
          throw new Error("Batch: expected a non-empty element collection");
        }

        return new QuickBatch(elements, returnResults);
      };

      ;
      var QuickTemplate;

      var _extendByRef, extendTemplate, notDeepKeys, notKeys;

      notDeepKeys = ['relatedInstance', 'related', 'data'];
      notKeys = ['children', '_childRefs'];

      extendTemplate = function extendTemplate(currentOpts, newOpts, globalOpts) {
        var currentChild, currentChildren, globalOptsTransform, index, maxLength, needsTemplateWrap, newChild, newChildProcessed, newChildren, noChanges, output, ref, remainingNewChildren;

        if (globalOpts) {
          globalOptsTransform = {
            options: function options(opts) {
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

        output = extend.deep.nullDeletes.notKeys(notKeys).notDeep(notDeepKeys).transform(globalOptsTransform).clone(currentOpts, newOpts);
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

            newChildProcessed = function () {
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
            }();

            if (noChanges) {
              newChildProcessed = currentChild;
            } else if (needsTemplateWrap) {
              newChildProcessed = currentChild ? currentChild.extend(newChildProcessed, globalOpts) : new QuickTemplate(extend.clone(schema, newChildProcessed));
            }

            output.children.push(newChildProcessed);
          }
        } else if (IS.object(newChildren)) {
          newChildren = extend.allowNull.clone(newChildren);
          output.children = _extendByRef(newChildren, currentChildren, globalOpts);
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

      _extendByRef = function extendByRef(newChildrenRefs, currentChildren, globalOpts) {
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
              newChildProcessed = function () {
                switch (false) {
                  case !globalOpts:
                    return currentChild.extend(null, globalOpts);

                  case !Object.keys(newChildrenRefs).length:
                    return currentChild.extend();

                  default:
                    return currentChild;
                }
              }();
            }

            newChildProcessed.children = _extendByRef(newChildrenRefs, newChildProcessed.children);
            output.push(newChildProcessed);
          }

          return output;
        }
      };

      ;
      var parseErrorPrefix, parseTree;

      parseTree = function parseTree(tree, parseChildren) {
        var output;

        switch (false) {
          case !IS.array(tree):
            output = {};

            if (!IS.string(tree[0])) {
              throw new Error("".concat(parseErrorPrefix, " string for 'type', got '").concat(String(tree[0]), "'"));
            } else {
              output.type = tree[0];
            }

            if (tree.length > 1 && !IS.object(tree[1]) && tree[1] !== null) {
              throw new Error("".concat(parseErrorPrefix, " object for 'options', got '").concat(String(tree[1]), "'"));
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
              output.children = output.children.map(_QuickDom.template);
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
              children: schema.children.map.call(tree.childNodes, _QuickDom.template)
            };

          case !IS.quickDomEl(tree):
            return {
              type: tree.type,
              ref: tree.ref,
              options: extend.clone.deep.notKeys(['relatedInstance', 'related'])(tree.options),
              children: tree.children.map(_QuickDom.template)
            };

          case !IS.template(tree):
            return tree;

          default:
            throw new Error("".concat(parseErrorPrefix, " (array || string || domEl || quickDomEl || template), got ").concat(String(tree)));
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

      matchesSchema = function matchesSchema(object) {
        return typeof object.type !== 'undefined' || typeof object.ref !== 'undefined' || typeof object.options !== 'undefined' || typeof object.children !== 'undefined';
      };

      ;

      QuickTemplate =
      /*#__PURE__*/
      function () {
        function QuickTemplate(config, isTree) {
          _classCallCheck(this, QuickTemplate);

          if (IS.template(config)) {
            return config;
          }

          config = isTree ? parseTree(config) : config;
          extend(this, config);
        }

        _createClass(QuickTemplate, [{
          key: "extend",
          value: function extend(newValues, globalOpts) {
            return new QuickTemplate(extendTemplate(this, newValues, globalOpts));
          }
        }, {
          key: "spawn",
          value: function spawn(newValues, globalOpts, data) {
            var child, childData, children, element, i, len, options, type;

            if (newValues && newValues.data) {
              data = newValues.data;

              if (Object.keys(newValues).length === 1) {
                newValues = null;
              }
            }

            if (newValues || globalOpts) {
              var _extendTemplate = extendTemplate(this, newValues, globalOpts);

              options = _extendTemplate.options;
              children = _extendTemplate.children;
              type = _extendTemplate.type;
            } else {
              options = this.options;
              children = this.children;
              type = this.type;
              options = extend.clone(options);
            }

            element = _QuickDom.create([type, options]);

            if (children) {
              childData = options.passDataToChildren ? data || options.data : void 0;

              for (i = 0, len = children.length; i < len; i++) {
                child = children[i];
                element.append(child.spawn(null, null, childData));
              }
            }

            element._postCreation(data);

            return element;
          }
        }]);

        return QuickTemplate;
      }();

      if (QuickTemplate.name == null) {
        QuickTemplate.name = 'QuickTemplate';
      }

      Object.defineProperty(QuickTemplate.prototype, 'child', {
        get: function get() {
          return this._childRefs || _getChildRefs2(this);
        }
      });
      ;
      var i, len, shortcut, shortcuts;
      shortcuts = ['link:a', 'anchor:a', 'a', 'text', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'section', 'button', 'br', 'ul', 'ol', 'li', 'fieldset', 'input', 'textarea', 'select', 'option', 'form', 'frame', 'hr', 'iframe', 'img', 'picture', 'main', 'nav', 'meta', 'object', 'pre', 'style', 'table', 'tbody', 'th', 'tr', 'td', 'tfoot', 'video'];

      for (i = 0, len = shortcuts.length; i < len; i++) {
        shortcut = shortcuts[i];

        (function (shortcut) {
          var prop, split, type;
          prop = type = shortcut;

          if (helpers.includes(shortcut, ':')) {
            split = shortcut.split(':');
            prop = split[0];
            type = split[1];
          }

          return _QuickDom[prop] = function () {
            return _QuickDom.apply(void 0, [type].concat(Array.prototype.slice.call(arguments)));
          };
        })(shortcut);
      }

      ;
      _QuickDom.version = "1.0.90";
      _QuickDom.CSS = CSS;
      module.exports = _QuickDom;
      return module.exports;
    },
    3: function _(require, module, exports) {
      var IS;
      IS = require(24);
      IS = IS.create('natives', 'dom');
      IS.load({
        field: function field(target) {
          return target && target instanceof require(9);
        },
        regex: function regex(target) {
          return target instanceof RegExp;
        },
        objectable: function objectable(target) {
          return IS.object(target) || IS.function(target);
        }
      });
      module.exports = IS;
      return module.exports;
    },
    4: function _(require, module, exports) {
      var exports, extend, modifiers, newBuilder, normalizeKeys;
      extend = require(25);

      normalizeKeys = function normalizeKeys(keys) {
        var i, key, len, output;

        if (keys) {
          output = {};

          if (_typeof(keys) !== 'object') {
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

      newBuilder = function newBuilder(isBase) {
        var _builder2;

        _builder2 = function builder(target) {
          var theTarget;
          var $_len = arguments.length,
              $_i = -1,
              sources = new Array($_len);

          while (++$_i < $_len) {
            sources[$_i] = arguments[$_i];
          }

          if (_builder2.options.target) {
            theTarget = _builder2.options.target;
          } else {
            theTarget = target;
            sources.shift();
          }

          return extend(_builder2.options, theTarget, sources);
        };

        if (isBase) {
          _builder2.isBase = true;
        }

        _builder2.options = {};
        Object.defineProperties(_builder2, modifiers);
        return _builder2;
      };

      modifiers = {
        'deep': {
          get: function get() {
            var _;

            _ = this.isBase ? newBuilder() : this;
            _.options.deep = true;
            return _;
          }
        },
        'own': {
          get: function get() {
            var _;

            _ = this.isBase ? newBuilder() : this;
            _.options.own = true;
            return _;
          }
        },
        'allowNull': {
          get: function get() {
            var _;

            _ = this.isBase ? newBuilder() : this;
            _.options.allowNull = true;
            return _;
          }
        },
        'nullDeletes': {
          get: function get() {
            var _;

            _ = this.isBase ? newBuilder() : this;
            _.options.nullDeletes = true;
            return _;
          }
        },
        'concat': {
          get: function get() {
            var _;

            _ = this.isBase ? newBuilder() : this;
            _.options.concat = true;
            return _;
          }
        },
        'clone': {
          get: function get() {
            var _;

            _ = this.isBase ? newBuilder() : this;
            _.options.target = {};
            return _;
          }
        },
        'notDeep': {
          get: function get() {
            var _;

            _ = this.isBase ? newBuilder() : this;
            return function (keys) {
              _.options.notDeep = normalizeKeys(keys);
              return _;
            };
          }
        },
        'deepOnly': {
          get: function get() {
            var _;

            _ = this.isBase ? newBuilder() : this;
            return function (keys) {
              _.options.deepOnly = normalizeKeys(keys);
              return _;
            };
          }
        },
        'keys': {
          get: function get() {
            var _;

            _ = this.isBase ? newBuilder() : this;
            return function (keys) {
              _.options.keys = normalizeKeys(keys);
              return _;
            };
          }
        },
        'notKeys': {
          get: function get() {
            var _;

            _ = this.isBase ? newBuilder() : this;
            return function (keys) {
              _.options.notKeys = normalizeKeys(keys);
              return _;
            };
          }
        },
        'transform': {
          get: function get() {
            var _;

            _ = this.isBase ? newBuilder() : this;
            return function (transform) {
              if (typeof transform === 'function') {
                _.options.globalTransform = transform;
              } else if (transform && _typeof(transform) === 'object') {
                _.options.transforms = transform;
              }

              return _;
            };
          }
        },
        'filter': {
          get: function get() {
            var _;

            _ = this.isBase ? newBuilder() : this;
            return function (filter) {
              if (typeof filter === 'function') {
                _.options.globalFilter = filter;
              } else if (filter && _typeof(filter) === 'object') {
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
    5: function _(require, module, exports) {
      var CSS;
      CSS = require(13);

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
    6: function _(require, module, exports) {
      module.exports = ['_getValue', '_setValue', '_validate'];
      return module.exports;
    },
    9: function _(require, module, exports) {
      var Condition, Field, IS, SimplyBind, currentID, extend, fastdom, helpers;
      helpers = require(1);
      IS = require(3);
      extend = require(4);
      fastdom = require(27);
      SimplyBind = require(11);
      Condition = require(28);
      currentID = 0;

      Field = function () {
        var Field =
        /*#__PURE__*/
        function () {
          function Field(settings, builder, settingOverrides, templateOverrides) {
            _classCallCheck(this, Field);

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
              this.template = templateOverrides[settings.type].default;
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
              this.state.width = "".concat(this.settings.width * 100, "%");
            }

            if ((ref = this.settings.conditions) != null ? ref.length : void 0) {
              this.state.visible = false;
              Condition.init(this, this.settings.conditions);
            }

            if (this.allFields[this.ID]) {
              if (typeof console !== "undefined" && console !== null) {
                console.warn("Duplicate field IDs found: '".concat(this.ID, "'"));
              }
            }

            this.allFields[this.ID] = this;
          }

          _createClass(Field, [{
            key: "_constructorEnd",
            value: function _constructorEnd() {
              var _this8 = this;

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
              }).of(this.state).to('help').of(this.state).transform(function (show) {
                if (show && _this8.state.error && IS.string(_this8.state.error)) {
                  return _this8.state.error;
                } else {
                  return _this8.settings.help || _this8.state.help;
                }
              });
              SimplyBind('error', {
                updateOnBind: false
              }).of(this.state).to('help').of(this.state).condition(function (error) {
                return error && _this8.state.showError;
              });
              SimplyBind('help').of(this.state).to('html').of(this.el.child.help).and.to('showHelp').of(this.state);
              SimplyBind('label').of(this.state).to('text').of(this.el.child.label).and.to('showLabel').of(this.state);
              SimplyBind('margin').of(this.state).to(this.el.style.bind(this.el, 'margin'));
              SimplyBind('padding').of(this.state).to(this.el.style.bind(this.el, 'padding'));
              SimplyBind('showHelp').of(this.state).to(function (show, prevShow) {
                var changeAmount;

                if (_this8.settings.makeRoomForHelp) {
                  changeAmount = !!show === !!prevShow ? 0 : show ? 25 : prevShow ? -25 : void 0;

                  if (changeAmount) {
                    return _this8.state.margin = helpers.updateShorthandValue(_this8.state.margin, 'bottom', changeAmount);
                  }
                }
              });
              SimplyBind('focused', {
                updateOnBind: false
              }).of(this.state).to(function (focused) {
                return _this8.emit(focused ? 'focus' : 'blur');
              });

              if (this.settings.mobileWidth) {
                SimplyBind(function () {
                  return fastdom.measure(function () {
                    return _this8.state.isMobile = window.innerWidth <= _this8.settings.mobileThreshold;
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
          }, {
            key: "_formatWidth",
            value: function _formatWidth(width) {
              width = this.state.isMobile ? this.settings.mobileWidth || width : width;

              if (this.settings.distance && width !== '100%') {
                width = "calc(".concat(width, " - ").concat(this.settings.distance, "px)");
              }

              return width;
            }
          }, {
            key: "appendTo",
            value: function appendTo(target) {
              this.el.appendTo(target);
              return this;
            }
          }, {
            key: "prependTo",
            value: function prependTo(target) {
              this.el.prependTo(target);
              return this;
            }
          }, {
            key: "insertAfter",
            value: function insertAfter(target) {
              this.el.insertAfter(target);
              return this;
            }
          }, {
            key: "insertBefore",
            value: function insertBefore(target) {
              this.el.insertBefore(target);
              return this;
            }
          }, {
            key: "detach",
            value: function detach(target) {
              this.el.detach(target);
              return this;
            }
          }, {
            key: "remove",
            value: function remove() {
              this.el.remove();
              return this.destroy(false);
            }
          }, {
            key: "destroy",
            value: function destroy() {
              var removeFromDOM = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
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
          }, {
            key: "on",
            value: function on(eventNames, callback, useCapture) {
              this.el.on.call(this.el, eventNames, callback, useCapture, true);
              return this;
            }
          }, {
            key: "once",
            value: function once(eventNames, callback, useCapture) {
              var _this9 = this,
                  _arguments = arguments;

              return this.on(eventNames, function () {
                _this9.off(eventNames, callback);

                return callback.apply(_this9.el, _arguments);
              }, useCapture);
            }
          }, {
            key: "off",
            value: function off() {
              this.el.off.apply(this.el, arguments);
              return this;
            }
          }, {
            key: "emit",
            value: function emit() {
              this.el.emitPrivate.apply(this.el, arguments);
              return this;
            }
          }, {
            key: "validate",
            value: function validate() {
              var providedValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this[this.coreValueProp];
              var testUnrequired = arguments.length > 1 ? arguments[1] : undefined;
              var report = arguments.length > 2 ? arguments[2] : undefined;
              var isValid;

              isValid = function () {
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
              }.call(this);

              if (isValid && this.settings.clearErrorOnValid) {
                this.state.showError = false;
              }

              return isValid;
            }
          }, {
            key: "validateConditions",
            value: function validateConditions(conditions) {
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
          }, {
            key: "validateAndReport",
            value: function validateAndReport(providedValue, testUnrequired) {
              var isValid;
              isValid = this.validate(providedValue, testUnrequired, true);
              this.state.showError = !isValid;
              return isValid;
            }
          }]);

          return Field;
        }();

        ;
        Field.instances = Object.create(null);
        Field.shallowSettings = ['templates', 'fieldInstances', 'value', 'defaultValue'];
        Field.transformSettings = {
          'conditions': function conditions(_conditions) {
            var results, target, value;

            if (IS.objectPlain(_conditions)) {
              results = [];

              for (target in _conditions) {
                value = _conditions[target];
                results.push({
                  target: target,
                  value: value
                });
              }

              return results;
            } else if (IS.array(_conditions)) {
              return _conditions.map(function (item) {
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
          'choices': function choices(_choices) {
            var label, results, value;

            if (IS.objectPlain(_choices)) {
              results = [];

              for (label in _choices) {
                value = _choices[label];
                results.push({
                  label: label,
                  value: value
                });
              }

              return results;
            } else if (IS.array(_choices)) {
              return _choices.map(function (item) {
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
          'validWhenRegex': function validWhenRegex(regex) {
            if (IS.string(regex)) {
              return new RegExp(regex);
            } else {
              return regex;
            }
          }
        };
        ;
        Field.prototype.coreValueProp = '_value';
        Field.prototype.globalDefaults = require(30);
        Object.defineProperties(Field.prototype, {
          'removeListener': {
            get: function get() {
              return this.off;
            }
          },
          'els': {
            get: function get() {
              return this.el.child;
            }
          },
          'valueRaw': {
            get: function get() {
              return this._value;
            }
          },
          'value': {
            get: function get() {
              if (this.settings.getter) {
                return this.settings.getter(this._getValue());
              } else {
                return this._getValue();
              }
            },
            set: function set(value) {
              return this._setValue(this.settings.setter ? this.settings.setter(value) : value);
            }
          }
        });
        return Field;
      }.call(this);

      module.exports = Field;
      return module.exports;
    },
    10: function _(require, module, exports) {
      var DOM, Dropdown, IS, KEYCODES, Mask, REGEX, SimplyBind, TextField, extend, helpers;
      Dropdown = require(31);
      Mask = require(32);
      REGEX = require(12);
      KEYCODES = require(33);
      helpers = require(1);
      IS = require(3);
      DOM = require(2);
      extend = require(4);
      SimplyBind = require(11);

      var templates = require(34);

      var defaults = require(35);

      TextField = function () {
        var TextField =
        /*#__PURE__*/
        function (_require) {
          _inherits(TextField, _require);

          function TextField() {
            var _this10;

            _classCallCheck(this, TextField);

            _this10 = _possibleConstructorReturn(this, _getPrototypeOf(TextField).apply(this, arguments));

            if (_this10._value == null) {
              _this10._value = '';
            }

            _this10.state.typing = false;
            _this10.cursor = {
              prev: 0,
              current: 0
            };

            if (!_this10.settings.validWhenRegex) {
              if (_this10.settings.keyboard === 'email' && _this10.settings.required) {
                _this10.settings.validWhenRegex = REGEX.email;
              } else if (_this10.settings.mask === 'NAME' || _this10.settings.mask.pattern === 'NAME') {
                _this10.settings.validWhenRegex = /^[a-zA-Z]{2}/;
              } else if (_this10.settings.mask === 'FULLNAME' || _this10.settings.mask.pattern === 'FULLNAME') {
                _this10.settings.validWhenRegex = /^[a-zA-Z]+\s+[a-zA-Z]+/;
              }
            }

            if (!_this10.settings.mask.pattern) {
              if (IS.string(_this10.settings.mask)) {
                _this10.settings.mask = extend.deep.clone(_this10.defaults.mask, {
                  pattern: _this10.settings.mask
                });
              } else if (IS.object(_this10.settings.mask)) {
                _this10.settings.mask.pattern = function () {
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
                }.call(_assertThisInitialized(_assertThisInitialized(_this10)));
              }
            }

            if (_this10.settings.mask.pattern) {
              _this10.mask = new Mask(_assertThisInitialized(_assertThisInitialized(_this10)), _this10.settings.mask);
            }

            _this10._createElements();

            _this10._attachBindings();

            _this10._constructorEnd();

            return _this10;
          }

          _createClass(TextField, [{
            key: "_getValue",
            value: function _getValue() {
              if (this.dropdown && this.selected && this._value === this.selected.label) {
                return this.selected.value;
              } else {
                return this._value;
              }
            }
          }, {
            key: "_setValue",
            value: function _setValue(newValue) {
              if (IS.string(newValue) || IS.number(newValue)) {
                newValue = String(newValue);
                return this._value = this.mask ? this.mask.setValue(newValue) : newValue;
              }
            }
          }, {
            key: "_recalcDisplay",
            value: function _recalcDisplay() {
              if (this.settings.autoWidth) {
                return this._value = this._value;
              }
            }
          }, {
            key: "_createElements",
            value: function _createElements() {
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
                    return 'text';
                }
              }.call(this));
              this.el.state('hasLabel', this.settings.label);
              this.el.child.innerwrap.raw._quickField = this.el.child.input.raw._quickField = this;
              return this.el.childf;
            }
          }, {
            key: "_attachBindings",
            value: function _attachBindings() {
              this._attachBindings_elState();

              this._attachBindings_display();

              this._attachBindings_display_autoWidth();

              this._attachBindings_value();

              this._attachBindings_autocomplete();

              this._attachBindings_stateTriggers();
            }
          }, {
            key: "_attachBindings_elState",
            value: function _attachBindings_elState() {
              var _this11 = this;

              SimplyBind('visible').of(this.state).to(function (visible) {
                return _this11.el.state('visible', visible);
              });
              SimplyBind('hovered').of(this.state).to(function (hovered) {
                return _this11.el.state('hover', hovered);
              });
              SimplyBind('focused').of(this.state).to(function (focused) {
                return _this11.el.state('focus', focused);
              });
              SimplyBind('filled').of(this.state).to(function (filled) {
                return _this11.el.state('filled', filled);
              });
              SimplyBind('disabled').of(this.state).to(function (disabled) {
                return _this11.el.state('disabled', disabled);
              });
              SimplyBind('showLabel').of(this.state).to(function (showLabel) {
                return _this11.el.state('showLabel', showLabel);
              });
              SimplyBind('showError').of(this.state).to(function (showError) {
                return _this11.el.state('showError', showError);
              });
              SimplyBind('showHelp').of(this.state).to(function (showHelp) {
                return _this11.el.state('showHelp', showHelp);
              });
              SimplyBind('valid').of(this.state).to(function (valid) {
                _this11.el.state('valid', valid);

                return _this11.el.state('invalid', !valid);
              });
            }
          }, {
            key: "_attachBindings_display",
            value: function _attachBindings_display() {
              var _this12 = this;

              SimplyBind('placeholder').of(this.state).to('text').of(this.el.child.placeholder).transform(function (placeholder) {
                switch (false) {
                  case !(placeholder === true && _this12.settings.label):
                    return _this12.settings.label;

                  case !IS.string(placeholder):
                    return placeholder;

                  default:
                    return '';
                }
              });
              SimplyBind('disabled', {
                updateOnBind: this.state.disabled
              }).of(this.state).to(function (disabled, prev) {
                if (_this12.settings.checkmark) {
                  if (disabled || !disabled && prev != null) {
                    return setTimeout(function () {
                      _this12.el.child.checkmark_mask1.recalcStyle();

                      _this12.el.child.checkmark_mask2.recalcStyle();

                      return _this12.el.child.checkmark_patch.recalcStyle();
                    });
                  }
                }
              });
            }
          }, {
            key: "_attachBindings_display_autoWidth",
            value: function _attachBindings_display_autoWidth() {
              var _this13 = this;

              SimplyBind('width', {
                updateEvenIfSame: true
              }).of(this.state).to(function (width) {
                return (_this13.settings.autoWidth ? _this13.el.child.input : _this13.el).style('width', width);
              }).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);

              if (this.settings.autoWidth) {
                SimplyBind('_value', {
                  updateEvenIfSame: true,
                  updateOnBind: false
                }).of(this).to('width').of(this.state).transform(function () {
                  return "".concat(_this13._getInputAutoWidth(), "px");
                }).updateOn('event:inserted').of(this.el).updateOn('visible').of(this.state);
              }
            }
          }, {
            key: "_attachBindings_value",
            value: function _attachBindings_value() {
              var _this14 = this;

              var input, resetInput;
              input = this.el.child.input.raw;

              resetInput = function resetInput() {
                var filled;
                filled = !_this14.mask.isEmpty();

                if (!filled) {
                  _this14.selection(_this14.mask.cursor = 0);

                  _this14._value = '';
                  _this14.state.filled = false;
                }

                return filled;
              };

              SimplyBind('event:input').of(input).to(function () {
                _this14.value = input.value;

                if (_this14.mask) {
                  _this14.selection(_this14.mask.cursor);
                }

                return _this14.emit('input', _this14.value);
              });
              SimplyBind('_value', {
                updateEvenIfSame: !!this.mask
              }).of(this).to('value').of(input).and.to(function (value) {
                var filled;
                filled = !!value;

                if (filled && _this14.mask && _this14.mask.guide && (!_this14.state.focused || _this14.mask.cursor === 0)) {
                  filled = resetInput();
                }

                _this14.state.filled = filled;

                if (filled) {
                  _this14.state.interacted = true;
                }

                _this14.state.valid = _this14.validate(void 0, true);

                if (!_this14.state.focused) {
                  return _this14.emit('input', _this14.value);
                }
              });
              SimplyBind('event:keydown').of(this.el.child.input).to(function (event) {
                if (event.keyCode === KEYCODES.enter) {
                  _this14.emit('submit');
                }

                return _this14.emit("key-".concat(event.keyCode));
              });

              if (this.mask && this.mask.guide) {
                SimplyBind('event:blur').of(this.el.child.input).to(resetInput);
              }
            }
          }, {
            key: "_attachBindings_autocomplete",
            value: function _attachBindings_autocomplete() {
              var _this15 = this;

              if (this.dropdown) {
                SimplyBind.defaultOptions.updateOnBind = false;
                SimplyBind('typing', {
                  updateEvenIfSame: true
                }).of(this.state).to(function (isTyping) {
                  if (isTyping) {
                    if (!_this15._value) {
                      return;
                    }

                    if (_this15.dropdown.isOpen) {
                      return _this15.dropdown.list.calcDisplay();
                    } else {
                      _this15.dropdown.isOpen = true;
                      return SimplyBind('event:click').of(document).once.to(function () {
                        return _this15.dropdown.isOpen = false;
                      }).condition(function (event) {
                        return !DOM(event.target).parentMatching(function (parent) {
                          return parent === _this15.el.child.innerwrap;
                        });
                      });
                    }
                  } else {
                    return _this15.dropdown.isOpen = false;
                  }
                });
                SimplyBind('_value').of(this).to(function (value) {
                  var choice, i, len, ref, shouldBeVisible;
                  ref = _this15.dropdown.choices;

                  for (i = 0, len = ref.length; i < len; i++) {
                    choice = ref[i];
                    shouldBeVisible = !value ? true : helpers.fuzzyMatch(value, choice.label);

                    if (choice.visible !== shouldBeVisible) {
                      choice.visible = shouldBeVisible;
                    }
                  }

                  if (_this15.dropdown.isOpen && !value) {
                    _this15.dropdown.isOpen = false;
                  }
                });
                this.dropdown.onSelected(function (selectedChoice) {
                  _this15.selected = selectedChoice;
                  _this15.value = selectedChoice.label;
                  _this15.dropdown.isOpen = false;
                  return _this15.selection(_this15.el.child.input.raw.value.length);
                });
                SimplyBind.defaultOptions.updateOnBind = true;
              }
            }
          }, {
            key: "_attachBindings_stateTriggers",
            value: function _attachBindings_stateTriggers() {
              var _this16 = this;

              SimplyBind('event:mouseenter').of(this.el.child.input).to(function () {
                return _this16.state.hovered = true;
              });
              SimplyBind('event:mouseleave').of(this.el.child.input).to(function () {
                return _this16.state.hovered = false;
              });
              SimplyBind('event:focus').of(this.el.child.input).to(function () {
                _this16.state.focused = true;

                if (_this16.state.disabled) {
                  return _this16.blur();
                }
              });
              SimplyBind('event:blur').of(this.el.child.input).to(function () {
                return _this16.state.typing = _this16.state.focused = false;
              });
              SimplyBind('event:input').of(this.el.child.input).to(function () {
                return _this16.state.typing = true;
              });
              SimplyBind('event:keydown').of(this.el.child.input).to(function () {
                return _this16.cursor.prev = _this16.selection().end;
              });
            }
          }, {
            key: "_scheduleCursorReset",
            value: function _scheduleCursorReset() {
              var currentCursor, diffIndex, newCursor;
              diffIndex = helpers.getIndexOfFirstDiff(this.mask.value, this.mask.prev.value);
              currentCursor = this.cursor.current;
              newCursor = this.mask.normalizeCursorPos(currentCursor, this.cursor.prev);

              if (newCursor !== currentCursor) {
                this.selection(newCursor);
              }
            }
          }, {
            key: "_setValueIfNotSet",
            value: function _setValueIfNotSet() {
              if (this.el.child.input.raw.value !== this._value) {
                this.el.child.input.raw.value = this._value;
              }
            }
          }, {
            key: "_getInputAutoWidth",
            value: function _getInputAutoWidth() {
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
          }, {
            key: "_getWidthSetting",
            value: function _getWidthSetting(target) {
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
            }
          }, {
            key: "_validate",
            value: function _validate(providedValue) {
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
          }, {
            key: "selection",
            value: function selection(arg) {
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
          }, {
            key: "focus",
            value: function focus() {
              return this.el.child.input.raw.focus();
            }
          }, {
            key: "blur",
            value: function blur() {
              return this.el.child.input.raw.blur();
            }
          }]);

          return TextField;
        }(require(9));

        ;
        TextField.prototype.template = templates.default;
        TextField.prototype.templates = templates;
        TextField.prototype.defaults = defaults;
        return TextField;
      }.call(this);

      module.exports = TextField;
      return module.exports;
    },
    11: function _(require, module, exports) {
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
          get: function get() {
            return placeholder;
          },
          set: function set(newPlaceholder) {
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

      changeEvent = function changeEvent() {
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
      requiresDomDescriptorFix = !('className' in Element.prototype) || !getDescriptor(Element.prototype, 'className').get;
      ;
      var windowPropsToIgnore;
      windowPropsToIgnore = ['innerWidth', 'innerHeight', 'outerWidth', 'outerHeight', 'scrollX', 'scrollY', 'pageXOffset', 'pageYOffset', 'screenX', 'screenY', 'screenLeft', 'screenTop'];
      ;

      setValueNoop = function setValueNoop(v, publisher) {
        return this.updateAllSubs(publisher || this);
      };

      genID = function genID() {
        return '' + ++currentID;
      };

      genObj = function genObj() {
        return Object.create(null);
      };

      genProxiedInterface = function genProxiedInterface(isSub, completeCallback) {
        return function (subject, customOptions, saveOptions) {
          return SimplyBind(subject, customOptions, saveOptions, isSub, completeCallback);
        };
      };

      genSelfUpdater = function genSelfUpdater(binding, fetchValue) {
        return binding.selfUpdater || (binding.selfUpdater = new Binding(function () {
          if (fetchValue) {
            return binding.setValue(binding.fetchDirectValue(), binding, true);
          } else {
            return binding.updateAllSubs(binding);
          }
        }, 'Func', {}));
      };

      var checkIf, targetIncludes;

      targetIncludes = function targetIncludes(target, item) {
        return target && target.indexOf(item) !== -1;
      };

      checkIf = {
        isDefined: function isDefined(subject) {
          return subject !== void 0;
        },
        isArray: function isArray(subject) {
          return subject instanceof Array;
        },
        isObject: function isObject(subject) {
          return _typeof(subject) === 'object' && subject;
        },
        isString: function isString(subject) {
          return typeof subject === 'string';
        },
        isNumber: function isNumber(subject) {
          return typeof subject === 'number';
        },
        isFunction: function isFunction(subject) {
          return typeof subject === 'function';
        },
        isBindingInterface: function isBindingInterface(subject) {
          return subject instanceof BindingInterface;
        },
        isBinding: function isBinding(subject) {
          return subject instanceof Binding;
        },
        isIterable: function isIterable(subject) {
          return checkIf.isObject(subject) && checkIf.isNumber(subject.length);
        },
        isDom: function isDom(subject) {
          return subject.nodeName && subject.nodeType === 1;
        },
        isDomInput: function isDomInput(subject) {
          var nodeName;
          nodeName = subject.nodeName;
          return nodeName === 'INPUT' || nodeName === 'TEXTAREA' || nodeName === 'SELECT';
        },
        isDomRadio: function isDomRadio(subject) {
          return subject.type === 'radio';
        },
        isDomCheckbox: function isDomCheckbox(subject) {
          return subject.type === 'checkbox';
        },
        isElCollection: function isElCollection(subject) {
          return subject instanceof NodeList || subject instanceof HTMLCollection || window.jQuery && subject instanceof jQuery;
        },
        domElsAreSame: function domElsAreSame(iterable) {
          var itemsWithSameType, type;
          type = iterable[0].type;
          itemsWithSameType = [].filter.call(iterable, function (item) {
            return item.type === type;
          });
          return itemsWithSameType.length === iterable.length;
        },
        isDomNode: function isDomNode(subject) {
          return checkIf.isDom(subject) || subject === window || subject === document;
        }
      };
      ;

      var _convertToLive, convertToReg, _fetchDescriptor;

      _fetchDescriptor = function fetchDescriptor(object, property, isProto) {
        var descriptor, objectProto;
        descriptor = getDescriptor(object, property);

        if (descriptor) {
          if (isProto) {
            descriptor.configurable = true;
          }

          return descriptor;
        } else if (objectProto = Object.getPrototypeOf(object)) {
          return _fetchDescriptor(objectProto, property, true);
        }
      };

      _convertToLive = function convertToLive(bindingInstance, object, onlyArrayMethods) {
        var _, context, getterValue, origFn, propertyDescriptor, proxyFn, shouldIndicateUpdateIsFromSelf, shouldWriteLiveProp, slice, typeIsArray;

        _ = bindingInstance;

        if (!_.origDescriptor) {
          _.origDescriptor = _fetchDescriptor(object, _.property);
        }

        if (onlyArrayMethods) {
          arrayMutatorMethods.forEach(function (method) {
            return defineProperty(object, method, {
              configurable: true,
              value: function value() {
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

              getterValue = proxyFn = function proxyFn() {
                var args, result;
                args = slice.call(arguments);
                _.value.args = args = _.selfTransform ? _.selfTransform(args) : args;
                _.value.result = result = origFn.apply(context, args);

                _.updateAllSubs(_);

                return result;
              };

              defineProperty(object, _.property, {
                configurable: _.isLiveProp = true,
                get: function get() {
                  return getterValue;
                },
                set: function set(newValue) {
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

            if (requiresDomDescriptorFix && _.isDom && _.property in object.cloneNode(false)) {
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
                get: _.origGetter || function () {
                  return _.value;
                },
                set: function set(newValue) {
                  _.setValue(newValue, _, shouldIndicateUpdateIsFromSelf);
                }
              });

              if (typeIsArray) {
                _convertToLive(_, object[_.property], true);
              }
            }
          }
        }
      };

      convertToReg = function convertToReg(bindingInstance, object, onlyArrayMethods) {
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

      cloneObject = function cloneObject(object) {
        var clone, key;
        clone = genObj();

        for (key in object) {
          clone[key] = object[key];
        }

        return clone;
      };

      extendState = function extendState(base, stateToInherit) {
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
        get: function get(object, isFunction, selector, isMultiChoice) {
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
        set: function set(B, isFunction) {
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

      var addToNodeStore, applyPlaceholders, escapeRegEx, pholderRegEx, pholderRegExSplit, _scanTextNodesPlaceholders, setPholderRegEx, textContent;

      escapeRegEx = /[.*+?^${}()|[\]\\]/g;
      pholderRegEx = pholderRegExSplit = null;

      setPholderRegEx = function setPholderRegEx() {
        var end, middle, start;
        start = settings.placeholder[0].replace(escapeRegEx, '\\$&');
        end = settings.placeholder[1].replace(escapeRegEx, '\\$&');
        middle = "[^".concat(end, "]+");
        pholderRegEx = new RegExp("".concat(start, "(").concat(middle, ")").concat(end), 'g');
        pholderRegExSplit = new RegExp("".concat(start).concat(middle).concat(end), 'g');
      };

      setPholderRegEx();

      applyPlaceholders = function applyPlaceholders(contexts, values, indexMap) {
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

      addToNodeStore = function addToNodeStore(nodeStore, node, targetPlaceholder) {
        if (nodeStore[targetPlaceholder] == null) {
          nodeStore[targetPlaceholder] = [];
        }

        nodeStore[targetPlaceholder].push(node);
      };

      _scanTextNodesPlaceholders = function scanTextNodesPlaceholders(element, nodeStore) {
        var childNodes, i, index, j, len, len1, newFragment, newNode, node, textPiece, textPieces;
        childNodes = Array.prototype.slice.call(element.childNodes);

        for (i = 0, len = childNodes.length; i < len; i++) {
          node = childNodes[i];

          if (node.nodeType !== 3) {
            _scanTextNodesPlaceholders(node, nodeStore);
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

      throwError = function throwError(errorName) {
        throw new Error('SimplyBind: ' + (errors[errorName] || errorName));
      };

      throwWarning = function throwWarning(warningName, depth) {
        var errSource, warn;

        if (!settings.silent) {
          errSource = getErrSource(depth);
          warn = errors[warningName];
          warn += "\n\n" + errSource;
          console.warn('SimplyBind: ' + warn);
        }
      };

      throwErrorBadArg = function throwErrorBadArg(arg) {
        throwError("Invalid argument/s (".concat(arg, ")"), true);
      };

      getErrSource = function getErrSource(depth) {
        return (new Error().stack || '').split('\n').slice(depth + 3).join('\n');
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

      SimplyBind = function SimplyBind(subject, options, saveOptions, isSub, completeCallback) {
        var interfaceToReturn, newInterface;

        if (!subject && subject !== 0 || !checkIf.isString(subject) && !checkIf.isNumber(subject) && !checkIf.isFunction(subject) && !(subject instanceof Array)) {
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

          if (checkIf.isIterable(object) && !object._sb_ID && object[0] && checkIf.isDom(object[0])) {
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

      Binding = function Binding(object, type, state) {
        var _this17 = this;

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
          this.object.forEach(function (choiceEl) {
            var choiceBinding;
            choiceBinding = _this17.choices[choiceEl.value] = SimplyBind('checked').of(choiceEl)._;
            choiceBinding.addSub(_this17);

            choiceBinding.subsMeta[_this17.ID].transformFn = function () {
              return choiceBinding;
            };

            choiceBinding.groupBinding = _this17;
          });
        }

        if (!(this.type === 'Event' || this.type === 'Func' && this.isSub)) {
          if (this.type === 'Pholder') {
            parentProperty = this.descriptor && !targetIncludes(this.descriptor, 'multi') ? "".concat(this.descriptor, ":").concat(this.property) : this.property;
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

            _convertToLive(this, this.object);
          }
        }

        this.attachEvents();
        return boundInstances[this.ID] = this;
      };

      var eventUpdateHandler;
      Binding.prototype = {
        addSub: function addSub(sub, options, updateOnce, updateEvenIfSame) {
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
        removeSub: function removeSub(sub, bothWays) {
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
        removeAllSubs: function removeAllSubs(bothWays) {
          var j, len, ref, sub;
          ref = this.subs.slice();

          for (j = 0, len = ref.length; j < len; j++) {
            sub = ref[j];
            this.removeSub(sub, bothWays);
          }
        },
        destroy: function destroy() {
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
        fetchDirectValue: function fetchDirectValue() {
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
        setValue: function setValue(newValue, publisher, fromSelf, fromChangeEvent) {
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

                  _convertToLive(this, newValue = newValue.slice(), true);

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
        updateAllSubs: function updateAllSubs(publisher) {
          var arr, i;

          if (i = (arr = this.subs).length) {
            while (i--) {
              this.updateSub(arr[i], publisher);
            }
          }
        },
        updateSub: function updateSub(sub, publisher, isDelayedUpdate) {
          var _this18 = this;

          var currentTime, meta, newValue, subValue, timePassed, transform;

          if (publisher === sub || publisher !== this && publisher.subsMeta[sub.ID]) {
            return;
          }

          meta = this.subsMeta[sub.ID];

          if (meta.disallowList && meta.disallowList[publisher.ID]) {
            return;
          }

          if (meta.opts.throttle) {
            currentTime = +new Date();
            timePassed = currentTime - meta.lastUpdate;

            if (timePassed < meta.opts.throttle) {
              clearTimeout(meta.updateTimer);
              return meta.updateTimer = setTimeout(function () {
                if (_this18.subsMeta[sub.ID]) {
                  return _this18.updateSub(sub, publisher);
                }
              }, meta.opts.throttle - timePassed);
            } else {
              meta.lastUpdate = currentTime;
            }
          } else if (meta.opts.delay && !isDelayedUpdate) {
            return setTimeout(function () {
              if (_this18.subsMeta[sub.ID]) {
                return _this18.updateSub(sub, publisher, true);
              }
            }, meta.opts.delay);
          }

          newValue = this.type === 'Array' && meta.opts.sendArrayCopies ? this.value.slice() : this.value;
          subValue = sub[meta.valueRef];
          newValue = (transform = meta.transformFn) ? transform(newValue, subValue, sub.object) : newValue;

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
        addModifierFn: function addModifierFn(target, subInterfaces, subjectFn, updateOnBind) {
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
        setSelfTransform: function setSelfTransform(transformFn, updateOnBind) {
          this.selfTransform = transformFn;

          if (updateOnBind) {
            this.setValue(this.value);
          }
        },
        addDisallowRule: function addDisallowRule(targetSub, targetDisallow) {
          var base, disallowList;
          disallowList = (base = this.subsMeta[targetSub.ID]).disallowList != null ? base.disallowList : base.disallowList = genObj();
          disallowList[targetDisallow.ID] = 1;
        },
        scanForPholders: function scanForPholders() {
          var _this19 = this;

          var index;

          if (!this.pholderValues) {
            this.pholderValues = genObj();
            this.pholderIndexMap = genObj();
            this.pholderContexts = [];

            if (checkIf.isString(this.value)) {
              this.pholderContexts = this.value.split(pholderRegExSplit);
              index = 0;
              this.value = this.value.replace(pholderRegEx, function (e, pholder) {
                _this19.pholderIndexMap[index++] = pholder;
                return _this19.pholderValues[pholder] = pholder;
              });
            }

            if (this.isDom && this.property === textContent) {
              _scanTextNodesPlaceholders(this.object, this.textNodes = genObj());
            }
          }
        },
        addPollInterval: function addPollInterval(time) {
          var _this20 = this;

          if (this.type !== 'Event') {
            this.removePollInterval();
            return this.pollInterval = setInterval(function () {
              var polledValue;
              polledValue = _this20.fetchDirectValue();
              return _this20.setValue(polledValue, _this20, true);
            }, time);
          }
        },
        removePollInterval: function removePollInterval() {
          clearInterval(this.pollInterval);
          return this.pollInterval = null;
        },
        addUpdateListener: function addUpdateListener(eventName, targetProperty) {
          var _this21 = this;

          this.object.addEventListener(eventName, function (event) {
            var shouldRedefineValue;

            if (!event._sb) {
              shouldRedefineValue = _this21.selfTransform && _this21.isDomInput;

              _this21.setValue(_this21.object[targetProperty], null, !shouldRedefineValue, true);
            }
          }, false);
        },
        attachEvents: function attachEvents() {
          if (this.eventName) {
            this.registerEvent(this.eventName);
          } else if (this.isDomInput) {
            this.addUpdateListener('input', 'value');
            this.addUpdateListener('change', 'value');
          } else if (!this.isMultiChoice && (this.type === 'DOMRadio' || this.type === 'DOMCheckbox')) {
            this.addUpdateListener('change', 'checked');
          }
        },
        registerEvent: function registerEvent(eventName) {
          this.attachedEvents.push(eventName);

          if (!this.eventHandler) {
            this.eventHandler = eventUpdateHandler.bind(this);
          }

          this.object[this.eventMethods.listen](eventName, this.eventHandler);
        },
        unRegisterEvent: function unRegisterEvent(eventName) {
          this.attachedEvents.splice(this.attachedEvents.indexOf(eventName), 1);
          this.object[this.eventMethods.remove](eventName, this.eventHandler);
        },
        emitEvent: function emitEvent(extraData) {
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

      eventUpdateHandler = function eventUpdateHandler() {
        if (!this.isEmitter) {
          this.setValue(arguments[this.property], null, true);
        }
      };

      ;
      ;
      var BindingInterface;

      BindingInterface = function BindingInterface(options, inheritedState) {
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
        selfClone: function selfClone() {
          return new BindingInterface(null, this);
        },
        defineMainProps: function defineMainProps(binding) {
          this._ = binding;
          return Object.defineProperties(this, {
            'value': {
              get: function get() {
                return binding.value;
              }
            },
            'original': {
              get: function get() {
                return binding.objects || binding.object;
              }
            },
            'subscribers': {
              get: function get() {
                return binding.subs.slice().map(function (sub) {
                  return sub.object;
                });
              }
            }
          });
        },
        createBinding: function createBinding(subject, newObjectType, bindingInterface, isFunction) {
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
        patchCachedBinding: function patchCachedBinding(cachedBinding) {
          var key, option, ref, ref1, value;

          if (cachedBinding.type === 'ObjectProp' && !(this.property in this.object)) {
            _convertToLive(cachedBinding, this.object);
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
        setProperty: function setProperty(subject) {
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
        setObject: function setObject(subject, isFunction) {
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
        addToPublisher: function addToPublisher(publisherInterface) {
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
          get: function get() {
            if (!this.stage) {
              return METHOD_of;
            }
          }
        },
        set: {
          get: function get() {
            if (this.stage) {
              return METHOD_set;
            }
          }
        },
        chainTo: {
          get: function get() {
            if (this.stage === 2) {
              return METHOD_chainTo;
            }
          }
        },
        transformSelf: {
          get: function get() {
            if (this.stage === 1) {
              return METHOD_transformSelf;
            }
          }
        },
        transform: {
          get: function get() {
            if (this.stage === 2) {
              return METHOD_transform;
            }
          }
        },
        transformAll: {
          get: function get() {
            if (this.stage === 2) {
              return METHOD_transformAll;
            }
          }
        },
        condition: {
          get: function get() {
            if (this.stage === 2) {
              return METHOD_condition;
            }
          }
        },
        conditionAll: {
          get: function get() {
            if (this.stage === 2) {
              return METHOD_conditionAll;
            }
          }
        },
        bothWays: {
          get: function get() {
            if (this.stage === 2) {
              return METHOD_bothWays;
            }
          }
        },
        unBind: {
          get: function get() {
            if (this.stage === 2) {
              return METHOD_unBind;
            }
          }
        },
        pollEvery: {
          get: function get() {
            if (this.stage) {
              return METHOD_pollEvery;
            }
          }
        },
        stopPolling: {
          get: function get() {
            if (this.stage) {
              return METHOD_stopPolling;
            }
          }
        },
        setOption: {
          get: function get() {
            if (this.stage === 2) {
              return METHOD_setOption;
            }
          }
        },
        disallowFrom: {
          get: function get() {
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
          get: function get() {
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
          get: function get() {
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
          get: function get() {
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
          get: function get() {
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
          get: function get() {
            var interfaceToReturn;

            if (this.stage === 1) {
              interfaceToReturn = this.selfClone();
              interfaceToReturn.updateOnce = true;
              return interfaceToReturn;
            }
          }
        },
        update: {
          get: function get() {
            return this.set;
          }
        },
        twoWay: {
          get: function get() {
            return this.bothWays;
          }
        },
        pipe: {
          get: function get() {
            return this.chainTo;
          }
        }
      });

      METHOD_of = function METHOD_of(object) {
        if (!(checkIf.isObject(object) || checkIf.isFunction(object))) {
          throwErrorBadArg(object);
        }

        if (checkIf.isBindingInterface(object)) {
          object = object.object;
        }

        this.stage = 1;
        return this.setObject(object);
      };

      METHOD_chainTo = function METHOD_chainTo(subject, specificOptions, saveOptions) {
        return SimplyBind(this.subs[this.subs.length - 1]).to(subject, specificOptions, saveOptions);
      };

      METHOD_set = function METHOD_set(newValue) {
        this._.setValue(newValue);

        return this;
      };

      METHOD_transformSelf = function METHOD_transformSelf(transformFn) {
        if (!checkIf.isFunction(transformFn)) {
          throwWarning('fnOnly', 1);
        } else {
          this._.setSelfTransform(transformFn, this.options.updateOnBind);
        }

        return this;
      };

      METHOD_transform = function METHOD_transform(transformFn) {
        this._.addModifierFn('transformFn', this.subs.slice(-1), transformFn, this.options.updateOnBind);

        return this;
      };

      METHOD_transformAll = function METHOD_transformAll(transformFn) {
        this._.addModifierFn('transformFn', this.subs, transformFn, this.options.updateOnBind);

        return this;
      };

      METHOD_condition = function METHOD_condition(conditionFn) {
        this._.addModifierFn('conditionFn', this.subs.slice(-1), conditionFn);

        return this;
      };

      METHOD_conditionAll = function METHOD_conditionAll(conditionFn) {
        this._.addModifierFn('conditionFn', this.subs, conditionFn);

        return this;
      };

      METHOD_bothWays = function METHOD_bothWays(altTransform) {
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

      METHOD_unBind = function METHOD_unBind(bothWays) {
        var i, len, ref, sub;
        ref = this.subs;

        for (i = 0, len = ref.length; i < len; i++) {
          sub = ref[i];

          this._.removeSub(sub._, bothWays);
        }

        return this;
      };

      METHOD_pollEvery = function METHOD_pollEvery(time) {
        this._.addPollInterval(time);

        return this;
      };

      METHOD_stopPolling = function METHOD_stopPolling() {
        this._.removePollInterval();

        return this;
      };

      METHOD_setOption = function METHOD_setOption(optionName, newValue) {
        this._.subsMeta[this.subs[this.subs.length - 1]._.ID].opts[optionName] = newValue;
        return this;
      };

      ;
      ;
      var GroupBinding, proto;

      GroupBinding = function GroupBinding(bindingInterface, objects, objectType) {
        var bindings, i, len, object;
        bindingInterface.selector = bindingInterface.selector.slice(6);
        extendState(this, this.interface = bindingInterface);
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
            get: function get() {
              return bindings.map(function (binding) {
                return binding.type;
              });
            }
          },
          'value': {
            get: function get() {
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

          for (i = 0, len = ref.length; i < len; i++) {
            binding = ref[i];

            if (methodName === 'updateSub') {
              b = binding;
            }

            binding[methodName](a, b, c, d);
          }
        };
      });

      proto.addBinding = function (object, objectType) {
        this.bindings.push(!objectType ? object : this.createBinding(object, objectType, this.interface));
      };

      ;
      module.exports = SimplyBind;
      return module.exports;
    },
    12: function _(require, module, exports) {
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
    13: function _(require, module, exports) {
      var _quickcss;

      var helpers = require(41);

      var __constants2 = require(42);

      _quickcss = function quickcss(targetEl, property, value, important) {
        var computedStyle, i, len, subEl, subProperty, subValue;

        switch (false) {
          case !helpers.isIterable(targetEl):
            for (i = 0, len = targetEl.length; i < len; i++) {
              subEl = targetEl[i];

              _quickcss(subEl, property, value);
            }

            break;

          case _typeof(property) !== 'object':
            for (subProperty in property) {
              subValue = property[subProperty];

              _quickcss(targetEl, subProperty, subValue);
            }

            break;

          default:
            property = helpers.normalizeProperty(property);

            if (typeof value === 'undefined') {
              computedStyle = targetEl._computedStyle || (targetEl._computedStyle = getComputedStyle(targetEl));
              return computedStyle[property];
            } else if (property) {
              targetEl.style.setProperty(property, helpers.normalizeValue(property, value), important ? __constants2.IMPORTANT : void 0);
            }

        }
      };

      _quickcss.animation = function (name, frames) {
        var frame, generated, prefix, rules;

        if (name && typeof name === 'string' && frames && _typeof(frames) === 'object') {
          prefix = helpers.getPrefix('animation');
          generated = '';

          for (frame in frames) {
            rules = frames[frame];
            generated += "".concat(frame, " {").concat(helpers.ruleToString(rules), "}");
          }

          generated = "@".concat(prefix, "keyframes ").concat(name, " {").concat(generated, "}");
          return helpers.inlineStyle(generated, true, 0);
        }
      };

      _quickcss.register = function (rule, level, important) {
        var className, ref, style;

        if (rule && _typeof(rule) === 'object') {
          level || (level = 0);
          rule = helpers.ruleToString(rule, important);

          if (!(className = (ref = helpers.inlineStyleConfig[level]) != null ? ref[rule] : void 0)) {
            className = helpers.hash(rule);
            style = ".".concat(className, " {").concat(rule, "}");
            helpers.inlineStyle(style, className, level);
          }

          return className;
        }
      };

      _quickcss.clearRegistered = function (level) {
        return helpers.clearInlineStyle(level || 0);
      };

      _quickcss.UNSET = function () {
        switch (false) {
          case !helpers.isValueSupported('display', 'unset'):
            return 'unset';

          case !helpers.isValueSupported('display', 'initial'):
            return 'initial';

          case !helpers.isValueSupported('display', 'inherit'):
            return 'inherit';
        }
      }();

      _quickcss.supports = helpers.isValueSupported;
      _quickcss.supportsProperty = helpers.isPropSupported;
      _quickcss.normalizeProperty = helpers.normalizeProperty;
      _quickcss.normalizeValue = helpers.normalizeValue;
      _quickcss.version = "1.4.1";
      module.exports = _quickcss;
      return module.exports;
    },
    24: function _(require, module, exports) {
      var Checks, availSets;
      availSets = {
        natives: require(56),
        dom: require(57)
      };

      Checks =
      /*#__PURE__*/
      function () {
        _createClass(Checks, [{
          key: "create",
          value: function create() {
            var args;

            if (arguments.length) {
              args = Array.prototype.slice.call(arguments);
            }

            return new Checks(args);
          }
        }]);

        function Checks(sets) {
          _classCallCheck(this, Checks);

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

        _createClass(Checks, [{
          key: "load",
          value: function load(set) {
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
          }
        }]);

        return Checks;
      }();

      module.exports = Checks.prototype.create();
      return module.exports;
    },
    25: function _(require, module, exports) {
      var _extend2, isArray, isObject, _shouldDeepExtend;

      isArray = function isArray(target) {
        return Array.isArray(target);
      };

      isObject = function isObject(target) {
        return target && Object.prototype.toString.call(target) === '[object Object]' || isArray(target);
      };

      _shouldDeepExtend = function shouldDeepExtend(options, target, parentKey) {
        if (options.deep) {
          if (options.notDeep) {
            return !options.notDeep[target];
          } else {
            return true;
          }
        } else if (options.deepOnly) {
          return options.deepOnly[target] || parentKey && _shouldDeepExtend(options, parentKey);
        }
      };

      module.exports = _extend2 = function extend(options, target, sources, parentKey) {
        var i, key, len, source, sourceValue, subTarget, targetValue;

        if (!target || _typeof(target) !== 'object' && typeof target !== 'function') {
          target = {};
        }

        for (i = 0, len = sources.length; i < len; i++) {
          source = sources[i];

          if (source != null) {
            for (key in source) {
              sourceValue = source[key];
              targetValue = target[key];

              if (sourceValue === target || sourceValue === void 0 || sourceValue === null && !options.allowNull && !options.nullDeletes || options.keys && !options.keys[key] || options.notKeys && options.notKeys[key] || options.own && !source.hasOwnProperty(key) || options.globalFilter && !options.globalFilter(sourceValue, key, source) || options.filters && options.filters[key] && !options.filters[key](sourceValue, key, source)) {
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

                case !(_shouldDeepExtend(options, key, parentKey) && isObject(sourceValue)):
                  subTarget = isObject(targetValue) ? targetValue : isArray(sourceValue) ? [] : {};
                  target[key] = _extend2(options, subTarget, [sourceValue], key);
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
    27: function _(require, module, exports) {
      !function (win) {
        'use strict';

        var debug = 0 ? console.log.bind(console, '[fastdom]') : function () {};

        var raf = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || function (cb) {
          return setTimeout(cb, 16);
        };

        function FastDom() {
          var self = this;
          self.reads = [];
          self.writes = [];
          self.raf = raf.bind(win);
          debug('initialized', self);
        }

        FastDom.prototype = {
          constructor: FastDom,
          measure: function measure(fn, ctx) {
            debug('measure');
            var task = !ctx ? fn : fn.bind(ctx);
            this.reads.push(task);
            scheduleFlush(this);
            return task;
          },
          mutate: function mutate(fn, ctx) {
            debug('mutate');
            var task = !ctx ? fn : fn.bind(ctx);
            this.writes.push(task);
            scheduleFlush(this);
            return task;
          },
          clear: function clear(task) {
            debug('clear', task);
            return remove(this.reads, task) || remove(this.writes, task);
          },
          extend: function extend(props) {
            debug('extend', props);
            if (_typeof(props) != 'object') throw new Error('expected object');
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
            if (fastdom.catch) fastdom.catch(error);else throw error;
          }
        }

        function runTasks(tasks) {
          debug('run tasks');
          var task;

          while (task = tasks.shift()) {
            task();
          }
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

        var exports = win.fastdom = win.fastdom || new FastDom();
        if (typeof define == 'function') define(function () {
          return exports;
        });else if (_typeof(module) == 'object') module.exports = exports;
      }(typeof window !== 'undefined' ? window : this);
      return module.exports;
    },
    28: function _(require, module, exports) {
      var Condition, IS, SimplyBind;
      IS = require(3);
      SimplyBind = require(11);

      Condition =
      /*#__PURE__*/
      function () {
        function Condition(field1, settings, callback1) {
          var _this22 = this;

          _classCallCheck(this, Condition);

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
            return console.warn("condition target not found for the provided ID '".concat(this.settings.target, "'"), this.field);
          }

          property = IS.array(this.target[this.property]) ? "array:".concat(this.property) : this.property;
          SimplyBind(property, {
            updateOnBind: false
          }).of(this.target).and('visible').of(this.target.state).to(this.callback);
          SimplyBind('satisfied', {
            updateOnBind: false
          }).of(this).to(function (newValue, oldValue) {
            var base;

            if (oldValue != null) {
              return typeof (base = _this22.field).emit === "function" ? base.emit('conditionChange', _this22) : void 0;
            }
          });
        }

        _createClass(Condition, [{
          key: "test",
          value: function test() {
            var _this23 = this;

            var comparison, comparisonOperators, passedComparisons, ref, targetValue;

            if (!((ref = this.target) != null ? ref.state.visible : void 0)) {
              return false;
            }

            comparison = function () {
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
            }.call(this);

            if (comparison === 'valid') {
              return this.target.validate();
            }

            targetValue = function () {
              var nestedObject, propertyChain;

              if (_this23.property === '_value') {
                return _this23.target.value;
              }

              propertyChain = _this23.property.split('.');

              switch (false) {
                case propertyChain.length !== 1:
                  return _this23.target[_this23.property];

                case !IS.defined(_this23.target[_this23.property]):
                  return _this23.target[_this23.property];

                default:
                  nestedObject = _this23.target;

                  while (IS.object(nestedObject)) {
                    nestedObject = nestedObject[propertyChain.pop()];
                  }

                  return nestedObject;
              }
            }();

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
          }
        }], [{
          key: "validate",
          value: function validate(conditions) {
            var validConditions;

            if (conditions) {
              validConditions = conditions.filter(function (condition) {
                return condition.satisfied = condition.test();
              });
              return validConditions.length === conditions.length;
            }
          }
        }, {
          key: "init",
          value: function init(field, conditions, callback) {
            return setTimeout(function () {
              if (callback == null) {
                callback = function callback() {
                  return field.validateConditions();
                };
              }

              field.conditions = conditions.map(function (condition) {
                return new Condition(field, condition, callback);
              });
              return callback();
            });
          }
        }]);

        return Condition;
      }();

      module.exports = Condition;
      return module.exports;
    },
    30: function _(require, module, exports) {
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
    31: function _(require, module, exports) {
      var Choice, Condition, DOM, Dropdown, IS, KEYCODES, List, SimplyBind, extend, globalDefaults, helpers;
      IS = require(3);
      SimplyBind = require(11);
      KEYCODES = require(33);
      helpers = require(1);
      Condition = require(28);
      extend = require(4);
      DOM = require(2);
      globalDefaults = require(30);

      var template = require(58);

      var defaults = require(59);

      Dropdown = function () {
        var Dropdown =
        /*#__PURE__*/
        function () {
          function Dropdown(initialChoices, field) {
            _classCallCheck(this, Dropdown);

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

          _createClass(Dropdown, [{
            key: "_createElements",
            value: function _createElements() {
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
          }, {
            key: "_attachBindings",
            value: function _attachBindings() {
              this._attachBindings_elState();

              this._attachBindings_display();

              return this._attachBindings_scrollIndicators();
            }
          }, {
            key: "_attachBindings_elState",
            value: function _attachBindings_elState() {
              var _this24 = this;

              SimplyBind('help').of(this.settings).to('text').of(this.els.help).and.to(function (showHelp) {
                return _this24.els.help.state('showHelp', showHelp);
              });
              SimplyBind('visibleChoicesCount').of(this).to(function (count) {
                return _this24.els.container.state('hasVisibleChoices', !!count);
              });
              return SimplyBind('currentHighlighted').of(this).to(function (current, prev) {
                if (prev) {
                  prev.el.state('hover', false);
                }

                if (current) {
                  return current.el.state('hover', true);
                }
              });
            }
          }, {
            key: "_attachBindings_display",
            value: function _attachBindings_display() {
              var _this25 = this;

              SimplyBind('isOpen', {
                updateOnBind: false
              }).of(this).to(function (isOpen) {
                _this25.els.container.state('isOpen', isOpen);

                if (!isOpen) {
                  _this25.currentHighlighted = null;
                }

                if (_this25.settings.lockScroll) {
                  if (isOpen) {
                    helpers.lockScroll(_this25.els.list);
                  } else {
                    helpers.unlockScroll();
                  }
                }

                if (isOpen) {
                  _this25.list.appendChoices();

                  _this25.list.calcDisplay();

                  if (_this25.selected && !_this25.settings.multiple) {
                    return _this25.list.scrollToChoice(_this25.selected);
                  }
                } else {
                  return _this25.list.setTranslate(0);
                }
              });
              SimplyBind('lastSelected', {
                updateOnBind: false,
                updateEvenIfSame: true
              }).of(this).to(function (newChoice, prevChoice) {
                return _this25._selectedCallback(newChoice, prevChoice);
              });
              SimplyBind('focused', {
                updateOnBind: false
              }).of(this.field.state).to(function (focused) {
                if (!focused) {
                  return _this25.field.el.child.input.off('keydown.dropdownNav');
                } else {
                  return _this25.field.el.child.input.on('keydown.dropdownNav', function (event) {
                    if (_this25.isOpen) {
                      switch (event.keyCode) {
                        case KEYCODES.up:
                          event.preventDefault();
                          return _this25.highlightPrev();

                        case KEYCODES.down:
                          event.preventDefault();
                          return _this25.highlightNext();

                        case KEYCODES.enter:
                          event.preventDefault();

                          if (_this25.currentHighlighted) {
                            return _this25.lastSelected = _this25.currentHighlighted;
                          }

                          break;

                        case KEYCODES.esc:
                          event.preventDefault();
                          return _this25.isOpen = false;
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
              }).of(this.field.state).to(function (focused) {
                if (!focused) {
                  return DOM(document).off('keypress.dropdownTypeBuffer');
                } else {
                  return DOM(document).on('keypress.dropdownTypeBuffer', function (event) {
                    if (_this25.isOpen) {
                      event.preventDefault();

                      if (!KEYCODES.anyPrintable(event.keyCode)) {
                        return;
                      }

                      return _this25.typeBuffer += event.key;
                    }
                  });
                }
              });
              return SimplyBind('typeBuffer', {
                updateOnBind: false
              }).of(this).to(function () {
                clearTimeout(_this25.typeBufferTimeout);
                return _this25.typeBufferTimeout = setTimeout(function () {
                  return _this25.typeBuffer = '';
                }, 1500);
              }).and.to(function (buffer) {
                var choice, i, len, ref;

                if (buffer) {
                  ref = _this25.visibleChoices;

                  for (i = 0, len = ref.length; i < len; i++) {
                    choice = ref[i];

                    if (helpers.startsWith(buffer, choice.label)) {
                      _this25.currentHighlighted = choice;

                      if (!_this25.list.choiceInView(choice)) {
                        _this25.list.scrollToChoice(choice);
                      }

                      return;
                    }
                  }
                }
              });
            }
          }, {
            key: "_attachBindings_scrollIndicators",
            value: function _attachBindings_scrollIndicators() {
              var _this26 = this;

              SimplyBind('scrollTop', {
                updateEvenIfSame: true
              }).of(this.els.list.raw).to(function (scrollTop) {
                var showBottomIndicator, showTopIndicator;
                showTopIndicator = scrollTop > 0;
                showBottomIndicator = _this26.els.list.raw.scrollHeight - _this26.els.list.raw.clientHeight > scrollTop;

                _this26.els.scrollIndicatorUp.state('visible', showTopIndicator);

                return _this26.els.scrollIndicatorDown.state('visible', showBottomIndicator);
              }).condition(function () {
                return _this26.isOpen && !_this26.settings.help && _this26.els.list.raw.scrollHeight !== _this26.els.list.raw.clientHeight && _this26.els.list.raw.clientHeight >= 100;
              }).updateOn('event:scroll').of(this.els.list.raw).updateOn('isOpen').of(this);
              this.els.scrollIndicatorUp.on('mouseenter', function () {
                return _this26.list.startScrolling('up');
              });
              this.els.scrollIndicatorUp.on('mouseleave', function () {
                return _this26.list.stopScrolling();
              });
              this.els.scrollIndicatorDown.on('mouseenter', function () {
                return _this26.list.startScrolling('down');
              });
              return this.els.scrollIndicatorDown.on('mouseleave', function () {
                return _this26.list.stopScrolling();
              });
            }
          }, {
            key: "addChoice",
            value: function addChoice(config) {
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
            }
          }, {
            key: "appendTo",
            value: function appendTo(target) {
              return this.els.container.appendTo(target);
            }
          }, {
            key: "onSelected",
            value: function onSelected(callback) {
              return this._selectedCallback = callback;
            }
          }, {
            key: "findChoice",
            value: function findChoice(providedValue, byLabel) {
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
          }, {
            key: "findChoiceAny",
            value: function findChoiceAny(providedValue) {
              return this.findChoice(providedValue) || this.findChoice(providedValue, true);
            }
          }, {
            key: "highlightPrev",
            value: function highlightPrev() {
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
          }, {
            key: "highlightNext",
            value: function highlightNext() {
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
          }]);

          return Dropdown;
        }();

        ;
        Dropdown.prototype.template = template;
        Dropdown.prototype.defaults = defaults;
        Dropdown.prototype._settingFilters = {
          maxHeight: function maxHeight(value) {
            return IS.number(value);
          }
        };
        return Dropdown;
      }.call(this);

      List =
      /*#__PURE__*/
      function () {
        function List(dropdown) {
          _classCallCheck(this, List);

          this.choiceInView = this.choiceInView.bind(this);
          this.dropdown = dropdown;
          var _this$dropdown = this.dropdown;
          this.els = _this$dropdown.els;
          this.field = _this$dropdown.field;
          this.settings = _this$dropdown.settings;
          this.el = this.els.list;
          this.container = this.els.container;
          this.appendedChoices = false;
        }

        _createClass(List, [{
          key: "appendChoices",
          value: function appendChoices() {
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
        }, {
          key: "calcDisplay",
          value: function calcDisplay() {
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
                console.warn("The dropdown for element '".concat(this.field.ID, "' cannot be displayed as it's hidden by the parent overflow"));
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
        }, {
          key: "setDimensions",
          value: function setDimensions(height, width) {
            if (height != null) {
              this.el.style('maxHeight', height);
            }

            if (width != null) {
              return this.el.style('minWidth', width);
            }
          }
        }, {
          key: "setTranslate",
          value: function setTranslate(translation) {
            this.translation = translation;
            translation *= -1;
            return this.container.style('transform', "translateY(".concat(translation, "px)"));
          }
        }, {
          key: "scrollToChoice",
          value: function scrollToChoice(choice) {
            var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
            var distaneFromTop, selectedHeight;
            distaneFromTop = choice.el.raw.offsetTop;
            selectedHeight = choice.el.height;
            return this.el.raw.scrollTop = distaneFromTop - selectedHeight * offset;
          }
        }, {
          key: "scrollDown",
          value: function scrollDown(choice) {
            return this.el.raw.scrollTop += choice.el.height;
          }
        }, {
          key: "scrollUp",
          value: function scrollUp(choice) {
            return this.el.raw.scrollTop -= choice.el.height;
          }
        }, {
          key: "choiceInView",
          value: function choiceInView(choice) {
            var choiceRect, downPadding, listRect, upPadding;
            choiceRect = choice.el.rect;
            listRect = this.el.rect;
            upPadding = this.els.scrollIndicatorUp.state('visible') ? parseFloat(this.els.scrollIndicatorUp.styleSafe('height', true)) : void 0;
            downPadding = this.els.scrollIndicatorDown.state('visible') ? parseFloat(this.els.scrollIndicatorDown.styleSafe('height', true)) : void 0;
            return choiceRect.bottom <= listRect.bottom - downPadding && choiceRect.top >= listRect.top + upPadding;
          }
        }, {
          key: "startScrolling",
          value: function startScrolling(direction) {
            var _this27 = this;

            return this.scrollIntervalID = setInterval(function () {
              return _this27.el.raw.scrollTop += direction === 'up' ? -20 : 20;
            }, 50);
          }
        }, {
          key: "stopScrolling",
          value: function stopScrolling() {
            return clearInterval(this.scrollIntervalID);
          }
        }]);

        return List;
      }();

      Choice =
      /*#__PURE__*/
      function () {
        function Choice(dropdown, settings, list, index) {
          var _this28 = this;

          _classCallCheck(this, Choice);

          var ref;
          this.dropdown = dropdown;
          this.settings = settings;
          this.list = list;
          this.index = index;
          var _this$settings = this.settings;
          this.label = _this$settings.label;
          this.value = _this$settings.value;
          this.conditions = _this$settings.conditions;

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
            Condition.init(this, this.conditions, function () {
              return _this28.unavailable = !Condition.validate(_this28.conditions);
            });
          }
        }

        _createClass(Choice, [{
          key: "init",
          value: function init() {
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
        }, {
          key: "_attachBindings",
          value: function _attachBindings() {
            var _this29 = this;

            return function () {
              SimplyBind('visible').of(_this29).to(function (visible, prev) {
                _this29.dropdown.visibleChoicesCount += visible ? 1 : -1;

                _this29.el.state('visible', visible);

                if (visible) {
                  _this29.dropdown.visibleChoices.push(_this29);

                  if (IS.defined(prev)) {
                    return _this29.dropdown.visibleChoices.sort(function (a, b) {
                      return a.index - b.index;
                    });
                  }
                } else {
                  return helpers.removeItem(_this29.dropdown.visibleChoices, _this29);
                }
              });
              SimplyBind('selected').of(_this29).to(function (selected) {
                return _this29.el.state('selected', selected);
              });
              SimplyBind('unavailable').of(_this29).to(function (unavailable) {
                return _this29.el.state('unavailable', unavailable);
              }).and.to(function (unavailable) {
                if (unavailable) {
                  return _this29.toggle(false, true);
                }
              });
              SimplyBind('event:click').of(_this29.el).to(function () {
                return _this29.dropdown.lastSelected = _this29;
              });
              SimplyBind('event:mousedown').of(_this29.el).to(function (event) {
                event.preventDefault();
                return event.stopPropagation();
              });
              return SimplyBind('event:mouseenter').of(_this29.el).to(function () {
                return _this29.dropdown.currentHighlighted = _this29;
              });
            }();
          }
        }, {
          key: "toggle",
          value: function toggle(newValue, unavailable) {
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
          }
        }]);

        return Choice;
      }();

      module.exports = Dropdown;
      module.exports.Choice = Choice;
      return module.exports;
    },
    32: function _(require, module, exports) {
      var IS, Mask, REGEX, SimplyBind, defaultPatternChars, extend, helpers, maskAddons, maskCore;
      SimplyBind = require(11);
      maskCore = require(60);
      maskAddons = require(61);
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

      Mask =
      /*#__PURE__*/
      function () {
        function Mask(field, config) {
          _classCallCheck(this, Mask);

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

        _createClass(Mask, [{
          key: "getState",
          value: function getState(pattern, rawValue) {
            return {
              rawValue: rawValue,
              guide: this.guide,
              placeholderChar: this.placeholderChar,
              keepCharPositions: this.keepCharPositions,
              currentCaretPosition: this.field.el ? this.field.selection().end : this.cursor,
              previousConformedValue: this.prevValue,
              placeholder: this.getPlaceholder(pattern)
            };
          }
        }, {
          key: "getPlaceholder",
          value: function getPlaceholder(pattern) {
            var char, j, len, placeholder;

            if (IS.function(pattern)) {} else {
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
          }
        }, {
          key: "resolvePattern",
          value: function resolvePattern(pattern, input, state) {
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
          }
        }, {
          key: "setPattern",
          value: function setPattern(string) {
            var updateValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var updateField = arguments.length > 2 ? arguments[2] : undefined;
            this.patternRaw = string;
            this.pattern = this.parsePattern(string);
            this.transform = this.parseTransform(string);

            if (updateValue) {
              this.value = this.setValue(this.value);

              if (updateField) {
                return this.field.value = this.value;
              }
            }
          }
        }, {
          key: "parsePattern",
          value: function parsePattern(string) {
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
                return string[1].split('').map(function (char) {
                  if (REGEX.letter.test(char)) {
                    return /\d/;
                  } else {
                    return char;
                  }
                });

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
          }
        }, {
          key: "parseTransform",
          value: function parseTransform(string) {
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
          }
        }, {
          key: "setValue",
          value: function setValue(input) {
            var caretTrapIndexes, conformedValue, indexesOfPipedChars, newPattern, pattern, state, transformed;

            if (this.patternSetter) {
              newPattern = this.patternSetter(input) || this.pattern;

              if (newPattern !== this.patternRaw && newPattern !== this.pattern) {
                this.setPattern(newPattern, false);
              }
            }

            var _this$resolvePattern = this.resolvePattern(this.pattern, input);

            caretTrapIndexes = _this$resolvePattern.caretTrapIndexes;
            pattern = _this$resolvePattern.pattern;

            if (pattern === false) {
              return this.value;
            }

            this.prevValue = this.value;
            this.prevCursor = this.cursor;
            state = this.getState(pattern, input);

            var _maskCore$conformToMa = maskCore.conformToMask(input, pattern, state);

            conformedValue = _maskCore$conformToMa.conformedValue;

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
          }
        }, {
          key: "validate",
          value: function validate(input) {
            var char, i, j, len, pattern;

            if (input !== this.value && this.patternSetter) {
              pattern = this.patternSetter(input) || this.pattern;
            } else {
              pattern = this.resolvedPattern;

              if (!pattern) {
                var _this$resolvePattern2 = this.resolvePattern(this.pattern, input);

                pattern = _this$resolvePattern2.pattern;
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
          }
        }, {
          key: "isEmpty",
          value: function isEmpty() {
            var char, i, input, j, len, pattern;
            input = this.value;
            pattern = this.resolvedPattern;

            if (!pattern) {
              if (this.patternSetter) {
                pattern = this.patternSetter(input);
              }

              var _this$resolvePattern3 = this.resolvePattern(pattern || this.pattern, input);

              pattern = _this$resolvePattern3.pattern;
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
          }
        }]);

        return Mask;
      }();

      module.exports = Mask;
      return module.exports;
    },
    33: function _(require, module, exports) {
      var keyCodes;
      module.exports = keyCodes = {
        delete: 8,
        enter: 13,
        esc: 27,
        ctrl: 17,
        alt: 18,
        shift: 16,
        super: 91,
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
        anyArrow: function anyArrow(code) {
          return code === keyCodes.up || code === keyCodes.down || code === keyCodes.left || code === keyCodes.right;
        },
        anyModifier: function anyModifier(code) {
          return code === keyCodes.ctrl || code === keyCodes.alt || code === keyCodes.shift || code === keyCodes.super || code === keyCodes.super2;
        },
        anyAlpha: function anyAlpha(code) {
          return 97 <= code && code <= 122 || 65 <= code && code <= 90;
        },
        anyNumeric: function anyNumeric(code) {
          return 48 <= code && code <= 57;
        },
        anyAlphaNumeric: function anyAlphaNumeric(code) {
          return keyCodes.anyAlpha(code) || keyCodes.anyNumeric(code);
        },
        anyPrintable: function anyPrintable(code) {
          return keyCodes.anyAlpha(code) || keyCodes.anyNumeric(code) || code === keyCodes.hyphen || code === keyCodes.underscore || code === keyCodes.question || code === keyCodes.exclamation || code === keyCodes.frontslash || code === keyCodes.backslash || code === keyCodes.comma || code === keyCodes.period || code === keyCodes.space;
        }
      };
      return module.exports;
    },
    34: function _(require, module, exports) {
      var CHECKMARK_WIDTH, COLORS, DOM, helpers;
      DOM = require(2);
      helpers = require(1);
      COLORS = require(62);
      CHECKMARK_WIDTH = 26;
      exports.default = DOM.template(['div', {
        ref: 'field',
        style: {
          position: 'relative',
          verticalAlign: 'top',
          display: 'none',
          boxSizing: 'border-box',
          fontFamily: function fontFamily(field) {
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
          top: function top(field) {
            return this.styleParsed('fontSize', true) * 0.7;
          },
          left: function left(field) {
            var ref;
            return helpers.shorthandSideValue(field.settings.padding, 'left') + (((ref = field.el.child.icon) != null ? ref.width : void 0) || 0);
          },
          padding: function padding(field) {
            return "0 ".concat(field.settings.inputPadding, "px");
          },
          fontFamily: 'inherit',
          fontSize: function fontSize(field) {
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
          height: function height(field) {
            return field.settings.height;
          },
          backgroundColor: 'white',
          borderWidth: function borderWidth(field) {
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
          height: function height() {
            return this.parent.styleSafe('height', 1) || this.parent.styleSafe('height');
          },
          width: function width(field) {
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

              return "calc(100% - ".concat(subtract, "px)");
            }
          },
          padding: function padding(field) {
            if (this.padding == null) {
              this.padding = Math.max(0, helpers.calcPadding(field.settings.height, 14) - 3);
            }

            return "".concat(this.padding, "px ").concat(field.settings.inputPadding, "px");
          },
          margin: '0',
          backgroundColor: 'transparent',
          appearance: 'none',
          border: 'none',
          outline: 'none',
          fontFamily: 'inherit',
          fontSize: function fontSize(field) {
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
              transform: function transform(field) {
                var label, totalHeight, translation, workableHeight;

                if (this.translation != null || !(label = field.el.child.label) || label.styleSafe('position', 1) !== 'absolute') {
                  return this.translation;
                }

                totalHeight = this.parent.styleParsed('height', 1);
                workableHeight = totalHeight - (label.styleParsed('fontSize', 1) + label.styleParsed('top', 1) * 2);
                translation = Math.max(0, Math.floor((totalHeight - workableHeight) / 4));
                return "translateY(".concat(translation, "px)");
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
          left: function left(field) {
            var ref;
            return ((ref = field.el.child.icon) != null ? ref.width : void 0) || 0;
          },
          fontFamily: function fontFamily(field) {
            return field.el.child.input.styleSafe('fontFamily', 1);
          },
          fontSize: function fontSize(field) {
            return field.el.child.input.styleSafe('fontSize', 1);
          },
          padding: function padding(field) {
            var horiz, verti;
            verti = field.el.child.input.styleParsed('paddingTop', 1) || field.el.child.input.styleParsed('paddingTop');
            horiz = field.el.child.input.styleParsed('paddingLeft', 1) || field.el.child.input.styleParsed('paddingLeft');
            return "".concat(verti + 3, "px ").concat(horiz, "px");
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
              transform: function transform(field) {
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
          left: function left(field) {
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
          width: function width(field) {
            return field.settings.iconSize;
          },
          height: function height(field) {
            return field.settings.iconSize;
          },
          fontSize: function fontSize(field) {
            return field.settings.iconSize;
          },
          paddingLeft: function paddingLeft(field) {
            return field.settings.inputPadding;
          },
          paddingTop: function paddingTop(field) {
            return this.parent.styleParsed('height', 1) / 2 - field.settings.iconSize / 2;
          },
          lineHeight: '1em',
          userSelect: 'none'
        },
        methods: {
          width: {
            get: function get() {
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
          paddingTop: function paddingTop() {
            return this.parent.styleParsed('height', 1) / 2 - 13;
          },
          paddingRight: function paddingRight(field) {
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
          backgroundColor: function backgroundColor(field) {
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
          backgroundColor: function backgroundColor(field) {
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
          backgroundColor: function backgroundColor(field) {
            return helpers.defaultColor(field.els.innerwrap.styleSafe('backgroundColor', 1), 'white');
          },
          transform: 'rotate(-45deg)'
        }
      }]]]);
      return module.exports;
    },
    35: function _(require, module, exports) {
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
    41: function _(require, module, exports) {
      var SAMPLE_STYLE, styleConfig;

      var __constants = require(42);

      SAMPLE_STYLE = document.createElement('div').style;

      var includes = exports.includes = function includes(target, item) {
        return target && target.indexOf(item) !== -1;
      };

      var isIterable = exports.isIterable = function isIterable(target) {
        return target && _typeof(target) === 'object' && typeof target.length === 'number' && !target.nodeType;
      };

      var toKebabCase = exports.toKebabCase = function toKebabCase(string) {
        return string.replace(__constants.REGEX_KEBAB, function (e, letter) {
          return "-".concat(letter.toLowerCase());
        });
      };

      var isPropSupported = exports.isPropSupported = function isPropSupported(property) {
        return typeof SAMPLE_STYLE[property] !== 'undefined';
      };

      var isValueSupported = exports.isValueSupported = function isValueSupported(property, value) {
        if (window.CSS && window.CSS.supports) {
          return window.CSS.supports(property, value);
        } else {
          SAMPLE_STYLE[property] = value;
          return SAMPLE_STYLE[property] === '' + value;
        }
      };

      var getPrefix = exports.getPrefix = function getPrefix(property, skipInitialCheck) {
        var j, len1, prefix;

        if (skipInitialCheck || !isPropSupported(property)) {
          for (j = 0, len1 = __constants.POSSIBLE_PREFIXES.length; j < len1; j++) {
            prefix = __constants.POSSIBLE_PREFIXES[j];

            if (isPropSupported("-".concat(prefix, "-").concat(property))) {
              return "-".concat(prefix, "-");
            }
          }
        }

        return '';
      };

      var normalizeProperty = exports.normalizeProperty = function normalizeProperty(property) {
        property = toKebabCase(property);

        if (isPropSupported(property)) {
          return property;
        } else {
          return "".concat(getPrefix(property, true)).concat(property);
        }
      };

      var normalizeValue = exports.normalizeValue = function normalizeValue(property, value) {
        if (includes(__constants.REQUIRES_UNIT_VALUE, property) && value !== null) {
          value = '' + value;

          if (__constants.REGEX_DIGITS.test(value) && !__constants.REGEX_LEN_VAL.test(value) && !__constants.REGEX_SPACE.test(value)) {
            value += property === 'line-height' ? 'em' : 'px';
          }
        }

        return value;
      };

      var sort = exports.sort = function sort(array) {
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

          return sort(less).concat(pivot, sort(great));
        }
      };

      var hash = exports.hash = function hash(string) {
        var hsh, i, length;
        hsh = 5381;
        i = -1;
        length = string.length;

        while (++i !== string.length) {
          hsh = (hsh << 5) - hsh + string.charCodeAt(i);
          hsh |= 0;
        }

        return '_' + (hsh < 0 ? hsh * -2 : hsh);
      };

      var ruleToString = exports.ruleToString = function ruleToString(rule, important) {
        var j, len1, output, prop, property, props, value;
        output = '';
        props = sort(Object.keys(rule));

        for (j = 0, len1 = props.length; j < len1; j++) {
          prop = props[j];

          if (typeof rule[prop] === 'string' || typeof rule[prop] === 'number') {
            property = normalizeProperty(prop);
            value = normalizeValue(property, rule[prop]);

            if (important) {
              value += " !important";
            }

            output += "".concat(property, ":").concat(value, ";");
          }
        }

        return output;
      };

      var inlineStyleConfig = exports.inlineStyleConfig = styleConfig = Object.create(null);

      var inlineStyle = exports.inlineStyle = function inlineStyle(rule, valueToStore, level) {
        var config, styleEl;

        if (!(config = styleConfig[level])) {
          styleEl = document.createElement('style');
          styleEl.id = "quickcss".concat(level || '');
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

      var clearInlineStyle = exports.clearInlineStyle = function clearInlineStyle(level) {
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

      return module.exports;
    },
    42: function _(require, module, exports) {
      var REGEX_LEN_VAL = exports.REGEX_LEN_VAL = /^\d+(?:[a-z]|\%)+$/i;
      var REGEX_DIGITS = exports.REGEX_DIGITS = /\d+$/;
      var REGEX_SPACE = exports.REGEX_SPACE = /\s/;
      var REGEX_KEBAB = exports.REGEX_KEBAB = /([A-Z])+/g;
      var IMPORTANT = exports.IMPORTANT = 'important';
      var POSSIBLE_PREFIXES = exports.POSSIBLE_PREFIXES = ['webkit', 'moz', 'ms', 'o'];
      var REQUIRES_UNIT_VALUE = exports.REQUIRES_UNIT_VALUE = ['background-position-x', 'background-position-y', 'block-size', 'border-width', 'columnRule-width', 'cx', 'cy', 'font-size', 'grid-column-gap', 'grid-row-gap', 'height', 'inline-size', 'line-height', 'minBlock-size', 'min-height', 'min-inline-size', 'min-width', 'max-height', 'max-width', 'outline-offset', 'outline-width', 'perspective', 'shape-margin', 'stroke-dashoffset', 'stroke-width', 'text-indent', 'width', 'word-spacing', 'top', 'bottom', 'left', 'right', 'x', 'y'];
      var QUAD_SHORTHANDS = exports.QUAD_SHORTHANDS = ['margin', 'padding', 'border', 'border-radius'];
      var DIRECTIONS = exports.DIRECTIONS = ['top', 'bottom', 'left', 'right'];
      QUAD_SHORTHANDS.forEach(function (property) {
        var direction, i, len;
        REQUIRES_UNIT_VALUE.push(property);

        for (i = 0, len = DIRECTIONS.length; i < len; i++) {
          direction = DIRECTIONS[i];
          REQUIRES_UNIT_VALUE.push(property + '-' + direction);
        }
      });
      return module.exports;
    },
    56: function _(require, module, exports) {
      var exports;
      module.exports = exports = {
        defined: function defined(subject) {
          return subject !== void 0;
        },
        array: function array(subject) {
          return subject instanceof Array;
        },
        object: function object(subject) {
          return _typeof(subject) === 'object' && subject;
        },
        objectPlain: function objectPlain(subject) {
          return exports.object(subject) && Object.prototype.toString.call(subject) === '[object Object]' && subject.constructor === Object;
        },
        string: function string(subject) {
          return typeof subject === 'string';
        },
        number: function number(subject) {
          return typeof subject === 'number' && !isNaN(subject);
        },
        numberLoose: function numberLoose(subject) {
          return exports.number(subject) || exports.string(subject) && exports.number(Number(subject));
        },
        function: function _function(subject) {
          return typeof subject === 'function';
        },
        iterable: function iterable(subject) {
          return exports.object(subject) && exports.number(subject.length);
        }
      };
      return module.exports;
    },
    57: function _(require, module, exports) {
      var exports;
      module.exports = exports = {
        domDoc: function domDoc(subject) {
          return subject && subject.nodeType === 9;
        },
        domEl: function domEl(subject) {
          return subject && subject.nodeType === 1;
        },
        domText: function domText(subject) {
          return subject && subject.nodeType === 3;
        },
        domNode: function domNode(subject) {
          return exports.domEl(subject) || exports.domText(subject);
        },
        domTextarea: function domTextarea(subject) {
          return subject && subject.nodeName === 'TEXTAREA';
        },
        domInput: function domInput(subject) {
          return subject && subject.nodeName === 'INPUT';
        },
        domSelect: function domSelect(subject) {
          return subject && subject.nodeName === 'SELECT';
        },
        domField: function domField(subject) {
          return exports.domInput(subject) || exports.domTextarea(subject) || exports.domSelect(subject);
        }
      };
      return module.exports;
    },
    58: function _(require, module, exports) {
      var DOM, SVG, helpers;
      DOM = require(2);
      SVG = require(70);
      helpers = require(1);
      exports.default = DOM.template(['div', {
        ref: 'dropdown',
        styleAfterInsert: true,
        style: {
          position: 'absolute',
          zIndex: 10,
          overflow: 'hidden',
          top: function top(dropdown) {
            if (dropdown.field.type === 'text') {
              return this.parent.raw.style.height;
            } else {
              return '-7px';
            }
          },
          left: function left() {
            if (this.parent.rect.left - 5 < 0) {
              return 0;
            } else {
              return -5;
            }
          },
          display: 'none',
          backgroundColor: '#f6f6f6',
          boxShadow: "0px 6px 10px ".concat(helpers.hexToRGBA('000000', 0.32)),
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
          maxWidth: function maxWidth() {
            return "calc(100% - ".concat(this.prev.styleSafe('width', true), ")");
          },
          paddingRight: '10px',
          lineHeight: '20px',
          fontSize: '11px',
          fontFamily: function fontFamily(dropdown) {
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
    59: function _(require, module, exports) {
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
    60: function _(require, module, exports) {
      !function (e, r) {
        "object" == _typeof(exports) && "object" == _typeof(module) ? module.exports = r() : "function" == typeof define && define.amd ? define([], r) : "object" == _typeof(exports) ? exports.textMaskCore = r() : e.textMaskCore = r();
      }(this, function () {
        return function (e) {
          function r(n) {
            if (t[n]) return t[n].exports;
            var o = t[n] = {
              exports: {},
              id: n,
              loaded: !1
            };
            return e[n].call(o.exports, o, o.exports, r), o.loaded = !0, o.exports;
          }

          var t = {};
          return r.m = e, r.c = t, r.p = "", r(0);
        }([function (e, r, t) {
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
            get: function get() {
              return n(o).default;
            }
          });
          var i = t(2);
          Object.defineProperty(r, "adjustCaretPosition", {
            enumerable: !0,
            get: function get() {
              return n(i).default;
            }
          });
          var a = t(5);
          Object.defineProperty(r, "createTextMaskInputElement", {
            enumerable: !0,
            get: function get() {
              return n(a).default;
            }
          });
        }, function (e, r) {
          "use strict";

          Object.defineProperty(r, "__esModule", {
            value: !0
          }), r.placeholderChar = "_";
        }, function (e, r) {
          "use strict";

          function t(e) {
            var r = e.previousConformedValue,
                t = void 0 === r ? o : r,
                i = e.previousPlaceholder,
                a = void 0 === i ? o : i,
                u = e.currentCaretPosition,
                l = void 0 === u ? 0 : u,
                s = e.conformedValue,
                f = e.rawValue,
                d = e.placeholderChar,
                c = e.placeholder,
                v = e.indexesOfPipedChars,
                p = void 0 === v ? n : v,
                h = e.caretTrapIndexes,
                g = void 0 === h ? n : h;
            if (0 === l) return 0;
            var m = f.length,
                y = t.length,
                b = c.length,
                C = s.length,
                P = m - y,
                x = P > 0,
                O = 0 === y,
                k = P > 1 && !x && !O;
            if (k) return l;
            var j = x && (t === s || s === c),
                M = 0,
                T = void 0,
                w = void 0;
            if (j) M = l - P;else {
              var _ = s.toLowerCase(),
                  V = f.toLowerCase(),
                  S = V.substr(0, l).split(o),
                  N = S.filter(function (e) {
                return _.indexOf(e) !== -1;
              });

              w = N[N.length - 1];
              var E = a.substr(0, N.length).split(o).filter(function (e) {
                return e !== d;
              }).length,
                  A = c.substr(0, N.length).split(o).filter(function (e) {
                return e !== d;
              }).length,
                  R = A !== E,
                  I = void 0 !== a[N.length - 1] && void 0 !== c[N.length - 2] && a[N.length - 1] !== d && a[N.length - 1] !== c[N.length - 1] && a[N.length - 1] === c[N.length - 2];
              !x && (R || I) && E > 0 && c.indexOf(w) > -1 && void 0 !== f[l] && (T = !0, w = f[l]);

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
                if (M = B + 1, D === w && z++, z >= W) break;
              }
            }

            if (x) {
              for (var G = M, H = M; H <= b; H++) {
                if (c[H] === d && (G = H), c[H] === d || g.indexOf(H) !== -1 || H === b) return G;
              }
            } else if (T) {
              for (var K = M - 1; K >= 0; K--) {
                if (s[K] === w || g.indexOf(K) !== -1 || 0 === K) return K;
              }
            } else for (var Q = M; Q >= 0; Q--) {
              if (c[Q - 1] === d || g.indexOf(Q) !== -1 || 0 === Q) return Q;
            }
          }

          Object.defineProperty(r, "__esModule", {
            value: !0
          }), r.default = t;
          var n = [],
              o = "";
        }, function (e, r, t) {
          "use strict";

          function n() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a,
                r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : a,
                t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                n = t.guide,
                u = void 0 === n || n,
                l = t.previousConformedValue,
                s = void 0 === l ? a : l,
                f = t.placeholderChar,
                d = void 0 === f ? i.placeholderChar : f,
                c = t.placeholder,
                v = void 0 === c ? (0, o.convertMaskToPlaceholder)(r, d) : c,
                p = t.currentCaretPosition,
                h = t.keepCharPositions,
                g = u === !1 && void 0 !== s,
                m = e.length,
                y = s.length,
                b = v.length,
                C = r.length,
                P = m - y,
                x = P > 0,
                O = p + (x ? -P : 0),
                k = O + Math.abs(P);

            if (h === !0 && !x) {
              for (var j = a, M = O; M < k; M++) {
                v[M] === d && (j += d);
              }

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

            var S = a,
                N = !1;

            e: for (var E = 0; E < b; E++) {
              var A = v[E];

              if (A === d) {
                if (T.length > 0) for (; T.length > 0;) {
                  var R = T.shift(),
                      I = R.char,
                      J = R.isNew;

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

                      null !== F ? (S += I, T.splice(F, 1)) : E--;
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
              for (var z = null, B = 0; B < S.length; B++) {
                v[B] === d && (z = B);
              }

              S = null !== z ? S.substr(0, z + 1) : a;
            }

            return {
              conformedValue: S,
              meta: {
                someCharsRejected: N
              }
            };
          }

          Object.defineProperty(r, "__esModule", {
            value: !0
          }), r.default = n;
          var o = t(4),
              i = t(1),
              a = "";
        }, function (e, r, t) {
          "use strict";

          function n() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : l,
                r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : u.placeholderChar;
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
            for (var r = [], t = void 0; t = e.indexOf(s), t !== -1;) {
              r.push(t), e.splice(t, 1);
            }

            return {
              maskWithoutCaretTraps: e,
              indexes: r
            };
          }

          Object.defineProperty(r, "__esModule", {
            value: !0
          }), r.convertMaskToPlaceholder = n, r.isString = o, r.isNumber = i, r.processCaretTraps = a;
          var u = t(1),
              l = [],
              s = "[]";
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
              update: function update(t) {
                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e,
                    o = n.inputElement,
                    s = n.mask,
                    d = n.guide,
                    m = n.pipe,
                    b = n.placeholderChar,
                    C = void 0 === b ? p.placeholderChar : b,
                    P = n.keepCharPositions,
                    x = void 0 !== P && P,
                    O = n.showMask,
                    k = void 0 !== O && O;

                if ("undefined" == typeof t && (t = o.value), t !== r.previousConformedValue) {
                  ("undefined" == typeof s ? "undefined" : l(s)) === y && void 0 !== s.pipe && void 0 !== s.mask && (m = s.pipe, s = s.mask);
                  var j = void 0,
                      M = void 0;

                  if (s instanceof Array && (j = (0, v.convertMaskToPlaceholder)(s, C)), s !== !1) {
                    var T = a(t),
                        w = o.selectionEnd,
                        _ = r.previousConformedValue,
                        V = r.previousPlaceholder,
                        S = void 0;

                    if (("undefined" == typeof s ? "undefined" : l(s)) === h) {
                      if (M = s(T, {
                        currentCaretPosition: w,
                        previousConformedValue: _,
                        placeholderChar: C
                      }), M === !1) return;
                      var N = (0, v.processCaretTraps)(M),
                          E = N.maskWithoutCaretTraps,
                          A = N.indexes;
                      M = E, S = A, j = (0, v.convertMaskToPlaceholder)(M, C);
                    } else M = s;

                    var R = {
                      previousConformedValue: _,
                      guide: d,
                      placeholderChar: C,
                      pipe: m,
                      placeholder: j,
                      currentCaretPosition: w,
                      keepCharPositions: x
                    },
                        I = (0, c.default)(T, M, R),
                        J = I.conformedValue,
                        q = ("undefined" == typeof m ? "undefined" : l(m)) === h,
                        F = {};
                    q && (F = m(J, u({
                      rawValue: T
                    }, R)), F === !1 ? F = {
                      value: _,
                      rejected: !0
                    } : (0, v.isString)(F) && (F = {
                      value: F
                    }));
                    var L = q ? F.value : J,
                        W = (0, f.default)({
                      previousConformedValue: _,
                      previousPlaceholder: V,
                      conformedValue: L,
                      placeholder: j,
                      rawValue: T,
                      currentCaretPosition: w,
                      placeholderChar: C,
                      indexesOfPipedChars: F.indexesOfPipedChars,
                      caretTrapIndexes: S
                    }),
                        z = L === j && 0 === W,
                        B = k ? j : g,
                        D = z ? B : L;
                    r.previousConformedValue = D, r.previousPlaceholder = j, o.value !== D && (o.value = D, i(o, W));
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
            if ((0, v.isString)(e)) return e;
            if ((0, v.isNumber)(e)) return String(e);
            if (void 0 === e || null === e) return g;
            throw new Error("The 'value' provided to Text Mask needs to be a string or a number. The value received was:\n\n " + JSON.stringify(e));
          }

          Object.defineProperty(r, "__esModule", {
            value: !0
          });

          var u = Object.assign || function (e) {
            for (var r = 1; r < arguments.length; r++) {
              var t = arguments[r];

              for (var n in t) {
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
              }
            }

            return e;
          },
              l = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
            return _typeof(e);
          } : function (e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
          };

          r.default = o;
          var s = t(2),
              f = n(s),
              d = t(3),
              c = n(d),
              v = t(4),
              p = t(1),
              h = "function",
              g = "",
              m = "none",
              y = "object",
              b = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent),
              C = "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : setTimeout;
        }]);
      });
      return module.exports;
    },
    61: function _(require, module, exports) {
      !function (e, t) {
        "object" == _typeof(exports) && "object" == _typeof(module) ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == _typeof(exports) ? exports.textMaskAddons = t() : e.textMaskAddons = t();
      }(this, function () {
        return function (e) {
          function t(r) {
            if (n[r]) return n[r].exports;
            var o = n[r] = {
              exports: {},
              id: r,
              loaded: !1
            };
            return e[r].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports;
          }

          var n = {};
          return t.m = e, t.c = n, t.p = "", t(0);
        }([function (e, t, n) {
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
            get: function get() {
              return r(o).default;
            }
          });
          var i = n(2);
          Object.defineProperty(t, "createNumberMask", {
            enumerable: !0,
            get: function get() {
              return r(i).default;
            }
          });
          var u = n(3);
          Object.defineProperty(t, "emailMask", {
            enumerable: !0,
            get: function get() {
              return r(u).default;
            }
          });
        }, function (e, t) {
          "use strict";

          function n() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "mm dd yyyy";
            return function (t) {
              var n = [],
                  r = e.split(/[^dmy]+/),
                  o = {
                dd: 31,
                mm: 12,
                yy: 99,
                yyyy: 9999
              },
                  i = {
                dd: 1,
                mm: 1,
                yy: 0,
                yyyy: 1
              },
                  u = t.split("");
              r.forEach(function (t) {
                var r = e.indexOf(t),
                    i = parseInt(o[t].toString().substr(0, 1), 10);
                parseInt(u[r], 10) > i && (u[r + 1] = u[r], u[r] = 0, n.push(r));
              });
              var c = r.some(function (n) {
                var r = e.indexOf(n),
                    u = n.length,
                    c = t.substr(r, u).replace(/\D/g, ""),
                    l = parseInt(c, 10);
                return l > o[n] || c.length === u && l < i[n];
              });
              return !c && {
                value: u.join(""),
                indexesOfPipedChars: n
              };
            };
          }

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.default = n;
        }, function (e, t) {
          "use strict";

          function n() {
            function e() {
              var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : c,
                  t = e.length;
              if (e === c || e[0] === h[0] && 1 === t) return h.split(c).concat([v]).concat(m.split(c));
              if (e === S && M) return h.split(c).concat(["0", S, v]).concat(m.split(c));
              var n = e.lastIndexOf(S),
                  u = n !== -1,
                  l = e[0] === s && I,
                  a = void 0,
                  g = void 0,
                  b = void 0;

              if (e.slice(V * -1) === m && (e = e.slice(0, V * -1)), u && (M || D) ? (a = e.slice(e.slice(0, $) === h ? $ : 0, n), g = e.slice(n + 1, t), g = r(g.replace(f, c))) : a = e.slice(0, $) === h ? e.slice($) : e, N && ("undefined" == typeof N ? "undefined" : i(N)) === p) {
                var O = "." === _ ? "[.]" : "" + _,
                    j = (a.match(new RegExp(O, "g")) || []).length;
                a = a.slice(0, N + j * q);
              }

              return a = a.replace(f, c), A || (a = a.replace(/^0+(0$|[^0])/, "$1")), a = x ? o(a, _) : a, b = r(a), (u && M || D === !0) && (e[n - 1] !== S && b.push(y), b.push(S, y), g && (("undefined" == typeof C ? "undefined" : i(C)) === p && (g = g.slice(0, C)), b = b.concat(g)), D === !0 && e[n - 1] === S && b.push(v)), $ > 0 && (b = h.split(c).concat(b)), l && (b.length === $ && b.push(v), b = [d].concat(b)), m.length > 0 && (b = b.concat(m.split(c))), b;
            }

            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                n = t.prefix,
                h = void 0 === n ? u : n,
                g = t.suffix,
                m = void 0 === g ? c : g,
                b = t.includeThousandsSeparator,
                x = void 0 === b || b,
                O = t.thousandsSeparatorSymbol,
                _ = void 0 === O ? l : O,
                j = t.allowDecimal,
                M = void 0 !== j && j,
                P = t.decimalSymbol,
                S = void 0 === P ? a : P,
                w = t.decimalLimit,
                C = void 0 === w ? 2 : w,
                k = t.requireDecimal,
                D = void 0 !== k && k,
                E = t.allowNegative,
                I = void 0 !== E && E,
                R = t.allowLeadingZeroes,
                A = void 0 !== R && R,
                L = t.integerLimit,
                N = void 0 === L ? null : L,
                $ = h && h.length || 0,
                V = m && m.length || 0,
                q = _ && _.length || 0;

            return e.instanceOf = "createNumberMask", e;
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
          var i = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
            return _typeof(e);
          } : function (e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
          };
          t.default = n;
          var u = "$",
              c = "",
              l = ",",
              a = ".",
              s = "-",
              d = /-/,
              f = /\D+/g,
              p = "number",
              v = /\d/,
              y = "[]";
        }, function (e, t, n) {
          "use strict";

          function r(e) {
            return e && e.__esModule ? e : {
              default: e
            };
          }

          function o(e, t) {
            e = e.replace(O, v);
            var n = t.placeholderChar,
                r = t.currentCaretPosition,
                o = e.indexOf(y),
                s = e.lastIndexOf(p),
                d = s < o ? -1 : s,
                f = i(e, o + 1, y),
                h = i(e, d - 1, p),
                g = u(e, o, n),
                m = c(e, o, d, n),
                b = l(e, d, n, r);
            g = a(g), m = a(m), b = a(b, !0);
            var x = g.concat(f).concat(m).concat(h).concat(b);
            return x;
          }

          function i(e, t, n) {
            var r = [];
            return e[t] === n ? r.push(n) : r.push(h, n), r.push(h), r;
          }

          function u(e, t) {
            return t === -1 ? e : e.slice(0, t);
          }

          function c(e, t, n, r) {
            var o = v;
            return t !== -1 && (o = n === -1 ? e.slice(t + 1, e.length) : e.slice(t + 1, n)), o = o.replace(new RegExp("[\\s" + r + "]", m), v), o === y ? f : o.length < 1 ? g : o[o.length - 1] === p ? o.slice(0, o.length - 1) : o;
          }

          function l(e, t, n, r) {
            var o = v;
            return t !== -1 && (o = e.slice(t + 1, e.length)), o = o.replace(new RegExp("[\\s" + n + ".]", m), v), 0 === o.length ? e[t - 1] === p && r !== e.length ? f : v : o;
          }

          function a(e, t) {
            return e.split(v).map(function (e) {
              return e === g ? e : t ? x : b;
            });
          }

          Object.defineProperty(t, "__esModule", {
            value: !0
          });
          var s = n(4),
              d = r(s),
              f = "*",
              p = ".",
              v = "",
              y = "@",
              h = "[]",
              g = " ",
              m = "g",
              b = /[^\s]/,
              x = /[^.\s]/,
              O = /\s/g;
          t.default = {
            mask: o,
            pipe: d.default
          };
        }, function (e, t) {
          "use strict";

          function n(e, t) {
            var n = t.currentCaretPosition,
                i = t.rawValue,
                f = t.previousConformedValue,
                p = t.placeholderChar,
                v = e;
            v = r(v);
            var y = v.indexOf(c),
                h = null === i.match(new RegExp("[^@\\s." + p + "]"));
            if (h) return u;
            if (v.indexOf(a) !== -1 || y !== -1 && n !== y + 1 || i.indexOf(o) === -1 && f !== u && i.indexOf(l) !== -1) return !1;
            var g = v.indexOf(o),
                m = v.slice(g + 1, v.length);
            return (m.match(d) || s).length > 1 && v.substr(-1) === l && n !== i.length && (v = v.slice(0, v.length - 1)), v;
          }

          function r(e) {
            var t = 0;
            return e.replace(i, function () {
              return t++, 1 === t ? o : u;
            });
          }

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.default = n;
          var o = "@",
              i = /@/g,
              u = "",
              c = "@.",
              l = ".",
              a = "..",
              s = [],
              d = /\./g;
        }]);
      });
      return module.exports;
    },
    62: function _(require, module, exports) {
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
    69: function _(require, module, exports) {
      var StateChain;

      module.exports = StateChain =
      /*#__PURE__*/
      function () {
        function StateChain(states) {
          _classCallCheck(this, StateChain);

          this.string = states.join('+');
          this.array = states.slice();
          this.length = states.length;
        }

        _createClass(StateChain, [{
          key: "includes",
          value: function includes(target) {
            var i, len, ref, state;
            ref = this.array;

            for (i = 0, len = ref.length; i < len; i++) {
              state = ref[i];

              if (state === target) {
                return true;
              }
            }

            return false;
          }
        }, {
          key: "without",
          value: function without(target) {
            return this.array.filter(function (state) {
              return state !== target;
            }).join('+');
          }
        }, {
          key: "isApplicable",
          value: function isApplicable(target, otherActive) {
            var active;
            active = this.array.filter(function (state) {
              return state === target || otherActive.indexOf(state) !== -1;
            });
            return active.length === this.array.length;
          }
        }]);

        return StateChain;
      }();

      return module.exports;
    },
    70: function _(require, module, exports) {
      exports.checkmark = require(84);
      exports.angleDown = require(85);
      exports.caretUp = require(86);
      exports.caretDown = require(87);
      exports.plus = require(88);
      exports.clone = require(89);
      return module.exports;
    },
    84: function _(require, module, exports) {
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
    85: function _(require, module, exports) {
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
    86: function _(require, module, exports) {
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
    87: function _(require, module, exports) {
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
    88: function _(require, module, exports) {
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
    89: function _(require, module, exports) {
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
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports) {
    module.exports = require(0);
  } else {
    return this['quickfield'] = require(0);
  }
}).call(this, null, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : this);


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSIsImNvbnNvbGVQYXRjaC5jb2ZmZWUiLCIuLi9wYWNrYWdlLmpzb24iLCJoZWxwZXJzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvaW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9hbGxvd2VkT3B0aW9ucy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2hlbHBlcnMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9jaGVja3MuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9lbGVtZW50L2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9hbGlhc2VzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC90cmF2ZXJzaW5nLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9pbml0LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9ldmVudHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9lbGVtZW50L3N0YXRlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9zdHlsZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2VsZW1lbnQvYXR0cmlidXRlcy1hbmQtcHJvcGVydGllcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2VsZW1lbnQvbWFuaXB1bGF0aW9uLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9hcHBsaWNhdGlvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL3dpbmRvdy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL21lZGlhUXVlcnkuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9iYXRjaC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL3RlbXBsYXRlL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvdGVtcGxhdGUvZXh0ZW5kVGVtcGxhdGUuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy90ZW1wbGF0ZS9wYXJzZVRyZWUuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy90ZW1wbGF0ZS9zY2hlbWEuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9zaG9ydGN1dHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3BhY2thZ2UuanNvbiIsImNoZWNrcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3NyYy9pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3BhY2thZ2UuanNvbiIsImFuaW1hdGlvbnMuY29mZmVlIiwiY29uc3RhbnRzL3JlcUZpZWxkTWV0aG9kcy5jb2ZmZWUiLCJmaWVsZC9pbmRleC5jb2ZmZWUiLCJmaWVsZC90cmFuc2Zvcm1TZXR0aW5ncy5jb2ZmZWUiLCJmaWVsZC90ZXh0L19pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9faW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL2hlbHBlcnMvX2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2NoYW5nZUV2ZW50LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL3JlcXVpcmVzRG9tRGVzY3JpcHRvckZpeC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvaGVscGVycy93aW5kb3dQcm9wc1RvSWdub3JlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2NoZWNrcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvaGVscGVycy9kZXNjcmlwdG9yLW1vZC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvaGVscGVycy93ZWJraXREb21EZXNjcmlwdG9yRml4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2Nsb25pbmcuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL2hlbHBlcnMvY2FjaGUuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL2hlbHBlcnMvcGxhY2Vob2xkZXJzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2Vycm9ycy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvZXJyb3JzQW5kV2FybmluZ3MuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9TaW1wbHlCaW5kL19pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL1NpbXBseUJpbmQvbWV0aG9kcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvcGFja2FnZS5qc29uIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9TaW1wbHlCaW5kL21ldGhvZHMudW5CaW5kQWxsLXBhcnNlRE9NT2JqZWN0LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvQmluZGluZy9faW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nL3Byb3RvdHlwZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL0JpbmRpbmcvcHJvdG90eXBlLnNldFZhbHVlLU9iamVjdFByb3AtRE9NVmFsdWUuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nL3Byb3RvdHlwZS5zZXRWYWx1ZS1ET01UeXBlcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL0JpbmRpbmdJbnRlcmZhY2UvaW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL3Byb3RvdHlwZS1wcml2YXRlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvQmluZGluZ0ludGVyZmFjZS9wcm90b3R5cGUtcHJpdmF0ZS5zZXRPYmplY3QtcGFyc2VET01PYmplY3QuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL3Byb3RvdHlwZS1wcml2YXRlLnNldE9iamVjdC1kZWZpbmVFdmVudE1ldGhvZHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL3Byb3RvdHlwZS1wdWJsaWMuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9Hcm91cEJpbmRpbmcvX2luZGV4LmNvZmZlZSIsImNvbnN0YW50cy9yZWdleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tjc3Mvc3JjL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2Nzcy9wYWNrYWdlLmpzb24iLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL2lzL3NyYy9pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3NyYy9leHRlbmQuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Zhc3Rkb20vZmFzdGRvbS5qcyIsImNvbXBvbmVudHMvY29uZGl0aW9uLmNvZmZlZSIsImZpZWxkL2dsb2JhbERlZmF1bHRzLmNvZmZlZSIsImNvbXBvbmVudHMvZHJvcGRvd24vaW5kZXguY29mZmVlIiwiY29tcG9uZW50cy9tYXNrLmNvZmZlZSIsImNvbnN0YW50cy9rZXlDb2Rlcy5jb2ZmZWUiLCJmaWVsZC90ZXh0L3RlbXBsYXRlLmNvZmZlZSIsImZpZWxkL3RleHQvZGVmYXVsdHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrY3NzL3NyYy9oZWxwZXJzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvY29uc3RhbnRzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vaXMvc3JjL25hdGl2ZXMuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9pcy9zcmMvZG9tLmNvZmZlZSIsImNvbXBvbmVudHMvZHJvcGRvd24vdGVtcGxhdGUuY29mZmVlIiwiY29tcG9uZW50cy9kcm9wZG93bi9kZWZhdWx0cy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvdGV4dC1tYXNrLWNvcmUvZGlzdC90ZXh0TWFza0NvcmUuanMiLCJub2RlX21vZHVsZXMvdGV4dC1tYXNrLWFkZG9ucy9kaXN0L3RleHRNYXNrQWRkb25zLmpzIiwiY29uc3RhbnRzL2NvbG9ycy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2VsZW1lbnQvc3RhdGVDaGFpbi5jb2ZmZWUiLCJzdmcvX2luZGV4LmNvZmZlZSIsInN2Zy9jaGVja21hcmsuY29mZmVlIiwic3ZnL2FuZ2xlRG93bi5jb2ZmZWUiLCJzdmcvY2FyZXRVcC5jb2ZmZWUiLCJzdmcvY2FyZXREb3duLmNvZmZlZSIsInN2Zy9wbHVzLmNvZmZlZSIsInN2Zy9jbG9uZS5jb2ZmZWUiXSwibmFtZXMiOlsiRE9NIiwiSVMiLCJleHRlbmQiLCJyZWdpc3RlckFuaW1hdGlvbnMiLCJSRVFVSVJFRF9GSUVMRF9NRVRIT0RTIiwiY29uc29sZSIsImxvZyIsIndhcm4iLCJuZXdCdWlsZGVyIiwic2V0dGluZ092ZXJyaWRlcyIsInRlbXBsYXRlT3ZlcnJpZGVzIiwiRmllbGQiLCJzZXR0aW5ncyIsImFyZ3VtZW50cyIsImxlbmd0aCIsImNsb25lIiwib2JqZWN0IiwidHlwZSIsIkVycm9yIiwiYnVpbGRlciIsInJlZ2lzdGVyIiwidGFyZ2V0RmllbGQiLCJpIiwic3RyaW5nIiwiZnVuY3Rpb24iLCJwcm90b3R5cGUiLCJyZXF1aXJlZE1ldGhvZCIsImNvbmZpZyIsIm5ld1NldHRpbmdzIiwibmV3VGVtcGxhdGVzIiwiU3RyaW5nIiwib3V0cHV0U2V0dGluZ3MiLCJPYmplY3QiLCJjcmVhdGUiLCJnbG9iYWxEZWZhdWx0cyIsImRlZXAiLCJub3REZWVwIiwic2hhbGxvd1NldHRpbmdzIiwiZGVmYXVsdHMiLCJvdXRwdXRUZW1wbGF0ZXMiLCJnbG9iYWxDb25maWciLCJnbG9iYWwiLCJmaWVsZCIsImRlZmF1bHQiLCJvcmlnaW5hbFRlbXBsYXRlcyIsInRlbXBsYXRlcyIsIm5hbWUiLCJjb25jYXQiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsIm93biIsIm5vdEtleXMiLCJ2ZXJzaW9uIiwiUXVpY2tGaWVsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJTaW1wbHlCaW5kIiwicmVnZXgiLCJoZWxwZXJzIiwibm9vcCIsImluY2x1ZGVzIiwidGFyZ2V0IiwiaXRlbSIsImluZGV4T2YiLCJyZXBlYXQiLCJjb3VudCIsInJlc3VsdHMxIiwiam9pbiIsInJlbW92ZUl0ZW0iLCJpdGVtSW5kZXgiLCJzcGxpY2UiLCJpbnNlcnRBZnRlciIsIm5ld0l0ZW0iLCJmaW5kIiwiZm4iLCJyZXN1bHRzIiwiZmlsdGVyIiwiZGlmZiIsInNvdXJjZSIsImNvbXBhcmVlIiwiY29tcGFyZWVWYWwiLCJtYXhMZW4iLCJNYXRoIiwibWF4Iiwic291cmNlVmFsIiwiZGVmaW5lZCIsInJlc3VsdCIsInB1c2giLCJoZXhUb1JHQkEiLCJoZXgiLCJhbHBoYSIsIkIiLCJzbGljZSIsIlIiLCJwYXJzZUludCIsIkciLCJkZWZhdWx0Q29sb3IiLCJjb2xvciIsImNhbGNQYWRkaW5nIiwiZGVzaXJlZEhlaWdodCIsImZvbnRTaXplIiwiY2VpbCIsInVubG9ja1Njcm9sbCIsImV4Y2x1ZGVkRWwiLCJ3aW5kb3ciLCJfaXNMb2NrZWQiLCJvZmYiLCJsb2NrU2Nyb2xsIiwib24iLCJldmVudCIsInJhdyIsInBhcmVudE1hdGNoaW5nIiwicGFyZW50Iiwid2hlZWxEZWx0YSIsInNjcm9sbFRvcCIsInByZXZlbnREZWZhdWx0Iiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiZnV6enlNYXRjaCIsIm5lZWRsZSIsImhheXN0YWNrIiwiY2FzZVNlbnNpdGl2ZSIsImhJIiwiaExlbmd0aCIsInRvVXBwZXJDYXNlIiwibkxlbmd0aCIsIm5JIiwibWF0Y2hlZENvdW50IiwibmVlZGxlQ2hhciIsInN0YXJ0c1dpdGgiLCJnZXRJbmRleE9mRmlyc3REaWZmIiwic291cmNlU3RyaW5nIiwiY29tcGFyZVN0cmluZyIsImN1cnJlbnRQb3MiLCJtYXhMZW5ndGgiLCJwYXJzZUNzc1Nob3J0aGFuZFZhbHVlIiwic3BsaXQiLCJ3aGl0ZVNwYWNlIiwibWFwIiwicGFyc2VGbG9hdCIsInZhbHVlcyIsInRvcCIsInJpZ2h0IiwiYm90dG9tIiwibGVmdCIsInNob3J0aGFuZFNpZGVWYWx1ZSIsInZhbHVlIiwic2lkZSIsInVwZGF0ZVNob3J0aGFuZFZhbHVlIiwibmV3VmFsdWUiLCJrZXlzIiwiZm9yRWFjaCIsImluaGVyaXRQcm90byIsImNoaWxkIiwiaiIsImtleSIsIlF1aWNrRG9tIiwiYWxsb3dlZE9wdGlvbnMiLCJub3JtYWxpemVHaXZlbkVsIiwidGFyZ2V0RWwiLCJ0ZXh0IiwiZG9tTm9kZSIsInRlbXBsYXRlIiwic3Bhd24iLCJpc1N0YXRlU3R5bGUiLCJyZWdpc3RlclN0eWxlIiwicnVsZSIsImxldmVsIiwiaW1wb3J0YW50IiwiY2FjaGVkIiwic3R5bGVDYWNoZSIsIm91dHB1dCIsImNsYXNzTmFtZSIsIkNTUyIsImZucyIsInByb3BzIiwicHJvcCIsInNldCIsImNvbnN0cnVjdG9yIiwiaW5kZXgiLCJsb2FkIiwicXVpY2tEb21FbCIsInN1YmplY3QiLCJRdWlja0VsZW1lbnQiLCJRdWlja1RlbXBsYXRlIiwib3B0aW9ucyIsInN2ZyIsImVsIiwiZXhpc3RpbmciLCJkb2N1bWVudCIsImNyZWF0ZVRleHROb2RlIiwiY3JlYXRlRWxlbWVudE5TIiwic3ZnTmFtZXNwYWNlIiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZCIsInByZXBlbmQiLCJhdHRyIiwiX3BhcmVudCIsIl9zdHlsZXMiLCJfc3RhdGUiLCJfY2hpbGRyZW4iLCJfbm9ybWFsaXplT3B0aW9ucyIsIl9hcHBseU9wdGlvbnMiLCJfYXR0YWNoU3RhdGVFdmVudHMiLCJfcHJveHlQYXJlbnQiLCJfcmVmcmVzaFBhcmVudCIsIl9xdWlja0VsZW1lbnQiLCJ0b0pTT04iLCJjaGlsZHJlbiIsImRlZmluZVByb3BlcnRpZXMiLCJzdHlsZSIsInJlcGxhY2UiLCJfZmlsdGVyRWxlbWVudHMiLCJwYXJlbnRzVW50aWwiLCJfZ2V0UGFyZW50cyIsImlzUmVmIiwibmV4dFBhcmVudCIsInJlZiIsInF1ZXJ5Iiwic2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yIiwicXVlcnlBbGwiLCJxdWVyeVNlbGVjdG9yQWxsIiwiUXVpY2tCYXRjaCIsImNoaWxkTm9kZXMiLCJyZWYxIiwibm9kZVR5cGUiLCJwYXJlbnROb2RlIiwiZG9tRG9jIiwibmV4dFNpYmxpbmciLCJuZXh0RWxlbWVudFNpYmxpbmciLCJuZXh0QWxsIiwic2libGluZ3MiLCJuZXh0IiwicHJldmlvdXNTaWJsaW5nIiwicHJldmlvdXNFbGVtZW50U2libGluZyIsInByZXZBbGwiLCJwcmV2U2libGluZyIsInByZXYiLCJyZXZlcnNlIiwiX2NoaWxkUmVmcyIsIl9nZXRDaGlsZFJlZnMiLCJfZ2V0SW5kZXhCeVByb3AiLCJwYXJlbnRzIiwiZnJlc2hDb3B5IiwicmVmcyIsImNoaWxkUmVmcyIsIm1haW4iLCJhcnJheSIsIkNBQ0hFRF9GTl9JTlNFUlRFRCIsImJ1YmJsZXMiLCJiYXNlMSIsInJlbGF0ZWRJbnN0YW5jZSIsInJlbGF0ZWQiLCJiYXNlMiIsImNsYXNzIiwidXJsIiwiaHJlZiIsInVucGFzc2FibGVTdGF0ZXMiLCJwYXNzU3RhdGVUb0NoaWxkcmVuIiwicGFzc0RhdGFUb0NoaWxkcmVuIiwic3RhdGVUcmlnZ2VycyIsImJhc2VTdGF0ZVRyaWdnZXJzIiwiX3BhcnNlVGV4dHMiLCJfdGV4dHMiLCJfcGFyc2VTdHlsZXMiLCJzdHlsZXMiLCJzdG9yZSIsIl9tZWRpYVN0YXRlcyIsIm9iamVjdFBsYWluIiwic3RhdGVzIiwic3BlY2lhbFN0YXRlcyIsInN0YXRlIiwiX3Byb3ZpZGVkU3RhdGVzIiwiX3N0YXRlU2hhcmVkIiwiX3Byb3ZpZGVkU3RhdGVzU2hhcmVkIiwiYmFzZSIsIiRiYXNlIiwiZm9yY2VTdHlsZSIsImZsYXR0ZW5OZXN0ZWRTdGF0ZXMiLCJzdHlsZU9iamVjdCIsImNoYWluIiwiaGFzTm9uU3RhdGVQcm9wcyIsInN0YXRlXyIsInN0YXRlQ2hhaW4iLCJzdGF0ZVN0eWxlcyIsInRleHRzIiwiaWQiLCJzcmMiLCJzZWxlY3RlZCIsImNoZWNrZWQiLCJhdHRycyIsIl9hcHBseVJlZ2lzdGVyZWRTdHlsZSIsInN0eWxlQWZ0ZXJJbnNlcnQiLCJpbnZva2VDb21wdXRlcnNPbmNlIiwiX2ludm9rZWRDb21wdXRlcnMiLCJyZWNhbGNPblJlc2l6ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZWNhbGNTdHlsZSIsImV2ZW50cyIsImhhbmRsZXIiLCJtZXRob2RzIiwicmVmMiIsIm1ldGhvZCIsImNvbmZpZ3VyYWJsZSIsIl9wb3N0Q3JlYXRpb24iLCJkYXRhIiwiY29tcHV0ZXJzIiwiYXBwbHlEYXRhIiwiX2luaXQiLCJfcnVuQ29tcHV0ZXIiLCJmb3JjZSIsImRpc2FibGVyIiwidHJpZ2dlciIsImVuYWJsZXIiLCJfbGlzdGVuVG8iLCJuZXdQYXJlbnQiLCJsYXN0UGFyZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiX3VucHJveHlQYXJlbnQiLCJlbWl0UHJpdmF0ZSIsIl9pbnNlcnRlZCIsIm1lZGlhU3RhdGVzIiwicXVlcnlTdHJpbmciLCJNZWRpYVF1ZXJ5IiwicmVnZXhXaGl0ZXNwYWNlIiwiZXZlbnROYW1lcyIsImNhbGxiYWNrIiwidXNlQ2FwdHVyZSIsImlzUHJpdmF0ZSIsImNhbGxiYWNrUmVmIiwiX2V2ZW50Q2FsbGJhY2tzIiwiX19yZWZzIiwiY2FsbCIsImV2ZW50TmFtZSIsIl9pbnZva2VIYW5kbGVycyIsIm9uY2UiLCJvbmNlQ2FsbGJhY2siLCJlbWl0IiwiY2FuY2VsYWJsZSIsImNyZWF0ZUV2ZW50IiwiaW5pdEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsImFyZyIsImNhbGxiYWNrcyIsImNiIiwiZXZlbnROYW1lVG9MaXN0ZW5Gb3IiLCJsaXN0ZW5NZXRob2QiLCJEVU1NWV9BUlJBWSIsInRhcmdldFN0YXRlIiwiYWN0aXZlU3RhdGVzIiwiX3N0YXRlUGlwZVRhcmdldCIsImRlc2lyZWRWYWx1ZSIsIl9nZXRBY3RpdmVTdGF0ZXMiLCJ0b2dnbGUiLCJ0b2dnbGVTdGF0ZSIsInJlc2V0U3RhdGUiLCJhY3RpdmVTdGF0ZSIsInBpcGVTdGF0ZSIsInRhcmdldFN0eWxlIiwic3VwZXJpb3JTdGF0ZXMiLCJpbmNsdWRlQmFzZSIsInNraXBGbnMiLCJhZGRDbGFzcyIsInN1cGVyaW9yU3R5bGVzIiwiX3Jlc29sdmVGblN0eWxlcyIsImVudHJ5IiwiX3JlbW92ZVJlZ2lzdGVyZWRTdHlsZSIsInJlbW92ZUNsYXNzIiwicmVzZXRWYWx1ZSIsIl90dXJuU3R5bGVPTiIsIl9nZXRTdXBlcmlvclN0YXRlcyIsInNoYXJlZFN0YXRlcyIsIl9nZXRTaGFyZWRTdGF0ZXMiLCJfdHVyblN0eWxlT0ZGIiwiYWN0aXZlU2hhcmVkU3RhdGVzIiwiX3R1cm5UZXh0T04iLCJ0YXJnZXRUZXh0IiwiX3R1cm5UZXh0T0ZGIiwic3RhdGVUb0V4Y2x1ZGUiLCJpbmNsdWRlU2hhcmVkU3RhdGVzIiwicGxhaW5TdGF0ZXMiLCJjYW5kaWRhdGUiLCJ0YXJnZXRTdGF0ZUluZGV4Iiwic3VwZXJpb3IiLCJpc0FwcGxpY2FibGUiLCJhc3BlY3RSYXRpb0dldHRlciIsInByb3BlcnR5IiwiYXJncyIsImN1cnJlbnRTdGF0ZVN0eWxlIiwiVU5TRVQiLCJ0aGVuIiwic3R5bGVTYWZlIiwic2tpcENvbXB1dGVkIiwiY29tcHV0ZWQiLCJzYW1wbGUiLCJudW1iZXIiLCJzdHlsZVBhcnNlZCIsInJlY2FsY0NoaWxkcmVuIiwidGFyZ2V0U3R5bGVzIiwiaGlkZSIsInNob3ciLCJkaXNwbGF5Iiwib3JpZW50YXRpb25HZXR0ZXIiLCJ3aWR0aCIsImhlaWdodCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImdldEF0dHJpYnV0ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsInRvVGVtcGxhdGUiLCJjbG9uZU5vZGUiLCJlbENsb25lIiwibmV3RWwiLCJrIiwicHJldlBhcmVudCIsIl9yZW1vdmVDaGlsZCIsImFwcGVuZENoaWxkIiwiYXBwZW5kVG8iLCJ1bnNoaWZ0IiwiaW5zZXJ0QmVmb3JlIiwiZmlyc3RDaGlsZCIsInByZXBlbmRUbyIsImFmdGVyIiwibXlJbmRleCIsImJlZm9yZSIsImRldGFjaCIsInJlbW92ZSIsImVtcHR5Iiwid3JhcCIsImN1cnJlbnRQYXJlbnQiLCJ1bndyYXAiLCJncmFuZFBhcmVudCIsInBhcmVudENoaWxkcmVuIiwiYmF0Y2giLCJwYXJlbnRTaWJsaW5nIiwiaGFzQ2xhc3MiLCJjbGFzc0xpc3QiLCJ0YXJnZXRJbmRleCIsInRvZ2dsZUNsYXNzIiwic2V0UmVmIiwidGFyZ2V0Q2hpbGQiLCJyZXBsYWNlbWVudENoaWxkIiwiaW5kZXhPZkNoaWxkIiwicmVwbGFjZUNoaWxkIiwicmVtb3ZlQ2hpbGQiLCJpbm5lckhUTUwiLCJ0ZXh0Q29udGVudCIsImxpc3QiLCJwb3AiLCJzaGlmdCIsInVwZGF0ZU9wdGlvbnMiLCJ1cGRhdGVTdGF0ZVN0eWxlcyIsInBhcnNlZCIsInVwZGF0ZWRTdGF0ZXMiLCJ1cGRhdGVTdGF0ZVRleHRzIiwicGFzc1Rocm91Z2giLCJoYXNPd25Qcm9wZXJ0eSIsImNvbXB1dGVyIiwiUXVpY2tXaW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJwYXJzZVF1ZXJ5IiwicXVlcnlTcGxpdCIsInJ1bGVzIiwicnVsZURlbGltaXRlciIsImdldHRlciIsImlzTmFOIiwia2V5UHJlZml4IiwibWluIiwib3JpZW50YXRpb24iLCJhc3BlY3RSYXRpbyIsInBhcnNlZFZhbHVlIiwic3RyaW5nVmFsdWUiLCJ0ZXN0UnVsZSIsImN1cnJlbnRWYWx1ZSIsInBhc3NlZCIsIkFycmF5IiwicHJldkNvdW50IiwiZWxlbWVudCIsImFyZ3NMZW5ndGgiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwidHJlZSIsImh0bWwiLCJjb250YWluZXIiLCJpc1RlbXBsYXRlIiwiaXNRdWlja0VsIiwiaXNFbCIsImRvbUVsIiwiZWxlbWVudHMiLCJyZXR1cm5SZXN1bHRzMSIsInJldHVyblJlc3VsdHMiLCJyZXR1cm4iLCJyZXR1cm5OZXh0IiwibGFzdFJlc3VsdHMiLCJpdGVyYWJsZSIsImV4dGVuZFRlbXBsYXRlIiwiY3VycmVudE9wdHMiLCJuZXdPcHRzIiwiZ2xvYmFsT3B0cyIsImN1cnJlbnRDaGlsZCIsImdsb2JhbE9wdHNUcmFuc2Zvcm0iLCJvcHRzIiwicGFyc2VUcmVlIiwibWF0Y2hlc1NjaGVtYSIsIm51bGxEZWxldGVzIiwibm90RGVlcEtleXMiLCJ0cmFuc2Zvcm0iLCJjdXJyZW50Q2hpbGRyZW4iLCJuZXdDaGlsZHJlbiIsIm5lZWRzVGVtcGxhdGVXcmFwIiwibm9DaGFuZ2VzIiwibmV3Q2hpbGQiLCJuZXdDaGlsZFByb2Nlc3NlZCIsInNjaGVtYSIsImFsbG93TnVsbCIsImV4dGVuZEJ5UmVmIiwicmVtYWluaW5nTmV3Q2hpbGRyZW4iLCJuZXdDaGlsZHJlblJlZnMiLCJwYXJzZUVycm9yUHJlZml4IiwicGFyc2VDaGlsZHJlbiIsImRvbVRleHQiLCJhbGxvd2VkVGVtcGxhdGVPcHRpb25zIiwiaXNUcmVlIiwibmV3VmFsdWVzIiwiY2hpbGREYXRhIiwic2hvcnRjdXQiLCJSZWdFeHAiLCJvYmplY3RhYmxlIiwibm9ybWFsaXplS2V5cyIsImlzQXJyYXkiLCJpc0Jhc2UiLCJ0aGVUYXJnZXQiLCIkX2kiLCJzb3VyY2VzIiwibW9kaWZpZXJzIiwiXyIsImRlZXBPbmx5IiwiZ2xvYmFsVHJhbnNmb3JtIiwidHJhbnNmb3JtcyIsImdsb2JhbEZpbHRlciIsImZpbHRlcnMiLCJhbmltYXRpb24iLCJvcGFjaXR5IiwiQ29uZGl0aW9uIiwiZmFzdGRvbSIsImN1cnJlbnRJRCIsInRyYW5zZm9ybVNldHRpbmdzIiwiSUQiLCJhbGxGaWVsZHMiLCJmaWVsZEluc3RhbmNlcyIsImluc3RhbmNlcyIsIl92YWx1ZSIsInZhbGlkIiwidmlzaWJsZSIsImZvY3VzZWQiLCJob3ZlcmVkIiwiZmlsbGVkIiwiaW50ZXJhY3RlZCIsImlzTW9iaWxlIiwiZGlzYWJsZWQiLCJtYXJnaW4iLCJwYWRkaW5nIiwic2hvd0xhYmVsIiwibGFiZWwiLCJzaG93SGVscCIsImhlbHAiLCJzaG93RXJyb3IiLCJlcnJvciIsInBsYWNlaG9sZGVyIiwiaW5pdCIsImNvbmRpdGlvbnMiLCJfY29uc3RydWN0b3JFbmQiLCJjaGlsZGYiLCJkZWZhdWx0VmFsdWUiLCJtdWx0aXBsZSIsInVwZGF0ZU9uQmluZCIsIm9mIiwidG8iLCJjb25kaXRpb24iLCJhbmQiLCJiaW5kIiwicHJldlNob3ciLCJjaGFuZ2VBbW91bnQiLCJtYWtlUm9vbUZvckhlbHAiLCJtb2JpbGVXaWR0aCIsIm1lYXN1cmUiLCJtb2JpbGVUaHJlc2hvbGQiLCJ1cGRhdGVPbiIsIl9xdWlja0ZpZWxkIiwiX2Zvcm1hdFdpZHRoIiwiZGlzdGFuY2UiLCJkZXN0cm95IiwicmVtb3ZlRnJvbURPTSIsInVuQmluZEFsbCIsIl9kZXN0cm95IiwiYXBwbHkiLCJ2YWxpZGF0ZSIsInByb3ZpZGVkVmFsdWUiLCJjb3JlVmFsdWVQcm9wIiwidGVzdFVucmVxdWlyZWQiLCJyZXBvcnQiLCJpc1ZhbGlkIiwidmFsaWRhdG9yIiwicmVxdWlyZWQiLCJfdmFsaWRhdGUiLCJjbGVhckVycm9yT25WYWxpZCIsInZhbGlkYXRlQ29uZGl0aW9ucyIsInBhc3NlZENvbmRpdGlvbnMiLCJ0b2dnbGVWaXNpYmlsaXR5IiwidmFsaWRhdGVBbmRSZXBvcnQiLCJjaG9pY2VzIiwiX2dldFZhbHVlIiwiX3NldFZhbHVlIiwic2V0dGVyIiwiTWFzayIsIlJFR0VYIiwiS0VZQ09ERVMiLCJUZXh0RmllbGQiLCJ0eXBpbmciLCJjdXJzb3IiLCJjdXJyZW50IiwidmFsaWRXaGVuUmVnZXgiLCJrZXlib2FyZCIsImVtYWlsIiwibWFzayIsInBhdHRlcm4iLCJfY3JlYXRlRWxlbWVudHMiLCJfYXR0YWNoQmluZGluZ3MiLCJkcm9wZG93biIsInNldFZhbHVlIiwiX3JlY2FsY0Rpc3BsYXkiLCJhdXRvV2lkdGgiLCJEcm9wZG93biIsImlubmVyd3JhcCIsImljb24iLCJpbnB1dCIsImNoZWNrbWFyayIsIl9hdHRhY2hCaW5kaW5nc19lbFN0YXRlIiwiX2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXkiLCJfYXR0YWNoQmluZGluZ3NfZGlzcGxheV9hdXRvV2lkdGgiLCJfYXR0YWNoQmluZGluZ3NfdmFsdWUiLCJfYXR0YWNoQmluZGluZ3NfYXV0b2NvbXBsZXRlIiwiX2F0dGFjaEJpbmRpbmdzX3N0YXRlVHJpZ2dlcnMiLCJzZXRUaW1lb3V0IiwiY2hlY2ttYXJrX21hc2sxIiwiY2hlY2ttYXJrX21hc2syIiwiY2hlY2ttYXJrX3BhdGNoIiwidXBkYXRlRXZlbklmU2FtZSIsIl9nZXRJbnB1dEF1dG9XaWR0aCIsInJlc2V0SW5wdXQiLCJpc0VtcHR5Iiwic2VsZWN0aW9uIiwiZ3VpZGUiLCJrZXlDb2RlIiwiZW50ZXIiLCJkZWZhdWx0T3B0aW9ucyIsImlzVHlwaW5nIiwiaXNPcGVuIiwiY2FsY0Rpc3BsYXkiLCJjaG9pY2UiLCJzaG91bGRCZVZpc2libGUiLCJvblNlbGVjdGVkIiwic2VsZWN0ZWRDaG9pY2UiLCJibHVyIiwiZW5kIiwiX3NjaGVkdWxlQ3Vyc29yUmVzZXQiLCJjdXJyZW50Q3Vyc29yIiwibmV3Q3Vyc29yIiwibm9ybWFsaXplQ3Vyc29yUG9zIiwiX3NldFZhbHVlSWZOb3RTZXQiLCJpbnB1dFdpZHRoIiwic2Nyb2xsTGVmdCIsIm9mZnNldFdpZHRoIiwic2Nyb2xsV2lkdGgiLCJsYWJlbFdpZHRoIiwicmVjdCIsIl9nZXRXaWR0aFNldHRpbmciLCJwYXJlbnRXaWR0aCIsIm1hdGNoaW5nQ2hvaWNlIiwidGVzdCIsInZhbGlkV2hlbklzQ2hvaWNlIiwibWluTGVuZ3RoIiwic3RhcnQiLCJzZXRTZWxlY3Rpb25SYW5nZSIsInNlbGVjdGlvblN0YXJ0Iiwic2VsZWN0aW9uRW5kIiwiZm9jdXMiLCJhcnJheU11dGF0b3JNZXRob2RzIiwiZHVtbXlQcm9wZXJ0eURlc2NyaXB0b3IiLCJib3VuZEluc3RhbmNlcyIsInNpbGVudCIsIm5ld1BsYWNlaG9sZGVyIiwiY2hlY2tJZiIsInNldFBob2xkZXJSZWdFeCIsImRlbGF5IiwidGhyb3R0bGUiLCJzaW1wbGVTZWxlY3RvciIsInByb21pc2VUcmFuc2Zvcm1zIiwiZGlzcGF0Y2hFdmVudHMiLCJzZW5kQXJyYXlDb3BpZXMiLCJnZXREZXNjcmlwdG9yIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiY2FjaGVkRXZlbnQiLCJjaGFuZ2VFdmVudCIsIl9zYiIsInJlcXVpcmVzRG9tRGVzY3JpcHRvckZpeCIsIkVsZW1lbnQiLCJ3aW5kb3dQcm9wc1RvSWdub3JlIiwic2V0VmFsdWVOb29wIiwidiIsInB1Ymxpc2hlciIsInVwZGF0ZUFsbFN1YnMiLCJnZW5JRCIsImdlbk9iaiIsImdlblByb3hpZWRJbnRlcmZhY2UiLCJpc1N1YiIsImNvbXBsZXRlQ2FsbGJhY2siLCJjdXN0b21PcHRpb25zIiwic2F2ZU9wdGlvbnMiLCJnZW5TZWxmVXBkYXRlciIsImJpbmRpbmciLCJmZXRjaFZhbHVlIiwic2VsZlVwZGF0ZXIiLCJCaW5kaW5nIiwiZmV0Y2hEaXJlY3RWYWx1ZSIsImlzRGVmaW5lZCIsImlzT2JqZWN0IiwiaXNTdHJpbmciLCJpc051bWJlciIsImlzRnVuY3Rpb24iLCJpc0JpbmRpbmdJbnRlcmZhY2UiLCJCaW5kaW5nSW50ZXJmYWNlIiwiaXNCaW5kaW5nIiwiaXNJdGVyYWJsZSIsImlzRG9tIiwiaXNEb21JbnB1dCIsImlzRG9tUmFkaW8iLCJpc0RvbUNoZWNrYm94IiwiaXNFbENvbGxlY3Rpb24iLCJOb2RlTGlzdCIsIkhUTUxDb2xsZWN0aW9uIiwialF1ZXJ5IiwiZG9tRWxzQXJlU2FtZSIsIml0ZW1zV2l0aFNhbWVUeXBlIiwiaXNEb21Ob2RlIiwiY29udmVydFRvTGl2ZSIsImlzUHJvdG8iLCJkZXNjcmlwdG9yIiwib2JqZWN0UHJvdG8iLCJnZXRQcm90b3R5cGVPZiIsImZldGNoRGVzY3JpcHRvciIsImJpbmRpbmdJbnN0YW5jZSIsIm9ubHlBcnJheU1ldGhvZHMiLCJvcmlnRGVzY3JpcHRvciIsIm9yaWdGbiIsImNvbnRleHQiLCJnZXR0ZXJWYWx1ZSIsInByb3h5Rm4iLCJzZWxmVHJhbnNmb3JtIiwiaXNMaXZlUHJvcCIsInRhcmdldEluY2x1ZGVzIiwicHJvcGVydHlEZXNjcmlwdG9yIiwib3JpZ0dldHRlciIsIm9yaWdTZXR0ZXIiLCJzaG91bGRXcml0ZUxpdmVQcm9wIiwiQ1NTU3R5bGVEZWNsYXJhdGlvbiIsInR5cGVJc0FycmF5Iiwic2hvdWxkSW5kaWNhdGVVcGRhdGVJc0Zyb21TZWxmIiwiZW51bWVyYWJsZSIsImNvbnZlcnRUb1JlZyIsIm5ld0Rlc2NyaXB0b3IiLCJjbG9uZU9iamVjdCIsImV4dGVuZFN0YXRlIiwic3RhdGVUb0luaGVyaXQiLCJjYWNoZSIsImlzTXVsdGlDaG9pY2UiLCJzYW1wbGVJdGVtIiwiX3NiX0lEIiwiX3NiX21hcCIsImdyb3VwQmluZGluZyIsInByb3BzTWFwIiwiYWRkVG9Ob2RlU3RvcmUiLCJwaG9sZGVyUmVnRXgiLCJwaG9sZGVyUmVnRXhTcGxpdCIsImVzY2FwZVJlZ0V4IiwibWlkZGxlIiwiYXBwbHlQbGFjZWhvbGRlcnMiLCJjb250ZXh0cyIsImluZGV4TWFwIiwiY29udGV4dFBhcnQiLCJub2RlU3RvcmUiLCJub2RlIiwidGFyZ2V0UGxhY2Vob2xkZXIiLCJzY2FuVGV4dE5vZGVzUGxhY2Vob2xkZXJzIiwibWF0Y2giLCJ0ZXh0UGllY2VzIiwibmV3RnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwibmV3Tm9kZSIsInRleHRQaWVjZSIsImdldEVyclNvdXJjZSIsImVycm9yTmFtZSIsImVycm9ycyIsInRocm93V2FybmluZyIsIndhcm5pbmdOYW1lIiwiZGVwdGgiLCJlcnJTb3VyY2UiLCJ0aHJvd0Vycm9yQmFkQXJnIiwidGhyb3dFcnJvciIsInN0YWNrIiwiaW52YWxpZFBhcmFtTmFtZSIsImZuT25seSIsImJhZEV2ZW50QXJnIiwiZW1wdHlMaXN0Iiwib25seU9uZURPTUVsZW1lbnQiLCJtaXhlZEVsTGlzdCIsImludGVyZmFjZVRvUmV0dXJuIiwic2VsZkNsb25lIiwibmV3SW50ZXJmYWNlIiwic2V0T2JqZWN0Iiwic2V0UHJvcGVydHkiLCJib3RoV2F5cyIsImJvdW5kSUQiLCJwcm9wTWFwIiwicmVtb3ZlQWxsU3VicyIsInBhcmVudEJpbmRpbmciLCJvcHRpb25zRGVmYXVsdCIsInN1YnMiLCJzdWJzTWV0YSIsInB1YnNNYXAiLCJhdHRhY2hlZEV2ZW50cyIsImNob2ljZUVsIiwiY2hvaWNlQmluZGluZyIsImFkZFN1YiIsInRyYW5zZm9ybUZuIiwicGFyZW50UHJvcGVydHkiLCJzY2FuRm9yUGhvbGRlcnMiLCJwaG9sZGVyVmFsdWVzIiwicGhvbGRlciIsInRleHROb2RlcyIsInN1YmplY3RWYWx1ZSIsImF0dGFjaEV2ZW50cyIsImV2ZW50VXBkYXRlSGFuZGxlciIsInN1YiIsInVwZGF0ZU9uY2UiLCJhbHJlYWR5SGFkU3ViIiwiaXNNdWx0aSIsInN1Ykl0ZW0iLCJtZXRhRGF0YSIsInZhbHVlUmVmIiwicmVtb3ZlU3ViIiwicmVtb3ZlUG9sbEludGVydmFsIiwidW5SZWdpc3RlckV2ZW50IiwiY2hvaWNlTmFtZSIsImZyb21TZWxmIiwiZnJvbUNoYW5nZUV2ZW50IiwiZW50aXJlVmFsdWUiLCJsZW4iLCJsZW4xIiwibiIsIm5ld0Nob2ljZVZhbHVlIiwibmV3Q2hvaWNlcyIsIm5ld1ZhbHVlQXJyYXkiLCJvdmVyd3JpdGVQcmV2aW91cyIsInByZXZDdXJzcm9yIiwicHJldlZhbHVlIiwidGFyZ2V0Q2hvaWNlQmluZGluZyIsInRleHROb2RlIiwicGhvbGRlckNvbnRleHRzIiwicGhvbGRlckluZGV4TWFwIiwidmFsdWVQYXNzZWQiLCJpc0VtaXR0ZXIiLCJlbWl0RXZlbnQiLCJhcnIiLCJ1cGRhdGVTdWIiLCJpc0RlbGF5ZWRVcGRhdGUiLCJjdXJyZW50VGltZSIsIm1ldGEiLCJzdWJWYWx1ZSIsInRpbWVQYXNzZWQiLCJkaXNhbGxvd0xpc3QiLCJEYXRlIiwibGFzdFVwZGF0ZSIsImNsZWFyVGltZW91dCIsInVwZGF0ZVRpbWVyIiwiY29uZGl0aW9uRm4iLCJhZGRNb2RpZmllckZuIiwic3ViSW50ZXJmYWNlcyIsInN1YmplY3RGbiIsInN1YkludGVyZmFjZSIsInN1Yk1ldGFEYXRhIiwic3Vic2NyaWJlciIsImJpbmRpbmdzIiwic2V0U2VsZlRyYW5zZm9ybSIsImFkZERpc2FsbG93UnVsZSIsInRhcmdldFN1YiIsInRhcmdldERpc2FsbG93IiwiZSIsImFkZFBvbGxJbnRlcnZhbCIsInRpbWUiLCJwb2xsSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInBvbGxlZFZhbHVlIiwiY2xlYXJJbnRlcnZhbCIsImFkZFVwZGF0ZUxpc3RlbmVyIiwidGFyZ2V0UHJvcGVydHkiLCJzaG91bGRSZWRlZmluZVZhbHVlIiwicmVnaXN0ZXJFdmVudCIsImV2ZW50SGFuZGxlciIsImV2ZW50TWV0aG9kcyIsImxpc3RlbiIsImV4dHJhRGF0YSIsImV2ZW50T2JqZWN0IiwiYmluZGluZ0RhdGEiLCJpbmhlcml0ZWRTdGF0ZSIsInN0YWdlIiwib3B0aW9uc1Bhc3NlZCIsIkJpbmRpbmdJbnRlcmZhY2VQcml2YXRlIiwiZGVmaW5lTWFpblByb3BzIiwib2JqZWN0cyIsImNyZWF0ZUJpbmRpbmciLCJuZXdPYmplY3RUeXBlIiwiYmluZGluZ0ludGVyZmFjZSIsImNhY2hlZEJpbmRpbmciLCJwYXRjaENhY2hlZEJpbmRpbmciLCJuZXdCaW5kaW5nIiwib3B0aW9uIiwidG9TdHJpbmciLCJyZW1vdmVNZXRob2QiLCJlbWl0TWV0aG9kIiwiR3JvdXBCaW5kaW5nIiwiYWRkVG9QdWJsaXNoZXIiLCJwdWJsaXNoZXJJbnRlcmZhY2UiLCJNRVRIT0RfYm90aFdheXMiLCJNRVRIT0Rfb2YiLCJNRVRIT0Rfc2V0IiwiY2hhaW5UbyIsIk1FVEhPRF9jaGFpblRvIiwidHJhbnNmb3JtU2VsZiIsIk1FVEhPRF90cmFuc2Zvcm1TZWxmIiwiTUVUSE9EX3RyYW5zZm9ybSIsInRyYW5zZm9ybUFsbCIsIk1FVEhPRF90cmFuc2Zvcm1BbGwiLCJNRVRIT0RfY29uZGl0aW9uIiwiY29uZGl0aW9uQWxsIiwiTUVUSE9EX2NvbmRpdGlvbkFsbCIsInVuQmluZCIsIk1FVEhPRF91bkJpbmQiLCJwb2xsRXZlcnkiLCJNRVRIT0RfcG9sbEV2ZXJ5Iiwic3RvcFBvbGxpbmciLCJNRVRIT0Rfc3RvcFBvbGxpbmciLCJzZXRPcHRpb24iLCJNRVRIT0Rfc2V0T3B0aW9uIiwiZGlzYWxsb3dGcm9tIiwidGhpc0ludGVyZmFjZSIsImRpc2FsbG93SW50ZXJmYWNlIiwicmVtb3ZlVXBkYXRlciIsImNsb25lQmluZGluZyIsImNsb25lSW50ZXJmYWNlIiwiYWRkQmluZGluZyIsInNpYmxpbmdJbnRlcmZhY2UiLCJ1cGRhdGUiLCJ0d29XYXkiLCJwaXBlIiwic3BlY2lmaWNPcHRpb25zIiwiYWx0VHJhbnNmb3JtIiwic3ViQmluZGluZyIsIm9yaWdpblRyYW5zZm9ybSIsIm9yaWdpbkNvbmRpdGlvbiIsInRyYW5zZm9ybVRvVXNlIiwib3B0aW9uTmFtZSIsIm9iamVjdFR5cGUiLCJpbnRlcmZhY2UiLCJwcm90byIsIm1ldGhvZE5hbWUiLCJhIiwiYiIsImMiLCJkIiwiYW55IiwibnVtZXJpYyIsImxldHRlciIsIndpZGVudW1lcmljIiwiYWxwaGFudW1lcmljIiwicXVpY2tjc3MiLCJjb21wdXRlZFN0eWxlIiwic3ViRWwiLCJzdWJQcm9wZXJ0eSIsIm5vcm1hbGl6ZVByb3BlcnR5IiwiX2NvbXB1dGVkU3R5bGUiLCJnZXRDb21wdXRlZFN0eWxlIiwibm9ybWFsaXplVmFsdWUiLCJmcmFtZXMiLCJmcmFtZSIsInByZWZpeCIsImdldFByZWZpeCIsImdlbmVyYXRlZCIsInJ1bGVUb1N0cmluZyIsImlubGluZVN0eWxlIiwiaGFzaCIsImNsZWFyUmVnaXN0ZXJlZCIsImNsZWFySW5saW5lU3R5bGUiLCJpc1ZhbHVlU3VwcG9ydGVkIiwic3VwcG9ydHMiLCJzdXBwb3J0c1Byb3BlcnR5IiwiaXNQcm9wU3VwcG9ydGVkIiwiQ2hlY2tzIiwibmF0aXZlcyIsImRvbSIsInNldHMiLCJhdmFpbFNldHMiLCJzaG91bGREZWVwRXh0ZW5kIiwicGFyZW50S2V5Iiwic291cmNlVmFsdWUiLCJ0YXJnZXRWYWx1ZSIsInN1YlRhcmdldCIsIndpbiIsImRlYnVnIiwicmFmIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwid2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJzZWxmIiwicmVhZHMiLCJ3cml0ZXMiLCJGYXN0RG9tIiwiY3R4IiwidGFzayIsInNjaGVkdWxlRmx1c2giLCJtdXRhdGUiLCJjbGVhciIsIm1peGluIiwiaW5pdGlhbGl6ZSIsImNhdGNoIiwic2NoZWR1bGVkIiwiZmx1c2giLCJydW5UYXNrcyIsIm1lc3NhZ2UiLCJ0YXNrcyIsImRlZmluZSIsImZpZWxkMSIsInNhdGlzZmllZCIsIm9sZFZhbHVlIiwiY29tcGFyaXNvbiIsIm5lc3RlZE9iamVjdCIsInByb3BlcnR5Q2hhaW4iLCJjb21wYXJpc29uT3BlcmF0b3JzIiwicGFzc2VkQ29tcGFyaXNvbnMiLCJvcGVyYXRvciIsInNlZWtlZFZhbHVlIiwidGVzdE1hc2siLCJ2YWxpZENvbmRpdGlvbnMiLCJmb250RmFtaWx5IiwiYm9yZGVyIiwiaW5wdXRQYWRkaW5nIiwibGFiZWxTaXplIiwiaWNvblNpemUiLCJDaG9pY2UiLCJpbml0aWFsQ2hvaWNlcyIsInR5cGVCdWZmZXIiLCJfc2V0dGluZ0ZpbHRlcnMiLCJsYXN0U2VsZWN0ZWQiLCJjdXJyZW50SGlnaGxpZ2h0ZWQiLCJ2aXNpYmxlQ2hvaWNlc0NvdW50IiwidmlzaWJsZUNob2ljZXMiLCJlbHMiLCJfc2VsZWN0ZWRDYWxsYmFjayIsInNjcm9sbEluZGljYXRvclVwIiwic2Nyb2xsSW5kaWNhdG9yRG93biIsIkxpc3QiLCJhZGRDaG9pY2UiLCJfYXR0YWNoQmluZGluZ3Nfc2Nyb2xsSW5kaWNhdG9ycyIsImFwcGVuZENob2ljZXMiLCJzY3JvbGxUb0Nob2ljZSIsInNldFRyYW5zbGF0ZSIsIm5ld0Nob2ljZSIsInByZXZDaG9pY2UiLCJ1cCIsImhpZ2hsaWdodFByZXYiLCJkb3duIiwiaGlnaGxpZ2h0TmV4dCIsImVzYyIsImFueVByaW50YWJsZSIsInR5cGVCdWZmZXJUaW1lb3V0IiwiYnVmZmVyIiwiY2hvaWNlSW5WaWV3Iiwic2hvd0JvdHRvbUluZGljYXRvciIsInNob3dUb3BJbmRpY2F0b3IiLCJzdGFydFNjcm9sbGluZyIsInN0b3BTY3JvbGxpbmciLCJmaW5kQ2hvaWNlIiwiYnlMYWJlbCIsIm1hdGNoZXMiLCJmaW5kQ2hvaWNlQW55IiwiY3VycmVudEluZGV4Iiwic2Nyb2xsVXAiLCJzY3JvbGxEb3duIiwibWF4SGVpZ2h0IiwiYXBwZW5kZWRDaG9pY2VzIiwiYm90dG9tQ3V0b2ZmIiwidHJhbnNsYXRpb24iLCJjbGlwcGluZ1BhcmVudCIsIm92ZXJmbG93Iiwic2VsZlJlY3QiLCJjbGlwcGluZ1JlY3QiLCJ0b3BDdXRvZmYiLCJpc0JvdHRvbUN1dG9mZiIsImlzVG9wQ3V0b2ZmIiwibmVlZHNOZXdIZWlnaHQiLCJjdXRvZmYiLCJ3aW5kb3dDdXRvZmYiLCJ3aW5kb3dIZWlnaHQiLCJzZXREaW1lbnNpb25zIiwib2Zmc2V0IiwiZGlzdGFuZUZyb21Ub3AiLCJvZmZzZXRUb3AiLCJzZWxlY3RlZEhlaWdodCIsImNob2ljZVJlY3QiLCJsaXN0UmVjdCIsInVwUGFkZGluZyIsImRvd25QYWRkaW5nIiwiZGlyZWN0aW9uIiwic2Nyb2xsSW50ZXJ2YWxJRCIsInVuYXZhaWxhYmxlIiwiaW5pdGlhbGl6ZWQiLCJzb3J0Iiwic3RvcFByb3BhZ2F0aW9uIiwibmV3U3RhdGUiLCJwcmV2U3RhdGUiLCJtYXNrQ29yZSIsIm1hc2tBZGRvbnMiLCJkZWZhdWx0UGF0dGVybkNoYXJzIiwicHJldkN1cnNvciIsInBhdHRlcm5SYXciLCJwYXR0ZXJuU2V0dGVyIiwicGxhY2Vob2xkZXJDaGFyIiwicGxhY2Vob2xkZXJSZWdleCIsImtlZXBDaGFyUG9zaXRpb25zIiwiY2hhcnMiLCJjdXN0b21QYXR0ZXJucyIsInNldFBhdHRlcm4iLCJnZXRTdGF0ZSIsInJhd1ZhbHVlIiwiY3VycmVudENhcmV0UG9zaXRpb24iLCJwcmV2aW91c0NvbmZvcm1lZFZhbHVlIiwiZ2V0UGxhY2Vob2xkZXIiLCJjaGFyIiwicmVzb2x2ZVBhdHRlcm4iLCJ0cmFwSW5kZXhlcyIsImNvcHkiLCJwcmV2UGF0dGVybiIsInJlc29sdmVkUGF0dGVybiIsImNhcmV0VHJhcEluZGV4ZXMiLCJ1cGRhdGVWYWx1ZSIsInVwZGF0ZUZpZWxkIiwicGFyc2VQYXR0ZXJuIiwicGFyc2VUcmFuc2Zvcm0iLCJlbWFpbE1hc2siLCJ0cmltIiwicGFydCIsImNyZWF0ZU51bWJlck1hc2siLCJzdWZmaXgiLCJpbmNsdWRlVGhvdXNhbmRzU2VwYXJhdG9yIiwic2VwIiwidGhvdXNhbmRzU2VwYXJhdG9yU3ltYm9sIiwiYWxsb3dEZWNpbWFsIiwiZGVjaW1hbCIsImRlY2ltYWxMaW1pdCIsImludGVnZXJMaW1pdCIsImxpbWl0IiwiZXNjYXBlZCIsImNyZWF0ZUF1dG9Db3JyZWN0ZWREYXRlUGlwZSIsIm5ld1BhdHRlcm4iLCJjb25mb3JtVG9NYXNrIiwidHJhbnNmb3JtZWQiLCJjb25mb3JtZWRWYWx1ZSIsImluZGV4ZXNPZlBpcGVkQ2hhcnMiLCJhZGp1c3RDYXJldFBvc2l0aW9uIiwia2V5Q29kZXMiLCJkZWxldGUiLCJjdHJsIiwiYWx0Iiwic3VwZXIiLCJzdXBlcjIiLCJoeXBoZW4iLCJ1bmRlcnNjb3JlIiwicXVlc3Rpb24iLCJleGNsYW1hdGlvbiIsImZyb250c2xhc2giLCJiYWNrc2xhc2giLCJjb21tYSIsInBlcmlvZCIsInNwYWNlIiwiYW55QXJyb3ciLCJjb2RlIiwiYW55TW9kaWZpZXIiLCJhbnlBbHBoYSIsImFueU51bWVyaWMiLCJhbnlBbHBoYU51bWVyaWMiLCJDSEVDS01BUktfV0lEVEgiLCJDT0xPUlMiLCJwb3NpdGlvbiIsInZlcnRpY2FsQWxpZ24iLCJib3hTaXppbmciLCJ0ZXh0QWxpZ24iLCIkdmlzaWJsZSIsIiRzaG93RXJyb3IiLCJ6SW5kZXgiLCJmb250V2VpZ2h0IiwibGluZUhlaWdodCIsImdyZXkiLCJ0cmFuc2l0aW9uIiwidXNlclNlbGVjdCIsInBvaW50ZXJFdmVudHMiLCIkZmlsbGVkIiwiJHNob3dMYWJlbCIsIiRmb2N1cyIsIm9yYW5nZSIsInJlZCIsImJhY2tncm91bmRDb2xvciIsImJvcmRlcldpZHRoIiwiYm9yZGVyU3R5bGUiLCJib3JkZXJDb2xvciIsImdyZXlfbGlnaHQiLCJib3JkZXJSYWRpdXMiLCIkZGlzYWJsZWQiLCJpY29uU2libGluZyIsImlucHV0U2libGluZyIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1JpZ2h0Iiwic3VidHJhY3QiLCJhcHBlYXJhbmNlIiwib3V0bGluZSIsImJsYWNrIiwiYm94U2hhZG93IiwiYmFja2dyb3VuZENsaXAiLCJ0b3RhbEhlaWdodCIsIndvcmthYmxlSGVpZ2h0IiwiZmxvb3IiLCJob3JpeiIsInZlcnRpIiwidmlzaWJpbGl0eSIsIiRzaG93SGVscCIsInBhZGRpbmdUb3AiLCJncmVlbiIsInRyYW5zZm9ybU9yaWdpbiIsIiRpbnZhbGlkIiwibWF4V2lkdGgiLCJtaW5XaWR0aCIsIlNBTVBMRV9TVFlMRSIsInRvS2ViYWJDYXNlIiwic2tpcEluaXRpYWxDaGVjayIsImdyZWF0IiwibGVzcyIsInBpdm90IiwiaHNoIiwiY2hhckNvZGVBdCIsImlubGluZVN0eWxlQ29uZmlnIiwic3R5bGVDb25maWciLCJ2YWx1ZVRvU3RvcmUiLCJzdHlsZUVsIiwiaGVhZCIsImNvbnRlbnQiLCJSRUdFWF9MRU5fVkFMIiwiUkVHRVhfRElHSVRTIiwiUkVHRVhfU1BBQ0UiLCJSRUdFWF9LRUJBQiIsIklNUE9SVEFOVCIsIlBPU1NJQkxFX1BSRUZJWEVTIiwiUkVRVUlSRVNfVU5JVF9WQUxVRSIsIlFVQURfU0hPUlRIQU5EUyIsIkRJUkVDVElPTlMiLCJudW1iZXJMb29zZSIsIk51bWJlciIsImRvbVRleHRhcmVhIiwiZG9tSW5wdXQiLCJkb21TZWxlY3QiLCJkb21GaWVsZCIsIlNWRyIsIiRpc09wZW4iLCIkaGFzVmlzaWJsZUNob2ljZXMiLCJvdmVyZmxvd1Njcm9sbGluZyIsIm92ZXJmbG93U3R5bGUiLCIkdW5hdmFpbGFibGUiLCIkaG92ZXIiLCJzdHJva2UiLCIkc2VsZWN0ZWQiLCJ0ZXh0T3ZlcmZsb3ciLCJ3b3JkV3JhcCIsImNhcmV0VXAiLCJjYXJldERvd24iLCJib3JkZXJUb3AiLCJyIiwiYW1kIiwidGV4dE1hc2tDb3JlIiwidCIsIm8iLCJsb2FkZWQiLCJtIiwicCIsIl9fZXNNb2R1bGUiLCJwcmV2aW91c1BsYWNlaG9sZGVyIiwidSIsImwiLCJzIiwiZiIsImgiLCJnIiwieSIsIkMiLCJQIiwieCIsIk8iLCJNIiwiVCIsInciLCJWIiwiUyIsInN1YnN0ciIsIk4iLCJFIiwiQSIsIkkiLCJKIiwicSIsIkYiLCJMIiwiVyIsInoiLCJEIiwiSCIsIksiLCJRIiwiY29udmVydE1hc2tUb1BsYWNlaG9sZGVyIiwiYWJzIiwiaXNOZXciLCJzb21lQ2hhcnNSZWplY3RlZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJtYXNrV2l0aG91dENhcmV0VHJhcHMiLCJpbmRleGVzIiwicHJvY2Vzc0NhcmV0VHJhcHMiLCJpbnB1dEVsZW1lbnQiLCJzaG93TWFzayIsInJlamVjdGVkIiwiYWN0aXZlRWxlbWVudCIsImFzc2lnbiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidGV4dE1hc2tBZGRvbnMiLCJkZCIsIm1tIiwieXkiLCJ5eXl5Iiwic29tZSIsImxhc3RJbmRleE9mIiwiJCIsImRlY2ltYWxTeW1ib2wiLCJyZXF1aXJlRGVjaW1hbCIsImFsbG93TmVnYXRpdmUiLCJhbGxvd0xlYWRpbmdaZXJvZXMiLCJpbnN0YW5jZU9mIiwiZ3JleV9kYXJrIiwiZ3JleV9zZW1pX2xpZ2h0IiwiZ3JleV9saWdodDIiLCJncmV5X2xpZ2h0MyIsImdyZXlfbGlnaHQ0IiwiU3RhdGVDaGFpbiIsIndpdGhvdXQiLCJvdGhlckFjdGl2ZSIsImFjdGl2ZSIsImFuZ2xlRG93biIsInBsdXMiLCJ2aWV3Qm94IiwidGFiaW5kZXgiLCJmb2N1c2FibGUiLCJmaWxsIiwicG9pbnRzIl0sIm1hcHBpbmdzIjoi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LFFBQ0FpSTtPQUNDZ2tDO1NBQVM7QUFDVEMsVUFBVSxDQUFDO0FBQ1hDLFdBQVc7O0FBQ1pucEMsT0FDQ2tNO09BQU87QUFDUEMsUUFBUTtBQUNSK3pCLFNBQVM7O0dBRVYsQ0FBQyxTQUNBajdCO09BQ0Npa0M7VUFBVSxDQUFDO0FBQ1hDLFdBQVc7QUFDWGhaLEdBQUc7Ozs7OztBQ2pCUHI5QjtNQUVNO0FBQU5zRCxPQUFPQyxVQUFVdkQsSUFBSWtLLFNBQ3BCLENBQUMsUUFDQWlJO09BQ0Nna0M7U0FBUztBQUNUQyxVQUFVLENBQUM7QUFDWEMsV0FBVzs7QUFDWm5wQyxPQUNDa007T0FBTztBQUNQQyxRQUFRO0FBQ1IrekIsU0FBUzs7R0FFVixDQUFDLFlBQ0FqN0I7T0FDQ2lrQztVQUFVLENBQUM7QUFDWEMsV0FBVztBQUNYRSxRQUFROzs7Ozs7QUNqQlp2MkM7TUFFTTtBQUFOc0QsT0FBT0MsVUFBVXZELElBQUlrSyxTQUNwQixDQUFDLFFBQ0FpSTtPQUNDZ2tDO1NBQVM7QUFDVEMsVUFBVSxDQUFDO0FBQ1hDLFdBQVc7O0FBQ1pucEMsT0FDQ2tNO09BQU87QUFDUEMsUUFBUTtBQUNSK3pCLFNBQVM7O0dBRVYsQ0FBQyxTQUNBajdCO09BQ0Npa0M7VUFBVSxDQUFDO0FBQ1hDLFdBQVc7QUFDWGhaLEdBQUc7O0lBR0wsQ0FBQyxTQUNBbHJCO09BQ0Npa0M7VUFBVSxDQUFDO0FBQ1hDLFdBQVc7QUFDWGhaLEdBQUciLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaGVscGVycyA9IGltcG9ydCAnLi9oZWxwZXJzJ1xuRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbklTID0gaW1wb3J0ICcuL2NoZWNrcydcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xucmVnaXN0ZXJBbmltYXRpb25zID0gaW1wb3J0ICcuL2FuaW1hdGlvbnMnXG5SRVFVSVJFRF9GSUVMRF9NRVRIT0RTID0gaW1wb3J0ICcuL2NvbnN0YW50cy9yZXFGaWVsZE1ldGhvZHMnXG5pbXBvcnQgJy4vY29uc29sZVBhdGNoJ1xuXG5cbm5ld0J1aWxkZXIgPSAoc2V0dGluZ092ZXJyaWRlcywgdGVtcGxhdGVPdmVycmlkZXMpLT5cblx0YnVpbGRlciA9IChzZXR0aW5ncyktPlxuXHRcdHNldHRpbmdzID0gZXh0ZW5kLmNsb25lKGFyZ3VtZW50cy4uLikgaWYgYXJndW1lbnRzLmxlbmd0aCA+IDFcblx0XHRzZXR0aW5ncyA9IHt9IHVubGVzcyBJUy5vYmplY3Qoc2V0dGluZ3MpXG5cdFx0c2V0dGluZ3MudHlwZSA/PSAndGV4dCdcblxuXG5cdFx0aWYgbm90IEZpZWxkW3NldHRpbmdzLnR5cGVdXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJRdWlja0ZpZWxkOiAnI3tzZXR0aW5ncy50eXBlfScgaXMgbm90IGEgdmFsaWQvcmVnaXN0ZXJlZCBmaWVsZCB0eXBlXCJcblxuXHRcdHJlZ2lzdGVyQW5pbWF0aW9ucygpXG5cdFx0bmV3IEZpZWxkW3NldHRpbmdzLnR5cGVdKHNldHRpbmdzLCBidWlsZGVyLCBzZXR0aW5nT3ZlcnJpZGVzLCB0ZW1wbGF0ZU92ZXJyaWRlcylcblxuXG5cdGJ1aWxkZXIucmVnaXN0ZXIgPSAodHlwZSwgdGFyZ2V0RmllbGQpLT5cblx0XHRpZiBub3QgSVMuc3RyaW5nKHR5cGUpIG9yIG5vdCBJUy5mdW5jdGlvbih0YXJnZXRGaWVsZClcblx0XHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrRmllbGQgUmVnaXN0cmF0aW9uOiBpbnZhbGlkIGFyZ3VtZW50c1wiXG5cdFx0Zm9yIHJlcXVpcmVkTWV0aG9kIGluIFJFUVVJUkVEX0ZJRUxEX01FVEhPRFNcblx0XHRcdGlmIG5vdCB0YXJnZXRGaWVsZDo6W3JlcXVpcmVkTWV0aG9kXVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJRdWlja0ZpZWxkIFJlZ2lzdHJhdGlvbjogJyN7cmVxdWlyZWRNZXRob2R9JyBtZXRob2QgaXMgcmVxdWlyZWQgaW4gb3JkZXIgdG8gcmVnaXN0ZXIgdGhlIGZpZWxkXCJcblxuXHRcdEZpZWxkW3R5cGVdID0gdGFyZ2V0RmllbGRcblx0XHRyZXR1cm4gQFxuXG5cblx0YnVpbGRlci5jb25maWcgPSAobmV3U2V0dGluZ3MsIG5ld1RlbXBsYXRlcyktPlxuXHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrRmllbGQgQ29uZmlnOiBpbnZhbGlkIGNvbmZpZyBvYmplY3QgcHJvdmlkZWQgI3tTdHJpbmcgbmV3U2V0dGluZ3N9XCIgaWYgbm90IElTLm9iamVjdChuZXdTZXR0aW5ncylcblx0XHRvdXRwdXRTZXR0aW5ncyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRcblx0XHRmb3IgdHlwZSxjb25maWcgb2YgbmV3U2V0dGluZ3Ncblx0XHRcdGlmIHR5cGUgaXMgJ2dsb2JhbCdcblx0XHRcdFx0b3V0cHV0U2V0dGluZ3MuZ2xvYmFsRGVmYXVsdHMgPSBleHRlbmQuZGVlcC5ub3REZWVwKEZpZWxkLnNoYWxsb3dTZXR0aW5ncykuY2xvbmUoRmllbGQ6Omdsb2JhbERlZmF1bHRzLCBjb25maWcpXG5cdFx0XHRlbHNlIGlmIEZpZWxkW3R5cGVdXG5cdFx0XHRcdG91dHB1dFNldHRpbmdzW3R5cGVdID0gZXh0ZW5kLmNsb25lLmRlZXAubm90RGVlcChGaWVsZC5zaGFsbG93U2V0dGluZ3MpKEZpZWxkW3R5cGVdOjpkZWZhdWx0cywgY29uZmlnKVxuXG5cdFx0aWYgSVMub2JqZWN0KG5ld1RlbXBsYXRlcylcblx0XHRcdG91dHB1dFRlbXBsYXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRcdGdsb2JhbENvbmZpZyA9IG5ld1RlbXBsYXRlcy5nbG9iYWxcblx0XHRcdGlmIGdsb2JhbENvbmZpZyBhbmQgZ2xvYmFsQ29uZmlnLmZpZWxkIGFuZCBub3QgZ2xvYmFsQ29uZmlnLmRlZmF1bHRcblx0XHRcdFx0Z2xvYmFsQ29uZmlnLmRlZmF1bHQgPSBnbG9iYWxDb25maWcuZmllbGRcblx0XHRcdFxuXHRcdFx0Zm9yIHR5cGUgb2YgRmllbGRcblx0XHRcdFx0b3JpZ2luYWxUZW1wbGF0ZXMgPSBGaWVsZFt0eXBlXTo6Py50ZW1wbGF0ZXNcblx0XHRcdFx0dGVtcGxhdGVzID0gbmV3VGVtcGxhdGVzW3R5cGVdIG9yIGdsb2JhbENvbmZpZ1xuXHRcdFx0XHRpZiBub3Qgb3JpZ2luYWxUZW1wbGF0ZXNcblx0XHRcdFx0XHRjb250aW51ZVxuXHRcdFx0XHRpZiBub3QgdGVtcGxhdGVzXG5cdFx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW3R5cGVdID0gb3JpZ2luYWxUZW1wbGF0ZXNcblx0XHRcdFx0XHRjb250aW51ZVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgdGVtcGxhdGVzLmZpZWxkIGFuZCBub3QgdGVtcGxhdGVzLmRlZmF1bHRcblx0XHRcdFx0XHR0ZW1wbGF0ZXMuZGVmYXVsdCA9IHRlbXBsYXRlcy5maWVsZFxuXG5cdFx0XHRcdG91dHB1dFRlbXBsYXRlc1t0eXBlXSA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRcdFx0XG5cdFx0XHRcdGZvciBuYW1lLGNvbmZpZyBvZiB0ZW1wbGF0ZXNcblx0XHRcdFx0XHRjb250aW51ZSBpZiBuYW1lIGlzICdmaWVsZCcgb3Igbm90IG9yaWdpbmFsVGVtcGxhdGVzW25hbWVdXG5cdFx0XHRcdFx0Y29uZmlnID0gZXh0ZW5kLmNsb25lLmRlZXAuY29uY2F0KGdsb2JhbENvbmZpZ1tuYW1lXSwgY29uZmlnKSBpZiBnbG9iYWxDb25maWcgYW5kIGdsb2JhbENvbmZpZ1tuYW1lXVxuXHRcdFx0XHRcdG91dHB1dFRlbXBsYXRlc1t0eXBlXVtuYW1lXSA9IG9yaWdpbmFsVGVtcGxhdGVzW25hbWVdLmV4dGVuZChjb25maWcpXG5cblx0XHRcdFx0Zm9yIG5hbWUsY29uZmlnIG9mIG9yaWdpbmFsVGVtcGxhdGVzIHdoZW4gbm90IG91dHB1dFRlbXBsYXRlc1t0eXBlXVtuYW1lXVxuXHRcdFx0XHRcdG91dHB1dFRlbXBsYXRlc1t0eXBlXVtuYW1lXSA9IGNvbmZpZ1xuXG5cdFx0cmV0dXJuIG5ld0J1aWxkZXIob3V0cHV0U2V0dGluZ3MsIG91dHB1dFRlbXBsYXRlcylcblxuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5IGJ1aWxkZXIsICdmaWVsZHMnLCBnZXQ6ICgpLT5cblx0XHRleHRlbmQuY2xvbmUub3duLm5vdEtleXMoJ2luc3RhbmNlcycpKEZpZWxkKVxuXG5cdGJ1aWxkZXIuc2V0dGluZ092ZXJyaWRlcyA9IHNldHRpbmdPdmVycmlkZXNcblx0YnVpbGRlci50ZW1wbGF0ZU92ZXJyaWRlcyA9IHRlbXBsYXRlT3ZlcnJpZGVzXG5cdGJ1aWxkZXIudmVyc2lvbiA9IGltcG9ydCAnLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbidcblx0YnVpbGRlci5GaWVsZCA9IEZpZWxkID0gaW1wb3J0ICcuL2ZpZWxkJ1xuXHRyZXR1cm4gYnVpbGRlclxuXG5cblxuXG5cblxuUXVpY2tGaWVsZCA9IG5ld0J1aWxkZXIoKVxuUXVpY2tGaWVsZC5yZWdpc3RlciAndGV4dCcsIGltcG9ydCAnLi9maWVsZC90ZXh0J1xuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICd0ZXh0YXJlYScsIGltcG9ydCAnLi9maWVsZC90ZXh0YXJlYSdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnbnVtYmVyJywgaW1wb3J0ICcuL2ZpZWxkL251bWJlcidcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnc2VsZWN0JywgaW1wb3J0ICcuL2ZpZWxkL3NlbGVjdCdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnY2hvaWNlJywgaW1wb3J0ICcuL2ZpZWxkL2Nob2ljZSdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAndHJ1ZWZhbHNlJywgaW1wb3J0ICcuL2ZpZWxkL3RydWVmYWxzZSdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAndG9nZ2xlJywgaW1wb3J0ICcuL2ZpZWxkL3RvZ2dsZSdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnZ3JvdXAnLCBpbXBvcnQgJy4vZmllbGQvZ3JvdXAnXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ3JlcGVhdGVyJywgaW1wb3J0ICcuL2ZpZWxkL3JlcGVhdGVyJ1xuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdmaWxlJywgaW1wb3J0ICcuL2ZpZWxkL2ZpbGUnXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrRmllbGQiLCIjIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5AY29uc29sZSA/PSB7fVxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuY29uc29sZS5sb2cgPz0gKCktPlxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuY29uc29sZS53YXJuID89IGNvbnNvbGUubG9nIiwie1xuICBcIm5hbWVcIjogXCJxdWlja2ZpZWxkXCIsXG4gIFwidmVyc2lvblwiOiBcIjEuMC44NlwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiRmFzdCAmIGxpZ2h0IGZvcm0gZmllbGRzIG1hbmFnZW1lbnQgc3VwcG9ydGluZyByZWFsLXRpbWUgYmluZGluZ3MsIGN1c3RvbSBzdHlsaW5nLCBjdXN0b20gZmllbGRzLCBJRTkrLCBhbmQgbW9yZS4uLlwiLFxuICBcIm1haW5cIjogXCJkaXN0L3F1aWNrZmllbGQuanNcIixcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3F1aWNrZmllbGQuZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9xdWlja2ZpZWxkLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZFwiOiBcInNyYy9maWVsZC9pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdGV4dFwiOiBcInNyYy9maWVsZC90ZXh0L19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdGV4dGFyZWFcIjogXCJzcmMvZmllbGQvdGV4dGFyZWEvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9udW1iZXJcIjogXCJzcmMvZmllbGQvbnVtYmVyL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvc2VsZWN0XCI6IFwic3JjL2ZpZWxkL3NlbGVjdC9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL2Nob2ljZVwiOiBcInNyYy9maWVsZC9jaG9pY2UvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC90cnVlZmFsc2VcIjogXCJzcmMvZmllbGQvdHJ1ZWZhbHNlL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdG9nZ2xlXCI6IFwic3JjL2ZpZWxkL3RvZ2dsZS9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL2dyb3VwXCI6IFwic3JjL2ZpZWxkL2dyb3VwL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvcmVwZWF0ZXJcIjogXCJzcmMvZmllbGQvcmVwZWF0ZXIvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9maWxlXCI6IFwic3JjL2ZpZWxkL2ZpbGUvX2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiZmlsZXNcIjogW1xuICAgIFwic3JjXCIsXG4gICAgXCJkaXN0XCJcbiAgXSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgW1xuICAgICAgICBcImJhYmVsaWZ5XCIsXG4gICAgICAgIHtcbiAgICAgICAgICBcInByZXNldHNcIjogW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBcIkBiYWJlbC9wcmVzZXQtZW52XCIsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm1vZHVsZXNcIjogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwiZmFsc2UgJiYgbnBtIHJ1biB0ZXN0OnRyYXZpcyB8fCB0cnVlXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJ3YXRjaFwiOiBcImNha2UgLWQgd2F0Y2hcIixcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDp0cmF2aXNcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcInRlc3Q6bG9jYWxcIjogXCJvcGVuIHRlc3QvdGVzdHJ1bm5lci5odG1sXCIsXG4gICAgXCJ0ZXN0Om1pbmlmaWVkXCI6IFwibWluaWZpZWQ9MSBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpicm93c2VyXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEVsZWN0cm9uIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6Y2hyb21lXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBDaHJvbWUgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpmaXJlZm94XCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEZpcmVmb3ggLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2ZpZWxkLmdpdFwiXG4gIH0sXG4gIFwiYXV0aG9yXCI6IFwiZGFuaWVsa2FsZW5cIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tmaWVsZC9pc3N1ZXNcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZmllbGQjcmVhZG1lXCIsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBkYW5pZWxrYWxlbi9pc1wiOiBcIl4yLjAuMFwiLFxuICAgIFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRcIjogXCJeMS4xNS44XCIsXG4gICAgXCJmYXN0ZG9tXCI6IFwiXjEuMC42XCIsXG4gICAgXCJsZXZlblwiOiBcIl4yLjAuMFwiLFxuICAgIFwibW92ZS1qc1wiOiBcIl4wLjUuMFwiLFxuICAgIFwicXVpY2tjc3NcIjogXCJeMS40LjFcIixcbiAgICBcInF1aWNrZG9tXCI6IFwiXjEuMC44OVwiLFxuICAgIFwic21hcnQtZXh0ZW5kXCI6IFwiXjEuNy4zXCIsXG4gICAgXCJ0ZXh0LW1hc2stYWRkb25zXCI6IFwiXjMuNi4wXCIsXG4gICAgXCJ0ZXh0LW1hc2stY29yZVwiOiBcIl41LjAuMVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBiYWJlbC9jb3JlXCI6IFwiXjcuMS42XCIsXG4gICAgXCJAYmFiZWwvcHJlc2V0LWVudlwiOiBcIl43LjEuNlwiLFxuICAgIFwiYmFiZWxpZnlcIjogXCJeMTAuMC4wXCIsXG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY2hhbGtcIjogXCJeMi4wLjFcIixcbiAgICBcImNvZmZlZS1zY3JpcHRcIjogXCJeMS4xMi42XCIsXG4gICAgXCJjb2ZmZWVpZnktY2FjaGVkXCI6IFwiXjMuMC4wXCIsXG4gICAgXCJmcy1qZXRwYWNrXCI6IFwiXjIuMi4wXCIsXG4gICAgXCJrZXlzaW1cIjogXCJnaXRodWI6ZGFuaWVsa2FsZW4va2V5c2ltLmpzXCIsXG4gICAgXCJwYWNrYWdlLWluc3RhbGxcIjogXCJeMS4yLjZcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuOVwiLFxuICAgIFwic2ltcGx5d2F0Y2hcIjogXCJeMy4wLjBcIlxuICB9XG59XG4iLCJJUyA9IGltcG9ydCAnLi9jaGVja3MnXG5ET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5yZWdleCA9IGltcG9ydCAnLi9jb25zdGFudHMvcmVnZXgnXG5cbmhlbHBlcnMgPSBleHBvcnRzXG5oZWxwZXJzLm5vb3AgPSAoKS0+XG5cbmhlbHBlcnMuaW5jbHVkZXMgPSAodGFyZ2V0LCBpdGVtKS0+XG5cdHRhcmdldCBhbmQgdGFyZ2V0LmluZGV4T2YoaXRlbSkgaXNudCAtMVxuXG5oZWxwZXJzLnJlcGVhdCA9IChzdHJpbmcsIGNvdW50KS0+XG5cdChzdHJpbmcgZm9yIGkgaW4gWzEuLmNvdW50XSkuam9pbignJylcblxuaGVscGVycy5yZW1vdmVJdGVtID0gKHRhcmdldCwgaXRlbSktPlxuXHRpdGVtSW5kZXggPSB0YXJnZXQuaW5kZXhPZihpdGVtKVxuXHR0YXJnZXQuc3BsaWNlKGl0ZW1JbmRleCwgMSkgaWYgaXRlbUluZGV4IGlzbnQgLTFcblxuaGVscGVycy5pbnNlcnRBZnRlciA9ICh0YXJnZXQsIGl0ZW0sIG5ld0l0ZW0pLT5cblx0aXRlbUluZGV4ID0gdGFyZ2V0LmluZGV4T2YoaXRlbSlcblx0dGFyZ2V0LnNwbGljZShpdGVtSW5kZXgsIDAsIG5ld0l0ZW0pIGlmIGl0ZW1JbmRleCBpc250IC0xXG5cbmhlbHBlcnMuZmluZCA9ICh0YXJnZXQsIGZuKS0+XG5cdHJlc3VsdHMgPSB0YXJnZXQuZmlsdGVyKGZuKVxuXHRyZXN1bHRzWzBdXG5cbmhlbHBlcnMuZGlmZiA9IChzb3VyY2UsIGNvbXBhcmVlKS0+XG5cdHJlc3VsdCA9IFtdXG5cdG1heExlbiA9IE1hdGgubWF4KHNvdXJjZS5sZW5ndGgsIGNvbXBhcmVlLmxlbmd0aClcblx0aSA9IC0xXG5cdFxuXHR3aGlsZSArK2kgPCBtYXhMZW5cblx0XHRzb3VyY2VWYWwgPSBzb3VyY2VbaV1cblx0XHRjb21wYXJlZVZhbCA9IGNvbXBhcmVlW2ldXG5cblx0XHRpZiBzb3VyY2VWYWwgaXNudCBjb21wYXJlZVZhbFxuXHRcdFx0cmVzdWx0LnB1c2goc291cmNlVmFsKSBpZiBJUy5kZWZpbmVkKHNvdXJjZVZhbCkgYW5kIG5vdCBoZWxwZXJzLmluY2x1ZGVzKGNvbXBhcmVlLCBzb3VyY2VWYWwpXG5cdFx0XHRyZXN1bHQucHVzaChjb21wYXJlZVZhbCkgaWYgSVMuZGVmaW5lZChjb21wYXJlZVZhbCkgYW5kIG5vdCBoZWxwZXJzLmluY2x1ZGVzKHNvdXJjZSwgY29tcGFyZWVWYWwpXG5cblx0cmV0dXJuIHJlc3VsdFxuXG5cbmhlbHBlcnMuaGV4VG9SR0JBID0gKGhleCwgYWxwaGEpLT5cblx0aGV4ID0gaGV4LnNsaWNlKDEpIGlmIGhleFswXSBpcyAnIydcblx0UiA9IHBhcnNlSW50IGhleC5zbGljZSgwLDIpLCAxNlxuXHRHID0gcGFyc2VJbnQgaGV4LnNsaWNlKDIsNCksIDE2XG5cdEIgPSBwYXJzZUludCBoZXguc2xpY2UoNCw2KSwgMTZcblx0cmV0dXJuIFwicmdiYSgje1J9LCAje0d9LCAje0J9LCAje2FscGhhfSlcIlxuXG5cbmhlbHBlcnMuZGVmYXVsdENvbG9yID0gKGNvbG9yLCBkZWZhdWx0Q29sb3IpLT5cblx0aWYgY29sb3IgaXMgJ3RyYW5zcGFyZW50JyBvciBub3QgY29sb3Jcblx0XHRyZXR1cm4gZGVmYXVsdENvbG9yXG5cdGVsc2Vcblx0XHRyZXR1cm4gY29sb3JcblxuXG5oZWxwZXJzLmNhbGNQYWRkaW5nID0gKGRlc2lyZWRIZWlnaHQsIGZvbnRTaXplKS0+XG5cdE1hdGguY2VpbCAoZGVzaXJlZEhlaWdodCAtIGZvbnRTaXplKjEuMjMxKS8yXG5cblxuaGVscGVycy51bmxvY2tTY3JvbGwgPSAoZXhjbHVkZWRFbCktPlxuXHR3aW5kb3cuX2lzTG9ja2VkID0gZmFsc2Vcblx0RE9NKHdpbmRvdykub2ZmICd3aGVlbC5sb2NrJ1xuXG5cbmhlbHBlcnMubG9ja1Njcm9sbCA9IChleGNsdWRlZEVsKS0+IHVubGVzcyB3aW5kb3cuX2lzTG9ja2VkXG5cdHdpbmRvdy5faXNMb2NrZWQgPSB0cnVlXG5cdERPTSh3aW5kb3cpLm9uICd3aGVlbC5sb2NrJywgKGV2ZW50KS0+XG5cdFx0aWYgZXZlbnQudGFyZ2V0IGlzIGV4Y2x1ZGVkRWwucmF3IG9yIERPTShldmVudC50YXJnZXQpLnBhcmVudE1hdGNoaW5nKChwYXJlbnQpLT4gcGFyZW50IGlzIGV4Y2x1ZGVkRWwpXG5cdFx0XHRpZiBldmVudC53aGVlbERlbHRhID4gMCBhbmQgZXhjbHVkZWRFbC5yYXcuc2Nyb2xsVG9wIGlzIDBcblx0XHRcdFx0cmV0dXJuIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuXHRcdFx0aWYgZXZlbnQud2hlZWxEZWx0YSA8IDAgYW5kIGV4Y2x1ZGVkRWwucmF3LnNjcm9sbEhlaWdodCAtIGV4Y2x1ZGVkRWwucmF3LnNjcm9sbFRvcCBpcyBleGNsdWRlZEVsLnJhdy5jbGllbnRIZWlnaHRcblx0XHRcdFx0cmV0dXJuIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuXHRcdGVsc2Vcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuXG5oZWxwZXJzLmZ1enp5TWF0Y2ggPSAobmVlZGxlLCBoYXlzdGFjaywgY2FzZVNlbnNpdGl2ZSktPlxuXHRuTGVuZ3RoID0gbmVlZGxlLmxlbmd0aFxuXHRoTGVuZ3RoID0gaGF5c3RhY2subGVuZ3RoXG5cdHVubGVzcyBjYXNlU2Vuc2l0aXZlXG5cdFx0bmVlZGxlID0gbmVlZGxlLnRvVXBwZXJDYXNlKClcblx0XHRoYXlzdGFjayA9IGhheXN0YWNrLnRvVXBwZXJDYXNlKClcblxuXHRpZiBuTGVuZ3RoID4gaExlbmd0aFxuXHRcdHJldHVybiBmYWxzZVxuXHRpZiBuTGVuZ3RoIGlzIGhMZW5ndGhcblx0XHRyZXR1cm4gbmVlZGxlIGlzIGhheXN0YWNrXG5cblx0bkkgPSBoSSA9IG1hdGNoZWRDb3VudCA9MFxuXHR3aGlsZSBuSSA8IG5MZW5ndGhcblx0XHRuZWVkbGVDaGFyID0gbmVlZGxlW25JKytdXG5cdFx0XG5cdFx0d2hpbGUgaEkgPCBoTGVuZ3RoXG5cdFx0XHRpZiBoYXlzdGFja1toSSsrXSBpcyBuZWVkbGVDaGFyXG5cdFx0XHRcdG1hdGNoZWRDb3VudCsrXG5cdFx0XHRcdGJyZWFrXG5cblx0cmV0dXJuIG1hdGNoZWRDb3VudCBpcyBuTGVuZ3RoXG5cblxuaGVscGVycy5zdGFydHNXaXRoID0gKG5lZWRsZSwgaGF5c3RhY2ssIGNhc2VTZW5zaXRpdmUpLT5cblx0dW5sZXNzIGNhc2VTZW5zaXRpdmVcblx0XHRuZWVkbGUgPSBuZWVkbGUudG9VcHBlckNhc2UoKVxuXHRcdGhheXN0YWNrID0gaGF5c3RhY2sudG9VcHBlckNhc2UoKVxuXG5cdGlmIG5lZWRsZS5sZW5ndGggPiBoYXlzdGFjay5sZW5ndGhcblx0XHRyZXR1cm4gZmFsc2Vcblx0aWYgbmVlZGxlLmxlbmd0aCBpcyBoYXlzdGFjay5sZW5ndGhcblx0XHRyZXR1cm4gbmVlZGxlIGlzIGhheXN0YWNrXG5cblx0aSA9IC0xXG5cdHdoaWxlIG5lZWRsZVsrK2ldXG5cdFx0cmV0dXJuIGZhbHNlIGlmIG5lZWRsZVtpXSBpc250IGhheXN0YWNrW2ldXG5cdHJldHVybiB0cnVlXG5cblxuaGVscGVycy5nZXRJbmRleE9mRmlyc3REaWZmID0gKHNvdXJjZVN0cmluZywgY29tcGFyZVN0cmluZyktPlxuXHRjdXJyZW50UG9zID0gMFxuXHRtYXhMZW5ndGggPSBNYXRoLm1heChzb3VyY2VTdHJpbmcubGVuZ3RoLCBjb21wYXJlU3RyaW5nLmxlbmd0aClcblx0XG5cdHdoaWxlIGN1cnJlbnRQb3MgPCBtYXhMZW5ndGhcblx0XHRyZXR1cm4gY3VycmVudFBvcyBpZiBzb3VyY2VTdHJpbmdbY3VycmVudFBvc10gaXNudCBjb21wYXJlU3RyaW5nW2N1cnJlbnRQb3NdXG5cdFx0Y3VycmVudFBvcysrXG5cdFxuXHRyZXR1cm4gbnVsbFxuXG5cblxuaGVscGVycy5wYXJzZUNzc1Nob3J0aGFuZFZhbHVlID0gKHN0cmluZyktPlxuXHR2YWx1ZXMgPSBzdHJpbmcuc3BsaXQocmVnZXgud2hpdGVTcGFjZSkubWFwKHBhcnNlRmxvYXQpXG5cdHJlc3VsdCA9IHt9XG5cdHN3aXRjaCB2YWx1ZXMubGVuZ3RoXG5cdFx0d2hlbiAxXG5cdFx0XHRyZXN1bHQudG9wID0gcmVzdWx0LnJpZ2h0ID0gcmVzdWx0LmJvdHRvbSA9IHJlc3VsdC5sZWZ0ID0gdmFsdWVzWzBdXG5cdFx0d2hlbiAyXG5cdFx0XHRyZXN1bHQudG9wID0gcmVzdWx0LmJvdHRvbSA9IHZhbHVlc1swXVxuXHRcdFx0cmVzdWx0LnJpZ2h0ID0gcmVzdWx0LmxlZnQgPSB2YWx1ZXNbMV1cblx0XHR3aGVuIDNcblx0XHRcdHJlc3VsdC50b3AgPSB2YWx1ZXNbMF1cblx0XHRcdHJlc3VsdC5yaWdodCA9IHJlc3VsdC5sZWZ0ID0gdmFsdWVzWzFdXG5cdFx0XHRyZXN1bHQuYm90dG9tID0gdmFsdWVzWzJdXG5cdFx0d2hlbiA0XG5cdFx0XHRyZXN1bHQudG9wID0gdmFsdWVzWzBdXG5cdFx0XHRyZXN1bHQucmlnaHQgPSB2YWx1ZXNbMV1cblx0XHRcdHJlc3VsdC5ib3R0b20gPSB2YWx1ZXNbMl1cblx0XHRcdHJlc3VsdC5sZWZ0ID0gdmFsdWVzWzNdXG5cblx0cmV0dXJuIHJlc3VsdFxuXG5cbmhlbHBlcnMuc2hvcnRoYW5kU2lkZVZhbHVlID0gKHZhbHVlLCBzaWRlKS0+XG5cdHN3aXRjaCB0eXBlb2YgdmFsdWVcblx0XHR3aGVuICdudW1iZXInIHRoZW4gdmFsdWVcblx0XHR3aGVuICdzdHJpbmcnXG5cdFx0XHR2YWx1ZXMgPSBoZWxwZXJzLnBhcnNlQ3NzU2hvcnRoYW5kVmFsdWUodmFsdWUpXG5cdFx0XHR2YWx1ZXNbc2lkZV1cblx0XHRlbHNlIDBcblxuXG5oZWxwZXJzLnVwZGF0ZVNob3J0aGFuZFZhbHVlID0gKHZhbHVlLCBzaWRlLCBuZXdWYWx1ZSktPlxuXHR2YWx1ZXMgPSBoZWxwZXJzLnBhcnNlQ3NzU2hvcnRoYW5kVmFsdWUoJycrKHZhbHVlIG9yIDApKVxuXHRzd2l0Y2ggc2lkZVxuXHRcdHdoZW4gJ3RvcCcgdGhlbiB2YWx1ZXMudG9wICs9IG5ld1ZhbHVlXG5cdFx0d2hlbiAncmlnaHQnIHRoZW4gdmFsdWVzLnJpZ2h0ICs9IG5ld1ZhbHVlXG5cdFx0d2hlbiAnYm90dG9tJyB0aGVuIHZhbHVlcy5ib3R0b20gKz0gbmV3VmFsdWVcblx0XHR3aGVuICdsZWZ0JyB0aGVuIHZhbHVlcy5sZWZ0ICs9IG5ld1ZhbHVlXG5cdFx0ZWxzZSBPYmplY3Qua2V5cyh2YWx1ZXMpLmZvckVhY2ggKHNpZGUpLT4gdmFsdWVzW3NpZGVdICs9IG5ld1ZhbHVlXG5cdFxuXHRcIiN7dmFsdWVzLnRvcH1weCAje3ZhbHVlcy5yaWdodH1weCAje3ZhbHVlcy5ib3R0b219cHggI3t2YWx1ZXMubGVmdH1weFwiXG5cblxuaGVscGVycy5pbmhlcml0UHJvdG8gPSAoY2hpbGQsIHBhcmVudCwga2V5cyktPlxuXHRmb3Iga2V5IGluIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHBhcmVudDo6KVxuXHRcdGNvbnRpbnVlIGlmIGtleXMgYW5kIG5vdCBrZXlzLmluY2x1ZGVzKGtleSlcblx0XHR1bmxlc3MgY2hpbGQ6OltrZXldXG5cdFx0XHRjaGlsZDo6W2tleV0gPSBwYXJlbnQ6OltrZXldXG5cblx0cmV0dXJuIGNoaWxkXG5cblxuXG5cblxuXG5cblxuIiwiIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuaW1wb3J0ICogYXMgQ1NTIGZyb20gJ3F1aWNrY3NzJ1xuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuaW1wb3J0ICogYXMgZXh0ZW5kIGZyb20gJ3NtYXJ0LWV4dGVuZCdcbmltcG9ydCAnLi9wYXJ0cy9hbGxvd2VkT3B0aW9ucydcbmltcG9ydCAnLi9wYXJ0cy9oZWxwZXJzJ1xuaW1wb3J0ICcuL3BhcnRzL2NoZWNrcydcbmltcG9ydCAnLi9wYXJ0cy9lbGVtZW50J1xuaW1wb3J0ICcuL3BhcnRzL3dpbmRvdydcbmltcG9ydCAnLi9wYXJ0cy9tZWRpYVF1ZXJ5J1xuXG5RdWlja0RvbSA9ICgpLT5cblx0YXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKVxuXHRhcmdzW2ldID0gYXJnIGZvciBhcmcsaSBpbiBhcmd1bWVudHNcblx0cHJldkNvdW50ID0gUXVpY2tFbGVtZW50LmNvdW50XG5cdGVsZW1lbnQgPSBRdWlja0RvbS5jcmVhdGUoYXJncylcblx0ZWxlbWVudC5fcG9zdENyZWF0aW9uKCkgaWYgZWxlbWVudCBhbmQgZWxlbWVudC5fcG9zdENyZWF0aW9uIGFuZCBRdWlja0VsZW1lbnQuY291bnQgaXNudCBwcmV2Q291bnRcblx0cmV0dXJuIGVsZW1lbnRcblxuUXVpY2tEb20uY3JlYXRlID0gKGFyZ3MpLT4gc3dpdGNoXG5cdHdoZW4gSVMuYXJyYXkoYXJnc1swXSlcblx0XHRyZXR1cm4gUXVpY2tEb20oYXJnc1swXS4uLilcblx0XG5cdHdoZW4gSVMudGVtcGxhdGUoYXJnc1swXSlcblx0XHRyZXR1cm4gYXJnc1swXS5zcGF3bigpXG5cdFxuXHR3aGVuIElTLnF1aWNrRG9tRWwoYXJnc1swXSlcblx0XHRyZXR1cm4gaWYgYXJnc1sxXSB0aGVuIGFyZ3NbMF0udXBkYXRlT3B0aW9ucyhhcmdzWzFdKSBlbHNlIGFyZ3NbMF1cblx0XG5cdHdoZW4gSVMuZG9tTm9kZShhcmdzWzBdKSBvciBJUy5kb21Eb2MoYXJnc1swXSlcblx0XHRpZiBhcmdzWzBdLl9xdWlja0VsZW1lbnRcblx0XHRcdHJldHVybiBhcmdzWzBdLl9xdWlja0VsZW1lbnRcblx0XHRcblx0XHR0eXBlID0gYXJnc1swXS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyMnLCAnJylcblx0XHRvcHRpb25zID0gYXJnc1sxXSBvciB7fVxuXHRcdG9wdGlvbnMuZXhpc3RpbmcgPSBhcmdzWzBdXG5cdFx0cmV0dXJuIG5ldyBRdWlja0VsZW1lbnQodHlwZSwgb3B0aW9ucylcblxuXHR3aGVuIGFyZ3NbMF0gaXMgd2luZG93XG5cdFx0cmV0dXJuIFF1aWNrV2luZG93XG5cblx0d2hlbiBJUy5zdHJpbmcoYXJnc1swXSlcdFx0XHRcblx0XHR0eXBlID0gYXJnc1swXS50b0xvd2VyQ2FzZSgpXG5cdFx0aWYgdHlwZSBpcyAndGV4dCdcblx0XHRcdG9wdGlvbnMgPSBpZiBJUy5vYmplY3QoYXJnc1sxXSkgdGhlbiBhcmdzWzFdIGVsc2Uge3RleHQ6YXJnc1sxXSBvciAnJ31cblx0XHRlbHNlXG5cdFx0XHRvcHRpb25zID0gaWYgSVMub2JqZWN0KGFyZ3NbMV0pIHRoZW4gYXJnc1sxXSBlbHNlIHt9XG5cdFx0XG5cdFx0ZWxlbWVudCA9IG5ldyBRdWlja0VsZW1lbnQodHlwZSwgb3B0aW9ucylcblx0XHRpZiBhcmdzLmxlbmd0aCA+IDJcblx0XHRcdGNoaWxkcmVuID0gbmV3IEFycmF5KGFyZ3NMZW5ndGggPSBhcmdzLmxlbmd0aCk7IGkgPSAxO1xuXHRcdFx0Y2hpbGRyZW5baSsxXSA9IGFyZ3NbaV0gd2hpbGUgKytpIDwgYXJnc0xlbmd0aFxuXG5cdFx0XHRmb3IgY2hpbGQgaW4gY2hpbGRyZW5cblx0XHRcdFx0Y2hpbGQgPSBRdWlja0RvbS50ZXh0KGNoaWxkKSBpZiBJUy5zdHJpbmcoY2hpbGQpXG5cdFx0XHRcdGNoaWxkID0gUXVpY2tEb20oY2hpbGQuLi4pIGlmIElTLmFycmF5KGNoaWxkKVxuXHRcdFx0XHRlbGVtZW50LmFwcGVuZChjaGlsZCkgaWYgSVMucXVpY2tEb21FbChjaGlsZClcblxuXHRcdHJldHVybiBlbGVtZW50XG5cblx0d2hlbiBhcmdzWzBdIGFuZCAoSVMuZG9tTm9kZShhcmdzWzBdWzBdKSBvciBJUy5kb21Eb2MoYXJnc1swXVswXSkpXG5cdFx0cmV0dXJuIFF1aWNrRG9tKGFyZ3NbMF1bMF0pXG5cblxuUXVpY2tEb20udGVtcGxhdGUgPSAodHJlZSktPlxuXHRuZXcgUXVpY2tUZW1wbGF0ZSh0cmVlLCB0cnVlKVxuXG5cblF1aWNrRG9tLmh0bWwgPSAoaW5uZXJIVE1MKS0+XG5cdGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdGNvbnRhaW5lci5pbm5lckhUTUwgPSBpbm5lckhUTUxcblx0Y2hpbGRyZW4gPSBBcnJheTo6c2xpY2UuY2FsbCBjb250YWluZXIuY2hpbGROb2Rlc1xuXG5cdHJldHVybiBRdWlja0RvbS5iYXRjaChjaGlsZHJlbilcblxuUXVpY2tEb20ucXVlcnkgPSAodGFyZ2V0KS0+XG5cdFF1aWNrRG9tKGRvY3VtZW50KS5xdWVyeSh0YXJnZXQpXG5cblF1aWNrRG9tLnF1ZXJ5QWxsID0gKHRhcmdldCktPlxuXHRRdWlja0RvbShkb2N1bWVudCkucXVlcnlBbGwodGFyZ2V0KVxuXG5RdWlja0RvbS5pc1RlbXBsYXRlID0gKHRhcmdldCktPlxuXHRJUy50ZW1wbGF0ZSh0YXJnZXQpXG5cblF1aWNrRG9tLmlzUXVpY2tFbCA9ICh0YXJnZXQpLT5cblx0SVMucXVpY2tEb21FbCh0YXJnZXQpXG5cblF1aWNrRG9tLmlzRWwgPSAodGFyZ2V0KS0+XG5cdElTLmRvbUVsKHRhcmdldClcblxuXG5cblxuaW1wb3J0ICcuL3BhcnRzL2JhdGNoJ1xuaW1wb3J0ICcuL3BhcnRzL3RlbXBsYXRlJ1xuaW1wb3J0ICcuL3BhcnRzL3Nob3J0Y3V0cydcblF1aWNrRG9tLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nXG5RdWlja0RvbS5DU1MgPSBDU1Ncbm1vZHVsZS5leHBvcnRzID0gUXVpY2tEb21cblxuXG5cbiIsImFsbG93ZWRUZW1wbGF0ZU9wdGlvbnMgPSBbICMgVG8gY29weSBmcm9tIERPTSBFbGVtZW50c1xuXHQnaWQnXG5cdCduYW1lJ1xuXHQndHlwZSdcblx0J2hyZWYnXG5cdCdzZWxlY3RlZCdcblx0J2NoZWNrZWQnXG5cdCdjbGFzc05hbWUnXG5dXG5cbmFsbG93ZWRPcHRpb25zID0gWyAjIFVzZWQgaW4gUXVpY2tFbGVtZW50Ojp0b0pTT05cblx0J2lkJ1xuXHQncmVmJ1xuXHQndHlwZSdcblx0J25hbWUnXG5cdCd0ZXh0J1xuXHQnc3R5bGUnXG5cdCdjbGFzcydcblx0J2NsYXNzTmFtZSdcblx0J3VybCdcblx0J2hyZWYnXG5cdCdzZWxlY3RlZCdcblx0J2NoZWNrZWQnXG5cdCdwcm9wcydcblx0J2F0dHJzJ1xuXHQncGFzc1N0YXRlVG9DaGlsZHJlbidcblx0J3N0YXRlVHJpZ2dlcnMnXG5cdCMgJ3JlbGF0ZWRJbnN0YW5jZSdcbl0iLCJoZWxwZXJzID0ge31cblxuaGVscGVycy5pbmNsdWRlcyA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0dGFyZ2V0IGFuZCB0YXJnZXQuaW5kZXhPZihpdGVtKSBpc250IC0xXG5cbmhlbHBlcnMucmVtb3ZlSXRlbSA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0aXRlbUluZGV4ID0gdGFyZ2V0LmluZGV4T2YoaXRlbSlcblx0dGFyZ2V0LnNwbGljZShpdGVtSW5kZXgsIDEpICBpZiBpdGVtSW5kZXggaXNudCAtMVxuXHRyZXR1cm4gdGFyZ2V0XG5cbmhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCA9ICh0YXJnZXRFbCktPiBzd2l0Y2hcblx0d2hlbiBJUy5zdHJpbmcodGFyZ2V0RWwpIHRoZW4gUXVpY2tEb20udGV4dCh0YXJnZXRFbClcblx0d2hlbiBJUy5kb21Ob2RlKHRhcmdldEVsKSB0aGVuIFF1aWNrRG9tKHRhcmdldEVsKVxuXHR3aGVuIElTLnRlbXBsYXRlKHRhcmdldEVsKSB0aGVuIHRhcmdldEVsLnNwYXduKClcblx0ZWxzZSB0YXJnZXRFbFxuXG5cbmhlbHBlcnMuaXNTdGF0ZVN0eWxlID0gKHN0cmluZyktPlxuXHRzdHJpbmdbMF0gaXMgJyQnIG9yIHN0cmluZ1swXSBpcyAnQCdcblxuXG5oZWxwZXJzLnJlZ2lzdGVyU3R5bGUgPSAocnVsZSwgbGV2ZWwsIGltcG9ydGFudCktPlxuXHRsZXZlbCB8fD0gMFxuXHRjYWNoZWQgPSBzdHlsZUNhY2hlLmdldChydWxlLCBsZXZlbClcblx0cmV0dXJuIGNhY2hlZCBpZiBjYWNoZWRcblx0b3V0cHV0ID0ge2NsYXNzTmFtZTpbQ1NTLnJlZ2lzdGVyKHJ1bGUsIGxldmVsLCBpbXBvcnRhbnQpXSwgZm5zOltdLCBydWxlfVxuXHRwcm9wcyA9IE9iamVjdC5rZXlzKHJ1bGUpXG5cdFxuXHRmb3IgcHJvcCBpbiBwcm9wcyB3aGVuIHR5cGVvZiBydWxlW3Byb3BdIGlzICdmdW5jdGlvbidcblx0XHRvdXRwdXQuZm5zLnB1c2ggW3Byb3AsIHJ1bGVbcHJvcF1dXG5cblx0cmV0dXJuIHN0eWxlQ2FjaGUuc2V0KHJ1bGUsIG91dHB1dCwgbGV2ZWwpXG5cblxuc3R5bGVDYWNoZSA9IG5ldyBjbGFzc1xuXHRjb25zdHJ1Y3RvcjogKCktPlxuXHRcdEBrZXlzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdEB2YWx1ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cblx0Z2V0OiAoa2V5LCBsZXZlbCktPiBpZiBAa2V5c1tsZXZlbF1cblx0XHRpbmRleCA9IEBrZXlzW2xldmVsXS5pbmRleE9mKGtleSlcblx0XHRyZXR1cm4gQHZhbHVlc1tsZXZlbF1baW5kZXhdIGlmIGluZGV4IGlzbnQgLTFcblxuXHRzZXQ6IChrZXksIHZhbHVlLCBsZXZlbCktPlxuXHRcdGlmIG5vdCBAa2V5c1tsZXZlbF1cblx0XHRcdEBrZXlzW2xldmVsXSA9IFtdXG5cdFx0XHRAdmFsdWVzW2xldmVsXSA9IFtdXG5cblx0XHRAa2V5c1tsZXZlbF0ucHVzaCBrZXlcblx0XHRAdmFsdWVzW2xldmVsXS5wdXNoIHZhbHVlXG5cdFx0cmV0dXJuIHZhbHVlXG5cbiIsIklTID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vaXMnXG5JUyA9IElTLmNyZWF0ZSgnbmF0aXZlcycsJ2RvbScpXG5JUy5sb2FkXHRcblx0cXVpY2tEb21FbDogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5jb25zdHJ1Y3Rvci5uYW1lIGlzIFF1aWNrRWxlbWVudC5uYW1lXG5cdFxuXHR0ZW1wbGF0ZTogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5jb25zdHJ1Y3Rvci5uYW1lIGlzIFF1aWNrVGVtcGxhdGUubmFtZVxuXHRcblx0IyBiYXRjaDogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5jb25zdHJ1Y3Rvci5uYW1lIGlzICdRdWlja0JhdGNoJ1xuXG4iLCJzdmdOYW1lc3BhY2UgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnXG5cbmNsYXNzIFF1aWNrRWxlbWVudFxuXHRAY291bnQgPSAwXG5cdGNvbnN0cnVjdG9yOiAoQHR5cGUsIEBvcHRpb25zKS0+XG5cdFx0UXVpY2tFbGVtZW50LmNvdW50Kytcblx0XHRAc3ZnID0gdHJ1ZSBpZiBAdHlwZVswXSBpcyAnKidcblx0XHRAZWwgPSBAb3B0aW9ucy5leGlzdGluZyBvclxuXHRcdFx0aWYgQHR5cGUgaXMgJ3RleHQnIHRoZW4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaWYgdHlwZW9mIEBvcHRpb25zLnRleHQgaXMgJ3N0cmluZycgdGhlbiBAb3B0aW9ucy50ZXh0IGVsc2UgJycpXG5cdFx0XHRlbHNlIGlmIEBzdmcgdGhlbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnTmFtZXNwYWNlLCBAdHlwZS5zbGljZSgxKSlcblx0XHRcdGVsc2UgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChAdHlwZSlcblxuXHRcdGlmIEB0eXBlIGlzICd0ZXh0J1xuXHRcdFx0QGFwcGVuZCA9IEBwcmVwZW5kID0gQGF0dHIgPSAoKS0+XG5cdFx0XHQjIEBfdGV4dHMgPSB7fSAjIGRlZmluZWQgY29uZGl0aW9uYWxseVxuXG5cdFx0QF9wYXJlbnQgPSBudWxsXG5cdFx0QF9zdHlsZXMgPSB7fVxuXHRcdEBfc3RhdGUgPSBbXVxuXHRcdEBfY2hpbGRyZW4gPSBbXVxuXHRcdCMgQF9wcm92aWRlZFN0YXRlcyA9IFtdXHRcdFx0XHQjIGRlZmluZWQgY29uZGl0aW9uYWxseVxuXHRcdCMgQF9wcm92aWRlZFN0YXRlc1NoYXJlZCA9IFtdXHRcdCMgZGVmaW5lZCBjb25kaXRpb25hbGx5XG5cdFx0IyBAX2V2ZW50Q2FsbGJhY2tzID0ge19fcmVmczp7fX1cdCMgZGVmaW5lZCBjb25kaXRpb25hbGx5XG5cdFx0XG5cdFx0QF9ub3JtYWxpemVPcHRpb25zKClcblx0XHRAX2FwcGx5T3B0aW9ucygpXG5cdFx0QF9hdHRhY2hTdGF0ZUV2ZW50cygpXG5cdFx0QF9wcm94eVBhcmVudCgpXG5cdFx0QF9yZWZyZXNoUGFyZW50KCkgaWYgQG9wdGlvbnMuZXhpc3Rpbmdcblx0XHRAZWwuX3F1aWNrRWxlbWVudCA9IEBcblxuXG5cdHRvSlNPTjogKCktPlxuXHRcdG91dHB1dCA9IFtAdHlwZSwgZXh0ZW5kLmNsb25lLmtleXMoYWxsb3dlZE9wdGlvbnMpKEBvcHRpb25zKV1cblx0XHRjaGlsZHJlbiA9IEBjaGlsZHJlblxuXHRcdG91dHB1dC5wdXNoKGNoaWxkLnRvSlNPTigpKSBmb3IgY2hpbGQgaW4gY2hpbGRyZW5cblx0XHRyZXR1cm4gb3V0cHV0XG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrRWxlbWVudC5uYW1lID89ICdRdWlja0VsZW1lbnQnXG5cbmltcG9ydCAnLi9hbGlhc2VzJ1xuaW1wb3J0ICcuL3RyYXZlcnNpbmcnXG5pbXBvcnQgJy4vaW5pdCdcbmltcG9ydCAnLi9ldmVudHMnXG5pbXBvcnQgJy4vc3RhdGUnXG5pbXBvcnQgJy4vc3R5bGUnXG5pbXBvcnQgJy4vYXR0cmlidXRlcy1hbmQtcHJvcGVydGllcydcbmltcG9ydCAnLi9tYW5pcHVsYXRpb24nXG5pbXBvcnQgJy4vYXBwbGljYXRpb24nXG4iLCJPYmplY3QuZGVmaW5lUHJvcGVydGllcyBRdWlja0VsZW1lbnQ6Oixcblx0J3Jhdyc6IGdldDogKCktPiBAZWxcblx0JzAnOiBnZXQ6ICgpLT4gQGVsXG5cdCdjc3MnOiBnZXQ6ICgpLT4gQHN0eWxlXG5cdCdyZXBsYWNlV2l0aCc6IGdldDogKCktPiBAcmVwbGFjZVxuXHQncmVtb3ZlTGlzdGVuZXInOiBnZXQ6ICgpLT4gQG9mZlxuXG4iLCJRdWlja0VsZW1lbnQ6OnBhcmVudHNVbnRpbCA9IChmaWx0ZXIpLT5cblx0X2dldFBhcmVudHMoQCwgZmlsdGVyKVxuXG5RdWlja0VsZW1lbnQ6OnBhcmVudE1hdGNoaW5nID0gKGZpbHRlciktPlxuXHRpZiBJUy5mdW5jdGlvbihmaWx0ZXIpIG9yIGlzUmVmPUlTLnN0cmluZyhmaWx0ZXIpXG5cdFx0bmV4dFBhcmVudCA9IEBwYXJlbnRcblx0XHR3aGlsZSBuZXh0UGFyZW50XG5cdFx0XHRpZiBpc1JlZlxuXHRcdFx0XHRyZXR1cm4gbmV4dFBhcmVudCBpZiBuZXh0UGFyZW50LnJlZiBpcyBmaWx0ZXJcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIG5leHRQYXJlbnQgaWYgZmlsdGVyKG5leHRQYXJlbnQpXG5cblx0XHRcdG5leHRQYXJlbnQgPSBuZXh0UGFyZW50LnBhcmVudFxuXHRcdFxuXHRyZXR1cm5cblxuUXVpY2tFbGVtZW50OjpxdWVyeSA9IChzZWxlY3RvciktPlxuXHRRdWlja0RvbSBAcmF3LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG5cblF1aWNrRWxlbWVudDo6cXVlcnlBbGwgPSAoc2VsZWN0b3IpLT5cblx0cmVzdWx0ID0gQHJhdy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxuXHRvdXRwdXQgPSBbXTsgb3V0cHV0LnB1c2goaXRlbSkgZm9yIGl0ZW0gaW4gcmVzdWx0XG5cdHJldHVybiBuZXcgUXVpY2tCYXRjaChvdXRwdXQpXG5cblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBRdWlja0VsZW1lbnQ6Oixcblx0J2NoaWxkcmVuJzogZ2V0OiAoKS0+XG5cdFx0aWYgQGVsLmNoaWxkTm9kZXMubGVuZ3RoIGlzbnQgQF9jaGlsZHJlbi5sZW5ndGggIyBSZS1jb2xsZWN0IGNoaWxkcmVuXHRcblx0XHRcdEBfY2hpbGRyZW4ubGVuZ3RoID0gMCAjIEVtcHR5IG91dCBjaGlsZHJlbiBhcnJheVxuXHRcdFx0QF9jaGlsZHJlbi5wdXNoKFF1aWNrRG9tKGNoaWxkKSkgZm9yIGNoaWxkIGluIEBlbC5jaGlsZE5vZGVzIHdoZW4gY2hpbGQubm9kZVR5cGUgPCA0XG5cblx0XHRyZXR1cm4gQF9jaGlsZHJlblxuXG5cdCdlbGVtZW50Q2hpbGRyZW4nOiBnZXQ6ICgpLT5cblx0XHRfZmlsdGVyRWxlbWVudHMoQGNoaWxkcmVuKVxuXG5cdCdwYXJlbnQnOiBnZXQ6ICgpLT5cblx0XHRpZiAobm90IEBfcGFyZW50IG9yIEBfcGFyZW50LmVsIGlzbnQgQGVsLnBhcmVudE5vZGUpIGFuZCBub3QgSVMuZG9tRG9jKEBlbC5wYXJlbnROb2RlKVxuXHRcdFx0QF9wYXJlbnQgPSBRdWlja0RvbShAZWwucGFyZW50Tm9kZSlcblxuXHRcdHJldHVybiBAX3BhcmVudFxuXG5cblx0J3BhcmVudHMnOiBnZXQ6ICgpLT5cblx0XHRfZ2V0UGFyZW50cyhAKVxuXG5cdCduZXh0JzogZ2V0OiAoKS0+XG5cdFx0UXVpY2tEb20oQGVsLm5leHRTaWJsaW5nKVxuXHRcblx0J25leHRFbCc6IGdldDogKCktPlxuXHRcdFF1aWNrRG9tKEBlbC5uZXh0RWxlbWVudFNpYmxpbmcpXG5cdFxuXHQnbmV4dEVsQWxsJzogZ2V0OiAoKS0+XG5cdFx0X2ZpbHRlckVsZW1lbnRzKEBuZXh0QWxsKVxuXG5cdCduZXh0QWxsJzogZ2V0OiAoKS0+XG5cdFx0c2libGluZ3MgPSBbXVxuXHRcdG5leHRTaWJsaW5nID0gUXVpY2tEb20oQGVsLm5leHRTaWJsaW5nKVxuXHRcdHdoaWxlIG5leHRTaWJsaW5nXG5cdFx0XHRzaWJsaW5ncy5wdXNoKG5leHRTaWJsaW5nKVxuXHRcdFx0bmV4dFNpYmxpbmcgPSBuZXh0U2libGluZy5uZXh0XG5cblx0XHRyZXR1cm4gc2libGluZ3NcblxuXHQncHJldic6IGdldDogKCktPlxuXHRcdFF1aWNrRG9tKEBlbC5wcmV2aW91c1NpYmxpbmcpXG5cdFxuXHQncHJldkVsJzogZ2V0OiAoKS0+XG5cdFx0UXVpY2tEb20oQGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpXG5cdFxuXHQncHJldkVsQWxsJzogZ2V0OiAoKS0+XG5cdFx0X2ZpbHRlckVsZW1lbnRzKEBwcmV2QWxsKVxuXG5cdCdwcmV2QWxsJzogZ2V0OiAoKS0+XG5cdFx0c2libGluZ3MgPSBbXVxuXHRcdHByZXZTaWJsaW5nID0gUXVpY2tEb20oQGVsLnByZXZpb3VzU2libGluZylcblx0XHR3aGlsZSBwcmV2U2libGluZ1xuXHRcdFx0c2libGluZ3MucHVzaChwcmV2U2libGluZylcblx0XHRcdHByZXZTaWJsaW5nID0gcHJldlNpYmxpbmcucHJldlxuXG5cdFx0cmV0dXJuIHNpYmxpbmdzXG5cblx0J3NpYmxpbmdzJzogZ2V0OiAoKS0+XG5cdFx0QHByZXZBbGwucmV2ZXJzZSgpLmNvbmNhdChAbmV4dEFsbClcblxuXHQnZWxlbWVudFNpYmxpbmdzJzogZ2V0OiAoKS0+XG5cdFx0X2ZpbHRlckVsZW1lbnRzKEBzaWJsaW5ncylcblx0XG5cdCdjaGlsZCc6IGdldDogKCktPlxuXHRcdEBfY2hpbGRSZWZzIG9yIF9nZXRDaGlsZFJlZnMoQClcblxuXHQnY2hpbGRmJzogZ2V0OiAoKS0+XG5cdFx0X2dldENoaWxkUmVmcyhALCB0cnVlKVxuXG5cdCdmaXJzdENoaWxkJzogZ2V0OiAoKS0+XG5cdFx0QGNoaWxkcmVuWzBdXG5cblx0J2xhc3RDaGlsZCc6IGdldDogKCktPlxuXHRcdGNoaWxkcmVuID0gQGNoaWxkcmVuXG5cdFx0Y2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoLTFdXG5cblx0J2luZGV4JzogZ2V0OiAoKS0+XG5cdFx0aWYgbm90IHBhcmVudD1AcGFyZW50XG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGVsc2Vcblx0XHRcdHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKEApXG5cblx0J2luZGV4VHlwZSc6IGdldDogKCktPlxuXHRcdF9nZXRJbmRleEJ5UHJvcChALCAndHlwZScpXG5cblx0J2luZGV4UmVmJzogZ2V0OiAoKS0+XG5cdFx0X2dldEluZGV4QnlQcm9wKEAsICdyZWYnKVxuXG5cblxuX2dldFBhcmVudHMgPSAodGFyZ2V0RWwsIGZpbHRlciktPlxuXHRmaWx0ZXIgPSB1bmRlZmluZWQgaWYgbm90IElTLmZ1bmN0aW9uKGZpbHRlcikgYW5kIG5vdCBpc1JlZj1JUy5zdHJpbmcoZmlsdGVyKVxuXHRwYXJlbnRzID0gW11cblx0bmV4dFBhcmVudCA9IHRhcmdldEVsLnBhcmVudFxuXHR3aGlsZSBuZXh0UGFyZW50XG5cdFx0cGFyZW50cy5wdXNoKG5leHRQYXJlbnQpXG5cdFx0bmV4dFBhcmVudCA9IG5leHRQYXJlbnQucGFyZW50XG5cdFx0aWYgaXNSZWZcblx0XHRcdG5leHRQYXJlbnQgPSBudWxsIGlmIG5leHRQYXJlbnQgYW5kIG5leHRQYXJlbnQucmVmIGlzIGZpbHRlclxuXHRcdGVsc2UgaWYgZmlsdGVyXG5cdFx0XHRuZXh0UGFyZW50ID0gbnVsbCBpZiBmaWx0ZXIobmV4dFBhcmVudClcblxuXHRyZXR1cm4gcGFyZW50c1xuXG5cbl9nZXRDaGlsZFJlZnMgPSAodGFyZ2V0LCBmcmVzaENvcHkpLT5cblx0dGFyZ2V0Ll9jaGlsZFJlZnMgPSB7fSBpZiBmcmVzaENvcHkgb3Igbm90IHRhcmdldC5fY2hpbGRSZWZzXG5cdHJlZnMgPSB0YXJnZXQuX2NoaWxkUmVmc1xuXHRyZWZzW3RhcmdldC5yZWZdID0gdGFyZ2V0IGlmIHRhcmdldC5yZWZcblx0Y2hpbGRyZW4gPSB0YXJnZXQuY2hpbGRyZW5cblxuXHRpZiBjaGlsZHJlbi5sZW5ndGhcblx0XHRmb3IgY2hpbGQgaW4gY2hpbGRyZW5cblx0XHRcdGNoaWxkUmVmcyA9IF9nZXRDaGlsZFJlZnMoY2hpbGQsIGZyZXNoQ29weSlcblx0XHRcdHJlZnNbcmVmXSB8fD0gZWwgZm9yIHJlZixlbCBvZiBjaGlsZFJlZnNcblxuXHRyZXR1cm4gcmVmc1xuXG5cbl9nZXRJbmRleEJ5UHJvcCA9IChtYWluLCBwcm9wKS0+XG5cdGlmIG5vdCBwYXJlbnQ9bWFpbi5wYXJlbnRcblx0XHRyZXR1cm4gbnVsbFxuXHRlbHNlXG5cdFx0cGFyZW50LmNoaWxkcmVuXG5cdFx0XHQuZmlsdGVyIChjaGlsZCktPiBjaGlsZFtwcm9wXSBpcyBtYWluW3Byb3BdXG5cdFx0XHQuaW5kZXhPZihtYWluKVxuXG5cbl9maWx0ZXJFbGVtZW50cyA9IChhcnJheSktPlxuXHRpZiBub3QgYXJyYXkubGVuZ3RoXG5cdFx0cmV0dXJuIGFycmF5XG5cdGVsc2Vcblx0XHRvdXRwdXQgPSBbXVxuXHRcdG91dHB1dC5wdXNoKGl0ZW0pIGZvciBpdGVtIGluIGFycmF5IHdoZW4gaXRlbS50eXBlIGlzbnQgJ3RleHQnXG5cdFx0cmV0dXJuIG91dHB1dFxuXG5cblxuIiwiYmFzZVN0YXRlVHJpZ2dlcnMgPVxuXHQnaG92ZXInOiB7b246J21vdXNlZW50ZXInLCBvZmY6J21vdXNlbGVhdmUnLCBidWJibGVzOnRydWV9XG5cdCdmb2N1cyc6IHtvbjonZm9jdXMnLCBvZmY6J2JsdXInLCBidWJibGVzOnRydWV9XG5cblxuUXVpY2tFbGVtZW50Ojpfbm9ybWFsaXplT3B0aW9ucyA9ICgpLT5cblx0aWYgQG9wdGlvbnMucmVsYXRlZEluc3RhbmNlXG5cdFx0QG9wdGlvbnMucmVsYXRlZCB8fD0gQG9wdGlvbnMucmVsYXRlZEluc3RhbmNlXG5cdFx0QG9wdGlvbnMucmVsYXRlZEluc3RhbmNlID0gbnVsbFxuXHRcblx0QHJlbGF0ZWQgPSBAb3B0aW9ucy5yZWxhdGVkID89IEBcblx0QG9wdGlvbnMuY2xhc3NOYW1lID0gQG9wdGlvbnMuY2xhc3MgaWYgQG9wdGlvbnMuY2xhc3Ncblx0QG9wdGlvbnMuaHJlZiA9IEBvcHRpb25zLnVybCBpZiBAb3B0aW9ucy51cmxcblx0QG9wdGlvbnMudW5wYXNzYWJsZVN0YXRlcyA/PSBbXVxuXHRAb3B0aW9ucy5wYXNzU3RhdGVUb0NoaWxkcmVuID89IHRydWVcblx0QG9wdGlvbnMucGFzc0RhdGFUb0NoaWxkcmVuID89IHRydWVcblx0QG9wdGlvbnMuc3RhdGVUcmlnZ2VycyA9XG5cdFx0aWYgQG9wdGlvbnMuc3RhdGVUcmlnZ2Vyc1xuXHRcdFx0ZXh0ZW5kLmNsb25lLmRlZXAoYmFzZVN0YXRlVHJpZ2dlcnMsIEBvcHRpb25zLnN0YXRlVHJpZ2dlcnMpXG5cdFx0ZWxzZVxuXHRcdFx0YmFzZVN0YXRlVHJpZ2dlcnNcblx0XG5cdGlmIEB0eXBlIGlzICd0ZXh0J1xuXHRcdGV4dGVuZCBALCBAX3BhcnNlVGV4dHMoQG9wdGlvbnMudGV4dCwgQF90ZXh0cylcblx0ZWxzZVxuXHRcdGV4dGVuZCBALCBAX3BhcnNlU3R5bGVzKEBvcHRpb25zLnN0eWxlLCBAX3N0eWxlcylcblx0XG5cdHJldHVyblxuXG5cblF1aWNrRWxlbWVudDo6X3BhcnNlU3R5bGVzID0gKHN0eWxlcywgc3RvcmUpLT5cblx0cmV0dXJuIGlmIG5vdCBJUy5vYmplY3RQbGFpbihzdHlsZXMpXG5cdGtleXMgPSBPYmplY3Qua2V5cyhzdHlsZXMpXG5cdHN0YXRlcyA9IGtleXMuZmlsdGVyIChrZXkpLT4gaGVscGVycy5pc1N0YXRlU3R5bGUoa2V5KVxuXHRzcGVjaWFsU3RhdGVzID0gaGVscGVycy5yZW1vdmVJdGVtKHN0YXRlcy5zbGljZSgpLCAnJGJhc2UnKVxuXHRfbWVkaWFTdGF0ZXMgPSBzdGF0ZXMuZmlsdGVyKChrZXkpLT4ga2V5WzBdIGlzICdAJykubWFwIChzdGF0ZSktPiBzdGF0ZS5zbGljZSgxKVxuXHRfcHJvdmlkZWRTdGF0ZXMgPSBzdGF0ZXMubWFwIChzdGF0ZSktPiBzdGF0ZS5zbGljZSgxKSAjIFJlbW92ZSAnJCcgcHJlZml4XG5cdF9zdHlsZXMgPSBzdG9yZSBvciB7fVxuXHRfc3RhdGVTaGFyZWQgPSBfcHJvdmlkZWRTdGF0ZXNTaGFyZWQgPSB1bmRlZmluZWRcblxuXHRiYXNlID0gaWYgbm90IGhlbHBlcnMuaW5jbHVkZXMoc3RhdGVzLCAnJGJhc2UnKSB0aGVuIHN0eWxlcyBlbHNlIHN0eWxlcy4kYmFzZVxuXHRfc3R5bGVzLmJhc2UgPSBoZWxwZXJzLnJlZ2lzdGVyU3R5bGUoYmFzZSwgMCwgZm9yY2VTdHlsZT1Ab3B0aW9ucy5mb3JjZVN0eWxlKVxuXG5cblx0aWYgc3BlY2lhbFN0YXRlcy5sZW5ndGhcblx0XHRmbGF0dGVuTmVzdGVkU3RhdGVzID0gKHN0eWxlT2JqZWN0LCBjaGFpbiwgbGV2ZWwpLT5cblx0XHRcdHN0eWxlS2V5cyA9IE9iamVjdC5rZXlzKHN0eWxlT2JqZWN0KVxuXHRcdFx0b3V0cHV0ID0ge31cblx0XHRcdGhhc05vblN0YXRlUHJvcHMgPSBmYWxzZVxuXHRcdFx0XG5cdFx0XHRmb3Igc3RhdGUgaW4gc3R5bGVLZXlzXG5cdFx0XHRcdGlmIG5vdCBoZWxwZXJzLmlzU3RhdGVTdHlsZShzdGF0ZSlcblx0XHRcdFx0XHRoYXNOb25TdGF0ZVByb3BzID0gdHJ1ZVxuXHRcdFx0XHRcdG91dHB1dFtzdGF0ZV0gPSBzdHlsZU9iamVjdFtzdGF0ZV1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGNoYWluLnB1c2goc3RhdGVfID0gc3RhdGUuc2xpY2UoMSkpXG5cdFx0XHRcdFx0c3RhdGVDaGFpbiA9IG5ldyAoaW1wb3J0ICcuL3N0YXRlQ2hhaW4nKShjaGFpbilcblx0XHRcdFx0XHRfc3RhdGVTaGFyZWQgPz0gW11cblx0XHRcdFx0XHRfcHJvdmlkZWRTdGF0ZXNTaGFyZWQgPz0gW11cblx0XHRcdFx0XHRfcHJvdmlkZWRTdGF0ZXNTaGFyZWQucHVzaChzdGF0ZUNoYWluKVxuXHRcdFx0XHRcdF9tZWRpYVN0YXRlcy5wdXNoKHN0YXRlXykgaWYgc3RhdGVbMF0gaXMgJ0AnXG5cdFx0XHRcdFx0X3N0eWxlc1tzdGF0ZUNoYWluLnN0cmluZ10gPSBoZWxwZXJzLnJlZ2lzdGVyU3R5bGUgZmxhdHRlbk5lc3RlZFN0YXRlcyhzdHlsZU9iamVjdFtzdGF0ZV0sIGNoYWluLCBsZXZlbCsxKSwgbGV2ZWwrMSwgZm9yY2VTdHlsZVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gaWYgaGFzTm9uU3RhdGVQcm9wcyB0aGVuIG91dHB1dFxuXG5cdFx0Zm9yIHN0YXRlIGluIHNwZWNpYWxTdGF0ZXNcblx0XHRcdHN0YXRlXyA9IHN0YXRlLnNsaWNlKDEpXG5cdFx0XHRcblx0XHRcdHN0YXRlU3R5bGVzID0gZmxhdHRlbk5lc3RlZFN0YXRlcyhzdHlsZXNbc3RhdGVdLCBbc3RhdGVfXSwgMSlcblx0XHRcdF9zdHlsZXNbc3RhdGVfXSA9IGhlbHBlcnMucmVnaXN0ZXJTdHlsZShzdGF0ZVN0eWxlcywgMSkgaWYgc3RhdGVTdHlsZXNcblxuXG5cdHJldHVybiB7X3N0eWxlcywgX21lZGlhU3RhdGVzLCBfc3RhdGVTaGFyZWQsIF9wcm92aWRlZFN0YXRlcywgX3Byb3ZpZGVkU3RhdGVzU2hhcmVkfVxuXG5cblxuUXVpY2tFbGVtZW50OjpfcGFyc2VUZXh0cyA9ICh0ZXh0cywgc3RvcmUpLT5cblx0cmV0dXJuIGlmIG5vdCBJUy5vYmplY3RQbGFpbih0ZXh0cylcblx0c3RhdGVzID0gT2JqZWN0LmtleXModGV4dHMpLm1hcCAoc3RhdGUpLT4gc3RhdGUuc2xpY2UoMSlcblx0X3Byb3ZpZGVkU3RhdGVzID0gc3RhdGVzLmZpbHRlciAoc3RhdGUpLT4gc3RhdGUgaXNudCAnYmFzZSdcblx0X3RleHRzID0gc3RvcmUgb3Ige31cblx0X3RleHRzID0gYmFzZTonJ1xuXHRfdGV4dHNbc3RhdGVdID0gdGV4dHNbJyQnK3N0YXRlXSBmb3Igc3RhdGUgaW4gc3RhdGVzXG5cdFxuXHRyZXR1cm4ge190ZXh0cywgX3Byb3ZpZGVkU3RhdGVzfVxuXG5cblF1aWNrRWxlbWVudDo6X2FwcGx5T3B0aW9ucyA9ICgpLT5cblx0aWYgcmVmPShAb3B0aW9ucy5pZCBvciBAb3B0aW9ucy5yZWYpIHRoZW4gQGF0dHIoJ2RhdGEtcmVmJywgQHJlZj1yZWYpXG5cdGlmIEBvcHRpb25zLmlkIHRoZW4gQGVsLmlkID0gQG9wdGlvbnMuaWRcblx0aWYgQG9wdGlvbnMuY2xhc3NOYW1lIHRoZW4gQGVsLmNsYXNzTmFtZSA9IEBvcHRpb25zLmNsYXNzTmFtZVxuXHRpZiBAb3B0aW9ucy5zcmMgdGhlbiBAZWwuc3JjID0gQG9wdGlvbnMuc3JjXG5cdGlmIEBvcHRpb25zLmhyZWYgdGhlbiBAZWwuaHJlZiA9IEBvcHRpb25zLmhyZWZcblx0aWYgQG9wdGlvbnMudHlwZSB0aGVuIEBlbC50eXBlID0gQG9wdGlvbnMudHlwZVxuXHRpZiBAb3B0aW9ucy5uYW1lIHRoZW4gQGVsLm5hbWUgPSBAb3B0aW9ucy5uYW1lXG5cdGlmIEBvcHRpb25zLnZhbHVlIHRoZW4gQGVsLnZhbHVlID0gQG9wdGlvbnMudmFsdWVcblx0aWYgQG9wdGlvbnMuc2VsZWN0ZWQgdGhlbiBAZWwuc2VsZWN0ZWQgPSBAb3B0aW9ucy5zZWxlY3RlZFxuXHRpZiBAb3B0aW9ucy5jaGVja2VkIHRoZW4gQGVsLmNoZWNrZWQgPSBAb3B0aW9ucy5jaGVja2VkXG5cdGlmIEBvcHRpb25zLnByb3BzIHRoZW4gQHByb3AoQG9wdGlvbnMucHJvcHMpXG5cdGlmIEBvcHRpb25zLmF0dHJzIHRoZW4gQGF0dHIoQG9wdGlvbnMuYXR0cnMpXG5cdEBfYXBwbHlSZWdpc3RlcmVkU3R5bGUoQF9zdHlsZXMuYmFzZSwgbnVsbCwgbnVsbCwgQG9wdGlvbnMuc3R5bGVBZnRlckluc2VydClcblx0QHRleHQgPSBAX3RleHRzLmJhc2UgaWYgQF90ZXh0c1xuXG5cdEBvbignaW5zZXJ0ZWQnLCBDQUNIRURfRk5fSU5TRVJURUQsIGZhbHNlLCB0cnVlKVxuXG5cdGlmIEBvcHRpb25zLmludm9rZUNvbXB1dGVyc09uY2Vcblx0XHRAX2ludm9rZWRDb21wdXRlcnMgPSB7fVxuXHRcblx0aWYgQG9wdGlvbnMucmVjYWxjT25SZXNpemVcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgKCk9PiBAcmVjYWxjU3R5bGUoKVxuXG5cdGlmIEBvcHRpb25zLmV2ZW50c1xuXHRcdEBvbihldmVudCwgaGFuZGxlcikgZm9yIGV2ZW50LGhhbmRsZXIgb2YgQG9wdGlvbnMuZXZlbnRzXG5cblx0aWYgQG9wdGlvbnMubWV0aG9kc1xuXHRcdGZvciBtZXRob2QsdmFsdWUgb2YgQG9wdGlvbnMubWV0aG9kcyB3aGVuIG5vdCBAW21ldGhvZF1cblx0XHRcdGlmIElTLmZ1bmN0aW9uKHZhbHVlKVxuXHRcdFx0XHRAW21ldGhvZF0gPSB2YWx1ZVxuXHRcdFx0ZWxzZSBpZiBJUy5vYmplY3QodmFsdWUpXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBALCBtZXRob2QsIHtjb25maWd1cmFibGU6dHJ1ZSwgZ2V0OnZhbHVlLmdldCwgc2V0OnZhbHVlLnNldH1cblxuXHRpZiBAdHlwZSBpc250ICd0ZXh0JyBhbmQgSVMub2JqZWN0KEBvcHRpb25zLnRleHQpXG5cdFx0QGFwcGVuZCBRdWlja0RvbSgndGV4dCcsIHRleHQ6QG9wdGlvbnMudGV4dClcblx0cmV0dXJuXG5cblxuUXVpY2tFbGVtZW50OjpfcG9zdENyZWF0aW9uID0gKGRhdGEpLT5cblx0aWYgQG9wdGlvbnMuY29tcHV0ZXJzXG5cdFx0ZGF0YSA9IGV4dGVuZC5jbG9uZShAb3B0aW9ucy5kYXRhLCBkYXRhKSBpZiBkYXRhIGFuZCBAb3B0aW9ucy5kYXRhXG5cdFx0ZGF0YSB8fD0gQG9wdGlvbnMuZGF0YVxuXHRcdEBhcHBseURhdGEoZGF0YSwgZmFsc2UpXG5cdFx0XG5cdFx0aWYgQG9wdGlvbnMuY29tcHV0ZXJzLl9pbml0XG5cdFx0XHRAX3J1bkNvbXB1dGVyKCdfaW5pdCcsIGRhdGEpXG5cblx0aWYgQG9wdGlvbnMuc3RhdGVcblx0XHRAc3RhdGUoQG9wdGlvbnMuc3RhdGUpXG5cdFxuXHRyZXR1cm5cblxuXG5RdWlja0VsZW1lbnQ6Ol9hdHRhY2hTdGF0ZUV2ZW50cyA9IChmb3JjZSktPlxuXHRzdGF0ZXMgPSBPYmplY3Qua2V5cyhAb3B0aW9ucy5zdGF0ZVRyaWdnZXJzKVxuXHRzdGF0ZXMuZm9yRWFjaCAoc3RhdGUpPT5cblx0XHR0cmlnZ2VyID0gQG9wdGlvbnMuc3RhdGVUcmlnZ2Vyc1tzdGF0ZV1cdFxuXHRcdHJldHVybiBpZiBub3QgaGVscGVycy5pbmNsdWRlcyhAX3Byb3ZpZGVkU3RhdGVzLCBzdGF0ZSkgYW5kIG5vdCBmb3JjZSBhbmQgbm90IHRyaWdnZXIuZm9yY2Vcblx0XHRlbmFibGVyID0gaWYgSVMuc3RyaW5nKHRyaWdnZXIpIHRoZW4gdHJpZ2dlciBlbHNlIHRyaWdnZXIub25cblx0XHRkaXNhYmxlciA9IHRyaWdnZXIub2ZmIGlmIElTLm9iamVjdCh0cmlnZ2VyKVxuXG5cdFx0QF9saXN0ZW5UbyBlbmFibGVyLCAoKT0+IEBzdGF0ZShzdGF0ZSwgb24sIHRyaWdnZXIuYnViYmxlcylcblx0XHRpZiBkaXNhYmxlciB0aGVuIEBfbGlzdGVuVG8gZGlzYWJsZXIsICgpPT4gQHN0YXRlKHN0YXRlLCBvZmYsIHRyaWdnZXIuYnViYmxlcylcblx0XG5cdHJldHVyblxuXG5cblxuUXVpY2tFbGVtZW50OjpfcHJveHlQYXJlbnQgPSAoKS0+XG5cdHBhcmVudCA9IHVuZGVmaW5lZFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgQCwgJ19wYXJlbnQnLFxuXHRcdGdldDogKCktPiBwYXJlbnRcblx0XHRzZXQ6IChuZXdQYXJlbnQpLT4gaWYgcGFyZW50PW5ld1BhcmVudFxuXHRcdFx0bGFzdFBhcmVudCA9IEBwYXJlbnRzLnNsaWNlKC0xKVswXVxuXHRcdFx0aWYgbGFzdFBhcmVudC5yYXcgaXMgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG5cdFx0XHRcdEBfdW5wcm94eVBhcmVudChuZXdQYXJlbnQpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBhcmVudC5vbiAnaW5zZXJ0ZWQnLCAoKT0+XG5cdFx0XHRcdFx0QF91bnByb3h5UGFyZW50KG5ld1BhcmVudCkgaWYgcGFyZW50IGlzIG5ld1BhcmVudFxuXHRcdFx0cmV0dXJuXG5cblxuUXVpY2tFbGVtZW50OjpfdW5wcm94eVBhcmVudCA9IChuZXdQYXJlbnQpLT5cblx0ZGVsZXRlIEBfcGFyZW50XG5cdEBfcGFyZW50ID0gbmV3UGFyZW50XG5cdEBlbWl0UHJpdmF0ZSgnaW5zZXJ0ZWQnLCBuZXdQYXJlbnQpXG5cdHJldHVyblxuXG5cblxuQ0FDSEVEX0ZOX0lOU0VSVEVEID0gKCktPlxuXHRAX2luc2VydGVkID0gQFxuXHRAcmVjYWxjU3R5bGUoKSBpZiBAb3B0aW9ucy5zdHlsZUFmdGVySW5zZXJ0XG5cblx0aWYgKG1lZGlhU3RhdGVzPUBfbWVkaWFTdGF0ZXMpIGFuZCBAX21lZGlhU3RhdGVzLmxlbmd0aFxuXHRcdEBfbWVkaWFTdGF0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdFx0XG5cdFx0Zm9yIHF1ZXJ5U3RyaW5nIGluIG1lZGlhU3RhdGVzXG5cdFx0XHRAX21lZGlhU3RhdGVzW3F1ZXJ5U3RyaW5nXSA9IE1lZGlhUXVlcnkucmVnaXN0ZXIoQCwgcXVlcnlTdHJpbmcpXG5cblxuXG5cblxuXG5cblxuIiwicmVnZXhXaGl0ZXNwYWNlID0gL1xccysvXG5cblF1aWNrRWxlbWVudDo6b24gPSAoZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUsIGlzUHJpdmF0ZSktPlxuXHRAX2V2ZW50Q2FsbGJhY2tzID89IHtfX3JlZnM6e319XG5cdFxuXHRpZiBJUy5zdHJpbmcoZXZlbnROYW1lcykgYW5kIElTLmZ1bmN0aW9uKGNhbGxiYWNrKVxuXHRcdHNwbGl0ID0gZXZlbnROYW1lcy5zcGxpdCgnLicpXG5cdFx0Y2FsbGJhY2tSZWYgPSBzcGxpdFsxXVxuXHRcdGV2ZW50TmFtZXMgPSBzcGxpdFswXVxuXHRcdFxuXHRcdGlmIGV2ZW50TmFtZXMgaXMgJ2luc2VydGVkJyBhbmQgQF9pbnNlcnRlZFxuXHRcdFx0Y2FsbGJhY2suY2FsbChALCBAX3BhcmVudClcblx0XHRcdHJldHVybiBAXG5cdFx0XG5cdFx0ZXZlbnROYW1lcy5zcGxpdChyZWdleFdoaXRlc3BhY2UpLmZvckVhY2ggKGV2ZW50TmFtZSk9PlxuXHRcdFx0aWYgbm90IEBfZXZlbnRDYWxsYmFja3NbZXZlbnROYW1lXVxuXHRcdFx0XHRAX2V2ZW50Q2FsbGJhY2tzW2V2ZW50TmFtZV0gPSBbXVx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdHVubGVzcyBpc1ByaXZhdGUgdGhlbiBAX2xpc3RlblRvIGV2ZW50TmFtZSwgKGV2ZW50KT0+XG5cdFx0XHRcdFx0QF9pbnZva2VIYW5kbGVycyhldmVudE5hbWUsIGV2ZW50KVxuXHRcdFx0XHQsIHVzZUNhcHR1cmVcblxuXHRcdFx0QF9ldmVudENhbGxiYWNrcy5fX3JlZnNbY2FsbGJhY2tSZWZdID0gY2FsbGJhY2sgaWYgY2FsbGJhY2tSZWZcblx0XHRcdEBfZXZlbnRDYWxsYmFja3NbZXZlbnROYW1lXS5wdXNoKGNhbGxiYWNrKVxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpvbmNlID0gKGV2ZW50TmFtZXMsIGNhbGxiYWNrKS0+XG5cdGlmIElTLnN0cmluZyhldmVudE5hbWVzKSBhbmQgSVMuZnVuY3Rpb24oY2FsbGJhY2spXG5cdFx0QG9uIGV2ZW50TmFtZXMsIG9uY2VDYWxsYmFjaz0oZXZlbnQpPT5cblx0XHRcdEBvZmYoZXZlbnROYW1lcywgb25jZUNhbGxiYWNrKVxuXHRcdFx0Y2FsbGJhY2suY2FsbChALCBldmVudClcblx0XG5cdHJldHVybiBAXG5cblxuXG5RdWlja0VsZW1lbnQ6Om9mZiA9IChldmVudE5hbWVzLCBjYWxsYmFjayktPlxuXHRAX2V2ZW50Q2FsbGJhY2tzID89IHtfX3JlZnM6e319XG5cdGlmIG5vdCBJUy5zdHJpbmcoZXZlbnROYW1lcylcblx0XHRAb2ZmKGV2ZW50TmFtZSkgZm9yIGV2ZW50TmFtZSBvZiBAX2V2ZW50Q2FsbGJhY2tzXG5cdFxuXHRlbHNlXG5cdFx0c3BsaXQgPSBldmVudE5hbWVzLnNwbGl0KCcuJylcblx0XHRjYWxsYmFja1JlZiA9IHNwbGl0WzFdXG5cdFx0ZXZlbnROYW1lcyA9IHNwbGl0WzBdXG5cdFx0ZXZlbnROYW1lcy5zcGxpdChyZWdleFdoaXRlc3BhY2UpLmZvckVhY2ggKGV2ZW50TmFtZSk9PlxuXHRcdFx0aWYgQF9ldmVudENhbGxiYWNrc1tldmVudE5hbWVdXG5cdFx0XHRcdGNhbGxiYWNrID89IEBfZXZlbnRDYWxsYmFja3MuX19yZWZzW2NhbGxiYWNrUmVmXVxuXG5cdFx0XHRcdGlmIElTLmZ1bmN0aW9uKGNhbGxiYWNrKVxuXHRcdFx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAX2V2ZW50Q2FsbGJhY2tzW2V2ZW50TmFtZV0sIGNhbGxiYWNrKVxuXHRcdFx0XHRlbHNlIGlmIG5vdCBjYWxsYmFja1JlZlxuXHRcdFx0XHRcdEBfZXZlbnRDYWxsYmFja3NbZXZlbnROYW1lXS5sZW5ndGggPSAwXG5cblx0cmV0dXJuIEBcblxuXG5cblF1aWNrRWxlbWVudDo6ZW1pdCA9IChldmVudE5hbWUsIGJ1YmJsZXM9dHJ1ZSwgY2FuY2VsYWJsZT10cnVlLCBkYXRhKS0+XG5cdGlmIGV2ZW50TmFtZSBhbmQgSVMuc3RyaW5nKGV2ZW50TmFtZSlcblx0XHRldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpXG5cdFx0ZXZlbnQuaW5pdEV2ZW50KGV2ZW50TmFtZSwgYnViYmxlcywgY2FuY2VsYWJsZSlcblx0XHRleHRlbmQoZXZlbnQsIGRhdGEpIGlmIGRhdGEgYW5kIHR5cGVvZiBkYXRhIGlzICdvYmplY3QnXG5cdFx0QGVsLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OmVtaXRQcml2YXRlID0gKGV2ZW50TmFtZSwgYXJnKS0+XG5cdGlmIGV2ZW50TmFtZSBhbmQgSVMuc3RyaW5nKGV2ZW50TmFtZSkgYW5kIEBfZXZlbnRDYWxsYmFja3M/W2V2ZW50TmFtZV1cblx0XHRAX2ludm9rZUhhbmRsZXJzKGV2ZW50TmFtZSwgYXJnKVxuXHRcblx0cmV0dXJuIEBcblxuXG5cblF1aWNrRWxlbWVudDo6X2ludm9rZUhhbmRsZXJzID0gKGV2ZW50TmFtZSwgYXJnKS0+XG5cdGNhbGxiYWNrcyA9IEBfZXZlbnRDYWxsYmFja3NbZXZlbnROYW1lXS5zbGljZSgpXG5cdGNiLmNhbGwoQCwgYXJnKSBmb3IgY2IgaW4gY2FsbGJhY2tzXG5cdHJldHVyblxuXG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrRWxlbWVudDo6X2xpc3RlblRvID0gKGV2ZW50TmFtZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpLT5cblx0bGlzdGVuTWV0aG9kID0gaWYgQGVsLmFkZEV2ZW50TGlzdGVuZXIgdGhlbiAnYWRkRXZlbnRMaXN0ZW5lcicgZWxzZSAnYXR0YWNoRXZlbnQnXG5cdGV2ZW50TmFtZVRvTGlzdGVuRm9yID0gaWYgQGVsLmFkZEV2ZW50TGlzdGVuZXIgdGhlbiBldmVudE5hbWUgZWxzZSBcIm9uI3tldmVudE5hbWV9XCJcblx0XG5cdEBlbFtsaXN0ZW5NZXRob2RdKGV2ZW50TmFtZVRvTGlzdGVuRm9yLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSlcblx0cmV0dXJuIEBcblxuXG5cblxuIiwiRFVNTVlfQVJSQVkgPSBbXVxuXG5cblF1aWNrRWxlbWVudDo6c3RhdGUgPSAodGFyZ2V0U3RhdGUsIHZhbHVlLCBidWJibGVzLCBzb3VyY2UpLT5cblx0aWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG5cdFx0cmV0dXJuIEBfc3RhdGUuc2xpY2UoKVxuXHRcblx0aWYgYXJndW1lbnRzLmxlbmd0aCBpcyAxXG5cdFx0aWYgSVMuc3RyaW5nKHRhcmdldFN0YXRlKVxuXHRcdFx0cmV0dXJuIGhlbHBlcnMuaW5jbHVkZXMoQF9zdGF0ZSwgdGFyZ2V0U3RhdGUpXG5cdFx0XG5cdFx0ZWxzZSBpZiBJUy5vYmplY3QodGFyZ2V0U3RhdGUpXG5cdFx0XHRrZXlzID0gT2JqZWN0LmtleXModGFyZ2V0U3RhdGUpXG5cdFx0XHRpID0gLTFcblx0XHRcdEBzdGF0ZShrZXksIHRhcmdldFN0YXRlW2tleV0pIHdoaWxlIGtleT1rZXlzWysraV1cblx0XHRcdHJldHVybiBAXG5cblx0ZWxzZSBpZiBAX3N0YXRlUGlwZVRhcmdldCBhbmQgc291cmNlIGlzbnQgQFxuXHRcdEBfc3RhdGVQaXBlVGFyZ2V0LnN0YXRlKHRhcmdldFN0YXRlLCB2YWx1ZSwgYnViYmxlcywgQClcblx0XHRyZXR1cm4gQFxuXHRcblx0ZWxzZSBpZiBJUy5zdHJpbmcodGFyZ2V0U3RhdGUpXG5cdFx0dGFyZ2V0U3RhdGUgPSB0YXJnZXRTdGF0ZS5zbGljZSgxKSBpZiB0YXJnZXRTdGF0ZVswXSBpcyAnJCdcblx0XHRyZXR1cm4gQCBpZiB0YXJnZXRTdGF0ZSBpcyAnYmFzZSdcblx0XHRkZXNpcmVkVmFsdWUgPSAhIXZhbHVlICMgQ29udmVydCB0aGUgdmFsdWUgdG8gYSBib29sZWFuXG5cdFx0YWN0aXZlU3RhdGVzID0gQF9nZXRBY3RpdmVTdGF0ZXModGFyZ2V0U3RhdGUsIGZhbHNlKVxuXHRcdFxuXHRcdCMgPT09PSBUb2dnbGUgc3R5bGVzIGZvciB0aGlzIHN0YXRlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdGlmIEBzdGF0ZSh0YXJnZXRTdGF0ZSkgaXNudCBkZXNpcmVkVmFsdWVcblx0XHRcdHByb3AgPSBpZiBAdHlwZSBpcyAndGV4dCcgdGhlbiAnVGV4dCcgZWxzZSAnU3R5bGUnXG5cdFx0XG5cdFx0XHRpZiBkZXNpcmVkVmFsdWUgI2lzIG9uXG5cdFx0XHRcdEBfc3RhdGUucHVzaCh0YXJnZXRTdGF0ZSlcblx0XHRcdFx0dG9nZ2xlID0gJ09OJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRoZWxwZXJzLnJlbW92ZUl0ZW0oQF9zdGF0ZSwgdGFyZ2V0U3RhdGUpXG5cdFx0XHRcdHRvZ2dsZSA9ICdPRkYnXG5cdFx0XHRcblx0XHRcdEBbJ190dXJuJytwcm9wK3RvZ2dsZV0odGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcylcblx0XHRcdEBlbWl0UHJpdmF0ZSBcInN0YXRlQ2hhbmdlOiN7dGFyZ2V0U3RhdGV9XCIsIGRlc2lyZWRWYWx1ZVxuXG5cblx0XHQjID09PT0gUGFzcyBzdGF0ZSB0byBwYXJlbnQvY2hpbGRyZW4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0aWYgbm90IGhlbHBlcnMuaW5jbHVkZXMoQG9wdGlvbnMudW5wYXNzYWJsZVN0YXRlcywgdGFyZ2V0U3RhdGUpXG5cdFx0XHRpZiBidWJibGVzXG5cdFx0XHRcdEBfcGFyZW50LnN0YXRlKHRhcmdldFN0YXRlLCB2YWx1ZSwgdHJ1ZSwgc291cmNlIG9yIEApIGlmIEBwYXJlbnRcblx0XHRcdGVsc2UgaWYgQG9wdGlvbnMucGFzc1N0YXRlVG9DaGlsZHJlblxuXHRcdFx0XHRjaGlsZC5zdGF0ZSh0YXJnZXRTdGF0ZSwgdmFsdWUsIGZhbHNlLCBzb3VyY2Ugb3IgQCkgZm9yIGNoaWxkIGluIEBfY2hpbGRyZW5cblx0XHRcblx0XHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6dG9nZ2xlU3RhdGUgPSAodGFyZ2V0U3RhdGUpLT5cblx0QHN0YXRlKHRhcmdldFN0YXRlLCAhQHN0YXRlKHRhcmdldFN0YXRlKSlcblxuXG5RdWlja0VsZW1lbnQ6OnJlc2V0U3RhdGUgPSAoKS0+XG5cdGZvciBhY3RpdmVTdGF0ZSBpbiBAX3N0YXRlLnNsaWNlKClcblx0XHRAc3RhdGUoYWN0aXZlU3RhdGUsIG9mZilcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6cGlwZVN0YXRlID0gKHRhcmdldEVsKS0+XG5cdGlmIHRhcmdldEVsXG5cdFx0dGFyZ2V0RWwgPSBoZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwodGFyZ2V0RWwpXG5cblx0XHRpZiBJUy5xdWlja0RvbUVsKHRhcmdldEVsKSBhbmQgdGFyZ2V0RWwgaXNudCBAXG5cdFx0XHRAX3N0YXRlUGlwZVRhcmdldCA9IHRhcmdldEVsXG5cdFx0XHR0YXJnZXRFbC5zdGF0ZShhY3RpdmVTdGF0ZSwgb24pIGZvciBhY3RpdmVTdGF0ZSBpbiBAX3N0YXRlXG5cblx0ZWxzZSBpZiB0YXJnZXRFbCBpcyBmYWxzZVxuXHRcdGRlbGV0ZSBAX3N0YXRlUGlwZVRhcmdldFxuXG5cdHJldHVybiBAXG5cblxuXG5cblF1aWNrRWxlbWVudDo6X2FwcGx5UmVnaXN0ZXJlZFN0eWxlID0gKHRhcmdldFN0eWxlLCBzdXBlcmlvclN0YXRlcywgaW5jbHVkZUJhc2UsIHNraXBGbnMpLT4gaWYgdGFyZ2V0U3R5bGVcblx0QGFkZENsYXNzKGNsYXNzTmFtZSkgZm9yIGNsYXNzTmFtZSBpbiB0YXJnZXRTdHlsZS5jbGFzc05hbWVcblx0XG5cdGlmIHRhcmdldFN0eWxlLmZucy5sZW5ndGggYW5kIG5vdCBza2lwRm5zXG5cdFx0c3VwZXJpb3JTdHlsZXMgPSBAX3Jlc29sdmVGblN0eWxlcyhzdXBlcmlvclN0YXRlcywgaW5jbHVkZUJhc2UpIGlmIHN1cGVyaW9yU3RhdGVzXG5cdFx0XG5cdFx0Zm9yIGVudHJ5IGluIHRhcmdldFN0eWxlLmZuc1xuXHRcdFx0QHN0eWxlKGVudHJ5WzBdLCBlbnRyeVsxXSkgdW5sZXNzIHN1cGVyaW9yU3R5bGVzIGFuZCBzdXBlcmlvclN0eWxlc1tlbnRyeVswXV1cblx0XG5cdHJldHVyblxuXG5cblF1aWNrRWxlbWVudDo6X3JlbW92ZVJlZ2lzdGVyZWRTdHlsZSA9ICh0YXJnZXRTdHlsZSwgc3VwZXJpb3JTdGF0ZXMsIGluY2x1ZGVCYXNlKS0+XG5cdEByZW1vdmVDbGFzcyhjbGFzc05hbWUpIGZvciBjbGFzc05hbWUgaW4gdGFyZ2V0U3R5bGUuY2xhc3NOYW1lXG5cblx0aWYgdGFyZ2V0U3R5bGUuZm5zLmxlbmd0aFxuXHRcdHN1cGVyaW9yU3R5bGVzID0gQF9yZXNvbHZlRm5TdHlsZXMoc3VwZXJpb3JTdGF0ZXMsIGluY2x1ZGVCYXNlKSBpZiBzdXBlcmlvclN0YXRlc1xuXHRcdFxuXHRcdGZvciBlbnRyeSBpbiB0YXJnZXRTdHlsZS5mbnNcblx0XHRcdHJlc2V0VmFsdWUgPSBzdXBlcmlvclN0eWxlcyBhbmQgc3VwZXJpb3JTdHlsZXNbZW50cnlbMF1dIG9yIG51bGxcblx0XHRcdEBzdHlsZShlbnRyeVswXSwgcmVzZXRWYWx1ZSlcblxuXHRyZXR1cm5cblxuXG5cblxuUXVpY2tFbGVtZW50OjpfdHVyblN0eWxlT04gPSAodGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcyktPlxuXHRza2lwRm5zID0gQG9wdGlvbnMuc3R5bGVBZnRlckluc2VydCBhbmQgbm90IEBfaW5zZXJ0ZWRcblx0aWYgQF9zdHlsZXNbdGFyZ2V0U3RhdGVdXG5cdFx0QF9hcHBseVJlZ2lzdGVyZWRTdHlsZShAX3N0eWxlc1t0YXJnZXRTdGF0ZV0sIEBfZ2V0U3VwZXJpb3JTdGF0ZXModGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcyksIGZhbHNlLCBza2lwRm5zKVxuXG5cblx0aWYgQF9wcm92aWRlZFN0YXRlc1NoYXJlZFxuXHRcdHNoYXJlZFN0YXRlcyA9IEBfZ2V0U2hhcmVkU3RhdGVzKHRhcmdldFN0YXRlKVxuXHRcdFxuXHRcdGZvciBzdGF0ZUNoYWluIGluIHNoYXJlZFN0YXRlc1xuXHRcdFx0QF9zdGF0ZVNoYXJlZC5wdXNoKHN0YXRlQ2hhaW4uc3RyaW5nKSB1bmxlc3MgaGVscGVycy5pbmNsdWRlcyhAX3N0YXRlU2hhcmVkLCBzdGF0ZUNoYWluLnN0cmluZylcblx0XHRcdEBfYXBwbHlSZWdpc3RlcmVkU3R5bGUoQF9zdHlsZXNbc3RhdGVDaGFpbi5zdHJpbmddLCBudWxsLCBudWxsLCBza2lwRm5zKVxuXG5cdHJldHVyblxuXG5cblF1aWNrRWxlbWVudDo6X3R1cm5TdHlsZU9GRiA9ICh0YXJnZXRTdGF0ZSwgYWN0aXZlU3RhdGVzKS0+XG5cdGlmIEBfc3R5bGVzW3RhcmdldFN0YXRlXVxuXHRcdEBfcmVtb3ZlUmVnaXN0ZXJlZFN0eWxlKEBfc3R5bGVzW3RhcmdldFN0YXRlXSwgYWN0aXZlU3RhdGVzLCB0cnVlKVxuXG5cdGlmIEBfcHJvdmlkZWRTdGF0ZXNTaGFyZWRcblx0XHRzaGFyZWRTdGF0ZXMgPSBAX2dldFNoYXJlZFN0YXRlcyh0YXJnZXRTdGF0ZSlcblx0XHRyZXR1cm4gaWYgc2hhcmVkU3RhdGVzLmxlbmd0aCBpcyAwXG5cblx0XHRmb3Igc3RhdGVDaGFpbiBpbiBzaGFyZWRTdGF0ZXNcblx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAX3N0YXRlU2hhcmVkLCBzdGF0ZUNoYWluLnN0cmluZylcblx0XHRcdHRhcmdldFN0eWxlID0gQF9zdHlsZXNbc3RhdGVDaGFpbi5zdHJpbmddXG5cdFx0XHRcblx0XHRcdGlmIHRhcmdldFN0eWxlLmZucy5sZW5ndGggYW5kIEBfc3RhdGVTaGFyZWQubGVuZ3RoIGFuZCBub3QgYWN0aXZlU2hhcmVkU3RhdGVzXG5cdFx0XHRcdGFjdGl2ZVNoYXJlZFN0YXRlcyA9IEBfc3RhdGVTaGFyZWQuZmlsdGVyIChzdGF0ZSktPiBub3QgaGVscGVycy5pbmNsdWRlcyhzdGF0ZSwgdGFyZ2V0U3RhdGUpXG5cdFx0XHRcdGFjdGl2ZVN0YXRlcyA9IGFjdGl2ZVN0YXRlcy5jb25jYXQoYWN0aXZlU2hhcmVkU3RhdGVzKVxuXHRcdFx0XG5cdFx0XHRAX3JlbW92ZVJlZ2lzdGVyZWRTdHlsZSh0YXJnZXRTdHlsZSwgYWN0aXZlU3RhdGVzLCB0cnVlKVxuXG5cdHJldHVyblxuXG5cblxuUXVpY2tFbGVtZW50OjpfdHVyblRleHRPTiA9ICh0YXJnZXRTdGF0ZSwgYWN0aXZlU3RhdGVzKS0+XG5cdGlmIEBfdGV4dHMgYW5kIElTLnN0cmluZyh0YXJnZXRUZXh0ID0gQF90ZXh0c1t0YXJnZXRTdGF0ZV0pXG5cdFx0c3VwZXJpb3JTdGF0ZXMgPSBAX2dldFN1cGVyaW9yU3RhdGVzKHRhcmdldFN0YXRlLCBhY3RpdmVTdGF0ZXMpXG5cdFx0XG5cdFx0QHRleHQgPSB0YXJnZXRUZXh0IHVubGVzcyBzdXBlcmlvclN0YXRlcy5sZW5ndGhcblx0cmV0dXJuXG5cblxuUXVpY2tFbGVtZW50OjpfdHVyblRleHRPRkYgPSAodGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcyktPlxuXHRpZiBAX3RleHRzIGFuZCBJUy5zdHJpbmcodGFyZ2V0VGV4dCA9IEBfdGV4dHNbdGFyZ2V0U3RhdGVdKVxuXHRcdGFjdGl2ZVN0YXRlcyA9IGFjdGl2ZVN0YXRlcy5maWx0ZXIgKHN0YXRlKS0+IHN0YXRlIGlzbnQgdGFyZ2V0U3RhdGVcblx0XHR0YXJnZXRUZXh0ID0gQF90ZXh0c1thY3RpdmVTdGF0ZXNbYWN0aXZlU3RhdGVzLmxlbmd0aC0xXV1cblx0XHR0YXJnZXRUZXh0ID89IEBfdGV4dHMuYmFzZVxuXHRcdFxuXHRcdEB0ZXh0ID0gdGFyZ2V0VGV4dFxuXHRyZXR1cm5cblxuXG5cblxuXHRcblxuXG5cblxuUXVpY2tFbGVtZW50OjpfZ2V0QWN0aXZlU3RhdGVzID0gKHN0YXRlVG9FeGNsdWRlLCBpbmNsdWRlU2hhcmVkU3RhdGVzPXRydWUpLT5cblx0cmV0dXJuIERVTU1ZX0FSUkFZIGlmIG5vdCBAX3Byb3ZpZGVkU3RhdGVzXG5cdGFjdGl2ZVN0YXRlcyA9IHBsYWluU3RhdGVzID0gQF9zdGF0ZVxuXHRpZiBzdGF0ZVRvRXhjbHVkZVxuXHRcdHBsYWluU3RhdGVzID0gW11cblx0XHRwbGFpblN0YXRlcy5wdXNoKHN0YXRlKSBmb3Igc3RhdGUgaW4gYWN0aXZlU3RhdGVzIHdoZW4gc3RhdGUgaXNudCBzdGF0ZVRvRXhjbHVkZVxuXHRcblx0aWYgbm90IGluY2x1ZGVTaGFyZWRTdGF0ZXMgb3Igbm90IEBfcHJvdmlkZWRTdGF0ZXNTaGFyZWRcblx0XHRyZXR1cm4gcGxhaW5TdGF0ZXNcblx0ZWxzZVxuXHRcdHJldHVybiBwbGFpblN0YXRlcy5jb25jYXQoQF9zdGF0ZVNoYXJlZClcblxuXG5RdWlja0VsZW1lbnQ6Ol9nZXRTdXBlcmlvclN0YXRlcyA9ICh0YXJnZXRTdGF0ZSwgYWN0aXZlU3RhdGVzKS0+XG5cdHRhcmdldFN0YXRlSW5kZXggPSBAX3Byb3ZpZGVkU3RhdGVzLmluZGV4T2YodGFyZ2V0U3RhdGUpXG5cdHJldHVybiBEVU1NWV9BUlJBWSBpZiB0YXJnZXRTdGF0ZUluZGV4IGlzIEBfcHJvdmlkZWRTdGF0ZXMubGVuZ3RoIC0gMVxuXHRcblx0c3VwZXJpb3IgPSBbXVxuXHRmb3IgY2FuZGlkYXRlIGluIGFjdGl2ZVN0YXRlc1xuXHRcdHN1cGVyaW9yLnB1c2goY2FuZGlkYXRlKSBpZiBAX3Byb3ZpZGVkU3RhdGVzLmluZGV4T2YoY2FuZGlkYXRlKSA+IHRhcmdldFN0YXRlSW5kZXhcblxuXHRyZXR1cm4gc3VwZXJpb3JcblxuXG5RdWlja0VsZW1lbnQ6Ol9nZXRTaGFyZWRTdGF0ZXMgPSAodGFyZ2V0U3RhdGUpLT5cblx0YWN0aXZlU3RhdGVzID0gQF9zdGF0ZVxuXHRzaGFyZWRTdGF0ZXMgPSBbXVxuXG5cdGZvciBzdGF0ZUNoYWluIGluIEBfcHJvdmlkZWRTdGF0ZXNTaGFyZWRcblx0XHRzaGFyZWRTdGF0ZXMucHVzaChzdGF0ZUNoYWluKSBpZiBzdGF0ZUNoYWluLmluY2x1ZGVzKHRhcmdldFN0YXRlKSBhbmQgc3RhdGVDaGFpbi5pc0FwcGxpY2FibGUodGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcylcblxuXHRyZXR1cm4gc2hhcmVkU3RhdGVzXG5cblxuUXVpY2tFbGVtZW50OjpfcmVzb2x2ZUZuU3R5bGVzID0gKHN0YXRlcywgaW5jbHVkZUJhc2UpLT5cblx0c3RhdGVzID0gWydiYXNlJ10uY29uY2F0KHN0YXRlcykgaWYgaW5jbHVkZUJhc2Vcblx0b3V0cHV0ID0ge31cblx0XG5cdGZvciBzdGF0ZSBpbiBzdGF0ZXMgd2hlbiBAX3N0eWxlc1tzdGF0ZV0gYW5kIEBfc3R5bGVzW3N0YXRlXS5mbnMubGVuZ3RoXG5cdFx0b3V0cHV0W2VudHJ5WzBdXSA9IGVudHJ5WzFdIGZvciBlbnRyeSBpbiBAX3N0eWxlc1tzdGF0ZV0uZm5zXG5cblx0cmV0dXJuIG91dHB1dFxuXG5cblxuXG5cblxuXG5cblxuIiwiIyMjKlxuICogU2V0cy9nZXRzIHRoZSB2YWx1ZSBvZiBhIHN0eWxlIHByb3BlcnR5LiBJbiBnZXR0ZXIgbW9kZSB0aGUgY29tcHV0ZWQgcHJvcGVydHkgb2ZcbiAqIHRoZSBzdHlsZSB3aWxsIGJlIHJldHVybmVkIHVubGVzcyB0aGUgZWxlbWVudCBpcyBub3QgaW5zZXJ0ZWQgaW50byB0aGUgRE9NLiBJblxuICogd2Via2l0IGJyb3dzZXJzIGFsbCBjb21wdXRlZCBwcm9wZXJ0aWVzIG9mIGEgZGV0YWNoZWQgbm9kZSBhcmUgYWx3YXlzIGFuIGVtcHR5XG4gKiBzdHJpbmcgYnV0IGluIGdlY2tvIHRoZXkgcmVmbGVjdCBvbiB0aGUgYWN0dWFsIGNvbXB1dGVkIHZhbHVlLCBoZW5jZSB3ZSBuZWVkXG4gKiB0byBcIm5vcm1hbGl6ZVwiIHRoaXMgYmVoYXZpb3IgYW5kIG1ha2Ugc3VyZSB0aGF0IGV2ZW4gb24gZ2Vja28gYW4gZW1wdHkgc3RyaW5nXG4gKiBpcyByZXR1cm5lZFxuICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4jIyNcblF1aWNrRWxlbWVudDo6c3R5bGUgPSAocHJvcGVydHkpLT5cblx0cmV0dXJuIGlmIEB0eXBlIGlzICd0ZXh0J1xuXHRhcmdzID0gYXJndW1lbnRzXG5cdFxuXHRpZiBJUy5zdHJpbmcocHJvcGVydHkpXG5cdFx0dmFsdWUgPSBpZiB0eXBlb2YgYXJnc1sxXSBpcyAnZnVuY3Rpb24nIHRoZW4gYXJnc1sxXS5jYWxsKEAsIEByZWxhdGVkKSBlbHNlIGFyZ3NbMV1cblx0XHR2YWx1ZSA9IENTUy5VTlNFVCBpZiBhcmdzWzFdIGlzIG51bGwgYW5kIElTLmRlZmluZWQoQGN1cnJlbnRTdGF0ZVN0eWxlKHByb3BlcnR5KSkgYW5kIG5vdCBJUy5mdW5jdGlvbihAY3VycmVudFN0YXRlU3R5bGUocHJvcGVydHkpKVxuXG5cdFx0aWYgdmFsdWUgYW5kIHR5cGVvZiB2YWx1ZS50aGVuIGlzICdmdW5jdGlvbidcblx0XHRcdHZhbHVlLnRoZW4gKHZhbHVlKT0+IENTUyhAZWwsIHByb3BlcnR5LCB2YWx1ZSwgQG9wdGlvbnMuZm9yY2VTdHlsZSlcblx0XHRlbHNlXG5cdFx0XHRyZXN1bHQgPSBDU1MoQGVsLCBwcm9wZXJ0eSwgdmFsdWUsIEBvcHRpb25zLmZvcmNlU3R5bGUpXG5cdFx0XG5cdFx0aWYgYXJncy5sZW5ndGggaXMgMVxuXHRcdFx0IyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuXHRcdFx0cmV0dXJuIGlmIEBfaW5zZXJ0ZWQgdGhlbiByZXN1bHQgZWxzZSBpZiBub3QgcmVzdWx0IHRoZW4gcmVzdWx0IGVsc2UgJydcblxuXHRlbHNlIGlmIElTLm9iamVjdChwcm9wZXJ0eSlcblx0XHRrZXlzID0gT2JqZWN0LmtleXMocHJvcGVydHkpOyBpID0gLTFcblx0XHRAc3R5bGUoa2V5LCBwcm9wZXJ0eVtrZXldKSB3aGlsZSBrZXk9a2V5c1srK2ldXG5cblx0cmV0dXJuIEBcblxuXG4jIyMqXG4gKiBBdHRlbXB0cyB0byByZXNvbHZlIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBwcm9wZXJ0eSBpbiB0aGUgZm9sbG93aW5nIG9yZGVyIGlmIGVhY2ggb25lIGlzbid0IGEgdmFsaWQgdmFsdWU6XG4gKiAxLiBmcm9tIGNvbXB1dGVkIHN0eWxlIChmb3IgZG9tLWluc2VydGVkIGVscylcbiAqIDIuIGZyb20gRE9NRWxlbWVudC5zdHlsZSBvYmplY3QgKGZvciBub24taW5zZXJ0ZWQgZWxzOyBpZiBvcHRpb25zLnN0eWxlQWZ0ZXJJbnNlcnQsIHdpbGwgb25seSBoYXZlIHN0YXRlIHN0eWxlcylcbiAqIDMuIGZyb20gcHJvdmlkZWQgc3R5bGUgb3B0aW9uc1xuICogKGZvciBub24taW5zZXJ0ZWQgZWxzOyBjaGVja2luZyBvbmx5ICRiYXNlIHNpbmNlIHN0YXRlIHN0eWxlcyB3aWxsIGFsd2F5cyBiZSBhcHBsaWVkIHRvIHRoZSBzdHlsZSBvYmplY3QgZXZlbiBmb3Igbm9uLWluc2VydGVkKVxuIyMjXG5RdWlja0VsZW1lbnQ6OnN0eWxlU2FmZSA9IChwcm9wZXJ0eSwgc2tpcENvbXB1dGVkKS0+XG5cdHJldHVybiBpZiBAdHlwZSBpcyAndGV4dCdcblx0c2FtcGxlID0gQGVsLnN0eWxlW3Byb3BlcnR5XVxuXG5cdGlmIElTLnN0cmluZyhzYW1wbGUpIG9yIElTLm51bWJlcihzYW1wbGUpXG5cdFx0Y29tcHV0ZWQgPSBpZiBza2lwQ29tcHV0ZWQgdGhlbiAwIGVsc2UgQHN0eWxlKHByb3BlcnR5KVxuXHRcdHJlc3VsdCA9IGNvbXB1dGVkIG9yIEBlbC5zdHlsZVtwcm9wZXJ0eV0gb3IgQGN1cnJlbnRTdGF0ZVN0eWxlKHByb3BlcnR5KSBvciAnJ1xuXHRcdHJldHVybiBpZiB0eXBlb2YgcmVzdWx0IGlzICdmdW5jdGlvbicgdGhlbiByZXN1bHQuY2FsbChALCBAcmVsYXRlZCkgZWxzZSByZXN1bHRcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6c3R5bGVQYXJzZWQgPSAocHJvcGVydHksIHNraXBDb21wdXRlZCktPlxuXHRwYXJzZUZsb2F0IEBzdHlsZVNhZmUocHJvcGVydHksIHNraXBDb21wdXRlZClcblxuXG5RdWlja0VsZW1lbnQ6OnJlY2FsY1N0eWxlID0gKHJlY2FsY0NoaWxkcmVuKS0+XG5cdHRhcmdldFN0eWxlcyA9IEBfcmVzb2x2ZUZuU3R5bGVzKEBfZ2V0QWN0aXZlU3RhdGVzKCksIHRydWUpXG5cblx0QHN0eWxlKHRhcmdldFN0eWxlcylcblx0XG5cdGlmIHJlY2FsY0NoaWxkcmVuXG5cdFx0Y2hpbGQucmVjYWxjU3R5bGUoKSBmb3IgY2hpbGQgaW4gQF9jaGlsZHJlblxuXHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OmN1cnJlbnRTdGF0ZVN0eWxlID0gKHByb3BlcnR5KS0+IGlmIHByb3BlcnR5XG5cdGlmIEBfc3RhdGUubGVuZ3RoXG5cdFx0c3RhdGVzID0gQF9zdGF0ZS5zbGljZSgpXG5cdFx0c3RhdGVzLnB1c2goQF9zdGF0ZVNoYXJlZC4uLikgaWYgQF9zdGF0ZVNoYXJlZCBhbmQgQF9zdGF0ZVNoYXJlZC5sZW5ndGhcblx0XHRpID0gc3RhdGVzLmxlbmd0aFxuXHRcdHdoaWxlIHN0YXRlID0gc3RhdGVzWy0taV1cblx0XHRcdHJldHVybiBAX3N0eWxlc1tzdGF0ZV0ucnVsZVtwcm9wZXJ0eV0gaWYgQF9zdHlsZXNbc3RhdGVdIGFuZCBJUy5kZWZpbmVkKEBfc3R5bGVzW3N0YXRlXS5ydWxlW3Byb3BlcnR5XSlcblxuXHRyZXR1cm4gQF9zdHlsZXMuYmFzZS5ydWxlW3Byb3BlcnR5XSBpZiBAX3N0eWxlcy5iYXNlXG5cblxuUXVpY2tFbGVtZW50OjpoaWRlID0gKCktPlxuXHRAc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcblxuXG5RdWlja0VsZW1lbnQ6OnNob3cgPSAoZGlzcGxheSktPlxuXHRpZiBub3QgZGlzcGxheVxuXHRcdGRpc3BsYXkgPSBAY3VycmVudFN0YXRlU3R5bGUoJ2Rpc3BsYXknKVxuXHRcdGRpc3BsYXkgPSAnYmxvY2snIGlmIGRpc3BsYXkgaXMgJ25vbmUnIG9yIG5vdCBkaXNwbGF5XG5cdFxuXHRkaXNwbGF5ID89IEBfc3R5bGVzLmJhc2U/LmRpc3BsYXkgb3IgJ2Jsb2NrJ1xuXHRAc3R5bGUgJ2Rpc3BsYXknLCBkaXNwbGF5XG5cblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBRdWlja0VsZW1lbnQ6Oixcblx0J29yaWVudGF0aW9uJzogb3JpZW50YXRpb25HZXR0ZXIgPSBnZXQ6ICgpLT4gaWYgQHdpZHRoID4gQGhlaWdodCB0aGVuICdsYW5kc2NhcGUnIGVsc2UgJ3BvcnRyYWl0J1xuXHQnYXNwZWN0UmF0aW8nOiBhc3BlY3RSYXRpb0dldHRlciA9IGdldDogKCktPiBAd2lkdGgvQGhlaWdodFxuXHQncmVjdCc6IGdldDogKCktPiBAZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0J3dpZHRoJzpcblx0XHRnZXQ6ICgpLT4gcGFyc2VGbG9hdCBAc3R5bGUoJ3dpZHRoJylcblx0XHRzZXQ6ICh2YWx1ZSktPiBAc3R5bGUgJ3dpZHRoJywgdmFsdWVcblx0J2hlaWdodCc6XG5cdFx0Z2V0OiAoKS0+IHBhcnNlRmxvYXQgQHN0eWxlKCdoZWlnaHQnKVxuXHRcdHNldDogKHZhbHVlKS0+IEBzdHlsZSAnaGVpZ2h0JywgdmFsdWVcblxuXG4iLCJRdWlja0VsZW1lbnQ6OmF0dHIgPSAodGFyZ2V0LCBuZXdWYWx1ZSktPlxuXHRpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDFcblx0XHRpZiB0eXBlb2YgdGFyZ2V0IGlzICdzdHJpbmcnXG5cdFx0XHRyZXR1cm4gQGVsLmdldEF0dHJpYnV0ZSh0YXJnZXQpXG5cdFxuXHRcdGlmIElTLm9iamVjdCh0YXJnZXQpXG5cdFx0XHRrZXlzID0gT2JqZWN0LmtleXModGFyZ2V0KTsgaSA9IC0xXG5cdFx0XHRAYXR0cihrZXksIHRhcmdldFtrZXldKSB3aGlsZSBrZXk9a2V5c1srK2ldXG5cblx0ZWxzZSBpZiBuZXdWYWx1ZSBpcyBudWxsXG5cdFx0cmV0dXJuIEBlbC5yZW1vdmVBdHRyaWJ1dGUodGFyZ2V0KVxuXG5cdGVsc2Vcblx0XHRAZWwuc2V0QXR0cmlidXRlKHRhcmdldCwgbmV3VmFsdWUpXG5cdFxuXHRyZXR1cm4gQFxuXG5cblxuUXVpY2tFbGVtZW50Ojpwcm9wID0gKHRhcmdldCwgbmV3VmFsdWUpLT5cblx0aWYgYXJndW1lbnRzLmxlbmd0aCBpcyAxXG5cdFx0aWYgdHlwZW9mIHRhcmdldCBpcyAnc3RyaW5nJ1xuXHRcdFx0cmV0dXJuIEBlbFt0YXJnZXRdXG5cdFxuXHRcdGlmIElTLm9iamVjdCh0YXJnZXQpXG5cdFx0XHRrZXlzID0gT2JqZWN0LmtleXModGFyZ2V0KTsgaSA9IC0xXG5cdFx0XHRAcHJvcChrZXksIHRhcmdldFtrZXldKSB3aGlsZSBrZXk9a2V5c1srK2ldXG5cdFxuXHRlbHNlXG5cdFx0QGVsW3RhcmdldF0gPSBuZXdWYWx1ZVxuXHRcdFxuXHRyZXR1cm4gQCIsIlF1aWNrRWxlbWVudDo6dG9UZW1wbGF0ZSA9ICgpLT5cblx0UXVpY2tEb20udGVtcGxhdGUoQClcblxuXG5RdWlja0VsZW1lbnQ6OmNsb25lID0gKCktPlxuXHRlbENsb25lID0gQGVsLmNsb25lTm9kZShmYWxzZSlcblx0b3B0aW9ucyA9IGV4dGVuZC5jbG9uZShAb3B0aW9ucywge2V4aXN0aW5nOmVsQ2xvbmV9KVxuXHRcblx0bmV3RWwgPSBuZXcgUXVpY2tFbGVtZW50KEB0eXBlLCBvcHRpb25zKVxuXHRuZXdFbC5zdGF0ZShhY3RpdmVTdGF0ZSwgb24pIGZvciBhY3RpdmVTdGF0ZSBpbiBAX3N0YXRlXG5cdG5ld0VsLmFwcGVuZChjaGlsZC5jbG9uZSgpKSBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG5cdGZvciBldmVudE5hbWUsIGNhbGxiYWNrcyBvZiBAX2V2ZW50Q2FsbGJhY2tzXG5cdFx0bmV3RWwub24oZXZlbnROYW1lLCBjYWxsYmFjaykgZm9yIGNhbGxiYWNrIGluIGNhbGxiYWNrc1xuXHRcblx0cmV0dXJuIG5ld0VsXG5cblxuUXVpY2tFbGVtZW50OjphcHBlbmQgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblx0XHRcblx0XHRpZiBJUy5xdWlja0RvbUVsKHRhcmdldEVsKVxuXHRcdFx0cHJldlBhcmVudCA9IHRhcmdldEVsLnBhcmVudFxuXHRcdFx0cHJldlBhcmVudC5fcmVtb3ZlQ2hpbGQodGFyZ2V0RWwpIGlmIHByZXZQYXJlbnRcblx0XHRcdEBfY2hpbGRyZW4ucHVzaCh0YXJnZXRFbClcblx0XHRcdEBlbC5hcHBlbmRDaGlsZCh0YXJnZXRFbC5lbClcblx0XHRcdHRhcmdldEVsLl9yZWZyZXNoUGFyZW50KCkgIyBGb3JjZSByZS1mcmVzaCB0YXJnZXRFbC5fcGFyZW50IHZhbHVlIHRvIHRyaWdnZXIgaW5zZXJ0ZWQgY2FsbGJhY2tcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6YXBwZW5kVG8gPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblx0XHRcblx0XHRpZiBJUy5xdWlja0RvbUVsKHRhcmdldEVsKVxuXHRcdFx0dGFyZ2V0RWwuYXBwZW5kKEApXG5cdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6cHJlcGVuZCA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXHRcdFxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHRwcmV2UGFyZW50ID0gdGFyZ2V0RWwucGFyZW50XG5cdFx0XHRwcmV2UGFyZW50Ll9yZW1vdmVDaGlsZCh0YXJnZXRFbCkgaWYgcHJldlBhcmVudFxuXHRcdFx0QF9jaGlsZHJlbi51bnNoaWZ0KHRhcmdldEVsKVxuXHRcdFx0QGVsLmluc2VydEJlZm9yZSh0YXJnZXRFbC5lbCwgQGVsLmZpcnN0Q2hpbGQpXG5cdFx0XHR0YXJnZXRFbC5fcmVmcmVzaFBhcmVudCgpICMgRm9yY2UgcmUtZnJlc2ggdGFyZ2V0RWwuX3BhcmVudCB2YWx1ZSB0byB0cmlnZ2VyIGluc2VydGVkIGNhbGxiYWNrXG5cdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6cHJlcGVuZFRvID0gKHRhcmdldEVsKS0+XG5cdGlmIHRhcmdldEVsXG5cdFx0dGFyZ2V0RWwgPSBoZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwodGFyZ2V0RWwpXG5cdFx0XG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbClcblx0XHRcdHRhcmdldEVsLnByZXBlbmQoQClcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6YWZ0ZXIgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWwgYW5kIEBwYXJlbnRcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHRteUluZGV4ID0gQHBhcmVudC5fY2hpbGRyZW4uaW5kZXhPZihAKVxuXHRcdFx0QHBhcmVudC5fY2hpbGRyZW4uc3BsaWNlKG15SW5kZXgrMSwgMCwgdGFyZ2V0RWwpXG5cdFx0XHRAZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGFyZ2V0RWwuZWwsIEBlbC5uZXh0U2libGluZylcblx0XHRcdHRhcmdldEVsLl9yZWZyZXNoUGFyZW50KCkgIyBGb3JjZSByZS1mcmVzaCB0YXJnZXRFbC5fcGFyZW50IHZhbHVlIHRvIHRyaWdnZXIgaW5zZXJ0ZWQgY2FsbGJhY2tcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6aW5zZXJ0QWZ0ZXIgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblx0XHRcblx0XHRpZiBJUy5xdWlja0RvbUVsKHRhcmdldEVsKVxuXHRcdFx0dGFyZ2V0RWwuYWZ0ZXIoQClcblx0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpiZWZvcmUgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWwgYW5kIEBwYXJlbnRcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHRteUluZGV4ID0gQHBhcmVudC5fY2hpbGRyZW4uaW5kZXhPZihAKVxuXHRcdFx0QHBhcmVudC5fY2hpbGRyZW4uc3BsaWNlKG15SW5kZXgsIDAsIHRhcmdldEVsKVxuXHRcdFx0QGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRhcmdldEVsLmVsLCBAZWwpXG5cdFx0XHR0YXJnZXRFbC5fcmVmcmVzaFBhcmVudCgpICMgRm9yY2UgcmUtZnJlc2ggdGFyZ2V0RWwuX3BhcmVudCB2YWx1ZSB0byB0cmlnZ2VyIGluc2VydGVkIGNhbGxiYWNrXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6Omluc2VydEJlZm9yZSA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXHRcdFxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHR0YXJnZXRFbC5iZWZvcmUoQClcblx0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpkZXRhY2ggPSAoKS0+XG5cdEBwYXJlbnQ/Ll9yZW1vdmVDaGlsZChAKVxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6cmVtb3ZlID0gKCktPlxuXHRAZGV0YWNoKClcblx0QHJlc2V0U3RhdGUoKVxuXHRpZiBAX2V2ZW50Q2FsbGJhY2tzXG5cdFx0QF9ldmVudENhbGxiYWNrc1tldmVudE5hbWVdLmxlbmd0aCA9IDAgZm9yIGV2ZW50TmFtZSBvZiBAX2V2ZW50Q2FsbGJhY2tzXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjplbXB0eSA9ICgpLT5cblx0QF9yZW1vdmVDaGlsZChjaGlsZCkgZm9yIGNoaWxkIGluIEBjaGlsZHJlbi5zbGljZSgpXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50Ojp3cmFwID0gKHRhcmdldEVsKS0+XG5cdGlmIHRhcmdldEVsXG5cdFx0dGFyZ2V0RWwgPSBoZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwodGFyZ2V0RWwpXG5cdFx0Y3VycmVudFBhcmVudCA9IEBwYXJlbnRcblxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpIGFuZCB0YXJnZXRFbCBpc250IEAgYW5kIHRhcmdldEVsIGlzbnQgQHBhcmVudFxuXHRcdFx0aWYgY3VycmVudFBhcmVudFxuXHRcdFx0XHRjdXJyZW50UGFyZW50Ll9yZW1vdmVDaGlsZChALCBpZiBub3QgdGFyZ2V0RWwucGFyZW50IHRoZW4gdGFyZ2V0RWwpXG5cdFx0XHRcblx0XHRcdHRhcmdldEVsLmFwcGVuZChAKVxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50Ojp1bndyYXAgPSAoKS0+XG5cdHBhcmVudCA9IEBwYXJlbnRcblx0aWYgcGFyZW50XG5cdFx0cGFyZW50Q2hpbGRyZW4gPSBRdWlja0RvbS5iYXRjaChwYXJlbnQuY2hpbGRyZW4pXG5cdFx0cGFyZW50U2libGluZyA9IHBhcmVudC5uZXh0XG5cdFx0Z3JhbmRQYXJlbnQgPSBwYXJlbnQucGFyZW50XG5cdFx0aWYgZ3JhbmRQYXJlbnRcblx0XHRcdHBhcmVudC5kZXRhY2goKVxuXG5cdFx0XHRpZiBwYXJlbnRTaWJsaW5nXG5cdFx0XHRcdHBhcmVudENoaWxkcmVuLmluc2VydEJlZm9yZShwYXJlbnRTaWJsaW5nKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwYXJlbnRDaGlsZHJlbi5hcHBlbmRUbyhncmFuZFBhcmVudClcblx0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpyZXBsYWNlID0gKHRhcmdldEVsKS0+XG5cdGlmIHRhcmdldEVsXG5cdFx0dGFyZ2V0RWwgPSBoZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwodGFyZ2V0RWwpXG5cdFxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpIGFuZCB0YXJnZXRFbCBpc250IEBcblx0XHRcdHRhcmdldEVsLmRldGFjaCgpXG5cdFx0XHRAcGFyZW50Py5fcmVtb3ZlQ2hpbGQoQCwgdGFyZ2V0RWwpXG5cdFx0XHR0YXJnZXRFbC5fcmVmcmVzaFBhcmVudCgpICMgRm9yY2UgcmUtZnJlc2ggdGFyZ2V0RWwuX3BhcmVudCB2YWx1ZSB0byB0cmlnZ2VyIGluc2VydGVkIGNhbGxiYWNrXG5cdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6aGFzQ2xhc3MgPSAodGFyZ2V0KS0+XG5cdGhlbHBlcnMuaW5jbHVkZXMoQGNsYXNzTGlzdCwgdGFyZ2V0KVxuXG5cblF1aWNrRWxlbWVudDo6YWRkQ2xhc3MgPSAodGFyZ2V0KS0+XG5cdGNsYXNzTGlzdCA9IEBjbGFzc0xpc3Rcblx0dGFyZ2V0SW5kZXggPSBjbGFzc0xpc3QuaW5kZXhPZih0YXJnZXQpXG5cblx0aWYgdGFyZ2V0SW5kZXggaXMgLTFcblx0XHRjbGFzc0xpc3QucHVzaCh0YXJnZXQpXG5cdFx0QGNsYXNzTmFtZSA9IGlmIGNsYXNzTGlzdC5sZW5ndGggPiAxIHRoZW4gY2xhc3NMaXN0LmpvaW4oJyAnKSBlbHNlIGNsYXNzTGlzdFswXVxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpyZW1vdmVDbGFzcyA9ICh0YXJnZXQpLT5cblx0Y2xhc3NMaXN0ID0gQGNsYXNzTGlzdFxuXHR0YXJnZXRJbmRleCA9IGNsYXNzTGlzdC5pbmRleE9mKHRhcmdldClcblx0XG5cdGlmIHRhcmdldEluZGV4IGlzbnQgLTFcblx0XHRjbGFzc0xpc3Quc3BsaWNlKHRhcmdldEluZGV4LCAxKVxuXHRcdEBjbGFzc05hbWUgPSBpZiBjbGFzc0xpc3QubGVuZ3RoIHRoZW4gY2xhc3NMaXN0LmpvaW4oJyAnKSBlbHNlICcnXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnRvZ2dsZUNsYXNzID0gKHRhcmdldCktPlxuXHRpZiBAaGFzQ2xhc3ModGFyZ2V0KVxuXHRcdEByZW1vdmVDbGFzcyh0YXJnZXQpXG5cdGVsc2Vcblx0XHRAYWRkQ2xhc3ModGFyZ2V0KVxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpzZXRSZWYgPSAodGFyZ2V0KS0+XG5cdEByZWYgPSBAb3B0aW9ucy5yZWYgPSB0YXJnZXRcblx0QGF0dHIgJ2RhdGEtcmVmJywgdGFyZ2V0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpfcmVmcmVzaFBhcmVudCA9ICgpLT5cblx0QHBhcmVudFxuXG5cblF1aWNrRWxlbWVudDo6X3JlbW92ZUNoaWxkID0gKHRhcmdldENoaWxkLCByZXBsYWNlbWVudENoaWxkKS0+XG5cdGluZGV4T2ZDaGlsZCA9IEBjaGlsZHJlbi5pbmRleE9mKHRhcmdldENoaWxkKVxuXHRpZiBpbmRleE9mQ2hpbGQgaXNudCAtMVxuXHRcdGlmIHJlcGxhY2VtZW50Q2hpbGRcblx0XHRcdEBlbC5yZXBsYWNlQ2hpbGQocmVwbGFjZW1lbnRDaGlsZC5lbCwgdGFyZ2V0Q2hpbGQuZWwpXG5cdFx0XHRAX2NoaWxkcmVuLnNwbGljZShpbmRleE9mQ2hpbGQsIDEsIHJlcGxhY2VtZW50Q2hpbGQpXG5cdFx0ZWxzZVxuXHRcdFx0QGVsLnJlbW92ZUNoaWxkKHRhcmdldENoaWxkLmVsKVxuXHRcdFx0QF9jaGlsZHJlbi5zcGxpY2UoaW5kZXhPZkNoaWxkLCAxKVxuXHRcdFxuXG5cdHJldHVybiBAXG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgUXVpY2tFbGVtZW50OjosXG5cdCdodG1sJzpcblx0XHRnZXQ6ICgpLT4gQGVsLmlubmVySFRNTFxuXHRcdHNldDogKG5ld1ZhbHVlKS0+IEBlbC5pbm5lckhUTUwgPSBuZXdWYWx1ZVxuXHRcblx0J3RleHQnOlxuXHRcdGdldDogKCktPiBAZWwudGV4dENvbnRlbnRcblx0XHRzZXQ6IChuZXdWYWx1ZSktPiBAZWwudGV4dENvbnRlbnQgPSBuZXdWYWx1ZVxuXG5cdCdjbGFzc05hbWUnOlxuXHRcdGdldDogKCktPiBpZiBAc3ZnIHRoZW4gKEBhdHRyKCdjbGFzcycpIG9yICcnKSBlbHNlIEByYXcuY2xhc3NOYW1lXG5cdFx0c2V0OiAobmV3VmFsdWUpLT4gaWYgQHN2ZyB0aGVuIEBhdHRyKCdjbGFzcycsIG5ld1ZhbHVlKSBlbHNlIEByYXcuY2xhc3NOYW1lID0gbmV3VmFsdWVcblxuXHQnY2xhc3NMaXN0Jzpcblx0XHRnZXQ6ICgpLT5cblx0XHRcdGxpc3QgPSBAY2xhc3NOYW1lLnNwbGl0KC9cXHMrLylcblx0XHRcdGxpc3QucG9wKCkgaWYgbGlzdFtsaXN0Lmxlbmd0aC0xXSBpcyAnJ1xuXHRcdFx0bGlzdC5zaGlmdCgpIGlmIGxpc3RbMF0gaXMgJydcblx0XHRcdHJldHVybiBsaXN0XG5cblxuXG5cblxuXG5cbiIsIlF1aWNrRWxlbWVudDo6dXBkYXRlT3B0aW9ucyA9IChvcHRpb25zKS0+XG5cdGlmIElTLm9iamVjdChvcHRpb25zKSBcblx0XHRAb3B0aW9ucyA9IG9wdGlvbnNcblx0XHRAX25vcm1hbGl6ZU9wdGlvbnMoKVxuXHRcdEBfYXBwbHlPcHRpb25zKEBvcHRpb25zKVxuXHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnVwZGF0ZVN0YXRlU3R5bGVzID0gKHN0eWxlcyktPlxuXHRpZiBJUy5vYmplY3RQbGFpbihzdHlsZXMpXG5cdFx0ZXh0ZW5kLmRlZXAuY29uY2F0IEAsIHBhcnNlZCA9IEBfcGFyc2VTdHlsZXMoc3R5bGVzKVxuXG5cdFx0aWYgcGFyc2VkLl9zdHlsZXNcblx0XHRcdHVwZGF0ZWRTdGF0ZXMgPSBPYmplY3Qua2V5cyhwYXJzZWQuX3N0eWxlcylcblx0XHRcdFxuXHRcdFx0Zm9yIHN0YXRlIGluIHVwZGF0ZWRTdGF0ZXMgd2hlbiBAc3RhdGUoc3RhdGUpIG9yIHN0YXRlIGlzICdiYXNlJ1xuXHRcdFx0XHRAX2FwcGx5UmVnaXN0ZXJlZFN0eWxlKEBfc3R5bGVzW3N0YXRlXSwgQF9nZXRBY3RpdmVTdGF0ZXMoc3RhdGUpLCBmYWxzZSlcblx0XHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnVwZGF0ZVN0YXRlVGV4dHMgPSAodGV4dHMpLT5cblx0aWYgSVMub2JqZWN0UGxhaW4odGV4dHMpXG5cdFx0ZXh0ZW5kLmRlZXAuY29uY2F0IEAsIHBhcnNlZCA9IEBfcGFyc2VUZXh0cyh0ZXh0cylcblx0XG5cdHJldHVybiBAXG5cblxuXG5RdWlja0VsZW1lbnQ6OmFwcGx5RGF0YSA9IChkYXRhLCBwYXNzVGhyb3VnaCktPlxuXHRpZiBAb3B0aW9ucy5wYXNzRGF0YVRvQ2hpbGRyZW4gYW5kIEBfY2hpbGRyZW4ubGVuZ3RoIGFuZCAocGFzc1Rocm91Z2ggPz0gdHJ1ZSlcblx0XHRjaGlsZC5hcHBseURhdGEoZGF0YSkgZm9yIGNoaWxkIGluIEBfY2hpbGRyZW5cblxuXHRpZiBjb21wdXRlcnMgPSBAb3B0aW9ucy5jb21wdXRlcnNcblx0XHRkZWZhdWx0cyA9IEBvcHRpb25zLmRlZmF1bHRzXG5cdFx0a2V5cyA9IE9iamVjdC5rZXlzKGNvbXB1dGVycylcblx0XHRcblx0XHRmb3Iga2V5IGluIGtleXNcblx0XHRcdGlmIEBvcHRpb25zLmludm9rZUNvbXB1dGVyc09uY2Vcblx0XHRcdFx0Y29udGludWUgaWYgQF9pbnZva2VkQ29tcHV0ZXJzW2tleV1cblx0XHRcdFx0QF9pbnZva2VkQ29tcHV0ZXJzW2tleV0gPSAxXG5cdFx0XHRcblx0XHRcdGlmIGRhdGEgYW5kIGRhdGEuaGFzT3duUHJvcGVydHkoa2V5KVxuXHRcdFx0XHRAX3J1bkNvbXB1dGVyKGtleSwgZGF0YVtrZXldLCBkYXRhKVxuXHRcdFx0XG5cdFx0XHRlbHNlIGlmIGRlZmF1bHRzIGFuZCBkZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShrZXkpXG5cdFx0XHRcdEBfcnVuQ29tcHV0ZXIoa2V5LCBkZWZhdWx0c1trZXldLCBkYXRhKVxuXHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6Ol9ydW5Db21wdXRlciA9IChjb21wdXRlciwgYXJnLCBkYXRhKS0+XG5cdEBvcHRpb25zLmNvbXB1dGVyc1tjb21wdXRlcl0uY2FsbChALCBhcmcsIGRhdGEpXG5cblxuXG5cblxuXG4iLCJRdWlja1dpbmRvdyA9IFxuXHR0eXBlOiAnd2luZG93J1xuXHRlbDogd2luZG93XG5cdHJhdzogd2luZG93XG5cdF9ldmVudENhbGxiYWNrczoge19fcmVmczp7fX1cblx0XG5cblF1aWNrV2luZG93Lm9uID0gIFF1aWNrRWxlbWVudDo6b25cblF1aWNrV2luZG93Lm9mZiA9ICBRdWlja0VsZW1lbnQ6Om9mZlxuUXVpY2tXaW5kb3cuZW1pdCA9ICBRdWlja0VsZW1lbnQ6OmVtaXRcblF1aWNrV2luZG93LmVtaXRQcml2YXRlID0gIFF1aWNrRWxlbWVudDo6ZW1pdFByaXZhdGVcblF1aWNrV2luZG93Ll9saXN0ZW5UbyA9ICBRdWlja0VsZW1lbnQ6Ol9saXN0ZW5Ub1xuUXVpY2tXaW5kb3cuX2ludm9rZUhhbmRsZXJzID0gIFF1aWNrRWxlbWVudDo6X2ludm9rZUhhbmRsZXJzXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBRdWlja1dpbmRvdyxcblx0J3dpZHRoJzogZ2V0OiAoKS0+IHdpbmRvdy5pbm5lcldpZHRoXG5cdCdoZWlnaHQnOiBnZXQ6ICgpLT4gd2luZG93LmlubmVySGVpZ2h0XG5cdCdvcmllbnRhdGlvbic6IG9yaWVudGF0aW9uR2V0dGVyXG5cdCdhc3BlY3RSYXRpbyc6IGFzcGVjdFJhdGlvR2V0dGVyXG5cbiIsIk1lZGlhUXVlcnkgPSBuZXcgKCktPlxuXHRjYWxsYmFja3MgPSBbXVxuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCAoKS0+XG5cdFx0Y2FsbGJhY2soKSBmb3IgY2FsbGJhY2sgaW4gY2FsbGJhY2tzXG5cdFx0cmV0dXJuXG5cblx0QHBhcnNlUXVlcnkgPSAodGFyZ2V0LCBxdWVyeVN0cmluZyktPlxuXHRcdHF1ZXJ5U3BsaXQgPSBxdWVyeVN0cmluZy5zcGxpdCgnKCcpXG5cdFx0c291cmNlID0gcXVlcnlTcGxpdFswXVxuXHRcdHNvdXJjZSA9IHN3aXRjaCBzb3VyY2Vcblx0XHRcdHdoZW4gJ3dpbmRvdycgdGhlbiBRdWlja1dpbmRvd1xuXHRcdFx0d2hlbiAncGFyZW50JyB0aGVuIHRhcmdldC5wYXJlbnRcblx0XHRcdHdoZW4gJ3NlbGYnIHRoZW4gdGFyZ2V0XG5cdFx0XHRlbHNlIHRhcmdldC5wYXJlbnRNYXRjaGluZyAocGFyZW50KS0+IHBhcmVudC5yZWYgaXMgc291cmNlLnNsaWNlKDEpXG5cblx0XHRydWxlcyA9IHF1ZXJ5U3BsaXRbMV1cblx0XHRcdC5zbGljZSgwLC0xKVxuXHRcdFx0LnNwbGl0KHJ1bGVEZWxpbWl0ZXIpXG5cdFx0XHQubWFwIChydWxlKS0+IFxuXHRcdFx0XHRzcGxpdCA9IHJ1bGUuc3BsaXQoJzonKVxuXHRcdFx0XHR2YWx1ZSA9IHBhcnNlRmxvYXQoc3BsaXRbMV0pXG5cdFx0XHRcdHZhbHVlID0gc3BsaXRbMV0gaWYgaXNOYU4odmFsdWUpXG5cdFx0XHRcdGtleSA9IHNwbGl0WzBdXG5cdFx0XHRcdGtleVByZWZpeCA9IGtleS5zbGljZSgwLDQpXG5cdFx0XHRcdG1heCA9IGtleVByZWZpeCBpcyAnbWF4LSdcblx0XHRcdFx0bWluID0gbm90IG1heCBhbmQga2V5UHJlZml4IGlzICdtaW4tJ1xuXHRcdFx0XHRrZXkgPSBrZXkuc2xpY2UoNCkgaWYgbWF4IG9yIG1pblxuXHRcdFx0XHRnZXR0ZXIgPSBzd2l0Y2gga2V5XG5cdFx0XHRcdFx0d2hlbiAnb3JpZW50YXRpb24nIHRoZW4gKCktPiBzb3VyY2Uub3JpZW50YXRpb25cblx0XHRcdFx0XHR3aGVuICdhc3BlY3QtcmF0aW8nIHRoZW4gKCktPiBzb3VyY2UuYXNwZWN0UmF0aW9cblx0XHRcdFx0XHR3aGVuICd3aWR0aCcsJ2hlaWdodCcgdGhlbiAoKS0+IHNvdXJjZVtrZXldXG5cdFx0XHRcdFx0ZWxzZSAoKS0+XG5cdFx0XHRcdFx0XHRzdHJpbmdWYWx1ZSA9IHNvdXJjZS5zdHlsZShrZXkpXG5cdFx0XHRcdFx0XHRwYXJzZWRWYWx1ZSA9IHBhcnNlRmxvYXQgc3RyaW5nVmFsdWVcblx0XHRcdFx0XHRcdHJldHVybiBpZiBpc05hTihwYXJzZWRWYWx1ZSkgdGhlbiBzdHJpbmdWYWx1ZSBlbHNlIHBhcnNlZFZhbHVlXG5cdFx0XHRcdFxuXHRcdFx0XHRyZXR1cm4ge2tleSx2YWx1ZSxtaW4sbWF4LGdldHRlcn1cblxuXHRcdHJldHVybiB7c291cmNlLCBydWxlc31cblxuXG5cdEByZWdpc3RlciA9ICh0YXJnZXQsIHF1ZXJ5U3RyaW5nKS0+XG5cdFx0cXVlcnkgPSBAcGFyc2VRdWVyeSh0YXJnZXQsIHF1ZXJ5U3RyaW5nKVxuXHRcdGlmIHF1ZXJ5LnNvdXJjZVxuXHRcdFx0Y2FsbGJhY2tzLnB1c2ggY2FsbGJhY2sgPSAoKS0+IHRlc3RSdWxlKHRhcmdldCwgcXVlcnksIHF1ZXJ5U3RyaW5nKVxuXHRcdFx0Y2FsbGJhY2soKVxuXHRcdHJldHVybiBxdWVyeVxuXG5cblx0dGVzdFJ1bGUgPSAodGFyZ2V0LCBxdWVyeSwgcXVlcnlTdHJpbmcpLT5cblx0XHRwYXNzZWQgPSB0cnVlXG5cblx0XHRmb3IgcnVsZSBpbiBxdWVyeS5ydWxlc1xuXHRcdFx0Y3VycmVudFZhbHVlID0gcnVsZS5nZXR0ZXIoKVxuXHRcdFx0cGFzc2VkID0gc3dpdGNoXG5cdFx0XHRcdHdoZW4gcnVsZS5taW4gdGhlbiBjdXJyZW50VmFsdWUgPj0gcnVsZS52YWx1ZVxuXHRcdFx0XHR3aGVuIHJ1bGUubWF4IHRoZW4gY3VycmVudFZhbHVlIDw9IHJ1bGUudmFsdWVcblx0XHRcdFx0ZWxzZSBjdXJyZW50VmFsdWUgaXMgcnVsZS52YWx1ZVxuXG5cdFx0XHRicmVhayBpZiBub3QgcGFzc2VkXHRcdFxuXHRcdFxuXHRcdHRhcmdldC5zdGF0ZShxdWVyeVN0cmluZywgcGFzc2VkKVxuXG5cdHJldHVybiBAXG5cblxuXG5cbnJ1bGVEZWxpbWl0ZXIgPSAvLFxccyovXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJjbGFzcyBRdWlja0JhdGNoXG5cdGNvbnN0cnVjdG9yOiAoZWxlbWVudHMsIEByZXR1cm5SZXN1bHRzKS0+XG5cdFx0QGVsZW1lbnRzID0gZWxlbWVudHMubWFwIChlbCktPiBRdWlja0RvbShlbClcblxuXHRyZXZlcnNlOiAoKS0+XG5cdFx0QGVsZW1lbnRzID0gQGVsZW1lbnRzLnJldmVyc2UoKVxuXHRcdHJldHVybiBAXG5cblx0cmV0dXJuOiAocmV0dXJuTmV4dCktPlxuXHRcdGlmIHJldHVybk5leHRcblx0XHRcdEByZXR1cm5SZXN1bHRzID0gdHJ1ZVxuXHRcdFx0cmV0dXJuIEBcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gQGxhc3RSZXN1bHRzXG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrQmF0Y2gubmFtZSA/PSAnUXVpY2tCYXRjaCdcblxuXG5cbk9iamVjdC5rZXlzKFF1aWNrRWxlbWVudDo6KS5jb25jYXQoJ2NzcycsICdyZXBsYWNlV2l0aCcsICdodG1sJywgJ3RleHQnKS5mb3JFYWNoIChtZXRob2QpLT5cblx0UXVpY2tCYXRjaDo6W21ldGhvZF0gPSAobmV3VmFsdWUpLT5cblx0XHRyZXN1bHRzID0gQGxhc3RSZXN1bHRzID0gZm9yIGVsZW1lbnQgaW4gQGVsZW1lbnRzXG5cdFx0XHRpZiBtZXRob2QgaXMgJ2h0bWwnIG9yIG1ldGhvZCBpcyAndGV4dCdcblx0XHRcdFx0aWYgbmV3VmFsdWUgdGhlbiBlbGVtZW50W21ldGhvZF0gPSBuZXdWYWx1ZSBlbHNlIGVsZW1lbnRbbWV0aG9kXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRlbGVtZW50W21ldGhvZF0oYXJndW1lbnRzLi4uKVxuXHRcdFxuXHRcdHJldHVybiBpZiBAcmV0dXJuUmVzdWx0cyB0aGVuIHJlc3VsdHMgZWxzZSBAXG5cblxuUXVpY2tEb20uYmF0Y2ggPSAoZWxlbWVudHMsIHJldHVyblJlc3VsdHMpLT5cblx0aWYgbm90IElTLml0ZXJhYmxlKGVsZW1lbnRzKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhdGNoOiBleHBlY3RlZCBhbiBpdGVyYWJsZSwgZ290ICN7U3RyaW5nKGVsZW1lbnRzKX1cIilcblx0ZWxzZSBpZiBub3QgZWxlbWVudHMubGVuZ3RoXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmF0Y2g6IGV4cGVjdGVkIGEgbm9uLWVtcHR5IGVsZW1lbnQgY29sbGVjdGlvblwiKVxuXG5cdHJldHVybiBuZXcgUXVpY2tCYXRjaChlbGVtZW50cywgcmV0dXJuUmVzdWx0cylcblxuXG4iLCJpbXBvcnQgJy4vZXh0ZW5kVGVtcGxhdGUnXG5pbXBvcnQgJy4vcGFyc2VUcmVlJ1xuaW1wb3J0ICcuL3NjaGVtYSdcblxuY2xhc3MgUXVpY2tUZW1wbGF0ZVxuXHRjb25zdHJ1Y3RvcjogKGNvbmZpZywgaXNUcmVlKS0+XG5cdFx0cmV0dXJuIGNvbmZpZyBpZiBJUy50ZW1wbGF0ZShjb25maWcpXG5cdFx0Y29uZmlnID0gaWYgaXNUcmVlIHRoZW4gcGFyc2VUcmVlKGNvbmZpZykgZWxzZSBjb25maWdcblx0XHRleHRlbmQgQCwgY29uZmlnXG5cdFxuXHRleHRlbmQ6IChuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpLT5cblx0XHRuZXcgUXVpY2tUZW1wbGF0ZSBleHRlbmRUZW1wbGF0ZShALCBuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpXG5cblx0c3Bhd246IChuZXdWYWx1ZXMsIGdsb2JhbE9wdHMsIGRhdGEpLT5cblx0XHRpZiBuZXdWYWx1ZXMgYW5kIG5ld1ZhbHVlcy5kYXRhXG5cdFx0XHRkYXRhID0gbmV3VmFsdWVzLmRhdGFcblx0XHRcdG5ld1ZhbHVlcyA9IG51bGwgaWYgT2JqZWN0LmtleXMobmV3VmFsdWVzKS5sZW5ndGggaXMgMVxuXHRcdFxuXHRcdGlmIG5ld1ZhbHVlcyBvciBnbG9iYWxPcHRzXG5cdFx0XHR7b3B0aW9ucywgY2hpbGRyZW4sIHR5cGV9ID0gZXh0ZW5kVGVtcGxhdGUoQCwgbmV3VmFsdWVzLCBnbG9iYWxPcHRzKVxuXHRcdGVsc2Vcblx0XHRcdHtvcHRpb25zLCBjaGlsZHJlbiwgdHlwZX0gPSBAXG5cdFx0XHRvcHRpb25zID0gZXh0ZW5kLmNsb25lKG9wdGlvbnMpXG5cblx0XHRcblx0XHRlbGVtZW50ID0gUXVpY2tEb20uY3JlYXRlKFt0eXBlLCBvcHRpb25zXSlcblx0XHRcblx0XHRpZiBjaGlsZHJlblxuXHRcdFx0Y2hpbGREYXRhID0gaWYgb3B0aW9ucy5wYXNzRGF0YVRvQ2hpbGRyZW4gdGhlbiBkYXRhIG9yIG9wdGlvbnMuZGF0YVxuXHRcdFx0Zm9yIGNoaWxkIGluIGNoaWxkcmVuXG5cdFx0XHRcdGVsZW1lbnQuYXBwZW5kIGNoaWxkLnNwYXduKG51bGwsIG51bGwsIGNoaWxkRGF0YSlcblxuXHRcdGVsZW1lbnQuX3Bvc3RDcmVhdGlvbihkYXRhKVxuXHRcdHJldHVybiBlbGVtZW50XG5cblxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuUXVpY2tUZW1wbGF0ZS5uYW1lID89ICdRdWlja1RlbXBsYXRlJ1xuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBRdWlja1RlbXBsYXRlOjosICdjaGlsZCcsIGdldDogKCktPlxuXHRAX2NoaWxkUmVmcyBvciBfZ2V0Q2hpbGRSZWZzKEApICMgc291cmNlIGluIC9zcmMvcGFydHMvZWxlbWVudC90cmF2ZXJzaW5nLmNvZmZlZVxuXG5cblxuXG5cblxuXG5cbiIsIm5vdERlZXBLZXlzID0gWydyZWxhdGVkSW5zdGFuY2UnLCdyZWxhdGVkJywnZGF0YSddXG5ub3RLZXlzID0gWydjaGlsZHJlbicsJ19jaGlsZFJlZnMnXVxuXG5leHRlbmRUZW1wbGF0ZSA9IChjdXJyZW50T3B0cywgbmV3T3B0cywgZ2xvYmFsT3B0cyktPlxuXHRpZiBnbG9iYWxPcHRzIHRoZW4gZ2xvYmFsT3B0c1RyYW5zZm9ybSA9IG9wdGlvbnM6IChvcHRzKS0+IGV4dGVuZChvcHRzLCBnbG9iYWxPcHRzKVxuXHRpZiBJUy5hcnJheShuZXdPcHRzKVxuXHRcdG5ld09wdHMgPSBwYXJzZVRyZWUobmV3T3B0cywgZmFsc2UpXG5cdGVsc2UgaWYgbmV3T3B0cyBhbmQgbm90IG1hdGNoZXNTY2hlbWEobmV3T3B0cylcblx0XHRuZXdPcHRzID0gb3B0aW9uczpuZXdPcHRzXG5cblxuXHRvdXRwdXQgPSBleHRlbmQuZGVlcC5udWxsRGVsZXRlcy5ub3RLZXlzKG5vdEtleXMpLm5vdERlZXAobm90RGVlcEtleXMpLnRyYW5zZm9ybShnbG9iYWxPcHRzVHJhbnNmb3JtKS5jbG9uZShjdXJyZW50T3B0cywgbmV3T3B0cylcblx0Y3VycmVudENoaWxkcmVuID0gY3VycmVudE9wdHMuY2hpbGRyZW5cblx0bmV3Q2hpbGRyZW4gPSBuZXdPcHRzPy5jaGlsZHJlbiBvciBbXVxuXHRvdXRwdXQuY2hpbGRyZW4gPSBbXVxuXG5cdCMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblx0aWYgSVMuYXJyYXkobmV3Q2hpbGRyZW4pXG5cdFx0bWF4TGVuZ3RoID0gTWF0aC5tYXgoY3VycmVudENoaWxkcmVuLmxlbmd0aCwgbmV3Q2hpbGRyZW4ubGVuZ3RoKVxuXHRcdGluZGV4ID0gLTFcblx0XHR3aGlsZSArK2luZGV4IGlzbnQgbWF4TGVuZ3RoXG5cdFx0XHRuZWVkc1RlbXBsYXRlV3JhcCA9IG5vQ2hhbmdlcyA9IGZhbHNlXG5cdFx0XHRjdXJyZW50Q2hpbGQgPSBjdXJyZW50Q2hpbGRyZW5baW5kZXhdXG5cdFx0XHRuZXdDaGlsZCA9IG5ld0NoaWxkcmVuW2luZGV4XVxuXHRcdFx0bmV3Q2hpbGRQcm9jZXNzZWQgPSBzd2l0Y2hcblx0XHRcdFx0d2hlbiBJUy50ZW1wbGF0ZShuZXdDaGlsZCkgdGhlbiBuZXdDaGlsZFxuXHRcdFx0XHR3aGVuIElTLmFycmF5KG5ld0NoaWxkKSB0aGVuIG5lZWRzVGVtcGxhdGVXcmFwID0gcGFyc2VUcmVlKG5ld0NoaWxkKVxuXHRcdFx0XHR3aGVuIElTLnN0cmluZyhuZXdDaGlsZCkgdGhlbiBuZWVkc1RlbXBsYXRlV3JhcCA9IHt0eXBlOid0ZXh0Jywgb3B0aW9uczp7dGV4dDpuZXdDaGlsZH19XG5cdFx0XHRcdHdoZW4gbm90IG5ld0NoaWxkIGFuZCBub3QgZ2xvYmFsT3B0cyB0aGVuIG5vQ2hhbmdlcyA9IHRydWVcblx0XHRcdFx0ZWxzZSBuZWVkc1RlbXBsYXRlV3JhcCA9IG5ld0NoaWxkIG9yIHRydWVcblxuXG5cdFx0XHRpZiBub0NoYW5nZXNcblx0XHRcdFx0bmV3Q2hpbGRQcm9jZXNzZWQgPSBjdXJyZW50Q2hpbGRcblx0XHRcdFxuXHRcdFx0ZWxzZSBpZiBuZWVkc1RlbXBsYXRlV3JhcFxuXHRcdFx0XHRuZXdDaGlsZFByb2Nlc3NlZCA9IFxuXHRcdFx0XHRcdGlmIGN1cnJlbnRDaGlsZFxuXHRcdFx0XHRcdFx0Y3VycmVudENoaWxkLmV4dGVuZChuZXdDaGlsZFByb2Nlc3NlZCwgZ2xvYmFsT3B0cylcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRuZXcgUXVpY2tUZW1wbGF0ZShleHRlbmQuY2xvbmUoc2NoZW1hLCBuZXdDaGlsZFByb2Nlc3NlZCkpXG5cblx0XHRcdG91dHB1dC5jaGlsZHJlbi5wdXNoIG5ld0NoaWxkUHJvY2Vzc2VkXG5cdFxuXHRcblx0ZWxzZSBpZiBJUy5vYmplY3QobmV3Q2hpbGRyZW4pXG5cdFx0bmV3Q2hpbGRyZW4gPSBleHRlbmQuYWxsb3dOdWxsLmNsb25lIG5ld0NoaWxkcmVuXG5cdFx0b3V0cHV0LmNoaWxkcmVuID0gZXh0ZW5kQnlSZWYobmV3Q2hpbGRyZW4sIGN1cnJlbnRDaGlsZHJlbiwgZ2xvYmFsT3B0cylcblx0XHRyZW1haW5pbmdOZXdDaGlsZHJlbiA9IG5ld0NoaWxkcmVuXG5cdFx0XG5cdFx0Zm9yIHJlZixuZXdDaGlsZCBvZiByZW1haW5pbmdOZXdDaGlsZHJlblxuXHRcdFx0bmV3Q2hpbGRQcm9jZXNzZWQgPSBpZiBJUy5vYmplY3RQbGFpbihuZXdDaGlsZCkgYW5kIG5vdCBJUy50ZW1wbGF0ZShuZXdDaGlsZCkgdGhlbiBuZXdDaGlsZCBlbHNlIHBhcnNlVHJlZShuZXdDaGlsZClcblx0XHRcdG91dHB1dC5jaGlsZHJlbi5wdXNoIG5ldyBRdWlja1RlbXBsYXRlIG5ld0NoaWxkUHJvY2Vzc2VkXG5cdFx0XHRkZWxldGUgcmVtYWluaW5nTmV3Q2hpbGRyZW5bcmVmXVxuXG5cdHJldHVybiBvdXRwdXRcblxuXG5cblxuZXh0ZW5kQnlSZWYgPSAobmV3Q2hpbGRyZW5SZWZzLCBjdXJyZW50Q2hpbGRyZW4sIGdsb2JhbE9wdHMpLT4gaWYgbm90IGN1cnJlbnRDaGlsZHJlbi5sZW5ndGggdGhlbiBjdXJyZW50Q2hpbGRyZW4gZWxzZVxuXHRvdXRwdXQgPSBbXVxuXHRcblx0Zm9yIGN1cnJlbnRDaGlsZCBpbiBjdXJyZW50Q2hpbGRyZW5cblx0XHRuZXdDaGlsZCA9IG5ld0NoaWxkcmVuUmVmc1tjdXJyZW50Q2hpbGQucmVmXVxuXHRcdGlmIG5ld0NoaWxkXG5cdFx0XHRuZXdDaGlsZFByb2Nlc3NlZCA9IGN1cnJlbnRDaGlsZC5leHRlbmQobmV3Q2hpbGQsIGdsb2JhbE9wdHMpXG5cdFx0XHRkZWxldGUgbmV3Q2hpbGRyZW5SZWZzW2N1cnJlbnRDaGlsZC5yZWZdXG5cdFx0XG5cdFx0ZWxzZSBpZiBuZXdDaGlsZCBpcyBudWxsXG5cdFx0XHRkZWxldGUgbmV3Q2hpbGRyZW5SZWZzW2N1cnJlbnRDaGlsZC5yZWZdXG5cdFx0XHRjb250aW51ZVxuXHRcdFxuXHRcdGVsc2Vcblx0XHRcdG5ld0NoaWxkUHJvY2Vzc2VkID0gc3dpdGNoXG5cdFx0XHRcdHdoZW4gZ2xvYmFsT3B0cyB0aGVuIGN1cnJlbnRDaGlsZC5leHRlbmQobnVsbCwgZ2xvYmFsT3B0cylcblx0XHRcdFx0d2hlbiBPYmplY3Qua2V5cyhuZXdDaGlsZHJlblJlZnMpLmxlbmd0aCB0aGVuIGN1cnJlbnRDaGlsZC5leHRlbmQoKVxuXHRcdFx0XHRlbHNlIGN1cnJlbnRDaGlsZFxuXG5cdFx0bmV3Q2hpbGRQcm9jZXNzZWQuY2hpbGRyZW4gPSBleHRlbmRCeVJlZihuZXdDaGlsZHJlblJlZnMsIG5ld0NoaWxkUHJvY2Vzc2VkLmNoaWxkcmVuKVxuXHRcdG91dHB1dC5wdXNoKG5ld0NoaWxkUHJvY2Vzc2VkKVxuXG5cdHJldHVybiBvdXRwdXRcblxuXG5cblxuIiwicGFyc2VUcmVlID0gKHRyZWUsIHBhcnNlQ2hpbGRyZW4pLT4gc3dpdGNoXG5cdHdoZW4gSVMuYXJyYXkodHJlZSlcblx0XHRvdXRwdXQgPSB7fVxuXG5cdFx0aWYgbm90IElTLnN0cmluZyh0cmVlWzBdKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiI3twYXJzZUVycm9yUHJlZml4fSBzdHJpbmcgZm9yICd0eXBlJywgZ290ICcje1N0cmluZyh0cmVlWzBdKX0nXCJcblx0XHRlbHNlXG5cdFx0XHRvdXRwdXQudHlwZSA9IHRyZWVbMF1cblx0XHRcblx0XHRpZiB0cmVlLmxlbmd0aCA+IDEgYW5kIG5vdCBJUy5vYmplY3QodHJlZVsxXSkgYW5kIHRyZWVbMV0gaXNudCBudWxsXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCIje3BhcnNlRXJyb3JQcmVmaXh9IG9iamVjdCBmb3IgJ29wdGlvbnMnLCBnb3QgJyN7U3RyaW5nKHRyZWVbMV0pfSdcIlxuXHRcdGVsc2Vcblx0XHRcdG91dHB1dC5vcHRpb25zID0gaWYgdHJlZVsxXSB0aGVuIGV4dGVuZC5kZWVwLmNsb25lKHRyZWVbMV0pIGVsc2Ugc2NoZW1hLm9wdGlvbnNcblx0XHRcdG91dHB1dC5yZWYgPSB0cmVlWzFdLmlkIG9yIHRyZWVbMV0ucmVmIGlmIHRyZWVbMV1cblxuXHRcdG91dHB1dC5jaGlsZHJlbiA9IHRyZWUuc2xpY2UoMilcblx0XHRpZiBwYXJzZUNoaWxkcmVuIGlzIGZhbHNlXG5cdFx0XHRvdXRwdXQuY2hpbGRyZW4gPSB0cmVlWzJdIGlmIHRyZWUubGVuZ3RoIGlzIDMgYW5kIElTLm9iamVjdFBsYWluKHRyZWVbMl0pIGFuZCBub3QgSVMudGVtcGxhdGUodHJlZVsyXSlcblx0XHRlbHNlXG5cdFx0XHRvdXRwdXQuY2hpbGRyZW4gPSBvdXRwdXQuY2hpbGRyZW4ubWFwKFF1aWNrRG9tLnRlbXBsYXRlKVxuXHRcdHJldHVybiBvdXRwdXRcblxuXG5cdHdoZW4gSVMuc3RyaW5nKHRyZWUpIG9yIElTLmRvbVRleHQodHJlZSlcblx0XHR0eXBlOid0ZXh0Jywgb3B0aW9uczp7dGV4dDogdHJlZS50ZXh0Q29udGVudCBvciB0cmVlfSwgY2hpbGRyZW46c2NoZW1hLmNoaWxkcmVuXG5cblx0d2hlbiBJUy5kb21FbCh0cmVlKVxuXHRcdHR5cGU6IHRyZWUubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuXHRcdHJlZjogdHJlZS5pZFxuXHRcdG9wdGlvbnM6IGV4dGVuZC5jbG9uZS5rZXlzKGFsbG93ZWRUZW1wbGF0ZU9wdGlvbnMpKHRyZWUpXG5cdFx0Y2hpbGRyZW46IHNjaGVtYS5jaGlsZHJlbi5tYXAuY2FsbCh0cmVlLmNoaWxkTm9kZXMsIFF1aWNrRG9tLnRlbXBsYXRlKVxuXG5cdHdoZW4gSVMucXVpY2tEb21FbCh0cmVlKVxuXHRcdHR5cGU6IHRyZWUudHlwZVxuXHRcdHJlZjogdHJlZS5yZWZcblx0XHRvcHRpb25zOiBleHRlbmQuY2xvbmUuZGVlcC5ub3RLZXlzKFsncmVsYXRlZEluc3RhbmNlJywgJ3JlbGF0ZWQnXSkodHJlZS5vcHRpb25zKVxuXHRcdGNoaWxkcmVuOiB0cmVlLmNoaWxkcmVuLm1hcChRdWlja0RvbS50ZW1wbGF0ZSlcblxuXHR3aGVuIElTLnRlbXBsYXRlKHRyZWUpXG5cdFx0cmV0dXJuIHRyZWVcblxuXHRlbHNlXG5cdFx0dGhyb3cgbmV3IEVycm9yIFwiI3twYXJzZUVycm9yUHJlZml4fSAoYXJyYXkgfHwgc3RyaW5nIHx8IGRvbUVsIHx8IHF1aWNrRG9tRWwgfHwgdGVtcGxhdGUpLCBnb3QgI3tTdHJpbmcodHJlZSl9XCJcblxuXG5cblxucGFyc2VFcnJvclByZWZpeCA9ICdUZW1wbGF0ZSBQYXJzZSBFcnJvcjogZXhwZWN0ZWQnIiwic2NoZW1hID0gXG5cdHR5cGU6ICdkaXYnXG5cdHJlZjogdW5kZWZpbmVkXG5cdG9wdGlvbnM6IHt9XG5cdGNoaWxkcmVuOiBbXVxuXG5cbm1hdGNoZXNTY2hlbWEgPSAob2JqZWN0KS0+XG5cdHR5cGVvZiBvYmplY3QudHlwZSBpc250ICd1bmRlZmluZWQnIG9yXG5cdHR5cGVvZiBvYmplY3QucmVmIGlzbnQgJ3VuZGVmaW5lZCcgb3Jcblx0dHlwZW9mIG9iamVjdC5vcHRpb25zIGlzbnQgJ3VuZGVmaW5lZCcgb3Jcblx0dHlwZW9mIG9iamVjdC5jaGlsZHJlbiBpc250ICd1bmRlZmluZWQnXG5cblxuXG4iLCJzaG9ydGN1dHMgPSBbXG5cdCdsaW5rOmEnXG5cdCdhbmNob3I6YSdcblx0J2EnXG5cdCd0ZXh0J1xuXHQnZGl2J1xuXHQnc3Bhbidcblx0J2gxJ1xuXHQnaDInXG5cdCdoMydcblx0J2g0J1xuXHQnaDUnXG5cdCdoNidcblx0J2hlYWRlcidcblx0J2Zvb3Rlcidcblx0J3NlY3Rpb24nXG5cdCdidXR0b24nXG5cdCdicidcblx0J3VsJ1xuXHQnb2wnXG5cdCdsaSdcblx0J2ZpZWxkc2V0J1xuXHQnaW5wdXQnXG5cdCd0ZXh0YXJlYSdcblx0J3NlbGVjdCdcblx0J29wdGlvbidcblx0J2Zvcm0nXG5cdCdmcmFtZSdcblx0J2hyJ1xuXHQnaWZyYW1lJ1xuXHQnaW1nJ1xuXHQncGljdHVyZSdcblx0J21haW4nXG5cdCduYXYnXG5cdCdtZXRhJ1xuXHQnb2JqZWN0J1xuXHQncHJlJ1xuXHQnc3R5bGUnXG5cdCd0YWJsZSdcblx0J3Rib2R5J1xuXHQndGgnXG5cdCd0cidcblx0J3RkJ1xuXHQndGZvb3QnXG5cdCMgJ3RlbXBsYXRlJ1xuXHQndmlkZW8nXG5dXG5cblxuZm9yIHNob3J0Y3V0IGluIHNob3J0Y3V0cyB0aGVuIGRvIChzaG9ydGN1dCktPlxuXHRwcm9wID0gdHlwZSA9IHNob3J0Y3V0XG5cdGlmIGhlbHBlcnMuaW5jbHVkZXMoc2hvcnRjdXQsICc6Jylcblx0XHRzcGxpdCA9IHNob3J0Y3V0LnNwbGl0KCc6Jylcblx0XHRwcm9wID0gc3BsaXRbMF1cblx0XHR0eXBlID0gc3BsaXRbMV1cblxuXHRRdWlja0RvbVtwcm9wXSA9ICgpLT4gUXVpY2tEb20odHlwZSwgYXJndW1lbnRzLi4uKVxuIiwie1xuICBcIl9mcm9tXCI6IFwicXVpY2tkb21AbGF0ZXN0XCIsXG4gIFwiX2lkXCI6IFwicXVpY2tkb21AMS4wLjkwXCIsXG4gIFwiX2luQnVuZGxlXCI6IGZhbHNlLFxuICBcIl9pbnRlZ3JpdHlcIjogXCJzaGE1MTItSk5IdVppekVRVGhMbmoxdmxBSnlVOU5mL213K1ZsOENOK3VOUnN3QWdhSVkvNHhHcVRmZ0FrMEFEbG8wclhpMjdlK3lyS0lhOXZnWGNvY1Fmam1LcEE9PVwiLFxuICBcIl9sb2NhdGlvblwiOiBcIi9xdWlja2RvbVwiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwidGFnXCIsXG4gICAgXCJyZWdpc3RyeVwiOiB0cnVlLFxuICAgIFwicmF3XCI6IFwicXVpY2tkb21AbGF0ZXN0XCIsXG4gICAgXCJuYW1lXCI6IFwicXVpY2tkb21cIixcbiAgICBcImVzY2FwZWROYW1lXCI6IFwicXVpY2tkb21cIixcbiAgICBcInJhd1NwZWNcIjogXCJsYXRlc3RcIixcbiAgICBcInNhdmVTcGVjXCI6IG51bGwsXG4gICAgXCJmZXRjaFNwZWNcIjogXCJsYXRlc3RcIlxuICB9LFxuICBcIl9yZXF1aXJlZEJ5XCI6IFtcbiAgICBcIiNVU0VSXCIsXG4gICAgXCIvXCJcbiAgXSxcbiAgXCJfcmVzb2x2ZWRcIjogXCJodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy9xdWlja2RvbS8tL3F1aWNrZG9tLTEuMC45MC50Z3pcIixcbiAgXCJfc2hhc3VtXCI6IFwiODRkMmRkMzQ1ZGI5NjdiOWZiYWZjYjcwMzVjYzQzYTgzMjJmYjQ4OFwiLFxuICBcIl9zcGVjXCI6IFwicXVpY2tkb21AbGF0ZXN0XCIsXG4gIFwiX3doZXJlXCI6IFwiL1VzZXJzL2RhbmllbGthbGVuL3NhbmRib3gvcXVpY2tmaWVsZFwiLFxuICBcImF1dGhvclwiOiB7XG4gICAgXCJuYW1lXCI6IFwiZGFuaWVsa2FsZW5cIlxuICB9LFxuICBcImJyb3dzZXJcIjoge1xuICAgIFwiLi9kZWJ1Z1wiOiBcImRpc3QvcXVpY2tkb20uZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9xdWlja2RvbS5qc1wiOiBcInNyYy9pbmRleC5jb2ZmZWVcIlxuICB9LFxuICBcImJyb3dzZXJpZnlcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwic2ltcGx5aW1wb3J0L2NvbXBhdFwiXG4gICAgXVxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZG9tL2lzc3Vlc1wiXG4gIH0sXG4gIFwiYnVuZGxlRGVwZW5kZW5jaWVzXCI6IGZhbHNlLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAZGFuaWVsa2FsZW4vaXNcIjogXCJeMi4wLjBcIixcbiAgICBcInF1aWNrY3NzXCI6IFwiXjEuMy40XCIsXG4gICAgXCJzbWFydC1leHRlbmRcIjogXCJeMS43LjNcIlxuICB9LFxuICBcImRlcHJlY2F0ZWRcIjogZmFsc2UsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJGYXN0ICYgbGlnaHQgRE9NIGVsZW1lbnQgbWFuYWdlbWVudCBzdXBwb3J0aW5nIGpxdWVyeS1saWtlIG1ldGhvZHMsIHRlbXBsYXRlcywgJiBzdGF0ZS1iYXNlZCBzdHlsaW5nXCIsXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjaGFsa1wiOiBcIl4yLjAuMVwiLFxuICAgIFwiY29mZmVlLXNjcmlwdFwiOiBcIl4xLjEyLjZcIixcbiAgICBcImV4ZWNhXCI6IFwiXjAuNy4wXCIsXG4gICAgXCJmcy1qZXRwYWNrXCI6IFwiXjAuMTMuM1wiLFxuICAgIFwicHJvbWlzZS1icmVha1wiOiBcIl4wLjEuMlwiLFxuICAgIFwic2VtdmVyXCI6IFwiXjUuMy4wXCJcbiAgfSxcbiAgXCJkaXJlY3Rvcmllc1wiOiB7XG4gICAgXCJ0ZXN0XCI6IFwidGVzdFwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tkb20jcmVhZG1lXCIsXG4gIFwibGljZW5zZVwiOiBcIklTQ1wiLFxuICBcIm1haW5cIjogXCJkaXN0L3F1aWNrZG9tLmpzXCIsXG4gIFwibmFtZVwiOiBcInF1aWNrZG9tXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZG9tLmdpdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcImNha2UgLWQgYnVpbGQgJiYgY2FrZSBidWlsZCAmJiBjYWtlIG1lYXN1cmUgJiYgY3AgLXIgYnVpbGQvKiBkaXN0L1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJjYWtlIGluc3RhbGw6Y292ZXJhZ2U7IG5wbSBydW4gY292ZXJhZ2U6cnVuICYmIG5wbSBydW4gY292ZXJhZ2U6YmFkZ2VcIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnJ1blwiOiBcImNvdmVyYWdlPXRydWUgbnBtIHJ1biB0ZXN0OmVsZWN0cm9uXCIsXG4gICAgXCJjb3ZlcmFnZTpzaG93XCI6IFwib3BlbiBjb3ZlcmFnZS9sY292LXJlcG9ydC9pbmRleC5odG1sXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJwb3N0dmVyc2lvblwiOiBcIm5wbSBydW4gYnVpbGQgJiYgZ2l0IGFkZCAuICYmIGdpdCBjb21taXQgLWEgLW0gJ1tCdWlsZF0nXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcIm5wbSBydW4gdGVzdDp0cmF2aXNcIixcbiAgICBcInRlc3RcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OmJyb3dzZXJcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRWxlY3Ryb24gLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpjaHJvbWVcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIENocm9tZSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmZpcmVmb3hcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRmlyZWZveCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpsb2NhbFwiOiBcIm9wZW4gdGVzdC90ZXN0cnVubmVyLmh0bWxcIixcbiAgICBcInRlc3Q6bWluaWZpZWRcIjogXCJtaW5pZmllZD0xIG5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6c2FmYXJpXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBTYWZhcmkgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYXVjZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIHNhdWNlPTEga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDp0cmF2aXNcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcIndhdGNoXCI6IFwiY2FrZSAtZCB3YXRjaFwiXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFtcbiAgICAgICAgXCJiYWJlbGlmeVwiLFxuICAgICAgICB7XG4gICAgICAgICAgXCJwcmVzZXRzXCI6IFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgXCJAYmFiZWwvcHJlc2V0LWVudlwiLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJtb2R1bGVzXCI6IGZhbHNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc3VwZXJcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1yZW5hbWVcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zaW1wbGVcIlxuICAgIF1cbiAgfSxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjkwXCJcbn1cbiIsIklTID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vaXMnXG5JUyA9IElTLmNyZWF0ZSgnbmF0aXZlcycsJ2RvbScpXG5JUy5sb2FkXG5cdGZpZWxkOiAodGFyZ2V0KS0+IHRhcmdldCBhbmQgdGFyZ2V0IGluc3RhbmNlb2YgcmVxdWlyZSgnLi9maWVsZCcpXG5cdHJlZ2V4OiAodGFyZ2V0KS0+IHRhcmdldCBpbnN0YW5jZW9mIFJlZ0V4cFxuXHRvYmplY3RhYmxlOiAodGFyZ2V0KS0+IElTLm9iamVjdCh0YXJnZXQpIG9yIElTLmZ1bmN0aW9uKHRhcmdldClcblxubW9kdWxlLmV4cG9ydHMgPSBJUyIsImV4dGVuZCA9IHJlcXVpcmUgJy4vZXh0ZW5kJ1xuXG5ub3JtYWxpemVLZXlzID0gKGtleXMpLT4gaWYga2V5c1xuXHRvdXRwdXQgPSB7fVxuXHRpZiB0eXBlb2Yga2V5cyBpc250ICdvYmplY3QnXG5cdFx0b3V0cHV0W2tleXNdID0gdHJ1ZVxuXHRlbHNlXG5cdFx0a2V5cyA9IE9iamVjdC5rZXlzKGtleXMpIGlmIG5vdCBBcnJheS5pc0FycmF5KGtleXMpXG5cdFx0b3V0cHV0W2tleV0gPSB0cnVlIGZvciBrZXkgaW4ga2V5c1xuXG5cdHJldHVybiBvdXRwdXRcblxuXG5uZXdCdWlsZGVyID0gKGlzQmFzZSktPlxuXHRidWlsZGVyID0gKHRhcmdldCktPlxuXHRcdEVYUEFORF9BUkdVTUVOVFMoc291cmNlcylcblx0XHRpZiBidWlsZGVyLm9wdGlvbnMudGFyZ2V0XG5cdFx0XHR0aGVUYXJnZXQgPSBidWlsZGVyLm9wdGlvbnMudGFyZ2V0XG5cdFx0ZWxzZVxuXHRcdFx0dGhlVGFyZ2V0ID0gdGFyZ2V0XG5cdFx0XHRzb3VyY2VzLnNoaWZ0KClcblx0XHRcblx0XHRleHRlbmQoYnVpbGRlci5vcHRpb25zLCB0aGVUYXJnZXQsIHNvdXJjZXMpXG5cdFxuXHRidWlsZGVyLmlzQmFzZSA9IHRydWUgaWYgaXNCYXNlXG5cdGJ1aWxkZXIub3B0aW9ucyA9IHt9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGJ1aWxkZXIsIG1vZGlmaWVycylcblx0cmV0dXJuIGJ1aWxkZXJcblxuXG5tb2RpZmllcnMgPSBcblx0J2RlZXAnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMuZGVlcCA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdvd24nOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMub3duID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J2FsbG93TnVsbCc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5hbGxvd051bGwgPSB0cnVlXG5cdFx0cmV0dXJuIF9cblxuXHQnbnVsbERlbGV0ZXMnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMubnVsbERlbGV0ZXMgPSB0cnVlXG5cdFx0cmV0dXJuIF9cblxuXHQnY29uY2F0JzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLmNvbmNhdCA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdjbG9uZSc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy50YXJnZXQgPSB7fVxuXHRcdHJldHVybiBfXG5cblx0J25vdERlZXAnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKGtleXMpLT5cblx0XHRcdF8ub3B0aW9ucy5ub3REZWVwID0gbm9ybWFsaXplS2V5cyhrZXlzKVx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXHQnZGVlcE9ubHknOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKGtleXMpLT5cblx0XHRcdF8ub3B0aW9ucy5kZWVwT25seSA9IG5vcm1hbGl6ZUtleXMoa2V5cylcdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblx0J2tleXMnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKGtleXMpLT5cblx0XHRcdF8ub3B0aW9ucy5rZXlzID0gbm9ybWFsaXplS2V5cyhrZXlzKVx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXHQnbm90S2V5cyc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLm5vdEtleXMgPSBub3JtYWxpemVLZXlzKGtleXMpXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cdCd0cmFuc2Zvcm0nOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKHRyYW5zZm9ybSktPlxuXHRcdFx0aWYgdHlwZW9mIHRyYW5zZm9ybSBpcyAnZnVuY3Rpb24nXG5cdFx0XHRcdF8ub3B0aW9ucy5nbG9iYWxUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1cblx0XHRcdGVsc2UgaWYgdHJhbnNmb3JtIGFuZCB0eXBlb2YgdHJhbnNmb3JtIGlzICdvYmplY3QnXG5cdFx0XHRcdF8ub3B0aW9ucy50cmFuc2Zvcm1zID0gdHJhbnNmb3JtXG5cdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblxuXHQnZmlsdGVyJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuIChmaWx0ZXIpLT5cblx0XHRcdGlmIHR5cGVvZiBmaWx0ZXIgaXMgJ2Z1bmN0aW9uJ1xuXHRcdFx0XHRfLm9wdGlvbnMuZ2xvYmFsRmlsdGVyID0gZmlsdGVyXG5cdFx0XHRlbHNlIGlmIGZpbHRlciBhbmQgdHlwZW9mIGZpbHRlciBpcyAnb2JqZWN0J1xuXHRcdFx0XHRfLm9wdGlvbnMuZmlsdGVycyA9IGZpbHRlclxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gbmV3QnVpbGRlcih0cnVlKVxuZXhwb3J0cy52ZXJzaW9uID0gaW1wb3J0ICcuLi9wYWNrYWdlLmpzb24gJCB2ZXJzaW9uJyIsIntcbiAgXCJfYXJnc1wiOiBbXG4gICAgW1xuICAgICAgXCJzbWFydC1leHRlbmRAMS43LjNcIixcbiAgICAgIFwiL1VzZXJzL2RhbmllbGthbGVuL3NhbmRib3gvcXVpY2tmaWVsZFwiXG4gICAgXVxuICBdLFxuICBcIl9mcm9tXCI6IFwic21hcnQtZXh0ZW5kQDEuNy4zXCIsXG4gIFwiX2lkXCI6IFwic21hcnQtZXh0ZW5kQDEuNy4zXCIsXG4gIFwiX2luQnVuZGxlXCI6IGZhbHNlLFxuICBcIl9pbnRlZ3JpdHlcIjogXCJzaGE1MTItUFZFRVZZRER6eXhLQTBHTkZMY1dZNm9KU2tRS2RjMXc3MThlUXBFSGNOdVRTV1l4REszNUd6aHNHaE1rVVU4bEJJZ1NFRGJ0NXg1cDQ2cFJ6M0F1YkE9PVwiLFxuICBcIl9sb2NhdGlvblwiOiBcIi9zbWFydC1leHRlbmRcIixcbiAgXCJfcGhhbnRvbUNoaWxkcmVuXCI6IHt9LFxuICBcIl9yZXF1ZXN0ZWRcIjoge1xuICAgIFwidHlwZVwiOiBcInZlcnNpb25cIixcbiAgICBcInJlZ2lzdHJ5XCI6IHRydWUsXG4gICAgXCJyYXdcIjogXCJzbWFydC1leHRlbmRAMS43LjNcIixcbiAgICBcIm5hbWVcIjogXCJzbWFydC1leHRlbmRcIixcbiAgICBcImVzY2FwZWROYW1lXCI6IFwic21hcnQtZXh0ZW5kXCIsXG4gICAgXCJyYXdTcGVjXCI6IFwiMS43LjNcIixcbiAgICBcInNhdmVTcGVjXCI6IG51bGwsXG4gICAgXCJmZXRjaFNwZWNcIjogXCIxLjcuM1wiXG4gIH0sXG4gIFwiX3JlcXVpcmVkQnlcIjogW1xuICAgIFwiL1wiLFxuICAgIFwiL3F1aWNrZG9tXCIsXG4gICAgXCIvc2ltcGx5d2F0Y2hcIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3NtYXJ0LWV4dGVuZC8tL3NtYXJ0LWV4dGVuZC0xLjcuMy50Z3pcIixcbiAgXCJfc3BlY1wiOiBcIjEuNy4zXCIsXG4gIFwiX3doZXJlXCI6IFwiL1VzZXJzL2RhbmllbGthbGVuL3NhbmRib3gvcXVpY2tmaWVsZFwiLFxuICBcImF1dGhvclwiOiB7XG4gICAgXCJuYW1lXCI6IFwiZGFuaWVsa2FsZW5cIlxuICB9LFxuICBcImJyb3dzZXJcIjoge1xuICAgIFwiLi9kZWJ1Z1wiOiBcImRpc3Qvc21hcnQtZXh0ZW5kLmRlYnVnLmpzXCIsXG4gICAgXCIuL2Rpc3Qvc21hcnQtZXh0ZW5kLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vc21hcnQtZXh0ZW5kL2lzc3Vlc1wiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImZhbGFmZWxcIjogXCJeMi4xLjBcIlxuICB9LFxuICBcImRlc2NyaXB0aW9uXCI6IFwiTWVyZ2UvZXh0ZW5kIG9iamVjdHMgKHNoYWxsb3cvZGVlcCkgd2l0aCBnbG9iYWwvaW5kaXZpZHVhbCBmaWx0ZXJzIGFuZCBtb3JlIGZlYXR1cmVzXCIsXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImJhZGdlLWdlblwiOiBcIl4xLjAuMlwiLFxuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy40LjdcIixcbiAgICBcImNoYWlcIjogXCJeMy41LjBcIixcbiAgICBcImNvZmZlZS1yZWdpc3RlclwiOiBcIl4wLjEuMFwiLFxuICAgIFwiY29mZmVlaWZ5LWNhY2hlZFwiOiBcIl4yLjEuMVwiLFxuICAgIFwiZXh0ZW5kXCI6IFwiXjMuMC4xXCIsXG4gICAgXCJnb29nbGUtY2xvc3VyZS1jb21waWxlci1qc1wiOiBcIl4yMDE3MDYyNi4wLjBcIixcbiAgICBcIm1vY2hhXCI6IFwiXjMuMi4wXCIsXG4gICAgXCJzaW1wbHlpbXBvcnRcIjogXCJeNC4wLjAtczIxXCIsXG4gICAgXCJzaW1wbHl3YXRjaFwiOiBcIl4zLjAuMC1sMlwiLFxuICAgIFwidWdsaWZ5LWpzXCI6IFwiXjMuMC4yNFwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vc21hcnQtZXh0ZW5kI3JlYWRtZVwiLFxuICBcImtleXdvcmRzXCI6IFtcbiAgICBcImV4dGVuZFwiLFxuICAgIFwiY2xvbmVcIixcbiAgICBcImZpbHRlclwiLFxuICAgIFwic2VsZWN0aXZlXCIsXG4gICAgXCJtZXJnZVwiLFxuICAgIFwiYXNzaWduXCIsXG4gICAgXCJwcm9wZXJ0aWVzXCJcbiAgXSxcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwibWFpblwiOiBcImRpc3Qvc21hcnQtZXh0ZW5kLmpzXCIsXG4gIFwibW9jaGFfb3B0c1wiOiBcIi11IHRkZCAtLWNvbXBpbGVycyBjb2ZmZWU6Y29mZmVlLXJlZ2lzdGVyIC0tc2xvdyAxMDAwIC0tdGltZW91dCA1MDAwXCIsXG4gIFwibmFtZVwiOiBcInNtYXJ0LWV4dGVuZFwiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zbWFydC1leHRlbmQuZ2l0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwibWtkaXIgLXAgZGlzdC87IG5wbSBydW4gYnVpbGQ6ZGVidWcgJiYgbnBtIHJ1biBidWlsZDpyZWxlYXNlXCIsXG4gICAgXCJidWlsZDpkZWJ1Z1wiOiBcInNpbXBseWltcG9ydCBidW5kbGUgc3JjL2luZGV4LmNvZmZlZSAtZCAtLXRhcmdldCBub2RlIC0tdW1kIHNtYXJ0LWV4dGVuZCA+IGRpc3Qvc21hcnQtZXh0ZW5kLmRlYnVnLmpzXCIsXG4gICAgXCJidWlsZDpyZWxlYXNlXCI6IFwic2ltcGx5aW1wb3J0IGJ1bmRsZSBzcmMvaW5kZXguY29mZmVlIC0tdGFyZ2V0IG5vZGUgLS11bWQgc21hcnQtZXh0ZW5kID4gZGlzdC9zbWFydC1leHRlbmQuanNcIixcbiAgICBcImNvdmVyYWdlXCI6IFwibnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnJ1blwiOiBcImZvckNvdmVyYWdlPXRydWUgaXN0YW5idWwgY292ZXIgLS1kaXIgY292ZXJhZ2Ugbm9kZV9tb2R1bGVzL21vY2hhL2Jpbi9fbW9jaGEgLS0gJG5wbV9wYWNrYWdlX21vY2hhX29wdHNcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwiQ0k9MSBucG0gcnVuIHRlc3RcIixcbiAgICBcInRlc3RcIjogXCJtb2NoYSAkbnBtX3BhY2thZ2VfbW9jaGFfb3B0c1wiLFxuICAgIFwid2F0Y2hcIjogXCJzaW1wbHl3YXRjaCAtZyAnc3JjLyonIC14ICducG0gcnVuIGJ1aWxkOmRlYnVnIC1zJ1wiXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcImNvZmZlZWlmeS1jYWNoZWRcIixcbiAgICAgIFwiLi8uY29uZmlnL3RyYW5zZm9ybXMvbWFjcm9zXCJcbiAgICBdLFxuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXN1cGVyXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktcmVuYW1lXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc2ltcGxlXCJcbiAgICBdXG4gIH0sXG4gIFwidmVyc2lvblwiOiBcIjEuNy4zXCJcbn1cbiIsIkNTUyA9IGltcG9ydCAncXVpY2tjc3MnXG5tb2R1bGUuZXhwb3J0cyA9ICgpLT5cbiAgICBDU1MuYW5pbWF0aW9uICdjaGVja21hcmtBbmltYXRlU3VjY2Vzc1RpcCcsXG4gICAgICAgICcwJSwgNTQlJzogIHt3aWR0aDowLCBsZWZ0OjAsIHRvcDozfVxuICAgICAgICAnNzAlJzogICAgICB7d2lkdGg6MTQsIGxlZnQ6LTIsIHRvcDo4fVxuICAgICAgICAnODQlJzogICAgICB7d2lkdGg6NSwgbGVmdDo1LCB0b3A6MTB9XG4gICAgICAgICcxMDAlJzogICAgIHt3aWR0aDo4LCBsZWZ0OjMsIHRvcDoxMH1cblxuXG4gICAgQ1NTLmFuaW1hdGlvbiAnY2hlY2ttYXJrQW5pbWF0ZVN1Y2Nlc3NMb25nJyxcbiAgICAgICAgJzAlLCA2NSUnOiAge3dpZHRoOjAsIHJpZ2h0OjEyLCB0b3A6MTJ9XG4gICAgICAgICc4NCUnOiAgICAgIHt3aWR0aDoxNCwgcmlnaHQ6MCwgdG9wOjd9XG4gICAgICAgICcxMDAlJzogICAgIHt3aWR0aDoxMiwgcmlnaHQ6MiwgdG9wOjh9XG5cblxuICAgIENTUy5hbmltYXRpb24gJ2NoZWNrbWFya0FuaW1hdGVFcnJvcicsXG4gICAgICAgICcwJSwgNjUlJzogIHRyYW5zZm9ybTogJ3NjYWxlKDAuNCknLCBvcGFjaXR5OiAwXG4gICAgICAgICc4NCUnOiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuMTUpJ1xuICAgICAgICAnMTAwJSc6ICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKSdcblxuXG4gICAgQ1NTLmFuaW1hdGlvbiAnY2hlY2ttYXJrUm90YXRlUGxhY2Vob2xkZXInLFxuICAgICAgICAnMCUsIDUlJzogICB0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSdcbiAgICAgICAgJzEyJSwgMTAwJSc6dHJhbnNmb3JtOiAncm90YXRlKC00MDVkZWcpJ1xuXG5cbiAgICBDU1MuYW5pbWF0aW9uICdmaWVsZEVycm9yU2hha2UnLFxuICAgICAgICAnMCUsIDUwJSc6ICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMHB4KSdcbiAgICAgICAgJzI1JSwgNzUlJzogdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgxMHB4KSdcbiAgICAgICAgJzEwMCUnOiAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwcHgpJ1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSAoKS0+XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gWydfZ2V0VmFsdWUnLCAnX3NldFZhbHVlJywgJ192YWxpZGF0ZSddIiwiaGVscGVycyA9IGltcG9ydCAnLi4vaGVscGVycydcbklTID0gaW1wb3J0ICcuLi9jaGVja3MnXG5leHRlbmQgPSBpbXBvcnQgJ3NtYXJ0LWV4dGVuZCdcbmZhc3Rkb20gPSBpbXBvcnQgJ2Zhc3Rkb20nXG5TaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcbkNvbmRpdGlvbiA9IGltcG9ydCAnLi4vY29tcG9uZW50cy9jb25kaXRpb24nXG5jdXJyZW50SUQgPSAwXG5cbmNsYXNzIEZpZWxkXG5cdEBpbnN0YW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdEBzaGFsbG93U2V0dGluZ3MgPSBbJ3RlbXBsYXRlcycsICdmaWVsZEluc3RhbmNlcycsICd2YWx1ZScsICdkZWZhdWx0VmFsdWUnXVxuXHRAdHJhbnNmb3JtU2V0dGluZ3MgPSBpbXBvcnQgJy4vdHJhbnNmb3JtU2V0dGluZ3MnXG5cdGNvcmVWYWx1ZVByb3A6ICdfdmFsdWUnXG5cdGdsb2JhbERlZmF1bHRzOiBpbXBvcnQgJy4vZ2xvYmFsRGVmYXVsdHMnXG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMgRmllbGQ6Oixcblx0XHQncmVtb3ZlTGlzdGVuZXInOiBnZXQ6ICgpLT4gQG9mZlxuXHRcdCdlbHMnOiBnZXQ6ICgpLT4gQGVsLmNoaWxkXG5cdFx0J3ZhbHVlUmF3JzogZ2V0OiAoKS0+IEBfdmFsdWVcblx0XHQndmFsdWUnOlxuXHRcdFx0Z2V0OiAoKS0+IGlmIEBzZXR0aW5ncy5nZXR0ZXIgdGhlbiBAc2V0dGluZ3MuZ2V0dGVyKEBfZ2V0VmFsdWUoKSkgZWxzZSBAX2dldFZhbHVlKClcblx0XHRcdHNldDogKHZhbHVlKS0+IEBfc2V0VmFsdWUoaWYgQHNldHRpbmdzLnNldHRlciB0aGVuIEBzZXR0aW5ncy5zZXR0ZXIodmFsdWUpIGVsc2UgdmFsdWUpXG5cdFxuXHRjb25zdHJ1Y3RvcjogKHNldHRpbmdzLCBAYnVpbGRlciwgc2V0dGluZ092ZXJyaWRlcywgdGVtcGxhdGVPdmVycmlkZXMpLT5cblx0XHRpZiBzZXR0aW5nT3ZlcnJpZGVzXG5cdFx0XHRAZ2xvYmFsRGVmYXVsdHMgPSBzZXR0aW5nT3ZlcnJpZGVzLmdsb2JhbERlZmF1bHRzIGlmIHNldHRpbmdPdmVycmlkZXMuZ2xvYmFsRGVmYXVsdHNcblx0XHRcdEBkZWZhdWx0cyA9IHNldHRpbmdPdmVycmlkZXNbc2V0dGluZ3MudHlwZV0gaWYgc2V0dGluZ092ZXJyaWRlc1tzZXR0aW5ncy50eXBlXVxuXHRcdGlmIHRlbXBsYXRlT3ZlcnJpZGVzIGFuZCB0ZW1wbGF0ZU92ZXJyaWRlc1tzZXR0aW5ncy50eXBlXVxuXHRcdFx0QHRlbXBsYXRlcyA9IHRlbXBsYXRlT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdXG5cdFx0XHRAdGVtcGxhdGUgPSB0ZW1wbGF0ZU92ZXJyaWRlc1tzZXR0aW5ncy50eXBlXS5kZWZhdWx0XG5cblx0XHRzaGFsbG93U2V0dGluZ3MgPSBpZiBAc2hhbGxvd1NldHRpbmdzIHRoZW4gRmllbGQuc2hhbGxvd1NldHRpbmdzLmNvbmNhdChAc2hhbGxvd1NldHRpbmdzKSBlbHNlIEZpZWxkLnNoYWxsb3dTZXR0aW5nc1xuXHRcdHRyYW5zZm9ybVNldHRpbmdzID0gaWYgQHRyYW5zZm9ybVNldHRpbmdzIHRoZW4gRmllbGQudHJhbnNmb3JtU2V0dGluZ3MuY29uY2F0KEB0cmFuc2Zvcm1TZXR0aW5ncykgZWxzZSBGaWVsZC50cmFuc2Zvcm1TZXR0aW5nc1xuXG5cdFx0QHNldHRpbmdzID0gZXh0ZW5kLmRlZXAuY2xvbmUubm90RGVlcChzaGFsbG93U2V0dGluZ3MpLnRyYW5zZm9ybSh0cmFuc2Zvcm1TZXR0aW5ncykoQGdsb2JhbERlZmF1bHRzLCBAZGVmYXVsdHMsIHNldHRpbmdzKVxuXHRcdEBJRCA9IEBzZXR0aW5ncy5JRCBvciBjdXJyZW50SUQrKysnJ1xuXHRcdEB0eXBlID0gc2V0dGluZ3MudHlwZVxuXHRcdEBuYW1lID0gc2V0dGluZ3MubmFtZVxuXHRcdEBhbGxGaWVsZHMgPSBAc2V0dGluZ3MuZmllbGRJbnN0YW5jZXMgb3IgRmllbGQuaW5zdGFuY2VzXG5cdFx0QF92YWx1ZSA9IG51bGxcblx0XHRAX2V2ZW50Q2FsbGJhY2tzID0ge31cblx0XHRAc3RhdGUgPVxuXHRcdFx0dmFsaWQ6IHRydWVcblx0XHRcdHZpc2libGU6IHRydWVcblx0XHRcdGZvY3VzZWQ6IGZhbHNlXG5cdFx0XHRob3ZlcmVkOiBmYWxzZVxuXHRcdFx0ZmlsbGVkOiBmYWxzZVxuXHRcdFx0aW50ZXJhY3RlZDogZmFsc2Vcblx0XHRcdGlzTW9iaWxlOiBmYWxzZVxuXHRcdFx0ZGlzYWJsZWQ6IEBzZXR0aW5ncy5kaXNhYmxlZFxuXHRcdFx0bWFyZ2luOiBAc2V0dGluZ3MubWFyZ2luXG5cdFx0XHRwYWRkaW5nOiBAc2V0dGluZ3MucGFkZGluZ1xuXHRcdFx0d2lkdGg6IEBzZXR0aW5ncy53aWR0aFxuXHRcdFx0c2hvd0xhYmVsOiBAc2V0dGluZ3MubGFiZWxcblx0XHRcdGxhYmVsOiBAc2V0dGluZ3MubGFiZWxcblx0XHRcdHNob3dIZWxwOiBAc2V0dGluZ3MuaGVscFxuXHRcdFx0aGVscDogQHNldHRpbmdzLmhlbHBcblx0XHRcdHNob3dFcnJvcjogZmFsc2Vcblx0XHRcdGVycm9yOiBAc2V0dGluZ3MuZXJyb3JcblxuXHRcdGlmIElTLmRlZmluZWQoQHNldHRpbmdzLnBsYWNlaG9sZGVyKVxuXHRcdFx0QHN0YXRlLnBsYWNlaG9sZGVyID0gQHNldHRpbmdzLnBsYWNlaG9sZGVyXG5cblx0XHRpZiBJUy5udW1iZXIoQHNldHRpbmdzLndpZHRoKSBhbmQgQHNldHRpbmdzLndpZHRoIDw9IDFcblx0XHRcdEBzdGF0ZS53aWR0aCA9IFwiI3tAc2V0dGluZ3Mud2lkdGgqMTAwfSVcIlxuXG5cdFx0aWYgQHNldHRpbmdzLmNvbmRpdGlvbnM/Lmxlbmd0aFxuXHRcdFx0QHN0YXRlLnZpc2libGUgPSBmYWxzZVxuXHRcdFx0Q29uZGl0aW9uLmluaXQoQCwgQHNldHRpbmdzLmNvbmRpdGlvbnMpXG5cblx0XHRjb25zb2xlPy53YXJuKFwiRHVwbGljYXRlIGZpZWxkIElEcyBmb3VuZDogJyN7QElEfSdcIikgaWYgQGFsbEZpZWxkc1tASURdXG5cdFx0QGFsbEZpZWxkc1tASURdID0gQFxuXG5cblx0X2NvbnN0cnVjdG9yRW5kOiAoKS0+XG5cdFx0QGVsLmNoaWxkZiMuZmllbGQub24gJ2luc2VydGVkJywgKCk9PiBAZW1pdCgnaW5zZXJ0ZWQnKVxuXHRcdEBlbC5yYXcuaWQgPSBASUQgaWYgQHNldHRpbmdzLklEXG5cblx0XHRAc2V0dGluZ3MuZGVmYXVsdFZhbHVlID89IEBzZXR0aW5ncy52YWx1ZSBpZiBAc2V0dGluZ3MudmFsdWU/XG5cdFx0aWYgQHNldHRpbmdzLmRlZmF1bHRWYWx1ZT9cblx0XHRcdEB2YWx1ZSA9IGlmIEBzZXR0aW5ncy5tdWx0aXBsZSB0aGVuIFtdLmNvbmNhdChAc2V0dGluZ3MuZGVmYXVsdFZhbHVlKSBlbHNlIEBzZXR0aW5ncy5kZWZhdWx0VmFsdWVcblxuXHRcdFNpbXBseUJpbmQoJ3Nob3dFcnJvcicsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCdoZWxwJykub2YoQHN0YXRlKVxuXHRcdFx0LnRyYW5zZm9ybSAoc2hvdyk9PlxuXHRcdFx0XHRpZiBzaG93IGFuZCBAc3RhdGUuZXJyb3IgYW5kIElTLnN0cmluZyhAc3RhdGUuZXJyb3IpXG5cdFx0XHRcdFx0QHN0YXRlLmVycm9yXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRAc2V0dGluZ3MuaGVscCBvciBAc3RhdGUuaGVscFxuXG5cdFx0U2ltcGx5QmluZCgnZXJyb3InLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEBzdGF0ZSlcblx0XHRcdC50bygnaGVscCcpLm9mKEBzdGF0ZSlcblx0XHRcdC5jb25kaXRpb24gKGVycm9yKT0+IGVycm9yIGFuZCBAc3RhdGUuc2hvd0Vycm9yXG5cblx0XHRTaW1wbHlCaW5kKCdoZWxwJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCdodG1sJykub2YoQGVsLmNoaWxkLmhlbHApXG5cdFx0XHQuYW5kLnRvKCdzaG93SGVscCcpLm9mKEBzdGF0ZSlcblxuXHRcdFNpbXBseUJpbmQoJ2xhYmVsJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCd0ZXh0Jykub2YoQGVsLmNoaWxkLmxhYmVsKVxuXHRcdFx0LmFuZC50bygnc2hvd0xhYmVsJykub2YoQHN0YXRlKVxuXG5cdFx0U2ltcGx5QmluZCgnbWFyZ2luJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvIEBlbC5zdHlsZS5iaW5kKEBlbCwgJ21hcmdpbicpXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgncGFkZGluZycpLm9mKEBzdGF0ZSlcblx0XHRcdC50byBAZWwuc3R5bGUuYmluZChAZWwsICdwYWRkaW5nJylcblxuXHRcdFNpbXBseUJpbmQoJ3Nob3dIZWxwJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvIChzaG93LCBwcmV2U2hvdyk9PiBpZiBAc2V0dGluZ3MubWFrZVJvb21Gb3JIZWxwXG5cdFx0XHRcdGNoYW5nZUFtb3VudCA9IGlmICEhc2hvdyBpcyAhIXByZXZTaG93IHRoZW4gMCBlbHNlIGlmIHNob3cgdGhlbiAyNSBlbHNlIGlmIHByZXZTaG93IHRoZW4gLTI1XG5cdFx0XHRcdEBzdGF0ZS5tYXJnaW4gPSBoZWxwZXJzLnVwZGF0ZVNob3J0aGFuZFZhbHVlKEBzdGF0ZS5tYXJnaW4sICdib3R0b20nLCBjaGFuZ2VBbW91bnQpIGlmIGNoYW5nZUFtb3VudFxuXG5cdFx0U2ltcGx5QmluZCgnZm9jdXNlZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHN0YXRlKS50byAoZm9jdXNlZCk9PlxuXHRcdFx0QGVtaXQoaWYgZm9jdXNlZCB0aGVuICdmb2N1cycgZWxzZSAnYmx1cicpXG5cblx0XHRpZiBAc2V0dGluZ3MubW9iaWxlV2lkdGhcblx0XHRcdFNpbXBseUJpbmQgKCk9PlxuXHRcdFx0XHRmYXN0ZG9tLm1lYXN1cmUgKCk9PiBAc3RhdGUuaXNNb2JpbGUgPSB3aW5kb3cuaW5uZXJXaWR0aCA8PSBAc2V0dGluZ3MubW9iaWxlVGhyZXNob2xkXG5cdFx0XHQudXBkYXRlT24oJ2V2ZW50OnJlc2l6ZScpLm9mKHdpbmRvdylcblxuXHRcdGlmIElTLm9iamVjdChAc2V0dGluZ3MuZXZlbnRzKVxuXHRcdFx0QG9uKHRhcmdldCxoYW5kbGVyKSBmb3IgdGFyZ2V0LGhhbmRsZXIgb2YgQHNldHRpbmdzLmV2ZW50c1xuXG5cdFx0QGVtaXQgJ2NyZWF0ZWQnLCBAXG5cdFx0cmV0dXJuIEBlbC5yYXcuX3F1aWNrRmllbGQgPSBAXG5cblxuXHRfZm9ybWF0V2lkdGg6ICh3aWR0aCktPlxuXHRcdHdpZHRoID0gaWYgQHN0YXRlLmlzTW9iaWxlIHRoZW4gKEBzZXR0aW5ncy5tb2JpbGVXaWR0aCBvciB3aWR0aCkgZWxzZSB3aWR0aFxuXHRcdGlmIEBzZXR0aW5ncy5kaXN0YW5jZSBhbmQgd2lkdGggaXNudCAnMTAwJSdcblx0XHRcdHdpZHRoID0gXCJjYWxjKCN7d2lkdGh9IC0gI3tAc2V0dGluZ3MuZGlzdGFuY2V9cHgpXCJcblx0XHRyZXR1cm4gd2lkdGhcblxuXG5cblxuXG5cblxuXG5cdGFwcGVuZFRvOiAodGFyZ2V0KS0+XG5cdFx0QGVsLmFwcGVuZFRvKHRhcmdldCk7IFx0XHRyZXR1cm4gQFxuXG5cdHByZXBlbmRUbzogKHRhcmdldCktPlxuXHRcdEBlbC5wcmVwZW5kVG8odGFyZ2V0KTsgXHRcdHJldHVybiBAXG5cblx0aW5zZXJ0QWZ0ZXI6ICh0YXJnZXQpLT5cblx0XHRAZWwuaW5zZXJ0QWZ0ZXIodGFyZ2V0KTsgXHRyZXR1cm4gQFxuXG5cdGluc2VydEJlZm9yZTogKHRhcmdldCktPlxuXHRcdEBlbC5pbnNlcnRCZWZvcmUodGFyZ2V0KTsgXHRyZXR1cm4gQFxuXG5cdGRldGFjaDogKHRhcmdldCktPlxuXHRcdEBlbC5kZXRhY2godGFyZ2V0KTsgXHRcdHJldHVybiBAXG5cblx0cmVtb3ZlOiAoKS0+XG5cdFx0QGVsLnJlbW92ZSgpXG5cdFx0cmV0dXJuIEBkZXN0cm95KGZhbHNlKVxuXG5cdGRlc3Ryb3k6IChyZW1vdmVGcm9tRE9NPXRydWUpLT5cblx0XHRTaW1wbHlCaW5kLnVuQmluZEFsbChAKVxuXHRcdFNpbXBseUJpbmQudW5CaW5kQWxsKEBzdGF0ZSlcblx0XHRTaW1wbHlCaW5kLnVuQmluZEFsbChAZWwpXG5cdFx0U2ltcGx5QmluZC51bkJpbmRBbGwoY2hpbGQpIGZvciBjaGlsZCBpbiBAZWwuY2hpbGRcblx0XHRAZWwucmVtb3ZlKCkgaWYgcmVtb3ZlRnJvbURPTVxuXHRcdEBfZGVzdHJveSgpIGlmIEBfZGVzdHJveVxuXHRcdGRlbGV0ZSBAYWxsRmllbGRzW0BJRF1cblx0XHRyZXR1cm4gdHJ1ZVxuXG5cdG9uOiAoZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUpLT5cblx0XHRAZWwub24uY2FsbChAZWwsIGV2ZW50TmFtZXMsIGNhbGxiYWNrLCB1c2VDYXB0dXJlLCB0cnVlKVxuXHRcdHJldHVybiBAXG5cblx0b25jZTogKGV2ZW50TmFtZXMsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKS0+XG5cdFx0QG9uIGV2ZW50TmFtZXMsICgpPT5cblx0XHRcdEBvZmYoZXZlbnROYW1lcywgY2FsbGJhY2spXG5cdFx0XHRjYWxsYmFjay5hcHBseShAZWwsIGFyZ3VtZW50cylcblx0XHQsIHVzZUNhcHR1cmVcblxuXHRvZmY6ICgpLT5cblx0XHRAZWwub2ZmLmFwcGx5KEBlbCwgYXJndW1lbnRzKVxuXHRcdHJldHVybiBAXG5cblx0ZW1pdDogKCktPlxuXHRcdEBlbC5lbWl0UHJpdmF0ZS5hcHBseShAZWwsIGFyZ3VtZW50cylcblx0XHRyZXR1cm4gQFxuXG5cdHZhbGlkYXRlOiAocHJvdmlkZWRWYWx1ZT1AW0Bjb3JlVmFsdWVQcm9wXSwgdGVzdFVucmVxdWlyZWQsIHJlcG9ydCktPlxuXHRcdGlzVmFsaWQgPSBzd2l0Y2hcblx0XHRcdHdoZW4gQHNldHRpbmdzLnZhbGlkYXRvciB0aGVuIEBzZXR0aW5ncy52YWxpZGF0b3IocHJvdmlkZWRWYWx1ZSlcblx0XHRcdFxuXHRcdFx0d2hlbiBub3QgQHNldHRpbmdzLnJlcXVpcmVkIGFuZCBub3QgdGVzdFVucmVxdWlyZWQgdGhlbiB0cnVlXG5cblx0XHRcdHdoZW4gQF92YWxpZGF0ZShwcm92aWRlZFZhbHVlLCB0ZXN0VW5yZXF1aXJlZCwgcmVwb3J0KSBpcyBmYWxzZSB0aGVuIGZhbHNlXG5cblx0XHRcdHdoZW4gQHNldHRpbmdzLnJlcXVpcmVkIHRoZW4gc3dpdGNoXG5cdFx0XHRcdHdoZW4gQHNldHRpbmdzLm11bHRpcGxlIHRoZW4gISFwcm92aWRlZFZhbHVlPy5sZW5ndGhcblx0XHRcdFx0d2hlbiB0eXBlb2YgcHJvdmlkZWRWYWx1ZSBpcyAnc3RyaW5nJyB0aGVuICEhcHJvdmlkZWRWYWx1ZVxuXHRcdFx0XHRlbHNlIHByb3ZpZGVkVmFsdWU/XG5cdFx0XHRcblx0XHRcdGVsc2UgdHJ1ZVxuXG5cdFx0QHN0YXRlLnNob3dFcnJvciA9IGZhbHNlIGlmIGlzVmFsaWQgYW5kIEBzZXR0aW5ncy5jbGVhckVycm9yT25WYWxpZFxuXHRcdHJldHVybiBpc1ZhbGlkXG5cblx0dmFsaWRhdGVDb25kaXRpb25zOiAoY29uZGl0aW9ucyktPlxuXHRcdGlmIGNvbmRpdGlvbnNcblx0XHRcdHRvZ2dsZVZpc2liaWxpdHkgPSBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdGNvbmRpdGlvbnMgPSBAY29uZGl0aW9uc1xuXHRcdFx0dG9nZ2xlVmlzaWJpbGl0eSA9IHRydWVcblx0XHRcblx0XHRwYXNzZWRDb25kaXRpb25zID0gQ29uZGl0aW9uLnZhbGlkYXRlKGNvbmRpdGlvbnMpXG5cdFx0aWYgdG9nZ2xlVmlzaWJpbGl0eVxuXHRcdFx0cmV0dXJuIEBzdGF0ZS52aXNpYmxlID0gcGFzc2VkQ29uZGl0aW9uc1xuXHRcdGVsc2UgXG5cdFx0XHRyZXR1cm4gcGFzc2VkQ29uZGl0aW9uc1xuXG5cdHZhbGlkYXRlQW5kUmVwb3J0OiAocHJvdmlkZWRWYWx1ZSwgdGVzdFVucmVxdWlyZWQpLT5cblx0XHRpc1ZhbGlkID0gQHZhbGlkYXRlKHByb3ZpZGVkVmFsdWUsIHRlc3RVbnJlcXVpcmVkLCB0cnVlKVxuXHRcdEBzdGF0ZS5zaG93RXJyb3IgPSAhaXNWYWxpZFxuXHRcdHJldHVybiBpc1ZhbGlkXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpZWxkIiwiJ2NvbmRpdGlvbnMnOiAoY29uZGl0aW9ucyktPlxuXHRpZiBJUy5vYmplY3RQbGFpbihjb25kaXRpb25zKVxuXHRcdHt0YXJnZXQsIHZhbHVlfSBmb3IgdGFyZ2V0LHZhbHVlIG9mIGNvbmRpdGlvbnNcblx0ZWxzZSBpZiBJUy5hcnJheShjb25kaXRpb25zKVxuXHRcdGNvbmRpdGlvbnMubWFwIChpdGVtKS0+IGlmIElTLnN0cmluZyhpdGVtKSB0aGVuIHt0YXJnZXQ6aXRlbX0gZWxzZSBpdGVtXG5cbidjaG9pY2VzJzogKGNob2ljZXMpLT5cblx0aWYgSVMub2JqZWN0UGxhaW4oY2hvaWNlcylcblx0XHR7bGFiZWwsdmFsdWV9IGZvciBsYWJlbCx2YWx1ZSBvZiBjaG9pY2VzXG5cdGVsc2UgaWYgSVMuYXJyYXkoY2hvaWNlcylcblx0XHRjaG9pY2VzLm1hcCAoaXRlbSktPiBpZiBub3QgSVMub2JqZWN0UGxhaW4oaXRlbSkgdGhlbiB7bGFiZWw6aXRlbSwgdmFsdWU6aXRlbX0gZWxzZSBpdGVtXG5cbid2YWxpZFdoZW5SZWdleCc6IChyZWdleCktPlxuXHRpZiBJUy5zdHJpbmcocmVnZXgpIHRoZW4gbmV3IFJlZ0V4cChyZWdleCkgZWxzZSByZWdleCIsIkRyb3Bkb3duID0gaW1wb3J0ICcuLi8uLi9jb21wb25lbnRzL2Ryb3Bkb3duJ1xuTWFzayA9IGltcG9ydCAnLi4vLi4vY29tcG9uZW50cy9tYXNrJ1xuUkVHRVggPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9yZWdleCdcbktFWUNPREVTID0gaW1wb3J0ICcuLi8uLi9jb25zdGFudHMva2V5Q29kZXMnXG5oZWxwZXJzID0gaW1wb3J0ICcuLi8uLi9oZWxwZXJzJ1xuSVMgPSBpbXBvcnQgJy4uLy4uL2NoZWNrcydcbkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5leHRlbmQgPSBpbXBvcnQgJ3NtYXJ0LWV4dGVuZCdcblNpbXBseUJpbmQgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kJ1xuaW1wb3J0IHRlbXBsYXRlLCogYXMgdGVtcGxhdGVzIGZyb20gJy4vdGVtcGxhdGUnXG5pbXBvcnQgKiBhcyBkZWZhdWx0cyBmcm9tICcuL2RlZmF1bHRzJ1xuXG5jbGFzcyBUZXh0RmllbGQgZXh0ZW5kcyBpbXBvcnQgJy4uLydcblx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdHRlbXBsYXRlczogdGVtcGxhdGVzXG5cdGRlZmF1bHRzOiBkZWZhdWx0c1xuXG5cdGNvbnN0cnVjdG9yOiAoKS0+XG5cdFx0c3VwZXIoYXJndW1lbnRzLi4uKVxuXHRcdEBfdmFsdWUgPz0gJydcblx0XHRAc3RhdGUudHlwaW5nID0gZmFsc2Vcblx0XHRAY3Vyc29yID0gcHJldjowLCBjdXJyZW50OjBcblxuXHRcdGlmIG5vdCBAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXhcblx0XHRcdGlmIEBzZXR0aW5ncy5rZXlib2FyZCBpcyAnZW1haWwnIGFuZCBAc2V0dGluZ3MucmVxdWlyZWRcblx0XHRcdFx0QHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4ID0gUkVHRVguZW1haWxcblx0XHRcdGVsc2UgaWYgQHNldHRpbmdzLm1hc2sgaXMgJ05BTUUnIG9yIEBzZXR0aW5ncy5tYXNrLnBhdHRlcm4gaXMgJ05BTUUnXG5cdFx0XHRcdEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleCA9IC9eW2EtekEtWl17Mn0vXG5cdFx0XHRlbHNlIGlmIEBzZXR0aW5ncy5tYXNrIGlzICdGVUxMTkFNRScgb3IgQHNldHRpbmdzLm1hc2sucGF0dGVybiBpcyAnRlVMTE5BTUUnXG5cdFx0XHRcdEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleCA9IC9eW2EtekEtWl0rXFxzK1thLXpBLVpdKy9cblxuXHRcdGlmIG5vdCBAc2V0dGluZ3MubWFzay5wYXR0ZXJuXG5cdFx0XHRpZiBJUy5zdHJpbmcoQHNldHRpbmdzLm1hc2spXG5cdFx0XHRcdEBzZXR0aW5ncy5tYXNrID0gZXh0ZW5kLmRlZXAuY2xvbmUoQGRlZmF1bHRzLm1hc2ssIHBhdHRlcm46QHNldHRpbmdzLm1hc2spXG5cblx0XHRcdGVsc2UgaWYgSVMub2JqZWN0KEBzZXR0aW5ncy5tYXNrKVxuXHRcdFx0XHRAc2V0dGluZ3MubWFzay5wYXR0ZXJuID0gc3dpdGNoIEBzZXR0aW5ncy5rZXlib2FyZFxuXHRcdFx0XHRcdHdoZW4gJ2RhdGUnIHRoZW4gJ0RBVEUnXG5cdFx0XHRcdFx0d2hlbiAnbnVtYmVyJyB0aGVuICdOVU1CRVInXG5cdFx0XHRcdFx0d2hlbiAncGhvbmUnLCd0ZWwnIHRoZW4gJ1BIT05FJ1xuXHRcdFx0XHRcdHdoZW4gJ2VtYWlsJyB0aGVuICdFTUFJTCdcblx0XHRcdFxuXHRcdEBtYXNrID0gbmV3IE1hc2soQCwgQHNldHRpbmdzLm1hc2spIGlmIEBzZXR0aW5ncy5tYXNrLnBhdHRlcm5cblx0XHRAX2NyZWF0ZUVsZW1lbnRzKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzKClcblx0XHRAX2NvbnN0cnVjdG9yRW5kKClcblxuXG5cdF9nZXRWYWx1ZTogKCktPlxuXHRcdGlmIEBkcm9wZG93biBhbmQgQHNlbGVjdGVkIGFuZCBAX3ZhbHVlIGlzIEBzZWxlY3RlZC5sYWJlbFxuXHRcdFx0cmV0dXJuIEBzZWxlY3RlZC52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBAX3ZhbHVlXG5cblx0X3NldFZhbHVlOiAobmV3VmFsdWUpLT4gaWYgSVMuc3RyaW5nKG5ld1ZhbHVlKSBvciBJUy5udW1iZXIobmV3VmFsdWUpXG5cdFx0bmV3VmFsdWUgPSBTdHJpbmcobmV3VmFsdWUpXG5cdFx0QF92YWx1ZSA9IGlmIEBtYXNrIHRoZW4gQG1hc2suc2V0VmFsdWUobmV3VmFsdWUpIGVsc2UgbmV3VmFsdWVcblxuXHRfcmVjYWxjRGlzcGxheTogKCktPlxuXHRcdEBfdmFsdWUgPSBAX3ZhbHVlIGlmIEBzZXR0aW5ncy5hdXRvV2lkdGhcblxuXG5cdF9jcmVhdGVFbGVtZW50czogKCktPlxuXHRcdGdsb2JhbE9wdHMgPSB7cmVsYXRlZEluc3RhbmNlOkB9XG5cdFx0QGVsID0gQHRlbXBsYXRlLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuZGVmYXVsdCwgZ2xvYmFsT3B0cylcblxuXHRcdGlmIEBzZXR0aW5ncy5jaG9pY2VzXG5cdFx0XHRAZHJvcGRvd24gPSBuZXcgRHJvcGRvd24oQHNldHRpbmdzLmNob2ljZXMsIEApXG5cdFx0XHRAZHJvcGRvd24uYXBwZW5kVG8oQGVsLmNoaWxkLmlubmVyd3JhcClcblxuXHRcdGlmIEBzZXR0aW5ncy5pY29uXG5cdFx0XHRAdGVtcGxhdGVzLmljb24uc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5pY29uLCBnbG9iYWxPcHRzKS5hcHBlbmQoQHNldHRpbmdzLmljb24pLmluc2VydEJlZm9yZShAZWwuY2hpbGQuaW5wdXQpXG5cblx0XHRpZiBAc2V0dGluZ3MuY2hlY2ttYXJrXG5cdFx0XHRAdGVtcGxhdGVzLmNoZWNrbWFyay5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmNoZWNrbWFyaywgZ2xvYmFsT3B0cykuaW5zZXJ0QWZ0ZXIoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFxuXHRcdEBlbC5jaGlsZC5pbnB1dC5wcm9wICd0eXBlJywgc3dpdGNoIEBzZXR0aW5ncy5rZXlib2FyZFxuXHRcdFx0d2hlbiAnbnVtYmVyJywndGVsJywncGhvbmUnIHRoZW4gJ3RlbCdcblx0XHRcdHdoZW4gJ3Bhc3N3b3JkJyB0aGVuICdwYXNzd29yZCdcblx0XHRcdHdoZW4gJ3VybCcgdGhlbiAndXJsJ1xuXHRcdFx0IyB3aGVuICdlbWFpbCcgdGhlbiAnZW1haWwnXG5cdFx0XHRlbHNlICd0ZXh0J1xuXG5cdFx0QGVsLnN0YXRlICdoYXNMYWJlbCcsIEBzZXR0aW5ncy5sYWJlbFxuXHRcdEBlbC5jaGlsZC5pbm5lcndyYXAucmF3Ll9xdWlja0ZpZWxkID0gQGVsLmNoaWxkLmlucHV0LnJhdy5fcXVpY2tGaWVsZCA9IEBcblx0XHRyZXR1cm4gQGVsLmNoaWxkZlxuXG5cblx0X2F0dGFjaEJpbmRpbmdzOiAoKS0+XG5cdFx0QF9hdHRhY2hCaW5kaW5nc19lbFN0YXRlKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXkoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3NfZGlzcGxheV9hdXRvV2lkdGgoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3NfdmFsdWUoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3NfYXV0b2NvbXBsZXRlKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX3N0YXRlVHJpZ2dlcnMoKVxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2VsU3RhdGU6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCd2aXNpYmxlJykub2YoQHN0YXRlKS50byBcdCh2aXNpYmxlKT0+IEBlbC5zdGF0ZSAndmlzaWJsZScsIHZpc2libGVcblx0XHRTaW1wbHlCaW5kKCdob3ZlcmVkJykub2YoQHN0YXRlKS50byBcdChob3ZlcmVkKT0+IEBlbC5zdGF0ZSAnaG92ZXInLCBob3ZlcmVkXG5cdFx0U2ltcGx5QmluZCgnZm9jdXNlZCcpLm9mKEBzdGF0ZSkudG8gXHQoZm9jdXNlZCk9PiBAZWwuc3RhdGUgJ2ZvY3VzJywgZm9jdXNlZFxuXHRcdFNpbXBseUJpbmQoJ2ZpbGxlZCcpLm9mKEBzdGF0ZSkudG8gXHRcdChmaWxsZWQpPT4gQGVsLnN0YXRlICdmaWxsZWQnLCBmaWxsZWRcblx0XHRTaW1wbHlCaW5kKCdkaXNhYmxlZCcpLm9mKEBzdGF0ZSkudG8gXHQoZGlzYWJsZWQpPT4gQGVsLnN0YXRlICdkaXNhYmxlZCcsIGRpc2FibGVkXG5cdFx0U2ltcGx5QmluZCgnc2hvd0xhYmVsJykub2YoQHN0YXRlKS50byBcdChzaG93TGFiZWwpPT4gQGVsLnN0YXRlICdzaG93TGFiZWwnLCBzaG93TGFiZWxcblx0XHRTaW1wbHlCaW5kKCdzaG93RXJyb3InKS5vZihAc3RhdGUpLnRvIFx0KHNob3dFcnJvcik9PiBAZWwuc3RhdGUgJ3Nob3dFcnJvcicsIHNob3dFcnJvclxuXHRcdFNpbXBseUJpbmQoJ3Nob3dIZWxwJykub2YoQHN0YXRlKS50byBcdChzaG93SGVscCk9PiBAZWwuc3RhdGUgJ3Nob3dIZWxwJywgc2hvd0hlbHBcblx0XHRTaW1wbHlCaW5kKCd2YWxpZCcpLm9mKEBzdGF0ZSkudG8gKHZhbGlkKT0+XG5cdFx0XHRAZWwuc3RhdGUgJ3ZhbGlkJywgdmFsaWRcblx0XHRcdEBlbC5zdGF0ZSAnaW52YWxpZCcsICF2YWxpZFxuXHRcdFxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXk6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdwbGFjZWhvbGRlcicpLm9mKEBzdGF0ZSlcblx0XHRcdC50bygndGV4dCcpLm9mKEBlbC5jaGlsZC5wbGFjZWhvbGRlcilcblx0XHRcdFx0LnRyYW5zZm9ybSAocGxhY2Vob2xkZXIpPT4gc3dpdGNoXG5cdFx0XHRcdFx0d2hlbiBwbGFjZWhvbGRlciBpcyB0cnVlIGFuZCBAc2V0dGluZ3MubGFiZWwgdGhlbiBAc2V0dGluZ3MubGFiZWxcblx0XHRcdFx0XHR3aGVuIElTLnN0cmluZyhwbGFjZWhvbGRlcikgdGhlbiBwbGFjZWhvbGRlclxuXHRcdFx0XHRcdGVsc2UgJydcblxuXHRcdFNpbXBseUJpbmQoJ2Rpc2FibGVkJywgdXBkYXRlT25CaW5kOkBzdGF0ZS5kaXNhYmxlZCkub2YoQHN0YXRlKVxuXHRcdFx0LnRvIChkaXNhYmxlZCwgcHJldik9PiBpZiBAc2V0dGluZ3MuY2hlY2ttYXJrXG5cdFx0XHRcdGlmIGRpc2FibGVkIG9yIChub3QgZGlzYWJsZWQgYW5kIHByZXY/KSB0aGVuIHNldFRpbWVvdXQgKCk9PlxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jaGVja21hcmtfbWFzazEucmVjYWxjU3R5bGUoKVxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jaGVja21hcmtfbWFzazIucmVjYWxjU3R5bGUoKVxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jaGVja21hcmtfcGF0Y2gucmVjYWxjU3R5bGUoKVxuXHRcdFx0XHRcdCMgQGVsLmNoaWxkLmNoZWNrbWFyay5yZWNhbGNTdHlsZSh0cnVlKVxuXHRcdFxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXlfYXV0b1dpZHRoOiAoKS0+XG5cdFx0U2ltcGx5QmluZCgnd2lkdGgnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUpLm9mKEBzdGF0ZSlcblx0XHRcdC50byAod2lkdGgpPT4gKGlmIEBzZXR0aW5ncy5hdXRvV2lkdGggdGhlbiBAZWwuY2hpbGQuaW5wdXQgZWxzZSBAZWwpLnN0eWxlKCd3aWR0aCcsIHdpZHRoKVxuXHRcdFx0LnRyYW5zZm9ybSBAX2Zvcm1hdFdpZHRoLmJpbmQoQClcblx0XHRcdC51cGRhdGVPbignaXNNb2JpbGUnKS5vZihAc3RhdGUpXG5cblx0XHRpZiBAc2V0dGluZ3MuYXV0b1dpZHRoXG5cdFx0XHRTaW1wbHlCaW5kKCdfdmFsdWUnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQClcblx0XHRcdFx0LnRvKCd3aWR0aCcpLm9mKEBzdGF0ZSlcblx0XHRcdFx0XHQudHJhbnNmb3JtICgpPT4gXCIje0BfZ2V0SW5wdXRBdXRvV2lkdGgoKX1weFwiXG5cdFx0XHRcdFx0LnVwZGF0ZU9uKCdldmVudDppbnNlcnRlZCcpLm9mKEBlbClcblx0XHRcdFx0XHQudXBkYXRlT24oJ3Zpc2libGUnKS5vZihAc3RhdGUpXG5cdFx0XG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfdmFsdWU6ICgpLT5cblx0XHRpbnB1dCA9IEBlbC5jaGlsZC5pbnB1dC5yYXdcblx0XHRcblx0XHRyZXNldElucHV0ID0gKCk9PlxuXHRcdFx0ZmlsbGVkID0gIUBtYXNrLmlzRW1wdHkoKVxuXHRcdFx0aWYgbm90IGZpbGxlZFxuXHRcdFx0XHRAc2VsZWN0aW9uKEBtYXNrLmN1cnNvciA9IDApXG5cdFx0XHRcdEBfdmFsdWUgPSAnJ1xuXHRcdFx0XHRAc3RhdGUuZmlsbGVkID0gZmFsc2Vcblx0XHRcdFxuXHRcdFx0cmV0dXJuIGZpbGxlZFxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmlucHV0Jykub2YoaW5wdXQpLnRvICgpPT5cblx0XHRcdEB2YWx1ZSA9IGlucHV0LnZhbHVlXG5cdFx0XHRAc2VsZWN0aW9uKEBtYXNrLmN1cnNvcikgaWYgQG1hc2tcblx0XHRcdEBlbWl0KCdpbnB1dCcsIEB2YWx1ZSlcblxuXHRcdFNpbXBseUJpbmQoJ192YWx1ZScsIHVwZGF0ZUV2ZW5JZlNhbWU6ISFAbWFzaykub2YoQClcblx0XHRcdC50bygndmFsdWUnKS5vZihpbnB1dClcdFx0XG5cdFx0XHQuYW5kLnRvICh2YWx1ZSk9PlxuXHRcdFx0XHRmaWxsZWQgPSAhIXZhbHVlXG5cdFx0XHRcdGZpbGxlZCA9IHJlc2V0SW5wdXQoKSBpZiBmaWxsZWQgYW5kIEBtYXNrIGFuZCBAbWFzay5ndWlkZSBhbmQgKCFAc3RhdGUuZm9jdXNlZCBvciBAbWFzay5jdXJzb3IgaXMgMClcblx0XHRcdFx0QHN0YXRlLmZpbGxlZCA9IGZpbGxlZFxuXHRcdFx0XHRAc3RhdGUuaW50ZXJhY3RlZCA9IHRydWUgaWYgZmlsbGVkXG5cdFx0XHRcdEBzdGF0ZS52YWxpZCA9IEB2YWxpZGF0ZSh1bmRlZmluZWQsIHRydWUpXG5cdFx0XHRcdEBlbWl0KCdpbnB1dCcsIEB2YWx1ZSkgdW5sZXNzIEBzdGF0ZS5mb2N1c2VkXG5cblx0XHRTaW1wbHlCaW5kKCdldmVudDprZXlkb3duJykub2YoQGVsLmNoaWxkLmlucHV0KS50byAoZXZlbnQpPT5cblx0XHRcdEBlbWl0KCdzdWJtaXQnKSBpZiBldmVudC5rZXlDb2RlIGlzIEtFWUNPREVTLmVudGVyXG5cdFx0XHRAZW1pdChcImtleS0je2V2ZW50LmtleUNvZGV9XCIpXG5cblx0XHRTaW1wbHlCaW5kKCdldmVudDpibHVyJykub2YoQGVsLmNoaWxkLmlucHV0KS50byhyZXNldElucHV0KSBpZiBAbWFzayBhbmQgQG1hc2suZ3VpZGVcblx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc19hdXRvY29tcGxldGU6ICgpLT4gaWYgQGRyb3Bkb3duXG5cdFx0U2ltcGx5QmluZC5kZWZhdWx0T3B0aW9ucy51cGRhdGVPbkJpbmQgPSBmYWxzZVxuXG5cdFx0U2ltcGx5QmluZCgndHlwaW5nJywgdXBkYXRlRXZlbklmU2FtZTp0cnVlKS5vZihAc3RhdGUpLnRvIChpc1R5cGluZyk9PlxuXHRcdFx0aWYgaXNUeXBpbmdcblx0XHRcdFx0cmV0dXJuIGlmIG5vdCBAX3ZhbHVlXG5cdFx0XHRcdGlmIEBkcm9wZG93bi5pc09wZW5cblx0XHRcdFx0XHRAZHJvcGRvd24ubGlzdC5jYWxjRGlzcGxheSgpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRAZHJvcGRvd24uaXNPcGVuID0gdHJ1ZVxuXHRcdFx0XHRcdFNpbXBseUJpbmQoJ2V2ZW50OmNsaWNrJykub2YoZG9jdW1lbnQpXG5cdFx0XHRcdFx0XHQub25jZS50byAoKT0+IEBkcm9wZG93bi5pc09wZW4gPSBmYWxzZVxuXHRcdFx0XHRcdFx0LmNvbmRpdGlvbiAoZXZlbnQpPT4gbm90IERPTShldmVudC50YXJnZXQpLnBhcmVudE1hdGNoaW5nIChwYXJlbnQpPT4gcGFyZW50IGlzIEBlbC5jaGlsZC5pbm5lcndyYXBcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGRyb3Bkb3duLmlzT3BlbiA9IGZhbHNlXG5cblx0XHRTaW1wbHlCaW5kKCdfdmFsdWUnKS5vZihAKS50byAodmFsdWUpPT5cblx0XHRcdGZvciBjaG9pY2UgaW4gQGRyb3Bkb3duLmNob2ljZXNcblx0XHRcdFx0c2hvdWxkQmVWaXNpYmxlID0gaWYgbm90IHZhbHVlIHRoZW4gdHJ1ZSBlbHNlIGhlbHBlcnMuZnV6enlNYXRjaCh2YWx1ZSwgY2hvaWNlLmxhYmVsKVxuXHRcdFx0XHRjaG9pY2UudmlzaWJsZSA9IHNob3VsZEJlVmlzaWJsZSBpZiBjaG9pY2UudmlzaWJsZSBpc250IHNob3VsZEJlVmlzaWJsZVxuXG5cdFx0XHRpZiBAZHJvcGRvd24uaXNPcGVuIGFuZCBub3QgdmFsdWVcblx0XHRcdFx0QGRyb3Bkb3duLmlzT3BlbiA9IGZhbHNlXG5cdFx0XHRyZXR1cm5cblxuXG5cdFx0QGRyb3Bkb3duLm9uU2VsZWN0ZWQgKHNlbGVjdGVkQ2hvaWNlKT0+XG5cdFx0XHRAc2VsZWN0ZWQgPSBzZWxlY3RlZENob2ljZVxuXHRcdFx0QHZhbHVlID0gc2VsZWN0ZWRDaG9pY2UubGFiZWxcblx0XHRcdEBkcm9wZG93bi5pc09wZW4gPSBmYWxzZVxuXHRcdFx0QHNlbGVjdGlvbihAZWwuY2hpbGQuaW5wdXQucmF3LnZhbHVlLmxlbmd0aClcblx0XHRcblxuXHRcdFNpbXBseUJpbmQuZGVmYXVsdE9wdGlvbnMudXBkYXRlT25CaW5kID0gdHJ1ZVxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX3N0YXRlVHJpZ2dlcnM6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdldmVudDptb3VzZWVudGVyJykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQHN0YXRlLmhvdmVyZWQgPSB0cnVlXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6bW91c2VsZWF2ZScpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBzdGF0ZS5ob3ZlcmVkID0gZmFsc2VcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmZvY3VzJykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQHN0YXRlLmZvY3VzZWQgPSB0cnVlOyBpZiBAc3RhdGUuZGlzYWJsZWQgdGhlbiBAYmx1cigpXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6Ymx1cicpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBzdGF0ZS50eXBpbmcgPSBAc3RhdGUuZm9jdXNlZCA9IGZhbHNlXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6aW5wdXQnKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUudHlwaW5nID0gdHJ1ZVxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmtleWRvd24nKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAY3Vyc29yLnByZXYgPSBAc2VsZWN0aW9uKCkuZW5kXG5cblx0XHRyZXR1cm5cblxuXG5cdF9zY2hlZHVsZUN1cnNvclJlc2V0OiAoKS0+XG5cdFx0ZGlmZkluZGV4ID0gaGVscGVycy5nZXRJbmRleE9mRmlyc3REaWZmKEBtYXNrLnZhbHVlLCBAbWFzay5wcmV2LnZhbHVlKVxuXHRcdGN1cnJlbnRDdXJzb3IgPSBAY3Vyc29yLmN1cnJlbnRcblx0XHRuZXdDdXJzb3IgPSBAbWFzay5ub3JtYWxpemVDdXJzb3JQb3MoY3VycmVudEN1cnNvciwgQGN1cnNvci5wcmV2KVxuXG5cdFx0aWYgbmV3Q3Vyc29yIGlzbnQgY3VycmVudEN1cnNvclxuXHRcdFx0QHNlbGVjdGlvbihuZXdDdXJzb3IpXG5cdFx0cmV0dXJuXG5cblxuXHRfc2V0VmFsdWVJZk5vdFNldDogKCktPlxuXHRcdGlmIEBlbC5jaGlsZC5pbnB1dC5yYXcudmFsdWUgaXNudCBAX3ZhbHVlXG5cdFx0XHRAZWwuY2hpbGQuaW5wdXQucmF3LnZhbHVlID0gQF92YWx1ZVxuXHRcdHJldHVyblxuXG5cblxuXHRfZ2V0SW5wdXRBdXRvV2lkdGg6ICgpLT5cblx0XHRpZiBAX3ZhbHVlXG5cdFx0XHRAX3NldFZhbHVlSWZOb3RTZXQoKVxuXHRcdFx0QGVsLmNoaWxkLmlucHV0LnN0eWxlKCd3aWR0aCcsIDApXG5cdFx0XHRAZWwuY2hpbGQuaW5wdXQucmF3LnNjcm9sbExlZnQgPSAxZSsxMFxuXHRcdFx0aW5wdXRXaWR0aCA9IE1hdGgubWF4KEBlbC5jaGlsZC5pbnB1dC5yYXcuc2Nyb2xsTGVmdCtAZWwuY2hpbGQuaW5wdXQucmF3Lm9mZnNldFdpZHRoLCBAZWwuY2hpbGQuaW5wdXQucmF3LnNjcm9sbFdpZHRoKSArIDJcblx0XHRcdGxhYmVsV2lkdGggPSBpZiBAc2V0dGluZ3MubGFiZWwgYW5kIEBlbC5jaGlsZC5sYWJlbC5zdHlsZVNhZmUoJ3Bvc2l0aW9uJykgaXMgJ2Fic29sdXRlJyB0aGVuIEBlbC5jaGlsZC5sYWJlbC5yZWN0LndpZHRoIGVsc2UgMFxuXHRcdGVsc2Vcblx0XHRcdGlucHV0V2lkdGggPSBAZWwuY2hpbGQucGxhY2Vob2xkZXIucmVjdC53aWR0aFxuXHRcdFx0bGFiZWxXaWR0aCA9IDBcblx0XHRcblx0XHRyZXR1cm4gTWF0aC5taW4gQF9nZXRXaWR0aFNldHRpbmcoJ21heCcpLCBNYXRoLm1heChAX2dldFdpZHRoU2V0dGluZygnbWluJyksIGlucHV0V2lkdGgsIGxhYmVsV2lkdGgpXG5cblxuXHRfZ2V0V2lkdGhTZXR0aW5nOiAodGFyZ2V0KS0+XG5cdFx0dGFyZ2V0ICs9ICdXaWR0aCcgaWYgdGFyZ2V0IGlzICdtaW4nIG9yIHRhcmdldCBpcyAnbWF4J1x0XHRcblx0XHRpZiB0eXBlb2YgQHNldHRpbmdzW3RhcmdldF0gaXMgJ251bWJlcidcblx0XHRcdHJlc3VsdCA9IEBzZXR0aW5nc1t0YXJnZXRdXG5cdFx0XG5cdFx0ZWxzZSBpZlx0dHlwZW9mIEBzZXR0aW5nc1t0YXJnZXRdIGlzICdzdHJpbmcnXG5cdFx0XHRyZXN1bHQgPSBwYXJzZUZsb2F0KEBzZXR0aW5nc1t0YXJnZXRdKVxuXG5cdFx0XHRpZiBoZWxwZXJzLmluY2x1ZGVzKEBzZXR0aW5nc1t0YXJnZXRdLCAnJScpXG5cdFx0XHRcdGlmIChwYXJlbnQ9QGVsLnBhcmVudCkgYW5kIHBhcmVudC5zdHlsZSgnZGlzcGxheScpIGlzICdibG9jaydcblx0XHRcdFx0XHRwYXJlbnRXaWR0aCA9IHBhcmVudC5zdHlsZVBhcnNlZCgnd2lkdGgnKSAtIHBhcmVudC5zdHlsZVBhcnNlZCgncGFkZGluZ0xlZnQnKSAtIHBhcmVudC5zdHlsZVBhcnNlZCgncGFkZGluZ1JpZ2h0JykgLSAyXG5cdFx0XHRcdFx0cmVzdWx0ID0gcGFyZW50V2lkdGggKiAocmVzdWx0LzEwMClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJlc3VsdCA9IDBcblxuXHRcdHJldHVybiByZXN1bHQgb3IgKGlmIHRhcmdldCBpcyAnbWluV2lkdGgnIHRoZW4gMCBlbHNlIEluZmluaXR5KVxuXG5cblx0X3ZhbGlkYXRlOiAocHJvdmlkZWRWYWx1ZSktPlxuXHRcdGlmIEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleCBhbmQgSVMucmVnZXgoQHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4KVxuXHRcdFx0cmV0dXJuIGZhbHNlIGlmIG5vdCBAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXgudGVzdChwcm92aWRlZFZhbHVlKVxuXHRcdFxuXHRcdGlmIEBzZXR0aW5ncy52YWxpZFdoZW5Jc0Nob2ljZSBhbmQgQHNldHRpbmdzLmNob2ljZXM/Lmxlbmd0aFxuXHRcdFx0bWF0Y2hpbmdDaG9pY2UgPSBAc2V0dGluZ3MuY2hvaWNlcy5maWx0ZXIgKGNob2ljZSktPiBjaG9pY2UudmFsdWUgaXMgcHJvdmlkZWRWYWx1ZVxuXHRcdFx0cmV0dXJuIGZhbHNlIGlmIG5vdCBtYXRjaGluZ0Nob2ljZS5sZW5ndGhcblxuXHRcdGlmIEBzZXR0aW5ncy5taW5MZW5ndGhcblx0XHRcdHJldHVybiBmYWxzZSBpZiBwcm92aWRlZFZhbHVlLmxlbmd0aCA8IEBzZXR0aW5ncy5taW5MZW5ndGhcblxuXHRcdGlmIEBzZXR0aW5ncy5tYXhMZW5ndGhcblx0XHRcdHJldHVybiBmYWxzZSBpZiBwcm92aWRlZFZhbHVlLmxlbmd0aCA+PSBAc2V0dGluZ3MubWF4TGVuZ3RoXG5cblx0XHRpZiBAbWFza1xuXHRcdFx0cmV0dXJuIGZhbHNlIGlmIG5vdCBAbWFzay52YWxpZGF0ZShwcm92aWRlZFZhbHVlKVxuXHRcdFxuXHRcdHJldHVybiB0cnVlXG5cblxuXHRzZWxlY3Rpb246IChhcmcpLT5cblx0XHRpZiBJUy5vYmplY3QoYXJnKVxuXHRcdFx0c3RhcnQgPSBhcmcuc3RhcnRcblx0XHRcdGVuZCA9IGFyZy5lbmRcblx0XHRlbHNlXG5cdFx0XHRzdGFydCA9IGFyZ1xuXHRcdFx0ZW5kID0gYXJndW1lbnRzWzFdXG5cblx0XHRpZiBzdGFydD9cblx0XHRcdGVuZCA9IHN0YXJ0IGlmIG5vdCBlbmQgb3IgZW5kIDwgc3RhcnRcblx0XHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcuc2V0U2VsZWN0aW9uUmFuZ2Uoc3RhcnQsIGVuZClcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiAnc3RhcnQnOkBlbC5jaGlsZC5pbnB1dC5yYXcuc2VsZWN0aW9uU3RhcnQsICdlbmQnOkBlbC5jaGlsZC5pbnB1dC5yYXcuc2VsZWN0aW9uRW5kXG5cblxuXHRmb2N1czogKCktPlxuXHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcuZm9jdXMoKVxuXG5cdGJsdXI6ICgpLT5cblx0XHRAZWwuY2hpbGQuaW5wdXQucmF3LmJsdXIoKVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0RmllbGQiLCJjdXJyZW50SUQgPSAwXG5hcnJheU11dGF0b3JNZXRob2RzID0gWydwdXNoJywncG9wJywnc2hpZnQnLCd1bnNoaWZ0Jywnc3BsaWNlJywncmV2ZXJzZScsJ3NvcnQnXVxuZHVtbXlQcm9wZXJ0eURlc2NyaXB0b3IgPSB7fVxuYm91bmRJbnN0YW5jZXMgPSB7fVxucGxhY2Vob2xkZXIgPSBbJ3t7JywgJ319J11cbnNldHRpbmdzID0gT2JqZWN0LmNyZWF0ZVxuXHRzaWxlbnQ6XHRcdFx0XHRcdGZhbHNlXG4sXG5cdHBsYWNlaG9sZGVyOlxuXHRcdGdldDogKCktPiBwbGFjZWhvbGRlclxuXHRcdHNldDogKG5ld1BsYWNlaG9sZGVyKS0+IGlmIGNoZWNrSWYuaXNBcnJheShuZXdQbGFjZWhvbGRlcikgYW5kIG5ld1BsYWNlaG9sZGVyLmxlbmd0aCBpcyAyXG5cdFx0XHRwbGFjZWhvbGRlciA9IG5ld1BsYWNlaG9sZGVyXG5cdFx0XHRzZXRQaG9sZGVyUmVnRXgoKVxuXHRcdFx0cmV0dXJuXG5cblxuZGVmYXVsdE9wdGlvbnMgPSBcblx0ZGVsYXk6XHRcdFx0XHRcdGZhbHNlXG5cdHRocm90dGxlOlx0XHRcdFx0ZmFsc2Vcblx0c2ltcGxlU2VsZWN0b3I6XHRcdFx0ZmFsc2Vcblx0cHJvbWlzZVRyYW5zZm9ybXM6XHRcdGZhbHNlXG5cdGRpc3BhdGNoRXZlbnRzOlx0XHRcdGZhbHNlXG5cdHNlbmRBcnJheUNvcGllczpcdFx0ZmFsc2Vcblx0dXBkYXRlRXZlbklmU2FtZTpcdFx0ZmFsc2Vcblx0dXBkYXRlT25CaW5kOlx0XHRcdHRydWVcblxuXG5pbXBvcnQgJy4vbWlzYydcbmltcG9ydCAnLi9TaW1wbHlCaW5kJ1xuaW1wb3J0ICcuL0JpbmRpbmcnXG5pbXBvcnQgJy4vQmluZGluZ0ludGVyZmFjZSdcbmltcG9ydCAnLi9Hcm91cEJpbmRpbmcnXG5cbm1vZHVsZS5leHBvcnRzID0gU2ltcGx5QmluZCIsImltcG9ydCAnLi9oZWxwZXJzJ1xuaW1wb3J0ICcuL2Vycm9yc0FuZFdhcm5pbmdzJ1xuIiwiZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHlcbmdldERlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yXG5cbmltcG9ydCAnLi9jaGFuZ2VFdmVudCdcbmltcG9ydCAnLi9yZXF1aXJlc0RvbURlc2NyaXB0b3JGaXgnXG5pbXBvcnQgJy4vd2luZG93UHJvcHNUb0lnbm9yZSdcblxuXG5zZXRWYWx1ZU5vb3AgPSAodiwgcHVibGlzaGVyKS0+IEB1cGRhdGVBbGxTdWJzKHB1Ymxpc2hlciBvciBAKVxuXG5nZW5JRCA9ICgpLT4gJycrKCsrY3VycmVudElEKVxuXG5nZW5PYmogPSAoKS0+IE9iamVjdC5jcmVhdGUobnVsbClcblxuZ2VuUHJveGllZEludGVyZmFjZSA9IChpc1N1YiwgY29tcGxldGVDYWxsYmFjayktPiAoc3ViamVjdCwgY3VzdG9tT3B0aW9ucywgc2F2ZU9wdGlvbnMpLT5cblx0U2ltcGx5QmluZChzdWJqZWN0LCBjdXN0b21PcHRpb25zLCBzYXZlT3B0aW9ucywgaXNTdWIsIGNvbXBsZXRlQ2FsbGJhY2spXG5cbmdlblNlbGZVcGRhdGVyID0gKGJpbmRpbmcsIGZldGNoVmFsdWUpLT5cblx0YmluZGluZy5zZWxmVXBkYXRlciBvclxuXHRiaW5kaW5nLnNlbGZVcGRhdGVyID0gbmV3IEJpbmRpbmcgKCktPlxuXHRcdGlmIGZldGNoVmFsdWUgdGhlbiBiaW5kaW5nLnNldFZhbHVlKGJpbmRpbmcuZmV0Y2hEaXJlY3RWYWx1ZSgpLCBiaW5kaW5nLCB0cnVlKSBlbHNlIGJpbmRpbmcudXBkYXRlQWxsU3VicyhiaW5kaW5nKVxuXHQsICdGdW5jJywge31cblxuXG4jID09PT0gQ2hlY2tzID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0ICcuL2NoZWNrcydcblxuXG4jID09PT0gRGVzY3JpcHRvciBNb2RpZmljYXRpb24gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgJy4vZGVzY3JpcHRvci1tb2QnXG5cblxuIyA9PT09IE9iamVjdCBjbG9uaW5nID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0ICcuL2Nsb25pbmcnXG5cblxuIyA9PT09IEJpbmRpbmcgQ2FjaGUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgJy4vY2FjaGUnXG5cblxuIyA9PT09IFBsYWNlaG9sZGVycyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCAnLi9wbGFjZWhvbGRlcnMnXG5cblxuIyA9PT09IEVycm9ycyArIFdhcm5pbmdzID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0ICcuL2Vycm9ycydcblxuXG5cblxuXG5cblxuIiwiY2FjaGVkRXZlbnQgPSBudWxsXG5cbmNoYW5nZUV2ZW50ID0gKCktPlxuXHRpZiBub3QgY2FjaGVkRXZlbnRcblx0XHRldmVudCA9IGNhY2hlZEV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jylcblx0XHRldmVudC5pbml0RXZlbnQoJ2NoYW5nZScsIHRydWUsIGZhbHNlKVxuXHRcdGV2ZW50Ll9zYiA9IHRydWVcblxuXHRyZXR1cm4gY2FjaGVkRXZlbnQiLCJyZXF1aXJlc0RvbURlc2NyaXB0b3JGaXggPSAoJ2NsYXNzTmFtZScgbm90IG9mIEVsZW1lbnQ6Oikgb3Igbm90IGdldERlc2NyaXB0b3IoRWxlbWVudDo6LCAnY2xhc3NOYW1lJykuZ2V0Iiwid2luZG93UHJvcHNUb0lnbm9yZSA9IFtcblx0J2lubmVyV2lkdGgnXG5cdCdpbm5lckhlaWdodCdcblx0J291dGVyV2lkdGgnXG5cdCdvdXRlckhlaWdodCdcblx0J3Njcm9sbFgnXG5cdCdzY3JvbGxZJ1xuXHQncGFnZVhPZmZzZXQnXG5cdCdwYWdlWU9mZnNldCdcblx0J3NjcmVlblgnXG5cdCdzY3JlZW5ZJ1xuXHQnc2NyZWVuTGVmdCdcblx0J3NjcmVlblRvcCdcbl0iLCJ0YXJnZXRJbmNsdWRlcyA9ICh0YXJnZXQsIGl0ZW0pLT4gdGFyZ2V0IGFuZCB0YXJnZXQuaW5kZXhPZihpdGVtKSBpc250IC0xXG5cbmNoZWNrSWYgPVxuXHRpc0RlZmluZWQ6IChzdWJqZWN0KS0+IHN1YmplY3QgaXNudCB1bmRlZmluZWRcblx0XG5cdGlzQXJyYXk6IChzdWJqZWN0KS0+IHN1YmplY3QgaW5zdGFuY2VvZiBBcnJheVxuXHRcblx0aXNPYmplY3Q6IChzdWJqZWN0KS0+IHR5cGVvZiBzdWJqZWN0IGlzICdvYmplY3QnIGFuZCBzdWJqZWN0ICMgMm5kIGNoZWNrIGlzIHRvIHRlc3QgYWdhaW5zdCAnbnVsbCcgdmFsdWVzXG5cblx0aXNTdHJpbmc6IChzdWJqZWN0KS0+IHR5cGVvZiBzdWJqZWN0IGlzICdzdHJpbmcnXG5cdFxuXHRpc051bWJlcjogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ251bWJlcidcblx0XG5cdGlzRnVuY3Rpb246IChzdWJqZWN0KS0+IHR5cGVvZiBzdWJqZWN0IGlzICdmdW5jdGlvbidcblxuXHRpc0JpbmRpbmdJbnRlcmZhY2U6IChzdWJqZWN0KS0+IHN1YmplY3QgaW5zdGFuY2VvZiBCaW5kaW5nSW50ZXJmYWNlXG5cdFxuXHRpc0JpbmRpbmc6IChzdWJqZWN0KS0+IHN1YmplY3QgaW5zdGFuY2VvZiBCaW5kaW5nXG5cblx0aXNJdGVyYWJsZTogKHN1YmplY3QpLT4gY2hlY2tJZi5pc09iamVjdChzdWJqZWN0KSBhbmQgY2hlY2tJZi5pc051bWJlcihzdWJqZWN0Lmxlbmd0aClcblxuXHRpc0RvbTogKHN1YmplY3QpLT4gc3ViamVjdC5ub2RlTmFtZSBhbmQgc3ViamVjdC5ub2RlVHlwZSBpcyAxXG5cblx0aXNEb21JbnB1dDogKHN1YmplY3QpLT5cblx0XHRub2RlTmFtZSA9IHN1YmplY3Qubm9kZU5hbWVcblx0XHRyZXR1cm4gbm9kZU5hbWUgaXMgJ0lOUFVUJyBvciBub2RlTmFtZSBpcyAnVEVYVEFSRUEnIG9yIG5vZGVOYW1lIGlzICdTRUxFQ1QnXG5cblx0aXNEb21SYWRpbzogKHN1YmplY3QpLT4gc3ViamVjdC50eXBlIGlzICdyYWRpbydcblxuXHRpc0RvbUNoZWNrYm94OiAoc3ViamVjdCktPiBzdWJqZWN0LnR5cGUgaXMgJ2NoZWNrYm94J1xuXG5cdGlzRWxDb2xsZWN0aW9uOiAoc3ViamVjdCktPiAoc3ViamVjdCBpbnN0YW5jZW9mIE5vZGVMaXN0KSBvciAoc3ViamVjdCBpbnN0YW5jZW9mIEhUTUxDb2xsZWN0aW9uKSBvciAod2luZG93LmpRdWVyeSBhbmQgc3ViamVjdCBpbnN0YW5jZW9mIGpRdWVyeSlcblxuXHRkb21FbHNBcmVTYW1lOiAoaXRlcmFibGUpLT5cblx0XHR0eXBlID0gaXRlcmFibGVbMF0udHlwZVxuXHRcdGl0ZW1zV2l0aFNhbWVUeXBlID0gW10uZmlsdGVyLmNhbGwgaXRlcmFibGUsIChpdGVtKS0+IGl0ZW0udHlwZSBpcyB0eXBlXG5cblx0XHRyZXR1cm4gaXRlbXNXaXRoU2FtZVR5cGUubGVuZ3RoIGlzIGl0ZXJhYmxlLmxlbmd0aFxuXG5cdGlzRG9tTm9kZTogKHN1YmplY3QpLT4gY2hlY2tJZi5pc0RvbShzdWJqZWN0KSBvciBzdWJqZWN0IGlzIHdpbmRvdyBvciBzdWJqZWN0IGlzIGRvY3VtZW50IiwiZmV0Y2hEZXNjcmlwdG9yID0gKG9iamVjdCwgcHJvcGVydHksIGlzUHJvdG8pLT5cblx0ZGVzY3JpcHRvciA9IGdldERlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSlcblx0aWYgZGVzY3JpcHRvclxuXHRcdGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZSBpZiBpc1Byb3RvXG5cdFx0cmV0dXJuIGRlc2NyaXB0b3Jcblx0XG5cdGVsc2UgaWYgb2JqZWN0UHJvdG89T2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdClcblx0XHRyZXR1cm4gZmV0Y2hEZXNjcmlwdG9yKG9iamVjdFByb3RvLCBwcm9wZXJ0eSwgdHJ1ZSlcblxuXG5jb252ZXJ0VG9MaXZlID0gKGJpbmRpbmdJbnN0YW5jZSwgb2JqZWN0LCBvbmx5QXJyYXlNZXRob2RzKS0+XG5cdF8gPSBiaW5kaW5nSW5zdGFuY2Vcblx0Xy5vcmlnRGVzY3JpcHRvciA9IGZldGNoRGVzY3JpcHRvcihvYmplY3QsIF8ucHJvcGVydHkpIGlmIG5vdCBfLm9yaWdEZXNjcmlwdG9yXG5cblx0aWYgb25seUFycmF5TWV0aG9kc1xuXHRcdGFycmF5TXV0YXRvck1ldGhvZHMuZm9yRWFjaCAobWV0aG9kKS0+ICMgVXNpbmcgZm9yRWFjaCBiZWNhdXNlIHdlIG5lZWQgYSBjbG9zdXJlIGhlcmVcblx0XHRcdGRlZmluZVByb3BlcnR5IG9iamVjdCwgbWV0aG9kLCBcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0XHRcdHZhbHVlOiAoKS0+XG5cdFx0XHRcdFx0cmVzdWx0ID0gQXJyYXk6OlttZXRob2RdLmFwcGx5IG9iamVjdCwgYXJndW1lbnRzXG5cdFx0XHRcdFx0Xy51cGRhdGVBbGxTdWJzKF8pXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdFxuXG5cdGVsc2Vcblx0XHRpZiBfLnR5cGUgaXMgJ1Byb3h5J1xuXHRcdFx0b3JpZ0ZuID0gXy5vcmlnRm4gPSBfLnZhbHVlXG5cdFx0XHRjb250ZXh0ID0gb2JqZWN0XG5cdFx0XHRfLnZhbHVlID0gcmVzdWx0Om51bGwsIGFyZ3M6bnVsbFxuXG5cdFx0XHRpZiBjaGVja0lmLmlzRnVuY3Rpb24ob3JpZ0ZuKVxuXHRcdFx0XHRzbGljZSA9IFtdLnNsaWNlXG5cdFx0XHRcdGdldHRlclZhbHVlID0gcHJveHlGbiA9ICgpLT4gXG5cdFx0XHRcdFx0YXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKVxuXHRcdFx0XHRcdF8udmFsdWUuYXJncyA9IGFyZ3MgPSBpZiBfLnNlbGZUcmFuc2Zvcm0gdGhlbiBfLnNlbGZUcmFuc2Zvcm0oYXJncykgZWxzZSBhcmdzXG5cdFx0XHRcdFx0Xy52YWx1ZS5yZXN1bHQgPSByZXN1bHQgPSBvcmlnRm4uYXBwbHkoY29udGV4dCwgYXJncylcblx0XHRcdFx0XHRfLnVwZGF0ZUFsbFN1YnMoXylcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0XHRcdFxuXHRcdFx0XHRkZWZpbmVQcm9wZXJ0eSBvYmplY3QsIF8ucHJvcGVydHksIFxuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogXy5pc0xpdmVQcm9wID0gdHJ1ZVxuXHRcdFx0XHRcdGdldDogKCktPiBnZXR0ZXJWYWx1ZVxuXHRcdFx0XHRcdHNldDogKG5ld1ZhbHVlKS0+XG5cdFx0XHRcdFx0XHRpZiBub3QgY2hlY2tJZi5pc0Z1bmN0aW9uKG5ld1ZhbHVlKVxuXHRcdFx0XHRcdFx0XHRnZXR0ZXJWYWx1ZSA9IG5ld1ZhbHVlXG5cblx0XHRcdFx0XHRcdGVsc2UgaWYgbmV3VmFsdWUgaXNudCBvcmlnRm5cblx0XHRcdFx0XHRcdFx0b3JpZ0ZuID0gXy5vcmlnRm4gPSBuZXdWYWx1ZVx0aWYgbmV3VmFsdWUgaXNudCBwcm94eUZuXG5cdFx0XHRcdFx0XHRcdGdldHRlclZhbHVlID0gcHJveHlGblx0XHRcdGlmIGdldHRlclZhbHVlIGlzbnQgcHJveHlGblxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0XG5cblx0XHRlbHNlIGlmIG5vdCB0YXJnZXRJbmNsdWRlcyhfLnR5cGUsICdET00nKSBhbmQgbm90IChfLm9iamVjdCBpcyB3aW5kb3cgYW5kIHRhcmdldEluY2x1ZGVzKHdpbmRvd1Byb3BzVG9JZ25vcmUsIF8ucHJvcGVydHkpKVxuXHRcdFxuXHRcdFx0IyAnT2JqZWN0UHJvcCcgb3IgJ0FycmF5JyB0eXBlIGJpbmRpbmdzXG5cdFx0XHRwcm9wZXJ0eURlc2NyaXB0b3IgPSBfLm9yaWdEZXNjcmlwdG9yIG9yIGR1bW15UHJvcGVydHlEZXNjcmlwdG9yXG5cdFx0XHRfLm9yaWdHZXR0ZXIgPSBwcm9wZXJ0eURlc2NyaXB0b3IuZ2V0LmJpbmQob2JqZWN0KSBpZiBwcm9wZXJ0eURlc2NyaXB0b3IuZ2V0XG5cdFx0XHRfLm9yaWdTZXR0ZXIgPSBwcm9wZXJ0eURlc2NyaXB0b3Iuc2V0LmJpbmQob2JqZWN0KSBpZiBwcm9wZXJ0eURlc2NyaXB0b3Iuc2V0XG5cdFx0XHRzaG91bGRXcml0ZUxpdmVQcm9wID0gcHJvcGVydHlEZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZVxuXG5cdFx0XHRzaG91bGRXcml0ZUxpdmVQcm9wID0gc2hvdWxkV3JpdGVMaXZlUHJvcCBhbmQgb2JqZWN0LmNvbnN0cnVjdG9yIGlzbnQgQ1NTU3R5bGVEZWNsYXJhdGlvblxuXHRcdFx0aW1wb3J0ICcuL3dlYmtpdERvbURlc2NyaXB0b3JGaXgnXG5cdFx0XHRcblx0XHRcdGlmIHNob3VsZFdyaXRlTGl2ZVByb3Bcblx0XHRcdFx0dHlwZUlzQXJyYXkgPSBfLnR5cGUgaXMgJ0FycmF5J1xuXHRcdFx0XHRzaG91bGRJbmRpY2F0ZVVwZGF0ZUlzRnJvbVNlbGYgPSBub3QgXy5vcmlnU2V0dGVyIGFuZCBub3QgdHlwZUlzQXJyYXlcblx0XHRcdFx0XG5cdFx0XHRcdGRlZmluZVByb3BlcnR5IG9iamVjdCwgXy5wcm9wZXJ0eSxcblx0XHRcdFx0XHRjb25maWd1cmFibGU6IF8uaXNMaXZlUHJvcCA9IHRydWVcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiBwcm9wZXJ0eURlc2NyaXB0b3IuZW51bWVyYWJsZVxuXHRcdFx0XHRcdGdldDogXy5vcmlnR2V0dGVyIG9yICgpLT4gXy52YWx1ZVxuXHRcdFx0XHRcdHNldDogKG5ld1ZhbHVlKS0+IF8uc2V0VmFsdWUobmV3VmFsdWUsIF8sIHNob3VsZEluZGljYXRlVXBkYXRlSXNGcm9tU2VsZik7IHJldHVyblxuXG5cdFx0XHRcblx0XHRcdFx0aWYgdHlwZUlzQXJyYXlcblx0XHRcdFx0XHRjb252ZXJ0VG9MaXZlKF8sIG9iamVjdFtfLnByb3BlcnR5XSwgdHJ1ZSlcblxuXHRyZXR1cm5cblxuXG5cblxuXG5jb252ZXJ0VG9SZWcgPSAoYmluZGluZ0luc3RhbmNlLCBvYmplY3QsIG9ubHlBcnJheU1ldGhvZHMpLT5cblx0aWYgb25seUFycmF5TWV0aG9kc1xuXHRcdGRlbGV0ZSBvYmplY3RbbWV0aG9kXSBmb3IgbWV0aG9kIGluIGFycmF5TXV0YXRvck1ldGhvZHNcblx0ZWxzZVxuXHRcdF8gPSBiaW5kaW5nSW5zdGFuY2Vcblx0XHRuZXdEZXNjcmlwdG9yID0gXy5vcmlnRGVzY3JpcHRvclxuXHRcdG5ld0Rlc2NyaXB0b3IudmFsdWUgPSAoXy5vcmlnRm4gb3IgXy52YWx1ZSkgdW5sZXNzIG5ld0Rlc2NyaXB0b3Iuc2V0IG9yIG5ld0Rlc2NyaXB0b3IuZ2V0XG5cdFx0ZGVmaW5lUHJvcGVydHkgb2JqZWN0LCBfLnByb3BlcnR5LCBuZXdEZXNjcmlwdG9yXG5cblxuXG4iLCIjIyMqXG4gKiBUaGVyZSBpcyBhIGJ1ZyBpbiB3ZWJraXQvYmxpbmsgZW5naW5lcyBpbiB3aGljaCBuYXRpdmUgYXR0cmlidXRlcy9wcm9wZXJ0aWVzIFxuICogb2YgRE9NIGVsZW1lbnRzIGFyZSBub3QgZXhwb3NlZCBvbiB0aGUgZWxlbWVudCdzIHByb3RvdHlwZSBhbmQgaW5zdGVhZCBpc1xuICogZXhwb3NlZCBkaXJlY3RseSBvbiB0aGUgZWxlbWVudCBpbnN0YW5jZTsgd2hlbiBsb29raW5nIHVwIHRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yXG4gKiBvZiB0aGUgZWxlbWVudCBhIGRhdGEgZGVzY3JpcHRvciBpcyByZXR1cm5lZCBpbnN0ZWFkIG9mIGFuIGFjY2Vzc29yIGRlc2NyaXB0b3JcbiAqIChpLmUuIGRlc2NyaXB0b3Igd2l0aCBnZXR0ZXIvc2V0dGVyKSB3aGljaCBtZWFucyB3ZSBhcmUgbm90IGFibGUgdG8gZGVmaW5lIG91clxuICogb3duIHByb3h5IGdldHRlci9zZXR0ZXJzLiBUaGlzIHdhcyBmaXhlZCBvbmx5IGluIEFwcmlsIDIwMTUgaW4gQ2hyb21lIHY0MyBhbmRcbiAqIFNhZmFyaSB2MTAuIEFsdGhvdWdoIHdlIHdvbid0IGJlIGFibGUgdG8gZ2V0IG5vdGlmaWVkIHdoZW4gdGhlIG9iamVjdHMgZ2V0XG4gKiB0aGVpciB2YWx1ZXMgc2V0LCB3ZSB3b3VsZCBhdCBsZWFzdCBwcm92aWRlIHdvcmtpbmcgZnVuY3Rpb25hbGl0eSBsYWNraW5nIHVwZGF0ZVxuICogbGlzdGVuZXJzLiBTaW5jZSB2MS4xNC4wIEhUTUxJbnB1dEVsZW1lbnQ6OnZhbHVlIGJpbmRpbmdzIGludm9rZSB0aGUgb3JpZ2luYWxcbiAqIGdldHRlciBhbmQgc2V0dGVyIG1ldGhvZHMgaW4gQmluZGluZzo6c2V0VmFsdWUoKSwgYW5kIHNpbmNlIHdlIHdhbnQgdG8gYXZvaWRcbiAqIGluY3JlYXNpbmcgdGhlIGFtb3VudCBvZiBsb2dpYyBwcmVzZW50IGluIEJpbmRpbmc6OnNldFZhbHVlKCkgZm9yIHBlcmZvcm1hbmNlXG4gKiByZWFzb25zLCB3ZSBwYXRjaCB0aG9zZSBzZXR0ZXJzIGhlcmUuIFdlIGNsb25lIHRoZSB0YXJnZXQgZWxlbWVudCBhbmQgY2hlY2sgZm9yXG4gKiB0aGUgZXhpc3RlbmNlIG9mIHRoZSB0YXJnZXQgcHJvcGVydHkgLSBpZiBpdCBleGlzdHMgdGhlbiBpdCBpbmRpY2F0ZXMgdGhlIHRhcmdldFxuICogcHJvcGVydHkgaXMgYSBuYXRpdmUgcHJvcGVydHkgKHNpbmNlIG9ubHkgbmF0aXZlIHByb3BlcnRpZXMgYXJlIGNvcGllZCBvdmVyIGluXG4gKiBFbGVtZW50OjpjbG9uZU5vZGUpLiBUaGlzIHBhdGNoaW5nIGlzIG9ubHkgZm9yIG5hdGl2ZSBwcm9wZXJ0aWVzLlxuICpcbiAqIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD00OTczOVxuICogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTc1Mjk3XG4gKiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00MzM5NFxuICogaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDMxNDkyXG4gKiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0xMzE3NVxuICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL3VwZGF0ZXMvMjAxNS8wNC9ET00tYXR0cmlidXRlcy1ub3ctb24tdGhlLXByb3RvdHlwZS1jaGFpblxuIyMjXG5cbmlmIHJlcXVpcmVzRG9tRGVzY3JpcHRvckZpeCBhbmQgXy5pc0RvbSBhbmQgXy5wcm9wZXJ0eSBvZiBvYmplY3QuY2xvbmVOb2RlKGZhbHNlKVxuXHRfLm9yaWdEZXNjcmlwdG9yID0gc2hvdWxkV3JpdGVMaXZlUHJvcCA9IGZhbHNlXG5cdF8uaXNMaXZlUHJvcCA9IHRydWVcblx0Xy5vcmlnR2V0dGVyID0gKCktPiBfLm9iamVjdFtfLnByb3BlcnR5XVxuXHRfLm9yaWdTZXR0ZXIgPSAobmV3VmFsdWUpLT4gXy5vYmplY3RbXy5wcm9wZXJ0eV0gPSBuZXdWYWx1ZSIsImNsb25lT2JqZWN0ID0gKG9iamVjdCktPlxuXHRjbG9uZSA9IGdlbk9iaigpXG5cdGNsb25lW2tleV0gPSBvYmplY3Rba2V5XSBmb3Iga2V5IG9mIG9iamVjdFxuXHRyZXR1cm4gY2xvbmVcblxuZXh0ZW5kU3RhdGUgPSAoYmFzZSwgc3RhdGVUb0luaGVyaXQpLT5cblx0c3RhdGVNYXBwaW5nID0gT2JqZWN0LmtleXMoc3RhdGVUb0luaGVyaXQpXG5cdGJhc2Vba2V5XSA9IHN0YXRlVG9Jbmhlcml0W2tleV0gZm9yIGtleSBpbiBzdGF0ZU1hcHBpbmdcblx0cmV0dXJuXG4iLCJjYWNoZSA9XHRcblx0Z2V0OiAob2JqZWN0LCBpc0Z1bmN0aW9uLCBzZWxlY3RvciwgaXNNdWx0aUNob2ljZSktPlxuXHRcdGlmIGlzRnVuY3Rpb25cblx0XHRcdHJldHVybiBib3VuZEluc3RhbmNlc1tvYmplY3QuX3NiX0lEXVxuXHRcdGVsc2Vcblx0XHRcdGlmIGlzTXVsdGlDaG9pY2UgYW5kIG9iamVjdFswXS5fc2JfbWFwXG5cdFx0XHRcdHNhbXBsZUl0ZW0gPSBib3VuZEluc3RhbmNlc1sgb2JqZWN0WzBdLl9zYl9tYXBbc2VsZWN0b3JdIF1cblx0XHRcdFx0XG5cdFx0XHRcdHJldHVybiBzYW1wbGVJdGVtLmdyb3VwQmluZGluZyBpZiBzYW1wbGVJdGVtLmdyb3VwQmluZGluZ1xuXG5cdFx0XHRpZiBvYmplY3QuX3NiX21hcCBhbmQgb2JqZWN0Ll9zYl9tYXBbc2VsZWN0b3JdXG5cdFx0XHRcdHJldHVybiBib3VuZEluc3RhbmNlc1sgb2JqZWN0Ll9zYl9tYXBbc2VsZWN0b3JdIF1cblxuXG5cdHNldDogKEIsIGlzRnVuY3Rpb24pLT4gIyBCID09PT0gQmluZGluZyBPYmplY3Rcblx0XHRpZiBpc0Z1bmN0aW9uXG5cdFx0XHRkZWZpbmVQcm9wZXJ0eSBCLm9iamVjdCwgJ19zYl9JRCcsIHsnY29uZmlndXJhYmxlJzp0cnVlLCAndmFsdWUnOkIuSUR9XG5cblx0XHRlbHNlXG5cdFx0XHRzZWxlY3RvciA9IEIuc2VsZWN0b3JcblxuXHRcdFx0aWYgQi5vYmplY3QuX3NiX21hcFxuXHRcdFx0XHRCLm9iamVjdC5fc2JfbWFwW3NlbGVjdG9yXSA9IEIuSURcblx0XHRcdGVsc2Vcblx0XHRcdFx0cHJvcHNNYXAgPSB7fVxuXHRcdFx0XHRwcm9wc01hcFtzZWxlY3Rvcl0gPSBCLklEXG5cdFx0XHRcdFxuXHRcdFx0XHRkZWZpbmVQcm9wZXJ0eSBCLm9iamVjdCwgJ19zYl9tYXAnLCB7J2NvbmZpZ3VyYWJsZSc6dHJ1ZSwgJ3ZhbHVlJzpwcm9wc01hcH1cblx0XHRyZXR1cm4iLCJlc2NhcGVSZWdFeCA9IC9bLiorP14ke30oKXxbXFxdXFxcXF0vZ1xucGhvbGRlclJlZ0V4ID0gcGhvbGRlclJlZ0V4U3BsaXQgPSBudWxsXG5cbnNldFBob2xkZXJSZWdFeCA9ICgpLT5cblx0c3RhcnQgPSBzZXR0aW5ncy5wbGFjZWhvbGRlclswXS5yZXBsYWNlKGVzY2FwZVJlZ0V4LCAnXFxcXCQmJylcblx0ZW5kID0gc2V0dGluZ3MucGxhY2Vob2xkZXJbMV0ucmVwbGFjZShlc2NhcGVSZWdFeCwgJ1xcXFwkJicpXG5cdG1pZGRsZSA9IFwiW14je2VuZH1dK1wiXG5cdHBob2xkZXJSZWdFeCA9IG5ldyBSZWdFeHAoXCIje3N0YXJ0fSgje21pZGRsZX0pI3tlbmR9XCIsICdnJylcblx0cGhvbGRlclJlZ0V4U3BsaXQgPSBuZXcgUmVnRXhwKFwiI3tzdGFydH0je21pZGRsZX0je2VuZH1cIiwgJ2cnKVxuXHRyZXR1cm5cblxuc2V0UGhvbGRlclJlZ0V4KCkgIyBDcmVhdGUgdGhlIHJlZ0V4IG9uIGluaXRcblxuXG5cbmFwcGx5UGxhY2Vob2xkZXJzID0gKGNvbnRleHRzLCB2YWx1ZXMsIGluZGV4TWFwKS0+XG5cdG91dHB1dCA9ICcnXG5cdGZvciBjb250ZXh0UGFydCxpbmRleCBpbiBjb250ZXh0c1xuXHRcdG91dHB1dCArPSBjb250ZXh0UGFydFxuXHRcdG91dHB1dCArPSB2YWx1ZXNbaW5kZXhNYXBbaW5kZXhdXSBpZiBpbmRleE1hcFtpbmRleF1cblx0XG5cdHJldHVybiBvdXRwdXRcblxuXG50ZXh0Q29udGVudCA9ICd0ZXh0Q29udGVudCdcblxuYWRkVG9Ob2RlU3RvcmUgPSAobm9kZVN0b3JlLCBub2RlLCB0YXJnZXRQbGFjZWhvbGRlciktPlxuXHRub2RlU3RvcmVbdGFyZ2V0UGxhY2Vob2xkZXJdID89IFtdXG5cdG5vZGVTdG9yZVt0YXJnZXRQbGFjZWhvbGRlcl0ucHVzaChub2RlKVxuXHRyZXR1cm5cblxuXG5zY2FuVGV4dE5vZGVzUGxhY2Vob2xkZXJzID0gKGVsZW1lbnQsIG5vZGVTdG9yZSktPlxuXHRjaGlsZE5vZGVzID0gQXJyYXk6OnNsaWNlLmNhbGwoZWxlbWVudC5jaGlsZE5vZGVzKVxuXHRmb3Igbm9kZSBpbiBjaGlsZE5vZGVzXG5cdFx0aWYgbm9kZS5ub2RlVHlwZSBpc250IDMgXG5cdFx0XHRzY2FuVGV4dE5vZGVzUGxhY2Vob2xkZXJzKG5vZGUsIG5vZGVTdG9yZSlcblx0XHRcblx0XHRlbHNlIGlmIG5vZGVbdGV4dENvbnRlbnRdLm1hdGNoKHBob2xkZXJSZWdFeFNwbGl0KVxuXHRcdFx0dGV4dFBpZWNlcyA9IG5vZGVbdGV4dENvbnRlbnRdLnNwbGl0KHBob2xkZXJSZWdFeClcblxuXHRcdFx0aWYgdGV4dFBpZWNlcy5sZW5ndGggaXMgMyBhbmQgdGV4dFBpZWNlc1swXSt0ZXh0UGllY2VzWzJdIGlzICcnICMgVGhlIGVudGlyZSB0ZXh0Tm9kZSBpcyBqdXN0IHRoZSBwbGFjZWhvbGRlclxuXHRcdFx0XHRhZGRUb05vZGVTdG9yZShub2RlU3RvcmUsIG5vZGUsIHRleHRQaWVjZXNbMV0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG5ld0ZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cblx0XHRcdFx0Zm9yIHRleHRQaWVjZSxpbmRleCBpbiB0ZXh0UGllY2VzXG5cdFx0XHRcdFx0bmV3Tm9kZSA9IG5ld0ZyYWdtZW50LmFwcGVuZENoaWxkIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHRQaWVjZSlcblx0XHRcdFx0XHRpZiBpbmRleCAlIDIgIyBpcyBhbiBvZGQgaW5kZXgsIGluZGljYXRpbmcgdGhhdCBiZWZvcmUgdGhpcyB0ZXh0IHBpZWNlIHNob3VsZCBjb21lIGEgcGxhY2Vob2xkZXIgbm9kZVxuXHRcdFx0XHRcdFx0YWRkVG9Ob2RlU3RvcmUobm9kZVN0b3JlLCBuZXdOb2RlLCB0ZXh0UGllY2UpXG5cblx0XHRcdFx0bm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdGcmFnbWVudCwgbm9kZSlcblxuXHRyZXR1cm5cblxuXG5cbiIsInRocm93RXJyb3IgPSAoZXJyb3JOYW1lKS0+XG5cdHRocm93IG5ldyBFcnJvciAnU2ltcGx5QmluZDogJysoZXJyb3JzW2Vycm9yTmFtZV0gb3IgZXJyb3JOYW1lKVxuXG50aHJvd1dhcm5pbmcgPSAod2FybmluZ05hbWUsIGRlcHRoKS0+IHVubGVzcyBzZXR0aW5ncy5zaWxlbnRcblx0ZXJyU291cmNlID0gZ2V0RXJyU291cmNlKGRlcHRoKVxuXHR3YXJuID0gZXJyb3JzW3dhcm5pbmdOYW1lXVxuXHR3YXJuICs9IFwiXFxuXFxuXCIrZXJyU291cmNlXG5cdGNvbnNvbGUud2FybignU2ltcGx5QmluZDogJyt3YXJuKVxuXHRyZXR1cm5cblxudGhyb3dFcnJvckJhZEFyZyA9IChhcmcpLT5cblx0dGhyb3dFcnJvciBcIkludmFsaWQgYXJndW1lbnQvcyAoI3thcmd9KVwiLCB0cnVlXG5cdHJldHVyblxuXG5nZXRFcnJTb3VyY2UgPSAoZGVwdGgpLT5cblx0KChuZXcgRXJyb3IpLnN0YWNrIG9yICcnKVxuXHRcdC5zcGxpdCgnXFxuJylcblx0XHQuc2xpY2UoZGVwdGgrMylcblx0XHQuam9pbignXFxuJylcblxuXG4iLCJlcnJvcnMgPSBcblx0aW52YWxpZFBhcmFtTmFtZTogXCJTaW1wbHlCaW5kKCkgYW5kIC50bygpIG9ubHkgYWNjZXB0IGEgZnVuY3Rpb24sIGFuIGFycmF5LCBhIGJvdW5kIG9iamVjdCwgYSBzdHJpbmcsIG9yIGEgbnVtYmVyLlwiXG5cdGZuT25seTogXCJPbmx5IGZ1bmN0aW9ucyBhcmUgYWxsb3dlZCBmb3IgLnRyYW5zZm9ybS8uY29uZGl0aW9uL0FsbCgpXCJcblx0YmFkRXZlbnRBcmc6IFwiSW52YWxpZCBhcmd1bWVudCBudW1iZXIgaW4gLm9mRXZlbnQoKVwiXG5cdGVtcHR5TGlzdDogXCJFbXB0eSBjb2xsZWN0aW9uIHByb3ZpZGVkXCJcblx0XG5cdG9ubHlPbmVET01FbGVtZW50OiBcIllvdSBjYW4gb25seSBwYXNzIGEgc2luZ2xlIERPTSBlbGVtZW50IHRvIGEgYmluZGluZ1wiXG5cdG1peGVkRWxMaXN0OiBcIidjaGVja2VkJyBvZiBNaXhlZCBsaXN0IG9mIGVsZW1lbnQgY2Fubm90IGJlIGJvdW5kXCJcbiIsIlNpbXBseUJpbmQgPSAoc3ViamVjdCwgb3B0aW9ucywgc2F2ZU9wdGlvbnMsIGlzU3ViLCBjb21wbGV0ZUNhbGxiYWNrKS0+XG5cdGlmICghc3ViamVjdCBhbmQgc3ViamVjdCBpc250IDApIG9yICghY2hlY2tJZi5pc1N0cmluZyhzdWJqZWN0KSBhbmQgIWNoZWNrSWYuaXNOdW1iZXIoc3ViamVjdCkgYW5kICFjaGVja0lmLmlzRnVuY3Rpb24oc3ViamVjdCkgYW5kIHN1YmplY3Qgbm90IGluc3RhbmNlb2YgQXJyYXkpXG5cdFx0dGhyb3dFcnJvcignaW52YWxpZFBhcmFtTmFtZScpIHVubGVzcyBjaGVja0lmLmlzQmluZGluZ0ludGVyZmFjZShzdWJqZWN0KVxuXG5cdGlmIGNoZWNrSWYuaXNPYmplY3Qoc3ViamVjdCkgYW5kIHN1YmplY3Qgbm90IGluc3RhbmNlb2YgQXJyYXkgIyBJbmRpY2F0ZXMgaXQncyBhIEJpbmRpbmcgaW5zdGFuY2Ugb2JqZWN0IGR1ZSB0byB0aGUgYWJvdmUgY2hlY2tcblx0XHRpbnRlcmZhY2VUb1JldHVybiA9IGlmIGNvbXBsZXRlQ2FsbGJhY2sgdGhlbiBjb21wbGV0ZUNhbGxiYWNrKHN1YmplY3QpIGVsc2Ugc3ViamVjdC5zZWxmQ2xvbmUoKVxuXHRcblx0ZWxzZVxuXHRcdG5ld0ludGVyZmFjZSA9IG5ldyBCaW5kaW5nSW50ZXJmYWNlKG9wdGlvbnMpXG5cdFx0bmV3SW50ZXJmYWNlLnNhdmVPcHRpb25zID0gc2F2ZU9wdGlvbnNcblx0XHRuZXdJbnRlcmZhY2UuaXNTdWIgPSBpc1N1YlxuXHRcdG5ld0ludGVyZmFjZS5jb21wbGV0ZUNhbGxiYWNrID0gY29tcGxldGVDYWxsYmFja1xuXG5cdFx0aWYgY2hlY2tJZi5pc0Z1bmN0aW9uKHN1YmplY3QpXG5cdFx0XHRpbnRlcmZhY2VUb1JldHVybiA9IG5ld0ludGVyZmFjZS5zZXRPYmplY3Qoc3ViamVjdCwgdHJ1ZSlcblx0XHRlbHNlXG5cdFx0XHRpbnRlcmZhY2VUb1JldHVybiA9IG5ld0ludGVyZmFjZS5zZXRQcm9wZXJ0eShzdWJqZWN0KVxuXG5cdHJldHVybiBpbnRlcmZhY2VUb1JldHVyblxuXG5cblxuXG5pbXBvcnQgJy4vbWV0aG9kcyciLCJTaW1wbHlCaW5kLnZlcnNpb24gPSBpbXBvcnQgJy4uLy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nXG5TaW1wbHlCaW5kLnNldHRpbmdzID0gc2V0dGluZ3NcblNpbXBseUJpbmQuZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9uc1xuXG5cblxuU2ltcGx5QmluZC51bkJpbmRBbGwgPSAob2JqZWN0LCBib3RoV2F5cyktPlxuXHRpZiBvYmplY3QgYW5kIChjaGVja0lmLmlzT2JqZWN0KG9iamVjdCkgb3IgY2hlY2tJZi5pc0Z1bmN0aW9uKG9iamVjdCkpXG5cdFx0aW1wb3J0ICcuL21ldGhvZHMudW5CaW5kQWxsLXBhcnNlRE9NT2JqZWN0LmNvZmZlZSdcblx0XHRwcm9wTWFwID0gb2JqZWN0Ll9zYl9tYXBcdFx0XG5cblx0XHRpZiBvYmplY3QuX3NiX0lEXG5cdFx0XHRib3VuZEluc3RhbmNlc1tvYmplY3QuX3NiX0lEXS5yZW1vdmVBbGxTdWJzKGJvdGhXYXlzKVxuXHRcdFxuXHRcdGlmIHByb3BNYXBcblx0XHRcdGJvdW5kSW5zdGFuY2VzW2JvdW5kSURdLnJlbW92ZUFsbFN1YnMoYm90aFdheXMpIGZvciBwcm9wLCBib3VuZElEIG9mIHByb3BNYXBcblxuXHRyZXR1cm5cblxuIiwie1xuICBcIl9hcmdzXCI6IFtcbiAgICBbXG4gICAgICBcIkBkYW5pZWxrYWxlbi9zaW1wbHliaW5kQDEuMTUuOFwiLFxuICAgICAgXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCJcbiAgICBdXG4gIF0sXG4gIFwiX2Zyb21cIjogXCJAZGFuaWVsa2FsZW4vc2ltcGx5YmluZEAxLjE1LjhcIixcbiAgXCJfaWRcIjogXCJAZGFuaWVsa2FsZW4vc2ltcGx5YmluZEAxLjE1LjhcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1ya2wrd0hiYkNvUG8yQTNWTkRBdDV1eVZYK2xCSG9lTlpmREFvSVZOc2xSRVVBRjlaS2tQNnNZcDl5cUZMTlkzam1yOGwreXlNcU1Hc3hxQlpHejU4dz09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJ2ZXJzaW9uXCIsXG4gICAgXCJyZWdpc3RyeVwiOiB0cnVlLFxuICAgIFwicmF3XCI6IFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRAMS4xNS44XCIsXG4gICAgXCJuYW1lXCI6IFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRcIixcbiAgICBcImVzY2FwZWROYW1lXCI6IFwiQGRhbmllbGthbGVuJTJmc2ltcGx5YmluZFwiLFxuICAgIFwic2NvcGVcIjogXCJAZGFuaWVsa2FsZW5cIixcbiAgICBcInJhd1NwZWNcIjogXCIxLjE1LjhcIixcbiAgICBcInNhdmVTcGVjXCI6IG51bGwsXG4gICAgXCJmZXRjaFNwZWNcIjogXCIxLjE1LjhcIlxuICB9LFxuICBcIl9yZXF1aXJlZEJ5XCI6IFtcbiAgICBcIi9cIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kLy0vc2ltcGx5YmluZC0xLjE1LjgudGd6XCIsXG4gIFwiX3NwZWNcIjogXCIxLjE1LjhcIixcbiAgXCJfd2hlcmVcIjogXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJkYW5pZWxrYWxlblwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2Rpc3Qvc2ltcGx5YmluZC5ub2RlLmRlYnVnLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9kZWJ1Z1wiOiBcImRpc3Qvc2ltcGx5YmluZC5kZWJ1Zy5qc1wiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9pc3N1ZXNcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7fSxcbiAgXCJkZXNjcmlwdGlvblwiOiBcIk1hZ2ljYWxseSBzaW1wbGUsIGZyYW1ld29yay1sZXNzIG9uZS13YXkvdHdvLXdheSBkYXRhIGJpbmRpbmcgZm9yIGZyb250ZW5kL2JhY2tlbmQgaW4gfjVrYi5cIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy41LjBcIixcbiAgICBcImNvZmZlZS1zY3JpcHRcIjogXCJeMS4xMi42XCIsXG4gICAgXCJmcy1qZXRwYWNrXCI6IFwiXjAuMTMuMVwiLFxuICAgIFwicHJvbWlzZS1icmVha1wiOiBcIl4wLjEuMVwiLFxuICAgIFwic2VtdmVyXCI6IFwiXjUuMy4wXCIsXG4gICAgXCJzaW1wbHlpbXBvcnRcIjogXCJeNC4wLjAtczRcIixcbiAgICBcInNpbXBseXdhdGNoXCI6IFwiXjMuMC4wLWwyXCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zaW1wbHliaW5kI3JlYWRtZVwiLFxuICBcImtleXdvcmRzXCI6IFtcbiAgICBcImJpbmRcIixcbiAgICBcImJpbmRpbmdcIixcbiAgICBcImRvbS1iaW5kaW5nXCIsXG4gICAgXCJvbmUtd2F5XCIsXG4gICAgXCJ0d28td2F5XCJcbiAgXSxcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwibWFpblwiOiBcImRpc3Qvc2ltcGx5YmluZC5ub2RlLmRlYnVnLmpzXCIsXG4gIFwibmFtZVwiOiBcIkBkYW5pZWxrYWxlbi9zaW1wbHliaW5kXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3NpbXBseWJpbmQuZ2l0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJlbmNobWFya3NcIjogXCJjYWtlIGluc3RhbGw6YmVuY2g7IG5wbSBydW4gYmVuY2htYXJrczpidWlsZCAmJiBucG0gcnVuIGJlbmNobWFya3M6c2VydmVcIixcbiAgICBcImJlbmNobWFya3M6YnVpbGRcIjogXCJiZW5jaG1hcmtzIGJ1aWxkIC1zIGJlbmNobWFya3Mvc3JjIC1kIGJlbmNobWFya3MvZGVzdFwiLFxuICAgIFwiYmVuY2htYXJrczpydW5cIjogXCJiZW5jaG1hcmtzIHJ1biAtZCBiZW5jaG1hcmtzL2Rlc3RcIixcbiAgICBcImJlbmNobWFya3M6c2VydmVcIjogXCJiZW5jaG1hcmtzIHNlcnZlIC1kIGJlbmNobWFya3MvZGVzdFwiLFxuICAgIFwiYmVuY2htYXJrczp1cGRhdGVcIjogXCJjYWtlIGluc3RhbGw6YmVuY2g7IGNha2UgdXBkYXRlU0JCZW5jaDsgbnBtIHJ1biBiZW5jaG1hcmtzOmJ1aWxkXCIsXG4gICAgXCJidWlsZFwiOiBcImNha2UgLWQgYnVpbGQgJiYgY2FrZSBidWlsZCAmJiBjYWtlIG1lYXN1cmUgJiYgY3AgLXIgYnVpbGQvKiBkaXN0L1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJjYWtlIGluc3RhbGw6Y292ZXJhZ2U7IG5wbSBydW4gY292ZXJhZ2U6cnVuICYmIG5wbSBydW4gY292ZXJhZ2U6YmFkZ2VcIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnJ1blwiOiBcImlzdGFuYnVsIGNvdmVyIC0tZGlyIGNvdmVyYWdlL25vZGUgbm9kZV9tb2R1bGVzL21vY2hhL2Jpbi9fbW9jaGEgLS0gLXUgdGRkIC1iIHRlc3QvdGVzdEhlbHBlcnMuanMgdGVzdC90ZXN0LmpzXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJwb3N0dmVyc2lvblwiOiBcIm5wbSBydW4gYnVpbGQgJiYgbnBtIHJ1biBiZW5jaG1hcmtzOnVwZGF0ZSAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwibnBtIHJ1biB0ZXN0XCIsXG4gICAgXCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0Om5vZGUgLXMgJiYgbnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgJiYgbnBtIHJ1biB0ZXN0Om1pbmlmaWVkIC1zXCIsXG4gICAgXCJ0ZXN0OmJyb3dzZXJcIjogXCJjYWtlIGluc3RhbGw6a2FybWE7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEVsZWN0cm9uIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6YnJvd3Nlcjpsb2NhbFwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBvcGVuIHRlc3QvdGVzdHJ1bm5lci5odG1sXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOmthcm1hOyBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0Om1pbmlmaWVkXCI6IFwibWluaWZpZWQ9MSBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0Om5vZGVcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgbW9jaGEgLXUgdGRkIC0tY29tcGlsZXJzIGNvZmZlZTpjb2ZmZWUtcmVnaXN0ZXIgdGVzdC9ub2RlLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYXVjZVwiOiBcImNha2UgaW5zdGFsbDprYXJtYTsgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ3YXRjaFwiOiBcImNha2UgLWQgd2F0Y2hcIlxuICB9LFxuICBcInNpbXBseWltcG9ydFwiOiB7XG4gICAgXCJmaW5hbFRyYW5zZm9ybVwiOiBbXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc3VwZXJcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1yZW5hbWVcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zaW1wbGVcIlxuICAgIF1cbiAgfSxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4xNS44XCJcbn1cbiIsIiMjIypcbiAqIENvbmRpdGlvbmFsIENoZWNrczpcbiAqXG4gKiAxKSBNYWtlIHN1cmUgdGhlIHN1YmplY3Qgb2JqZWN0IGlzIGl0ZXJhYmxlIChhbmQgdGh1cyBhIHBvc3NpYmxlIGNhbmRpZGF0ZSBmb3IgYmVpbmcgYW4gZWxlbWVudCBjb2xsZWN0aW9uKVxuICogMikgTWFrZSBzdXJlIHRoZSBzdWJqZWN0IG9iamVjdCBpc24ndCBhbiBhcnJheSBiaW5kaW5nIChzaW5jZSBlbGVtZW50IGNvbGxlY3Rpb24gb2JqZWN0cyBkb24ndCBnZXQgZGlyZWN0bHkgYm91bmQpXG4gKiAzKSBNYWtlIHN1cmUgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24gaXMgYSB2YWxpZCBvYmplY3QgKGkuZS4gaXNuJ3QgdW5kZWZpbmVkIGFuZCBpc24ndCBudWxsKVxuICogNCkgTWFrZSBzdXJlIHRoZSBmaXJzdCBlbGVtZW50IGlzIGEgRE9NIG9iamVjdFxuIyMjXG5pZiBjaGVja0lmLmlzSXRlcmFibGUob2JqZWN0KSBhbmQgbm90IG9iamVjdC5fc2JfSUQgYW5kIG9iamVjdFswXSBhbmQgKGNoZWNrSWYuaXNEb20ob2JqZWN0WzBdKSlcblx0b2JqZWN0ID0gb2JqZWN0WzBdIiwiQmluZGluZyA9IChvYmplY3QsIHR5cGUsIHN0YXRlKS0+XG5cdGV4dGVuZFN0YXRlKEAsIHN0YXRlKVxuXHRAb3B0aW9uc0RlZmF1bHQgPSBpZiBAc2F2ZU9wdGlvbnMgdGhlbiBAb3B0aW9ucyBlbHNlIGRlZmF1bHRPcHRpb25zXG5cdEB0eXBlID0gdHlwZVx0XHRcdFx0XHRcdFx0IyBPYmplY3RQcm9wIHwgQXJyYXkgfCBGdW5jIHwgUHJveHkgfCBFdmVudCB8IFBob2xkZXIgfCBET01BdHRyIHwgRE9NQ2hlY2tib3ggfCBET01SYWRpb1xuXHRAb2JqZWN0ID0gb2JqZWN0IFx0XHRcdFx0XHRcdCMgVGhlIHN1YmplY3Qgb2JqZWN0IG9mIHRoaXMgYmluZGluZywgaS5lLiBmdW5jdGlvbiwgYXJyYXksIHt9LCBET00gZWwsIGV0Yy5cblx0QElEID0gZ2VuSUQoKSBcdFx0XHRcdFx0XHRcdCMgQXNzaWduZWQgb25seSBhZnRlciBwYXNzaW5nIGEgdmFsaWQgb2JqZWN0IHRvIC5vZigpXG5cdEBzdWJzID0gW11cdFx0XHRcdFx0XHRcdFx0IyBTdWJzY3JpYmVycyBhcnJheSBsaXN0aW5nIGFsbCBvZiB0aGUgb2JqZWN0cyB0aGF0IHdpbGwgYmUgdXBkYXRlZCB1cG9uIHZhbHVlIHVwZGF0ZVxuXHRAc3Vic01ldGEgPSBnZW5PYmooKVx0XHRcdFx0XHQjIE1hcCBzdWJzY3JpYmVycycgSUQgdG8gdGhlaXIgbWV0YWRhdGEgKGkuZS4gb3B0aW9ucywgdHJhbnNmb3JtLCBjb25kaXRpb24sIG9uZS10aW1lLWJpbmRpbmcsIGV0Yy4pXG5cdEBwdWJzTWFwID0gZ2VuT2JqKClcdFx0XHRcdFx0XHQjIE1hcCBwdWJsaXNoZXJzIChiaW5kaW5ncyB0aGF0IHVwZGF0ZSB0aGlzIGJpbmRpbmcpIGJ5IHRoZWlyIElEXG5cdEBhdHRhY2hlZEV2ZW50cyA9IFtdXHRcdFx0XHRcdCMgQXJyYXkgbGlzdGluZyBhbGwgb2YgdGhlIGV2ZW50cyBjdXJyZW50bHkgbGlzdGVuZWQgb24gQG9iamVjdFxuXHRAc2V0VmFsdWUgPSBzZXRWYWx1ZU5vb3AgaWYgQHR5cGUgaXMgJ1Byb3h5J1xuXG5cdCMgPT09PSBQcm9wZXJ0aWVzIGRlY2xhcmVkIGxhdGVyIG9yIGluaGVyaXRlZCBmcm9tIGJpbmRpbmcgaW50ZXJmYWNlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIEBvcHRpb25zID0gb3B0aW9uc1xuXHQjIEB2YWx1ZSA9IHVuZGVmaW5lZCBcdFx0XHRcdFx0IyBXaWxsIHJlcHJlc2VudCB0aGUgYWN0dWFsIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGJpbmRpbmcvb2JqZWN0XG5cdCMgQHByb3BlcnR5ID0gcHJvcGVydHlcdFx0XHRcdFx0IyBUaGUgcHJvcGVydHkgbmFtZSBvciBhcnJheSBpbmRleCBvciBldmVudCBjYWxsYmFjayBhcmd1bWVudFxuXHQjIEBzZWxlY3RvciA9IHNlbGVjdG9yXHRcdFx0XHRcdCMgVGhlIHByb3BlcnR5IG5hbWUgb3IgYXJyYXkgaW5kZXggb3IgZXZlbnQgY2FsbGJhY2sgYXJndW1lbnRcblx0IyBAb3JpZ0ZuID0gRnVuY3Rpb25cdFx0XHRcdFx0IyBUaGUgb3JpZ2luYWwgcHJveGllZCBmdW5jdGlvbiBwYXNzZWQgdG8gUHJveHkgYmluZGluZ3Ncblx0IyBAY3VzdG9tRXZlbnRNZXRob2QgPSB7fVx0XHRcdFx0IyBOYW1lcyBvZiB0aGUgZXZlbnQgZW1pdHRlci90cmlnZ2VyIG1ldGhvZHMgKGlmIGFwcGxpY2FibGUpXG5cdCMgQHBob2xkZXJDb250ZXh0cyA9IHt9XHRcdFx0XHRcdCMgUGxhY2Vob2xkZXIgc3Vycm91bmRpbmdzIChvcmlnaW5hbCBiaW5kaW5nIHZhbHVlIHNwbGl0IGJ5IHRoZSBwbGFjZWhvbGRlciByZWdFeClcblx0IyBAcGhvbGRlckluZGV4TWFwID0ge31cdFx0XHRcdFx0IyBQbGFjZWhvbGRlciBvY2N1cmVuY2UgbWFwcGluZywgaS5lLiB0aGUgcGxhY2Vob2xkZXIgbmFtZSBmb3IgZWFjaCBwbGFjZWhvbGRlciBvY2N1cmVuY2Vcblx0IyBAcGxhY2Vob2xkZXIgPSBcIlwiXHRcdFx0XHRcdFx0IyBUaGUgbGFzdCBzcGVjaWZpZWQgcGxhY2Vob2xkZXIgdG8gYmluZCB0aGUgdmFsdWUgdG9cblx0IyBAZGVzY3JpcHRvciA9IFtdXHRcdFx0XHRcdFx0IyBEZXNjcmliZXMgdGhlIHR5cGUgb2YgcHJvcGVydHksIGkuZS4gJ2F0dHI6ZGF0YS1uYW1lJyB0byBpbmRpY2F0ZSBhIERPTUF0dHIgdHlwZSBiaW5kaW5nXG5cdCMgQGlzTGl2ZVByb3AgPSBCb29sZWFuXHRcdFx0XHRcdCMgSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRoZSBPYmplY3QvT2JqZWN0J3MgcHJvcGV0eSBoYXZlIGJlZW4gbW9kaWZpZWQgdG8gYmUgYSBsaXZlIHByb3BlcnR5XG5cdCMgQGlzRG9tID0gQm9vbGVhblx0XHRcdFx0XHRcdCMgSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRoZSBiaW5kaW5nJ3Mgb2JqZWN0IGlzIGEgRE9NIG9iamVjdFxuXHQjIEBwb2xsSW50ZXJ2YWwgPSBJRFx0XHRcdFx0XHQjIFRoZSBpbnRlcnZhbCBJRCBvZiB0aGUgdGltZXIgdGhhdCBtYW51YWxseSBwb2xscyB0aGUgb2JqZWN0J3MgdmFsdWUgYXQgYSBzZXQgaW50ZXJ2YWxcblx0IyBAYXJyYXlCaW5kaW5nID0gQmluZGluZ1x0XHRcdFx0IyBSZWZlcmVuY2UgdG8gdGhlIHBhcmVudCBhcnJheSBiaW5kaW5nIChpZiBleGlzdHMpIGZvciBhbiBpbmRleC1vZi1hcnJheSBiaW5kaW5nIChpLmUuIFNpbXBseUJpbmQoYXJyYXkpKVxuXHQjIEBldmVudE5hbWUgPSBcIlwiXHRcdFx0XHRcdFx0IyBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdGhpcyBiaW5kaW5nIGlzIGxpc3RlbmluZyB0byAoZm9yIEV2ZW50IHR5cGUgYmluZGluZ3MpXG5cdCMgQGlzRW1pdHRlciA9IEJvb2xlYW4gXHRcdFx0XHRcdCMgVHJhY2tlciB0byBsZXQgdXMga25vdyB3ZSBzaG91bGRuJ3QgaGFuZGxlIHRoZSBldmVudCB1cGRhdGUgd2UgcmVjZWl2ZWQgYXMgaXQgaXMgdGhlIGV2ZW50IHRoaXMgYmluZGluZyBqdXN0IGVtaXR0ZWRcblx0IyBAZXZlbnRIYW5kbGVyID0gRnVuY3Rpb24gXHRcdFx0XHQjIFRoZSBjYWxsYmFjayB0aGF0IGdldHMgdHJpZ2dlcmVkIHVwb24gYW4gZXZlbnQgZW1pdHRhbmNlIChmb3IgRXZlbiB0eXBlIGJpbmRpbmdzKVxuXHQjIEBldmVudE9iamVjdCA9IEV2ZW50IFx0XHRcdFx0XHQjIFRoZSBkaXNwYXRjaGVkIGV2ZW50IG9iamVjdCAoZm9yIEV2ZW50IHR5cGUgYmluZGluZ3MpXG5cdCMgQHNlbGZUcmFuc2Zvcm0gPSBGdW5jdGlvbiBcdFx0XHQjIFRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gdGhhdCBuZXcgdmFsdWVzIGJlaW5nIHNldCB0byB0aGlzIGJpbmRpbmcgYXJlIGJlaW5nIHBhc3NlZCB0aHJvdWdoIGR1cmluZyBAc2V0VmFsdWUgKGlmIGFwcGxpY2FibGUpXG5cdCMgQHNlbGZVcGRhdGVyID0gRnVuY3Rpb24gXHRcdFx0XHQjIEEgRnVuYy10eXBlIEJpbmRpbmcgd2hpY2ggaW52b2tlcyBAc2V0VmFsdWUoQGZldGNoRGlyZWN0VmFsdWUoKSkgdXBvbiBjaGFuZ2UuIENyZWF0ZWQgaW4gQGNvbnZlcnRUb0xpdmUoKSBmb3IgQXJyYXkgYmluZGluZ3MgJiBpbiBpbnRlcmZhY2UudXBkYXRlT24oKVxuXHQjIEBpc0FzeW5jID0gQm9vbGVhblx0XHRcdFx0XHQjIEluZGljYXRlcyBpZiB0aGlzIGlzIGFuIGFzeW5jIGJpbmRpbmcgKGN1cnJlbnRseSBvbmx5IHVzZWQgZm9yIEV2ZW50IGJpbmRpbmdzKVxuXHQjIyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gIyMjXG5cblx0aWYgQGlzTXVsdGlDaG9pY2UgIyBUcnVlIGlmIEBvYmplY3QgaXMgYSByYWRpby9jaGVja2JveCBjb2xsZWN0aW9uXG5cdFx0QGNob2ljZXMgPSBnZW5PYmooKVxuXHRcdFxuXHRcdEBvYmplY3QuZm9yRWFjaCAoY2hvaWNlRWwpPT5cblx0XHRcdGNob2ljZUJpbmRpbmcgPSBAY2hvaWNlc1tjaG9pY2VFbC52YWx1ZV0gPSBTaW1wbHlCaW5kKCdjaGVja2VkJykub2YoY2hvaWNlRWwpLl9cblx0XHRcdGNob2ljZUJpbmRpbmcuYWRkU3ViKEApXG5cdFx0XHRjaG9pY2VCaW5kaW5nLnN1YnNNZXRhW0BJRF0udHJhbnNmb3JtRm4gPSAoKS0+IGNob2ljZUJpbmRpbmdcblx0XHRcdGNob2ljZUJpbmRpbmcuZ3JvdXBCaW5kaW5nID0gQFxuXHRcdFx0cmV0dXJuXG5cdFxuXG5cdHVubGVzcyBAdHlwZSBpcyAnRXZlbnQnIG9yIChAdHlwZSBpcyAnRnVuYycgYW5kIEBpc1N1YikgIyB0aGUgc2Vjb25kIGNvbmRpdGlvbiB3aWxsIHByZXZlbnQgZnVuY3Rpb24gc3Vic2NyaWJlcnMgZnJvbSBiZWluZyBpbnZva2VkIG9uIHRoaXMgYmluZGluZyBjcmVhdGlvblxuXHRcdGlmIEB0eXBlIGlzICdQaG9sZGVyJ1xuXHRcdFx0cGFyZW50UHJvcGVydHkgPSBpZiBAZGVzY3JpcHRvciBhbmQgbm90IHRhcmdldEluY2x1ZGVzKEBkZXNjcmlwdG9yLCAnbXVsdGknKSB0aGVuIFwiI3tAZGVzY3JpcHRvcn06I3tAcHJvcGVydHl9XCIgZWxzZSBAcHJvcGVydHlcblx0XHRcdFxuXHRcdFx0XG5cdFx0XHRwYXJlbnRCaW5kaW5nID0gQHBhcmVudEJpbmRpbmcgPSBTaW1wbHlCaW5kKHBhcmVudFByb3BlcnR5KS5vZihvYmplY3QpLl9cblx0XHRcdHBhcmVudEJpbmRpbmcuc2NhbkZvclBob2xkZXJzKClcblx0XHRcdEB2YWx1ZSA9IHBhcmVudEJpbmRpbmcucGhvbGRlclZhbHVlc1tAcGhvbGRlcl1cblx0XHRcblx0XHRcdEB0ZXh0Tm9kZXMgPSBwYXJlbnRCaW5kaW5nLnRleHROb2Rlc1tAcGhvbGRlcl0gaWYgcGFyZW50QmluZGluZy50ZXh0Tm9kZXNcblx0XHRcblxuXHRcdGVsc2Vcblx0XHRcdEB2YWx1ZSA9IHN1YmplY3RWYWx1ZSA9IEBmZXRjaERpcmVjdFZhbHVlKClcblx0XHRcblx0XHRcdGlmIEB0eXBlIGlzICdPYmplY3RQcm9wJyBhbmQgbm90IGNoZWNrSWYuaXNEZWZpbmVkKHN1YmplY3RWYWx1ZSkgYW5kIG5vdCBnZXREZXNjcmlwdG9yKEBvYmplY3QsIEBwcm9wZXJ0eSlcblx0XHRcdFx0QG9iamVjdFtAcHJvcGVydHldID0gc3ViamVjdFZhbHVlICMgRGVmaW5lIHRoZSBwcm9wIG9uIHRoZSBvYmplY3QgaWYgaXQgbm9uLWV4aXN0ZW50XG5cblx0XHRcdGNvbnZlcnRUb0xpdmUoQCwgQG9iamVjdClcblxuXG5cdEBhdHRhY2hFdmVudHMoKVxuXHRyZXR1cm4gYm91bmRJbnN0YW5jZXNbQElEXSA9IEBcblxuXG5cblxuXG5pbXBvcnQgJy4vcHJvdG90eXBlJ1xuIiwiQmluZGluZzo6ID1cblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyMgU3Vic2NyaWJlciBNYW5hZ2VtZW50XG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IFxuXHRhZGRTdWI6IChzdWIsIG9wdGlvbnMsIHVwZGF0ZU9uY2UsIHVwZGF0ZUV2ZW5JZlNhbWUpLT5cblx0XHRpZiBzdWIuaXNNdWx0aVxuXHRcdFx0QGFkZFN1YihzdWJJdGVtLCBvcHRpb25zLCB1cGRhdGVPbmNlLCB1cGRhdGVFdmVuSWZTYW1lKSBmb3Igc3ViSXRlbSBpbiBzdWIuYmluZGluZ3Ncblx0XHRlbHNlXG5cdFx0XHRpZiBtZXRhRGF0YT1Ac3Vic01ldGFbc3ViLklEXVxuXHRcdFx0XHRhbHJlYWR5SGFkU3ViID0gdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRzdWIucHVic01hcFtASURdID0gQFxuXHRcdFx0XHRAc3Vicy51bnNoaWZ0KHN1Yilcblx0XHRcdFx0XG5cdFx0XHRcdG1ldGFEYXRhID0gQHN1YnNNZXRhW3N1Yi5JRF0gPSBnZW5PYmooKVxuXHRcdFx0XHRtZXRhRGF0YS51cGRhdGVPbmNlID0gdXBkYXRlT25jZVxuXHRcdFx0XHRtZXRhRGF0YS5vcHRzID0gY2xvbmVPYmplY3Qob3B0aW9ucylcblx0XHRcdFx0bWV0YURhdGEub3B0cy51cGRhdGVFdmVuSWZTYW1lID0gdHJ1ZSBpZiB1cGRhdGVFdmVuSWZTYW1lIG9yIEB0eXBlIGlzICdFdmVudCcgb3IgQHR5cGUgaXMgJ1Byb3h5JyBvciBAdHlwZSBpcyAnQXJyYXknXG5cdFx0XHRcdG1ldGFEYXRhLnZhbHVlUmVmID0gaWYgc3ViLnR5cGUgaXMgJ0Z1bmMnIHRoZW4gJ3ZhbHVlUGFzc2VkJyBlbHNlICd2YWx1ZSdcblx0XHRcdFxuXHRcdHJldHVybiBhbHJlYWR5SGFkU3ViXG5cblxuXG5cdHJlbW92ZVN1YjogKHN1YiwgYm90aFdheXMpLT5cblx0XHRpZiBzdWIuaXNNdWx0aVxuXHRcdFx0QHJlbW92ZVN1YihzdWJJdGVtLCBib3RoV2F5cykgZm9yIHN1Ykl0ZW0gaW4gc3ViLmJpbmRpbmdzXG5cdFx0ZWxzZVxuXHRcdFx0aWYgQHN1YnNNZXRhW3N1Yi5JRF1cblx0XHRcdFx0QHN1YnMuc3BsaWNlKEBzdWJzLmluZGV4T2Yoc3ViKSwgMSlcblx0XHRcdFx0ZGVsZXRlIEBzdWJzTWV0YVtzdWIuSURdXG5cdFx0XHRcdGRlbGV0ZSBzdWIucHVic01hcFtASURdXG5cblx0XHRcdGlmIGJvdGhXYXlzXG5cdFx0XHRcdHN1Yi5yZW1vdmVTdWIoQClcblx0XHRcdFx0ZGVsZXRlIEBwdWJzTWFwW3N1Yi5JRF1cblxuXHRcdGlmIEBzdWJzLmxlbmd0aCBpcyAwIGFuZCBPYmplY3Qua2V5cyhAcHVic01hcCkubGVuZ3RoIGlzIDBcblx0XHRcdEBkZXN0cm95KCkgIyBTaW5jZSBpdCdzIG5vIGxvbmdlciBhIHN1YnNjcmliZXIgb3IgaGFzIGFueSBzdWJzY3JpYmVyc1xuXHRcblx0XHRyZXR1cm5cblxuXHRcblxuXHRyZW1vdmVBbGxTdWJzOiAoYm90aFdheXMpLT5cblx0XHRAcmVtb3ZlU3ViKHN1YiwgYm90aFdheXMpIGZvciBzdWIgaW4gQHN1YnMuc2xpY2UoKVxuXHRcdHJldHVyblxuXG5cblxuXG5cdGRlc3Ryb3k6ICgpLT4gIyBSZXNldHMgb2JqZWN0IHRvIGluaXRpYWwgc3RhdGUgKHByZS1iaW5kaW5nIHN0YXRlKVxuXHRcdGRlbGV0ZSBib3VuZEluc3RhbmNlc1tASURdXG5cdFx0QHJlbW92ZVBvbGxJbnRlcnZhbCgpXG5cdFx0XG5cdFx0aWYgQHR5cGUgaXMgJ0V2ZW50J1xuXHRcdFx0QHVuUmVnaXN0ZXJFdmVudChldmVudCkgZm9yIGV2ZW50IGluIEBhdHRhY2hlZEV2ZW50c1xuXHRcdFxuXHRcdGVsc2UgaWYgQHR5cGUgaXMgJ0Z1bmMnXG5cdFx0XHRkZWxldGUgQG9iamVjdC5fc2JfSURcblxuXHRcdCMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblx0XHRjb252ZXJ0VG9SZWcoQCwgQG9iamVjdCkgaWYgQGlzTGl2ZVByb3AgYW5kIEBvcmlnRGVzY3JpcHRvclxuXHRcdGNvbnZlcnRUb1JlZyhALCBAdmFsdWUsIHRydWUpIGlmIEB0eXBlIGlzICdBcnJheSdcblx0XHRcblx0XHRpZiBAb2JqZWN0Ll9zYl9tYXBcblx0XHRcdGRlbGV0ZSBAb2JqZWN0Ll9zYl9tYXBbQHNlbGVjdG9yXVxuXHRcdFx0ZGVsZXRlIEBvYmplY3QuX3NiX21hcCBpZiBPYmplY3Qua2V5cyhAb2JqZWN0Ll9zYl9tYXApLmxlbmd0aCBpcyAwXG5cblxuXHRcdHJldHVyblxuXG5cblxuXG5cblxuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIyBWYWx1ZSBzZXQvZ2V0XG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IFxuXHRmZXRjaERpcmVjdFZhbHVlOiAoKS0+XG5cdFx0dHlwZSA9IEB0eXBlXG5cdFx0c3dpdGNoXG5cdFx0XHR3aGVuIHR5cGUgaXMgJ0Z1bmMnIHRoZW4gQG9iamVjdCgpXG5cdFx0XHRcblx0XHRcdHdoZW4gdHlwZSBpcyAnRE9NQXR0cicgdGhlbiBAb2JqZWN0LmdldEF0dHJpYnV0ZShAcHJvcGVydHkpIG9yICcnXG5cblx0XHRcdHdoZW4gQGlzTXVsdGlDaG9pY2Vcblx0XHRcdFx0cmVzdWx0cyA9IFtdXG5cdFx0XHRcdGZvciBjaG9pY2VOYW1lLGNob2ljZUVsIG9mIEBjaG9pY2VzXG5cdFx0XHRcdFx0aWYgY2hvaWNlRWwub2JqZWN0LmNoZWNrZWRcblx0XHRcdFx0XHRcdGlmIHR5cGUgaXMgJ0RPTVJhZGlvJ1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2hvaWNlTmFtZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2ggY2hvaWNlTmFtZVxuXG5cdFx0XHRcdHJldHVybiByZXN1bHRzXG5cdFx0XG5cdFx0XHRlbHNlIEBvYmplY3RbQHByb3BlcnR5XVxuXHRcblxuXG5cblx0c2V0VmFsdWU6IChuZXdWYWx1ZSwgcHVibGlzaGVyLCBmcm9tU2VsZiwgZnJvbUNoYW5nZUV2ZW50KS0+ICMgZnJvbVNlbGY9PT10cnVlIHdoZW4gY2FsbGVkIGZyb20gZXZlbnRVcGRhdGVIYW5kbGVyIG9yIHByb3BlcnR5IGRlc2NyaXB0b3Igc2V0dGVyICh1bmxlc3MgaXQncyBhbiBBcnJheSBiaW5kaW5nKVxuXHRcdHB1Ymxpc2hlciB8fD0gQFxuXHRcdG5ld1ZhbHVlID0gQHNlbGZUcmFuc2Zvcm0obmV3VmFsdWUpIGlmIEBzZWxmVHJhbnNmb3JtXG5cdFx0XG5cdFx0dW5sZXNzIGZyb21TZWxmIHRoZW4gc3dpdGNoIEB0eXBlXG5cdFx0XHR3aGVuICdPYmplY3RQcm9wJ1xuXHRcdFx0XHRpZiBub3QgQGlzTGl2ZVByb3Bcblx0XHRcdFx0XHRAb2JqZWN0W0Bwcm9wZXJ0eV0gPSBuZXdWYWx1ZSBpZiBuZXdWYWx1ZSBpc250IEB2YWx1ZVxuXHRcdFx0XHRpbXBvcnRJbmxpbmUgJy4vcHJvdG90eXBlLnNldFZhbHVlLU9iamVjdFByb3AtRE9NVmFsdWUnXG5cdFx0XHRcdGVsc2UgaWYgQG9yaWdTZXR0ZXJcblx0XHRcdFx0XHRAb3JpZ1NldHRlcihuZXdWYWx1ZSlcblxuXG5cdFx0XHR3aGVuICdQaG9sZGVyJ1xuXHRcdFx0XHRwYXJlbnQgPSBAcGFyZW50QmluZGluZ1xuXHRcdFx0XHRwYXJlbnQucGhvbGRlclZhbHVlc1tAcGhvbGRlcl0gPSBuZXdWYWx1ZVxuXHRcdFx0XHRlbnRpcmVWYWx1ZSA9IGFwcGx5UGxhY2Vob2xkZXJzKHBhcmVudC5waG9sZGVyQ29udGV4dHMsIHBhcmVudC5waG9sZGVyVmFsdWVzLCBwYXJlbnQucGhvbGRlckluZGV4TWFwKVxuXG5cdFx0XHRcdGlmIEB0ZXh0Tm9kZXMgYW5kIG5ld1ZhbHVlIGlzbnQgQHZhbHVlXG5cdFx0XHRcdFx0Zm9yIHRleHROb2RlIGluIEB0ZXh0Tm9kZXNcblx0XHRcdFx0XHRcdHRleHROb2RlW3RleHRDb250ZW50XSA9IG5ld1ZhbHVlXG5cdFx0XHRcdFxuXHRcdFx0XHRwYXJlbnQuc2V0VmFsdWUoZW50aXJlVmFsdWUsIHB1Ymxpc2hlcikgdW5sZXNzIEBwcm9wZXJ0eSBpcyB0ZXh0Q29udGVudFxuXHRcdFx0XHRcblxuXG5cdFx0XHR3aGVuICdBcnJheSdcblx0XHRcdFx0aWYgbmV3VmFsdWUgaXNudCBAdmFsdWVcblx0XHRcdFx0XHRuZXdWYWx1ZSA9IEFycmF5Ojpjb25jYXQobmV3VmFsdWUpIGlmIG5vdCBjaGVja0lmLmlzQXJyYXkobmV3VmFsdWUpXG5cdFx0XHRcdFx0Y29udmVydFRvUmVnKEAsIEB2YWx1ZSwgdHJ1ZSlcblx0XHRcdFx0XHRjb252ZXJ0VG9MaXZlKEAsIG5ld1ZhbHVlPW5ld1ZhbHVlLnNsaWNlKCksIHRydWUpXG5cdFx0XHRcdFx0QG9yaWdTZXR0ZXIobmV3VmFsdWUpIGlmIEBvcmlnU2V0dGVyICMgV2lsbCB1cGRhdGUgYW55IG90aGVyIHByZXZpb3VzIG5vbi1BcnJheSBiaW5kaW5ncyB0byB0aGUgc2FtZSBvYmplY3QgcHJvcGVydHlcblxuXG5cdFx0XHR3aGVuICdGdW5jJ1xuXHRcdFx0XHRwcmV2VmFsdWUgPSBAdmFsdWVQYXNzZWRcblx0XHRcdFx0QHZhbHVlUGFzc2VkID0gbmV3VmFsdWVcblx0XHRcdFx0bmV3VmFsdWUgPSBAb2JqZWN0KG5ld1ZhbHVlLCBwcmV2VmFsdWUpXG5cblx0XHRcdHdoZW4gJ0V2ZW50J1xuXHRcdFx0XHRAaXNFbWl0dGVyID0gdHJ1ZVxuXHRcdFx0XHRAZW1pdEV2ZW50KG5ld1ZhbHVlKVxuXHRcdFx0XHRAaXNFbWl0dGVyID0gZmFsc2Vcblx0XHRcblx0XHRcdGltcG9ydElubGluZSAnLi9wcm90b3R5cGUuc2V0VmFsdWUtRE9NVHlwZXMnXG5cdFx0XG5cdFx0QHZhbHVlID0gbmV3VmFsdWVcblx0XHRAdXBkYXRlQWxsU3VicyhwdWJsaXNoZXIpXG5cblx0XHRyZXR1cm5cblxuXG5cblxuXG5cdHVwZGF0ZUFsbFN1YnM6IChwdWJsaXNoZXIpLT4gaWYgaT0oYXJyPUBzdWJzKS5sZW5ndGggIyBVZ2x5IHNob3J0Y3V0IGZvciBpbmRleCBkZWZpbml0aW9uIGluIG9yZGVyIHRvIGxpbWl0IGxvZ2ljIHJlcGl0aWlvblxuXHRcdEB1cGRhdGVTdWIoYXJyW2ldLCBwdWJsaXNoZXIpIHdoaWxlIGktLVxuXHRcdHJldHVyblxuXG5cblxuXHRcdFx0XG5cblx0dXBkYXRlU3ViOiAoc3ViLCBwdWJsaXNoZXIsIGlzRGVsYXllZFVwZGF0ZSktPlxuXHRcdHJldHVybiBpZiAocHVibGlzaGVyIGlzIHN1Yikgb3IgKHB1Ymxpc2hlciBpc250IEAgYW5kIHB1Ymxpc2hlci5zdWJzTWV0YVtzdWIuSURdKSAjIGluZGljYXRlcyB0aGlzIGlzIGFuIGluZmluaXRlIGxvb3Bcblx0XHRtZXRhID0gQHN1YnNNZXRhW3N1Yi5JRF1cblxuXHRcdGlmIG1ldGEuZGlzYWxsb3dMaXN0IGFuZCBtZXRhLmRpc2FsbG93TGlzdFtwdWJsaXNoZXIuSURdXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIG1ldGEub3B0cy50aHJvdHRsZVxuXHRcdFx0Y3VycmVudFRpbWUgPSArKG5ldyBEYXRlKVxuXHRcdFx0dGltZVBhc3NlZCA9IGN1cnJlbnRUaW1lIC0gbWV0YS5sYXN0VXBkYXRlXG5cdFx0XHRcblx0XHRcdGlmIHRpbWVQYXNzZWQgPCBtZXRhLm9wdHMudGhyb3R0bGVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KG1ldGEudXBkYXRlVGltZXIpXG5cdFx0XHRcdHJldHVybiBtZXRhLnVwZGF0ZVRpbWVyID1cblx0XHRcdFx0XHRzZXRUaW1lb3V0ICgpPT5cblx0XHRcdFx0XHRcdEB1cGRhdGVTdWIoc3ViLCBwdWJsaXNoZXIpIGlmIEBzdWJzTWV0YVtzdWIuSURdXG5cdFx0XHRcdFx0LCBtZXRhLm9wdHMudGhyb3R0bGUtdGltZVBhc3NlZFxuXHRcdFx0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdG1ldGEubGFzdFVwZGF0ZSA9IGN1cnJlbnRUaW1lXG5cblx0XHRlbHNlIGlmIG1ldGEub3B0cy5kZWxheSBhbmQgbm90IGlzRGVsYXllZFVwZGF0ZVxuXHRcdFx0cmV0dXJuIHNldFRpbWVvdXQgKCk9PlxuXHRcdFx0XHRAdXBkYXRlU3ViKHN1YiwgcHVibGlzaGVyLCB0cnVlKSBpZiBAc3Vic01ldGFbc3ViLklEXVxuXHRcdFx0LCBtZXRhLm9wdHMuZGVsYXlcblxuXG5cdFx0bmV3VmFsdWUgPSBpZiBAdHlwZSBpcyAnQXJyYXknIGFuZCBtZXRhLm9wdHMuc2VuZEFycmF5Q29waWVzIHRoZW4gQHZhbHVlLnNsaWNlKCkgZWxzZSBAdmFsdWVcblx0XHRzdWJWYWx1ZSA9IHN1YlttZXRhLnZhbHVlUmVmXVxuXHRcdG5ld1ZhbHVlID0gaWYgdHJhbnNmb3JtPW1ldGEudHJhbnNmb3JtRm4gdGhlbiB0cmFuc2Zvcm0obmV3VmFsdWUsIHN1YlZhbHVlLCBzdWIub2JqZWN0KSBlbHNlIG5ld1ZhbHVlXG5cblx0XHRyZXR1cm4gaWYgbmV3VmFsdWUgaXMgc3ViVmFsdWUgYW5kIG5vdCBtZXRhLm9wdHMudXBkYXRlRXZlbklmU2FtZSBvclxuXHRcdFx0bWV0YS5jb25kaXRpb25GbiBhbmQgbm90IG1ldGEuY29uZGl0aW9uRm4obmV3VmFsdWUsIHN1YlZhbHVlLCBzdWIub2JqZWN0KVxuXG5cdFx0IyBXaHkgZG8gd2UgbmVlZCB0aGUgJ3Byb21pc2VUcmFuc2Zvcm1zJyBvcHRpb24gd2hlbiB3ZSBjYW4ganVzdCBjaGVjayBmb3IgdGhlIGV4aXN0YW5jZSBvZiAudGhlbiBtZXRob2Q/XG5cdFx0IyBCZWNhdXNlIHRlc3RzIHNob3cgdGhhdCB3aGVuIHNlYXJjaGluZyBmb3IgdGhlIC50aGVuIHByb3Agb24gdGhlIG9iamVjdCByZXN1bHRzIGluIGEgcGVyZm9ybWFuY2Ugc2xvd2Rvd24gb2YgdXAgdG8gMzAlIVxuXHRcdCMgQ2hlY2tpbmcgaWYgdGhlIHByb21pc2VUcmFuc2Zvcm1zIG9wdGlvbiBpcyBlbmFibGVkIGZpcnN0IGVsaW1pbmF0ZXMgdW5uZWNlc3NhcnkgbG9va3VwcyAmIHNsb3dkb3ducy5cblx0XHRpZiBtZXRhLm9wdHMucHJvbWlzZVRyYW5zZm9ybXMgYW5kIG5ld1ZhbHVlIGFuZCBjaGVja0lmLmlzRnVuY3Rpb24obmV3VmFsdWUudGhlbilcblx0XHRcdG5ld1ZhbHVlLnRoZW4gKG5ld1ZhbHVlKS0+IHN1Yi5zZXRWYWx1ZShuZXdWYWx1ZSwgcHVibGlzaGVyKTsgcmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0c3ViLnNldFZhbHVlKG5ld1ZhbHVlLCBwdWJsaXNoZXIpXG5cblx0XHRAcmVtb3ZlU3ViKHN1YikgaWYgbWV0YS51cGRhdGVPbmNlXG5cdFx0cmV0dXJuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyMgVHJhbnNmb3JtcyAmIENvbmRpdGlvbnNcblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0YWRkTW9kaWZpZXJGbjogKHRhcmdldCwgc3ViSW50ZXJmYWNlcywgc3ViamVjdEZuLCB1cGRhdGVPbkJpbmQpLT5cblx0XHRpZiBub3QgY2hlY2tJZi5pc0Z1bmN0aW9uKHN1YmplY3RGbilcblx0XHRcdHRocm93V2FybmluZygnZm5Pbmx5JywyKVxuXG5cdFx0ZWxzZVxuXHRcdFx0Zm9yIHN1YkludGVyZmFjZSBpbiBzdWJJbnRlcmZhY2VzXG5cdFx0XHRcdHN1YnNjcmliZXIgPSBzdWJJbnRlcmZhY2UuXyBvciBzdWJJbnRlcmZhY2UgIyBTZWNvbmQgaXMgY2hvc2VuIHdoZW4gdGhlIHBhc3NlZCBzdWJzY3JpYmVyIGludGVyZmFjZXMgbXVsdGktYmluZGluZyAoaXMgYSByZWN1cnNpdmUgY2FsbCBvZiB0aGlzIG1ldGhvZClcblxuXHRcdFx0XHRpZiBzdWJzY3JpYmVyLmlzTXVsdGlcblx0XHRcdFx0XHRAYWRkTW9kaWZpZXJGbih0YXJnZXQsIHN1YnNjcmliZXIuYmluZGluZ3MsIHN1YmplY3RGbiwgdXBkYXRlT25CaW5kKVxuXHRcdFx0XHRcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHN1Yk1ldGFEYXRhID0gQHN1YnNNZXRhW3N1YnNjcmliZXIuSURdXG5cdFx0XHRcdFx0c3ViTWV0YURhdGFbdGFyZ2V0XSA9IHN1YmplY3RGblxuXHRcdFx0XHRcdHVwZGF0ZU9uQmluZCA9IHVwZGF0ZU9uQmluZCBhbmQgbm90IHN1Yk1ldGFEYXRhLnVwZGF0ZU9uY2VcblxuXHRcdFx0XHRcdGlmIEBwdWJzTWFwW3N1YnNjcmliZXIuSURdXG5cdFx0XHRcdFx0XHRzdWJzY3JpYmVyLnN1YnNNZXRhW0BJRF1bdGFyZ2V0XSB8fD0gc3ViamVjdEZuICMgV2lsbCBub3QgcmVwbGFjZSBleGlzdGluZyBtb2RpZmllciBmdW5jdGlvbiBpZiBleGlzdHNcblxuXHRcdFx0XHRcdEB1cGRhdGVTdWIoc3Vic2NyaWJlciwgQCkgaWYgKHVwZGF0ZU9uQmluZCBvciBAdHlwZSBpcyAnRnVuYycpIGFuZCB0YXJnZXQgaXMgJ3RyYW5zZm9ybUZuJ1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXG5cblxuXHRzZXRTZWxmVHJhbnNmb3JtOiAodHJhbnNmb3JtRm4sIHVwZGF0ZU9uQmluZCktPlxuXHRcdEBzZWxmVHJhbnNmb3JtID0gdHJhbnNmb3JtRm5cblx0XHRAc2V0VmFsdWUoQHZhbHVlKSBpZiB1cGRhdGVPbkJpbmRcblx0XHRyZXR1cm5cblxuXG5cblxuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIyBBbGxvdy9EaXNhbGxvdyBydWxlc1xuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcblx0YWRkRGlzYWxsb3dSdWxlOiAodGFyZ2V0U3ViLCB0YXJnZXREaXNhbGxvdyktPlxuXHRcdGRpc2FsbG93TGlzdCA9IEBzdWJzTWV0YVt0YXJnZXRTdWIuSURdLmRpc2FsbG93TGlzdCA/PSBnZW5PYmooKVxuXHRcdGRpc2FsbG93TGlzdFt0YXJnZXREaXNhbGxvdy5JRF0gPSAxXG5cdFx0cmV0dXJuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyMgUGxhY2Vob2xkZXJzXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IFxuXHRzY2FuRm9yUGhvbGRlcnM6ICgpLT4gdW5sZXNzIEBwaG9sZGVyVmFsdWVzXG5cdFx0QHBob2xkZXJWYWx1ZXMgPSBnZW5PYmooKVxuXHRcdEBwaG9sZGVySW5kZXhNYXAgPSBnZW5PYmooKVxuXHRcdEBwaG9sZGVyQ29udGV4dHMgPSBbXVxuXG5cdFx0aWYgY2hlY2tJZi5pc1N0cmluZyhAdmFsdWUpXG5cdFx0XHRAcGhvbGRlckNvbnRleHRzID0gQHZhbHVlLnNwbGl0IHBob2xkZXJSZWdFeFNwbGl0XG5cdFx0XHRcblx0XHRcdGluZGV4ID0gMFxuXHRcdFx0QHZhbHVlID0gQHZhbHVlLnJlcGxhY2UgcGhvbGRlclJlZ0V4LCAoZSwgcGhvbGRlcik9PlxuXHRcdFx0XHRAcGhvbGRlckluZGV4TWFwW2luZGV4KytdID0gcGhvbGRlclxuXHRcdFx0XHRAcGhvbGRlclZhbHVlc1twaG9sZGVyXSA9IHBob2xkZXJcblx0XHRcblx0XHRzY2FuVGV4dE5vZGVzUGxhY2Vob2xkZXJzKEBvYmplY3QsIEB0ZXh0Tm9kZXM9Z2VuT2JqKCkpIGlmIEBpc0RvbSBhbmQgQHByb3BlcnR5IGlzIHRleHRDb250ZW50XG5cdFx0cmV0dXJuXG5cdFxuXG5cblxuXG5cblxuXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMjIFBvbGxpbmdcblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gXG5cdGFkZFBvbGxJbnRlcnZhbDogKHRpbWUpLT4gaWYgQHR5cGUgaXNudCAnRXZlbnQnXG5cdFx0QHJlbW92ZVBvbGxJbnRlcnZhbCgpXG5cdFx0XG5cdFx0QHBvbGxJbnRlcnZhbCA9IHNldEludGVydmFsICgpPT5cblx0XHRcdHBvbGxlZFZhbHVlID0gQGZldGNoRGlyZWN0VmFsdWUoKVxuXG5cdFx0XHRAc2V0VmFsdWUgcG9sbGVkVmFsdWUsIEAsIHRydWVcblx0XHQsIHRpbWVcblxuXG5cdHJlbW92ZVBvbGxJbnRlcnZhbDogKCktPlxuXHRcdGNsZWFySW50ZXJ2YWwoQHBvbGxJbnRlcnZhbClcblx0XHRAcG9sbEludGVydmFsID0gbnVsbFxuXG5cblxuXG5cblxuXG5cblxuXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMjIEV2ZW50c1xuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcblx0XG5cdGFkZFVwZGF0ZUxpc3RlbmVyOiAoZXZlbnROYW1lLCB0YXJnZXRQcm9wZXJ0eSktPlxuXHRcdEBvYmplY3QuYWRkRXZlbnRMaXN0ZW5lciBldmVudE5hbWUsIChldmVudCk9PlxuXHRcdFx0dW5sZXNzIGV2ZW50Ll9zYlxuXHRcdFx0XHRzaG91bGRSZWRlZmluZVZhbHVlID0gQHNlbGZUcmFuc2Zvcm0gYW5kIEBpc0RvbUlucHV0XG5cdFx0XHRcdEBzZXRWYWx1ZShAb2JqZWN0W3RhcmdldFByb3BlcnR5XSwgbnVsbCwgIXNob3VsZFJlZGVmaW5lVmFsdWUsIHRydWUpXG5cblx0XHRcdHJldHVyblxuXHRcdFxuXHRcdCwgZmFsc2Vcblx0XHRyZXR1cm5cblx0XG5cblx0YXR0YWNoRXZlbnRzOiAoKS0+XG5cdFx0aWYgQGV2ZW50TmFtZVxuXHRcdFx0QHJlZ2lzdGVyRXZlbnQoQGV2ZW50TmFtZSlcblx0XHRcblx0XHRlbHNlIGlmIEBpc0RvbUlucHV0XG5cdFx0XHRAYWRkVXBkYXRlTGlzdGVuZXIoJ2lucHV0JywgJ3ZhbHVlJylcblx0XHRcdEBhZGRVcGRhdGVMaXN0ZW5lcignY2hhbmdlJywgJ3ZhbHVlJylcblxuXHRcdGVsc2UgaWYgbm90IEBpc011bHRpQ2hvaWNlIGFuZCAoQHR5cGUgaXMgJ0RPTVJhZGlvJyBvciBAdHlwZSBpcyAnRE9NQ2hlY2tib3gnKVxuXHRcdFx0QGFkZFVwZGF0ZUxpc3RlbmVyKCdjaGFuZ2UnLCAnY2hlY2tlZCcpXG5cblx0XHRyZXR1cm5cblx0XG5cblxuXHRyZWdpc3RlckV2ZW50OiAoZXZlbnROYW1lKS0+XG5cdFx0QGF0dGFjaGVkRXZlbnRzLnB1c2goZXZlbnROYW1lKVxuXHRcdEBldmVudEhhbmRsZXIgPSBldmVudFVwZGF0ZUhhbmRsZXIuYmluZChAKSB1bmxlc3MgQGV2ZW50SGFuZGxlclxuXHRcdFxuXHRcdEBvYmplY3RbQGV2ZW50TWV0aG9kcy5saXN0ZW5dKGV2ZW50TmFtZSwgQGV2ZW50SGFuZGxlcilcblx0XHRyZXR1cm5cblxuXG5cblx0dW5SZWdpc3RlckV2ZW50OiAoZXZlbnROYW1lKS0+XG5cdFx0QGF0dGFjaGVkRXZlbnRzLnNwbGljZSBAYXR0YWNoZWRFdmVudHMuaW5kZXhPZihldmVudE5hbWUpLCAxXG5cblx0XHRAb2JqZWN0W0BldmVudE1ldGhvZHMucmVtb3ZlXShldmVudE5hbWUsIEBldmVudEhhbmRsZXIpXG5cdFx0cmV0dXJuXG5cblxuXG5cdGVtaXRFdmVudDogKGV4dHJhRGF0YSktPlxuXHRcdGV2ZW50T2JqZWN0ID0gQGV2ZW50TmFtZVxuXHRcdFxuXHRcdGlmIEBldmVudE1ldGhvZHMuZW1pdCBpcyAnZGlzcGF0Y2hFdmVudCdcblx0XHRcdHVubGVzcyBAZXZlbnRPYmplY3Rcblx0XHRcdFx0QGV2ZW50T2JqZWN0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jylcblx0XHRcdFx0QGV2ZW50T2JqZWN0LmluaXRFdmVudChAZXZlbnROYW1lLCB0cnVlLCB0cnVlKVxuXG5cdFx0XHRAZXZlbnRPYmplY3QuYmluZGluZ0RhdGEgPSBleHRyYURhdGFcblx0XHRcdGV2ZW50T2JqZWN0ID0gQGV2ZW50T2JqZWN0XG5cblx0XHRAb2JqZWN0W0BldmVudE1ldGhvZHMuZW1pdF0oZXZlbnRPYmplY3QsIGV4dHJhRGF0YSlcblx0XHRyZXR1cm5cblxuXG5cblxuZXZlbnRVcGRhdGVIYW5kbGVyID0gKCktPiB1bmxlc3MgQGlzRW1pdHRlclxuXHRAc2V0VmFsdWUoYXJndW1lbnRzW0Bwcm9wZXJ0eV0sIG51bGwsIHRydWUpXG5cdHJldHVyblxuXG5cblxuXG5cbiIsImVsc2UgaWYgQGlzRG9tSW5wdXRcblx0aWYgbm90IGZyb21DaGFuZ2VFdmVudFxuXHRcdEBvcmlnU2V0dGVyKG5ld1ZhbHVlKVxuXHRcdEBvYmplY3QuZGlzcGF0Y2hFdmVudChjaGFuZ2VFdmVudCgpKSBpZiBzZXR0aW5ncy5kaXNwYXRjaEV2ZW50c1xuXHRcblx0ZWxzZSBpZiBuZXdWYWx1ZSBpc250IEBvcmlnR2V0dGVyKCkgIyBJTVBMSUNJVDogYW5kIGZyb21DaGFuZ2VFdmVudFxuXHRcdHByZXZDdXJzcm9yID0gQG9iamVjdC5zZWxlY3Rpb25TdGFydFxuXHRcdEBvcmlnU2V0dGVyKG5ld1ZhbHVlKVxuXHRcdEBvYmplY3Quc2V0U2VsZWN0aW9uUmFuZ2UocHJldkN1cnNyb3IsIHByZXZDdXJzcm9yKSBpZiBwcmV2Q3Vyc3JvciIsIndoZW4gJ0RPTVJhZGlvJ1xuXHRpZiBAaXNNdWx0aUNob2ljZSAjIFRoZSBuZXdWYWx1ZSB2YXIgd2lsbCBob2xkIHRoZSByYWRpbyBmaWVsZCBiaW5kaW5nIGFzIGl0cyB2YWx1ZSBpZiB0aGUgdXBkYXRlIGlzIGNvbWluZyBmcm9tIHRoZSByYWRpbyBmaWVsZCdzIGNoYW5nZSBldmVudFxuXHRcdHRhcmdldENob2ljZUJpbmRpbmcgPSBpZiBjaGVja0lmLmlzQmluZGluZyhuZXdWYWx1ZSkgdGhlbiBuZXdWYWx1ZSBlbHNlIEBjaG9pY2VzW25ld1ZhbHVlXVxuXG5cdFx0aWYgdGFyZ2V0Q2hvaWNlQmluZGluZ1xuXHRcdFx0bmV3VmFsdWUgPSB0YXJnZXRDaG9pY2VCaW5kaW5nLm9iamVjdC52YWx1ZVxuXHRcdFxuXHRcdFx0Zm9yIG4sY2hvaWNlQmluZGluZyBvZiBAY2hvaWNlc1xuXHRcdFx0XHRjaG9pY2VCaW5kaW5nLnNldFZhbHVlKGNob2ljZUJpbmRpbmcuSUQgaXMgdGFyZ2V0Q2hvaWNlQmluZGluZy5JRCwgcHVibGlzaGVyKVxuXHRcdGVsc2Vcblx0XHRcdG5ld1ZhbHVlID0gQHZhbHVlICMgU2V0IHRvIHByZXYgdmFsdWVcblx0XG5cdGVsc2Vcblx0XHRuZXdWYWx1ZSA9ICEhbmV3VmFsdWUgIyBDb252ZXJ0IHRvIEJvb2xlYW5cblx0XHRyZXR1cm4gaWYgbmV3VmFsdWUgaXMgQHZhbHVlXG5cdFx0QG9iamVjdC5jaGVja2VkID0gbmV3VmFsdWUgdW5sZXNzIEBvYmplY3QuY2hlY2tlZCBpcyBuZXdWYWx1ZVxuXHRcdEBvYmplY3QuZGlzcGF0Y2hFdmVudChjaGFuZ2VFdmVudCgpKSBpZiBuZXdWYWx1ZSBhbmQgc2V0dGluZ3MuZGlzcGF0Y2hFdmVudHMgIyBPbmx5IGVtaXQgaWYgdGhlIHZhbHVlIGlzIHRydWUgKGluIG9yZGVyIHRvIGNvbmZvcm0gdG8gd2ViIHN0YW5kYXJkcylcblxuXG53aGVuICdET01DaGVja2JveCdcblx0aWYgQGlzTXVsdGlDaG9pY2UgIyBUaGUgbmV3VmFsdWUgdmFyIHdpbGwgaG9sZCB0aGUgY2hlY2tib3ggZmllbGQgYmluZGluZyBhcyBpdHMgdmFsdWUgaWYgdGhlIHVwZGF0ZSBpcyBjb21pbmcgZnJvbSB0aGUgY2hlY2tib3ggZmllbGQncyBjaGFuZ2UgZXZlbnRcblx0XHRvdmVyd3JpdGVQcmV2aW91cyA9IG5vdCBjaGVja0lmLmlzQmluZGluZyhuZXdWYWx1ZSkgIyBNZWFucyB0aGF0IGEgbmV3IGFycmF5IHdhcyBzdXBwbGllZFxuXHRcdG5ld0Nob2ljZXMgPSBbXS5jb25jYXQobmV3VmFsdWUpICMgVGhpcyAqbm9ybWFsaXplcyogdGhlIG5ldyB2YWx1ZSBpbnRvIGFuIGFycmF5XG5cdFx0XG5cdFx0Zm9yIHZhbHVlLGluZGV4IGluIG5ld0Nob2ljZXNcblx0XHRcdG5ld0Nob2ljZXNbaW5kZXhdID0gaWYgY2hlY2tJZi5pc0JpbmRpbmcodmFsdWUpIHRoZW4gdmFsdWUgZWxzZSBAY2hvaWNlc1t2YWx1ZV1cblx0XHRcblx0XHRuZXdWYWx1ZUFycmF5ID0gW11cblx0XHRmb3IgY2hvaWNlTmFtZSxjaG9pY2VCaW5kaW5nIG9mIEBjaG9pY2VzXG5cdFx0XHRpZiBvdmVyd3JpdGVQcmV2aW91c1xuXHRcdFx0XHRuZXdDaG9pY2VWYWx1ZSA9IHRhcmdldEluY2x1ZGVzKG5ld0Nob2ljZXMsIGNob2ljZUJpbmRpbmcpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG5ld0Nob2ljZVZhbHVlID0gY2hvaWNlQmluZGluZy52YWx1ZVxuXHRcdFx0XG5cdFx0XHRjaG9pY2VCaW5kaW5nLnNldFZhbHVlKG5ld0Nob2ljZVZhbHVlLCBwdWJsaXNoZXIpXG5cdFx0XHRuZXdWYWx1ZUFycmF5LnB1c2goY2hvaWNlTmFtZSkgaWYgbmV3Q2hvaWNlVmFsdWVcblxuXHRcdG5ld1ZhbHVlID0gbmV3VmFsdWVBcnJheVxuXG5cblx0ZWxzZVxuXHRcdG5ld1ZhbHVlID0gISFuZXdWYWx1ZSAjIENvbnZlcnQgdG8gQm9vbGVhblxuXHRcdHJldHVybiBpZiBuZXdWYWx1ZSBpcyBAdmFsdWVcblx0XHR1bmxlc3MgQG9iamVjdC5jaGVja2VkIGlzIG5ld1ZhbHVlXG5cdFx0XHRAb2JqZWN0LmNoZWNrZWQgPSBuZXdWYWx1ZVxuXHRcdFx0QG9iamVjdC5kaXNwYXRjaEV2ZW50KGNoYW5nZUV2ZW50KCkpIGlmIHNldHRpbmdzLmRpc3BhdGNoRXZlbnRzXG5cblxuXG53aGVuICdET01BdHRyJ1xuXHRAb2JqZWN0LnNldEF0dHJpYnV0ZShAcHJvcGVydHksIG5ld1ZhbHVlKVxuIiwiIyMjKlxuICogU3RhZ2UgZGVmaW5pdGlvbnM6XG4gKiBcbiAqIDA6IFNlbGVjdGlvbjpcdFx0XHRHb3Qgc2VsZWN0b3IsIGF3YWl0aW5nIG9iamVjdC5cbiAqIDE6IEluZGljYXRpb246XHRcdFx0R290IG9iamVjdCwgYXdhaXRpbmcgcHJveGllZCBwcm9wZXJ0eSAvIGZ1bmN0aW9uIC8gQmluZGluZy1vYmplY3QuXG4gKiAyOiBCaW5kaW5nIENvbXBsZXRlOlx0XHRDb21wbGV0ZSwgYXdhaXRpbmcgYWRkaXRpb25hbCAob3B0aW9uYWwpIGJpbmRpbmdzL211dGF0aW9ucy5cbiMjI1xuQmluZGluZ0ludGVyZmFjZSA9IChvcHRpb25zLCBpbmhlcml0ZWRTdGF0ZSktPlxuXHRpZiBpbmhlcml0ZWRTdGF0ZVxuXHRcdGV4dGVuZFN0YXRlKEAsIGluaGVyaXRlZFN0YXRlKVxuXHRcdEBzdGFnZSA9IDFcblx0ZWxzZVxuXHRcdEBzdGFnZSA9IDBcblx0XHRAc3VicyA9IFtdXG5cdFx0QG9wdGlvbnNQYXNzZWQgPSBvcHRpb25zIHx8PSB7fVxuXHRcdEBvcHRpb25zID0ge31cblx0XHRmb3Iga2V5IG9mIGRlZmF1bHRPcHRpb25zXG5cdFx0XHRAb3B0aW9uc1trZXldID0gaWYgb3B0aW9uc1trZXldPyB0aGVuIG9wdGlvbnNba2V5XSBlbHNlIGRlZmF1bHRPcHRpb25zW2tleV1cblx0XG5cdHJldHVybiBAXHRcdFx0XG5cdFxuXG5cblxuaW1wb3J0ICcuL3Byb3RvdHlwZS1wcml2YXRlJ1xuaW1wb3J0ICcuL3Byb3RvdHlwZS1wdWJsaWMnIiwiQmluZGluZ0ludGVyZmFjZVByaXZhdGUgPVxuXHRzZWxmQ2xvbmU6ICgpLT4gbmV3IEJpbmRpbmdJbnRlcmZhY2UobnVsbCwgQClcblx0XG5cdGRlZmluZU1haW5Qcm9wczogKGJpbmRpbmcpLT5cblx0XHRAXyA9IGJpbmRpbmdcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyBALFxuXHRcdFx0J3ZhbHVlJzpcdFx0Z2V0OiAoKS0+IGJpbmRpbmcudmFsdWVcblx0XHRcdCdvcmlnaW5hbCc6XHRcdGdldDogKCktPiBiaW5kaW5nLm9iamVjdHMgb3IgYmluZGluZy5vYmplY3Rcblx0XHRcdCdzdWJzY3JpYmVycyc6XHRnZXQ6ICgpLT4gYmluZGluZy5zdWJzLnNsaWNlKCkubWFwIChzdWIpLT4gc3ViLm9iamVjdFxuXG5cblxuXG5cdGNyZWF0ZUJpbmRpbmc6IChzdWJqZWN0LCBuZXdPYmplY3RUeXBlLCBiaW5kaW5nSW50ZXJmYWNlLCBpc0Z1bmN0aW9uKS0+XG5cdFx0QG9iamVjdCA9IHN1YmplY3Rcblx0XHRjYWNoZWRCaW5kaW5nID0gY2FjaGUuZ2V0KHN1YmplY3QsIGlzRnVuY3Rpb24sIEBzZWxlY3RvciwgQGlzTXVsdGlDaG9pY2UpXG5cdFx0XG5cdFx0aWYgY2FjaGVkQmluZGluZyAjIEV4aXQgZWFybHkgYnkgcmV0dXJuaW5nIHRoZSBzdWJqZWN0IGZyb20gY2FjaGUgaWYgaXMgYWxyZWFkeSBpbiB0aGVyZVxuXHRcdFx0cmV0dXJuIEBwYXRjaENhY2hlZEJpbmRpbmcoY2FjaGVkQmluZGluZylcblxuXHRcdGVsc2Vcblx0XHRcdG5ld0JpbmRpbmcgPSBuZXcgQmluZGluZyhzdWJqZWN0LCBuZXdPYmplY3RUeXBlLCBiaW5kaW5nSW50ZXJmYWNlKVxuXHRcdFx0Y2FjaGUuc2V0KG5ld0JpbmRpbmcsIGlzRnVuY3Rpb24pXG5cdFx0XHRyZXR1cm4gbmV3QmluZGluZ1xuXG5cblxuXHRwYXRjaENhY2hlZEJpbmRpbmc6IChjYWNoZWRCaW5kaW5nKS0+XG5cdFx0aWYgY2FjaGVkQmluZGluZy50eXBlIGlzICdPYmplY3RQcm9wJyBhbmQgQHByb3BlcnR5IG5vdCBvZiBAb2JqZWN0ICMgVGhpcyBwcm9wZXJ0eSB3YXMgbWFudWFsbHkgZGVsZXRlZCBhbmQgbmVlZHMgaXRzIHByb3AgdG8gYmUgcmUtZGVmaW5lZCBhcyBhIGxpdmUgb25lXG5cdFx0XHRjb252ZXJ0VG9MaXZlKGNhY2hlZEJpbmRpbmcsIEBvYmplY3QpXG5cblx0XHRpZiBAc2F2ZU9wdGlvbnNcblx0XHRcdGNhY2hlZEJpbmRpbmcub3B0aW9uc0RlZmF1bHRbb3B0aW9uXSA9IHZhbHVlIGZvciBvcHRpb24sdmFsdWUgb2YgQG9wdGlvbnNQYXNzZWRcblxuXHRcdGZvciBrZXksdmFsdWUgb2YgY2FjaGVkQmluZGluZy5vcHRpb25zRGVmYXVsdFxuXHRcdFx0QG9wdGlvbnNba2V5XSA9IGlmIGNoZWNrSWYuaXNEZWZpbmVkKEBvcHRpb25zUGFzc2VkW2tleV0pIHRoZW4gQG9wdGlvbnNQYXNzZWRba2V5XSBlbHNlIHZhbHVlXG5cdFx0XG5cdFx0cmV0dXJuIGNhY2hlZEJpbmRpbmdcblxuXG5cblx0c2V0UHJvcGVydHk6IChzdWJqZWN0KS0+XG5cdFx0c3ViamVjdCA9IHN1YmplY3QudG9TdHJpbmcoKSBpZiBjaGVja0lmLmlzTnVtYmVyKHN1YmplY3QpXG5cdFx0QHNlbGVjdG9yID0gQHByb3BlcnR5ID0gc3ViamVjdFxuXG5cdFx0XG5cdFx0dW5sZXNzIEBvcHRpb25zLnNpbXBsZVNlbGVjdG9yXG5cdFx0XHRpZiB0YXJnZXRJbmNsdWRlcyhzdWJqZWN0LCAnOicpXG5cdFx0XHRcdHNwbGl0ID0gc3ViamVjdC5zcGxpdCgnOicpXG5cdFx0XHRcdEBkZXNjcmlwdG9yID0gc3BsaXQuc2xpY2UoMCwgLTEpLmpvaW4oJzonKVxuXHRcdFx0XHRAcHJvcGVydHkgPSBzcGxpdFtzcGxpdC5sZW5ndGgtMV1cblx0XHRcdFxuXHRcdFx0XG5cdFx0XHRpZiB0YXJnZXRJbmNsdWRlcyhzdWJqZWN0LCAnLicpICMgUGxhY2Vob2xkZXIgZXh0cmFjdGlvblxuXHRcdFx0XHRzcGxpdCA9IEBwcm9wZXJ0eS5zcGxpdCgnLicpICMgV2UgdXNlICdAcHJvcGVydHknIGluc3RlYWQgb2YgJ3N1YmplY3QnIGJlY2F1c2UgaXQgbWF5IGhhdmUgYmVlbiBtb2RpZmllZCBieSB0aGUgcHJldmlvdXMgJzonIGRlc2NyaXB0b3IgY2hlY2tcblx0XHRcdFx0QHByb3BlcnR5ID0gc3BsaXRbMF1cdFx0XHRcdFxuXHRcdFx0XHRAcGhvbGRlciA9IHNwbGl0LnNsaWNlKDEpLmpvaW4oJy4nKVxuXG5cblxuXHRcdFx0aWYgdGFyZ2V0SW5jbHVkZXMoQGRlc2NyaXB0b3IsICdldmVudCcpXG5cdFx0XHRcdGlmIHRhcmdldEluY2x1ZGVzKHN1YmplY3QsICcjJylcblx0XHRcdFx0XHRzcGxpdCA9IEBwcm9wZXJ0eS5zcGxpdCgnIycpXG5cdFx0XHRcdFx0QGV2ZW50TmFtZSA9IHNwbGl0WzBdXG5cdFx0XHRcdFx0QHByb3BlcnR5ID0gc3BsaXRbMV1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBldmVudE5hbWUgPSBAcHJvcGVydHlcblx0XHRcdFx0XHRAcHJvcGVydHkgPSAwXG5cblx0XHRcdFx0dGhyb3dXYXJuaW5nKCdiYWRFdmVudEFyZycsMSkgaWYgaXNOYU4gcGFyc2VJbnQoQHByb3BlcnR5KVxuXG5cdFx0cmV0dXJuIEBcblxuXG5cblx0c2V0T2JqZWN0OiAoc3ViamVjdCwgaXNGdW5jdGlvbiktPlxuXHRcdEBzdGFnZSA9IDFcblx0XHRpbXBvcnQgJy4vcHJvdG90eXBlLXByaXZhdGUuc2V0T2JqZWN0LXBhcnNlRE9NT2JqZWN0J1xuXHRcdFxuXHRcdHN3aXRjaFxuXHRcdFx0d2hlbiBpc0Z1bmN0aW9uXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnRnVuYydcblx0XHRcdFxuXHRcdFx0d2hlbiBAcGhvbGRlclxuXHRcdFx0XHRuZXdPYmplY3RUeXBlID0gJ1Bob2xkZXInXG5cdFx0XHRcblx0XHRcdHdoZW4gdGFyZ2V0SW5jbHVkZXMoQGRlc2NyaXB0b3IsICdhcnJheScpIGFuZCBjaGVja0lmLmlzQXJyYXkoc3ViamVjdFtAcHJvcGVydHldKVxuXHRcdFx0XHRuZXdPYmplY3RUeXBlID0gJ0FycmF5J1xuXHRcdFx0XG5cdFx0XHR3aGVuIHRhcmdldEluY2x1ZGVzKEBkZXNjcmlwdG9yLCAnZXZlbnQnKVxuXHRcdFx0XHRuZXdPYmplY3RUeXBlID0gJ0V2ZW50J1xuXHRcdFx0XHRpbXBvcnQgJy4vcHJvdG90eXBlLXByaXZhdGUuc2V0T2JqZWN0LWRlZmluZUV2ZW50TWV0aG9kcydcblxuXHRcdFx0d2hlbiB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ2Z1bmMnKVxuXHRcdFx0XHRuZXdPYmplY3RUeXBlID0gJ1Byb3h5J1xuXHRcdFx0XG5cdFx0XHR3aGVuIGlzRG9tUmFkaW8gXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnRE9NUmFkaW8nXG5cblx0XHRcdHdoZW4gaXNEb21DaGVja2JveCBcblx0XHRcdFx0bmV3T2JqZWN0VHlwZSA9ICdET01DaGVja2JveCdcblxuXHRcdFx0d2hlbiB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ2F0dHInKVxuXHRcdFx0XHRuZXdPYmplY3RUeXBlID0gJ0RPTUF0dHInXG5cblx0XHRcdGVsc2Vcblx0XHRcdFx0bmV3T2JqZWN0VHlwZSA9ICdPYmplY3RQcm9wJ1xuXHRcdFxuXG5cdFx0aWYgdGFyZ2V0SW5jbHVkZXMoQGRlc2NyaXB0b3IsICdtdWx0aScpXG5cdFx0XHR0aHJvd0Vycm9yKCdlbXB0eUxpc3QnKSBpZiBub3Qgc3ViamVjdC5sZW5ndGhcblx0XHRcdEBkZWZpbmVNYWluUHJvcHMgbmV3IEdyb3VwQmluZGluZyhALCBzdWJqZWN0LCBuZXdPYmplY3RUeXBlKVxuXHRcdGVsc2Vcblx0XHRcdEBkZWZpbmVNYWluUHJvcHMgQGNyZWF0ZUJpbmRpbmcoc3ViamVjdCwgbmV3T2JqZWN0VHlwZSwgQCwgaXNGdW5jdGlvbilcblxuXG5cdFx0aWYgdGFyZ2V0SW5jbHVkZXMoQF8udHlwZSwgJ0V2ZW50Jykgb3IgdGFyZ2V0SW5jbHVkZXMoQF8udHlwZSwgJ1Byb3h5Jylcblx0XHRcdEBvcHRpb25zLnVwZGF0ZU9uQmluZCA9IGZhbHNlXG5cdFx0ZWxzZSBpZiB0YXJnZXRJbmNsdWRlcyhAXy50eXBlLCAnRnVuYycpXG5cdFx0XHRAb3B0aW9ucy51cGRhdGVPbkJpbmQgPSB0cnVlXG5cblxuXHRcdGlmIEBjb21wbGV0ZUNhbGxiYWNrXG5cdFx0XHRyZXR1cm4gQGNvbXBsZXRlQ2FsbGJhY2soQClcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gQFxuXG5cblxuXG5cdGFkZFRvUHVibGlzaGVyOiAocHVibGlzaGVySW50ZXJmYWNlKS0+XG5cdFx0cHVibGlzaGVySW50ZXJmYWNlLnN0YWdlID0gMlxuXHRcdHB1Ymxpc2hlckludGVyZmFjZS5zdWJzLnB1c2goQClcblx0XHRhbHJlYWR5SGFkU3ViID0gcHVibGlzaGVySW50ZXJmYWNlLl8uYWRkU3ViKEBfLCBwdWJsaXNoZXJJbnRlcmZhY2Uub3B0aW9ucywgcHVibGlzaGVySW50ZXJmYWNlLnVwZGF0ZU9uY2UpXG5cblx0XHRpZiBwdWJsaXNoZXJJbnRlcmZhY2UudXBkYXRlT25jZVxuXHRcdFx0ZGVsZXRlIHB1Ymxpc2hlckludGVyZmFjZS51cGRhdGVPbmNlXG5cdFx0XG5cdFx0ZWxzZSBpZiBwdWJsaXNoZXJJbnRlcmZhY2Uub3B0aW9ucy51cGRhdGVPbkJpbmQgYW5kIG5vdCBhbHJlYWR5SGFkU3ViXG5cdFx0XHRpZiBAXy5pc011bHRpXG5cdFx0XHRcdHB1Ymxpc2hlckludGVyZmFjZS5fLnVwZGF0ZVN1YihiaW5kaW5nLCBwdWJsaXNoZXJJbnRlcmZhY2UuXykgZm9yIGJpbmRpbmcgaW4gQF8uYmluZGluZ3Ncblx0XHRcdGVsc2Vcblx0XHRcdFx0cHVibGlzaGVySW50ZXJmYWNlLl8udXBkYXRlU3ViKEBfLCBwdWJsaXNoZXJJbnRlcmZhY2UuXylcblxuXHRcdHJldHVyblxuXG5cblxuXG5cbiIsImlzSXRlcmFibGUgPSBzdWJqZWN0IGlzbnQgd2luZG93IGFuZCBjaGVja0lmLmlzSXRlcmFibGUoc3ViamVjdCkgYW5kIG5vdCBzdWJqZWN0Lm5vZGVUeXBlXG5zYW1wbGVJdGVtID0gaWYgaXNJdGVyYWJsZSB0aGVuIHN1YmplY3RbMF0gZWxzZSBzdWJqZWN0XG5cbmlmIG5vdCBzYW1wbGVJdGVtXG5cdHRocm93RXJyb3IoJ2VtcHR5TGlzdCcpIGlmIGlzSXRlcmFibGUgYW5kIGNoZWNrSWYuaXNFbENvbGxlY3Rpb24oc3ViamVjdClcblxuZWxzZSBpZiBAaXNEb20gPSBjaGVja0lmLmlzRG9tKHNhbXBsZUl0ZW0pXG5cblx0aWYgQHByb3BlcnR5IGlzICdjaGVja2VkJ1xuXHRcdGlzRG9tUmFkaW8gPSBzYW1wbGVJdGVtIGFuZCBjaGVja0lmLmlzRG9tUmFkaW8oc2FtcGxlSXRlbSlcblx0XHRpc0RvbUNoZWNrYm94ID0gbm90IGlzRG9tUmFkaW8gYW5kIHNhbXBsZUl0ZW0gYW5kIGNoZWNrSWYuaXNEb21DaGVja2JveChzYW1wbGVJdGVtKVxuXHRcblx0ZWxzZSBpZiBAcHJvcGVydHkgaXMgJ3ZhbHVlJ1xuXHRcdEBpc0RvbUlucHV0ID0gY2hlY2tJZi5pc0RvbUlucHV0KHNhbXBsZUl0ZW0pXG5cdFxuXG5cdGlmIGlzSXRlcmFibGUgYW5kIG5vdCB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ211bHRpJylcblx0XHRpZiBzdWJqZWN0Lmxlbmd0aCBpcyAxXG5cdFx0XHRzdWJqZWN0ID0gc3ViamVjdFswXVxuXG5cdFx0ZWxzZVxuXHRcdFx0aWYgKGlzRG9tUmFkaW8gb3IgaXNEb21DaGVja2JveCkgYW5kIG5vdCBjaGVja0lmLmRvbUVsc0FyZVNhbWUoc3ViamVjdClcblx0XHRcdFx0cmV0dXJuIHRocm93V2FybmluZygnbWl4ZWRFbExpc3QnLDMpXHRcdFx0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIGlzRG9tUmFkaW8gb3IgaXNEb21DaGVja2JveFxuXHRcdFx0XHRcdEBpc011bHRpQ2hvaWNlID0gdHJ1ZVxuXHRcdFx0XHRcdHN1YmplY3QgPSBbXS5zbGljZS5jYWxsKHN1YmplY3QpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRzdWJqZWN0ID0gc3ViamVjdFswXVxuXHRcdFx0XHRcdHRocm93V2FybmluZygnb25seU9uZURPTUVsZW1lbnQnLDMpXG5cblxuXG5cbiIsIkBldmVudE1ldGhvZHMgPSBsaXN0ZW46QG9wdGlvbnNQYXNzZWQubGlzdGVuTWV0aG9kLCByZW1vdmU6QG9wdGlvbnNQYXNzZWQucmVtb3ZlTWV0aG9kLCBlbWl0OkBvcHRpb25zUGFzc2VkLmVtaXRNZXRob2RcblxuXG5cbmlmIG5vdCBzdWJqZWN0W0BldmVudE1ldGhvZHMubGlzdGVuXVxuXHRAZXZlbnRNZXRob2RzLmxpc3RlbiA9IGlmIGNoZWNrSWYuaXNEb21Ob2RlKHN1YmplY3QpIHRoZW4gJ2FkZEV2ZW50TGlzdGVuZXInIGVsc2UgJ29uJ1xuXG5pZiBub3Qgc3ViamVjdFtAZXZlbnRNZXRob2RzLnJlbW92ZV1cblx0QGV2ZW50TWV0aG9kcy5yZW1vdmUgPSBpZiBjaGVja0lmLmlzRG9tTm9kZShzdWJqZWN0KSB0aGVuICdyZW1vdmVFdmVudExpc3RlbmVyJyBlbHNlICdyZW1vdmVMaXN0ZW5lcidcblxuaWYgbm90IHN1YmplY3RbQGV2ZW50TWV0aG9kcy5lbWl0XVxuXHRAZXZlbnRNZXRob2RzLmVtaXQgPSBpZiBjaGVja0lmLmlzRG9tTm9kZShzdWJqZWN0KSB0aGVuICdkaXNwYXRjaEV2ZW50JyBlbHNlICdlbWl0JyIsIkJpbmRpbmdJbnRlcmZhY2U6OiA9IE9iamVjdC5jcmVhdGUgQmluZGluZ0ludGVyZmFjZVByaXZhdGUsXG5cdG9mOlx0XHRcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX29mIGlmIG5vdCBAc3RhZ2VcdFx0XHQjPT09IGlmIHN0YWdlIGlzIDBcblx0c2V0Olx0XHRcdFx0Z2V0OiAoKS0+IE1FVEhPRF9zZXQgaWYgQHN0YWdlXHRcdFx0XHQjPT09IGlmIHN0YWdlIGlzIDEgb3IgMlxuXHRjaGFpblRvOlx0XHRcdGdldDogKCktPiBNRVRIT0RfY2hhaW5UbyBpZiBAc3RhZ2UgaXMgMlxuXHR0cmFuc2Zvcm1TZWxmOlx0XHRnZXQ6ICgpLT4gTUVUSE9EX3RyYW5zZm9ybVNlbGYgaWYgQHN0YWdlIGlzIDFcblx0dHJhbnNmb3JtOlx0XHRcdGdldDogKCktPiBNRVRIT0RfdHJhbnNmb3JtIGlmIEBzdGFnZSBpcyAyXG5cdHRyYW5zZm9ybUFsbDpcdFx0Z2V0OiAoKS0+IE1FVEhPRF90cmFuc2Zvcm1BbGwgaWYgQHN0YWdlIGlzIDJcblx0Y29uZGl0aW9uOlx0XHRcdGdldDogKCktPiBNRVRIT0RfY29uZGl0aW9uIGlmIEBzdGFnZSBpcyAyXG5cdGNvbmRpdGlvbkFsbDpcdFx0Z2V0OiAoKS0+IE1FVEhPRF9jb25kaXRpb25BbGwgaWYgQHN0YWdlIGlzIDJcblx0Ym90aFdheXM6XHRcdFx0Z2V0OiAoKS0+IE1FVEhPRF9ib3RoV2F5cyBpZiBAc3RhZ2UgaXMgMlxuXHR1bkJpbmQ6XHRcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX3VuQmluZCBpZiBAc3RhZ2UgaXMgMlxuXHRwb2xsRXZlcnk6XHRcdFx0Z2V0OiAoKS0+IE1FVEhPRF9wb2xsRXZlcnkgaWYgQHN0YWdlICM9PT0gaWYgc3RhZ2UgaXMgMSBvciAyXG5cdHN0b3BQb2xsaW5nOlx0XHRnZXQ6ICgpLT4gTUVUSE9EX3N0b3BQb2xsaW5nIGlmIEBzdGFnZSAjPT09IGlmIHN0YWdlIGlzIDEgb3IgMlxuXHRzZXRPcHRpb246XHRcdFx0Z2V0OiAoKS0+IE1FVEhPRF9zZXRPcHRpb24gaWYgQHN0YWdlIGlzIDJcblx0ZGlzYWxsb3dGcm9tOlx0XHRnZXQ6ICgpLT4gaWYgQHN0YWdlIGlzIDIgYW5kICh0aGlzSW50ZXJmYWNlPUApXG5cdFx0XHRcdFx0XHRcdGdlblByb3hpZWRJbnRlcmZhY2UgZmFsc2UsIChkaXNhbGxvd0ludGVyZmFjZSktPlxuXHRcdFx0XHRcdFx0XHRcdHN1YkludGVyZmFjZSA9IHRoaXNJbnRlcmZhY2Uuc3Vic1t0aGlzSW50ZXJmYWNlLnN1YnMubGVuZ3RoLTFdXG5cdFx0XHRcdFx0XHRcdFx0dGhpc0ludGVyZmFjZS5fLmFkZERpc2FsbG93UnVsZShzdWJJbnRlcmZhY2UuXywgZGlzYWxsb3dJbnRlcmZhY2UuXylcblxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzSW50ZXJmYWNlXG5cdFxuXHR1cGRhdGVPbjpcdFx0XHRnZXQ6ICgpLT4gaWYgQHN0YWdlIGFuZCAodGhpc0ludGVyZmFjZT1AKSAjPT09IGlmIHN0YWdlIGlzIDEgb3IgMlxuXHRcdFx0XHRcdFx0XHRnZW5Qcm94aWVkSW50ZXJmYWNlIGZhbHNlLCAoc3ViSW50ZXJmYWNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0aWYgc3ViSW50ZXJmYWNlLl8gaXNudCB0aGlzSW50ZXJmYWNlLl9cblx0XHRcdFx0XHRcdFx0XHRcdHRoaXNJbnRlcmZhY2UuXy5wdWJzTWFwW3N1YkludGVyZmFjZS5fLklEXSA9IHN1YkludGVyZmFjZS5fXG5cdFx0XHRcdFx0XHRcdFx0XHRzdWJJbnRlcmZhY2UuXy5hZGRTdWIgZ2VuU2VsZlVwZGF0ZXIodGhpc0ludGVyZmFjZS5fLCB0cnVlKSwgc3ViSW50ZXJmYWNlLm9wdGlvbnMsIGZhbHNlLCB0cnVlXG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXNJbnRlcmZhY2Vcblx0XG5cblx0cmVtb3ZlVXBkYXRlcjpcdFx0Z2V0OiAoKS0+IGlmIEBzdGFnZSBhbmQgKHRoaXNJbnRlcmZhY2U9QCkgYW5kIChzZWxmVXBkYXRlcj1AXy5zZWxmVXBkYXRlcikgIz09PSBpZiBzdGFnZSBpcyAxIG9yIDJcblx0XHRcdFx0XHRcdFx0Z2VuUHJveGllZEludGVyZmFjZSBmYWxzZSwgKHN1YkludGVyZmFjZSktPlxuXHRcdFx0XHRcdFx0XHRcdGlmIHN1YkludGVyZmFjZS5fLnN1YnNNZXRhW3NlbGZVcGRhdGVyLklEXVxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIHRoaXNJbnRlcmZhY2UuXy5wdWJzTWFwW3N1YkludGVyZmFjZS5fLklEXVxuXHRcdFx0XHRcdFx0XHRcdFx0c3ViSW50ZXJmYWNlLl8ucmVtb3ZlU3ViKHNlbGZVcGRhdGVyKVxuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuXG5cblxuXHR0bzpcdFx0XHRcdFx0Z2V0OiAoKS0+IGlmIEBzdGFnZSBpcyAxIGFuZCAodGhpc0ludGVyZmFjZT1AKVxuXHRcdFx0XHRcdFx0XHRnZW5Qcm94aWVkSW50ZXJmYWNlIHRydWUsIChzdWJJbnRlcmZhY2UpLT5cblx0XHRcdFx0XHRcdFx0XHRpZiBzdWJJbnRlcmZhY2UuXyBpc250IHRoaXNJbnRlcmZhY2UuX1xuXHRcdFx0XHRcdFx0XHRcdFx0c3ViSW50ZXJmYWNlLmFkZFRvUHVibGlzaGVyKHRoaXNJbnRlcmZhY2UpXG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXNJbnRlcmZhY2Vcblx0XG5cblx0YW5kOlx0XHRcdFx0Z2V0OiAoKS0+XG5cdFx0XHRcdFx0XHRcdGNsb25lSW50ZXJmYWNlID0gQHNlbGZDbG9uZSgpXG5cdFx0XHRcdFx0XHRcdGlmIEBzdGFnZSBpcyAyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGNsb25lSW50ZXJmYWNlXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBAc3RhZ2UgaXMgMVxuXHRcdFx0XHRcdFx0XHRcdGlmIG5vdCBjbG9uZUludGVyZmFjZS5fLmlzTXVsdGlcblx0XHRcdFx0XHRcdFx0XHRcdGNsb25lQmluZGluZyA9IGNsb25lSW50ZXJmYWNlLl9cblx0XHRcdFx0XHRcdFx0XHRcdGNsb25lSW50ZXJmYWNlLl8gPSBjbG9uZUludGVyZmFjZS5fID0gbmV3IEdyb3VwQmluZGluZyhjbG9uZUludGVyZmFjZSlcblx0XHRcdFx0XHRcdFx0XHRcdGNsb25lSW50ZXJmYWNlLl8uYWRkQmluZGluZyhjbG9uZUJpbmRpbmcpXG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGdlblByb3hpZWRJbnRlcmZhY2UgZmFsc2UsIChzaWJsaW5nSW50ZXJmYWNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRjbG9uZUludGVyZmFjZS5fLmFkZEJpbmRpbmcoc2libGluZ0ludGVyZmFjZS5fKVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGNsb25lSW50ZXJmYWNlXG5cdFxuXG5cdG9uY2U6XHRcdFx0XHRnZXQ6ICgpLT4gaWYgQHN0YWdlIGlzIDFcblx0XHRcdFx0XHRcdFx0aW50ZXJmYWNlVG9SZXR1cm4gPSBAc2VsZkNsb25lKClcblx0XHRcdFx0XHRcdFx0aW50ZXJmYWNlVG9SZXR1cm4udXBkYXRlT25jZSA9IHRydWVcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGludGVyZmFjZVRvUmV0dXJuXG5cblx0IyA9PT09IEFsaWFzZXMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHVwZGF0ZTpcdFx0XHRcdGdldDogKCktPiBAc2V0XG5cdHR3b1dheTpcdFx0XHRcdGdldDogKCktPiBAYm90aFdheXNcblx0cGlwZTpcdFx0XHRcdGdldDogKCktPiBAY2hhaW5Ub1xuXG5cblxuXG5NRVRIT0Rfb2YgPSAob2JqZWN0KS0+XG5cdHRocm93RXJyb3JCYWRBcmcob2JqZWN0KSB1bmxlc3MgY2hlY2tJZi5pc09iamVjdChvYmplY3QpIG9yIGNoZWNrSWYuaXNGdW5jdGlvbihvYmplY3QpXG5cdFxuXHRpZiBjaGVja0lmLmlzQmluZGluZ0ludGVyZmFjZShvYmplY3QpXG5cdFx0b2JqZWN0ID0gb2JqZWN0Lm9iamVjdFxuXG5cdEBzdGFnZSA9IDFcblx0cmV0dXJuIEBzZXRPYmplY3Qob2JqZWN0KVxuXG5cblxuXG5cbk1FVEhPRF9jaGFpblRvID0gKHN1YmplY3QsIHNwZWNpZmljT3B0aW9ucywgc2F2ZU9wdGlvbnMpLT5cblx0cmV0dXJuIFNpbXBseUJpbmQoQHN1YnNbQHN1YnMubGVuZ3RoLTFdKS50byhzdWJqZWN0LCBzcGVjaWZpY09wdGlvbnMsIHNhdmVPcHRpb25zKVxuXG5cblxuXG5cbk1FVEhPRF9zZXQgPSAobmV3VmFsdWUpLT5cblx0QF8uc2V0VmFsdWUobmV3VmFsdWUpXG5cdHJldHVybiBAXG5cblxuXG5cblxuXG5cblxuTUVUSE9EX3RyYW5zZm9ybVNlbGYgPSAodHJhbnNmb3JtRm4pLT4gIyBBcHBsaWVkIG9ubHkgdG8gdGhlIGxhc3Qgc3ViXG5cdGlmIG5vdCBjaGVja0lmLmlzRnVuY3Rpb24odHJhbnNmb3JtRm4pXG5cdFx0dGhyb3dXYXJuaW5nKCdmbk9ubHknLDEpXG5cdGVsc2Vcblx0XHRAXy5zZXRTZWxmVHJhbnNmb3JtKHRyYW5zZm9ybUZuLCBAb3B0aW9ucy51cGRhdGVPbkJpbmQpXG5cdFx0XG5cdHJldHVybiBAXG5cblxuTUVUSE9EX3RyYW5zZm9ybSA9ICh0cmFuc2Zvcm1GbiktPiAjIEFwcGxpZWQgb25seSB0byB0aGUgbGFzdCBzdWJcblx0QF8uYWRkTW9kaWZpZXJGbigndHJhbnNmb3JtRm4nLCBAc3Vicy5zbGljZSgtMSksIHRyYW5zZm9ybUZuLCBAb3B0aW9ucy51cGRhdGVPbkJpbmQpXG5cdHJldHVybiBAXG5cblxuTUVUSE9EX3RyYW5zZm9ybUFsbCA9ICh0cmFuc2Zvcm1GbiktPiAjIEFwcGxpZWQgdG8gZW50cmllIHN1YnMgc2V0XHRcdFxuXHRAXy5hZGRNb2RpZmllckZuKCd0cmFuc2Zvcm1GbicsIEBzdWJzLCB0cmFuc2Zvcm1GbiwgQG9wdGlvbnMudXBkYXRlT25CaW5kKVxuXHRyZXR1cm4gQFxuXG5cblxuXG5cblxuTUVUSE9EX2NvbmRpdGlvbiA9IChjb25kaXRpb25GbiktPiAjIEFwcGxpZWQgb25seSB0byB0aGUgbGFzdCBzdWJcblx0QF8uYWRkTW9kaWZpZXJGbignY29uZGl0aW9uRm4nLCBAc3Vicy5zbGljZSgtMSksIGNvbmRpdGlvbkZuKVxuXHRyZXR1cm4gQFxuXG5cbk1FVEhPRF9jb25kaXRpb25BbGwgPSAoY29uZGl0aW9uRm4pLT4gIyBBcHBsaWVkIHRvIGVudHJpZSBzdWJzIHNldFxuXHRAXy5hZGRNb2RpZmllckZuKCdjb25kaXRpb25GbicsIEBzdWJzLCBjb25kaXRpb25Gbilcblx0cmV0dXJuIEBcblxuXG5cblxuXG5cblxuTUVUSE9EX2JvdGhXYXlzID0gKGFsdFRyYW5zZm9ybSktPiAjIEFwcGxpZWQgb25seSB0byB0aGUgbGFzdCBzdWJcblx0c3ViID0gQHN1YnNbQHN1YnMubGVuZ3RoLTFdICMgTGFzdCBQcm94aWVkXG5cdHN1YkJpbmRpbmcgPSBzdWIuX1xuXHRiaW5kaW5ncyA9IGlmIEBfLmlzTXVsdGkgdGhlbiBAXy5iaW5kaW5ncyBlbHNlIFtAX11cblxuXHRzdWJCaW5kaW5nLmFkZFN1YihAXywgc3ViLm9wdGlvbnMpXG5cdFxuXHRmb3IgYmluZGluZyBpbiBiaW5kaW5nc1xuXHRcdG9yaWdpblRyYW5zZm9ybSA9IGJpbmRpbmcuc3Vic01ldGFbc3ViQmluZGluZy5JRF0udHJhbnNmb3JtRm5cblx0XHRvcmlnaW5Db25kaXRpb24gPSBiaW5kaW5nLnN1YnNNZXRhW3N1YkJpbmRpbmcuSURdLmNvbmRpdGlvbkZuXG5cblx0XHRpZiBvcmlnaW5UcmFuc2Zvcm0gb3IgYWx0VHJhbnNmb3JtXG5cdFx0XHR0cmFuc2Zvcm1Ub1VzZSA9IGlmIGNoZWNrSWYuaXNGdW5jdGlvbihhbHRUcmFuc2Zvcm0pIHRoZW4gYWx0VHJhbnNmb3JtIGVsc2Ugb3JpZ2luVHJhbnNmb3JtXG5cdFx0XHRzdWJCaW5kaW5nLnN1YnNNZXRhW0BfLklEXS50cmFuc2Zvcm1GbiA9IHRyYW5zZm9ybVRvVXNlIGlmIHRyYW5zZm9ybVRvVXNlIGFuZCBhbHRUcmFuc2Zvcm0gaXNudCBmYWxzZVxuXG5cdFx0aWYgb3JpZ2luQ29uZGl0aW9uXG5cdFx0XHRzdWJCaW5kaW5nLnN1YnNNZXRhW0BfLklEXS5jb25kaXRpb25GbiA9IG9yaWdpbkNvbmRpdGlvblxuXG5cdHJldHVybiBAXG5cblxuXG5NRVRIT0RfdW5CaW5kID0gKGJvdGhXYXlzKS0+ICMgQXBwbGllZCB0byBhbGwgc3Vic1xuXHRAXy5yZW1vdmVTdWIoc3ViLl8sIGJvdGhXYXlzKSBmb3Igc3ViIGluIEBzdWJzXG5cdHJldHVybiBAXG5cblxuXG5cblxuTUVUSE9EX3BvbGxFdmVyeSA9ICh0aW1lKS0+XG5cdEBfLmFkZFBvbGxJbnRlcnZhbCh0aW1lKVxuXHRyZXR1cm4gQFxuXG5cblxuTUVUSE9EX3N0b3BQb2xsaW5nID0gKCktPlxuXHRAXy5yZW1vdmVQb2xsSW50ZXJ2YWwoKVxuXHRyZXR1cm4gQFxuXG5cblxuTUVUSE9EX3NldE9wdGlvbiA9IChvcHRpb25OYW1lLCBuZXdWYWx1ZSktPlxuXHRAXy5zdWJzTWV0YVtAc3Vic1tAc3Vicy5sZW5ndGgtMV0uXy5JRF0ub3B0c1tvcHRpb25OYW1lXSA9IG5ld1ZhbHVlXHRcblx0cmV0dXJuIEBcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIkdyb3VwQmluZGluZyA9IChiaW5kaW5nSW50ZXJmYWNlLCBvYmplY3RzLCBvYmplY3RUeXBlKS0+XG5cdGJpbmRpbmdJbnRlcmZhY2Uuc2VsZWN0b3IgPSBiaW5kaW5nSW50ZXJmYWNlLnNlbGVjdG9yLnNsaWNlKDYpICMgVGFrZSBvdXQgdGhlICdtdWx0aTonXG5cdGV4dGVuZFN0YXRlKEAsIEBpbnRlcmZhY2UgPSBiaW5kaW5nSW50ZXJmYWNlKVxuXHRAaXNNdWx0aSA9IHRydWVcblx0QGJpbmRpbmdzID0gYmluZGluZ3MgPSBbXVxuXG5cdGlmIG9iamVjdHNcblx0XHRAYWRkQmluZGluZyhvYmplY3QsIG9iamVjdFR5cGUpIGZvciBvYmplY3QgaW4gb2JqZWN0c1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIEAsXG5cdFx0J3R5cGUnOlx0XHRcdFx0Z2V0OiAoKS0+IGJpbmRpbmdzLm1hcCAoYmluZGluZyktPiBiaW5kaW5nLnR5cGVcblx0XHQndmFsdWUnOiBcdFx0XHRnZXQ6ICgpLT4gYmluZGluZ3MubWFwIChiaW5kaW5nKS0+IGJpbmRpbmcudmFsdWVcblxuXG5cblxuXG5cbnByb3RvID0gR3JvdXBCaW5kaW5nOjogPSBPYmplY3QuY3JlYXRlKEJpbmRpbmdJbnRlcmZhY2VQcml2YXRlKVxuXG5PYmplY3Qua2V5cyhCaW5kaW5nOjopLmZvckVhY2ggKG1ldGhvZE5hbWUpLT5cdFxuXHRwcm90b1ttZXRob2ROYW1lXSA9IChhLGIsYyxkKS0+ICMgRm91ciBhcmd1bWVudHMgaXMgdGhlIG1vc3QgZXZlciBwYXNzZWQgdG8gYW55IG1ldGhvZCBmcm9tIEJpbmRpbmdJbnRlcmZhY2UgbWV0aG9kc1xuXHRcdGZvciBiaW5kaW5nIGluIEBiaW5kaW5nc1xuXHRcdFx0YiA9IGJpbmRpbmcgaWYgbWV0aG9kTmFtZSBpcyAndXBkYXRlU3ViJ1xuXHRcdFx0YmluZGluZ1ttZXRob2ROYW1lXShhLGIsYyxkKVxuXHRcdFxuXHRcdHJldHVyblxuXG5cbnByb3RvLmFkZEJpbmRpbmcgPSAob2JqZWN0LCBvYmplY3RUeXBlKS0+XG5cdEBiaW5kaW5ncy5wdXNoIGlmIG5vdCBvYmplY3RUeXBlIHRoZW4gb2JqZWN0IGVsc2UgQGNyZWF0ZUJpbmRpbmcob2JqZWN0LCBvYmplY3RUeXBlLCBAaW50ZXJmYWNlKVxuXHRyZXR1cm4iLCJtb2R1bGUuZXhwb3J0cyA9IFxuXHRhbnk6IC8uL1xuXHR3aGl0ZVNwYWNlOiAvXFxzKy9cblx0bnVtZXJpYzogL15cXGQkL1xuXHRsZXR0ZXI6IC9eW2EtekEtWl0kL1xuXHQjIGFscGhhbnVtZXJpYzogL1tcXGRhLXpBLVpdL1xuXHR3aWRlbnVtZXJpYzogL15bMC05XFwhI1xcJFxcJVxcKlxcK1xcL1xcPVxcP1xcXlxce1xcfFxcfVxcKFxcKVxcflxcLVxcLl0kL1xuXHRhbHBoYW51bWVyaWM6IC9eWzAtOUEtWmEtelxcISNcXCRcXCVcXCZcXCdcXCpcXCtcXC9cXD1cXD9cXF5cXF9cXGBcXHtcXHxcXH1cXChcXClcXH5cXC1cXCBdJC9cblx0ZW1haWw6IC9eW1xcd1xcLVxcLl0rQFtcXHdcXC1cXC5dK1xcLltBLVphLXpdezIsMTB9JC8iLCJpbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCB7SU1QT1JUQU5UfSBmcm9tICcuL2NvbnN0YW50cydcblxucXVpY2tjc3MgPSAodGFyZ2V0RWwsIHByb3BlcnR5LCB2YWx1ZSwgaW1wb3J0YW50KS0+XG5cdHN3aXRjaFxuXHRcdHdoZW4gaGVscGVycy5pc0l0ZXJhYmxlKHRhcmdldEVsKVxuXHRcdFx0cXVpY2tjc3Moc3ViRWwsIHByb3BlcnR5LCB2YWx1ZSkgZm9yIHN1YkVsIGluIHRhcmdldEVsXG5cdFxuXHRcdHdoZW4gdHlwZW9mIHByb3BlcnR5IGlzICdvYmplY3QnICMgUGFzc2VkIGEgc3R5bGUgbWFwXG5cdFx0XHRxdWlja2Nzcyh0YXJnZXRFbCwgc3ViUHJvcGVydHksIHN1YlZhbHVlKSBmb3Igc3ViUHJvcGVydHksc3ViVmFsdWUgb2YgcHJvcGVydHlcblx0XG5cdFx0ZWxzZVxuXHRcdFx0cHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5KHByb3BlcnR5KVxuXHRcdFx0aWYgdHlwZW9mIHZhbHVlIGlzICd1bmRlZmluZWQnXG5cdFx0XHRcdGNvbXB1dGVkU3R5bGUgPSB0YXJnZXRFbC5fY29tcHV0ZWRTdHlsZSB8fD0gZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXRFbClcblx0XHRcdFx0cmV0dXJuIGNvbXB1dGVkU3R5bGVbcHJvcGVydHldXG5cdFx0XHRcblx0XHRcdGVsc2UgaWYgcHJvcGVydHlcblx0XHRcdFx0dGFyZ2V0RWwuc3R5bGUuc2V0UHJvcGVydHkocHJvcGVydHksIGhlbHBlcnMubm9ybWFsaXplVmFsdWUocHJvcGVydHksIHZhbHVlKSwgSU1QT1JUQU5UIGlmIGltcG9ydGFudClcblxuXHRyZXR1cm5cblxuXG5xdWlja2Nzcy5hbmltYXRpb24gPSAobmFtZSwgZnJhbWVzKS0+IGlmIG5hbWUgYW5kIHR5cGVvZiBuYW1lIGlzICdzdHJpbmcnIGFuZCBmcmFtZXMgYW5kIHR5cGVvZiBmcmFtZXMgaXMgJ29iamVjdCdcblx0cHJlZml4ID0gaGVscGVycy5nZXRQcmVmaXgoJ2FuaW1hdGlvbicpXG5cdGdlbmVyYXRlZCA9ICcnXG5cdFxuXHRmb3IgZnJhbWUscnVsZXMgb2YgZnJhbWVzXG5cdFx0Z2VuZXJhdGVkICs9IFwiI3tmcmFtZX0geyN7aGVscGVycy5ydWxlVG9TdHJpbmcocnVsZXMpfX1cIlxuXG5cdGdlbmVyYXRlZCA9IFwiQCN7cHJlZml4fWtleWZyYW1lcyAje25hbWV9IHsje2dlbmVyYXRlZH19XCJcblx0aGVscGVycy5pbmxpbmVTdHlsZShnZW5lcmF0ZWQsIHRydWUsIDApXG5cblxucXVpY2tjc3MucmVnaXN0ZXIgPSAocnVsZSwgbGV2ZWwsIGltcG9ydGFudCktPiBpZiBydWxlIGFuZCB0eXBlb2YgcnVsZSBpcyAnb2JqZWN0J1xuXHRsZXZlbCB8fD0gMFxuXHRydWxlID0gaGVscGVycy5ydWxlVG9TdHJpbmcocnVsZSwgaW1wb3J0YW50KVxuXG5cdHVubGVzcyBjbGFzc05hbWUgPSBoZWxwZXJzLmlubGluZVN0eWxlQ29uZmlnW2xldmVsXT9bcnVsZV1cblx0XHRjbGFzc05hbWUgPSBoZWxwZXJzLmhhc2gocnVsZSlcblx0XHRzdHlsZSA9IFwiLiN7Y2xhc3NOYW1lfSB7I3tydWxlfX1cIlxuXHRcdGhlbHBlcnMuaW5saW5lU3R5bGUoc3R5bGUsIGNsYXNzTmFtZSwgbGV2ZWwpXG5cblx0cmV0dXJuIGNsYXNzTmFtZVxuXG5cbnF1aWNrY3NzLmNsZWFyUmVnaXN0ZXJlZCA9IChsZXZlbCktPlxuXHRoZWxwZXJzLmNsZWFySW5saW5lU3R5bGUobGV2ZWwgb3IgMClcblxuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5xdWlja2Nzcy5VTlNFVCA9IHN3aXRjaFxuXHR3aGVuIGhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZCgnZGlzcGxheScsJ3Vuc2V0JykgdGhlbiAndW5zZXQnXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywnaW5pdGlhbCcpIHRoZW4gJ2luaXRpYWwnXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywnaW5oZXJpdCcpIHRoZW4gJ2luaGVyaXQnXG5cbnF1aWNrY3NzLnN1cHBvcnRzID0gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkXG5xdWlja2Nzcy5zdXBwb3J0c1Byb3BlcnR5ID0gaGVscGVycy5pc1Byb3BTdXBwb3J0ZWRcbnF1aWNrY3NzLm5vcm1hbGl6ZVByb3BlcnR5ID0gaGVscGVycy5ub3JtYWxpemVQcm9wZXJ0eVxucXVpY2tjc3Mubm9ybWFsaXplVmFsdWUgPSBoZWxwZXJzLm5vcm1hbGl6ZVZhbHVlXG5xdWlja2Nzcy52ZXJzaW9uID0gaW1wb3J0ICcuLi9wYWNrYWdlLmpzb24gJCB2ZXJzaW9uJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gcXVpY2tjc3MiLCJ7XG4gIFwiX2Zyb21cIjogXCJxdWlja2Nzc0BsYXRlc3RcIixcbiAgXCJfaWRcIjogXCJxdWlja2Nzc0AxLjQuMVwiLFxuICBcIl9pbkJ1bmRsZVwiOiBmYWxzZSxcbiAgXCJfaW50ZWdyaXR5XCI6IFwic2hhNTEyLTVQUVVUUEVpMlFsTjBqK1J2VVJCeS9MY2NBcXc0ang5a0NQRWgyUHc4V0t3enk5QUxVRlNLS0VQck91Yk9tbDRFY1BKYXpPN0d5Yis1cEVPTnFKd01nPT1cIixcbiAgXCJfbG9jYXRpb25cIjogXCIvcXVpY2tjc3NcIixcbiAgXCJfcGhhbnRvbUNoaWxkcmVuXCI6IHt9LFxuICBcIl9yZXF1ZXN0ZWRcIjoge1xuICAgIFwidHlwZVwiOiBcInRhZ1wiLFxuICAgIFwicmVnaXN0cnlcIjogdHJ1ZSxcbiAgICBcInJhd1wiOiBcInF1aWNrY3NzQGxhdGVzdFwiLFxuICAgIFwibmFtZVwiOiBcInF1aWNrY3NzXCIsXG4gICAgXCJlc2NhcGVkTmFtZVwiOiBcInF1aWNrY3NzXCIsXG4gICAgXCJyYXdTcGVjXCI6IFwibGF0ZXN0XCIsXG4gICAgXCJzYXZlU3BlY1wiOiBudWxsLFxuICAgIFwiZmV0Y2hTcGVjXCI6IFwibGF0ZXN0XCJcbiAgfSxcbiAgXCJfcmVxdWlyZWRCeVwiOiBbXG4gICAgXCIjVVNFUlwiLFxuICAgIFwiL1wiLFxuICAgIFwiL3F1aWNrZG9tXCJcbiAgXSxcbiAgXCJfcmVzb2x2ZWRcIjogXCJodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy9xdWlja2Nzcy8tL3F1aWNrY3NzLTEuNC4xLnRnelwiLFxuICBcIl9zaGFzdW1cIjogXCI5YjIzMTkwNGFmNWE2OGY5MzZlZTExNWU1NDViMThmM2JkMzA4NzgwXCIsXG4gIFwiX3NwZWNcIjogXCJxdWlja2Nzc0BsYXRlc3RcIixcbiAgXCJfd2hlcmVcIjogXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJkYW5pZWxrYWxlblwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9xdWlja2Nzcy5kZWJ1Zy5qc1wiLFxuICAgIFwiLi9kaXN0L3F1aWNrY3NzLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tjc3MvaXNzdWVzXCJcbiAgfSxcbiAgXCJidW5kbGVEZXBlbmRlbmNpZXNcIjogZmFsc2UsXG4gIFwiZGVwcmVjYXRlZFwiOiBmYWxzZSxcbiAgXCJkZXNjcmlwdGlvblwiOiBcIuKaoe+4jy1mYXN0IHRpbnkgQ1NTIG1hbmFnZW1lbnQgdG9vbCBzcHJpbmtsZWQgd2l0aCBBUEkgc3VnYXJcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGJhYmVsL2NvcmVcIjogXCJeNy4xLjZcIixcbiAgICBcIkBiYWJlbC9wcmVzZXQtZW52XCI6IFwiXjcuMS42XCIsXG4gICAgXCJiYWJlbGlmeVwiOiBcIl4xMC4wLjBcIixcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjaGFsa1wiOiBcIl4yLjAuMVwiLFxuICAgIFwiY29mZmVlLXNjcmlwdFwiOiBcIl4xLjEyLjZcIixcbiAgICBcImV4ZWNhXCI6IFwiXjAuNy4wXCIsXG4gICAgXCJmcy1qZXRwYWNrXCI6IFwiXjAuMTMuM1wiLFxuICAgIFwicHJvbWlzZS1icmVha1wiOiBcIl4wLjEuMVwiLFxuICAgIFwic2VtdmVyXCI6IFwiXjUuMy4wXCIsXG4gICAgXCJzaW1wbHlpbXBvcnRcIjogXCJeNC4wLjlcIixcbiAgICBcInNpbXBseXdhdGNoXCI6IFwiXjMuMC4wXCJcbiAgfSxcbiAgXCJkaXJlY3Rvcmllc1wiOiB7XG4gICAgXCJ0ZXN0XCI6IFwidGVzdFwiXG4gIH0sXG4gIFwiZmlsZXNcIjogW1xuICAgIFwiZGlzdFwiLFxuICAgIFwic3JjXCJcbiAgXSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2NzcyNyZWFkbWVcIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwibWFpblwiOiBcImRpc3QvcXVpY2tjc3MuanNcIixcbiAgXCJuYW1lXCI6IFwicXVpY2tjc3NcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tjc3MuZ2l0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLi8uY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwibnBtIHJ1biB0ZXN0OnRyYXZpc1wiLFxuICAgIFwidGVzdFwiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6YnJvd3NlclwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBFbGVjdHJvbiAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmNocm9tZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgQ2hyb21lIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6ZmlyZWZveFwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBGaXJlZm94IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6a2FybWFcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmxvY2FsXCI6IFwib3BlbiB0ZXN0L3Rlc3RydW5uZXIuaHRtbFwiLFxuICAgIFwidGVzdDptaW5pZmllZFwiOiBcIm1pbmlmaWVkPTEgbnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnRyYXZpc1wiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zICYmIG5wbSBydW4gdGVzdDptaW5pZmllZCAtc1wiLFxuICAgIFwid2F0Y2hcIjogXCJjYWtlIC1kIHdhdGNoXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgW1xuICAgICAgICBcImJhYmVsaWZ5XCIsXG4gICAgICAgIHtcbiAgICAgICAgICBcInByZXNldHNcIjogW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBcIkBiYWJlbC9wcmVzZXQtZW52XCIsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm1vZHVsZXNcIjogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjQuMVwiXG59XG4iLCJhdmFpbFNldHMgPSBcblx0bmF0aXZlczogaW1wb3J0ICcuL25hdGl2ZXMnXG5cdGRvbTogaW1wb3J0ICcuL2RvbSdcblxuY2xhc3MgQ2hlY2tzXG5cdGNyZWF0ZTogKCktPlxuXHRcdGFyZ3MgPSBBcnJheTo6c2xpY2UuY2FsbChhcmd1bWVudHMpIGlmIGFyZ3VtZW50cy5sZW5ndGhcblx0XHRuZXcgQ2hlY2tzKGFyZ3MpXG5cdFxuXG5cdGNvbnN0cnVjdG9yOiAoc2V0cyktPlxuXHRcdHNldHMgPz0gWyduYXRpdmVzJ11cblx0XHRcblx0XHRmb3Igc2V0IGluIHNldHNcblx0XHRcdEBsb2FkKGF2YWlsU2V0c1tzZXRdKSBpZiBhdmFpbFNldHNbc2V0XVxuXG5cblx0bG9hZDogKHNldCktPlxuXHRcdHNldCA9IGF2YWlsU2V0c1tzZXRdIGlmIGF2YWlsU2V0cy5uYXRpdmVzLnN0cmluZyhzZXQpXG5cdFx0cmV0dXJuIGlmIG5vdCBhdmFpbFNldHMubmF0aXZlcy5vYmplY3RQbGFpbihzZXQpXG5cdFx0XG5cdFx0Zm9yIGtleSx2YWx1ZSBvZiBzZXRcblx0XHRcdEBba2V5XSA9IHZhbHVlXG5cdFx0XG5cdFx0cmV0dXJuXG5cdFxuXHRcbm1vZHVsZS5leHBvcnRzID0gQ2hlY2tzOjpjcmVhdGUoKSIsImlzQXJyYXkgPSAodGFyZ2V0KS0+XG5cdEFycmF5LmlzQXJyYXkodGFyZ2V0KVxuXG5pc09iamVjdCA9ICh0YXJnZXQpLT5cblx0dGFyZ2V0IGFuZCBPYmplY3Q6OnRvU3RyaW5nLmNhbGwodGFyZ2V0KSBpcyAnW29iamVjdCBPYmplY3RdJyBvciBpc0FycmF5KHRhcmdldClcblxuc2hvdWxkRGVlcEV4dGVuZCA9IChvcHRpb25zLCB0YXJnZXQsIHBhcmVudEtleSktPlxuXHRpZiBvcHRpb25zLmRlZXBcblx0XHRpZiBvcHRpb25zLm5vdERlZXAgdGhlbiBub3Qgb3B0aW9ucy5ub3REZWVwW3RhcmdldF0gZWxzZSB0cnVlXG5cblx0ZWxzZSBpZiBvcHRpb25zLmRlZXBPbmx5XG5cdFx0b3B0aW9ucy5kZWVwT25seVt0YXJnZXRdIG9yIHBhcmVudEtleSBhbmQgc2hvdWxkRGVlcEV4dGVuZChvcHRpb25zLCBwYXJlbnRLZXkpXG5cblx0IyBlbHNlIGZhbHNlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQgPSAob3B0aW9ucywgdGFyZ2V0LCBzb3VyY2VzLCBwYXJlbnRLZXkpLT5cblx0dGFyZ2V0ID0ge30gaWYgbm90IHRhcmdldCBvciB0eXBlb2YgdGFyZ2V0IGlzbnQgJ29iamVjdCcgYW5kIHR5cGVvZiB0YXJnZXQgaXNudCAnZnVuY3Rpb24nXG5cblx0Zm9yIHNvdXJjZSBpbiBzb3VyY2VzIHdoZW4gc291cmNlP1xuXHRcdGZvciBrZXkgb2Ygc291cmNlXG5cdFx0XHRzb3VyY2VWYWx1ZSA9IHNvdXJjZVtrZXldXG5cdFx0XHR0YXJnZXRWYWx1ZSA9IHRhcmdldFtrZXldXG5cdFx0XHRcblx0XHRcdGNvbnRpbnVlIGlmIHNvdXJjZVZhbHVlIGlzIHRhcmdldCBvclxuXHRcdFx0XHRcdFx0c291cmNlVmFsdWUgaXMgdW5kZWZpbmVkIG9yXG5cdFx0XHRcdFx0XHQoc291cmNlVmFsdWUgaXMgbnVsbCBhbmQgbm90IG9wdGlvbnMuYWxsb3dOdWxsIGFuZCBub3Qgb3B0aW9ucy5udWxsRGVsZXRlcykgb3Jcblx0XHRcdFx0XHRcdChvcHRpb25zLmtleXMgYW5kIG5vdCBvcHRpb25zLmtleXNba2V5XSkgb3Jcblx0XHRcdFx0XHRcdChvcHRpb25zLm5vdEtleXMgYW5kIG9wdGlvbnMubm90S2V5c1trZXldKSBvclxuXHRcdFx0XHRcdFx0KG9wdGlvbnMub3duIGFuZCBub3Qgc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIG9yXG5cdFx0XHRcdFx0XHQob3B0aW9ucy5nbG9iYWxGaWx0ZXIgYW5kIG5vdCBvcHRpb25zLmdsb2JhbEZpbHRlcihzb3VyY2VWYWx1ZSwga2V5LCBzb3VyY2UpKSBvclxuXHRcdFx0XHRcdFx0KG9wdGlvbnMuZmlsdGVycyBhbmQgb3B0aW9ucy5maWx0ZXJzW2tleV0gYW5kIG5vdCBvcHRpb25zLmZpbHRlcnNba2V5XShzb3VyY2VWYWx1ZSwga2V5LCBzb3VyY2UpKVxuXHRcdFx0XG5cdFx0XHRpZiBzb3VyY2VWYWx1ZSBpcyBudWxsIGFuZCBvcHRpb25zLm51bGxEZWxldGVzXG5cdFx0XHRcdGRlbGV0ZSB0YXJnZXRba2V5XVxuXHRcdFx0XHRjb250aW51ZVxuXHRcdFx0aWYgb3B0aW9ucy5nbG9iYWxUcmFuc2Zvcm1cblx0XHRcdFx0c291cmNlVmFsdWUgPSBvcHRpb25zLmdsb2JhbFRyYW5zZm9ybShzb3VyY2VWYWx1ZSwga2V5LCBzb3VyY2UpXG5cdFx0XHRpZiBvcHRpb25zLnRyYW5zZm9ybXMgYW5kIG9wdGlvbnMudHJhbnNmb3Jtc1trZXldXG5cdFx0XHRcdHNvdXJjZVZhbHVlID0gb3B0aW9ucy50cmFuc2Zvcm1zW2tleV0oc291cmNlVmFsdWUsIGtleSwgc291cmNlKVxuXHRcblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIG9wdGlvbnMuY29uY2F0IGFuZCBpc0FycmF5KHNvdXJjZVZhbHVlKSBhbmQgaXNBcnJheSh0YXJnZXRWYWx1ZSlcblx0XHRcdFx0XHR0YXJnZXRba2V5XSA9IHRhcmdldFZhbHVlLmNvbmNhdChzb3VyY2VWYWx1ZSlcblx0XHRcdFx0XG5cdFx0XHRcdHdoZW4gc2hvdWxkRGVlcEV4dGVuZChvcHRpb25zLCBrZXksIHBhcmVudEtleSkgYW5kIGlzT2JqZWN0KHNvdXJjZVZhbHVlKVxuXHRcdFx0XHRcdHN1YlRhcmdldCA9IGlmIGlzT2JqZWN0KHRhcmdldFZhbHVlKSB0aGVuIHRhcmdldFZhbHVlIGVsc2UgaWYgaXNBcnJheShzb3VyY2VWYWx1ZSkgdGhlbiBbXSBlbHNlIHt9XG5cdFx0XHRcdFx0dGFyZ2V0W2tleV0gPSBleHRlbmQob3B0aW9ucywgc3ViVGFyZ2V0LCBbc291cmNlVmFsdWVdLCBrZXkpXG5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHRhcmdldFtrZXldID0gc291cmNlVmFsdWVcblxuXG5cdHJldHVybiB0YXJnZXRcblxuXG5cblxuXG5cblxuIiwiIShmdW5jdGlvbih3aW4pIHtcblxuLyoqXG4gKiBGYXN0RG9tXG4gKlxuICogRWxpbWluYXRlcyBsYXlvdXQgdGhyYXNoaW5nXG4gKiBieSBiYXRjaGluZyBET00gcmVhZC93cml0ZVxuICogaW50ZXJhY3Rpb25zLlxuICpcbiAqIEBhdXRob3IgV2lsc29uIFBhZ2UgPHdpbHNvbnBhZ2VAbWUuY29tPlxuICogQGF1dGhvciBLb3JuZWwgTGVzaW5za2kgPGtvcm5lbC5sZXNpbnNraUBmdC5jb20+XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1pbmkgbG9nZ2VyXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbnZhciBkZWJ1ZyA9IDAgPyBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUsICdbZmFzdGRvbV0nKSA6IGZ1bmN0aW9uKCkge307XG5cbi8qKlxuICogTm9ybWFsaXplZCByQUZcbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cbnZhciByYWYgPSB3aW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLm1velJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgZnVuY3Rpb24oY2IpIHsgcmV0dXJuIHNldFRpbWVvdXQoY2IsIDE2KTsgfTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgYEZhc3REb21gLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBGYXN0RG9tKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYucmVhZHMgPSBbXTtcbiAgc2VsZi53cml0ZXMgPSBbXTtcbiAgc2VsZi5yYWYgPSByYWYuYmluZCh3aW4pOyAvLyB0ZXN0IGhvb2tcbiAgZGVidWcoJ2luaXRpYWxpemVkJywgc2VsZik7XG59XG5cbkZhc3REb20ucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogRmFzdERvbSxcblxuICAvKipcbiAgICogQWRkcyBhIGpvYiB0byB0aGUgcmVhZCBiYXRjaCBhbmRcbiAgICogc2NoZWR1bGVzIGEgbmV3IGZyYW1lIGlmIG5lZWQgYmUuXG4gICAqXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICAgKiBAcHVibGljXG4gICAqL1xuICBtZWFzdXJlOiBmdW5jdGlvbihmbiwgY3R4KSB7XG4gICAgZGVidWcoJ21lYXN1cmUnKTtcbiAgICB2YXIgdGFzayA9ICFjdHggPyBmbiA6IGZuLmJpbmQoY3R4KTtcbiAgICB0aGlzLnJlYWRzLnB1c2godGFzayk7XG4gICAgc2NoZWR1bGVGbHVzaCh0aGlzKTtcbiAgICByZXR1cm4gdGFzaztcbiAgfSxcblxuICAvKipcbiAgICogQWRkcyBhIGpvYiB0byB0aGVcbiAgICogd3JpdGUgYmF0Y2ggYW5kIHNjaGVkdWxlc1xuICAgKiBhIG5ldyBmcmFtZSBpZiBuZWVkIGJlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgbXV0YXRlOiBmdW5jdGlvbihmbiwgY3R4KSB7XG4gICAgZGVidWcoJ211dGF0ZScpO1xuICAgIHZhciB0YXNrID0gIWN0eCA/IGZuIDogZm4uYmluZChjdHgpO1xuICAgIHRoaXMud3JpdGVzLnB1c2godGFzayk7XG4gICAgc2NoZWR1bGVGbHVzaCh0aGlzKTtcbiAgICByZXR1cm4gdGFzaztcbiAgfSxcblxuICAvKipcbiAgICogQ2xlYXJzIGEgc2NoZWR1bGVkICdyZWFkJyBvciAnd3JpdGUnIHRhc2suXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXNrXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IHN1Y2Nlc3NcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY2xlYXI6IGZ1bmN0aW9uKHRhc2spIHtcbiAgICBkZWJ1ZygnY2xlYXInLCB0YXNrKTtcbiAgICByZXR1cm4gcmVtb3ZlKHRoaXMucmVhZHMsIHRhc2spIHx8IHJlbW92ZSh0aGlzLndyaXRlcywgdGFzayk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCB0aGlzIEZhc3REb20gd2l0aCBzb21lXG4gICAqIGN1c3RvbSBmdW5jdGlvbmFsaXR5LlxuICAgKlxuICAgKiBCZWNhdXNlIGZhc3Rkb20gbXVzdCAqYWx3YXlzKiBiZSBhXG4gICAqIHNpbmdsZXRvbiwgd2UncmUgYWN0dWFsbHkgZXh0ZW5kaW5nXG4gICAqIHRoZSBmYXN0ZG9tIGluc3RhbmNlLiBUaGlzIG1lYW5zIHRhc2tzXG4gICAqIHNjaGVkdWxlZCBieSBhbiBleHRlbnNpb24gc3RpbGwgZW50ZXJcbiAgICogZmFzdGRvbSdzIGdsb2JhbCB0YXNrIHF1ZXVlLlxuICAgKlxuICAgKiBUaGUgJ3N1cGVyJyBpbnN0YW5jZSBjYW4gYmUgYWNjZXNzZWRcbiAgICogZnJvbSBgdGhpcy5mYXN0ZG9tYC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIG15RmFzdGRvbSA9IGZhc3Rkb20uZXh0ZW5kKHtcbiAgICogICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICogICAgIC8vIHJ1bnMgb24gY3JlYXRpb25cbiAgICogICB9LFxuICAgKlxuICAgKiAgIC8vIG92ZXJyaWRlIGEgbWV0aG9kXG4gICAqICAgbWVhc3VyZTogZnVuY3Rpb24oZm4pIHtcbiAgICogICAgIC8vIGRvIGV4dHJhIHN0dWZmIC4uLlxuICAgKlxuICAgKiAgICAgLy8gdGhlbiBjYWxsIHRoZSBvcmlnaW5hbFxuICAgKiAgICAgcmV0dXJuIHRoaXMuZmFzdGRvbS5tZWFzdXJlKGZuKTtcbiAgICogICB9LFxuICAgKlxuICAgKiAgIC4uLlxuICAgKiB9KTtcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSBwcm9wcyAgcHJvcGVydGllcyB0byBtaXhpblxuICAgKiBAcmV0dXJuIHtGYXN0RG9tfVxuICAgKi9cbiAgZXh0ZW5kOiBmdW5jdGlvbihwcm9wcykge1xuICAgIGRlYnVnKCdleHRlbmQnLCBwcm9wcyk7XG4gICAgaWYgKHR5cGVvZiBwcm9wcyAhPSAnb2JqZWN0JykgdGhyb3cgbmV3IEVycm9yKCdleHBlY3RlZCBvYmplY3QnKTtcblxuICAgIHZhciBjaGlsZCA9IE9iamVjdC5jcmVhdGUodGhpcyk7XG4gICAgbWl4aW4oY2hpbGQsIHByb3BzKTtcbiAgICBjaGlsZC5mYXN0ZG9tID0gdGhpcztcblxuICAgIC8vIHJ1biBvcHRpb25hbCBjcmVhdGlvbiBob29rXG4gICAgaWYgKGNoaWxkLmluaXRpYWxpemUpIGNoaWxkLmluaXRpYWxpemUoKTtcblxuICAgIHJldHVybiBjaGlsZDtcbiAgfSxcblxuICAvLyBvdmVycmlkZSB0aGlzIHdpdGggYSBmdW5jdGlvblxuICAvLyB0byBwcmV2ZW50IEVycm9ycyBpbiBjb25zb2xlXG4gIC8vIHdoZW4gdGFza3MgdGhyb3dcbiAgY2F0Y2g6IG51bGxcbn07XG5cbi8qKlxuICogU2NoZWR1bGVzIGEgbmV3IHJlYWQvd3JpdGVcbiAqIGJhdGNoIGlmIG9uZSBpc24ndCBwZW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHNjaGVkdWxlRmx1c2goZmFzdGRvbSkge1xuICBpZiAoIWZhc3Rkb20uc2NoZWR1bGVkKSB7XG4gICAgZmFzdGRvbS5zY2hlZHVsZWQgPSB0cnVlO1xuICAgIGZhc3Rkb20ucmFmKGZsdXNoLmJpbmQobnVsbCwgZmFzdGRvbSkpO1xuICAgIGRlYnVnKCdmbHVzaCBzY2hlZHVsZWQnKTtcbiAgfVxufVxuXG4vKipcbiAqIFJ1bnMgcXVldWVkIGByZWFkYCBhbmQgYHdyaXRlYCB0YXNrcy5cbiAqXG4gKiBFcnJvcnMgYXJlIGNhdWdodCBhbmQgdGhyb3duIGJ5IGRlZmF1bHQuXG4gKiBJZiBhIGAuY2F0Y2hgIGZ1bmN0aW9uIGhhcyBiZWVuIGRlZmluZWRcbiAqIGl0IGlzIGNhbGxlZCBpbnN0ZWFkLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGZsdXNoKGZhc3Rkb20pIHtcbiAgZGVidWcoJ2ZsdXNoJyk7XG5cbiAgdmFyIHdyaXRlcyA9IGZhc3Rkb20ud3JpdGVzO1xuICB2YXIgcmVhZHMgPSBmYXN0ZG9tLnJlYWRzO1xuICB2YXIgZXJyb3I7XG5cbiAgdHJ5IHtcbiAgICBkZWJ1ZygnZmx1c2hpbmcgcmVhZHMnLCByZWFkcy5sZW5ndGgpO1xuICAgIHJ1blRhc2tzKHJlYWRzKTtcbiAgICBkZWJ1ZygnZmx1c2hpbmcgd3JpdGVzJywgd3JpdGVzLmxlbmd0aCk7XG4gICAgcnVuVGFza3Mod3JpdGVzKTtcbiAgfSBjYXRjaCAoZSkgeyBlcnJvciA9IGU7IH1cblxuICBmYXN0ZG9tLnNjaGVkdWxlZCA9IGZhbHNlO1xuXG4gIC8vIElmIHRoZSBiYXRjaCBlcnJvcmVkIHdlIG1heSBzdGlsbCBoYXZlIHRhc2tzIHF1ZXVlZFxuICBpZiAocmVhZHMubGVuZ3RoIHx8IHdyaXRlcy5sZW5ndGgpIHNjaGVkdWxlRmx1c2goZmFzdGRvbSk7XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgZGVidWcoJ3Rhc2sgZXJyb3JlZCcsIGVycm9yLm1lc3NhZ2UpO1xuICAgIGlmIChmYXN0ZG9tLmNhdGNoKSBmYXN0ZG9tLmNhdGNoKGVycm9yKTtcbiAgICBlbHNlIHRocm93IGVycm9yO1xuICB9XG59XG5cbi8qKlxuICogV2UgcnVuIHRoaXMgaW5zaWRlIGEgdHJ5IGNhdGNoXG4gKiBzbyB0aGF0IGlmIGFueSBqb2JzIGVycm9yLCB3ZVxuICogYXJlIGFibGUgdG8gcmVjb3ZlciBhbmQgY29udGludWVcbiAqIHRvIGZsdXNoIHRoZSBiYXRjaCB1bnRpbCBpdCdzIGVtcHR5LlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHJ1blRhc2tzKHRhc2tzKSB7XG4gIGRlYnVnKCdydW4gdGFza3MnKTtcbiAgdmFyIHRhc2s7IHdoaWxlICh0YXNrID0gdGFza3Muc2hpZnQoKSkgdGFzaygpO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbiBpdGVtIGZyb20gYW4gQXJyYXkuXG4gKlxuICogQHBhcmFtICB7QXJyYXl9IGFycmF5XG4gKiBAcGFyYW0gIHsqfSBpdGVtXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiByZW1vdmUoYXJyYXksIGl0ZW0pIHtcbiAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcbiAgcmV0dXJuICEhfmluZGV4ICYmICEhYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbn1cblxuLyoqXG4gKiBNaXhpbiBvd24gcHJvcGVydGllcyBvZiBzb3VyY2VcbiAqIG9iamVjdCBpbnRvIHRoZSB0YXJnZXQuXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSAge09iamVjdH0gc291cmNlXG4gKi9cbmZ1bmN0aW9uIG1peGluKHRhcmdldCwgc291cmNlKSB7XG4gIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gIH1cbn1cblxuLy8gVGhlcmUgc2hvdWxkIG5ldmVyIGJlIG1vcmUgdGhhblxuLy8gb25lIGluc3RhbmNlIG9mIGBGYXN0RG9tYCBpbiBhbiBhcHBcbnZhciBleHBvcnRzID0gd2luLmZhc3Rkb20gPSAod2luLmZhc3Rkb20gfHwgbmV3IEZhc3REb20oKSk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4vLyBFeHBvc2UgdG8gQ0pTICYgQU1EXG5pZiAoKHR5cGVvZiBkZWZpbmUpID09ICdmdW5jdGlvbicpIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIGV4cG9ydHM7IH0pO1xuZWxzZSBpZiAoKHR5cGVvZiBtb2R1bGUpID09ICdvYmplY3QnKSBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG5cbn0pKCB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHRoaXMpO1xuIiwiSVMgPSBpbXBvcnQgJy4uL2NoZWNrcydcblNpbXBseUJpbmQgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kJ1xuXG5cbmNsYXNzIENvbmRpdGlvblxuXHRjb25zdHJ1Y3RvcjogKEBmaWVsZCwgQHNldHRpbmdzLCBAY2FsbGJhY2spLT5cblx0XHRAc2F0aXNmaWVkID0gZmFsc2Vcblx0XHRAdmFsdWUgPSBAc2V0dGluZ3MudmFsdWVcblx0XHRAcHJvcGVydHkgPSBAc2V0dGluZ3MucHJvcGVydHkgb3IgJ192YWx1ZSdcblx0XHRAcHJvcGVydHkgPSAnX3ZhbHVlJyBpZiBAc2V0dGluZ3MucHJvcGVydHkgaXMgJ3ZhbHVlJ1xuXHRcdHRhcmdldCA9IEBmaWVsZC5hbGxGaWVsZHNbQHNldHRpbmdzLnRhcmdldF0gb3IgQHNldHRpbmdzLnRhcmdldFx0XG5cdFx0XG5cdFx0aWYgSVMuZmllbGQodGFyZ2V0KVxuXHRcdFx0QHRhcmdldCA9IHRhcmdldFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBjb25zb2xlLndhcm4oXCJjb25kaXRpb24gdGFyZ2V0IG5vdCBmb3VuZCBmb3IgdGhlIHByb3ZpZGVkIElEICcje0BzZXR0aW5ncy50YXJnZXR9J1wiLCBAZmllbGQpXG5cblx0XHRwcm9wZXJ0eSA9IGlmIElTLmFycmF5KEB0YXJnZXRbQHByb3BlcnR5XSkgdGhlbiBcImFycmF5OiN7QHByb3BlcnR5fVwiIGVsc2UgQHByb3BlcnR5XG5cblx0XHRTaW1wbHlCaW5kKHByb3BlcnR5LCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEB0YXJnZXQpXG5cdFx0XHQuYW5kKCd2aXNpYmxlJykub2YoQHRhcmdldC5zdGF0ZSlcblx0XHRcdFx0LnRvKEBjYWxsYmFjaylcblxuXHRcdFNpbXBseUJpbmQoJ3NhdGlzZmllZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQClcblx0XHRcdC50byAobmV3VmFsdWUsIG9sZFZhbHVlKT0+IEBmaWVsZC5lbWl0PygnY29uZGl0aW9uQ2hhbmdlJywgQCkgaWYgb2xkVmFsdWU/XG5cblxuXHR0ZXN0OiAoKS0+XG5cdFx0aWYgbm90IEB0YXJnZXQ/LnN0YXRlLnZpc2libGVcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0Y29tcGFyaXNvbiA9IHN3aXRjaFxuXHRcdFx0d2hlbiBJUy5vYmplY3RQbGFpbihAdmFsdWUpIHRoZW4gQHZhbHVlXG5cdFx0XHR3aGVuIElTLnJlZ2V4KEB2YWx1ZSkgdGhlbiAnJHJlZ2V4JzpAdmFsdWVcblx0XHRcdHdoZW4gQHZhbHVlIGlzICd2YWxpZCcgYW5kIG5vdCBAc2V0dGluZ3MucHJvcGVydHkgb3Igbm90IElTLmRlZmluZWQoQHZhbHVlKSB0aGVuICd2YWxpZCdcblx0XHRcdGVsc2UgJyRlcSc6QHZhbHVlXG5cblx0XHRpZiBjb21wYXJpc29uIGlzICd2YWxpZCdcblx0XHRcdHJldHVybiBAdGFyZ2V0LnZhbGlkYXRlKClcblx0XHRcblx0XHR0YXJnZXRWYWx1ZSA9IGRvICgpPT5cblx0XHRcdHJldHVybiBAdGFyZ2V0LnZhbHVlIGlmIEBwcm9wZXJ0eSBpcyAnX3ZhbHVlJ1xuXHRcdFx0cHJvcGVydHlDaGFpbiA9IEBwcm9wZXJ0eS5zcGxpdCgnLicpXG5cdFx0XHRzd2l0Y2hcblx0XHRcdFx0d2hlbiBwcm9wZXJ0eUNoYWluLmxlbmd0aCBpcyAxXG5cdFx0XHRcdFx0QHRhcmdldFtAcHJvcGVydHldXG5cblx0XHRcdFx0d2hlbiBJUy5kZWZpbmVkKEB0YXJnZXRbQHByb3BlcnR5XSlcblx0XHRcdFx0XHRAdGFyZ2V0W0Bwcm9wZXJ0eV1cblx0XHRcdFx0XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRuZXN0ZWRPYmplY3QgPSBAdGFyZ2V0XG5cdFx0XHRcdFx0d2hpbGUgSVMub2JqZWN0KG5lc3RlZE9iamVjdClcblx0XHRcdFx0XHRcdG5lc3RlZE9iamVjdCA9IG5lc3RlZE9iamVjdFtwcm9wZXJ0eUNoYWluLnBvcCgpXVxuXG5cdFx0XHRcdFx0cmV0dXJuIG5lc3RlZE9iamVjdFxuXG5cdFx0Y29tcGFyaXNvbk9wZXJhdG9ycyA9IE9iamVjdC5rZXlzKGNvbXBhcmlzb24pXG5cdFx0cGFzc2VkQ29tcGFyaXNvbnMgPSBjb21wYXJpc29uT3BlcmF0b3JzLmZpbHRlciAob3BlcmF0b3IpLT5cblx0XHRcdHNlZWtlZFZhbHVlID0gY29tcGFyaXNvbltvcGVyYXRvcl1cblx0XHRcdHN3aXRjaCBvcGVyYXRvclxuXHRcdFx0XHR3aGVuICckZXEnXHRcdHRoZW4gdGFyZ2V0VmFsdWUgaXMgc2Vla2VkVmFsdWUgXG5cdFx0XHRcdHdoZW4gJyRuZSdcdFx0dGhlbiB0YXJnZXRWYWx1ZSBpc250IHNlZWtlZFZhbHVlXG5cdFx0XHRcdHdoZW4gJyRndCdcdFx0dGhlbiB0YXJnZXRWYWx1ZSA+IHNlZWtlZFZhbHVlXG5cdFx0XHRcdHdoZW4gJyRndGUnXHRcdHRoZW4gdGFyZ2V0VmFsdWUgPj0gc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGx0J1x0XHR0aGVuIHRhcmdldFZhbHVlIDwgc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGx0ZSdcdFx0dGhlbiB0YXJnZXRWYWx1ZSA8PSBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckY3QnXHRcdHRoZW4gaGVscGVycy5pbmNsdWRlcyh0YXJnZXRWYWx1ZSwgc2Vla2VkVmFsdWUpXG5cdFx0XHRcdHdoZW4gJyRuY3QnXHRcdHRoZW4gbm90IGhlbHBlcnMuaW5jbHVkZXModGFyZ2V0VmFsdWUsIHNlZWtlZFZhbHVlKVxuXHRcdFx0XHR3aGVuICckcmVnZXgnXHR0aGVuIHNlZWtlZFZhbHVlLnRlc3QodGFyZ2V0VmFsdWUpXG5cdFx0XHRcdHdoZW4gJyRucmVnZXgnXHR0aGVuIG5vdCBzZWVrZWRWYWx1ZS50ZXN0KHRhcmdldFZhbHVlKVxuXHRcdFx0XHR3aGVuICckbWFzaydcdHRoZW4gaGVscGVycy50ZXN0TWFzayh0YXJnZXRWYWx1ZSwgc2Vla2VkVmFsdWUpXG5cdFx0XHRcdGVsc2UgZmFsc2VcblxuXHRcdHJldHVybiBwYXNzZWRDb21wYXJpc29ucy5sZW5ndGggaXMgY29tcGFyaXNvbk9wZXJhdG9ycy5sZW5ndGhcblxuXG5cdEB2YWxpZGF0ZTogKGNvbmRpdGlvbnMpLT4gaWYgY29uZGl0aW9uc1xuXHRcdHZhbGlkQ29uZGl0aW9ucyA9IGNvbmRpdGlvbnMuZmlsdGVyIChjb25kaXRpb24pLT5cblx0XHRcdGNvbmRpdGlvbi5zYXRpc2ZpZWQgPSBjb25kaXRpb24udGVzdCgpXG5cdFx0XG5cdFx0cmV0dXJuIHZhbGlkQ29uZGl0aW9ucy5sZW5ndGggaXMgY29uZGl0aW9ucy5sZW5ndGhcblxuXG5cdEBpbml0OiAoZmllbGQsIGNvbmRpdGlvbnMsIGNhbGxiYWNrKS0+IHNldFRpbWVvdXQgKCk9PlxuXHRcdGNhbGxiYWNrID89ICgpPT4gZmllbGQudmFsaWRhdGVDb25kaXRpb25zKClcblx0XHRcblx0XHRmaWVsZC5jb25kaXRpb25zID0gY29uZGl0aW9ucy5tYXAgKGNvbmRpdGlvbiktPlxuXHRcdFx0bmV3IENvbmRpdGlvbihmaWVsZCwgY29uZGl0aW9uLCBjYWxsYmFjaylcblxuXHRcdGNhbGxiYWNrKClcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb25kaXRpb24iLCJtb2R1bGUuZXhwb3J0cyA9XG5cdGZvbnRGYW1pbHk6ICdzeXN0ZW0tdWksIHNhbnMtc2VyaWYnXG5cdHRlbXBsYXRlczoge31cblx0ZXZlbnRzOiBudWxsXG5cdGxhYmVsOiBmYWxzZVxuXHRlcnJvcjogJydcblx0aGVscDogJydcblx0cmVxdWlyZWQ6IGZhbHNlXG5cdGRpc2FibGVkOiBmYWxzZVxuXHRkZWZhdWx0VmFsdWU6IG51bGxcblx0d2lkdGg6ICcxMDAlJ1xuXHRtb2JpbGVXaWR0aDogbnVsbFxuXHRtb2JpbGVUaHJlc2hvbGQ6IDczNlxuXHRib3JkZXI6IDFcblx0bWFyZ2luOiBudWxsXG5cdHBhZGRpbmc6IG51bGxcblx0ZGlzdGFuY2U6IG51bGxcblx0aW5wdXRQYWRkaW5nOiAxMlxuXHRmb250U2l6ZTogMTRcblx0bGFiZWxTaXplOiBudWxsXG5cdGljb246IG51bGxcblx0aWNvblNpemU6IDIyXG5cdGdldHRlcjogbnVsbFxuXHRzZXR0ZXI6IG51bGxcblx0dmFsaWRhdG9yOiBudWxsXG5cdGNsZWFyRXJyb3JPblZhbGlkOiB0cnVlXG5cdG1ha2VSb29tRm9ySGVscDogdHJ1ZSIsIklTID0gaW1wb3J0ICcuLi8uLi9jaGVja3MnXG5TaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcbktFWUNPREVTID0gaW1wb3J0ICcuLi8uLi9jb25zdGFudHMva2V5Q29kZXMnXG5oZWxwZXJzID0gaW1wb3J0ICcuLi8uLi9oZWxwZXJzJ1xuQ29uZGl0aW9uID0gaW1wb3J0ICcuLi9jb25kaXRpb24nXG5leHRlbmQgPSBpbXBvcnQgJ3NtYXJ0LWV4dGVuZCdcbkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5nbG9iYWxEZWZhdWx0cyA9IGltcG9ydCAnLi4vLi4vZmllbGQvZ2xvYmFsRGVmYXVsdHMnXG5pbXBvcnQgKiBhcyB0ZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlJ1xuaW1wb3J0ICogYXMgZGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0cydcblxuY2xhc3MgRHJvcGRvd25cblx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdGRlZmF1bHRzOiBkZWZhdWx0c1xuXHRfc2V0dGluZ0ZpbHRlcnM6IG1heEhlaWdodDogKHZhbHVlKS0+IElTLm51bWJlcih2YWx1ZSlcblx0XG5cdGNvbnN0cnVjdG9yOiAoQGluaXRpYWxDaG9pY2VzLCBAZmllbGQpLT5cblx0XHRAaXNPcGVuID0gZmFsc2Vcblx0XHRAdHlwZUJ1ZmZlciA9ICcnXG5cdFx0QHNldHRpbmdzID0gZXh0ZW5kLmRlZXAuY2xvbmUuZmlsdGVyKEBfc2V0dGluZ0ZpbHRlcnMpKGdsb2JhbERlZmF1bHRzLCBAZGVmYXVsdHMsIEBmaWVsZC5zZXR0aW5ncy5kcm9wZG93bilcblx0XHRAc2VsZWN0ZWQgPSBpZiBAc2V0dGluZ3MubXVsdGlwbGUgdGhlbiBbXSBlbHNlIG51bGxcblx0XHRAbGFzdFNlbGVjdGVkID0gbnVsbFxuXHRcdEBjaG9pY2VzID0gW11cblx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gbnVsbFxuXHRcdEB2aXNpYmxlQ2hvaWNlc0NvdW50ID0gMFxuXHRcdEB2aXNpYmxlQ2hvaWNlcyA9IFtdXG5cdFx0QGVscyA9IHt9XG5cdFx0QF9zZWxlY3RlZENhbGxiYWNrID0gaGVscGVycy5ub29wXG5cdFx0XG5cdFx0QF9jcmVhdGVFbGVtZW50cygpXG5cdFx0QF9hdHRhY2hCaW5kaW5ncygpXG5cdFx0cmV0dXJuIEBcblxuXG5cdF9jcmVhdGVFbGVtZW50czogKCktPlxuXHRcdGdsb2JhbE9wdHMgPSB7cmVsYXRlZEluc3RhbmNlOkB9XG5cdFx0QGVscy5jb250YWluZXIgPSBAdGVtcGxhdGUuZGVmYXVsdC5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmRlZmF1bHQsIGV4dGVuZCh7cGFzc1N0YXRlVG9DaGlsZHJlbjpmYWxzZX0sIGdsb2JhbE9wdHMpKVxuXHRcdEBlbHMubGlzdCA9IEB0ZW1wbGF0ZS5saXN0LnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMubGlzdCwgZ2xvYmFsT3B0cykuYXBwZW5kVG8oQGVscy5jb250YWluZXIpXG5cdFx0QGVscy5oZWxwID0gQHRlbXBsYXRlLmhlbHAuc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5oZWxwLCBnbG9iYWxPcHRzKS5hcHBlbmRUbyhAZWxzLmNvbnRhaW5lcilcblx0XHRAZWxzLnNjcm9sbEluZGljYXRvclVwID0gQHRlbXBsYXRlLnNjcm9sbEluZGljYXRvclVwLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuc2Nyb2xsSW5kaWNhdG9yVXAsIGdsb2JhbE9wdHMpLmFwcGVuZFRvKEBlbHMuY29udGFpbmVyKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93biA9IEB0ZW1wbGF0ZS5zY3JvbGxJbmRpY2F0b3JEb3duLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuc2Nyb2xsSW5kaWNhdG9yRG93biwgZ2xvYmFsT3B0cykuYXBwZW5kVG8oQGVscy5jb250YWluZXIpXG5cblx0XHRAbGlzdCA9IG5ldyBMaXN0KEApXG5cdFx0QGFkZENob2ljZShjaG9pY2UpIGZvciBjaG9pY2UgaW4gQGluaXRpYWxDaG9pY2VzXG5cdFx0cmV0dXJuXG5cblxuXG5cdF9hdHRhY2hCaW5kaW5nczogKCktPlxuXHRcdEBfYXR0YWNoQmluZGluZ3NfZWxTdGF0ZSgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5KClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX3Njcm9sbEluZGljYXRvcnMoKVxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2VsU3RhdGU6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdoZWxwJykub2YoQHNldHRpbmdzKVxuXHRcdFx0LnRvKCd0ZXh0Jykub2YoQGVscy5oZWxwKVxuXHRcdFx0LmFuZC50byAoc2hvd0hlbHApPT4gQGVscy5oZWxwLnN0YXRlICdzaG93SGVscCcsIHNob3dIZWxwXG5cblx0XHRTaW1wbHlCaW5kKCd2aXNpYmxlQ2hvaWNlc0NvdW50Jykub2YoQClcblx0XHRcdC50byAoY291bnQpPT4gQGVscy5jb250YWluZXIuc3RhdGUgJ2hhc1Zpc2libGVDaG9pY2VzJywgISFjb3VudFxuXHRcblx0XHRTaW1wbHlCaW5kKCdjdXJyZW50SGlnaGxpZ2h0ZWQnKS5vZihAKVxuXHRcdFx0LnRvIChjdXJyZW50LCBwcmV2KT0+XG5cdFx0XHRcdHByZXYuZWwuc3RhdGUoJ2hvdmVyJywgb2ZmKSBpZiBwcmV2XG5cdFx0XHRcdGN1cnJlbnQuZWwuc3RhdGUoJ2hvdmVyJywgb24pIGlmIGN1cnJlbnRcblxuXG5cdF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5OiAoKS0+XG5cdFx0U2ltcGx5QmluZCgnaXNPcGVuJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKS50byAoaXNPcGVuKT0+XG5cdFx0XHRAZWxzLmNvbnRhaW5lci5zdGF0ZSAnaXNPcGVuJywgaXNPcGVuXHRcdFxuXHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IG51bGwgaWYgbm90IGlzT3BlblxuXHRcblx0XHRcdGlmIEBzZXR0aW5ncy5sb2NrU2Nyb2xsXG5cdFx0XHRcdGlmIGlzT3BlblxuXHRcdFx0XHRcdGhlbHBlcnMubG9ja1Njcm9sbChAZWxzLmxpc3QpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRoZWxwZXJzLnVubG9ja1Njcm9sbCgpXG5cblx0XHRcdGlmIGlzT3BlblxuXHRcdFx0XHRAbGlzdC5hcHBlbmRDaG9pY2VzKClcblx0XHRcdFx0QGxpc3QuY2FsY0Rpc3BsYXkoKVxuXHRcdFx0XHRAbGlzdC5zY3JvbGxUb0Nob2ljZShAc2VsZWN0ZWQpIGlmIEBzZWxlY3RlZCBhbmQgbm90IEBzZXR0aW5ncy5tdWx0aXBsZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAbGlzdC5zZXRUcmFuc2xhdGUoMClcblxuXG5cdFx0U2ltcGx5QmluZCgnbGFzdFNlbGVjdGVkJywgdXBkYXRlT25CaW5kOmZhbHNlLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUpLm9mKEApXG5cdFx0XHQudG8gKG5ld0Nob2ljZSwgcHJldkNob2ljZSk9PiBAX3NlbGVjdGVkQ2FsbGJhY2sobmV3Q2hvaWNlLCBwcmV2Q2hvaWNlKVxuXG5cblx0XHRTaW1wbHlCaW5kKCdmb2N1c2VkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAZmllbGQuc3RhdGUpLnRvIChmb2N1c2VkKT0+XG5cdFx0XHRpZiBub3QgZm9jdXNlZFxuXHRcdFx0XHRAZmllbGQuZWwuY2hpbGQuaW5wdXQub2ZmICdrZXlkb3duLmRyb3Bkb3duTmF2J1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAZmllbGQuZWwuY2hpbGQuaW5wdXQub24gJ2tleWRvd24uZHJvcGRvd25OYXYnLCAoZXZlbnQpPT4gaWYgQGlzT3BlbiB0aGVuIHN3aXRjaCBldmVudC5rZXlDb2RlXG5cdFx0XHRcdFx0d2hlbiBLRVlDT0RFUy51cFxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0QGhpZ2hsaWdodFByZXYoKVxuXG5cdFx0XHRcdFx0d2hlbiBLRVlDT0RFUy5kb3duXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0XHRAaGlnaGxpZ2h0TmV4dCgpXG5cblx0XHRcdFx0XHR3aGVuIEtFWUNPREVTLmVudGVyXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0XHRAbGFzdFNlbGVjdGVkID0gQGN1cnJlbnRIaWdobGlnaHRlZCBpZiBAY3VycmVudEhpZ2hsaWdodGVkXG5cblx0XHRcdFx0XHR3aGVuIEtFWUNPREVTLmVzY1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0QGlzT3BlbiA9IGZhbHNlXG5cblx0XHRcblx0XHRyZXR1cm4gaWYgbm90IEBzZXR0aW5ncy50eXBlQnVmZmVyXG5cdFx0U2ltcGx5QmluZCgnZm9jdXNlZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQGZpZWxkLnN0YXRlKS50byAoZm9jdXNlZCk9PlxuXHRcdFx0aWYgbm90IGZvY3VzZWRcblx0XHRcdFx0RE9NKGRvY3VtZW50KS5vZmYgJ2tleXByZXNzLmRyb3Bkb3duVHlwZUJ1ZmZlcidcblx0XHRcdGVsc2Vcblx0XHRcdFx0RE9NKGRvY3VtZW50KS5vbiAna2V5cHJlc3MuZHJvcGRvd25UeXBlQnVmZmVyJywgKGV2ZW50KT0+IGlmIEBpc09wZW5cblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0cmV0dXJuIGlmIG5vdCBLRVlDT0RFUy5hbnlQcmludGFibGUoZXZlbnQua2V5Q29kZSlcblx0XHRcdFx0XHRAdHlwZUJ1ZmZlciArPSBldmVudC5rZXlcblxuXG5cdFx0U2ltcGx5QmluZCgndHlwZUJ1ZmZlcicsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQClcblx0XHRcdC50byAoKT0+XG5cdFx0XHRcdGNsZWFyVGltZW91dChAdHlwZUJ1ZmZlclRpbWVvdXQpXG5cdFx0XHRcdEB0eXBlQnVmZmVyVGltZW91dCA9IHNldFRpbWVvdXQgKCk9PlxuXHRcdFx0XHRcdEB0eXBlQnVmZmVyID0gJydcblx0XHRcdFx0LDE1MDBcblx0XHRcdFxuXHRcdFx0LmFuZC50byAoYnVmZmVyKT0+IGlmIGJ1ZmZlclxuXHRcdFx0XHRmb3IgY2hvaWNlIGluIEB2aXNpYmxlQ2hvaWNlc1xuXHRcdFx0XHRcdGlmIGhlbHBlcnMuc3RhcnRzV2l0aChidWZmZXIsIGNob2ljZS5sYWJlbClcblx0XHRcdFx0XHRcdEBjdXJyZW50SGlnaGxpZ2h0ZWQgPSBjaG9pY2Vcblx0XHRcdFx0XHRcdEBsaXN0LnNjcm9sbFRvQ2hvaWNlKGNob2ljZSkgdW5sZXNzIEBsaXN0LmNob2ljZUluVmlldyhjaG9pY2UpXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3Nfc2Nyb2xsSW5kaWNhdG9yczogKCktPlxuXHRcdFNpbXBseUJpbmQoJ3Njcm9sbFRvcCcsIHVwZGF0ZUV2ZW5JZlNhbWU6dHJ1ZSkub2YoQGVscy5saXN0LnJhdylcblx0XHRcdC50byAoc2Nyb2xsVG9wKT0+XG5cdFx0XHRcdHNob3dUb3BJbmRpY2F0b3IgPSBzY3JvbGxUb3AgPiAwXG5cdFx0XHRcdHNob3dCb3R0b21JbmRpY2F0b3IgPSBAZWxzLmxpc3QucmF3LnNjcm9sbEhlaWdodCAtIEBlbHMubGlzdC5yYXcuY2xpZW50SGVpZ2h0ID4gc2Nyb2xsVG9wXG5cblx0XHRcdFx0QGVscy5zY3JvbGxJbmRpY2F0b3JVcC5zdGF0ZSAndmlzaWJsZScsIHNob3dUb3BJbmRpY2F0b3Jcblx0XHRcdFx0QGVscy5zY3JvbGxJbmRpY2F0b3JEb3duLnN0YXRlICd2aXNpYmxlJywgc2hvd0JvdHRvbUluZGljYXRvclxuXG5cdFx0XHQuY29uZGl0aW9uICgpPT4gQGlzT3BlbiBhbmQgbm90IEBzZXR0aW5ncy5oZWxwIGFuZCBAZWxzLmxpc3QucmF3LnNjcm9sbEhlaWdodCBpc250IEBlbHMubGlzdC5yYXcuY2xpZW50SGVpZ2h0IGFuZCBAZWxzLmxpc3QucmF3LmNsaWVudEhlaWdodCA+PSAxMDBcblx0XHRcdC51cGRhdGVPbignZXZlbnQ6c2Nyb2xsJykub2YoQGVscy5saXN0LnJhdylcblx0XHRcdC51cGRhdGVPbignaXNPcGVuJykub2YoQClcblxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAub24gJ21vdXNlZW50ZXInLCAoKT0+IEBsaXN0LnN0YXJ0U2Nyb2xsaW5nKCd1cCcpXG5cdFx0QGVscy5zY3JvbGxJbmRpY2F0b3JVcC5vbiAnbW91c2VsZWF2ZScsICgpPT4gQGxpc3Quc3RvcFNjcm9sbGluZygpXG5cdFx0QGVscy5zY3JvbGxJbmRpY2F0b3JEb3duLm9uICdtb3VzZWVudGVyJywgKCk9PiBAbGlzdC5zdGFydFNjcm9sbGluZygnZG93bicpXG5cdFx0QGVscy5zY3JvbGxJbmRpY2F0b3JEb3duLm9uICdtb3VzZWxlYXZlJywgKCk9PiBAbGlzdC5zdG9wU2Nyb2xsaW5nKClcblxuXG5cdGFkZENob2ljZTogKGNvbmZpZyktPlxuXHRcdGlmIElTLmFycmF5KGNvbmZpZylcblx0XHRcdEBhZGRDaG9pY2UoaXRlbSkgZm9yIGl0ZW0gaW4gY29uZmlnXG5cdFx0XHRyZXR1cm5cblx0XHRcblx0XHRlbHNlIGlmIElTLnN0cmluZyhjb25maWcpXG5cdFx0XHRjb25maWcgPSB7bGFiZWw6Y29uZmlnLCB2YWx1ZTpjb25maWd9XG5cdFx0XG5cdFx0ZWxzZSBpZiBJUy5vYmplY3RQbGFpbihjb25maWcpXG5cdFx0XHRjb25maWcudmFsdWUgPz0gY29uZmlnLmxhYmVsXG5cdFx0XHRjb25maWcubGFiZWwgPz0gY29uZmlnLnZhbHVlXG5cblx0XHRlbHNlIHJldHVyblxuXG5cdFx0bmV3Q2hvaWNlID0gbmV3IENob2ljZShALCBjb25maWcsIEBsaXN0LCBAY2hvaWNlcy5sZW5ndGgpXG5cdFx0QGNob2ljZXMucHVzaChuZXdDaG9pY2UpXG5cdFx0cmV0dXJuIG5ld0Nob2ljZVxuXG5cblx0YXBwZW5kVG86ICh0YXJnZXQpLT5cblx0XHRAZWxzLmNvbnRhaW5lci5hcHBlbmRUbyh0YXJnZXQpXG5cblxuXHRvblNlbGVjdGVkOiAoY2FsbGJhY2spLT5cblx0XHRAX3NlbGVjdGVkQ2FsbGJhY2sgPSBjYWxsYmFja1xuXG5cblx0ZmluZENob2ljZTogKHByb3ZpZGVkVmFsdWUsIGJ5TGFiZWwpLT5cblx0XHRtYXRjaGVzID0gQGNob2ljZXMuZmlsdGVyIChjaG9pY2UpLT4gc3dpdGNoXG5cdFx0XHR3aGVuIElTLm9iamVjdChwcm92aWRlZFZhbHVlKSB0aGVuIHByb3ZpZGVkVmFsdWUgaXMgY2hvaWNlXG5cdFx0XHR3aGVuIGJ5TGFiZWwgdGhlbiBwcm92aWRlZFZhbHVlIGlzIGNob2ljZS5sYWJlbFxuXHRcdFx0ZWxzZSBwcm92aWRlZFZhbHVlIGlzIGNob2ljZS52YWx1ZVxuXG5cdFx0cmV0dXJuIG1hdGNoZXNbMF1cblxuXG5cdGZpbmRDaG9pY2VBbnk6IChwcm92aWRlZFZhbHVlKS0+XG5cdFx0QGZpbmRDaG9pY2UocHJvdmlkZWRWYWx1ZSkgb3IgQGZpbmRDaG9pY2UocHJvdmlkZWRWYWx1ZSwgdHJ1ZSlcblxuXG5cdGhpZ2hsaWdodFByZXY6ICgpLT5cblx0XHRjdXJyZW50SW5kZXggPSBAdmlzaWJsZUNob2ljZXMuaW5kZXhPZihAY3VycmVudEhpZ2hsaWdodGVkKVxuXHRcdFxuXHRcdGlmIGN1cnJlbnRJbmRleCA+IDBcblx0XHRcdEBjdXJyZW50SGlnaGxpZ2h0ZWQgPSBjaG9pY2UgPSBAdmlzaWJsZUNob2ljZXNbY3VycmVudEluZGV4LTFdXG5cdFx0XHRAbGlzdC5zY3JvbGxVcChjaG9pY2UpIHVubGVzcyBAbGlzdC5jaG9pY2VJblZpZXcoY2hvaWNlKVxuXHRcdGVsc2Vcblx0XHRcdEBjdXJyZW50SGlnaGxpZ2h0ZWQgPSBjaG9pY2UgPSBAdmlzaWJsZUNob2ljZXNbQHZpc2libGVDaG9pY2VzLmxlbmd0aC0xXVxuXHRcdFx0QGxpc3Quc2Nyb2xsVG9DaG9pY2UoY2hvaWNlLDEpIHVubGVzcyBAbGlzdC5jaG9pY2VJblZpZXcoY2hvaWNlKVxuXG5cblxuXHRoaWdobGlnaHROZXh0OiAoKS0+XG5cdFx0Y3VycmVudEluZGV4ID0gQHZpc2libGVDaG9pY2VzLmluZGV4T2YoQGN1cnJlbnRIaWdobGlnaHRlZClcblx0XHRcblx0XHRpZiBjdXJyZW50SW5kZXggPCBAdmlzaWJsZUNob2ljZXMubGVuZ3RoLTFcblx0XHRcdEBjdXJyZW50SGlnaGxpZ2h0ZWQgPSBjaG9pY2UgPSBAdmlzaWJsZUNob2ljZXNbY3VycmVudEluZGV4KzFdXG5cdFx0XHRAbGlzdC5zY3JvbGxEb3duKGNob2ljZSkgdW5sZXNzIEBsaXN0LmNob2ljZUluVmlldyhjaG9pY2UpXG5cdFx0ZWxzZVxuXHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IGNob2ljZSA9IEB2aXNpYmxlQ2hvaWNlc1swXVxuXHRcdFx0QGxpc3Quc2Nyb2xsVG9DaG9pY2UoY2hvaWNlLDEpIHVubGVzcyBAbGlzdC5jaG9pY2VJblZpZXcoY2hvaWNlKVxuXG5cblxuXG5cblxuXG5jbGFzcyBMaXN0XG5cdGNvbnN0cnVjdG9yOiAoQGRyb3Bkb3duKS0+XG5cdFx0e0BlbHMsIEBmaWVsZCwgQHNldHRpbmdzfSA9IEBkcm9wZG93blxuXHRcdEBlbCA9IEBlbHMubGlzdFxuXHRcdEBjb250YWluZXIgPSBAZWxzLmNvbnRhaW5lclxuXHRcdEBhcHBlbmRlZENob2ljZXMgPSBmYWxzZVxuXG5cdGFwcGVuZENob2ljZXM6ICgpLT5cblx0XHRyZXR1cm4gaWYgQGFwcGVuZGVkQ2hvaWNlc1xuXHRcdGNob2ljZS5pbml0KCkgZm9yIGNob2ljZSBpbiBAZHJvcGRvd24uY2hvaWNlc1xuXHRcdEBhcHBlbmRlZENob2ljZXMgPSB0cnVlXG5cblx0Y2FsY0Rpc3BsYXk6ICgpLT5cblx0XHR3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcblx0XHR0cmFuc2xhdGlvbiA9IEB0cmFuc2xhdGlvbiBvciAwXG5cdFx0Y2xpcHBpbmdQYXJlbnQgPSBAY29udGFpbmVyLnBhcmVudE1hdGNoaW5nIChwYXJlbnQpLT4gb3ZlcmZsb3c9cGFyZW50LnN0eWxlKCdvdmVyZmxvd1knKTsgb3ZlcmZsb3cgaXMgJ2hpZGRlbicgb3Igb3ZlcmZsb3cgaXMgJ3Njcm9sbCdcblx0XHRzY3JvbGxIZWlnaHQgPSBAZWwucmF3LnNjcm9sbEhlaWdodCBvciBJbmZpbml0eVxuXHRcdHNlbGZSZWN0ID0gZXh0ZW5kLmNsb25lIEBjb250YWluZXIucmVjdFxuXHRcdHBhZGRpbmcgPSBzZWxmUmVjdC5oZWlnaHQgLSBAZWwuaGVpZ2h0XG5cdFx0aGVpZ2h0ID0gTWF0aC5taW4gc2Nyb2xsSGVpZ2h0LCBAc2V0dGluZ3MubWF4SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQtNDBcblx0XHRzZWxmUmVjdC5ib3R0b20gPSBzZWxmUmVjdC50b3AgKyBoZWlnaHRcblxuXHRcdGlmIGNsaXBwaW5nUGFyZW50XG5cdFx0XHRjbGlwcGluZ1JlY3QgPSBjbGlwcGluZ1BhcmVudC5yZWN0XG5cdFx0XHRib3R0b21DdXRvZmYgPSBzZWxmUmVjdC5ib3R0b20gLSBjbGlwcGluZ1JlY3QuYm90dG9tXG5cdFx0XHR0b3BDdXRvZmYgPSBjbGlwcGluZ1JlY3QudG9wIC0gc2VsZlJlY3QudG9wXG5cdFx0XHRpc0JvdHRvbUN1dG9mZiA9IGJvdHRvbUN1dG9mZiA+IDBcblx0XHRcdGlzVG9wQ3V0b2ZmID0gdG9wQ3V0b2ZmID4gMFxuXG5cdFx0XHRpZiBzZWxmUmVjdC50b3AgPj0gY2xpcHBpbmdSZWN0LmJvdHRvbSBvciBjbGlwcGluZ1JlY3QudG9wID49IHNlbGZSZWN0LmJvdHRvbVxuXHRcdFx0XHRjb25zb2xlLndhcm4oXCJUaGUgZHJvcGRvd24gZm9yIGVsZW1lbnQgJyN7QGZpZWxkLklEfScgY2Fubm90IGJlIGRpc3BsYXllZCBhcyBpdCdzIGhpZGRlbiBieSB0aGUgcGFyZW50IG92ZXJmbG93XCIpXG5cdFx0XHRcblx0XHRcdGVsc2UgaWYgaXNCb3R0b21DdXRvZmYgb3IgaXNUb3BDdXRvZmZcblx0XHRcdFx0bmVlZHNOZXdIZWlnaHQgPSB0cnVlXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBzZWxmUmVjdC50b3AgLSBib3R0b21DdXRvZmYgPiBjbGlwcGluZ1JlY3QudG9wIGFuZCBub3QgaXNUb3BDdXRvZmZcblx0XHRcdFx0XHR0cmFuc2xhdGlvbiA9IGJvdHRvbUN1dG9mZlxuXHRcdFx0XHRcdHNlbGZSZWN0LnRvcCAtPSB0cmFuc2xhdGlvblxuXHRcdFx0XHRcdHNlbGZSZWN0LmJvdHRvbSAtPSB0cmFuc2xhdGlvblxuXHRcdFx0XHRcdGN1dG9mZiA9IGNsaXBwaW5nUmVjdC50b3AgLSBzZWxmUmVjdC50b3BcblxuXHRcdFx0XHRlbHNlIGlmIHNlbGZSZWN0LmJvdHRvbSAtIHRvcEN1dG9mZiA8IGNsaXBwaW5nUmVjdC5ib3R0b21cblx0XHRcdFx0XHR0cmFuc2xhdGlvbiA9IHRvcEN1dG9mZiAqIC0xXG5cdFx0XHRcdFx0c2VsZlJlY3QudG9wICs9IHRyYW5zbGF0aW9uXG5cdFx0XHRcdFx0c2VsZlJlY3QuYm90dG9tICs9IHRyYW5zbGF0aW9uXG5cdFx0XHRcdFx0Y3V0b2ZmID0gc2VsZlJlY3QuYm90dG9tIC0gY2xpcHBpbmdSZWN0LmJvdHRvbVxuXG5cblx0XHRcdFx0aWYgbmVlZHNOZXdIZWlnaHQgPSBjdXRvZmYgPiAwXG5cdFx0XHRcdFx0aGVpZ2h0ID0gY3V0b2ZmIC0gcGFkZGluZ1xuXG5cdFx0XG5cdFx0d2luZG93Q3V0b2ZmID0gKHNlbGZSZWN0LnRvcCArIGhlaWdodCkgLSB3aW5kb3dIZWlnaHRcblx0XHRcblx0XHRpZiB3aW5kb3dDdXRvZmYgPiAwIGFuZCBoZWlnaHQgPCB3aW5kb3dIZWlnaHRcblx0XHRcdHRyYW5zbGF0aW9uICs9IHdpbmRvd0N1dG9mZisxMFxuXG5cdFx0QHNldERpbWVuc2lvbnMoaGVpZ2h0LCBAZmllbGQuZWwuY2hpbGQuaW5uZXJ3cmFwLndpZHRoKzEwKVxuXHRcdEBzZXRUcmFuc2xhdGUodHJhbnNsYXRpb24pXG5cblxuXHRzZXREaW1lbnNpb25zOiAoaGVpZ2h0LCB3aWR0aCktPlxuXHRcdEBlbC5zdHlsZSAnbWF4SGVpZ2h0JywgaGVpZ2h0IGlmIGhlaWdodD9cblx0XHRAZWwuc3R5bGUgJ21pbldpZHRoJywgd2lkdGggaWYgd2lkdGg/XG5cblx0XG5cdHNldFRyYW5zbGF0ZTogKHRyYW5zbGF0aW9uKS0+XG5cdFx0QHRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb25cblx0XHR0cmFuc2xhdGlvbiAqPSAtMVxuXHRcdEBjb250YWluZXIuc3R5bGUgJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlWSgje3RyYW5zbGF0aW9ufXB4KVwiXG5cblxuXHRzY3JvbGxUb0Nob2ljZTogKGNob2ljZSxvZmZzZXQ9MyktPlxuXHRcdGRpc3RhbmVGcm9tVG9wID0gY2hvaWNlLmVsLnJhdy5vZmZzZXRUb3Bcblx0XHRzZWxlY3RlZEhlaWdodCA9IGNob2ljZS5lbC5oZWlnaHRcblx0XHRcblx0XHRAZWwucmF3LnNjcm9sbFRvcCA9IGRpc3RhbmVGcm9tVG9wIC0gc2VsZWN0ZWRIZWlnaHQqb2Zmc2V0XG5cblx0c2Nyb2xsRG93bjogKGNob2ljZSktPlxuXHRcdEBlbC5yYXcuc2Nyb2xsVG9wICs9IGNob2ljZS5lbC5oZWlnaHRcblxuXHRzY3JvbGxVcDogKGNob2ljZSktPlxuXHRcdEBlbC5yYXcuc2Nyb2xsVG9wIC09IGNob2ljZS5lbC5oZWlnaHRcblxuXHRjaG9pY2VJblZpZXc6IChjaG9pY2UpPT5cblx0XHRjaG9pY2VSZWN0ID0gY2hvaWNlLmVsLnJlY3Rcblx0XHRsaXN0UmVjdCA9IEBlbC5yZWN0XG5cdFx0dXBQYWRkaW5nID0gaWYgQGVscy5zY3JvbGxJbmRpY2F0b3JVcC5zdGF0ZSgndmlzaWJsZScpIHRoZW4gcGFyc2VGbG9hdCBAZWxzLnNjcm9sbEluZGljYXRvclVwLnN0eWxlU2FmZSgnaGVpZ2h0Jyx0cnVlKVxuXHRcdGRvd25QYWRkaW5nID0gaWYgQGVscy5zY3JvbGxJbmRpY2F0b3JEb3duLnN0YXRlKCd2aXNpYmxlJykgdGhlbiBwYXJzZUZsb2F0IEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5zdHlsZVNhZmUoJ2hlaWdodCcsdHJ1ZSlcblxuXHRcdGNob2ljZVJlY3QuYm90dG9tIDw9IGxpc3RSZWN0LmJvdHRvbS1kb3duUGFkZGluZyBhbmRcblx0XHRjaG9pY2VSZWN0LnRvcCA+PSBsaXN0UmVjdC50b3ArdXBQYWRkaW5nXG5cblxuXHRzdGFydFNjcm9sbGluZzogKGRpcmVjdGlvbiktPlxuXHRcdEBzY3JvbGxJbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwgKCk9PlxuXHRcdFx0QGVsLnJhdy5zY3JvbGxUb3AgKz0gaWYgZGlyZWN0aW9uIGlzICd1cCcgdGhlbiAtMjAgZWxzZSAyMFxuXHRcdCwgNTBcblxuXG5cdHN0b3BTY3JvbGxpbmc6ICgpLT5cblx0XHRjbGVhckludGVydmFsKEBzY3JvbGxJbnRlcnZhbElEKVxuXG5cblxuXG5cbmNsYXNzIENob2ljZVxuXHRjb25zdHJ1Y3RvcjogKEBkcm9wZG93biwgQHNldHRpbmdzLCBAbGlzdCwgQGluZGV4KS0+XG5cdFx0e0BsYWJlbCwgQHZhbHVlLCBAY29uZGl0aW9uc30gPSBAc2V0dGluZ3Ncblx0XHRAbGFiZWwgPz0gQHZhbHVlXG5cdFx0QHZhbHVlID89IEBsYWJlbFxuXHRcdEBmaWVsZCA9IEBkcm9wZG93bi5maWVsZFxuXHRcdEB2aXNpYmxlID0gdHJ1ZVxuXHRcdEBzZWxlY3RlZCA9IGZhbHNlXG5cdFx0QHVuYXZhaWxhYmxlID0gZmFsc2Vcblx0XHRAaW5pdGlhbGl6ZWQgPSBmYWxzZVxuXG5cdFx0aWYgQGNvbmRpdGlvbnM/Lmxlbmd0aFxuXHRcdFx0QHVuYXZhaWxhYmxlID0gdHJ1ZVxuXHRcdFx0QGFsbEZpZWxkcyA9IEBmaWVsZC5hbGxGaWVsZHNcblxuXHRcdFx0Q29uZGl0aW9uLmluaXQgQCwgQGNvbmRpdGlvbnMsICgpPT5cblx0XHRcdFx0QHVuYXZhaWxhYmxlID0gIUNvbmRpdGlvbi52YWxpZGF0ZShAY29uZGl0aW9ucylcblxuXHRpbml0OiAoKS0+XG5cdFx0cmV0dXJuIGlmIEBpbml0aWFsaXplZFxuXHRcdEBpbml0aWFsaXplZCA9IHRydWVcblx0XHRAZWwgPSBAZHJvcGRvd24udGVtcGxhdGUuY2hvaWNlLnNwYXduKG51bGwsIHtyZWxhdGVkSW5zdGFuY2U6QGRyb3Bkb3dufSlcblx0XHRAZWwuY2hpbGRyZW5bMV0udGV4dCA9IEBsYWJlbFxuXHRcdEBlbC5hcHBlbmRUbyhAbGlzdC5lbClcblx0XHRAX2F0dGFjaEJpbmRpbmdzKClcblxuXHRfYXR0YWNoQmluZGluZ3M6ICgpLT4gZG8gKCk9PlxuXHRcdFNpbXBseUJpbmQoJ3Zpc2libGUnKS5vZihAKS50byAodmlzaWJsZSxwcmV2KT0+XG5cdFx0XHRAZHJvcGRvd24udmlzaWJsZUNob2ljZXNDb3VudCArPSBpZiB2aXNpYmxlIHRoZW4gMSBlbHNlIC0xXG5cdFx0XHRAZWwuc3RhdGUgJ3Zpc2libGUnLCB2aXNpYmxlXG5cdFx0XHRpZiB2aXNpYmxlXG5cdFx0XHRcdEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlcy5wdXNoKEApXG5cdFx0XHRcdGlmIElTLmRlZmluZWQocHJldikgIyBpbmRpY2F0ZXMgc3RhdGUgaGFzIGNoYW5nZWRcblx0XHRcdFx0XHRAZHJvcGRvd24udmlzaWJsZUNob2ljZXMuc29ydCAoYSxiKS0+IGEuaW5kZXggLSBiLmluZGV4XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAZHJvcGRvd24udmlzaWJsZUNob2ljZXMsIEApXG5cblx0XHRTaW1wbHlCaW5kKCdzZWxlY3RlZCcpLm9mKEApXG5cdFx0XHQudG8gKHNlbGVjdGVkKT0+IEBlbC5zdGF0ZSAnc2VsZWN0ZWQnLCBzZWxlY3RlZFxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ3VuYXZhaWxhYmxlJykub2YoQClcblx0XHRcdC50byAodW5hdmFpbGFibGUpPT4gQGVsLnN0YXRlICd1bmF2YWlsYWJsZScsIHVuYXZhaWxhYmxlXHRcdFx0XG5cdFx0XHQuYW5kLnRvICh1bmF2YWlsYWJsZSk9PiBAdG9nZ2xlKG9mZiwgdHJ1ZSkgaWYgdW5hdmFpbGFibGVcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmNsaWNrJykub2YoQGVsKVxuXHRcdFx0LnRvICgpPT4gQGRyb3Bkb3duLmxhc3RTZWxlY3RlZCA9IEBcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDptb3VzZWRvd24nKS5vZihAZWwpXG5cdFx0XHQudG8gKGV2ZW50KT0+IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6bW91c2VlbnRlcicpLm9mKEBlbClcblx0XHRcdC50byAoKT0+IEBkcm9wZG93bi5jdXJyZW50SGlnaGxpZ2h0ZWQgPSBAXG5cblxuXHR0b2dnbGU6IChuZXdWYWx1ZSwgdW5hdmFpbGFibGUpLT5cblx0XHRwcmV2U3RhdGUgPSBAc2VsZWN0ZWRcblx0XHRuZXdTdGF0ZSA9IGlmIElTLmRlZmluZWQobmV3VmFsdWUpIHRoZW4gbmV3VmFsdWUgZWxzZSAhQHNlbGVjdGVkXG5cblx0XHRpZiBub3QgbmV3U3RhdGVcblx0XHRcdGlmIEBkcm9wZG93bi5zZXR0aW5ncy5tdWx0aXBsZSBhbmQgcHJldlN0YXRlXG5cdFx0XHRcdEBzZWxlY3RlZCA9IG5ld1N0YXRlXG5cdFx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAZmllbGQuX3ZhbHVlLCBAKVxuXHRcdFx0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBzZWxlY3RlZCA9IG5ld1N0YXRlIGlmIElTLmRlZmluZWQobmV3VmFsdWUpXG5cdFx0XHRcdEBmaWVsZC5fdmFsdWUgPSBudWxsIGlmIHVuYXZhaWxhYmxlXG5cblx0XHRlbHNlXG5cdFx0XHRAc2VsZWN0ZWQgPSBuZXdTdGF0ZVxuXHRcdFx0aWYgQGZpZWxkLnNldHRpbmdzLm11bHRpcGxlXG5cdFx0XHRcdEBmaWVsZC5fdmFsdWUucHVzaChAKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlPy50b2dnbGUob2ZmKVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlID0gQFxuXG5cdFx0XHRAZmllbGQubGFzdFNlbGVjdGVkID0gQFxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IERyb3Bkb3duXG5tb2R1bGUuZXhwb3J0cy5DaG9pY2UgPSBDaG9pY2UiLCJTaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcbm1hc2tDb3JlID0gaW1wb3J0ICd0ZXh0LW1hc2stY29yZSdcbm1hc2tBZGRvbnMgPSBpbXBvcnQgJ3RleHQtbWFzay1hZGRvbnMnXG5leHRlbmQgPSBpbXBvcnQgJ3NtYXJ0LWV4dGVuZCdcbklTID0gaW1wb3J0ICcuLi9jaGVja3MnXG5SRUdFWCA9IGltcG9ydCAnLi4vY29uc3RhbnRzL3JlZ2V4J1xuaGVscGVycyA9IGltcG9ydCAnLi4vaGVscGVycydcbmRlZmF1bHRQYXR0ZXJuQ2hhcnMgPSBcblx0JzEnOiBSRUdFWC5udW1lcmljXG5cdCcjJzogUkVHRVgud2lkZW51bWVyaWNcblx0J2EnOiBSRUdFWC5sZXR0ZXJcblx0JyonOiBSRUdFWC5hbnlcblxuXG5jbGFzcyBNYXNrXG5cdGNvbnN0cnVjdG9yOiAoQGZpZWxkLCBAY29uZmlnKS0+XG5cdFx0QHZhbHVlID0gJydcblx0XHRAcHJldlZhbHVlID0gJydcblx0XHRAY3Vyc29yID0gMFxuXHRcdEBwcmV2Q3Vyc29yID0gMFxuXHRcdEBwYXR0ZXJuID0gQHBhdHRlcm5SYXcgPSBAY29uZmlnLnBhdHRlcm5cblx0XHRAcGF0dGVyblNldHRlciA9IEBjb25maWcuc2V0dGVyXG5cdFx0QHBsYWNlaG9sZGVyQ2hhciA9IEBjb25maWcucGxhY2Vob2xkZXJcblx0XHRAcGxhY2Vob2xkZXJSZWdleCA9IG5ldyBSZWdFeHAoJ1xcXFwnKyhAcGxhY2Vob2xkZXJDaGFyIG9yICdfJyksJ2cnKVxuXHRcdEBndWlkZSA9IEBjb25maWcuZ3VpZGVcblx0XHRAa2VlcENoYXJQb3NpdGlvbnMgPSBAY29uZmlnLmtlZXBDaGFyUG9zaXRpb25zXG5cdFx0QGNoYXJzID0gZXh0ZW5kLmNsb25lIGRlZmF1bHRQYXR0ZXJuQ2hhcnMsIEBjb25maWcuY3VzdG9tUGF0dGVybnNcblxuXHRcdEBzZXRQYXR0ZXJuKEBwYXR0ZXJuKVxuXG5cblx0Z2V0U3RhdGU6IChwYXR0ZXJuLCByYXdWYWx1ZSktPiB7XG5cdFx0cmF3VmFsdWUsIEBndWlkZSwgQHBsYWNlaG9sZGVyQ2hhciwgQGtlZXBDaGFyUG9zaXRpb25zLFxuXHRcdGN1cnJlbnRDYXJldFBvc2l0aW9uOiBpZiBAZmllbGQuZWwgdGhlbiBAZmllbGQuc2VsZWN0aW9uKCkuZW5kIGVsc2UgQGN1cnNvclxuXHRcdHByZXZpb3VzQ29uZm9ybWVkVmFsdWU6IEBwcmV2VmFsdWVcblx0XHRwbGFjZWhvbGRlcjogQGdldFBsYWNlaG9sZGVyKHBhdHRlcm4pXG5cdH1cblxuXHRnZXRQbGFjZWhvbGRlcjogKHBhdHRlcm4pLT5cblx0XHRpZiBJUy5mdW5jdGlvbihwYXR0ZXJuKVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cGxhY2Vob2xkZXIgPSAnJ1xuXHRcdFx0Zm9yIGNoYXIgaW4gcGF0dGVyblxuXHRcdFx0XHRpZiBJUy5yZWdleChjaGFyKVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyICs9IEBwbGFjZWhvbGRlckNoYXJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyICs9IGNoYXJcblxuXHRcdFx0cmV0dXJuIHBsYWNlaG9sZGVyXG5cblxuXHRyZXNvbHZlUGF0dGVybjogKHBhdHRlcm4sIGlucHV0LCBzdGF0ZSktPlxuXHRcdHBhdHRlcm4gPSBcblx0XHRcdGlmIHR5cGVvZiBwYXR0ZXJuIGlzICdmdW5jdGlvbidcblx0XHRcdFx0cGF0dGVybihpbnB1dCwgQGdldFN0YXRlKHBhdHRlcm4sIGlucHV0KSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0cGF0dGVyblxuXG5cdFx0b2Zmc2V0ID0gMFxuXHRcdHRyYXBJbmRleGVzID0gW11cblx0XHRjb3B5ID0gcGF0dGVybi5zbGljZSgpXG5cdFx0Zm9yIGNoYXIsaSBpbiBjb3B5IHdoZW4gY2hhciBpcyAnW10nXG5cdFx0XHR0cmFwSW5kZXhlcy5wdXNoKGktb2Zmc2V0KVxuXHRcdFx0cGF0dGVybi5zcGxpY2UoaS1vZmZzZXQsMSlcblx0XHRcdG9mZnNldCsrXG5cblx0XHRAcHJldlBhdHRlcm4gPSBAcmVzb2x2ZWRQYXR0ZXJuXG5cdFx0QHJlc29sdmVkUGF0dGVybiA9IHBhdHRlcm5cblx0XHRyZXR1cm4ge3BhdHRlcm4sIGNhcmV0VHJhcEluZGV4ZXM6dHJhcEluZGV4ZXN9XG5cblxuXHRzZXRQYXR0ZXJuOiAoc3RyaW5nLCB1cGRhdGVWYWx1ZT10cnVlLCB1cGRhdGVGaWVsZCktPlxuXHRcdEBwYXR0ZXJuUmF3ID0gc3RyaW5nXG5cdFx0QHBhdHRlcm4gPSBAcGFyc2VQYXR0ZXJuKHN0cmluZylcblx0XHRAdHJhbnNmb3JtID0gQHBhcnNlVHJhbnNmb3JtKHN0cmluZylcblxuXHRcdGlmIHVwZGF0ZVZhbHVlXG5cdFx0XHRAdmFsdWUgPSBAc2V0VmFsdWUoQHZhbHVlKVxuXHRcdFx0QGZpZWxkLnZhbHVlID0gQHZhbHVlIGlmIHVwZGF0ZUZpZWxkXG5cblxuXHRwYXJzZVBhdHRlcm46IChzdHJpbmcpLT4gc3dpdGNoXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ0VNQUlMJ1xuXHRcdFx0bWFza0FkZG9ucy5lbWFpbE1hc2subWFza1xuXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ1BIT05FJ1xuXHRcdFx0QHBhdHRlcm5TZXR0ZXIgPSAodmFsdWUpLT4gaGVscGVycy5yZXBlYXQoJyMnLCBNYXRoLm1heCA3LHZhbHVlLmxlbmd0aClcblx0XHRcdEBndWlkZSA9IGZhbHNlXG5cdFx0XHRyZXR1cm4gJyMnXG5cblx0XHR3aGVuIHN0cmluZyBpcyAnTkFNRSdcblx0XHRcdEBwYXR0ZXJuU2V0dGVyID0gKHZhbHVlKS0+XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShAcGxhY2Vob2xkZXJSZWdleCwgJycpLnRyaW0oKVxuXHRcdFx0XHRoZWxwZXJzLnJlcGVhdCgnYScsIE1hdGgubWF4IDIsdmFsdWUubGVuZ3RoKVxuXG5cdFx0XHRyZXR1cm4gJ2EnXG5cblx0XHR3aGVuIHN0cmluZyBpcyAnRlVMTE5BTUUnXG5cdFx0XHRAcGF0dGVyblNldHRlciA9ICh2YWx1ZSktPlxuXHRcdFx0XHRpZiB2YWx1ZVt2YWx1ZS5sZW5ndGgtMV0gaXMgJyAnIHRoZW4gdmFsdWUgKz0gJ3gnXG5cdFx0XHRcdHNwbGl0ID0gdmFsdWUucmVwbGFjZShAcGxhY2Vob2xkZXJSZWdleCwnJykudHJpbSgpLnNwbGl0KC9cXHMrLylcblx0XHRcdFx0cmV0dXJuIGlmIHNwbGl0Lmxlbmd0aCBpcyA0XG5cdFx0XHRcdHNwbGl0Lm1hcCgocGFydCktPiBoZWxwZXJzLnJlcGVhdCgnYScsIE1hdGgubWF4IDIscGFydC5sZW5ndGgpKS5qb2luKCcgJylcblx0XHRcdHJldHVybiAnYSdcblxuXHRcdHdoZW4gc3RyaW5nIGlzICdEQVRFJ1xuXHRcdFx0Wy9cXGQvLCAvXFxkLywgJy8nLCAvXFxkLywgL1xcZC8sICcvJywgL1xcZC8sIC9cXGQvLCAvXFxkLywgL1xcZC9dXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmdbMF0gaXMgJ0RBVEUnIGFuZCBJUy5zdHJpbmcoc3RyaW5nWzFdKVxuXHRcdFx0c3RyaW5nWzFdLnNwbGl0KCcnKS5tYXAoKGNoYXIpPT4gaWYgUkVHRVgubGV0dGVyLnRlc3QoY2hhcikgdGhlbiAvXFxkLyBlbHNlIGNoYXIpXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmcgaXMgJ05VTUJFUidcblx0XHRcdG1hc2tBZGRvbnMuY3JlYXRlTnVtYmVyTWFza1xuXHRcdFx0XHRwcmVmaXg6IEBjb25maWcucHJlZml4IG9yICcnXG5cdFx0XHRcdHN1ZmZpeDogQGNvbmZpZy5zdWZmaXggb3IgJydcblx0XHRcdFx0aW5jbHVkZVRob3VzYW5kc1NlcGFyYXRvcjogaWYgQGNvbmZpZy5zZXAgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRcdFx0dGhvdXNhbmRzU2VwYXJhdG9yU3ltYm9sOiBpZiBJUy5zdHJpbmcoQGNvbmZpZy5zZXApIHRoZW4gQGNvbmZpZy5zZXBcblx0XHRcdFx0YWxsb3dEZWNpbWFsOiBAY29uZmlnLmRlY2ltYWxcblx0XHRcdFx0ZGVjaW1hbExpbWl0OiBpZiBJUy5udW1iZXIoQGNvbmZpZy5kZWNpbWFsKSB0aGVuIEBjb25maWcuZGVjaW1hbFxuXHRcdFx0XHRpbnRlZ2VyTGltaXQ6IGlmIElTLm51bWJlcihAY29uZmlnLmxpbWl0KSB0aGVuIEBjb25maWcubGltaXRcblxuXHRcdHdoZW4gSVMuYXJyYXkoc3RyaW5nKVxuXHRcdFx0cmV0dXJuIHN0cmluZ1xuXG5cdFx0ZWxzZVxuXHRcdFx0cGF0dGVybiA9IFtdXG5cblx0XHRcdGZvciBjaGFyLGkgaW4gc3RyaW5nXG5cdFx0XHRcdGlmIGNoYXIgaXMgJ1xcXFwnXG5cdFx0XHRcdFx0ZXNjYXBlZCA9IHRydWVcblx0XHRcdFx0XHRjb250aW51ZVxuXHRcdFx0XHRcblx0XHRcdFx0cGF0dGVybi5wdXNoIGlmIGVzY2FwZWQgdGhlbiBjaGFyIGVsc2UgKEBjaGFyc1tjaGFyXSBvciBjaGFyKVxuXHRcdFx0XHRlc2NhcGVkID0gZmFsc2VcblxuXHRcdFx0cmV0dXJuIHBhdHRlcm5cblxuXG5cdHBhcnNlVHJhbnNmb3JtOiAoc3RyaW5nKS0+IHN3aXRjaFxuXHRcdHdoZW4gc3RyaW5nIGlzICdFTUFJTCdcblx0XHRcdG1hc2tBZGRvbnMuZW1haWxNYXNrLnBpcGVcblx0XHRcblx0XHR3aGVuIHN0cmluZyBpcyAnREFURSdcblx0XHRcdG1hc2tBZGRvbnMuY3JlYXRlQXV0b0NvcnJlY3RlZERhdGVQaXBlKCdtbS9kZC95eXl5Jylcblx0XHRcblx0XHR3aGVuIHN0cmluZ1swXSBpcyAnREFURScgYW5kIElTLnN0cmluZyhzdHJpbmdbMV0pXG5cdFx0XHRtYXNrQWRkb25zLmNyZWF0ZUF1dG9Db3JyZWN0ZWREYXRlUGlwZShzdHJpbmdbMV0pXG5cblx0XHR3aGVuIEBjb25maWcudHJhbnNmb3JtXG5cdFx0XHRAY29uZmlnLnRyYW5zZm9ybVxuXG5cblxuXHRzZXRWYWx1ZTogKGlucHV0KS0+XG5cdFx0aWYgQHBhdHRlcm5TZXR0ZXJcblx0XHRcdG5ld1BhdHRlcm4gPSBAcGF0dGVyblNldHRlcihpbnB1dCkgb3IgQHBhdHRlcm5cblx0XHRcdEBzZXRQYXR0ZXJuKG5ld1BhdHRlcm4sIGZhbHNlKSBpZiBuZXdQYXR0ZXJuIGlzbnQgQHBhdHRlcm5SYXcgYW5kIG5ld1BhdHRlcm4gaXNudCBAcGF0dGVyblxuXHRcdFxuXHRcdHtjYXJldFRyYXBJbmRleGVzLCBwYXR0ZXJufSA9IEByZXNvbHZlUGF0dGVybihAcGF0dGVybiwgaW5wdXQpXG5cdFx0cmV0dXJuIEB2YWx1ZSBpZiBwYXR0ZXJuIGlzIGZhbHNlXG5cblx0XHRAcHJldlZhbHVlID0gQHZhbHVlXG5cdFx0QHByZXZDdXJzb3IgPSBAY3Vyc29yXG5cdFx0c3RhdGUgPSBAZ2V0U3RhdGUocGF0dGVybiwgaW5wdXQpXG5cdFx0e2NvbmZvcm1lZFZhbHVlfSA9IG1hc2tDb3JlLmNvbmZvcm1Ub01hc2soaW5wdXQsIHBhdHRlcm4sIHN0YXRlKVxuXG5cdFx0dHJhbnNmb3JtZWQgPSBAdHJhbnNmb3JtKGNvbmZvcm1lZFZhbHVlLCBzdGF0ZSkgaWYgQHRyYW5zZm9ybVxuXHRcdGlmIHRyYW5zZm9ybWVkIGlzIGZhbHNlXG5cdFx0XHRyZXR1cm4gQHZhbHVlXG5cdFx0aWYgSVMuc3RyaW5nKHRyYW5zZm9ybWVkKVxuXHRcdFx0Y29uZm9ybWVkVmFsdWUgPSB0cmFuc2Zvcm1lZFxuXHRcdGVsc2UgaWYgSVMub2JqZWN0KHRyYW5zZm9ybWVkKVxuXHRcdFx0aW5kZXhlc09mUGlwZWRDaGFycyA9IHRyYW5zZm9ybWVkLmluZGV4ZXNPZlBpcGVkQ2hhcnNcblx0XHRcdGNvbmZvcm1lZFZhbHVlID0gdHJhbnNmb3JtZWQudmFsdWVcblxuXG5cdFx0QGN1cnNvciA9IG1hc2tDb3JlLmFkanVzdENhcmV0UG9zaXRpb24gZXh0ZW5kIHN0YXRlLCB7XG5cdFx0XHRpbmRleGVzT2ZQaXBlZENoYXJzLCBjYXJldFRyYXBJbmRleGVzLCBjb25mb3JtZWRWYWx1ZVxuXHRcdH1cblxuXHRcdHJldHVybiBAdmFsdWUgPSBjb25mb3JtZWRWYWx1ZVxuXG5cblx0dmFsaWRhdGU6IChpbnB1dCktPlxuXHRcdGlmIGlucHV0IGlzbnQgQHZhbHVlIGFuZCBAcGF0dGVyblNldHRlclxuXHRcdFx0cGF0dGVybiA9IEBwYXR0ZXJuU2V0dGVyKGlucHV0KSBvciBAcGF0dGVyblxuXHRcdGVsc2Vcblx0XHRcdHBhdHRlcm4gPSBAcmVzb2x2ZWRQYXR0ZXJuXG5cdFx0XHR7cGF0dGVybn0gPSBAcmVzb2x2ZVBhdHRlcm4oQHBhdHRlcm4sIGlucHV0KSBpZiBub3QgcGF0dGVyblxuXG5cdFx0cmV0dXJuIHRydWUgaWYgcGF0dGVybiBpcyBmYWxzZVxuXHRcdFxuXHRcdGZvciBjaGFyLGkgaW4gcGF0dGVyblxuXHRcdFx0c3dpdGNoXG5cdFx0XHRcdHdoZW4gbm90IGlucHV0W2ldXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0XHRcdHdoZW4gSVMucmVnZXgoY2hhcikgYW5kIG5vdCBjaGFyLnRlc3QoaW5wdXRbaV0pXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0XHRcdHdoZW4gSVMuc3RyaW5nKGNoYXIpIGFuZCBpbnB1dFtpXSBpc250IGNoYXJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdHJldHVybiB0cnVlXG5cblx0aXNFbXB0eTogKCktPlxuXHRcdGlucHV0ID0gQHZhbHVlXG5cdFx0cGF0dGVybiA9IEByZXNvbHZlZFBhdHRlcm5cblx0XHRpZiBub3QgcGF0dGVyblxuXHRcdFx0cGF0dGVybiA9IEBwYXR0ZXJuU2V0dGVyKGlucHV0KSBpZiBAcGF0dGVyblNldHRlclxuXHRcdFx0e3BhdHRlcm59ID0gQHJlc29sdmVQYXR0ZXJuKHBhdHRlcm4gb3IgQHBhdHRlcm4sIGlucHV0KVxuXHRcdFxuXHRcdHJldHVybiB0cnVlIGlmIGlucHV0IGlzIEBjb25maWcucHJlZml4IG9yIGlucHV0IGlzIEBjb25maWcuc3VmZml4XG5cblx0XHRmb3IgY2hhcixpIGluIHBhdHRlcm5cblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIG5vdCBpbnB1dFtpXVxuXHRcdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRcdHdoZW4gSVMucmVnZXgoY2hhcilcblx0XHRcdFx0XHRyZXR1cm4gIWNoYXIudGVzdChpbnB1dFtpXSlcblx0XHRyZXR1cm4gZmFsc2VcblxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYXNrIiwibW9kdWxlLmV4cG9ydHMgPSBrZXlDb2RlcyA9XG5cdGRlbGV0ZTogOFxuXHRlbnRlcjogMTNcblx0ZXNjOiAyN1xuXHRjdHJsOiAxN1xuXHRhbHQ6IDE4XG5cdHNoaWZ0OiAxNlxuXHRzdXBlcjogOTFcblx0c3VwZXIyOiA5M1xuXHR1cDogMzhcblx0bGVmdDogMzdcblx0cmlnaHQ6IDM5XG5cdGRvd246IDQwXG5cdGh5cGhlbjogNDVcblx0dW5kZXJzY29yZTogOTVcblx0cXVlc3Rpb246IDYzXG5cdGV4Y2xhbWF0aW9uOiAzM1xuXHRmcm9udHNsYXNoOiA0N1xuXHRiYWNrc2xhc2g6IDkyXG5cdGNvbW1hOiA0NFxuXHRwZXJpb2Q6IDQ2XG5cdHNwYWNlOiAzMlxuXG5cdGFueUFycm93OiAoY29kZSktPlxuXHRcdGNvZGUgaXMga2V5Q29kZXMudXAgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmRvd24gb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmxlZnQgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLnJpZ2h0XG5cdFxuXHRhbnlNb2RpZmllcjogKGNvZGUpLT5cblx0XHRjb2RlIGlzIGtleUNvZGVzLmN0cmwgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmFsdCBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMuc2hpZnQgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLnN1cGVyIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5zdXBlcjJcblx0XG5cdGFueUFscGhhOiAoY29kZSktPlxuXHRcdDk3IDw9IGNvZGUgPD0gMTIyIG9yXG5cdFx0NjUgPD0gY29kZSA8PSA5MFxuXG5cdGFueU51bWVyaWM6IChjb2RlKS0+XG5cdFx0NDggPD0gY29kZSA8PSA1N1xuXG5cblx0YW55QWxwaGFOdW1lcmljOiAoY29kZSktPlxuXHRcdGtleUNvZGVzLmFueUFscGhhKGNvZGUpIG9yXG5cdFx0a2V5Q29kZXMuYW55TnVtZXJpYyhjb2RlKVxuXG5cdGFueVByaW50YWJsZTogKGNvZGUpLT5cblx0XHRrZXlDb2Rlcy5hbnlBbHBoYShjb2RlKSBvclxuXHRcdGtleUNvZGVzLmFueU51bWVyaWMoY29kZSkgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmh5cGhlbiBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMudW5kZXJzY29yZSBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMucXVlc3Rpb24gb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmV4Y2xhbWF0aW9uIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5mcm9udHNsYXNoIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5iYWNrc2xhc2ggb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmNvbW1hIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5wZXJpb2Qgb3IgXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5zcGFjZVxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5DT0xPUlMgPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9jb2xvcnMnXG5DSEVDS01BUktfV0lEVEggPSAyNlxuXG5leHBvcnQgZGVmYXVsdCBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2ZpZWxkJ1xuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdHZlcnRpY2FsQWxpZ246ICd0b3AnXG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRmb250RmFtaWx5OiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuZm9udEZhbWlseVxuXHRcdFx0dGV4dEFsaWduOiAnbGVmdCdcblx0XHRcdCR2aXNpYmxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuXHRcdFx0JHNob3dFcnJvcjpcblx0XHRcdFx0YW5pbWF0aW9uOiAnMC4ycyBmaWVsZEVycm9yU2hha2UnXG5cblx0XHRbJ2Rpdidcblx0XHRcdHJlZjogJ2xhYmVsJ1xuXHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdHpJbmRleDogMVxuXHRcdFx0XHR0b3A6IChmaWVsZCktPiBAc3R5bGVQYXJzZWQoJ2ZvbnRTaXplJywgdHJ1ZSkgKiAwLjdcblx0XHRcdFx0bGVmdDogKGZpZWxkKS0+IGhlbHBlcnMuc2hvcnRoYW5kU2lkZVZhbHVlKGZpZWxkLnNldHRpbmdzLnBhZGRpbmcsICdsZWZ0JykgKyAoZmllbGQuZWwuY2hpbGQuaWNvbj8ud2lkdGggb3IgMClcblx0XHRcdFx0cGFkZGluZzogKGZpZWxkKS0+IFwiMCAje2ZpZWxkLnNldHRpbmdzLmlucHV0UGFkZGluZ31weFwiXG5cdFx0XHRcdGZvbnRGYW1pbHk6ICdpbmhlcml0J1xuXHRcdFx0XHRmb250U2l6ZTogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmxhYmVsU2l6ZSBvciBmaWVsZC5zZXR0aW5ncy5mb250U2l6ZSAqICgxMS8xNClcblx0XHRcdFx0Zm9udFdlaWdodDogNjAwXG5cdFx0XHRcdGxpbmVIZWlnaHQ6IDFcblx0XHRcdFx0Y29sb3I6IENPTE9SUy5ncmV5XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0dHJhbnNpdGlvbjogJ29wYWNpdHkgMC4ycywgY29sb3IgMC4ycydcblx0XHRcdFx0d2hpdGVTcGFjZTogJ25vd3JhcCdcblx0XHRcdFx0dXNlclNlbGVjdDogJ25vbmUnXG5cdFx0XHRcdGN1cnNvcjogJ2RlZmF1bHQnXG5cdFx0XHRcdHBvaW50ZXJFdmVudHM6ICdub25lJ1xuXHRcdFx0XHQkZmlsbGVkOiAkc2hvd0xhYmVsOlxuXHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0JGZvY3VzOlxuXHRcdFx0XHRcdGNvbG9yOiBDT0xPUlMub3JhbmdlXG5cdFx0XHRcdCRzaG93RXJyb3I6XG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5yZWRcblx0XHRdXG5cblx0XHRbJ2Rpdidcblx0XHRcdHJlZjogJ2lubmVyd3JhcCdcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0XHRoZWlnaHQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5oZWlnaHRcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAnd2hpdGUnXG5cdFx0XHRcdGJvcmRlcldpZHRoOiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuYm9yZGVyXG5cdFx0XHRcdGJvcmRlclN0eWxlOiAnc29saWQnXG5cdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMuZ3JleV9saWdodFxuXHRcdFx0XHRib3JkZXJSYWRpdXM6ICcycHgnXG5cdFx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRcdGZvbnRGYW1pbHk6ICdpbmhlcml0J1xuXHRcdFx0XHR0cmFuc2l0aW9uOiAnYm9yZGVyLWNvbG9yIDAuMnMnXG5cdFx0XHRcdCRmb2N1czpcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLm9yYW5nZVxuXHRcdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMucmVkXG5cdFx0XHRcdCRkaXNhYmxlZDpcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLmdyZXlfbGlnaHRcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5ncmV5X2xpZ2h0XG5cblx0XHRcdFsnaW5wdXQnXG5cdFx0XHRcdHJlZjogJ2lucHV0J1xuXHRcdFx0XHR0eXBlOiAndGV4dCdcblx0XHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0XHRcdHpJbmRleDogM1xuXHRcdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHRcdFx0dmVydGljYWxBbGlnbjogJ3RvcCdcblx0XHRcdFx0XHRoZWlnaHQ6ICgpLT4gQHBhcmVudC5zdHlsZVNhZmUoJ2hlaWdodCcsMSkgb3IgQHBhcmVudC5zdHlsZVNhZmUoJ2hlaWdodCcpXG5cdFx0XHRcdFx0d2lkdGg6IChmaWVsZCktPiBpZiBub3QgZmllbGQuc2V0dGluZ3MuYXV0b1dpZHRoXG5cdFx0XHRcdFx0XHRzdWJ0cmFjdCA9IDBcblx0XHRcdFx0XHRcdGlmIGljb25TaWJsaW5nID0gZmllbGQuZWwuY2hpbGQuaWNvblxuXHRcdFx0XHRcdFx0XHRzdWJ0cmFjdCArPSBpY29uU2libGluZy53aWR0aFxuXHRcdFx0XHRcdFx0aWYgaW5wdXRTaWJsaW5nID0gZmllbGQuZWwuY2hpbGRbZmllbGQuc2V0dGluZ3MuaW5wdXRTaWJsaW5nXVxuXHRcdFx0XHRcdFx0XHR3aWR0aCA9IGlucHV0U2libGluZy5zdHlsZVBhcnNlZCgnd2lkdGgnLDEpIG9yIDBcblx0XHRcdFx0XHRcdFx0cGFkZGluZyA9IGlucHV0U2libGluZy5zdHlsZVBhcnNlZCgncGFkZGluZycsMSkgb3IgMFxuXHRcdFx0XHRcdFx0XHRwYWRkaW5nTGVmdCA9IGlucHV0U2libGluZy5zdHlsZVBhcnNlZCgncGFkZGluZ0xlZnQnLDEpIG9yIHBhZGRpbmcgb3IgMFxuXHRcdFx0XHRcdFx0XHRwYWRkaW5nUmlnaHQgPSBpbnB1dFNpYmxpbmcuc3R5bGVQYXJzZWQoJ3BhZGRpbmdSaWdodCcsMSkgb3IgcGFkZGluZyBvciAwXG5cdFx0XHRcdFx0XHRcdHN1YnRyYWN0ICs9IHdpZHRoK3BhZGRpbmdMZWZ0K3BhZGRpbmdSaWdodFxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiY2FsYygxMDAlIC0gI3tzdWJ0cmFjdH1weClcIlxuXG5cdFx0XHRcdFx0cGFkZGluZzogKGZpZWxkKS0+XG5cdFx0XHRcdFx0XHRAcGFkZGluZyA/PSBNYXRoLm1heCAwLCBoZWxwZXJzLmNhbGNQYWRkaW5nKGZpZWxkLnNldHRpbmdzLmhlaWdodCwgMTQpLTNcblx0XHRcdFx0XHRcdHJldHVybiBcIiN7QHBhZGRpbmd9cHggI3tmaWVsZC5zZXR0aW5ncy5pbnB1dFBhZGRpbmd9cHhcIlxuXHRcdFx0XHRcblx0XHRcdFx0XHRtYXJnaW46ICcwJ1xuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xuXHRcdFx0XHRcdGFwcGVhcmFuY2U6ICdub25lJ1xuXHRcdFx0XHRcdGJvcmRlcjogJ25vbmUnXG5cdFx0XHRcdFx0b3V0bGluZTogJ25vbmUnXG5cdFx0XHRcdFx0Zm9udEZhbWlseTogJ2luaGVyaXQnXG5cdFx0XHRcdFx0Zm9udFNpemU6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5mb250U2l6ZVxuXHRcdFx0XHRcdGNvbG9yOiBDT0xPUlMuYmxhY2tcblx0XHRcdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0XHRcdGJveFNoYWRvdzogJ25vbmUnXG5cdFx0XHRcdFx0d2hpdGVTcGFjZTogJ25vd3JhcCdcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ2xpcDogJ2NvbnRlbnQtYm94JyAjIHNlbWktZml4IGZvciB5ZWxsb3cgYXV0b2ZpbGwgYmFja2dyb3VuZFxuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknXG5cdFx0XHRcdFx0dHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAwLjJzLCAtd2Via2l0LXRyYW5zZm9ybSAwLjJzJ1xuXHRcdFx0XHRcdCRkaXNhYmxlZDpcblx0XHRcdFx0XHRcdGN1cnNvcjogJ25vdC1hbGxvd2VkJ1xuXHRcdFx0XHRcdCRmaWxsZWQ6ICRzaG93TGFiZWw6XG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm06IChmaWVsZCktPlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQHRyYW5zbGF0aW9uIGlmIEB0cmFuc2xhdGlvbj8gb3Igbm90IChsYWJlbD1maWVsZC5lbC5jaGlsZC5sYWJlbCkgb3IgbGFiZWwuc3R5bGVTYWZlKCdwb3NpdGlvbicsMSkgaXNudCAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0XHRcdHRvdGFsSGVpZ2h0ID0gQHBhcmVudC5zdHlsZVBhcnNlZCgnaGVpZ2h0JywxKVxuXHRcdFx0XHRcdFx0XHR3b3JrYWJsZUhlaWdodCA9IHRvdGFsSGVpZ2h0IC0gKGxhYmVsLnN0eWxlUGFyc2VkKCdmb250U2l6ZScsMSkgKyBsYWJlbC5zdHlsZVBhcnNlZCgndG9wJywxKSoyKVxuXHRcdFx0XHRcdFx0XHR0cmFuc2xhdGlvbiA9IE1hdGgubWF4IDAsIE1hdGguZmxvb3IgKHRvdGFsSGVpZ2h0LXdvcmthYmxlSGVpZ2h0KS80XG5cdFx0XHRcdFx0XHRcdHJldHVybiBcInRyYW5zbGF0ZVkoI3t0cmFuc2xhdGlvbn1weClcIlxuXHRcdFx0XHRcdFxuXHRcdFx0XVxuXG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAncGxhY2Vob2xkZXInXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR6SW5kZXg6IDJcblx0XHRcdFx0XHR0b3A6ICcwcHgnXG5cdFx0XHRcdFx0bGVmdDogKGZpZWxkKS0+IGZpZWxkLmVsLmNoaWxkLmljb24/LndpZHRoIG9yIDBcblx0XHRcdFx0XHRmb250RmFtaWx5OiAoZmllbGQpLT4gZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVTYWZlKCdmb250RmFtaWx5JywxKVxuXHRcdFx0XHRcdGZvbnRTaXplOiAoZmllbGQpLT4gZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVTYWZlKCdmb250U2l6ZScsMSlcblx0XHRcdFx0XHRwYWRkaW5nOiAoZmllbGQpLT5cblx0XHRcdFx0XHRcdHZlcnRpID0gZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdUb3AnLDEpIG9yIGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlUGFyc2VkKCdwYWRkaW5nVG9wJylcblx0XHRcdFx0XHRcdGhvcml6ID0gZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdMZWZ0JywxKSBvciBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVBhcnNlZCgncGFkZGluZ0xlZnQnKVxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiI3t2ZXJ0aSszfXB4ICN7aG9yaXp9cHhcIlxuXG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5ibGFja1xuXHRcdFx0XHRcdG9wYWNpdHk6IDAuNVxuXHRcdFx0XHRcdHBvaW50ZXJFdmVudHM6ICdub25lJ1xuXHRcdFx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXHRcdFx0XHRcdHdoaXRlU3BhY2U6ICdub3dyYXAnXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSdcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDAuMnMsIC13ZWJraXQtdHJhbnNmb3JtIDAuMnMnXG5cdFx0XHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0XHRcdHZpc2liaWxpdHk6ICdoaWRkZW4nXG5cdFx0XHRcdFx0XHQkc2hvd0xhYmVsOlxuXHRcdFx0XHRcdFx0XHR0cmFuc2Zvcm06IChmaWVsZCktPiBmaWVsZC5lbC5jaGlsZC5pbnB1dC5yYXcuc3R5bGUudHJhbnNmb3JtXG5cdFx0XHRdXG5cdFx0XVxuXHRcdFxuXHRcdFsnZGl2J1xuXHRcdFx0cmVmOiAnaGVscCdcblx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHR0b3A6ICcxMTAlJ1xuXHRcdFx0XHRsZWZ0OiAoZmllbGQpLT4gaGVscGVycy5zaG9ydGhhbmRTaWRlVmFsdWUoZmllbGQuc2V0dGluZ3MucGFkZGluZywgJ2xlZnQnKVxuXHRcdFx0XHRmb250RmFtaWx5OiAnaW5oZXJpdCdcblx0XHRcdFx0Zm9udFNpemU6ICcxMXB4J1xuXHRcdFx0XHRjb2xvcjogQ09MT1JTLmdyZXlcblx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRcdCRzaG93RXJyb3I6XG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0JHNob3dIZWxwOlxuXHRcdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IGljb24gPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2ljb24nXG5cdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdHpJbmRleDogMlxuXHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHR3aWR0aDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmljb25TaXplXG5cdFx0XHRoZWlnaHQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZVxuXHRcdFx0Zm9udFNpemU6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZVxuXHRcdFx0cGFkZGluZ0xlZnQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pbnB1dFBhZGRpbmdcblx0XHRcdHBhZGRpbmdUb3A6IChmaWVsZCktPiBAcGFyZW50LnN0eWxlUGFyc2VkKCdoZWlnaHQnLDEpLzIgLSBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZS8yXG5cdFx0XHRsaW5lSGVpZ2h0OiAnMWVtJ1xuXHRcdFx0dXNlclNlbGVjdDogJ25vbmUnXG5cblx0XHRtZXRob2RzOlxuXHRcdFx0d2lkdGg6IGdldDogKCktPlxuXHRcdFx0XHRpZiBAX2luc2VydGVkXG5cdFx0XHRcdFx0QHJhdy5vZmZzZXRXaWR0aFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0QHN0eWxlUGFyc2VkKCd3aWR0aCcsMSkgb3IgQHJlbGF0ZWQuc2V0dGluZ3MuaWNvblNpemVcblx0XHRcdFx0IyBAc3R5bGVQYXJzZWQoJ3dpZHRoJywxKSBvciBAcmF3Lm9mZnNldFdpZHRoIG9yIEByZWxhdGVkLnNldHRpbmdzLmljb25TaXplIG9yIDBcblx0XVxuKVxuXG5cbmV4cG9ydCBjaGVja21hcmsgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2NoZWNrbWFyaydcblx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0ekluZGV4OiA0XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdHdpZHRoOiAyNlxuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdHBhZGRpbmdUb3A6ICgpLT4gQHBhcmVudC5zdHlsZVBhcnNlZCgnaGVpZ2h0JywxKS8yIC0gMTNcblx0XHRcdHBhZGRpbmdSaWdodDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmlucHV0UGFkZGluZ1xuXHRcdFx0dmVydGljYWxBbGlnbjogJ3RvcCdcblx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cblx0XHRbJ2Rpdidcblx0XHRcdHJlZjogJ2NoZWNrbWFya19pbm5lcndyYXAnXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0d2lkdGg6ICcyMHB4J1xuXHRcdFx0XHRoZWlnaHQ6ICcyMHB4J1xuXHRcdFx0XHRib3JkZXJSYWRpdXM6ICc1MCUnXG5cdFx0XHRcdGJvcmRlcldpZHRoOiAnM3B4J1xuXHRcdFx0XHRib3JkZXJTdHlsZTogJ3NvbGlkJ1xuXHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLmdyZWVuXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3NjYWxlKDAuOCknXG5cdFx0XHRcdCMgdHJhbnNmb3JtT3JpZ2luOiAnMTAwJSAwJ1xuXHRcdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMucmVkXG5cblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbWFzazEnXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR0b3A6ICctNHB4J1xuXHRcdFx0XHRcdGxlZnQ6ICctMTBweCdcblx0XHRcdFx0XHR3aWR0aDogJzE1cHgnXG5cdFx0XHRcdFx0aGVpZ2h0OiAnMzBweCdcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICczMHB4IDAgMCAzMHB4J1xuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogKGZpZWxkKS0+IGhlbHBlcnMuZGVmYXVsdENvbG9yIGZpZWxkLmVscy5pbm5lcndyYXAuc3R5bGVTYWZlKCdiYWNrZ3JvdW5kQ29sb3InLDEpLCAnd2hpdGUnXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG5cdFx0XHRcdFx0dHJhbnNmb3JtT3JpZ2luOiAnMTVweCAxNXB4IDAnXG5cdFx0XHRdXG5cdFx0XHRcblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbWFzazInXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR0b3A6ICctNXB4J1xuXHRcdFx0XHRcdGxlZnQ6ICc4cHgnXG5cdFx0XHRcdFx0d2lkdGg6ICcxNXB4J1xuXHRcdFx0XHRcdGhlaWdodDogJzMwcHgnXG5cdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnMCAzMHB4IDMwcHggMCdcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IChmaWVsZCktPiBoZWxwZXJzLmRlZmF1bHRDb2xvciBmaWVsZC5lbHMuaW5uZXJ3cmFwLnN0eWxlU2FmZSgnYmFja2dyb3VuZENvbG9yJywxKSwgJ3doaXRlJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybU9yaWdpbjogJzAgMTVweCAwJ1xuXHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRhbmltYXRpb246ICc0LjI1cyBlYXNlLWluIGNoZWNrbWFya1JvdGF0ZVBsYWNlaG9sZGVyJ1xuXHRcdFx0XHRcdFx0JGludmFsaWQ6XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJydcblx0XHRcdF1cblx0XHRcdFxuXHRcdFx0WydkaXYnXG5cdFx0XHRcdHJlZjogJ2NoZWNrbWFya19saW5lV3JhcHBlcidcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0JGZpbGxlZDogJGludmFsaWQ6XG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0XHRcdFx0ekluZGV4OiAyXG5cdFx0XHRcdFx0XHRhbmltYXRpb246ICcwLjU1cyBjaGVja21hcmtBbmltYXRlRXJyb3InXG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm1PcmlnaW46ICc1MCUgMTBweCdcblxuXHRcdFx0XHRbJ2Rpdidcblx0XHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbGluZVNob3J0J1xuXHRcdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdFx0dG9wOiAnMTBweCdcblx0XHRcdFx0XHRcdGxlZnQ6ICczcHgnXG5cdFx0XHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHRcdFx0XHR3aWR0aDogJzhweCdcblx0XHRcdFx0XHRcdGhlaWdodDogJzNweCdcblx0XHRcdFx0XHRcdGJvcmRlclJhZGl1czogJzJweCdcblx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQ09MT1JTLmdyZWVuXG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGUoNDVkZWcpJ1xuXHRcdFx0XHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnMC43NXMgY2hlY2ttYXJrQW5pbWF0ZVN1Y2Nlc3NUaXAnXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdCRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0XHRcdFx0bGVmdDogJzRweCdcblx0XHRcdFx0XHRcdFx0dG9wOiAnOHB4J1xuXHRcdFx0XHRcdFx0XHR3aWR0aDogJzEycHgnXG5cdFx0XHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnJ1xuXHRcdFx0XHRdXG5cblx0XHRcdFx0WydkaXYnXG5cdFx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX2xpbmVMb25nJ1xuXHRcdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdFx0dG9wOiAnOHB4J1xuXHRcdFx0XHRcdFx0cmlnaHQ6ICcycHgnXG5cdFx0XHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHRcdFx0XHR3aWR0aDogJzEycHgnXG5cdFx0XHRcdFx0XHRoZWlnaHQ6ICczcHgnXG5cdFx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICcycHgnXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5ncmVlblxuXHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG5cdFx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0XHRhbmltYXRpb246ICcwLjc1cyBjaGVja21hcmtBbmltYXRlU3VjY2Vzc0xvbmcnXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdCRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0XHRcdFx0dG9wOiAnOHB4J1xuXHRcdFx0XHRcdFx0XHRsZWZ0OiAnNHB4J1xuXHRcdFx0XHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnJ1xuXHRcdFx0XHRdXG5cdFx0XHRdXG5cdFx0XHRcblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfcGxhY2Vob2xkZXInXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0ekluZGV4OiAyXG5cdFx0XHRcdFx0dG9wOiAnLTRweCdcblx0XHRcdFx0XHRsZWZ0OiAnLTNweCdcblx0XHRcdFx0XHR3aWR0aDogJzIwcHgnXG5cdFx0XHRcdFx0aGVpZ2h0OiAnMjBweCdcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICc1MCUnXG5cdFx0XHRcdFx0Ym9yZGVyV2lkdGg6ICczcHgnXG5cdFx0XHRcdFx0Ym9yZGVyU3R5bGU6ICdzb2xpZCdcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogaGVscGVycy5oZXhUb1JHQkEoQ09MT1JTLmdyZWVuLCAwLjQpXG5cdFx0XHRcdFx0JGludmFsaWQ6XG5cdFx0XHRcdFx0XHRib3JkZXJDb2xvcjogaGVscGVycy5oZXhUb1JHQkEoQ09MT1JTLnJlZCwgMC40KVxuXHRcdFx0XVxuXHRcdFx0XG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX3BhdGNoJ1xuXHRcdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0ekluZGV4OiAxXG5cdFx0XHRcdFx0dG9wOiAnLTJweCdcblx0XHRcdFx0XHRsZWZ0OiAnNnB4J1xuXHRcdFx0XHRcdHdpZHRoOiAnNHB4J1xuXHRcdFx0XHRcdGhlaWdodDogJzI4cHgnXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAoZmllbGQpLT4gaGVscGVycy5kZWZhdWx0Q29sb3IgZmllbGQuZWxzLmlubmVyd3JhcC5zdHlsZVNhZmUoJ2JhY2tncm91bmRDb2xvcicsMSksICd3aGl0ZSdcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSdcblx0XHRcdF1cblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPVxuXHRwbGFjZWhvbGRlcjogdHJ1ZVxuXHR2YWxpZFdoZW5Jc0Nob2ljZTogZmFsc2Vcblx0dmFsaWRXaGVuUmVnZXg6IGZhbHNlXG5cdGF1dG9XaWR0aDogZmFsc2Vcblx0bWF4V2lkdGg6ICcxMDAlJ1xuXHRtaW5XaWR0aDogMlxuXHRoZWlnaHQ6IDQ2XG5cdGNoZWNrbWFyazogdHJ1ZVxuXHRrZXlib2FyZDogJ3RleHQnXG5cdGRyb3Bkb3duOiB7bG9ja1Njcm9sbDpmYWxzZX1cblx0Y2hvaWNlczogbnVsbFxuXHRtaW5MZW5ndGg6IG51bGxcblx0bWF4TGVuZ3RoOiBudWxsXG5cdGlucHV0U2libGluZzogJ2NoZWNrbWFyaydcblx0bWFzazpcblx0XHRwYXR0ZXJuOiBmYWxzZVxuXHRcdHBsYWNlaG9sZGVyOiAnXydcblx0XHRndWlkZTogdHJ1ZVxuXHRcdGN1c3RvbVBhdHRlcm5zOiBmYWxzZSIsImltcG9ydCB7SU1QT1JUQU5ULCBSRUdFWF9LRUJBQiwgUkVHRVhfU1BBQ0UsIFJFR0VYX0RJR0lUUywgUkVHRVhfTEVOX1ZBTCwgUE9TU0lCTEVfUFJFRklYRVMsIFJFUVVJUkVTX1VOSVRfVkFMVUV9IGZyb20gJy4vY29uc3RhbnRzJ1xuU0FNUExFX1NUWUxFID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jykuc3R5bGVcblxuZXhwb3J0IGluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPlxuXHR0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuZXhwb3J0IGlzSXRlcmFibGUgPSAodGFyZ2V0KS0+XG5cdHRhcmdldCBhbmRcblx0dHlwZW9mIHRhcmdldCBpcyAnb2JqZWN0JyBhbmRcblx0dHlwZW9mIHRhcmdldC5sZW5ndGggaXMgJ251bWJlcicgYW5kXG5cdG5vdCB0YXJnZXQubm9kZVR5cGVcblxuZXhwb3J0IHRvS2ViYWJDYXNlID0gKHN0cmluZyktPlxuXHRzdHJpbmcucmVwbGFjZSBSRUdFWF9LRUJBQiwgKGUsbGV0dGVyKS0+IFwiLSN7bGV0dGVyLnRvTG93ZXJDYXNlKCl9XCJcblxuZXhwb3J0IGlzUHJvcFN1cHBvcnRlZCA9IChwcm9wZXJ0eSktPlxuXHR0eXBlb2YgU0FNUExFX1NUWUxFW3Byb3BlcnR5XSBpc250ICd1bmRlZmluZWQnXG5cbmV4cG9ydCBpc1ZhbHVlU3VwcG9ydGVkID0gKHByb3BlcnR5LCB2YWx1ZSktPlxuXHRpZiB3aW5kb3cuQ1NTIGFuZCB3aW5kb3cuQ1NTLnN1cHBvcnRzXG5cdFx0cmV0dXJuIHdpbmRvdy5DU1Muc3VwcG9ydHMocHJvcGVydHksIHZhbHVlKVxuXHRlbHNlXG5cdFx0U0FNUExFX1NUWUxFW3Byb3BlcnR5XSA9IHZhbHVlXG5cdFx0cmV0dXJuIFNBTVBMRV9TVFlMRVtwcm9wZXJ0eV0gaXMgJycrdmFsdWVcblxuZXhwb3J0IGdldFByZWZpeCA9IChwcm9wZXJ0eSwgc2tpcEluaXRpYWxDaGVjayktPlxuXHRpZiBza2lwSW5pdGlhbENoZWNrIG9yIG5vdCBpc1Byb3BTdXBwb3J0ZWQocHJvcGVydHkpXG5cdFx0Zm9yIHByZWZpeCBpbiBQT1NTSUJMRV9QUkVGSVhFU1xuXHRcdFx0IyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuXHRcdFx0cmV0dXJuIFwiLSN7cHJlZml4fS1cIiBpZiBpc1Byb3BTdXBwb3J0ZWQoXCItI3twcmVmaXh9LSN7cHJvcGVydHl9XCIpXG5cdFxuXHRyZXR1cm4gJydcblxuZXhwb3J0IG5vcm1hbGl6ZVByb3BlcnR5ID0gKHByb3BlcnR5KS0+XHRcblx0cHJvcGVydHkgPSB0b0tlYmFiQ2FzZShwcm9wZXJ0eSlcblx0XG5cdGlmIGlzUHJvcFN1cHBvcnRlZChwcm9wZXJ0eSlcblx0XHRyZXR1cm4gcHJvcGVydHlcblx0ZWxzZVxuXHRcdHJldHVybiBcIiN7Z2V0UHJlZml4KHByb3BlcnR5LHRydWUpfSN7cHJvcGVydHl9XCJcblxuZXhwb3J0IG5vcm1hbGl6ZVZhbHVlID0gKHByb3BlcnR5LCB2YWx1ZSktPlxuXHRpZiBpbmNsdWRlcyhSRVFVSVJFU19VTklUX1ZBTFVFLCBwcm9wZXJ0eSkgYW5kIHZhbHVlIGlzbnQgbnVsbFxuXHRcdHZhbHVlID0gJycrdmFsdWVcblx0XHRpZiAgUkVHRVhfRElHSVRTLnRlc3QodmFsdWUpIGFuZFxuXHRcdFx0bm90IFJFR0VYX0xFTl9WQUwudGVzdCh2YWx1ZSkgYW5kXG5cdFx0XHRub3QgUkVHRVhfU1BBQ0UudGVzdCh2YWx1ZSlcblx0XHRcdFx0dmFsdWUgKz0gaWYgcHJvcGVydHkgaXMgJ2xpbmUtaGVpZ2h0JyB0aGVuICdlbScgZWxzZSAncHgnXG5cblx0cmV0dXJuIHZhbHVlXG5cblxuZXhwb3J0IHNvcnQgPSAoYXJyYXkpLT5cblx0aWYgYXJyYXkubGVuZ3RoIDwgMlxuXHRcdHJldHVybiBhcnJheVxuXHRlbHNlXG5cdFx0cGl2b3QgPSBhcnJheVswXTsgbGVzcyA9IFtdOyBncmVhdCA9IFtdOyBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPSAwO1xuXHRcdFxuXHRcdHdoaWxlICsraSBpc250IGxlblxuXHRcdFx0aWYgYXJyYXlbaV0gPD0gcGl2b3Rcblx0XHRcdFx0bGVzcy5wdXNoKGFycmF5W2ldKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRncmVhdC5wdXNoKGFycmF5W2ldKVxuXG5cdFx0cmV0dXJuIHNvcnQobGVzcykuY29uY2F0KHBpdm90LCBzb3J0KGdyZWF0KSlcblxuXG5leHBvcnQgaGFzaCA9IChzdHJpbmcpLT5cblx0aHNoID0gNTM4MTsgaSA9IC0xOyBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG5cdFxuXHR3aGlsZSArK2kgaXNudCBzdHJpbmcubGVuZ3RoXG5cdFx0aHNoID0gKChoc2ggPDwgNSkgLSBoc2gpICsgc3RyaW5nLmNoYXJDb2RlQXQoaSlcblx0XHRoc2ggfD0gMFxuXG5cdHJldHVybiAnXycrKGlmIGhzaCA8IDAgdGhlbiBoc2ggKiAtMiBlbHNlIGhzaClcblxuXG5leHBvcnQgcnVsZVRvU3RyaW5nID0gKHJ1bGUsIGltcG9ydGFudCktPlxuXHRvdXRwdXQgPSAnJ1xuXHRwcm9wcyA9IHNvcnQoT2JqZWN0LmtleXMocnVsZSkpXG5cdFxuXHRmb3IgcHJvcCBpbiBwcm9wc1xuXHRcdGlmIHR5cGVvZiBydWxlW3Byb3BdIGlzICdzdHJpbmcnIG9yIHR5cGVvZiBydWxlW3Byb3BdIGlzICdudW1iZXInXG5cdFx0XHRwcm9wZXJ0eSA9IG5vcm1hbGl6ZVByb3BlcnR5KHByb3ApXG5cdFx0XHR2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHByb3BlcnR5LCBydWxlW3Byb3BdKVxuXHRcdFx0dmFsdWUgKz0gXCIgIWltcG9ydGFudFwiIGlmIGltcG9ydGFudFxuXHRcdFx0b3V0cHV0ICs9IFwiI3twcm9wZXJ0eX06I3t2YWx1ZX07XCJcblx0XG5cdHJldHVybiBvdXRwdXRcblxuZXhwb3J0IGlubGluZVN0eWxlQ29uZmlnID0gc3R5bGVDb25maWcgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5leHBvcnQgaW5saW5lU3R5bGUgPSAocnVsZSwgdmFsdWVUb1N0b3JlLCBsZXZlbCktPlxuXHRpZiBub3QgY29uZmlnPXN0eWxlQ29uZmlnW2xldmVsXVxuXHRcdHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG5cdFx0c3R5bGVFbC5pZCA9IFwicXVpY2tjc3Mje2xldmVsIG9yICcnfVwiXG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKVxuXHRcdHN0eWxlQ29uZmlnW2xldmVsXSA9IGNvbmZpZyA9IGVsOnN0eWxlRWwsIGNvbnRlbnQ6JycsIGNhY2hlOk9iamVjdC5jcmVhdGUobnVsbClcblx0XG5cdHVubGVzcyBjb25maWcuY2FjaGVbcnVsZV1cblx0XHRjb25maWcuY2FjaGVbcnVsZV0gPSB2YWx1ZVRvU3RvcmUgb3IgdHJ1ZVxuXHRcdGNvbmZpZy5lbC50ZXh0Q29udGVudCA9IGNvbmZpZy5jb250ZW50ICs9IHJ1bGVcblx0XG5cdHJldHVyblxuXG5cbmV4cG9ydCBjbGVhcklubGluZVN0eWxlID0gKGxldmVsKS0+IGlmIGNvbmZpZyA9IHN0eWxlQ29uZmlnW2xldmVsXVxuXHRyZXR1cm4gaWYgbm90IGNvbmZpZy5jb250ZW50XG5cdGNvbmZpZy5lbC50ZXh0Q29udGVudCA9IGNvbmZpZy5jb250ZW50ID0gJydcblx0a2V5cyA9IE9iamVjdC5rZXlzKGNvbmZpZy5jYWNoZSlcblx0Y29uZmlnLmNhY2hlW2tleV0gPSBudWxsIGZvciBrZXkgaW4ga2V5c1xuXHRyZXR1cm5cblxuXG5cblxuXG4iLCJleHBvcnQgUkVHRVhfTEVOX1ZBTCA9IC9eXFxkKyg/OlthLXpdfFxcJSkrJC9pXG5leHBvcnQgUkVHRVhfRElHSVRTID0gL1xcZCskL1xuZXhwb3J0IFJFR0VYX1NQQUNFID0gL1xccy9cbmV4cG9ydCBSRUdFWF9LRUJBQiA9IC8oW0EtWl0pKy9nXG5leHBvcnQgSU1QT1JUQU5UID0gJ2ltcG9ydGFudCdcblxuZXhwb3J0IFBPU1NJQkxFX1BSRUZJWEVTID0gW1xuXHQnd2Via2l0J1xuXHQnbW96J1xuXHQnbXMnXG5cdCdvJ1xuXVxuZXhwb3J0IFJFUVVJUkVTX1VOSVRfVkFMVUUgPSBbXG5cdCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnXG5cdCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknXG5cdCdibG9jay1zaXplJ1xuXHQnYm9yZGVyLXdpZHRoJ1xuXHQnY29sdW1uUnVsZS13aWR0aCdcblx0J2N4J1xuXHQnY3knXG5cdCdmb250LXNpemUnXG5cdCdncmlkLWNvbHVtbi1nYXAnXG5cdCdncmlkLXJvdy1nYXAnXG5cdCdoZWlnaHQnXG5cdCdpbmxpbmUtc2l6ZSdcblx0J2xpbmUtaGVpZ2h0J1xuXHQnbWluQmxvY2stc2l6ZSdcblx0J21pbi1oZWlnaHQnXG5cdCdtaW4taW5saW5lLXNpemUnXG5cdCdtaW4td2lkdGgnXG5cdCdtYXgtaGVpZ2h0J1xuXHQnbWF4LXdpZHRoJ1xuXHQnb3V0bGluZS1vZmZzZXQnXG5cdCdvdXRsaW5lLXdpZHRoJ1xuXHQncGVyc3BlY3RpdmUnXG5cdCdzaGFwZS1tYXJnaW4nXG5cdCdzdHJva2UtZGFzaG9mZnNldCdcblx0J3N0cm9rZS13aWR0aCdcblx0J3RleHQtaW5kZW50J1xuXHQnd2lkdGgnXG5cdCd3b3JkLXNwYWNpbmcnXG5cdCd0b3AnXG5cdCdib3R0b20nXG5cdCdsZWZ0J1xuXHQncmlnaHQnXG5cdCd4J1xuXHQneSdcbl1cblxuZXhwb3J0IFFVQURfU0hPUlRIQU5EUyA9IFtcblx0J21hcmdpbidcblx0J3BhZGRpbmcnXG5cdCdib3JkZXInXG5cdCdib3JkZXItcmFkaXVzJ1xuXVxuZXhwb3J0IERJUkVDVElPTlMgPSBbJ3RvcCcsJ2JvdHRvbScsJ2xlZnQnLCdyaWdodCddXG5cblFVQURfU0hPUlRIQU5EUy5mb3JFYWNoIChwcm9wZXJ0eSktPlxuXHRSRVFVSVJFU19VTklUX1ZBTFVFLnB1c2ggcHJvcGVydHlcblx0Zm9yIGRpcmVjdGlvbiBpbiBESVJFQ1RJT05TXG5cdFx0UkVRVUlSRVNfVU5JVF9WQUxVRS5wdXNoIHByb3BlcnR5KyctJytkaXJlY3Rpb25cblx0cmV0dXJuXG5cblxuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID1cblx0ZGVmaW5lZDogKHN1YmplY3QpLT4gc3ViamVjdCBpc250IHVuZGVmaW5lZFxuXHRcblx0YXJyYXk6IChzdWJqZWN0KS0+IHN1YmplY3QgaW5zdGFuY2VvZiBBcnJheVxuXHRcblx0b2JqZWN0OiAoc3ViamVjdCktPiB0eXBlb2Ygc3ViamVjdCBpcyAnb2JqZWN0JyBhbmQgc3ViamVjdCAjIDJuZCBjaGVjayBpcyB0byB0ZXN0IGFnYWluc3QgJ251bGwnIHZhbHVlc1xuXG5cdG9iamVjdFBsYWluOiAoc3ViamVjdCktPiBleHBvcnRzLm9iamVjdChzdWJqZWN0KSBhbmQgT2JqZWN0Ojp0b1N0cmluZy5jYWxsKHN1YmplY3QpIGlzICdbb2JqZWN0IE9iamVjdF0nIGFuZCBzdWJqZWN0LmNvbnN0cnVjdG9yIGlzIE9iamVjdFxuXG5cdHN0cmluZzogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ3N0cmluZydcblx0XG5cdG51bWJlcjogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ251bWJlcicgYW5kIG5vdCBpc05hTihzdWJqZWN0KVxuXG5cdG51bWJlckxvb3NlOiAoc3ViamVjdCktPiBleHBvcnRzLm51bWJlcihzdWJqZWN0KSBvciBleHBvcnRzLnN0cmluZyhzdWJqZWN0KSBhbmQgZXhwb3J0cy5udW1iZXIoTnVtYmVyIHN1YmplY3QpXG5cdFxuXHRmdW5jdGlvbjogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ2Z1bmN0aW9uJ1xuXG5cdGl0ZXJhYmxlOiAoc3ViamVjdCktPiBleHBvcnRzLm9iamVjdChzdWJqZWN0KSBhbmQgZXhwb3J0cy5udW1iZXIoc3ViamVjdC5sZW5ndGgpIiwibW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gXG5cdGRvbURvYzogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5ub2RlVHlwZSBpcyA5XG5cblx0ZG9tRWw6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3Qubm9kZVR5cGUgaXMgMVxuXG5cdGRvbVRleHQ6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3Qubm9kZVR5cGUgaXMgM1xuXG5cdGRvbU5vZGU6IChzdWJqZWN0KS0+IGV4cG9ydHMuZG9tRWwoc3ViamVjdCkgb3IgZXhwb3J0cy5kb21UZXh0KHN1YmplY3QpXG5cblx0ZG9tVGV4dGFyZWE6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3Qubm9kZU5hbWUgaXMgJ1RFWFRBUkVBJ1xuXHRcblx0ZG9tSW5wdXQ6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3Qubm9kZU5hbWUgaXMgJ0lOUFVUJ1xuXHRcblx0ZG9tU2VsZWN0OiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0Lm5vZGVOYW1lIGlzICdTRUxFQ1QnXG5cdFxuXHRkb21GaWVsZDogKHN1YmplY3QpLT4gZXhwb3J0cy5kb21JbnB1dChzdWJqZWN0KSBvciBleHBvcnRzLmRvbVRleHRhcmVhKHN1YmplY3QpIG9yIGV4cG9ydHMuZG9tU2VsZWN0KHN1YmplY3QpIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblNWRyA9IGltcG9ydCAnLi4vLi4vc3ZnJ1xuaGVscGVycyA9IGltcG9ydCAnLi4vLi4vaGVscGVycydcblxuZXhwb3J0IGRlZmF1bHQgRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdkcm9wZG93bidcblx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0ekluZGV4OiAxMFxuXHRcdFx0b3ZlcmZsb3c6ICdoaWRkZW4nXG5cdFx0XHR0b3A6IChkcm9wZG93biktPiBpZiBkcm9wZG93bi5maWVsZC50eXBlIGlzICd0ZXh0JyB0aGVuIEBwYXJlbnQucmF3LnN0eWxlLmhlaWdodCBlbHNlICctN3B4J1xuXHRcdFx0bGVmdDogKCktPiBpZiBAcGFyZW50LnJlY3QubGVmdCAtIDUgPCAwIHRoZW4gMCBlbHNlIC01XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdCMgYmFja2dyb3VuZENvbG9yOiBoZWxwZXJzLmhleFRvUkdCQSgnZjZmNmY2JywgMC45KVxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAnI2Y2ZjZmNidcblx0XHRcdGJveFNoYWRvdzogXCIwcHggNnB4IDEwcHggI3toZWxwZXJzLmhleFRvUkdCQSgnMDAwMDAwJywgMC4zMil9XCJcblx0XHRcdGJvcmRlcldpZHRoOiAnMXB4J1xuXHRcdFx0Ym9yZGVyU3R5bGU6ICdzb2xpZCdcblx0XHRcdGJvcmRlckNvbG9yOiAnI2QxZDFkMSdcblx0XHRcdGJvcmRlclJhZGl1czogJzVweCdcblx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRwYWRkaW5nOiAnNHB4IDAnXG5cdFx0XHQkaXNPcGVuOiAkaGFzVmlzaWJsZUNob2ljZXM6XG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XVxuKVxuXG5leHBvcnQgbGlzdCA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnbGlzdCdcblx0XHRwYXNzU3RhdGVUb0NoaWxkcmVuOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdG92ZXJmbG93OiAnc2Nyb2xsJ1xuXHRcdFx0b3ZlcmZsb3dTY3JvbGxpbmc6ICd0b3VjaCdcblx0XHRcdG92ZXJmbG93U3R5bGU6ICctbXMtYXV0b2hpZGluZy1zY3JvbGxiYXInXG5cdF1cbilcblxuZXhwb3J0IGNob2ljZSA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0c3R5bGU6XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdGZvbnRTaXplOiAnMCdcblx0XHRcdGNvbG9yOiAnIzAwMDAwMCdcblx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXHRcdFx0bGluZUhlaWdodDogJzFlbSdcblx0XHRcdGN1cnNvcjogJ3BvaW50ZXInXG5cdFx0XHQkdmlzaWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0JHVuYXZhaWxhYmxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdCRob3Zlcjpcblx0XHRcdFx0Y29sb3I6ICcjZmZmZmZmJ1xuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjNEM5NkZGJ1xuXG5cdFx0WydkaXYnICMgQ2hlY2ttYXJrXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblx0XHRcdFx0dmVydGljYWxBbGlnbjondG9wJ1xuXHRcdFx0XHR3aWR0aDogJzIwcHgnXG5cdFx0XHRcdCMgaGVpZ2h0OiAoKS0+IEBwYXJlbnQucmF3LnN0eWxlLmhlaWdodFxuXHRcdFx0XHQjIGxpbmVIZWlnaHQ6ICgpLT4gQHBhcmVudC5zdHlsZSgnaGVpZ2h0Jylcblx0XHRcdFx0IyBmb250U2l6ZTogKCktPiBAcGFyZW50LnN0eWxlKCdoZWlnaHQnKVxuXHRcdFx0XHRsaW5lSGVpZ2h0OiAnMjBweCdcblx0XHRcdFx0Zm9udFNpemU6ICcxM3B4J1xuXHRcdFx0XHR0ZXh0QWxpZ246ICdjZW50ZXInXG5cdFx0XHRcdGNvbG9yOiAnaW5oZXJpdCdcblx0XHRcdFx0c3Ryb2tlOiAnY3VycmVudENvbG9yJ1xuXHRcdFx0XHR2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuXHRcdFx0XHQkc2VsZWN0ZWQ6XG5cdFx0XHRcdFx0dmlzaWJpbGl0eTogJ3Zpc2libGUnXG5cblx0XHRcdFNWRy5jaGVja21hcmtcblx0XHRdXG5cdFx0XG5cdFx0WydkaXYnICMgVGV4dFxuXHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHRcdG92ZXJmbG93OiAnaGlkZGVuJ1xuXHRcdFx0XHR0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcydcblx0XHRcdFx0d2hpdGVTcGFjZTogJ25vd3JhcCdcblx0XHRcdFx0d29yZFdyYXA6ICdub3JtYWwnXG5cdFx0XHRcdG1heFdpZHRoOiAoKS0+IFwiY2FsYygxMDAlIC0gI3tAcHJldi5zdHlsZVNhZmUgJ3dpZHRoJywgdHJ1ZX0pXCJcblx0XHRcdFx0cGFkZGluZ1JpZ2h0OiAnMTBweCdcblx0XHRcdFx0bGluZUhlaWdodDogJzIwcHgnXG5cdFx0XHRcdGZvbnRTaXplOiAnMTFweCdcblx0XHRcdFx0Zm9udEZhbWlseTogKGRyb3Bkb3duKS0+IGRyb3Bkb3duLnNldHRpbmdzLmZvbnRGYW1pbHlcblx0XHRcdFx0Y29sb3I6ICdpbmhlcml0J1xuXHRcdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdF1cblx0XVxuKVxuXG5leHBvcnQgc2Nyb2xsSW5kaWNhdG9yVXAgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ3Njcm9sbEluZGljYXRvclVwJ1xuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdHRvcDogMFxuXHRcdFx0bGVmdDogMFxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcyMHB4J1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAnI2Y2ZjZmNidcblx0XHRcdGNvbG9yOiAnIzAwMDAwMCdcblx0XHRcdHRleHRBbGlnbjogJ2NlbnRlcidcblx0XHRcdCR2aXNpYmxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cblx0XHRbJ2Rpdidcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHR0b3A6ICc1MCUnXG5cdFx0XHRcdGxlZnQ6IDBcblx0XHRcdFx0cmlnaHQ6IDBcblx0XHRcdFx0d2lkdGg6ICcxNXB4J1xuXHRcdFx0XHRoZWlnaHQ6ICcxNXB4J1xuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHRcdG1hcmdpbjogJzAgYXV0bydcblx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKSdcblx0XG5cdFx0XHRTVkcuY2FyZXRVcFxuXHRcdF1cblx0XVxuKVxuXG5leHBvcnQgc2Nyb2xsSW5kaWNhdG9yRG93biA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnc2Nyb2xsSW5kaWNhdG9yRG93bidcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRib3R0b206IDBcblx0XHRcdGxlZnQ6IDBcblx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMjBweCdcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNmNmY2ZjYnXG5cdFx0XHRjb2xvcjogJyMwMDAwMDAnXG5cdFx0XHR0ZXh0QWxpZ246ICdjZW50ZXInXG5cdFx0XHQkdmlzaWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXG5cdFx0WydkaXYnXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0dG9wOiAnNTAlJ1xuXHRcdFx0XHRsZWZ0OiAwXG5cdFx0XHRcdHJpZ2h0OiAwXG5cdFx0XHRcdHdpZHRoOiAnMTVweCdcblx0XHRcdFx0aGVpZ2h0OiAnMTVweCdcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0XHRtYXJnaW46ICcwIGF1dG8nXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknXG5cblx0XHRcdFNWRy5jYXJldERvd25cblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IGhlbHAgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2hlbHAnXG5cdFx0c3R5bGU6XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdGJvcmRlclRvcDogJzJweCBzb2xpZCByZ2JhKDAsMCwwLDAuMDUpJ1xuXHRcdFx0cGFkZGluZzogJzRweCAxMnB4IDFweCdcblx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwLjUpJ1xuXHRcdFx0Zm9udFdlaWdodDogJzUwMCdcblx0XHRcdGZvbnRTaXplOiAnMTFweCdcblx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXHRcdFx0JHNob3dIZWxwOlxuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdF1cbilcblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFxuXHRtYXhIZWlnaHQ6IDMwMFxuXHRtdWx0aXBsZTogZmFsc2Vcblx0bG9ja1Njcm9sbDogdHJ1ZVxuXHR0eXBlQnVmZmVyOiBmYWxzZVxuXHRoZWxwOiAnJ1xuXHR0ZW1wbGF0ZXM6IHt9IiwiIWZ1bmN0aW9uKGUscil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9cigpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW10scik6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/ZXhwb3J0cy50ZXh0TWFza0NvcmU9cigpOmUudGV4dE1hc2tDb3JlPXIoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtmdW5jdGlvbiByKG4pe2lmKHRbbl0pcmV0dXJuIHRbbl0uZXhwb3J0czt2YXIgbz10W25dPXtleHBvcnRzOnt9LGlkOm4sbG9hZGVkOiExfTtyZXR1cm4gZVtuXS5jYWxsKG8uZXhwb3J0cyxvLG8uZXhwb3J0cyxyKSxvLmxvYWRlZD0hMCxvLmV4cG9ydHN9dmFyIHQ9e307cmV0dXJuIHIubT1lLHIuYz10LHIucD1cIlwiLHIoMCl9KFtmdW5jdGlvbihlLHIsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG89dCgzKTtPYmplY3QuZGVmaW5lUHJvcGVydHkocixcImNvbmZvcm1Ub01hc2tcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbihvKS5kZWZhdWx0fX0pO3ZhciBpPXQoMik7T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJhZGp1c3RDYXJldFBvc2l0aW9uXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG4oaSkuZGVmYXVsdH19KTt2YXIgYT10KDUpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiY3JlYXRlVGV4dE1hc2tJbnB1dEVsZW1lbnRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbihhKS5kZWZhdWx0fX0pfSxmdW5jdGlvbihlLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHIucGxhY2Vob2xkZXJDaGFyPVwiX1wifSxmdW5jdGlvbihlLHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHQoZSl7dmFyIHI9ZS5wcmV2aW91c0NvbmZvcm1lZFZhbHVlLHQ9dm9pZCAwPT09cj9vOnIsaT1lLnByZXZpb3VzUGxhY2Vob2xkZXIsYT12b2lkIDA9PT1pP286aSx1PWUuY3VycmVudENhcmV0UG9zaXRpb24sbD12b2lkIDA9PT11PzA6dSxzPWUuY29uZm9ybWVkVmFsdWUsZj1lLnJhd1ZhbHVlLGQ9ZS5wbGFjZWhvbGRlckNoYXIsYz1lLnBsYWNlaG9sZGVyLHY9ZS5pbmRleGVzT2ZQaXBlZENoYXJzLHA9dm9pZCAwPT09dj9uOnYsaD1lLmNhcmV0VHJhcEluZGV4ZXMsZz12b2lkIDA9PT1oP246aDtpZigwPT09bClyZXR1cm4gMDt2YXIgbT1mLmxlbmd0aCx5PXQubGVuZ3RoLGI9Yy5sZW5ndGgsQz1zLmxlbmd0aCxQPW0teSx4PVA+MCxPPTA9PT15LGs9UD4xJiYheCYmIU87aWYoaylyZXR1cm4gbDt2YXIgaj14JiYodD09PXN8fHM9PT1jKSxNPTAsVD12b2lkIDAsdz12b2lkIDA7aWYoailNPWwtUDtlbHNle3ZhciBfPXMudG9Mb3dlckNhc2UoKSxWPWYudG9Mb3dlckNhc2UoKSxTPVYuc3Vic3RyKDAsbCkuc3BsaXQobyksTj1TLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gXy5pbmRleE9mKGUpIT09LTF9KTt3PU5bTi5sZW5ndGgtMV07dmFyIEU9YS5zdWJzdHIoMCxOLmxlbmd0aCkuc3BsaXQobykuZmlsdGVyKGZ1bmN0aW9uKGUpe3JldHVybiBlIT09ZH0pLmxlbmd0aCxBPWMuc3Vic3RyKDAsTi5sZW5ndGgpLnNwbGl0KG8pLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZSE9PWR9KS5sZW5ndGgsUj1BIT09RSxJPXZvaWQgMCE9PWFbTi5sZW5ndGgtMV0mJnZvaWQgMCE9PWNbTi5sZW5ndGgtMl0mJmFbTi5sZW5ndGgtMV0hPT1kJiZhW04ubGVuZ3RoLTFdIT09Y1tOLmxlbmd0aC0xXSYmYVtOLmxlbmd0aC0xXT09PWNbTi5sZW5ndGgtMl07IXgmJihSfHxJKSYmRT4wJiZjLmluZGV4T2Yodyk+LTEmJnZvaWQgMCE9PWZbbF0mJihUPSEwLHc9ZltsXSk7Zm9yKHZhciBKPXAubWFwKGZ1bmN0aW9uKGUpe3JldHVybiBfW2VdfSkscT1KLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZT09PXd9KS5sZW5ndGgsRj1OLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZT09PXd9KS5sZW5ndGgsTD1jLnN1YnN0cigwLGMuaW5kZXhPZihkKSkuc3BsaXQobykuZmlsdGVyKGZ1bmN0aW9uKGUscil7cmV0dXJuIGU9PT13JiZmW3JdIT09ZX0pLmxlbmd0aCxXPUwrRitxKyhUPzE6MCksej0wLEI9MDtCPEM7QisrKXt2YXIgRD1fW0JdO2lmKE09QisxLEQ9PT13JiZ6Kyssej49VylicmVha319aWYoeCl7Zm9yKHZhciBHPU0sSD1NO0g8PWI7SCsrKWlmKGNbSF09PT1kJiYoRz1IKSxjW0hdPT09ZHx8Zy5pbmRleE9mKEgpIT09LTF8fEg9PT1iKXJldHVybiBHfWVsc2UgaWYoVCl7Zm9yKHZhciBLPU0tMTtLPj0wO0stLSlpZihzW0tdPT09d3x8Zy5pbmRleE9mKEspIT09LTF8fDA9PT1LKXJldHVybiBLfWVsc2UgZm9yKHZhciBRPU07UT49MDtRLS0paWYoY1tRLTFdPT09ZHx8Zy5pbmRleE9mKFEpIT09LTF8fDA9PT1RKXJldHVybiBRfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHIuZGVmYXVsdD10O3ZhciBuPVtdLG89XCJcIn0sZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06YSxyPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTphLHQ9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOnt9LG49dC5ndWlkZSx1PXZvaWQgMD09PW58fG4sbD10LnByZXZpb3VzQ29uZm9ybWVkVmFsdWUscz12b2lkIDA9PT1sP2E6bCxmPXQucGxhY2Vob2xkZXJDaGFyLGQ9dm9pZCAwPT09Zj9pLnBsYWNlaG9sZGVyQ2hhcjpmLGM9dC5wbGFjZWhvbGRlcix2PXZvaWQgMD09PWM/KDAsby5jb252ZXJ0TWFza1RvUGxhY2Vob2xkZXIpKHIsZCk6YyxwPXQuY3VycmVudENhcmV0UG9zaXRpb24saD10LmtlZXBDaGFyUG9zaXRpb25zLGc9dT09PSExJiZ2b2lkIDAhPT1zLG09ZS5sZW5ndGgseT1zLmxlbmd0aCxiPXYubGVuZ3RoLEM9ci5sZW5ndGgsUD1tLXkseD1QPjAsTz1wKyh4Py1QOjApLGs9TytNYXRoLmFicyhQKTtpZihoPT09ITAmJiF4KXtmb3IodmFyIGo9YSxNPU87TTxrO00rKyl2W01dPT09ZCYmKGorPWQpO2U9ZS5zbGljZSgwLE8pK2orZS5zbGljZShPLG0pfWZvcih2YXIgVD1lLnNwbGl0KGEpLm1hcChmdW5jdGlvbihlLHIpe3JldHVybntjaGFyOmUsaXNOZXc6cj49TyYmcjxrfX0pLHc9bS0xO3c+PTA7dy0tKXt2YXIgXz1UW3ddLmNoYXI7aWYoXyE9PWQpe3ZhciBWPXc+PU8mJnk9PT1DO189PT12W1Y/dy1QOnddJiZULnNwbGljZSh3LDEpfX12YXIgUz1hLE49ITE7ZTpmb3IodmFyIEU9MDtFPGI7RSsrKXt2YXIgQT12W0VdO2lmKEE9PT1kKXtpZihULmxlbmd0aD4wKWZvcig7VC5sZW5ndGg+MDspe3ZhciBSPVQuc2hpZnQoKSxJPVIuY2hhcixKPVIuaXNOZXc7aWYoST09PWQmJmchPT0hMCl7Uys9ZDtjb250aW51ZSBlfWlmKHJbRV0udGVzdChJKSl7aWYoaD09PSEwJiZKIT09ITEmJnMhPT1hJiZ1IT09ITEmJngpe2Zvcih2YXIgcT1ULmxlbmd0aCxGPW51bGwsTD0wO0w8cTtMKyspe3ZhciBXPVRbTF07aWYoVy5jaGFyIT09ZCYmVy5pc05ldz09PSExKWJyZWFrO2lmKFcuY2hhcj09PWQpe0Y9TDticmVha319bnVsbCE9PUY/KFMrPUksVC5zcGxpY2UoRiwxKSk6RS0tfWVsc2UgUys9STtjb250aW51ZSBlfU49ITB9Zz09PSExJiYoUys9di5zdWJzdHIoRSxiKSk7YnJlYWt9Uys9QX1pZihnJiZ4PT09ITEpe2Zvcih2YXIgej1udWxsLEI9MDtCPFMubGVuZ3RoO0IrKyl2W0JdPT09ZCYmKHo9Qik7Uz1udWxsIT09ej9TLnN1YnN0cigwLHorMSk6YX1yZXR1cm57Y29uZm9ybWVkVmFsdWU6UyxtZXRhOntzb21lQ2hhcnNSZWplY3RlZDpOfX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksci5kZWZhdWx0PW47dmFyIG89dCg0KSxpPXQoMSksYT1cIlwifSxmdW5jdGlvbihlLHIsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpsLHI9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOnUucGxhY2Vob2xkZXJDaGFyO2lmKGUuaW5kZXhPZihyKSE9PS0xKXRocm93IG5ldyBFcnJvcihcIlBsYWNlaG9sZGVyIGNoYXJhY3RlciBtdXN0IG5vdCBiZSB1c2VkIGFzIHBhcnQgb2YgdGhlIG1hc2suIFBsZWFzZSBzcGVjaWZ5IGEgY2hhcmFjdGVyIHRoYXQgaXMgbm90IHByZXNlbnQgaW4geW91ciBtYXNrIGFzIHlvdXIgcGxhY2Vob2xkZXIgY2hhcmFjdGVyLlxcblxcblwiKyhcIlRoZSBwbGFjZWhvbGRlciBjaGFyYWN0ZXIgdGhhdCB3YXMgcmVjZWl2ZWQgaXM6IFwiK0pTT04uc3RyaW5naWZ5KHIpK1wiXFxuXFxuXCIpKyhcIlRoZSBtYXNrIHRoYXQgd2FzIHJlY2VpdmVkIGlzOiBcIitKU09OLnN0cmluZ2lmeShlKSkpO3JldHVybiBlLm1hcChmdW5jdGlvbihlKXtyZXR1cm4gZSBpbnN0YW5jZW9mIFJlZ0V4cD9yOmV9KS5qb2luKFwiXCIpfWZ1bmN0aW9uIG8oZSl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGV8fGUgaW5zdGFuY2VvZiBTdHJpbmd9ZnVuY3Rpb24gaShlKXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgZSYmdm9pZCAwPT09ZS5sZW5ndGgmJiFpc05hTihlKX1mdW5jdGlvbiBhKGUpe2Zvcih2YXIgcj1bXSx0PXZvaWQgMDt0PWUuaW5kZXhPZihzKSx0IT09LTE7KXIucHVzaCh0KSxlLnNwbGljZSh0LDEpO3JldHVybnttYXNrV2l0aG91dENhcmV0VHJhcHM6ZSxpbmRleGVzOnJ9fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHIuY29udmVydE1hc2tUb1BsYWNlaG9sZGVyPW4sci5pc1N0cmluZz1vLHIuaXNOdW1iZXI9aSxyLnByb2Nlc3NDYXJldFRyYXBzPWE7dmFyIHU9dCgxKSxsPVtdLHM9XCJbXVwifSxmdW5jdGlvbihlLHIsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZX19ZnVuY3Rpb24gbyhlKXt2YXIgcj17cHJldmlvdXNDb25mb3JtZWRWYWx1ZTp2b2lkIDAscHJldmlvdXNQbGFjZWhvbGRlcjp2b2lkIDB9O3JldHVybntzdGF0ZTpyLHVwZGF0ZTpmdW5jdGlvbih0KXt2YXIgbj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06ZSxvPW4uaW5wdXRFbGVtZW50LHM9bi5tYXNrLGQ9bi5ndWlkZSxtPW4ucGlwZSxiPW4ucGxhY2Vob2xkZXJDaGFyLEM9dm9pZCAwPT09Yj9wLnBsYWNlaG9sZGVyQ2hhcjpiLFA9bi5rZWVwQ2hhclBvc2l0aW9ucyx4PXZvaWQgMCE9PVAmJlAsTz1uLnNob3dNYXNrLGs9dm9pZCAwIT09TyYmTztpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgdCYmKHQ9by52YWx1ZSksdCE9PXIucHJldmlvdXNDb25mb3JtZWRWYWx1ZSl7KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBzP1widW5kZWZpbmVkXCI6bChzKSk9PT15JiZ2b2lkIDAhPT1zLnBpcGUmJnZvaWQgMCE9PXMubWFzayYmKG09cy5waXBlLHM9cy5tYXNrKTt2YXIgaj12b2lkIDAsTT12b2lkIDA7aWYocyBpbnN0YW5jZW9mIEFycmF5JiYoaj0oMCx2LmNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcikocyxDKSkscyE9PSExKXt2YXIgVD1hKHQpLHc9by5zZWxlY3Rpb25FbmQsXz1yLnByZXZpb3VzQ29uZm9ybWVkVmFsdWUsVj1yLnByZXZpb3VzUGxhY2Vob2xkZXIsUz12b2lkIDA7aWYoKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBzP1widW5kZWZpbmVkXCI6bChzKSk9PT1oKXtpZihNPXMoVCx7Y3VycmVudENhcmV0UG9zaXRpb246dyxwcmV2aW91c0NvbmZvcm1lZFZhbHVlOl8scGxhY2Vob2xkZXJDaGFyOkN9KSxNPT09ITEpcmV0dXJuO3ZhciBOPSgwLHYucHJvY2Vzc0NhcmV0VHJhcHMpKE0pLEU9Ti5tYXNrV2l0aG91dENhcmV0VHJhcHMsQT1OLmluZGV4ZXM7TT1FLFM9QSxqPSgwLHYuY29udmVydE1hc2tUb1BsYWNlaG9sZGVyKShNLEMpfWVsc2UgTT1zO3ZhciBSPXtwcmV2aW91c0NvbmZvcm1lZFZhbHVlOl8sZ3VpZGU6ZCxwbGFjZWhvbGRlckNoYXI6QyxwaXBlOm0scGxhY2Vob2xkZXI6aixjdXJyZW50Q2FyZXRQb3NpdGlvbjp3LGtlZXBDaGFyUG9zaXRpb25zOnh9LEk9KDAsYy5kZWZhdWx0KShULE0sUiksSj1JLmNvbmZvcm1lZFZhbHVlLHE9KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBtP1widW5kZWZpbmVkXCI6bChtKSk9PT1oLEY9e307cSYmKEY9bShKLHUoe3Jhd1ZhbHVlOlR9LFIpKSxGPT09ITE/Rj17dmFsdWU6XyxyZWplY3RlZDohMH06KDAsdi5pc1N0cmluZykoRikmJihGPXt2YWx1ZTpGfSkpO3ZhciBMPXE/Ri52YWx1ZTpKLFc9KDAsZi5kZWZhdWx0KSh7cHJldmlvdXNDb25mb3JtZWRWYWx1ZTpfLHByZXZpb3VzUGxhY2Vob2xkZXI6Vixjb25mb3JtZWRWYWx1ZTpMLHBsYWNlaG9sZGVyOmoscmF3VmFsdWU6VCxjdXJyZW50Q2FyZXRQb3NpdGlvbjp3LHBsYWNlaG9sZGVyQ2hhcjpDLGluZGV4ZXNPZlBpcGVkQ2hhcnM6Ri5pbmRleGVzT2ZQaXBlZENoYXJzLGNhcmV0VHJhcEluZGV4ZXM6U30pLHo9TD09PWomJjA9PT1XLEI9az9qOmcsRD16P0I6TDtyLnByZXZpb3VzQ29uZm9ybWVkVmFsdWU9RCxyLnByZXZpb3VzUGxhY2Vob2xkZXI9aixvLnZhbHVlIT09RCYmKG8udmFsdWU9RCxpKG8sVykpfX19fX1mdW5jdGlvbiBpKGUscil7ZG9jdW1lbnQuYWN0aXZlRWxlbWVudD09PWUmJihiP0MoZnVuY3Rpb24oKXtyZXR1cm4gZS5zZXRTZWxlY3Rpb25SYW5nZShyLHIsbSl9LDApOmUuc2V0U2VsZWN0aW9uUmFuZ2UocixyLG0pKX1mdW5jdGlvbiBhKGUpe2lmKCgwLHYuaXNTdHJpbmcpKGUpKXJldHVybiBlO2lmKCgwLHYuaXNOdW1iZXIpKGUpKXJldHVybiBTdHJpbmcoZSk7aWYodm9pZCAwPT09ZXx8bnVsbD09PWUpcmV0dXJuIGc7dGhyb3cgbmV3IEVycm9yKFwiVGhlICd2YWx1ZScgcHJvdmlkZWQgdG8gVGV4dCBNYXNrIG5lZWRzIHRvIGJlIGEgc3RyaW5nIG9yIGEgbnVtYmVyLiBUaGUgdmFsdWUgcmVjZWl2ZWQgd2FzOlxcblxcbiBcIitKU09OLnN0cmluZ2lmeShlKSl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHU9T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24oZSl7Zm9yKHZhciByPTE7cjxhcmd1bWVudHMubGVuZ3RoO3IrKyl7dmFyIHQ9YXJndW1lbnRzW3JdO2Zvcih2YXIgbiBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pJiYoZVtuXT10W25dKX1yZXR1cm4gZX0sbD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24oZSl7cmV0dXJuIHR5cGVvZiBlfTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiBlfTtyLmRlZmF1bHQ9bzt2YXIgcz10KDIpLGY9bihzKSxkPXQoMyksYz1uKGQpLHY9dCg0KSxwPXQoMSksaD1cImZ1bmN0aW9uXCIsZz1cIlwiLG09XCJub25lXCIseT1cIm9iamVjdFwiLGI9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG5hdmlnYXRvciYmL0FuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLEM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZT9yZXF1ZXN0QW5pbWF0aW9uRnJhbWU6c2V0VGltZW91dH1dKX0pOyIsIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXQoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLHQpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMudGV4dE1hc2tBZGRvbnM9dCgpOmUudGV4dE1hc2tBZGRvbnM9dCgpfSh0aGlzLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQocil7aWYobltyXSlyZXR1cm4gbltyXS5leHBvcnRzO3ZhciBvPW5bcl09e2V4cG9ydHM6e30saWQ6cixsb2FkZWQ6ITF9O3JldHVybiBlW3JdLmNhbGwoby5leHBvcnRzLG8sby5leHBvcnRzLHQpLG8ubG9hZGVkPSEwLG8uZXhwb3J0c312YXIgbj17fTtyZXR1cm4gdC5tPWUsdC5jPW4sdC5wPVwiXCIsdCgwKX0oW2Z1bmN0aW9uKGUsdCxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKGUpe3JldHVybiBlJiZlLl9fZXNNb2R1bGU/ZTp7ZGVmYXVsdDplfX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbz1uKDEpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiY3JlYXRlQXV0b0NvcnJlY3RlZERhdGVQaXBlXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHIobykuZGVmYXVsdH19KTt2YXIgaT1uKDIpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiY3JlYXRlTnVtYmVyTWFza1wiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiByKGkpLmRlZmF1bHR9fSk7dmFyIHU9bigzKTtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcImVtYWlsTWFza1wiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiByKHUpLmRlZmF1bHR9fSl9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpcIm1tIGRkIHl5eXlcIjtyZXR1cm4gZnVuY3Rpb24odCl7dmFyIG49W10scj1lLnNwbGl0KC9bXmRteV0rLyksbz17ZGQ6MzEsbW06MTIseXk6OTkseXl5eTo5OTk5fSxpPXtkZDoxLG1tOjEseXk6MCx5eXl5OjF9LHU9dC5zcGxpdChcIlwiKTtyLmZvckVhY2goZnVuY3Rpb24odCl7dmFyIHI9ZS5pbmRleE9mKHQpLGk9cGFyc2VJbnQob1t0XS50b1N0cmluZygpLnN1YnN0cigwLDEpLDEwKTtwYXJzZUludCh1W3JdLDEwKT5pJiYodVtyKzFdPXVbcl0sdVtyXT0wLG4ucHVzaChyKSl9KTt2YXIgYz1yLnNvbWUoZnVuY3Rpb24obil7dmFyIHI9ZS5pbmRleE9mKG4pLHU9bi5sZW5ndGgsYz10LnN1YnN0cihyLHUpLnJlcGxhY2UoL1xcRC9nLFwiXCIpLGw9cGFyc2VJbnQoYywxMCk7cmV0dXJuIGw+b1tuXXx8Yy5sZW5ndGg9PT11JiZsPGlbbl19KTtyZXR1cm4hYyYme3ZhbHVlOnUuam9pbihcIlwiKSxpbmRleGVzT2ZQaXBlZENoYXJzOm59fX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0LmRlZmF1bHQ9bn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKCl7ZnVuY3Rpb24gZSgpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpjLHQ9ZS5sZW5ndGg7aWYoZT09PWN8fGVbMF09PT1oWzBdJiYxPT09dClyZXR1cm4gaC5zcGxpdChjKS5jb25jYXQoW3ZdKS5jb25jYXQobS5zcGxpdChjKSk7aWYoZT09PVMmJk0pcmV0dXJuIGguc3BsaXQoYykuY29uY2F0KFtcIjBcIixTLHZdKS5jb25jYXQobS5zcGxpdChjKSk7dmFyIG49ZS5sYXN0SW5kZXhPZihTKSx1PW4hPT0tMSxsPWVbMF09PT1zJiZJLGE9dm9pZCAwLGc9dm9pZCAwLGI9dm9pZCAwO2lmKGUuc2xpY2UoViotMSk9PT1tJiYoZT1lLnNsaWNlKDAsViotMSkpLHUmJihNfHxEKT8oYT1lLnNsaWNlKGUuc2xpY2UoMCwkKT09PWg/JDowLG4pLGc9ZS5zbGljZShuKzEsdCksZz1yKGcucmVwbGFjZShmLGMpKSk6YT1lLnNsaWNlKDAsJCk9PT1oP2Uuc2xpY2UoJCk6ZSxOJiYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIE4/XCJ1bmRlZmluZWRcIjppKE4pKT09PXApe3ZhciBPPVwiLlwiPT09Xz9cIlsuXVwiOlwiXCIrXyxqPShhLm1hdGNoKG5ldyBSZWdFeHAoTyxcImdcIikpfHxbXSkubGVuZ3RoO2E9YS5zbGljZSgwLE4raipxKX1yZXR1cm4gYT1hLnJlcGxhY2UoZixjKSxBfHwoYT1hLnJlcGxhY2UoL14wKygwJHxbXjBdKS8sXCIkMVwiKSksYT14P28oYSxfKTphLGI9cihhKSwodSYmTXx8RD09PSEwKSYmKGVbbi0xXSE9PVMmJmIucHVzaCh5KSxiLnB1c2goUyx5KSxnJiYoKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBDP1widW5kZWZpbmVkXCI6aShDKSk9PT1wJiYoZz1nLnNsaWNlKDAsQykpLGI9Yi5jb25jYXQoZykpLEQ9PT0hMCYmZVtuLTFdPT09UyYmYi5wdXNoKHYpKSwkPjAmJihiPWguc3BsaXQoYykuY29uY2F0KGIpKSxsJiYoYi5sZW5ndGg9PT0kJiZiLnB1c2godiksYj1bZF0uY29uY2F0KGIpKSxtLmxlbmd0aD4wJiYoYj1iLmNvbmNhdChtLnNwbGl0KGMpKSksYn12YXIgdD1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06e30sbj10LnByZWZpeCxoPXZvaWQgMD09PW4/dTpuLGc9dC5zdWZmaXgsbT12b2lkIDA9PT1nP2M6ZyxiPXQuaW5jbHVkZVRob3VzYW5kc1NlcGFyYXRvcix4PXZvaWQgMD09PWJ8fGIsTz10LnRob3VzYW5kc1NlcGFyYXRvclN5bWJvbCxfPXZvaWQgMD09PU8/bDpPLGo9dC5hbGxvd0RlY2ltYWwsTT12b2lkIDAhPT1qJiZqLFA9dC5kZWNpbWFsU3ltYm9sLFM9dm9pZCAwPT09UD9hOlAsdz10LmRlY2ltYWxMaW1pdCxDPXZvaWQgMD09PXc/Mjp3LGs9dC5yZXF1aXJlRGVjaW1hbCxEPXZvaWQgMCE9PWsmJmssRT10LmFsbG93TmVnYXRpdmUsST12b2lkIDAhPT1FJiZFLFI9dC5hbGxvd0xlYWRpbmdaZXJvZXMsQT12b2lkIDAhPT1SJiZSLEw9dC5pbnRlZ2VyTGltaXQsTj12b2lkIDA9PT1MP251bGw6TCwkPWgmJmgubGVuZ3RofHwwLFY9bSYmbS5sZW5ndGh8fDAscT1fJiZfLmxlbmd0aHx8MDtyZXR1cm4gZS5pbnN0YW5jZU9mPVwiY3JlYXRlTnVtYmVyTWFza1wiLGV9ZnVuY3Rpb24gcihlKXtyZXR1cm4gZS5zcGxpdChjKS5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuIHYudGVzdChlKT92OmV9KX1mdW5jdGlvbiBvKGUsdCl7cmV0dXJuIGUucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZyx0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgaT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24oZSl7cmV0dXJuIHR5cGVvZiBlfTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiBlfTt0LmRlZmF1bHQ9bjt2YXIgdT1cIiRcIixjPVwiXCIsbD1cIixcIixhPVwiLlwiLHM9XCItXCIsZD0vLS8sZj0vXFxEKy9nLHA9XCJudW1iZXJcIix2PS9cXGQvLHk9XCJbXVwifSxmdW5jdGlvbihlLHQsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZX19ZnVuY3Rpb24gbyhlLHQpe2U9ZS5yZXBsYWNlKE8sdik7dmFyIG49dC5wbGFjZWhvbGRlckNoYXIscj10LmN1cnJlbnRDYXJldFBvc2l0aW9uLG89ZS5pbmRleE9mKHkpLHM9ZS5sYXN0SW5kZXhPZihwKSxkPXM8bz8tMTpzLGY9aShlLG8rMSx5KSxoPWkoZSxkLTEscCksZz11KGUsbyxuKSxtPWMoZSxvLGQsbiksYj1sKGUsZCxuLHIpO2c9YShnKSxtPWEobSksYj1hKGIsITApO3ZhciB4PWcuY29uY2F0KGYpLmNvbmNhdChtKS5jb25jYXQoaCkuY29uY2F0KGIpO3JldHVybiB4fWZ1bmN0aW9uIGkoZSx0LG4pe3ZhciByPVtdO3JldHVybiBlW3RdPT09bj9yLnB1c2gobik6ci5wdXNoKGgsbiksci5wdXNoKGgpLHJ9ZnVuY3Rpb24gdShlLHQpe3JldHVybiB0PT09LTE/ZTplLnNsaWNlKDAsdCl9ZnVuY3Rpb24gYyhlLHQsbixyKXt2YXIgbz12O3JldHVybiB0IT09LTEmJihvPW49PT0tMT9lLnNsaWNlKHQrMSxlLmxlbmd0aCk6ZS5zbGljZSh0KzEsbikpLG89by5yZXBsYWNlKG5ldyBSZWdFeHAoXCJbXFxcXHNcIityK1wiXVwiLG0pLHYpLG89PT15P2Y6by5sZW5ndGg8MT9nOm9bby5sZW5ndGgtMV09PT1wP28uc2xpY2UoMCxvLmxlbmd0aC0xKTpvfWZ1bmN0aW9uIGwoZSx0LG4scil7dmFyIG89djtyZXR1cm4gdCE9PS0xJiYobz1lLnNsaWNlKHQrMSxlLmxlbmd0aCkpLG89by5yZXBsYWNlKG5ldyBSZWdFeHAoXCJbXFxcXHNcIituK1wiLl1cIixtKSx2KSwwPT09by5sZW5ndGg/ZVt0LTFdPT09cCYmciE9PWUubGVuZ3RoP2Y6djpvfWZ1bmN0aW9uIGEoZSx0KXtyZXR1cm4gZS5zcGxpdCh2KS5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuIGU9PT1nP2U6dD94OmJ9KX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgcz1uKDQpLGQ9cihzKSxmPVwiKlwiLHA9XCIuXCIsdj1cIlwiLHk9XCJAXCIsaD1cIltdXCIsZz1cIiBcIixtPVwiZ1wiLGI9L1teXFxzXS8seD0vW14uXFxzXS8sTz0vXFxzL2c7dC5kZWZhdWx0PXttYXNrOm8scGlwZTpkLmRlZmF1bHR9fSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oZSx0KXt2YXIgbj10LmN1cnJlbnRDYXJldFBvc2l0aW9uLGk9dC5yYXdWYWx1ZSxmPXQucHJldmlvdXNDb25mb3JtZWRWYWx1ZSxwPXQucGxhY2Vob2xkZXJDaGFyLHY9ZTt2PXIodik7dmFyIHk9di5pbmRleE9mKGMpLGg9bnVsbD09PWkubWF0Y2gobmV3IFJlZ0V4cChcIlteQFxcXFxzLlwiK3ArXCJdXCIpKTtpZihoKXJldHVybiB1O2lmKHYuaW5kZXhPZihhKSE9PS0xfHx5IT09LTEmJm4hPT15KzF8fGkuaW5kZXhPZihvKT09PS0xJiZmIT09dSYmaS5pbmRleE9mKGwpIT09LTEpcmV0dXJuITE7dmFyIGc9di5pbmRleE9mKG8pLG09di5zbGljZShnKzEsdi5sZW5ndGgpO3JldHVybihtLm1hdGNoKGQpfHxzKS5sZW5ndGg+MSYmdi5zdWJzdHIoLTEpPT09bCYmbiE9PWkubGVuZ3RoJiYodj12LnNsaWNlKDAsdi5sZW5ndGgtMSkpLHZ9ZnVuY3Rpb24gcihlKXt2YXIgdD0wO3JldHVybiBlLnJlcGxhY2UoaSxmdW5jdGlvbigpe3JldHVybiB0KyssMT09PXQ/bzp1fSl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5kZWZhdWx0PW47dmFyIG89XCJAXCIsaT0vQC9nLHU9XCJcIixjPVwiQC5cIixsPVwiLlwiLGE9XCIuLlwiLHM9W10sZD0vXFwuL2d9XSl9KTsiLCJtb2R1bGUuZXhwb3J0cyA9IFxuXHRyZWQ6ICcjY2M0ODIwJ1xuXHRncmVlbjogJyM3MmMzMjInXG5cdG9yYW5nZTogJyNmZjljMDAnXG5cdGJsYWNrOiAnIzE4MTgxOCdcblx0Z3JleV9kYXJrOiAnIzVlNWU1ZSdcblx0Z3JleTogJyM5MDkwOTAnXG5cdGdyZXlfc2VtaV9saWdodDogJyNiZWJlYmUnXG5cdGdyZXlfbGlnaHQ6ICcjZDNkM2QzJ1xuXHRncmV5X2xpZ2h0MjogJyNkZGRkZGQnXG5cdGdyZXlfbGlnaHQzOiAnI2YyZjVmNydcblx0Z3JleV9saWdodDQ6ICcjZTVlNWU1J1xuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTdGF0ZUNoYWluXG5cdGNvbnN0cnVjdG9yOiAoc3RhdGVzKS0+XG5cdFx0QHN0cmluZyA9IHN0YXRlcy5qb2luKCcrJylcblx0XHRAYXJyYXkgPSBzdGF0ZXMuc2xpY2UoKVxuXHRcdEBsZW5ndGggPSBzdGF0ZXMubGVuZ3RoXG5cblx0aW5jbHVkZXM6ICh0YXJnZXQpLT5cblx0XHRmb3Igc3RhdGUgaW4gQGFycmF5XG5cdFx0XHRyZXR1cm4gdHJ1ZSBpZiBzdGF0ZSBpcyB0YXJnZXRcblxuXHRcdHJldHVybiBmYWxzZVxuXG5cdHdpdGhvdXQ6ICh0YXJnZXQpLT5cblx0XHRAYXJyYXlcblx0XHRcdC5maWx0ZXIgKHN0YXRlKS0+IHN0YXRlIGlzbnQgdGFyZ2V0XG5cdFx0XHQuam9pbiAnKydcblxuXG5cdGlzQXBwbGljYWJsZTogKHRhcmdldCwgb3RoZXJBY3RpdmUpLT5cblx0XHRhY3RpdmUgPSBAYXJyYXkuZmlsdGVyIChzdGF0ZSktPlxuXHRcdFx0c3RhdGUgaXMgdGFyZ2V0IG9yXG5cdFx0XHRvdGhlckFjdGl2ZS5pbmRleE9mKHN0YXRlKSBpc250IC0xXG5cblx0XHRyZXR1cm4gYWN0aXZlLmxlbmd0aCBpcyBAYXJyYXkubGVuZ3RoIiwiZXhwb3J0cy5jaGVja21hcmsgPSBpbXBvcnQgJy4vY2hlY2ttYXJrJ1xuZXhwb3J0cy5hbmdsZURvd24gPSBpbXBvcnQgJy4vYW5nbGVEb3duJ1xuZXhwb3J0cy5jYXJldFVwID0gaW1wb3J0ICcuL2NhcmV0VXAnXG5leHBvcnRzLmNhcmV0RG93biA9IGltcG9ydCAnLi9jYXJldERvd24nXG5leHBvcnRzLnBsdXMgPSBpbXBvcnQgJy4vcGx1cydcbmV4cG9ydHMuY2xvbmUgPSBpbXBvcnQgJy4vY2xvbmUnXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0d2lkdGg6ICcxMnB4J1xuXHRcdFx0aGVpZ2h0OiAnMTJweCdcblx0XHRcdHZpZXdCb3g6ICc1IDcgMTIgMTInXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnOXB4J1xuXHRcdFx0aGVpZ2h0OiAnOXB4J1xuXG5cblx0XHRbJypwb2x5bGluZScsIHtcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogJzInXG5cdFx0XHRcdCdzdHJva2UtbGluZWNhcCc6ICdyb3VuZCdcblx0XHRcdFx0J3N0cm9rZS1saW5lam9pbic6ICdyb3VuZCdcblx0XHRcdFx0ZmlsbDogJ25vbmUnXG5cdFx0XHRcdHBvaW50czogJzcgMTMuODg4ODg4OSA5LjY2NjY2NjY3IDE3IDE1IDknXG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0fV1cblx0XVxuKVxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NLnRlbXBsYXRlKFxuXHRbJypzdmcnXG5cdFx0YXR0cnM6XG5cdFx0XHR3aWR0aDogJzE3OTJweCdcblx0XHRcdGhlaWdodDogJzE3OTJweCdcblx0XHRcdHZpZXdCb3g6ICcwIDAgMTc5MiAxNzkyJ1xuXHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJ1xuXHRcdFx0b3V0bGluZTogJ25vbmUnXG5cblx0XHRbJypwYXRoJ1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0XHRcdGQ6ICdNMTM5NSA3MzZxMCAxMy0xMCAyM2wtNDY2IDQ2NnEtMTAgMTAtMjMgMTB0LTIzLTEwbC00NjYtNDY2cS0xMC0xMC0xMC0yM3QxMC0yM2w1MC01MHExMC0xMCAyMy0xMHQyMyAxMGwzOTMgMzkzIDM5My0zOTNxMTAtMTAgMjMtMTB0MjMgMTBsNTAgNTBxMTAgMTAgMTAgMjN6J1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NLnRlbXBsYXRlKFxuXHRbJypzdmcnXG5cdFx0YXR0cnM6XG5cdFx0XHR2aWV3Qm94OiAnMCAwIDUxMiA1MTInXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBhdGgnXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0ZDogJ000MDIgMzQ3YzAgNS0yIDEwLTUgMTMtNCA0LTggNi0xMyA2aC0yNTZjLTUgMC05LTItMTMtNi0zLTMtNS04LTUtMTNzMi05IDUtMTJsMTI4LTEyOGM0LTQgOC02IDEzLTZzOSAyIDEzIDZsMTI4IDEyOGMzIDMgNSA3IDUgMTJ6J1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHZpZXdCb3g6ICcwIDAgNTEyIDUxMidcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTQwMiAyMDFjMCA1LTIgOS01IDEzbC0xMjggMTI4Yy00IDQtOCA1LTEzIDVzLTktMS0xMy01bC0xMjgtMTI4Yy0zLTQtNS04LTUtMTNzMi05IDUtMTNjNC0zIDgtNSAxMy01aDI1NmM1IDAgOSAyIDEzIDUgMyA0IDUgOCA1IDEzeidcblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0dmlld0JveDogJzAgMCAxNSAxNSdcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcG9seWdvbidcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRwb2ludHM6ICc5IDAgNiAwIDYgNiAwIDYgMCA5IDYgOSA2IDE1IDkgMTUgOSA5IDE1IDkgMTUgNiA5IDYnXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0dmlld0JveDogJzAgMCAxOCAyMCdcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTEzLjQxNCwwIEw2LDAgQzQuODk3LDAgNCwwLjg5OCA0LDIgTDQsMTQgQzQsMTUuMTAzIDQuODk3LDE2IDYsMTYgTDE2LDE2IEMxNy4xMDMsMTYgMTgsMTUuMTAzIDE4LDE0IEwxOCw0LjU4NiBMMTMuNDE0LDAgWiBNMTYuMDAxLDE0IEw2LDE0IEw2LDIgTDEyLDIgTDEyLDYgTDE2LDYgTDE2LjAwMSwxNCBaJ1xuXHRcdF1cblx0XHRcblx0XHRbJypwYXRoJ1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0XHRcdGQ6ICdNMiw2LjQyMzc5MjgyIEwwLDYuNDIzNzkyODIgTDAsMTggQzAsMTkuMTAzIDAuODk3LDIwIDIsMjAgTDE0LDIwIEwxNCwxOCBMMiwxOCBMMiw2LjQyMzc5MjgyIFonXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuXG4iXX0=