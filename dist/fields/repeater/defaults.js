import'quickdom';import'../../svg/checkmark.js';import'../../svg/angleDown.js';import'../../svg/caretUp.js';import'../../svg/caretDown.js';import'../../svg/plus.js';import'../../svg/clone.js';import'../../svg/remove.js';import'../../constants/colors.js';import'../group/template-086a82e2.js';import {a as inlineGroup,b as blockGroup}from'./template-7c284e61.js';var defaults = {
  fields: null,
  style: 'block',
  collapsable: true,
  startCollapsed: false,
  groupMargin: 10,
  groupWidth: '100%',
  autoWidth: true,
  autoRemoveEmpty: false,
  dynamicLabel: false,
  minItems: null,
  maxItems: null,
  draggable: false,
  cloneable: false,
  removeable: true,
  singleMode: false,
  numbering: false,
  multiple: true,
  groupSettings: {
    labelSize: 14,
    inline: {
      padding: 0,
      fieldMargin: 0,
      width: 'auto',
      collapsable: false,
      startCollapsed: false,
      templates: inlineGroup
    },
    block: {
      startCollapsed: false,
      templates: blockGroup
    }
  }
};export default defaults;