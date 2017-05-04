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
      m[1] = function(exports) {
        var module = {exports:exports};
        var DOM, IS, SimplyBind, helpers, regex;
        IS = _s$m(2);
        DOM = _s$m(3);
        SimplyBind = _s$m(45);
        regex = _s$m(9);
        helpers = {};
        helpers.noop = function() {};
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
          if (!condition || !condition.target) {
            throw new Error("Invalid condition provided: " + (JSON.stringify(condition)));
          }
          if (!condition.target.state.visible) {
            return false;
          }
          comparison = (function() {
            switch (false) {
              case !IS.objectPlain(condition.value):
                return condition.value;
              case !IS.regex(condition.value):
                return {
                  '$regex': condition.value
                };
              case !(condition.value === 'valid' && !condition.property || !IS.defined(condition.value)):
                return 'valid';
              default:
                return {
                  '$eq': condition.value
                };
            }
          })();
          if (comparison === 'valid') {
            return condition.target.validate();
          }
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
          if (conditions) {
            validConditions = conditions.filter(function(condition) {
              return helpers.testCondition(condition);
            });
            return validConditions.length === conditions.length;
          }
        };
        helpers.initConditions = function(instance, conditions, callback) {
          return setTimeout((function(_this) {
            return function() {
              conditions.forEach(function(condition) {
                var conditionTarget, targetProperty;
                conditionTarget = IS.string(condition.target) ? instance.allFields[condition.target] : IS.field(condition.target) ? condition.target : void 0;
                if (conditionTarget) {
                  condition.target = conditionTarget;
                } else {
                  return console.warn("Condition target not found for the provided ID '" + condition.target + "'", instance);
                }
                targetProperty = IS.array(conditionTarget['_value']) ? 'array:_value' : '_value';
                return SimplyBind(targetProperty, {
                  updateOnBind: false
                }).of(conditionTarget).and('visible').of(conditionTarget.state).to(callback);
              });
              return callback();
            };
          })(this));
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
        module.exports = helpers;
        return module.exports;
      };
      m[2] = function(exports) {
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
      m[3] = function(exports) {
        var module = {exports:exports};
        (function() {
          var CSS, IS, MediaQuery, QuickBatch, QuickDom, QuickElement, QuickTemplate, QuickWindow, _getChildRefs, _getParents, _sim_27296, _sim_2ee0e, allowedOptions, allowedTemplateOptions, aspectRatioGetter, configSchema, extend, extendByRef, extendTemplate, fn1, helpers, j, len, orientationGetter, parseErrorPrefix, parseTree, pholderRegex, regexWhitespace, ruleDelimiter, shortcut, shortcuts, svgNamespace;
          svgNamespace = 'http://www.w3.org/2000/svg';

          /* istanbul ignore next */
          _sim_27296 = (function(exports){
					var module = {exports:exports};
					(function(){var l,m,n,k,e,f,h,p;k=["webkit","moz","ms","o"];f="backgroundPositionX backgroundPositionY blockSize borderWidth columnRuleWidth cx cy fontSize gridColumnGap gridRowGap height inlineSize lineHeight minBlockSize minHeight minInlineSize minWidth maxHeight maxWidth outlineOffset outlineWidth perspective shapeMargin strokeDashoffset strokeWidth textIndent width wordSpacing top bottom left right x y".split(" ");["margin","padding","border","borderRadius"].forEach(function(a){var b,c,d,e,g;
					f.push(a);e=["Top","Bottom","Left","Right"];g=[];c=0;for(d=e.length;c<d;c++)b=e[c],g.push(f.push(a+b));return g});p=document.createElement("div").style;l=/^\d+(?:[a-z]|\%)+$/i;m=/\d+$/;n=/\s/;h={includes:function(a,b){return a&&-1!==a.indexOf(b)},isIterable:function(a){return a&&"object"===typeof a&&"number"===typeof a.length&&!a.nodeType},isPropSupported:function(a){return"undefined"!==typeof p[a]},toTitleCase:function(a){return a[0].toUpperCase()+a.slice(1)},normalizeProperty:function(a){var b,
					c,d;if(this.isPropSupported(a))return a;d=this.toTitleCase(a);a=0;for(b=k.length;a<b;a++)if(c=k[a],c=""+c+d,this.isPropSupported(c))return c},normalizeValue:function(a,b){this.includes(f,a)&&null!==b&&(b=""+b,!m.test(b)||l.test(b)||n.test(b)||(b+="px"));return b}};e=function(a,b,c){var d,f,g;if(h.isIterable(a))for(d=0,f=a.length;d<f;d++)g=a[d],e(g,b,c);else if("object"===typeof b)for(d in b)c=b[d],e(a,d,c);else{b=h.normalizeProperty(b);if("undefined"===typeof c)return getComputedStyle(a)[b];b&&(a.style[b]=
					h.normalizeValue(b,c))}};e.version="1.0.5";return null!=("undefined"!==typeof module&&null!==module?module.exports:void 0)?module.exports=e:"function"===typeof define&&define.amd?define(["quickdom"],function(){return e}):this.Css=e})();
					
					return module.exports;
				}).call(this, {});
          CSS = _sim_27296;

          /* istanbul ignore next */
          _sim_2ee0e = _s$m(4);
          extend = _sim_2ee0e;
          allowedTemplateOptions = ['id', 'name', 'type', 'href', 'selected', 'checked', 'className'];
          allowedOptions = ['id', 'ref', 'type', 'name', 'text', 'style', 'class', 'className', 'url', 'href', 'selected', 'checked', 'props', 'attrs', 'passStateToChildren', 'stateTriggers'];
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
          helpers.isStateStyle = function(string) {
            return string[0] === '$' || string[0] === '@';
          };

          /* istanbul ignore next */
          IS = _s$m(2);
          IS = extend.clone(IS, {
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
              return IS.domEl(subject) || IS.domText(subject);
            },
            quickDomEl: function(subject) {
              return subject && subject.constructor.name === 'QuickElement';
            },
            template: function(subject) {
              return subject && subject.constructor.name === 'QuickTemplate';
            }
          });
          QuickElement = (function() {
            function QuickElement(type1, options1) {
              this.type = type1;
              this.options = options1;
              this.el = this.options.existing || (this.type === 'text' ? document.createTextNode(this.options.text) : this.type[0] === '*' ? document.createElementNS(svgNamespace, this.type.slice(1)) : document.createElement(this.type));
              if (this.type === 'text') {
                this.append = this.prepend = this.attr = function() {};
              }
              this._parent = null;
              this._state = [];
              this._children = [];
              this._insertedCallbacks = [];
              this._eventCallbacks = {
                __refs: {}
              };
              this._normalizeOptions();
              this._applyOptions();
              this._attachStateEvents();
              this._proxyParent();
              this.el._quickElement = this;
            }

            QuickElement.prototype.toJSON = function() {
              var child, children, j, len, output;
              output = [this.type, extend.clone.keys(allowedOptions)(this.options)];
              children = this.children;
              for (j = 0, len = children.length; j < len; j++) {
                child = children[j];
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
            return _getParents(this, filterFn);
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
                var child, j, len, ref1;
                if (this.el.childNodes.length !== this._children.length) {
                  this._children.length = 0;
                  ref1 = this.el.childNodes;
                  for (j = 0, len = ref1.length; j < len; j++) {
                    child = ref1[j];
                    if (child.nodeType < 4) {
                      this._children.push(QuickDom(child));
                    }
                  }
                }
                return this._children;
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
            }
          });
          _getParents = function(targetEl, filterFn) {
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
          _getChildRefs = function(target, freshCopy) {
            var children, refs;
            if (freshCopy || !target._childRefs) {
              target._childRefs = {};
            }
            refs = target._childRefs;
            if (target.ref) {
              refs[target.ref] = target;
            }
            children = target.children;
            if (children.length) {
              extend.apply(null, [target._childRefs].concat(slice.call(children.map(function(child) {
                return _getChildRefs(child, freshCopy);
              }))));
            }
            return target._childRefs;
          };
          QuickElement.prototype._normalizeOptions = function() {
            var base, base1, base2, base3;
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
            if ((base2 = this.options).unpassableStates == null) {
              base2.unpassableStates = [];
            }
            if ((base3 = this.options).passStateToChildren == null) {
              base3.passStateToChildren = true;
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
          };
          QuickElement.prototype._normalizeStyle = function() {
            var checkInnerStates, j, keys, len, nonStateProps, specialStates, state, states;
            keys = Object.keys(this.options.style);
            states = keys.filter(function(key) {
              return helpers.isStateStyle(key);
            });
            specialStates = helpers.removeItem(states.slice(), '$base');
            this._mediaStates = states.filter(function(key) {
              return key[0] === '@';
            });
            this._providedStates = states.map(function(state) {
              return state.slice(1);
            });
            if (!helpers.includes(states, '$base') && keys.length) {
              this.options = extend.clone(this.options);
              if (states.length) {
                nonStateProps = keys.filter(function(property) {
                  return !helpers.isStateStyle(property);
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
                var innerState, innerStates, j, len, stateChain, stateChainString;
                innerStates = Object.keys(styleObject).filter(function(key) {
                  return helpers.isStateStyle(key);
                });
                if (innerStates.length) {
                  _this.hasSharedStateStyle = true;
                  if (_this._stateShared == null) {
                    _this._stateShared = [];
                  }
                  for (j = 0, len = innerStates.length; j < len; j++) {
                    innerState = innerStates[j];
                    stateChain = parentStates.concat(innerState.slice(1));
                    stateChainString = stateChain.join('+');
                    _this.options.styleShared[stateChainString] = _this.options.style['$' + stateChainString] = styleObject[innerState];
                    checkInnerStates(styleObject[innerState], stateChain);
                    delete styleObject[innerState];
                  }
                }
              };
            })(this);
            for (j = 0, len = specialStates.length; j < len; j++) {
              state = specialStates[j];
              checkInnerStates(this.options.style[state], [state.slice(1)]);
            }
          };
          QuickElement.prototype._applyOptions = function() {
            var key, ref, ref1, ref2, value;
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
            if (!this.options.styleAfterInsert) {
              this.style(this.options.style.$base);
            }
            this.onInserted((function(_this) {
              return function() {
                var _, mediaStates;
                if (_this.options.styleAfterInsert) {
                  _this.style(extend.clone.apply(extend, [_this.options.style.$base].concat(slice.call(_this._getStateStyles(_this._getActiveStates())))));
                }
                _ = _this._inserted = _this;
                mediaStates = _this._mediaStates;
                if (mediaStates.length) {
                  return _this._mediaStates = new function() {
                    var j, len, queryString;
                    for (j = 0, len = mediaStates.length; j < len; j++) {
                      queryString = mediaStates[j];
                      queryString = queryString.slice(1);
                      this[queryString] = MediaQuery.register(_, queryString);
                    }
                    return this;
                  };
                }
              };
            })(this));
          };
          QuickElement.prototype._attachStateEvents = function() {
            var fn1, ref1, state, trigger;
            ref1 = this.options.stateTriggers;
            fn1 = (function(_this) {
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
            for (state in ref1) {
              trigger = ref1[state];
              fn1(state, trigger);
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
                    parent.onInserted((function(_this) {
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
            var callback, j, len, ref1;
            delete this._parent;
            this._parent = newParent;
            ref1 = this._insertedCallbacks;
            for (j = 0, len = ref1.length; j < len; j++) {
              callback = ref1[j];
              callback(this);
            }
          };
          regexWhitespace = /\s+/;
          QuickElement.prototype.on = function(eventNames, callback) {
            var callbackRef, split;
            if (IS.string(eventNames) && IS["function"](callback)) {
              split = eventNames.split('.');
              callbackRef = split[1];
              eventNames = split[0];
              eventNames.split(regexWhitespace).forEach((function(_this) {
                return function(eventName) {
                  if (!_this._eventCallbacks[eventName]) {
                    _this._eventCallbacks[eventName] = [];
                    _this._listenTo(eventName, function(event) {
                      var cb, j, len, ref1;
                      ref1 = _this._eventCallbacks[eventName];
                      for (j = 0, len = ref1.length; j < len; j++) {
                        cb = ref1[j];
                        cb.call(_this.el, event);
                      }
                    });
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
          QuickElement.prototype.off = function(eventNames, callback) {
            var callbackRef, eventName, split;
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
              if (!this._inserted) {
                this._insertedCallbacks.push(callback);
              } else if (invokeIfInserted) {
                callback(this);
              }
              return this;
            }
          };

          /* istanbul ignore next */
          QuickElement.prototype._listenTo = function(eventName, callback) {
            var eventNameToListenFor, listenMethod;
            listenMethod = this.el.addEventListener ? 'addEventListener' : 'attachEvent';
            eventNameToListenFor = this.el.addEventListener ? eventName : "on" + eventName;
            this.el[listenMethod](eventNameToListenFor, callback);
            return this;
          };
          QuickElement.prototype.updateOptions = function(options) {
            if (IS.object(options)) {
              this.options = options;
              this._normalizeOptions();
              this._applyOptions(this.options);
            }
            return this;
          };
          QuickElement.prototype.state = function(targetState, value, source) {
            var activeStateStyles, activeStates, child, desiredValue, inferiorStateChains, isApplicable, j, k, len, len1, ref1, sharedStyles, split, stateChain, stylesToKeep, stylesToRemove, superiorStateStyles, superiorStates, targetStateIndex, targetStyle;
            if (arguments.length === 1) {
              return helpers.includes(this._state, targetState);
            } else if (this._statePipeTarget && source !== this) {
              this._statePipeTarget.state(targetState, value, this);
              return this;
            } else if (IS.string(targetState)) {
              if (targetState[0] === '$') {
                targetState = targetState.slice(1);
              }
              desiredValue = !!value;
              if (targetState === 'base') {
                return this;
              }
              activeStates = this._getActiveStates(targetState, false);
              activeStateStyles = this._getStateStyles(activeStates);
              if (this.state(targetState) !== desiredValue) {
                targetStyle = this.options.style['$' + targetState] || this.options.style['@' + targetState];
                if (targetStyle) {
                  targetStateIndex = this._providedStates.indexOf(targetState);
                  superiorStates = activeStates.filter((function(_this) {
                    return function(state) {
                      return _this._providedStates.indexOf(state) > targetStateIndex;
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
                for (j = 0, len = sharedStyles.length; j < len; j++) {
                  stateChain = sharedStyles[j];
                  split = stateChain.split('+');
                  isApplicable = split.length === split.filter((function(_this) {
                    return function(state) {
                      return state === targetState || _this.state(state);
                    };
                  })(this)).length;
                  if (isApplicable) {
                    targetStyle = this.options.styleShared[stateChain];
                    if (desiredValue) {
                      if (!helpers.includes(this._stateShared, stateChain)) {
                        this._stateShared.push(stateChain);
                      }
                      inferiorStateChains = this.options.styleShared[helpers.removeItem(split, targetState).join('+')];
                      this.style(extend.clone(inferiorStateChains, targetStyle));
                    } else {
                      helpers.removeItem(this._stateShared, stateChain);
                      stylesToKeep = extend.clone.keys(targetStyle).apply(null, [this.options.style.$base].concat(slice.call(activeStateStyles)));
                      stylesToRemove = extend.transform(function() {
                        return null;
                      }).clone(targetStyle);
                      this.style(extend(stylesToRemove, stylesToKeep));
                    }
                  }
                }
              }
              if (this.options.passStateToChildren && !helpers.includes(this.options.unpassableStates, targetState)) {
                ref1 = this._children;
                for (k = 0, len1 = ref1.length; k < len1; k++) {
                  child = ref1[k];
                  child.state(targetState, value, source || this);
                }
              }
              return this;
            }
          };
          QuickElement.prototype.resetState = function() {
            var activeState, j, len, ref1;
            ref1 = this._state.slice();
            for (j = 0, len = ref1.length; j < len; j++) {
              activeState = ref1[j];
              this.state(activeState, false);
            }
            return this;
          };
          QuickElement.prototype.pipeState = function(targetEl) {
            var activeState, j, len, ref1;
            if (targetEl) {
              targetEl = helpers.normalizeGivenEl(targetEl);
              if (IS.quickDomEl(targetEl) && targetEl !== this) {
                this._statePipeTarget = targetEl;
                ref1 = this._state;
                for (j = 0, len = ref1.length; j < len; j++) {
                  activeState = ref1[j];
                  targetEl.state(activeState, true);
                }
              }
            } else if (targetEl === false) {
              delete this._statePipeTarget;
            }
            return this;
          };

          /**
          				 * Sets/gets the value of a style property. In getter mode the computed property of
          				 * the style will be returned unless the element is not inserted into the DOM. In
          				 * webkit browsers all computed properties of a detached node are always an empty
          				 * string but in gecko they reflect on the actual computed value, hence we need
          				 * to "normalize" this behavior and make sure that even on gecko an empty string
          				 * is returned
          				 * @return {[type]} [description]
           */
          QuickElement.prototype.style = function() {
            var args, returnValue;
            if (this.type === 'text') {
              return;
            }
            args = arguments;
            if (IS.string(args[0])) {
              returnValue = CSS(this.el, args[0], args[1]);
              if (!IS.defined(args[1])) {

                /* istanbul ignore next */
                if (this._inserted) {
                  return returnValue;
                } else if (!returnValue) {
                  return returnValue;
                } else {
                  return '';
                }
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

          /**
          				 * Attempts to resolve the value for a given property in the following order if each one isn't a valid value:
          				 * 1. from computed style (for dom-inserted els)
          				 * 2. from DOMElement.style object (for non-inserted els; if options.styleAfterInsert, will only have state styles)
          				 * 3. from provided style options
          				 * (for non-inserted els; checking only $base since state styles will always be applied to the style object even for non-inserted)
           */
          QuickElement.prototype.styleSafe = function(property, skipComputed) {
            var args, computedResult;
            if (this.type === 'text') {
              return;
            }
            args = arguments;
            computedResult = this.style(property);
            if (IS.string(computedResult)) {
              if (skipComputed) {
                computedResult = 0;
              }
              return computedResult || this.el.style[args[0]] || this.options.style.$base[args[0]] || '';
            }
            return this;
          };
          QuickElement.prototype.styleParsed = function(property) {
            return parseFloat(this.styleSafe(property));
          };
          QuickElement.prototype._getActiveStates = function(stateToExclude, includeSharedStates) {
            var plainStates;
            if (includeSharedStates == null) {
              includeSharedStates = true;
            }
            plainStates = this._providedStates.filter((function(_this) {
              return function(state) {
                return helpers.includes(_this._state, state) && state !== stateToExclude;
              };
            })(this));
            if (!includeSharedStates || !this.hasSharedStateStyle) {
              return plainStates;
            } else {
              return plainStates.concat(this._stateShared);
            }
          };
          QuickElement.prototype._getStateStyles = function(states) {
            return states.map((function(_this) {
              return function(state) {
                return _this.options.style['$' + state] || _this.options.style['@' + state];
              };
            })(this));
          };
          Object.defineProperties(QuickElement.prototype, {
            'rect': {
              get: function() {
                return this.el.getBoundingClientRect();
              }
            },
            'width': {
              get: function() {
                return parseFloat(this.style('width'));
              }
            },
            'height': {
              get: function() {
                return parseFloat(this.style('height'));
              }
            },
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
            var activeState, callback, callbacks, child, elClone, eventName, j, k, len, len1, len2, n, newEl, options, ref1, ref2, ref3;
            elClone = this.el.cloneNode(false);
            options = extend.clone(this.options, {
              existing: elClone
            });
            newEl = new QuickElement(this.type, options);
            ref1 = this._state;
            for (j = 0, len = ref1.length; j < len; j++) {
              activeState = ref1[j];
              newEl.state(activeState, true);
            }
            ref2 = this.children;
            for (k = 0, len1 = ref2.length; k < len1; k++) {
              child = ref2[k];
              newEl.append(child.clone());
            }
            ref3 = this._eventCallbacks;
            for (eventName in ref3) {
              callbacks = ref3[eventName];
              for (n = 0, len2 = callbacks.length; n < len2; n++) {
                callback = callbacks[n];
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
            var ref1;
            if ((ref1 = this.parent) != null) {
              ref1._removeChild(this);
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
            var child, j, len, ref1;
            ref1 = this.children.slice();
            for (j = 0, len = ref1.length; j < len; j++) {
              child = ref1[j];
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
            var ref1;
            if (targetEl) {
              targetEl = helpers.normalizeGivenEl(targetEl);
              if (IS.quickDomEl(targetEl) && targetEl !== this) {
                targetEl.detach();
                if ((ref1 = this.parent) != null) {
                  ref1._removeChild(this, targetEl);
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
            }
          });
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
          QuickWindow._listenTo = QuickElement.prototype._listenTo;
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
          MediaQuery = new function() {
            var callbacks, testRule;
            callbacks = [];
            window.addEventListener('resize', function() {
              var callback, j, len;
              for (j = 0, len = callbacks.length; j < len; j++) {
                callback = callbacks[j];
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
              var currentValue, j, len, passed, ref1, rule;
              passed = true;
              ref1 = query.rules;
              for (j = 0, len = ref1.length; j < len; j++) {
                rule = ref1[j];
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
          QuickDom = function() {
            var args, child, children, element, j, len, options, type;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
                children = args.slice(2);
                element = new QuickElement(type, options);
                for (j = 0, len = children.length; j < len; j++) {
                  child = children[j];
                  if (IS.string(child)) {
                    child = QuickDom.text(child);
                  }
                  if (IS.template(child)) {
                    child = QuickDom(child);
                  }
                  if (IS.array(child)) {
                    child = QuickDom.apply(null, child);
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
          Object.keys(QuickElement.prototype).concat('css', 'replaceWith', 'html', 'text').forEach(function(method) {
            return QuickBatch.prototype[method] = function(newValue) {
              var element, results;
              results = this.lastResults = (function() {
                var j, len, ref1, results1;
                ref1 = this.elements;
                results1 = [];
                for (j = 0, len = ref1.length; j < len; j++) {
                  element = ref1[j];
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
          extendTemplate = function(currentOpts, newOpts, globalOpts) {
            var currentChild, currentChildren, globalOptsTransform, index, j, needsTemplateWrap, newChild, newChildProcessed, newChildren, noChanges, output, ref, ref1, remainingNewChildren;
            if (globalOpts) {
              globalOptsTransform = {
                options: function(opts) {
                  return extend(opts, globalOpts);
                }
              };
            }
            if (IS.array(newOpts)) {
              newOpts = parseTree(newOpts, false);
            }
            output = extend.deep.notKeys('children').notDeep('relatedInstance').transform(globalOptsTransform).clone(currentOpts, newOpts);
            currentChildren = currentOpts.children;
            newChildren = (newOpts != null ? newOpts.children : void 0) || [];
            output.children = [];

            /* istanbul ignore next */
            if (IS.array(newChildren)) {
              for (index = j = 0, ref1 = Math.max(currentChildren.length, newChildren.length); 0 <= ref1 ? j < ref1 : j > ref1; index = 0 <= ref1 ? ++j : --j) {
                needsTemplateWrap = noChanges = false;
                currentChild = currentChildren[index];
                newChild = newChildren[index];
                newChildProcessed = (function() {
                  switch (false) {
                    case !IS.template(newChild):
                      return newChild;
                    case !IS.array(newChild):
                      return needsTemplateWrap = parseTree(newChild, false);
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
                  newChildProcessed = currentChild ? currentChild.extend(newChildProcessed, globalOpts) : new QuickTemplate(extend.deep.clone(configSchema, newChildProcessed));
                }
                output.children.push(newChildProcessed);
              }
            } else if (IS.object(newChildren)) {
              output.children = extendByRef(newChildren, currentChildren, globalOpts);
              remainingNewChildren = newChildren;
              for (ref in remainingNewChildren) {
                newChild = remainingNewChildren[ref];
                newChildProcessed = IS.objectPlain(newChildProcessed) ? newChild : parseTree(newChild);
                output.children.push(new QuickTemplate(extend.deep.clone(configSchema, newChildProcessed)));
                delete remainingNewChildren[ref];
              }
            }
            return output;
          };
          extendByRef = function(newChildrenRefs, currentChildren, globalOpts) {
            var currentChild, j, len, newChild, newChildProcessed, output, theNewChildren;
            if (!currentChildren.length) {
              return currentChildren;
            } else {
              output = [];
              for (j = 0, len = currentChildren.length; j < len; j++) {
                currentChild = currentChildren[j];
                if (newChild = newChildrenRefs[currentChild.ref]) {
                  newChildProcessed = currentChild.extend(newChild, globalOpts);
                  delete newChildrenRefs[currentChild.ref];
                } else {
                  newChildProcessed = globalOpts ? currentChild.extend(null, globalOpts) : currentChild;
                }
                newChildProcessed._config.children = theNewChildren = extendByRef(newChildrenRefs, newChildProcessed.children);
                output.push(newChildProcessed);
              }
              return output;
            }
          };
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
                  output.options = tree[1] ? extend.deep.clone(tree[1]) : null;
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
                  children: configSchema.children
                };
              case !IS.domEl(tree):
                return {
                  type: tree.nodeName.toLowerCase(),
                  ref: tree.id,
                  options: extend.clone.keys(allowedTemplateOptions)(tree),
                  children: configSchema.children.map.call(tree.childNodes, QuickDom.template)
                };
              case !IS.quickDomEl(tree):
                return {
                  type: tree.type,
                  ref: tree.ref,
                  options: extend.clone.deep.notKeys('relatedInstance')(tree.options),
                  children: tree.children.map(QuickDom.template)
                };
              case !IS.template(tree):
                return extendTemplate(tree._config);
              default:
                throw new Error(parseErrorPrefix + " (array || string || domEl || quickDomEl || template), got " + (String(tree)));
            }
          };
          parseErrorPrefix = 'Template Parse Error: expected';
          pholderRegex = /\{\{.+?\}\}/g;
          configSchema = {
            type: 'div',
            ref: void 0,
            options: {},
            children: []
          };
          QuickTemplate = (function() {
            function QuickTemplate(config, isTree) {
              this._config = isTree ? parseTree(config) : config;
            }

            QuickTemplate.prototype.spawn = function(newValues, globalOpts) {
              var opts;
              opts = newValues || globalOpts ? extendTemplate(this._config, newValues, globalOpts) : this._config;
              return QuickDom.apply(null, [opts.type, opts.options].concat(slice.call(opts.children)));
            };

            QuickTemplate.prototype.extend = function(newValues, globalOpts) {
              return new QuickTemplate(extendTemplate(this._config, newValues, globalOpts));
            };

            return QuickTemplate;

          })();
          if (QuickTemplate.name == null) {
            QuickTemplate.name = 'QuickTemplate';
          }
          Object.keys(configSchema).forEach(function(key) {
            return Object.defineProperty(QuickTemplate.prototype, key, {
              get: function() {
                return this._config[key];
              }
            });
          });
          Object.defineProperty(QuickTemplate.prototype, 'child', {
            get: function() {
              return this._childRefs || _getChildRefs(this);
            }
          });
          shortcuts = ['link:a', 'anchor:a', 'a', 'text', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'section', 'button', 'br', 'ul', 'ol', 'li', 'fieldset', 'input', 'textarea', 'select', 'option', 'form', 'frame', 'hr', 'iframe', 'img', 'picture', 'main', 'nav', 'meta', 'object', 'pre', 'style', 'table', 'tbody', 'th', 'tr', 'td', 'tfoot', 'video'];
          fn1 = function(shortcut) {
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
          for (j = 0, len = shortcuts.length; j < len; j++) {
            shortcut = shortcuts[j];
            fn1(shortcut);
          }
          QuickDom.version = '1.0.30';

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
      m[4] = function(exports){
			var module = {exports:exports};
			(function(t){return function(){var l=function(g,m,l,r){r=function(h){return l[h]?m[h]:(l[h]=1,m[h]={},m[h]=g[h](m[h]))};g[1]=function(h){var g=r(2);var c=function(a){var k;var b={};for(k in a){var d=a[k];b[k]=d}return b};var p=function(a){var b;if(a){var c={};if("object"!==typeof a)c[a]=!0;else{Array.isArray(a)||(a=Object.keys(a));var d=0;for(b=a.length;d<b;d++){var e=a[d];c[e]=!0}}return c}};var e=function(a){var k=a.target?function(){for(var a=arguments.length,b=-1,c=Array(a);++b<a;)c[b]=arguments[b];
			return g(k.options,k.options.target,c)}:function(a){for(var b=arguments.length,c=0,e=Array(b);++c<b;)e[c]=arguments[c];return g(k.options,a,e)};k.options=a;Object.defineProperties(k,b);return k};var b={deep:{get:function(){var a=c(this.options);a.deep=!0;return e(a)}},own:{get:function(){var a=c(this.options);a.own=!0;return e(a)}},allowNull:{get:function(){var a=c(this.options);a.allowNull=!0;return e(a)}},nullDeletes:{get:function(){var a=c(this.options);a.nullDeletes=!0;return e(a)}},concat:{get:function(){var a=
			c(this.options);a.concat=!0;return e(a)}},clone:{get:function(){var a=c(this.options);a.target={};return e(a)}},notDeep:{get:function(){var a=c(this.options);return function(b){a.notDeep=p(b);return e(a)}}},deepOnly:{get:function(){var a=c(this.options);return function(b){a.deepOnly=p(b);return e(a)}}},keys:{get:function(){var a=c(this.options);return function(b){a.keys=p(b);return e(a)}}},notKeys:{get:function(){var a=c(this.options);return function(b){a.notKeys=p(b);return e(a)}}},transform:{get:function(){var a=
			c(this.options);return function(b){"function"===typeof b?a.globalTransform=b:b&&"object"===typeof b&&(a.transforms=b);return e(a)}}},filter:{get:function(){var a=c(this.options);return function(b){"function"===typeof b?a.globalFilter=b:b&&"object"===typeof b&&(a.filters=b);return e(a)}}}};return h=e({})};g[2]=function(h){var g;var c=function(b){return Array.isArray(b)};var p=function(b){return b&&"[object Object]"===Object.prototype.toString.call(b)||c(b)};var e=function(b,a,c){if(b.deep)return b.notDeep?
			!b.notDeep[a]:!0;if(b.deepOnly)return b.deepOnly[a]||c&&e(b,c)};return h=g=function(b,a,k,h){var d,l;if(!a||"object"!==typeof a&&"function"!==typeof a)a={};var m=0;for(l=k.length;m<l;m++){var n=k[m];if(null!=n)for(d in n){var f=n[d];var q=a[d];if(!(f===a||void 0===f||null===f&&!b.allowNull&&!b.nullDeletes||b.keys&&!b.keys[d]||b.notKeys&&b.notKeys[d]||b.own&&!n.hasOwnProperty(d)||b.globalFilter&&!b.globalFilter(f,d,n)||b.filters&&b.filters[d]&&!b.filters[d](f,d,n)))if(null===f&&b.nullDeletes)delete a[d];
			else switch(b.globalTransform&&(f=b.globalTransform(f,d,n)),b.transforms&&b.transforms[d]&&(f=b.transforms[d](f,d,n)),!1){case !(b.concat&&c(f)&&c(q)):a[d]=q.concat(f);break;case !(e(b,d,h)&&p(f)):q=p(q)?q:c(f)?[]:{};a[d]=g(b,q,[f],d);break;default:a[d]=f}}}return a}};return r};l=l({},{},{});return function(){var g=l(1);null!=("undefined"!==typeof module&&null!==module?module.exports:void 0)?module.exports=g:"function"===typeof define&&define.amd?define(["smart-extend"],function(){return g}):window.extend=
			g}()}})(this)();
			
			return module.exports;
		};
      m[5] = function(exports) {
        var module = {exports:exports};
        module.exports = ['_construct', '_getValue', '_setValue', '_createElements', '_attachBindings', 'validate'];
        return module.exports;
      };
      m[9] = function(exports) {
        var module = {exports:exports};
        module.exports = {
          whiteSpace: /\s+/,
          numeric: /^\d$/,
          letter: /^[a-zA-Z]$/,
          widenumeric: /^[0-9\!#\$\%\*\+\/\=\?\^\{\|\}\(\)\~\-\.]$/,
          alphanumeric: /^[0-9A-Za-z\!#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\(\)\~\-\ ]$/
        };
        return module.exports;
      };
      m[12] = function(exports) {
        var module = {exports:exports};
        var DOM;
        DOM = _s$m(3);
        module.exports = {
          checkmark: DOM.template([
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
          ]),
          angleDown: DOM.template([
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
          ]),
          caretUp: DOM.template([
            '*svg', {
              attrs: {
                viewBox: '0 0 512 512',
                tabindex: -1,
                focusable: false
              },
              style: {
                width: '100%',
                height: '100%'
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
          ]),
          caretDown: DOM.template([
            '*svg', {
              attrs: {
                viewBox: '0 0 512 512',
                tabindex: -1,
                focusable: false
              },
              style: {
                width: '100%',
                height: '100%'
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
          ])
        };
        return module.exports;
      };
      m[15] = function(exports) {
        var module = {exports:exports};
        module.exports = {
          red: '#cc4820',
          green: '#72c322',
          orange: '#ff9c00',
          black: '#181818',
          grey: '#909090',
          grey_semi_light: '#bebebe',
          grey_light: '#d3d3d3'
        };
        return module.exports;
      };
      m[16] = function(exports) {
        var module = {exports:exports};
        module.exports = {
          fontFamily: 'system-ui, sans-serif',
          templates: {},
          label: false,
          alwaysShowHelp: false,
          help: '',
          defaultValue: null,
          width: '100%'
        };
        return module.exports;
      };
      m[17] = function(exports) {
        var module = {exports:exports};
        var DOM, Dropdown, IS, KEYCODES, Mask, SimplyBind, TextField, helpers;
        Dropdown = _s$m(30);
        Mask = (function(_this) {
          return function(exports) {
            var module = {exports:exports};
            var IS, REGEX, helpers, stringDistance, testChar, validPatternChars;
            REGEX = _s$m(9);
            IS = _s$m(2);
            helpers = _s$m(1);
            stringDistance = (function(exports){
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
            validPatternChars = ['1', '#', 'a', 'A', '*', '^'];
            Mask = function(pattern, placeholder1, guide) {
              this.pattern = pattern;
              this.placeholder = placeholder1;
              this.guide = guide;
              this.minRequiredCount = 0;
              this.optionalsOffset = 0;
              this.lastValid = null;
              this.lastInput = '';
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
                    } else {
                      minRequiredCount++;
                    }
                    if (this.pattern[patternPos + 1] === '+') {
                      this.repeatables.push(patternPos - offset);
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
              var changeDistance, changeIndex, inputChar, inputPos, isBackwards, isLiteral, isOptional, isRepeatable, isValid, lastInput, nextIsValid, output, outputRaw, outputStrict, patternChar, patternLength, patternPos, patternPosCurrent, prevPatternPos;
              changeIndex = helpers.getIndexOfFirstDiff(this.value, input);
              changeDistance = stringDistance(this.value, input);
              isBackwards = input.length === 1 && this.valueRaw.length === 0 ? false : this.value.length > input.length;
              if (!isBackwards) {
                lastInput = input.slice(changeIndex, changeIndex + changeDistance);
              }
              output = '';
              outputRaw = '';
              outputStrict = '';
              patternLength = this.pattern.length;
              patternPos = 0;
              inputPos = 0;
              if (!changeDistance && this.value) {
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
                if (input && !inputChar && !this.guide) {
                  break;
                }
                switch (false) {
                  case !isLiteral:
                    output += patternChar;
                    outputStrict += patternChar;
                    if (patternChar === inputChar) {
                      if (!((helpers.includes(validPatternChars, patternChar) && !isBackwards) || (changeDistance >= this.literals.length && changeDistance > 1 && this.valueRaw.length))) {
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
                        if (!(isOptional || !this.guide)) {
                          output += this.placeholder;
                          outputStrict += this.placeholder;
                        }
                      } else if (isOptional) {
                        inputPos++;
                      }
                      if (!isOptional) {
                        inputPos++;
                      }
                    } else {
                      if (patternChar === 'A' || patternChar === '^') {
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
                      if (isRepeatable && !nextIsValid && helpers.includes(this.literals, patternPos) && input[inputPos] !== this.pattern[patternPos]) {
                        inputPos++;
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
              if (lastInput) {
                this.lastInput = lastInput;
              }
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
              var changeIndex, charPos, diff, isBackwards, offset, value, valueStrict;
              isBackwards = prevCursorPos > cursorPos;
              if (cursorPos <= this.firstNonLiteral) {
                diff = this.firstNonLiteral - cursorPos >= 1 && !isBackwards || this.firstNonLiteral === 1 ? 1 : 0;
                prevCursorPos = this.firstNonLiteral + diff + (prevCursorPos - cursorPos);
                cursorPos = this.firstNonLiteral + diff;
              }
              offset = 0;
              value = this.value.slice(0, cursorPos);
              valueStrict = this.valueStrict.slice(0, cursorPos);
              changeIndex = helpers.getIndexOfFirstDiff(this.value, this.prev.value);
              charPos = 0;
              while (charPos < cursorPos) {
                if (value[charPos] !== valueStrict[charPos - offset]) {
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
                  if (helpers.includes(this.literals, cursorPos - offset - 1) && valueStrict[cursorPos - offset - 1] === this.lastInput) {
                    return cursorPos;
                  } else {
                    return Math.max(cursorPos - 1, this.firstNonLiteral);
                  }
                }
                if (helpers.includes(this.repeatables, cursorPos - offset)) {
                  return cursorPos;
                }
                if (helpers.includes(this.repeatables, changeIndex - offset)) {
                  return cursorPos;
                }
                if (helpers.includes(this.literals, cursorPos - offset)) {
                  return cursorPos + (offset === 0 ? 1 : 0);
                }
                if (helpers.includes(this.literals, changeIndex - 1) && changeIndex === cursorPos) {
                  return cursorPos + 1;
                }
              }
              return cursorPos;
            };
            Mask.prototype.isLiteralAtPos = function(targetPos) {
              return helpers.includes(this.literals, targetPos);
            };
            Mask.prototype.isRepeatableAtPos = function(targetPos) {
              if (targetPos !== 0) {
                targetPos -= this.optionalsOffset + 1;
              }
              return helpers.includes(this.repeatables, targetPos);
            };
            testChar = function(input, patternChar) {
              switch (patternChar) {
                case '1':
                  return REGEX.numeric.test(input);
                case '#':
                  return REGEX.widenumeric.test(input);
                case 'a':
                case 'A':
                  return REGEX.letter.test(input);
                case '*':
                case '^':
                  return REGEX.alphanumeric.test(input);
                default:
                  return false;
              }
            };
            module.exports = Mask;
            return module.exports;
          };
        })(this)({});
        KEYCODES = _s$m(18);
        helpers = _s$m(1);
        IS = _s$m(2);
        DOM = _s$m(3);
        SimplyBind = _s$m(45);
        TextField = Object.create(null);
        TextField._templates = (function(_this) {
          return function(exports) {
            var module = {exports:exports};
            var COLORS;
            DOM = _s$m(3);
            COLORS = _s$m(15);
            helpers = _s$m(1);
            module.exports = {
              field: DOM.template([
                'div', {
                  ref: 'field',
                  style: {
                    position: 'relative',
                    display: 'none',
                    boxSizing: 'border-box',
                    fontFamily: function(field) {
                      return field.settings.fontFamily;
                    },
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
                    style: {
                      position: 'absolute',
                      zIndex: 1,
                      top: function(field) {
                        return parseFloat(field.el.child.innerwrap.styleSafe('height')) / 6;
                      },
                      left: function(field) {
                        var ref1;
                        return parseFloat((ref1 = field.el.child.icon) != null ? ref1.styleSafe('width') : void 0) || 0;
                      },
                      padding: '0 12px',
                      fontFamily: 'inherit',
                      fontSize: '11px',
                      fontWeight: 600,
                      lineHeight: '1em',
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
                      height: '46px',
                      backgroundColor: 'white',
                      borderWidth: '1px',
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
                      style: {
                        position: 'relative',
                        zIndex: 3,
                        display: 'inline-block',
                        verticalAlign: 'top',
                        width: function(field) {
                          var subtract;
                          if (!field.settings.autoWidth) {
                            subtract = '';
                            if (field.el.child.icon) {
                              subtract += " -" + (field.el.child.icon.raw.styleSafe('width', true));
                            }
                            if (field.el.child.checkmark) {
                              subtract += " -" + (field.el.child.checkmark.styleSafe('width', true));
                            }
                            return "calc(100% + (" + (subtract || '0px') + "))";
                          }
                        },
                        height: function() {
                          return this.parent.styleSafe('height');
                        },
                        margin: '0',
                        padding: '12px',
                        backgroundColor: 'transparent',
                        appearance: 'none',
                        border: 'none',
                        outline: 'none',
                        fontFamily: 'inherit',
                        fontSize: '14px',
                        color: COLORS.black,
                        boxSizing: 'border-box',
                        boxShadow: 'none',
                        whiteSpace: 'nowrap',
                        transform: 'translateY(0)',
                        transition: 'transform 0.2s, -webkit-transform 0.2s',
                        $filled: {
                          $showLabel: {
                            transform: function(field) {
                              var label, paddingTop, translation;
                              if ((label = field.el.child.label) && label.style('position') === 'absolute') {
                                paddingTop = this._inserted ? this.styleParsed('paddingTop') : helpers.parseCssShorthandValue(this.styleSafe('padding')).top;
                                translation = (label.height + label.styleParsed('top')) - paddingTop - 2;
                                return "translateY(" + translation + "px)";
                              }
                            }
                          }
                        },
                        $showCheckmark: {
                          padding: '0 44px 0 12px'
                        }
                      }
                    }
                  ], [
                    'div', {
                      ref: 'placeholder',
                      style: {
                        position: 'absolute',
                        zIndex: 2,
                        top: '0px',
                        left: function(field) {
                          var ref1;
                          return ((ref1 = field.el.child.icon) != null ? ref1.styleSafe('width') : void 0) || 0;
                        },
                        fontFamily: function(field) {
                          return field.el.child.input.styleSafe('fontFamily');
                        },
                        fontSize: function(field) {
                          return field.el.child.input.styleSafe('fontSize');
                        },
                        padding: function(field) {
                          var horiz, verti;
                          horiz = field.el.child.input.styleParsed('paddingLeft');
                          verti = field.el.child.input.styleParsed('paddingTop');
                          return (verti + 3) + "px " + horiz + "px";
                        },
                        color: COLORS.black,
                        opacity: 0.5,
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
                    style: {
                      position: 'absolute',
                      top: function(field) {
                        return this.parent.styleParsed('height') + 4;
                      },
                      left: '0px',
                      fontFamily: 'inherit',
                      fontSize: '11px',
                      color: COLORS.grey,
                      display: 'none',
                      $showError: {
                        color: COLORS.red,
                        display: 'block'
                      },
                      $showHelp: {
                        display: 'block'
                      }
                    }
                  }
                ]
              ]),
              checkmark: DOM.template([
                'div', {
                  ref: 'checkmark',
                  style: {
                    position: 'relative',
                    zIndex: 4,
                    display: 'none',
                    width: '38px',
                    height: '100%',
                    paddingTop: function() {
                      return this.parent.styleParsed('height') / 2 - 13;
                    },
                    paddingRight: '12px',
                    verticalAlign: 'top',
                    boxSizing: 'border-box',
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
                      backgroundColor: 'white',
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
                      ref: 'checkmark_mask2',
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
                ]
              ])
            };
            return module.exports;
          };
        })(this)({});
        TextField._defaults = (function(_this) {
          return function(exports) {
            var module = {exports:exports};
            module.exports = {
              mask: false,
              maskPlaceholder: ' ',
              maskGuide: true,
              placeholder: true,
              validWhenIsChoice: false,
              validWhenRegex: false,
              autoWidth: false,
              maxWidth: '100%',
              checkmark: true,
              keyboard: 'text',
              dropdownOptions: {
                storeSelected: false,
                lockScroll: false
              },
              choices: null
            };
            return module.exports;
          };
        })(this)({});
        TextField._construct = function() {
          if (this._value == null) {
            this._value = '';
          }
          this.state.typing = false;
          this.cursor = {
            prev: 0,
            current: 0
          };
          if (!this.settings.mask) {
            this.settings.mask = (function() {
              switch (this.settings.keyboard) {
                case 'number':
                case 'phone':
                case 'tel':
                  return '1+';
                case 'email':
                  return '*+@*+.aa+';
              }
            }).call(this);
          }
          if (this.settings.mask) {
            this.mask = new Mask(this.settings.mask, this.settings.maskPlaceholder, this.settings.maskGuide);
          }
        };
        TextField._getValue = function() {
          return this._value;
        };
        TextField._setValue = function(newValue) {
          if (IS.string(newValue) || IS.number(newValue)) {
            return this._value = newValue;
          }
        };
        TextField._createElements = function() {
          var forceOpts, iconChar;
          forceOpts = {
            relatedInstance: this,
            styleAfterInsert: true
          };
          this.el = this._templates.field.spawn(this.settings.templates.field, forceOpts);
          if (this.settings.choices) {
            this.dropdown = new Dropdown(this.settings.choices, this);
            this.dropdown.appendTo(this.el.child.innerwrap);
          }
          if (this.settings.icon) {
            if (IS.string(this.settings.icon)) {
              iconChar = this.settings.icon;
            }
            this._templates.icon.spawn(this.settings.templates.icon, forceOpts, iconChar).insertBefore(this.el.child.input);
          }
          if (this.settings.checkmark) {
            this._templates.checkmark.spawn(this.settings.templates.checkmark, forceOpts).insertAfter(this.el.child.input);
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
        };
        TextField._attachBindings = function() {
          this._attachBindings_elState();
          this._attachBindings_display();
          this._attachBindings_display_autoWidth();
          this._attachBindings_value();
          this._attachBindings_autocomplete();
          this._attachBindings_stateTriggers();
        };
        TextField._attachBindings_elState = function() {
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
        TextField._attachBindings_display = function() {
          SimplyBind('showError', {
            updateOnBind: false
          }).of(this.state).to((function(_this) {
            return function(msg, prevMsg) {
              switch (false) {
                case !IS.string(msg):
                  return _this.state.help = msg;
                case !IS.string(prevMsg):
                  return _this.state.help = _this.settings.help;
              }
            };
          })(this));
          SimplyBind('label').of(this.state).to('text').of(this.el.child.label).and.to('showLabel').of(this.state);
          SimplyBind('help').of(this.state).to('text').of(this.el.child.help);
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
        };
        TextField._attachBindings_display_autoWidth = function() {
          SimplyBind('width', {
            updateEvenIfSame: true
          }).of(this.state).to((function(_this) {
            return function(width) {
              return (_this.settings.autoWidth ? _this.el.child.input : _this.el).style({
                width: width
              });
            };
          })(this));
          if (this.settings.autoWidth) {
            SimplyBind('_value', {
              updateEvenIfSame: true,
              updateOnBind: false
            }).of(this).to('width').of(this.state).transform((function(_this) {
              return function() {
                return (_this._getInputAutoWidth()) + "px";
              };
            })(this)).updateOn('event:inserted').of(this);
          }
        };
        TextField._attachBindings_value = function() {
          SimplyBind('value').of(this.el.child.input.raw).transformSelf((function(_this) {
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
          })(this));
          SimplyBind('_value').of(this).to('value').of(this.el.child.input.raw).bothWays().and.to('valueRaw').of(this).transform((function(_this) {
            return function(value) {
              if (_this.mask) {
                return _this.mask.valueRaw;
              } else {
                return value;
              }
            };
          })(this));
          SimplyBind('valueRaw').of(this).to((function(_this) {
            return function(value) {
              _this.state.filled = !!value;
              if (value) {
                _this.state.interacted = true;
              }
              _this.state.valid = _this.validate();
              return _this.emit('input');
            };
          })(this));
          if (this.settings.mask) {
            SimplyBind('value', {
              updateEvenIfSame: true
            }).of(this.el.child.input.raw).to((function(_this) {
              return function(value) {
                if (_this.state.focused) {
                  return _this._scheduleCursorReset();
                }
              };
            })(this));
            SimplyBind('event:keydown').of(this.el.child.input).to((function(_this) {
              return function(event) {
                var current;
                current = _this.selection().start;
                return _this.selection({
                  'start': current + 1,
                  'end': current + 1
                });
              };
            })(this)).condition((function(_this) {
              return function(event) {
                var currentSelection;
                currentSelection = _this.selection();
                return _this._value && currentSelection.start === currentSelection.end && event.keyCode !== KEYCODES["delete"] && !KEYCODES.anyArrow(event.keyCode) && _this.mask.isLiteralAtPos(currentSelection.start) && !_this.mask.isRepeatableAtPos(currentSelection.start);
              };
            })(this));
          }
        };
        TextField._attachBindings_autocomplete = function() {
          if (this.dropdown) {
            SimplyBind('typing', {
              updateEvenIfSame: true
            }).of(this.state).to((function(_this) {
              return function(isTyping) {
                if (isTyping) {
                  if (!_this.valueRaw) {
                    return;
                  }
                  _this.dropdown.isOpen = true;
                  return SimplyBind('event:click').of(document).once.to(function() {
                    return _this.dropdown.isOpen = false;
                  }).condition(function(event) {
                    return !DOM(event.target).parentMatching(function(parent) {
                      return parent === _this.el.child.innerwrap;
                    });
                  });
                } else {
                  return setTimeout(function() {
                    return _this.dropdown.isOpen = false;
                  }, 300);
                }
              };
            })(this));
            SimplyBind('valueRaw', {
              updateOnBind: false
            }).of(this).to((function(_this) {
              return function(value) {
                var j, len, option, ref1, shouldBeVisible;
                ref1 = _this.dropdown.options;
                for (j = 0, len = ref1.length; j < len; j++) {
                  option = ref1[j];
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
                _this._value = selectedOption.label;
                if (selectedOption.value !== selectedOption.label) {
                  _this.valueRaw = selectedOption.value;
                }
                _this.dropdown.isOpen = false;
                return _this.selection(_this.el.child.input.raw.value.length);
              };
            })(this));
          }
        };
        TextField._attachBindings_stateTriggers = function() {
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
        TextField._scheduleCursorReset = function() {
          var currentCursor, diffIndex, newCursor;
          diffIndex = helpers.getIndexOfFirstDiff(this.mask.value, this.mask.prev.value);
          currentCursor = this.cursor.current;
          newCursor = this.mask.normalizeCursorPos(currentCursor, this.cursor.prev);
          if (newCursor !== currentCursor) {
            this.selection(newCursor);
          }
        };
        TextField._getInputAutoWidth = function() {
          var inputWidth, labelWidth;
          if (this._value) {
            this.el.child.input.style('width', 0);
            this.el.child.input.raw.scrollLeft = 1e+10;
            inputWidth = Math.max(this.el.child.input.raw.scrollLeft + this.el.child.input.raw.offsetWidth, this.el.child.input.raw.scrollWidth) + 2;
            labelWidth = this.settings.label && this.el.child.label.styleSafe('position') === 'absolute' ? this.el.child.label.rect.width : 0;
          } else {
            inputWidth = this.el.child.placeholder.rect.width;
            labelWidth = 0;
          }
          return Math.min(this._getMaxWidth(), Math.max(inputWidth, labelWidth));
        };
        TextField._getMaxWidth = function() {
          var maxWidth, parent, parentWidth;
          if (typeof this.settings.maxWidth === 'number') {
            maxWidth = this.settings.maxWidth;
          } else if (typeof this.settings.maxWidth === 'string') {
            maxWidth = parseFloat(this.settings.maxWidth);
            if (helpers.includes(this.settings.maxWidth, '%')) {
              if (parent = this.el.parent) {
                parentWidth = parent.styleParsed('width') - parent.styleParsed('paddingLeft') - parent.styleParsed('paddingRight') - 2;
                maxWidth = parentWidth * (maxWidth / 100);
              } else {
                maxWidth = 0;
              }
            }
          }
          return maxWidth || 2e308;
        };
        TextField.validate = function(providedValue) {
          var matchingOption, ref1;
          if (providedValue == null) {
            providedValue = this._value;
          }
          switch (false) {
            case !(this.settings.validWhenRegex && IS.regex(this.settings.validWhenRegex)):
              return this.settings.validWhenRegex.test(providedValue);
            case !(this.settings.validWhenIsChoice && ((ref1 = this.settings.choices) != null ? ref1.length : void 0)):
              matchingOption = this.settings.choices.filter(function(option) {
                return option.value === providedValue;
              });
              return !!matchingOption.length;
            case !this.mask:
              return this.mask.validate(providedValue);
            default:
              return !!providedValue;
          }
        };
        TextField.selection = function(arg) {
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
            this.el.child.input.raw.setSelectionRange(start, end);
          } else {
            return {
              'start': this.el.child.input.raw.selectionStart,
              'end': this.el.child.input.raw.selectionEnd
            };
          }
        };
        TextField.focus = function() {
          return this.el.child.input.raw.focus();
        };
        TextField.blur = function() {
          return this.el.child.input.raw.blur();
        };
        module.exports = TextField;
        return module.exports;
      };
      m[18] = function(exports) {
        var module = {exports:exports};
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
          anyArrow: function(code) {
            return code === keyCodes.up || code === keyCodes.down || code === keyCodes.left || code === keyCodes.right;
          },
          anyModifier: function(code) {
            return code === keyCodes.ctrl || code === keyCodes.alt || code === keyCodes.shift || code === keyCodes["super"] || code === keyCodes.super2;
          }
        };
        return module.exports;
      };
      m[24] = function(exports) {
        var module = {exports:exports};
        var ChoiceField, DOM, IS, SimplyBind, helpers;
        helpers = _s$m(1);
        IS = _s$m(2);
        DOM = _s$m(3);
        SimplyBind = _s$m(45);
        ChoiceField = Object.create(null);
        ChoiceField._templates = (function(_this) {
          return function(exports) {
            var module = {exports:exports};
            var COLORS;
            DOM = _s$m(3);
            COLORS = _s$m(15);
            module.exports = {
              field: DOM.template([
                'div', {
                  ref: 'field',
                  style: {
                    position: 'relative',
                    display: 'none',
                    width: function(field) {
                      return field.state.width;
                    },
                    boxSizing: 'border-box',
                    fontFamily: function(field) {
                      return field.settings.fontFamily;
                    },
                    $visible: {
                      $hasVisibleOptions: {
                        display: 'inline-block'
                      }
                    },
                    $showError: {
                      animation: '0.2s fieldErrorShake'
                    }
                  }
                }, [
                  'div', {
                    ref: 'label',
                    style: {
                      display: 'none',
                      marginBottom: '12px',
                      fontFamily: 'inherit',
                      fontSize: '13px',
                      fontWeight: 600,
                      textAlign: 'left',
                      color: COLORS.black,
                      cursor: 'default',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      $showLabel: {
                        display: 'block'
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
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }
                  }
                ], [
                  'div', {
                    ref: 'help',
                    style: {
                      marginTop: '10px',
                      fontFamily: 'inherit',
                      fontSize: '11px',
                      color: COLORS.grey,
                      display: 'none',
                      $showError: {
                        color: COLORS.red,
                        display: 'block'
                      },
                      $showHelp: {
                        display: 'block'
                      }
                    }
                  }
                ]
              ]),
              choiceGroup: DOM.template([
                'div', {
                  ref: 'choiceGroup',
                  style: {
                    marginBottom: function(field) {
                      return field.settings.spacing;
                    },
                    userSelect: 'none',
                    fontSize: '0',
                    whiteSpace: 'nowrap'
                  }
                }
              ]),
              choice: DOM.template([
                'div', {
                  ref: 'choice',
                  style: {
                    position: 'relative',
                    display: 'inline-block',
                    width: 'auto',
                    marginLeft: function(field) {
                      if (this.index) {
                        return "calc(100% - (100% - " + field.settings.spacing + "px))";
                      }
                    },
                    padding: '0 12px',
                    borderRadius: '2px',
                    backgroundColor: 'white',
                    fontFamily: 'inherit',
                    textAlign: 'center',
                    color: COLORS.black,
                    boxSizing: 'border-box',
                    verticalAlign: 'top',
                    cursor: 'pointer',
                    $definedWidth: {
                      width: function(field) {
                        return "calc((100% - " + (field.settings.spacing * (field.settings.perGroup - 1)) + "px) / " + field.settings.perGroup + ")";
                      }
                    },
                    $selected: {
                      color: COLORS.orange
                    },
                    $unavailable: {
                      display: 'none'
                    },
                    $disabled: {
                      cursor: 'not-allowed',
                      opacity: 0.7,
                      color: COLORS.grey
                    }
                  }
                }, [
                  'div', {
                    ref: 'border',
                    style: {
                      position: 'absolute',
                      zIndex: 2,
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: COLORS.grey_light,
                      borderRadius: '2px',
                      boxSizing: 'border-box',
                      $selected: {
                        borderColor: 'inherit',
                        borderWidth: '2px'
                      },
                      $disabled: {
                        borderColor: COLORS.grey_light
                      }
                    }
                  }
                ], [
                  'div', {
                    ref: 'label',
                    style: {
                      position: 'relative',
                      display: 'block',
                      padding: '15px 0px',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      fontWeight: '500'
                    }
                  }
                ]
              ]),
              choiceIcon: DOM.template([
                'div', {
                  ref: 'icon',
                  style: {
                    position: 'absolute',
                    top: '50%',
                    display: 'block',
                    fontSize: '20px',
                    opacity: 0.16,
                    transform: 'translateY(-50%)'
                  }
                }
              ])
            };
            return module.exports;
          };
        })(this)({});
        ChoiceField._defaults = (function(_this) {
          return function(exports) {
            var module = {exports:exports};
            module.exports = {
              validWhenSelected: false,
              validWhenIsChoice: false,
              showSelectAll: false,
              perGroup: 7,
              spacing: 8,
              choices: []
            };
            return module.exports;
          };
        })(this)({});
        ChoiceField._construct = function() {
          var ref1;
          if (!((ref1 = this.settings.choices) != null ? ref1.length : void 0)) {
            throw new Error("Choices were not provided for choice field '" + (this.settings.label || this.ID) + "'");
          }
          this._value = this.settings.multiple ? [] : null;
          this.lastSelected = null;
          this.visibleOptionsCount = 0;
          this.choices = this.settings.choices;
          this.settings.perGroup = Math.min(this.settings.perGroup, this.choices.length + (this.settings.multiple && this.settings.showSelectAll ? 1 : 0));
        };
        ChoiceField._getValue = function() {
          var ref1;
          if (!this.settings.multiple) {
            return (ref1 = this._value) != null ? ref1.value : void 0;
          } else {
            return this._value.map(function(choice) {
              return choice.value;
            });
          }
        };
        ChoiceField._setValue = function(newValue) {
          var j, len, value;
          if (!this.settings.multiple) {
            this.setOptionFromString(newValue);
          } else {
            if (!IS.array(newValue)) {
              newValue = [].concat(newValue);
            }
            for (j = 0, len = newValue.length; j < len; j++) {
              value = newValue[j];
              this.setOptionFromString(value);
            }
          }
        };
        ChoiceField._createElements = function() {
          var choiceGroups, choices, forceOpts, perGroup;
          forceOpts = {
            relatedInstance: this,
            styleAfterInsert: true
          };
          this.el = this._templates.field.spawn(this.settings.templates.field, forceOpts);
          choices = this.settings.choices;
          perGroup = this.settings.perGroup;
          choiceGroups = Array(Math.ceil(choices.length / perGroup)).fill().map(function(s, index) {
            return choices.slice(index * perGroup, index * perGroup + perGroup);
          });
          choiceGroups.forEach((function(_this) {
            return function(choices, groupIndex) {
              var groupEl;
              groupEl = _this._templates.choiceGroup.spawn(_this.settings.templates.choiceGroup, forceOpts).appendTo(_this.el.child.innerwrap);
              return choices.forEach(function(choice, index) {
                var iconEl;
                choice.el = _this._templates.choice.spawn(_this.settings.templates.choice, forceOpts).appendTo(groupEl);
                if (choice.icon) {
                  iconEl = _this._templates.choiceIcon.spawn(_this.settings.templates.choiceIcon, forceOpts).insertBefore(choice.child.label);
                  iconEl.text = choice.icon;
                }
                choice.index = index;
                choice.el.index = index;
                choice.el.totalIndex = index * groupIndex;
                choice.el.prop('title', choice.label);
                choice.el.child.label.text = choice.label;
                choice.visible = true;
                choice.selected = false;
                if (choice.disabled == null) {
                  choice.disabled = false;
                }
                return choice.unavailable = false;
              });
            };
          })(this));
          this.el.child.innerwrap.raw._quickField = this;
        };
        ChoiceField._attachBindings = function() {
          this._attachBindings_elState();
          this._attachBindings_stateTriggers();
          this._attachBindings_display();
          this._attachBindings_value();
          this._attachBindings_choices();
        };
        ChoiceField._attachBindings_elState = function() {
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
        ChoiceField._attachBindings_stateTriggers = function() {
          SimplyBind('event:mouseenter').of(this.el).to((function(_this) {
            return function() {
              return _this.state.hovered = true;
            };
          })(this));
          SimplyBind('event:mouseleave').of(this.el).to((function(_this) {
            return function() {
              return _this.state.hovered = false;
            };
          })(this));
        };
        ChoiceField._attachBindings_display = function() {
          SimplyBind('width').of(this.state).to((function(_this) {
            return function(width) {
              return _this.el.style('width', width).state('definedWidth', width !== 'auto');
            };
          })(this));
          SimplyBind('showError', {
            updateOnBind: false
          }).of(this.state).to((function(_this) {
            return function(msg, prevMsg) {
              switch (false) {
                case !IS.string(msg):
                  return _this.state.help = msg;
                case !IS.string(prevMsg):
                  return _this.state.help = _this.settings.help;
              }
            };
          })(this));
          SimplyBind('label').of(this.state).to('text').of(this.el.child.label).and.to('showLabel').of(this.state);
          SimplyBind('help').of(this.state).to('text').of(this.el.child.help);
          SimplyBind('visibleOptionsCount').of(this).to((function(_this) {
            return function(count) {
              return _this.el.state('hasVisibleOptions', !!count);
            };
          })(this));
        };
        ChoiceField._attachBindings_value = function() {
          SimplyBind('_value').of(this).to((function(_this) {
            return function(selected) {
              _this.state.filled = !!(selected != null ? selected.length : void 0);
              if (_this.state.filled) {
                _this.state.interacted = true;
              }
              return _this.state.valid = _this.validate();
            };
          })(this));
          SimplyBind('array:_value', {
            updateOnBind: false
          }).of(this).to((function(_this) {
            return function() {
              return _this.emit('input');
            };
          })(this));
          SimplyBind('lastSelected', {
            updateOnBind: false,
            updateEvenIfSame: true
          }).of(this).to((function(_this) {
            return function(newChoice, prevChoice) {
              if (_this.settings.multiple) {
                if (newChoice.selected) {
                  newChoice.selected = false;
                  return helpers.removeItem(_this._value, newChoice);
                } else {
                  newChoice.selected = true;
                  return _this._value.push(newChoice);
                }
              } else if (newChoice !== prevChoice) {
                newChoice.selected = true;
                if (prevChoice != null) {
                  prevChoice.selected = false;
                }
                return _this._value = newChoice;
              }
            };
          })(this));
        };
        ChoiceField._attachBindings_choices = function() {
          this.choices.forEach((function(_this) {
            return function(choice) {
              var ref1;
              SimplyBind('visible').of(choice).to(function(visible) {
                return choice.el.state('visible', visible);
              }).and.to(function(visible) {
                return _this.visibleOptionsCount += visible ? 1 : -1;
              });
              SimplyBind('selected', {
                updateOnBind: false
              }).of(choice).to(function(selected) {
                return choice.el.state('selected', selected);
              });
              SimplyBind('disabled', {
                updateOnBind: false
              }).of(choice).to(function(disabled) {
                return choice.el.state('disabled', disabled);
              });
              SimplyBind('unavailable', {
                updateOnBind: false
              }).of(choice).to(function(unavailable) {
                return choice.el.state('unavailable', unavailable);
              }).and.to(function() {
                return _this.lastSelected = choice;
              }).condition(function(unavailable) {
                return unavailable && _this.settings.multiple && choice.selected;
              });
              SimplyBind('event:click').of(choice.el).to(function() {
                return _this.lastSelected = choice;
              }).condition(function() {
                return !choice.disabled;
              });
              if ((ref1 = choice.conditions) != null ? ref1.length : void 0) {
                choice.unavailable = true;
                choice.allFields = _this.allFields;
                return helpers.initConditions(choice, choice.conditions, function() {
                  return choice.unavailable = !helpers.validateConditions(choice.conditions);
                });
              }
            };
          })(this));
        };
        ChoiceField.validate = function(providedValue) {
          if (providedValue == null) {
            providedValue = this._value;
          }
          if (this.settings.multiple) {
            if (!IS.array(providedValue)) {
              providedValue = [].concat(providedValue);
            }
            if (!IS.object(providedValue[0])) {
              providedValue = providedValue.map(function(choice) {
                return choice.value;
              });
            }
          } else {
            if (IS.object(providedValue)) {
              providedValue = providedValue.value;
            }
          }
          switch (false) {
            case typeof this.settings.validWhenSelected !== 'number':
              return (providedValue != null ? providedValue.length : void 0) >= this.settings.validWhenSelected;
            case !this.settings.validWhenIsChoice:
              if (this.settings.multiple) {
                return helpers.includes(providedValue, this.settings.validWhenIsChoice);
              } else {
                return providedValue === this.settings.validWhenIsChoice;
              }
              break;
            default:
              return !!(providedValue != null ? providedValue.length : void 0);
          }
        };
        ChoiceField.findChoice = function(providedValue, byLabel) {
          var matches;
          matches = this.choices.filter(function(option) {
            return providedValue === (byLabel ? option.label : option.value);
          });
          return matches[0];
        };
        ChoiceField.findChoiceAny = function(providedValue) {
          return this.findChoice(providedValue) || this.findChoice(providedValue, true);
        };
        ChoiceField.setOptionFromString = function(providedValue, byLabel) {
          var targetOption;
          targetOption = this.findChoiceAny(providedValue, byLabel);
          if (targetOption && targetOption !== this.lastSelected) {
            if (!(this.settings.multiple && helpers.includes(this._value, targetOption))) {
              return this.lastSelected = targetOption;
            }
          }
        };
        module.exports = ChoiceField;
        return module.exports;
      };
      m[25] = function(exports) {
        var module = {exports:exports};
        var ChoiceField, SimplyBind, TrueFalseField, extend;
        extend = _s$m(4);
        SimplyBind = _s$m(45);
        ChoiceField = _s$m(24);
        TrueFalseField = Object.create(null);
        TrueFalseField._templates = (function(_this) {
          return function(exports) {
            var module = {exports:exports};
            extend = _s$m(4);
            ChoiceField = _s$m(24);
            module.exports = extend.clone.transform(function(field) {
              return field.extend();
            })(ChoiceField._templates);
            return module.exports;
          };
        })(this)({});
        TrueFalseField._defaults = (function(_this) {
          return function(exports) {
            var module = {exports:exports};
            module.exports = {
              validWhenSelected: false,
              validWhenIsChoice: false,
              validWhenTrue: true,
              choiceLabels: ['True', 'False'],
              choices: [
                {
                  value: true
                }, {
                  value: false
                }
              ],
              spacing: 8
            };
            return module.exports;
          };
        })(this)({});
        extend.keys(['_createElements', '_attachBindings', '_attachBindings_elState', '_attachBindings_stateTriggers', '_attachBindings_display', '_attachBindings_value', '_attachBindings_choices'])(TrueFalseField, ChoiceField);
        TrueFalseField._construct = function() {
          this.lastSelected = null;
          this.visibleOptionsCount = 2;
          this.choices = this.settings.choices;
          this.choices[0].label = this.settings.choiceLabels[0];
          this.choices[1].label = this.settings.choiceLabels[1];
          this.settings.perGroup = 2;
        };
        TrueFalseField._getValue = function() {
          if (this._value === null) {
            return null;
          } else {
            if (this._value.index === 0) {
              return true;
            } else {
              return false;
            }
          }
        };
        TrueFalseField._setValue = function(newValue) {
          var ref1;
          if (newValue === null) {
            this._value = null;
            if ((ref1 = this.lastSelected) != null) {
              ref1.selected = false;
            }
            return;
          }
          if (typeof newValue === 'string') {
            newValue = newValue.toLowerCase();
            if (newValue === 'false') {
              newValue = false;
            }
          }
          return this.lastSelected = newValue ? this.choices[0] : this.choices[1];
        };
        TrueFalseField.validate = function(providedValue) {
          if (providedValue == null) {
            providedValue = this._value;
          }
          if (typeof providedValue === 'string') {
            providedValue = this.findOption(providedValue);
          }
          switch (false) {
            case !this.settings.validWhenIsChoice:
              if (providedValue) {
                return this.settings.validWhenIsChoice === providedValue.value;
              } else {
                return false;
              }
              break;
            case !this.settings.validWhenSelected:
              return !!providedValue;
            case !this.settings.validWhenTrue:
              return (providedValue != null ? providedValue.index : void 0) === 0;
            default:
              return false;
          }
        };
        module.exports = TrueFalseField;
        return module.exports;
      };
      m[30] = function(exports) {
        var module = {exports:exports};
        var Dropdown, IS, KEYCODES, SimplyBind, extend, helpers;
        IS = _s$m(2);
        SimplyBind = _s$m(45);
        KEYCODES = _s$m(18);
        helpers = _s$m(1);
        extend = _s$m(4);
        Dropdown = function(options1, field1) {
          this.options = options1;
          this.field = field1;
          this.isOpen = false;
          this.settings = extend.deep.clone.keys(this._defaults).filter(this._settingFilters)(this._defaults, this.field.settings.dropdownOptions);
          this.selected = this.settings.multiple ? [] : null;
          this.lastSelected = null;
          this.currentHighlighted = null;
          this.visibleOptionsCount = 0;
          this.visibleOptions = [];
          this.els = {};
          this._selectedCallback = helpers.noop;
          this._createElements();
          this._attachBindings();
          return this;
        };
        Dropdown.prototype._templates = (function(_this) {
          return function(exports) {
            var module = {exports:exports};
            var DOM, SVG, globalDefaults;
            DOM = _s$m(3);
            SVG = _s$m(12);
            helpers = _s$m(1);
            globalDefaults = _s$m(16);
            module.exports = {
              container: DOM.template([
                'div', {
                  ref: 'dropdown',
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
                      $hasVisibleOptions: {
                        display: 'block'
                      }
                    }
                  }
                }
              ]),
              list: DOM.template([
                'div', {
                  ref: 'list',
                  passStateToChildren: false,
                  style: {
                    position: 'relative',
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
                      fontFamily: globalDefaults.fontFamily,
                      color: 'inherit',
                      boxSizing: 'border-box'
                    }
                  }
                ])
              ]),
              scrollIndicatorUp: DOM.template([
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
              ]),
              scrollIndicatorDown: DOM.template([
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
              ]),
              help: DOM.template([
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
              ])
            };
            return module.exports;
          };
        })(this)({});
        Dropdown.prototype._defaults = (function(_this) {
          return function(exports) {
            var module = {exports:exports};
            module.exports = {
              maxHeight: 300,
              multiple: false,
              storeSelected: true,
              lockScroll: true,
              help: '',
              templates: {}
            };
            return module.exports;
          };
        })(this)({});
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
          this.els.container = this._templates.container.spawn(this.settings.templates.container, extend({
            passStateToChildren: false
          }, forceOpts));
          this.els.list = this._templates.list.spawn(this.settings.templates.list, forceOpts).appendTo(this.els.container);
          this.els.help = this._templates.help.spawn(this.settings.templates.help, forceOpts).appendTo(this.els.container);
          this.els.scrollIndicatorUp = this._templates.scrollIndicatorUp.spawn(this.settings.templates.scrollIndicatorUp, forceOpts).appendTo(this.els.container);
          this.els.scrollIndicatorDown = this._templates.scrollIndicatorDown.spawn(this.settings.templates.scrollIndicatorDown, forceOpts).appendTo(this.els.container);
          this.options.forEach((function(_this) {
            return function(option) {
              option.el = _this._templates.option.spawn({
                options: {
                  props: {
                    'title': option.label
                  }
                }
              }, forceOpts).appendTo(_this.els.list);
              option.el.children[1].text = option.label;
              option.visible = true;
              option.selected = false;
              return option.unavailable = false;
            };
          })(this));
        };
        Dropdown.prototype._attachBindings = function() {
          SimplyBind('help').of(this.settings).to('text').of(this.els.help).and.to((function(_this) {
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
                _this.list_setMaxHeight();
                return _this.list_scrollToSelected();
              }
            };
          })(this));
          SimplyBind('lastSelected', {
            updateOnBind: false,
            updateEvenIfSame: true
          }).of(this).to((function(_this) {
            return function(newOption, prevOption) {
              if (_this.settings.storeSelected) {
                if (_this.settings.multiple) {
                  if (newOption.selected) {
                    newOption.selected = false;
                    helpers.removeItem(_this.selected, newOption);
                  } else {
                    newOption.selected = true;
                    _this.selected.push(newOption);
                  }
                } else {
                  newOption.selected = true;
                  if (newOption !== prevOption) {
                    if (prevOption != null) {
                      prevOption.selected = false;
                    }
                  }
                  _this.selected = newOption;
                }
              }
              return _this._selectedCallback(newOption, prevOption);
            };
          })(this));
          SimplyBind('currentHighlighted').of(this).to((function(_this) {
            return function(current, prev) {
              if (prev) {
                prev.el.state('hover', false);
              }
              if (current) {
                return current.el.state('hover', true);
              }
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
                        return _this.selectHighlighted();
                      case KEYCODES.esc:
                        event.preventDefault();
                        return _this.isOpen = false;
                    }
                  }
                });
              }
            };
          })(this));
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
              return _this.list_startScrolling('up');
            };
          })(this));
          this.els.scrollIndicatorUp.on('mouseleave', (function(_this) {
            return function() {
              return _this.list_stopScrolling();
            };
          })(this));
          this.els.scrollIndicatorDown.on('mouseenter', (function(_this) {
            return function() {
              return _this.list_startScrolling('down');
            };
          })(this));
          this.els.scrollIndicatorDown.on('mouseleave', (function(_this) {
            return function() {
              return _this.list_stopScrolling();
            };
          })(this));
          return this.options.forEach((function(_this) {
            return function(option, index) {
              var ref1;
              option.index = index;
              SimplyBind('visible').of(option).to(function(visible) {
                return _this.visibleOptionsCount += visible ? 1 : -1;
              }).and.to(function(visible) {
                option.el.state('visible', visible);
                if (visible) {
                  _this.visibleOptions.push(option);
                  return _this.visibleOptions.sort(function(a, b) {
                    return a.index - b.index;
                  });
                } else {
                  return helpers.removeItem(_this.visibleOptions, option);
                }
              });
              SimplyBind('selected', {
                updateOnBind: false
              }).of(option).to(function(selected) {
                return option.el.state('selected', selected);
              });
              SimplyBind('unavailable', {
                updateOnBind: false
              }).of(option).to(function(unavailable) {
                return option.el.state('unavailable', unavailable);
              }).and.to(function() {
                return _this.lastSelected = option;
              }).condition(function(unavailable) {
                return unavailable && _this.settings.multiple && option.selected;
              });
              SimplyBind('event:click').of(option.el).to(function() {
                return _this.lastSelected = option;
              });
              SimplyBind('event:mouseenter').of(option.el).to(function() {
                return _this.currentHighlighted = option;
              });
              if ((ref1 = option.conditions) != null ? ref1.length : void 0) {
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
          return this._selectedCallback = callback;
        };
        Dropdown.prototype.findOption = function(providedValue, byLabel) {
          var matches;
          matches = this.options.filter(function(option) {
            return providedValue === (byLabel ? option.label : option.value);
          });
          return matches[0];
        };
        Dropdown.prototype.findOptionAny = function(providedValue) {
          return this.findOption(providedValue) || this.findOption(providedValue, true);
        };
        Dropdown.prototype.getLabelOfOption = function(providedValue) {
          var matches, ref1;
          matches = this.options.filter(function(option) {
            return providedValue === option.value;
          });
          return ((ref1 = matches[0]) != null ? ref1.label : void 0) || '';
        };
        Dropdown.prototype.setOptionFromString = function(providedValue, byLabel) {
          var targetOption;
          targetOption = this.findOptionAny(providedValue, byLabel);
          if (targetOption && targetOption !== this.lastSelected) {
            if (!(this.settings.multiple && helpers.includes(this.selected, targetOption))) {
              return this.lastSelected = targetOption;
            }
          }
        };
        Dropdown.prototype.highlightPrev = function() {
          var currentIndex;
          currentIndex = this.visibleOptions.indexOf(this.currentHighlighted);
          if (currentIndex > 0) {
            return this.currentHighlighted = this.visibleOptions[currentIndex - 1];
          } else {
            return this.currentHighlighted = this.visibleOptions[this.visibleOptions.length - 1];
          }
        };
        Dropdown.prototype.highlightNext = function() {
          var currentIndex;
          currentIndex = this.visibleOptions.indexOf(this.currentHighlighted);
          if (currentIndex < this.visibleOptions.length - 1) {
            return this.currentHighlighted = this.visibleOptions[currentIndex + 1];
          } else {
            return this.currentHighlighted = this.visibleOptions[0];
          }
        };
        Dropdown.prototype.selectHighlighted = function() {
          if (this.currentHighlighted) {
            return this.lastSelected = this.currentHighlighted;
          }
        };
        Dropdown.prototype.list_setMaxHeight = function() {
          var clippingParent, clippingRect, cutoff, padding, selfRect, targetMaxHeight;
          targetMaxHeight = this.settings.maxHeight;
          clippingParent = this.els.container.parentMatching(function(parent) {
            var overflow;
            overflow = parent.style('overflowY');
            return overflow === 'hidden' || overflow === 'scroll';
          });
          if (clippingParent) {
            selfRect = this.els.container.rect;
            clippingRect = clippingParent.rect;
            cutoff = (selfRect.top + this.settings.maxHeight) - clippingRect.bottom;
            if (selfRect.top >= clippingRect.bottom) {
              console.warn("The dropdown for element '" + this.field.ID + "' cannot be displayed as it's hidden by the parent overflow");
            } else if (cutoff > 0) {
              padding = selfRect.height - this.els.list.rect.height;
              targetMaxHeight = cutoff - padding;
            }
          }
          this.els.list.style('maxHeight', targetMaxHeight);
          return this.els.list.style('minWidth', this.field.el.child.innerwrap.width + 10);
        };
        Dropdown.prototype.list_scrollToSelected = function() {
          var distaneFromTop, selectedHeight;
          if (this.selected && !this.settings.multiple) {
            distaneFromTop = this.selected.el.raw.offsetTop;
            selectedHeight = this.selected.el.raw.clientHeight;
            return this.els.list.raw.scrollTop = distaneFromTop - selectedHeight * 3;
          }
        };
        Dropdown.prototype.list_startScrolling = function(direction) {
          return this.scrollIntervalID = setInterval((function(_this) {
            return function() {
              return _this.els.list.raw.scrollTop += direction === 'up' ? -20 : 20;
            };
          })(this), 50);
        };
        Dropdown.prototype.list_stopScrolling = function() {
          return clearInterval(this.scrollIntervalID);
        };
        module.exports = Dropdown;
        return module.exports;
      };
      m[45] = function(exports){
			var module = {exports:exports};
			// Generated by CoffeeScript 1.10.0
			(function() {
			  var Binding, BindingInterface, BindingInterfacePrivate, GroupBinding, METHOD_bothWays, METHOD_chainTo, METHOD_condition, METHOD_conditionAll, METHOD_of, METHOD_pollEvery, METHOD_set, METHOD_setOption, METHOD_stopPolling, METHOD_transform, METHOD_transformAll, METHOD_transformSelf, METHOD_unBind, SimplyBind, addToNodeStore, applyPlaceholders, arrayMutatorMethods, boundInstances, cache, cachedEvent, changeEvent, checkIf, cloneObject, convertToLive, convertToReg, currentID, defaultOptions, defineProperty, dummyPropertyDescriptor, errors, escapeRegEx, eventUpdateHandler, extendState, fetchDescriptor, genID, genObj, genProxiedInterface, genSelfUpdater, getDescriptor, getErrSource, pholderRegEx, pholderRegExSplit, placeholder, proto, requiresDomDescriptorFix, scanTextNodesPlaceholders, setPholderRegEx, setValueNoop, settings, targetIncludes, textContent, throwError, throwErrorBadArg, throwWarning, windowPropsToIgnore;
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
			  defineProperty = Object.defineProperty;
			  getDescriptor = Object.getOwnPropertyDescriptor;
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
			  requiresDomDescriptorFix = (!('className' in Element.prototype)) || !getDescriptor(Element.prototype, 'className').get;
			  windowPropsToIgnore = ['innerWidth', 'innerHeight', 'outerWidth', 'outerHeight', 'scrollX', 'scrollY', 'pageXOffset', 'pageYOffset', 'screenX', 'screenY', 'screenLeft', 'screenTop'];
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
			    var _, j, len, method, newDescriptor, results1;
			    if (onlyArrayMethods) {
			      results1 = [];
			      for (j = 0, len = arrayMutatorMethods.length; j < len; j++) {
			        method = arrayMutatorMethods[j];
			        results1.push(delete object[method]);
			      }
			      return results1;
			    } else {
			      _ = bindingInstance;
			      newDescriptor = _.origDescriptor;
			      if (!(newDescriptor.set || newDescriptor.get)) {
			        newDescriptor.value = _.origFn || _.value;
			      }
			      return defineProperty(object, _.property, newDescriptor);
			    }
			  };
			  cloneObject = function(object) {
			    var clone, key;
			    clone = genObj();
			    for (key in object) {
			      clone[key] = object[key];
			    }
			    return clone;
			  };
			  extendState = function(base, stateToInherit) {
			    var j, key, len, stateMapping;
			    stateMapping = Object.keys(stateToInherit);
			    for (j = 0, len = stateMapping.length; j < len; j++) {
			      key = stateMapping[j];
			      base[key] = stateToInherit[key];
			    }
			  };
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
			    var contextPart, index, j, len, output;
			    output = '';
			    for (index = j = 0, len = contexts.length; j < len; index = ++j) {
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
			    var childNodes, index, j, k, len, len1, newFragment, newNode, node, textPiece, textPieces;
			    childNodes = Array.prototype.slice.call(element.childNodes);
			    for (j = 0, len = childNodes.length; j < len; j++) {
			      node = childNodes[j];
			      if (node.nodeType !== 3) {
			        scanTextNodesPlaceholders(node, nodeStore);
			      } else if (node[textContent].match(pholderRegExSplit)) {
			        textPieces = node[textContent].split(pholderRegEx);
			        if (textPieces.length === 3 && textPieces[0] + textPieces[2] === '') {
			          addToNodeStore(nodeStore, node, textPieces[1]);
			        } else {
			          newFragment = document.createDocumentFragment();
			          for (index = k = 0, len1 = textPieces.length; k < len1; index = ++k) {
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
			  errors = {
			    invalidParamName: "SimplyBind() and .to() only accept a function, an array, a bound object, a string, or a number.",
			    fnOnly: "Only functions are allowed for .transform/.condition/All()",
			    badEventArg: "Invalid argument number in .ofEvent()",
			    emptyList: "Empty collection provided",
			    onlyOneDOMElement: "You can only pass a single DOM element to a binding",
			    mixedElList: "'checked' of Mixed list of element cannot be bound"
			  };
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
			  SimplyBind.version = '1.15.3';
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
			      if (checkIf.isIterable(object) && !object._sb_ID && object[0] && (checkIf.isDom(object[0]))) {
			        object = object[0];
			      }
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
			        if (this.type === 'ObjectProp' && !checkIf.isDefined(subjectValue)) {
			          this.object[this.property] = subjectValue;
			        }
			        convertToLive(this, this.object);
			      }
			    }
			    this.attachEvents();
			    return boundInstances[this.ID] = this;
			  };
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
			          return meta.updateTimer = setTimeout(((function(_this) {
			            return function() {
			              return _this.updateSub(sub, publisher);
			            };
			          })(this)), meta.opts.throttle - timePassed);
			        } else {
			          meta.lastUpdate = currentTime;
			        }
			      } else if (meta.opts.delay && !isDelayedUpdate) {
			        return setTimeout(((function(_this) {
			          return function() {
			            return _this.updateSub(sub, publisher, true);
			          };
			        })(this)), meta.opts.delay);
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
			      var base1, j, len, subInterface, subMetaData, subscriber;
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
			              (base1 = subscriber.subsMeta[this.ID])[target] || (base1[target] = subjectFn);
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
			      var base1, disallowList;
			      disallowList = (base1 = this.subsMeta[targetSub.ID]).disallowList != null ? base1.disallowList : base1.disallowList = genObj();
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
			            return _this.setValue(polledValue);
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
			
			  /**
			  	 * Stage definitions:
			  	 * 
			  	 * 0: Selection:			Got selector, awaiting object.
			  	 * 1: Indication:			Got object, awaiting proxied property / function / Binding-object.
			  	 * 2: Binding Complete:		Complete, awaiting additional (optional) bindings/mutations.
			   */
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
			      var isDomCheckbox, isDomRadio, isIterable, newObjectType, sampleItem;
			      this.stage = 1;
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
			      var alreadyHadSub, binding, j, len, ref;
			      publisherInterface.stage = 2;
			      publisherInterface.subs.push(this);
			      alreadyHadSub = publisherInterface._.addSub(this._, publisherInterface.options, publisherInterface.updateOnce);
			      if (publisherInterface.updateOnce) {
			        delete publisherInterface.updateOnce;
			      } else if (publisherInterface.options.updateOnBind && !alreadyHadSub) {
			        if (this._.isMulti) {
			          ref = this._.bindings;
			          for (j = 0, len = ref.length; j < len; j++) {
			            binding = ref[j];
			            publisherInterface._.updateSub(binding, publisherInterface._);
			          }
			        } else {
			          publisherInterface._.updateSub(this._, publisherInterface._);
			        }
			      }
			    }
			  };
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
			    var binding, bindings, j, len, originCondition, originTransform, sub, subBinding, transformToUse;
			    sub = this.subs[this.subs.length - 1];
			    subBinding = sub._;
			    bindings = this._.isMulti ? this._.bindings : [this._];
			    subBinding.addSub(this._, sub.options);
			    for (j = 0, len = bindings.length; j < len; j++) {
			      binding = bindings[j];
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
			    var j, len, ref, sub;
			    ref = this.subs;
			    for (j = 0, len = ref.length; j < len; j++) {
			      sub = ref[j];
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
			  GroupBinding = function(bindingInterface, objects, objectType) {
			    var bindings, j, len, object;
			    bindingInterface.selector = bindingInterface.selector.slice(6);
			    extendState(this, this["interface"] = bindingInterface);
			    this.isMulti = true;
			    this.bindings = bindings = [];
			    if (objects) {
			      for (j = 0, len = objects.length; j < len; j++) {
			        object = objects[j];
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
			      var binding, j, len, ref;
			      ref = this.bindings;
			      for (j = 0, len = ref.length; j < len; j++) {
			        binding = ref[j];
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
			  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
			    return module.exports = SimplyBind;
			  } else if (typeof define === 'function' && define.amd) {
			    return define(['simplybind'], function() {
			      return SimplyBind;
			    });
			  } else {
			    return this.SimplyBind = SimplyBind;
			  }
			})();
			
			return module.exports;
		};
      return _s$m;
    };
    _s$m = _s$m({}, {}, {});
    return (function() {
      var DOM, Field, IS, QuickField, REQUIRED_FIELD_METHODS, animations, appendAnimationStyles, extend, helpers, prefix;
      helpers = _s$m(1);
      IS = _s$m(2);
      DOM = _s$m(3);
      extend = _s$m(4);
      REQUIRED_FIELD_METHODS = _s$m(5);

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
      prefix = document.createElement('div').style.animation != null ? '' : '-webkit-';
      animations = "@" + prefix + "keyframes checkmarkAnimateSuccessTip { 0%, 54% { width: 0; left: 0px; top: 3px } 70% { width: 14px; left: -2px; top: 8px } 84% { width: 5px; left: 5px; top: 10px } 100% { width: 8px; left: 3px; top: 10px } } @" + prefix + "keyframes checkmarkAnimateSuccessLong { 0%, 65% { width: 0; right: 12px; top: 12px } 84% { width: 14px; right: 0px; top: 7px } 100% { width: 12px; right: 2px; top: 8px } } @" + prefix + "keyframes checkmarkAnimateError { 0%, 65% { " + prefix + "transform: scale(0.4); opacity: 0 } 84% { " + prefix + "transform: scale(1.15) } 100% { " + prefix + "transform: scale(1) } } @" + prefix + "keyframes checkmarkRotatePlaceholder { 0%, 5% { " + prefix + "transform: rotate(-45deg) } 12%, 100% { " + prefix + "transform: rotate(-405deg) } } @" + prefix + "keyframes fieldErrorShake { 0%, 50% { " + prefix + "transform: translateX(-10px) } 25%, 75% { " + prefix + "transform: translateX(10px) } 100% { " + prefix + "transform: translateX(0px) } }";
      appendAnimationStyles = function() {
        var styleElement;
        styleElement = document.createElement('style');
        styleElement.innerHTML = animations;
        document.body.appendChild(styleElement);
        return appendAnimationStyles.appended = styleElement;
      };
      IS.field = function(target) {
        return target && target.constructor.name === 'Field';
      };
      IS.regex = function(target) {
        return target instanceof RegExp;
      };
      IS.objectable = function(target) {
        return IS.object(target) || IS["function"](target);
      };
      QuickField = function(options) {
        var fieldInstance;
        if (!IS.object(options)) {
          options = {};
        }
        if (options.type == null) {
          options.type = 'text';
        }
        if (!Field[options.type]) {
          throw new Error("QuickField: '" + options.type + "' is not a valid/registered field type");
        }
        if (!appendAnimationStyles.appended) {
          appendAnimationStyles();
        }
        fieldInstance = Object.create(Field[options.type]);
        return Field.call(fieldInstance, options);
      };
      QuickField.register = function(type, fieldProto) {
        var func, j, len, method, outputProto, requiredMethod;
        if (IS.string(type) && IS.object(fieldProto)) {
          outputProto = Object.create(Field.prototype);
          for (method in fieldProto) {
            func = fieldProto[method];
            outputProto[method] = func;
          }
          for (j = 0, len = REQUIRED_FIELD_METHODS.length; j < len; j++) {
            requiredMethod = REQUIRED_FIELD_METHODS[j];
            if (!outputProto[requiredMethod]) {
              throw new Error("QuickField Registration: '" + requiredMethod + "' method is required in order to register the field");
            }
          }
          return Field[type] = outputProto;
        }
      };
      Object.defineProperty(QuickField, 'fields', {
        get: function() {
          return extend.clone.own.notKeys('instances')(Field);
        }
      });
      QuickField.regex = _s$m(9);
      QuickField.version = '1.0.10';
      QuickField.constants = (function(_this) {
        return function(exports) {
          var module = {exports:exports};
          module.exports = {
            colors: _s$m(15),
            keyCodes: _s$m(18),
            reqFieldMethods: _s$m(5)
          };
          return module.exports;
        };
      })(this)({});
      QuickField.SVG = _s$m(12);
      QuickField.Field = Field = (function(_this) {
        return function(exports) {
          var module = {exports:exports};
          var currentID, globalDefaults;
          globalDefaults = _s$m(16);
          helpers = _s$m(1);
          IS = _s$m(2);
          extend = _s$m(4);
          currentID = 0;
          Field = function(settings) {
            var ref1;
            this.settings = extend.deep.clone.deep.transform({
              'conditions': function(conditions) {
                var results1, target, value;
                if (IS.objectPlain(conditions)) {
                  results1 = [];
                  for (target in conditions) {
                    value = conditions[target];
                    results1.push({
                      target: target,
                      value: value
                    });
                  }
                  return results1;
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
                var label, results1, value;
                if (IS.objectPlain(choices)) {
                  results1 = [];
                  for (label in choices) {
                    value = choices[label];
                    results1.push({
                      label: label,
                      value: value
                    });
                  }
                  return results1;
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
            })(globalDefaults, this._defaults, settings);
            this.type = settings.type;
            this.allFields = this.settings.fieldInstances || Field.instances;
            this._value = null;
            this.ID = this.settings.ID || currentID++ + '';
            this.els = {};
            this._eventCallbacks = {};
            this.state = {
              valid: true,
              visible: true,
              disabled: false,
              focused: false,
              hovered: false,
              filled: false,
              interacted: false,
              showError: false,
              width: this.settings.width,
              showHelp: this.settings.alwaysShowHelp,
              showLabel: this.settings.label,
              label: this.settings.label,
              help: this.settings.help
            };
            if (IS.defined(this.settings.placeholder)) {
              this.state.placeholder = this.settings.placeholder;
            }
            if ((ref1 = this.settings.conditions) != null ? ref1.length : void 0) {
              this.state.visible = false;
              helpers.initConditions(this, this.settings.conditions, (function(_this) {
                return function() {
                  return _this.validateConditions();
                };
              })(this));
            }
            Object.defineProperty(this, 'value', {
              get: this._getValue,
              set: this._setValue
            });
            if (this.allFields[this.ID]) {
              if (typeof console !== "undefined" && console !== null) {
                console.warn("Duplicate field IDs found: '" + this.ID + "'");
              }
            }
            this._construct();
            this._createElements();
            this._attachBindings();
            this.el.childf.field.onInserted((function(_this) {
              return function() {
                return _this.emit('inserted');
              };
            })(this));
            if (this.settings.ID) {
              this.el.raw.id = this.ID;
            }
            if (this.settings.defaultValue != null) {
              this._setValue(this.settings.multiple ? [].concat(this.settings.defaultValue) : this.settings.defaultValue);
            }
            return this.allFields[this.ID] = this.el.raw._quickField = this;
          };
          Field.instances = Object.create(null);
          Object.defineProperty(Field.prototype, 'valueRaw', {
            get: function() {
              return this._value;
            }
          });
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
          Field.prototype.validateConditions = function(conditions) {
            var passedConditions, toggleVisibility;
            if (conditions) {
              toggleVisibility = false;
            } else {
              conditions = this.settings.conditions;
              toggleVisibility = true;
            }
            passedConditions = helpers.validateConditions(conditions);
            if (toggleVisibility) {
              return this.state.visible = passedConditions;
            } else {
              return passedConditions;
            }
          };
          Field.prototype.on = function(eventName, callback) {
            var base;
            if (IS.string(eventName) && IS["function"](callback)) {
              if ((base = this._eventCallbacks)[eventName] == null) {
                base[eventName] = [];
              }
              this._eventCallbacks[eventName].push(callback);
            }
            return this;
          };
          Field.prototype.off = function(eventName, callback) {
            if (this._eventCallbacks[eventName]) {
              if (IS["function"](callback)) {
                helpers.removeItem(this._eventCallbacks[eventName], callback);
              } else {
                this._eventCallbacks[eventName] = {};
              }
            }
            return this;
          };
          Field.prototype.emit = function() {
            var args, callback, eventName, j, len, ref1;
            eventName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            if (this._eventCallbacks[eventName]) {
              ref1 = this._eventCallbacks[eventName];
              for (j = 0, len = ref1.length; j < len; j++) {
                callback = ref1[j];
                callback.apply(null, [this].concat(slice.call(args)));
              }
            }
            return this;
          };
          module.exports = Field;
          return module.exports;
        };
      })(this)({});
      QuickField.register('text', _s$m(17));
      QuickField.register('textarea', (function(_this) {
        return function(exports) {
          var module = {exports:exports};
          var Dropdown, SimplyBind, TextField, TextareaField;
          Dropdown = _s$m(30);
          helpers = _s$m(1);
          IS = _s$m(2);
          DOM = _s$m(3);
          extend = _s$m(4);
          SimplyBind = _s$m(45);
          TextField = _s$m(17);
          TextareaField = Object.create(null);
          TextareaField._templates = (function(exports) {
            var module = {exports:exports};
            var COLORS, SVG;
            DOM = _s$m(3);
            SVG = _s$m(12);
            TextField = _s$m(17);
            COLORS = _s$m(15);
            module.exports = {
              field: TextField._templates.field.extend({
                options: {
                  style: {
                    verticalAlign: 'bottom'
                  }
                },
                children: {
                  'innerwrap': {
                    options: {
                      style: {
                        overflow: 'hidden',
                        height: function(field) {
                          return field.settings.minHeight || 46;
                        },
                        width: function(field) {
                          if (!field.settings.autoWidth) {
                            return '100%';
                          }
                        }
                      }
                    }
                  },
                  'label': {
                    options: {
                      style: {
                        left: 0,
                        top: '7.6px'
                      }
                    }
                  },
                  'input': {
                    type: 'textarea',
                    options: {
                      type: null,
                      style: {
                        resize: 'none',
                        whiteSpace: 'normal',
                        width: '100%',
                        height: function() {
                          return "calc(100% - " + (this.styleSafe('marginTop')) + " - " + (this.styleSafe('marginBottom')) + ")";
                        },
                        margin: '0',
                        marginTop: '15px',
                        marginBottom: '12px',
                        padding: '0 12px',
                        $filled: {
                          $showLabel: {
                            transform: function(field) {
                              var label, translation;
                              if ((label = field.el.child.label) && label.style('position') === 'absolute') {
                                translation = (label.height + label.styleParsed('top')) - this.styleParsed('marginTop') + 1;
                                return "translateY(" + translation + "px)";
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  'placeholder': {
                    options: {
                      style: {
                        left: 0,
                        padding: function(field) {
                          var horiz, verti;
                          horiz = field.el.child.input.styleSafe('paddingLeft');
                          verti = field.el.child.input.styleSafe('marginTop');
                          return verti + " " + horiz;
                        }
                      }
                    }
                  }
                }
              })
            };
            return module.exports;
          })({});
          TextareaField._defaults = (function(exports) {
            var module = {exports:exports};
            module.exports = {
              placeholder: true,
              validWhenRegex: false,
              autoWidth: false,
              autoHeight: true,
              minHeight: 46,
              maxWidth: '100%',
              maxHeight: 2e308
            };
            return module.exports;
          })({});
          extend.keys(['_getValue', '_setValue', '_getMaxWidth', '_attachBindings_elState', '_attachBindings_display', '_attachBindings_stateTriggers', 'validate', 'selection', 'focus', 'blur'])(TextareaField, TextField);
          TextareaField._construct = function() {
            if (this._value == null) {
              this._value = '';
            }
            this.state.height = this.settings.autoHeight ? 'auto' : this.settings.height;
            this.state.typing = false;
            this.cursor = {
              prev: 0,
              current: 0
            };
          };
          TextareaField._createElements = function() {
            var forceOpts;
            forceOpts = {
              relatedInstance: this,
              styleAfterInsert: true
            };
            this.el = this._templates.field.spawn(this.settings.templates.field, forceOpts);
            this.el.state('hasLabel', this.settings.label);
            this.el.child.innerwrap.raw._quickField = this.el.child.input.raw._quickField = this;
          };
          TextareaField._attachBindings = function() {
            this._attachBindings_elState();
            this._attachBindings_display();
            this._attachBindings_display_autoWidth();
            this._attachBindings_display_autoHeight();
            this._attachBindings_value();
            this._attachBindings_autocomplete();
            this._attachBindings_stateTriggers();
          };
          TextareaField._attachBindings_display_autoHeight = function() {
            SimplyBind('height', {
              updateEvenIfSame: true
            }).of(this.state).transformSelf(function(value) {
              if (isNaN(value) && isNaN(parseFloat(value))) {
                return 'auto';
              } else {
                return value;
              }
            }).to((function(_this) {
              return function(height) {
                return _this.el.child.innerwrap.style('height', height);
              };
            })(this)).updateOn('event:inserted').of(this);
            if (this.settings.autoHeight) {
              SimplyBind('_value', {
                updateEvenIfSame: true,
                updateOnBind: false
              }).of(this).to('height').of(this.state).transform((function(_this) {
                return function() {
                  return _this._getInputAutoHeight();
                };
              })(this)).updateOn('event:inserted').of(this);
            }
          };
          TextareaField._attachBindings_display_autoWidth = function() {
            SimplyBind('width', {
              updateEvenIfSame: true
            }).of(this.state).to((function(_this) {
              return function(width) {
                return (_this.settings.autoWidth ? _this.el.child.innerwrap : _this.el).style('width', width);
              };
            })(this));
            if (this.settings.autoWidth) {
              SimplyBind('_value', {
                updateEvenIfSame: true,
                updateOnBind: false
              }).of(this).to('width').of(this.state).transform((function(_this) {
                return function() {
                  return _this._getInputAutoWidth();
                };
              })(this)).updateOn('event:inserted').of(this);
            }
          };
          TextareaField._attachBindings_value = function() {
            SimplyBind('_value').of(this).to('value').of(this.el.child.input.raw).bothWays().and.to('valueRaw').of(this).transform((function(_this) {
              return function(value) {
                if (_this.mask) {
                  return _this.mask.valueRaw;
                } else {
                  return value;
                }
              };
            })(this));
            SimplyBind('_value').of(this).to((function(_this) {
              return function(value) {
                _this.state.filled = !!value;
                if (value) {
                  _this.state.interacted = true;
                }
                _this.state.valid = _this.validate();
                return _this.emit('input');
              };
            })(this));
          };
          TextareaField._attachBindings_autocomplete = function() {};
          TextareaField._getInputAutoHeight = function() {
            var inputHeight, prevHeight;
            prevHeight = this.el.child.input.raw.style.height;
            if (this._value) {
              this.el.child.input.style('height', 0);
              inputHeight = this.el.child.input.raw.scrollHeight + 2;
              inputHeight += this.el.child.input.styleParsed('marginTop') + this.el.child.input.styleParsed('marginBottom');
            } else {
              inputHeight = this.el.child.placeholder.height;
            }
            this.el.child.input.style('height', prevHeight);
            return Math.min(this.settings.maxHeight, Math.max(inputHeight, this.settings.minHeight));
          };
          TextareaField._getInputAutoWidth = function() {
            var inputPadding, inputWidth, labelWidth;
            if (this._value) {
              this.el.child.input.style({
                width: 0,
                whiteSpace: 'nowrap'
              }).raw.scrollLeft = 1e+10;
              inputPadding = this.el.child.input.styleParsed('paddingLeft') || this.el.child.input.styleParsed('padding');
              inputWidth = Math.max(this.el.child.input.raw.scrollLeft + this.el.child.input.raw.offsetWidth, this.el.child.input.raw.scrollWidth) + 2 + inputPadding + 1;
              labelWidth = this.settings.label && this.el.child.label.styleSafe('position') === 'absolute' ? this.el.child.label.rect.width : 0;
            } else {
              inputWidth = this.el.child.placeholder.rect.width;
              labelWidth = 0;
            }
            this.el.child.input.style({
              width: '100%',
              whiteSpace: 'normal'
            });
            return Math.min(this._getMaxWidth(), Math.max(inputWidth, labelWidth));
          };
          module.exports = TextareaField;
          return module.exports;
        };
      })(this)({}));
      QuickField.register('select', (function(_this) {
        return function(exports) {
          var module = {exports:exports};
          var Dropdown, SelectField, SimplyBind, TextField;
          Dropdown = _s$m(30);
          helpers = _s$m(1);
          IS = _s$m(2);
          DOM = _s$m(3);
          extend = _s$m(4);
          SimplyBind = _s$m(45);
          TextField = _s$m(17);
          SelectField = Object.create(null);
          SelectField._templates = (function(exports) {
            var module = {exports:exports};
            var COLORS, SVG;
            DOM = _s$m(3);
            SVG = _s$m(12);
            TextField = _s$m(17);
            COLORS = _s$m(15);
            module.exports = {
              field: TextField._templates.field.extend({
                children: [
                  null, {
                    children: [
                      {
                        type: 'div',
                        options: {
                          type: null,
                          props: {
                            tabIndex: 0
                          },
                          style: {
                            marginTop: 3,
                            height: 'auto',
                            cursor: 'default',
                            userSelect: 'none',
                            overflow: 'scroll',
                            width: function(field) {
                              var subtract;
                              if (!field.settings.autoWidth) {
                                subtract = '';
                                if (field.el.child.icon) {
                                  subtract += " -" + (field.el.child.icon.raw.styleSafe('width', true));
                                }
                                if (field.el.child.caret) {
                                  subtract += " -" + (field.el.child.caret.styleSafe('width', true));
                                }
                                return "calc(100% + (" + (subtract || '0px') + "))";
                              }
                            }
                          }
                        }
                      }, null, [
                        'div', {
                          ref: 'caret',
                          style: {
                            position: 'relative',
                            zIndex: 3,
                            top: function(field) {
                              return this.parent.height / 2 - this.styleParsed('height') / 2;
                            },
                            display: 'inline-block',
                            width: '29px',
                            height: '17px',
                            paddingRight: '12px',
                            boxSizing: 'border-box',
                            verticalAlign: 'top',
                            outline: 'none',
                            pointerEvents: 'none',
                            fill: COLORS.grey
                          }
                        }, SVG.caretDown
                      ]
                    ]
                  }
                ]
              })
            };
            return module.exports;
          })({});
          SelectField._defaults = (function(exports) {
            var module = {exports:exports};
            module.exports = {
              placeholder: true,
              validWhenIsChoice: false,
              validWhenRegex: false,
              validWhenChoseMin: 2e308,
              autoWidth: false,
              maxWidth: '100%',
              labelFilter: null,
              choices: [],
              multiple: false,
              dropdownOptions: {}
            };
            return module.exports;
          })({});
          extend.keys(['_getMaxWidth', '_attachBindings_elState', '_attachBindings_display', 'focus', 'blur'])(SelectField, TextField);
          SelectField._construct = function() {
            var ref1;
            if (!((ref1 = this.settings.choices) != null ? ref1.length : void 0)) {
              throw new Error("Choices were not provided for choice field '" + (this.settings.label || this.ID) + "'");
            }
            this.settings.dropdownOptions.multiple = this.settings.multiple;
            if (this.settings.multiple) {
              this.settings.dropdownOptions.help = 'Tip: press ESC to close this menu';
            }
            this.dropdown = new Dropdown(this.settings.choices, this);
          };
          SelectField._getValue = function() {
            var ref1;
            if (!this.settings.multiple) {
              return (ref1 = this.dropdown.selected) != null ? ref1.value : void 0;
            } else {
              return this.dropdown.selected.map(function(choice) {
                return choice.value;
              });
            }
          };
          SelectField._setValue = function(newValue) {
            var j, len, value;
            if (!this.settings.multiple) {
              this.dropdown.setOptionFromString(newValue);
            } else {
              if (!IS.array(newValue)) {
                newValue = [].concat(newValue);
              }
              for (j = 0, len = newValue.length; j < len; j++) {
                value = newValue[j];
                this.dropdown.setOptionFromString(value);
              }
            }
          };
          SelectField._createElements = function() {
            var forceOpts;
            forceOpts = {
              relatedInstance: this,
              styleAfterInsert: true
            };
            this.el = this._templates.field.spawn(this.settings.templates.field, forceOpts);
            this.dropdown.appendTo(this.el.child.innerwrap);
            this.el.child.placeholder.insertBefore(this.el.child.input);
            if (this.settings.label) {
              this.el.child.label.text = this.settings.label;
              this.el.state('hasLabel', true);
            }
            this.el.child.innerwrap.raw._quickField = this.el.child.input.raw._quickField = this;
          };
          SelectField._attachBindings = function() {
            this._attachBindings_elState();
            this._attachBindings_value();
            this._attachBindings_display();
            this._attachBindings_display_autoWidth();
            this._attachBindings_dropdown();
            this._attachBindings_stateTriggers();
          };
          SelectField._attachBindings_display_autoWidth = function() {
            SimplyBind('width', {
              updateEvenIfSame: true
            }).of(this.state).to((function(_this) {
              return function(width) {
                return (_this.settings.autoWidth ? _this.el.child.input : _this.el).style({
                  width: width
                });
              };
            })(this));
            if (this.settings.autoWidth) {
              SimplyBind('valueLabel', {
                updateEvenIfSame: true,
                updateOnBind: false
              }).of(this).to('width').of(this.state).transform((function(_this) {
                return function() {
                  return _this._getInputAutoWidth();
                };
              })(this)).updateOn('event:inserted').of(this);
            }
          };
          SelectField._getInputAutoWidth = function() {
            var inputWidth, labelWidth;
            if (this.valueLabel) {
              this.el.child.input.style('width', 0);
              inputWidth = this.el.child.input.raw.scrollWidth + 2;
              labelWidth = this.el.child.label.styleSafe('position') === 'absolute' ? this.el.child.label.rect.width : 0;
            } else {
              inputWidth = this.el.child.placeholder.rect.width;
              labelWidth = 0;
            }
            return Math.max(inputWidth, labelWidth);
          };
          SelectField._attachBindings_value = function() {
            SimplyBind('array:selected').of(this.dropdown).to('_value').of(this).and.to('valueLabel').of(this).transform((function(_this) {
              return function(selected) {
                if (selected) {
                  if (_this.settings.multiple) {
                    return selected.map(function(choice) {
                      return choice.label;
                    }).join(', ');
                  } else {
                    return selected.label;
                  }
                }
              };
            })(this));
            SimplyBind('valueLabel').of(this).to('text').of(this.el.child.input).transform((function(_this) {
              return function(label) {
                if (_this.settings.labelFormat) {
                  return _this.settings.labelFormat(label);
                } else {
                  return label;
                }
              };
            })(this)).and.to((function(_this) {
              return function(value) {
                _this.state.filled = !!value;
                if (value) {
                  _this.state.interacted = true;
                }
                return _this.state.valid = _this.validate();
              };
            })(this));
            SimplyBind('array:selected', {
              updateOnBind: false
            }).of(this).to((function(_this) {
              return function() {
                return _this.emit('input');
              };
            })(this));
          };
          SelectField._attachBindings_dropdown = function() {
            SimplyBind('event:click').of(this.el.child.input).to((function(_this) {
              return function() {
                var clickListener, escListener;
                if (!_this.state.disabled) {
                  _this.dropdown.isOpen = true;
                  clickListener = SimplyBind('event:click').of(document).once.to(function() {
                    return _this.dropdown.isOpen = false;
                  }).condition(function(event) {
                    return !DOM(event.target).parentMatching(function(parent) {
                      return parent === _this.el.child.innerwrap;
                    });
                  });
                  escListener = SimplyBind('event:keydown').of(document).once.to(function() {
                    return _this.dropdown.isOpen = false;
                  }).condition(function(event) {
                    return event.keyCode === 27;
                  });
                  return SimplyBind('isOpen', {
                    updateOnBind: false
                  }).of(_this.dropdown).once.to(function() {
                    clickListener.unBind();
                    return escListener.unBind();
                  }).condition(function(isOpen) {
                    return !isOpen;
                  });
                }
              };
            })(this));
            SimplyBind('focused', {
              updateOnBind: false
            }).of(this.state).to((function(_this) {
              return function(focused) {
                var triggeringKeycodes;
                if (!focused) {
                  return _this.el.child.input.off('keydown.dropdownTrigger');
                } else {
                  triggeringKeycodes = [32, 37, 38, 39, 40];
                  return _this.el.child.input.on('keydown.dropdownTrigger', function(event) {
                    var ref1;
                    if (helpers.includes(triggeringKeycodes, event.keyCode) && !_this.dropdown.isOpen) {
                      _this.dropdown.isOpen = true;
                      if ((ref1 = _this.dropdown.lastSelected) != null ? ref1.selected : void 0) {
                        _this.dropdown.currentHighlighted = _this.dropdown.lastSelected;
                      }
                      return event.preventDefault();
                    } else if (event.keyCode === 9 && _this.dropdown.isOpen) {
                      return event.preventDefault();
                    }
                  });
                }
              };
            })(this));
            this.dropdown.onSelected((function(_this) {
              return function(selectedOption) {
                if (!_this.settings.multiple) {
                  return _this.dropdown.isOpen = false;
                }
              };
            })(this));
          };
          SelectField._attachBindings_stateTriggers = function() {
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
                return _this.state.focused = false;
              };
            })(this));
          };
          SelectField.validate = function(providedValue) {
            var matchingChoice, ref1, ref2;
            if (providedValue == null) {
              providedValue = this.value;
            }
            switch (false) {
              case !(this.settings.validWhenRegex && IS.regex(this.settings.validWhenRegex)):
                switch (false) {
                  case !this.settings.multiple:
                    return (function(_this) {
                      return function() {
                        var validChoices;
                        if (providedValue.length === 0) {
                          return false;
                        }
                        validChoices = providedValue.filter(function(choice) {
                          return _this.settings.validWhenRegex.test(choice);
                        });
                        if (_this.settings.validWhenChoseMin === 2e308 || !IS.number(_this.settings.validWhenChoseMin)) {
                          return validChoices.length === providedValue.length;
                        } else {
                          return validChoices.length >= _this.settings.validWhenChoseMin;
                        }
                      };
                    })(this)();
                  default:
                    return this.settings.validWhenRegex.test(providedValue);
                }
                break;
              case !(this.settings.validWhenIsChoice && ((ref1 = this.settings.choices) != null ? ref1.length : void 0)):
                matchingChoice = this.settings.choices.filter(function(option) {
                  return option.value === providedValue;
                });
                return !!matchingChoice.length;
              case !(this.settings.multiple && (-1 > (ref2 = this.settings.validWhenChoseMin) && ref2 < 2e308)):
                return providedValue.length >= this.settings.validWhenChoseMin;
              case !this.settings.multiple:
                return providedValue.length;
              default:
                return !!providedValue;
            }
          };
          SelectField.focus = function() {
            return this.el.child.input.raw.focus();
          };
          SelectField.blur = function() {
            return this.el.child.input.raw.blur();
          };
          module.exports = SelectField;
          return module.exports;
        };
      })(this)({}));
      QuickField.register('choice', _s$m(24));
      QuickField.register('truefalse', _s$m(25));
      QuickField.register('toggle', (function(_this) {
        return function(exports) {
          var module = {exports:exports};
          var SimplyBind, ToggleField, TrueFalseField;
          extend = _s$m(4);
          SimplyBind = _s$m(45);
          TrueFalseField = _s$m(25);
          ToggleField = Object.create(null);
          ToggleField._templates = (function(exports) {
            var module = {exports:exports};
            var COLORS;
            DOM = _s$m(3);
            COLORS = _s$m(15);
            module.exports = {
              field: DOM.template([
                'div', {
                  ref: 'field',
                  style: {
                    position: 'relative',
                    display: 'inline-block',
                    width: function(field) {
                      return field.state.width;
                    },
                    boxSizing: 'border-box',
                    fontFamily: function(field) {
                      return field.settings.fontFamily;
                    },
                    $showError: {
                      animation: '0.2s fieldErrorShake'
                    },
                    $alignedStyle: {
                      paddingRight: function(field) {
                        return field.settings.size + 20;
                      }
                    }
                  }
                }, [
                  'div', {
                    ref: 'label',
                    style: {
                      display: 'none',
                      marginBottom: '12px',
                      fontFamily: 'inherit',
                      fontSize: '13px',
                      fontWeight: 600,
                      textAlign: 'center',
                      color: COLORS.black,
                      cursor: 'default',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      $showLabel: {
                        display: 'block'
                      },
                      $showError: {
                        color: COLORS.red
                      },
                      $alignedStyle: {
                        marginBottom: '0',
                        textAlign: 'left'
                      }
                    }
                  }
                ], [
                  'div', {
                    ref: 'innerwrap',
                    style: {
                      position: 'relative',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      $alignedStyle: {
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }
                    }
                  }, [
                    'div', {
                      ref: 'input',
                      style: {
                        position: 'relative',
                        zIndex: 2,
                        width: function(field) {
                          return field.settings.size;
                        },
                        height: function(field) {
                          return field.settings.size / 2;
                        },
                        margin: '0 auto',
                        backgroundColor: function(field) {
                          return field.settings.background;
                        },
                        border: "1px solid " + COLORS.grey_semi_light,
                        borderRadius: function(field) {
                          return field.settings.size;
                        },
                        cursor: 'pointer'
                      }
                    }, [
                      'div', {
                        ref: 'background',
                        style: {
                          position: 'absolute',
                          zIndex: 1,
                          left: 0,
                          right: 0,
                          width: function(field) {
                            return field.settings.size / 2;
                          },
                          height: '100%',
                          borderRadius: function(field) {
                            var size;
                            size = field.settings.size;
                            return size + "px 0 0 " + size + "px";
                          },
                          backgroundColor: function(field) {
                            return field.settings.color;
                          },
                          opacity: 0,
                          transition: 'opacity 0.2s, width 0.2s',
                          $toggled: {
                            opacity: 1,
                            width: function(field) {
                              return field.settings.size * 0.7;
                            }
                          }
                        }
                      }
                    ], [
                      'div', {
                        ref: 'ball',
                        style: {
                          position: 'absolute',
                          zIndex: 2,
                          left: 0,
                          right: 0,
                          width: function(field) {
                            return field.settings.size / 2;
                          },
                          height: function(field) {
                            return field.settings.size / 2;
                          },
                          margin: '0 auto',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          border: "1px solid " + COLORS.grey_light,
                          boxSizing: 'border-box',
                          transform: 'translateX(-55%)',
                          transition: 'transform 0.2s',
                          userSelect: 'none',
                          $toggled: {
                            transform: 'translateX(50%)',
                            border: function(field) {
                              return "1px solid " + field.settings.color;
                            }
                          }
                        }
                      }
                    ]
                  ]
                ], [
                  'div', {
                    ref: 'help',
                    style: {
                      marginTop: '10px',
                      fontFamily: 'inherit',
                      fontSize: '11px',
                      color: COLORS.grey,
                      display: 'none',
                      $showError: {
                        color: COLORS.red,
                        display: 'block'
                      },
                      $showHelp: {
                        display: 'block'
                      }
                    }
                  }
                ]
              ])
            };
            return module.exports;
          })({});
          ToggleField._defaults = (function(exports) {
            var module = {exports:exports};
            var COLORS;
            COLORS = _s$m(15);
            module.exports = {
              validWhenTrue: true,
              size: 50,
              style: 'centered',
              color: COLORS.green,
              background: COLORS.grey_light
            };
            return module.exports;
          })({});
          extend.keys(['_attachBindings_elState', '_attachBindings_stateTriggers', '_attachBindings_display'])(ToggleField, TrueFalseField);
          ToggleField._construct = function() {
            this._value = !!this._value;
            this.settings.size = parseFloat(this.settings.size) || ToggleField._defaults.size;
            if (this.settings.style !== 'centered' && this.settings.style !== 'aligned') {
              this.settings.style = ToggleField._defaults.style;
            }
          };
          ToggleField._getValue = function() {
            return this._value;
          };
          ToggleField._setValue = function(newValue) {
            return this._value = !!newValue;
          };
          ToggleField._createElements = function() {
            var forceOpts;
            forceOpts = {
              relatedInstance: this,
              styleAfterInsert: true
            };
            this.el = this._templates.field.spawn(this.settings.templates.field, forceOpts);
            this.el.state('alignedStyle', this.settings.style === 'aligned').child.innerwrap.raw._quickField = this;
          };
          ToggleField._attachBindings = function() {
            this._attachBindings_elState();
            this._attachBindings_stateTriggers();
            this._attachBindings_display();
            this._attachBindings_value();
          };
          ToggleField._attachBindings_value = function() {
            SimplyBind('_value').of(this).to((function(_this) {
              return function(value) {
                return _this.el.state('toggled', value);
              };
            })(this));
            SimplyBind('_value', {
              updateOnBind: false
            }).of(this).to((function(_this) {
              return function() {
                return _this.emit('input');
              };
            })(this));
            SimplyBind('event:mouseup touchend').of(this.el.child.input).to((function(_this) {
              return function() {
                return _this._value = !_this._value;
              };
            })(this));
          };
          ToggleField.validate = function(providedValue) {
            if (providedValue == null) {
              providedValue = this._value;
            }
            if (this.settings.validWhenTrue) {
              return !!providedValue;
            } else {
              return true;
            }
          };
          module.exports = ToggleField;
          return module.exports;
        };
      })(this)({}));

      /* istanbul ignore next */
      if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
        return module.exports = QuickField;
      } else if (typeof define === 'function' && define.amd) {
        return define(['quickfield'], function() {
          return QuickField;
        });
      } else {
        return this.QuickField = QuickField;
      }
    })();
  });
})(this)();
