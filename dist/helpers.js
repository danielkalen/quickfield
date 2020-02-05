import'@danielkalen/is';import IS from'./checks.js';import DOM from'quickdom';import'@danielkalen/simplybind';import REGEX from'./constants/regex.js';var noop = function () {};
var includes = function (target, item) {
  return target && target.indexOf(item) !== -1;
};
var repeat = function (string, count) {
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
var removeItem = function (target, item) {
  var itemIndex;
  itemIndex = target.indexOf(item);

  if (itemIndex !== -1) {
    return target.splice(itemIndex, 1);
  }
};
var insertAfter = function (target, item, newItem) {
  var itemIndex;
  itemIndex = target.indexOf(item);

  if (itemIndex !== -1) {
    return target.splice(itemIndex, 0, newItem);
  }
};
var find = function (target, fn) {
  var results;
  results = target.filter(fn);
  return results[0];
};
var diff = function (source, comparee) {
  var compareeVal, i, maxLen, result, sourceVal;
  result = [];
  maxLen = Math.max(source.length, comparee.length);
  i = -1;

  while (++i < maxLen) {
    sourceVal = source[i];
    compareeVal = comparee[i];

    if (sourceVal !== compareeVal) {
      if (IS.defined(sourceVal) && !includes(comparee, sourceVal)) {
        result.push(sourceVal);
      }

      if (IS.defined(compareeVal) && !includes(source, compareeVal)) {
        result.push(compareeVal);
      }
    }
  }

  return result;
};
var hexToRGBA = function (hex, alpha) {
  var B, G, R;

  if (hex[0] === '#') {
    hex = hex.slice(1);
  }

  R = parseInt(hex.slice(0, 2), 16);
  G = parseInt(hex.slice(2, 4), 16);
  B = parseInt(hex.slice(4, 6), 16);
  return `rgba(${R}, ${G}, ${B}, ${alpha})`;
};
var defaultColor = function (color, defaultColor) {
  if (color === 'transparent' || !color) {
    return defaultColor;
  } else {
    return color;
  }
};
var calcPadding = function (desiredHeight, fontSize) {
  return Math.ceil((desiredHeight - fontSize * 1.231) / 2);
};
var unlockScroll = function (excludedEl) {
  window._isLocked = false;
  return DOM(window).off('wheel.lock');
};
var lockScroll = function (excludedEl) {
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
var fuzzyMatch = function (needle, haystack, caseSensitive) {
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
var startsWith = function (needle, haystack, caseSensitive) {
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
var getIndexOfFirstDiff = function (sourceString, compareString) {
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
var parseCssShorthandValue = function (string) {
  var result, values;
  values = string.split(REGEX.whiteSpace).map(parseFloat);
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
var shorthandSideValue = function (value, side) {
  var values;

  switch (typeof value) {
    case 'number':
      return value;

    case 'string':
      values = parseCssShorthandValue(value);
      return values[side];

    default:
      return 0;
  }
};
var updateShorthandValue = function (value, side, newValue) {
  var values;
  values = parseCssShorthandValue('' + (value || 0));

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

  return `${values.top}px ${values.right}px ${values.bottom}px ${values.left}px`;
};
var inheritProto = function (child, parent, keys) {
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
var isMobile = function () {
  var REGEX;
  REGEX = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i;
  return REGEX.test(typeof navigator !== "undefined" && navigator !== null ? navigator.userAgent : void 0);
};export{calcPadding,defaultColor,diff,find,fuzzyMatch,getIndexOfFirstDiff,hexToRGBA,includes,inheritProto,insertAfter,isMobile,lockScroll,noop,parseCssShorthandValue,removeItem,repeat,shorthandSideValue,startsWith,unlockScroll,updateShorthandValue};