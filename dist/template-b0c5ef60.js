import DOM from'quickdom';import COLORS from'./constants/colors.js';var template = DOM.template(['div', {
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
    },
    $alignedStyle: {
      paddingRight: function (field) {
        return field.settings.size + 20;
      }
    }
  }
}, ['div', {
  ref: 'label',
  style: {
    display: 'none',
    marginBottom: '12px',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 600,
    textAlign: 'center',
    color: COLORS.black,
    cursor: 'default',
    pointerEvents: 'none',
    userSelect: 'none',
    $showLabel: {
      display: 'block'
    },
    $showError: {
      color: COLORS.red
    },
    $alignedStyle: {
      marginBottom: '0',
      textAlign: 'left'
    }
  }
}], ['div', {
  ref: 'innerwrap',
  style: {
    position: 'relative',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    $alignedStyle: {
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)'
    }
  }
}, ['div', {
  ref: 'input',
  style: {
    position: 'relative',
    zIndex: 2,
    width: function (field) {
      return field.settings.size;
    },
    height: function (field) {
      return field.settings.size / 2;
    },
    margin: '0 auto',
    backgroundColor: function (field) {
      return field.settings.background;
    },
    border: `1px solid ${COLORS.grey_semi_light}`,
    borderRadius: function (field) {
      return field.settings.size;
    },
    cursor: 'pointer'
  }
}, ['div', {
  ref: 'background',
  style: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    width: function (field) {
      return field.settings.size / 2;
    },
    height: '100%',
    borderRadius: function (field) {
      var size;
      size = field.settings.size;
      return `${size}px 0 0 ${size}px`;
    },
    backgroundColor: function (field) {
      return field.settings.color;
    },
    opacity: 0,
    transition: 'opacity 0.2s, width 0.2s',
    $toggled: {
      opacity: 1,
      width: function (field) {
        return field.settings.size * 0.7;
      }
    }
  }
}], ['div', {
  ref: 'ball',
  style: {
    position: 'absolute',
    zIndex: 2,
    left: 0,
    right: 0,
    width: function (field) {
      return field.settings.size / 2;
    },
    height: function (field) {
      return field.settings.size / 2;
    },
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '50%',
    border: `1px solid ${COLORS.grey_light}`,
    boxSizing: 'border-box',
    transform: 'translateX(-55%)',
    transition: 'transform 0.2s',
    userSelect: 'none',
    $toggled: {
      transform: 'translateX(50%)',
      border: function (field) {
        return `1px solid ${field.settings.color}`;
      }
    }
  }
}]]], ['div', {
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
}]]);var templates=/*#__PURE__*/Object.freeze({__proto__:null,'default': template});export{templates as a,template as t};