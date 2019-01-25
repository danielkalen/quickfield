import'quickdom';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import'../../svg/caretUp.js';import caretDown from'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import COLORS from'../../constants/colors.js';import {a as textFieldTemplate}from'../text/template-233e9413.js';var template = textFieldTemplate.extend({
  children: {
    innerwrap: {
      children: {
        'input': ['div', {
          props: {
            tabIndex: 0
          },
          style: {
            marginTop: 3,
            height: 'auto',
            cursor: 'default',
            userSelect: 'none',
            // overflow: 'scroll'
            overflow: 'hidden'
          }
        }],
        'caret': ['div', {
          ref: 'caret',
          styleAfterInsert: true,
          style: {
            position: 'relative',
            zIndex: 3,
            top: function (field) {
              return this.parent.styleParsed('height', true) / 2 - this.styleParsed('height') / 2;
            },
            display: 'inline-block',
            width: 17,
            height: 17,
            paddingRight: function (field) {
              return field.settings.inputPadding;
            },
            verticalAlign: 'top',
            outline: 'none',
            pointerEvents: 'none',
            fill: COLORS.grey
          }
        }, caretDown]
      }
    }
  }
});var templates = /*#__PURE__*/Object.freeze({default: template});export{template as a,templates as b};