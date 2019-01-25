import DOM from'quickdom';import COLORS from'../../constants/colors.js';var template = DOM.template(['div', {
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
      $hasVisibleChoices: {
        display: 'inline-block'
      }
    },
    $showError: {
      animation: '0.2s fieldErrorShake'
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
    color: COLORS.black,
    cursor: 'default',
    pointerEvents: 'none',
    userSelect: 'none',
    $showLabel: {
      display: 'block'
    },
    $showError: {
      color: COLORS.red
    }
  }
}], ['div', {
  ref: 'innerwrap',
  style: {
    position: 'relative',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  }
}], ['div', {
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
}]]);
var choiceGroup = DOM.template(['div', {
  ref: 'choiceGroup',
  style: {
    marginBottom: function (field) {
      return field.settings.spacing;
    },
    userSelect: 'none',
    fontSize: '0',
    whiteSpace: 'nowrap'
  }
}]);
var choice = DOM.template(['div', {
  ref: 'choice',
  styleAfterInsert: true,
  style: {
    position: 'relative',
    display: 'inline-block',
    width: 'auto',
    marginLeft: function (field) {
      if (this.index) {
        return `calc(100% - (100% - ${field.settings.spacing}px))`;
      }
    },
    // minHeight: '46px'
    padding: '0 12px',
    borderRadius: '2px',
    backgroundColor: 'white',
    fontFamily: 'inherit',
    textAlign: 'center',
    color: COLORS.black,
    boxSizing: 'border-box',
    verticalAlign: 'top',
    cursor: 'pointer',
    $definedWidth: {
      width: function (field) {
        return `calc((100% - ${field.settings.spacing * (field.settings.perGroup - 1)}px) / ${field.settings.perGroup})`;
      }
    },
    $selected: {
      color: COLORS.orange
    },
    $unavailable: {
      display: 'none'
    },
    $disabled: {
      cursor: 'not-allowed',
      opacity: 0.7,
      color: COLORS.grey
    }
  }
}, ['div', {
  ref: 'border',
  style: {
    position: 'absolute',
    zIndex: 2,
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: COLORS.grey_light,
    borderRadius: '2px',
    boxSizing: 'border-box',
    $selected: {
      borderColor: 'inherit',
      borderWidth: '2px'
    },
    $disabled: {
      borderColor: COLORS.grey_light
    }
  }
}], ['div', {
  ref: 'label',
  style: {
    position: 'relative',
    display: 'block',
    padding: '15px 0px',
    fontFamily: 'inherit',
    fontSize: function (field) {
      return field.settings.fontSize;
    },
    fontWeight: '500'
  }
}]]);
var choiceIcon = DOM.template(['div', {
  ref: 'icon',
  style: {
    position: 'absolute',
    top: '50%',
    display: 'block',
    fontSize: '20px',
    opacity: 0.16,
    transform: 'translateY(-50%)'
  }
}]);var templates = /*#__PURE__*/Object.freeze({default: template,choiceGroup: choiceGroup,choice: choice,choiceIcon: choiceIcon});export{template as a,templates as b,choice as c,choiceIcon as d,choiceGroup as e};