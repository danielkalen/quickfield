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
        _builder.version = "1.0.88";
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

              if (this.list.appendedChoices) {
                newChoice.init();
              }

              this.choices.push(newChoice);
              return newChoice;
            }
          }, {
            key: "removeChoice",
            value: function removeChoice(choice) {
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
          }, {
            key: "replaceChoices",
            value: function replaceChoices(newChoices) {
              this.removeChoice(this.choices.slice());
              this.addChoice(newChoices);
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
          key: "remove",
          value: function remove() {
            if (!this.initialized) {
              return;
            }

            return this.el.remove();
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
            var newState, prevState, ref, wasSelected;
            prevState = this.selected;
            newState = IS.defined(newValue) ? newValue : !this.selected;

            if (!newState) {
              if (this.dropdown.settings.multiple && prevState) {
                this.selected = newState;
                return helpers.removeItem(this.field._value, this);
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


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSIsImNvbnNvbGVQYXRjaC5jb2ZmZWUiLCIuLi9wYWNrYWdlLmpzb24iLCJoZWxwZXJzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvaW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9hbGxvd2VkT3B0aW9ucy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2hlbHBlcnMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9jaGVja3MuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9lbGVtZW50L2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9hbGlhc2VzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC90cmF2ZXJzaW5nLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9pbml0LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9ldmVudHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9lbGVtZW50L3N0YXRlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9zdHlsZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2VsZW1lbnQvYXR0cmlidXRlcy1hbmQtcHJvcGVydGllcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2VsZW1lbnQvbWFuaXB1bGF0aW9uLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9hcHBsaWNhdGlvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL3dpbmRvdy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL21lZGlhUXVlcnkuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9iYXRjaC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL3RlbXBsYXRlL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvdGVtcGxhdGUvZXh0ZW5kVGVtcGxhdGUuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy90ZW1wbGF0ZS9wYXJzZVRyZWUuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy90ZW1wbGF0ZS9zY2hlbWEuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9zaG9ydGN1dHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrZG9tL3BhY2thZ2UuanNvbiIsImNoZWNrcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3NyYy9pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3BhY2thZ2UuanNvbiIsImFuaW1hdGlvbnMuY29mZmVlIiwiY29uc3RhbnRzL3JlcUZpZWxkTWV0aG9kcy5jb2ZmZWUiLCJmaWVsZC9pbmRleC5jb2ZmZWUiLCJmaWVsZC90cmFuc2Zvcm1TZXR0aW5ncy5jb2ZmZWUiLCJmaWVsZC90ZXh0L19pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9faW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL2hlbHBlcnMvX2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2NoYW5nZUV2ZW50LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL3JlcXVpcmVzRG9tRGVzY3JpcHRvckZpeC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvaGVscGVycy93aW5kb3dQcm9wc1RvSWdub3JlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2NoZWNrcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvaGVscGVycy9kZXNjcmlwdG9yLW1vZC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvaGVscGVycy93ZWJraXREb21EZXNjcmlwdG9yRml4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2Nsb25pbmcuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL2hlbHBlcnMvY2FjaGUuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9taXNjL2hlbHBlcnMvcGxhY2Vob2xkZXJzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvbWlzYy9oZWxwZXJzL2Vycm9ycy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL21pc2MvZXJyb3JzQW5kV2FybmluZ3MuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9TaW1wbHlCaW5kL19pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL1NpbXBseUJpbmQvbWV0aG9kcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvcGFja2FnZS5qc29uIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9TaW1wbHlCaW5kL21ldGhvZHMudW5CaW5kQWxsLXBhcnNlRE9NT2JqZWN0LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvQmluZGluZy9faW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nL3Byb3RvdHlwZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL0JpbmRpbmcvcHJvdG90eXBlLnNldFZhbHVlLU9iamVjdFByb3AtRE9NVmFsdWUuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nL3Byb3RvdHlwZS5zZXRWYWx1ZS1ET01UeXBlcy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvc3JjL0JpbmRpbmdJbnRlcmZhY2UvaW5kZXguY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL3Byb3RvdHlwZS1wcml2YXRlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vc2ltcGx5YmluZC9zcmMvQmluZGluZ0ludGVyZmFjZS9wcm90b3R5cGUtcHJpdmF0ZS5zZXRPYmplY3QtcGFyc2VET01PYmplY3QuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL3Byb3RvdHlwZS1wcml2YXRlLnNldE9iamVjdC1kZWZpbmVFdmVudE1ldGhvZHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9CaW5kaW5nSW50ZXJmYWNlL3Byb3RvdHlwZS1wdWJsaWMuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kL3NyYy9Hcm91cEJpbmRpbmcvX2luZGV4LmNvZmZlZSIsImNvbnN0YW50cy9yZWdleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tjc3Mvc3JjL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2Nzcy9wYWNrYWdlLmpzb24iLCJub2RlX21vZHVsZXMvQGRhbmllbGthbGVuL2lzL3NyYy9pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3NyYy9leHRlbmQuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Zhc3Rkb20vZmFzdGRvbS5qcyIsImNvbXBvbmVudHMvY29uZGl0aW9uLmNvZmZlZSIsImZpZWxkL2dsb2JhbERlZmF1bHRzLmNvZmZlZSIsImNvbXBvbmVudHMvZHJvcGRvd24vaW5kZXguY29mZmVlIiwiY29tcG9uZW50cy9tYXNrLmNvZmZlZSIsImNvbnN0YW50cy9rZXlDb2Rlcy5jb2ZmZWUiLCJmaWVsZC90ZXh0L3RlbXBsYXRlLmNvZmZlZSIsImZpZWxkL3RleHQvZGVmYXVsdHMuY29mZmVlIiwibm9kZV9tb2R1bGVzL3F1aWNrY3NzL3NyYy9oZWxwZXJzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvY29uc3RhbnRzLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vaXMvc3JjL25hdGl2ZXMuY29mZmVlIiwibm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9pcy9zcmMvZG9tLmNvZmZlZSIsImNvbXBvbmVudHMvZHJvcGRvd24vdGVtcGxhdGUuY29mZmVlIiwiY29tcG9uZW50cy9kcm9wZG93bi9kZWZhdWx0cy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvdGV4dC1tYXNrLWNvcmUvZGlzdC90ZXh0TWFza0NvcmUuanMiLCJub2RlX21vZHVsZXMvdGV4dC1tYXNrLWFkZG9ucy9kaXN0L3RleHRNYXNrQWRkb25zLmpzIiwiY29uc3RhbnRzL2NvbG9ycy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcXVpY2tkb20vc3JjL3BhcnRzL2VsZW1lbnQvc3RhdGVDaGFpbi5jb2ZmZWUiLCJzdmcvX2luZGV4LmNvZmZlZSIsInN2Zy9jaGVja21hcmsuY29mZmVlIiwic3ZnL2FuZ2xlRG93bi5jb2ZmZWUiLCJzdmcvY2FyZXRVcC5jb2ZmZWUiLCJzdmcvY2FyZXREb3duLmNvZmZlZSIsInN2Zy9wbHVzLmNvZmZlZSIsInN2Zy9jbG9uZS5jb2ZmZWUiXSwibmFtZXMiOlsiRE9NIiwiSVMiLCJleHRlbmQiLCJyZWdpc3RlckFuaW1hdGlvbnMiLCJSRVFVSVJFRF9GSUVMRF9NRVRIT0RTIiwiY29uc29sZSIsImxvZyIsIndhcm4iLCJuZXdCdWlsZGVyIiwic2V0dGluZ092ZXJyaWRlcyIsInRlbXBsYXRlT3ZlcnJpZGVzIiwiRmllbGQiLCJzZXR0aW5ncyIsImFyZ3VtZW50cyIsImxlbmd0aCIsImNsb25lIiwib2JqZWN0IiwidHlwZSIsIkVycm9yIiwiYnVpbGRlciIsInJlZ2lzdGVyIiwidGFyZ2V0RmllbGQiLCJpIiwic3RyaW5nIiwiZnVuY3Rpb24iLCJwcm90b3R5cGUiLCJyZXF1aXJlZE1ldGhvZCIsImNvbmZpZyIsIm5ld1NldHRpbmdzIiwibmV3VGVtcGxhdGVzIiwiU3RyaW5nIiwib3V0cHV0U2V0dGluZ3MiLCJPYmplY3QiLCJjcmVhdGUiLCJnbG9iYWxEZWZhdWx0cyIsImRlZXAiLCJub3REZWVwIiwic2hhbGxvd1NldHRpbmdzIiwiZGVmYXVsdHMiLCJvdXRwdXRUZW1wbGF0ZXMiLCJnbG9iYWxDb25maWciLCJnbG9iYWwiLCJmaWVsZCIsImRlZmF1bHQiLCJvcmlnaW5hbFRlbXBsYXRlcyIsInRlbXBsYXRlcyIsIm5hbWUiLCJjb25jYXQiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsIm93biIsIm5vdEtleXMiLCJ2ZXJzaW9uIiwiUXVpY2tGaWVsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJTaW1wbHlCaW5kIiwicmVnZXgiLCJoZWxwZXJzIiwibm9vcCIsImluY2x1ZGVzIiwidGFyZ2V0IiwiaXRlbSIsImluZGV4T2YiLCJyZXBlYXQiLCJjb3VudCIsInJlc3VsdHMxIiwiam9pbiIsInJlbW92ZUl0ZW0iLCJpdGVtSW5kZXgiLCJzcGxpY2UiLCJpbnNlcnRBZnRlciIsIm5ld0l0ZW0iLCJmaW5kIiwiZm4iLCJyZXN1bHRzIiwiZmlsdGVyIiwiZGlmZiIsInNvdXJjZSIsImNvbXBhcmVlIiwiY29tcGFyZWVWYWwiLCJtYXhMZW4iLCJNYXRoIiwibWF4Iiwic291cmNlVmFsIiwiZGVmaW5lZCIsInJlc3VsdCIsInB1c2giLCJoZXhUb1JHQkEiLCJoZXgiLCJhbHBoYSIsIkIiLCJzbGljZSIsIlIiLCJwYXJzZUludCIsIkciLCJkZWZhdWx0Q29sb3IiLCJjb2xvciIsImNhbGNQYWRkaW5nIiwiZGVzaXJlZEhlaWdodCIsImZvbnRTaXplIiwiY2VpbCIsInVubG9ja1Njcm9sbCIsImV4Y2x1ZGVkRWwiLCJ3aW5kb3ciLCJfaXNMb2NrZWQiLCJvZmYiLCJsb2NrU2Nyb2xsIiwib24iLCJldmVudCIsInJhdyIsInBhcmVudE1hdGNoaW5nIiwicGFyZW50Iiwid2hlZWxEZWx0YSIsInNjcm9sbFRvcCIsInByZXZlbnREZWZhdWx0Iiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiZnV6enlNYXRjaCIsIm5lZWRsZSIsImhheXN0YWNrIiwiY2FzZVNlbnNpdGl2ZSIsImhJIiwiaExlbmd0aCIsInRvVXBwZXJDYXNlIiwibkxlbmd0aCIsIm5JIiwibWF0Y2hlZENvdW50IiwibmVlZGxlQ2hhciIsInN0YXJ0c1dpdGgiLCJnZXRJbmRleE9mRmlyc3REaWZmIiwic291cmNlU3RyaW5nIiwiY29tcGFyZVN0cmluZyIsImN1cnJlbnRQb3MiLCJtYXhMZW5ndGgiLCJwYXJzZUNzc1Nob3J0aGFuZFZhbHVlIiwic3BsaXQiLCJ3aGl0ZVNwYWNlIiwibWFwIiwicGFyc2VGbG9hdCIsInZhbHVlcyIsInRvcCIsInJpZ2h0IiwiYm90dG9tIiwibGVmdCIsInNob3J0aGFuZFNpZGVWYWx1ZSIsInZhbHVlIiwic2lkZSIsInVwZGF0ZVNob3J0aGFuZFZhbHVlIiwibmV3VmFsdWUiLCJrZXlzIiwiZm9yRWFjaCIsImluaGVyaXRQcm90byIsImNoaWxkIiwiaiIsImtleSIsIlF1aWNrRG9tIiwiYWxsb3dlZE9wdGlvbnMiLCJub3JtYWxpemVHaXZlbkVsIiwidGFyZ2V0RWwiLCJ0ZXh0IiwiZG9tTm9kZSIsInRlbXBsYXRlIiwic3Bhd24iLCJpc1N0YXRlU3R5bGUiLCJyZWdpc3RlclN0eWxlIiwicnVsZSIsImxldmVsIiwiaW1wb3J0YW50IiwiY2FjaGVkIiwic3R5bGVDYWNoZSIsIm91dHB1dCIsImNsYXNzTmFtZSIsIkNTUyIsImZucyIsInByb3BzIiwicHJvcCIsInNldCIsImNvbnN0cnVjdG9yIiwiaW5kZXgiLCJsb2FkIiwicXVpY2tEb21FbCIsInN1YmplY3QiLCJRdWlja0VsZW1lbnQiLCJRdWlja1RlbXBsYXRlIiwib3B0aW9ucyIsInN2ZyIsImVsIiwiZXhpc3RpbmciLCJkb2N1bWVudCIsImNyZWF0ZVRleHROb2RlIiwiY3JlYXRlRWxlbWVudE5TIiwic3ZnTmFtZXNwYWNlIiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZCIsInByZXBlbmQiLCJhdHRyIiwiX3BhcmVudCIsIl9zdHlsZXMiLCJfc3RhdGUiLCJfY2hpbGRyZW4iLCJfbm9ybWFsaXplT3B0aW9ucyIsIl9hcHBseU9wdGlvbnMiLCJfYXR0YWNoU3RhdGVFdmVudHMiLCJfcHJveHlQYXJlbnQiLCJfcmVmcmVzaFBhcmVudCIsIl9xdWlja0VsZW1lbnQiLCJ0b0pTT04iLCJjaGlsZHJlbiIsImRlZmluZVByb3BlcnRpZXMiLCJzdHlsZSIsInJlcGxhY2UiLCJfZmlsdGVyRWxlbWVudHMiLCJwYXJlbnRzVW50aWwiLCJfZ2V0UGFyZW50cyIsImlzUmVmIiwibmV4dFBhcmVudCIsInJlZiIsInF1ZXJ5Iiwic2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yIiwicXVlcnlBbGwiLCJxdWVyeVNlbGVjdG9yQWxsIiwiUXVpY2tCYXRjaCIsImNoaWxkTm9kZXMiLCJyZWYxIiwibm9kZVR5cGUiLCJwYXJlbnROb2RlIiwiZG9tRG9jIiwibmV4dFNpYmxpbmciLCJuZXh0RWxlbWVudFNpYmxpbmciLCJuZXh0QWxsIiwic2libGluZ3MiLCJuZXh0IiwicHJldmlvdXNTaWJsaW5nIiwicHJldmlvdXNFbGVtZW50U2libGluZyIsInByZXZBbGwiLCJwcmV2U2libGluZyIsInByZXYiLCJyZXZlcnNlIiwiX2NoaWxkUmVmcyIsIl9nZXRDaGlsZFJlZnMiLCJfZ2V0SW5kZXhCeVByb3AiLCJwYXJlbnRzIiwiZnJlc2hDb3B5IiwicmVmcyIsImNoaWxkUmVmcyIsIm1haW4iLCJhcnJheSIsIkNBQ0hFRF9GTl9JTlNFUlRFRCIsImJ1YmJsZXMiLCJiYXNlMSIsInJlbGF0ZWRJbnN0YW5jZSIsInJlbGF0ZWQiLCJiYXNlMiIsImNsYXNzIiwidXJsIiwiaHJlZiIsInVucGFzc2FibGVTdGF0ZXMiLCJwYXNzU3RhdGVUb0NoaWxkcmVuIiwicGFzc0RhdGFUb0NoaWxkcmVuIiwic3RhdGVUcmlnZ2VycyIsImJhc2VTdGF0ZVRyaWdnZXJzIiwiX3BhcnNlVGV4dHMiLCJfdGV4dHMiLCJfcGFyc2VTdHlsZXMiLCJzdHlsZXMiLCJzdG9yZSIsIl9tZWRpYVN0YXRlcyIsIm9iamVjdFBsYWluIiwic3RhdGVzIiwic3BlY2lhbFN0YXRlcyIsInN0YXRlIiwiX3Byb3ZpZGVkU3RhdGVzIiwiX3N0YXRlU2hhcmVkIiwiX3Byb3ZpZGVkU3RhdGVzU2hhcmVkIiwiYmFzZSIsIiRiYXNlIiwiZm9yY2VTdHlsZSIsImZsYXR0ZW5OZXN0ZWRTdGF0ZXMiLCJzdHlsZU9iamVjdCIsImNoYWluIiwiaGFzTm9uU3RhdGVQcm9wcyIsInN0YXRlXyIsInN0YXRlQ2hhaW4iLCJzdGF0ZVN0eWxlcyIsInRleHRzIiwiaWQiLCJzcmMiLCJzZWxlY3RlZCIsImNoZWNrZWQiLCJhdHRycyIsIl9hcHBseVJlZ2lzdGVyZWRTdHlsZSIsInN0eWxlQWZ0ZXJJbnNlcnQiLCJpbnZva2VDb21wdXRlcnNPbmNlIiwiX2ludm9rZWRDb21wdXRlcnMiLCJyZWNhbGNPblJlc2l6ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZWNhbGNTdHlsZSIsImV2ZW50cyIsImhhbmRsZXIiLCJtZXRob2RzIiwicmVmMiIsIm1ldGhvZCIsImNvbmZpZ3VyYWJsZSIsIl9wb3N0Q3JlYXRpb24iLCJkYXRhIiwiY29tcHV0ZXJzIiwiYXBwbHlEYXRhIiwiX2luaXQiLCJfcnVuQ29tcHV0ZXIiLCJmb3JjZSIsImRpc2FibGVyIiwidHJpZ2dlciIsImVuYWJsZXIiLCJfbGlzdGVuVG8iLCJuZXdQYXJlbnQiLCJsYXN0UGFyZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiX3VucHJveHlQYXJlbnQiLCJlbWl0UHJpdmF0ZSIsIl9pbnNlcnRlZCIsIm1lZGlhU3RhdGVzIiwicXVlcnlTdHJpbmciLCJNZWRpYVF1ZXJ5IiwicmVnZXhXaGl0ZXNwYWNlIiwiZXZlbnROYW1lcyIsImNhbGxiYWNrIiwidXNlQ2FwdHVyZSIsImlzUHJpdmF0ZSIsImNhbGxiYWNrUmVmIiwiX2V2ZW50Q2FsbGJhY2tzIiwiX19yZWZzIiwiY2FsbCIsImV2ZW50TmFtZSIsIl9pbnZva2VIYW5kbGVycyIsIm9uY2UiLCJvbmNlQ2FsbGJhY2siLCJlbWl0IiwiY2FuY2VsYWJsZSIsImNyZWF0ZUV2ZW50IiwiaW5pdEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsImFyZyIsImNhbGxiYWNrcyIsImNiIiwiZXZlbnROYW1lVG9MaXN0ZW5Gb3IiLCJsaXN0ZW5NZXRob2QiLCJEVU1NWV9BUlJBWSIsInRhcmdldFN0YXRlIiwiYWN0aXZlU3RhdGVzIiwiX3N0YXRlUGlwZVRhcmdldCIsImRlc2lyZWRWYWx1ZSIsIl9nZXRBY3RpdmVTdGF0ZXMiLCJ0b2dnbGUiLCJ0b2dnbGVTdGF0ZSIsInJlc2V0U3RhdGUiLCJhY3RpdmVTdGF0ZSIsInBpcGVTdGF0ZSIsInRhcmdldFN0eWxlIiwic3VwZXJpb3JTdGF0ZXMiLCJpbmNsdWRlQmFzZSIsInNraXBGbnMiLCJhZGRDbGFzcyIsInN1cGVyaW9yU3R5bGVzIiwiX3Jlc29sdmVGblN0eWxlcyIsImVudHJ5IiwiX3JlbW92ZVJlZ2lzdGVyZWRTdHlsZSIsInJlbW92ZUNsYXNzIiwicmVzZXRWYWx1ZSIsIl90dXJuU3R5bGVPTiIsIl9nZXRTdXBlcmlvclN0YXRlcyIsInNoYXJlZFN0YXRlcyIsIl9nZXRTaGFyZWRTdGF0ZXMiLCJfdHVyblN0eWxlT0ZGIiwiYWN0aXZlU2hhcmVkU3RhdGVzIiwiX3R1cm5UZXh0T04iLCJ0YXJnZXRUZXh0IiwiX3R1cm5UZXh0T0ZGIiwic3RhdGVUb0V4Y2x1ZGUiLCJpbmNsdWRlU2hhcmVkU3RhdGVzIiwicGxhaW5TdGF0ZXMiLCJjYW5kaWRhdGUiLCJ0YXJnZXRTdGF0ZUluZGV4Iiwic3VwZXJpb3IiLCJpc0FwcGxpY2FibGUiLCJhc3BlY3RSYXRpb0dldHRlciIsInByb3BlcnR5IiwiYXJncyIsImN1cnJlbnRTdGF0ZVN0eWxlIiwiVU5TRVQiLCJ0aGVuIiwic3R5bGVTYWZlIiwic2tpcENvbXB1dGVkIiwiY29tcHV0ZWQiLCJzYW1wbGUiLCJudW1iZXIiLCJzdHlsZVBhcnNlZCIsInJlY2FsY0NoaWxkcmVuIiwidGFyZ2V0U3R5bGVzIiwiaGlkZSIsInNob3ciLCJkaXNwbGF5Iiwib3JpZW50YXRpb25HZXR0ZXIiLCJ3aWR0aCIsImhlaWdodCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImdldEF0dHJpYnV0ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsInRvVGVtcGxhdGUiLCJjbG9uZU5vZGUiLCJlbENsb25lIiwibmV3RWwiLCJrIiwicHJldlBhcmVudCIsIl9yZW1vdmVDaGlsZCIsImFwcGVuZENoaWxkIiwiYXBwZW5kVG8iLCJ1bnNoaWZ0IiwiaW5zZXJ0QmVmb3JlIiwiZmlyc3RDaGlsZCIsInByZXBlbmRUbyIsImFmdGVyIiwibXlJbmRleCIsImJlZm9yZSIsImRldGFjaCIsInJlbW92ZSIsImVtcHR5Iiwid3JhcCIsImN1cnJlbnRQYXJlbnQiLCJ1bndyYXAiLCJncmFuZFBhcmVudCIsInBhcmVudENoaWxkcmVuIiwiYmF0Y2giLCJwYXJlbnRTaWJsaW5nIiwiaGFzQ2xhc3MiLCJjbGFzc0xpc3QiLCJ0YXJnZXRJbmRleCIsInRvZ2dsZUNsYXNzIiwic2V0UmVmIiwidGFyZ2V0Q2hpbGQiLCJyZXBsYWNlbWVudENoaWxkIiwiaW5kZXhPZkNoaWxkIiwicmVwbGFjZUNoaWxkIiwicmVtb3ZlQ2hpbGQiLCJpbm5lckhUTUwiLCJ0ZXh0Q29udGVudCIsImxpc3QiLCJwb3AiLCJzaGlmdCIsInVwZGF0ZU9wdGlvbnMiLCJ1cGRhdGVTdGF0ZVN0eWxlcyIsInBhcnNlZCIsInVwZGF0ZWRTdGF0ZXMiLCJ1cGRhdGVTdGF0ZVRleHRzIiwicGFzc1Rocm91Z2giLCJoYXNPd25Qcm9wZXJ0eSIsImNvbXB1dGVyIiwiUXVpY2tXaW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJwYXJzZVF1ZXJ5IiwicXVlcnlTcGxpdCIsInJ1bGVzIiwicnVsZURlbGltaXRlciIsImdldHRlciIsImlzTmFOIiwia2V5UHJlZml4IiwibWluIiwib3JpZW50YXRpb24iLCJhc3BlY3RSYXRpbyIsInBhcnNlZFZhbHVlIiwic3RyaW5nVmFsdWUiLCJ0ZXN0UnVsZSIsImN1cnJlbnRWYWx1ZSIsInBhc3NlZCIsIkFycmF5IiwicHJldkNvdW50IiwiZWxlbWVudCIsImFyZ3NMZW5ndGgiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwidHJlZSIsImh0bWwiLCJjb250YWluZXIiLCJpc1RlbXBsYXRlIiwiaXNRdWlja0VsIiwiaXNFbCIsImRvbUVsIiwiZWxlbWVudHMiLCJyZXR1cm5SZXN1bHRzMSIsInJldHVyblJlc3VsdHMiLCJyZXR1cm4iLCJyZXR1cm5OZXh0IiwibGFzdFJlc3VsdHMiLCJpdGVyYWJsZSIsImV4dGVuZFRlbXBsYXRlIiwiY3VycmVudE9wdHMiLCJuZXdPcHRzIiwiZ2xvYmFsT3B0cyIsImN1cnJlbnRDaGlsZCIsImdsb2JhbE9wdHNUcmFuc2Zvcm0iLCJvcHRzIiwicGFyc2VUcmVlIiwibWF0Y2hlc1NjaGVtYSIsIm51bGxEZWxldGVzIiwibm90RGVlcEtleXMiLCJ0cmFuc2Zvcm0iLCJjdXJyZW50Q2hpbGRyZW4iLCJuZXdDaGlsZHJlbiIsIm5lZWRzVGVtcGxhdGVXcmFwIiwibm9DaGFuZ2VzIiwibmV3Q2hpbGQiLCJuZXdDaGlsZFByb2Nlc3NlZCIsInNjaGVtYSIsImFsbG93TnVsbCIsImV4dGVuZEJ5UmVmIiwicmVtYWluaW5nTmV3Q2hpbGRyZW4iLCJuZXdDaGlsZHJlblJlZnMiLCJwYXJzZUVycm9yUHJlZml4IiwicGFyc2VDaGlsZHJlbiIsImRvbVRleHQiLCJhbGxvd2VkVGVtcGxhdGVPcHRpb25zIiwiaXNUcmVlIiwibmV3VmFsdWVzIiwiY2hpbGREYXRhIiwic2hvcnRjdXQiLCJSZWdFeHAiLCJvYmplY3RhYmxlIiwibm9ybWFsaXplS2V5cyIsImlzQXJyYXkiLCJpc0Jhc2UiLCJ0aGVUYXJnZXQiLCIkX2kiLCJzb3VyY2VzIiwibW9kaWZpZXJzIiwiXyIsImRlZXBPbmx5IiwiZ2xvYmFsVHJhbnNmb3JtIiwidHJhbnNmb3JtcyIsImdsb2JhbEZpbHRlciIsImZpbHRlcnMiLCJhbmltYXRpb24iLCJvcGFjaXR5IiwiQ29uZGl0aW9uIiwiZmFzdGRvbSIsImN1cnJlbnRJRCIsInRyYW5zZm9ybVNldHRpbmdzIiwiSUQiLCJhbGxGaWVsZHMiLCJmaWVsZEluc3RhbmNlcyIsImluc3RhbmNlcyIsIl92YWx1ZSIsInZhbGlkIiwidmlzaWJsZSIsImZvY3VzZWQiLCJob3ZlcmVkIiwiZmlsbGVkIiwiaW50ZXJhY3RlZCIsImlzTW9iaWxlIiwiZGlzYWJsZWQiLCJtYXJnaW4iLCJwYWRkaW5nIiwic2hvd0xhYmVsIiwibGFiZWwiLCJzaG93SGVscCIsImhlbHAiLCJzaG93RXJyb3IiLCJlcnJvciIsInBsYWNlaG9sZGVyIiwiaW5pdCIsImNvbmRpdGlvbnMiLCJfY29uc3RydWN0b3JFbmQiLCJjaGlsZGYiLCJkZWZhdWx0VmFsdWUiLCJtdWx0aXBsZSIsInVwZGF0ZU9uQmluZCIsIm9mIiwidG8iLCJjb25kaXRpb24iLCJhbmQiLCJiaW5kIiwicHJldlNob3ciLCJjaGFuZ2VBbW91bnQiLCJtYWtlUm9vbUZvckhlbHAiLCJtb2JpbGVXaWR0aCIsIm1lYXN1cmUiLCJtb2JpbGVUaHJlc2hvbGQiLCJ1cGRhdGVPbiIsIl9xdWlja0ZpZWxkIiwiX2Zvcm1hdFdpZHRoIiwiZGlzdGFuY2UiLCJkZXN0cm95IiwicmVtb3ZlRnJvbURPTSIsInVuQmluZEFsbCIsIl9kZXN0cm95IiwiYXBwbHkiLCJ2YWxpZGF0ZSIsInByb3ZpZGVkVmFsdWUiLCJjb3JlVmFsdWVQcm9wIiwidGVzdFVucmVxdWlyZWQiLCJyZXBvcnQiLCJpc1ZhbGlkIiwidmFsaWRhdG9yIiwicmVxdWlyZWQiLCJfdmFsaWRhdGUiLCJjbGVhckVycm9yT25WYWxpZCIsInZhbGlkYXRlQ29uZGl0aW9ucyIsInBhc3NlZENvbmRpdGlvbnMiLCJ0b2dnbGVWaXNpYmlsaXR5IiwidmFsaWRhdGVBbmRSZXBvcnQiLCJjaG9pY2VzIiwiX2dldFZhbHVlIiwiX3NldFZhbHVlIiwic2V0dGVyIiwiTWFzayIsIlJFR0VYIiwiS0VZQ09ERVMiLCJUZXh0RmllbGQiLCJ0eXBpbmciLCJjdXJzb3IiLCJjdXJyZW50IiwidmFsaWRXaGVuUmVnZXgiLCJrZXlib2FyZCIsImVtYWlsIiwibWFzayIsInBhdHRlcm4iLCJfY3JlYXRlRWxlbWVudHMiLCJfYXR0YWNoQmluZGluZ3MiLCJkcm9wZG93biIsInNldFZhbHVlIiwiX3JlY2FsY0Rpc3BsYXkiLCJhdXRvV2lkdGgiLCJEcm9wZG93biIsImlubmVyd3JhcCIsImljb24iLCJpbnB1dCIsImNoZWNrbWFyayIsIl9hdHRhY2hCaW5kaW5nc19lbFN0YXRlIiwiX2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXkiLCJfYXR0YWNoQmluZGluZ3NfZGlzcGxheV9hdXRvV2lkdGgiLCJfYXR0YWNoQmluZGluZ3NfdmFsdWUiLCJfYXR0YWNoQmluZGluZ3NfYXV0b2NvbXBsZXRlIiwiX2F0dGFjaEJpbmRpbmdzX3N0YXRlVHJpZ2dlcnMiLCJzZXRUaW1lb3V0IiwiY2hlY2ttYXJrX21hc2sxIiwiY2hlY2ttYXJrX21hc2syIiwiY2hlY2ttYXJrX3BhdGNoIiwidXBkYXRlRXZlbklmU2FtZSIsIl9nZXRJbnB1dEF1dG9XaWR0aCIsInJlc2V0SW5wdXQiLCJpc0VtcHR5Iiwic2VsZWN0aW9uIiwiZ3VpZGUiLCJrZXlDb2RlIiwiZW50ZXIiLCJkZWZhdWx0T3B0aW9ucyIsImlzVHlwaW5nIiwiaXNPcGVuIiwiY2FsY0Rpc3BsYXkiLCJjaG9pY2UiLCJzaG91bGRCZVZpc2libGUiLCJvblNlbGVjdGVkIiwic2VsZWN0ZWRDaG9pY2UiLCJibHVyIiwiZW5kIiwiX3NjaGVkdWxlQ3Vyc29yUmVzZXQiLCJjdXJyZW50Q3Vyc29yIiwibmV3Q3Vyc29yIiwibm9ybWFsaXplQ3Vyc29yUG9zIiwiX3NldFZhbHVlSWZOb3RTZXQiLCJpbnB1dFdpZHRoIiwic2Nyb2xsTGVmdCIsIm9mZnNldFdpZHRoIiwic2Nyb2xsV2lkdGgiLCJsYWJlbFdpZHRoIiwicmVjdCIsIl9nZXRXaWR0aFNldHRpbmciLCJwYXJlbnRXaWR0aCIsIm1hdGNoaW5nQ2hvaWNlIiwidGVzdCIsInZhbGlkV2hlbklzQ2hvaWNlIiwibWluTGVuZ3RoIiwic3RhcnQiLCJzZXRTZWxlY3Rpb25SYW5nZSIsInNlbGVjdGlvblN0YXJ0Iiwic2VsZWN0aW9uRW5kIiwiZm9jdXMiLCJhcnJheU11dGF0b3JNZXRob2RzIiwiZHVtbXlQcm9wZXJ0eURlc2NyaXB0b3IiLCJib3VuZEluc3RhbmNlcyIsInNpbGVudCIsIm5ld1BsYWNlaG9sZGVyIiwiY2hlY2tJZiIsInNldFBob2xkZXJSZWdFeCIsImRlbGF5IiwidGhyb3R0bGUiLCJzaW1wbGVTZWxlY3RvciIsInByb21pc2VUcmFuc2Zvcm1zIiwiZGlzcGF0Y2hFdmVudHMiLCJzZW5kQXJyYXlDb3BpZXMiLCJnZXREZXNjcmlwdG9yIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiY2FjaGVkRXZlbnQiLCJjaGFuZ2VFdmVudCIsIl9zYiIsInJlcXVpcmVzRG9tRGVzY3JpcHRvckZpeCIsIkVsZW1lbnQiLCJ3aW5kb3dQcm9wc1RvSWdub3JlIiwic2V0VmFsdWVOb29wIiwidiIsInB1Ymxpc2hlciIsInVwZGF0ZUFsbFN1YnMiLCJnZW5JRCIsImdlbk9iaiIsImdlblByb3hpZWRJbnRlcmZhY2UiLCJpc1N1YiIsImNvbXBsZXRlQ2FsbGJhY2siLCJjdXN0b21PcHRpb25zIiwic2F2ZU9wdGlvbnMiLCJnZW5TZWxmVXBkYXRlciIsImJpbmRpbmciLCJmZXRjaFZhbHVlIiwic2VsZlVwZGF0ZXIiLCJCaW5kaW5nIiwiZmV0Y2hEaXJlY3RWYWx1ZSIsImlzRGVmaW5lZCIsImlzT2JqZWN0IiwiaXNTdHJpbmciLCJpc051bWJlciIsImlzRnVuY3Rpb24iLCJpc0JpbmRpbmdJbnRlcmZhY2UiLCJCaW5kaW5nSW50ZXJmYWNlIiwiaXNCaW5kaW5nIiwiaXNJdGVyYWJsZSIsImlzRG9tIiwiaXNEb21JbnB1dCIsImlzRG9tUmFkaW8iLCJpc0RvbUNoZWNrYm94IiwiaXNFbENvbGxlY3Rpb24iLCJOb2RlTGlzdCIsIkhUTUxDb2xsZWN0aW9uIiwialF1ZXJ5IiwiZG9tRWxzQXJlU2FtZSIsIml0ZW1zV2l0aFNhbWVUeXBlIiwiaXNEb21Ob2RlIiwiY29udmVydFRvTGl2ZSIsImlzUHJvdG8iLCJkZXNjcmlwdG9yIiwib2JqZWN0UHJvdG8iLCJnZXRQcm90b3R5cGVPZiIsImZldGNoRGVzY3JpcHRvciIsImJpbmRpbmdJbnN0YW5jZSIsIm9ubHlBcnJheU1ldGhvZHMiLCJvcmlnRGVzY3JpcHRvciIsIm9yaWdGbiIsImNvbnRleHQiLCJnZXR0ZXJWYWx1ZSIsInByb3h5Rm4iLCJzZWxmVHJhbnNmb3JtIiwiaXNMaXZlUHJvcCIsInRhcmdldEluY2x1ZGVzIiwicHJvcGVydHlEZXNjcmlwdG9yIiwib3JpZ0dldHRlciIsIm9yaWdTZXR0ZXIiLCJzaG91bGRXcml0ZUxpdmVQcm9wIiwiQ1NTU3R5bGVEZWNsYXJhdGlvbiIsInR5cGVJc0FycmF5Iiwic2hvdWxkSW5kaWNhdGVVcGRhdGVJc0Zyb21TZWxmIiwiZW51bWVyYWJsZSIsImNvbnZlcnRUb1JlZyIsIm5ld0Rlc2NyaXB0b3IiLCJjbG9uZU9iamVjdCIsImV4dGVuZFN0YXRlIiwic3RhdGVUb0luaGVyaXQiLCJjYWNoZSIsImlzTXVsdGlDaG9pY2UiLCJzYW1wbGVJdGVtIiwiX3NiX0lEIiwiX3NiX21hcCIsImdyb3VwQmluZGluZyIsInByb3BzTWFwIiwiYWRkVG9Ob2RlU3RvcmUiLCJwaG9sZGVyUmVnRXgiLCJwaG9sZGVyUmVnRXhTcGxpdCIsImVzY2FwZVJlZ0V4IiwibWlkZGxlIiwiYXBwbHlQbGFjZWhvbGRlcnMiLCJjb250ZXh0cyIsImluZGV4TWFwIiwiY29udGV4dFBhcnQiLCJub2RlU3RvcmUiLCJub2RlIiwidGFyZ2V0UGxhY2Vob2xkZXIiLCJzY2FuVGV4dE5vZGVzUGxhY2Vob2xkZXJzIiwibWF0Y2giLCJ0ZXh0UGllY2VzIiwibmV3RnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwibmV3Tm9kZSIsInRleHRQaWVjZSIsImdldEVyclNvdXJjZSIsImVycm9yTmFtZSIsImVycm9ycyIsInRocm93V2FybmluZyIsIndhcm5pbmdOYW1lIiwiZGVwdGgiLCJlcnJTb3VyY2UiLCJ0aHJvd0Vycm9yQmFkQXJnIiwidGhyb3dFcnJvciIsInN0YWNrIiwiaW52YWxpZFBhcmFtTmFtZSIsImZuT25seSIsImJhZEV2ZW50QXJnIiwiZW1wdHlMaXN0Iiwib25seU9uZURPTUVsZW1lbnQiLCJtaXhlZEVsTGlzdCIsImludGVyZmFjZVRvUmV0dXJuIiwic2VsZkNsb25lIiwibmV3SW50ZXJmYWNlIiwic2V0T2JqZWN0Iiwic2V0UHJvcGVydHkiLCJib3RoV2F5cyIsImJvdW5kSUQiLCJwcm9wTWFwIiwicmVtb3ZlQWxsU3VicyIsInBhcmVudEJpbmRpbmciLCJvcHRpb25zRGVmYXVsdCIsInN1YnMiLCJzdWJzTWV0YSIsInB1YnNNYXAiLCJhdHRhY2hlZEV2ZW50cyIsImNob2ljZUVsIiwiY2hvaWNlQmluZGluZyIsImFkZFN1YiIsInRyYW5zZm9ybUZuIiwicGFyZW50UHJvcGVydHkiLCJzY2FuRm9yUGhvbGRlcnMiLCJwaG9sZGVyVmFsdWVzIiwicGhvbGRlciIsInRleHROb2RlcyIsInN1YmplY3RWYWx1ZSIsImF0dGFjaEV2ZW50cyIsImV2ZW50VXBkYXRlSGFuZGxlciIsInN1YiIsInVwZGF0ZU9uY2UiLCJhbHJlYWR5SGFkU3ViIiwiaXNNdWx0aSIsInN1Ykl0ZW0iLCJtZXRhRGF0YSIsInZhbHVlUmVmIiwicmVtb3ZlU3ViIiwicmVtb3ZlUG9sbEludGVydmFsIiwidW5SZWdpc3RlckV2ZW50IiwiY2hvaWNlTmFtZSIsImZyb21TZWxmIiwiZnJvbUNoYW5nZUV2ZW50IiwiZW50aXJlVmFsdWUiLCJsZW4iLCJsZW4xIiwibiIsIm5ld0Nob2ljZVZhbHVlIiwibmV3Q2hvaWNlcyIsIm5ld1ZhbHVlQXJyYXkiLCJvdmVyd3JpdGVQcmV2aW91cyIsInByZXZDdXJzcm9yIiwicHJldlZhbHVlIiwidGFyZ2V0Q2hvaWNlQmluZGluZyIsInRleHROb2RlIiwicGhvbGRlckNvbnRleHRzIiwicGhvbGRlckluZGV4TWFwIiwidmFsdWVQYXNzZWQiLCJpc0VtaXR0ZXIiLCJlbWl0RXZlbnQiLCJhcnIiLCJ1cGRhdGVTdWIiLCJpc0RlbGF5ZWRVcGRhdGUiLCJjdXJyZW50VGltZSIsIm1ldGEiLCJzdWJWYWx1ZSIsInRpbWVQYXNzZWQiLCJkaXNhbGxvd0xpc3QiLCJEYXRlIiwibGFzdFVwZGF0ZSIsImNsZWFyVGltZW91dCIsInVwZGF0ZVRpbWVyIiwiY29uZGl0aW9uRm4iLCJhZGRNb2RpZmllckZuIiwic3ViSW50ZXJmYWNlcyIsInN1YmplY3RGbiIsInN1YkludGVyZmFjZSIsInN1Yk1ldGFEYXRhIiwic3Vic2NyaWJlciIsImJpbmRpbmdzIiwic2V0U2VsZlRyYW5zZm9ybSIsImFkZERpc2FsbG93UnVsZSIsInRhcmdldFN1YiIsInRhcmdldERpc2FsbG93IiwiZSIsImFkZFBvbGxJbnRlcnZhbCIsInRpbWUiLCJwb2xsSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInBvbGxlZFZhbHVlIiwiY2xlYXJJbnRlcnZhbCIsImFkZFVwZGF0ZUxpc3RlbmVyIiwidGFyZ2V0UHJvcGVydHkiLCJzaG91bGRSZWRlZmluZVZhbHVlIiwicmVnaXN0ZXJFdmVudCIsImV2ZW50SGFuZGxlciIsImV2ZW50TWV0aG9kcyIsImxpc3RlbiIsImV4dHJhRGF0YSIsImV2ZW50T2JqZWN0IiwiYmluZGluZ0RhdGEiLCJpbmhlcml0ZWRTdGF0ZSIsInN0YWdlIiwib3B0aW9uc1Bhc3NlZCIsIkJpbmRpbmdJbnRlcmZhY2VQcml2YXRlIiwiZGVmaW5lTWFpblByb3BzIiwib2JqZWN0cyIsImNyZWF0ZUJpbmRpbmciLCJuZXdPYmplY3RUeXBlIiwiYmluZGluZ0ludGVyZmFjZSIsImNhY2hlZEJpbmRpbmciLCJwYXRjaENhY2hlZEJpbmRpbmciLCJuZXdCaW5kaW5nIiwib3B0aW9uIiwidG9TdHJpbmciLCJyZW1vdmVNZXRob2QiLCJlbWl0TWV0aG9kIiwiR3JvdXBCaW5kaW5nIiwiYWRkVG9QdWJsaXNoZXIiLCJwdWJsaXNoZXJJbnRlcmZhY2UiLCJNRVRIT0RfYm90aFdheXMiLCJNRVRIT0Rfb2YiLCJNRVRIT0Rfc2V0IiwiY2hhaW5UbyIsIk1FVEhPRF9jaGFpblRvIiwidHJhbnNmb3JtU2VsZiIsIk1FVEhPRF90cmFuc2Zvcm1TZWxmIiwiTUVUSE9EX3RyYW5zZm9ybSIsInRyYW5zZm9ybUFsbCIsIk1FVEhPRF90cmFuc2Zvcm1BbGwiLCJNRVRIT0RfY29uZGl0aW9uIiwiY29uZGl0aW9uQWxsIiwiTUVUSE9EX2NvbmRpdGlvbkFsbCIsInVuQmluZCIsIk1FVEhPRF91bkJpbmQiLCJwb2xsRXZlcnkiLCJNRVRIT0RfcG9sbEV2ZXJ5Iiwic3RvcFBvbGxpbmciLCJNRVRIT0Rfc3RvcFBvbGxpbmciLCJzZXRPcHRpb24iLCJNRVRIT0Rfc2V0T3B0aW9uIiwiZGlzYWxsb3dGcm9tIiwidGhpc0ludGVyZmFjZSIsImRpc2FsbG93SW50ZXJmYWNlIiwicmVtb3ZlVXBkYXRlciIsImNsb25lQmluZGluZyIsImNsb25lSW50ZXJmYWNlIiwiYWRkQmluZGluZyIsInNpYmxpbmdJbnRlcmZhY2UiLCJ1cGRhdGUiLCJ0d29XYXkiLCJwaXBlIiwic3BlY2lmaWNPcHRpb25zIiwiYWx0VHJhbnNmb3JtIiwic3ViQmluZGluZyIsIm9yaWdpblRyYW5zZm9ybSIsIm9yaWdpbkNvbmRpdGlvbiIsInRyYW5zZm9ybVRvVXNlIiwib3B0aW9uTmFtZSIsIm9iamVjdFR5cGUiLCJpbnRlcmZhY2UiLCJwcm90byIsIm1ldGhvZE5hbWUiLCJhIiwiYiIsImMiLCJkIiwiYW55IiwibnVtZXJpYyIsImxldHRlciIsIndpZGVudW1lcmljIiwiYWxwaGFudW1lcmljIiwicXVpY2tjc3MiLCJjb21wdXRlZFN0eWxlIiwic3ViRWwiLCJzdWJQcm9wZXJ0eSIsIm5vcm1hbGl6ZVByb3BlcnR5IiwiX2NvbXB1dGVkU3R5bGUiLCJnZXRDb21wdXRlZFN0eWxlIiwibm9ybWFsaXplVmFsdWUiLCJmcmFtZXMiLCJmcmFtZSIsInByZWZpeCIsImdldFByZWZpeCIsImdlbmVyYXRlZCIsInJ1bGVUb1N0cmluZyIsImlubGluZVN0eWxlIiwiaGFzaCIsImNsZWFyUmVnaXN0ZXJlZCIsImNsZWFySW5saW5lU3R5bGUiLCJpc1ZhbHVlU3VwcG9ydGVkIiwic3VwcG9ydHMiLCJzdXBwb3J0c1Byb3BlcnR5IiwiaXNQcm9wU3VwcG9ydGVkIiwiQ2hlY2tzIiwibmF0aXZlcyIsImRvbSIsInNldHMiLCJhdmFpbFNldHMiLCJzaG91bGREZWVwRXh0ZW5kIiwicGFyZW50S2V5Iiwic291cmNlVmFsdWUiLCJ0YXJnZXRWYWx1ZSIsInN1YlRhcmdldCIsIndpbiIsImRlYnVnIiwicmFmIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwid2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJzZWxmIiwicmVhZHMiLCJ3cml0ZXMiLCJGYXN0RG9tIiwiY3R4IiwidGFzayIsInNjaGVkdWxlRmx1c2giLCJtdXRhdGUiLCJjbGVhciIsIm1peGluIiwiaW5pdGlhbGl6ZSIsImNhdGNoIiwic2NoZWR1bGVkIiwiZmx1c2giLCJydW5UYXNrcyIsIm1lc3NhZ2UiLCJ0YXNrcyIsImRlZmluZSIsImZpZWxkMSIsInNhdGlzZmllZCIsIm9sZFZhbHVlIiwiY29tcGFyaXNvbiIsIm5lc3RlZE9iamVjdCIsInByb3BlcnR5Q2hhaW4iLCJjb21wYXJpc29uT3BlcmF0b3JzIiwicGFzc2VkQ29tcGFyaXNvbnMiLCJvcGVyYXRvciIsInNlZWtlZFZhbHVlIiwidGVzdE1hc2siLCJ2YWxpZENvbmRpdGlvbnMiLCJmb250RmFtaWx5IiwiYm9yZGVyIiwiaW5wdXRQYWRkaW5nIiwibGFiZWxTaXplIiwiaWNvblNpemUiLCJDaG9pY2UiLCJpbml0aWFsQ2hvaWNlcyIsInR5cGVCdWZmZXIiLCJfc2V0dGluZ0ZpbHRlcnMiLCJsYXN0U2VsZWN0ZWQiLCJjdXJyZW50SGlnaGxpZ2h0ZWQiLCJ2aXNpYmxlQ2hvaWNlc0NvdW50IiwidmlzaWJsZUNob2ljZXMiLCJlbHMiLCJfc2VsZWN0ZWRDYWxsYmFjayIsInNjcm9sbEluZGljYXRvclVwIiwic2Nyb2xsSW5kaWNhdG9yRG93biIsIkxpc3QiLCJhZGRDaG9pY2UiLCJfYXR0YWNoQmluZGluZ3Nfc2Nyb2xsSW5kaWNhdG9ycyIsImFwcGVuZENob2ljZXMiLCJzY3JvbGxUb0Nob2ljZSIsInNldFRyYW5zbGF0ZSIsIm5ld0Nob2ljZSIsInByZXZDaG9pY2UiLCJ1cCIsImhpZ2hsaWdodFByZXYiLCJkb3duIiwiaGlnaGxpZ2h0TmV4dCIsImVzYyIsImFueVByaW50YWJsZSIsInR5cGVCdWZmZXJUaW1lb3V0IiwiYnVmZmVyIiwiY2hvaWNlSW5WaWV3Iiwic2hvd0JvdHRvbUluZGljYXRvciIsInNob3dUb3BJbmRpY2F0b3IiLCJzdGFydFNjcm9sbGluZyIsInN0b3BTY3JvbGxpbmciLCJhcHBlbmRlZENob2ljZXMiLCJyZW1vdmVDaG9pY2UiLCJmaW5kQ2hvaWNlQW55IiwicmVwbGFjZUNob2ljZXMiLCJmaW5kQ2hvaWNlIiwiYnlMYWJlbCIsIm1hdGNoZXMiLCJjdXJyZW50SW5kZXgiLCJzY3JvbGxVcCIsInNjcm9sbERvd24iLCJtYXhIZWlnaHQiLCJib3R0b21DdXRvZmYiLCJ0cmFuc2xhdGlvbiIsImNsaXBwaW5nUGFyZW50Iiwib3ZlcmZsb3ciLCJzZWxmUmVjdCIsImNsaXBwaW5nUmVjdCIsInRvcEN1dG9mZiIsImlzQm90dG9tQ3V0b2ZmIiwiaXNUb3BDdXRvZmYiLCJuZWVkc05ld0hlaWdodCIsImN1dG9mZiIsIndpbmRvd0N1dG9mZiIsIndpbmRvd0hlaWdodCIsInNldERpbWVuc2lvbnMiLCJvZmZzZXQiLCJkaXN0YW5lRnJvbVRvcCIsIm9mZnNldFRvcCIsInNlbGVjdGVkSGVpZ2h0IiwiY2hvaWNlUmVjdCIsImxpc3RSZWN0IiwidXBQYWRkaW5nIiwiZG93blBhZGRpbmciLCJkaXJlY3Rpb24iLCJzY3JvbGxJbnRlcnZhbElEIiwidW5hdmFpbGFibGUiLCJpbml0aWFsaXplZCIsInNvcnQiLCJzdG9wUHJvcGFnYXRpb24iLCJuZXdTdGF0ZSIsInByZXZTdGF0ZSIsIndhc1NlbGVjdGVkIiwibWFza0NvcmUiLCJtYXNrQWRkb25zIiwiZGVmYXVsdFBhdHRlcm5DaGFycyIsInByZXZDdXJzb3IiLCJwYXR0ZXJuUmF3IiwicGF0dGVyblNldHRlciIsInBsYWNlaG9sZGVyQ2hhciIsInBsYWNlaG9sZGVyUmVnZXgiLCJrZWVwQ2hhclBvc2l0aW9ucyIsImNoYXJzIiwiY3VzdG9tUGF0dGVybnMiLCJzZXRQYXR0ZXJuIiwiZ2V0U3RhdGUiLCJyYXdWYWx1ZSIsImN1cnJlbnRDYXJldFBvc2l0aW9uIiwicHJldmlvdXNDb25mb3JtZWRWYWx1ZSIsImdldFBsYWNlaG9sZGVyIiwiY2hhciIsInJlc29sdmVQYXR0ZXJuIiwidHJhcEluZGV4ZXMiLCJjb3B5IiwicHJldlBhdHRlcm4iLCJyZXNvbHZlZFBhdHRlcm4iLCJjYXJldFRyYXBJbmRleGVzIiwidXBkYXRlVmFsdWUiLCJ1cGRhdGVGaWVsZCIsInBhcnNlUGF0dGVybiIsInBhcnNlVHJhbnNmb3JtIiwiZW1haWxNYXNrIiwidHJpbSIsInBhcnQiLCJjcmVhdGVOdW1iZXJNYXNrIiwic3VmZml4IiwiaW5jbHVkZVRob3VzYW5kc1NlcGFyYXRvciIsInNlcCIsInRob3VzYW5kc1NlcGFyYXRvclN5bWJvbCIsImFsbG93RGVjaW1hbCIsImRlY2ltYWwiLCJkZWNpbWFsTGltaXQiLCJpbnRlZ2VyTGltaXQiLCJsaW1pdCIsImVzY2FwZWQiLCJjcmVhdGVBdXRvQ29ycmVjdGVkRGF0ZVBpcGUiLCJuZXdQYXR0ZXJuIiwiY29uZm9ybVRvTWFzayIsInRyYW5zZm9ybWVkIiwiY29uZm9ybWVkVmFsdWUiLCJpbmRleGVzT2ZQaXBlZENoYXJzIiwiYWRqdXN0Q2FyZXRQb3NpdGlvbiIsImtleUNvZGVzIiwiZGVsZXRlIiwiY3RybCIsImFsdCIsInN1cGVyIiwic3VwZXIyIiwiaHlwaGVuIiwidW5kZXJzY29yZSIsInF1ZXN0aW9uIiwiZXhjbGFtYXRpb24iLCJmcm9udHNsYXNoIiwiYmFja3NsYXNoIiwiY29tbWEiLCJwZXJpb2QiLCJzcGFjZSIsImFueUFycm93IiwiY29kZSIsImFueU1vZGlmaWVyIiwiYW55QWxwaGEiLCJhbnlOdW1lcmljIiwiYW55QWxwaGFOdW1lcmljIiwiQ0hFQ0tNQVJLX1dJRFRIIiwiQ09MT1JTIiwicG9zaXRpb24iLCJ2ZXJ0aWNhbEFsaWduIiwiYm94U2l6aW5nIiwidGV4dEFsaWduIiwiJHZpc2libGUiLCIkc2hvd0Vycm9yIiwiekluZGV4IiwiZm9udFdlaWdodCIsImxpbmVIZWlnaHQiLCJncmV5IiwidHJhbnNpdGlvbiIsInVzZXJTZWxlY3QiLCJwb2ludGVyRXZlbnRzIiwiJGZpbGxlZCIsIiRzaG93TGFiZWwiLCIkZm9jdXMiLCJvcmFuZ2UiLCJyZWQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJib3JkZXJXaWR0aCIsImJvcmRlclN0eWxlIiwiYm9yZGVyQ29sb3IiLCJncmV5X2xpZ2h0IiwiYm9yZGVyUmFkaXVzIiwiJGRpc2FibGVkIiwiaWNvblNpYmxpbmciLCJpbnB1dFNpYmxpbmciLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsInN1YnRyYWN0IiwiYXBwZWFyYW5jZSIsIm91dGxpbmUiLCJibGFjayIsImJveFNoYWRvdyIsImJhY2tncm91bmRDbGlwIiwidG90YWxIZWlnaHQiLCJ3b3JrYWJsZUhlaWdodCIsImZsb29yIiwiaG9yaXoiLCJ2ZXJ0aSIsInZpc2liaWxpdHkiLCIkc2hvd0hlbHAiLCJwYWRkaW5nVG9wIiwiZ3JlZW4iLCJ0cmFuc2Zvcm1PcmlnaW4iLCIkaW52YWxpZCIsIm1heFdpZHRoIiwibWluV2lkdGgiLCJTQU1QTEVfU1RZTEUiLCJ0b0tlYmFiQ2FzZSIsInNraXBJbml0aWFsQ2hlY2siLCJncmVhdCIsImxlc3MiLCJwaXZvdCIsImhzaCIsImNoYXJDb2RlQXQiLCJpbmxpbmVTdHlsZUNvbmZpZyIsInN0eWxlQ29uZmlnIiwidmFsdWVUb1N0b3JlIiwic3R5bGVFbCIsImhlYWQiLCJjb250ZW50IiwiUkVHRVhfTEVOX1ZBTCIsIlJFR0VYX0RJR0lUUyIsIlJFR0VYX1NQQUNFIiwiUkVHRVhfS0VCQUIiLCJJTVBPUlRBTlQiLCJQT1NTSUJMRV9QUkVGSVhFUyIsIlJFUVVJUkVTX1VOSVRfVkFMVUUiLCJRVUFEX1NIT1JUSEFORFMiLCJESVJFQ1RJT05TIiwibnVtYmVyTG9vc2UiLCJOdW1iZXIiLCJkb21UZXh0YXJlYSIsImRvbUlucHV0IiwiZG9tU2VsZWN0IiwiZG9tRmllbGQiLCJTVkciLCIkaXNPcGVuIiwiJGhhc1Zpc2libGVDaG9pY2VzIiwib3ZlcmZsb3dTY3JvbGxpbmciLCJvdmVyZmxvd1N0eWxlIiwiJHVuYXZhaWxhYmxlIiwiJGhvdmVyIiwic3Ryb2tlIiwiJHNlbGVjdGVkIiwidGV4dE92ZXJmbG93Iiwid29yZFdyYXAiLCJjYXJldFVwIiwiY2FyZXREb3duIiwiYm9yZGVyVG9wIiwiciIsImFtZCIsInRleHRNYXNrQ29yZSIsInQiLCJvIiwibG9hZGVkIiwibSIsInAiLCJfX2VzTW9kdWxlIiwicHJldmlvdXNQbGFjZWhvbGRlciIsInUiLCJsIiwicyIsImYiLCJoIiwiZyIsInkiLCJDIiwiUCIsIngiLCJPIiwiTSIsIlQiLCJ3IiwiViIsIlMiLCJzdWJzdHIiLCJOIiwiRSIsIkEiLCJJIiwiSiIsInEiLCJGIiwiTCIsIlciLCJ6IiwiRCIsIkgiLCJLIiwiUSIsImNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlciIsImFicyIsImlzTmV3Iiwic29tZUNoYXJzUmVqZWN0ZWQiLCJKU09OIiwic3RyaW5naWZ5IiwibWFza1dpdGhvdXRDYXJldFRyYXBzIiwiaW5kZXhlcyIsInByb2Nlc3NDYXJldFRyYXBzIiwiaW5wdXRFbGVtZW50Iiwic2hvd01hc2siLCJyZWplY3RlZCIsImFjdGl2ZUVsZW1lbnQiLCJhc3NpZ24iLCJTeW1ib2wiLCJpdGVyYXRvciIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRleHRNYXNrQWRkb25zIiwiZGQiLCJtbSIsInl5IiwieXl5eSIsInNvbWUiLCJsYXN0SW5kZXhPZiIsIiQiLCJkZWNpbWFsU3ltYm9sIiwicmVxdWlyZURlY2ltYWwiLCJhbGxvd05lZ2F0aXZlIiwiYWxsb3dMZWFkaW5nWmVyb2VzIiwiaW5zdGFuY2VPZiIsImdyZXlfZGFyayIsImdyZXlfc2VtaV9saWdodCIsImdyZXlfbGlnaHQyIiwiZ3JleV9saWdodDMiLCJncmV5X2xpZ2h0NCIsIlN0YXRlQ2hhaW4iLCJ3aXRob3V0Iiwib3RoZXJBY3RpdmUiLCJhY3RpdmUiLCJhbmdsZURvd24iLCJwbHVzIiwidmlld0JveCIsInRhYmlu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a007T0FBTztBQUNQQyxRQUFRO0FBQ1JrMEIsU0FBUzs7R0FFVixDQUFDLFNBQ0FwN0I7T0FDQ29rQztVQUFVLENBQUM7QUFDWEMsV0FBVztBQUNYblosR0FBRzs7SUFHTCxDQUFDLFNBQ0FsckI7T0FDQ29rQztVQUFVLENBQUM7QUFDWEMsV0FBVztBQUNYblosR0FBRyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJoZWxwZXJzID0gaW1wb3J0ICcuL2hlbHBlcnMnXG5ET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuSVMgPSBpbXBvcnQgJy4vY2hlY2tzJ1xuZXh0ZW5kID0gaW1wb3J0ICdzbWFydC1leHRlbmQnXG5yZWdpc3RlckFuaW1hdGlvbnMgPSBpbXBvcnQgJy4vYW5pbWF0aW9ucydcblJFUVVJUkVEX0ZJRUxEX01FVEhPRFMgPSBpbXBvcnQgJy4vY29uc3RhbnRzL3JlcUZpZWxkTWV0aG9kcydcbmltcG9ydCAnLi9jb25zb2xlUGF0Y2gnXG5cblxubmV3QnVpbGRlciA9IChzZXR0aW5nT3ZlcnJpZGVzLCB0ZW1wbGF0ZU92ZXJyaWRlcyktPlxuXHRidWlsZGVyID0gKHNldHRpbmdzKS0+XG5cdFx0c2V0dGluZ3MgPSBleHRlbmQuY2xvbmUoYXJndW1lbnRzLi4uKSBpZiBhcmd1bWVudHMubGVuZ3RoID4gMVxuXHRcdHNldHRpbmdzID0ge30gdW5sZXNzIElTLm9iamVjdChzZXR0aW5ncylcblx0XHRzZXR0aW5ncy50eXBlID89ICd0ZXh0J1xuXG5cblx0XHRpZiBub3QgRmllbGRbc2V0dGluZ3MudHlwZV1cblx0XHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrRmllbGQ6ICcje3NldHRpbmdzLnR5cGV9JyBpcyBub3QgYSB2YWxpZC9yZWdpc3RlcmVkIGZpZWxkIHR5cGVcIlxuXG5cdFx0cmVnaXN0ZXJBbmltYXRpb25zKClcblx0XHRuZXcgRmllbGRbc2V0dGluZ3MudHlwZV0oc2V0dGluZ3MsIGJ1aWxkZXIsIHNldHRpbmdPdmVycmlkZXMsIHRlbXBsYXRlT3ZlcnJpZGVzKVxuXG5cblx0YnVpbGRlci5yZWdpc3RlciA9ICh0eXBlLCB0YXJnZXRGaWVsZCktPlxuXHRcdGlmIG5vdCBJUy5zdHJpbmcodHlwZSkgb3Igbm90IElTLmZ1bmN0aW9uKHRhcmdldEZpZWxkKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiUXVpY2tGaWVsZCBSZWdpc3RyYXRpb246IGludmFsaWQgYXJndW1lbnRzXCJcblx0XHRmb3IgcmVxdWlyZWRNZXRob2QgaW4gUkVRVUlSRURfRklFTERfTUVUSE9EU1xuXHRcdFx0aWYgbm90IHRhcmdldEZpZWxkOjpbcmVxdWlyZWRNZXRob2RdXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrRmllbGQgUmVnaXN0cmF0aW9uOiAnI3tyZXF1aXJlZE1ldGhvZH0nIG1ldGhvZCBpcyByZXF1aXJlZCBpbiBvcmRlciB0byByZWdpc3RlciB0aGUgZmllbGRcIlxuXG5cdFx0RmllbGRbdHlwZV0gPSB0YXJnZXRGaWVsZFxuXHRcdHJldHVybiBAXG5cblxuXHRidWlsZGVyLmNvbmZpZyA9IChuZXdTZXR0aW5ncywgbmV3VGVtcGxhdGVzKS0+XG5cdFx0dGhyb3cgbmV3IEVycm9yIFwiUXVpY2tGaWVsZCBDb25maWc6IGludmFsaWQgY29uZmlnIG9iamVjdCBwcm92aWRlZCAje1N0cmluZyBuZXdTZXR0aW5nc31cIiBpZiBub3QgSVMub2JqZWN0KG5ld1NldHRpbmdzKVxuXHRcdG91dHB1dFNldHRpbmdzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdFxuXHRcdGZvciB0eXBlLGNvbmZpZyBvZiBuZXdTZXR0aW5nc1xuXHRcdFx0aWYgdHlwZSBpcyAnZ2xvYmFsJ1xuXHRcdFx0XHRvdXRwdXRTZXR0aW5ncy5nbG9iYWxEZWZhdWx0cyA9IGV4dGVuZC5kZWVwLm5vdERlZXAoRmllbGQuc2hhbGxvd1NldHRpbmdzKS5jbG9uZShGaWVsZDo6Z2xvYmFsRGVmYXVsdHMsIGNvbmZpZylcblx0XHRcdGVsc2UgaWYgRmllbGRbdHlwZV1cblx0XHRcdFx0b3V0cHV0U2V0dGluZ3NbdHlwZV0gPSBleHRlbmQuY2xvbmUuZGVlcC5ub3REZWVwKEZpZWxkLnNoYWxsb3dTZXR0aW5ncykoRmllbGRbdHlwZV06OmRlZmF1bHRzLCBjb25maWcpXG5cblx0XHRpZiBJUy5vYmplY3QobmV3VGVtcGxhdGVzKVxuXHRcdFx0b3V0cHV0VGVtcGxhdGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdFx0Z2xvYmFsQ29uZmlnID0gbmV3VGVtcGxhdGVzLmdsb2JhbFxuXHRcdFx0aWYgZ2xvYmFsQ29uZmlnIGFuZCBnbG9iYWxDb25maWcuZmllbGQgYW5kIG5vdCBnbG9iYWxDb25maWcuZGVmYXVsdFxuXHRcdFx0XHRnbG9iYWxDb25maWcuZGVmYXVsdCA9IGdsb2JhbENvbmZpZy5maWVsZFxuXHRcdFx0XG5cdFx0XHRmb3IgdHlwZSBvZiBGaWVsZFxuXHRcdFx0XHRvcmlnaW5hbFRlbXBsYXRlcyA9IEZpZWxkW3R5cGVdOjo/LnRlbXBsYXRlc1xuXHRcdFx0XHR0ZW1wbGF0ZXMgPSBuZXdUZW1wbGF0ZXNbdHlwZV0gb3IgZ2xvYmFsQ29uZmlnXG5cdFx0XHRcdGlmIG5vdCBvcmlnaW5hbFRlbXBsYXRlc1xuXHRcdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRcdGlmIG5vdCB0ZW1wbGF0ZXNcblx0XHRcdFx0XHRvdXRwdXRUZW1wbGF0ZXNbdHlwZV0gPSBvcmlnaW5hbFRlbXBsYXRlc1xuXHRcdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiB0ZW1wbGF0ZXMuZmllbGQgYW5kIG5vdCB0ZW1wbGF0ZXMuZGVmYXVsdFxuXHRcdFx0XHRcdHRlbXBsYXRlcy5kZWZhdWx0ID0gdGVtcGxhdGVzLmZpZWxkXG5cblx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW3R5cGVdID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdFx0XHRcblx0XHRcdFx0Zm9yIG5hbWUsY29uZmlnIG9mIHRlbXBsYXRlc1xuXHRcdFx0XHRcdGNvbnRpbnVlIGlmIG5hbWUgaXMgJ2ZpZWxkJyBvciBub3Qgb3JpZ2luYWxUZW1wbGF0ZXNbbmFtZV1cblx0XHRcdFx0XHRjb25maWcgPSBleHRlbmQuY2xvbmUuZGVlcC5jb25jYXQoZ2xvYmFsQ29uZmlnW25hbWVdLCBjb25maWcpIGlmIGdsb2JhbENvbmZpZyBhbmQgZ2xvYmFsQ29uZmlnW25hbWVdXG5cdFx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW3R5cGVdW25hbWVdID0gb3JpZ2luYWxUZW1wbGF0ZXNbbmFtZV0uZXh0ZW5kKGNvbmZpZylcblxuXHRcdFx0XHRmb3IgbmFtZSxjb25maWcgb2Ygb3JpZ2luYWxUZW1wbGF0ZXMgd2hlbiBub3Qgb3V0cHV0VGVtcGxhdGVzW3R5cGVdW25hbWVdXG5cdFx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW3R5cGVdW25hbWVdID0gY29uZmlnXG5cblx0XHRyZXR1cm4gbmV3QnVpbGRlcihvdXRwdXRTZXR0aW5ncywgb3V0cHV0VGVtcGxhdGVzKVxuXG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgYnVpbGRlciwgJ2ZpZWxkcycsIGdldDogKCktPlxuXHRcdGV4dGVuZC5jbG9uZS5vd24ubm90S2V5cygnaW5zdGFuY2VzJykoRmllbGQpXG5cblx0YnVpbGRlci5zZXR0aW5nT3ZlcnJpZGVzID0gc2V0dGluZ092ZXJyaWRlc1xuXHRidWlsZGVyLnRlbXBsYXRlT3ZlcnJpZGVzID0gdGVtcGxhdGVPdmVycmlkZXNcblx0YnVpbGRlci52ZXJzaW9uID0gaW1wb3J0ICcuLi9wYWNrYWdlLmpzb24gJCB2ZXJzaW9uJ1xuXHRidWlsZGVyLkZpZWxkID0gRmllbGQgPSBpbXBvcnQgJy4vZmllbGQnXG5cdHJldHVybiBidWlsZGVyXG5cblxuXG5cblxuXG5RdWlja0ZpZWxkID0gbmV3QnVpbGRlcigpXG5RdWlja0ZpZWxkLnJlZ2lzdGVyICd0ZXh0JywgaW1wb3J0ICcuL2ZpZWxkL3RleHQnXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ3RleHRhcmVhJywgaW1wb3J0ICcuL2ZpZWxkL3RleHRhcmVhJ1xuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdudW1iZXInLCBpbXBvcnQgJy4vZmllbGQvbnVtYmVyJ1xuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdzZWxlY3QnLCBpbXBvcnQgJy4vZmllbGQvc2VsZWN0J1xuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdjaG9pY2UnLCBpbXBvcnQgJy4vZmllbGQvY2hvaWNlJ1xuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICd0cnVlZmFsc2UnLCBpbXBvcnQgJy4vZmllbGQvdHJ1ZWZhbHNlJ1xuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICd0b2dnbGUnLCBpbXBvcnQgJy4vZmllbGQvdG9nZ2xlJ1xuIyBRdWlja0ZpZWxkLnJlZ2lzdGVyICdncm91cCcsIGltcG9ydCAnLi9maWVsZC9ncm91cCdcbiMgUXVpY2tGaWVsZC5yZWdpc3RlciAncmVwZWF0ZXInLCBpbXBvcnQgJy4vZmllbGQvcmVwZWF0ZXInXG4jIFF1aWNrRmllbGQucmVnaXN0ZXIgJ2ZpbGUnLCBpbXBvcnQgJy4vZmllbGQvZmlsZSdcbm1vZHVsZS5leHBvcnRzID0gUXVpY2tGaWVsZCIsIiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcbkBjb25zb2xlID89IHt9XG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5jb25zb2xlLmxvZyA/PSAoKS0+XG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5jb25zb2xlLndhcm4gPz0gY29uc29sZS5sb2ciLCJ7XG4gIFwibmFtZVwiOiBcInF1aWNrZmllbGRcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjg4XCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJGYXN0ICYgbGlnaHQgZm9ybSBmaWVsZHMgbWFuYWdlbWVudCBzdXBwb3J0aW5nIHJlYWwtdGltZSBiaW5kaW5ncywgY3VzdG9tIHN0eWxpbmcsIGN1c3RvbSBmaWVsZHMsIElFOSssIGFuZCBtb3JlLi4uXCIsXG4gIFwibWFpblwiOiBcImRpc3QvcXVpY2tmaWVsZC5qc1wiLFxuICBcImJyb3dzZXJcIjoge1xuICAgIFwiLi9kZWJ1Z1wiOiBcImRpc3QvcXVpY2tmaWVsZC5kZWJ1Zy5qc1wiLFxuICAgIFwiLi9kaXN0L3F1aWNrZmllbGQuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkXCI6IFwic3JjL2ZpZWxkL2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC90ZXh0XCI6IFwic3JjL2ZpZWxkL3RleHQvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC90ZXh0YXJlYVwiOiBcInNyYy9maWVsZC90ZXh0YXJlYS9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL251bWJlclwiOiBcInNyYy9maWVsZC9udW1iZXIvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9zZWxlY3RcIjogXCJzcmMvZmllbGQvc2VsZWN0L19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvY2hvaWNlXCI6IFwic3JjL2ZpZWxkL2Nob2ljZS9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL3RydWVmYWxzZVwiOiBcInNyYy9maWVsZC90cnVlZmFsc2UvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC90b2dnbGVcIjogXCJzcmMvZmllbGQvdG9nZ2xlL19pbmRleC5jb2ZmZWVcIixcbiAgICBcIi4vZmllbGQvZ3JvdXBcIjogXCJzcmMvZmllbGQvZ3JvdXAvX2luZGV4LmNvZmZlZVwiLFxuICAgIFwiLi9maWVsZC9yZXBlYXRlclwiOiBcInNyYy9maWVsZC9yZXBlYXRlci9faW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2ZpZWxkL2ZpbGVcIjogXCJzcmMvZmllbGQvZmlsZS9faW5kZXguY29mZmVlXCJcbiAgfSxcbiAgXCJmaWxlc1wiOiBbXG4gICAgXCJzcmNcIixcbiAgICBcImRpc3RcIlxuICBdLFxuICBcImJyb3dzZXJpZnlcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwic2ltcGx5aW1wb3J0L2NvbXBhdFwiXG4gICAgXVxuICB9LFxuICBcInNpbXBseWltcG9ydFwiOiB7XG4gICAgXCJmaW5hbFRyYW5zZm9ybVwiOiBbXG4gICAgICBbXG4gICAgICAgIFwiYmFiZWxpZnlcIixcbiAgICAgICAge1xuICAgICAgICAgIFwicHJlc2V0c1wiOiBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIFwiQGJhYmVsL3ByZXNldC1lbnZcIixcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibW9kdWxlc1wiOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXN1cGVyXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktcmVuYW1lXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc2ltcGxlXCJcbiAgICBdXG4gIH0sXG4gIFwiZGlyZWN0b3JpZXNcIjoge1xuICAgIFwidGVzdFwiOiBcInRlc3RcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwicG9zdHZlcnNpb25cIjogXCJucG0gcnVuIGJ1aWxkICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJmYWxzZSAmJiBucG0gcnVuIHRlc3Q6dHJhdmlzIHx8IHRydWVcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcIndhdGNoXCI6IFwiY2FrZSAtZCB3YXRjaFwiLFxuICAgIFwiYnVpbGRcIjogXCJjYWtlIC1kIGJ1aWxkICYmIGNha2UgYnVpbGQgJiYgY2FrZSBtZWFzdXJlICYmIGNwIC1yIGJ1aWxkLyogZGlzdC9cIixcbiAgICBcInRlc3RcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OnRyYXZpc1wiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zICYmIG5wbSBydW4gdGVzdDptaW5pZmllZCAtc1wiLFxuICAgIFwidGVzdDpsb2NhbFwiOiBcIm9wZW4gdGVzdC90ZXN0cnVubmVyLmh0bWxcIixcbiAgICBcInRlc3Q6bWluaWZpZWRcIjogXCJtaW5pZmllZD0xIG5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6a2FybWFcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmJyb3dzZXJcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRWxlY3Ryb24gLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpjaHJvbWVcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIENocm9tZSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmZpcmVmb3hcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRmlyZWZveCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhZmFyaVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgU2FmYXJpIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6c2F1Y2VcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBzYXVjZT0xIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcImNvdmVyYWdlXCI6IFwiY2FrZSBpbnN0YWxsOmNvdmVyYWdlOyBucG0gcnVuIGNvdmVyYWdlOnJ1biAmJiBucG0gcnVuIGNvdmVyYWdlOmJhZGdlXCIsXG4gICAgXCJjb3ZlcmFnZTpydW5cIjogXCJjb3ZlcmFnZT10cnVlIG5wbSBydW4gdGVzdDplbGVjdHJvblwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLi8uY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6c2hvd1wiOiBcIm9wZW4gY292ZXJhZ2UvbGNvdi1yZXBvcnQvaW5kZXguaHRtbFwiXG4gIH0sXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZmllbGQuZ2l0XCJcbiAgfSxcbiAgXCJhdXRob3JcIjogXCJkYW5pZWxrYWxlblwiLFxuICBcImxpY2Vuc2VcIjogXCJJU0NcIixcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2ZpZWxkL2lzc3Vlc1wiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tmaWVsZCNyZWFkbWVcIixcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGRhbmllbGthbGVuL2lzXCI6IFwiXjIuMC4wXCIsXG4gICAgXCJAZGFuaWVsa2FsZW4vc2ltcGx5YmluZFwiOiBcIl4xLjE1LjhcIixcbiAgICBcImZhc3Rkb21cIjogXCJeMS4wLjZcIixcbiAgICBcImxldmVuXCI6IFwiXjIuMC4wXCIsXG4gICAgXCJtb3ZlLWpzXCI6IFwiXjAuNS4wXCIsXG4gICAgXCJxdWlja2Nzc1wiOiBcIl4xLjQuMVwiLFxuICAgIFwicXVpY2tkb21cIjogXCJeMS4wLjg5XCIsXG4gICAgXCJzbWFydC1leHRlbmRcIjogXCJeMS43LjNcIixcbiAgICBcInRleHQtbWFzay1hZGRvbnNcIjogXCJeMy42LjBcIixcbiAgICBcInRleHQtbWFzay1jb3JlXCI6IFwiXjUuMC4xXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGJhYmVsL2NvcmVcIjogXCJeNy4xLjZcIixcbiAgICBcIkBiYWJlbC9wcmVzZXQtZW52XCI6IFwiXjcuMS42XCIsXG4gICAgXCJiYWJlbGlmeVwiOiBcIl4xMC4wLjBcIixcbiAgICBcImJsdWViaXJkXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJjaGFsa1wiOiBcIl4yLjAuMVwiLFxuICAgIFwiY29mZmVlLXNjcmlwdFwiOiBcIl4xLjEyLjZcIixcbiAgICBcImNvZmZlZWlmeS1jYWNoZWRcIjogXCJeMy4wLjBcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMi4yLjBcIixcbiAgICBcImtleXNpbVwiOiBcImdpdGh1YjpkYW5pZWxrYWxlbi9rZXlzaW0uanNcIixcbiAgICBcInBhY2thZ2UtaW5zdGFsbFwiOiBcIl4xLjIuNlwiLFxuICAgIFwic2ltcGx5aW1wb3J0XCI6IFwiXjQuMC45XCIsXG4gICAgXCJzaW1wbHl3YXRjaFwiOiBcIl4zLjAuMFwiXG4gIH1cbn1cbiIsIklTID0gaW1wb3J0ICcuL2NoZWNrcydcbkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5TaW1wbHlCaW5kID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vc2ltcGx5YmluZCdcbnJlZ2V4ID0gaW1wb3J0ICcuL2NvbnN0YW50cy9yZWdleCdcblxuaGVscGVycyA9IGV4cG9ydHNcbmhlbHBlcnMubm9vcCA9ICgpLT5cblxuaGVscGVycy5pbmNsdWRlcyA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0dGFyZ2V0IGFuZCB0YXJnZXQuaW5kZXhPZihpdGVtKSBpc250IC0xXG5cbmhlbHBlcnMucmVwZWF0ID0gKHN0cmluZywgY291bnQpLT5cblx0KHN0cmluZyBmb3IgaSBpbiBbMS4uY291bnRdKS5qb2luKCcnKVxuXG5oZWxwZXJzLnJlbW92ZUl0ZW0gPSAodGFyZ2V0LCBpdGVtKS0+XG5cdGl0ZW1JbmRleCA9IHRhcmdldC5pbmRleE9mKGl0ZW0pXG5cdHRhcmdldC5zcGxpY2UoaXRlbUluZGV4LCAxKSBpZiBpdGVtSW5kZXggaXNudCAtMVxuXG5oZWxwZXJzLmluc2VydEFmdGVyID0gKHRhcmdldCwgaXRlbSwgbmV3SXRlbSktPlxuXHRpdGVtSW5kZXggPSB0YXJnZXQuaW5kZXhPZihpdGVtKVxuXHR0YXJnZXQuc3BsaWNlKGl0ZW1JbmRleCwgMCwgbmV3SXRlbSkgaWYgaXRlbUluZGV4IGlzbnQgLTFcblxuaGVscGVycy5maW5kID0gKHRhcmdldCwgZm4pLT5cblx0cmVzdWx0cyA9IHRhcmdldC5maWx0ZXIoZm4pXG5cdHJlc3VsdHNbMF1cblxuaGVscGVycy5kaWZmID0gKHNvdXJjZSwgY29tcGFyZWUpLT5cblx0cmVzdWx0ID0gW11cblx0bWF4TGVuID0gTWF0aC5tYXgoc291cmNlLmxlbmd0aCwgY29tcGFyZWUubGVuZ3RoKVxuXHRpID0gLTFcblx0XG5cdHdoaWxlICsraSA8IG1heExlblxuXHRcdHNvdXJjZVZhbCA9IHNvdXJjZVtpXVxuXHRcdGNvbXBhcmVlVmFsID0gY29tcGFyZWVbaV1cblxuXHRcdGlmIHNvdXJjZVZhbCBpc250IGNvbXBhcmVlVmFsXG5cdFx0XHRyZXN1bHQucHVzaChzb3VyY2VWYWwpIGlmIElTLmRlZmluZWQoc291cmNlVmFsKSBhbmQgbm90IGhlbHBlcnMuaW5jbHVkZXMoY29tcGFyZWUsIHNvdXJjZVZhbClcblx0XHRcdHJlc3VsdC5wdXNoKGNvbXBhcmVlVmFsKSBpZiBJUy5kZWZpbmVkKGNvbXBhcmVlVmFsKSBhbmQgbm90IGhlbHBlcnMuaW5jbHVkZXMoc291cmNlLCBjb21wYXJlZVZhbClcblxuXHRyZXR1cm4gcmVzdWx0XG5cblxuaGVscGVycy5oZXhUb1JHQkEgPSAoaGV4LCBhbHBoYSktPlxuXHRoZXggPSBoZXguc2xpY2UoMSkgaWYgaGV4WzBdIGlzICcjJ1xuXHRSID0gcGFyc2VJbnQgaGV4LnNsaWNlKDAsMiksIDE2XG5cdEcgPSBwYXJzZUludCBoZXguc2xpY2UoMiw0KSwgMTZcblx0QiA9IHBhcnNlSW50IGhleC5zbGljZSg0LDYpLCAxNlxuXHRyZXR1cm4gXCJyZ2JhKCN7Un0sICN7R30sICN7Qn0sICN7YWxwaGF9KVwiXG5cblxuaGVscGVycy5kZWZhdWx0Q29sb3IgPSAoY29sb3IsIGRlZmF1bHRDb2xvciktPlxuXHRpZiBjb2xvciBpcyAndHJhbnNwYXJlbnQnIG9yIG5vdCBjb2xvclxuXHRcdHJldHVybiBkZWZhdWx0Q29sb3Jcblx0ZWxzZVxuXHRcdHJldHVybiBjb2xvclxuXG5cbmhlbHBlcnMuY2FsY1BhZGRpbmcgPSAoZGVzaXJlZEhlaWdodCwgZm9udFNpemUpLT5cblx0TWF0aC5jZWlsIChkZXNpcmVkSGVpZ2h0IC0gZm9udFNpemUqMS4yMzEpLzJcblxuXG5oZWxwZXJzLnVubG9ja1Njcm9sbCA9IChleGNsdWRlZEVsKS0+XG5cdHdpbmRvdy5faXNMb2NrZWQgPSBmYWxzZVxuXHRET00od2luZG93KS5vZmYgJ3doZWVsLmxvY2snXG5cblxuaGVscGVycy5sb2NrU2Nyb2xsID0gKGV4Y2x1ZGVkRWwpLT4gdW5sZXNzIHdpbmRvdy5faXNMb2NrZWRcblx0d2luZG93Ll9pc0xvY2tlZCA9IHRydWVcblx0RE9NKHdpbmRvdykub24gJ3doZWVsLmxvY2snLCAoZXZlbnQpLT5cblx0XHRpZiBldmVudC50YXJnZXQgaXMgZXhjbHVkZWRFbC5yYXcgb3IgRE9NKGV2ZW50LnRhcmdldCkucGFyZW50TWF0Y2hpbmcoKHBhcmVudCktPiBwYXJlbnQgaXMgZXhjbHVkZWRFbClcblx0XHRcdGlmIGV2ZW50LndoZWVsRGVsdGEgPiAwIGFuZCBleGNsdWRlZEVsLnJhdy5zY3JvbGxUb3AgaXMgMFxuXHRcdFx0XHRyZXR1cm4gZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0XHRpZiBldmVudC53aGVlbERlbHRhIDwgMCBhbmQgZXhjbHVkZWRFbC5yYXcuc2Nyb2xsSGVpZ2h0IC0gZXhjbHVkZWRFbC5yYXcuc2Nyb2xsVG9wIGlzIGV4Y2x1ZGVkRWwucmF3LmNsaWVudEhlaWdodFxuXHRcdFx0XHRyZXR1cm4gZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0ZWxzZVxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cbmhlbHBlcnMuZnV6enlNYXRjaCA9IChuZWVkbGUsIGhheXN0YWNrLCBjYXNlU2Vuc2l0aXZlKS0+XG5cdG5MZW5ndGggPSBuZWVkbGUubGVuZ3RoXG5cdGhMZW5ndGggPSBoYXlzdGFjay5sZW5ndGhcblx0dW5sZXNzIGNhc2VTZW5zaXRpdmVcblx0XHRuZWVkbGUgPSBuZWVkbGUudG9VcHBlckNhc2UoKVxuXHRcdGhheXN0YWNrID0gaGF5c3RhY2sudG9VcHBlckNhc2UoKVxuXG5cdGlmIG5MZW5ndGggPiBoTGVuZ3RoXG5cdFx0cmV0dXJuIGZhbHNlXG5cdGlmIG5MZW5ndGggaXMgaExlbmd0aFxuXHRcdHJldHVybiBuZWVkbGUgaXMgaGF5c3RhY2tcblxuXHRuSSA9IGhJID0gbWF0Y2hlZENvdW50ID0wXG5cdHdoaWxlIG5JIDwgbkxlbmd0aFxuXHRcdG5lZWRsZUNoYXIgPSBuZWVkbGVbbkkrK11cblx0XHRcblx0XHR3aGlsZSBoSSA8IGhMZW5ndGhcblx0XHRcdGlmIGhheXN0YWNrW2hJKytdIGlzIG5lZWRsZUNoYXJcblx0XHRcdFx0bWF0Y2hlZENvdW50Kytcblx0XHRcdFx0YnJlYWtcblxuXHRyZXR1cm4gbWF0Y2hlZENvdW50IGlzIG5MZW5ndGhcblxuXG5oZWxwZXJzLnN0YXJ0c1dpdGggPSAobmVlZGxlLCBoYXlzdGFjaywgY2FzZVNlbnNpdGl2ZSktPlxuXHR1bmxlc3MgY2FzZVNlbnNpdGl2ZVxuXHRcdG5lZWRsZSA9IG5lZWRsZS50b1VwcGVyQ2FzZSgpXG5cdFx0aGF5c3RhY2sgPSBoYXlzdGFjay50b1VwcGVyQ2FzZSgpXG5cblx0aWYgbmVlZGxlLmxlbmd0aCA+IGhheXN0YWNrLmxlbmd0aFxuXHRcdHJldHVybiBmYWxzZVxuXHRpZiBuZWVkbGUubGVuZ3RoIGlzIGhheXN0YWNrLmxlbmd0aFxuXHRcdHJldHVybiBuZWVkbGUgaXMgaGF5c3RhY2tcblxuXHRpID0gLTFcblx0d2hpbGUgbmVlZGxlWysraV1cblx0XHRyZXR1cm4gZmFsc2UgaWYgbmVlZGxlW2ldIGlzbnQgaGF5c3RhY2tbaV1cblx0cmV0dXJuIHRydWVcblxuXG5oZWxwZXJzLmdldEluZGV4T2ZGaXJzdERpZmYgPSAoc291cmNlU3RyaW5nLCBjb21wYXJlU3RyaW5nKS0+XG5cdGN1cnJlbnRQb3MgPSAwXG5cdG1heExlbmd0aCA9IE1hdGgubWF4KHNvdXJjZVN0cmluZy5sZW5ndGgsIGNvbXBhcmVTdHJpbmcubGVuZ3RoKVxuXHRcblx0d2hpbGUgY3VycmVudFBvcyA8IG1heExlbmd0aFxuXHRcdHJldHVybiBjdXJyZW50UG9zIGlmIHNvdXJjZVN0cmluZ1tjdXJyZW50UG9zXSBpc250IGNvbXBhcmVTdHJpbmdbY3VycmVudFBvc11cblx0XHRjdXJyZW50UG9zKytcblx0XG5cdHJldHVybiBudWxsXG5cblxuXG5oZWxwZXJzLnBhcnNlQ3NzU2hvcnRoYW5kVmFsdWUgPSAoc3RyaW5nKS0+XG5cdHZhbHVlcyA9IHN0cmluZy5zcGxpdChyZWdleC53aGl0ZVNwYWNlKS5tYXAocGFyc2VGbG9hdClcblx0cmVzdWx0ID0ge31cblx0c3dpdGNoIHZhbHVlcy5sZW5ndGhcblx0XHR3aGVuIDFcblx0XHRcdHJlc3VsdC50b3AgPSByZXN1bHQucmlnaHQgPSByZXN1bHQuYm90dG9tID0gcmVzdWx0LmxlZnQgPSB2YWx1ZXNbMF1cblx0XHR3aGVuIDJcblx0XHRcdHJlc3VsdC50b3AgPSByZXN1bHQuYm90dG9tID0gdmFsdWVzWzBdXG5cdFx0XHRyZXN1bHQucmlnaHQgPSByZXN1bHQubGVmdCA9IHZhbHVlc1sxXVxuXHRcdHdoZW4gM1xuXHRcdFx0cmVzdWx0LnRvcCA9IHZhbHVlc1swXVxuXHRcdFx0cmVzdWx0LnJpZ2h0ID0gcmVzdWx0LmxlZnQgPSB2YWx1ZXNbMV1cblx0XHRcdHJlc3VsdC5ib3R0b20gPSB2YWx1ZXNbMl1cblx0XHR3aGVuIDRcblx0XHRcdHJlc3VsdC50b3AgPSB2YWx1ZXNbMF1cblx0XHRcdHJlc3VsdC5yaWdodCA9IHZhbHVlc1sxXVxuXHRcdFx0cmVzdWx0LmJvdHRvbSA9IHZhbHVlc1syXVxuXHRcdFx0cmVzdWx0LmxlZnQgPSB2YWx1ZXNbM11cblxuXHRyZXR1cm4gcmVzdWx0XG5cblxuaGVscGVycy5zaG9ydGhhbmRTaWRlVmFsdWUgPSAodmFsdWUsIHNpZGUpLT5cblx0c3dpdGNoIHR5cGVvZiB2YWx1ZVxuXHRcdHdoZW4gJ251bWJlcicgdGhlbiB2YWx1ZVxuXHRcdHdoZW4gJ3N0cmluZydcblx0XHRcdHZhbHVlcyA9IGhlbHBlcnMucGFyc2VDc3NTaG9ydGhhbmRWYWx1ZSh2YWx1ZSlcblx0XHRcdHZhbHVlc1tzaWRlXVxuXHRcdGVsc2UgMFxuXG5cbmhlbHBlcnMudXBkYXRlU2hvcnRoYW5kVmFsdWUgPSAodmFsdWUsIHNpZGUsIG5ld1ZhbHVlKS0+XG5cdHZhbHVlcyA9IGhlbHBlcnMucGFyc2VDc3NTaG9ydGhhbmRWYWx1ZSgnJysodmFsdWUgb3IgMCkpXG5cdHN3aXRjaCBzaWRlXG5cdFx0d2hlbiAndG9wJyB0aGVuIHZhbHVlcy50b3AgKz0gbmV3VmFsdWVcblx0XHR3aGVuICdyaWdodCcgdGhlbiB2YWx1ZXMucmlnaHQgKz0gbmV3VmFsdWVcblx0XHR3aGVuICdib3R0b20nIHRoZW4gdmFsdWVzLmJvdHRvbSArPSBuZXdWYWx1ZVxuXHRcdHdoZW4gJ2xlZnQnIHRoZW4gdmFsdWVzLmxlZnQgKz0gbmV3VmFsdWVcblx0XHRlbHNlIE9iamVjdC5rZXlzKHZhbHVlcykuZm9yRWFjaCAoc2lkZSktPiB2YWx1ZXNbc2lkZV0gKz0gbmV3VmFsdWVcblx0XG5cdFwiI3t2YWx1ZXMudG9wfXB4ICN7dmFsdWVzLnJpZ2h0fXB4ICN7dmFsdWVzLmJvdHRvbX1weCAje3ZhbHVlcy5sZWZ0fXB4XCJcblxuXG5oZWxwZXJzLmluaGVyaXRQcm90byA9IChjaGlsZCwgcGFyZW50LCBrZXlzKS0+XG5cdGZvciBrZXkgaW4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocGFyZW50OjopXG5cdFx0Y29udGludWUgaWYga2V5cyBhbmQgbm90IGtleXMuaW5jbHVkZXMoa2V5KVxuXHRcdHVubGVzcyBjaGlsZDo6W2tleV1cblx0XHRcdGNoaWxkOjpba2V5XSA9IHBhcmVudDo6W2tleV1cblxuXHRyZXR1cm4gY2hpbGRcblxuXG5cblxuXG5cblxuXG4iLCIjIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5pbXBvcnQgKiBhcyBDU1MgZnJvbSAncXVpY2tjc3MnXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5pbXBvcnQgKiBhcyBleHRlbmQgZnJvbSAnc21hcnQtZXh0ZW5kJ1xuaW1wb3J0ICcuL3BhcnRzL2FsbG93ZWRPcHRpb25zJ1xuaW1wb3J0ICcuL3BhcnRzL2hlbHBlcnMnXG5pbXBvcnQgJy4vcGFydHMvY2hlY2tzJ1xuaW1wb3J0ICcuL3BhcnRzL2VsZW1lbnQnXG5pbXBvcnQgJy4vcGFydHMvd2luZG93J1xuaW1wb3J0ICcuL3BhcnRzL21lZGlhUXVlcnknXG5cblF1aWNrRG9tID0gKCktPlxuXHRhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpXG5cdGFyZ3NbaV0gPSBhcmcgZm9yIGFyZyxpIGluIGFyZ3VtZW50c1xuXHRwcmV2Q291bnQgPSBRdWlja0VsZW1lbnQuY291bnRcblx0ZWxlbWVudCA9IFF1aWNrRG9tLmNyZWF0ZShhcmdzKVxuXHRlbGVtZW50Ll9wb3N0Q3JlYXRpb24oKSBpZiBlbGVtZW50IGFuZCBlbGVtZW50Ll9wb3N0Q3JlYXRpb24gYW5kIFF1aWNrRWxlbWVudC5jb3VudCBpc250IHByZXZDb3VudFxuXHRyZXR1cm4gZWxlbWVudFxuXG5RdWlja0RvbS5jcmVhdGUgPSAoYXJncyktPiBzd2l0Y2hcblx0d2hlbiBJUy5hcnJheShhcmdzWzBdKVxuXHRcdHJldHVybiBRdWlja0RvbShhcmdzWzBdLi4uKVxuXHRcblx0d2hlbiBJUy50ZW1wbGF0ZShhcmdzWzBdKVxuXHRcdHJldHVybiBhcmdzWzBdLnNwYXduKClcblx0XG5cdHdoZW4gSVMucXVpY2tEb21FbChhcmdzWzBdKVxuXHRcdHJldHVybiBpZiBhcmdzWzFdIHRoZW4gYXJnc1swXS51cGRhdGVPcHRpb25zKGFyZ3NbMV0pIGVsc2UgYXJnc1swXVxuXHRcblx0d2hlbiBJUy5kb21Ob2RlKGFyZ3NbMF0pIG9yIElTLmRvbURvYyhhcmdzWzBdKVxuXHRcdGlmIGFyZ3NbMF0uX3F1aWNrRWxlbWVudFxuXHRcdFx0cmV0dXJuIGFyZ3NbMF0uX3F1aWNrRWxlbWVudFxuXHRcdFxuXHRcdHR5cGUgPSBhcmdzWzBdLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnIycsICcnKVxuXHRcdG9wdGlvbnMgPSBhcmdzWzFdIG9yIHt9XG5cdFx0b3B0aW9ucy5leGlzdGluZyA9IGFyZ3NbMF1cblx0XHRyZXR1cm4gbmV3IFF1aWNrRWxlbWVudCh0eXBlLCBvcHRpb25zKVxuXG5cdHdoZW4gYXJnc1swXSBpcyB3aW5kb3dcblx0XHRyZXR1cm4gUXVpY2tXaW5kb3dcblxuXHR3aGVuIElTLnN0cmluZyhhcmdzWzBdKVx0XHRcdFxuXHRcdHR5cGUgPSBhcmdzWzBdLnRvTG93ZXJDYXNlKClcblx0XHRpZiB0eXBlIGlzICd0ZXh0J1xuXHRcdFx0b3B0aW9ucyA9IGlmIElTLm9iamVjdChhcmdzWzFdKSB0aGVuIGFyZ3NbMV0gZWxzZSB7dGV4dDphcmdzWzFdIG9yICcnfVxuXHRcdGVsc2Vcblx0XHRcdG9wdGlvbnMgPSBpZiBJUy5vYmplY3QoYXJnc1sxXSkgdGhlbiBhcmdzWzFdIGVsc2Uge31cblx0XHRcblx0XHRlbGVtZW50ID0gbmV3IFF1aWNrRWxlbWVudCh0eXBlLCBvcHRpb25zKVxuXHRcdGlmIGFyZ3MubGVuZ3RoID4gMlxuXHRcdFx0Y2hpbGRyZW4gPSBuZXcgQXJyYXkoYXJnc0xlbmd0aCA9IGFyZ3MubGVuZ3RoKTsgaSA9IDE7XG5cdFx0XHRjaGlsZHJlbltpKzFdID0gYXJnc1tpXSB3aGlsZSArK2kgPCBhcmdzTGVuZ3RoXG5cblx0XHRcdGZvciBjaGlsZCBpbiBjaGlsZHJlblxuXHRcdFx0XHRjaGlsZCA9IFF1aWNrRG9tLnRleHQoY2hpbGQpIGlmIElTLnN0cmluZyhjaGlsZClcblx0XHRcdFx0Y2hpbGQgPSBRdWlja0RvbShjaGlsZC4uLikgaWYgSVMuYXJyYXkoY2hpbGQpXG5cdFx0XHRcdGVsZW1lbnQuYXBwZW5kKGNoaWxkKSBpZiBJUy5xdWlja0RvbUVsKGNoaWxkKVxuXG5cdFx0cmV0dXJuIGVsZW1lbnRcblxuXHR3aGVuIGFyZ3NbMF0gYW5kIChJUy5kb21Ob2RlKGFyZ3NbMF1bMF0pIG9yIElTLmRvbURvYyhhcmdzWzBdWzBdKSlcblx0XHRyZXR1cm4gUXVpY2tEb20oYXJnc1swXVswXSlcblxuXG5RdWlja0RvbS50ZW1wbGF0ZSA9ICh0cmVlKS0+XG5cdG5ldyBRdWlja1RlbXBsYXRlKHRyZWUsIHRydWUpXG5cblxuUXVpY2tEb20uaHRtbCA9IChpbm5lckhUTUwpLT5cblx0Y29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0Y29udGFpbmVyLmlubmVySFRNTCA9IGlubmVySFRNTFxuXHRjaGlsZHJlbiA9IEFycmF5OjpzbGljZS5jYWxsIGNvbnRhaW5lci5jaGlsZE5vZGVzXG5cblx0cmV0dXJuIFF1aWNrRG9tLmJhdGNoKGNoaWxkcmVuKVxuXG5RdWlja0RvbS5xdWVyeSA9ICh0YXJnZXQpLT5cblx0UXVpY2tEb20oZG9jdW1lbnQpLnF1ZXJ5KHRhcmdldClcblxuUXVpY2tEb20ucXVlcnlBbGwgPSAodGFyZ2V0KS0+XG5cdFF1aWNrRG9tKGRvY3VtZW50KS5xdWVyeUFsbCh0YXJnZXQpXG5cblF1aWNrRG9tLmlzVGVtcGxhdGUgPSAodGFyZ2V0KS0+XG5cdElTLnRlbXBsYXRlKHRhcmdldClcblxuUXVpY2tEb20uaXNRdWlja0VsID0gKHRhcmdldCktPlxuXHRJUy5xdWlja0RvbUVsKHRhcmdldClcblxuUXVpY2tEb20uaXNFbCA9ICh0YXJnZXQpLT5cblx0SVMuZG9tRWwodGFyZ2V0KVxuXG5cblxuXG5pbXBvcnQgJy4vcGFydHMvYmF0Y2gnXG5pbXBvcnQgJy4vcGFydHMvdGVtcGxhdGUnXG5pbXBvcnQgJy4vcGFydHMvc2hvcnRjdXRzJ1xuUXVpY2tEb20udmVyc2lvbiA9IGltcG9ydCAnLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbidcblF1aWNrRG9tLkNTUyA9IENTU1xubW9kdWxlLmV4cG9ydHMgPSBRdWlja0RvbVxuXG5cblxuIiwiYWxsb3dlZFRlbXBsYXRlT3B0aW9ucyA9IFsgIyBUbyBjb3B5IGZyb20gRE9NIEVsZW1lbnRzXG5cdCdpZCdcblx0J25hbWUnXG5cdCd0eXBlJ1xuXHQnaHJlZidcblx0J3NlbGVjdGVkJ1xuXHQnY2hlY2tlZCdcblx0J2NsYXNzTmFtZSdcbl1cblxuYWxsb3dlZE9wdGlvbnMgPSBbICMgVXNlZCBpbiBRdWlja0VsZW1lbnQ6OnRvSlNPTlxuXHQnaWQnXG5cdCdyZWYnXG5cdCd0eXBlJ1xuXHQnbmFtZSdcblx0J3RleHQnXG5cdCdzdHlsZSdcblx0J2NsYXNzJ1xuXHQnY2xhc3NOYW1lJ1xuXHQndXJsJ1xuXHQnaHJlZidcblx0J3NlbGVjdGVkJ1xuXHQnY2hlY2tlZCdcblx0J3Byb3BzJ1xuXHQnYXR0cnMnXG5cdCdwYXNzU3RhdGVUb0NoaWxkcmVuJ1xuXHQnc3RhdGVUcmlnZ2Vycydcblx0IyAncmVsYXRlZEluc3RhbmNlJ1xuXSIsImhlbHBlcnMgPSB7fVxuXG5oZWxwZXJzLmluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPlxuXHR0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuaGVscGVycy5yZW1vdmVJdGVtID0gKHRhcmdldCwgaXRlbSktPlxuXHRpdGVtSW5kZXggPSB0YXJnZXQuaW5kZXhPZihpdGVtKVxuXHR0YXJnZXQuc3BsaWNlKGl0ZW1JbmRleCwgMSkgIGlmIGl0ZW1JbmRleCBpc250IC0xXG5cdHJldHVybiB0YXJnZXRcblxuaGVscGVycy5ub3JtYWxpemVHaXZlbkVsID0gKHRhcmdldEVsKS0+IHN3aXRjaFxuXHR3aGVuIElTLnN0cmluZyh0YXJnZXRFbCkgdGhlbiBRdWlja0RvbS50ZXh0KHRhcmdldEVsKVxuXHR3aGVuIElTLmRvbU5vZGUodGFyZ2V0RWwpIHRoZW4gUXVpY2tEb20odGFyZ2V0RWwpXG5cdHdoZW4gSVMudGVtcGxhdGUodGFyZ2V0RWwpIHRoZW4gdGFyZ2V0RWwuc3Bhd24oKVxuXHRlbHNlIHRhcmdldEVsXG5cblxuaGVscGVycy5pc1N0YXRlU3R5bGUgPSAoc3RyaW5nKS0+XG5cdHN0cmluZ1swXSBpcyAnJCcgb3Igc3RyaW5nWzBdIGlzICdAJ1xuXG5cbmhlbHBlcnMucmVnaXN0ZXJTdHlsZSA9IChydWxlLCBsZXZlbCwgaW1wb3J0YW50KS0+XG5cdGxldmVsIHx8PSAwXG5cdGNhY2hlZCA9IHN0eWxlQ2FjaGUuZ2V0KHJ1bGUsIGxldmVsKVxuXHRyZXR1cm4gY2FjaGVkIGlmIGNhY2hlZFxuXHRvdXRwdXQgPSB7Y2xhc3NOYW1lOltDU1MucmVnaXN0ZXIocnVsZSwgbGV2ZWwsIGltcG9ydGFudCldLCBmbnM6W10sIHJ1bGV9XG5cdHByb3BzID0gT2JqZWN0LmtleXMocnVsZSlcblx0XG5cdGZvciBwcm9wIGluIHByb3BzIHdoZW4gdHlwZW9mIHJ1bGVbcHJvcF0gaXMgJ2Z1bmN0aW9uJ1xuXHRcdG91dHB1dC5mbnMucHVzaCBbcHJvcCwgcnVsZVtwcm9wXV1cblxuXHRyZXR1cm4gc3R5bGVDYWNoZS5zZXQocnVsZSwgb3V0cHV0LCBsZXZlbClcblxuXG5zdHlsZUNhY2hlID0gbmV3IGNsYXNzXG5cdGNvbnN0cnVjdG9yOiAoKS0+XG5cdFx0QGtleXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdFx0QHZhbHVlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuXHRnZXQ6IChrZXksIGxldmVsKS0+IGlmIEBrZXlzW2xldmVsXVxuXHRcdGluZGV4ID0gQGtleXNbbGV2ZWxdLmluZGV4T2Yoa2V5KVxuXHRcdHJldHVybiBAdmFsdWVzW2xldmVsXVtpbmRleF0gaWYgaW5kZXggaXNudCAtMVxuXG5cdHNldDogKGtleSwgdmFsdWUsIGxldmVsKS0+XG5cdFx0aWYgbm90IEBrZXlzW2xldmVsXVxuXHRcdFx0QGtleXNbbGV2ZWxdID0gW11cblx0XHRcdEB2YWx1ZXNbbGV2ZWxdID0gW11cblxuXHRcdEBrZXlzW2xldmVsXS5wdXNoIGtleVxuXHRcdEB2YWx1ZXNbbGV2ZWxdLnB1c2ggdmFsdWVcblx0XHRyZXR1cm4gdmFsdWVcblxuIiwiSVMgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9pcydcbklTID0gSVMuY3JlYXRlKCduYXRpdmVzJywnZG9tJylcbklTLmxvYWRcdFxuXHRxdWlja0RvbUVsOiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0LmNvbnN0cnVjdG9yLm5hbWUgaXMgUXVpY2tFbGVtZW50Lm5hbWVcblx0XG5cdHRlbXBsYXRlOiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0LmNvbnN0cnVjdG9yLm5hbWUgaXMgUXVpY2tUZW1wbGF0ZS5uYW1lXG5cdFxuXHQjIGJhdGNoOiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0LmNvbnN0cnVjdG9yLm5hbWUgaXMgJ1F1aWNrQmF0Y2gnXG5cbiIsInN2Z05hbWVzcGFjZSA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZydcblxuY2xhc3MgUXVpY2tFbGVtZW50XG5cdEBjb3VudCA9IDBcblx0Y29uc3RydWN0b3I6IChAdHlwZSwgQG9wdGlvbnMpLT5cblx0XHRRdWlja0VsZW1lbnQuY291bnQrK1xuXHRcdEBzdmcgPSB0cnVlIGlmIEB0eXBlWzBdIGlzICcqJ1xuXHRcdEBlbCA9IEBvcHRpb25zLmV4aXN0aW5nIG9yXG5cdFx0XHRpZiBAdHlwZSBpcyAndGV4dCcgdGhlbiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpZiB0eXBlb2YgQG9wdGlvbnMudGV4dCBpcyAnc3RyaW5nJyB0aGVuIEBvcHRpb25zLnRleHQgZWxzZSAnJylcblx0XHRcdGVsc2UgaWYgQHN2ZyB0aGVuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmdOYW1lc3BhY2UsIEB0eXBlLnNsaWNlKDEpKVxuXHRcdFx0ZWxzZSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KEB0eXBlKVxuXG5cdFx0aWYgQHR5cGUgaXMgJ3RleHQnXG5cdFx0XHRAYXBwZW5kID0gQHByZXBlbmQgPSBAYXR0ciA9ICgpLT5cblx0XHRcdCMgQF90ZXh0cyA9IHt9ICMgZGVmaW5lZCBjb25kaXRpb25hbGx5XG5cblx0XHRAX3BhcmVudCA9IG51bGxcblx0XHRAX3N0eWxlcyA9IHt9XG5cdFx0QF9zdGF0ZSA9IFtdXG5cdFx0QF9jaGlsZHJlbiA9IFtdXG5cdFx0IyBAX3Byb3ZpZGVkU3RhdGVzID0gW11cdFx0XHRcdCMgZGVmaW5lZCBjb25kaXRpb25hbGx5XG5cdFx0IyBAX3Byb3ZpZGVkU3RhdGVzU2hhcmVkID0gW11cdFx0IyBkZWZpbmVkIGNvbmRpdGlvbmFsbHlcblx0XHQjIEBfZXZlbnRDYWxsYmFja3MgPSB7X19yZWZzOnt9fVx0IyBkZWZpbmVkIGNvbmRpdGlvbmFsbHlcblx0XHRcblx0XHRAX25vcm1hbGl6ZU9wdGlvbnMoKVxuXHRcdEBfYXBwbHlPcHRpb25zKClcblx0XHRAX2F0dGFjaFN0YXRlRXZlbnRzKClcblx0XHRAX3Byb3h5UGFyZW50KClcblx0XHRAX3JlZnJlc2hQYXJlbnQoKSBpZiBAb3B0aW9ucy5leGlzdGluZ1xuXHRcdEBlbC5fcXVpY2tFbGVtZW50ID0gQFxuXG5cblx0dG9KU09OOiAoKS0+XG5cdFx0b3V0cHV0ID0gW0B0eXBlLCBleHRlbmQuY2xvbmUua2V5cyhhbGxvd2VkT3B0aW9ucykoQG9wdGlvbnMpXVxuXHRcdGNoaWxkcmVuID0gQGNoaWxkcmVuXG5cdFx0b3V0cHV0LnB1c2goY2hpbGQudG9KU09OKCkpIGZvciBjaGlsZCBpbiBjaGlsZHJlblxuXHRcdHJldHVybiBvdXRwdXRcblxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuUXVpY2tFbGVtZW50Lm5hbWUgPz0gJ1F1aWNrRWxlbWVudCdcblxuaW1wb3J0ICcuL2FsaWFzZXMnXG5pbXBvcnQgJy4vdHJhdmVyc2luZydcbmltcG9ydCAnLi9pbml0J1xuaW1wb3J0ICcuL2V2ZW50cydcbmltcG9ydCAnLi9zdGF0ZSdcbmltcG9ydCAnLi9zdHlsZSdcbmltcG9ydCAnLi9hdHRyaWJ1dGVzLWFuZC1wcm9wZXJ0aWVzJ1xuaW1wb3J0ICcuL21hbmlwdWxhdGlvbidcbmltcG9ydCAnLi9hcHBsaWNhdGlvbidcbiIsIk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIFF1aWNrRWxlbWVudDo6LFxuXHQncmF3JzogZ2V0OiAoKS0+IEBlbFxuXHQnMCc6IGdldDogKCktPiBAZWxcblx0J2Nzcyc6IGdldDogKCktPiBAc3R5bGVcblx0J3JlcGxhY2VXaXRoJzogZ2V0OiAoKS0+IEByZXBsYWNlXG5cdCdyZW1vdmVMaXN0ZW5lcic6IGdldDogKCktPiBAb2ZmXG5cbiIsIlF1aWNrRWxlbWVudDo6cGFyZW50c1VudGlsID0gKGZpbHRlciktPlxuXHRfZ2V0UGFyZW50cyhALCBmaWx0ZXIpXG5cblF1aWNrRWxlbWVudDo6cGFyZW50TWF0Y2hpbmcgPSAoZmlsdGVyKS0+XG5cdGlmIElTLmZ1bmN0aW9uKGZpbHRlcikgb3IgaXNSZWY9SVMuc3RyaW5nKGZpbHRlcilcblx0XHRuZXh0UGFyZW50ID0gQHBhcmVudFxuXHRcdHdoaWxlIG5leHRQYXJlbnRcblx0XHRcdGlmIGlzUmVmXG5cdFx0XHRcdHJldHVybiBuZXh0UGFyZW50IGlmIG5leHRQYXJlbnQucmVmIGlzIGZpbHRlclxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gbmV4dFBhcmVudCBpZiBmaWx0ZXIobmV4dFBhcmVudClcblxuXHRcdFx0bmV4dFBhcmVudCA9IG5leHRQYXJlbnQucGFyZW50XG5cdFx0XG5cdHJldHVyblxuXG5RdWlja0VsZW1lbnQ6OnF1ZXJ5ID0gKHNlbGVjdG9yKS0+XG5cdFF1aWNrRG9tIEByYXcucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcblxuUXVpY2tFbGVtZW50OjpxdWVyeUFsbCA9IChzZWxlY3RvciktPlxuXHRyZXN1bHQgPSBAcmF3LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG5cdG91dHB1dCA9IFtdOyBvdXRwdXQucHVzaChpdGVtKSBmb3IgaXRlbSBpbiByZXN1bHRcblx0cmV0dXJuIG5ldyBRdWlja0JhdGNoKG91dHB1dClcblxuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIFF1aWNrRWxlbWVudDo6LFxuXHQnY2hpbGRyZW4nOiBnZXQ6ICgpLT5cblx0XHRpZiBAZWwuY2hpbGROb2Rlcy5sZW5ndGggaXNudCBAX2NoaWxkcmVuLmxlbmd0aCAjIFJlLWNvbGxlY3QgY2hpbGRyZW5cdFxuXHRcdFx0QF9jaGlsZHJlbi5sZW5ndGggPSAwICMgRW1wdHkgb3V0IGNoaWxkcmVuIGFycmF5XG5cdFx0XHRAX2NoaWxkcmVuLnB1c2goUXVpY2tEb20oY2hpbGQpKSBmb3IgY2hpbGQgaW4gQGVsLmNoaWxkTm9kZXMgd2hlbiBjaGlsZC5ub2RlVHlwZSA8IDRcblxuXHRcdHJldHVybiBAX2NoaWxkcmVuXG5cblx0J2VsZW1lbnRDaGlsZHJlbic6IGdldDogKCktPlxuXHRcdF9maWx0ZXJFbGVtZW50cyhAY2hpbGRyZW4pXG5cblx0J3BhcmVudCc6IGdldDogKCktPlxuXHRcdGlmIChub3QgQF9wYXJlbnQgb3IgQF9wYXJlbnQuZWwgaXNudCBAZWwucGFyZW50Tm9kZSkgYW5kIG5vdCBJUy5kb21Eb2MoQGVsLnBhcmVudE5vZGUpXG5cdFx0XHRAX3BhcmVudCA9IFF1aWNrRG9tKEBlbC5wYXJlbnROb2RlKVxuXG5cdFx0cmV0dXJuIEBfcGFyZW50XG5cblxuXHQncGFyZW50cyc6IGdldDogKCktPlxuXHRcdF9nZXRQYXJlbnRzKEApXG5cblx0J25leHQnOiBnZXQ6ICgpLT5cblx0XHRRdWlja0RvbShAZWwubmV4dFNpYmxpbmcpXG5cdFxuXHQnbmV4dEVsJzogZ2V0OiAoKS0+XG5cdFx0UXVpY2tEb20oQGVsLm5leHRFbGVtZW50U2libGluZylcblx0XG5cdCduZXh0RWxBbGwnOiBnZXQ6ICgpLT5cblx0XHRfZmlsdGVyRWxlbWVudHMoQG5leHRBbGwpXG5cblx0J25leHRBbGwnOiBnZXQ6ICgpLT5cblx0XHRzaWJsaW5ncyA9IFtdXG5cdFx0bmV4dFNpYmxpbmcgPSBRdWlja0RvbShAZWwubmV4dFNpYmxpbmcpXG5cdFx0d2hpbGUgbmV4dFNpYmxpbmdcblx0XHRcdHNpYmxpbmdzLnB1c2gobmV4dFNpYmxpbmcpXG5cdFx0XHRuZXh0U2libGluZyA9IG5leHRTaWJsaW5nLm5leHRcblxuXHRcdHJldHVybiBzaWJsaW5nc1xuXG5cdCdwcmV2JzogZ2V0OiAoKS0+XG5cdFx0UXVpY2tEb20oQGVsLnByZXZpb3VzU2libGluZylcblx0XG5cdCdwcmV2RWwnOiBnZXQ6ICgpLT5cblx0XHRRdWlja0RvbShAZWwucHJldmlvdXNFbGVtZW50U2libGluZylcblx0XG5cdCdwcmV2RWxBbGwnOiBnZXQ6ICgpLT5cblx0XHRfZmlsdGVyRWxlbWVudHMoQHByZXZBbGwpXG5cblx0J3ByZXZBbGwnOiBnZXQ6ICgpLT5cblx0XHRzaWJsaW5ncyA9IFtdXG5cdFx0cHJldlNpYmxpbmcgPSBRdWlja0RvbShAZWwucHJldmlvdXNTaWJsaW5nKVxuXHRcdHdoaWxlIHByZXZTaWJsaW5nXG5cdFx0XHRzaWJsaW5ncy5wdXNoKHByZXZTaWJsaW5nKVxuXHRcdFx0cHJldlNpYmxpbmcgPSBwcmV2U2libGluZy5wcmV2XG5cblx0XHRyZXR1cm4gc2libGluZ3NcblxuXHQnc2libGluZ3MnOiBnZXQ6ICgpLT5cblx0XHRAcHJldkFsbC5yZXZlcnNlKCkuY29uY2F0KEBuZXh0QWxsKVxuXG5cdCdlbGVtZW50U2libGluZ3MnOiBnZXQ6ICgpLT5cblx0XHRfZmlsdGVyRWxlbWVudHMoQHNpYmxpbmdzKVxuXHRcblx0J2NoaWxkJzogZ2V0OiAoKS0+XG5cdFx0QF9jaGlsZFJlZnMgb3IgX2dldENoaWxkUmVmcyhAKVxuXG5cdCdjaGlsZGYnOiBnZXQ6ICgpLT5cblx0XHRfZ2V0Q2hpbGRSZWZzKEAsIHRydWUpXG5cblx0J2ZpcnN0Q2hpbGQnOiBnZXQ6ICgpLT5cblx0XHRAY2hpbGRyZW5bMF1cblxuXHQnbGFzdENoaWxkJzogZ2V0OiAoKS0+XG5cdFx0Y2hpbGRyZW4gPSBAY2hpbGRyZW5cblx0XHRjaGlsZHJlbltjaGlsZHJlbi5sZW5ndGgtMV1cblxuXHQnaW5kZXgnOiBnZXQ6ICgpLT5cblx0XHRpZiBub3QgcGFyZW50PUBwYXJlbnRcblx0XHRcdHJldHVybiBudWxsXG5cdFx0ZWxzZVxuXHRcdFx0cGFyZW50LmNoaWxkcmVuLmluZGV4T2YoQClcblxuXHQnaW5kZXhUeXBlJzogZ2V0OiAoKS0+XG5cdFx0X2dldEluZGV4QnlQcm9wKEAsICd0eXBlJylcblxuXHQnaW5kZXhSZWYnOiBnZXQ6ICgpLT5cblx0XHRfZ2V0SW5kZXhCeVByb3AoQCwgJ3JlZicpXG5cblxuXG5fZ2V0UGFyZW50cyA9ICh0YXJnZXRFbCwgZmlsdGVyKS0+XG5cdGZpbHRlciA9IHVuZGVmaW5lZCBpZiBub3QgSVMuZnVuY3Rpb24oZmlsdGVyKSBhbmQgbm90IGlzUmVmPUlTLnN0cmluZyhmaWx0ZXIpXG5cdHBhcmVudHMgPSBbXVxuXHRuZXh0UGFyZW50ID0gdGFyZ2V0RWwucGFyZW50XG5cdHdoaWxlIG5leHRQYXJlbnRcblx0XHRwYXJlbnRzLnB1c2gobmV4dFBhcmVudClcblx0XHRuZXh0UGFyZW50ID0gbmV4dFBhcmVudC5wYXJlbnRcblx0XHRpZiBpc1JlZlxuXHRcdFx0bmV4dFBhcmVudCA9IG51bGwgaWYgbmV4dFBhcmVudCBhbmQgbmV4dFBhcmVudC5yZWYgaXMgZmlsdGVyXG5cdFx0ZWxzZSBpZiBmaWx0ZXJcblx0XHRcdG5leHRQYXJlbnQgPSBudWxsIGlmIGZpbHRlcihuZXh0UGFyZW50KVxuXG5cdHJldHVybiBwYXJlbnRzXG5cblxuX2dldENoaWxkUmVmcyA9ICh0YXJnZXQsIGZyZXNoQ29weSktPlxuXHR0YXJnZXQuX2NoaWxkUmVmcyA9IHt9IGlmIGZyZXNoQ29weSBvciBub3QgdGFyZ2V0Ll9jaGlsZFJlZnNcblx0cmVmcyA9IHRhcmdldC5fY2hpbGRSZWZzXG5cdHJlZnNbdGFyZ2V0LnJlZl0gPSB0YXJnZXQgaWYgdGFyZ2V0LnJlZlxuXHRjaGlsZHJlbiA9IHRhcmdldC5jaGlsZHJlblxuXG5cdGlmIGNoaWxkcmVuLmxlbmd0aFxuXHRcdGZvciBjaGlsZCBpbiBjaGlsZHJlblxuXHRcdFx0Y2hpbGRSZWZzID0gX2dldENoaWxkUmVmcyhjaGlsZCwgZnJlc2hDb3B5KVxuXHRcdFx0cmVmc1tyZWZdIHx8PSBlbCBmb3IgcmVmLGVsIG9mIGNoaWxkUmVmc1xuXG5cdHJldHVybiByZWZzXG5cblxuX2dldEluZGV4QnlQcm9wID0gKG1haW4sIHByb3ApLT5cblx0aWYgbm90IHBhcmVudD1tYWluLnBhcmVudFxuXHRcdHJldHVybiBudWxsXG5cdGVsc2Vcblx0XHRwYXJlbnQuY2hpbGRyZW5cblx0XHRcdC5maWx0ZXIgKGNoaWxkKS0+IGNoaWxkW3Byb3BdIGlzIG1haW5bcHJvcF1cblx0XHRcdC5pbmRleE9mKG1haW4pXG5cblxuX2ZpbHRlckVsZW1lbnRzID0gKGFycmF5KS0+XG5cdGlmIG5vdCBhcnJheS5sZW5ndGhcblx0XHRyZXR1cm4gYXJyYXlcblx0ZWxzZVxuXHRcdG91dHB1dCA9IFtdXG5cdFx0b3V0cHV0LnB1c2goaXRlbSkgZm9yIGl0ZW0gaW4gYXJyYXkgd2hlbiBpdGVtLnR5cGUgaXNudCAndGV4dCdcblx0XHRyZXR1cm4gb3V0cHV0XG5cblxuXG4iLCJiYXNlU3RhdGVUcmlnZ2VycyA9XG5cdCdob3Zlcic6IHtvbjonbW91c2VlbnRlcicsIG9mZjonbW91c2VsZWF2ZScsIGJ1YmJsZXM6dHJ1ZX1cblx0J2ZvY3VzJzoge29uOidmb2N1cycsIG9mZjonYmx1cicsIGJ1YmJsZXM6dHJ1ZX1cblxuXG5RdWlja0VsZW1lbnQ6Ol9ub3JtYWxpemVPcHRpb25zID0gKCktPlxuXHRpZiBAb3B0aW9ucy5yZWxhdGVkSW5zdGFuY2Vcblx0XHRAb3B0aW9ucy5yZWxhdGVkIHx8PSBAb3B0aW9ucy5yZWxhdGVkSW5zdGFuY2Vcblx0XHRAb3B0aW9ucy5yZWxhdGVkSW5zdGFuY2UgPSBudWxsXG5cdFxuXHRAcmVsYXRlZCA9IEBvcHRpb25zLnJlbGF0ZWQgPz0gQFxuXHRAb3B0aW9ucy5jbGFzc05hbWUgPSBAb3B0aW9ucy5jbGFzcyBpZiBAb3B0aW9ucy5jbGFzc1xuXHRAb3B0aW9ucy5ocmVmID0gQG9wdGlvbnMudXJsIGlmIEBvcHRpb25zLnVybFxuXHRAb3B0aW9ucy51bnBhc3NhYmxlU3RhdGVzID89IFtdXG5cdEBvcHRpb25zLnBhc3NTdGF0ZVRvQ2hpbGRyZW4gPz0gdHJ1ZVxuXHRAb3B0aW9ucy5wYXNzRGF0YVRvQ2hpbGRyZW4gPz0gdHJ1ZVxuXHRAb3B0aW9ucy5zdGF0ZVRyaWdnZXJzID1cblx0XHRpZiBAb3B0aW9ucy5zdGF0ZVRyaWdnZXJzXG5cdFx0XHRleHRlbmQuY2xvbmUuZGVlcChiYXNlU3RhdGVUcmlnZ2VycywgQG9wdGlvbnMuc3RhdGVUcmlnZ2Vycylcblx0XHRlbHNlXG5cdFx0XHRiYXNlU3RhdGVUcmlnZ2Vyc1xuXHRcblx0aWYgQHR5cGUgaXMgJ3RleHQnXG5cdFx0ZXh0ZW5kIEAsIEBfcGFyc2VUZXh0cyhAb3B0aW9ucy50ZXh0LCBAX3RleHRzKVxuXHRlbHNlXG5cdFx0ZXh0ZW5kIEAsIEBfcGFyc2VTdHlsZXMoQG9wdGlvbnMuc3R5bGUsIEBfc3R5bGVzKVxuXHRcblx0cmV0dXJuXG5cblxuUXVpY2tFbGVtZW50OjpfcGFyc2VTdHlsZXMgPSAoc3R5bGVzLCBzdG9yZSktPlxuXHRyZXR1cm4gaWYgbm90IElTLm9iamVjdFBsYWluKHN0eWxlcylcblx0a2V5cyA9IE9iamVjdC5rZXlzKHN0eWxlcylcblx0c3RhdGVzID0ga2V5cy5maWx0ZXIgKGtleSktPiBoZWxwZXJzLmlzU3RhdGVTdHlsZShrZXkpXG5cdHNwZWNpYWxTdGF0ZXMgPSBoZWxwZXJzLnJlbW92ZUl0ZW0oc3RhdGVzLnNsaWNlKCksICckYmFzZScpXG5cdF9tZWRpYVN0YXRlcyA9IHN0YXRlcy5maWx0ZXIoKGtleSktPiBrZXlbMF0gaXMgJ0AnKS5tYXAgKHN0YXRlKS0+IHN0YXRlLnNsaWNlKDEpXG5cdF9wcm92aWRlZFN0YXRlcyA9IHN0YXRlcy5tYXAgKHN0YXRlKS0+IHN0YXRlLnNsaWNlKDEpICMgUmVtb3ZlICckJyBwcmVmaXhcblx0X3N0eWxlcyA9IHN0b3JlIG9yIHt9XG5cdF9zdGF0ZVNoYXJlZCA9IF9wcm92aWRlZFN0YXRlc1NoYXJlZCA9IHVuZGVmaW5lZFxuXG5cdGJhc2UgPSBpZiBub3QgaGVscGVycy5pbmNsdWRlcyhzdGF0ZXMsICckYmFzZScpIHRoZW4gc3R5bGVzIGVsc2Ugc3R5bGVzLiRiYXNlXG5cdF9zdHlsZXMuYmFzZSA9IGhlbHBlcnMucmVnaXN0ZXJTdHlsZShiYXNlLCAwLCBmb3JjZVN0eWxlPUBvcHRpb25zLmZvcmNlU3R5bGUpXG5cblxuXHRpZiBzcGVjaWFsU3RhdGVzLmxlbmd0aFxuXHRcdGZsYXR0ZW5OZXN0ZWRTdGF0ZXMgPSAoc3R5bGVPYmplY3QsIGNoYWluLCBsZXZlbCktPlxuXHRcdFx0c3R5bGVLZXlzID0gT2JqZWN0LmtleXMoc3R5bGVPYmplY3QpXG5cdFx0XHRvdXRwdXQgPSB7fVxuXHRcdFx0aGFzTm9uU3RhdGVQcm9wcyA9IGZhbHNlXG5cdFx0XHRcblx0XHRcdGZvciBzdGF0ZSBpbiBzdHlsZUtleXNcblx0XHRcdFx0aWYgbm90IGhlbHBlcnMuaXNTdGF0ZVN0eWxlKHN0YXRlKVxuXHRcdFx0XHRcdGhhc05vblN0YXRlUHJvcHMgPSB0cnVlXG5cdFx0XHRcdFx0b3V0cHV0W3N0YXRlXSA9IHN0eWxlT2JqZWN0W3N0YXRlXVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y2hhaW4ucHVzaChzdGF0ZV8gPSBzdGF0ZS5zbGljZSgxKSlcblx0XHRcdFx0XHRzdGF0ZUNoYWluID0gbmV3IChpbXBvcnQgJy4vc3RhdGVDaGFpbicpKGNoYWluKVxuXHRcdFx0XHRcdF9zdGF0ZVNoYXJlZCA/PSBbXVxuXHRcdFx0XHRcdF9wcm92aWRlZFN0YXRlc1NoYXJlZCA/PSBbXVxuXHRcdFx0XHRcdF9wcm92aWRlZFN0YXRlc1NoYXJlZC5wdXNoKHN0YXRlQ2hhaW4pXG5cdFx0XHRcdFx0X21lZGlhU3RhdGVzLnB1c2goc3RhdGVfKSBpZiBzdGF0ZVswXSBpcyAnQCdcblx0XHRcdFx0XHRfc3R5bGVzW3N0YXRlQ2hhaW4uc3RyaW5nXSA9IGhlbHBlcnMucmVnaXN0ZXJTdHlsZSBmbGF0dGVuTmVzdGVkU3RhdGVzKHN0eWxlT2JqZWN0W3N0YXRlXSwgY2hhaW4sIGxldmVsKzEpLCBsZXZlbCsxLCBmb3JjZVN0eWxlXG5cdFx0XHRcblx0XHRcdHJldHVybiBpZiBoYXNOb25TdGF0ZVByb3BzIHRoZW4gb3V0cHV0XG5cblx0XHRmb3Igc3RhdGUgaW4gc3BlY2lhbFN0YXRlc1xuXHRcdFx0c3RhdGVfID0gc3RhdGUuc2xpY2UoMSlcblx0XHRcdFxuXHRcdFx0c3RhdGVTdHlsZXMgPSBmbGF0dGVuTmVzdGVkU3RhdGVzKHN0eWxlc1tzdGF0ZV0sIFtzdGF0ZV9dLCAxKVxuXHRcdFx0X3N0eWxlc1tzdGF0ZV9dID0gaGVscGVycy5yZWdpc3RlclN0eWxlKHN0YXRlU3R5bGVzLCAxKSBpZiBzdGF0ZVN0eWxlc1xuXG5cblx0cmV0dXJuIHtfc3R5bGVzLCBfbWVkaWFTdGF0ZXMsIF9zdGF0ZVNoYXJlZCwgX3Byb3ZpZGVkU3RhdGVzLCBfcHJvdmlkZWRTdGF0ZXNTaGFyZWR9XG5cblxuXG5RdWlja0VsZW1lbnQ6Ol9wYXJzZVRleHRzID0gKHRleHRzLCBzdG9yZSktPlxuXHRyZXR1cm4gaWYgbm90IElTLm9iamVjdFBsYWluKHRleHRzKVxuXHRzdGF0ZXMgPSBPYmplY3Qua2V5cyh0ZXh0cykubWFwIChzdGF0ZSktPiBzdGF0ZS5zbGljZSgxKVxuXHRfcHJvdmlkZWRTdGF0ZXMgPSBzdGF0ZXMuZmlsdGVyIChzdGF0ZSktPiBzdGF0ZSBpc250ICdiYXNlJ1xuXHRfdGV4dHMgPSBzdG9yZSBvciB7fVxuXHRfdGV4dHMgPSBiYXNlOicnXG5cdF90ZXh0c1tzdGF0ZV0gPSB0ZXh0c1snJCcrc3RhdGVdIGZvciBzdGF0ZSBpbiBzdGF0ZXNcblx0XG5cdHJldHVybiB7X3RleHRzLCBfcHJvdmlkZWRTdGF0ZXN9XG5cblxuUXVpY2tFbGVtZW50OjpfYXBwbHlPcHRpb25zID0gKCktPlxuXHRpZiByZWY9KEBvcHRpb25zLmlkIG9yIEBvcHRpb25zLnJlZikgdGhlbiBAYXR0cignZGF0YS1yZWYnLCBAcmVmPXJlZilcblx0aWYgQG9wdGlvbnMuaWQgdGhlbiBAZWwuaWQgPSBAb3B0aW9ucy5pZFxuXHRpZiBAb3B0aW9ucy5jbGFzc05hbWUgdGhlbiBAZWwuY2xhc3NOYW1lID0gQG9wdGlvbnMuY2xhc3NOYW1lXG5cdGlmIEBvcHRpb25zLnNyYyB0aGVuIEBlbC5zcmMgPSBAb3B0aW9ucy5zcmNcblx0aWYgQG9wdGlvbnMuaHJlZiB0aGVuIEBlbC5ocmVmID0gQG9wdGlvbnMuaHJlZlxuXHRpZiBAb3B0aW9ucy50eXBlIHRoZW4gQGVsLnR5cGUgPSBAb3B0aW9ucy50eXBlXG5cdGlmIEBvcHRpb25zLm5hbWUgdGhlbiBAZWwubmFtZSA9IEBvcHRpb25zLm5hbWVcblx0aWYgQG9wdGlvbnMudmFsdWUgdGhlbiBAZWwudmFsdWUgPSBAb3B0aW9ucy52YWx1ZVxuXHRpZiBAb3B0aW9ucy5zZWxlY3RlZCB0aGVuIEBlbC5zZWxlY3RlZCA9IEBvcHRpb25zLnNlbGVjdGVkXG5cdGlmIEBvcHRpb25zLmNoZWNrZWQgdGhlbiBAZWwuY2hlY2tlZCA9IEBvcHRpb25zLmNoZWNrZWRcblx0aWYgQG9wdGlvbnMucHJvcHMgdGhlbiBAcHJvcChAb3B0aW9ucy5wcm9wcylcblx0aWYgQG9wdGlvbnMuYXR0cnMgdGhlbiBAYXR0cihAb3B0aW9ucy5hdHRycylcblx0QF9hcHBseVJlZ2lzdGVyZWRTdHlsZShAX3N0eWxlcy5iYXNlLCBudWxsLCBudWxsLCBAb3B0aW9ucy5zdHlsZUFmdGVySW5zZXJ0KVxuXHRAdGV4dCA9IEBfdGV4dHMuYmFzZSBpZiBAX3RleHRzXG5cblx0QG9uKCdpbnNlcnRlZCcsIENBQ0hFRF9GTl9JTlNFUlRFRCwgZmFsc2UsIHRydWUpXG5cblx0aWYgQG9wdGlvbnMuaW52b2tlQ29tcHV0ZXJzT25jZVxuXHRcdEBfaW52b2tlZENvbXB1dGVycyA9IHt9XG5cdFxuXHRpZiBAb3B0aW9ucy5yZWNhbGNPblJlc2l6ZVxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCAoKT0+IEByZWNhbGNTdHlsZSgpXG5cblx0aWYgQG9wdGlvbnMuZXZlbnRzXG5cdFx0QG9uKGV2ZW50LCBoYW5kbGVyKSBmb3IgZXZlbnQsaGFuZGxlciBvZiBAb3B0aW9ucy5ldmVudHNcblxuXHRpZiBAb3B0aW9ucy5tZXRob2RzXG5cdFx0Zm9yIG1ldGhvZCx2YWx1ZSBvZiBAb3B0aW9ucy5tZXRob2RzIHdoZW4gbm90IEBbbWV0aG9kXVxuXHRcdFx0aWYgSVMuZnVuY3Rpb24odmFsdWUpXG5cdFx0XHRcdEBbbWV0aG9kXSA9IHZhbHVlXG5cdFx0XHRlbHNlIGlmIElTLm9iamVjdCh2YWx1ZSlcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5IEAsIG1ldGhvZCwge2NvbmZpZ3VyYWJsZTp0cnVlLCBnZXQ6dmFsdWUuZ2V0LCBzZXQ6dmFsdWUuc2V0fVxuXG5cdGlmIEB0eXBlIGlzbnQgJ3RleHQnIGFuZCBJUy5vYmplY3QoQG9wdGlvbnMudGV4dClcblx0XHRAYXBwZW5kIFF1aWNrRG9tKCd0ZXh0JywgdGV4dDpAb3B0aW9ucy50ZXh0KVxuXHRyZXR1cm5cblxuXG5RdWlja0VsZW1lbnQ6Ol9wb3N0Q3JlYXRpb24gPSAoZGF0YSktPlxuXHRpZiBAb3B0aW9ucy5jb21wdXRlcnNcblx0XHRkYXRhID0gZXh0ZW5kLmNsb25lKEBvcHRpb25zLmRhdGEsIGRhdGEpIGlmIGRhdGEgYW5kIEBvcHRpb25zLmRhdGFcblx0XHRkYXRhIHx8PSBAb3B0aW9ucy5kYXRhXG5cdFx0QGFwcGx5RGF0YShkYXRhLCBmYWxzZSlcblx0XHRcblx0XHRpZiBAb3B0aW9ucy5jb21wdXRlcnMuX2luaXRcblx0XHRcdEBfcnVuQ29tcHV0ZXIoJ19pbml0JywgZGF0YSlcblxuXHRpZiBAb3B0aW9ucy5zdGF0ZVxuXHRcdEBzdGF0ZShAb3B0aW9ucy5zdGF0ZSlcblx0XG5cdHJldHVyblxuXG5cblF1aWNrRWxlbWVudDo6X2F0dGFjaFN0YXRlRXZlbnRzID0gKGZvcmNlKS0+XG5cdHN0YXRlcyA9IE9iamVjdC5rZXlzKEBvcHRpb25zLnN0YXRlVHJpZ2dlcnMpXG5cdHN0YXRlcy5mb3JFYWNoIChzdGF0ZSk9PlxuXHRcdHRyaWdnZXIgPSBAb3B0aW9ucy5zdGF0ZVRyaWdnZXJzW3N0YXRlXVx0XG5cdFx0cmV0dXJuIGlmIG5vdCBoZWxwZXJzLmluY2x1ZGVzKEBfcHJvdmlkZWRTdGF0ZXMsIHN0YXRlKSBhbmQgbm90IGZvcmNlIGFuZCBub3QgdHJpZ2dlci5mb3JjZVxuXHRcdGVuYWJsZXIgPSBpZiBJUy5zdHJpbmcodHJpZ2dlcikgdGhlbiB0cmlnZ2VyIGVsc2UgdHJpZ2dlci5vblxuXHRcdGRpc2FibGVyID0gdHJpZ2dlci5vZmYgaWYgSVMub2JqZWN0KHRyaWdnZXIpXG5cblx0XHRAX2xpc3RlblRvIGVuYWJsZXIsICgpPT4gQHN0YXRlKHN0YXRlLCBvbiwgdHJpZ2dlci5idWJibGVzKVxuXHRcdGlmIGRpc2FibGVyIHRoZW4gQF9saXN0ZW5UbyBkaXNhYmxlciwgKCk9PiBAc3RhdGUoc3RhdGUsIG9mZiwgdHJpZ2dlci5idWJibGVzKVxuXHRcblx0cmV0dXJuXG5cblxuXG5RdWlja0VsZW1lbnQ6Ol9wcm94eVBhcmVudCA9ICgpLT5cblx0cGFyZW50ID0gdW5kZWZpbmVkXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBALCAnX3BhcmVudCcsXG5cdFx0Z2V0OiAoKS0+IHBhcmVudFxuXHRcdHNldDogKG5ld1BhcmVudCktPiBpZiBwYXJlbnQ9bmV3UGFyZW50XG5cdFx0XHRsYXN0UGFyZW50ID0gQHBhcmVudHMuc2xpY2UoLTEpWzBdXG5cdFx0XHRpZiBsYXN0UGFyZW50LnJhdyBpcyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcblx0XHRcdFx0QF91bnByb3h5UGFyZW50KG5ld1BhcmVudClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cGFyZW50Lm9uICdpbnNlcnRlZCcsICgpPT5cblx0XHRcdFx0XHRAX3VucHJveHlQYXJlbnQobmV3UGFyZW50KSBpZiBwYXJlbnQgaXMgbmV3UGFyZW50XG5cdFx0XHRyZXR1cm5cblxuXG5RdWlja0VsZW1lbnQ6Ol91bnByb3h5UGFyZW50ID0gKG5ld1BhcmVudCktPlxuXHRkZWxldGUgQF9wYXJlbnRcblx0QF9wYXJlbnQgPSBuZXdQYXJlbnRcblx0QGVtaXRQcml2YXRlKCdpbnNlcnRlZCcsIG5ld1BhcmVudClcblx0cmV0dXJuXG5cblxuXG5DQUNIRURfRk5fSU5TRVJURUQgPSAoKS0+XG5cdEBfaW5zZXJ0ZWQgPSBAXG5cdEByZWNhbGNTdHlsZSgpIGlmIEBvcHRpb25zLnN0eWxlQWZ0ZXJJbnNlcnRcblxuXHRpZiAobWVkaWFTdGF0ZXM9QF9tZWRpYVN0YXRlcykgYW5kIEBfbWVkaWFTdGF0ZXMubGVuZ3RoXG5cdFx0QF9tZWRpYVN0YXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRcblx0XHRmb3IgcXVlcnlTdHJpbmcgaW4gbWVkaWFTdGF0ZXNcblx0XHRcdEBfbWVkaWFTdGF0ZXNbcXVlcnlTdHJpbmddID0gTWVkaWFRdWVyeS5yZWdpc3RlcihALCBxdWVyeVN0cmluZylcblxuXG5cblxuXG5cblxuXG4iLCJyZWdleFdoaXRlc3BhY2UgPSAvXFxzKy9cblxuUXVpY2tFbGVtZW50OjpvbiA9IChldmVudE5hbWVzLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSwgaXNQcml2YXRlKS0+XG5cdEBfZXZlbnRDYWxsYmFja3MgPz0ge19fcmVmczp7fX1cblx0XG5cdGlmIElTLnN0cmluZyhldmVudE5hbWVzKSBhbmQgSVMuZnVuY3Rpb24oY2FsbGJhY2spXG5cdFx0c3BsaXQgPSBldmVudE5hbWVzLnNwbGl0KCcuJylcblx0XHRjYWxsYmFja1JlZiA9IHNwbGl0WzFdXG5cdFx0ZXZlbnROYW1lcyA9IHNwbGl0WzBdXG5cdFx0XG5cdFx0aWYgZXZlbnROYW1lcyBpcyAnaW5zZXJ0ZWQnIGFuZCBAX2luc2VydGVkXG5cdFx0XHRjYWxsYmFjay5jYWxsKEAsIEBfcGFyZW50KVxuXHRcdFx0cmV0dXJuIEBcblx0XHRcblx0XHRldmVudE5hbWVzLnNwbGl0KHJlZ2V4V2hpdGVzcGFjZSkuZm9yRWFjaCAoZXZlbnROYW1lKT0+XG5cdFx0XHRpZiBub3QgQF9ldmVudENhbGxiYWNrc1tldmVudE5hbWVdXG5cdFx0XHRcdEBfZXZlbnRDYWxsYmFja3NbZXZlbnROYW1lXSA9IFtdXHRcdFxuXHRcdFx0XHRcblx0XHRcdFx0dW5sZXNzIGlzUHJpdmF0ZSB0aGVuIEBfbGlzdGVuVG8gZXZlbnROYW1lLCAoZXZlbnQpPT5cblx0XHRcdFx0XHRAX2ludm9rZUhhbmRsZXJzKGV2ZW50TmFtZSwgZXZlbnQpXG5cdFx0XHRcdCwgdXNlQ2FwdHVyZVxuXG5cdFx0XHRAX2V2ZW50Q2FsbGJhY2tzLl9fcmVmc1tjYWxsYmFja1JlZl0gPSBjYWxsYmFjayBpZiBjYWxsYmFja1JlZlxuXHRcdFx0QF9ldmVudENhbGxiYWNrc1tldmVudE5hbWVdLnB1c2goY2FsbGJhY2spXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6Om9uY2UgPSAoZXZlbnROYW1lcywgY2FsbGJhY2spLT5cblx0aWYgSVMuc3RyaW5nKGV2ZW50TmFtZXMpIGFuZCBJUy5mdW5jdGlvbihjYWxsYmFjaylcblx0XHRAb24gZXZlbnROYW1lcywgb25jZUNhbGxiYWNrPShldmVudCk9PlxuXHRcdFx0QG9mZihldmVudE5hbWVzLCBvbmNlQ2FsbGJhY2spXG5cdFx0XHRjYWxsYmFjay5jYWxsKEAsIGV2ZW50KVxuXHRcblx0cmV0dXJuIEBcblxuXG5cblF1aWNrRWxlbWVudDo6b2ZmID0gKGV2ZW50TmFtZXMsIGNhbGxiYWNrKS0+XG5cdEBfZXZlbnRDYWxsYmFja3MgPz0ge19fcmVmczp7fX1cblx0aWYgbm90IElTLnN0cmluZyhldmVudE5hbWVzKVxuXHRcdEBvZmYoZXZlbnROYW1lKSBmb3IgZXZlbnROYW1lIG9mIEBfZXZlbnRDYWxsYmFja3Ncblx0XG5cdGVsc2Vcblx0XHRzcGxpdCA9IGV2ZW50TmFtZXMuc3BsaXQoJy4nKVxuXHRcdGNhbGxiYWNrUmVmID0gc3BsaXRbMV1cblx0XHRldmVudE5hbWVzID0gc3BsaXRbMF1cblx0XHRldmVudE5hbWVzLnNwbGl0KHJlZ2V4V2hpdGVzcGFjZSkuZm9yRWFjaCAoZXZlbnROYW1lKT0+XG5cdFx0XHRpZiBAX2V2ZW50Q2FsbGJhY2tzW2V2ZW50TmFtZV1cblx0XHRcdFx0Y2FsbGJhY2sgPz0gQF9ldmVudENhbGxiYWNrcy5fX3JlZnNbY2FsbGJhY2tSZWZdXG5cblx0XHRcdFx0aWYgSVMuZnVuY3Rpb24oY2FsbGJhY2spXG5cdFx0XHRcdFx0aGVscGVycy5yZW1vdmVJdGVtKEBfZXZlbnRDYWxsYmFja3NbZXZlbnROYW1lXSwgY2FsbGJhY2spXG5cdFx0XHRcdGVsc2UgaWYgbm90IGNhbGxiYWNrUmVmXG5cdFx0XHRcdFx0QF9ldmVudENhbGxiYWNrc1tldmVudE5hbWVdLmxlbmd0aCA9IDBcblxuXHRyZXR1cm4gQFxuXG5cblxuUXVpY2tFbGVtZW50OjplbWl0ID0gKGV2ZW50TmFtZSwgYnViYmxlcz10cnVlLCBjYW5jZWxhYmxlPXRydWUsIGRhdGEpLT5cblx0aWYgZXZlbnROYW1lIGFuZCBJUy5zdHJpbmcoZXZlbnROYW1lKVxuXHRcdGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jylcblx0XHRldmVudC5pbml0RXZlbnQoZXZlbnROYW1lLCBidWJibGVzLCBjYW5jZWxhYmxlKVxuXHRcdGV4dGVuZChldmVudCwgZGF0YSkgaWYgZGF0YSBhbmQgdHlwZW9mIGRhdGEgaXMgJ29iamVjdCdcblx0XHRAZWwuZGlzcGF0Y2hFdmVudChldmVudClcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6ZW1pdFByaXZhdGUgPSAoZXZlbnROYW1lLCBhcmcpLT5cblx0aWYgZXZlbnROYW1lIGFuZCBJUy5zdHJpbmcoZXZlbnROYW1lKSBhbmQgQF9ldmVudENhbGxiYWNrcz9bZXZlbnROYW1lXVxuXHRcdEBfaW52b2tlSGFuZGxlcnMoZXZlbnROYW1lLCBhcmcpXG5cdFxuXHRyZXR1cm4gQFxuXG5cblxuUXVpY2tFbGVtZW50OjpfaW52b2tlSGFuZGxlcnMgPSAoZXZlbnROYW1lLCBhcmcpLT5cblx0Y2FsbGJhY2tzID0gQF9ldmVudENhbGxiYWNrc1tldmVudE5hbWVdLnNsaWNlKClcblx0Y2IuY2FsbChALCBhcmcpIGZvciBjYiBpbiBjYWxsYmFja3Ncblx0cmV0dXJuXG5cblxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuUXVpY2tFbGVtZW50OjpfbGlzdGVuVG8gPSAoZXZlbnROYW1lLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSktPlxuXHRsaXN0ZW5NZXRob2QgPSBpZiBAZWwuYWRkRXZlbnRMaXN0ZW5lciB0aGVuICdhZGRFdmVudExpc3RlbmVyJyBlbHNlICdhdHRhY2hFdmVudCdcblx0ZXZlbnROYW1lVG9MaXN0ZW5Gb3IgPSBpZiBAZWwuYWRkRXZlbnRMaXN0ZW5lciB0aGVuIGV2ZW50TmFtZSBlbHNlIFwib24je2V2ZW50TmFtZX1cIlxuXHRcblx0QGVsW2xpc3Rlbk1ldGhvZF0oZXZlbnROYW1lVG9MaXN0ZW5Gb3IsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKVxuXHRyZXR1cm4gQFxuXG5cblxuXG4iLCJEVU1NWV9BUlJBWSA9IFtdXG5cblxuUXVpY2tFbGVtZW50OjpzdGF0ZSA9ICh0YXJnZXRTdGF0ZSwgdmFsdWUsIGJ1YmJsZXMsIHNvdXJjZSktPlxuXHRpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcblx0XHRyZXR1cm4gQF9zdGF0ZS5zbGljZSgpXG5cdFxuXHRpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDFcblx0XHRpZiBJUy5zdHJpbmcodGFyZ2V0U3RhdGUpXG5cdFx0XHRyZXR1cm4gaGVscGVycy5pbmNsdWRlcyhAX3N0YXRlLCB0YXJnZXRTdGF0ZSlcblx0XHRcblx0XHRlbHNlIGlmIElTLm9iamVjdCh0YXJnZXRTdGF0ZSlcblx0XHRcdGtleXMgPSBPYmplY3Qua2V5cyh0YXJnZXRTdGF0ZSlcblx0XHRcdGkgPSAtMVxuXHRcdFx0QHN0YXRlKGtleSwgdGFyZ2V0U3RhdGVba2V5XSkgd2hpbGUga2V5PWtleXNbKytpXVxuXHRcdFx0cmV0dXJuIEBcblxuXHRlbHNlIGlmIEBfc3RhdGVQaXBlVGFyZ2V0IGFuZCBzb3VyY2UgaXNudCBAXG5cdFx0QF9zdGF0ZVBpcGVUYXJnZXQuc3RhdGUodGFyZ2V0U3RhdGUsIHZhbHVlLCBidWJibGVzLCBAKVxuXHRcdHJldHVybiBAXG5cdFxuXHRlbHNlIGlmIElTLnN0cmluZyh0YXJnZXRTdGF0ZSlcblx0XHR0YXJnZXRTdGF0ZSA9IHRhcmdldFN0YXRlLnNsaWNlKDEpIGlmIHRhcmdldFN0YXRlWzBdIGlzICckJ1xuXHRcdHJldHVybiBAIGlmIHRhcmdldFN0YXRlIGlzICdiYXNlJ1xuXHRcdGRlc2lyZWRWYWx1ZSA9ICEhdmFsdWUgIyBDb252ZXJ0IHRoZSB2YWx1ZSB0byBhIGJvb2xlYW5cblx0XHRhY3RpdmVTdGF0ZXMgPSBAX2dldEFjdGl2ZVN0YXRlcyh0YXJnZXRTdGF0ZSwgZmFsc2UpXG5cdFx0XG5cdFx0IyA9PT09IFRvZ2dsZSBzdHlsZXMgZm9yIHRoaXMgc3RhdGUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0aWYgQHN0YXRlKHRhcmdldFN0YXRlKSBpc250IGRlc2lyZWRWYWx1ZVxuXHRcdFx0cHJvcCA9IGlmIEB0eXBlIGlzICd0ZXh0JyB0aGVuICdUZXh0JyBlbHNlICdTdHlsZSdcblx0XHRcblx0XHRcdGlmIGRlc2lyZWRWYWx1ZSAjaXMgb25cblx0XHRcdFx0QF9zdGF0ZS5wdXNoKHRhcmdldFN0YXRlKVxuXHRcdFx0XHR0b2dnbGUgPSAnT04nXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAX3N0YXRlLCB0YXJnZXRTdGF0ZSlcblx0XHRcdFx0dG9nZ2xlID0gJ09GRidcblx0XHRcdFxuXHRcdFx0QFsnX3R1cm4nK3Byb3ArdG9nZ2xlXSh0YXJnZXRTdGF0ZSwgYWN0aXZlU3RhdGVzKVxuXHRcdFx0QGVtaXRQcml2YXRlIFwic3RhdGVDaGFuZ2U6I3t0YXJnZXRTdGF0ZX1cIiwgZGVzaXJlZFZhbHVlXG5cblxuXHRcdCMgPT09PSBQYXNzIHN0YXRlIHRvIHBhcmVudC9jaGlsZHJlbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRpZiBub3QgaGVscGVycy5pbmNsdWRlcyhAb3B0aW9ucy51bnBhc3NhYmxlU3RhdGVzLCB0YXJnZXRTdGF0ZSlcblx0XHRcdGlmIGJ1YmJsZXNcblx0XHRcdFx0QF9wYXJlbnQuc3RhdGUodGFyZ2V0U3RhdGUsIHZhbHVlLCB0cnVlLCBzb3VyY2Ugb3IgQCkgaWYgQHBhcmVudFxuXHRcdFx0ZWxzZSBpZiBAb3B0aW9ucy5wYXNzU3RhdGVUb0NoaWxkcmVuXG5cdFx0XHRcdGNoaWxkLnN0YXRlKHRhcmdldFN0YXRlLCB2YWx1ZSwgZmFsc2UsIHNvdXJjZSBvciBAKSBmb3IgY2hpbGQgaW4gQF9jaGlsZHJlblxuXHRcdFxuXHRcdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50Ojp0b2dnbGVTdGF0ZSA9ICh0YXJnZXRTdGF0ZSktPlxuXHRAc3RhdGUodGFyZ2V0U3RhdGUsICFAc3RhdGUodGFyZ2V0U3RhdGUpKVxuXG5cblF1aWNrRWxlbWVudDo6cmVzZXRTdGF0ZSA9ICgpLT5cblx0Zm9yIGFjdGl2ZVN0YXRlIGluIEBfc3RhdGUuc2xpY2UoKVxuXHRcdEBzdGF0ZShhY3RpdmVTdGF0ZSwgb2ZmKVxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpwaXBlU3RhdGUgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpIGFuZCB0YXJnZXRFbCBpc250IEBcblx0XHRcdEBfc3RhdGVQaXBlVGFyZ2V0ID0gdGFyZ2V0RWxcblx0XHRcdHRhcmdldEVsLnN0YXRlKGFjdGl2ZVN0YXRlLCBvbikgZm9yIGFjdGl2ZVN0YXRlIGluIEBfc3RhdGVcblxuXHRlbHNlIGlmIHRhcmdldEVsIGlzIGZhbHNlXG5cdFx0ZGVsZXRlIEBfc3RhdGVQaXBlVGFyZ2V0XG5cblx0cmV0dXJuIEBcblxuXG5cblxuUXVpY2tFbGVtZW50OjpfYXBwbHlSZWdpc3RlcmVkU3R5bGUgPSAodGFyZ2V0U3R5bGUsIHN1cGVyaW9yU3RhdGVzLCBpbmNsdWRlQmFzZSwgc2tpcEZucyktPiBpZiB0YXJnZXRTdHlsZVxuXHRAYWRkQ2xhc3MoY2xhc3NOYW1lKSBmb3IgY2xhc3NOYW1lIGluIHRhcmdldFN0eWxlLmNsYXNzTmFtZVxuXHRcblx0aWYgdGFyZ2V0U3R5bGUuZm5zLmxlbmd0aCBhbmQgbm90IHNraXBGbnNcblx0XHRzdXBlcmlvclN0eWxlcyA9IEBfcmVzb2x2ZUZuU3R5bGVzKHN1cGVyaW9yU3RhdGVzLCBpbmNsdWRlQmFzZSkgaWYgc3VwZXJpb3JTdGF0ZXNcblx0XHRcblx0XHRmb3IgZW50cnkgaW4gdGFyZ2V0U3R5bGUuZm5zXG5cdFx0XHRAc3R5bGUoZW50cnlbMF0sIGVudHJ5WzFdKSB1bmxlc3Mgc3VwZXJpb3JTdHlsZXMgYW5kIHN1cGVyaW9yU3R5bGVzW2VudHJ5WzBdXVxuXHRcblx0cmV0dXJuXG5cblxuUXVpY2tFbGVtZW50OjpfcmVtb3ZlUmVnaXN0ZXJlZFN0eWxlID0gKHRhcmdldFN0eWxlLCBzdXBlcmlvclN0YXRlcywgaW5jbHVkZUJhc2UpLT5cblx0QHJlbW92ZUNsYXNzKGNsYXNzTmFtZSkgZm9yIGNsYXNzTmFtZSBpbiB0YXJnZXRTdHlsZS5jbGFzc05hbWVcblxuXHRpZiB0YXJnZXRTdHlsZS5mbnMubGVuZ3RoXG5cdFx0c3VwZXJpb3JTdHlsZXMgPSBAX3Jlc29sdmVGblN0eWxlcyhzdXBlcmlvclN0YXRlcywgaW5jbHVkZUJhc2UpIGlmIHN1cGVyaW9yU3RhdGVzXG5cdFx0XG5cdFx0Zm9yIGVudHJ5IGluIHRhcmdldFN0eWxlLmZuc1xuXHRcdFx0cmVzZXRWYWx1ZSA9IHN1cGVyaW9yU3R5bGVzIGFuZCBzdXBlcmlvclN0eWxlc1tlbnRyeVswXV0gb3IgbnVsbFxuXHRcdFx0QHN0eWxlKGVudHJ5WzBdLCByZXNldFZhbHVlKVxuXG5cdHJldHVyblxuXG5cblxuXG5RdWlja0VsZW1lbnQ6Ol90dXJuU3R5bGVPTiA9ICh0YXJnZXRTdGF0ZSwgYWN0aXZlU3RhdGVzKS0+XG5cdHNraXBGbnMgPSBAb3B0aW9ucy5zdHlsZUFmdGVySW5zZXJ0IGFuZCBub3QgQF9pbnNlcnRlZFxuXHRpZiBAX3N0eWxlc1t0YXJnZXRTdGF0ZV1cblx0XHRAX2FwcGx5UmVnaXN0ZXJlZFN0eWxlKEBfc3R5bGVzW3RhcmdldFN0YXRlXSwgQF9nZXRTdXBlcmlvclN0YXRlcyh0YXJnZXRTdGF0ZSwgYWN0aXZlU3RhdGVzKSwgZmFsc2UsIHNraXBGbnMpXG5cblxuXHRpZiBAX3Byb3ZpZGVkU3RhdGVzU2hhcmVkXG5cdFx0c2hhcmVkU3RhdGVzID0gQF9nZXRTaGFyZWRTdGF0ZXModGFyZ2V0U3RhdGUpXG5cdFx0XG5cdFx0Zm9yIHN0YXRlQ2hhaW4gaW4gc2hhcmVkU3RhdGVzXG5cdFx0XHRAX3N0YXRlU2hhcmVkLnB1c2goc3RhdGVDaGFpbi5zdHJpbmcpIHVubGVzcyBoZWxwZXJzLmluY2x1ZGVzKEBfc3RhdGVTaGFyZWQsIHN0YXRlQ2hhaW4uc3RyaW5nKVxuXHRcdFx0QF9hcHBseVJlZ2lzdGVyZWRTdHlsZShAX3N0eWxlc1tzdGF0ZUNoYWluLnN0cmluZ10sIG51bGwsIG51bGwsIHNraXBGbnMpXG5cblx0cmV0dXJuXG5cblxuUXVpY2tFbGVtZW50OjpfdHVyblN0eWxlT0ZGID0gKHRhcmdldFN0YXRlLCBhY3RpdmVTdGF0ZXMpLT5cblx0aWYgQF9zdHlsZXNbdGFyZ2V0U3RhdGVdXG5cdFx0QF9yZW1vdmVSZWdpc3RlcmVkU3R5bGUoQF9zdHlsZXNbdGFyZ2V0U3RhdGVdLCBhY3RpdmVTdGF0ZXMsIHRydWUpXG5cblx0aWYgQF9wcm92aWRlZFN0YXRlc1NoYXJlZFxuXHRcdHNoYXJlZFN0YXRlcyA9IEBfZ2V0U2hhcmVkU3RhdGVzKHRhcmdldFN0YXRlKVxuXHRcdHJldHVybiBpZiBzaGFyZWRTdGF0ZXMubGVuZ3RoIGlzIDBcblxuXHRcdGZvciBzdGF0ZUNoYWluIGluIHNoYXJlZFN0YXRlc1xuXHRcdFx0aGVscGVycy5yZW1vdmVJdGVtKEBfc3RhdGVTaGFyZWQsIHN0YXRlQ2hhaW4uc3RyaW5nKVxuXHRcdFx0dGFyZ2V0U3R5bGUgPSBAX3N0eWxlc1tzdGF0ZUNoYWluLnN0cmluZ11cblx0XHRcdFxuXHRcdFx0aWYgdGFyZ2V0U3R5bGUuZm5zLmxlbmd0aCBhbmQgQF9zdGF0ZVNoYXJlZC5sZW5ndGggYW5kIG5vdCBhY3RpdmVTaGFyZWRTdGF0ZXNcblx0XHRcdFx0YWN0aXZlU2hhcmVkU3RhdGVzID0gQF9zdGF0ZVNoYXJlZC5maWx0ZXIgKHN0YXRlKS0+IG5vdCBoZWxwZXJzLmluY2x1ZGVzKHN0YXRlLCB0YXJnZXRTdGF0ZSlcblx0XHRcdFx0YWN0aXZlU3RhdGVzID0gYWN0aXZlU3RhdGVzLmNvbmNhdChhY3RpdmVTaGFyZWRTdGF0ZXMpXG5cdFx0XHRcblx0XHRcdEBfcmVtb3ZlUmVnaXN0ZXJlZFN0eWxlKHRhcmdldFN0eWxlLCBhY3RpdmVTdGF0ZXMsIHRydWUpXG5cblx0cmV0dXJuXG5cblxuXG5RdWlja0VsZW1lbnQ6Ol90dXJuVGV4dE9OID0gKHRhcmdldFN0YXRlLCBhY3RpdmVTdGF0ZXMpLT5cblx0aWYgQF90ZXh0cyBhbmQgSVMuc3RyaW5nKHRhcmdldFRleHQgPSBAX3RleHRzW3RhcmdldFN0YXRlXSlcblx0XHRzdXBlcmlvclN0YXRlcyA9IEBfZ2V0U3VwZXJpb3JTdGF0ZXModGFyZ2V0U3RhdGUsIGFjdGl2ZVN0YXRlcylcblx0XHRcblx0XHRAdGV4dCA9IHRhcmdldFRleHQgdW5sZXNzIHN1cGVyaW9yU3RhdGVzLmxlbmd0aFxuXHRyZXR1cm5cblxuXG5RdWlja0VsZW1lbnQ6Ol90dXJuVGV4dE9GRiA9ICh0YXJnZXRTdGF0ZSwgYWN0aXZlU3RhdGVzKS0+XG5cdGlmIEBfdGV4dHMgYW5kIElTLnN0cmluZyh0YXJnZXRUZXh0ID0gQF90ZXh0c1t0YXJnZXRTdGF0ZV0pXG5cdFx0YWN0aXZlU3RhdGVzID0gYWN0aXZlU3RhdGVzLmZpbHRlciAoc3RhdGUpLT4gc3RhdGUgaXNudCB0YXJnZXRTdGF0ZVxuXHRcdHRhcmdldFRleHQgPSBAX3RleHRzW2FjdGl2ZVN0YXRlc1thY3RpdmVTdGF0ZXMubGVuZ3RoLTFdXVxuXHRcdHRhcmdldFRleHQgPz0gQF90ZXh0cy5iYXNlXG5cdFx0XG5cdFx0QHRleHQgPSB0YXJnZXRUZXh0XG5cdHJldHVyblxuXG5cblxuXG5cdFxuXG5cblxuXG5RdWlja0VsZW1lbnQ6Ol9nZXRBY3RpdmVTdGF0ZXMgPSAoc3RhdGVUb0V4Y2x1ZGUsIGluY2x1ZGVTaGFyZWRTdGF0ZXM9dHJ1ZSktPlxuXHRyZXR1cm4gRFVNTVlfQVJSQVkgaWYgbm90IEBfcHJvdmlkZWRTdGF0ZXNcblx0YWN0aXZlU3RhdGVzID0gcGxhaW5TdGF0ZXMgPSBAX3N0YXRlXG5cdGlmIHN0YXRlVG9FeGNsdWRlXG5cdFx0cGxhaW5TdGF0ZXMgPSBbXVxuXHRcdHBsYWluU3RhdGVzLnB1c2goc3RhdGUpIGZvciBzdGF0ZSBpbiBhY3RpdmVTdGF0ZXMgd2hlbiBzdGF0ZSBpc250IHN0YXRlVG9FeGNsdWRlXG5cdFxuXHRpZiBub3QgaW5jbHVkZVNoYXJlZFN0YXRlcyBvciBub3QgQF9wcm92aWRlZFN0YXRlc1NoYXJlZFxuXHRcdHJldHVybiBwbGFpblN0YXRlc1xuXHRlbHNlXG5cdFx0cmV0dXJuIHBsYWluU3RhdGVzLmNvbmNhdChAX3N0YXRlU2hhcmVkKVxuXG5cblF1aWNrRWxlbWVudDo6X2dldFN1cGVyaW9yU3RhdGVzID0gKHRhcmdldFN0YXRlLCBhY3RpdmVTdGF0ZXMpLT5cblx0dGFyZ2V0U3RhdGVJbmRleCA9IEBfcHJvdmlkZWRTdGF0ZXMuaW5kZXhPZih0YXJnZXRTdGF0ZSlcblx0cmV0dXJuIERVTU1ZX0FSUkFZIGlmIHRhcmdldFN0YXRlSW5kZXggaXMgQF9wcm92aWRlZFN0YXRlcy5sZW5ndGggLSAxXG5cdFxuXHRzdXBlcmlvciA9IFtdXG5cdGZvciBjYW5kaWRhdGUgaW4gYWN0aXZlU3RhdGVzXG5cdFx0c3VwZXJpb3IucHVzaChjYW5kaWRhdGUpIGlmIEBfcHJvdmlkZWRTdGF0ZXMuaW5kZXhPZihjYW5kaWRhdGUpID4gdGFyZ2V0U3RhdGVJbmRleFxuXG5cdHJldHVybiBzdXBlcmlvclxuXG5cblF1aWNrRWxlbWVudDo6X2dldFNoYXJlZFN0YXRlcyA9ICh0YXJnZXRTdGF0ZSktPlxuXHRhY3RpdmVTdGF0ZXMgPSBAX3N0YXRlXG5cdHNoYXJlZFN0YXRlcyA9IFtdXG5cblx0Zm9yIHN0YXRlQ2hhaW4gaW4gQF9wcm92aWRlZFN0YXRlc1NoYXJlZFxuXHRcdHNoYXJlZFN0YXRlcy5wdXNoKHN0YXRlQ2hhaW4pIGlmIHN0YXRlQ2hhaW4uaW5jbHVkZXModGFyZ2V0U3RhdGUpIGFuZCBzdGF0ZUNoYWluLmlzQXBwbGljYWJsZSh0YXJnZXRTdGF0ZSwgYWN0aXZlU3RhdGVzKVxuXG5cdHJldHVybiBzaGFyZWRTdGF0ZXNcblxuXG5RdWlja0VsZW1lbnQ6Ol9yZXNvbHZlRm5TdHlsZXMgPSAoc3RhdGVzLCBpbmNsdWRlQmFzZSktPlxuXHRzdGF0ZXMgPSBbJ2Jhc2UnXS5jb25jYXQoc3RhdGVzKSBpZiBpbmNsdWRlQmFzZVxuXHRvdXRwdXQgPSB7fVxuXHRcblx0Zm9yIHN0YXRlIGluIHN0YXRlcyB3aGVuIEBfc3R5bGVzW3N0YXRlXSBhbmQgQF9zdHlsZXNbc3RhdGVdLmZucy5sZW5ndGhcblx0XHRvdXRwdXRbZW50cnlbMF1dID0gZW50cnlbMV0gZm9yIGVudHJ5IGluIEBfc3R5bGVzW3N0YXRlXS5mbnNcblxuXHRyZXR1cm4gb3V0cHV0XG5cblxuXG5cblxuXG5cblxuXG4iLCIjIyMqXG4gKiBTZXRzL2dldHMgdGhlIHZhbHVlIG9mIGEgc3R5bGUgcHJvcGVydHkuIEluIGdldHRlciBtb2RlIHRoZSBjb21wdXRlZCBwcm9wZXJ0eSBvZlxuICogdGhlIHN0eWxlIHdpbGwgYmUgcmV0dXJuZWQgdW5sZXNzIHRoZSBlbGVtZW50IGlzIG5vdCBpbnNlcnRlZCBpbnRvIHRoZSBET00uIEluXG4gKiB3ZWJraXQgYnJvd3NlcnMgYWxsIGNvbXB1dGVkIHByb3BlcnRpZXMgb2YgYSBkZXRhY2hlZCBub2RlIGFyZSBhbHdheXMgYW4gZW1wdHlcbiAqIHN0cmluZyBidXQgaW4gZ2Vja28gdGhleSByZWZsZWN0IG9uIHRoZSBhY3R1YWwgY29tcHV0ZWQgdmFsdWUsIGhlbmNlIHdlIG5lZWRcbiAqIHRvIFwibm9ybWFsaXplXCIgdGhpcyBiZWhhdmlvciBhbmQgbWFrZSBzdXJlIHRoYXQgZXZlbiBvbiBnZWNrbyBhbiBlbXB0eSBzdHJpbmdcbiAqIGlzIHJldHVybmVkXG4gKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiMjI1xuUXVpY2tFbGVtZW50OjpzdHlsZSA9IChwcm9wZXJ0eSktPlxuXHRyZXR1cm4gaWYgQHR5cGUgaXMgJ3RleHQnXG5cdGFyZ3MgPSBhcmd1bWVudHNcblx0XG5cdGlmIElTLnN0cmluZyhwcm9wZXJ0eSlcblx0XHR2YWx1ZSA9IGlmIHR5cGVvZiBhcmdzWzFdIGlzICdmdW5jdGlvbicgdGhlbiBhcmdzWzFdLmNhbGwoQCwgQHJlbGF0ZWQpIGVsc2UgYXJnc1sxXVxuXHRcdHZhbHVlID0gQ1NTLlVOU0VUIGlmIGFyZ3NbMV0gaXMgbnVsbCBhbmQgSVMuZGVmaW5lZChAY3VycmVudFN0YXRlU3R5bGUocHJvcGVydHkpKSBhbmQgbm90IElTLmZ1bmN0aW9uKEBjdXJyZW50U3RhdGVTdHlsZShwcm9wZXJ0eSkpXG5cblx0XHRpZiB2YWx1ZSBhbmQgdHlwZW9mIHZhbHVlLnRoZW4gaXMgJ2Z1bmN0aW9uJ1xuXHRcdFx0dmFsdWUudGhlbiAodmFsdWUpPT4gQ1NTKEBlbCwgcHJvcGVydHksIHZhbHVlLCBAb3B0aW9ucy5mb3JjZVN0eWxlKVxuXHRcdGVsc2Vcblx0XHRcdHJlc3VsdCA9IENTUyhAZWwsIHByb3BlcnR5LCB2YWx1ZSwgQG9wdGlvbnMuZm9yY2VTdHlsZSlcblx0XHRcblx0XHRpZiBhcmdzLmxlbmd0aCBpcyAxXG5cdFx0XHQjIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5cdFx0XHRyZXR1cm4gaWYgQF9pbnNlcnRlZCB0aGVuIHJlc3VsdCBlbHNlIGlmIG5vdCByZXN1bHQgdGhlbiByZXN1bHQgZWxzZSAnJ1xuXG5cdGVsc2UgaWYgSVMub2JqZWN0KHByb3BlcnR5KVxuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0eSk7IGkgPSAtMVxuXHRcdEBzdHlsZShrZXksIHByb3BlcnR5W2tleV0pIHdoaWxlIGtleT1rZXlzWysraV1cblxuXHRyZXR1cm4gQFxuXG5cbiMjIypcbiAqIEF0dGVtcHRzIHRvIHJlc29sdmUgdGhlIHZhbHVlIGZvciBhIGdpdmVuIHByb3BlcnR5IGluIHRoZSBmb2xsb3dpbmcgb3JkZXIgaWYgZWFjaCBvbmUgaXNuJ3QgYSB2YWxpZCB2YWx1ZTpcbiAqIDEuIGZyb20gY29tcHV0ZWQgc3R5bGUgKGZvciBkb20taW5zZXJ0ZWQgZWxzKVxuICogMi4gZnJvbSBET01FbGVtZW50LnN0eWxlIG9iamVjdCAoZm9yIG5vbi1pbnNlcnRlZCBlbHM7IGlmIG9wdGlvbnMuc3R5bGVBZnRlckluc2VydCwgd2lsbCBvbmx5IGhhdmUgc3RhdGUgc3R5bGVzKVxuICogMy4gZnJvbSBwcm92aWRlZCBzdHlsZSBvcHRpb25zXG4gKiAoZm9yIG5vbi1pbnNlcnRlZCBlbHM7IGNoZWNraW5nIG9ubHkgJGJhc2Ugc2luY2Ugc3RhdGUgc3R5bGVzIHdpbGwgYWx3YXlzIGJlIGFwcGxpZWQgdG8gdGhlIHN0eWxlIG9iamVjdCBldmVuIGZvciBub24taW5zZXJ0ZWQpXG4jIyNcblF1aWNrRWxlbWVudDo6c3R5bGVTYWZlID0gKHByb3BlcnR5LCBza2lwQ29tcHV0ZWQpLT5cblx0cmV0dXJuIGlmIEB0eXBlIGlzICd0ZXh0J1xuXHRzYW1wbGUgPSBAZWwuc3R5bGVbcHJvcGVydHldXG5cblx0aWYgSVMuc3RyaW5nKHNhbXBsZSkgb3IgSVMubnVtYmVyKHNhbXBsZSlcblx0XHRjb21wdXRlZCA9IGlmIHNraXBDb21wdXRlZCB0aGVuIDAgZWxzZSBAc3R5bGUocHJvcGVydHkpXG5cdFx0cmVzdWx0ID0gY29tcHV0ZWQgb3IgQGVsLnN0eWxlW3Byb3BlcnR5XSBvciBAY3VycmVudFN0YXRlU3R5bGUocHJvcGVydHkpIG9yICcnXG5cdFx0cmV0dXJuIGlmIHR5cGVvZiByZXN1bHQgaXMgJ2Z1bmN0aW9uJyB0aGVuIHJlc3VsdC5jYWxsKEAsIEByZWxhdGVkKSBlbHNlIHJlc3VsdFxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpzdHlsZVBhcnNlZCA9IChwcm9wZXJ0eSwgc2tpcENvbXB1dGVkKS0+XG5cdHBhcnNlRmxvYXQgQHN0eWxlU2FmZShwcm9wZXJ0eSwgc2tpcENvbXB1dGVkKVxuXG5cblF1aWNrRWxlbWVudDo6cmVjYWxjU3R5bGUgPSAocmVjYWxjQ2hpbGRyZW4pLT5cblx0dGFyZ2V0U3R5bGVzID0gQF9yZXNvbHZlRm5TdHlsZXMoQF9nZXRBY3RpdmVTdGF0ZXMoKSwgdHJ1ZSlcblxuXHRAc3R5bGUodGFyZ2V0U3R5bGVzKVxuXHRcblx0aWYgcmVjYWxjQ2hpbGRyZW5cblx0XHRjaGlsZC5yZWNhbGNTdHlsZSgpIGZvciBjaGlsZCBpbiBAX2NoaWxkcmVuXG5cdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6Y3VycmVudFN0YXRlU3R5bGUgPSAocHJvcGVydHkpLT4gaWYgcHJvcGVydHlcblx0aWYgQF9zdGF0ZS5sZW5ndGhcblx0XHRzdGF0ZXMgPSBAX3N0YXRlLnNsaWNlKClcblx0XHRzdGF0ZXMucHVzaChAX3N0YXRlU2hhcmVkLi4uKSBpZiBAX3N0YXRlU2hhcmVkIGFuZCBAX3N0YXRlU2hhcmVkLmxlbmd0aFxuXHRcdGkgPSBzdGF0ZXMubGVuZ3RoXG5cdFx0d2hpbGUgc3RhdGUgPSBzdGF0ZXNbLS1pXVxuXHRcdFx0cmV0dXJuIEBfc3R5bGVzW3N0YXRlXS5ydWxlW3Byb3BlcnR5XSBpZiBAX3N0eWxlc1tzdGF0ZV0gYW5kIElTLmRlZmluZWQoQF9zdHlsZXNbc3RhdGVdLnJ1bGVbcHJvcGVydHldKVxuXG5cdHJldHVybiBAX3N0eWxlcy5iYXNlLnJ1bGVbcHJvcGVydHldIGlmIEBfc3R5bGVzLmJhc2VcblxuXG5RdWlja0VsZW1lbnQ6OmhpZGUgPSAoKS0+XG5cdEBzdHlsZSAnZGlzcGxheScsICdub25lJ1xuXG5cblF1aWNrRWxlbWVudDo6c2hvdyA9IChkaXNwbGF5KS0+XG5cdGlmIG5vdCBkaXNwbGF5XG5cdFx0ZGlzcGxheSA9IEBjdXJyZW50U3RhdGVTdHlsZSgnZGlzcGxheScpXG5cdFx0ZGlzcGxheSA9ICdibG9jaycgaWYgZGlzcGxheSBpcyAnbm9uZScgb3Igbm90IGRpc3BsYXlcblx0XG5cdGRpc3BsYXkgPz0gQF9zdHlsZXMuYmFzZT8uZGlzcGxheSBvciAnYmxvY2snXG5cdEBzdHlsZSAnZGlzcGxheScsIGRpc3BsYXlcblxuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIFF1aWNrRWxlbWVudDo6LFxuXHQnb3JpZW50YXRpb24nOiBvcmllbnRhdGlvbkdldHRlciA9IGdldDogKCktPiBpZiBAd2lkdGggPiBAaGVpZ2h0IHRoZW4gJ2xhbmRzY2FwZScgZWxzZSAncG9ydHJhaXQnXG5cdCdhc3BlY3RSYXRpbyc6IGFzcGVjdFJhdGlvR2V0dGVyID0gZ2V0OiAoKS0+IEB3aWR0aC9AaGVpZ2h0XG5cdCdyZWN0JzogZ2V0OiAoKS0+IEBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHQnd2lkdGgnOlxuXHRcdGdldDogKCktPiBwYXJzZUZsb2F0IEBzdHlsZSgnd2lkdGgnKVxuXHRcdHNldDogKHZhbHVlKS0+IEBzdHlsZSAnd2lkdGgnLCB2YWx1ZVxuXHQnaGVpZ2h0Jzpcblx0XHRnZXQ6ICgpLT4gcGFyc2VGbG9hdCBAc3R5bGUoJ2hlaWdodCcpXG5cdFx0c2V0OiAodmFsdWUpLT4gQHN0eWxlICdoZWlnaHQnLCB2YWx1ZVxuXG5cbiIsIlF1aWNrRWxlbWVudDo6YXR0ciA9ICh0YXJnZXQsIG5ld1ZhbHVlKS0+XG5cdGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMVxuXHRcdGlmIHR5cGVvZiB0YXJnZXQgaXMgJ3N0cmluZydcblx0XHRcdHJldHVybiBAZWwuZ2V0QXR0cmlidXRlKHRhcmdldClcblx0XG5cdFx0aWYgSVMub2JqZWN0KHRhcmdldClcblx0XHRcdGtleXMgPSBPYmplY3Qua2V5cyh0YXJnZXQpOyBpID0gLTFcblx0XHRcdEBhdHRyKGtleSwgdGFyZ2V0W2tleV0pIHdoaWxlIGtleT1rZXlzWysraV1cblxuXHRlbHNlIGlmIG5ld1ZhbHVlIGlzIG51bGxcblx0XHRyZXR1cm4gQGVsLnJlbW92ZUF0dHJpYnV0ZSh0YXJnZXQpXG5cblx0ZWxzZVxuXHRcdEBlbC5zZXRBdHRyaWJ1dGUodGFyZ2V0LCBuZXdWYWx1ZSlcblx0XG5cdHJldHVybiBAXG5cblxuXG5RdWlja0VsZW1lbnQ6OnByb3AgPSAodGFyZ2V0LCBuZXdWYWx1ZSktPlxuXHRpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDFcblx0XHRpZiB0eXBlb2YgdGFyZ2V0IGlzICdzdHJpbmcnXG5cdFx0XHRyZXR1cm4gQGVsW3RhcmdldF1cblx0XG5cdFx0aWYgSVMub2JqZWN0KHRhcmdldClcblx0XHRcdGtleXMgPSBPYmplY3Qua2V5cyh0YXJnZXQpOyBpID0gLTFcblx0XHRcdEBwcm9wKGtleSwgdGFyZ2V0W2tleV0pIHdoaWxlIGtleT1rZXlzWysraV1cblx0XG5cdGVsc2Vcblx0XHRAZWxbdGFyZ2V0XSA9IG5ld1ZhbHVlXG5cdFx0XG5cdHJldHVybiBAIiwiUXVpY2tFbGVtZW50Ojp0b1RlbXBsYXRlID0gKCktPlxuXHRRdWlja0RvbS50ZW1wbGF0ZShAKVxuXG5cblF1aWNrRWxlbWVudDo6Y2xvbmUgPSAoKS0+XG5cdGVsQ2xvbmUgPSBAZWwuY2xvbmVOb2RlKGZhbHNlKVxuXHRvcHRpb25zID0gZXh0ZW5kLmNsb25lKEBvcHRpb25zLCB7ZXhpc3Rpbmc6ZWxDbG9uZX0pXG5cdFxuXHRuZXdFbCA9IG5ldyBRdWlja0VsZW1lbnQoQHR5cGUsIG9wdGlvbnMpXG5cdG5ld0VsLnN0YXRlKGFjdGl2ZVN0YXRlLCBvbikgZm9yIGFjdGl2ZVN0YXRlIGluIEBfc3RhdGVcblx0bmV3RWwuYXBwZW5kKGNoaWxkLmNsb25lKCkpIGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cblx0Zm9yIGV2ZW50TmFtZSwgY2FsbGJhY2tzIG9mIEBfZXZlbnRDYWxsYmFja3Ncblx0XHRuZXdFbC5vbihldmVudE5hbWUsIGNhbGxiYWNrKSBmb3IgY2FsbGJhY2sgaW4gY2FsbGJhY2tzXG5cdFxuXHRyZXR1cm4gbmV3RWxcblxuXG5RdWlja0VsZW1lbnQ6OmFwcGVuZCA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXHRcdFxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHRwcmV2UGFyZW50ID0gdGFyZ2V0RWwucGFyZW50XG5cdFx0XHRwcmV2UGFyZW50Ll9yZW1vdmVDaGlsZCh0YXJnZXRFbCkgaWYgcHJldlBhcmVudFxuXHRcdFx0QF9jaGlsZHJlbi5wdXNoKHRhcmdldEVsKVxuXHRcdFx0QGVsLmFwcGVuZENoaWxkKHRhcmdldEVsLmVsKVxuXHRcdFx0dGFyZ2V0RWwuX3JlZnJlc2hQYXJlbnQoKSAjIEZvcmNlIHJlLWZyZXNoIHRhcmdldEVsLl9wYXJlbnQgdmFsdWUgdG8gdHJpZ2dlciBpbnNlcnRlZCBjYWxsYmFja1xuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjphcHBlbmRUbyA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXHRcdFxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHR0YXJnZXRFbC5hcHBlbmQoQClcblx0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpwcmVwZW5kID0gKHRhcmdldEVsKS0+XG5cdGlmIHRhcmdldEVsXG5cdFx0dGFyZ2V0RWwgPSBoZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwodGFyZ2V0RWwpXG5cdFx0XG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbClcblx0XHRcdHByZXZQYXJlbnQgPSB0YXJnZXRFbC5wYXJlbnRcblx0XHRcdHByZXZQYXJlbnQuX3JlbW92ZUNoaWxkKHRhcmdldEVsKSBpZiBwcmV2UGFyZW50XG5cdFx0XHRAX2NoaWxkcmVuLnVuc2hpZnQodGFyZ2V0RWwpXG5cdFx0XHRAZWwuaW5zZXJ0QmVmb3JlKHRhcmdldEVsLmVsLCBAZWwuZmlyc3RDaGlsZClcblx0XHRcdHRhcmdldEVsLl9yZWZyZXNoUGFyZW50KCkgIyBGb3JjZSByZS1mcmVzaCB0YXJnZXRFbC5fcGFyZW50IHZhbHVlIHRvIHRyaWdnZXIgaW5zZXJ0ZWQgY2FsbGJhY2tcblx0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpwcmVwZW5kVG8gPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblx0XHRcblx0XHRpZiBJUy5xdWlja0RvbUVsKHRhcmdldEVsKVxuXHRcdFx0dGFyZ2V0RWwucHJlcGVuZChAKVxuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjphZnRlciA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbCBhbmQgQHBhcmVudFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbClcblx0XHRcdG15SW5kZXggPSBAcGFyZW50Ll9jaGlsZHJlbi5pbmRleE9mKEApXG5cdFx0XHRAcGFyZW50Ll9jaGlsZHJlbi5zcGxpY2UobXlJbmRleCsxLCAwLCB0YXJnZXRFbClcblx0XHRcdEBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0YXJnZXRFbC5lbCwgQGVsLm5leHRTaWJsaW5nKVxuXHRcdFx0dGFyZ2V0RWwuX3JlZnJlc2hQYXJlbnQoKSAjIEZvcmNlIHJlLWZyZXNoIHRhcmdldEVsLl9wYXJlbnQgdmFsdWUgdG8gdHJpZ2dlciBpbnNlcnRlZCBjYWxsYmFja1xuXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjppbnNlcnRBZnRlciA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXHRcdFxuXHRcdGlmIElTLnF1aWNrRG9tRWwodGFyZ2V0RWwpXG5cdFx0XHR0YXJnZXRFbC5hZnRlcihAKVxuXHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OmJlZm9yZSA9ICh0YXJnZXRFbCktPlxuXHRpZiB0YXJnZXRFbCBhbmQgQHBhcmVudFxuXHRcdHRhcmdldEVsID0gaGVscGVycy5ub3JtYWxpemVHaXZlbkVsKHRhcmdldEVsKVxuXG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbClcblx0XHRcdG15SW5kZXggPSBAcGFyZW50Ll9jaGlsZHJlbi5pbmRleE9mKEApXG5cdFx0XHRAcGFyZW50Ll9jaGlsZHJlbi5zcGxpY2UobXlJbmRleCwgMCwgdGFyZ2V0RWwpXG5cdFx0XHRAZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGFyZ2V0RWwuZWwsIEBlbClcblx0XHRcdHRhcmdldEVsLl9yZWZyZXNoUGFyZW50KCkgIyBGb3JjZSByZS1mcmVzaCB0YXJnZXRFbC5fcGFyZW50IHZhbHVlIHRvIHRyaWdnZXIgaW5zZXJ0ZWQgY2FsbGJhY2tcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6aW5zZXJ0QmVmb3JlID0gKHRhcmdldEVsKS0+XG5cdGlmIHRhcmdldEVsXG5cdFx0dGFyZ2V0RWwgPSBoZWxwZXJzLm5vcm1hbGl6ZUdpdmVuRWwodGFyZ2V0RWwpXG5cdFx0XG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbClcblx0XHRcdHRhcmdldEVsLmJlZm9yZShAKVxuXHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OmRldGFjaCA9ICgpLT5cblx0QHBhcmVudD8uX3JlbW92ZUNoaWxkKEApXG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpyZW1vdmUgPSAoKS0+XG5cdEBkZXRhY2goKVxuXHRAcmVzZXRTdGF0ZSgpXG5cdGlmIEBfZXZlbnRDYWxsYmFja3Ncblx0XHRAX2V2ZW50Q2FsbGJhY2tzW2V2ZW50TmFtZV0ubGVuZ3RoID0gMCBmb3IgZXZlbnROYW1lIG9mIEBfZXZlbnRDYWxsYmFja3Ncblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OmVtcHR5ID0gKCktPlxuXHRAX3JlbW92ZUNoaWxkKGNoaWxkKSBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuLnNsaWNlKClcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OndyYXAgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblx0XHRjdXJyZW50UGFyZW50ID0gQHBhcmVudFxuXG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbCkgYW5kIHRhcmdldEVsIGlzbnQgQCBhbmQgdGFyZ2V0RWwgaXNudCBAcGFyZW50XG5cdFx0XHRpZiBjdXJyZW50UGFyZW50XG5cdFx0XHRcdGN1cnJlbnRQYXJlbnQuX3JlbW92ZUNoaWxkKEAsIGlmIG5vdCB0YXJnZXRFbC5wYXJlbnQgdGhlbiB0YXJnZXRFbClcblx0XHRcdFxuXHRcdFx0dGFyZ2V0RWwuYXBwZW5kKEApXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnVud3JhcCA9ICgpLT5cblx0cGFyZW50ID0gQHBhcmVudFxuXHRpZiBwYXJlbnRcblx0XHRwYXJlbnRDaGlsZHJlbiA9IFF1aWNrRG9tLmJhdGNoKHBhcmVudC5jaGlsZHJlbilcblx0XHRwYXJlbnRTaWJsaW5nID0gcGFyZW50Lm5leHRcblx0XHRncmFuZFBhcmVudCA9IHBhcmVudC5wYXJlbnRcblx0XHRpZiBncmFuZFBhcmVudFxuXHRcdFx0cGFyZW50LmRldGFjaCgpXG5cblx0XHRcdGlmIHBhcmVudFNpYmxpbmdcblx0XHRcdFx0cGFyZW50Q2hpbGRyZW4uaW5zZXJ0QmVmb3JlKHBhcmVudFNpYmxpbmcpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBhcmVudENoaWxkcmVuLmFwcGVuZFRvKGdyYW5kUGFyZW50KVxuXHRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnJlcGxhY2UgPSAodGFyZ2V0RWwpLT5cblx0aWYgdGFyZ2V0RWxcblx0XHR0YXJnZXRFbCA9IGhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCh0YXJnZXRFbClcblx0XG5cdFx0aWYgSVMucXVpY2tEb21FbCh0YXJnZXRFbCkgYW5kIHRhcmdldEVsIGlzbnQgQFxuXHRcdFx0dGFyZ2V0RWwuZGV0YWNoKClcblx0XHRcdEBwYXJlbnQ/Ll9yZW1vdmVDaGlsZChALCB0YXJnZXRFbClcblx0XHRcdHRhcmdldEVsLl9yZWZyZXNoUGFyZW50KCkgIyBGb3JjZSByZS1mcmVzaCB0YXJnZXRFbC5fcGFyZW50IHZhbHVlIHRvIHRyaWdnZXIgaW5zZXJ0ZWQgY2FsbGJhY2tcblx0XG5cdHJldHVybiBAXG5cblxuUXVpY2tFbGVtZW50OjpoYXNDbGFzcyA9ICh0YXJnZXQpLT5cblx0aGVscGVycy5pbmNsdWRlcyhAY2xhc3NMaXN0LCB0YXJnZXQpXG5cblxuUXVpY2tFbGVtZW50OjphZGRDbGFzcyA9ICh0YXJnZXQpLT5cblx0Y2xhc3NMaXN0ID0gQGNsYXNzTGlzdFxuXHR0YXJnZXRJbmRleCA9IGNsYXNzTGlzdC5pbmRleE9mKHRhcmdldClcblxuXHRpZiB0YXJnZXRJbmRleCBpcyAtMVxuXHRcdGNsYXNzTGlzdC5wdXNoKHRhcmdldClcblx0XHRAY2xhc3NOYW1lID0gaWYgY2xhc3NMaXN0Lmxlbmd0aCA+IDEgdGhlbiBjbGFzc0xpc3Quam9pbignICcpIGVsc2UgY2xhc3NMaXN0WzBdXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnJlbW92ZUNsYXNzID0gKHRhcmdldCktPlxuXHRjbGFzc0xpc3QgPSBAY2xhc3NMaXN0XG5cdHRhcmdldEluZGV4ID0gY2xhc3NMaXN0LmluZGV4T2YodGFyZ2V0KVxuXHRcblx0aWYgdGFyZ2V0SW5kZXggaXNudCAtMVxuXHRcdGNsYXNzTGlzdC5zcGxpY2UodGFyZ2V0SW5kZXgsIDEpXG5cdFx0QGNsYXNzTmFtZSA9IGlmIGNsYXNzTGlzdC5sZW5ndGggdGhlbiBjbGFzc0xpc3Quam9pbignICcpIGVsc2UgJydcblxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6dG9nZ2xlQ2xhc3MgPSAodGFyZ2V0KS0+XG5cdGlmIEBoYXNDbGFzcyh0YXJnZXQpXG5cdFx0QHJlbW92ZUNsYXNzKHRhcmdldClcblx0ZWxzZVxuXHRcdEBhZGRDbGFzcyh0YXJnZXQpXG5cblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6OnNldFJlZiA9ICh0YXJnZXQpLT5cblx0QHJlZiA9IEBvcHRpb25zLnJlZiA9IHRhcmdldFxuXHRAYXR0ciAnZGF0YS1yZWYnLCB0YXJnZXRcblx0cmV0dXJuIEBcblxuXG5RdWlja0VsZW1lbnQ6Ol9yZWZyZXNoUGFyZW50ID0gKCktPlxuXHRAcGFyZW50XG5cblxuUXVpY2tFbGVtZW50OjpfcmVtb3ZlQ2hpbGQgPSAodGFyZ2V0Q2hpbGQsIHJlcGxhY2VtZW50Q2hpbGQpLT5cblx0aW5kZXhPZkNoaWxkID0gQGNoaWxkcmVuLmluZGV4T2YodGFyZ2V0Q2hpbGQpXG5cdGlmIGluZGV4T2ZDaGlsZCBpc250IC0xXG5cdFx0aWYgcmVwbGFjZW1lbnRDaGlsZFxuXHRcdFx0QGVsLnJlcGxhY2VDaGlsZChyZXBsYWNlbWVudENoaWxkLmVsLCB0YXJnZXRDaGlsZC5lbClcblx0XHRcdEBfY2hpbGRyZW4uc3BsaWNlKGluZGV4T2ZDaGlsZCwgMSwgcmVwbGFjZW1lbnRDaGlsZClcblx0XHRlbHNlXG5cdFx0XHRAZWwucmVtb3ZlQ2hpbGQodGFyZ2V0Q2hpbGQuZWwpXG5cdFx0XHRAX2NoaWxkcmVuLnNwbGljZShpbmRleE9mQ2hpbGQsIDEpXG5cdFx0XG5cblx0cmV0dXJuIEBcblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBRdWlja0VsZW1lbnQ6Oixcblx0J2h0bWwnOlxuXHRcdGdldDogKCktPiBAZWwuaW5uZXJIVE1MXG5cdFx0c2V0OiAobmV3VmFsdWUpLT4gQGVsLmlubmVySFRNTCA9IG5ld1ZhbHVlXG5cdFxuXHQndGV4dCc6XG5cdFx0Z2V0OiAoKS0+IEBlbC50ZXh0Q29udGVudFxuXHRcdHNldDogKG5ld1ZhbHVlKS0+IEBlbC50ZXh0Q29udGVudCA9IG5ld1ZhbHVlXG5cblx0J2NsYXNzTmFtZSc6XG5cdFx0Z2V0OiAoKS0+IGlmIEBzdmcgdGhlbiAoQGF0dHIoJ2NsYXNzJykgb3IgJycpIGVsc2UgQHJhdy5jbGFzc05hbWVcblx0XHRzZXQ6IChuZXdWYWx1ZSktPiBpZiBAc3ZnIHRoZW4gQGF0dHIoJ2NsYXNzJywgbmV3VmFsdWUpIGVsc2UgQHJhdy5jbGFzc05hbWUgPSBuZXdWYWx1ZVxuXG5cdCdjbGFzc0xpc3QnOlxuXHRcdGdldDogKCktPlxuXHRcdFx0bGlzdCA9IEBjbGFzc05hbWUuc3BsaXQoL1xccysvKVxuXHRcdFx0bGlzdC5wb3AoKSBpZiBsaXN0W2xpc3QubGVuZ3RoLTFdIGlzICcnXG5cdFx0XHRsaXN0LnNoaWZ0KCkgaWYgbGlzdFswXSBpcyAnJ1xuXHRcdFx0cmV0dXJuIGxpc3RcblxuXG5cblxuXG5cblxuIiwiUXVpY2tFbGVtZW50Ojp1cGRhdGVPcHRpb25zID0gKG9wdGlvbnMpLT5cblx0aWYgSVMub2JqZWN0KG9wdGlvbnMpIFxuXHRcdEBvcHRpb25zID0gb3B0aW9uc1xuXHRcdEBfbm9ybWFsaXplT3B0aW9ucygpXG5cdFx0QF9hcHBseU9wdGlvbnMoQG9wdGlvbnMpXG5cdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6dXBkYXRlU3RhdGVTdHlsZXMgPSAoc3R5bGVzKS0+XG5cdGlmIElTLm9iamVjdFBsYWluKHN0eWxlcylcblx0XHRleHRlbmQuZGVlcC5jb25jYXQgQCwgcGFyc2VkID0gQF9wYXJzZVN0eWxlcyhzdHlsZXMpXG5cblx0XHRpZiBwYXJzZWQuX3N0eWxlc1xuXHRcdFx0dXBkYXRlZFN0YXRlcyA9IE9iamVjdC5rZXlzKHBhcnNlZC5fc3R5bGVzKVxuXHRcdFx0XG5cdFx0XHRmb3Igc3RhdGUgaW4gdXBkYXRlZFN0YXRlcyB3aGVuIEBzdGF0ZShzdGF0ZSkgb3Igc3RhdGUgaXMgJ2Jhc2UnXG5cdFx0XHRcdEBfYXBwbHlSZWdpc3RlcmVkU3R5bGUoQF9zdHlsZXNbc3RhdGVdLCBAX2dldEFjdGl2ZVN0YXRlcyhzdGF0ZSksIGZhbHNlKVxuXHRcdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6dXBkYXRlU3RhdGVUZXh0cyA9ICh0ZXh0cyktPlxuXHRpZiBJUy5vYmplY3RQbGFpbih0ZXh0cylcblx0XHRleHRlbmQuZGVlcC5jb25jYXQgQCwgcGFyc2VkID0gQF9wYXJzZVRleHRzKHRleHRzKVxuXHRcblx0cmV0dXJuIEBcblxuXG5cblF1aWNrRWxlbWVudDo6YXBwbHlEYXRhID0gKGRhdGEsIHBhc3NUaHJvdWdoKS0+XG5cdGlmIEBvcHRpb25zLnBhc3NEYXRhVG9DaGlsZHJlbiBhbmQgQF9jaGlsZHJlbi5sZW5ndGggYW5kIChwYXNzVGhyb3VnaCA/PSB0cnVlKVxuXHRcdGNoaWxkLmFwcGx5RGF0YShkYXRhKSBmb3IgY2hpbGQgaW4gQF9jaGlsZHJlblxuXG5cdGlmIGNvbXB1dGVycyA9IEBvcHRpb25zLmNvbXB1dGVyc1xuXHRcdGRlZmF1bHRzID0gQG9wdGlvbnMuZGVmYXVsdHNcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoY29tcHV0ZXJzKVxuXHRcdFxuXHRcdGZvciBrZXkgaW4ga2V5c1xuXHRcdFx0aWYgQG9wdGlvbnMuaW52b2tlQ29tcHV0ZXJzT25jZVxuXHRcdFx0XHRjb250aW51ZSBpZiBAX2ludm9rZWRDb21wdXRlcnNba2V5XVxuXHRcdFx0XHRAX2ludm9rZWRDb21wdXRlcnNba2V5XSA9IDFcblx0XHRcdFxuXHRcdFx0aWYgZGF0YSBhbmQgZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpXG5cdFx0XHRcdEBfcnVuQ29tcHV0ZXIoa2V5LCBkYXRhW2tleV0sIGRhdGEpXG5cdFx0XHRcblx0XHRcdGVsc2UgaWYgZGVmYXVsdHMgYW5kIGRlZmF1bHRzLmhhc093blByb3BlcnR5KGtleSlcblx0XHRcdFx0QF9ydW5Db21wdXRlcihrZXksIGRlZmF1bHRzW2tleV0sIGRhdGEpXG5cdFxuXHRyZXR1cm4gQFxuXG5cblF1aWNrRWxlbWVudDo6X3J1bkNvbXB1dGVyID0gKGNvbXB1dGVyLCBhcmcsIGRhdGEpLT5cblx0QG9wdGlvbnMuY29tcHV0ZXJzW2NvbXB1dGVyXS5jYWxsKEAsIGFyZywgZGF0YSlcblxuXG5cblxuXG5cbiIsIlF1aWNrV2luZG93ID0gXG5cdHR5cGU6ICd3aW5kb3cnXG5cdGVsOiB3aW5kb3dcblx0cmF3OiB3aW5kb3dcblx0X2V2ZW50Q2FsbGJhY2tzOiB7X19yZWZzOnt9fVxuXHRcblxuUXVpY2tXaW5kb3cub24gPSAgUXVpY2tFbGVtZW50OjpvblxuUXVpY2tXaW5kb3cub2ZmID0gIFF1aWNrRWxlbWVudDo6b2ZmXG5RdWlja1dpbmRvdy5lbWl0ID0gIFF1aWNrRWxlbWVudDo6ZW1pdFxuUXVpY2tXaW5kb3cuZW1pdFByaXZhdGUgPSAgUXVpY2tFbGVtZW50OjplbWl0UHJpdmF0ZVxuUXVpY2tXaW5kb3cuX2xpc3RlblRvID0gIFF1aWNrRWxlbWVudDo6X2xpc3RlblRvXG5RdWlja1dpbmRvdy5faW52b2tlSGFuZGxlcnMgPSAgUXVpY2tFbGVtZW50OjpfaW52b2tlSGFuZGxlcnNcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIFF1aWNrV2luZG93LFxuXHQnd2lkdGgnOiBnZXQ6ICgpLT4gd2luZG93LmlubmVyV2lkdGhcblx0J2hlaWdodCc6IGdldDogKCktPiB3aW5kb3cuaW5uZXJIZWlnaHRcblx0J29yaWVudGF0aW9uJzogb3JpZW50YXRpb25HZXR0ZXJcblx0J2FzcGVjdFJhdGlvJzogYXNwZWN0UmF0aW9HZXR0ZXJcblxuIiwiTWVkaWFRdWVyeSA9IG5ldyAoKS0+XG5cdGNhbGxiYWNrcyA9IFtdXG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsICgpLT5cblx0XHRjYWxsYmFjaygpIGZvciBjYWxsYmFjayBpbiBjYWxsYmFja3Ncblx0XHRyZXR1cm5cblxuXHRAcGFyc2VRdWVyeSA9ICh0YXJnZXQsIHF1ZXJ5U3RyaW5nKS0+XG5cdFx0cXVlcnlTcGxpdCA9IHF1ZXJ5U3RyaW5nLnNwbGl0KCcoJylcblx0XHRzb3VyY2UgPSBxdWVyeVNwbGl0WzBdXG5cdFx0c291cmNlID0gc3dpdGNoIHNvdXJjZVxuXHRcdFx0d2hlbiAnd2luZG93JyB0aGVuIFF1aWNrV2luZG93XG5cdFx0XHR3aGVuICdwYXJlbnQnIHRoZW4gdGFyZ2V0LnBhcmVudFxuXHRcdFx0d2hlbiAnc2VsZicgdGhlbiB0YXJnZXRcblx0XHRcdGVsc2UgdGFyZ2V0LnBhcmVudE1hdGNoaW5nIChwYXJlbnQpLT4gcGFyZW50LnJlZiBpcyBzb3VyY2Uuc2xpY2UoMSlcblxuXHRcdHJ1bGVzID0gcXVlcnlTcGxpdFsxXVxuXHRcdFx0LnNsaWNlKDAsLTEpXG5cdFx0XHQuc3BsaXQocnVsZURlbGltaXRlcilcblx0XHRcdC5tYXAgKHJ1bGUpLT4gXG5cdFx0XHRcdHNwbGl0ID0gcnVsZS5zcGxpdCgnOicpXG5cdFx0XHRcdHZhbHVlID0gcGFyc2VGbG9hdChzcGxpdFsxXSlcblx0XHRcdFx0dmFsdWUgPSBzcGxpdFsxXSBpZiBpc05hTih2YWx1ZSlcblx0XHRcdFx0a2V5ID0gc3BsaXRbMF1cblx0XHRcdFx0a2V5UHJlZml4ID0ga2V5LnNsaWNlKDAsNClcblx0XHRcdFx0bWF4ID0ga2V5UHJlZml4IGlzICdtYXgtJ1xuXHRcdFx0XHRtaW4gPSBub3QgbWF4IGFuZCBrZXlQcmVmaXggaXMgJ21pbi0nXG5cdFx0XHRcdGtleSA9IGtleS5zbGljZSg0KSBpZiBtYXggb3IgbWluXG5cdFx0XHRcdGdldHRlciA9IHN3aXRjaCBrZXlcblx0XHRcdFx0XHR3aGVuICdvcmllbnRhdGlvbicgdGhlbiAoKS0+IHNvdXJjZS5vcmllbnRhdGlvblxuXHRcdFx0XHRcdHdoZW4gJ2FzcGVjdC1yYXRpbycgdGhlbiAoKS0+IHNvdXJjZS5hc3BlY3RSYXRpb1xuXHRcdFx0XHRcdHdoZW4gJ3dpZHRoJywnaGVpZ2h0JyB0aGVuICgpLT4gc291cmNlW2tleV1cblx0XHRcdFx0XHRlbHNlICgpLT5cblx0XHRcdFx0XHRcdHN0cmluZ1ZhbHVlID0gc291cmNlLnN0eWxlKGtleSlcblx0XHRcdFx0XHRcdHBhcnNlZFZhbHVlID0gcGFyc2VGbG9hdCBzdHJpbmdWYWx1ZVxuXHRcdFx0XHRcdFx0cmV0dXJuIGlmIGlzTmFOKHBhcnNlZFZhbHVlKSB0aGVuIHN0cmluZ1ZhbHVlIGVsc2UgcGFyc2VkVmFsdWVcblx0XHRcdFx0XG5cdFx0XHRcdHJldHVybiB7a2V5LHZhbHVlLG1pbixtYXgsZ2V0dGVyfVxuXG5cdFx0cmV0dXJuIHtzb3VyY2UsIHJ1bGVzfVxuXG5cblx0QHJlZ2lzdGVyID0gKHRhcmdldCwgcXVlcnlTdHJpbmcpLT5cblx0XHRxdWVyeSA9IEBwYXJzZVF1ZXJ5KHRhcmdldCwgcXVlcnlTdHJpbmcpXG5cdFx0aWYgcXVlcnkuc291cmNlXG5cdFx0XHRjYWxsYmFja3MucHVzaCBjYWxsYmFjayA9ICgpLT4gdGVzdFJ1bGUodGFyZ2V0LCBxdWVyeSwgcXVlcnlTdHJpbmcpXG5cdFx0XHRjYWxsYmFjaygpXG5cdFx0cmV0dXJuIHF1ZXJ5XG5cblxuXHR0ZXN0UnVsZSA9ICh0YXJnZXQsIHF1ZXJ5LCBxdWVyeVN0cmluZyktPlxuXHRcdHBhc3NlZCA9IHRydWVcblxuXHRcdGZvciBydWxlIGluIHF1ZXJ5LnJ1bGVzXG5cdFx0XHRjdXJyZW50VmFsdWUgPSBydWxlLmdldHRlcigpXG5cdFx0XHRwYXNzZWQgPSBzd2l0Y2hcblx0XHRcdFx0d2hlbiBydWxlLm1pbiB0aGVuIGN1cnJlbnRWYWx1ZSA+PSBydWxlLnZhbHVlXG5cdFx0XHRcdHdoZW4gcnVsZS5tYXggdGhlbiBjdXJyZW50VmFsdWUgPD0gcnVsZS52YWx1ZVxuXHRcdFx0XHRlbHNlIGN1cnJlbnRWYWx1ZSBpcyBydWxlLnZhbHVlXG5cblx0XHRcdGJyZWFrIGlmIG5vdCBwYXNzZWRcdFx0XG5cdFx0XG5cdFx0dGFyZ2V0LnN0YXRlKHF1ZXJ5U3RyaW5nLCBwYXNzZWQpXG5cblx0cmV0dXJuIEBcblxuXG5cblxucnVsZURlbGltaXRlciA9IC8sXFxzKi9cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsImNsYXNzIFF1aWNrQmF0Y2hcblx0Y29uc3RydWN0b3I6IChlbGVtZW50cywgQHJldHVyblJlc3VsdHMpLT5cblx0XHRAZWxlbWVudHMgPSBlbGVtZW50cy5tYXAgKGVsKS0+IFF1aWNrRG9tKGVsKVxuXG5cdHJldmVyc2U6ICgpLT5cblx0XHRAZWxlbWVudHMgPSBAZWxlbWVudHMucmV2ZXJzZSgpXG5cdFx0cmV0dXJuIEBcblxuXHRyZXR1cm46IChyZXR1cm5OZXh0KS0+XG5cdFx0aWYgcmV0dXJuTmV4dFxuXHRcdFx0QHJldHVyblJlc3VsdHMgPSB0cnVlXG5cdFx0XHRyZXR1cm4gQFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBAbGFzdFJlc3VsdHNcblxuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuUXVpY2tCYXRjaC5uYW1lID89ICdRdWlja0JhdGNoJ1xuXG5cblxuT2JqZWN0LmtleXMoUXVpY2tFbGVtZW50OjopLmNvbmNhdCgnY3NzJywgJ3JlcGxhY2VXaXRoJywgJ2h0bWwnLCAndGV4dCcpLmZvckVhY2ggKG1ldGhvZCktPlxuXHRRdWlja0JhdGNoOjpbbWV0aG9kXSA9IChuZXdWYWx1ZSktPlxuXHRcdHJlc3VsdHMgPSBAbGFzdFJlc3VsdHMgPSBmb3IgZWxlbWVudCBpbiBAZWxlbWVudHNcblx0XHRcdGlmIG1ldGhvZCBpcyAnaHRtbCcgb3IgbWV0aG9kIGlzICd0ZXh0J1xuXHRcdFx0XHRpZiBuZXdWYWx1ZSB0aGVuIGVsZW1lbnRbbWV0aG9kXSA9IG5ld1ZhbHVlIGVsc2UgZWxlbWVudFttZXRob2RdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGVsZW1lbnRbbWV0aG9kXShhcmd1bWVudHMuLi4pXG5cdFx0XG5cdFx0cmV0dXJuIGlmIEByZXR1cm5SZXN1bHRzIHRoZW4gcmVzdWx0cyBlbHNlIEBcblxuXG5RdWlja0RvbS5iYXRjaCA9IChlbGVtZW50cywgcmV0dXJuUmVzdWx0cyktPlxuXHRpZiBub3QgSVMuaXRlcmFibGUoZWxlbWVudHMpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmF0Y2g6IGV4cGVjdGVkIGFuIGl0ZXJhYmxlLCBnb3QgI3tTdHJpbmcoZWxlbWVudHMpfVwiKVxuXHRlbHNlIGlmIG5vdCBlbGVtZW50cy5sZW5ndGhcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJCYXRjaDogZXhwZWN0ZWQgYSBub24tZW1wdHkgZWxlbWVudCBjb2xsZWN0aW9uXCIpXG5cblx0cmV0dXJuIG5ldyBRdWlja0JhdGNoKGVsZW1lbnRzLCByZXR1cm5SZXN1bHRzKVxuXG5cbiIsImltcG9ydCAnLi9leHRlbmRUZW1wbGF0ZSdcbmltcG9ydCAnLi9wYXJzZVRyZWUnXG5pbXBvcnQgJy4vc2NoZW1hJ1xuXG5jbGFzcyBRdWlja1RlbXBsYXRlXG5cdGNvbnN0cnVjdG9yOiAoY29uZmlnLCBpc1RyZWUpLT5cblx0XHRyZXR1cm4gY29uZmlnIGlmIElTLnRlbXBsYXRlKGNvbmZpZylcblx0XHRjb25maWcgPSBpZiBpc1RyZWUgdGhlbiBwYXJzZVRyZWUoY29uZmlnKSBlbHNlIGNvbmZpZ1xuXHRcdGV4dGVuZCBALCBjb25maWdcblx0XG5cdGV4dGVuZDogKG5ld1ZhbHVlcywgZ2xvYmFsT3B0cyktPlxuXHRcdG5ldyBRdWlja1RlbXBsYXRlIGV4dGVuZFRlbXBsYXRlKEAsIG5ld1ZhbHVlcywgZ2xvYmFsT3B0cylcblxuXHRzcGF3bjogKG5ld1ZhbHVlcywgZ2xvYmFsT3B0cywgZGF0YSktPlxuXHRcdGlmIG5ld1ZhbHVlcyBhbmQgbmV3VmFsdWVzLmRhdGFcblx0XHRcdGRhdGEgPSBuZXdWYWx1ZXMuZGF0YVxuXHRcdFx0bmV3VmFsdWVzID0gbnVsbCBpZiBPYmplY3Qua2V5cyhuZXdWYWx1ZXMpLmxlbmd0aCBpcyAxXG5cdFx0XG5cdFx0aWYgbmV3VmFsdWVzIG9yIGdsb2JhbE9wdHNcblx0XHRcdHtvcHRpb25zLCBjaGlsZHJlbiwgdHlwZX0gPSBleHRlbmRUZW1wbGF0ZShALCBuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpXG5cdFx0ZWxzZVxuXHRcdFx0e29wdGlvbnMsIGNoaWxkcmVuLCB0eXBlfSA9IEBcblx0XHRcdG9wdGlvbnMgPSBleHRlbmQuY2xvbmUob3B0aW9ucylcblxuXHRcdFxuXHRcdGVsZW1lbnQgPSBRdWlja0RvbS5jcmVhdGUoW3R5cGUsIG9wdGlvbnNdKVxuXHRcdFxuXHRcdGlmIGNoaWxkcmVuXG5cdFx0XHRjaGlsZERhdGEgPSBpZiBvcHRpb25zLnBhc3NEYXRhVG9DaGlsZHJlbiB0aGVuIGRhdGEgb3Igb3B0aW9ucy5kYXRhXG5cdFx0XHRmb3IgY2hpbGQgaW4gY2hpbGRyZW5cblx0XHRcdFx0ZWxlbWVudC5hcHBlbmQgY2hpbGQuc3Bhd24obnVsbCwgbnVsbCwgY2hpbGREYXRhKVxuXG5cdFx0ZWxlbWVudC5fcG9zdENyZWF0aW9uKGRhdGEpXG5cdFx0cmV0dXJuIGVsZW1lbnRcblxuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja1RlbXBsYXRlLm5hbWUgPz0gJ1F1aWNrVGVtcGxhdGUnXG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5IFF1aWNrVGVtcGxhdGU6OiwgJ2NoaWxkJywgZ2V0OiAoKS0+XG5cdEBfY2hpbGRSZWZzIG9yIF9nZXRDaGlsZFJlZnMoQCkgIyBzb3VyY2UgaW4gL3NyYy9wYXJ0cy9lbGVtZW50L3RyYXZlcnNpbmcuY29mZmVlXG5cblxuXG5cblxuXG5cblxuIiwibm90RGVlcEtleXMgPSBbJ3JlbGF0ZWRJbnN0YW5jZScsJ3JlbGF0ZWQnLCdkYXRhJ11cbm5vdEtleXMgPSBbJ2NoaWxkcmVuJywnX2NoaWxkUmVmcyddXG5cbmV4dGVuZFRlbXBsYXRlID0gKGN1cnJlbnRPcHRzLCBuZXdPcHRzLCBnbG9iYWxPcHRzKS0+XG5cdGlmIGdsb2JhbE9wdHMgdGhlbiBnbG9iYWxPcHRzVHJhbnNmb3JtID0gb3B0aW9uczogKG9wdHMpLT4gZXh0ZW5kKG9wdHMsIGdsb2JhbE9wdHMpXG5cdGlmIElTLmFycmF5KG5ld09wdHMpXG5cdFx0bmV3T3B0cyA9IHBhcnNlVHJlZShuZXdPcHRzLCBmYWxzZSlcblx0ZWxzZSBpZiBuZXdPcHRzIGFuZCBub3QgbWF0Y2hlc1NjaGVtYShuZXdPcHRzKVxuXHRcdG5ld09wdHMgPSBvcHRpb25zOm5ld09wdHNcblxuXG5cdG91dHB1dCA9IGV4dGVuZC5kZWVwLm51bGxEZWxldGVzLm5vdEtleXMobm90S2V5cykubm90RGVlcChub3REZWVwS2V5cykudHJhbnNmb3JtKGdsb2JhbE9wdHNUcmFuc2Zvcm0pLmNsb25lKGN1cnJlbnRPcHRzLCBuZXdPcHRzKVxuXHRjdXJyZW50Q2hpbGRyZW4gPSBjdXJyZW50T3B0cy5jaGlsZHJlblxuXHRuZXdDaGlsZHJlbiA9IG5ld09wdHM/LmNoaWxkcmVuIG9yIFtdXG5cdG91dHB1dC5jaGlsZHJlbiA9IFtdXG5cblx0IyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuXHRpZiBJUy5hcnJheShuZXdDaGlsZHJlbilcblx0XHRtYXhMZW5ndGggPSBNYXRoLm1heChjdXJyZW50Q2hpbGRyZW4ubGVuZ3RoLCBuZXdDaGlsZHJlbi5sZW5ndGgpXG5cdFx0aW5kZXggPSAtMVxuXHRcdHdoaWxlICsraW5kZXggaXNudCBtYXhMZW5ndGhcblx0XHRcdG5lZWRzVGVtcGxhdGVXcmFwID0gbm9DaGFuZ2VzID0gZmFsc2Vcblx0XHRcdGN1cnJlbnRDaGlsZCA9IGN1cnJlbnRDaGlsZHJlbltpbmRleF1cblx0XHRcdG5ld0NoaWxkID0gbmV3Q2hpbGRyZW5baW5kZXhdXG5cdFx0XHRuZXdDaGlsZFByb2Nlc3NlZCA9IHN3aXRjaFxuXHRcdFx0XHR3aGVuIElTLnRlbXBsYXRlKG5ld0NoaWxkKSB0aGVuIG5ld0NoaWxkXG5cdFx0XHRcdHdoZW4gSVMuYXJyYXkobmV3Q2hpbGQpIHRoZW4gbmVlZHNUZW1wbGF0ZVdyYXAgPSBwYXJzZVRyZWUobmV3Q2hpbGQpXG5cdFx0XHRcdHdoZW4gSVMuc3RyaW5nKG5ld0NoaWxkKSB0aGVuIG5lZWRzVGVtcGxhdGVXcmFwID0ge3R5cGU6J3RleHQnLCBvcHRpb25zOnt0ZXh0Om5ld0NoaWxkfX1cblx0XHRcdFx0d2hlbiBub3QgbmV3Q2hpbGQgYW5kIG5vdCBnbG9iYWxPcHRzIHRoZW4gbm9DaGFuZ2VzID0gdHJ1ZVxuXHRcdFx0XHRlbHNlIG5lZWRzVGVtcGxhdGVXcmFwID0gbmV3Q2hpbGQgb3IgdHJ1ZVxuXG5cblx0XHRcdGlmIG5vQ2hhbmdlc1xuXHRcdFx0XHRuZXdDaGlsZFByb2Nlc3NlZCA9IGN1cnJlbnRDaGlsZFxuXHRcdFx0XG5cdFx0XHRlbHNlIGlmIG5lZWRzVGVtcGxhdGVXcmFwXG5cdFx0XHRcdG5ld0NoaWxkUHJvY2Vzc2VkID0gXG5cdFx0XHRcdFx0aWYgY3VycmVudENoaWxkXG5cdFx0XHRcdFx0XHRjdXJyZW50Q2hpbGQuZXh0ZW5kKG5ld0NoaWxkUHJvY2Vzc2VkLCBnbG9iYWxPcHRzKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdG5ldyBRdWlja1RlbXBsYXRlKGV4dGVuZC5jbG9uZShzY2hlbWEsIG5ld0NoaWxkUHJvY2Vzc2VkKSlcblxuXHRcdFx0b3V0cHV0LmNoaWxkcmVuLnB1c2ggbmV3Q2hpbGRQcm9jZXNzZWRcblx0XG5cdFxuXHRlbHNlIGlmIElTLm9iamVjdChuZXdDaGlsZHJlbilcblx0XHRuZXdDaGlsZHJlbiA9IGV4dGVuZC5hbGxvd051bGwuY2xvbmUgbmV3Q2hpbGRyZW5cblx0XHRvdXRwdXQuY2hpbGRyZW4gPSBleHRlbmRCeVJlZihuZXdDaGlsZHJlbiwgY3VycmVudENoaWxkcmVuLCBnbG9iYWxPcHRzKVxuXHRcdHJlbWFpbmluZ05ld0NoaWxkcmVuID0gbmV3Q2hpbGRyZW5cblx0XHRcblx0XHRmb3IgcmVmLG5ld0NoaWxkIG9mIHJlbWFpbmluZ05ld0NoaWxkcmVuXG5cdFx0XHRuZXdDaGlsZFByb2Nlc3NlZCA9IGlmIElTLm9iamVjdFBsYWluKG5ld0NoaWxkKSBhbmQgbm90IElTLnRlbXBsYXRlKG5ld0NoaWxkKSB0aGVuIG5ld0NoaWxkIGVsc2UgcGFyc2VUcmVlKG5ld0NoaWxkKVxuXHRcdFx0b3V0cHV0LmNoaWxkcmVuLnB1c2ggbmV3IFF1aWNrVGVtcGxhdGUgbmV3Q2hpbGRQcm9jZXNzZWRcblx0XHRcdGRlbGV0ZSByZW1haW5pbmdOZXdDaGlsZHJlbltyZWZdXG5cblx0cmV0dXJuIG91dHB1dFxuXG5cblxuXG5leHRlbmRCeVJlZiA9IChuZXdDaGlsZHJlblJlZnMsIGN1cnJlbnRDaGlsZHJlbiwgZ2xvYmFsT3B0cyktPiBpZiBub3QgY3VycmVudENoaWxkcmVuLmxlbmd0aCB0aGVuIGN1cnJlbnRDaGlsZHJlbiBlbHNlXG5cdG91dHB1dCA9IFtdXG5cdFxuXHRmb3IgY3VycmVudENoaWxkIGluIGN1cnJlbnRDaGlsZHJlblxuXHRcdG5ld0NoaWxkID0gbmV3Q2hpbGRyZW5SZWZzW2N1cnJlbnRDaGlsZC5yZWZdXG5cdFx0aWYgbmV3Q2hpbGRcblx0XHRcdG5ld0NoaWxkUHJvY2Vzc2VkID0gY3VycmVudENoaWxkLmV4dGVuZChuZXdDaGlsZCwgZ2xvYmFsT3B0cylcblx0XHRcdGRlbGV0ZSBuZXdDaGlsZHJlblJlZnNbY3VycmVudENoaWxkLnJlZl1cblx0XHRcblx0XHRlbHNlIGlmIG5ld0NoaWxkIGlzIG51bGxcblx0XHRcdGRlbGV0ZSBuZXdDaGlsZHJlblJlZnNbY3VycmVudENoaWxkLnJlZl1cblx0XHRcdGNvbnRpbnVlXG5cdFx0XG5cdFx0ZWxzZVxuXHRcdFx0bmV3Q2hpbGRQcm9jZXNzZWQgPSBzd2l0Y2hcblx0XHRcdFx0d2hlbiBnbG9iYWxPcHRzIHRoZW4gY3VycmVudENoaWxkLmV4dGVuZChudWxsLCBnbG9iYWxPcHRzKVxuXHRcdFx0XHR3aGVuIE9iamVjdC5rZXlzKG5ld0NoaWxkcmVuUmVmcykubGVuZ3RoIHRoZW4gY3VycmVudENoaWxkLmV4dGVuZCgpXG5cdFx0XHRcdGVsc2UgY3VycmVudENoaWxkXG5cblx0XHRuZXdDaGlsZFByb2Nlc3NlZC5jaGlsZHJlbiA9IGV4dGVuZEJ5UmVmKG5ld0NoaWxkcmVuUmVmcywgbmV3Q2hpbGRQcm9jZXNzZWQuY2hpbGRyZW4pXG5cdFx0b3V0cHV0LnB1c2gobmV3Q2hpbGRQcm9jZXNzZWQpXG5cblx0cmV0dXJuIG91dHB1dFxuXG5cblxuXG4iLCJwYXJzZVRyZWUgPSAodHJlZSwgcGFyc2VDaGlsZHJlbiktPiBzd2l0Y2hcblx0d2hlbiBJUy5hcnJheSh0cmVlKVxuXHRcdG91dHB1dCA9IHt9XG5cblx0XHRpZiBub3QgSVMuc3RyaW5nKHRyZWVbMF0pXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCIje3BhcnNlRXJyb3JQcmVmaXh9IHN0cmluZyBmb3IgJ3R5cGUnLCBnb3QgJyN7U3RyaW5nKHRyZWVbMF0pfSdcIlxuXHRcdGVsc2Vcblx0XHRcdG91dHB1dC50eXBlID0gdHJlZVswXVxuXHRcdFxuXHRcdGlmIHRyZWUubGVuZ3RoID4gMSBhbmQgbm90IElTLm9iamVjdCh0cmVlWzFdKSBhbmQgdHJlZVsxXSBpc250IG51bGxcblx0XHRcdHRocm93IG5ldyBFcnJvciBcIiN7cGFyc2VFcnJvclByZWZpeH0gb2JqZWN0IGZvciAnb3B0aW9ucycsIGdvdCAnI3tTdHJpbmcodHJlZVsxXSl9J1wiXG5cdFx0ZWxzZVxuXHRcdFx0b3V0cHV0Lm9wdGlvbnMgPSBpZiB0cmVlWzFdIHRoZW4gZXh0ZW5kLmRlZXAuY2xvbmUodHJlZVsxXSkgZWxzZSBzY2hlbWEub3B0aW9uc1xuXHRcdFx0b3V0cHV0LnJlZiA9IHRyZWVbMV0uaWQgb3IgdHJlZVsxXS5yZWYgaWYgdHJlZVsxXVxuXG5cdFx0b3V0cHV0LmNoaWxkcmVuID0gdHJlZS5zbGljZSgyKVxuXHRcdGlmIHBhcnNlQ2hpbGRyZW4gaXMgZmFsc2Vcblx0XHRcdG91dHB1dC5jaGlsZHJlbiA9IHRyZWVbMl0gaWYgdHJlZS5sZW5ndGggaXMgMyBhbmQgSVMub2JqZWN0UGxhaW4odHJlZVsyXSkgYW5kIG5vdCBJUy50ZW1wbGF0ZSh0cmVlWzJdKVxuXHRcdGVsc2Vcblx0XHRcdG91dHB1dC5jaGlsZHJlbiA9IG91dHB1dC5jaGlsZHJlbi5tYXAoUXVpY2tEb20udGVtcGxhdGUpXG5cdFx0cmV0dXJuIG91dHB1dFxuXG5cblx0d2hlbiBJUy5zdHJpbmcodHJlZSkgb3IgSVMuZG9tVGV4dCh0cmVlKVxuXHRcdHR5cGU6J3RleHQnLCBvcHRpb25zOnt0ZXh0OiB0cmVlLnRleHRDb250ZW50IG9yIHRyZWV9LCBjaGlsZHJlbjpzY2hlbWEuY2hpbGRyZW5cblxuXHR3aGVuIElTLmRvbUVsKHRyZWUpXG5cdFx0dHlwZTogdHJlZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG5cdFx0cmVmOiB0cmVlLmlkXG5cdFx0b3B0aW9uczogZXh0ZW5kLmNsb25lLmtleXMoYWxsb3dlZFRlbXBsYXRlT3B0aW9ucykodHJlZSlcblx0XHRjaGlsZHJlbjogc2NoZW1hLmNoaWxkcmVuLm1hcC5jYWxsKHRyZWUuY2hpbGROb2RlcywgUXVpY2tEb20udGVtcGxhdGUpXG5cblx0d2hlbiBJUy5xdWlja0RvbUVsKHRyZWUpXG5cdFx0dHlwZTogdHJlZS50eXBlXG5cdFx0cmVmOiB0cmVlLnJlZlxuXHRcdG9wdGlvbnM6IGV4dGVuZC5jbG9uZS5kZWVwLm5vdEtleXMoWydyZWxhdGVkSW5zdGFuY2UnLCAncmVsYXRlZCddKSh0cmVlLm9wdGlvbnMpXG5cdFx0Y2hpbGRyZW46IHRyZWUuY2hpbGRyZW4ubWFwKFF1aWNrRG9tLnRlbXBsYXRlKVxuXG5cdHdoZW4gSVMudGVtcGxhdGUodHJlZSlcblx0XHRyZXR1cm4gdHJlZVxuXG5cdGVsc2Vcblx0XHR0aHJvdyBuZXcgRXJyb3IgXCIje3BhcnNlRXJyb3JQcmVmaXh9IChhcnJheSB8fCBzdHJpbmcgfHwgZG9tRWwgfHwgcXVpY2tEb21FbCB8fCB0ZW1wbGF0ZSksIGdvdCAje1N0cmluZyh0cmVlKX1cIlxuXG5cblxuXG5wYXJzZUVycm9yUHJlZml4ID0gJ1RlbXBsYXRlIFBhcnNlIEVycm9yOiBleHBlY3RlZCciLCJzY2hlbWEgPSBcblx0dHlwZTogJ2Rpdidcblx0cmVmOiB1bmRlZmluZWRcblx0b3B0aW9uczoge31cblx0Y2hpbGRyZW46IFtdXG5cblxubWF0Y2hlc1NjaGVtYSA9IChvYmplY3QpLT5cblx0dHlwZW9mIG9iamVjdC50eXBlIGlzbnQgJ3VuZGVmaW5lZCcgb3Jcblx0dHlwZW9mIG9iamVjdC5yZWYgaXNudCAndW5kZWZpbmVkJyBvclxuXHR0eXBlb2Ygb2JqZWN0Lm9wdGlvbnMgaXNudCAndW5kZWZpbmVkJyBvclxuXHR0eXBlb2Ygb2JqZWN0LmNoaWxkcmVuIGlzbnQgJ3VuZGVmaW5lZCdcblxuXG5cbiIsInNob3J0Y3V0cyA9IFtcblx0J2xpbms6YSdcblx0J2FuY2hvcjphJ1xuXHQnYSdcblx0J3RleHQnXG5cdCdkaXYnXG5cdCdzcGFuJ1xuXHQnaDEnXG5cdCdoMidcblx0J2gzJ1xuXHQnaDQnXG5cdCdoNSdcblx0J2g2J1xuXHQnaGVhZGVyJ1xuXHQnZm9vdGVyJ1xuXHQnc2VjdGlvbidcblx0J2J1dHRvbidcblx0J2JyJ1xuXHQndWwnXG5cdCdvbCdcblx0J2xpJ1xuXHQnZmllbGRzZXQnXG5cdCdpbnB1dCdcblx0J3RleHRhcmVhJ1xuXHQnc2VsZWN0J1xuXHQnb3B0aW9uJ1xuXHQnZm9ybSdcblx0J2ZyYW1lJ1xuXHQnaHInXG5cdCdpZnJhbWUnXG5cdCdpbWcnXG5cdCdwaWN0dXJlJ1xuXHQnbWFpbidcblx0J25hdidcblx0J21ldGEnXG5cdCdvYmplY3QnXG5cdCdwcmUnXG5cdCdzdHlsZSdcblx0J3RhYmxlJ1xuXHQndGJvZHknXG5cdCd0aCdcblx0J3RyJ1xuXHQndGQnXG5cdCd0Zm9vdCdcblx0IyAndGVtcGxhdGUnXG5cdCd2aWRlbydcbl1cblxuXG5mb3Igc2hvcnRjdXQgaW4gc2hvcnRjdXRzIHRoZW4gZG8gKHNob3J0Y3V0KS0+XG5cdHByb3AgPSB0eXBlID0gc2hvcnRjdXRcblx0aWYgaGVscGVycy5pbmNsdWRlcyhzaG9ydGN1dCwgJzonKVxuXHRcdHNwbGl0ID0gc2hvcnRjdXQuc3BsaXQoJzonKVxuXHRcdHByb3AgPSBzcGxpdFswXVxuXHRcdHR5cGUgPSBzcGxpdFsxXVxuXG5cdFF1aWNrRG9tW3Byb3BdID0gKCktPiBRdWlja0RvbSh0eXBlLCBhcmd1bWVudHMuLi4pXG4iLCJ7XG4gIFwiX2Zyb21cIjogXCJxdWlja2RvbUBsYXRlc3RcIixcbiAgXCJfaWRcIjogXCJxdWlja2RvbUAxLjAuOTBcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1KTkh1Wml6RVFUaExuajF2bEFKeVU5TmYvbXcrVmw4Q04rdU5Sc3dBZ2FJWS80eEdxVGZnQWswQURsbzByWGkyN2UreXJLSWE5dmdYY29jUWZqbUtwQT09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3F1aWNrZG9tXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJ0YWdcIixcbiAgICBcInJlZ2lzdHJ5XCI6IHRydWUsXG4gICAgXCJyYXdcIjogXCJxdWlja2RvbUBsYXRlc3RcIixcbiAgICBcIm5hbWVcIjogXCJxdWlja2RvbVwiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJxdWlja2RvbVwiLFxuICAgIFwicmF3U3BlY1wiOiBcImxhdGVzdFwiLFxuICAgIFwic2F2ZVNwZWNcIjogbnVsbCxcbiAgICBcImZldGNoU3BlY1wiOiBcImxhdGVzdFwiXG4gIH0sXG4gIFwiX3JlcXVpcmVkQnlcIjogW1xuICAgIFwiI1VTRVJcIixcbiAgICBcIi9cIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3F1aWNrZG9tLy0vcXVpY2tkb20tMS4wLjkwLnRnelwiLFxuICBcIl9zaGFzdW1cIjogXCI4NGQyZGQzNDVkYjk2N2I5ZmJhZmNiNzAzNWNjNDNhODMyMmZiNDg4XCIsXG4gIFwiX3NwZWNcIjogXCJxdWlja2RvbUBsYXRlc3RcIixcbiAgXCJfd2hlcmVcIjogXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJkYW5pZWxrYWxlblwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9xdWlja2RvbS5kZWJ1Zy5qc1wiLFxuICAgIFwiLi9kaXN0L3F1aWNrZG9tLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tkb20vaXNzdWVzXCJcbiAgfSxcbiAgXCJidW5kbGVEZXBlbmRlbmNpZXNcIjogZmFsc2UsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBkYW5pZWxrYWxlbi9pc1wiOiBcIl4yLjAuMFwiLFxuICAgIFwicXVpY2tjc3NcIjogXCJeMS4zLjRcIixcbiAgICBcInNtYXJ0LWV4dGVuZFwiOiBcIl4xLjcuM1wiXG4gIH0sXG4gIFwiZGVwcmVjYXRlZFwiOiBmYWxzZSxcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkZhc3QgJiBsaWdodCBET00gZWxlbWVudCBtYW5hZ2VtZW50IHN1cHBvcnRpbmcganF1ZXJ5LWxpa2UgbWV0aG9kcywgdGVtcGxhdGVzLCAmIHN0YXRlLWJhc2VkIHN0eWxpbmdcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy41LjBcIixcbiAgICBcImNoYWxrXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJjb2ZmZWUtc2NyaXB0XCI6IFwiXjEuMTIuNlwiLFxuICAgIFwiZXhlY2FcIjogXCJeMC43LjBcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4zXCIsXG4gICAgXCJwcm9taXNlLWJyZWFrXCI6IFwiXjAuMS4yXCIsXG4gICAgXCJzZW12ZXJcIjogXCJeNS4zLjBcIlxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2RvbSNyZWFkbWVcIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwibWFpblwiOiBcImRpc3QvcXVpY2tkb20uanNcIixcbiAgXCJuYW1lXCI6IFwicXVpY2tkb21cIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tkb20uZ2l0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLi8uY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwibnBtIHJ1biB0ZXN0OnRyYXZpc1wiLFxuICAgIFwidGVzdFwiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6YnJvd3NlclwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBFbGVjdHJvbiAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmNocm9tZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgQ2hyb21lIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6ZmlyZWZveFwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBGaXJlZm94IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6a2FybWFcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmxvY2FsXCI6IFwib3BlbiB0ZXN0L3Rlc3RydW5uZXIuaHRtbFwiLFxuICAgIFwidGVzdDptaW5pZmllZFwiOiBcIm1pbmlmaWVkPTEgbnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnRyYXZpc1wiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zICYmIG5wbSBydW4gdGVzdDptaW5pZmllZCAtc1wiLFxuICAgIFwid2F0Y2hcIjogXCJjYWtlIC1kIHdhdGNoXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgW1xuICAgICAgICBcImJhYmVsaWZ5XCIsXG4gICAgICAgIHtcbiAgICAgICAgICBcInByZXNldHNcIjogW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBcIkBiYWJlbC9wcmVzZXQtZW52XCIsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm1vZHVsZXNcIjogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjAuOTBcIlxufVxuIiwiSVMgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9pcydcbklTID0gSVMuY3JlYXRlKCduYXRpdmVzJywnZG9tJylcbklTLmxvYWRcblx0ZmllbGQ6ICh0YXJnZXQpLT4gdGFyZ2V0IGFuZCB0YXJnZXQgaW5zdGFuY2VvZiByZXF1aXJlKCcuL2ZpZWxkJylcblx0cmVnZXg6ICh0YXJnZXQpLT4gdGFyZ2V0IGluc3RhbmNlb2YgUmVnRXhwXG5cdG9iamVjdGFibGU6ICh0YXJnZXQpLT4gSVMub2JqZWN0KHRhcmdldCkgb3IgSVMuZnVuY3Rpb24odGFyZ2V0KVxuXG5tb2R1bGUuZXhwb3J0cyA9IElTIiwiZXh0ZW5kID0gcmVxdWlyZSAnLi9leHRlbmQnXG5cbm5vcm1hbGl6ZUtleXMgPSAoa2V5cyktPiBpZiBrZXlzXG5cdG91dHB1dCA9IHt9XG5cdGlmIHR5cGVvZiBrZXlzIGlzbnQgJ29iamVjdCdcblx0XHRvdXRwdXRba2V5c10gPSB0cnVlXG5cdGVsc2Vcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoa2V5cykgaWYgbm90IEFycmF5LmlzQXJyYXkoa2V5cylcblx0XHRvdXRwdXRba2V5XSA9IHRydWUgZm9yIGtleSBpbiBrZXlzXG5cblx0cmV0dXJuIG91dHB1dFxuXG5cbm5ld0J1aWxkZXIgPSAoaXNCYXNlKS0+XG5cdGJ1aWxkZXIgPSAodGFyZ2V0KS0+XG5cdFx0RVhQQU5EX0FSR1VNRU5UUyhzb3VyY2VzKVxuXHRcdGlmIGJ1aWxkZXIub3B0aW9ucy50YXJnZXRcblx0XHRcdHRoZVRhcmdldCA9IGJ1aWxkZXIub3B0aW9ucy50YXJnZXRcblx0XHRlbHNlXG5cdFx0XHR0aGVUYXJnZXQgPSB0YXJnZXRcblx0XHRcdHNvdXJjZXMuc2hpZnQoKVxuXHRcdFxuXHRcdGV4dGVuZChidWlsZGVyLm9wdGlvbnMsIHRoZVRhcmdldCwgc291cmNlcylcblx0XG5cdGJ1aWxkZXIuaXNCYXNlID0gdHJ1ZSBpZiBpc0Jhc2Vcblx0YnVpbGRlci5vcHRpb25zID0ge31cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoYnVpbGRlciwgbW9kaWZpZXJzKVxuXHRyZXR1cm4gYnVpbGRlclxuXG5cbm1vZGlmaWVycyA9IFxuXHQnZGVlcCc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5kZWVwID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J293bic6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5vd24gPSB0cnVlXG5cdFx0cmV0dXJuIF9cblxuXHQnYWxsb3dOdWxsJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLmFsbG93TnVsbCA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdudWxsRGVsZXRlcyc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5udWxsRGVsZXRlcyA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdjb25jYXQnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMuY29uY2F0ID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J2Nsb25lJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLnRhcmdldCA9IHt9XG5cdFx0cmV0dXJuIF9cblxuXHQnbm90RGVlcCc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLm5vdERlZXAgPSBub3JtYWxpemVLZXlzKGtleXMpXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cdCdkZWVwT25seSc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLmRlZXBPbmx5ID0gbm9ybWFsaXplS2V5cyhrZXlzKVx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXHQna2V5cyc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLmtleXMgPSBub3JtYWxpemVLZXlzKGtleXMpXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cdCdub3RLZXlzJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuIChrZXlzKS0+XG5cdFx0XHRfLm9wdGlvbnMubm90S2V5cyA9IG5vcm1hbGl6ZUtleXMoa2V5cylcdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblx0J3RyYW5zZm9ybSc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAodHJhbnNmb3JtKS0+XG5cdFx0XHRpZiB0eXBlb2YgdHJhbnNmb3JtIGlzICdmdW5jdGlvbidcblx0XHRcdFx0Xy5vcHRpb25zLmdsb2JhbFRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuXHRcdFx0ZWxzZSBpZiB0cmFuc2Zvcm0gYW5kIHR5cGVvZiB0cmFuc2Zvcm0gaXMgJ29iamVjdCdcblx0XHRcdFx0Xy5vcHRpb25zLnRyYW5zZm9ybXMgPSB0cmFuc2Zvcm1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXG5cdCdmaWx0ZXInOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKGZpbHRlciktPlxuXHRcdFx0aWYgdHlwZW9mIGZpbHRlciBpcyAnZnVuY3Rpb24nXG5cdFx0XHRcdF8ub3B0aW9ucy5nbG9iYWxGaWx0ZXIgPSBmaWx0ZXJcblx0XHRcdGVsc2UgaWYgZmlsdGVyIGFuZCB0eXBlb2YgZmlsdGVyIGlzICdvYmplY3QnXG5cdFx0XHRcdF8ub3B0aW9ucy5maWx0ZXJzID0gZmlsdGVyXG5cdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBuZXdCdWlsZGVyKHRydWUpXG5leHBvcnRzLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nIiwie1xuICBcIl9hcmdzXCI6IFtcbiAgICBbXG4gICAgICBcInNtYXJ0LWV4dGVuZEAxLjcuM1wiLFxuICAgICAgXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCJcbiAgICBdXG4gIF0sXG4gIFwiX2Zyb21cIjogXCJzbWFydC1leHRlbmRAMS43LjNcIixcbiAgXCJfaWRcIjogXCJzbWFydC1leHRlbmRAMS43LjNcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1QVkVFVllERHp5eEtBMEdORkxjV1k2b0pTa1FLZGMxdzcxOGVRcEVIY051VFNXWXhESzM1R3poc0doTWtVVThsQklnU0VEYnQ1eDVwNDZwUnozQXViQT09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3NtYXJ0LWV4dGVuZFwiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwidmVyc2lvblwiLFxuICAgIFwicmVnaXN0cnlcIjogdHJ1ZSxcbiAgICBcInJhd1wiOiBcInNtYXJ0LWV4dGVuZEAxLjcuM1wiLFxuICAgIFwibmFtZVwiOiBcInNtYXJ0LWV4dGVuZFwiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJzbWFydC1leHRlbmRcIixcbiAgICBcInJhd1NwZWNcIjogXCIxLjcuM1wiLFxuICAgIFwic2F2ZVNwZWNcIjogbnVsbCxcbiAgICBcImZldGNoU3BlY1wiOiBcIjEuNy4zXCJcbiAgfSxcbiAgXCJfcmVxdWlyZWRCeVwiOiBbXG4gICAgXCIvXCIsXG4gICAgXCIvcXVpY2tkb21cIixcbiAgICBcIi9zaW1wbHl3YXRjaFwiXG4gIF0sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvc21hcnQtZXh0ZW5kLy0vc21hcnQtZXh0ZW5kLTEuNy4zLnRnelwiLFxuICBcIl9zcGVjXCI6IFwiMS43LjNcIixcbiAgXCJfd2hlcmVcIjogXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja2ZpZWxkXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJkYW5pZWxrYWxlblwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9zbWFydC1leHRlbmQuZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9zbWFydC1leHRlbmQuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zbWFydC1leHRlbmQvaXNzdWVzXCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiZmFsYWZlbFwiOiBcIl4yLjEuMFwiXG4gIH0sXG4gIFwiZGVzY3JpcHRpb25cIjogXCJNZXJnZS9leHRlbmQgb2JqZWN0cyAoc2hhbGxvdy9kZWVwKSB3aXRoIGdsb2JhbC9pbmRpdmlkdWFsIGZpbHRlcnMgYW5kIG1vcmUgZmVhdHVyZXNcIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmFkZ2UtZ2VuXCI6IFwiXjEuMC4yXCIsXG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjQuN1wiLFxuICAgIFwiY2hhaVwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY29mZmVlLXJlZ2lzdGVyXCI6IFwiXjAuMS4wXCIsXG4gICAgXCJjb2ZmZWVpZnktY2FjaGVkXCI6IFwiXjIuMS4xXCIsXG4gICAgXCJleHRlbmRcIjogXCJeMy4wLjFcIixcbiAgICBcImdvb2dsZS1jbG9zdXJlLWNvbXBpbGVyLWpzXCI6IFwiXjIwMTcwNjI2LjAuMFwiLFxuICAgIFwibW9jaGFcIjogXCJeMy4yLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuMC1zMjFcIixcbiAgICBcInNpbXBseXdhdGNoXCI6IFwiXjMuMC4wLWwyXCIsXG4gICAgXCJ1Z2xpZnktanNcIjogXCJeMy4wLjI0XCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zbWFydC1leHRlbmQjcmVhZG1lXCIsXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwiZXh0ZW5kXCIsXG4gICAgXCJjbG9uZVwiLFxuICAgIFwiZmlsdGVyXCIsXG4gICAgXCJzZWxlY3RpdmVcIixcbiAgICBcIm1lcmdlXCIsXG4gICAgXCJhc3NpZ25cIixcbiAgICBcInByb3BlcnRpZXNcIlxuICBdLFxuICBcImxpY2Vuc2VcIjogXCJJU0NcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9zbWFydC1leHRlbmQuanNcIixcbiAgXCJtb2NoYV9vcHRzXCI6IFwiLXUgdGRkIC0tY29tcGlsZXJzIGNvZmZlZTpjb2ZmZWUtcmVnaXN0ZXIgLS1zbG93IDEwMDAgLS10aW1lb3V0IDUwMDBcIixcbiAgXCJuYW1lXCI6IFwic21hcnQtZXh0ZW5kXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3NtYXJ0LWV4dGVuZC5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJta2RpciAtcCBkaXN0LzsgbnBtIHJ1biBidWlsZDpkZWJ1ZyAmJiBucG0gcnVuIGJ1aWxkOnJlbGVhc2VcIixcbiAgICBcImJ1aWxkOmRlYnVnXCI6IFwic2ltcGx5aW1wb3J0IGJ1bmRsZSBzcmMvaW5kZXguY29mZmVlIC1kIC0tdGFyZ2V0IG5vZGUgLS11bWQgc21hcnQtZXh0ZW5kID4gZGlzdC9zbWFydC1leHRlbmQuZGVidWcuanNcIixcbiAgICBcImJ1aWxkOnJlbGVhc2VcIjogXCJzaW1wbHlpbXBvcnQgYnVuZGxlIHNyYy9pbmRleC5jb2ZmZWUgLS10YXJnZXQgbm9kZSAtLXVtZCBzbWFydC1leHRlbmQgPiBkaXN0L3NtYXJ0LWV4dGVuZC5qc1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJucG0gcnVuIGNvdmVyYWdlOnJ1biAmJiBucG0gcnVuIGNvdmVyYWdlOmJhZGdlXCIsXG4gICAgXCJjb3ZlcmFnZTpiYWRnZVwiOiBcImJhZGdlLWdlbiAtZCAuY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiZm9yQ292ZXJhZ2U9dHJ1ZSBpc3RhbmJ1bCBjb3ZlciAtLWRpciBjb3ZlcmFnZSBub2RlX21vZHVsZXMvbW9jaGEvYmluL19tb2NoYSAtLSAkbnBtX3BhY2thZ2VfbW9jaGFfb3B0c1wiLFxuICAgIFwicG9zdHB1Ymxpc2hcIjogXCJnaXQgcHVzaFwiLFxuICAgIFwicG9zdHZlcnNpb25cIjogXCJucG0gcnVuIGJ1aWxkICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJDST0xIG5wbSBydW4gdGVzdFwiLFxuICAgIFwidGVzdFwiOiBcIm1vY2hhICRucG1fcGFja2FnZV9tb2NoYV9vcHRzXCIsXG4gICAgXCJ3YXRjaFwiOiBcInNpbXBseXdhdGNoIC1nICdzcmMvKicgLXggJ25wbSBydW4gYnVpbGQ6ZGVidWcgLXMnXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiY29mZmVlaWZ5LWNhY2hlZFwiLFxuICAgICAgXCIuLy5jb25maWcvdHJhbnNmb3Jtcy9tYWNyb3NcIlxuICAgIF0sXG4gICAgXCJmaW5hbFRyYW5zZm9ybVwiOiBbXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc3VwZXJcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1yZW5hbWVcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zaW1wbGVcIlxuICAgIF1cbiAgfSxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS43LjNcIlxufVxuIiwiQ1NTID0gaW1wb3J0ICdxdWlja2Nzcydcbm1vZHVsZS5leHBvcnRzID0gKCktPlxuICAgIENTUy5hbmltYXRpb24gJ2NoZWNrbWFya0FuaW1hdGVTdWNjZXNzVGlwJyxcbiAgICAgICAgJzAlLCA1NCUnOiAge3dpZHRoOjAsIGxlZnQ6MCwgdG9wOjN9XG4gICAgICAgICc3MCUnOiAgICAgIHt3aWR0aDoxNCwgbGVmdDotMiwgdG9wOjh9XG4gICAgICAgICc4NCUnOiAgICAgIHt3aWR0aDo1LCBsZWZ0OjUsIHRvcDoxMH1cbiAgICAgICAgJzEwMCUnOiAgICAge3dpZHRoOjgsIGxlZnQ6MywgdG9wOjEwfVxuXG5cbiAgICBDU1MuYW5pbWF0aW9uICdjaGVja21hcmtBbmltYXRlU3VjY2Vzc0xvbmcnLFxuICAgICAgICAnMCUsIDY1JSc6ICB7d2lkdGg6MCwgcmlnaHQ6MTIsIHRvcDoxMn1cbiAgICAgICAgJzg0JSc6ICAgICAge3dpZHRoOjE0LCByaWdodDowLCB0b3A6N31cbiAgICAgICAgJzEwMCUnOiAgICAge3dpZHRoOjEyLCByaWdodDoyLCB0b3A6OH1cblxuXG4gICAgQ1NTLmFuaW1hdGlvbiAnY2hlY2ttYXJrQW5pbWF0ZUVycm9yJyxcbiAgICAgICAgJzAlLCA2NSUnOiAgdHJhbnNmb3JtOiAnc2NhbGUoMC40KScsIG9wYWNpdHk6IDBcbiAgICAgICAgJzg0JSc6ICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4xNSknXG4gICAgICAgICcxMDAlJzogICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJ1xuXG5cbiAgICBDU1MuYW5pbWF0aW9uICdjaGVja21hcmtSb3RhdGVQbGFjZWhvbGRlcicsXG4gICAgICAgICcwJSwgNSUnOiAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuICAgICAgICAnMTIlLCAxMDAlJzp0cmFuc2Zvcm06ICdyb3RhdGUoLTQwNWRlZyknXG5cblxuICAgIENTUy5hbmltYXRpb24gJ2ZpZWxkRXJyb3JTaGFrZScsXG4gICAgICAgICcwJSwgNTAlJzogIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwcHgpJ1xuICAgICAgICAnMjUlLCA3NSUnOiB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDEwcHgpJ1xuICAgICAgICAnMTAwJSc6ICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCknXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9ICgpLT5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBbJ19nZXRWYWx1ZScsICdfc2V0VmFsdWUnLCAnX3ZhbGlkYXRlJ10iLCJoZWxwZXJzID0gaW1wb3J0ICcuLi9oZWxwZXJzJ1xuSVMgPSBpbXBvcnQgJy4uL2NoZWNrcydcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuZmFzdGRvbSA9IGltcG9ydCAnZmFzdGRvbSdcblNpbXBseUJpbmQgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kJ1xuQ29uZGl0aW9uID0gaW1wb3J0ICcuLi9jb21wb25lbnRzL2NvbmRpdGlvbidcbmN1cnJlbnRJRCA9IDBcblxuY2xhc3MgRmllbGRcblx0QGluc3RhbmNlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0QHNoYWxsb3dTZXR0aW5ncyA9IFsndGVtcGxhdGVzJywgJ2ZpZWxkSW5zdGFuY2VzJywgJ3ZhbHVlJywgJ2RlZmF1bHRWYWx1ZSddXG5cdEB0cmFuc2Zvcm1TZXR0aW5ncyA9IGltcG9ydCAnLi90cmFuc2Zvcm1TZXR0aW5ncydcblx0Y29yZVZhbHVlUHJvcDogJ192YWx1ZSdcblx0Z2xvYmFsRGVmYXVsdHM6IGltcG9ydCAnLi9nbG9iYWxEZWZhdWx0cydcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyBGaWVsZDo6LFxuXHRcdCdyZW1vdmVMaXN0ZW5lcic6IGdldDogKCktPiBAb2ZmXG5cdFx0J2Vscyc6IGdldDogKCktPiBAZWwuY2hpbGRcblx0XHQndmFsdWVSYXcnOiBnZXQ6ICgpLT4gQF92YWx1ZVxuXHRcdCd2YWx1ZSc6XG5cdFx0XHRnZXQ6ICgpLT4gaWYgQHNldHRpbmdzLmdldHRlciB0aGVuIEBzZXR0aW5ncy5nZXR0ZXIoQF9nZXRWYWx1ZSgpKSBlbHNlIEBfZ2V0VmFsdWUoKVxuXHRcdFx0c2V0OiAodmFsdWUpLT4gQF9zZXRWYWx1ZShpZiBAc2V0dGluZ3Muc2V0dGVyIHRoZW4gQHNldHRpbmdzLnNldHRlcih2YWx1ZSkgZWxzZSB2YWx1ZSlcblx0XG5cdGNvbnN0cnVjdG9yOiAoc2V0dGluZ3MsIEBidWlsZGVyLCBzZXR0aW5nT3ZlcnJpZGVzLCB0ZW1wbGF0ZU92ZXJyaWRlcyktPlxuXHRcdGlmIHNldHRpbmdPdmVycmlkZXNcblx0XHRcdEBnbG9iYWxEZWZhdWx0cyA9IHNldHRpbmdPdmVycmlkZXMuZ2xvYmFsRGVmYXVsdHMgaWYgc2V0dGluZ092ZXJyaWRlcy5nbG9iYWxEZWZhdWx0c1xuXHRcdFx0QGRlZmF1bHRzID0gc2V0dGluZ092ZXJyaWRlc1tzZXR0aW5ncy50eXBlXSBpZiBzZXR0aW5nT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdXG5cdFx0aWYgdGVtcGxhdGVPdmVycmlkZXMgYW5kIHRlbXBsYXRlT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdXG5cdFx0XHRAdGVtcGxhdGVzID0gdGVtcGxhdGVPdmVycmlkZXNbc2V0dGluZ3MudHlwZV1cblx0XHRcdEB0ZW1wbGF0ZSA9IHRlbXBsYXRlT3ZlcnJpZGVzW3NldHRpbmdzLnR5cGVdLmRlZmF1bHRcblxuXHRcdHNoYWxsb3dTZXR0aW5ncyA9IGlmIEBzaGFsbG93U2V0dGluZ3MgdGhlbiBGaWVsZC5zaGFsbG93U2V0dGluZ3MuY29uY2F0KEBzaGFsbG93U2V0dGluZ3MpIGVsc2UgRmllbGQuc2hhbGxvd1NldHRpbmdzXG5cdFx0dHJhbnNmb3JtU2V0dGluZ3MgPSBpZiBAdHJhbnNmb3JtU2V0dGluZ3MgdGhlbiBGaWVsZC50cmFuc2Zvcm1TZXR0aW5ncy5jb25jYXQoQHRyYW5zZm9ybVNldHRpbmdzKSBlbHNlIEZpZWxkLnRyYW5zZm9ybVNldHRpbmdzXG5cblx0XHRAc2V0dGluZ3MgPSBleHRlbmQuZGVlcC5jbG9uZS5ub3REZWVwKHNoYWxsb3dTZXR0aW5ncykudHJhbnNmb3JtKHRyYW5zZm9ybVNldHRpbmdzKShAZ2xvYmFsRGVmYXVsdHMsIEBkZWZhdWx0cywgc2V0dGluZ3MpXG5cdFx0QElEID0gQHNldHRpbmdzLklEIG9yIGN1cnJlbnRJRCsrKycnXG5cdFx0QHR5cGUgPSBzZXR0aW5ncy50eXBlXG5cdFx0QG5hbWUgPSBzZXR0aW5ncy5uYW1lXG5cdFx0QGFsbEZpZWxkcyA9IEBzZXR0aW5ncy5maWVsZEluc3RhbmNlcyBvciBGaWVsZC5pbnN0YW5jZXNcblx0XHRAX3ZhbHVlID0gbnVsbFxuXHRcdEBfZXZlbnRDYWxsYmFja3MgPSB7fVxuXHRcdEBzdGF0ZSA9XG5cdFx0XHR2YWxpZDogdHJ1ZVxuXHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0Zm9jdXNlZDogZmFsc2Vcblx0XHRcdGhvdmVyZWQ6IGZhbHNlXG5cdFx0XHRmaWxsZWQ6IGZhbHNlXG5cdFx0XHRpbnRlcmFjdGVkOiBmYWxzZVxuXHRcdFx0aXNNb2JpbGU6IGZhbHNlXG5cdFx0XHRkaXNhYmxlZDogQHNldHRpbmdzLmRpc2FibGVkXG5cdFx0XHRtYXJnaW46IEBzZXR0aW5ncy5tYXJnaW5cblx0XHRcdHBhZGRpbmc6IEBzZXR0aW5ncy5wYWRkaW5nXG5cdFx0XHR3aWR0aDogQHNldHRpbmdzLndpZHRoXG5cdFx0XHRzaG93TGFiZWw6IEBzZXR0aW5ncy5sYWJlbFxuXHRcdFx0bGFiZWw6IEBzZXR0aW5ncy5sYWJlbFxuXHRcdFx0c2hvd0hlbHA6IEBzZXR0aW5ncy5oZWxwXG5cdFx0XHRoZWxwOiBAc2V0dGluZ3MuaGVscFxuXHRcdFx0c2hvd0Vycm9yOiBmYWxzZVxuXHRcdFx0ZXJyb3I6IEBzZXR0aW5ncy5lcnJvclxuXG5cdFx0aWYgSVMuZGVmaW5lZChAc2V0dGluZ3MucGxhY2Vob2xkZXIpXG5cdFx0XHRAc3RhdGUucGxhY2Vob2xkZXIgPSBAc2V0dGluZ3MucGxhY2Vob2xkZXJcblxuXHRcdGlmIElTLm51bWJlcihAc2V0dGluZ3Mud2lkdGgpIGFuZCBAc2V0dGluZ3Mud2lkdGggPD0gMVxuXHRcdFx0QHN0YXRlLndpZHRoID0gXCIje0BzZXR0aW5ncy53aWR0aCoxMDB9JVwiXG5cblx0XHRpZiBAc2V0dGluZ3MuY29uZGl0aW9ucz8ubGVuZ3RoXG5cdFx0XHRAc3RhdGUudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRDb25kaXRpb24uaW5pdChALCBAc2V0dGluZ3MuY29uZGl0aW9ucylcblxuXHRcdGNvbnNvbGU/Lndhcm4oXCJEdXBsaWNhdGUgZmllbGQgSURzIGZvdW5kOiAnI3tASUR9J1wiKSBpZiBAYWxsRmllbGRzW0BJRF1cblx0XHRAYWxsRmllbGRzW0BJRF0gPSBAXG5cblxuXHRfY29uc3RydWN0b3JFbmQ6ICgpLT5cblx0XHRAZWwuY2hpbGRmIy5maWVsZC5vbiAnaW5zZXJ0ZWQnLCAoKT0+IEBlbWl0KCdpbnNlcnRlZCcpXG5cdFx0QGVsLnJhdy5pZCA9IEBJRCBpZiBAc2V0dGluZ3MuSURcblxuXHRcdEBzZXR0aW5ncy5kZWZhdWx0VmFsdWUgPz0gQHNldHRpbmdzLnZhbHVlIGlmIEBzZXR0aW5ncy52YWx1ZT9cblx0XHRpZiBAc2V0dGluZ3MuZGVmYXVsdFZhbHVlP1xuXHRcdFx0QHZhbHVlID0gaWYgQHNldHRpbmdzLm11bHRpcGxlIHRoZW4gW10uY29uY2F0KEBzZXR0aW5ncy5kZWZhdWx0VmFsdWUpIGVsc2UgQHNldHRpbmdzLmRlZmF1bHRWYWx1ZVxuXG5cdFx0U2ltcGx5QmluZCgnc2hvd0Vycm9yJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ2hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudHJhbnNmb3JtIChzaG93KT0+XG5cdFx0XHRcdGlmIHNob3cgYW5kIEBzdGF0ZS5lcnJvciBhbmQgSVMuc3RyaW5nKEBzdGF0ZS5lcnJvcilcblx0XHRcdFx0XHRAc3RhdGUuZXJyb3Jcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBzZXR0aW5ncy5oZWxwIG9yIEBzdGF0ZS5oZWxwXG5cblx0XHRTaW1wbHlCaW5kKCdlcnJvcicsIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCdoZWxwJykub2YoQHN0YXRlKVxuXHRcdFx0LmNvbmRpdGlvbiAoZXJyb3IpPT4gZXJyb3IgYW5kIEBzdGF0ZS5zaG93RXJyb3JcblxuXHRcdFNpbXBseUJpbmQoJ2hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ2h0bWwnKS5vZihAZWwuY2hpbGQuaGVscClcblx0XHRcdC5hbmQudG8oJ3Nob3dIZWxwJykub2YoQHN0YXRlKVxuXG5cdFx0U2ltcGx5QmluZCgnbGFiZWwnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8oJ3RleHQnKS5vZihAZWwuY2hpbGQubGFiZWwpXG5cdFx0XHQuYW5kLnRvKCdzaG93TGFiZWwnKS5vZihAc3RhdGUpXG5cblx0XHRTaW1wbHlCaW5kKCdtYXJnaW4nKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gQGVsLnN0eWxlLmJpbmQoQGVsLCAnbWFyZ2luJylcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdwYWRkaW5nJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvIEBlbC5zdHlsZS5iaW5kKEBlbCwgJ3BhZGRpbmcnKVxuXG5cdFx0U2ltcGx5QmluZCgnc2hvd0hlbHAnKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gKHNob3csIHByZXZTaG93KT0+IGlmIEBzZXR0aW5ncy5tYWtlUm9vbUZvckhlbHBcblx0XHRcdFx0Y2hhbmdlQW1vdW50ID0gaWYgISFzaG93IGlzICEhcHJldlNob3cgdGhlbiAwIGVsc2UgaWYgc2hvdyB0aGVuIDI1IGVsc2UgaWYgcHJldlNob3cgdGhlbiAtMjVcblx0XHRcdFx0QHN0YXRlLm1hcmdpbiA9IGhlbHBlcnMudXBkYXRlU2hvcnRoYW5kVmFsdWUoQHN0YXRlLm1hcmdpbiwgJ2JvdHRvbScsIGNoYW5nZUFtb3VudCkgaWYgY2hhbmdlQW1vdW50XG5cblx0XHRTaW1wbHlCaW5kKCdmb2N1c2VkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAc3RhdGUpLnRvIChmb2N1c2VkKT0+XG5cdFx0XHRAZW1pdChpZiBmb2N1c2VkIHRoZW4gJ2ZvY3VzJyBlbHNlICdibHVyJylcblxuXHRcdGlmIEBzZXR0aW5ncy5tb2JpbGVXaWR0aFxuXHRcdFx0U2ltcGx5QmluZCAoKT0+XG5cdFx0XHRcdGZhc3Rkb20ubWVhc3VyZSAoKT0+IEBzdGF0ZS5pc01vYmlsZSA9IHdpbmRvdy5pbm5lcldpZHRoIDw9IEBzZXR0aW5ncy5tb2JpbGVUaHJlc2hvbGRcblx0XHRcdC51cGRhdGVPbignZXZlbnQ6cmVzaXplJykub2Yod2luZG93KVxuXG5cdFx0aWYgSVMub2JqZWN0KEBzZXR0aW5ncy5ldmVudHMpXG5cdFx0XHRAb24odGFyZ2V0LGhhbmRsZXIpIGZvciB0YXJnZXQsaGFuZGxlciBvZiBAc2V0dGluZ3MuZXZlbnRzXG5cblx0XHRAZW1pdCAnY3JlYXRlZCcsIEBcblx0XHRyZXR1cm4gQGVsLnJhdy5fcXVpY2tGaWVsZCA9IEBcblxuXG5cdF9mb3JtYXRXaWR0aDogKHdpZHRoKS0+XG5cdFx0d2lkdGggPSBpZiBAc3RhdGUuaXNNb2JpbGUgdGhlbiAoQHNldHRpbmdzLm1vYmlsZVdpZHRoIG9yIHdpZHRoKSBlbHNlIHdpZHRoXG5cdFx0aWYgQHNldHRpbmdzLmRpc3RhbmNlIGFuZCB3aWR0aCBpc250ICcxMDAlJ1xuXHRcdFx0d2lkdGggPSBcImNhbGMoI3t3aWR0aH0gLSAje0BzZXR0aW5ncy5kaXN0YW5jZX1weClcIlxuXHRcdHJldHVybiB3aWR0aFxuXG5cblxuXG5cblxuXG5cblx0YXBwZW5kVG86ICh0YXJnZXQpLT5cblx0XHRAZWwuYXBwZW5kVG8odGFyZ2V0KTsgXHRcdHJldHVybiBAXG5cblx0cHJlcGVuZFRvOiAodGFyZ2V0KS0+XG5cdFx0QGVsLnByZXBlbmRUbyh0YXJnZXQpOyBcdFx0cmV0dXJuIEBcblxuXHRpbnNlcnRBZnRlcjogKHRhcmdldCktPlxuXHRcdEBlbC5pbnNlcnRBZnRlcih0YXJnZXQpOyBcdHJldHVybiBAXG5cblx0aW5zZXJ0QmVmb3JlOiAodGFyZ2V0KS0+XG5cdFx0QGVsLmluc2VydEJlZm9yZSh0YXJnZXQpOyBcdHJldHVybiBAXG5cblx0ZGV0YWNoOiAodGFyZ2V0KS0+XG5cdFx0QGVsLmRldGFjaCh0YXJnZXQpOyBcdFx0cmV0dXJuIEBcblxuXHRyZW1vdmU6ICgpLT5cblx0XHRAZWwucmVtb3ZlKClcblx0XHRyZXR1cm4gQGRlc3Ryb3koZmFsc2UpXG5cblx0ZGVzdHJveTogKHJlbW92ZUZyb21ET009dHJ1ZSktPlxuXHRcdFNpbXBseUJpbmQudW5CaW5kQWxsKEApXG5cdFx0U2ltcGx5QmluZC51bkJpbmRBbGwoQHN0YXRlKVxuXHRcdFNpbXBseUJpbmQudW5CaW5kQWxsKEBlbClcblx0XHRTaW1wbHlCaW5kLnVuQmluZEFsbChjaGlsZCkgZm9yIGNoaWxkIGluIEBlbC5jaGlsZFxuXHRcdEBlbC5yZW1vdmUoKSBpZiByZW1vdmVGcm9tRE9NXG5cdFx0QF9kZXN0cm95KCkgaWYgQF9kZXN0cm95XG5cdFx0ZGVsZXRlIEBhbGxGaWVsZHNbQElEXVxuXHRcdHJldHVybiB0cnVlXG5cblx0b246IChldmVudE5hbWVzLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSktPlxuXHRcdEBlbC5vbi5jYWxsKEBlbCwgZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUsIHRydWUpXG5cdFx0cmV0dXJuIEBcblxuXHRvbmNlOiAoZXZlbnROYW1lcywgY2FsbGJhY2ssIHVzZUNhcHR1cmUpLT5cblx0XHRAb24gZXZlbnROYW1lcywgKCk9PlxuXHRcdFx0QG9mZihldmVudE5hbWVzLCBjYWxsYmFjaylcblx0XHRcdGNhbGxiYWNrLmFwcGx5KEBlbCwgYXJndW1lbnRzKVxuXHRcdCwgdXNlQ2FwdHVyZVxuXG5cdG9mZjogKCktPlxuXHRcdEBlbC5vZmYuYXBwbHkoQGVsLCBhcmd1bWVudHMpXG5cdFx0cmV0dXJuIEBcblxuXHRlbWl0OiAoKS0+XG5cdFx0QGVsLmVtaXRQcml2YXRlLmFwcGx5KEBlbCwgYXJndW1lbnRzKVxuXHRcdHJldHVybiBAXG5cblx0dmFsaWRhdGU6IChwcm92aWRlZFZhbHVlPUBbQGNvcmVWYWx1ZVByb3BdLCB0ZXN0VW5yZXF1aXJlZCwgcmVwb3J0KS0+XG5cdFx0aXNWYWxpZCA9IHN3aXRjaFxuXHRcdFx0d2hlbiBAc2V0dGluZ3MudmFsaWRhdG9yIHRoZW4gQHNldHRpbmdzLnZhbGlkYXRvcihwcm92aWRlZFZhbHVlKVxuXHRcdFx0XG5cdFx0XHR3aGVuIG5vdCBAc2V0dGluZ3MucmVxdWlyZWQgYW5kIG5vdCB0ZXN0VW5yZXF1aXJlZCB0aGVuIHRydWVcblxuXHRcdFx0d2hlbiBAX3ZhbGlkYXRlKHByb3ZpZGVkVmFsdWUsIHRlc3RVbnJlcXVpcmVkLCByZXBvcnQpIGlzIGZhbHNlIHRoZW4gZmFsc2VcblxuXHRcdFx0d2hlbiBAc2V0dGluZ3MucmVxdWlyZWQgdGhlbiBzd2l0Y2hcblx0XHRcdFx0d2hlbiBAc2V0dGluZ3MubXVsdGlwbGUgdGhlbiAhIXByb3ZpZGVkVmFsdWU/Lmxlbmd0aFxuXHRcdFx0XHR3aGVuIHR5cGVvZiBwcm92aWRlZFZhbHVlIGlzICdzdHJpbmcnIHRoZW4gISFwcm92aWRlZFZhbHVlXG5cdFx0XHRcdGVsc2UgcHJvdmlkZWRWYWx1ZT9cblx0XHRcdFxuXHRcdFx0ZWxzZSB0cnVlXG5cblx0XHRAc3RhdGUuc2hvd0Vycm9yID0gZmFsc2UgaWYgaXNWYWxpZCBhbmQgQHNldHRpbmdzLmNsZWFyRXJyb3JPblZhbGlkXG5cdFx0cmV0dXJuIGlzVmFsaWRcblxuXHR2YWxpZGF0ZUNvbmRpdGlvbnM6IChjb25kaXRpb25zKS0+XG5cdFx0aWYgY29uZGl0aW9uc1xuXHRcdFx0dG9nZ2xlVmlzaWJpbGl0eSA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0Y29uZGl0aW9ucyA9IEBjb25kaXRpb25zXG5cdFx0XHR0b2dnbGVWaXNpYmlsaXR5ID0gdHJ1ZVxuXHRcdFxuXHRcdHBhc3NlZENvbmRpdGlvbnMgPSBDb25kaXRpb24udmFsaWRhdGUoY29uZGl0aW9ucylcblx0XHRpZiB0b2dnbGVWaXNpYmlsaXR5XG5cdFx0XHRyZXR1cm4gQHN0YXRlLnZpc2libGUgPSBwYXNzZWRDb25kaXRpb25zXG5cdFx0ZWxzZSBcblx0XHRcdHJldHVybiBwYXNzZWRDb25kaXRpb25zXG5cblx0dmFsaWRhdGVBbmRSZXBvcnQ6IChwcm92aWRlZFZhbHVlLCB0ZXN0VW5yZXF1aXJlZCktPlxuXHRcdGlzVmFsaWQgPSBAdmFsaWRhdGUocHJvdmlkZWRWYWx1ZSwgdGVzdFVucmVxdWlyZWQsIHRydWUpXG5cdFx0QHN0YXRlLnNob3dFcnJvciA9ICFpc1ZhbGlkXG5cdFx0cmV0dXJuIGlzVmFsaWRcblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRmllbGQiLCInY29uZGl0aW9ucyc6IChjb25kaXRpb25zKS0+XG5cdGlmIElTLm9iamVjdFBsYWluKGNvbmRpdGlvbnMpXG5cdFx0e3RhcmdldCwgdmFsdWV9IGZvciB0YXJnZXQsdmFsdWUgb2YgY29uZGl0aW9uc1xuXHRlbHNlIGlmIElTLmFycmF5KGNvbmRpdGlvbnMpXG5cdFx0Y29uZGl0aW9ucy5tYXAgKGl0ZW0pLT4gaWYgSVMuc3RyaW5nKGl0ZW0pIHRoZW4ge3RhcmdldDppdGVtfSBlbHNlIGl0ZW1cblxuJ2Nob2ljZXMnOiAoY2hvaWNlcyktPlxuXHRpZiBJUy5vYmplY3RQbGFpbihjaG9pY2VzKVxuXHRcdHtsYWJlbCx2YWx1ZX0gZm9yIGxhYmVsLHZhbHVlIG9mIGNob2ljZXNcblx0ZWxzZSBpZiBJUy5hcnJheShjaG9pY2VzKVxuXHRcdGNob2ljZXMubWFwIChpdGVtKS0+IGlmIG5vdCBJUy5vYmplY3RQbGFpbihpdGVtKSB0aGVuIHtsYWJlbDppdGVtLCB2YWx1ZTppdGVtfSBlbHNlIGl0ZW1cblxuJ3ZhbGlkV2hlblJlZ2V4JzogKHJlZ2V4KS0+XG5cdGlmIElTLnN0cmluZyhyZWdleCkgdGhlbiBuZXcgUmVnRXhwKHJlZ2V4KSBlbHNlIHJlZ2V4IiwiRHJvcGRvd24gPSBpbXBvcnQgJy4uLy4uL2NvbXBvbmVudHMvZHJvcGRvd24nXG5NYXNrID0gaW1wb3J0ICcuLi8uLi9jb21wb25lbnRzL21hc2snXG5SRUdFWCA9IGltcG9ydCAnLi4vLi4vY29uc3RhbnRzL3JlZ2V4J1xuS0VZQ09ERVMgPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9rZXlDb2RlcydcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5JUyA9IGltcG9ydCAnLi4vLi4vY2hlY2tzJ1xuRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5pbXBvcnQgdGVtcGxhdGUsKiBhcyB0ZW1wbGF0ZXMgZnJvbSAnLi90ZW1wbGF0ZSdcbmltcG9ydCAqIGFzIGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMnXG5cbmNsYXNzIFRleHRGaWVsZCBleHRlbmRzIGltcG9ydCAnLi4vJ1xuXHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0dGVtcGxhdGVzOiB0ZW1wbGF0ZXNcblx0ZGVmYXVsdHM6IGRlZmF1bHRzXG5cblx0Y29uc3RydWN0b3I6ICgpLT5cblx0XHRzdXBlcihhcmd1bWVudHMuLi4pXG5cdFx0QF92YWx1ZSA/PSAnJ1xuXHRcdEBzdGF0ZS50eXBpbmcgPSBmYWxzZVxuXHRcdEBjdXJzb3IgPSBwcmV2OjAsIGN1cnJlbnQ6MFxuXG5cdFx0aWYgbm90IEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleFxuXHRcdFx0aWYgQHNldHRpbmdzLmtleWJvYXJkIGlzICdlbWFpbCcgYW5kIEBzZXR0aW5ncy5yZXF1aXJlZFxuXHRcdFx0XHRAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXggPSBSRUdFWC5lbWFpbFxuXHRcdFx0ZWxzZSBpZiBAc2V0dGluZ3MubWFzayBpcyAnTkFNRScgb3IgQHNldHRpbmdzLm1hc2sucGF0dGVybiBpcyAnTkFNRSdcblx0XHRcdFx0QHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4ID0gL15bYS16QS1aXXsyfS9cblx0XHRcdGVsc2UgaWYgQHNldHRpbmdzLm1hc2sgaXMgJ0ZVTExOQU1FJyBvciBAc2V0dGluZ3MubWFzay5wYXR0ZXJuIGlzICdGVUxMTkFNRSdcblx0XHRcdFx0QHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4ID0gL15bYS16QS1aXStcXHMrW2EtekEtWl0rL1xuXG5cdFx0aWYgbm90IEBzZXR0aW5ncy5tYXNrLnBhdHRlcm5cblx0XHRcdGlmIElTLnN0cmluZyhAc2V0dGluZ3MubWFzaylcblx0XHRcdFx0QHNldHRpbmdzLm1hc2sgPSBleHRlbmQuZGVlcC5jbG9uZShAZGVmYXVsdHMubWFzaywgcGF0dGVybjpAc2V0dGluZ3MubWFzaylcblxuXHRcdFx0ZWxzZSBpZiBJUy5vYmplY3QoQHNldHRpbmdzLm1hc2spXG5cdFx0XHRcdEBzZXR0aW5ncy5tYXNrLnBhdHRlcm4gPSBzd2l0Y2ggQHNldHRpbmdzLmtleWJvYXJkXG5cdFx0XHRcdFx0d2hlbiAnZGF0ZScgdGhlbiAnREFURSdcblx0XHRcdFx0XHR3aGVuICdudW1iZXInIHRoZW4gJ05VTUJFUidcblx0XHRcdFx0XHR3aGVuICdwaG9uZScsJ3RlbCcgdGhlbiAnUEhPTkUnXG5cdFx0XHRcdFx0d2hlbiAnZW1haWwnIHRoZW4gJ0VNQUlMJ1xuXHRcdFx0XG5cdFx0QG1hc2sgPSBuZXcgTWFzayhALCBAc2V0dGluZ3MubWFzaykgaWYgQHNldHRpbmdzLm1hc2sucGF0dGVyblxuXHRcdEBfY3JlYXRlRWxlbWVudHMoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3MoKVxuXHRcdEBfY29uc3RydWN0b3JFbmQoKVxuXG5cblx0X2dldFZhbHVlOiAoKS0+XG5cdFx0aWYgQGRyb3Bkb3duIGFuZCBAc2VsZWN0ZWQgYW5kIEBfdmFsdWUgaXMgQHNlbGVjdGVkLmxhYmVsXG5cdFx0XHRyZXR1cm4gQHNlbGVjdGVkLnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIEBfdmFsdWVcblxuXHRfc2V0VmFsdWU6IChuZXdWYWx1ZSktPiBpZiBJUy5zdHJpbmcobmV3VmFsdWUpIG9yIElTLm51bWJlcihuZXdWYWx1ZSlcblx0XHRuZXdWYWx1ZSA9IFN0cmluZyhuZXdWYWx1ZSlcblx0XHRAX3ZhbHVlID0gaWYgQG1hc2sgdGhlbiBAbWFzay5zZXRWYWx1ZShuZXdWYWx1ZSkgZWxzZSBuZXdWYWx1ZVxuXG5cdF9yZWNhbGNEaXNwbGF5OiAoKS0+XG5cdFx0QF92YWx1ZSA9IEBfdmFsdWUgaWYgQHNldHRpbmdzLmF1dG9XaWR0aFxuXG5cblx0X2NyZWF0ZUVsZW1lbnRzOiAoKS0+XG5cdFx0Z2xvYmFsT3B0cyA9IHtyZWxhdGVkSW5zdGFuY2U6QH1cblx0XHRAZWwgPSBAdGVtcGxhdGUuc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5kZWZhdWx0LCBnbG9iYWxPcHRzKVxuXG5cdFx0aWYgQHNldHRpbmdzLmNob2ljZXNcblx0XHRcdEBkcm9wZG93biA9IG5ldyBEcm9wZG93bihAc2V0dGluZ3MuY2hvaWNlcywgQClcblx0XHRcdEBkcm9wZG93bi5hcHBlbmRUbyhAZWwuY2hpbGQuaW5uZXJ3cmFwKVxuXG5cdFx0aWYgQHNldHRpbmdzLmljb25cblx0XHRcdEB0ZW1wbGF0ZXMuaWNvbi5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmljb24sIGdsb2JhbE9wdHMpLmFwcGVuZChAc2V0dGluZ3MuaWNvbikuaW5zZXJ0QmVmb3JlKEBlbC5jaGlsZC5pbnB1dClcblxuXHRcdGlmIEBzZXR0aW5ncy5jaGVja21hcmtcblx0XHRcdEB0ZW1wbGF0ZXMuY2hlY2ttYXJrLnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuY2hlY2ttYXJrLCBnbG9iYWxPcHRzKS5pbnNlcnRBZnRlcihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XG5cdFx0QGVsLmNoaWxkLmlucHV0LnByb3AgJ3R5cGUnLCBzd2l0Y2ggQHNldHRpbmdzLmtleWJvYXJkXG5cdFx0XHR3aGVuICdudW1iZXInLCd0ZWwnLCdwaG9uZScgdGhlbiAndGVsJ1xuXHRcdFx0d2hlbiAncGFzc3dvcmQnIHRoZW4gJ3Bhc3N3b3JkJ1xuXHRcdFx0d2hlbiAndXJsJyB0aGVuICd1cmwnXG5cdFx0XHQjIHdoZW4gJ2VtYWlsJyB0aGVuICdlbWFpbCdcblx0XHRcdGVsc2UgJ3RleHQnXG5cblx0XHRAZWwuc3RhdGUgJ2hhc0xhYmVsJywgQHNldHRpbmdzLmxhYmVsXG5cdFx0QGVsLmNoaWxkLmlubmVyd3JhcC5yYXcuX3F1aWNrRmllbGQgPSBAZWwuY2hpbGQuaW5wdXQucmF3Ll9xdWlja0ZpZWxkID0gQFxuXHRcdHJldHVybiBAZWwuY2hpbGRmXG5cblxuXHRfYXR0YWNoQmluZGluZ3M6ICgpLT5cblx0XHRAX2F0dGFjaEJpbmRpbmdzX2VsU3RhdGUoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3NfZGlzcGxheSgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc19kaXNwbGF5X2F1dG9XaWR0aCgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc192YWx1ZSgpXG5cdFx0QF9hdHRhY2hCaW5kaW5nc19hdXRvY29tcGxldGUoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3Nfc3RhdGVUcmlnZ2VycygpXG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfZWxTdGF0ZTogKCktPlxuXHRcdFNpbXBseUJpbmQoJ3Zpc2libGUnKS5vZihAc3RhdGUpLnRvIFx0KHZpc2libGUpPT4gQGVsLnN0YXRlICd2aXNpYmxlJywgdmlzaWJsZVxuXHRcdFNpbXBseUJpbmQoJ2hvdmVyZWQnKS5vZihAc3RhdGUpLnRvIFx0KGhvdmVyZWQpPT4gQGVsLnN0YXRlICdob3ZlcicsIGhvdmVyZWRcblx0XHRTaW1wbHlCaW5kKCdmb2N1c2VkJykub2YoQHN0YXRlKS50byBcdChmb2N1c2VkKT0+IEBlbC5zdGF0ZSAnZm9jdXMnLCBmb2N1c2VkXG5cdFx0U2ltcGx5QmluZCgnZmlsbGVkJykub2YoQHN0YXRlKS50byBcdFx0KGZpbGxlZCk9PiBAZWwuc3RhdGUgJ2ZpbGxlZCcsIGZpbGxlZFxuXHRcdFNpbXBseUJpbmQoJ2Rpc2FibGVkJykub2YoQHN0YXRlKS50byBcdChkaXNhYmxlZCk9PiBAZWwuc3RhdGUgJ2Rpc2FibGVkJywgZGlzYWJsZWRcblx0XHRTaW1wbHlCaW5kKCdzaG93TGFiZWwnKS5vZihAc3RhdGUpLnRvIFx0KHNob3dMYWJlbCk9PiBAZWwuc3RhdGUgJ3Nob3dMYWJlbCcsIHNob3dMYWJlbFxuXHRcdFNpbXBseUJpbmQoJ3Nob3dFcnJvcicpLm9mKEBzdGF0ZSkudG8gXHQoc2hvd0Vycm9yKT0+IEBlbC5zdGF0ZSAnc2hvd0Vycm9yJywgc2hvd0Vycm9yXG5cdFx0U2ltcGx5QmluZCgnc2hvd0hlbHAnKS5vZihAc3RhdGUpLnRvIFx0KHNob3dIZWxwKT0+IEBlbC5zdGF0ZSAnc2hvd0hlbHAnLCBzaG93SGVscFxuXHRcdFNpbXBseUJpbmQoJ3ZhbGlkJykub2YoQHN0YXRlKS50byAodmFsaWQpPT5cblx0XHRcdEBlbC5zdGF0ZSAndmFsaWQnLCB2YWxpZFxuXHRcdFx0QGVsLnN0YXRlICdpbnZhbGlkJywgIXZhbGlkXG5cdFx0XG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfZGlzcGxheTogKCktPlxuXHRcdFNpbXBseUJpbmQoJ3BsYWNlaG9sZGVyJykub2YoQHN0YXRlKVxuXHRcdFx0LnRvKCd0ZXh0Jykub2YoQGVsLmNoaWxkLnBsYWNlaG9sZGVyKVxuXHRcdFx0XHQudHJhbnNmb3JtIChwbGFjZWhvbGRlcik9PiBzd2l0Y2hcblx0XHRcdFx0XHR3aGVuIHBsYWNlaG9sZGVyIGlzIHRydWUgYW5kIEBzZXR0aW5ncy5sYWJlbCB0aGVuIEBzZXR0aW5ncy5sYWJlbFxuXHRcdFx0XHRcdHdoZW4gSVMuc3RyaW5nKHBsYWNlaG9sZGVyKSB0aGVuIHBsYWNlaG9sZGVyXG5cdFx0XHRcdFx0ZWxzZSAnJ1xuXG5cdFx0U2ltcGx5QmluZCgnZGlzYWJsZWQnLCB1cGRhdGVPbkJpbmQ6QHN0YXRlLmRpc2FibGVkKS5vZihAc3RhdGUpXG5cdFx0XHQudG8gKGRpc2FibGVkLCBwcmV2KT0+IGlmIEBzZXR0aW5ncy5jaGVja21hcmtcblx0XHRcdFx0aWYgZGlzYWJsZWQgb3IgKG5vdCBkaXNhYmxlZCBhbmQgcHJldj8pIHRoZW4gc2V0VGltZW91dCAoKT0+XG5cdFx0XHRcdFx0QGVsLmNoaWxkLmNoZWNrbWFya19tYXNrMS5yZWNhbGNTdHlsZSgpXG5cdFx0XHRcdFx0QGVsLmNoaWxkLmNoZWNrbWFya19tYXNrMi5yZWNhbGNTdHlsZSgpXG5cdFx0XHRcdFx0QGVsLmNoaWxkLmNoZWNrbWFya19wYXRjaC5yZWNhbGNTdHlsZSgpXG5cdFx0XHRcdFx0IyBAZWwuY2hpbGQuY2hlY2ttYXJrLnJlY2FsY1N0eWxlKHRydWUpXG5cdFx0XG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfZGlzcGxheV9hdXRvV2lkdGg6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCd3aWR0aCcsIHVwZGF0ZUV2ZW5JZlNhbWU6dHJ1ZSkub2YoQHN0YXRlKVxuXHRcdFx0LnRvICh3aWR0aCk9PiAoaWYgQHNldHRpbmdzLmF1dG9XaWR0aCB0aGVuIEBlbC5jaGlsZC5pbnB1dCBlbHNlIEBlbCkuc3R5bGUoJ3dpZHRoJywgd2lkdGgpXG5cdFx0XHQudHJhbnNmb3JtIEBfZm9ybWF0V2lkdGguYmluZChAKVxuXHRcdFx0LnVwZGF0ZU9uKCdpc01vYmlsZScpLm9mKEBzdGF0ZSlcblxuXHRcdGlmIEBzZXR0aW5ncy5hdXRvV2lkdGhcblx0XHRcdFNpbXBseUJpbmQoJ192YWx1ZScsIHVwZGF0ZUV2ZW5JZlNhbWU6dHJ1ZSwgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0XHQudG8oJ3dpZHRoJykub2YoQHN0YXRlKVxuXHRcdFx0XHRcdC50cmFuc2Zvcm0gKCk9PiBcIiN7QF9nZXRJbnB1dEF1dG9XaWR0aCgpfXB4XCJcblx0XHRcdFx0XHQudXBkYXRlT24oJ2V2ZW50Omluc2VydGVkJykub2YoQGVsKVxuXHRcdFx0XHRcdC51cGRhdGVPbigndmlzaWJsZScpLm9mKEBzdGF0ZSlcblx0XHRcblx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc192YWx1ZTogKCktPlxuXHRcdGlucHV0ID0gQGVsLmNoaWxkLmlucHV0LnJhd1xuXHRcdFxuXHRcdHJlc2V0SW5wdXQgPSAoKT0+XG5cdFx0XHRmaWxsZWQgPSAhQG1hc2suaXNFbXB0eSgpXG5cdFx0XHRpZiBub3QgZmlsbGVkXG5cdFx0XHRcdEBzZWxlY3Rpb24oQG1hc2suY3Vyc29yID0gMClcblx0XHRcdFx0QF92YWx1ZSA9ICcnXG5cdFx0XHRcdEBzdGF0ZS5maWxsZWQgPSBmYWxzZVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gZmlsbGVkXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6aW5wdXQnKS5vZihpbnB1dCkudG8gKCk9PlxuXHRcdFx0QHZhbHVlID0gaW5wdXQudmFsdWVcblx0XHRcdEBzZWxlY3Rpb24oQG1hc2suY3Vyc29yKSBpZiBAbWFza1xuXHRcdFx0QGVtaXQoJ2lucHV0JywgQHZhbHVlKVxuXG5cdFx0U2ltcGx5QmluZCgnX3ZhbHVlJywgdXBkYXRlRXZlbklmU2FtZTohIUBtYXNrKS5vZihAKVxuXHRcdFx0LnRvKCd2YWx1ZScpLm9mKGlucHV0KVx0XHRcblx0XHRcdC5hbmQudG8gKHZhbHVlKT0+XG5cdFx0XHRcdGZpbGxlZCA9ICEhdmFsdWVcblx0XHRcdFx0ZmlsbGVkID0gcmVzZXRJbnB1dCgpIGlmIGZpbGxlZCBhbmQgQG1hc2sgYW5kIEBtYXNrLmd1aWRlIGFuZCAoIUBzdGF0ZS5mb2N1c2VkIG9yIEBtYXNrLmN1cnNvciBpcyAwKVxuXHRcdFx0XHRAc3RhdGUuZmlsbGVkID0gZmlsbGVkXG5cdFx0XHRcdEBzdGF0ZS5pbnRlcmFjdGVkID0gdHJ1ZSBpZiBmaWxsZWRcblx0XHRcdFx0QHN0YXRlLnZhbGlkID0gQHZhbGlkYXRlKHVuZGVmaW5lZCwgdHJ1ZSlcblx0XHRcdFx0QGVtaXQoJ2lucHV0JywgQHZhbHVlKSB1bmxlc3MgQHN0YXRlLmZvY3VzZWRcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmtleWRvd24nKS5vZihAZWwuY2hpbGQuaW5wdXQpLnRvIChldmVudCk9PlxuXHRcdFx0QGVtaXQoJ3N1Ym1pdCcpIGlmIGV2ZW50LmtleUNvZGUgaXMgS0VZQ09ERVMuZW50ZXJcblx0XHRcdEBlbWl0KFwia2V5LSN7ZXZlbnQua2V5Q29kZX1cIilcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmJsdXInKS5vZihAZWwuY2hpbGQuaW5wdXQpLnRvKHJlc2V0SW5wdXQpIGlmIEBtYXNrIGFuZCBAbWFzay5ndWlkZVxuXHRcdHJldHVyblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2F1dG9jb21wbGV0ZTogKCktPiBpZiBAZHJvcGRvd25cblx0XHRTaW1wbHlCaW5kLmRlZmF1bHRPcHRpb25zLnVwZGF0ZU9uQmluZCA9IGZhbHNlXG5cblx0XHRTaW1wbHlCaW5kKCd0eXBpbmcnLCB1cGRhdGVFdmVuSWZTYW1lOnRydWUpLm9mKEBzdGF0ZSkudG8gKGlzVHlwaW5nKT0+XG5cdFx0XHRpZiBpc1R5cGluZ1xuXHRcdFx0XHRyZXR1cm4gaWYgbm90IEBfdmFsdWVcblx0XHRcdFx0aWYgQGRyb3Bkb3duLmlzT3BlblxuXHRcdFx0XHRcdEBkcm9wZG93bi5saXN0LmNhbGNEaXNwbGF5KClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBkcm9wZG93bi5pc09wZW4gPSB0cnVlXG5cdFx0XHRcdFx0U2ltcGx5QmluZCgnZXZlbnQ6Y2xpY2snKS5vZihkb2N1bWVudClcblx0XHRcdFx0XHRcdC5vbmNlLnRvICgpPT4gQGRyb3Bkb3duLmlzT3BlbiA9IGZhbHNlXG5cdFx0XHRcdFx0XHQuY29uZGl0aW9uIChldmVudCk9PiBub3QgRE9NKGV2ZW50LnRhcmdldCkucGFyZW50TWF0Y2hpbmcgKHBhcmVudCk9PiBwYXJlbnQgaXMgQGVsLmNoaWxkLmlubmVyd3JhcFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAZHJvcGRvd24uaXNPcGVuID0gZmFsc2VcblxuXHRcdFNpbXBseUJpbmQoJ192YWx1ZScpLm9mKEApLnRvICh2YWx1ZSk9PlxuXHRcdFx0Zm9yIGNob2ljZSBpbiBAZHJvcGRvd24uY2hvaWNlc1xuXHRcdFx0XHRzaG91bGRCZVZpc2libGUgPSBpZiBub3QgdmFsdWUgdGhlbiB0cnVlIGVsc2UgaGVscGVycy5mdXp6eU1hdGNoKHZhbHVlLCBjaG9pY2UubGFiZWwpXG5cdFx0XHRcdGNob2ljZS52aXNpYmxlID0gc2hvdWxkQmVWaXNpYmxlIGlmIGNob2ljZS52aXNpYmxlIGlzbnQgc2hvdWxkQmVWaXNpYmxlXG5cblx0XHRcdGlmIEBkcm9wZG93bi5pc09wZW4gYW5kIG5vdCB2YWx1ZVxuXHRcdFx0XHRAZHJvcGRvd24uaXNPcGVuID0gZmFsc2Vcblx0XHRcdHJldHVyblxuXG5cblx0XHRAZHJvcGRvd24ub25TZWxlY3RlZCAoc2VsZWN0ZWRDaG9pY2UpPT5cblx0XHRcdEBzZWxlY3RlZCA9IHNlbGVjdGVkQ2hvaWNlXG5cdFx0XHRAdmFsdWUgPSBzZWxlY3RlZENob2ljZS5sYWJlbFxuXHRcdFx0QGRyb3Bkb3duLmlzT3BlbiA9IGZhbHNlXG5cdFx0XHRAc2VsZWN0aW9uKEBlbC5jaGlsZC5pbnB1dC5yYXcudmFsdWUubGVuZ3RoKVxuXHRcdFxuXG5cdFx0U2ltcGx5QmluZC5kZWZhdWx0T3B0aW9ucy51cGRhdGVPbkJpbmQgPSB0cnVlXG5cdFx0cmV0dXJuXG5cblxuXHRfYXR0YWNoQmluZGluZ3Nfc3RhdGVUcmlnZ2VyczogKCktPlxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50Om1vdXNlZW50ZXInKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUuaG92ZXJlZCA9IHRydWVcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDptb3VzZWxlYXZlJykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQHN0YXRlLmhvdmVyZWQgPSBmYWxzZVxuXG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6Zm9jdXMnKS5vZihAZWwuY2hpbGQuaW5wdXQpXG5cdFx0XHQudG8gKCk9PiBAc3RhdGUuZm9jdXNlZCA9IHRydWU7IGlmIEBzdGF0ZS5kaXNhYmxlZCB0aGVuIEBibHVyKClcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDpibHVyJykub2YoQGVsLmNoaWxkLmlucHV0KVxuXHRcdFx0LnRvICgpPT4gQHN0YXRlLnR5cGluZyA9IEBzdGF0ZS5mb2N1c2VkID0gZmFsc2Vcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDppbnB1dCcpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBzdGF0ZS50eXBpbmcgPSB0cnVlXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6a2V5ZG93bicpLm9mKEBlbC5jaGlsZC5pbnB1dClcblx0XHRcdC50byAoKT0+IEBjdXJzb3IucHJldiA9IEBzZWxlY3Rpb24oKS5lbmRcblxuXHRcdHJldHVyblxuXG5cblx0X3NjaGVkdWxlQ3Vyc29yUmVzZXQ6ICgpLT5cblx0XHRkaWZmSW5kZXggPSBoZWxwZXJzLmdldEluZGV4T2ZGaXJzdERpZmYoQG1hc2sudmFsdWUsIEBtYXNrLnByZXYudmFsdWUpXG5cdFx0Y3VycmVudEN1cnNvciA9IEBjdXJzb3IuY3VycmVudFxuXHRcdG5ld0N1cnNvciA9IEBtYXNrLm5vcm1hbGl6ZUN1cnNvclBvcyhjdXJyZW50Q3Vyc29yLCBAY3Vyc29yLnByZXYpXG5cblx0XHRpZiBuZXdDdXJzb3IgaXNudCBjdXJyZW50Q3Vyc29yXG5cdFx0XHRAc2VsZWN0aW9uKG5ld0N1cnNvcilcblx0XHRyZXR1cm5cblxuXG5cdF9zZXRWYWx1ZUlmTm90U2V0OiAoKS0+XG5cdFx0aWYgQGVsLmNoaWxkLmlucHV0LnJhdy52YWx1ZSBpc250IEBfdmFsdWVcblx0XHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcudmFsdWUgPSBAX3ZhbHVlXG5cdFx0cmV0dXJuXG5cblxuXG5cdF9nZXRJbnB1dEF1dG9XaWR0aDogKCktPlxuXHRcdGlmIEBfdmFsdWVcblx0XHRcdEBfc2V0VmFsdWVJZk5vdFNldCgpXG5cdFx0XHRAZWwuY2hpbGQuaW5wdXQuc3R5bGUoJ3dpZHRoJywgMClcblx0XHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcuc2Nyb2xsTGVmdCA9IDFlKzEwXG5cdFx0XHRpbnB1dFdpZHRoID0gTWF0aC5tYXgoQGVsLmNoaWxkLmlucHV0LnJhdy5zY3JvbGxMZWZ0K0BlbC5jaGlsZC5pbnB1dC5yYXcub2Zmc2V0V2lkdGgsIEBlbC5jaGlsZC5pbnB1dC5yYXcuc2Nyb2xsV2lkdGgpICsgMlxuXHRcdFx0bGFiZWxXaWR0aCA9IGlmIEBzZXR0aW5ncy5sYWJlbCBhbmQgQGVsLmNoaWxkLmxhYmVsLnN0eWxlU2FmZSgncG9zaXRpb24nKSBpcyAnYWJzb2x1dGUnIHRoZW4gQGVsLmNoaWxkLmxhYmVsLnJlY3Qud2lkdGggZWxzZSAwXG5cdFx0ZWxzZVxuXHRcdFx0aW5wdXRXaWR0aCA9IEBlbC5jaGlsZC5wbGFjZWhvbGRlci5yZWN0LndpZHRoXG5cdFx0XHRsYWJlbFdpZHRoID0gMFxuXHRcdFxuXHRcdHJldHVybiBNYXRoLm1pbiBAX2dldFdpZHRoU2V0dGluZygnbWF4JyksIE1hdGgubWF4KEBfZ2V0V2lkdGhTZXR0aW5nKCdtaW4nKSwgaW5wdXRXaWR0aCwgbGFiZWxXaWR0aClcblxuXG5cdF9nZXRXaWR0aFNldHRpbmc6ICh0YXJnZXQpLT5cblx0XHR0YXJnZXQgKz0gJ1dpZHRoJyBpZiB0YXJnZXQgaXMgJ21pbicgb3IgdGFyZ2V0IGlzICdtYXgnXHRcdFxuXHRcdGlmIHR5cGVvZiBAc2V0dGluZ3NbdGFyZ2V0XSBpcyAnbnVtYmVyJ1xuXHRcdFx0cmVzdWx0ID0gQHNldHRpbmdzW3RhcmdldF1cblx0XHRcblx0XHRlbHNlIGlmXHR0eXBlb2YgQHNldHRpbmdzW3RhcmdldF0gaXMgJ3N0cmluZydcblx0XHRcdHJlc3VsdCA9IHBhcnNlRmxvYXQoQHNldHRpbmdzW3RhcmdldF0pXG5cblx0XHRcdGlmIGhlbHBlcnMuaW5jbHVkZXMoQHNldHRpbmdzW3RhcmdldF0sICclJylcblx0XHRcdFx0aWYgKHBhcmVudD1AZWwucGFyZW50KSBhbmQgcGFyZW50LnN0eWxlKCdkaXNwbGF5JykgaXMgJ2Jsb2NrJ1xuXHRcdFx0XHRcdHBhcmVudFdpZHRoID0gcGFyZW50LnN0eWxlUGFyc2VkKCd3aWR0aCcpIC0gcGFyZW50LnN0eWxlUGFyc2VkKCdwYWRkaW5nTGVmdCcpIC0gcGFyZW50LnN0eWxlUGFyc2VkKCdwYWRkaW5nUmlnaHQnKSAtIDJcblx0XHRcdFx0XHRyZXN1bHQgPSBwYXJlbnRXaWR0aCAqIChyZXN1bHQvMTAwKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVzdWx0ID0gMFxuXG5cdFx0cmV0dXJuIHJlc3VsdCBvciAoaWYgdGFyZ2V0IGlzICdtaW5XaWR0aCcgdGhlbiAwIGVsc2UgSW5maW5pdHkpXG5cblxuXHRfdmFsaWRhdGU6IChwcm92aWRlZFZhbHVlKS0+XG5cdFx0aWYgQHNldHRpbmdzLnZhbGlkV2hlblJlZ2V4IGFuZCBJUy5yZWdleChAc2V0dGluZ3MudmFsaWRXaGVuUmVnZXgpXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgbm90IEBzZXR0aW5ncy52YWxpZFdoZW5SZWdleC50ZXN0KHByb3ZpZGVkVmFsdWUpXG5cdFx0XG5cdFx0aWYgQHNldHRpbmdzLnZhbGlkV2hlbklzQ2hvaWNlIGFuZCBAc2V0dGluZ3MuY2hvaWNlcz8ubGVuZ3RoXG5cdFx0XHRtYXRjaGluZ0Nob2ljZSA9IEBzZXR0aW5ncy5jaG9pY2VzLmZpbHRlciAoY2hvaWNlKS0+IGNob2ljZS52YWx1ZSBpcyBwcm92aWRlZFZhbHVlXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgbm90IG1hdGNoaW5nQ2hvaWNlLmxlbmd0aFxuXG5cdFx0aWYgQHNldHRpbmdzLm1pbkxlbmd0aFxuXHRcdFx0cmV0dXJuIGZhbHNlIGlmIHByb3ZpZGVkVmFsdWUubGVuZ3RoIDwgQHNldHRpbmdzLm1pbkxlbmd0aFxuXG5cdFx0aWYgQHNldHRpbmdzLm1heExlbmd0aFxuXHRcdFx0cmV0dXJuIGZhbHNlIGlmIHByb3ZpZGVkVmFsdWUubGVuZ3RoID49IEBzZXR0aW5ncy5tYXhMZW5ndGhcblxuXHRcdGlmIEBtYXNrXG5cdFx0XHRyZXR1cm4gZmFsc2UgaWYgbm90IEBtYXNrLnZhbGlkYXRlKHByb3ZpZGVkVmFsdWUpXG5cdFx0XG5cdFx0cmV0dXJuIHRydWVcblxuXG5cdHNlbGVjdGlvbjogKGFyZyktPlxuXHRcdGlmIElTLm9iamVjdChhcmcpXG5cdFx0XHRzdGFydCA9IGFyZy5zdGFydFxuXHRcdFx0ZW5kID0gYXJnLmVuZFxuXHRcdGVsc2Vcblx0XHRcdHN0YXJ0ID0gYXJnXG5cdFx0XHRlbmQgPSBhcmd1bWVudHNbMV1cblxuXHRcdGlmIHN0YXJ0P1xuXHRcdFx0ZW5kID0gc3RhcnQgaWYgbm90IGVuZCBvciBlbmQgPCBzdGFydFxuXHRcdFx0QGVsLmNoaWxkLmlucHV0LnJhdy5zZXRTZWxlY3Rpb25SYW5nZShzdGFydCwgZW5kKVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuICdzdGFydCc6QGVsLmNoaWxkLmlucHV0LnJhdy5zZWxlY3Rpb25TdGFydCwgJ2VuZCc6QGVsLmNoaWxkLmlucHV0LnJhdy5zZWxlY3Rpb25FbmRcblxuXG5cdGZvY3VzOiAoKS0+XG5cdFx0QGVsLmNoaWxkLmlucHV0LnJhdy5mb2N1cygpXG5cblx0Ymx1cjogKCktPlxuXHRcdEBlbC5jaGlsZC5pbnB1dC5yYXcuYmx1cigpXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRGaWVsZCIsImN1cnJlbnRJRCA9IDBcbmFycmF5TXV0YXRvck1ldGhvZHMgPSBbJ3B1c2gnLCdwb3AnLCdzaGlmdCcsJ3Vuc2hpZnQnLCdzcGxpY2UnLCdyZXZlcnNlJywnc29ydCddXG5kdW1teVByb3BlcnR5RGVzY3JpcHRvciA9IHt9XG5ib3VuZEluc3RhbmNlcyA9IHt9XG5wbGFjZWhvbGRlciA9IFsne3snLCAnfX0nXVxuc2V0dGluZ3MgPSBPYmplY3QuY3JlYXRlXG5cdHNpbGVudDpcdFx0XHRcdFx0ZmFsc2Vcbixcblx0cGxhY2Vob2xkZXI6XG5cdFx0Z2V0OiAoKS0+IHBsYWNlaG9sZGVyXG5cdFx0c2V0OiAobmV3UGxhY2Vob2xkZXIpLT4gaWYgY2hlY2tJZi5pc0FycmF5KG5ld1BsYWNlaG9sZGVyKSBhbmQgbmV3UGxhY2Vob2xkZXIubGVuZ3RoIGlzIDJcblx0XHRcdHBsYWNlaG9sZGVyID0gbmV3UGxhY2Vob2xkZXJcblx0XHRcdHNldFBob2xkZXJSZWdFeCgpXG5cdFx0XHRyZXR1cm5cblxuXG5kZWZhdWx0T3B0aW9ucyA9IFxuXHRkZWxheTpcdFx0XHRcdFx0ZmFsc2Vcblx0dGhyb3R0bGU6XHRcdFx0XHRmYWxzZVxuXHRzaW1wbGVTZWxlY3RvcjpcdFx0XHRmYWxzZVxuXHRwcm9taXNlVHJhbnNmb3JtczpcdFx0ZmFsc2Vcblx0ZGlzcGF0Y2hFdmVudHM6XHRcdFx0ZmFsc2Vcblx0c2VuZEFycmF5Q29waWVzOlx0XHRmYWxzZVxuXHR1cGRhdGVFdmVuSWZTYW1lOlx0XHRmYWxzZVxuXHR1cGRhdGVPbkJpbmQ6XHRcdFx0dHJ1ZVxuXG5cbmltcG9ydCAnLi9taXNjJ1xuaW1wb3J0ICcuL1NpbXBseUJpbmQnXG5pbXBvcnQgJy4vQmluZGluZydcbmltcG9ydCAnLi9CaW5kaW5nSW50ZXJmYWNlJ1xuaW1wb3J0ICcuL0dyb3VwQmluZGluZydcblxubW9kdWxlLmV4cG9ydHMgPSBTaW1wbHlCaW5kIiwiaW1wb3J0ICcuL2hlbHBlcnMnXG5pbXBvcnQgJy4vZXJyb3JzQW5kV2FybmluZ3MnXG4iLCJkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuZ2V0RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JcblxuaW1wb3J0ICcuL2NoYW5nZUV2ZW50J1xuaW1wb3J0ICcuL3JlcXVpcmVzRG9tRGVzY3JpcHRvckZpeCdcbmltcG9ydCAnLi93aW5kb3dQcm9wc1RvSWdub3JlJ1xuXG5cbnNldFZhbHVlTm9vcCA9ICh2LCBwdWJsaXNoZXIpLT4gQHVwZGF0ZUFsbFN1YnMocHVibGlzaGVyIG9yIEApXG5cbmdlbklEID0gKCktPiAnJysoKytjdXJyZW50SUQpXG5cbmdlbk9iaiA9ICgpLT4gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG5nZW5Qcm94aWVkSW50ZXJmYWNlID0gKGlzU3ViLCBjb21wbGV0ZUNhbGxiYWNrKS0+IChzdWJqZWN0LCBjdXN0b21PcHRpb25zLCBzYXZlT3B0aW9ucyktPlxuXHRTaW1wbHlCaW5kKHN1YmplY3QsIGN1c3RvbU9wdGlvbnMsIHNhdmVPcHRpb25zLCBpc1N1YiwgY29tcGxldGVDYWxsYmFjaylcblxuZ2VuU2VsZlVwZGF0ZXIgPSAoYmluZGluZywgZmV0Y2hWYWx1ZSktPlxuXHRiaW5kaW5nLnNlbGZVcGRhdGVyIG9yXG5cdGJpbmRpbmcuc2VsZlVwZGF0ZXIgPSBuZXcgQmluZGluZyAoKS0+XG5cdFx0aWYgZmV0Y2hWYWx1ZSB0aGVuIGJpbmRpbmcuc2V0VmFsdWUoYmluZGluZy5mZXRjaERpcmVjdFZhbHVlKCksIGJpbmRpbmcsIHRydWUpIGVsc2UgYmluZGluZy51cGRhdGVBbGxTdWJzKGJpbmRpbmcpXG5cdCwgJ0Z1bmMnLCB7fVxuXG5cbiMgPT09PSBDaGVja3MgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgJy4vY2hlY2tzJ1xuXG5cbiMgPT09PSBEZXNjcmlwdG9yIE1vZGlmaWNhdGlvbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCAnLi9kZXNjcmlwdG9yLW1vZCdcblxuXG4jID09PT0gT2JqZWN0IGNsb25pbmcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgJy4vY2xvbmluZydcblxuXG4jID09PT0gQmluZGluZyBDYWNoZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCAnLi9jYWNoZSdcblxuXG4jID09PT0gUGxhY2Vob2xkZXJzID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0ICcuL3BsYWNlaG9sZGVycydcblxuXG4jID09PT0gRXJyb3JzICsgV2FybmluZ3MgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgJy4vZXJyb3JzJ1xuXG5cblxuXG5cblxuXG4iLCJjYWNoZWRFdmVudCA9IG51bGxcblxuY2hhbmdlRXZlbnQgPSAoKS0+XG5cdGlmIG5vdCBjYWNoZWRFdmVudFxuXHRcdGV2ZW50ID0gY2FjaGVkRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKVxuXHRcdGV2ZW50LmluaXRFdmVudCgnY2hhbmdlJywgdHJ1ZSwgZmFsc2UpXG5cdFx0ZXZlbnQuX3NiID0gdHJ1ZVxuXG5cdHJldHVybiBjYWNoZWRFdmVudCIsInJlcXVpcmVzRG9tRGVzY3JpcHRvckZpeCA9ICgnY2xhc3NOYW1lJyBub3Qgb2YgRWxlbWVudDo6KSBvciBub3QgZ2V0RGVzY3JpcHRvcihFbGVtZW50OjosICdjbGFzc05hbWUnKS5nZXQiLCJ3aW5kb3dQcm9wc1RvSWdub3JlID0gW1xuXHQnaW5uZXJXaWR0aCdcblx0J2lubmVySGVpZ2h0J1xuXHQnb3V0ZXJXaWR0aCdcblx0J291dGVySGVpZ2h0J1xuXHQnc2Nyb2xsWCdcblx0J3Njcm9sbFknXG5cdCdwYWdlWE9mZnNldCdcblx0J3BhZ2VZT2Zmc2V0J1xuXHQnc2NyZWVuWCdcblx0J3NjcmVlblknXG5cdCdzY3JlZW5MZWZ0J1xuXHQnc2NyZWVuVG9wJ1xuXSIsInRhcmdldEluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPiB0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuY2hlY2tJZiA9XG5cdGlzRGVmaW5lZDogKHN1YmplY3QpLT4gc3ViamVjdCBpc250IHVuZGVmaW5lZFxuXHRcblx0aXNBcnJheTogKHN1YmplY3QpLT4gc3ViamVjdCBpbnN0YW5jZW9mIEFycmF5XG5cdFxuXHRpc09iamVjdDogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ29iamVjdCcgYW5kIHN1YmplY3QgIyAybmQgY2hlY2sgaXMgdG8gdGVzdCBhZ2FpbnN0ICdudWxsJyB2YWx1ZXNcblxuXHRpc1N0cmluZzogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ3N0cmluZydcblx0XG5cdGlzTnVtYmVyOiAoc3ViamVjdCktPiB0eXBlb2Ygc3ViamVjdCBpcyAnbnVtYmVyJ1xuXHRcblx0aXNGdW5jdGlvbjogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ2Z1bmN0aW9uJ1xuXG5cdGlzQmluZGluZ0ludGVyZmFjZTogKHN1YmplY3QpLT4gc3ViamVjdCBpbnN0YW5jZW9mIEJpbmRpbmdJbnRlcmZhY2Vcblx0XG5cdGlzQmluZGluZzogKHN1YmplY3QpLT4gc3ViamVjdCBpbnN0YW5jZW9mIEJpbmRpbmdcblxuXHRpc0l0ZXJhYmxlOiAoc3ViamVjdCktPiBjaGVja0lmLmlzT2JqZWN0KHN1YmplY3QpIGFuZCBjaGVja0lmLmlzTnVtYmVyKHN1YmplY3QubGVuZ3RoKVxuXG5cdGlzRG9tOiAoc3ViamVjdCktPiBzdWJqZWN0Lm5vZGVOYW1lIGFuZCBzdWJqZWN0Lm5vZGVUeXBlIGlzIDFcblxuXHRpc0RvbUlucHV0OiAoc3ViamVjdCktPlxuXHRcdG5vZGVOYW1lID0gc3ViamVjdC5ub2RlTmFtZVxuXHRcdHJldHVybiBub2RlTmFtZSBpcyAnSU5QVVQnIG9yIG5vZGVOYW1lIGlzICdURVhUQVJFQScgb3Igbm9kZU5hbWUgaXMgJ1NFTEVDVCdcblxuXHRpc0RvbVJhZGlvOiAoc3ViamVjdCktPiBzdWJqZWN0LnR5cGUgaXMgJ3JhZGlvJ1xuXG5cdGlzRG9tQ2hlY2tib3g6IChzdWJqZWN0KS0+IHN1YmplY3QudHlwZSBpcyAnY2hlY2tib3gnXG5cblx0aXNFbENvbGxlY3Rpb246IChzdWJqZWN0KS0+IChzdWJqZWN0IGluc3RhbmNlb2YgTm9kZUxpc3QpIG9yIChzdWJqZWN0IGluc3RhbmNlb2YgSFRNTENvbGxlY3Rpb24pIG9yICh3aW5kb3cualF1ZXJ5IGFuZCBzdWJqZWN0IGluc3RhbmNlb2YgalF1ZXJ5KVxuXG5cdGRvbUVsc0FyZVNhbWU6IChpdGVyYWJsZSktPlxuXHRcdHR5cGUgPSBpdGVyYWJsZVswXS50eXBlXG5cdFx0aXRlbXNXaXRoU2FtZVR5cGUgPSBbXS5maWx0ZXIuY2FsbCBpdGVyYWJsZSwgKGl0ZW0pLT4gaXRlbS50eXBlIGlzIHR5cGVcblxuXHRcdHJldHVybiBpdGVtc1dpdGhTYW1lVHlwZS5sZW5ndGggaXMgaXRlcmFibGUubGVuZ3RoXG5cblx0aXNEb21Ob2RlOiAoc3ViamVjdCktPiBjaGVja0lmLmlzRG9tKHN1YmplY3QpIG9yIHN1YmplY3QgaXMgd2luZG93IG9yIHN1YmplY3QgaXMgZG9jdW1lbnQiLCJmZXRjaERlc2NyaXB0b3IgPSAob2JqZWN0LCBwcm9wZXJ0eSwgaXNQcm90byktPlxuXHRkZXNjcmlwdG9yID0gZ2V0RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KVxuXHRpZiBkZXNjcmlwdG9yXG5cdFx0ZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlIGlmIGlzUHJvdG9cblx0XHRyZXR1cm4gZGVzY3JpcHRvclxuXHRcblx0ZWxzZSBpZiBvYmplY3RQcm90bz1PYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KVxuXHRcdHJldHVybiBmZXRjaERlc2NyaXB0b3Iob2JqZWN0UHJvdG8sIHByb3BlcnR5LCB0cnVlKVxuXG5cbmNvbnZlcnRUb0xpdmUgPSAoYmluZGluZ0luc3RhbmNlLCBvYmplY3QsIG9ubHlBcnJheU1ldGhvZHMpLT5cblx0XyA9IGJpbmRpbmdJbnN0YW5jZVxuXHRfLm9yaWdEZXNjcmlwdG9yID0gZmV0Y2hEZXNjcmlwdG9yKG9iamVjdCwgXy5wcm9wZXJ0eSkgaWYgbm90IF8ub3JpZ0Rlc2NyaXB0b3JcblxuXHRpZiBvbmx5QXJyYXlNZXRob2RzXG5cdFx0YXJyYXlNdXRhdG9yTWV0aG9kcy5mb3JFYWNoIChtZXRob2QpLT4gIyBVc2luZyBmb3JFYWNoIGJlY2F1c2Ugd2UgbmVlZCBhIGNsb3N1cmUgaGVyZVxuXHRcdFx0ZGVmaW5lUHJvcGVydHkgb2JqZWN0LCBtZXRob2QsIFxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHRcdFx0dmFsdWU6ICgpLT5cblx0XHRcdFx0XHRyZXN1bHQgPSBBcnJheTo6W21ldGhvZF0uYXBwbHkgb2JqZWN0LCBhcmd1bWVudHNcblx0XHRcdFx0XHRfLnVwZGF0ZUFsbFN1YnMoXylcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0XG5cblx0ZWxzZVxuXHRcdGlmIF8udHlwZSBpcyAnUHJveHknXG5cdFx0XHRvcmlnRm4gPSBfLm9yaWdGbiA9IF8udmFsdWVcblx0XHRcdGNvbnRleHQgPSBvYmplY3Rcblx0XHRcdF8udmFsdWUgPSByZXN1bHQ6bnVsbCwgYXJnczpudWxsXG5cblx0XHRcdGlmIGNoZWNrSWYuaXNGdW5jdGlvbihvcmlnRm4pXG5cdFx0XHRcdHNsaWNlID0gW10uc2xpY2Vcblx0XHRcdFx0Z2V0dGVyVmFsdWUgPSBwcm94eUZuID0gKCktPiBcblx0XHRcdFx0XHRhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpXG5cdFx0XHRcdFx0Xy52YWx1ZS5hcmdzID0gYXJncyA9IGlmIF8uc2VsZlRyYW5zZm9ybSB0aGVuIF8uc2VsZlRyYW5zZm9ybShhcmdzKSBlbHNlIGFyZ3Ncblx0XHRcdFx0XHRfLnZhbHVlLnJlc3VsdCA9IHJlc3VsdCA9IG9yaWdGbi5hcHBseShjb250ZXh0LCBhcmdzKVxuXHRcdFx0XHRcdF8udXBkYXRlQWxsU3VicyhfKVxuXHRcdFx0XHRcdHJldHVybiByZXN1bHRcblx0XHRcdFx0XG5cdFx0XHRcdGRlZmluZVByb3BlcnR5IG9iamVjdCwgXy5wcm9wZXJ0eSwgXG5cdFx0XHRcdFx0Y29uZmlndXJhYmxlOiBfLmlzTGl2ZVByb3AgPSB0cnVlXG5cdFx0XHRcdFx0Z2V0OiAoKS0+IGdldHRlclZhbHVlXG5cdFx0XHRcdFx0c2V0OiAobmV3VmFsdWUpLT5cblx0XHRcdFx0XHRcdGlmIG5vdCBjaGVja0lmLmlzRnVuY3Rpb24obmV3VmFsdWUpXG5cdFx0XHRcdFx0XHRcdGdldHRlclZhbHVlID0gbmV3VmFsdWVcblxuXHRcdFx0XHRcdFx0ZWxzZSBpZiBuZXdWYWx1ZSBpc250IG9yaWdGblxuXHRcdFx0XHRcdFx0XHRvcmlnRm4gPSBfLm9yaWdGbiA9IG5ld1ZhbHVlXHRpZiBuZXdWYWx1ZSBpc250IHByb3h5Rm5cblx0XHRcdFx0XHRcdFx0Z2V0dGVyVmFsdWUgPSBwcm94eUZuXHRcdFx0aWYgZ2V0dGVyVmFsdWUgaXNudCBwcm94eUZuXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRcblxuXHRcdGVsc2UgaWYgbm90IHRhcmdldEluY2x1ZGVzKF8udHlwZSwgJ0RPTScpIGFuZCBub3QgKF8ub2JqZWN0IGlzIHdpbmRvdyBhbmQgdGFyZ2V0SW5jbHVkZXMod2luZG93UHJvcHNUb0lnbm9yZSwgXy5wcm9wZXJ0eSkpXG5cdFx0XG5cdFx0XHQjICdPYmplY3RQcm9wJyBvciAnQXJyYXknIHR5cGUgYmluZGluZ3Ncblx0XHRcdHByb3BlcnR5RGVzY3JpcHRvciA9IF8ub3JpZ0Rlc2NyaXB0b3Igb3IgZHVtbXlQcm9wZXJ0eURlc2NyaXB0b3Jcblx0XHRcdF8ub3JpZ0dldHRlciA9IHByb3BlcnR5RGVzY3JpcHRvci5nZXQuYmluZChvYmplY3QpIGlmIHByb3BlcnR5RGVzY3JpcHRvci5nZXRcblx0XHRcdF8ub3JpZ1NldHRlciA9IHByb3BlcnR5RGVzY3JpcHRvci5zZXQuYmluZChvYmplY3QpIGlmIHByb3BlcnR5RGVzY3JpcHRvci5zZXRcblx0XHRcdHNob3VsZFdyaXRlTGl2ZVByb3AgPSBwcm9wZXJ0eURlc2NyaXB0b3IuY29uZmlndXJhYmxlXG5cblx0XHRcdHNob3VsZFdyaXRlTGl2ZVByb3AgPSBzaG91bGRXcml0ZUxpdmVQcm9wIGFuZCBvYmplY3QuY29uc3RydWN0b3IgaXNudCBDU1NTdHlsZURlY2xhcmF0aW9uXG5cdFx0XHRpbXBvcnQgJy4vd2Via2l0RG9tRGVzY3JpcHRvckZpeCdcblx0XHRcdFxuXHRcdFx0aWYgc2hvdWxkV3JpdGVMaXZlUHJvcFxuXHRcdFx0XHR0eXBlSXNBcnJheSA9IF8udHlwZSBpcyAnQXJyYXknXG5cdFx0XHRcdHNob3VsZEluZGljYXRlVXBkYXRlSXNGcm9tU2VsZiA9IG5vdCBfLm9yaWdTZXR0ZXIgYW5kIG5vdCB0eXBlSXNBcnJheVxuXHRcdFx0XHRcblx0XHRcdFx0ZGVmaW5lUHJvcGVydHkgb2JqZWN0LCBfLnByb3BlcnR5LFxuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogXy5pc0xpdmVQcm9wID0gdHJ1ZVxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHByb3BlcnR5RGVzY3JpcHRvci5lbnVtZXJhYmxlXG5cdFx0XHRcdFx0Z2V0OiBfLm9yaWdHZXR0ZXIgb3IgKCktPiBfLnZhbHVlXG5cdFx0XHRcdFx0c2V0OiAobmV3VmFsdWUpLT4gXy5zZXRWYWx1ZShuZXdWYWx1ZSwgXywgc2hvdWxkSW5kaWNhdGVVcGRhdGVJc0Zyb21TZWxmKTsgcmV0dXJuXG5cblx0XHRcdFxuXHRcdFx0XHRpZiB0eXBlSXNBcnJheVxuXHRcdFx0XHRcdGNvbnZlcnRUb0xpdmUoXywgb2JqZWN0W18ucHJvcGVydHldLCB0cnVlKVxuXG5cdHJldHVyblxuXG5cblxuXG5cbmNvbnZlcnRUb1JlZyA9IChiaW5kaW5nSW5zdGFuY2UsIG9iamVjdCwgb25seUFycmF5TWV0aG9kcyktPlxuXHRpZiBvbmx5QXJyYXlNZXRob2RzXG5cdFx0ZGVsZXRlIG9iamVjdFttZXRob2RdIGZvciBtZXRob2QgaW4gYXJyYXlNdXRhdG9yTWV0aG9kc1xuXHRlbHNlXG5cdFx0XyA9IGJpbmRpbmdJbnN0YW5jZVxuXHRcdG5ld0Rlc2NyaXB0b3IgPSBfLm9yaWdEZXNjcmlwdG9yXG5cdFx0bmV3RGVzY3JpcHRvci52YWx1ZSA9IChfLm9yaWdGbiBvciBfLnZhbHVlKSB1bmxlc3MgbmV3RGVzY3JpcHRvci5zZXQgb3IgbmV3RGVzY3JpcHRvci5nZXRcblx0XHRkZWZpbmVQcm9wZXJ0eSBvYmplY3QsIF8ucHJvcGVydHksIG5ld0Rlc2NyaXB0b3JcblxuXG5cbiIsIiMjIypcbiAqIFRoZXJlIGlzIGEgYnVnIGluIHdlYmtpdC9ibGluayBlbmdpbmVzIGluIHdoaWNoIG5hdGl2ZSBhdHRyaWJ1dGVzL3Byb3BlcnRpZXMgXG4gKiBvZiBET00gZWxlbWVudHMgYXJlIG5vdCBleHBvc2VkIG9uIHRoZSBlbGVtZW50J3MgcHJvdG90eXBlIGFuZCBpbnN0ZWFkIGlzXG4gKiBleHBvc2VkIGRpcmVjdGx5IG9uIHRoZSBlbGVtZW50IGluc3RhbmNlOyB3aGVuIGxvb2tpbmcgdXAgdGhlIHByb3BlcnR5IGRlc2NyaXB0b3JcbiAqIG9mIHRoZSBlbGVtZW50IGEgZGF0YSBkZXNjcmlwdG9yIGlzIHJldHVybmVkIGluc3RlYWQgb2YgYW4gYWNjZXNzb3IgZGVzY3JpcHRvclxuICogKGkuZS4gZGVzY3JpcHRvciB3aXRoIGdldHRlci9zZXR0ZXIpIHdoaWNoIG1lYW5zIHdlIGFyZSBub3QgYWJsZSB0byBkZWZpbmUgb3VyXG4gKiBvd24gcHJveHkgZ2V0dGVyL3NldHRlcnMuIFRoaXMgd2FzIGZpeGVkIG9ubHkgaW4gQXByaWwgMjAxNSBpbiBDaHJvbWUgdjQzIGFuZFxuICogU2FmYXJpIHYxMC4gQWx0aG91Z2ggd2Ugd29uJ3QgYmUgYWJsZSB0byBnZXQgbm90aWZpZWQgd2hlbiB0aGUgb2JqZWN0cyBnZXRcbiAqIHRoZWlyIHZhbHVlcyBzZXQsIHdlIHdvdWxkIGF0IGxlYXN0IHByb3ZpZGUgd29ya2luZyBmdW5jdGlvbmFsaXR5IGxhY2tpbmcgdXBkYXRlXG4gKiBsaXN0ZW5lcnMuIFNpbmNlIHYxLjE0LjAgSFRNTElucHV0RWxlbWVudDo6dmFsdWUgYmluZGluZ3MgaW52b2tlIHRoZSBvcmlnaW5hbFxuICogZ2V0dGVyIGFuZCBzZXR0ZXIgbWV0aG9kcyBpbiBCaW5kaW5nOjpzZXRWYWx1ZSgpLCBhbmQgc2luY2Ugd2Ugd2FudCB0byBhdm9pZFxuICogaW5jcmVhc2luZyB0aGUgYW1vdW50IG9mIGxvZ2ljIHByZXNlbnQgaW4gQmluZGluZzo6c2V0VmFsdWUoKSBmb3IgcGVyZm9ybWFuY2VcbiAqIHJlYXNvbnMsIHdlIHBhdGNoIHRob3NlIHNldHRlcnMgaGVyZS4gV2UgY2xvbmUgdGhlIHRhcmdldCBlbGVtZW50IGFuZCBjaGVjayBmb3JcbiAqIHRoZSBleGlzdGVuY2Ugb2YgdGhlIHRhcmdldCBwcm9wZXJ0eSAtIGlmIGl0IGV4aXN0cyB0aGVuIGl0IGluZGljYXRlcyB0aGUgdGFyZ2V0XG4gKiBwcm9wZXJ0eSBpcyBhIG5hdGl2ZSBwcm9wZXJ0eSAoc2luY2Ugb25seSBuYXRpdmUgcHJvcGVydGllcyBhcmUgY29waWVkIG92ZXIgaW5cbiAqIEVsZW1lbnQ6OmNsb25lTm9kZSkuIFRoaXMgcGF0Y2hpbmcgaXMgb25seSBmb3IgbmF0aXZlIHByb3BlcnRpZXMuXG4gKlxuICogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTQ5NzM5XG4gKiBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NzUyOTdcbiAqIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQzMzk0XG4gKiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00MzE0OTJcbiAqIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTEzMTc1XG4gKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvdXBkYXRlcy8yMDE1LzA0L0RPTS1hdHRyaWJ1dGVzLW5vdy1vbi10aGUtcHJvdG90eXBlLWNoYWluXG4jIyNcblxuaWYgcmVxdWlyZXNEb21EZXNjcmlwdG9yRml4IGFuZCBfLmlzRG9tIGFuZCBfLnByb3BlcnR5IG9mIG9iamVjdC5jbG9uZU5vZGUoZmFsc2UpXG5cdF8ub3JpZ0Rlc2NyaXB0b3IgPSBzaG91bGRXcml0ZUxpdmVQcm9wID0gZmFsc2Vcblx0Xy5pc0xpdmVQcm9wID0gdHJ1ZVxuXHRfLm9yaWdHZXR0ZXIgPSAoKS0+IF8ub2JqZWN0W18ucHJvcGVydHldXG5cdF8ub3JpZ1NldHRlciA9IChuZXdWYWx1ZSktPiBfLm9iamVjdFtfLnByb3BlcnR5XSA9IG5ld1ZhbHVlIiwiY2xvbmVPYmplY3QgPSAob2JqZWN0KS0+XG5cdGNsb25lID0gZ2VuT2JqKClcblx0Y2xvbmVba2V5XSA9IG9iamVjdFtrZXldIGZvciBrZXkgb2Ygb2JqZWN0XG5cdHJldHVybiBjbG9uZVxuXG5leHRlbmRTdGF0ZSA9IChiYXNlLCBzdGF0ZVRvSW5oZXJpdCktPlxuXHRzdGF0ZU1hcHBpbmcgPSBPYmplY3Qua2V5cyhzdGF0ZVRvSW5oZXJpdClcblx0YmFzZVtrZXldID0gc3RhdGVUb0luaGVyaXRba2V5XSBmb3Iga2V5IGluIHN0YXRlTWFwcGluZ1xuXHRyZXR1cm5cbiIsImNhY2hlID1cdFxuXHRnZXQ6IChvYmplY3QsIGlzRnVuY3Rpb24sIHNlbGVjdG9yLCBpc011bHRpQ2hvaWNlKS0+XG5cdFx0aWYgaXNGdW5jdGlvblxuXHRcdFx0cmV0dXJuIGJvdW5kSW5zdGFuY2VzW29iamVjdC5fc2JfSURdXG5cdFx0ZWxzZVxuXHRcdFx0aWYgaXNNdWx0aUNob2ljZSBhbmQgb2JqZWN0WzBdLl9zYl9tYXBcblx0XHRcdFx0c2FtcGxlSXRlbSA9IGJvdW5kSW5zdGFuY2VzWyBvYmplY3RbMF0uX3NiX21hcFtzZWxlY3Rvcl0gXVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIHNhbXBsZUl0ZW0uZ3JvdXBCaW5kaW5nIGlmIHNhbXBsZUl0ZW0uZ3JvdXBCaW5kaW5nXG5cblx0XHRcdGlmIG9iamVjdC5fc2JfbWFwIGFuZCBvYmplY3QuX3NiX21hcFtzZWxlY3Rvcl1cblx0XHRcdFx0cmV0dXJuIGJvdW5kSW5zdGFuY2VzWyBvYmplY3QuX3NiX21hcFtzZWxlY3Rvcl0gXVxuXG5cblx0c2V0OiAoQiwgaXNGdW5jdGlvbiktPiAjIEIgPT09PSBCaW5kaW5nIE9iamVjdFxuXHRcdGlmIGlzRnVuY3Rpb25cblx0XHRcdGRlZmluZVByb3BlcnR5IEIub2JqZWN0LCAnX3NiX0lEJywgeydjb25maWd1cmFibGUnOnRydWUsICd2YWx1ZSc6Qi5JRH1cblxuXHRcdGVsc2Vcblx0XHRcdHNlbGVjdG9yID0gQi5zZWxlY3RvclxuXG5cdFx0XHRpZiBCLm9iamVjdC5fc2JfbWFwXG5cdFx0XHRcdEIub2JqZWN0Ll9zYl9tYXBbc2VsZWN0b3JdID0gQi5JRFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwcm9wc01hcCA9IHt9XG5cdFx0XHRcdHByb3BzTWFwW3NlbGVjdG9yXSA9IEIuSURcblx0XHRcdFx0XG5cdFx0XHRcdGRlZmluZVByb3BlcnR5IEIub2JqZWN0LCAnX3NiX21hcCcsIHsnY29uZmlndXJhYmxlJzp0cnVlLCAndmFsdWUnOnByb3BzTWFwfVxuXHRcdHJldHVybiIsImVzY2FwZVJlZ0V4ID0gL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nXG5waG9sZGVyUmVnRXggPSBwaG9sZGVyUmVnRXhTcGxpdCA9IG51bGxcblxuc2V0UGhvbGRlclJlZ0V4ID0gKCktPlxuXHRzdGFydCA9IHNldHRpbmdzLnBsYWNlaG9sZGVyWzBdLnJlcGxhY2UoZXNjYXBlUmVnRXgsICdcXFxcJCYnKVxuXHRlbmQgPSBzZXR0aW5ncy5wbGFjZWhvbGRlclsxXS5yZXBsYWNlKGVzY2FwZVJlZ0V4LCAnXFxcXCQmJylcblx0bWlkZGxlID0gXCJbXiN7ZW5kfV0rXCJcblx0cGhvbGRlclJlZ0V4ID0gbmV3IFJlZ0V4cChcIiN7c3RhcnR9KCN7bWlkZGxlfSkje2VuZH1cIiwgJ2cnKVxuXHRwaG9sZGVyUmVnRXhTcGxpdCA9IG5ldyBSZWdFeHAoXCIje3N0YXJ0fSN7bWlkZGxlfSN7ZW5kfVwiLCAnZycpXG5cdHJldHVyblxuXG5zZXRQaG9sZGVyUmVnRXgoKSAjIENyZWF0ZSB0aGUgcmVnRXggb24gaW5pdFxuXG5cblxuYXBwbHlQbGFjZWhvbGRlcnMgPSAoY29udGV4dHMsIHZhbHVlcywgaW5kZXhNYXApLT5cblx0b3V0cHV0ID0gJydcblx0Zm9yIGNvbnRleHRQYXJ0LGluZGV4IGluIGNvbnRleHRzXG5cdFx0b3V0cHV0ICs9IGNvbnRleHRQYXJ0XG5cdFx0b3V0cHV0ICs9IHZhbHVlc1tpbmRleE1hcFtpbmRleF1dIGlmIGluZGV4TWFwW2luZGV4XVxuXHRcblx0cmV0dXJuIG91dHB1dFxuXG5cbnRleHRDb250ZW50ID0gJ3RleHRDb250ZW50J1xuXG5hZGRUb05vZGVTdG9yZSA9IChub2RlU3RvcmUsIG5vZGUsIHRhcmdldFBsYWNlaG9sZGVyKS0+XG5cdG5vZGVTdG9yZVt0YXJnZXRQbGFjZWhvbGRlcl0gPz0gW11cblx0bm9kZVN0b3JlW3RhcmdldFBsYWNlaG9sZGVyXS5wdXNoKG5vZGUpXG5cdHJldHVyblxuXG5cbnNjYW5UZXh0Tm9kZXNQbGFjZWhvbGRlcnMgPSAoZWxlbWVudCwgbm9kZVN0b3JlKS0+XG5cdGNoaWxkTm9kZXMgPSBBcnJheTo6c2xpY2UuY2FsbChlbGVtZW50LmNoaWxkTm9kZXMpXG5cdGZvciBub2RlIGluIGNoaWxkTm9kZXNcblx0XHRpZiBub2RlLm5vZGVUeXBlIGlzbnQgMyBcblx0XHRcdHNjYW5UZXh0Tm9kZXNQbGFjZWhvbGRlcnMobm9kZSwgbm9kZVN0b3JlKVxuXHRcdFxuXHRcdGVsc2UgaWYgbm9kZVt0ZXh0Q29udGVudF0ubWF0Y2gocGhvbGRlclJlZ0V4U3BsaXQpXG5cdFx0XHR0ZXh0UGllY2VzID0gbm9kZVt0ZXh0Q29udGVudF0uc3BsaXQocGhvbGRlclJlZ0V4KVxuXG5cdFx0XHRpZiB0ZXh0UGllY2VzLmxlbmd0aCBpcyAzIGFuZCB0ZXh0UGllY2VzWzBdK3RleHRQaWVjZXNbMl0gaXMgJycgIyBUaGUgZW50aXJlIHRleHROb2RlIGlzIGp1c3QgdGhlIHBsYWNlaG9sZGVyXG5cdFx0XHRcdGFkZFRvTm9kZVN0b3JlKG5vZGVTdG9yZSwgbm9kZSwgdGV4dFBpZWNlc1sxXSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0bmV3RnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblxuXHRcdFx0XHRmb3IgdGV4dFBpZWNlLGluZGV4IGluIHRleHRQaWVjZXNcblx0XHRcdFx0XHRuZXdOb2RlID0gbmV3RnJhZ21lbnQuYXBwZW5kQ2hpbGQgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dFBpZWNlKVxuXHRcdFx0XHRcdGlmIGluZGV4ICUgMiAjIGlzIGFuIG9kZCBpbmRleCwgaW5kaWNhdGluZyB0aGF0IGJlZm9yZSB0aGlzIHRleHQgcGllY2Ugc2hvdWxkIGNvbWUgYSBwbGFjZWhvbGRlciBub2RlXG5cdFx0XHRcdFx0XHRhZGRUb05vZGVTdG9yZShub2RlU3RvcmUsIG5ld05vZGUsIHRleHRQaWVjZSlcblxuXHRcdFx0XHRub2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0ZyYWdtZW50LCBub2RlKVxuXG5cdHJldHVyblxuXG5cblxuIiwidGhyb3dFcnJvciA9IChlcnJvck5hbWUpLT5cblx0dGhyb3cgbmV3IEVycm9yICdTaW1wbHlCaW5kOiAnKyhlcnJvcnNbZXJyb3JOYW1lXSBvciBlcnJvck5hbWUpXG5cbnRocm93V2FybmluZyA9ICh3YXJuaW5nTmFtZSwgZGVwdGgpLT4gdW5sZXNzIHNldHRpbmdzLnNpbGVudFxuXHRlcnJTb3VyY2UgPSBnZXRFcnJTb3VyY2UoZGVwdGgpXG5cdHdhcm4gPSBlcnJvcnNbd2FybmluZ05hbWVdXG5cdHdhcm4gKz0gXCJcXG5cXG5cIitlcnJTb3VyY2Vcblx0Y29uc29sZS53YXJuKCdTaW1wbHlCaW5kOiAnK3dhcm4pXG5cdHJldHVyblxuXG50aHJvd0Vycm9yQmFkQXJnID0gKGFyZyktPlxuXHR0aHJvd0Vycm9yIFwiSW52YWxpZCBhcmd1bWVudC9zICgje2FyZ30pXCIsIHRydWVcblx0cmV0dXJuXG5cbmdldEVyclNvdXJjZSA9IChkZXB0aCktPlxuXHQoKG5ldyBFcnJvcikuc3RhY2sgb3IgJycpXG5cdFx0LnNwbGl0KCdcXG4nKVxuXHRcdC5zbGljZShkZXB0aCszKVxuXHRcdC5qb2luKCdcXG4nKVxuXG5cbiIsImVycm9ycyA9IFxuXHRpbnZhbGlkUGFyYW1OYW1lOiBcIlNpbXBseUJpbmQoKSBhbmQgLnRvKCkgb25seSBhY2NlcHQgYSBmdW5jdGlvbiwgYW4gYXJyYXksIGEgYm91bmQgb2JqZWN0LCBhIHN0cmluZywgb3IgYSBudW1iZXIuXCJcblx0Zm5Pbmx5OiBcIk9ubHkgZnVuY3Rpb25zIGFyZSBhbGxvd2VkIGZvciAudHJhbnNmb3JtLy5jb25kaXRpb24vQWxsKClcIlxuXHRiYWRFdmVudEFyZzogXCJJbnZhbGlkIGFyZ3VtZW50IG51bWJlciBpbiAub2ZFdmVudCgpXCJcblx0ZW1wdHlMaXN0OiBcIkVtcHR5IGNvbGxlY3Rpb24gcHJvdmlkZWRcIlxuXHRcblx0b25seU9uZURPTUVsZW1lbnQ6IFwiWW91IGNhbiBvbmx5IHBhc3MgYSBzaW5nbGUgRE9NIGVsZW1lbnQgdG8gYSBiaW5kaW5nXCJcblx0bWl4ZWRFbExpc3Q6IFwiJ2NoZWNrZWQnIG9mIE1peGVkIGxpc3Qgb2YgZWxlbWVudCBjYW5ub3QgYmUgYm91bmRcIlxuIiwiU2ltcGx5QmluZCA9IChzdWJqZWN0LCBvcHRpb25zLCBzYXZlT3B0aW9ucywgaXNTdWIsIGNvbXBsZXRlQ2FsbGJhY2spLT5cblx0aWYgKCFzdWJqZWN0IGFuZCBzdWJqZWN0IGlzbnQgMCkgb3IgKCFjaGVja0lmLmlzU3RyaW5nKHN1YmplY3QpIGFuZCAhY2hlY2tJZi5pc051bWJlcihzdWJqZWN0KSBhbmQgIWNoZWNrSWYuaXNGdW5jdGlvbihzdWJqZWN0KSBhbmQgc3ViamVjdCBub3QgaW5zdGFuY2VvZiBBcnJheSlcblx0XHR0aHJvd0Vycm9yKCdpbnZhbGlkUGFyYW1OYW1lJykgdW5sZXNzIGNoZWNrSWYuaXNCaW5kaW5nSW50ZXJmYWNlKHN1YmplY3QpXG5cblx0aWYgY2hlY2tJZi5pc09iamVjdChzdWJqZWN0KSBhbmQgc3ViamVjdCBub3QgaW5zdGFuY2VvZiBBcnJheSAjIEluZGljYXRlcyBpdCdzIGEgQmluZGluZyBpbnN0YW5jZSBvYmplY3QgZHVlIHRvIHRoZSBhYm92ZSBjaGVja1xuXHRcdGludGVyZmFjZVRvUmV0dXJuID0gaWYgY29tcGxldGVDYWxsYmFjayB0aGVuIGNvbXBsZXRlQ2FsbGJhY2soc3ViamVjdCkgZWxzZSBzdWJqZWN0LnNlbGZDbG9uZSgpXG5cdFxuXHRlbHNlXG5cdFx0bmV3SW50ZXJmYWNlID0gbmV3IEJpbmRpbmdJbnRlcmZhY2Uob3B0aW9ucylcblx0XHRuZXdJbnRlcmZhY2Uuc2F2ZU9wdGlvbnMgPSBzYXZlT3B0aW9uc1xuXHRcdG5ld0ludGVyZmFjZS5pc1N1YiA9IGlzU3ViXG5cdFx0bmV3SW50ZXJmYWNlLmNvbXBsZXRlQ2FsbGJhY2sgPSBjb21wbGV0ZUNhbGxiYWNrXG5cblx0XHRpZiBjaGVja0lmLmlzRnVuY3Rpb24oc3ViamVjdClcblx0XHRcdGludGVyZmFjZVRvUmV0dXJuID0gbmV3SW50ZXJmYWNlLnNldE9iamVjdChzdWJqZWN0LCB0cnVlKVxuXHRcdGVsc2Vcblx0XHRcdGludGVyZmFjZVRvUmV0dXJuID0gbmV3SW50ZXJmYWNlLnNldFByb3BlcnR5KHN1YmplY3QpXG5cblx0cmV0dXJuIGludGVyZmFjZVRvUmV0dXJuXG5cblxuXG5cbmltcG9ydCAnLi9tZXRob2RzJyIsIlNpbXBseUJpbmQudmVyc2lvbiA9IGltcG9ydCAnLi4vLi4vcGFja2FnZS5qc29uICQgdmVyc2lvbidcblNpbXBseUJpbmQuc2V0dGluZ3MgPSBzZXR0aW5nc1xuU2ltcGx5QmluZC5kZWZhdWx0T3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zXG5cblxuXG5TaW1wbHlCaW5kLnVuQmluZEFsbCA9IChvYmplY3QsIGJvdGhXYXlzKS0+XG5cdGlmIG9iamVjdCBhbmQgKGNoZWNrSWYuaXNPYmplY3Qob2JqZWN0KSBvciBjaGVja0lmLmlzRnVuY3Rpb24ob2JqZWN0KSlcblx0XHRpbXBvcnQgJy4vbWV0aG9kcy51bkJpbmRBbGwtcGFyc2VET01PYmplY3QuY29mZmVlJ1xuXHRcdHByb3BNYXAgPSBvYmplY3QuX3NiX21hcFx0XHRcblxuXHRcdGlmIG9iamVjdC5fc2JfSURcblx0XHRcdGJvdW5kSW5zdGFuY2VzW29iamVjdC5fc2JfSURdLnJlbW92ZUFsbFN1YnMoYm90aFdheXMpXG5cdFx0XG5cdFx0aWYgcHJvcE1hcFxuXHRcdFx0Ym91bmRJbnN0YW5jZXNbYm91bmRJRF0ucmVtb3ZlQWxsU3Vicyhib3RoV2F5cykgZm9yIHByb3AsIGJvdW5kSUQgb2YgcHJvcE1hcFxuXG5cdHJldHVyblxuXG4iLCJ7XG4gIFwiX2FyZ3NcIjogW1xuICAgIFtcbiAgICAgIFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRAMS4xNS44XCIsXG4gICAgICBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIlxuICAgIF1cbiAgXSxcbiAgXCJfZnJvbVwiOiBcIkBkYW5pZWxrYWxlbi9zaW1wbHliaW5kQDEuMTUuOFwiLFxuICBcIl9pZFwiOiBcIkBkYW5pZWxrYWxlbi9zaW1wbHliaW5kQDEuMTUuOFwiLFxuICBcIl9pbkJ1bmRsZVwiOiBmYWxzZSxcbiAgXCJfaW50ZWdyaXR5XCI6IFwic2hhNTEyLXJrbCt3SGJiQ29QbzJBM1ZOREF0NXV5VlgrbEJIb2VOWmZEQW9JVk5zbFJFVUFGOVpLa1A2c1lwOXlxRkxOWTNqbXI4bCt5eU1xTUdzeHFCWkd6NTh3PT1cIixcbiAgXCJfbG9jYXRpb25cIjogXCIvQGRhbmllbGthbGVuL3NpbXBseWJpbmRcIixcbiAgXCJfcGhhbnRvbUNoaWxkcmVuXCI6IHt9LFxuICBcIl9yZXF1ZXN0ZWRcIjoge1xuICAgIFwidHlwZVwiOiBcInZlcnNpb25cIixcbiAgICBcInJlZ2lzdHJ5XCI6IHRydWUsXG4gICAgXCJyYXdcIjogXCJAZGFuaWVsa2FsZW4vc2ltcGx5YmluZEAxLjE1LjhcIixcbiAgICBcIm5hbWVcIjogXCJAZGFuaWVsa2FsZW4vc2ltcGx5YmluZFwiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJAZGFuaWVsa2FsZW4lMmZzaW1wbHliaW5kXCIsXG4gICAgXCJzY29wZVwiOiBcIkBkYW5pZWxrYWxlblwiLFxuICAgIFwicmF3U3BlY1wiOiBcIjEuMTUuOFwiLFxuICAgIFwic2F2ZVNwZWNcIjogbnVsbCxcbiAgICBcImZldGNoU3BlY1wiOiBcIjEuMTUuOFwiXG4gIH0sXG4gIFwiX3JlcXVpcmVkQnlcIjogW1xuICAgIFwiL1wiXG4gIF0sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvQGRhbmllbGthbGVuL3NpbXBseWJpbmQvLS9zaW1wbHliaW5kLTEuMTUuOC50Z3pcIixcbiAgXCJfc3BlY1wiOiBcIjEuMTUuOFwiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcImRhbmllbGthbGVuXCJcbiAgfSxcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGlzdC9zaW1wbHliaW5kLm5vZGUuZGVidWcuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCIsXG4gICAgXCIuL2RlYnVnXCI6IFwiZGlzdC9zaW1wbHliaW5kLmRlYnVnLmpzXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zaW1wbHliaW5kL2lzc3Vlc1wiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHt9LFxuICBcImRlc2NyaXB0aW9uXCI6IFwiTWFnaWNhbGx5IHNpbXBsZSwgZnJhbWV3b3JrLWxlc3Mgb25lLXdheS90d28td2F5IGRhdGEgYmluZGluZyBmb3IgZnJvbnRlbmQvYmFja2VuZCBpbiB+NWtiLlwiLFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY29mZmVlLXNjcmlwdFwiOiBcIl4xLjEyLjZcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4xXCIsXG4gICAgXCJwcm9taXNlLWJyZWFrXCI6IFwiXjAuMS4xXCIsXG4gICAgXCJzZW12ZXJcIjogXCJeNS4zLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuMC1zNFwiLFxuICAgIFwic2ltcGx5d2F0Y2hcIjogXCJeMy4wLjAtbDJcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3NpbXBseWJpbmQjcmVhZG1lXCIsXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwiYmluZFwiLFxuICAgIFwiYmluZGluZ1wiLFxuICAgIFwiZG9tLWJpbmRpbmdcIixcbiAgICBcIm9uZS13YXlcIixcbiAgICBcInR3by13YXlcIlxuICBdLFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9zaW1wbHliaW5kLm5vZGUuZGVidWcuanNcIixcbiAgXCJuYW1lXCI6IFwiQGRhbmllbGthbGVuL3NpbXBseWJpbmRcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vc2ltcGx5YmluZC5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYmVuY2htYXJrc1wiOiBcImNha2UgaW5zdGFsbDpiZW5jaDsgbnBtIHJ1biBiZW5jaG1hcmtzOmJ1aWxkICYmIG5wbSBydW4gYmVuY2htYXJrczpzZXJ2ZVwiLFxuICAgIFwiYmVuY2htYXJrczpidWlsZFwiOiBcImJlbmNobWFya3MgYnVpbGQgLXMgYmVuY2htYXJrcy9zcmMgLWQgYmVuY2htYXJrcy9kZXN0XCIsXG4gICAgXCJiZW5jaG1hcmtzOnJ1blwiOiBcImJlbmNobWFya3MgcnVuIC1kIGJlbmNobWFya3MvZGVzdFwiLFxuICAgIFwiYmVuY2htYXJrczpzZXJ2ZVwiOiBcImJlbmNobWFya3Mgc2VydmUgLWQgYmVuY2htYXJrcy9kZXN0XCIsXG4gICAgXCJiZW5jaG1hcmtzOnVwZGF0ZVwiOiBcImNha2UgaW5zdGFsbDpiZW5jaDsgY2FrZSB1cGRhdGVTQkJlbmNoOyBucG0gcnVuIGJlbmNobWFya3M6YnVpbGRcIixcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLi8uY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiaXN0YW5idWwgY292ZXIgLS1kaXIgY292ZXJhZ2Uvbm9kZSBub2RlX21vZHVsZXMvbW9jaGEvYmluL19tb2NoYSAtLSAtdSB0ZGQgLWIgdGVzdC90ZXN0SGVscGVycy5qcyB0ZXN0L3Rlc3QuanNcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBucG0gcnVuIGJlbmNobWFya3M6dXBkYXRlICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJucG0gcnVuIHRlc3RcIixcbiAgICBcInRlc3RcIjogXCJucG0gcnVuIHRlc3Q6bm9kZSAtcyAmJiBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyAmJiBucG0gcnVuIHRlc3Q6bWluaWZpZWQgLXNcIixcbiAgICBcInRlc3Q6YnJvd3NlclwiOiBcImNha2UgaW5zdGFsbDprYXJtYTsga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgRWxlY3Ryb24gLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpicm93c2VyOmxvY2FsXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IG9wZW4gdGVzdC90ZXN0cnVubmVyLmh0bWxcIixcbiAgICBcInRlc3Q6a2FybWFcIjogXCJjYWtlIGluc3RhbGw6a2FybWE7IGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6bWluaWZpZWRcIjogXCJtaW5pZmllZD0xIG5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6bm9kZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBtb2NoYSAtdSB0ZGQgLS1jb21waWxlcnMgY29mZmVlOmNvZmZlZS1yZWdpc3RlciB0ZXN0L25vZGUuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOmthcm1hOyBzYXVjZT0xIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcIndhdGNoXCI6IFwiY2FrZSAtZCB3YXRjaFwiXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcImZpbmFsVHJhbnNmb3JtXCI6IFtcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zdXBlclwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXJlbmFtZVwiLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXNpbXBsZVwiXG4gICAgXVxuICB9LFxuICBcInZlcnNpb25cIjogXCIxLjE1LjhcIlxufVxuIiwiIyMjKlxuICogQ29uZGl0aW9uYWwgQ2hlY2tzOlxuICpcbiAqIDEpIE1ha2Ugc3VyZSB0aGUgc3ViamVjdCBvYmplY3QgaXMgaXRlcmFibGUgKGFuZCB0aHVzIGEgcG9zc2libGUgY2FuZGlkYXRlIGZvciBiZWluZyBhbiBlbGVtZW50IGNvbGxlY3Rpb24pXG4gKiAyKSBNYWtlIHN1cmUgdGhlIHN1YmplY3Qgb2JqZWN0IGlzbid0IGFuIGFycmF5IGJpbmRpbmcgKHNpbmNlIGVsZW1lbnQgY29sbGVjdGlvbiBvYmplY3RzIGRvbid0IGdldCBkaXJlY3RseSBib3VuZClcbiAqIDMpIE1ha2Ugc3VyZSB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbiBpcyBhIHZhbGlkIG9iamVjdCAoaS5lLiBpc24ndCB1bmRlZmluZWQgYW5kIGlzbid0IG51bGwpXG4gKiA0KSBNYWtlIHN1cmUgdGhlIGZpcnN0IGVsZW1lbnQgaXMgYSBET00gb2JqZWN0XG4jIyNcbmlmIGNoZWNrSWYuaXNJdGVyYWJsZShvYmplY3QpIGFuZCBub3Qgb2JqZWN0Ll9zYl9JRCBhbmQgb2JqZWN0WzBdIGFuZCAoY2hlY2tJZi5pc0RvbShvYmplY3RbMF0pKVxuXHRvYmplY3QgPSBvYmplY3RbMF0iLCJCaW5kaW5nID0gKG9iamVjdCwgdHlwZSwgc3RhdGUpLT5cblx0ZXh0ZW5kU3RhdGUoQCwgc3RhdGUpXG5cdEBvcHRpb25zRGVmYXVsdCA9IGlmIEBzYXZlT3B0aW9ucyB0aGVuIEBvcHRpb25zIGVsc2UgZGVmYXVsdE9wdGlvbnNcblx0QHR5cGUgPSB0eXBlXHRcdFx0XHRcdFx0XHQjIE9iamVjdFByb3AgfCBBcnJheSB8IEZ1bmMgfCBQcm94eSB8IEV2ZW50IHwgUGhvbGRlciB8IERPTUF0dHIgfCBET01DaGVja2JveCB8IERPTVJhZGlvXG5cdEBvYmplY3QgPSBvYmplY3QgXHRcdFx0XHRcdFx0IyBUaGUgc3ViamVjdCBvYmplY3Qgb2YgdGhpcyBiaW5kaW5nLCBpLmUuIGZ1bmN0aW9uLCBhcnJheSwge30sIERPTSBlbCwgZXRjLlxuXHRASUQgPSBnZW5JRCgpIFx0XHRcdFx0XHRcdFx0IyBBc3NpZ25lZCBvbmx5IGFmdGVyIHBhc3NpbmcgYSB2YWxpZCBvYmplY3QgdG8gLm9mKClcblx0QHN1YnMgPSBbXVx0XHRcdFx0XHRcdFx0XHQjIFN1YnNjcmliZXJzIGFycmF5IGxpc3RpbmcgYWxsIG9mIHRoZSBvYmplY3RzIHRoYXQgd2lsbCBiZSB1cGRhdGVkIHVwb24gdmFsdWUgdXBkYXRlXG5cdEBzdWJzTWV0YSA9IGdlbk9iaigpXHRcdFx0XHRcdCMgTWFwIHN1YnNjcmliZXJzJyBJRCB0byB0aGVpciBtZXRhZGF0YSAoaS5lLiBvcHRpb25zLCB0cmFuc2Zvcm0sIGNvbmRpdGlvbiwgb25lLXRpbWUtYmluZGluZywgZXRjLilcblx0QHB1YnNNYXAgPSBnZW5PYmooKVx0XHRcdFx0XHRcdCMgTWFwIHB1Ymxpc2hlcnMgKGJpbmRpbmdzIHRoYXQgdXBkYXRlIHRoaXMgYmluZGluZykgYnkgdGhlaXIgSURcblx0QGF0dGFjaGVkRXZlbnRzID0gW11cdFx0XHRcdFx0IyBBcnJheSBsaXN0aW5nIGFsbCBvZiB0aGUgZXZlbnRzIGN1cnJlbnRseSBsaXN0ZW5lZCBvbiBAb2JqZWN0XG5cdEBzZXRWYWx1ZSA9IHNldFZhbHVlTm9vcCBpZiBAdHlwZSBpcyAnUHJveHknXG5cblx0IyA9PT09IFByb3BlcnRpZXMgZGVjbGFyZWQgbGF0ZXIgb3IgaW5oZXJpdGVkIGZyb20gYmluZGluZyBpbnRlcmZhY2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgQG9wdGlvbnMgPSBvcHRpb25zXG5cdCMgQHZhbHVlID0gdW5kZWZpbmVkIFx0XHRcdFx0XHQjIFdpbGwgcmVwcmVzZW50IHRoZSBhY3R1YWwgY3VycmVudCB2YWx1ZSBvZiB0aGUgYmluZGluZy9vYmplY3Rcblx0IyBAcHJvcGVydHkgPSBwcm9wZXJ0eVx0XHRcdFx0XHQjIFRoZSBwcm9wZXJ0eSBuYW1lIG9yIGFycmF5IGluZGV4IG9yIGV2ZW50IGNhbGxiYWNrIGFyZ3VtZW50XG5cdCMgQHNlbGVjdG9yID0gc2VsZWN0b3JcdFx0XHRcdFx0IyBUaGUgcHJvcGVydHkgbmFtZSBvciBhcnJheSBpbmRleCBvciBldmVudCBjYWxsYmFjayBhcmd1bWVudFxuXHQjIEBvcmlnRm4gPSBGdW5jdGlvblx0XHRcdFx0XHQjIFRoZSBvcmlnaW5hbCBwcm94aWVkIGZ1bmN0aW9uIHBhc3NlZCB0byBQcm94eSBiaW5kaW5nc1xuXHQjIEBjdXN0b21FdmVudE1ldGhvZCA9IHt9XHRcdFx0XHQjIE5hbWVzIG9mIHRoZSBldmVudCBlbWl0dGVyL3RyaWdnZXIgbWV0aG9kcyAoaWYgYXBwbGljYWJsZSlcblx0IyBAcGhvbGRlckNvbnRleHRzID0ge31cdFx0XHRcdFx0IyBQbGFjZWhvbGRlciBzdXJyb3VuZGluZ3MgKG9yaWdpbmFsIGJpbmRpbmcgdmFsdWUgc3BsaXQgYnkgdGhlIHBsYWNlaG9sZGVyIHJlZ0V4KVxuXHQjIEBwaG9sZGVySW5kZXhNYXAgPSB7fVx0XHRcdFx0XHQjIFBsYWNlaG9sZGVyIG9jY3VyZW5jZSBtYXBwaW5nLCBpLmUuIHRoZSBwbGFjZWhvbGRlciBuYW1lIGZvciBlYWNoIHBsYWNlaG9sZGVyIG9jY3VyZW5jZVxuXHQjIEBwbGFjZWhvbGRlciA9IFwiXCJcdFx0XHRcdFx0XHQjIFRoZSBsYXN0IHNwZWNpZmllZCBwbGFjZWhvbGRlciB0byBiaW5kIHRoZSB2YWx1ZSB0b1xuXHQjIEBkZXNjcmlwdG9yID0gW11cdFx0XHRcdFx0XHQjIERlc2NyaWJlcyB0aGUgdHlwZSBvZiBwcm9wZXJ0eSwgaS5lLiAnYXR0cjpkYXRhLW5hbWUnIHRvIGluZGljYXRlIGEgRE9NQXR0ciB0eXBlIGJpbmRpbmdcblx0IyBAaXNMaXZlUHJvcCA9IEJvb2xlYW5cdFx0XHRcdFx0IyBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdGhlIE9iamVjdC9PYmplY3QncyBwcm9wZXR5IGhhdmUgYmVlbiBtb2RpZmllZCB0byBiZSBhIGxpdmUgcHJvcGVydHlcblx0IyBAaXNEb20gPSBCb29sZWFuXHRcdFx0XHRcdFx0IyBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdGhlIGJpbmRpbmcncyBvYmplY3QgaXMgYSBET00gb2JqZWN0XG5cdCMgQHBvbGxJbnRlcnZhbCA9IElEXHRcdFx0XHRcdCMgVGhlIGludGVydmFsIElEIG9mIHRoZSB0aW1lciB0aGF0IG1hbnVhbGx5IHBvbGxzIHRoZSBvYmplY3QncyB2YWx1ZSBhdCBhIHNldCBpbnRlcnZhbFxuXHQjIEBhcnJheUJpbmRpbmcgPSBCaW5kaW5nXHRcdFx0XHQjIFJlZmVyZW5jZSB0byB0aGUgcGFyZW50IGFycmF5IGJpbmRpbmcgKGlmIGV4aXN0cykgZm9yIGFuIGluZGV4LW9mLWFycmF5IGJpbmRpbmcgKGkuZS4gU2ltcGx5QmluZChhcnJheSkpXG5cdCMgQGV2ZW50TmFtZSA9IFwiXCJcdFx0XHRcdFx0XHQjIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0aGlzIGJpbmRpbmcgaXMgbGlzdGVuaW5nIHRvIChmb3IgRXZlbnQgdHlwZSBiaW5kaW5ncylcblx0IyBAaXNFbWl0dGVyID0gQm9vbGVhbiBcdFx0XHRcdFx0IyBUcmFja2VyIHRvIGxldCB1cyBrbm93IHdlIHNob3VsZG4ndCBoYW5kbGUgdGhlIGV2ZW50IHVwZGF0ZSB3ZSByZWNlaXZlZCBhcyBpdCBpcyB0aGUgZXZlbnQgdGhpcyBiaW5kaW5nIGp1c3QgZW1pdHRlZFxuXHQjIEBldmVudEhhbmRsZXIgPSBGdW5jdGlvbiBcdFx0XHRcdCMgVGhlIGNhbGxiYWNrIHRoYXQgZ2V0cyB0cmlnZ2VyZWQgdXBvbiBhbiBldmVudCBlbWl0dGFuY2UgKGZvciBFdmVuIHR5cGUgYmluZGluZ3MpXG5cdCMgQGV2ZW50T2JqZWN0ID0gRXZlbnQgXHRcdFx0XHRcdCMgVGhlIGRpc3BhdGNoZWQgZXZlbnQgb2JqZWN0IChmb3IgRXZlbnQgdHlwZSBiaW5kaW5ncylcblx0IyBAc2VsZlRyYW5zZm9ybSA9IEZ1bmN0aW9uIFx0XHRcdCMgVGhlIHRyYW5zZm9ybSBmdW5jdGlvbiB0aGF0IG5ldyB2YWx1ZXMgYmVpbmcgc2V0IHRvIHRoaXMgYmluZGluZyBhcmUgYmVpbmcgcGFzc2VkIHRocm91Z2ggZHVyaW5nIEBzZXRWYWx1ZSAoaWYgYXBwbGljYWJsZSlcblx0IyBAc2VsZlVwZGF0ZXIgPSBGdW5jdGlvbiBcdFx0XHRcdCMgQSBGdW5jLXR5cGUgQmluZGluZyB3aGljaCBpbnZva2VzIEBzZXRWYWx1ZShAZmV0Y2hEaXJlY3RWYWx1ZSgpKSB1cG9uIGNoYW5nZS4gQ3JlYXRlZCBpbiBAY29udmVydFRvTGl2ZSgpIGZvciBBcnJheSBiaW5kaW5ncyAmIGluIGludGVyZmFjZS51cGRhdGVPbigpXG5cdCMgQGlzQXN5bmMgPSBCb29sZWFuXHRcdFx0XHRcdCMgSW5kaWNhdGVzIGlmIHRoaXMgaXMgYW4gYXN5bmMgYmluZGluZyAoY3VycmVudGx5IG9ubHkgdXNlZCBmb3IgRXZlbnQgYmluZGluZ3MpXG5cdCMjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAjIyNcblxuXHRpZiBAaXNNdWx0aUNob2ljZSAjIFRydWUgaWYgQG9iamVjdCBpcyBhIHJhZGlvL2NoZWNrYm94IGNvbGxlY3Rpb25cblx0XHRAY2hvaWNlcyA9IGdlbk9iaigpXG5cdFx0XG5cdFx0QG9iamVjdC5mb3JFYWNoIChjaG9pY2VFbCk9PlxuXHRcdFx0Y2hvaWNlQmluZGluZyA9IEBjaG9pY2VzW2Nob2ljZUVsLnZhbHVlXSA9IFNpbXBseUJpbmQoJ2NoZWNrZWQnKS5vZihjaG9pY2VFbCkuX1xuXHRcdFx0Y2hvaWNlQmluZGluZy5hZGRTdWIoQClcblx0XHRcdGNob2ljZUJpbmRpbmcuc3Vic01ldGFbQElEXS50cmFuc2Zvcm1GbiA9ICgpLT4gY2hvaWNlQmluZGluZ1xuXHRcdFx0Y2hvaWNlQmluZGluZy5ncm91cEJpbmRpbmcgPSBAXG5cdFx0XHRyZXR1cm5cblx0XG5cblx0dW5sZXNzIEB0eXBlIGlzICdFdmVudCcgb3IgKEB0eXBlIGlzICdGdW5jJyBhbmQgQGlzU3ViKSAjIHRoZSBzZWNvbmQgY29uZGl0aW9uIHdpbGwgcHJldmVudCBmdW5jdGlvbiBzdWJzY3JpYmVycyBmcm9tIGJlaW5nIGludm9rZWQgb24gdGhpcyBiaW5kaW5nIGNyZWF0aW9uXG5cdFx0aWYgQHR5cGUgaXMgJ1Bob2xkZXInXG5cdFx0XHRwYXJlbnRQcm9wZXJ0eSA9IGlmIEBkZXNjcmlwdG9yIGFuZCBub3QgdGFyZ2V0SW5jbHVkZXMoQGRlc2NyaXB0b3IsICdtdWx0aScpIHRoZW4gXCIje0BkZXNjcmlwdG9yfToje0Bwcm9wZXJ0eX1cIiBlbHNlIEBwcm9wZXJ0eVxuXHRcdFx0XG5cdFx0XHRcblx0XHRcdHBhcmVudEJpbmRpbmcgPSBAcGFyZW50QmluZGluZyA9IFNpbXBseUJpbmQocGFyZW50UHJvcGVydHkpLm9mKG9iamVjdCkuX1xuXHRcdFx0cGFyZW50QmluZGluZy5zY2FuRm9yUGhvbGRlcnMoKVxuXHRcdFx0QHZhbHVlID0gcGFyZW50QmluZGluZy5waG9sZGVyVmFsdWVzW0BwaG9sZGVyXVxuXHRcdFxuXHRcdFx0QHRleHROb2RlcyA9IHBhcmVudEJpbmRpbmcudGV4dE5vZGVzW0BwaG9sZGVyXSBpZiBwYXJlbnRCaW5kaW5nLnRleHROb2Rlc1xuXHRcdFxuXG5cdFx0ZWxzZVxuXHRcdFx0QHZhbHVlID0gc3ViamVjdFZhbHVlID0gQGZldGNoRGlyZWN0VmFsdWUoKVxuXHRcdFxuXHRcdFx0aWYgQHR5cGUgaXMgJ09iamVjdFByb3AnIGFuZCBub3QgY2hlY2tJZi5pc0RlZmluZWQoc3ViamVjdFZhbHVlKSBhbmQgbm90IGdldERlc2NyaXB0b3IoQG9iamVjdCwgQHByb3BlcnR5KVxuXHRcdFx0XHRAb2JqZWN0W0Bwcm9wZXJ0eV0gPSBzdWJqZWN0VmFsdWUgIyBEZWZpbmUgdGhlIHByb3Agb24gdGhlIG9iamVjdCBpZiBpdCBub24tZXhpc3RlbnRcblxuXHRcdFx0Y29udmVydFRvTGl2ZShALCBAb2JqZWN0KVxuXG5cblx0QGF0dGFjaEV2ZW50cygpXG5cdHJldHVybiBib3VuZEluc3RhbmNlc1tASURdID0gQFxuXG5cblxuXG5cbmltcG9ydCAnLi9wcm90b3R5cGUnXG4iLCJCaW5kaW5nOjogPVxuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIyBTdWJzY3JpYmVyIE1hbmFnZW1lbnRcblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gXG5cdGFkZFN1YjogKHN1Yiwgb3B0aW9ucywgdXBkYXRlT25jZSwgdXBkYXRlRXZlbklmU2FtZSktPlxuXHRcdGlmIHN1Yi5pc011bHRpXG5cdFx0XHRAYWRkU3ViKHN1Ykl0ZW0sIG9wdGlvbnMsIHVwZGF0ZU9uY2UsIHVwZGF0ZUV2ZW5JZlNhbWUpIGZvciBzdWJJdGVtIGluIHN1Yi5iaW5kaW5nc1xuXHRcdGVsc2Vcblx0XHRcdGlmIG1ldGFEYXRhPUBzdWJzTWV0YVtzdWIuSURdXG5cdFx0XHRcdGFscmVhZHlIYWRTdWIgPSB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHN1Yi5wdWJzTWFwW0BJRF0gPSBAXG5cdFx0XHRcdEBzdWJzLnVuc2hpZnQoc3ViKVxuXHRcdFx0XHRcblx0XHRcdFx0bWV0YURhdGEgPSBAc3Vic01ldGFbc3ViLklEXSA9IGdlbk9iaigpXG5cdFx0XHRcdG1ldGFEYXRhLnVwZGF0ZU9uY2UgPSB1cGRhdGVPbmNlXG5cdFx0XHRcdG1ldGFEYXRhLm9wdHMgPSBjbG9uZU9iamVjdChvcHRpb25zKVxuXHRcdFx0XHRtZXRhRGF0YS5vcHRzLnVwZGF0ZUV2ZW5JZlNhbWUgPSB0cnVlIGlmIHVwZGF0ZUV2ZW5JZlNhbWUgb3IgQHR5cGUgaXMgJ0V2ZW50JyBvciBAdHlwZSBpcyAnUHJveHknIG9yIEB0eXBlIGlzICdBcnJheSdcblx0XHRcdFx0bWV0YURhdGEudmFsdWVSZWYgPSBpZiBzdWIudHlwZSBpcyAnRnVuYycgdGhlbiAndmFsdWVQYXNzZWQnIGVsc2UgJ3ZhbHVlJ1xuXHRcdFx0XG5cdFx0cmV0dXJuIGFscmVhZHlIYWRTdWJcblxuXG5cblx0cmVtb3ZlU3ViOiAoc3ViLCBib3RoV2F5cyktPlxuXHRcdGlmIHN1Yi5pc011bHRpXG5cdFx0XHRAcmVtb3ZlU3ViKHN1Ykl0ZW0sIGJvdGhXYXlzKSBmb3Igc3ViSXRlbSBpbiBzdWIuYmluZGluZ3Ncblx0XHRlbHNlXG5cdFx0XHRpZiBAc3Vic01ldGFbc3ViLklEXVxuXHRcdFx0XHRAc3Vicy5zcGxpY2UoQHN1YnMuaW5kZXhPZihzdWIpLCAxKVxuXHRcdFx0XHRkZWxldGUgQHN1YnNNZXRhW3N1Yi5JRF1cblx0XHRcdFx0ZGVsZXRlIHN1Yi5wdWJzTWFwW0BJRF1cblxuXHRcdFx0aWYgYm90aFdheXNcblx0XHRcdFx0c3ViLnJlbW92ZVN1YihAKVxuXHRcdFx0XHRkZWxldGUgQHB1YnNNYXBbc3ViLklEXVxuXG5cdFx0aWYgQHN1YnMubGVuZ3RoIGlzIDAgYW5kIE9iamVjdC5rZXlzKEBwdWJzTWFwKS5sZW5ndGggaXMgMFxuXHRcdFx0QGRlc3Ryb3koKSAjIFNpbmNlIGl0J3Mgbm8gbG9uZ2VyIGEgc3Vic2NyaWJlciBvciBoYXMgYW55IHN1YnNjcmliZXJzXG5cdFxuXHRcdHJldHVyblxuXG5cdFxuXG5cdHJlbW92ZUFsbFN1YnM6IChib3RoV2F5cyktPlxuXHRcdEByZW1vdmVTdWIoc3ViLCBib3RoV2F5cykgZm9yIHN1YiBpbiBAc3Vicy5zbGljZSgpXG5cdFx0cmV0dXJuXG5cblxuXG5cblx0ZGVzdHJveTogKCktPiAjIFJlc2V0cyBvYmplY3QgdG8gaW5pdGlhbCBzdGF0ZSAocHJlLWJpbmRpbmcgc3RhdGUpXG5cdFx0ZGVsZXRlIGJvdW5kSW5zdGFuY2VzW0BJRF1cblx0XHRAcmVtb3ZlUG9sbEludGVydmFsKClcblx0XHRcblx0XHRpZiBAdHlwZSBpcyAnRXZlbnQnXG5cdFx0XHRAdW5SZWdpc3RlckV2ZW50KGV2ZW50KSBmb3IgZXZlbnQgaW4gQGF0dGFjaGVkRXZlbnRzXG5cdFx0XG5cdFx0ZWxzZSBpZiBAdHlwZSBpcyAnRnVuYydcblx0XHRcdGRlbGV0ZSBAb2JqZWN0Ll9zYl9JRFxuXG5cdFx0IyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuXHRcdGNvbnZlcnRUb1JlZyhALCBAb2JqZWN0KSBpZiBAaXNMaXZlUHJvcCBhbmQgQG9yaWdEZXNjcmlwdG9yXG5cdFx0Y29udmVydFRvUmVnKEAsIEB2YWx1ZSwgdHJ1ZSkgaWYgQHR5cGUgaXMgJ0FycmF5J1xuXHRcdFxuXHRcdGlmIEBvYmplY3QuX3NiX21hcFxuXHRcdFx0ZGVsZXRlIEBvYmplY3QuX3NiX21hcFtAc2VsZWN0b3JdXG5cdFx0XHRkZWxldGUgQG9iamVjdC5fc2JfbWFwIGlmIE9iamVjdC5rZXlzKEBvYmplY3QuX3NiX21hcCkubGVuZ3RoIGlzIDBcblxuXG5cdFx0cmV0dXJuXG5cblxuXG5cblxuXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMjIFZhbHVlIHNldC9nZXRcblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gXG5cdGZldGNoRGlyZWN0VmFsdWU6ICgpLT5cblx0XHR0eXBlID0gQHR5cGVcblx0XHRzd2l0Y2hcblx0XHRcdHdoZW4gdHlwZSBpcyAnRnVuYycgdGhlbiBAb2JqZWN0KClcblx0XHRcdFxuXHRcdFx0d2hlbiB0eXBlIGlzICdET01BdHRyJyB0aGVuIEBvYmplY3QuZ2V0QXR0cmlidXRlKEBwcm9wZXJ0eSkgb3IgJydcblxuXHRcdFx0d2hlbiBAaXNNdWx0aUNob2ljZVxuXHRcdFx0XHRyZXN1bHRzID0gW11cblx0XHRcdFx0Zm9yIGNob2ljZU5hbWUsY2hvaWNlRWwgb2YgQGNob2ljZXNcblx0XHRcdFx0XHRpZiBjaG9pY2VFbC5vYmplY3QuY2hlY2tlZFxuXHRcdFx0XHRcdFx0aWYgdHlwZSBpcyAnRE9NUmFkaW8nXG5cdFx0XHRcdFx0XHRcdHJldHVybiBjaG9pY2VOYW1lXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaCBjaG9pY2VOYW1lXG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcblx0XHRcblx0XHRcdGVsc2UgQG9iamVjdFtAcHJvcGVydHldXG5cdFxuXG5cblxuXHRzZXRWYWx1ZTogKG5ld1ZhbHVlLCBwdWJsaXNoZXIsIGZyb21TZWxmLCBmcm9tQ2hhbmdlRXZlbnQpLT4gIyBmcm9tU2VsZj09PXRydWUgd2hlbiBjYWxsZWQgZnJvbSBldmVudFVwZGF0ZUhhbmRsZXIgb3IgcHJvcGVydHkgZGVzY3JpcHRvciBzZXR0ZXIgKHVubGVzcyBpdCdzIGFuIEFycmF5IGJpbmRpbmcpXG5cdFx0cHVibGlzaGVyIHx8PSBAXG5cdFx0bmV3VmFsdWUgPSBAc2VsZlRyYW5zZm9ybShuZXdWYWx1ZSkgaWYgQHNlbGZUcmFuc2Zvcm1cblx0XHRcblx0XHR1bmxlc3MgZnJvbVNlbGYgdGhlbiBzd2l0Y2ggQHR5cGVcblx0XHRcdHdoZW4gJ09iamVjdFByb3AnXG5cdFx0XHRcdGlmIG5vdCBAaXNMaXZlUHJvcFxuXHRcdFx0XHRcdEBvYmplY3RbQHByb3BlcnR5XSA9IG5ld1ZhbHVlIGlmIG5ld1ZhbHVlIGlzbnQgQHZhbHVlXG5cdFx0XHRcdGltcG9ydElubGluZSAnLi9wcm90b3R5cGUuc2V0VmFsdWUtT2JqZWN0UHJvcC1ET01WYWx1ZSdcblx0XHRcdFx0ZWxzZSBpZiBAb3JpZ1NldHRlclxuXHRcdFx0XHRcdEBvcmlnU2V0dGVyKG5ld1ZhbHVlKVxuXG5cblx0XHRcdHdoZW4gJ1Bob2xkZXInXG5cdFx0XHRcdHBhcmVudCA9IEBwYXJlbnRCaW5kaW5nXG5cdFx0XHRcdHBhcmVudC5waG9sZGVyVmFsdWVzW0BwaG9sZGVyXSA9IG5ld1ZhbHVlXG5cdFx0XHRcdGVudGlyZVZhbHVlID0gYXBwbHlQbGFjZWhvbGRlcnMocGFyZW50LnBob2xkZXJDb250ZXh0cywgcGFyZW50LnBob2xkZXJWYWx1ZXMsIHBhcmVudC5waG9sZGVySW5kZXhNYXApXG5cblx0XHRcdFx0aWYgQHRleHROb2RlcyBhbmQgbmV3VmFsdWUgaXNudCBAdmFsdWVcblx0XHRcdFx0XHRmb3IgdGV4dE5vZGUgaW4gQHRleHROb2Rlc1xuXHRcdFx0XHRcdFx0dGV4dE5vZGVbdGV4dENvbnRlbnRdID0gbmV3VmFsdWVcblx0XHRcdFx0XG5cdFx0XHRcdHBhcmVudC5zZXRWYWx1ZShlbnRpcmVWYWx1ZSwgcHVibGlzaGVyKSB1bmxlc3MgQHByb3BlcnR5IGlzIHRleHRDb250ZW50XG5cdFx0XHRcdFxuXG5cblx0XHRcdHdoZW4gJ0FycmF5J1xuXHRcdFx0XHRpZiBuZXdWYWx1ZSBpc250IEB2YWx1ZVxuXHRcdFx0XHRcdG5ld1ZhbHVlID0gQXJyYXk6OmNvbmNhdChuZXdWYWx1ZSkgaWYgbm90IGNoZWNrSWYuaXNBcnJheShuZXdWYWx1ZSlcblx0XHRcdFx0XHRjb252ZXJ0VG9SZWcoQCwgQHZhbHVlLCB0cnVlKVxuXHRcdFx0XHRcdGNvbnZlcnRUb0xpdmUoQCwgbmV3VmFsdWU9bmV3VmFsdWUuc2xpY2UoKSwgdHJ1ZSlcblx0XHRcdFx0XHRAb3JpZ1NldHRlcihuZXdWYWx1ZSkgaWYgQG9yaWdTZXR0ZXIgIyBXaWxsIHVwZGF0ZSBhbnkgb3RoZXIgcHJldmlvdXMgbm9uLUFycmF5IGJpbmRpbmdzIHRvIHRoZSBzYW1lIG9iamVjdCBwcm9wZXJ0eVxuXG5cblx0XHRcdHdoZW4gJ0Z1bmMnXG5cdFx0XHRcdHByZXZWYWx1ZSA9IEB2YWx1ZVBhc3NlZFxuXHRcdFx0XHRAdmFsdWVQYXNzZWQgPSBuZXdWYWx1ZVxuXHRcdFx0XHRuZXdWYWx1ZSA9IEBvYmplY3QobmV3VmFsdWUsIHByZXZWYWx1ZSlcblxuXHRcdFx0d2hlbiAnRXZlbnQnXG5cdFx0XHRcdEBpc0VtaXR0ZXIgPSB0cnVlXG5cdFx0XHRcdEBlbWl0RXZlbnQobmV3VmFsdWUpXG5cdFx0XHRcdEBpc0VtaXR0ZXIgPSBmYWxzZVxuXHRcdFxuXHRcdFx0aW1wb3J0SW5saW5lICcuL3Byb3RvdHlwZS5zZXRWYWx1ZS1ET01UeXBlcydcblx0XHRcblx0XHRAdmFsdWUgPSBuZXdWYWx1ZVxuXHRcdEB1cGRhdGVBbGxTdWJzKHB1Ymxpc2hlcilcblxuXHRcdHJldHVyblxuXG5cblxuXG5cblx0dXBkYXRlQWxsU3ViczogKHB1Ymxpc2hlciktPiBpZiBpPShhcnI9QHN1YnMpLmxlbmd0aCAjIFVnbHkgc2hvcnRjdXQgZm9yIGluZGV4IGRlZmluaXRpb24gaW4gb3JkZXIgdG8gbGltaXQgbG9naWMgcmVwaXRpaW9uXG5cdFx0QHVwZGF0ZVN1YihhcnJbaV0sIHB1Ymxpc2hlcikgd2hpbGUgaS0tXG5cdFx0cmV0dXJuXG5cblxuXG5cdFx0XHRcblxuXHR1cGRhdGVTdWI6IChzdWIsIHB1Ymxpc2hlciwgaXNEZWxheWVkVXBkYXRlKS0+XG5cdFx0cmV0dXJuIGlmIChwdWJsaXNoZXIgaXMgc3ViKSBvciAocHVibGlzaGVyIGlzbnQgQCBhbmQgcHVibGlzaGVyLnN1YnNNZXRhW3N1Yi5JRF0pICMgaW5kaWNhdGVzIHRoaXMgaXMgYW4gaW5maW5pdGUgbG9vcFxuXHRcdG1ldGEgPSBAc3Vic01ldGFbc3ViLklEXVxuXG5cdFx0aWYgbWV0YS5kaXNhbGxvd0xpc3QgYW5kIG1ldGEuZGlzYWxsb3dMaXN0W3B1Ymxpc2hlci5JRF1cblx0XHRcdHJldHVyblxuXG5cdFx0aWYgbWV0YS5vcHRzLnRocm90dGxlXG5cdFx0XHRjdXJyZW50VGltZSA9ICsobmV3IERhdGUpXG5cdFx0XHR0aW1lUGFzc2VkID0gY3VycmVudFRpbWUgLSBtZXRhLmxhc3RVcGRhdGVcblx0XHRcdFxuXHRcdFx0aWYgdGltZVBhc3NlZCA8IG1ldGEub3B0cy50aHJvdHRsZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQobWV0YS51cGRhdGVUaW1lcilcblx0XHRcdFx0cmV0dXJuIG1ldGEudXBkYXRlVGltZXIgPVxuXHRcdFx0XHRcdHNldFRpbWVvdXQgKCk9PlxuXHRcdFx0XHRcdFx0QHVwZGF0ZVN1YihzdWIsIHB1Ymxpc2hlcikgaWYgQHN1YnNNZXRhW3N1Yi5JRF1cblx0XHRcdFx0XHQsIG1ldGEub3B0cy50aHJvdHRsZS10aW1lUGFzc2VkXG5cdFx0XHRcblx0XHRcdGVsc2Vcblx0XHRcdFx0bWV0YS5sYXN0VXBkYXRlID0gY3VycmVudFRpbWVcblxuXHRcdGVsc2UgaWYgbWV0YS5vcHRzLmRlbGF5IGFuZCBub3QgaXNEZWxheWVkVXBkYXRlXG5cdFx0XHRyZXR1cm4gc2V0VGltZW91dCAoKT0+XG5cdFx0XHRcdEB1cGRhdGVTdWIoc3ViLCBwdWJsaXNoZXIsIHRydWUpIGlmIEBzdWJzTWV0YVtzdWIuSURdXG5cdFx0XHQsIG1ldGEub3B0cy5kZWxheVxuXG5cblx0XHRuZXdWYWx1ZSA9IGlmIEB0eXBlIGlzICdBcnJheScgYW5kIG1ldGEub3B0cy5zZW5kQXJyYXlDb3BpZXMgdGhlbiBAdmFsdWUuc2xpY2UoKSBlbHNlIEB2YWx1ZVxuXHRcdHN1YlZhbHVlID0gc3ViW21ldGEudmFsdWVSZWZdXG5cdFx0bmV3VmFsdWUgPSBpZiB0cmFuc2Zvcm09bWV0YS50cmFuc2Zvcm1GbiB0aGVuIHRyYW5zZm9ybShuZXdWYWx1ZSwgc3ViVmFsdWUsIHN1Yi5vYmplY3QpIGVsc2UgbmV3VmFsdWVcblxuXHRcdHJldHVybiBpZiBuZXdWYWx1ZSBpcyBzdWJWYWx1ZSBhbmQgbm90IG1ldGEub3B0cy51cGRhdGVFdmVuSWZTYW1lIG9yXG5cdFx0XHRtZXRhLmNvbmRpdGlvbkZuIGFuZCBub3QgbWV0YS5jb25kaXRpb25GbihuZXdWYWx1ZSwgc3ViVmFsdWUsIHN1Yi5vYmplY3QpXG5cblx0XHQjIFdoeSBkbyB3ZSBuZWVkIHRoZSAncHJvbWlzZVRyYW5zZm9ybXMnIG9wdGlvbiB3aGVuIHdlIGNhbiBqdXN0IGNoZWNrIGZvciB0aGUgZXhpc3RhbmNlIG9mIC50aGVuIG1ldGhvZD9cblx0XHQjIEJlY2F1c2UgdGVzdHMgc2hvdyB0aGF0IHdoZW4gc2VhcmNoaW5nIGZvciB0aGUgLnRoZW4gcHJvcCBvbiB0aGUgb2JqZWN0IHJlc3VsdHMgaW4gYSBwZXJmb3JtYW5jZSBzbG93ZG93biBvZiB1cCB0byAzMCUhXG5cdFx0IyBDaGVja2luZyBpZiB0aGUgcHJvbWlzZVRyYW5zZm9ybXMgb3B0aW9uIGlzIGVuYWJsZWQgZmlyc3QgZWxpbWluYXRlcyB1bm5lY2Vzc2FyeSBsb29rdXBzICYgc2xvd2Rvd25zLlxuXHRcdGlmIG1ldGEub3B0cy5wcm9taXNlVHJhbnNmb3JtcyBhbmQgbmV3VmFsdWUgYW5kIGNoZWNrSWYuaXNGdW5jdGlvbihuZXdWYWx1ZS50aGVuKVxuXHRcdFx0bmV3VmFsdWUudGhlbiAobmV3VmFsdWUpLT4gc3ViLnNldFZhbHVlKG5ld1ZhbHVlLCBwdWJsaXNoZXIpOyByZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRzdWIuc2V0VmFsdWUobmV3VmFsdWUsIHB1Ymxpc2hlcilcblxuXHRcdEByZW1vdmVTdWIoc3ViKSBpZiBtZXRhLnVwZGF0ZU9uY2Vcblx0XHRyZXR1cm5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIyBUcmFuc2Zvcm1zICYgQ29uZGl0aW9uc1xuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRhZGRNb2RpZmllckZuOiAodGFyZ2V0LCBzdWJJbnRlcmZhY2VzLCBzdWJqZWN0Rm4sIHVwZGF0ZU9uQmluZCktPlxuXHRcdGlmIG5vdCBjaGVja0lmLmlzRnVuY3Rpb24oc3ViamVjdEZuKVxuXHRcdFx0dGhyb3dXYXJuaW5nKCdmbk9ubHknLDIpXG5cblx0XHRlbHNlXG5cdFx0XHRmb3Igc3ViSW50ZXJmYWNlIGluIHN1YkludGVyZmFjZXNcblx0XHRcdFx0c3Vic2NyaWJlciA9IHN1YkludGVyZmFjZS5fIG9yIHN1YkludGVyZmFjZSAjIFNlY29uZCBpcyBjaG9zZW4gd2hlbiB0aGUgcGFzc2VkIHN1YnNjcmliZXIgaW50ZXJmYWNlcyBtdWx0aS1iaW5kaW5nIChpcyBhIHJlY3Vyc2l2ZSBjYWxsIG9mIHRoaXMgbWV0aG9kKVxuXG5cdFx0XHRcdGlmIHN1YnNjcmliZXIuaXNNdWx0aVxuXHRcdFx0XHRcdEBhZGRNb2RpZmllckZuKHRhcmdldCwgc3Vic2NyaWJlci5iaW5kaW5ncywgc3ViamVjdEZuLCB1cGRhdGVPbkJpbmQpXG5cdFx0XHRcdFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c3ViTWV0YURhdGEgPSBAc3Vic01ldGFbc3Vic2NyaWJlci5JRF1cblx0XHRcdFx0XHRzdWJNZXRhRGF0YVt0YXJnZXRdID0gc3ViamVjdEZuXG5cdFx0XHRcdFx0dXBkYXRlT25CaW5kID0gdXBkYXRlT25CaW5kIGFuZCBub3Qgc3ViTWV0YURhdGEudXBkYXRlT25jZVxuXG5cdFx0XHRcdFx0aWYgQHB1YnNNYXBbc3Vic2NyaWJlci5JRF1cblx0XHRcdFx0XHRcdHN1YnNjcmliZXIuc3Vic01ldGFbQElEXVt0YXJnZXRdIHx8PSBzdWJqZWN0Rm4gIyBXaWxsIG5vdCByZXBsYWNlIGV4aXN0aW5nIG1vZGlmaWVyIGZ1bmN0aW9uIGlmIGV4aXN0c1xuXG5cdFx0XHRcdFx0QHVwZGF0ZVN1YihzdWJzY3JpYmVyLCBAKSBpZiAodXBkYXRlT25CaW5kIG9yIEB0eXBlIGlzICdGdW5jJykgYW5kIHRhcmdldCBpcyAndHJhbnNmb3JtRm4nXG5cblx0XHRcdHJldHVybiB0cnVlXG5cblxuXG5cdHNldFNlbGZUcmFuc2Zvcm06ICh0cmFuc2Zvcm1GbiwgdXBkYXRlT25CaW5kKS0+XG5cdFx0QHNlbGZUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1GblxuXHRcdEBzZXRWYWx1ZShAdmFsdWUpIGlmIHVwZGF0ZU9uQmluZFxuXHRcdHJldHVyblxuXG5cblxuXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMjIEFsbG93L0Rpc2FsbG93IHJ1bGVzXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IFxuXHRhZGREaXNhbGxvd1J1bGU6ICh0YXJnZXRTdWIsIHRhcmdldERpc2FsbG93KS0+XG5cdFx0ZGlzYWxsb3dMaXN0ID0gQHN1YnNNZXRhW3RhcmdldFN1Yi5JRF0uZGlzYWxsb3dMaXN0ID89IGdlbk9iaigpXG5cdFx0ZGlzYWxsb3dMaXN0W3RhcmdldERpc2FsbG93LklEXSA9IDFcblx0XHRyZXR1cm5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIyBQbGFjZWhvbGRlcnNcblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gXG5cdHNjYW5Gb3JQaG9sZGVyczogKCktPiB1bmxlc3MgQHBob2xkZXJWYWx1ZXNcblx0XHRAcGhvbGRlclZhbHVlcyA9IGdlbk9iaigpXG5cdFx0QHBob2xkZXJJbmRleE1hcCA9IGdlbk9iaigpXG5cdFx0QHBob2xkZXJDb250ZXh0cyA9IFtdXG5cblx0XHRpZiBjaGVja0lmLmlzU3RyaW5nKEB2YWx1ZSlcblx0XHRcdEBwaG9sZGVyQ29udGV4dHMgPSBAdmFsdWUuc3BsaXQgcGhvbGRlclJlZ0V4U3BsaXRcblx0XHRcdFxuXHRcdFx0aW5kZXggPSAwXG5cdFx0XHRAdmFsdWUgPSBAdmFsdWUucmVwbGFjZSBwaG9sZGVyUmVnRXgsIChlLCBwaG9sZGVyKT0+XG5cdFx0XHRcdEBwaG9sZGVySW5kZXhNYXBbaW5kZXgrK10gPSBwaG9sZGVyXG5cdFx0XHRcdEBwaG9sZGVyVmFsdWVzW3Bob2xkZXJdID0gcGhvbGRlclxuXHRcdFxuXHRcdHNjYW5UZXh0Tm9kZXNQbGFjZWhvbGRlcnMoQG9iamVjdCwgQHRleHROb2Rlcz1nZW5PYmooKSkgaWYgQGlzRG9tIGFuZCBAcHJvcGVydHkgaXMgdGV4dENvbnRlbnRcblx0XHRyZXR1cm5cblx0XG5cblxuXG5cblxuXG5cblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyMgUG9sbGluZ1xuXHQjIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcblx0YWRkUG9sbEludGVydmFsOiAodGltZSktPiBpZiBAdHlwZSBpc250ICdFdmVudCdcblx0XHRAcmVtb3ZlUG9sbEludGVydmFsKClcblx0XHRcblx0XHRAcG9sbEludGVydmFsID0gc2V0SW50ZXJ2YWwgKCk9PlxuXHRcdFx0cG9sbGVkVmFsdWUgPSBAZmV0Y2hEaXJlY3RWYWx1ZSgpXG5cblx0XHRcdEBzZXRWYWx1ZSBwb2xsZWRWYWx1ZSwgQCwgdHJ1ZVxuXHRcdCwgdGltZVxuXG5cblx0cmVtb3ZlUG9sbEludGVydmFsOiAoKS0+XG5cdFx0Y2xlYXJJbnRlcnZhbChAcG9sbEludGVydmFsKVxuXHRcdEBwb2xsSW50ZXJ2YWwgPSBudWxsXG5cblxuXG5cblxuXG5cblxuXG5cblx0IyMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyMgRXZlbnRzXG5cdCMjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IFxuXHRcblx0YWRkVXBkYXRlTGlzdGVuZXI6IChldmVudE5hbWUsIHRhcmdldFByb3BlcnR5KS0+XG5cdFx0QG9iamVjdC5hZGRFdmVudExpc3RlbmVyIGV2ZW50TmFtZSwgKGV2ZW50KT0+XG5cdFx0XHR1bmxlc3MgZXZlbnQuX3NiXG5cdFx0XHRcdHNob3VsZFJlZGVmaW5lVmFsdWUgPSBAc2VsZlRyYW5zZm9ybSBhbmQgQGlzRG9tSW5wdXRcblx0XHRcdFx0QHNldFZhbHVlKEBvYmplY3RbdGFyZ2V0UHJvcGVydHldLCBudWxsLCAhc2hvdWxkUmVkZWZpbmVWYWx1ZSwgdHJ1ZSlcblxuXHRcdFx0cmV0dXJuXG5cdFx0XG5cdFx0LCBmYWxzZVxuXHRcdHJldHVyblxuXHRcblxuXHRhdHRhY2hFdmVudHM6ICgpLT5cblx0XHRpZiBAZXZlbnROYW1lXG5cdFx0XHRAcmVnaXN0ZXJFdmVudChAZXZlbnROYW1lKVxuXHRcdFxuXHRcdGVsc2UgaWYgQGlzRG9tSW5wdXRcblx0XHRcdEBhZGRVcGRhdGVMaXN0ZW5lcignaW5wdXQnLCAndmFsdWUnKVxuXHRcdFx0QGFkZFVwZGF0ZUxpc3RlbmVyKCdjaGFuZ2UnLCAndmFsdWUnKVxuXG5cdFx0ZWxzZSBpZiBub3QgQGlzTXVsdGlDaG9pY2UgYW5kIChAdHlwZSBpcyAnRE9NUmFkaW8nIG9yIEB0eXBlIGlzICdET01DaGVja2JveCcpXG5cdFx0XHRAYWRkVXBkYXRlTGlzdGVuZXIoJ2NoYW5nZScsICdjaGVja2VkJylcblxuXHRcdHJldHVyblxuXHRcblxuXG5cdHJlZ2lzdGVyRXZlbnQ6IChldmVudE5hbWUpLT5cblx0XHRAYXR0YWNoZWRFdmVudHMucHVzaChldmVudE5hbWUpXG5cdFx0QGV2ZW50SGFuZGxlciA9IGV2ZW50VXBkYXRlSGFuZGxlci5iaW5kKEApIHVubGVzcyBAZXZlbnRIYW5kbGVyXG5cdFx0XG5cdFx0QG9iamVjdFtAZXZlbnRNZXRob2RzLmxpc3Rlbl0oZXZlbnROYW1lLCBAZXZlbnRIYW5kbGVyKVxuXHRcdHJldHVyblxuXG5cblxuXHR1blJlZ2lzdGVyRXZlbnQ6IChldmVudE5hbWUpLT5cblx0XHRAYXR0YWNoZWRFdmVudHMuc3BsaWNlIEBhdHRhY2hlZEV2ZW50cy5pbmRleE9mKGV2ZW50TmFtZSksIDFcblxuXHRcdEBvYmplY3RbQGV2ZW50TWV0aG9kcy5yZW1vdmVdKGV2ZW50TmFtZSwgQGV2ZW50SGFuZGxlcilcblx0XHRyZXR1cm5cblxuXG5cblx0ZW1pdEV2ZW50OiAoZXh0cmFEYXRhKS0+XG5cdFx0ZXZlbnRPYmplY3QgPSBAZXZlbnROYW1lXG5cdFx0XG5cdFx0aWYgQGV2ZW50TWV0aG9kcy5lbWl0IGlzICdkaXNwYXRjaEV2ZW50J1xuXHRcdFx0dW5sZXNzIEBldmVudE9iamVjdFxuXHRcdFx0XHRAZXZlbnRPYmplY3QgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKVxuXHRcdFx0XHRAZXZlbnRPYmplY3QuaW5pdEV2ZW50KEBldmVudE5hbWUsIHRydWUsIHRydWUpXG5cblx0XHRcdEBldmVudE9iamVjdC5iaW5kaW5nRGF0YSA9IGV4dHJhRGF0YVxuXHRcdFx0ZXZlbnRPYmplY3QgPSBAZXZlbnRPYmplY3RcblxuXHRcdEBvYmplY3RbQGV2ZW50TWV0aG9kcy5lbWl0XShldmVudE9iamVjdCwgZXh0cmFEYXRhKVxuXHRcdHJldHVyblxuXG5cblxuXG5ldmVudFVwZGF0ZUhhbmRsZXIgPSAoKS0+IHVubGVzcyBAaXNFbWl0dGVyXG5cdEBzZXRWYWx1ZShhcmd1bWVudHNbQHByb3BlcnR5XSwgbnVsbCwgdHJ1ZSlcblx0cmV0dXJuXG5cblxuXG5cblxuIiwiZWxzZSBpZiBAaXNEb21JbnB1dFxuXHRpZiBub3QgZnJvbUNoYW5nZUV2ZW50XG5cdFx0QG9yaWdTZXR0ZXIobmV3VmFsdWUpXG5cdFx0QG9iamVjdC5kaXNwYXRjaEV2ZW50KGNoYW5nZUV2ZW50KCkpIGlmIHNldHRpbmdzLmRpc3BhdGNoRXZlbnRzXG5cdFxuXHRlbHNlIGlmIG5ld1ZhbHVlIGlzbnQgQG9yaWdHZXR0ZXIoKSAjIElNUExJQ0lUOiBhbmQgZnJvbUNoYW5nZUV2ZW50XG5cdFx0cHJldkN1cnNyb3IgPSBAb2JqZWN0LnNlbGVjdGlvblN0YXJ0XG5cdFx0QG9yaWdTZXR0ZXIobmV3VmFsdWUpXG5cdFx0QG9iamVjdC5zZXRTZWxlY3Rpb25SYW5nZShwcmV2Q3Vyc3JvciwgcHJldkN1cnNyb3IpIGlmIHByZXZDdXJzcm9yIiwid2hlbiAnRE9NUmFkaW8nXG5cdGlmIEBpc011bHRpQ2hvaWNlICMgVGhlIG5ld1ZhbHVlIHZhciB3aWxsIGhvbGQgdGhlIHJhZGlvIGZpZWxkIGJpbmRpbmcgYXMgaXRzIHZhbHVlIGlmIHRoZSB1cGRhdGUgaXMgY29taW5nIGZyb20gdGhlIHJhZGlvIGZpZWxkJ3MgY2hhbmdlIGV2ZW50XG5cdFx0dGFyZ2V0Q2hvaWNlQmluZGluZyA9IGlmIGNoZWNrSWYuaXNCaW5kaW5nKG5ld1ZhbHVlKSB0aGVuIG5ld1ZhbHVlIGVsc2UgQGNob2ljZXNbbmV3VmFsdWVdXG5cblx0XHRpZiB0YXJnZXRDaG9pY2VCaW5kaW5nXG5cdFx0XHRuZXdWYWx1ZSA9IHRhcmdldENob2ljZUJpbmRpbmcub2JqZWN0LnZhbHVlXG5cdFx0XG5cdFx0XHRmb3IgbixjaG9pY2VCaW5kaW5nIG9mIEBjaG9pY2VzXG5cdFx0XHRcdGNob2ljZUJpbmRpbmcuc2V0VmFsdWUoY2hvaWNlQmluZGluZy5JRCBpcyB0YXJnZXRDaG9pY2VCaW5kaW5nLklELCBwdWJsaXNoZXIpXG5cdFx0ZWxzZVxuXHRcdFx0bmV3VmFsdWUgPSBAdmFsdWUgIyBTZXQgdG8gcHJldiB2YWx1ZVxuXHRcblx0ZWxzZVxuXHRcdG5ld1ZhbHVlID0gISFuZXdWYWx1ZSAjIENvbnZlcnQgdG8gQm9vbGVhblxuXHRcdHJldHVybiBpZiBuZXdWYWx1ZSBpcyBAdmFsdWVcblx0XHRAb2JqZWN0LmNoZWNrZWQgPSBuZXdWYWx1ZSB1bmxlc3MgQG9iamVjdC5jaGVja2VkIGlzIG5ld1ZhbHVlXG5cdFx0QG9iamVjdC5kaXNwYXRjaEV2ZW50KGNoYW5nZUV2ZW50KCkpIGlmIG5ld1ZhbHVlIGFuZCBzZXR0aW5ncy5kaXNwYXRjaEV2ZW50cyAjIE9ubHkgZW1pdCBpZiB0aGUgdmFsdWUgaXMgdHJ1ZSAoaW4gb3JkZXIgdG8gY29uZm9ybSB0byB3ZWIgc3RhbmRhcmRzKVxuXG5cbndoZW4gJ0RPTUNoZWNrYm94J1xuXHRpZiBAaXNNdWx0aUNob2ljZSAjIFRoZSBuZXdWYWx1ZSB2YXIgd2lsbCBob2xkIHRoZSBjaGVja2JveCBmaWVsZCBiaW5kaW5nIGFzIGl0cyB2YWx1ZSBpZiB0aGUgdXBkYXRlIGlzIGNvbWluZyBmcm9tIHRoZSBjaGVja2JveCBmaWVsZCdzIGNoYW5nZSBldmVudFxuXHRcdG92ZXJ3cml0ZVByZXZpb3VzID0gbm90IGNoZWNrSWYuaXNCaW5kaW5nKG5ld1ZhbHVlKSAjIE1lYW5zIHRoYXQgYSBuZXcgYXJyYXkgd2FzIHN1cHBsaWVkXG5cdFx0bmV3Q2hvaWNlcyA9IFtdLmNvbmNhdChuZXdWYWx1ZSkgIyBUaGlzICpub3JtYWxpemVzKiB0aGUgbmV3IHZhbHVlIGludG8gYW4gYXJyYXlcblx0XHRcblx0XHRmb3IgdmFsdWUsaW5kZXggaW4gbmV3Q2hvaWNlc1xuXHRcdFx0bmV3Q2hvaWNlc1tpbmRleF0gPSBpZiBjaGVja0lmLmlzQmluZGluZyh2YWx1ZSkgdGhlbiB2YWx1ZSBlbHNlIEBjaG9pY2VzW3ZhbHVlXVxuXHRcdFxuXHRcdG5ld1ZhbHVlQXJyYXkgPSBbXVxuXHRcdGZvciBjaG9pY2VOYW1lLGNob2ljZUJpbmRpbmcgb2YgQGNob2ljZXNcblx0XHRcdGlmIG92ZXJ3cml0ZVByZXZpb3VzXG5cdFx0XHRcdG5ld0Nob2ljZVZhbHVlID0gdGFyZ2V0SW5jbHVkZXMobmV3Q2hvaWNlcywgY2hvaWNlQmluZGluZylcblx0XHRcdGVsc2Vcblx0XHRcdFx0bmV3Q2hvaWNlVmFsdWUgPSBjaG9pY2VCaW5kaW5nLnZhbHVlXG5cdFx0XHRcblx0XHRcdGNob2ljZUJpbmRpbmcuc2V0VmFsdWUobmV3Q2hvaWNlVmFsdWUsIHB1Ymxpc2hlcilcblx0XHRcdG5ld1ZhbHVlQXJyYXkucHVzaChjaG9pY2VOYW1lKSBpZiBuZXdDaG9pY2VWYWx1ZVxuXG5cdFx0bmV3VmFsdWUgPSBuZXdWYWx1ZUFycmF5XG5cblxuXHRlbHNlXG5cdFx0bmV3VmFsdWUgPSAhIW5ld1ZhbHVlICMgQ29udmVydCB0byBCb29sZWFuXG5cdFx0cmV0dXJuIGlmIG5ld1ZhbHVlIGlzIEB2YWx1ZVxuXHRcdHVubGVzcyBAb2JqZWN0LmNoZWNrZWQgaXMgbmV3VmFsdWVcblx0XHRcdEBvYmplY3QuY2hlY2tlZCA9IG5ld1ZhbHVlXG5cdFx0XHRAb2JqZWN0LmRpc3BhdGNoRXZlbnQoY2hhbmdlRXZlbnQoKSkgaWYgc2V0dGluZ3MuZGlzcGF0Y2hFdmVudHNcblxuXG5cbndoZW4gJ0RPTUF0dHInXG5cdEBvYmplY3Quc2V0QXR0cmlidXRlKEBwcm9wZXJ0eSwgbmV3VmFsdWUpXG4iLCIjIyMqXG4gKiBTdGFnZSBkZWZpbml0aW9uczpcbiAqIFxuICogMDogU2VsZWN0aW9uOlx0XHRcdEdvdCBzZWxlY3RvciwgYXdhaXRpbmcgb2JqZWN0LlxuICogMTogSW5kaWNhdGlvbjpcdFx0XHRHb3Qgb2JqZWN0LCBhd2FpdGluZyBwcm94aWVkIHByb3BlcnR5IC8gZnVuY3Rpb24gLyBCaW5kaW5nLW9iamVjdC5cbiAqIDI6IEJpbmRpbmcgQ29tcGxldGU6XHRcdENvbXBsZXRlLCBhd2FpdGluZyBhZGRpdGlvbmFsIChvcHRpb25hbCkgYmluZGluZ3MvbXV0YXRpb25zLlxuIyMjXG5CaW5kaW5nSW50ZXJmYWNlID0gKG9wdGlvbnMsIGluaGVyaXRlZFN0YXRlKS0+XG5cdGlmIGluaGVyaXRlZFN0YXRlXG5cdFx0ZXh0ZW5kU3RhdGUoQCwgaW5oZXJpdGVkU3RhdGUpXG5cdFx0QHN0YWdlID0gMVxuXHRlbHNlXG5cdFx0QHN0YWdlID0gMFxuXHRcdEBzdWJzID0gW11cblx0XHRAb3B0aW9uc1Bhc3NlZCA9IG9wdGlvbnMgfHw9IHt9XG5cdFx0QG9wdGlvbnMgPSB7fVxuXHRcdGZvciBrZXkgb2YgZGVmYXVsdE9wdGlvbnNcblx0XHRcdEBvcHRpb25zW2tleV0gPSBpZiBvcHRpb25zW2tleV0/IHRoZW4gb3B0aW9uc1trZXldIGVsc2UgZGVmYXVsdE9wdGlvbnNba2V5XVxuXHRcblx0cmV0dXJuIEBcdFx0XHRcblx0XG5cblxuXG5pbXBvcnQgJy4vcHJvdG90eXBlLXByaXZhdGUnXG5pbXBvcnQgJy4vcHJvdG90eXBlLXB1YmxpYyciLCJCaW5kaW5nSW50ZXJmYWNlUHJpdmF0ZSA9XG5cdHNlbGZDbG9uZTogKCktPiBuZXcgQmluZGluZ0ludGVyZmFjZShudWxsLCBAKVxuXHRcblx0ZGVmaW5lTWFpblByb3BzOiAoYmluZGluZyktPlxuXHRcdEBfID0gYmluZGluZ1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIEAsXG5cdFx0XHQndmFsdWUnOlx0XHRnZXQ6ICgpLT4gYmluZGluZy52YWx1ZVxuXHRcdFx0J29yaWdpbmFsJzpcdFx0Z2V0OiAoKS0+IGJpbmRpbmcub2JqZWN0cyBvciBiaW5kaW5nLm9iamVjdFxuXHRcdFx0J3N1YnNjcmliZXJzJzpcdGdldDogKCktPiBiaW5kaW5nLnN1YnMuc2xpY2UoKS5tYXAgKHN1YiktPiBzdWIub2JqZWN0XG5cblxuXG5cblx0Y3JlYXRlQmluZGluZzogKHN1YmplY3QsIG5ld09iamVjdFR5cGUsIGJpbmRpbmdJbnRlcmZhY2UsIGlzRnVuY3Rpb24pLT5cblx0XHRAb2JqZWN0ID0gc3ViamVjdFxuXHRcdGNhY2hlZEJpbmRpbmcgPSBjYWNoZS5nZXQoc3ViamVjdCwgaXNGdW5jdGlvbiwgQHNlbGVjdG9yLCBAaXNNdWx0aUNob2ljZSlcblx0XHRcblx0XHRpZiBjYWNoZWRCaW5kaW5nICMgRXhpdCBlYXJseSBieSByZXR1cm5pbmcgdGhlIHN1YmplY3QgZnJvbSBjYWNoZSBpZiBpcyBhbHJlYWR5IGluIHRoZXJlXG5cdFx0XHRyZXR1cm4gQHBhdGNoQ2FjaGVkQmluZGluZyhjYWNoZWRCaW5kaW5nKVxuXG5cdFx0ZWxzZVxuXHRcdFx0bmV3QmluZGluZyA9IG5ldyBCaW5kaW5nKHN1YmplY3QsIG5ld09iamVjdFR5cGUsIGJpbmRpbmdJbnRlcmZhY2UpXG5cdFx0XHRjYWNoZS5zZXQobmV3QmluZGluZywgaXNGdW5jdGlvbilcblx0XHRcdHJldHVybiBuZXdCaW5kaW5nXG5cblxuXG5cdHBhdGNoQ2FjaGVkQmluZGluZzogKGNhY2hlZEJpbmRpbmcpLT5cblx0XHRpZiBjYWNoZWRCaW5kaW5nLnR5cGUgaXMgJ09iamVjdFByb3AnIGFuZCBAcHJvcGVydHkgbm90IG9mIEBvYmplY3QgIyBUaGlzIHByb3BlcnR5IHdhcyBtYW51YWxseSBkZWxldGVkIGFuZCBuZWVkcyBpdHMgcHJvcCB0byBiZSByZS1kZWZpbmVkIGFzIGEgbGl2ZSBvbmVcblx0XHRcdGNvbnZlcnRUb0xpdmUoY2FjaGVkQmluZGluZywgQG9iamVjdClcblxuXHRcdGlmIEBzYXZlT3B0aW9uc1xuXHRcdFx0Y2FjaGVkQmluZGluZy5vcHRpb25zRGVmYXVsdFtvcHRpb25dID0gdmFsdWUgZm9yIG9wdGlvbix2YWx1ZSBvZiBAb3B0aW9uc1Bhc3NlZFxuXG5cdFx0Zm9yIGtleSx2YWx1ZSBvZiBjYWNoZWRCaW5kaW5nLm9wdGlvbnNEZWZhdWx0XG5cdFx0XHRAb3B0aW9uc1trZXldID0gaWYgY2hlY2tJZi5pc0RlZmluZWQoQG9wdGlvbnNQYXNzZWRba2V5XSkgdGhlbiBAb3B0aW9uc1Bhc3NlZFtrZXldIGVsc2UgdmFsdWVcblx0XHRcblx0XHRyZXR1cm4gY2FjaGVkQmluZGluZ1xuXG5cblxuXHRzZXRQcm9wZXJ0eTogKHN1YmplY3QpLT5cblx0XHRzdWJqZWN0ID0gc3ViamVjdC50b1N0cmluZygpIGlmIGNoZWNrSWYuaXNOdW1iZXIoc3ViamVjdClcblx0XHRAc2VsZWN0b3IgPSBAcHJvcGVydHkgPSBzdWJqZWN0XG5cblx0XHRcblx0XHR1bmxlc3MgQG9wdGlvbnMuc2ltcGxlU2VsZWN0b3Jcblx0XHRcdGlmIHRhcmdldEluY2x1ZGVzKHN1YmplY3QsICc6Jylcblx0XHRcdFx0c3BsaXQgPSBzdWJqZWN0LnNwbGl0KCc6Jylcblx0XHRcdFx0QGRlc2NyaXB0b3IgPSBzcGxpdC5zbGljZSgwLCAtMSkuam9pbignOicpXG5cdFx0XHRcdEBwcm9wZXJ0eSA9IHNwbGl0W3NwbGl0Lmxlbmd0aC0xXVxuXHRcdFx0XG5cdFx0XHRcblx0XHRcdGlmIHRhcmdldEluY2x1ZGVzKHN1YmplY3QsICcuJykgIyBQbGFjZWhvbGRlciBleHRyYWN0aW9uXG5cdFx0XHRcdHNwbGl0ID0gQHByb3BlcnR5LnNwbGl0KCcuJykgIyBXZSB1c2UgJ0Bwcm9wZXJ0eScgaW5zdGVhZCBvZiAnc3ViamVjdCcgYmVjYXVzZSBpdCBtYXkgaGF2ZSBiZWVuIG1vZGlmaWVkIGJ5IHRoZSBwcmV2aW91cyAnOicgZGVzY3JpcHRvciBjaGVja1xuXHRcdFx0XHRAcHJvcGVydHkgPSBzcGxpdFswXVx0XHRcdFx0XG5cdFx0XHRcdEBwaG9sZGVyID0gc3BsaXQuc2xpY2UoMSkuam9pbignLicpXG5cblxuXG5cdFx0XHRpZiB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ2V2ZW50Jylcblx0XHRcdFx0aWYgdGFyZ2V0SW5jbHVkZXMoc3ViamVjdCwgJyMnKVxuXHRcdFx0XHRcdHNwbGl0ID0gQHByb3BlcnR5LnNwbGl0KCcjJylcblx0XHRcdFx0XHRAZXZlbnROYW1lID0gc3BsaXRbMF1cblx0XHRcdFx0XHRAcHJvcGVydHkgPSBzcGxpdFsxXVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0QGV2ZW50TmFtZSA9IEBwcm9wZXJ0eVxuXHRcdFx0XHRcdEBwcm9wZXJ0eSA9IDBcblxuXHRcdFx0XHR0aHJvd1dhcm5pbmcoJ2JhZEV2ZW50QXJnJywxKSBpZiBpc05hTiBwYXJzZUludChAcHJvcGVydHkpXG5cblx0XHRyZXR1cm4gQFxuXG5cblxuXHRzZXRPYmplY3Q6IChzdWJqZWN0LCBpc0Z1bmN0aW9uKS0+XG5cdFx0QHN0YWdlID0gMVxuXHRcdGltcG9ydCAnLi9wcm90b3R5cGUtcHJpdmF0ZS5zZXRPYmplY3QtcGFyc2VET01PYmplY3QnXG5cdFx0XG5cdFx0c3dpdGNoXG5cdFx0XHR3aGVuIGlzRnVuY3Rpb25cblx0XHRcdFx0bmV3T2JqZWN0VHlwZSA9ICdGdW5jJ1xuXHRcdFx0XG5cdFx0XHR3aGVuIEBwaG9sZGVyXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnUGhvbGRlcidcblx0XHRcdFxuXHRcdFx0d2hlbiB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ2FycmF5JykgYW5kIGNoZWNrSWYuaXNBcnJheShzdWJqZWN0W0Bwcm9wZXJ0eV0pXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnQXJyYXknXG5cdFx0XHRcblx0XHRcdHdoZW4gdGFyZ2V0SW5jbHVkZXMoQGRlc2NyaXB0b3IsICdldmVudCcpXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnRXZlbnQnXG5cdFx0XHRcdGltcG9ydCAnLi9wcm90b3R5cGUtcHJpdmF0ZS5zZXRPYmplY3QtZGVmaW5lRXZlbnRNZXRob2RzJ1xuXG5cdFx0XHR3aGVuIHRhcmdldEluY2x1ZGVzKEBkZXNjcmlwdG9yLCAnZnVuYycpXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnUHJveHknXG5cdFx0XHRcblx0XHRcdHdoZW4gaXNEb21SYWRpbyBcblx0XHRcdFx0bmV3T2JqZWN0VHlwZSA9ICdET01SYWRpbydcblxuXHRcdFx0d2hlbiBpc0RvbUNoZWNrYm94IFxuXHRcdFx0XHRuZXdPYmplY3RUeXBlID0gJ0RPTUNoZWNrYm94J1xuXG5cdFx0XHR3aGVuIHRhcmdldEluY2x1ZGVzKEBkZXNjcmlwdG9yLCAnYXR0cicpXG5cdFx0XHRcdG5ld09iamVjdFR5cGUgPSAnRE9NQXR0cidcblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRuZXdPYmplY3RUeXBlID0gJ09iamVjdFByb3AnXG5cdFx0XG5cblx0XHRpZiB0YXJnZXRJbmNsdWRlcyhAZGVzY3JpcHRvciwgJ211bHRpJylcblx0XHRcdHRocm93RXJyb3IoJ2VtcHR5TGlzdCcpIGlmIG5vdCBzdWJqZWN0Lmxlbmd0aFxuXHRcdFx0QGRlZmluZU1haW5Qcm9wcyBuZXcgR3JvdXBCaW5kaW5nKEAsIHN1YmplY3QsIG5ld09iamVjdFR5cGUpXG5cdFx0ZWxzZVxuXHRcdFx0QGRlZmluZU1haW5Qcm9wcyBAY3JlYXRlQmluZGluZyhzdWJqZWN0LCBuZXdPYmplY3RUeXBlLCBALCBpc0Z1bmN0aW9uKVxuXG5cblx0XHRpZiB0YXJnZXRJbmNsdWRlcyhAXy50eXBlLCAnRXZlbnQnKSBvciB0YXJnZXRJbmNsdWRlcyhAXy50eXBlLCAnUHJveHknKVxuXHRcdFx0QG9wdGlvbnMudXBkYXRlT25CaW5kID0gZmFsc2Vcblx0XHRlbHNlIGlmIHRhcmdldEluY2x1ZGVzKEBfLnR5cGUsICdGdW5jJylcblx0XHRcdEBvcHRpb25zLnVwZGF0ZU9uQmluZCA9IHRydWVcblxuXG5cdFx0aWYgQGNvbXBsZXRlQ2FsbGJhY2tcblx0XHRcdHJldHVybiBAY29tcGxldGVDYWxsYmFjayhAKVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBAXG5cblxuXG5cblx0YWRkVG9QdWJsaXNoZXI6IChwdWJsaXNoZXJJbnRlcmZhY2UpLT5cblx0XHRwdWJsaXNoZXJJbnRlcmZhY2Uuc3RhZ2UgPSAyXG5cdFx0cHVibGlzaGVySW50ZXJmYWNlLnN1YnMucHVzaChAKVxuXHRcdGFscmVhZHlIYWRTdWIgPSBwdWJsaXNoZXJJbnRlcmZhY2UuXy5hZGRTdWIoQF8sIHB1Ymxpc2hlckludGVyZmFjZS5vcHRpb25zLCBwdWJsaXNoZXJJbnRlcmZhY2UudXBkYXRlT25jZSlcblxuXHRcdGlmIHB1Ymxpc2hlckludGVyZmFjZS51cGRhdGVPbmNlXG5cdFx0XHRkZWxldGUgcHVibGlzaGVySW50ZXJmYWNlLnVwZGF0ZU9uY2Vcblx0XHRcblx0XHRlbHNlIGlmIHB1Ymxpc2hlckludGVyZmFjZS5vcHRpb25zLnVwZGF0ZU9uQmluZCBhbmQgbm90IGFscmVhZHlIYWRTdWJcblx0XHRcdGlmIEBfLmlzTXVsdGlcblx0XHRcdFx0cHVibGlzaGVySW50ZXJmYWNlLl8udXBkYXRlU3ViKGJpbmRpbmcsIHB1Ymxpc2hlckludGVyZmFjZS5fKSBmb3IgYmluZGluZyBpbiBAXy5iaW5kaW5nc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwdWJsaXNoZXJJbnRlcmZhY2UuXy51cGRhdGVTdWIoQF8sIHB1Ymxpc2hlckludGVyZmFjZS5fKVxuXG5cdFx0cmV0dXJuXG5cblxuXG5cblxuIiwiaXNJdGVyYWJsZSA9IHN1YmplY3QgaXNudCB3aW5kb3cgYW5kIGNoZWNrSWYuaXNJdGVyYWJsZShzdWJqZWN0KSBhbmQgbm90IHN1YmplY3Qubm9kZVR5cGVcbnNhbXBsZUl0ZW0gPSBpZiBpc0l0ZXJhYmxlIHRoZW4gc3ViamVjdFswXSBlbHNlIHN1YmplY3RcblxuaWYgbm90IHNhbXBsZUl0ZW1cblx0dGhyb3dFcnJvcignZW1wdHlMaXN0JykgaWYgaXNJdGVyYWJsZSBhbmQgY2hlY2tJZi5pc0VsQ29sbGVjdGlvbihzdWJqZWN0KVxuXG5lbHNlIGlmIEBpc0RvbSA9IGNoZWNrSWYuaXNEb20oc2FtcGxlSXRlbSlcblxuXHRpZiBAcHJvcGVydHkgaXMgJ2NoZWNrZWQnXG5cdFx0aXNEb21SYWRpbyA9IHNhbXBsZUl0ZW0gYW5kIGNoZWNrSWYuaXNEb21SYWRpbyhzYW1wbGVJdGVtKVxuXHRcdGlzRG9tQ2hlY2tib3ggPSBub3QgaXNEb21SYWRpbyBhbmQgc2FtcGxlSXRlbSBhbmQgY2hlY2tJZi5pc0RvbUNoZWNrYm94KHNhbXBsZUl0ZW0pXG5cdFxuXHRlbHNlIGlmIEBwcm9wZXJ0eSBpcyAndmFsdWUnXG5cdFx0QGlzRG9tSW5wdXQgPSBjaGVja0lmLmlzRG9tSW5wdXQoc2FtcGxlSXRlbSlcblx0XG5cblx0aWYgaXNJdGVyYWJsZSBhbmQgbm90IHRhcmdldEluY2x1ZGVzKEBkZXNjcmlwdG9yLCAnbXVsdGknKVxuXHRcdGlmIHN1YmplY3QubGVuZ3RoIGlzIDFcblx0XHRcdHN1YmplY3QgPSBzdWJqZWN0WzBdXG5cblx0XHRlbHNlXG5cdFx0XHRpZiAoaXNEb21SYWRpbyBvciBpc0RvbUNoZWNrYm94KSBhbmQgbm90IGNoZWNrSWYuZG9tRWxzQXJlU2FtZShzdWJqZWN0KVxuXHRcdFx0XHRyZXR1cm4gdGhyb3dXYXJuaW5nKCdtaXhlZEVsTGlzdCcsMylcdFx0XHRcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgaXNEb21SYWRpbyBvciBpc0RvbUNoZWNrYm94XG5cdFx0XHRcdFx0QGlzTXVsdGlDaG9pY2UgPSB0cnVlXG5cdFx0XHRcdFx0c3ViamVjdCA9IFtdLnNsaWNlLmNhbGwoc3ViamVjdClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHN1YmplY3QgPSBzdWJqZWN0WzBdXG5cdFx0XHRcdFx0dGhyb3dXYXJuaW5nKCdvbmx5T25lRE9NRWxlbWVudCcsMylcblxuXG5cblxuIiwiQGV2ZW50TWV0aG9kcyA9IGxpc3RlbjpAb3B0aW9uc1Bhc3NlZC5saXN0ZW5NZXRob2QsIHJlbW92ZTpAb3B0aW9uc1Bhc3NlZC5yZW1vdmVNZXRob2QsIGVtaXQ6QG9wdGlvbnNQYXNzZWQuZW1pdE1ldGhvZFxuXG5cblxuaWYgbm90IHN1YmplY3RbQGV2ZW50TWV0aG9kcy5saXN0ZW5dXG5cdEBldmVudE1ldGhvZHMubGlzdGVuID0gaWYgY2hlY2tJZi5pc0RvbU5vZGUoc3ViamVjdCkgdGhlbiAnYWRkRXZlbnRMaXN0ZW5lcicgZWxzZSAnb24nXG5cbmlmIG5vdCBzdWJqZWN0W0BldmVudE1ldGhvZHMucmVtb3ZlXVxuXHRAZXZlbnRNZXRob2RzLnJlbW92ZSA9IGlmIGNoZWNrSWYuaXNEb21Ob2RlKHN1YmplY3QpIHRoZW4gJ3JlbW92ZUV2ZW50TGlzdGVuZXInIGVsc2UgJ3JlbW92ZUxpc3RlbmVyJ1xuXG5pZiBub3Qgc3ViamVjdFtAZXZlbnRNZXRob2RzLmVtaXRdXG5cdEBldmVudE1ldGhvZHMuZW1pdCA9IGlmIGNoZWNrSWYuaXNEb21Ob2RlKHN1YmplY3QpIHRoZW4gJ2Rpc3BhdGNoRXZlbnQnIGVsc2UgJ2VtaXQnIiwiQmluZGluZ0ludGVyZmFjZTo6ID0gT2JqZWN0LmNyZWF0ZSBCaW5kaW5nSW50ZXJmYWNlUHJpdmF0ZSxcblx0b2Y6XHRcdFx0XHRcdGdldDogKCktPiBNRVRIT0Rfb2YgaWYgbm90IEBzdGFnZVx0XHRcdCM9PT0gaWYgc3RhZ2UgaXMgMFxuXHRzZXQ6XHRcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX3NldCBpZiBAc3RhZ2VcdFx0XHRcdCM9PT0gaWYgc3RhZ2UgaXMgMSBvciAyXG5cdGNoYWluVG86XHRcdFx0Z2V0OiAoKS0+IE1FVEhPRF9jaGFpblRvIGlmIEBzdGFnZSBpcyAyXG5cdHRyYW5zZm9ybVNlbGY6XHRcdGdldDogKCktPiBNRVRIT0RfdHJhbnNmb3JtU2VsZiBpZiBAc3RhZ2UgaXMgMVxuXHR0cmFuc2Zvcm06XHRcdFx0Z2V0OiAoKS0+IE1FVEhPRF90cmFuc2Zvcm0gaWYgQHN0YWdlIGlzIDJcblx0dHJhbnNmb3JtQWxsOlx0XHRnZXQ6ICgpLT4gTUVUSE9EX3RyYW5zZm9ybUFsbCBpZiBAc3RhZ2UgaXMgMlxuXHRjb25kaXRpb246XHRcdFx0Z2V0OiAoKS0+IE1FVEhPRF9jb25kaXRpb24gaWYgQHN0YWdlIGlzIDJcblx0Y29uZGl0aW9uQWxsOlx0XHRnZXQ6ICgpLT4gTUVUSE9EX2NvbmRpdGlvbkFsbCBpZiBAc3RhZ2UgaXMgMlxuXHRib3RoV2F5czpcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX2JvdGhXYXlzIGlmIEBzdGFnZSBpcyAyXG5cdHVuQmluZDpcdFx0XHRcdGdldDogKCktPiBNRVRIT0RfdW5CaW5kIGlmIEBzdGFnZSBpcyAyXG5cdHBvbGxFdmVyeTpcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX3BvbGxFdmVyeSBpZiBAc3RhZ2UgIz09PSBpZiBzdGFnZSBpcyAxIG9yIDJcblx0c3RvcFBvbGxpbmc6XHRcdGdldDogKCktPiBNRVRIT0Rfc3RvcFBvbGxpbmcgaWYgQHN0YWdlICM9PT0gaWYgc3RhZ2UgaXMgMSBvciAyXG5cdHNldE9wdGlvbjpcdFx0XHRnZXQ6ICgpLT4gTUVUSE9EX3NldE9wdGlvbiBpZiBAc3RhZ2UgaXMgMlxuXHRkaXNhbGxvd0Zyb206XHRcdGdldDogKCktPiBpZiBAc3RhZ2UgaXMgMiBhbmQgKHRoaXNJbnRlcmZhY2U9QClcblx0XHRcdFx0XHRcdFx0Z2VuUHJveGllZEludGVyZmFjZSBmYWxzZSwgKGRpc2FsbG93SW50ZXJmYWNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0c3ViSW50ZXJmYWNlID0gdGhpc0ludGVyZmFjZS5zdWJzW3RoaXNJbnRlcmZhY2Uuc3Vicy5sZW5ndGgtMV1cblx0XHRcdFx0XHRcdFx0XHR0aGlzSW50ZXJmYWNlLl8uYWRkRGlzYWxsb3dSdWxlKHN1YkludGVyZmFjZS5fLCBkaXNhbGxvd0ludGVyZmFjZS5fKVxuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXNJbnRlcmZhY2Vcblx0XG5cdHVwZGF0ZU9uOlx0XHRcdGdldDogKCktPiBpZiBAc3RhZ2UgYW5kICh0aGlzSW50ZXJmYWNlPUApICM9PT0gaWYgc3RhZ2UgaXMgMSBvciAyXG5cdFx0XHRcdFx0XHRcdGdlblByb3hpZWRJbnRlcmZhY2UgZmFsc2UsIChzdWJJbnRlcmZhY2UpLT5cblx0XHRcdFx0XHRcdFx0XHRpZiBzdWJJbnRlcmZhY2UuXyBpc250IHRoaXNJbnRlcmZhY2UuX1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpc0ludGVyZmFjZS5fLnB1YnNNYXBbc3ViSW50ZXJmYWNlLl8uSURdID0gc3ViSW50ZXJmYWNlLl9cblx0XHRcdFx0XHRcdFx0XHRcdHN1YkludGVyZmFjZS5fLmFkZFN1YiBnZW5TZWxmVXBkYXRlcih0aGlzSW50ZXJmYWNlLl8sIHRydWUpLCBzdWJJbnRlcmZhY2Uub3B0aW9ucywgZmFsc2UsIHRydWVcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpc0ludGVyZmFjZVxuXHRcblxuXHRyZW1vdmVVcGRhdGVyOlx0XHRnZXQ6ICgpLT4gaWYgQHN0YWdlIGFuZCAodGhpc0ludGVyZmFjZT1AKSBhbmQgKHNlbGZVcGRhdGVyPUBfLnNlbGZVcGRhdGVyKSAjPT09IGlmIHN0YWdlIGlzIDEgb3IgMlxuXHRcdFx0XHRcdFx0XHRnZW5Qcm94aWVkSW50ZXJmYWNlIGZhbHNlLCAoc3ViSW50ZXJmYWNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0aWYgc3ViSW50ZXJmYWNlLl8uc3Vic01ldGFbc2VsZlVwZGF0ZXIuSURdXG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgdGhpc0ludGVyZmFjZS5fLnB1YnNNYXBbc3ViSW50ZXJmYWNlLl8uSURdXG5cdFx0XHRcdFx0XHRcdFx0XHRzdWJJbnRlcmZhY2UuXy5yZW1vdmVTdWIoc2VsZlVwZGF0ZXIpXG5cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5cblxuXG5cdHRvOlx0XHRcdFx0XHRnZXQ6ICgpLT4gaWYgQHN0YWdlIGlzIDEgYW5kICh0aGlzSW50ZXJmYWNlPUApXG5cdFx0XHRcdFx0XHRcdGdlblByb3hpZWRJbnRlcmZhY2UgdHJ1ZSwgKHN1YkludGVyZmFjZSktPlxuXHRcdFx0XHRcdFx0XHRcdGlmIHN1YkludGVyZmFjZS5fIGlzbnQgdGhpc0ludGVyZmFjZS5fXG5cdFx0XHRcdFx0XHRcdFx0XHRzdWJJbnRlcmZhY2UuYWRkVG9QdWJsaXNoZXIodGhpc0ludGVyZmFjZSlcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpc0ludGVyZmFjZVxuXHRcblxuXHRhbmQ6XHRcdFx0XHRnZXQ6ICgpLT5cblx0XHRcdFx0XHRcdFx0Y2xvbmVJbnRlcmZhY2UgPSBAc2VsZkNsb25lKClcblx0XHRcdFx0XHRcdFx0aWYgQHN0YWdlIGlzIDJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2xvbmVJbnRlcmZhY2Vcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIEBzdGFnZSBpcyAxXG5cdFx0XHRcdFx0XHRcdFx0aWYgbm90IGNsb25lSW50ZXJmYWNlLl8uaXNNdWx0aVxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xvbmVCaW5kaW5nID0gY2xvbmVJbnRlcmZhY2UuX1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2xvbmVJbnRlcmZhY2UuXyA9IGNsb25lSW50ZXJmYWNlLl8gPSBuZXcgR3JvdXBCaW5kaW5nKGNsb25lSW50ZXJmYWNlKVxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xvbmVJbnRlcmZhY2UuXy5hZGRCaW5kaW5nKGNsb25lQmluZGluZylcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZ2VuUHJveGllZEludGVyZmFjZSBmYWxzZSwgKHNpYmxpbmdJbnRlcmZhY2UpLT5cblx0XHRcdFx0XHRcdFx0XHRcdGNsb25lSW50ZXJmYWNlLl8uYWRkQmluZGluZyhzaWJsaW5nSW50ZXJmYWNlLl8pXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2xvbmVJbnRlcmZhY2Vcblx0XG5cblx0b25jZTpcdFx0XHRcdGdldDogKCktPiBpZiBAc3RhZ2UgaXMgMVxuXHRcdFx0XHRcdFx0XHRpbnRlcmZhY2VUb1JldHVybiA9IEBzZWxmQ2xvbmUoKVxuXHRcdFx0XHRcdFx0XHRpbnRlcmZhY2VUb1JldHVybi51cGRhdGVPbmNlID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaW50ZXJmYWNlVG9SZXR1cm5cblxuXHQjID09PT0gQWxpYXNlcyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0dXBkYXRlOlx0XHRcdFx0Z2V0OiAoKS0+IEBzZXRcblx0dHdvV2F5Olx0XHRcdFx0Z2V0OiAoKS0+IEBib3RoV2F5c1xuXHRwaXBlOlx0XHRcdFx0Z2V0OiAoKS0+IEBjaGFpblRvXG5cblxuXG5cbk1FVEhPRF9vZiA9IChvYmplY3QpLT5cblx0dGhyb3dFcnJvckJhZEFyZyhvYmplY3QpIHVubGVzcyBjaGVja0lmLmlzT2JqZWN0KG9iamVjdCkgb3IgY2hlY2tJZi5pc0Z1bmN0aW9uKG9iamVjdClcblx0XG5cdGlmIGNoZWNrSWYuaXNCaW5kaW5nSW50ZXJmYWNlKG9iamVjdClcblx0XHRvYmplY3QgPSBvYmplY3Qub2JqZWN0XG5cblx0QHN0YWdlID0gMVxuXHRyZXR1cm4gQHNldE9iamVjdChvYmplY3QpXG5cblxuXG5cblxuTUVUSE9EX2NoYWluVG8gPSAoc3ViamVjdCwgc3BlY2lmaWNPcHRpb25zLCBzYXZlT3B0aW9ucyktPlxuXHRyZXR1cm4gU2ltcGx5QmluZChAc3Vic1tAc3Vicy5sZW5ndGgtMV0pLnRvKHN1YmplY3QsIHNwZWNpZmljT3B0aW9ucywgc2F2ZU9wdGlvbnMpXG5cblxuXG5cblxuTUVUSE9EX3NldCA9IChuZXdWYWx1ZSktPlxuXHRAXy5zZXRWYWx1ZShuZXdWYWx1ZSlcblx0cmV0dXJuIEBcblxuXG5cblxuXG5cblxuXG5NRVRIT0RfdHJhbnNmb3JtU2VsZiA9ICh0cmFuc2Zvcm1GbiktPiAjIEFwcGxpZWQgb25seSB0byB0aGUgbGFzdCBzdWJcblx0aWYgbm90IGNoZWNrSWYuaXNGdW5jdGlvbih0cmFuc2Zvcm1Gbilcblx0XHR0aHJvd1dhcm5pbmcoJ2ZuT25seScsMSlcblx0ZWxzZVxuXHRcdEBfLnNldFNlbGZUcmFuc2Zvcm0odHJhbnNmb3JtRm4sIEBvcHRpb25zLnVwZGF0ZU9uQmluZClcblx0XHRcblx0cmV0dXJuIEBcblxuXG5NRVRIT0RfdHJhbnNmb3JtID0gKHRyYW5zZm9ybUZuKS0+ICMgQXBwbGllZCBvbmx5IHRvIHRoZSBsYXN0IHN1YlxuXHRAXy5hZGRNb2RpZmllckZuKCd0cmFuc2Zvcm1GbicsIEBzdWJzLnNsaWNlKC0xKSwgdHJhbnNmb3JtRm4sIEBvcHRpb25zLnVwZGF0ZU9uQmluZClcblx0cmV0dXJuIEBcblxuXG5NRVRIT0RfdHJhbnNmb3JtQWxsID0gKHRyYW5zZm9ybUZuKS0+ICMgQXBwbGllZCB0byBlbnRyaWUgc3VicyBzZXRcdFx0XG5cdEBfLmFkZE1vZGlmaWVyRm4oJ3RyYW5zZm9ybUZuJywgQHN1YnMsIHRyYW5zZm9ybUZuLCBAb3B0aW9ucy51cGRhdGVPbkJpbmQpXG5cdHJldHVybiBAXG5cblxuXG5cblxuXG5NRVRIT0RfY29uZGl0aW9uID0gKGNvbmRpdGlvbkZuKS0+ICMgQXBwbGllZCBvbmx5IHRvIHRoZSBsYXN0IHN1YlxuXHRAXy5hZGRNb2RpZmllckZuKCdjb25kaXRpb25GbicsIEBzdWJzLnNsaWNlKC0xKSwgY29uZGl0aW9uRm4pXG5cdHJldHVybiBAXG5cblxuTUVUSE9EX2NvbmRpdGlvbkFsbCA9IChjb25kaXRpb25GbiktPiAjIEFwcGxpZWQgdG8gZW50cmllIHN1YnMgc2V0XG5cdEBfLmFkZE1vZGlmaWVyRm4oJ2NvbmRpdGlvbkZuJywgQHN1YnMsIGNvbmRpdGlvbkZuKVxuXHRyZXR1cm4gQFxuXG5cblxuXG5cblxuXG5NRVRIT0RfYm90aFdheXMgPSAoYWx0VHJhbnNmb3JtKS0+ICMgQXBwbGllZCBvbmx5IHRvIHRoZSBsYXN0IHN1YlxuXHRzdWIgPSBAc3Vic1tAc3Vicy5sZW5ndGgtMV0gIyBMYXN0IFByb3hpZWRcblx0c3ViQmluZGluZyA9IHN1Yi5fXG5cdGJpbmRpbmdzID0gaWYgQF8uaXNNdWx0aSB0aGVuIEBfLmJpbmRpbmdzIGVsc2UgW0BfXVxuXG5cdHN1YkJpbmRpbmcuYWRkU3ViKEBfLCBzdWIub3B0aW9ucylcblx0XG5cdGZvciBiaW5kaW5nIGluIGJpbmRpbmdzXG5cdFx0b3JpZ2luVHJhbnNmb3JtID0gYmluZGluZy5zdWJzTWV0YVtzdWJCaW5kaW5nLklEXS50cmFuc2Zvcm1GblxuXHRcdG9yaWdpbkNvbmRpdGlvbiA9IGJpbmRpbmcuc3Vic01ldGFbc3ViQmluZGluZy5JRF0uY29uZGl0aW9uRm5cblxuXHRcdGlmIG9yaWdpblRyYW5zZm9ybSBvciBhbHRUcmFuc2Zvcm1cblx0XHRcdHRyYW5zZm9ybVRvVXNlID0gaWYgY2hlY2tJZi5pc0Z1bmN0aW9uKGFsdFRyYW5zZm9ybSkgdGhlbiBhbHRUcmFuc2Zvcm0gZWxzZSBvcmlnaW5UcmFuc2Zvcm1cblx0XHRcdHN1YkJpbmRpbmcuc3Vic01ldGFbQF8uSURdLnRyYW5zZm9ybUZuID0gdHJhbnNmb3JtVG9Vc2UgaWYgdHJhbnNmb3JtVG9Vc2UgYW5kIGFsdFRyYW5zZm9ybSBpc250IGZhbHNlXG5cblx0XHRpZiBvcmlnaW5Db25kaXRpb25cblx0XHRcdHN1YkJpbmRpbmcuc3Vic01ldGFbQF8uSURdLmNvbmRpdGlvbkZuID0gb3JpZ2luQ29uZGl0aW9uXG5cblx0cmV0dXJuIEBcblxuXG5cbk1FVEhPRF91bkJpbmQgPSAoYm90aFdheXMpLT4gIyBBcHBsaWVkIHRvIGFsbCBzdWJzXG5cdEBfLnJlbW92ZVN1YihzdWIuXywgYm90aFdheXMpIGZvciBzdWIgaW4gQHN1YnNcblx0cmV0dXJuIEBcblxuXG5cblxuXG5NRVRIT0RfcG9sbEV2ZXJ5ID0gKHRpbWUpLT5cblx0QF8uYWRkUG9sbEludGVydmFsKHRpbWUpXG5cdHJldHVybiBAXG5cblxuXG5NRVRIT0Rfc3RvcFBvbGxpbmcgPSAoKS0+XG5cdEBfLnJlbW92ZVBvbGxJbnRlcnZhbCgpXG5cdHJldHVybiBAXG5cblxuXG5NRVRIT0Rfc2V0T3B0aW9uID0gKG9wdGlvbk5hbWUsIG5ld1ZhbHVlKS0+XG5cdEBfLnN1YnNNZXRhW0BzdWJzW0BzdWJzLmxlbmd0aC0xXS5fLklEXS5vcHRzW29wdGlvbk5hbWVdID0gbmV3VmFsdWVcdFxuXHRyZXR1cm4gQFxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiR3JvdXBCaW5kaW5nID0gKGJpbmRpbmdJbnRlcmZhY2UsIG9iamVjdHMsIG9iamVjdFR5cGUpLT5cblx0YmluZGluZ0ludGVyZmFjZS5zZWxlY3RvciA9IGJpbmRpbmdJbnRlcmZhY2Uuc2VsZWN0b3Iuc2xpY2UoNikgIyBUYWtlIG91dCB0aGUgJ211bHRpOidcblx0ZXh0ZW5kU3RhdGUoQCwgQGludGVyZmFjZSA9IGJpbmRpbmdJbnRlcmZhY2UpXG5cdEBpc011bHRpID0gdHJ1ZVxuXHRAYmluZGluZ3MgPSBiaW5kaW5ncyA9IFtdXG5cblx0aWYgb2JqZWN0c1xuXHRcdEBhZGRCaW5kaW5nKG9iamVjdCwgb2JqZWN0VHlwZSkgZm9yIG9iamVjdCBpbiBvYmplY3RzXG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMgQCxcblx0XHQndHlwZSc6XHRcdFx0XHRnZXQ6ICgpLT4gYmluZGluZ3MubWFwIChiaW5kaW5nKS0+IGJpbmRpbmcudHlwZVxuXHRcdCd2YWx1ZSc6IFx0XHRcdGdldDogKCktPiBiaW5kaW5ncy5tYXAgKGJpbmRpbmcpLT4gYmluZGluZy52YWx1ZVxuXG5cblxuXG5cblxucHJvdG8gPSBHcm91cEJpbmRpbmc6OiA9IE9iamVjdC5jcmVhdGUoQmluZGluZ0ludGVyZmFjZVByaXZhdGUpXG5cbk9iamVjdC5rZXlzKEJpbmRpbmc6OikuZm9yRWFjaCAobWV0aG9kTmFtZSktPlx0XG5cdHByb3RvW21ldGhvZE5hbWVdID0gKGEsYixjLGQpLT4gIyBGb3VyIGFyZ3VtZW50cyBpcyB0aGUgbW9zdCBldmVyIHBhc3NlZCB0byBhbnkgbWV0aG9kIGZyb20gQmluZGluZ0ludGVyZmFjZSBtZXRob2RzXG5cdFx0Zm9yIGJpbmRpbmcgaW4gQGJpbmRpbmdzXG5cdFx0XHRiID0gYmluZGluZyBpZiBtZXRob2ROYW1lIGlzICd1cGRhdGVTdWInXG5cdFx0XHRiaW5kaW5nW21ldGhvZE5hbWVdKGEsYixjLGQpXG5cdFx0XG5cdFx0cmV0dXJuXG5cblxucHJvdG8uYWRkQmluZGluZyA9IChvYmplY3QsIG9iamVjdFR5cGUpLT5cblx0QGJpbmRpbmdzLnB1c2ggaWYgbm90IG9iamVjdFR5cGUgdGhlbiBvYmplY3QgZWxzZSBAY3JlYXRlQmluZGluZyhvYmplY3QsIG9iamVjdFR5cGUsIEBpbnRlcmZhY2UpXG5cdHJldHVybiIsIm1vZHVsZS5leHBvcnRzID0gXG5cdGFueTogLy4vXG5cdHdoaXRlU3BhY2U6IC9cXHMrL1xuXHRudW1lcmljOiAvXlxcZCQvXG5cdGxldHRlcjogL15bYS16QS1aXSQvXG5cdCMgYWxwaGFudW1lcmljOiAvW1xcZGEtekEtWl0vXG5cdHdpZGVudW1lcmljOiAvXlswLTlcXCEjXFwkXFwlXFwqXFwrXFwvXFw9XFw/XFxeXFx7XFx8XFx9XFwoXFwpXFx+XFwtXFwuXSQvXG5cdGFscGhhbnVtZXJpYzogL15bMC05QS1aYS16XFwhI1xcJFxcJVxcJlxcJ1xcKlxcK1xcL1xcPVxcP1xcXlxcX1xcYFxce1xcfFxcfVxcKFxcKVxcflxcLVxcIF0kL1xuXHRlbWFpbDogL15bXFx3XFwtXFwuXStAW1xcd1xcLVxcLl0rXFwuW0EtWmEtel17MiwxMH0kLyIsImltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHtJTVBPUlRBTlR9IGZyb20gJy4vY29uc3RhbnRzJ1xuXG5xdWlja2NzcyA9ICh0YXJnZXRFbCwgcHJvcGVydHksIHZhbHVlLCBpbXBvcnRhbnQpLT5cblx0c3dpdGNoXG5cdFx0d2hlbiBoZWxwZXJzLmlzSXRlcmFibGUodGFyZ2V0RWwpXG5cdFx0XHRxdWlja2NzcyhzdWJFbCwgcHJvcGVydHksIHZhbHVlKSBmb3Igc3ViRWwgaW4gdGFyZ2V0RWxcblx0XG5cdFx0d2hlbiB0eXBlb2YgcHJvcGVydHkgaXMgJ29iamVjdCcgIyBQYXNzZWQgYSBzdHlsZSBtYXBcblx0XHRcdHF1aWNrY3NzKHRhcmdldEVsLCBzdWJQcm9wZXJ0eSwgc3ViVmFsdWUpIGZvciBzdWJQcm9wZXJ0eSxzdWJWYWx1ZSBvZiBwcm9wZXJ0eVxuXHRcblx0XHRlbHNlXG5cdFx0XHRwcm9wZXJ0eSA9IGhlbHBlcnMubm9ybWFsaXplUHJvcGVydHkocHJvcGVydHkpXG5cdFx0XHRpZiB0eXBlb2YgdmFsdWUgaXMgJ3VuZGVmaW5lZCdcblx0XHRcdFx0Y29tcHV0ZWRTdHlsZSA9IHRhcmdldEVsLl9jb21wdXRlZFN0eWxlIHx8PSBnZXRDb21wdXRlZFN0eWxlKHRhcmdldEVsKVxuXHRcdFx0XHRyZXR1cm4gY29tcHV0ZWRTdHlsZVtwcm9wZXJ0eV1cblx0XHRcdFxuXHRcdFx0ZWxzZSBpZiBwcm9wZXJ0eVxuXHRcdFx0XHR0YXJnZXRFbC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wZXJ0eSwgaGVscGVycy5ub3JtYWxpemVWYWx1ZShwcm9wZXJ0eSwgdmFsdWUpLCBJTVBPUlRBTlQgaWYgaW1wb3J0YW50KVxuXG5cdHJldHVyblxuXG5cbnF1aWNrY3NzLmFuaW1hdGlvbiA9IChuYW1lLCBmcmFtZXMpLT4gaWYgbmFtZSBhbmQgdHlwZW9mIG5hbWUgaXMgJ3N0cmluZycgYW5kIGZyYW1lcyBhbmQgdHlwZW9mIGZyYW1lcyBpcyAnb2JqZWN0J1xuXHRwcmVmaXggPSBoZWxwZXJzLmdldFByZWZpeCgnYW5pbWF0aW9uJylcblx0Z2VuZXJhdGVkID0gJydcblx0XG5cdGZvciBmcmFtZSxydWxlcyBvZiBmcmFtZXNcblx0XHRnZW5lcmF0ZWQgKz0gXCIje2ZyYW1lfSB7I3toZWxwZXJzLnJ1bGVUb1N0cmluZyhydWxlcyl9fVwiXG5cblx0Z2VuZXJhdGVkID0gXCJAI3twcmVmaXh9a2V5ZnJhbWVzICN7bmFtZX0geyN7Z2VuZXJhdGVkfX1cIlxuXHRoZWxwZXJzLmlubGluZVN0eWxlKGdlbmVyYXRlZCwgdHJ1ZSwgMClcblxuXG5xdWlja2Nzcy5yZWdpc3RlciA9IChydWxlLCBsZXZlbCwgaW1wb3J0YW50KS0+IGlmIHJ1bGUgYW5kIHR5cGVvZiBydWxlIGlzICdvYmplY3QnXG5cdGxldmVsIHx8PSAwXG5cdHJ1bGUgPSBoZWxwZXJzLnJ1bGVUb1N0cmluZyhydWxlLCBpbXBvcnRhbnQpXG5cblx0dW5sZXNzIGNsYXNzTmFtZSA9IGhlbHBlcnMuaW5saW5lU3R5bGVDb25maWdbbGV2ZWxdP1tydWxlXVxuXHRcdGNsYXNzTmFtZSA9IGhlbHBlcnMuaGFzaChydWxlKVxuXHRcdHN0eWxlID0gXCIuI3tjbGFzc05hbWV9IHsje3J1bGV9fVwiXG5cdFx0aGVscGVycy5pbmxpbmVTdHlsZShzdHlsZSwgY2xhc3NOYW1lLCBsZXZlbClcblxuXHRyZXR1cm4gY2xhc3NOYW1lXG5cblxucXVpY2tjc3MuY2xlYXJSZWdpc3RlcmVkID0gKGxldmVsKS0+XG5cdGhlbHBlcnMuY2xlYXJJbmxpbmVTdHlsZShsZXZlbCBvciAwKVxuXG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcbnF1aWNrY3NzLlVOU0VUID0gc3dpdGNoXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywndW5zZXQnKSB0aGVuICd1bnNldCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbml0aWFsJykgdGhlbiAnaW5pdGlhbCdcblx0d2hlbiBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWQoJ2Rpc3BsYXknLCdpbmhlcml0JykgdGhlbiAnaW5oZXJpdCdcblxucXVpY2tjc3Muc3VwcG9ydHMgPSBoZWxwZXJzLmlzVmFsdWVTdXBwb3J0ZWRcbnF1aWNrY3NzLnN1cHBvcnRzUHJvcGVydHkgPSBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZFxucXVpY2tjc3Mubm9ybWFsaXplUHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5XG5xdWlja2Nzcy5ub3JtYWxpemVWYWx1ZSA9IGhlbHBlcnMubm9ybWFsaXplVmFsdWVcbnF1aWNrY3NzLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nXG5cblxubW9kdWxlLmV4cG9ydHMgPSBxdWlja2NzcyIsIntcbiAgXCJfZnJvbVwiOiBcInF1aWNrY3NzQGxhdGVzdFwiLFxuICBcIl9pZFwiOiBcInF1aWNrY3NzQDEuNC4xXCIsXG4gIFwiX2luQnVuZGxlXCI6IGZhbHNlLFxuICBcIl9pbnRlZ3JpdHlcIjogXCJzaGE1MTItNVBRVVRQRWkyUWxOMGorUnZVUkJ5L0xjY0FxdzRqeDlrQ1BFaDJQdzhXS3d6eTlBTFVGU0tLRVByT3ViT21sNEVjUEphek83R3liKzVwRU9OcUp3TWc9PVwiLFxuICBcIl9sb2NhdGlvblwiOiBcIi9xdWlja2Nzc1wiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwidGFnXCIsXG4gICAgXCJyZWdpc3RyeVwiOiB0cnVlLFxuICAgIFwicmF3XCI6IFwicXVpY2tjc3NAbGF0ZXN0XCIsXG4gICAgXCJuYW1lXCI6IFwicXVpY2tjc3NcIixcbiAgICBcImVzY2FwZWROYW1lXCI6IFwicXVpY2tjc3NcIixcbiAgICBcInJhd1NwZWNcIjogXCJsYXRlc3RcIixcbiAgICBcInNhdmVTcGVjXCI6IG51bGwsXG4gICAgXCJmZXRjaFNwZWNcIjogXCJsYXRlc3RcIlxuICB9LFxuICBcIl9yZXF1aXJlZEJ5XCI6IFtcbiAgICBcIiNVU0VSXCIsXG4gICAgXCIvXCIsXG4gICAgXCIvcXVpY2tkb21cIlxuICBdLFxuICBcIl9yZXNvbHZlZFwiOiBcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3F1aWNrY3NzLy0vcXVpY2tjc3MtMS40LjEudGd6XCIsXG4gIFwiX3NoYXN1bVwiOiBcIjliMjMxOTA0YWY1YTY4ZjkzNmVlMTE1ZTU0NWIxOGYzYmQzMDg3ODBcIixcbiAgXCJfc3BlY1wiOiBcInF1aWNrY3NzQGxhdGVzdFwiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrZmllbGRcIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcImRhbmllbGthbGVuXCJcbiAgfSxcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3F1aWNrY3NzLmRlYnVnLmpzXCIsXG4gICAgXCIuL2Rpc3QvcXVpY2tjc3MuanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2Nzcy9pc3N1ZXNcIlxuICB9LFxuICBcImJ1bmRsZURlcGVuZGVuY2llc1wiOiBmYWxzZSxcbiAgXCJkZXByZWNhdGVkXCI6IGZhbHNlLFxuICBcImRlc2NyaXB0aW9uXCI6IFwi4pqh77iPLWZhc3QgdGlueSBDU1MgbWFuYWdlbWVudCB0b29sIHNwcmlua2xlZCB3aXRoIEFQSSBzdWdhclwiLFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAYmFiZWwvY29yZVwiOiBcIl43LjEuNlwiLFxuICAgIFwiQGJhYmVsL3ByZXNldC1lbnZcIjogXCJeNy4xLjZcIixcbiAgICBcImJhYmVsaWZ5XCI6IFwiXjEwLjAuMFwiLFxuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy41LjBcIixcbiAgICBcImNoYWxrXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJjb2ZmZWUtc2NyaXB0XCI6IFwiXjEuMTIuNlwiLFxuICAgIFwiZXhlY2FcIjogXCJeMC43LjBcIixcbiAgICBcImZzLWpldHBhY2tcIjogXCJeMC4xMy4zXCIsXG4gICAgXCJwcm9taXNlLWJyZWFrXCI6IFwiXjAuMS4xXCIsXG4gICAgXCJzZW12ZXJcIjogXCJeNS4zLjBcIixcbiAgICBcInNpbXBseWltcG9ydFwiOiBcIl40LjAuOVwiLFxuICAgIFwic2ltcGx5d2F0Y2hcIjogXCJeMy4wLjBcIlxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJmaWxlc1wiOiBbXG4gICAgXCJkaXN0XCIsXG4gICAgXCJzcmNcIlxuICBdLFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrY3NzI3JlYWRtZVwiLFxuICBcImxpY2Vuc2VcIjogXCJJU0NcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9xdWlja2Nzcy5qc1wiLFxuICBcIm5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2Nzcy5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJjYWtlIC1kIGJ1aWxkICYmIGNha2UgYnVpbGQgJiYgY2FrZSBtZWFzdXJlICYmIGNwIC1yIGJ1aWxkLyogZGlzdC9cIixcbiAgICBcImNvdmVyYWdlXCI6IFwiY2FrZSBpbnN0YWxsOmNvdmVyYWdlOyBucG0gcnVuIGNvdmVyYWdlOnJ1biAmJiBucG0gcnVuIGNvdmVyYWdlOmJhZGdlXCIsXG4gICAgXCJjb3ZlcmFnZTpiYWRnZVwiOiBcImJhZGdlLWdlbiAtZCAuLy5jb25maWcvYmFkZ2VzL2NvdmVyYWdlXCIsXG4gICAgXCJjb3ZlcmFnZTpydW5cIjogXCJjb3ZlcmFnZT10cnVlIG5wbSBydW4gdGVzdDplbGVjdHJvblwiLFxuICAgIFwiY292ZXJhZ2U6c2hvd1wiOiBcIm9wZW4gY292ZXJhZ2UvbGNvdi1yZXBvcnQvaW5kZXguaHRtbFwiLFxuICAgIFwicG9zdHB1Ymxpc2hcIjogXCJnaXQgcHVzaFwiLFxuICAgIFwicG9zdHZlcnNpb25cIjogXCJucG0gcnVuIGJ1aWxkICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJucG0gcnVuIHRlc3Q6dHJhdmlzXCIsXG4gICAgXCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpicm93c2VyXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEVsZWN0cm9uIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6Y2hyb21lXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBDaHJvbWUgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpmaXJlZm94XCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEZpcmVmb3ggLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDprYXJtYVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6bG9jYWxcIjogXCJvcGVuIHRlc3QvdGVzdHJ1bm5lci5odG1sXCIsXG4gICAgXCJ0ZXN0Om1pbmlmaWVkXCI6IFwibWluaWZpZWQ9MSBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OnNhZmFyaVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgU2FmYXJpIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6c2F1Y2VcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBzYXVjZT0xIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6dHJhdmlzXCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgJiYgbnBtIHJ1biB0ZXN0Om1pbmlmaWVkIC1zXCIsXG4gICAgXCJ3YXRjaFwiOiBcImNha2UgLWQgd2F0Y2hcIlxuICB9LFxuICBcInNpbXBseWltcG9ydFwiOiB7XG4gICAgXCJmaW5hbFRyYW5zZm9ybVwiOiBbXG4gICAgICBbXG4gICAgICAgIFwiYmFiZWxpZnlcIixcbiAgICAgICAge1xuICAgICAgICAgIFwicHJlc2V0c1wiOiBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIFwiQGJhYmVsL3ByZXNldC1lbnZcIixcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibW9kdWxlc1wiOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXN1cGVyXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktcmVuYW1lXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc2ltcGxlXCJcbiAgICBdXG4gIH0sXG4gIFwidmVyc2lvblwiOiBcIjEuNC4xXCJcbn1cbiIsImF2YWlsU2V0cyA9IFxuXHRuYXRpdmVzOiBpbXBvcnQgJy4vbmF0aXZlcydcblx0ZG9tOiBpbXBvcnQgJy4vZG9tJ1xuXG5jbGFzcyBDaGVja3Ncblx0Y3JlYXRlOiAoKS0+XG5cdFx0YXJncyA9IEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cykgaWYgYXJndW1lbnRzLmxlbmd0aFxuXHRcdG5ldyBDaGVja3MoYXJncylcblx0XG5cblx0Y29uc3RydWN0b3I6IChzZXRzKS0+XG5cdFx0c2V0cyA/PSBbJ25hdGl2ZXMnXVxuXHRcdFxuXHRcdGZvciBzZXQgaW4gc2V0c1xuXHRcdFx0QGxvYWQoYXZhaWxTZXRzW3NldF0pIGlmIGF2YWlsU2V0c1tzZXRdXG5cblxuXHRsb2FkOiAoc2V0KS0+XG5cdFx0c2V0ID0gYXZhaWxTZXRzW3NldF0gaWYgYXZhaWxTZXRzLm5hdGl2ZXMuc3RyaW5nKHNldClcblx0XHRyZXR1cm4gaWYgbm90IGF2YWlsU2V0cy5uYXRpdmVzLm9iamVjdFBsYWluKHNldClcblx0XHRcblx0XHRmb3Iga2V5LHZhbHVlIG9mIHNldFxuXHRcdFx0QFtrZXldID0gdmFsdWVcblx0XHRcblx0XHRyZXR1cm5cblx0XG5cdFxubW9kdWxlLmV4cG9ydHMgPSBDaGVja3M6OmNyZWF0ZSgpIiwiaXNBcnJheSA9ICh0YXJnZXQpLT5cblx0QXJyYXkuaXNBcnJheSh0YXJnZXQpXG5cbmlzT2JqZWN0ID0gKHRhcmdldCktPlxuXHR0YXJnZXQgYW5kIE9iamVjdDo6dG9TdHJpbmcuY2FsbCh0YXJnZXQpIGlzICdbb2JqZWN0IE9iamVjdF0nIG9yIGlzQXJyYXkodGFyZ2V0KVxuXG5zaG91bGREZWVwRXh0ZW5kID0gKG9wdGlvbnMsIHRhcmdldCwgcGFyZW50S2V5KS0+XG5cdGlmIG9wdGlvbnMuZGVlcFxuXHRcdGlmIG9wdGlvbnMubm90RGVlcCB0aGVuIG5vdCBvcHRpb25zLm5vdERlZXBbdGFyZ2V0XSBlbHNlIHRydWVcblxuXHRlbHNlIGlmIG9wdGlvbnMuZGVlcE9ubHlcblx0XHRvcHRpb25zLmRlZXBPbmx5W3RhcmdldF0gb3IgcGFyZW50S2V5IGFuZCBzaG91bGREZWVwRXh0ZW5kKG9wdGlvbnMsIHBhcmVudEtleSlcblxuXHQjIGVsc2UgZmFsc2VcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZCA9IChvcHRpb25zLCB0YXJnZXQsIHNvdXJjZXMsIHBhcmVudEtleSktPlxuXHR0YXJnZXQgPSB7fSBpZiBub3QgdGFyZ2V0IG9yIHR5cGVvZiB0YXJnZXQgaXNudCAnb2JqZWN0JyBhbmQgdHlwZW9mIHRhcmdldCBpc250ICdmdW5jdGlvbidcblxuXHRmb3Igc291cmNlIGluIHNvdXJjZXMgd2hlbiBzb3VyY2U/XG5cdFx0Zm9yIGtleSBvZiBzb3VyY2Vcblx0XHRcdHNvdXJjZVZhbHVlID0gc291cmNlW2tleV1cblx0XHRcdHRhcmdldFZhbHVlID0gdGFyZ2V0W2tleV1cblx0XHRcdFxuXHRcdFx0Y29udGludWUgaWYgc291cmNlVmFsdWUgaXMgdGFyZ2V0IG9yXG5cdFx0XHRcdFx0XHRzb3VyY2VWYWx1ZSBpcyB1bmRlZmluZWQgb3Jcblx0XHRcdFx0XHRcdChzb3VyY2VWYWx1ZSBpcyBudWxsIGFuZCBub3Qgb3B0aW9ucy5hbGxvd051bGwgYW5kIG5vdCBvcHRpb25zLm51bGxEZWxldGVzKSBvclxuXHRcdFx0XHRcdFx0KG9wdGlvbnMua2V5cyBhbmQgbm90IG9wdGlvbnMua2V5c1trZXldKSBvclxuXHRcdFx0XHRcdFx0KG9wdGlvbnMubm90S2V5cyBhbmQgb3B0aW9ucy5ub3RLZXlzW2tleV0pIG9yXG5cdFx0XHRcdFx0XHQob3B0aW9ucy5vd24gYW5kIG5vdCBzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkgb3Jcblx0XHRcdFx0XHRcdChvcHRpb25zLmdsb2JhbEZpbHRlciBhbmQgbm90IG9wdGlvbnMuZ2xvYmFsRmlsdGVyKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSkpIG9yXG5cdFx0XHRcdFx0XHQob3B0aW9ucy5maWx0ZXJzIGFuZCBvcHRpb25zLmZpbHRlcnNba2V5XSBhbmQgbm90IG9wdGlvbnMuZmlsdGVyc1trZXldKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSkpXG5cdFx0XHRcblx0XHRcdGlmIHNvdXJjZVZhbHVlIGlzIG51bGwgYW5kIG9wdGlvbnMubnVsbERlbGV0ZXNcblx0XHRcdFx0ZGVsZXRlIHRhcmdldFtrZXldXG5cdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRpZiBvcHRpb25zLmdsb2JhbFRyYW5zZm9ybVxuXHRcdFx0XHRzb3VyY2VWYWx1ZSA9IG9wdGlvbnMuZ2xvYmFsVHJhbnNmb3JtKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSlcblx0XHRcdGlmIG9wdGlvbnMudHJhbnNmb3JtcyBhbmQgb3B0aW9ucy50cmFuc2Zvcm1zW2tleV1cblx0XHRcdFx0c291cmNlVmFsdWUgPSBvcHRpb25zLnRyYW5zZm9ybXNba2V5XShzb3VyY2VWYWx1ZSwga2V5LCBzb3VyY2UpXG5cdFxuXHRcdFx0c3dpdGNoXG5cdFx0XHRcdHdoZW4gb3B0aW9ucy5jb25jYXQgYW5kIGlzQXJyYXkoc291cmNlVmFsdWUpIGFuZCBpc0FycmF5KHRhcmdldFZhbHVlKVxuXHRcdFx0XHRcdHRhcmdldFtrZXldID0gdGFyZ2V0VmFsdWUuY29uY2F0KHNvdXJjZVZhbHVlKVxuXHRcdFx0XHRcblx0XHRcdFx0d2hlbiBzaG91bGREZWVwRXh0ZW5kKG9wdGlvbnMsIGtleSwgcGFyZW50S2V5KSBhbmQgaXNPYmplY3Qoc291cmNlVmFsdWUpXG5cdFx0XHRcdFx0c3ViVGFyZ2V0ID0gaWYgaXNPYmplY3QodGFyZ2V0VmFsdWUpIHRoZW4gdGFyZ2V0VmFsdWUgZWxzZSBpZiBpc0FycmF5KHNvdXJjZVZhbHVlKSB0aGVuIFtdIGVsc2Uge31cblx0XHRcdFx0XHR0YXJnZXRba2V5XSA9IGV4dGVuZChvcHRpb25zLCBzdWJUYXJnZXQsIFtzb3VyY2VWYWx1ZV0sIGtleSlcblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGFyZ2V0W2tleV0gPSBzb3VyY2VWYWx1ZVxuXG5cblx0cmV0dXJuIHRhcmdldFxuXG5cblxuXG5cblxuXG4iLCIhKGZ1bmN0aW9uKHdpbikge1xuXG4vKipcbiAqIEZhc3REb21cbiAqXG4gKiBFbGltaW5hdGVzIGxheW91dCB0aHJhc2hpbmdcbiAqIGJ5IGJhdGNoaW5nIERPTSByZWFkL3dyaXRlXG4gKiBpbnRlcmFjdGlvbnMuXG4gKlxuICogQGF1dGhvciBXaWxzb24gUGFnZSA8d2lsc29ucGFnZUBtZS5jb20+XG4gKiBAYXV0aG9yIEtvcm5lbCBMZXNpbnNraSA8a29ybmVsLmxlc2luc2tpQGZ0LmNvbT5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWluaSBsb2dnZXJcbiAqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xudmFyIGRlYnVnID0gMCA/IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSwgJ1tmYXN0ZG9tXScpIDogZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBOb3JtYWxpemVkIHJBRlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xudmFyIHJhZiA9IHdpbi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi5tc1JlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCBmdW5jdGlvbihjYikgeyByZXR1cm4gc2V0VGltZW91dChjYiwgMTYpOyB9O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBgRmFzdERvbWAuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEZhc3REb20oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5yZWFkcyA9IFtdO1xuICBzZWxmLndyaXRlcyA9IFtdO1xuICBzZWxmLnJhZiA9IHJhZi5iaW5kKHdpbik7IC8vIHRlc3QgaG9va1xuICBkZWJ1ZygnaW5pdGlhbGl6ZWQnLCBzZWxmKTtcbn1cblxuRmFzdERvbS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBGYXN0RG9tLFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgam9iIHRvIHRoZSByZWFkIGJhdGNoIGFuZFxuICAgKiBzY2hlZHVsZXMgYSBuZXcgZnJhbWUgaWYgbmVlZCBiZS5cbiAgICpcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIG1lYXN1cmU6IGZ1bmN0aW9uKGZuLCBjdHgpIHtcbiAgICBkZWJ1ZygnbWVhc3VyZScpO1xuICAgIHZhciB0YXNrID0gIWN0eCA/IGZuIDogZm4uYmluZChjdHgpO1xuICAgIHRoaXMucmVhZHMucHVzaCh0YXNrKTtcbiAgICBzY2hlZHVsZUZsdXNoKHRoaXMpO1xuICAgIHJldHVybiB0YXNrO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgam9iIHRvIHRoZVxuICAgKiB3cml0ZSBiYXRjaCBhbmQgc2NoZWR1bGVzXG4gICAqIGEgbmV3IGZyYW1lIGlmIG5lZWQgYmUuXG4gICAqXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICAgKiBAcHVibGljXG4gICAqL1xuICBtdXRhdGU6IGZ1bmN0aW9uKGZuLCBjdHgpIHtcbiAgICBkZWJ1ZygnbXV0YXRlJyk7XG4gICAgdmFyIHRhc2sgPSAhY3R4ID8gZm4gOiBmbi5iaW5kKGN0eCk7XG4gICAgdGhpcy53cml0ZXMucHVzaCh0YXNrKTtcbiAgICBzY2hlZHVsZUZsdXNoKHRoaXMpO1xuICAgIHJldHVybiB0YXNrO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYSBzY2hlZHVsZWQgJ3JlYWQnIG9yICd3cml0ZScgdGFzay5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHRhc2tcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2Vzc1xuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhcjogZnVuY3Rpb24odGFzaykge1xuICAgIGRlYnVnKCdjbGVhcicsIHRhc2spO1xuICAgIHJldHVybiByZW1vdmUodGhpcy5yZWFkcywgdGFzaykgfHwgcmVtb3ZlKHRoaXMud3JpdGVzLCB0YXNrKTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIHRoaXMgRmFzdERvbSB3aXRoIHNvbWVcbiAgICogY3VzdG9tIGZ1bmN0aW9uYWxpdHkuXG4gICAqXG4gICAqIEJlY2F1c2UgZmFzdGRvbSBtdXN0ICphbHdheXMqIGJlIGFcbiAgICogc2luZ2xldG9uLCB3ZSdyZSBhY3R1YWxseSBleHRlbmRpbmdcbiAgICogdGhlIGZhc3Rkb20gaW5zdGFuY2UuIFRoaXMgbWVhbnMgdGFza3NcbiAgICogc2NoZWR1bGVkIGJ5IGFuIGV4dGVuc2lvbiBzdGlsbCBlbnRlclxuICAgKiBmYXN0ZG9tJ3MgZ2xvYmFsIHRhc2sgcXVldWUuXG4gICAqXG4gICAqIFRoZSAnc3VwZXInIGluc3RhbmNlIGNhbiBiZSBhY2Nlc3NlZFxuICAgKiBmcm9tIGB0aGlzLmZhc3Rkb21gLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgbXlGYXN0ZG9tID0gZmFzdGRvbS5leHRlbmQoe1xuICAgKiAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgKiAgICAgLy8gcnVucyBvbiBjcmVhdGlvblxuICAgKiAgIH0sXG4gICAqXG4gICAqICAgLy8gb3ZlcnJpZGUgYSBtZXRob2RcbiAgICogICBtZWFzdXJlOiBmdW5jdGlvbihmbikge1xuICAgKiAgICAgLy8gZG8gZXh0cmEgc3R1ZmYgLi4uXG4gICAqXG4gICAqICAgICAvLyB0aGVuIGNhbGwgdGhlIG9yaWdpbmFsXG4gICAqICAgICByZXR1cm4gdGhpcy5mYXN0ZG9tLm1lYXN1cmUoZm4pO1xuICAgKiAgIH0sXG4gICAqXG4gICAqICAgLi4uXG4gICAqIH0pO1xuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHByb3BzICBwcm9wZXJ0aWVzIHRvIG1peGluXG4gICAqIEByZXR1cm4ge0Zhc3REb219XG4gICAqL1xuICBleHRlbmQ6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgZGVidWcoJ2V4dGVuZCcsIHByb3BzKTtcbiAgICBpZiAodHlwZW9mIHByb3BzICE9ICdvYmplY3QnKSB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIG9iamVjdCcpO1xuXG4gICAgdmFyIGNoaWxkID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICBtaXhpbihjaGlsZCwgcHJvcHMpO1xuICAgIGNoaWxkLmZhc3Rkb20gPSB0aGlzO1xuXG4gICAgLy8gcnVuIG9wdGlvbmFsIGNyZWF0aW9uIGhvb2tcbiAgICBpZiAoY2hpbGQuaW5pdGlhbGl6ZSkgY2hpbGQuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIGNoaWxkO1xuICB9LFxuXG4gIC8vIG92ZXJyaWRlIHRoaXMgd2l0aCBhIGZ1bmN0aW9uXG4gIC8vIHRvIHByZXZlbnQgRXJyb3JzIGluIGNvbnNvbGVcbiAgLy8gd2hlbiB0YXNrcyB0aHJvd1xuICBjYXRjaDogbnVsbFxufTtcblxuLyoqXG4gKiBTY2hlZHVsZXMgYSBuZXcgcmVhZC93cml0ZVxuICogYmF0Y2ggaWYgb25lIGlzbid0IHBlbmRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gc2NoZWR1bGVGbHVzaChmYXN0ZG9tKSB7XG4gIGlmICghZmFzdGRvbS5zY2hlZHVsZWQpIHtcbiAgICBmYXN0ZG9tLnNjaGVkdWxlZCA9IHRydWU7XG4gICAgZmFzdGRvbS5yYWYoZmx1c2guYmluZChudWxsLCBmYXN0ZG9tKSk7XG4gICAgZGVidWcoJ2ZsdXNoIHNjaGVkdWxlZCcpO1xuICB9XG59XG5cbi8qKlxuICogUnVucyBxdWV1ZWQgYHJlYWRgIGFuZCBgd3JpdGVgIHRhc2tzLlxuICpcbiAqIEVycm9ycyBhcmUgY2F1Z2h0IGFuZCB0aHJvd24gYnkgZGVmYXVsdC5cbiAqIElmIGEgYC5jYXRjaGAgZnVuY3Rpb24gaGFzIGJlZW4gZGVmaW5lZFxuICogaXQgaXMgY2FsbGVkIGluc3RlYWQuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZmx1c2goZmFzdGRvbSkge1xuICBkZWJ1ZygnZmx1c2gnKTtcblxuICB2YXIgd3JpdGVzID0gZmFzdGRvbS53cml0ZXM7XG4gIHZhciByZWFkcyA9IGZhc3Rkb20ucmVhZHM7XG4gIHZhciBlcnJvcjtcblxuICB0cnkge1xuICAgIGRlYnVnKCdmbHVzaGluZyByZWFkcycsIHJlYWRzLmxlbmd0aCk7XG4gICAgcnVuVGFza3MocmVhZHMpO1xuICAgIGRlYnVnKCdmbHVzaGluZyB3cml0ZXMnLCB3cml0ZXMubGVuZ3RoKTtcbiAgICBydW5UYXNrcyh3cml0ZXMpO1xuICB9IGNhdGNoIChlKSB7IGVycm9yID0gZTsgfVxuXG4gIGZhc3Rkb20uc2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgLy8gSWYgdGhlIGJhdGNoIGVycm9yZWQgd2UgbWF5IHN0aWxsIGhhdmUgdGFza3MgcXVldWVkXG4gIGlmIChyZWFkcy5sZW5ndGggfHwgd3JpdGVzLmxlbmd0aCkgc2NoZWR1bGVGbHVzaChmYXN0ZG9tKTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICBkZWJ1ZygndGFzayBlcnJvcmVkJywgZXJyb3IubWVzc2FnZSk7XG4gICAgaWYgKGZhc3Rkb20uY2F0Y2gpIGZhc3Rkb20uY2F0Y2goZXJyb3IpO1xuICAgIGVsc2UgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBydW4gdGhpcyBpbnNpZGUgYSB0cnkgY2F0Y2hcbiAqIHNvIHRoYXQgaWYgYW55IGpvYnMgZXJyb3IsIHdlXG4gKiBhcmUgYWJsZSB0byByZWNvdmVyIGFuZCBjb250aW51ZVxuICogdG8gZmx1c2ggdGhlIGJhdGNoIHVudGlsIGl0J3MgZW1wdHkuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcnVuVGFza3ModGFza3MpIHtcbiAgZGVidWcoJ3J1biB0YXNrcycpO1xuICB2YXIgdGFzazsgd2hpbGUgKHRhc2sgPSB0YXNrcy5zaGlmdCgpKSB0YXNrKCk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhbiBBcnJheS5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyYXlcbiAqIEBwYXJhbSAgeyp9IGl0ZW1cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZShhcnJheSwgaXRlbSkge1xuICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuICByZXR1cm4gISF+aW5kZXggJiYgISFhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG4vKipcbiAqIE1peGluIG93biBwcm9wZXJ0aWVzIG9mIHNvdXJjZVxuICogb2JqZWN0IGludG8gdGhlIHRhcmdldC5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRhcmdldFxuICogQHBhcmFtICB7T2JqZWN0fSBzb3VyY2VcbiAqL1xuZnVuY3Rpb24gbWl4aW4odGFyZ2V0LCBzb3VyY2UpIHtcbiAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxufVxuXG4vLyBUaGVyZSBzaG91bGQgbmV2ZXIgYmUgbW9yZSB0aGFuXG4vLyBvbmUgaW5zdGFuY2Ugb2YgYEZhc3REb21gIGluIGFuIGFwcFxudmFyIGV4cG9ydHMgPSB3aW4uZmFzdGRvbSA9ICh3aW4uZmFzdGRvbSB8fCBuZXcgRmFzdERvbSgpKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbi8vIEV4cG9zZSB0byBDSlMgJiBBTURcbmlmICgodHlwZW9mIGRlZmluZSkgPT0gJ2Z1bmN0aW9uJykgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gZXhwb3J0czsgfSk7XG5lbHNlIGlmICgodHlwZW9mIG1vZHVsZSkgPT0gJ29iamVjdCcpIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcblxufSkoIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdGhpcyk7XG4iLCJJUyA9IGltcG9ydCAnLi4vY2hlY2tzJ1xuU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5cblxuY2xhc3MgQ29uZGl0aW9uXG5cdGNvbnN0cnVjdG9yOiAoQGZpZWxkLCBAc2V0dGluZ3MsIEBjYWxsYmFjayktPlxuXHRcdEBzYXRpc2ZpZWQgPSBmYWxzZVxuXHRcdEB2YWx1ZSA9IEBzZXR0aW5ncy52YWx1ZVxuXHRcdEBwcm9wZXJ0eSA9IEBzZXR0aW5ncy5wcm9wZXJ0eSBvciAnX3ZhbHVlJ1xuXHRcdEBwcm9wZXJ0eSA9ICdfdmFsdWUnIGlmIEBzZXR0aW5ncy5wcm9wZXJ0eSBpcyAndmFsdWUnXG5cdFx0dGFyZ2V0ID0gQGZpZWxkLmFsbEZpZWxkc1tAc2V0dGluZ3MudGFyZ2V0XSBvciBAc2V0dGluZ3MudGFyZ2V0XHRcblx0XHRcblx0XHRpZiBJUy5maWVsZCh0YXJnZXQpXG5cdFx0XHRAdGFyZ2V0ID0gdGFyZ2V0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGNvbnNvbGUud2FybihcImNvbmRpdGlvbiB0YXJnZXQgbm90IGZvdW5kIGZvciB0aGUgcHJvdmlkZWQgSUQgJyN7QHNldHRpbmdzLnRhcmdldH0nXCIsIEBmaWVsZClcblxuXHRcdHByb3BlcnR5ID0gaWYgSVMuYXJyYXkoQHRhcmdldFtAcHJvcGVydHldKSB0aGVuIFwiYXJyYXk6I3tAcHJvcGVydHl9XCIgZWxzZSBAcHJvcGVydHlcblxuXHRcdFNpbXBseUJpbmQocHJvcGVydHksIHVwZGF0ZU9uQmluZDpmYWxzZSkub2YoQHRhcmdldClcblx0XHRcdC5hbmQoJ3Zpc2libGUnKS5vZihAdGFyZ2V0LnN0YXRlKVxuXHRcdFx0XHQudG8oQGNhbGxiYWNrKVxuXG5cdFx0U2ltcGx5QmluZCgnc2F0aXNmaWVkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0LnRvIChuZXdWYWx1ZSwgb2xkVmFsdWUpPT4gQGZpZWxkLmVtaXQ/KCdjb25kaXRpb25DaGFuZ2UnLCBAKSBpZiBvbGRWYWx1ZT9cblxuXG5cdHRlc3Q6ICgpLT5cblx0XHRpZiBub3QgQHRhcmdldD8uc3RhdGUudmlzaWJsZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRjb21wYXJpc29uID0gc3dpdGNoXG5cdFx0XHR3aGVuIElTLm9iamVjdFBsYWluKEB2YWx1ZSkgdGhlbiBAdmFsdWVcblx0XHRcdHdoZW4gSVMucmVnZXgoQHZhbHVlKSB0aGVuICckcmVnZXgnOkB2YWx1ZVxuXHRcdFx0d2hlbiBAdmFsdWUgaXMgJ3ZhbGlkJyBhbmQgbm90IEBzZXR0aW5ncy5wcm9wZXJ0eSBvciBub3QgSVMuZGVmaW5lZChAdmFsdWUpIHRoZW4gJ3ZhbGlkJ1xuXHRcdFx0ZWxzZSAnJGVxJzpAdmFsdWVcblxuXHRcdGlmIGNvbXBhcmlzb24gaXMgJ3ZhbGlkJ1xuXHRcdFx0cmV0dXJuIEB0YXJnZXQudmFsaWRhdGUoKVxuXHRcdFxuXHRcdHRhcmdldFZhbHVlID0gZG8gKCk9PlxuXHRcdFx0cmV0dXJuIEB0YXJnZXQudmFsdWUgaWYgQHByb3BlcnR5IGlzICdfdmFsdWUnXG5cdFx0XHRwcm9wZXJ0eUNoYWluID0gQHByb3BlcnR5LnNwbGl0KCcuJylcblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIHByb3BlcnR5Q2hhaW4ubGVuZ3RoIGlzIDFcblx0XHRcdFx0XHRAdGFyZ2V0W0Bwcm9wZXJ0eV1cblxuXHRcdFx0XHR3aGVuIElTLmRlZmluZWQoQHRhcmdldFtAcHJvcGVydHldKVxuXHRcdFx0XHRcdEB0YXJnZXRbQHByb3BlcnR5XVxuXHRcdFx0XHRcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG5lc3RlZE9iamVjdCA9IEB0YXJnZXRcblx0XHRcdFx0XHR3aGlsZSBJUy5vYmplY3QobmVzdGVkT2JqZWN0KVxuXHRcdFx0XHRcdFx0bmVzdGVkT2JqZWN0ID0gbmVzdGVkT2JqZWN0W3Byb3BlcnR5Q2hhaW4ucG9wKCldXG5cblx0XHRcdFx0XHRyZXR1cm4gbmVzdGVkT2JqZWN0XG5cblx0XHRjb21wYXJpc29uT3BlcmF0b3JzID0gT2JqZWN0LmtleXMoY29tcGFyaXNvbilcblx0XHRwYXNzZWRDb21wYXJpc29ucyA9IGNvbXBhcmlzb25PcGVyYXRvcnMuZmlsdGVyIChvcGVyYXRvciktPlxuXHRcdFx0c2Vla2VkVmFsdWUgPSBjb21wYXJpc29uW29wZXJhdG9yXVxuXHRcdFx0c3dpdGNoIG9wZXJhdG9yXG5cdFx0XHRcdHdoZW4gJyRlcSdcdFx0dGhlbiB0YXJnZXRWYWx1ZSBpcyBzZWVrZWRWYWx1ZSBcblx0XHRcdFx0d2hlbiAnJG5lJ1x0XHR0aGVuIHRhcmdldFZhbHVlIGlzbnQgc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGd0J1x0XHR0aGVuIHRhcmdldFZhbHVlID4gc2Vla2VkVmFsdWVcblx0XHRcdFx0d2hlbiAnJGd0ZSdcdFx0dGhlbiB0YXJnZXRWYWx1ZSA+PSBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckbHQnXHRcdHRoZW4gdGFyZ2V0VmFsdWUgPCBzZWVrZWRWYWx1ZVxuXHRcdFx0XHR3aGVuICckbHRlJ1x0XHR0aGVuIHRhcmdldFZhbHVlIDw9IHNlZWtlZFZhbHVlXG5cdFx0XHRcdHdoZW4gJyRjdCdcdFx0dGhlbiBoZWxwZXJzLmluY2x1ZGVzKHRhcmdldFZhbHVlLCBzZWVrZWRWYWx1ZSlcblx0XHRcdFx0d2hlbiAnJG5jdCdcdFx0dGhlbiBub3QgaGVscGVycy5pbmNsdWRlcyh0YXJnZXRWYWx1ZSwgc2Vla2VkVmFsdWUpXG5cdFx0XHRcdHdoZW4gJyRyZWdleCdcdHRoZW4gc2Vla2VkVmFsdWUudGVzdCh0YXJnZXRWYWx1ZSlcblx0XHRcdFx0d2hlbiAnJG5yZWdleCdcdHRoZW4gbm90IHNlZWtlZFZhbHVlLnRlc3QodGFyZ2V0VmFsdWUpXG5cdFx0XHRcdHdoZW4gJyRtYXNrJ1x0dGhlbiBoZWxwZXJzLnRlc3RNYXNrKHRhcmdldFZhbHVlLCBzZWVrZWRWYWx1ZSlcblx0XHRcdFx0ZWxzZSBmYWxzZVxuXG5cdFx0cmV0dXJuIHBhc3NlZENvbXBhcmlzb25zLmxlbmd0aCBpcyBjb21wYXJpc29uT3BlcmF0b3JzLmxlbmd0aFxuXG5cblx0QHZhbGlkYXRlOiAoY29uZGl0aW9ucyktPiBpZiBjb25kaXRpb25zXG5cdFx0dmFsaWRDb25kaXRpb25zID0gY29uZGl0aW9ucy5maWx0ZXIgKGNvbmRpdGlvbiktPlxuXHRcdFx0Y29uZGl0aW9uLnNhdGlzZmllZCA9IGNvbmRpdGlvbi50ZXN0KClcblx0XHRcblx0XHRyZXR1cm4gdmFsaWRDb25kaXRpb25zLmxlbmd0aCBpcyBjb25kaXRpb25zLmxlbmd0aFxuXG5cblx0QGluaXQ6IChmaWVsZCwgY29uZGl0aW9ucywgY2FsbGJhY2spLT4gc2V0VGltZW91dCAoKT0+XG5cdFx0Y2FsbGJhY2sgPz0gKCk9PiBmaWVsZC52YWxpZGF0ZUNvbmRpdGlvbnMoKVxuXHRcdFxuXHRcdGZpZWxkLmNvbmRpdGlvbnMgPSBjb25kaXRpb25zLm1hcCAoY29uZGl0aW9uKS0+XG5cdFx0XHRuZXcgQ29uZGl0aW9uKGZpZWxkLCBjb25kaXRpb24sIGNhbGxiYWNrKVxuXG5cdFx0Y2FsbGJhY2soKVxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmRpdGlvbiIsIm1vZHVsZS5leHBvcnRzID1cblx0Zm9udEZhbWlseTogJ3N5c3RlbS11aSwgc2Fucy1zZXJpZidcblx0dGVtcGxhdGVzOiB7fVxuXHRldmVudHM6IG51bGxcblx0bGFiZWw6IGZhbHNlXG5cdGVycm9yOiAnJ1xuXHRoZWxwOiAnJ1xuXHRyZXF1aXJlZDogZmFsc2Vcblx0ZGlzYWJsZWQ6IGZhbHNlXG5cdGRlZmF1bHRWYWx1ZTogbnVsbFxuXHR3aWR0aDogJzEwMCUnXG5cdG1vYmlsZVdpZHRoOiBudWxsXG5cdG1vYmlsZVRocmVzaG9sZDogNzM2XG5cdGJvcmRlcjogMVxuXHRtYXJnaW46IG51bGxcblx0cGFkZGluZzogbnVsbFxuXHRkaXN0YW5jZTogbnVsbFxuXHRpbnB1dFBhZGRpbmc6IDEyXG5cdGZvbnRTaXplOiAxNFxuXHRsYWJlbFNpemU6IG51bGxcblx0aWNvbjogbnVsbFxuXHRpY29uU2l6ZTogMjJcblx0Z2V0dGVyOiBudWxsXG5cdHNldHRlcjogbnVsbFxuXHR2YWxpZGF0b3I6IG51bGxcblx0Y2xlYXJFcnJvck9uVmFsaWQ6IHRydWVcblx0bWFrZVJvb21Gb3JIZWxwOiB0cnVlIiwiSVMgPSBpbXBvcnQgJy4uLy4uL2NoZWNrcydcblNpbXBseUJpbmQgPSBpbXBvcnQgJ0BkYW5pZWxrYWxlbi9zaW1wbHliaW5kJ1xuS0VZQ09ERVMgPSBpbXBvcnQgJy4uLy4uL2NvbnN0YW50cy9rZXlDb2RlcydcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5Db25kaXRpb24gPSBpbXBvcnQgJy4uL2NvbmRpdGlvbidcbmV4dGVuZCA9IGltcG9ydCAnc21hcnQtZXh0ZW5kJ1xuRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcbmdsb2JhbERlZmF1bHRzID0gaW1wb3J0ICcuLi8uLi9maWVsZC9nbG9iYWxEZWZhdWx0cydcbmltcG9ydCAqIGFzIHRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUnXG5pbXBvcnQgKiBhcyBkZWZhdWx0cyBmcm9tICcuL2RlZmF1bHRzJ1xuXG5jbGFzcyBEcm9wZG93blxuXHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0ZGVmYXVsdHM6IGRlZmF1bHRzXG5cdF9zZXR0aW5nRmlsdGVyczogbWF4SGVpZ2h0OiAodmFsdWUpLT4gSVMubnVtYmVyKHZhbHVlKVxuXHRcblx0Y29uc3RydWN0b3I6IChAaW5pdGlhbENob2ljZXMsIEBmaWVsZCktPlxuXHRcdEBpc09wZW4gPSBmYWxzZVxuXHRcdEB0eXBlQnVmZmVyID0gJydcblx0XHRAc2V0dGluZ3MgPSBleHRlbmQuZGVlcC5jbG9uZS5maWx0ZXIoQF9zZXR0aW5nRmlsdGVycykoZ2xvYmFsRGVmYXVsdHMsIEBkZWZhdWx0cywgQGZpZWxkLnNldHRpbmdzLmRyb3Bkb3duKVxuXHRcdEBzZWxlY3RlZCA9IGlmIEBzZXR0aW5ncy5tdWx0aXBsZSB0aGVuIFtdIGVsc2UgbnVsbFxuXHRcdEBsYXN0U2VsZWN0ZWQgPSBudWxsXG5cdFx0QGNob2ljZXMgPSBbXVxuXHRcdEBjdXJyZW50SGlnaGxpZ2h0ZWQgPSBudWxsXG5cdFx0QHZpc2libGVDaG9pY2VzQ291bnQgPSAwXG5cdFx0QHZpc2libGVDaG9pY2VzID0gW11cblx0XHRAZWxzID0ge31cblx0XHRAX3NlbGVjdGVkQ2FsbGJhY2sgPSBoZWxwZXJzLm5vb3Bcblx0XHRcblx0XHRAX2NyZWF0ZUVsZW1lbnRzKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzKClcblx0XHRyZXR1cm4gQFxuXG5cblx0X2NyZWF0ZUVsZW1lbnRzOiAoKS0+XG5cdFx0Z2xvYmFsT3B0cyA9IHtyZWxhdGVkSW5zdGFuY2U6QH1cblx0XHRAZWxzLmNvbnRhaW5lciA9IEB0ZW1wbGF0ZS5kZWZhdWx0LnNwYXduKEBzZXR0aW5ncy50ZW1wbGF0ZXMuZGVmYXVsdCwgZXh0ZW5kKHtwYXNzU3RhdGVUb0NoaWxkcmVuOmZhbHNlfSwgZ2xvYmFsT3B0cykpXG5cdFx0QGVscy5saXN0ID0gQHRlbXBsYXRlLmxpc3Quc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5saXN0LCBnbG9iYWxPcHRzKS5hcHBlbmRUbyhAZWxzLmNvbnRhaW5lcilcblx0XHRAZWxzLmhlbHAgPSBAdGVtcGxhdGUuaGVscC5zcGF3bihAc2V0dGluZ3MudGVtcGxhdGVzLmhlbHAsIGdsb2JhbE9wdHMpLmFwcGVuZFRvKEBlbHMuY29udGFpbmVyKVxuXHRcdEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAgPSBAdGVtcGxhdGUuc2Nyb2xsSW5kaWNhdG9yVXAuc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5zY3JvbGxJbmRpY2F0b3JVcCwgZ2xvYmFsT3B0cykuYXBwZW5kVG8oQGVscy5jb250YWluZXIpXG5cdFx0QGVscy5zY3JvbGxJbmRpY2F0b3JEb3duID0gQHRlbXBsYXRlLnNjcm9sbEluZGljYXRvckRvd24uc3Bhd24oQHNldHRpbmdzLnRlbXBsYXRlcy5zY3JvbGxJbmRpY2F0b3JEb3duLCBnbG9iYWxPcHRzKS5hcHBlbmRUbyhAZWxzLmNvbnRhaW5lcilcblxuXHRcdEBsaXN0ID0gbmV3IExpc3QoQClcblx0XHRAYWRkQ2hvaWNlKGNob2ljZSkgZm9yIGNob2ljZSBpbiBAaW5pdGlhbENob2ljZXNcblx0XHRyZXR1cm5cblxuXG5cblx0X2F0dGFjaEJpbmRpbmdzOiAoKS0+XG5cdFx0QF9hdHRhY2hCaW5kaW5nc19lbFN0YXRlKClcblx0XHRAX2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXkoKVxuXHRcdEBfYXR0YWNoQmluZGluZ3Nfc2Nyb2xsSW5kaWNhdG9ycygpXG5cblxuXHRfYXR0YWNoQmluZGluZ3NfZWxTdGF0ZTogKCktPlxuXHRcdFNpbXBseUJpbmQoJ2hlbHAnKS5vZihAc2V0dGluZ3MpXG5cdFx0XHQudG8oJ3RleHQnKS5vZihAZWxzLmhlbHApXG5cdFx0XHQuYW5kLnRvIChzaG93SGVscCk9PiBAZWxzLmhlbHAuc3RhdGUgJ3Nob3dIZWxwJywgc2hvd0hlbHBcblxuXHRcdFNpbXBseUJpbmQoJ3Zpc2libGVDaG9pY2VzQ291bnQnKS5vZihAKVxuXHRcdFx0LnRvIChjb3VudCk9PiBAZWxzLmNvbnRhaW5lci5zdGF0ZSAnaGFzVmlzaWJsZUNob2ljZXMnLCAhIWNvdW50XG5cdFxuXHRcdFNpbXBseUJpbmQoJ2N1cnJlbnRIaWdobGlnaHRlZCcpLm9mKEApXG5cdFx0XHQudG8gKGN1cnJlbnQsIHByZXYpPT5cblx0XHRcdFx0cHJldi5lbC5zdGF0ZSgnaG92ZXInLCBvZmYpIGlmIHByZXZcblx0XHRcdFx0Y3VycmVudC5lbC5zdGF0ZSgnaG92ZXInLCBvbikgaWYgY3VycmVudFxuXG5cblx0X2F0dGFjaEJpbmRpbmdzX2Rpc3BsYXk6ICgpLT5cblx0XHRTaW1wbHlCaW5kKCdpc09wZW4nLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEApLnRvIChpc09wZW4pPT5cblx0XHRcdEBlbHMuY29udGFpbmVyLnN0YXRlICdpc09wZW4nLCBpc09wZW5cdFx0XG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gbnVsbCBpZiBub3QgaXNPcGVuXG5cdFxuXHRcdFx0aWYgQHNldHRpbmdzLmxvY2tTY3JvbGxcblx0XHRcdFx0aWYgaXNPcGVuXG5cdFx0XHRcdFx0aGVscGVycy5sb2NrU2Nyb2xsKEBlbHMubGlzdClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGhlbHBlcnMudW5sb2NrU2Nyb2xsKClcblxuXHRcdFx0aWYgaXNPcGVuXG5cdFx0XHRcdEBsaXN0LmFwcGVuZENob2ljZXMoKVxuXHRcdFx0XHRAbGlzdC5jYWxjRGlzcGxheSgpXG5cdFx0XHRcdEBsaXN0LnNjcm9sbFRvQ2hvaWNlKEBzZWxlY3RlZCkgaWYgQHNlbGVjdGVkIGFuZCBub3QgQHNldHRpbmdzLm11bHRpcGxlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBsaXN0LnNldFRyYW5zbGF0ZSgwKVxuXG5cblx0XHRTaW1wbHlCaW5kKCdsYXN0U2VsZWN0ZWQnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UsIHVwZGF0ZUV2ZW5JZlNhbWU6dHJ1ZSkub2YoQClcblx0XHRcdC50byAobmV3Q2hvaWNlLCBwcmV2Q2hvaWNlKT0+IEBfc2VsZWN0ZWRDYWxsYmFjayhuZXdDaG9pY2UsIHByZXZDaG9pY2UpXG5cblxuXHRcdFNpbXBseUJpbmQoJ2ZvY3VzZWQnLCB1cGRhdGVPbkJpbmQ6ZmFsc2UpLm9mKEBmaWVsZC5zdGF0ZSkudG8gKGZvY3VzZWQpPT5cblx0XHRcdGlmIG5vdCBmb2N1c2VkXG5cdFx0XHRcdEBmaWVsZC5lbC5jaGlsZC5pbnB1dC5vZmYgJ2tleWRvd24uZHJvcGRvd25OYXYnXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBmaWVsZC5lbC5jaGlsZC5pbnB1dC5vbiAna2V5ZG93bi5kcm9wZG93bk5hdicsIChldmVudCk9PiBpZiBAaXNPcGVuIHRoZW4gc3dpdGNoIGV2ZW50LmtleUNvZGVcblx0XHRcdFx0XHR3aGVuIEtFWUNPREVTLnVwXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0XHRAaGlnaGxpZ2h0UHJldigpXG5cblx0XHRcdFx0XHR3aGVuIEtFWUNPREVTLmRvd25cblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdEBoaWdobGlnaHROZXh0KClcblxuXHRcdFx0XHRcdHdoZW4gS0VZQ09ERVMuZW50ZXJcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdEBsYXN0U2VsZWN0ZWQgPSBAY3VycmVudEhpZ2hsaWdodGVkIGlmIEBjdXJyZW50SGlnaGxpZ2h0ZWRcblxuXHRcdFx0XHRcdHdoZW4gS0VZQ09ERVMuZXNjXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0XHRAaXNPcGVuID0gZmFsc2VcblxuXHRcdFxuXHRcdHJldHVybiBpZiBub3QgQHNldHRpbmdzLnR5cGVCdWZmZXJcblx0XHRTaW1wbHlCaW5kKCdmb2N1c2VkJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAZmllbGQuc3RhdGUpLnRvIChmb2N1c2VkKT0+XG5cdFx0XHRpZiBub3QgZm9jdXNlZFxuXHRcdFx0XHRET00oZG9jdW1lbnQpLm9mZiAna2V5cHJlc3MuZHJvcGRvd25UeXBlQnVmZmVyJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRET00oZG9jdW1lbnQpLm9uICdrZXlwcmVzcy5kcm9wZG93blR5cGVCdWZmZXInLCAoZXZlbnQpPT4gaWYgQGlzT3BlblxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRyZXR1cm4gaWYgbm90IEtFWUNPREVTLmFueVByaW50YWJsZShldmVudC5rZXlDb2RlKVxuXHRcdFx0XHRcdEB0eXBlQnVmZmVyICs9IGV2ZW50LmtleVxuXG5cblx0XHRTaW1wbHlCaW5kKCd0eXBlQnVmZmVyJywgdXBkYXRlT25CaW5kOmZhbHNlKS5vZihAKVxuXHRcdFx0LnRvICgpPT5cblx0XHRcdFx0Y2xlYXJUaW1lb3V0KEB0eXBlQnVmZmVyVGltZW91dClcblx0XHRcdFx0QHR5cGVCdWZmZXJUaW1lb3V0ID0gc2V0VGltZW91dCAoKT0+XG5cdFx0XHRcdFx0QHR5cGVCdWZmZXIgPSAnJ1xuXHRcdFx0XHQsMTUwMFxuXHRcdFx0XG5cdFx0XHQuYW5kLnRvIChidWZmZXIpPT4gaWYgYnVmZmVyXG5cdFx0XHRcdGZvciBjaG9pY2UgaW4gQHZpc2libGVDaG9pY2VzXG5cdFx0XHRcdFx0aWYgaGVscGVycy5zdGFydHNXaXRoKGJ1ZmZlciwgY2hvaWNlLmxhYmVsKVxuXHRcdFx0XHRcdFx0QGN1cnJlbnRIaWdobGlnaHRlZCA9IGNob2ljZVxuXHRcdFx0XHRcdFx0QGxpc3Quc2Nyb2xsVG9DaG9pY2UoY2hvaWNlKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRyZXR1cm5cblxuXG5cdF9hdHRhY2hCaW5kaW5nc19zY3JvbGxJbmRpY2F0b3JzOiAoKS0+XG5cdFx0U2ltcGx5QmluZCgnc2Nyb2xsVG9wJywgdXBkYXRlRXZlbklmU2FtZTp0cnVlKS5vZihAZWxzLmxpc3QucmF3KVxuXHRcdFx0LnRvIChzY3JvbGxUb3ApPT5cblx0XHRcdFx0c2hvd1RvcEluZGljYXRvciA9IHNjcm9sbFRvcCA+IDBcblx0XHRcdFx0c2hvd0JvdHRvbUluZGljYXRvciA9IEBlbHMubGlzdC5yYXcuc2Nyb2xsSGVpZ2h0IC0gQGVscy5saXN0LnJhdy5jbGllbnRIZWlnaHQgPiBzY3JvbGxUb3BcblxuXHRcdFx0XHRAZWxzLnNjcm9sbEluZGljYXRvclVwLnN0YXRlICd2aXNpYmxlJywgc2hvd1RvcEluZGljYXRvclxuXHRcdFx0XHRAZWxzLnNjcm9sbEluZGljYXRvckRvd24uc3RhdGUgJ3Zpc2libGUnLCBzaG93Qm90dG9tSW5kaWNhdG9yXG5cblx0XHRcdC5jb25kaXRpb24gKCk9PiBAaXNPcGVuIGFuZCBub3QgQHNldHRpbmdzLmhlbHAgYW5kIEBlbHMubGlzdC5yYXcuc2Nyb2xsSGVpZ2h0IGlzbnQgQGVscy5saXN0LnJhdy5jbGllbnRIZWlnaHQgYW5kIEBlbHMubGlzdC5yYXcuY2xpZW50SGVpZ2h0ID49IDEwMFxuXHRcdFx0LnVwZGF0ZU9uKCdldmVudDpzY3JvbGwnKS5vZihAZWxzLmxpc3QucmF3KVxuXHRcdFx0LnVwZGF0ZU9uKCdpc09wZW4nKS5vZihAKVxuXG5cdFx0QGVscy5zY3JvbGxJbmRpY2F0b3JVcC5vbiAnbW91c2VlbnRlcicsICgpPT4gQGxpc3Quc3RhcnRTY3JvbGxpbmcoJ3VwJylcblx0XHRAZWxzLnNjcm9sbEluZGljYXRvclVwLm9uICdtb3VzZWxlYXZlJywgKCk9PiBAbGlzdC5zdG9wU2Nyb2xsaW5nKClcblx0XHRAZWxzLnNjcm9sbEluZGljYXRvckRvd24ub24gJ21vdXNlZW50ZXInLCAoKT0+IEBsaXN0LnN0YXJ0U2Nyb2xsaW5nKCdkb3duJylcblx0XHRAZWxzLnNjcm9sbEluZGljYXRvckRvd24ub24gJ21vdXNlbGVhdmUnLCAoKT0+IEBsaXN0LnN0b3BTY3JvbGxpbmcoKVxuXG5cblx0YWRkQ2hvaWNlOiAoY29uZmlnKS0+XG5cdFx0aWYgSVMuYXJyYXkoY29uZmlnKVxuXHRcdFx0QGFkZENob2ljZShpdGVtKSBmb3IgaXRlbSBpbiBjb25maWdcblx0XHRcdHJldHVyblxuXHRcdFxuXHRcdGVsc2UgaWYgSVMuc3RyaW5nKGNvbmZpZylcblx0XHRcdGNvbmZpZyA9IHtsYWJlbDpjb25maWcsIHZhbHVlOmNvbmZpZ31cblx0XHRcblx0XHRlbHNlIGlmIElTLm9iamVjdFBsYWluKGNvbmZpZylcblx0XHRcdGNvbmZpZy52YWx1ZSA/PSBjb25maWcubGFiZWxcblx0XHRcdGNvbmZpZy5sYWJlbCA/PSBjb25maWcudmFsdWVcblxuXHRcdGVsc2UgcmV0dXJuXG5cblx0XHRuZXdDaG9pY2UgPSBuZXcgQ2hvaWNlKEAsIGNvbmZpZywgQGxpc3QsIEBjaG9pY2VzLmxlbmd0aClcblx0XHRuZXdDaG9pY2UuaW5pdCgpIGlmIEBsaXN0LmFwcGVuZGVkQ2hvaWNlc1xuXHRcdEBjaG9pY2VzLnB1c2gobmV3Q2hvaWNlKVxuXHRcdHJldHVybiBuZXdDaG9pY2VcblxuXHRyZW1vdmVDaG9pY2U6IChjaG9pY2UpLT5cblx0XHRpZiBJUy5hcnJheShjaG9pY2UpXG5cdFx0XHRAcmVtb3ZlQ2hvaWNlKGl0ZW0pIGZvciBpdGVtIGluIGNob2ljZVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0Y2hvaWNlID0gQGZpbmRDaG9pY2VBbnkoY2hvaWNlKVxuXG5cdFx0cmV0dXJuIGlmIG5vdCBjaG9pY2Vcblx0XHRjaG9pY2UucmVtb3ZlKClcblxuXHRyZXBsYWNlQ2hvaWNlczogKG5ld0Nob2ljZXMpLT5cblx0XHRAcmVtb3ZlQ2hvaWNlIEBjaG9pY2VzLnNsaWNlKClcblx0XHRAYWRkQ2hvaWNlIG5ld0Nob2ljZXNcblx0XHRyZXR1cm5cblxuXG5cdGFwcGVuZFRvOiAodGFyZ2V0KS0+XG5cdFx0QGVscy5jb250YWluZXIuYXBwZW5kVG8odGFyZ2V0KVxuXG5cblx0b25TZWxlY3RlZDogKGNhbGxiYWNrKS0+XG5cdFx0QF9zZWxlY3RlZENhbGxiYWNrID0gY2FsbGJhY2tcblxuXG5cdGZpbmRDaG9pY2U6IChwcm92aWRlZFZhbHVlLCBieUxhYmVsKS0+XG5cdFx0bWF0Y2hlcyA9IEBjaG9pY2VzLmZpbHRlciAoY2hvaWNlKS0+IHN3aXRjaFxuXHRcdFx0d2hlbiBJUy5vYmplY3QocHJvdmlkZWRWYWx1ZSkgdGhlbiBwcm92aWRlZFZhbHVlIGlzIGNob2ljZVxuXHRcdFx0d2hlbiBieUxhYmVsIHRoZW4gcHJvdmlkZWRWYWx1ZSBpcyBjaG9pY2UubGFiZWxcblx0XHRcdGVsc2UgcHJvdmlkZWRWYWx1ZSBpcyBjaG9pY2UudmFsdWVcblxuXHRcdHJldHVybiBtYXRjaGVzWzBdXG5cblxuXHRmaW5kQ2hvaWNlQW55OiAocHJvdmlkZWRWYWx1ZSktPlxuXHRcdEBmaW5kQ2hvaWNlKHByb3ZpZGVkVmFsdWUpIG9yIEBmaW5kQ2hvaWNlKHByb3ZpZGVkVmFsdWUsIHRydWUpXG5cblxuXHRoaWdobGlnaHRQcmV2OiAoKS0+XG5cdFx0Y3VycmVudEluZGV4ID0gQHZpc2libGVDaG9pY2VzLmluZGV4T2YoQGN1cnJlbnRIaWdobGlnaHRlZClcblx0XHRcblx0XHRpZiBjdXJyZW50SW5kZXggPiAwXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzW2N1cnJlbnRJbmRleC0xXVxuXHRcdFx0QGxpc3Quc2Nyb2xsVXAoY2hvaWNlKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblx0XHRlbHNlXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzW0B2aXNpYmxlQ2hvaWNlcy5sZW5ndGgtMV1cblx0XHRcdEBsaXN0LnNjcm9sbFRvQ2hvaWNlKGNob2ljZSwxKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblxuXG5cblx0aGlnaGxpZ2h0TmV4dDogKCktPlxuXHRcdGN1cnJlbnRJbmRleCA9IEB2aXNpYmxlQ2hvaWNlcy5pbmRleE9mKEBjdXJyZW50SGlnaGxpZ2h0ZWQpXG5cdFx0XG5cdFx0aWYgY3VycmVudEluZGV4IDwgQHZpc2libGVDaG9pY2VzLmxlbmd0aC0xXG5cdFx0XHRAY3VycmVudEhpZ2hsaWdodGVkID0gY2hvaWNlID0gQHZpc2libGVDaG9pY2VzW2N1cnJlbnRJbmRleCsxXVxuXHRcdFx0QGxpc3Quc2Nyb2xsRG93bihjaG9pY2UpIHVubGVzcyBAbGlzdC5jaG9pY2VJblZpZXcoY2hvaWNlKVxuXHRcdGVsc2Vcblx0XHRcdEBjdXJyZW50SGlnaGxpZ2h0ZWQgPSBjaG9pY2UgPSBAdmlzaWJsZUNob2ljZXNbMF1cblx0XHRcdEBsaXN0LnNjcm9sbFRvQ2hvaWNlKGNob2ljZSwxKSB1bmxlc3MgQGxpc3QuY2hvaWNlSW5WaWV3KGNob2ljZSlcblxuXG5cblxuXG5cblxuY2xhc3MgTGlzdFxuXHRjb25zdHJ1Y3RvcjogKEBkcm9wZG93biktPlxuXHRcdHtAZWxzLCBAZmllbGQsIEBzZXR0aW5nc30gPSBAZHJvcGRvd25cblx0XHRAZWwgPSBAZWxzLmxpc3Rcblx0XHRAY29udGFpbmVyID0gQGVscy5jb250YWluZXJcblx0XHRAYXBwZW5kZWRDaG9pY2VzID0gZmFsc2VcblxuXHRhcHBlbmRDaG9pY2VzOiAoKS0+XG5cdFx0cmV0dXJuIGlmIEBhcHBlbmRlZENob2ljZXNcblx0XHRjaG9pY2UuaW5pdCgpIGZvciBjaG9pY2UgaW4gQGRyb3Bkb3duLmNob2ljZXNcblx0XHRAYXBwZW5kZWRDaG9pY2VzID0gdHJ1ZVxuXG5cdGNhbGNEaXNwbGF5OiAoKS0+XG5cdFx0d2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XG5cdFx0dHJhbnNsYXRpb24gPSBAdHJhbnNsYXRpb24gb3IgMFxuXHRcdGNsaXBwaW5nUGFyZW50ID0gQGNvbnRhaW5lci5wYXJlbnRNYXRjaGluZyAocGFyZW50KS0+IG92ZXJmbG93PXBhcmVudC5zdHlsZSgnb3ZlcmZsb3dZJyk7IG92ZXJmbG93IGlzICdoaWRkZW4nIG9yIG92ZXJmbG93IGlzICdzY3JvbGwnXG5cdFx0c2Nyb2xsSGVpZ2h0ID0gQGVsLnJhdy5zY3JvbGxIZWlnaHQgb3IgSW5maW5pdHlcblx0XHRzZWxmUmVjdCA9IGV4dGVuZC5jbG9uZSBAY29udGFpbmVyLnJlY3Rcblx0XHRwYWRkaW5nID0gc2VsZlJlY3QuaGVpZ2h0IC0gQGVsLmhlaWdodFxuXHRcdGhlaWdodCA9IE1hdGgubWluIHNjcm9sbEhlaWdodCwgQHNldHRpbmdzLm1heEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0LTQwXG5cdFx0c2VsZlJlY3QuYm90dG9tID0gc2VsZlJlY3QudG9wICsgaGVpZ2h0XG5cblx0XHRpZiBjbGlwcGluZ1BhcmVudFxuXHRcdFx0Y2xpcHBpbmdSZWN0ID0gY2xpcHBpbmdQYXJlbnQucmVjdFxuXHRcdFx0Ym90dG9tQ3V0b2ZmID0gc2VsZlJlY3QuYm90dG9tIC0gY2xpcHBpbmdSZWN0LmJvdHRvbVxuXHRcdFx0dG9wQ3V0b2ZmID0gY2xpcHBpbmdSZWN0LnRvcCAtIHNlbGZSZWN0LnRvcFxuXHRcdFx0aXNCb3R0b21DdXRvZmYgPSBib3R0b21DdXRvZmYgPiAwXG5cdFx0XHRpc1RvcEN1dG9mZiA9IHRvcEN1dG9mZiA+IDBcblxuXHRcdFx0aWYgc2VsZlJlY3QudG9wID49IGNsaXBwaW5nUmVjdC5ib3R0b20gb3IgY2xpcHBpbmdSZWN0LnRvcCA+PSBzZWxmUmVjdC5ib3R0b21cblx0XHRcdFx0Y29uc29sZS53YXJuKFwiVGhlIGRyb3Bkb3duIGZvciBlbGVtZW50ICcje0BmaWVsZC5JRH0nIGNhbm5vdCBiZSBkaXNwbGF5ZWQgYXMgaXQncyBoaWRkZW4gYnkgdGhlIHBhcmVudCBvdmVyZmxvd1wiKVxuXHRcdFx0XG5cdFx0XHRlbHNlIGlmIGlzQm90dG9tQ3V0b2ZmIG9yIGlzVG9wQ3V0b2ZmXG5cdFx0XHRcdG5lZWRzTmV3SGVpZ2h0ID0gdHJ1ZVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgc2VsZlJlY3QudG9wIC0gYm90dG9tQ3V0b2ZmID4gY2xpcHBpbmdSZWN0LnRvcCBhbmQgbm90IGlzVG9wQ3V0b2ZmXG5cdFx0XHRcdFx0dHJhbnNsYXRpb24gPSBib3R0b21DdXRvZmZcblx0XHRcdFx0XHRzZWxmUmVjdC50b3AgLT0gdHJhbnNsYXRpb25cblx0XHRcdFx0XHRzZWxmUmVjdC5ib3R0b20gLT0gdHJhbnNsYXRpb25cblx0XHRcdFx0XHRjdXRvZmYgPSBjbGlwcGluZ1JlY3QudG9wIC0gc2VsZlJlY3QudG9wXG5cblx0XHRcdFx0ZWxzZSBpZiBzZWxmUmVjdC5ib3R0b20gLSB0b3BDdXRvZmYgPCBjbGlwcGluZ1JlY3QuYm90dG9tXG5cdFx0XHRcdFx0dHJhbnNsYXRpb24gPSB0b3BDdXRvZmYgKiAtMVxuXHRcdFx0XHRcdHNlbGZSZWN0LnRvcCArPSB0cmFuc2xhdGlvblxuXHRcdFx0XHRcdHNlbGZSZWN0LmJvdHRvbSArPSB0cmFuc2xhdGlvblxuXHRcdFx0XHRcdGN1dG9mZiA9IHNlbGZSZWN0LmJvdHRvbSAtIGNsaXBwaW5nUmVjdC5ib3R0b21cblxuXG5cdFx0XHRcdGlmIG5lZWRzTmV3SGVpZ2h0ID0gY3V0b2ZmID4gMFxuXHRcdFx0XHRcdGhlaWdodCA9IGN1dG9mZiAtIHBhZGRpbmdcblxuXHRcdFxuXHRcdHdpbmRvd0N1dG9mZiA9IChzZWxmUmVjdC50b3AgKyBoZWlnaHQpIC0gd2luZG93SGVpZ2h0XG5cdFx0XG5cdFx0aWYgd2luZG93Q3V0b2ZmID4gMCBhbmQgaGVpZ2h0IDwgd2luZG93SGVpZ2h0XG5cdFx0XHR0cmFuc2xhdGlvbiArPSB3aW5kb3dDdXRvZmYrMTBcblxuXHRcdEBzZXREaW1lbnNpb25zKGhlaWdodCwgQGZpZWxkLmVsLmNoaWxkLmlubmVyd3JhcC53aWR0aCsxMClcblx0XHRAc2V0VHJhbnNsYXRlKHRyYW5zbGF0aW9uKVxuXG5cblx0c2V0RGltZW5zaW9uczogKGhlaWdodCwgd2lkdGgpLT5cblx0XHRAZWwuc3R5bGUgJ21heEhlaWdodCcsIGhlaWdodCBpZiBoZWlnaHQ/XG5cdFx0QGVsLnN0eWxlICdtaW5XaWR0aCcsIHdpZHRoIGlmIHdpZHRoP1xuXG5cdFxuXHRzZXRUcmFuc2xhdGU6ICh0cmFuc2xhdGlvbiktPlxuXHRcdEB0cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uXG5cdFx0dHJhbnNsYXRpb24gKj0gLTFcblx0XHRAY29udGFpbmVyLnN0eWxlICd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZVkoI3t0cmFuc2xhdGlvbn1weClcIlxuXG5cblx0c2Nyb2xsVG9DaG9pY2U6IChjaG9pY2Usb2Zmc2V0PTMpLT5cblx0XHRkaXN0YW5lRnJvbVRvcCA9IGNob2ljZS5lbC5yYXcub2Zmc2V0VG9wXG5cdFx0c2VsZWN0ZWRIZWlnaHQgPSBjaG9pY2UuZWwuaGVpZ2h0XG5cdFx0XG5cdFx0QGVsLnJhdy5zY3JvbGxUb3AgPSBkaXN0YW5lRnJvbVRvcCAtIHNlbGVjdGVkSGVpZ2h0Km9mZnNldFxuXG5cdHNjcm9sbERvd246IChjaG9pY2UpLT5cblx0XHRAZWwucmF3LnNjcm9sbFRvcCArPSBjaG9pY2UuZWwuaGVpZ2h0XG5cblx0c2Nyb2xsVXA6IChjaG9pY2UpLT5cblx0XHRAZWwucmF3LnNjcm9sbFRvcCAtPSBjaG9pY2UuZWwuaGVpZ2h0XG5cblx0Y2hvaWNlSW5WaWV3OiAoY2hvaWNlKT0+XG5cdFx0Y2hvaWNlUmVjdCA9IGNob2ljZS5lbC5yZWN0XG5cdFx0bGlzdFJlY3QgPSBAZWwucmVjdFxuXHRcdHVwUGFkZGluZyA9IGlmIEBlbHMuc2Nyb2xsSW5kaWNhdG9yVXAuc3RhdGUoJ3Zpc2libGUnKSB0aGVuIHBhcnNlRmxvYXQgQGVscy5zY3JvbGxJbmRpY2F0b3JVcC5zdHlsZVNhZmUoJ2hlaWdodCcsdHJ1ZSlcblx0XHRkb3duUGFkZGluZyA9IGlmIEBlbHMuc2Nyb2xsSW5kaWNhdG9yRG93bi5zdGF0ZSgndmlzaWJsZScpIHRoZW4gcGFyc2VGbG9hdCBAZWxzLnNjcm9sbEluZGljYXRvckRvd24uc3R5bGVTYWZlKCdoZWlnaHQnLHRydWUpXG5cblx0XHRjaG9pY2VSZWN0LmJvdHRvbSA8PSBsaXN0UmVjdC5ib3R0b20tZG93blBhZGRpbmcgYW5kXG5cdFx0Y2hvaWNlUmVjdC50b3AgPj0gbGlzdFJlY3QudG9wK3VwUGFkZGluZ1xuXG5cblx0c3RhcnRTY3JvbGxpbmc6IChkaXJlY3Rpb24pLT5cblx0XHRAc2Nyb2xsSW50ZXJ2YWxJRCA9IHNldEludGVydmFsICgpPT5cblx0XHRcdEBlbC5yYXcuc2Nyb2xsVG9wICs9IGlmIGRpcmVjdGlvbiBpcyAndXAnIHRoZW4gLTIwIGVsc2UgMjBcblx0XHQsIDUwXG5cblxuXHRzdG9wU2Nyb2xsaW5nOiAoKS0+XG5cdFx0Y2xlYXJJbnRlcnZhbChAc2Nyb2xsSW50ZXJ2YWxJRClcblxuXG5cblxuXG5jbGFzcyBDaG9pY2Vcblx0Y29uc3RydWN0b3I6IChAZHJvcGRvd24sIEBzZXR0aW5ncywgQGxpc3QsIEBpbmRleCktPlxuXHRcdHtAbGFiZWwsIEB2YWx1ZSwgQGNvbmRpdGlvbnN9ID0gQHNldHRpbmdzXG5cdFx0QGxhYmVsID89IEB2YWx1ZVxuXHRcdEB2YWx1ZSA/PSBAbGFiZWxcblx0XHRAZmllbGQgPSBAZHJvcGRvd24uZmllbGRcblx0XHRAdmlzaWJsZSA9IHRydWVcblx0XHRAc2VsZWN0ZWQgPSBmYWxzZVxuXHRcdEB1bmF2YWlsYWJsZSA9IGZhbHNlXG5cdFx0QGluaXRpYWxpemVkID0gZmFsc2VcblxuXHRcdGlmIEBjb25kaXRpb25zPy5sZW5ndGhcblx0XHRcdEB1bmF2YWlsYWJsZSA9IHRydWVcblx0XHRcdEBhbGxGaWVsZHMgPSBAZmllbGQuYWxsRmllbGRzXG5cblx0XHRcdENvbmRpdGlvbi5pbml0IEAsIEBjb25kaXRpb25zLCAoKT0+XG5cdFx0XHRcdEB1bmF2YWlsYWJsZSA9ICFDb25kaXRpb24udmFsaWRhdGUoQGNvbmRpdGlvbnMpXG5cblx0aW5pdDogKCktPlxuXHRcdHJldHVybiBpZiBAaW5pdGlhbGl6ZWRcblx0XHRAaW5pdGlhbGl6ZWQgPSB0cnVlXG5cdFx0QGVsID0gQGRyb3Bkb3duLnRlbXBsYXRlLmNob2ljZS5zcGF3bihudWxsLCB7cmVsYXRlZEluc3RhbmNlOkBkcm9wZG93bn0pXG5cdFx0QGVsLmNoaWxkcmVuWzFdLnRleHQgPSBAbGFiZWxcblx0XHRAZWwuYXBwZW5kVG8oQGxpc3QuZWwpXG5cdFx0QF9hdHRhY2hCaW5kaW5ncygpXG5cblx0cmVtb3ZlOiAoKS0+XG5cdFx0cmV0dXJuIGlmIG5vdCBAaW5pdGlhbGl6ZWRcblx0XHRAZWwucmVtb3ZlKClcblxuXHRfYXR0YWNoQmluZGluZ3M6ICgpLT4gZG8gKCk9PlxuXHRcdFNpbXBseUJpbmQoJ3Zpc2libGUnKS5vZihAKS50byAodmlzaWJsZSxwcmV2KT0+XG5cdFx0XHRAZHJvcGRvd24udmlzaWJsZUNob2ljZXNDb3VudCArPSBpZiB2aXNpYmxlIHRoZW4gMSBlbHNlIC0xXG5cdFx0XHRAZWwuc3RhdGUgJ3Zpc2libGUnLCB2aXNpYmxlXG5cdFx0XHRpZiB2aXNpYmxlXG5cdFx0XHRcdEBkcm9wZG93bi52aXNpYmxlQ2hvaWNlcy5wdXNoKEApXG5cdFx0XHRcdGlmIElTLmRlZmluZWQocHJldikgIyBpbmRpY2F0ZXMgc3RhdGUgaGFzIGNoYW5nZWRcblx0XHRcdFx0XHRAZHJvcGRvd24udmlzaWJsZUNob2ljZXMuc29ydCAoYSxiKS0+IGEuaW5kZXggLSBiLmluZGV4XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAZHJvcGRvd24udmlzaWJsZUNob2ljZXMsIEApXG5cblx0XHRTaW1wbHlCaW5kKCdzZWxlY3RlZCcpLm9mKEApXG5cdFx0XHQudG8gKHNlbGVjdGVkKT0+IEBlbC5zdGF0ZSAnc2VsZWN0ZWQnLCBzZWxlY3RlZFxuXHRcdFxuXHRcdFNpbXBseUJpbmQoJ3VuYXZhaWxhYmxlJykub2YoQClcblx0XHRcdC50byAodW5hdmFpbGFibGUpPT4gQGVsLnN0YXRlICd1bmF2YWlsYWJsZScsIHVuYXZhaWxhYmxlXHRcdFx0XG5cdFx0XHQuYW5kLnRvICh1bmF2YWlsYWJsZSk9PiBAdG9nZ2xlKG9mZiwgdHJ1ZSkgaWYgdW5hdmFpbGFibGVcblxuXHRcdFNpbXBseUJpbmQoJ2V2ZW50OmNsaWNrJykub2YoQGVsKVxuXHRcdFx0LnRvICgpPT4gQGRyb3Bkb3duLmxhc3RTZWxlY3RlZCA9IEBcblx0XHRcblx0XHRTaW1wbHlCaW5kKCdldmVudDptb3VzZWRvd24nKS5vZihAZWwpXG5cdFx0XHQudG8gKGV2ZW50KT0+IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XG5cdFx0U2ltcGx5QmluZCgnZXZlbnQ6bW91c2VlbnRlcicpLm9mKEBlbClcblx0XHRcdC50byAoKT0+IEBkcm9wZG93bi5jdXJyZW50SGlnaGxpZ2h0ZWQgPSBAXG5cblxuXHR0b2dnbGU6IChuZXdWYWx1ZSwgdW5hdmFpbGFibGUpLT5cblx0XHRwcmV2U3RhdGUgPSBAc2VsZWN0ZWRcblx0XHRuZXdTdGF0ZSA9IGlmIElTLmRlZmluZWQobmV3VmFsdWUpIHRoZW4gbmV3VmFsdWUgZWxzZSAhQHNlbGVjdGVkXG5cblx0XHRpZiBub3QgbmV3U3RhdGVcblx0XHRcdGlmIEBkcm9wZG93bi5zZXR0aW5ncy5tdWx0aXBsZSBhbmQgcHJldlN0YXRlXG5cdFx0XHRcdEBzZWxlY3RlZCA9IG5ld1N0YXRlXG5cdFx0XHRcdGhlbHBlcnMucmVtb3ZlSXRlbShAZmllbGQuX3ZhbHVlLCBAKVxuXHRcdFx0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHdhc1NlbGVjdGVkID0gQHNlbGVjdGVkXG5cdFx0XHRcdEBzZWxlY3RlZCA9IG5ld1N0YXRlIGlmIElTLmRlZmluZWQobmV3VmFsdWUpXG5cdFx0XHRcdEBmaWVsZC5fdmFsdWUgPSBudWxsIGlmIHVuYXZhaWxhYmxlIGFuZCB3YXNTZWxlY3RlZFxuXG5cdFx0ZWxzZVxuXHRcdFx0QHNlbGVjdGVkID0gbmV3U3RhdGVcblx0XHRcdGlmIEBmaWVsZC5zZXR0aW5ncy5tdWx0aXBsZVxuXHRcdFx0XHRAZmllbGQuX3ZhbHVlLnB1c2goQClcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGZpZWxkLl92YWx1ZT8udG9nZ2xlKG9mZilcblx0XHRcdFx0QGZpZWxkLl92YWx1ZSA9IEBcblxuXHRcdFx0QGZpZWxkLmxhc3RTZWxlY3RlZCA9IEBcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93blxubW9kdWxlLmV4cG9ydHMuQ2hvaWNlID0gQ2hvaWNlIiwiU2ltcGx5QmluZCA9IGltcG9ydCAnQGRhbmllbGthbGVuL3NpbXBseWJpbmQnXG5tYXNrQ29yZSA9IGltcG9ydCAndGV4dC1tYXNrLWNvcmUnXG5tYXNrQWRkb25zID0gaW1wb3J0ICd0ZXh0LW1hc2stYWRkb25zJ1xuZXh0ZW5kID0gaW1wb3J0ICdzbWFydC1leHRlbmQnXG5JUyA9IGltcG9ydCAnLi4vY2hlY2tzJ1xuUkVHRVggPSBpbXBvcnQgJy4uL2NvbnN0YW50cy9yZWdleCdcbmhlbHBlcnMgPSBpbXBvcnQgJy4uL2hlbHBlcnMnXG5kZWZhdWx0UGF0dGVybkNoYXJzID0gXG5cdCcxJzogUkVHRVgubnVtZXJpY1xuXHQnIyc6IFJFR0VYLndpZGVudW1lcmljXG5cdCdhJzogUkVHRVgubGV0dGVyXG5cdCcqJzogUkVHRVguYW55XG5cblxuY2xhc3MgTWFza1xuXHRjb25zdHJ1Y3RvcjogKEBmaWVsZCwgQGNvbmZpZyktPlxuXHRcdEB2YWx1ZSA9ICcnXG5cdFx0QHByZXZWYWx1ZSA9ICcnXG5cdFx0QGN1cnNvciA9IDBcblx0XHRAcHJldkN1cnNvciA9IDBcblx0XHRAcGF0dGVybiA9IEBwYXR0ZXJuUmF3ID0gQGNvbmZpZy5wYXR0ZXJuXG5cdFx0QHBhdHRlcm5TZXR0ZXIgPSBAY29uZmlnLnNldHRlclxuXHRcdEBwbGFjZWhvbGRlckNoYXIgPSBAY29uZmlnLnBsYWNlaG9sZGVyXG5cdFx0QHBsYWNlaG9sZGVyUmVnZXggPSBuZXcgUmVnRXhwKCdcXFxcJysoQHBsYWNlaG9sZGVyQ2hhciBvciAnXycpLCdnJylcblx0XHRAZ3VpZGUgPSBAY29uZmlnLmd1aWRlXG5cdFx0QGtlZXBDaGFyUG9zaXRpb25zID0gQGNvbmZpZy5rZWVwQ2hhclBvc2l0aW9uc1xuXHRcdEBjaGFycyA9IGV4dGVuZC5jbG9uZSBkZWZhdWx0UGF0dGVybkNoYXJzLCBAY29uZmlnLmN1c3RvbVBhdHRlcm5zXG5cblx0XHRAc2V0UGF0dGVybihAcGF0dGVybilcblxuXG5cdGdldFN0YXRlOiAocGF0dGVybiwgcmF3VmFsdWUpLT4ge1xuXHRcdHJhd1ZhbHVlLCBAZ3VpZGUsIEBwbGFjZWhvbGRlckNoYXIsIEBrZWVwQ2hhclBvc2l0aW9ucyxcblx0XHRjdXJyZW50Q2FyZXRQb3NpdGlvbjogaWYgQGZpZWxkLmVsIHRoZW4gQGZpZWxkLnNlbGVjdGlvbigpLmVuZCBlbHNlIEBjdXJzb3Jcblx0XHRwcmV2aW91c0NvbmZvcm1lZFZhbHVlOiBAcHJldlZhbHVlXG5cdFx0cGxhY2Vob2xkZXI6IEBnZXRQbGFjZWhvbGRlcihwYXR0ZXJuKVxuXHR9XG5cblx0Z2V0UGxhY2Vob2xkZXI6IChwYXR0ZXJuKS0+XG5cdFx0aWYgSVMuZnVuY3Rpb24ocGF0dGVybilcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdHBsYWNlaG9sZGVyID0gJydcblx0XHRcdGZvciBjaGFyIGluIHBhdHRlcm5cblx0XHRcdFx0aWYgSVMucmVnZXgoY2hhcilcblx0XHRcdFx0XHRwbGFjZWhvbGRlciArPSBAcGxhY2Vob2xkZXJDaGFyXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRwbGFjZWhvbGRlciArPSBjaGFyXG5cblx0XHRcdHJldHVybiBwbGFjZWhvbGRlclxuXG5cblx0cmVzb2x2ZVBhdHRlcm46IChwYXR0ZXJuLCBpbnB1dCwgc3RhdGUpLT5cblx0XHRwYXR0ZXJuID0gXG5cdFx0XHRpZiB0eXBlb2YgcGF0dGVybiBpcyAnZnVuY3Rpb24nXG5cdFx0XHRcdHBhdHRlcm4oaW5wdXQsIEBnZXRTdGF0ZShwYXR0ZXJuLCBpbnB1dCkpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBhdHRlcm5cblxuXHRcdG9mZnNldCA9IDBcblx0XHR0cmFwSW5kZXhlcyA9IFtdXG5cdFx0Y29weSA9IHBhdHRlcm4uc2xpY2UoKVxuXHRcdGZvciBjaGFyLGkgaW4gY29weSB3aGVuIGNoYXIgaXMgJ1tdJ1xuXHRcdFx0dHJhcEluZGV4ZXMucHVzaChpLW9mZnNldClcblx0XHRcdHBhdHRlcm4uc3BsaWNlKGktb2Zmc2V0LDEpXG5cdFx0XHRvZmZzZXQrK1xuXG5cdFx0QHByZXZQYXR0ZXJuID0gQHJlc29sdmVkUGF0dGVyblxuXHRcdEByZXNvbHZlZFBhdHRlcm4gPSBwYXR0ZXJuXG5cdFx0cmV0dXJuIHtwYXR0ZXJuLCBjYXJldFRyYXBJbmRleGVzOnRyYXBJbmRleGVzfVxuXG5cblx0c2V0UGF0dGVybjogKHN0cmluZywgdXBkYXRlVmFsdWU9dHJ1ZSwgdXBkYXRlRmllbGQpLT5cblx0XHRAcGF0dGVyblJhdyA9IHN0cmluZ1xuXHRcdEBwYXR0ZXJuID0gQHBhcnNlUGF0dGVybihzdHJpbmcpXG5cdFx0QHRyYW5zZm9ybSA9IEBwYXJzZVRyYW5zZm9ybShzdHJpbmcpXG5cblx0XHRpZiB1cGRhdGVWYWx1ZVxuXHRcdFx0QHZhbHVlID0gQHNldFZhbHVlKEB2YWx1ZSlcblx0XHRcdEBmaWVsZC52YWx1ZSA9IEB2YWx1ZSBpZiB1cGRhdGVGaWVsZFxuXG5cblx0cGFyc2VQYXR0ZXJuOiAoc3RyaW5nKS0+IHN3aXRjaFxuXHRcdHdoZW4gc3RyaW5nIGlzICdFTUFJTCdcblx0XHRcdG1hc2tBZGRvbnMuZW1haWxNYXNrLm1hc2tcblxuXHRcdHdoZW4gc3RyaW5nIGlzICdQSE9ORSdcblx0XHRcdEBwYXR0ZXJuU2V0dGVyID0gKHZhbHVlKS0+IGhlbHBlcnMucmVwZWF0KCcjJywgTWF0aC5tYXggNyx2YWx1ZS5sZW5ndGgpXG5cdFx0XHRAZ3VpZGUgPSBmYWxzZVxuXHRcdFx0cmV0dXJuICcjJ1xuXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ05BTUUnXG5cdFx0XHRAcGF0dGVyblNldHRlciA9ICh2YWx1ZSktPlxuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoQHBsYWNlaG9sZGVyUmVnZXgsICcnKS50cmltKClcblx0XHRcdFx0aGVscGVycy5yZXBlYXQoJ2EnLCBNYXRoLm1heCAyLHZhbHVlLmxlbmd0aClcblxuXHRcdFx0cmV0dXJuICdhJ1xuXG5cdFx0d2hlbiBzdHJpbmcgaXMgJ0ZVTExOQU1FJ1xuXHRcdFx0QHBhdHRlcm5TZXR0ZXIgPSAodmFsdWUpLT5cblx0XHRcdFx0aWYgdmFsdWVbdmFsdWUubGVuZ3RoLTFdIGlzICcgJyB0aGVuIHZhbHVlICs9ICd4J1xuXHRcdFx0XHRzcGxpdCA9IHZhbHVlLnJlcGxhY2UoQHBsYWNlaG9sZGVyUmVnZXgsJycpLnRyaW0oKS5zcGxpdCgvXFxzKy8pXG5cdFx0XHRcdHJldHVybiBpZiBzcGxpdC5sZW5ndGggaXMgNFxuXHRcdFx0XHRzcGxpdC5tYXAoKHBhcnQpLT4gaGVscGVycy5yZXBlYXQoJ2EnLCBNYXRoLm1heCAyLHBhcnQubGVuZ3RoKSkuam9pbignICcpXG5cdFx0XHRyZXR1cm4gJ2EnXG5cblx0XHR3aGVuIHN0cmluZyBpcyAnREFURSdcblx0XHRcdFsvXFxkLywgL1xcZC8sICcvJywgL1xcZC8sIC9cXGQvLCAnLycsIC9cXGQvLCAvXFxkLywgL1xcZC8sIC9cXGQvXVxuXHRcdFxuXHRcdHdoZW4gc3RyaW5nWzBdIGlzICdEQVRFJyBhbmQgSVMuc3RyaW5nKHN0cmluZ1sxXSlcblx0XHRcdHN0cmluZ1sxXS5zcGxpdCgnJykubWFwKChjaGFyKT0+IGlmIFJFR0VYLmxldHRlci50ZXN0KGNoYXIpIHRoZW4gL1xcZC8gZWxzZSBjaGFyKVxuXHRcdFxuXHRcdHdoZW4gc3RyaW5nIGlzICdOVU1CRVInXG5cdFx0XHRtYXNrQWRkb25zLmNyZWF0ZU51bWJlck1hc2tcblx0XHRcdFx0cHJlZml4OiBAY29uZmlnLnByZWZpeCBvciAnJ1xuXHRcdFx0XHRzdWZmaXg6IEBjb25maWcuc3VmZml4IG9yICcnXG5cdFx0XHRcdGluY2x1ZGVUaG91c2FuZHNTZXBhcmF0b3I6IGlmIEBjb25maWcuc2VwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cdFx0XHRcdHRob3VzYW5kc1NlcGFyYXRvclN5bWJvbDogaWYgSVMuc3RyaW5nKEBjb25maWcuc2VwKSB0aGVuIEBjb25maWcuc2VwXG5cdFx0XHRcdGFsbG93RGVjaW1hbDogQGNvbmZpZy5kZWNpbWFsXG5cdFx0XHRcdGRlY2ltYWxMaW1pdDogaWYgSVMubnVtYmVyKEBjb25maWcuZGVjaW1hbCkgdGhlbiBAY29uZmlnLmRlY2ltYWxcblx0XHRcdFx0aW50ZWdlckxpbWl0OiBpZiBJUy5udW1iZXIoQGNvbmZpZy5saW1pdCkgdGhlbiBAY29uZmlnLmxpbWl0XG5cblx0XHR3aGVuIElTLmFycmF5KHN0cmluZylcblx0XHRcdHJldHVybiBzdHJpbmdcblxuXHRcdGVsc2Vcblx0XHRcdHBhdHRlcm4gPSBbXVxuXG5cdFx0XHRmb3IgY2hhcixpIGluIHN0cmluZ1xuXHRcdFx0XHRpZiBjaGFyIGlzICdcXFxcJ1xuXHRcdFx0XHRcdGVzY2FwZWQgPSB0cnVlXG5cdFx0XHRcdFx0Y29udGludWVcblx0XHRcdFx0XG5cdFx0XHRcdHBhdHRlcm4ucHVzaCBpZiBlc2NhcGVkIHRoZW4gY2hhciBlbHNlIChAY2hhcnNbY2hhcl0gb3IgY2hhcilcblx0XHRcdFx0ZXNjYXBlZCA9IGZhbHNlXG5cblx0XHRcdHJldHVybiBwYXR0ZXJuXG5cblxuXHRwYXJzZVRyYW5zZm9ybTogKHN0cmluZyktPiBzd2l0Y2hcblx0XHR3aGVuIHN0cmluZyBpcyAnRU1BSUwnXG5cdFx0XHRtYXNrQWRkb25zLmVtYWlsTWFzay5waXBlXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmcgaXMgJ0RBVEUnXG5cdFx0XHRtYXNrQWRkb25zLmNyZWF0ZUF1dG9Db3JyZWN0ZWREYXRlUGlwZSgnbW0vZGQveXl5eScpXG5cdFx0XG5cdFx0d2hlbiBzdHJpbmdbMF0gaXMgJ0RBVEUnIGFuZCBJUy5zdHJpbmcoc3RyaW5nWzFdKVxuXHRcdFx0bWFza0FkZG9ucy5jcmVhdGVBdXRvQ29ycmVjdGVkRGF0ZVBpcGUoc3RyaW5nWzFdKVxuXG5cdFx0d2hlbiBAY29uZmlnLnRyYW5zZm9ybVxuXHRcdFx0QGNvbmZpZy50cmFuc2Zvcm1cblxuXG5cblx0c2V0VmFsdWU6IChpbnB1dCktPlxuXHRcdGlmIEBwYXR0ZXJuU2V0dGVyXG5cdFx0XHRuZXdQYXR0ZXJuID0gQHBhdHRlcm5TZXR0ZXIoaW5wdXQpIG9yIEBwYXR0ZXJuXG5cdFx0XHRAc2V0UGF0dGVybihuZXdQYXR0ZXJuLCBmYWxzZSkgaWYgbmV3UGF0dGVybiBpc250IEBwYXR0ZXJuUmF3IGFuZCBuZXdQYXR0ZXJuIGlzbnQgQHBhdHRlcm5cblx0XHRcblx0XHR7Y2FyZXRUcmFwSW5kZXhlcywgcGF0dGVybn0gPSBAcmVzb2x2ZVBhdHRlcm4oQHBhdHRlcm4sIGlucHV0KVxuXHRcdHJldHVybiBAdmFsdWUgaWYgcGF0dGVybiBpcyBmYWxzZVxuXG5cdFx0QHByZXZWYWx1ZSA9IEB2YWx1ZVxuXHRcdEBwcmV2Q3Vyc29yID0gQGN1cnNvclxuXHRcdHN0YXRlID0gQGdldFN0YXRlKHBhdHRlcm4sIGlucHV0KVxuXHRcdHtjb25mb3JtZWRWYWx1ZX0gPSBtYXNrQ29yZS5jb25mb3JtVG9NYXNrKGlucHV0LCBwYXR0ZXJuLCBzdGF0ZSlcblxuXHRcdHRyYW5zZm9ybWVkID0gQHRyYW5zZm9ybShjb25mb3JtZWRWYWx1ZSwgc3RhdGUpIGlmIEB0cmFuc2Zvcm1cblx0XHRpZiB0cmFuc2Zvcm1lZCBpcyBmYWxzZVxuXHRcdFx0cmV0dXJuIEB2YWx1ZVxuXHRcdGlmIElTLnN0cmluZyh0cmFuc2Zvcm1lZClcblx0XHRcdGNvbmZvcm1lZFZhbHVlID0gdHJhbnNmb3JtZWRcblx0XHRlbHNlIGlmIElTLm9iamVjdCh0cmFuc2Zvcm1lZClcblx0XHRcdGluZGV4ZXNPZlBpcGVkQ2hhcnMgPSB0cmFuc2Zvcm1lZC5pbmRleGVzT2ZQaXBlZENoYXJzXG5cdFx0XHRjb25mb3JtZWRWYWx1ZSA9IHRyYW5zZm9ybWVkLnZhbHVlXG5cblxuXHRcdEBjdXJzb3IgPSBtYXNrQ29yZS5hZGp1c3RDYXJldFBvc2l0aW9uIGV4dGVuZCBzdGF0ZSwge1xuXHRcdFx0aW5kZXhlc09mUGlwZWRDaGFycywgY2FyZXRUcmFwSW5kZXhlcywgY29uZm9ybWVkVmFsdWVcblx0XHR9XG5cblx0XHRyZXR1cm4gQHZhbHVlID0gY29uZm9ybWVkVmFsdWVcblxuXG5cdHZhbGlkYXRlOiAoaW5wdXQpLT5cblx0XHRpZiBpbnB1dCBpc250IEB2YWx1ZSBhbmQgQHBhdHRlcm5TZXR0ZXJcblx0XHRcdHBhdHRlcm4gPSBAcGF0dGVyblNldHRlcihpbnB1dCkgb3IgQHBhdHRlcm5cblx0XHRlbHNlXG5cdFx0XHRwYXR0ZXJuID0gQHJlc29sdmVkUGF0dGVyblxuXHRcdFx0e3BhdHRlcm59ID0gQHJlc29sdmVQYXR0ZXJuKEBwYXR0ZXJuLCBpbnB1dCkgaWYgbm90IHBhdHRlcm5cblxuXHRcdHJldHVybiB0cnVlIGlmIHBhdHRlcm4gaXMgZmFsc2Vcblx0XHRcblx0XHRmb3IgY2hhcixpIGluIHBhdHRlcm5cblx0XHRcdHN3aXRjaFxuXHRcdFx0XHR3aGVuIG5vdCBpbnB1dFtpXVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdFx0XHR3aGVuIElTLnJlZ2V4KGNoYXIpIGFuZCBub3QgY2hhci50ZXN0KGlucHV0W2ldKVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdFx0XHR3aGVuIElTLnN0cmluZyhjaGFyKSBhbmQgaW5wdXRbaV0gaXNudCBjaGFyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRyZXR1cm4gdHJ1ZVxuXG5cdGlzRW1wdHk6ICgpLT5cblx0XHRpbnB1dCA9IEB2YWx1ZVxuXHRcdHBhdHRlcm4gPSBAcmVzb2x2ZWRQYXR0ZXJuXG5cdFx0aWYgbm90IHBhdHRlcm5cblx0XHRcdHBhdHRlcm4gPSBAcGF0dGVyblNldHRlcihpbnB1dCkgaWYgQHBhdHRlcm5TZXR0ZXJcblx0XHRcdHtwYXR0ZXJufSA9IEByZXNvbHZlUGF0dGVybihwYXR0ZXJuIG9yIEBwYXR0ZXJuLCBpbnB1dClcblx0XHRcblx0XHRyZXR1cm4gdHJ1ZSBpZiBpbnB1dCBpcyBAY29uZmlnLnByZWZpeCBvciBpbnB1dCBpcyBAY29uZmlnLnN1ZmZpeFxuXG5cdFx0Zm9yIGNoYXIsaSBpbiBwYXR0ZXJuXG5cdFx0XHRzd2l0Y2hcblx0XHRcdFx0d2hlbiBub3QgaW5wdXRbaV1cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0XHR3aGVuIElTLnJlZ2V4KGNoYXIpXG5cdFx0XHRcdFx0cmV0dXJuICFjaGFyLnRlc3QoaW5wdXRbaV0pXG5cdFx0cmV0dXJuIGZhbHNlXG5cblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFzayIsIm1vZHVsZS5leHBvcnRzID0ga2V5Q29kZXMgPVxuXHRkZWxldGU6IDhcblx0ZW50ZXI6IDEzXG5cdGVzYzogMjdcblx0Y3RybDogMTdcblx0YWx0OiAxOFxuXHRzaGlmdDogMTZcblx0c3VwZXI6IDkxXG5cdHN1cGVyMjogOTNcblx0dXA6IDM4XG5cdGxlZnQ6IDM3XG5cdHJpZ2h0OiAzOVxuXHRkb3duOiA0MFxuXHRoeXBoZW46IDQ1XG5cdHVuZGVyc2NvcmU6IDk1XG5cdHF1ZXN0aW9uOiA2M1xuXHRleGNsYW1hdGlvbjogMzNcblx0ZnJvbnRzbGFzaDogNDdcblx0YmFja3NsYXNoOiA5MlxuXHRjb21tYTogNDRcblx0cGVyaW9kOiA0NlxuXHRzcGFjZTogMzJcblxuXHRhbnlBcnJvdzogKGNvZGUpLT5cblx0XHRjb2RlIGlzIGtleUNvZGVzLnVwIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5kb3duIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5sZWZ0IG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5yaWdodFxuXHRcblx0YW55TW9kaWZpZXI6IChjb2RlKS0+XG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5jdHJsIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5hbHQgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLnNoaWZ0IG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5zdXBlciBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMuc3VwZXIyXG5cdFxuXHRhbnlBbHBoYTogKGNvZGUpLT5cblx0XHQ5NyA8PSBjb2RlIDw9IDEyMiBvclxuXHRcdDY1IDw9IGNvZGUgPD0gOTBcblxuXHRhbnlOdW1lcmljOiAoY29kZSktPlxuXHRcdDQ4IDw9IGNvZGUgPD0gNTdcblxuXG5cdGFueUFscGhhTnVtZXJpYzogKGNvZGUpLT5cblx0XHRrZXlDb2Rlcy5hbnlBbHBoYShjb2RlKSBvclxuXHRcdGtleUNvZGVzLmFueU51bWVyaWMoY29kZSlcblxuXHRhbnlQcmludGFibGU6IChjb2RlKS0+XG5cdFx0a2V5Q29kZXMuYW55QWxwaGEoY29kZSkgb3Jcblx0XHRrZXlDb2Rlcy5hbnlOdW1lcmljKGNvZGUpIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5oeXBoZW4gb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLnVuZGVyc2NvcmUgb3Jcblx0XHRjb2RlIGlzIGtleUNvZGVzLnF1ZXN0aW9uIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5leGNsYW1hdGlvbiBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMuZnJvbnRzbGFzaCBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMuYmFja3NsYXNoIG9yXG5cdFx0Y29kZSBpcyBrZXlDb2Rlcy5jb21tYSBvclxuXHRcdGNvZGUgaXMga2V5Q29kZXMucGVyaW9kIG9yIFxuXHRcdGNvZGUgaXMga2V5Q29kZXMuc3BhY2VcblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5oZWxwZXJzID0gaW1wb3J0ICcuLi8uLi9oZWxwZXJzJ1xuQ09MT1JTID0gaW1wb3J0ICcuLi8uLi9jb25zdGFudHMvY29sb3JzJ1xuQ0hFQ0tNQVJLX1dJRFRIID0gMjZcblxuZXhwb3J0IGRlZmF1bHQgRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdmaWVsZCdcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHR2ZXJ0aWNhbEFsaWduOiAndG9wJ1xuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0Zm9udEZhbWlseTogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmZvbnRGYW1pbHlcblx0XHRcdHRleHRBbGlnbjogJ2xlZnQnXG5cdFx0XHQkdmlzaWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaydcblx0XHRcdCRzaG93RXJyb3I6XG5cdFx0XHRcdGFuaW1hdGlvbjogJzAuMnMgZmllbGRFcnJvclNoYWtlJ1xuXG5cdFx0WydkaXYnXG5cdFx0XHRyZWY6ICdsYWJlbCdcblx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHR6SW5kZXg6IDFcblx0XHRcdFx0dG9wOiAoZmllbGQpLT4gQHN0eWxlUGFyc2VkKCdmb250U2l6ZScsIHRydWUpICogMC43XG5cdFx0XHRcdGxlZnQ6IChmaWVsZCktPiBoZWxwZXJzLnNob3J0aGFuZFNpZGVWYWx1ZShmaWVsZC5zZXR0aW5ncy5wYWRkaW5nLCAnbGVmdCcpICsgKGZpZWxkLmVsLmNoaWxkLmljb24/LndpZHRoIG9yIDApXG5cdFx0XHRcdHBhZGRpbmc6IChmaWVsZCktPiBcIjAgI3tmaWVsZC5zZXR0aW5ncy5pbnB1dFBhZGRpbmd9cHhcIlxuXHRcdFx0XHRmb250RmFtaWx5OiAnaW5oZXJpdCdcblx0XHRcdFx0Zm9udFNpemU6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5sYWJlbFNpemUgb3IgZmllbGQuc2V0dGluZ3MuZm9udFNpemUgKiAoMTEvMTQpXG5cdFx0XHRcdGZvbnRXZWlnaHQ6IDYwMFxuXHRcdFx0XHRsaW5lSGVpZ2h0OiAxXG5cdFx0XHRcdGNvbG9yOiBDT0xPUlMuZ3JleVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHRyYW5zaXRpb246ICdvcGFjaXR5IDAuMnMsIGNvbG9yIDAuMnMnXG5cdFx0XHRcdHdoaXRlU3BhY2U6ICdub3dyYXAnXG5cdFx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXHRcdFx0XHRjdXJzb3I6ICdkZWZhdWx0J1xuXHRcdFx0XHRwb2ludGVyRXZlbnRzOiAnbm9uZSdcblx0XHRcdFx0JGZpbGxlZDogJHNob3dMYWJlbDpcblx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdCRmb2N1czpcblx0XHRcdFx0XHRjb2xvcjogQ09MT1JTLm9yYW5nZVxuXHRcdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRcdGNvbG9yOiBDT0xPUlMucmVkXG5cdFx0XVxuXG5cdFx0WydkaXYnXG5cdFx0XHRyZWY6ICdpbm5lcndyYXAnXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdFx0aGVpZ2h0OiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuaGVpZ2h0XG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJ3doaXRlJ1xuXHRcdFx0XHRib3JkZXJXaWR0aDogKGZpZWxkKS0+IGZpZWxkLnNldHRpbmdzLmJvcmRlclxuXHRcdFx0XHRib3JkZXJTdHlsZTogJ3NvbGlkJ1xuXHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLmdyZXlfbGlnaHRcblx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnMnB4J1xuXHRcdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0XHRmb250RmFtaWx5OiAnaW5oZXJpdCdcblx0XHRcdFx0dHJhbnNpdGlvbjogJ2JvcmRlci1jb2xvciAwLjJzJ1xuXHRcdFx0XHQkZm9jdXM6XG5cdFx0XHRcdFx0Ym9yZGVyQ29sb3I6IENPTE9SUy5vcmFuZ2Vcblx0XHRcdFx0JHNob3dFcnJvcjpcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLnJlZFxuXHRcdFx0XHQkZGlzYWJsZWQ6XG5cdFx0XHRcdFx0Ym9yZGVyQ29sb3I6IENPTE9SUy5ncmV5X2xpZ2h0XG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBDT0xPUlMuZ3JleV9saWdodFxuXG5cdFx0XHRbJ2lucHV0J1xuXHRcdFx0XHRyZWY6ICdpbnB1dCdcblx0XHRcdFx0dHlwZTogJ3RleHQnXG5cdFx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdFx0XHR6SW5kZXg6IDNcblx0XHRcdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuXHRcdFx0XHRcdHZlcnRpY2FsQWxpZ246ICd0b3AnXG5cdFx0XHRcdFx0aGVpZ2h0OiAoKS0+IEBwYXJlbnQuc3R5bGVTYWZlKCdoZWlnaHQnLDEpIG9yIEBwYXJlbnQuc3R5bGVTYWZlKCdoZWlnaHQnKVxuXHRcdFx0XHRcdHdpZHRoOiAoZmllbGQpLT4gaWYgbm90IGZpZWxkLnNldHRpbmdzLmF1dG9XaWR0aFxuXHRcdFx0XHRcdFx0c3VidHJhY3QgPSAwXG5cdFx0XHRcdFx0XHRpZiBpY29uU2libGluZyA9IGZpZWxkLmVsLmNoaWxkLmljb25cblx0XHRcdFx0XHRcdFx0c3VidHJhY3QgKz0gaWNvblNpYmxpbmcud2lkdGhcblx0XHRcdFx0XHRcdGlmIGlucHV0U2libGluZyA9IGZpZWxkLmVsLmNoaWxkW2ZpZWxkLnNldHRpbmdzLmlucHV0U2libGluZ11cblx0XHRcdFx0XHRcdFx0d2lkdGggPSBpbnB1dFNpYmxpbmcuc3R5bGVQYXJzZWQoJ3dpZHRoJywxKSBvciAwXG5cdFx0XHRcdFx0XHRcdHBhZGRpbmcgPSBpbnB1dFNpYmxpbmcuc3R5bGVQYXJzZWQoJ3BhZGRpbmcnLDEpIG9yIDBcblx0XHRcdFx0XHRcdFx0cGFkZGluZ0xlZnQgPSBpbnB1dFNpYmxpbmcuc3R5bGVQYXJzZWQoJ3BhZGRpbmdMZWZ0JywxKSBvciBwYWRkaW5nIG9yIDBcblx0XHRcdFx0XHRcdFx0cGFkZGluZ1JpZ2h0ID0gaW5wdXRTaWJsaW5nLnN0eWxlUGFyc2VkKCdwYWRkaW5nUmlnaHQnLDEpIG9yIHBhZGRpbmcgb3IgMFxuXHRcdFx0XHRcdFx0XHRzdWJ0cmFjdCArPSB3aWR0aCtwYWRkaW5nTGVmdCtwYWRkaW5nUmlnaHRcblx0XHRcdFx0XHRcdHJldHVybiBcImNhbGMoMTAwJSAtICN7c3VidHJhY3R9cHgpXCJcblxuXHRcdFx0XHRcdHBhZGRpbmc6IChmaWVsZCktPlxuXHRcdFx0XHRcdFx0QHBhZGRpbmcgPz0gTWF0aC5tYXggMCwgaGVscGVycy5jYWxjUGFkZGluZyhmaWVsZC5zZXR0aW5ncy5oZWlnaHQsIDE0KS0zXG5cdFx0XHRcdFx0XHRyZXR1cm4gXCIje0BwYWRkaW5nfXB4ICN7ZmllbGQuc2V0dGluZ3MuaW5wdXRQYWRkaW5nfXB4XCJcblx0XHRcdFx0XG5cdFx0XHRcdFx0bWFyZ2luOiAnMCdcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcblx0XHRcdFx0XHRhcHBlYXJhbmNlOiAnbm9uZSdcblx0XHRcdFx0XHRib3JkZXI6ICdub25lJ1xuXHRcdFx0XHRcdG91dGxpbmU6ICdub25lJ1xuXHRcdFx0XHRcdGZvbnRGYW1pbHk6ICdpbmhlcml0J1xuXHRcdFx0XHRcdGZvbnRTaXplOiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuZm9udFNpemVcblx0XHRcdFx0XHRjb2xvcjogQ09MT1JTLmJsYWNrXG5cdFx0XHRcdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCdcblx0XHRcdFx0XHRib3hTaGFkb3c6ICdub25lJ1xuXHRcdFx0XHRcdHdoaXRlU3BhY2U6ICdub3dyYXAnXG5cdFx0XHRcdFx0YmFja2dyb3VuZENsaXA6ICdjb250ZW50LWJveCcgIyBzZW1pLWZpeCBmb3IgeWVsbG93IGF1dG9maWxsIGJhY2tncm91bmRcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ1xuXHRcdFx0XHRcdHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMC4ycywgLXdlYmtpdC10cmFuc2Zvcm0gMC4ycydcblx0XHRcdFx0XHQkZGlzYWJsZWQ6XG5cdFx0XHRcdFx0XHRjdXJzb3I6ICdub3QtYWxsb3dlZCdcblx0XHRcdFx0XHQkZmlsbGVkOiAkc2hvd0xhYmVsOlxuXHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAoZmllbGQpLT5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIEB0cmFuc2xhdGlvbiBpZiBAdHJhbnNsYXRpb24/IG9yIG5vdCAobGFiZWw9ZmllbGQuZWwuY2hpbGQubGFiZWwpIG9yIGxhYmVsLnN0eWxlU2FmZSgncG9zaXRpb24nLDEpIGlzbnQgJ2Fic29sdXRlJ1xuXHRcdFx0XHRcdFx0XHR0b3RhbEhlaWdodCA9IEBwYXJlbnQuc3R5bGVQYXJzZWQoJ2hlaWdodCcsMSlcblx0XHRcdFx0XHRcdFx0d29ya2FibGVIZWlnaHQgPSB0b3RhbEhlaWdodCAtIChsYWJlbC5zdHlsZVBhcnNlZCgnZm9udFNpemUnLDEpICsgbGFiZWwuc3R5bGVQYXJzZWQoJ3RvcCcsMSkqMilcblx0XHRcdFx0XHRcdFx0dHJhbnNsYXRpb24gPSBNYXRoLm1heCAwLCBNYXRoLmZsb29yICh0b3RhbEhlaWdodC13b3JrYWJsZUhlaWdodCkvNFxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJ0cmFuc2xhdGVZKCN7dHJhbnNsYXRpb259cHgpXCJcblx0XHRcdFx0XHRcblx0XHRcdF1cblxuXHRcdFx0WydkaXYnXG5cdFx0XHRcdHJlZjogJ3BsYWNlaG9sZGVyJ1xuXHRcdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0ekluZGV4OiAyXG5cdFx0XHRcdFx0dG9wOiAnMHB4J1xuXHRcdFx0XHRcdGxlZnQ6IChmaWVsZCktPiBmaWVsZC5lbC5jaGlsZC5pY29uPy53aWR0aCBvciAwXG5cdFx0XHRcdFx0Zm9udEZhbWlseTogKGZpZWxkKS0+IGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlU2FmZSgnZm9udEZhbWlseScsMSlcblx0XHRcdFx0XHRmb250U2l6ZTogKGZpZWxkKS0+IGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlU2FmZSgnZm9udFNpemUnLDEpXG5cdFx0XHRcdFx0cGFkZGluZzogKGZpZWxkKS0+XG5cdFx0XHRcdFx0XHR2ZXJ0aSA9IGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlUGFyc2VkKCdwYWRkaW5nVG9wJywxKSBvciBmaWVsZC5lbC5jaGlsZC5pbnB1dC5zdHlsZVBhcnNlZCgncGFkZGluZ1RvcCcpXG5cdFx0XHRcdFx0XHRob3JpeiA9IGZpZWxkLmVsLmNoaWxkLmlucHV0LnN0eWxlUGFyc2VkKCdwYWRkaW5nTGVmdCcsMSkgb3IgZmllbGQuZWwuY2hpbGQuaW5wdXQuc3R5bGVQYXJzZWQoJ3BhZGRpbmdMZWZ0Jylcblx0XHRcdFx0XHRcdHJldHVybiBcIiN7dmVydGkrM31weCAje2hvcml6fXB4XCJcblxuXHRcdFx0XHRcdGNvbG9yOiBDT0xPUlMuYmxhY2tcblx0XHRcdFx0XHRvcGFjaXR5OiAwLjVcblx0XHRcdFx0XHRwb2ludGVyRXZlbnRzOiAnbm9uZSdcblx0XHRcdFx0XHR1c2VyU2VsZWN0OiAnbm9uZSdcblx0XHRcdFx0XHR3aGl0ZVNwYWNlOiAnbm93cmFwJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknXG5cdFx0XHRcdFx0dHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAwLjJzLCAtd2Via2l0LXRyYW5zZm9ybSAwLjJzJ1xuXHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHR2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuXHRcdFx0XHRcdFx0JHNob3dMYWJlbDpcblx0XHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAoZmllbGQpLT4gZmllbGQuZWwuY2hpbGQuaW5wdXQucmF3LnN0eWxlLnRyYW5zZm9ybVxuXHRcdFx0XVxuXHRcdF1cblx0XHRcblx0XHRbJ2Rpdidcblx0XHRcdHJlZjogJ2hlbHAnXG5cdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0dG9wOiAnMTEwJSdcblx0XHRcdFx0bGVmdDogKGZpZWxkKS0+IGhlbHBlcnMuc2hvcnRoYW5kU2lkZVZhbHVlKGZpZWxkLnNldHRpbmdzLnBhZGRpbmcsICdsZWZ0Jylcblx0XHRcdFx0Zm9udEZhbWlseTogJ2luaGVyaXQnXG5cdFx0XHRcdGZvbnRTaXplOiAnMTFweCdcblx0XHRcdFx0Y29sb3I6IENPTE9SUy5ncmV5XG5cdFx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0XHQkc2hvd0Vycm9yOlxuXHRcdFx0XHRcdGNvbG9yOiBDT0xPUlMucmVkXG5cdFx0XHRcdCRzaG93SGVscDpcblx0XHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdFx0XVxuXHRdXG4pXG5cbmV4cG9ydCBpY29uID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdpY29uJ1xuXHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHR6SW5kZXg6IDJcblx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0d2lkdGg6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pY29uU2l6ZVxuXHRcdFx0aGVpZ2h0OiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuaWNvblNpemVcblx0XHRcdGZvbnRTaXplOiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuaWNvblNpemVcblx0XHRcdHBhZGRpbmdMZWZ0OiAoZmllbGQpLT4gZmllbGQuc2V0dGluZ3MuaW5wdXRQYWRkaW5nXG5cdFx0XHRwYWRkaW5nVG9wOiAoZmllbGQpLT4gQHBhcmVudC5zdHlsZVBhcnNlZCgnaGVpZ2h0JywxKS8yIC0gZmllbGQuc2V0dGluZ3MuaWNvblNpemUvMlxuXHRcdFx0bGluZUhlaWdodDogJzFlbSdcblx0XHRcdHVzZXJTZWxlY3Q6ICdub25lJ1xuXG5cdFx0bWV0aG9kczpcblx0XHRcdHdpZHRoOiBnZXQ6ICgpLT5cblx0XHRcdFx0aWYgQF9pbnNlcnRlZFxuXHRcdFx0XHRcdEByYXcub2Zmc2V0V2lkdGhcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBzdHlsZVBhcnNlZCgnd2lkdGgnLDEpIG9yIEByZWxhdGVkLnNldHRpbmdzLmljb25TaXplXG5cdFx0XHRcdCMgQHN0eWxlUGFyc2VkKCd3aWR0aCcsMSkgb3IgQHJhdy5vZmZzZXRXaWR0aCBvciBAcmVsYXRlZC5zZXR0aW5ncy5pY29uU2l6ZSBvciAwXG5cdF1cbilcblxuXG5leHBvcnQgY2hlY2ttYXJrID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdjaGVja21hcmsnXG5cdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdHpJbmRleDogNFxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHR3aWR0aDogMjZcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRwYWRkaW5nVG9wOiAoKS0+IEBwYXJlbnQuc3R5bGVQYXJzZWQoJ2hlaWdodCcsMSkvMiAtIDEzXG5cdFx0XHRwYWRkaW5nUmlnaHQ6IChmaWVsZCktPiBmaWVsZC5zZXR0aW5ncy5pbnB1dFBhZGRpbmdcblx0XHRcdHZlcnRpY2FsQWxpZ246ICd0b3AnXG5cdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuXG5cdFx0WydkaXYnXG5cdFx0XHRyZWY6ICdjaGVja21hcmtfaW5uZXJ3cmFwJ1xuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHdpZHRoOiAnMjBweCdcblx0XHRcdFx0aGVpZ2h0OiAnMjBweCdcblx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnNTAlJ1xuXHRcdFx0XHRib3JkZXJXaWR0aDogJzNweCdcblx0XHRcdFx0Ym9yZGVyU3R5bGU6ICdzb2xpZCdcblx0XHRcdFx0Ym9yZGVyQ29sb3I6IENPTE9SUy5ncmVlblxuXHRcdFx0XHR0cmFuc2Zvcm06ICdzY2FsZSgwLjgpJ1xuXHRcdFx0XHQjIHRyYW5zZm9ybU9yaWdpbjogJzEwMCUgMCdcblx0XHRcdFx0JHNob3dFcnJvcjpcblx0XHRcdFx0XHRib3JkZXJDb2xvcjogQ09MT1JTLnJlZFxuXG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX21hc2sxJ1xuXHRcdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0dG9wOiAnLTRweCdcblx0XHRcdFx0XHRsZWZ0OiAnLTEwcHgnXG5cdFx0XHRcdFx0d2lkdGg6ICcxNXB4J1xuXHRcdFx0XHRcdGhlaWdodDogJzMwcHgnXG5cdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnMzBweCAwIDAgMzBweCdcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IChmaWVsZCktPiBoZWxwZXJzLmRlZmF1bHRDb2xvciBmaWVsZC5lbHMuaW5uZXJ3cmFwLnN0eWxlU2FmZSgnYmFja2dyb3VuZENvbG9yJywxKSwgJ3doaXRlJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuXHRcdFx0XHRcdHRyYW5zZm9ybU9yaWdpbjogJzE1cHggMTVweCAwJ1xuXHRcdFx0XVxuXHRcdFx0XG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX21hc2syJ1xuXHRcdFx0XHRzdHlsZUFmdGVySW5zZXJ0OiB0cnVlXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0dG9wOiAnLTVweCdcblx0XHRcdFx0XHRsZWZ0OiAnOHB4J1xuXHRcdFx0XHRcdHdpZHRoOiAnMTVweCdcblx0XHRcdFx0XHRoZWlnaHQ6ICczMHB4J1xuXHRcdFx0XHRcdGJvcmRlclJhZGl1czogJzAgMzBweCAzMHB4IDAnXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAoZmllbGQpLT4gaGVscGVycy5kZWZhdWx0Q29sb3IgZmllbGQuZWxzLmlubmVyd3JhcC5zdHlsZVNhZmUoJ2JhY2tncm91bmRDb2xvcicsMSksICd3aGl0ZSdcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSdcblx0XHRcdFx0XHR0cmFuc2Zvcm1PcmlnaW46ICcwIDE1cHggMCdcblx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnNC4yNXMgZWFzZS1pbiBjaGVja21hcmtSb3RhdGVQbGFjZWhvbGRlcidcblx0XHRcdFx0XHRcdCRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0XHRhbmltYXRpb246ICcnXG5cdFx0XHRdXG5cdFx0XHRcblx0XHRcdFsnZGl2J1xuXHRcdFx0XHRyZWY6ICdjaGVja21hcmtfbGluZVdyYXBwZXInXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdCRmaWxsZWQ6ICRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcblx0XHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnMC41NXMgY2hlY2ttYXJrQW5pbWF0ZUVycm9yJ1xuXHRcdFx0XHRcdFx0dHJhbnNmb3JtT3JpZ2luOiAnNTAlIDEwcHgnXG5cblx0XHRcdFx0WydkaXYnXG5cdFx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX2xpbmVTaG9ydCdcblx0XHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0XHR6SW5kZXg6IDJcblx0XHRcdFx0XHRcdHRvcDogJzEwcHgnXG5cdFx0XHRcdFx0XHRsZWZ0OiAnM3B4J1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0XHRcdFx0d2lkdGg6ICc4cHgnXG5cdFx0XHRcdFx0XHRoZWlnaHQ6ICczcHgnXG5cdFx0XHRcdFx0XHRib3JkZXJSYWRpdXM6ICcycHgnXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IENPTE9SUy5ncmVlblxuXHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKDQ1ZGVnKSdcblx0XHRcdFx0XHRcdCRmaWxsZWQ6XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJzAuNzVzIGNoZWNrbWFya0FuaW1hdGVTdWNjZXNzVGlwJ1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQkaW52YWxpZDpcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBDT0xPUlMucmVkXG5cdFx0XHRcdFx0XHRcdGxlZnQ6ICc0cHgnXG5cdFx0XHRcdFx0XHRcdHRvcDogJzhweCdcblx0XHRcdFx0XHRcdFx0d2lkdGg6ICcxMnB4J1xuXHRcdFx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJydcblx0XHRcdFx0XVxuXG5cdFx0XHRcdFsnZGl2J1xuXHRcdFx0XHRcdHJlZjogJ2NoZWNrbWFya19saW5lTG9uZydcblx0XHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdFx0XHR6SW5kZXg6IDJcblx0XHRcdFx0XHRcdHRvcDogJzhweCdcblx0XHRcdFx0XHRcdHJpZ2h0OiAnMnB4J1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0XHRcdFx0d2lkdGg6ICcxMnB4J1xuXHRcdFx0XHRcdFx0aGVpZ2h0OiAnM3B4J1xuXHRcdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnMnB4J1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBDT0xPUlMuZ3JlZW5cblx0XHRcdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuXHRcdFx0XHRcdFx0JGZpbGxlZDpcblx0XHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAnMC43NXMgY2hlY2ttYXJrQW5pbWF0ZVN1Y2Nlc3NMb25nJ1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQkaW52YWxpZDpcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBDT0xPUlMucmVkXG5cdFx0XHRcdFx0XHRcdHRvcDogJzhweCdcblx0XHRcdFx0XHRcdFx0bGVmdDogJzRweCdcblx0XHRcdFx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xuXHRcdFx0XHRcdFx0XHQkZmlsbGVkOlxuXHRcdFx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJydcblx0XHRcdFx0XVxuXHRcdFx0XVxuXHRcdFx0XG5cdFx0XHRbJ2Rpdidcblx0XHRcdFx0cmVmOiAnY2hlY2ttYXJrX3BsYWNlaG9sZGVyJ1xuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHRcdHpJbmRleDogMlxuXHRcdFx0XHRcdHRvcDogJy00cHgnXG5cdFx0XHRcdFx0bGVmdDogJy0zcHgnXG5cdFx0XHRcdFx0d2lkdGg6ICcyMHB4J1xuXHRcdFx0XHRcdGhlaWdodDogJzIwcHgnXG5cdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiAnNTAlJ1xuXHRcdFx0XHRcdGJvcmRlcldpZHRoOiAnM3B4J1xuXHRcdFx0XHRcdGJvcmRlclN0eWxlOiAnc29saWQnXG5cdFx0XHRcdFx0Ym9yZGVyQ29sb3I6IGhlbHBlcnMuaGV4VG9SR0JBKENPTE9SUy5ncmVlbiwgMC40KVxuXHRcdFx0XHRcdCRpbnZhbGlkOlxuXHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I6IGhlbHBlcnMuaGV4VG9SR0JBKENPTE9SUy5yZWQsIDAuNClcblx0XHRcdF1cblx0XHRcdFxuXHRcdFx0WydkaXYnXG5cdFx0XHRcdHJlZjogJ2NoZWNrbWFya19wYXRjaCdcblx0XHRcdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0XHRcdHpJbmRleDogMVxuXHRcdFx0XHRcdHRvcDogJy0ycHgnXG5cdFx0XHRcdFx0bGVmdDogJzZweCdcblx0XHRcdFx0XHR3aWR0aDogJzRweCdcblx0XHRcdFx0XHRoZWlnaHQ6ICcyOHB4J1xuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogKGZpZWxkKS0+IGhlbHBlcnMuZGVmYXVsdENvbG9yIGZpZWxkLmVscy5pbm5lcndyYXAuc3R5bGVTYWZlKCdiYWNrZ3JvdW5kQ29sb3InLDEpLCAnd2hpdGUnXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG5cdFx0XHRdXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID1cblx0cGxhY2Vob2xkZXI6IHRydWVcblx0dmFsaWRXaGVuSXNDaG9pY2U6IGZhbHNlXG5cdHZhbGlkV2hlblJlZ2V4OiBmYWxzZVxuXHRhdXRvV2lkdGg6IGZhbHNlXG5cdG1heFdpZHRoOiAnMTAwJSdcblx0bWluV2lkdGg6IDJcblx0aGVpZ2h0OiA0NlxuXHRjaGVja21hcms6IHRydWVcblx0a2V5Ym9hcmQ6ICd0ZXh0J1xuXHRkcm9wZG93bjoge2xvY2tTY3JvbGw6ZmFsc2V9XG5cdGNob2ljZXM6IG51bGxcblx0bWluTGVuZ3RoOiBudWxsXG5cdG1heExlbmd0aDogbnVsbFxuXHRpbnB1dFNpYmxpbmc6ICdjaGVja21hcmsnXG5cdG1hc2s6XG5cdFx0cGF0dGVybjogZmFsc2Vcblx0XHRwbGFjZWhvbGRlcjogJ18nXG5cdFx0Z3VpZGU6IHRydWVcblx0XHRjdXN0b21QYXR0ZXJuczogZmFsc2UiLCJpbXBvcnQge0lNUE9SVEFOVCwgUkVHRVhfS0VCQUIsIFJFR0VYX1NQQUNFLCBSRUdFWF9ESUdJVFMsIFJFR0VYX0xFTl9WQUwsIFBPU1NJQkxFX1BSRUZJWEVTLCBSRVFVSVJFU19VTklUX1ZBTFVFfSBmcm9tICcuL2NvbnN0YW50cydcblNBTVBMRV9TVFlMRSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLnN0eWxlXG5cbmV4cG9ydCBpbmNsdWRlcyA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0dGFyZ2V0IGFuZCB0YXJnZXQuaW5kZXhPZihpdGVtKSBpc250IC0xXG5cbmV4cG9ydCBpc0l0ZXJhYmxlID0gKHRhcmdldCktPlxuXHR0YXJnZXQgYW5kXG5cdHR5cGVvZiB0YXJnZXQgaXMgJ29iamVjdCcgYW5kXG5cdHR5cGVvZiB0YXJnZXQubGVuZ3RoIGlzICdudW1iZXInIGFuZFxuXHRub3QgdGFyZ2V0Lm5vZGVUeXBlXG5cbmV4cG9ydCB0b0tlYmFiQ2FzZSA9IChzdHJpbmcpLT5cblx0c3RyaW5nLnJlcGxhY2UgUkVHRVhfS0VCQUIsIChlLGxldHRlciktPiBcIi0je2xldHRlci50b0xvd2VyQ2FzZSgpfVwiXG5cbmV4cG9ydCBpc1Byb3BTdXBwb3J0ZWQgPSAocHJvcGVydHkpLT5cblx0dHlwZW9mIFNBTVBMRV9TVFlMRVtwcm9wZXJ0eV0gaXNudCAndW5kZWZpbmVkJ1xuXG5leHBvcnQgaXNWYWx1ZVN1cHBvcnRlZCA9IChwcm9wZXJ0eSwgdmFsdWUpLT5cblx0aWYgd2luZG93LkNTUyBhbmQgd2luZG93LkNTUy5zdXBwb3J0c1xuXHRcdHJldHVybiB3aW5kb3cuQ1NTLnN1cHBvcnRzKHByb3BlcnR5LCB2YWx1ZSlcblx0ZWxzZVxuXHRcdFNBTVBMRV9TVFlMRVtwcm9wZXJ0eV0gPSB2YWx1ZVxuXHRcdHJldHVybiBTQU1QTEVfU1RZTEVbcHJvcGVydHldIGlzICcnK3ZhbHVlXG5cbmV4cG9ydCBnZXRQcmVmaXggPSAocHJvcGVydHksIHNraXBJbml0aWFsQ2hlY2spLT5cblx0aWYgc2tpcEluaXRpYWxDaGVjayBvciBub3QgaXNQcm9wU3VwcG9ydGVkKHByb3BlcnR5KVxuXHRcdGZvciBwcmVmaXggaW4gUE9TU0lCTEVfUFJFRklYRVNcblx0XHRcdCMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblx0XHRcdHJldHVybiBcIi0je3ByZWZpeH0tXCIgaWYgaXNQcm9wU3VwcG9ydGVkKFwiLSN7cHJlZml4fS0je3Byb3BlcnR5fVwiKVxuXHRcblx0cmV0dXJuICcnXG5cbmV4cG9ydCBub3JtYWxpemVQcm9wZXJ0eSA9IChwcm9wZXJ0eSktPlx0XG5cdHByb3BlcnR5ID0gdG9LZWJhYkNhc2UocHJvcGVydHkpXG5cdFxuXHRpZiBpc1Byb3BTdXBwb3J0ZWQocHJvcGVydHkpXG5cdFx0cmV0dXJuIHByb3BlcnR5XG5cdGVsc2Vcblx0XHRyZXR1cm4gXCIje2dldFByZWZpeChwcm9wZXJ0eSx0cnVlKX0je3Byb3BlcnR5fVwiXG5cbmV4cG9ydCBub3JtYWxpemVWYWx1ZSA9IChwcm9wZXJ0eSwgdmFsdWUpLT5cblx0aWYgaW5jbHVkZXMoUkVRVUlSRVNfVU5JVF9WQUxVRSwgcHJvcGVydHkpIGFuZCB2YWx1ZSBpc250IG51bGxcblx0XHR2YWx1ZSA9ICcnK3ZhbHVlXG5cdFx0aWYgIFJFR0VYX0RJR0lUUy50ZXN0KHZhbHVlKSBhbmRcblx0XHRcdG5vdCBSRUdFWF9MRU5fVkFMLnRlc3QodmFsdWUpIGFuZFxuXHRcdFx0bm90IFJFR0VYX1NQQUNFLnRlc3QodmFsdWUpXG5cdFx0XHRcdHZhbHVlICs9IGlmIHByb3BlcnR5IGlzICdsaW5lLWhlaWdodCcgdGhlbiAnZW0nIGVsc2UgJ3B4J1xuXG5cdHJldHVybiB2YWx1ZVxuXG5cbmV4cG9ydCBzb3J0ID0gKGFycmF5KS0+XG5cdGlmIGFycmF5Lmxlbmd0aCA8IDJcblx0XHRyZXR1cm4gYXJyYXlcblx0ZWxzZVxuXHRcdHBpdm90ID0gYXJyYXlbMF07IGxlc3MgPSBbXTsgZ3JlYXQgPSBbXTsgbGVuID0gYXJyYXkubGVuZ3RoOyBpID0gMDtcblx0XHRcblx0XHR3aGlsZSArK2kgaXNudCBsZW5cblx0XHRcdGlmIGFycmF5W2ldIDw9IHBpdm90XG5cdFx0XHRcdGxlc3MucHVzaChhcnJheVtpXSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0Z3JlYXQucHVzaChhcnJheVtpXSlcblxuXHRcdHJldHVybiBzb3J0KGxlc3MpLmNvbmNhdChwaXZvdCwgc29ydChncmVhdCkpXG5cblxuZXhwb3J0IGhhc2ggPSAoc3RyaW5nKS0+XG5cdGhzaCA9IDUzODE7IGkgPSAtMTsgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuXHRcblx0d2hpbGUgKytpIGlzbnQgc3RyaW5nLmxlbmd0aFxuXHRcdGhzaCA9ICgoaHNoIDw8IDUpIC0gaHNoKSArIHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cdFx0aHNoIHw9IDBcblxuXHRyZXR1cm4gJ18nKyhpZiBoc2ggPCAwIHRoZW4gaHNoICogLTIgZWxzZSBoc2gpXG5cblxuZXhwb3J0IHJ1bGVUb1N0cmluZyA9IChydWxlLCBpbXBvcnRhbnQpLT5cblx0b3V0cHV0ID0gJydcblx0cHJvcHMgPSBzb3J0KE9iamVjdC5rZXlzKHJ1bGUpKVxuXHRcblx0Zm9yIHByb3AgaW4gcHJvcHNcblx0XHRpZiB0eXBlb2YgcnVsZVtwcm9wXSBpcyAnc3RyaW5nJyBvciB0eXBlb2YgcnVsZVtwcm9wXSBpcyAnbnVtYmVyJ1xuXHRcdFx0cHJvcGVydHkgPSBub3JtYWxpemVQcm9wZXJ0eShwcm9wKVxuXHRcdFx0dmFsdWUgPSBub3JtYWxpemVWYWx1ZShwcm9wZXJ0eSwgcnVsZVtwcm9wXSlcblx0XHRcdHZhbHVlICs9IFwiICFpbXBvcnRhbnRcIiBpZiBpbXBvcnRhbnRcblx0XHRcdG91dHB1dCArPSBcIiN7cHJvcGVydHl9OiN7dmFsdWV9O1wiXG5cdFxuXHRyZXR1cm4gb3V0cHV0XG5cbmV4cG9ydCBpbmxpbmVTdHlsZUNvbmZpZyA9IHN0eWxlQ29uZmlnID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuZXhwb3J0IGlubGluZVN0eWxlID0gKHJ1bGUsIHZhbHVlVG9TdG9yZSwgbGV2ZWwpLT5cblx0aWYgbm90IGNvbmZpZz1zdHlsZUNvbmZpZ1tsZXZlbF1cblx0XHRzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuXHRcdHN0eWxlRWwuaWQgPSBcInF1aWNrY3NzI3tsZXZlbCBvciAnJ31cIlxuXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbClcblx0XHRzdHlsZUNvbmZpZ1tsZXZlbF0gPSBjb25maWcgPSBlbDpzdHlsZUVsLCBjb250ZW50OicnLCBjYWNoZTpPYmplY3QuY3JlYXRlKG51bGwpXG5cdFxuXHR1bmxlc3MgY29uZmlnLmNhY2hlW3J1bGVdXG5cdFx0Y29uZmlnLmNhY2hlW3J1bGVdID0gdmFsdWVUb1N0b3JlIG9yIHRydWVcblx0XHRjb25maWcuZWwudGV4dENvbnRlbnQgPSBjb25maWcuY29udGVudCArPSBydWxlXG5cdFxuXHRyZXR1cm5cblxuXG5leHBvcnQgY2xlYXJJbmxpbmVTdHlsZSA9IChsZXZlbCktPiBpZiBjb25maWcgPSBzdHlsZUNvbmZpZ1tsZXZlbF1cblx0cmV0dXJuIGlmIG5vdCBjb25maWcuY29udGVudFxuXHRjb25maWcuZWwudGV4dENvbnRlbnQgPSBjb25maWcuY29udGVudCA9ICcnXG5cdGtleXMgPSBPYmplY3Qua2V5cyhjb25maWcuY2FjaGUpXG5cdGNvbmZpZy5jYWNoZVtrZXldID0gbnVsbCBmb3Iga2V5IGluIGtleXNcblx0cmV0dXJuXG5cblxuXG5cblxuIiwiZXhwb3J0IFJFR0VYX0xFTl9WQUwgPSAvXlxcZCsoPzpbYS16XXxcXCUpKyQvaVxuZXhwb3J0IFJFR0VYX0RJR0lUUyA9IC9cXGQrJC9cbmV4cG9ydCBSRUdFWF9TUEFDRSA9IC9cXHMvXG5leHBvcnQgUkVHRVhfS0VCQUIgPSAvKFtBLVpdKSsvZ1xuZXhwb3J0IElNUE9SVEFOVCA9ICdpbXBvcnRhbnQnXG5cbmV4cG9ydCBQT1NTSUJMRV9QUkVGSVhFUyA9IFtcblx0J3dlYmtpdCdcblx0J21veidcblx0J21zJ1xuXHQnbydcbl1cbmV4cG9ydCBSRVFVSVJFU19VTklUX1ZBTFVFID0gW1xuXHQnYmFja2dyb3VuZC1wb3NpdGlvbi14J1xuXHQnYmFja2dyb3VuZC1wb3NpdGlvbi15J1xuXHQnYmxvY2stc2l6ZSdcblx0J2JvcmRlci13aWR0aCdcblx0J2NvbHVtblJ1bGUtd2lkdGgnXG5cdCdjeCdcblx0J2N5J1xuXHQnZm9udC1zaXplJ1xuXHQnZ3JpZC1jb2x1bW4tZ2FwJ1xuXHQnZ3JpZC1yb3ctZ2FwJ1xuXHQnaGVpZ2h0J1xuXHQnaW5saW5lLXNpemUnXG5cdCdsaW5lLWhlaWdodCdcblx0J21pbkJsb2NrLXNpemUnXG5cdCdtaW4taGVpZ2h0J1xuXHQnbWluLWlubGluZS1zaXplJ1xuXHQnbWluLXdpZHRoJ1xuXHQnbWF4LWhlaWdodCdcblx0J21heC13aWR0aCdcblx0J291dGxpbmUtb2Zmc2V0J1xuXHQnb3V0bGluZS13aWR0aCdcblx0J3BlcnNwZWN0aXZlJ1xuXHQnc2hhcGUtbWFyZ2luJ1xuXHQnc3Ryb2tlLWRhc2hvZmZzZXQnXG5cdCdzdHJva2Utd2lkdGgnXG5cdCd0ZXh0LWluZGVudCdcblx0J3dpZHRoJ1xuXHQnd29yZC1zcGFjaW5nJ1xuXHQndG9wJ1xuXHQnYm90dG9tJ1xuXHQnbGVmdCdcblx0J3JpZ2h0J1xuXHQneCdcblx0J3knXG5dXG5cbmV4cG9ydCBRVUFEX1NIT1JUSEFORFMgPSBbXG5cdCdtYXJnaW4nXG5cdCdwYWRkaW5nJ1xuXHQnYm9yZGVyJ1xuXHQnYm9yZGVyLXJhZGl1cydcbl1cbmV4cG9ydCBESVJFQ1RJT05TID0gWyd0b3AnLCdib3R0b20nLCdsZWZ0JywncmlnaHQnXVxuXG5RVUFEX1NIT1JUSEFORFMuZm9yRWFjaCAocHJvcGVydHkpLT5cblx0UkVRVUlSRVNfVU5JVF9WQUxVRS5wdXNoIHByb3BlcnR5XG5cdGZvciBkaXJlY3Rpb24gaW4gRElSRUNUSU9OU1xuXHRcdFJFUVVJUkVTX1VOSVRfVkFMVUUucHVzaCBwcm9wZXJ0eSsnLScrZGlyZWN0aW9uXG5cdHJldHVyblxuXG5cblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9XG5cdGRlZmluZWQ6IChzdWJqZWN0KS0+IHN1YmplY3QgaXNudCB1bmRlZmluZWRcblx0XG5cdGFycmF5OiAoc3ViamVjdCktPiBzdWJqZWN0IGluc3RhbmNlb2YgQXJyYXlcblx0XG5cdG9iamVjdDogKHN1YmplY3QpLT4gdHlwZW9mIHN1YmplY3QgaXMgJ29iamVjdCcgYW5kIHN1YmplY3QgIyAybmQgY2hlY2sgaXMgdG8gdGVzdCBhZ2FpbnN0ICdudWxsJyB2YWx1ZXNcblxuXHRvYmplY3RQbGFpbjogKHN1YmplY3QpLT4gZXhwb3J0cy5vYmplY3Qoc3ViamVjdCkgYW5kIE9iamVjdDo6dG9TdHJpbmcuY2FsbChzdWJqZWN0KSBpcyAnW29iamVjdCBPYmplY3RdJyBhbmQgc3ViamVjdC5jb25zdHJ1Y3RvciBpcyBPYmplY3RcblxuXHRzdHJpbmc6IChzdWJqZWN0KS0+IHR5cGVvZiBzdWJqZWN0IGlzICdzdHJpbmcnXG5cdFxuXHRudW1iZXI6IChzdWJqZWN0KS0+IHR5cGVvZiBzdWJqZWN0IGlzICdudW1iZXInIGFuZCBub3QgaXNOYU4oc3ViamVjdClcblxuXHRudW1iZXJMb29zZTogKHN1YmplY3QpLT4gZXhwb3J0cy5udW1iZXIoc3ViamVjdCkgb3IgZXhwb3J0cy5zdHJpbmcoc3ViamVjdCkgYW5kIGV4cG9ydHMubnVtYmVyKE51bWJlciBzdWJqZWN0KVxuXHRcblx0ZnVuY3Rpb246IChzdWJqZWN0KS0+IHR5cGVvZiBzdWJqZWN0IGlzICdmdW5jdGlvbidcblxuXHRpdGVyYWJsZTogKHN1YmplY3QpLT4gZXhwb3J0cy5vYmplY3Qoc3ViamVjdCkgYW5kIGV4cG9ydHMubnVtYmVyKHN1YmplY3QubGVuZ3RoKSIsIm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IFxuXHRkb21Eb2M6IChzdWJqZWN0KS0+IHN1YmplY3QgYW5kIHN1YmplY3Qubm9kZVR5cGUgaXMgOVxuXG5cdGRvbUVsOiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0Lm5vZGVUeXBlIGlzIDFcblxuXHRkb21UZXh0OiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0Lm5vZGVUeXBlIGlzIDNcblxuXHRkb21Ob2RlOiAoc3ViamVjdCktPiBleHBvcnRzLmRvbUVsKHN1YmplY3QpIG9yIGV4cG9ydHMuZG9tVGV4dChzdWJqZWN0KVxuXG5cdGRvbVRleHRhcmVhOiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0Lm5vZGVOYW1lIGlzICdURVhUQVJFQSdcblx0XG5cdGRvbUlucHV0OiAoc3ViamVjdCktPiBzdWJqZWN0IGFuZCBzdWJqZWN0Lm5vZGVOYW1lIGlzICdJTlBVVCdcblx0XG5cdGRvbVNlbGVjdDogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5ub2RlTmFtZSBpcyAnU0VMRUNUJ1xuXHRcblx0ZG9tRmllbGQ6IChzdWJqZWN0KS0+IGV4cG9ydHMuZG9tSW5wdXQoc3ViamVjdCkgb3IgZXhwb3J0cy5kb21UZXh0YXJlYShzdWJqZWN0KSBvciBleHBvcnRzLmRvbVNlbGVjdChzdWJqZWN0KSIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5TVkcgPSBpbXBvcnQgJy4uLy4uL3N2ZydcbmhlbHBlcnMgPSBpbXBvcnQgJy4uLy4uL2hlbHBlcnMnXG5cbmV4cG9ydCBkZWZhdWx0IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnZHJvcGRvd24nXG5cdFx0c3R5bGVBZnRlckluc2VydDogdHJ1ZVxuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdHpJbmRleDogMTBcblx0XHRcdG92ZXJmbG93OiAnaGlkZGVuJ1xuXHRcdFx0dG9wOiAoZHJvcGRvd24pLT4gaWYgZHJvcGRvd24uZmllbGQudHlwZSBpcyAndGV4dCcgdGhlbiBAcGFyZW50LnJhdy5zdHlsZS5oZWlnaHQgZWxzZSAnLTdweCdcblx0XHRcdGxlZnQ6ICgpLT4gaWYgQHBhcmVudC5yZWN0LmxlZnQgLSA1IDwgMCB0aGVuIDAgZWxzZSAtNVxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHQjIGJhY2tncm91bmRDb2xvcjogaGVscGVycy5oZXhUb1JHQkEoJ2Y2ZjZmNicsIDAuOSlcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNmNmY2ZjYnXG5cdFx0XHRib3hTaGFkb3c6IFwiMHB4IDZweCAxMHB4ICN7aGVscGVycy5oZXhUb1JHQkEoJzAwMDAwMCcsIDAuMzIpfVwiXG5cdFx0XHRib3JkZXJXaWR0aDogJzFweCdcblx0XHRcdGJvcmRlclN0eWxlOiAnc29saWQnXG5cdFx0XHRib3JkZXJDb2xvcjogJyNkMWQxZDEnXG5cdFx0XHRib3JkZXJSYWRpdXM6ICc1cHgnXG5cdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0cGFkZGluZzogJzRweCAwJ1xuXHRcdFx0JGlzT3BlbjogJGhhc1Zpc2libGVDaG9pY2VzOlxuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snXG5cdF1cbilcblxuZXhwb3J0IGxpc3QgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2xpc3QnXG5cdFx0cGFzc1N0YXRlVG9DaGlsZHJlbjogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXG5cdFx0XHRvdmVyZmxvdzogJ3Njcm9sbCdcblx0XHRcdG92ZXJmbG93U2Nyb2xsaW5nOiAndG91Y2gnXG5cdFx0XHRvdmVyZmxvd1N0eWxlOiAnLW1zLWF1dG9oaWRpbmctc2Nyb2xsYmFyJ1xuXHRdXG4pXG5cbmV4cG9ydCBjaG9pY2UgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHN0eWxlOlxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRmb250U2l6ZTogJzAnXG5cdFx0XHRjb2xvcjogJyMwMDAwMDAnXG5cdFx0XHR1c2VyU2VsZWN0OiAnbm9uZSdcblx0XHRcdGxpbmVIZWlnaHQ6ICcxZW0nXG5cdFx0XHRjdXJzb3I6ICdwb2ludGVyJ1xuXHRcdFx0JHZpc2libGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRcdCR1bmF2YWlsYWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHQkaG92ZXI6XG5cdFx0XHRcdGNvbG9yOiAnI2ZmZmZmZidcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAnIzRDOTZGRidcblxuXHRcdFsnZGl2JyAjIENoZWNrbWFya1xuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG5cdFx0XHRcdHZlcnRpY2FsQWxpZ246J3RvcCdcblx0XHRcdFx0d2lkdGg6ICcyMHB4J1xuXHRcdFx0XHQjIGhlaWdodDogKCktPiBAcGFyZW50LnJhdy5zdHlsZS5oZWlnaHRcblx0XHRcdFx0IyBsaW5lSGVpZ2h0OiAoKS0+IEBwYXJlbnQuc3R5bGUoJ2hlaWdodCcpXG5cdFx0XHRcdCMgZm9udFNpemU6ICgpLT4gQHBhcmVudC5zdHlsZSgnaGVpZ2h0Jylcblx0XHRcdFx0bGluZUhlaWdodDogJzIwcHgnXG5cdFx0XHRcdGZvbnRTaXplOiAnMTNweCdcblx0XHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJ1xuXHRcdFx0XHRjb2xvcjogJ2luaGVyaXQnXG5cdFx0XHRcdHN0cm9rZTogJ2N1cnJlbnRDb2xvcidcblx0XHRcdFx0dmlzaWJpbGl0eTogJ2hpZGRlbidcblx0XHRcdFx0JHNlbGVjdGVkOlxuXHRcdFx0XHRcdHZpc2liaWxpdHk6ICd2aXNpYmxlJ1xuXG5cdFx0XHRTVkcuY2hlY2ttYXJrXG5cdFx0XVxuXHRcdFxuXHRcdFsnZGl2JyAjIFRleHRcblx0XHRcdHN0eWxlQWZ0ZXJJbnNlcnQ6IHRydWVcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuXHRcdFx0XHRvdmVyZmxvdzogJ2hpZGRlbidcblx0XHRcdFx0dGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnXG5cdFx0XHRcdHdoaXRlU3BhY2U6ICdub3dyYXAnXG5cdFx0XHRcdHdvcmRXcmFwOiAnbm9ybWFsJ1xuXHRcdFx0XHRtYXhXaWR0aDogKCktPiBcImNhbGMoMTAwJSAtICN7QHByZXYuc3R5bGVTYWZlICd3aWR0aCcsIHRydWV9KVwiXG5cdFx0XHRcdHBhZGRpbmdSaWdodDogJzEwcHgnXG5cdFx0XHRcdGxpbmVIZWlnaHQ6ICcyMHB4J1xuXHRcdFx0XHRmb250U2l6ZTogJzExcHgnXG5cdFx0XHRcdGZvbnRGYW1pbHk6IChkcm9wZG93biktPiBkcm9wZG93bi5zZXR0aW5ncy5mb250RmFtaWx5XG5cdFx0XHRcdGNvbG9yOiAnaW5oZXJpdCdcblx0XHRcdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCdcblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IHNjcm9sbEluZGljYXRvclVwID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdzY3JvbGxJbmRpY2F0b3JVcCdcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHR0b3A6IDBcblx0XHRcdGxlZnQ6IDBcblx0XHRcdGRpc3BsYXk6ICdub25lJ1xuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMjBweCdcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNmNmY2ZjYnXG5cdFx0XHRjb2xvcjogJyMwMDAwMDAnXG5cdFx0XHR0ZXh0QWxpZ246ICdjZW50ZXInXG5cdFx0XHQkdmlzaWJsZTpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXG5cdFx0WydkaXYnXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdFx0dG9wOiAnNTAlJ1xuXHRcdFx0XHRsZWZ0OiAwXG5cdFx0XHRcdHJpZ2h0OiAwXG5cdFx0XHRcdHdpZHRoOiAnMTVweCdcblx0XHRcdFx0aGVpZ2h0OiAnMTVweCdcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRcdFx0XHRtYXJnaW46ICcwIGF1dG8nXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknXG5cdFxuXHRcdFx0U1ZHLmNhcmV0VXBcblx0XHRdXG5cdF1cbilcblxuZXhwb3J0IHNjcm9sbEluZGljYXRvckRvd24gPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ3Njcm9sbEluZGljYXRvckRvd24nXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0Ym90dG9tOiAwXG5cdFx0XHRsZWZ0OiAwXG5cdFx0XHRkaXNwbGF5OiAnbm9uZSdcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzIwcHgnXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjZjZmNmY2J1xuXHRcdFx0Y29sb3I6ICcjMDAwMDAwJ1xuXHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJ1xuXHRcdFx0JHZpc2libGU6XG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblxuXHRcdFsnZGl2J1xuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRcdHRvcDogJzUwJSdcblx0XHRcdFx0bGVmdDogMFxuXHRcdFx0XHRyaWdodDogMFxuXHRcdFx0XHR3aWR0aDogJzE1cHgnXG5cdFx0XHRcdGhlaWdodDogJzE1cHgnXG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRcdFx0bWFyZ2luOiAnMCBhdXRvJ1xuXHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJ1xuXG5cdFx0XHRTVkcuY2FyZXREb3duXG5cdFx0XVxuXHRdXG4pXG5cbmV4cG9ydCBoZWxwID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdoZWxwJ1xuXHRcdHN0eWxlOlxuXHRcdFx0ZGlzcGxheTogJ25vbmUnXG5cdFx0XHRib3JkZXJUb3A6ICcycHggc29saWQgcmdiYSgwLDAsMCwwLjA1KSdcblx0XHRcdHBhZGRpbmc6ICc0cHggMTJweCAxcHgnXG5cdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsMC41KSdcblx0XHRcdGZvbnRXZWlnaHQ6ICc1MDAnXG5cdFx0XHRmb250U2l6ZTogJzExcHgnXG5cdFx0XHR1c2VyU2VsZWN0OiAnbm9uZSdcblx0XHRcdCRzaG93SGVscDpcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXHRdXG4pXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBcblx0bWF4SGVpZ2h0OiAzMDBcblx0bXVsdGlwbGU6IGZhbHNlXG5cdGxvY2tTY3JvbGw6IHRydWVcblx0dHlwZUJ1ZmZlcjogZmFsc2Vcblx0aGVscDogJydcblx0dGVtcGxhdGVzOiB7fSIsIiFmdW5jdGlvbihlLHIpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXIoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLHIpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMudGV4dE1hc2tDb3JlPXIoKTplLnRleHRNYXNrQ29yZT1yKCl9KHRoaXMsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcihuKXtpZih0W25dKXJldHVybiB0W25dLmV4cG9ydHM7dmFyIG89dFtuXT17ZXhwb3J0czp7fSxpZDpuLGxvYWRlZDohMX07cmV0dXJuIGVbbl0uY2FsbChvLmV4cG9ydHMsbyxvLmV4cG9ydHMsciksby5sb2FkZWQ9ITAsby5leHBvcnRzfXZhciB0PXt9O3JldHVybiByLm09ZSxyLmM9dCxyLnA9XCJcIixyKDApfShbZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntkZWZhdWx0OmV9fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBvPXQoMyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KHIsXCJjb25mb3JtVG9NYXNrXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG4obykuZGVmYXVsdH19KTt2YXIgaT10KDIpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiYWRqdXN0Q2FyZXRQb3NpdGlvblwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBuKGkpLmRlZmF1bHR9fSk7dmFyIGE9dCg1KTtPYmplY3QuZGVmaW5lUHJvcGVydHkocixcImNyZWF0ZVRleHRNYXNrSW5wdXRFbGVtZW50XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG4oYSkuZGVmYXVsdH19KX0sZnVuY3Rpb24oZSxyKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkocixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxyLnBsYWNlaG9sZGVyQ2hhcj1cIl9cIn0sZnVuY3Rpb24oZSxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KGUpe3ZhciByPWUucHJldmlvdXNDb25mb3JtZWRWYWx1ZSx0PXZvaWQgMD09PXI/bzpyLGk9ZS5wcmV2aW91c1BsYWNlaG9sZGVyLGE9dm9pZCAwPT09aT9vOmksdT1lLmN1cnJlbnRDYXJldFBvc2l0aW9uLGw9dm9pZCAwPT09dT8wOnUscz1lLmNvbmZvcm1lZFZhbHVlLGY9ZS5yYXdWYWx1ZSxkPWUucGxhY2Vob2xkZXJDaGFyLGM9ZS5wbGFjZWhvbGRlcix2PWUuaW5kZXhlc09mUGlwZWRDaGFycyxwPXZvaWQgMD09PXY/bjp2LGg9ZS5jYXJldFRyYXBJbmRleGVzLGc9dm9pZCAwPT09aD9uOmg7aWYoMD09PWwpcmV0dXJuIDA7dmFyIG09Zi5sZW5ndGgseT10Lmxlbmd0aCxiPWMubGVuZ3RoLEM9cy5sZW5ndGgsUD1tLXkseD1QPjAsTz0wPT09eSxrPVA+MSYmIXgmJiFPO2lmKGspcmV0dXJuIGw7dmFyIGo9eCYmKHQ9PT1zfHxzPT09YyksTT0wLFQ9dm9pZCAwLHc9dm9pZCAwO2lmKGopTT1sLVA7ZWxzZXt2YXIgXz1zLnRvTG93ZXJDYXNlKCksVj1mLnRvTG93ZXJDYXNlKCksUz1WLnN1YnN0cigwLGwpLnNwbGl0KG8pLE49Uy5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIF8uaW5kZXhPZihlKSE9PS0xfSk7dz1OW04ubGVuZ3RoLTFdO3ZhciBFPWEuc3Vic3RyKDAsTi5sZW5ndGgpLnNwbGl0KG8pLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZSE9PWR9KS5sZW5ndGgsQT1jLnN1YnN0cigwLE4ubGVuZ3RoKS5zcGxpdChvKS5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIGUhPT1kfSkubGVuZ3RoLFI9QSE9PUUsST12b2lkIDAhPT1hW04ubGVuZ3RoLTFdJiZ2b2lkIDAhPT1jW04ubGVuZ3RoLTJdJiZhW04ubGVuZ3RoLTFdIT09ZCYmYVtOLmxlbmd0aC0xXSE9PWNbTi5sZW5ndGgtMV0mJmFbTi5sZW5ndGgtMV09PT1jW04ubGVuZ3RoLTJdOyF4JiYoUnx8SSkmJkU+MCYmYy5pbmRleE9mKHcpPi0xJiZ2b2lkIDAhPT1mW2xdJiYoVD0hMCx3PWZbbF0pO2Zvcih2YXIgSj1wLm1hcChmdW5jdGlvbihlKXtyZXR1cm4gX1tlXX0pLHE9Si5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIGU9PT13fSkubGVuZ3RoLEY9Ti5maWx0ZXIoZnVuY3Rpb24oZSl7cmV0dXJuIGU9PT13fSkubGVuZ3RoLEw9Yy5zdWJzdHIoMCxjLmluZGV4T2YoZCkpLnNwbGl0KG8pLmZpbHRlcihmdW5jdGlvbihlLHIpe3JldHVybiBlPT09dyYmZltyXSE9PWV9KS5sZW5ndGgsVz1MK0YrcSsoVD8xOjApLHo9MCxCPTA7QjxDO0IrKyl7dmFyIEQ9X1tCXTtpZihNPUIrMSxEPT09dyYmeisrLHo+PVcpYnJlYWt9fWlmKHgpe2Zvcih2YXIgRz1NLEg9TTtIPD1iO0grKylpZihjW0hdPT09ZCYmKEc9SCksY1tIXT09PWR8fGcuaW5kZXhPZihIKSE9PS0xfHxIPT09YilyZXR1cm4gR31lbHNlIGlmKFQpe2Zvcih2YXIgSz1NLTE7Sz49MDtLLS0paWYoc1tLXT09PXd8fGcuaW5kZXhPZihLKSE9PS0xfHwwPT09SylyZXR1cm4gS31lbHNlIGZvcih2YXIgUT1NO1E+PTA7US0tKWlmKGNbUS0xXT09PWR8fGcuaW5kZXhPZihRKSE9PS0xfHwwPT09USlyZXR1cm4gUX1PYmplY3QuZGVmaW5lUHJvcGVydHkocixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxyLmRlZmF1bHQ9dDt2YXIgbj1bXSxvPVwiXCJ9LGZ1bmN0aW9uKGUscix0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOmEscj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06YSx0PWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXTp7fSxuPXQuZ3VpZGUsdT12b2lkIDA9PT1ufHxuLGw9dC5wcmV2aW91c0NvbmZvcm1lZFZhbHVlLHM9dm9pZCAwPT09bD9hOmwsZj10LnBsYWNlaG9sZGVyQ2hhcixkPXZvaWQgMD09PWY/aS5wbGFjZWhvbGRlckNoYXI6ZixjPXQucGxhY2Vob2xkZXIsdj12b2lkIDA9PT1jPygwLG8uY29udmVydE1hc2tUb1BsYWNlaG9sZGVyKShyLGQpOmMscD10LmN1cnJlbnRDYXJldFBvc2l0aW9uLGg9dC5rZWVwQ2hhclBvc2l0aW9ucyxnPXU9PT0hMSYmdm9pZCAwIT09cyxtPWUubGVuZ3RoLHk9cy5sZW5ndGgsYj12Lmxlbmd0aCxDPXIubGVuZ3RoLFA9bS15LHg9UD4wLE89cCsoeD8tUDowKSxrPU8rTWF0aC5hYnMoUCk7aWYoaD09PSEwJiYheCl7Zm9yKHZhciBqPWEsTT1PO008aztNKyspdltNXT09PWQmJihqKz1kKTtlPWUuc2xpY2UoMCxPKStqK2Uuc2xpY2UoTyxtKX1mb3IodmFyIFQ9ZS5zcGxpdChhKS5tYXAoZnVuY3Rpb24oZSxyKXtyZXR1cm57Y2hhcjplLGlzTmV3OnI+PU8mJnI8a319KSx3PW0tMTt3Pj0wO3ctLSl7dmFyIF89VFt3XS5jaGFyO2lmKF8hPT1kKXt2YXIgVj13Pj1PJiZ5PT09QztfPT09dltWP3ctUDp3XSYmVC5zcGxpY2UodywxKX19dmFyIFM9YSxOPSExO2U6Zm9yKHZhciBFPTA7RTxiO0UrKyl7dmFyIEE9dltFXTtpZihBPT09ZCl7aWYoVC5sZW5ndGg+MClmb3IoO1QubGVuZ3RoPjA7KXt2YXIgUj1ULnNoaWZ0KCksST1SLmNoYXIsSj1SLmlzTmV3O2lmKEk9PT1kJiZnIT09ITApe1MrPWQ7Y29udGludWUgZX1pZihyW0VdLnRlc3QoSSkpe2lmKGg9PT0hMCYmSiE9PSExJiZzIT09YSYmdSE9PSExJiZ4KXtmb3IodmFyIHE9VC5sZW5ndGgsRj1udWxsLEw9MDtMPHE7TCsrKXt2YXIgVz1UW0xdO2lmKFcuY2hhciE9PWQmJlcuaXNOZXc9PT0hMSlicmVhaztpZihXLmNoYXI9PT1kKXtGPUw7YnJlYWt9fW51bGwhPT1GPyhTKz1JLFQuc3BsaWNlKEYsMSkpOkUtLX1lbHNlIFMrPUk7Y29udGludWUgZX1OPSEwfWc9PT0hMSYmKFMrPXYuc3Vic3RyKEUsYikpO2JyZWFrfVMrPUF9aWYoZyYmeD09PSExKXtmb3IodmFyIHo9bnVsbCxCPTA7QjxTLmxlbmd0aDtCKyspdltCXT09PWQmJih6PUIpO1M9bnVsbCE9PXo/Uy5zdWJzdHIoMCx6KzEpOmF9cmV0dXJue2NvbmZvcm1lZFZhbHVlOlMsbWV0YTp7c29tZUNoYXJzUmVqZWN0ZWQ6Tn19fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHIuZGVmYXVsdD1uO3ZhciBvPXQoNCksaT10KDEpLGE9XCJcIn0sZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06bCxyPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTp1LnBsYWNlaG9sZGVyQ2hhcjtpZihlLmluZGV4T2YocikhPT0tMSl0aHJvdyBuZXcgRXJyb3IoXCJQbGFjZWhvbGRlciBjaGFyYWN0ZXIgbXVzdCBub3QgYmUgdXNlZCBhcyBwYXJ0IG9mIHRoZSBtYXNrLiBQbGVhc2Ugc3BlY2lmeSBhIGNoYXJhY3RlciB0aGF0IGlzIG5vdCBwcmVzZW50IGluIHlvdXIgbWFzayBhcyB5b3VyIHBsYWNlaG9sZGVyIGNoYXJhY3Rlci5cXG5cXG5cIisoXCJUaGUgcGxhY2Vob2xkZXIgY2hhcmFjdGVyIHRoYXQgd2FzIHJlY2VpdmVkIGlzOiBcIitKU09OLnN0cmluZ2lmeShyKStcIlxcblxcblwiKSsoXCJUaGUgbWFzayB0aGF0IHdhcyByZWNlaXZlZCBpczogXCIrSlNPTi5zdHJpbmdpZnkoZSkpKTtyZXR1cm4gZS5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuIGUgaW5zdGFuY2VvZiBSZWdFeHA/cjplfSkuam9pbihcIlwiKX1mdW5jdGlvbiBvKGUpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBlfHxlIGluc3RhbmNlb2YgU3RyaW5nfWZ1bmN0aW9uIGkoZSl7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIGUmJnZvaWQgMD09PWUubGVuZ3RoJiYhaXNOYU4oZSl9ZnVuY3Rpb24gYShlKXtmb3IodmFyIHI9W10sdD12b2lkIDA7dD1lLmluZGV4T2YocyksdCE9PS0xOylyLnB1c2godCksZS5zcGxpY2UodCwxKTtyZXR1cm57bWFza1dpdGhvdXRDYXJldFRyYXBzOmUsaW5kZXhlczpyfX1PYmplY3QuZGVmaW5lUHJvcGVydHkocixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxyLmNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcj1uLHIuaXNTdHJpbmc9byxyLmlzTnVtYmVyPWksci5wcm9jZXNzQ2FyZXRUcmFwcz1hO3ZhciB1PXQoMSksbD1bXSxzPVwiW11cIn0sZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntkZWZhdWx0OmV9fWZ1bmN0aW9uIG8oZSl7dmFyIHI9e3ByZXZpb3VzQ29uZm9ybWVkVmFsdWU6dm9pZCAwLHByZXZpb3VzUGxhY2Vob2xkZXI6dm9pZCAwfTtyZXR1cm57c3RhdGU6cix1cGRhdGU6ZnVuY3Rpb24odCl7dmFyIG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOmUsbz1uLmlucHV0RWxlbWVudCxzPW4ubWFzayxkPW4uZ3VpZGUsbT1uLnBpcGUsYj1uLnBsYWNlaG9sZGVyQ2hhcixDPXZvaWQgMD09PWI/cC5wbGFjZWhvbGRlckNoYXI6YixQPW4ua2VlcENoYXJQb3NpdGlvbnMseD12b2lkIDAhPT1QJiZQLE89bi5zaG93TWFzayxrPXZvaWQgMCE9PU8mJk87aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQmJih0PW8udmFsdWUpLHQhPT1yLnByZXZpb3VzQ29uZm9ybWVkVmFsdWUpeyhcInVuZGVmaW5lZFwiPT10eXBlb2Ygcz9cInVuZGVmaW5lZFwiOmwocykpPT09eSYmdm9pZCAwIT09cy5waXBlJiZ2b2lkIDAhPT1zLm1hc2smJihtPXMucGlwZSxzPXMubWFzayk7dmFyIGo9dm9pZCAwLE09dm9pZCAwO2lmKHMgaW5zdGFuY2VvZiBBcnJheSYmKGo9KDAsdi5jb252ZXJ0TWFza1RvUGxhY2Vob2xkZXIpKHMsQykpLHMhPT0hMSl7dmFyIFQ9YSh0KSx3PW8uc2VsZWN0aW9uRW5kLF89ci5wcmV2aW91c0NvbmZvcm1lZFZhbHVlLFY9ci5wcmV2aW91c1BsYWNlaG9sZGVyLFM9dm9pZCAwO2lmKChcInVuZGVmaW5lZFwiPT10eXBlb2Ygcz9cInVuZGVmaW5lZFwiOmwocykpPT09aCl7aWYoTT1zKFQse2N1cnJlbnRDYXJldFBvc2l0aW9uOncscHJldmlvdXNDb25mb3JtZWRWYWx1ZTpfLHBsYWNlaG9sZGVyQ2hhcjpDfSksTT09PSExKXJldHVybjt2YXIgTj0oMCx2LnByb2Nlc3NDYXJldFRyYXBzKShNKSxFPU4ubWFza1dpdGhvdXRDYXJldFRyYXBzLEE9Ti5pbmRleGVzO009RSxTPUEsaj0oMCx2LmNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcikoTSxDKX1lbHNlIE09czt2YXIgUj17cHJldmlvdXNDb25mb3JtZWRWYWx1ZTpfLGd1aWRlOmQscGxhY2Vob2xkZXJDaGFyOkMscGlwZTptLHBsYWNlaG9sZGVyOmosY3VycmVudENhcmV0UG9zaXRpb246dyxrZWVwQ2hhclBvc2l0aW9uczp4fSxJPSgwLGMuZGVmYXVsdCkoVCxNLFIpLEo9SS5jb25mb3JtZWRWYWx1ZSxxPShcInVuZGVmaW5lZFwiPT10eXBlb2YgbT9cInVuZGVmaW5lZFwiOmwobSkpPT09aCxGPXt9O3EmJihGPW0oSix1KHtyYXdWYWx1ZTpUfSxSKSksRj09PSExP0Y9e3ZhbHVlOl8scmVqZWN0ZWQ6ITB9OigwLHYuaXNTdHJpbmcpKEYpJiYoRj17dmFsdWU6Rn0pKTt2YXIgTD1xP0YudmFsdWU6SixXPSgwLGYuZGVmYXVsdCkoe3ByZXZpb3VzQ29uZm9ybWVkVmFsdWU6XyxwcmV2aW91c1BsYWNlaG9sZGVyOlYsY29uZm9ybWVkVmFsdWU6TCxwbGFjZWhvbGRlcjpqLHJhd1ZhbHVlOlQsY3VycmVudENhcmV0UG9zaXRpb246dyxwbGFjZWhvbGRlckNoYXI6QyxpbmRleGVzT2ZQaXBlZENoYXJzOkYuaW5kZXhlc09mUGlwZWRDaGFycyxjYXJldFRyYXBJbmRleGVzOlN9KSx6PUw9PT1qJiYwPT09VyxCPWs/ajpnLEQ9ej9COkw7ci5wcmV2aW91c0NvbmZvcm1lZFZhbHVlPUQsci5wcmV2aW91c1BsYWNlaG9sZGVyPWosby52YWx1ZSE9PUQmJihvLnZhbHVlPUQsaShvLFcpKX19fX19ZnVuY3Rpb24gaShlLHIpe2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ9PT1lJiYoYj9DKGZ1bmN0aW9uKCl7cmV0dXJuIGUuc2V0U2VsZWN0aW9uUmFuZ2UocixyLG0pfSwwKTplLnNldFNlbGVjdGlvblJhbmdlKHIscixtKSl9ZnVuY3Rpb24gYShlKXtpZigoMCx2LmlzU3RyaW5nKShlKSlyZXR1cm4gZTtpZigoMCx2LmlzTnVtYmVyKShlKSlyZXR1cm4gU3RyaW5nKGUpO2lmKHZvaWQgMD09PWV8fG51bGw9PT1lKXJldHVybiBnO3Rocm93IG5ldyBFcnJvcihcIlRoZSAndmFsdWUnIHByb3ZpZGVkIHRvIFRleHQgTWFzayBuZWVkcyB0byBiZSBhIHN0cmluZyBvciBhIG51bWJlci4gVGhlIHZhbHVlIHJlY2VpdmVkIHdhczpcXG5cXG4gXCIrSlNPTi5zdHJpbmdpZnkoZSkpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciB1PU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKGUpe2Zvcih2YXIgcj0xO3I8YXJndW1lbnRzLmxlbmd0aDtyKyspe3ZhciB0PWFyZ3VtZW50c1tyXTtmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSl9cmV0dXJuIGV9LGw9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX07ci5kZWZhdWx0PW87dmFyIHM9dCgyKSxmPW4ocyksZD10KDMpLGM9bihkKSx2PXQoNCkscD10KDEpLGg9XCJmdW5jdGlvblwiLGc9XCJcIixtPVwibm9uZVwiLHk9XCJvYmplY3RcIixiPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBuYXZpZ2F0b3ImJi9BbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxDPVwidW5kZWZpbmVkXCIhPXR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWU/cmVxdWVzdEFuaW1hdGlvbkZyYW1lOnNldFRpbWVvdXR9XSl9KTsiLCIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSx0KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLnRleHRNYXNrQWRkb25zPXQoKTplLnRleHRNYXNrQWRkb25zPXQoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtmdW5jdGlvbiB0KHIpe2lmKG5bcl0pcmV0dXJuIG5bcl0uZXhwb3J0czt2YXIgbz1uW3JdPXtleHBvcnRzOnt9LGlkOnIsbG9hZGVkOiExfTtyZXR1cm4gZVtyXS5jYWxsKG8uZXhwb3J0cyxvLG8uZXhwb3J0cyx0KSxvLmxvYWRlZD0hMCxvLmV4cG9ydHN9dmFyIG49e307cmV0dXJuIHQubT1lLHQuYz1uLHQucD1cIlwiLHQoMCl9KFtmdW5jdGlvbihlLHQsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e2RlZmF1bHQ6ZX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG89bigxKTtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcImNyZWF0ZUF1dG9Db3JyZWN0ZWREYXRlUGlwZVwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiByKG8pLmRlZmF1bHR9fSk7dmFyIGk9bigyKTtPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcImNyZWF0ZU51bWJlck1hc2tcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcihpKS5kZWZhdWx0fX0pO3ZhciB1PW4oMyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJlbWFpbE1hc2tcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcih1KS5kZWZhdWx0fX0pfSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06XCJtbSBkZCB5eXl5XCI7cmV0dXJuIGZ1bmN0aW9uKHQpe3ZhciBuPVtdLHI9ZS5zcGxpdCgvW15kbXldKy8pLG89e2RkOjMxLG1tOjEyLHl5Ojk5LHl5eXk6OTk5OX0saT17ZGQ6MSxtbToxLHl5OjAseXl5eToxfSx1PXQuc3BsaXQoXCJcIik7ci5mb3JFYWNoKGZ1bmN0aW9uKHQpe3ZhciByPWUuaW5kZXhPZih0KSxpPXBhcnNlSW50KG9bdF0udG9TdHJpbmcoKS5zdWJzdHIoMCwxKSwxMCk7cGFyc2VJbnQodVtyXSwxMCk+aSYmKHVbcisxXT11W3JdLHVbcl09MCxuLnB1c2gocikpfSk7dmFyIGM9ci5zb21lKGZ1bmN0aW9uKG4pe3ZhciByPWUuaW5kZXhPZihuKSx1PW4ubGVuZ3RoLGM9dC5zdWJzdHIocix1KS5yZXBsYWNlKC9cXEQvZyxcIlwiKSxsPXBhcnNlSW50KGMsMTApO3JldHVybiBsPm9bbl18fGMubGVuZ3RoPT09dSYmbDxpW25dfSk7cmV0dXJuIWMmJnt2YWx1ZTp1LmpvaW4oXCJcIiksaW5kZXhlc09mUGlwZWRDaGFyczpufX19T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5kZWZhdWx0PW59LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbigpe2Z1bmN0aW9uIGUoKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06Yyx0PWUubGVuZ3RoO2lmKGU9PT1jfHxlWzBdPT09aFswXSYmMT09PXQpcmV0dXJuIGguc3BsaXQoYykuY29uY2F0KFt2XSkuY29uY2F0KG0uc3BsaXQoYykpO2lmKGU9PT1TJiZNKXJldHVybiBoLnNwbGl0KGMpLmNvbmNhdChbXCIwXCIsUyx2XSkuY29uY2F0KG0uc3BsaXQoYykpO3ZhciBuPWUubGFzdEluZGV4T2YoUyksdT1uIT09LTEsbD1lWzBdPT09cyYmSSxhPXZvaWQgMCxnPXZvaWQgMCxiPXZvaWQgMDtpZihlLnNsaWNlKFYqLTEpPT09bSYmKGU9ZS5zbGljZSgwLFYqLTEpKSx1JiYoTXx8RCk/KGE9ZS5zbGljZShlLnNsaWNlKDAsJCk9PT1oPyQ6MCxuKSxnPWUuc2xpY2UobisxLHQpLGc9cihnLnJlcGxhY2UoZixjKSkpOmE9ZS5zbGljZSgwLCQpPT09aD9lLnNsaWNlKCQpOmUsTiYmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBOP1widW5kZWZpbmVkXCI6aShOKSk9PT1wKXt2YXIgTz1cIi5cIj09PV8/XCJbLl1cIjpcIlwiK18saj0oYS5tYXRjaChuZXcgUmVnRXhwKE8sXCJnXCIpKXx8W10pLmxlbmd0aDthPWEuc2xpY2UoMCxOK2oqcSl9cmV0dXJuIGE9YS5yZXBsYWNlKGYsYyksQXx8KGE9YS5yZXBsYWNlKC9eMCsoMCR8W14wXSkvLFwiJDFcIikpLGE9eD9vKGEsXyk6YSxiPXIoYSksKHUmJk18fEQ9PT0hMCkmJihlW24tMV0hPT1TJiZiLnB1c2goeSksYi5wdXNoKFMseSksZyYmKChcInVuZGVmaW5lZFwiPT10eXBlb2YgQz9cInVuZGVmaW5lZFwiOmkoQykpPT09cCYmKGc9Zy5zbGljZSgwLEMpKSxiPWIuY29uY2F0KGcpKSxEPT09ITAmJmVbbi0xXT09PVMmJmIucHVzaCh2KSksJD4wJiYoYj1oLnNwbGl0KGMpLmNvbmNhdChiKSksbCYmKGIubGVuZ3RoPT09JCYmYi5wdXNoKHYpLGI9W2RdLmNvbmNhdChiKSksbS5sZW5ndGg+MCYmKGI9Yi5jb25jYXQobS5zcGxpdChjKSkpLGJ9dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LG49dC5wcmVmaXgsaD12b2lkIDA9PT1uP3U6bixnPXQuc3VmZml4LG09dm9pZCAwPT09Zz9jOmcsYj10LmluY2x1ZGVUaG91c2FuZHNTZXBhcmF0b3IseD12b2lkIDA9PT1ifHxiLE89dC50aG91c2FuZHNTZXBhcmF0b3JTeW1ib2wsXz12b2lkIDA9PT1PP2w6TyxqPXQuYWxsb3dEZWNpbWFsLE09dm9pZCAwIT09aiYmaixQPXQuZGVjaW1hbFN5bWJvbCxTPXZvaWQgMD09PVA/YTpQLHc9dC5kZWNpbWFsTGltaXQsQz12b2lkIDA9PT13PzI6dyxrPXQucmVxdWlyZURlY2ltYWwsRD12b2lkIDAhPT1rJiZrLEU9dC5hbGxvd05lZ2F0aXZlLEk9dm9pZCAwIT09RSYmRSxSPXQuYWxsb3dMZWFkaW5nWmVyb2VzLEE9dm9pZCAwIT09UiYmUixMPXQuaW50ZWdlckxpbWl0LE49dm9pZCAwPT09TD9udWxsOkwsJD1oJiZoLmxlbmd0aHx8MCxWPW0mJm0ubGVuZ3RofHwwLHE9XyYmXy5sZW5ndGh8fDA7cmV0dXJuIGUuaW5zdGFuY2VPZj1cImNyZWF0ZU51bWJlck1hc2tcIixlfWZ1bmN0aW9uIHIoZSl7cmV0dXJuIGUuc3BsaXQoYykubWFwKGZ1bmN0aW9uKGUpe3JldHVybiB2LnRlc3QoZSk/djplfSl9ZnVuY3Rpb24gbyhlLHQpe3JldHVybiBlLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csdCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGk9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX07dC5kZWZhdWx0PW47dmFyIHU9XCIkXCIsYz1cIlwiLGw9XCIsXCIsYT1cIi5cIixzPVwiLVwiLGQ9Ly0vLGY9L1xcRCsvZyxwPVwibnVtYmVyXCIsdj0vXFxkLyx5PVwiW11cIn0sZnVuY3Rpb24oZSx0LG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIoZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntkZWZhdWx0OmV9fWZ1bmN0aW9uIG8oZSx0KXtlPWUucmVwbGFjZShPLHYpO3ZhciBuPXQucGxhY2Vob2xkZXJDaGFyLHI9dC5jdXJyZW50Q2FyZXRQb3NpdGlvbixvPWUuaW5kZXhPZih5KSxzPWUubGFzdEluZGV4T2YocCksZD1zPG8/LTE6cyxmPWkoZSxvKzEseSksaD1pKGUsZC0xLHApLGc9dShlLG8sbiksbT1jKGUsbyxkLG4pLGI9bChlLGQsbixyKTtnPWEoZyksbT1hKG0pLGI9YShiLCEwKTt2YXIgeD1nLmNvbmNhdChmKS5jb25jYXQobSkuY29uY2F0KGgpLmNvbmNhdChiKTtyZXR1cm4geH1mdW5jdGlvbiBpKGUsdCxuKXt2YXIgcj1bXTtyZXR1cm4gZVt0XT09PW4/ci5wdXNoKG4pOnIucHVzaChoLG4pLHIucHVzaChoKSxyfWZ1bmN0aW9uIHUoZSx0KXtyZXR1cm4gdD09PS0xP2U6ZS5zbGljZSgwLHQpfWZ1bmN0aW9uIGMoZSx0LG4scil7dmFyIG89djtyZXR1cm4gdCE9PS0xJiYobz1uPT09LTE/ZS5zbGljZSh0KzEsZS5sZW5ndGgpOmUuc2xpY2UodCsxLG4pKSxvPW8ucmVwbGFjZShuZXcgUmVnRXhwKFwiW1xcXFxzXCIrcitcIl1cIixtKSx2KSxvPT09eT9mOm8ubGVuZ3RoPDE/ZzpvW28ubGVuZ3RoLTFdPT09cD9vLnNsaWNlKDAsby5sZW5ndGgtMSk6b31mdW5jdGlvbiBsKGUsdCxuLHIpe3ZhciBvPXY7cmV0dXJuIHQhPT0tMSYmKG89ZS5zbGljZSh0KzEsZS5sZW5ndGgpKSxvPW8ucmVwbGFjZShuZXcgUmVnRXhwKFwiW1xcXFxzXCIrbitcIi5dXCIsbSksdiksMD09PW8ubGVuZ3RoP2VbdC0xXT09PXAmJnIhPT1lLmxlbmd0aD9mOnY6b31mdW5jdGlvbiBhKGUsdCl7cmV0dXJuIGUuc3BsaXQodikubWFwKGZ1bmN0aW9uKGUpe3JldHVybiBlPT09Zz9lOnQ/eDpifSl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHM9big0KSxkPXIocyksZj1cIipcIixwPVwiLlwiLHY9XCJcIix5PVwiQFwiLGg9XCJbXVwiLGc9XCIgXCIsbT1cImdcIixiPS9bXlxcc10vLHg9L1teLlxcc10vLE89L1xccy9nO3QuZGVmYXVsdD17bWFzazpvLHBpcGU6ZC5kZWZhdWx0fX0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKGUsdCl7dmFyIG49dC5jdXJyZW50Q2FyZXRQb3NpdGlvbixpPXQucmF3VmFsdWUsZj10LnByZXZpb3VzQ29uZm9ybWVkVmFsdWUscD10LnBsYWNlaG9sZGVyQ2hhcix2PWU7dj1yKHYpO3ZhciB5PXYuaW5kZXhPZihjKSxoPW51bGw9PT1pLm1hdGNoKG5ldyBSZWdFeHAoXCJbXkBcXFxccy5cIitwK1wiXVwiKSk7aWYoaClyZXR1cm4gdTtpZih2LmluZGV4T2YoYSkhPT0tMXx8eSE9PS0xJiZuIT09eSsxfHxpLmluZGV4T2Yobyk9PT0tMSYmZiE9PXUmJmkuaW5kZXhPZihsKSE9PS0xKXJldHVybiExO3ZhciBnPXYuaW5kZXhPZihvKSxtPXYuc2xpY2UoZysxLHYubGVuZ3RoKTtyZXR1cm4obS5tYXRjaChkKXx8cykubGVuZ3RoPjEmJnYuc3Vic3RyKC0xKT09PWwmJm4hPT1pLmxlbmd0aCYmKHY9di5zbGljZSgwLHYubGVuZ3RoLTEpKSx2fWZ1bmN0aW9uIHIoZSl7dmFyIHQ9MDtyZXR1cm4gZS5yZXBsYWNlKGksZnVuY3Rpb24oKXtyZXR1cm4gdCsrLDE9PT10P286dX0pfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuZGVmYXVsdD1uO3ZhciBvPVwiQFwiLGk9L0AvZyx1PVwiXCIsYz1cIkAuXCIsbD1cIi5cIixhPVwiLi5cIixzPVtdLGQ9L1xcLi9nfV0pfSk7IiwibW9kdWxlLmV4cG9ydHMgPSBcblx0cmVkOiAnI2NjNDgyMCdcblx0Z3JlZW46ICcjNzJjMzIyJ1xuXHRvcmFuZ2U6ICcjZmY5YzAwJ1xuXHRibGFjazogJyMxODE4MTgnXG5cdGdyZXlfZGFyazogJyM1ZTVlNWUnXG5cdGdyZXk6ICcjOTA5MDkwJ1xuXHRncmV5X3NlbWlfbGlnaHQ6ICcjYmViZWJlJ1xuXHRncmV5X2xpZ2h0OiAnI2QzZDNkMydcblx0Z3JleV9saWdodDI6ICcjZGRkZGRkJ1xuXHRncmV5X2xpZ2h0MzogJyNmMmY1ZjcnXG5cdGdyZXlfbGlnaHQ0OiAnI2U1ZTVlNSdcbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3RhdGVDaGFpblxuXHRjb25zdHJ1Y3RvcjogKHN0YXRlcyktPlxuXHRcdEBzdHJpbmcgPSBzdGF0ZXMuam9pbignKycpXG5cdFx0QGFycmF5ID0gc3RhdGVzLnNsaWNlKClcblx0XHRAbGVuZ3RoID0gc3RhdGVzLmxlbmd0aFxuXG5cdGluY2x1ZGVzOiAodGFyZ2V0KS0+XG5cdFx0Zm9yIHN0YXRlIGluIEBhcnJheVxuXHRcdFx0cmV0dXJuIHRydWUgaWYgc3RhdGUgaXMgdGFyZ2V0XG5cblx0XHRyZXR1cm4gZmFsc2VcblxuXHR3aXRob3V0OiAodGFyZ2V0KS0+XG5cdFx0QGFycmF5XG5cdFx0XHQuZmlsdGVyIChzdGF0ZSktPiBzdGF0ZSBpc250IHRhcmdldFxuXHRcdFx0LmpvaW4gJysnXG5cblxuXHRpc0FwcGxpY2FibGU6ICh0YXJnZXQsIG90aGVyQWN0aXZlKS0+XG5cdFx0YWN0aXZlID0gQGFycmF5LmZpbHRlciAoc3RhdGUpLT5cblx0XHRcdHN0YXRlIGlzIHRhcmdldCBvclxuXHRcdFx0b3RoZXJBY3RpdmUuaW5kZXhPZihzdGF0ZSkgaXNudCAtMVxuXG5cdFx0cmV0dXJuIGFjdGl2ZS5sZW5ndGggaXMgQGFycmF5Lmxlbmd0aCIsImV4cG9ydHMuY2hlY2ttYXJrID0gaW1wb3J0ICcuL2NoZWNrbWFyaydcbmV4cG9ydHMuYW5nbGVEb3duID0gaW1wb3J0ICcuL2FuZ2xlRG93bidcbmV4cG9ydHMuY2FyZXRVcCA9IGltcG9ydCAnLi9jYXJldFVwJ1xuZXhwb3J0cy5jYXJldERvd24gPSBpbXBvcnQgJy4vY2FyZXREb3duJ1xuZXhwb3J0cy5wbHVzID0gaW1wb3J0ICcuL3BsdXMnXG5leHBvcnRzLmNsb25lID0gaW1wb3J0ICcuL2Nsb25lJ1xuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHdpZHRoOiAnMTJweCdcblx0XHRcdGhlaWdodDogJzEycHgnXG5cdFx0XHR2aWV3Qm94OiAnNSA3IDEyIDEyJ1xuXHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHR3aWR0aDogJzlweCdcblx0XHRcdGhlaWdodDogJzlweCdcblxuXG5cdFx0WycqcG9seWxpbmUnLCB7XG5cdFx0XHRhdHRyczpcblx0XHRcdFx0J3N0cm9rZS13aWR0aCc6ICcyJ1xuXHRcdFx0XHQnc3Ryb2tlLWxpbmVjYXAnOiAncm91bmQnXG5cdFx0XHRcdCdzdHJva2UtbGluZWpvaW4nOiAncm91bmQnXG5cdFx0XHRcdGZpbGw6ICdub25lJ1xuXHRcdFx0XHRwb2ludHM6ICc3IDEzLjg4ODg4ODkgOS42NjY2NjY2NyAxNyAxNSA5J1xuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdH1dXG5cdF1cbilcblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0d2lkdGg6ICcxNzkycHgnXG5cdFx0XHRoZWlnaHQ6ICcxNzkycHgnXG5cdFx0XHR2aWV3Qm94OiAnMCAwIDE3OTIgMTc5Midcblx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0aGVpZ2h0OiAnMTAwJSdcblx0XHRcdG91dGxpbmU6ICdub25lJ1xuXG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTEzOTUgNzM2cTAgMTMtMTAgMjNsLTQ2NiA0NjZxLTEwIDEwLTIzIDEwdC0yMy0xMGwtNDY2LTQ2NnEtMTAtMTAtMTAtMjN0MTAtMjNsNTAtNTBxMTAtMTAgMjMtMTB0MjMgMTBsMzkzIDM5MyAzOTMtMzkzcTEwLTEwIDIzLTEwdDIzIDEwbDUwIDUwcTEwIDEwIDEwIDIzeidcblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG4iLCJET00gPSBpbXBvcnQgJ3F1aWNrZG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTS50ZW1wbGF0ZShcblx0Wycqc3ZnJ1xuXHRcdGF0dHJzOlxuXHRcdFx0dmlld0JveDogJzAgMCA1MTIgNTEyJ1xuXHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHR3aWR0aDogJzEwMCUnXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJ1xuXHRcdFx0b3V0bGluZTogJ25vbmUnXG5cblx0XHRbJypwYXRoJ1xuXHRcdFx0YXR0cnM6XG5cdFx0XHRcdHRhYmluZGV4OiAtMVxuXHRcdFx0XHRmb2N1c2FibGU6IGZhbHNlXG5cdFx0XHRcdGQ6ICdNNDAyIDM0N2MwIDUtMiAxMC01IDEzLTQgNC04IDYtMTMgNmgtMjU2Yy01IDAtOS0yLTEzLTYtMy0zLTUtOC01LTEzczItOSA1LTEybDEyOC0xMjhjNC00IDgtNiAxMy02czkgMiAxMyA2bDEyOCAxMjhjMyAzIDUgNyA1IDEyeidcblx0XHRdXG5cdF1cbilcblxuXG5cblxuXG5cbiIsIkRPTSA9IGltcG9ydCAncXVpY2tkb20nXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NLnRlbXBsYXRlKFxuXHRbJypzdmcnXG5cdFx0YXR0cnM6XG5cdFx0XHR2aWV3Qm94OiAnMCAwIDUxMiA1MTInXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBhdGgnXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0ZDogJ000MDIgMjAxYzAgNS0yIDktNSAxM2wtMTI4IDEyOGMtNCA0LTggNS0xMyA1cy05LTEtMTMtNWwtMTI4LTEyOGMtMy00LTUtOC01LTEzczItOSA1LTEzYzQtMyA4LTUgMTMtNWgyNTZjNSAwIDkgMiAxMyA1IDMgNCA1IDggNSAxM3onXG5cdFx0XVxuXHRdXG4pXG5cblxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHZpZXdCb3g6ICcwIDAgMTUgMTUnXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBvbHlnb24nXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0cG9pbnRzOiAnOSAwIDYgMCA2IDYgMCA2IDAgOSA2IDkgNiAxNSA5IDE1IDkgOSAxNSA5IDE1IDYgOSA2J1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cblxuIiwiRE9NID0gaW1wb3J0ICdxdWlja2RvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBET00udGVtcGxhdGUoXG5cdFsnKnN2Zydcblx0XHRhdHRyczpcblx0XHRcdHZpZXdCb3g6ICcwIDAgMTggMjAnXG5cdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRzdHlsZTpcblx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdGhlaWdodDogJzEwMCUnXG5cdFx0XHRvdXRsaW5lOiAnbm9uZSdcblxuXHRcdFsnKnBhdGgnXG5cdFx0XHRhdHRyczpcblx0XHRcdFx0dGFiaW5kZXg6IC0xXG5cdFx0XHRcdGZvY3VzYWJsZTogZmFsc2Vcblx0XHRcdFx0ZDogJ00xMy40MTQsMCBMNiwwIEM0Ljg5NywwIDQsMC44OTggNCwyIEw0LDE0IEM0LDE1LjEwMyA0Ljg5NywxNiA2LDE2IEwxNiwxNiBDMTcuMTAzLDE2IDE4LDE1LjEwMyAxOCwxNCBMMTgsNC41ODYgTDEzLjQxNCwwIFogTTE2LjAwMSwxNCBMNiwxNCBMNiwyIEwxMiwyIEwxMiw2IEwxNiw2IEwxNi4wMDEsMTQgWidcblx0XHRdXG5cdFx0XG5cdFx0WycqcGF0aCdcblx0XHRcdGF0dHJzOlxuXHRcdFx0XHR0YWJpbmRleDogLTFcblx0XHRcdFx0Zm9jdXNhYmxlOiBmYWxzZVxuXHRcdFx0XHRkOiAnTTIsNi40MjM3OTI4MiBMMCw2LjQyMzc5MjgyIEwwLDE4IEMwLDE5LjEwMyAwLjg5NywyMCAyLDIwIEwxNCwyMCBMMTQsMTggTDIsMTggTDIsNi40MjM3OTI4MiBaJ1xuXHRcdF1cblx0XVxuKVxuXG5cblxuXG5cblxuIl19