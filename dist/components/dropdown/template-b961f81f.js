import DOM from'quickdom';import {hexToRGBA}from'../../helpers.js';import checkmark from'../../svg/checkmark.js';import'../../svg/angleDown.js';import caretUp from'../../svg/caretUp.js';import caretDown from'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';var template = DOM.template(['div', {
  ref: 'dropdown',
  styleAfterInsert: true,
  style: {
    position: 'absolute',
    zIndex: 10,
    overflow: 'hidden',
    top: function (dropdown) {
      if (dropdown.field.type === 'text') {
        return this.parent.raw.style.height;
      } else {
        return '-7px';
      }
    },
    left: function () {
      if (this.parent.rect.left - 5 < 0) {
        return 0;
      } else {
        return -5;
      }
    },
    display: 'none',
    // backgroundColor: hexToRGBA('f6f6f6', 0.9)
    backgroundColor: '#f6f6f6',
    boxShadow: `0px 6px 10px ${hexToRGBA('000000', 0.32)}`,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#d1d1d1',
    borderRadius: '5px',
    boxSizing: 'border-box',
    padding: '4px 0',
    $isOpen: {
      $hasVisibleChoices: {
        display: 'block'
      }
    }
  }
}]);
var list = DOM.template(['div', {
  ref: 'list',
  passStateToChildren: false,
  style: {
    position: 'relative',
    overflow: 'scroll',
    overflowScrolling: 'touch',
    overflowStyle: '-ms-autohiding-scrollbar'
  }
}]);
var choice = DOM.template(['div', {
  style: {
    display: 'none',
    fontSize: '0',
    color: '#000000',
    userSelect: 'none',
    lineHeight: '1em',
    cursor: 'pointer',
    $visible: {
      display: 'block'
    },
    $unavailable: {
      display: 'none'
    },
    $hover: {
      color: '#ffffff',
      backgroundColor: '#4C96FF'
    }
  }
}, ['div', // Checkmark
{
  style: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: '20px',
    // height: ()-> @parent.raw.style.height
    // lineHeight: ()-> @parent.style('height')
    // fontSize: ()-> @parent.style('height')
    lineHeight: '20px',
    fontSize: '13px',
    textAlign: 'center',
    color: 'inherit',
    stroke: 'currentColor',
    visibility: 'hidden',
    $selected: {
      visibility: 'visible'
    }
  }
}, checkmark], ['div', // Text
{
  styleAfterInsert: true,
  style: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    wordWrap: 'normal',
    maxWidth: function () {
      return `calc(100% - ${this.prev.styleSafe('width', true)})`;
    },
    paddingRight: '10px',
    lineHeight: '20px',
    fontSize: '11px',
    fontFamily: function (dropdown) {
      return dropdown.settings.fontFamily;
    },
    color: 'inherit',
    boxSizing: 'border-box'
  }
}]]);
var scrollIndicatorUp = DOM.template(['div', {
  ref: 'scrollIndicatorUp',
  style: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'none',
    width: '100%',
    height: '20px',
    backgroundColor: '#f6f6f6',
    color: '#000000',
    textAlign: 'center',
    $visible: {
      display: 'block'
    }
  }
}, ['div', {
  style: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    width: '15px',
    height: '15px',
    display: 'block',
    margin: '0 auto',
    transform: 'translateY(-50%)'
  }
}, caretUp]]);
var scrollIndicatorDown = DOM.template(['div', {
  ref: 'scrollIndicatorDown',
  style: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    display: 'none',
    width: '100%',
    height: '20px',
    backgroundColor: '#f6f6f6',
    color: '#000000',
    textAlign: 'center',
    $visible: {
      display: 'block'
    }
  }
}, ['div', {
  style: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    width: '15px',
    height: '15px',
    display: 'block',
    margin: '0 auto',
    transform: 'translateY(-50%)'
  }
}, caretDown]]);
var help = DOM.template(['div', {
  ref: 'help',
  style: {
    display: 'none',
    borderTop: '2px solid rgba(0,0,0,0.05)',
    padding: '4px 12px 1px',
    color: 'rgba(0,0,0,0.5)',
    fontWeight: '500',
    fontSize: '11px',
    userSelect: 'none',
    $showHelp: {
      display: 'block'
    }
  }
}]);var template$1 = /*#__PURE__*/Object.freeze({default: template,list: list,choice: choice,scrollIndicatorUp: scrollIndicatorUp,scrollIndicatorDown: scrollIndicatorDown,help: help});export{template$1 as a,template as b,list as c,choice as d,scrollIndicatorUp as e,scrollIndicatorDown as f,help as g};