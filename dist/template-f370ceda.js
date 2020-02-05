import DOM from'quickdom';import {shorthandSideValue}from'./helpers.js';import'./constants/colors.js';import {t as textFieldTemplate}from'./template-9c92de5e.js';var template = textFieldTemplate.extend({
  children: {
    'innerwrap': {
      options: {
        style: {
          overflow: 'hidden',
          height: function (field) {
            return field.settings.minHeight || 46;
          },
          width: function (field) {
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
          left: function (field) {
            return shorthandSideValue(field.settings.padding, 'left');
          },
          top: '7.6px'
        }
      }
    },
    'input': {
      type: 'textarea',
      options: {
        type: null,
        styleAfterInsert: true,
        style: {
          resize: 'none',
          whiteSpace: 'normal',
          width: '100%',
          height: function () {
            return `calc(100% - ${this.styleSafe('marginTop', true)} - ${this.styleSafe('marginBottom', true)})`;
          },
          margin: '0',
          marginTop: '15px',
          marginBottom: '12px',
          padding: '0 12px'
        }
      }
    },
    'placeholder': {
      options: {
        styleAfterInsert: true,
        style: {
          left: 0,
          padding: function (field) {
            var horiz, verti;
            horiz = field.el.child.input.styleSafe('paddingLeft', true) || field.el.child.input.styleSafe('paddingLeft');
            verti = field.el.child.input.styleSafe('marginTop', true) || field.el.child.input.styleSafe('marginTop');
            return `${verti} ${horiz}`;
          }
        }
      }
    }
  }
});
var counter = DOM.template(['div', {
  ref: 'counter',
  style: {
    position: 'absolute',
    bottom: -10,
    right: 0,
    fontSize: 10,
    fontWeight: 500
  }
}]);var templates=/*#__PURE__*/Object.freeze({__proto__:null,'default': template,counter: counter});export{templates as a,counter as c,template as t};