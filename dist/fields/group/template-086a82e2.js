import DOM from'quickdom';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import caretUp from'../../svg/caretUp.js';import caretDown from'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import COLORS from'../../constants/colors.js';var action = DOM.template(['div', {
  events: {
    inserted: function () {
      if (this.index) {
        return this.style('marginLeft', 5);
      }
    }
  },
  style: {
    display: 'inline-block',
    boxSizing: 'border-box'
  }
}, [// verticalAlign: 'middle'
'div', {
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
}]]);
var collapseIcons = [caretUp.extend({
  options: {
    style: {
      position: 'relative',
      top: -2,
      display: 'none',
      $collapsed: {
        display: 'block'
      }
    }
  }
}), caretDown.extend({
  options: {
    style: {
      display: 'block',
      $collapsed: {
        display: 'none'
      }
    }
  }
})];
var template = DOM.template(['div', {
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
    // backgroundColor: (field)-> field.settings.color
    border: `1px solid ${COLORS.grey_light}`,
    borderRadius: 3,
    textAlign: 'left',
    // lineHeight: '1em'
    $visible: {
      display: 'inline-block'
    },
    $showError: {
      $collapsed: {
        animation: '0.2s fieldErrorShake'
      }
    }
  }
}, ['div', {
  ref: 'label',
  style: {
    display: 'none',
    fontFamily: 'inherit',
    fontSize: function (field) {
      return field.settings.labelSize;
    },
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
  ref: 'actions',
  style: {
    position: 'absolute',
    top: function (field) {
      return field.settings.padding * (12 / 20);
    },
    right: function (field) {
      return field.settings.padding * (12 / 20);
    },
    lineHeight: 0,
    fontSize: 0,
    textAlign: 'center',
    $showLabel: {
      top: function (field) {
        return field.settings.padding * (21 / 20);
      }
    }
  }
}], ['div', {
  ref: 'help',
  style: {
    marginTop: '10px',
    fontFamily: 'inherit',
    fontSize: '11px',
    color: COLORS.grey,
    display: 'none',
    whiteSpace: 'pre-line',
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
}]]);var templates = /*#__PURE__*/Object.freeze({action: action,collapseIcons: collapseIcons,default: template});export{template as a,templates as b,collapseIcons as c,action as d};