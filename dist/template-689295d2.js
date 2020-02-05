import DOM from'quickdom';import {shorthandSideValue,calcPadding,defaultColor,hexToRGBA}from'./helpers.js';import COLORS from'./constants/colors.js';var textFieldTemplate = DOM.template(['div', {
  ref: 'field',
  style: {
    position: 'relative',
    verticalAlign: 'top',
    display: 'none',
    boxSizing: 'border-box',
    fontFamily: function (field) {
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
    top: function (field) {
      return this.styleParsed('fontSize', true) * 0.7;
    },
    left: function (field) {
      var ref;
      return shorthandSideValue(field.settings.padding, 'left') + (((ref = field.el.child.icon) != null ? ref.width : void 0) || 0);
    },
    padding: function (field) {
      return `0 ${field.settings.inputPadding}px`;
    },
    fontFamily: 'inherit',
    fontSize: function (field) {
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
    height: function (field) {
      return field.settings.height;
    },
    backgroundColor: 'white',
    borderWidth: function (field) {
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
    height: function () {
      return this.parent.styleSafe('height', 1) || this.parent.styleSafe('height');
    },
    width: function (field) {
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

        return `calc(100% - ${subtract}px)`;
      }
    },
    padding: function (field) {
      if (this.padding == null) {
        this.padding = Math.max(0, calcPadding(field.settings.height, 14) - 3);
      }

      return `${this.padding}px ${field.settings.inputPadding}px`;
    },
    margin: '0',
    backgroundColor: 'transparent',
    appearance: 'none',
    border: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: function (field) {
      return field.settings.fontSize;
    },
    color: COLORS.black,
    boxSizing: 'border-box',
    boxShadow: 'none',
    whiteSpace: 'nowrap',
    backgroundClip: 'content-box',
    // semi-fix for yellow autofill background
    transform: 'translateY(0)',
    transition: 'transform 0.2s, -webkit-transform 0.2s',
    $disabled: {
      cursor: 'not-allowed'
    },
    $filled: {
      $showLabel: {
        transform: function (field) {
          var label, totalHeight, translation, workableHeight;

          if (this.translation != null || !(label = field.el.child.label) || label.styleSafe('position', 1) !== 'absolute') {
            return this.translation;
          }

          totalHeight = this.parent.styleParsed('height', 1);
          workableHeight = totalHeight - (label.styleParsed('fontSize', 1) + label.styleParsed('top', 1) * 2);
          translation = Math.max(0, Math.floor((totalHeight - workableHeight) / 4));
          return `translateY(${translation}px)`;
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
    left: function (field) {
      var ref;
      return ((ref = field.el.child.icon) != null ? ref.width : void 0) || 0;
    },
    fontFamily: function (field) {
      return field.el.child.input.styleSafe('fontFamily', 1);
    },
    fontSize: function (field) {
      return field.el.child.input.styleSafe('fontSize', 1);
    },
    padding: function (field) {
      var horiz, verti;
      verti = field.el.child.input.styleParsed('paddingTop', 1) || field.el.child.input.styleParsed('paddingTop');
      horiz = field.el.child.input.styleParsed('paddingLeft', 1) || field.el.child.input.styleParsed('paddingLeft');
      return `${verti + 3}px ${horiz}px`;
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
        transform: function (field) {
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
    left: function (field) {
      return shorthandSideValue(field.settings.padding, 'left');
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
var icon = DOM.template(['div', {
  ref: 'icon',
  styleAfterInsert: true,
  style: {
    position: 'relative',
    zIndex: 2,
    display: 'inline-block',
    boxSizing: 'border-box',
    width: function (field) {
      return field.settings.iconSize;
    },
    height: function (field) {
      return field.settings.iconSize;
    },
    fontSize: function (field) {
      return field.settings.iconSize;
    },
    paddingLeft: function (field) {
      return field.settings.inputPadding;
    },
    paddingTop: function (field) {
      return this.parent.styleParsed('height', 1) / 2 - field.settings.iconSize / 2;
    },
    lineHeight: '1em',
    userSelect: 'none'
  },
  methods: {
    width: {
      get: function () {
        if (this._inserted) {
          return this.raw.offsetWidth;
        } else {
          return this.styleParsed('width', 1) || this.related.settings.iconSize;
        }
      }
    }
  }
}]); // @styleParsed('width',1) or @raw.offsetWidth or @related.settings.iconSize or 0

var checkmark = DOM.template(['div', {
  ref: 'checkmark',
  styleAfterInsert: true,
  style: {
    position: 'relative',
    zIndex: 4,
    display: 'none',
    width: 26,
    height: '100%',
    paddingTop: function () {
      return this.parent.styleParsed('height', 1) / 2 - 13;
    },
    paddingRight: function (field) {
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
    // transformOrigin: '100% 0'
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
    backgroundColor: function (field) {
      return defaultColor(field.els.innerwrap.styleSafe('backgroundColor', 1), 'white');
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
    backgroundColor: function (field) {
      return defaultColor(field.els.innerwrap.styleSafe('backgroundColor', 1), 'white');
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
    borderColor: hexToRGBA(COLORS.green, 0.4),
    $invalid: {
      borderColor: hexToRGBA(COLORS.red, 0.4)
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
    backgroundColor: function (field) {
      return defaultColor(field.els.innerwrap.styleSafe('backgroundColor', 1), 'white');
    },
    transform: 'rotate(-45deg)'
  }
}]]]);var templates=/*#__PURE__*/Object.freeze({__proto__:null,'default': textFieldTemplate,icon: icon,checkmark: checkmark});export{templates as a,checkmark as c,icon as i,textFieldTemplate as t};