import DOM from'quickdom';var clone = DOM.template(['*svg', {
  attrs: {
    viewBox: '0 0 18 20',
    tabindex: -1,
    focusable: false
  },
  style: {
    width: '100%',
    height: '100%',
    outline: 'none'
  }
}, ['*path', {
  attrs: {
    tabindex: -1,
    focusable: false,
    d: 'M13.414,0 L6,0 C4.897,0 4,0.898 4,2 L4,14 C4,15.103 4.897,16 6,16 L16,16 C17.103,16 18,15.103 18,14 L18,4.586 L13.414,0 Z M16.001,14 L6,14 L6,2 L12,2 L12,6 L16,6 L16.001,14 Z'
  }
}], ['*path', {
  attrs: {
    tabindex: -1,
    focusable: false,
    d: 'M2,6.42379282 L0,6.42379282 L0,18 C0,19.103 0.897,20 2,20 L14,20 L14,18 L2,18 L2,6.42379282 Z'
  }
}]]);export default clone;