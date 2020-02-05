import'quickdom';import'./svg/checkmark.js';import'./svg/angleDown.js';import'./svg/caretUp.js';import caretDown from'./svg/caretDown.js';import'./svg/plus.js';import'./svg/clone.js';import'./svg/remove.js';import COLORS from'./constants/colors.js';import {t as textFieldTemplate}from'./template-689295d2.js';var template = textFieldTemplate.extend({
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
        }, caretDown],
        'nativeInput': ['select', {
          ref: 'nativeInput',
          style: {
            position: 'absolute',
            zIndex: 4,
            left: 0,
            top: 0,
            display: 'none',
            width: '100%',
            height: '100%',
            opacity: 0,
            $displayNative: {
              display: 'block'
            }
          },
          methods: {
            activate: function () {
              this.setupChoices();
              this.state('displayNative', true);
              return this.on('change', () => {
                return this.related.value = this.raw.value;
              });
            },
            setupChoices: function () {
              var currentValue, options;
              currentValue = this.related.value;
              options = this.related.settings.choices.map(function ({
                label,
                value
              }) {
                var selected;

                if (label == null) {
                  label = value;
                }

                if (value == null) {
                  value = label;
                }

                selected = value === currentValue ? 'selected' : '';
                return `<option ${selected} value=\"${value}\">${label}</option>`;
              }).join('\n');
              return this.html = `<option></option>
${options}`;
            }
          }
        }]
      }
    }
  }
});var templates=/*#__PURE__*/Object.freeze({__proto__:null,'default': template});export{templates as a,template as t};