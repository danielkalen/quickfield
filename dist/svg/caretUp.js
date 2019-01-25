import DOM from'quickdom';var caretUp = DOM.template(['*svg', {
  attrs: {
    viewBox: '0 0 512 512',
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
    d: 'M402 347c0 5-2 10-5 13-4 4-8 6-13 6h-256c-5 0-9-2-13-6-3-3-5-8-5-13s2-9 5-12l128-128c4-4 8-6 13-6s9 2 13 6l128 128c3 3 5 7 5 12z'
  }
}]]);export default caretUp;