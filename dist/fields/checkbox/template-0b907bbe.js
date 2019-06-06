import DOM from'quickdom';import checkmark from'../../svg/checkmark.js';import'../../svg/angleDown.js';import'../../svg/caretUp.js';import'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import COLORS from'../../constants/colors.js';var template = DOM.template(['div', {
  ref: 'field',
  style: {
    position: 'relative',
    display: 'none',
    width: function (field) {
      return field.state.width;
    },
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
  ref: 'innerwrap',
  style: {
    position: 'relative',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    display: 'flex',
    flexWrap: 'nowrap',
    alignContent: 'flex-start',
    alignItems: 'flex-start'
  }
}, ['div', {
  ref: 'input',
  style: {
    position: 'relative',
    alignSelf: 'start',
    zIndex: 2,
    flexGrow: 0,
    flexShrink: 0,
    width: function (field) {
      return field.settings.size;
    },
    height: function (field) {
      return field.settings.size;
    },
    margin: '0 auto',
    backgroundColor: function (field) {
      return field.settings.colors.background;
    },
    border: `1px solid ${COLORS.grey_light}`,
    borderRadius: 3,
    cursor: 'pointer'
  }
}, [// $toggled:
// 	borderColor: (field)-> field.settings.colors.symbol
'div', {
  ref: 'checkmark',
  style: {
    position: 'absolute',
    zIndex: 2,
    left: 0,
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: function (field) {
      return field.settings.size / 1.5;
    },
    height: function (field) {
      return field.settings.size / 1.5;
    },
    margin: '0 auto',
    boxSizing: 'border-box',
    lineHeight: 0,
    userSelect: 'none',
    display: 'none',
    $toggled: {
      display: 'block'
    }
  }
}, checkmark.extend({
  style: {
    width: '100%',
    height: '100%',
    stroke: function (field) {
      return field.settings.colors.symbol;
    },
    outline: 'none'
  }
})]], ['div', {
  ref: 'label',
  style: {
    display: 'none',
    marginLeft: 5,
    fontFamily: 'inherit',
    fontSize: function (field) {
      return field.settings.fontSize;
    },
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
}]], ['div', {
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
}]]);var templates = /*#__PURE__*/Object.freeze({default: template});export{template as a,templates as b};