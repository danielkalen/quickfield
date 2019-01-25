import DOM from'quickdom';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import'../../svg/caretUp.js';import'../../svg/caretDown.js';import plus from'../../svg/plus.js';import clone from'../../svg/clone.js';import remove from'../../svg/remove.js';import COLORS from'../../constants/colors.js';import {c as collapseIcons}from'../group/template-086a82e2.js';var template = DOM.template(['div', {
  ref: 'field',
  style: {
    position: 'relative',
    boxSizing: 'border-box',
    verticalAlign: 'top',
    display: 'none',
    width: function (field) {
      return field.state.width;
    },
    fontFamily: function (field) {
      return field.settings.fontFamily;
    },
    borderRadius: 3,
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
  style: {
    display: 'none',
    fontFamily: 'inherit',
    fontSize: '16px',
    fontWeight: 600,
    textAlign: 'left',
    color: COLORS.black,
    cursor: 'default',
    userSelect: 'none',
    $showLabel: {
      display: 'block'
    },
    $showError: {
      color: COLORS.red
    }
  }
}], ['div', {
  ref: 'collapse',
  style: {
    position: 'absolute',
    top: 5,
    right: 0,
    lineHeight: 0,
    fontSize: 0,
    display: 'none',
    $showLabel: {
      $collapsable: {
        display: 'block'
      }
    }
  }
}, ['div', {
  ref: 'icon',
  style: {
    width: 17,
    height: 17,
    color: COLORS.grey,
    fill: COLORS.grey,
    $hover: {
      color: COLORS.grey_dark,
      fill: COLORS.grey_dark
    }
  }
}, ...collapseIcons]], ['div', {
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
}], ['div', {
  ref: 'innerwrap',
  unpassableStates: ['visible', 'hover', 'focus', 'disabled', 'showLabel', 'showError', 'showHelp', 'collapsed', 'valid', 'invalid'],
  style: {
    position: 'relative',
    boxSizing: 'border-box',
    marginTop: 15,
    fontFamily: 'inherit',
    textAlign: 'justify',
    textJustify: 'distribute-all-lines',
    fontSize: 0,
    $collapsed: {
      display: 'none'
    }
  }
}, ['div', {
  ref: 'addButton',
  style: {
    position: 'relative',
    verticalAlign: 'middle',
    boxSizing: 'border-box',
    padding: 12,
    backgroundColor: COLORS.grey_semi_light,
    borderRadius: 3,
    cursor: 'pointer',
    userSelect: 'none',
    lineHeight: '1em',
    textAlign: 'center',
    $disabled: {
      display: 'none'
    },
    $inlineStyle: {
      display: 'inline-block',
      top: function (field) {
        return field.settings.groupMargin / 2 * -1;
      }
    }
  }
}, ['div', {
  style: {
    display: 'inline-block',
    width: 15,
    height: 15,
    color: COLORS.black,
    fill: COLORS.black
  }
}, plus]]]]);
var cloneIcon = clone.extend({
  options: {
    style: {
      width: 11
    }
  }
});
var removeIcon = remove.extend({
  options: {
    style: {
      width: 11
    }
  }
});
var blockGroup = {};
var inlineGroup = {
  default: {
    // options: style:
    // 	verticalAlign: 'middle'
    children: {
      innerwrap: {
        options: {
          style: {
            display: 'inline-block',
            verticalAlign: 'middle',
            marginTop: 0
          }
        }
      },
      actions: {
        options: {
          events: {
            inserted: function () {
              return this.insertAfter(this.parent.child.innerwrap);
            }
          },
          style: {
            position: 'static',
            verticalAlign: 'middle',
            display: 'inline-table'
          }
        }
      }
    }
  },
  action: ['div', {
    events: {
      inserted: function () {
        if (this.index) {
          return this.style('borderTop', `1px solid ${COLORS.grey}`);
        }
      }
    },
    style: {
      boxSizing: 'border-box',
      display: 'table-row',
      padding: 4
    }
  }, ['div', {
    ref: 'icon',
    style: {
      verticalAlign: 'middle',
      display: 'table-cell',
      color: COLORS.black,
      fill: COLORS.black,
      opacity: 0.6,
      $hover: {
        opacity: 1
      }
    }
  }]]
};var templates = /*#__PURE__*/Object.freeze({default: template,cloneIcon: cloneIcon,removeIcon: removeIcon,blockGroup: blockGroup,inlineGroup: inlineGroup});export{inlineGroup as a,blockGroup as b,template as c,templates as d,cloneIcon as e,removeIcon as f};