var slice = [].slice;

(function(_this) {
  return (function() {
    var _s$m;
    _s$m = function(m, c, l, _s$m) {
      _s$m = function(r) {
        if (l[r]) {
          return c[r];
        } else {
          return (l[r]=1,c[r]={},c[r]=m[r](c[r]));
        }
      };
      m[3] = function(exports){
			var module = {exports:exports};
			var slice = [].slice;
			
			(function() {
			  var _sim_1b26b, extend;
			  _sim_1b26b = (function(_this) {
			    return function(exports) {
			      var module = {exports:exports};
			      var build, extend, modifiers, normalizeKeys, simpleClone;
			      extend = (function(exports) {
			        var module = {exports:exports};
			        var isArray, isObject, shouldSkipDeep;
			        isArray = function(target) {
			          return Array.isArray(target);
			        };
			        isObject = function(target) {
			          return target && typeof target === 'object';
			        };
			        shouldSkipDeep = function(target, options) {
			          if (options.notDeep) {
			            return options.notDeep.indexOf(target) !== -1;
			          } else {
			            return false;
			          }
			        };
			        module.exports = extend = function(options, target, sources) {
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
			                if (sourceValue === target || sourceValue === void 0 || (sourceValue === null && !options.allowNull) || (options.keys && options.keys.indexOf(key) === -1) || (options.notKeys && options.notKeys.indexOf(key) !== -1) || (options.own && !source.hasOwnProperty(key)) || (options.globalFilter && !options.globalFilter(sourceValue, key, source)) || (options.filters && options.filters[key] && !options.filters[key](sourceValue, key, source))) {
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
			                  case !(options.deep && isObject(sourceValue) && !shouldSkipDeep(key, options)):
			                    subTarget = isObject(targetValue) ? targetValue : isArray(sourceValue) ? [] : {};
			                    target[key] = extend(options, subTarget, [sourceValue]);
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
			      })({});
			      simpleClone = function(source) {
			        var key, output, value;
			        output = {};
			        for (key in source) {
			          value = source[key];
			          output[key] = value;
			        }
			        return output;
			      };
			      normalizeKeys = function(keys) {
			        if (!keys) {
			          return;
			        }
			        if (typeof keys === 'object' && !Array.isArray(keys)) {
			          return Object.keys(keys);
			        }
			        return [].concat(keys);
			      };
			      build = function(options) {
			        var builder;
			        if (options.target) {
			          builder = function() {
			            var sources;
			            sources = 1 <= arguments.length ? slice.call(arguments, 0) : [];
			            return extend(builder.options, builder.options.target, sources);
			          };
			        } else {
			          builder = function() {
			            var sources, target;
			            target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
			            return extend(builder.options, target, sources);
			          };
			        }
			        builder.options = options;
			        Object.defineProperties(builder, modifiers);
			        return builder;
			      };
			      modifiers = {
			        'deep': {
			          get: function() {
			            var newOptions;
			            newOptions = simpleClone(this.options);
			            newOptions.deep = true;
			            return build(newOptions);
			          }
			        },
			        'own': {
			          get: function() {
			            var newOptions;
			            newOptions = simpleClone(this.options);
			            newOptions.own = true;
			            return build(newOptions);
			          }
			        },
			        'allowNull': {
			          get: function() {
			            var newOptions;
			            newOptions = simpleClone(this.options);
			            newOptions.allowNull = true;
			            return build(newOptions);
			          }
			        },
			        'concat': {
			          get: function() {
			            var newOptions;
			            newOptions = simpleClone(this.options);
			            newOptions.concat = true;
			            return build(newOptions);
			          }
			        },
			        'clone': {
			          get: function() {
			            var newOptions;
			            newOptions = simpleClone(this.options);
			            newOptions.target = {};
			            return build(newOptions);
			          }
			        },
			        'notDeep': {
			          get: function() {
			            var newOptions;
			            newOptions = simpleClone(this.options);
			            return function(keys) {
			              newOptions.notDeep = normalizeKeys(keys);
			              return build(newOptions);
			            };
			          }
			        },
			        'keys': {
			          get: function() {
			            var newOptions;
			            newOptions = simpleClone(this.options);
			            return function(keys) {
			              newOptions.keys = normalizeKeys(keys);
			              return build(newOptions);
			            };
			          }
			        },
			        'notKeys': {
			          get: function() {
			            var newOptions;
			            newOptions = simpleClone(this.options);
			            return function(keys) {
			              newOptions.notKeys = normalizeKeys(keys);
			              return build(newOptions);
			            };
			          }
			        },
			        'transform': {
			          get: function() {
			            var newOptions;
			            newOptions = simpleClone(this.options);
			            return function(transform) {
			              if (typeof transform === 'function') {
			                newOptions.globalTransform = transform;
			              } else if (transform && typeof transform === 'object') {
			                newOptions.transforms = transform;
			              }
			              return build(newOptions);
			            };
			          }
			        },
			        'filter': {
			          get: function() {
			            var newOptions;
			            newOptions = simpleClone(this.options);
			            return function(filter) {
			              if (typeof filter === 'function') {
			                newOptions.globalFilter = filter;
			              } else if (filter && typeof filter === 'object') {
			                newOptions.filters = filter;
			              }
			              return build(newOptions);
			            };
			          }
			        }
			      };
			      module.exports = build({});
			      return module.exports;
			    };
			  })(this)({});
			  extend = _sim_1b26b;
			  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
			    module.exports = extend;
			  } else if (typeof define === 'function' && define.amd) {
			    define(['smart-extend'], function() {
			      return extend;
			    });
			  } else {
			    window.extend = extend;
			  }
			})();
			
			return module.exports;
		};
      m[4] = function(exports) {
        var module = {exports:exports};
        var IS;
        IS = module.exports = {
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
            return IS.object(subject) && Object.prototype.toString.call(subject) === '[object Object]';
          },
          string: function(subject) {
            return typeof subject === 'string';
          },
          number: function(subject) {
            return typeof subject === 'number';
          },
          "function": function(subject) {
            return typeof subject === 'function';
          },
          iterable: function(subject) {
            return IS.object(subject) && IS.number(subject.length);
          }
        };
        return module.exports;
      };
      return _s$m;
    };
    _s$m = _s$m({}, {}, {});
    return (function() {

      /* istanbul ignore next */
      var COLOR_BLACK, COLOR_GREEN, COLOR_GREY, COLOR_GREY_LIGHT, COLOR_ORANGE, COLOR_RED, DOM, Dropdown, Field, IS, Mask, QuickField, REQUIRED_FIELD_METHODS, SVG, SimplyBind, _sim_1c2a4, _sim_290f8, _sim_29da7, _sim_2d7e9, _sim_300b4, animations, appendAnimationStyles, currentID, extend, helpers, prefix, regex, stringDistance, testChar, textField, validPatternChars;
      _sim_2d7e9 = (function(_this) {
        return function(exports) {
          var module = {exports:exports};
          (function() {
            var CSS, IS, QuickBatch, QuickDom, QuickElement, QuickTemplate, _sim_296d8, _sim_2dca8, allowedTemplateOptions, configSchema, extend, extendOptions, fn, getParents, helpers, i, len, parseErrorPrefix, parseTree, pholderRegex, shortcut, shortcuts, svgNamespace;
            svgNamespace = 'http://www.w3.org/2000/svg';

            /* istanbul ignore next */
            _sim_296d8 = (function(exports){
					var module = {exports:exports};
					(function(){var l,m,n,k,e,f,h,p;k=["webkit","moz","ms","o"];f="backgroundPositionX backgroundPositionY blockSize borderWidth columnRuleWidth cx cy fontSize gridColumnGap gridRowGap height inlineSize lineHeight minBlockSize minHeight minInlineSize minWidth maxHeight maxWidth outlineOffset outlineWidth perspective shapeMargin strokeDashoffset strokeWidth textIndent width wordSpacing top bottom left right x y".split(" ");["margin","padding","border","borderRadius"].forEach(function(a){var b,c,d,e,g;
					f.push(a);e=["Top","Bottom","Left","Right"];g=[];c=0;for(d=e.length;c<d;c++)b=e[c],g.push(f.push(a+b));return g});p=document.createElement("div").style;l=/^\d+(?:[a-z]|\%)+$/i;m=/\d+$/;n=/\s/;h={includes:function(a,b){return a&&-1!==a.indexOf(b)},isIterable:function(a){return a&&"object"===typeof a&&"number"===typeof a.length&&!a.nodeType},isPropSupported:function(a){return"undefined"!==typeof p[a]},toTitleCase:function(a){return a[0].toUpperCase()+a.slice(1)},normalizeProperty:function(a){var b,
					c,d;if(this.isPropSupported(a))return a;d=this.toTitleCase(a);a=0;for(b=k.length;a<b;a++)if(c=k[a],c=""+c+d,this.isPropSupported(c))return c},normalizeValue:function(a,b){this.includes(f,a)&&null!==b&&(b=""+b,!m.test(b)||l.test(b)||n.test(b)||(b+="px"));return b}};e=function(a,b,c){var d,f,g;if(h.isIterable(a))for(d=0,f=a.length;d<f;d++)g=a[d],e(g,b,c);else if("object"===typeof b)for(d in b)c=b[d],e(a,d,c);else{b=h.normalizeProperty(b);if("undefined"===typeof c)return getComputedStyle(a)[b];b&&(a.style[b]=
					h.normalizeValue(b,c))}};e.version="1.0.5";return null!=("undefined"!==typeof module&&null!==module?module.exports:void 0)?module.exports=e:"function"===typeof define&&define.amd?define(["quickdom"],function(){return e}):this.Css=e})();
					
					return module.exports;
				}).call(this, {});
            CSS = _sim_296d8;

            /* istanbul ignore next */
            _sim_2dca8 = _s$m(3);
            extend = _sim_2dca8;
            allowedTemplateOptions = ['className', 'href', 'selected', 'type', 'name', 'id', 'checked'];
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
                case !IS.domNode(targetEl):
                  return QuickDom(targetEl);
                case !IS.string(targetEl):
                  return QuickDom.text(targetEl);
                default:
                  return targetEl;
              }
            };

            /* istanbul ignore next */
            IS = _s$m(4);
            IS = extend.clone(IS, {
              domEl: function(subject) {
                return subject && subject.nodeType === 1;
              },
              domText: function(subject) {
                return subject && subject.nodeType === 3;
              },
              domNode: function(subject) {
                return IS.domEl(subject) || IS.domText(subject);
              },
              quickDomEl: function(subject) {
                return subject instanceof QuickElement;
              },
              template: function(subject) {
                return subject instanceof QuickTemplate;
              }
            });
            QuickElement = function(type1, options1) {
              this.type = type1;
              this.options = options1;
              this.el = this.options.existing || (this.type === 'text' ? document.createTextNode(this.options.text) : this.type[0] === '*' ? document.createElementNS(svgNamespace, this.type.slice(1)) : document.createElement(this.type));
              if (this.type === 'text') {
                this.append = this.prepend = function() {};
              }
              this._parent = null;
              this._state = [];
              this._children = [];
              this._insertedCallbacks = [];
              this._eventCallbacks = {};
              this._normalizeOptions();
              this._applyOptions();
              this._attachStateEvents();
              return this.el._quickElement = this;
            };
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
              }
            });
            QuickElement.prototype.parentsUntil = function(filterFn) {
              return getParents(this, filterFn);
            };
            QuickElement.prototype.parentMatching = function(filterFn) {
              var nextParent;
              if (IS["function"](filterFn)) {
                nextParent = this.parent;
                while (nextParent) {
                  if (filterFn(nextParent)) {
                    return nextParent;
                  }
                  nextParent = nextParent.parent;
                }
              }
            };
            Object.defineProperties(QuickElement.prototype, {
              'children': {
                get: function() {
                  var child, i, len, ref;
                  if (this.el.childNodes.length !== this._children.length) {
                    this._children.length = 0;
                    ref = this.el.childNodes;
                    for (i = 0, len = ref.length; i < len; i++) {
                      child = ref[i];
                      this._children.push(QuickDom(child));
                    }
                  }
                  return this._children;
                }
              },
              'parent': {
                get: function() {
                  if (!this._parent || this._parent.el !== this.el.parentNode) {
                    this._parent = QuickDom(this.el.parentNode);
                  }
                  return this._parent;
                }
              },
              'parents': {
                get: function() {
                  return getParents(this);
                }
              },
              'next': {
                get: function() {
                  return QuickDom(this.el.nextSibling);
                }
              },
              'prev': {
                get: function() {
                  return QuickDom(this.el.previousSibling);
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
              }
            });
            getParents = function(targetEl, filterFn) {
              var nextParent, parents;
              if (!IS["function"](filterFn)) {
                filterFn = void 0;
              }
              parents = [];
              nextParent = targetEl.parent;
              while (nextParent) {
                parents.push(nextParent);
                nextParent = nextParent.parent;
                if (filterFn && filterFn(nextParent)) {
                  nextParent = null;
                }
              }
              return parents;
            };
            QuickElement.prototype._normalizeOptions = function() {
              var base, base1, base2;
              if ((base = this.options).style == null) {
                base.style = {};
              }
              this.options.styleShared = {};
              if (this.options["class"]) {
                this.options.className = this.options["class"];
              }
              if (this.options.url) {
                this.options.href = this.options.url;
              }
              if ((base1 = this.options).relatedInstance == null) {
                base1.relatedInstance = this;
              }
              if ((base2 = this.options).passStateToChildren == null) {
                base2.passStateToChildren = true;
              }
              this.options.stateTriggers = extend.deep({
                'hover': {
                  on: 'mouseenter',
                  off: 'mouseleave'
                },
                'focus': {
                  on: 'focus',
                  off: 'blur'
                }
              }, this.options.stateTriggers);
              this._normalizeStyle();
              return this;
            };
            QuickElement.prototype._normalizeStyle = function() {
              var checkInnerStates, i, keys, len, nonStateProps, specialStates, state, states;
              keys = Object.keys(this.options.style);
              states = keys.filter(function(key) {
                return key[0] === '$';
              });
              specialStates = helpers.removeItem(states.slice(), '$base');
              this.providedStates = states.map(function(state) {
                return state.slice(1);
              });
              if (!helpers.includes(states, '$base') && keys.length) {
                if (states.length) {
                  nonStateProps = keys.filter(function(property) {
                    return property[0] !== '$';
                  });
                  this.options.style.$base = extend.clone.keys(nonStateProps)(this.options.style);
                } else {
                  this.options.style = {
                    $base: this.options.style
                  };
                }
              }
              checkInnerStates = (function(_this) {
                return function(styleObject, parentStates) {
                  var i, innerState, innerStates, len, results1, stateChain;
                  innerStates = Object.keys(styleObject).filter(function(key) {
                    return key[0] === '$';
                  });
                  if (innerStates.length) {
                    _this.hasSharedStateStyle = true;
                    results1 = [];
                    for (i = 0, len = innerStates.length; i < len; i++) {
                      innerState = innerStates[i];
                      stateChain = parentStates.concat(innerState.slice(1));
                      _this.options.styleShared[stateChain.join('+')] = styleObject[innerState];
                      checkInnerStates(styleObject[innerState], stateChain);
                      results1.push(delete styleObject[innerState]);
                    }
                    return results1;
                  }
                };
              })(this);
              for (i = 0, len = specialStates.length; i < len; i++) {
                state = specialStates[i];
                checkInnerStates(this.options.style[state], [state.slice(1)]);
              }
              return this;
            };
            QuickElement.prototype._applyOptions = function() {
              var applyBaseStylesOnInsert, key, ref, ref1, value;
              if (this.options.id) {
                this.el.id = this.options.id;
              }
              if (this.options.className) {
                this.el.className = this.options.className;
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
                ref = this.options.props;
                for (key in ref) {
                  value = ref[key];
                  this.prop(key, value);
                }
              }
              if (this.options.attrs) {
                ref1 = this.options.attrs;
                for (key in ref1) {
                  value = ref1[key];
                  this.attr(key, value);
                }
              }
              if (!this.options.styleAfterInsert) {
                this.style(this.options.style.$base);
              } else {
                this.onInserted(applyBaseStylesOnInsert = (function(_this) {
                  return function() {
                    var lastParent;
                    lastParent = _this.parents.slice(-1)[0];
                    if (lastParent.raw === document.documentElement) {
                      return _this.style(extend.clone.apply(extend, [_this.options.style.$base].concat(slice.call(_this._getStateStyles(_this._getActiveStates())))));
                    } else {
                      return lastParent.onInserted(applyBaseStylesOnInsert);
                    }
                  };
                })(this));
              }
              Object.defineProperty(this, '_parent', {
                set: function(newParent) {
                  var callback, i, len, ref2;
                  if (newParent) {
                    delete this._parent;
                    this._parent = newParent;
                    ref2 = this._insertedCallbacks;
                    for (i = 0, len = ref2.length; i < len; i++) {
                      callback = ref2[i];
                      callback(this);
                    }
                  }
                }
              });
              return this;
            };
            QuickElement.prototype._attachStateEvents = function() {
              var fn, ref, state, trigger;
              ref = this.options.stateTriggers;
              fn = (function(_this) {
                return function(state, trigger) {
                  var disabler, enabler;
                  enabler = IS.string(trigger) ? trigger : trigger.on;
                  if (IS.object(trigger)) {
                    disabler = trigger.off;
                  }
                  _this._listenTo(enabler, function() {
                    return _this.state(state, true);
                  });
                  if (disabler) {
                    return _this._listenTo(disabler, function() {
                      return _this.state(state, false);
                    });
                  }
                };
              })(this);
              for (state in ref) {
                trigger = ref[state];
                fn(state, trigger);
              }
              return this;
            };

            /* istanbul ignore next */
            QuickElement.prototype._listenTo = function(eventName, callback) {
              var eventNameToListenFor, listenMethod;
              listenMethod = this.el.addEventListener ? 'addEventListener' : 'attachEvent';
              eventNameToListenFor = this.el.addEventListener ? eventName : "on" + eventName;
              this.el[listenMethod](eventNameToListenFor, callback);
              return this;
            };
            QuickElement.prototype._getActiveStates = function(stateToExclude) {
              return this.providedStates.filter((function(_this) {
                return function(state) {
                  return helpers.includes(_this._state, state) && state !== stateToExclude;
                };
              })(this));
            };
            QuickElement.prototype._getStateStyles = function(states) {
              return states.map((function(_this) {
                return function(state) {
                  return _this.options.style['$' + state];
                };
              })(this));
            };
            QuickElement.prototype.on = function(eventName, callback) {
              if (IS.string(eventName) && IS["function"](callback)) {
                if (!this._eventCallbacks[eventName]) {
                  this._eventCallbacks[eventName] = [];
                  this._listenTo(eventName, (function(_this) {
                    return function(event) {
                      var i, len, ref;
                      ref = _this._eventCallbacks[eventName];
                      for (i = 0, len = ref.length; i < len; i++) {
                        callback = ref[i];
                        callback.call(_this.el, event);
                      }
                    };
                  })(this));
                }
                this._eventCallbacks[eventName].push(callback);
              }
              return this;
            };
            QuickElement.prototype.off = function(eventName, callback) {
              if (!IS.string(eventName)) {
                for (eventName in this._eventCallbacks) {
                  this.off(eventName);
                }
              } else if (this._eventCallbacks[eventName]) {
                if (IS["function"](callback)) {
                  helpers.removeItem(this._eventCallbacks[eventName], callback);
                } else {
                  this._eventCallbacks[eventName].length = 0;
                }
              }
              return this;
            };
            QuickElement.prototype.emit = function(eventName, bubbles, cancelable) {
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
                this.el.dispatchEvent(event);
              }
              return this;
            };
            QuickElement.prototype.onInserted = function(callback, invokeIfInserted) {
              if (invokeIfInserted == null) {
                invokeIfInserted = true;
              }
              if (IS["function"](callback)) {
                if (!this._parent) {
                  this._insertedCallbacks.push(callback);
                } else if (invokeIfInserted) {
                  callback(this);
                }
                return this;
              }
            };
            QuickElement.prototype.updateOptions = function(options) {
              if (IS.object(options)) {
                this.options = options;
                this._normalizeOptions();
                this._applyOptions(this.options);
              }
              return this;
            };
            QuickElement.prototype.state = function(targetState, value) {
              var activeStateStyles, activeStates, child, desiredValue, i, inferiorStateChains, isApplicable, j, len, len1, ref, sharedStyles, split, stateChain, stylesToKeep, stylesToRemove, superiorStateStyles, superiorStates, targetStateIndex, targetStyle;
              if (arguments.length === 1) {
                return helpers.includes(this._state, targetState);
              } else if (IS.string(targetState)) {
                if (targetState[0] === '$') {
                  targetState = targetState.slice(1);
                }
                desiredValue = !!value;
                if (targetState === 'base') {
                  return this;
                }
                activeStates = this._getActiveStates(targetState);
                activeStateStyles = this._getStateStyles(activeStates);
                if (this.state(targetState) !== desiredValue) {
                  if (this.options.style['$' + targetState]) {
                    targetStyle = this.options.style['$' + targetState];
                    targetStateIndex = this.providedStates.indexOf(targetState);
                    superiorStates = activeStates.filter((function(_this) {
                      return function(state) {
                        return _this.providedStates.indexOf(state) > targetStateIndex;
                      };
                    })(this));
                    superiorStateStyles = this._getStateStyles(superiorStates);
                  }
                  if (desiredValue) {
                    this._state.push(targetState);
                    if (targetStyle) {
                      this.style(extend.clone.keys(targetStyle).apply(null, [targetStyle].concat(slice.call(superiorStateStyles))));
                    }
                  } else {
                    helpers.removeItem(this._state, targetState);
                    if (targetStyle) {
                      stylesToKeep = extend.clone.keys(targetStyle).apply(null, [this.options.style.$base].concat(slice.call(activeStateStyles)));
                      stylesToRemove = extend.transform(function() {
                        return null;
                      }).clone(targetStyle);
                      this.style(extend(stylesToRemove, stylesToKeep));
                    }
                  }
                }
                if (this.hasSharedStateStyle) {
                  sharedStyles = Object.keys(this.options.styleShared);
                  sharedStyles = sharedStyles.filter(function(stateChain) {
                    return helpers.includes(stateChain, targetState);
                  });
                  for (i = 0, len = sharedStyles.length; i < len; i++) {
                    stateChain = sharedStyles[i];
                    split = stateChain.split('+');
                    isApplicable = split.length === split.filter((function(_this) {
                      return function(state) {
                        return state === targetState || _this.state(state);
                      };
                    })(this)).length;
                    if (isApplicable) {
                      targetStyle = this.options.styleShared[stateChain];
                      if (desiredValue) {
                        inferiorStateChains = this.options.styleShared[helpers.removeItem(split, targetState).join('+')];
                        this.style(extend.clone(inferiorStateChains, targetStyle));
                      } else {
                        stylesToKeep = extend.clone.keys(targetStyle).apply(null, [this.options.style.$base].concat(slice.call(activeStateStyles)));
                        stylesToRemove = extend.transform(function() {
                          return null;
                        }).clone(targetStyle);
                        this.style(extend(stylesToRemove, stylesToKeep));
                      }
                    }
                  }
                }
                if (this.options.passStateToChildren) {
                  ref = this._children;
                  for (j = 0, len1 = ref.length; j < len1; j++) {
                    child = ref[j];
                    child.state(targetState, value);
                  }
                }
                return this;
              }
            };
            QuickElement.prototype.resetState = function() {
              var activeState, i, len, ref;
              ref = this._state.slice();
              for (i = 0, len = ref.length; i < len; i++) {
                activeState = ref[i];
                this.state(activeState, false);
              }
              return this;
            };
            QuickElement.prototype.style = function() {
              var args, returnValue;
              if (this.type === 'text') {
                return;
              }
              args = arguments;
              if (IS.string(args[0])) {
                returnValue = CSS(this.el, args[0], args[1]);
                if (!IS.defined(args[1])) {
                  return returnValue;
                }
              } else if (IS.object(args[0])) {
                CSS(this.el, extend.allowNull.transform((function(_this) {
                  return function(value) {
                    if (typeof value === 'function') {
                      return value.call(_this, _this.options.relatedInstance);
                    } else {
                      return value;
                    }
                  };
                })(this)).clone(args[0]));
              }
              return this;
            };
            Object.defineProperty(QuickElement.prototype, 'rect', {
              get: function() {
                return this.el.getBoundingClientRect();
              }
            });
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
                  targetEl.parent;
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
                  targetEl.parent;
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
            QuickElement.prototype.html = function(newValue) {
              if (!IS.defined(newValue)) {
                return this.el.innerHTML;
              }
              this.el.innerHTML = newValue;
              return this;
            };
            QuickElement.prototype.text = function(newValue) {
              if (!IS.defined(newValue)) {
                return this.el.textContent;
              }
              this.el.textContent = newValue;
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
                  targetEl.parent;
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
                  targetEl.parent;
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
              for (eventName in this._eventCallbacks) {
                this._eventCallbacks[eventName].length = 0;
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
                }
              }
              return this;
            };
            QuickElement.prototype._removeChild = function(targetChild, replacementChild) {
              var indexOfChild;
              indexOfChild = this._children.indexOf(targetChild);
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
            QuickDom = function() {
              var args, child, children, element, i, len, options, type;
              args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
              switch (false) {
                case !IS.template(args[0]):
                  return args[0].spawn();
                case !IS.quickDomEl(args[0]):
                  if (args[1]) {
                    return args[0].updateOptions(args[1]);
                  } else {
                    return args[0];
                  }
                case !IS.domNode(args[0]):
                  if (args[0]._quickElement) {
                    return args[0]._quickElement;
                  }
                  type = args[0].nodeName.toLowerCase().replace('#', '');
                  options = args[1] || {};
                  options.existing = args[0];
                  return new QuickElement(type, options);
                case !IS.string(args[0]):
                  type = args[0].toLowerCase();
                  if (type === 'text') {
                    options = IS.object(args[1]) ? args[1] : {
                      text: args[1] || ''
                    };
                  } else {
                    options = IS.object(args[1]) ? args[1] : {};
                  }
                  children = args.slice(2);
                  element = new QuickElement(type, options);
                  for (i = 0, len = children.length; i < len; i++) {
                    child = children[i];
                    if (IS.string(child)) {
                      child = QuickDom.text(child);
                    }
                    if (IS.template(child)) {
                      child = QuickDom(child);
                    }
                    if (IS.quickDomEl(child)) {
                      child.appendTo(element);
                    }
                  }
                  return element;
              }
            };
            QuickDom.template = function(tree) {
              return new QuickTemplate(tree, true);
            };
            QuickBatch = function(elements1, returnResults1) {
              this.elements = elements1;
              this.returnResults = returnResults1;
              this.elements = this.elements.map(function(el) {
                return QuickDom(el);
              });
              return this;
            };
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
            Object.keys(QuickElement.prototype).concat('css', 'replaceWith').forEach(function(method) {
              return QuickBatch.prototype[method] = function() {
                var element, results;
                results = this.lastResults = (function() {
                  var i, len, ref, results1;
                  ref = this.elements;
                  results1 = [];
                  for (i = 0, len = ref.length; i < len; i++) {
                    element = ref[i];
                    results1.push(element[method].apply(element, arguments));
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
            pholderRegex = /\{\{.+?\}\}/g;
            configSchema = {
              type: 'div',
              options: {},
              children: []
            };
            QuickTemplate = function(config, isTree) {
              this._config = isTree ? parseTree(config) : config;
              return this;
            };
            Object.keys(configSchema).forEach(function(key) {
              return Object.defineProperty(QuickTemplate.prototype, key, {
                get: function() {
                  return this._config[key];
                }
              });
            });
            QuickTemplate.prototype.spawn = function(newValues, globalOpts) {
              var opts;
              opts = extendOptions(this._config, newValues, globalOpts);
              return QuickDom.apply(null, [opts.type, opts.options].concat(slice.call(opts.children)));
            };
            QuickTemplate.prototype.extend = function(newValues, globalOpts) {
              return new QuickTemplate(extendOptions(this._config, newValues, globalOpts));
            };
            extendOptions = function(currentOpts, newOpts, globalOpts) {
              var currentChild, currentChildren, globalOptsTransform, i, index, newChild, newChildren, output, ref;
              if (globalOpts) {
                globalOptsTransform = {
                  options: function(opts) {
                    return extend(opts, globalOpts);
                  }
                };
              }
              output = extend.deep.notKeys('children').notDeep('relatedInstance').transform(globalOptsTransform).clone(currentOpts, newOpts);
              currentChildren = currentOpts.children || [];
              newChildren = (newOpts != null ? newOpts.children : void 0) || [];
              output.children = [];

              /* istanbul ignore next */
              for (index = i = 0, ref = Math.max(currentChildren.length, newChildren.length); 0 <= ref ? i < ref : i > ref; index = 0 <= ref ? ++i : --i) {
                currentChild = currentChildren[index];
                newChild = newChildren[index];
                if (IS.string(newChild)) {
                  newChild = {
                    type: 'text',
                    options: {
                      text: newChild
                    }
                  };
                }
                if (currentChild) {
                  output.children.push(currentChild.extend(newChild, globalOpts));
                } else {
                  output.children.push(new QuickTemplate(extend.deep.clone(configSchema, newChild)));
                }
              }
              return output;
            };
            parseTree = function(tree) {
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
                    output.options = tree[1] ? extend.deep.clone(tree[1]) : null;
                  }
                  output.children = tree.slice(2).map(QuickDom.template);
                  return output;
                case !(IS.string(tree) || IS.domText(tree)):
                  return {
                    type: 'text',
                    options: {
                      text: tree.textContent || tree
                    }
                  };
                case !IS.domEl(tree):
                  return {
                    type: tree.nodeName.toLowerCase(),
                    options: extend.clone.keys(allowedTemplateOptions)(tree),
                    children: [].map.call(tree.childNodes, QuickDom.template)
                  };
                case !IS.quickDomEl(tree):
                  return {
                    type: tree.type,
                    options: extend.clone.deep.notKeys('relatedInstance')(tree.options),
                    children: tree.children.map(QuickDom.template)
                  };
                case !IS.template(tree):
                  return extendOptions(tree._config);
                default:
                  throw new Error(parseErrorPrefix + " (array || string || domEl || quickDomEl || template), got " + (String(tree)));
              }
            };
            parseErrorPrefix = 'Template Parse Error: expected';
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
            QuickDom.version = '1.0.8';

            /* istanbul ignore next */
            if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
              return module.exports = QuickDom;
            } else if (typeof define === 'function' && define.amd) {
              return define(['quickdom'], function() {
                return QuickDom;
              });
            } else {
              return this.Dom = QuickDom;
            }
          })();
          return module.exports;
        };
      })(this)({});
      DOM = _sim_2d7e9;

      /* istanbul ignore next */
      _sim_300b4 = (function(exports){
			var module = {exports:exports};
			/* eslint-disable no-nested-ternary */
			'use strict';
			var arr = [];
			var charCodeCache = [];
			
			module.exports = function (a, b) {
				if (a === b) {
					return 0;
				}
			
				var aLen = a.length;
				var bLen = b.length;
			
				if (aLen === 0) {
					return bLen;
				}
			
				if (bLen === 0) {
					return aLen;
				}
			
				var bCharCode;
				var ret;
				var tmp;
				var tmp2;
				var i = 0;
				var j = 0;
			
				while (i < aLen) {
					charCodeCache[i] = a.charCodeAt(i);
					arr[i] = ++i;
				}
			
				while (j < bLen) {
					bCharCode = b.charCodeAt(j);
					tmp = j++;
					ret = j;
			
					for (i = 0; i < aLen; i++) {
						tmp2 = bCharCode === charCodeCache[i] ? tmp : tmp + 1;
						tmp = arr[i];
						ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
					}
				}
			
				return ret;
			};
			
			return module.exports;
		}).call(this, {});
      stringDistance = _sim_300b4;

      /* istanbul ignore next */
      _sim_290f8 = _s$m(3);
      extend = _sim_290f8;

      /* istanbul ignore next */
      _sim_1c2a4 = _s$m(4);
      IS = _sim_1c2a4;

      /* istanbul ignore next */
      _sim_29da7 = (function(exports){
			var module = {exports:exports};
			!function(){var u,w,J,B,S,T,U,V,W,X,Y,Z,aa,ba,ca,da,ea,m,K,fa,C,n,L,D,E,g,ga,x,F,ha,y,t,ia,M,N,ja,G,ka,p,z,la,ma,na,H,I,O,P,Q,R,oa,r,k,A,pa,v;return ha=0,C="push pop shift unshift splice reverse sort".split(" "),ia={},n={},O=["{{","}}"],r=Object.create({silent:!1},{placeholder:{get:function(){return O},set:function(a){g.iA(a)&&2===a.length&&(O=a,R())}}}),y={throttle:!1,simpleSelector:!1,promiseTransforms:!1,dispatchEvents:!1,sendArrayCopies:!1,updateEvenIfSame:!1,updateOnBind:!0},D=null,E=function(){var a;return D||(a=D=document.createEvent("Event"),a.initEvent("change",!0,!1),a._sb=!0),D},t=Object.defineProperty,ma=Object.getOwnPropertyDescriptor,oa=function(a,b){return this.uAS(b||this)},ka=function(){return""+ ++ha},p=function(){return Object.create(null)},z=function(a,b){return function(c,d,e){return m(c,d,e,a,b)}},la=function(a,b){return a.sU||(a.sU=new u(function(){return b?a.sV(a.fDV(),a,!0):a.uAS(a)},"Func",{}))},k=function(a,b){return a&&-1!==a.indexOf(b)},g={iD:function(a){return void 0!==a},iA:function(a){return a instanceof Array},iO:function(a){return"object"==typeof a&&a},iS:function(a){return"string"==typeof a},iN:function(a){return"number"==typeof a},iF:function(a){return"function"==typeof a},iBI:function(a){return a instanceof w},iB:function(a){return a instanceof u},isI:function(a){return g.iO(a)&&g.iN(a.length)},DM:function(a){return a.nodeName&&1===a.nodeType},dI:function(a){return a=a.nodeName,"INPUT"===a||"TEXTAREA"===a||"SELECT"===a},dR:function(a){return"radio"===a.type},dC:function(a){return"checkbox"===a.type},eC:function(a){return a instanceof NodeList||a instanceof HTMLCollection||g.iD(jQuery)&&a instanceof jQuery},eAS:function(a){var b;return b=a[0].type,[].filter.call(a,function(a){return a.type===b}).length===a.length}},x=function(a,b,c){var d,e,f,h,l,k,m,q;a.OD||(a.OD=ma(b,a.pr)),c?C.forEach(function(c){return t(b,c,{configurable:!0,value:function(){var d;return d=Array.prototype[c].apply(b,arguments),a.uAS(a),d}})}):"Proxy"===a.type?(e=a.oR=a.value,a.value={result:null,args:null},g.iF(e)&&(m=[].slice,d=l=function(){var c;return c=m.call(arguments),a.value.args=c=a.tfS?a.tfS(c):c,a.value.result=c=e.apply(b,c),a.uAS(a),c},t(b,a.pr,{configurable:a.isL=!0,get:function(){return d},set:function(b){g.iF(b)?b!==e&&(b!==l&&(e=a.oR=b),d!==l&&(d=l)):d=b}}))):(c=a.OD||ia,c.get&&(f=c.get.bind(b)),c.set&&(h=c.set.bind(b)),(k=(k=c.configurable)&&b.constructor!==CSSStyleDeclaration)&&(q="Array"===a.type,t(b,a.pr,{configurable:a.isL=!0,enumerable:c.enumerable,get:f||function(){return a.value},set:h?function(b){h(b),a.sV(b,a,!q)}:function(b){a.sV(b,a,!q)}}),q&&x(a,b[a.pr],!0)))},F=function(a,b,c){var d,e;if(c){for(e=[],a=0,c=C.length;a<c;a++)d=C[a],e.push(delete b[d]);return e}return c=a.OD,c.set||c.get||(c.value=a.oR||a.value),t(b,a.pr,c)},ga=function(a){var b,c;b=p();for(c in a)b[c]=a[c];return b},G=function(a,b){var c,d,e,f;for(f=Object.keys(b),c=0,e=f.length;c<e;c++)d=f[c],a[d]=b[d]},L={get:function(a,b,c,d){return b?n[a._sb_ID]:d&&a[0]._sb_map&&(b=n[a[0]._sb_map[c]],b.gB)?b.gB:a._sb_map&&a._sb_map[c]?n[a._sb_map[c]]:void 0},set:function(a,b){var c,d;b?t(a.object,"_sb_ID",{configurable:!0,value:a.ID}):(d=a.se,a.object._sb_map?a.object._sb_map[d]=a.ID:(c={},c[d]=a.ID,t(a.object,"_sb_map",{configurable:!0,value:c})))}},N=/[.*+?^${}()|[\]\\]/g,H=I=null,R=function(){var a,b,c;c=r.placeholder[0].replace(N,"\\$&"),a=r.placeholder[1].replace(N,"\\$&"),b="[^"+a+"]+",H=new RegExp(c+"("+b+")"+a,"g"),I=new RegExp(""+c+b+a,"g")},R(),fa=function(a,b,c){var d,e,f,h,g;for(g="",e=f=0,h=a.length;f<h;e=++f)d=a[e],g+=d,c[e]&&(g+=b[c[e]]);return g},K=function(a,b,c){null==a[c]&&(a[c]=[]),a[c].push(b)},Q=function(a,b){var c,d,e,f,h,g,k,m,q,p,n;for(c=Array.prototype.slice.call(a.childNodes),e=0,h=c.length;e<h;e++)if(q=c[e],3!==q.nodeType)Q(q,b);else if(q.textContent.match(I))if(n=q.textContent.split(H),3===n.length&&""===n[0]+n[2])K(b,q,n[1]);else{for(k=document.createDocumentFragment(),d=f=0,g=n.length;f<g;d=++f)p=n[d],m=k.appendChild(document.createTextNode(p)),d%2&&K(b,m,p);q.parentNode.replaceChild(k,q)}},A=function(a){throw Error("SimplyBind: "+(M[a]||a))},v=function(a,b){var c,d;r.silent||(c=na(b),d=M[a],console.warn("SimplyBind: "+(d+("\n\n"+c))))},pa=function(a){A("Invalid argument/s ("+a+")",!0)},na=function(a){return(Error().stack||"").split("\n").slice(a+3).join("\n")},M={erIP:"SimplyBind() and .to() only accept a function, an array, a bound object, a string, or a number.",erFN:"Only functions are allowed for .transform/.condition/All()",erEV:"Invalid argument number in .ofEvent()",emptyList:"Empty collection provided",erOD:"You can only pass a single DOM element to a binding",erMX:"'checked' of Mixed list of element cannot be bound"},m=function(a,b,c,d,e){return(a||0===a)&&(g.iS(a)||g.iN(a)||g.iF(a)||a instanceof Array)||g.iBI(a)||A("erIP"),!g.iO(a)||a instanceof Array?(b=new w(b),b.so=c,b.IS=d,b.cC=e,a=g.iF(a)?b.sS(a,!0):b.sP(a)):a=e?e(a):a.sC(),a},m.version="1.13.2",m.settings=r,m.defaultOptions=y,m.unBindAll=function(a,b){var c,d,e;if(a&&(g.iO(a)||g.iF(a))&&(g.isI(a)&&!a._sb_ID&&a[0]&&g.DM(a[0])&&(a=a[0]),e=a._sb_map,a._sb_ID&&n[a._sb_ID].rAS(b),e))for(d in e)c=e[d],n[c].rAS(b)},u=function(a,b,c){return G(this,c),this.oD=this.so?this.options:y,this.type=b,this.object=a,this.ID=ka(),this.subs=[],this.sM=p(),this.pM=p(),this.atEV=[],"Proxy"===this.type&&(this.sV=oa),this.mC&&(this.cH=p(),this.object.forEach(function(a){return function(b){var c;c=a.cH[b.value]=m("checked").of(b)._,c.aS(a),c.sM[a.ID].tF=function(){return c},c.gB=a}}(this))),"Event"===this.type||"Func"===this.type&&this.IS||("Pholder"===this.type?(b=this.de&&!k(this.de,"multi")?this.de+":"+this.pr:this.pr,a=this.pB=m(b).of(a)._,a.sPH(),this.value=a.pVL[this.Ph],a.txN&&(this.txN=a.txN[this.Ph])):(this.value=a=this.fDV(),"ObjectProp"!==this.type||g.iD(a)||(this.object[this.pr]=a),x(this,this.object))),this.aEV(),n[this.ID]=this},u.prototype={aS:function(a,b,c,d){var e,f,h,g;if(a.isMulti)for(h=a.bindings,a=0,f=h.length;a<f;a++)g=h[a],this.aS(g,b,c,d);else this.sM[a.ID]?e=!0:(a.pM[this.ID]=this,this.subs.unshift(a),f=this.sM[a.ID]=p(),f.uO=c,f.opts=ga(b),(d||"Event"===this.type||"Proxy"===this.type||"Array"===this.type)&&(f.opts.updateEvenIfSame=!0),f.VR="Func"===a.type?"ps":"value");return e},rS:function(a,b){var c,d,e,f;if(a.isMulti)for(e=a.bindings,c=0,d=e.length;c<d;c++)f=e[c],this.rS(f,b);else this.sM[a.ID]&&(this.subs.splice(this.subs.indexOf(a),1),delete this.sM[a.ID],delete a.pM[this.ID]),b&&(a.rS(this),delete this.pM[a.ID]);0===this.subs.length&&0===Object.keys(this.pM).length&&this.DES()},rAS:function(a){var b,c,d,e;for(d=this.subs.slice(),b=0,c=d.length;b<c;b++)e=d[b],this.rS(e,a)},DES:function(){var a,b,c,d;if(delete n[this.ID],this.rPI(),"Event"===this.type)for(d=this.atEV,b=0,c=d.length;b<c;b++)a=d[b],this.urEVE(a,this.cEM.listen);else"Func"===this.type&&delete this.object._sb_ID;this.isL&&F(this,this.object),"Array"===this.type&&F(this,this.value,!0),this.object._sb_map&&(delete this.object._sb_map[this.se],0===Object.keys(this.object._sb_map).length&&delete this.object._sb_map)},fDV:function(){var a,b,c,d,e;switch(e=this.type,!1){case"Func"!==e:return this.object();case"DOMAttr"!==e:return this.object.getAttribute(this.pr)||"";case!this.mC:d=[],c=this.cH;for(b in c)if(a=c[b],a.object.checked){if("DOMRadio"===e)return b;d.push(b)}return d;default:return this.object[this.pr]}},sV:function(a,b,c){var d,e,f,h,l;if(b||(b=this),this.tfS&&(a=this.tfS(a)),!c)switch(this.type){case"ObjectProp":this.isL||a===this.value||(this.object[this.pr]=a);break;case"Pholder":if(f=this.pB,f.pVL[this.Ph]=a,d=fa(f.pCT,f.pVL,f.pIM),this.txN&&a!==this.value)for(h=this.txN,e=0,c=h.length;e<c;e++)l=h[e],l.textContent=a;"textContent"!==this.pr&&f.sV(d,b);break;case"Array":a!==this.value&&(g.iA(a)||(a=Array.prototype.concat(a)),F(this,this.value,!0),x(this,a=a.slice(),!0));break;case"Func":d=this.ps,this.ps=a,a=this.object(a,d);break;case"Event":this.iE=!0,this.eE(a),this.iE=!1;break;case"DOMValue":a===this.value&&a===this.object.value||(this.tfS&&(f=this.object.selectionStart),this.object.value=a,f&&this.object.setSelectionRange(f,f),r.dispatchEvents&&this.object.dispatchEvent(E()));break;case"DOMRadio":if(this.mC)if(f=g.iB(a)?a:this.cH[a])for(e in a=f.object.value,d=this.cH)c=d[e],c.sV(c.ID===f.ID,b);else a=this.value;else{if(a=!!a,a===this.value)return;this.object.checked!==a&&(this.object.checked=a),a&&r.dispatchEvents&&this.object.dispatchEvent(E())}break;case"DOMCheckbox":if(this.mC){for(e=!g.iB(a),a=[].concat(a),c=f=0,h=a.length;f<h;c=++f)l=a[c],a[c]=g.iB(l)?l:this.cH[l];h=[],l=this.cH;for(d in l)c=l[d],f=e?k(a,c):c.value,c.sV(f,b),f&&h.push(d);a=h}else{if(a=!!a,a===this.value)return;this.object.checked!==a&&(this.object.checked=a,r.dispatchEvents&&this.object.dispatchEvent(E()))}break;case"DOMAttr":this.object.setAttribute(this.pr,a)}this.value=a,this.uAS(b)},uAS:function(a){var b,c;if(c=(b=this.subs).length)for(;c--;)this.uS(b[c],a)},uS:function(a,b){var c,d,e,f;if(!(b===a||b!==this&&b.sM[a.ID])){if(d=this.sM[a.ID],d.opts.throttle){if(c=+new Date,e=c-d.lU,e<d.opts.throttle)return clearTimeout(d.uT),d.uT=setTimeout(function(c){return function(){return c.uS(a,b)}}(this),d.opts.throttle-e);d.lU=c}c="Array"===this.type&&d.opts.sendArrayCopies?this.value.slice():this.value,e=a[d.VR],c=(f=d.tF)?f(c,e,a.object):c,c===e&&!d.opts.updateEvenIfSame||d.cN&&!d.cN(c,e,a.object)||(d.opts.promiseTransforms&&c&&g.iF(c.then)?c.then(function(c){a.sV(c,b)}):a.sV(c,b),d.uO&&this.rS(a))}},aM:function(a,b,c,d){var e,f,h,l;if(g.iF(c)){for(e=0,f=b.length;e<f;e++)h=b[e],l=h._||h,l.isMulti?this.aM(a,l.bindings,c,d):(h=this.sM[l.ID],h[a]=c,d=d&&!h.uO,this.pM[l.ID]&&(l.sM[this.ID][a]=c),!d&&"Func"!==this.type||"tF"!==a||this.uS(l,this));return!0}return v("erFN",2)},ss:function(a,b){this.tfS=a,b&&this.sV(this.value)},sPH:function(){var a;this.pVL||(this.pVL=p(),this.pIM=p(),this.pCT=[],g.iS(this.value)&&(this.pCT=this.value.split(I),a=0,this.value=this.value.replace(H,function(b){return function(c,d){return b.pIM[a++]=d,b.pVL[d]=d}}(this))),this.DM&&"textContent"===this.pr&&Q(this.object,this.txN=p()))},aPI:function(a){if("Event"!==this.type)return this.rPI(),this.PI=setInterval(function(a){return function(){var b;return b=a.fDV(),a.sV(b)}}(this),a)},rPI:function(){return clearInterval(this.PI),this.PI=null},aUV:function(a,b){this.object.addEventListener(a,function(a){return function(c){c._sb||(c=a.tfS&&a.dT,a.sV(a.object[b],null,!c))}}(this),!1)},aEV:function(){this.evN?this.rEVE(this.evN,this.cEM.listen):"DOMValue"===this.type?(this.aUV("input","value"),this.aUV("change","value")):this.mC||"DOMRadio"!==this.type&&"DOMCheckbox"!==this.type||this.aUV("change","checked")},rEVE:function(a,b){this.atEV.push(a),this.iEM(a,b||"addEventListener","addEventListener")},urEVE:function(a,b){this.atEV.splice(this.atEV.indexOf(a),1),this.iEM(a,b||"removeEventListener","removeEventListener")},iEM:function(a,b,c){var d;d=this.object,(this.DM&&g.iD(jQuery)&&"on"===b||"off"===b)&&(d=jQuery(this.object)),d[b]||(b=c),this.evH||(this.evH=ja.bind(this)),"function"==typeof d[b]&&d[b](a,this.evH)},eE:function(a){var b,c;return c=this.object,b=this.cEM.emit||"dispatchEvent",this.DM&&g.iD(jQuery)&&"trigger"===b&&(c=jQuery(this.object)),c[b]||(b="dispatchEvent"),"dispatchEvent"===b?(this.evO||(this.evO=document.createEvent("Event"),this.evO.initEvent(this.evN,!0,!0)),this.evO.bindingData=a,c[b](this.evO)):void c[b](this.evN,a)}},ja=function(){this.iE||this.sV(arguments[this.pr],null,!0)},w=function(a,b){var c;if(b)G(this,b),this.sG=1;else for(c in this.sG=0,this.subs=[],this.oP=a||(a={}),this.options={},y)this.options[c]=null!=a[c]?a[c]:y[c];return this},J={sC:function(){return new w(null,this)},dM:function(a){return this._=a,Object.defineProperties(this,{value:{get:function(){return a.value}},original:{get:function(){return a.objects||a.object}},subscribers:{get:function(){return a.subs.slice().map(function(a){return a.object})}}})},createBP:function(a,b,c,d){var e;return this.object=a,(e=L.get(a,d,this.se,this.mC))?this.patchCachedBP(e):(a=new u(a,b,c),L.set(a,d),a)},patchCachedBP:function(a){var b,c,d,e;if("ObjectProp"!==a.type||this.pr in this.object||x(a,this.object),this.so)for(c in d=this.oP)e=d[c],a.oD[c]=e;c=a.oD;for(b in c)e=c[b],this.options[b]=g.iD(this.oP[b])?this.oP[b]:e;return a},sP:function(a){var b;return g.iN(a)&&(a=a.toString()),this.se=this.pr=a,this.options.simpleSelector||(k(a,":")&&(b=a.split(":"),this.de=b.slice(0,-1).join(":"),this.pr=b[b.length-1]),k(a,".")&&(b=this.pr.split("."),this.pr=b[0],this.Ph=b.slice(1).join(".")),k(this.de,"event")&&(k(a,"#")?(b=this.pr.split("#"),this.evN=b[0],this.pr=b[1]):(this.evN=this.pr,this.pr=0),isNaN(parseInt(this.pr))&&v("erEV",1),this.cEM={listen:this.oP.listenMethod,emit:this.oP.emitMethod})),this},sS:function(a,b){var c,d,e,f,h;if(this.sG=1,h=(f=a!==window&&g.isI(a)&&!a.nodeType)?a[0]:a){if((this.DM=g.DM(h))&&("checked"===this.pr?(e=h&&g.dR(h),c=!e&&h&&g.dC(h)):"value"===this.pr&&(this.dT=(d=g.dI(h))&&k(h.type,"text")),f&&!k(this.de,"multi")))if(1===a.length)a=a[0];else{if((e||c)&&!g.eAS(a))return v("erMX",3);e||c?(this.mC=!0,a=[].slice.call(a)):(a=a[0],v("erOD",3))}}else f&&g.eC(a)&&A("emptyList");switch(!1){case!b:c="Func";break;case!this.Ph:c="Pholder";break;case!k(this.de,"array"):c="Array";break;case!k(this.de,"event"):c="Event";break;case!k(this.de,"func"):c="Proxy";break;case!d:c="DOMValue";break;case!e:c="DOMRadio";break;case!c:c="DOMCheckbox";break;case!k(this.de,"attr"):c="DOMAttr";break;default:c="ObjectProp"}return k(this.de,"multi")?(a.length||A("emptyList"),this.dM(new B(this,a,c))):this.dM(this.createBP(a,c,this,b)),k(this._.type,"Event")||k(this._.type,"Proxy")?this.options.updateOnBind=!1:k(this._.type,"Func")&&(this.options.updateOnBind=!0),this.cC?this.cC(this):this},aP:function(a){var b,c,d,e;if(a.sG=2,a.subs.push(this),b=a._.aS(this._,a.options,a.uO),a.uO)delete a.uO;else if(a.options.updateOnBind&&!b)if(this._.isMulti)for(e=this._.bindings,c=0,d=e.length;c<d;c++)b=e[c],a._.uS(b,a._);else a._.uS(this._,a._)}},w.prototype=Object.create(J,{of:{get:function(){if(!this.sG)return W}},set:{get:function(){if(this.sG)return Y}},chainTo:{get:function(){if(2===this.sG)return T}},transformSelf:{get:function(){if(1===this.sG)return da}},transform:{get:function(){if(2===this.sG)return ba}},transformAll:{get:function(){if(2===this.sG)return ca}},condition:{get:function(){if(2===this.sG)return U}},conditionAll:{get:function(){if(2===this.sG)return V}},bothWays:{get:function(){if(2===this.sG)return S}},unBind:{get:function(){if(2===this.sG)return ea}},pollEvery:{get:function(){if(this.sG)return X}},stopPolling:{get:function(){if(this.sG)return aa}},setOption:{get:function(){if(2===this.sG)return Z}},updateOn:{get:function(){var a;if(this.sG&&(a=this))return z(!1,function(b){return b._!==a._&&(a._.pM[b._.ID]=b._,b._.aS(la(a._,!0),b.options,!1,!0)),a})}},removeUpdater:{get:function(){var a,b;if(this.sG&&(b=this)&&(a=this._.sU))return z(!1,function(c){c._.sM[a.ID]&&(delete b._.pM[c._.ID],c._.rS(a))})}},to:{get:function(){var a;if(1===this.sG&&(a=this))return z(!0,function(b){return b._!==a._&&b.aP(a),a})}},and:{get:function(){var a,b;return b=this.sC(),2===this.sG?b:1===this.sG?(b._.isMulti||(a=b._,b._=b._=new B(b),b._.addBP(a)),z(!1,function(a){return b._.addBP(a._),b})):void 0}},once:{get:function(){var a;if(1===this.sG)return a=this.sC(),a.uO=!0,a}},update:{get:function(){return this.set}},twoWay:{get:function(){return this.bothWays}},pipe:{get:function(){return this.chainTo}}}),W=function(a){return g.iO(a)||g.iF(a)||pa(a),g.iBI(a)&&(a=a.object),this.sG=1,this.sS(a)},T=function(a,b,c){return m(this.subs[this.subs.length-1]).to(a,b,c)},Y=function(a){return this._.sV(a),this},da=function(a){return g.iF(a)?this._.ss(a,this.options.updateOnBind):v("erFN",1),this},ba=function(a){return this._.aM("tF",this.subs.slice(-1),a,this.options.updateOnBind),this},ca=function(a){return this._.aM("tF",this.subs,a,this.options.updateOnBind),this},U=function(a){return this._.aM("cN",this.subs.slice(-1),a),this},V=function(a){return this._.aM("cN",this.subs,a),this},S=function(a){var b,c,d,e,f,h;for(d=this.subs[this.subs.length-1],h=d._,c=this._.isMulti?this._.bindings:[this._],h.aS(this._,d.options),d=0,e=c.length;d<e;d++)b=c[d],f=b.sM[h.ID].tF,b=b.sM[h.ID].cN,(f||a)&&(f=g.iF(a)?a:f)&&!1!==a&&(h.sM[this._.ID].tF=f),b&&(h.sM[this._.ID].cN=b);return this},ea=function(a){var b,c,d,e;for(d=this.subs,b=0,c=d.length;b<c;b++)e=d[b],this._.rS(e._,a);return this},X=function(a){return this._.aPI(a),this},aa=function(){return this._.rPI(),this},Z=function(a,b){return this._.sM[this.subs[this.subs.length-1]._.ID].opts[a]=b,this},B=function(a,b,c){var d,e,f;if(a.se=a.se.slice(6),G(this,this.In=a),this.isMulti=!0,this.bindings=d=[],b)for(a=0,e=b.length;a<e;a++)f=b[a],this.addBP(f,c);return Object.defineProperties(this,{type:{get:function(){return d.map(function(a){return a.type})}},value:{get:function(){return d.map(function(a){return a.value})}}})},P=B.prototype=Object.create(J),Object.keys(u.prototype).forEach(function(a){return P[a]=function(b,c,d,e){var f,g,l,k;for(k=this.bindings,g=0,l=k.length;g<l;g++)f=k[g],"uS"===a&&(c=f),f[a](b,c,d,e)}}),P.addBP=function(a,b){this.bindings.push(b?this.createBP(a,b,this.In):a)},null!=("undefined"!=typeof module&&null!==module?module.exports:void 0)?module.exports=m:"function"==typeof define&&define.amd?define(["simplybind"],function(){return m}):this.SimplyBind=m}();
			
			return module.exports;
		}).call(this, {});
      SimplyBind = _sim_29da7;
      QuickField = function(options) {
        var fieldInstance;
        if (!IS.object(options)) {
          options = {};
        }
        if (options.type == null) {
          options.type = 'text';
        }
        if (!appendAnimationStyles.appended) {
          appendAnimationStyles();
        }
        fieldInstance = Object.create(Field[options.type].prototype);
        return Field.call(fieldInstance, options);
      };
      QuickField.registerField = function(type, fieldProto) {
        var func, i, len, method, outputProto, requiredMethod;
        if (IS.string(type) && IS.object(fieldProto)) {
          outputProto = Object.create(Field.prototype);
          for (method in fieldProto) {
            func = fieldProto[method];
            method = method[0] === '_' ? method.slice(1) : method;
            if (helpers.includes(REQUIRED_FIELD_METHODS, method) && method !== 'validate') {
              method = '_' + method;
            }
            outputProto[method] = func;
          }
          for (i = 0, len = REQUIRED_FIELD_METHODS.length; i < len; i++) {
            requiredMethod = REQUIRED_FIELD_METHODS[i];
            if (!outputProto['_' + requiredMethod] || outputProto[requiredMethod]) {
              throw new Error("Field Registration: '" + requiredMethod + "' is required in order to register the field");
            }
          }
          return Field[type] = outputProto;
        }
      };

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
      COLOR_RED = '#cc4820';
      COLOR_GREEN = '#72c322';
      COLOR_ORANGE = '#ff9c00';
      COLOR_BLACK = '#181818';
      COLOR_GREY = '#909090';
      COLOR_GREY_LIGHT = '#d3d3d3';
      REQUIRED_FIELD_METHODS = ['_construct', '_createElements', '_attachBindings', '_validate'];
      prefix = document.createElement('div').style.animation != null ? '' : '-webkit-';
      animations = "@" + prefix + "keyframes checkmarkAnimateSuccessTip { 0%, 54% { width: 0; left: 0px; top: 3px } 70% { width: 14px; left: -2px; top: 8px } 84% { width: 5px; left: 5px; top: 10px } 100% { width: 8px; left: 3px; top: 10px } } @" + prefix + "keyframes checkmarkAnimateSuccessLong { 0%, 65% { width: 0; right: 12px; top: 12px } 84% { width: 14px; right: 0px; top: 7px } 100% { width: 12px; right: 2px; top: 8px } } @" + prefix + "keyframes checkmarkAnimateError { 0%, 65% { " + prefix + "transform: scale(0.4); opacity: 0 } 84% { " + prefix + "transform: scale(1.15) } 100% { " + prefix + "transform: scale(1) } } @" + prefix + "keyframes checkmarkRotatePlaceholder { 0%, 5% { " + prefix + "transform: rotate(-45deg) } 12%, 100% { " + prefix + "transform: rotate(-405deg) } } @" + prefix + "keyframes fieldErrorShake { 0%, 50% { " + prefix + "transform: translateX(-10px) } 25%, 75% { " + prefix + "transform: translateX(10px) } 100% { " + prefix + "transform: translateX(0px) } }";
      appendAnimationStyles = function() {
        var styleElement;
        styleElement = document.createElement('style');
        styleElement.innerHTML = animations;
        document.body.appendChild(styleElement);
        return appendAnimationStyles.appended = styleElement;
      };
      SVG = {
        checkmark: DOM.template([
          '*svg', {
            attrs: {
              width: '12px',
              height: '12px',
              viewBox: '5 7 12 12'
            }
          }, [
            '*polyline', {
              attrs: {
                'stroke-width': '2',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                fill: 'none',
                points: '7 13.8888889 9.66666667 17 15 9'
              }
            }
          ]
        ])
      };
      IS.field = function(target) {
        return target instanceof Field;
      };
      IS.regex = function(target) {
        return target instanceof RegExp;
      };
      regex = {
        numeric: /^\d$/,
        letter: /^[a-zA-Z]$/,
        alphanumeric: /^[0-9A-Za-z\!#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\(\)\~\-]$/
      };
      helpers = {};
      helpers.includes = function(target, item) {
        return target && target.indexOf(item) !== -1;
      };
      helpers.removeItem = function(target, item) {
        var itemIndex;
        itemIndex = target.indexOf(item);
        if (itemIndex !== -1) {
          return target.splice(itemIndex, 1);
        }
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
      helpers.testCondition = function(condition) {
        var comparison, comparisonOperators, passedComparisons, targetValue;
        if (!condition || !condition.property || !condition.target) {
          throw new Error("Invalid condition provided: " + (JSON.stringify(condition)));
        }
        comparison = (function() {
          switch (false) {
            case !IS.objectPlain(condition.value):
              return condition.value;
            case !IS.regex(condition.value):
              return {
                '$regex': condition.value
              };
            default:
              return {
                '$eq': condition.value
              };
          }
        })();
        targetValue = (function() {
          var nestedObject, propertyChain;
          propertyChain = condition.property.split('.');
          switch (false) {
            case propertyChain.length !== 1:
              return condition.target[condition.property];
            case !IS.defined(condition.target[condition.property]):
              return condition.target[condition.property];
            default:
              nestedObject = condition.target;
              while (IS.object(nestedObject)) {
                nestedObject = nestedObject[propertyChain.pop()];
              }
              return nestedObject;
          }
        })();
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
      helpers.validateConditions = function(conditions) {
        var validConditions;
        validConditions = conditions.filter(function(condition) {
          return helpers.testCondition(condition);
        });
        return validConditions.length === conditions.length;
      };
      helpers.initConditions = function(instance, conditions, callback) {
        return setTimeout((function(_this) {
          return function() {
            conditions.forEach(function(condition) {
              var conditionTarget, targetProperty;
              conditionTarget = IS.string(condition.ID) ? instance.allFields[conditionTarget] : IS.field(condition.ID) ? condition.ID : void 0;
              if (conditionTarget) {
                condition.target = conditionTarget;
              } else {
                return console.warn("Condition target not found for the provided ID '" + condition.ID + "'", instance);
              }
              targetProperty = IS.array(conditionTarget['value']) ? 'array:value' : 'value';
              return SimplyBind(targetProperty, {
                updateOnBind: false
              }).of(conditionTarget).to(callback);
            });
            return callback();
          };
        })(this));
      };
      Dropdown = function(options1, field1) {
        var name;
        this.options = options1;
        this.field = field1;
        this.isOpen = false;
        this.settings = extend.deep.clone.keys(this._defaults).filter(this._settingFilters)(this._defaults, this.field.options.dropdownOptions);
        this.selected = this.settings.multiple ? [] : null;
        this.lastSelected = null;
        this.visibleOptionsCount = 0;
        this.els = {};
        for (name in this.options.templates) {
          this.options.templates[name] = extend({
            options: {
              relatedInstance: this
            }
          }, this.options.templates[name]);
        }
        this._createElements();
        this._attachBindings();
        return this;
      };
      Dropdown.prototype._templates = {
        container: DOM.template([
          'div', {
            style: {
              position: 'absolute',
              zIndex: 10,
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
                $hasVisibleOptions: {
                  display: 'block'
                }
              }
            }
          }
        ]),
        list: DOM.template([
          'div', {
            passStateToChildren: false,
            style: {
              overflow: 'scroll',
              overflowScrolling: 'touch'
            }
          }
        ]),
        option: DOM.template([
          'div', {
            style: {
              display: 'none',
              fontSize: '0',
              color: '#000000',
              userSelect: 'none',
              cursor: 'pointer',
              $visible: {
                display: 'block'
              },
              $hover: {
                color: '#ffffff',
                backgroundColor: '#4C96FF'
              }
            }
          }, DOM.template([
            'div', {
              style: {
                display: 'inline-block',
                width: '20px',
                lineHeight: function() {
                  return this.parent.raw.style.height;
                },
                fontSize: function() {
                  return this.parent.raw.style.height;
                },
                textAlign: 'center',
                color: 'inherit',
                stroke: 'currentColor',
                visibility: 'hidden',
                $selected: {
                  visibility: 'visible'
                }
              }
            }, SVG.checkmark
          ]), DOM.template([
            'div', {
              style: {
                display: 'inline-block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                wordWrap: 'normal',
                maxWidth: function() {
                  return "calc(100% - " + this.prev.raw.style.width + ")";
                },
                paddingRight: '10px',
                lineHeight: '20px',
                fontSize: '11px',
                fontFamily: 'system-ui',
                color: 'inherit',
                boxSizing: 'border-box'
              }
            }
          ])
        ]),
        help: DOM.template([
          'div', {
            style: {
              display: 'none',
              borderTop: '2px solid rgba(0,0,0,0.05)',
              padding: '3px 12px 2px',
              color: 'rgba(0,0,0,0.75)',
              fontWeight: '500',
              fontSize: '12px',
              $showHelp: {
                display: 'block'
              }
            }
          }
        ])
      };
      Dropdown.prototype._defaults = {
        maxHeight: 250,
        multiple: false,
        storeSelected: true,
        help: '',
        templates: {}
      };
      Dropdown.prototype._settingFilters = {
        maxHeight: function(value) {
          return IS.number(value);
        }
      };
      Dropdown.prototype._createElements = function() {
        var forceOpts;
        forceOpts = {
          relatedInstance: this,
          styleAfterInsert: true
        };
        this.els.container = this._templates.container.spawn(this.settings.templates.container, forceOpts);
        this.els.list = this._templates.list.spawn(this.settings.templates.list, forceOpts).appendTo(this.els.container);
        this.els.help = this._templates.help.spawn(this.settings.templates.help, forceOpts).appendTo(this.els.container);
        this.options.forEach((function(_this) {
          return function(option) {
            option.el = _this._templates.option.spawn({
              options: {
                props: {
                  'title': option.label
                }
              }
            }, forceOpts).appendTo(_this.els.list);
            option.el.children[1].text(option.label);
            option.visible = true;
            option.selected = false;
            return option.unavailable = false;
          };
        })(this));
      };
      Dropdown.prototype._attachBindings = function() {
        SimplyBind('help').of(this.settings).to('textContent').of(this.els.help.raw).and.to((function(_this) {
          return function(showHelp) {
            return _this.els.help.state('showHelp', showHelp);
          };
        })(this));
        SimplyBind('visibleOptionsCount').of(this).to((function(_this) {
          return function(count) {
            return _this.els.container.state('hasVisibleOptions', !!count);
          };
        })(this));
        SimplyBind('isOpen', {
          updateOnBind: false
        }).of(this).to((function(_this) {
          return function(isOpen) {
            return _this.els.container.state('isOpen', isOpen);
          };
        })(this)).and.to((function(_this) {
          return function(isOpen) {
            var clippingParent, clippingRect, cutoff, padding, selfRect, targetMaxHeight;
            if (isOpen) {
              targetMaxHeight = _this.settings.maxHeight;
              clippingParent = _this.els.container.parentMatching(function(parent) {
                return parent.style('overflow') !== 'visible';
              });
              if (clippingParent) {
                selfRect = _this.els.container.rect;
                clippingRect = clippingParent.rect;
                cutoff = (selfRect.top + _this.settings.maxHeight) - clippingRect.bottom;
                if (selfRect.top >= clippingRect.bottom) {
                  console.warn("The dropdown for element '" + _this.field.ID + "' cannot be displayed as it's hidden by the parent overflow");
                } else if (cutoff > 0) {
                  padding = selfRect.height - _this.els.list.rect.height;
                  targetMaxHeight = cutoff - padding;
                }
              }
              _this.els.list.style('maxHeight', targetMaxHeight);
              return _this.els.list.style('minWidth', parseFloat(_this.field.els.input.style('width')) + 10);
            }
          };
        })(this));
        SimplyBind('lastSelected', {
          updateOnBind: false,
          updateEvenIfSame: true
        }).of(this).to((function(_this) {
          return function(newOption, prevOption) {
            if (_this.settings.storeSelected) {
              newOption.selected = true;
              if (prevOption) {
                prevOption.selected = false;
              }
              if (_this.settings.multiple) {
                _this.selected.push(newOption);
                helpers.removeItem(_this.selected, prevOption);
              } else {
                _this.selected = newOption;
              }
            }
            return _this.selectedCallback(newOption, prevOption);
          };
        })(this));
        return this.options.forEach((function(_this) {
          return function(option) {
            var ref;
            SimplyBind('visible').of(option).to(function(visible) {
              return option.el.state('visible', visible);
            }).and.to(function(visible) {
              return _this.visibleOptionsCount += visible ? 1 : -1;
            });
            SimplyBind('selected', {
              updateOnBind: false
            }).of(option).to(function(selected) {
              return option.el.state('selected', selected);
            });
            SimplyBind('unavailable').of(option).to(function(unavailable) {
              return option.el.state('unavailable', unavailable);
            }).and.to(function() {
              option.selected = false;
              return _this.selected = null;
            }).condition(function(unavailable) {
              return unavailable && _this.settings.multiple && option.selected;
            });
            SimplyBind('event:click', {
              listenMethod: 'on'
            }).of(option.el).to(function() {
              return _this.lastSelected = option;
            });
            if ((ref = option.conditions) != null ? ref.length : void 0) {
              option.unavailable = true;
              option.allFields = _this.field.allFields;
              return helpers.initConditions(option, option.conditions, function() {
                return option.unavailable = !helpers.validateConditions(option.conditions);
              });
            }
          };
        })(this));
      };
      Dropdown.prototype.appendTo = function(target) {
        return this.els.container.appendTo(target);
      };
      Dropdown.prototype.onSelected = function(callback) {
        return this.selectedCallback = callback;
      };
      validPatternChars = ['1', 'a', 'A', '*', '#'];
      Mask = function(pattern, placeholder1) {
        this.pattern = pattern;
        this.placeholder = placeholder1;
        this.minRequiredCount = 0;
        this.optionalsOffset = 0;
        this.lastValid = null;
        this.valid = false;
        this.value = '';
        this.valueRaw = '';
        this.valueStrict = '';
        this.prev = {};
        this.literals = [];
        this.optionals = [];
        this.repeatables = [];
        this._normalizePattern();
        this.setValue('');
        return this;
      };
      Mask.prototype._normalizePattern = function() {
        var firstNonLiteral, isLiteral, isOptional, minRequiredCount, offset, outputPattern, patternChar, patternPos;
        outputPattern = '';
        minRequiredCount = 0;
        patternPos = 0;
        offset = 0;
        firstNonLiteral = 0;
        while (patternPos < this.pattern.length) {
          patternChar = this.pattern[patternPos];
          switch (false) {
            case !isLiteral:
              isLiteral = false;
              this.literals.push(patternPos - offset);
              outputPattern += patternChar;
              if (minRequiredCount === 0) {
                firstNonLiteral++;
              }
              break;
            case patternChar !== '\\':
              isLiteral = true;
              offset++;
              break;
            case patternChar !== '[':
              isOptional = true;
              offset++;
              break;
            case patternChar !== ']':
              isOptional = false;
              offset++;
              break;
            case patternChar !== '+':
              offset++;
              break;
            default:
              if (!helpers.includes(validPatternChars, patternChar)) {
                this.literals.push(patternPos - offset);
                if (minRequiredCount === 0) {
                  firstNonLiteral++;
                }
              } else if (isOptional) {
                this.optionals.push(patternPos - offset);
              } else if (this.pattern[patternPos + 1] === '+') {
                this.repeatables.push(patternPos - offset);
                minRequiredCount++;
              } else {
                minRequiredCount++;
              }
              outputPattern += patternChar;
          }
          patternPos++;
        }
        this.minRequiredCount = minRequiredCount;
        this.firstNonLiteral = firstNonLiteral;
        return this.pattern = outputPattern;
      };
      Mask.prototype.setValue = function(input) {
        var changeDistance, changeIndex, inputChar, inputPos, isBackwards, isLiteral, isOptional, isRepeatable, isValid, nextIsValid, output, outputRaw, outputStrict, patternChar, patternLength, patternPos, patternPosCurrent, prevPatternPos;
        changeIndex = helpers.getIndexOfFirstDiff(this.value, input);
        changeDistance = stringDistance(this.value, input);
        isBackwards = input.length === 1 && this.valueRaw.length === 0 ? false : this.value.length > input.length;
        output = '';
        outputRaw = '';
        outputStrict = '';
        patternLength = this.pattern.length;
        patternPos = 0;
        inputPos = 0;
        if (!changeDistance) {
          return;
        }
        if (isBackwards && helpers.includes(this.literals, changeIndex - this.optionalsOffset) && changeIndex - this.optionalsOffset > this.firstNonLiteral) {
          return;
        }
        while (patternPos < patternLength) {
          patternPosCurrent = patternPos;
          patternChar = this.pattern[patternPos];
          inputChar = input[inputPos];
          isLiteral = helpers.includes(this.literals, patternPos);
          isOptional = helpers.includes(this.optionals, patternPos);
          isRepeatable = helpers.includes(this.repeatables, patternPos);
          switch (false) {
            case !isLiteral:
              output += patternChar;
              outputStrict += patternChar;
              if (patternChar === inputChar) {
                if (!(helpers.includes(validPatternChars, patternChar) && !isBackwards)) {
                  inputPos++;
                }
              } else if (changeDistance === 1 && input[inputPos + 1] === patternChar) {
                inputPos += 2;
              }
              patternPos++;
              break;
            case !helpers.includes(validPatternChars, patternChar):
              isValid = inputChar && testChar(inputChar, patternChar);
              if (!isValid) {
                if (!(changeDistance === 1 && testChar(input[inputPos + 1], patternChar) && !isBackwards)) {
                  patternPos++;
                  if (!isOptional) {
                    output += this.placeholder;
                    outputStrict += this.placeholder;
                  }
                }
                if (!isOptional) {
                  inputPos++;
                }
              } else {
                if (patternChar === 'A' || patternChar === '#') {
                  inputChar = inputChar.toUpperCase();
                }
                output += inputChar;
                outputRaw += inputChar;
                if (!((isOptional || isRepeatable) && prevPatternPos === patternPos)) {
                  outputStrict += inputChar;
                }
                nextIsValid = input[inputPos + 1] && testChar(input[inputPos + 1], patternChar);
                inputPos++;
                if (!(nextIsValid && isRepeatable)) {
                  patternPos++;
                }
              }
              break;
            default:
              debugger;
          }
          prevPatternPos = patternPosCurrent;
        }
        this.prev.value = this.value;
        this.prev.valueRaw = this.valueRaw;
        this.prev.valueStrict = this.valueStrict;
        this.value = output;
        this.valueRaw = outputRaw;
        this.valueStrict = outputStrict;
        this.optionalsOffset = stringDistance(output, outputStrict);
        this.valid = this.validate(input, true);
      };
      Mask.prototype.validate = function(input, storeLastValid) {
        var inputChar, inputPos, isLiteral, isOptional, isRepeatable, isValid, nextIsValid, patternChar, patternLength, patternPos;
        if (!IS.string(input) || input.length < this.minRequiredCount) {
          return false;
        }
        patternLength = this.pattern.length;
        patternPos = 0;
        inputPos = 0;
        while (patternPos < patternLength) {
          patternChar = this.pattern[patternPos];
          inputChar = input[inputPos];
          isLiteral = helpers.includes(this.literals, patternPos);
          isOptional = helpers.includes(this.optionals, patternPos);
          isRepeatable = helpers.includes(this.repeatables, patternPos);
          switch (false) {
            case !isLiteral:
              patternPos++;
              if (patternChar === inputChar && (input[inputPos + 1] != null)) {
                inputPos++;
              }
              break;
            case !helpers.includes(validPatternChars, patternChar):
              isValid = inputChar && testChar(inputChar, patternChar);
              if (!isValid) {
                if (isOptional) {
                  patternPos++;
                } else {
                  if (storeLastValid) {
                    this.lastValid = inputPos - 1 < 0 ? null : inputPos - 1;
                  }
                  return false;
                }
              } else {
                nextIsValid = input[inputPos + 1] && testChar(input[inputPos + 1], patternChar);
                inputPos++;
                if (!(nextIsValid && isRepeatable)) {
                  patternPos++;
                }
              }
          }
        }
        if (storeLastValid) {
          this.lastValid = inputPos;
        }
        return true;
      };
      Mask.prototype.normalizeCursorPos = function(cursorPos, prevCursorPos) {
        var changeIndex, charPos, isBackwards, offset, value, valueStrict;
        if (cursorPos < this.firstNonLiteral) {
          prevCursorPos = this.firstNonLiteral + (prevCursorPos - cursorPos);
          cursorPos = this.firstNonLiteral;
        }
        offset = 0;
        value = this.value.slice(0, cursorPos);
        valueStrict = this.valueStrict.slice(0, cursorPos);
        changeIndex = helpers.getIndexOfFirstDiff(this.value, this.prev.value);
        isBackwards = prevCursorPos > cursorPos;
        charPos = 0;
        while (charPos < cursorPos) {
          if (value[charPos + offset] !== valueStrict[charPos] || helpers.includes(this.repeatables, charPos)) {
            offset++;
          }
          charPos++;
        }
        if (isBackwards) {
          if (cursorPos === this.firstNonLiteral) {
            return cursorPos;
          }
          if (helpers.includes(this.literals, cursorPos - 1) || this.value[cursorPos - 1] === this.placeholder) {
            return cursorPos - (offset === 0 ? 1 : 0);
          }
        } else {
          if (changeIndex === null) {
            return Math.max(cursorPos - 1, this.firstNonLiteral);
          }
          if (helpers.includes(this.repeatables, cursorPos - offset)) {
            return cursorPos + (offset === 0 ? 1 : 0);
          }
          if (helpers.includes(this.literals, cursorPos)) {
            return (cursorPos + 1) + offset;
          }
          if (helpers.includes(this.literals, changeIndex - 1) && changeIndex === cursorPos) {
            return (cursorPos + 1) + offset;
          }
        }
        return cursorPos;
      };
      testChar = function(input, patternChar) {
        switch (patternChar) {
          case '1':
            return regex.numeric.test(input);
          case 'a':
          case 'A':
            return regex.letter.test(input);
          case '*':
          case '#':
            return regex.alphanumeric.test(input);
          default:
            return false;
        }
      };
      Field = function(options) {
        var name, ref;
        this.options = extend.deep.clone.keys(this._defaults).deep.notDeep(['options', 'conditions', 'dropdownOptions']).transform({
          'conditions': function(conditions) {
            var ID, results1, value;
            if (IS.objectPlain(conditions)) {
              results1 = [];
              for (ID in conditions) {
                value = conditions[ID];
                results1.push({
                  ID: ID,
                  value: value,
                  property: 'value'
                });
              }
              return results1;
            } else if (IS.array(conditions)) {
              return conditions.map(function(item) {
                if (item.property == null) {
                  item.property = 'value';
                }
                return item;
              });
            }
          },
          'options': function(options) {
            var label, results1, value;
            if (IS.objectPlain(options)) {
              results1 = [];
              for (label in options) {
                value = options[label];
                results1.push({
                  label: label,
                  value: value
                });
              }
              return results1;
            } else if (IS.array(options)) {
              return options.map(function(item) {
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
          }
        })(this._defaults, options);
        this.type = options.type;
        this.allFields = this.options.fieldInstances || Field.instances;
        this.value = this.options.defaultValue != null ? this.options.defaultValue : null;
        this.ID = this.options.ID || currentID++ + '';
        this.els = {};
        this.state = {
          valid: true,
          visible: true,
          disabled: false,
          focused: false,
          hovered: false,
          filled: false,
          interacted: false,
          showError: false,
          showHelp: false,
          width: '100%'
        };
        for (name in this.options.templates) {
          this.options.templates[name] = extend({
            options: {
              relatedInstance: this
            }
          }, this.options.templates[name]);
        }
        if ((ref = this.options.conditions) != null ? ref.length : void 0) {
          this.state.visible = false;
          helpers.initConditions(this, this.options.conditions, (function(_this) {
            return function() {
              return _this.validateConditions();
            };
          })(this));
        }
        if (this.allFields[this.ID]) {
          if (typeof console !== "undefined" && console !== null) {
            console.warn("Duplicate field IDs found: '" + this.ID + "'");
          }
        }
        this._construct();
        this._createElements();
        this._attachBindings();
        return this.allFields[this.ID] = this;
      };
      Field.instances = Object.create(null);
      currentID = 0;
      Field.prototype.appendTo = function(target) {
        this.els.field.appendTo(target);
        return this;
      };
      Field.prototype.prependTo = function(target) {
        this.els.field.prependTo(target);
        return this;
      };
      Field.prototype.insertAfter = function(target) {
        this.els.field.insertAfter(target);
        return this;
      };
      Field.prototype.insertBefore = function(target) {
        this.els.field.insertBefore(target);
        return this;
      };
      Field.prototype.validateConditions = function(conditions) {
        var passedConditions, toggleVisibility;
        if (conditions) {
          toggleVisibility = false;
        } else {
          conditions = this.options.conditions;
        }
        passedConditions = helpers.validateConditions(conditions);
        if (toggleVisibility) {
          return this.state.visible = passedConditions;
        } else {
          return passedConditions;
        }
      };
      Field.text = textField = function() {
        return this;
      };
      textField.prototype = Object.create(Field.prototype);
      textField.prototype._templates = {
        field: DOM.template([
          'div', {
            style: {
              position: 'relative',
              display: 'none',
              width: function(field) {
                return field.state.width;
              },
              boxSizing: 'border-box',
              fontFamily: function(field) {
                return field.options.fontFamily;
              },
              $visible: {
                display: 'inline-block'
              },
              $showError: {
                animation: '0.2s fieldErrorShake'
              }
            }
          }
        ]),
        fieldInnerwrap: DOM.template([
          'div', {
            style: {
              position: 'relative',
              height: '46px',
              backgroundColor: 'white',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: COLOR_GREY_LIGHT,
              borderRadius: '2px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
              $focus: {
                borderColor: COLOR_ORANGE
              },
              $showError: {
                borderColor: COLOR_RED
              },
              $disabled: {
                borderColor: COLOR_GREY_LIGHT,
                backgroundColor: COLOR_GREY_LIGHT
              }
            }
          }
        ]),
        label: DOM.template([
          'div', {
            style: {
              position: 'absolute',
              zIndex: 1,
              top: function(field) {
                return parseFloat(field.els.fieldInnerwrap.raw.style.height) / 6;
              },
              left: '12px',
              fontFamily: 'inherit',
              fontSize: '11px',
              fontWeight: 600,
              lineHeight: '1em',
              color: COLOR_GREY,
              opacity: 0,
              transition: 'opacity 0.2s, color 0.2s',
              cursor: 'default',
              pointerEvents: 'none',
              $filled: {
                opacity: 1
              },
              $focus: {
                color: COLOR_ORANGE
              },
              $showError: {
                color: COLOR_RED
              }
            }
          }
        ]),
        input: DOM.template([
          'input', {
            type: 'text',
            style: {
              position: 'absolute',
              zIndex: 3,
              top: '0px',
              left: '0px',
              display: 'block',
              width: '100%',
              height: '100%',
              margin: '0',
              padding: '0 12px',
              backgroundColor: 'transparent',
              appearance: 'none',
              border: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: '14px',
              lineHeight: function() {
                return this.parent.raw.style.height;
              },
              color: COLOR_BLACK,
              boxSizing: 'border-box',
              transform: 'translateY(0)',
              transition: 'transform 0.2s, -webkit-transform 0.2s',
              $filled: {
                $hasLabel: {
                  transform: function(field) {
                    return "translateY(" + (parseFloat(field.els.fieldInnerwrap.style('height')) / 8) + "px)";
                  }
                }
              },
              $showCheckmark: {
                padding: '0 44px 0 12px'
              }
            }
          }
        ]),
        placeholder: DOM.template([
          'div', {
            style: {
              position: 'absolute',
              zIndex: 2,
              top: '0px',
              left: '0px',
              lineHeight: function() {
                return this.parent.raw.style.height;
              },
              padding: '0 12px',
              fontFamily: 'inherit',
              fontSize: '14px',
              color: COLOR_BLACK,
              opacity: 0.5,
              userSelect: 'none',
              transform: 'translateY(0)',
              transition: 'transform 0.2s, -webkit-transform 0.2s',
              $filled: {
                visibility: 'hidden',
                $hasLabel: {
                  transform: function(field) {
                    return "translateY(" + (parseFloat(field.els.fieldInnerwrap.style('height')) / 8) + "px)";
                  }
                }
              }
            }
          }
        ]),
        help: DOM.template([
          'div', {
            style: {
              position: 'absolute',
              top: function(field) {
                return parseFloat(this.parent.raw.style.height) + 4 + 'px';
              },
              left: '0px',
              fontFamily: 'inherit',
              fontSize: '11px',
              color: COLOR_GREY,
              display: 'none',
              $showError: {
                color: COLOR_RED
              },
              $showHelp: {
                display: 'block'
              },
              $showError: {
                display: 'block'
              }
            }
          }
        ]),
        checkmark: DOM.template([
          'div', {
            style: {
              position: 'absolute',
              zIndex: 4,
              right: '12px',
              top: function() {
                return parseFloat(this.parent.raw.style.height) / 2 - 13;
              },
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'white',
              borderWidth: '3px',
              borderStyle: 'solid',
              borderColor: COLOR_GREEN,
              transform: 'scale(0.8)',
              display: 'none',
              visibility: 'hidden',
              $showError: {
                borderColor: COLOR_RED
              },
              $showCheckmark: {
                visibility: 'visible'
              },
              $filled: {
                display: 'block'
              }
            }
          }, [
            'div', {
              style: {
                position: 'absolute',
                top: '-4px',
                left: '-10px',
                width: '15px',
                height: '30px',
                borderRadius: '30px 0 0 30px',
                backgroundColor: function() {
                  return this.parent.raw.style.backgroundColor;
                },
                transform: 'rotate(-45deg)',
                transformOrigin: '15px 15px 0'
              }
            }
          ], [
            'div', {
              style: {
                position: 'absolute',
                top: '-5px',
                left: '8px',
                width: '15px',
                height: '30px',
                borderRadius: '0 30px 30px 0',
                backgroundColor: function() {
                  return this.parent.raw.style.backgroundColor;
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
                style: {
                  position: 'absolute',
                  zIndex: 2,
                  top: '10px',
                  left: '3px',
                  display: 'block',
                  width: '8px',
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: COLOR_GREEN,
                  transform: 'rotate(45deg)',
                  $filled: {
                    animation: '0.75s checkmarkAnimateSuccessTip'
                  },
                  $invalid: {
                    backgroundColor: COLOR_RED,
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
                style: {
                  position: 'absolute',
                  zIndex: 2,
                  top: '8px',
                  right: '2px',
                  display: 'block',
                  width: '12px',
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: COLOR_GREEN,
                  transform: 'rotate(-45deg)',
                  $filled: {
                    animation: '0.75s checkmarkAnimateSuccessLong'
                  },
                  $invalid: {
                    backgroundColor: COLOR_RED,
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
                borderColor: helpers.hexToRGBA(COLOR_GREEN, 0.4),
                $invalid: {
                  borderColor: helpers.hexToRGBA(COLOR_RED, 0.4)
                }
              }
            }
          ], [
            'div', {
              style: {
                position: 'absolute',
                zIndex: 1,
                top: '-2px',
                left: '6px',
                width: '4px',
                height: '28px',
                backgroundColor: function() {
                  return this.parent.raw.style.backgroundColor;
                },
                transform: 'rotate(-45deg)'
              }
            }
          ]
        ])
      };
      textField.prototype._defaults = {
        required: false,
        mask: false,
        maskPlaceholder: ' ',
        placeholder: true,
        label: false,
        alwaysShowHelp: false,
        validWhenIsOption: false,
        checkmark: true,
        defaultValue: '',
        help: '',
        keyboard: 'text',
        fontFamily: 'system-ui',
        templates: {},
        dropdownOptions: {
          storeSelected: false
        },
        options: null
      };
      textField.prototype._construct = function() {
        this.state.typing = false;
        this.cursor = {
          prev: 0,
          current: 0
        };
        if (this.options.mask) {
          this.mask = new Mask(this.options.mask, this.options.maskPlaceholder);
        }
        this.helpMessage = this.options.alwaysShowHelp ? this.options.help : '';
      };
      textField.prototype._createElements = function() {
        var forceOpts;
        forceOpts = {
          relatedInstance: this,
          styleAfterInsert: true
        };
        this.els.field = this._templates.field.spawn(this.options.templates.field, forceOpts);
        this.els.fieldInnerwrap = this._templates.fieldInnerwrap.spawn(this.options.templates.fieldInnerwrap, forceOpts).appendTo(this.els.field);
        this.els.label = this._templates.label.spawn(this.options.templates.label, forceOpts).prependTo(this.els.field);
        this.els.input = this._templates.input.spawn(this.options.templates.input, forceOpts).appendTo(this.els.fieldInnerwrap);
        this.els.placeholder = this._templates.placeholder.spawn(this.options.templates.placeholder, forceOpts).appendTo(this.els.fieldInnerwrap);
        this.els.help = this._templates.help.spawn(this.options.templates.help, forceOpts).appendTo(this.els.fieldInnerwrap);
        this.els.checkmark = this._templates.checkmark.spawn(this.options.templates.checkmark, forceOpts).appendTo(this.els.fieldInnerwrap);
        if (this.options.options) {
          this.dropdown = new Dropdown(this.options.options, this);
          this.dropdown.appendTo(this.els.fieldInnerwrap);
        }
        if (this.options.label) {
          this.els.label.text(this.options.label);
          this.els.field.state('hasLabel', true);
        }
        if (this.options.checkmark) {
          this.els.field.state('showCheckmark', true);
        }
        this.els.input.prop('type', (function() {
          switch (this.options.keyboard) {
            case 'number':
            case 'tel':
            case 'phone':
              return 'tel';
            case 'email':
              return 'email';
            case 'url':
              return 'url';
            default:
              return 'text';
          }
        }).call(this));
      };
      textField.prototype._attachBindings = function() {
        var listener;
        listener = {
          listenMethod: 'on'
        };
        SimplyBind('visible').of(this.state).to((function(_this) {
          return function(visible) {
            return _this.els.field.state('visible', visible);
          };
        })(this));
        SimplyBind('hovered').of(this.state).to((function(_this) {
          return function(hovered) {
            return _this.els.field.state('hover', hovered);
          };
        })(this));
        SimplyBind('focused').of(this.state).to((function(_this) {
          return function(focused) {
            return _this.els.field.state('focus', focused);
          };
        })(this));
        SimplyBind('filled').of(this.state).to((function(_this) {
          return function(filled) {
            return _this.els.field.state('filled', filled);
          };
        })(this));
        SimplyBind('disabled').of(this.state).to((function(_this) {
          return function(disabled) {
            return _this.els.field.state('disabled', disabled);
          };
        })(this));
        SimplyBind('showError').of(this.state).to((function(_this) {
          return function(showError) {
            return _this.els.field.state('showError', showError);
          };
        })(this));
        SimplyBind('showHelp').of(this.state).to((function(_this) {
          return function(showHelp) {
            return _this.els.field.state('showHelp', showHelp);
          };
        })(this));
        SimplyBind('valid').of(this.state).to((function(_this) {
          return function(valid) {
            _this.els.field.state('valid', valid);
            return _this.els.field.state('invalid', !valid);
          };
        })(this));
        SimplyBind('event:mouseenter', listener).of(this.els.input).to((function(_this) {
          return function() {
            return _this.state.hovered = true;
          };
        })(this));
        SimplyBind('event:mouseleave', listener).of(this.els.input).to((function(_this) {
          return function() {
            return _this.state.hovered = false;
          };
        })(this));
        SimplyBind('event:focus', listener).of(this.els.input).to((function(_this) {
          return function() {
            _this.state.focused = true;
            if (_this.state.disabled) {
              return _this.els.input.raw.blur();
            }
          };
        })(this));
        SimplyBind('event:blur', listener).of(this.els.input).to((function(_this) {
          return function() {
            return _this.state.focused = _this.state.typing = false;
          };
        })(this));
        SimplyBind('event:input', listener).of(this.els.input).to((function(_this) {
          return function() {
            return _this.state.typing = true;
          };
        })(this));
        SimplyBind('event:keydown', listener).of(this.els.input).to((function(_this) {
          return function() {
            return _this.cursor.prev = _this.selection().end;
          };
        })(this));
        SimplyBind('width').of(this.state).to((function(_this) {
          return function(width) {
            return _this.els.field.style({
              width: width
            });
          };
        })(this));
        SimplyBind('showError', {
          updateOnBind: false
        }).of(this.state).to((function(_this) {
          return function(error, prevError) {
            switch (false) {
              case !IS.string(error):
                return _this.els.help.text(error);
              case !IS.string(prevError):
                return _this.els.help.text(_this.options.help);
            }
          };
        })(this));
        SimplyBind('placeholder').of(this.options).to('textContent').of(this.els.placeholder.raw).transform((function(_this) {
          return function(placeholder) {
            switch (false) {
              case !(placeholder === true && _this.options.label):
                return _this.options.label;
              case !IS.string(placeholder):
                return placeholder;
              default:
                return '';
            }
          };
        })(this));
        SimplyBind('value').of(this.els.input.raw).transformSelf((function(_this) {
          return function(newValue) {
            if (!_this.mask) {
              return newValue;
            } else {
              _this.mask.setValue(newValue);
              _this.cursor.current = _this.selection().start;
              newValue = _this.mask.valueRaw ? _this.mask.value : '';
              return newValue;
            }
          };
        })(this)).to('value').of(this).bothWays();
        SimplyBind('value').of(this).to((function(_this) {
          return function(value) {
            if (_this.mask) {
              value = _this.mask.valueRaw;
            }
            _this.state.filled = !!value;
            if (value) {
              _this.state.interacted = true;
            }
            return _this.state.valid = _this.validate();
          };
        })(this));
        if (this.options.mask) {
          SimplyBind('value', {
            updateEvenIfSame: true
          }).of(this.els.input.raw).to((function(_this) {
            return function(value) {
              if (_this.state.focused) {
                return _this._scheduleCursorReset();
              }
            };
          })(this));
        }
        if (this.dropdown) {
          SimplyBind('typing', {
            updateEvenIfSame: true
          }).of(this.state).to((function(_this) {
            return function(isTyping) {
              if (isTyping) {
                _this.dropdown.isOpen = true;
                return SimplyBind('event:click').of(document).once.to(function() {
                  return _this.dropdown.isOpen = false;
                }).condition(function(event) {
                  return !DOM(event.target).parentMatching(function(parent) {
                    return parent === _this.els.input;
                  });
                });
              } else {
                return setTimeout(function() {
                  return _this.dropdown.isOpen = false;
                }, 300);
              }
            };
          })(this));
          SimplyBind('value', {
            updateOnBind: false
          }).of(this).to((function(_this) {
            return function(value) {
              var i, len, option, ref, shouldBeVisible;
              if (_this.mask) {
                value = _this.mask.valueRaw;
              }
              ref = _this.dropdown.options;
              for (i = 0, len = ref.length; i < len; i++) {
                option = ref[i];
                shouldBeVisible = !value ? true : helpers.fuzzyMatch(value, option.value);
                if (option.visible !== shouldBeVisible) {
                  option.visible = shouldBeVisible;
                }
              }
              if (_this.dropdown.isOpen && !value) {
                _this.dropdown.isOpen = false;
              }
            };
          })(this));
          this.dropdown.onSelected((function(_this) {
            return function(selectedOption) {
              _this.value = selectedOption.label;
              if (selectedOption.value !== selectedOption.label) {
                return _this.valueReal = selectedOption.value;
              }
            };
          })(this));
        }
      };
      textField.prototype.validate = function(providedValue) {
        var matchingOption, ref;
        if (providedValue == null) {
          providedValue = this.value;
        }
        switch (false) {
          case !this.mask:
            return this.mask.validate(providedValue);
          case !(this.options.validWhenIsOption && ((ref = this.options.options) != null ? ref.length : void 0)):
            matchingOption = this.options.options.filter(function(option) {
              return option.value === providedValue;
            });
            return !!matchingOption.length;
          default:
            return !!providedValue;
        }
      };
      textField.prototype._scheduleCursorReset = function() {
        var currentCursor, diffIndex, newCursor;
        diffIndex = helpers.getIndexOfFirstDiff(this.mask.value, this.mask.prev.value);
        currentCursor = this.cursor.current;
        newCursor = this.mask.normalizeCursorPos(currentCursor, this.cursor.prev);
        if (newCursor !== currentCursor) {
          this.selection(newCursor);
        }
      };
      textField.prototype.selection = function(arg) {
        var end, start;
        if (IS.object(arg)) {
          start = arg.start;
          end = arg.end;
        } else {
          start = arg;
        }
        if (start != null) {
          if (!end || end < start) {
            end = start;
          }
          this.els.input.raw.setSelectionRange(start, end);
        } else {
          return {
            'start': this.els.input.raw.selectionStart,
            'end': this.els.input.raw.selectionEnd
          };
        }
      };
      QuickField.version = '1.0.0';

      /* istanbul ignore next */
      if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
        return module.exports = QuickField;
      } else if (typeof define === 'function' && define.amd) {
        return define(['quickfield'], function() {
          return QuickField;
        });
      } else {
        return this.Field = QuickField;
      }
    })();
  });
})(this)();
