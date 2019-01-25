import'@danielkalen/is';import IS from'../checks.js';import'quickdom';import'@danielkalen/simplybind';import REGEX from'../constants/regex.js';import {repeat}from'../helpers.js';import extend from'smart-extend';import maskCore from'text-mask-core';import maskAddons from'text-mask-addons';var Mask, defaultPatternChars;
defaultPatternChars = {
  '1': REGEX.numeric,
  '#': REGEX.widenumeric,
  'a': REGEX.letter,
  '*': REGEX.any
};
Mask = class Mask {
  constructor(field, config) {
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

  getState(pattern, rawValue) {
    return {
      rawValue,
      guide: this.guide,
      placeholderChar: this.placeholderChar,
      keepCharPositions: this.keepCharPositions,
      currentCaretPosition: this.field.el ? this.field.selection().end : this.cursor,
      previousConformedValue: this.prevValue,
      placeholder: this.getPlaceholder(pattern)
    };
  }

  getPlaceholder(pattern) {
    var char, j, len, placeholder;

    if (IS.function(pattern)) ; else {
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

  resolvePattern(pattern, input, state) {
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
      pattern,
      caretTrapIndexes: trapIndexes
    };
  }

  setPattern(string, updateValue = true, updateField) {
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

  parsePattern(string) {
    var char, escaped, i, j, len, pattern;

    switch (false) {
      case string !== 'EMAIL':
        return maskAddons.emailMask.mask;

      case string !== 'PHONE':
        this.patternSetter = function (value) {
          return repeat('#', Math.max(7, value.length));
        };

        this.guide = false;
        return '#';

      case string !== 'NAME':
        this.patternSetter = function (value) {
          value = value.replace(this.placeholderRegex, '').trim();
          return repeat('a', Math.max(2, value.length));
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
            return repeat('a', Math.max(2, part.length));
          }).join(' ');
        };

        return 'a';

      case string !== 'DATE':
        return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

      case !(string[0] === 'DATE' && IS.string(string[1])):
        return string[1].split('').map(char => {
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

  parseTransform(string) {
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

  setValue(input) {
    var caretTrapIndexes, conformedValue, indexesOfPipedChars, newPattern, pattern, state, transformed;

    if (this.patternSetter) {
      newPattern = this.patternSetter(input) || this.pattern;

      if (newPattern !== this.patternRaw && newPattern !== this.pattern) {
        this.setPattern(newPattern, false);
      }
    }

    ({
      caretTrapIndexes,
      pattern
    } = this.resolvePattern(this.pattern, input));

    if (pattern === false) {
      return this.value;
    }

    this.prevValue = this.value;
    this.prevCursor = this.cursor;
    state = this.getState(pattern, input);
    ({
      conformedValue
    } = maskCore.conformToMask(input, pattern, state));

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
      indexesOfPipedChars,
      caretTrapIndexes,
      conformedValue
    }));
    return this.value = conformedValue;
  }

  validate(input) {
    var char, i, j, len, pattern;

    if (input !== this.value && this.patternSetter) {
      pattern = this.patternSetter(input) || this.pattern;
    } else {
      pattern = this.resolvedPattern;

      if (!pattern) {
        ({
          pattern
        } = this.resolvePattern(this.pattern, input));
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

  isEmpty() {
    var char, i, input, j, len, pattern;
    input = this.value;
    pattern = this.resolvedPattern;

    if (!pattern) {
      if (this.patternSetter) {
        pattern = this.patternSetter(input);
      }

      ({
        pattern
      } = this.resolvePattern(pattern || this.pattern, input));
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

};
var Mask$1 = Mask;export default Mask$1;