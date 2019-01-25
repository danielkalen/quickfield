import DOM from'quickdom';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import caretUp from'../../svg/caretUp.js';import caretDown from'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import COLORS from'../../constants/colors.js';import {a as textFieldTemplate}from'../text/template-233e9413.js';var template = textFieldTemplate.extend();
var stepButton = DOM.template(['div', {
  stateTriggers: {
    'active': {
      on: 'mousedown',
      off: 'mouseup',
      bubbles: false
    }
  },
  attrs: {
    tabindex: -1
  },
  style: {
    display: 'inline-block',
    width: '100%',
    height: 17,
    boxSizing: 'border-box',
    verticalAlign: 'top',
    outline: 'none',
    cursor: 'pointer',
    fill: COLORS.grey,
    $active: {
      fill: COLORS.grey_dark
    }
  }
}]);
var buttons = DOM.template(['div', {
  ref: 'buttons',
  style: {
    position: 'relative',
    zIndex: 3,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'inline-block',
    width: 17,
    paddingRight: function (field) {
      return field.settings.inputPadding;
    },
    outline: 'none'
  }
}, stepButton.extend({
  children: [caretUp],
  options: {
    ref: 'stepUp'
  }
}), stepButton.extend({
  children: [caretDown],
  options: {
    ref: 'stepDown'
  }
})]);var templates = /*#__PURE__*/Object.freeze({default: template,stepButton: stepButton,buttons: buttons});export{template as a,templates as b,buttons as c,stepButton as d};