/* istanbul ignore next */
if (window.console == null) {
  window.console = {};
}
/* istanbul ignore next */


if (console.log == null) {
  console.log = function () {};
}
/* istanbul ignore next */


if (console.warn == null) {
  console.warn = console.log;
}