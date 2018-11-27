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
        _builder.version = "1.0.83";
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
      _QuickDom.version = "1.0.89";
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
              var _this7 = this;

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
                if (show && _this7.state.error && IS.string(_this7.state.error)) {
                  return _this7.state.error;
                } else {
                  return _this7.settings.help || _this7.state.help;
                }
              });
              SimplyBind('error', {
                updateOnBind: false
              }).of(this.state).to('help').of(this.state).condition(function (error) {
                return error && _this7.state.showError;
              });
              SimplyBind('help').of(this.state).to('html').of(this.el.child.help).and.to('showHelp').of(this.state);
              SimplyBind('label').of(this.state).to('text').of(this.el.child.label).and.to('showLabel').of(this.state);
              SimplyBind('margin').of(this.state).to(this.el.style.bind(this.el, 'margin'));
              SimplyBind('padding').of(this.state).to(this.el.style.bind(this.el, 'padding'));
              SimplyBind('showHelp').of(this.state).to(function (show, prevShow) {
                var changeAmount;

                if (_this7.settings.makeRoomForHelp) {
                  changeAmount = !!show === !!prevShow ? 0 : show ? 25 : prevShow ? -25 : void 0;

                  if (changeAmount) {
                    return _this7.state.margin = helpers.updateShorthandValue(_this7.state.margin, 'bottom', changeAmount);
                  }
                }
              });
              SimplyBind('focused', {
                updateOnBind: false
              }).of(this.state).to(function (focused) {
                return _this7.emit(focused ? 'focus' : 'blur');
              });

              if (this.settings.mobileWidth) {
                SimplyBind(function () {
                  return fastdom.measure(function () {
                    return _this7.state.isMobile = window.innerWidth <= _this7.settings.mobileThreshold;
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
              var _this8 = this,
                  _arguments = arguments;

              return this.on(eventNames, function () {
                _this8.off(eventNames, callback);

                return callback.apply(_this8.el, _arguments);
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
            var _this9;

            _classCallCheck(this, TextField);

            _this9 = _possibleConstructorReturn(this, _getPrototypeOf(TextField).apply(this, arguments));

            if (_this9._value == null) {
              _this9._value = '';
            }

            _this9.state.typing = false;
            _this9.cursor = {
              prev: 0,
              current: 0
            };

            if (!_this9.settings.validWhenRegex) {
              if (_this9.settings.keyboard === 'email' && _this9.settings.required) {
                _this9.settings.validWhenRegex = REGEX.email;
              } else if (_this9.settings.mask === 'NAME' || _this9.settings.mask.pattern === 'NAME') {
                _this9.settings.validWhenRegex = /^[a-zA-Z]{2}/;
              } else if (_this9.settings.mask === 'FULLNAME' || _this9.settings.mask.pattern === 'FULLNAME') {
                _this9.settings.validWhenRegex = /^[a-zA-Z]+\s+[a-zA-Z]+/;
              }
            }

            if (!_this9.settings.mask.pattern) {
              if (IS.string(_this9.settings.mask)) {
                _this9.settings.mask = extend.deep.clone(_this9.defaults.mask, {
                  pattern: _this9.settings.mask
                });
              } else if (IS.object(_this9.settings.mask)) {
                _this9.settings.mask.pattern = function () {
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
                }.call(_assertThisInitialized(_assertThisInitialized(_this9)));
              }
            }

            if (_this9.settings.mask.pattern) {
              _this9.mask = new Mask(_assertThisInitialized(_assertThisInitialized(_this9)), _this9.settings.mask);
            }

            _this9._createElements();

            _this9._attachBindings();

            _this9._constructorEnd();

            return _this9;
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
              var _this10 = this;

              SimplyBind('visible').of(this.state).to(function (visible) {
                return _this10.el.state('visible', visible);
              });
              SimplyBind('hovered').of(this.state).to(function (hovered) {
                return _this10.el.state('hover', hovered);
              });
              SimplyBind('focused').of(this.state).to(function (focused) {
                return _this10.el.state('focus', focused);
              });
              SimplyBind('filled').of(this.state).to(function (filled) {
                return _this10.el.state('filled', filled);
              });
              SimplyBind('disabled').of(this.state).to(function (disabled) {
                return _this10.el.state('disabled', disabled);
              });
              SimplyBind('showLabel').of(this.state).to(function (showLabel) {
                return _this10.el.state('showLabel', showLabel);
              });
              SimplyBind('showError').of(this.state).to(function (showError) {
                return _this10.el.state('showError', showError);
              });
              SimplyBind('showHelp').of(this.state).to(function (showHelp) {
                return _this10.el.state('showHelp', showHelp);
              });
              SimplyBind('valid').of(this.state).to(function (valid) {
                _this10.el.state('valid', valid);

                return _this10.el.state('invalid', !valid);
              });
            }
          }, {
            key: "_attachBindings_display",
            value: function _attachBindings_display() {
              var _this11 = this;

              SimplyBind('placeholder').of(this.state).to('text').of(this.el.child.placeholder).transform(function (placeholder) {
                switch (false) {
                  case !(placeholder === true && _this11.settings.label):
                    return _this11.settings.label;

                  case !IS.string(placeholder):
                    return placeholder;

                  default:
                    return '';
                }
              });
              SimplyBind('disabled', {
                updateOnBind: this.state.disabled
              }).of(this.state).to(function (disabled, prev) {
                if (_this11.settings.checkmark) {
                  if (disabled || !disabled && prev != null) {
                    return setTimeout(function () {
                      _this11.el.child.checkmark_mask1.recalcStyle();

                      _this11.el.child.checkmark_mask2.recalcStyle();

                      return _this11.el.child.checkmark_patch.recalcStyle();
                    });
                  }
                }
              });
            }
          }, {
            key: "_attachBindings_display_autoWidth",
            value: function _attachBindings_display_autoWidth() {
              var _this12 = this;

              SimplyBind('width', {
                updateEvenIfSame: true
              }).of(this.state).to(function (width) {
                return (_this12.settings.autoWidth ? _this12.el.child.input : _this12.el).style('width', width);
              }).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);

              if (this.settings.autoWidth) {
                SimplyBind('_value', {
                  updateEvenIfSame: true,
                  updateOnBind: false
                }).of(this).to('width').of(this.state).transform(function () {
                  return "".concat(_this12._getInputAutoWidth(), "px");
                }).updateOn('event:inserted').of(this.el).updateOn('visible').of(this.state);
              }
            }
          }, {
            key: "_attachBindings_value",
            value: function _attachBindings_value() {
              var _this13 = this;

              var input, resetInput;
              input = this.el.child.input.raw;

              resetInput = function resetInput() {
                var filled;
                filled = !_this13.mask.isEmpty();

                if (!filled) {
                  _this13.selection(_this13.mask.cursor = 0);

                  _this13._value = '';
                  _this13.state.filled = false;
                }

                return filled;
              };

              SimplyBind('event:input').of(input).to(function () {
                _this13.value = input.value;

                if (_this13.mask) {
                  _this13.selection(_this13.mask.cursor);
                }

                return _this13.emit('input', _this13.value);
              });
              SimplyBind('_value', {
                updateEvenIfSame: !!this.mask
              }).of(this).to('value').of(input).and.to(function (value) {
                var filled;
                filled = !!value;

                if (filled && _this13.mask && _this13.mask.guide && (!_this13.state.focused || _this13.mask.cursor === 0)) {
                  filled = resetInput();
                }

                _this13.state.filled = filled;

                if (filled) {
                  _this13.state.interacted = true;
                }

                _this13.state.valid = _this13.validate(void 0, true);

                if (!_this13.state.focused) {
                  return _this13.emit('input', _this13.value);
                }
              });
              SimplyBind('event:keydown').of(this.el.child.input).to(function (event) {
                if (event.keyCode === KEYCODES.enter) {
                  _this13.emit('submit');
                }

                return _this13.emit("key-".concat(event.keyCode));
              });

              if (this.mask && this.mask.guide) {
                SimplyBind('event:blur').of(this.el.child.input).to(resetInput);
              }
            }
          }, {
            key: "_attachBindings_autocomplete",
            value: function _attachBindings_autocomplete() {
              var _this14 = this;

              if (this.dropdown) {
                SimplyBind.defaultOptions.updateOnBind = false;
                SimplyBind('typing', {
                  updateEvenIfSame: true
                }).of(this.state).to(function (isTyping) {
                  if (isTyping) {
                    if (!_this14._value) {
                      return;
                    }

                    if (_this14.dropdown.isOpen) {
                      return _this14.dropdown.list.calcDisplay();
                    } else {
                      _this14.dropdown.isOpen = true;
                      return SimplyBind('event:click').of(document).once.to(function () {
                        return _this14.dropdown.isOpen = false;
                      }).condition(function (event) {
                        return !DOM(event.target).parentMatching(function (parent) {
                          return parent === _this14.el.child.innerwrap;
                        });
                      });
                    }
                  } else {
                    return _this14.dropdown.isOpen = false;
                  }
                });
                SimplyBind('_value').of(this).to(function (value) {
                  var choice, i, len, ref, shouldBeVisible;
                  ref = _this14.dropdown.choices;

                  for (i = 0, len = ref.length; i < len; i++) {
                    choice = ref[i];
                    shouldBeVisible = !value ? true : helpers.fuzzyMatch(value, choice.label);

                    if (choice.visible !== shouldBeVisible) {
                      choice.visible = shouldBeVisible;
                    }
                  }

                  if (_this14.dropdown.isOpen && !value) {
                    _this14.dropdown.isOpen = false;
                  }
                });
                this.dropdown.onSelected(function (selectedChoice) {
                  _this14.selected = selectedChoice;
                  _this14.value = selectedChoice.label;
                  _this14.dropdown.isOpen = false;
                  return _this14.selection(_this14.el.child.input.raw.value.length);
                });
                SimplyBind.defaultOptions.updateOnBind = true;
              }
            }
          }, {
            key: "_attachBindings_stateTriggers",
            value: function _attachBindings_stateTriggers() {
              var _this15 = this;

              SimplyBind('event:mouseenter').of(this.el.child.input).to(function () {
                return _this15.state.hovered = true;
              });
              SimplyBind('event:mouseleave').of(this.el.child.input).to(function () {
                return _this15.state.hovered = false;
              });
              SimplyBind('event:focus').of(this.el.child.input).to(function () {
                _this15.state.focused = true;

                if (_this15.state.disabled) {
                  return _this15.blur();
                }
              });
              SimplyBind('event:blur').of(this.el.child.input).to(function () {
                return _this15.state.typing = _this15.state.focused = false;
              });
              SimplyBind('event:input').of(this.el.child.input).to(function () {
                return _this15.state.typing = true;
              });
              SimplyBind('event:keydown').of(this.el.child.input).to(function () {
                return _this15.cursor.prev = _this15.selection().end;
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
        var _this16 = this;

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
            choiceBinding = _this16.choices[choiceEl.value] = SimplyBind('checked').of(choiceEl)._;
            choiceBinding.addSub(_this16);

            choiceBinding.subsMeta[_this16.ID].transformFn = function () {
              return choiceBinding;
            };

            choiceBinding.groupBinding = _this16;
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
          var _this17 = this;

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
                if (_this17.subsMeta[sub.ID]) {
                  return _this17.updateSub(sub, publisher);
                }
              }, meta.opts.throttle - timePassed);
            } else {
              meta.lastUpdate = currentTime;
            }
          } else if (meta.opts.delay && !isDelayedUpdate) {
            return setTimeout(function () {
              if (_this17.subsMeta[sub.ID]) {
                return _this17.updateSub(sub, publisher, true);
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
          var _this18 = this;

          var index;

          if (!this.pholderValues) {
            this.pholderValues = genObj();
            this.pholderIndexMap = genObj();
            this.pholderContexts = [];

            if (checkIf.isString(this.value)) {
              this.pholderContexts = this.value.split(pholderRegExSplit);
              index = 0;
              this.value = this.value.replace(pholderRegEx, function (e, pholder) {
                _this18.pholderIndexMap[index++] = pholder;
                return _this18.pholderValues[pholder] = pholder;
              });
            }

            if (this.isDom && this.property === textContent) {
              _scanTextNodesPlaceholders(this.object, this.textNodes = genObj());
            }
          }
        },
        addPollInterval: function addPollInterval(time) {
          var _this19 = this;

          if (this.type !== 'Event') {
            this.removePollInterval();
            return this.pollInterval = setInterval(function () {
              var polledValue;
              polledValue = _this19.fetchDirectValue();
              return _this19.setValue(polledValue, _this19, true);
            }, time);
          }
        },
        removePollInterval: function removePollInterval() {
          clearInterval(this.pollInterval);
          return this.pollInterval = null;
        },
        addUpdateListener: function addUpdateListener(eventName, targetProperty) {
          var _this20 = this;

          this.object.addEventListener(eventName, function (event) {
            var shouldRedefineValue;

            if (!event._sb) {
              shouldRedefineValue = _this20.selfTransform && _this20.isDomInput;

              _this20.setValue(_this20.object[targetProperty], null, !shouldRedefineValue, true);
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
          var _this21 = this;

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
              return typeof (base = _this21.field).emit === "function" ? base.emit('conditionChange', _this21) : void 0;
            }
          });
        }

        _createClass(Condition, [{
          key: "test",
          value: function test() {
            var _this22 = this;

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

              if (_this22.property === '_value') {
                return _this22.target.value;
              }

              propertyChain = _this22.property.split('.');

              switch (false) {
                case propertyChain.length !== 1:
                  return _this22.target[_this22.property];

                case !IS.defined(_this22.target[_this22.property]):
                  return _this22.target[_this22.property];

                default:
                  nestedObject = _this22.target;

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
              var _this23 = this;

              SimplyBind('help').of(this.settings).to('text').of(this.els.help).and.to(function (showHelp) {
                return _this23.els.help.state('showHelp', showHelp);
              });
              SimplyBind('visibleChoicesCount').of(this).to(function (count) {
                return _this23.els.container.state('hasVisibleChoices', !!count);
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
              var _this24 = this;

              SimplyBind('isOpen', {
                updateOnBind: false
              }).of(this).to(function (isOpen) {
                _this24.els.container.state('isOpen', isOpen);

                if (!isOpen) {
                  _this24.currentHighlighted = null;
                }

                if (_this24.settings.lockScroll) {
                  if (isOpen) {
                    helpers.lockScroll(_this24.els.list);
                  } else {
                    helpers.unlockScroll();
                  }
                }

                if (isOpen) {
                  _this24.list.calcDisplay();

                  if (_this24.selected && !_this24.settings.multiple) {
                    return _this24.list.scrollToChoice(_this24.selected);
                  }
                } else {
                  return _this24.list.setTranslate(0);
                }
              });
              SimplyBind('lastSelected', {
                updateOnBind: false,
                updateEvenIfSame: true
              }).of(this).to(function (newChoice, prevChoice) {
                return _this24._selectedCallback(newChoice, prevChoice);
              });
              SimplyBind('focused', {
                updateOnBind: false
              }).of(this.field.state).to(function (focused) {
                if (!focused) {
                  return _this24.field.el.child.input.off('keydown.dropdownNav');
                } else {
                  return _this24.field.el.child.input.on('keydown.dropdownNav', function (event) {
                    if (_this24.isOpen) {
                      switch (event.keyCode) {
                        case KEYCODES.up:
                          event.preventDefault();
                          return _this24.highlightPrev();

                        case KEYCODES.down:
                          event.preventDefault();
                          return _this24.highlightNext();

                        case KEYCODES.enter:
                          event.preventDefault();

                          if (_this24.currentHighlighted) {
                            return _this24.lastSelected = _this24.currentHighlighted;
                          }

                          break;

                        case KEYCODES.esc:
                          event.preventDefault();
                          return _this24.isOpen = false;
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
                    if (_this24.isOpen) {
                      event.preventDefault();

                      if (!KEYCODES.anyPrintable(event.keyCode)) {
                        return;
                      }

                      return _this24.typeBuffer += event.key;
                    }
                  });
                }
              });
              return SimplyBind('typeBuffer', {
                updateOnBind: false
              }).of(this).to(function () {
                clearTimeout(_this24.typeBufferTimeout);
                return _this24.typeBufferTimeout = setTimeout(function () {
                  return _this24.typeBuffer = '';
                }, 1500);
              }).and.to(function (buffer) {
                var choice, i, len, ref;

                if (buffer) {
                  ref = _this24.visibleChoices;

                  for (i = 0, len = ref.length; i < len; i++) {
                    choice = ref[i];

                    if (helpers.startsWith(buffer, choice.label)) {
                      _this24.currentHighlighted = choice;

                      if (!_this24.list.choiceInView(choice)) {
                        _this24.list.scrollToChoice(choice);
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
              var _this25 = this;

              SimplyBind('scrollTop', {
                updateEvenIfSame: true
              }).of(this.els.list.raw).to(function (scrollTop) {
                var showBottomIndicator, showTopIndicator;
                showTopIndicator = scrollTop > 0;
                showBottomIndicator = _this25.els.list.raw.scrollHeight - _this25.els.list.raw.clientHeight > scrollTop;

                _this25.els.scrollIndicatorUp.state('visible', showTopIndicator);

                return _this25.els.scrollIndicatorDown.state('visible', showBottomIndicator);
              }).condition(function () {
                return _this25.isOpen && !_this25.settings.help && _this25.els.list.raw.scrollHeight !== _this25.els.list.raw.clientHeight && _this25.els.list.raw.clientHeight >= 100;
              }).updateOn('event:scroll').of(this.els.list.raw).updateOn('isOpen').of(this);
              this.els.scrollIndicatorUp.on('mouseenter', function () {
                return _this25.list.startScrolling('up');
              });
              this.els.scrollIndicatorUp.on('mouseleave', function () {
                return _this25.list.stopScrolling();
              });
              this.els.scrollIndicatorDown.on('mouseenter', function () {
                return _this25.list.startScrolling('down');
              });
              return this.els.scrollIndicatorDown.on('mouseleave', function () {
                return _this25.list.stopScrolling();
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
        }

        _createClass(List, [{
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
            var _this26 = this;

            return this.scrollIntervalID = setInterval(function () {
              return _this26.el.raw.scrollTop += direction === 'up' ? -20 : 20;
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
          var _this27 = this;

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
          this.el = this.dropdown.template.choice.spawn(null, {
            relatedInstance: this.dropdown
          }).appendTo(this.list.el);
          this.el.children[1].text = this.label;
          this.visible = true;
          this.selected = false;
          this.unavailable = false;

          this._attachBindings();

          if ((ref = this.conditions) != null ? ref.length : void 0) {
            this.unavailable = true;
            this.allFields = this.field.allFields;
            Condition.init(this, this.conditions, function () {
              return _this27.unavailable = !Condition.validate(_this27.conditions);
            });
          }
        }

        _createClass(Choice, [{
          key: "_attachBindings",
          value: function _attachBindings() {
            var _this28 = this;

            return function () {
              SimplyBind('visible').of(_this28).to(function (visible, prev) {
                _this28.dropdown.visibleChoicesCount += visible ? 1 : -1;

                _this28.el.state('visible', visible);

                if (visible) {
                  _this28.dropdown.visibleChoices.push(_this28);

                  if (IS.defined(prev)) {
                    return _this28.dropdown.visibleChoices.sort(function (a, b) {
                      return a.index - b.index;
                    });
                  }
                } else {
                  return helpers.removeItem(_this28.dropdown.visibleChoices, _this28);
                }
              });
              SimplyBind('selected', {
                updateOnBind: false
              }).of(_this28).to(function (selected) {
                return _this28.el.state('selected', selected);
              });
              SimplyBind('unavailable', {
                updateOnBind: false
              }).of(_this28).to(function (unavailable) {
                return _this28.el.state('unavailable', unavailable);
              }).and.to(function (unavailable) {
                if (unavailable) {
                  return _this28.toggle(false, true);
                }
              });
              SimplyBind('event:click').of(_this28.el).to(function () {
                return _this28.dropdown.lastSelected = _this28;
              });
              SimplyBind('event:mousedown').of(_this28.el).to(function (event) {
                event.preventDefault();
                return event.stopPropagation();
              });
              return SimplyBind('event:mouseenter').of(_this28.el).to(function () {
                return _this28.dropdown.currentHighlighted = _this28;
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


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSIsImNvbnNvbGVQYXRjaC5jb2ZmZWUiLCIuLi9wYWNrYWdlLmpzb24iLCJoZWxwZXJzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvaW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9hbGxvd2VkT3B0aW9ucy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2hlbHBlcnMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9jaGVja3MuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9lbGVtZW50L2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9hbGlhc2VzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC90cmF2ZXJzaW5nLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9pbml0LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9ldmVudHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9lbGVtZW50L3N0YXRlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9zdHlsZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2VsZW1lbnQvYXR0cmlidXRlcy1hbmQtcHJvcGVydGllcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2VsZW1lbnQvbWFuaXB1bGF0aW9uLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9hcHBsaWNhdGlvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL3dpbmRvdy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL21lZGlhUXVlcnkuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9iYXRjaC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL3RlbXBsYXRlL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvdGVtcGxhdGUvZXh0ZW5kVGVtcGxhdGUuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy90ZW1wbGF0ZS9wYXJzZVRyZWUuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy90ZW1wbGF0ZS9zY2hlbWEuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9zaG9ydGN1dHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3BhY2thZ2UuanNvbiIsImNoZWNrcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3NyYy9pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3BhY2thZ2UuanNvbiIsImFuaW1hdGlvbnMuY29mZmVlIiwiY29uc3RhbnRzL3JlcUZpZWxkTWV0aG9kcy5jb2ZmZWUiLCJmaWVsZC9pbmRleC5jb2ZmZWUiLCJmaWVsZC90cmFuc2Zvcm1TZXR0aW5ncy5jb2ZmZWUiLCJmaWVsZC90ZXh0L19pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9faW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL2hlbHBlcnMvX2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2NoYW5nZUV2ZW50LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL3JlcXVpcmVzRG9tRGVzY3JpcHRvckZpeC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvaGVscGVycy93aW5kb3dQcm9wc1RvSWdub3JlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2NoZWNrcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvaGVscGVycy9kZXNjcmlwdG9yLW1vZC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvaGVscGVycy93ZWJraXREb21EZXNjcmlwdG9yRml4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2Nsb25pbmcuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL2hlbHBlcnMvY2FjaGUuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL2hlbHBlcnMvcGxhY2Vob2xkZXJzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2Vycm9ycy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvZXJyb3JzQW5kV2FybmluZ3MuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9TaW1wbHlCaW5kL19pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL1NpbXBseUJpbmQvbWV0aG9kcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvcGFja2FnZS5qc29uIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9TaW1wbHlCaW5kL21ldGhvZHMudW5CaW5kQWxsLXBhcnNlRE9NT2JqZWN0LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvQmluZGluZy9faW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nL3Byb3RvdHlwZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL0JpbmRpbmcvcHJvdG90eXBlLnNldFZhbHVlLU9iamVjdFByb3AtRE9NVmFsdWUuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nL3Byb3RvdHlwZS5zZXRWYWx1ZS1ET01UeXBlcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL0JpbmRpbmdJbnRlcmZhY2UvaW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL3Byb3RvdHlwZS1wcml2YXRlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvQmluZGluZ0ludGVyZmFjZS9wcm90b3R5cGUtcHJpdmF0ZS5zZXRPYmplY3QtcGFyc2VET01PYmplY3QuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL3Byb3RvdHlwZS1wcml2YXRlLnNldE9iamVjdC1kZWZpbmVFdmVudE1ldGhvZHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL3Byb3RvdHlwZS1wdWJsaWMuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9Hcm91cEJpbmRpbmcvX2luZGV4LmNvZmZlZSIsImNvbnN0YW50cy9yZWdleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tjc3Mvc3JjL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2Nzcy9wYWNrYWdlLmpzb24iLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL2lzL3NyYy9pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3NyYy9leHRlbmQuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Zhc3Rkb20vZmFzdGRvbS5qcyIsImNvbXBvbmVudHMvY29uZGl0aW9uLmNvZmZlZSIsImZpZWxkL2dsb2JhbERlZmF1bHRzLmNvZmZlZSIsImNvbXBvbmVudHMvZHJvcGRvd24vaW5kZXguY29mZmVlIiwiY29tcG9uZW50cy9tYXNrLmNvZmZlZSIsImNvbnN0YW50cy9rZXlDb2Rlcy5jb2ZmZWUiLCJmaWVsZC90ZXh0L3RlbXBsYXRlLmNvZmZlZSIsImZpZWxkL3RleHQvZGVmYXVsdHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrY3NzL3NyYy9oZWxwZXJzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvY29uc3RhbnRzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vaXMvc3JjL25hdGl2ZXMuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9pcy9zcmMvZG9tLmNvZmZlZSIsImNvbXBvbmVudHMvZHJvcGRvd24vdGVtcGxhdGUuY29mZmVlIiwiY29tcG9uZW50cy9kcm9wZG93bi9kZWZhdWx0cy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvdGV4dC1tYXNrLWNvcmUvZGlzdC90ZXh0TWFza0NvcmUuanMiLCJub2RlX21vZHVsZXMvdGV4dC1tYXNrLWFkZG9ucy9kaXN0L3RleHRNYXNrQWRkb25zLmpzIiwiY29uc3RhbnRzL2NvbG9ycy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2VsZW1lbnQvc3RhdGVDaGFpbi5jb2ZmZWUiLCJzdmcvX2luZGV4LmNvZmZlZSIsInN2Zy9jaGVja21hcmsuY29mZmVlIiwic3ZnL2FuZ2xlRG93bi5jb2ZmZWUiLCJzdmcvY2FyZXRVcC5jb2ZmZWUiLCJzdmcvY2FyZXREb3duLmNvZmZlZSIsInN2Zy9wbHVzLmNvZmZlZSIsInN2Zy9jbG9uZS5jb2ZmZWUiXSwibmFtZXMiOlsiRE9NIiwiSVMiLCJleHRlbmQiLCJyZWdpc3RlckFuaW1hdGlvbnMiLCJSRVFVSVJFRF9GSUVMRF9NRVRIT0RTIiwiY29uc29sZSIsImxvZyIsIndhcm4iLCJuZXdCdWlsZGVyIiwic2V0dGluZ092ZXJyaWRlcyIsInRlbXBsYXRlT3ZlcnJpZGVzIiwiRmllbGQiLCJzZXR0aW5ncyIsImFyZ3VtZW50cyIsImxlbmd0aCIsImNsb25lIiwib2JqZWN0IiwidHlwZSIsIkVycm9yIiwiYnVpbGRlciIsInJlZ2lzdGVyIiwidGFyZ2V0RmllbGQiLCJpIiwic3RyaW5nIiwiZnVuY3Rpb24iLCJwcm90b3R5cGUiLCJyZXF1aXJlZE1ldGhvZCIsImNvbmZpZyIsIm5ld1NldHRpbmdzIiwibmV3VGVtcGxhdGVzIiwiU3RyaW5nIiwib3V0cHV0U2V0dGluZ3MiLCJPYmplY3QiLCJjcmVhdGUiLCJnbG9iYWxEZWZhdWx0cyIsImRlZXAiLCJub3REZWVwIiwic2hhbGxvd1NldHRpbmdzIiwiZGVmYXVsdHMiLCJvdXRwdXRUZW1wbGF0ZXMiLCJnbG9iYWxDb25maWciLCJnbG9iYWwiLCJmaWVsZCIsImRlZmF1bHQiLCJvcmlnaW5hbFRlbXBsYXRlcyIsInRlbXBsYXRlcyIsIm5hbWUiLCJjb25jYXQiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsIm93biIsIm5vdEtleXMiLCJ2ZXJzaW9uIiwiUXVpY2tGaWVsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJTaW1wbHlCaW5kIiwicmVnZXgiLCJoZWxwZXJzIiwibm9vcCIsImluY2x1ZGVzIiwidGFyZ2V0IiwiaXRlbSIsImluZGV4T2YiLCJyZXBlYXQiLCJjb3VudCIsInJlc3VsdHMxIiwiam9pbiIsInJlbW92ZUl0ZW0iLCJpdGVtSW5kZXgiLCJzcGxpY2UiLCJpbnNlcnRBZnRlciIsIm5ld0l0ZW0iLCJmaW5kIiwiZm4iLCJyZXN1bHRzIiwiZmlsdGVyIiwiZGlmZiIsInNvdXJjZSIsImNvbXBhcmVlIiwiY29tcGFyZWVWYWwiLCJtYXhMZW4iLCJNYXRoIiwibWF4Iiwic291cmNlVmFsIiwiZGVmaW5lZCIsInJlc3VsdCIsInB1c2giLCJoZXhUb1JHQkEiLCJoZXgiLCJhbHBoYSIsIkIiLCJzbGljZSIsIlIiLCJwYXJzZUludCIsIkciLCJkZWZhdWx0Q29sb3IiLCJjb2xvciIsImNhbGNQYWRkaW5nIiwiZGVzaXJlZEhlaWdodCIsImZvbnRTaXplIiwiY2VpbCIsInVubG9ja1Njcm9sbCIsImV4Y2x1ZGVkRWwiLCJ3aW5kb3ciLCJfaXNMb2NrZWQiLCJvZmYiLCJsb2NrU2Nyb2xsIiwib24iLCJldmVudCIsInJhdyIsInBhcmVudE1hdGNoaW5nIiwicGFyZW50Iiwid2hlZWxEZWx0YSIsInNjcm9sbFRvcCIsInByZXZlbnREZWZhdWx0Iiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiZnV6enlNYXRjaCIsIm5lZWRsZSIsImhheXN0YWNrIiwiY2FzZVNlbnNpdGl2ZSIsImhJIiwiaExlbmd0aCIsInRvVXBwZXJDYXNlIiwibkxlbmd0aCIsIm5JIiwibWF0Y2hlZENvdW50IiwibmVlZGxlQ2hhciIsInN0YXJ0c1dpdGgiLCJnZXRJbmRleE9mRmlyc3REaWZmIiwic291cmNlU3RyaW5nIiwiY29tcGFyZVN0cmluZyIsImN1cnJlbnRQb3MiLCJtYXhMZW5ndGgiLCJwYXJzZUNzc1Nob3J0aGFuZFZhbHVlIiwic3BsaXQiLCJ3aGl0ZVNwYWNlIiwibWFwIiwicGFyc2VGbG9hdCIsInZhbHVlcyIsInRvcCIsInJpZ2h0IiwiYm90dG9tIiwibGVmdCIsInNob3J0aGFuZFNpZGVWYWx1ZSIsInZhbHVlIiwic2lkZSIsInVwZGF0ZVNob3J0aGFuZFZhbHVlIiwibmV3VmFsdWUiLCJrZXlzIiwiZm9yRWFjaCIsImluaGVyaXRQcm90byIsImNoaWxkIiwiaiIsImtleSIsIlF1aWNrRG9tIiwiYWxsb3dlZE9wdGlvbnMiLCJub3JtYWxpemVHaXZlbkVsIiwidGFyZ2V0RWwiLCJ0ZXh0IiwiZG9tTm9kZSIsInRlbXBsYXRlIiwic3Bhd24iLCJpc1N0YXRlU3R5bGUiLCJyZWdpc3RlclN0eWxlIiwicnVsZSIsImxldmVsIiwiaW1wb3J0YW50IiwiY2FjaGVkIiwic3R5bGVDYWNoZSIsIm91dHB1dCIsImNsYXNzTmFtZSIsIkNTUyIsImZucyIsInByb3BzIiwicHJvcCIsInNldCIsImNvbnN0cnVjdG9yIiwiaW5kZXgiLCJsb2FkIiwicXVpY2tEb21FbCIsInN1YmplY3QiLCJRdWlja0VsZW1lbnQiLCJRdWlja1RlbXBsYXRlIiwib3B0aW9ucyIsInN2ZyIsImVsIiwiZXhpc3RpbmciLCJkb2N1bWVudCIsImNyZWF0ZVRleHROb2RlIiwiY3JlYXRlRWxlbWVudE5TIiwic3ZnTmFtZXNwYWNlIiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZCIsInByZXBlbmQiLCJhdHRyIiwiX3BhcmVudCIsIl9zdHlsZXMiLCJfc3RhdGUiLCJfY2hpbGRyZW4iLCJfbm9ybWFsaXplT3B0aW9ucyIsIl9hcHBseU9wdGlvbnMiLCJfYXR0YWNoU3RhdGVFdmVudHMiLCJfcHJveHlQYXJlbnQiLCJfcmVmcmVzaFBhcmVudCIsIl9xdWlja0VsZW1lbnQiLCJ0b0pTT04iLCJjaGlsZHJlbiIsImRlZmluZVByb3BlcnRpZXMiLCJzdHlsZSIsInJlcGxhY2UiLCJfZmlsdGVyRWxlbWVudHMiLCJwYXJlbnRzVW50aWwiLCJfZ2V0UGFyZW50cyIsImlzUmVmIiwibmV4dFBhcmVudCIsInJlZiIsInF1ZXJ5Iiwic2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yIiwicXVlcnlBbGwiLCJxdWVyeVNlbGVjdG9yQWxsIiwiUXVpY2tCYXRjaCIsImNoaWxkTm9kZXMiLCJyZWYxIiwibm9kZVR5cGUiLCJwYXJlbnROb2RlIiwiZG9tRG9jIiwibmV4dFNpYmxpbmciLCJuZXh0RWxlbWVudFNpYmxpbmciLCJuZXh0QWxsIiwic2libGluZ3MiLCJuZXh0IiwicHJldmlvdXNTaWJsaW5nIiwicHJldmlvdXNFbGVtZW50U2libGluZyIsInByZXZBbGwiLCJwcmV2U2libGluZyIsInByZXYiLCJyZXZlcnNlIiwiX2NoaWxkUmVmcyIsIl9nZXRDaGlsZFJlZnMiLCJfZ2V0SW5kZXhCeVByb3AiLCJwYXJlbnRzIiwiZnJlc2hDb3B5IiwicmVmcyIsImNoaWxkUmVmcyIsIm1haW4iLCJhcnJheSIsIkNBQ0hFRF9GTl9JTlNFUlRFRCIsImJ1YmJsZXMiLCJiYXNlMSIsInJlbGF0ZWRJbnN0YW5jZSIsInJlbGF0ZWQiLCJiYXNlMiIsImNsYXNzIiwidXJsIiwiaHJlZiIsInVucGFzc2FibGVTdGF0ZXMiLCJwYXNzU3RhdGVUb0NoaWxkcmVuIiwicGFzc0RhdGFUb0NoaWxkcmVuIiwic3RhdGVUcmlnZ2VycyIsImJhc2VTdGF0ZVRyaWdnZXJzIiwiX3BhcnNlVGV4dHMiLCJfdGV4dHMiLCJfcGFyc2VTdHlsZXMiLCJzdHlsZXMiLCJzdG9yZSIsIl9tZWRpYVN0YXRlcyIsIm9iamVjdFBsYWluIiwic3RhdGVzIiwic3BlY2lhbFN0YXRlcyIsInN0YXRlIiwiX3Byb3ZpZGVkU3RhdGVzIiwiX3N0YXRlU2hhcmVkIiwiX3Byb3ZpZGVkU3RhdGVzU2hhcmVkIiwiYmFzZSIsIiRiYXNlIiwiZm9yY2VTdHlsZSIsImZsYXR0ZW5OZXN0ZWRTdGF0ZXMiLCJzdHlsZU9iamVjdCIsImNoYWluIiwiaGFzTm9uU3RhdGVQcm9wcyIsInN0YXRlXyIsInN0YXRlQ2hhaW4iLCJzdGF0ZVN0eWxlcyIsInRleHRzIiwiaWQiLCJzcmMiLCJzZWxlY3RlZCIsImNoZWNrZWQiLCJhdHRycyIsIl9hcHBseVJlZ2lzdGVyZWRTdHlsZSIsInN0eWxlQWZ0ZXJJbnNlcnQiLCJpbnZva2VDb21wdXRlcnNPbmNlIiwiX2ludm9rZWRDb21wdXRlcnMiLCJyZWNhbGNPblJlc2l6ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZWNhbGNTdHlsZSIsImV2ZW50cyIsImhhbmRsZXIiLCJtZXRob2RzIiwicmVmMiIsIm1ldGhvZCIsImNvbmZpZ3VyYWJsZSIsIl9wb3N0Q3JlYXRpb24iLCJkYXRhIiwiY29tcHV0ZXJzIiwiYXBwbHlEYXRhIiwiX2luaXQiLCJfcnVuQ29tcHV0ZXIiLCJmb3JjZSIsImRpc2FibGVyIiwidHJpZ2dlciIsImVuYWJsZXIiLCJfbGlzdGVuVG8iLCJuZXdQYXJlbnQiLCJsYXN0UGFyZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiX3VucHJveHlQYXJlbnQiLCJlbWl0UHJpdmF0ZSIsIl9pbnNlcnRlZCIsIm1lZGlhU3RhdGVzIiwicXVlcnlTdHJpbmciLCJNZWRpYVF1ZXJ5IiwicmVnZXhXaGl0ZXNwYWNlIiwiZXZlbnROYW1lcyIsImNhbGxiYWNrIiwidXNlQ2FwdHVyZSIsImlzUHJpdmF0ZSIsImNhbGxiYWNrUmVmIiwiX2V2ZW50Q2FsbGJhY2tzIiwiX19yZWZzIiwiY2FsbCIsImV2ZW50TmFtZSIsIl9pbnZva2VIYW5kbGVycyIsIm9uY2UiLCJvbmNlQ2FsbGJhY2siLCJlbWl0IiwiY2FuY2VsYWJsZSIsImNyZWF0ZUV2ZW50IiwiaW5pdEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsImFyZyIsImNhbGxiYWNrcyIsImNiIiwiZXZlbnROYW1lVG9MaXN0ZW5Gb3IiLCJsaXN0ZW5NZXRob2QiLCJEVU1NWV9BUlJBWSIsInRhcmdldFN0YXRlIiwiYWN0aXZlU3RhdGVzIiwiX3N0YXRlUGlwZVRhcmdldCIsImRlc2lyZWRWYWx1ZSIsIl9nZXRBY3RpdmVTdGF0ZXMiLCJ0b2dnbGUiLCJ0b2dnbGVTdGF0ZSIsInJlc2V0U3RhdGUiLCJhY3RpdmVTdGF0ZSIsInBpcGVTdGF0ZSIsInRhcmdldFN0eWxlIiwic3VwZXJpb3JTdGF0ZXMiLCJpbmNsdWRlQmFzZSIsInNraXBGbnMiLCJhZGRDbGFzcyIsInN1cGVyaW9yU3R5bGVzIiwiX3Jlc29sdmVGblN0eWxlcyIsImVudHJ5IiwiX3JlbW92ZVJlZ2lzdGVyZWRTdHlsZSIsInJlbW92ZUNsYXNzIiwicmVzZXRWYWx1ZSIsIl90dXJuU3R5bGVPTiIsIl9nZXRTdXBlcmlvclN0YXRlcyIsInNoYXJlZFN0YXRlcyIsIl9nZXRTaGFyZWRTdGF0ZXMiLCJfdHVyblN0eWxlT0ZGIiwiYWN0aXZlU2hhcmVkU3RhdGVzIiwiX3R1cm5UZXh0T04iLCJ0YXJnZXRUZXh0IiwiX3R1cm5UZXh0T0ZGIiwic3RhdGVUb0V4Y2x1ZGUiLCJpbmNsdWRlU2hhcmVkU3RhdGVzIiwicGxhaW5TdGF0ZXMiLCJjYW5kaWRhdGUiLCJ0YXJnZXRTdGF0ZUluZGV4Iiwic3VwZXJpb3IiLCJpc0FwcGxpY2FibGUiLCJhc3BlY3RSYXRpb0dldHRlciIsInByb3BlcnR5IiwiYXJncyIsImN1cnJlbnRTdGF0ZVN0eWxlIiwiVU5TRVQiLCJzdHlsZVNhZmUiLCJza2lwQ29tcHV0ZWQiLCJjb21wdXRlZCIsInNhbXBsZSIsIm51bWJlciIsInN0eWxlUGFyc2VkIiwicmVjYWxjQ2hpbGRyZW4iLCJ0YXJnZXRTdHlsZXMiLCJoaWRlIiwic2hvdyIsImRpc3BsYXkiLCJvcmllbnRhdGlvbkdldHRlciIsIndpZHRoIiwiaGVpZ2h0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZ2V0QXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwidG9UZW1wbGF0ZSIsImNsb25lTm9kZSIsImVsQ2xvbmUiLCJuZXdFbCIsImsiLCJwcmV2UGFyZW50IiwiX3JlbW92ZUNoaWxkIiwiYXBwZW5kQ2hpbGQiLCJhcHBlbmRUbyIsInVuc2hpZnQiLCJpbnNlcnRCZWZvcmUiLCJmaXJzdENoaWxkIiwicHJlcGVuZFRvIiwiYWZ0ZXIiLCJteUluZGV4IiwiYmVmb3JlIiwiZGV0YWNoIiwicmVtb3ZlIiwiZW1wdHkiLCJ3cmFwIiwiY3VycmVudFBhcmVudCIsInVud3JhcCIsImdyYW5kUGFyZW50IiwicGFyZW50Q2hpbGRyZW4iLCJiYXRjaCIsInBhcmVudFNpYmxpbmciLCJoYXNDbGFzcyIsImNsYXNzTGlzdCIsInRhcmdldEluZGV4IiwidG9nZ2xlQ2xhc3MiLCJzZXRSZWYiLCJ0YXJnZXRDaGlsZCIsInJlcGxhY2VtZW50Q2hpbGQiLCJpbmRleE9mQ2hpbGQiLCJyZXBsYWNlQ2hpbGQiLCJyZW1vdmVDaGlsZCIsImlubmVySFRNTCIsInRleHRDb250ZW50IiwibGlzdCIsInBvcCIsInNoaWZ0IiwidXBkYXRlT3B0aW9ucyIsInVwZGF0ZVN0YXRlU3R5bGVzIiwicGFyc2VkIiwidXBkYXRlZFN0YXRlcyIsInVwZGF0ZVN0YXRlVGV4dHMiLCJwYXNzVGhyb3VnaCIsImhhc093blByb3BlcnR5IiwiY29tcHV0ZXIiLCJRdWlja1dpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsInBhcnNlUXVlcnkiLCJxdWVyeVNwbGl0IiwicnVsZXMiLCJydWxlRGVsaW1pdGVyIiwiZ2V0dGVyIiwiaXNOYU4iLCJrZXlQcmVmaXgiLCJtaW4iLCJvcmllbnRhdGlvbiIsImFzcGVjdFJhdGlvIiwicGFyc2VkVmFsdWUiLCJzdHJpbmdWYWx1ZSIsInRlc3RSdWxlIiwiY3VycmVudFZhbHVlIiwicGFzc2VkIiwiQXJyYXkiLCJwcmV2Q291bnQiLCJlbGVtZW50IiwiYXJnc0xlbmd0aCIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJ0cmVlIiwiaHRtbCIsImNvbnRhaW5lciIsImlzVGVtcGxhdGUiLCJpc1F1aWNrRWwiLCJpc0VsIiwiZG9tRWwiLCJlbGVtZW50cyIsInJldHVyblJlc3VsdHMxIiwicmV0dXJuUmVzdWx0cyIsInJldHVybiIsInJldHVybk5leHQiLCJsYXN0UmVzdWx0cyIsIml0ZXJhYmxlIiwiZXh0ZW5kVGVtcGxhdGUiLCJjdXJyZW50T3B0cyIsIm5ld09wdHMiLCJnbG9iYWxPcHRzIiwiY3VycmVudENoaWxkIiwiZ2xvYmFsT3B0c1RyYW5zZm9ybSIsIm9wdHMiLCJwYXJzZVRyZWUiLCJtYXRjaGVzU2NoZW1hIiwibnVsbERlbGV0ZXMiLCJub3REZWVwS2V5cyIsInRyYW5zZm9ybSIsImN1cnJlbnRDaGlsZHJlbiIsIm5ld0NoaWxkcmVuIiwibmVlZHNUZW1wbGF0ZVdyYXAiLCJub0NoYW5nZXMiLCJuZXdDaGlsZCIsIm5ld0NoaWxkUHJvY2Vzc2VkIiwic2NoZW1hIiwiYWxsb3dOdWxsIiwiZXh0ZW5kQnlSZWYiLCJyZW1haW5pbmdOZXdDaGlsZHJlbiIsIm5ld0NoaWxkcmVuUmVmcyIsInBhcnNlRXJyb3JQcmVmaXgiLCJwYXJzZUNoaWxkcmVuIiwiZG9tVGV4dCIsImFsbG93ZWRUZW1wbGF0ZU9wdGlvbnMiLCJpc1RyZWUiLCJuZXdWYWx1ZXMiLCJjaGlsZERhdGEiLCJzaG9ydGN1dCIsIlJlZ0V4cCIsIm9iamVjdGFibGUiLCJub3JtYWxpemVLZXlzIiwiaXNBcnJheSIsImlzQmFzZSIsInRoZVRhcmdldCIsIiRfaSIsInNvdXJjZXMiLCJtb2RpZmllcnMiLCJfIiwiZGVlcE9ubHkiLCJnbG9iYWxUcmFuc2Zvcm0iLCJ0cmFuc2Zvcm1zIiwiZ2xvYmFsRmlsdGVyIiwiZmlsdGVycyIsImFuaW1hdGlvbiIsIm9wYWNpdHkiLCJDb25kaXRpb24iLCJmYXN0ZG9tIiwiY3VycmVudElEIiwidHJhbnNmb3JtU2V0dGluZ3MiLCJJRCIsImFsbEZpZWxkcyIsImZpZWxkSW5zdGFuY2VzIiwiaW5zdGFuY2VzIiwiX3ZhbHVlIiwidmFsaWQiLCJ2aXNpYmxlIiwiZm9jdXNlZCIsImhvdmVyZWQiLCJmaWxsZWQiLCJpbnRlcmFjdGVkIiwiaXNNb2JpbGUiLCJkaXNhYmxlZCIsIm1hcmdpbiIsInBhZGRpbmciLCJzaG93TGFiZWwiLCJsYWJlbCIsInNob3dIZWxwIiwiaGVscCIsInNob3dFcnJvciIsImVycm9yIiwicGxhY2Vob2xkZXIiLCJpbml0IiwiY29uZGl0aW9ucyIsIl9jb25zdHJ1Y3RvckVuZCIsImNoaWxkZiIsImRlZmF1bHRWYWx1ZSIsIm11bHRpcGxlIiwidXBkYXRlT25CaW5kIiwib2YiLCJ0byIsImNvbmRpdGlvbiIsImFuZCIsImJpbmQiLCJwcmV2U2hvdyIsImNoYW5nZUFtb3VudCIsIm1ha2VSb29tRm9ySGVscCIsIm1vYmlsZVdpZHRoIiwibWVhc3VyZSIsIm1vYmlsZVRocmVzaG9sZCIsInVwZGF0ZU9uIiwiX3F1aWNrRmllbGQiLCJfZm9ybWF0V2lkdGgiLCJkaXN0YW5jZSIsImRlc3Ryb3kiLCJyZW1vdmVGcm9tRE9NIiwidW5CaW5kQWxsIiwiX2Rlc3Ryb3kiLCJhcHBseSIsInZhbGlkYXRlIiwicHJvdmlkZWRWYWx1ZSIsImNvcmVWYWx1ZVByb3AiLCJ0ZXN0VW5yZXF1aXJlZCIsInJlcG9ydCIsImlzVmFsaWQiLCJ2YWxpZGF0b3IiLCJyZXF1aXJlZCIsIl92YWxpZGF0ZSIsImNsZWFyRXJyb3JPblZhbGlkIiwidmFsaWRhdGVDb25kaXRpb25zIiwicGFzc2VkQ29uZGl0aW9ucyIsInRvZ2dsZVZpc2liaWxpdHkiLCJ2YWxpZGF0ZUFuZFJlcG9ydCIsImNob2ljZXMiLCJfZ2V0VmFsdWUiLCJfc2V0VmFsdWUiLCJzZXR0ZXIiLCJNYXNrIiwiUkVHRVgiLCJLRVlDT0RFUyIsIlRleHRGaWVsZCIsInR5cGluZyIsImN1cnNvciIsImN1cnJlbnQiLCJ2YWxpZFdoZW5SZWdleCIsImtleWJvYXJkIiwiZW1haWwiLCJtYXNrIiwicGF0dGVybiIsIl9jcmVhdGVFbGVtZW50cyIsIl9hdHRhY2hCaW5kaW5ncyIsImRyb3Bkb3duIiwic2V0VmFsdWUiLCJfcmVjYWxjRGlzcGxheSIsImF1dG9XaWR0aCIsIkRyb3Bkb3duIiwiaW5uZXJ3cmFwIiwiaWNvbiIsImlucHV0IiwiY2hlY2ttYXJrIiwiX2F0dGFjaEJpbmRpbmdzX2VsU3RhdGUiLCJfYXR0YWNoQmluZGluZ3NfZGlzcGxheSIsIl9hdHRhY2hCaW5kaW5nc19kaXNwbGF5X2F1dG9XaWR0aCIsIl9hdHRhY2hCaW5kaW5nc192YWx1ZSIsIl9hdHRhY2hCaW5kaW5nc19hdXRvY29tcGxldGUiLCJfYXR0YWNoQmluZGluZ3Nfc3RhdGVUcmlnZ2VycyIsInNldFRpbWVvdXQiLCJjaGVja21hcmtfbWFzazEiLCJjaGVja21hcmtfbWFzazIiLCJjaGVja21hcmtfcGF0Y2giLCJ1cGRhdGVFdmVuSWZTYW1lIiwiX2dldElucHV0QXV0b1dpZHRoIiwicmVzZXRJbnB1dCIsImlzRW1wdHkiLCJzZWxlY3Rpb24iLCJndWlkZSIsImtleUNvZGUiLCJlbnRlciIsImRlZmF1bHRPcHRpb25zIiwiaXNUeXBpbmciLCJpc09wZW4iLCJjYWxjRGlzcGxheSIsImNob2ljZSIsInNob3VsZEJlVmlzaWJsZSIsIm9uU2VsZWN0ZWQiLCJzZWxlY3RlZENob2ljZSIsImJsdXIiLCJlbmQiLCJfc2NoZWR1bGVDdXJzb3JSZXNldCIsImN1cnJlbnRDdXJzb3IiLCJuZXdDdXJzb3IiLCJub3JtYWxpemVDdXJzb3JQb3MiLCJfc2V0VmFsdWVJZk5vdFNldCIsImlucHV0V2lkdGgiLCJzY3JvbGxMZWZ0Iiwib2Zmc2V0V2lkdGgiLCJzY3JvbGxXaWR0aCIsImxhYmVsV2lkdGgiLCJyZWN0IiwiX2dldFdpZHRoU2V0dGluZyIsInBhcmVudFdpZHRoIiwibWF0Y2hpbmdDaG9pY2UiLCJ0ZXN0IiwidmFsaWRXaGVuSXNDaG9pY2UiLCJtaW5MZW5ndGgiLCJzdGFydCIsInNldFNlbGVjdGlvblJhbmdlIiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25FbmQiLCJmb2N1cyIsImFycmF5TXV0YXRvck1ldGhvZHMiLCJkdW1teVByb3BlcnR5RGVzY3JpcHRvciIsImJvdW5kSW5zdGFuY2VzIiwic2lsZW50IiwibmV3UGxhY2Vob2xkZXIiLCJjaGVja0lmIiwic2V0UGhvbGRlclJlZ0V4IiwiZGVsYXkiLCJ0aHJvdHRsZSIsInNpbXBsZVNlbGVjdG9yIiwicHJvbWlzZVRyYW5zZm9ybXMiLCJkaXNwYXRjaEV2ZW50cyIsInNlbmRBcnJheUNvcGllcyIsImdldERlc2NyaXB0b3IiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJjYWNoZWRFdmVudCIsImNoYW5nZUV2ZW50IiwiX3NiIiwicmVxdWlyZXNEb21EZXNjcmlwdG9yRml4IiwiRWxlbWVudCIsIndpbmRvd1Byb3BzVG9JZ25vcmUiLCJzZXRWYWx1ZU5vb3AiLCJ2IiwicHVibGlzaGVyIiwidXBkYXRlQWxsU3VicyIsImdlbklEIiwiZ2VuT2JqIiwiZ2VuUHJveGllZEludGVyZmFjZSIsImlzU3ViIiwiY29tcGxldGVDYWxsYmFjayIsImN1c3RvbU9wdGlvbnMiLCJzYXZlT3B0aW9ucyIsImdlblNlbGZVcGRhdGVyIiwiYmluZGluZyIsImZldGNoVmFsdWUiLCJzZWxmVXBkYXRlciIsIkJpbmRpbmciLCJmZXRjaERpcmVjdFZhbHVlIiwiaXNEZWZpbmVkIiwiaXNPYmplY3QiLCJpc1N0cmluZyIsImlzTnVtYmVyIiwiaXNGdW5jdGlvbiIsImlzQmluZGluZ0ludGVyZmFjZSIsIkJpbmRpbmdJbnRlcmZhY2UiLCJpc0JpbmRpbmciLCJpc0l0ZXJhYmxlIiwiaXNEb20iLCJpc0RvbUlucHV0IiwiaXNEb21SYWRpbyIsImlzRG9tQ2hlY2tib3giLCJpc0VsQ29sbGVjdGlvbiIsIk5vZGVMaXN0IiwiSFRNTENvbGxlY3Rpb24iLCJqUXVlcnkiLCJkb21FbHNBcmVTYW1lIiwiaXRlbXNXaXRoU2FtZVR5cGUiLCJpc0RvbU5vZGUiLCJjb252ZXJ0VG9MaXZlIiwiaXNQcm90byIsImRlc2NyaXB0b3IiLCJvYmplY3RQcm90byIsImdldFByb3RvdHlwZU9mIiwiZmV0Y2hEZXNjcmlwdG9yIiwiYmluZGluZ0luc3RhbmNlIiwib25seUFycmF5TWV0aG9kcyIsIm9yaWdEZXNjcmlwdG9yIiwib3JpZ0ZuIiwiY29udGV4dCIsImdldHRlclZhbHVlIiwicHJveHlGbiIsInNlbGZUcmFuc2Zvcm0iLCJpc0xpdmVQcm9wIiwidGFyZ2V0SW5jbHVkZXMiLCJwcm9wZXJ0eURlc2NyaXB0b3IiLCJvcmlnR2V0dGVyIiwib3JpZ1NldHRlciIsInNob3VsZFdyaXRlTGl2ZVByb3AiLCJDU1NTdHlsZURlY2xhcmF0aW9uIiwidHlwZUlzQXJyYXkiLCJzaG91bGRJbmRpY2F0ZVVwZGF0ZUlzRnJvbVNlbGYiLCJlbnVtZXJhYmxlIiwiY29udmVydFRvUmVnIiwibmV3RGVzY3JpcHRvciIsImNsb25lT2JqZWN0IiwiZXh0ZW5kU3RhdGUiLCJzdGF0ZVRvSW5oZXJpdCIsImNhY2hlIiwiaXNNdWx0aUNob2ljZSIsInNhbXBsZUl0ZW0iLCJfc2JfSUQiLCJfc2JfbWFwIiwiZ3JvdXBCaW5kaW5nIiwicHJvcHNNYXAiLCJhZGRUb05vZGVTdG9yZSIsInBob2xkZXJSZWdFeCIsInBob2xkZXJSZWdFeFNwbGl0IiwiZXNjYXBlUmVnRXgiLCJtaWRkbGUiLCJhcHBseVBsYWNlaG9sZGVycyIsImNvbnRleHRzIiwiaW5kZXhNYXAiLCJjb250ZXh0UGFydCIsIm5vZGVTdG9yZSIsIm5vZGUiLCJ0YXJnZXRQbGFjZWhvbGRlciIsInNjYW5UZXh0Tm9kZXNQbGFjZWhvbGRlcnMiLCJtYXRjaCIsInRleHRQaWVjZXMiLCJuZXdGcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJuZXdOb2RlIiwidGV4dFBpZWNlIiwiZ2V0RXJyU291cmNlIiwiZXJyb3JOYW1lIiwiZXJyb3JzIiwidGhyb3dXYXJuaW5nIiwid2FybmluZ05hbWUiLCJkZXB0aCIsImVyclNvdXJjZSIsInRocm93RXJyb3JCYWRBcmciLCJ0aHJvd0Vycm9yIiwic3RhY2siLCJpbnZhbGlkUGFyYW1OYW1lIiwiZm5Pbmx5IiwiYmFkRXZlbnRBcmciLCJlbXB0eUxpc3QiLCJvbmx5T25lRE9NRWxlbWVudCIsIm1peGVkRWxMaXN0IiwiaW50ZXJmYWNlVG9SZXR1cm4iLCJzZWxmQ2xvbmUiLCJuZXdJbnRlcmZhY2UiLCJzZXRPYmplY3QiLCJzZXRQcm9wZXJ0eSIsImJvdGhXYXlzIiwiYm91bmRJRCIsInByb3BNYXAiLCJyZW1vdmVBbGxTdWJzIiwicGFyZW50QmluZGluZyIsIm9wdGlvbnNEZWZhdWx0Iiwic3VicyIsInN1YnNNZXRhIiwicHVic01hcCIsImF0dGFjaGVkRXZlbnRzIiwiY2hvaWNlRWwiLCJjaG9pY2VCaW5kaW5nIiwiYWRkU3ViIiwidHJhbnNmb3JtRm4iLCJwYXJlbnRQcm9wZXJ0eSIsInNjYW5Gb3JQaG9sZGVycyIsInBob2xkZXJWYWx1ZXMiLCJwaG9sZGVyIiwidGV4dE5vZGVzIiwic3ViamVjdFZhbHVlIiwiYXR0YWNoRXZlbnRzIiwiZXZlbnRVcGRhdGVIYW5kbGVyIiwic3ViIiwidXBkYXRlT25jZSIsImFscmVhZHlIYWRTdWIiLCJpc011bHRpIiwic3ViSXRlbSIsIm1ldGFEYXRhIiwidmFsdWVSZWYiLCJyZW1vdmVTdWIiLCJyZW1vdmVQb2xsSW50ZXJ2YWwiLCJ1blJlZ2lzdGVyRXZlbnQiLCJjaG9pY2VOYW1lIiwiZnJvbVNlbGYiLCJmcm9tQ2hhbmdlRXZlbnQiLCJlbnRpcmVWYWx1ZSIsImxlbiIsImxlbjEiLCJuIiwibmV3Q2hvaWNlVmFsdWUiLCJuZXdDaG9pY2VzIiwibmV3VmFsdWVBcnJheSIsIm92ZXJ3cml0ZVByZXZpb3VzIiwicHJldkN1cnNyb3IiLCJwcmV2VmFsdWUiLCJ0YXJnZXRDaG9pY2VCaW5kaW5nIiwidGV4dE5vZGUiLCJwaG9sZGVyQ29udGV4dHMiLCJwaG9sZGVySW5kZXhNYXAiLCJ2YWx1ZVBhc3NlZCIsImlzRW1pdHRlciIsImVtaXRFdmVudCIsImFyciIsInVwZGF0ZVN1YiIsImlzRGVsYXllZFVwZGF0ZSIsImN1cnJlbnRUaW1lIiwibWV0YSIsInN1YlZhbHVlIiwidGltZVBhc3NlZCIsImRpc2FsbG93TGlzdCIsIkRhdGUiLCJsYXN0VXBkYXRlIiwiY2xlYXJUaW1lb3V0IiwidXBkYXRlVGltZXIiLCJjb25kaXRpb25GbiIsInRoZW4iLCJhZGRNb2RpZmllckZuIiwic3ViSW50ZXJmYWNlcyIsInN1YmplY3RGbiIsInN1YkludGVyZmFjZSIsInN1Yk1ldGFEYXRhIiwic3Vic2NyaWJlciIsImJpbmRpbmdzIiwic2V0U2VsZlRyYW5zZm9ybSIsImFkZERpc2FsbG93UnVsZSIsInRhcmdldFN1YiIsInRhcmdldERpc2FsbG93IiwiZSIsImFkZFBvbGxJbnRlcnZhbCIsInRpbWUiLCJwb2xsSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInBvbGxlZFZhbHVlIiwiY2xlYXJJbnRlcnZhbCIsImFkZFVwZGF0ZUxpc3RlbmVyIiwidGFyZ2V0UHJvcGVydHkiLCJzaG91bGRSZWRlZmluZVZhbHVlIiwicmVnaXN0ZXJFdmVudCIsImV2ZW50SGFuZGxlciIsImV2ZW50TWV0aG9kcyIsImxpc3RlbiIsImV4dHJhRGF0YSIsImV2ZW50T2JqZWN0IiwiYmluZGluZ0RhdGEiLCJpbmhlcml0ZWRTdGF0ZSIsInN0YWdlIiwib3B0aW9uc1Bhc3NlZCIsIkJpbmRpbmdJbnRlcmZhY2VQcml2YXRlIiwiZGVmaW5lTWFpblByb3BzIiwib2JqZWN0cyIsImNyZWF0ZUJpbmRpbmciLCJuZXdPYmplY3RUeXBlIiwiYmluZGluZ0ludGVyZmFjZSIsImNhY2hlZEJpbmRpbmciLCJwYXRjaENhY2hlZEJpbmRpbmciLCJuZXdCaW5kaW5nIiwib3B0aW9uIiwidG9TdHJpbmciLCJyZW1vdmVNZXRob2QiLCJlbWl0TWV0aG9kIiwiR3JvdXBCaW5kaW5nIiwiYWRkVG9QdWJsaXNoZXIiLCJwdWJsaXNoZXJJbnRlcmZhY2UiLCJNRVRIT0RfYm90aFdheXMiLCJNRVRIT0Rfb2YiLCJNRVRIT0Rfc2V0IiwiY2hhaW5UbyIsIk1FVEhPRF9jaGFpblRvIiwidHJhbnNmb3JtU2VsZiIsIk1FVEhPRF90cmFuc2Zvcm1TZWxmIiwiTUVUSE9EX3RyYW5zZm9ybSIsInRyYW5zZm9ybUFsbCIsIk1FVEhPRF90cmFuc2Zvcm1BbGwiLCJNRVRIT0RfY29uZGl0aW9uIiwiY29uZGl0aW9uQWxsIiwiTUVUSE9EX2NvbmRpdGlvbkFsbCIsInVuQmluZCIsIk1FVEhPRF91bkJpbmQiLCJwb2xsRXZlcnkiLCJNRVRIT0RfcG9sbEV2ZXJ5Iiwic3RvcFBvbGxpbmciLCJNRVRIT0Rfc3RvcFBvbGxpbmciLCJzZXRPcHRpb24iLCJNRVRIT0Rfc2V0T3B0aW9uIiwiZGlzYWxsb3dGcm9tIiwidGhpc0ludGVyZmFjZSIsImRpc2FsbG93SW50ZXJmYWNlIiwicmVtb3ZlVXBkYXRlciIsImNsb25lQmluZGluZyIsImNsb25lSW50ZXJmYWNlIiwiYWRkQmluZGluZyIsInNpYmxpbmdJbnRlcmZhY2UiLCJ1cGRhdGUiLCJ0d29XYXkiLCJwaXBlIiwic3BlY2lmaWNPcHRpb25zIiwiYWx0VHJhbnNmb3JtIiwic3ViQmluZGluZyIsIm9yaWdpblRyYW5zZm9ybSIsIm9yaWdpbkNvbmRpdGlvbiIsInRyYW5zZm9ybVRvVXNlIiwib3B0aW9uTmFtZSIsIm9iamVjdFR5cGUiLCJpbnRlcmZhY2UiLCJwcm90byIsIm1ldGhvZE5hbWUiLCJhIiwiYiIsImMiLCJkIiwiYW55IiwibnVtZXJpYyIsImxldHRlciIsIndpZGVudW1lcmljIiwiYWxwaGFudW1lcmljIiwicXVpY2tjc3MiLCJjb21wdXRlZFN0eWxlIiwic3ViRWwiLCJzdWJQcm9wZXJ0eSIsIm5vcm1hbGl6ZVByb3BlcnR5IiwiX2NvbXB1dGVkU3R5bGUiLCJnZXRDb21wdXRlZFN0eWxlIiwibm9ybWFsaXplVmFsdWUiLCJmcmFtZXMiLCJmcmFtZSIsInByZWZpeCIsImdldFByZWZpeCIsImdlbmVyYXRlZCIsInJ1bGVUb1N0cmluZyIsImlubGluZVN0eWxlIiwiaGFzaCIsImNsZWFyUmVnaXN0ZXJlZCIsImNsZWFySW5saW5lU3R5bGUiLCJpc1ZhbHVlU3VwcG9ydGVkIiwic3VwcG9ydHMiLCJzdXBwb3J0c1Byb3BlcnR5IiwiaXNQcm9wU3VwcG9ydGVkIiwiQ2hlY2tzIiwibmF0aXZlcyIsImRvbSIsInNldHMiLCJhdmFpbFNldHMiLCJzaG91bGREZWVwRXh0ZW5kIiwicGFyZW50S2V5Iiwic291cmNlVmFsdWUiLCJ0YXJnZXRWYWx1ZSIsInN1YlRhcmdldCIsIndpbiIsImRlYnVnIiwicmFmIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwid2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJzZWxmIiwicmVhZHMiLCJ3cml0ZXMiLCJGYXN0RG9tIiwiY3R4IiwidGFzayIsInNjaGVkdWxlRmx1c2giLCJtdXRhdGUiLCJjbGVhciIsIm1peGluIiwiaW5pdGlhbGl6ZSIsImNhdGNoIiwic2NoZWR1bGVkIiwiZmx1c2giLCJydW5UYXNrcyIsIm1lc3NhZ2UiLCJ0YXNrcyIsImRlZmluZSIsImZpZWxkMSIsInNhdGlzZmllZCIsIm9sZFZhbHVlIiwiY29tcGFyaXNvbiIsIm5lc3RlZE9iamVjdCIsInByb3BlcnR5Q2hhaW4iLCJjb21wYXJpc29uT3BlcmF0b3JzIiwicGFzc2VkQ29tcGFyaXNvbnMiLCJvcGVyYXRvciIsInNlZWtlZFZhbHVlIiwidGVzdE1hc2siLCJ2YWxpZENvbmRpdGlvbnMiLCJmb250RmFtaWx5IiwiYm9yZGVyIiwiaW5wdXRQYWRkaW5nIiwibGFiZWxTaXplIiwiaWNvblNpemUiLCJDaG9pY2UiLCJpbml0aWFsQ2hvaWNlcyIsInR5cGVCdWZmZXIiLCJfc2V0dGluZ0ZpbHRlcnMiLCJsYXN0U2VsZWN0ZWQiLCJjdXJyZW50SGlnaGxpZ2h0ZWQiLCJ2aXNpYmxlQ2hvaWNlc0NvdW50IiwidmlzaWJsZUNob2ljZXMiLCJlbHMiLCJfc2VsZWN0ZWRDYWxsYmFjayIsInNjcm9sbEluZGljYXRvclVwIiwic2Nyb2xsSW5kaWNhdG9yRG93biIsIkxpc3QiLCJhZGRDaG9pY2UiLCJfYXR0YWNoQmluZGluZ3Nfc2Nyb2xsSW5kaWNhdG9ycyIsInNjcm9sbFRvQ2hvaWNlIiwic2V0VHJhbnNsYXRlIiwibmV3Q2hvaWNlIiwicHJldkNob2ljZSIsInVwIiwiaGlnaGxpZ2h0UHJldiIsImRvd24iLCJoaWdobGlnaHROZXh0IiwiZXNjIiwiYW55UHJpbnRhYmxlIiwidHlwZUJ1ZmZlclRpbWVvdXQiLCJidWZmZXIiLCJjaG9pY2VJblZpZXciLCJzaG93Qm90dG9tSW5kaWNhdG9yIiwic2hvd1RvcEluZGljYXRvciIsInN0YXJ0U2Nyb2xsaW5nIiwic3RvcFNjcm9sbGluZyIsImZpbmRDaG9pY2UiLCJieUxhYmVsIiwibWF0Y2hlcyIsImZpbmRDaG9pY2VBbnkiLCJjdXJyZW50SW5kZXgiLCJzY3JvbGxVcCIsInNjcm9sbERvd24iLCJtYXhIZWlnaHQiLCJib3R0b21DdXRvZmYiLCJ0cmFuc2xhdGlvbiIsImNsaXBwaW5nUGFyZW50Iiwib3ZlcmZsb3ciLCJzZWxmUmVjdCIsImNsaXBwaW5nUmVjdCIsInRvcEN1dG9mZiIsImlzQm90dG9tQ3V0b2ZmIiwiaXNUb3BDdXRvZmYiLCJuZWVkc05ld0hlaWdodCIsImN1dG9mZiIsIndpbmRvd0N1dG9mZiIsIndpbmRvd0hlaWdodCIsInNldERpbWVuc2lvbnMiLCJvZmZzZXQiLCJkaXN0YW5lRnJvbVRvcCIsIm9mZnNldFRvcCIsInNlbGVjdGVkSGVpZ2h0IiwiY2hvaWNlUmVjdCIsImxpc3RSZWN0IiwidXBQYWRkaW5nIiwiZG93blBhZGRpbmciLCJkaXJlY3Rpb24iLCJzY3JvbGxJbnRlcnZhbElEIiwidW5hdmFpbGFibGUiLCJzb3J0Iiwic3RvcFByb3BhZ2F0aW9uIiwibmV3U3RhdGUiLCJwcmV2U3RhdGUiLCJtYXNrQ29yZSIsIm1hc2tBZGRvbnMiLCJkZWZhdWx0UGF0dGVybkNoYXJzIiwicHJldkN1cnNvciIsInBhdHRlcm5SYXciLCJwYXR0ZXJuU2V0dGVyIiwicGxhY2Vob2xkZXJDaGFyIiwicGxhY2Vob2xkZXJSZWdleCIsImtlZXBDaGFyUG9zaXRpb25zIiwiY2hhcnMiLCJjdXN0b21QYXR0ZXJucyIsInNldFBhdHRlcm4iLCJnZXRTdGF0ZSIsInJhd1ZhbHVlIiwiY3VycmVudENhcmV0UG9zaXRpb24iLCJwcmV2aW91c0NvbmZvcm1lZFZhbHVlIiwiZ2V0UGxhY2Vob2xkZXIiLCJjaGFyIiwicmVzb2x2ZVBhdHRlcm4iLCJ0cmFwSW5kZXhlcyIsImNvcHkiLCJwcmV2UGF0dGVybiIsInJlc29sdmVkUGF0dGVybiIsImNhcmV0VHJhcEluZGV4ZXMiLCJ1cGRhdGVWYWx1ZSIsInVwZGF0ZUZpZWxkIiwicGFyc2VQYXR0ZXJuIiwicGFyc2VUcmFuc2Zvcm0iLCJlbWFpbE1hc2siLCJ0cmltIiwicGFydCIsImNyZWF0ZU51bWJlck1hc2siLCJzdWZmaXgiLCJpbmNsdWRlVGhvdXNhbmRzU2VwYXJhdG9yIiwic2VwIiwidGhvdXNhbmRzU2VwYXJhdG9yU3ltYm9sIiwiYWxsb3dEZWNpbWFsIiwiZGVjaW1hbCIsImRlY2ltYWxMaW1pdCIsImludGVnZXJMaW1pdCIsImxpbWl0IiwiZXNjYXBlZCIsImNyZWF0ZUF1dG9Db3JyZWN0ZWREYXRlUGlwZSIsIm5ld1BhdHRlcm4iLCJjb25mb3JtVG9NYXNrIiwidHJhbnNmb3JtZWQiLCJjb25mb3JtZWRWYWx1ZSIsImluZGV4ZXNPZlBpcGVkQ2hhcnMiLCJhZGp1c3RDYXJldFBvc2l0aW9uIiwia2V5Q29kZXMiLCJkZWxldGUiLCJjdHJsIiwiYWx0Iiwic3VwZXIiLCJzdXBlcjIiLCJoeXBoZW4iLCJ1bmRlcnNjb3JlIiwicXVlc3Rpb24iLCJleGNsYW1hdGlvbiIsImZyb250c2xhc2giLCJiYWNrc2xhc2giLCJjb21tYSIsInBlcmlvZCIsInNwYWNlIiwiYW55QXJyb3ciLCJjb2RlIiwiYW55TW9kaWZpZXIiLCJhbnlBbHBoYSIsImFueU51bWVyaWMiLCJhbnlBbHBoYU51bWVyaWMiLCJDSEVDS01BUktfV0lEVEgiLCJDT0xPUlMiLCJwb3NpdGlvbiIsInZlcnRpY2FsQWxpZ24iLCJib3hTaXppbmciLCJ0ZXh0QWxpZ24iLCIkdmlzaWJsZSIsIiRzaG93RXJyb3IiLCJ6SW5kZXgiLCJmb250V2VpZ2h0IiwibGluZUhlaWdodCIsImdyZXkiLCJ0cmFuc2l0aW9uIiwidXNlclNlbGVjdCIsInBvaW50ZXJFdmVudHMiLCIkZmlsbGVkIiwiJHNob3dMYWJlbCIsIiRmb2N1cyIsIm9yYW5nZSIsInJlZCIsImJhY2tncm91bmRDb2xvciIsImJvcmRlcldpZHRoIiwiYm9yZGVyU3R5bGUiLCJib3JkZXJDb2xvciIsImdyZXlfbGlnaHQiLCJib3JkZXJSYWRpdXMiLCIkZGlzYWJsZWQiLCJpY29uU2libGluZyIsImlucHV0U2libGluZyIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1JpZ2h0Iiwic3VidHJhY3QiLCJhcHBlYXJhbmNlIiwib3V0bGluZSIsImJsYWNrIiwiYm94U2hhZG93IiwiYmFja2dyb3VuZENsaXAiLCJ0b3RhbEhlaWdodCIsIndvcmthYmxlSGVpZ2h0IiwiZmxvb3IiLCJob3JpeiIsInZlcnRpIiwidmlzaWJpbGl0eSIsIiRzaG93SGVscCIsInBhZGRpbmdUb3AiLCJncmVlbiIsInRyYW5zZm9ybU9yaWdpbiIsIiRpbnZhbGlkIiwibWF4V2lkdGgiLCJtaW5XaWR0aCIsIlNBTVBMRV9TVFlMRSIsInRvS2ViYWJDYXNlIiwic2tpcEluaXRpYWxDaGVjayIsImdyZWF0IiwibGVzcyIsInBpdm90IiwiaHNoIiwiY2hhckNvZGVBdCIsImlubGluZVN0eWxlQ29uZmlnIiwic3R5bGVDb25maWciLCJ2YWx1ZVRvU3RvcmUiLCJzdHlsZUVsIiwiaGVhZCIsImNvbnRlbnQiLCJSRUdFWF9MRU5fVkFMIiwiUkVHRVhfRElHSVRTIiwiUkVHRVhfU1BBQ0UiLCJSRUdFWF9LRUJBQiIsIklNUE9SVEFOVCIsIlBPU1NJQkxFX1BSRUZJWEVTIiwiUkVRVUlSRVNfVU5JVF9WQUxVRSIsIlFVQURfU0hPUlRIQU5EUyIsIkRJUkVDVElPTlMiLCJudW1iZXJMb29zZSIsIk51bWJlciIsImRvbVRleHRhcmVhIiwiZG9tSW5wdXQiLCJkb21TZWxlY3QiLCJkb21GaWVsZCIsIlNWRyIsIiRpc09wZW4iLCIkaGFzVmlzaWJsZUNob2ljZXMiLCJvdmVyZmxvd1Njcm9sbGluZyIsIm92ZXJmbG93U3R5bGUiLCIkdW5hdmFpbGFibGUiLCIkaG92ZXIiLCJzdHJva2UiLCIkc2VsZWN0ZWQiLCJ0ZXh0T3ZlcmZsb3ciLCJ3b3JkV3JhcCIsImNhcmV0VXAiLCJjYXJldERvd24iLCJib3JkZXJUb3AiLCJyIiwiYW1kIiwidGV4dE1hc2tDb3JlIiwidCIsIm8iLCJsb2FkZWQiLCJtIiwicCIsIl9fZXNNb2R1bGUiLCJwcmV2aW91c1BsYWNlaG9sZGVyIiwidSIsImwiLCJzIiwiZiIsImgiLCJnIiwieSIsIkMiLCJQIiwieCIsIk8iLCJNIiwiVCIsInciLCJWIiwiUyIsInN1YnN0ciIsIk4iLCJFIiwiQSIsIkkiLCJKIiwicSIsIkYiLCJMIiwiVyIsInoiLCJEIiwiSCIsIksiLCJRIiwiY29udmVydE1hc2tUb1BsYWNlaG9sZGVyIiwiYWJzIiwiaXNOZXciLCJzb21lQ2hhcnNSZWplY3RlZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJtYXNrV2l0aG91dENhcmV0VHJhcHMiLCJpbmRleGVzIiwicHJvY2Vzc0NhcmV0VHJhcHMiLCJpbnB1dEVsZW1lbnQiLCJzaG93TWFzayIsInJlamVjdGVkIiwiYWN0aXZlRWxlbWVudCIsImFzc2lnbiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidGV4dE1hc2tBZGRvbnMiLCJkZCIsIm1tIiwieXkiLCJ5eXl5Iiwic29tZSIsImxhc3RJbmRleE9mIiwiJCIsImRlY2ltYWxTeW1ib2wiLCJyZXF1aXJlRGVjaW1hbCIsImFsbG93TmVnYXRpdmUiLCJhbGxvd0xlYWRpbmdaZXJvZXMiLCJpbnN0YW5jZU9mIiwiZ3JleV9kYXJrIiwiZ3JleV9zZW1pX2xpZ2h0IiwiZ3JleV9saWdodDIiLCJncmV5X2xpZ2h0MyIsImdyZXlfbGlnaHQ0IiwiU3RhdGVDaGFpbiIsIndpdGhvdXQiLCJvdGhlckFjdGl2ZSIsImFjdGl2ZSIsImFuZ2xlRG93biIsInBsdXMiLCJ2aWV3Qm94IiwidGFiaW5kZXgiLCJmb2N1c2FibGUiLCJmaWxsIiwicG9pbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUE7VUFFVTtBQURWQSxNQUdNO0FBRk5DLEtBSUs7QUFI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T0FBT0MsVUFBVXZELElBQUlrSyxTQUNwQixDQUFDLFFBQ0FpSTtPQUNDNmpDO1NBQVM7QUFDVEMsVUFBVSxDQUFDO0FBQ1hDLFdBQVc7O0FBQ1pocEMsT0FDQ2lNO09BQU87QUFDUEMsUUFBUTtBQUNSNnpCLFNBQVM7O0dBRVYsQ0FBQyxTQUNBOTZCO09BQ0M4akM7VUFBVSxDQUFDO0FBQ1hDLFdBQVc7QUFDWDdZLEdBQUc7O0lBR0wsQ0FBQyxTQUNBbHJCO09BQ0M4akM7VUFBVSxDQUFDO0FBQ1hDLFdBQVc7QUFDWDdZLEdBQUciLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaGVscGVycyA9IGltcG9ydCAnLi9oZWxwZXJzJ1xuRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbklTID0gaW1wb3J0ICcuL2NoZWNrcydcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xucmVnaXN0ZXJBbmltYXRpb25zID0gaW1wb3J0ICcuL2FuaW1hdGlvbnMnXG5SRVFVSVJFRF9GSUVMRF9NRVRIT0RTID0gaW1wb3J0ICcuL2NvbnN0YW50cy9yZXFGaWVsZE1ldGhvZHMnXG5pbXBvcnQgJy4vY29uc29sZVBhdGNoJ1xuXG5cbm5ld0J1aWxkZXIgPSAoc2V0dGluZ092ZXJyaWRlcywgdGVtcGxhdGVPdmVycmlkZXMpLT5cblx0YnVpbGRlciA9IChzZXR0aW5ncyktPlxuXHRcdHNldHRpbmdzID0gZXh0ZW5kLmNsb25lKGFyZ3VtZW50cy4uLikgaWYgYXJndW1lbnRzLmxlbmd0aCA+IDFcblx0XHRzZXR0aW5ncyA9IHt9IHVubGVzcyBJUy5vYmplY3Qoc2V0dGluZ3MpXG5cdFx0c2V0dGluZ3MudHlwZSA/PSAndGV4dCdcblxuXG5cdFx0aWYgbm90IEZpZWxkW3NldHRpbmdzLnR5cGVdXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJRdWlja0ZpZWxkOiAnI3tzZXR0aW5ncy50eXBlfScgaXMgbm90IGEgdmFsaWQvcmVnaXN0ZXJlZCBmaWVsZCB0eXBlXCJcblxuXHRcdHJlZ2lzdGVyQW5pbWF0aW9ucygpXG5cdFx0bmV3IEZpZWxkW3NldHRpbmdzLnR5cGVdKHNldHRpbmdzLCBidWlsZGVyLCBzZXR0aW5nT3ZlcnJpZGVzLCB0ZW1wbGF0ZU92ZXJyaWRlcylcblxuXG5cdGJ1aWxkZXIucmVnaXN0ZXIgPSAodHlwZSwgdGFyZ2V0RmllbGQpLT5cblx0XHRpZiBub3QgSVMuc3RyaW5nKHR5cGUpIG9yIG5vdCBJUy5mdW5jdGlvbih0YXJnZXRGaWVsZClcblx0XHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrRmllbGQgUmVnaXN0cmF0aW9uOiBpbnZhbGlkIGFyZ3VtZW50c1wiXG5cdFx0Zm9yIHJlcXVpcmVkTWV0aG9kIGluIFJFUVVJUkVEX0ZJRUxEX01FVEhPRFNcblx0XHRcdGlmIG5vdCB0YXJnZXRGaWVsZDo6W3JlcXVpcmVkTWV0aG9kXVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJRdWlja0ZpZWxkIFJlZ2lzdHJhdGlvbjogJyN7cmVxdWlyZWRNZXRob2R9JyBtZXRob2QgaXMgcmVxdWlyZWQgaW4gb3JkZXIgdG8gcmVnaXN0ZXIgdGhlIGZpZWxkXCJcblxuXHRcdEZpZWxkW3R5cGVdID0gdGFyZ2V0RmllbGRcblx0XHRyZXR1cm4gQFxuXG5cblx0YnVpbGRlci5jb25maWcgPSAobmV3U2V0dGluZ3MsIG5ld1RlbXBsYXRlcyktPlxuXHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrRmllbGQgQ29uZmlnOiBpbnZhbGlkIGNvbmZpZyBvYmplY3QgcHJvdmlkZWQgI3tTdHJpbmcgbmV3U2V0dGluZ3N9XCIgaWYgbm90IElTLm9iamVjdChuZXdTZXR0aW5ncylcblx0XHRvdXRwdXRTZXR0aW5ncyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRcblx0XHRmb3IgdHlwZSxjb25maWcgb2YgbmV3U2V0dGluZ3Ncblx0XHRcdGlmIHR5cGUgaXMgJ2dsb2JhbCdcblx0XHRcdFx0b3V0cHV0U2V0dGluZ3MuZ2xvYmFsRGVmYXVsdHMgPSBleHRlbmQuZGVlcC5ub3REZWVwKEZpZWxkLnNoYWxsb3dTZXR0aW5ncykuY2xvbmUoRmllbGQ6Omdsb2JhbERlZmF1bHRzLCBjb25maWcpXG5cdFx0XHRlbHNlIGlmIEZpZWxkW3R5cGVdXG5cdFx0XHRcdG91dHB1dFNldHRpbmdzW3R5cGVdID0gZXh0ZW5kLmNsb25lLmRlZXAubm90RGVlcChGaWVsZC5zaGFsbG93U2V0dGluZ3MpKEZpZWxkW3R5cGVdOjpkZWZhdWx0cywgY29uZmlnKVxuXG5cdFx0aWYgSVMub2JqZWN0KG5ld1RlbXBsYXRlcylcblx0XHRcdG91dHB1dFRlbXBsYXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRcdGdsb2JhbENvbmZpZyA9IG5ld1RlbXBsYXRlcy5nbG9iYWxcblx0XHRcdGlmIGdsb2JhbENvbmZpZyBhbmQgZ2xvYmFsQ29uZmlnLmZpZWxkIGFuZCBub3QgZ2xvYmFsQ29uZmlnLmRlZmF1bHRcblx0XHRcdFx0Z2xvYmFsQ29uZmlnLmRlZmF1bHQgPSBnbG9iYWxDb25maWcuZmllbGRcblx0XHRcdFxuXHRcdFx0Zm9yIHR5cGUgb2YgRmllbGRcblx0XHRcdFx0b3JpZ2luYWxUZW1wbGF0ZXMgPSBGaWVsZFt0eXBlXTo6Py50ZW1wbGF0ZXNcblx0XHRcdFx0dGVtcGxhdGVzID0gbmV3VGVtcGxhdGVzW3R5cGVdIG9yIGdsb2JhbENvbmZpZ1xuXHRcdFx0XHRpZiBub3Qgb3JpZ2luYWxUZW1wbGF0ZXNcblx0XHRcdFx0XHRjb250aW51ZVxuXHRcdFx0XHRpZiBub3QgdGVtcGxhdGVzXG5cdFx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW3R5cGVdID0gb3JpZ2luYWxUZW1wbGF0ZXNcblx0XHRcdFx0XHRjb250aW51ZVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgdGVtcGxhdGVzLmZpZWxkIGFuZCBub3QgdGVtcGxhdGVzLmRlZmF1bHRcblx0XHRcdFx0XHR0ZW1wbGF0ZXMuZGVmYXVsdCA9IHRlbXBsYXRlcy5maWVsZFxuXG5cdFx0XHRcdG91dHB1dFRlbXBsYXRlc1t0eXBlXSA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRcdFx0XG5cdFx0XHRcdGZvciBuYW1lLGNvbmZpZyBvZiB0ZW1wbGF0ZXNcblx0XHRcdFx0XHRjb250aW51ZSBpZiBuYW1lIGlzICdmaWVsZCcgb3Igbm90IG9yaWdpbmFsVGVtcGxhdGVzW25hbWVdXG5cdFx0XHRcdFx0Y29uZmlnID0gZXh0ZW5kLmNsb25lLmRlZXAuY29uY2F0KGdsb2JhbENvbmZpZ1tuYW1lXSwgY29uZmlnKSBpZiBnbG9iYWxDb25maWcgYW5kIGdsb2JhbENvbmZpZ1tuYW1lXVxuXHRcdFx0XHRcdG91dHB1dFRlbXBsYXRlc1t0eXBlXVtuYW1lXSA9IG9yaWdpbmFsVGVtcGxhdGVzW25hbWVdLmV4dGVuZChjb25maWcpXG5cblx0XHRcdFx0Zm9yIG5hbWUsY29uZmlnIG9mIG9yaWdpbmFsVGVtcGxhdGVzIHdoZW4gbm90IG91dHB1dFRlbXBsYXRlc1t0eXBlXVtuYW1lXVxuXHRcdFx0XHRcdG91dHB1dFRlbXBsYXRlc1t0eXBlXVtuYW1lXSA9IGNvbmZpZ1xuXG5cdFx0cmV0dXJuIG5ld0J1aWxkZXIob3V0cHV0U2V0dGluZ3MsIG91dHB1dFRlbXBsYXRlcylcblxuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5IGJ1aWxkZXIsICdmaWVsZHMnLCBnZXQ6ICgpLT5cblx0XHRleHRlbmQuY2xvbmUub3duLm5vdEtleXMoJ2luc3RhbmNlcycpKEZpZWxkKVxuXG5cdGJ1aWxkZXIuc2V0dGluZ092ZXJyaWRlcyA9IHNldHRpbmdPdmVycmlkZXNcblx0YnVpbGRlci50ZW1wbGF0ZU92ZXJyaWRlcyA9IHRlbXBsYXRlT3ZlcnJpZGVzXG5cdGJ1aWxkZXIudmVyc2lvbiA9IGltcG9ydCAnLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbidcblx0YnVpbGRlci5GaWVsZCA9IEZpZWxkID0gaW1wb3J0ICcuL2ZpZWxkJ1xuXHRyZXR1cm4gYnVpbGRlclxuXG5cblxuXG5cblxuUXVpY2tGaWVsZCA9IG5ld0J1aWxkZXIoKVxuUXVpY2tGaWVsZC5yZWdpc3RlciAndGV4dCcsIGltcG9ydCAnLi9maWVsZC90ZXh0J1xuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICd0ZXh0YXJlYScsIGltcG9ydCAnLi9maWVsZC90ZXh0YXJlYSdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnbnVtYmVyJywgaW1wb3J0ICcuL2ZpZWxkL251bWJlcidcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnc2VsZWN0JywgaW1wb3J0ICcuL2ZpZWxkL3NlbGVjdCdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnY2hvaWNlJywgaW1wb3J0ICcuL2ZpZWxkL2Nob2ljZSdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAndHJ1ZWZhbHNlJywgaW1wb3J0ICcuL2ZpZWxkL3RydWVmYWxzZSdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAndG9nZ2xlJywgaW1wb3J0ICcuL2ZpZWxkL3RvZ2dsZSdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAnZ3JvdXAnLCBpbXBvcnQgJy4vZmllbGQvZ3JvdXAnXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ3JlcGVhdGVyJywgaW1wb3J0ICcuL2ZpZWxkL3JlcGVhdGVyJ1xuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdmaWxlJywgaW1wb3J0ICcuL2ZpZWxkL2ZpbGUnXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrRmllbGQiLCIjIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5AY29uc29sZSA/PSB7fVxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuY29uc29sZS5sb2cgPz0gKCktPlxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuY29uc29sZS53YXJuID89IGNvbnNvbGUubG9nIiwie1xuICBcIm5hbWVcIjogXCJxdWlja2ZpZWxkXCIsXG4gIFwidmVyc2lvblwiOiBcIjEuMC44M1wiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiRmFzdCAmIGxpZ2h0IGZvcm0gZmllbGRzIG1hbmFnZW1lbnQgc3VwcG9ydGluZyByZWFsLXRpbWUgYmluZGluZ3MsIGN1c3RvbSBzdHlsaW5nLCBjdXN0b20gZmllbGRzLCBJRTkrLCBhbmQgbW9yZS4uLlwiLFxuICBcIm1haW5cIjogXCJkaXN0L3F1aWNrZmllbGQuanNcIixcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3F1aWNrZmllbGQuZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9xdWlja2ZpZWxkLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZFwiOiBcInNyYy9maWVsZC9pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdGV4dFwiOiBcInNyYy9maWVsZC90ZXh0L19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdGV4dGFyZWFcIjogXCJzcmMvZmllbGQvdGV4dGFyZWEvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9udW1iZXJcIjogXCJzcmMvZmllbGQvbnVtYmVyL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvc2VsZWN0XCI6IFwic3JjL2ZpZWxkL3NlbGVjdC9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL2Nob2ljZVwiOiBcInNyYy9maWVsZC9jaG9pY2UvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC90cnVlZmFsc2VcIjogXCJzcmMvZmllbGQvdHJ1ZWZhbHNlL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvdG9nZ2xlXCI6IFwic3JjL2ZpZWxkL3RvZ2dsZS9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL2dyb3VwXCI6IFwic3JjL2ZpZWxkL2dyb3VwL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvcmVwZWF0ZXJcIjogXCJzcmMvZmllbGQvcmVwZWF0ZXIvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9maWxlXCI6IFwic3JjL2ZpZWxkL2ZpbGUvX2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiZmlsZXNcIjogW1xuICAgIFwic3JjXCIsXG4gICAgXCJkaXN0XCJcbiAgXSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgW1xuICAgICAgICBcImJhYmVsaWZ5XCIsXG4gICAgICAgIHtcbiAgICAgICAgICBcInByZXNldHNcIjogW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBcIkBiYWJlbC9wcmVzZXQtZW52XCIsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm1vZHVsZXNcIjogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwiZmFsc2UgJiYgbnBtIHJ1biB0ZXN0OnRyYXZpcyB8fCB0cnVlXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcImdpdCBwdXNoXCIsXG4gICAgXCJ3YXRjaFwiOiBcImNha2UgLWQgd2F0Y2hcIixcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDp0cmF2aXNcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcInRlc3Q6bG9jYWxcIjogXCJvcGVuIHRlc3QvdGVzdHJ1bm5lci5odG1sXCIsXG4gICAgXCJ0ZXN0Om1pbmlmaWVkXCI6IFwibWluaWZpZWQ9MSBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0Omthcm1hXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpicm93c2VyXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEVsZWN0cm9uIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6Y2hyb21lXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBDaHJvbWUgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpmaXJlZm94XCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEZpcmVmb3ggLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOmJhZGdlXCI6IFwiYmFkZ2UtZ2VuIC1kIC4vLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2ZpZWxkLmdpdFwiXG4gIH0sXG4gIFwiYXV0aG9yXCI6IFwiZGFuaWVsa2FsZW5cIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tmaWVsZC9pc3N1ZXNcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZmllbGQjcmVhZG1lXCIsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBkYW5pZWxrYWxlbi9pc1wiOiBcIl4yLjAuMFwiLFxuICAgIFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRcIjogXCJeMS4xNS44XCIsXG4gICAgXCJmYXN0ZG9tXCI6IFwiXjEuMC42XCIsXG4gICAgXCJsZXZlblwiOiBcIl4yLjAuMFwiLFxuICAgIFwibW92ZS1qc1wiOiBcIl4wLjUuMFwiLFxuICAgIFwicXVpY2tjc3NcIjogXCJeMS40LjFcIixcbiAgICBcInF1aWNrZG9tXCI6IFwiXjEuMC44OVwiLFxuICAgIFwic21hcnQtZXh0ZW5kXCI6IFwiXjEuNy4zXCIsXG4gICAgXCJ0ZXh0LW1hc2stYWRkb25zXCI6IFwiXjMuNi4wXCIsXG4gICAgXCJ0ZXh0LW1hc2stY29yZVwiOiBcIl41LjAuMVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBiYWJlbC9jb3JlXCI6IFwiXjcuMS42XCIsXG4gICAgXCJAYmFiZWwvcHJlc2V0LWVudlwiOiBcIl43LjEuNlwiLFxuICAgIFwiYmFiZWxpZnlcIjogXCJeMTAuMC4wXCIsXG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY2hhbGtcIjogXCJeMi4wLjFcIixcbiAgICBcImNvZmZlZS1zY3JpcHRcIjogXCJeMS4xMi42XCIsXG4gICAgXCJjb2ZmZWVpZnktY2FjaGVkXCI6IFwiXjMuMC4wXCIsXG4gICAgXCJmcy1qZXRwYWNrXCI6IFwiXjIuMi4wXCIsXG4gICAgXCJrZXlzaW1cIjogXCJnaXRodWI6ZGFuaWVsa2FsZW4va2V5c2ltLmpzXCIsXG4gICAgXCJwYWNrYWdlLWluc3RhbGxcIjogXCJeMS4yLjZcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuOVwiLFxuICAgIFwic2ltcGx5d2F0Y2hcIjogXCJeMy4wLjBcIlxuICB9XG59XG4iLCJJUyA9IGltcG9ydCAnLi9jaGVja3MnXG5ET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5yZWdleCA9IGltcG9ydCAnLi9jb25zdGFudHMvcmVnZXgnXG5cbmhlbHBlcnMgPSBleHBvcnRzXG5oZWxwZXJzLm5vb3AgPSAoKS0+XG5cbmhlbHBlcnMuaW5jbHVkZXMgPSAodGFyZ2V0LCBpdGVtKS0+XG5cdHRhcmdldCBhbmQgdGFyZ2V0LmluZGV4T2YoaXRlbSkgaXNudCAtMVxuXG5oZWxwZXJzLnJlcGVhdCA9IChzdHJpbmcsIGNvdW50KS0+XG5cdChzdHJpbmcgZm9yIGkgaW4gWzEuLmNvdW50XSkuam9pbignJylcblxuaGVscGVycy5yZW1vdmVJdGVtID0gKHRhcmdldCwgaXRlbSktPlxuXHRpdGVtSW5kZXggPSB0YXJnZXQuaW5kZXhPZihpdGVtKVxuXHR0YXJnZXQuc3BsaWNlKGl0ZW1JbmRleCwgMSkgaWYgaXRlbUluZGV4IGlzbnQgLTFcblxuaGVscGVycy5pbnNlcnRBZnRlciA9ICh0YXJnZXQsIGl0ZW0sIG5ld0l0ZW0pLT5cblx0aXRlbUluZGV4ID0gdGFyZ2V0LmluZGV4T2YoaXRlbSlcblx0dGFyZ2V0LnNwbGljZShpdGVtSW5kZXgsIDAsIG5ld0l0ZW0pIGlmIGl0ZW1JbmRleCBpc250IC0xXG5cbmhlbHBlcnMuZmluZCA9ICh0YXJnZXQsIGZuKS0+XG5cdHJlc3VsdHMgPSB0YXJnZXQuZmlsdGVyKGZuKVxuXHRyZXN1bHRzWzBdXG5cbmhlbHBlcnMuZGlmZiA9IChzb3VyY2UsIGNvbXBhcmVlKS0+XG5cdHJlc3VsdCA9IFtdXG5cdG1heExlbiA9IE1hdGgubWF4KHNvdXJjZS5sZW5ndGgsIGNvbXBhcmVlLmxlbmd0aClcblx0aSA9IC0xXG5cdFxuXHR3aGlsZSArK2kgPCBtYXhMZW5cblx0XHRzb3VyY2VWYWwgPSBzb3VyY2VbaV1cblx0XHRjb21wYXJlZVZhbCA9IGNvbXBhcmVlW2ldXG5cblx0XHRpZiBzb3VyY2VWYWwgaXNudCBjb21wYXJlZVZhbFxuXHRcdFx0cmVzdWx0LnB1c2goc291cmNlVmFsKSBpZiBJUy5kZWZpbmVkKHNvdXJjZVZhbCkgYW5kIG5vdCBoZWxwZXJzLmluY2x1ZGVzKGNvbXBhcmVlLCBzb3VyY2VWYWwpXG5cdFx0XHRyZXN1bHQucHVzaChjb21wYXJlZVZhbCkgaWYgSVMuZGVmaW5lZChjb21wYXJlZVZhbCkgYW5kIG5vdCBoZWxwZXJzLmluY2x1ZGVzKHNvdXJjZSwgY29tcGFyZWVWYWwpXG5cblx0cmV0dXJuIHJlc3VsdFxuXG5cbmhlbHBlcnMuaGV4VG9SR0JBID0gKGhleCwgYWxwaGEpLT5cblx0aGV4ID0gaGV4LnNsaWNlKDEpIGlmIGhleFswXSBpcyAnIydcblx0UiA9IHBhcnNlSW50IGhleC5zbGljZSgwLDIpLCAxNlxuXHRHID0gcGFyc2VJbnQgaGV4LnNsaWNlKDIsNCksIDE2XG5cdEIgPSBwYXJzZUludCBoZXguc2xpY2UoNCw2KSwgMTZcblx0cmV0dXJuIFwicmdiYSgje1J9LCAje0d9LCAje0J9LCAje2FscGhhfSlcIlxuXG5cbmhlbHBlcnMuZGVmYXVsdENvbG9yID0gKGNvbG9yLCBkZWZhdWx0Q29sb3IpLT5cblx0aWYgY29sb3IgaXMgJ3RyYW5zcGFyZW50JyBvciBub3QgY29sb3Jcblx0XHRyZXR1cm4gZGVmYXVsdENvbG9yXG5cdGVsc2Vcblx0XHRyZXR1cm4gY29sb3JcblxuXG5oZWxwZXJzLmNhbGNQYWRkaW5nID0gKGRlc2lyZWRIZWlnaHQsIGZvbnRTaXplKS0+XG5cdE1hdGguY2VpbCAoZGVzaXJlZEhlaWdodCAtIGZvbnRTaXplKjEuMjMxKS8yXG5cblxuaGVscGVycy51bmxvY2tTY3JvbGwgPSAoZXhjbHVkZWRFbCktPlxuXHR3aW5kb3cuX2lzTG9ja2VkID0gZmFsc2Vcblx0RE9NKHdpbmRvdykub2ZmICd3aGVlbC5sb2NrJ1xuXG5cbmhlbHBlcnMubG9ja1Njcm9sbCA9IChleGNsdWRlZEVsKS0+IHVubGVzcyB3aW5kb3cuX2lzTG9ja2VkXG5cdHdpbmRvdy5faXNMb2NrZWQgPSB0cnVlXG5cdERPTSh3aW5kb3cpLm9uICd3aGVlbC5sb2NrJywgKGV2ZW50KS0+XG5cdFx0aWYgZXZlbnQudGFyZ2V0IGlzIGV4Y2x1ZGVkRWwucmF3IG9yIERPTShldmVudC50YXJnZXQpLnBhcmVudE1hdGNoaW5nKChwYXJlbnQpLT4gcGFyZW50IGlzIGV4Y2x1ZGVkRWwpXG5cdFx0XHRpZiBldmVudC53aGVlbERlbHRhID4gMCBhbmQgZXhjbHVkZWRFbC5yYXcuc2Nyb2xsVG9wIGlzIDBcblx0XHRcdFx0cmV0dXJuIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuXHRcdFx0aWYgZXZlbnQud2hlZWxEZWx0YSA8IDAgYW5kIGV4Y2x1ZGVkRWwucmF3LnNjcm9sbEhlaWdodCAtIGV4Y2x1ZGVkRWwucmF3LnNjcm9sbFRvcCBpcyBleGNsdWRlZEVsLnJhdy5jbGllbnRIZWlnaHRcblx0XHRcdFx0cmV0dXJuIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuXHRcdGVsc2Vcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuXG5oZWxwZXJzLmZ1enp5TWF0Y2ggPSAobmVlZGxlLCBoYXlzdGFjaywgY2FzZVNlbnNpdGl2ZSktPlxuXHRuTGVuZ3RoID0gbmVlZGxlLmxlbmd0aFxuXHRoTGVuZ3RoID0gaGF5c3RhY2subGVuZ3RoXG5cdHVubGVzcyBjYXNlU2Vuc2l0aXZlXG5cdFx0bmVlZGxlID0gbmVlZGxlLnRvVXBwZXJDYXNlKClcblx0XHRoYXlzdGFjayA9IGhheXN0YWNrLnRvVXBwZXJDYXNlKClcblxuXHRpZiBuTGVuZ3RoID4gaExlbmd0aFxuXHRcdHJldHVybiBmYWxzZVxuXHRpZiBuTGVuZ3RoIGlzIGhMZW5ndGhcblx0XHRyZXR1cm4gbmVlZGxlIGlzIGhheXN0YWNrXG5cblx0bkkgPSBoSSA9IG1hdGNoZWRDb3VudCA9MFxuXHR3aGlsZSBuSSA8IG5MZW5ndGhcblx0XHRuZWVkbGVDaGFyID0gbmVlZGxlW25JKytdXG5cdFx0XG5cdFx0d2hpbGUgaEkgPCBoTGVuZ3RoXG5cdFx0XHRpZiBoYXlzdGFja1toSSsrXSBpcyBuZWVkbGVDaGFyXG5cdFx0XHRcdG1hdGNoZWRDb3VudCsrXG5cdFx0XHRcdGJyZWFrXG5cblx0cmV0dXJuIG1hdGNoZWRDb3VudCBpcyBuTGVuZ3RoXG5cblxuaGVscGVycy5zdGFydHNXaXRoID0gKG5lZWRsZSwgaGF5c3RhY2ssIGNhc2VTZW5zaXRpdmUpLT5cblx0dW5sZXNzIGNhc2VTZW5zaXRpdmVcblx0XHRuZWVkbGUgPSBuZWVkbGUudG9VcHBlckNhc2UoKVxuXHRcdGhheXN0YWNrID0gaGF5c3RhY2sudG9VcHBlckNhc2UoKVxuXG5cdGlmIG5lZWRsZS5sZW5ndGggPiBoYXlzdGFjay5sZW5ndGhcblx0XHRyZXR1cm4gZmFsc2Vcblx0aWYgbmVlZGxlLmxlbmd0aCBpcyBoYXlzdGFjay5sZW5ndGhcblx0XHRyZXR1cm4gbmVlZGxlIGlzIGhheXN0YWNrXG5cblx0aSA9IC0xXG5cdHdoaWxlIG5lZWRsZVsrK2ldXG5cdFx0cmV0dXJuIGZhbHNlIGlmIG5lZWRsZVtpXSBpc250IGhheXN0YWNrW2ldXG5cdHJldHVybiB0cnVlXG5cblxuaGVscGVycy5nZXRJbmRleE9mRmlyc3REaWZmID0gKHNvdXJjZVN0cmluZywgY29tcGFyZVN0cmluZyktPlxuXHRjdXJyZW50UG9zID0gMFxuXHRtYXhMZW5ndGggPSBNYXRoLm1heChzb3VyY2VTdHJpbmcubGVuZ3RoLCBjb21wYXJlU3RyaW5nLmxlbmd0aClcblx0XG5cdHdoaWxlIGN1cnJlbnRQb3MgPCBtYXhMZW5ndGhcblx0XHRyZXR1cm4gY3VycmVudFBvcyBpZiBzb3VyY2VTdHJpbmdbY3VycmVudFBvc10gaXNudCBjb21wYXJlU3RyaW5nW2N1cnJlbnRQb3NdXG5cdFx0Y3VycmVudFBvcysrXG5cdFxuXHRyZXR1cm4gbnVsbFxuXG5cblxuaGVscGVycy5wYXJzZUNzc1Nob3J0aGFuZFZhbHVlID0gKHN0cmluZyktPlxuXHR2YWx1ZXMgPSBzdHJpbmcuc3BsaXQocmVnZXgud2hpdGVTcGFjZSkubWFwKHBhcnNlRmxvYXQpXG5cdHJlc3VsdCA9IHt9XG5cdHN3aXRjaCB2YWx1ZXMubGVuZ3RoXG5cdFx0d2hlbiAxXG5cdFx0XHRyZXN1bHQudG9wID0gcmVzdWx0LnJpZ2h0ID0gcmVzdWx0LmJvdHRvbSA9IHJlc3VsdC5sZWZ0ID0gdmFsdWVzWzBdXG5cdFx0d2hlbiAyXG5cdFx0XHRyZXN1bHQudG9wID0gcmVzdWx0LmJvdHRvbSA9IHZhbHVlc1swXVxuXHRcdFx0cmVzdWx0LnJpZ2h0ID0gcmVzdWx0LmxlZnQgPSB2YWx1ZXNbMV1cblx0XHR3aGVuIDNcblx0XHRcdHJlc3VsdC50b3AgPSB2YWx1ZXNbMF1cblx0XHRcdHJlc3VsdC5yaWdodCA9IHJlc3VsdC5sZWZ0ID0gdmFsdWVzWzFdXG5cdFx0XHRyZXN1bHQuYm90dG9tID0gdmFsdWVzWzJdXG5cdFx0d2hlbiA0XG5cdFx0XHRyZXN1bHQudG9wID0gdmFsdWVzWzBdXG5cdFx0XHRyZXN1bHQucmlnaHQgPSB2YWx1ZXNbMV1cblx0XHRcdHJlc3VsdC5ib3R0b20gPSB2YWx1ZXNbMl1cblx0XHRcdHJlc3VsdC5sZWZ0ID0gdmFsdWVzWzNdXG5cblx0cmV0dXJuIHJlc3VsdFxuXG5cbmhlbHBlcnMuc2hvcnRoYW5kU2lkZVZhbHVlID0gKHZhbHVlLCBzaWRlKS0+XG5cdHN3aXRjaCB0eXBlb2YgdmFsdWVcblx0XHR3aGVuICdudW1iZXInIHRoZW4gdmFsdWVcblx0XHR3aGVuICdzdHJpbmcnXG5cdFx0XHR2YWx1ZXMgPSBoZWxwZXJzLnBhcnNlQ3NzU2hvcnRoYW5kVmFsdWUodmFsdWUpXG5cdFx0XHR2YWx1ZXNbc2lkZV1cblx0XHRlbHNlIDBcblxuXG5oZWxwZXJzLnVwZGF0ZVNob3J0aGFuZFZhbHVlID0gKHZhbHVlLCBzaWRlLCBuZXdWYWx1ZSktPlxuXHR2YWx1ZXMgPSBoZWxwZXJzLnBhcnNlQ3NzU2hvcnRoYW5kVmFsdWUoJycrKHZhbHVlIG9yIDApKVxuXHRzd2l0Y2ggc2lkZVxuXHRcdHdoZW4gJ3RvcCcgdGhlbiB2YWx1ZXMudG9wICs9IG5ld1ZhbHVlXG5cdFx0d2hlbiAncmlnaHQnIHRoZW4gdmFsdWVzLnJpZ2h0ICs9IG5ld1ZhbHVlXG5cdFx0d2hlbiAnYm90dG9tJyB0aGVuIHZhbHVlcy5ib3R0b20gKz0gbmV3VmFsdWVcblx0XHR3aGVuICdsZWZ0JyB0aGVuIHZhbHVlcy5sZWZ0ICs9IG5ld1ZhbHVlXG5cdFx0ZWxzZSBPYmplY3Qua2V5cyh2YWx1ZXMpLmZvckVhY2ggKHNpZGUpLT4gdmFsdWVzW3NpZGVdICs9IG5ld1ZhbHVlXG5cdFxuXHRcIiN7dmFsdWVzLnRvcH1weCAje3ZhbHVlcy5yaWdodH1weCAje3ZhbHVlcy5ib3R0b219cHggI3t2YWx1ZXMubGVmdH1weFwiXG5cblxuaGVscGVycy5pbmhlcml0UHJvdG8gPSAoY2hpbGQsIHBhcmVudCwga2V5cyktPlxuXHRmb3Iga2V5IGluIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHBhcmVudDo6KVxuXHRcdGNvbnRpbnVlIGlmIGtleXMgYW5kIG5vdCBrZXlzLmluY2x1ZGVzKGtleSlcblx0XHR1bmxlc3MgY2hpbGQ6OltrZXldXG5cdFx0XHRjaGlsZDo6W2tleV0gPSBwYXJlbnQ6OltrZXldXG5cblx0cmV0dXJuIGNoaWxkXG5cblxuXG5cblxuXG5cblxuIiwiIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuaW1wb3J0ICogYXMgQ1NTIGZyb20gJ3F1aWNrY3NzJ1xuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuaW1wb3J0ICogYXMgZXh0ZW5kIGZyb20gJ3NtYXJ0LWV4dGVuZCdcbmltcG9ydCAnLi9wYXJ0cy9hbGxvd2VkT3B0aW9ucydcbmltcG9ydCAnLi9wYXJ0cy9oZWxwZXJzJ1xuaW1wb3J0ICcuL3BhcnRzL2NoZWNrcydcbmltcG9ydCAnLi9wYXJ0cy9lbGVtZW50J1xuaW1wb3J0ICcuL3BhcnRzL3dpbmRvdydcbmltcG9ydCAnLi9wYXJ0cy9tZWRpYVF1ZXJ5J1xuXG5RdWlja0RvbSA9ICgpLT5cblx0YXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKVxuXHRhcmdzW2ldID0gYXJnIGZvciBhcmcsaSBpbiBhcmd1bWVudHNcblx0cHJldkNvdW50ID0gUXVpY2tFbGVtZW50LmNvdW50XG5cdGVsZW1lbnQgPSBRdWlja0RvbS5jcmVhdGUoYXJncylcblx0ZWxlbWVudC5fcG9zdENyZWF0aW9uKCkgaWYgZWxlbWVudCBhbmQgZWxlbWVudC5fcG9zdENyZWF0aW9uIGFuZCBRdWlja0VsZW1lbnQuY291bnQgaXNudCBwcmV2Q291bnRcblx0cmV0dXJuIGVsZW1lbnRcblxuUXVpY2tEb20uY3JlYXRlID0gKGFyZ3MpLT4gc3dpdGNoXG5cdHdoZW4gSVMuYXJyYXkoYXJnc1swXSlcblx0XHRyZXR1cm4gUXVpY2tEb20oYXJnc1swXS4uLilcblx0XG5cdHdoZW4gSVMudGVtcGxhdGUoYXJnc1swXSlcblx0XHRyZXR1cm4gYXJnc1swXS5zcGF3bigpXG5cdFxuXHR3aGVuIElTLnF1aWNrRG9tRWwoYXJnc1swXSlcblx0XHRyZXR1cm4gaWYgYXJnc1sxXSB0aGVuIGFyZ3NbMF0udXBkYXRlT3B0aW9ucyhhcmdzWzFdKSBlbHNlIGFyZ3NbMF1cblx0XG5cdHdoZW4gSVMuZG9tTm9kZShhcmdzWzBdKSBvciBJUy5kb21Eb2MoYXJnc1swXSlcblx0XHRpZiBhcmdzWzBdLl9xdWlja0VsZW1lbnRcblx0XHRcdHJldHVybiBhcmdzWzBdLl9xdWlja0VsZW1lbnRcblx0XHRcblx0XHR0eXBlID0gYXJnc1swXS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyMnLCAnJylcblx0XHRvcHRpb25zID0gYXJnc1sxXSBvciB7fVxuXHRcdG9wdGlvbnMuZXhpc3RpbmcgPSBhcmdzWzBdXG5cdFx0cmV0dXJuIG5ldyBRdWlja0VsZW1lbnQodHlwZSwgb3B0aW9ucylcblxuXHR3aGVuIGFyZ3NbMF0gaXMgd2luZG93XG5cdFx0cmV0dXJuIFF1aWNrV2luZG93XG5cblx0d2hlbiBJUy5zdHJpbmcoYXJnc1swXSlcdFx0XHRcblx0XHR0eXBlID0gYXJnc1swXS50b0xvd2VyQ2FzZSgpXG5cdFx0aWYgdHlwZSBpcyAndGV4dCdcblx0XHRcdG9wdGlvbnMgPSBpZiBJUy5vYmplY3QoYXJnc1sxXSkgdGhlbiBhcmdzWzFdIGVsc2Uge3RleHQ6YXJnc1sxXSBvciAnJ31cblx0XHRlbHNlXG5cdFx0XHRvcHRpb25zID0gaWYgSVMub2JqZWN0KGFyZ3NbMV0pIHRoZW4gYXJnc1sxXSBlbHNlIHt9XG5cdFx0XG5cdFx0ZWxlbWVudCA9IG5ldyBRdWlja0VsZW1lbnQodHlwZSwgb3B0aW9ucylcblx0XHRpZiBhcmdzLmxlbmd0aCA+IDJcblx0XHRcdGNoaWxkcmVuID0gbmV3IEFycmF5KGFyZ3NMZW5ndGggPSBhcmdzLmxlbmd0aCk7IGkgPSAxO1xuXHRcdFx0Y2hpbGRyZW5baSsxXSA9IGFyZ3NbaV0gd2hpbGUgKytpIDwgYXJnc0xlbmd0aFxuXG5cdFx0XHRmb3IgY2hpbGQgaW4gY2hpbGRyZW5cblx0XHRcdFx0Y2hpbGQgPSBRdWlja0RvbS50ZXh0KGNoaWxkKSBpZiBJUy5zdHJpbmcoY2hpbGQpXG5cdFx0XHRcdGNoaWxkID0gUXVpY2tEb20oY2hpbGQuLi4pIGlmIElTLmFycmF5KGNoaWxkKVxuXHRcdFx0XHRlbGVtZW50LmFwcGVuZChjaGlsZCkgaWYgSVMucXVpY2tEb21FbChjaGlsZClcblxuXHRcdHJldHVybiBlbGVtZW50XG5cblx0d2hlbiBhcmdzWzBdIGFuZCAoSVMuZG9tTm9kZShhcmdzWzBdWzBdKSBvciBJUy5kb21Eb2MoYXJnc1swXVswXSkpXG5cdFx0cmV0dXJuIFF1aWNrRG9tKGFyZ3NbMF1bMF0pXG5cblxuUXVpY2tEb20udGVtcGxhdGUgPSAodHJlZSktPlxuXHRuZXcgUXVpY2tUZW1wbGF0ZSh0cmVlLCB0cnVlKVxuXG5cblF1aWNrRG9tLmh0bWwgPSAoaW5uZXJIVE1MKS0+XG5cdGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdGNvbnRhaW5lci5pbm5lckhUTUwgPSBpbm5lckhUTUxcblx0Y2hpbGRyZW4gPSBBcnJheTo6c2xpY2UuY2FsbCBjb250YWluZXIuY2hpbGROb2Rlc1xuXG5cdHJldHVybiBRdWlja0RvbS5iYXRjaChjaGlsZHJlbilcblxuUXVpY2tEb20ucXVlcnkgPSAodGFyZ2V0KS0+XG5cdFF1aWNrRG9tKGRvY3VtZW50KS5xdWVyeSh0YXJnZXQpXG5cblF1aWNrRG9tLnF1ZXJ5QWxsID0gKHRhcmdldCktPlxuXHRRdWlja0RvbShkb2N1bWVudCkucXVlcnlBbGwodGFyZ2V0KVxuXG5RdWlja0RvbS5pc1RlbXBsYXRlID0gKHRhcmdldCktPlxuXHRJUy50ZW1wbGF0ZSh0YXJnZXQpXG5cblF1aWNrRG9tLmlzUXVpY2tFbCA9ICh0YXJnZXQpLT5cblx0SVMucXVpY2tEb21FbCh0YXJnZXQpXG5cblF1aWNrRG9tLmlzRWwgPSAodGFyZ2V0KS0+XG5cdElTLmRvbUVsKHRhcmdldClcblxuXG5cblxuaW1wb3J0ICcuL3BhcnRzL2JhdGNoJ1xuaW1wb3J0ICcuL3BhcnRzL3RlbXBsYXRlJ1xuaW1wb3J0ICcuL3BhcnRzL3Nob3J0Y3V0cydcblF1aWNrRG9tLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nXG5RdWlja0RvbS5DU1MgPSBDU1Ncbm1vZHVsZS5leHBvcnRzID0gUXVpY2tEb21cblxuXG5cbiIsImFsbG93ZWRUZW1wbGF0ZU9wdGlvbnMgPSBbICMgVG8gY29weSBmcm9tIERPTSBFbGVtZW50c1xuXHQnaWQnXG5cdCduYW1lJ1xuXHQndHlwZSdcblx0J2hyZWYnXG5cdCdzZWxlY3RlZCdcblx0J2NoZWNrZWQnXG5cdCdjbGFzc05hbWUnXG5dXG5cbmFsbG93ZWRPcHRpb25zID0gWyAjIFVzZWQgaW4gUXVpY2tFbGVtZW50Ojp0b0pTT05cblx0J2lkJ1xuXHQncmVmJ1xuXHQndHlwZSdcblx0J25hbWUnXG5cdCd0ZXh0J1xuXHQnc3R5bGUnXG5cdCdjbGFzcydcblx0J2NsYXNzTmFtZSdcblx0J3VybCdcblx0J2hyZWYnXG5cdCdzZWxlY3RlZCdcblx0J2NoZWNrZWQnXG5cdCdwcm9wcydcblx0J2F0dHJzJ1xuXHQncGFzc1N0YXRlVG9DaGlsZHJlbidcblx0J3N0YXRlVHJpZ2dlcnMnXG5cdCMgJ3JlbGF0ZWRJbnN0YW5jZSdcbl0iLCJoZWxwZXJzID0ge31cblxuaGVscGVycy5pbmNsdWRlcyA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0dGFyZ2V0IGFuZCB0YXJnZXQuaW5kZXhPZihpdGVtKSBpc250IC0xXG5cbmhlbHBlcnMucmVtb3ZlSXRlbSA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0aXRlbUluZGV4ID0gdGFyZ2V0LmluZGV4T2YoaXRlbSlcblx0dGFyZ2V0LnNwbGljZShpdGVtSW5kZXgsIDEpICBpZiBpdGVtSW5kZXggaXNudCAtMVxuXHRyZXR1cm4gdGFyZ2V0XG5cbmhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCA9ICh0YXJnZXRFbCktPiBzd2l0Y2hcblx0d2hlbiBJUy5zdHJpbmcodGFyZ2V0RWwpIHRoZW4gUXVpY2tEb20udGV4dCh0YXJnZXRFbClcblx0d2hlbiBJUy5kb21Ob2RlKHRhcmdldEVsKSB0aGVuIFF1aWNrRG9tKHRhcmdldEVsKVxuXHR3aGVuIElTLnRlbXBsYXRlKHRhcmdldEVsKSB0aGVuIHRhcmdldEVsLnNwYXduKClcblx0ZWxzZSB0YXJnZXRFbFxuXG5cbmhlbHBlcnMuaXNTdGF0ZVN0eWxlID0gKHN0cmluZyktPlxuXHRzdHJpbmdbMF0gaXMgJyQnIG9yIHN0cmluZ1swXSBpcyAnQCdcblxuXG5oZWxwZXJzLnJlZ2lzdGVyU3R5bGUgPSAocnVsZSwgbGV2ZWwsIGltcG9ydGFudCktPlxuXHRsZXZlbCB8fD0gMFxuXHRjYWNoZWQgPSBzdHlsZUNhY2hlLmdldChydWxlLCBsZXZlbClcblx0cmV0dXJuIGNhY2hlZCBpZiBjYWNoZWRcblx0b3V0cHV0ID0ge2NsYXNzTmFtZTpbQ1NTLnJlZ2lzdGVyKHJ1bGUsIGxldmVsLCBpbXBvcnRhbnQpXSwgZm5zOltdLCBydWxlfVxuXHRwcm9wcyA9IE9iamVjdC5rZXlzKHJ1bGUpXG5cdFxuXHRmb3IgcHJvcCBpbiBwcm9wcyB3aGVuIHR5cGVvZiBydWxlW3Byb3BdIGlzICdmdW5jdGlvbidcblx0XHRvdXRwdXQuZm5zLnB1c2ggW3Byb3AsIHJ1bGVbcHJvcF1dXG5cblx0cmV0dXJuIHN0eWxlQ2FjaGUuc2V0KHJ1bGUsIG91dHB1dCwgbGV2ZWwpXG5cblxuc3R5bGVDYWNoZSA9IG5ldyBjbGFzc1xuXHRjb25zdHJ1Y3RvcjogKCktPlxuXHRcdEBrZXlzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdEB2YWx1ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cblx0Z2V0OiAoa2V5LCBsZXZlbCktPiBpZiBAa2V5c1tsZXZlbF1cblx0XHRpbmRleCA9IEBrZXlzW2xldmVsXS5pbmRleE9mKGtleSlcblx0XHRyZXR1cm4gQHZhbHVlc1tsZXZlbF1baW5kZXhdIGlmIGluZGV4IGlzbnQgLTFcblxuXHRzZXQ6IChrZXksIHZhbHVlLCBsZXZlbCktPlxuXHRcdGlmIG5vdCBAa2V5c1tsZXZlbF1cblx0XHRcdEBrZXlzW2xldmVsXSA9IFtdXG5cdFx0XHRAdmFsdWVzW2xldmVsXSA9IFtdXG5cblx0XHRAa2V5c1tsZXZlbF0ucHVzaCBrZXlcblx0XHRAdmFsdWVzW2xldmVsXS5wdXNoIHZhbHVlXG5cdFx0cmV0dXJuIHZhbHVlXG5cbiIsIklTID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vaXMnXG5JUyA9IElTLmNyZWF0ZSgnbmF0aXZlcycsJ2RvbScpXG5JUy5sb2FkXHRcblx0cXVpY2tEb21FbDogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5jb25zdHJ1Y3Rvci5uYW1lIGlzIFF1aWNrRWxlbWVudC5uYW1lXG5cdFxuXHR0ZW1wbGF0ZTogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5jb25zdHJ1Y3Rvci5uYW1lIGlzIFF1aWNrVGVtcGxhdGUubmFtZVxuXHRcblx0IyBiYXRjaDogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5jb25zdHJ1Y3Rvci5uYW1lIGlzICdRdWlja0JhdGNoJ1xuXG4iLCJzdmdOYW1lc3BhY2UgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnXG5cbmNsYXNzIFF1aWNrRWxlbWVudFxuXHRAY291bnQgPSAwXG5cdGNvbnN0cnVjdG9yOiAoQHR5cGUsIEBvcHRpb25zKS0+XG5cdFx0UXVpY2tFbGVtZW50LmNvdW50Kytcblx0XHRAc3ZnID0gdHJ1ZSBpZiBAdHlwZVswXSBpcyAnKidcblx0XHRAZWwgPSBAb3B0aW9ucy5leGlzdGluZyBvclxuXHRcdFx0aWYgQHR5cGUgaXMgJ3RleHQnIHRoZW4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaWYgdHlwZW9mIEBvcHRpb25zLnRleHQgaXMgJ3N0cmluZycgdGhlbiBAb3B0aW9ucy50ZXh0IGVsc2UgJycpXG5cdFx0XHRlbHNlIGlmIEBzdmcgdGhlbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnTmFtZXNwYWNlLCBAdHlwZS5zbGljZSgxKSlcblx0XHRcdGVsc2UgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChAdHlwZSlcblxuXHRcdGlmIEB0eXBlIGlzICd0ZXh0J1xuXHRcdFx0QGFwcGVuZCA9IEBwcmVwZW5kID0gQGF0dHIgPSAoKS0+XG5cdFx0XHQjIEBfdGV4dHMgPSB7fSAjIGRlZmluZWQgY29uZGl0aW9uYWxseVxuXG5cdFx0QF9wYXJlbnQgPSBudWxsXG5cdFx0QF9zdHlsZXMgPSB7fVxuXHRcdEBfc3RhdGUgPSBbXVxuXHRcdEBfY2hpbGRyZW4gPSBbXVxuXHRcdCMgQF9wcm92aWRlZFN0YXRlcyA9IFtdXHRcdFx0XHQjIGRlZmluZWQgY29uZGl0aW9uYWxseVxuXHRcdCMgQF9wcm92aWRlZFN0YXRlc1NoYXJlZCA9IFtdXHRcdCMgZGVmaW5lZCBjb25kaXRpb25hbGx5XG5cdFx0IyBAX2V2ZW50Q2FsbGJhY2tzID0ge19fcmVmczp7fX1cdCMgZGVmaW5lZCBjb25kaXRpb25hbGx5XG5cdFx0XG5cdFx0QF9ub3JtYWxpemVPcHRpb25zKClcblx0XHRAX2FwcGx5T3B0aW9ucygpXG5cdFx0QF9hdHRhY2hTdGF0ZUV2ZW50cygpXG5cdFx0QF9wcm94eVBhcmVudCgpXG5cdFx0QF9yZWZyZXNoUGFyZW50KCkgaWYgQG9wdGlvbnMuZXhpc3Rpbmdcblx0XHRAZWwuX3F1aWNrRWxlbWVudCA9IEBcblxuXG5cdHRvSlNPTjogKCktPlxuXHRcdG91dHB1dCA9IFtAdHlwZSwgZXh0ZW5kLmNsb25lLmtleXMoYWxsb3dlZE9wdGlvbnMpKEBvcHRpb25zKV1cblx0XHRjaGlsZHJlbiA9IEBjaGlsZHJlblxuXHRcdG91dHB1dC5wdXNoKGNoaWxkLnRvSlNPTigpKSBmb3IgY2hpbGQgaW4gY2hpbGRyZW5cblx0XHRyZXR1cm4gb3V0cHV0XG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrRWxlbWVudC5uYW1lID89ICdRdWlja0VsZW1lbnQnXG5cbmltcG9ydCAnLi9hbGlhc2VzJ1xuaW1wb3J0ICcuL3RyYXZlcnNpbmcnXG5pbXBvcnQgJy4vaW5pdCdcbmltcG9ydCAnLi9ldmVudHMnXG5pbXBvcnQgJy4vc3RhdGUnXG5pbXBvcnQgJy4vc3R5bGUnXG5pbXBvcnQgJy4vYXR0cmlidXRlcy1hbmQtcHJvcGVydGllcydcbmltcG9ydCAnLi9tYW5pcHVsYXRpb24nXG5pbXBvcnQgJy4vYXBwbGljYXRpb24nXG4iLCJPYmplY3QuZGVmaW5lUHJvcGVydGllcyBRdWlja0VsZW1lbnQ6Oixcblx0J3Jhdyc6IGdldDogKCktPiBAZWxcblx0JzAnOiBnZXQ6ICgpLT4gQGVsXG5cdCdjc3MnOiBnZXQ6ICgpLT4gQHN0eWxlXG5cdCdyZXBsYWNlV2l0aCc6IGdldDogKCktPiBAcmVwbGFjZVxuXHQncmVtb3ZlTGlzdGVuZXInOiBnZXQ6ICgpLT4gQG9mZlxuXG4iLCJRdWlja0VsZW1lbnQ6OnBhcmVudHNVbnRpbCA9IChmaWx0ZXIpLT5cblx0X2dldFBhcmVudHMoQCwgZmlsdGVyKVxuXG5RdWlja0VsZW1lbnQ6OnBhcmVudE1hdGNoaW5nID0gKGZpbHRlciktPlxuXHRpZiBJUy5mdW5jdGlvbihmaWx0ZXIpIG9yIGlzUmVmPUlTLnN0cmluZyhmaWx0ZXIpXG5cdFx0bmV4dFBhcmVudCA9IEBwYXJlbnRcblx0XHR3aGlsZSBuZXh0UGFyZW50XG5cdFx0XHRpZiBpc1JlZlxuXHRcdFx0XHRyZXR1cm4gbmV4dFBhcmVudCBpZiBuZXh0UGFyZW50LnJlZiBpcyBmaWx0ZXJcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIG5leHRQYXJlbnQgaWYgZmlsdGVyKG5leHRQYXJlbnQpXG5cblx0XHRcdG5leHRQYXJlbnQgPSBuZXh0UGFyZW50LnBhcmVudFxuXHRcdFxuXHRyZXR1cm5cblxuUXVpY2tFbGVtZW50OjpxdWVyeSA9IChzZWxlY3RvciktPlxuXHRRdWlja0RvbSBAcmF3LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG5cblF1aWNrRWxlbWVudDo6cXVlcnlBbGwgPSAoc2VsZWN0b3IpLT5cblx0cmVzdWx0ID0gQHJhdy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxuXHRvdXRwdXQgPSBbXTsgb3V0cHV0LnB1c2goaXRlbSkgZm9yIGl0ZW0gaW4gcmVzdWx0XG5cdHJldHVybiBuZXcgUXVpY2tCYXRjaChvdXRwdXQpXG5cblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBRdWlja0VsZW1lbnQ6Oixcblx0J2NoaWxkcmVuJzogZ2V0OiAoKS0+XG5cdFx0aWYgQGVsLmNoaWxkTm9kZXMubGVuZ3RoIGlzbnQgQF9jaGlsZHJlbi5sZW5ndGggIyBSZS1jb2xsZWN0IGNoaWxkcmVuXHRcblx0XHRcdEBfY2hpbGRyZW4ubGVuZ3RoID0gMCAjIEVtcHR5IG91dCBjaGlsZHJlbiBhcnJheVxuXHRcdFx0QF9jaGlsZHJlbi5wdXNoKFF1aWNrRG9tKGNoaWxkKSkgZm9yIGNoaWxkIGluIEBlbC5jaGlsZE5vZGVzIHdoZW4gY2hpbGQubm9kZVR5cGUgPCA0XG5cblx0XHRyZXR1cm4gQF9jaGlsZHJlblxuXG5cdCdlbGVtZW50Q2hpbGRyZW4nOiBnZXQ6ICgpLT5cblx0XHRfZmlsdGVyRWxlbWVudHMoQGNoaWxkcmVuKVxuXG5cdCdwYXJlbnQnOiBnZXQ6ICgpLT5cblx0XHRpZiAobm90IEBfcGFyZW50IG9yIEBfcGFyZW50LmVsIGlzbnQgQGVsLnBhcmVudE5vZGUpIGFuZCBub3QgSVMuZG9tRG9jKEBlbC5wYXJlbnROb2RlKVxuXHRcdFx0QF9wYXJlbnQgPSBRdWlja0RvbShAZWwucGFyZW50Tm9kZSlcblxuXHRcdHJldHVybiBAX3BhcmVudFxuXG5cblx0J3BhcmVudHMnOiBnZXQ6ICgpLT5cblx0XHRfZ2V0UGFyZW50cyhAKVxuXG5cdCduZXh0JzogZ2V0OiAoKS0+XG5cdFx0UXVpY2tEb20oQGVsLm5leHRTaWJsaW5nKVxuXHRcblx0J25leHRFbCc6IGdldDogKCktPlxuXHRcdFF1aWNrRG9tKEBlbC5uZXh0RWxlbWVudFNpYmxpbmcpXG5cdFxuXHQnbmV4dEVsQWxsJzogZ2V0OiAoKS0+XG5cdFx0X2ZpbHRlckVsZW1lbnRzKEBuZXh0QWxsKVxuXG5cdCduZXh0QWxsJzogZ2V0OiAoKS0+XG5cdFx0c2libGluZ3MgPSBbXVxuXHRcdG5leHRTaWJsaW5nID0gUXVpY2tEb20oQGVsLm5leHRTaWJsaW5nKVxuXHRcdHdoaWxlIG5leHRTaWJsaW5nXG5cdFx0XHRzaWJsaW5ncy5wdXNoKG5leHRTaWJsaW5nKVxuXHRcdFx0bmV4dFNpYmxpbmcgPSBuZXh0U2libGluZy5uZXh0XG5cblx0XHRyZXR1cm4gc2libGluZ3NcblxuXHQncHJldic6IGdldDogKCktPlxuXHRcdFF1aWNrRG9tKEBlbC5wcmV2aW91c1NpYmxpbmcpXG5cdFxuXHQncHJldkVsJzogZ2V0OiAoKS0+XG5cdFx0UXVpY2tEb20oQGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpXG5cdFxuXHQncHJldkVsQWxsJzogZ2V0OiAoKS0+XG5cdFx0X2ZpbHRlckVsZW1lbnRzKEBwcmV2QWxsKVxuXG5cdCdwcmV2QWxsJzogZ2V0OiAoKS0+XG5cdFx0c2libGluZ3MgPSBbXVxuXHRcdHByZXZTaWJsaW5nID0gUXVpY2tEb20oQGVsLnByZXZpb3VzU2libGluZylcblx0XHR3aGlsZSBwcmV2U2libGluZ1xuXHRcdFx0c2libGluZ3MucHVzaChwcmV2U2libGluZylcblx0XHRcdHByZXZTaWJsaW5nID0gcHJldlNpYmxpbmcucHJldlxuXG5cdFx0cmV0dXJuIHNpYmxpbmdzXG5cblx0J3NpYmxpbmdzJzogZ2V0OiAoKS0+XG5cdFx0QHByZXZBbGwucmV2ZXJzZSgpLmNvbmNhdChAbmV4dEFsbClcblxuXHQnZWxlbWVudFNpYmxpbmdzJzogZ2V0OiAoKS0+XG5cdFx0X2ZpbHRlckVsZW1lbnRzKEBzaWJsaW5ncylcblx0XG5cdCdjaGlsZCc6IGdldDogKCktPlxuXHRcdEBfY2hpbGRSZWZzIG9yIF9nZXRDaGlsZFJlZnMoQClcblxuXHQnY2hpbGRmJzogZ2V0OiAoKS0+XG5cdFx0X2dldENoaWxkUmVmcyhALCB0cnVlKVxuXG5cdCdmaXJzdENoaWxkJzogZ2V0OiAoKS0+XG5cdFx0QGNoaWxkcmVuWzBdXG5cblx0J2xhc3RDaGlsZCc6IGdldDogKCktPlxuXHRcdGNoaWxkcmVuID0gQGNoaWxkcmVuXG5cdFx0Y2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoLTFdXG5cblx0J2luZGV4JzogZ2V0OiAoKS0+XG5cdFx0aWYgbm90IHBhcmVudD1AcGFyZW50XG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGVsc2Vcblx0XHRcdHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKEApXG5cblx0J2luZGV4VHlwZSc6IGdldDogKCktPlxuXHRcdF9nZXRJbmRleEJ5UHJvcChALCAndHlwZScpXG5cblx0J2luZGV4UmVmJzogZ2V0OiAoKS0+XG5cdFx0X2dldEluZGV4QnlQcm9wKEAsICdyZWYnKVxuXG5cblxuX2dldFBhcmVudHMgPSAodGFyZ2V0RWwsIGZpbHRlciktPlxuXHRmaWx0ZXIgPSB1bmRlZmluZWQgaWYgbm90IElTLmZ1bmN0aW9uKGZpbHRlcikgYW5kIG5vdCBpc1JlZj1JUy5zdHJpbmcoZmlsdGVyKVxuXHRwYXJlbnRzID0gW11cblx0bmV4dFBhcmVudCA9IHRhcmdldEVsLnBhcmVudFxuXHR3aGlsZSBuZXh0UGFyZW50XG5cdFx0cGFyZW50cy5wdXNoKG5leHRQYXJlbnQpXG5cdFx0bmV4dFBhcmVudCA9IG5leHRQYXJlbnQucGFyZW50XG5cdFx0aWYgaXNSZWZcblx0XHRcdG5leHRQYXJlbnQgPSBudWxsIGlmIG5leHRQYXJlbnQgYW5kIG5leHRQYXJlbnQucmVmIGlzIGZpbHRlclxuXHRcdGVsc2UgaWYgZmlsdGVyXG5cdFx0XHRuZXh0UGFyZW50ID0gbnVsbCBpZiBmaWx0ZXIobmV4dFBhcmVudClcblxuXHRyZXR1cm4gcGFyZW50c1xuXG5cbl9nZXRDaGlsZFJlZnMgPSAodGFyZ2V0LCBmcmVzaENvcHkpLT5cblx0dGFyZ2V0Ll9jaGlsZFJlZnMgPSB7fSBpZiBmcmVzaENvcHkgb3Igbm90IHRhcmdldC5fY2hpbGRSZWZzXG5cdHJlZnMgPSB0YXJnZXQuX2NoaWxkUmVmc1xuXHRyZWZzW3RhcmdldC5yZWZdID0gdGFyZ2V0IGlmIHRhcmdldC5yZWZcblx0Y2hpbGRyZW4gPSB0YXJnZXQuY2hpbGRyZW5cblxuXHRpZiBjaGlsZHJlbi5sZW5ndGhcblx0XHRmb3IgY2hpbGQgaW4gY2hpbGRyZW5cblx0XHRcdGNoaWxkUmVmcyA9IF9nZXRDaGlsZFJlZnMoY2hpbGQsIGZyZXNoQ29weSlcblx0XHRcdHJlZnNbcmVmXSB8fD0gZWwgZm9yIHJlZixlbCBvZiBjaGlsZFJlZnNcblxuXHRyZXR1cm4gcmVmc1xuXG5cbl9nZXRJbmRleEJ5UHJvcCA9IChtYWluLCBwcm9wKS0+XG5cdGlmIG5vdCBwYXJlbnQ9bWFpbi5wYXJlbnRcblx0XHRyZXR1cm4gbnVsbFxuXHRlbHNlXG5cdFx0cGFyZW50LmNoaWxkcmVuXG5cdFx0XHQuZmlsdGVyIChjaGlsZCktPiBjaGlsZFtwcm9wXSBpcyBtYWluW3Byb3BdXG5cdFx0XHQuaW5kZXhPZihtYWluKVxuXG5cbl9maWx0ZXJFbGVtZW50cyA9IChhcnJheSktPlxuXHRpZiBub3QgYXJyYXkubGVuZ3RoXG5cdFx0cmV0dXJuIGFycmF5XG5cdGVsc2Vcblx0XHRvdXRwdXQgPSBbXVxuXHRcdG91dHB1dC5wdXNoKGl0ZW0pIGZvciBpdGVtIGluIGFycmF5IHdoZW4gaXRlbS50eXBlIGlzbnQgJ3RleHQnXG5cdFx0cmV0dXJuIG91dHB1dFxuXG5cblxuIiwiYmFzZVN0YXRlVHJpZ2dlcnMgPVxuXHQnaG92ZXInOiB7b246J21vdXNlZW50ZXInLCBvZmY6J21vdXNlbGVhdmUnLCBidWJibGVzOnRydWV9XG5cdCdmb2N1cyc6IHtvbjonZm9jdXMnLCBvZmY6J2JsdXInLCBidWJibGVzOnRydWV9XG5cblxuUXVpY2tFbGVtZW50Ojpfbm9ybWFsaXplT3B0aW9ucyA9ICgpLT5cblx0aWYgQG9wdGlvbnMucmVsYXRlZEluc3RhbmNlXG5cdFx0QG9wdGlvbnMucmVsYXRlZCB8fD0gQG9wdGlvbnMucmVsYXRlZEluc3RhbmNlXG5cdFx0QG9wdGlvbnMucmVsYXRlZEluc3RhbmNlID0gbnVsbFxuXHRcblx0QHJlbGF0ZWQgPSBAb3B0aW9ucy5yZWxhdGVkID89IEBcblx0QG9wdGlvbnMuY2xhc3NOYW1lID0gQG9wdGlvbnMuY2xhc3MgaWYgQG9wdGlvbnMuY2xhc3Ncblx0QG9wdGlvbnMuaHJlZiA9IEBvcHRpb25zLnVybCBpZiBAb3B0aW9ucy51cmxcblx0QG9wdGlvbnMudW5wYXNzYWJsZVN0YXRlcyA/PSBbXVxuXHRAb3B0aW9ucy5wYXNzU3RhdGVUb0NoaWxkcmVuID89IHRydWVcblx0QG9wdGlvbnMucGFzc0RhdGFUb0NoaWxkcmVuID89IHRydWVcblx0QG9wdGlvbnMuc3RhdGVUcmlnZ2VycyA9XG5cdFx0aWYgQG9wdGlvbnMuc3RhdGVUcmlnZ2Vyc1xuXHRcdFx0ZXh0ZW5kLmNsb25lLmRlZXAoYmFzZVN0YXRlVHJpZ2dlcnMsIEBvcHRpb25zLnN0YXRlVHJpZ2dlcnMpXG5cdFx0ZWxzZVxuXHRcdFx0YmFzZVN0YXRlVHJpZ2dlcnNcblx0XG5cdGlmIEB0eXBlIGlzICd0ZXh0J1xuXHRcdGV4dGVuZCBALCBAX3BhcnNlVGV4dHMoQG9wdGlvbnMudGV4dCwgQF90ZXh0cylcblx0ZWxzZVxuXHRcdGV4dGVuZCBALCBAX3BhcnNlU3R5bGVzKEBvcHRpb25zLnN0eWxlLCBAX3N0eWxlcylcblx0XG5cdHJldHVyblxuXG5cblF1aWNrRWxlbWVudDo6X3BhcnNlU3R5bGVzID0gKHN0eWxlcywgc3RvcmUpLT5cblx0cmV0dXJuIGlmIG5vdCBJUy5vYmplY3RQbGFpbihzdHlsZXMpXG5cdGtleXMgPSBPYmplY3Qua2V5cyhzdHlsZXMpXG5cdHN0YXRlcyA9IGtleXMuZmlsdGVyIChrZXkpLT4gaGVscGVycy5pc1N0YXRlU3R5bGUoa2V5KVxuXHRzcGVjaWFsU3RhdGVzID0gaGVscGVycy5yZW1vdmVJdGVtKHN0YXRlcy5zbGljZSgpLCAnJGJhc2UnKVxuXHRfbWVkaWFTdGF0ZXMgPSBzdGF0ZXMuZmlsdGVyKChrZXkpLT4ga2V5WzBdIGlzICdAJykubWFwIChzdGF0ZSktPiBzdGF0ZS5zbGljZSgxKVxuXHRfcHJvdmlkZWRTdGF0ZXMgPSBzdGF0ZXMubWFwIChzdGF0ZSktPiBzdGF0ZS5zbGljZSgxKSAjIFJlbW92ZSAnJCcgcHJlZml4XG5cdF9zdHlsZXMgPSBzdG9yZSBvciB7fVxuXHRfc3RhdGVTaGFyZWQgPSBfcHJvdmlkZWRTdGF0ZXNTaGFyZWQgPSB1bmRlZmluZWRcblxuXHRiYXNlID0gaWYgbm90IGhlbHBlcnMuaW5jbHVkZXMoc3RhdGVzLCAnJGJhc2UnKSB0aGVuIHN0eWxlcyBlbHNlIHN0eWxlcy4kYmFzZVxuXHRfc3R5bGVzLmJhc2UgPSBoZWxwZXJzLnJlZ2lzdGVyU3R5bGUoYmFzZSwgMCwgZm9yY2VTdHlsZT1Ab3B0aW9ucy5mb3JjZVN0eWxlKVxuXG5cblx0aWYgc3BlY2lhbFN0YXRlcy5sZW5ndGhcblx0XHRmbGF0dGVuTmVzdGVkU3RhdGVzID0gKHN0eWxlT2JqZWN0LCBjaGFpbiwgbGV2ZWwpLT5cblx0XHRcdHN0eWxlS2V5cyA9IE9iamVjdC5rZXlzKHN0eWxlT2JqZWN0KVxuXHRcdFx0b3V0cHV0ID0ge31cblx0XHRcdGhhc05vblN0YXRlUHJvcHMgPSBmYWxzZVxuXHRcdFx0XG5cdFx0XHRmb3Igc3RhdGUgaW4gc3R5bGVLZXlzXG5cdFx0XHRcdGlmIG5vdCBoZWxwZXJzLmlzU3RhdGVTdHlsZShzdGF0ZSlcblx0XHRcdFx0XHRoYXNOb25TdGF0ZVByb3BzID0gdHJ1ZVxuXHRcdFx0XHRcdG91dHB1dFtzdGF0ZV0gPSBzdHlsZU9iamVjdFtzdGF0ZV1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGNoYWluLnB1c2goc3RhdGVfID0gc3RhdGUuc2xpY2UoMSkpXG5cdFx0XHRcdFx0c3RhdGVDaGFpbiA9IG5ldyAoaW1wb3J0ICcuL3N0YXRlQ2hhaW4nKShjaGFpbilcblx0XHRcdFx0XHRfc3RhdGVTaGFyZWQgPz0gW11cblx0XHRcdFx0XHRfcHJvdmlkZWRTdGF0ZXNTaGFyZWQgPz0gW11cblx0XHRcdFx0XHRfcHJvdmlkZWRTdGF0ZXNTaGFyZWQucHVzaChzdGF0ZUNoYWluKVxuXHRcdFx0XHRcdF9tZWRpYVN0YXRlcy5wdXNoKHN0YXRlXykgaWYgc3RhdGVbMF0gaXMgJ0AnXG5cdFx0XHRcdFx0X3N0eWxlc1tzdGF0ZUNoYWluLnN0cmluZ10gPSBoZWxwZXJzLnJlZ2lzdGVyU3R5bGUgZmxhdHRlbk5lc3RlZFN0YXRlcyhzdHlsZU9iamVjdFtzdGF0ZV0sIGNoYWluLCBsZXZlbCsxKSwgbGV2ZWwrMSwgZm9yY2VTdHlsZVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gaWYgaGFzTm9uU3RhdGVQcm9wcyB0aGVuIG91dHB1dFxuXG5cdFx0Zm9yIHN0YXRlIGluIHNwZWNpYWxTdGF0ZXNcblx0XHRcdHN0YXRlXyA9IHN0YXRlLnNsaWNlKDEpXG5cdFx0XHRcblx0XHRcdHN0YXRlU3R5bGVzID0gZmxhdHRlbk5lc3RlZFN0YXRlcyhzdHlsZXNbc3RhdGVdLCBbc3RhdGVfXSwgMSlcblx0XHRcdF9zdHlsZXNbc3RhdGVfXSA9IGhlbHBlcnMucmVnaXN0ZXJTdHlsZShzdGF0ZVN0eWxlcywgMSkgaWYgc3RhdGVTdHlsZXNcblxuXG5cdHJldHVybiB7X3N0eWxlcywgX21lZGlhU3RhdGVzLCBfc3RhdGVTaGFyZWQsIF9wcm92aWRlZFN0YXRlcywgX3Byb3ZpZGVkU3RhdGVzU2hhcmVkfVxuXG5cblxuUXVpY2tFbGVtZW50OjpfcGFyc2VUZXh0cyA9ICh0ZXh0cywgc3RvcmUpLT5cblx0cmV0dXJuIGlmIG5vdCBJUy5vYmplY3RQbGFpbih0ZXh0cylcblx0c3RhdGVzID0gT2JqZWN0LmtleXModGV4dHMpLm1hcCAoc3RhdGUpLT4gc3RhdGUuc2xpY2UoMSlcblx0X3Byb3ZpZGVkU3RhdGVzID0gc3RhdGVzLmZpbHRlciAoc3RhdGUpLT4gc3RhdGUgaXNudCAnYmFzZSdcblx0X3RleHRzID0gc3RvcmUgb3Ige31cblx0X3RleHRzID0gYmFzZTonJ1xuXHRfdGV4dHNbc3RhdGVdID0gdGV4dHNbJyQnK3N0YXRlXSBmb3Igc3RhdGUgaW4gc3RhdGVzXG5cdFxuXHRyZXR1cm4ge190ZXh0cywgX3Byb3ZpZGVkU3RhdGVzfVxuXG5cblF1aWNrRWxlbWVudDo6X2FwcGx5T3B0aW9ucyA9ICgpLT5cblx0aWYgcmVmPShAb3B0aW9ucy5pZCBvciBAb3B0aW9ucy5yZWYpIHRoZW4gQGF0dHIoJ2RhdGEtcmVmJywgQHJlZj1yZWYpXG5cdGlmIEBvcHRpb25zLmlkIHRoZW4gQGVsLmlkID0gQG9wdGlvbnMuaWRcblx0aWYgQG9wdGlvbnMuY2xhc3NOYW1lIHRoZW4gQGVsLmNsYXNzTmFtZSA9IEBvcHRpb25zLmNsYXNzTmFtZVxuXHRpZiBAb3B0aW9ucy5zcmMgdGhlbiBAZWwuc3JjID0gQG9wdGlvbnMuc3JjXG5cdGlmIEBvcHRpb25zLmhyZWYgdGhlbiBAZWwuaHJlZiA9IEBvcHRpb25zLmhyZWZcblx0aWYgQG9wdGlvbnMudHlwZSB0aGVuIEBlbC50eXBlID0gQG9wdGlvbnMudHlwZVxuXHRpZiBAb3B0aW9ucy5uYW1lIHRoZW4gQGVsLm5hbWUgPSBAb3B0aW9ucy5uYW1lXG5cdGlmIEBvcHRpb25zLnZhbHVlIHRoZW4gQGVsLnZhbHVlID0gQG9wdGlvbnMudmFsdWVcblx0aWYgQG9wdGlvbnMuc2VsZWN0ZWQgdGhlbiBAZWwuc2VsZWN0ZWQgPSBAb3B0aW9ucy5zZWxlY3RlZFxuXHRpZiBAb3B0aW9ucy5jaGVja2VkIHRoZW4gQGVsLmNoZWNrZWQgPSBAb3B0aW9ucy5jaGVja2VkXG5cdGlmIEBvcHRpb25zLnByb3BzIHRoZW4gQHByb3AoQG9wdGlvbnMucHJvcHMpXG5cdGlmIEBvcHRpb25zLmF0dHJzIHRoZW4gQGF0dHIoQG9wdGlvbnMuYXR0cnMpXG5cdEBfYXBwbHlSZWdpc3RlcmVkU3R5bGUoQF9zdHlsZXMuYmFzZSwgbnVsbCwgbnVsbCwgQG9wdGlvbnMuc3R5bGVBZnRlckluc2VydClcblx0QHRleHQgPSBAX3RleHRzLmJhc2UgaWYgQF90ZXh0c1xuXG5cdEBvbignaW5zZXJ0ZWQnLCBDQUNIRURfRk5fSU5TRVJURUQsIGZhbHNlLCB0cnVlKVxuXG5cdGlmIEBvcHRpb25zLmludm9rZUNvbXB1dGVyc09uY2Vcblx0XHRAX2ludm9rZWRDb21wdXRlcnMgPSB7fVxuXHRcblx0aWYgQG9wdGlvbnMucmVjYWxjT25SZXNpemVcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgKCk9PiBAcmVjYWxjU3R5bGUoKVxuXG5cdGlmIEBvcHRpb25zLmV2ZW50c1xuXHRcdEBvbihldmVudCwgaGFuZGxlcikgZm9yIGV2ZW50LGhhbmRsZXIgb2YgQG9wdGlvbnMuZXZlbnRzXG5cblx0aWYgQG9wdGlvbnMubWV0aG9kc1xuXHRcdGZvciBtZXRob2QsdmFsdWUgb2YgQG9wdGlvbnMubWV0aG9kcyB3aGVuIG5vdCBAW21ldGhvZF1cblx0XHRcdGlmIElTLmZ1bmN0aW9uKHZhbHVlKVxuXHRcdFx0XHRAW21ldGhvZF0gPSB2YWx1ZVxuXHRcdFx0ZWxzZSBpZiBJUy5vYmplY3QodmFsdWUpXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBALCBtZXRob2QsIHtjb25maWd1cmFibGU6dHJ1ZSwgZ2V0OnZhbHVlLmdldCwgc2V0OnZhbHVlLnNldH1cblxuXHRpZiBAdHlwZSBpc250ICd0ZXh0JyBhbmQgSVMub2JqZWN0KEBvcHRpb25zLnRleHQpXG5cdFx0QGFwcGVuZCBRdWlja0RvbSgndGV4dCcsIHRleHQ6QG9wdGlvbnMudGV4dClcblx0cmV0dXJuXG5cblxuUXVpY2tFbGVtZW50OjpfcG9zdENyZWF0aW9uID0gKGRhdGEpLT5cblx0aWYgQG9wdGlvbnMuY29tcHV0ZXJzXG5cdFx0ZGF0YSA9IGV4dGVuZC5jbG9uZShAb3B0aW9ucy5kYXRhLCBkYXRhKSBpZiBkYXRhIGFuZCBAb3B0aW9ucy5kYXRhXG5cdFx0ZGF0YSB8fD0gQG9wdGlvbnMuZGF0YVxuXHRcdEBhcHBseURhdGEoZGF0YSwgZmFsc2UpXG5cdFx0XG5cdFx0aWYgQG9wdGlvbnMuY29tcHV0ZXJzLl9pbml0XG5cdFx0XHRAX3J1bkNvbXB1dGVyKCdfaW5pdCcsIGRhdGEpXG5cblx0aWYgQG9wdGlvbnMuc3RhdGVcblx0XHRAc3RhdGUoQG9wdGlvbnMuc3RhdGUpXG5cdFxuXHRyZXR1cm5cblxuXG5RdWlja0VsZW1lbnQ6Ol9hdHRhY2hTdGF0ZUV2ZW50cyA9IChmb3JjZSktPlxuXHRzdGF0ZXMgPSBPYmplY3Qua2V5cyhAb3B0aW9ucy5zdGF0ZVRyaWdnZXJzKVxuXHRzdGF0ZXMuZm9yRWFjaCAoc3RhdGUpPT5cblx0XHR0cmlnZ2VyID0gQG9wdGlvbnMuc3RhdGVUcmlnZ2Vyc1tzdGF0ZV1cdFxuXHRcdHJldHVybiBpZiBub3QgaGVscGVycy5pbmNsdWRlcyhAX3Byb3ZpZGVkU3RhdGVzLCBzdGF0ZSkgYW5kIG5vdCBmb3JjZSBhbmQgbm90IHRyaWdnZXIuZm9yY2Vcblx0XHRlbmFibGVyID0gaWYgSVMuc3RyaW5nKHRyaWdnZXIpIHRoZW4gdHJpZ2dlciBlbHNlIHRyaWdnZXIub25cblx0XHRkaXNhYmxlciA9IHRyaWdnZXIub2ZmIGlmIElTLm9iamVjdCh0cmlnZ2VyKVxuXG5cdFx0QF9saXN0ZW5UbyBlbmFibGVyLCAoKT0+IEBzdGF0ZShzdGF0ZSwgb24sIHRyaWdnZXIuYnViYmxlcylcblx0XHRpZiBkaXNhYmxlciB0aGVuIEBfbGlzdGVuVG8gZGlzYWJsZXIsICgpPT4gQHN0YXRlKHN0YXRlLCBvZmYsIHRyaWdnZXIuYnViYmxlcylcblx0XG5cdHJldHVyblxuXG5cblxuUXVpY2tFbGVtZW50OjpfcHJveHlQYXJlbnQgPSAoKS0+XG5cdHBhcmVudCA9IHVuZGVmaW5lZFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgQCwgJ19wYXJlbnQnLFxuXHRcdGdldDogKCktPiBwYXJlbnRcblx0XHRzZXQ6IChuZXdQYXJlbnQpLT4gaWYgcGFyZW50PW5ld1BhcmVudFxuXHRcdFx0bGFzdFBhcmVudCA9IEBwYXJlbnRzLnNsaWNlKC0xKVswXVxuXHRcdFx0aWYgbGFzdFBhcmVudC5yYXcgaXMgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG5cdFx0XHRcdEBfdW5wcm94eVBhcmVudChuZXdQYXJlbnQpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBhcmVudC5vbiAnaW5zZXJ0ZWQnLCAoKT0+XG5cdFx0XHRcdFx0QF91bnByb3h5UGFyZW50KG5ld1BhcmVudCkgaWYgcGFyZW50IGlzIG5ld1BhcmVudFxuXHRcdFx0cmV0dXJuXG5cblxuUXVpY2tFbGVtZW50OjpfdW5wcm94eVBhcmVudCA9IChuZXdQYXJlbnQpLT5cblx0ZGVsZXRlIEBfcGFyZW50XG5cdEBfcGFyZW50ID0gbmV3UGFyZW50XG5cdEBlbWl0UHJpdmF0ZSgnaW5zZXJ0ZWQnLCBuZXdQYXJlbnQpXG5cdHJldHVyblxuXG5cblxuQ0FDSEVEX0ZOX0lOU0VSVEVEID0gKCktPlxuXHRAX2luc2VydGVkID0gQFxuXHRAcmVjYWxjU3R5bGUoKSBpZiBAb3B0aW9ucy5zdHlsZUFmdGVySW5zZXJ0XG5cblx0aWYgKG1lZGlhU3RhdGVzPUBfbWVkaWFTdGF0ZXMpIGFuZCBAX21lZGlhU3RhdGVzLmxlbmd0aFxuXHRcdEBfbWVkaWFTdGF0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdFx0XG5cdFx0Zm9yIHF1ZXJ5U3RyaW5nIGluIG1lZGlhU3RhdGVzXG5cdFx0XHRAX21lZGlhU3RhdGVzW3F1ZXJ5U3RyaW5nXSA9IE1lZGlhUXVlcnkucmVnaXN0ZXIoQCwgcXVlcnlTdHJpbmcpXG5cblxuXG5cblxuXG5cblxuIiwicmVnZXhXaGl0ZXNwYWNlID0gL1xccysvXG5cblF1aWNrRWxlbWVudDo6b24gPSAoZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUsIGlzUHJpdmF0ZSktPlxuXHRAX2V2ZW50Q2FsbGJhY2tzID89IHtfX3JlZnM6e319XG5cdFxuXHRpZiBJUy5zdHJpbmcoZXZlbnROYW1lcykgYW5kIElTLmZ1bmN0aW9uKGNhbGxiYWNrKVxuXHRcdHNwbGl0ID0gZXZlbnROYW1lcy5zcGxpdCgnLicpXG5cdFx0Y2FsbGJhY2tSZWYgPSBzcGxpdFsxXVxuXHRcdGV2ZW50TmFtZXMgPSBzcGxpdFswXVxuXHRcdFxuXHRcdGlmIGV2ZW50TmFtZXMgaXMgJ2luc2VydGVkJyBhbmQgQF9pbnNlcnRlZFxuXHRcdFx0Y2FsbGJhY2suY2FsbChALCBAX3BhcmVudClcblx0XHRcdHJldHVybiBAXG5cdFx0XG5cdFx0ZXZlbnROYW1lcy5zcGxpdChyZWdleFdoaXRlc3BhY2UpLmZvckVhY2ggKGV2ZW50TmFtZSk9PlxuXHRcdFx0aWYgbm90IEBfZXZlbnRDYWxsYmFja3NbZXZlbnROYW1lXVxuXHRcdFx0XHRAX2V2ZW50Q2FsbGJhY2tzW2V2ZW50TmFtZV0gPSBbXVx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdHVubGVzcyBpc1ByaXZhdGUgdGhlbiBAX2xpc3RlblRvIGV2ZW50TmFtZSwgKGV2ZW50KT0+XG5cdFx0XHRcdFx0QF9pbnZva2VIYW5kbGVycyhldmVudE5hbWUsIGV2ZW50KVxuXHRcdFx0XHQsIHVzZUNhcHR1cmVcblxuXHRcdFx0QF9ldmVudENhbGxiYWNrcy5fX3JlZnNbY2FsbGJhY2tSZWZdID0gY2FsbGJhY2sgaWYgY2FsbGJhY2tSZWZcblx0XHRcdEBfZXZlbnRDYWxsYmFja3NbZXZlbnROYW1lXS5wdXNoKGNhbGxiYWNrKVxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpvbmNlID0gKGV2ZW50TmFtZXMsIGNhbGxiYWNrKS0+XG5cdGlmIElTLnN0cmluZyhldmVudE5hbWVzKSBhbmQgSVMuZnVuY3Rpb24oY2FsbGJhY2spXG5cdFx0QG9uIGV2ZW50TmFtZXMsIG9uY2VDYWxsYmFjaz0oZXZlbnQpPT5cblx0XHRcdEBvZmYoZXZlbnROYW1lcywgb25jZUNhbGxiYWNrKVxuXHRcdFx0Y2FsbGJhY2suY2FsbChALCBldmVudClcblx0XG5cdHJldHVybiBAXG5cblxuXG5RdWlja0VsZW1lbnQ6Om9mZiA9IChldmVudE5hbWVzLCBjYWxsYmFjayktPlxuXHRAX2V2ZW50Q2FsbGJhY2tzID89IHtfX3JlZnM6e319XG5cdGlmIG5vdCBJUy5zdHJpbmcoZXZlbnROYW1lcylcblx0XHRAb2ZmKGV2ZW50TmFtZSkgZm9yIGV2ZW50TmFtZSBvZiBAX2V2ZW50Q2FsbGJhY2tzXG5cdFxuXHRlbHNlXG5cdFx0c3BsaXQgPSBldmVudE5hbWVzLnNwbGl0KCcuJylcblx0XHRjYWxsYmFja1JlZiA9IHNwbGl0WzFdXG5cdFx0ZXZlbnROYW1lcyA9IHNwbGl0WzBdXG5cdFx0ZXZlbnROYW1lcy5zcGxpdChyZWdleFdoaXRlc3BhY2UpLmZvckVhY2ggKGV2ZW50TmFtZSk9PlxuXHRcdFx0aWYgQF9ldmVudENhbGxiYWNrc1tldmVudE5hbWVdXG5cdFx0XHRcdGNhbGxiYWNrID89IEBfZXZlbnRDYWxsYmFja3MuX19yZWZzW2NhbGxiYWNrUmVmXVxuXG5cdFx0XHRcdGlmIElTLmZ1bmN0aW9uKGNhbGxiYWNrKVxuXHRcdFx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAX2V2ZW50Q2FsbGJhY2tzW2V2ZW50TmFtZV0sIGNhbGxiYWNrKVxuXHRcdFx0XHRlbHNlIGlmIG5vdCBjYWxsYmFja1JlZlxuXHRcdFx0XHRcdEBfZXZlbnRDYWxsYmFja3NbZXZlbnROYW1lXS5sZW5ndGggPSAwXG5cblx0cmV0dXJuIEBcblxuXG5cblF1aWNrRWxlbWVudDo6ZW1pdCA9IChldmVudE5hbWUsIGJ1YmJsZXM9dHJ1ZSwgY2FuY2VsYWJsZT10cnVlLCBkYXRhKS0+XG5cdGlmIGV2ZW50TmFtZSBhbmQgSVMuc3RyaW5nKGV2ZW50TmFtZSlcblx0XHRldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpXG5cdFx0ZXZlbnQuaW5pdEV2ZW50KGV2ZW50TmFtZSwgYnViYmxlcywgY2FuY2VsYWJsZSlcblx0XHRleHRlbmQoZXZlbnQsIGRhdGEpIGlmIGRhdGEgYW5kIHR5cGVvZiBkYXRhIGlzICdvYmplY3QnXG5cdFx0QGVsLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OmVtaXRQcml2YXRlID0gKGV2ZW50TmFtZSwgYXJnKS0+XG5cdGlmIGV2ZW50TmFtZSBhbmQgSVMuc3RyaW5nKGV2ZW50TmFtZSkgYW5kIEBfZXZlbnRDYWxsYmFja3M/W2V2ZW50TmFtZV1cblx0XHRAX2ludm9rZUhhbmRsZXJzKGV2ZW50TmFtZSwgYXJnKVxuXHRcblx0cmV0dXJuIEBcblxuXG5cblF1aWNrRWxlbWVudDo6X2ludm9rZUhhbmRsZXJzID0gKGV2ZW50TmFtZSwgYXJnKS0+XG5cdGNhbGxiYWNrcyA9IEBfZXZlbnRDYWxsYmFja3NbZXZlbnROYW1lXS5zbGljZSgpXG5cdGNiLmNhbGwoQCwgYXJnKSBmb3IgY2IgaW4gY2FsbGJhY2tzXG5cdHJldHVyblxuXG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrRWxlbWVudDo6X2xpc3RlblRvID0gKGV2ZW50TmFtZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpLT5cblx0bGlzdGVuTWV0aG9kID0gaWYgQGVsLmFkZEV2ZW50TGlzdGVuZXIgdGhlbiAnYWRkRXZlbnRMaXN0ZW5lcicgZWxzZSAnYXR0YWNoRXZlbnQnXG5cdGV2ZW50TmFtZVRvTGlzdGVuRm9yID0gaWYgQGVsLmFkZEV2ZW50TGlzdGVuZXIgdGhlbiBldmVudE5hbWUgZWxzZSBcIm9uI3tldmVudE5hbWV9XCJcblx0XG5cdEBlbFtsaXN0ZW5NZXRob2RdKGV2ZW50TmFtZVRvTGlzdGVuRm9yLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSlcblx0cmV0dXJuIEBcblxuXG5cblxuIiwiRFVNTVlfQVJSQVkgPSBbXVxuXG5cblF1aWNrRWxlbWVudDo6c3RhdGUgPSAodGFyZ2V0U3RhdGUsIHZhbHVlLCBidWJibGVzLCBzb3VyY2UpLT5cblx0aWYgYXJndW1lbnRzLmxlbmd0aCBpcyAwXG5cdFx0cmV0dXJuIEBfc3RhdGUuc2xpY2UoKVxuXHRcblx0aWYgYXJndW1lbnRzLmxlbmd0aCBpcyAxXG5cdFx0aWYgSVMuc3RyaW5nKHRhcmdldFN0YXRlKVxuXHRcdFx0cmV0dXJuIGhlbHBlcnMuaW5jbHVkZXMoQF9zdGF0ZSwgdGFyZ2V0U3RhdGUpXG5cdFx0XG5cdFx0ZWxzZSBpZiBJUy5vYmplY3QodGFyZ2V0U3RhdGUpXG5cdFx0XHRrZXlzID0gT2JqZWN0LmtleXModGFyZ2V0U3RhdGUpXG5cdFx0XHRpID0gLTFcblx0XHRcdEBzdGF0ZShrZXksIHRhcmdldFN0YXRlW2tleV0pIHdoaWxlIGtleT1rZXlzWysraV1cblx0XHRcdHJldHVybiBAXG5cblx0ZWxzZSBpZiBAX3N0YXRlUGlwZVRhcmdldCBhbmQgc291cmNlIGlzbnQgQFxuXHRcdEBfc3RhdGVQaXBlVGFyZ2V0LnN0YXRlKHRhcmdldFN0YXRlLCB2YWx1ZSwgYnViYmxlcywgQClcblx0XHRyZXR1cm4gQFxuXHRcblx0ZWxzZSBpZiBJUy5zdHJpbmcodGFyZ2V0U3RhdGUpXG5cdFx0dGFyZ2V0U3RhdGUgPSB0YXJnZXRTdGF0ZS5zbGljZSgxKSBpZiB0YXJnZXRTdGF0ZVswXSBpcyAnJCdcblx0XHRyZXR1cm4gQCBpZiB0YXJnZXRTdGF0ZSBpcyAnYmFzZSdcblx0XHRkZXNpcmVkVmFsdWUgPSAhIXZhbHVlICMgQ29udmVydCB0aGUgdmFsdWUgdG8gYSBib29sZWFuXG5cdFx0YWN0aXZlU3RhdGVzID0gQF9nZXRBY3RpdmVTdGF0ZXModGFyZ2V0U3RhdGUsIGZhbHNlKVxuXHRcdFxuXHRcdCMgPT09PSBUb2dnbGUgc3R5bGVzIGZvciB0aGlzIHN0YXRlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdGlmIEBzdGF0ZSh0YXJnZXRTdGF0ZSkgaXNudCBkZXNpcmVkVmFsdWVcblx0XHRcdHByb3AgPSBpZiBAdHlwZSBpcyAndGV4dCcgdGhlbiAnVGV4dCcgZWxzZSAnU3R5bGUnXG5cdFx0XG5cdFx0XHRpZiBkZXNpcmVkVmFsdWUgI2lzIG9uXG5cdFx0XHRcdEBfc3RhdGUucHVzaCh0YXJnZXRTdGF0ZSlcblx0XHRcdFx0dG9nZ2xlID0gJ09OJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRoZWxwZXJzLnJlbW92ZUl0ZW0oQF9zdGF0ZSwgdGFyZ2V0U3RhdGUpXG5cdFx0XHRcdHRvZ2dsZSA9ICdPRkYnXG5cdFx0XHRcblx0XHRcdEBbJ190dXJuJytwcm9wK3RvZ2dsZV0odGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcylcblx0XHRcdEBlbWl0UHJpdmF0ZSBcInN0YXRlQ2hhbmdlOiN7dGFyZ2V0U3RhdGV9XCIsIGRlc2lyZWRWYWx1ZVxuXG5cblx0XHQjID09PT0gUGFzcyBzdGF0ZSB0byBwYXJlbnQvY2hpbGRyZW4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0aWYgbm90IGhlbHBlcnMuaW5jbHVkZXMoQG9wdGlvbnMudW5wYXNzYWJsZVN0YXRlcywgdGFyZ2V0U3RhdGUpXG5cdFx0XHRpZiBidWJibGVzXG5cdFx0XHRcdEBfcGFyZW50LnN0YXRlKHRhcmdldFN0YXRlLCB2YWx1ZSwgdHJ1ZSwgc291cmNlIG9yIEApIGlmIEBwYXJlbnRcblx0XHRcdGVsc2UgaWYgQG9wdGlvbnMucGFzc1N0YXRlVG9DaGlsZHJlblxuXHRcdFx0XHRjaGlsZC5zdGF0ZSh0YXJnZXRTdGF0ZSwgdmFsdWUsIGZhbHNlLCBzb3VyY2Ugb3IgQCkgZm9yIGNoaWxkIGluIEBfY2hpbGRyZW5cblx0XHRcblx0XHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6dG9nZ2xlU3RhdGUgPSAodGFyZ2V0U3RhdGUpLT5cblx0QHN0YXRlKHRhcmdldFN0YXRlLCAhQHN0YXRlKHRhcmdldFN0YXRlKSlcblxuXG5RdWlja0VsZW1lbnQ6OnJlc2V0U3RhdGUgPSAoKS0+XG5cdGZvciBhY3RpdmVTdGF0ZSBpbiBAX3N0YXRlLnNsaWNlKClcblx0XHRAc3RhdGUoYWN0aXZlU3RhdGUsIG9mZilcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6cGlwZVN0YXRlID0gKHRhcmdldEVsKS0+XG5cdGlmIHRhcmdldEVsXG5cdFx0dGFyZ2V0RWwgPSBoZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwodGFyZ2V0RWwpXG5cblx0XHRpZiBJUy5xdWlja0RvbUVsKHRhcmdldEVsKSBhbmQgdGFyZ2V0RWwgaXNudCBAXG5cdFx0XHRAX3N0YXRlUGlwZVRhcmdldCA9IHRhcmdldEVsXG5cdFx0XHR0YXJnZXRFbC5zdGF0ZShhY3RpdmVTdGF0ZSwgb24pIGZvciBhY3RpdmVTdGF0ZSBpbiBAX3N0YXRlXG5cblx0ZWxzZSBpZiB0YXJnZXRFbCBpcyBmYWxzZVxuXHRcdGRlbGV0ZSBAX3N0YXRlUGlwZVRhcmdldFxuXG5cdHJldHVybiBAXG5cblxuXG5cblF1aWNrRWxlbWVudDo6X2FwcGx5UmVnaXN0ZXJlZFN0eWxlID0gKHRhcmdldFN0eWxlLCBzdXBlcmlvclN0YXRlcywgaW5jbHVkZUJhc2UsIHNraXBGbnMpLT4gaWYgdGFyZ2V0U3R5bGVcblx0QGFkZENsYXNzKGNsYXNzTmFtZSkgZm9yIGNsYXNzTmFtZSBpbiB0YXJnZXRTdHlsZS5jbGFzc05hbWVcblx0XG5cdGlmIHRhcmdldFN0eWxlLmZucy5sZW5ndGggYW5kIG5vdCBza2lwRm5zXG5cdFx0c3VwZXJpb3JTdHlsZXMgPSBAX3Jlc29sdmVGblN0eWxlcyhzdXBlcmlvclN0YXRlcywgaW5jbHVkZUJhc2UpIGlmIHN1cGVyaW9yU3RhdGVzXG5cdFx0XG5cdFx0Zm9yIGVudHJ5IGluIHRhcmdldFN0eWxlLmZuc1xuXHRcdFx0QHN0eWxlKGVudHJ5WzBdLCBlbnRyeVsxXSkgdW5sZXNzIHN1cGVyaW9yU3R5bGVzIGFuZCBzdXBlcmlvclN0eWxlc1tlbnRyeVswXV1cblx0XG5cdHJldHVyblxuXG5cblF1aWNrRWxlbWVudDo6X3JlbW92ZVJlZ2lzdGVyZWRTdHlsZSA9ICh0YXJnZXRTdHlsZSwgc3VwZXJpb3JTdGF0ZXMsIGluY2x1ZGVCYXNlKS0+XG5cdEByZW1vdmVDbGFzcyhjbGFzc05hbWUpIGZvciBjbGFzc05hbWUgaW4gdGFyZ2V0U3R5bGUuY2xhc3NOYW1lXG5cblx0aWYgdGFyZ2V0U3R5bGUuZm5zLmxlbmd0aFxuXHRcdHN1cGVyaW9yU3R5bGVzID0gQF9yZXNvbHZlRm5TdHlsZXMoc3VwZXJpb3JTdGF0ZXMsIGluY2x1ZGVCYXNlKSBpZiBzdXBlcmlvclN0YXRlc1xuXHRcdFxuXHRcdGZvciBlbnRyeSBpbiB0YXJnZXRTdHlsZS5mbnNcblx0XHRcdHJlc2V0VmFsdWUgPSBzdXBlcmlvclN0eWxlcyBhbmQgc3VwZXJpb3JTdHlsZXNbZW50cnlbMF1dIG9yIG51bGxcblx0XHRcdEBzdHlsZShlbnRyeVswXSwgcmVzZXRWYWx1ZSlcblxuXHRyZXR1cm5cblxuXG5cblxuUXVpY2tFbGVtZW50OjpfdHVyblN0eWxlT04gPSAodGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcyktPlxuXHRza2lwRm5zID0gQG9wdGlvbnMuc3R5bGVBZnRlckluc2VydCBhbmQgbm90IEBfaW5zZXJ0ZWRcblx0aWYgQF9zdHlsZXNbdGFyZ2V0U3RhdGVdXG5cdFx0QF9hcHBseVJlZ2lzdGVyZWRTdHlsZShAX3N0eWxlc1t0YXJnZXRTdGF0ZV0sIEBfZ2V0U3VwZXJpb3JTdGF0ZXModGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcyksIGZhbHNlLCBza2lwRm5zKVxuXG5cblx0aWYgQF9wcm92aWRlZFN0YXRlc1NoYXJlZFxuXHRcdHNoYXJlZFN0YXRlcyA9IEBfZ2V0U2hhcmVkU3RhdGVzKHRhcmdldFN0YXRlKVxuXHRcdFxuXHRcdGZvciBzdGF0ZUNoYWluIGluIHNoYXJlZFN0YXRlc1xuXHRcdFx0QF9zdGF0ZVNoYXJlZC5wdXNoKHN0YXRlQ2hhaW4uc3RyaW5nKSB1bmxlc3MgaGVscGVycy5pbmNsdWRlcyhAX3N0YXRlU2hhcmVkLCBzdGF0ZUNoYWluLnN0cmluZylcblx0XHRcdEBfYXBwbHlSZWdpc3RlcmVkU3R5bGUoQF9zdHlsZXNbc3RhdGVDaGFpbi5zdHJpbmddLCBudWxsLCBudWxsLCBza2lwRm5zKVxuXG5cdHJldHVyblxuXG5cblF1aWNrRWxlbWVudDo6X3R1cm5TdHlsZU9GRiA9ICh0YXJnZXRTdGF0ZSwgYWN0aXZlU3RhdGVzKS0+XG5cdGlmIEBfc3R5bGVzW3RhcmdldFN0YXRlXVxuXHRcdEBfcmVtb3ZlUmVnaXN0ZXJlZFN0eWxlKEBfc3R5bGVzW3RhcmdldFN0YXRlXSwgYWN0aXZlU3RhdGVzLCB0cnVlKVxuXG5cdGlmIEBfcHJvdmlkZWRTdGF0ZXNTaGFyZWRcblx0XHRzaGFyZWRTdGF0ZXMgPSBAX2dldFNoYXJlZFN0YXRlcyh0YXJnZXRTdGF0ZSlcblx0XHRyZXR1cm4gaWYgc2hhcmVkU3RhdGVzLmxlbmd0aCBpcyAwXG5cblx0XHRmb3Igc3RhdGVDaGFpbiBpbiBzaGFyZWRTdGF0ZXNcblx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAX3N0YXRlU2hhcmVkLCBzdGF0ZUNoYWluLnN0cmluZylcblx0XHRcdHRhcmdldFN0eWxlID0gQF9zdHlsZXNbc3RhdGVDaGFpbi5zdHJpbmddXG5cdFx0XHRcblx0XHRcdGlmIHRhcmdldFN0eWxlLmZucy5sZW5ndGggYW5kIEBfc3RhdGVTaGFyZWQubGVuZ3RoIGFuZCBub3QgYWN0aXZlU2hhcmVkU3RhdGVzXG5cdFx0XHRcdGFjdGl2ZVNoYXJlZFN0YXRlcyA9IEBfc3RhdGVTaGFyZWQuZmlsdGVyIChzdGF0ZSktPiBub3QgaGVscGVycy5pbmNsdWRlcyhzdGF0ZSwgdGFyZ2V0U3RhdGUpXG5cdFx0XHRcdGFjdGl2ZVN0YXRlcyA9IGFjdGl2ZVN0YXRlcy5jb25jYXQoYWN0aXZlU2hhcmVkU3RhdGVzKVxuXHRcdFx0XG5cdFx0XHRAX3JlbW92ZVJlZ2lzdGVyZWRTdHlsZSh0YXJnZXRTdHlsZSwgYWN0aXZlU3RhdGVzLCB0cnVlKVxuXG5cdHJldHVyblxuXG5cblxuUXVpY2tFbGVtZW50OjpfdHVyblRleHRPTiA9ICh0YXJnZXRTdGF0ZSwgYWN0aXZlU3RhdGVzKS0+XG5cdGlmIEBfdGV4dHMgYW5kIElTLnN0cmluZyh0YXJnZXRUZXh0ID0gQF90ZXh0c1t0YXJnZXRTdGF0ZV0pXG5cdFx0c3VwZXJpb3JTdGF0ZXMgPSBAX2dldFN1cGVyaW9yU3RhdGVzKHRhcmdldFN0YXRlLCBhY3RpdmVTdGF0ZXMpXG5cdFx0XG5cdFx0QHRleHQgPSB0YXJnZXRUZXh0IHVubGVzcyBzdXBlcmlvclN0YXRlcy5sZW5ndGhcblx0cmV0dXJuXG5cblxuUXVpY2tFbGVtZW50OjpfdHVyblRleHRPRkYgPSAodGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcyktPlxuXHRpZiBAX3RleHRzIGFuZCBJUy5zdHJpbmcodGFyZ2V0VGV4dCA9IEBfdGV4dHNbdGFyZ2V0U3RhdGVdKVxuXHRcdGFjdGl2ZVN0YXRlcyA9IGFjdGl2ZVN0YXRlcy5maWx0ZXIgKHN0YXRlKS0+IHN0YXRlIGlzbnQgdGFyZ2V0U3RhdGVcblx0XHR0YXJnZXRUZXh0ID0gQF90ZXh0c1thY3RpdmVTdGF0ZXNbYWN0aXZlU3RhdGVzLmxlbmd0aC0xXV1cblx0XHR0YXJnZXRUZXh0ID89IEBfdGV4dHMuYmFzZVxuXHRcdFxuXHRcdEB0ZXh0ID0gdGFyZ2V0VGV4dFxuXHRyZXR1cm5cblxuXG5cblxuXHRcblxuXG5cblxuUXVpY2tFbGVtZW50OjpfZ2V0QWN0aXZlU3RhdGVzID0gKHN0YXRlVG9FeGNsdWRlLCBpbmNsdWRlU2hhcmVkU3RhdGVzPXRydWUpLT5cblx0cmV0dXJuIERVTU1ZX0FSUkFZIGlmIG5vdCBAX3Byb3ZpZGVkU3RhdGVzXG5cdGFjdGl2ZVN0YXRlcyA9IHBsYWluU3RhdGVzID0gQF9zdGF0ZVxuXHRpZiBzdGF0ZVRvRXhjbHVkZVxuXHRcdHBsYWluU3RhdGVzID0gW11cblx0XHRwbGFpblN0YXRlcy5wdXNoKHN0YXRlKSBmb3Igc3RhdGUgaW4gYWN0aXZlU3RhdGVzIHdoZW4gc3RhdGUgaXNudCBzdGF0ZVRvRXhjbHVkZVxuXHRcblx0aWYgbm90IGluY2x1ZGVTaGFyZWRTdGF0ZXMgb3Igbm90IEBfcHJvdmlkZWRTdGF0ZXNTaGFyZWRcblx0XHRyZXR1cm4gcGxhaW5TdGF0ZXNcblx0ZWxzZVxuXHRcdHJldHVybiBwbGFpblN0YXRlcy5jb25jYXQoQF9zdGF0ZVNoYXJlZClcblxuXG5RdWlja0VsZW1lbnQ6Ol9nZXRTdXBlcmlvclN0YXRlcyA9ICh0YXJnZXRTdGF0ZSwgYWN0aXZlU3RhdGVzKS0+XG5cdHRhcmdldFN0YXRlSW5kZXggPSBAX3Byb3ZpZGVkU3RhdGVzLmluZGV4T2YodGFyZ2V0U3RhdGUpXG5cdHJldHVybiBEVU1NWV9BUlJBWSBpZiB0YXJnZXRTdGF0ZUluZGV4IGlzIEBfcHJvdmlkZWRTdGF0ZXMubGVuZ3RoIC0gMVxuXHRcblx0c3VwZXJpb3IgPSBbXVxuXHRmb3IgY2FuZGlkYXRlIGluIGFjdGl2ZVN0YXRlc1xuXHRcdHN1cGVyaW9yLnB1c2goY2FuZGlkYXRlKSBpZiBAX3Byb3ZpZGVkU3RhdGVzLmluZGV4T2YoY2FuZGlkYXRlKSA+IHRhcmdldFN0YXRlSW5kZXhcblxuXHRyZXR1cm4gc3VwZXJpb3JcblxuXG5RdWlja0VsZW1lbnQ6Ol9nZXRTaGFyZWRTdGF0ZXMgPSAodGFyZ2V0U3RhdGUpLT5cblx0YWN0aXZlU3RhdGVzID0gQF9zdGF0ZVxuXHRzaGFyZWRTdGF0ZXMgPSBbXVxuXG5cdGZvciBzdGF0ZUNoYWluIGluIEBfcHJvdmlkZWRTdGF0ZXNTaGFyZWRcblx0XHRzaGFyZWRTdGF0ZXMucHVzaChzdGF0ZUNoYWluKSBpZiBzdGF0ZUNoYWluLmluY2x1ZGVzKHRhcmdldFN0YXRlKSBhbmQgc3RhdGVDaGFpbi5pc0FwcGxpY2FibGUodGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcylcblxuXHRyZXR1cm4gc2hhcmVkU3RhdGVzXG5cblxuUXVpY2tFbGVtZW50OjpfcmVzb2x2ZUZuU3R5bGVzID0gKHN0YXRlcywgaW5jbHVkZUJhc2UpLT5cblx0c3RhdGVzID0gWydiYXNlJ10uY29uY2F0KHN0YXRlcykgaWYgaW5jbHVkZUJhc2Vcblx0b3V0cHV0ID0ge31cblx0XG5cdGZvciBzdGF0ZSBpbiBzdGF0ZXMgd2hlbiBAX3N0eWxlc1tzdGF0ZV0gYW5kIEBfc3R5bGVzW3N0YXRlXS5mbnMubGVuZ3RoXG5cdFx0b3V0cHV0W2VudHJ5WzBdXSA9IGVudHJ5WzFdIGZvciBlbnRyeSBpbiBAX3N0eWxlc1tzdGF0ZV0uZm5zXG5cblx0cmV0dXJuIG91dHB1dFxuXG5cblxuXG5cblxuXG5cblxuIiwiIyMjKlxuICogU2V0cy9nZXRzIHRoZSB2YWx1ZSBvZiBhIHN0eWxlIHByb3BlcnR5LiBJbiBnZXR0ZXIgbW9kZSB0aGUgY29tcHV0ZWQgcHJvcGVydHkgb2ZcbiAqIHRoZSBzdHlsZSB3aWxsIGJlIHJldHVybmVkIHVubGVzcyB0aGUgZWxlbWVudCBpcyBub3QgaW5zZXJ0ZWQgaW50byB0aGUgRE9NLiBJblxuICogd2Via2l0IGJyb3dzZXJzIGFsbCBjb21wdXRlZCBwcm9wZXJ0aWVzIG9mIGEgZGV0YWNoZWQgbm9kZSBhcmUgYWx3YXlzIGFuIGVtcHR5XG4gKiBzdHJpbmcgYnV0IGluIGdlY2tvIHRoZXkgcmVmbGVjdCBvbiB0aGUgYWN0dWFsIGNvbXB1dGVkIHZhbHVlLCBoZW5jZSB3ZSBuZWVkXG4gKiB0byBcIm5vcm1hbGl6ZVwiIHRoaXMgYmVoYXZpb3IgYW5kIG1ha2Ugc3VyZSB0aGF0IGV2ZW4gb24gZ2Vja28gYW4gZW1wdHkgc3RyaW5nXG4gKiBpcyByZXR1cm5lZFxuICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4jIyNcblF1aWNrRWxlbWVudDo6c3R5bGUgPSAocHJvcGVydHkpLT5cblx0cmV0dXJuIGlmIEB0eXBlIGlzICd0ZXh0J1xuXHRhcmdzID0gYXJndW1lbnRzXG5cdFxuXHRpZiBJUy5zdHJpbmcocHJvcGVydHkpXG5cdFx0dmFsdWUgPSBpZiB0eXBlb2YgYXJnc1sxXSBpcyAnZnVuY3Rpb24nIHRoZW4gYXJnc1sxXS5jYWxsKEAsIEByZWxhdGVkKSBlbHNlIGFyZ3NbMV1cblx0XHR2YWx1ZSA9IENTUy5VTlNFVCBpZiBhcmdzWzFdIGlzIG51bGwgYW5kIElTLmRlZmluZWQoQGN1cnJlbnRTdGF0ZVN0eWxlKHByb3BlcnR5KSkgYW5kIG5vdCBJUy5mdW5jdGlvbihAY3VycmVudFN0YXRlU3R5bGUocHJvcGVydHkpKVxuXHRcdHJlc3VsdCA9IENTUyhAZWwsIHByb3BlcnR5LCB2YWx1ZSwgQG9wdGlvbnMuZm9yY2VTdHlsZSlcblx0XHRcblx0XHRpZiBhcmdzLmxlbmd0aCBpcyAxXG5cdFx0XHQjIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5cdFx0XHRyZXR1cm4gaWYgQF9pbnNlcnRlZCB0aGVuIHJlc3VsdCBlbHNlIGlmIG5vdCByZXN1bHQgdGhlbiByZXN1bHQgZWxzZSAnJ1xuXG5cdGVsc2UgaWYgSVMub2JqZWN0KHByb3BlcnR5KVxuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0eSk7IGkgPSAtMVxuXHRcdEBzdHlsZShrZXksIHByb3BlcnR5W2tleV0pIHdoaWxlIGtleT1rZXlzWysraV1cblxuXHRyZXR1cm4gQFxuXG5cbiMjIypcbiAqIEF0dGVtcHRzIHRvIHJlc29sdmUgdGhlIHZhbHVlIGZvciBhIGdpdmVuIHByb3BlcnR5IGluIHRoZSBmb2xsb3dpbmcgb3JkZXIgaWYgZWFjaCBvbmUgaXNuJ3QgYSB2YWxpZCB2YWx1ZTpcbiAqIDEuIGZyb20gY29tcHV0ZWQgc3R5bGUgKGZvciBkb20taW5zZXJ0ZWQgZWxzKVxuICogMi4gZnJvbSBET01FbGVtZW50LnN0eWxlIG9iamVjdCAoZm9yIG5vbi1pbnNlcnRlZCBlbHM7IGlmIG9wdGlvbnMuc3R5bGVBZnRlckluc2VydCwgd2lsbCBvbmx5IGhhdmUgc3RhdGUgc3R5bGVzKVxuICogMy4gZnJvbSBwcm92aWRlZCBzdHlsZSBvcHRpb25zXG4gKiAoZm9yIG5vbi1pbnNlcnRlZCBlbHM7IGNoZWNraW5nIG9ubHkgJGJhc2Ugc2luY2Ugc3RhdGUgc3R5bGVzIHdpbGwgYWx3YXlzIGJlIGFwcGxpZWQgdG8gdGhlIHN0eWxlIG9iamVjdCBldmVuIGZvciBub24taW5zZXJ0ZWQpXG4jIyNcblF1aWNrRWxlbWVudDo6c3R5bGVTYWZlID0gKHByb3BlcnR5LCBza2lwQ29tcHV0ZWQpLT5cblx0cmV0dXJuIGlmIEB0eXBlIGlzICd0ZXh0J1xuXHRzYW1wbGUgPSBAZWwuc3R5bGVbcHJvcGVydHldXG5cblx0aWYgSVMuc3RyaW5nKHNhbXBsZSkgb3IgSVMubnVtYmVyKHNhbXBsZSlcblx0XHRjb21wdXRlZCA9IGlmIHNraXBDb21wdXRlZCB0aGVuIDAgZWxzZSBAc3R5bGUocHJvcGVydHkpXG5cdFx0cmVzdWx0ID0gY29tcHV0ZWQgb3IgQGVsLnN0eWxlW3Byb3BlcnR5XSBvciBAY3VycmVudFN0YXRlU3R5bGUocHJvcGVydHkpIG9yICcnXG5cdFx0cmV0dXJuIGlmIHR5cGVvZiByZXN1bHQgaXMgJ2Z1bmN0aW9uJyB0aGVuIHJlc3VsdC5jYWxsKEAsIEByZWxhdGVkKSBlbHNlIHJlc3VsdFxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpzdHlsZVBhcnNlZCA9IChwcm9wZXJ0eSwgc2tpcENvbXB1dGVkKS0+XG5cdHBhcnNlRmxvYXQgQHN0eWxlU2FmZShwcm9wZXJ0eSwgc2tpcENvbXB1dGVkKVxuXG5cblF1aWNrRWxlbWVudDo6cmVjYWxjU3R5bGUgPSAocmVjYWxjQ2hpbGRyZW4pLT5cblx0dGFyZ2V0U3R5bGVzID0gQF9yZXNvbHZlRm5TdHlsZXMoQF9nZXRBY3RpdmVTdGF0ZXMoKSwgdHJ1ZSlcblxuXHRAc3R5bGUodGFyZ2V0U3R5bGVzKVxuXHRcblx0aWYgcmVjYWxjQ2hpbGRyZW5cblx0XHRjaGlsZC5yZWNhbGNTdHlsZSgpIGZvciBjaGlsZCBpbiBAX2NoaWxkcmVuXG5cdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6Y3VycmVudFN0YXRlU3R5bGUgPSAocHJvcGVydHkpLT4gaWYgcHJvcGVydHlcblx0aWYgQF9zdGF0ZS5sZW5ndGhcblx0XHRzdGF0ZXMgPSBAX3N0YXRlLnNsaWNlKClcblx0XHRzdGF0ZXMucHVzaChAX3N0YXRlU2hhcmVkLi4uKSBpZiBAX3N0YXRlU2hhcmVkIGFuZCBAX3N0YXRlU2hhcmVkLmxlbmd0aFxuXHRcdGkgPSBzdGF0ZXMubGVuZ3RoXG5cdFx0d2hpbGUgc3RhdGUgPSBzdGF0ZXNbLS1pXVxuXHRcdFx0cmV0dXJuIEBfc3R5bGVzW3N0YXRlXS5ydWxlW3Byb3BlcnR5XSBpZiBAX3N0eWxlc1tzdGF0ZV0gYW5kIElTLmRlZmluZWQoQF9zdHlsZXNbc3RhdGVdLnJ1bGVbcHJvcGVydHldKVxuXG5cdHJldHVybiBAX3N0eWxlcy5iYXNlLnJ1bGVbcHJvcGVydHldIGlmIEBfc3R5bGVzLmJhc2VcblxuXG5RdWlja0VsZW1lbnQ6OmhpZGUgPSAoKS0+XG5cdEBzdHlsZSAnZGlzcGxheScsICdub25lJ1xuXG5cblF1aWNrRWxlbWVudDo6c2hvdyA9IChkaXNwbGF5KS0+XG5cdGlmIG5vdCBkaXNwbGF5XG5cdFx0ZGlzcGxheSA9IEBjdXJyZW50U3RhdGVTdHlsZSgnZGlzcGxheScpXG5cdFx0ZGlzcGxheSA9ICdibG9jaycgaWYgZGlzcGxheSBpcyAnbm9uZScgb3Igbm90IGRpc3BsYXlcblx0XG5cdGRpc3BsYXkgPz0gQF9zdHlsZXMuYmFzZT8uZGlzcGxheSBvciAnYmxvY2snXG5cdEBzdHlsZSAnZGlzcGxheScsIGRpc3BsYXlcblxuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIFF1aWNrRWxlbWVudDo6LFxuXHQnb3JpZW50YXRpb24nOiBvcmllbnRhdGlvbkdldHRlciA9IGdldDogKCktPiBpZiBAd2lkdGggPiBAaGVpZ2h0IHRoZW4gJ2xhbmRzY2FwZScgZWxzZSAncG9ydHJhaXQnXG5cdCdhc3BlY3RSYXRpbyc6IGFzcGVjdFJhdGlvR2V0dGVyID0gZ2V0OiAoKS0+IEB3aWR0aC9AaGVpZ2h0XG5cdCdyZWN0JzogZ2V0OiAoKS0+IEBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHQnd2lkdGgnOlxuXHRcdGdldDogKCktPiBwYXJzZUZsb2F0IEBzdHlsZSgnd2lkdGgnKVxuXHRcdHNldDogKHZhbHVlKS0+IEBzdHlsZSAnd2lkdGgnLCB2YWx1ZVxuXHQnaGVpZ2h0Jzpcblx0XHRnZXQ6ICgpLT4gcGFyc2VGbG9hdCBAc3R5bGUoJ2hlaWdodCcpXG5cdFx0c2V0OiAodmFsdWUpLT4gQHN0eWxlICdoZWlnaHQnLCB2YWx1ZVxuXG5cbiIsIlF1aWNrRWxlbWVudDo6YXR0ciA9ICh0YXJnZXQsIG5ld1ZhbHVlKS0+XG5cdGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMVxuXHRcdGlmIHR5cGVvZiB0YXJnZXQgaXMgJ3N0cmluZydcblx0XHRcdHJldHVybiBAZWwuZ2V0QXR0cmlidXRlKHRhcmdldClcblx0XG5cdFx0aWYgSVMub2JqZWN0KHRhcmdldClcblx0XHRcdGtleXMgPSBPYmplY3Qua2V5cyh0YXJnZXQpOyBpID0gLTFcblx0XHRcdEBhdHRyKGtleSwgdGFyZ2V0W2tleV0pIHdoaWxlIGtleT1rZXlzWysraV1cblxuXHRlbHNlIGlmIG5ld1ZhbHVlIGlzIG51bGxcblx0XHRyZXR1cm4gQGVsLnJlbW92ZUF0dHJpYnV0ZSh0YXJnZXQpXG5cblx0ZWxzZVxuXHRcdEBlbC5zZXRBdHRyaWJ1dGUodGFyZ2V0LCBuZXdWYWx1ZSlcblx0XG5cdHJldHVybiBAXG5cblxuXG5RdWlja0VsZW1lbnQ6OnByb3AgPSAodGFyZ2V0LCBuZXdWYWx1ZSktPlxuXHRpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDFcblx0XHRpZiB0eXBlb2YgdGFyZ2V0IGlzICdzdHJpbmcnXG5cdFx0XHRyZXR1cm4gQGVsW3RhcmdldF1cblx0XG5cdFx0aWYgSVMub2JqZWN0KHRhcmdldClcblx0XHRcdGtleXMgPSBPYmplY3Qua2V5cyh0YXJnZXQpOyBpID0gLTFcblx0XHRcdEBwcm9wKGtleSwgdGFyZ2V0W2tleV0pIHdoaWxlIGtleT1rZXlzWysraV1cblx0XG5cdGVsc2Vcblx0XHRAZWxbdGFyZ2V0XSA9IG5ld1ZhbHVlXG5cdFx0XG5cdHJldHVybiBAIiwiUXVpY2tFbGVtZW50Ojp0b1RlbXBsYXRlID0gKCktPlxuXHRRdWlja0RvbS50ZW1wbGF0ZShAKVxuXG5cblF1aWNrRWxlbWVudDo6Y2xvbmUgPSAoKS0+XG5cdGVsQ2xvbmUgPSBAZWwuY2xvbmVOb2RlKGZhbHNlKVxuXHRvcHRpb25zID0gZXh0ZW5kLmNsb25lKEBvcHRpb25zLCB7ZXhpc3Rpbmc6ZWxDbG9uZX0pXG5cdFxuXHRuZXdFbCA9IG5ldyBRdWlja0VsZW1lbnQoQHR5cGUsIG9wdGlvbnMpXG5cdG5ld0VsLnN0YXRlKGFjdGl2ZVN0YXRlLCBvbikgZm9yIGFjdGl2ZVN0YXRlIGluIEBfc3RhdGVcblx0bmV3RWwuYXBwZW5kKGNoaWxkLmNsb25lKCkpIGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cblx0Zm9yIGV2ZW50TmFtZSwgY2FsbGJhY2tzIG9mIEBfZXZlbnRDYWxsYmFja3Ncblx0XHRuZXdFbC5vbihldmVudE5hbWUsIGNhbGxiYWNrKSBmb3IgY2FsbGJhY2sgaW4gY2FsbGJhY2tzXG5cdFxuXHRyZXR1cm4gbmV3RWxcblxuXG5RdWlja0VsZW1lbnQ6OmFwcGVuZCA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXHRcdFxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHRwcmV2UGFyZW50ID0gdGFyZ2V0RWwucGFyZW50XG5cdFx0XHRwcmV2UGFyZW50Ll9yZW1vdmVDaGlsZCh0YXJnZXRFbCkgaWYgcHJldlBhcmVudFxuXHRcdFx0QF9jaGlsZHJlbi5wdXNoKHRhcmdldEVsKVxuXHRcdFx0QGVsLmFwcGVuZENoaWxkKHRhcmdldEVsLmVsKVxuXHRcdFx0dGFyZ2V0RWwuX3JlZnJlc2hQYXJlbnQoKSAjIEZvcmNlIHJlLWZyZXNoIHRhcmdldEVsLl9wYXJlbnQgdmFsdWUgdG8gdHJpZ2dlciBpbnNlcnRlZCBjYWxsYmFja1xuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjphcHBlbmRUbyA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXHRcdFxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHR0YXJnZXRFbC5hcHBlbmQoQClcblx0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpwcmVwZW5kID0gKHRhcmdldEVsKS0+XG5cdGlmIHRhcmdldEVsXG5cdFx0dGFyZ2V0RWwgPSBoZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwodGFyZ2V0RWwpXG5cdFx0XG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbClcblx0XHRcdHByZXZQYXJlbnQgPSB0YXJnZXRFbC5wYXJlbnRcblx0XHRcdHByZXZQYXJlbnQuX3JlbW92ZUNoaWxkKHRhcmdldEVsKSBpZiBwcmV2UGFyZW50XG5cdFx0XHRAX2NoaWxkcmVuLnVuc2hpZnQodGFyZ2V0RWwpXG5cdFx0XHRAZWwuaW5zZXJ0QmVmb3JlKHRhcmdldEVsLmVsLCBAZWwuZmlyc3RDaGlsZClcblx0XHRcdHRhcmdldEVsLl9yZWZyZXNoUGFyZW50KCkgIyBGb3JjZSByZS1mcmVzaCB0YXJnZXRFbC5fcGFyZW50IHZhbHVlIHRvIHRyaWdnZXIgaW5zZXJ0ZWQgY2FsbGJhY2tcblx0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpwcmVwZW5kVG8gPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblx0XHRcblx0XHRpZiBJUy5xdWlja0RvbUVsKHRhcmdldEVsKVxuXHRcdFx0dGFyZ2V0RWwucHJlcGVuZChAKVxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjphZnRlciA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbCBhbmQgQHBhcmVudFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbClcblx0XHRcdG15SW5kZXggPSBAcGFyZW50Ll9jaGlsZHJlbi5pbmRleE9mKEApXG5cdFx0XHRAcGFyZW50Ll9jaGlsZHJlbi5zcGxpY2UobXlJbmRleCsxLCAwLCB0YXJnZXRFbClcblx0XHRcdEBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0YXJnZXRFbC5lbCwgQGVsLm5leHRTaWJsaW5nKVxuXHRcdFx0dGFyZ2V0RWwuX3JlZnJlc2hQYXJlbnQoKSAjIEZvcmNlIHJlLWZyZXNoIHRhcmdldEVsLl9wYXJlbnQgdmFsdWUgdG8gdHJpZ2dlciBpbnNlcnRlZCBjYWxsYmFja1xuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjppbnNlcnRBZnRlciA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXHRcdFxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHR0YXJnZXRFbC5hZnRlcihAKVxuXHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OmJlZm9yZSA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbCBhbmQgQHBhcmVudFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbClcblx0XHRcdG15SW5kZXggPSBAcGFyZW50Ll9jaGlsZHJlbi5pbmRleE9mKEApXG5cdFx0XHRAcGFyZW50Ll9jaGlsZHJlbi5zcGxpY2UobXlJbmRleCwgMCwgdGFyZ2V0RWwpXG5cdFx0XHRAZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGFyZ2V0RWwuZWwsIEBlbClcblx0XHRcdHRhcmdldEVsLl9yZWZyZXNoUGFyZW50KCkgIyBGb3JjZSByZS1mcmVzaCB0YXJnZXRFbC5fcGFyZW50IHZhbHVlIHRvIHRyaWdnZXIgaW5zZXJ0ZWQgY2FsbGJhY2tcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6aW5zZXJ0QmVmb3JlID0gKHRhcmdldEVsKS0+XG5cdGlmIHRhcmdldEVsXG5cdFx0dGFyZ2V0RWwgPSBoZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwodGFyZ2V0RWwpXG5cdFx0XG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbClcblx0XHRcdHRhcmdldEVsLmJlZm9yZShAKVxuXHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OmRldGFjaCA9ICgpLT5cblx0QHBhcmVudD8uX3JlbW92ZUNoaWxkKEApXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpyZW1vdmUgPSAoKS0+XG5cdEBkZXRhY2goKVxuXHRAcmVzZXRTdGF0ZSgpXG5cdGlmIEBfZXZlbnRDYWxsYmFja3Ncblx0XHRAX2V2ZW50Q2FsbGJhY2tzW2V2ZW50TmFtZV0ubGVuZ3RoID0gMCBmb3IgZXZlbnROYW1lIG9mIEBfZXZlbnRDYWxsYmFja3Ncblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OmVtcHR5ID0gKCktPlxuXHRAX3JlbW92ZUNoaWxkKGNoaWxkKSBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuLnNsaWNlKClcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OndyYXAgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblx0XHRjdXJyZW50UGFyZW50ID0gQHBhcmVudFxuXG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbCkgYW5kIHRhcmdldEVsIGlzbnQgQCBhbmQgdGFyZ2V0RWwgaXNudCBAcGFyZW50XG5cdFx0XHRpZiBjdXJyZW50UGFyZW50XG5cdFx0XHRcdGN1cnJlbnRQYXJlbnQuX3JlbW92ZUNoaWxkKEAsIGlmIG5vdCB0YXJnZXRFbC5wYXJlbnQgdGhlbiB0YXJnZXRFbClcblx0XHRcdFxuXHRcdFx0dGFyZ2V0RWwuYXBwZW5kKEApXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnVud3JhcCA9ICgpLT5cblx0cGFyZW50ID0gQHBhcmVudFxuXHRpZiBwYXJlbnRcblx0XHRwYXJlbnRDaGlsZHJlbiA9IFF1aWNrRG9tLmJhdGNoKHBhcmVudC5jaGlsZHJlbilcblx0XHRwYXJlbnRTaWJsaW5nID0gcGFyZW50Lm5leHRcblx0XHRncmFuZFBhcmVudCA9IHBhcmVudC5wYXJlbnRcblx0XHRpZiBncmFuZFBhcmVudFxuXHRcdFx0cGFyZW50LmRldGFjaCgpXG5cblx0XHRcdGlmIHBhcmVudFNpYmxpbmdcblx0XHRcdFx0cGFyZW50Q2hpbGRyZW4uaW5zZXJ0QmVmb3JlKHBhcmVudFNpYmxpbmcpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBhcmVudENoaWxkcmVuLmFwcGVuZFRvKGdyYW5kUGFyZW50KVxuXHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnJlcGxhY2UgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblx0XG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbCkgYW5kIHRhcmdldEVsIGlzbnQgQFxuXHRcdFx0dGFyZ2V0RWwuZGV0YWNoKClcblx0XHRcdEBwYXJlbnQ/Ll9yZW1vdmVDaGlsZChALCB0YXJnZXRFbClcblx0XHRcdHRhcmdldEVsLl9yZWZyZXNoUGFyZW50KCkgIyBGb3JjZSByZS1mcmVzaCB0YXJnZXRFbC5fcGFyZW50IHZhbHVlIHRvIHRyaWdnZXIgaW5zZXJ0ZWQgY2FsbGJhY2tcblx0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpoYXNDbGFzcyA9ICh0YXJnZXQpLT5cblx0aGVscGVycy5pbmNsdWRlcyhAY2xhc3NMaXN0LCB0YXJnZXQpXG5cblxuUXVpY2tFbGVtZW50OjphZGRDbGFzcyA9ICh0YXJnZXQpLT5cblx0Y2xhc3NMaXN0ID0gQGNsYXNzTGlzdFxuXHR0YXJnZXRJbmRleCA9IGNsYXNzTGlzdC5pbmRleE9mKHRhcmdldClcblxuXHRpZiB0YXJnZXRJbmRleCBpcyAtMVxuXHRcdGNsYXNzTGlzdC5wdXNoKHRhcmdldClcblx0XHRAY2xhc3NOYW1lID0gaWYgY2xhc3NMaXN0Lmxlbmd0aCA+IDEgdGhlbiBjbGFzc0xpc3Quam9pbignICcpIGVsc2UgY2xhc3NMaXN0WzBdXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnJlbW92ZUNsYXNzID0gKHRhcmdldCktPlxuXHRjbGFzc0xpc3QgPSBAY2xhc3NMaXN0XG5cdHRhcmdldEluZGV4ID0gY2xhc3NMaXN0LmluZGV4T2YodGFyZ2V0KVxuXHRcblx0aWYgdGFyZ2V0SW5kZXggaXNudCAtMVxuXHRcdGNsYXNzTGlzdC5zcGxpY2UodGFyZ2V0SW5kZXgsIDEpXG5cdFx0QGNsYXNzTmFtZSA9IGlmIGNsYXNzTGlzdC5sZW5ndGggdGhlbiBjbGFzc0xpc3Quam9pbignICcpIGVsc2UgJydcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6dG9nZ2xlQ2xhc3MgPSAodGFyZ2V0KS0+XG5cdGlmIEBoYXNDbGFzcyh0YXJnZXQpXG5cdFx0QHJlbW92ZUNsYXNzKHRhcmdldClcblx0ZWxzZVxuXHRcdEBhZGRDbGFzcyh0YXJnZXQpXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnNldFJlZiA9ICh0YXJnZXQpLT5cblx0QHJlZiA9IEBvcHRpb25zLnJlZiA9IHRhcmdldFxuXHRAYXR0ciAnZGF0YS1yZWYnLCB0YXJnZXRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6Ol9yZWZyZXNoUGFyZW50ID0gKCktPlxuXHRAcGFyZW50XG5cblxuUXVpY2tFbGVtZW50OjpfcmVtb3ZlQ2hpbGQgPSAodGFyZ2V0Q2hpbGQsIHJlcGxhY2VtZW50Q2hpbGQpLT5cblx0aW5kZXhPZkNoaWxkID0gQGNoaWxkcmVuLmluZGV4T2YodGFyZ2V0Q2hpbGQpXG5cdGlmIGluZGV4T2ZDaGlsZCBpc250IC0xXG5cdFx0aWYgcmVwbGFjZW1lbnRDaGlsZFxuXHRcdFx0QGVsLnJlcGxhY2VDaGlsZChyZXBsYWNlbWVudENoaWxkLmVsLCB0YXJnZXRDaGlsZC5lbClcblx0XHRcdEBfY2hpbGRyZW4uc3BsaWNlKGluZGV4T2ZDaGlsZCwgMSwgcmVwbGFjZW1lbnRDaGlsZClcblx0XHRlbHNlXG5cdFx0XHRAZWwucmVtb3ZlQ2hpbGQodGFyZ2V0Q2hpbGQuZWwpXG5cdFx0XHRAX2NoaWxkcmVuLnNwbGljZShpbmRleE9mQ2hpbGQsIDEpXG5cdFx0XG5cblx0cmV0dXJuIEBcblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBRdWlja0VsZW1lbnQ6Oixcblx0J2h0bWwnOlxuXHRcdGdldDogKCktPiBAZWwuaW5uZXJIVE1MXG5cdFx0c2V0OiAobmV3VmFsdWUpLT4gQGVsLmlubmVySFRNTCA9IG5ld1ZhbHVlXG5cdFxuXHQndGV4dCc6XG5cdFx0Z2V0OiAoKS0+IEBlbC50ZXh0Q29udGVudFxuXHRcdHNldDogKG5ld1ZhbHVlKS0+IEBlbC50ZXh0Q29udGVudCA9IG5ld1ZhbHVlXG5cblx0J2NsYXNzTmFtZSc6XG5cdFx0Z2V0OiAoKS0+IGlmIEBzdmcgdGhlbiAoQGF0dHIoJ2NsYXNzJykgb3IgJycpIGVsc2UgQHJhdy5jbGFzc05hbWVcblx0XHRzZXQ6IChuZXdWYWx1ZSktPiBpZiBAc3ZnIHRoZW4gQGF0dHIoJ2NsYXNzJywgbmV3VmFsdWUpIGVsc2UgQHJhdy5jbGFzc05hbWUgPSBuZXdWYWx1ZVxuXG5cdCdjbGFzc0xpc3QnOlxuXHRcdGdldDogKCktPlxuXHRcdFx0bGlzdCA9IEBjbGFzc05hbWUuc3BsaXQoL1xccysvKVxuXHRcdFx0bGlzdC5wb3AoKSBpZiBsaXN0W2xpc3QubGVuZ3RoLTFdIGlzICcnXG5cdFx0XHRsaXN0LnNoaWZ0KCkgaWYgbGlzdFswXSBpcyAnJ1xuXHRcdFx0cmV0dXJuIGxpc3RcblxuXG5cblxuXG5cblxuIiwiUXVpY2tFbGVtZW50Ojp1cGRhdGVPcHRpb25zID0gKG9wdGlvbnMpLT5cblx0aWYgSVMub2JqZWN0KG9wdGlvbnMpIFxuXHRcdEBvcHRpb25zID0gb3B0aW9uc1xuXHRcdEBfbm9ybWFsaXplT3B0aW9ucygpXG5cdFx0QF9hcHBseU9wdGlvbnMoQG9wdGlvbnMpXG5cdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6dXBkYXRlU3RhdGVTdHlsZXMgPSAoc3R5bGVzKS0+XG5cdGlmIElTLm9iamVjdFBsYWluKHN0eWxlcylcblx0XHRleHRlbmQuZGVlcC5jb25jYXQgQCwgcGFyc2VkID0gQF9wYXJzZVN0eWxlcyhzdHlsZXMpXG5cblx0XHRpZiBwYXJzZWQuX3N0eWxlc1xuXHRcdFx0dXBkYXRlZFN0YXRlcyA9IE9iamVjdC5rZXlzKHBhcnNlZC5fc3R5bGVzKVxuXHRcdFx0XG5cdFx0XHRmb3Igc3RhdGUgaW4gdXBkYXRlZFN0YXRlcyB3aGVuIEBzdGF0ZShzdGF0ZSkgb3Igc3RhdGUgaXMgJ2Jhc2UnXG5cdFx0XHRcdEBfYXBwbHlSZWdpc3RlcmVkU3R5bGUoQF9zdHlsZXNbc3RhdGVdLCBAX2dldEFjdGl2ZVN0YXRlcyhzdGF0ZSksIGZhbHNlKVxuXHRcdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6dXBkYXRlU3RhdGVUZXh0cyA9ICh0ZXh0cyktPlxuXHRpZiBJUy5vYmplY3RQbGFpbih0ZXh0cylcblx0XHRleHRlbmQuZGVlcC5jb25jYXQgQCwgcGFyc2VkID0gQF9wYXJzZVRleHRzKHRleHRzKVxuXHRcblx0cmV0dXJuIEBcblxuXG5cblF1aWNrRWxlbWVudDo6YXBwbHlEYXRhID0gKGRhdGEsIHBhc3NUaHJvdWdoKS0+XG5cdGlmIEBvcHRpb25zLnBhc3NEYXRhVG9DaGlsZHJlbiBhbmQgQF9jaGlsZHJlbi5sZW5ndGggYW5kIChwYXNzVGhyb3VnaCA/PSB0cnVlKVxuXHRcdGNoaWxkLmFwcGx5RGF0YShkYXRhKSBmb3IgY2hpbGQgaW4gQF9jaGlsZHJlblxuXG5cdGlmIGNvbXB1dGVycyA9IEBvcHRpb25zLmNvbXB1dGVyc1xuXHRcdGRlZmF1bHRzID0gQG9wdGlvbnMuZGVmYXVsdHNcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoY29tcHV0ZXJzKVxuXHRcdFxuXHRcdGZvciBrZXkgaW4ga2V5c1xuXHRcdFx0aWYgQG9wdGlvbnMuaW52b2tlQ29tcHV0ZXJzT25jZVxuXHRcdFx0XHRjb250aW51ZSBpZiBAX2ludm9rZWRDb21wdXRlcnNba2V5XVxuXHRcdFx0XHRAX2ludm9rZWRDb21wdXRlcnNba2V5XSA9IDFcblx0XHRcdFxuXHRcdFx0aWYgZGF0YSBhbmQgZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpXG5cdFx0XHRcdEBfcnVuQ29tcHV0ZXIoa2V5LCBkYXRhW2tleV0sIGRhdGEpXG5cdFx0XHRcblx0XHRcdGVsc2UgaWYgZGVmYXVsdHMgYW5kIGRlZmF1bHRzLmhhc093blByb3BlcnR5KGtleSlcblx0XHRcdFx0QF9ydW5Db21wdXRlcihrZXksIGRlZmF1bHRzW2tleV0sIGRhdGEpXG5cdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6X3J1bkNvbXB1dGVyID0gKGNvbXB1dGVyLCBhcmcsIGRhdGEpLT5cblx0QG9wdGlvbnMuY29tcHV0ZXJzW2NvbXB1dGVyXS5jYWxsKEAsIGFyZywgZGF0YSlcblxuXG5cblxuXG5cbiIsIlF1aWNrV2luZG93ID0gXG5cdHR5cGU6ICd3aW5kb3cnXG5cdGVsOiB3aW5kb3dcblx0cmF3OiB3aW5kb3dcblx0X2V2ZW50Q2FsbGJhY2tzOiB7X19yZWZzOnt9fVxuXHRcblxuUXVpY2tXaW5kb3cub24gPSAgUXVpY2tFbGVtZW50OjpvblxuUXVpY2tXaW5kb3cub2ZmID0gIFF1aWNrRWxlbWVudDo6b2ZmXG5RdWlja1dpbmRvdy5lbWl0ID0gIFF1aWNrRWxlbWVudDo6ZW1pdFxuUXVpY2tXaW5kb3cuZW1pdFByaXZhdGUgPSAgUXVpY2tFbGVtZW50OjplbWl0UHJpdmF0ZVxuUXVpY2tXaW5kb3cuX2xpc3RlblRvID0gIFF1aWNrRWxlbWVudDo6X2xpc3RlblRvXG5RdWlja1dpbmRvdy5faW52b2tlSGFuZGxlcnMgPSAgUXVpY2tFbGVtZW50OjpfaW52b2tlSGFuZGxlcnNcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIFF1aWNrV2luZG93LFxuXHQnd2lkdGgnOiBnZXQ6ICgpLT4gd2luZG93LmlubmVyV2lkdGhcblx0J2hlaWdodCc6IGdldDogKCktPiB3aW5kb3cuaW5uZXJIZWlnaHRcblx0J29yaWVudGF0aW9uJzogb3JpZW50YXRpb25HZXR0ZXJcblx0J2FzcGVjdFJhdGlvJzogYXNwZWN0UmF0aW9HZXR0ZXJcblxuIiwiTWVkaWFRdWVyeSA9IG5ldyAoKS0+XG5cdGNhbGxiYWNrcyA9IFtdXG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsICgpLT5cblx0XHRjYWxsYmFjaygpIGZvciBjYWxsYmFjayBpbiBjYWxsYmFja3Ncblx0XHRyZXR1cm5cblxuXHRAcGFyc2VRdWVyeSA9ICh0YXJnZXQsIHF1ZXJ5U3RyaW5nKS0+XG5cdFx0cXVlcnlTcGxpdCA9IHF1ZXJ5U3RyaW5nLnNwbGl0KCcoJylcblx0XHRzb3VyY2UgPSBxdWVyeVNwbGl0WzBdXG5cdFx0c291cmNlID0gc3dpdGNoIHNvdXJjZVxuXHRcdFx0d2hlbiAnd2luZG93JyB0aGVuIFF1aWNrV2luZG93XG5cdFx0XHR3aGVuICdwYXJlbnQnIHRoZW4gdGFyZ2V0LnBhcmVudFxuXHRcdFx0d2hlbiAnc2VsZicgdGhlbiB0YXJnZXRcblx0XHRcdGVsc2UgdGFyZ2V0LnBhcmVudE1hdGNoaW5nIChwYXJlbnQpLT4gcGFyZW50LnJlZiBpcyBzb3VyY2Uuc2xpY2UoMSlcblxuXHRcdHJ1bGVzID0gcXVlcnlTcGxpdFsxXVxuXHRcdFx0LnNsaWNlKDAsLTEpXG5cdFx0XHQuc3BsaXQocnVsZURlbGltaXRlcilcblx0XHRcdC5tYXAgKHJ1bGUpLT4gXG5cdFx0XHRcdHNwbGl0ID0gcnVsZS5zcGxpdCgnOicpXG5cdFx0XHRcdHZhbHVlID0gcGFyc2VGbG9hdChzcGxpdFsxXSlcblx0XHRcdFx0dmFsdWUgPSBzcGxpdFsxXSBpZiBpc05hTih2YWx1ZSlcblx0XHRcdFx0a2V5ID0gc3BsaXRbMF1cblx0XHRcdFx0a2V5UHJlZml4ID0ga2V5LnNsaWNlKDAsNClcblx0XHRcdFx0bWF4ID0ga2V5UHJlZml4IGlzICdtYXgtJ1xuXHRcdFx0XHRtaW4gPSBub3QgbWF4IGFuZCBrZXlQcmVmaXggaXMgJ21pbi0nXG5cdFx0XHRcdGtleSA9IGtleS5zbGljZSg0KSBpZiBtYXggb3IgbWluXG5cdFx0XHRcdGdldHRlciA9IHN3aXRjaCBrZXlcblx0XHRcdFx0XHR3aGVuICdvcmllbnRhdGlvbicgdGhlbiAoKS0+IHNvdXJjZS5vcmllbnRhdGlvblxuXHRcdFx0XHRcdHdoZW4gJ2FzcGVjdC1yYXRpbycgdGhlbiAoKS0+IHNvdXJjZS5hc3BlY3RSYXRpb1xuXHRcdFx0XHRcdHdoZW4gJ3dpZHRoJywnaGVpZ2h0JyB0aGVuICgpLT4gc291cmNlW2tleV1cblx0XHRcdFx0XHRlbHNlICgpLT5cblx0XHRcdFx0XHRcdHN0cmluZ1ZhbHVlID0gc291cmNlLnN0eWxlKGtleSlcblx0XHRcdFx0XHRcdHBhcnNlZFZhbHVlID0gcGFyc2VGbG9hdCBzdHJpbmdWYWx1ZVxuXHRcdFx0XHRcdFx0cmV0dXJuIGlmIGlzTmFOKHBhcnNlZFZhbHVlKSB0aGVuIHN0cmluZ1ZhbHVlIGVsc2UgcGFyc2VkVmFsdWVcblx0XHRcdFx0XG5cdFx0XHRcdHJldHVybiB7a2V5LHZhbHVlLG1pbixtYXgsZ2V0dGVyfVxuXG5cdFx0cmV0dXJuIHtzb3VyY2UsIHJ1bGVzfVxuXG5cblx0QHJlZ2lzdGVyID0gKHRhcmdldCwgcXVlcnlTdHJpbmcpLT5cblx0XHRxdWVyeSA9IEBwYXJzZVF1ZXJ5KHRhcmdldCwgcXVlcnlTdHJpbmcpXG5cdFx0aWYgcXVlcnkuc291cmNlXG5cdFx0XHRjYWxsYmFja3MucHVzaCBjYWxsYmFjayA9ICgpLT4gdGVzdFJ1bGUodGFyZ2V0LCBxdWVyeSwgcXVlcnlTdHJpbmcpXG5cdFx0XHRjYWxsYmFjaygpXG5cdFx0cmV0dXJuIHF1ZXJ5XG5cblxuXHR0ZXN0UnVsZSA9ICh0YXJnZXQsIHF1ZXJ5LCBxdWVyeVN0cmluZyktPlxuXHRcdHBhc3NlZCA9IHRydWVcblxuXHRcdGZvciBydWxlIGluIHF1ZXJ5LnJ1bGVzXG5cdFx0XHRjdXJyZW50VmFsdWUgPSBydWxlLmdldHRlcigpXG5cdFx0XHRwYXNzZWQgPSBzd2l0Y2hcblx0XHRcdFx0d2hlbiBydWxlLm1pbiB0aGVuIGN1cnJlbnRWYWx1ZSA+PSBydWxlLnZhbHVlXG5cdFx0XHRcdHdoZW4gcnVsZS5tYXggdGhlbiBjdXJyZW50VmFsdWUgPD0gcnVsZS52YWx1ZVxuXHRcdFx0XHRlbHNlIGN1cnJlbnRWYWx1ZSBpcyBydWxlLnZhbHVlXG5cblx0XHRcdGJyZWFrIGlmIG5vdCBwYXNzZWRcdFx0XG5cdFx0XG5cdFx0dGFyZ2V0LnN0YXRlKHF1ZXJ5U3RyaW5nLCBwYXNzZWQpXG5cblx0cmV0dXJuIEBcblxuXG5cblxucnVsZURlbGltaXRlciA9IC8sXFxzKi9cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsImNsYXNzIFF1aWNrQmF0Y2hcblx0Y29uc3RydWN0b3I6IChlbGVtZW50cywgQHJldHVyblJlc3VsdHMpLT5cblx0XHRAZWxlbWVudHMgPSBlbGVtZW50cy5tYXAgKGVsKS0+IFF1aWNrRG9tKGVsKVxuXG5cdHJldmVyc2U6ICgpLT5cblx0XHRAZWxlbWVudHMgPSBAZWxlbWVudHMucmV2ZXJzZSgpXG5cdFx0cmV0dXJuIEBcblxuXHRyZXR1cm46IChyZXR1cm5OZXh0KS0+XG5cdFx0aWYgcmV0dXJuTmV4dFxuXHRcdFx0QHJldHVyblJlc3VsdHMgPSB0cnVlXG5cdFx0XHRyZXR1cm4gQFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBAbGFzdFJlc3VsdHNcblxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuUXVpY2tCYXRjaC5uYW1lID89ICdRdWlja0JhdGNoJ1xuXG5cblxuT2JqZWN0LmtleXMoUXVpY2tFbGVtZW50OjopLmNvbmNhdCgnY3NzJywgJ3JlcGxhY2VXaXRoJywgJ2h0bWwnLCAndGV4dCcpLmZvckVhY2ggKG1ldGhvZCktPlxuXHRRdWlja0JhdGNoOjpbbWV0aG9kXSA9IChuZXdWYWx1ZSktPlxuXHRcdHJlc3VsdHMgPSBAbGFzdFJlc3VsdHMgPSBmb3IgZWxlbWVudCBpbiBAZWxlbWVudHNcblx0XHRcdGlmIG1ldGhvZCBpcyAnaHRtbCcgb3IgbWV0aG9kIGlzICd0ZXh0J1xuXHRcdFx0XHRpZiBuZXdWYWx1ZSB0aGVuIGVsZW1lbnRbbWV0aG9kXSA9IG5ld1ZhbHVlIGVsc2UgZWxlbWVudFttZXRob2RdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGVsZW1lbnRbbWV0aG9kXShhcmd1bWVudHMuLi4pXG5cdFx0XG5cdFx0cmV0dXJuIGlmIEByZXR1cm5SZXN1bHRzIHRoZW4gcmVzdWx0cyBlbHNlIEBcblxuXG5RdWlja0RvbS5iYXRjaCA9IChlbGVtZW50cywgcmV0dXJuUmVzdWx0cyktPlxuXHRpZiBub3QgSVMuaXRlcmFibGUoZWxlbWVudHMpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmF0Y2g6IGV4cGVjdGVkIGFuIGl0ZXJhYmxlLCBnb3QgI3tTdHJpbmcoZWxlbWVudHMpfVwiKVxuXHRlbHNlIGlmIG5vdCBlbGVtZW50cy5sZW5ndGhcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYXRjaDogZXhwZWN0ZWQgYSBub24tZW1wdHkgZWxlbWVudCBjb2xsZWN0aW9uXCIpXG5cblx0cmV0dXJuIG5ldyBRdWlja0JhdGNoKGVsZW1lbnRzLCByZXR1cm5SZXN1bHRzKVxuXG5cbiIsImltcG9ydCAnLi9leHRlbmRUZW1wbGF0ZSdcbmltcG9ydCAnLi9wYXJzZVRyZWUnXG5pbXBvcnQgJy4vc2NoZW1hJ1xuXG5jbGFzcyBRdWlja1RlbXBsYXRlXG5cdGNvbnN0cnVjdG9yOiAoY29uZmlnLCBpc1RyZWUpLT5cblx0XHRyZXR1cm4gY29uZmlnIGlmIElTLnRlbXBsYXRlKGNvbmZpZylcblx0XHRjb25maWcgPSBpZiBpc1RyZWUgdGhlbiBwYXJzZVRyZWUoY29uZmlnKSBlbHNlIGNvbmZpZ1xuXHRcdGV4dGVuZCBALCBjb25maWdcblx0XG5cdGV4dGVuZDogKG5ld1ZhbHVlcywgZ2xvYmFsT3B0cyktPlxuXHRcdG5ldyBRdWlja1RlbXBsYXRlIGV4dGVuZFRlbXBsYXRlKEAsIG5ld1ZhbHVlcywgZ2xvYmFsT3B0cylcblxuXHRzcGF3bjogKG5ld1ZhbHVlcywgZ2xvYmFsT3B0cywgZGF0YSktPlxuXHRcdGlmIG5ld1ZhbHVlcyBhbmQgbmV3VmFsdWVzLmRhdGFcblx0XHRcdGRhdGEgPSBuZXdWYWx1ZXMuZGF0YVxuXHRcdFx0bmV3VmFsdWVzID0gbnVsbCBpZiBPYmplY3Qua2V5cyhuZXdWYWx1ZXMpLmxlbmd0aCBpcyAxXG5cdFx0XG5cdFx0aWYgbmV3VmFsdWVzIG9yIGdsb2JhbE9wdHNcblx0XHRcdHtvcHRpb25zLCBjaGlsZHJlbiwgdHlwZX0gPSBleHRlbmRUZW1wbGF0ZShALCBuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpXG5cdFx0ZWxzZVxuXHRcdFx0e29wdGlvbnMsIGNoaWxkcmVuLCB0eXBlfSA9IEBcblx0XHRcdG9wdGlvbnMgPSBleHRlbmQuY2xvbmUob3B0aW9ucylcblxuXHRcdFxuXHRcdGVsZW1lbnQgPSBRdWlja0RvbS5jcmVhdGUoW3R5cGUsIG9wdGlvbnNdKVxuXHRcdFxuXHRcdGlmIGNoaWxkcmVuXG5cdFx0XHRjaGlsZERhdGEgPSBpZiBvcHRpb25zLnBhc3NEYXRhVG9DaGlsZHJlbiB0aGVuIGRhdGEgb3Igb3B0aW9ucy5kYXRhXG5cdFx0XHRmb3IgY2hpbGQgaW4gY2hpbGRyZW5cblx0XHRcdFx0ZWxlbWVudC5hcHBlbmQgY2hpbGQuc3Bhd24obnVsbCwgbnVsbCwgY2hpbGREYXRhKVxuXG5cdFx0ZWxlbWVudC5fcG9zdENyZWF0aW9uKGRhdGEpXG5cdFx0cmV0dXJuIGVsZW1lbnRcblxuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja1RlbXBsYXRlLm5hbWUgPz0gJ1F1aWNrVGVtcGxhdGUnXG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5IFF1aWNrVGVtcGxhdGU6OiwgJ2NoaWxkJywgZ2V0OiAoKS0+XG5cdEBfY2hpbGRSZWZzIG9yIF9nZXRDaGlsZFJlZnMoQCkgIyBzb3VyY2UgaW4gL3NyYy9wYXJ0cy9lbGVtZW50L3RyYXZlcnNpbmcuY29mZmVlXG5cblxuXG5cblxuXG5cblxuIiwibm90RGVlcEtleXMgPSBbJ3JlbGF0ZWRJbnN0YW5jZScsJ3JlbGF0ZWQnLCdkYXRhJ11cbm5vdEtleXMgPSBbJ2NoaWxkcmVuJywnX2NoaWxkUmVmcyddXG5cbmV4dGVuZFRlbXBsYXRlID0gKGN1cnJlbnRPcHRzLCBuZXdPcHRzLCBnbG9iYWxPcHRzKS0+XG5cdGlmIGdsb2JhbE9wdHMgdGhlbiBnbG9iYWxPcHRzVHJhbnNmb3JtID0gb3B0aW9uczogKG9wdHMpLT4gZXh0ZW5kKG9wdHMsIGdsb2JhbE9wdHMpXG5cdGlmIElTLmFycmF5KG5ld09wdHMpXG5cdFx0bmV3T3B0cyA9IHBhcnNlVHJlZShuZXdPcHRzLCBmYWxzZSlcblx0ZWxzZSBpZiBuZXdPcHRzIGFuZCBub3QgbWF0Y2hlc1NjaGVtYShuZXdPcHRzKVxuXHRcdG5ld09wdHMgPSBvcHRpb25zOm5ld09wdHNcblxuXG5cdG91dHB1dCA9IGV4dGVuZC5kZWVwLm51bGxEZWxldGVzLm5vdEtleXMobm90S2V5cykubm90RGVlcChub3REZWVwS2V5cykudHJhbnNmb3JtKGdsb2JhbE9wdHNUcmFuc2Zvcm0pLmNsb25lKGN1cnJlbnRPcHRzLCBuZXdPcHRzKVxuXHRjdXJyZW50Q2hpbGRyZW4gPSBjdXJyZW50T3B0cy5jaGlsZHJlblxuXHRuZXdDaGlsZHJlbiA9IG5ld09wdHM/LmNoaWxkcmVuIG9yIFtdXG5cdG91dHB1dC5jaGlsZHJlbiA9IFtdXG5cblx0IyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuXHRpZiBJUy5hcnJheShuZXdDaGlsZHJlbilcblx0XHRtYXhMZW5ndGggPSBNYXRoLm1heChjdXJyZW50Q2hpbGRyZW4ubGVuZ3RoLCBuZXdDaGlsZHJlbi5sZW5ndGgpXG5cdFx0aW5kZXggPSAtMVxuXHRcdHdoaWxlICsraW5kZXggaXNudCBtYXhMZW5ndGhcblx0XHRcdG5lZWRzVGVtcGxhdGVXcmFwID0gbm9DaGFuZ2VzID0gZmFsc2Vcblx0XHRcdGN1cnJlbnRDaGlsZCA9IGN1cnJlbnRDaGlsZHJlbltpbmRleF1cblx0XHRcdG5ld0NoaWxkID0gbmV3Q2hpbGRyZW5baW5kZXhdXG5cdFx0XHRuZXdDaGlsZFByb2Nlc3NlZCA9IHN3aXRjaFxuXHRcdFx0XHR3aGVuIElTLnRlbXBsYXRlKG5ld0NoaWxkKSB0aGVuIG5ld0NoaWxkXG5cdFx0XHRcdHdoZW4gSVMuYXJyYXkobmV3Q2hpbGQpIHRoZW4gbmVlZHNUZW1wbGF0ZVdyYXAgPSBwYXJzZVRyZWUobmV3Q2hpbGQpXG5cdFx0XHRcdHdoZW4gSVMuc3RyaW5nKG5ld0NoaWxkKSB0aGVuIG5lZWRzVGVtcGxhdGVXcmFwID0ge3R5cGU6J3RleHQnLCBvcHRpb25zOnt0ZXh0Om5ld0NoaWxkfX1cblx0XHRcdFx0d2hlbiBub3QgbmV3Q2hpbGQgYW5kIG5vdCBnbG9iYWxPcHRzIHRoZW4gbm9DaGFuZ2VzID0gdHJ1ZVxuXHRcdFx0XHRlbHNlIG5lZWRzVGVtcGxhdGVXcmFwID0gbmV3Q2hpbGQgb3IgdHJ1ZVxuXG5cblx0XHRcdGlmIG5vQ2hhbmdlc1xuXHRcdFx0XHRuZXdDaGlsZFByb2Nlc3NlZCA9IGN1cnJlbnRDaGlsZFxuXHRcdFx0XG5cdFx0XHRlbHNlIGlmIG5lZWRzVGVtcGxhdGVXcmFwXG5cdFx0XHRcdG5ld0NoaWxkUHJvY2Vzc2VkID0gXG5cdFx0XHRcdFx0aWYgY3VycmVudENoaWxkXG5cdFx0XHRcdFx0XHRjdXJyZW50Q2hpbGQuZXh0ZW5kKG5ld0NoaWxkUHJvY2Vzc2VkLCBnbG9iYWxPcHRzKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdG5ldyBRdWlja1RlbXBsYXRlKGV4dGVuZC5jbG9uZShzY2hlbWEsIG5ld0NoaWxkUHJvY2Vzc2VkKSlcblxuXHRcdFx0b3V0cHV0LmNoaWxkcmVuLnB1c2ggbmV3Q2hpbGRQcm9jZXNzZWRcblx0XG5cdFxuXHRlbHNlIGlmIElTLm9iamVjdChuZXdDaGlsZHJlbilcblx0XHRuZXdDaGlsZHJlbiA9IGV4dGVuZC5hbGxvd051bGwuY2xvbmUgbmV3Q2hpbGRyZW5cblx0XHRvdXRwdXQuY2hpbGRyZW4gPSBleHRlbmRCeVJlZihuZXdDaGlsZHJlbiwgY3VycmVudENoaWxkcmVuLCBnbG9iYWxPcHRzKVxuXHRcdHJlbWFpbmluZ05ld0NoaWxkcmVuID0gbmV3Q2hpbGRyZW5cblx0XHRcblx0XHRmb3IgcmVmLG5ld0NoaWxkIG9mIHJlbWFpbmluZ05ld0NoaWxkcmVuXG5cdFx0XHRuZXdDaGlsZFByb2Nlc3NlZCA9IGlmIElTLm9iamVjdFBsYWluKG5ld0NoaWxkKSBhbmQgbm90IElTLnRlbXBsYXRlKG5ld0NoaWxkKSB0aGVuIG5ld0NoaWxkIGVsc2UgcGFyc2VUcmVlKG5ld0NoaWxkKVxuXHRcdFx0b3V0cHV0LmNoaWxkcmVuLnB1c2ggbmV3IFF1aWNrVGVtcGxhdGUgbmV3Q2hpbGRQcm9jZXNzZWRcblx0XHRcdGRlbGV0ZSByZW1haW5pbmdOZXdDaGlsZHJlbltyZWZdXG5cblx0cmV0dXJuIG91dHB1dFxuXG5cblxuXG5leHRlbmRCeVJlZiA9IChuZXdDaGlsZHJlblJlZnMsIGN1cnJlbnRDaGlsZHJlbiwgZ2xvYmFsT3B0cyktPiBpZiBub3QgY3VycmVudENoaWxkcmVuLmxlbmd0aCB0aGVuIGN1cnJlbnRDaGlsZHJlbiBlbHNlXG5cdG91dHB1dCA9IFtdXG5cdFxuXHRmb3IgY3VycmVudENoaWxkIGluIGN1cnJlbnRDaGlsZHJlblxuXHRcdG5ld0NoaWxkID0gbmV3Q2hpbGRyZW5SZWZzW2N1cnJlbnRDaGlsZC5yZWZdXG5cdFx0aWYgbmV3Q2hpbGRcblx0XHRcdG5ld0NoaWxkUHJvY2Vzc2VkID0gY3VycmVudENoaWxkLmV4dGVuZChuZXdDaGlsZCwgZ2xvYmFsT3B0cylcblx0XHRcdGRlbGV0ZSBuZXdDaGlsZHJlblJlZnNbY3VycmVudENoaWxkLnJlZl1cblx0XHRcblx0XHRlbHNlIGlmIG5ld0NoaWxkIGlzIG51bGxcblx0XHRcdGRlbGV0ZSBuZXdDaGlsZHJlblJlZnNbY3VycmVudENoaWxkLnJlZl1cblx0XHRcdGNvbnRpbnVlXG5cdFx0XG5cdFx0ZWxzZVxuXHRcdFx0bmV3Q2hpbGRQcm9jZXNzZWQgPSBzd2l0Y2hcblx0XHRcdFx0d2hlbiBnbG9iYWxPcHRzIHRoZW4gY3VycmVudENoaWxkLmV4dGVuZChudWxsLCBnbG9iYWxPcHRzKVxuXHRcdFx0XHR3aGVuIE9iamVjdC5rZXlzKG5ld0NoaWxkcmVuUmVmcykubGVuZ3RoIHRoZW4gY3VycmVudENoaWxkLmV4dGVuZCgpXG5cdFx0XHRcdGVsc2UgY3VycmVudENoaWxkXG5cblx0XHRuZXdDaGlsZFByb2Nlc3NlZC5jaGlsZHJlbiA9IGV4dGVuZEJ5UmVmKG5ld0NoaWxkcmVuUmVmcywgbmV3Q2hpbGRQcm9jZXNzZWQuY2hpbGRyZW4pXG5cdFx0b3V0cHV0LnB1c2gobmV3Q2hpbGRQcm9jZXNzZWQpXG5cblx0cmV0dXJuIG91dHB1dFxuXG5cblxuXG4iLCJwYXJzZVRyZWUgPSAodHJlZSwgcGFyc2VDaGlsZHJlbiktPiBzd2l0Y2hcblx0d2hlbiBJUy5hcnJheSh0cmVlKVxuXHRcdG91dHB1dCA9IHt9XG5cblx0XHRpZiBub3QgSVMuc3RyaW5nKHRyZWVbMF0pXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCIje3BhcnNlRXJyb3JQcmVmaXh9IHN0cmluZyBmb3IgJ3R5cGUnLCBnb3QgJyN7U3RyaW5nKHRyZWVbMF0pfSdcIlxuXHRcdGVsc2Vcblx0XHRcdG91dHB1dC50eXBlID0gdHJlZVswXVxuXHRcdFxuXHRcdGlmIHRyZWUubGVuZ3RoID4gMSBhbmQgbm90IElTLm9iamVjdCh0cmVlWzFdKSBhbmQgdHJlZVsxXSBpc250IG51bGxcblx0XHRcdHRocm93IG5ldyBFcnJvciBcIiN7cGFyc2VFcnJvclByZWZpeH0gb2JqZWN0IGZvciAnb3B0aW9ucycsIGdvdCAnI3tTdHJpbmcodHJlZVsxXSl9J1wiXG5cdFx0ZWxzZVxuXHRcdFx0b3V0cHV0Lm9wdGlvbnMgPSBpZiB0cmVlWzFdIHRoZW4gZXh0ZW5kLmRlZXAuY2xvbmUodHJlZVsxXSkgZWxzZSBzY2hlbWEub3B0aW9uc1xuXHRcdFx0b3V0cHV0LnJlZiA9IHRyZWVbMV0uaWQgb3IgdHJlZVsxXS5yZWYgaWYgdHJlZVsxXVxuXG5cdFx0b3V0cHV0LmNoaWxkcmVuID0gdHJlZS5zbGljZSgyKVxuXHRcdGlmIHBhcnNlQ2hpbGRyZW4gaXMgZmFsc2Vcblx0XHRcdG91dHB1dC5jaGlsZHJlbiA9IHRyZWVbMl0gaWYgdHJlZS5sZW5ndGggaXMgMyBhbmQgSVMub2JqZWN0UGxhaW4odHJlZVsyXSkgYW5kIG5vdCBJUy50ZW1wbGF0ZSh0cmVlWzJdKVxuXHRcdGVsc2Vcblx0XHRcdG91dHB1dC5jaGlsZHJlbiA9IG91dHB1dC5jaGlsZHJlbi5tYXAoUXVpY2tEb20udGVtcGxhdGUpXG5cdFx0cmV0dXJuIG91dHB1dFxuXG5cblx0d2hlbiBJUy5zdHJpbmcodHJlZSkgb3IgSVMuZG9tVGV4dCh0cmVlKVxuXHRcdHR5cGU6J3RleHQnLCBvcHRpb25zOnt0ZXh0OiB0cmVlLnRleHRDb250ZW50IG9yIHRyZWV9LCBjaGlsZHJlbjpzY2hlbWEuY2hpbGRyZW5cblxuXHR3aGVuIElTLmRvbUVsKHRyZWUpXG5cdFx0dHlwZTogdHJlZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG5cdFx0cmVmOiB0cmVlLmlkXG5cdFx0b3B0aW9uczogZXh0ZW5kLmNsb25lLmtleXMoYWxsb3dlZFRlbXBsYXRlT3B0aW9ucykodHJlZSlcblx0XHRjaGlsZHJlbjogc2NoZW1hLmNoaWxkcmVuLm1hcC5jYWxsKHRyZWUuY2hpbGROb2RlcywgUXVpY2tEb20udGVtcGxhdGUpXG5cblx0d2hlbiBJUy5xdWlja0RvbUVsKHRyZWUpXG5cdFx0dHlwZTogdHJlZS50eXBlXG5cdFx0cmVmOiB0cmVlLnJlZlxuXHRcdG9wdGlvbnM6IGV4dGVuZC5jbG9uZS5kZWVwLm5vdEtleXMoWydyZWxhdGVkSW5zdGFuY2UnLCAncmVsYXRlZCddKSh0cmVlLm9wdGlvbnMpXG5cdFx0Y2hpbGRyZW46IHRyZWUuY2hpbGRyZW4ubWFwKFF1aWNrRG9tLnRlbXBsYXRlKVxuXG5cdHdoZW4gSVMudGVtcGxhdGUodHJlZSlcblx0XHRyZXR1cm4gdHJlZVxuXG5cdGVsc2Vcblx0XHR0aHJvdyBuZXcgRXJyb3IgXCIje3BhcnNlRXJyb3JQcmVmaXh9IChhcnJheSB8fCBzdHJpbmcgfHwgZG9tRWwgfHwgcXVpY2tEb21FbCB8fCB0ZW1wbGF0ZSksIGdvdCAje1N0cmluZyh0cmVlKX1cIlxuXG5cblxuXG5wYXJzZUVycm9yUHJlZml4ID0gJ1RlbXBsYXRlIFBhcnNlIEVycm9yOiBleHBlY3RlZCciLCJzY2hlbWEgPSBcblx0dHlwZTogJ2Rpdidcblx0cmVmOiB1bmRlZmluZWRcblx0b3B0aW9uczoge31cblx0Y2hpbGRyZW46IFtdXG5cblxubWF0Y2hlc1NjaGVtYSA9IChvYmplY3QpLT5cblx0dHlwZW9mIG9iamVjdC50eXBlIGlzbnQgJ3VuZGVmaW5lZCcgb3Jcblx0dHlwZW9mIG9iamVjdC5yZWYgaXNudCAndW5kZWZpbmVkJyBvclxuXHR0eXBlb2Ygb2JqZWN0Lm9wdGlvbnMgaXNudCAndW5kZWZpbmVkJyBvclxuXHR0eXBlb2Ygb2JqZWN0LmNoaWxkcmVuIGlzbnQgJ3VuZGVmaW5lZCdcblxuXG5cbiIsInNob3J0Y3V0cyA9IFtcblx0J2xpbms6YSdcblx0J2FuY2hvcjphJ1xuXHQnYSdcblx0J3RleHQnXG5cdCdkaXYnXG5cdCdzcGFuJ1xuXHQnaDEnXG5cdCdoMidcblx0J2gzJ1xuXHQnaDQnXG5cdCdoNSdcblx0J2g2J1xuXHQnaGVhZGVyJ1xuXHQnZm9vdGVyJ1xuXHQnc2VjdGlvbidcblx0J2J1dHRvbidcblx0J2JyJ1xuXHQndWwnXG5cdCdvbCdcblx0J2xpJ1xuXHQnZmllbGRzZXQnXG5cdCdpbnB1dCdcblx0J3RleHRhcmVhJ1xuXHQnc2VsZWN0J1xuXHQnb3B0aW9uJ1xuXHQnZm9ybSdcblx0J2ZyYW1lJ1xuXHQnaHInXG5cdCdpZnJhbWUnXG5cdCdpbWcnXG5cdCdwaWN0dXJlJ1xuXHQnbWFpbidcblx0J25hdidcblx0J21ldGEnXG5cdCdvYmplY3QnXG5cdCdwcmUnXG5cdCdzdHlsZSdcblx0J3RhYmxlJ1xuXHQndGJvZHknXG5cdCd0aCdcblx0J3RyJ1xuXHQndGQnXG5cdCd0Zm9vdCdcblx0IyAndGVtcGxhdGUnXG5cdCd2aWRlbydcbl1cblxuXG5mb3Igc2hvcnRjdXQgaW4gc2hvcnRjdXRzIHRoZW4gZG8gKHNob3J0Y3V0KS0+XG5cdHByb3AgPSB0eXBlID0gc2hvcnRjdXRcblx0aWYgaGVscGVycy5pbmNsdWRlcyhzaG9ydGN1dCwgJzonKVxuXHRcdHNwbGl0ID0gc2hvcnRjdXQuc3BsaXQoJzonKVxuXHRcdHByb3AgPSBzcGxpdFswXVxuXHRcdHR5cGUgPSBzcGxpdFsxXVxuXG5cdFF1aWNrRG9tW3Byb3BdID0gKCktPiBRdWlja0RvbSh0eXBlLCBhcmd1bWVudHMuLi4pXG4iLCJ7XG4gIFwiX2Zyb21cIjogXCJxdWlja2RvbUBsYXRlc3RcIixcbiAgXCJfaWRcIjogXCJxdWlja2RvbUAxLjAuODlcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi12SkJ0VndhVXBzaVVza2dVbllhN3FNNzdqeEZGa2MzVXFLNFpZSkdLNnRBOS9aUGFPVHRNekhYbk5CbllDYzB6ZC9wMFpVWmdaWDc3ZlZubFU5TzZHQT09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3F1aWNrZG9tXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJ0YWdcIixcbiAgICBcInJlZ2lzdHJ5XCI6IHRydWUsXG4gICAgXCJyYXdcIjogXCJxdWlja2RvbUBsYXRlc3RcIixcbiAgICBcIm5hbWVcIjogXCJxdWlja2RvbVwiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJxdWlja2RvbVwiLFxuICAgIFwicmF3U3BlY1wiOiBcImxhdGVzdFwiLFxuICAgIFwic2F2ZVNwZWNcIjogbnVsbCxcbiAgICBcImZldGNoU3BlY1wiOiBcImxhdGVzdFwiXG4gIH0sXG4gIFwiX3JlcXVpcmVkQnlcIjogW1xuICAgIFwiI1VTRVJcIixcbiAgICBcIi9cIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3F1aWNrZG9tLy0vcXVpY2tkb20tMS4wLjg5LnRnelwiLFxuICBcIl9zaGFzdW1cIjogXCI5NzY4NjZmYzQ1NjYxZDk2OWRjNDU4OTRhYjU0ZWM0ZjRlODA5Y2ZmXCIsXG4gIFwiX3NwZWNcIjogXCJxdWlja2RvbUBsYXRlc3RcIixcbiAgXCJfd2hlcmVcIjogXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJkYW5pZWxrYWxlblwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9xdWlja2RvbS5kZWJ1Zy5qc1wiLFxuICAgIFwiLi9kaXN0L3F1aWNrZG9tLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tkb20vaXNzdWVzXCJcbiAgfSxcbiAgXCJidW5kbGVEZXBlbmRlbmNpZXNcIjogZmFsc2UsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBkYW5pZWxrYWxlbi9pc1wiOiBcIl4yLjAuMFwiLFxuICAgIFwicXVpY2tjc3NcIjogXCJeMS4zLjRcIixcbiAgICBcInNtYXJ0LWV4dGVuZFwiOiBcIl4xLjcuM1wiXG4gIH0sXG4gIFwiZGVwcmVjYXRlZFwiOiBmYWxzZSxcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkZhc3QgJiBsaWdodCBET00gZWxlbWVudCBtYW5hZ2VtZW50IHN1cHBvcnRpbmcganF1ZXJ5LWxpa2UgbWV0aG9kcywgdGVtcGxhdGVzLCAmIHN0YXRlLWJhc2VkIHN0eWxpbmdcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy41LjBcIixcbiAgICBcImNoYWxrXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJjb2ZmZWUtc2NyaXB0XCI6IFwiXjEuMTIuNlwiLFxuICAgIFwiZXhlY2FcIjogXCJeMC43LjBcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4zXCIsXG4gICAgXCJwcm9taXNlLWJyZWFrXCI6IFwiXjAuMS4yXCIsXG4gICAgXCJzZW12ZXJcIjogXCJeNS4zLjBcIlxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2RvbSNyZWFkbWVcIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwibWFpblwiOiBcImRpc3QvcXVpY2tkb20uanNcIixcbiAgXCJuYW1lXCI6IFwicXVpY2tkb21cIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tkb20uZ2l0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLi8uY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwibnBtIHJ1biB0ZXN0OnRyYXZpc1wiLFxuICAgIFwidGVzdFwiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6YnJvd3NlclwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBFbGVjdHJvbiAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmNocm9tZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgQ2hyb21lIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6ZmlyZWZveFwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBGaXJlZm94IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6a2FybWFcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmxvY2FsXCI6IFwib3BlbiB0ZXN0L3Rlc3RydW5uZXIuaHRtbFwiLFxuICAgIFwidGVzdDptaW5pZmllZFwiOiBcIm1pbmlmaWVkPTEgbnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnRyYXZpc1wiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zICYmIG5wbSBydW4gdGVzdDptaW5pZmllZCAtc1wiLFxuICAgIFwid2F0Y2hcIjogXCJjYWtlIC1kIHdhdGNoXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgW1xuICAgICAgICBcImJhYmVsaWZ5XCIsXG4gICAgICAgIHtcbiAgICAgICAgICBcInByZXNldHNcIjogW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBcIkBiYWJlbC9wcmVzZXQtZW52XCIsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm1vZHVsZXNcIjogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjAuODlcIlxufVxuIiwiSVMgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9pcydcbklTID0gSVMuY3JlYXRlKCduYXRpdmVzJywnZG9tJylcbklTLmxvYWRcblx0ZmllbGQ6ICh0YXJnZXQpLT4gdGFyZ2V0IGFuZCB0YXJnZXQgaW5zdGFuY2VvZiByZXF1aXJlKCcuL2ZpZWxkJylcblx0cmVnZXg6ICh0YXJnZXQpLT4gdGFyZ2V0IGluc3RhbmNlb2YgUmVnRXhwXG5cdG9iamVjdGFibGU6ICh0YXJnZXQpLT4gSVMub2JqZWN0KHRhcmdldCkgb3IgSVMuZnVuY3Rpb24odGFyZ2V0KVxuXG5tb2R1bGUuZXhwb3J0cyA9IElTIiwiZXh0ZW5kID0gcmVxdWlyZSAnLi9leHRlbmQnXG5cbm5vcm1hbGl6ZUtleXMgPSAoa2V5cyktPiBpZiBrZXlzXG5cdG91dHB1dCA9IHt9XG5cdGlmIHR5cGVvZiBrZXlzIGlzbnQgJ29iamVjdCdcblx0XHRvdXRwdXRba2V5c10gPSB0cnVlXG5cdGVsc2Vcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoa2V5cykgaWYgbm90IEFycmF5LmlzQXJyYXkoa2V5cylcblx0XHRvdXRwdXRba2V5XSA9IHRydWUgZm9yIGtleSBpbiBrZXlzXG5cblx0cmV0dXJuIG91dHB1dFxuXG5cbm5ld0J1aWxkZXIgPSAoaXNCYXNlKS0+XG5cdGJ1aWxkZXIgPSAodGFyZ2V0KS0+XG5cdFx0RVhQQU5EX0FSR1VNRU5UUyhzb3VyY2VzKVxuXHRcdGlmIGJ1aWxkZXIub3B0aW9ucy50YXJnZXRcblx0XHRcdHRoZVRhcmdldCA9IGJ1aWxkZXIub3B0aW9ucy50YXJnZXRcblx0XHRlbHNlXG5cdFx0XHR0aGVUYXJnZXQgPSB0YXJnZXRcblx0XHRcdHNvdXJjZXMuc2hpZnQoKVxuXHRcdFxuXHRcdGV4dGVuZChidWlsZGVyLm9wdGlvbnMsIHRoZVRhcmdldCwgc291cmNlcylcblx0XG5cdGJ1aWxkZXIuaXNCYXNlID0gdHJ1ZSBpZiBpc0Jhc2Vcblx0YnVpbGRlci5vcHRpb25zID0ge31cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoYnVpbGRlciwgbW9kaWZpZXJzKVxuXHRyZXR1cm4gYnVpbGRlclxuXG5cbm1vZGlmaWVycyA9IFxuXHQnZGVlcCc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5kZWVwID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J293bic6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5vd24gPSB0cnVlXG5cdFx0cmV0dXJuIF9cblxuXHQnYWxsb3dOdWxsJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLmFsbG93TnVsbCA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdudWxsRGVsZXRlcyc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5udWxsRGVsZXRlcyA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdjb25jYXQnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMuY29uY2F0ID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J2Nsb25lJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLnRhcmdldCA9IHt9XG5cdFx0cmV0dXJuIF9cblxuXHQnbm90RGVlcCc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLm5vdERlZXAgPSBub3JtYWxpemVLZXlzKGtleXMpXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cdCdkZWVwT25seSc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLmRlZXBPbmx5ID0gbm9ybWFsaXplS2V5cyhrZXlzKVx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXHQna2V5cyc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLmtleXMgPSBub3JtYWxpemVLZXlzKGtleXMpXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cdCdub3RLZXlzJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuIChrZXlzKS0+XG5cdFx0XHRfLm9wdGlvbnMubm90S2V5cyA9IG5vcm1hbGl6ZUtleXMoa2V5cylcdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblx0J3RyYW5zZm9ybSc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAodHJhbnNmb3JtKS0+XG5cdFx0XHRpZiB0eXBlb2YgdHJhbnNmb3JtIGlzICdmdW5jdGlvbidcblx0XHRcdFx0Xy5vcHRpb25zLmdsb2JhbFRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuXHRcdFx0ZWxzZSBpZiB0cmFuc2Zvcm0gYW5kIHR5cGVvZiB0cmFuc2Zvcm0gaXMgJ29iamVjdCdcblx0XHRcdFx0Xy5vcHRpb25zLnRyYW5zZm9ybXMgPSB0cmFuc2Zvcm1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXG5cdCdmaWx0ZXInOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKGZpbHRlciktPlxuXHRcdFx0aWYgdHlwZW9mIGZpbHRlciBpcyAnZnVuY3Rpb24nXG5cdFx0XHRcdF8ub3B0aW9ucy5nbG9iYWxGaWx0ZXIgPSBmaWx0ZXJcblx0XHRcdGVsc2UgaWYgZmlsdGVyIGFuZCB0eXBlb2YgZmlsdGVyIGlzICdvYmplY3QnXG5cdFx0XHRcdF8ub3B0aW9ucy5maWx0ZXJzID0gZmlsdGVyXG5cdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBuZXdCdWlsZGVyKHRydWUpXG5leHBvcnRzLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nIiwie1xuICBcIl9hcmdzXCI6IFtcbiAgICBbXG4gICAgICBcInNtYXJ0LWV4dGVuZEAxLjcuM1wiLFxuICAgICAgXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCJcbiAgICBdXG4gIF0sXG4gIFwiX2Zyb21cIjogXCJzbWFydC1leHRlbmRAMS43LjNcIixcbiAgXCJfaWRcIjogXCJzbWFydC1leHRlbmRAMS43LjNcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1QVkVFVllERHp5eEtBMEdORkxjV1k2b0pTa1FLZGMxdzcxOGVRcEVIY051VFNXWXhESzM1R3poc0doTWtVVThsQklnU0VEYnQ1eDVwNDZwUnozQXViQT09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3NtYXJ0LWV4dGVuZFwiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwidmVyc2lvblwiLFxuICAgIFwicmVnaXN0cnlcIjogdHJ1ZSxcbiAgICBcInJhd1wiOiBcInNtYXJ0LWV4dGVuZEAxLjcuM1wiLFxuICAgIFwibmFtZVwiOiBcInNtYXJ0LWV4dGVuZFwiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJzbWFydC1leHRlbmRcIixcbiAgICBcInJhd1NwZWNcIjogXCIxLjcuM1wiLFxuICAgIFwic2F2ZVNwZWNcIjogbnVsbCxcbiAgICBcImZldGNoU3BlY1wiOiBcIjEuNy4zXCJcbiAgfSxcbiAgXCJfcmVxdWlyZWRCeVwiOiBbXG4gICAgXCIvXCIsXG4gICAgXCIvcXVpY2tkb21cIixcbiAgICBcIi9zaW1wbHl3YXRjaFwiXG4gIF0sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvc21hcnQtZXh0ZW5kLy0vc21hcnQtZXh0ZW5kLTEuNy4zLnRnelwiLFxuICBcIl9zcGVjXCI6IFwiMS43LjNcIixcbiAgXCJfd2hlcmVcIjogXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJkYW5pZWxrYWxlblwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9zbWFydC1leHRlbmQuZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9zbWFydC1leHRlbmQuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zbWFydC1leHRlbmQvaXNzdWVzXCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiZmFsYWZlbFwiOiBcIl4yLjEuMFwiXG4gIH0sXG4gIFwiZGVzY3JpcHRpb25cIjogXCJNZXJnZS9leHRlbmQgb2JqZWN0cyAoc2hhbGxvdy9kZWVwKSB3aXRoIGdsb2JhbC9pbmRpdmlkdWFsIGZpbHRlcnMgYW5kIG1vcmUgZmVhdHVyZXNcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmFkZ2UtZ2VuXCI6IFwiXjEuMC4yXCIsXG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjQuN1wiLFxuICAgIFwiY2hhaVwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY29mZmVlLXJlZ2lzdGVyXCI6IFwiXjAuMS4wXCIsXG4gICAgXCJjb2ZmZWVpZnktY2FjaGVkXCI6IFwiXjIuMS4xXCIsXG4gICAgXCJleHRlbmRcIjogXCJeMy4wLjFcIixcbiAgICBcImdvb2dsZS1jbG9zdXJlLWNvbXBpbGVyLWpzXCI6IFwiXjIwMTcwNjI2LjAuMFwiLFxuICAgIFwibW9jaGFcIjogXCJeMy4yLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuMC1zMjFcIixcbiAgICBcInNpbXBseXdhdGNoXCI6IFwiXjMuMC4wLWwyXCIsXG4gICAgXCJ1Z2xpZnktanNcIjogXCJeMy4wLjI0XCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zbWFydC1leHRlbmQjcmVhZG1lXCIsXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwiZXh0ZW5kXCIsXG4gICAgXCJjbG9uZVwiLFxuICAgIFwiZmlsdGVyXCIsXG4gICAgXCJzZWxlY3RpdmVcIixcbiAgICBcIm1lcmdlXCIsXG4gICAgXCJhc3NpZ25cIixcbiAgICBcInByb3BlcnRpZXNcIlxuICBdLFxuICBcImxpY2Vuc2VcIjogXCJJU0NcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9zbWFydC1leHRlbmQuanNcIixcbiAgXCJtb2NoYV9vcHRzXCI6IFwiLXUgdGRkIC0tY29tcGlsZXJzIGNvZmZlZTpjb2ZmZWUtcmVnaXN0ZXIgLS1zbG93IDEwMDAgLS10aW1lb3V0IDUwMDBcIixcbiAgXCJuYW1lXCI6IFwic21hcnQtZXh0ZW5kXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3NtYXJ0LWV4dGVuZC5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJta2RpciAtcCBkaXN0LzsgbnBtIHJ1biBidWlsZDpkZWJ1ZyAmJiBucG0gcnVuIGJ1aWxkOnJlbGVhc2VcIixcbiAgICBcImJ1aWxkOmRlYnVnXCI6IFwic2ltcGx5aW1wb3J0IGJ1bmRsZSBzcmMvaW5kZXguY29mZmVlIC1kIC0tdGFyZ2V0IG5vZGUgLS11bWQgc21hcnQtZXh0ZW5kID4gZGlzdC9zbWFydC1leHRlbmQuZGVidWcuanNcIixcbiAgICBcImJ1aWxkOnJlbGVhc2VcIjogXCJzaW1wbHlpbXBvcnQgYnVuZGxlIHNyYy9pbmRleC5jb2ZmZWUgLS10YXJnZXQgbm9kZSAtLXVtZCBzbWFydC1leHRlbmQgPiBkaXN0L3NtYXJ0LWV4dGVuZC5qc1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJucG0gcnVuIGNvdmVyYWdlOnJ1biAmJiBucG0gcnVuIGNvdmVyYWdlOmJhZGdlXCIsXG4gICAgXCJjb3ZlcmFnZTpiYWRnZVwiOiBcImJhZGdlLWdlbiAtZCAuY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiZm9yQ292ZXJhZ2U9dHJ1ZSBpc3RhbmJ1bCBjb3ZlciAtLWRpciBjb3ZlcmFnZSBub2RlX21vZHVsZXMvbW9jaGEvYmluL19tb2NoYSAtLSAkbnBtX3BhY2thZ2VfbW9jaGFfb3B0c1wiLFxuICAgIFwicG9zdHB1Ymxpc2hcIjogXCJnaXQgcHVzaFwiLFxuICAgIFwicG9zdHZlcnNpb25cIjogXCJucG0gcnVuIGJ1aWxkICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJDST0xIG5wbSBydW4gdGVzdFwiLFxuICAgIFwidGVzdFwiOiBcIm1vY2hhICRucG1fcGFja2FnZV9tb2NoYV9vcHRzXCIsXG4gICAgXCJ3YXRjaFwiOiBcInNpbXBseXdhdGNoIC1nICdzcmMvKicgLXggJ25wbSBydW4gYnVpbGQ6ZGVidWcgLXMnXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiY29mZmVlaWZ5LWNhY2hlZFwiLFxuICAgICAgXCIuLy5jb25maWcvdHJhbnNmb3Jtcy9tYWNyb3NcIlxuICAgIF0sXG4gICAgXCJmaW5hbFRyYW5zZm9ybVwiOiBbXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc3VwZXJcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1yZW5hbWVcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zaW1wbGVcIlxuICAgIF1cbiAgfSxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS43LjNcIlxufVxuIiwiQ1NTID0gaW1wb3J0ICdxdWlja2Nzcydcbm1vZHVsZS5leHBvcnRzID0gKCktPlxuICAgIENTUy5hbmltYXRpb24gJ2NoZWNrbWFya0FuaW1hdGVTdWNjZXNzVGlwJyxcbiAgICAgICAgJzAlLCA1NCUnOiAge3dpZHRoOjAsIGxlZnQ6MCwgdG9wOjN9XG4gICAgICAgICc3MCUnOiAgICAgIHt3aWR0aDoxNCwgbGVmdDotMiwgdG9wOjh9XG4gICAgICAgICc4NCUnOiAgICAgIHt3aWR0aDo1LCBsZWZ0OjUsIHRvcDoxMH1cbiAgICAgICAgJzEwMCUnOiAgICAge3dpZHRoOjgsIGxlZnQ6MywgdG9wOjEwfVxuXG5cbiAgICBDU1MuYW5pbWF0aW9uICdjaGVja21hcmtBbmltYXRlU3VjY2Vzc0xvbmcnLFxuICAgICAgICAnMCUsIDY1JSc6ICB7d2lkdGg6MCwgcmlnaHQ6MTIsIHRvcDoxMn1cbiAgICAgICAgJzg0JSc6ICAgICAge3dpZHRoOjE0LCByaWdodDowLCB0b3A6N31cbiAgICAgICAgJzEwMCUnOiAgICAge3dpZHRoOjEyLCByaWdodDoyLCB0b3A6OH1cblxuXG4gICAgQ1NTLmFuaW1hdGlvbiAnY2hlY2ttYXJrQW5pbWF0ZUVycm9yJyxcbiAgICAgICAgJzAlLCA2NSUnOiAgdHJhbnNmb3JtOiAnc2NhbGUoMC40KScsIG9wYWNpdHk6IDBcbiAgICAgICAgJzg0JSc6ICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4xNSknXG4gICAgICAgICcxMDAlJzogICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJ1xuXG5cbiAgICBDU1MuYW5pbWF0aW9uICdjaGVja21hcmtSb3RhdGVQbGFjZWhvbGRlcicsXG4gICAgICAgICcwJSwgNSUnOiAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuICAgICAgICAnMTIlLCAxMDAlJzp0cmFuc2Zvcm06ICdyb3RhdGUoLTQwNWRlZyknXG5cblxuICAgIENTUy5hbmltYXRpb24gJ2ZpZWxkRXJyb3JTaGFrZScsXG4gICAgICAgICcwJSwgNTAlJzogIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwcHgpJ1xuICAgICAgICAnMjUlLCA3NSUnOiB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDEwcHgpJ1xuICAgICAgICAnMTAwJSc6ICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCknXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9ICgpLT5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBbJ19nZXRWYWx1ZScsICdfc2V0VmFsdWUnLCAnX3ZhbGlkYXRlJ10iLCJoZWxwZXJzID0gaW1wb3J0ICcuLi9oZWxwZXJzJ1xuSVMgPSBpbXBvcnQgJy4uL2NoZWNrcydcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuZmFzdGRvbSA9IGltcG9ydCAnZmFzdGRvbSdcblNpbXBseUJpbmQgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kJ1xuQ29uZGl0aW9uID0gaW1wb3J0ICcuLi9jb21wb25lbnRzL2NvbmRpdGlvbidcbmN1cnJlbnRJRCA9IDBcblxuY2xhc3MgRmllbGRcblx0QGluc3RhbmNlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0QHNoYWxsb3dTZXR0aW5ncyA9IFsndGVtcGxhdGVzJywgJ2ZpZWxkSW5zdGFuY2VzJywgJ3ZhbHVlJywgJ2RlZmF1bHRWYWx1ZSddXG5cdEB0cmFuc2Zvcm1TZXR0aW5ncyA9IGltcG9ydCAnLi90cmFuc2Zvcm1TZXR0aW5ncydcblx0Y29yZVZhbHVlUHJvcDogJ192YWx1ZSdcblx0Z2xvYmFsRGVmYXVsdHM6IGltcG9ydCAnLi9nbG9iYWxEZWZhdWx0cydcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyBGaWVsZDo6LFxuXHRcdCdyZW1vdmVMaXN0ZW5lcic6IGdldDogKCktPiBAb2ZmXG5cdFx0J2Vscyc6IGdldDogKCktPiBAZWwuY2hpbGRcblx0XHQndmFsdWVSYXcnOiBnZXQ6ICgpLT4gQF92YWx1ZVxuXHRcdCd2YWx1ZSc6XG5cdFx0XHRnZXQ6ICgpLT4gaWYgQHNldHRpbmdzLmdldHRlciB0aGVuIEBzZXR0aW5ncy5nZXR0ZXIoQF9nZXRWYWx1ZSgpKSBlbHNlIEBfZ2V0VmFsdWUoKVxuXHRcdFx0c2V0OiAodmFsdWUpLT4gQF9zZXRWYWx1ZShpZiBAc2V0dGluZ3Muc2V0dGVyIHRoZW4gQHNldHRpbmdzLnNldHRlcih2YWx1ZSkgZWxzZSB2YWx1ZSlcblx0XG5cdGNvbnN0cnVjdG9yOiAoc2V0dGluZ3MsIEBidWlsZGVyLCBzZXR0aW5nT3ZlcnJpZGVzLCB0ZW1wbGF0ZU92ZXJyaWRlcyktPlxuXHRcdGlmIHNldHRpbmdPdmVycmlkZXNcblx0XHRcdEBnbG9iYWxEZWZhdWx0cyA9IHNldHRpbmdPdmVycmlkZXMuZ2xvYmFsRGVmYXVsdHMgaWYgc2V0dGluZ092ZXJyaWRlcy5nbG9iYWxEZWZhdWx0c1xuXHRcdFx0QGRlZmF1bHRzID0gc2V0dGluZ092ZXJyaWRlc1tzZXR0aW5ncy50eXBlXSBpZiBzZXR0aW5nT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdXG5cdFx0aWYgdGVtcGxhdGVPdmVycmlkZXMgYW5kIHRlbXBsYXRlT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdXG5cdFx0XHRAdGVtcGxhdGVzID0gdGVtcGxhdGVPdmVycmlkZXNbc2V0dGluZ3MudHlwZV1cblx0XHRcdEB0ZW1wbGF0ZSA9IHRlbXBsYXRlT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdLmRlZmF1bHRcblxuXHRcdHNoYWxsb3dTZXR0aW5ncyA9IGlmIEBzaGFsbG93U2V0dGluZ3MgdGhlbiBGaWVsZC5zaGFsbG93U2V0dGluZ3MuY29uY2F0KEBzaGFsbG93U2V0dGluZ3MpIGVsc2UgRmllbGQuc2hhbGxvd1NldHRpbmdzXG5cdFx0dHJhbnNmb3JtU2V0dGluZ3MgPSBpZiBAdHJhbnNmb3JtU2V0dGluZ3MgdGhlbiBGaWVsZC50cmFuc2Zvcm1TZXR0aW5ncy5jb25jYXQoQHRyYW5zZm9ybVNldHRpbmdzKSBlbHNlIEZpZWxkLnRyYW5zZm9ybVNldHRpbmdzXG5cblx0XHRAc2V0dGluZ3MgPSBleHRlbmQuZGVlcC5jbG9uZS5ub3REZWVwKHNoYWxsb3dTZXR0aW5ncykudHJhbnNmb3JtKHRyYW5zZm9ybVNldHRpbmdzKShAZ2xvYmFsRGVmYXVsdHMsIEBkZWZhdWx0cywgc2V0dGluZ3MpXG5cdFx0QElEID0gQHNldHRpbmdzLklEIG9yIGN1cnJlbnRJRCsrKycnXG5cdFx0QHR5cGUgPSBzZXR0aW5ncy50eXBlXG5cdFx0QG5hbWUgPSBzZXR0aW5ncy5uYW1lXG5cdFx0QGFsbEZpZWxkcyA9IEBzZXR0aW5ncy5maWVsZEluc3RhbmNlcyBvciBGaWVsZC5pbnN0YW5jZXNcblx0XHRAX3ZhbHVlID0gbnVsbFxuXHRcdEBfZXZlbnRDYWxsYmFja3MgPSB7fVxuXHRcdEBzdGF0ZSA9XG5cdFx0XHR2YWxpZDogdHJ1ZVxuXHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0Zm9jdXNlZDogZmFsc2Vcblx0XHRcdGhvdmVyZWQ6IGZhbHNlXG5cdFx0XHRmaWxsZWQ6IGZhbHNlXG5cdFx0XHRpbnRlcmFjdGVkOiBmYWxzZVxuXHRcdFx0aXNNb2JpbGU6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogQHNldHRpbmdzLmRpc2FibGVkXG5cdFx0XHRtYXJnaW46IEBzZXR0aW5ncy5tYXJnaW5cblx0XHRcdHBhZGRpbmc6IEBzZXR0aW5ncy5wYWRkaW5nXG5cdFx0XHR3aWR0aDogQHNldHRpbmdzLndpZHRoXG5cdFx0XHRzaG93TGFiZWw6IEBzZXR0aW5ncy5sYWJlbFxuXHRcdFx0bGFiZWw6IEBzZXR0aW5ncy5sYWJlbFxuXHRcdFx0c2hvd0hlbHA6IEBzZXR0aW5ncy5oZWxwXG5cdFx0XHRoZWxwOiBAc2V0dGluZ3MuaGVscFxuXHRcdFx0c2hvd0Vycm9yOiBmYWxzZVxuXHRcdFx0ZXJyb3I6IEBzZXR0aW5ncy5lcnJvclxuXG5cdFx0aWYgSVMuZGVmaW5lZChAc2V0dGluZ3MucGxhY2Vob2xkZXIpXG5cdFx0XHRAc3RhdGUucGxhY2Vob2xkZXIgPSBAc2V0dGluZ3MucGxhY2Vob2xkZXJcblxuXHRcdGlmIElTLm51bWJlcihAc2V0dGluZ3Mud2lkdGgpIGFuZCBAc2V0dGluZ3Mud2lkdGggPD0gMVxuXHRcdFx0QHN0YXRlLndpZHRoID0gXCIje0BzZXR0aW5ncy53aWR0aCoxMDB9JVwiXG5cblx0XHRpZiBAc2V0dGluZ3MuY29uZGl0aW9ucz8ubGVuZ3RoXG5cdFx0XHRAc3RhdGUudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRDb25kaXRpb24uaW5pdChALCBAc2V0dGluZ3MuY29uZGl0aW9ucylcblxuXHRcdGNvbnNvbGU/Lndhcm4oXCJEdXBsaWNhdGUgZmllbGQgSURzIGZvdW5kOiAnI3tASUR9J1wiKSBpZiBAYWxsRmllbGRzW0BJRF1cblx0XHRAYWxsRmllbGRzW0BJRF0gPSBAXG5cblxuXHRfY29uc3RydWN0b3JFbmQ6ICgpLT5cblx0XHRAZWwuY2hpbGRmIy5maWVsZC5vbiAnaW5zZXJ0ZWQnLCAoKT0+IEBlbWl0KCdpbnNlcnRlZCcpXG5cdFx0QGVsLnJhdy5pZCA9IEBJRCBpZiBAc2V0dGluZ3MuSURcblxuXHRcdEBzZXR0aW5ncy5kZWZhdWx0VmFsdWUgPz0gQHNldHRpbmdzLnZhbHVlIGlmIEBzZXR0aW5ncy52YWx1ZT9cblx0XHRpZiBAc2V0dGluZ3MuZGVmYXVsdFZhbHVlP1xuXHRcdFx0QHZhbHVlID0gaWYgQHNldHRpbmdzLm11bHRpcGxlIHRoZW4gW10uY29uY2F0KEBzZXR0aW5ncy5kZWZhdWx0VmFsdWUpIGVsc2UgQHNldHRpbmdzLmRlZmF1bHRWYWx1ZVxuXG5cdFx0U2ltcGx5QmluZCgnc2hvd0Vycm9yJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ2hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudHJhbnNmb3JtIChzaG93KT0+XG5cdFx0XHRcdGlmIHNob3cgYW5kIEBzdGF0ZS5lcnJvciBhbmQgSVMuc3RyaW5nKEBzdGF0ZS5lcnJvcilcblx0XHRcdFx0XHRAc3RhdGUuZXJyb3Jcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBzZXR0aW5ncy5oZWxwIG9yIEBzdGF0ZS5oZWxwXG5cblx0XHRTaW1wbHlCaW5kKCdlcnJvcicsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCdoZWxwJykub2YoQHN0YXRlKVxuXHRcdFx0LmNvbmRpdGlvbiAoZXJyb3IpPT4gZXJyb3IgYW5kIEBzdGF0ZS5zaG93RXJyb3JcblxuXHRcdFNpbXBseUJpbmQoJ2hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ2h0bWwnKS5vZihAZWwuY2hpbGQuaGVscClcblx0XHRcdC5hbmQudG8oJ3Nob3dIZWxwJykub2YoQHN0YXRlKVxuXG5cdFx0U2ltcGx5QmluZCgnbGFiZWwnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ3RleHQnKS5vZihAZWwuY2hpbGQubGFiZWwpXG5cdFx0XHQuYW5kLnRvKCdzaG93TGFiZWwnKS5vZihAc3RhdGUpXG5cblx0XHRTaW1wbHlCaW5kKCdtYXJnaW4nKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gQGVsLnN0eWxlLmJpbmQoQGVsLCAnbWFyZ2luJylcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdwYWRkaW5nJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvIEBlbC5zdHlsZS5iaW5kKEBlbCwgJ3BhZGRpbmcnKVxuXG5cdFx0U2ltcGx5QmluZCgnc2hvd0hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gKHNob3csIHByZXZTaG93KT0+IGlmIEBzZXR0aW5ncy5tYWtlUm9vbUZvckhlbHBcblx0XHRcdFx0Y2hhbmdlQW1vdW50ID0gaWYgISFzaG93IGlzICEhcHJldlNob3cgdGhlbiAwIGVsc2UgaWYgc2hvdyB0aGVuIDI1IGVsc2UgaWYgcHJldlNob3cgdGhlbiAtMjVcblx0XHRcdFx0QHN0YXRlLm1hcmdpbiA9IGhlbHBlcnMudXBkYXRlU2hvcnRoYW5kVmFsdWUoQHN0YXRlLm1hcmdpbiwgJ2JvdHRvbScsIGNoYW5nZUFtb3VudCkgaWYgY2hhbmdlQW1vdW50XG5cblx0XHRTaW1wbHlCaW5kKCdmb2N1c2VkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAc3RhdGUpLnRvIChmb2N1c2VkKT0+XG5cdFx0XHRAZW1pdChpZiBmb2N1c2VkIHRoZW4gJ2ZvY3VzJyBlbHNlICdibHVyJylcblxuXHRcdGlmIEBzZXR0aW5ncy5tb2JpbGVXaWR0aFxuXHRcdFx0U2ltcGx5QmluZCAoKT0+XG5cdFx0XHRcdGZhc3Rkb20ubWVhc3VyZSAoKT0+IEBzdGF0ZS5pc01vYmlsZSA9IHdpbmRvdy5pbm5lcldpZHRoIDw9IEBzZXR0aW5ncy5tb2JpbGVUaHJlc2hvbGRcblx0XHRcdC51cGRhdGVPbignZXZlbnQ6cmVzaXplJykub2Yod2luZG93KVxuXG5cdFx0aWYgSVMub2JqZWN0KEBzZXR0aW5ncy5ldmVudHMpXG5cdFx0XHRAb24odGFyZ2V0LGhhbmRsZXIpIGZvciB0YXJnZXQsaGFuZGxlciBvZiBAc2V0dGluZ3MuZXZlbnRzXG5cblx0XHRAZW1pdCAnY3JlYXRlZCcsIEBcblx0XHRyZXR1cm4gQGVsLnJhdy5fcXVpY2tGaWVsZCA9IEBcblxuXG5cdF9mb3JtYXRXaWR0aDogKHdpZHRoKS0+XG5cdFx0d2lkdGggPSBpZiBAc3RhdGUuaXNNb2JpbGUgdGhlbiAoQHNldHRpbmdzLm1vYmlsZVdpZHRoIG9yIHdpZHRoKSBlbHNlIHdpZHRoXG5cdFx0aWYgQHNldHRpbmdzLmRpc3RhbmNlIGFuZCB3aWR0aCBpc250ICcxMDAlJ1xuXHRcdFx0d2lkdGggPSBcImNhbGMoI3t3aWR0aH0gLSAje0BzZXR0aW5ncy5kaXN0YW5jZX1weClcIlxuXHRcdHJldHVybiB3aWR0aFxuXG5cblxuXG5cblxuXG5cblx0YXBwZW5kVG86ICh0YXJnZXQpLT5cblx0XHRAZWwuYXBwZW5kVG8odGFyZ2V0KTsgXHRcdHJldHVybiBAXG5cblx0cHJlcGVuZFRvOiAodGFyZ2V0KS0+XG5cdFx0QGVsLnByZXBlbmRUbyh0YXJnZXQpOyBcdFx0cmV0dXJuIEBcblxuXHRpbnNlcnRBZnRlcjogKHRhcmdldCktPlxuXHRcdEBlbC5pbnNlcnRBZnRlcih0YXJnZXQpOyBcdHJldHVybiBAXG5cblx0aW5zZXJ0QmVmb3JlOiAodGFyZ2V0KS0+XG5cdFx0QGVsLmluc2VydEJlZm9yZSh0YXJnZXQpOyBcdHJldHVybiBAXG5cblx0ZGV0YWNoOiAodGFyZ2V0KS0+XG5cdFx0QGVsLmRldGFjaCh0YXJnZXQpOyBcdFx0cmV0dXJuIEBcblxuXHRyZW1vdmU6ICgpLT5cblx0XHRAZWwucmVtb3ZlKClcblx0XHRyZXR1cm4gQGRlc3Ryb3koZmFsc2UpXG5cblx0ZGVzdHJveTogKHJlbW92ZUZyb21ET009dHJ1ZSktPlxuXHRcdFNpbXBseUJpbmQudW5CaW5kQWxsKEApXG5cdFx0U2ltcGx5QmluZC51bkJpbmRBbGwoQHN0YXRlKVxuXHRcdFNpbXBseUJpbmQudW5CaW5kQWxsKEBlbClcblx0XHRTaW1wbHlCaW5kLnVuQmluZEFsbChjaGlsZCkgZm9yIGNoaWxkIGluIEBlbC5jaGlsZFxuXHRcdEBlbC5yZW1vdmUoKSBpZiByZW1vdmVGcm9tRE9NXG5cdFx0QF9kZXN0cm95KCkgaWYgQF9kZXN0cm95XG5cdFx0ZGVsZXRlIEBhbGxGaWVsZHNbQElEXVxuXHRcdHJldHVybiB0cnVlXG5cblx0b246IChldmVudE5hbWVzLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSktPlxuXHRcdEBlbC5vbi5jYWxsKEBlbCwgZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUsIHRydWUpXG5cdFx0cmV0dXJuIEBcblxuXHRvbmNlOiAoZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUpLT5cblx0XHRAb24gZXZlbnROYW1lcywgKCk9PlxuXHRcdFx0QG9mZihldmVudE5hbWVzLCBjYWxsYmFjaylcblx0XHRcdGNhbGxiYWNrLmFwcGx5KEBlbCwgYXJndW1lbnRzKVxuXHRcdCwgdXNlQ2FwdHVyZVxuXG5cdG9mZjogKCktPlxuXHRcdEBlbC5vZmYuYXBwbHkoQGVsLCBhcmd1bWVudHMpXG5cdFx0cmV0dXJuIEBcblxuXHRlbWl0OiAoKS0+XG5cdFx0QGVsLmVtaXRQcml2YXRlLmFwcGx5KEBlbCwgYXJndW1lbnRzKVxuXHRcdHJldHVybiBAXG5cblx0dmFsaWRhdGU6IChwcm92aWRlZFZhbHVlPUBbQGNvcmVWYWx1ZVByb3BdLCB0ZXN0VW5yZXF1aXJlZCwgcmVwb3J0KS0+XG5cdFx0aXNWYWxpZCA9IHN3aXRjaFxuXHRcdFx0d2hlbiBAc2V0dGluZ3MudmFsaWRhdG9yIHRoZW4gQHNldHRpbmdzLnZhbGlkYXRvcihwcm92aWRlZFZhbHVlKVxuXHRcdFx0XG5cdFx0XHR3aGVuIG5vdCBAc2V0dGluZ3MucmVxdWlyZWQgYW5kIG5vdCB0ZXN0VW5yZXF1aXJlZCB0aGVuIHRydWVcblxuXHRcdFx0d2hlbiBAX3ZhbGlkYXRlKHByb3ZpZGVkVmFsdWUsIHRlc3RVbnJlcXVpcmVkLCByZXBvcnQpIGlzIGZhbHNlIHRoZW4gZmFsc2VcblxuXHRcdFx0d2hlbiBAc2V0dGluZ3MucmVxdWlyZWQgdGhlbiBzd2l0Y2hcblx0XHRcdFx0d2hlbiBAc2V0dGluZ3MubXVsdGlwbGUgdGhlbiAhIXByb3ZpZGVkVmFsdWU/Lmxlbmd0aFxuXHRcdFx0XHR3aGVuIHR5cGVvZiBwcm92aWRlZFZhbHVlIGlzICdzdHJpbmcnIHRoZW4gISFwcm92aWRlZFZhbHVlXG5cdFx0XHRcdGVsc2UgcHJvdmlkZWRWYWx1ZT9cblx0XHRcdFxuXHRcdFx0ZWxzZSB0cnVlXG5cblx0XHRAc3RhdGUuc2hvd0Vycm9yID0gZmFsc2UgaWYgaXNWYWxpZCBhbmQgQHNldHRpbmdzLmNsZWFyRXJyb3JPblZhbGlkXG5cdFx0cmV0dXJuIGlzVmFsaWRcblxuXHR2YWxpZGF0ZUNvbmRpdGlvbnM6IChjb25kaXRpb25zKS0+XG5cdFx0aWYgY29uZGl0aW9uc1xuXHRcdFx0dG9nZ2xlVmlzaWJpbGl0eSA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0Y29uZGl0aW9ucyA9IEBjb25kaXRpb25zXG5cdFx0XHR0b2dnbGVWaXNpYmlsaXR5ID0gdHJ1ZVxuXHRcdFxuXHRcdHBhc3NlZENvbmRpdGlvbnMgPSBDb25kaXRpb24udmFsaWRhdGUoY29uZGl0aW9ucylcblx0XHRpZiB0b2dnbGVWaXNpYmlsaXR5XG5cdFx0XHRyZXR1cm4gQHN0YXRlLnZpc2libGUgPSBwYXNzZWRDb25kaXRpb25zXG5cdFx0ZWxzZSBcblx0XHRcdHJldHVybiBwYXNzZWRDb25kaXRpb25zXG5cblx0dmFsaWRhdGVBbmRSZXBvcnQ6IChwcm92aWRlZFZhbHVlLCB0ZXN0VW5yZXF1aXJlZCktPlxuXHRcdGlzVmFsaWQgPSBAdmFsaWRhdGUocHJvdmlkZWRWYWx1ZSwgdGVzdFVucmVxdWlyZWQsIHRydWUpXG5cdFx0QHN0YXRlLnNob3dFcnJvciA9ICFpc1ZhbGlkXG5cdFx0cmV0dXJuIGlzVmFsaWRcblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRmllbGQiLCInY29uZGl0aW9ucyc6IChjb25kaXRpb25zKS0+XG5cdGlmIElTLm9iamVjdFBsYWluKGNvbmRpdGlvbnMpXG5cdFx0e3RhcmdldCwgdmFsdWV9IGZvciB0YXJnZXQsdmFsdWUgb2YgY29uZGl0aW9uc1xuXHRlbHNlIGlmIElTLmFycmF5KGNvbmRpdGlvbnMpXG5cdFx0Y29uZGl0aW9ucy5tYXAgKGl0ZW0pLT4gaWYgSVMuc3RyaW5nKGl0ZW0pIHRoZW4ge3RhcmdldDppdGVtfSBlbHNlIGl0ZW1cblxuJ2Nob2ljZXMnOiAoY2hvaWNlcyktPlxuXHRpZiBJUy5vYmplY3RQbGFpbihjaG9pY2VzKVxuXHRcdHtsYWJlbCx2YWx1ZX0gZm9yIGxhYmVsLHZhbHVlIG9mIGNob2ljZXNcblx0ZWxzZSBpZiBJUy5hcnJheShjaG9pY2VzKVxuXHRcdGNob2ljZXMubWFwIChpdGVtKS0+IGlmIG5vdCBJUy5vYmplY3RQbGFpbihpdGVtKSB0aGVuIHtsYWJlbDppdGVtLCB2YWx1ZTppdGVtfSBlbHNlIGl0ZW1cblxuJ3ZhbGlkV2hlblJlZ2V4JzogKHJlZ2V4KS0+XG5cdGlmIElTLnN0cmluZyhyZWdleCkgdGhlbiBuZXcgUmVnRXhwKHJlZ2V4KSBlbHNlIHJlZ2V4IiwiRHJvcGRvd24gPSBpbXBvcnQgJy4uLy4uL2NvbXBvbmVudHMvZHJvcGRvd24nXG5NYXNrID0gaW1wb3J0ICcuLi8uLi9jb21wb25lbnRzL21hc2snXG5SRUdFWCA9IGltcG9ydCAnLi4vLi4vY29uc3RhbnRzL3JlZ2V4J1xuS0VZQ09ERVMgPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9rZXlDb2RlcydcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5JUyA9IGltcG9ydCAnLi4vLi4vY2hlY2tzJ1xuRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5pbXBvcnQgdGVtcGxhdGUsKiBhcyB0ZW1wbGF0ZXMgZnJvbSAnLi90ZW1wbGF0ZSdcbmltcG9ydCAqIGFzIGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMnXG5cbmNsYXNzIFRleHRGaWVsZCBleHRlbmRzIGltcG9ydCAnLi4vJ1xuXHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0dGVtcGxhdGVzOiB0ZW1wbGF0ZXNcblx0ZGVmYXVsdHM6IGRlZmF1bHRzXG5cblx0Y29uc3RydWN0b3I6ICgpLT5cblx0XHRzdXBlcihhcmd1bWVudHMuLi4pXG5cdFx0QF92YWx1ZSA/PSAnJ1xuXHRcdEBzdGF0ZS50eXBpbmcgPSBmYWxzZVxuXHRcdEBjdXJzb3IgPSBwcmV2OjAsIGN1cnJlbnQ6MFxuXG5cdFx0aWYgbm90IEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleFxuXHRcdFx0aWYgQHNldHRpbmdzLmtleWJvYXJkIGlzICdlbWFpbCcgYW5kIEBzZXR0aW5ncy5yZXF1aXJlZFxuXHRcdFx0XHRAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXggPSBSRUdFWC5lbWFpbFxuXHRcdFx0ZWxzZSBpZiBAc2V0dGluZ3MubWFzayBpcyAnTkFNRScgb3IgQHNldHRpbmdzLm1hc2sucGF0dGVybiBpcyAnTkFNRSdcblx0XHRcdFx0QHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4ID0gL15bYS16QS1aXXsyfS9cblx0XHRcdGVsc2UgaWYgQHNldHRpbmdzLm1hc2sgaXMgJ0ZVTExOQU1FJyBvciBAc2V0dGluZ3MubWFzay5wYXR0ZXJuIGlzICdGVUxMTkFNRSdcblx0XHRcdFx0QHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4ID0gL15bYS16QS1aXStcXHMrW2EtekEtWl0rL1xuXG5cdFx0aWYgbm90IEBzZXR0aW5ncy5tYXNrLnBhdHRlcm5cblx0XHRcdGlmIElTLnN0cmluZyhAc2V0dGluZ3MubWFzaylcblx0XHRcdFx0QHNldHRpbmdzLm1hc2sgPSBleHRlbmQuZGVlcC5jbG9uZShAZGVmYXVsdHMubWFzaywgcGF0dGVybjpAc2V0dGluZ3MubWFzaylcblxuXHRcdFx0ZWxzZSBpZiBJUy5vYmplY3QoQHNldHRpbmdzLm1hc2spXG5cdFx0XHRcdEBzZXR0aW5ncy5tYXNrLnBhdHRlcm4gPSBzd2l0Y2ggQHNldHRpbmdzLmtleWJvYXJkXG5cdFx0XHRcdFx0d2hlbiAnZGF0ZScgdGhlbiAnREFURSdcblx0XHRcdFx0XHR3aGVuICdudW1iZXInIHRoZW4gJ05VTUJFUidcblx0XHRcdFx0XHR3aGVuICdwaG9uZScsJ3RlbCcgdGhlbiAnUEhPTkUnXG5cdFx0XHRcdFx0d2hlbiAnZW1haWwnIHRoZW4gJ0VNQUlMJ1xuXHRcdFx0XG5cdFx0QG1hc2sgPSBuZXcgTWFzayhALCBAc2V0dGluZ3MubWFzaykgaWYgQHNldHRpbmdzLm1hc2sucGF0dGVyblxuXHRcdEBfY3JlYXRlRWxlbWVudHMoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3MoKVxuXHRcdEBfY29uc3RydWN0b3JFbmQoKVxuXG5cblx0X2dldFZhbHVlOiAoKS0+XG5cdFx0aWYgQGRyb3Bkb3duIGFuZCBAc2VsZWN0ZWQgYW5kIEBfdmFsdWUgaXMgQHNlbGVjdGVkLmxhYmVsXG5cdFx0XHRyZXR1cm4gQHNlbGVjdGVkLnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIEBfdmFsdWVcblxuXHRfc2V0VmFsdWU6IChuZXdWYWx1ZSktPiBpZiBJUy5zdHJpbmcobmV3VmFsdWUpIG9yIElTLm51bWJlcihuZXdWYWx1ZSlcblx0XHRuZXdWYWx1ZSA9IFN0cmluZyhuZXdWYWx1ZSlcblx0XHRAX3ZhbHVlID0gaWYgQG1hc2sgdGhlbiBAbWFzay5zZXRWYWx1ZShuZXdWYWx1ZSkgZWxzZSBuZXdWYWx1ZVxuXG5cdF9yZWNhbGNEaXNwbGF5OiAoKS0+XG5cdFx0QF92YWx1ZSA9IEBfdmFsdWUgaWYgQHNldHRpbmdzLmF1dG9XaWR0aFxuXG5cblx0X2NyZWF0ZUVsZW1lbnRzOiAoKS0+XG5cdFx0Z2xvYmFsT3B0cyA9IHtyZWxhdGVkSW5zdGFuY2U6QH1cblx0XHRAZWwgPSBAdGVtcGxhdGUuc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5kZWZhdWx0LCBnbG9iYWxPcHRzKVxuXG5cdFx0aWYgQHNldHRpbmdzLmNob2ljZXNcblx0XHRcdEBkcm9wZG93biA9IG5ldyBEcm9wZG93bihAc2V0dGluZ3MuY2hvaWNlcywgQClcblx0XHRcdEBkcm9wZG93bi5hcHBlbmRUbyhAZWwuY2hpbGQuaW5uZXJ3cmFwKVxuXG5cdFx0aWYgQHNldHRpbmdzLmljb25cblx0XHRcdEB0ZW1wbGF0ZXMuaWNvbi5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmljb24sIGdsb2JhbE9wdHMpLmFwcGVuZChAc2V0dGluZ3MuaWNvbikuaW5zZXJ0QmVmb3JlKEBlbC5jaGlsZC5pbnB1dClcblxuXHRcdGlmIEBzZXR0aW5ncy5jaGVja21hcmtcblx0XHRcdEB0ZW1wbGF0ZXMuY2hlY2ttYXJrLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuY2hlY2ttYXJrLCBnbG9iYWxPcHRzKS5pbnNlcnRBZnRlcihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XG5cdFx0QGVsLmNoaWxkLmlucHV0LnByb3AgJ3R5cGUnLCBzd2l0Y2ggQHNldHRpbmdzLmtleWJvYXJkXG5cdFx0XHR3aGVuICdudW1iZXInLCd0ZWwnLCdwaG9uZScgdGhlbiAndGVsJ1xuXHRcdFx0d2hlbiAncGFzc3dvcmQnIHRoZW4gJ3Bhc3N3b3JkJ1xuXHRcdFx0d2hlbiAndXJsJyB0aGVuICd1cmwnXG5cdFx0XHQjIHdoZW4gJ2VtYWlsJyB0aGVuICdlbWFpbCdcblx0XHRcdGVsc2UgJ3RleHQnXG5cblx0XHRAZWwuc3RhdGUgJ2hhc0xhYmVsJywgQHNldHRpbmdzLmxhYmVsXG5cdFx0QGVsLmNoaWxkLmlubmVyd3JhcC5yYXcuX3F1aWNrRmllbGQgPSBAZWwuY2hpbGQuaW5wdXQucmF3Ll9xdWlja0ZpZWxkID0gQFxuXHRcdHJldHVybiBAZWwuY2hpbGRmXG5cblxuXHRfYXR0YWNoQmluZGluZ3M6ICgpLT5cblx0XHRAX2F0dGFjaEJpbmRpbmdzX2VsU3RhdGUoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3NfZGlzcGxheSgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5X2F1dG9XaWR0aCgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc192YWx1ZSgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc19hdXRvY29tcGxldGUoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3Nfc3RhdGVUcmlnZ2VycygpXG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfZWxTdGF0ZTogKCktPlxuXHRcdFNpbXBseUJpbmQoJ3Zpc2libGUnKS5vZihAc3RhdGUpLnRvIFx0KHZpc2libGUpPT4gQGVsLnN0YXRlICd2aXNpYmxlJywgdmlzaWJsZVxuXHRcdFNpbXBseUJpbmQoJ2hvdmVyZWQnKS5vZihAc3RhdGUpLnRvIFx0KGhvdmVyZWQpPT4gQGVsLnN0YXRlICdob3ZlcicsIGhvdmVyZWRcblx0XHRTaW1wbHlCaW5kKCdmb2N1c2VkJykub2YoQHN0YXRlKS50byBcdChmb2N1c2VkKT0+IEBlbC5zdGF0ZSAnZm9jdXMnLCBmb2N1c2VkXG5cdFx0U2ltcGx5QmluZCgnZmlsbGVkJykub2YoQHN0YXRlKS50byBcdFx0KGZpbGxlZCk9PiBAZWwuc3RhdGUgJ2ZpbGxlZCcsIGZpbGxlZFxuXHRcdFNpbXBseUJpbmQoJ2Rpc2FibGVkJykub2YoQHN0YXRlKS50byBcdChkaXNhYmxlZCk9PiBAZWwuc3RhdGUgJ2Rpc2FibGVkJywgZGlzYWJsZWRcblx0XHRTaW1wbHlCaW5kKCdzaG93TGFiZWwnKS5vZihAc3RhdGUpLnRvIFx0KHNob3dMYWJlbCk9PiBAZWwuc3RhdGUgJ3Nob3dMYWJlbCcsIHNob3dMYWJlbFxuXHRcdFNpbXBseUJpbmQoJ3Nob3dFcnJvcicpLm9mKEBzdGF0ZSkudG8gXHQoc2hvd0Vycm9yKT0+IEBlbC5zdGF0ZSAnc2hvd0Vycm9yJywgc2hvd0Vycm9yXG5cdFx0U2ltcGx5QmluZCgnc2hvd0hlbHAnKS5vZihAc3RhdGUpLnRvIFx0KHNob3dIZWxwKT0+IEBlbC5zdGF0ZSAnc2hvd0hlbHAnLCBzaG93SGVscFxuXHRcdFNpbXBseUJpbmQoJ3ZhbGlkJykub2YoQHN0YXRlKS50byAodmFsaWQpPT5cblx0XHRcdEBlbC5zdGF0ZSAndmFsaWQnLCB2YWxpZFxuXHRcdFx0QGVsLnN0YXRlICdpbnZhbGlkJywgIXZhbGlkXG5cdFx0XG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfZGlzcGxheTogKCktPlxuXHRcdFNpbXBseUJpbmQoJ3BsYWNlaG9sZGVyJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCd0ZXh0Jykub2YoQGVsLmNoaWxkLnBsYWNlaG9sZGVyKVxuXHRcdFx0XHQudHJhbnNmb3JtIChwbGFjZWhvbGRlcik9PiBzd2l0Y2hcblx0XHRcdFx0XHR3aGVuIHBsYWNlaG9sZGVyIGlzIHRydWUgYW5kIEBzZXR0aW5ncy5sYWJlbCB0aGVuIEBzZXR0aW5ncy5sYWJlbFxuXHRcdFx0XHRcdHdoZW4gSVMuc3RyaW5nKHBsYWNlaG9sZGVyKSB0aGVuIHBsYWNlaG9sZGVyXG5cdFx0XHRcdFx0ZWxzZSAnJ1xuXG5cdFx0U2ltcGx5QmluZCgnZGlzYWJsZWQnLCB1cGRhdGVPbkJpbmQ6QHN0YXRlLmRpc2FibGVkKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gKGRpc2FibGVkLCBwcmV2KT0+IGlmIEBzZXR0aW5ncy5jaGVja21hcmtcblx0XHRcdFx0aWYgZGlzYWJsZWQgb3IgKG5vdCBkaXNhYmxlZCBhbmQgcHJldj8pIHRoZW4gc2V0VGltZW91dCAoKT0+XG5cdFx0XHRcdFx0QGVsLmNoaWxkLmNoZWNrbWFya19tYXNrMS5yZWNhbGNTdHlsZSgpXG5cdFx0XHRcdFx0QGVsLmNoaWxkLmNoZWNrbWFya19tYXNrMi5yZWNhbGNTdHlsZSgpXG5cdFx0XHRcdFx0QGVsLmNoaWxkLmNoZWNrbWFya19wYXRjaC5yZWNhbGNTdHlsZSgpXG5cdFx0XHRcdFx0IyBAZWwuY2hpbGQuY2hlY2ttYXJrLnJlY2FsY1N0eWxlKHRydWUpXG5cdFx0XG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfZGlzcGxheV9hdXRvV2lkdGg6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCd3aWR0aCcsIHVwZGF0ZUV2ZW5JZlNhbWU6dHJ1ZSkub2YoQHN0YXRlKVxuXHRcdFx0LnRvICh3aWR0aCk9PiAoaWYgQHNldHRpbmdzLmF1dG9XaWR0aCB0aGVuIEBlbC5jaGlsZC5pbnB1dCBlbHNlIEBlbCkuc3R5bGUoJ3dpZHRoJywgd2lkdGgpXG5cdFx0XHQudHJhbnNmb3JtIEBfZm9ybWF0V2lkdGguYmluZChAKVxuXHRcdFx0LnVwZGF0ZU9uKCdpc01vYmlsZScpLm9mKEBzdGF0ZSlcblxuXHRcdGlmIEBzZXR0aW5ncy5hdXRvV2lkdGhcblx0XHRcdFNpbXBseUJpbmQoJ192YWx1ZScsIHVwZGF0ZUV2ZW5JZlNhbWU6dHJ1ZSwgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0XHQudG8oJ3dpZHRoJykub2YoQHN0YXRlKVxuXHRcdFx0XHRcdC50cmFuc2Zvcm0gKCk9PiBcIiN7QF9nZXRJbnB1dEF1dG9XaWR0aCgpfXB4XCJcblx0XHRcdFx0XHQudXBkYXRlT24oJ2V2ZW50Omluc2VydGVkJykub2YoQGVsKVxuXHRcdFx0XHRcdC51cGRhdGVPbigndmlzaWJsZScpLm9mKEBzdGF0ZSlcblx0XHRcblx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc192YWx1ZTogKCktPlxuXHRcdGlucHV0ID0gQGVsLmNoaWxkLmlucHV0LnJhd1xuXHRcdFxuXHRcdHJlc2V0SW5wdXQgPSAoKT0+XG5cdFx0XHRmaWxsZWQgPSAhQG1hc2suaXNFbXB0eSgpXG5cdFx0XHRpZiBub3QgZmlsbGVkXG5cdFx0XHRcdEBzZWxlY3Rpb24oQG1hc2suY3Vyc29yID0gMClcblx0XHRcdFx0QF92YWx1ZSA9ICcnXG5cdFx0XHRcdEBzdGF0ZS5maWxsZWQgPSBmYWxzZVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gZmlsbGVkXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6aW5wdXQnKS5vZihpbnB1dCkudG8gKCk9PlxuXHRcdFx0QHZhbHVlID0gaW5wdXQudmFsdWVcblx0XHRcdEBzZWxlY3Rpb24oQG1hc2suY3Vyc29yKSBpZiBAbWFza1xuXHRcdFx0QGVtaXQoJ2lucHV0JywgQHZhbHVlKVxuXG5cdFx0U2ltcGx5QmluZCgnX3ZhbHVlJywgdXBkYXRlRXZlbklmU2FtZTohIUBtYXNrKS5vZihAKVxuXHRcdFx0LnRvKCd2YWx1ZScpLm9mKGlucHV0KVx0XHRcblx0XHRcdC5hbmQudG8gKHZhbHVlKT0+XG5cdFx0XHRcdGZpbGxlZCA9ICEhdmFsdWVcblx0XHRcdFx0ZmlsbGVkID0gcmVzZXRJbnB1dCgpIGlmIGZpbGxlZCBhbmQgQG1hc2sgYW5kIEBtYXNrLmd1aWRlIGFuZCAoIUBzdGF0ZS5mb2N1c2VkIG9yIEBtYXNrLmN1cnNvciBpcyAwKVxuXHRcdFx0XHRAc3RhdGUuZmlsbGVkID0gZmlsbGVkXG5cdFx0XHRcdEBzdGF0ZS5pbnRlcmFjdGVkID0gdHJ1ZSBpZiBmaWxsZWRcblx0XHRcdFx0QHN0YXRlLnZhbGlkID0gQHZhbGlkYXRlKHVuZGVmaW5lZCwgdHJ1ZSlcblx0XHRcdFx0QGVtaXQoJ2lucHV0JywgQHZhbHVlKSB1bmxlc3MgQHN0YXRlLmZvY3VzZWRcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmtleWRvd24nKS5vZihAZWwuY2hpbGQuaW5wdXQpLnRvIChldmVudCk9PlxuXHRcdFx0QGVtaXQoJ3N1Ym1pdCcpIGlmIGV2ZW50LmtleUNvZGUgaXMgS0VZQ09ERVMuZW50ZXJcblx0XHRcdEBlbWl0KFwia2V5LSN7ZXZlbnQua2V5Q29kZX1cIilcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmJsdXInKS5vZihAZWwuY2hpbGQuaW5wdXQpLnRvKHJlc2V0SW5wdXQpIGlmIEBtYXNrIGFuZCBAbWFzay5ndWlkZVxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2F1dG9jb21wbGV0ZTogKCktPiBpZiBAZHJvcGRvd25cblx0XHRTaW1wbHlCaW5kLmRlZmF1bHRPcHRpb25zLnVwZGF0ZU9uQmluZCA9IGZhbHNlXG5cblx0XHRTaW1wbHlCaW5kKCd0eXBpbmcnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUpLm9mKEBzdGF0ZSkudG8gKGlzVHlwaW5nKT0+XG5cdFx0XHRpZiBpc1R5cGluZ1xuXHRcdFx0XHRyZXR1cm4gaWYgbm90IEBfdmFsdWVcblx0XHRcdFx0aWYgQGRyb3Bkb3duLmlzT3BlblxuXHRcdFx0XHRcdEBkcm9wZG93bi5saXN0LmNhbGNEaXNwbGF5KClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBkcm9wZG93bi5pc09wZW4gPSB0cnVlXG5cdFx0XHRcdFx0U2ltcGx5QmluZCgnZXZlbnQ6Y2xpY2snKS5vZihkb2N1bWVudClcblx0XHRcdFx0XHRcdC5vbmNlLnRvICgpPT4gQGRyb3Bkb3duLmlzT3BlbiA9IGZhbHNlXG5cdFx0XHRcdFx0XHQuY29uZGl0aW9uIChldmVudCk9PiBub3QgRE9NKGV2ZW50LnRhcmdldCkucGFyZW50TWF0Y2hpbmcgKHBhcmVudCk9PiBwYXJlbnQgaXMgQGVsLmNoaWxkLmlubmVyd3JhcFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAZHJvcGRvd24uaXNPcGVuID0gZmFsc2VcblxuXHRcdFNpbXBseUJpbmQoJ192YWx1ZScpLm9mKEApLnRvICh2YWx1ZSk9PlxuXHRcdFx0Zm9yIGNob2ljZSBpbiBAZHJvcGRvd24uY2hvaWNlc1xuXHRcdFx0XHRzaG91bGRCZVZpc2libGUgPSBpZiBub3QgdmFsdWUgdGhlbiB0cnVlIGVsc2UgaGVscGVycy5mdXp6eU1hdGNoKHZhbHVlLCBjaG9pY2UubGFiZWwpXG5cdFx0XHRcdGNob2ljZS52aXNpYmxlID0gc2hvdWxkQmVWaXNpYmxlIGlmIGNob2ljZS52aXNpYmxlIGlzbnQgc2hvdWxkQmVWaXNpYmxlXG5cblx0XHRcdGlmIEBkcm9wZG93bi5pc09wZW4gYW5kIG5vdCB2YWx1ZVxuXHRcdFx0XHRAZHJvcGRvd24uaXNPcGVuID0gZmFsc2Vcblx0XHRcdHJldHVyblxuXG5cblx0XHRAZHJvcGRvd24ub25TZWxlY3RlZCAoc2VsZWN0ZWRDaG9pY2UpPT5cblx0XHRcdEBzZWxlY3RlZCA9IHNlbGVjdGVkQ2hvaWNlXG5cdFx0XHRAdmFsdWUgPSBzZWxlY3RlZENob2ljZS5sYWJlbFxuXHRcdFx0QGRyb3Bkb3duLmlzT3BlbiA9IGZhbHNlXG5cdFx0XHRAc2VsZWN0aW9uKEBlbC5jaGlsZC5pbnB1dC5yYXcudmFsdWUubGVuZ3RoKVxuXHRcdFxuXG5cdFx0U2ltcGx5QmluZC5kZWZhdWx0T3B0aW9ucy51cGRhdGVPbkJpbmQgPSB0cnVlXG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3Nfc3RhdGVUcmlnZ2VyczogKCktPlxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50Om1vdXNlZW50ZXInKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUuaG92ZXJlZCA9IHRydWVcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDptb3VzZWxlYXZlJykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQHN0YXRlLmhvdmVyZWQgPSBmYWxzZVxuXG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6Zm9jdXMnKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUuZm9jdXNlZCA9IHRydWU7IGlmIEBzdGF0ZS5kaXNhYmxlZCB0aGVuIEBibHVyKClcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDpibHVyJykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQHN0YXRlLnR5cGluZyA9IEBzdGF0ZS5mb2N1c2VkID0gZmFsc2Vcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDppbnB1dCcpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBzdGF0ZS50eXBpbmcgPSB0cnVlXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6a2V5ZG93bicpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBjdXJzb3IucHJldiA9IEBzZWxlY3Rpb24oKS5lbmRcblxuXHRcdHJldHVyblxuXG5cblx0X3NjaGVkdWxlQ3Vyc29yUmVzZXQ6ICgpLT5cblx0XHRkaWZmSW5kZXggPSBoZWxwZXJzLmdldEluZGV4T2ZGaXJzdERpZmYoQG1hc2sudmFsdWUsIEBtYXNrLnByZXYudmFsdWUpXG5cdFx0Y3VycmVudEN1cnNvciA9IEBjdXJzb3IuY3VycmVudFxuXHRcdG5ld0N1cnNvciA9IEBtYXNrLm5vcm1hbGl6ZUN1cnNvclBvcyhjdXJyZW50Q3Vyc29yLCBAY3Vyc29yLnByZXYpXG5cblx0XHRpZiBuZXdDdXJzb3IgaXNudCBjdXJyZW50Q3Vyc29yXG5cdFx0XHRAc2VsZWN0aW9uKG5ld0N1cnNvcilcblx0XHRyZXR1cm5cblxuXG5cdF9zZXRWYWx1ZUlmTm90U2V0OiAoKS0+XG5cdFx0aWYgQGVsLmNoaWxkLmlucHV0LnJhdy52YWx1ZSBpc250IEBfdmFsdWVcblx0XHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcudmFsdWUgPSBAX3ZhbHVlXG5cdFx0cmV0dXJuXG5cblxuXG5cdF9nZXRJbnB1dEF1dG9XaWR0aDogKCktPlxuXHRcdGlmIEBfdmFsdWVcblx0XHRcdEBfc2V0VmFsdWVJZk5vdFNldCgpXG5cdFx0XHRAZWwuY2hpbGQuaW5wdXQuc3R5bGUoJ3dpZHRoJywgMClcblx0XHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcuc2Nyb2xsTGVmdCA9IDFlKzEwXG5cdFx0XHRpbnB1dFdpZHRoID0gTWF0aC5tYXgoQGVsLmNoaWxkLmlucHV0LnJhdy5zY3JvbGxMZWZ0K0BlbC5jaGlsZC5pbnB1dC5yYXcub2Zmc2V0V2lkdGgsIEBlbC5jaGlsZC5pbnB1dC5yYXcuc2Nyb2xsV2lkdGgpICsgMlxuXHRcdFx0bGFiZWxXaWR0aCA9IGlmIEBzZXR0aW5ncy5sYWJlbCBhbmQgQGVsLmNoaWxkLmxhYmVsLnN0eWxlU2FmZSgncG9zaXRpb24nKSBpcyAnYWJzb2x1dGUnIHRoZW4gQGVsLmNoaWxkLmxhYmVsLnJlY3Qud2lkdGggZWxzZSAwXG5cdFx0ZWxzZVxuXHRcdFx0aW5wdXRXaWR0aCA9IEBlbC5jaGlsZC5wbGFjZWhvbGRlci5yZWN0LndpZHRoXG5cdFx0XHRsYWJlbFdpZHRoID0gMFxuXHRcdFxuXHRcdHJldHVybiBNYXRoLm1pbiBAX2dldFdpZHRoU2V0dGluZygnbWF4JyksIE1hdGgubWF4KEBfZ2V0V2lkdGhTZXR0aW5nKCdtaW4nKSwgaW5wdXRXaWR0aCwgbGFiZWxXaWR0aClcblxuXG5cdF9nZXRXaWR0aFNldHRpbmc6ICh0YXJnZXQpLT5cblx0XHR0YXJnZXQgKz0gJ1dpZHRoJyBpZiB0YXJnZXQgaXMgJ21pbicgb3IgdGFyZ2V0IGlzICdtYXgnXHRcdFxuXHRcdGlmIHR5cGVvZiBAc2V0dGluZ3NbdGFyZ2V0XSBpcyAnbnVtYmVyJ1xuXHRcdFx0cmVzdWx0ID0gQHNldHRpbmdzW3RhcmdldF1cblx0XHRcblx0XHRlbHNlIGlmXHR0eXBlb2YgQHNldHRpbmdzW3RhcmdldF0gaXMgJ3N0cmluZydcblx0XHRcdHJlc3VsdCA9IHBhcnNlRmxvYXQoQHNldHRpbmdzW3RhcmdldF0pXG5cblx0XHRcdGlmIGhlbHBlcnMuaW5jbHVkZXMoQHNldHRpbmdzW3RhcmdldF0sICclJylcblx0XHRcdFx0aWYgKHBhcmVudD1AZWwucGFyZW50KSBhbmQgcGFyZW50LnN0eWxlKCdkaXNwbGF5JykgaXMgJ2Jsb2NrJ1xuXHRcdFx0XHRcdHBhcmVudFdpZHRoID0gcGFyZW50LnN0eWxlUGFyc2VkKCd3aWR0aCcpIC0gcGFyZW50LnN0eWxlUGFyc2VkKCdwYWRkaW5nTGVmdCcpIC0gcGFyZW50LnN0eWxlUGFyc2VkKCdwYWRkaW5nUmlnaHQnKSAtIDJcblx0XHRcdFx0XHRyZXN1bHQgPSBwYXJlbnRXaWR0aCAqIChyZXN1bHQvMTAwKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVzdWx0ID0gMFxuXG5cdFx0cmV0dXJuIHJlc3VsdCBvciAoaWYgdGFyZ2V0IGlzICdtaW5XaWR0aCcgdGhlbiAwIGVsc2UgSW5maW5pdHkpXG5cblxuXHRfdmFsaWRhdGU6IChwcm92aWRlZFZhbHVlKS0+XG5cdFx0aWYgQHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4IGFuZCBJUy5yZWdleChAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXgpXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgbm90IEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleC50ZXN0KHByb3ZpZGVkVmFsdWUpXG5cdFx0XG5cdFx0aWYgQHNldHRpbmdzLnZhbGlkV2hlbklzQ2hvaWNlIGFuZCBAc2V0dGluZ3MuY2hvaWNlcz8ubGVuZ3RoXG5cdFx0XHRtYXRjaGluZ0Nob2ljZSA9IEBzZXR0aW5ncy5jaG9pY2VzLmZpbHRlciAoY2hvaWNlKS0+IGNob2ljZS52YWx1ZSBpcyBwcm92aWRlZFZhbHVlXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgbm90IG1hdGNoaW5nQ2hvaWNlLmxlbmd0aFxuXG5cdFx0aWYgQHNldHRpbmdzLm1pbkxlbmd0aFxuXHRcdFx0cmV0dXJuIGZhbHNlIGlmIHByb3ZpZGVkVmFsdWUubGVuZ3RoIDwgQHNldHRpbmdzLm1pbkxlbmd0aFxuXG5cdFx0aWYgQHNldHRpbmdzLm1heExlbmd0aFxuXHRcdFx0cmV0dXJuIGZhbHNlIGlmIHByb3ZpZGVkVmFsdWUubGVuZ3RoID49IEBzZXR0aW5ncy5tYXhMZW5ndGhcblxuXHRcdGlmIEBtYXNrXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgbm90IEBtYXNrLnZhbGlkYXRlKHByb3ZpZGVkVmFsdWUpXG5cdFx0XG5cdFx0cmV0dXJuIHRydWVcblxuXG5cdHNlbGVjdGlvbjogKGFyZyktPlxuXHRcdGlmIElTLm9iamVjdChhcmcpXG5cdFx0XHRzdGFydCA9IGFyZy5zdGFydFxuXHRcdFx0ZW5kID0gYXJnLmVuZFxuXHRcdGVsc2Vcblx0XHRcdHN0YXJ0ID0gYXJnXG5cdFx0XHRlbmQgPSBhcmd1bWVudHNbMV1cblxuXHRcdGlmIHN0YXJ0P1xuXHRcdFx0ZW5kID0gc3RhcnQgaWYgbm90IGVuZCBvciBlbmQgPCBzdGFydFxuXHRcdFx0QGVsLmNoaWxkLmlucHV0LnJhdy5zZXRTZWxlY3Rpb25SYW5nZShzdGFydCwgZW5kKVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuICdzdGFydCc6QGVsLmNoaWxkLmlucHV0LnJhdy5zZWxlY3Rpb25TdGFydCwgJ2VuZCc6QGVsLmNoaWxkLmlucHV0LnJhdy5zZWxlY3Rpb25FbmRcblxuXG5cdGZvY3VzOiAoKS0+XG5cdFx0QGVsLmNoaWxkLmlucHV0LnJhdy5mb2N1cygpXG5cblx0Ymx1cjogKCktPlxuXHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcuYmx1cigpXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRGaWVsZCIsImN1cnJlbnRJRCA9IDBcbmFycmF5TXV0YXRvck1ldGhvZHMgPSBbJ3B1c2gnLCdwb3AnLCdzaGlmdCcsJ3Vuc2hpZnQnLCdzcGxpY2UnLCdyZXZlcnNlJywnc29ydCddXG5kdW1teVByb3BlcnR5RGVzY3JpcHRvciA9IHt9XG5ib3VuZEluc3RhbmNlcyA9IHt9XG5wbGFjZWhvbGRlciA9IFsne3snLCAnfX0nXVxuc2V0dGluZ3MgPSBPYmplY3QuY3JlYXRlXG5cdHNpbGVudDpcdFx0XHRcdFx0ZmFsc2Vcbixcblx0cGxhY2Vob2xkZXI6XG5cdFx0Z2V0OiAoKS0+IHBsYWNlaG9sZGVyXG5cdFx0c2V0OiAobmV3UGxhY2Vob2xkZXIpLT4gaWYgY2hlY2tJZi5pc0FycmF5KG5ld1BsYWNlaG9sZGVyKSBhbmQgbmV3UGxhY2Vob2xkZXIubGVuZ3RoIGlzIDJcblx0XHRcdHBsYWNlaG9sZGVyID0gbmV3UGxhY2Vob2xkZXJcblx0XHRcdHNldFBob2xkZXJSZWdFeCgpXG5cdFx0XHRyZXR1cm5cblxuXG5kZWZhdWx0T3B0aW9ucyA9IFxuXHRkZWxheTpcdFx0XHRcdFx0ZmFsc2Vcblx0dGhyb3R0bGU6XHRcdFx0XHRmYWxzZVxuXHRzaW1wbGVTZWxlY3RvcjpcdFx0XHRmYWxzZVxuXHRwcm9taXNlVHJhbnNmb3JtczpcdFx0ZmFsc2Vcblx0ZGlzcGF0Y2hFdmVudHM6XHRcdFx0ZmFsc2Vcblx0c2VuZEFycmF5Q29waWVzOlx0XHRmYWxzZVxuXHR1cGRhdGVFdmVuSWZTYW1lOlx0XHRmYWxzZVxuXHR1cGRhdGVPbkJpbmQ6XHRcdFx0dHJ1ZVxuXG5cbmltcG9ydCAnLi9taXNjJ1xuaW1wb3J0ICcuL1NpbXBseUJpbmQnXG5pbXBvcnQgJy4vQmluZGluZydcbmltcG9ydCAnLi9CaW5kaW5nSW50ZXJmYWNlJ1xuaW1wb3J0ICcuL0dyb3VwQmluZGluZydcblxubW9kdWxlLmV4cG9ydHMgPSBTaW1wbHlCaW5kIiwiaW1wb3J0ICcuL2hlbHBlcnMnXG5pbXBvcnQgJy4vZXJyb3JzQW5kV2FybmluZ3MnXG4iLCJkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuZ2V0RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JcblxuaW1wb3J0ICcuL2NoYW5nZUV2ZW50J1xuaW1wb3J0ICcuL3JlcXVpcmVzRG9tRGVzY3JpcHRvckZpeCdcbmltcG9ydCAnLi93aW5kb3dQcm9wc1RvSWdub3JlJ1xuXG5cbnNldFZhbHVlTm9vcCA9ICh2LCBwdWJsaXNoZXIpLT4gQHVwZGF0ZUFsbFN1YnMocHVibGlzaGVyIG9yIEApXG5cbmdlbklEID0gKCktPiAnJysoKytjdXJyZW50SUQpXG5cbmdlbk9iaiA9ICgpLT4gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG5nZW5Qcm94aWVkSW50ZXJmYWNlID0gKGlzU3ViLCBjb21wbGV0ZUNhbGxiYWNrKS0+IChzdWJqZWN0LCBjdXN0b21PcHRpb25zLCBzYXZlT3B0aW9ucyktPlxuXHRTaW1wbHlCaW5kKHN1YmplY3QsIGN1c3RvbU9wdGlvbnMsIHNhdmVPcHRpb25zLCBpc1N1YiwgY29tcGxldGVDYWxsYmFjaylcblxuZ2VuU2VsZlVwZGF0ZXIgPSAoYmluZGluZywgZmV0Y2hWYWx1ZSktPlxuXHRiaW5kaW5nLnNlbGZVcGRhdGVyIG9yXG5cdGJpbmRpbmcuc2VsZlVwZGF0ZXIgPSBuZXcgQmluZGluZyAoKS0+XG5cdFx0aWYgZmV0Y2hWYWx1ZSB0aGVuIGJpbmRpbmcuc2V0VmFsdWUoYmluZGluZy5mZXRjaERpcmVjdFZhbHVlKCksIGJpbmRpbmcsIHRydWUpIGVsc2UgYmluZGluZy51cGRhdGVBbGxTdWJzKGJpbmRpbmcpXG5cdCwgJ0Z1bmMnLCB7fVxuXG5cbiMgPT09PSBDaGVja3MgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgJy4vY2hlY2tzJ1xuXG5cbiMgPT09PSBEZXNjcmlwdG9yIE1vZGlmaWNhdGlvbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCAnLi9kZXNjcmlwdG9yLW1vZCdcblxuXG4jID09PT0gT2JqZWN0IGNsb25pbmcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgJy4vY2xvbmluZydcblxuXG4jID09PT0gQmluZGluZyBDYWNoZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCAnLi9jYWNoZSdcblxuXG4jID09PT0gUGxhY2Vob2xkZXJzID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0ICcuL3BsYWNlaG9sZGVycydcblxuXG4jID09PT0gRXJyb3JzICsgV2FybmluZ3MgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgJy4vZXJyb3JzJ1xuXG5cblxuXG5cblxuXG4iLCJjYWNoZWRFdmVudCA9IG51bGxcblxuY2hhbmdlRXZlbnQgPSAoKS0+XG5cdGlmIG5vdCBjYWNoZWRFdmVudFxuXHRcdGV2ZW50ID0gY2FjaGVkRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKVxuXHRcdGV2ZW50LmluaXRFdmVudCgnY2hhbmdlJywgdHJ1ZSwgZmFsc2UpXG5cdFx0ZXZlbnQuX3NiID0gdHJ1ZVxuXG5cdHJldHVybiBjYWNoZWRFdmVudCIsInJlcXVpcmVzRG9tRGVzY3JpcHRvckZpeCA9ICgnY2xhc3NOYW1lJyBub3Qgb2YgRWxlbWVudDo6KSBvciBub3QgZ2V0RGVzY3JpcHRvcihFbGVtZW50OjosICdjbGFzc05hbWUnKS5nZXQiLCJ3aW5kb3dQcm9wc1RvSWdub3JlID0gW1xuXHQnaW5uZXJXaWR0aCdcblx0J2lubmVySGVpZ2h0J1xuXHQnb3V0ZXJXaWR0aCdcblx0J291dGVySGVpZ2h0J1xuXHQnc2Nyb2xsWCdcblx0J3Njcm9sbFknXG5cdCdwYWdlWE9mZnNldCdcblx0J3BhZ2VZT2Zmc2V0J1xuXHQnc2NyZWVuWCdcblx0J3NjcmVlblknXG5cdCdzY3JlZW5MZWZ0J1xuXHQnc2NyZWVuVG9wJ1xuXSIsInRhcmdldEluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPiB0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuY2hlY2tJZiA9XG5cdGlzRGVmaW5lZDogKHN1YmplY3QpLT4gc3ViamVjdCBpc250IHVuZGVmaW5lZFxuXHRcblx0aXNBcnJheTogKHN1YmplY3QpLT4gc3ViamVjdCBpbnN0YW5jZW9mIEFycmF5XG5cdFxuXHRpc09iamVjdDogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ29iamVjdCcgYW5kIHN1YmplY3QgIyAybmQgY2hlY2sgaXMgdG8gdGVzdCBhZ2FpbnN0ICdudWxsJyB2YWx1ZXNcblxuXHRpc1N0cmluZzogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ3N0cmluZydcblx0XG5cdGlzTnVtYmVyOiAoc3ViamVjdCktPiB0eXBlb2Ygc3ViamVjdCBpcyAnbnVtYmVyJ1xuXHRcblx0aXNGdW5jdGlvbjogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ2Z1bmN0aW9uJ1xuXG5cdGlzQmluZGluZ0ludGVyZmFjZTogKHN1YmplY3QpLT4gc3ViamVjdCBpbnN0YW5jZW9mIEJpbmRpbmdJbnRlcmZhY2Vcblx0XG5cdGlzQmluZGluZzogKHN1YmplY3QpLT4gc3ViamVjdCBpbnN0YW5jZW9mIEJpbmRpbmdcblxuXHRpc0l0ZXJhYmxlOiAoc3ViamVjdCktPiBjaGVja0lmLmlzT2JqZWN0KHN1YmplY3QpIGFuZCBjaGVja0lmLmlzTnVtYmVyKHN1YmplY3QubGVuZ3RoKVxuXG5cdGlzRG9tOiAoc3ViamVjdCktPiBzdWJqZWN0Lm5vZGVOYW1lIGFuZCBzdWJqZWN0Lm5vZGVUeXBlIGlzIDFcblxuXHRpc0RvbUlucHV0OiAoc3ViamVjdCktPlxuXHRcdG5vZGVOYW1lID0gc3ViamVjdC5ub2RlTmFtZVxuXHRcdHJldHVybiBub2RlTmFtZSBpcyAnSU5QVVQnIG9yIG5vZGVOYW1lIGlzICdURVhUQVJFQScgb3Igbm9kZU5hbWUgaXMgJ1NFTEVDVCdcblxuXHRpc0RvbVJhZGlvOiAoc3ViamVjdCktPiBzdWJqZWN0LnR5cGUgaXMgJ3JhZGlvJ1xuXG5cdGlzRG9tQ2hlY2tib3g6IChzdWJqZWN0KS0+IHN1YmplY3QudHlwZSBpcyAnY2hlY2tib3gnXG5cblx0aXNFbENvbGxlY3Rpb246IChzdWJqZWN0KS0+IChzdWJqZWN0IGluc3RhbmNlb2YgTm9kZUxpc3QpIG9yIChzdWJqZWN0IGluc3RhbmNlb2YgSFRNTENvbGxlY3Rpb24pIG9yICh3aW5kb3cualF1ZXJ5IGFuZCBzdWJqZWN0IGluc3RhbmNlb2YgalF1ZXJ5KVxuXG5cdGRvbUVsc0FyZVNhbWU6IChpdGVyYWJsZSktPlxuXHRcdHR5cGUgPSBpdGVyYWJsZVswXS50eXBlXG5cdFx0aXRlbXNXaXRoU2FtZVR5cGUgPSBbXS5maWx0ZXIuY2FsbCBpdGVyYWJsZSwgKGl0ZW0pLT4gaXRlbS50eXBlIGlzIHR5cGVcblxuXHRcdHJldHVybiBpdGVtc1dpdGhTYW1lVHlwZS5sZW5ndGggaXMgaXRlcmFibGUubGVuZ3RoXG5cblx0aXNEb21Ob2RlOiAoc3ViamVjdCktPiBjaGVja0lmLmlzRG9tKHN1YmplY3QpIG9yIHN1YmplY3QgaXMgd2luZG93IG9yIHN1YmplY3QgaXMgZG9jdW1lbnQiLCJmZXRjaERlc2NyaXB0b3IgPSAob2JqZWN0LCBwcm9wZXJ0eSwgaXNQcm90byktPlxuXHRkZXNjcmlwdG9yID0gZ2V0RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KVxuXHRpZiBkZXNjcmlwdG9yXG5cdFx0ZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlIGlmIGlzUHJvdG9cblx0XHRyZXR1cm4gZGVzY3JpcHRvclxuXHRcblx0ZWxzZSBpZiBvYmplY3RQcm90bz1PYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KVxuXHRcdHJldHVybiBmZXRjaERlc2NyaXB0b3Iob2JqZWN0UHJvdG8sIHByb3BlcnR5LCB0cnVlKVxuXG5cbmNvbnZlcnRUb0xpdmUgPSAoYmluZGluZ0luc3RhbmNlLCBvYmplY3QsIG9ubHlBcnJheU1ldGhvZHMpLT5cblx0XyA9IGJpbmRpbmdJbnN0YW5jZVxuXHRfLm9yaWdEZXNjcmlwdG9yID0gZmV0Y2hEZXNjcmlwdG9yKG9iamVjdCwgXy5wcm9wZXJ0eSkgaWYgbm90IF8ub3JpZ0Rlc2NyaXB0b3JcblxuXHRpZiBvbmx5QXJyYXlNZXRob2RzXG5cdFx0YXJyYXlNdXRhdG9yTWV0aG9kcy5mb3JFYWNoIChtZXRob2QpLT4gIyBVc2luZyBmb3JFYWNoIGJlY2F1c2Ugd2UgbmVlZCBhIGNsb3N1cmUgaGVyZVxuXHRcdFx0ZGVmaW5lUHJvcGVydHkgb2JqZWN0LCBtZXRob2QsIFxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHRcdFx0dmFsdWU6ICgpLT5cblx0XHRcdFx0XHRyZXN1bHQgPSBBcnJheTo6W21ldGhvZF0uYXBwbHkgb2JqZWN0LCBhcmd1bWVudHNcblx0XHRcdFx0XHRfLnVwZGF0ZUFsbFN1YnMoXylcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0XG5cblx0ZWxzZVxuXHRcdGlmIF8udHlwZSBpcyAnUHJveHknXG5cdFx0XHRvcmlnRm4gPSBfLm9yaWdGbiA9IF8udmFsdWVcblx0XHRcdGNvbnRleHQgPSBvYmplY3Rcblx0XHRcdF8udmFsdWUgPSByZXN1bHQ6bnVsbCwgYXJnczpudWxsXG5cblx0XHRcdGlmIGNoZWNrSWYuaXNGdW5jdGlvbihvcmlnRm4pXG5cdFx0XHRcdHNsaWNlID0gW10uc2xpY2Vcblx0XHRcdFx0Z2V0dGVyVmFsdWUgPSBwcm94eUZuID0gKCktPiBcblx0XHRcdFx0XHRhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpXG5cdFx0XHRcdFx0Xy52YWx1ZS5hcmdzID0gYXJncyA9IGlmIF8uc2VsZlRyYW5zZm9ybSB0aGVuIF8uc2VsZlRyYW5zZm9ybShhcmdzKSBlbHNlIGFyZ3Ncblx0XHRcdFx0XHRfLnZhbHVlLnJlc3VsdCA9IHJlc3VsdCA9IG9yaWdGbi5hcHBseShjb250ZXh0LCBhcmdzKVxuXHRcdFx0XHRcdF8udXBkYXRlQWxsU3VicyhfKVxuXHRcdFx0XHRcdHJldHVybiByZXN1bHRcblx0XHRcdFx0XG5cdFx0XHRcdGRlZmluZVByb3BlcnR5IG9iamVjdCwgXy5wcm9wZXJ0eSwgXG5cdFx0XHRcdFx0Y29uZmlndXJhYmxlOiBfLmlzTGl2ZVByb3AgPSB0cnVlXG5cdFx0XHRcdFx0Z2V0OiAoKS0+IGdldHRlclZhbHVlXG5cdFx0XHRcdFx0c2V0OiAobmV3VmFsdWUpLT5cblx0XHRcdFx0XHRcdGlmIG5vdCBjaGVja0lmLmlzRnVuY3Rpb24obmV3VmFsdWUpXG5cdFx0XHRcdFx0XHRcdGdldHRlclZhbHVlID0gbmV3VmFsdWVcblxuXHRcdFx0XHRcdFx0ZWxzZSBpZiBuZXdWYWx1ZSBpc250IG9yaWdGblxuXHRcdFx0XHRcdFx0XHRvcmlnRm4gPSBfLm9yaWdGbiA9IG5ld1ZhbHVlXHRpZiBuZXdWYWx1ZSBpc250IHByb3h5Rm5cblx0XHRcdFx0XHRcdFx0Z2V0dGVyVmFsdWUgPSBwcm94eUZuXHRcdFx0aWYgZ2V0dGVyVmFsdWUgaXNudCBwcm94eUZuXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRcblxuXHRcdGVsc2UgaWYgbm90IHRhcmdldEluY2x1ZGVzKF8udHlwZSwgJ0RPTScpIGFuZCBub3QgKF8ub2JqZWN0IGlzIHdpbmRvdyBhbmQgdGFyZ2V0SW5jbHVkZXMod2luZG93UHJvcHNUb0lnbm9yZSwgXy5wcm9wZXJ0eSkpXG5cdFx0XG5cdFx0XHQjICdPYmplY3RQcm9wJyBvciAnQXJyYXknIHR5cGUgYmluZGluZ3Ncblx0XHRcdHByb3BlcnR5RGVzY3JpcHRvciA9IF8ub3JpZ0Rlc2NyaXB0b3Igb3IgZHVtbXlQcm9wZXJ0eURlc2NyaXB0b3Jcblx0XHRcdF8ub3JpZ0dldHRlciA9IHByb3BlcnR5RGVzY3JpcHRvci5nZXQuYmluZChvYmplY3QpIGlmIHByb3BlcnR5RGVzY3JpcHRvci5nZXRcblx0XHRcdF8ub3JpZ1NldHRlciA9IHByb3BlcnR5RGVzY3JpcHRvci5zZXQuYmluZChvYmplY3QpIGlmIHByb3BlcnR5RGVzY3JpcHRvci5zZXRcblx0XHRcdHNob3VsZFdyaXRlTGl2ZVByb3AgPSBwcm9wZXJ0eURlc2NyaXB0b3IuY29uZmlndXJhYmxlXG5cblx0XHRcdHNob3VsZFdyaXRlTGl2ZVByb3AgPSBzaG91bGRXcml0ZUxpdmVQcm9wIGFuZCBvYmplY3QuY29uc3RydWN0b3IgaXNudCBDU1NTdHlsZURlY2xhcmF0aW9uXG5cdFx0XHRpbXBvcnQgJy4vd2Via2l0RG9tRGVzY3JpcHRvckZpeCdcblx0XHRcdFxuXHRcdFx0aWYgc2hvdWxkV3JpdGVMaXZlUHJvcFxuXHRcdFx0XHR0eXBlSXNBcnJheSA9IF8udHlwZSBpcyAnQXJyYXknXG5cdFx0XHRcdHNob3VsZEluZGljYXRlVXBkYXRlSXNGcm9tU2VsZiA9IG5vdCBfLm9yaWdTZXR0ZXIgYW5kIG5vdCB0eXBlSXNBcnJheVxuXHRcdFx0XHRcblx0XHRcdFx0ZGVmaW5lUHJvcGVydHkgb2JqZWN0LCBfLnByb3BlcnR5LFxuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogXy5pc0xpdmVQcm9wID0gdHJ1ZVxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHByb3BlcnR5RGVzY3JpcHRvci5lbnVtZXJhYmxlXG5cdFx0XHRcdFx0Z2V0OiBfLm9yaWdHZXR0ZXIgb3IgKCktPiBfLnZhbHVlXG5cdFx0XHRcdFx0c2V0OiAobmV3VmFsdWUpLT4gXy5zZXRWYWx1ZShuZXdWYWx1ZSwgXywgc2hvdWxkSW5kaWNhdGVVcGRhdGVJc0Zyb21TZWxmKTsgcmV0dXJuXG5cblx0XHRcdFxuXHRcdFx0XHRpZiB0eXBlSXNBcnJheVxuXHRcdFx0XHRcdGNvbnZlcnRUb0xpdmUoXywgb2JqZWN0W18ucHJvcGVydHldLCB0cnVlKVxuXG5cdHJldHVyblxuXG5cblxuXG5cbmNvbnZlcnRUb1JlZyA9IChiaW5kaW5nSW5zdGFuY2UsIG9iamVjdCwgb25seUFycmF5TWV0aG9kcyktPlxuXHRpZiBvbmx5QXJyYXlNZXRob2RzXG5cdFx0ZGVsZXRlIG9iamVjdFttZXRob2RdIGZvciBtZXRob2QgaW4gYXJyYXlNdXRhdG9yTWV0aG9kc1xuXHRlbHNlXG5cdFx0XyA9IGJpbmRpbmdJbnN0YW5jZVxuXHRcdG5ld0Rlc2NyaXB0b3IgPSBfLm9yaWdEZXNjcmlwdG9yXG5cdFx0bmV3RGVzY3JpcHRvci52YWx1ZSA9IChfLm9yaWdGbiBvciBfLnZhbHVlKSB1bmxlc3MgbmV3RGVzY3JpcHRvci5zZXQgb3IgbmV3RGVzY3JpcHRvci5nZXRcblx0XHRkZWZpbmVQcm9wZXJ0eSBvYmplY3QsIF8ucHJvcGVydHksIG5ld0Rlc2NyaXB0b3JcblxuXG5cbiIsIiMjIypcbiAqIFRoZXJlIGlzIGEgYnVnIGluIHdlYmtpdC9ibGluayBlbmdpbmVzIGluIHdoaWNoIG5hdGl2ZSBhdHRyaWJ1dGVzL3Byb3BlcnRpZXMgXG4gKiBvZiBET00gZWxlbWVudHMgYXJlIG5vdCBleHBvc2VkIG9uIHRoZSBlbGVtZW50J3MgcHJvdG90eXBlIGFuZCBpbnN0ZWFkIGlzXG4gKiBleHBvc2VkIGRpcmVjdGx5IG9uIHRoZSBlbGVtZW50IGluc3RhbmNlOyB3aGVuIGxvb2tpbmcgdXAgdGhlIHByb3BlcnR5IGRlc2NyaXB0b3JcbiAqIG9mIHRoZSBlbGVtZW50IGEgZGF0YSBkZXNjcmlwdG9yIGlzIHJldHVybmVkIGluc3RlYWQgb2YgYW4gYWNjZXNzb3IgZGVzY3JpcHRvclxuICogKGkuZS4gZGVzY3JpcHRvciB3aXRoIGdldHRlci9zZXR0ZXIpIHdoaWNoIG1lYW5zIHdlIGFyZSBub3QgYWJsZSB0byBkZWZpbmUgb3VyXG4gKiBvd24gcHJveHkgZ2V0dGVyL3NldHRlcnMuIFRoaXMgd2FzIGZpeGVkIG9ubHkgaW4gQXByaWwgMjAxNSBpbiBDaHJvbWUgdjQzIGFuZFxuICogU2FmYXJpIHYxMC4gQWx0aG91Z2ggd2Ugd29uJ3QgYmUgYWJsZSB0byBnZXQgbm90aWZpZWQgd2hlbiB0aGUgb2JqZWN0cyBnZXRcbiAqIHRoZWlyIHZhbHVlcyBzZXQsIHdlIHdvdWxkIGF0IGxlYXN0IHByb3ZpZGUgd29ya2luZyBmdW5jdGlvbmFsaXR5IGxhY2tpbmcgdXBkYXRlXG4gKiBsaXN0ZW5lcnMuIFNpbmNlIHYxLjE0LjAgSFRNTElucHV0RWxlbWVudDo6dmFsdWUgYmluZGluZ3MgaW52b2tlIHRoZSBvcmlnaW5hbFxuICogZ2V0dGVyIGFuZCBzZXR0ZXIgbWV0aG9kcyBpbiBCaW5kaW5nOjpzZXRWYWx1ZSgpLCBhbmQgc2luY2Ugd2Ugd2FudCB0byBhdm9pZFxuICogaW5jcmVhc2luZyB0aGUgYW1vdW50IG9mIGxvZ2ljIHByZXNlbnQgaW4gQmluZGluZzo6c2V0VmFsdWUoKSBmb3IgcGVyZm9ybWFuY2VcbiAqIHJlYXNvbnMsIHdlIHBhdGNoIHRob3NlIHNldHRlcnMgaGVyZS4gV2UgY2xvbmUgdGhlIHRhcmdldCBlbGVtZW50IGFuZCBjaGVjayBmb3JcbiAqIHRoZSBleGlzdGVuY2Ugb2YgdGhlIHRhcmdldCBwcm9wZXJ0eSAtIGlmIGl0IGV4aXN0cyB0aGVuIGl0IGluZGljYXRlcyB0aGUgdGFyZ2V0XG4gKiBwcm9wZXJ0eSBpcyBhIG5hdGl2ZSBwcm9wZXJ0eSAoc2luY2Ugb25seSBuYXRpdmUgcHJvcGVydGllcyBhcmUgY29waWVkIG92ZXIgaW5cbiAqIEVsZW1lbnQ6OmNsb25lTm9kZSkuIFRoaXMgcGF0Y2hpbmcgaXMgb25seSBmb3IgbmF0aXZlIHByb3BlcnRpZXMuXG4gKlxuICogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTQ5NzM5XG4gKiBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NzUyOTdcbiAqIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQzMzk0XG4gKiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00MzE0OTJcbiAqIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTEzMTc1XG4gKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvdXBkYXRlcy8yMDE1LzA0L0RPTS1hdHRyaWJ1dGVzLW5vdy1vbi10aGUtcHJvdG90eXBlLWNoYWluXG4jIyNcblxuaWYgcmVxdWlyZXNEb21EZXNjcmlwdG9yRml4IGFuZCBfLmlzRG9tIGFuZCBfLnByb3BlcnR5IG9mIG9iamVjdC5jbG9uZU5vZGUoZmFsc2UpXG5cdF8ub3JpZ0Rlc2NyaXB0b3IgPSBzaG91bGRXcml0ZUxpdmVQcm9wID0gZmFsc2Vcblx0Xy5pc0xpdmVQcm9wID0gdHJ1ZVxuXHRfLm9yaWdHZXR0ZXIgPSAoKS0+IF8ub2JqZWN0W18ucHJvcGVydHldXG5cdF8ub3JpZ1NldHRlciA9IChuZXdWYWx1ZSktPiBfLm9iamVjdFtfLnByb3BlcnR5XSA9IG5ld1ZhbHVlIiwiY2xvbmVPYmplY3QgPSAob2JqZWN0KS0+XG5cdGNsb25lID0gZ2VuT2JqKClcblx0Y2xvbmVba2V5XSA9IG9iamVjdFtrZXldIGZvciBrZXkgb2Ygb2JqZWN0XG5cdHJldHVybiBjbG9uZVxuXG5leHRlbmRTdGF0ZSA9IChiYXNlLCBzdGF0ZVRvSW5oZXJpdCktPlxuXHRzdGF0ZU1hcHBpbmcgPSBPYmplY3Qua2V5cyhzdGF0ZVRvSW5oZXJpdClcblx0YmFzZVtrZXldID0gc3RhdGVUb0luaGVyaXRba2V5XSBmb3Iga2V5IGluIHN0YXRlTWFwcGluZ1xuXHRyZXR1cm5cbiIsImNhY2hlID1cdFxuXHRnZXQ6IChvYmplY3QsIGlzRnVuY3Rpb24sIHNlbGVjdG9yLCBpc011bHRpQ2hvaWNlKS0+XG5cdFx0aWYgaXNGdW5jdGlvblxuXHRcdFx0cmV0dXJuIGJvdW5kSW5zdGFuY2VzW29iamVjdC5fc2JfSURdXG5cdFx0ZWxzZVxuXHRcdFx0aWYgaXNNdWx0aUNob2ljZSBhbmQgb2JqZWN0WzBdLl9zYl9tYXBcblx0XHRcdFx0c2FtcGxlSXRlbSA9IGJvdW5kSW5zdGFuY2VzWyBvYmplY3RbMF0uX3NiX21hcFtzZWxlY3Rvcl0gXVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIHNhbXBsZUl0ZW0uZ3JvdXBCaW5kaW5nIGlmIHNhbXBsZUl0ZW0uZ3JvdXBCaW5kaW5nXG5cblx0XHRcdGlmIG9iamVjdC5fc2JfbWFwIGFuZCBvYmplY3QuX3NiX21hcFtzZWxlY3Rvcl1cblx0XHRcdFx0cmV0dXJuIGJvdW5kSW5zdGFuY2VzWyBvYmplY3QuX3NiX21hcFtzZWxlY3Rvcl0gXVxuXG5cblx0c2V0OiAoQiwgaXNGdW5jdGlvbiktPiAjIEIgPT09PSBCaW5kaW5nIE9iamVjdFxuXHRcdGlmIGlzRnVuY3Rpb25cblx0XHRcdGRlZmluZVByb3BlcnR5IEIub2JqZWN0LCAnX3NiX0lEJywgeydjb25maWd1cmFibGUnOnRydWUsICd2YWx1ZSc6Qi5JRH1cblxuXHRcdGVsc2Vcblx0XHRcdHNlbGVjdG9yID0gQi5zZWxlY3RvclxuXG5cdFx0XHRpZiBCLm9iamVjdC5fc2JfbWFwXG5cdFx0XHRcdEIub2JqZWN0Ll9zYl9tYXBbc2VsZWN0b3JdID0gQi5JRFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwcm9wc01hcCA9IHt9XG5cdFx0XHRcdHByb3BzTWFwW3NlbGVjdG9yXSA9IEIuSURcblx0XHRcdFx0XG5cdFx0XHRcdGRlZmluZVByb3BlcnR5IEIub2JqZWN0LCAnX3NiX21hcCcsIHsnY29uZmlndXJhYmxlJzp0cnVlLCAndmFsdWUnOnByb3BzTWFwfVxuXHRcdHJldHVybiIsImVzY2FwZVJlZ0V4ID0gL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nXG5waG9sZGVyUmVnRXggPSBwaG9sZGVyUmVnRXhTcGxpdCA9IG51bGxcblxuc2V0UGhvbGRlclJlZ0V4ID0gKCktPlxuXHRzdGFydCA9IHNldHRpbmdzLnBsYWNlaG9sZGVyWzBdLnJlcGxhY2UoZXNjYXBlUmVnRXgsICdcXFxcJCYnKVxuXHRlbmQgPSBzZXR0aW5ncy5wbGFjZWhvbGRlclsxXS5yZXBsYWNlKGVzY2FwZVJlZ0V4LCAnXFxcXCQmJylcblx0bWlkZGxlID0gXCJbXiN7ZW5kfV0rXCJcblx0cGhvbGRlclJlZ0V4ID0gbmV3IFJlZ0V4cChcIiN7c3RhcnR9KCN7bWlkZGxlfSkje2VuZH1cIiwgJ2cnKVxuXHRwaG9sZGVyUmVnRXhTcGxpdCA9IG5ldyBSZWdFeHAoXCIje3N0YXJ0fSN7bWlkZGxlfSN7ZW5kfVwiLCAnZycpXG5cdHJldHVyblxuXG5zZXRQaG9sZGVyUmVnRXgoKSAjIENyZWF0ZSB0aGUgcmVnRXggb24gaW5pdFxuXG5cblxuYXBwbHlQbGFjZWhvbGRlcnMgPSAoY29udGV4dHMsIHZhbHVlcywgaW5kZXhNYXApLT5cblx0b3V0cHV0ID0gJydcblx0Zm9yIGNvbnRleHRQYXJ0LGluZGV4IGluIGNvbnRleHRzXG5cdFx0b3V0cHV0ICs9IGNvbnRleHRQYXJ0XG5cdFx0b3V0cHV0ICs9IHZhbHVlc1tpbmRleE1hcFtpbmRleF1dIGlmIGluZGV4TWFwW2luZGV4XVxuXHRcblx0cmV0dXJuIG91dHB1dFxuXG5cbnRleHRDb250ZW50ID0gJ3RleHRDb250ZW50J1xuXG5hZGRUb05vZGVTdG9yZSA9IChub2RlU3RvcmUsIG5vZGUsIHRhcmdldFBsYWNlaG9sZGVyKS0+XG5cdG5vZGVTdG9yZVt0YXJnZXRQbGFjZWhvbGRlcl0gPz0gW11cblx0bm9kZVN0b3JlW3RhcmdldFBsYWNlaG9sZGVyXS5wdXNoKG5vZGUpXG5cdHJldHVyblxuXG5cbnNjYW5UZXh0Tm9kZXNQbGFjZWhvbGRlcnMgPSAoZWxlbWVudCwgbm9kZVN0b3JlKS0+XG5cdGNoaWxkTm9kZXMgPSBBcnJheTo6c2xpY2UuY2FsbChlbGVtZW50LmNoaWxkTm9kZXMpXG5cdGZvciBub2RlIGluIGNoaWxkTm9kZXNcblx0XHRpZiBub2RlLm5vZGVUeXBlIGlzbnQgMyBcblx0XHRcdHNjYW5UZXh0Tm9kZXNQbGFjZWhvbGRlcnMobm9kZSwgbm9kZVN0b3JlKVxuXHRcdFxuXHRcdGVsc2UgaWYgbm9kZVt0ZXh0Q29udGVudF0ubWF0Y2gocGhvbGRlclJlZ0V4U3BsaXQpXG5cdFx0XHR0ZXh0UGllY2VzID0gbm9kZVt0ZXh0Q29udGVudF0uc3BsaXQocGhvbGRlclJlZ0V4KVxuXG5cdFx0XHRpZiB0ZXh0UGllY2VzLmxlbmd0aCBpcyAzIGFuZCB0ZXh0UGllY2VzWzBdK3RleHRQaWVjZXNbMl0gaXMgJycgIyBUaGUgZW50aXJlIHRleHROb2RlIGlzIGp1c3QgdGhlIHBsYWNlaG9sZGVyXG5cdFx0XHRcdGFkZFRvTm9kZVN0b3JlKG5vZGVTdG9yZSwgbm9kZSwgdGV4dFBpZWNlc1sxXSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0bmV3RnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblxuXHRcdFx0XHRmb3IgdGV4dFBpZWNlLGluZGV4IGluIHRleHRQaWVjZXNcblx0XHRcdFx0XHRuZXdOb2RlID0gbmV3RnJhZ21lbnQuYXBwZW5kQ2hpbGQgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dFBpZWNlKVxuXHRcdFx0XHRcdGlmIGluZGV4ICUgMiAjIGlzIGFuIG9kZCBpbmRleCwgaW5kaWNhdGluZyB0aGF0IGJlZm9yZSB0aGlzIHRleHQgcGllY2Ugc2hvdWxkIGNvbWUgYSBwbGFjZWhvbGRlciBub2RlXG5cdFx0XHRcdFx0XHRhZGRUb05vZGVTdG9yZShub2RlU3RvcmUsIG5ld05vZGUsIHRleHRQaWVjZSlcblxuXHRcdFx0XHRub2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0ZyYWdtZW50LCBub2RlKVxuXG5cdHJldHVyblxuXG5cblxuIiwidGhyb3dFcnJvciA9IChlcnJvck5hbWUpLT5cblx0dGhyb3cgbmV3IEVycm9yICdTaW1wbHlCaW5kOiAnKyhlcnJvcnNbZXJyb3JOYW1lXSBvciBlcnJvck5hbWUpXG5cbnRocm93V2FybmluZyA9ICh3YXJuaW5nTmFtZSwgZGVwdGgpLT4gdW5sZXNzIHNldHRpbmdzLnNpbGVudFxuXHRlcnJTb3VyY2UgPSBnZXRFcnJTb3VyY2UoZGVwdGgpXG5cdHdhcm4gPSBlcnJvcnNbd2FybmluZ05hbWVdXG5cdHdhcm4gKz0gXCJcXG5cXG5cIitlcnJTb3VyY2Vcblx0Y29uc29sZS53YXJuKCdTaW1wbHlCaW5kOiAnK3dhcm4pXG5cdHJldHVyblxuXG50aHJvd0Vycm9yQmFkQXJnID0gKGFyZyktPlxuXHR0aHJvd0Vycm9yIFwiSW52YWxpZCBhcmd1bWVudC9zICgje2FyZ30pXCIsIHRydWVcblx0cmV0dXJuXG5cbmdldEVyclNvdXJjZSA9IChkZXB0aCktPlxuXHQoKG5ldyBFcnJvcikuc3RhY2sgb3IgJycpXG5cdFx0LnNwbGl0KCdcXG4nKVxuXHRcdC5zbGljZShkZXB0aCszKVxuXHRcdC5qb2luKCdcXG4nKVxuXG5cbiIsImVycm9ycyA9IFxuXHRpbnZhbGlkUGFyYW1OYW1lOiBcIlNpbXBseUJpbmQoKSBhbmQgLnRvKCkgb25seSBhY2NlcHQgYSBmdW5jdGlvbiwgYW4gYXJyYXksIGEgYm91bmQgb2JqZWN0LCBhIHN0cmluZywgb3IgYSBudW1iZXIuXCJcblx0Zm5Pbmx5OiBcIk9ubHkgZnVuY3Rpb25zIGFyZSBhbGxvd2VkIGZvciAudHJhbnNmb3JtLy5jb25kaXRpb24vQWxsKClcIlxuXHRiYWRFdmVudEFyZzogXCJJbnZhbGlkIGFyZ3VtZW50IG51bWJlciBpbiAub2ZFdmVudCgpXCJcblx0ZW1wdHlMaXN0OiBcIkVtcHR5IGNvbGxlY3Rpb24gcHJvdmlkZWRcIlxuXHRcblx0b25seU9uZURPTUVsZW1lbnQ6IFwiWW91IGNhbiBvbmx5IHBhc3MgYSBzaW5nbGUgRE9NIGVsZW1lbnQgdG8gYSBiaW5kaW5nXCJcblx0bWl4ZWRFbExpc3Q6IFwiJ2NoZWNrZWQnIG9mIE1peGVkIGxpc3Qgb2YgZWxlbWVudCBjYW5ub3QgYmUgYm91bmRcIlxuIiwiU2ltcGx5QmluZCA9IChzdWJqZWN0LCBvcHRpb25zLCBzYXZlT3B0aW9ucywgaXNTdWIsIGNvbXBsZXRlQ2FsbGJhY2spLT5cblx0aWYgKCFzdWJqZWN0IGFuZCBzdWJqZWN0IGlzbnQgMCkgb3IgKCFjaGVja0lmLmlzU3RyaW5nKHN1YmplY3QpIGFuZCAhY2hlY2tJZi5pc051bWJlcihzdWJqZWN0KSBhbmQgIWNoZWNrSWYuaXNGdW5jdGlvbihzdWJqZWN0KSBhbmQgc3ViamVjdCBub3QgaW5zdGFuY2VvZiBBcnJheSlcblx0XHR0aHJvd0Vycm9yKCdpbnZhbGlkUGFyYW1OYW1lJykgdW5sZXNzIGNoZWNrSWYuaXNCaW5kaW5nSW50ZXJmYWNlKHN1YmplY3QpXG5cblx0aWYgY2hlY2tJZi5pc09iamVjdChzdWJqZWN0KSBhbmQgc3ViamVjdCBub3QgaW5zdGFuY2VvZiBBcnJheSAjIEluZGljYXRlcyBpdCdzIGEgQmluZGluZyBpbnN0YW5jZSBvYmplY3QgZHVlIHRvIHRoZSBhYm92ZSBjaGVja1xuXHRcdGludGVyZmFjZVRvUmV0dXJuID0gaWYgY29tcGxldGVDYWxsYmFjayB0aGVuIGNvbXBsZXRlQ2FsbGJhY2soc3ViamVjdCkgZWxzZSBzdWJqZWN0LnNlbGZDbG9uZSgpXG5cdFxuXHRlbHNlXG5cdFx0bmV3SW50ZXJmYWNlID0gbmV3IEJpbmRpbmdJbnRlcmZhY2Uob3B0aW9ucylcblx0XHRuZXdJbnRlcmZhY2Uuc2F2ZU9wdGlvbnMgPSBzYXZlT3B0aW9uc1xuXHRcdG5ld0ludGVyZmFjZS5pc1N1YiA9IGlzU3ViXG5cdFx0bmV3SW50ZXJmYWNlLmNvbXBsZXRlQ2FsbGJhY2sgPSBjb21wbGV0ZUNhbGxiYWNrXG5cblx0XHRpZiBjaGVja0lmLmlzRnVuY3Rpb24oc3ViamVjdClcblx0XHRcdGludGVyZmFjZVRvUmV0dXJuID0gbmV3SW50ZXJmYWNlLnNldE9iamVjdChzdWJqZWN0LCB0cnVlKVxuXHRcdGVsc2Vcblx0XHRcdGludGVyZmFjZVRvUmV0dXJuID0gbmV3SW50ZXJmYWNlLnNldFByb3BlcnR5KHN1YmplY3QpXG5cblx0cmV0dXJuIGludGVyZmFjZVRvUmV0dXJuXG5cblxuXG5cbmltcG9ydCAnLi9tZXRob2RzJyIsIlNpbXBseUJpbmQudmVyc2lvbiA9IGltcG9ydCAnLi4vLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbidcblNpbXBseUJpbmQuc2V0dGluZ3MgPSBzZXR0aW5nc1xuU2ltcGx5QmluZC5kZWZhdWx0T3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zXG5cblxuXG5TaW1wbHlCaW5kLnVuQmluZEFsbCA9IChvYmplY3QsIGJvdGhXYXlzKS0+XG5cdGlmIG9iamVjdCBhbmQgKGNoZWNrSWYuaXNPYmplY3Qob2JqZWN0KSBvciBjaGVja0lmLmlzRnVuY3Rpb24ob2JqZWN0KSlcblx0XHRpbXBvcnQgJy4vbWV0aG9kcy51bkJpbmRBbGwtcGFyc2VET01PYmplY3QuY29mZmVlJ1xuXHRcdHByb3BNYXAgPSBvYmplY3QuX3NiX21hcFx0XHRcblxuXHRcdGlmIG9iamVjdC5fc2JfSURcblx0XHRcdGJvdW5kSW5zdGFuY2VzW29iamVjdC5fc2JfSURdLnJlbW92ZUFsbFN1YnMoYm90aFdheXMpXG5cdFx0XG5cdFx0aWYgcHJvcE1hcFxuXHRcdFx0Ym91bmRJbnN0YW5jZXNbYm91bmRJRF0ucmVtb3ZlQWxsU3Vicyhib3RoV2F5cykgZm9yIHByb3AsIGJvdW5kSUQgb2YgcHJvcE1hcFxuXG5cdHJldHVyblxuXG4iLCJ7XG4gIFwiX2FyZ3NcIjogW1xuICAgIFtcbiAgICAgIFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRAMS4xNS44XCIsXG4gICAgICBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIlxuICAgIF1cbiAgXSxcbiAgXCJfZnJvbVwiOiBcIkBkYW5pZWxrYWxlbi9zaW1wbHliaW5kQDEuMTUuOFwiLFxuICBcIl9pZFwiOiBcIkBkYW5pZWxrYWxlbi9zaW1wbHliaW5kQDEuMTUuOFwiLFxuICBcIl9pbkJ1bmRsZVwiOiBmYWxzZSxcbiAgXCJfaW50ZWdyaXR5XCI6IFwic2hhNTEyLXJrbCt3SGJiQ29QbzJBM1ZOREF0NXV5VlgrbEJIb2VOWmZEQW9JVk5zbFJFVUFGOVpLa1A2c1lwOXlxRkxOWTNqbXI4bCt5eU1xTUdzeHFCWkd6NTh3PT1cIixcbiAgXCJfbG9jYXRpb25cIjogXCIvQGRhbmllbGthbGVuL3NpbXBseWJpbmRcIixcbiAgXCJfcGhhbnRvbUNoaWxkcmVuXCI6IHt9LFxuICBcIl9yZXF1ZXN0ZWRcIjoge1xuICAgIFwidHlwZVwiOiBcInZlcnNpb25cIixcbiAgICBcInJlZ2lzdHJ5XCI6IHRydWUsXG4gICAgXCJyYXdcIjogXCJAZGFuaWVsa2FsZW4vc2ltcGx5YmluZEAxLjE1LjhcIixcbiAgICBcIm5hbWVcIjogXCJAZGFuaWVsa2FsZW4vc2ltcGx5YmluZFwiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJAZGFuaWVsa2FsZW4lMmZzaW1wbHliaW5kXCIsXG4gICAgXCJzY29wZVwiOiBcIkBkYW5pZWxrYWxlblwiLFxuICAgIFwicmF3U3BlY1wiOiBcIjEuMTUuOFwiLFxuICAgIFwic2F2ZVNwZWNcIjogbnVsbCxcbiAgICBcImZldGNoU3BlY1wiOiBcIjEuMTUuOFwiXG4gIH0sXG4gIFwiX3JlcXVpcmVkQnlcIjogW1xuICAgIFwiL1wiXG4gIF0sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvLS9zaW1wbHliaW5kLTEuMTUuOC50Z3pcIixcbiAgXCJfc3BlY1wiOiBcIjEuMTUuOFwiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcImRhbmllbGthbGVuXCJcbiAgfSxcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGlzdC9zaW1wbHliaW5kLm5vZGUuZGVidWcuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9zaW1wbHliaW5kLmRlYnVnLmpzXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zaW1wbHliaW5kL2lzc3Vlc1wiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHt9LFxuICBcImRlc2NyaXB0aW9uXCI6IFwiTWFnaWNhbGx5IHNpbXBsZSwgZnJhbWV3b3JrLWxlc3Mgb25lLXdheS90d28td2F5IGRhdGEgYmluZGluZyBmb3IgZnJvbnRlbmQvYmFja2VuZCBpbiB+NWtiLlwiLFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY29mZmVlLXNjcmlwdFwiOiBcIl4xLjEyLjZcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4xXCIsXG4gICAgXCJwcm9taXNlLWJyZWFrXCI6IFwiXjAuMS4xXCIsXG4gICAgXCJzZW12ZXJcIjogXCJeNS4zLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuMC1zNFwiLFxuICAgIFwic2ltcGx5d2F0Y2hcIjogXCJeMy4wLjAtbDJcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3NpbXBseWJpbmQjcmVhZG1lXCIsXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwiYmluZFwiLFxuICAgIFwiYmluZGluZ1wiLFxuICAgIFwiZG9tLWJpbmRpbmdcIixcbiAgICBcIm9uZS13YXlcIixcbiAgICBcInR3by13YXlcIlxuICBdLFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9zaW1wbHliaW5kLm5vZGUuZGVidWcuanNcIixcbiAgXCJuYW1lXCI6IFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vc2ltcGx5YmluZC5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYmVuY2htYXJrc1wiOiBcImNha2UgaW5zdGFsbDpiZW5jaDsgbnBtIHJ1biBiZW5jaG1hcmtzOmJ1aWxkICYmIG5wbSBydW4gYmVuY2htYXJrczpzZXJ2ZVwiLFxuICAgIFwiYmVuY2htYXJrczpidWlsZFwiOiBcImJlbmNobWFya3MgYnVpbGQgLXMgYmVuY2htYXJrcy9zcmMgLWQgYmVuY2htYXJrcy9kZXN0XCIsXG4gICAgXCJiZW5jaG1hcmtzOnJ1blwiOiBcImJlbmNobWFya3MgcnVuIC1kIGJlbmNobWFya3MvZGVzdFwiLFxuICAgIFwiYmVuY2htYXJrczpzZXJ2ZVwiOiBcImJlbmNobWFya3Mgc2VydmUgLWQgYmVuY2htYXJrcy9kZXN0XCIsXG4gICAgXCJiZW5jaG1hcmtzOnVwZGF0ZVwiOiBcImNha2UgaW5zdGFsbDpiZW5jaDsgY2FrZSB1cGRhdGVTQkJlbmNoOyBucG0gcnVuIGJlbmNobWFya3M6YnVpbGRcIixcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLi8uY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiaXN0YW5idWwgY292ZXIgLS1kaXIgY292ZXJhZ2Uvbm9kZSBub2RlX21vZHVsZXMvbW9jaGEvYmluL19tb2NoYSAtLSAtdSB0ZGQgLWIgdGVzdC90ZXN0SGVscGVycy5qcyB0ZXN0L3Rlc3QuanNcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBucG0gcnVuIGJlbmNobWFya3M6dXBkYXRlICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJucG0gcnVuIHRlc3RcIixcbiAgICBcInRlc3RcIjogXCJucG0gcnVuIHRlc3Q6bm9kZSAtcyAmJiBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcInRlc3Q6YnJvd3NlclwiOiBcImNha2UgaW5zdGFsbDprYXJtYTsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRWxlY3Ryb24gLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpicm93c2VyOmxvY2FsXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IG9wZW4gdGVzdC90ZXN0cnVubmVyLmh0bWxcIixcbiAgICBcInRlc3Q6a2FybWFcIjogXCJjYWtlIGluc3RhbGw6a2FybWE7IGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6bWluaWZpZWRcIjogXCJtaW5pZmllZD0xIG5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6bm9kZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBtb2NoYSAtdSB0ZGQgLS1jb21waWxlcnMgY29mZmVlOmNvZmZlZS1yZWdpc3RlciB0ZXN0L25vZGUuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOmthcm1hOyBzYXVjZT0xIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcIndhdGNoXCI6IFwiY2FrZSAtZCB3YXRjaFwiXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjE1LjhcIlxufVxuIiwiIyMjKlxuICogQ29uZGl0aW9uYWwgQ2hlY2tzOlxuICpcbiAqIDEpIE1ha2Ugc3VyZSB0aGUgc3ViamVjdCBvYmplY3QgaXMgaXRlcmFibGUgKGFuZCB0aHVzIGEgcG9zc2libGUgY2FuZGlkYXRlIGZvciBiZWluZyBhbiBlbGVtZW50IGNvbGxlY3Rpb24pXG4gKiAyKSBNYWtlIHN1cmUgdGhlIHN1YmplY3Qgb2JqZWN0IGlzbid0IGFuIGFycmF5IGJpbmRpbmcgKHNpbmNlIGVsZW1lbnQgY29sbGVjdGlvbiBvYmplY3RzIGRvbid0IGdldCBkaXJlY3RseSBib3VuZClcbiAqIDMpIE1ha2Ugc3VyZSB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbiBpcyBhIHZhbGlkIG9iamVjdCAoaS5lLiBpc24ndCB1bmRlZmluZWQgYW5kIGlzbid0IG51bGwpXG4gKiA0KSBNYWtlIHN1cmUgdGhlIGZpcnN0IGVsZW1lbnQgaXMgYSBET00gb2JqZWN0XG4jIyNcbmlmIGNoZWNrSWYuaXNJdGVyYWJsZShvYmplY3QpIGFuZCBub3Qgb2JqZWN0Ll9zYl9JRCBhbmQgb2JqZWN0WzBdIGFuZCAoY2hlY2tJZi5pc0RvbShvYmplY3RbMF0pKVxuXHRvYmplY3QgPSBvYmplY3RbMF0iLCJCaW5kaW5nID0gKG9iamVjdCwgdHlwZSwgc3RhdGUpLT5cblx0ZXh0ZW5kU3RhdGUoQCwgc3RhdGUpXG5cdEBvcHRpb25zRGVmYXVsdCA9IGlmIEBzYXZlT3B0aW9ucyB0aGVuIEBvcHRpb25zIGVsc2UgZGVmYXVsdE9wdGlvbnNcblx0QHR5cGUgPSB0eXBlXHRcdFx0XHRcdFx0XHQjIE9iamVjdFByb3AgfCBBcnJheSB8IEZ1bmMgfCBQcm94eSB8IEV2ZW50IHwgUGhvbGRlciB8IERPTUF0dHIgfCBET01DaGVja2JveCB8IERPTVJhZGlvXG5cdEBvYmplY3QgPSBvYmplY3QgXHRcdFx0XHRcdFx0IyBUaGUgc3ViamVjdCBvYmplY3Qgb2YgdGhpcyBiaW5kaW5nLCBpLmUuIGZ1bmN0aW9uLCBhcnJheSwge30sIERPTSBlbCwgZXRjLlxuXHRASUQgPSBnZW5JRCgpIFx0XHRcdFx0XHRcdFx0IyBBc3NpZ25lZCBvbmx5IGFmdGVyIHBhc3NpbmcgYSB2YWxpZCBvYmplY3QgdG8gLm9mKClcblx0QHN1YnMgPSBbXVx0XHRcdFx0XHRcdFx0XHQjIFN1YnNjcmliZXJzIGFycmF5IGxpc3RpbmcgYWxsIG9mIHRoZSBvYmplY3RzIHRoYXQgd2lsbCBiZSB1cGRhdGVkIHVwb24gdmFsdWUgdXBkYXRlXG5cdEBzdWJzTWV0YSA9IGdlbk9iaigpXHRcdFx0XHRcdCMgTWFwIHN1YnNjcmliZXJzJyBJRCB0byB0aGVpciBtZXRhZGF0YSAoaS5lLiBvcHRpb25zLCB0cmFuc2Zvcm0sIGNvbmRpdGlvbiwgb25lLXRpbWUtYmluZGluZywgZXRjLilcblx0QHB1YnNNYXAgPSBnZW5PYmooKVx0XHRcdFx0XHRcdCMgTWFwIHB1Ymxpc2hlcnMgKGJpbmRpbmdzIHRoYXQgdXBkYXRlIHRoaXMgYmluZGluZykgYnkgdGhlaXIgSURcblx0QGF0dGFjaGVkRXZlbnRzID0gW11cdFx0XHRcdFx0IyBBcnJheSBsaXN0aW5nIGFsbCBvZiB0aGUgZXZlbnRzIGN1cnJlbnRseSBsaXN0ZW5lZCBvbiBAb2JqZWN0XG5cdEBzZXRWYWx1ZSA9IHNldFZhbHVlTm9vcCBpZiBAdHlwZSBpcyAnUHJveHknXG5cblx0IyA9PT09IFByb3BlcnRpZXMgZGVjbGFyZWQgbGF0ZXIgb3IgaW5oZXJpdGVkIGZyb20gYmluZGluZyBpbnRlcmZhY2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgQG9wdGlvbnMgPSBvcHRpb25zXG5cdCMgQHZhbHVlID0gdW5kZWZpbmVkIFx0XHRcdFx0XHQjIFdpbGwgcmVwcmVzZW50IHRoZSBhY3R1YWwgY3VycmVudCB2YWx1ZSBvZiB0aGUgYmluZGluZy9vYmplY3Rcblx0IyBAcHJvcGVydHkgPSBwcm9wZXJ0eVx0XHRcdFx0XHQjIFRoZSBwcm9wZXJ0eSBuYW1lIG9yIGFycmF5IGluZGV4IG9yIGV2ZW50IGNhbGxiYWNrIGFyZ3VtZW50XG5cdCMgQHNlbGVjdG9yID0gc2VsZWN0b3JcdFx0XHRcdFx0IyBUaGUgcHJvcGVydHkgbmFtZSBvciBhcnJheSBpbmRleCBvciBldmVudCBjYWxsYmFjayBhcmd1bWVudFxuXHQjIEBvcmlnRm4gPSBGdW5jdGlvblx0XHRcdFx0XHQjIFRoZSBvcmlnaW5hbCBwcm94aWVkIGZ1bmN0aW9uIHBhc3NlZCB0byBQcm94eSBiaW5kaW5nc1xuXHQjIEBjdXN0b21FdmVudE1ldGhvZCA9IHt9XHRcdFx0XHQjIE5hbWVzIG9mIHRoZSBldmVudCBlbWl0dGVyL3RyaWdnZXIgbWV0aG9kcyAoaWYgYXBwbGljYWJsZSlcblx0IyBAcGhvbGRlckNvbnRleHRzID0ge31cdFx0XHRcdFx0IyBQbGFjZWhvbGRlciBzdXJyb3VuZGluZ3MgKG9yaWdpbmFsIGJpbmRpbmcgdmFsdWUgc3BsaXQgYnkgdGhlIHBsYWNlaG9sZGVyIHJlZ0V4KVxuXHQjIEBwaG9sZGVySW5kZXhNYXAgPSB7fVx0XHRcdFx0XHQjIFBsYWNlaG9sZGVyIG9jY3VyZW5jZSBtYXBwaW5nLCBpLmUuIHRoZSBwbGFjZWhvbGRlciBuYW1lIGZvciBlYWNoIHBsYWNlaG9sZGVyIG9jY3VyZW5jZVxuXHQjIEBwbGFjZWhvbGRlciA9IFwiXCJcdFx0XHRcdFx0XHQjIFRoZSBsYXN0IHNwZWNpZmllZCBwbGFjZWhvbGRlciB0byBiaW5kIHRoZSB2YWx1ZSB0b1xuXHQjIEBkZXNjcmlwdG9yID0gW11cdFx0XHRcdFx0XHQjIERlc2NyaWJlcyB0aGUgdHlwZSBvZiBwcm9wZXJ0eSwgaS5lLiAnYXR0cjpkYXRhLW5hbWUnIHRvIGluZGljYXRlIGEgRE9NQXR0ciB0eXBlIGJpbmRpbmdcblx0IyBAaXNMaXZlUHJvcCA9IEJvb2xlYW5cdFx0XHRcdFx0IyBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdGhlIE9iamVjdC9PYmplY3QncyBwcm9wZXR5IGhhdmUgYmVlbiBtb2RpZmllZCB0byBiZSBhIGxpdmUgcHJvcGVydHlcblx0IyBAaXNEb20gPSBCb29sZWFuXHRcdFx0XHRcdFx0IyBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdGhlIGJpbmRpbmcncyBvYmplY3QgaXMgYSBET00gb2JqZWN0XG5cdCMgQHBvbGxJbnRlcnZhbCA9IElEXHRcdFx0XHRcdCMgVGhlIGludGVydmFsIElEIG9mIHRoZSB0aW1lciB0aGF0IG1hbnVhbGx5IHBvbGxzIHRoZSBvYmplY3QncyB2YWx1ZSBhdCBhIHNldCBpbnRlcnZhbFxuXHQjIEBhcnJheUJpbmRpbmcgPSBCaW5kaW5nXHRcdFx0XHQjIFJlZmVyZW5jZSB0byB0aGUgcGFyZW50IGFycmF5IGJpbmRpbmcgKGlmIGV4aXN0cykgZm9yIGFuIGluZGV4LW9mLWFycmF5IGJpbmRpbmcgKGkuZS4gU2ltcGx5QmluZChhcnJheSkpXG5cdCMgQGV2ZW50TmFtZSA9IFwiXCJcdFx0XHRcdFx0XHQjIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0aGlzIGJpbmRpbmcgaXMgbGlzdGVuaW5nIHRvIChmb3IgRXZlbnQgdHlwZSBiaW5kaW5ncylcblx0IyBAaXNFbWl0dGVyID0gQm9vbGVhbiBcdFx0XHRcdFx0IyBUcmFja2VyIHRvIGxldCB1cyBrbm93IHdlIHNob3VsZG4ndCBoYW5kbGUgdGhlIGV2ZW50IHVwZGF0ZSB3ZSByZWNlaXZlZCBhcyBpdCBpcyB0aGUgZXZlbnQgdGhpcyBiaW5kaW5nIGp1c3QgZW1pdHRlZFxuXHQjIEBldmVudEhhbmRsZXIgPSBGdW5jdGlvbiBcdFx0XHRcdCMgVGhlIGNhbGxiYWNrIHRoYXQgZ2V0cyB0cmlnZ2VyZWQgdXBvbiBhbiBldmVudCBlbWl0dGFuY2UgKGZvciBFdmVuIHR5cGUgYmluZGluZ3MpXG5cdCMgQGV2ZW50T2JqZWN0ID0gRXZlbnQgXHRcdFx0XHRcdCMgVGhlIGRpc3BhdGNoZWQgZXZlbnQgb2JqZWN0IChmb3IgRXZlbnQgdHlwZSBiaW5kaW5ncylcblx0IyBAc2VsZlRyYW5zZm9ybSA9IEZ1bmN0aW9uIFx0XHRcdCMgVGhlIHRyYW5zZm9ybSBmdW5jdGlvbiB0aGF0IG5ldyB2YWx1ZXMgYmVpbmcgc2V0IHRvIHRoaXMgYmluZGluZyBhcmUgYmVpbmcgcGFzc2VkIHRocm91Z2ggZHVyaW5nIEBzZXRWYWx1ZSAoaWYgYXBwbGljYWJsZSlcblx0IyBAc2VsZlVwZGF0ZXIgPSBGdW5jdGlvbiBcdFx0XHRcdCMgQSBGdW5jLXR5cGUgQmluZGluZyB3aGljaCBpbnZva2VzIEBzZXRWYWx1ZShAZmV0Y2hEaXJlY3RWYWx1ZSgpKSB1cG9uIGNoYW5nZS4gQ3JlYXRlZCBpbiBAY29udmVydFRvTGl2ZSgpIGZvciBBcnJheSBiaW5kaW5ncyAmIGluIGludGVyZmFjZS51cGRhdGVPbigpXG5cdCMgQGlzQXN5bmMgPSBCb29sZWFuXHRcdFx0XHRcdCMgSW5kaWNhdGVzIGlmIHRoaXMgaXMgYW4gYXN5bmMgYmluZGluZyAoY3VycmVudGx5IG9ubHkgdXNlZCBmb3IgRXZlbnQgYmluZGluZ3MpXG5cdCMjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAjIyNcblxuXHRpZiBAaXNNdWx0aUNob2ljZSAjIFRydWUgaWYgQG9iamVjdCBpcyBhIHJhZGlvL2NoZWNrYm94IGNvbGxlY3Rpb25cblx0XHRAY2hvaWNlcyA9IGdlbk9iaigpXG5cdFx0XG5cdFx0QG9iamVjdC5mb3JFYWNoIChjaG9pY2VFbCk9PlxuXHRcdFx0Y2hvaWNlQmluZGluZyA9IEBjaG9pY2VzW2Nob2ljZUVsLnZhbHVlXSA9IFNpbXBseUJpbmQoJ2NoZWNrZWQnKS5vZihjaG9pY2VFbCkuX1xuXHRcdFx0Y2hvaWNlQmluZGluZy5hZGRTdWIoQClcblx0XHRcdGNob2ljZUJpbmRpbmcuc3Vic01ldGFbQElEXS50cmFuc2Zvcm1GbiA9ICgpLT4gY2hvaWNlQmluZGluZ1xuXHRcdFx0Y2hvaWNlQmluZGluZy5ncm91cEJpbmRpbmcgPSBAXG5cdFx0XHRyZXR1cm5cblx0XG5cblx0dW5sZXNzIEB0eXBlIGlzICdFdmVudCcgb3IgKEB0eXBlIGlzICdGdW5jJyBhbmQgQGlzU3ViKSAjIHRoZSBzZWNvbmQgY29uZGl0aW9uIHdpbGwgcHJldmVudCBmdW5jdGlvbiBzdWJzY3JpYmVycyBmcm9tIGJlaW5nIGludm9rZWQgb24gdGhpcyBiaW5kaW5nIGNyZWF0aW9uXG5cdFx0aWYgQHR5cGUgaXMgJ1Bob2xkZXInXG5cdFx0XHRwYXJlbnRQcm9wZXJ0eSA9IGlmIEBkZXNjcmlwdG9yIGFuZCBub3QgdGFyZ2V0SW5jbHVkZXMoQGRlc2NyaXB0b3IsICdtdWx0aScpIHRoZW4gXCIje0BkZXNjcmlwdG9yfToje0Bwcm9wZXJ0eX1cIiBlbHNlIEBwcm9wZXJ0eVxuXHRcdFx0XG5cdFx0XHRcblx0XHRcdHBhcmVudEJpbmRpbmcgPSBAcGFyZW50QmluZGluZyA9IFNpbXBseUJpbmQocGFyZW50UHJvcGVydHkpLm9mKG9iamVjdCkuX1xuXHRcdFx0cGFyZW50QmluZGluZy5zY2FuRm9yUGhvbGRlcnMoKVxuXHRcdFx0QHZhbHVlID0gcGFyZW50QmluZGluZy5waG9sZGVyVmFsdWVzW0BwaG9sZGVyXVxuXHRcdFxuXHRcdFx0QHRleHROb2RlcyA9IHBhcmVudEJpbmRpbmcudGV4dE5vZGVzW0BwaG9sZGVyXSBpZiBwYXJlbnRCaW5kaW5nLnRleHROb2Rlc1xuXHRcdFxuXG5cdFx0ZWxzZVxuXHRcdFx0QHZhbHVlID0gc3ViamVjdFZhbHVlID0gQGZldGNoRGlyZWN0VmFsdWUoKVxuXHRcdFxuXHRcdFx0aWYgQHR5cGUgaXMgJ09iamVjdFByb3AnIGFuZCBub3QgY2hlY2tJZi5pc0RlZmluZWQoc3ViamVjdFZhbHVlKSBhbmQgbm90IGdldERlc2NyaXB0b3IoQG9iamVjdCwgQHByb3BlcnR5KVxuXHRcdFx0XHRAb2JqZWN0W0Bwcm9wZXJ0eV0gPSBzdWJqZWN0VmFsdWUgIyBEZWZpbmUgdGhlIHByb3Agb24gdGhlIG9iamVjdCBpZiBpdCBub24tZXhpc3RlbnRcblxuXHRcdFx0Y29udmVydFRvTGl2ZShALCBAb2JqZWN0KVxuXG5cblx0QGF0dGFjaEV2ZW50cygpXG5cdHJldHVybiBib3VuZEluc3RhbmNlc1tASURdID0gQFxuXG5cblxuXG5cbmltcG9ydCAnLi9wcm90b3R5cGUnXG4iLCJCaW5kaW5nOjogPVxuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIyBTdWJzY3JpYmVyIE1hbmFnZW1lbnRcblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gXG5cdGFkZFN1YjogKHN1Yiwgb3B0aW9ucywgdXBkYXRlT25jZSwgdXBkYXRlRXZlbklmU2FtZSktPlxuXHRcdGlmIHN1Yi5pc011bHRpXG5cdFx0XHRAYWRkU3ViKHN1Ykl0ZW0sIG9wdGlvbnMsIHVwZGF0ZU9uY2UsIHVwZGF0ZUV2ZW5JZlNhbWUpIGZvciBzdWJJdGVtIGluIHN1Yi5iaW5kaW5nc1xuXHRcdGVsc2Vcblx0XHRcdGlmIG1ldGFEYXRhPUBzdWJzTWV0YVtzdWIuSURdXG5cdFx0XHRcdGFscmVhZHlIYWRTdWIgPSB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHN1Yi5wdWJzTWFwW0BJRF0gPSBAXG5cdFx0XHRcdEBzdWJzLnVuc2hpZnQoc3ViKVxuXHRcdFx0XHRcblx0XHRcdFx0bWV0YURhdGEgPSBAc3Vic01ldGFbc3ViLklEXSA9IGdlbk9iaigpXG5cdFx0XHRcdG1ldGFEYXRhLnVwZGF0ZU9uY2UgPSB1cGRhdGVPbmNlXG5cdFx0XHRcdG1ldGFEYXRhLm9wdHMgPSBjbG9uZU9iamVjdChvcHRpb25zKVxuXHRcdFx0XHRtZXRhRGF0YS5vcHRzLnVwZGF0ZUV2ZW5JZlNhbWUgPSB0cnVlIGlmIHVwZGF0ZUV2ZW5JZlNhbWUgb3IgQHR5cGUgaXMgJ0V2ZW50JyBvciBAdHlwZSBpcyAnUHJveHknIG9yIEB0eXBlIGlzICdBcnJheSdcblx0XHRcdFx0bWV0YURhdGEudmFsdWVSZWYgPSBpZiBzdWIudHlwZSBpcyAnRnVuYycgdGhlbiAndmFsdWVQYXNzZWQnIGVsc2UgJ3ZhbHVlJ1xuXHRcdFx0XG5cdFx0cmV0dXJuIGFscmVhZHlIYWRTdWJcblxuXG5cblx0cmVtb3ZlU3ViOiAoc3ViLCBib3RoV2F5cyktPlxuXHRcdGlmIHN1Yi5pc011bHRpXG5cdFx0XHRAcmVtb3ZlU3ViKHN1Ykl0ZW0sIGJvdGhXYXlzKSBmb3Igc3ViSXRlbSBpbiBzdWIuYmluZGluZ3Ncblx0XHRlbHNlXG5cdFx0XHRpZiBAc3Vic01ldGFbc3ViLklEXVxuXHRcdFx0XHRAc3Vicy5zcGxpY2UoQHN1YnMuaW5kZXhPZihzdWIpLCAxKVxuXHRcdFx0XHRkZWxldGUgQHN1YnNNZXRhW3N1Yi5JRF1cblx0XHRcdFx0ZGVsZXRlIHN1Yi5wdWJzTWFwW0BJRF1cblxuXHRcdFx0aWYgYm90aFdheXNcblx0XHRcdFx0c3ViLnJlbW92ZVN1YihAKVxuXHRcdFx0XHRkZWxldGUgQHB1YnNNYXBbc3ViLklEXVxuXG5cdFx0aWYgQHN1YnMubGVuZ3RoIGlzIDAgYW5kIE9iamVjdC5rZXlzKEBwdWJzTWFwKS5sZW5ndGggaXMgMFxuXHRcdFx0QGRlc3Ryb3koKSAjIFNpbmNlIGl0J3Mgbm8gbG9uZ2VyIGEgc3Vic2NyaWJlciBvciBoYXMgYW55IHN1YnNjcmliZXJzXG5cdFxuXHRcdHJldHVyblxuXG5cdFxuXG5cdHJlbW92ZUFsbFN1YnM6IChib3RoV2F5cyktPlxuXHRcdEByZW1vdmVTdWIoc3ViLCBib3RoV2F5cykgZm9yIHN1YiBpbiBAc3Vicy5zbGljZSgpXG5cdFx0cmV0dXJuXG5cblxuXG5cblx0ZGVzdHJveTogKCktPiAjIFJlc2V0cyBvYmplY3QgdG8gaW5pdGlhbCBzdGF0ZSAocHJlLWJpbmRpbmcgc3RhdGUpXG5cdFx0ZGVsZXRlIGJvdW5kSW5zdGFuY2VzW0BJRF1cblx0XHRAcmVtb3ZlUG9sbEludGVydmFsKClcblx0XHRcblx0XHRpZiBAdHlwZSBpcyAnRXZlbnQnXG5cdFx0XHRAdW5SZWdpc3RlckV2ZW50KGV2ZW50KSBmb3IgZXZlbnQgaW4gQGF0dGFjaGVkRXZlbnRzXG5cdFx0XG5cdFx0ZWxzZSBpZiBAdHlwZSBpcyAnRnVuYydcblx0XHRcdGRlbGV0ZSBAb2JqZWN0Ll9zYl9JRFxuXG5cdFx0IyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuXHRcdGNvbnZlcnRUb1JlZyhALCBAb2JqZWN0KSBpZiBAaXNMaXZlUHJvcCBhbmQgQG9yaWdEZXNjcmlwdG9yXG5cdFx0Y29udmVydFRvUmVnKEAsIEB2YWx1ZSwgdHJ1ZSkgaWYgQHR5cGUgaXMgJ0FycmF5J1xuXHRcdFxuXHRcdGlmIEBvYmplY3QuX3NiX21hcFxuXHRcdFx0ZGVsZXRlIEBvYmplY3QuX3NiX21hcFtAc2VsZWN0b3JdXG5cdFx0XHRkZWxldGUgQG9iamVjdC5fc2JfbWFwIGlmIE9iamVjdC5rZXlzKEBvYmplY3QuX3NiX21hcCkubGVuZ3RoIGlzIDBcblxuXG5cdFx0cmV0dXJuXG5cblxuXG5cblxuXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMjIFZhbHVlIHNldC9nZXRcblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gXG5cdGZldGNoRGlyZWN0VmFsdWU6ICgpLT5cblx0XHR0eXBlID0gQHR5cGVcblx0XHRzd2l0Y2hcblx0XHRcdHdoZW4gdHlwZSBpcyAnRnVuYycgdGhlbiBAb2JqZWN0KClcblx0XHRcdFxuXHRcdFx0d2hlbiB0eXBlIGlzICdET01BdHRyJyB0aGVuIEBvYmplY3QuZ2V0QXR0cmlidXRlKEBwcm9wZXJ0eSkgb3IgJydcblxuXHRcdFx0d2hlbiBAaXNNdWx0aUNob2ljZVxuXHRcdFx0XHRyZXN1bHRzID0gW11cblx0XHRcdFx0Zm9yIGNob2ljZU5hbWUsY2hvaWNlRWwgb2YgQGNob2ljZXNcblx0XHRcdFx0XHRpZiBjaG9pY2VFbC5vYmplY3QuY2hlY2tlZFxuXHRcdFx0XHRcdFx0aWYgdHlwZSBpcyAnRE9NUmFkaW8nXG5cdFx0XHRcdFx0XHRcdHJldHVybiBjaG9pY2VOYW1lXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaCBjaG9pY2VOYW1lXG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcblx0XHRcblx0XHRcdGVsc2UgQG9iamVjdFtAcHJvcGVydHldXG5cdFxuXG5cblxuXHRzZXRWYWx1ZTogKG5ld1ZhbHVlLCBwdWJsaXNoZXIsIGZyb21TZWxmLCBmcm9tQ2hhbmdlRXZlbnQpLT4gIyBmcm9tU2VsZj09PXRydWUgd2hlbiBjYWxsZWQgZnJvbSBldmVudFVwZGF0ZUhhbmRsZXIgb3IgcHJvcGVydHkgZGVzY3JpcHRvciBzZXR0ZXIgKHVubGVzcyBpdCdzIGFuIEFycmF5IGJpbmRpbmcpXG5cdFx0cHVibGlzaGVyIHx8PSBAXG5cdFx0bmV3VmFsdWUgPSBAc2VsZlRyYW5zZm9ybShuZXdWYWx1ZSkgaWYgQHNlbGZUcmFuc2Zvcm1cblx0XHRcblx0XHR1bmxlc3MgZnJvbVNlbGYgdGhlbiBzd2l0Y2ggQHR5cGVcblx0XHRcdHdoZW4gJ09iamVjdFByb3AnXG5cdFx0XHRcdGlmIG5vdCBAaXNMaXZlUHJvcFxuXHRcdFx0XHRcdEBvYmplY3RbQHByb3BlcnR5XSA9IG5ld1ZhbHVlIGlmIG5ld1ZhbHVlIGlzbnQgQHZhbHVlXG5cdFx0XHRcdGltcG9ydElubGluZSAnLi9wcm90b3R5cGUuc2V0VmFsdWUtT2JqZWN0UHJvcC1ET01WYWx1ZSdcblx0XHRcdFx0ZWxzZSBpZiBAb3JpZ1NldHRlclxuXHRcdFx0XHRcdEBvcmlnU2V0dGVyKG5ld1ZhbHVlKVxuXG5cblx0XHRcdHdoZW4gJ1Bob2xkZXInXG5cdFx0XHRcdHBhcmVudCA9IEBwYXJlbnRCaW5kaW5nXG5cdFx0XHRcdHBhcmVudC5waG9sZGVyVmFsdWVzW0BwaG9sZGVyXSA9IG5ld1ZhbHVlXG5cdFx0XHRcdGVudGlyZVZhbHVlID0gYXBwbHlQbGFjZWhvbGRlcnMocGFyZW50LnBob2xkZXJDb250ZXh0cywgcGFyZW50LnBob2xkZXJWYWx1ZXMsIHBhcmVudC5waG9sZGVySW5kZXhNYXApXG5cblx0XHRcdFx0aWYgQHRleHROb2RlcyBhbmQgbmV3VmFsdWUgaXNudCBAdmFsdWVcblx0XHRcdFx0XHRmb3IgdGV4dE5vZGUgaW4gQHRleHROb2Rlc1xuXHRcdFx0XHRcdFx0dGV4dE5vZGVbdGV4dENvbnRlbnRdID0gbmV3VmFsdWVcblx0XHRcdFx0XG5cdFx0XHRcdHBhcmVudC5zZXRWYWx1ZShlbnRpcmVWYWx1ZSwgcHVibGlzaGVyKSB1bmxlc3MgQHByb3BlcnR5IGlzIHRleHRDb250ZW50XG5cdFx0XHRcdFxuXG5cblx0XHRcdHdoZW4gJ0FycmF5J1xuXHRcdFx0XHRpZiBuZXdWYWx1ZSBpc250IEB2YWx1ZVxuXHRcdFx0XHRcdG5ld1ZhbHVlID0gQXJyYXk6OmNvbmNhdChuZXdWYWx1ZSkgaWYgbm90IGNoZWNrSWYuaXNBcnJheShuZXdWYWx1ZSlcblx0XHRcdFx0XHRjb252ZXJ0VG9SZWcoQCwgQHZhbHVlLCB0cnVlKVxuXHRcdFx0XHRcdGNvbnZlcnRUb0xpdmUoQCwgbmV3VmFsdWU9bmV3VmFsdWUuc2xpY2UoKSwgdHJ1ZSlcblx0XHRcdFx0XHRAb3JpZ1NldHRlcihuZXdWYWx1ZSkgaWYgQG9yaWdTZXR0ZXIgIyBXaWxsIHVwZGF0ZSBhbnkgb3RoZXIgcHJldmlvdXMgbm9uLUFycmF5IGJpbmRpbmdzIHRvIHRoZSBzYW1lIG9iamVjdCBwcm9wZXJ0eVxuXG5cblx0XHRcdHdoZW4gJ0Z1bmMnXG5cdFx0XHRcdHByZXZWYWx1ZSA9IEB2YWx1ZVBhc3NlZFxuXHRcdFx0XHRAdmFsdWVQYXNzZWQgPSBuZXdWYWx1ZVxuXHRcdFx0XHRuZXdWYWx1ZSA9IEBvYmplY3QobmV3VmFsdWUsIHByZXZWYWx1ZSlcblxuXHRcdFx0d2hlbiAnRXZlbnQnXG5cdFx0XHRcdEBpc0VtaXR0ZXIgPSB0cnVlXG5cdFx0XHRcdEBlbWl0RXZlbnQobmV3VmFsdWUpXG5cdFx0XHRcdEBpc0VtaXR0ZXIgPSBmYWxzZVxuXHRcdFxuXHRcdFx0aW1wb3J0SW5saW5lICcuL3Byb3RvdHlwZS5zZXRWYWx1ZS1ET01UeXBlcydcblx0XHRcblx0XHRAdmFsdWUgPSBuZXdWYWx1ZVxuXHRcdEB1cGRhdGVBbGxTdWJzKHB1Ymxpc2hlcilcblxuXHRcdHJldHVyblxuXG5cblxuXG5cblx0dXBkYXRlQWxsU3ViczogKHB1Ymxpc2hlciktPiBpZiBpPShhcnI9QHN1YnMpLmxlbmd0aCAjIFVnbHkgc2hvcnRjdXQgZm9yIGluZGV4IGRlZmluaXRpb24gaW4gb3JkZXIgdG8gbGltaXQgbG9naWMgcmVwaXRpaW9uXG5cdFx0QHVwZGF0ZVN1YihhcnJbaV0sIHB1Ymxpc2hlcikgd2hpbGUgaS0tXG5cdFx0cmV0dXJuXG5cblxuXG5cdFx0XHRcblxuXHR1cGRhdGVTdWI6IChzdWIsIHB1Ymxpc2hlciwgaXNEZWxheWVkVXBkYXRlKS0+XG5cdFx0cmV0dXJuIGlmIChwdWJsaXNoZXIgaXMgc3ViKSBvciAocHVibGlzaGVyIGlzbnQgQCBhbmQgcHVibGlzaGVyLnN1YnNNZXRhW3N1Yi5JRF0pICMgaW5kaWNhdGVzIHRoaXMgaXMgYW4gaW5maW5pdGUgbG9vcFxuXHRcdG1ldGEgPSBAc3Vic01ldGFbc3ViLklEXVxuXG5cdFx0aWYgbWV0YS5kaXNhbGxvd0xpc3QgYW5kIG1ldGEuZGlzYWxsb3dMaXN0W3B1Ymxpc2hlci5JRF1cblx0XHRcdHJldHVyblxuXG5cdFx0aWYgbWV0YS5vcHRzLnRocm90dGxlXG5cdFx0XHRjdXJyZW50VGltZSA9ICsobmV3IERhdGUpXG5cdFx0XHR0aW1lUGFzc2VkID0gY3VycmVudFRpbWUgLSBtZXRhLmxhc3RVcGRhdGVcblx0XHRcdFxuXHRcdFx0aWYgdGltZVBhc3NlZCA8IG1ldGEub3B0cy50aHJvdHRsZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQobWV0YS51cGRhdGVUaW1lcilcblx0XHRcdFx0cmV0dXJuIG1ldGEudXBkYXRlVGltZXIgPVxuXHRcdFx0XHRcdHNldFRpbWVvdXQgKCk9PlxuXHRcdFx0XHRcdFx0QHVwZGF0ZVN1YihzdWIsIHB1Ymxpc2hlcikgaWYgQHN1YnNNZXRhW3N1Yi5JRF1cblx0XHRcdFx0XHQsIG1ldGEub3B0cy50aHJvdHRsZS10aW1lUGFzc2VkXG5cdFx0XHRcblx0XHRcdGVsc2Vcblx0XHRcdFx0bWV0YS5sYXN0VXBkYXRlID0gY3VycmVudFRpbWVcblxuXHRcdGVsc2UgaWYgbWV0YS5vcHRzLmRlbGF5IGFuZCBub3QgaXNEZWxheWVkVXBkYXRlXG5cdFx0XHRyZXR1cm4gc2V0VGltZW91dCAoKT0+XG5cdFx0XHRcdEB1cGRhdGVTdWIoc3ViLCBwdWJsaXNoZXIsIHRydWUpIGlmIEBzdWJzTWV0YVtzdWIuSURdXG5cdFx0XHQsIG1ldGEub3B0cy5kZWxheVxuXG5cblx0XHRuZXdWYWx1ZSA9IGlmIEB0eXBlIGlzICdBcnJheScgYW5kIG1ldGEub3B0cy5zZW5kQXJyYXlDb3BpZXMgdGhlbiBAdmFsdWUuc2xpY2UoKSBlbHNlIEB2YWx1ZVxuXHRcdHN1YlZhbHVlID0gc3ViW21ldGEudmFsdWVSZWZdXG5cdFx0bmV3VmFsdWUgPSBpZiB0cmFuc2Zvcm09bWV0YS50cmFuc2Zvcm1GbiB0aGVuIHRyYW5zZm9ybShuZXdWYWx1ZSwgc3ViVmFsdWUsIHN1Yi5vYmplY3QpIGVsc2UgbmV3VmFsdWVcblxuXHRcdHJldHVybiBpZiBuZXdWYWx1ZSBpcyBzdWJWYWx1ZSBhbmQgbm90IG1ldGEub3B0cy51cGRhdGVFdmVuSWZTYW1lIG9yXG5cdFx0XHRtZXRhLmNvbmRpdGlvbkZuIGFuZCBub3QgbWV0YS5jb25kaXRpb25GbihuZXdWYWx1ZSwgc3ViVmFsdWUsIHN1Yi5vYmplY3QpXG5cblx0XHQjIFdoeSBkbyB3ZSBuZWVkIHRoZSAncHJvbWlzZVRyYW5zZm9ybXMnIG9wdGlvbiB3aGVuIHdlIGNhbiBqdXN0IGNoZWNrIGZvciB0aGUgZXhpc3RhbmNlIG9mIC50aGVuIG1ldGhvZD9cblx0XHQjIEJlY2F1c2UgdGVzdHMgc2hvdyB0aGF0IHdoZW4gc2VhcmNoaW5nIGZvciB0aGUgLnRoZW4gcHJvcCBvbiB0aGUgb2JqZWN0IHJlc3VsdHMgaW4gYSBwZXJmb3JtYW5jZSBzbG93ZG93biBvZiB1cCB0byAzMCUhXG5cdFx0IyBDaGVja2luZyBpZiB0aGUgcHJvbWlzZVRyYW5zZm9ybXMgb3B0aW9uIGlzIGVuYWJsZWQgZmlyc3QgZWxpbWluYXRlcyB1bm5lY2Vzc2FyeSBsb29rdXBzICYgc2xvd2Rvd25zLlxuXHRcdGlmIG1ldGEub3B0cy5wcm9taXNlVHJhbnNmb3JtcyBhbmQgbmV3VmFsdWUgYW5kIGNoZWNrSWYuaXNGdW5jdGlvbihuZXdWYWx1ZS50aGVuKVxuXHRcdFx0bmV3VmFsdWUudGhlbiAobmV3VmFsdWUpLT4gc3ViLnNldFZhbHVlKG5ld1ZhbHVlLCBwdWJsaXNoZXIpOyByZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRzdWIuc2V0VmFsdWUobmV3VmFsdWUsIHB1Ymxpc2hlcilcblxuXHRcdEByZW1vdmVTdWIoc3ViKSBpZiBtZXRhLnVwZGF0ZU9uY2Vcblx0XHRyZXR1cm5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIyBUcmFuc2Zvcm1zICYgQ29uZGl0aW9uc1xuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRhZGRNb2RpZmllckZuOiAodGFyZ2V0LCBzdWJJbnRlcmZhY2VzLCBzdWJqZWN0Rm4sIHVwZGF0ZU9uQmluZCktPlxuXHRcdGlmIG5vdCBjaGVja0lmLmlzRnVuY3Rpb24oc3ViamVjdEZuKVxuXHRcdFx0dGhyb3dXYXJuaW5nKCdmbk9ubHknLDIpXG5cblx0XHRlbHNlXG5cdFx0XHRmb3Igc3ViSW50ZXJmYWNlIGluIHN1YkludGVyZmFjZXNcblx0XHRcdFx0c3Vic2NyaWJlciA9IHN1YkludGVyZmFjZS5fIG9yIHN1YkludGVyZmFjZSAjIFNlY29uZCBpcyBjaG9zZW4gd2hlbiB0aGUgcGFzc2VkIHN1YnNjcmliZXIgaW50ZXJmYWNlcyBtdWx0aS1iaW5kaW5nIChpcyBhIHJlY3Vyc2l2ZSBjYWxsIG9mIHRoaXMgbWV0aG9kKVxuXG5cdFx0XHRcdGlmIHN1YnNjcmliZXIuaXNNdWx0aVxuXHRcdFx0XHRcdEBhZGRNb2RpZmllckZuKHRhcmdldCwgc3Vic2NyaWJlci5iaW5kaW5ncywgc3ViamVjdEZuLCB1cGRhdGVPbkJpbmQpXG5cdFx0XHRcdFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c3ViTWV0YURhdGEgPSBAc3Vic01ldGFbc3Vic2NyaWJlci5JRF1cblx0XHRcdFx0XHRzdWJNZXRhRGF0YVt0YXJnZXRdID0gc3ViamVjdEZuXG5cdFx0XHRcdFx0dXBkYXRlT25CaW5kID0gdXBkYXRlT25CaW5kIGFuZCBub3Qgc3ViTWV0YURhdGEudXBkYXRlT25jZVxuXG5cdFx0XHRcdFx0aWYgQHB1YnNNYXBbc3Vic2NyaWJlci5JRF1cblx0XHRcdFx0XHRcdHN1YnNjcmliZXIuc3Vic01ldGFbQElEXVt0YXJnZXRdIHx8PSBzdWJqZWN0Rm4gIyBXaWxsIG5vdCByZXBsYWNlIGV4aXN0aW5nIG1vZGlmaWVyIGZ1bmN0aW9uIGlmIGV4aXN0c1xuXG5cdFx0XHRcdFx0QHVwZGF0ZVN1YihzdWJzY3JpYmVyLCBAKSBpZiAodXBkYXRlT25CaW5kIG9yIEB0eXBlIGlzICdGdW5jJykgYW5kIHRhcmdldCBpcyAndHJhbnNmb3JtRm4nXG5cblx0XHRcdHJldHVybiB0cnVlXG5cblxuXG5cdHNldFNlbGZUcmFuc2Zvcm06ICh0cmFuc2Zvcm1GbiwgdXBkYXRlT25CaW5kKS0+XG5cdFx0QHNlbGZUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1GblxuXHRcdEBzZXRWYWx1ZShAdmFsdWUpIGlmIHVwZGF0ZU9uQmluZFxuXHRcdHJldHVyblxuXG5cblxuXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMjIEFsbG93L0Rpc2FsbG93IHJ1bGVzXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IFxuXHRhZGREaXNhbGxvd1J1bGU6ICh0YXJnZXRTdWIsIHRhcmdldERpc2FsbG93KS0+XG5cdFx0ZGlzYWxsb3dMaXN0ID0gQHN1YnNNZXRhW3RhcmdldFN1Yi5JRF0uZGlzYWxsb3dMaXN0ID89IGdlbk9iaigpXG5cdFx0ZGlzYWxsb3dMaXN0W3RhcmdldERpc2FsbG93LklEXSA9IDFcblx0XHRyZXR1cm5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIyBQbGFjZWhvbGRlcnNcblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gXG5cdHNjYW5Gb3JQaG9sZGVyczogKCktPiB1bmxlc3MgQHBob2xkZXJWYWx1ZXNcblx0XHRAcGhvbGRlclZhbHVlcyA9IGdlbk9iaigpXG5cdFx0QHBob2xkZXJJbmRleE1hcCA9IGdlbk9iaigpXG5cdFx0QHBob2xkZXJDb250ZXh0cyA9IFtdXG5cblx0XHRpZiBjaGVja0lmLmlzU3RyaW5nKEB2YWx1ZSlcblx0XHRcdEBwaG9sZGVyQ29udGV4dHMgPSBAdmFsdWUuc3BsaXQgcGhvbGRlclJlZ0V4U3BsaXRcblx0XHRcdFxuXHRcdFx0aW5kZXggPSAwXG5cdFx0XHRAdmFsdWUgPSBAdmFsdWUucmVwbGFjZSBwaG9sZGVyUmVnRXgsIChlLCBwaG9sZGVyKT0+XG5cdFx0XHRcdEBwaG9sZGVySW5kZXhNYXBbaW5kZXgrK10gPSBwaG9sZGVyXG5cdFx0XHRcdEBwaG9sZGVyVmFsdWVzW3Bob2xkZXJdID0gcGhvbGRlclxuXHRcdFxuXHRcdHNjYW5UZXh0Tm9kZXNQbGFjZWhvbGRlcnMoQG9iamVjdCwgQHRleHROb2Rlcz1nZW5PYmooKSkgaWYgQGlzRG9tIGFuZCBAcHJvcGVydHkgaXMgdGV4dENvbnRlbnRcblx0XHRyZXR1cm5cblx0XG5cblxuXG5cblxuXG5cblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyMgUG9sbGluZ1xuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcblx0YWRkUG9sbEludGVydmFsOiAodGltZSktPiBpZiBAdHlwZSBpc250ICdFdmVudCdcblx0XHRAcmVtb3ZlUG9sbEludGVydmFsKClcblx0XHRcblx0XHRAcG9sbEludGVydmFsID0gc2V0SW50ZXJ2YWwgKCk9PlxuXHRcdFx0cG9sbGVkVmFsdWUgPSBAZmV0Y2hEaXJlY3RWYWx1ZSgpXG5cblx0XHRcdEBzZXRWYWx1ZSBwb2xsZWRWYWx1ZSwgQCwgdHJ1ZVxuXHRcdCwgdGltZVxuXG5cblx0cmVtb3ZlUG9sbEludGVydmFsOiAoKS0+XG5cdFx0Y2xlYXJJbnRlcnZhbChAcG9sbEludGVydmFsKVxuXHRcdEBwb2xsSW50ZXJ2YWwgPSBudWxsXG5cblxuXG5cblxuXG5cblxuXG5cblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyMgRXZlbnRzXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IFxuXHRcblx0YWRkVXBkYXRlTGlzdGVuZXI6IChldmVudE5hbWUsIHRhcmdldFByb3BlcnR5KS0+XG5cdFx0QG9iamVjdC5hZGRFdmVudExpc3RlbmVyIGV2ZW50TmFtZSwgKGV2ZW50KT0+XG5cdFx0XHR1bmxlc3MgZXZlbnQuX3NiXG5cdFx0XHRcdHNob3VsZFJlZGVmaW5lVmFsdWUgPSBAc2VsZlRyYW5zZm9ybSBhbmQgQGlzRG9tSW5wdXRcblx0XHRcdFx0QHNldFZhbHVlKEBvYmplY3RbdGFyZ2V0UHJvcGVydHldLCBudWxsLCAhc2hvdWxkUmVkZWZpbmVWYWx1ZSwgdHJ1ZSlcblxuXHRcdFx0cmV0dXJuXG5cdFx0XG5cdFx0LCBmYWxzZVxuXHRcdHJldHVyblxuXHRcblxuXHRhdHRhY2hFdmVudHM6ICgpLT5cblx0XHRpZiBAZXZlbnROYW1lXG5cdFx0XHRAcmVnaXN0ZXJFdmVudChAZXZlbnROYW1lKVxuXHRcdFxuXHRcdGVsc2UgaWYgQGlzRG9tSW5wdXRcblx0XHRcdEBhZGRVcGRhdGVMaXN0ZW5lcignaW5wdXQnLCAndmFsdWUnKVxuXHRcdFx0QGFkZFVwZGF0ZUxpc3RlbmVyKCdjaGFuZ2UnLCAndmFsdWUnKVxuXG5cdFx0ZWxzZSBpZiBub3QgQGlzTXVsdGlDaG9pY2UgYW5kIChAdHlwZSBpcyAnRE9NUmFkaW8nIG9yIEB0eXBlIGlzICdET01DaGVja2JveCcpXG5cdFx0XHRAYWRkVXBkYXRlTGlzdGVuZXIoJ2NoYW5nZScsICdjaGVja2VkJylcblxuXHRcdHJldHVyblxuXHRcblxuXG5cdHJlZ2lzdGVyRXZlbnQ6IChldmVudE5hbWUpLT5cblx0XHRAYXR0YWNoZWRFdmVudHMucHVzaChldmVudE5hbWUpXG5cdFx0QGV2ZW50SGFuZGxlciA9IGV2ZW50VXBkYXRlSGFuZGxlci5iaW5kKEApIHVubGVzcyBAZXZlbnRIYW5kbGVyXG5cdFx0XG5cdFx0QG9iamVjdFtAZXZlbnRNZXRob2RzLmxpc3Rlbl0oZXZlbnROYW1lLCBAZXZlbnRIYW5kbGVyKVxuXHRcdHJldHVyblxuXG5cblxuXHR1blJlZ2lzdGVyRXZlbnQ6IChldmVudE5hbWUpLT5cblx0XHRAYXR0YWNoZWRFdmVudHMuc3BsaWNlIEBhdHRhY2hlZEV2ZW50cy5pbmRleE9mKGV2ZW50TmFtZSksIDFcblxuXHRcdEBvYmplY3RbQGV2ZW50TWV0aG9kcy5yZW1vdmVdKGV2ZW50TmFtZSwgQGV2ZW50SGFuZGxlcilcblx0XHRyZXR1cm5cblxuXG5cblx0ZW1pdEV2ZW50OiAoZXh0cmFEYXRhKS0+XG5cdFx0ZXZlbnRPYmplY3QgPSBAZXZlbnROYW1lXG5cdFx0XG5cdFx0aWYgQGV2ZW50TWV0aG9kcy5lbWl0IGlzICdkaXNwYXRjaEV2ZW50J1xuXHRcdFx0dW5sZXNzIEBldmVudE9iamVjdFxuXHRcdFx0XHRAZXZlbnRPYmplY3QgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKVxuXHRcdFx0XHRAZXZlbnRPYmplY3QuaW5pdEV2ZW50KEBldmVudE5hbWUsIHRydWUsIHRydWUpXG5cblx0XHRcdEBldmVudE9iamVjdC5iaW5kaW5nRGF0YSA9IGV4dHJhRGF0YVxuXHRcdFx0ZXZlbnRPYmplY3QgPSBAZXZlbnRPYmplY3RcblxuXHRcdEBvYmplY3RbQGV2ZW50TWV0aG9kcy5lbWl0XShldmVudE9iamVjdCwgZXh0cmFEYXRhKVxuXHRcdHJldHVyblxuXG5cblxuXG5ldmVudFVwZGF0ZUhhbmRsZXIgPSAoKS0+IHVubGVzcyBAaXNFbWl0dGVyXG5cdEBzZXRWYWx1ZShhcmd1bWVudHNbQHByb3BlcnR5XSwgbnVsbCwgdHJ1ZSlcblx0cmV0dXJuXG5cblxuXG5cblxuIiwiZWxzZSBpZiBAaXNEb21JbnB1dFxuXHRpZiBub3QgZnJvbUNoYW5nZUV2ZW50XG5cdFx0QG9yaWdTZXR0ZXIobmV3VmFsdWUpXG5cdFx0QG9iamVjdC5kaXNwYXRjaEV2ZW50KGNoYW5nZUV2ZW50KCkpIGlmIHNldHRpbmdzLmRpc3BhdGNoRXZlbnRzXG5cdFxuXHRlbHNlIGlmIG5ld1ZhbHVlIGlzbnQgQG9yaWdHZXR0ZXIoKSAjIElNUExJQ0lUOiBhbmQgZnJvbUNoYW5nZUV2ZW50XG5cdFx0cHJldkN1cnNyb3IgPSBAb2JqZWN0LnNlbGVjdGlvblN0YXJ0XG5cdFx0QG9yaWdTZXR0ZXIobmV3VmFsdWUpXG5cdFx0QG9iamVjdC5zZXRTZWxlY3Rpb25SYW5nZShwcmV2Q3Vyc3JvciwgcHJldkN1cnNyb3IpIGlmIHByZXZDdXJzcm9yIiwid2hlbiAnRE9NUmFkaW8nXG5cdGlmIEBpc011bHRpQ2hvaWNlICMgVGhlIG5ld1ZhbHVlIHZhciB3aWxsIGhvbGQgdGhlIHJhZGlvIGZpZWxkIGJpbmRpbmcgYXMgaXRzIHZhbHVlIGlmIHRoZSB1cGRhdGUgaXMgY29taW5nIGZyb20gdGhlIHJhZGlvIGZpZWxkJ3MgY2hhbmdlIGV2ZW50XG5cdFx0dGFyZ2V0Q2hvaWNlQmluZGluZyA9IGlmIGNoZWNrSWYuaXNCaW5kaW5nKG5ld1ZhbHVlKSB0aGVuIG5ld1ZhbHVlIGVsc2UgQGNob2ljZXNbbmV3VmFsdWVdXG5cblx0XHRpZiB0YXJnZXRDaG9pY2VCaW5kaW5nXG5cdFx0XHRuZXdWYWx1ZSA9IHRhcmdldENob2ljZUJpbmRpbmcub2JqZWN0LnZhbHVlXG5cdFx0XG5cdFx0XHRmb3IgbixjaG9pY2VCaW5kaW5nIG9mIEBjaG9pY2VzXG5cdFx0XHRcdGNob2ljZUJpbmRpbmcuc2V0VmFsdWUoY2hvaWNlQmluZGluZy5JRCBpcyB0YXJnZXRDaG9pY2VCaW5kaW5nLklELCBwdWJsaXNoZXIpXG5cdFx0ZWxzZVxuXHRcdFx0bmV3VmFsdWUgPSBAdmFsdWUgIyBTZXQgdG8gcHJldiB2YWx1ZVxuXHRcblx0ZWxzZVxuXHRcdG5ld1ZhbHVlID0gISFuZXdWYWx1ZSAjIENvbnZlcnQgdG8gQm9vbGVhblxuXHRcdHJldHVybiBpZiBuZXdWYWx1ZSBpcyBAdmFsdWVcblx0XHRAb2JqZWN0LmNoZWNrZWQgPSBuZXdWYWx1ZSB1bmxlc3MgQG9iamVjdC5jaGVja2VkIGlzIG5ld1ZhbHVlXG5cdFx0QG9iamVjdC5kaXNwYXRjaEV2ZW50KGNoYW5nZUV2ZW50KCkpIGlmIG5ld1ZhbHVlIGFuZCBzZXR0aW5ncy5kaXNwYXRjaEV2ZW50cyAjIE9ubHkgZW1pdCBpZiB0aGUgdmFsdWUgaXMgdHJ1ZSAoaW4gb3JkZXIgdG8gY29uZm9ybSB0byB3ZWIgc3RhbmRhcmRzKVxuXG5cbndoZW4gJ0RPTUNoZWNrYm94J1xuXHRpZiBAaXNNdWx0aUNob2ljZSAjIFRoZSBuZXdWYWx1ZSB2YXIgd2lsbCBob2xkIHRoZSBjaGVja2JveCBmaWVsZCBiaW5kaW5nIGFzIGl0cyB2YWx1ZSBpZiB0aGUgdXBkYXRlIGlzIGNvbWluZyBmcm9tIHRoZSBjaGVja2JveCBmaWVsZCdzIGNoYW5nZSBldmVudFxuXHRcdG92ZXJ3cml0ZVByZXZpb3VzID0gbm90IGNoZWNrSWYuaXNCaW5kaW5nKG5ld1ZhbHVlKSAjIE1lYW5zIHRoYXQgYSBuZXcgYXJyYXkgd2FzIHN1cHBsaWVkXG5cdFx0bmV3Q2hvaWNlcyA9IFtdLmNvbmNhdChuZXdWYWx1ZSkgIyBUaGlzICpub3JtYWxpemVzKiB0aGUgbmV3IHZhbHVlIGludG8gYW4gYXJyYXlcblx0XHRcblx0XHRmb3IgdmFsdWUsaW5kZXggaW4gbmV3Q2hvaWNlc1xuXHRcdFx0bmV3Q2hvaWNlc1tpbmRleF0gPSBpZiBjaGVja0lmLmlzQmluZGluZyh2YWx1ZSkgdGhlbiB2YWx1ZSBlbHNlIEBjaG9pY2VzW3ZhbHVlXVxuXHRcdFxuXHRcdG5ld1ZhbHVlQXJyYXkgPSBbXVxuXHRcdGZvciBjaG9pY2VOYW1lLGNob2ljZUJpbmRpbmcgb2YgQGNob2ljZXNcblx0XHRcdGlmIG92ZXJ3cml0ZVByZXZpb3VzXG5cdFx0XHRcdG5ld0Nob2ljZVZhbHVlID0gdGFyZ2V0SW5jbHVkZXMobmV3Q2hvaWNlcywgY2hvaWNlQmluZGluZylcblx0XHRcdGVsc2Vcblx0XHRcdFx0bmV3Q2hvaWNlVmFsdWUgPSBjaG9pY2VCaW5kaW5nLnZhbHVlXG5cdFx0XHRcblx0XHRcdGNob2ljZUJpbmRpbmcuc2V0VmFsdWUobmV3Q2hvaWNlVmFsdWUsIHB1Ymxpc2hlcilcblx0XHRcdG5ld1ZhbHVlQXJyYXkucHVzaChjaG9pY2VOYW1lKSBpZiBuZXdDaG9pY2VWYWx1ZVxuXG5cdFx0bmV3VmFsdWUgPSBuZXdWYWx1ZUFycmF5XG5cblxuXHRlbHNlXG5cdFx0bmV3VmFsdWUgPSAhIW5ld1ZhbHVlICMgQ29udmVydCB0byBCb29sZWFuXG5cdFx0cmV0dXJuIGlmIG5ld1ZhbHVlIGlzIEB2YWx1ZVxuXHRcdHVubGVzcyBAb2JqZWN0LmNoZWNrZWQgaXMgbmV3VmFsdWVcblx0XHRcdEBvYmplY3QuY2hlY2tlZCA9IG5ld1ZhbHVlXG5cdFx0XHRAb2JqZWN0LmRpc3BhdGNoRXZlbnQoY2hhbmdlRXZlbnQoKSkgaWYgc2V0dGluZ3MuZGlzcGF0Y2hFdmVudHNcblxuXG5cbndoZW4gJ0RPTUF0dHInXG5cdEBvYmplY3Quc2V0QXR0cmlidXRlKEBwcm9wZXJ0eSwgbmV3VmFsdWUpXG4iLCIjIyMqXG4gKiBTdGFnZSBkZWZpbml0aW9uczpcbiAqIFxuICogMDogU2VsZWN0aW9uOlx0XHRcdEdvdCBzZWxlY3RvciwgYXdhaXRpbmcgb2JqZWN0LlxuICogMTogSW5kaWNhdGlvbjpcdFx0XHRHb3Qgb2JqZWN0LCBhd2FpdGluZyBwcm94aWVkIHByb3BlcnR5IC8gZnVuY3Rpb24gLyBCaW5kaW5nLW9iamVjdC5cbiAqIDI6IEJpbmRpbmcgQ29tcGxldGU6XHRcdENvbXBsZXRlLCBhd2FpdGluZyBhZGRpdGlvbmFsIChvcHRpb25hbCkgYmluZGluZ3MvbXV0YXRpb25zLlxuIyMjXG5CaW5kaW5nSW50ZXJmYWNlID0gKG9wdGlvbnMsIGluaGVyaXRlZFN0YXRlKS0+XG5cdGlmIGluaGVyaXRlZFN0YXRlXG5cdFx0ZXh0ZW5kU3RhdGUoQCwgaW5oZXJpdGVkU3RhdGUpXG5cdFx0QHN0YWdlID0gMVxuXHRlbHNlXG5cdFx0QHN0YWdlID0gMFxuXHRcdEBzdWJzID0gW11cblx0XHRAb3B0aW9uc1Bhc3NlZCA9IG9wdGlvbnMgfHw9IHt9XG5cdFx0QG9wdGlvbnMgPSB7fVxuXHRcdGZvciBrZXkgb2YgZGVmYXVsdE9wdGlvbnNcblx0XHRcdEBvcHRpb25zW2tleV0gPSBpZiBvcHRpb25zW2tleV0/IHRoZW4gb3B0aW9uc1trZXldIGVsc2UgZGVmYXVsdE9wdGlvbnNba2V5XVxuXHRcblx0cmV0dXJuIEBcdFx0XHRcblx0XG5cblxuXG5pbXBvcnQgJy4vcHJvdG90eXBlLXByaXZhdGUnXG5pbXBvcnQgJy4vcHJvdG90eXBlLXB1YmxpYyciLCJCaW5kaW5nSW50ZXJmYWNlUHJpdmF0ZSA9XG5cdHNlbGZDbG9uZTogKCktPiBuZXcgQmluZGluZ0ludGVyZmFjZShudWxsLCBAKVxuXHRcblx0ZGVmaW5lTWFpblByb3BzOiAoYmluZGluZyktPlxuXHRcdEBfID0gYmluZGluZ1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIEAsXG5cdFx0XHQndmFsdWUnOlx0XHRnZXQ6ICgpLT4gYmluZGluZy52YWx1ZVxuXHRcdFx0J29yaWdpbmFsJzpcdFx0Z2V0OiAoKS0+IGJpbmRpbmcub2JqZWN0cyBvciBiaW5kaW5nLm9iamVjdFxuXHRcdFx0J3N1YnNjcmliZXJzJzpcdGdldDogKCktPiBiaW5kaW5nLnN1YnMuc2xpY2UoKS5tYXAgKHN1YiktPiBzdWIub2JqZWN0XG5cblxuXG5cblx0Y3JlYXRlQmluZGluZzogKHN1YmplY3QsIG5ld09iamVjdFR5cGUsIGJpbmRpbmdJbnRlcmZhY2UsIGlzRnVuY3Rpb24pLT5cblx0XHRAb2JqZWN0ID0gc3ViamVjdFxuXHRcdGNhY2hlZEJpbmRpbmcgPSBjYWNoZS5nZXQoc3ViamVjdCwgaXNGdW5jdGlvbiwgQHNlbGVjdG9yLCBAaXNNdWx0aUNob2ljZSlcblx0XHRcblx0XHRpZiBjYWNoZWRCaW5kaW5nICMgRXhpdCBlYXJseSBieSByZXR1cm5pbmcgdGhlIHN1YmplY3QgZnJvbSBjYWNoZSBpZiBpcyBhbHJlYWR5IGluIHRoZXJlXG5cdFx0XHRyZXR1cm4gQHBhdGNoQ2FjaGVkQmluZGluZyhjYWNoZWRCaW5kaW5nKVxuXG5cdFx0ZWxzZVxuXHRcdFx0bmV3QmluZGluZyA9IG5ldyBCaW5kaW5nKHN1YmplY3QsIG5ld09iamVjdFR5cGUsIGJpbmRpbmdJbnRlcmZhY2UpXG5cdFx0XHRjYWNoZS5zZXQobmV3QmluZGluZywgaXNGdW5jdGlvbilcblx0XHRcdHJldHVybiBuZXdCaW5kaW5nXG5cblxuXG5cdHBhdGNoQ2FjaGVkQmluZGluZzogKGNhY2hlZEJpbmRpbmcpLT5cblx0XHRpZiBjYWNoZWRCaW5kaW5nLnR5cGUgaXMgJ09iamVjdFByb3AnIGFuZCBAcHJvcGVydHkgbm90IG9mIEBvYmplY3QgIyBUaGlzIHByb3BlcnR5IHdhcyBtYW51YWxseSBkZWxldGVkIGFuZCBuZWVkcyBpdHMgcHJvcCB0byBiZSByZS1kZWZpbmVkIGFzIGEgbGl2ZSBvbmVcblx0XHRcdGNvbnZlcnRUb0xpdmUoY2FjaGVkQmluZGluZywgQG9iamVjdClcblxuXHRcdGlmIEBzYXZlT3B0aW9uc1xuXHRcdFx0Y2FjaGVkQmluZGluZy5vcHRpb25zRGVmYXVsdFtvcHRpb25dID0gdmFsdWUgZm9yIG9wdGlvbix2YWx1ZSBvZiBAb3B0aW9uc1Bhc3NlZFxuXG5cdFx0Zm9yIGtleSx2YWx1ZSBvZiBjYWNoZWRCaW5kaW5nLm9wdGlvbnNEZWZhdWx0XG5cdFx0XHRAb3B0aW9uc1trZXldID0gaWYgY2hlY2tJZi5pc0RlZmluZWQoQG9wdGlvbnNQYXNzZWRba2V5XSkgdGhlbiBAb3B0aW9uc1Bhc3NlZFtrZXldIGVsc2UgdmFsdWVcblx0XHRcblx0XHRyZXR1cm4gY2FjaGVkQmluZGluZ1xuXG5cblxuXHRzZXRQcm9wZXJ0eTogKHN1YmplY3QpLT5cblx0XHRzdWJqZWN0ID0gc3ViamVjdC50b1N0cmluZygpIGlmIGNoZWNrSWYuaXNOdW1iZXIoc3ViamVjdClcblx0XHRAc2VsZWN0b3IgPSBAcHJvcGVydHkgPSBzdWJqZWN0XG5cblx0XHRcblx0XHR1bmxlc3MgQG9wdGlvbnMuc2ltcGxlU2VsZWN0b3Jcblx0XHRcdGlmIHRhcmdldEluY2x1ZGVzKHN1YmplY3QsICc6Jylcblx0XHRcdFx0c3BsaXQgPSBzdWJqZWN0LnNwbGl0KCc6Jylcblx0XHRcdFx0QGRlc2NyaXB0b3IgPSBzcGxpdC5zbGljZSgwLCAtMSkuam9pbignOicpXG5cdFx0XHRcdEBwcm9wZXJ0eSA9IHNwbGl0W3NwbGl0Lmxlbmd0aC0xXVxuXHRcdFx0XG5cdFx0XHRcblx0XHRcdGlmIHRhcmdldEluY2x1ZGVzKHN1YmplY3QsICcuJykgIyBQbGFjZWhvbGRlciBleHRyYWN0aW9uXG5cdFx0XHRcdHNwbGl0ID0gQHByb3BlcnR5LnNwbGl0KCcuJykgIyBXZSB1c2UgJ0Bwcm9wZXJ0eScgaW5zdGVhZCBvZiAnc3ViamVjdCcgYmVjYXVzZSBpdCBtYXkgaGF2ZSBiZWVuIG1vZGlmaWVkIGJ5IHRoZSBwcmV2aW91cyAnOicgZGVzY3JpcHRvciBjaGVja1xuXHRcdFx0XHRAcHJvcGVydHkgPSBzcGxpdFswXVx0XHRcdFx0XG5cdFx0XHRcdEBwaG9sZGVyID0gc3BsaXQuc2xpY2UoMSkuam9pbignLicpXG5cblxuXG5cdFx0XHRpZiB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ2V2ZW50Jylcblx0XHRcdFx0aWYgdGFyZ2V0SW5jbHVkZXMoc3ViamVjdCwgJyMnKVxuXHRcdFx0XHRcdHNwbGl0ID0gQHByb3BlcnR5LnNwbGl0KCcjJylcblx0XHRcdFx0XHRAZXZlbnROYW1lID0gc3BsaXRbMF1cblx0XHRcdFx0XHRAcHJvcGVydHkgPSBzcGxpdFsxXVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0QGV2ZW50TmFtZSA9IEBwcm9wZXJ0eVxuXHRcdFx0XHRcdEBwcm9wZXJ0eSA9IDBcblxuXHRcdFx0XHR0aHJvd1dhcm5pbmcoJ2JhZEV2ZW50QXJnJywxKSBpZiBpc05hTiBwYXJzZUludChAcHJvcGVydHkpXG5cblx0XHRyZXR1cm4gQFxuXG5cblxuXHRzZXRPYmplY3Q6IChzdWJqZWN0LCBpc0Z1bmN0aW9uKS0+XG5cdFx0QHN0YWdlID0gMVxuXHRcdGltcG9ydCAnLi9wcm90b3R5cGUtcHJpdmF0ZS5zZXRPYmplY3QtcGFyc2VET01PYmplY3QnXG5cdFx0XG5cdFx0c3dpdGNoXG5cdFx0XHR3aGVuIGlzRnVuY3Rpb25cblx0XHRcdFx0bmV3T2JqZWN0VHlwZSA9ICdGdW5jJ1xuXHRcdFx0XG5cdFx0XHR3aGVuIEBwaG9sZGVyXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnUGhvbGRlcidcblx0XHRcdFxuXHRcdFx0d2hlbiB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ2FycmF5JykgYW5kIGNoZWNrSWYuaXNBcnJheShzdWJqZWN0W0Bwcm9wZXJ0eV0pXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnQXJyYXknXG5cdFx0XHRcblx0XHRcdHdoZW4gdGFyZ2V0SW5jbHVkZXMoQGRlc2NyaXB0b3IsICdldmVudCcpXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnRXZlbnQnXG5cdFx0XHRcdGltcG9ydCAnLi9wcm90b3R5cGUtcHJpdmF0ZS5zZXRPYmplY3QtZGVmaW5lRXZlbnRNZXRob2RzJ1xuXG5cdFx0XHR3aGVuIHRhcmdldEluY2x1ZGVzKEBkZXNjcmlwdG9yLCAnZnVuYycpXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnUHJveHknXG5cdFx0XHRcblx0XHRcdHdoZW4gaXNEb21SYWRpbyBcblx0XHRcdFx0bmV3T2JqZWN0VHlwZSA9ICdET01SYWRpbydcblxuXHRcdFx0d2hlbiBpc0RvbUNoZWNrYm94IFxuXHRcdFx0XHRuZXdPYmplY3RUeXBlID0gJ0RPTUNoZWNrYm94J1xuXG5cdFx0XHR3aGVuIHRhcmdldEluY2x1ZGVzKEBkZXNjcmlwdG9yLCAnYXR0cicpXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnRE9NQXR0cidcblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRuZXdPYmplY3RUeXBlID0gJ09iamVjdFByb3AnXG5cdFx0XG5cblx0XHRpZiB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ211bHRpJylcblx0XHRcdHRocm93RXJyb3IoJ2VtcHR5TGlzdCcpIGlmIG5vdCBzdWJqZWN0Lmxlbmd0aFxuXHRcdFx0QGRlZmluZU1haW5Qcm9wcyBuZXcgR3JvdXBCaW5kaW5nKEAsIHN1YmplY3QsIG5ld09iamVjdFR5cGUpXG5cdFx0ZWxzZVxuXHRcdFx0QGRlZmluZU1haW5Qcm9wcyBAY3JlYXRlQmluZGluZyhzdWJqZWN0LCBuZXdPYmplY3RUeXBlLCBALCBpc0Z1bmN0aW9uKVxuXG5cblx0XHRpZiB0YXJnZXRJbmNsdWRlcyhAXy50eXBlLCAnRXZlbnQnKSBvciB0YXJnZXRJbmNsdWRlcyhAXy50eXBlLCAnUHJveHknKVxuXHRcdFx0QG9wdGlvbnMudXBkYXRlT25CaW5kID0gZmFsc2Vcblx0XHRlbHNlIGlmIHRhcmdldEluY2x1ZGVzKEBfLnR5cGUsICdGdW5jJylcblx0XHRcdEBvcHRpb25zLnVwZGF0ZU9uQmluZCA9IHRydWVcblxuXG5cdFx0aWYgQGNvbXBsZXRlQ2FsbGJhY2tcblx0XHRcdHJldHVybiBAY29tcGxldGVDYWxsYmFjayhAKVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBAXG5cblxuXG5cblx0YWRkVG9QdWJsaXNoZXI6IChwdWJsaXNoZXJJbnRlcmZhY2UpLT5cblx0XHRwdWJsaXNoZXJJbnRlcmZhY2Uuc3RhZ2UgPSAyXG5cdFx0cHVibGlzaGVySW50ZXJmYWNlLnN1YnMucHVzaChAKVxuXHRcdGFscmVhZHlIYWRTdWIgPSBwdWJsaXNoZXJJbnRlcmZhY2UuXy5hZGRTdWIoQF8sIHB1Ymxpc2hlckludGVyZmFjZS5vcHRpb25zLCBwdWJsaXNoZXJJbnRlcmZhY2UudXBkYXRlT25jZSlcblxuXHRcdGlmIHB1Ymxpc2hlckludGVyZmFjZS51cGRhdGVPbmNlXG5cdFx0XHRkZWxldGUgcHVibGlzaGVySW50ZXJmYWNlLnVwZGF0ZU9uY2Vcblx0XHRcblx0XHRlbHNlIGlmIHB1Ymxpc2hlckludGVyZmFjZS5vcHRpb25zLnVwZGF0ZU9uQmluZCBhbmQgbm90IGFscmVhZHlIYWRTdWJcblx0XHRcdGlmIEBfLmlzTXVsdGlcblx0XHRcdFx0cHVibGlzaGVySW50ZXJmYWNlLl8udXBkYXRlU3ViKGJpbmRpbmcsIHB1Ymxpc2hlckludGVyZmFjZS5fKSBmb3IgYmluZGluZyBpbiBAXy5iaW5kaW5nc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwdWJsaXNoZXJJbnRlcmZhY2UuXy51cGRhdGVTdWIoQF8sIHB1Ymxpc2hlckludGVyZmFjZS5fKVxuXG5cdFx0cmV0dXJuXG5cblxuXG5cblxuIiwiaXNJdGVyYWJsZSA9IHN1YmplY3QgaXNudCB3aW5kb3cgYW5kIGNoZWNrSWYuaXNJdGVyYWJsZShzdWJqZWN0KSBhbmQgbm90IHN1YmplY3Qubm9kZVR5cGVcbnNhbXBsZUl0ZW0gPSBpZiBpc0l0ZXJhYmxlIHRoZW4gc3ViamVjdFswXSBlbHNlIHN1YmplY3RcblxuaWYgbm90IHNhbXBsZUl0ZW1cblx0dGhyb3dFcnJvcignZW1wdHlMaXN0JykgaWYgaXNJdGVyYWJsZSBhbmQgY2hlY2tJZi5pc0VsQ29sbGVjdGlvbihzdWJqZWN0KVxuXG5lbHNlIGlmIEBpc0RvbSA9IGNoZWNrSWYuaXNEb20oc2FtcGxlSXRlbSlcblxuXHRpZiBAcHJvcGVydHkgaXMgJ2NoZWNrZWQnXG5cdFx0aXNEb21SYWRpbyA9IHNhbXBsZUl0ZW0gYW5kIGNoZWNrSWYuaXNEb21SYWRpbyhzYW1wbGVJdGVtKVxuXHRcdGlzRG9tQ2hlY2tib3ggPSBub3QgaXNEb21SYWRpbyBhbmQgc2FtcGxlSXRlbSBhbmQgY2hlY2tJZi5pc0RvbUNoZWNrYm94KHNhbXBsZUl0ZW0pXG5cdFxuXHRlbHNlIGlmIEBwcm9wZXJ0eSBpcyAndmFsdWUnXG5cdFx0QGlzRG9tSW5wdXQgPSBjaGVja0lmLmlzRG9tSW5wdXQoc2FtcGxlSXRlbSlcblx0XG5cblx0aWYgaXNJdGVyYWJsZSBhbmQgbm90IHRhcmdldEluY2x1ZGVzKEBkZXNjcmlwdG9yLCAnbXVsdGknKVxuXHRcdGlmIHN1YmplY3QubGVuZ3RoIGlzIDFcblx0XHRcdHN1YmplY3QgPSBzdWJqZWN0WzBdXG5cblx0XHRlbHNlXG5cdFx0XHRpZiAoaXNEb21SYWRpbyBvciBpc0RvbUNoZWNrYm94KSBhbmQgbm90IGNoZWNrSWYuZG9tRWxzQXJlU2FtZShzdWJqZWN0KVxuXHRcdFx0XHRyZXR1cm4gdGhyb3dXYXJuaW5nKCdtaXhlZEVsTGlzdCcsMylcdFx0XHRcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgaXNEb21SYWRpbyBvciBpc0RvbUNoZWNrYm94XG5cdFx0XHRcdFx0QGlzTXVsdGlDaG9pY2UgPSB0cnVlXG5cdFx0XHRcdFx0c3ViamVjdCA9IFtdLnNsaWNlLmNhbGwoc3ViamVjdClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHN1YmplY3QgPSBzdWJqZWN0WzBdXG5cdFx0XHRcdFx0dGhyb3dXYXJuaW5nKCdvbmx5T25lRE9NRWxlbWVudCcsMylcblxuXG5cblxuIiwiQGV2ZW50TWV0aG9kcyA9IGxpc3RlbjpAb3B0aW9uc1Bhc3NlZC5saXN0ZW5NZXRob2QsIHJlbW92ZTpAb3B0aW9uc1Bhc3NlZC5yZW1vdmVNZXRob2QsIGVtaXQ6QG9wdGlvbnNQYXNzZWQuZW1pdE1ldGhvZFxuXG5cblxuaWYgbm90IHN1YmplY3RbQGV2ZW50TWV0aG9kcy5saXN0ZW5dXG5cdEBldmVudE1ldGhvZHMubGlzdGVuID0gaWYgY2hlY2tJZi5pc0RvbU5vZGUoc3ViamVjdCkgdGhlbiAnYWRkRXZlbnRMaXN0ZW5lcicgZWxzZSAnb24nXG5cbmlmIG5vdCBzdWJqZWN0W0BldmVudE1ldGhvZHMucmVtb3ZlXVxuXHRAZXZlbnRNZXRob2RzLnJlbW92ZSA9IGlmIGNoZWNrSWYuaXNEb21Ob2RlKHN1YmplY3QpIHRoZW4gJ3JlbW92ZUV2ZW50TGlzdGVuZXInIGVsc2UgJ3JlbW92ZUxpc3RlbmVyJ1xuXG5pZiBub3Qgc3ViamVjdFtAZXZlbnRNZXRob2RzLmVtaXRdXG5cdEBldmVudE1ldGhvZHMuZW1pdCA9IGlmIGNoZWNrSWYuaXNEb21Ob2RlKHN1YmplY3QpIHRoZW4gJ2Rpc3BhdGNoRXZlbnQnIGVsc2UgJ2VtaXQnIiwiQmluZGluZ0ludGVyZmFjZTo6ID0gT2JqZWN0LmNyZWF0ZSBCaW5kaW5nSW50ZXJmYWNlUHJpdmF0ZSxcblx0b2Y6XHRcdFx0XHRcdGdldDogKCktPiBNRVRIT0Rfb2YgaWYgbm90IEBzdGFnZVx0XHRcdCM9PT0gaWYgc3RhZ2UgaXMgMFxuXHRzZXQ6XHRcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX3NldCBpZiBAc3RhZ2VcdFx0XHRcdCM9PT0gaWYgc3RhZ2UgaXMgMSBvciAyXG5cdGNoYWluVG86XHRcdFx0Z2V0OiAoKS0+IE1FVEhPRF9jaGFpblRvIGlmIEBzdGFnZSBpcyAyXG5cdHRyYW5zZm9ybVNlbGY6XHRcdGdldDogKCktPiBNRVRIT0RfdHJhbnNmb3JtU2VsZiBpZiBAc3RhZ2UgaXMgMVxuXHR0cmFuc2Zvcm06XHRcdFx0Z2V0OiAoKS0+IE1FVEhPRF90cmFuc2Zvcm0gaWYgQHN0YWdlIGlzIDJcblx0dHJhbnNmb3JtQWxsOlx0XHRnZXQ6ICgpLT4gTUVUSE9EX3RyYW5zZm9ybUFsbCBpZiBAc3RhZ2UgaXMgMlxuXHRjb25kaXRpb246XHRcdFx0Z2V0OiAoKS0+IE1FVEhPRF9jb25kaXRpb24gaWYgQHN0YWdlIGlzIDJcblx0Y29uZGl0aW9uQWxsOlx0XHRnZXQ6ICgpLT4gTUVUSE9EX2NvbmRpdGlvbkFsbCBpZiBAc3RhZ2UgaXMgMlxuXHRib3RoV2F5czpcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX2JvdGhXYXlzIGlmIEBzdGFnZSBpcyAyXG5cdHVuQmluZDpcdFx0XHRcdGdldDogKCktPiBNRVRIT0RfdW5CaW5kIGlmIEBzdGFnZSBpcyAyXG5cdHBvbGxFdmVyeTpcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX3BvbGxFdmVyeSBpZiBAc3RhZ2UgIz09PSBpZiBzdGFnZSBpcyAxIG9yIDJcblx0c3RvcFBvbGxpbmc6XHRcdGdldDogKCktPiBNRVRIT0Rfc3RvcFBvbGxpbmcgaWYgQHN0YWdlICM9PT0gaWYgc3RhZ2UgaXMgMSBvciAyXG5cdHNldE9wdGlvbjpcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX3NldE9wdGlvbiBpZiBAc3RhZ2UgaXMgMlxuXHRkaXNhbGxvd0Zyb206XHRcdGdldDogKCktPiBpZiBAc3RhZ2UgaXMgMiBhbmQgKHRoaXNJbnRlcmZhY2U9QClcblx0XHRcdFx0XHRcdFx0Z2VuUHJveGllZEludGVyZmFjZSBmYWxzZSwgKGRpc2FsbG93SW50ZXJmYWNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0c3ViSW50ZXJmYWNlID0gdGhpc0ludGVyZmFjZS5zdWJzW3RoaXNJbnRlcmZhY2Uuc3Vicy5sZW5ndGgtMV1cblx0XHRcdFx0XHRcdFx0XHR0aGlzSW50ZXJmYWNlLl8uYWRkRGlzYWxsb3dSdWxlKHN1YkludGVyZmFjZS5fLCBkaXNhbGxvd0ludGVyZmFjZS5fKVxuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXNJbnRlcmZhY2Vcblx0XG5cdHVwZGF0ZU9uOlx0XHRcdGdldDogKCktPiBpZiBAc3RhZ2UgYW5kICh0aGlzSW50ZXJmYWNlPUApICM9PT0gaWYgc3RhZ2UgaXMgMSBvciAyXG5cdFx0XHRcdFx0XHRcdGdlblByb3hpZWRJbnRlcmZhY2UgZmFsc2UsIChzdWJJbnRlcmZhY2UpLT5cblx0XHRcdFx0XHRcdFx0XHRpZiBzdWJJbnRlcmZhY2UuXyBpc250IHRoaXNJbnRlcmZhY2UuX1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpc0ludGVyZmFjZS5fLnB1YnNNYXBbc3ViSW50ZXJmYWNlLl8uSURdID0gc3ViSW50ZXJmYWNlLl9cblx0XHRcdFx0XHRcdFx0XHRcdHN1YkludGVyZmFjZS5fLmFkZFN1YiBnZW5TZWxmVXBkYXRlcih0aGlzSW50ZXJmYWNlLl8sIHRydWUpLCBzdWJJbnRlcmZhY2Uub3B0aW9ucywgZmFsc2UsIHRydWVcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpc0ludGVyZmFjZVxuXHRcblxuXHRyZW1vdmVVcGRhdGVyOlx0XHRnZXQ6ICgpLT4gaWYgQHN0YWdlIGFuZCAodGhpc0ludGVyZmFjZT1AKSBhbmQgKHNlbGZVcGRhdGVyPUBfLnNlbGZVcGRhdGVyKSAjPT09IGlmIHN0YWdlIGlzIDEgb3IgMlxuXHRcdFx0XHRcdFx0XHRnZW5Qcm94aWVkSW50ZXJmYWNlIGZhbHNlLCAoc3ViSW50ZXJmYWNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0aWYgc3ViSW50ZXJmYWNlLl8uc3Vic01ldGFbc2VsZlVwZGF0ZXIuSURdXG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgdGhpc0ludGVyZmFjZS5fLnB1YnNNYXBbc3ViSW50ZXJmYWNlLl8uSURdXG5cdFx0XHRcdFx0XHRcdFx0XHRzdWJJbnRlcmZhY2UuXy5yZW1vdmVTdWIoc2VsZlVwZGF0ZXIpXG5cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5cblxuXG5cdHRvOlx0XHRcdFx0XHRnZXQ6ICgpLT4gaWYgQHN0YWdlIGlzIDEgYW5kICh0aGlzSW50ZXJmYWNlPUApXG5cdFx0XHRcdFx0XHRcdGdlblByb3hpZWRJbnRlcmZhY2UgdHJ1ZSwgKHN1YkludGVyZmFjZSktPlxuXHRcdFx0XHRcdFx0XHRcdGlmIHN1YkludGVyZmFjZS5fIGlzbnQgdGhpc0ludGVyZmFjZS5fXG5cdFx0XHRcdFx0XHRcdFx0XHRzdWJJbnRlcmZhY2UuYWRkVG9QdWJsaXNoZXIodGhpc0ludGVyZmFjZSlcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpc0ludGVyZmFjZVxuXHRcblxuXHRhbmQ6XHRcdFx0XHRnZXQ6ICgpLT5cblx0XHRcdFx0XHRcdFx0Y2xvbmVJbnRlcmZhY2UgPSBAc2VsZkNsb25lKClcblx0XHRcdFx0XHRcdFx0aWYgQHN0YWdlIGlzIDJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2xvbmVJbnRlcmZhY2Vcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIEBzdGFnZSBpcyAxXG5cdFx0XHRcdFx0XHRcdFx0aWYgbm90IGNsb25lSW50ZXJmYWNlLl8uaXNNdWx0aVxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xvbmVCaW5kaW5nID0gY2xvbmVJbnRlcmZhY2UuX1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2xvbmVJbnRlcmZhY2UuXyA9IGNsb25lSW50ZXJmYWNlLl8gPSBuZXcgR3JvdXBCaW5kaW5nKGNsb25lSW50ZXJmYWNlKVxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xvbmVJbnRlcmZhY2UuXy5hZGRCaW5kaW5nKGNsb25lQmluZGluZylcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZ2VuUHJveGllZEludGVyZmFjZSBmYWxzZSwgKHNpYmxpbmdJbnRlcmZhY2UpLT5cblx0XHRcdFx0XHRcdFx0XHRcdGNsb25lSW50ZXJmYWNlLl8uYWRkQmluZGluZyhzaWJsaW5nSW50ZXJmYWNlLl8pXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2xvbmVJbnRlcmZhY2Vcblx0XG5cblx0b25jZTpcdFx0XHRcdGdldDogKCktPiBpZiBAc3RhZ2UgaXMgMVxuXHRcdFx0XHRcdFx0XHRpbnRlcmZhY2VUb1JldHVybiA9IEBzZWxmQ2xvbmUoKVxuXHRcdFx0XHRcdFx0XHRpbnRlcmZhY2VUb1JldHVybi51cGRhdGVPbmNlID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaW50ZXJmYWNlVG9SZXR1cm5cblxuXHQjID09PT0gQWxpYXNlcyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0dXBkYXRlOlx0XHRcdFx0Z2V0OiAoKS0+IEBzZXRcblx0dHdvV2F5Olx0XHRcdFx0Z2V0OiAoKS0+IEBib3RoV2F5c1xuXHRwaXBlOlx0XHRcdFx0Z2V0OiAoKS0+IEBjaGFpblRvXG5cblxuXG5cbk1FVEhPRF9vZiA9IChvYmplY3QpLT5cblx0dGhyb3dFcnJvckJhZEFyZyhvYmplY3QpIHVubGVzcyBjaGVja0lmLmlzT2JqZWN0KG9iamVjdCkgb3IgY2hlY2tJZi5pc0Z1bmN0aW9uKG9iamVjdClcblx0XG5cdGlmIGNoZWNrSWYuaXNCaW5kaW5nSW50ZXJmYWNlKG9iamVjdClcblx0XHRvYmplY3QgPSBvYmplY3Qub2JqZWN0XG5cblx0QHN0YWdlID0gMVxuXHRyZXR1cm4gQHNldE9iamVjdChvYmplY3QpXG5cblxuXG5cblxuTUVUSE9EX2NoYWluVG8gPSAoc3ViamVjdCwgc3BlY2lmaWNPcHRpb25zLCBzYXZlT3B0aW9ucyktPlxuXHRyZXR1cm4gU2ltcGx5QmluZChAc3Vic1tAc3Vicy5sZW5ndGgtMV0pLnRvKHN1YmplY3QsIHNwZWNpZmljT3B0aW9ucywgc2F2ZU9wdGlvbnMpXG5cblxuXG5cblxuTUVUSE9EX3NldCA9IChuZXdWYWx1ZSktPlxuXHRAXy5zZXRWYWx1ZShuZXdWYWx1ZSlcblx0cmV0dXJuIEBcblxuXG5cblxuXG5cblxuXG5NRVRIT0RfdHJhbnNmb3JtU2VsZiA9ICh0cmFuc2Zvcm1GbiktPiAjIEFwcGxpZWQgb25seSB0byB0aGUgbGFzdCBzdWJcblx0aWYgbm90IGNoZWNrSWYuaXNGdW5jdGlvbih0cmFuc2Zvcm1Gbilcblx0XHR0aHJvd1dhcm5pbmcoJ2ZuT25seScsMSlcblx0ZWxzZVxuXHRcdEBfLnNldFNlbGZUcmFuc2Zvcm0odHJhbnNmb3JtRm4sIEBvcHRpb25zLnVwZGF0ZU9uQmluZClcblx0XHRcblx0cmV0dXJuIEBcblxuXG5NRVRIT0RfdHJhbnNmb3JtID0gKHRyYW5zZm9ybUZuKS0+ICMgQXBwbGllZCBvbmx5IHRvIHRoZSBsYXN0IHN1YlxuXHRAXy5hZGRNb2RpZmllckZuKCd0cmFuc2Zvcm1GbicsIEBzdWJzLnNsaWNlKC0xKSwgdHJhbnNmb3JtRm4sIEBvcHRpb25zLnVwZGF0ZU9uQmluZClcblx0cmV0dXJuIEBcblxuXG5NRVRIT0RfdHJhbnNmb3JtQWxsID0gKHRyYW5zZm9ybUZuKS0+ICMgQXBwbGllZCB0byBlbnRyaWUgc3VicyBzZXRcdFx0XG5cdEBfLmFkZE1vZGlmaWVyRm4oJ3RyYW5zZm9ybUZuJywgQHN1YnMsIHRyYW5zZm9ybUZuLCBAb3B0aW9ucy51cGRhdGVPbkJpbmQpXG5cdHJldHVybiBAXG5cblxuXG5cblxuXG5NRVRIT0RfY29uZGl0aW9uID0gKGNvbmRpdGlvbkZuKS0+ICMgQXBwbGllZCBvbmx5IHRvIHRoZSBsYXN0IHN1YlxuXHRAXy5hZGRNb2RpZmllckZuKCdjb25kaXRpb25GbicsIEBzdWJzLnNsaWNlKC0xKSwgY29uZGl0aW9uRm4pXG5cdHJldHVybiBAXG5cblxuTUVUSE9EX2NvbmRpdGlvbkFsbCA9IChjb25kaXRpb25GbiktPiAjIEFwcGxpZWQgdG8gZW50cmllIHN1YnMgc2V0XG5cdEBfLmFkZE1vZGlmaWVyRm4oJ2NvbmRpdGlvbkZuJywgQHN1YnMsIGNvbmRpdGlvbkZuKVxuXHRyZXR1cm4gQFxuXG5cblxuXG5cblxuXG5NRVRIT0RfYm90aFdheXMgPSAoYWx0VHJhbnNmb3JtKS0+ICMgQXBwbGllZCBvbmx5IHRvIHRoZSBsYXN0IHN1YlxuXHRzdWIgPSBAc3Vic1tAc3Vicy5sZW5ndGgtMV0gIyBMYXN0IFByb3hpZWRcblx0c3ViQmluZGluZyA9IHN1Yi5fXG5cdGJpbmRpbmdzID0gaWYgQF8uaXNNdWx0aSB0aGVuIEBfLmJpbmRpbmdzIGVsc2UgW0BfXVxuXG5cdHN1YkJpbmRpbmcuYWRkU3ViKEBfLCBzdWIub3B0aW9ucylcblx0XG5cdGZvciBiaW5kaW5nIGluIGJpbmRpbmdzXG5cdFx0b3JpZ2luVHJhbnNmb3JtID0gYmluZGluZy5zdWJzTWV0YVtzdWJCaW5kaW5nLklEXS50cmFuc2Zvcm1GblxuXHRcdG9yaWdpbkNvbmRpdGlvbiA9IGJpbmRpbmcuc3Vic01ldGFbc3ViQmluZGluZy5JRF0uY29uZGl0aW9uRm5cblxuXHRcdGlmIG9yaWdpblRyYW5zZm9ybSBvciBhbHRUcmFuc2Zvcm1cblx0XHRcdHRyYW5zZm9ybVRvVXNlID0gaWYgY2hlY2tJZi5pc0Z1bmN0aW9uKGFsdFRyYW5zZm9ybSkgdGhlbiBhbHRUcmFuc2Zvcm0gZWxzZSBvcmlnaW5UcmFuc2Zvcm1cblx0XHRcdHN1YkJpbmRpbmcuc3Vic01ldGFbQF8uSURdLnRyYW5zZm9ybUZuID0gdHJhbnNmb3JtVG9Vc2UgaWYgdHJhbnNmb3JtVG9Vc2UgYW5kIGFsdFRyYW5zZm9ybSBpc250IGZhbHNlXG5cblx0XHRpZiBvcmlnaW5Db25kaXRpb25cblx0XHRcdHN1YkJpbmRpbmcuc3Vic01ldGFbQF8uSURdLmNvbmRpdGlvbkZuID0gb3JpZ2luQ29uZGl0aW9uXG5cblx0cmV0dXJuIEBcblxuXG5cbk1FVEhPRF91bkJpbmQgPSAoYm90aFdheXMpLT4gIyBBcHBsaWVkIHRvIGFsbCBzdWJzXG5cdEBfLnJlbW92ZVN1YihzdWIuXywgYm90aFdheXMpIGZvciBzdWIgaW4gQHN1YnNcblx0cmV0dXJuIEBcblxuXG5cblxuXG5NRVRIT0RfcG9sbEV2ZXJ5ID0gKHRpbWUpLT5cblx0QF8uYWRkUG9sbEludGVydmFsKHRpbWUpXG5cdHJldHVybiBAXG5cblxuXG5NRVRIT0Rfc3RvcFBvbGxpbmcgPSAoKS0+XG5cdEBfLnJlbW92ZVBvbGxJbnRlcnZhbCgpXG5cdHJldHVybiBAXG5cblxuXG5NRVRIT0Rfc2V0T3B0aW9uID0gKG9wdGlvbk5hbWUsIG5ld1ZhbHVlKS0+XG5cdEBfLnN1YnNNZXRhW0BzdWJzW0BzdWJzLmxlbmd0aC0xXS5fLklEXS5vcHRzW29wdGlvbk5hbWVdID0gbmV3VmFsdWVcdFxuXHRyZXR1cm4gQFxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiR3JvdXBCaW5kaW5nID0gKGJpbmRpbmdJbnRlcmZhY2UsIG9iamVjdHMsIG9iamVjdFR5cGUpLT5cblx0YmluZGluZ0ludGVyZmFjZS5zZWxlY3RvciA9IGJpbmRpbmdJbnRlcmZhY2Uuc2VsZWN0b3Iuc2xpY2UoNikgIyBUYWtlIG91dCB0aGUgJ211bHRpOidcblx0ZXh0ZW5kU3RhdGUoQCwgQGludGVyZmFjZSA9IGJpbmRpbmdJbnRlcmZhY2UpXG5cdEBpc011bHRpID0gdHJ1ZVxuXHRAYmluZGluZ3MgPSBiaW5kaW5ncyA9IFtdXG5cblx0aWYgb2JqZWN0c1xuXHRcdEBhZGRCaW5kaW5nKG9iamVjdCwgb2JqZWN0VHlwZSkgZm9yIG9iamVjdCBpbiBvYmplY3RzXG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMgQCxcblx0XHQndHlwZSc6XHRcdFx0XHRnZXQ6ICgpLT4gYmluZGluZ3MubWFwIChiaW5kaW5nKS0+IGJpbmRpbmcudHlwZVxuXHRcdCd2YWx1ZSc6IFx0XHRcdGdldDogKCktPiBiaW5kaW5ncy5tYXAgKGJpbmRpbmcpLT4gYmluZGluZy52YWx1ZVxuXG5cblxuXG5cblxucHJvdG8gPSBHcm91cEJpbmRpbmc6OiA9IE9iamVjdC5jcmVhdGUoQmluZGluZ0ludGVyZmFjZVByaXZhdGUpXG5cbk9iamVjdC5rZXlzKEJpbmRpbmc6OikuZm9yRWFjaCAobWV0aG9kTmFtZSktPlx0XG5cdHByb3RvW21ldGhvZE5hbWVdID0gKGEsYixjLGQpLT4gIyBGb3VyIGFyZ3VtZW50cyBpcyB0aGUgbW9zdCBldmVyIHBhc3NlZCB0byBhbnkgbWV0aG9kIGZyb20gQmluZGluZ0ludGVyZmFjZSBtZXRob2RzXG5cdFx0Zm9yIGJpbmRpbmcgaW4gQGJpbmRpbmdzXG5cdFx0XHRiID0gYmluZGluZyBpZiBtZXRob2ROYW1lIGlzICd1cGRhdGVTdWInXG5cdFx0XHRiaW5kaW5nW21ldGhvZE5hbWVdKGEsYixjLGQpXG5cdFx0XG5cdFx0cmV0dXJuXG5cblxucHJvdG8uYWRkQmluZGluZyA9IChvYmplY3QsIG9iamVjdFR5cGUpLT5cblx0QGJpbmRpbmdzLnB1c2ggaWYgbm90IG9iamVjdFR5cGUgdGhlbiBvYmplY3QgZWxzZSBAY3JlYXRlQmluZGluZyhvYmplY3QsIG9iamVjdFR5cGUsIEBpbnRlcmZhY2UpXG5cdHJldHVybiIsIm1vZHVsZS5leHBvcnRzID0gXG5cdGFueTogLy4vXG5cdHdoaXRlU3BhY2U6IC9cXHMrL1xuXHRudW1lcmljOiAvXlxcZCQvXG5cdGxldHRlcjogL15bYS16QS1aXSQvXG5cdCMgYWxwaGFudW1lcmljOiAvW1xcZGEtekEtWl0vXG5cdHdpZGVudW1lcmljOiAvXlswLTlcXCEjXFwkXFwlXFwqXFwrXFwvXFw9XFw/XFxeXFx7XFx8XFx9XFwoXFwpXFx+XFwtXFwuXSQvXG5cdGFscGhhbnVtZXJpYzogL15bMC05QS1aYS16XFwhI1xcJFxcJVxcJlxcJ1xcKlxcK1xcL1xcPVxcP1xcXlxcX1xcYFxce1xcfFxcfVxcKFxcKVxcflxcLVxcIF0kL1xuXHRlbWFpbDogL15bXFx3XFwtXFwuXStAW1xcd1xcLVxcLl0rXFwuW0EtWmEtel17MiwxMH0kLyIsImltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHtJTVBPUlRBTlR9IGZyb20gJy4vY29uc3RhbnRzJ1xuXG5xdWlja2NzcyA9ICh0YXJnZXRFbCwgcHJvcGVydHksIHZhbHVlLCBpbXBvcnRhbnQpLT5cblx0c3dpdGNoXG5cdFx0d2hlbiBoZWxwZXJzLmlzSXRlcmFibGUodGFyZ2V0RWwpXG5cdFx0XHRxdWlja2NzcyhzdWJFbCwgcHJvcGVydHksIHZhbHVlKSBmb3Igc3ViRWwgaW4gdGFyZ2V0RWxcblx0XG5cdFx0d2hlbiB0eXBlb2YgcHJvcGVydHkgaXMgJ29iamVjdCcgIyBQYXNzZWQgYSBzdHlsZSBtYXBcblx0XHRcdHF1aWNrY3NzKHRhcmdldEVsLCBzdWJQcm9wZXJ0eSwgc3ViVmFsdWUpIGZvciBzdWJQcm9wZXJ0eSxzdWJWYWx1ZSBvZiBwcm9wZXJ0eVxuXHRcblx0XHRlbHNlXG5cdFx0XHRwcm9wZXJ0eSA9IGhlbHBlcnMubm9ybWFsaXplUHJvcGVydHkocHJvcGVydHkpXG5cdFx0XHRpZiB0eXBlb2YgdmFsdWUgaXMgJ3VuZGVmaW5lZCdcblx0XHRcdFx0Y29tcHV0ZWRTdHlsZSA9IHRhcmdldEVsLl9jb21wdXRlZFN0eWxlIHx8PSBnZXRDb21wdXRlZFN0eWxlKHRhcmdldEVsKVxuXHRcdFx0XHRyZXR1cm4gY29tcHV0ZWRTdHlsZVtwcm9wZXJ0eV1cblx0XHRcdFxuXHRcdFx0ZWxzZSBpZiBwcm9wZXJ0eVxuXHRcdFx0XHR0YXJnZXRFbC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wZXJ0eSwgaGVscGVycy5ub3JtYWxpemVWYWx1ZShwcm9wZXJ0eSwgdmFsdWUpLCBJTVBPUlRBTlQgaWYgaW1wb3J0YW50KVxuXG5cdHJldHVyblxuXG5cbnF1aWNrY3NzLmFuaW1hdGlvbiA9IChuYW1lLCBmcmFtZXMpLT4gaWYgbmFtZSBhbmQgdHlwZW9mIG5hbWUgaXMgJ3N0cmluZycgYW5kIGZyYW1lcyBhbmQgdHlwZW9mIGZyYW1lcyBpcyAnb2JqZWN0J1xuXHRwcmVmaXggPSBoZWxwZXJzLmdldFByZWZpeCgnYW5pbWF0aW9uJylcblx0Z2VuZXJhdGVkID0gJydcblx0XG5cdGZvciBmcmFtZSxydWxlcyBvZiBmcmFtZXNcblx0XHRnZW5lcmF0ZWQgKz0gXCIje2ZyYW1lfSB7I3toZWxwZXJzLnJ1bGVUb1N0cmluZyhydWxlcyl9fVwiXG5cblx0Z2VuZXJhdGVkID0gXCJAI3twcmVmaXh9a2V5ZnJhbWVzICN7bmFtZX0geyN7Z2VuZXJhdGVkfX1cIlxuXHRoZWxwZXJzLmlubGluZVN0eWxlKGdlbmVyYXRlZCwgdHJ1ZSwgMClcblxuXG5xdWlja2Nzcy5yZWdpc3RlciA9IChydWxlLCBsZXZlbCwgaW1wb3J0YW50KS0+IGlmIHJ1bGUgYW5kIHR5cGVvZiBydWxlIGlzICdvYmplY3QnXG5cdGxldmVsIHx8PSAwXG5cdHJ1bGUgPSBoZWxwZXJzLnJ1bGVUb1N0cmluZyhydWxlLCBpbXBvcnRhbnQpXG5cblx0dW5sZXNzIGNsYXNzTmFtZSA9IGhlbHBlcnMuaW5saW5lU3R5bGVDb25maWdbbGV2ZWxdP1tydWxlXVxuXHRcdGNsYXNzTmFtZSA9IGhlbHBlcnMuaGFzaChydWxlKVxuXHRcdHN0eWxlID0gXCIuI3tjbGFzc05hbWV9IHsje3J1bGV9fVwiXG5cdFx0aGVscGVycy5pbmxpbmVTdHlsZShzdHlsZSwgY2xhc3NOYW1lLCBsZXZlbClcblxuXHRyZXR1cm4gY2xhc3NOYW1lXG5cblxucXVpY2tjc3MuY2xlYXJSZWdpc3RlcmVkID0gKGxldmVsKS0+XG5cdGhlbHBlcnMuY2xlYXJJbmxpbmVTdHlsZShsZXZlbCBvciAwKVxuXG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcbnF1aWNrY3NzLlVOU0VUID0gc3dpdGNoXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywndW5zZXQnKSB0aGVuICd1bnNldCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbml0aWFsJykgdGhlbiAnaW5pdGlhbCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbmhlcml0JykgdGhlbiAnaW5oZXJpdCdcblxucXVpY2tjc3Muc3VwcG9ydHMgPSBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWRcbnF1aWNrY3NzLnN1cHBvcnRzUHJvcGVydHkgPSBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZFxucXVpY2tjc3Mubm9ybWFsaXplUHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5XG5xdWlja2Nzcy5ub3JtYWxpemVWYWx1ZSA9IGhlbHBlcnMubm9ybWFsaXplVmFsdWVcbnF1aWNrY3NzLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nXG5cblxubW9kdWxlLmV4cG9ydHMgPSBxdWlja2NzcyIsIntcbiAgXCJfZnJvbVwiOiBcInF1aWNrY3NzQGxhdGVzdFwiLFxuICBcIl9pZFwiOiBcInF1aWNrY3NzQDEuNC4xXCIsXG4gIFwiX2luQnVuZGxlXCI6IGZhbHNlLFxuICBcIl9pbnRlZ3JpdHlcIjogXCJzaGE1MTItNVBRVVRQRWkyUWxOMGorUnZVUkJ5L0xjY0FxdzRqeDlrQ1BFaDJQdzhXS3d6eTlBTFVGU0tLRVByT3ViT21sNEVjUEphek83R3liKzVwRU9OcUp3TWc9PVwiLFxuICBcIl9sb2NhdGlvblwiOiBcIi9xdWlja2Nzc1wiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwidGFnXCIsXG4gICAgXCJyZWdpc3RyeVwiOiB0cnVlLFxuICAgIFwicmF3XCI6IFwicXVpY2tjc3NAbGF0ZXN0XCIsXG4gICAgXCJuYW1lXCI6IFwicXVpY2tjc3NcIixcbiAgICBcImVzY2FwZWROYW1lXCI6IFwicXVpY2tjc3NcIixcbiAgICBcInJhd1NwZWNcIjogXCJsYXRlc3RcIixcbiAgICBcInNhdmVTcGVjXCI6IG51bGwsXG4gICAgXCJmZXRjaFNwZWNcIjogXCJsYXRlc3RcIlxuICB9LFxuICBcIl9yZXF1aXJlZEJ5XCI6IFtcbiAgICBcIiNVU0VSXCIsXG4gICAgXCIvXCIsXG4gICAgXCIvcXVpY2tkb21cIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3F1aWNrY3NzLy0vcXVpY2tjc3MtMS40LjEudGd6XCIsXG4gIFwiX3NoYXN1bVwiOiBcIjliMjMxOTA0YWY1YTY4ZjkzNmVlMTE1ZTU0NWIxOGYzYmQzMDg3ODBcIixcbiAgXCJfc3BlY1wiOiBcInF1aWNrY3NzQGxhdGVzdFwiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcImRhbmllbGthbGVuXCJcbiAgfSxcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3F1aWNrY3NzLmRlYnVnLmpzXCIsXG4gICAgXCIuL2Rpc3QvcXVpY2tjc3MuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2Nzcy9pc3N1ZXNcIlxuICB9LFxuICBcImJ1bmRsZURlcGVuZGVuY2llc1wiOiBmYWxzZSxcbiAgXCJkZXByZWNhdGVkXCI6IGZhbHNlLFxuICBcImRlc2NyaXB0aW9uXCI6IFwi4pqh77iPLWZhc3QgdGlueSBDU1MgbWFuYWdlbWVudCB0b29sIHNwcmlua2xlZCB3aXRoIEFQSSBzdWdhclwiLFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAYmFiZWwvY29yZVwiOiBcIl43LjEuNlwiLFxuICAgIFwiQGJhYmVsL3ByZXNldC1lbnZcIjogXCJeNy4xLjZcIixcbiAgICBcImJhYmVsaWZ5XCI6IFwiXjEwLjAuMFwiLFxuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy41LjBcIixcbiAgICBcImNoYWxrXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJjb2ZmZWUtc2NyaXB0XCI6IFwiXjEuMTIuNlwiLFxuICAgIFwiZXhlY2FcIjogXCJeMC43LjBcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4zXCIsXG4gICAgXCJwcm9taXNlLWJyZWFrXCI6IFwiXjAuMS4xXCIsXG4gICAgXCJzZW12ZXJcIjogXCJeNS4zLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuOVwiLFxuICAgIFwic2ltcGx5d2F0Y2hcIjogXCJeMy4wLjBcIlxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJmaWxlc1wiOiBbXG4gICAgXCJkaXN0XCIsXG4gICAgXCJzcmNcIlxuICBdLFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrY3NzI3JlYWRtZVwiLFxuICBcImxpY2Vuc2VcIjogXCJJU0NcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9xdWlja2Nzcy5qc1wiLFxuICBcIm5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2Nzcy5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJjYWtlIC1kIGJ1aWxkICYmIGNha2UgYnVpbGQgJiYgY2FrZSBtZWFzdXJlICYmIGNwIC1yIGJ1aWxkLyogZGlzdC9cIixcbiAgICBcImNvdmVyYWdlXCI6IFwiY2FrZSBpbnN0YWxsOmNvdmVyYWdlOyBucG0gcnVuIGNvdmVyYWdlOnJ1biAmJiBucG0gcnVuIGNvdmVyYWdlOmJhZGdlXCIsXG4gICAgXCJjb3ZlcmFnZTpiYWRnZVwiOiBcImJhZGdlLWdlbiAtZCAuLy5jb25maWcvYmFkZ2VzL2NvdmVyYWdlXCIsXG4gICAgXCJjb3ZlcmFnZTpydW5cIjogXCJjb3ZlcmFnZT10cnVlIG5wbSBydW4gdGVzdDplbGVjdHJvblwiLFxuICAgIFwiY292ZXJhZ2U6c2hvd1wiOiBcIm9wZW4gY292ZXJhZ2UvbGNvdi1yZXBvcnQvaW5kZXguaHRtbFwiLFxuICAgIFwicG9zdHB1Ymxpc2hcIjogXCJnaXQgcHVzaFwiLFxuICAgIFwicG9zdHZlcnNpb25cIjogXCJucG0gcnVuIGJ1aWxkICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJucG0gcnVuIHRlc3Q6dHJhdmlzXCIsXG4gICAgXCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpicm93c2VyXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEVsZWN0cm9uIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6Y2hyb21lXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBDaHJvbWUgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpmaXJlZm94XCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEZpcmVmb3ggLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDprYXJtYVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6bG9jYWxcIjogXCJvcGVuIHRlc3QvdGVzdHJ1bm5lci5odG1sXCIsXG4gICAgXCJ0ZXN0Om1pbmlmaWVkXCI6IFwibWluaWZpZWQ9MSBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OnNhZmFyaVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgU2FmYXJpIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6c2F1Y2VcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBzYXVjZT0xIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6dHJhdmlzXCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgJiYgbnBtIHJ1biB0ZXN0Om1pbmlmaWVkIC1zXCIsXG4gICAgXCJ3YXRjaFwiOiBcImNha2UgLWQgd2F0Y2hcIlxuICB9LFxuICBcInNpbXBseWltcG9ydFwiOiB7XG4gICAgXCJmaW5hbFRyYW5zZm9ybVwiOiBbXG4gICAgICBbXG4gICAgICAgIFwiYmFiZWxpZnlcIixcbiAgICAgICAge1xuICAgICAgICAgIFwicHJlc2V0c1wiOiBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIFwiQGJhYmVsL3ByZXNldC1lbnZcIixcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibW9kdWxlc1wiOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXN1cGVyXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktcmVuYW1lXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc2ltcGxlXCJcbiAgICBdXG4gIH0sXG4gIFwidmVyc2lvblwiOiBcIjEuNC4xXCJcbn1cbiIsImF2YWlsU2V0cyA9IFxuXHRuYXRpdmVzOiBpbXBvcnQgJy4vbmF0aXZlcydcblx0ZG9tOiBpbXBvcnQgJy4vZG9tJ1xuXG5jbGFzcyBDaGVja3Ncblx0Y3JlYXRlOiAoKS0+XG5cdFx0YXJncyA9IEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cykgaWYgYXJndW1lbnRzLmxlbmd0aFxuXHRcdG5ldyBDaGVja3MoYXJncylcblx0XG5cblx0Y29uc3RydWN0b3I6IChzZXRzKS0+XG5cdFx0c2V0cyA/PSBbJ25hdGl2ZXMnXVxuXHRcdFxuXHRcdGZvciBzZXQgaW4gc2V0c1xuXHRcdFx0QGxvYWQoYXZhaWxTZXRzW3NldF0pIGlmIGF2YWlsU2V0c1tzZXRdXG5cblxuXHRsb2FkOiAoc2V0KS0+XG5cdFx0c2V0ID0gYXZhaWxTZXRzW3NldF0gaWYgYXZhaWxTZXRzLm5hdGl2ZXMuc3RyaW5nKHNldClcblx0XHRyZXR1cm4gaWYgbm90IGF2YWlsU2V0cy5uYXRpdmVzLm9iamVjdFBsYWluKHNldClcblx0XHRcblx0XHRmb3Iga2V5LHZhbHVlIG9mIHNldFxuXHRcdFx0QFtrZXldID0gdmFsdWVcblx0XHRcblx0XHRyZXR1cm5cblx0XG5cdFxubW9kdWxlLmV4cG9ydHMgPSBDaGVja3M6OmNyZWF0ZSgpIiwiaXNBcnJheSA9ICh0YXJnZXQpLT5cblx0QXJyYXkuaXNBcnJheSh0YXJnZXQpXG5cbmlzT2JqZWN0ID0gKHRhcmdldCktPlxuXHR0YXJnZXQgYW5kIE9iamVjdDo6dG9TdHJpbmcuY2FsbCh0YXJnZXQpIGlzICdbb2JqZWN0IE9iamVjdF0nIG9yIGlzQXJyYXkodGFyZ2V0KVxuXG5zaG91bGREZWVwRXh0ZW5kID0gKG9wdGlvbnMsIHRhcmdldCwgcGFyZW50S2V5KS0+XG5cdGlmIG9wdGlvbnMuZGVlcFxuXHRcdGlmIG9wdGlvbnMubm90RGVlcCB0aGVuIG5vdCBvcHRpb25zLm5vdERlZXBbdGFyZ2V0XSBlbHNlIHRydWVcblxuXHRlbHNlIGlmIG9wdGlvbnMuZGVlcE9ubHlcblx0XHRvcHRpb25zLmRlZXBPbmx5W3RhcmdldF0gb3IgcGFyZW50S2V5IGFuZCBzaG91bGREZWVwRXh0ZW5kKG9wdGlvbnMsIHBhcmVudEtleSlcblxuXHQjIGVsc2UgZmFsc2VcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZCA9IChvcHRpb25zLCB0YXJnZXQsIHNvdXJjZXMsIHBhcmVudEtleSktPlxuXHR0YXJnZXQgPSB7fSBpZiBub3QgdGFyZ2V0IG9yIHR5cGVvZiB0YXJnZXQgaXNudCAnb2JqZWN0JyBhbmQgdHlwZW9mIHRhcmdldCBpc250ICdmdW5jdGlvbidcblxuXHRmb3Igc291cmNlIGluIHNvdXJjZXMgd2hlbiBzb3VyY2U/XG5cdFx0Zm9yIGtleSBvZiBzb3VyY2Vcblx0XHRcdHNvdXJjZVZhbHVlID0gc291cmNlW2tleV1cblx0XHRcdHRhcmdldFZhbHVlID0gdGFyZ2V0W2tleV1cblx0XHRcdFxuXHRcdFx0Y29udGludWUgaWYgc291cmNlVmFsdWUgaXMgdGFyZ2V0IG9yXG5cdFx0XHRcdFx0XHRzb3VyY2VWYWx1ZSBpcyB1bmRlZmluZWQgb3Jcblx0XHRcdFx0XHRcdChzb3VyY2VWYWx1ZSBpcyBudWxsIGFuZCBub3Qgb3B0aW9ucy5hbGxvd051bGwgYW5kIG5vdCBvcHRpb25zLm51bGxEZWxldGVzKSBvclxuXHRcdFx0XHRcdFx0KG9wdGlvbnMua2V5cyBhbmQgbm90IG9wdGlvbnMua2V5c1trZXldKSBvclxuXHRcdFx0XHRcdFx0KG9wdGlvbnMubm90S2V5cyBhbmQgb3B0aW9ucy5ub3RLZXlzW2tleV0pIG9yXG5cdFx0XHRcdFx0XHQob3B0aW9ucy5vd24gYW5kIG5vdCBzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkgb3Jcblx0XHRcdFx0XHRcdChvcHRpb25zLmdsb2JhbEZpbHRlciBhbmQgbm90IG9wdGlvbnMuZ2xvYmFsRmlsdGVyKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSkpIG9yXG5cdFx0XHRcdFx0XHQob3B0aW9ucy5maWx0ZXJzIGFuZCBvcHRpb25zLmZpbHRlcnNba2V5XSBhbmQgbm90IG9wdGlvbnMuZmlsdGVyc1trZXldKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSkpXG5cdFx0XHRcblx0XHRcdGlmIHNvdXJjZVZhbHVlIGlzIG51bGwgYW5kIG9wdGlvbnMubnVsbERlbGV0ZXNcblx0XHRcdFx0ZGVsZXRlIHRhcmdldFtrZXldXG5cdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRpZiBvcHRpb25zLmdsb2JhbFRyYW5zZm9ybVxuXHRcdFx0XHRzb3VyY2VWYWx1ZSA9IG9wdGlvbnMuZ2xvYmFsVHJhbnNmb3JtKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSlcblx0XHRcdGlmIG9wdGlvbnMudHJhbnNmb3JtcyBhbmQgb3B0aW9ucy50cmFuc2Zvcm1zW2tleV1cblx0XHRcdFx0c291cmNlVmFsdWUgPSBvcHRpb25zLnRyYW5zZm9ybXNba2V5XShzb3VyY2VWYWx1ZSwga2V5LCBzb3VyY2UpXG5cdFxuXHRcdFx0c3dpdGNoXG5cdFx0XHRcdHdoZW4gb3B0aW9ucy5jb25jYXQgYW5kIGlzQXJyYXkoc291cmNlVmFsdWUpIGFuZCBpc0FycmF5KHRhcmdldFZhbHVlKVxuXHRcdFx0XHRcdHRhcmdldFtrZXldID0gdGFyZ2V0VmFsdWUuY29uY2F0KHNvdXJjZVZhbHVlKVxuXHRcdFx0XHRcblx0XHRcdFx0d2hlbiBzaG91bGREZWVwRXh0ZW5kKG9wdGlvbnMsIGtleSwgcGFyZW50S2V5KSBhbmQgaXNPYmplY3Qoc291cmNlVmFsdWUpXG5cdFx0XHRcdFx0c3ViVGFyZ2V0ID0gaWYgaXNPYmplY3QodGFyZ2V0VmFsdWUpIHRoZW4gdGFyZ2V0VmFsdWUgZWxzZSBpZiBpc0FycmF5KHNvdXJjZVZhbHVlKSB0aGVuIFtdIGVsc2Uge31cblx0XHRcdFx0XHR0YXJnZXRba2V5XSA9IGV4dGVuZChvcHRpb25zLCBzdWJUYXJnZXQsIFtzb3VyY2VWYWx1ZV0sIGtleSlcblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGFyZ2V0W2tleV0gPSBzb3VyY2VWYWx1ZVxuXG5cblx0cmV0dXJuIHRhcmdldFxuXG5cblxuXG5cblxuXG4iLCIhKGZ1bmN0aW9uKHdpbikge1xuXG4vKipcbiAqIEZhc3REb21cbiAqXG4gKiBFbGltaW5hdGVzIGxheW91dCB0aHJhc2hpbmdcbiAqIGJ5IGJhdGNoaW5nIERPTSByZWFkL3dyaXRlXG4gKiBpbnRlcmFjdGlvbnMuXG4gKlxuICogQGF1dGhvciBXaWxzb24gUGFnZSA8d2lsc29ucGFnZUBtZS5jb20+XG4gKiBAYXV0aG9yIEtvcm5lbCBMZXNpbnNraSA8a29ybmVsLmxlc2luc2tpQGZ0LmNvbT5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWluaSBsb2dnZXJcbiAqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xudmFyIGRlYnVnID0gMCA/IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSwgJ1tmYXN0ZG9tXScpIDogZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBOb3JtYWxpemVkIHJBRlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xudmFyIHJhZiA9IHdpbi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi5tc1JlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCBmdW5jdGlvbihjYikgeyByZXR1cm4gc2V0VGltZW91dChjYiwgMTYpOyB9O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBgRmFzdERvbWAuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEZhc3REb20oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5yZWFkcyA9IFtdO1xuICBzZWxmLndyaXRlcyA9IFtdO1xuICBzZWxmLnJhZiA9IHJhZi5iaW5kKHdpbik7IC8vIHRlc3QgaG9va1xuICBkZWJ1ZygnaW5pdGlhbGl6ZWQnLCBzZWxmKTtcbn1cblxuRmFzdERvbS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBGYXN0RG9tLFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgam9iIHRvIHRoZSByZWFkIGJhdGNoIGFuZFxuICAgKiBzY2hlZHVsZXMgYSBuZXcgZnJhbWUgaWYgbmVlZCBiZS5cbiAgICpcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIG1lYXN1cmU6IGZ1bmN0aW9uKGZuLCBjdHgpIHtcbiAgICBkZWJ1ZygnbWVhc3VyZScpO1xuICAgIHZhciB0YXNrID0gIWN0eCA/IGZuIDogZm4uYmluZChjdHgpO1xuICAgIHRoaXMucmVhZHMucHVzaCh0YXNrKTtcbiAgICBzY2hlZHVsZUZsdXNoKHRoaXMpO1xuICAgIHJldHVybiB0YXNrO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgam9iIHRvIHRoZVxuICAgKiB3cml0ZSBiYXRjaCBhbmQgc2NoZWR1bGVzXG4gICAqIGEgbmV3IGZyYW1lIGlmIG5lZWQgYmUuXG4gICAqXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICAgKiBAcHVibGljXG4gICAqL1xuICBtdXRhdGU6IGZ1bmN0aW9uKGZuLCBjdHgpIHtcbiAgICBkZWJ1ZygnbXV0YXRlJyk7XG4gICAgdmFyIHRhc2sgPSAhY3R4ID8gZm4gOiBmbi5iaW5kKGN0eCk7XG4gICAgdGhpcy53cml0ZXMucHVzaCh0YXNrKTtcbiAgICBzY2hlZHVsZUZsdXNoKHRoaXMpO1xuICAgIHJldHVybiB0YXNrO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYSBzY2hlZHVsZWQgJ3JlYWQnIG9yICd3cml0ZScgdGFzay5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHRhc2tcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2Vzc1xuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcjogZnVuY3Rpb24odGFzaykge1xuICAgIGRlYnVnKCdjbGVhcicsIHRhc2spO1xuICAgIHJldHVybiByZW1vdmUodGhpcy5yZWFkcywgdGFzaykgfHwgcmVtb3ZlKHRoaXMud3JpdGVzLCB0YXNrKTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIHRoaXMgRmFzdERvbSB3aXRoIHNvbWVcbiAgICogY3VzdG9tIGZ1bmN0aW9uYWxpdHkuXG4gICAqXG4gICAqIEJlY2F1c2UgZmFzdGRvbSBtdXN0ICphbHdheXMqIGJlIGFcbiAgICogc2luZ2xldG9uLCB3ZSdyZSBhY3R1YWxseSBleHRlbmRpbmdcbiAgICogdGhlIGZhc3Rkb20gaW5zdGFuY2UuIFRoaXMgbWVhbnMgdGFza3NcbiAgICogc2NoZWR1bGVkIGJ5IGFuIGV4dGVuc2lvbiBzdGlsbCBlbnRlclxuICAgKiBmYXN0ZG9tJ3MgZ2xvYmFsIHRhc2sgcXVldWUuXG4gICAqXG4gICAqIFRoZSAnc3VwZXInIGluc3RhbmNlIGNhbiBiZSBhY2Nlc3NlZFxuICAgKiBmcm9tIGB0aGlzLmZhc3Rkb21gLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgbXlGYXN0ZG9tID0gZmFzdGRvbS5leHRlbmQoe1xuICAgKiAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgKiAgICAgLy8gcnVucyBvbiBjcmVhdGlvblxuICAgKiAgIH0sXG4gICAqXG4gICAqICAgLy8gb3ZlcnJpZGUgYSBtZXRob2RcbiAgICogICBtZWFzdXJlOiBmdW5jdGlvbihmbikge1xuICAgKiAgICAgLy8gZG8gZXh0cmEgc3R1ZmYgLi4uXG4gICAqXG4gICAqICAgICAvLyB0aGVuIGNhbGwgdGhlIG9yaWdpbmFsXG4gICAqICAgICByZXR1cm4gdGhpcy5mYXN0ZG9tLm1lYXN1cmUoZm4pO1xuICAgKiAgIH0sXG4gICAqXG4gICAqICAgLi4uXG4gICAqIH0pO1xuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHByb3BzICBwcm9wZXJ0aWVzIHRvIG1peGluXG4gICAqIEByZXR1cm4ge0Zhc3REb219XG4gICAqL1xuICBleHRlbmQ6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgZGVidWcoJ2V4dGVuZCcsIHByb3BzKTtcbiAgICBpZiAodHlwZW9mIHByb3BzICE9ICdvYmplY3QnKSB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIG9iamVjdCcpO1xuXG4gICAgdmFyIGNoaWxkID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICBtaXhpbihjaGlsZCwgcHJvcHMpO1xuICAgIGNoaWxkLmZhc3Rkb20gPSB0aGlzO1xuXG4gICAgLy8gcnVuIG9wdGlvbmFsIGNyZWF0aW9uIGhvb2tcbiAgICBpZiAoY2hpbGQuaW5pdGlhbGl6ZSkgY2hpbGQuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIGNoaWxkO1xuICB9LFxuXG4gIC8vIG92ZXJyaWRlIHRoaXMgd2l0aCBhIGZ1bmN0aW9uXG4gIC8vIHRvIHByZXZlbnQgRXJyb3JzIGluIGNvbnNvbGVcbiAgLy8gd2hlbiB0YXNrcyB0aHJvd1xuICBjYXRjaDogbnVsbFxufTtcblxuLyoqXG4gKiBTY2hlZHVsZXMgYSBuZXcgcmVhZC93cml0ZVxuICogYmF0Y2ggaWYgb25lIGlzbid0IHBlbmRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gc2NoZWR1bGVGbHVzaChmYXN0ZG9tKSB7XG4gIGlmICghZmFzdGRvbS5zY2hlZHVsZWQpIHtcbiAgICBmYXN0ZG9tLnNjaGVkdWxlZCA9IHRydWU7XG4gICAgZmFzdGRvbS5yYWYoZmx1c2guYmluZChudWxsLCBmYXN0ZG9tKSk7XG4gICAgZGVidWcoJ2ZsdXNoIHNjaGVkdWxlZCcpO1xuICB9XG59XG5cbi8qKlxuICogUnVucyBxdWV1ZWQgYHJlYWRgIGFuZCBgd3JpdGVgIHRhc2tzLlxuICpcbiAqIEVycm9ycyBhcmUgY2F1Z2h0IGFuZCB0aHJvd24gYnkgZGVmYXVsdC5cbiAqIElmIGEgYC5jYXRjaGAgZnVuY3Rpb24gaGFzIGJlZW4gZGVmaW5lZFxuICogaXQgaXMgY2FsbGVkIGluc3RlYWQuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZmx1c2goZmFzdGRvbSkge1xuICBkZWJ1ZygnZmx1c2gnKTtcblxuICB2YXIgd3JpdGVzID0gZmFzdGRvbS53cml0ZXM7XG4gIHZhciByZWFkcyA9IGZhc3Rkb20ucmVhZHM7XG4gIHZhciBlcnJvcjtcblxuICB0cnkge1xuICAgIGRlYnVnKCdmbHVzaGluZyByZWFkcycsIHJlYWRzLmxlbmd0aCk7XG4gICAgcnVuVGFza3MocmVhZHMpO1xuICAgIGRlYnVnKCdmbHVzaGluZyB3cml0ZXMnLCB3cml0ZXMubGVuZ3RoKTtcbiAgICBydW5UYXNrcyh3cml0ZXMpO1xuICB9IGNhdGNoIChlKSB7IGVycm9yID0gZTsgfVxuXG4gIGZhc3Rkb20uc2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgLy8gSWYgdGhlIGJhdGNoIGVycm9yZWQgd2UgbWF5IHN0aWxsIGhhdmUgdGFza3MgcXVldWVkXG4gIGlmIChyZWFkcy5sZW5ndGggfHwgd3JpdGVzLmxlbmd0aCkgc2NoZWR1bGVGbHVzaChmYXN0ZG9tKTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICBkZWJ1ZygndGFzayBlcnJvcmVkJywgZXJyb3IubWVzc2FnZSk7XG4gICAgaWYgKGZhc3Rkb20uY2F0Y2gpIGZhc3Rkb20uY2F0Y2goZXJyb3IpO1xuICAgIGVsc2UgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBydW4gdGhpcyBpbnNpZGUgYSB0cnkgY2F0Y2hcbiAqIHNvIHRoYXQgaWYgYW55IGpvYnMgZXJyb3IsIHdlXG4gKiBhcmUgYWJsZSB0byByZWNvdmVyIGFuZCBjb250aW51ZVxuICogdG8gZmx1c2ggdGhlIGJhdGNoIHVudGlsIGl0J3MgZW1wdHkuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcnVuVGFza3ModGFza3MpIHtcbiAgZGVidWcoJ3J1biB0YXNrcycpO1xuICB2YXIgdGFzazsgd2hpbGUgKHRhc2sgPSB0YXNrcy5zaGlmdCgpKSB0YXNrKCk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhbiBBcnJheS5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyYXlcbiAqIEBwYXJhbSAgeyp9IGl0ZW1cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZShhcnJheSwgaXRlbSkge1xuICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuICByZXR1cm4gISF+aW5kZXggJiYgISFhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG4vKipcbiAqIE1peGluIG93biBwcm9wZXJ0aWVzIG9mIHNvdXJjZVxuICogb2JqZWN0IGludG8gdGhlIHRhcmdldC5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRhcmdldFxuICogQHBhcmFtICB7T2JqZWN0fSBzb3VyY2VcbiAqL1xuZnVuY3Rpb24gbWl4aW4odGFyZ2V0LCBzb3VyY2UpIHtcbiAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxufVxuXG4vLyBUaGVyZSBzaG91bGQgbmV2ZXIgYmUgbW9yZSB0aGFuXG4vLyBvbmUgaW5zdGFuY2Ugb2YgYEZhc3REb21gIGluIGFuIGFwcFxudmFyIGV4cG9ydHMgPSB3aW4uZmFzdGRvbSA9ICh3aW4uZmFzdGRvbSB8fCBuZXcgRmFzdERvbSgpKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbi8vIEV4cG9zZSB0byBDSlMgJiBBTURcbmlmICgodHlwZW9mIGRlZmluZSkgPT0gJ2Z1bmN0aW9uJykgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gZXhwb3J0czsgfSk7XG5lbHNlIGlmICgodHlwZW9mIG1vZHVsZSkgPT0gJ29iamVjdCcpIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcblxufSkoIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdGhpcyk7XG4iLCJJUyA9IGltcG9ydCAnLi4vY2hlY2tzJ1xuU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5cblxuY2xhc3MgQ29uZGl0aW9uXG5cdGNvbnN0cnVjdG9yOiAoQGZpZWxkLCBAc2V0dGluZ3MsIEBjYWxsYmFjayktPlxuXHRcdEBzYXRpc2ZpZWQgPSBmYWxzZVxuXHRcdEB2YWx1ZSA9IEBzZXR0aW5ncy52YWx1ZVxuXHRcdEBwcm9wZXJ0eSA9IEBzZXR0aW5ncy5wcm9wZXJ0eSBvciAnX3ZhbHVlJ1xuXHRcdEBwcm9wZXJ0eSA9ICdfdmFsdWUnIGlmIEBzZXR0aW5ncy5wcm9wZXJ0eSBpcyAndmFsdWUnXG5cdFx0dGFyZ2V0ID0gQGZpZWxkLmFsbEZpZWxkc1tAc2V0dGluZ3MudGFyZ2V0XSBvciBAc2V0dGluZ3MudGFyZ2V0XHRcblx0XHRcblx0XHRpZiBJUy5maWVsZCh0YXJnZXQpXG5cdFx0XHRAdGFyZ2V0ID0gdGFyZ2V0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGNvbnNvbGUud2FybihcImNvbmRpdGlvbiB0YXJnZXQgbm90IGZvdW5kIGZvciB0aGUgcHJvdmlkZWQgSUQgJyN7QHNldHRpbmdzLnRhcmdldH0nXCIsIEBmaWVsZClcblxuXHRcdHByb3BlcnR5ID0gaWYgSVMuYXJyYXkoQHRhcmdldFtAcHJvcGVydHldKSB0aGVuIFwiYXJyYXk6I3tAcHJvcGVydHl9XCIgZWxzZSBAcHJvcGVydHlcblxuXHRcdFNpbXBseUJpbmQocHJvcGVydHksIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHRhcmdldClcblx0XHRcdC5hbmQoJ3Zpc2libGUnKS5vZihAdGFyZ2V0LnN0YXRlKVxuXHRcdFx0XHQudG8oQGNhbGxiYWNrKVxuXG5cdFx0U2ltcGx5QmluZCgnc2F0aXNmaWVkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0LnRvIChuZXdWYWx1ZSwgb2xkVmFsdWUpPT4gQGZpZWxkLmVtaXQ/KCdjb25kaXRpb25DaGFuZ2UnLCBAKSBpZiBvbGRWYWx1ZT9cblxuXG5cdHRlc3Q6ICgpLT5cblx0XHRpZiBub3QgQHRhcmdldD8uc3RhdGUudmlzaWJsZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRjb21wYXJpc29uID0gc3dpdGNoXG5cdFx0XHR3aGVuIElTLm9iamVjdFBsYWluKEB2YWx1ZSkgdGhlbiBAdmFsdWVcblx0XHRcdHdoZW4gSVMucmVnZXgoQHZhbHVlKSB0aGVuICckcmVnZXgnOkB2YWx1ZVxuXHRcdFx0d2hlbiBAdmFsdWUgaXMgJ3ZhbGlkJyBhbmQgbm90IEBzZXR0aW5ncy5wcm9wZXJ0eSBvciBub3QgSVMuZGVmaW5lZChAdmFsdWUpIHRoZW4gJ3ZhbGlkJ1xuXHRcdFx0ZWxzZSAnJGVxJzpAdmFsdWVcblxuXHRcdGlmIGNvbXBhcmlzb24gaXMgJ3ZhbGlkJ1xuXHRcdFx0cmV0dXJuIEB0YXJnZXQudmFsaWRhdGUoKVxuXHRcdFxuXHRcdHRhcmdldFZhbHVlID0gZG8gKCk9PlxuXHRcdFx0cmV0dXJuIEB0YXJnZXQudmFsdWUgaWYgQHByb3BlcnR5IGlzICdfdmFsdWUnXG5cdFx0XHRwcm9wZXJ0eUNoYWluID0gQHByb3BlcnR5LnNwbGl0KCcuJylcblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIHByb3BlcnR5Q2hhaW4ubGVuZ3RoIGlzIDFcblx0XHRcdFx0XHRAdGFyZ2V0W0Bwcm9wZXJ0eV1cblxuXHRcdFx0XHR3aGVuIElTLmRlZmluZWQoQHRhcmdldFtAcHJvcGVydHldKVxuXHRcdFx0XHRcdEB0YXJnZXRbQHByb3BlcnR5XVxuXHRcdFx0XHRcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG5lc3RlZE9iamVjdCA9IEB0YXJnZXRcblx0XHRcdFx0XHR3aGlsZSBJUy5vYmplY3QobmVzdGVkT2JqZWN0KVxuXHRcdFx0XHRcdFx0bmVzdGVkT2JqZWN0ID0gbmVzdGVkT2JqZWN0W3Byb3BlcnR5Q2hhaW4ucG9wKCldXG5cblx0XHRcdFx0XHRyZXR1cm4gbmVzdGVkT2JqZWN0XG5cblx0XHRjb21wYXJpc29uT3BlcmF0b3JzID0gT2JqZWN0LmtleXMoY29tcGFyaXNvbilcblx0XHRwYXNzZWRDb21wYXJpc29ucyA9IGNvbXBhcmlzb25PcGVyYXRvcnMuZmlsdGVyIChvcGVyYXRvciktPlxuXHRcdFx0c2Vla2VkVmFsdWUgPSBjb21wYXJpc29uW29wZXJhdG9yXVxuXHRcdFx0c3dpdGNoIG9wZXJhdG9yXG5cdFx0XHRcdHdoZW4gJyRlcSdcdFx0dGhlbiB0YXJnZXRWYWx1ZSBpcyBzZWVrZWRWYWx1ZSBcblx0XHRcdFx0d2hlbiAnJG5lJ1x0XHR0aGVuIHRhcmdldFZhbHVlIGlzbnQgc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGd0J1x0XHR0aGVuIHRhcmdldFZhbHVlID4gc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGd0ZSdcdFx0dGhlbiB0YXJnZXRWYWx1ZSA+PSBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckbHQnXHRcdHRoZW4gdGFyZ2V0VmFsdWUgPCBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckbHRlJ1x0XHR0aGVuIHRhcmdldFZhbHVlIDw9IHNlZWtlZFZhbHVlXG5cdFx0XHRcdHdoZW4gJyRjdCdcdFx0dGhlbiBoZWxwZXJzLmluY2x1ZGVzKHRhcmdldFZhbHVlLCBzZWVrZWRWYWx1ZSlcblx0XHRcdFx0d2hlbiAnJG5jdCdcdFx0dGhlbiBub3QgaGVscGVycy5pbmNsdWRlcyh0YXJnZXRWYWx1ZSwgc2Vla2VkVmFsdWUpXG5cdFx0XHRcdHdoZW4gJyRyZWdleCdcdHRoZW4gc2Vla2VkVmFsdWUudGVzdCh0YXJnZXRWYWx1ZSlcblx0XHRcdFx0d2hlbiAnJG5yZWdleCdcdHRoZW4gbm90IHNlZWtlZFZhbHVlLnRlc3QodGFyZ2V0VmFsdWUpXG5cdFx0XHRcdHdoZW4gJyRtYXNrJ1x0dGhlbiBoZWxwZXJzLnRlc3RNYXNrKHRhcmdldFZhbHVlLCBzZWVrZWRWYWx1ZSlcblx0XHRcdFx0ZWxzZSBmYWxzZVxuXG5cdFx0cmV0dXJuIHBhc3NlZENvbXBhcmlzb25zLmxlbmd0aCBpcyBjb21wYXJpc29uT3BlcmF0b3JzLmxlbmd0aFxuXG5cblx0QHZhbGlkYXRlOiAoY29uZGl0aW9ucyktPiBpZiBjb25kaXRpb25zXG5cdFx0dmFsaWRDb25kaXRpb25zID0gY29uZGl0aW9ucy5maWx0ZXIgKGNvbmRpdGlvbiktPlxuXHRcdFx0Y29uZGl0aW9uLnNhdGlzZmllZCA9IGNvbmRpdGlvbi50ZXN0KClcblx0XHRcblx0XHRyZXR1cm4gdmFsaWRDb25kaXRpb25zLmxlbmd0aCBpcyBjb25kaXRpb25zLmxlbmd0aFxuXG5cblx0QGluaXQ6IChmaWVsZCwgY29uZGl0aW9ucywgY2FsbGJhY2spLT4gc2V0VGltZW91dCAoKT0+XG5cdFx0Y2FsbGJhY2sgPz0gKCk9PiBmaWVsZC52YWxpZGF0ZUNvbmRpdGlvbnMoKVxuXHRcdFxuXHRcdGZpZWxkLmNvbmRpdGlvbnMgPSBjb25kaXRpb25zLm1hcCAoY29uZGl0aW9uKS0+XG5cdFx0XHRuZXcgQ29uZGl0aW9uKGZpZWxkLCBjb25kaXRpb24sIGNhbGxiYWNrKVxuXG5cdFx0Y2FsbGJhY2soKVxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmRpdGlvbiIsIm1vZHVsZS5leHBvcnRzID1cblx0Zm9udEZhbWlseTogJ3N5c3RlbS11aSwgc2Fucy1zZXJpZidcblx0dGVtcGxhdGVzOiB7fVxuXHRldmVudHM6IG51bGxcblx0bGFiZWw6IGZhbHNlXG5cdGVycm9yOiAnJ1xuXHRoZWxwOiAnJ1xuXHRyZXF1aXJlZDogZmFsc2Vcblx0ZGlzYWJsZWQ6IGZhbHNlXG5cdGRlZmF1bHRWYWx1ZTogbnVsbFxuXHR3aWR0aDogJzEwMCUnXG5cdG1vYmlsZVdpZHRoOiBudWxsXG5cdG1vYmlsZVRocmVzaG9sZDogNzM2XG5cdGJvcmRlcjogMVxuXHRtYXJnaW46IG51bGxcblx0cGFkZGluZzogbnVsbFxuXHRkaXN0YW5jZTogbnVsbFxuXHRpbnB1dFBhZGRpbmc6IDEyXG5cdGZvbnRTaXplOiAxNFxuXHRsYWJlbFNpemU6IG51bGxcblx0aWNvbjogbnVsbFxuXHRpY29uU2l6ZTogMjJcblx0Z2V0dGVyOiBudWxsXG5cdHNldHRlcjogbnVsbFxuXHR2YWxpZGF0b3I6IG51bGxcblx0Y2xlYXJFcnJvck9uVmFsaWQ6IHRydWVcblx0bWFrZVJvb21Gb3JIZWxwOiB0cnVlIiwiSVMgPSBpbXBvcnQgJy4uLy4uL2NoZWNrcydcblNpbXBseUJpbmQgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kJ1xuS0VZQ09ERVMgPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9rZXlDb2RlcydcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5Db25kaXRpb24gPSBpbXBvcnQgJy4uL2NvbmRpdGlvbidcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbmdsb2JhbERlZmF1bHRzID0gaW1wb3J0ICcuLi8uLi9maWVsZC9nbG9iYWxEZWZhdWx0cydcbmltcG9ydCAqIGFzIHRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUnXG5pbXBvcnQgKiBhcyBkZWZhdWx0cyBmcm9tICcuL2RlZmF1bHRzJ1xuXG5jbGFzcyBEcm9wZG93blxuXHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0ZGVmYXVsdHM6IGRlZmF1bHRzXG5cdF9zZXR0aW5nRmlsdGVyczogbWF4SGVpZ2h0OiAodmFsdWUpLT4gSVMubnVtYmVyKHZhbHVlKVxuXHRcblx0Y29uc3RydWN0b3I6IChAaW5pdGlhbENob2ljZXMsIEBmaWVsZCktPlxuXHRcdEBpc09wZW4gPSBmYWxzZVxuXHRcdEB0eXBlQnVmZmVyID0gJydcblx0XHRAc2V0dGluZ3MgPSBleHRlbmQuZGVlcC5jbG9uZS5maWx0ZXIoQF9zZXR0aW5nRmlsdGVycykoZ2xvYmFsRGVmYXVsdHMsIEBkZWZhdWx0cywgQGZpZWxkLnNldHRpbmdzLmRyb3Bkb3duKVxuXHRcdEBzZWxlY3RlZCA9IGlmIEBzZXR0aW5ncy5tdWx0aXBsZSB0aGVuIFtdIGVsc2UgbnVsbFxuXHRcdEBsYXN0U2VsZWN0ZWQgPSBudWxsXG5cdFx0QGNob2ljZXMgPSBbXVxuXHRcdEBjdXJyZW50SGlnaGxpZ2h0ZWQgPSBudWxsXG5cdFx0QHZpc2libGVDaG9pY2VzQ291bnQgPSAwXG5cdFx0QHZpc2libGVDaG9pY2VzID0gW11cblx0XHRAZWxzID0ge31cblx0XHRAX3NlbGVjdGVkQ2FsbGJhY2sgPSBoZWxwZXJzLm5vb3Bcblx0XHRcblx0XHRAX2NyZWF0ZUVsZW1lbnRzKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzKClcblx0XHRyZXR1cm4gQFxuXG5cblx0X2NyZWF0ZUVsZW1lbnRzOiAoKS0+XG5cdFx0Z2xvYmFsT3B0cyA9IHtyZWxhdGVkSW5zdGFuY2U6QH1cblx0XHRAZWxzLmNvbnRhaW5lciA9IEB0ZW1wbGF0ZS5kZWZhdWx0LnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuZGVmYXVsdCwgZXh0ZW5kKHtwYXNzU3RhdGVUb0NoaWxkcmVuOmZhbHNlfSwgZ2xvYmFsT3B0cykpXG5cdFx0QGVscy5saXN0ID0gQHRlbXBsYXRlLmxpc3Quc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5saXN0LCBnbG9iYWxPcHRzKS5hcHBlbmRUbyhAZWxzLmNvbnRhaW5lcilcblx0XHRAZWxzLmhlbHAgPSBAdGVtcGxhdGUuaGVscC5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmhlbHAsIGdsb2JhbE9wdHMpLmFwcGVuZFRvKEBlbHMuY29udGFpbmVyKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAgPSBAdGVtcGxhdGUuc2Nyb2xsSW5kaWNhdG9yVXAuc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5zY3JvbGxJbmRpY2F0b3JVcCwgZ2xvYmFsT3B0cykuYXBwZW5kVG8oQGVscy5jb250YWluZXIpXG5cdFx0QGVscy5zY3JvbGxJbmRpY2F0b3JEb3duID0gQHRlbXBsYXRlLnNjcm9sbEluZGljYXRvckRvd24uc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5zY3JvbGxJbmRpY2F0b3JEb3duLCBnbG9iYWxPcHRzKS5hcHBlbmRUbyhAZWxzLmNvbnRhaW5lcilcblxuXHRcdEBsaXN0ID0gbmV3IExpc3QoQClcblx0XHRAYWRkQ2hvaWNlKGNob2ljZSkgZm9yIGNob2ljZSBpbiBAaW5pdGlhbENob2ljZXNcblx0XHRyZXR1cm5cblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzOiAoKS0+XG5cdFx0QF9hdHRhY2hCaW5kaW5nc19lbFN0YXRlKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXkoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3Nfc2Nyb2xsSW5kaWNhdG9ycygpXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfZWxTdGF0ZTogKCktPlxuXHRcdFNpbXBseUJpbmQoJ2hlbHAnKS5vZihAc2V0dGluZ3MpXG5cdFx0XHQudG8oJ3RleHQnKS5vZihAZWxzLmhlbHApXG5cdFx0XHQuYW5kLnRvIChzaG93SGVscCk9PiBAZWxzLmhlbHAuc3RhdGUgJ3Nob3dIZWxwJywgc2hvd0hlbHBcblxuXHRcdFNpbXBseUJpbmQoJ3Zpc2libGVDaG9pY2VzQ291bnQnKS5vZihAKVxuXHRcdFx0LnRvIChjb3VudCk9PiBAZWxzLmNvbnRhaW5lci5zdGF0ZSAnaGFzVmlzaWJsZUNob2ljZXMnLCAhIWNvdW50XG5cdFxuXHRcdFNpbXBseUJpbmQoJ2N1cnJlbnRIaWdobGlnaHRlZCcpLm9mKEApXG5cdFx0XHQudG8gKGN1cnJlbnQsIHByZXYpPT5cblx0XHRcdFx0cHJldi5lbC5zdGF0ZSgnaG92ZXInLCBvZmYpIGlmIHByZXZcblx0XHRcdFx0Y3VycmVudC5lbC5zdGF0ZSgnaG92ZXInLCBvbikgaWYgY3VycmVudFxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXk6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdpc09wZW4nLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEApLnRvIChpc09wZW4pPT5cblx0XHRcdEBlbHMuY29udGFpbmVyLnN0YXRlICdpc09wZW4nLCBpc09wZW5cdFx0XG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gbnVsbCBpZiBub3QgaXNPcGVuXG5cdFxuXHRcdFx0aWYgQHNldHRpbmdzLmxvY2tTY3JvbGxcblx0XHRcdFx0aWYgaXNPcGVuXG5cdFx0XHRcdFx0aGVscGVycy5sb2NrU2Nyb2xsKEBlbHMubGlzdClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGhlbHBlcnMudW5sb2NrU2Nyb2xsKClcblxuXHRcdFx0aWYgaXNPcGVuXG5cdFx0XHRcdEBsaXN0LmNhbGNEaXNwbGF5KClcblx0XHRcdFx0QGxpc3Quc2Nyb2xsVG9DaG9pY2UoQHNlbGVjdGVkKSBpZiBAc2VsZWN0ZWQgYW5kIG5vdCBAc2V0dGluZ3MubXVsdGlwbGVcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGxpc3Quc2V0VHJhbnNsYXRlKDApXG5cblxuXHRcdFNpbXBseUJpbmQoJ2xhc3RTZWxlY3RlZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSwgdXBkYXRlRXZlbklmU2FtZTp0cnVlKS5vZihAKVxuXHRcdFx0LnRvIChuZXdDaG9pY2UsIHByZXZDaG9pY2UpPT4gQF9zZWxlY3RlZENhbGxiYWNrKG5ld0Nob2ljZSwgcHJldkNob2ljZSlcblxuXG5cdFx0U2ltcGx5QmluZCgnZm9jdXNlZCcsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQGZpZWxkLnN0YXRlKS50byAoZm9jdXNlZCk9PlxuXHRcdFx0aWYgbm90IGZvY3VzZWRcblx0XHRcdFx0QGZpZWxkLmVsLmNoaWxkLmlucHV0Lm9mZiAna2V5ZG93bi5kcm9wZG93bk5hdidcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGZpZWxkLmVsLmNoaWxkLmlucHV0Lm9uICdrZXlkb3duLmRyb3Bkb3duTmF2JywgKGV2ZW50KT0+IGlmIEBpc09wZW4gdGhlbiBzd2l0Y2ggZXZlbnQua2V5Q29kZVxuXHRcdFx0XHRcdHdoZW4gS0VZQ09ERVMudXBcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdEBoaWdobGlnaHRQcmV2KClcblxuXHRcdFx0XHRcdHdoZW4gS0VZQ09ERVMuZG93blxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0QGhpZ2hsaWdodE5leHQoKVxuXG5cdFx0XHRcdFx0d2hlbiBLRVlDT0RFUy5lbnRlclxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0QGxhc3RTZWxlY3RlZCA9IEBjdXJyZW50SGlnaGxpZ2h0ZWQgaWYgQGN1cnJlbnRIaWdobGlnaHRlZFxuXG5cdFx0XHRcdFx0d2hlbiBLRVlDT0RFUy5lc2Ncblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdEBpc09wZW4gPSBmYWxzZVxuXG5cdFx0XG5cdFx0cmV0dXJuIGlmIG5vdCBAc2V0dGluZ3MudHlwZUJ1ZmZlclxuXHRcdFNpbXBseUJpbmQoJ2ZvY3VzZWQnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEBmaWVsZC5zdGF0ZSkudG8gKGZvY3VzZWQpPT5cblx0XHRcdGlmIG5vdCBmb2N1c2VkXG5cdFx0XHRcdERPTShkb2N1bWVudCkub2ZmICdrZXlwcmVzcy5kcm9wZG93blR5cGVCdWZmZXInXG5cdFx0XHRlbHNlXG5cdFx0XHRcdERPTShkb2N1bWVudCkub24gJ2tleXByZXNzLmRyb3Bkb3duVHlwZUJ1ZmZlcicsIChldmVudCk9PiBpZiBAaXNPcGVuXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdHJldHVybiBpZiBub3QgS0VZQ09ERVMuYW55UHJpbnRhYmxlKGV2ZW50LmtleUNvZGUpXG5cdFx0XHRcdFx0QHR5cGVCdWZmZXIgKz0gZXZlbnQua2V5XG5cblxuXHRcdFNpbXBseUJpbmQoJ3R5cGVCdWZmZXInLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEApXG5cdFx0XHQudG8gKCk9PlxuXHRcdFx0XHRjbGVhclRpbWVvdXQoQHR5cGVCdWZmZXJUaW1lb3V0KVxuXHRcdFx0XHRAdHlwZUJ1ZmZlclRpbWVvdXQgPSBzZXRUaW1lb3V0ICgpPT5cblx0XHRcdFx0XHRAdHlwZUJ1ZmZlciA9ICcnXG5cdFx0XHRcdCwxNTAwXG5cdFx0XHRcblx0XHRcdC5hbmQudG8gKGJ1ZmZlcik9PiBpZiBidWZmZXJcblx0XHRcdFx0Zm9yIGNob2ljZSBpbiBAdmlzaWJsZUNob2ljZXNcblx0XHRcdFx0XHRpZiBoZWxwZXJzLnN0YXJ0c1dpdGgoYnVmZmVyLCBjaG9pY2UubGFiZWwpXG5cdFx0XHRcdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlXG5cdFx0XHRcdFx0XHRAbGlzdC5zY3JvbGxUb0Nob2ljZShjaG9pY2UpIHVubGVzcyBAbGlzdC5jaG9pY2VJblZpZXcoY2hvaWNlKVxuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX3Njcm9sbEluZGljYXRvcnM6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdzY3JvbGxUb3AnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUpLm9mKEBlbHMubGlzdC5yYXcpXG5cdFx0XHQudG8gKHNjcm9sbFRvcCk9PlxuXHRcdFx0XHRzaG93VG9wSW5kaWNhdG9yID0gc2Nyb2xsVG9wID4gMFxuXHRcdFx0XHRzaG93Qm90dG9tSW5kaWNhdG9yID0gQGVscy5saXN0LnJhdy5zY3JvbGxIZWlnaHQgLSBAZWxzLmxpc3QucmF3LmNsaWVudEhlaWdodCA+IHNjcm9sbFRvcFxuXG5cdFx0XHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAuc3RhdGUgJ3Zpc2libGUnLCBzaG93VG9wSW5kaWNhdG9yXG5cdFx0XHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5zdGF0ZSAndmlzaWJsZScsIHNob3dCb3R0b21JbmRpY2F0b3JcblxuXHRcdFx0LmNvbmRpdGlvbiAoKT0+IEBpc09wZW4gYW5kIG5vdCBAc2V0dGluZ3MuaGVscCBhbmQgQGVscy5saXN0LnJhdy5zY3JvbGxIZWlnaHQgaXNudCBAZWxzLmxpc3QucmF3LmNsaWVudEhlaWdodCBhbmQgQGVscy5saXN0LnJhdy5jbGllbnRIZWlnaHQgPj0gMTAwXG5cdFx0XHQudXBkYXRlT24oJ2V2ZW50OnNjcm9sbCcpLm9mKEBlbHMubGlzdC5yYXcpXG5cdFx0XHQudXBkYXRlT24oJ2lzT3BlbicpLm9mKEApXG5cblx0XHRAZWxzLnNjcm9sbEluZGljYXRvclVwLm9uICdtb3VzZWVudGVyJywgKCk9PiBAbGlzdC5zdGFydFNjcm9sbGluZygndXAnKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAub24gJ21vdXNlbGVhdmUnLCAoKT0+IEBsaXN0LnN0b3BTY3JvbGxpbmcoKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5vbiAnbW91c2VlbnRlcicsICgpPT4gQGxpc3Quc3RhcnRTY3JvbGxpbmcoJ2Rvd24nKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5vbiAnbW91c2VsZWF2ZScsICgpPT4gQGxpc3Quc3RvcFNjcm9sbGluZygpXG5cblxuXHRhZGRDaG9pY2U6IChjb25maWcpLT5cblx0XHRpZiBJUy5hcnJheShjb25maWcpXG5cdFx0XHRAYWRkQ2hvaWNlKGl0ZW0pIGZvciBpdGVtIGluIGNvbmZpZ1xuXHRcdFx0cmV0dXJuXG5cdFx0XG5cdFx0ZWxzZSBpZiBJUy5zdHJpbmcoY29uZmlnKVxuXHRcdFx0Y29uZmlnID0ge2xhYmVsOmNvbmZpZywgdmFsdWU6Y29uZmlnfVxuXHRcdFxuXHRcdGVsc2UgaWYgSVMub2JqZWN0UGxhaW4oY29uZmlnKVxuXHRcdFx0Y29uZmlnLnZhbHVlID89IGNvbmZpZy5sYWJlbFxuXHRcdFx0Y29uZmlnLmxhYmVsID89IGNvbmZpZy52YWx1ZVxuXG5cdFx0ZWxzZSByZXR1cm5cblxuXHRcdG5ld0Nob2ljZSA9IG5ldyBDaG9pY2UoQCwgY29uZmlnLCBAbGlzdCwgQGNob2ljZXMubGVuZ3RoKVxuXHRcdEBjaG9pY2VzLnB1c2gobmV3Q2hvaWNlKVxuXHRcdHJldHVybiBuZXdDaG9pY2VcblxuXG5cdGFwcGVuZFRvOiAodGFyZ2V0KS0+XG5cdFx0QGVscy5jb250YWluZXIuYXBwZW5kVG8odGFyZ2V0KVxuXG5cblx0b25TZWxlY3RlZDogKGNhbGxiYWNrKS0+XG5cdFx0QF9zZWxlY3RlZENhbGxiYWNrID0gY2FsbGJhY2tcblxuXG5cdGZpbmRDaG9pY2U6IChwcm92aWRlZFZhbHVlLCBieUxhYmVsKS0+XG5cdFx0bWF0Y2hlcyA9IEBjaG9pY2VzLmZpbHRlciAoY2hvaWNlKS0+IHN3aXRjaFxuXHRcdFx0d2hlbiBJUy5vYmplY3QocHJvdmlkZWRWYWx1ZSkgdGhlbiBwcm92aWRlZFZhbHVlIGlzIGNob2ljZVxuXHRcdFx0d2hlbiBieUxhYmVsIHRoZW4gcHJvdmlkZWRWYWx1ZSBpcyBjaG9pY2UubGFiZWxcblx0XHRcdGVsc2UgcHJvdmlkZWRWYWx1ZSBpcyBjaG9pY2UudmFsdWVcblxuXHRcdHJldHVybiBtYXRjaGVzWzBdXG5cblxuXHRmaW5kQ2hvaWNlQW55OiAocHJvdmlkZWRWYWx1ZSktPlxuXHRcdEBmaW5kQ2hvaWNlKHByb3ZpZGVkVmFsdWUpIG9yIEBmaW5kQ2hvaWNlKHByb3ZpZGVkVmFsdWUsIHRydWUpXG5cblxuXHRoaWdobGlnaHRQcmV2OiAoKS0+XG5cdFx0Y3VycmVudEluZGV4ID0gQHZpc2libGVDaG9pY2VzLmluZGV4T2YoQGN1cnJlbnRIaWdobGlnaHRlZClcblx0XHRcblx0XHRpZiBjdXJyZW50SW5kZXggPiAwXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzW2N1cnJlbnRJbmRleC0xXVxuXHRcdFx0QGxpc3Quc2Nyb2xsVXAoY2hvaWNlKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblx0XHRlbHNlXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzW0B2aXNpYmxlQ2hvaWNlcy5sZW5ndGgtMV1cblx0XHRcdEBsaXN0LnNjcm9sbFRvQ2hvaWNlKGNob2ljZSwxKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblxuXG5cblx0aGlnaGxpZ2h0TmV4dDogKCktPlxuXHRcdGN1cnJlbnRJbmRleCA9IEB2aXNpYmxlQ2hvaWNlcy5pbmRleE9mKEBjdXJyZW50SGlnaGxpZ2h0ZWQpXG5cdFx0XG5cdFx0aWYgY3VycmVudEluZGV4IDwgQHZpc2libGVDaG9pY2VzLmxlbmd0aC0xXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzW2N1cnJlbnRJbmRleCsxXVxuXHRcdFx0QGxpc3Quc2Nyb2xsRG93bihjaG9pY2UpIHVubGVzcyBAbGlzdC5jaG9pY2VJblZpZXcoY2hvaWNlKVxuXHRcdGVsc2Vcblx0XHRcdEBjdXJyZW50SGlnaGxpZ2h0ZWQgPSBjaG9pY2UgPSBAdmlzaWJsZUNob2ljZXNbMF1cblx0XHRcdEBsaXN0LnNjcm9sbFRvQ2hvaWNlKGNob2ljZSwxKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblxuXG5cblxuXG5cblxuY2xhc3MgTGlzdFxuXHRjb25zdHJ1Y3RvcjogKEBkcm9wZG93biktPlxuXHRcdHtAZWxzLCBAZmllbGQsIEBzZXR0aW5nc30gPSBAZHJvcGRvd25cblx0XHRAZWwgPSBAZWxzLmxpc3Rcblx0XHRAY29udGFpbmVyID0gQGVscy5jb250YWluZXJcblxuXHRjYWxjRGlzcGxheTogKCktPlxuXHRcdHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuXHRcdHRyYW5zbGF0aW9uID0gQHRyYW5zbGF0aW9uIG9yIDBcblx0XHRjbGlwcGluZ1BhcmVudCA9IEBjb250YWluZXIucGFyZW50TWF0Y2hpbmcgKHBhcmVudCktPiBvdmVyZmxvdz1wYXJlbnQuc3R5bGUoJ292ZXJmbG93WScpOyBvdmVyZmxvdyBpcyAnaGlkZGVuJyBvciBvdmVyZmxvdyBpcyAnc2Nyb2xsJ1xuXHRcdHNjcm9sbEhlaWdodCA9IEBlbC5yYXcuc2Nyb2xsSGVpZ2h0IG9yIEluZmluaXR5XG5cdFx0c2VsZlJlY3QgPSBleHRlbmQuY2xvbmUgQGNvbnRhaW5lci5yZWN0XG5cdFx0cGFkZGluZyA9IHNlbGZSZWN0LmhlaWdodCAtIEBlbC5oZWlnaHRcblx0XHRoZWlnaHQgPSBNYXRoLm1pbiBzY3JvbGxIZWlnaHQsIEBzZXR0aW5ncy5tYXhIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodC00MFxuXHRcdHNlbGZSZWN0LmJvdHRvbSA9IHNlbGZSZWN0LnRvcCArIGhlaWdodFxuXG5cdFx0aWYgY2xpcHBpbmdQYXJlbnRcblx0XHRcdGNsaXBwaW5nUmVjdCA9IGNsaXBwaW5nUGFyZW50LnJlY3Rcblx0XHRcdGJvdHRvbUN1dG9mZiA9IHNlbGZSZWN0LmJvdHRvbSAtIGNsaXBwaW5nUmVjdC5ib3R0b21cblx0XHRcdHRvcEN1dG9mZiA9IGNsaXBwaW5nUmVjdC50b3AgLSBzZWxmUmVjdC50b3Bcblx0XHRcdGlzQm90dG9tQ3V0b2ZmID0gYm90dG9tQ3V0b2ZmID4gMFxuXHRcdFx0aXNUb3BDdXRvZmYgPSB0b3BDdXRvZmYgPiAwXG5cblx0XHRcdGlmIHNlbGZSZWN0LnRvcCA+PSBjbGlwcGluZ1JlY3QuYm90dG9tIG9yIGNsaXBwaW5nUmVjdC50b3AgPj0gc2VsZlJlY3QuYm90dG9tXG5cdFx0XHRcdGNvbnNvbGUud2FybihcIlRoZSBkcm9wZG93biBmb3IgZWxlbWVudCAnI3tAZmllbGQuSUR9JyBjYW5ub3QgYmUgZGlzcGxheWVkIGFzIGl0J3MgaGlkZGVuIGJ5IHRoZSBwYXJlbnQgb3ZlcmZsb3dcIilcblx0XHRcdFxuXHRcdFx0ZWxzZSBpZiBpc0JvdHRvbUN1dG9mZiBvciBpc1RvcEN1dG9mZlxuXHRcdFx0XHRuZWVkc05ld0hlaWdodCA9IHRydWVcblx0XHRcdFx0XG5cdFx0XHRcdGlmIHNlbGZSZWN0LnRvcCAtIGJvdHRvbUN1dG9mZiA+IGNsaXBwaW5nUmVjdC50b3AgYW5kIG5vdCBpc1RvcEN1dG9mZlxuXHRcdFx0XHRcdHRyYW5zbGF0aW9uID0gYm90dG9tQ3V0b2ZmXG5cdFx0XHRcdFx0c2VsZlJlY3QudG9wIC09IHRyYW5zbGF0aW9uXG5cdFx0XHRcdFx0c2VsZlJlY3QuYm90dG9tIC09IHRyYW5zbGF0aW9uXG5cdFx0XHRcdFx0Y3V0b2ZmID0gY2xpcHBpbmdSZWN0LnRvcCAtIHNlbGZSZWN0LnRvcFxuXG5cdFx0XHRcdGVsc2UgaWYgc2VsZlJlY3QuYm90dG9tIC0gdG9wQ3V0b2ZmIDwgY2xpcHBpbmdSZWN0LmJvdHRvbVxuXHRcdFx0XHRcdHRyYW5zbGF0aW9uID0gdG9wQ3V0b2ZmICogLTFcblx0XHRcdFx0XHRzZWxmUmVjdC50b3AgKz0gdHJhbnNsYXRpb25cblx0XHRcdFx0XHRzZWxmUmVjdC5ib3R0b20gKz0gdHJhbnNsYXRpb25cblx0XHRcdFx0XHRjdXRvZmYgPSBzZWxmUmVjdC5ib3R0b20gLSBjbGlwcGluZ1JlY3QuYm90dG9tXG5cblxuXHRcdFx0XHRpZiBuZWVkc05ld0hlaWdodCA9IGN1dG9mZiA+IDBcblx0XHRcdFx0XHRoZWlnaHQgPSBjdXRvZmYgLSBwYWRkaW5nXG5cblx0XHRcblx0XHR3aW5kb3dDdXRvZmYgPSAoc2VsZlJlY3QudG9wICsgaGVpZ2h0KSAtIHdpbmRvd0hlaWdodFxuXHRcdFxuXHRcdGlmIHdpbmRvd0N1dG9mZiA+IDAgYW5kIGhlaWdodCA8IHdpbmRvd0hlaWdodFxuXHRcdFx0dHJhbnNsYXRpb24gKz0gd2luZG93Q3V0b2ZmKzEwXG5cblx0XHRAc2V0RGltZW5zaW9ucyhoZWlnaHQsIEBmaWVsZC5lbC5jaGlsZC5pbm5lcndyYXAud2lkdGgrMTApXG5cdFx0QHNldFRyYW5zbGF0ZSh0cmFuc2xhdGlvbilcblxuXG5cdHNldERpbWVuc2lvbnM6IChoZWlnaHQsIHdpZHRoKS0+XG5cdFx0QGVsLnN0eWxlICdtYXhIZWlnaHQnLCBoZWlnaHQgaWYgaGVpZ2h0P1xuXHRcdEBlbC5zdHlsZSAnbWluV2lkdGgnLCB3aWR0aCBpZiB3aWR0aD9cblxuXHRcblx0c2V0VHJhbnNsYXRlOiAodHJhbnNsYXRpb24pLT5cblx0XHRAdHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvblxuXHRcdHRyYW5zbGF0aW9uICo9IC0xXG5cdFx0QGNvbnRhaW5lci5zdHlsZSAndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGVZKCN7dHJhbnNsYXRpb259cHgpXCJcblxuXG5cdHNjcm9sbFRvQ2hvaWNlOiAoY2hvaWNlLG9mZnNldD0zKS0+XG5cdFx0ZGlzdGFuZUZyb21Ub3AgPSBjaG9pY2UuZWwucmF3Lm9mZnNldFRvcFxuXHRcdHNlbGVjdGVkSGVpZ2h0ID0gY2hvaWNlLmVsLmhlaWdodFxuXHRcdFxuXHRcdEBlbC5yYXcuc2Nyb2xsVG9wID0gZGlzdGFuZUZyb21Ub3AgLSBzZWxlY3RlZEhlaWdodCpvZmZzZXRcblxuXHRzY3JvbGxEb3duOiAoY2hvaWNlKS0+XG5cdFx0QGVsLnJhdy5zY3JvbGxUb3AgKz0gY2hvaWNlLmVsLmhlaWdodFxuXG5cdHNjcm9sbFVwOiAoY2hvaWNlKS0+XG5cdFx0QGVsLnJhdy5zY3JvbGxUb3AgLT0gY2hvaWNlLmVsLmhlaWdodFxuXG5cdGNob2ljZUluVmlldzogKGNob2ljZSk9PlxuXHRcdGNob2ljZVJlY3QgPSBjaG9pY2UuZWwucmVjdFxuXHRcdGxpc3RSZWN0ID0gQGVsLnJlY3Rcblx0XHR1cFBhZGRpbmcgPSBpZiBAZWxzLnNjcm9sbEluZGljYXRvclVwLnN0YXRlKCd2aXNpYmxlJykgdGhlbiBwYXJzZUZsb2F0IEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAuc3R5bGVTYWZlKCdoZWlnaHQnLHRydWUpXG5cdFx0ZG93blBhZGRpbmcgPSBpZiBAZWxzLnNjcm9sbEluZGljYXRvckRvd24uc3RhdGUoJ3Zpc2libGUnKSB0aGVuIHBhcnNlRmxvYXQgQGVscy5zY3JvbGxJbmRpY2F0b3JEb3duLnN0eWxlU2FmZSgnaGVpZ2h0Jyx0cnVlKVxuXG5cdFx0Y2hvaWNlUmVjdC5ib3R0b20gPD0gbGlzdFJlY3QuYm90dG9tLWRvd25QYWRkaW5nIGFuZFxuXHRcdGNob2ljZVJlY3QudG9wID49IGxpc3RSZWN0LnRvcCt1cFBhZGRpbmdcblxuXG5cdHN0YXJ0U2Nyb2xsaW5nOiAoZGlyZWN0aW9uKS0+XG5cdFx0QHNjcm9sbEludGVydmFsSUQgPSBzZXRJbnRlcnZhbCAoKT0+XG5cdFx0XHRAZWwucmF3LnNjcm9sbFRvcCArPSBpZiBkaXJlY3Rpb24gaXMgJ3VwJyB0aGVuIC0yMCBlbHNlIDIwXG5cdFx0LCA1MFxuXG5cblx0c3RvcFNjcm9sbGluZzogKCktPlxuXHRcdGNsZWFySW50ZXJ2YWwoQHNjcm9sbEludGVydmFsSUQpXG5cblxuXG5cblxuY2xhc3MgQ2hvaWNlXG5cdGNvbnN0cnVjdG9yOiAoQGRyb3Bkb3duLCBAc2V0dGluZ3MsIEBsaXN0LCBAaW5kZXgpLT5cblx0XHR7QGxhYmVsLCBAdmFsdWUsIEBjb25kaXRpb25zfSA9IEBzZXR0aW5nc1xuXHRcdEBsYWJlbCA/PSBAdmFsdWVcblx0XHRAdmFsdWUgPz0gQGxhYmVsXG5cdFx0QGZpZWxkID0gQGRyb3Bkb3duLmZpZWxkXG5cdFx0QGVsID0gQGRyb3Bkb3duLnRlbXBsYXRlLmNob2ljZS5zcGF3bihudWxsLCB7cmVsYXRlZEluc3RhbmNlOkBkcm9wZG93bn0pLmFwcGVuZFRvKEBsaXN0LmVsKVxuXHRcdEBlbC5jaGlsZHJlblsxXS50ZXh0ID0gQGxhYmVsXG5cdFx0QHZpc2libGUgPSB0cnVlXG5cdFx0QHNlbGVjdGVkID0gZmFsc2Vcblx0XHRAdW5hdmFpbGFibGUgPSBmYWxzZVxuXHRcdFxuXHRcdEBfYXR0YWNoQmluZGluZ3MoKVxuXG5cdFx0aWYgQGNvbmRpdGlvbnM/Lmxlbmd0aFxuXHRcdFx0QHVuYXZhaWxhYmxlID0gdHJ1ZVxuXHRcdFx0QGFsbEZpZWxkcyA9IEBmaWVsZC5hbGxGaWVsZHNcblxuXHRcdFx0Q29uZGl0aW9uLmluaXQgQCwgQGNvbmRpdGlvbnMsICgpPT5cblx0XHRcdFx0QHVuYXZhaWxhYmxlID0gIUNvbmRpdGlvbi52YWxpZGF0ZShAY29uZGl0aW9ucylcblxuXG5cdF9hdHRhY2hCaW5kaW5nczogKCktPiBkbyAoKT0+XG5cdFx0U2ltcGx5QmluZCgndmlzaWJsZScpLm9mKEApLnRvICh2aXNpYmxlLHByZXYpPT5cblx0XHRcdEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlc0NvdW50ICs9IGlmIHZpc2libGUgdGhlbiAxIGVsc2UgLTFcblx0XHRcdEBlbC5zdGF0ZSAndmlzaWJsZScsIHZpc2libGVcblx0XHRcdGlmIHZpc2libGVcblx0XHRcdFx0QGRyb3Bkb3duLnZpc2libGVDaG9pY2VzLnB1c2goQClcblx0XHRcdFx0aWYgSVMuZGVmaW5lZChwcmV2KSAjIGluZGljYXRlcyBzdGF0ZSBoYXMgY2hhbmdlZFxuXHRcdFx0XHRcdEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlcy5zb3J0IChhLGIpLT4gYS5pbmRleCAtIGIuaW5kZXhcblx0XHRcdGVsc2Vcblx0XHRcdFx0aGVscGVycy5yZW1vdmVJdGVtKEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlcywgQClcblxuXHRcdFNpbXBseUJpbmQoJ3NlbGVjdGVkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0LnRvIChzZWxlY3RlZCk9PiBAZWwuc3RhdGUgJ3NlbGVjdGVkJywgc2VsZWN0ZWRcblx0XHRcblx0XHRTaW1wbHlCaW5kKCd1bmF2YWlsYWJsZScsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQClcblx0XHRcdC50byAodW5hdmFpbGFibGUpPT4gQGVsLnN0YXRlICd1bmF2YWlsYWJsZScsIHVuYXZhaWxhYmxlXHRcdFx0XG5cdFx0XHQuYW5kLnRvICh1bmF2YWlsYWJsZSk9PiBAdG9nZ2xlKG9mZiwgdHJ1ZSkgaWYgdW5hdmFpbGFibGVcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmNsaWNrJykub2YoQGVsKVxuXHRcdFx0LnRvICgpPT4gQGRyb3Bkb3duLmxhc3RTZWxlY3RlZCA9IEBcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDptb3VzZWRvd24nKS5vZihAZWwpXG5cdFx0XHQudG8gKGV2ZW50KT0+IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6bW91c2VlbnRlcicpLm9mKEBlbClcblx0XHRcdC50byAoKT0+IEBkcm9wZG93bi5jdXJyZW50SGlnaGxpZ2h0ZWQgPSBAXG5cblxuXHR0b2dnbGU6IChuZXdWYWx1ZSwgdW5hdmFpbGFibGUpLT5cblx0XHRwcmV2U3RhdGUgPSBAc2VsZWN0ZWRcblx0XHRuZXdTdGF0ZSA9IGlmIElTLmRlZmluZWQobmV3VmFsdWUpIHRoZW4gbmV3VmFsdWUgZWxzZSAhQHNlbGVjdGVkXG5cblx0XHRpZiBub3QgbmV3U3RhdGVcblx0XHRcdGlmIEBkcm9wZG93bi5zZXR0aW5ncy5tdWx0aXBsZSBhbmQgcHJldlN0YXRlXG5cdFx0XHRcdEBzZWxlY3RlZCA9IG5ld1N0YXRlXG5cdFx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAZmllbGQuX3ZhbHVlLCBAKVxuXHRcdFx0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBzZWxlY3RlZCA9IG5ld1N0YXRlIGlmIElTLmRlZmluZWQobmV3VmFsdWUpXG5cdFx0XHRcdEBmaWVsZC5fdmFsdWUgPSBudWxsIGlmIHVuYXZhaWxhYmxlXG5cblx0XHRlbHNlXG5cdFx0XHRAc2VsZWN0ZWQgPSBuZXdTdGF0ZVxuXHRcdFx0aWYgQGZpZWxkLnNldHRpbmdzLm11bHRpcGxlXG5cdFx0XHRcdEBmaWVsZC5fdmFsdWUucHVzaChAKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlPy50b2dnbGUob2ZmKVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlID0gQFxuXG5cdFx0XHRAZmllbGQubGFzdFNlbGVjdGVkID0gQFxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IERyb3Bkb3duXG5tb2R1bGUuZXhwb3J0cy5DaG9pY2UgPSBDaG9pY2UiLCJTaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcbm1hc2tDb3JlID0gaW1wb3J0ICd0ZXh0LW1hc2stY29yZSdcbm1hc2tBZGRvbnMgPSBpbXBvcnQgJ3RleHQtbWFzay1hZGRvbnMnXG5leHRlbmQgPSBpbXBvcnQgJ3NtYXJ0LWV4dGVuZCdcbklTID0gaW1wb3J0ICcuLi9jaGVja3MnXG5SRUdFWCA9IGltcG9ydCAnLi4vY29uc3RhbnRzL3JlZ2V4J1xuaGVscGVycyA9IGltcG9ydCAnLi4vaGVscGVycydcbmRlZmF1bHRQYXR0ZXJuQ2hhcnMgPSBcblx0JzEnOiBSRUdFWC5udW1lcmljXG5cdCcjJzogUkVHRVgud2lkZW51bWVyaWNcblx0J2EnOiBSRUdFWC5sZXR0ZXJcblx0JyonOiBSRUdFWC5hbnlcblxuXG5jbGFzcyBNYXNrXG5cdGNvbnN0cnVjdG9yOiAoQGZpZWxkLCBAY29uZmlnKS0+XG5cdFx0QHZhbHVlID0gJydcblx0XHRAcHJldlZhbHVlID0gJydcblx0XHRAY3Vyc29yID0gMFxuXHRcdEBwcmV2Q3Vyc29yID0gMFxuXHRcdEBwYXR0ZXJuID0gQHBhdHRlcm5SYXcgPSBAY29uZmlnLnBhdHRlcm5cblx0XHRAcGF0dGVyblNldHRlciA9IEBjb25maWcuc2V0dGVyXG5cdFx0QHBsYWNlaG9sZGVyQ2hhciA9IEBjb25maWcucGxhY2Vob2xkZXJcblx0XHRAcGxhY2Vob2xkZXJSZWdleCA9IG5ldyBSZWdFeHAoJ1xcXFwnKyhAcGxhY2Vob2xkZXJDaGFyIG9yICdfJyksJ2cnKVxuXHRcdEBndWlkZSA9IEBjb25maWcuZ3VpZGVcblx0XHRAa2VlcENoYXJQb3NpdGlvbnMgPSBAY29uZmlnLmtlZXBDaGFyUG9zaXRpb25zXG5cdFx0QGNoYXJzID0gZXh0ZW5kLmNsb25lIGRlZmF1bHRQYXR0ZXJuQ2hhcnMsIEBjb25maWcuY3VzdG9tUGF0dGVybnNcblxuXHRcdEBzZXRQYXR0ZXJuKEBwYXR0ZXJuKVxuXG5cblx0Z2V0U3RhdGU6IChwYXR0ZXJuLCByYXdWYWx1ZSktPiB7XG5cdFx0cmF3VmFsdWUsIEBndWlkZSwgQHBsYWNlaG9sZGVyQ2hhciwgQGtlZXBDaGFyUG9zaXRpb25zLFxuXHRcdGN1cnJlbnRDYXJldFBvc2l0aW9uOiBpZiBAZmllbGQuZWwgdGhlbiBAZmllbGQuc2VsZWN0aW9uKCkuZW5kIGVsc2UgQGN1cnNvclxuXHRcdHByZXZpb3VzQ29uZm9ybWVkVmFsdWU6IEBwcmV2VmFsdWVcblx0XHRwbGFjZWhvbGRlcjogQGdldFBsYWNlaG9sZGVyKHBhdHRlcm4pXG5cdH1cblxuXHRnZXRQbGFjZWhvbGRlcjogKHBhdHRlcm4pLT5cblx0XHRpZiBJUy5mdW5jdGlvbihwYXR0ZXJuKVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cGxhY2Vob2xkZXIgPSAnJ1xuXHRcdFx0Zm9yIGNoYXIgaW4gcGF0dGVyblxuXHRcdFx0XHRpZiBJUy5yZWdleChjaGFyKVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyICs9IEBwbGFjZWhvbGRlckNoYXJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyICs9IGNoYXJcblxuXHRcdFx0cmV0dXJuIHBsYWNlaG9sZGVyXG5cblxuXHRyZXNvbHZlUGF0dGVybjogKHBhdHRlcm4sIGlucHV0LCBzdGF0ZSktPlxuXHRcdHBhdHRlcm4gPSBcblx0XHRcdGlmIHR5cGVvZiBwYXR0ZXJuIGlzICdmdW5jdGlvbidcblx0XHRcdFx0cGF0dGVybihpbnB1dCwgQGdldFN0YXRlKHBhdHRlcm4sIGlucHV0KSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0cGF0dGVyblxuXG5cdFx0b2Zmc2V0ID0gMFxuXHRcdHRyYXBJbmRleGVzID0gW11cblx0XHRjb3B5ID0gcGF0dGVybi5zbGljZSgpXG5cdFx0Zm9yIGNoYXIsaSBpbiBjb3B5IHdoZW4gY2hhciBpcyAnW10nXG5cdFx0XHR0cmFwSW5kZXhlcy5wdXNoKGktb2Zmc2V0KVxuXHRcdFx0cGF0dGVybi5zcGxpY2UoaS1vZmZzZXQsMSlcblx0XHRcdG9mZnNldCsrXG5cblx0XHRAcHJldlBhdHRlcm4gPSBAcmVzb2x2ZWRQYXR0ZXJuXG5cdFx0QHJlc29sdmVkUGF0dGVybiA9IHBhdHRlcm5cblx0XHRyZXR1cm4ge3BhdHRlcm4sIGNhcmV0VHJhcEluZGV4ZXM6dHJhcEluZGV4ZXN9XG5cblxuXHRzZXRQYXR0ZXJuOiAoc3RyaW5nLCB1cGRhdGVWYWx1ZT10cnVlLCB1cGRhdGVGaWVsZCktPlxuXHRcdEBwYXR0ZXJuUmF3ID0gc3RyaW5nXG5cdFx0QHBhdHRlcm4gPSBAcGFyc2VQYXR0ZXJuKHN0cmluZylcblx0XHRAdHJhbnNmb3JtID0gQHBhcnNlVHJhbnNmb3JtKHN0cmluZylcblxuXHRcdGlmIHVwZGF0ZVZhbHVlXG5cdFx0XHRAdmFsdWUgPSBAc2V0VmFsdWUoQHZhbHVlKVxuXHRcdFx0QGZpZWxkLnZhbHVlID0gQHZhbHVlIGlmIHVwZGF0ZUZpZWxkXG5cblxuXHRwYXJzZVBhdHRlcm46IChzdHJpbmcpLT4gc3dpdGNoXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ0VNQUlMJ1xuXHRcdFx0bWFza0FkZG9ucy5lbWFpbE1hc2subWFza1xuXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ1BIT05FJ1xuXHRcdFx0QHBhdHRlcm5TZXR0ZXIgPSAodmFsdWUpLT4gaGVscGVycy5yZXBlYXQoJyMnLCBNYXRoLm1heCA3LHZhbHVlLmxlbmd0aClcblx0XHRcdEBndWlkZSA9IGZhbHNlXG5cdFx0XHRyZXR1cm4gJyMnXG5cblx0XHR3aGVuIHN0cmluZyBpcyAnTkFNRSdcblx0XHRcdEBwYXR0ZXJuU2V0dGVyID0gKHZhbHVlKS0+XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShAcGxhY2Vob2xkZXJSZWdleCwgJycpLnRyaW0oKVxuXHRcdFx0XHRoZWxwZXJzLnJlcGVhdCgnYScsIE1hdGgubWF4IDIsdmFsdWUubGVuZ3RoKVxuXG5cdFx0XHRyZXR1cm4gJ2EnXG5cblx0XHR3aGVuIHN0cmluZyBpcyAnRlVMTE5BTUUnXG5cdFx0XHRAcGF0dGVyblNldHRlciA9ICh2YWx1ZSktPlxuXHRcdFx0XHRpZiB2YWx1ZVt2YWx1ZS5sZW5ndGgtMV0gaXMgJyAnIHRoZW4gdmFsdWUgKz0gJ3gnXG5cdFx0XHRcdHNwbGl0ID0gdmFsdWUucmVwbGFjZShAcGxhY2Vob2xkZXJSZWdleCwnJykudHJpbSgpLnNwbGl0KC9cXHMrLylcblx0XHRcdFx0cmV0dXJuIGlmIHNwbGl0Lmxlbmd0aCBpcyA0XG5cdFx0XHRcdHNwbGl0Lm1hcCgocGFydCktPiBoZWxwZXJzLnJlcGVhdCgnYScsIE1hdGgubWF4IDIscGFydC5sZW5ndGgpKS5qb2luKCcgJylcblx0XHRcdHJldHVybiAnYSdcblxuXHRcdHdoZW4gc3RyaW5nIGlzICdEQVRFJ1xuXHRcdFx0Wy9cXGQvLCAvXFxkLywgJy8nLCAvXFxkLywgL1xcZC8sICcvJywgL1xcZC8sIC9cXGQvLCAvXFxkLywgL1xcZC9dXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmdbMF0gaXMgJ0RBVEUnIGFuZCBJUy5zdHJpbmcoc3RyaW5nWzFdKVxuXHRcdFx0c3RyaW5nWzFdLnNwbGl0KCcnKS5tYXAoKGNoYXIpPT4gaWYgUkVHRVgubGV0dGVyLnRlc3QoY2hhcikgdGhlbiAvXFxkLyBlbHNlIGNoYXIpXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmcgaXMgJ05VTUJFUidcblx0XHRcdG1hc2tBZGRvbnMuY3JlYXRlTnVtYmVyTWFza1xuXHRcdFx0XHRwcmVmaXg6IEBjb25maWcucHJlZml4IG9yICcnXG5cdFx0XHRcdHN1ZmZpeDogQGNvbmZpZy5zdWZmaXggb3IgJydcblx0XHRcdFx0aW5jbHVkZVRob3VzYW5kc1NlcGFyYXRvcjogaWYgQGNvbmZpZy5zZXAgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRcdFx0dGhvdXNhbmRzU2VwYXJhdG9yU3ltYm9sOiBpZiBJUy5zdHJpbmcoQGNvbmZpZy5zZXApIHRoZW4gQGNvbmZpZy5zZXBcblx0XHRcdFx0YWxsb3dEZWNpbWFsOiBAY29uZmlnLmRlY2ltYWxcblx0XHRcdFx0ZGVjaW1hbExpbWl0OiBpZiBJUy5udW1iZXIoQGNvbmZpZy5kZWNpbWFsKSB0aGVuIEBjb25maWcuZGVjaW1hbFxuXHRcdFx0XHRpbnRlZ2VyTGltaXQ6IGlmIElTLm51bWJlcihAY29uZmlnLmxpbWl0KSB0aGVuIEBjb25maWcubGltaXRcblxuXHRcdHdoZW4gSVMuYXJyYXkoc3RyaW5nKVxuXHRcdFx0cmV0dXJuIHN0cmluZ1xuXG5cdFx0ZWxzZVxuXHRcdFx0cGF0dGVybiA9IFtdXG5cblx0XHRcdGZvciBjaGFyLGkgaW4gc3RyaW5nXG5cdFx0XHRcdGlmIGNoYXIgaXMgJ1xcXFwnXG5cdFx0XHRcdFx0ZXNjYXBlZCA9IHRydWVcblx0XHRcdFx0XHRjb250aW51ZVxuXHRcdFx0XHRcblx0XHRcdFx0cGF0dGVybi5wdXNoIGlmIGVzY2FwZWQgdGhlbiBjaGFyIGVsc2UgKEBjaGFyc1tjaGFyXSBvciBjaGFyKVxuXHRcdFx0XHRlc2NhcGVkID0gZmFsc2VcblxuXHRcdFx0cmV0dXJuIHBhdHRlcm5cblxuXG5cdHBhcnNlVHJhbnNmb3JtOiAoc3RyaW5nKS0+IHN3aXRjaFxuXHRcdHdoZW4gc3RyaW5nIGlzICdFTUFJTCdcblx0XHRcdG1hc2tBZGRvbnMuZW1haWxNYXNrLnBpcGVcblx0XHRcblx0XHR3aGVuIHN0cmluZyBpcyAnREFURSdcblx0XHRcdG1hc2tBZGRvbnMuY3JlYXRlQXV0b0NvcnJlY3RlZERhdGVQaXBlKCdtbS9kZC95eXl5Jylcblx0XHRcblx0XHR3aGVuIHN0cmluZ1swXSBpcyAnREFURScgYW5kIElTLnN0cmluZyhzdHJpbmdbMV0pXG5cdFx0XHRtYXNrQWRkb25zLmNyZWF0ZUF1dG9Db3JyZWN0ZWREYXRlUGlwZShzdHJpbmdbMV0pXG5cblx0XHR3aGVuIEBjb25maWcudHJhbnNmb3JtXG5cdFx0XHRAY29uZmlnLnRyYW5zZm9ybVxuXG5cblxuXHRzZXRWYWx1ZTogKGlucHV0KS0+XG5cdFx0aWYgQHBhdHRlcm5TZXR0ZXJcblx0XHRcdG5ld1BhdHRlcm4gPSBAcGF0dGVyblNldHRlcihpbnB1dCkgb3IgQHBhdHRlcm5cblx0XHRcdEBzZXRQYXR0ZXJuKG5ld1BhdHRlcm4sIGZhbHNlKSBpZiBuZXdQYXR0ZXJuIGlzbnQgQHBhdHRlcm5SYXcgYW5kIG5ld1BhdHRlcm4gaXNudCBAcGF0dGVyblxuXHRcdFxuXHRcdHtjYXJldFRyYXBJbmRleGVzLCBwYXR0ZXJufSA9IEByZXNvbHZlUGF0dGVybihAcGF0dGVybiwgaW5wdXQpXG5cdFx0cmV0dXJuIEB2YWx1ZSBpZiBwYXR0ZXJuIGlzIGZhbHNlXG5cblx0XHRAcHJldlZhbHVlID0gQHZhbHVlXG5cdFx0QHByZXZDdXJzb3IgPSBAY3Vyc29yXG5cdFx0c3RhdGUgPSBAZ2V0U3RhdGUocGF0dGVybiwgaW5wdXQpXG5cdFx0e2NvbmZvcm1lZFZhbHVlfSA9IG1hc2tDb3JlLmNvbmZvcm1Ub01hc2soaW5wdXQsIHBhdHRlcm4sIHN0YXRlKVxuXG5cdFx0dHJhbnNmb3JtZWQgPSBAdHJhbnNmb3JtKGNvbmZvcm1lZFZhbHVlLCBzdGF0ZSkgaWYgQHRyYW5zZm9ybVxuXHRcdGlmIHRyYW5zZm9ybWVkIGlzIGZhbHNlXG5cdFx0XHRyZXR1cm4gQHZhbHVlXG5cdFx0aWYgSVMuc3RyaW5nKHRyYW5zZm9ybWVkKVxuXHRcdFx0Y29uZm9ybWVkVmFsdWUgPSB0cmFuc2Zvcm1lZFxuXHRcdGVsc2UgaWYgSVMub2JqZWN0KHRyYW5zZm9ybWVkKVxuXHRcdFx0aW5kZXhlc09mUGlwZWRDaGFycyA9IHRyYW5zZm9ybWVkLmluZGV4ZXNPZlBpcGVkQ2hhcnNcblx0XHRcdGNvbmZvcm1lZFZhbHVlID0gdHJhbnNmb3JtZWQudmFsdWVcblxuXG5cdFx0QGN1cnNvciA9IG1hc2tDb3JlLmFkanVzdENhcmV0UG9zaXRpb24gZXh0ZW5kIHN0YXRlLCB7XG5cdFx0XHRpbmRleGVzT2ZQaXBlZENoYXJzLCBjYXJldFRyYXBJbmRleGVzLCBjb25mb3JtZWRWYWx1ZVxuXHRcdH1cblxuXHRcdHJldHVybiBAdmFsdWUgPSBjb25mb3JtZWRWYWx1ZVxuXG5cblx0dmFsaWRhdGU6IChpbnB1dCktPlxuXHRcdGlmIGlucHV0IGlzbnQgQHZhbHVlIGFuZCBAcGF0dGVyblNldHRlclxuXHRcdFx0cGF0dGVybiA9IEBwYXR0ZXJuU2V0dGVyKGlucHV0KSBvciBAcGF0dGVyblxuXHRcdGVsc2Vcblx0XHRcdHBhdHRlcm4gPSBAcmVzb2x2ZWRQYXR0ZXJuXG5cdFx0XHR7cGF0dGVybn0gPSBAcmVzb2x2ZVBhdHRlcm4oQHBhdHRlcm4sIGlucHV0KSBpZiBub3QgcGF0dGVyblxuXG5cdFx0cmV0dXJuIHRydWUgaWYgcGF0dGVybiBpcyBmYWxzZVxuXHRcdFxuXHRcdGZvciBjaGFyLGkgaW4gcGF0dGVyblxuXHRcdFx0c3dpdGNoXG5cdFx0XHRcdHdoZW4gbm90IGlucHV0W2ldXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0XHRcdHdoZW4gSVMucmVnZXgoY2hhcikgYW5kIG5vdCBjaGFyLnRlc3QoaW5wdXRbaV0pXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0XHRcdHdoZW4gSVMuc3RyaW5nKGNoYXIpIGFuZCBpbnB1dFtpXSBpc250IGNoYXJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdHJldHVybiB0cnVlXG5cblx0aXNFbXB0eTogKCktPlxuXHRcdGlucHV0ID0gQHZhbHVlXG5cdFx0cGF0dGVybiA9IEByZXNvbHZlZFBhdHRlcm5cblx0XHRpZiBub3QgcGF0dGVyblxuXHRcdFx0cGF0dGVybiA9IEBwYXR0ZXJuU2V0dGVyKGlucHV0KSBpZiBAcGF0dGVyblNldHRlclxuXHRcdFx0e3BhdHRlcm59ID0gQHJlc29sdmVQYXR0ZXJuKHBhdHRlcm4gb3IgQHBhdHRlcm4sIGlucHV0KVxuXHRcdFxuXHRcdHJldHVybiB0cnVlIGlmIGlucHV0IGlzIEBjb25maWcucHJlZml4IG9yIGlucHV0IGlzIEBjb25maWcuc3VmZml4XG5cblx0XHRmb3IgY2hhcixpIGluIHBhdHRlcm5cblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIG5vdCBpbnB1dFtpXVxuXHRcdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRcdHdoZW4gSVMucmVnZXgoY2hhcilcblx0XHRcdFx0XHRyZXR1cm4gIWNoYXIudGVzdChpbnB1dFtpXSlcblx0XHRyZXR1cm4gZmFsc2VcblxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYXNrIiwibW9kdWxlLmV4cG9ydHMgPSBrZXlDb2RlcyA9XG5cdGRlbGV0ZTogOFxuXHRlbnRlcjogMTNcblx0ZXNjOiAyN1xuXHRjdHJsOiAxN1xuXHRhbHQ6IDE4XG5cdHNoaWZ0OiAxNlxuXHRzdXBlcjogOTFcblx0c3VwZXIyOiA5M1xuXHR1cDogMzhcblx0bGVmdDogMzdcblx0cmlnaHQ6IDM5XG5cdGRvd246IDQwXG5cdGh5cGhlbjogNDVcblx0dW5kZXJzY29yZTogOTVcblx0cXVlc3Rpb246IDYzXG5cdGV4Y2xhbWF0aW9uOiAzM1xuXHRmcm9udHNsYXNoOiA0N1xuXHRiYWNrc2xhc2g6IDkyXG5cdGNvbW1hOiA0NFxuXHRwZXJpb2Q6IDQ2XG5cdHNwYWNlOiAzMlxuXG5cdGFueUFycm93OiAoY29kZSktPlxuXHRcdGNvZGUgaXMga2V5Q29kZXMudXAgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmRvd24gb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmxlZnQgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLnJpZ2h0XG5cdFxuXHRhbnlNb2RpZmllcjogKGNvZGUpLT5cblx0XHRjb2RlIGlzIGtleUNvZGVzLmN0cmwgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmFsdCBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMuc2hpZnQgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLnN1cGVyIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5zdXBlcjJcblx0XG5cdGFueUFscGhhOiAoY29kZSktPlxuXHRcdDk3IDw9IGNvZGUgPD0gMTIyIG9yXG5cdFx0NjUgPD0gY29kZSA8PSA5MFxuXG5cdGFueU51bWVyaWM6IChjb2RlKS0+XG5cdFx0NDggPD0gY29kZSA8PSA1N1xuXG5cblx0YW55QWxwaGFOdW1lcmljOiAoY29kZSktPlxuXHRcdGtleUNvZGVzLmFueUFscGhhKGNvZGUpIG9yXG5cdFx0a2V5Q29kZXMuYW55TnVtZXJpYyhjb2RlKVxuXG5cdGFueVByaW50YWJsZTogKGNvZGUpLT5cblx0XHRrZXlDb2Rlcy5hbnlBbHBoYShjb2RlKSBvclxuXHRcdGtleUNvZGVzLmFueU51bWVyaWMoY29kZSkgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmh5cGhlbiBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMudW5kZXJzY29yZSBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMucXVlc3Rpb24gb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmV4Y2xhbWF0aW9uIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5mcm9udHNsYXNoIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5iYWNrc2xhc2ggb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLmNvbW1hIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5wZXJpb2Qgb3IgXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5zcGFjZVxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5DT0xPUlMgPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9jb2xvcnMnXG5DSEVDS01BUktfV0lEVEggPSAyNlxuXG5leHBvcnQgZGVmYXVsdCBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2ZpZWxkJ1xuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdHZlcnRpY2FsQWxpZ246ICd0b3AnXG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRmb250RmFtaWx5OiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuZm9udEZhbWlseVxuXHRcdFx0dGV4dEFsaWduOiAnbGVmdCdcblx0XHRcdCR2aXNpYmxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuXHRcdFx0JHNob3dFcnJvcjpcblx0XHRcdFx0YW5pbWF0aW9uOiAnMC4ycyBmaWVsZEVycm9yU2hha2UnXG5cblx0XHRbJ2Rpdidcblx0XHRcdHJlZjogJ2xhYmVsJ1xuXHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdHpJbmRleDogMVxuXHRcdFx0XHR0b3A6IChmaWVsZCktPiBAc3R5bGVQYXJzZWQoJ2ZvbnRTaXplJywgdHJ1ZSkgKiAwLjdcblx0XHRcdFx0bGVmdDogKGZpZWxkKS0+IGhlbHBlcnMuc2hvcnRoYW5kU2lkZVZhbHVlKGZpZWxkLnNldHRpbmdzLnBhZGRpbmcsICdsZWZ0JykgKyAoZmllbGQuZWwuY2hpbGQuaWNvbj8ud2lkdGggb3IgMClcblx0XHRcdFx0cGFkZGluZzogKGZpZWxkKS0+IFwiMCAje2ZpZWxkLnNldHRpbmdzLmlucHV0UGFkZGluZ31weFwiXG5cdFx0XHRcdGZvbnRGYW1pbHk6ICdpbmhlcml0J1xuXHRcdFx0XHRmb250U2l6ZTogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmxhYmVsU2l6ZSBvciBmaWVsZC5zZXR0aW5ncy5mb250U2l6ZSAqICgxMS8xNClcblx0XHRcdFx0Zm9udFdlaWdodDogNjAwXG5cdFx0XHRcdGxpbmVIZWlnaHQ6IDFcblx0XHRcdFx0Y29sb3I6IENPTE9SUy5ncmV5XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0dHJhbnNpdGlvbjogJ29wYWNpdHkgMC4ycywgY29sb3IgMC4ycydcblx0XHRcdFx0d2hpdGVTcGFjZTogJ25vd3JhcCdcblx0XHRcdFx0dXNlclNlbGVjdDogJ25vbmUnXG5cdFx0XHRcdGN1cnNvcjogJ2RlZmF1bHQnXG5cdFx0XHRcdHBvaW50ZXJFdmVudHM6ICdub25lJ1xuXHRcdFx0XHQkZmlsbGVkOiAkc2hvd0xhYmVsOlxuXHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0JGZvY3VzOlxuXHRcdFx0XHRcdGNvbG9yOiBDT0xPUlMub3JhbmdlXG5cdFx0XHRcdCRzaG93RXJyb3I6XG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5yZWRcblx0XHRdXG5cblx0XHRbJ2Rpdidcblx0XHRcdHJlZjogJ2lubmVyd3JhcCdcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0XHRoZWlnaHQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5oZWlnaHRcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAnd2hpdGUnXG5cdFx0XHRcdGJvcmRlcldpZHRoOiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuYm9yZGVyXG5cdFx0XHRcdGJvcmRlclN0eWxlOiAnc29saWQnXG5cdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMuZ3JleV9saWdodFxuXHRcdFx0XHRib3JkZXJSYWRpdXM6ICcycHgnXG5cdFx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRcdGZvbnRGYW1pbHk6ICdpbmhlcml0J1xuXHRcdFx0XHR0cmFuc2l0aW9uOiAnYm9yZGVyLWNvbG9yIDAuMnMnXG5cdFx0XHRcdCRmb2N1czpcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLm9yYW5nZVxuXHRcdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMucmVkXG5cdFx0XHRcdCRkaXNhYmxlZDpcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLmdyZXlfbGlnaHRcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5ncmV5X2xpZ2h0XG5cblx0XHRcdFsnaW5wdXQnXG5cdFx0XHRcdHJlZjogJ2lucHV0J1xuXHRcdFx0XHR0eXBlOiAndGV4dCdcblx0XHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0XHRcdHpJbmRleDogM1xuXHRcdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHRcdFx0dmVydGljYWxBbGlnbjogJ3RvcCdcblx0XHRcdFx0XHRoZWlnaHQ6ICgpLT4gQHBhcmVudC5zdHlsZVNhZmUoJ2hlaWdodCcsMSkgb3IgQHBhcmVudC5zdHlsZVNhZmUoJ2hlaWdodCcpXG5cdFx0XHRcdFx0d2lkdGg6IChmaWVsZCktPiBpZiBub3QgZmllbGQuc2V0dGluZ3MuYXV0b1dpZHRoXG5cdFx0XHRcdFx0XHRzdWJ0cmFjdCA9IDBcblx0XHRcdFx0XHRcdGlmIGljb25TaWJsaW5nID0gZmllbGQuZWwuY2hpbGQuaWNvblxuXHRcdFx0XHRcdFx0XHRzdWJ0cmFjdCArPSBpY29uU2libGluZy53aWR0aFxuXHRcdFx0XHRcdFx0aWYgaW5wdXRTaWJsaW5nID0gZmllbGQuZWwuY2hpbGRbZmllbGQuc2V0dGluZ3MuaW5wdXRTaWJsaW5nXVxuXHRcdFx0XHRcdFx0XHR3aWR0aCA9IGlucHV0U2libGluZy5zdHlsZVBhcnNlZCgnd2lkdGgnLDEpIG9yIDBcblx0XHRcdFx0XHRcdFx0cGFkZGluZyA9IGlucHV0U2libGluZy5zdHlsZVBhcnNlZCgncGFkZGluZycsMSkgb3IgMFxuXHRcdFx0XHRcdFx0XHRwYWRkaW5nTGVmdCA9IGlucHV0U2libGluZy5zdHlsZVBhcnNlZCgncGFkZGluZ0xlZnQnLDEpIG9yIHBhZGRpbmcgb3IgMFxuXHRcdFx0XHRcdFx0XHRwYWRkaW5nUmlnaHQgPSBpbnB1dFNpYmxpbmcuc3R5bGVQYXJzZWQoJ3BhZGRpbmdSaWdodCcsMSkgb3IgcGFkZGluZyBvciAwXG5cdFx0XHRcdFx0XHRcdHN1YnRyYWN0ICs9IHdpZHRoK3BhZGRpbmdMZWZ0K3BhZGRpbmdSaWdodFxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiY2FsYygxMDAlIC0gI3tzdWJ0cmFjdH1weClcIlxuXG5cdFx0XHRcdFx0cGFkZGluZzogKGZpZWxkKS0+XG5cdFx0XHRcdFx0XHRAcGFkZGluZyA/PSBNYXRoLm1heCAwLCBoZWxwZXJzLmNhbGNQYWRkaW5nKGZpZWxkLnNldHRpbmdzLmhlaWdodCwgMTQpLTNcblx0XHRcdFx0XHRcdHJldHVybiBcIiN7QHBhZGRpbmd9cHggI3tmaWVsZC5zZXR0aW5ncy5pbnB1dFBhZGRpbmd9cHhcIlxuXHRcdFx0XHRcblx0XHRcdFx0XHRtYXJnaW46ICcwJ1xuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xuXHRcdFx0XHRcdGFwcGVhcmFuY2U6ICdub25lJ1xuXHRcdFx0XHRcdGJvcmRlcjogJ25vbmUnXG5cdFx0XHRcdFx0b3V0bGluZTogJ25vbmUnXG5cdFx0XHRcdFx0Zm9udEZhbWlseTogJ2luaGVyaXQnXG5cdFx0XHRcdFx0Zm9udFNpemU6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5mb250U2l6ZVxuXHRcdFx0XHRcdGNvbG9yOiBDT0xPUlMuYmxhY2tcblx0XHRcdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0XHRcdGJveFNoYWRvdzogJ25vbmUnXG5cdFx0XHRcdFx0d2hpdGVTcGFjZTogJ25vd3JhcCdcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ2xpcDogJ2NvbnRlbnQtYm94JyAjIHNlbWktZml4IGZvciB5ZWxsb3cgYXV0b2ZpbGwgYmFja2dyb3VuZFxuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknXG5cdFx0XHRcdFx0dHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAwLjJzLCAtd2Via2l0LXRyYW5zZm9ybSAwLjJzJ1xuXHRcdFx0XHRcdCRkaXNhYmxlZDpcblx0XHRcdFx0XHRcdGN1cnNvcjogJ25vdC1hbGxvd2VkJ1xuXHRcdFx0XHRcdCRmaWxsZWQ6ICRzaG93TGFiZWw6XG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm06IChmaWVsZCktPlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQHRyYW5zbGF0aW9uIGlmIEB0cmFuc2xhdGlvbj8gb3Igbm90IChsYWJlbD1maWVsZC5lbC5jaGlsZC5sYWJlbCkgb3IgbGFiZWwuc3R5bGVTYWZlKCdwb3NpdGlvbicsMSkgaXNudCAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0XHRcdHRvdGFsSGVpZ2h0ID0gQHBhcmVudC5zdHlsZVBhcnNlZCgnaGVpZ2h0JywxKVxuXHRcdFx0XHRcdFx0XHR3b3JrYWJsZUhlaWdodCA9IHRvdGFsSGVpZ2h0IC0gKGxhYmVsLnN0eWxlUGFyc2VkKCdmb250U2l6ZScsMSkgKyBsYWJlbC5zdHlsZVBhcnNlZCgndG9wJywxKSoyKVxuXHRcdFx0XHRcdFx0XHR0cmFuc2xhdGlvbiA9IE1hdGgubWF4IDAsIE1hdGguZmxvb3IgKHRvdGFsSGVpZ2h0LXdvcmthYmxlSGVpZ2h0KS80XG5cdFx0XHRcdFx0XHRcdHJldHVybiBcInRyYW5zbGF0ZVkoI3t0cmFuc2xhdGlvbn1weClcIlxuXHRcdFx0XHRcdFxuXHRcdFx0XVxuXG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAncGxhY2Vob2xkZXInXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR6SW5kZXg6IDJcblx0XHRcdFx0XHR0b3A6ICcwcHgnXG5cdFx0XHRcdFx0bGVmdDogKGZpZWxkKS0+IGZpZWxkLmVsLmNoaWxkLmljb24/LndpZHRoIG9yIDBcblx0XHRcdFx0XHRmb250RmFtaWx5OiAoZmllbGQpLT4gZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVTYWZlKCdmb250RmFtaWx5JywxKVxuXHRcdFx0XHRcdGZvbnRTaXplOiAoZmllbGQpLT4gZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVTYWZlKCdmb250U2l6ZScsMSlcblx0XHRcdFx0XHRwYWRkaW5nOiAoZmllbGQpLT5cblx0XHRcdFx0XHRcdHZlcnRpID0gZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdUb3AnLDEpIG9yIGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlUGFyc2VkKCdwYWRkaW5nVG9wJylcblx0XHRcdFx0XHRcdGhvcml6ID0gZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdMZWZ0JywxKSBvciBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVBhcnNlZCgncGFkZGluZ0xlZnQnKVxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiI3t2ZXJ0aSszfXB4ICN7aG9yaXp9cHhcIlxuXG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5ibGFja1xuXHRcdFx0XHRcdG9wYWNpdHk6IDAuNVxuXHRcdFx0XHRcdHBvaW50ZXJFdmVudHM6ICdub25lJ1xuXHRcdFx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXHRcdFx0XHRcdHdoaXRlU3BhY2U6ICdub3dyYXAnXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSdcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDAuMnMsIC13ZWJraXQtdHJhbnNmb3JtIDAuMnMnXG5cdFx0XHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0XHRcdHZpc2liaWxpdHk6ICdoaWRkZW4nXG5cdFx0XHRcdFx0XHQkc2hvd0xhYmVsOlxuXHRcdFx0XHRcdFx0XHR0cmFuc2Zvcm06IChmaWVsZCktPiBmaWVsZC5lbC5jaGlsZC5pbnB1dC5yYXcuc3R5bGUudHJhbnNmb3JtXG5cdFx0XHRdXG5cdFx0XVxuXHRcdFxuXHRcdFsnZGl2J1xuXHRcdFx0cmVmOiAnaGVscCdcblx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHR0b3A6ICcxMTAlJ1xuXHRcdFx0XHRsZWZ0OiAoZmllbGQpLT4gaGVscGVycy5zaG9ydGhhbmRTaWRlVmFsdWUoZmllbGQuc2V0dGluZ3MucGFkZGluZywgJ2xlZnQnKVxuXHRcdFx0XHRmb250RmFtaWx5OiAnaW5oZXJpdCdcblx0XHRcdFx0Zm9udFNpemU6ICcxMXB4J1xuXHRcdFx0XHRjb2xvcjogQ09MT1JTLmdyZXlcblx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRcdCRzaG93RXJyb3I6XG5cdFx0XHRcdFx0Y29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0JHNob3dIZWxwOlxuXHRcdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IGljb24gPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2ljb24nXG5cdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdHpJbmRleDogMlxuXHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHR3aWR0aDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmljb25TaXplXG5cdFx0XHRoZWlnaHQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZVxuXHRcdFx0Zm9udFNpemU6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZVxuXHRcdFx0cGFkZGluZ0xlZnQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pbnB1dFBhZGRpbmdcblx0XHRcdHBhZGRpbmdUb3A6IChmaWVsZCktPiBAcGFyZW50LnN0eWxlUGFyc2VkKCdoZWlnaHQnLDEpLzIgLSBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZS8yXG5cdFx0XHRsaW5lSGVpZ2h0OiAnMWVtJ1xuXHRcdFx0dXNlclNlbGVjdDogJ25vbmUnXG5cblx0XHRtZXRob2RzOlxuXHRcdFx0d2lkdGg6IGdldDogKCktPlxuXHRcdFx0XHRpZiBAX2luc2VydGVkXG5cdFx0XHRcdFx0QHJhdy5vZmZzZXRXaWR0aFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0QHN0eWxlUGFyc2VkKCd3aWR0aCcsMSkgb3IgQHJlbGF0ZWQuc2V0dGluZ3MuaWNvblNpemVcblx0XHRcdFx0IyBAc3R5bGVQYXJzZWQoJ3dpZHRoJywxKSBvciBAcmF3Lm9mZnNldFdpZHRoIG9yIEByZWxhdGVkLnNldHRpbmdzLmljb25TaXplIG9yIDBcblx0XVxuKVxuXG5cbmV4cG9ydCBjaGVja21hcmsgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2NoZWNrbWFyaydcblx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0ekluZGV4OiA0XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdHdpZHRoOiAyNlxuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdHBhZGRpbmdUb3A6ICgpLT4gQHBhcmVudC5zdHlsZVBhcnNlZCgnaGVpZ2h0JywxKS8yIC0gMTNcblx0XHRcdHBhZGRpbmdSaWdodDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmlucHV0UGFkZGluZ1xuXHRcdFx0dmVydGljYWxBbGlnbjogJ3RvcCdcblx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cblx0XHRbJ2Rpdidcblx0XHRcdHJlZjogJ2NoZWNrbWFya19pbm5lcndyYXAnXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0d2lkdGg6ICcyMHB4J1xuXHRcdFx0XHRoZWlnaHQ6ICcyMHB4J1xuXHRcdFx0XHRib3JkZXJSYWRpdXM6ICc1MCUnXG5cdFx0XHRcdGJvcmRlcldpZHRoOiAnM3B4J1xuXHRcdFx0XHRib3JkZXJTdHlsZTogJ3NvbGlkJ1xuXHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLmdyZWVuXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3NjYWxlKDAuOCknXG5cdFx0XHRcdCMgdHJhbnNmb3JtT3JpZ2luOiAnMTAwJSAwJ1xuXHRcdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRcdGJvcmRlckNvbG9yOiBDT0xPUlMucmVkXG5cblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbWFzazEnXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR0b3A6ICctNHB4J1xuXHRcdFx0XHRcdGxlZnQ6ICctMTBweCdcblx0XHRcdFx0XHR3aWR0aDogJzE1cHgnXG5cdFx0XHRcdFx0aGVpZ2h0OiAnMzBweCdcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICczMHB4IDAgMCAzMHB4J1xuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogKGZpZWxkKS0+IGhlbHBlcnMuZGVmYXVsdENvbG9yIGZpZWxkLmVscy5pbm5lcndyYXAuc3R5bGVTYWZlKCdiYWNrZ3JvdW5kQ29sb3InLDEpLCAnd2hpdGUnXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG5cdFx0XHRcdFx0dHJhbnNmb3JtT3JpZ2luOiAnMTVweCAxNXB4IDAnXG5cdFx0XHRdXG5cdFx0XHRcblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbWFzazInXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHR0b3A6ICctNXB4J1xuXHRcdFx0XHRcdGxlZnQ6ICc4cHgnXG5cdFx0XHRcdFx0d2lkdGg6ICcxNXB4J1xuXHRcdFx0XHRcdGhlaWdodDogJzMwcHgnXG5cdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnMCAzMHB4IDMwcHggMCdcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IChmaWVsZCktPiBoZWxwZXJzLmRlZmF1bHRDb2xvciBmaWVsZC5lbHMuaW5uZXJ3cmFwLnN0eWxlU2FmZSgnYmFja2dyb3VuZENvbG9yJywxKSwgJ3doaXRlJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybU9yaWdpbjogJzAgMTVweCAwJ1xuXHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRhbmltYXRpb246ICc0LjI1cyBlYXNlLWluIGNoZWNrbWFya1JvdGF0ZVBsYWNlaG9sZGVyJ1xuXHRcdFx0XHRcdFx0JGludmFsaWQ6XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJydcblx0XHRcdF1cblx0XHRcdFxuXHRcdFx0WydkaXYnXG5cdFx0XHRcdHJlZjogJ2NoZWNrbWFya19saW5lV3JhcHBlcidcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0JGZpbGxlZDogJGludmFsaWQ6XG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuXHRcdFx0XHRcdFx0ekluZGV4OiAyXG5cdFx0XHRcdFx0XHRhbmltYXRpb246ICcwLjU1cyBjaGVja21hcmtBbmltYXRlRXJyb3InXG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm1PcmlnaW46ICc1MCUgMTBweCdcblxuXHRcdFx0XHRbJ2Rpdidcblx0XHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbGluZVNob3J0J1xuXHRcdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdFx0dG9wOiAnMTBweCdcblx0XHRcdFx0XHRcdGxlZnQ6ICczcHgnXG5cdFx0XHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHRcdFx0XHR3aWR0aDogJzhweCdcblx0XHRcdFx0XHRcdGhlaWdodDogJzNweCdcblx0XHRcdFx0XHRcdGJvcmRlclJhZGl1czogJzJweCdcblx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQ09MT1JTLmdyZWVuXG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGUoNDVkZWcpJ1xuXHRcdFx0XHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnMC43NXMgY2hlY2ttYXJrQW5pbWF0ZVN1Y2Nlc3NUaXAnXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdCRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0XHRcdFx0bGVmdDogJzRweCdcblx0XHRcdFx0XHRcdFx0dG9wOiAnOHB4J1xuXHRcdFx0XHRcdFx0XHR3aWR0aDogJzEycHgnXG5cdFx0XHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnJ1xuXHRcdFx0XHRdXG5cblx0XHRcdFx0WydkaXYnXG5cdFx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX2xpbmVMb25nJ1xuXHRcdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdFx0dG9wOiAnOHB4J1xuXHRcdFx0XHRcdFx0cmlnaHQ6ICcycHgnXG5cdFx0XHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHRcdFx0XHR3aWR0aDogJzEycHgnXG5cdFx0XHRcdFx0XHRoZWlnaHQ6ICczcHgnXG5cdFx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICcycHgnXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5ncmVlblxuXHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG5cdFx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0XHRhbmltYXRpb246ICcwLjc1cyBjaGVja21hcmtBbmltYXRlU3VjY2Vzc0xvbmcnXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdCRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5yZWRcblx0XHRcdFx0XHRcdFx0dG9wOiAnOHB4J1xuXHRcdFx0XHRcdFx0XHRsZWZ0OiAnNHB4J1xuXHRcdFx0XHRcdFx0XHRyaWdodDogJ2F1dG8nXG5cdFx0XHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnJ1xuXHRcdFx0XHRdXG5cdFx0XHRdXG5cdFx0XHRcblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfcGxhY2Vob2xkZXInXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0ekluZGV4OiAyXG5cdFx0XHRcdFx0dG9wOiAnLTRweCdcblx0XHRcdFx0XHRsZWZ0OiAnLTNweCdcblx0XHRcdFx0XHR3aWR0aDogJzIwcHgnXG5cdFx0XHRcdFx0aGVpZ2h0OiAnMjBweCdcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICc1MCUnXG5cdFx0XHRcdFx0Ym9yZGVyV2lkdGg6ICczcHgnXG5cdFx0XHRcdFx0Ym9yZGVyU3R5bGU6ICdzb2xpZCdcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogaGVscGVycy5oZXhUb1JHQkEoQ09MT1JTLmdyZWVuLCAwLjQpXG5cdFx0XHRcdFx0JGludmFsaWQ6XG5cdFx0XHRcdFx0XHRib3JkZXJDb2xvcjogaGVscGVycy5oZXhUb1JHQkEoQ09MT1JTLnJlZCwgMC40KVxuXHRcdFx0XVxuXHRcdFx0XG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX3BhdGNoJ1xuXHRcdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0ekluZGV4OiAxXG5cdFx0XHRcdFx0dG9wOiAnLTJweCdcblx0XHRcdFx0XHRsZWZ0OiAnNnB4J1xuXHRcdFx0XHRcdHdpZHRoOiAnNHB4J1xuXHRcdFx0XHRcdGhlaWdodDogJzI4cHgnXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAoZmllbGQpLT4gaGVscGVycy5kZWZhdWx0Q29sb3IgZmllbGQuZWxzLmlubmVyd3JhcC5zdHlsZVNhZmUoJ2JhY2tncm91bmRDb2xvcicsMSksICd3aGl0ZSdcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSdcblx0XHRcdF1cblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPVxuXHRwbGFjZWhvbGRlcjogdHJ1ZVxuXHR2YWxpZFdoZW5Jc0Nob2ljZTogZmFsc2Vcblx0dmFsaWRXaGVuUmVnZXg6IGZhbHNlXG5cdGF1dG9XaWR0aDogZmFsc2Vcblx0bWF4V2lkdGg6ICcxMDAlJ1xuXHRtaW5XaWR0aDogMlxuXHRoZWlnaHQ6IDQ2XG5cdGNoZWNrbWFyazogdHJ1ZVxuXHRrZXlib2FyZDogJ3RleHQnXG5cdGRyb3Bkb3duOiB7bG9ja1Njcm9sbDpmYWxzZX1cblx0Y2hvaWNlczogbnVsbFxuXHRtaW5MZW5ndGg6IG51bGxcblx0bWF4TGVuZ3RoOiBudWxsXG5cdGlucHV0U2libGluZzogJ2NoZWNrbWFyaydcblx0bWFzazpcblx0XHRwYXR0ZXJuOiBmYWxzZVxuXHRcdHBsYWNlaG9sZGVyOiAnXydcblx0XHRndWlkZTogdHJ1ZVxuXHRcdGN1c3RvbVBhdHRlcm5zOiBmYWxzZSIsImltcG9ydCB7SU1QT1JUQU5ULCBSRUdFWF9LRUJBQiwgUkVHRVhfU1BBQ0UsIFJFR0VYX0RJR0lUUywgUkVHRVhfTEVOX1ZBTCwgUE9TU0lCTEVfUFJFRklYRVMsIFJFUVVJUkVTX1VOSVRfVkFMVUV9IGZyb20gJy4vY29uc3RhbnRzJ1xuU0FNUExFX1NUWUxFID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jykuc3R5bGVcblxuZXhwb3J0IGluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPlxuXHR0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuZXhwb3J0IGlzSXRlcmFibGUgPSAodGFyZ2V0KS0+XG5cdHRhcmdldCBhbmRcblx0dHlwZW9mIHRhcmdldCBpcyAnb2JqZWN0JyBhbmRcblx0dHlwZW9mIHRhcmdldC5sZW5ndGggaXMgJ251bWJlcicgYW5kXG5cdG5vdCB0YXJnZXQubm9kZVR5cGVcblxuZXhwb3J0IHRvS2ViYWJDYXNlID0gKHN0cmluZyktPlxuXHRzdHJpbmcucmVwbGFjZSBSRUdFWF9LRUJBQiwgKGUsbGV0dGVyKS0+IFwiLSN7bGV0dGVyLnRvTG93ZXJDYXNlKCl9XCJcblxuZXhwb3J0IGlzUHJvcFN1cHBvcnRlZCA9IChwcm9wZXJ0eSktPlxuXHR0eXBlb2YgU0FNUExFX1NUWUxFW3Byb3BlcnR5XSBpc250ICd1bmRlZmluZWQnXG5cbmV4cG9ydCBpc1ZhbHVlU3VwcG9ydGVkID0gKHByb3BlcnR5LCB2YWx1ZSktPlxuXHRpZiB3aW5kb3cuQ1NTIGFuZCB3aW5kb3cuQ1NTLnN1cHBvcnRzXG5cdFx0cmV0dXJuIHdpbmRvdy5DU1Muc3VwcG9ydHMocHJvcGVydHksIHZhbHVlKVxuXHRlbHNlXG5cdFx0U0FNUExFX1NUWUxFW3Byb3BlcnR5XSA9IHZhbHVlXG5cdFx0cmV0dXJuIFNBTVBMRV9TVFlMRVtwcm9wZXJ0eV0gaXMgJycrdmFsdWVcblxuZXhwb3J0IGdldFByZWZpeCA9IChwcm9wZXJ0eSwgc2tpcEluaXRpYWxDaGVjayktPlxuXHRpZiBza2lwSW5pdGlhbENoZWNrIG9yIG5vdCBpc1Byb3BTdXBwb3J0ZWQocHJvcGVydHkpXG5cdFx0Zm9yIHByZWZpeCBpbiBQT1NTSUJMRV9QUkVGSVhFU1xuXHRcdFx0IyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuXHRcdFx0cmV0dXJuIFwiLSN7cHJlZml4fS1cIiBpZiBpc1Byb3BTdXBwb3J0ZWQoXCItI3twcmVmaXh9LSN7cHJvcGVydHl9XCIpXG5cdFxuXHRyZXR1cm4gJydcblxuZXhwb3J0IG5vcm1hbGl6ZVByb3BlcnR5ID0gKHByb3BlcnR5KS0+XHRcblx0cHJvcGVydHkgPSB0b0tlYmFiQ2FzZShwcm9wZXJ0eSlcblx0XG5cdGlmIGlzUHJvcFN1cHBvcnRlZChwcm9wZXJ0eSlcblx0XHRyZXR1cm4gcHJvcGVydHlcblx0ZWxzZVxuXHRcdHJldHVybiBcIiN7Z2V0UHJlZml4KHByb3BlcnR5LHRydWUpfSN7cHJvcGVydHl9XCJcblxuZXhwb3J0IG5vcm1hbGl6ZVZhbHVlID0gKHByb3BlcnR5LCB2YWx1ZSktPlxuXHRpZiBpbmNsdWRlcyhSRVFVSVJFU19VTklUX1ZBTFVFLCBwcm9wZXJ0eSkgYW5kIHZhbHVlIGlzbnQgbnVsbFxuXHRcdHZhbHVlID0gJycrdmFsdWVcblx0XHRpZiAgUkVHRVhfRElHSVRTLnRlc3QodmFsdWUpIGFuZFxuXHRcdFx0bm90IFJFR0VYX0xFTl9WQUwudGVzdCh2YWx1ZSkgYW5kXG5cdFx0XHRub3QgUkVHRVhfU1BBQ0UudGVzdCh2YWx1ZSlcblx0XHRcdFx0dmFsdWUgKz0gaWYgcHJvcGVydHkgaXMgJ2xpbmUtaGVpZ2h0JyB0aGVuICdlbScgZWxzZSAncHgnXG5cblx0cmV0dXJuIHZhbHVlXG5cblxuZXhwb3J0IHNvcnQgPSAoYXJyYXkpLT5cblx0aWYgYXJyYXkubGVuZ3RoIDwgMlxuXHRcdHJldHVybiBhcnJheVxuXHRlbHNlXG5cdFx0cGl2b3QgPSBhcnJheVswXTsgbGVzcyA9IFtdOyBncmVhdCA9IFtdOyBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPSAwO1xuXHRcdFxuXHRcdHdoaWxlICsraSBpc250IGxlblxuXHRcdFx0aWYgYXJyYXlbaV0gPD0gcGl2b3Rcblx0XHRcdFx0bGVzcy5wdXNoKGFycmF5W2ldKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRncmVhdC5wdXNoKGFycmF5W2ldKVxuXG5cdFx0cmV0dXJuIHNvcnQobGVzcykuY29uY2F0KHBpdm90LCBzb3J0KGdyZWF0KSlcblxuXG5leHBvcnQgaGFzaCA9IChzdHJpbmcpLT5cblx0aHNoID0gNTM4MTsgaSA9IC0xOyBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG5cdFxuXHR3aGlsZSArK2kgaXNudCBzdHJpbmcubGVuZ3RoXG5cdFx0aHNoID0gKChoc2ggPDwgNSkgLSBoc2gpICsgc3RyaW5nLmNoYXJDb2RlQXQoaSlcblx0XHRoc2ggfD0gMFxuXG5cdHJldHVybiAnXycrKGlmIGhzaCA8IDAgdGhlbiBoc2ggKiAtMiBlbHNlIGhzaClcblxuXG5leHBvcnQgcnVsZVRvU3RyaW5nID0gKHJ1bGUsIGltcG9ydGFudCktPlxuXHRvdXRwdXQgPSAnJ1xuXHRwcm9wcyA9IHNvcnQoT2JqZWN0LmtleXMocnVsZSkpXG5cdFxuXHRmb3IgcHJvcCBpbiBwcm9wc1xuXHRcdGlmIHR5cGVvZiBydWxlW3Byb3BdIGlzICdzdHJpbmcnIG9yIHR5cGVvZiBydWxlW3Byb3BdIGlzICdudW1iZXInXG5cdFx0XHRwcm9wZXJ0eSA9IG5vcm1hbGl6ZVByb3BlcnR5KHByb3ApXG5cdFx0XHR2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHByb3BlcnR5LCBydWxlW3Byb3BdKVxuXHRcdFx0dmFsdWUgKz0gXCIgIWltcG9ydGFudFwiIGlmIGltcG9ydGFudFxuXHRcdFx0b3V0cHV0ICs9IFwiI3twcm9wZXJ0eX06I3t2YWx1ZX07XCJcblx0XG5cdHJldHVybiBvdXRwdXRcblxuZXhwb3J0IGlubGluZVN0eWxlQ29uZmlnID0gc3R5bGVDb25maWcgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5leHBvcnQgaW5saW5lU3R5bGUgPSAocnVsZSwgdmFsdWVUb1N0b3JlLCBsZXZlbCktPlxuXHRpZiBub3QgY29uZmlnPXN0eWxlQ29uZmlnW2xldmVsXVxuXHRcdHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG5cdFx0c3R5bGVFbC5pZCA9IFwicXVpY2tjc3Mje2xldmVsIG9yICcnfVwiXG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKVxuXHRcdHN0eWxlQ29uZmlnW2xldmVsXSA9IGNvbmZpZyA9IGVsOnN0eWxlRWwsIGNvbnRlbnQ6JycsIGNhY2hlOk9iamVjdC5jcmVhdGUobnVsbClcblx0XG5cdHVubGVzcyBjb25maWcuY2FjaGVbcnVsZV1cblx0XHRjb25maWcuY2FjaGVbcnVsZV0gPSB2YWx1ZVRvU3RvcmUgb3IgdHJ1ZVxuXHRcdGNvbmZpZy5lbC50ZXh0Q29udGVudCA9IGNvbmZpZy5jb250ZW50ICs9IHJ1bGVcblx0XG5cdHJldHVyblxuXG5cbmV4cG9ydCBjbGVhcklubGluZVN0eWxlID0gKGxldmVsKS0+IGlmIGNvbmZpZyA9IHN0eWxlQ29uZmlnW2xldmVsXVxuXHRyZXR1cm4gaWYgbm90IGNvbmZpZy5jb250ZW50XG5cdGNvbmZpZy5lbC50ZXh0Q29udGVudCA9IGNvbmZpZy5jb250ZW50ID0gJydcblx0a2V5cyA9IE9iamVjdC5rZXlzKGNvbmZpZy5jYWNoZSlcblx0Y29uZmlnLmNhY2hlW2tleV0gPSBudWxsIGZvciBrZXkgaW4ga2V5c1xuXHRyZXR1cm5cblxuXG5cblxuXG4iLCJleHBvcnQgUkVHRVhfTEVOX1ZBTCA9IC9eXFxkKyg/OlthLXpdfFxcJSkrJC9pXG5leHBvcnQgUkVHRVhfRElHSVRTID0gL1xcZCskL1xuZXhwb3J0IFJFR0VYX1NQQUNFID0gL1xccy9cbmV4cG9ydCBSRUdFWF9LRUJBQiA9IC8oW0EtWl0pKy9nXG5leHBvcnQgSU1QT1JUQU5UID0gJ2ltcG9ydGFudCdcblxuZXhwb3J0IFBPU1NJQkxFX1BSRUZJWEVTID0gW1xuXHQnd2Via2l0J1xuXHQnbW96J1xuXHQnbXMnXG5cdCdvJ1xuXVxuZXhwb3J0IFJFUVVJUkVTX1VOSVRfVkFMVUUgPSBbXG5cdCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnXG5cdCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknXG5cdCdibG9jay1zaXplJ1xuXHQnYm9yZGVyLXdpZHRoJ1xuXHQnY29sdW1uUnVsZS13aWR0aCdcblx0J2N4J1xuXHQnY3knXG5cdCdmb250LXNpemUnXG5cdCdncmlkLWNvbHVtbi1nYXAnXG5cdCdncmlkLXJvdy1nYXAnXG5cdCdoZWlnaHQnXG5cdCdpbmxpbmUtc2l6ZSdcblx0J2xpbmUtaGVpZ2h0J1xuXHQnbWluQmxvY2stc2l6ZSdcblx0J21pbi1oZWlnaHQnXG5cdCdtaW4taW5saW5lLXNpemUnXG5cdCdtaW4td2lkdGgnXG5cdCdtYXgtaGVpZ2h0J1xuXHQnbWF4LXdpZHRoJ1xuXHQnb3V0bGluZS1vZmZzZXQnXG5cdCdvdXRsaW5lLXdpZHRoJ1xuXHQncGVyc3BlY3RpdmUnXG5cdCdzaGFwZS1tYXJnaW4nXG5cdCdzdHJva2UtZGFzaG9mZnNldCdcblx0J3N0cm9rZS13aWR0aCdcblx0J3RleHQtaW5kZW50J1xuXHQnd2lkdGgnXG5cdCd3b3JkLXNwYWNpbmcnXG5cdCd0b3AnXG5cdCdib3R0b20nXG5cdCdsZWZ0J1xuXHQncmlnaHQnXG5cdCd4J1xuXHQneSdcbl1cblxuZXhwb3J0IFFVQURfU0hPUlRIQU5EUyA9IFtcblx0J21hcmdpbidcblx0J3BhZGRpbmcnXG5cdCdib3JkZXInXG5cdCdib3JkZXItcmFkaXVzJ1xuXVxuZXhwb3J0IERJUkVDVElPTlMgPSBbJ3RvcCcsJ2JvdHRvbScsJ2xlZnQnLCdyaWdodCddXG5cblFVQURfU0hPUlRIQU5EUy5mb3JFYWNoIChwcm9wZXJ0eSktPlxuXHRSRVFVSVJFU19VTklUX1ZBTFVFLnB1c2ggcHJvcGVydHlcblx0Zm9yIGRpcmVjdGlvbiBpbiBESVJFQ1RJT05TXG5cdFx0UkVRVUlSRVNfVU5JVF9WQUxVRS5wdXNoIHByb3BlcnR5KyctJytkaXJlY3Rpb25cblx0cmV0dXJuXG5cblxuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID1cblx0ZGVmaW5lZDogKHN1YmplY3QpLT4gc3ViamVjdCBpc250IHVuZGVmaW5lZFxuXHRcblx0YXJyYXk6IChzdWJqZWN0KS0+IHN1YmplY3QgaW5zdGFuY2VvZiBBcnJheVxuXHRcblx0b2JqZWN0OiAoc3ViamVjdCktPiB0eXBlb2Ygc3ViamVjdCBpcyAnb2JqZWN0JyBhbmQgc3ViamVjdCAjIDJuZCBjaGVjayBpcyB0byB0ZXN0IGFnYWluc3QgJ251bGwnIHZhbHVlc1xuXG5cdG9iamVjdFBsYWluOiAoc3ViamVjdCktPiBleHBvcnRzLm9iamVjdChzdWJqZWN0KSBhbmQgT2JqZWN0Ojp0b1N0cmluZy5jYWxsKHN1YmplY3QpIGlzICdbb2JqZWN0IE9iamVjdF0nIGFuZCBzdWJqZWN0LmNvbnN0cnVjdG9yIGlzIE9iamVjdFxuXG5cdHN0cmluZzogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ3N0cmluZydcblx0XG5cdG51bWJlcjogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ251bWJlcicgYW5kIG5vdCBpc05hTihzdWJqZWN0KVxuXG5cdG51bWJlckxvb3NlOiAoc3ViamVjdCktPiBleHBvcnRzLm51bWJlcihzdWJqZWN0KSBvciBleHBvcnRzLnN0cmluZyhzdWJqZWN0KSBhbmQgZXhwb3J0cy5udW1iZXIoTnVtYmVyIHN1YmplY3QpXG5cdFxuXHRmdW5jdGlvbjogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ2Z1bmN0aW9uJ1xuXG5cdGl0ZXJhYmxlOiAoc3ViamVjdCktPiBleHBvcnRzLm9iamVjdChzdWJqZWN0KSBhbmQgZXhwb3J0cy5udW1iZXIoc3ViamVjdC5sZW5ndGgpIiwibW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gXG5cdGRvbURvYzogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5ub2RlVHlwZSBpcyA5XG5cblx0ZG9tRWw6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3Qubm9kZVR5cGUgaXMgMVxuXG5cdGRvbVRleHQ6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3Qubm9kZVR5cGUgaXMgM1xuXG5cdGRvbU5vZGU6IChzdWJqZWN0KS0+IGV4cG9ydHMuZG9tRWwoc3ViamVjdCkgb3IgZXhwb3J0cy5kb21UZXh0KHN1YmplY3QpXG5cblx0ZG9tVGV4dGFyZWE6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3Qubm9kZU5hbWUgaXMgJ1RFWFRBUkVBJ1xuXHRcblx0ZG9tSW5wdXQ6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3Qubm9kZU5hbWUgaXMgJ0lOUFVUJ1xuXHRcblx0ZG9tU2VsZWN0OiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0Lm5vZGVOYW1lIGlzICdTRUxFQ1QnXG5cdFxuXHRkb21GaWVsZDogKHN1YmplY3QpLT4gZXhwb3J0cy5kb21JbnB1dChzdWJqZWN0KSBvciBleHBvcnRzLmRvbVRleHRhcmVhKHN1YmplY3QpIG9yIGV4cG9ydHMuZG9tU2VsZWN0KHN1YmplY3QpIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblNWRyA9IGltcG9ydCAnLi4vLi4vc3ZnJ1xuaGVscGVycyA9IGltcG9ydCAnLi4vLi4vaGVscGVycydcblxuZXhwb3J0IGRlZmF1bHQgRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdkcm9wZG93bidcblx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0ekluZGV4OiAxMFxuXHRcdFx0b3ZlcmZsb3c6ICdoaWRkZW4nXG5cdFx0XHR0b3A6IChkcm9wZG93biktPiBpZiBkcm9wZG93bi5maWVsZC50eXBlIGlzICd0ZXh0JyB0aGVuIEBwYXJlbnQucmF3LnN0eWxlLmhlaWdodCBlbHNlICctN3B4J1xuXHRcdFx0bGVmdDogKCktPiBpZiBAcGFyZW50LnJlY3QubGVmdCAtIDUgPCAwIHRoZW4gMCBlbHNlIC01XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdCMgYmFja2dyb3VuZENvbG9yOiBoZWxwZXJzLmhleFRvUkdCQSgnZjZmNmY2JywgMC45KVxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAnI2Y2ZjZmNidcblx0XHRcdGJveFNoYWRvdzogXCIwcHggNnB4IDEwcHggI3toZWxwZXJzLmhleFRvUkdCQSgnMDAwMDAwJywgMC4zMil9XCJcblx0XHRcdGJvcmRlcldpZHRoOiAnMXB4J1xuXHRcdFx0Ym9yZGVyU3R5bGU6ICdzb2xpZCdcblx0XHRcdGJvcmRlckNvbG9yOiAnI2QxZDFkMSdcblx0XHRcdGJvcmRlclJhZGl1czogJzVweCdcblx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRwYWRkaW5nOiAnNHB4IDAnXG5cdFx0XHQkaXNPcGVuOiAkaGFzVmlzaWJsZUNob2ljZXM6XG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XVxuKVxuXG5leHBvcnQgbGlzdCA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnbGlzdCdcblx0XHRwYXNzU3RhdGVUb0NoaWxkcmVuOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdG92ZXJmbG93OiAnc2Nyb2xsJ1xuXHRcdFx0b3ZlcmZsb3dTY3JvbGxpbmc6ICd0b3VjaCdcblx0XHRcdG92ZXJmbG93U3R5bGU6ICctbXMtYXV0b2hpZGluZy1zY3JvbGxiYXInXG5cdF1cbilcblxuZXhwb3J0IGNob2ljZSA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0c3R5bGU6XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdGZvbnRTaXplOiAnMCdcblx0XHRcdGNvbG9yOiAnIzAwMDAwMCdcblx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXHRcdFx0bGluZUhlaWdodDogJzFlbSdcblx0XHRcdGN1cnNvcjogJ3BvaW50ZXInXG5cdFx0XHQkdmlzaWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0JHVuYXZhaWxhYmxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdCRob3Zlcjpcblx0XHRcdFx0Y29sb3I6ICcjZmZmZmZmJ1xuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjNEM5NkZGJ1xuXG5cdFx0WydkaXYnICMgQ2hlY2ttYXJrXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblx0XHRcdFx0dmVydGljYWxBbGlnbjondG9wJ1xuXHRcdFx0XHR3aWR0aDogJzIwcHgnXG5cdFx0XHRcdCMgaGVpZ2h0OiAoKS0+IEBwYXJlbnQucmF3LnN0eWxlLmhlaWdodFxuXHRcdFx0XHQjIGxpbmVIZWlnaHQ6ICgpLT4gQHBhcmVudC5zdHlsZSgnaGVpZ2h0Jylcblx0XHRcdFx0IyBmb250U2l6ZTogKCktPiBAcGFyZW50LnN0eWxlKCdoZWlnaHQnKVxuXHRcdFx0XHRsaW5lSGVpZ2h0OiAnMjBweCdcblx0XHRcdFx0Zm9udFNpemU6ICcxM3B4J1xuXHRcdFx0XHR0ZXh0QWxpZ246ICdjZW50ZXInXG5cdFx0XHRcdGNvbG9yOiAnaW5oZXJpdCdcblx0XHRcdFx0c3Ryb2tlOiAnY3VycmVudENvbG9yJ1xuXHRcdFx0XHR2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuXHRcdFx0XHQkc2VsZWN0ZWQ6XG5cdFx0XHRcdFx0dmlzaWJpbGl0eTogJ3Zpc2libGUnXG5cblx0XHRcdFNWRy5jaGVja21hcmtcblx0XHRdXG5cdFx0XG5cdFx0WydkaXYnICMgVGV4dFxuXHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHRcdG92ZXJmbG93OiAnaGlkZGVuJ1xuXHRcdFx0XHR0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcydcblx0XHRcdFx0d2hpdGVTcGFjZTogJ25vd3JhcCdcblx0XHRcdFx0d29yZFdyYXA6ICdub3JtYWwnXG5cdFx0XHRcdG1heFdpZHRoOiAoKS0+IFwiY2FsYygxMDAlIC0gI3tAcHJldi5zdHlsZVNhZmUgJ3dpZHRoJywgdHJ1ZX0pXCJcblx0XHRcdFx0cGFkZGluZ1JpZ2h0OiAnMTBweCdcblx0XHRcdFx0bGluZUhlaWdodDogJzIwcHgnXG5cdFx0XHRcdGZvbnRTaXplOiAnMTFweCdcblx0XHRcdFx0Zm9udEZhbWlseTogKGRyb3Bkb3duKS0+IGRyb3Bkb3duLnNldHRpbmdzLmZvbnRGYW1pbHlcblx0XHRcdFx0Y29sb3I6ICdpbmhlcml0J1xuXHRcdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdF1cblx0XVxuKVxuXG5leHBvcnQgc2Nyb2xsSW5kaWNhdG9yVXAgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ3Njcm9sbEluZGljYXRvclVwJ1xuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdHRvcDogMFxuXHRcdFx0bGVmdDogMFxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcyMHB4J1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAnI2Y2ZjZmNidcblx0XHRcdGNvbG9yOiAnIzAwMDAwMCdcblx0XHRcdHRleHRBbGlnbjogJ2NlbnRlcidcblx0XHRcdCR2aXNpYmxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cblx0XHRbJ2Rpdidcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHR0b3A6ICc1MCUnXG5cdFx0XHRcdGxlZnQ6IDBcblx0XHRcdFx0cmlnaHQ6IDBcblx0XHRcdFx0d2lkdGg6ICcxNXB4J1xuXHRcdFx0XHRoZWlnaHQ6ICcxNXB4J1xuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XHRcdG1hcmdpbjogJzAgYXV0bydcblx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKSdcblx0XG5cdFx0XHRTVkcuY2FyZXRVcFxuXHRcdF1cblx0XVxuKVxuXG5leHBvcnQgc2Nyb2xsSW5kaWNhdG9yRG93biA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnc2Nyb2xsSW5kaWNhdG9yRG93bidcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRib3R0b206IDBcblx0XHRcdGxlZnQ6IDBcblx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMjBweCdcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNmNmY2ZjYnXG5cdFx0XHRjb2xvcjogJyMwMDAwMDAnXG5cdFx0XHR0ZXh0QWxpZ246ICdjZW50ZXInXG5cdFx0XHQkdmlzaWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXG5cdFx0WydkaXYnXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0dG9wOiAnNTAlJ1xuXHRcdFx0XHRsZWZ0OiAwXG5cdFx0XHRcdHJpZ2h0OiAwXG5cdFx0XHRcdHdpZHRoOiAnMTVweCdcblx0XHRcdFx0aGVpZ2h0OiAnMTVweCdcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0XHRtYXJnaW46ICcwIGF1dG8nXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknXG5cblx0XHRcdFNWRy5jYXJldERvd25cblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IGhlbHAgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2hlbHAnXG5cdFx0c3R5bGU6XG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdGJvcmRlclRvcDogJzJweCBzb2xpZCByZ2JhKDAsMCwwLDAuMDUpJ1xuXHRcdFx0cGFkZGluZzogJzRweCAxMnB4IDFweCdcblx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwwLjUpJ1xuXHRcdFx0Zm9udFdlaWdodDogJzUwMCdcblx0XHRcdGZvbnRTaXplOiAnMTFweCdcblx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXHRcdFx0JHNob3dIZWxwOlxuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdF1cbilcblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFxuXHRtYXhIZWlnaHQ6IDMwMFxuXHRtdWx0aXBsZTogZmFsc2Vcblx0bG9ja1Njcm9sbDogdHJ1ZVxuXHR0eXBlQnVmZmVyOiBmYWxzZVxuXHRoZWxwOiAnJ1xuXHR0ZW1wbGF0ZXM6IHt9IiwiIWZ1bmN0aW9uKGUscil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9cigpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW10scik6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/ZXhwb3J0cy50ZXh0TWFza0NvcmU9cigpOmUudGV4dE1hc2tDb3JlPXIoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtmdW5jdGlvbiByKG4pe2lmKHRbbl0pcmV0dXJuIHRbbl0uZXhwb3J0czt2YXIgbz10W25dPXtleHBvcnRzOnt9LGlkOm4sbG9hZGVkOiExfTtyZXR1cm4gZVtuXS5jYWxsKG8uZXhwb3J0cyxvLG8uZXhwb3J0cyxyKSxvLmxvYWRlZD0hMCxvLmV4cG9ydHN9dmFyIHQ9e307cmV0dXJuIHIubT1lLHIuYz10LHIucD1cIlwiLHIoMCl9KFtmdW5jdGlvbihlLHIsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG89dCgzKTtPYmplY3QuZGVmaW5lUHJvcGVydHkocixcImNvbmZvcm1Ub01hc2tcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbihvKS5kZWZhdWx0fX0pO3ZhciBpPXQoMik7T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJhZGp1c3RDYXJldFBvc2l0aW9uXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG4oaSkuZGVmYXVsdH19KTt2YXIgYT10KDUpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiY3JlYXRlVGV4dE1hc2tJbnB1dEVsZW1lbnRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbihhKS5kZWZhdWx0fX0pfSxmdW5jdGlvbihlLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHIucGxhY2Vob2xkZXJDaGFyPVwiX1wifSxmdW5jdGlvbihlLHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHQoZSl7dmFyIHI9ZS5wcmV2aW91c0NvbmZvcm1lZFZhbHVlLHQ9dm9pZCAwPT09cj9vOnIsaT1lLnByZXZpb3VzUGxhY2Vob2xkZXIsYT12b2lkIDA9PT1pP286aSx1PWUuY3VycmVudENhcmV0UG9zaXRpb24sbD12b2lkIDA9PT11PzA6dSxzPWUuY29uZm9ybWVkVmFsdWUsZj1lLnJhd1ZhbHVlLGQ9ZS5wbGFjZWhvbGRlckNoYXIsYz1lLnBsYWNlaG9sZGVyLHY9ZS5pbmRleGVzT2ZQaXBlZENoYXJzLHA9dm9pZCAwPT09dj9uOnYsaD1lLmNhcmV0VHJhcEluZGV4ZXMsZz12b2lkIDA9PT1oP246aDtpZigwPT09bClyZXR1cm4gMDt2YXIgbT1mLmxlbmd0aCx5PXQubGVuZ3RoLGI9Yy5sZW5ndGgsQz1zLmxlbmd0aCxQPW0teSx4PVA+MCxPPTA9PT15LGs9UD4xJiYheCYmIU87aWYoaylyZXR1cm4gbDt2YXIgaj14JiYodD09PXN8fHM9PT1jKSxNPTAsVD12b2lkIDAsdz12b2lkIDA7aWYoailNPWwtUDtlbHNle3ZhciBfPXMudG9Mb3dlckNhc2UoKSxWPWYudG9Mb3dlckNhc2UoKSxTPVYuc3Vic3RyKDAsbCkuc3BsaXQobyksTj1TLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gXy5pbmRleE9mKGUpIT09LTF9KTt3PU5bTi5sZW5ndGgtMV07dmFyIEU9YS5zdWJzdHIoMCxOLmxlbmd0aCkuc3BsaXQobykuZmlsdGVyKGZ1bmN0aW9uKGUpe3JldHVybiBlIT09ZH0pLmxlbmd0aCxBPWMuc3Vic3RyKDAsTi5sZW5ndGgpLnNwbGl0KG8pLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZSE9PWR9KS5sZW5ndGgsUj1BIT09RSxJPXZvaWQgMCE9PWFbTi5sZW5ndGgtMV0mJnZvaWQgMCE9PWNbTi5sZW5ndGgtMl0mJmFbTi5sZW5ndGgtMV0hPT1kJiZhW04ubGVuZ3RoLTFdIT09Y1tOLmxlbmd0aC0xXSYmYVtOLmxlbmd0aC0xXT09PWNbTi5sZW5ndGgtMl07IXgmJihSfHxJKSYmRT4wJiZjLmluZGV4T2Yodyk+LTEmJnZvaWQgMCE9PWZbbF0mJihUPSEwLHc9ZltsXSk7Zm9yKHZhciBKPXAubWFwKGZ1bmN0aW9uKGUpe3JldHVybiBfW2VdfSkscT1KLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZT09PXd9KS5sZW5ndGgsRj1OLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZT09PXd9KS5sZW5ndGgsTD1jLnN1YnN0cigwLGMuaW5kZXhPZihkKSkuc3BsaXQobykuZmlsdGVyKGZ1bmN0aW9uKGUscil7cmV0dXJuIGU9PT13JiZmW3JdIT09ZX0pLmxlbmd0aCxXPUwrRitxKyhUPzE6MCksej0wLEI9MDtCPEM7QisrKXt2YXIgRD1fW0JdO2lmKE09QisxLEQ9PT13JiZ6Kyssej49VylicmVha319aWYoeCl7Zm9yKHZhciBHPU0sSD1NO0g8PWI7SCsrKWlmKGNbSF09PT1kJiYoRz1IKSxjW0hdPT09ZHx8Zy5pbmRleE9mKEgpIT09LTF8fEg9PT1iKXJldHVybiBHfWVsc2UgaWYoVCl7Zm9yKHZhciBLPU0tMTtLPj0wO0stLSlpZihzW0tdPT09d3x8Zy5pbmRleE9mKEspIT09LTF8fDA9PT1LKXJldHVybiBLfWVsc2UgZm9yKHZhciBRPU07UT49MDtRLS0paWYoY1tRLTFdPT09ZHx8Zy5pbmRleE9mKFEpIT09LTF8fDA9PT1RKXJldHVybiBRfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHIuZGVmYXVsdD10O3ZhciBuPVtdLG89XCJcIn0sZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06YSxyPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTphLHQ9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOnt9LG49dC5ndWlkZSx1PXZvaWQgMD09PW58fG4sbD10LnByZXZpb3VzQ29uZm9ybWVkVmFsdWUscz12b2lkIDA9PT1sP2E6bCxmPXQucGxhY2Vob2xkZXJDaGFyLGQ9dm9pZCAwPT09Zj9pLnBsYWNlaG9sZGVyQ2hhcjpmLGM9dC5wbGFjZWhvbGRlcix2PXZvaWQgMD09PWM/KDAsby5jb252ZXJ0TWFza1RvUGxhY2Vob2xkZXIpKHIsZCk6YyxwPXQuY3VycmVudENhcmV0UG9zaXRpb24saD10LmtlZXBDaGFyUG9zaXRpb25zLGc9dT09PSExJiZ2b2lkIDAhPT1zLG09ZS5sZW5ndGgseT1zLmxlbmd0aCxiPXYubGVuZ3RoLEM9ci5sZW5ndGgsUD1tLXkseD1QPjAsTz1wKyh4Py1QOjApLGs9TytNYXRoLmFicyhQKTtpZihoPT09ITAmJiF4KXtmb3IodmFyIGo9YSxNPU87TTxrO00rKyl2W01dPT09ZCYmKGorPWQpO2U9ZS5zbGljZSgwLE8pK2orZS5zbGljZShPLG0pfWZvcih2YXIgVD1lLnNwbGl0KGEpLm1hcChmdW5jdGlvbihlLHIpe3JldHVybntjaGFyOmUsaXNOZXc6cj49TyYmcjxrfX0pLHc9bS0xO3c+PTA7dy0tKXt2YXIgXz1UW3ddLmNoYXI7aWYoXyE9PWQpe3ZhciBWPXc+PU8mJnk9PT1DO189PT12W1Y/dy1QOnddJiZULnNwbGljZSh3LDEpfX12YXIgUz1hLE49ITE7ZTpmb3IodmFyIEU9MDtFPGI7RSsrKXt2YXIgQT12W0VdO2lmKEE9PT1kKXtpZihULmxlbmd0aD4wKWZvcig7VC5sZW5ndGg+MDspe3ZhciBSPVQuc2hpZnQoKSxJPVIuY2hhcixKPVIuaXNOZXc7aWYoST09PWQmJmchPT0hMCl7Uys9ZDtjb250aW51ZSBlfWlmKHJbRV0udGVzdChJKSl7aWYoaD09PSEwJiZKIT09ITEmJnMhPT1hJiZ1IT09ITEmJngpe2Zvcih2YXIgcT1ULmxlbmd0aCxGPW51bGwsTD0wO0w8cTtMKyspe3ZhciBXPVRbTF07aWYoVy5jaGFyIT09ZCYmVy5pc05ldz09PSExKWJyZWFrO2lmKFcuY2hhcj09PWQpe0Y9TDticmVha319bnVsbCE9PUY/KFMrPUksVC5zcGxpY2UoRiwxKSk6RS0tfWVsc2UgUys9STtjb250aW51ZSBlfU49ITB9Zz09PSExJiYoUys9di5zdWJzdHIoRSxiKSk7YnJlYWt9Uys9QX1pZihnJiZ4PT09ITEpe2Zvcih2YXIgej1udWxsLEI9MDtCPFMubGVuZ3RoO0IrKyl2W0JdPT09ZCYmKHo9Qik7Uz1udWxsIT09ej9TLnN1YnN0cigwLHorMSk6YX1yZXR1cm57Y29uZm9ybWVkVmFsdWU6UyxtZXRhOntzb21lQ2hhcnNSZWplY3RlZDpOfX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksci5kZWZhdWx0PW47dmFyIG89dCg0KSxpPXQoMSksYT1cIlwifSxmdW5jdGlvbihlLHIsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpsLHI9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOnUucGxhY2Vob2xkZXJDaGFyO2lmKGUuaW5kZXhPZihyKSE9PS0xKXRocm93IG5ldyBFcnJvcihcIlBsYWNlaG9sZGVyIGNoYXJhY3RlciBtdXN0IG5vdCBiZSB1c2VkIGFzIHBhcnQgb2YgdGhlIG1hc2suIFBsZWFzZSBzcGVjaWZ5IGEgY2hhcmFjdGVyIHRoYXQgaXMgbm90IHByZXNlbnQgaW4geW91ciBtYXNrIGFzIHlvdXIgcGxhY2Vob2xkZXIgY2hhcmFjdGVyLlxcblxcblwiKyhcIlRoZSBwbGFjZWhvbGRlciBjaGFyYWN0ZXIgdGhhdCB3YXMgcmVjZWl2ZWQgaXM6IFwiK0pTT04uc3RyaW5naWZ5KHIpK1wiXFxuXFxuXCIpKyhcIlRoZSBtYXNrIHRoYXQgd2FzIHJlY2VpdmVkIGlzOiBcIitKU09OLnN0cmluZ2lmeShlKSkpO3JldHVybiBlLm1hcChmdW5jdGlvbihlKXtyZXR1cm4gZSBpbnN0YW5jZW9mIFJlZ0V4cD9yOmV9KS5qb2luKFwiXCIpfWZ1bmN0aW9uIG8oZSl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGV8fGUgaW5zdGFuY2VvZiBTdHJpbmd9ZnVuY3Rpb24gaShlKXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgZSYmdm9pZCAwPT09ZS5sZW5ndGgmJiFpc05hTihlKX1mdW5jdGlvbiBhKGUpe2Zvcih2YXIgcj1bXSx0PXZvaWQgMDt0PWUuaW5kZXhPZihzKSx0IT09LTE7KXIucHVzaCh0KSxlLnNwbGljZSh0LDEpO3JldHVybnttYXNrV2l0aG91dENhcmV0VHJhcHM6ZSxpbmRleGVzOnJ9fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHIuY29udmVydE1hc2tUb1BsYWNlaG9sZGVyPW4sci5pc1N0cmluZz1vLHIuaXNOdW1iZXI9aSxyLnByb2Nlc3NDYXJldFRyYXBzPWE7dmFyIHU9dCgxKSxsPVtdLHM9XCJbXVwifSxmdW5jdGlvbihlLHIsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZX19ZnVuY3Rpb24gbyhlKXt2YXIgcj17cHJldmlvdXNDb25mb3JtZWRWYWx1ZTp2b2lkIDAscHJldmlvdXNQbGFjZWhvbGRlcjp2b2lkIDB9O3JldHVybntzdGF0ZTpyLHVwZGF0ZTpmdW5jdGlvbih0KXt2YXIgbj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06ZSxvPW4uaW5wdXRFbGVtZW50LHM9bi5tYXNrLGQ9bi5ndWlkZSxtPW4ucGlwZSxiPW4ucGxhY2Vob2xkZXJDaGFyLEM9dm9pZCAwPT09Yj9wLnBsYWNlaG9sZGVyQ2hhcjpiLFA9bi5rZWVwQ2hhclBvc2l0aW9ucyx4PXZvaWQgMCE9PVAmJlAsTz1uLnNob3dNYXNrLGs9dm9pZCAwIT09TyYmTztpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgdCYmKHQ9by52YWx1ZSksdCE9PXIucHJldmlvdXNDb25mb3JtZWRWYWx1ZSl7KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBzP1widW5kZWZpbmVkXCI6bChzKSk9PT15JiZ2b2lkIDAhPT1zLnBpcGUmJnZvaWQgMCE9PXMubWFzayYmKG09cy5waXBlLHM9cy5tYXNrKTt2YXIgaj12b2lkIDAsTT12b2lkIDA7aWYocyBpbnN0YW5jZW9mIEFycmF5JiYoaj0oMCx2LmNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcikocyxDKSkscyE9PSExKXt2YXIgVD1hKHQpLHc9by5zZWxlY3Rpb25FbmQsXz1yLnByZXZpb3VzQ29uZm9ybWVkVmFsdWUsVj1yLnByZXZpb3VzUGxhY2Vob2xkZXIsUz12b2lkIDA7aWYoKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBzP1widW5kZWZpbmVkXCI6bChzKSk9PT1oKXtpZihNPXMoVCx7Y3VycmVudENhcmV0UG9zaXRpb246dyxwcmV2aW91c0NvbmZvcm1lZFZhbHVlOl8scGxhY2Vob2xkZXJDaGFyOkN9KSxNPT09ITEpcmV0dXJuO3ZhciBOPSgwLHYucHJvY2Vzc0NhcmV0VHJhcHMpKE0pLEU9Ti5tYXNrV2l0aG91dENhcmV0VHJhcHMsQT1OLmluZGV4ZXM7TT1FLFM9QSxqPSgwLHYuY29udmVydE1hc2tUb1BsYWNlaG9sZGVyKShNLEMpfWVsc2UgTT1zO3ZhciBSPXtwcmV2aW91c0NvbmZvcm1lZFZhbHVlOl8sZ3VpZGU6ZCxwbGFjZWhvbGRlckNoYXI6QyxwaXBlOm0scGxhY2Vob2xkZXI6aixjdXJyZW50Q2FyZXRQb3NpdGlvbjp3LGtlZXBDaGFyUG9zaXRpb25zOnh9LEk9KDAsYy5kZWZhdWx0KShULE0sUiksSj1JLmNvbmZvcm1lZFZhbHVlLHE9KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBtP1widW5kZWZpbmVkXCI6bChtKSk9PT1oLEY9e307cSYmKEY9bShKLHUoe3Jhd1ZhbHVlOlR9LFIpKSxGPT09ITE/Rj17dmFsdWU6XyxyZWplY3RlZDohMH06KDAsdi5pc1N0cmluZykoRikmJihGPXt2YWx1ZTpGfSkpO3ZhciBMPXE/Ri52YWx1ZTpKLFc9KDAsZi5kZWZhdWx0KSh7cHJldmlvdXNDb25mb3JtZWRWYWx1ZTpfLHByZXZpb3VzUGxhY2Vob2xkZXI6Vixjb25mb3JtZWRWYWx1ZTpMLHBsYWNlaG9sZGVyOmoscmF3VmFsdWU6VCxjdXJyZW50Q2FyZXRQb3NpdGlvbjp3LHBsYWNlaG9sZGVyQ2hhcjpDLGluZGV4ZXNPZlBpcGVkQ2hhcnM6Ri5pbmRleGVzT2ZQaXBlZENoYXJzLGNhcmV0VHJhcEluZGV4ZXM6U30pLHo9TD09PWomJjA9PT1XLEI9az9qOmcsRD16P0I6TDtyLnByZXZpb3VzQ29uZm9ybWVkVmFsdWU9RCxyLnByZXZpb3VzUGxhY2Vob2xkZXI9aixvLnZhbHVlIT09RCYmKG8udmFsdWU9RCxpKG8sVykpfX19fX1mdW5jdGlvbiBpKGUscil7ZG9jdW1lbnQuYWN0aXZlRWxlbWVudD09PWUmJihiP0MoZnVuY3Rpb24oKXtyZXR1cm4gZS5zZXRTZWxlY3Rpb25SYW5nZShyLHIsbSl9LDApOmUuc2V0U2VsZWN0aW9uUmFuZ2UocixyLG0pKX1mdW5jdGlvbiBhKGUpe2lmKCgwLHYuaXNTdHJpbmcpKGUpKXJldHVybiBlO2lmKCgwLHYuaXNOdW1iZXIpKGUpKXJldHVybiBTdHJpbmcoZSk7aWYodm9pZCAwPT09ZXx8bnVsbD09PWUpcmV0dXJuIGc7dGhyb3cgbmV3IEVycm9yKFwiVGhlICd2YWx1ZScgcHJvdmlkZWQgdG8gVGV4dCBNYXNrIG5lZWRzIHRvIGJlIGEgc3RyaW5nIG9yIGEgbnVtYmVyLiBUaGUgdmFsdWUgcmVjZWl2ZWQgd2FzOlxcblxcbiBcIitKU09OLnN0cmluZ2lmeShlKSl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHU9T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24oZSl7Zm9yKHZhciByPTE7cjxhcmd1bWVudHMubGVuZ3RoO3IrKyl7dmFyIHQ9YXJndW1lbnRzW3JdO2Zvcih2YXIgbiBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pJiYoZVtuXT10W25dKX1yZXR1cm4gZX0sbD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24oZSl7cmV0dXJuIHR5cGVvZiBlfTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiBlfTtyLmRlZmF1bHQ9bzt2YXIgcz10KDIpLGY9bihzKSxkPXQoMyksYz1uKGQpLHY9dCg0KSxwPXQoMSksaD1cImZ1bmN0aW9uXCIsZz1cIlwiLG09XCJub25lXCIseT1cIm9iamVjdFwiLGI9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG5hdmlnYXRvciYmL0FuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLEM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZT9yZXF1ZXN0QW5pbWF0aW9uRnJhbWU6c2V0VGltZW91dH1dKX0pOyIsIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXQoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLHQpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMudGV4dE1hc2tBZGRvbnM9dCgpOmUudGV4dE1hc2tBZGRvbnM9dCgpfSh0aGlzLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQocil7aWYobltyXSlyZXR1cm4gbltyXS5leHBvcnRzO3ZhciBvPW5bcl09e2V4cG9ydHM6e30saWQ6cixsb2FkZWQ6ITF9O3JldHVybiBlW3JdLmNhbGwoby5leHBvcnRzLG8sby5leHBvcnRzLHQpLG8ubG9hZGVkPSEwLG8uZXhwb3J0c312YXIgbj17fTtyZXR1cm4gdC5tPWUsdC5jPW4sdC5wPVwiXCIsdCgwKX0oW2Z1bmN0aW9uKGUsdCxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKGUpe3JldHVybiBlJiZlLl9fZXNNb2R1bGU/ZTp7ZGVmYXVsdDplfX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbz1uKDEpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiY3JlYXRlQXV0b0NvcnJlY3RlZERhdGVQaXBlXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHIobykuZGVmYXVsdH19KTt2YXIgaT1uKDIpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiY3JlYXRlTnVtYmVyTWFza1wiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiByKGkpLmRlZmF1bHR9fSk7dmFyIHU9bigzKTtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcImVtYWlsTWFza1wiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiByKHUpLmRlZmF1bHR9fSl9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpcIm1tIGRkIHl5eXlcIjtyZXR1cm4gZnVuY3Rpb24odCl7dmFyIG49W10scj1lLnNwbGl0KC9bXmRteV0rLyksbz17ZGQ6MzEsbW06MTIseXk6OTkseXl5eTo5OTk5fSxpPXtkZDoxLG1tOjEseXk6MCx5eXl5OjF9LHU9dC5zcGxpdChcIlwiKTtyLmZvckVhY2goZnVuY3Rpb24odCl7dmFyIHI9ZS5pbmRleE9mKHQpLGk9cGFyc2VJbnQob1t0XS50b1N0cmluZygpLnN1YnN0cigwLDEpLDEwKTtwYXJzZUludCh1W3JdLDEwKT5pJiYodVtyKzFdPXVbcl0sdVtyXT0wLG4ucHVzaChyKSl9KTt2YXIgYz1yLnNvbWUoZnVuY3Rpb24obil7dmFyIHI9ZS5pbmRleE9mKG4pLHU9bi5sZW5ndGgsYz10LnN1YnN0cihyLHUpLnJlcGxhY2UoL1xcRC9nLFwiXCIpLGw9cGFyc2VJbnQoYywxMCk7cmV0dXJuIGw+b1tuXXx8Yy5sZW5ndGg9PT11JiZsPGlbbl19KTtyZXR1cm4hYyYme3ZhbHVlOnUuam9pbihcIlwiKSxpbmRleGVzT2ZQaXBlZENoYXJzOm59fX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0LmRlZmF1bHQ9bn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKCl7ZnVuY3Rpb24gZSgpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpjLHQ9ZS5sZW5ndGg7aWYoZT09PWN8fGVbMF09PT1oWzBdJiYxPT09dClyZXR1cm4gaC5zcGxpdChjKS5jb25jYXQoW3ZdKS5jb25jYXQobS5zcGxpdChjKSk7aWYoZT09PVMmJk0pcmV0dXJuIGguc3BsaXQoYykuY29uY2F0KFtcIjBcIixTLHZdKS5jb25jYXQobS5zcGxpdChjKSk7dmFyIG49ZS5sYXN0SW5kZXhPZihTKSx1PW4hPT0tMSxsPWVbMF09PT1zJiZJLGE9dm9pZCAwLGc9dm9pZCAwLGI9dm9pZCAwO2lmKGUuc2xpY2UoViotMSk9PT1tJiYoZT1lLnNsaWNlKDAsViotMSkpLHUmJihNfHxEKT8oYT1lLnNsaWNlKGUuc2xpY2UoMCwkKT09PWg/JDowLG4pLGc9ZS5zbGljZShuKzEsdCksZz1yKGcucmVwbGFjZShmLGMpKSk6YT1lLnNsaWNlKDAsJCk9PT1oP2Uuc2xpY2UoJCk6ZSxOJiYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIE4/XCJ1bmRlZmluZWRcIjppKE4pKT09PXApe3ZhciBPPVwiLlwiPT09Xz9cIlsuXVwiOlwiXCIrXyxqPShhLm1hdGNoKG5ldyBSZWdFeHAoTyxcImdcIikpfHxbXSkubGVuZ3RoO2E9YS5zbGljZSgwLE4raipxKX1yZXR1cm4gYT1hLnJlcGxhY2UoZixjKSxBfHwoYT1hLnJlcGxhY2UoL14wKygwJHxbXjBdKS8sXCIkMVwiKSksYT14P28oYSxfKTphLGI9cihhKSwodSYmTXx8RD09PSEwKSYmKGVbbi0xXSE9PVMmJmIucHVzaCh5KSxiLnB1c2goUyx5KSxnJiYoKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBDP1widW5kZWZpbmVkXCI6aShDKSk9PT1wJiYoZz1nLnNsaWNlKDAsQykpLGI9Yi5jb25jYXQoZykpLEQ9PT0hMCYmZVtuLTFdPT09UyYmYi5wdXNoKHYpKSwkPjAmJihiPWguc3BsaXQoYykuY29uY2F0KGIpKSxsJiYoYi5sZW5ndGg9PT0kJiZiLnB1c2godiksYj1bZF0uY29uY2F0KGIpKSxtLmxlbmd0aD4wJiYoYj1iLmNvbmNhdChtLnNwbGl0KGMpKSksYn12YXIgdD1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06e30sbj10LnByZWZpeCxoPXZvaWQgMD09PW4/dTpuLGc9dC5zdWZmaXgsbT12b2lkIDA9PT1nP2M6ZyxiPXQuaW5jbHVkZVRob3VzYW5kc1NlcGFyYXRvcix4PXZvaWQgMD09PWJ8fGIsTz10LnRob3VzYW5kc1NlcGFyYXRvclN5bWJvbCxfPXZvaWQgMD09PU8/bDpPLGo9dC5hbGxvd0RlY2ltYWwsTT12b2lkIDAhPT1qJiZqLFA9dC5kZWNpbWFsU3ltYm9sLFM9dm9pZCAwPT09UD9hOlAsdz10LmRlY2ltYWxMaW1pdCxDPXZvaWQgMD09PXc/Mjp3LGs9dC5yZXF1aXJlRGVjaW1hbCxEPXZvaWQgMCE9PWsmJmssRT10LmFsbG93TmVnYXRpdmUsST12b2lkIDAhPT1FJiZFLFI9dC5hbGxvd0xlYWRpbmdaZXJvZXMsQT12b2lkIDAhPT1SJiZSLEw9dC5pbnRlZ2VyTGltaXQsTj12b2lkIDA9PT1MP251bGw6TCwkPWgmJmgubGVuZ3RofHwwLFY9bSYmbS5sZW5ndGh8fDAscT1fJiZfLmxlbmd0aHx8MDtyZXR1cm4gZS5pbnN0YW5jZU9mPVwiY3JlYXRlTnVtYmVyTWFza1wiLGV9ZnVuY3Rpb24gcihlKXtyZXR1cm4gZS5zcGxpdChjKS5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuIHYudGVzdChlKT92OmV9KX1mdW5jdGlvbiBvKGUsdCl7cmV0dXJuIGUucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZyx0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgaT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24oZSl7cmV0dXJuIHR5cGVvZiBlfTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiBlfTt0LmRlZmF1bHQ9bjt2YXIgdT1cIiRcIixjPVwiXCIsbD1cIixcIixhPVwiLlwiLHM9XCItXCIsZD0vLS8sZj0vXFxEKy9nLHA9XCJudW1iZXJcIix2PS9cXGQvLHk9XCJbXVwifSxmdW5jdGlvbihlLHQsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZX19ZnVuY3Rpb24gbyhlLHQpe2U9ZS5yZXBsYWNlKE8sdik7dmFyIG49dC5wbGFjZWhvbGRlckNoYXIscj10LmN1cnJlbnRDYXJldFBvc2l0aW9uLG89ZS5pbmRleE9mKHkpLHM9ZS5sYXN0SW5kZXhPZihwKSxkPXM8bz8tMTpzLGY9aShlLG8rMSx5KSxoPWkoZSxkLTEscCksZz11KGUsbyxuKSxtPWMoZSxvLGQsbiksYj1sKGUsZCxuLHIpO2c9YShnKSxtPWEobSksYj1hKGIsITApO3ZhciB4PWcuY29uY2F0KGYpLmNvbmNhdChtKS5jb25jYXQoaCkuY29uY2F0KGIpO3JldHVybiB4fWZ1bmN0aW9uIGkoZSx0LG4pe3ZhciByPVtdO3JldHVybiBlW3RdPT09bj9yLnB1c2gobik6ci5wdXNoKGgsbiksci5wdXNoKGgpLHJ9ZnVuY3Rpb24gdShlLHQpe3JldHVybiB0PT09LTE/ZTplLnNsaWNlKDAsdCl9ZnVuY3Rpb24gYyhlLHQsbixyKXt2YXIgbz12O3JldHVybiB0IT09LTEmJihvPW49PT0tMT9lLnNsaWNlKHQrMSxlLmxlbmd0aCk6ZS5zbGljZSh0KzEsbikpLG89by5yZXBsYWNlKG5ldyBSZWdFeHAoXCJbXFxcXHNcIityK1wiXVwiLG0pLHYpLG89PT15P2Y6by5sZW5ndGg8MT9nOm9bby5sZW5ndGgtMV09PT1wP28uc2xpY2UoMCxvLmxlbmd0aC0xKTpvfWZ1bmN0aW9uIGwoZSx0LG4scil7dmFyIG89djtyZXR1cm4gdCE9PS0xJiYobz1lLnNsaWNlKHQrMSxlLmxlbmd0aCkpLG89by5yZXBsYWNlKG5ldyBSZWdFeHAoXCJbXFxcXHNcIituK1wiLl1cIixtKSx2KSwwPT09by5sZW5ndGg/ZVt0LTFdPT09cCYmciE9PWUubGVuZ3RoP2Y6djpvfWZ1bmN0aW9uIGEoZSx0KXtyZXR1cm4gZS5zcGxpdCh2KS5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuIGU9PT1nP2U6dD94OmJ9KX1PYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgcz1uKDQpLGQ9cihzKSxmPVwiKlwiLHA9XCIuXCIsdj1cIlwiLHk9XCJAXCIsaD1cIltdXCIsZz1cIiBcIixtPVwiZ1wiLGI9L1teXFxzXS8seD0vW14uXFxzXS8sTz0vXFxzL2c7dC5kZWZhdWx0PXttYXNrOm8scGlwZTpkLmRlZmF1bHR9fSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oZSx0KXt2YXIgbj10LmN1cnJlbnRDYXJldFBvc2l0aW9uLGk9dC5yYXdWYWx1ZSxmPXQucHJldmlvdXNDb25mb3JtZWRWYWx1ZSxwPXQucGxhY2Vob2xkZXJDaGFyLHY9ZTt2PXIodik7dmFyIHk9di5pbmRleE9mKGMpLGg9bnVsbD09PWkubWF0Y2gobmV3IFJlZ0V4cChcIlteQFxcXFxzLlwiK3ArXCJdXCIpKTtpZihoKXJldHVybiB1O2lmKHYuaW5kZXhPZihhKSE9PS0xfHx5IT09LTEmJm4hPT15KzF8fGkuaW5kZXhPZihvKT09PS0xJiZmIT09dSYmaS5pbmRleE9mKGwpIT09LTEpcmV0dXJuITE7dmFyIGc9di5pbmRleE9mKG8pLG09di5zbGljZShnKzEsdi5sZW5ndGgpO3JldHVybihtLm1hdGNoKGQpfHxzKS5sZW5ndGg+MSYmdi5zdWJzdHIoLTEpPT09bCYmbiE9PWkubGVuZ3RoJiYodj12LnNsaWNlKDAsdi5sZW5ndGgtMSkpLHZ9ZnVuY3Rpb24gcihlKXt2YXIgdD0wO3JldHVybiBlLnJlcGxhY2UoaSxmdW5jdGlvbigpe3JldHVybiB0KyssMT09PXQ/bzp1fSl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5kZWZhdWx0PW47dmFyIG89XCJAXCIsaT0vQC9nLHU9XCJcIixjPVwiQC5cIixsPVwiLlwiLGE9XCIuLlwiLHM9W10sZD0vXFwuL2d9XSl9KTsiLCJtb2R1bGUuZXhwb3J0cyA9IFxuXHRyZWQ6ICcjY2M0ODIwJ1xuXHRncmVlbjogJyM3MmMzMjInXG5cdG9yYW5nZTogJyNmZjljMDAnXG5cdGJsYWNrOiAnIzE4MTgxOCdcblx0Z3JleV9kYXJrOiAnIzVlNWU1ZSdcblx0Z3JleTogJyM5MDkwOTAnXG5cdGdyZXlfc2VtaV9saWdodDogJyNiZWJlYmUnXG5cdGdyZXlfbGlnaHQ6ICcjZDNkM2QzJ1xuXHRncmV5X2xpZ2h0MjogJyNkZGRkZGQnXG5cdGdyZXlfbGlnaHQzOiAnI2YyZjVmNydcblx0Z3JleV9saWdodDQ6ICcjZTVlNWU1J1xuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTdGF0ZUNoYWluXG5cdGNvbnN0cnVjdG9yOiAoc3RhdGVzKS0+XG5cdFx0QHN0cmluZyA9IHN0YXRlcy5qb2luKCcrJylcblx0XHRAYXJyYXkgPSBzdGF0ZXMuc2xpY2UoKVxuXHRcdEBsZW5ndGggPSBzdGF0ZXMubGVuZ3RoXG5cblx0aW5jbHVkZXM6ICh0YXJnZXQpLT5cblx0XHRmb3Igc3RhdGUgaW4gQGFycmF5XG5cdFx0XHRyZXR1cm4gdHJ1ZSBpZiBzdGF0ZSBpcyB0YXJnZXRcblxuXHRcdHJldHVybiBmYWxzZVxuXG5cdHdpdGhvdXQ6ICh0YXJnZXQpLT5cblx0XHRAYXJyYXlcblx0XHRcdC5maWx0ZXIgKHN0YXRlKS0+IHN0YXRlIGlzbnQgdGFyZ2V0XG5cdFx0XHQuam9pbiAnKydcblxuXG5cdGlzQXBwbGljYWJsZTogKHRhcmdldCwgb3RoZXJBY3RpdmUpLT5cblx0XHRhY3RpdmUgPSBAYXJyYXkuZmlsdGVyIChzdGF0ZSktPlxuXHRcdFx0c3RhdGUgaXMgdGFyZ2V0IG9yXG5cdFx0XHRvdGhlckFjdGl2ZS5pbmRleE9mKHN0YXRlKSBpc250IC0xXG5cblx0XHRyZXR1cm4gYWN0aXZlLmxlbmd0aCBpcyBAYXJyYXkubGVuZ3RoIiwiZXhwb3J0cy5jaGVja21hcmsgPSBpbXBvcnQgJy4vY2hlY2ttYXJrJ1xuZXhwb3J0cy5hbmdsZURvd24gPSBpbXBvcnQgJy4vYW5nbGVEb3duJ1xuZXhwb3J0cy5jYXJldFVwID0gaW1wb3J0ICcuL2NhcmV0VXAnXG5leHBvcnRzLmNhcmV0RG93biA9IGltcG9ydCAnLi9jYXJldERvd24nXG5leHBvcnRzLnBsdXMgPSBpbXBvcnQgJy4vcGx1cydcbmV4cG9ydHMuY2xvbmUgPSBpbXBvcnQgJy4vY2xvbmUnXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0d2lkdGg6ICcxMnB4J1xuXHRcdFx0aGVpZ2h0OiAnMTJweCdcblx0XHRcdHZpZXdCb3g6ICc1IDcgMTIgMTInXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnOXB4J1xuXHRcdFx0aGVpZ2h0OiAnOXB4J1xuXG5cblx0XHRbJypwb2x5bGluZScsIHtcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogJzInXG5cdFx0XHRcdCdzdHJva2UtbGluZWNhcCc6ICdyb3VuZCdcblx0XHRcdFx0J3N0cm9rZS1saW5lam9pbic6ICdyb3VuZCdcblx0XHRcdFx0ZmlsbDogJ25vbmUnXG5cdFx0XHRcdHBvaW50czogJzcgMTMuODg4ODg4OSA5LjY2NjY2NjY3IDE3IDE1IDknXG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0fV1cblx0XVxuKVxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NLnRlbXBsYXRlKFxuXHRbJypzdmcnXG5cdFx0YXR0cnM6XG5cdFx0XHR3aWR0aDogJzE3OTJweCdcblx0XHRcdGhlaWdodDogJzE3OTJweCdcblx0XHRcdHZpZXdCb3g6ICcwIDAgMTc5MiAxNzkyJ1xuXHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJ1xuXHRcdFx0b3V0bGluZTogJ25vbmUnXG5cblx0XHRbJypwYXRoJ1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0XHRcdGQ6ICdNMTM5NSA3MzZxMCAxMy0xMCAyM2wtNDY2IDQ2NnEtMTAgMTAtMjMgMTB0LTIzLTEwbC00NjYtNDY2cS0xMC0xMC0xMC0yM3QxMC0yM2w1MC01MHExMC0xMCAyMy0xMHQyMyAxMGwzOTMgMzkzIDM5My0zOTNxMTAtMTAgMjMtMTB0MjMgMTBsNTAgNTBxMTAgMTAgMTAgMjN6J1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NLnRlbXBsYXRlKFxuXHRbJypzdmcnXG5cdFx0YXR0cnM6XG5cdFx0XHR2aWV3Qm94OiAnMCAwIDUxMiA1MTInXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBhdGgnXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0ZDogJ000MDIgMzQ3YzAgNS0yIDEwLTUgMTMtNCA0LTggNi0xMyA2aC0yNTZjLTUgMC05LTItMTMtNi0zLTMtNS04LTUtMTNzMi05IDUtMTJsMTI4LTEyOGM0LTQgOC02IDEzLTZzOSAyIDEzIDZsMTI4IDEyOGMzIDMgNSA3IDUgMTJ6J1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHZpZXdCb3g6ICcwIDAgNTEyIDUxMidcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTQwMiAyMDFjMCA1LTIgOS01IDEzbC0xMjggMTI4Yy00IDQtOCA1LTEzIDVzLTktMS0xMy01bC0xMjgtMTI4Yy0zLTQtNS04LTUtMTNzMi05IDUtMTNjNC0zIDgtNSAxMy01aDI1NmM1IDAgOSAyIDEzIDUgMyA0IDUgOCA1IDEzeidcblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0dmlld0JveDogJzAgMCAxNSAxNSdcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcG9seWdvbidcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRwb2ludHM6ICc5IDAgNiAwIDYgNiAwIDYgMCA5IDYgOSA2IDE1IDkgMTUgOSA5IDE1IDkgMTUgNiA5IDYnXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0dmlld0JveDogJzAgMCAxOCAyMCdcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTEzLjQxNCwwIEw2LDAgQzQuODk3LDAgNCwwLjg5OCA0LDIgTDQsMTQgQzQsMTUuMTAzIDQuODk3LDE2IDYsMTYgTDE2LDE2IEMxNy4xMDMsMTYgMTgsMTUuMTAzIDE4LDE0IEwxOCw0LjU4NiBMMTMuNDE0LDAgWiBNMTYuMDAxLDE0IEw2LDE0IEw2LDIgTDEyLDIgTDEyLDYgTDE2LDYgTDE2LjAwMSwxNCBaJ1xuXHRcdF1cblx0XHRcblx0XHRbJypwYXRoJ1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0XHRcdGQ6ICdNMiw2LjQyMzc5MjgyIEwwLDYuNDIzNzkyODIgTDAsMTggQzAsMTkuMTAzIDAuODk3LDIwIDIsMjAgTDE0LDIwIEwxNCwxOCBMMiwxOCBMMiw2LjQyMzc5MjgyIFonXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuXG4iXX0=