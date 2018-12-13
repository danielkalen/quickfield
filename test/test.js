(function (require, global) {
require = (function (cache, modules, cx) {
var loader = function (r) {
if (!modules[r]) throw new Error(r + ' is not a module');
return cache[r] ? cache[r].exports : ((cache[r] = {
exports: {}
}, cache[r].exports = modules[r].call(cx, require, cache[r], cache[r].exports)));
};
loader.modules = modules;
return loader;
})({}, {
0: function (require, module, exports) {
var COLORS, DOM, assert, chai, emitEvent, expect, extend, promiseEvent;
window.helpers = require(1);
promiseEvent = require(2);
extend = require(3);
DOM = require(4);
COLORS = require(5);
chai = require(6);
chai.use(require(7));
chai.use(require(8));
chai.use(require(9));
chai.use(require(10));
chai.use(require(11));
chai.config.truncateThreshold = 1e3;
mocha.setup('tdd');
mocha.slow(400);
mocha.timeout(12000);
if (!window.__karma__) {
mocha.bail();
}
assert = chai.assert;
expect = chai.expect;
window.sandbox = null;
this.Field = require(12);
this.Field.register('textarea', require(13));
this.Field.register('number', require(14));
this.Field.register('select', require(15));
this.Field.register('choice', require(16));
this.Field.register('truefalse', require(17));
this.Field.register('toggle', require(18));
this.Field.register('group', require(19));
this.Field.register('repeater', require(20));
emitEvent = function (target, event, trigger) {
var promise;
promise = promiseEvent(target, event);
trigger();
return promise;
};
suite("QuickField", function () {
teardown(function () {
var lastChild;
lastChild = sandbox.children[sandbox.children.length - 1];
if ((lastChild != null ? lastChild.ref : void 0) === 'testTitle') {
return lastChild.remove();
}
});
suiteSetup(function () {
return helpers.restartSandbox();
});
suite("creation", function () {
teardown(helpers.restartSandbox);
test("text field", function () {
var field;
field = Field({
type: 'text'
}).appendTo(sandbox);
assert.equal(field.el.parent, sandbox);
return assert.equal(field.el.child.input.attr('type'), 'text');
});
test("textarea field", function () {
var field;
field = Field({
type: 'textarea'
}).appendTo(sandbox);
return assert.equal(field.el.parent, sandbox);
});
test("number field", function () {
var field;
field = Field({
type: 'number'
}).appendTo(sandbox);
return assert.equal(field.el.parent, sandbox);
});
test("select field", function () {
var field;
field = Field({
type: 'select'
}).appendTo(sandbox);
return assert.equal(field.el.parent, sandbox);
});
test("choice field", function () {
var field;
field = Field({
type: 'choice',
choices: ['a', 'b']
}).appendTo(sandbox);
return assert.equal(field.el.parent, sandbox);
});
test("truefalse field", function () {
var field;
field = Field({
type: 'truefalse'
}).appendTo(sandbox);
return assert.equal(field.el.parent, sandbox);
});
test("toggle field", function () {
var field;
field = Field({
type: 'toggle'
}).appendTo(sandbox);
return assert.equal(field.el.parent, sandbox);
});
return suite("misc", function () {
return test("with multiple options object", function () {
var config, field1, field2;
config = {
type: 'text',
label: 'abc',
value: '123'
};
field1 = Field(config);
field2 = Field(config, {
label: 'def'
}, {
height: 50,
value: '456'
});
expect(config).to.eql({
type: 'text',
label: 'abc',
value: '123'
});
expect(field1.settings.label).to.equal('abc');
expect(field2.settings.label).to.equal('def');
expect(field1.settings.height).to.equal(46);
expect(field2.settings.height).to.equal(50);
expect(field1.value).to.equal('123');
return expect(field2.value).to.equal('456');
});
});
});
suite("text field", function () {
suiteSetup(function () {
helpers.addTitle("text field");
return this.control = Field({
type: 'text',
label: 'Regular'
}).appendTo(sandbox);
});
teardown(function () {
return this.control.value = '';
});
test("getter/setter", function () {
var fieldA, fieldB, fieldC, getter, setter;
getter = function (value) {
return `example.com/${value}`;
};
setter = function (value) {
return value.toLowerCase();
};
fieldA = Field({
type: 'text',
label: 'path',
getter
});
fieldB = Field({
type: 'text',
label: 'path',
setter
});
fieldC = Field({
type: 'text',
label: 'path',
getter,
setter
});
expect(fieldA.value).to.equal('example.com/');
expect(fieldA.el.child.input.raw.value).to.equal('');
expect(fieldB.value).to.equal('');
expect(fieldB.el.child.input.raw.value).to.equal('');
expect(fieldC.value).to.equal('example.com/');
expect(fieldC.el.child.input.raw.value).to.equal('');
helpers.simulateKeys(fieldA.el.child.input.raw, 'AbC');
helpers.simulateKeys(fieldB.el.child.input.raw, 'AbC');
helpers.simulateKeys(fieldC.el.child.input.raw, 'AbC');
expect(fieldA.value).to.equal('example.com/AbC');
expect(fieldA.el.child.input.raw.value).to.equal('AbC');
expect(fieldB.value).to.equal('abc');
expect(fieldB.el.child.input.raw.value).to.equal('abc');
expect(fieldC.value).to.equal('example.com/abc');
expect(fieldC.el.child.input.raw.value).to.equal('abc');
fieldA.value = 'DeF';
fieldB.value = 'DeF';
fieldC.value = 'DeF';
expect(fieldA.value).to.equal('example.com/DeF');
expect(fieldA.el.child.input.raw.value).to.equal('DeF');
expect(fieldB.value).to.equal('def');
expect(fieldB.el.child.input.raw.value).to.equal('def');
expect(fieldC.value).to.equal('example.com/def');
return expect(fieldC.el.child.input.raw.value).to.equal('def');
});
test("with help message", function () {
var field;
field = Field({
type: 'text',
label: 'With Help Message',
help: 'help <b>message</b> here'
}).appendTo(sandbox);
expect(field.el.text).to.include('help message here');
expect(field.els.help.html).to.equal('help <b>message</b> here');
expect(this.control.els.help.html).to.equal('');
expect(this.control.el.raw).to.have.style('marginBottom', '0px');
expect(field.el.raw).to.have.style('marginBottom', '25px');
field.state.help = '';
expect(field.el.raw).to.have.style('marginBottom', '0px');
expect(field.els.help.html).to.equal('');
field.state.error = 'abc123';
expect(field.el.raw).to.have.style('marginBottom', '0px');
expect(field.els.help.html).to.equal('');
field.state.showError = true;
expect(field.el.raw).to.have.style('marginBottom', '25px');
expect(field.els.help.html).to.equal('abc123');
field.state.help = 'def456';
expect(field.el.raw).to.have.style('marginBottom', '25px');
expect(field.els.help.html).to.equal('def456');
field.state.help = '';
field.state.showError = false;
expect(field.el.raw).to.have.style('marginBottom', '25px');
return expect(field.els.help.html).to.equal('help <b>message</b> here');
});
test("without label", function () {
var initialTop, withLabel, withoutLabel;
withLabel = Field({
type: 'text',
label: 'With Label'
}).appendTo(sandbox);
withoutLabel = Field({
type: 'text',
placeholder: 'Without Label'
}).appendTo(sandbox);
DOM.batch([withLabel.els.label, withLabel.els.innerwrap, withLabel.els.input, withoutLabel.els.label, withoutLabel.els.innerwrap, withoutLabel.els.input]).style('transition', null);
assert.equal(withLabel.el.child.placeholder.html, 'With Label');
assert.equal(withLabel.el.child.label.html, 'With Label');
assert.equal(withLabel.el.child.label.style('opacity'), '0');
assert.equal(withoutLabel.el.child.placeholder.html, 'Without Label');
assert.notEqual(withoutLabel.el.child.label.html, 'Without Label');
assert.equal(withoutLabel.el.child.label.style('opacity'), '0');
initialTop = {
withLabel: withLabel.el.child.input.rect.top,
withoutLabel: withoutLabel.el.child.input.rect.top
};
withLabel.value = 'abc123';
withoutLabel.value = 'abc123';
assert.notEqual(withLabel.el.child.input.rect.top, initialTop.withLabel);
assert.equal(withoutLabel.el.child.input.rect.top, initialTop.withoutLabel);
assert.equal(withLabel.el.child.label.style('opacity'), '1');
return assert.equal(withoutLabel.el.child.label.style('opacity'), '0');
});
test("with icon", function () {
var iconField;
return iconField = Field({
type: 'text',
label: 'With Icon',
icon: 'B'
}).appendTo(sandbox);
});
test("custom height/fontsize", function () {
var fieldA, fieldB;
fieldA = Field({
type: 'text',
label: 'Custom Height',
height: 40,
fontSize: 13,
autoWidth: true
}).appendTo(sandbox);
fieldB = Field({
type: 'text',
label: 'Custom Height',
height: 60,
fontSize: 16,
autoWidth: true
}).appendTo(sandbox);
assert.isAtLeast(this.control.el.height, this.control.settings.height);
assert.isAtMost(this.control.el.height, this.control.settings.height + 5);
assert.isAtLeast(fieldA.el.height, 40);
assert.isAtMost(fieldA.el.height, 45);
assert.isAtLeast(fieldB.el.height, 60);
return assert.isAtMost(fieldB.el.height, 65);
});
test("custom border", function () {
var custom;
custom = Field({
type: 'text',
label: 'Custom Border',
border: '0 0 2px 0'
}).appendTo(sandbox);
assert.deepEqual(helpers.getBorderSides(this.control.el.child.innerwrap), {
top: '1px',
left: '1px',
right: '1px',
bottom: '1px'
});
return assert.deepEqual(helpers.getBorderSides(custom.el.child.innerwrap), {
top: '0px',
left: '0px',
right: '0px',
bottom: '2px'
});
});
test("default value", function () {
var fieldA, fieldB, fieldC;
fieldA = Field({
type: 'text'
});
fieldB = Field({
type: 'text',
defaultValue: 'valueB'
});
fieldC = Field({
type: 'text',
value: 'valueC'
});
assert.equal(fieldA.value, '');
assert.equal(fieldA.el.child.input.raw.value, '');
assert.equal(fieldB.value, 'valueB');
assert.equal(fieldB.el.child.input.raw.value, 'valueB');
assert.equal(fieldC.value, 'valueC');
return assert.equal(fieldC.el.child.input.raw.value, 'valueC');
});
test("disabled", function () {
var fieldA, fieldB;
fieldA = Field({
type: 'text',
label: 'Disabled',
autoWidth: true,
disabled: true
}).appendTo(sandbox);
fieldB = Field({
type: 'text',
label: 'Disabled w/ value',
autoWidth: true,
disabled: true,
value: 'abc123'
}).appendTo(sandbox);
window.assert = assert;
expect(this.control.value).to.equal('');
expect(this.control.el.child.input.raw.value).to.equal('');
expect(this.control.el.child.innerwrap.raw).to.have.style('backgroundColor', 'white');
expect(fieldA.value).to.equal('');
expect(fieldA.el.child.input.raw.value).to.equal('');
expect(fieldA.el.child.innerwrap.raw).to.have.style('backgroundColor', COLORS.grey_light);
expect(fieldB.value).to.equal('abc123');
expect(fieldB.el.child.input.raw.value).to.equal('abc123');
return expect(fieldB.el.child.innerwrap.raw).to.have.style('backgroundColor', COLORS.grey_light);
});
test("conditions", function () {
var master, slave;
master = Field({
type: 'text',
label: 'Master Field',
ID: 'masterField',
mask: 'aaa-111',
required: true,
autoWidth: true
}).appendTo(sandbox);
return slave = Field({
type: 'text',
label: 'Slave Field',
conditions: [{
target: 'masterField'
}],
autoWidth: true
}).appendTo(sandbox);
});
test("autowidth", function () {
var field;
return field = Field({
type: 'text',
label: 'Autowidth',
autoWidth: true,
checkmark: false
}).appendTo(sandbox);
});
test("input event", function () {
var count, field, input;
count = 0;
field = this.control;
input = field.els.input.raw;
field.on('input', function () {
return count++;
});
return Promise.resolve().then(function () {
return expect(count).to.equal(0);
}).then(function () {
return emitEvent(field, 'input', () => {
return field.value = 'change';
});
}).then(function () {
return expect(count).to.equal(1);
}).then(function () {
return emitEvent(field, 'input', () => {
return field.value = 'change2';
});
}).then(function () {
return expect(count).to.equal(2);
}).then(function () {
return emitEvent(field, 'input', () => {
return helpers.simulateKeys(input, 'a');
});
}).then(function () {
return expect(count).to.equal(3);
}).then(function () {
return emitEvent(field, 'input', () => {
return helpers.simulateKeys(input, 'abc');
});
}).then(function () {
return expect(count).to.equal(6);
});
});
suite("options/autocomplete", function () {
suiteSetup(function () {
this.field = Field({
type: 'text',
label: 'My options field',
choices: ['apple', 'banana', 'orange', 'banana republic', {
label: 'orange split',
value: 'split'
}]
}).appendTo(sandbox);
this.choices = this.field.dropdown.choices;
this.dropdownEl = this.field.dropdown.els.container.raw;
return this.inputEl = this.field.el.child.input.raw;
});
teardown(function () {
this.field.blur();
return this.field.value = '';
});
test("triggering", function () {
return Promise.bind(this).then(function () {
var promise;
expect(this.dropdownEl).not.to.be.displayed;
promise = promiseEvent(this.field.el.child.input, 'focus');
this.field.focus();
return promise;
}).then(function () {
var promise;
expect(this.dropdownEl).not.to.be.displayed;
helpers.simulateKeys(this.inputEl, 'a');
expect(this.dropdownEl).to.be.displayed;
promise = promiseEvent(this.field.el.child.input, 'blur');
this.field.blur();
return promise;
}).then(function () {
expect(this.dropdownEl).not.to.be.displayed;
this.field.focus();
helpers.simulateAction(this.inputEl, 'down');
return expect(this.dropdownEl).not.to.be.displayed;
}).then(function () {
helpers.simulateKeys(this.inputEl, 'a');
return expect(this.dropdownEl).to.be.displayed;
}).then(function () {
var promise;
promise = promiseEvent(this.field.el.child.input, 'blur');
this.field.blur();
return promise;
}).then(function () {
this.field.dropdown.isOpen = true;
expect(this.dropdownEl).to.be.displayed;
this.field.dropdown.isOpen = false;
return expect(this.dropdownEl).not.to.be.displayed;
});
});
test("highlighting", function () {
this.field.focus();
helpers.simulateKeys(this.inputEl, 'a');
expect(this.field.dropdown.currentHighlighted).to.equal(null);
helpers.simulateAction(this.inputEl, 'down');
expect(this.field.dropdown.currentHighlighted).to.equal(this.choices[0]);
helpers.simulateAction(this.inputEl, 'down');
helpers.simulateAction(this.inputEl, 'down');
expect(this.field.dropdown.currentHighlighted).to.equal(this.choices[2]);
helpers.simulateAction(this.inputEl, 'down');
helpers.simulateAction(this.inputEl, 'down');
expect(this.field.dropdown.currentHighlighted).to.equal(this.choices[4]);
helpers.simulateAction(this.inputEl, 'down');
expect(this.field.dropdown.currentHighlighted).to.equal(this.choices[0]);
helpers.simulateAction(this.inputEl, 'up');
expect(this.field.dropdown.currentHighlighted).to.equal(this.choices[4]);
helpers.simulateAction(this.inputEl, 'up');
expect(this.field.dropdown.currentHighlighted).to.equal(this.choices[3]);
this.field.blur();
return expect(this.field.dropdown.currentHighlighted).to.equal(null);
});
test("filtering", function () {
var getVisible;
getVisible = () => {
return this.choices.filter(function (choice) {
return choice.visible;
}).map(function (choice) {
return choice.value;
});
};
this.field.focus();
expect(getVisible()).to.eql(['apple', 'banana', 'orange', 'banana republic', 'split']);
helpers.simulateKeys(this.inputEl, 'ban');
expect(getVisible()).to.eql(['banana', 'banana republic']);
helpers.simulateKeys(this.inputEl, 'ana');
expect(getVisible()).to.eql(['banana', 'banana republic']);
helpers.simulateKeys(this.inputEl, ' ');
expect(getVisible()).to.eql(['banana republic']);
this.field.value = 'ora';
return expect(getVisible()).to.eql(['orange', 'split']);
});
return test("selecting", function () {
this.field.focus();
expect(this.field.value).to.equal('');
this.choices[1].el.emit('click');
expect(this.field.value).to.equal('banana');
expect(this.inputEl.value).to.equal('banana');
this.field.focus();
this.field.state.typing = true;
this.field.value = 'ora';
helpers.simulateAction(this.inputEl, 'down');
helpers.simulateAction(this.inputEl, 'down');
expect(this.field.dropdown.currentHighlighted).to.equal(this.choices[4]);
expect(this.field.value).to.equal('ora');
expect(this.inputEl.value).to.equal('ora');
helpers.simulateAction(this.inputEl, 'enter');
expect(this.field.value).to.equal('split');
expect(this.inputEl.value).to.equal('orange split');
this.field.value = 'orange';
expect(this.field.value).to.equal('orange');
expect(this.inputEl.value).to.equal('orange');
this.field.value = 'orange split';
expect(this.field.value).to.equal('split');
return expect(this.inputEl.value).to.equal('orange split');
});
});
suite("keyboard/custom-type", function () {
test("password", function () {
var field;
return field = Field({
type: 'text',
label: 'Password',
keyboard: 'password'
}).appendTo(sandbox);
});
test("email", function () {
var field;
field = Field({
type: 'text',
label: 'Email',
ID: 'email',
keyboard: 'email',
required: true
}).appendTo(sandbox);
return field = Field({
type: 'text',
label: 'Email',
keyboard: 'email',
mask: {
guide: false
},
required: true
}).appendTo(sandbox);
});
return test("number (simluated)", function () {
var field;
return field = Field({
type: 'text',
label: 'Number (simluated)',
keyboard: 'number',
validWhenRegex: /[^0]/,
autoWidth: true
}).appendTo(sandbox);
});
});
return suite("mask", function () {
suiteSetup(function () {
return helpers.addTitle('mask');
});
test("alpha", function () {
var field;
field = Field({
type: 'text',
label: 'Name',
mask: 'NAME',
width: '50%'
}).appendTo(sandbox);
return field = Field({
type: 'text',
label: 'Full Name',
mask: 'FULLNAME',
width: '50%'
}).appendTo(sandbox);
});
test("numeric", function () {
var field;
field = Field({
type: 'text',
label: 'Phone',
distance: 10,
width: '50%',
mobileWidth: '100%',
mask: '(111) 111-1111'
}).appendTo(sandbox);
return field = Field({
type: 'text',
label: 'Phone',
distance: 10,
width: '50%',
mobileWidth: '100%',
keyboard: 'phone'
}).appendTo(sandbox);
});
test("alphanumeric", function () {
var field;
return field = Field({
type: 'text',
label: 'Licence Plate',
mask: {
pattern: 'aaa-111',
transform: function (v) {
return v.toUpperCase();
}
}
}).appendTo(sandbox);
});
test("prefix", function () {
var field;
return field = Field({
type: 'text',
label: 'Dollar',
mask: {
pattern: 'NUMBER',
prefix: '$',
decimal: true,
sep: true
}
}).appendTo(sandbox);
});
test("date", function () {
var field;
field = Field({
type: 'text',
label: 'Date',
keyboard: 'date',
autoWidth: true
}).appendTo(sandbox);
return field = Field({
type: 'text',
label: 'Date',
mask: {
pattern: ['DATE', 'mm / yy']
},
autoWidth: true
}).appendTo(sandbox);
});
test("literal", function () {
var field;
return field = Field({
type: 'text',
label: 'Literal',
mask: 'My N\\ame is a+ K\\alen'
}).appendTo(sandbox);
});
test("optionals", function () {
var field;
return field = Field({
type: 'text',
label: 'Optionals',
mask: 'aaa[AAA]111'
}).appendTo(sandbox);
});
return test("custom patterns", function () {
var field;
return field = Field({
type: 'text',
label: 'Only specific chars',
mask: {
pattern: '&&+-aa-111-[ aa+]',
customPatterns: {
'&': /[ab12]/,
'a': /[0-4]/
}
}
}).appendTo(sandbox);
});
});
});
suite("number field", function () {
suiteSetup(function () {
return helpers.addTitle('number field');
});
test("basic", function () {
var field;
return field = Field({
type: 'number',
label: 'Number',
autoWidth: false
}).appendTo(sandbox);
});
test.skip("getter/setter", function () {
var fieldA, fieldB, fieldC, getter, setter;
getter = function (value) {
return (value || 0) * 10;
};
setter = function (value) {
return (value || 0) * 2;
};
fieldA = Field({
type: 'number',
label: 'Number',
autoWidth: true,
getter
});
fieldB = Field({
type: 'number',
label: 'Number',
autoWidth: true,
setter
});
fieldC = Field({
type: 'number',
label: 'Number',
autoWidth: true,
getter,
setter
});
expect(fieldA.value).to.equal(0);
expect(fieldA.el.child.input.raw.value).to.equal('');
expect(fieldB.value).to.equal(0);
expect(fieldB.el.child.input.raw.value).to.equal('');
expect(fieldC.value).to.equal(0);
expect(fieldC.el.child.input.raw.value).to.equal('');
helpers.simulateKeys(fieldA.el.child.input.raw, '3');
helpers.simulateKeys(fieldB.el.child.input.raw, '3');
helpers.simulateKeys(fieldC.el.child.input.raw, '3');
expect(fieldA.value).to.equal(30);
expect(fieldA.el.child.input.raw.value).to.equal('3');
expect(fieldB.value).to.equal(6);
expect(fieldB.el.child.input.raw.value).to.equal('6');
expect(fieldC.value).to.equal(60);
expect(fieldC.el.child.input.raw.value).to.equal('6');
fieldA.value = 12;
fieldB.value = 12;
fieldC.value = 12;
expect(fieldA.value).to.equal(120);
expect(fieldA.el.child.input.raw.value).to.equal('12');
expect(fieldB.value).to.equal(24);
expect(fieldB.el.child.input.raw.value).to.equal('24');
expect(fieldC.value).to.equal(240);
return expect(fieldC.el.child.input.raw.value).to.equal('24');
});
test("min/max", function () {
var field;
return field = Field({
type: 'number',
label: 'Number (min/max)',
minValue: 10,
maxValue: 1000,
autoWidth: true
}).appendTo(sandbox);
});
test("min/max/step", function () {
var field;
return field = Field({
type: 'number',
label: 'Number (min/max/step)',
minValue: 10,
maxValue: 100,
step: 3,
autoWidth: true
}).appendTo(sandbox);
});
test("min/max/step (enforced)", function () {
var field;
return field = Field({
type: 'number',
label: 'Number (enforced)',
minValue: 10,
maxValue: 100,
step: 12,
enforce: true,
autoWidth: true
}).appendTo(sandbox);
});
return test("decimal step", function () {
var field;
return field = Field({
type: 'number',
label: 'Number (decimal step)',
minValue: 0.1,
maxValue: 100,
step: 0.1,
autoWidth: true
}).appendTo(sandbox);
});
});
suite("textarea field", function () {
suiteSetup(function () {
return helpers.addTitle('textarea field');
});
test("basic", function () {
var field;
return field = Field({
type: 'textarea',
label: 'Textarea',
width: '300px',
height: '250px',
autoHeight: false
}).appendTo(sandbox);
});
test("getter/setter", function () {
var fieldA, fieldB, fieldC, getter, setter;
getter = function (value) {
return `example.com/${value}`;
};
setter = function (value) {
return value.toLowerCase();
};
fieldA = Field({
type: 'textarea',
label: 'path',
getter
});
fieldB = Field({
type: 'textarea',
label: 'path',
setter
});
fieldC = Field({
type: 'textarea',
label: 'path',
getter,
setter
});
expect(fieldA.value).to.equal('example.com/');
expect(fieldA.el.child.input.raw.value).to.equal('');
expect(fieldB.value).to.equal('');
expect(fieldB.el.child.input.raw.value).to.equal('');
expect(fieldC.value).to.equal('example.com/');
expect(fieldC.el.child.input.raw.value).to.equal('');
helpers.simulateKeys(fieldA.el.child.input.raw, 'AbC');
helpers.simulateKeys(fieldB.el.child.input.raw, 'AbC');
helpers.simulateKeys(fieldC.el.child.input.raw, 'AbC');
expect(fieldA.value).to.equal('example.com/AbC');
expect(fieldA.el.child.input.raw.value).to.equal('AbC');
expect(fieldB.value).to.equal('abc');
expect(fieldB.el.child.input.raw.value).to.equal('abc');
expect(fieldC.value).to.equal('example.com/abc');
expect(fieldC.el.child.input.raw.value).to.equal('abc');
fieldA.value = 'DeF';
fieldB.value = 'DeF';
fieldC.value = 'DeF';
expect(fieldA.value).to.equal('example.com/DeF');
expect(fieldA.el.child.input.raw.value).to.equal('DeF');
expect(fieldB.value).to.equal('def');
expect(fieldB.el.child.input.raw.value).to.equal('def');
expect(fieldC.value).to.equal('example.com/def');
return expect(fieldC.el.child.input.raw.value).to.equal('def');
});
test("autoheight", function () {
var field;
return field = Field({
type: 'textarea',
label: 'Textarea (autoHeight)',
width: '300px',
maxHeight: 500
}).appendTo(sandbox);
});
return test("autowidth", function () {
var field;
return field = Field({
type: 'textarea',
label: 'Textarea (autowidth)',
autoWidth: true,
maxWidth: 300
}).appendTo(sandbox);
});
});
suite("select field", function () {
suiteSetup(function () {
return helpers.addTitle('select field');
});
test("single selectable", function () {
var field;
return field = Field({
type: 'select',
label: 'My Choices (single)',
choices: ['Apple', 'Apple Juice', 'Banana', 'Orange', {
label: 'Lemon',
value: 'lime',
conditions: {
'email': 'valid'
}
}]
}).appendTo(sandbox);
});
test("multi selectable", function () {
var field;
field = Field({
type: 'select',
label: 'My Choices (multi)',
choices: ['Apple', 'Banana', 'Orange', 'Lime', 'Kiwi'],
multiple: true,
defaultValue: 'Apple'
}).appendTo(sandbox);
return assert.equal(field.value, 'Apple');
});
test("default value", function () {
var field;
field = Field({
type: 'select',
label: 'My Choices (default)',
choices: ['Apple', 'Banana', 'Orange', {
label: 'Lemon',
value: 'lime',
conditions: {
'email': 'valid'
}
}],
value: 'Banana'
}).appendTo(sandbox);
assert.equal(field.value, 'Banana');
field = Field({
type: 'select',
label: 'My Choices (default)',
value: 'Banana'
}).appendTo(sandbox);
return assert.equal(field.value, 'Banana');
});
test("cusotm border", function () {
var field;
return field = Field({
type: 'select',
label: 'Custom Border',
choices: ['Apple', 'Banana', 'Orange'],
border: '0 0 2px 0',
margin: '0 0 30px'
}).appendTo(sandbox);
});
test("no choices", function () {
var field;
return field = Field({
type: 'select',
label: 'No choices',
autoWidth: true
}).appendTo(sandbox);
});
return test("many choices", function () {
var field;
return field = Field({
type: 'select',
label: 'Many Choices',
choices: helpers.companyNames,
autoWidth: true
}).appendTo(sandbox);
});
});
suite("choice field", function () {
suiteSetup(function () {
helpers.addTitle('choice field');
this.control = Field({
type: 'choice',
choices: ['Apple', 'Banana', 'Orange'],
required: true
});
return this.controlMulti = Field({
type: 'choice',
choices: ['Apple', 'Banana', 'Orange'],
required: true,
multiple: true
});
});
test("single selectable", function () {
var field;
return field = Field({
type: 'choice',
label: 'My Choices (single)',
choices: ['Apple', 'Banana', 'Orange']
}).appendTo(sandbox);
});
test("multi selectable", function () {
var field;
return field = Field({
type: 'choice',
label: 'My Choices (multi)',
choices: ['Apple', 'Banana', 'Orange', 'Lime', 'Kiwi'],
perGroup: 3,
multiple: true
}).appendTo(sandbox);
});
test("default value", function () {
var field;
field = Field({
type: 'choice',
label: 'My Choices (single)',
choices: ['Apple', 'Banana', 'Orange'],
value: 'Orange'
}).appendTo(sandbox);
assert.equal(field.value, 'Orange');
assert.equal(field.findChoice('Orange').selected, true);
field = Field({
type: 'choice',
label: 'My Choices (multi)',
choices: ['Apple', 'Banana', 'Orange', 'Lime', 'Kiwi'],
multiple: true,
value: ['Banana', 'Lime']
}).appendTo(sandbox);
assert.deepEqual(field.value, ['Banana', 'Lime']);
assert.equal(field.findChoice('Banana').selected, true);
return assert.equal(field.findChoice('Lime').selected, true);
});
test("conditions", function () {
var field, master;
master = Field({
type: 'text',
ID: 'master',
required: true
}).appendTo(sandbox);
return field = Field({
type: 'choice',
label: 'My Choices (single)',
choices: ['Apple', {
label: 'Banana',
value: 'banana',
conditions: {
'master': /^bana/
}
}, 'Orange', {
label: 'Lemon',
value: 'lime',
conditions: {
'master': 'valid'
}
}]
}).appendTo(sandbox);
});
test("getter/setter", function () {
var fieldA, fieldB, fieldC, getter, ref, ref1, ref2, ref3, ref4, ref5, setter;
getter = function (value) {
return (value != null ? value.toUpperCase() : void 0) || value;
};
setter = function (value) {
if ((value != null ? value.value : void 0) === 'Banana') {
return 'Apple';
} else {
return value;
}
};
fieldA = Field({
type: 'choice',
choices: ['Apple', 'Banana', 'Orange'],
getter
}).appendTo(sandbox);
fieldB = Field({
type: 'choice',
choices: ['Apple', 'Banana', 'Orange'],
setter
}).appendTo(sandbox);
fieldC = Field({
type: 'choice',
choices: ['Apple', 'Banana', 'Orange'],
getter,
setter
}).appendTo(sandbox);
expect(fieldA.value).to.equal(void 0);
expect(fieldA.valueRaw).to.equal(null);
expect(fieldB.value).to.equal(void 0);
expect(fieldB.valueRaw).to.equal(null);
expect(fieldC.value).to.equal(void 0);
expect(fieldC.valueRaw).to.equal(null);
fieldA.choices[1].el.emit('click');
fieldB.choices[1].el.emit('click');
fieldC.choices[1].el.emit('click');
expect(fieldA.value).to.equal('BANANA');
expect((ref = fieldA.valueRaw) != null ? ref.value : void 0).to.equal('Banana');
expect(fieldB.value).to.equal('Apple');
expect((ref1 = fieldB.valueRaw) != null ? ref1.value : void 0).to.equal('Apple');
expect(fieldC.value).to.equal('APPLE');
expect((ref2 = fieldC.valueRaw) != null ? ref2.value : void 0).to.equal('Apple');
fieldA.value = 'Orange';
fieldB.value = 'Orange';
fieldC.value = 'Orange';
expect(fieldA.value).to.equal('ORANGE');
expect((ref3 = fieldA.valueRaw) != null ? ref3.value : void 0).to.equal('Orange');
expect(fieldB.value).to.equal('Orange');
expect((ref4 = fieldB.valueRaw) != null ? ref4.value : void 0).to.equal('Orange');
expect(fieldC.value).to.equal('ORANGE');
return expect((ref5 = fieldC.valueRaw) != null ? ref5.value : void 0).to.equal('Orange');
});
return test("valid when selected", function () {
var multiple, single;
single = Field({
type: 'choice',
choices: ['Apple', 'Banana', 'Orange'],
required: true,
validWhenSelected: true
});
multiple = Field({
type: 'choice',
choices: ['Apple', 'Banana', 'Orange'],
required: true,
validWhenSelected: 2,
multiple: true
});
expect(single.validate()).to.equal(false);
expect(multiple.validate()).to.equal(false);
expect(this.control.validate()).to.equal(false);
expect(this.controlMulti.validate()).to.equal(false);
single.value = multiple.value = this.control.value = this.controlMulti.value = 'Banana';
expect(single.validate()).to.equal(true);
expect(multiple.validate()).to.equal(false);
expect(this.control.validate()).to.equal(true);
expect(this.controlMulti.validate()).to.equal(true);
multiple.value = ['Apple', 'Banana'];
return expect(multiple.validate()).to.equal(true);
});
});
suite("truefalse field", function () {
suiteSetup(function () {
return helpers.addTitle('truefalse field');
});
test("basic", function () {
var field;
field = Field({
type: 'truefalse',
label: 'Is it true or false?',
width: 'auto'
}).appendTo(sandbox).el.style('marginRight', 20);
return assert.equal(field.value, null);
});
return test("default value", function () {
var field;
field = Field({
type: 'truefalse',
label: 'It\'s false by default',
width: 'auto',
choiceLabels: ['Yes', 'No'],
value: false
}).appendTo(sandbox);
field.el.style('marginRight', 20);
assert.equal(field.value, false);
field = Field({
type: 'truefalse',
label: 'It\'s true by default',
width: 'auto',
choiceLabels: ['Yes', 'No'],
value: true
}).appendTo(sandbox);
field.el.style('marginRight', 20);
return assert.equal(field.value, true);
});
});
suite("toggle field", function () {
suiteSetup(function () {
return helpers.addTitle('toggle field');
});
test("basic", function () {
var field;
return field = Field({
type: 'toggle',
label: 'The toggle field',
width: 'auto'
}).appendTo(sandbox).el.style('marginRight', 20);
});
test("default value", function () {
var field;
return field = Field({
type: 'toggle',
label: 'Toggled by default',
width: '130px',
defaultValue: 1
}).appendTo(sandbox).el.style('marginRight', 20);
});
test("custom size", function () {
var field;
return field = Field({
type: 'toggle',
label: 'Custom size toggle',
width: 'auto',
size: 40
}).appendTo(sandbox).el.style('marginRight', 20);
});
test("aligned style", function () {
var field;
return field = Field({
type: 'toggle',
label: 'Aligned style',
style: 'aligned',
width: 'auto'
}).appendTo(sandbox);
});
return test("aligned style + defined width", function () {
var field;
field = Field({
type: 'toggle',
label: 'Aligned style with defined width',
style: 'aligned',
width: '400px'
}).appendTo(sandbox);
return field = Field({
type: 'toggle',
label: 'Aligned style with defined width',
style: 'aligned',
width: '200px'
}).appendTo(sandbox);
});
});
suite("group field", function () {
setup(helpers.addDivider);
suiteSetup(function () {
helpers.addTitle('group field');
this.fields = {
first: {
type: 'text',
label: 'First',
width: '49%'
},
second: {
type: 'text',
label: 'Second',
width: '49%'
},
third: {
type: 'select',
label: 'Third',
width: '74%',
choices: ['Apple', 'Banana', 'Kiwi'],
value: 'Kiwi'
},
fourth: {
type: 'toggle',
label: 'Fourth',
style: 'aligned',
width: '24%',
conditions: {
third: 'Kiwi'
}
}
};
return this.control = Field({
type: 'group',
label: 'Basic Group',
width: '70%',
fieldMargin: 10,
fieldAlign: 'middle',
fields: this.fields
}).appendTo(sandbox);
});
test("basic", function () {
expect(this.control.value).to.eql({
first: '',
second: '',
third: 'Kiwi',
fourth: false
});
expect(this.control.state.interacted).to.equal(false);
this.control.value = {
first: 'valueA',
third: 'Kawa',
fourth: true,
fifth: '5'
};
expect(this.control.value).to.eql({
first: 'valueA',
second: '',
third: 'Kawa',
fourth: true
});
expect(this.control.state.interacted).to.equal(true);
this.control.value = {
second: 'valueB',
third: 'Apple'
};
expect(this.control.value).to.eql({
first: 'valueA',
second: 'valueB',
third: 'Apple',
fourth: true
});
this.control.value = null;
return expect(this.control.value).to.eql({
first: 'valueA',
second: 'valueB',
third: 'Apple',
fourth: true
});
});
test("collapsed by default", function () {
var field;
field = Field({
type: 'group',
width: '70%',
fieldMargin: 10,
startCollapsed: true,
fields: this.fields
}).appendTo(sandbox);
expect(this.control.els.innerwrap.raw).to.be.displayed;
expect(field.els.innerwrap.raw).not.to.be.displayed;
this.control.state.collapsed = true;
field.state.collapsed = false;
expect(this.control.els.innerwrap.raw).not.to.be.displayed;
expect(field.els.innerwrap.raw).to.be.displayed;
this.control.els.collapse.emit('click');
field.els.collapse.emit('click');
expect(this.control.els.innerwrap.raw).to.be.displayed;
return expect(field.els.innerwrap.raw).not.to.be.displayed;
});
return test("default value", function () {
var field;
field = Field({
type: 'group',
width: '70%',
fieldMargin: 10,
fields: this.fields,
value: {
first: 'firstValue',
third: 'Banana'
}
});
return expect(field.value).to.eql({
first: 'firstValue',
second: '',
third: 'Banana',
fourth: false
});
});
});
suite("repeater field", function () {
setup(helpers.addDivider);
suiteSetup(function () {
helpers.addDivider(40);
this.fields = {
first: {
type: 'text',
name: 'first',
label: 'First',
width: '49%'
},
second: {
type: 'text',
name: 'second',
label: 'Second',
width: '49%'
}
};
return this.control = Field({
type: 'repeater',
label: 'Basic Repeater',
width: '70%',
fieldMargin: 10,
numbering: true,
cloneable: true,
fields: this.fields
}).appendTo(sandbox);
});
test("block", function () {
expect(this.control.value).to.eql([]);
expect(this.control.state.interacted).to.equal(false);
this.control.els.addButton.emit('click');
expect(this.control.value).to.eql([{
first: '',
second: ''
}]);
expect(this.control.state.interacted).to.equal(true);
this.control.value = {
first: 'abc',
second: 'def'
};
expect(this.control.value).to.eql([{
first: '',
second: ''
}, {
first: 'abc',
second: 'def'
}]);
expect(this.control._value[0].els.label.text).to.equal('Item 1');
expect(this.control._value[1].els.label.text).to.equal('Item 2');
this.control._value[0].els.remove.emit('click');
expect(this.control.value).to.eql([{
first: 'abc',
second: 'def'
}]);
expect(this.control._value[0].els.label.text).to.equal('Item 1');
this.control.value = [{
first: 'ABC'
}, {
second: 'DEF'
}];
return expect(this.control.value).to.eql([{
first: 'ABC',
second: 'def'
}, {
first: '',
second: 'DEF'
}]);
});
test("inline", function () {
var field;
field = Field({
type: 'repeater',
label: 'Inline Repeater',
width: '70%',
fieldMargin: 10,
numbering: true,
autoRemoveEmpty: true,
style: 'inline',
value: [{
first: 'abc',
second: '123'
}, {
second: '456'
}],
fields: {
first: extend({
autoWidth: true
}, this.fields.first),
second: extend({
autoWidth: true
}, this.fields.second)
}
}).appendTo(sandbox);
return expect(field.value).to.eql([{
first: 'abc',
second: '123'
}, {
first: '',
second: '456'
}]);
});
test("inline singleMode", function () {
var field;
field = Field({
type: 'repeater',
label: 'Inline Repeater',
width: '70%',
fieldMargin: 10,
autoWidth: false,
autoRemoveEmpty: true,
numbering: true,
style: 'inline',
singleMode: true,
groupSettings: {
inline: {
width: '100%'
}
},
fields: extend.clone(this.fields.first, {
width: '100%'
})
}).appendTo(sandbox);
expect(field.value).to.eql([]);
field.value = ['abc', '123'];
expect(field.value).to.eql(['abc', '123']);
field.value = 'def';
return expect(field.value).to.eql(['abc', '123', 'def']);
});
return test("dynamicLabel", function () {
var field;
field = Field({
type: 'repeater',
label: 'Inline Repeater',
width: '70%',
dynamicLabel: 'first',
fieldMargin: 10,
autoRemoveEmpty: true,
value: [{
first: 'abc',
second: '123'
}, {
second: '456'
}],
fields: {
first: extend({
autoWidth: true
}, this.fields.first),
second: extend({
autoWidth: true
}, this.fields.second)
}
}).appendTo(sandbox);
expect(field._value[0].el.child.label.text).to.equal('abc');
expect(field._value[1].el.child.label.text).to.equal('');
field.value = [{
first: 'def'
}, {
first: '123'
}];
expect(field._value[0].el.child.label.text).to.equal('def');
return expect(field._value[1].el.child.label.text).to.equal('123');
});
});
return suite(".config()", function () {
return test("creates a new copy of QuickField with setting overrides and template overrides", function () {
var Field2, choice, textA, textB, textC, textD;
Field2 = Field.config({
global: {
fontFamily: 'helvetica',
width: '50%',
required: true,
border: '0 0 2px 0',
margin: '0 10px 10px 0',
fontSize: 13,
inputPadding: 8
},
text: {
height: 40,
autoWidth: true,
inputPadding: 0,
checkmark: false,
minLength: 2,
mask: {
placeholder: '*',
decimal: true
}
}
}, {
global: {
field: {
options: {
style: {
verticalAlign: 'middle'
}
},
children: {
label: {
options: {
style: {
$focus: {
color: COLORS.green
}
}
}
},
innerwrap: {
options: {
style: {
$focus: {
borderColor: COLORS.green
}
}
}
}
}
}
},
text: {
default: {
children: {
label: {
options: {
style: {
fontWeight: 700
}
}
}
}
}
},
choice: {
choice: {
options: {
style: {
$selected: {
color: COLORS.green
}
}
}
}
}
});
expect(Field2).not.to.equal(Field);
textA = Field({
type: 'text',
label: 'textA'
}).appendTo(sandbox);
textB = Field2({
type: 'text',
label: 'textB',
autoWidth: false
}).appendTo(sandbox);
helpers.addDivider();
textC = Field2({
type: 'text',
label: 'textC',
mask: {
pattern: 'NUMBER',
suffix: '%'
}
}).appendTo(sandbox);
textD = Field2({
type: 'text',
label: 'textD',
mask: {
pattern: 'DATE',
suffix: '%'
}
}).appendTo(sandbox);
choice = Field2({
type: 'choice',
choices: ['Apple', 'Banana', 'Orange']
}).appendTo(sandbox);
expect(textA.el.style('fontFamily')).to.equal(Field.Field.prototype.globalDefaults.fontFamily);
expect(textB.el.style('fontFamily')).to.equal('helvetica');
expect(textA.el.style('verticalAlign')).to.equal('top');
expect(textB.el.style('verticalAlign')).to.equal('middle');
expect(textA.el.styleParsed('marginBottom')).to.equal(0);
expect(textB.el.styleParsed('marginBottom')).to.equal(10);
expect(textA.el.styleSafe('width', true)).to.equal('100%');
expect(textB.el.styleSafe('width', true)).to.equal('50%');
expect(textA.el.child.label.styleParsed('fontWeight', true)).to.equal(600);
expect(textB.el.child.label.styleParsed('fontWeight', true)).to.equal(700);
expect(textA.el.height).to.equal(Field.Field.text.prototype.defaults.height);
expect(textB.el.height).to.equal(40);
expect(textA.el.child.checkmark).to.be.object();
expect(textB.el.child.checkmark).not.to.be.object();
expect(helpers.getBorderSides(textA.els.innerwrap)).to.eql({
top: '1px',
left: '1px',
right: '1px',
bottom: '1px'
});
expect(helpers.getBorderSides(textB.els.innerwrap)).to.eql({
top: '0px',
left: '0px',
right: '0px',
bottom: '2px'
});
expect(textA.validate()).to.equal(true);
expect(textB.validate()).to.equal(false);
helpers.simulateKeys(textA.el.child.input.raw, 'abc');
helpers.simulateKeys(textB.el.child.input.raw, 'abc');
expect(textA.validate()).to.equal(true);
expect(textB.validate()).to.equal(true);
helpers.simulateKeys(textD.el.child.input.raw, '1');
expect(textD.value).to.equal('1*/**/****');
DOM.batch([textA.els.label, textB.els.label, textA.els.innerwrap, textB.els.innerwrap]).style('transition', null);
textA.state.focused = textB.state.focused = true;
expect(textA.el.child.label.raw).to.have.style('color', COLORS.orange);
expect(textB.el.child.label.raw).to.have.style('color', COLORS.green);
expect(textA.el.child.innerwrap.raw).to.have.style('borderColor', COLORS.orange);
expect(textB.el.child.innerwrap.raw).to.have.style('borderColor', COLORS.green);
textA.blur();
textB.blur();
choice.value = 'Banana';
expect(choice.valueRaw.label).to.equal('Banana');
return expect(choice.valueRaw.el.raw).to.have.style('color', COLORS.green);
});
});
});
return module.exports;
},
1: function (require, module, exports) {
exports.companyNames = require(21);
exports.simulateKeys = require(22);
exports.simulateAction = require(23);
exports.restartSandbox = require(24);
exports.addTitle = require(25);
exports.addDivider = require(26);
exports.getBorderSides = require(27);
return module.exports;
},
2: function (require, module, exports) {
'use strict';
const pTimeout = require(28);
module.exports = (emitter, event, opts) => {
let cancel;
const ret = new Promise((resolve, reject) => {
if (typeof opts === 'function') {
opts = {
filter: opts
};
}
opts = Object.assign({
rejectionEvents: ['error'],
multiArgs: false
}, opts);
let addListener = emitter.on || emitter.addListener || emitter.addEventListener;
let removeListener = emitter.off || emitter.removeListener || emitter.removeEventListener;
if (!addListener || !removeListener) {
throw new TypeError('Emitter is not compatible');
}
addListener = addListener.bind(emitter);
removeListener = removeListener.bind(emitter);
const resolveHandler = function (value) {
if (opts.multiArgs) {
value = [].slice.apply(arguments);
}
if (opts.filter && !opts.filter(value)) {
return;
}
cancel();
resolve(value);
};
const rejectHandler = function (reason) {
cancel();
if (opts.multiArgs) {
reject([].slice.apply(arguments));
} else {
reject(reason);
}
};
cancel = () => {
removeListener(event, resolveHandler);
for (const rejectionEvent of opts.rejectionEvents) {
removeListener(rejectionEvent, rejectHandler);
}
};
addListener(event, resolveHandler);
for (const rejectionEvent of opts.rejectionEvents) {
addListener(rejectionEvent, rejectHandler);
}
});
ret.cancel = cancel;
if (typeof opts.timeout === 'number') {
return pTimeout(ret, opts.timeout);
}
return ret;
};
return module.exports;
},
3: function (require, module, exports) {
var exports, extend, modifiers, newBuilder, normalizeKeys;
extend = require(29);
normalizeKeys = function (keys) {
var i, key, len, output;
if (keys) {
output = {};
if (typeof keys !== 'object') {
output[keys] = true;
} else {
if (!Array.isArray(keys)) {
keys = Object.keys(keys);
}
for ((i = 0, len = keys.length); i < len; i++) {
key = keys[i];
output[key] = true;
}
}
return output;
}
};
newBuilder = function (isBase) {
var builder;
builder = function (target) {
var theTarget;
var $_len = arguments.length, $_i = -1, sources = new Array($_len);
while (++$_i < $_len) sources[$_i] = arguments[$_i];
if (builder.options.target) {
theTarget = builder.options.target;
} else {
theTarget = target;
sources.shift();
}
return extend(builder.options, theTarget, sources);
};
if (isBase) {
builder.isBase = true;
}
builder.options = {};
Object.defineProperties(builder, modifiers);
return builder;
};
modifiers = {
'deep': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.deep = true;
return _;
}
},
'own': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.own = true;
return _;
}
},
'allowNull': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.allowNull = true;
return _;
}
},
'nullDeletes': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.nullDeletes = true;
return _;
}
},
'concat': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.concat = true;
return _;
}
},
'clone': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.target = {};
return _;
}
},
'notDeep': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (keys) {
_.options.notDeep = normalizeKeys(keys);
return _;
};
}
},
'deepOnly': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (keys) {
_.options.deepOnly = normalizeKeys(keys);
return _;
};
}
},
'keys': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (keys) {
_.options.keys = normalizeKeys(keys);
return _;
};
}
},
'notKeys': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (keys) {
_.options.notKeys = normalizeKeys(keys);
return _;
};
}
},
'transform': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (transform) {
if (typeof transform === 'function') {
_.options.globalTransform = transform;
} else if (transform && typeof transform === 'object') {
_.options.transforms = transform;
}
return _;
};
}
},
'filter': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (filter) {
if (typeof filter === 'function') {
_.options.globalFilter = filter;
} else if (filter && typeof filter === 'object') {
_.options.filters = filter;
}
return _;
};
}
}
};
module.exports = exports = newBuilder(true);
exports.version = "1.7.3";
return module.exports;
},
4: function (require, module, exports) {
var QuickDom;
var CSS = require(31);
var extend = require(3);
var allowedOptions, allowedTemplateOptions;

allowedTemplateOptions = ['id', 'name', 'type', 'href', 'selected', 'checked', 'className']; // To copy from DOM Elements

allowedOptions = ['id', 'ref', 'type', 'name', 'text', 'style', 'class', 'className', 'url', 'href', 'selected', 'checked', 'props', 'attrs', 'passStateToChildren', 'stateTriggers']; // Used in QuickElement::toJSON

// 'relatedInstance'

;
var helpers, styleCache;

helpers = {};

helpers.includes = function(target, item) {
  return target && target.indexOf(item) !== -1;
};

helpers.removeItem = function(target, item) {
  var itemIndex;
  itemIndex = target.indexOf(item);
  if (itemIndex !== -1) {
    target.splice(itemIndex, 1);
  }
  return target;
};

helpers.normalizeGivenEl = function(targetEl) {
  switch (false) {
    case !IS.string(targetEl):
      return QuickDom.text(targetEl);
    case !IS.domNode(targetEl):
      return QuickDom(targetEl);
    case !IS.template(targetEl):
      return targetEl.spawn();
    default:
      return targetEl;
  }
};

helpers.isStateStyle = function(string) {
  return string[0] === '$' || string[0] === '@';
};

helpers.registerStyle = function(rule, level, important) {
  var cached, i, len, output, prop, props;
  level || (level = 0);
  cached = styleCache.get(rule, level);
  if (cached) {
    return cached;
  }
  output = {
    className: [CSS.register(rule, level, important)],
    fns: [],
    rule
  };
  props = Object.keys(rule);
  for (i = 0, len = props.length; i < len; i++) {
    prop = props[i];
    if (typeof rule[prop] === 'function') {
      output.fns.push([prop, rule[prop]]);
    }
  }
  return styleCache.set(rule, output, level);
};

styleCache = new class {
  constructor() {
    this.keys = Object.create(null);
    this.values = Object.create(null);
  }

  get(key, level) {
    var index;
    if (this.keys[level]) {
      index = this.keys[level].indexOf(key);
      if (index !== -1) {
        return this.values[level][index];
      }
    }
  }

  set(key, value, level) {
    if (!this.keys[level]) {
      this.keys[level] = [];
      this.values[level] = [];
    }
    this.keys[level].push(key);
    this.values[level].push(value);
    return value;
  }

};

;
var IS;
IS = require(79);
IS = IS.create('natives', 'dom');
IS.load({
quickDomEl: function (subject) {
return subject && subject.constructor.name === QuickElement.name;
},
template: function (subject) {
return subject && subject.constructor.name === QuickTemplate.name;
}
});
;
var QuickElement, svgNamespace;
svgNamespace = 'http://www.w3.org/2000/svg';
QuickElement = (function () {
class QuickElement {
constructor(type, options) {
this.type = type;
this.options = options;
QuickElement.count++;
if (this.type[0] === '*') {
this.svg = true;
}
this.el = this.options.existing || (this.type === 'text' ? document.createTextNode(typeof this.options.text === 'string' ? this.options.text : '') : this.svg ? document.createElementNS(svgNamespace, this.type.slice(1)) : document.createElement(this.type));
if (this.type === 'text') {
this.append = this.prepend = this.attr = function () {};
}
this._parent = null;
this._styles = {};
this._state = [];
this._children = [];
this._normalizeOptions();
this._applyOptions();
this._attachStateEvents();
this._proxyParent();
if (this.options.existing) {
this._refreshParent();
}
this.el._quickElement = this;
}
toJSON() {
var child, children, i, len, output;
output = [this.type, extend.clone.keys(allowedOptions)(this.options)];
children = this.children;
for ((i = 0, len = children.length); i < len; i++) {
child = children[i];
output.push(child.toJSON());
}
return output;
}
}
;
QuickElement.count = 0;
return QuickElement;
}).call(this);
if (QuickElement.name == null) {
QuickElement.name = 'QuickElement';
}
Object.defineProperties(QuickElement.prototype, {
  'raw': {
    get: function() {
      return this.el;
    }
  },
  '0': {
    get: function() {
      return this.el;
    }
  },
  'css': {
    get: function() {
      return this.style;
    }
  },
  'replaceWith': {
    get: function() {
      return this.replace;
    }
  },
  'removeListener': {
    get: function() {
      return this.off;
    }
  }
});

;
var _filterElements, _getChildRefs, _getIndexByProp, _getParents;

QuickElement.prototype.parentsUntil = function(filter) {
  return _getParents(this, filter);
};

QuickElement.prototype.parentMatching = function(filter) {
  var isRef, nextParent;
  if (IS.function(filter) || (isRef = IS.string(filter))) {
    nextParent = this.parent;
    while (nextParent) {
      if (isRef) {
        if (nextParent.ref === filter) {
          return nextParent;
        }
      } else {
        if (filter(nextParent)) {
          return nextParent;
        }
      }
      nextParent = nextParent.parent;
    }
  }
};

QuickElement.prototype.query = function(selector) {
  return QuickDom(this.raw.querySelector(selector));
};

QuickElement.prototype.queryAll = function(selector) {
  var i, item, len, output, result;
  result = this.raw.querySelectorAll(selector);
  output = [];
  for (i = 0, len = result.length; i < len; i++) {
    item = result[i];
    output.push(item);
  }
  return new QuickBatch(output);
};

Object.defineProperties(QuickElement.prototype, {
  'children': {
    get: function() {
      var child, i, len, ref1;
      if (this.el.childNodes.length !== this._children.length) { // Re-collect children	
        this._children.length = 0; // Empty out children array
        ref1 = this.el.childNodes;
        for (i = 0, len = ref1.length; i < len; i++) {
          child = ref1[i];
          if (child.nodeType < 4) {
            this._children.push(QuickDom(child));
          }
        }
      }
      return this._children;
    }
  },
  'elementChildren': {
    get: function() {
      return _filterElements(this.children);
    }
  },
  'parent': {
    get: function() {
      if ((!this._parent || this._parent.el !== this.el.parentNode) && !IS.domDoc(this.el.parentNode)) {
        this._parent = QuickDom(this.el.parentNode);
      }
      return this._parent;
    }
  },
  'parents': {
    get: function() {
      return _getParents(this);
    }
  },
  'next': {
    get: function() {
      return QuickDom(this.el.nextSibling);
    }
  },
  'nextEl': {
    get: function() {
      return QuickDom(this.el.nextElementSibling);
    }
  },
  'nextElAll': {
    get: function() {
      return _filterElements(this.nextAll);
    }
  },
  'nextAll': {
    get: function() {
      var nextSibling, siblings;
      siblings = [];
      nextSibling = QuickDom(this.el.nextSibling);
      while (nextSibling) {
        siblings.push(nextSibling);
        nextSibling = nextSibling.next;
      }
      return siblings;
    }
  },
  'prev': {
    get: function() {
      return QuickDom(this.el.previousSibling);
    }
  },
  'prevEl': {
    get: function() {
      return QuickDom(this.el.previousElementSibling);
    }
  },
  'prevElAll': {
    get: function() {
      return _filterElements(this.prevAll);
    }
  },
  'prevAll': {
    get: function() {
      var prevSibling, siblings;
      siblings = [];
      prevSibling = QuickDom(this.el.previousSibling);
      while (prevSibling) {
        siblings.push(prevSibling);
        prevSibling = prevSibling.prev;
      }
      return siblings;
    }
  },
  'siblings': {
    get: function() {
      return this.prevAll.reverse().concat(this.nextAll);
    }
  },
  'elementSiblings': {
    get: function() {
      return _filterElements(this.siblings);
    }
  },
  'child': {
    get: function() {
      return this._childRefs || _getChildRefs(this);
    }
  },
  'childf': {
    get: function() {
      return _getChildRefs(this, true);
    }
  },
  'firstChild': {
    get: function() {
      return this.children[0];
    }
  },
  'lastChild': {
    get: function() {
      var children;
      children = this.children;
      return children[children.length - 1];
    }
  },
  'index': {
    get: function() {
      var parent;
      if (!(parent = this.parent)) {
        return null;
      } else {
        return parent.children.indexOf(this);
      }
    }
  },
  'indexType': {
    get: function() {
      return _getIndexByProp(this, 'type');
    }
  },
  'indexRef': {
    get: function() {
      return _getIndexByProp(this, 'ref');
    }
  }
});

_getParents = function(targetEl, filter) {
  var isRef, nextParent, parents;
  if (!IS.function(filter) && !(isRef = IS.string(filter))) {
    filter = void 0;
  }
  parents = [];
  nextParent = targetEl.parent;
  while (nextParent) {
    parents.push(nextParent);
    nextParent = nextParent.parent;
    if (isRef) {
      if (nextParent && nextParent.ref === filter) {
        nextParent = null;
      }
    } else if (filter) {
      if (filter(nextParent)) {
        nextParent = null;
      }
    }
  }
  return parents;
};

_getChildRefs = function(target, freshCopy) {
  var child, childRefs, children, el, i, len, ref, refs;
  if (freshCopy || !target._childRefs) {
    target._childRefs = {};
  }
  refs = target._childRefs;
  if (target.ref) {
    refs[target.ref] = target;
  }
  children = target.children;
  if (children.length) {
    for (i = 0, len = children.length; i < len; i++) {
      child = children[i];
      childRefs = _getChildRefs(child, freshCopy);
      for (ref in childRefs) {
        el = childRefs[ref];
        refs[ref] || (refs[ref] = el);
      }
    }
  }
  return refs;
};

_getIndexByProp = function(main, prop) {
  var parent;
  if (!(parent = main.parent)) {
    return null;
  } else {
    return parent.children.filter(function(child) {
      return child[prop] === main[prop];
    }).indexOf(main);
  }
};

_filterElements = function(array) {
  var i, item, len, output;
  if (!array.length) {
    return array;
  } else {
    output = [];
    for (i = 0, len = array.length; i < len; i++) {
      item = array[i];
      if (item.type !== 'text') {
        output.push(item);
      }
    }
    return output;
  }
};

;
var CACHED_FN_INSERTED, baseStateTriggers;
baseStateTriggers = {
'hover': {
on: 'mouseenter',
off: 'mouseleave',
bubbles: true
},
'focus': {
on: 'focus',
off: 'blur',
bubbles: true
}
};
QuickElement.prototype._normalizeOptions = function () {
var base1, base2, base3, base4, base5;
if (this.options.relatedInstance) {
(base1 = this.options).related || (base1.related = this.options.relatedInstance);
this.options.relatedInstance = null;
}
this.related = (base2 = this.options).related != null ? base2.related : base2.related = this;
if (this.options.class) {
this.options.className = this.options.class;
}
if (this.options.url) {
this.options.href = this.options.url;
}
if ((base3 = this.options).unpassableStates == null) {
base3.unpassableStates = [];
}
if ((base4 = this.options).passStateToChildren == null) {
base4.passStateToChildren = true;
}
if ((base5 = this.options).passDataToChildren == null) {
base5.passDataToChildren = true;
}
this.options.stateTriggers = this.options.stateTriggers ? extend.clone.deep(baseStateTriggers, this.options.stateTriggers) : baseStateTriggers;
if (this.type === 'text') {
extend(this, this._parseTexts(this.options.text, this._texts));
} else {
extend(this, this._parseStyles(this.options.style, this._styles));
}
};
QuickElement.prototype._parseStyles = function (styles, store) {
var _mediaStates, _providedStates, _providedStatesShared, _stateShared, _styles, base, flattenNestedStates, forceStyle, i, keys, len, specialStates, state, stateStyles, state_, states;
if (!IS.objectPlain(styles)) {
return;
}
keys = Object.keys(styles);
states = keys.filter(function (key) {
return helpers.isStateStyle(key);
});
specialStates = helpers.removeItem(states.slice(), '$base');
_mediaStates = states.filter(function (key) {
return key[0] === '@';
}).map(function (state) {
return state.slice(1);
});
_providedStates = states.map(function (state) {
return state.slice(1);
});
_styles = store || ({});
_stateShared = _providedStatesShared = void 0;
base = !helpers.includes(states, '$base') ? styles : styles.$base;
_styles.base = helpers.registerStyle(base, 0, forceStyle = this.options.forceStyle);
if (specialStates.length) {
flattenNestedStates = function (styleObject, chain, level) {
var hasNonStateProps, i, len, output, state, stateChain, state_, styleKeys;
styleKeys = Object.keys(styleObject);
output = {};
hasNonStateProps = false;
for ((i = 0, len = styleKeys.length); i < len; i++) {
state = styleKeys[i];
if (!helpers.isStateStyle(state)) {
hasNonStateProps = true;
output[state] = styleObject[state];
} else {
chain.push(state_ = state.slice(1));
stateChain = new (require(121))(chain);
if (_stateShared == null) {
_stateShared = [];
}
if (_providedStatesShared == null) {
_providedStatesShared = [];
}
_providedStatesShared.push(stateChain);
if (state[0] === '@') {
_mediaStates.push(state_);
}
_styles[stateChain.string] = helpers.registerStyle(flattenNestedStates(styleObject[state], chain, level + 1), level + 1, forceStyle);
}
}
if (hasNonStateProps) {
return output;
}
};
for ((i = 0, len = specialStates.length); i < len; i++) {
state = specialStates[i];
state_ = state.slice(1);
stateStyles = flattenNestedStates(styles[state], [state_], 1);
if (stateStyles) {
_styles[state_] = helpers.registerStyle(stateStyles, 1);
}
}
}
return {
_styles,
_mediaStates,
_stateShared,
_providedStates,
_providedStatesShared
};
};
QuickElement.prototype._parseTexts = function (texts, store) {
var _providedStates, _texts, i, len, state, states;
if (!IS.objectPlain(texts)) {
return;
}
states = Object.keys(texts).map(function (state) {
return state.slice(1);
});
_providedStates = states.filter(function (state) {
return state !== 'base';
});
_texts = store || ({});
_texts = {
base: ''
};
for ((i = 0, len = states.length); i < len; i++) {
state = states[i];
_texts[state] = texts['$' + state];
}
return {
_texts,
_providedStates
};
};
QuickElement.prototype._applyOptions = function () {
var event, handler, method, ref, ref1, ref2, value;
if (ref = this.options.id || this.options.ref) {
this.attr('data-ref', this.ref = ref);
}
if (this.options.id) {
this.el.id = this.options.id;
}
if (this.options.className) {
this.el.className = this.options.className;
}
if (this.options.src) {
this.el.src = this.options.src;
}
if (this.options.href) {
this.el.href = this.options.href;
}
if (this.options.type) {
this.el.type = this.options.type;
}
if (this.options.name) {
this.el.name = this.options.name;
}
if (this.options.value) {
this.el.value = this.options.value;
}
if (this.options.selected) {
this.el.selected = this.options.selected;
}
if (this.options.checked) {
this.el.checked = this.options.checked;
}
if (this.options.props) {
this.prop(this.options.props);
}
if (this.options.attrs) {
this.attr(this.options.attrs);
}
this._applyRegisteredStyle(this._styles.base, null, null, this.options.styleAfterInsert);
if (this._texts) {
this.text = this._texts.base;
}
this.on('inserted', CACHED_FN_INSERTED, false, true);
if (this.options.invokeComputersOnce) {
this._invokedComputers = {};
}
if (this.options.recalcOnResize) {
window.addEventListener('resize', () => {
return this.recalcStyle();
});
}
if (this.options.events) {
ref1 = this.options.events;
for (event in ref1) {
handler = ref1[event];
this.on(event, handler);
}
}
if (this.options.methods) {
ref2 = this.options.methods;
for (method in ref2) {
value = ref2[method];
if (!this[method]) {
if (IS.function(value)) {
this[method] = value;
} else if (IS.object(value)) {
Object.defineProperty(this, method, {
configurable: true,
get: value.get,
set: value.set
});
}
}
}
}
if (this.type !== 'text' && IS.object(this.options.text)) {
this.append(QuickDom('text', {
text: this.options.text
}));
}
};
QuickElement.prototype._postCreation = function (data) {
if (this.options.computers) {
if (data && this.options.data) {
data = extend.clone(this.options.data, data);
}
data || (data = this.options.data);
this.applyData(data, false);
if (this.options.computers._init) {
this._runComputer('_init', data);
}
}
if (this.options.state) {
this.state(this.options.state);
}
};
QuickElement.prototype._attachStateEvents = function (force) {
var states;
states = Object.keys(this.options.stateTriggers);
states.forEach(state => {
var disabler, enabler, trigger;
trigger = this.options.stateTriggers[state];
if (!helpers.includes(this._providedStates, state) && !force && !trigger.force) {
return;
}
enabler = IS.string(trigger) ? trigger : trigger.on;
if (IS.object(trigger)) {
disabler = trigger.off;
}
this._listenTo(enabler, () => {
return this.state(state, true, trigger.bubbles);
});
if (disabler) {
return this._listenTo(disabler, () => {
return this.state(state, false, trigger.bubbles);
});
}
});
};
QuickElement.prototype._proxyParent = function () {
var parent;
parent = void 0;
return Object.defineProperty(this, '_parent', {
get: function () {
return parent;
},
set: function (newParent) {
var lastParent;
if (parent = newParent) {
lastParent = this.parents.slice(-1)[0];
if (lastParent.raw === document.documentElement) {
this._unproxyParent(newParent);
} else {
parent.on('inserted', () => {
if (parent === newParent) {
return this._unproxyParent(newParent);
}
});
}
}
}
});
};
QuickElement.prototype._unproxyParent = function (newParent) {
delete this._parent;
this._parent = newParent;
this.emitPrivate('inserted', newParent);
};
CACHED_FN_INSERTED = function () {
var i, len, mediaStates, queryString, results;
this._inserted = this;
if (this.options.styleAfterInsert) {
this.recalcStyle();
}
if ((mediaStates = this._mediaStates) && this._mediaStates.length) {
this._mediaStates = Object.create(null);
results = [];
for ((i = 0, len = mediaStates.length); i < len; i++) {
queryString = mediaStates[i];
results.push(this._mediaStates[queryString] = MediaQuery.register(this, queryString));
}
return results;
}
};
;
var regexWhitespace;

regexWhitespace = /\s+/;

QuickElement.prototype.on = function(eventNames, callback, useCapture, isPrivate) {
  var callbackRef, split;
  if (this._eventCallbacks == null) {
    this._eventCallbacks = {
      __refs: {}
    };
  }
  if (IS.string(eventNames) && IS.function(callback)) {
    split = eventNames.split('.');
    callbackRef = split[1];
    eventNames = split[0];
    if (eventNames === 'inserted' && this._inserted) {
      callback.call(this, this._parent);
      return this;
    }
    eventNames.split(regexWhitespace).forEach((eventName) => {
      if (!this._eventCallbacks[eventName]) {
        this._eventCallbacks[eventName] = [];
        if (!isPrivate) {
          this._listenTo(eventName, (event) => {
            return this._invokeHandlers(eventName, event);
          }, useCapture);
        }
      }
      if (callbackRef) {
        this._eventCallbacks.__refs[callbackRef] = callback;
      }
      return this._eventCallbacks[eventName].push(callback);
    });
  }
  return this;
};

QuickElement.prototype.once = function(eventNames, callback) {
  var onceCallback;
  if (IS.string(eventNames) && IS.function(callback)) {
    this.on(eventNames, onceCallback = (event) => {
      this.off(eventNames, onceCallback);
      return callback.call(this, event);
    });
  }
  return this;
};

QuickElement.prototype.off = function(eventNames, callback) {
  var callbackRef, eventName, split;
  if (this._eventCallbacks == null) {
    this._eventCallbacks = {
      __refs: {}
    };
  }
  if (!IS.string(eventNames)) {
    for (eventName in this._eventCallbacks) {
      this.off(eventName);
    }
  } else {
    split = eventNames.split('.');
    callbackRef = split[1];
    eventNames = split[0];
    eventNames.split(regexWhitespace).forEach((eventName) => {
      if (this._eventCallbacks[eventName]) {
        if (callback == null) {
          callback = this._eventCallbacks.__refs[callbackRef];
        }
        if (IS.function(callback)) {
          return helpers.removeItem(this._eventCallbacks[eventName], callback);
        } else if (!callbackRef) {
          return this._eventCallbacks[eventName].length = 0;
        }
      }
    });
  }
  return this;
};

QuickElement.prototype.emit = function(eventName, bubbles = true, cancelable = true, data) {
  var event;
  if (eventName && IS.string(eventName)) {
    event = document.createEvent('Event');
    event.initEvent(eventName, bubbles, cancelable);
    if (data && typeof data === 'object') {
      extend(event, data);
    }
    this.el.dispatchEvent(event);
  }
  return this;
};

QuickElement.prototype.emitPrivate = function(eventName, arg) {
  var ref;
  if (eventName && IS.string(eventName) && ((ref = this._eventCallbacks) != null ? ref[eventName] : void 0)) {
    this._invokeHandlers(eventName, arg);
  }
  return this;
};

QuickElement.prototype._invokeHandlers = function(eventName, arg) {
  var callbacks, cb, i, len;
  callbacks = this._eventCallbacks[eventName].slice();
  for (i = 0, len = callbacks.length; i < len; i++) {
    cb = callbacks[i];
    cb.call(this, arg);
  }
};

/* istanbul ignore next */
QuickElement.prototype._listenTo = function(eventName, callback, useCapture) {
  var eventNameToListenFor, listenMethod;
  listenMethod = this.el.addEventListener ? 'addEventListener' : 'attachEvent';
  eventNameToListenFor = this.el.addEventListener ? eventName : `on${eventName}`;
  this.el[listenMethod](eventNameToListenFor, callback, useCapture);
  return this;
};

;
var DUMMY_ARRAY;

DUMMY_ARRAY = [];

QuickElement.prototype.state = function(targetState, value, bubbles, source) {
  var activeStates, child, desiredValue, i, j, key, keys, len, prop, ref, toggle;
  if (arguments.length === 0) {
    return this._state.slice();
  }
  if (arguments.length === 1) {
    if (IS.string(targetState)) {
      return helpers.includes(this._state, targetState);
    } else if (IS.object(targetState)) {
      keys = Object.keys(targetState);
      i = -1;
      while (key = keys[++i]) {
        this.state(key, targetState[key]);
      }
      return this;
    }
  } else if (this._statePipeTarget && source !== this) {
    this._statePipeTarget.state(targetState, value, bubbles, this);
    return this;
  } else if (IS.string(targetState)) {
    if (targetState[0] === '$') {
      targetState = targetState.slice(1);
    }
    if (targetState === 'base') {
      return this;
    }
    desiredValue = !!value; // Convert the value to a boolean
    activeStates = this._getActiveStates(targetState, false);
    
    // ==== Toggle styles for this state =================================================================================
    if (this.state(targetState) !== desiredValue) {
      prop = this.type === 'text' ? 'Text' : 'Style';
      if (desiredValue) { //is on
        this._state.push(targetState);
        toggle = 'ON';
      } else {
        helpers.removeItem(this._state, targetState);
        toggle = 'OFF';
      }
      this['_turn' + prop + toggle](targetState, activeStates);
      this.emitPrivate(`stateChange:${targetState}`, desiredValue);
    }
    // ==== Pass state to parent/children =================================================================================
    if (!helpers.includes(this.options.unpassableStates, targetState)) {
      if (bubbles) {
        if (this.parent) {
          this._parent.state(targetState, value, true, source || this);
        }
      } else if (this.options.passStateToChildren) {
        ref = this._children;
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          child.state(targetState, value, false, source || this);
        }
      }
    }
    return this;
  }
};

QuickElement.prototype.toggleState = function(targetState) {
  return this.state(targetState, !this.state(targetState));
};

QuickElement.prototype.resetState = function() {
  var activeState, j, len, ref;
  ref = this._state.slice();
  for (j = 0, len = ref.length; j < len; j++) {
    activeState = ref[j];
    this.state(activeState, false);
  }
  return this;
};

QuickElement.prototype.pipeState = function(targetEl) {
  var activeState, j, len, ref;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl) && targetEl !== this) {
      this._statePipeTarget = targetEl;
      ref = this._state;
      for (j = 0, len = ref.length; j < len; j++) {
        activeState = ref[j];
        targetEl.state(activeState, true);
      }
    }
  } else if (targetEl === false) {
    delete this._statePipeTarget;
  }
  return this;
};

QuickElement.prototype._applyRegisteredStyle = function(targetStyle, superiorStates, includeBase, skipFns) {
  var className, entry, j, k, len, len1, ref, ref1, superiorStyles;
  if (targetStyle) {
    ref = targetStyle.className;
    for (j = 0, len = ref.length; j < len; j++) {
      className = ref[j];
      this.addClass(className);
    }
    if (targetStyle.fns.length && !skipFns) {
      if (superiorStates) {
        superiorStyles = this._resolveFnStyles(superiorStates, includeBase);
      }
      ref1 = targetStyle.fns;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        entry = ref1[k];
        if (!(superiorStyles && superiorStyles[entry[0]])) {
          this.style(entry[0], entry[1]);
        }
      }
    }
  }
};

QuickElement.prototype._removeRegisteredStyle = function(targetStyle, superiorStates, includeBase) {
  var className, entry, j, k, len, len1, ref, ref1, resetValue, superiorStyles;
  ref = targetStyle.className;
  for (j = 0, len = ref.length; j < len; j++) {
    className = ref[j];
    this.removeClass(className);
  }
  if (targetStyle.fns.length) {
    if (superiorStates) {
      superiorStyles = this._resolveFnStyles(superiorStates, includeBase);
    }
    ref1 = targetStyle.fns;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      entry = ref1[k];
      resetValue = superiorStyles && superiorStyles[entry[0]] || null;
      this.style(entry[0], resetValue);
    }
  }
};

QuickElement.prototype._turnStyleON = function(targetState, activeStates) {
  var j, len, sharedStates, skipFns, stateChain;
  skipFns = this.options.styleAfterInsert && !this._inserted;
  if (this._styles[targetState]) {
    this._applyRegisteredStyle(this._styles[targetState], this._getSuperiorStates(targetState, activeStates), false, skipFns);
  }
  if (this._providedStatesShared) {
    sharedStates = this._getSharedStates(targetState);
    for (j = 0, len = sharedStates.length; j < len; j++) {
      stateChain = sharedStates[j];
      if (!helpers.includes(this._stateShared, stateChain.string)) {
        this._stateShared.push(stateChain.string);
      }
      this._applyRegisteredStyle(this._styles[stateChain.string], null, null, skipFns);
    }
  }
};

QuickElement.prototype._turnStyleOFF = function(targetState, activeStates) {
  var activeSharedStates, j, len, sharedStates, stateChain, targetStyle;
  if (this._styles[targetState]) {
    this._removeRegisteredStyle(this._styles[targetState], activeStates, true);
  }
  if (this._providedStatesShared) {
    sharedStates = this._getSharedStates(targetState);
    if (sharedStates.length === 0) {
      return;
    }
    for (j = 0, len = sharedStates.length; j < len; j++) {
      stateChain = sharedStates[j];
      helpers.removeItem(this._stateShared, stateChain.string);
      targetStyle = this._styles[stateChain.string];
      if (targetStyle.fns.length && this._stateShared.length && !activeSharedStates) {
        activeSharedStates = this._stateShared.filter(function(state) {
          return !helpers.includes(state, targetState);
        });
        activeStates = activeStates.concat(activeSharedStates);
      }
      this._removeRegisteredStyle(targetStyle, activeStates, true);
    }
  }
};

QuickElement.prototype._turnTextON = function(targetState, activeStates) {
  var superiorStates, targetText;
  if (this._texts && IS.string(targetText = this._texts[targetState])) {
    superiorStates = this._getSuperiorStates(targetState, activeStates);
    if (!superiorStates.length) {
      this.text = targetText;
    }
  }
};

QuickElement.prototype._turnTextOFF = function(targetState, activeStates) {
  var targetText;
  if (this._texts && IS.string(targetText = this._texts[targetState])) {
    activeStates = activeStates.filter(function(state) {
      return state !== targetState;
    });
    targetText = this._texts[activeStates[activeStates.length - 1]];
    if (targetText == null) {
      targetText = this._texts.base;
    }
    this.text = targetText;
  }
};

QuickElement.prototype._getActiveStates = function(stateToExclude, includeSharedStates = true) {
  var activeStates, j, len, plainStates, state;
  if (!this._providedStates) {
    return DUMMY_ARRAY;
  }
  activeStates = plainStates = this._state;
  if (stateToExclude) {
    plainStates = [];
    for (j = 0, len = activeStates.length; j < len; j++) {
      state = activeStates[j];
      if (state !== stateToExclude) {
        plainStates.push(state);
      }
    }
  }
  if (!includeSharedStates || !this._providedStatesShared) {
    return plainStates;
  } else {
    return plainStates.concat(this._stateShared);
  }
};

QuickElement.prototype._getSuperiorStates = function(targetState, activeStates) {
  var candidate, j, len, superior, targetStateIndex;
  targetStateIndex = this._providedStates.indexOf(targetState);
  if (targetStateIndex === this._providedStates.length - 1) {
    return DUMMY_ARRAY;
  }
  superior = [];
  for (j = 0, len = activeStates.length; j < len; j++) {
    candidate = activeStates[j];
    if (this._providedStates.indexOf(candidate) > targetStateIndex) {
      superior.push(candidate);
    }
  }
  return superior;
};

QuickElement.prototype._getSharedStates = function(targetState) {
  var activeStates, j, len, ref, sharedStates, stateChain;
  activeStates = this._state;
  sharedStates = [];
  ref = this._providedStatesShared;
  for (j = 0, len = ref.length; j < len; j++) {
    stateChain = ref[j];
    if (stateChain.includes(targetState) && stateChain.isApplicable(targetState, activeStates)) {
      sharedStates.push(stateChain);
    }
  }
  return sharedStates;
};

QuickElement.prototype._resolveFnStyles = function(states, includeBase) {
  var entry, j, k, len, len1, output, ref, state;
  if (includeBase) {
    states = ['base'].concat(states);
  }
  output = {};
  for (j = 0, len = states.length; j < len; j++) {
    state = states[j];
    if (this._styles[state] && this._styles[state].fns.length) {
      ref = this._styles[state].fns;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        entry = ref[k];
        output[entry[0]] = entry[1];
      }
    }
  }
  return output;
};

;
/**
 * Sets/gets the value of a style property. In getter mode the computed property of
 * the style will be returned unless the element is not inserted into the DOM. In
 * webkit browsers all computed properties of a detached node are always an empty
 * string but in gecko they reflect on the actual computed value, hence we need
 * to "normalize" this behavior and make sure that even on gecko an empty string
 * is returned
 * @return {[type]} [description]
 */
var aspectRatioGetter, orientationGetter;

QuickElement.prototype.style = function(property) {
  var args, i, key, keys, result, value;
  if (this.type === 'text') {
    return;
  }
  args = arguments;
  if (IS.string(property)) {
    value = typeof args[1] === 'function' ? args[1].call(this, this.related) : args[1];
    if (args[1] === null && IS.defined(this.currentStateStyle(property)) && !IS.function(this.currentStateStyle(property))) {
      value = CSS.UNSET;
    }
    if (value && typeof value.then === 'function') {
      value.then((value) => {
        return CSS(this.el, property, value, this.options.forceStyle);
      });
    } else {
      result = CSS(this.el, property, value, this.options.forceStyle);
    }
    if (args.length === 1) {
      /* istanbul ignore next */
      if (this._inserted) {
        return result;
      } else if (!result) {
        return result;
      } else {
        return '';
      }
    }
  } else if (IS.object(property)) {
    keys = Object.keys(property);
    i = -1;
    while (key = keys[++i]) {
      this.style(key, property[key]);
    }
  }
  return this;
};

/**
* Attempts to resolve the value for a given property in the following order if each one isn't a valid value:
* 1. from computed style (for dom-inserted els)
* 2. from DOMElement.style object (for non-inserted els; if options.styleAfterInsert, will only have state styles)
* 3. from provided style options
* (for non-inserted els; checking only $base since state styles will always be applied to the style object even for non-inserted)
 */
QuickElement.prototype.styleSafe = function(property, skipComputed) {
  var computed, result, sample;
  if (this.type === 'text') {
    return;
  }
  sample = this.el.style[property];
  if (IS.string(sample) || IS.number(sample)) {
    computed = skipComputed ? 0 : this.style(property);
    result = computed || this.el.style[property] || this.currentStateStyle(property) || '';
    if (typeof result === 'function') {
      return result.call(this, this.related);
    } else {
      return result;
    }
  }
  return this;
};

QuickElement.prototype.styleParsed = function(property, skipComputed) {
  return parseFloat(this.styleSafe(property, skipComputed));
};

QuickElement.prototype.recalcStyle = function(recalcChildren) {
  var child, j, len, ref, targetStyles;
  targetStyles = this._resolveFnStyles(this._getActiveStates(), true);
  this.style(targetStyles);
  if (recalcChildren) {
    ref = this._children;
    for (j = 0, len = ref.length; j < len; j++) {
      child = ref[j];
      child.recalcStyle();
    }
  }
  return this;
};

QuickElement.prototype.currentStateStyle = function(property) {
  var i, state, states;
  if (property) {
    if (this._state.length) {
      states = this._state.slice();
      if (this._stateShared && this._stateShared.length) {
        states.push(...this._stateShared);
      }
      i = states.length;
      while (state = states[--i]) {
        if (this._styles[state] && IS.defined(this._styles[state].rule[property])) {
          return this._styles[state].rule[property];
        }
      }
    }
    if (this._styles.base) {
      return this._styles.base.rule[property];
    }
  }
};

QuickElement.prototype.hide = function() {
  return this.style('display', 'none');
};

QuickElement.prototype.show = function(display) {
  var ref;
  if (!display) {
    display = this.currentStateStyle('display');
    if (display === 'none' || !display) {
      display = 'block';
    }
  }
  if (display == null) {
    display = ((ref = this._styles.base) != null ? ref.display : void 0) || 'block';
  }
  return this.style('display', display);
};

Object.defineProperties(QuickElement.prototype, {
  'orientation': orientationGetter = {
    get: function() {
      if (this.width > this.height) {
        return 'landscape';
      } else {
        return 'portrait';
      }
    }
  },
  'aspectRatio': aspectRatioGetter = {
    get: function() {
      return this.width / this.height;
    }
  },
  'rect': {
    get: function() {
      return this.el.getBoundingClientRect();
    }
  },
  'width': {
    get: function() {
      return parseFloat(this.style('width'));
    },
    set: function(value) {
      return this.style('width', value);
    }
  },
  'height': {
    get: function() {
      return parseFloat(this.style('height'));
    },
    set: function(value) {
      return this.style('height', value);
    }
  }
});

;
QuickElement.prototype.attr = function(target, newValue) {
  var i, key, keys;
  if (arguments.length === 1) {
    if (typeof target === 'string') {
      return this.el.getAttribute(target);
    }
    if (IS.object(target)) {
      keys = Object.keys(target);
      i = -1;
      while (key = keys[++i]) {
        this.attr(key, target[key]);
      }
    }
  } else if (newValue === null) {
    return this.el.removeAttribute(target);
  } else {
    this.el.setAttribute(target, newValue);
  }
  return this;
};

QuickElement.prototype.prop = function(target, newValue) {
  var i, key, keys;
  if (arguments.length === 1) {
    if (typeof target === 'string') {
      return this.el[target];
    }
    if (IS.object(target)) {
      keys = Object.keys(target);
      i = -1;
      while (key = keys[++i]) {
        this.prop(key, target[key]);
      }
    }
  } else {
    this.el[target] = newValue;
  }
  return this;
};

;
QuickElement.prototype.toTemplate = function() {
  return QuickDom.template(this);
};

QuickElement.prototype.clone = function() {
  var activeState, callback, callbacks, child, elClone, eventName, i, j, k, len, len1, len2, newEl, options, ref, ref1, ref2;
  elClone = this.el.cloneNode(false);
  options = extend.clone(this.options, {
    existing: elClone
  });
  newEl = new QuickElement(this.type, options);
  ref = this._state;
  for (i = 0, len = ref.length; i < len; i++) {
    activeState = ref[i];
    newEl.state(activeState, true);
  }
  ref1 = this.children;
  for (j = 0, len1 = ref1.length; j < len1; j++) {
    child = ref1[j];
    newEl.append(child.clone());
  }
  ref2 = this._eventCallbacks;
  for (eventName in ref2) {
    callbacks = ref2[eventName];
    for (k = 0, len2 = callbacks.length; k < len2; k++) {
      callback = callbacks[k];
      newEl.on(eventName, callback);
    }
  }
  return newEl;
};

QuickElement.prototype.append = function(targetEl) {
  var prevParent;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      prevParent = targetEl.parent;
      if (prevParent) {
        prevParent._removeChild(targetEl);
      }
      this._children.push(targetEl);
      this.el.appendChild(targetEl.el);
      targetEl._refreshParent(); // Force re-fresh targetEl._parent value to trigger inserted callback
    }
  }
  return this;
};

QuickElement.prototype.appendTo = function(targetEl) {
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      targetEl.append(this);
    }
  }
  return this;
};

QuickElement.prototype.prepend = function(targetEl) {
  var prevParent;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      prevParent = targetEl.parent;
      if (prevParent) {
        prevParent._removeChild(targetEl);
      }
      this._children.unshift(targetEl);
      this.el.insertBefore(targetEl.el, this.el.firstChild);
      targetEl._refreshParent(); // Force re-fresh targetEl._parent value to trigger inserted callback
    }
  }
  return this;
};

QuickElement.prototype.prependTo = function(targetEl) {
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      targetEl.prepend(this);
    }
  }
  return this;
};

QuickElement.prototype.after = function(targetEl) {
  var myIndex;
  if (targetEl && this.parent) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      myIndex = this.parent._children.indexOf(this);
      this.parent._children.splice(myIndex + 1, 0, targetEl);
      this.el.parentNode.insertBefore(targetEl.el, this.el.nextSibling);
      targetEl._refreshParent(); // Force re-fresh targetEl._parent value to trigger inserted callback
    }
  }
  return this;
};

QuickElement.prototype.insertAfter = function(targetEl) {
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      targetEl.after(this);
    }
  }
  return this;
};

QuickElement.prototype.before = function(targetEl) {
  var myIndex;
  if (targetEl && this.parent) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      myIndex = this.parent._children.indexOf(this);
      this.parent._children.splice(myIndex, 0, targetEl);
      this.el.parentNode.insertBefore(targetEl.el, this.el);
      targetEl._refreshParent(); // Force re-fresh targetEl._parent value to trigger inserted callback
    }
  }
  return this;
};

QuickElement.prototype.insertBefore = function(targetEl) {
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      targetEl.before(this);
    }
  }
  return this;
};

QuickElement.prototype.detach = function() {
  var ref;
  if ((ref = this.parent) != null) {
    ref._removeChild(this);
  }
  return this;
};

QuickElement.prototype.remove = function() {
  var eventName;
  this.detach();
  this.resetState();
  if (this._eventCallbacks) {
    for (eventName in this._eventCallbacks) {
      this._eventCallbacks[eventName].length = 0;
    }
  }
  return this;
};

QuickElement.prototype.empty = function() {
  var child, i, len, ref;
  ref = this.children.slice();
  for (i = 0, len = ref.length; i < len; i++) {
    child = ref[i];
    this._removeChild(child);
  }
  return this;
};

QuickElement.prototype.wrap = function(targetEl) {
  var currentParent;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    currentParent = this.parent;
    if (IS.quickDomEl(targetEl) && targetEl !== this && targetEl !== this.parent) {
      if (currentParent) {
        currentParent._removeChild(this, !targetEl.parent ? targetEl : void 0);
      }
      targetEl.append(this);
    }
  }
  return this;
};

QuickElement.prototype.unwrap = function() {
  var grandParent, parent, parentChildren, parentSibling;
  parent = this.parent;
  if (parent) {
    parentChildren = QuickDom.batch(parent.children);
    parentSibling = parent.next;
    grandParent = parent.parent;
    if (grandParent) {
      parent.detach();
      if (parentSibling) {
        parentChildren.insertBefore(parentSibling);
      } else {
        parentChildren.appendTo(grandParent);
      }
    }
  }
  return this;
};

QuickElement.prototype.replace = function(targetEl) {
  var ref;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl) && targetEl !== this) {
      targetEl.detach();
      if ((ref = this.parent) != null) {
        ref._removeChild(this, targetEl);
      }
      targetEl._refreshParent(); // Force re-fresh targetEl._parent value to trigger inserted callback
    }
  }
  return this;
};

QuickElement.prototype.hasClass = function(target) {
  return helpers.includes(this.classList, target);
};

QuickElement.prototype.addClass = function(target) {
  var classList, targetIndex;
  classList = this.classList;
  targetIndex = classList.indexOf(target);
  if (targetIndex === -1) {
    classList.push(target);
    this.className = classList.length > 1 ? classList.join(' ') : classList[0];
  }
  return this;
};

QuickElement.prototype.removeClass = function(target) {
  var classList, targetIndex;
  classList = this.classList;
  targetIndex = classList.indexOf(target);
  if (targetIndex !== -1) {
    classList.splice(targetIndex, 1);
    this.className = classList.length ? classList.join(' ') : '';
  }
  return this;
};

QuickElement.prototype.toggleClass = function(target) {
  if (this.hasClass(target)) {
    this.removeClass(target);
  } else {
    this.addClass(target);
  }
  return this;
};

QuickElement.prototype.setRef = function(target) {
  this.ref = this.options.ref = target;
  this.attr('data-ref', target);
  return this;
};

QuickElement.prototype._refreshParent = function() {
  return this.parent;
};

QuickElement.prototype._removeChild = function(targetChild, replacementChild) {
  var indexOfChild;
  indexOfChild = this.children.indexOf(targetChild);
  if (indexOfChild !== -1) {
    if (replacementChild) {
      this.el.replaceChild(replacementChild.el, targetChild.el);
      this._children.splice(indexOfChild, 1, replacementChild);
    } else {
      this.el.removeChild(targetChild.el);
      this._children.splice(indexOfChild, 1);
    }
  }
  return this;
};

Object.defineProperties(QuickElement.prototype, {
  'html': {
    get: function() {
      return this.el.innerHTML;
    },
    set: function(newValue) {
      return this.el.innerHTML = newValue;
    }
  },
  'text': {
    get: function() {
      return this.el.textContent;
    },
    set: function(newValue) {
      return this.el.textContent = newValue;
    }
  },
  'className': {
    get: function() {
      if (this.svg) {
        return this.attr('class') || '';
      } else {
        return this.raw.className;
      }
    },
    set: function(newValue) {
      if (this.svg) {
        return this.attr('class', newValue);
      } else {
        return this.raw.className = newValue;
      }
    }
  },
  'classList': {
    get: function() {
      var list;
      list = this.className.split(/\s+/);
      if (list[list.length - 1] === '') {
        list.pop();
      }
      if (list[0] === '') {
        list.shift();
      }
      return list;
    }
  }
});

;
QuickElement.prototype.updateOptions = function(options) {
  if (IS.object(options)) {
    this.options = options;
    this._normalizeOptions();
    this._applyOptions(this.options);
  }
  return this;
};

QuickElement.prototype.updateStateStyles = function(styles) {
  var i, len, parsed, state, updatedStates;
  if (IS.objectPlain(styles)) {
    extend.deep.concat(this, parsed = this._parseStyles(styles));
    if (parsed._styles) {
      updatedStates = Object.keys(parsed._styles);
      for (i = 0, len = updatedStates.length; i < len; i++) {
        state = updatedStates[i];
        if (this.state(state) || state === 'base') {
          this._applyRegisteredStyle(this._styles[state], this._getActiveStates(state), false);
        }
      }
    }
  }
  return this;
};

QuickElement.prototype.updateStateTexts = function(texts) {
  var parsed;
  if (IS.objectPlain(texts)) {
    extend.deep.concat(this, parsed = this._parseTexts(texts));
  }
  return this;
};

QuickElement.prototype.applyData = function(data, passThrough) {
  var child, computers, defaults, i, j, key, keys, len, len1, ref;
  if (this.options.passDataToChildren && this._children.length && (passThrough != null ? passThrough : passThrough = true)) {
    ref = this._children;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      child.applyData(data);
    }
  }
  if (computers = this.options.computers) {
    defaults = this.options.defaults;
    keys = Object.keys(computers);
    for (j = 0, len1 = keys.length; j < len1; j++) {
      key = keys[j];
      if (this.options.invokeComputersOnce) {
        if (this._invokedComputers[key]) {
          continue;
        }
        this._invokedComputers[key] = 1;
      }
      if (data && data.hasOwnProperty(key)) {
        this._runComputer(key, data[key], data);
      } else if (defaults && defaults.hasOwnProperty(key)) {
        this._runComputer(key, defaults[key], data);
      }
    }
  }
  return this;
};

QuickElement.prototype._runComputer = function(computer, arg, data) {
  return this.options.computers[computer].call(this, arg, data);
};

;
;
var QuickWindow;

QuickWindow = {
  type: 'window',
  el: window,
  raw: window,
  _eventCallbacks: {
    __refs: {}
  }
};

QuickWindow.on = QuickElement.prototype.on;

QuickWindow.off = QuickElement.prototype.off;

QuickWindow.emit = QuickElement.prototype.emit;

QuickWindow.emitPrivate = QuickElement.prototype.emitPrivate;

QuickWindow._listenTo = QuickElement.prototype._listenTo;

QuickWindow._invokeHandlers = QuickElement.prototype._invokeHandlers;

Object.defineProperties(QuickWindow, {
  'width': {
    get: function() {
      return window.innerWidth;
    }
  },
  'height': {
    get: function() {
      return window.innerHeight;
    }
  },
  'orientation': orientationGetter,
  'aspectRatio': aspectRatioGetter
});

;
var MediaQuery, ruleDelimiter;

MediaQuery = new function() {
  var callbacks, testRule;
  callbacks = [];
  window.addEventListener('resize', function() {
    var callback, i, len;
    for (i = 0, len = callbacks.length; i < len; i++) {
      callback = callbacks[i];
      callback();
    }
  });
  this.parseQuery = function(target, queryString) {
    var querySplit, rules, source;
    querySplit = queryString.split('(');
    source = querySplit[0];
    source = (function() {
      switch (source) {
        case 'window':
          return QuickWindow;
        case 'parent':
          return target.parent;
        case 'self':
          return target;
        default:
          return target.parentMatching(function(parent) {
            return parent.ref === source.slice(1);
          });
      }
    })();
    rules = querySplit[1].slice(0, -1).split(ruleDelimiter).map(function(rule) {
      var getter, key, keyPrefix, max, min, split, value;
      split = rule.split(':');
      value = parseFloat(split[1]);
      if (isNaN(value)) {
        value = split[1];
      }
      key = split[0];
      keyPrefix = key.slice(0, 4);
      max = keyPrefix === 'max-';
      min = !max && keyPrefix === 'min-';
      if (max || min) {
        key = key.slice(4);
      }
      getter = (function() {
        switch (key) {
          case 'orientation':
            return function() {
              return source.orientation;
            };
          case 'aspect-ratio':
            return function() {
              return source.aspectRatio;
            };
          case 'width':
          case 'height':
            return function() {
              return source[key];
            };
          default:
            return function() {
              var parsedValue, stringValue;
              stringValue = source.style(key);
              parsedValue = parseFloat(stringValue);
              if (isNaN(parsedValue)) {
                return stringValue;
              } else {
                return parsedValue;
              }
            };
        }
      })();
      return {key, value, min, max, getter};
    });
    return {source, rules};
  };
  this.register = function(target, queryString) {
    var callback, query;
    query = this.parseQuery(target, queryString);
    if (query.source) {
      callbacks.push(callback = function() {
        return testRule(target, query, queryString);
      });
      callback();
    }
    return query;
  };
  testRule = function(target, query, queryString) {
    var currentValue, i, len, passed, ref, rule;
    passed = true;
    ref = query.rules;
    for (i = 0, len = ref.length; i < len; i++) {
      rule = ref[i];
      currentValue = rule.getter();
      passed = (function() {
        switch (false) {
          case !rule.min:
            return currentValue >= rule.value;
          case !rule.max:
            return currentValue <= rule.value;
          default:
            return currentValue === rule.value;
        }
      })();
      if (!passed) {
        break;
      }
    }
    return target.state(queryString, passed);
  };
  return this;
};

ruleDelimiter = /,\s*/;

;
QuickDom = function () {
var arg, args, element, i, j, len, prevCount;
args = new Array(arguments.length);
for ((i = j = 0, len = arguments.length); j < len; i = ++j) {
arg = arguments[i];
args[i] = arg;
}
prevCount = QuickElement.count;
element = QuickDom.create(args);
if (element && element._postCreation && QuickElement.count !== prevCount) {
element._postCreation();
}
return element;
};
QuickDom.create = function (args) {
var argsLength, child, children, element, i, j, len, options, type;
switch (false) {
case !IS.array(args[0]):
return QuickDom(...args[0]);
case !IS.template(args[0]):
return args[0].spawn();
case !IS.quickDomEl(args[0]):
if (args[1]) {
return args[0].updateOptions(args[1]);
} else {
return args[0];
}
case !(IS.domNode(args[0]) || IS.domDoc(args[0])):
if (args[0]._quickElement) {
return args[0]._quickElement;
}
type = args[0].nodeName.toLowerCase().replace('#', '');
options = args[1] || ({});
options.existing = args[0];
return new QuickElement(type, options);
case args[0] !== window:
return QuickWindow;
case !IS.string(args[0]):
type = args[0].toLowerCase();
if (type === 'text') {
options = IS.object(args[1]) ? args[1] : {
text: args[1] || ''
};
} else {
options = IS.object(args[1]) ? args[1] : {};
}
element = new QuickElement(type, options);
if (args.length > 2) {
children = new Array(argsLength = args.length);
i = 1;
while (++i < argsLength) {
children[i + 1] = args[i];
}
for ((j = 0, len = children.length); j < len; j++) {
child = children[j];
if (IS.string(child)) {
child = QuickDom.text(child);
}
if (IS.array(child)) {
child = QuickDom(...child);
}
if (IS.quickDomEl(child)) {
element.append(child);
}
}
}
return element;
case !(args[0] && (IS.domNode(args[0][0]) || IS.domDoc(args[0][0]))):
return QuickDom(args[0][0]);
}
};
QuickDom.template = function (tree) {
return new QuickTemplate(tree, true);
};
QuickDom.html = function (innerHTML) {
var children, container;
container = document.createElement('div');
container.innerHTML = innerHTML;
children = Array.prototype.slice.call(container.childNodes);
return QuickDom.batch(children);
};
QuickDom.query = function (target) {
return QuickDom(document).query(target);
};
QuickDom.queryAll = function (target) {
return QuickDom(document).queryAll(target);
};
QuickDom.isTemplate = function (target) {
return IS.template(target);
};
QuickDom.isQuickEl = function (target) {
return IS.quickDomEl(target);
};
QuickDom.isEl = function (target) {
return IS.domEl(target);
};
var QuickBatch;

QuickBatch = class QuickBatch {
  constructor(elements, returnResults1) {
    this.returnResults = returnResults1;
    this.elements = elements.map(function(el) {
      return QuickDom(el);
    });
  }

  reverse() {
    this.elements = this.elements.reverse();
    return this;
  }

  return(returnNext) {
    if (returnNext) {
      this.returnResults = true;
      return this;
    } else {
      return this.lastResults;
    }
  }

};

/* istanbul ignore next */
if (QuickBatch.name == null) {
  QuickBatch.name = 'QuickBatch';
}

Object.keys(QuickElement.prototype).concat('css', 'replaceWith', 'html', 'text').forEach(function(method) {
  return QuickBatch.prototype[method] = function(newValue) {
    var element, results;
    results = this.lastResults = (function() {
      var i, len, ref, results1;
      ref = this.elements;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        element = ref[i];
        if (method === 'html' || method === 'text') {
          if (newValue) {
            results1.push(element[method] = newValue);
          } else {
            results1.push(element[method]);
          }
        } else {
          results1.push(element[method](...arguments));
        }
      }
      return results1;
    }).apply(this, arguments);
    if (this.returnResults) {
      return results;
    } else {
      return this;
    }
  };
});

QuickDom.batch = function(elements, returnResults) {
  if (!IS.iterable(elements)) {
    throw new Error(`Batch: expected an iterable, got ${String(elements)}`);
  } else if (!elements.length) {
    throw new Error("Batch: expected a non-empty element collection");
  }
  return new QuickBatch(elements, returnResults);
};

;
var QuickTemplate;
var extendByRef, extendTemplate, notDeepKeys, notKeys;

notDeepKeys = ['relatedInstance', 'related', 'data'];

notKeys = ['children', '_childRefs'];

extendTemplate = function(currentOpts, newOpts, globalOpts) {
  var currentChild, currentChildren, globalOptsTransform, index, maxLength, needsTemplateWrap, newChild, newChildProcessed, newChildren, noChanges, output, ref, remainingNewChildren;
  if (globalOpts) {
    globalOptsTransform = {
      options: function(opts) {
        return extend(opts, globalOpts);
      }
    };
  }
  if (IS.array(newOpts)) {
    newOpts = parseTree(newOpts, false);
  } else if (newOpts && !matchesSchema(newOpts)) {
    newOpts = {
      options: newOpts
    };
  }
  output = extend.deep.nullDeletes.notKeys(notKeys).notDeep(notDeepKeys).transform(globalOptsTransform).clone(currentOpts, newOpts);
  currentChildren = currentOpts.children;
  newChildren = (newOpts != null ? newOpts.children : void 0) || [];
  output.children = [];
  /* istanbul ignore next */
  if (IS.array(newChildren)) {
    maxLength = Math.max(currentChildren.length, newChildren.length);
    index = -1;
    while (++index !== maxLength) {
      needsTemplateWrap = noChanges = false;
      currentChild = currentChildren[index];
      newChild = newChildren[index];
      newChildProcessed = (function() {
        switch (false) {
          case !IS.template(newChild):
            return newChild;
          case !IS.array(newChild):
            return needsTemplateWrap = parseTree(newChild);
          case !IS.string(newChild):
            return needsTemplateWrap = {
              type: 'text',
              options: {
                text: newChild
              }
            };
          case !(!newChild && !globalOpts):
            return noChanges = true;
          default:
            return needsTemplateWrap = newChild || true;
        }
      })();
      if (noChanges) {
        newChildProcessed = currentChild;
      } else if (needsTemplateWrap) {
        newChildProcessed = currentChild ? currentChild.extend(newChildProcessed, globalOpts) : new QuickTemplate(extend.clone(schema, newChildProcessed));
      }
      output.children.push(newChildProcessed);
    }
  } else if (IS.object(newChildren)) {
    newChildren = extend.allowNull.clone(newChildren);
    output.children = extendByRef(newChildren, currentChildren, globalOpts);
    remainingNewChildren = newChildren;
    for (ref in remainingNewChildren) {
      newChild = remainingNewChildren[ref];
      newChildProcessed = IS.objectPlain(newChild) && !IS.template(newChild) ? newChild : parseTree(newChild);
      output.children.push(new QuickTemplate(newChildProcessed));
      delete remainingNewChildren[ref];
    }
  }
  return output;
};

extendByRef = function(newChildrenRefs, currentChildren, globalOpts) {
  var currentChild, i, len, newChild, newChildProcessed, output;
  if (!currentChildren.length) {
    return currentChildren;
  } else {
    output = [];
    for (i = 0, len = currentChildren.length; i < len; i++) {
      currentChild = currentChildren[i];
      newChild = newChildrenRefs[currentChild.ref];
      if (newChild) {
        newChildProcessed = currentChild.extend(newChild, globalOpts);
        delete newChildrenRefs[currentChild.ref];
      } else if (newChild === null) {
        delete newChildrenRefs[currentChild.ref];
        continue;
      } else {
        newChildProcessed = (function() {
          switch (false) {
            case !globalOpts:
              return currentChild.extend(null, globalOpts);
            case !Object.keys(newChildrenRefs).length:
              return currentChild.extend();
            default:
              return currentChild;
          }
        })();
      }
      newChildProcessed.children = extendByRef(newChildrenRefs, newChildProcessed.children);
      output.push(newChildProcessed);
    }
    return output;
  }
};

;
var parseErrorPrefix, parseTree;

parseTree = function(tree, parseChildren) {
  var output;
  switch (false) {
    case !IS.array(tree):
      output = {};
      if (!IS.string(tree[0])) {
        throw new Error(`${parseErrorPrefix} string for 'type', got '${String(tree[0])}'`);
      } else {
        output.type = tree[0];
      }
      if (tree.length > 1 && !IS.object(tree[1]) && tree[1] !== null) {
        throw new Error(`${parseErrorPrefix} object for 'options', got '${String(tree[1])}'`);
      } else {
        output.options = tree[1] ? extend.deep.clone(tree[1]) : schema.options;
        if (tree[1]) {
          output.ref = tree[1].id || tree[1].ref;
        }
      }
      output.children = tree.slice(2);
      if (parseChildren === false) {
        if (tree.length === 3 && IS.objectPlain(tree[2]) && !IS.template(tree[2])) {
          output.children = tree[2];
        }
      } else {
        output.children = output.children.map(QuickDom.template);
      }
      return output;
    case !(IS.string(tree) || IS.domText(tree)):
      return {
        type: 'text',
        options: {
          text: tree.textContent || tree
        },
        children: schema.children
      };
    case !IS.domEl(tree):
      return {
        type: tree.nodeName.toLowerCase(),
        ref: tree.id,
        options: extend.clone.keys(allowedTemplateOptions)(tree),
        children: schema.children.map.call(tree.childNodes, QuickDom.template)
      };
    case !IS.quickDomEl(tree):
      return {
        type: tree.type,
        ref: tree.ref,
        options: extend.clone.deep.notKeys(['relatedInstance', 'related'])(tree.options),
        children: tree.children.map(QuickDom.template)
      };
    case !IS.template(tree):
      return tree;
    default:
      throw new Error(`${parseErrorPrefix} (array || string || domEl || quickDomEl || template), got ${String(tree)}`);
  }
};

parseErrorPrefix = 'Template Parse Error: expected';

;
var matchesSchema, schema;

schema = {
  type: 'div',
  ref: void 0,
  options: {},
  children: []
};

matchesSchema = function(object) {
  return typeof object.type !== 'undefined' || typeof object.ref !== 'undefined' || typeof object.options !== 'undefined' || typeof object.children !== 'undefined';
};

;
QuickTemplate = class QuickTemplate {
constructor(config, isTree) {
if (IS.template(config)) {
return config;
}
config = isTree ? parseTree(config) : config;
extend(this, config);
}
extend(newValues, globalOpts) {
return new QuickTemplate(extendTemplate(this, newValues, globalOpts));
}
spawn(newValues, globalOpts, data) {
var child, childData, children, element, i, len, options, type;
if (newValues && newValues.data) {
data = newValues.data;
if (Object.keys(newValues).length === 1) {
newValues = null;
}
}
if (newValues || globalOpts) {
({options, children, type} = extendTemplate(this, newValues, globalOpts));
} else {
({options, children, type} = this);
options = extend.clone(options);
}
element = QuickDom.create([type, options]);
if (children) {
childData = options.passDataToChildren ? data || options.data : void 0;
for ((i = 0, len = children.length); i < len; i++) {
child = children[i];
element.append(child.spawn(null, null, childData));
}
}
element._postCreation(data);
return element;
}
};
if (QuickTemplate.name == null) {
QuickTemplate.name = 'QuickTemplate';
}
Object.defineProperty(QuickTemplate.prototype, 'child', {
get: function () {
return this._childRefs || _getChildRefs(this);
}
});
;
var i, len, shortcut, shortcuts;

shortcuts = [
  'link:a',
  'anchor:a',
  'a',
  'text',
  'div',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'footer',
  'section',
  'button',
  'br',
  'ul',
  'ol',
  'li',
  'fieldset',
  'input',
  'textarea',
  'select',
  'option',
  'form',
  'frame',
  'hr',
  'iframe',
  'img',
  'picture',
  'main',
  'nav',
  'meta',
  'object',
  'pre',
  'style',
  'table',
  'tbody',
  'th',
  'tr',
  'td',
  'tfoot',
  // 'template'
  'video'
];

for (i = 0, len = shortcuts.length; i < len; i++) {
  shortcut = shortcuts[i];
  (function(shortcut) {
    var prop, split, type;
    prop = type = shortcut;
    if (helpers.includes(shortcut, ':')) {
      split = shortcut.split(':');
      prop = split[0];
      type = split[1];
    }
    return QuickDom[prop] = function() {
      return QuickDom(type, ...arguments);
    };
  })(shortcut);
}

;
QuickDom.version = "1.0.90";
QuickDom.CSS = CSS;
module.exports = QuickDom;
return module.exports;
},
5: function (require, module, exports) {
module.exports = {
red: '#cc4820',
green: '#72c322',
orange: '#ff9c00',
black: '#181818',
grey_dark: '#5e5e5e',
grey: '#909090',
grey_semi_light: '#bebebe',
grey_light: '#d3d3d3',
grey_light2: '#dddddd',
grey_light3: '#f2f5f7',
grey_light4: '#e5e5e5'
};
return module.exports;
},
6: function (require, module, exports) {
module.exports = require(42);
return module.exports;
},
7: function (require, module, exports) {
((function (chaiDom) {
if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
module.exports = chaiDom;
} else if (typeof define === 'function' && define.amd) {
define(function () {
return chaiDom;
});
} else {
chai.use(chaiDom);
}
})(function (chai, utils) {
var flag = utils.flag, elToString = function (el) {
var desc;
if (el instanceof window.NodeList) {
if (el.length === 0) return 'empty NodeList';
desc = Array.prototype.slice.call(el, 0, 5).map(elToString).join(', ');
return el.length > 5 ? desc + '... (+' + (el.length - 5) + ' more)' : desc;
}
if (!(el instanceof window.HTMLElement)) {
return String(el);
}
desc = el.tagName.toLowerCase();
if (el.id) {
desc += '#' + el.id;
}
if (el.className) {
desc += '.' + String(el.className).replace(/\s+/g, '.');
}
Array.prototype.forEach.call(el.attributes, function (attr) {
if (attr.name !== 'class' && attr.name !== 'id') {
desc += '[' + attr.name + (attr.value ? '="' + attr.value + '"]' : ']');
}
});
return desc;
}, attrAssert = function (name, val) {
var el = flag(this, 'object'), actual = el.getAttribute(name);
if (!flag(this, 'negate') || undefined === val) {
this.assert(!!el.attributes[name], 'expected ' + elToString(el) + ' to have an attribute #{exp}', 'expected ' + elToString(el) + ' not to have an attribute #{exp}', name);
}
if (undefined !== val) {
this.assert(val === actual, 'expected ' + elToString(el) + ' to have an attribute ' + utils.inspect(name) + ' with the value #{exp}, but the value was #{act}', 'expected ' + elToString(el) + ' not to have an attribute ' + utils.inspect(name) + ' with the value #{act}', val, actual);
}
flag(this, 'object', actual);
};
utils.elToString = elToString;
chai.Assertion.addMethod('attr', attrAssert);
chai.Assertion.addMethod('attribute', attrAssert);
chai.Assertion.addMethod('class', function (className) {
var el = flag(this, 'object');
this.assert(el.classList.contains(className), 'expected ' + elToString(el) + ' to have class #{exp}', 'expected ' + elToString(el) + ' not to have class #{exp}', className);
});
chai.Assertion.addMethod('id', function (id) {
var el = flag(this, 'object');
this.assert(el.id == id, 'expected ' + elToString(el) + ' to have id #{exp}', 'expected ' + elToString(el) + ' not to have id #{exp}', id);
});
chai.Assertion.addMethod('html', function (html) {
var el = flag(this, 'object'), actual = flag(this, 'object').innerHTML;
if (flag(this, 'contains')) {
this.assert(actual.indexOf(html) >= 0, 'expected #{act} to contain HTML #{exp}', 'expected #{act} not to contain HTML #{exp}', html, actual);
} else {
this.assert(actual === html, 'expected ' + elToString(el) + ' to have HTML #{exp}, but the HTML was #{act}', 'expected ' + elToString(el) + ' not to have HTML #{exp}', html, actual);
}
});
chai.Assertion.addMethod('text', function (text) {
var obj = flag(this, 'object'), contains = flag(this, 'contains'), actual, result;
if (obj instanceof window.NodeList) {
actual = Array.prototype.map.call(obj, function (el) {
return el.textContent;
});
if (Array.isArray(text)) {
result = contains ? text[flag(this, 'negate') ? 'some' : 'every'](function (t) {
return Array.prototype.some.call(obj, function (el) {
return el.textContent === t;
});
}) : utils.eql(actual, text);
actual = actual.join();
text = text.join();
} else {
actual = actual.join('');
result = contains ? actual.indexOf(text) >= 0 : actual === text;
}
} else {
actual = flag(this, 'object').textContent;
result = contains ? actual.indexOf(text) >= 0 : actual === text;
}
var objDesc = elToString(obj);
if (contains) {
this.assert(result, 'expected ' + objDesc + ' to contain #{exp}, but the text was #{act}', 'expected ' + objDesc + ' not to contain #{exp}, but the text was #{act}', text, actual);
} else {
this.assert(result, 'expected ' + objDesc + ' to have text #{exp}, but the text was #{act}', 'expected ' + objDesc + ' not to have text #{exp}', text, actual);
}
});
chai.Assertion.addMethod('value', function (value) {
var el = flag(this, 'object'), actual = flag(this, 'object').value;
this.assert(flag(this, 'object').value === value, 'expected ' + elToString(el) + ' to have value #{exp}, but the value was #{act}', 'expected ' + elToString(el) + ' not to have value #{exp}', value, actual);
});
chai.Assertion.overwriteProperty('exist', function (_super) {
return function () {
var obj = flag(this, 'object');
if (obj instanceof window.NodeList) {
this.assert(obj.length > 0, 'expected an empty NodeList to have nodes', 'expected ' + elToString(obj) + ' to not exist');
} else {
_super.apply(this, arguments);
}
};
});
chai.Assertion.overwriteProperty('empty', function (_super) {
return function () {
var obj = flag(this, 'object');
if (obj instanceof window.HTMLElement) {
this.assert(obj.children.length === 0, 'expected ' + elToString(obj) + ' to be empty', 'expected ' + elToString(obj) + ' to not be empty');
} else if (obj instanceof window.NodeList) {
this.assert(obj.length === 0, 'expected ' + elToString(obj) + ' to be empty', 'expected ' + elToString(obj) + ' to not be empty');
} else {
_super.apply(this, arguments);
}
};
});
chai.Assertion.overwriteChainableMethod('length', function (_super) {
return function (length) {
var obj = flag(this, 'object');
if (obj instanceof window.NodeList || obj instanceof window.HTMLElement) {
var actualLength = obj.children ? obj.children.length : obj.length;
this.assert(actualLength === length, 'expected ' + elToString(obj) + ' to have #{exp} children but it had #{act} children', 'expected ' + elToString(obj) + ' to not have #{exp} children', length, actualLength);
} else {
_super.apply(this, arguments);
}
};
}, function (_super) {
return function () {
_super.call(this);
};
});
chai.Assertion.overwriteMethod('match', function (_super) {
return function (selector) {
var obj = flag(this, 'object');
if (obj instanceof window.HTMLElement) {
this.assert(obj.matches(selector), 'expected ' + elToString(obj) + ' to match #{exp}', 'expected ' + elToString(obj) + ' to not match #{exp}', selector);
} else if (obj instanceof window.NodeList) {
this.assert((!!obj.length && Array.prototype.every.call(obj, function (el) {
return el.matches(selector);
})), 'expected ' + elToString(obj) + ' to match #{exp}', 'expected ' + elToString(obj) + ' to not match #{exp}', selector);
} else {
_super.apply(this, arguments);
}
};
});
chai.Assertion.overwriteChainableMethod('contain', function (_super) {
return function (subitem) {
var obj = flag(this, 'object');
if (obj instanceof window.HTMLElement) {
if (typeof subitem === 'string') {
this.assert(!!obj.querySelector(subitem), 'expected ' + elToString(obj) + ' to contain #{exp}', 'expected ' + elToString(obj) + ' to not contain #{exp}', subitem);
} else {
this.assert(obj.contains(subitem), 'expected ' + elToString(obj) + ' to contain ' + elToString(subitem), 'expected ' + elToString(obj) + ' to not contain ' + elToString(subitem));
}
} else {
_super.apply(this, arguments);
}
};
}, function (_super) {
return function () {
_super.call(this);
};
});
chai.Assertion.addProperty('displayed', function () {
var el = flag(this, 'object'), actual = document.body.contains(el) ? window.getComputedStyle(el).display : el.style.display;
this.assert(actual !== 'none', 'expected ' + elToString(el) + ' to be displayed, but it was not', 'expected ' + elToString(el) + ' to not be displayed, but it was as ' + actual, actual);
});
}));
return module.exports;
},
8: function (require, module, exports) {
module.exports = chaiStyle;
function chaiStyle(chai, utils) {
const {Assertion} = chai;
const {flag} = utils;
Assertion.addMethod('style', function (property, value = '') {
const element = flag(this, 'object');
const style = window.getComputedStyle(element);
value = value.trim();
const isNonColors = style[property] === 'rgba(0, 0, 0, 0)' || style[property] === 'transparent';
const propertyValue = isNonColors ? '' : style[property];
const assertion = value ? compareCSSValue(propertyValue, value) : Boolean(propertyValue);
const elementTag = element.tagName.toLowerCase();
const throwMessage = `expect ${elementTag} to have {${property}: ${value}}, is receiving {${property}: ${propertyValue}}`;
const throwMessageNegative = `expect ${elementTag} to not have {${property}: ${value}}, is receiving {${property}: ${propertyValue}}`;
this.assert(assertion, throwMessage, throwMessageNegative, value);
function compareCSSValue(computed, expected) {
const propertyHifenCase = property.replace(/[A-Z]/g, match => '-' + match.toLowerCase());
const fake = document.createElement('div');
fake.style.fontSize = style.fontSize;
fake.style.setProperty(propertyHifenCase, expected, 'important');
const iframe = document.createElement('iframe');
iframe.style.visibility = 'hidden';
document.body.appendChild(iframe);
iframe.appendChild(fake);
const fakeStyle = window.getComputedStyle(fake);
const value = fakeStyle[property];
const hasAutoValue = value.includes('auto');
const reg = new RegExp(escapeRegExp(value).replace(/auto/g, '(\\d+(.\\d+)?px|auto)'));
return hasAutoValue ? reg.test(computed) : computed === value;
}
});
}
function escapeRegExp(value) {
return String(value).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}
return module.exports;
},
9: function (require, module, exports) {
'use strict';
var deepEqual = require(43);
var type = require(44);
var DEFAULT_TOLERANCE = 1e-6;
function isNumber(val) {
return type(val) === 'number';
}
function bothNumbers(left, right) {
return isNumber(right) && isNumber(left);
}
function almostEqual(left, right, tol) {
return Math.abs(left - right) <= tol;
}
function comparator(tolerance) {
return function (left, right) {
if (bothNumbers(left, right)) {
return almostEqual(left, right, tolerance);
}
return null;
};
}
function chaiAlmost(customTolerance) {
var standardTolerance = customTolerance || DEFAULT_TOLERANCE;
return function (chai, utils) {
var Assertion = chai.Assertion;
var flag = utils.flag;
function overrideAssertEqual(_super) {
return function assertEqual(val, msg) {
if (msg) flag(this, 'message', msg);
var deep = flag(this, 'deep');
var tolerance = flag(this, 'tolerance');
if (deep) {
return this.eql(val);
} else if (tolerance && bothNumbers(val, this._obj)) {
this.assert(almostEqual(val, this._obj, tolerance), 'expected #{this} to almost equal #{exp}', 'expected #{this} to not almost equal #{exp}', val, this._obj, true);
} else {
return _super.apply(this, arguments);
}
};
}
function overrideAssertEql(_super) {
return function assertEql(val, msg) {
if (msg) flag(this, 'message', msg);
var tolerance = flag(this, 'tolerance');
if (tolerance) {
this.assert(deepEqual(val, this._obj, {
comparator: comparator(tolerance)
}), 'expected #{this} to deeply almost equal #{exp}', 'expected #{this} to not deeply almost equal #{exp}', val, this._obj, true);
} else {
return _super.apply(this, arguments);
}
};
}
function method(val, toleranceOverride) {
var tolerance = toleranceOverride || standardTolerance;
flag(this, 'tolerance', tolerance);
return this.equal(val);
}
function chainingBehavior() {
flag(this, 'tolerance', standardTolerance);
}
Assertion.addChainableMethod('almost', method, chainingBehavior);
Assertion.overwriteMethod('equal', overrideAssertEqual);
Assertion.overwriteMethod('equals', overrideAssertEqual);
Assertion.overwriteMethod('eq', overrideAssertEqual);
Assertion.overwriteMethod('eql', overrideAssertEql);
Assertion.overwriteMethod('eqls', overrideAssertEql);
};
}
module.exports = chaiAlmost;
return module.exports;
},
10: function (require, module, exports) {
const check = require(45);
module.exports = chai => {
const types = ['number', 'string', 'boolean', 'object', 'array', 'date', 'function'];
types.forEach(type => {
chai.Assertion.addMethod(type, function () {
this.assert(check[type](this._obj), `expected #{this} to be ${type}`, `expected #{this} not to be ${type}`);
});
});
};
return module.exports;
},
11: function (require, module, exports) {
function plugin(chai, utils) {
var Assertion = chai.Assertion;
function isEmitter() {
if (typeof EventEmitter !== "undefined" && EventEmitter !== null && this._obj instanceof EventEmitter) {
return this.assert(true, "", "expected #{this} to not be an EventEmitter");
}
if (typeof EventTarget !== "undefined" && EventTarget !== null && this._obj instanceof EventTarget) {
return this.assert(true, "", "expected #{this} to not be an EventTarget");
}
var obj = this._obj;
var node = ["on", "emit"].every(function (method) {
return typeof obj[method] === "function";
});
if (node) {
return this.assert(true, "", "expected #{this} to not be an EventEmitter");
}
var browser = ["addEventListener", "dispatchEvent", "removeEventListener"].every(function (method) {
return typeof obj[method] === "function";
});
if (browser) {
return this.assert(true, "", "expected #{this} to not be an EventEmitter");
}
this.assert(false, "expected #{this} to be an EventEmitter", "");
}
;
Assertion.addProperty("emitter", isEmitter);
Assertion.addProperty("target", isEmitter);
Assertion.addMethod("emit", function (name, args) {
new Assertion(this._obj).to.be.an.emitter;
new Assertion(name).to.be.a("string");
var obj = this._obj;
var _this = this;
var assert = function () {
_this.assert.apply(_this, arguments);
};
var timeout = utils.flag(this, 'timeout') || 1500;
if (utils.flag(this, 'negate')) {
return new Promise(function (resolve, reject) {
var done = false;
obj.on(name, function () {
if (done) {
return;
}
done = true;
assert(false, "expected #{this} to not emit " + name + ".");
resolve();
});
setTimeout(function () {
if (done) {
return;
}
done = true;
resolve();
}, timeout);
});
} else {
return new Promise(function (resolve, reject) {
var done = false;
obj.on(name, function () {
if (done) {
return;
}
done = true;
resolve();
});
setTimeout(function () {
if (done) {
return;
}
done = true;
assert(false, "expected #{this} to emit " + name + ".");
resolve();
}, timeout);
});
}
});
}
if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
module.exports = plugin;
} else if (typeof define === "function" && define.amd) {
define(function () {
return plugin;
});
} else {
chai.use(plugin);
}
return module.exports;
},
12: function (require, module, exports) {
var DOM, IS, QuickField, REQUIRED_FIELD_METHODS, extend, helpers, newBuilder, registerAnimations;
helpers = require(46);
DOM = require(4);
IS = require(47);
extend = require(3);
registerAnimations = require(48);
REQUIRED_FIELD_METHODS = require(49);
/* istanbul ignore next */
if (this.console == null) {
  this.console = {};
}

/* istanbul ignore next */
if (console.log == null) {
  console.log = function() {};
}

/* istanbul ignore next */
if (console.warn == null) {
  console.warn = console.log;
}

;
newBuilder = function (settingOverrides, templateOverrides) {
var Field, builder;
builder = function (settings) {
if (arguments.length > 1) {
settings = extend.clone(...arguments);
}
if (!IS.object(settings)) {
settings = {};
}
if (settings.type == null) {
settings.type = 'text';
}
if (!Field[settings.type]) {
throw new Error(`QuickField: '${settings.type}' is not a valid/registered field type`);
}
registerAnimations();
return new Field[settings.type](settings, builder, settingOverrides, templateOverrides);
};
builder.register = function (type, targetField) {
var i, len, requiredMethod;
if (!IS.string(type) || !IS.function(targetField)) {
throw new Error("QuickField Registration: invalid arguments");
}
for ((i = 0, len = REQUIRED_FIELD_METHODS.length); i < len; i++) {
requiredMethod = REQUIRED_FIELD_METHODS[i];
if (!targetField.prototype[requiredMethod]) {
throw new Error(`QuickField Registration: '${requiredMethod}' method is required in order to register the field`);
}
}
Field[type] = targetField;
return this;
};
builder.config = function (newSettings, newTemplates) {
var config, globalConfig, name, originalTemplates, outputSettings, outputTemplates, ref, templates, type;
if (!IS.object(newSettings)) {
throw new Error(`QuickField Config: invalid config object provided ${String(newSettings)}`);
}
outputSettings = Object.create(null);
for (type in newSettings) {
config = newSettings[type];
if (type === 'global') {
outputSettings.globalDefaults = extend.deep.notDeep(Field.shallowSettings).clone(Field.prototype.globalDefaults, config);
} else if (Field[type]) {
outputSettings[type] = extend.clone.deep.notDeep(Field.shallowSettings)(Field[type].prototype.defaults, config);
}
}
if (IS.object(newTemplates)) {
outputTemplates = Object.create(null);
globalConfig = newTemplates.global;
if (globalConfig && globalConfig.field && !globalConfig.default) {
globalConfig.default = globalConfig.field;
}
for (type in Field) {
originalTemplates = (ref = Field[type].prototype) != null ? ref.templates : void 0;
templates = newTemplates[type] || globalConfig;
if (!originalTemplates) {
continue;
}
if (!templates) {
outputTemplates[type] = originalTemplates;
continue;
}
if (templates.field && !templates.default) {
templates.default = templates.field;
}
outputTemplates[type] = Object.create(null);
for (name in templates) {
config = templates[name];
if (name === 'field' || !originalTemplates[name]) {
continue;
}
if (globalConfig && globalConfig[name]) {
config = extend.clone.deep.concat(globalConfig[name], config);
}
outputTemplates[type][name] = originalTemplates[name].extend(config);
}
for (name in originalTemplates) {
config = originalTemplates[name];
if (!outputTemplates[type][name]) {
outputTemplates[type][name] = config;
}
}
}
}
return newBuilder(outputSettings, outputTemplates);
};
Object.defineProperty(builder, 'fields', {
get: function () {
return extend.clone.own.notKeys('instances')(Field);
}
});
builder.settingOverrides = settingOverrides;
builder.templateOverrides = templateOverrides;
builder.version = "1.0.88";
builder.Field = Field = require(52);
return builder;
};
QuickField = newBuilder();
QuickField.register('text', require(53));
module.exports = QuickField;
return module.exports;
},
13: function (require, module, exports) {
var DOM, Dropdown, IS, SimplyBind, TextField, TextareaField, extend, helpers;
Dropdown = require(54);
helpers = require(46);
IS = require(47);
DOM = require(4);
extend = require(3);
SimplyBind = require(55);
TextField = require(53);
var templates = require(56);
var defaults = require(57);
var __index = require(52), Field = __index;
TextareaField = (function () {
class TextareaField extends Field {
constructor() {
super(...arguments);
if (this._value == null) {
this._value = '';
}
this.state.height = this.settings.autoHeight ? 'auto' : this.settings.height;
this.state.typing = false;
this.cursor = {
prev: 0,
current: 0
};
this._createElements();
this._attachBindings();
this._constructorEnd();
}
_getValue() {
return this._value;
}
_setValue(newValue) {
if (IS.string(newValue) || IS.number(newValue)) {
return this._value = String(newValue);
}
}
_recalcDisplay() {
if (this.settings.autoHeight || this.settings.autoWidth) {
return this._value = this._value;
}
}
_createElements() {
var forceOpts;
forceOpts = {
relatedInstance: this
};
this.el = this.template.spawn(this.settings.templates.defaults, forceOpts);
this.el.state('hasLabel', this.settings.label);
this.el.child.innerwrap.raw._quickField = this.el.child.input.raw._quickField = this;
}
_attachBindings() {
this._attachBindings_elState();
this._attachBindings_display();
this._attachBindings_display_autoWidth();
this._attachBindings_display_autoHeight();
this._attachBindings_value();
this._attachBindings_autocomplete();
this._attachBindings_stateTriggers();
}
_attachBindings_display_autoHeight() {
SimplyBind('height', {
updateEvenIfSame: true
}).of(this.state).transformSelf(function (value) {
if (isNaN(value) && isNaN(parseFloat(value))) {
return 'auto';
} else {
return value;
}
}).to(height => {
return this.el.child.innerwrap.style('height', height);
}).updateOn('event:inserted').of(this);
if (this.settings.autoHeight) {
SimplyBind('_value', {
updateEvenIfSame: true,
updateOnBind: false
}).of(this).to('height').of(this.state).transform(() => {
return this._getInputAutoHeight();
}).updateOn('event:inserted').of(this);
}
}
_attachBindings_display_autoWidth() {
SimplyBind('width', {
updateEvenIfSame: true
}).of(this.state).to(width => {
return (this.settings.autoWidth ? this.el.child.innerwrap : this.el).style('width', width);
}).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);
if (this.settings.autoWidth) {
SimplyBind('_value', {
updateEvenIfSame: true,
updateOnBind: false
}).of(this).to('width').of(this.state).transform(() => {
return this._getInputAutoWidth();
}).updateOn('event:inserted').of(this);
}
}
_attachBindings_value() {
var input;
input = this.el.child.input.raw;
SimplyBind('event:input').of(input).to(() => {
return this.value = input.value;
});
SimplyBind('_value').of(this).to('value').of(input).and.to(value => {
this.state.filled = !!value;
if (value) {
this.state.interacted = true;
}
this.state.valid = this.validate(void 0, true);
return this.emit('input', value);
});
}
_attachBindings_autocomplete() {}
_getInputAutoHeight() {
var inputHeight, prevHeight;
prevHeight = this.el.child.input.raw.style.height;
if (this._value) {
this._setValueIfNotSet();
this.el.child.input.style('height', 0);
inputHeight = this.el.child.input.raw.scrollHeight + 2;
inputHeight += this.el.child.input.styleParsed('marginTop') + this.el.child.input.styleParsed('marginBottom');
} else {
inputHeight = this.el.child.placeholder.height;
}
this.el.child.input.style('height', prevHeight);
return Math.min(this.settings.maxHeight, Math.max(inputHeight, this.settings.minHeight));
}
_getInputAutoWidth() {
var inputPadding, inputWidth, labelWidth;
if (this._value) {
this._setValueIfNotSet();
this.el.child.input.style({
width: 0,
whiteSpace: 'nowrap'
}).raw.scrollLeft = 1e+10;
inputPadding = this.el.child.input.styleParsed('paddingLeft') || this.el.child.input.styleParsed('padding');
inputWidth = Math.max(this.el.child.input.raw.scrollLeft + this.el.child.input.raw.offsetWidth, this.el.child.input.raw.scrollWidth) + 2 + inputPadding + 1;
labelWidth = this.settings.label && this.el.child.label.styleSafe('position') === 'absolute' ? this.el.child.label.rect.width : 0;
} else {
inputWidth = this.el.child.placeholder.rect.width;
labelWidth = 0;
}
this.el.child.input.style({
width: '100%',
whiteSpace: 'normal'
});
return Math.min(this._getWidthSetting('max'), Math.max(this._getWidthSetting('min'), inputWidth, labelWidth));
}
}
;
TextareaField.prototype.template = templates.default;
TextareaField.prototype.templates = templates;
TextareaField.prototype.defaults = defaults;
helpers.inheritProto(TextareaField, TextField);
return TextareaField;
}).call(this);
module.exports = TextareaField;
return module.exports;
},
14: function (require, module, exports) {
var DOM, IS, KEYCODES, NumberField, SimplyBind, TextField, extend, helpers;
helpers = require(46);
IS = require(47);
DOM = require(4);
extend = require(3);
SimplyBind = require(55);
TextField = require(53);
KEYCODES = require(58);
var templates = require(59);
var defaults = require(60);
NumberField = (function () {
class NumberField extends require(52) {
constructor() {
var ref;
super(...arguments);
if (this._value == null) {
this._value = '';
}
if (this.settings.enforce && this.settings.minValue && this.settings.minValue !== -2e308) {
this._value || (this._value = this.settings.minValue);
}
this.settings.step = Number(this.settings.step) || 1;
this.state.typing = false;
this.cursor = {
prev: 0,
current: 0
};
this.precision = ((ref = this.settings.step.toString().split('.')[1]) != null ? ref.length : void 0) || 0;
this._createElements();
this._attachBindings();
this._constructorEnd();
}
_getValue() {
return Number(this._value) || 0;
}
_setValue(newValue) {
return this._value = this._normalizeValue(newValue, this.settings.enforce);
}
_createElements() {
var globalOpts;
globalOpts = {
relatedInstance: this
};
this.el = this.template.spawn(this.settings.templates.defaults, globalOpts);
if (this.settings.buttons) {
templates.buttons.spawn(this.settings.templates.buttons, globalOpts).insertAfter(this.el.child.input);
}
this.el.state('hasLabel', this.settings.label);
this.el.child.innerwrap.raw._quickField = this.el.childf.input.raw._quickField = this;
}
_attachBindings() {
this._attachBindings_elState();
this._attachBindings_display();
this._attachBindings_display_autoWidth();
this._attachBindings_value();
this._attachBindings_stateTriggers();
this._attachBindings_stepEvents();
}
_attachBindings_value() {
var input;
input = this.el.child.input.raw;
SimplyBind('event:input').of(input).to(() => {
var newValue, selectNumberPart;
this.cursor.prev = this.cursor.current;
this.cursor.current = this.selection().end;
newValue = input.value;
if (newValue[newValue.length - 1] === '-') {
if (this.settings.minValue > -1) {
newValue = this._value;
} else {
newValue = -1;
selectNumberPart = true;
}
}
this._setValue(newValue);
if (this.state.focused) {
if (selectNumberPart) {
return this.selection(1, 2);
} else {
return this.selection(this.cursor.current, this.cursor.current + (String(this._value).length - newValue.length));
}
}
});
SimplyBind('_value').of(this).to('value').of(input).and.to(value => {
this.state.filled = !!String(value);
if (String(value)) {
this.state.interacted = true;
}
this.state.valid = this.validate(void 0, true);
return this.emit('input', value);
});
SimplyBind('event:blur').of(input).to(() => {
var value;
if (!this.settings.enforce) {
value = Number(this._value) || 0;
if (value === 0 || (!this.state.interacted && value === this.settings.minValue)) {
return this._value = '';
}
}
});
SimplyBind('event:keydown').of(this.el.child.input).to(event => {
if (event.keyCode === KEYCODES.enter) {
this.emit('submit');
}
return this.emit(`key-${event.keyCode}`);
});
}
_attachBindings_stepEvents() {
var stopPropagation;
SimplyBind('event:keydown').of(this.el.child.input).to(event => {
switch (event.keyCode) {
case KEYCODES.up:
event.preventDefault();
return this.stepUp();
case KEYCODES.down:
event.preventDefault();
return this.stepDown();
}
});
if (this.settings.buttons) {
stopPropagation = function (event) {
event.preventDefault();
return event.stopPropagation();
};
SimplyBind('event:click').of(this.el.child.stepUp).to(this.stepUp.bind(this)).and.to(stopPropagation);
SimplyBind('event:click').of(this.el.child.stepDown).to(this.stepDown.bind(this)).and.to(stopPropagation);
}
}
_setValueIfNotSet() {
if (Number(this.el.child.input.raw.value) !== this._value) {
return this.el.child.input.raw.value = this._value;
}
}
_normalizeValue(value, enforce) {
value = value ? parseFloat(value) || 0 : 0;
if (value % this.settings.step && enforce) {
if (value < this.settings.step) {
value = this.settings.step;
} else {
value = this._roundToNearest(value, this.settings.step);
}
}
if (value < this.settings.minValue) {
value = this.settings.minValue;
}
if (value > this.settings.maxValue) {
value = this.settings.maxValue;
}
return value;
}
_roundToNearest(value, target) {
var multiplier;
value = (value || 0).toFixed(this.precision) * 1;
multiplier = target < 1 ? 1 / target : 1;
target *= multiplier;
value *= multiplier;
value = (Math.ceil(value / target) * target) / multiplier;
return value;
}
stepUp() {
var newValue, rounded;
rounded = this._roundToNearest(this._value, this.settings.step);
newValue = Math.min(rounded + this.settings.step, this._value + this.settings.step);
return this._setValue(this._roundToNearest(newValue, this.settings.step));
}
stepDown() {
var newValue, rounded;
rounded = this._roundToNearest(this._value, this.settings.step);
newValue = Math.max(rounded - this.settings.step, this._value - this.settings.step);
return this._setValue(this._roundToNearest(newValue, this.settings.step));
}
}
;
NumberField.prototype.template = templates.default;
NumberField.prototype.templates = templates;
NumberField.prototype.defaults = defaults;
helpers.inheritProto(NumberField, TextField);
return NumberField;
}).call(this);
extend.notKeys(NumberField.prototype)(NumberField.prototype, TextField.prototype);
module.exports = NumberField;
return module.exports;
},
15: function (require, module, exports) {
var DOM, Dropdown, IS, SelectField, SimplyBind, TextField, extend, helpers;
Dropdown = require(54);
helpers = require(46);
IS = require(47);
DOM = require(4);
extend = require(3);
SimplyBind = require(55);
TextField = require(53);
var templates = require(61);
var defaults = require(62);
SelectField = (function () {
class SelectField extends require(52) {
constructor() {
var base;
super(...arguments);
this.settings.dropdown.multiple = this.settings.multiple;
if (this.settings.multiple) {
if ((base = this.settings.dropdown).help == null) {
base.help = 'Tip: press ESC to close this menu';
}
}
this._value = this.settings.multiple ? [] : null;
this.dropdown = new Dropdown(this.settings.choices, this);
this._createElements();
this._attachBindings();
this._constructorEnd();
}
_getValue() {
var ref;
if (!this.settings.multiple) {
return (ref = this._value) != null ? ref.value : void 0;
} else {
return this._value.map(function (choice) {
return choice.value;
});
}
}
_setValue(newValue) {
var i, len, value;
if (!this.settings.multiple || !IS.array(newValue)) {
this.setChoice(newValue);
} else {
for ((i = 0, len = newValue.length); i < len; i++) {
value = newValue[i];
this.setChoice(value);
}
}
}
_recalcDisplay() {
if (this.settings.autoWidth) {
return this.valueLabel = this.valueLabel;
}
}
_createElements() {
var forceOpts;
forceOpts = {
relatedInstance: this
};
this.el = this.template.spawn(this.settings.templates.default, forceOpts);
this.dropdown.appendTo(this.el.child.innerwrap);
this.el.child.placeholder.insertBefore(this.el.child.input);
if (this.settings.label) {
this.el.child.label.text = this.settings.label;
this.el.state('hasLabel', true);
}
this.el.child.innerwrap.raw._quickField = this.el.child.input.raw._quickField = this;
}
_attachBindings() {
this._attachBindings_elState();
this._attachBindings_value();
this._attachBindings_display();
this._attachBindings_display_autoWidth();
this._attachBindings_dropdown();
this._attachBindings_stateTriggers();
}
_attachBindings_display_autoWidth() {
SimplyBind('width', {
updateEvenIfSame: true
}).of(this.state).to(width => {
return (this.settings.autoWidth ? this.el.child.input : this.el).style({
width
});
}).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);
if (this.settings.autoWidth) {
SimplyBind('valueLabel', {
updateEvenIfSame: true,
updateOnBind: false
}).of(this).to('width').of(this.state).transform(() => {
return this._getInputAutoWidth();
}).updateOn('event:inserted').of(this);
}
}
_getInputAutoWidth() {
var inputWidth, labelWidth;
if (this.valueLabel) {
this.el.child.input.style('width', 0);
inputWidth = this.el.child.input.raw.scrollWidth + 2;
labelWidth = this.el.child.label.styleSafe('position') === 'absolute' ? this.el.child.label.rect.width : 0;
} else {
inputWidth = this.el.child.placeholder.rect.width;
labelWidth = 0;
}
return Math.max(inputWidth, labelWidth);
}
_attachBindings_value() {
SimplyBind('array:_value').of(this).to(selected => {
this.state.filled = this.settings.multiple ? !!(selected != null ? selected.length : void 0) : !!selected;
if (this.state.filled) {
this.state.interacted = true;
}
this.state.valid = this.validate(void 0, true);
return this.emit('input', this.value);
}).and.to('valueLabel').of(this).transform(selected => {
if (!selected) {
return '';
} else {
if (this.settings.multiple) {
return selected.map(function (choice) {
return choice.label;
}).join(', ');
} else {
return selected.label;
}
}
});
SimplyBind('valueLabel').of(this).to('text').of(this.el.child.input).transform(label => {
if (this.settings.labelFormat) {
return this.settings.labelFormat(label);
} else {
return label;
}
});
}
_attachBindings_dropdown() {
SimplyBind('event:click').of(this.el.child.input).to(event => {
var escListener;
if (!(this.state.disabled || this.dropdown.choices.length === 0)) {
this.dropdown.isOpen = true;
this.focus();
DOM(document).on('click.dropdown', event => {
if (DOM(event.target).parentMatching(parent => {
return parent === this.el.child.innerwrap;
})) {
return;
}
return this.dropdown.isOpen = false;
}, true);
escListener = SimplyBind('event:keydown').of(document).once.to(() => {
return this.dropdown.isOpen = false;
}).condition(function (event) {
return event.keyCode === 27;
});
return SimplyBind('isOpen', {
updateOnBind: false
}).of(this.dropdown).once.to(function () {
escListener.unBind();
return DOM(document).off('click.dropdown');
}).condition(function (isOpen) {
return !isOpen;
});
}
});
SimplyBind('event:click').of(this.el.child.innerwrap).to(event => {
event.stopPropagation();
return this.el.child.input.emitPrivate('click');
}).condition(event => {
return event.target === this.el.child.innerwrap.raw;
});
SimplyBind('focused', {
updateOnBind: false
}).of(this.state).to(focused => {
var triggeringKeycodes;
if (!focused) {
return this.el.child.input.off('keydown.dropdownTrigger');
} else {
triggeringKeycodes = [32, 37, 38, 39, 40];
return this.el.child.input.on('keydown.dropdownTrigger', event => {
var ref;
if (helpers.includes(triggeringKeycodes, event.keyCode) && !this.dropdown.isOpen) {
this.dropdown.isOpen = true;
if ((ref = this.dropdown.lastSelected) != null ? ref.selected : void 0) {
this.dropdown.currentHighlighted = this.dropdown.lastSelected;
}
return event.preventDefault();
} else if (event.keyCode === 9 && this.dropdown.isOpen) {
return event.preventDefault();
}
});
}
});
this.dropdown.onSelected(choice => {
if (!(choice.selected && !this.settings.multiple)) {
this.value = choice;
}
if (!this.settings.multiple) {
return this.dropdown.isOpen = false;
}
});
}
_attachBindings_stateTriggers() {
SimplyBind('event:mouseenter').of(this.el.child.input).to(() => {
return this.state.hovered = true;
});
SimplyBind('event:mouseleave').of(this.el.child.input).to(() => {
return this.state.hovered = false;
});
SimplyBind('event:focus').of(this.el.child.input).to(() => {
this.state.focused = true;
if (this.state.disabled) {
return this.blur();
}
});
SimplyBind('event:blur').of(this.el.child.input).to(() => {
return this.state.focused = false;
});
}
_validate(providedValue) {
var matchingChoice, ref, ref1;
if (this.settings.validWhenRegex && IS.regex(this.settings.validWhenRegex)) {
switch (false) {
case !this.settings.multiple:
if (!(() => {
var validChoices;
if (providedValue.length === 0) {
return false;
}
validChoices = providedValue.filter(choice => {
return this.settings.validWhenRegex.test(choice);
});
if (this.settings.validWhenChoseMin === 2e308 || !IS.number(this.settings.validWhenChoseMin)) {
return validChoices.length === providedValue.length;
} else {
return validChoices.length >= this.settings.validWhenChoseMin;
}
})()) {
return false;
}
break;
default:
if (!this.settings.validWhenRegex.test(providedValue)) {
return false;
}
}
}
if (this.settings.validWhenIsChoice && ((ref = this.dropdown.choices) != null ? ref.length : void 0)) {
matchingChoice = this.dropdown.choices.filter(function (option) {
return option.value === providedValue;
});
if (!!!matchingChoice.length) {
return false;
}
}
if (this.settings.multiple && (-1 > (ref1 = this.settings.validWhenChoseMin) && ref1 < 2e308)) {
if (!providedValue.length >= this.settings.validWhenChoseMin) {
return false;
}
}
if (this.settings.multiple && this.settings.required) {
if (!providedValue.length) {
return false;
}
}
return true;
}
addChoice(choice) {
return this.dropdown.addChoice(choice);
}
setChoice(choice) {
var match, ref;
if (IS.object(choice) && choice instanceof Dropdown.Choice) {
return choice.toggle();
} else if (match = this.dropdown.findChoiceAny(choice)) {
return match.toggle(true);
} else {
return (ref = this.addChoice(choice)) != null ? ref.toggle(true) : void 0;
}
}
}
;
SelectField.prototype.template = templates.default;
SelectField.prototype.templates = templates;
SelectField.prototype.defaults = defaults;
SelectField.prototype.coreValueProp = 'value';
return SelectField;
}).call(this);
helpers.inheritProto(SelectField, TextField, ['_getMaxWidth', '_attachBindings_elState', '_attachBindings_display', 'focus', 'blur']);
module.exports = SelectField;
return module.exports;
},
16: function (require, module, exports) {
var Choice, ChoiceField, Condition, DOM, IS, SimplyBind, helpers;
helpers = require(46);
IS = require(47);
DOM = require(4);
SimplyBind = require(55);
Condition = require(63);
var templates = require(64);
var defaults = require(65);
ChoiceField = (function () {
class ChoiceField extends require(52) {
constructor() {
var ref;
super(...arguments);
if (!((ref = this.settings.choices) != null ? ref.length : void 0)) {
throw new Error(`Choices were not provided for choice field '${this.settings.label || this.ID}'`);
}
this._value = this.settings.multiple ? [] : null;
this.lastSelected = null;
this.visibleChoicesCount = 0;
this.choices = this.settings.choices;
if (this.settings.validWhenSelected === true) {
this.settings.validWhenSelected = 1;
}
this.settings.perGroup = Math.min(this.settings.perGroup, this.choices.length + (this.settings.multiple && this.settings.showSelectAll ? 1 : 0));
this._createElements();
this._attachBindings();
this._constructorEnd();
}
_getValue() {
var ref;
if (!this.settings.multiple) {
return (ref = this._value) != null ? ref.value : void 0;
} else {
return this._value.map(function (choice) {
return choice.value;
});
}
}
_setValue(newValue) {
var i, len, value;
if (!this.settings.multiple || !IS.array(newValue)) {
this.setChoice(newValue);
} else {
for ((i = 0, len = newValue.length); i < len; i++) {
value = newValue[i];
this.setChoice(value);
}
}
}
_createElements() {
var choiceGroups, choices, globalOpts, perGroup;
globalOpts = {
relatedInstance: this
};
this.el = this.template.spawn(this.settings.templates.default, globalOpts);
this.choices = [];
choices = this.settings.choices;
perGroup = this.settings.perGroup;
choiceGroups = Array(Math.ceil(choices.length / perGroup)).fill().map(function (s, index) {
return choices.slice(index * perGroup, index * perGroup + perGroup);
});
choiceGroups.forEach((choices, groupIndex) => {
var groupEl;
groupEl = this.templates.choiceGroup.spawn(this.settings.templates.choiceGroup, globalOpts).appendTo(this.el.child.innerwrap);
return choices.forEach((choice, index) => {
return this.choices.push(new Choice(this, choice, index, groupIndex, groupEl));
});
});
this.el.child.innerwrap.raw._quickField = this;
}
_attachBindings() {
var choice, i, len, ref;
this._attachBindings_elState();
this._attachBindings_stateTriggers();
this._attachBindings_display();
this._attachBindings_value();
ref = this.choices;
for ((i = 0, len = ref.length); i < len; i++) {
choice = ref[i];
choice._attachBindings();
}
}
_attachBindings_elState() {
SimplyBind('visible').of(this.state).to(visible => {
return this.el.state('visible', visible);
});
SimplyBind('hovered').of(this.state).to(hovered => {
return this.el.state('hovered', hovered);
});
SimplyBind('filled').of(this.state).to(filled => {
return this.el.state('filled', filled);
});
SimplyBind('disabled').of(this.state).to(disabled => {
return this.el.state('disabled', disabled);
});
SimplyBind('showLabel').of(this.state).to(showLabel => {
return this.el.state('showLabel', showLabel);
});
SimplyBind('showError').of(this.state).to(showError => {
return this.el.state('showError', showError);
});
SimplyBind('showHelp').of(this.state).to(showHelp => {
return this.el.state('showHelp', showHelp);
});
SimplyBind('valid').of(this.state).to(valid => {
this.el.state('valid', valid);
return this.el.state('invalid', !valid);
});
}
_attachBindings_stateTriggers() {
SimplyBind('event:mouseenter').of(this.el).to(() => {
return this.state.hovered = true;
});
SimplyBind('event:mouseleave').of(this.el).to(() => {
return this.state.hovered = false;
});
}
_attachBindings_display() {
SimplyBind('width').of(this.state).to(width => {
return this.el.style('width', width).state('definedWidth', width !== 'auto');
}).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);
SimplyBind('visibleChoicesCount').of(this).to(count => {
return this.el.state('hasVisibleChoices', !!count);
});
}
_attachBindings_value() {
SimplyBind('_value').of(this).to(selected => {
this.state.filled = !!(selected != null ? selected.length : void 0);
if (this.state.filled) {
this.state.interacted = true;
}
return this.state.valid = this.validate(void 0, true);
});
SimplyBind('array:_value', {
updateOnBind: false
}).of(this).to(() => {
return this.emit('input', this.value);
});
}
_validate(providedValue) {
if (this.settings.multiple) {
if (!IS.array(providedValue)) {
providedValue = [providedValue];
}
if (providedValue.length && !IS.object(providedValue[0])) {
providedValue = providedValue.map(function (choice) {
return choice.value;
});
}
} else {
if (IS.object(providedValue)) {
providedValue = providedValue.value;
}
}
if (IS.number(this.settings.validWhenSelected)) {
if (!((providedValue != null ? providedValue.length : void 0) >= this.settings.validWhenSelected)) {
return false;
}
}
if (this.settings.validWhenIsChoice) {
if (this.settings.multiple) {
if (!helpers.includes(providedValue, this.settings.validWhenIsChoice)) {
return false;
}
} else {
if (providedValue !== this.settings.validWhenIsChoice) {
return false;
}
}
}
return true;
}
findChoice(providedValue, byLabel) {
var matches;
matches = this.choices.filter(function (choice) {
switch (false) {
case !IS.object(providedValue):
return providedValue === choice;
case !byLabel:
return providedValue === choice.label;
default:
return providedValue === choice.value;
}
});
return matches[0];
}
findChoiceAny(providedValue) {
return this.findChoice(providedValue) || this.findChoice(providedValue, true);
}
setChoice(choice) {
if (IS.object(choice) && choice instanceof Choice) {
return choice.toggle();
} else if (choice = this.findChoiceAny(choice)) {
return choice.toggle(true);
}
}
}
;
ChoiceField.prototype.template = templates.default;
ChoiceField.prototype.templates = templates;
ChoiceField.prototype.defaults = defaults;
return ChoiceField;
}).call(this);
Choice = class Choice {
constructor(field, settings, index1, groupIndex, groupEl) {
var globalOpts, iconEl, ref;
this.field = field;
this.settings = settings;
this.index = index1;
globalOpts = {
relatedInstance: this.field
};
({label: this.label, value: this.value, conditions: this.conditions} = this.settings);
if (this.label == null) {
this.label = this.value;
}
if (this.value == null) {
this.value = this.label;
}
this.el = this.field.templates.choice.spawn(this.field.settings.templates.choice, globalOpts).appendTo(groupEl);
if (this.icon) {
iconEl = this.templates.choiceIcon.spawn(this.field.settings.templates.choiceIcon, globalOpts).insertBefore(this.el.child.label);
iconEl.text = this.icon;
}
if (this.el.index == null) {
this.el.index = this.index;
}
this.el.totalIndex = this.index * groupIndex;
this.el.prop('title', this.label);
this.el.child.label.text = this.label;
this.visible = true;
this.selected = false;
this.disabled = this.settings.disabled || false;
this.unavailable = false;
if ((ref = this.conditions) != null ? ref.length : void 0) {
this.unavailable = true;
this.allFields = this.field.allFields;
Condition.init(this, this.conditions, () => {
return this.unavailable = !Condition.validate(this.conditions);
});
}
}
_attachBindings() {
return (() => {
SimplyBind('visible').of(this).to(visible => {
return this.el.state('visible', visible);
}).and.to(visible => {
return this.field.visibleChoicesCount += visible ? 1 : -1;
});
SimplyBind('selected', {
updateOnBind: false
}).of(this).to(selected => {
return this.el.state('selected', selected);
});
SimplyBind('disabled', {
updateOnBind: false
}).of(this).to(disabled => {
return this.el.state('disabled', disabled);
});
SimplyBind('unavailable', {
updateOnBind: false
}).of(this).to(unavailable => {
return this.el.state('unavailable', unavailable);
}).and.to(unavailable => {
if (unavailable) {
return this.toggle(false, true);
}
});
return SimplyBind('event:click').of(this.el).to(() => {
return this.field.value = this;
}).condition(() => {
return !this.disabled;
});
})();
}
toggle(newValue, unavailable) {
var newState, prevState, ref;
prevState = this.selected;
newState = IS.defined(newValue) ? newValue : !this.selected;
if (!newState) {
if (this.field.settings.multiple && prevState) {
this.selected = newState;
return helpers.removeItem(this.field._value, this);
} else {
if (IS.defined(newValue)) {
this.selected = newState;
}
if (unavailable) {
return this.field._value = null;
}
}
} else {
this.selected = newState;
if (this.field.settings.multiple) {
this.field._value.push(this);
} else {
if (this.field._value !== this) {
if ((ref = this.field._value) != null) {
ref.toggle(false);
}
}
this.field._value = this;
}
return this.field.lastSelected = this;
}
}
};
module.exports = ChoiceField;
module.exports.Choice = Choice;
return module.exports;
},
17: function (require, module, exports) {
var ChoiceField, SimplyBind, TrueFalseField, extend, helpers;
extend = require(3);
helpers = require(46);
SimplyBind = require(55);
ChoiceField = require(16);
var templates = require(66);
var defaults = require(67);
TrueFalseField = (function () {
class TrueFalseField extends require(52) {
constructor() {
super(...arguments);
this.lastSelected = null;
this.visibleChoicesCount = 2;
this.choices = this.settings.choices;
this.choices[0].label = this.settings.choiceLabels[0];
this.choices[1].label = this.settings.choiceLabels[1];
this.settings.perGroup = 2;
this._createElements();
this._attachBindings();
this._constructorEnd();
}
_getValue() {
if (this._value === null) {
return null;
} else {
if (this._value.index === 0) {
return true;
} else {
return false;
}
}
}
_setValue(newValue) {
var ref;
if (newValue === this.choices[0]) {
newValue = this.choices[0].value;
}
if (newValue === this.choices[1]) {
newValue = this.choices[1].value;
}
if (newValue === null) {
this._value = null;
if ((ref = this.lastSelected) != null) {
ref.toggle(false);
}
return;
}
if (typeof newValue === 'string') {
newValue = newValue.toLowerCase();
if (newValue === 'false') {
newValue = false;
}
}
return (newValue ? this.choices[0] : this.choices[1]).toggle();
}
_validate(providedValue) {
if (typeof providedValue === 'string') {
providedValue = this.findChoice(providedValue);
}
if (this.settings.validWhenIsChoice) {
if (providedValue) {
if (this.settings.validWhenIsChoice !== providedValue.value) {
return false;
}
} else {
return false;
}
}
if (this.settings.validWhenSelected) {
if (!providedValue) {
return false;
}
}
if (this.settings.validWhenTrue) {
if ((providedValue != null ? providedValue.index : void 0) !== 0) {
return false;
}
}
return true;
}
}
;
TrueFalseField.prototype.template = templates.default;
TrueFalseField.prototype.templates = templates;
TrueFalseField.prototype.defaults = defaults;
return TrueFalseField;
}).call(this);
helpers.inheritProto(TrueFalseField, ChoiceField, ['_createElements', '_attachBindings', '_attachBindings_elState', '_attachBindings_stateTriggers', '_attachBindings_display', '_attachBindings_value']);
module.exports = TrueFalseField;
return module.exports;
},
18: function (require, module, exports) {
var SimplyBind, ToggleField, TrueFalseField, extend, helpers;
extend = require(3);
helpers = require(46);
SimplyBind = require(55);
TrueFalseField = require(17);
var templates = require(68);
var defaults = require(69);
ToggleField = (function () {
class ToggleField extends require(52) {
constructor() {
super(...arguments);
this._value = !!this._value;
this.settings.size = parseFloat(this.settings.size) || defaults.size;
if (this.settings.style !== 'centered' && this.settings.style !== 'aligned') {
this.settings.style = defaults.style;
}
this._createElements();
this._attachBindings();
this._constructorEnd();
}
_getValue() {
return this._value;
}
_setValue(newValue) {
return this._value = !!newValue;
}
_createElements() {
var forceOpts;
forceOpts = {
relatedInstance: this
};
this.el = this.template.spawn(this.settings.templates.default, forceOpts);
this.el.state('alignedStyle', this.settings.style === 'aligned').child.innerwrap.raw._quickField = this;
}
_attachBindings() {
this._attachBindings_elState();
this._attachBindings_stateTriggers();
this._attachBindings_display();
this._attachBindings_value();
}
_attachBindings_value() {
SimplyBind('_value').of(this).to(value => {
return this.el.state('toggled', value);
});
SimplyBind('_value', {
updateOnBind: false
}).of(this).to(value => {
return this.emit('input', value);
});
SimplyBind(`event:${this.settings.triggerEvent}`).of(this.el.child.input).to(() => {
return this.value = !this._value;
});
}
_validate(providedValue) {
if (this.settings.validWhenTrue) {
if (!providedValue) {
return false;
}
}
return true;
}
}
;
ToggleField.prototype.template = templates.default;
ToggleField.prototype.templates = templates;
ToggleField.prototype.defaults = defaults;
return ToggleField;
}).call(this);
helpers.inheritProto(ToggleField, TrueFalseField, ['_attachBindings_elState', '_attachBindings_stateTriggers', '_attachBindings_display']);
module.exports = ToggleField;
return module.exports;
},
19: function (require, module, exports) {
var DOM, GroupField, IS, SimplyBind, extend, helpers;
helpers = require(46);
IS = require(47);
DOM = require(4);
SimplyBind = require(55);
extend = require(3);
var templates = require(70);
var defaults = require(71);
GroupField = (function () {
class GroupField extends require(52) {
constructor() {
super(...arguments);
this._calcFocusState = this._calcFocusState.bind(this);
this._calcBlurState = this._calcBlurState.bind(this);
this._emitSubmit = this.emit.bind(this, 'submit');
this.state.collapsed = this.settings.startCollapsed && this.settings.collapsable;
if (this._value == null) {
this._value = Object.create(null);
}
this.fields = Object.create(null);
this.fieldsArray = [];
this._createElements();
this._attachBindings();
this._constructorEnd();
}
_getValue() {
var field, name, ref, values;
values = Object.create(null);
ref = this.fields;
for (name in ref) {
field = ref[name];
values[name] = field.value;
}
return values;
}
_setValue(newValue) {
var name, value;
if (IS.object(newValue)) {
for (name in newValue) {
value = newValue[name];
if (this.fields[name]) {
this.fields[name].value = value;
}
}
return newValue;
}
}
_recalcDisplay() {
var field, i, len, ref;
ref = this.fieldsArray;
for ((i = 0, len = ref.length); i < len; i++) {
field = ref[i];
if (field._recalcDisplay) {
field._recalcDisplay();
}
}
}
_createElements() {
var config, field, fields, forceOpts, i, len, margin, name, ref, ref1;
forceOpts = {
relatedInstance: this
};
margin = `0 0 ${this.settings.fieldMargin}px 0`;
this.el = this.template.spawn(this.settings.templates.default, forceOpts);
if (this.settings.collapsable) {
this.addAction('collapse', this.templates.collapseIcons);
}
if (IS.array(this.settings.fields)) {
fields = Object.create(null);
ref = this.settings.fields;
for ((i = 0, len = ref.length); i < len; i++) {
field = ref[i];
if (!field.name) {
throw new Error(`field ${this.name || this.ID}:group fields provided in array format must have a name`);
}
fields[field.name] = field;
}
this.settings.fields = fields;
}
ref1 = this.settings.fields;
for (name in ref1) {
field = ref1[name];
config = extend({
margin,
fieldInstances: this.fields
}, field, {
ID: name
});
this.fieldsArray.push(this.fields[name] = this.builder(config).appendTo(this.el.child.innerwrap));
this.fields[name].on('focus', this._calcFocusState).on('blur', this._calcBlurState).on('submit', this._emitSubmit).el.style('verticalAlign', this.settings.fieldAlign).after(' ');
}
this.el.child.innerwrap.append(DOM.div({
style: {
display: 'inline-block',
width: '100%'
}
}));
this.el.state('collapsable', this.settings.collapsable);
this.el.raw._quickField = this.el.childf.innerwrap.raw._quickField = this;
}
_attachBindings() {
this._attachBindings_elState();
this._attachBindings_display();
this._attachBindings_stateTriggers();
this._attachBindings_value();
}
_attachBindings_elState() {
SimplyBind('visible').of(this.state).to(visible => {
return this.el.state('visible', visible);
});
SimplyBind('hovered').of(this.state).to(hovered => {
return this.el.state('hover', hovered);
});
SimplyBind('focused').of(this.state).to(focused => {
return this.el.state('focus', focused);
});
SimplyBind('disabled').of(this.state).to(disabled => {
return this.el.state('disabled', disabled);
});
SimplyBind('showLabel').of(this.state).to(showLabel => {
return this.el.state('showLabel', showLabel);
});
SimplyBind('showError').of(this.state).to(showError => {
return this.el.state('showError', showError);
});
SimplyBind('showHelp').of(this.state).to(showHelp => {
return this.el.state('showHelp', showHelp);
});
SimplyBind('collapsed').of(this.state).to(collapsed => {
return this.el.state('collapsed', collapsed);
});
return SimplyBind('valid').of(this.state).to(valid => {
this.el.state('valid', valid);
return this.el.state('invalid', !valid);
});
}
_attachBindings_display() {
var field, i, len, ref;
SimplyBind('width').of(this.state).to(width => {
return this.el.style('width', width).state('definedWidth', width !== 'auto');
}).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);
ref = this.fieldsArray;
for ((i = 0, len = ref.length); i < len; i++) {
field = ref[i];
SimplyBind('disabled').of(this.state).to('disabled').of(field.state);
}
}
_attachBindings_stateTriggers() {
var toggleCollapse;
if (this.settings.collapsable) {
toggleCollapse = () => {
this.state.collapsed = !this.state.collapsed;
return this.emit('collapsed', this.state.collapsed);
};
SimplyBind('event:click').of(this.el.child.collapse).to(toggleCollapse);
SimplyBind('event:click').of(this.el.child.label).to(toggleCollapse);
SimplyBind('collapsed').of(this.state).once.to(() => {
return this._recalcDisplay();
}).condition(function (collapsed) {
return !collapsed;
});
}
}
_attachBindings_value() {
var field, fieldName, ref;
ref = this.fields;
for (fieldName in ref) {
field = ref[fieldName];
SimplyBind('_value').of(field).to(fieldName).of(this._value);
SimplyBind('_value', {
updateOnBind: false
}).of(field).to(value => {
if (value) {
this.state.interacted = true;
}
this.state.valid = this.validate(void 0, true);
return this.emit('input', this._value);
});
}
}
_validate(providedValue, testUnrequired, report) {
var field, i, isValid, len, ref, someInvalid;
someInvalid = false;
ref = this.fieldsArray;
for ((i = 0, len = ref.length); i < len; i++) {
field = ref[i];
if (!field.state.visible) {
continue;
}
if (report) {
isValid = field.validateAndReport(providedValue[field.name], testUnrequired);
} else {
isValid = field.validate(providedValue[field.name], testUnrequired);
}
if (!isValid) {
someInvalid = true;
}
}
return !someInvalid;
}
_calcFocusState() {
return this.state.focused = this.fieldsArray.some(function (field) {
return field.state.focused;
});
}
_calcBlurState() {
return setTimeout(this._calcFocusState);
}
focus() {
var field, i, len, ref;
this.state.collapsed = false;
ref = this.fieldsArray;
for ((i = 0, len = ref.length); i < len; i++) {
field = ref[i];
if (field.focus) {
return field.focus();
}
}
}
blur() {
var field, i, len, ref;
ref = this.fieldsArray;
for ((i = 0, len = ref.length); i < len; i++) {
field = ref[i];
if (field.blur) {
return field.blur();
}
}
}
addAction(name, icons, callback, prepend) {
var action, i, icon, len;
if (icons && !IS.array(icons)) {
icons = [icons];
}
action = this.templates.action.spawn(this.settings.templates.action, {
relatedInstance: this
});
action.ref = action.options.ref = name;
for ((i = 0, len = icons.length); i < len; i++) {
icon = icons[i];
action.child.icon.append(icon);
}
this.el.child.actions[prepend ? 'prepend' : 'append'](action);
if (callback) {
SimplyBind('event:click').of(action).to(callback);
}
return action;
}
}
;
GroupField.prototype.template = templates.default;
GroupField.prototype.templates = templates;
GroupField.prototype.defaults = defaults;
GroupField.prototype.shallowSettings = ['fields'];
return GroupField;
}).call(this);
module.exports = GroupField;
return module.exports;
},
20: function (require, module, exports) {
var DOM, IS, RepeaterField, SimplyBind, extend, helpers;
helpers = require(46);
IS = require(47);
DOM = require(4);
SimplyBind = require(55);
extend = require(3);
var templates = require(72);
var defaults = require(73);
RepeaterField = (function () {
class RepeaterField extends require(52) {
constructor() {
var base, diff;
super(...arguments);
this._calcFocusState = this._calcFocusState.bind(this);
this._calcBlurState = this._calcBlurState.bind(this);
this._emitSubmit = this.emit.bind(this, 'submit');
this.groupLabel = IS.string(this.settings.numbering) ? this.settings.numbering : 'Item';
this.labelRegex = new RegExp(`^${this.groupLabel} \\d+(?:\: )?`);
if (this._value == null) {
this._value = [];
}
this.settings._groupSettings = extend.notKeys(['inline', 'block']).clone(this.settings.groupSettings);
this.settings.groupSettings = extend.keys(['inline', 'block']).clone(this.settings.groupSettings);
if (this.settings.style === 'block') {
this.settings.autoWidth = true;
}
if (this.settings.field) {
this.settings.singleMode = true;
}
if (this.settings.singleMode) {
this.settings.fields = [this.settings.field || this.settings.fields];
}
if ((base = this.settings).value == null) {
base.value = [];
}
if (this.settings.minItems && this.settings.value.length < this.settings.minItems) {
diff = this.settings.minItems - this.settings.value.length;
while (--diff) {
this.settings.value.push(null);
}
}
this._createElements();
this._attachBindings();
this._constructorEnd();
}
_getValue() {
var group, i, index, len, ref, values;
values = [];
ref = this._value;
for ((index = i = 0, len = ref.length); i < len; index = ++i) {
group = ref[index];
values[index] = group.value;
}
return values;
}
_setValue(newValue) {
var i, index, len, value;
if (!IS.array(newValue)) {
this.addItem(newValue, false, true);
} else {
for ((index = i = 0, len = newValue.length); i < len; index = ++i) {
value = newValue[index];
if (this._value[index] != null) {
this._value[index].value = value;
} else {
this.addItem(value, false, true);
}
}
}
return newValue;
}
_createElements() {
var forceOpts;
forceOpts = {
relatedInstance: this
};
this.el = this.template.spawn(this.settings.templates.default, forceOpts);
this.el.state('collapsable', this.settings.collapsable);
this.el.state(`${this.settings.style}Style`, true);
this.el.raw._quickField = this.el.childf.innerwrap.raw._quickField = this;
}
_attachBindings() {
this._attachBindings_elState();
this._attachBindings_display();
this._attachBindings_stateTriggers();
this._attachBindings_value();
}
_attachBindings_elState() {
SimplyBind('visible').of(this.state).to(visible => {
return this.el.state('visible', visible);
});
SimplyBind('disabled').of(this.state).to(disabled => {
return this.el.state('disabled', disabled);
});
SimplyBind('showLabel').of(this.state).to(showLabel => {
return this.el.state('showLabel', showLabel);
});
SimplyBind('showError').of(this.state).to(showError => {
return this.el.state('showError', showError);
});
SimplyBind('showHelp').of(this.state).to(showHelp => {
return this.el.state('showHelp', showHelp);
});
SimplyBind('collapsed').of(this.state).to(collapsed => {
return this.el.state('collapsed', collapsed);
});
return SimplyBind('valid').of(this.state).to(valid => {
this.el.state('valid', valid);
return this.el.state('invalid', !valid);
});
}
_attachBindings_display() {
var group, i, len, ref;
SimplyBind('width').of(this.state).to(width => {
return this.el.style('width', width).state('definedWidth', width !== 'auto');
}).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);
SimplyBind('showError', {
updateOnBind: false
}).of(this.state).to(showError => {
var group, i, len, ref, results;
ref = this._value;
results = [];
for ((i = 0, len = ref.length); i < len; i++) {
group = ref[i];
results.push(group.state.showError = showError);
}
return results;
});
ref = this._value;
for ((i = 0, len = ref.length); i < len; i++) {
group = ref[i];
SimplyBind('disabled').of(this.state).to('disabled').of(field.state);
}
}
_attachBindings_stateTriggers() {
var toggleCollapse;
if (this.settings.collapsable) {
toggleCollapse = () => {
this.state.collapsed = !this.state.collapsed;
return this.emit('collapsed', this.state.collapsed);
};
SimplyBind('event:click').of(this.el.child.collapse).to(toggleCollapse);
SimplyBind('event:click').of(this.el.child.label).to(toggleCollapse);
SimplyBind('collapsed').of(this.state).once.to(() => {
return this._recalcDisplay();
}).condition(function (collapsed) {
return !collapsed;
});
}
}
_attachBindings_value() {
SimplyBind('array:_value', {
updateOnBind: true
}).of(this).to((value, prevValue) => {
if (value.length) {
this._recalcLabels();
}
if (prevValue) {
this.state.interacted = true;
return this.state.valid = this.validate(void 0, true);
}
});
SimplyBind('event:click').of(this.el.child.addButton).to(() => {
return this.addItem().focus();
});
}
_validate(providedValue, testUnrequired) {
var group, i, isValid, len, ref, someInvalid;
someInvalid = false;
ref = this._value;
for ((i = 0, len = ref.length); i < len; i++) {
group = ref[i];
isValid = group.validate(providedValue[group.name], testUnrequired);
if (!isValid) {
return false;
}
}
return true;
}
_calcFocusState() {
return this.state.focused = this._value.some(function (field) {
return field.state.focused;
});
}
_calcBlurState() {
return setTimeout(this._calcFocusState);
}
focus() {
var ref;
return (ref = this._value[0]) != null ? ref.focus() : void 0;
}
blur() {
var field, i, len, ref;
ref = this._value;
for ((i = 0, len = ref.length); i < len; i++) {
field = ref[i];
if (field.blur) {
field.blur();
}
}
}
_recalcLabels() {
var group, i, index, len, ref;
if (this.settings.style === 'block') {
if (!this.settings.numbering && !this.settings.dynamicLabel) {
return;
}
ref = this._value;
for ((index = i = 0, len = ref.length); i < len; index = ++i) {
group = ref[index];
this._recalcLabel(group, index);
}
}
}
_recalcLabel(group, index) {
var existingLabel, newLabel;
if (this.settings.dynamicLabel && group.fields[this.settings.dynamicLabel]) {
newLabel = group.fields[this.settings.dynamicLabel].value;
} else {
existingLabel = group.state.label || '';
existingLabel = existingLabel.replace(this.labelRegex, '');
newLabel = `${this.groupLabel} ${index + 1}`;
if (existingLabel) {
newLabel += `: ${existingLabel}`;
}
}
return group.state.label = newLabel;
}
_recalcDisplay() {
var group, i, len, ref;
ref = this._value;
for ((i = 0, len = ref.length); i < len; i++) {
group = ref[i];
if (group._recalcDisplay) {
group._recalcDisplay();
}
}
}
addItem(value, skipInsert, skipEmit) {
var firstField, group, margin, refreshChildren, settings;
if (this.settings.maxItems && this._value.length === this.settings.maxItems || this.state.disabled) {
return;
}
margin = this.settings.style === 'inline' ? `0 ${this.settings.groupMargin}px ${this.settings.groupMargin}px 0` : `0 0 ${this.settings.groupMargin}px 0`;
settings = extend({
type: 'group',
fields: this.settings.fields,
margin,
value
}, this.settings._groupSettings, this.settings.groupSettings[this.settings.style]);
if (this.settings.singleMode) {
firstField = this.settings.fields[0].name;
settings.getter = function (fields) {
return fields[firstField];
};
settings.setter = function (value) {
return {
[`${firstField}`]: value
};
};
}
group = this.builder(settings);
group.el.child.actions.append(this.settings.groupSettings[this.settings.style]);
if (this.settings.cloneable) {
group.addAction('clone', this.templates.cloneIcon, this.cloneItem.bind(this, group), this.settings.style === 'block');
}
if (this.settings.removeable) {
group.addAction('remove', this.templates.removeIcon, this.removeItem.bind(this, group), this.settings.style === 'block');
}
group.on('focus', this._calcFocusState);
group.on('blur', this._calcBlurState);
group.on('submit', this._emitSubmit);
SimplyBind('event:input').of(group).to(() => {
return this.emit('input', this._value, group);
});
SimplyBind('disabled').of(this.state).to('disabled').of(group.state);
refreshChildren = group.el.childf;
if (this.settings.dynamicLabel) {
group.on('input', () => {
return this._recalcLabel(group);
});
}
if (this.settings.autoRemoveEmpty) {
group.once('blur', () => {
if (!group.state.interacted) {
return this.removeItem(group);
}
});
}
if (!this.settings.autoWidth) {
group.state.width = this.settings.groupWidth;
group.el.child.innerwrap.once('inserted', function () {
return this.style('width', `calc(100% - ${this.parent.child.actions.width || 17}px)`);
});
}
if (!skipInsert) {
group.insertBefore(this.el.child.addButton);
if (!skipEmit) {
this.emit('itemAdd', group);
}
this._value.push(group);
}
return group;
}
cloneItem(group) {
var clone;
if (this.settings.maxItems && this._value.length === this.settings.maxItems || this.state.disabled) {
return;
}
if (!helpers.includes(this._value, group)) {
return;
}
clone = this.addItem(group.value, true);
clone.insertAfter(group.el);
helpers.insertAfter(this._value, group, clone);
this.emit('itemAdd', clone);
this.emit('itemClone', clone);
return clone;
}
removeItem(group) {
var ref, removed, targetIndex;
if (this.settings.minItems && this._value.length === this.settings.minItems || this.state.disabled) {
return;
}
targetIndex = Math.max(1, this._value.indexOf(group));
if (removed = helpers.removeItem(this._value, group)) {
group.destroy();
this.emit('itemRemove', group);
if ((ref = this._value[targetIndex - 1]) != null) {
ref.focus();
}
}
return !!removed;
}
}
;
RepeaterField.prototype.template = templates.default;
RepeaterField.prototype.templates = templates;
RepeaterField.prototype.defaults = defaults;
RepeaterField.prototype.shallowSettings = ['fields'];
return RepeaterField;
}).call(this);
module.exports = RepeaterField;
return module.exports;
},
21: function (require, module, exports) {
module.exports = ["Kiehn Inc", "Marks and Sons", "Waelchi Schiller and Denesik", "Olson Zemlak and Maggio", "Jacobs - Von", "Auer Lowe and Gutmann", "Feeney Rempel and Cassin", "Sawayn - Marks", "Johns and Sons", "Rodriguez Champlin and Dare", "Lowe - Ritchie", "Gleichner Goldner and Becker", "Jerde - Osinski", "Baumbach Group", "Schroeder Zulauf and Rempel", "O'Reilly Mills and Denesik", "Kohler - Veum", "O'Hara Inc", "Oberbrunner and Sons", "Emmerich Group", "Murray Zieme and Franecki", "Moen - Luettgen", "Gorczany Harvey and Gulgowski", "Reilly - Ruecker", "McDermott - Hyatt", "Spinka - Marks", "Hayes and Sons", "Kilback Kiehn and Monahan", "Davis and Sons", "Hudson - Yundt", "Goodwin - Zemlak", "Beer Kuhlman and Walker", "Jones Carroll and Anderson", "Rutherford Inc", "Predovic White and Collins", "Sporer Baumbach and Crist", "Grimes and Sons", "Kunde and Sons", "Tillman - Bode", "Cronin - Koepp", "Smitham Zieme and Daniel", "Kunze Welch and Russel", "Johns Labadie and Harber", "Lesch - Waters", "Brakus - Smitham", "Bins and Sons", "Nitzsche Inc", "Wunsch Inc", "Schowalter Franecki and Kuphal", "Reynolds - Swaniawski"];
return module.exports;
},
22: function (require, module, exports) {
var Keysim, keyboard;
Keysim = require(74);
keyboard = Keysim.Keyboard.US_ENGLISH;
module.exports = function (target, keys, value) {
if (target.focus) {
target.focus();
}
target.value += value != null ? value || '' : keys;
return keyboard.dispatchEventsForInput(keys, target);
};
return module.exports;
},
23: function (require, module, exports) {
var Keysim, keyboard;
Keysim = require(74);
keyboard = Keysim.Keyboard.US_ENGLISH;
module.exports = function (target, keys) {
return keyboard.dispatchEventsForAction(keys, target);
};
return module.exports;
},
24: function (require, module, exports) {
var DOM, restartSandbox;
DOM = require(4);
module.exports = restartSandbox = function () {
var field, id, ref;
if (window.sandbox) {
ref = quickfield.instances;
for (id in ref) {
field = ref[id];
delete quickfield.instances[id];
}
window.sandbox.remove();
}
return window.sandbox = DOM.div({
id: 'sandbox',
style: {
border: '1px solid',
padding: '20px',
boxSizing: 'border-box'
}
}).appendTo(document.body);
};
return module.exports;
},
25: function (require, module, exports) {
var DOM;
DOM = require(4);
module.exports = function (title, margin = 20) {
return DOM.div({
ref: 'testTitle',
style: {
marginTop: margin,
marginBottom: margin,
fontSize: 16,
fontWeight: 600,
fontFamily: 'system-ui, sans-serif'
}
}, title).appendTo(sandbox);
};
return module.exports;
},
26: function (require, module, exports) {
var DOM;
DOM = require(4);
module.exports = function () {
var margin;
margin = arguments[0];
if (isNaN(margin)) {
margin = 20;
}
return DOM.div({
ref: 'testTitle',
style: {
marginTop: margin,
marginBottom: margin
}
}).appendTo(sandbox);
};
return module.exports;
},
27: function (require, module, exports) {
module.exports = function (el) {
return {
top: el.style('borderTopWidth'),
bottom: el.style('borderBottomWidth'),
left: el.style('borderLeftWidth'),
right: el.style('borderRightWidth')
};
};
return module.exports;
},
28: function (require, module, exports) {
'use strict';
const pFinally = require(75);
class TimeoutError extends Error {
constructor(message) {
super(message);
this.name = 'TimeoutError';
}
}
module.exports = (promise, ms, fallback) => new Promise((resolve, reject) => {
if (typeof ms !== 'number' && ms >= 0) {
throw new TypeError('Expected `ms` to be a positive number');
}
const timer = setTimeout(() => {
if (typeof fallback === 'function') {
resolve(fallback());
return;
}
const message = typeof fallback === 'string' ? fallback : `Promise timed out after ${ms} milliseconds`;
const err = fallback instanceof Error ? fallback : new TimeoutError(message);
reject(err);
}, ms);
pFinally(promise.then(resolve, reject), () => {
clearTimeout(timer);
});
});
module.exports.TimeoutError = TimeoutError;
return module.exports;
},
29: function (require, module, exports) {
var extend, isArray, isObject, shouldDeepExtend;
isArray = function (target) {
return Array.isArray(target);
};
isObject = function (target) {
return target && Object.prototype.toString.call(target) === '[object Object]' || isArray(target);
};
shouldDeepExtend = function (options, target, parentKey) {
if (options.deep) {
if (options.notDeep) {
return !options.notDeep[target];
} else {
return true;
}
} else if (options.deepOnly) {
return options.deepOnly[target] || parentKey && shouldDeepExtend(options, parentKey);
}
};
module.exports = extend = function (options, target, sources, parentKey) {
var i, key, len, source, sourceValue, subTarget, targetValue;
if (!target || typeof target !== 'object' && typeof target !== 'function') {
target = {};
}
for ((i = 0, len = sources.length); i < len; i++) {
source = sources[i];
if (source != null) {
for (key in source) {
sourceValue = source[key];
targetValue = target[key];
if (sourceValue === target || sourceValue === void 0 || (sourceValue === null && !options.allowNull && !options.nullDeletes) || (options.keys && !options.keys[key]) || (options.notKeys && options.notKeys[key]) || (options.own && !source.hasOwnProperty(key)) || (options.globalFilter && !options.globalFilter(sourceValue, key, source)) || (options.filters && options.filters[key] && !options.filters[key](sourceValue, key, source))) {
continue;
}
if (sourceValue === null && options.nullDeletes) {
delete target[key];
continue;
}
if (options.globalTransform) {
sourceValue = options.globalTransform(sourceValue, key, source);
}
if (options.transforms && options.transforms[key]) {
sourceValue = options.transforms[key](sourceValue, key, source);
}
switch (false) {
case !(options.concat && isArray(sourceValue) && isArray(targetValue)):
target[key] = targetValue.concat(sourceValue);
break;
case !(shouldDeepExtend(options, key, parentKey) && isObject(sourceValue)):
subTarget = isObject(targetValue) ? targetValue : isArray(sourceValue) ? [] : {};
target[key] = extend(options, subTarget, [sourceValue], key);
break;
default:
target[key] = sourceValue;
}
}
}
}
return target;
};
return module.exports;
},
31: function (require, module, exports) {
var quickcss;
var helpers = require(76);
var __constants4 = require(77);
quickcss = function (targetEl, property, value, important) {
var computedStyle, i, len, subEl, subProperty, subValue;
switch (false) {
case !helpers.isIterable(targetEl):
for ((i = 0, len = targetEl.length); i < len; i++) {
subEl = targetEl[i];
quickcss(subEl, property, value);
}
break;
case typeof property !== 'object':
for (subProperty in property) {
subValue = property[subProperty];
quickcss(targetEl, subProperty, subValue);
}
break;
default:
property = helpers.normalizeProperty(property);
if (typeof value === 'undefined') {
computedStyle = targetEl._computedStyle || (targetEl._computedStyle = getComputedStyle(targetEl));
return computedStyle[property];
} else if (property) {
targetEl.style.setProperty(property, helpers.normalizeValue(property, value), important ? __constants4.IMPORTANT : void 0);
}
}
};
quickcss.animation = function (name, frames) {
var frame, generated, prefix, rules;
if (name && typeof name === 'string' && frames && typeof frames === 'object') {
prefix = helpers.getPrefix('animation');
generated = '';
for (frame in frames) {
rules = frames[frame];
generated += `${frame} {${helpers.ruleToString(rules)}}`;
}
generated = `@${prefix}keyframes ${name} {${generated}}`;
return helpers.inlineStyle(generated, true, 0);
}
};
quickcss.register = function (rule, level, important) {
var className, ref, style;
if (rule && typeof rule === 'object') {
level || (level = 0);
rule = helpers.ruleToString(rule, important);
if (!(className = (ref = helpers.inlineStyleConfig[level]) != null ? ref[rule] : void 0)) {
className = helpers.hash(rule);
style = `.${className} {${rule}}`;
helpers.inlineStyle(style, className, level);
}
return className;
}
};
quickcss.clearRegistered = function (level) {
return helpers.clearInlineStyle(level || 0);
};
quickcss.UNSET = (function () {
switch (false) {
case !helpers.isValueSupported('display', 'unset'):
return 'unset';
case !helpers.isValueSupported('display', 'initial'):
return 'initial';
case !helpers.isValueSupported('display', 'inherit'):
return 'inherit';
}
})();
quickcss.supports = helpers.isValueSupported;
quickcss.supportsProperty = helpers.isPropSupported;
quickcss.normalizeProperty = helpers.normalizeProperty;
quickcss.normalizeValue = helpers.normalizeValue;
quickcss.version = "1.4.1";
module.exports = quickcss;
return module.exports;
},
42: function (require, module, exports) {
var used = [];
exports.version = '4.1.2';
exports.AssertionError = require(92);
var util = require(93);
exports.use = function (fn) {
if (!~used.indexOf(fn)) {
fn(exports, util);
used.push(fn);
}
return exports;
};
exports.util = util;
var config = require(94);
exports.config = config;
var assertion = require(95);
exports.use(assertion);
var core = require(96);
exports.use(core);
var expect = require(97);
exports.use(expect);
var should = require(98);
exports.use(should);
var assert = require(99);
exports.use(assert);
return module.exports;
},
43: function (require, module, exports) {
'use strict';
var type = require(100);
function FakeMap() {
this.clear();
}
FakeMap.prototype = {
clear: function clearMap() {
this.keys = [];
this.values = [];
return this;
},
set: function setMap(key, value) {
var index = this.keys.indexOf(key);
if (index >= 0) {
this.values[index] = value;
} else {
this.keys.push(key);
this.values.push(value);
}
return this;
},
get: function getMap(key) {
return this.values[this.keys.indexOf(key)];
},
delete: function deleteMap(key) {
var index = this.keys.indexOf(key);
if (index >= 0) {
this.values = this.values.slice(0, index).concat(this.values.slice(index + 1));
this.keys = this.keys.slice(0, index).concat(this.keys.slice(index + 1));
}
return this;
}
};
var MemoizeMap = null;
if (typeof WeakMap === 'function') {
MemoizeMap = WeakMap;
} else {
MemoizeMap = FakeMap;
}
function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
return null;
}
var leftHandMap = memoizeMap.get(leftHandOperand);
if (leftHandMap) {
var result = leftHandMap.get(rightHandOperand);
if (typeof result === 'boolean') {
return result;
}
}
return null;
}
function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
return;
}
var leftHandMap = memoizeMap.get(leftHandOperand);
if (leftHandMap) {
leftHandMap.set(rightHandOperand, result);
} else {
leftHandMap = new MemoizeMap();
leftHandMap.set(rightHandOperand, result);
memoizeMap.set(leftHandOperand, leftHandMap);
}
}
module.exports = deepEqual;
module.exports.MemoizeMap = MemoizeMap;
function deepEqual(leftHandOperand, rightHandOperand, options) {
if (options && options.comparator) {
return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
}
var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
if (simpleResult !== null) {
return simpleResult;
}
return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
}
function simpleEqual(leftHandOperand, rightHandOperand) {
if (leftHandOperand === rightHandOperand) {
return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
}
if (leftHandOperand !== leftHandOperand && rightHandOperand !== rightHandOperand) {
return true;
}
if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
return false;
}
return null;
}
function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
options = options || ({});
options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
var comparator = options && options.comparator;
var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
if (memoizeResultLeft !== null) {
return memoizeResultLeft;
}
var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
if (memoizeResultRight !== null) {
return memoizeResultRight;
}
if (comparator) {
var comparatorResult = comparator(leftHandOperand, rightHandOperand);
if (comparatorResult === false || comparatorResult === true) {
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
return comparatorResult;
}
var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
if (simpleResult !== null) {
return simpleResult;
}
}
var leftHandType = type(leftHandOperand);
if (leftHandType !== type(rightHandOperand)) {
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
return false;
}
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
return result;
}
function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
switch (leftHandType) {
case 'String':
case 'Number':
case 'Boolean':
case 'Date':
return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
case 'Promise':
case 'Symbol':
case 'function':
case 'WeakMap':
case 'WeakSet':
case 'Error':
return leftHandOperand === rightHandOperand;
case 'Arguments':
case 'Int8Array':
case 'Uint8Array':
case 'Uint8ClampedArray':
case 'Int16Array':
case 'Uint16Array':
case 'Int32Array':
case 'Uint32Array':
case 'Float32Array':
case 'Float64Array':
case 'Array':
return iterableEqual(leftHandOperand, rightHandOperand, options);
case 'RegExp':
return regexpEqual(leftHandOperand, rightHandOperand);
case 'Generator':
return generatorEqual(leftHandOperand, rightHandOperand, options);
case 'DataView':
return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
case 'ArrayBuffer':
return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
case 'Set':
return entriesEqual(leftHandOperand, rightHandOperand, options);
case 'Map':
return entriesEqual(leftHandOperand, rightHandOperand, options);
default:
return objectEqual(leftHandOperand, rightHandOperand, options);
}
}
function regexpEqual(leftHandOperand, rightHandOperand) {
return leftHandOperand.toString() === rightHandOperand.toString();
}
function entriesEqual(leftHandOperand, rightHandOperand, options) {
if (leftHandOperand.size !== rightHandOperand.size) {
return false;
}
if (leftHandOperand.size === 0) {
return true;
}
var leftHandItems = [];
var rightHandItems = [];
leftHandOperand.forEach(function gatherEntries(key, value) {
leftHandItems.push([key, value]);
});
rightHandOperand.forEach(function gatherEntries(key, value) {
rightHandItems.push([key, value]);
});
return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
}
function iterableEqual(leftHandOperand, rightHandOperand, options) {
var length = leftHandOperand.length;
if (length !== rightHandOperand.length) {
return false;
}
if (length === 0) {
return true;
}
var index = -1;
while (++index < length) {
if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
return false;
}
}
return true;
}
function generatorEqual(leftHandOperand, rightHandOperand, options) {
return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
}
function hasIteratorFunction(target) {
return typeof Symbol !== 'undefined' && typeof target === 'object' && typeof Symbol.iterator !== 'undefined' && typeof target[Symbol.iterator] === 'function';
}
function getIteratorEntries(target) {
if (hasIteratorFunction(target)) {
try {
return getGeneratorEntries(target[Symbol.iterator]());
} catch (iteratorError) {
return [];
}
}
return [];
}
function getGeneratorEntries(generator) {
var generatorResult = generator.next();
var accumulator = [generatorResult.value];
while (generatorResult.done === false) {
generatorResult = generator.next();
accumulator.push(generatorResult.value);
}
return accumulator;
}
function getEnumerableKeys(target) {
var keys = [];
for (var key in target) {
keys.push(key);
}
return keys;
}
function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
var length = keys.length;
if (length === 0) {
return true;
}
for (var i = 0; i < length; i += 1) {
if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
return false;
}
}
return true;
}
function objectEqual(leftHandOperand, rightHandOperand, options) {
var leftHandKeys = getEnumerableKeys(leftHandOperand);
var rightHandKeys = getEnumerableKeys(rightHandOperand);
if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
leftHandKeys.sort();
rightHandKeys.sort();
if (iterableEqual(leftHandKeys, rightHandKeys) === false) {
return false;
}
return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
}
var leftHandEntries = getIteratorEntries(leftHandOperand);
var rightHandEntries = getIteratorEntries(rightHandOperand);
if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
leftHandEntries.sort();
rightHandEntries.sort();
return iterableEqual(leftHandEntries, rightHandEntries, options);
}
if (leftHandKeys.length === 0 && leftHandEntries.length === 0 && rightHandKeys.length === 0 && rightHandEntries.length === 0) {
return true;
}
return false;
}
function isPrimitive(value) {
return value === null || typeof value !== 'object';
}
return module.exports;
},
44: function (require, module, exports) {
'use strict';
var promiseExists = typeof Promise === 'function';
var globalObject = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : self;
var isDom = ('location' in globalObject) && ('document' in globalObject);
var symbolExists = typeof Symbol !== 'undefined';
var mapExists = typeof Map !== 'undefined';
var setExists = typeof Set !== 'undefined';
var weakMapExists = typeof WeakMap !== 'undefined';
var weakSetExists = typeof WeakSet !== 'undefined';
var dataViewExists = typeof DataView !== 'undefined';
var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';
var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(('')[Symbol.iterator]());
var toStringLeftSliceLength = 8;
var toStringRightSliceLength = -1;
module.exports = function typeDetect(obj) {
var typeofObj = typeof obj;
if (typeofObj !== 'object') {
return typeofObj;
}
if (obj === null) {
return 'null';
}
if (obj === globalObject) {
return 'global';
}
if (Array.isArray(obj) && (symbolToStringTagExists === false || !((Symbol.toStringTag in obj)))) {
return 'Array';
}
if (isDom) {
if (obj === globalObject.location) {
return 'Location';
}
if (obj === globalObject.document) {
return 'Document';
}
if (obj === (globalObject.navigator || ({})).mimeTypes) {
return 'MimeTypeArray';
}
if (obj === (globalObject.navigator || ({})).plugins) {
return 'PluginArray';
}
if (obj instanceof HTMLElement && obj.tagName === 'BLOCKQUOTE') {
return 'HTMLQuoteElement';
}
if (obj instanceof HTMLElement && obj.tagName === 'TD') {
return 'HTMLTableDataCellElement';
}
if (obj instanceof HTMLElement && obj.tagName === 'TH') {
return 'HTMLTableHeaderCellElement';
}
}
var stringTag = (symbolToStringTagExists && obj[Symbol.toStringTag]);
if (typeof stringTag === 'string') {
return stringTag;
}
var objPrototype = Object.getPrototypeOf(obj);
if (objPrototype === RegExp.prototype) {
return 'RegExp';
}
if (objPrototype === Date.prototype) {
return 'Date';
}
if (promiseExists && objPrototype === Promise.prototype) {
return 'Promise';
}
if (setExists && objPrototype === Set.prototype) {
return 'Set';
}
if (mapExists && objPrototype === Map.prototype) {
return 'Map';
}
if (weakSetExists && objPrototype === WeakSet.prototype) {
return 'WeakSet';
}
if (weakMapExists && objPrototype === WeakMap.prototype) {
return 'WeakMap';
}
if (dataViewExists && objPrototype === DataView.prototype) {
return 'DataView';
}
if (mapExists && objPrototype === mapIteratorPrototype) {
return 'Map Iterator';
}
if (setExists && objPrototype === setIteratorPrototype) {
return 'Set Iterator';
}
if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
return 'Array Iterator';
}
if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
return 'String Iterator';
}
if (objPrototype === null) {
return 'Object';
}
return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);
};
module.exports.typeDetect = module.exports;
return module.exports;
},
45: function (require, module, exports) {
((function (globals) {
'use strict';
var strings, messages, predicates, functions, assert, not, maybe, collections, slice, neginf, posinf, isArray, haveSymbols;
strings = {
v: 'value',
n: 'number',
s: 'string',
b: 'boolean',
o: 'object',
t: 'type',
a: 'array',
al: 'array-like',
i: 'iterable',
d: 'date',
f: 'function',
l: 'length'
};
messages = {};
predicates = {};
[{
n: 'equal',
f: equal,
s: 'v'
}, {
n: 'undefined',
f: isUndefined,
s: 'v'
}, {
n: 'null',
f: isNull,
s: 'v'
}, {
n: 'assigned',
f: assigned,
s: 'v'
}, {
n: 'primitive',
f: primitive,
s: 'v'
}, {
n: 'includes',
f: includes,
s: 'v'
}, {
n: 'zero',
f: zero
}, {
n: 'infinity',
f: infinity
}, {
n: 'number',
f: number
}, {
n: 'integer',
f: integer
}, {
n: 'even',
f: even
}, {
n: 'odd',
f: odd
}, {
n: 'greater',
f: greater
}, {
n: 'less',
f: less
}, {
n: 'between',
f: between
}, {
n: 'greaterOrEqual',
f: greaterOrEqual
}, {
n: 'lessOrEqual',
f: lessOrEqual
}, {
n: 'inRange',
f: inRange
}, {
n: 'positive',
f: positive
}, {
n: 'negative',
f: negative
}, {
n: 'string',
f: string,
s: 's'
}, {
n: 'emptyString',
f: emptyString,
s: 's'
}, {
n: 'nonEmptyString',
f: nonEmptyString,
s: 's'
}, {
n: 'contains',
f: contains,
s: 's'
}, {
n: 'match',
f: match,
s: 's'
}, {
n: 'boolean',
f: boolean,
s: 'b'
}, {
n: 'object',
f: object,
s: 'o'
}, {
n: 'emptyObject',
f: emptyObject,
s: 'o'
}, {
n: 'nonEmptyObject',
f: nonEmptyObject,
s: 'o'
}, {
n: 'instanceStrict',
f: instanceStrict,
s: 't'
}, {
n: 'instance',
f: instance,
s: 't'
}, {
n: 'like',
f: like,
s: 't'
}, {
n: 'array',
f: array,
s: 'a'
}, {
n: 'emptyArray',
f: emptyArray,
s: 'a'
}, {
n: 'nonEmptyArray',
f: nonEmptyArray,
s: 'a'
}, {
n: 'arrayLike',
f: arrayLike,
s: 'al'
}, {
n: 'iterable',
f: iterable,
s: 'i'
}, {
n: 'date',
f: date,
s: 'd'
}, {
n: 'function',
f: isFunction,
s: 'f'
}, {
n: 'hasLength',
f: hasLength,
s: 'l'
}].map(function (data) {
var n = data.n;
messages[n] = 'Invalid ' + strings[data.s || 'n'];
predicates[n] = data.f;
});
functions = {
apply: apply,
map: map,
all: all,
any: any
};
collections = ['array', 'arrayLike', 'iterable', 'object'];
slice = Array.prototype.slice;
neginf = Number.NEGATIVE_INFINITY;
posinf = Number.POSITIVE_INFINITY;
isArray = Array.isArray;
haveSymbols = typeof Symbol === 'function';
functions = mixin(functions, predicates);
assert = createModifiedPredicates(assertModifier, assertImpl);
not = createModifiedPredicates(notModifier, notImpl);
maybe = createModifiedPredicates(maybeModifier, maybeImpl);
assert.not = createModifiedModifier(assertModifier, not);
assert.maybe = createModifiedModifier(assertModifier, maybe);
collections.forEach(createOfPredicates);
createOfModifiers(assert, assertModifier);
createOfModifiers(not, notModifier);
collections.forEach(createMaybeOfModifiers);
exportFunctions(mixin(functions, {
assert: assert,
not: not,
maybe: maybe
}));
function equal(lhs, rhs) {
return lhs === rhs;
}
function isUndefined(data) {
return data === undefined;
}
function isNull(data) {
return data === null;
}
function assigned(data) {
return data !== undefined && data !== null;
}
function primitive(data) {
var type;
switch (data) {
case null:
case undefined:
case false:
case true:
return true;
}
type = typeof data;
return type === 'string' || type === 'number' || (haveSymbols && type === 'symbol');
}
function zero(data) {
return data === 0;
}
function infinity(data) {
return data === neginf || data === posinf;
}
function number(data) {
return typeof data === 'number' && data > neginf && data < posinf;
}
function integer(data) {
return typeof data === 'number' && data % 1 === 0;
}
function even(data) {
return typeof data === 'number' && data % 2 === 0;
}
function odd(data) {
return integer(data) && data % 2 !== 0;
}
function greater(lhs, rhs) {
return number(lhs) && lhs > rhs;
}
function less(lhs, rhs) {
return number(lhs) && lhs < rhs;
}
function between(data, x, y) {
if (x < y) {
return greater(data, x) && data < y;
}
return less(data, x) && data > y;
}
function greaterOrEqual(lhs, rhs) {
return number(lhs) && lhs >= rhs;
}
function lessOrEqual(lhs, rhs) {
return number(lhs) && lhs <= rhs;
}
function inRange(data, x, y) {
if (x < y) {
return greaterOrEqual(data, x) && data <= y;
}
return lessOrEqual(data, x) && data >= y;
}
function positive(data) {
return greater(data, 0);
}
function negative(data) {
return less(data, 0);
}
function string(data) {
return typeof data === 'string';
}
function emptyString(data) {
return data === '';
}
function nonEmptyString(data) {
return string(data) && data !== '';
}
function contains(data, substring) {
return string(data) && data.indexOf(substring) !== -1;
}
function match(data, regex) {
return string(data) && !!data.match(regex);
}
function boolean(data) {
return data === false || data === true;
}
function object(data) {
return Object.prototype.toString.call(data) === '[object Object]';
}
function emptyObject(data) {
return object(data) && Object.keys(data).length === 0;
}
function nonEmptyObject(data) {
return object(data) && Object.keys(data).length > 0;
}
function instanceStrict(data, prototype) {
try {
return data instanceof prototype;
} catch (error) {
return false;
}
}
function instance(data, prototype) {
try {
return instanceStrict(data, prototype) || data.constructor.name === prototype.name || Object.prototype.toString.call(data) === '[object ' + prototype.name + ']';
} catch (error) {
return false;
}
}
function like(data, archetype) {
var name;
for (name in archetype) {
if (archetype.hasOwnProperty(name)) {
if (data.hasOwnProperty(name) === false || typeof data[name] !== typeof archetype[name]) {
return false;
}
if (object(data[name]) && like(data[name], archetype[name]) === false) {
return false;
}
}
}
return true;
}
function array(data) {
return isArray(data);
}
function emptyArray(data) {
return array(data) && data.length === 0;
}
function nonEmptyArray(data) {
return array(data) && greater(data.length, 0);
}
function arrayLike(data) {
return assigned(data) && greaterOrEqual(data.length, 0);
}
function iterable(data) {
if (!haveSymbols) {
return arrayLike(data);
}
return assigned(data) && isFunction(data[Symbol.iterator]);
}
function includes(data, value) {
var iterator, iteration, keys, length, i;
if (!assigned(data)) {
return false;
}
if (haveSymbols && data[Symbol.iterator] && isFunction(data.values)) {
iterator = data.values();
do {
iteration = iterator.next();
if (iteration.value === value) {
return true;
}
} while (!iteration.done);
return false;
}
keys = Object.keys(data);
length = keys.length;
for (i = 0; i < length; ++i) {
if (data[keys[i]] === value) {
return true;
}
}
return false;
}
function hasLength(data, length) {
return assigned(data) && data.length === length;
}
function date(data) {
return instanceStrict(data, Date) && integer(data.getTime());
}
function isFunction(data) {
return typeof data === 'function';
}
function apply(data, predicates) {
assert.array(data);
if (isFunction(predicates)) {
return data.map(function (value) {
return predicates(value);
});
}
assert.array(predicates);
assert.hasLength(data, predicates.length);
return data.map(function (value, index) {
return predicates[index](value);
});
}
function map(data, predicates) {
assert.object(data);
if (isFunction(predicates)) {
return mapSimple(data, predicates);
}
assert.object(predicates);
return mapComplex(data, predicates);
}
function mapSimple(data, predicate) {
var result = {};
Object.keys(data).forEach(function (key) {
result[key] = predicate(data[key]);
});
return result;
}
function mapComplex(data, predicates) {
var result = {};
Object.keys(predicates).forEach(function (key) {
var predicate = predicates[key];
if (isFunction(predicate)) {
if (not.assigned(data)) {
result[key] = !!predicate.m;
} else {
result[key] = predicate(data[key]);
}
} else if (object(predicate)) {
result[key] = mapComplex(data[key], predicate);
}
});
return result;
}
function all(data) {
if (array(data)) {
return testArray(data, false);
}
assert.object(data);
return testObject(data, false);
}
function testArray(data, result) {
var i;
for (i = 0; i < data.length; i += 1) {
if (data[i] === result) {
return result;
}
}
return !result;
}
function testObject(data, result) {
var key, value;
for (key in data) {
if (data.hasOwnProperty(key)) {
value = data[key];
if (object(value) && testObject(value, result) === result) {
return result;
}
if (value === result) {
return result;
}
}
}
return !result;
}
function any(data) {
if (array(data)) {
return testArray(data, true);
}
assert.object(data);
return testObject(data, true);
}
function mixin(target, source) {
Object.keys(source).forEach(function (key) {
target[key] = source[key];
});
return target;
}
function assertModifier(predicate, defaultMessage) {
return function () {
return assertPredicate(predicate, arguments, defaultMessage);
};
}
function assertPredicate(predicate, args, defaultMessage) {
var argCount = predicate.l || predicate.length;
var message = args[argCount];
var ErrorType = args[argCount + 1];
assertImpl(predicate.apply(null, args), nonEmptyString(message) ? message : defaultMessage, isFunction(ErrorType) ? ErrorType : TypeError);
return args[0];
}
function assertImpl(value, message, ErrorType) {
if (value) {
return value;
}
throw new (ErrorType || Error)(message || 'Assertion failed');
}
function notModifier(predicate) {
var modifiedPredicate = function () {
return notImpl(predicate.apply(null, arguments));
};
modifiedPredicate.l = predicate.length;
return modifiedPredicate;
}
function notImpl(value) {
return !value;
}
function maybeModifier(predicate) {
var modifiedPredicate = function () {
if (not.assigned(arguments[0])) {
return true;
}
return predicate.apply(null, arguments);
};
modifiedPredicate.l = predicate.length;
modifiedPredicate.m = true;
return modifiedPredicate;
}
function maybeImpl(value) {
if (assigned(value) === false) {
return true;
}
return value;
}
function ofModifier(target, type, predicate) {
var modifiedPredicate = function () {
var collection, args;
collection = arguments[0];
if (target === 'maybe' && not.assigned(collection)) {
return true;
}
if (!type(collection)) {
return false;
}
collection = coerceCollection(type, collection);
args = slice.call(arguments, 1);
try {
collection.forEach(function (item) {
if ((target !== 'maybe' || assigned(item)) && !predicate.apply(null, [item].concat(args))) {
throw 0;
}
});
} catch (ignore) {
return false;
}
return true;
};
modifiedPredicate.l = predicate.length;
return modifiedPredicate;
}
function coerceCollection(type, collection) {
switch (type) {
case arrayLike:
return slice.call(collection);
case object:
return Object.keys(collection).map(function (key) {
return collection[key];
});
default:
return collection;
}
}
function createModifiedPredicates(modifier, object) {
return createModifiedFunctions([modifier, predicates, object]);
}
function createModifiedFunctions(args) {
var modifier, object, functions, result;
modifier = args.shift();
object = args.pop();
functions = args.pop();
result = object || ({});
Object.keys(functions).forEach(function (key) {
Object.defineProperty(result, key, {
configurable: false,
enumerable: true,
writable: false,
value: modifier.apply(null, args.concat(functions[key], messages[key]))
});
});
return result;
}
function createModifiedModifier(modifier, modified) {
return createModifiedFunctions([modifier, modified, null]);
}
function createOfPredicates(key) {
predicates[key].of = createModifiedFunctions([ofModifier.bind(null, null), predicates[key], predicates, null]);
}
function createOfModifiers(base, modifier) {
collections.forEach(function (key) {
base[key].of = createModifiedModifier(modifier, predicates[key].of);
});
}
function createMaybeOfModifiers(key) {
maybe[key].of = createModifiedFunctions([ofModifier.bind(null, 'maybe'), predicates[key], predicates, null]);
assert.maybe[key].of = createModifiedModifier(assertModifier, maybe[key].of);
assert.not[key].of = createModifiedModifier(assertModifier, not[key].of);
}
function exportFunctions(functions) {
if (typeof define === 'function' && define.amd) {
define(function () {
return functions;
});
} else if (typeof module !== 'undefined' && module !== null && module.exports) {
module.exports = functions;
} else {
globals.check = functions;
}
}
})(this));
return module.exports;
},
46: function (require, module, exports) {
var DOM, IS, SimplyBind, helpers, regex;
IS = require(47);
DOM = require(4);
SimplyBind = require(55);
regex = require(101);
helpers = exports;
helpers.noop = function () {};
helpers.includes = function (target, item) {
return target && target.indexOf(item) !== -1;
};
helpers.repeat = function (string, count) {
var i;
return ((function () {
var j, ref, results1;
results1 = [];
for ((i = j = 1, ref = count); (1 <= ref ? j <= ref : j >= ref); i = 1 <= ref ? ++j : --j) {
results1.push(string);
}
return results1;
})()).join('');
};
helpers.removeItem = function (target, item) {
var itemIndex;
itemIndex = target.indexOf(item);
if (itemIndex !== -1) {
return target.splice(itemIndex, 1);
}
};
helpers.insertAfter = function (target, item, newItem) {
var itemIndex;
itemIndex = target.indexOf(item);
if (itemIndex !== -1) {
return target.splice(itemIndex, 0, newItem);
}
};
helpers.find = function (target, fn) {
var results;
results = target.filter(fn);
return results[0];
};
helpers.diff = function (source, comparee) {
var compareeVal, i, maxLen, result, sourceVal;
result = [];
maxLen = Math.max(source.length, comparee.length);
i = -1;
while (++i < maxLen) {
sourceVal = source[i];
compareeVal = comparee[i];
if (sourceVal !== compareeVal) {
if (IS.defined(sourceVal) && !helpers.includes(comparee, sourceVal)) {
result.push(sourceVal);
}
if (IS.defined(compareeVal) && !helpers.includes(source, compareeVal)) {
result.push(compareeVal);
}
}
}
return result;
};
helpers.hexToRGBA = function (hex, alpha) {
var B, G, R;
if (hex[0] === '#') {
hex = hex.slice(1);
}
R = parseInt(hex.slice(0, 2), 16);
G = parseInt(hex.slice(2, 4), 16);
B = parseInt(hex.slice(4, 6), 16);
return `rgba(${R}, ${G}, ${B}, ${alpha})`;
};
helpers.defaultColor = function (color, defaultColor) {
if (color === 'transparent' || !color) {
return defaultColor;
} else {
return color;
}
};
helpers.calcPadding = function (desiredHeight, fontSize) {
return Math.ceil((desiredHeight - fontSize * 1.231) / 2);
};
helpers.unlockScroll = function (excludedEl) {
window._isLocked = false;
return DOM(window).off('wheel.lock');
};
helpers.lockScroll = function (excludedEl) {
if (!window._isLocked) {
window._isLocked = true;
return DOM(window).on('wheel.lock', function (event) {
if (event.target === excludedEl.raw || DOM(event.target).parentMatching(function (parent) {
return parent === excludedEl;
})) {
if (event.wheelDelta > 0 && excludedEl.raw.scrollTop === 0) {
return event.preventDefault();
}
if (event.wheelDelta < 0 && excludedEl.raw.scrollHeight - excludedEl.raw.scrollTop === excludedEl.raw.clientHeight) {
return event.preventDefault();
}
} else {
return event.preventDefault();
}
});
}
};
helpers.fuzzyMatch = function (needle, haystack, caseSensitive) {
var hI, hLength, matchedCount, nI, nLength, needleChar;
nLength = needle.length;
hLength = haystack.length;
if (!caseSensitive) {
needle = needle.toUpperCase();
haystack = haystack.toUpperCase();
}
if (nLength > hLength) {
return false;
}
if (nLength === hLength) {
return needle === haystack;
}
nI = hI = matchedCount = 0;
while (nI < nLength) {
needleChar = needle[nI++];
while (hI < hLength) {
if (haystack[hI++] === needleChar) {
matchedCount++;
break;
}
}
}
return matchedCount === nLength;
};
helpers.startsWith = function (needle, haystack, caseSensitive) {
var i;
if (!caseSensitive) {
needle = needle.toUpperCase();
haystack = haystack.toUpperCase();
}
if (needle.length > haystack.length) {
return false;
}
if (needle.length === haystack.length) {
return needle === haystack;
}
i = -1;
while (needle[++i]) {
if (needle[i] !== haystack[i]) {
return false;
}
}
return true;
};
helpers.getIndexOfFirstDiff = function (sourceString, compareString) {
var currentPos, maxLength;
currentPos = 0;
maxLength = Math.max(sourceString.length, compareString.length);
while (currentPos < maxLength) {
if (sourceString[currentPos] !== compareString[currentPos]) {
return currentPos;
}
currentPos++;
}
return null;
};
helpers.parseCssShorthandValue = function (string) {
var result, values;
values = string.split(regex.whiteSpace).map(parseFloat);
result = {};
switch (values.length) {
case 1:
result.top = result.right = result.bottom = result.left = values[0];
break;
case 2:
result.top = result.bottom = values[0];
result.right = result.left = values[1];
break;
case 3:
result.top = values[0];
result.right = result.left = values[1];
result.bottom = values[2];
break;
case 4:
result.top = values[0];
result.right = values[1];
result.bottom = values[2];
result.left = values[3];
}
return result;
};
helpers.shorthandSideValue = function (value, side) {
var values;
switch (typeof value) {
case 'number':
return value;
case 'string':
values = helpers.parseCssShorthandValue(value);
return values[side];
default:
return 0;
}
};
helpers.updateShorthandValue = function (value, side, newValue) {
var values;
values = helpers.parseCssShorthandValue('' + (value || 0));
switch (side) {
case 'top':
values.top += newValue;
break;
case 'right':
values.right += newValue;
break;
case 'bottom':
values.bottom += newValue;
break;
case 'left':
values.left += newValue;
break;
default:
Object.keys(values).forEach(function (side) {
return values[side] += newValue;
});
}
return `${values.top}px ${values.right}px ${values.bottom}px ${values.left}px`;
};
helpers.inheritProto = function (child, parent, keys) {
var j, key, len, ref;
ref = Object.getOwnPropertyNames(parent.prototype);
for ((j = 0, len = ref.length); j < len; j++) {
key = ref[j];
if (keys && !keys.includes(key)) {
continue;
}
if (!child.prototype[key]) {
child.prototype[key] = parent.prototype[key];
}
}
return child;
};
return module.exports;
},
47: function (require, module, exports) {
var IS;
IS = require(79);
IS = IS.create('natives', 'dom');
IS.load({
field: function (target) {
return target && target instanceof require(52);
},
regex: function (target) {
return target instanceof RegExp;
},
objectable: function (target) {
return IS.object(target) || IS.function(target);
}
});
module.exports = IS;
return module.exports;
},
48: function (require, module, exports) {
var CSS;
CSS = require(31);
module.exports = function () {
CSS.animation('checkmarkAnimateSuccessTip', {
'0%, 54%': {
width: 0,
left: 0,
top: 3
},
'70%': {
width: 14,
left: -2,
top: 8
},
'84%': {
width: 5,
left: 5,
top: 10
},
'100%': {
width: 8,
left: 3,
top: 10
}
});
CSS.animation('checkmarkAnimateSuccessLong', {
'0%, 65%': {
width: 0,
right: 12,
top: 12
},
'84%': {
width: 14,
right: 0,
top: 7
},
'100%': {
width: 12,
right: 2,
top: 8
}
});
CSS.animation('checkmarkAnimateError', {
'0%, 65%': {
transform: 'scale(0.4)',
opacity: 0
},
'84%': {
transform: 'scale(1.15)'
},
'100%': {
transform: 'scale(1)'
}
});
CSS.animation('checkmarkRotatePlaceholder', {
'0%, 5%': {
transform: 'rotate(-45deg)'
},
'12%, 100%': {
transform: 'rotate(-405deg)'
}
});
CSS.animation('fieldErrorShake', {
'0%, 50%': {
transform: 'translateX(-10px)'
},
'25%, 75%': {
transform: 'translateX(10px)'
},
'100%': {
transform: 'translateX(0px)'
}
});
return module.exports = function () {};
};
return module.exports;
},
49: function (require, module, exports) {
module.exports = ['_getValue', '_setValue', '_validate'];
return module.exports;
},
52: function (require, module, exports) {
var Condition, Field, IS, SimplyBind, currentID, extend, fastdom, helpers;
helpers = require(46);
IS = require(47);
extend = require(3);
fastdom = require(102);
SimplyBind = require(55);
Condition = require(63);
currentID = 0;
Field = (function () {
class Field {
constructor(settings, builder, settingOverrides, templateOverrides) {
var ref, shallowSettings, transformSettings;
this.builder = builder;
if (settingOverrides) {
if (settingOverrides.globalDefaults) {
this.globalDefaults = settingOverrides.globalDefaults;
}
if (settingOverrides[settings.type]) {
this.defaults = settingOverrides[settings.type];
}
}
if (templateOverrides && templateOverrides[settings.type]) {
this.templates = templateOverrides[settings.type];
this.template = templateOverrides[settings.type].default;
}
shallowSettings = this.shallowSettings ? Field.shallowSettings.concat(this.shallowSettings) : Field.shallowSettings;
transformSettings = this.transformSettings ? Field.transformSettings.concat(this.transformSettings) : Field.transformSettings;
this.settings = extend.deep.clone.notDeep(shallowSettings).transform(transformSettings)(this.globalDefaults, this.defaults, settings);
this.ID = this.settings.ID || currentID++ + '';
this.type = settings.type;
this.name = settings.name;
this.allFields = this.settings.fieldInstances || Field.instances;
this._value = null;
this._eventCallbacks = {};
this.state = {
valid: true,
visible: true,
focused: false,
hovered: false,
filled: false,
interacted: false,
isMobile: false,
disabled: this.settings.disabled,
margin: this.settings.margin,
padding: this.settings.padding,
width: this.settings.width,
showLabel: this.settings.label,
label: this.settings.label,
showHelp: this.settings.help,
help: this.settings.help,
showError: false,
error: this.settings.error
};
if (IS.defined(this.settings.placeholder)) {
this.state.placeholder = this.settings.placeholder;
}
if (IS.number(this.settings.width) && this.settings.width <= 1) {
this.state.width = `${this.settings.width * 100}%`;
}
if ((ref = this.settings.conditions) != null ? ref.length : void 0) {
this.state.visible = false;
Condition.init(this, this.settings.conditions);
}
if (this.allFields[this.ID]) {
if (typeof console !== "undefined" && console !== null) {
console.warn(`Duplicate field IDs found: '${this.ID}'`);
}
}
this.allFields[this.ID] = this;
}
_constructorEnd() {
var base, handler, ref, target;
this.el.childf;
if (this.settings.ID) {
this.el.raw.id = this.ID;
}
if (this.settings.value != null) {
if ((base = this.settings).defaultValue == null) {
base.defaultValue = this.settings.value;
}
}
if (this.settings.defaultValue != null) {
this.value = this.settings.multiple ? [].concat(this.settings.defaultValue) : this.settings.defaultValue;
}
SimplyBind('showError', {
updateOnBind: false
}).of(this.state).to('help').of(this.state).transform(show => {
if (show && this.state.error && IS.string(this.state.error)) {
return this.state.error;
} else {
return this.settings.help || this.state.help;
}
});
SimplyBind('error', {
updateOnBind: false
}).of(this.state).to('help').of(this.state).condition(error => {
return error && this.state.showError;
});
SimplyBind('help').of(this.state).to('html').of(this.el.child.help).and.to('showHelp').of(this.state);
SimplyBind('label').of(this.state).to('text').of(this.el.child.label).and.to('showLabel').of(this.state);
SimplyBind('margin').of(this.state).to(this.el.style.bind(this.el, 'margin'));
SimplyBind('padding').of(this.state).to(this.el.style.bind(this.el, 'padding'));
SimplyBind('showHelp').of(this.state).to((show, prevShow) => {
var changeAmount;
if (this.settings.makeRoomForHelp) {
changeAmount = !!show === !!prevShow ? 0 : show ? 25 : prevShow ? -25 : void 0;
if (changeAmount) {
return this.state.margin = helpers.updateShorthandValue(this.state.margin, 'bottom', changeAmount);
}
}
});
SimplyBind('focused', {
updateOnBind: false
}).of(this.state).to(focused => {
return this.emit(focused ? 'focus' : 'blur');
});
if (this.settings.mobileWidth) {
SimplyBind(() => {
return fastdom.measure(() => {
return this.state.isMobile = window.innerWidth <= this.settings.mobileThreshold;
});
}).updateOn('event:resize').of(window);
}
if (IS.object(this.settings.events)) {
ref = this.settings.events;
for (target in ref) {
handler = ref[target];
this.on(target, handler);
}
}
this.emit('created', this);
return this.el.raw._quickField = this;
}
_formatWidth(width) {
width = this.state.isMobile ? this.settings.mobileWidth || width : width;
if (this.settings.distance && width !== '100%') {
width = `calc(${width} - ${this.settings.distance}px)`;
}
return width;
}
appendTo(target) {
this.el.appendTo(target);
return this;
}
prependTo(target) {
this.el.prependTo(target);
return this;
}
insertAfter(target) {
this.el.insertAfter(target);
return this;
}
insertBefore(target) {
this.el.insertBefore(target);
return this;
}
detach(target) {
this.el.detach(target);
return this;
}
remove() {
this.el.remove();
return this.destroy(false);
}
destroy(removeFromDOM = true) {
var child, i, len, ref;
SimplyBind.unBindAll(this);
SimplyBind.unBindAll(this.state);
SimplyBind.unBindAll(this.el);
ref = this.el.child;
for ((i = 0, len = ref.length); i < len; i++) {
child = ref[i];
SimplyBind.unBindAll(child);
}
if (removeFromDOM) {
this.el.remove();
}
if (this._destroy) {
this._destroy();
}
delete this.allFields[this.ID];
return true;
}
on(eventNames, callback, useCapture) {
this.el.on.call(this.el, eventNames, callback, useCapture, true);
return this;
}
once(eventNames, callback, useCapture) {
return this.on(eventNames, () => {
this.off(eventNames, callback);
return callback.apply(this.el, arguments);
}, useCapture);
}
off() {
this.el.off.apply(this.el, arguments);
return this;
}
emit() {
this.el.emitPrivate.apply(this.el, arguments);
return this;
}
validate(providedValue = this[this.coreValueProp], testUnrequired, report) {
var isValid;
isValid = (function () {
switch (false) {
case !this.settings.validator:
return this.settings.validator(providedValue);
case !(!this.settings.required && !testUnrequired):
return true;
case this._validate(providedValue, testUnrequired, report) !== false:
return false;
case !this.settings.required:
switch (false) {
case !this.settings.multiple:
return !!(providedValue != null ? providedValue.length : void 0);
case typeof providedValue !== 'string':
return !!providedValue;
default:
return providedValue != null;
}
break;
default:
return true;
}
}).call(this);
if (isValid && this.settings.clearErrorOnValid) {
this.state.showError = false;
}
return isValid;
}
validateConditions(conditions) {
var passedConditions, toggleVisibility;
if (conditions) {
toggleVisibility = false;
} else {
conditions = this.conditions;
toggleVisibility = true;
}
passedConditions = Condition.validate(conditions);
if (toggleVisibility) {
return this.state.visible = passedConditions;
} else {
return passedConditions;
}
}
validateAndReport(providedValue, testUnrequired) {
var isValid;
isValid = this.validate(providedValue, testUnrequired, true);
this.state.showError = !isValid;
return isValid;
}
}
;
Field.instances = Object.create(null);
Field.shallowSettings = ['templates', 'fieldInstances', 'value', 'defaultValue'];
Field.transformSettings = ({
  'conditions': function(conditions) {
    var results, target, value;
    if (IS.objectPlain(conditions)) {
      results = [];
      for (target in conditions) {
        value = conditions[target];
        results.push({target, value});
      }
      return results;
    } else if (IS.array(conditions)) {
      return conditions.map(function(item) {
        if (IS.string(item)) {
          return {
            target: item
          };
        } else {
          return item;
        }
      });
    }
  },
  'choices': function(choices) {
    var label, results, value;
    if (IS.objectPlain(choices)) {
      results = [];
      for (label in choices) {
        value = choices[label];
        results.push({label, value});
      }
      return results;
    } else if (IS.array(choices)) {
      return choices.map(function(item) {
        if (!IS.objectPlain(item)) {
          return {
            label: item,
            value: item
          };
        } else {
          return item;
        }
      });
    }
  },
  'validWhenRegex': function(regex) {
    if (IS.string(regex)) {
      return new RegExp(regex);
    } else {
      return regex;
    }
  }
});

;
Field.prototype.coreValueProp = '_value';
Field.prototype.globalDefaults = require(104);
Object.defineProperties(Field.prototype, {
'removeListener': {
get: function () {
return this.off;
}
},
'els': {
get: function () {
return this.el.child;
}
},
'valueRaw': {
get: function () {
return this._value;
}
},
'value': {
get: function () {
if (this.settings.getter) {
return this.settings.getter(this._getValue());
} else {
return this._getValue();
}
},
set: function (value) {
return this._setValue(this.settings.setter ? this.settings.setter(value) : value);
}
}
});
return Field;
}).call(this);
module.exports = Field;
return module.exports;
},
53: function (require, module, exports) {
var DOM, Dropdown, IS, KEYCODES, Mask, REGEX, SimplyBind, TextField, extend, helpers;
Dropdown = require(54);
Mask = require(105);
REGEX = require(101);
KEYCODES = require(58);
helpers = require(46);
IS = require(47);
DOM = require(4);
extend = require(3);
SimplyBind = require(55);
var templates = require(106);
var defaults = require(107);
TextField = (function () {
class TextField extends require(52) {
constructor() {
super(...arguments);
if (this._value == null) {
this._value = '';
}
this.state.typing = false;
this.cursor = {
prev: 0,
current: 0
};
if (!this.settings.validWhenRegex) {
if (this.settings.keyboard === 'email' && this.settings.required) {
this.settings.validWhenRegex = REGEX.email;
} else if (this.settings.mask === 'NAME' || this.settings.mask.pattern === 'NAME') {
this.settings.validWhenRegex = /^[a-zA-Z]{2}/;
} else if (this.settings.mask === 'FULLNAME' || this.settings.mask.pattern === 'FULLNAME') {
this.settings.validWhenRegex = /^[a-zA-Z]+\s+[a-zA-Z]+/;
}
}
if (!this.settings.mask.pattern) {
if (IS.string(this.settings.mask)) {
this.settings.mask = extend.deep.clone(this.defaults.mask, {
pattern: this.settings.mask
});
} else if (IS.object(this.settings.mask)) {
this.settings.mask.pattern = (function () {
switch (this.settings.keyboard) {
case 'date':
return 'DATE';
case 'number':
return 'NUMBER';
case 'phone':
case 'tel':
return 'PHONE';
case 'email':
return 'EMAIL';
}
}).call(this);
}
}
if (this.settings.mask.pattern) {
this.mask = new Mask(this, this.settings.mask);
}
this._createElements();
this._attachBindings();
this._constructorEnd();
}
_getValue() {
if (this.dropdown && this.selected && this._value === this.selected.label) {
return this.selected.value;
} else {
return this._value;
}
}
_setValue(newValue) {
if (IS.string(newValue) || IS.number(newValue)) {
newValue = String(newValue);
return this._value = this.mask ? this.mask.setValue(newValue) : newValue;
}
}
_recalcDisplay() {
if (this.settings.autoWidth) {
return this._value = this._value;
}
}
_createElements() {
var globalOpts;
globalOpts = {
relatedInstance: this
};
this.el = this.template.spawn(this.settings.templates.default, globalOpts);
if (this.settings.choices) {
this.dropdown = new Dropdown(this.settings.choices, this);
this.dropdown.appendTo(this.el.child.innerwrap);
}
if (this.settings.icon) {
this.templates.icon.spawn(this.settings.templates.icon, globalOpts).append(this.settings.icon).insertBefore(this.el.child.input);
}
if (this.settings.checkmark) {
this.templates.checkmark.spawn(this.settings.templates.checkmark, globalOpts).insertAfter(this.el.child.input);
}
this.el.child.input.prop('type', (function () {
switch (this.settings.keyboard) {
case 'number':
case 'tel':
case 'phone':
return 'tel';
case 'password':
return 'password';
case 'url':
return 'url';
default:
return 'text';
}
}).call(this));
this.el.state('hasLabel', this.settings.label);
this.el.child.innerwrap.raw._quickField = this.el.child.input.raw._quickField = this;
return this.el.childf;
}
_attachBindings() {
this._attachBindings_elState();
this._attachBindings_display();
this._attachBindings_display_autoWidth();
this._attachBindings_value();
this._attachBindings_autocomplete();
this._attachBindings_stateTriggers();
}
_attachBindings_elState() {
SimplyBind('visible').of(this.state).to(visible => {
return this.el.state('visible', visible);
});
SimplyBind('hovered').of(this.state).to(hovered => {
return this.el.state('hover', hovered);
});
SimplyBind('focused').of(this.state).to(focused => {
return this.el.state('focus', focused);
});
SimplyBind('filled').of(this.state).to(filled => {
return this.el.state('filled', filled);
});
SimplyBind('disabled').of(this.state).to(disabled => {
return this.el.state('disabled', disabled);
});
SimplyBind('showLabel').of(this.state).to(showLabel => {
return this.el.state('showLabel', showLabel);
});
SimplyBind('showError').of(this.state).to(showError => {
return this.el.state('showError', showError);
});
SimplyBind('showHelp').of(this.state).to(showHelp => {
return this.el.state('showHelp', showHelp);
});
SimplyBind('valid').of(this.state).to(valid => {
this.el.state('valid', valid);
return this.el.state('invalid', !valid);
});
}
_attachBindings_display() {
SimplyBind('placeholder').of(this.state).to('text').of(this.el.child.placeholder).transform(placeholder => {
switch (false) {
case !(placeholder === true && this.settings.label):
return this.settings.label;
case !IS.string(placeholder):
return placeholder;
default:
return '';
}
});
SimplyBind('disabled', {
updateOnBind: this.state.disabled
}).of(this.state).to((disabled, prev) => {
if (this.settings.checkmark) {
if (disabled || (!disabled && (prev != null))) {
return setTimeout(() => {
this.el.child.checkmark_mask1.recalcStyle();
this.el.child.checkmark_mask2.recalcStyle();
return this.el.child.checkmark_patch.recalcStyle();
});
}
}
});
}
_attachBindings_display_autoWidth() {
SimplyBind('width', {
updateEvenIfSame: true
}).of(this.state).to(width => {
return (this.settings.autoWidth ? this.el.child.input : this.el).style('width', width);
}).transform(this._formatWidth.bind(this)).updateOn('isMobile').of(this.state);
if (this.settings.autoWidth) {
SimplyBind('_value', {
updateEvenIfSame: true,
updateOnBind: false
}).of(this).to('width').of(this.state).transform(() => {
return `${this._getInputAutoWidth()}px`;
}).updateOn('event:inserted').of(this.el).updateOn('visible').of(this.state);
}
}
_attachBindings_value() {
var input, resetInput;
input = this.el.child.input.raw;
resetInput = () => {
var filled;
filled = !this.mask.isEmpty();
if (!filled) {
this.selection(this.mask.cursor = 0);
this._value = '';
this.state.filled = false;
}
return filled;
};
SimplyBind('event:input').of(input).to(() => {
this.value = input.value;
if (this.mask) {
this.selection(this.mask.cursor);
}
return this.emit('input', this.value);
});
SimplyBind('_value', {
updateEvenIfSame: !!this.mask
}).of(this).to('value').of(input).and.to(value => {
var filled;
filled = !!value;
if (filled && this.mask && this.mask.guide && (!this.state.focused || this.mask.cursor === 0)) {
filled = resetInput();
}
this.state.filled = filled;
if (filled) {
this.state.interacted = true;
}
this.state.valid = this.validate(void 0, true);
if (!this.state.focused) {
return this.emit('input', this.value);
}
});
SimplyBind('event:keydown').of(this.el.child.input).to(event => {
if (event.keyCode === KEYCODES.enter) {
this.emit('submit');
}
return this.emit(`key-${event.keyCode}`);
});
if (this.mask && this.mask.guide) {
SimplyBind('event:blur').of(this.el.child.input).to(resetInput);
}
}
_attachBindings_autocomplete() {
if (this.dropdown) {
SimplyBind.defaultOptions.updateOnBind = false;
SimplyBind('typing', {
updateEvenIfSame: true
}).of(this.state).to(isTyping => {
if (isTyping) {
if (!this._value) {
return;
}
if (this.dropdown.isOpen) {
return this.dropdown.list.calcDisplay();
} else {
this.dropdown.isOpen = true;
return SimplyBind('event:click').of(document).once.to(() => {
return this.dropdown.isOpen = false;
}).condition(event => {
return !DOM(event.target).parentMatching(parent => {
return parent === this.el.child.innerwrap;
});
});
}
} else {
return this.dropdown.isOpen = false;
}
});
SimplyBind('_value').of(this).to(value => {
var choice, i, len, ref, shouldBeVisible;
ref = this.dropdown.choices;
for ((i = 0, len = ref.length); i < len; i++) {
choice = ref[i];
shouldBeVisible = !value ? true : helpers.fuzzyMatch(value, choice.label);
if (choice.visible !== shouldBeVisible) {
choice.visible = shouldBeVisible;
}
}
if (this.dropdown.isOpen && !value) {
this.dropdown.isOpen = false;
}
});
this.dropdown.onSelected(selectedChoice => {
this.selected = selectedChoice;
this.value = selectedChoice.label;
this.dropdown.isOpen = false;
return this.selection(this.el.child.input.raw.value.length);
});
SimplyBind.defaultOptions.updateOnBind = true;
}
}
_attachBindings_stateTriggers() {
SimplyBind('event:mouseenter').of(this.el.child.input).to(() => {
return this.state.hovered = true;
});
SimplyBind('event:mouseleave').of(this.el.child.input).to(() => {
return this.state.hovered = false;
});
SimplyBind('event:focus').of(this.el.child.input).to(() => {
this.state.focused = true;
if (this.state.disabled) {
return this.blur();
}
});
SimplyBind('event:blur').of(this.el.child.input).to(() => {
return this.state.typing = this.state.focused = false;
});
SimplyBind('event:input').of(this.el.child.input).to(() => {
return this.state.typing = true;
});
SimplyBind('event:keydown').of(this.el.child.input).to(() => {
return this.cursor.prev = this.selection().end;
});
}
_scheduleCursorReset() {
var currentCursor, diffIndex, newCursor;
diffIndex = helpers.getIndexOfFirstDiff(this.mask.value, this.mask.prev.value);
currentCursor = this.cursor.current;
newCursor = this.mask.normalizeCursorPos(currentCursor, this.cursor.prev);
if (newCursor !== currentCursor) {
this.selection(newCursor);
}
}
_setValueIfNotSet() {
if (this.el.child.input.raw.value !== this._value) {
this.el.child.input.raw.value = this._value;
}
}
_getInputAutoWidth() {
var inputWidth, labelWidth;
if (this._value) {
this._setValueIfNotSet();
this.el.child.input.style('width', 0);
this.el.child.input.raw.scrollLeft = 1e+10;
inputWidth = Math.max(this.el.child.input.raw.scrollLeft + this.el.child.input.raw.offsetWidth, this.el.child.input.raw.scrollWidth) + 2;
labelWidth = this.settings.label && this.el.child.label.styleSafe('position') === 'absolute' ? this.el.child.label.rect.width : 0;
} else {
inputWidth = this.el.child.placeholder.rect.width;
labelWidth = 0;
}
return Math.min(this._getWidthSetting('max'), Math.max(this._getWidthSetting('min'), inputWidth, labelWidth));
}
_getWidthSetting(target) {
var parent, parentWidth, result;
if (target === 'min' || target === 'max') {
target += 'Width';
}
if (typeof this.settings[target] === 'number') {
result = this.settings[target];
} else if (typeof this.settings[target] === 'string') {
result = parseFloat(this.settings[target]);
if (helpers.includes(this.settings[target], '%')) {
if ((parent = this.el.parent) && parent.style('display') === 'block') {
parentWidth = parent.styleParsed('width') - parent.styleParsed('paddingLeft') - parent.styleParsed('paddingRight') - 2;
result = parentWidth * (result / 100);
} else {
result = 0;
}
}
}
return result || (target === 'minWidth' ? 0 : 2e308);
}
_validate(providedValue) {
var matchingChoice, ref;
if (this.settings.validWhenRegex && IS.regex(this.settings.validWhenRegex)) {
if (!this.settings.validWhenRegex.test(providedValue)) {
return false;
}
}
if (this.settings.validWhenIsChoice && ((ref = this.settings.choices) != null ? ref.length : void 0)) {
matchingChoice = this.settings.choices.filter(function (choice) {
return choice.value === providedValue;
});
if (!matchingChoice.length) {
return false;
}
}
if (this.settings.minLength) {
if (providedValue.length < this.settings.minLength) {
return false;
}
}
if (this.settings.maxLength) {
if (providedValue.length >= this.settings.maxLength) {
return false;
}
}
if (this.mask) {
if (!this.mask.validate(providedValue)) {
return false;
}
}
return true;
}
selection(arg) {
var end, start;
if (IS.object(arg)) {
start = arg.start;
end = arg.end;
} else {
start = arg;
end = arguments[1];
}
if (start != null) {
if (!end || end < start) {
end = start;
}
this.el.child.input.raw.setSelectionRange(start, end);
} else {
return {
'start': this.el.child.input.raw.selectionStart,
'end': this.el.child.input.raw.selectionEnd
};
}
}
focus() {
return this.el.child.input.raw.focus();
}
blur() {
return this.el.child.input.raw.blur();
}
}
;
TextField.prototype.template = templates.default;
TextField.prototype.templates = templates;
TextField.prototype.defaults = defaults;
return TextField;
}).call(this);
module.exports = TextField;
return module.exports;
},
54: function (require, module, exports) {
var Choice, Condition, DOM, Dropdown, IS, KEYCODES, List, SimplyBind, extend, globalDefaults, helpers;
IS = require(47);
SimplyBind = require(55);
KEYCODES = require(58);
helpers = require(46);
Condition = require(63);
extend = require(3);
DOM = require(4);
globalDefaults = require(104);
var template = require(108);
var defaults = require(109);
Dropdown = (function () {
class Dropdown {
constructor(initialChoices, field) {
this.initialChoices = initialChoices;
this.field = field;
this.isOpen = false;
this.typeBuffer = '';
this.settings = extend.deep.clone.filter(this._settingFilters)(globalDefaults, this.defaults, this.field.settings.dropdown);
this.selected = this.settings.multiple ? [] : null;
this.lastSelected = null;
this.choices = [];
this.currentHighlighted = null;
this.visibleChoicesCount = 0;
this.visibleChoices = [];
this.els = {};
this._selectedCallback = helpers.noop;
this._createElements();
this._attachBindings();
return this;
}
_createElements() {
var choice, globalOpts, i, len, ref;
globalOpts = {
relatedInstance: this
};
this.els.container = this.template.default.spawn(this.settings.templates.default, extend({
passStateToChildren: false
}, globalOpts));
this.els.list = this.template.list.spawn(this.settings.templates.list, globalOpts).appendTo(this.els.container);
this.els.help = this.template.help.spawn(this.settings.templates.help, globalOpts).appendTo(this.els.container);
this.els.scrollIndicatorUp = this.template.scrollIndicatorUp.spawn(this.settings.templates.scrollIndicatorUp, globalOpts).appendTo(this.els.container);
this.els.scrollIndicatorDown = this.template.scrollIndicatorDown.spawn(this.settings.templates.scrollIndicatorDown, globalOpts).appendTo(this.els.container);
this.list = new List(this);
ref = this.initialChoices;
for ((i = 0, len = ref.length); i < len; i++) {
choice = ref[i];
this.addChoice(choice);
}
}
_attachBindings() {
this._attachBindings_elState();
this._attachBindings_display();
return this._attachBindings_scrollIndicators();
}
_attachBindings_elState() {
SimplyBind('help').of(this.settings).to('text').of(this.els.help).and.to(showHelp => {
return this.els.help.state('showHelp', showHelp);
});
SimplyBind('visibleChoicesCount').of(this).to(count => {
return this.els.container.state('hasVisibleChoices', !!count);
});
return SimplyBind('currentHighlighted').of(this).to((current, prev) => {
if (prev) {
prev.el.state('hover', false);
}
if (current) {
return current.el.state('hover', true);
}
});
}
_attachBindings_display() {
SimplyBind('isOpen', {
updateOnBind: false
}).of(this).to(isOpen => {
this.els.container.state('isOpen', isOpen);
if (!isOpen) {
this.currentHighlighted = null;
}
if (this.settings.lockScroll) {
if (isOpen) {
helpers.lockScroll(this.els.list);
} else {
helpers.unlockScroll();
}
}
if (isOpen) {
this.list.appendChoices();
this.list.calcDisplay();
if (this.selected && !this.settings.multiple) {
return this.list.scrollToChoice(this.selected);
}
} else {
return this.list.setTranslate(0);
}
});
SimplyBind('lastSelected', {
updateOnBind: false,
updateEvenIfSame: true
}).of(this).to((newChoice, prevChoice) => {
return this._selectedCallback(newChoice, prevChoice);
});
SimplyBind('focused', {
updateOnBind: false
}).of(this.field.state).to(focused => {
if (!focused) {
return this.field.el.child.input.off('keydown.dropdownNav');
} else {
return this.field.el.child.input.on('keydown.dropdownNav', event => {
if (this.isOpen) {
switch (event.keyCode) {
case KEYCODES.up:
event.preventDefault();
return this.highlightPrev();
case KEYCODES.down:
event.preventDefault();
return this.highlightNext();
case KEYCODES.enter:
event.preventDefault();
if (this.currentHighlighted) {
return this.lastSelected = this.currentHighlighted;
}
break;
case KEYCODES.esc:
event.preventDefault();
return this.isOpen = false;
}
}
});
}
});
if (!this.settings.typeBuffer) {
return;
}
SimplyBind('focused', {
updateOnBind: false
}).of(this.field.state).to(focused => {
if (!focused) {
return DOM(document).off('keypress.dropdownTypeBuffer');
} else {
return DOM(document).on('keypress.dropdownTypeBuffer', event => {
if (this.isOpen) {
event.preventDefault();
if (!KEYCODES.anyPrintable(event.keyCode)) {
return;
}
return this.typeBuffer += event.key;
}
});
}
});
return SimplyBind('typeBuffer', {
updateOnBind: false
}).of(this).to(() => {
clearTimeout(this.typeBufferTimeout);
return this.typeBufferTimeout = setTimeout(() => {
return this.typeBuffer = '';
}, 1500);
}).and.to(buffer => {
var choice, i, len, ref;
if (buffer) {
ref = this.visibleChoices;
for ((i = 0, len = ref.length); i < len; i++) {
choice = ref[i];
if (helpers.startsWith(buffer, choice.label)) {
this.currentHighlighted = choice;
if (!this.list.choiceInView(choice)) {
this.list.scrollToChoice(choice);
}
return;
}
}
}
});
}
_attachBindings_scrollIndicators() {
SimplyBind('scrollTop', {
updateEvenIfSame: true
}).of(this.els.list.raw).to(scrollTop => {
var showBottomIndicator, showTopIndicator;
showTopIndicator = scrollTop > 0;
showBottomIndicator = this.els.list.raw.scrollHeight - this.els.list.raw.clientHeight > scrollTop;
this.els.scrollIndicatorUp.state('visible', showTopIndicator);
return this.els.scrollIndicatorDown.state('visible', showBottomIndicator);
}).condition(() => {
return this.isOpen && !this.settings.help && this.els.list.raw.scrollHeight !== this.els.list.raw.clientHeight && this.els.list.raw.clientHeight >= 100;
}).updateOn('event:scroll').of(this.els.list.raw).updateOn('isOpen').of(this);
this.els.scrollIndicatorUp.on('mouseenter', () => {
return this.list.startScrolling('up');
});
this.els.scrollIndicatorUp.on('mouseleave', () => {
return this.list.stopScrolling();
});
this.els.scrollIndicatorDown.on('mouseenter', () => {
return this.list.startScrolling('down');
});
return this.els.scrollIndicatorDown.on('mouseleave', () => {
return this.list.stopScrolling();
});
}
addChoice(config) {
var i, item, len, newChoice;
if (IS.array(config)) {
for ((i = 0, len = config.length); i < len; i++) {
item = config[i];
this.addChoice(item);
}
return;
} else if (IS.string(config)) {
config = {
label: config,
value: config
};
} else if (IS.objectPlain(config)) {
if (config.value == null) {
config.value = config.label;
}
if (config.label == null) {
config.label = config.value;
}
} else {
return;
}
newChoice = new Choice(this, config, this.list, this.choices.length);
if (this.list.appendedChoices) {
newChoice.init();
}
this.choices.push(newChoice);
return newChoice;
}
removeChoice(choice) {
var i, item, len;
if (IS.array(choice)) {
for ((i = 0, len = choice.length); i < len; i++) {
item = choice[i];
this.removeChoice(item);
}
return;
} else {
choice = this.findChoiceAny(choice);
}
if (!choice) {
return;
}
return choice.remove();
}
replaceChoices(newChoices) {
this.removeChoice(this.choices.slice());
this.addChoice(newChoices);
}
appendTo(target) {
return this.els.container.appendTo(target);
}
onSelected(callback) {
return this._selectedCallback = callback;
}
findChoice(providedValue, byLabel) {
var matches;
matches = this.choices.filter(function (choice) {
switch (false) {
case !IS.object(providedValue):
return providedValue === choice;
case !byLabel:
return providedValue === choice.label;
default:
return providedValue === choice.value;
}
});
return matches[0];
}
findChoiceAny(providedValue) {
return this.findChoice(providedValue) || this.findChoice(providedValue, true);
}
highlightPrev() {
var choice, currentIndex;
currentIndex = this.visibleChoices.indexOf(this.currentHighlighted);
if (currentIndex > 0) {
this.currentHighlighted = choice = this.visibleChoices[currentIndex - 1];
if (!this.list.choiceInView(choice)) {
return this.list.scrollUp(choice);
}
} else {
this.currentHighlighted = choice = this.visibleChoices[this.visibleChoices.length - 1];
if (!this.list.choiceInView(choice)) {
return this.list.scrollToChoice(choice, 1);
}
}
}
highlightNext() {
var choice, currentIndex;
currentIndex = this.visibleChoices.indexOf(this.currentHighlighted);
if (currentIndex < this.visibleChoices.length - 1) {
this.currentHighlighted = choice = this.visibleChoices[currentIndex + 1];
if (!this.list.choiceInView(choice)) {
return this.list.scrollDown(choice);
}
} else {
this.currentHighlighted = choice = this.visibleChoices[0];
if (!this.list.choiceInView(choice)) {
return this.list.scrollToChoice(choice, 1);
}
}
}
}
;
Dropdown.prototype.template = template;
Dropdown.prototype.defaults = defaults;
Dropdown.prototype._settingFilters = {
maxHeight: function (value) {
return IS.number(value);
}
};
return Dropdown;
}).call(this);
List = class List {
constructor(dropdown) {
this.choiceInView = this.choiceInView.bind(this);
this.dropdown = dropdown;
({els: this.els, field: this.field, settings: this.settings} = this.dropdown);
this.el = this.els.list;
this.container = this.els.container;
this.appendedChoices = false;
}
appendChoices() {
var choice, i, len, ref;
if (this.appendedChoices) {
return;
}
ref = this.dropdown.choices;
for ((i = 0, len = ref.length); i < len; i++) {
choice = ref[i];
choice.init();
}
return this.appendedChoices = true;
}
calcDisplay() {
var bottomCutoff, clippingParent, clippingRect, cutoff, height, isBottomCutoff, isTopCutoff, needsNewHeight, padding, scrollHeight, selfRect, topCutoff, translation, windowCutoff, windowHeight;
windowHeight = window.innerHeight;
translation = this.translation || 0;
clippingParent = this.container.parentMatching(function (parent) {
var overflow;
overflow = parent.style('overflowY');
return overflow === 'hidden' || overflow === 'scroll';
});
scrollHeight = this.el.raw.scrollHeight || 2e308;
selfRect = extend.clone(this.container.rect);
padding = selfRect.height - this.el.height;
height = Math.min(scrollHeight, this.settings.maxHeight, window.innerHeight - 40);
selfRect.bottom = selfRect.top + height;
if (clippingParent) {
clippingRect = clippingParent.rect;
bottomCutoff = selfRect.bottom - clippingRect.bottom;
topCutoff = clippingRect.top - selfRect.top;
isBottomCutoff = bottomCutoff > 0;
isTopCutoff = topCutoff > 0;
if (selfRect.top >= clippingRect.bottom || clippingRect.top >= selfRect.bottom) {
console.warn(`The dropdown for element '${this.field.ID}' cannot be displayed as it's hidden by the parent overflow`);
} else if (isBottomCutoff || isTopCutoff) {
needsNewHeight = true;
if (selfRect.top - bottomCutoff > clippingRect.top && !isTopCutoff) {
translation = bottomCutoff;
selfRect.top -= translation;
selfRect.bottom -= translation;
cutoff = clippingRect.top - selfRect.top;
} else if (selfRect.bottom - topCutoff < clippingRect.bottom) {
translation = topCutoff * -1;
selfRect.top += translation;
selfRect.bottom += translation;
cutoff = selfRect.bottom - clippingRect.bottom;
}
if (needsNewHeight = cutoff > 0) {
height = cutoff - padding;
}
}
}
windowCutoff = (selfRect.top + height) - windowHeight;
if (windowCutoff > 0 && height < windowHeight) {
translation += windowCutoff + 10;
}
this.setDimensions(height, this.field.el.child.innerwrap.width + 10);
return this.setTranslate(translation);
}
setDimensions(height, width) {
if (height != null) {
this.el.style('maxHeight', height);
}
if (width != null) {
return this.el.style('minWidth', width);
}
}
setTranslate(translation) {
this.translation = translation;
translation *= -1;
return this.container.style('transform', `translateY(${translation}px)`);
}
scrollToChoice(choice, offset = 3) {
var distaneFromTop, selectedHeight;
distaneFromTop = choice.el.raw.offsetTop;
selectedHeight = choice.el.height;
return this.el.raw.scrollTop = distaneFromTop - selectedHeight * offset;
}
scrollDown(choice) {
return this.el.raw.scrollTop += choice.el.height;
}
scrollUp(choice) {
return this.el.raw.scrollTop -= choice.el.height;
}
choiceInView(choice) {
var choiceRect, downPadding, listRect, upPadding;
choiceRect = choice.el.rect;
listRect = this.el.rect;
upPadding = this.els.scrollIndicatorUp.state('visible') ? parseFloat(this.els.scrollIndicatorUp.styleSafe('height', true)) : void 0;
downPadding = this.els.scrollIndicatorDown.state('visible') ? parseFloat(this.els.scrollIndicatorDown.styleSafe('height', true)) : void 0;
return choiceRect.bottom <= listRect.bottom - downPadding && choiceRect.top >= listRect.top + upPadding;
}
startScrolling(direction) {
return this.scrollIntervalID = setInterval(() => {
return this.el.raw.scrollTop += direction === 'up' ? -20 : 20;
}, 50);
}
stopScrolling() {
return clearInterval(this.scrollIntervalID);
}
};
Choice = class Choice {
constructor(dropdown, settings, list, index) {
var ref;
this.dropdown = dropdown;
this.settings = settings;
this.list = list;
this.index = index;
({label: this.label, value: this.value, conditions: this.conditions} = this.settings);
if (this.label == null) {
this.label = this.value;
}
if (this.value == null) {
this.value = this.label;
}
this.field = this.dropdown.field;
this.visible = true;
this.selected = false;
this.unavailable = false;
this.initialized = false;
if ((ref = this.conditions) != null ? ref.length : void 0) {
this.unavailable = true;
this.allFields = this.field.allFields;
Condition.init(this, this.conditions, () => {
return this.unavailable = !Condition.validate(this.conditions);
});
}
}
init() {
if (this.initialized) {
return;
}
this.initialized = true;
this.el = this.dropdown.template.choice.spawn(null, {
relatedInstance: this.dropdown
});
this.el.children[1].text = this.label;
this.el.appendTo(this.list.el);
return this._attachBindings();
}
remove() {
if (!this.initialized) {
return;
}
return this.el.remove();
}
_attachBindings() {
return (() => {
SimplyBind('visible').of(this).to((visible, prev) => {
this.dropdown.visibleChoicesCount += visible ? 1 : -1;
this.el.state('visible', visible);
if (visible) {
this.dropdown.visibleChoices.push(this);
if (IS.defined(prev)) {
return this.dropdown.visibleChoices.sort(function (a, b) {
return a.index - b.index;
});
}
} else {
return helpers.removeItem(this.dropdown.visibleChoices, this);
}
});
SimplyBind('selected').of(this).to(selected => {
return this.el.state('selected', selected);
});
SimplyBind('unavailable').of(this).to(unavailable => {
return this.el.state('unavailable', unavailable);
}).and.to(unavailable => {
if (unavailable) {
return this.toggle(false, true);
}
});
SimplyBind('event:click').of(this.el).to(() => {
return this.dropdown.lastSelected = this;
});
SimplyBind('event:mousedown').of(this.el).to(event => {
event.preventDefault();
return event.stopPropagation();
});
return SimplyBind('event:mouseenter').of(this.el).to(() => {
return this.dropdown.currentHighlighted = this;
});
})();
}
toggle(newValue, unavailable) {
var newState, prevState, ref, wasSelected;
prevState = this.selected;
newState = IS.defined(newValue) ? newValue : !this.selected;
if (!newState) {
if (this.dropdown.settings.multiple && prevState) {
this.selected = newState;
return helpers.removeItem(this.field._value, this);
} else {
wasSelected = this.selected;
if (IS.defined(newValue)) {
this.selected = newState;
}
if (unavailable && wasSelected) {
return this.field._value = null;
}
}
} else {
this.selected = newState;
if (this.field.settings.multiple) {
this.field._value.push(this);
} else {
if ((ref = this.field._value) != null) {
ref.toggle(false);
}
this.field._value = this;
}
return this.field.lastSelected = this;
}
}
};
module.exports = Dropdown;
module.exports.Choice = Choice;
return module.exports;
},
55: function (require, module, exports) {
var arrayMutatorMethods, boundInstances, currentID, defaultOptions, dummyPropertyDescriptor, placeholder, settings;
currentID = 0;
arrayMutatorMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'];
dummyPropertyDescriptor = {};
boundInstances = {};
placeholder = ['{{', '}}'];
settings = Object.create({
silent: false
}, {
placeholder: {
get: function () {
return placeholder;
},
set: function (newPlaceholder) {
if (checkIf.isArray(newPlaceholder) && newPlaceholder.length === 2) {
placeholder = newPlaceholder;
setPholderRegEx();
}
}
}
});
defaultOptions = {
delay: false,
throttle: false,
simpleSelector: false,
promiseTransforms: false,
dispatchEvents: false,
sendArrayCopies: false,
updateEvenIfSame: false,
updateOnBind: true
};
var defineProperty, genID, genObj, genProxiedInterface, genSelfUpdater, getDescriptor, setValueNoop;
defineProperty = Object.defineProperty;
getDescriptor = Object.getOwnPropertyDescriptor;
var cachedEvent, changeEvent;

cachedEvent = null;

changeEvent = function() {
  var event;
  if (!cachedEvent) {
    event = cachedEvent = document.createEvent('Event');
    event.initEvent('change', true, false);
    event._sb = true;
  }
  return cachedEvent;
};

;
var requiresDomDescriptorFix;

requiresDomDescriptorFix = (!('className' in Element.prototype)) || !getDescriptor(Element.prototype, 'className').get;

;
var windowPropsToIgnore;

windowPropsToIgnore = ['innerWidth', 'innerHeight', 'outerWidth', 'outerHeight', 'scrollX', 'scrollY', 'pageXOffset', 'pageYOffset', 'screenX', 'screenY', 'screenLeft', 'screenTop'];

;
setValueNoop = function (v, publisher) {
return this.updateAllSubs(publisher || this);
};
genID = function () {
return '' + (++currentID);
};
genObj = function () {
return Object.create(null);
};
genProxiedInterface = function (isSub, completeCallback) {
return function (subject, customOptions, saveOptions) {
return SimplyBind(subject, customOptions, saveOptions, isSub, completeCallback);
};
};
genSelfUpdater = function (binding, fetchValue) {
return binding.selfUpdater || (binding.selfUpdater = new Binding(function () {
if (fetchValue) {
return binding.setValue(binding.fetchDirectValue(), binding, true);
} else {
return binding.updateAllSubs(binding);
}
}, 'Func', {}));
};
var checkIf, targetIncludes;

targetIncludes = function(target, item) {
  return target && target.indexOf(item) !== -1;
};

checkIf = {
  isDefined: function(subject) {
    return subject !== void 0;
  },
  isArray: function(subject) {
    return subject instanceof Array;
  },
  isObject: function(subject) {
    return typeof subject === 'object' && subject; // 2nd check is to test against 'null' values
  },
  isString: function(subject) {
    return typeof subject === 'string';
  },
  isNumber: function(subject) {
    return typeof subject === 'number';
  },
  isFunction: function(subject) {
    return typeof subject === 'function';
  },
  isBindingInterface: function(subject) {
    return subject instanceof BindingInterface;
  },
  isBinding: function(subject) {
    return subject instanceof Binding;
  },
  isIterable: function(subject) {
    return checkIf.isObject(subject) && checkIf.isNumber(subject.length);
  },
  isDom: function(subject) {
    return subject.nodeName && subject.nodeType === 1;
  },
  isDomInput: function(subject) {
    var nodeName;
    nodeName = subject.nodeName;
    return nodeName === 'INPUT' || nodeName === 'TEXTAREA' || nodeName === 'SELECT';
  },
  isDomRadio: function(subject) {
    return subject.type === 'radio';
  },
  isDomCheckbox: function(subject) {
    return subject.type === 'checkbox';
  },
  isElCollection: function(subject) {
    return (subject instanceof NodeList) || (subject instanceof HTMLCollection) || (window.jQuery && subject instanceof jQuery);
  },
  domElsAreSame: function(iterable) {
    var itemsWithSameType, type;
    type = iterable[0].type;
    itemsWithSameType = [].filter.call(iterable, function(item) {
      return item.type === type;
    });
    return itemsWithSameType.length === iterable.length;
  },
  isDomNode: function(subject) {
    return checkIf.isDom(subject) || subject === window || subject === document;
  }
};

;
var convertToLive, convertToReg, fetchDescriptor;
fetchDescriptor = function (object, property, isProto) {
var descriptor, objectProto;
descriptor = getDescriptor(object, property);
if (descriptor) {
if (isProto) {
descriptor.configurable = true;
}
return descriptor;
} else if (objectProto = Object.getPrototypeOf(object)) {
return fetchDescriptor(objectProto, property, true);
}
};
convertToLive = function (bindingInstance, object, onlyArrayMethods) {
var _, context, getterValue, origFn, propertyDescriptor, proxyFn, shouldIndicateUpdateIsFromSelf, shouldWriteLiveProp, slice, typeIsArray;
_ = bindingInstance;
if (!_.origDescriptor) {
_.origDescriptor = fetchDescriptor(object, _.property);
}
if (onlyArrayMethods) {
arrayMutatorMethods.forEach(function (method) {
return defineProperty(object, method, {
configurable: true,
value: function () {
var result;
result = Array.prototype[method].apply(object, arguments);
_.updateAllSubs(_);
return result;
}
});
});
} else {
if (_.type === 'Proxy') {
origFn = _.origFn = _.value;
context = object;
_.value = {
result: null,
args: null
};
if (checkIf.isFunction(origFn)) {
slice = [].slice;
getterValue = proxyFn = function () {
var args, result;
args = slice.call(arguments);
_.value.args = args = _.selfTransform ? _.selfTransform(args) : args;
_.value.result = result = origFn.apply(context, args);
_.updateAllSubs(_);
return result;
};
defineProperty(object, _.property, {
configurable: _.isLiveProp = true,
get: function () {
return getterValue;
},
set: function (newValue) {
if (!checkIf.isFunction(newValue)) {
getterValue = newValue;
} else if (newValue !== origFn) {
if (newValue !== proxyFn) {
origFn = _.origFn = newValue;
}
if (getterValue !== proxyFn) {
getterValue = proxyFn;
}
}
}
});
}
} else if (!targetIncludes(_.type, 'DOM') && !(_.object === window && targetIncludes(windowPropsToIgnore, _.property))) {
propertyDescriptor = _.origDescriptor || dummyPropertyDescriptor;
if (propertyDescriptor.get) {
_.origGetter = propertyDescriptor.get.bind(object);
}
if (propertyDescriptor.set) {
_.origSetter = propertyDescriptor.set.bind(object);
}
shouldWriteLiveProp = propertyDescriptor.configurable;
shouldWriteLiveProp = shouldWriteLiveProp && object.constructor !== CSSStyleDeclaration;
/**
 * There is a bug in webkit/blink engines in which native attributes/properties 
 * of DOM elements are not exposed on the element's prototype and instead is
 * exposed directly on the element instance; when looking up the property descriptor
 * of the element a data descriptor is returned instead of an accessor descriptor
 * (i.e. descriptor with getter/setter) which means we are not able to define our
 * own proxy getter/setters. This was fixed only in April 2015 in Chrome v43 and
 * Safari v10. Although we won't be able to get notified when the objects get
 * their values set, we would at least provide working functionality lacking update
 * listeners. Since v1.14.0 HTMLInputElement::value bindings invoke the original
 * getter and setter methods in Binding::setValue(), and since we want to avoid
 * increasing the amount of logic present in Binding::setValue() for performance
 * reasons, we patch those setters here. We clone the target element and check for
 * the existence of the target property - if it exists then it indicates the target
 * property is a native property (since only native properties are copied over in
 * Element::cloneNode). This patching is only for native properties.
 *
 * https://bugs.webkit.org/show_bug.cgi?id=49739
 * https://bugs.webkit.org/show_bug.cgi?id=75297
 * https://bugs.chromium.org/p/chromium/issues/detail?id=43394
 * https://bugs.chromium.org/p/chromium/issues/detail?id=431492
 * https://bugs.chromium.org/p/chromium/issues/detail?id=13175
 * https://developers.google.com/web/updates/2015/04/DOM-attributes-now-on-the-prototype-chain
 */
var shouldWriteLiveProp;

if (requiresDomDescriptorFix && _.isDom && _.property in object.cloneNode(false)) {
  _.origDescriptor = shouldWriteLiveProp = false;
  _.isLiveProp = true;
  _.origGetter = function() {
    return _.object[_.property];
  };
  _.origSetter = function(newValue) {
    return _.object[_.property] = newValue;
  };
}

;
if (shouldWriteLiveProp) {
typeIsArray = _.type === 'Array';
shouldIndicateUpdateIsFromSelf = !_.origSetter && !typeIsArray;
defineProperty(object, _.property, {
configurable: _.isLiveProp = true,
enumerable: propertyDescriptor.enumerable,
get: _.origGetter || (function () {
return _.value;
}),
set: function (newValue) {
_.setValue(newValue, _, shouldIndicateUpdateIsFromSelf);
}
});
if (typeIsArray) {
convertToLive(_, object[_.property], true);
}
}
}
}
};
convertToReg = function (bindingInstance, object, onlyArrayMethods) {
var _, i, len, method, newDescriptor, results;
if (onlyArrayMethods) {
results = [];
for ((i = 0, len = arrayMutatorMethods.length); i < len; i++) {
method = arrayMutatorMethods[i];
results.push(delete object[method]);
}
return results;
} else {
_ = bindingInstance;
newDescriptor = _.origDescriptor;
if (!(newDescriptor.set || newDescriptor.get)) {
newDescriptor.value = _.origFn || _.value;
}
return defineProperty(object, _.property, newDescriptor);
}
};
;
var cloneObject, extendState;

cloneObject = function(object) {
  var clone, key;
  clone = genObj();
  for (key in object) {
    clone[key] = object[key];
  }
  return clone;
};

extendState = function(base, stateToInherit) {
  var i, key, len, stateMapping;
  stateMapping = Object.keys(stateToInherit);
  for (i = 0, len = stateMapping.length; i < len; i++) {
    key = stateMapping[i];
    base[key] = stateToInherit[key];
  }
};

;
var cache;

cache = {
  get: function(object, isFunction, selector, isMultiChoice) {
    var sampleItem;
    if (isFunction) {
      return boundInstances[object._sb_ID];
    } else {
      if (isMultiChoice && object[0]._sb_map) {
        sampleItem = boundInstances[object[0]._sb_map[selector]];
        if (sampleItem.groupBinding) {
          return sampleItem.groupBinding;
        }
      }
      if (object._sb_map && object._sb_map[selector]) {
        return boundInstances[object._sb_map[selector]];
      }
    }
  },
  set: function(B, isFunction) { // B ==== Binding Object
    var propsMap, selector;
    if (isFunction) {
      defineProperty(B.object, '_sb_ID', {
        'configurable': true,
        'value': B.ID
      });
    } else {
      selector = B.selector;
      if (B.object._sb_map) {
        B.object._sb_map[selector] = B.ID;
      } else {
        propsMap = {};
        propsMap[selector] = B.ID;
        defineProperty(B.object, '_sb_map', {
          'configurable': true,
          'value': propsMap
        });
      }
    }
  }
};

;
var addToNodeStore, applyPlaceholders, escapeRegEx, pholderRegEx, pholderRegExSplit, scanTextNodesPlaceholders, setPholderRegEx, textContent;

escapeRegEx = /[.*+?^${}()|[\]\\]/g;

pholderRegEx = pholderRegExSplit = null;

setPholderRegEx = function() {
  var end, middle, start;
  start = settings.placeholder[0].replace(escapeRegEx, '\\$&');
  end = settings.placeholder[1].replace(escapeRegEx, '\\$&');
  middle = `[^${end}]+`;
  pholderRegEx = new RegExp(`${start}(${middle})${end}`, 'g');
  pholderRegExSplit = new RegExp(`${start}${middle}${end}`, 'g');
};

setPholderRegEx(); // Create the regEx on init

applyPlaceholders = function(contexts, values, indexMap) {
  var contextPart, i, index, len, output;
  output = '';
  for (index = i = 0, len = contexts.length; i < len; index = ++i) {
    contextPart = contexts[index];
    output += contextPart;
    if (indexMap[index]) {
      output += values[indexMap[index]];
    }
  }
  return output;
};

textContent = 'textContent';

addToNodeStore = function(nodeStore, node, targetPlaceholder) {
  if (nodeStore[targetPlaceholder] == null) {
    nodeStore[targetPlaceholder] = [];
  }
  nodeStore[targetPlaceholder].push(node);
};

scanTextNodesPlaceholders = function(element, nodeStore) {
  var childNodes, i, index, j, len, len1, newFragment, newNode, node, textPiece, textPieces;
  childNodes = Array.prototype.slice.call(element.childNodes);
  for (i = 0, len = childNodes.length; i < len; i++) {
    node = childNodes[i];
    if (node.nodeType !== 3) {
      scanTextNodesPlaceholders(node, nodeStore);
    } else if (node[textContent].match(pholderRegExSplit)) {
      textPieces = node[textContent].split(pholderRegEx);
      if (textPieces.length === 3 && textPieces[0] + textPieces[2] === '') { // The entire textNode is just the placeholder
        addToNodeStore(nodeStore, node, textPieces[1]);
      } else {
        newFragment = document.createDocumentFragment();
        for (index = j = 0, len1 = textPieces.length; j < len1; index = ++j) {
          textPiece = textPieces[index];
          newNode = newFragment.appendChild(document.createTextNode(textPiece));
          if (index % 2) { // is an odd index, indicating that before this text piece should come a placeholder node
            addToNodeStore(nodeStore, newNode, textPiece);
          }
        }
        node.parentNode.replaceChild(newFragment, node);
      }
    }
  }
};

;
var getErrSource, throwError, throwErrorBadArg, throwWarning;

throwError = function(errorName) {
  throw new Error('SimplyBind: ' + (errors[errorName] || errorName));
};

throwWarning = function(warningName, depth) {
  var errSource, warn;
  if (!settings.silent) {
    errSource = getErrSource(depth);
    warn = errors[warningName];
    warn += "\n\n" + errSource;
    console.warn('SimplyBind: ' + warn);
  }
};

throwErrorBadArg = function(arg) {
  throwError(`Invalid argument/s (${arg})`, true);
};

getErrSource = function(depth) {
  return ((new Error).stack || '').split('\n').slice(depth + 3).join('\n');
};

;
;
var errors;

errors = {
  invalidParamName: "SimplyBind() and .to() only accept a function, an array, a bound object, a string, or a number.",
  fnOnly: "Only functions are allowed for .transform/.condition/All()",
  badEventArg: "Invalid argument number in .ofEvent()",
  emptyList: "Empty collection provided",
  onlyOneDOMElement: "You can only pass a single DOM element to a binding",
  mixedElList: "'checked' of Mixed list of element cannot be bound"
};

;
;
var SimplyBind;
SimplyBind = function (subject, options, saveOptions, isSub, completeCallback) {
var interfaceToReturn, newInterface;
if ((!subject && subject !== 0) || (!checkIf.isString(subject) && !checkIf.isNumber(subject) && !checkIf.isFunction(subject) && !(subject instanceof Array))) {
if (!checkIf.isBindingInterface(subject)) {
throwError('invalidParamName');
}
}
if (checkIf.isObject(subject) && !(subject instanceof Array)) {
interfaceToReturn = completeCallback ? completeCallback(subject) : subject.selfClone();
} else {
newInterface = new BindingInterface(options);
newInterface.saveOptions = saveOptions;
newInterface.isSub = isSub;
newInterface.completeCallback = completeCallback;
if (checkIf.isFunction(subject)) {
interfaceToReturn = newInterface.setObject(subject, true);
} else {
interfaceToReturn = newInterface.setProperty(subject);
}
}
return interfaceToReturn;
};
SimplyBind.version = "1.15.8";
SimplyBind.settings = settings;
SimplyBind.defaultOptions = defaultOptions;
SimplyBind.unBindAll = function (object, bothWays) {
var boundID, prop, propMap;
if (object && (checkIf.isObject(object) || checkIf.isFunction(object))) {
/**
 * Conditional Checks:
 *
 * 1) Make sure the subject object is iterable (and thus a possible candidate for being an element collection)
 * 2) Make sure the subject object isn't an array binding (since element collection objects don't get directly bound)
 * 3) Make sure the first element in the collection is a valid object (i.e. isn't undefined and isn't null)
 * 4) Make sure the first element is a DOM object
 */
var object;

if (checkIf.isIterable(object) && !object._sb_ID && object[0] && (checkIf.isDom(object[0]))) {
  object = object[0];
}

;
propMap = object._sb_map;
if (object._sb_ID) {
boundInstances[object._sb_ID].removeAllSubs(bothWays);
}
if (propMap) {
for (prop in propMap) {
boundID = propMap[prop];
boundInstances[boundID].removeAllSubs(bothWays);
}
}
}
};
;
;
var Binding;
Binding = function (object, type, state) {
var parentBinding, parentProperty, subjectValue;
extendState(this, state);
this.optionsDefault = this.saveOptions ? this.options : defaultOptions;
this.type = type;
this.object = object;
this.ID = genID();
this.subs = [];
this.subsMeta = genObj();
this.pubsMap = genObj();
this.attachedEvents = [];
if (this.type === 'Proxy') {
this.setValue = setValueNoop;
}
if (this.isMultiChoice) {
this.choices = genObj();
this.object.forEach(choiceEl => {
var choiceBinding;
choiceBinding = this.choices[choiceEl.value] = SimplyBind('checked').of(choiceEl)._;
choiceBinding.addSub(this);
choiceBinding.subsMeta[this.ID].transformFn = function () {
return choiceBinding;
};
choiceBinding.groupBinding = this;
});
}
if (!(this.type === 'Event' || (this.type === 'Func' && this.isSub))) {
if (this.type === 'Pholder') {
parentProperty = this.descriptor && !targetIncludes(this.descriptor, 'multi') ? `${this.descriptor}:${this.property}` : this.property;
parentBinding = this.parentBinding = SimplyBind(parentProperty).of(object)._;
parentBinding.scanForPholders();
this.value = parentBinding.pholderValues[this.pholder];
if (parentBinding.textNodes) {
this.textNodes = parentBinding.textNodes[this.pholder];
}
} else {
this.value = subjectValue = this.fetchDirectValue();
if (this.type === 'ObjectProp' && !checkIf.isDefined(subjectValue) && !getDescriptor(this.object, this.property)) {
this.object[this.property] = subjectValue;
}
convertToLive(this, this.object);
}
}
this.attachEvents();
return boundInstances[this.ID] = this;
};
var eventUpdateHandler;

Binding.prototype = {
  //# ==========================================================================
  //# Subscriber Management
  //# ========================================================================== 
  addSub: function(sub, options, updateOnce, updateEvenIfSame) {
    var alreadyHadSub, j, len, metaData, ref, subItem;
    if (sub.isMulti) {
      ref = sub.bindings;
      for (j = 0, len = ref.length; j < len; j++) {
        subItem = ref[j];
        this.addSub(subItem, options, updateOnce, updateEvenIfSame);
      }
    } else {
      if (metaData = this.subsMeta[sub.ID]) {
        alreadyHadSub = true;
      } else {
        sub.pubsMap[this.ID] = this;
        this.subs.unshift(sub);
        metaData = this.subsMeta[sub.ID] = genObj();
        metaData.updateOnce = updateOnce;
        metaData.opts = cloneObject(options);
        if (updateEvenIfSame || this.type === 'Event' || this.type === 'Proxy' || this.type === 'Array') {
          metaData.opts.updateEvenIfSame = true;
        }
        metaData.valueRef = sub.type === 'Func' ? 'valuePassed' : 'value';
      }
    }
    return alreadyHadSub;
  },
  removeSub: function(sub, bothWays) {
    var j, len, ref, subItem;
    if (sub.isMulti) {
      ref = sub.bindings;
      for (j = 0, len = ref.length; j < len; j++) {
        subItem = ref[j];
        this.removeSub(subItem, bothWays);
      }
    } else {
      if (this.subsMeta[sub.ID]) {
        this.subs.splice(this.subs.indexOf(sub), 1);
        delete this.subsMeta[sub.ID];
        delete sub.pubsMap[this.ID];
      }
      if (bothWays) {
        sub.removeSub(this);
        delete this.pubsMap[sub.ID];
      }
    }
    if (this.subs.length === 0 && Object.keys(this.pubsMap).length === 0) {
      this.destroy(); // Since it's no longer a subscriber or has any subscribers
    }
  },
  removeAllSubs: function(bothWays) {
    var j, len, ref, sub;
    ref = this.subs.slice();
    for (j = 0, len = ref.length; j < len; j++) {
      sub = ref[j];
      this.removeSub(sub, bothWays);
    }
  },
  destroy: function() { // Resets object to initial state (pre-binding state)
    var event, j, len, ref;
    delete boundInstances[this.ID];
    this.removePollInterval();
    if (this.type === 'Event') {
      ref = this.attachedEvents;
      for (j = 0, len = ref.length; j < len; j++) {
        event = ref[j];
        this.unRegisterEvent(event);
      }
    } else if (this.type === 'Func') {
      delete this.object._sb_ID;
    }
    if (this.isLiveProp && this.origDescriptor) {
      /* istanbul ignore next */
      convertToReg(this, this.object);
    }
    if (this.type === 'Array') {
      convertToReg(this, this.value, true);
    }
    if (this.object._sb_map) {
      delete this.object._sb_map[this.selector];
      if (Object.keys(this.object._sb_map).length === 0) {
        delete this.object._sb_map;
      }
    }
  },
  //# ==========================================================================
  //# Value set/get
  //# ========================================================================== 
  fetchDirectValue: function() {
    var choiceEl, choiceName, ref, results, type;
    type = this.type;
    switch (false) {
      case type !== 'Func':
        return this.object();
      case type !== 'DOMAttr':
        return this.object.getAttribute(this.property) || '';
      case !this.isMultiChoice:
        results = [];
        ref = this.choices;
        for (choiceName in ref) {
          choiceEl = ref[choiceName];
          if (choiceEl.object.checked) {
            if (type === 'DOMRadio') {
              return choiceName;
            } else {
              results.push(choiceName);
            }
          }
        }
        return results;
      default:
        return this.object[this.property];
    }
  },
  setValue: function(newValue, publisher, fromSelf, fromChangeEvent) { // fromSelf===true when called from eventUpdateHandler or property descriptor setter (unless it's an Array binding)
    var choiceBinding, choiceName, entireValue, index, j, k, len, len1, n, newChoiceValue, newChoices, newValueArray, overwritePrevious, parent, prevCursror, prevValue, ref, ref1, ref2, targetChoiceBinding, textNode, value;
    publisher || (publisher = this);
    if (this.selfTransform) {
      newValue = this.selfTransform(newValue);
    }
    if (!fromSelf) {
      switch (this.type) {
        case 'ObjectProp':
          if (!this.isLiveProp) {
            if (newValue !== this.value) {
              this.object[this.property] = newValue;
            }
          } else if (this.isDomInput) {
            if (!fromChangeEvent) {
              this.origSetter(newValue);
              if (settings.dispatchEvents) {
                this.object.dispatchEvent(changeEvent());
              }
            } else if (newValue !== this.origGetter()) { // IMPLICIT: and fromChangeEvent
              prevCursror = this.object.selectionStart;
              this.origSetter(newValue);
              if (prevCursror) {
                this.object.setSelectionRange(prevCursror, prevCursror);
              }
            }
          } else if (this.origSetter) {
            this.origSetter(newValue);
          }
          break;
        case 'Pholder':
          parent = this.parentBinding;
          parent.pholderValues[this.pholder] = newValue;
          entireValue = applyPlaceholders(parent.pholderContexts, parent.pholderValues, parent.pholderIndexMap);
          if (this.textNodes && newValue !== this.value) {
            ref = this.textNodes;
            for (j = 0, len = ref.length; j < len; j++) {
              textNode = ref[j];
              textNode[textContent] = newValue;
            }
          }
          if (this.property !== textContent) {
            parent.setValue(entireValue, publisher);
          }
          break;
        case 'Array':
          if (newValue !== this.value) {
            if (!checkIf.isArray(newValue)) {
              newValue = Array.prototype.concat(newValue);
            }
            convertToReg(this, this.value, true);
            convertToLive(this, newValue = newValue.slice(), true);
            if (this.origSetter) { // Will update any other previous non-Array bindings to the same object property
              this.origSetter(newValue);
            }
          }
          break;
        case 'Func':
          prevValue = this.valuePassed;
          this.valuePassed = newValue;
          newValue = this.object(newValue, prevValue);
          break;
        case 'Event':
          this.isEmitter = true;
          this.emitEvent(newValue);
          this.isEmitter = false;
          break;
        case 'DOMRadio':
          if (this.isMultiChoice) { // The newValue var will hold the radio field binding as its value if the update is coming from the radio field's change event
            targetChoiceBinding = checkIf.isBinding(newValue) ? newValue : this.choices[newValue];
            if (targetChoiceBinding) {
              newValue = targetChoiceBinding.object.value;
              ref1 = this.choices;
              for (n in ref1) {
                choiceBinding = ref1[n];
                choiceBinding.setValue(choiceBinding.ID === targetChoiceBinding.ID, publisher);
              }
            } else {
              newValue = this.value; // Set to prev value
            }
          } else {
            newValue = !!newValue; // Convert to Boolean
            if (newValue === this.value) {
              return;
            }
            if (this.object.checked !== newValue) {
              this.object.checked = newValue;
            }
            if (newValue && settings.dispatchEvents) { // Only emit if the value is true (in order to conform to web standards)
              this.object.dispatchEvent(changeEvent());
            }
          }
          break;
        case 'DOMCheckbox':
          if (this.isMultiChoice) { // The newValue var will hold the checkbox field binding as its value if the update is coming from the checkbox field's change event
            overwritePrevious = !checkIf.isBinding(newValue); // Means that a new array was supplied
            newChoices = [].concat(newValue); // This *normalizes* the new value into an array
            for (index = k = 0, len1 = newChoices.length; k < len1; index = ++k) {
              value = newChoices[index];
              newChoices[index] = checkIf.isBinding(value) ? value : this.choices[value];
            }
            newValueArray = [];
            ref2 = this.choices;
            for (choiceName in ref2) {
              choiceBinding = ref2[choiceName];
              if (overwritePrevious) {
                newChoiceValue = targetIncludes(newChoices, choiceBinding);
              } else {
                newChoiceValue = choiceBinding.value;
              }
              choiceBinding.setValue(newChoiceValue, publisher);
              if (newChoiceValue) {
                newValueArray.push(choiceName);
              }
            }
            newValue = newValueArray;
          } else {
            newValue = !!newValue; // Convert to Boolean
            if (newValue === this.value) {
              return;
            }
            if (this.object.checked !== newValue) {
              this.object.checked = newValue;
              if (settings.dispatchEvents) {
                this.object.dispatchEvent(changeEvent());
              }
            }
          }
          break;
        case 'DOMAttr':
          this.object.setAttribute(this.property, newValue);
      }
    }
    this.value = newValue;
    this.updateAllSubs(publisher);
  },
  updateAllSubs: function(publisher) {
    var arr, i;
    if (i = (arr = this.subs).length) { // Ugly shortcut for index definition in order to limit logic repitiion
      while (i--) {
        this.updateSub(arr[i], publisher);
      }
    }
  },
  updateSub: function(sub, publisher, isDelayedUpdate) {
    var currentTime, meta, newValue, subValue, timePassed, transform;
    if ((publisher === sub) || (publisher !== this && publisher.subsMeta[sub.ID])) {
      return;
    }
    meta = this.subsMeta[sub.ID];
    if (meta.disallowList && meta.disallowList[publisher.ID]) {
      return;
    }
    if (meta.opts.throttle) {
      currentTime = +(new Date);
      timePassed = currentTime - meta.lastUpdate;
      if (timePassed < meta.opts.throttle) {
        clearTimeout(meta.updateTimer);
        return meta.updateTimer = setTimeout(() => {
          if (this.subsMeta[sub.ID]) {
            return this.updateSub(sub, publisher);
          }
        }, meta.opts.throttle - timePassed);
      } else {
        meta.lastUpdate = currentTime;
      }
    } else if (meta.opts.delay && !isDelayedUpdate) {
      return setTimeout(() => {
        if (this.subsMeta[sub.ID]) {
          return this.updateSub(sub, publisher, true);
        }
      }, meta.opts.delay);
    }
    newValue = this.type === 'Array' && meta.opts.sendArrayCopies ? this.value.slice() : this.value;
    subValue = sub[meta.valueRef];
    newValue = (transform = meta.transformFn) ? transform(newValue, subValue, sub.object) : newValue;
    if (newValue === subValue && !meta.opts.updateEvenIfSame || meta.conditionFn && !meta.conditionFn(newValue, subValue, sub.object)) {
      return;
    }
    // Why do we need the 'promiseTransforms' option when we can just check for the existance of .then method?
    // Because tests show that when searching for the .then prop on the object results in a performance slowdown of up to 30%!
    // Checking if the promiseTransforms option is enabled first eliminates unnecessary lookups & slowdowns.
    if (meta.opts.promiseTransforms && newValue && checkIf.isFunction(newValue.then)) {
      newValue.then(function(newValue) {
        sub.setValue(newValue, publisher);
      });
    } else {
      sub.setValue(newValue, publisher);
    }
    if (meta.updateOnce) {
      this.removeSub(sub);
    }
  },
  //# ==========================================================================
  //# Transforms & Conditions
  //# ==========================================================================
  addModifierFn: function(target, subInterfaces, subjectFn, updateOnBind) {
    var base, j, len, subInterface, subMetaData, subscriber;
    if (!checkIf.isFunction(subjectFn)) {
      return throwWarning('fnOnly', 2);
    } else {
      for (j = 0, len = subInterfaces.length; j < len; j++) {
        subInterface = subInterfaces[j];
        subscriber = subInterface._ || subInterface; // Second is chosen when the passed subscriber interfaces multi-binding (is a recursive call of this method)
        if (subscriber.isMulti) {
          this.addModifierFn(target, subscriber.bindings, subjectFn, updateOnBind);
        } else {
          subMetaData = this.subsMeta[subscriber.ID];
          subMetaData[target] = subjectFn;
          updateOnBind = updateOnBind && !subMetaData.updateOnce;
          if (this.pubsMap[subscriber.ID]) {
            (base = subscriber.subsMeta[this.ID])[target] || (base[target] = subjectFn); // Will not replace existing modifier function if exists
          }
          if ((updateOnBind || this.type === 'Func') && target === 'transformFn') {
            this.updateSub(subscriber, this);
          }
        }
      }
      return true;
    }
  },
  setSelfTransform: function(transformFn, updateOnBind) {
    this.selfTransform = transformFn;
    if (updateOnBind) {
      this.setValue(this.value);
    }
  },
  //# ==========================================================================
  //# Allow/Disallow rules
  //# ========================================================================== 
  addDisallowRule: function(targetSub, targetDisallow) {
    var base, disallowList;
    disallowList = (base = this.subsMeta[targetSub.ID]).disallowList != null ? base.disallowList : base.disallowList = genObj();
    disallowList[targetDisallow.ID] = 1;
  },
  //# ==========================================================================
  //# Placeholders
  //# ========================================================================== 
  scanForPholders: function() {
    var index;
    if (!this.pholderValues) {
      this.pholderValues = genObj();
      this.pholderIndexMap = genObj();
      this.pholderContexts = [];
      if (checkIf.isString(this.value)) {
        this.pholderContexts = this.value.split(pholderRegExSplit);
        index = 0;
        this.value = this.value.replace(pholderRegEx, (e, pholder) => {
          this.pholderIndexMap[index++] = pholder;
          return this.pholderValues[pholder] = pholder;
        });
      }
      if (this.isDom && this.property === textContent) {
        scanTextNodesPlaceholders(this.object, this.textNodes = genObj());
      }
    }
  },
  
  //# ==========================================================================
  //# Polling
  //# ========================================================================== 
  addPollInterval: function(time) {
    if (this.type !== 'Event') {
      this.removePollInterval();
      return this.pollInterval = setInterval(() => {
        var polledValue;
        polledValue = this.fetchDirectValue();
        return this.setValue(polledValue, this, true);
      }, time);
    }
  },
  removePollInterval: function() {
    clearInterval(this.pollInterval);
    return this.pollInterval = null;
  },
  //# ==========================================================================
  //# Events
  //# ========================================================================== 
  addUpdateListener: function(eventName, targetProperty) {
    this.object.addEventListener(eventName, (event) => {
      var shouldRedefineValue;
      if (!event._sb) {
        shouldRedefineValue = this.selfTransform && this.isDomInput;
        this.setValue(this.object[targetProperty], null, !shouldRedefineValue, true);
      }
    }, false);
  },
  attachEvents: function() {
    if (this.eventName) {
      this.registerEvent(this.eventName);
    } else if (this.isDomInput) {
      this.addUpdateListener('input', 'value');
      this.addUpdateListener('change', 'value');
    } else if (!this.isMultiChoice && (this.type === 'DOMRadio' || this.type === 'DOMCheckbox')) {
      this.addUpdateListener('change', 'checked');
    }
  },
  registerEvent: function(eventName) {
    this.attachedEvents.push(eventName);
    if (!this.eventHandler) {
      this.eventHandler = eventUpdateHandler.bind(this);
    }
    this.object[this.eventMethods.listen](eventName, this.eventHandler);
  },
  unRegisterEvent: function(eventName) {
    this.attachedEvents.splice(this.attachedEvents.indexOf(eventName), 1);
    this.object[this.eventMethods.remove](eventName, this.eventHandler);
  },
  emitEvent: function(extraData) {
    var eventObject;
    eventObject = this.eventName;
    if (this.eventMethods.emit === 'dispatchEvent') {
      if (!this.eventObject) {
        this.eventObject = document.createEvent('Event');
        this.eventObject.initEvent(this.eventName, true, true);
      }
      this.eventObject.bindingData = extraData;
      eventObject = this.eventObject;
    }
    this.object[this.eventMethods.emit](eventObject, extraData);
  }
};

eventUpdateHandler = function() {
  if (!this.isEmitter) {
    this.setValue(arguments[this.property], null, true);
  }
};

;
;
var BindingInterface;
BindingInterface = function (options, inheritedState) {
var key;
if (inheritedState) {
extendState(this, inheritedState);
this.stage = 1;
} else {
this.stage = 0;
this.subs = [];
this.optionsPassed = options || (options = {});
this.options = {};
for (key in defaultOptions) {
this.options[key] = options[key] != null ? options[key] : defaultOptions[key];
}
}
return this;
};
var BindingInterfacePrivate;
BindingInterfacePrivate = {
selfClone: function () {
return new BindingInterface(null, this);
},
defineMainProps: function (binding) {
this._ = binding;
return Object.defineProperties(this, {
'value': {
get: function () {
return binding.value;
}
},
'original': {
get: function () {
return binding.objects || binding.object;
}
},
'subscribers': {
get: function () {
return binding.subs.slice().map(function (sub) {
return sub.object;
});
}
}
});
},
createBinding: function (subject, newObjectType, bindingInterface, isFunction) {
var cachedBinding, newBinding;
this.object = subject;
cachedBinding = cache.get(subject, isFunction, this.selector, this.isMultiChoice);
if (cachedBinding) {
return this.patchCachedBinding(cachedBinding);
} else {
newBinding = new Binding(subject, newObjectType, bindingInterface);
cache.set(newBinding, isFunction);
return newBinding;
}
},
patchCachedBinding: function (cachedBinding) {
var key, option, ref, ref1, value;
if (cachedBinding.type === 'ObjectProp' && !((this.property in this.object))) {
convertToLive(cachedBinding, this.object);
}
if (this.saveOptions) {
ref = this.optionsPassed;
for (option in ref) {
value = ref[option];
cachedBinding.optionsDefault[option] = value;
}
}
ref1 = cachedBinding.optionsDefault;
for (key in ref1) {
value = ref1[key];
this.options[key] = checkIf.isDefined(this.optionsPassed[key]) ? this.optionsPassed[key] : value;
}
return cachedBinding;
},
setProperty: function (subject) {
var split;
if (checkIf.isNumber(subject)) {
subject = subject.toString();
}
this.selector = this.property = subject;
if (!this.options.simpleSelector) {
if (targetIncludes(subject, ':')) {
split = subject.split(':');
this.descriptor = split.slice(0, -1).join(':');
this.property = split[split.length - 1];
}
if (targetIncludes(subject, '.')) {
split = this.property.split('.');
this.property = split[0];
this.pholder = split.slice(1).join('.');
}
if (targetIncludes(this.descriptor, 'event')) {
if (targetIncludes(subject, '#')) {
split = this.property.split('#');
this.eventName = split[0];
this.property = split[1];
} else {
this.eventName = this.property;
this.property = 0;
}
if (isNaN(parseInt(this.property))) {
throwWarning('badEventArg', 1);
}
}
}
return this;
},
setObject: function (subject, isFunction) {
var newObjectType;
this.stage = 1;
var isDomCheckbox, isDomRadio, isIterable, sampleItem, subject;

isIterable = subject !== window && checkIf.isIterable(subject) && !subject.nodeType;

sampleItem = isIterable ? subject[0] : subject;

if (!sampleItem) {
  if (isIterable && checkIf.isElCollection(subject)) {
    throwError('emptyList');
  }
} else if (this.isDom = checkIf.isDom(sampleItem)) {
  if (this.property === 'checked') {
    isDomRadio = sampleItem && checkIf.isDomRadio(sampleItem);
    isDomCheckbox = !isDomRadio && sampleItem && checkIf.isDomCheckbox(sampleItem);
  } else if (this.property === 'value') {
    this.isDomInput = checkIf.isDomInput(sampleItem);
  }
  if (isIterable && !targetIncludes(this.descriptor, 'multi')) {
    if (subject.length === 1) {
      subject = subject[0];
    } else {
      if ((isDomRadio || isDomCheckbox) && !checkIf.domElsAreSame(subject)) {
        return throwWarning('mixedElList', 3);
      } else {
        if (isDomRadio || isDomCheckbox) {
          this.isMultiChoice = true;
          subject = [].slice.call(subject);
        } else {
          subject = subject[0];
          throwWarning('onlyOneDOMElement', 3);
        }
      }
    }
  }
}

;
switch (false) {
case !isFunction:
newObjectType = 'Func';
break;
case !this.pholder:
newObjectType = 'Pholder';
break;
case !(targetIncludes(this.descriptor, 'array') && checkIf.isArray(subject[this.property])):
newObjectType = 'Array';
break;
case !targetIncludes(this.descriptor, 'event'):
newObjectType = 'Event';
this.eventMethods = {
  listen: this.optionsPassed.listenMethod,
  remove: this.optionsPassed.removeMethod,
  emit: this.optionsPassed.emitMethod
};

if (!subject[this.eventMethods.listen]) {
  this.eventMethods.listen = checkIf.isDomNode(subject) ? 'addEventListener' : 'on';
}

if (!subject[this.eventMethods.remove]) {
  this.eventMethods.remove = checkIf.isDomNode(subject) ? 'removeEventListener' : 'removeListener';
}

if (!subject[this.eventMethods.emit]) {
  this.eventMethods.emit = checkIf.isDomNode(subject) ? 'dispatchEvent' : 'emit';
}

;
break;
case !targetIncludes(this.descriptor, 'func'):
newObjectType = 'Proxy';
break;
case !isDomRadio:
newObjectType = 'DOMRadio';
break;
case !isDomCheckbox:
newObjectType = 'DOMCheckbox';
break;
case !targetIncludes(this.descriptor, 'attr'):
newObjectType = 'DOMAttr';
break;
default:
newObjectType = 'ObjectProp';
}
if (targetIncludes(this.descriptor, 'multi')) {
if (!subject.length) {
throwError('emptyList');
}
this.defineMainProps(new GroupBinding(this, subject, newObjectType));
} else {
this.defineMainProps(this.createBinding(subject, newObjectType, this, isFunction));
}
if (targetIncludes(this._.type, 'Event') || targetIncludes(this._.type, 'Proxy')) {
this.options.updateOnBind = false;
} else if (targetIncludes(this._.type, 'Func')) {
this.options.updateOnBind = true;
}
if (this.completeCallback) {
return this.completeCallback(this);
} else {
return this;
}
},
addToPublisher: function (publisherInterface) {
var alreadyHadSub, binding, i, len, ref;
publisherInterface.stage = 2;
publisherInterface.subs.push(this);
alreadyHadSub = publisherInterface._.addSub(this._, publisherInterface.options, publisherInterface.updateOnce);
if (publisherInterface.updateOnce) {
delete publisherInterface.updateOnce;
} else if (publisherInterface.options.updateOnBind && !alreadyHadSub) {
if (this._.isMulti) {
ref = this._.bindings;
for ((i = 0, len = ref.length); i < len; i++) {
binding = ref[i];
publisherInterface._.updateSub(binding, publisherInterface._);
}
} else {
publisherInterface._.updateSub(this._, publisherInterface._);
}
}
}
};
;
var METHOD_bothWays, METHOD_chainTo, METHOD_condition, METHOD_conditionAll, METHOD_of, METHOD_pollEvery, METHOD_set, METHOD_setOption, METHOD_stopPolling, METHOD_transform, METHOD_transformAll, METHOD_transformSelf, METHOD_unBind;

BindingInterface.prototype = Object.create(BindingInterfacePrivate, {
  of: {
    get: function() {
      if (!this.stage) { //=== if stage is 0
        return METHOD_of;
      }
    }
  },
  set: {
    get: function() {
      if (this.stage) { //=== if stage is 1 or 2
        return METHOD_set;
      }
    }
  },
  chainTo: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_chainTo;
      }
    }
  },
  transformSelf: {
    get: function() {
      if (this.stage === 1) {
        return METHOD_transformSelf;
      }
    }
  },
  transform: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_transform;
      }
    }
  },
  transformAll: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_transformAll;
      }
    }
  },
  condition: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_condition;
      }
    }
  },
  conditionAll: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_conditionAll;
      }
    }
  },
  bothWays: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_bothWays;
      }
    }
  },
  unBind: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_unBind;
      }
    }
  },
  pollEvery: {
    get: function() {
      if (this.stage) { //=== if stage is 1 or 2
        return METHOD_pollEvery;
      }
    }
  },
  stopPolling: {
    get: function() {
      if (this.stage) { //=== if stage is 1 or 2
        return METHOD_stopPolling;
      }
    }
  },
  setOption: {
    get: function() {
      if (this.stage === 2) {
        return METHOD_setOption;
      }
    }
  },
  disallowFrom: {
    get: function() {
      var thisInterface;
      if (this.stage === 2 && (thisInterface = this)) {
        return genProxiedInterface(false, function(disallowInterface) {
          var subInterface;
          subInterface = thisInterface.subs[thisInterface.subs.length - 1];
          thisInterface._.addDisallowRule(subInterface._, disallowInterface._);
          return thisInterface;
        });
      }
    }
  },
  updateOn: {
    get: function() {
      var thisInterface;
      if (this.stage && (thisInterface = this)) { //=== if stage is 1 or 2
        return genProxiedInterface(false, function(subInterface) {
          if (subInterface._ !== thisInterface._) {
            thisInterface._.pubsMap[subInterface._.ID] = subInterface._;
            subInterface._.addSub(genSelfUpdater(thisInterface._, true), subInterface.options, false, true);
          }
          return thisInterface;
        });
      }
    }
  },
  removeUpdater: {
    get: function() {
      var selfUpdater, thisInterface;
      if (this.stage && (thisInterface = this) && (selfUpdater = this._.selfUpdater)) { //=== if stage is 1 or 2
        return genProxiedInterface(false, function(subInterface) {
          if (subInterface._.subsMeta[selfUpdater.ID]) {
            delete thisInterface._.pubsMap[subInterface._.ID];
            subInterface._.removeSub(selfUpdater);
          }
        });
      }
    }
  },
  to: {
    get: function() {
      var thisInterface;
      if (this.stage === 1 && (thisInterface = this)) {
        return genProxiedInterface(true, function(subInterface) {
          if (subInterface._ !== thisInterface._) {
            subInterface.addToPublisher(thisInterface);
          }
          return thisInterface;
        });
      }
    }
  },
  and: {
    get: function() {
      var cloneBinding, cloneInterface;
      cloneInterface = this.selfClone();
      if (this.stage === 2) {
        return cloneInterface;
      } else if (this.stage === 1) {
        if (!cloneInterface._.isMulti) {
          cloneBinding = cloneInterface._;
          cloneInterface._ = cloneInterface._ = new GroupBinding(cloneInterface);
          cloneInterface._.addBinding(cloneBinding);
        }
        return genProxiedInterface(false, function(siblingInterface) {
          cloneInterface._.addBinding(siblingInterface._);
          return cloneInterface;
        });
      }
    }
  },
  once: {
    get: function() {
      var interfaceToReturn;
      if (this.stage === 1) {
        interfaceToReturn = this.selfClone();
        interfaceToReturn.updateOnce = true;
        return interfaceToReturn;
      }
    }
  },
  // ==== Aliases =================================================================================
  update: {
    get: function() {
      return this.set;
    }
  },
  twoWay: {
    get: function() {
      return this.bothWays;
    }
  },
  pipe: {
    get: function() {
      return this.chainTo;
    }
  }
});

METHOD_of = function(object) {
  if (!(checkIf.isObject(object) || checkIf.isFunction(object))) {
    throwErrorBadArg(object);
  }
  if (checkIf.isBindingInterface(object)) {
    object = object.object;
  }
  this.stage = 1;
  return this.setObject(object);
};

METHOD_chainTo = function(subject, specificOptions, saveOptions) {
  return SimplyBind(this.subs[this.subs.length - 1]).to(subject, specificOptions, saveOptions);
};

METHOD_set = function(newValue) {
  this._.setValue(newValue);
  return this;
};

METHOD_transformSelf = function(transformFn) { // Applied only to the last sub
  if (!checkIf.isFunction(transformFn)) {
    throwWarning('fnOnly', 1);
  } else {
    this._.setSelfTransform(transformFn, this.options.updateOnBind);
  }
  return this;
};

METHOD_transform = function(transformFn) { // Applied only to the last sub
  this._.addModifierFn('transformFn', this.subs.slice(-1), transformFn, this.options.updateOnBind);
  return this;
};

METHOD_transformAll = function(transformFn) { // Applied to entrie subs set		
  this._.addModifierFn('transformFn', this.subs, transformFn, this.options.updateOnBind);
  return this;
};

METHOD_condition = function(conditionFn) { // Applied only to the last sub
  this._.addModifierFn('conditionFn', this.subs.slice(-1), conditionFn);
  return this;
};

METHOD_conditionAll = function(conditionFn) { // Applied to entrie subs set
  this._.addModifierFn('conditionFn', this.subs, conditionFn);
  return this;
};

METHOD_bothWays = function(altTransform) { // Applied only to the last sub
  var binding, bindings, i, len, originCondition, originTransform, sub, subBinding, transformToUse;
  sub = this.subs[this.subs.length - 1];
  subBinding = sub._;
  bindings = this._.isMulti ? this._.bindings : [this._];
  subBinding.addSub(this._, sub.options);
  for (i = 0, len = bindings.length; i < len; i++) {
    binding = bindings[i];
    originTransform = binding.subsMeta[subBinding.ID].transformFn;
    originCondition = binding.subsMeta[subBinding.ID].conditionFn;
    if (originTransform || altTransform) {
      transformToUse = checkIf.isFunction(altTransform) ? altTransform : originTransform;
      if (transformToUse && altTransform !== false) {
        subBinding.subsMeta[this._.ID].transformFn = transformToUse;
      }
    }
    if (originCondition) {
      subBinding.subsMeta[this._.ID].conditionFn = originCondition;
    }
  }
  return this;
};

METHOD_unBind = function(bothWays) { // Applied to all subs
  var i, len, ref, sub;
  ref = this.subs;
  for (i = 0, len = ref.length; i < len; i++) {
    sub = ref[i];
    this._.removeSub(sub._, bothWays);
  }
  return this;
};

METHOD_pollEvery = function(time) {
  this._.addPollInterval(time);
  return this;
};

METHOD_stopPolling = function() {
  this._.removePollInterval();
  return this;
};

METHOD_setOption = function(optionName, newValue) {
  this._.subsMeta[this.subs[this.subs.length - 1]._.ID].opts[optionName] = newValue;
  return this;
};

;
;
var GroupBinding, proto;

GroupBinding = function(bindingInterface, objects, objectType) {
  var bindings, i, len, object;
  bindingInterface.selector = bindingInterface.selector.slice(6); // Take out the 'multi:'
  extendState(this, this.interface = bindingInterface);
  this.isMulti = true;
  this.bindings = bindings = [];
  if (objects) {
    for (i = 0, len = objects.length; i < len; i++) {
      object = objects[i];
      this.addBinding(object, objectType);
    }
  }
  return Object.defineProperties(this, {
    'type': {
      get: function() {
        return bindings.map(function(binding) {
          return binding.type;
        });
      }
    },
    'value': {
      get: function() {
        return bindings.map(function(binding) {
          return binding.value;
        });
      }
    }
  });
};

proto = GroupBinding.prototype = Object.create(BindingInterfacePrivate);

Object.keys(Binding.prototype).forEach(function(methodName) {
  return proto[methodName] = function(a, b, c, d) { // Four arguments is the most ever passed to any method from BindingInterface methods
    var binding, i, len, ref;
    ref = this.bindings;
    for (i = 0, len = ref.length; i < len; i++) {
      binding = ref[i];
      if (methodName === 'updateSub') {
        b = binding;
      }
      binding[methodName](a, b, c, d);
    }
  };
});

proto.addBinding = function(object, objectType) {
  this.bindings.push(!objectType ? object : this.createBinding(object, objectType, this.interface));
};

;
module.exports = SimplyBind;
return module.exports;
},
56: function (require, module, exports) {
var COLORS, DOM, helpers;
DOM = require(4);
COLORS = require(5);
helpers = require(46);
var __template = require(106);
exports.default = __template.default.extend({
children: {
'innerwrap': {
options: {
style: {
overflow: 'hidden',
height: function (field) {
return field.settings.minHeight || 46;
},
width: function (field) {
if (!field.settings.autoWidth) {
return '100%';
}
}
}
}
},
'label': {
options: {
style: {
left: function (field) {
return helpers.shorthandSideValue(field.settings.padding, 'left');
},
top: '7.6px'
}
}
},
'input': {
type: 'textarea',
options: {
type: null,
styleAfterInsert: true,
style: {
resize: 'none',
whiteSpace: 'normal',
width: '100%',
height: function () {
return `calc(100% - ${this.styleSafe('marginTop', true)} - ${this.styleSafe('marginBottom', true)})`;
},
margin: '0',
marginTop: '15px',
marginBottom: '12px',
padding: '0 12px'
}
}
},
'placeholder': {
options: {
styleAfterInsert: true,
style: {
left: 0,
padding: function (field) {
var horiz, verti;
horiz = field.el.child.input.styleSafe('paddingLeft', true) || field.el.child.input.styleSafe('paddingLeft');
verti = field.el.child.input.styleSafe('marginTop', true) || field.el.child.input.styleSafe('marginTop');
return `${verti} ${horiz}`;
}
}
}
}
}
});

var counter = exports.counter = DOM.template(['div', {
ref: 'counter',
style: {
position: 'absolute',
bottom: -10,
right: 0,
fontSize: 10,
fontWeight: 500
}
}]);
return module.exports;
},
57: function (require, module, exports) {
module.exports = {
placeholder: true,
validWhenRegex: false,
autoWidth: false,
autoHeight: true,
minHeight: 46,
maxWidth: '100%',
maxHeight: 2e308,
minWidth: 2,
minLength: null,
maxLength: null,
counter: false
};
return module.exports;
},
58: function (require, module, exports) {
var keyCodes;
module.exports = keyCodes = {
delete: 8,
enter: 13,
esc: 27,
ctrl: 17,
alt: 18,
shift: 16,
super: 91,
super2: 93,
up: 38,
left: 37,
right: 39,
down: 40,
hyphen: 45,
underscore: 95,
question: 63,
exclamation: 33,
frontslash: 47,
backslash: 92,
comma: 44,
period: 46,
space: 32,
anyArrow: function (code) {
return code === keyCodes.up || code === keyCodes.down || code === keyCodes.left || code === keyCodes.right;
},
anyModifier: function (code) {
return code === keyCodes.ctrl || code === keyCodes.alt || code === keyCodes.shift || code === keyCodes.super || code === keyCodes.super2;
},
anyAlpha: function (code) {
return (97 <= code && code <= 122) || (65 <= code && code <= 90);
},
anyNumeric: function (code) {
return (48 <= code && code <= 57);
},
anyAlphaNumeric: function (code) {
return keyCodes.anyAlpha(code) || keyCodes.anyNumeric(code);
},
anyPrintable: function (code) {
return keyCodes.anyAlpha(code) || keyCodes.anyNumeric(code) || code === keyCodes.hyphen || code === keyCodes.underscore || code === keyCodes.question || code === keyCodes.exclamation || code === keyCodes.frontslash || code === keyCodes.backslash || code === keyCodes.comma || code === keyCodes.period || code === keyCodes.space;
}
};
return module.exports;
},
59: function (require, module, exports) {
var COLORS, DOM, SVG, helpers;
DOM = require(4);
SVG = require(115);
COLORS = require(5);
helpers = require(46);
var __template5 = require(106);
exports.default = __template5.default.extend();

var stepButton = exports.stepButton = DOM.template(['div', {
stateTriggers: {
'active': {
on: 'mousedown',
off: 'mouseup',
bubbles: false
}
},
attrs: {
tabindex: -1
},
style: {
display: 'inline-block',
width: '100%',
height: 17,
boxSizing: 'border-box',
verticalAlign: 'top',
outline: 'none',
cursor: 'pointer',
fill: COLORS.grey,
$active: {
fill: COLORS.grey_dark
}
}
}]);
var buttons = exports.buttons = DOM.template(['div', {
ref: 'buttons',
style: {
position: 'relative',
zIndex: 3,
top: '50%',
transform: 'translateY(-50%)',
display: 'inline-block',
width: 17,
paddingRight: function (field) {
return field.settings.inputPadding;
},
outline: 'none'
}
}, stepButton.extend({
children: [SVG.caretUp],
options: {
ref: 'stepUp'
}
}), stepButton.extend({
children: [SVG.caretDown],
options: {
ref: 'stepDown'
}
})]);
return module.exports;
},
60: function (require, module, exports) {
module.exports = {
placeholder: true,
validWhenMin: false,
validWhenMax: false,
autoWidth: false,
maxWidth: '100%',
height: 46,
buttons: true,
minValue: -2e308,
maxValue: 2e308,
step: 1,
enforce: false,
inputSibling: 'buttons'
};
return module.exports;
},
61: function (require, module, exports) {
var COLORS, DOM, SVG;
DOM = require(4);
SVG = require(115);
COLORS = require(5);
var __template2 = require(106);
exports.default = __template2.default.extend({
children: {
innerwrap: {
children: {
'input': ['div', {
props: {
tabIndex: 0
},
style: {
marginTop: 3,
height: 'auto',
cursor: 'default',
userSelect: 'none',
overflow: 'hidden'
}
}],
'caret': ['div', {
ref: 'caret',
styleAfterInsert: true,
style: {
position: 'relative',
zIndex: 3,
top: function (field) {
return (this.parent.styleParsed('height', true)) / 2 - this.styleParsed('height') / 2;
},
display: 'inline-block',
width: 17,
height: 17,
paddingRight: function (field) {
return field.settings.inputPadding;
},
verticalAlign: 'top',
outline: 'none',
pointerEvents: 'none',
fill: COLORS.grey
}
}, SVG.caretDown]
}
}
}
});

return module.exports;
},
62: function (require, module, exports) {
module.exports = {
placeholder: true,
validWhenIsChoice: false,
validWhenRegex: false,
validWhenChoseMin: 2e308,
autoWidth: false,
maxWidth: '100%',
height: 46,
labelFilter: null,
choices: [],
multiple: false,
dropdown: {
typeBuffer: true
},
inputSibling: 'caret'
};
return module.exports;
},
63: function (require, module, exports) {
var Condition, IS, SimplyBind;
IS = require(47);
SimplyBind = require(55);
Condition = class Condition {
constructor(field1, settings, callback1) {
var property, target;
this.field = field1;
this.settings = settings;
this.callback = callback1;
this.satisfied = false;
this.value = this.settings.value;
this.property = this.settings.property || '_value';
if (this.settings.property === 'value') {
this.property = '_value';
}
target = this.field.allFields[this.settings.target] || this.settings.target;
if (IS.field(target)) {
this.target = target;
} else {
return console.warn(`condition target not found for the provided ID '${this.settings.target}'`, this.field);
}
property = IS.array(this.target[this.property]) ? `array:${this.property}` : this.property;
SimplyBind(property, {
updateOnBind: false
}).of(this.target).and('visible').of(this.target.state).to(this.callback);
SimplyBind('satisfied', {
updateOnBind: false
}).of(this).to((newValue, oldValue) => {
var base;
if (oldValue != null) {
return typeof (base = this.field).emit === "function" ? base.emit('conditionChange', this) : void 0;
}
});
}
test() {
var comparison, comparisonOperators, passedComparisons, ref, targetValue;
if (!((ref = this.target) != null ? ref.state.visible : void 0)) {
return false;
}
comparison = (function () {
switch (false) {
case !IS.objectPlain(this.value):
return this.value;
case !IS.regex(this.value):
return {
'$regex': this.value
};
case !(this.value === 'valid' && !this.settings.property || !IS.defined(this.value)):
return 'valid';
default:
return {
'$eq': this.value
};
}
}).call(this);
if (comparison === 'valid') {
return this.target.validate();
}
targetValue = (() => {
var nestedObject, propertyChain;
if (this.property === '_value') {
return this.target.value;
}
propertyChain = this.property.split('.');
switch (false) {
case propertyChain.length !== 1:
return this.target[this.property];
case !IS.defined(this.target[this.property]):
return this.target[this.property];
default:
nestedObject = this.target;
while (IS.object(nestedObject)) {
nestedObject = nestedObject[propertyChain.pop()];
}
return nestedObject;
}
})();
comparisonOperators = Object.keys(comparison);
passedComparisons = comparisonOperators.filter(function (operator) {
var seekedValue;
seekedValue = comparison[operator];
switch (operator) {
case '$eq':
return targetValue === seekedValue;
case '$ne':
return targetValue !== seekedValue;
case '$gt':
return targetValue > seekedValue;
case '$gte':
return targetValue >= seekedValue;
case '$lt':
return targetValue < seekedValue;
case '$lte':
return targetValue <= seekedValue;
case '$ct':
return helpers.includes(targetValue, seekedValue);
case '$nct':
return !helpers.includes(targetValue, seekedValue);
case '$regex':
return seekedValue.test(targetValue);
case '$nregex':
return !seekedValue.test(targetValue);
case '$mask':
return helpers.testMask(targetValue, seekedValue);
default:
return false;
}
});
return passedComparisons.length === comparisonOperators.length;
}
static validate(conditions) {
var validConditions;
if (conditions) {
validConditions = conditions.filter(function (condition) {
return condition.satisfied = condition.test();
});
return validConditions.length === conditions.length;
}
}
static init(field, conditions, callback) {
return setTimeout(() => {
if (callback == null) {
callback = () => {
return field.validateConditions();
};
}
field.conditions = conditions.map(function (condition) {
return new Condition(field, condition, callback);
});
return callback();
});
}
};
module.exports = Condition;
return module.exports;
},
64: function (require, module, exports) {
var COLORS, DOM;
DOM = require(4);
COLORS = require(5);
exports.default = DOM.template(['div', {
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

var choiceGroup = exports.choiceGroup = DOM.template(['div', {
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
var choice = exports.choice = DOM.template(['div', {
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
var choiceIcon = exports.choiceIcon = DOM.template(['div', {
ref: 'icon',
style: {
position: 'absolute',
top: '50%',
display: 'block',
fontSize: '20px',
opacity: 0.16,
transform: 'translateY(-50%)'
}
}]);
return module.exports;
},
65: function (require, module, exports) {
module.exports = {
validWhenSelected: false,
validWhenIsChoice: false,
showSelectAll: false,
perGroup: 7,
spacing: 8,
choices: []
};
return module.exports;
},
66: function (require, module, exports) {
var extend;
extend = require(3);
var choiceFieldTemplates = require(64);
extend.transform(function (template) {
return template.extend();
})(exports, choiceFieldTemplates);
exports.default = exports.default;

return module.exports;
},
67: function (require, module, exports) {
module.exports = {
validWhenSelected: false,
validWhenIsChoice: false,
validWhenTrue: true,
choiceLabels: ['True', 'False'],
choices: [{
value: true
}, {
value: false
}],
spacing: 8
};
return module.exports;
},
68: function (require, module, exports) {
var COLORS, DOM;
DOM = require(4);
COLORS = require(5);
exports.default = DOM.template(['div', {
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
}]]);

return module.exports;
},
69: function (require, module, exports) {
var COLORS;
COLORS = require(5);
module.exports = {
validWhenTrue: true,
size: 50,
style: 'centered',
color: COLORS.green,
background: COLORS.grey_light,
triggerEvent: 'mouseup'
};
return module.exports;
},
70: function (require, module, exports) {
var COLORS, DOM, SVG;
DOM = require(4);
SVG = require(115);
COLORS = require(5);
var action = exports.action = DOM.template(['div', {
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
}, ['div', {
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
var collapseIcons = exports.collapseIcons = [SVG.caretUp.extend({
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
}), SVG.caretDown.extend({
options: {
style: {
display: 'block',
$collapsed: {
display: 'none'
}
}
}
})];
exports.default = DOM.template(['div', {
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
border: `1px solid ${COLORS.grey_light}`,
borderRadius: 3,
textAlign: 'left',
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
}]]);

return module.exports;
},
71: function (require, module, exports) {
module.exports = {
fields: {},
collapsable: true,
startCollapsed: false,
padding: 20,
fieldMargin: 0,
fieldAlign: 'top',
labelSize: 16,
color: (require(5)).grey_light4
};
return module.exports;
},
72: function (require, module, exports) {
var COLORS, DOM;
DOM = require(4);
COLORS = require(5);
var __template4 = require(70);
exports.default = DOM.template(['div', {
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
borderRadius: 3,
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
style: {
display: 'none',
fontFamily: 'inherit',
fontSize: '16px',
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
ref: 'collapse',
style: {
position: 'absolute',
top: 5,
right: 0,
lineHeight: 0,
fontSize: 0,
display: 'none',
$showLabel: {
$collapsable: {
display: 'block'
}
}
}
}, ['div', {
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
}, ...__template4.collapseIcons]], ['div', {
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
}, ['div', {
ref: 'addButton',
style: {
position: 'relative',
verticalAlign: 'middle',
boxSizing: 'border-box',
padding: 12,
backgroundColor: COLORS.grey_semi_light,
borderRadius: 3,
cursor: 'pointer',
userSelect: 'none',
lineHeight: '1em',
textAlign: 'center',
$disabled: {
display: 'none'
},
$inlineStyle: {
display: 'inline-block',
top: function (field) {
return (field.settings.groupMargin / 2) * -1;
}
}
}
}, ['div', {
style: {
display: 'inline-block',
width: 15,
height: 15,
color: COLORS.black,
fill: COLORS.black
}
}, require(116)]]]]);

exports.cloneIcon = (require(117)).extend({
options: {
style: {
width: 11
}
}
});
exports.removeIcon = (require(118)).extend({
options: {
style: {
width: 11
}
}
});
var blockGroup = exports.blockGroup = {};
var inlineGroup = exports.inlineGroup = {
default: {
children: {
innerwrap: {
options: {
style: {
display: 'inline-block',
verticalAlign: 'middle',
marginTop: 0
}
}
},
actions: {
options: {
events: {
inserted: function () {
return this.insertAfter(this.parent.child.innerwrap);
}
},
style: {
position: 'static',
verticalAlign: 'middle',
display: 'inline-table'
}
}
}
}
},
action: ['div', {
events: {
inserted: function () {
if (this.index) {
return this.style('borderTop', `1px solid ${COLORS.grey}`);
}
}
},
style: {
boxSizing: 'border-box',
display: 'table-row',
padding: 4
}
}, ['div', {
ref: 'icon',
style: {
verticalAlign: 'middle',
display: 'table-cell',
color: COLORS.black,
fill: COLORS.black,
opacity: 0.6,
$hover: {
opacity: 1
}
}
}]]
};
return module.exports;
},
73: function (require, module, exports) {
var __template3 = require(72);
module.exports = {
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
templates: __template3.inlineGroup
},
block: {
startCollapsed: false,
templates: __template3.blockGroup
}
}
};
return module.exports;
},
74: function (require, module, exports) {
((function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (factory((global.Keysim = {})));
})(this, (function (exports) {
'use strict';
var isEditable = function (element) {
if (element.ownerDocument.designMode && element.ownerDocument.designMode.toLowerCase() === 'on') {
return true;
}
switch (element.tagName.toLowerCase()) {
case 'input':
return isEditableInput(element);
case 'textarea':
return true;
}
if (isContentEditable(element)) {
return true;
}
return false;
};
function isContentEditable(element) {
if (element.contentEditable && element.contentEditable.toLowerCase() === 'true') {
return true;
}
if (element.contentEditable && element.contentEditable.toLowerCase() === 'inherit' && element.parentNode) {
return isContentEditable(element.parentNode);
}
return false;
}
function isEditableInput(input) {
switch (input.type) {
case 'text':
return true;
case 'email':
return true;
case 'password':
return true;
case 'search':
return true;
case 'tel':
return true;
case 'url':
return true;
default:
return false;
}
}
var classCallCheck = function (instance, Constructor) {
if (!(instance instanceof Constructor)) {
throw new TypeError("Cannot call a class as a function");
}
};
var createClass = (function () {
function defineProperties(target, props) {
for (var i = 0; i < props.length; i++) {
var descriptor = props[i];
descriptor.enumerable = descriptor.enumerable || false;
descriptor.configurable = true;
if (("value" in descriptor)) descriptor.writable = true;
Object.defineProperty(target, descriptor.key, descriptor);
}
}
return function (Constructor, protoProps, staticProps) {
if (protoProps) defineProperties(Constructor.prototype, protoProps);
if (staticProps) defineProperties(Constructor, staticProps);
return Constructor;
};
})();
var CTRL = 1 << 0;
var META = 1 << 1;
var ALT = 1 << 2;
var SHIFT = 1 << 3;
var KeyEvents = {
DOWN: 1 << 0,
PRESS: 1 << 1,
UP: 1 << 2,
INPUT: 1 << 3
};
KeyEvents.ALL = KeyEvents.DOWN | KeyEvents.PRESS | KeyEvents.UP | KeyEvents.INPUT;
var Keystroke = function Keystroke(modifiers, keyCode) {
classCallCheck(this, Keystroke);
this.modifiers = modifiers;
this.ctrlKey = !!(modifiers & CTRL);
this.metaKey = !!(modifiers & META);
this.altKey = !!(modifiers & ALT);
this.shiftKey = !!(modifiers & SHIFT);
this.keyCode = keyCode;
};
Keystroke.CTRL = CTRL;
Keystroke.META = META;
Keystroke.ALT = ALT;
Keystroke.SHIFT = SHIFT;
var Keyboard = (function () {
function Keyboard(charCodeKeyCodeMap, actionKeyCodeMap) {
classCallCheck(this, Keyboard);
this._charCodeKeyCodeMap = charCodeKeyCodeMap;
this._actionKeyCodeMap = actionKeyCodeMap;
}
createClass(Keyboard, [{
key: 'charCodeForKeystroke',
value: function charCodeForKeystroke(keystroke) {
var map = this._charCodeKeyCodeMap;
for (var charCode in map) {
if (Object.prototype.hasOwnProperty.call(map, charCode)) {
var keystrokeForCharCode = map[charCode];
if (keystroke.keyCode === keystrokeForCharCode.keyCode && keystroke.modifiers === keystrokeForCharCode.modifiers) {
return parseInt(charCode, 10);
}
}
}
return null;
}
}, {
key: 'createEventFromKeystroke',
value: function createEventFromKeystroke(type, keystroke, target) {
var document = target.ownerDocument;
var window = document.defaultView;
var Event = window.Event;
var event = void 0;
try {
event = new Event(type);
} catch (e) {
event = document.createEvent('UIEvents');
}
event.initEvent(type, true, true);
switch (type) {
case 'textInput':
event.data = String.fromCharCode(this.charCodeForKeystroke(keystroke));
break;
case 'keydown':
case 'keypress':
case 'keyup':
event.shiftKey = keystroke.shiftKey;
event.altKey = keystroke.altKey;
event.metaKey = keystroke.metaKey;
event.ctrlKey = keystroke.ctrlKey;
event.keyCode = type === 'keypress' ? this.charCodeForKeystroke(keystroke) : keystroke.keyCode;
event.charCode = type === 'keypress' ? event.keyCode : 0;
event.which = event.keyCode;
break;
}
return event;
}
}, {
key: 'dispatchEventsForAction',
value: function dispatchEventsForAction(action, target) {
var keystroke = this.keystrokeForAction(action);
this.dispatchEventsForKeystroke(keystroke, target);
}
}, {
key: 'dispatchEventsForInput',
value: function dispatchEventsForInput(input, target) {
var currentModifierState = 0;
for (var i = 0, length = input.length; i < length; i++) {
var keystroke = this.keystrokeForCharCode(input.charCodeAt(i));
this.dispatchModifierStateTransition(target, currentModifierState, keystroke.modifiers);
this.dispatchEventsForKeystroke(keystroke, target, false);
currentModifierState = keystroke.modifiers;
}
this.dispatchModifierStateTransition(target, currentModifierState, 0);
}
}, {
key: 'dispatchEventsForKeystroke',
value: function dispatchEventsForKeystroke(keystroke, target) {
var transitionModifiers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
var events = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : KeyEvents.ALL;
if (transitionModifiers) {
this.dispatchModifierStateTransition(target, 0, keystroke.modifiers, events);
}
var keydownEvent = void 0;
if (events & KeyEvents.DOWN) {
keydownEvent = this.createEventFromKeystroke('keydown', keystroke, target);
}
if (keydownEvent && target.dispatchEvent(keydownEvent) && this.targetCanReceiveTextInput(target)) {
var keypressEvent = void 0;
if (events & KeyEvents.PRESS) {
keypressEvent = this.createEventFromKeystroke('keypress', keystroke, target);
}
if (keypressEvent && keypressEvent.charCode && target.dispatchEvent(keypressEvent)) {
if (events & KeyEvents.INPUT) {
var textinputEvent = this.createEventFromKeystroke('textInput', keystroke, target);
target.dispatchEvent(textinputEvent);
var inputEvent = this.createEventFromKeystroke('input', keystroke, target);
target.dispatchEvent(inputEvent);
}
}
}
if (events & KeyEvents.UP) {
var keyupEvent = this.createEventFromKeystroke('keyup', keystroke, target);
target.dispatchEvent(keyupEvent);
}
if (transitionModifiers) {
this.dispatchModifierStateTransition(target, keystroke.modifiers, 0);
}
}
}, {
key: 'dispatchModifierStateTransition',
value: function dispatchModifierStateTransition(target, fromModifierState, toModifierState) {
var events = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : KeyEvents.ALL;
var currentModifierState = fromModifierState;
var didHaveMeta = (fromModifierState & META) === META;
var willHaveMeta = (toModifierState & META) === META;
var didHaveCtrl = (fromModifierState & CTRL) === CTRL;
var willHaveCtrl = (toModifierState & CTRL) === CTRL;
var didHaveShift = (fromModifierState & SHIFT) === SHIFT;
var willHaveShift = (toModifierState & SHIFT) === SHIFT;
var didHaveAlt = (fromModifierState & ALT) === ALT;
var willHaveAlt = (toModifierState & ALT) === ALT;
var includeKeyUp = events & KeyEvents.UP;
var includeKeyDown = events & KeyEvents.DOWN;
if (includeKeyUp && didHaveMeta === true && willHaveMeta === false) {
currentModifierState &= ~META;
target.dispatchEvent(this.createEventFromKeystroke('keyup', new Keystroke(currentModifierState, this._actionKeyCodeMap.META), target));
}
if (includeKeyUp && didHaveCtrl === true && willHaveCtrl === false) {
currentModifierState &= ~CTRL;
target.dispatchEvent(this.createEventFromKeystroke('keyup', new Keystroke(currentModifierState, this._actionKeyCodeMap.CTRL), target));
}
if (includeKeyUp && didHaveShift === true && willHaveShift === false) {
currentModifierState &= ~SHIFT;
target.dispatchEvent(this.createEventFromKeystroke('keyup', new Keystroke(currentModifierState, this._actionKeyCodeMap.SHIFT), target));
}
if (includeKeyUp && didHaveAlt === true && willHaveAlt === false) {
currentModifierState &= ~ALT;
target.dispatchEvent(this.createEventFromKeystroke('keyup', new Keystroke(currentModifierState, this._actionKeyCodeMap.ALT), target));
}
if (includeKeyDown && didHaveMeta === false && willHaveMeta === true) {
currentModifierState |= META;
target.dispatchEvent(this.createEventFromKeystroke('keydown', new Keystroke(currentModifierState, this._actionKeyCodeMap.META), target));
}
if (includeKeyDown && didHaveCtrl === false && willHaveCtrl === true) {
currentModifierState |= CTRL;
target.dispatchEvent(this.createEventFromKeystroke('keydown', new Keystroke(currentModifierState, this._actionKeyCodeMap.CTRL), target));
}
if (includeKeyDown && didHaveShift === false && willHaveShift === true) {
currentModifierState |= SHIFT;
target.dispatchEvent(this.createEventFromKeystroke('keydown', new Keystroke(currentModifierState, this._actionKeyCodeMap.SHIFT), target));
}
if (includeKeyDown && didHaveAlt === false && willHaveAlt === true) {
currentModifierState |= ALT;
target.dispatchEvent(this.createEventFromKeystroke('keydown', new Keystroke(currentModifierState, this._actionKeyCodeMap.ALT), target));
}
if (currentModifierState !== toModifierState) {
throw new Error('internal error, expected modifier state: ' + toModifierState + (', got: ' + currentModifierState));
}
}
}, {
key: 'keystrokeForAction',
value: function keystrokeForAction(action) {
var keyCode = null;
var modifiers = 0;
var parts = action.split('+');
var lastPart = parts.pop();
parts.forEach(function (part) {
switch (part.toUpperCase()) {
case 'CTRL':
modifiers |= CTRL;
break;
case 'META':
modifiers |= META;
break;
case 'ALT':
modifiers |= ALT;
break;
case 'SHIFT':
modifiers |= SHIFT;
break;
default:
throw new Error('in "' + action + '", invalid modifier: ' + part);
}
});
if ((lastPart.toUpperCase() in this._actionKeyCodeMap)) {
keyCode = this._actionKeyCodeMap[lastPart.toUpperCase()];
} else if (lastPart.length === 1) {
var lastPartKeystroke = this.keystrokeForCharCode(lastPart.charCodeAt(0));
modifiers |= lastPartKeystroke.modifiers;
keyCode = lastPartKeystroke.keyCode;
} else {
throw new Error('in "' + action + '", invalid action: ' + lastPart);
}
return new Keystroke(modifiers, keyCode);
}
}, {
key: 'keystrokeForCharCode',
value: function keystrokeForCharCode(charCode) {
return this._charCodeKeyCodeMap[charCode] || null;
}
}, {
key: 'targetCanReceiveTextInput',
value: function targetCanReceiveTextInput(target) {
if (!target) {
return false;
}
return isEditable(target);
}
}]);
return Keyboard;
})();
var US_ENGLISH_CHARCODE_KEYCODE_MAP = {
32: new Keystroke(0, 32),
33: new Keystroke(SHIFT, 49),
34: new Keystroke(SHIFT, 222),
35: new Keystroke(SHIFT, 51),
36: new Keystroke(SHIFT, 52),
37: new Keystroke(SHIFT, 53),
38: new Keystroke(SHIFT, 55),
39: new Keystroke(0, 222),
40: new Keystroke(SHIFT, 57),
41: new Keystroke(SHIFT, 48),
42: new Keystroke(SHIFT, 56),
43: new Keystroke(SHIFT, 187),
44: new Keystroke(0, 188),
45: new Keystroke(0, 189),
46: new Keystroke(0, 190),
47: new Keystroke(0, 191),
48: new Keystroke(0, 48),
49: new Keystroke(0, 49),
50: new Keystroke(0, 50),
51: new Keystroke(0, 51),
52: new Keystroke(0, 52),
53: new Keystroke(0, 53),
54: new Keystroke(0, 54),
55: new Keystroke(0, 55),
56: new Keystroke(0, 56),
57: new Keystroke(0, 57),
58: new Keystroke(SHIFT, 186),
59: new Keystroke(0, 186),
60: new Keystroke(SHIFT, 188),
61: new Keystroke(0, 187),
62: new Keystroke(SHIFT, 190),
63: new Keystroke(SHIFT, 191),
64: new Keystroke(SHIFT, 50),
65: new Keystroke(SHIFT, 65),
66: new Keystroke(SHIFT, 66),
67: new Keystroke(SHIFT, 67),
68: new Keystroke(SHIFT, 68),
69: new Keystroke(SHIFT, 69),
70: new Keystroke(SHIFT, 70),
71: new Keystroke(SHIFT, 71),
72: new Keystroke(SHIFT, 72),
73: new Keystroke(SHIFT, 73),
74: new Keystroke(SHIFT, 74),
75: new Keystroke(SHIFT, 75),
76: new Keystroke(SHIFT, 76),
77: new Keystroke(SHIFT, 77),
78: new Keystroke(SHIFT, 78),
79: new Keystroke(SHIFT, 79),
80: new Keystroke(SHIFT, 80),
81: new Keystroke(SHIFT, 81),
82: new Keystroke(SHIFT, 82),
83: new Keystroke(SHIFT, 83),
84: new Keystroke(SHIFT, 84),
85: new Keystroke(SHIFT, 85),
86: new Keystroke(SHIFT, 86),
87: new Keystroke(SHIFT, 87),
88: new Keystroke(SHIFT, 88),
89: new Keystroke(SHIFT, 89),
90: new Keystroke(SHIFT, 90),
91: new Keystroke(0, 219),
92: new Keystroke(0, 220),
93: new Keystroke(0, 221),
96: new Keystroke(0, 192),
97: new Keystroke(0, 65),
98: new Keystroke(0, 66),
99: new Keystroke(0, 67),
100: new Keystroke(0, 68),
101: new Keystroke(0, 69),
102: new Keystroke(0, 70),
103: new Keystroke(0, 71),
104: new Keystroke(0, 72),
105: new Keystroke(0, 73),
106: new Keystroke(0, 74),
107: new Keystroke(0, 75),
108: new Keystroke(0, 76),
109: new Keystroke(0, 77),
110: new Keystroke(0, 78),
111: new Keystroke(0, 79),
112: new Keystroke(0, 80),
113: new Keystroke(0, 81),
114: new Keystroke(0, 82),
115: new Keystroke(0, 83),
116: new Keystroke(0, 84),
117: new Keystroke(0, 85),
118: new Keystroke(0, 86),
119: new Keystroke(0, 87),
120: new Keystroke(0, 88),
121: new Keystroke(0, 89),
122: new Keystroke(0, 90),
123: new Keystroke(SHIFT, 219),
124: new Keystroke(SHIFT, 220),
125: new Keystroke(SHIFT, 221),
126: new Keystroke(SHIFT, 192)
};
var US_ENGLISH_ACTION_KEYCODE_MAP = {
BACKSPACE: 8,
TAB: 9,
ENTER: 13,
SHIFT: 16,
CTRL: 17,
ALT: 18,
PAUSE: 19,
CAPSLOCK: 20,
ESCAPE: 27,
PAGEUP: 33,
PAGEDOWN: 34,
END: 35,
HOME: 36,
LEFT: 37,
UP: 38,
RIGHT: 39,
DOWN: 40,
INSERT: 45,
DELETE: 46,
META: 91,
F1: 112,
F2: 113,
F3: 114,
F4: 115,
F5: 116,
F6: 117,
F7: 118,
F8: 119,
F9: 120,
F10: 121,
F11: 122,
F12: 123
};
Keyboard.US_ENGLISH = new Keyboard(US_ENGLISH_CHARCODE_KEYCODE_MAP, US_ENGLISH_ACTION_KEYCODE_MAP);
exports.KeyEvents = KeyEvents;
exports.Keystroke = Keystroke;
exports.Keyboard = Keyboard;
Object.defineProperty(exports, '__esModule', {
value: true
});
})));
return module.exports;
},
75: function (require, module, exports) {
'use strict';
module.exports = (promise, onFinally) => {
onFinally = onFinally || (() => {});
return promise.then(val => new Promise(resolve => {
resolve(onFinally());
}).then(() => val), err => new Promise(resolve => {
resolve(onFinally());
}).then(() => {
throw err;
}));
};
return module.exports;
},
76: function (require, module, exports) {
var SAMPLE_STYLE, styleConfig;
var __constants3 = require(77);
SAMPLE_STYLE = document.createElement('div').style;
var includes = exports.includes = function includes(target, item) {
return target && target.indexOf(item) !== -1;
};
var isIterable = exports.isIterable = function isIterable(target) {
return target && typeof target === 'object' && typeof target.length === 'number' && !target.nodeType;
};
var toKebabCase = exports.toKebabCase = function toKebabCase(string) {
return string.replace(__constants3.REGEX_KEBAB, function (e, letter) {
return `-${letter.toLowerCase()}`;
});
};
var isPropSupported = exports.isPropSupported = function isPropSupported(property) {
return typeof SAMPLE_STYLE[property] !== 'undefined';
};
var isValueSupported = exports.isValueSupported = function isValueSupported(property, value) {
if (window.CSS && window.CSS.supports) {
return window.CSS.supports(property, value);
} else {
SAMPLE_STYLE[property] = value;
return SAMPLE_STYLE[property] === '' + value;
}
};
var getPrefix = exports.getPrefix = function getPrefix(property, skipInitialCheck) {
var j, len1, prefix;
if (skipInitialCheck || !isPropSupported(property)) {
for ((j = 0, len1 = __constants3.POSSIBLE_PREFIXES.length); j < len1; j++) {
prefix = __constants3.POSSIBLE_PREFIXES[j];
if (isPropSupported(`-${prefix}-${property}`)) {
return `-${prefix}-`;
}
}
}
return '';
};
var normalizeProperty = exports.normalizeProperty = function normalizeProperty(property) {
property = toKebabCase(property);
if (isPropSupported(property)) {
return property;
} else {
return `${getPrefix(property, true)}${property}`;
}
};
var normalizeValue = exports.normalizeValue = function normalizeValue(property, value) {
if (includes(__constants3.REQUIRES_UNIT_VALUE, property) && value !== null) {
value = '' + value;
if (__constants3.REGEX_DIGITS.test(value) && !__constants3.REGEX_LEN_VAL.test(value) && !__constants3.REGEX_SPACE.test(value)) {
value += property === 'line-height' ? 'em' : 'px';
}
}
return value;
};
var sort = exports.sort = function sort(array) {
var great, i, len, less, pivot;
if (array.length < 2) {
return array;
} else {
pivot = array[0];
less = [];
great = [];
len = array.length;
i = 0;
while (++i !== len) {
if (array[i] <= pivot) {
less.push(array[i]);
} else {
great.push(array[i]);
}
}
return sort(less).concat(pivot, sort(great));
}
};
var hash = exports.hash = function hash(string) {
var hsh, i, length;
hsh = 5381;
i = -1;
length = string.length;
while (++i !== string.length) {
hsh = ((hsh << 5) - hsh) + string.charCodeAt(i);
hsh |= 0;
}
return '_' + (hsh < 0 ? hsh * -2 : hsh);
};
var ruleToString = exports.ruleToString = function ruleToString(rule, important) {
var j, len1, output, prop, property, props, value;
output = '';
props = sort(Object.keys(rule));
for ((j = 0, len1 = props.length); j < len1; j++) {
prop = props[j];
if (typeof rule[prop] === 'string' || typeof rule[prop] === 'number') {
property = normalizeProperty(prop);
value = normalizeValue(property, rule[prop]);
if (important) {
value += " !important";
}
output += `${property}:${value};`;
}
}
return output;
};
var inlineStyleConfig = exports.inlineStyleConfig = styleConfig = Object.create(null);
var inlineStyle = exports.inlineStyle = function inlineStyle(rule, valueToStore, level) {
var config, styleEl;
if (!(config = styleConfig[level])) {
styleEl = document.createElement('style');
styleEl.id = `quickcss${level || ''}`;
document.head.appendChild(styleEl);
styleConfig[level] = config = {
el: styleEl,
content: '',
cache: Object.create(null)
};
}
if (!config.cache[rule]) {
config.cache[rule] = valueToStore || true;
config.el.textContent = config.content += rule;
}
};
var clearInlineStyle = exports.clearInlineStyle = function clearInlineStyle(level) {
var config, j, key, keys, len1;
if (config = styleConfig[level]) {
if (!config.content) {
return;
}
config.el.textContent = config.content = '';
keys = Object.keys(config.cache);
for ((j = 0, len1 = keys.length); j < len1; j++) {
key = keys[j];
config.cache[key] = null;
}
}
};
return module.exports;
},
77: function (require, module, exports) {
var REGEX_LEN_VAL = exports.REGEX_LEN_VAL = /^\d+(?:[a-z]|\%)+$/i;
var REGEX_DIGITS = exports.REGEX_DIGITS = /\d+$/;
var REGEX_SPACE = exports.REGEX_SPACE = /\s/;
var REGEX_KEBAB = exports.REGEX_KEBAB = /([A-Z])+/g;
var IMPORTANT = exports.IMPORTANT = 'important';
var POSSIBLE_PREFIXES = exports.POSSIBLE_PREFIXES = ['webkit', 'moz', 'ms', 'o'];
var REQUIRES_UNIT_VALUE = exports.REQUIRES_UNIT_VALUE = ['background-position-x', 'background-position-y', 'block-size', 'border-width', 'columnRule-width', 'cx', 'cy', 'font-size', 'grid-column-gap', 'grid-row-gap', 'height', 'inline-size', 'line-height', 'minBlock-size', 'min-height', 'min-inline-size', 'min-width', 'max-height', 'max-width', 'outline-offset', 'outline-width', 'perspective', 'shape-margin', 'stroke-dashoffset', 'stroke-width', 'text-indent', 'width', 'word-spacing', 'top', 'bottom', 'left', 'right', 'x', 'y'];
var QUAD_SHORTHANDS = exports.QUAD_SHORTHANDS = ['margin', 'padding', 'border', 'border-radius'];
var DIRECTIONS = exports.DIRECTIONS = ['top', 'bottom', 'left', 'right'];
QUAD_SHORTHANDS.forEach(function (property) {
var direction, i, len;
REQUIRES_UNIT_VALUE.push(property);
for ((i = 0, len = DIRECTIONS.length); i < len; i++) {
direction = DIRECTIONS[i];
REQUIRES_UNIT_VALUE.push(property + '-' + direction);
}
});
return module.exports;
},
79: function (require, module, exports) {
var Checks, availSets;
availSets = {
natives: require(119),
dom: require(120)
};
Checks = class Checks {
create() {
var args;
if (arguments.length) {
args = Array.prototype.slice.call(arguments);
}
return new Checks(args);
}
constructor(sets) {
var i, len, set;
if (sets == null) {
sets = ['natives'];
}
for ((i = 0, len = sets.length); i < len; i++) {
set = sets[i];
if (availSets[set]) {
this.load(availSets[set]);
}
}
}
load(set) {
var key, value;
if (availSets.natives.string(set)) {
set = availSets[set];
}
if (!availSets.natives.objectPlain(set)) {
return;
}
for (key in set) {
value = set[key];
this[key] = value;
}
}
};
module.exports = Checks.prototype.create();
return module.exports;
},
92: function (require, module, exports) {
function exclude() {
var excludes = [].slice.call(arguments);
function excludeProps(res, obj) {
Object.keys(obj).forEach(function (key) {
if (!~excludes.indexOf(key)) res[key] = obj[key];
});
}
return function extendExclude() {
var args = [].slice.call(arguments), i = 0, res = {};
for (; i < args.length; i++) {
excludeProps(res, args[i]);
}
return res;
};
}
;
module.exports = AssertionError;
function AssertionError(message, _props, ssf) {
var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON'), props = extend(_props || ({}));
this.message = message || 'Unspecified AssertionError';
this.showDiff = false;
for (var key in props) {
this[key] = props[key];
}
ssf = ssf || arguments.callee;
if (ssf && Error.captureStackTrace) {
Error.captureStackTrace(this, ssf);
} else {
try {
throw new Error();
} catch (e) {
this.stack = e.stack;
}
}
}
AssertionError.prototype = Object.create(Error.prototype);
AssertionError.prototype.name = 'AssertionError';
AssertionError.prototype.constructor = AssertionError;
AssertionError.prototype.toJSON = function (stack) {
var extend = exclude('constructor', 'toJSON', 'stack'), props = extend({
name: this.name
}, this);
if (false !== stack && this.stack) {
props.stack = this.stack;
}
return props;
};
return module.exports;
},
93: function (require, module, exports) {
var pathval = require(122);
exports.test = require(123);
exports.type = require(44);
exports.expectTypes = require(124);
exports.getMessage = require(125);
exports.getActual = require(126);
exports.inspect = require(127);
exports.objDisplay = require(128);
exports.flag = require(129);
exports.transferFlags = require(130);
exports.eql = require(131);
exports.getPathInfo = pathval.getPathInfo;
exports.hasProperty = pathval.hasProperty;
exports.getName = require(132);
exports.addProperty = require(133);
exports.addMethod = require(134);
exports.overwriteProperty = require(135);
exports.overwriteMethod = require(136);
exports.addChainableMethod = require(137);
exports.overwriteChainableMethod = require(138);
exports.compareByInspect = require(139);
exports.getOwnEnumerablePropertySymbols = require(140);
exports.getOwnEnumerableProperties = require(141);
exports.checkError = require(142);
exports.proxify = require(143);
exports.addLengthGuard = require(144);
exports.isProxyEnabled = require(145);
exports.isNaN = require(146);
return module.exports;
},
94: function (require, module, exports) {
module.exports = {
includeStack: false,
showDiff: true,
truncateThreshold: 40,
useProxy: true,
proxyExcludedKeys: ['then', 'inspect', 'toJSON']
};
return module.exports;
},
95: function (require, module, exports) {
var config = require(94);
module.exports = function (_chai, util) {
var AssertionError = _chai.AssertionError, flag = util.flag;
_chai.Assertion = Assertion;
function Assertion(obj, msg, ssfi, lockSsfi) {
flag(this, 'ssfi', ssfi || Assertion);
flag(this, 'lockSsfi', lockSsfi);
flag(this, 'object', obj);
flag(this, 'message', msg);
return util.proxify(this);
}
Object.defineProperty(Assertion, 'includeStack', {
get: function () {
console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
return config.includeStack;
},
set: function (value) {
console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
config.includeStack = value;
}
});
Object.defineProperty(Assertion, 'showDiff', {
get: function () {
console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
return config.showDiff;
},
set: function (value) {
console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
config.showDiff = value;
}
});
Assertion.addProperty = function (name, fn) {
util.addProperty(this.prototype, name, fn);
};
Assertion.addMethod = function (name, fn) {
util.addMethod(this.prototype, name, fn);
};
Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
};
Assertion.overwriteProperty = function (name, fn) {
util.overwriteProperty(this.prototype, name, fn);
};
Assertion.overwriteMethod = function (name, fn) {
util.overwriteMethod(this.prototype, name, fn);
};
Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {
util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
};
Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
var ok = util.test(this, arguments);
if (false !== showDiff) showDiff = true;
if (undefined === expected && undefined === _actual) showDiff = false;
if (true !== config.showDiff) showDiff = false;
if (!ok) {
msg = util.getMessage(this, arguments);
var actual = util.getActual(this, arguments);
throw new AssertionError(msg, {
actual: actual,
expected: expected,
showDiff: showDiff
}, ((config.includeStack)) ? this.assert : flag(this, 'ssfi'));
}
};
Object.defineProperty(Assertion.prototype, '_obj', {
get: function () {
return flag(this, 'object');
},
set: function (val) {
flag(this, 'object', val);
}
});
};
return module.exports;
},
96: function (require, module, exports) {
module.exports = function (chai, _) {
var Assertion = chai.Assertion, AssertionError = chai.AssertionError, flag = _.flag;
['to', 'be', 'been', 'is', 'and', 'has', 'have', 'with', 'that', 'which', 'at', 'of', 'same', 'but', 'does'].forEach(function (chain) {
Assertion.addProperty(chain);
});
Assertion.addProperty('not', function () {
flag(this, 'negate', true);
});
Assertion.addProperty('deep', function () {
flag(this, 'deep', true);
});
Assertion.addProperty('nested', function () {
flag(this, 'nested', true);
});
Assertion.addProperty('own', function () {
flag(this, 'own', true);
});
Assertion.addProperty('ordered', function () {
flag(this, 'ordered', true);
});
Assertion.addProperty('any', function () {
flag(this, 'any', true);
flag(this, 'all', false);
});
Assertion.addProperty('all', function () {
flag(this, 'all', true);
flag(this, 'any', false);
});
function an(type, msg) {
if (msg) flag(this, 'message', msg);
type = type.toLowerCase();
var obj = flag(this, 'object'), article = ~['a', 'e', 'i', 'o', 'u'].indexOf(type.charAt(0)) ? 'an ' : 'a ';
this.assert(type === _.type(obj).toLowerCase(), 'expected #{this} to be ' + article + type, 'expected #{this} not to be ' + article + type);
}
Assertion.addChainableMethod('an', an);
Assertion.addChainableMethod('a', an);
function SameValueZero(a, b) {
return (_.isNaN(a) && _.isNaN(b)) || a === b;
}
function includeChainingBehavior() {
flag(this, 'contains', true);
}
function include(val, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), objType = _.type(obj).toLowerCase(), flagMsg = flag(this, 'message'), negate = flag(this, 'negate'), ssfi = flag(this, 'ssfi'), isDeep = flag(this, 'deep'), descriptor = isDeep ? 'deep ' : '';
flagMsg = flagMsg ? flagMsg + ': ' : '';
var included = false;
switch (objType) {
case 'string':
included = obj.indexOf(val) !== -1;
break;
case 'weakset':
if (isDeep) {
throw new AssertionError(flagMsg + 'unable to use .deep.include with WeakSet', undefined, ssfi);
}
included = obj.has(val);
break;
case 'map':
var isEql = isDeep ? _.eql : SameValueZero;
obj.forEach(function (item) {
included = included || isEql(item, val);
});
break;
case 'set':
if (isDeep) {
obj.forEach(function (item) {
included = included || _.eql(item, val);
});
} else {
included = obj.has(val);
}
break;
case 'array':
if (isDeep) {
included = obj.some(function (item) {
return _.eql(item, val);
});
} else {
included = obj.indexOf(val) !== -1;
}
break;
default:
if (val !== Object(val)) {
throw new AssertionError(flagMsg + 'object tested must be an array, a map, an object,' + ' a set, a string, or a weakset, but ' + objType + ' given', undefined, ssfi);
}
var props = Object.keys(val), firstErr = null, numErrs = 0;
props.forEach(function (prop) {
var propAssertion = new Assertion(obj);
_.transferFlags(this, propAssertion, true);
flag(propAssertion, 'lockSsfi', true);
if (!negate || props.length === 1) {
propAssertion.property(prop, val[prop]);
return;
}
try {
propAssertion.property(prop, val[prop]);
} catch (err) {
if (!_.checkError.compatibleConstructor(err, AssertionError)) {
throw err;
}
if (firstErr === null) firstErr = err;
numErrs++;
}
}, this);
if (negate && props.length > 1 && numErrs === props.length) {
throw firstErr;
}
return;
}
this.assert(included, 'expected #{this} to ' + descriptor + 'include ' + _.inspect(val), 'expected #{this} to not ' + descriptor + 'include ' + _.inspect(val));
}
Assertion.addChainableMethod('include', include, includeChainingBehavior);
Assertion.addChainableMethod('contain', include, includeChainingBehavior);
Assertion.addChainableMethod('contains', include, includeChainingBehavior);
Assertion.addChainableMethod('includes', include, includeChainingBehavior);
Assertion.addProperty('ok', function () {
this.assert(flag(this, 'object'), 'expected #{this} to be truthy', 'expected #{this} to be falsy');
});
Assertion.addProperty('true', function () {
this.assert(true === flag(this, 'object'), 'expected #{this} to be true', 'expected #{this} to be false', flag(this, 'negate') ? false : true);
});
Assertion.addProperty('false', function () {
this.assert(false === flag(this, 'object'), 'expected #{this} to be false', 'expected #{this} to be true', flag(this, 'negate') ? true : false);
});
Assertion.addProperty('null', function () {
this.assert(null === flag(this, 'object'), 'expected #{this} to be null', 'expected #{this} not to be null');
});
Assertion.addProperty('undefined', function () {
this.assert(undefined === flag(this, 'object'), 'expected #{this} to be undefined', 'expected #{this} not to be undefined');
});
Assertion.addProperty('NaN', function () {
this.assert(_.isNaN(flag(this, 'object')), 'expected #{this} to be NaN', 'expected #{this} not to be NaN');
});
Assertion.addProperty('exist', function () {
var val = flag(this, 'object');
this.assert(val !== null && val !== undefined, 'expected #{this} to exist', 'expected #{this} to not exist');
});
Assertion.addProperty('empty', function () {
var val = flag(this, 'object'), ssfi = flag(this, 'ssfi'), flagMsg = flag(this, 'message'), itemsCount;
flagMsg = flagMsg ? flagMsg + ': ' : '';
switch (_.type(val).toLowerCase()) {
case 'array':
case 'string':
itemsCount = val.length;
break;
case 'map':
case 'set':
itemsCount = val.size;
break;
case 'weakmap':
case 'weakset':
throw new AssertionError(flagMsg + '.empty was passed a weak collection', undefined, ssfi);
case 'function':
var msg = flagMsg + '.empty was passed a function ' + _.getName(val);
throw new AssertionError(msg.trim(), undefined, ssfi);
default:
if (val !== Object(val)) {
throw new AssertionError(flagMsg + '.empty was passed non-string primitive ' + _.inspect(val), undefined, ssfi);
}
itemsCount = Object.keys(val).length;
}
this.assert(0 === itemsCount, 'expected #{this} to be empty', 'expected #{this} not to be empty');
});
function checkArguments() {
var obj = flag(this, 'object'), type = _.type(obj);
this.assert('Arguments' === type, 'expected #{this} to be arguments but got ' + type, 'expected #{this} to not be arguments');
}
Assertion.addProperty('arguments', checkArguments);
Assertion.addProperty('Arguments', checkArguments);
function assertEqual(val, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object');
if (flag(this, 'deep')) {
return this.eql(val);
} else {
this.assert(val === obj, 'expected #{this} to equal #{exp}', 'expected #{this} to not equal #{exp}', val, this._obj, true);
}
}
Assertion.addMethod('equal', assertEqual);
Assertion.addMethod('equals', assertEqual);
Assertion.addMethod('eq', assertEqual);
function assertEql(obj, msg) {
if (msg) flag(this, 'message', msg);
this.assert(_.eql(obj, flag(this, 'object')), 'expected #{this} to deeply equal #{exp}', 'expected #{this} to not deeply equal #{exp}', obj, this._obj, true);
}
Assertion.addMethod('eql', assertEql);
Assertion.addMethod('eqls', assertEql);
function assertAbove(n, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), doLength = flag(this, 'doLength'), flagMsg = flag(this, 'message'), msgPrefix = (((flagMsg)) ? flagMsg + ': ' : ''), ssfi = flag(this, 'ssfi'), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), shouldThrow = true;
if (doLength) {
new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
}
if (!doLength && (objType === 'date' && nType !== 'date')) {
errorMessage = msgPrefix + 'the argument to above must be a date';
} else if (nType !== 'number' && (doLength || objType === 'number')) {
errorMessage = msgPrefix + 'the argument to above must be a number';
} else if (!doLength && (objType !== 'date' && objType !== 'number')) {
var printObj = ((objType === 'string')) ? "'" + obj + "'" : obj;
errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
} else {
shouldThrow = false;
}
if (shouldThrow) {
throw new AssertionError(errorMessage, undefined, ssfi);
}
if (doLength) {
var len = obj.length;
this.assert(len > n, 'expected #{this} to have a length above #{exp} but got #{act}', 'expected #{this} to not have a length above #{exp}', n, len);
} else {
this.assert(obj > n, 'expected #{this} to be above #{exp}', 'expected #{this} to be at most #{exp}', n);
}
}
Assertion.addMethod('above', assertAbove);
Assertion.addMethod('gt', assertAbove);
Assertion.addMethod('greaterThan', assertAbove);
function assertLeast(n, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), doLength = flag(this, 'doLength'), flagMsg = flag(this, 'message'), msgPrefix = (((flagMsg)) ? flagMsg + ': ' : ''), ssfi = flag(this, 'ssfi'), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), shouldThrow = true;
if (doLength) {
new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
}
if (!doLength && (objType === 'date' && nType !== 'date')) {
errorMessage = msgPrefix + 'the argument to least must be a date';
} else if (nType !== 'number' && (doLength || objType === 'number')) {
errorMessage = msgPrefix + 'the argument to least must be a number';
} else if (!doLength && (objType !== 'date' && objType !== 'number')) {
var printObj = ((objType === 'string')) ? "'" + obj + "'" : obj;
errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
} else {
shouldThrow = false;
}
if (shouldThrow) {
throw new AssertionError(errorMessage, undefined, ssfi);
}
if (doLength) {
var len = obj.length;
this.assert(len >= n, 'expected #{this} to have a length at least #{exp} but got #{act}', 'expected #{this} to have a length below #{exp}', n, len);
} else {
this.assert(obj >= n, 'expected #{this} to be at least #{exp}', 'expected #{this} to be below #{exp}', n);
}
}
Assertion.addMethod('least', assertLeast);
Assertion.addMethod('gte', assertLeast);
function assertBelow(n, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), doLength = flag(this, 'doLength'), flagMsg = flag(this, 'message'), msgPrefix = (((flagMsg)) ? flagMsg + ': ' : ''), ssfi = flag(this, 'ssfi'), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), shouldThrow = true;
if (doLength) {
new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
}
if (!doLength && (objType === 'date' && nType !== 'date')) {
errorMessage = msgPrefix + 'the argument to below must be a date';
} else if (nType !== 'number' && (doLength || objType === 'number')) {
errorMessage = msgPrefix + 'the argument to below must be a number';
} else if (!doLength && (objType !== 'date' && objType !== 'number')) {
var printObj = ((objType === 'string')) ? "'" + obj + "'" : obj;
errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
} else {
shouldThrow = false;
}
if (shouldThrow) {
throw new AssertionError(errorMessage, undefined, ssfi);
}
if (doLength) {
var len = obj.length;
this.assert(len < n, 'expected #{this} to have a length below #{exp} but got #{act}', 'expected #{this} to not have a length below #{exp}', n, len);
} else {
this.assert(obj < n, 'expected #{this} to be below #{exp}', 'expected #{this} to be at least #{exp}', n);
}
}
Assertion.addMethod('below', assertBelow);
Assertion.addMethod('lt', assertBelow);
Assertion.addMethod('lessThan', assertBelow);
function assertMost(n, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), doLength = flag(this, 'doLength'), flagMsg = flag(this, 'message'), msgPrefix = (((flagMsg)) ? flagMsg + ': ' : ''), ssfi = flag(this, 'ssfi'), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), shouldThrow = true;
if (doLength) {
new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
}
if (!doLength && (objType === 'date' && nType !== 'date')) {
errorMessage = msgPrefix + 'the argument to most must be a date';
} else if (nType !== 'number' && (doLength || objType === 'number')) {
errorMessage = msgPrefix + 'the argument to most must be a number';
} else if (!doLength && (objType !== 'date' && objType !== 'number')) {
var printObj = ((objType === 'string')) ? "'" + obj + "'" : obj;
errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
} else {
shouldThrow = false;
}
if (shouldThrow) {
throw new AssertionError(errorMessage, undefined, ssfi);
}
if (doLength) {
var len = obj.length;
this.assert(len <= n, 'expected #{this} to have a length at most #{exp} but got #{act}', 'expected #{this} to have a length above #{exp}', n, len);
} else {
this.assert(obj <= n, 'expected #{this} to be at most #{exp}', 'expected #{this} to be above #{exp}', n);
}
}
Assertion.addMethod('most', assertMost);
Assertion.addMethod('lte', assertMost);
Assertion.addMethod('within', function (start, finish, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), doLength = flag(this, 'doLength'), flagMsg = flag(this, 'message'), msgPrefix = (((flagMsg)) ? flagMsg + ': ' : ''), ssfi = flag(this, 'ssfi'), objType = _.type(obj).toLowerCase(), startType = _.type(start).toLowerCase(), finishType = _.type(finish).toLowerCase(), shouldThrow = true, range = ((startType === 'date' && finishType === 'date')) ? start.toUTCString() + '..' + finish.toUTCString() : start + '..' + finish;
if (doLength) {
new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
}
if (!doLength && (objType === 'date' && (startType !== 'date' || finishType !== 'date'))) {
errorMessage = msgPrefix + 'the arguments to within must be dates';
} else if ((startType !== 'number' || finishType !== 'number') && (doLength || objType === 'number')) {
errorMessage = msgPrefix + 'the arguments to within must be numbers';
} else if (!doLength && (objType !== 'date' && objType !== 'number')) {
var printObj = ((objType === 'string')) ? "'" + obj + "'" : obj;
errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
} else {
shouldThrow = false;
}
if (shouldThrow) {
throw new AssertionError(errorMessage, undefined, ssfi);
}
if (doLength) {
var len = obj.length;
this.assert(len >= start && len <= finish, 'expected #{this} to have a length within ' + range, 'expected #{this} to not have a length within ' + range);
} else {
this.assert(obj >= start && obj <= finish, 'expected #{this} to be within ' + range, 'expected #{this} to not be within ' + range);
}
});
function assertInstanceOf(constructor, msg) {
if (msg) flag(this, 'message', msg);
var target = flag(this, 'object');
var ssfi = flag(this, 'ssfi');
var flagMsg = flag(this, 'message');
try {
var isInstanceOf = target instanceof constructor;
} catch (err) {
if (err instanceof TypeError) {
flagMsg = flagMsg ? flagMsg + ': ' : '';
throw new AssertionError(flagMsg + 'The instanceof assertion needs a constructor but ' + _.type(constructor) + ' was given.', undefined, ssfi);
}
throw err;
}
var name = _.getName(constructor);
if (name === null) {
name = 'an unnamed constructor';
}
this.assert(isInstanceOf, 'expected #{this} to be an instance of ' + name, 'expected #{this} to not be an instance of ' + name);
}
;
Assertion.addMethod('instanceof', assertInstanceOf);
Assertion.addMethod('instanceOf', assertInstanceOf);
function assertProperty(name, val, msg) {
if (msg) flag(this, 'message', msg);
var isNested = flag(this, 'nested'), isOwn = flag(this, 'own'), flagMsg = flag(this, 'message'), obj = flag(this, 'object'), ssfi = flag(this, 'ssfi');
if (isNested && isOwn) {
flagMsg = flagMsg ? flagMsg + ': ' : '';
throw new AssertionError(flagMsg + 'The "nested" and "own" flags cannot be combined.', undefined, ssfi);
}
if (obj === null || obj === undefined) {
flagMsg = flagMsg ? flagMsg + ': ' : '';
throw new AssertionError(flagMsg + 'Target cannot be null or undefined.', undefined, ssfi);
}
var isDeep = flag(this, 'deep'), negate = flag(this, 'negate'), pathInfo = isNested ? _.getPathInfo(obj, name) : null, value = isNested ? pathInfo.value : obj[name];
var descriptor = '';
if (isDeep) descriptor += 'deep ';
if (isOwn) descriptor += 'own ';
if (isNested) descriptor += 'nested ';
descriptor += 'property ';
var hasProperty;
if (isOwn) hasProperty = Object.prototype.hasOwnProperty.call(obj, name); else if (isNested) hasProperty = pathInfo.exists; else hasProperty = _.hasProperty(obj, name);
if (!negate || arguments.length === 1) {
this.assert(hasProperty, 'expected #{this} to have ' + descriptor + _.inspect(name), 'expected #{this} to not have ' + descriptor + _.inspect(name));
}
if (arguments.length > 1) {
this.assert(hasProperty && (isDeep ? _.eql(val, value) : val === value), 'expected #{this} to have ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}', 'expected #{this} to not have ' + descriptor + _.inspect(name) + ' of #{act}', val, value);
}
flag(this, 'object', value);
}
Assertion.addMethod('property', assertProperty);
function assertOwnProperty(name, value, msg) {
flag(this, 'own', true);
assertProperty.apply(this, arguments);
}
Assertion.addMethod('ownProperty', assertOwnProperty);
Assertion.addMethod('haveOwnProperty', assertOwnProperty);
function assertOwnPropertyDescriptor(name, descriptor, msg) {
if (typeof descriptor === 'string') {
msg = descriptor;
descriptor = null;
}
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object');
var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
if (actualDescriptor && descriptor) {
this.assert(_.eql(descriptor, actualDescriptor), 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to match ' + _.inspect(descriptor) + ', got ' + _.inspect(actualDescriptor), 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to not match ' + _.inspect(descriptor), descriptor, actualDescriptor, true);
} else {
this.assert(actualDescriptor, 'expected #{this} to have an own property descriptor for ' + _.inspect(name), 'expected #{this} to not have an own property descriptor for ' + _.inspect(name));
}
flag(this, 'object', actualDescriptor);
}
Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);
function assertLengthChain() {
flag(this, 'doLength', true);
}
function assertLength(n, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
var len = obj.length;
this.assert(len == n, 'expected #{this} to have a length of #{exp} but got #{act}', 'expected #{this} to not have a length of #{act}', n, len);
}
Assertion.addChainableMethod('length', assertLength, assertLengthChain);
Assertion.addChainableMethod('lengthOf', assertLength, assertLengthChain);
function assertMatch(re, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object');
this.assert(re.exec(obj), 'expected #{this} to match ' + re, 'expected #{this} not to match ' + re);
}
Assertion.addMethod('match', assertMatch);
Assertion.addMethod('matches', assertMatch);
Assertion.addMethod('string', function (str, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(obj, flagMsg, ssfi, true).is.a('string');
this.assert(~obj.indexOf(str), 'expected #{this} to contain ' + _.inspect(str), 'expected #{this} to not contain ' + _.inspect(str));
});
function assertKeys(keys) {
var obj = flag(this, 'object'), objType = _.type(obj), keysType = _.type(keys), ssfi = flag(this, 'ssfi'), isDeep = flag(this, 'deep'), str, deepStr = '', ok = true, flagMsg = flag(this, 'message');
flagMsg = flagMsg ? flagMsg + ': ' : '';
var mixedArgsMsg = flagMsg + 'when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments';
if (objType === 'Map' || objType === 'Set') {
deepStr = isDeep ? 'deeply ' : '';
actual = [];
obj.forEach(function (val, key) {
actual.push(key);
});
if (keysType !== 'Array') {
keys = Array.prototype.slice.call(arguments);
}
} else {
actual = _.getOwnEnumerableProperties(obj);
switch (keysType) {
case 'Array':
if (arguments.length > 1) {
throw new AssertionError(mixedArgsMsg, undefined, ssfi);
}
break;
case 'Object':
if (arguments.length > 1) {
throw new AssertionError(mixedArgsMsg, undefined, ssfi);
}
keys = Object.keys(keys);
break;
default:
keys = Array.prototype.slice.call(arguments);
}
keys = keys.map(function (val) {
return typeof val === 'symbol' ? val : String(val);
});
}
if (!keys.length) {
throw new AssertionError(flagMsg + 'keys required', undefined, ssfi);
}
var len = keys.length, any = flag(this, 'any'), all = flag(this, 'all'), expected = keys, actual;
if (!any && !all) {
all = true;
}
if (any) {
ok = expected.some(function (expectedKey) {
return actual.some(function (actualKey) {
if (isDeep) {
return _.eql(expectedKey, actualKey);
} else {
return expectedKey === actualKey;
}
});
});
}
if (all) {
ok = expected.every(function (expectedKey) {
return actual.some(function (actualKey) {
if (isDeep) {
return _.eql(expectedKey, actualKey);
} else {
return expectedKey === actualKey;
}
});
});
if (!flag(this, 'contains')) {
ok = ok && keys.length == actual.length;
}
}
if (len > 1) {
keys = keys.map(function (key) {
return _.inspect(key);
});
var last = keys.pop();
if (all) {
str = keys.join(', ') + ', and ' + last;
}
if (any) {
str = keys.join(', ') + ', or ' + last;
}
} else {
str = _.inspect(keys[0]);
}
str = (len > 1 ? 'keys ' : 'key ') + str;
str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;
this.assert(ok, 'expected #{this} to ' + deepStr + str, 'expected #{this} to not ' + deepStr + str, expected.slice(0).sort(_.compareByInspect), actual.sort(_.compareByInspect), true);
}
Assertion.addMethod('keys', assertKeys);
Assertion.addMethod('key', assertKeys);
function assertThrows(errorLike, errMsgMatcher, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), ssfi = flag(this, 'ssfi'), flagMsg = flag(this, 'message'), negate = flag(this, 'negate') || false;
new Assertion(obj, flagMsg, ssfi, true).is.a('function');
if (errorLike instanceof RegExp || typeof errorLike === 'string') {
errMsgMatcher = errorLike;
errorLike = null;
}
var caughtErr;
try {
obj();
} catch (err) {
caughtErr = err;
}
var everyArgIsUndefined = errorLike === undefined && errMsgMatcher === undefined;
var everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
var errorLikeFail = false;
var errMsgMatcherFail = false;
if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
var errorLikeString = 'an error';
if (errorLike instanceof Error) {
errorLikeString = '#{exp}';
} else if (errorLike) {
errorLikeString = _.checkError.getConstructorName(errorLike);
}
this.assert(caughtErr, 'expected #{this} to throw ' + errorLikeString, 'expected #{this} to not throw an error but #{act} was thrown', errorLike && errorLike.toString(), (caughtErr instanceof Error ? caughtErr.toString() : (typeof caughtErr === 'string' ? caughtErr : caughtErr && _.checkError.getConstructorName(caughtErr))));
}
if (errorLike && caughtErr) {
if (errorLike instanceof Error) {
var isCompatibleInstance = _.checkError.compatibleInstance(caughtErr, errorLike);
if (isCompatibleInstance === negate) {
if (everyArgIsDefined && negate) {
errorLikeFail = true;
} else {
this.assert(negate, 'expected #{this} to throw #{exp} but #{act} was thrown', 'expected #{this} to not throw #{exp}' + (caughtErr && !negate ? ' but #{act} was thrown' : ''), errorLike.toString(), caughtErr.toString());
}
}
}
var isCompatibleConstructor = _.checkError.compatibleConstructor(caughtErr, errorLike);
if (isCompatibleConstructor === negate) {
if (everyArgIsDefined && negate) {
errorLikeFail = true;
} else {
this.assert(negate, 'expected #{this} to throw #{exp} but #{act} was thrown', 'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : ''), (errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike)), (caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr)));
}
}
}
if (caughtErr && errMsgMatcher !== undefined && errMsgMatcher !== null) {
var placeholder = 'including';
if (errMsgMatcher instanceof RegExp) {
placeholder = 'matching';
}
var isCompatibleMessage = _.checkError.compatibleMessage(caughtErr, errMsgMatcher);
if (isCompatibleMessage === negate) {
if (everyArgIsDefined && negate) {
errMsgMatcherFail = true;
} else {
this.assert(negate, 'expected #{this} to throw error ' + placeholder + ' #{exp} but got #{act}', 'expected #{this} to throw error not ' + placeholder + ' #{exp}', errMsgMatcher, _.checkError.getMessage(caughtErr));
}
}
}
if (errorLikeFail && errMsgMatcherFail) {
this.assert(negate, 'expected #{this} to throw #{exp} but #{act} was thrown', 'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : ''), (errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike)), (caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr)));
}
flag(this, 'object', caughtErr);
}
;
Assertion.addMethod('throw', assertThrows);
Assertion.addMethod('throws', assertThrows);
Assertion.addMethod('Throw', assertThrows);
function respondTo(method, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), itself = flag(this, 'itself'), context = (('function' === typeof obj && !itself)) ? obj.prototype[method] : obj[method];
this.assert('function' === typeof context, 'expected #{this} to respond to ' + _.inspect(method), 'expected #{this} to not respond to ' + _.inspect(method));
}
Assertion.addMethod('respondTo', respondTo);
Assertion.addMethod('respondsTo', respondTo);
Assertion.addProperty('itself', function () {
flag(this, 'itself', true);
});
function satisfy(matcher, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object');
var result = matcher(obj);
this.assert(result, 'expected #{this} to satisfy ' + _.objDisplay(matcher), 'expected #{this} to not satisfy' + _.objDisplay(matcher), flag(this, 'negate') ? false : true, result);
}
Assertion.addMethod('satisfy', satisfy);
Assertion.addMethod('satisfies', satisfy);
function closeTo(expected, delta, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(obj, flagMsg, ssfi, true).is.a('number');
if (typeof expected !== 'number' || typeof delta !== 'number') {
flagMsg = flagMsg ? flagMsg + ': ' : '';
throw new AssertionError(flagMsg + 'the arguments to closeTo or approximately must be numbers', undefined, ssfi);
}
this.assert(Math.abs(obj - expected) <= delta, 'expected #{this} to be close to ' + expected + ' +/- ' + delta, 'expected #{this} not to be close to ' + expected + ' +/- ' + delta);
}
Assertion.addMethod('closeTo', closeTo);
Assertion.addMethod('approximately', closeTo);
function isSubsetOf(subset, superset, cmp, contains, ordered) {
if (!contains) {
if (subset.length !== superset.length) return false;
superset = superset.slice();
}
return subset.every(function (elem, idx) {
if (ordered) return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];
if (!cmp) {
var matchIdx = superset.indexOf(elem);
if (matchIdx === -1) return false;
if (!contains) superset.splice(matchIdx, 1);
return true;
}
return superset.some(function (elem2, matchIdx) {
if (!cmp(elem, elem2)) return false;
if (!contains) superset.splice(matchIdx, 1);
return true;
});
});
}
Assertion.addMethod('members', function (subset, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(obj, flagMsg, ssfi, true).to.be.an('array');
new Assertion(subset, flagMsg, ssfi, true).to.be.an('array');
var contains = flag(this, 'contains');
var ordered = flag(this, 'ordered');
var subject, failMsg, failNegateMsg, lengthCheck;
if (contains) {
subject = ordered ? 'an ordered superset' : 'a superset';
failMsg = 'expected #{this} to be ' + subject + ' of #{exp}';
failNegateMsg = 'expected #{this} to not be ' + subject + ' of #{exp}';
} else {
subject = ordered ? 'ordered members' : 'members';
failMsg = 'expected #{this} to have the same ' + subject + ' as #{exp}';
failNegateMsg = 'expected #{this} to not have the same ' + subject + ' as #{exp}';
}
var cmp = flag(this, 'deep') ? _.eql : undefined;
this.assert(isSubsetOf(subset, obj, cmp, contains, ordered), failMsg, failNegateMsg, subset, obj, true);
});
function oneOf(list, msg) {
if (msg) flag(this, 'message', msg);
var expected = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(list, flagMsg, ssfi, true).to.be.an('array');
this.assert(list.indexOf(expected) > -1, 'expected #{this} to be one of #{exp}', 'expected #{this} to not be one of #{exp}', list, expected);
}
Assertion.addMethod('oneOf', oneOf);
function assertChanges(subject, prop, msg) {
if (msg) flag(this, 'message', msg);
var fn = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(fn, flagMsg, ssfi, true).is.a('function');
var initial;
if (!prop) {
new Assertion(subject, flagMsg, ssfi, true).is.a('function');
initial = subject();
} else {
new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
initial = subject[prop];
}
fn();
var final = prop === undefined || prop === null ? subject() : subject[prop];
var msgObj = prop === undefined || prop === null ? initial : '.' + prop;
flag(this, 'deltaMsgObj', msgObj);
flag(this, 'initialDeltaValue', initial);
flag(this, 'finalDeltaValue', final);
flag(this, 'deltaBehavior', 'change');
flag(this, 'realDelta', final !== initial);
this.assert(initial !== final, 'expected ' + msgObj + ' to change', 'expected ' + msgObj + ' to not change');
}
Assertion.addMethod('change', assertChanges);
Assertion.addMethod('changes', assertChanges);
function assertIncreases(subject, prop, msg) {
if (msg) flag(this, 'message', msg);
var fn = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(fn, flagMsg, ssfi, true).is.a('function');
var initial;
if (!prop) {
new Assertion(subject, flagMsg, ssfi, true).is.a('function');
initial = subject();
} else {
new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
initial = subject[prop];
}
new Assertion(initial, flagMsg, ssfi, true).is.a('number');
fn();
var final = prop === undefined || prop === null ? subject() : subject[prop];
var msgObj = prop === undefined || prop === null ? initial : '.' + prop;
flag(this, 'deltaMsgObj', msgObj);
flag(this, 'initialDeltaValue', initial);
flag(this, 'finalDeltaValue', final);
flag(this, 'deltaBehavior', 'increase');
flag(this, 'realDelta', final - initial);
this.assert(final - initial > 0, 'expected ' + msgObj + ' to increase', 'expected ' + msgObj + ' to not increase');
}
Assertion.addMethod('increase', assertIncreases);
Assertion.addMethod('increases', assertIncreases);
function assertDecreases(subject, prop, msg) {
if (msg) flag(this, 'message', msg);
var fn = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(fn, flagMsg, ssfi, true).is.a('function');
var initial;
if (!prop) {
new Assertion(subject, flagMsg, ssfi, true).is.a('function');
initial = subject();
} else {
new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
initial = subject[prop];
}
new Assertion(initial, flagMsg, ssfi, true).is.a('number');
fn();
var final = prop === undefined || prop === null ? subject() : subject[prop];
var msgObj = prop === undefined || prop === null ? initial : '.' + prop;
flag(this, 'deltaMsgObj', msgObj);
flag(this, 'initialDeltaValue', initial);
flag(this, 'finalDeltaValue', final);
flag(this, 'deltaBehavior', 'decrease');
flag(this, 'realDelta', initial - final);
this.assert(final - initial < 0, 'expected ' + msgObj + ' to decrease', 'expected ' + msgObj + ' to not decrease');
}
Assertion.addMethod('decrease', assertDecreases);
Assertion.addMethod('decreases', assertDecreases);
function assertDelta(delta, msg) {
if (msg) flag(this, 'message', msg);
var msgObj = flag(this, 'deltaMsgObj');
var initial = flag(this, 'initialDeltaValue');
var final = flag(this, 'finalDeltaValue');
var behavior = flag(this, 'deltaBehavior');
var realDelta = flag(this, 'realDelta');
var expression;
if (behavior === 'change') {
expression = Math.abs(final - initial) === Math.abs(delta);
} else {
expression = realDelta === Math.abs(delta);
}
this.assert(expression, 'expected ' + msgObj + ' to ' + behavior + ' by ' + delta, 'expected ' + msgObj + ' to not ' + behavior + ' by ' + delta);
}
Assertion.addMethod('by', assertDelta);
Assertion.addProperty('extensible', function () {
var obj = flag(this, 'object');
var isExtensible = obj === Object(obj) && Object.isExtensible(obj);
this.assert(isExtensible, 'expected #{this} to be extensible', 'expected #{this} to not be extensible');
});
Assertion.addProperty('sealed', function () {
var obj = flag(this, 'object');
var isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;
this.assert(isSealed, 'expected #{this} to be sealed', 'expected #{this} to not be sealed');
});
Assertion.addProperty('frozen', function () {
var obj = flag(this, 'object');
var isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;
this.assert(isFrozen, 'expected #{this} to be frozen', 'expected #{this} to not be frozen');
});
Assertion.addProperty('finite', function (msg) {
var obj = flag(this, 'object');
this.assert(typeof obj === "number" && isFinite(obj), 'expected #{this} to be a finite number', 'expected #{this} to not be a finite number');
});
};
return module.exports;
},
97: function (require, module, exports) {
module.exports = function (chai, util) {
chai.expect = function (val, message) {
return new chai.Assertion(val, message);
};
chai.expect.fail = function (actual, expected, message, operator) {
message = message || 'expect.fail()';
throw new chai.AssertionError(message, {
actual: actual,
expected: expected,
operator: operator
}, chai.expect.fail);
};
};
return module.exports;
},
98: function (require, module, exports) {
module.exports = function (chai, util) {
var Assertion = chai.Assertion;
function loadShould() {
function shouldGetter() {
if (this instanceof String || this instanceof Number || this instanceof Boolean || typeof Symbol === 'function' && this instanceof Symbol) {
return new Assertion(this.valueOf(), null, shouldGetter);
}
return new Assertion(this, null, shouldGetter);
}
function shouldSetter(value) {
Object.defineProperty(this, 'should', {
value: value,
enumerable: true,
configurable: true,
writable: true
});
}
Object.defineProperty(Object.prototype, 'should', {
set: shouldSetter,
get: shouldGetter,
configurable: true
});
var should = {};
should.fail = function (actual, expected, message, operator) {
message = message || 'should.fail()';
throw new chai.AssertionError(message, {
actual: actual,
expected: expected,
operator: operator
}, should.fail);
};
should.equal = function (val1, val2, msg) {
new Assertion(val1, msg).to.equal(val2);
};
should.Throw = function (fn, errt, errs, msg) {
new Assertion(fn, msg).to.Throw(errt, errs);
};
should.exist = function (val, msg) {
new Assertion(val, msg).to.exist;
};
should.not = {};
should.not.equal = function (val1, val2, msg) {
new Assertion(val1, msg).to.not.equal(val2);
};
should.not.Throw = function (fn, errt, errs, msg) {
new Assertion(fn, msg).to.not.Throw(errt, errs);
};
should.not.exist = function (val, msg) {
new Assertion(val, msg).to.not.exist;
};
should['throw'] = should['Throw'];
should.not['throw'] = should.not['Throw'];
return should;
}
;
chai.should = loadShould;
chai.Should = loadShould;
};
return module.exports;
},
99: function (require, module, exports) {
module.exports = function (chai, util) {
var Assertion = chai.Assertion, flag = util.flag;
var assert = chai.assert = function (express, errmsg) {
var test = new Assertion(null, null, chai.assert, true);
test.assert(express, errmsg, '[ negation message unavailable ]');
};
assert.fail = function (actual, expected, message, operator) {
message = message || 'assert.fail()';
throw new chai.AssertionError(message, {
actual: actual,
expected: expected,
operator: operator
}, assert.fail);
};
assert.isOk = function (val, msg) {
new Assertion(val, msg, assert.isOk, true).is.ok;
};
assert.isNotOk = function (val, msg) {
new Assertion(val, msg, assert.isNotOk, true).is.not.ok;
};
assert.equal = function (act, exp, msg) {
var test = new Assertion(act, msg, assert.equal, true);
test.assert(exp == flag(test, 'object'), 'expected #{this} to equal #{exp}', 'expected #{this} to not equal #{act}', exp, act, true);
};
assert.notEqual = function (act, exp, msg) {
var test = new Assertion(act, msg, assert.notEqual, true);
test.assert(exp != flag(test, 'object'), 'expected #{this} to not equal #{exp}', 'expected #{this} to equal #{act}', exp, act, true);
};
assert.strictEqual = function (act, exp, msg) {
new Assertion(act, msg, assert.strictEqual, true).to.equal(exp);
};
assert.notStrictEqual = function (act, exp, msg) {
new Assertion(act, msg, assert.notStrictEqual, true).to.not.equal(exp);
};
assert.deepEqual = assert.deepStrictEqual = function (act, exp, msg) {
new Assertion(act, msg, assert.deepEqual, true).to.eql(exp);
};
assert.notDeepEqual = function (act, exp, msg) {
new Assertion(act, msg, assert.notDeepEqual, true).to.not.eql(exp);
};
assert.isAbove = function (val, abv, msg) {
new Assertion(val, msg, assert.isAbove, true).to.be.above(abv);
};
assert.isAtLeast = function (val, atlst, msg) {
new Assertion(val, msg, assert.isAtLeast, true).to.be.least(atlst);
};
assert.isBelow = function (val, blw, msg) {
new Assertion(val, msg, assert.isBelow, true).to.be.below(blw);
};
assert.isAtMost = function (val, atmst, msg) {
new Assertion(val, msg, assert.isAtMost, true).to.be.most(atmst);
};
assert.isTrue = function (val, msg) {
new Assertion(val, msg, assert.isTrue, true).is['true'];
};
assert.isNotTrue = function (val, msg) {
new Assertion(val, msg, assert.isNotTrue, true).to.not.equal(true);
};
assert.isFalse = function (val, msg) {
new Assertion(val, msg, assert.isFalse, true).is['false'];
};
assert.isNotFalse = function (val, msg) {
new Assertion(val, msg, assert.isNotFalse, true).to.not.equal(false);
};
assert.isNull = function (val, msg) {
new Assertion(val, msg, assert.isNull, true).to.equal(null);
};
assert.isNotNull = function (val, msg) {
new Assertion(val, msg, assert.isNotNull, true).to.not.equal(null);
};
assert.isNaN = function (val, msg) {
new Assertion(val, msg, assert.isNaN, true).to.be.NaN;
};
assert.isNotNaN = function (val, msg) {
new Assertion(val, msg, assert.isNotNaN, true).not.to.be.NaN;
};
assert.exists = function (val, msg) {
new Assertion(val, msg, assert.exists, true).to.exist;
};
assert.notExists = function (val, msg) {
new Assertion(val, msg, assert.notExists, true).to.not.exist;
};
assert.isUndefined = function (val, msg) {
new Assertion(val, msg, assert.isUndefined, true).to.equal(undefined);
};
assert.isDefined = function (val, msg) {
new Assertion(val, msg, assert.isDefined, true).to.not.equal(undefined);
};
assert.isFunction = function (val, msg) {
new Assertion(val, msg, assert.isFunction, true).to.be.a('function');
};
assert.isNotFunction = function (val, msg) {
new Assertion(val, msg, assert.isNotFunction, true).to.not.be.a('function');
};
assert.isObject = function (val, msg) {
new Assertion(val, msg, assert.isObject, true).to.be.a('object');
};
assert.isNotObject = function (val, msg) {
new Assertion(val, msg, assert.isNotObject, true).to.not.be.a('object');
};
assert.isArray = function (val, msg) {
new Assertion(val, msg, assert.isArray, true).to.be.an('array');
};
assert.isNotArray = function (val, msg) {
new Assertion(val, msg, assert.isNotArray, true).to.not.be.an('array');
};
assert.isString = function (val, msg) {
new Assertion(val, msg, assert.isString, true).to.be.a('string');
};
assert.isNotString = function (val, msg) {
new Assertion(val, msg, assert.isNotString, true).to.not.be.a('string');
};
assert.isNumber = function (val, msg) {
new Assertion(val, msg, assert.isNumber, true).to.be.a('number');
};
assert.isNotNumber = function (val, msg) {
new Assertion(val, msg, assert.isNotNumber, true).to.not.be.a('number');
};
assert.isFinite = function (val, msg) {
new Assertion(val, msg, assert.isFinite, true).to.be.finite;
};
assert.isBoolean = function (val, msg) {
new Assertion(val, msg, assert.isBoolean, true).to.be.a('boolean');
};
assert.isNotBoolean = function (val, msg) {
new Assertion(val, msg, assert.isNotBoolean, true).to.not.be.a('boolean');
};
assert.typeOf = function (val, type, msg) {
new Assertion(val, msg, assert.typeOf, true).to.be.a(type);
};
assert.notTypeOf = function (val, type, msg) {
new Assertion(val, msg, assert.notTypeOf, true).to.not.be.a(type);
};
assert.instanceOf = function (val, type, msg) {
new Assertion(val, msg, assert.instanceOf, true).to.be.instanceOf(type);
};
assert.notInstanceOf = function (val, type, msg) {
new Assertion(val, msg, assert.notInstanceOf, true).to.not.be.instanceOf(type);
};
assert.include = function (exp, inc, msg) {
new Assertion(exp, msg, assert.include, true).include(inc);
};
assert.notInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.notInclude, true).not.include(inc);
};
assert.deepInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.deepInclude, true).deep.include(inc);
};
assert.notDeepInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.notDeepInclude, true).not.deep.include(inc);
};
assert.nestedInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.nestedInclude, true).nested.include(inc);
};
assert.notNestedInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.notNestedInclude, true).not.nested.include(inc);
};
assert.deepNestedInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.deepNestedInclude, true).deep.nested.include(inc);
};
assert.notDeepNestedInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.notDeepNestedInclude, true).not.deep.nested.include(inc);
};
assert.ownInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.ownInclude, true).own.include(inc);
};
assert.notOwnInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.notOwnInclude, true).not.own.include(inc);
};
assert.deepOwnInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.deepOwnInclude, true).deep.own.include(inc);
};
assert.notDeepOwnInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.notDeepOwnInclude, true).not.deep.own.include(inc);
};
assert.match = function (exp, re, msg) {
new Assertion(exp, msg, assert.match, true).to.match(re);
};
assert.notMatch = function (exp, re, msg) {
new Assertion(exp, msg, assert.notMatch, true).to.not.match(re);
};
assert.property = function (obj, prop, msg) {
new Assertion(obj, msg, assert.property, true).to.have.property(prop);
};
assert.notProperty = function (obj, prop, msg) {
new Assertion(obj, msg, assert.notProperty, true).to.not.have.property(prop);
};
assert.propertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.propertyVal, true).to.have.property(prop, val);
};
assert.notPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.notPropertyVal, true).to.not.have.property(prop, val);
};
assert.deepPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.deepPropertyVal, true).to.have.deep.property(prop, val);
};
assert.notDeepPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.notDeepPropertyVal, true).to.not.have.deep.property(prop, val);
};
assert.ownProperty = function (obj, prop, msg) {
new Assertion(obj, msg, assert.ownProperty, true).to.have.own.property(prop);
};
assert.notOwnProperty = function (obj, prop, msg) {
new Assertion(obj, msg, assert.notOwnProperty, true).to.not.have.own.property(prop);
};
assert.ownPropertyVal = function (obj, prop, value, msg) {
new Assertion(obj, msg, assert.ownPropertyVal, true).to.have.own.property(prop, value);
};
assert.notOwnPropertyVal = function (obj, prop, value, msg) {
new Assertion(obj, msg, assert.notOwnPropertyVal, true).to.not.have.own.property(prop, value);
};
assert.deepOwnPropertyVal = function (obj, prop, value, msg) {
new Assertion(obj, msg, assert.deepOwnPropertyVal, true).to.have.deep.own.property(prop, value);
};
assert.notDeepOwnPropertyVal = function (obj, prop, value, msg) {
new Assertion(obj, msg, assert.notDeepOwnPropertyVal, true).to.not.have.deep.own.property(prop, value);
};
assert.nestedProperty = function (obj, prop, msg) {
new Assertion(obj, msg, assert.nestedProperty, true).to.have.nested.property(prop);
};
assert.notNestedProperty = function (obj, prop, msg) {
new Assertion(obj, msg, assert.notNestedProperty, true).to.not.have.nested.property(prop);
};
assert.nestedPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.nestedPropertyVal, true).to.have.nested.property(prop, val);
};
assert.notNestedPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.notNestedPropertyVal, true).to.not.have.nested.property(prop, val);
};
assert.deepNestedPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.deepNestedPropertyVal, true).to.have.deep.nested.property(prop, val);
};
assert.notDeepNestedPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.notDeepNestedPropertyVal, true).to.not.have.deep.nested.property(prop, val);
};
assert.lengthOf = function (exp, len, msg) {
new Assertion(exp, msg, assert.lengthOf, true).to.have.lengthOf(len);
};
assert.hasAnyKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.hasAnyKeys, true).to.have.any.keys(keys);
};
assert.hasAllKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.hasAllKeys, true).to.have.all.keys(keys);
};
assert.containsAllKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.containsAllKeys, true).to.contain.all.keys(keys);
};
assert.doesNotHaveAnyKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.doesNotHaveAnyKeys, true).to.not.have.any.keys(keys);
};
assert.doesNotHaveAllKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.doesNotHaveAllKeys, true).to.not.have.all.keys(keys);
};
assert.hasAnyDeepKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.hasAnyDeepKeys, true).to.have.any.deep.keys(keys);
};
assert.hasAllDeepKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.hasAllDeepKeys, true).to.have.all.deep.keys(keys);
};
assert.containsAllDeepKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.containsAllDeepKeys, true).to.contain.all.deep.keys(keys);
};
assert.doesNotHaveAnyDeepKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.doesNotHaveAnyDeepKeys, true).to.not.have.any.deep.keys(keys);
};
assert.doesNotHaveAllDeepKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.doesNotHaveAllDeepKeys, true).to.not.have.all.deep.keys(keys);
};
assert.throws = function (fn, errorLike, errMsgMatcher, msg) {
if ('string' === typeof errorLike || errorLike instanceof RegExp) {
errMsgMatcher = errorLike;
errorLike = null;
}
var assertErr = new Assertion(fn, msg, assert.throws, true).to.throw(errorLike, errMsgMatcher);
return flag(assertErr, 'object');
};
assert.doesNotThrow = function (fn, errorLike, errMsgMatcher, msg) {
if ('string' === typeof errorLike || errorLike instanceof RegExp) {
errMsgMatcher = errorLike;
errorLike = null;
}
new Assertion(fn, msg, assert.doesNotThrow, true).to.not.throw(errorLike, errMsgMatcher);
};
assert.operator = function (val, operator, val2, msg) {
var ok;
switch (operator) {
case '==':
ok = val == val2;
break;
case '===':
ok = val === val2;
break;
case '>':
ok = val > val2;
break;
case '>=':
ok = val >= val2;
break;
case '<':
ok = val < val2;
break;
case '<=':
ok = val <= val2;
break;
case '!=':
ok = val != val2;
break;
case '!==':
ok = val !== val2;
break;
default:
msg = msg ? msg + ': ' : msg;
throw new chai.AssertionError(msg + 'Invalid operator "' + operator + '"', undefined, assert.operator);
}
var test = new Assertion(ok, msg, assert.operator, true);
test.assert(true === flag(test, 'object'), 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2), 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2));
};
assert.closeTo = function (act, exp, delta, msg) {
new Assertion(act, msg, assert.closeTo, true).to.be.closeTo(exp, delta);
};
assert.approximately = function (act, exp, delta, msg) {
new Assertion(act, msg, assert.approximately, true).to.be.approximately(exp, delta);
};
assert.sameMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.sameMembers, true).to.have.same.members(set2);
};
assert.notSameMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.notSameMembers, true).to.not.have.same.members(set2);
};
assert.sameDeepMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.sameDeepMembers, true).to.have.same.deep.members(set2);
};
assert.notSameDeepMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.notSameDeepMembers, true).to.not.have.same.deep.members(set2);
};
assert.sameOrderedMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.sameOrderedMembers, true).to.have.same.ordered.members(set2);
};
assert.notSameOrderedMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.notSameOrderedMembers, true).to.not.have.same.ordered.members(set2);
};
assert.sameDeepOrderedMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.sameDeepOrderedMembers, true).to.have.same.deep.ordered.members(set2);
};
assert.notSameDeepOrderedMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.notSameDeepOrderedMembers, true).to.not.have.same.deep.ordered.members(set2);
};
assert.includeMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.includeMembers, true).to.include.members(subset);
};
assert.notIncludeMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.notIncludeMembers, true).to.not.include.members(subset);
};
assert.includeDeepMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.includeDeepMembers, true).to.include.deep.members(subset);
};
assert.notIncludeDeepMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.notIncludeDeepMembers, true).to.not.include.deep.members(subset);
};
assert.includeOrderedMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.includeOrderedMembers, true).to.include.ordered.members(subset);
};
assert.notIncludeOrderedMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.notIncludeOrderedMembers, true).to.not.include.ordered.members(subset);
};
assert.includeDeepOrderedMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.includeDeepOrderedMembers, true).to.include.deep.ordered.members(subset);
};
assert.notIncludeDeepOrderedMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.notIncludeDeepOrderedMembers, true).to.not.include.deep.ordered.members(subset);
};
assert.oneOf = function (inList, list, msg) {
new Assertion(inList, msg, assert.oneOf, true).to.be.oneOf(list);
};
assert.changes = function (fn, obj, prop, msg) {
if (arguments.length === 3 && typeof obj === 'function') {
msg = prop;
prop = null;
}
new Assertion(fn, msg, assert.changes, true).to.change(obj, prop);
};
assert.changesBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
new Assertion(fn, msg, assert.changesBy, true).to.change(obj, prop).by(delta);
};
assert.doesNotChange = function (fn, obj, prop, msg) {
if (arguments.length === 3 && typeof obj === 'function') {
msg = prop;
prop = null;
}
return new Assertion(fn, msg, assert.doesNotChange, true).to.not.change(obj, prop);
};
assert.changesButNotBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
new Assertion(fn, msg, assert.changesButNotBy, true).to.change(obj, prop).but.not.by(delta);
};
assert.increases = function (fn, obj, prop, msg) {
if (arguments.length === 3 && typeof obj === 'function') {
msg = prop;
prop = null;
}
return new Assertion(fn, msg, assert.increases, true).to.increase(obj, prop);
};
assert.increasesBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
new Assertion(fn, msg, assert.increasesBy, true).to.increase(obj, prop).by(delta);
};
assert.doesNotIncrease = function (fn, obj, prop, msg) {
if (arguments.length === 3 && typeof obj === 'function') {
msg = prop;
prop = null;
}
return new Assertion(fn, msg, assert.doesNotIncrease, true).to.not.increase(obj, prop);
};
assert.increasesButNotBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
new Assertion(fn, msg, assert.increasesButNotBy, true).to.increase(obj, prop).but.not.by(delta);
};
assert.decreases = function (fn, obj, prop, msg) {
if (arguments.length === 3 && typeof obj === 'function') {
msg = prop;
prop = null;
}
return new Assertion(fn, msg, assert.decreases, true).to.decrease(obj, prop);
};
assert.decreasesBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
new Assertion(fn, msg, assert.decreasesBy, true).to.decrease(obj, prop).by(delta);
};
assert.doesNotDecrease = function (fn, obj, prop, msg) {
if (arguments.length === 3 && typeof obj === 'function') {
msg = prop;
prop = null;
}
return new Assertion(fn, msg, assert.doesNotDecrease, true).to.not.decrease(obj, prop);
};
assert.doesNotDecreaseBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
return new Assertion(fn, msg, assert.doesNotDecreaseBy, true).to.not.decrease(obj, prop).by(delta);
};
assert.decreasesButNotBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
new Assertion(fn, msg, assert.decreasesButNotBy, true).to.decrease(obj, prop).but.not.by(delta);
};
assert.ifError = function (val) {
if (val) {
throw (val);
}
};
assert.isExtensible = function (obj, msg) {
new Assertion(obj, msg, assert.isExtensible, true).to.be.extensible;
};
assert.isNotExtensible = function (obj, msg) {
new Assertion(obj, msg, assert.isNotExtensible, true).to.not.be.extensible;
};
assert.isSealed = function (obj, msg) {
new Assertion(obj, msg, assert.isSealed, true).to.be.sealed;
};
assert.isNotSealed = function (obj, msg) {
new Assertion(obj, msg, assert.isNotSealed, true).to.not.be.sealed;
};
assert.isFrozen = function (obj, msg) {
new Assertion(obj, msg, assert.isFrozen, true).to.be.frozen;
};
assert.isNotFrozen = function (obj, msg) {
new Assertion(obj, msg, assert.isNotFrozen, true).to.not.be.frozen;
};
assert.isEmpty = function (val, msg) {
new Assertion(val, msg, assert.isEmpty, true).to.be.empty;
};
assert.isNotEmpty = function (val, msg) {
new Assertion(val, msg, assert.isNotEmpty, true).to.not.be.empty;
};
(function alias(name, as) {
assert[as] = assert[name];
return alias;
})('isOk', 'ok')('isNotOk', 'notOk')('throws', 'throw')('throws', 'Throw')('isExtensible', 'extensible')('isNotExtensible', 'notExtensible')('isSealed', 'sealed')('isNotSealed', 'notSealed')('isFrozen', 'frozen')('isNotFrozen', 'notFrozen')('isEmpty', 'empty')('isNotEmpty', 'notEmpty');
};
return module.exports;
},
100: function (require, module, exports) {
'use strict';
var getPrototypeOfExists = typeof Object.getPrototypeOf === 'function';
var promiseExists = typeof Promise === 'function';
var globalObject = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : self;
var isDom = ('location' in globalObject) && ('document' in globalObject);
var htmlElementExists = typeof HTMLElement !== 'undefined';
var isArrayExists = typeof Array.isArray === 'function';
var symbolExists = typeof Symbol !== 'undefined';
var mapExists = typeof Map !== 'undefined';
var setExists = typeof Set !== 'undefined';
var weakMapExists = typeof WeakMap !== 'undefined';
var weakSetExists = typeof WeakSet !== 'undefined';
var dataViewExists = typeof DataView !== 'undefined';
var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
var setIteratorPrototype = getPrototypeOfExists && setEntriesExists && Object.getPrototypeOf(new Set().entries());
var mapIteratorPrototype = getPrototypeOfExists && mapEntriesExists && Object.getPrototypeOf(new Map().entries());
var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
var stringIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(('')[Symbol.iterator]());
var toStringLeftSliceLength = 8;
var toStringRightSliceLength = -1;
module.exports = function typeDetect(obj) {
var typeofObj = typeof obj;
if (typeofObj !== 'object') {
return typeofObj;
}
if (obj === null) {
return 'null';
}
if (obj === globalObject) {
return 'global';
}
if (isArrayExists && Array.isArray(obj)) {
return 'Array';
}
if (isDom) {
if (obj === globalObject.location) {
return 'Location';
}
if (obj === globalObject.document) {
return 'Document';
}
if (obj === (globalObject.navigator || ({})).mimeTypes) {
return 'MimeTypeArray';
}
if (obj === (globalObject.navigator || ({})).plugins) {
return 'PluginArray';
}
if (htmlElementExists && obj instanceof HTMLElement && obj.tagName === 'BLOCKQUOTE') {
return 'HTMLQuoteElement';
}
if (htmlElementExists && obj instanceof HTMLElement && obj.tagName === 'TD') {
return 'HTMLTableDataCellElement';
}
if (htmlElementExists && obj instanceof HTMLElement && obj.tagName === 'TH') {
return 'HTMLTableHeaderCellElement';
}
}
var stringTag = (symbolToStringTagExists && obj[Symbol.toStringTag]);
if (typeof stringTag === 'string') {
return stringTag;
}
if (getPrototypeOfExists) {
var objPrototype = Object.getPrototypeOf(obj);
if (objPrototype === RegExp.prototype) {
return 'RegExp';
}
if (objPrototype === Date.prototype) {
return 'Date';
}
if (promiseExists && objPrototype === Promise.prototype) {
return 'Promise';
}
if (setExists && objPrototype === Set.prototype) {
return 'Set';
}
if (mapExists && objPrototype === Map.prototype) {
return 'Map';
}
if (weakSetExists && objPrototype === WeakSet.prototype) {
return 'WeakSet';
}
if (weakMapExists && objPrototype === WeakMap.prototype) {
return 'WeakMap';
}
if (dataViewExists && objPrototype === DataView.prototype) {
return 'DataView';
}
if (mapExists && objPrototype === mapIteratorPrototype) {
return 'Map Iterator';
}
if (setExists && objPrototype === setIteratorPrototype) {
return 'Set Iterator';
}
if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
return 'Array Iterator';
}
if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
return 'String Iterator';
}
if (objPrototype === null) {
return 'Object';
}
}
return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);
};
module.exports.typeDetect = module.exports;
return module.exports;
},
101: function (require, module, exports) {
module.exports = {
any: /./,
whiteSpace: /\s+/,
numeric: /^\d$/,
letter: /^[a-zA-Z]$/,
widenumeric: /^[0-9\!#\$\%\*\+\/\=\?\^\{\|\}\(\)\~\-\.]$/,
alphanumeric: /^[0-9A-Za-z\!#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\(\)\~\-\ ]$/,
email: /^[\w\-\.]+@[\w\-\.]+\.[A-Za-z]{2,10}$/
};
return module.exports;
},
102: function (require, module, exports) {
!(function (win) {
'use strict';
var debug = 0 ? console.log.bind(console, '[fastdom]') : function () {};
var raf = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || (function (cb) {
return setTimeout(cb, 16);
});
function FastDom() {
var self = this;
self.reads = [];
self.writes = [];
self.raf = raf.bind(win);
debug('initialized', self);
}
FastDom.prototype = {
constructor: FastDom,
measure: function (fn, ctx) {
debug('measure');
var task = !ctx ? fn : fn.bind(ctx);
this.reads.push(task);
scheduleFlush(this);
return task;
},
mutate: function (fn, ctx) {
debug('mutate');
var task = !ctx ? fn : fn.bind(ctx);
this.writes.push(task);
scheduleFlush(this);
return task;
},
clear: function (task) {
debug('clear', task);
return remove(this.reads, task) || remove(this.writes, task);
},
extend: function (props) {
debug('extend', props);
if (typeof props != 'object') throw new Error('expected object');
var child = Object.create(this);
mixin(child, props);
child.fastdom = this;
if (child.initialize) child.initialize();
return child;
},
catch: null
};
function scheduleFlush(fastdom) {
if (!fastdom.scheduled) {
fastdom.scheduled = true;
fastdom.raf(flush.bind(null, fastdom));
debug('flush scheduled');
}
}
function flush(fastdom) {
debug('flush');
var writes = fastdom.writes;
var reads = fastdom.reads;
var error;
try {
debug('flushing reads', reads.length);
runTasks(reads);
debug('flushing writes', writes.length);
runTasks(writes);
} catch (e) {
error = e;
}
fastdom.scheduled = false;
if (reads.length || writes.length) scheduleFlush(fastdom);
if (error) {
debug('task errored', error.message);
if (fastdom.catch) fastdom.catch(error); else throw error;
}
}
function runTasks(tasks) {
debug('run tasks');
var task;
while (task = tasks.shift()) task();
}
function remove(array, item) {
var index = array.indexOf(item);
return !!~index && !!array.splice(index, 1);
}
function mixin(target, source) {
for (var key in source) {
if (source.hasOwnProperty(key)) target[key] = source[key];
}
}
var exports = win.fastdom = (win.fastdom || new FastDom());
if ((typeof define) == 'function') define(function () {
return exports;
}); else if ((typeof module) == 'object') module.exports = exports;
})(typeof window !== 'undefined' ? window : this);
return module.exports;
},
104: function (require, module, exports) {
module.exports = {
fontFamily: 'system-ui, sans-serif',
templates: {},
events: null,
label: false,
error: '',
help: '',
required: false,
disabled: false,
defaultValue: null,
width: '100%',
mobileWidth: null,
mobileThreshold: 736,
border: 1,
margin: null,
padding: null,
distance: null,
inputPadding: 12,
fontSize: 14,
labelSize: null,
icon: null,
iconSize: 22,
getter: null,
setter: null,
validator: null,
clearErrorOnValid: true,
makeRoomForHelp: true
};
return module.exports;
},
105: function (require, module, exports) {
var IS, Mask, REGEX, SimplyBind, defaultPatternChars, extend, helpers, maskAddons, maskCore;
SimplyBind = require(55);
maskCore = require(147);
maskAddons = require(148);
extend = require(3);
IS = require(47);
REGEX = require(101);
helpers = require(46);
defaultPatternChars = {
'1': REGEX.numeric,
'#': REGEX.widenumeric,
'a': REGEX.letter,
'*': REGEX.any
};
Mask = class Mask {
constructor(field, config) {
this.field = field;
this.config = config;
this.value = '';
this.prevValue = '';
this.cursor = 0;
this.prevCursor = 0;
this.pattern = this.patternRaw = this.config.pattern;
this.patternSetter = this.config.setter;
this.placeholderChar = this.config.placeholder;
this.placeholderRegex = new RegExp('\\' + (this.placeholderChar || '_'), 'g');
this.guide = this.config.guide;
this.keepCharPositions = this.config.keepCharPositions;
this.chars = extend.clone(defaultPatternChars, this.config.customPatterns);
this.setPattern(this.pattern);
}
getState(pattern, rawValue) {
return {
rawValue,
guide: this.guide,
placeholderChar: this.placeholderChar,
keepCharPositions: this.keepCharPositions,
currentCaretPosition: this.field.el ? this.field.selection().end : this.cursor,
previousConformedValue: this.prevValue,
placeholder: this.getPlaceholder(pattern)
};
}
getPlaceholder(pattern) {
var char, j, len, placeholder;
if (IS.function(pattern)) {} else {
placeholder = '';
for ((j = 0, len = pattern.length); j < len; j++) {
char = pattern[j];
if (IS.regex(char)) {
placeholder += this.placeholderChar;
} else {
placeholder += char;
}
}
return placeholder;
}
}
resolvePattern(pattern, input, state) {
var char, copy, i, j, len, offset, trapIndexes;
pattern = typeof pattern === 'function' ? pattern(input, this.getState(pattern, input)) : pattern;
offset = 0;
trapIndexes = [];
copy = pattern.slice();
for ((i = j = 0, len = copy.length); j < len; i = ++j) {
char = copy[i];
if (!(char === '[]')) {
continue;
}
trapIndexes.push(i - offset);
pattern.splice(i - offset, 1);
offset++;
}
this.prevPattern = this.resolvedPattern;
this.resolvedPattern = pattern;
return {
pattern,
caretTrapIndexes: trapIndexes
};
}
setPattern(string, updateValue = true, updateField) {
this.patternRaw = string;
this.pattern = this.parsePattern(string);
this.transform = this.parseTransform(string);
if (updateValue) {
this.value = this.setValue(this.value);
if (updateField) {
return this.field.value = this.value;
}
}
}
parsePattern(string) {
var char, escaped, i, j, len, pattern;
switch (false) {
case string !== 'EMAIL':
return maskAddons.emailMask.mask;
case string !== 'PHONE':
this.patternSetter = function (value) {
return helpers.repeat('#', Math.max(7, value.length));
};
this.guide = false;
return '#';
case string !== 'NAME':
this.patternSetter = function (value) {
value = value.replace(this.placeholderRegex, '').trim();
return helpers.repeat('a', Math.max(2, value.length));
};
return 'a';
case string !== 'FULLNAME':
this.patternSetter = function (value) {
var split;
if (value[value.length - 1] === ' ') {
value += 'x';
}
split = value.replace(this.placeholderRegex, '').trim().split(/\s+/);
if (split.length === 4) {
return;
}
return split.map(function (part) {
return helpers.repeat('a', Math.max(2, part.length));
}).join(' ');
};
return 'a';
case string !== 'DATE':
return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
case !(string[0] === 'DATE' && IS.string(string[1])):
return string[1].split('').map(char => {
if (REGEX.letter.test(char)) {
return /\d/;
} else {
return char;
}
});
case string !== 'NUMBER':
return maskAddons.createNumberMask({
prefix: this.config.prefix || '',
suffix: this.config.suffix || '',
includeThousandsSeparator: this.config.sep ? true : false,
thousandsSeparatorSymbol: IS.string(this.config.sep) ? this.config.sep : void 0,
allowDecimal: this.config.decimal,
decimalLimit: IS.number(this.config.decimal) ? this.config.decimal : void 0,
integerLimit: IS.number(this.config.limit) ? this.config.limit : void 0
});
case !IS.array(string):
return string;
default:
pattern = [];
for ((i = j = 0, len = string.length); j < len; i = ++j) {
char = string[i];
if (char === '\\') {
escaped = true;
continue;
}
pattern.push(escaped ? char : this.chars[char] || char);
escaped = false;
}
return pattern;
}
}
parseTransform(string) {
switch (false) {
case string !== 'EMAIL':
return maskAddons.emailMask.pipe;
case string !== 'DATE':
return maskAddons.createAutoCorrectedDatePipe('mm/dd/yyyy');
case !(string[0] === 'DATE' && IS.string(string[1])):
return maskAddons.createAutoCorrectedDatePipe(string[1]);
case !this.config.transform:
return this.config.transform;
}
}
setValue(input) {
var caretTrapIndexes, conformedValue, indexesOfPipedChars, newPattern, pattern, state, transformed;
if (this.patternSetter) {
newPattern = this.patternSetter(input) || this.pattern;
if (newPattern !== this.patternRaw && newPattern !== this.pattern) {
this.setPattern(newPattern, false);
}
}
({caretTrapIndexes, pattern} = this.resolvePattern(this.pattern, input));
if (pattern === false) {
return this.value;
}
this.prevValue = this.value;
this.prevCursor = this.cursor;
state = this.getState(pattern, input);
({conformedValue} = maskCore.conformToMask(input, pattern, state));
if (this.transform) {
transformed = this.transform(conformedValue, state);
}
if (transformed === false) {
return this.value;
}
if (IS.string(transformed)) {
conformedValue = transformed;
} else if (IS.object(transformed)) {
indexesOfPipedChars = transformed.indexesOfPipedChars;
conformedValue = transformed.value;
}
this.cursor = maskCore.adjustCaretPosition(extend(state, {
indexesOfPipedChars,
caretTrapIndexes,
conformedValue
}));
return this.value = conformedValue;
}
validate(input) {
var char, i, j, len, pattern;
if (input !== this.value && this.patternSetter) {
pattern = this.patternSetter(input) || this.pattern;
} else {
pattern = this.resolvedPattern;
if (!pattern) {
({pattern} = this.resolvePattern(this.pattern, input));
}
}
if (pattern === false) {
return true;
}
for ((i = j = 0, len = pattern.length); j < len; i = ++j) {
char = pattern[i];
switch (false) {
case !!input[i]:
return false;
case !(IS.regex(char) && !char.test(input[i])):
return false;
case !(IS.string(char) && input[i] !== char):
return false;
}
}
return true;
}
isEmpty() {
var char, i, input, j, len, pattern;
input = this.value;
pattern = this.resolvedPattern;
if (!pattern) {
if (this.patternSetter) {
pattern = this.patternSetter(input);
}
({pattern} = this.resolvePattern(pattern || this.pattern, input));
}
if (input === this.config.prefix || input === this.config.suffix) {
return true;
}
for ((i = j = 0, len = pattern.length); j < len; i = ++j) {
char = pattern[i];
switch (false) {
case !!input[i]:
return true;
case !IS.regex(char):
return !char.test(input[i]);
}
}
return false;
}
};
module.exports = Mask;
return module.exports;
},
106: function (require, module, exports) {
var CHECKMARK_WIDTH, COLORS, DOM, helpers;
DOM = require(4);
helpers = require(46);
COLORS = require(5);
CHECKMARK_WIDTH = 26;
exports.default = DOM.template(['div', {
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
return helpers.shorthandSideValue(field.settings.padding, 'left') + (((ref = field.el.child.icon) != null ? ref.width : void 0) || 0);
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
this.padding = Math.max(0, helpers.calcPadding(field.settings.height, 14) - 3);
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
transform: 'translateY(0)',
transition: 'transform 0.2s, -webkit-transform 0.2s',
$disabled: {
cursor: 'not-allowed'
},
$filled: {
$showLabel: {
transform: function (field) {
var label, totalHeight, translation, workableHeight;
if ((this.translation != null) || !(label = field.el.child.label) || label.styleSafe('position', 1) !== 'absolute') {
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
return helpers.shorthandSideValue(field.settings.padding, 'left');
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

var icon = exports.icon = DOM.template(['div', {
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
}]);
var checkmark = exports.checkmark = DOM.template(['div', {
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
return helpers.defaultColor(field.els.innerwrap.styleSafe('backgroundColor', 1), 'white');
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
return helpers.defaultColor(field.els.innerwrap.styleSafe('backgroundColor', 1), 'white');
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
borderColor: helpers.hexToRGBA(COLORS.green, 0.4),
$invalid: {
borderColor: helpers.hexToRGBA(COLORS.red, 0.4)
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
return helpers.defaultColor(field.els.innerwrap.styleSafe('backgroundColor', 1), 'white');
},
transform: 'rotate(-45deg)'
}
}]]]);
return module.exports;
},
107: function (require, module, exports) {
module.exports = {
placeholder: true,
validWhenIsChoice: false,
validWhenRegex: false,
autoWidth: false,
maxWidth: '100%',
minWidth: 2,
height: 46,
checkmark: true,
keyboard: 'text',
dropdown: {
lockScroll: false
},
choices: null,
minLength: null,
maxLength: null,
inputSibling: 'checkmark',
mask: {
pattern: false,
placeholder: '_',
guide: true,
customPatterns: false
}
};
return module.exports;
},
108: function (require, module, exports) {
var DOM, SVG, helpers;
DOM = require(4);
SVG = require(115);
helpers = require(46);
exports.default = DOM.template(['div', {
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
backgroundColor: '#f6f6f6',
boxShadow: `0px 6px 10px ${helpers.hexToRGBA('000000', 0.32)}`,
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

var list = exports.list = DOM.template(['div', {
ref: 'list',
passStateToChildren: false,
style: {
position: 'relative',
overflow: 'scroll',
overflowScrolling: 'touch',
overflowStyle: '-ms-autohiding-scrollbar'
}
}]);
var choice = exports.choice = DOM.template(['div', {
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
}, ['div', {
style: {
display: 'inline-block',
verticalAlign: 'top',
width: '20px',
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
}, SVG.checkmark], ['div', {
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
var scrollIndicatorUp = exports.scrollIndicatorUp = DOM.template(['div', {
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
}, SVG.caretUp]]);
var scrollIndicatorDown = exports.scrollIndicatorDown = DOM.template(['div', {
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
}, SVG.caretDown]]);
var help = exports.help = DOM.template(['div', {
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
}]);
return module.exports;
},
109: function (require, module, exports) {
module.exports = {
maxHeight: 300,
multiple: false,
lockScroll: true,
typeBuffer: false,
help: '',
templates: {}
};
return module.exports;
},
115: function (require, module, exports) {
exports.checkmark = require(155);
exports.angleDown = require(156);
exports.caretUp = require(157);
exports.caretDown = require(158);
exports.plus = require(116);
exports.clone = require(117);
return module.exports;
},
116: function (require, module, exports) {
var DOM;
DOM = require(4);
module.exports = DOM.template(['*svg', {
attrs: {
viewBox: '0 0 15 15',
tabindex: -1,
focusable: false
},
style: {
width: '100%',
height: '100%',
outline: 'none'
}
}, ['*polygon', {
attrs: {
tabindex: -1,
focusable: false,
points: '9 0 6 0 6 6 0 6 0 9 6 9 6 15 9 15 9 9 15 9 15 6 9 6'
}
}]]);
return module.exports;
},
117: function (require, module, exports) {
var DOM;
DOM = require(4);
module.exports = DOM.template(['*svg', {
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
}]]);
return module.exports;
},
118: function (require, module, exports) {
var plus;
plus = require(116);
module.exports = plus.extend({
options: {
style: {
transform: 'rotate(45deg)'
}
}
});
return module.exports;
},
119: function (require, module, exports) {
var exports;
module.exports = exports = {
defined: function (subject) {
return subject !== void 0;
},
array: function (subject) {
return subject instanceof Array;
},
object: function (subject) {
return typeof subject === 'object' && subject;
},
objectPlain: function (subject) {
return exports.object(subject) && Object.prototype.toString.call(subject) === '[object Object]' && subject.constructor === Object;
},
string: function (subject) {
return typeof subject === 'string';
},
number: function (subject) {
return typeof subject === 'number' && !isNaN(subject);
},
numberLoose: function (subject) {
return exports.number(subject) || exports.string(subject) && exports.number(Number(subject));
},
function: function (subject) {
return typeof subject === 'function';
},
iterable: function (subject) {
return exports.object(subject) && exports.number(subject.length);
}
};
return module.exports;
},
120: function (require, module, exports) {
var exports;
module.exports = exports = {
domDoc: function (subject) {
return subject && subject.nodeType === 9;
},
domEl: function (subject) {
return subject && subject.nodeType === 1;
},
domText: function (subject) {
return subject && subject.nodeType === 3;
},
domNode: function (subject) {
return exports.domEl(subject) || exports.domText(subject);
},
domTextarea: function (subject) {
return subject && subject.nodeName === 'TEXTAREA';
},
domInput: function (subject) {
return subject && subject.nodeName === 'INPUT';
},
domSelect: function (subject) {
return subject && subject.nodeName === 'SELECT';
},
domField: function (subject) {
return exports.domInput(subject) || exports.domTextarea(subject) || exports.domSelect(subject);
}
};
return module.exports;
},
121: function (require, module, exports) {
var StateChain;
module.exports = StateChain = class StateChain {
constructor(states) {
this.string = states.join('+');
this.array = states.slice();
this.length = states.length;
}
includes(target) {
var i, len, ref, state;
ref = this.array;
for ((i = 0, len = ref.length); i < len; i++) {
state = ref[i];
if (state === target) {
return true;
}
}
return false;
}
without(target) {
return this.array.filter(function (state) {
return state !== target;
}).join('+');
}
isApplicable(target, otherActive) {
var active;
active = this.array.filter(function (state) {
return state === target || otherActive.indexOf(state) !== -1;
});
return active.length === this.array.length;
}
};
return module.exports;
},
122: function (require, module, exports) {
'use strict';
function hasProperty(obj, name) {
if (typeof obj === 'undefined' || obj === null) {
return false;
}
return (name in Object(obj));
}
function parsePath(path) {
var str = path.replace(/([^\\])\[/g, '$1.[');
var parts = str.match(/(\\\.|[^.]+?)+/g);
return parts.map(function mapMatches(value) {
var regexp = /^\[(\d+)\]$/;
var mArr = regexp.exec(value);
var parsed = null;
if (mArr) {
parsed = {
i: parseFloat(mArr[1])
};
} else {
parsed = {
p: value.replace(/\\([.\[\]])/g, '$1')
};
}
return parsed;
});
}
function internalGetPathValue(obj, parsed, pathDepth) {
var temporaryValue = obj;
var res = null;
pathDepth = (typeof pathDepth === 'undefined' ? parsed.length : pathDepth);
for (var i = 0; i < pathDepth; i++) {
var part = parsed[i];
if (temporaryValue) {
if (typeof part.p === 'undefined') {
temporaryValue = temporaryValue[part.i];
} else {
temporaryValue = temporaryValue[part.p];
}
if (i === (pathDepth - 1)) {
res = temporaryValue;
}
}
}
return res;
}
function internalSetPathValue(obj, val, parsed) {
var tempObj = obj;
var pathDepth = parsed.length;
var part = null;
for (var i = 0; i < pathDepth; i++) {
var propName = null;
var propVal = null;
part = parsed[i];
if (i === (pathDepth - 1)) {
propName = typeof part.p === 'undefined' ? part.i : part.p;
tempObj[propName] = val;
} else if (typeof part.p !== 'undefined' && tempObj[part.p]) {
tempObj = tempObj[part.p];
} else if (typeof part.i !== 'undefined' && tempObj[part.i]) {
tempObj = tempObj[part.i];
} else {
var next = parsed[i + 1];
propName = typeof part.p === 'undefined' ? part.i : part.p;
propVal = typeof next.p === 'undefined' ? [] : {};
tempObj[propName] = propVal;
tempObj = tempObj[propName];
}
}
}
function getPathInfo(obj, path) {
var parsed = parsePath(path);
var last = parsed[parsed.length - 1];
var info = {
parent: parsed.length > 1 ? internalGetPathValue(obj, parsed, parsed.length - 1) : obj,
name: last.p || last.i,
value: internalGetPathValue(obj, parsed)
};
info.exists = hasProperty(info.parent, info.name);
return info;
}
function getPathValue(obj, path) {
var info = getPathInfo(obj, path);
return info.value;
}
function setPathValue(obj, path, val) {
var parsed = parsePath(path);
internalSetPathValue(obj, val, parsed);
return obj;
}
module.exports = {
hasProperty: hasProperty,
getPathInfo: getPathInfo,
getPathValue: getPathValue,
setPathValue: setPathValue
};
return module.exports;
},
123: function (require, module, exports) {
var flag = require(129);
module.exports = function test(obj, args) {
var negate = flag(obj, 'negate'), expr = args[0];
return negate ? !expr : expr;
};
return module.exports;
},
124: function (require, module, exports) {
var AssertionError = require(92);
var flag = require(129);
var type = require(44);
module.exports = function expectTypes(obj, types) {
var flagMsg = flag(obj, 'message');
var ssfi = flag(obj, 'ssfi');
flagMsg = flagMsg ? flagMsg + ': ' : '';
obj = flag(obj, 'object');
types = types.map(function (t) {
return t.toLowerCase();
});
types.sort();
var str = types.map(function (t, index) {
var art = ~['a', 'e', 'i', 'o', 'u'].indexOf(t.charAt(0)) ? 'an' : 'a';
var or = types.length > 1 && index === types.length - 1 ? 'or ' : '';
return or + art + ' ' + t;
}).join(', ');
var objType = type(obj).toLowerCase();
if (!types.some(function (expected) {
return objType === expected;
})) {
throw new AssertionError(flagMsg + 'object tested must be ' + str + ', but ' + objType + ' given', undefined, ssfi);
}
};
return module.exports;
},
125: function (require, module, exports) {
var flag = require(129), getActual = require(126), inspect = require(127), objDisplay = require(128);
module.exports = function getMessage(obj, args) {
var negate = flag(obj, 'negate'), val = flag(obj, 'object'), expected = args[3], actual = getActual(obj, args), msg = negate ? args[2] : args[1], flagMsg = flag(obj, 'message');
if (typeof msg === "function") msg = msg();
msg = msg || '';
msg = msg.replace(/#\{this\}/g, function () {
return objDisplay(val);
}).replace(/#\{act\}/g, function () {
return objDisplay(actual);
}).replace(/#\{exp\}/g, function () {
return objDisplay(expected);
});
return flagMsg ? flagMsg + ': ' + msg : msg;
};
return module.exports;
},
126: function (require, module, exports) {
module.exports = function getActual(obj, args) {
return args.length > 4 ? args[4] : obj._obj;
};
return module.exports;
},
127: function (require, module, exports) {
var getName = require(132);
var getProperties = require(159);
var getEnumerableProperties = require(160);
var config = require(94);
module.exports = inspect;
function inspect(obj, showHidden, depth, colors) {
var ctx = {
showHidden: showHidden,
seen: [],
stylize: function (str) {
return str;
}
};
return formatValue(ctx, obj, (typeof depth === 'undefined' ? 2 : depth));
}
var isDOMElement = function (object) {
if (typeof HTMLElement === 'object') {
return object instanceof HTMLElement;
} else {
return object && typeof object === 'object' && ('nodeType' in object) && object.nodeType === 1 && typeof object.nodeName === 'string';
}
};
function formatValue(ctx, value, recurseTimes) {
if (value && typeof value.inspect === 'function' && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
var ret = value.inspect(recurseTimes, ctx);
if (typeof ret !== 'string') {
ret = formatValue(ctx, ret, recurseTimes);
}
return ret;
}
var primitive = formatPrimitive(ctx, value);
if (primitive) {
return primitive;
}
if (isDOMElement(value)) {
if (('outerHTML' in value)) {
return value.outerHTML;
} else {
try {
if (document.xmlVersion) {
var xmlSerializer = new XMLSerializer();
return xmlSerializer.serializeToString(value);
} else {
var ns = "http://www.w3.org/1999/xhtml";
var container = document.createElementNS(ns, '_');
container.appendChild(value.cloneNode(false));
var html = container.innerHTML.replace('><', '>' + value.innerHTML + '<');
container.innerHTML = '';
return html;
}
} catch (err) {}
}
}
var visibleKeys = getEnumerableProperties(value);
var keys = ctx.showHidden ? getProperties(value) : visibleKeys;
var name, nameSuffix;
if (keys.length === 0 || (isError(value) && ((keys.length === 1 && keys[0] === 'stack') || (keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')))) {
if (typeof value === 'function') {
name = getName(value);
nameSuffix = name ? ': ' + name : '';
return ctx.stylize('[Function' + nameSuffix + ']', 'special');
}
if (isRegExp(value)) {
return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
}
if (isDate(value)) {
return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
}
if (isError(value)) {
return formatError(value);
}
}
var base = '', array = false, typedArray = false, braces = ['{', '}'];
if (isTypedArray(value)) {
typedArray = true;
braces = ['[', ']'];
}
if (isArray(value)) {
array = true;
braces = ['[', ']'];
}
if (typeof value === 'function') {
name = getName(value);
nameSuffix = name ? ': ' + name : '';
base = ' [Function' + nameSuffix + ']';
}
if (isRegExp(value)) {
base = ' ' + RegExp.prototype.toString.call(value);
}
if (isDate(value)) {
base = ' ' + Date.prototype.toUTCString.call(value);
}
if (isError(value)) {
return formatError(value);
}
if (keys.length === 0 && (!array || value.length == 0)) {
return braces[0] + base + braces[1];
}
if (recurseTimes < 0) {
if (isRegExp(value)) {
return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
} else {
return ctx.stylize('[Object]', 'special');
}
}
ctx.seen.push(value);
var output;
if (array) {
output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
} else if (typedArray) {
return formatTypedArray(value);
} else {
output = keys.map(function (key) {
return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
});
}
ctx.seen.pop();
return reduceToSingleString(output, base, braces);
}
function formatPrimitive(ctx, value) {
switch (typeof value) {
case 'undefined':
return ctx.stylize('undefined', 'undefined');
case 'string':
var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
return ctx.stylize(simple, 'string');
case 'number':
if (value === 0 && (1 / value) === -Infinity) {
return ctx.stylize('-0', 'number');
}
return ctx.stylize('' + value, 'number');
case 'boolean':
return ctx.stylize('' + value, 'boolean');
case 'symbol':
return ctx.stylize(value.toString(), 'symbol');
}
if (value === null) {
return ctx.stylize('null', 'null');
}
}
function formatError(value) {
return '[' + Error.prototype.toString.call(value) + ']';
}
function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
var output = [];
for (var i = 0, l = value.length; i < l; ++i) {
if (Object.prototype.hasOwnProperty.call(value, String(i))) {
output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
} else {
output.push('');
}
}
keys.forEach(function (key) {
if (!key.match(/^\d+$/)) {
output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
}
});
return output;
}
function formatTypedArray(value) {
var str = '[ ';
for (var i = 0; i < value.length; ++i) {
if (str.length >= config.truncateThreshold - 7) {
str += '...';
break;
}
str += value[i] + ', ';
}
str += ' ]';
if (str.indexOf(',  ]') !== -1) {
str = str.replace(',  ]', ' ]');
}
return str;
}
function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
var name;
var propDescriptor = Object.getOwnPropertyDescriptor(value, key);
var str;
if (propDescriptor) {
if (propDescriptor.get) {
if (propDescriptor.set) {
str = ctx.stylize('[Getter/Setter]', 'special');
} else {
str = ctx.stylize('[Getter]', 'special');
}
} else {
if (propDescriptor.set) {
str = ctx.stylize('[Setter]', 'special');
}
}
}
if (visibleKeys.indexOf(key) < 0) {
name = '[' + key + ']';
}
if (!str) {
if (ctx.seen.indexOf(value[key]) < 0) {
if (recurseTimes === null) {
str = formatValue(ctx, value[key], null);
} else {
str = formatValue(ctx, value[key], recurseTimes - 1);
}
if (str.indexOf('\n') > -1) {
if (array) {
str = str.split('\n').map(function (line) {
return '  ' + line;
}).join('\n').substr(2);
} else {
str = '\n' + str.split('\n').map(function (line) {
return '   ' + line;
}).join('\n');
}
}
} else {
str = ctx.stylize('[Circular]', 'special');
}
}
if (typeof name === 'undefined') {
if (array && key.match(/^\d+$/)) {
return str;
}
name = JSON.stringify('' + key);
if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
name = name.substr(1, name.length - 2);
name = ctx.stylize(name, 'name');
} else {
name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
name = ctx.stylize(name, 'string');
}
}
return name + ': ' + str;
}
function reduceToSingleString(output, base, braces) {
var numLinesEst = 0;
var length = output.reduce(function (prev, cur) {
numLinesEst++;
if (cur.indexOf('\n') >= 0) numLinesEst++;
return prev + cur.length + 1;
}, 0);
if (length > 60) {
return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
}
return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}
function isTypedArray(ar) {
return (typeof ar === 'object' && (/\w+Array]$/).test(objectToString(ar)));
}
function isArray(ar) {
return Array.isArray(ar) || (typeof ar === 'object' && objectToString(ar) === '[object Array]');
}
function isRegExp(re) {
return typeof re === 'object' && objectToString(re) === '[object RegExp]';
}
function isDate(d) {
return typeof d === 'object' && objectToString(d) === '[object Date]';
}
function isError(e) {
return typeof e === 'object' && objectToString(e) === '[object Error]';
}
function objectToString(o) {
return Object.prototype.toString.call(o);
}
return module.exports;
},
128: function (require, module, exports) {
var inspect = require(127);
var config = require(94);
module.exports = function objDisplay(obj) {
var str = inspect(obj), type = Object.prototype.toString.call(obj);
if (config.truncateThreshold && str.length >= config.truncateThreshold) {
if (type === '[object Function]') {
return !obj.name || obj.name === '' ? '[Function]' : '[Function: ' + obj.name + ']';
} else if (type === '[object Array]') {
return '[ Array(' + obj.length + ') ]';
} else if (type === '[object Object]') {
var keys = Object.keys(obj), kstr = keys.length > 2 ? keys.splice(0, 2).join(', ') + ', ...' : keys.join(', ');
return '{ Object (' + kstr + ') }';
} else {
return str;
}
} else {
return str;
}
};
return module.exports;
},
129: function (require, module, exports) {
module.exports = function flag(obj, key, value) {
var flags = obj.__flags || (obj.__flags = Object.create(null));
if (arguments.length === 3) {
flags[key] = value;
} else {
return flags[key];
}
};
return module.exports;
},
130: function (require, module, exports) {
module.exports = function transferFlags(assertion, object, includeAll) {
var flags = assertion.__flags || (assertion.__flags = Object.create(null));
if (!object.__flags) {
object.__flags = Object.create(null);
}
includeAll = arguments.length === 3 ? includeAll : true;
for (var flag in flags) {
if (includeAll || (flag !== 'object' && flag !== 'ssfi' && flag !== 'lockSsfi' && flag != 'message')) {
object.__flags[flag] = flags[flag];
}
}
};
return module.exports;
},
131: function (require, module, exports) {
'use strict';
var type = require(44);
function FakeMap() {
this._key = 'chai/deep-eql__' + Math.random() + Date.now();
}
FakeMap.prototype = {
get: function getMap(key) {
return key[this._key];
},
set: function setMap(key, value) {
if (Object.isExtensible(key)) {
Object.defineProperty(key, this._key, {
value: value,
configurable: true
});
}
}
};
var MemoizeMap = typeof WeakMap === 'function' ? WeakMap : FakeMap;
function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
return null;
}
var leftHandMap = memoizeMap.get(leftHandOperand);
if (leftHandMap) {
var result = leftHandMap.get(rightHandOperand);
if (typeof result === 'boolean') {
return result;
}
}
return null;
}
function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
return;
}
var leftHandMap = memoizeMap.get(leftHandOperand);
if (leftHandMap) {
leftHandMap.set(rightHandOperand, result);
} else {
leftHandMap = new MemoizeMap();
leftHandMap.set(rightHandOperand, result);
memoizeMap.set(leftHandOperand, leftHandMap);
}
}
module.exports = deepEqual;
module.exports.MemoizeMap = MemoizeMap;
function deepEqual(leftHandOperand, rightHandOperand, options) {
if (options && options.comparator) {
return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
}
var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
if (simpleResult !== null) {
return simpleResult;
}
return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
}
function simpleEqual(leftHandOperand, rightHandOperand) {
if (leftHandOperand === rightHandOperand) {
return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
}
if (leftHandOperand !== leftHandOperand && rightHandOperand !== rightHandOperand) {
return true;
}
if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
return false;
}
return null;
}
function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
options = options || ({});
options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
var comparator = options && options.comparator;
var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
if (memoizeResultLeft !== null) {
return memoizeResultLeft;
}
var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
if (memoizeResultRight !== null) {
return memoizeResultRight;
}
if (comparator) {
var comparatorResult = comparator(leftHandOperand, rightHandOperand);
if (comparatorResult === false || comparatorResult === true) {
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
return comparatorResult;
}
var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
if (simpleResult !== null) {
return simpleResult;
}
}
var leftHandType = type(leftHandOperand);
if (leftHandType !== type(rightHandOperand)) {
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
return false;
}
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
return result;
}
function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
switch (leftHandType) {
case 'String':
case 'Number':
case 'Boolean':
case 'Date':
return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
case 'Promise':
case 'Symbol':
case 'function':
case 'WeakMap':
case 'WeakSet':
case 'Error':
return leftHandOperand === rightHandOperand;
case 'Arguments':
case 'Int8Array':
case 'Uint8Array':
case 'Uint8ClampedArray':
case 'Int16Array':
case 'Uint16Array':
case 'Int32Array':
case 'Uint32Array':
case 'Float32Array':
case 'Float64Array':
case 'Array':
return iterableEqual(leftHandOperand, rightHandOperand, options);
case 'RegExp':
return regexpEqual(leftHandOperand, rightHandOperand);
case 'Generator':
return generatorEqual(leftHandOperand, rightHandOperand, options);
case 'DataView':
return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
case 'ArrayBuffer':
return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
case 'Set':
return entriesEqual(leftHandOperand, rightHandOperand, options);
case 'Map':
return entriesEqual(leftHandOperand, rightHandOperand, options);
default:
return objectEqual(leftHandOperand, rightHandOperand, options);
}
}
function regexpEqual(leftHandOperand, rightHandOperand) {
return leftHandOperand.toString() === rightHandOperand.toString();
}
function entriesEqual(leftHandOperand, rightHandOperand, options) {
if (leftHandOperand.size !== rightHandOperand.size) {
return false;
}
if (leftHandOperand.size === 0) {
return true;
}
var leftHandItems = [];
var rightHandItems = [];
leftHandOperand.forEach(function gatherEntries(key, value) {
leftHandItems.push([key, value]);
});
rightHandOperand.forEach(function gatherEntries(key, value) {
rightHandItems.push([key, value]);
});
return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
}
function iterableEqual(leftHandOperand, rightHandOperand, options) {
var length = leftHandOperand.length;
if (length !== rightHandOperand.length) {
return false;
}
if (length === 0) {
return true;
}
var index = -1;
while (++index < length) {
if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
return false;
}
}
return true;
}
function generatorEqual(leftHandOperand, rightHandOperand, options) {
return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
}
function hasIteratorFunction(target) {
return typeof Symbol !== 'undefined' && typeof target === 'object' && typeof Symbol.iterator !== 'undefined' && typeof target[Symbol.iterator] === 'function';
}
function getIteratorEntries(target) {
if (hasIteratorFunction(target)) {
try {
return getGeneratorEntries(target[Symbol.iterator]());
} catch (iteratorError) {
return [];
}
}
return [];
}
function getGeneratorEntries(generator) {
var generatorResult = generator.next();
var accumulator = [generatorResult.value];
while (generatorResult.done === false) {
generatorResult = generator.next();
accumulator.push(generatorResult.value);
}
return accumulator;
}
function getEnumerableKeys(target) {
var keys = [];
for (var key in target) {
keys.push(key);
}
return keys;
}
function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
var length = keys.length;
if (length === 0) {
return true;
}
for (var i = 0; i < length; i += 1) {
if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
return false;
}
}
return true;
}
function objectEqual(leftHandOperand, rightHandOperand, options) {
var leftHandKeys = getEnumerableKeys(leftHandOperand);
var rightHandKeys = getEnumerableKeys(rightHandOperand);
if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
leftHandKeys.sort();
rightHandKeys.sort();
if (iterableEqual(leftHandKeys, rightHandKeys) === false) {
return false;
}
return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
}
var leftHandEntries = getIteratorEntries(leftHandOperand);
var rightHandEntries = getIteratorEntries(rightHandOperand);
if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
leftHandEntries.sort();
rightHandEntries.sort();
return iterableEqual(leftHandEntries, rightHandEntries, options);
}
if (leftHandKeys.length === 0 && leftHandEntries.length === 0 && rightHandKeys.length === 0 && rightHandEntries.length === 0) {
return true;
}
return false;
}
function isPrimitive(value) {
return value === null || typeof value !== 'object';
}
return module.exports;
},
132: function (require, module, exports) {
'use strict';
var toString = Function.prototype.toString;
var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
function getFuncName(aFunc) {
if (typeof aFunc !== 'function') {
return null;
}
var name = '';
if (typeof Function.prototype.name === 'undefined' && typeof aFunc.name === 'undefined') {
var match = toString.call(aFunc).match(functionNameMatch);
if (match) {
name = match[1];
}
} else {
name = aFunc.name;
}
return name;
}
module.exports = getFuncName;
return module.exports;
},
133: function (require, module, exports) {
var chai = require(42);
var flag = require(129);
var isProxyEnabled = require(145);
var transferFlags = require(130);
module.exports = function addProperty(ctx, name, getter) {
getter = getter === undefined ? function () {} : getter;
Object.defineProperty(ctx, name, {
get: function propertyGetter() {
if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
flag(this, 'ssfi', propertyGetter);
}
var result = getter.call(this);
if (result !== undefined) return result;
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
},
configurable: true
});
};
return module.exports;
},
134: function (require, module, exports) {
var addLengthGuard = require(144);
var chai = require(42);
var flag = require(129);
var proxify = require(143);
var transferFlags = require(130);
module.exports = function addMethod(ctx, name, method) {
var methodWrapper = function () {
if (!flag(this, 'lockSsfi')) {
flag(this, 'ssfi', methodWrapper);
}
var result = method.apply(this, arguments);
if (result !== undefined) return result;
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
};
addLengthGuard(methodWrapper, name, false);
ctx[name] = proxify(methodWrapper, name);
};
return module.exports;
},
135: function (require, module, exports) {
var chai = require(42);
var flag = require(129);
var isProxyEnabled = require(145);
var transferFlags = require(130);
module.exports = function overwriteProperty(ctx, name, getter) {
var _get = Object.getOwnPropertyDescriptor(ctx, name), _super = function () {};
if (_get && 'function' === typeof _get.get) _super = _get.get;
Object.defineProperty(ctx, name, {
get: function overwritingPropertyGetter() {
if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
flag(this, 'ssfi', overwritingPropertyGetter);
}
var origLockSsfi = flag(this, 'lockSsfi');
flag(this, 'lockSsfi', true);
var result = getter(_super).call(this);
flag(this, 'lockSsfi', origLockSsfi);
if (result !== undefined) {
return result;
}
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
},
configurable: true
});
};
return module.exports;
},
136: function (require, module, exports) {
var addLengthGuard = require(144);
var chai = require(42);
var flag = require(129);
var proxify = require(143);
var transferFlags = require(130);
module.exports = function overwriteMethod(ctx, name, method) {
var _method = ctx[name], _super = function () {
throw new Error(name + ' is not a function');
};
if (_method && 'function' === typeof _method) _super = _method;
var overwritingMethodWrapper = function () {
if (!flag(this, 'lockSsfi')) {
flag(this, 'ssfi', overwritingMethodWrapper);
}
var origLockSsfi = flag(this, 'lockSsfi');
flag(this, 'lockSsfi', true);
var result = method(_super).apply(this, arguments);
flag(this, 'lockSsfi', origLockSsfi);
if (result !== undefined) {
return result;
}
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
};
addLengthGuard(overwritingMethodWrapper, name, false);
ctx[name] = proxify(overwritingMethodWrapper, name);
};
return module.exports;
},
137: function (require, module, exports) {
var addLengthGuard = require(144);
var chai = require(42);
var flag = require(129);
var proxify = require(143);
var transferFlags = require(130);
var canSetPrototype = typeof Object.setPrototypeOf === 'function';
var testFn = function () {};
var excludeNames = Object.getOwnPropertyNames(testFn).filter(function (name) {
var propDesc = Object.getOwnPropertyDescriptor(testFn, name);
if (typeof propDesc !== 'object') return true;
return !propDesc.configurable;
});
var call = Function.prototype.call, apply = Function.prototype.apply;
module.exports = function addChainableMethod(ctx, name, method, chainingBehavior) {
if (typeof chainingBehavior !== 'function') {
chainingBehavior = function () {};
}
var chainableBehavior = {
method: method,
chainingBehavior: chainingBehavior
};
if (!ctx.__methods) {
ctx.__methods = {};
}
ctx.__methods[name] = chainableBehavior;
Object.defineProperty(ctx, name, {
get: function chainableMethodGetter() {
chainableBehavior.chainingBehavior.call(this);
var chainableMethodWrapper = function () {
if (!flag(this, 'lockSsfi')) {
flag(this, 'ssfi', chainableMethodWrapper);
}
var result = chainableBehavior.method.apply(this, arguments);
if (result !== undefined) {
return result;
}
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
};
addLengthGuard(chainableMethodWrapper, name, true);
if (canSetPrototype) {
var prototype = Object.create(this);
prototype.call = call;
prototype.apply = apply;
Object.setPrototypeOf(chainableMethodWrapper, prototype);
} else {
var asserterNames = Object.getOwnPropertyNames(ctx);
asserterNames.forEach(function (asserterName) {
if (excludeNames.indexOf(asserterName) !== -1) {
return;
}
var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
Object.defineProperty(chainableMethodWrapper, asserterName, pd);
});
}
transferFlags(this, chainableMethodWrapper);
return proxify(chainableMethodWrapper);
},
configurable: true
});
};
return module.exports;
},
138: function (require, module, exports) {
var chai = require(42);
var transferFlags = require(130);
module.exports = function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
var chainableBehavior = ctx.__methods[name];
var _chainingBehavior = chainableBehavior.chainingBehavior;
chainableBehavior.chainingBehavior = function overwritingChainableMethodGetter() {
var result = chainingBehavior(_chainingBehavior).call(this);
if (result !== undefined) {
return result;
}
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
};
var _method = chainableBehavior.method;
chainableBehavior.method = function overwritingChainableMethodWrapper() {
var result = method(_method).apply(this, arguments);
if (result !== undefined) {
return result;
}
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
};
};
return module.exports;
},
139: function (require, module, exports) {
var inspect = require(127);
module.exports = function compareByInspect(a, b) {
return inspect(a) < inspect(b) ? -1 : 1;
};
return module.exports;
},
140: function (require, module, exports) {
module.exports = function getOwnEnumerablePropertySymbols(obj) {
if (typeof Object.getOwnPropertySymbols !== 'function') return [];
return Object.getOwnPropertySymbols(obj).filter(function (sym) {
return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
});
};
return module.exports;
},
141: function (require, module, exports) {
var getOwnEnumerablePropertySymbols = require(140);
module.exports = function getOwnEnumerableProperties(obj) {
return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
};
return module.exports;
},
142: function (require, module, exports) {
'use strict';
function compatibleInstance(thrown, errorLike) {
return errorLike instanceof Error && thrown === errorLike;
}
function compatibleConstructor(thrown, errorLike) {
if (errorLike instanceof Error) {
return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
} else if (errorLike.prototype instanceof Error || errorLike === Error) {
return thrown.constructor === errorLike || thrown instanceof errorLike;
}
return false;
}
function compatibleMessage(thrown, errMatcher) {
var comparisonString = typeof thrown === 'string' ? thrown : thrown.message;
if (errMatcher instanceof RegExp) {
return errMatcher.test(comparisonString);
} else if (typeof errMatcher === 'string') {
return comparisonString.indexOf(errMatcher) !== -1;
}
return false;
}
var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\(\/]+)/;
function getFunctionName(constructorFn) {
var name = '';
if (typeof constructorFn.name === 'undefined') {
var match = String(constructorFn).match(functionNameMatch);
if (match) {
name = match[1];
}
} else {
name = constructorFn.name;
}
return name;
}
function getConstructorName(errorLike) {
var constructorName = errorLike;
if (errorLike instanceof Error) {
constructorName = getFunctionName(errorLike.constructor);
} else if (typeof errorLike === 'function') {
constructorName = getFunctionName(errorLike).trim() || getFunctionName(new errorLike());
}
return constructorName;
}
function getMessage(errorLike) {
var msg = '';
if (errorLike && errorLike.message) {
msg = errorLike.message;
} else if (typeof errorLike === 'string') {
msg = errorLike;
}
return msg;
}
module.exports = {
compatibleInstance: compatibleInstance,
compatibleConstructor: compatibleConstructor,
compatibleMessage: compatibleMessage,
getMessage: getMessage,
getConstructorName: getConstructorName
};
return module.exports;
},
143: function (require, module, exports) {
var config = require(94);
var flag = require(129);
var getProperties = require(159);
var isProxyEnabled = require(145);
var builtins = ['__flags', '__methods', '_obj', 'assert'];
module.exports = function proxify(obj, nonChainableMethodName) {
if (!isProxyEnabled()) return obj;
return new Proxy(obj, {
get: function proxyGetter(target, property) {
if (typeof property === 'string' && config.proxyExcludedKeys.indexOf(property) === -1 && !Reflect.has(target, property)) {
if (nonChainableMethodName) {
throw Error('Invalid Chai property: ' + nonChainableMethodName + '.' + property + '. See docs for proper usage of "' + nonChainableMethodName + '".');
}
var orderedProperties = getProperties(target).filter(function (property) {
return !Object.prototype.hasOwnProperty(property) && builtins.indexOf(property) === -1;
}).sort(function (a, b) {
return stringDistance(property, a) - stringDistance(property, b);
});
if (orderedProperties.length && stringDistance(orderedProperties[0], property) < 4) {
throw Error('Invalid Chai property: ' + property + '. Did you mean "' + orderedProperties[0] + '"?');
} else {
throw Error('Invalid Chai property: ' + property);
}
}
if (builtins.indexOf(property) === -1 && !flag(target, 'lockSsfi')) {
flag(target, 'ssfi', proxyGetter);
}
return Reflect.get(target, property);
}
});
};
function stringDistance(strA, strB, memo) {
if (!memo) {
memo = [];
for (var i = 0; i <= strA.length; i++) {
memo[i] = [];
}
}
if (!memo[strA.length] || !memo[strA.length][strB.length]) {
if (strA.length === 0 || strB.length === 0) {
memo[strA.length][strB.length] = Math.max(strA.length, strB.length);
} else {
memo[strA.length][strB.length] = Math.min(stringDistance(strA.slice(0, -1), strB, memo) + 1, stringDistance(strA, strB.slice(0, -1), memo) + 1, stringDistance(strA.slice(0, -1), strB.slice(0, -1), memo) + (strA.slice(-1) === strB.slice(-1) ? 0 : 1));
}
}
return memo[strA.length][strB.length];
}
return module.exports;
},
144: function (require, module, exports) {
var config = require(94);
var fnLengthDesc = Object.getOwnPropertyDescriptor(function () {}, 'length');
module.exports = function addLengthGuard(fn, assertionName, isChainable) {
if (!fnLengthDesc.configurable) return fn;
Object.defineProperty(fn, 'length', {
get: function () {
if (isChainable) {
throw Error('Invalid Chai property: ' + assertionName + '.length. Due' + ' to a compatibility issue, "length" cannot directly follow "' + assertionName + '". Use "' + assertionName + '.lengthOf" instead.');
}
throw Error('Invalid Chai property: ' + assertionName + '.length. See' + ' docs for proper usage of "' + assertionName + '".');
}
});
return fn;
};
return module.exports;
},
145: function (require, module, exports) {
var config = require(94);
module.exports = function isProxyEnabled() {
return config.useProxy && typeof Proxy !== 'undefined' && typeof Reflect !== 'undefined';
};
return module.exports;
},
146: function (require, module, exports) {
function isNaN(value) {
return value !== value;
}
module.exports = Number.isNaN || isNaN;
return module.exports;
},
147: function (require, module, exports) {
!(function (e, r) {
"object" == typeof exports && "object" == typeof module ? module.exports = r() : "function" == typeof define && define.amd ? define([], r) : "object" == typeof exports ? exports.textMaskCore = r() : e.textMaskCore = r();
})(this, function () {
return (function (e) {
function r(n) {
if (t[n]) return t[n].exports;
var o = t[n] = {
exports: {},
id: n,
loaded: !1
};
return (e[n].call(o.exports, o, o.exports, r), o.loaded = !0, o.exports);
}
var t = {};
return (r.m = e, r.c = t, r.p = "", r(0));
})([function (e, r, t) {
"use strict";
function n(e) {
return e && e.__esModule ? e : {
default: e
};
}
Object.defineProperty(r, "__esModule", {
value: !0
});
var o = t(3);
Object.defineProperty(r, "conformToMask", {
enumerable: !0,
get: function () {
return n(o).default;
}
});
var i = t(2);
Object.defineProperty(r, "adjustCaretPosition", {
enumerable: !0,
get: function () {
return n(i).default;
}
});
var a = t(5);
Object.defineProperty(r, "createTextMaskInputElement", {
enumerable: !0,
get: function () {
return n(a).default;
}
});
}, function (e, r) {
"use strict";
(Object.defineProperty(r, "__esModule", {
value: !0
}), r.placeholderChar = "_");
}, function (e, r) {
"use strict";
function t(e) {
var r = e.previousConformedValue, t = void 0 === r ? o : r, i = e.previousPlaceholder, a = void 0 === i ? o : i, u = e.currentCaretPosition, l = void 0 === u ? 0 : u, s = e.conformedValue, f = e.rawValue, d = e.placeholderChar, c = e.placeholder, v = e.indexesOfPipedChars, p = void 0 === v ? n : v, h = e.caretTrapIndexes, g = void 0 === h ? n : h;
if (0 === l) return 0;
var m = f.length, y = t.length, b = c.length, C = s.length, P = m - y, x = P > 0, O = 0 === y, k = P > 1 && !x && !O;
if (k) return l;
var j = x && (t === s || s === c), M = 0, T = void 0, w = void 0;
if (j) M = l - P; else {
var _ = s.toLowerCase(), V = f.toLowerCase(), S = V.substr(0, l).split(o), N = S.filter(function (e) {
return _.indexOf(e) !== -1;
});
w = N[N.length - 1];
var E = a.substr(0, N.length).split(o).filter(function (e) {
return e !== d;
}).length, A = c.substr(0, N.length).split(o).filter(function (e) {
return e !== d;
}).length, R = A !== E, I = void 0 !== a[N.length - 1] && void 0 !== c[N.length - 2] && a[N.length - 1] !== d && a[N.length - 1] !== c[N.length - 1] && a[N.length - 1] === c[N.length - 2];
!x && (R || I) && E > 0 && c.indexOf(w) > -1 && void 0 !== f[l] && ((T = !0, w = f[l]));
for (var J = p.map(function (e) {
return _[e];
}), q = J.filter(function (e) {
return e === w;
}).length, F = N.filter(function (e) {
return e === w;
}).length, L = c.substr(0, c.indexOf(d)).split(o).filter(function (e, r) {
return e === w && f[r] !== e;
}).length, W = L + F + q + (T ? 1 : 0), z = 0, B = 0; B < C; B++) {
var D = _[B];
if ((M = B + 1, D === w && z++, z >= W)) break;
}
}
if (x) {
for (var G = M, H = M; H <= b; H++) if ((c[H] === d && (G = H), c[H] === d || g.indexOf(H) !== -1 || H === b)) return G;
} else if (T) {
for (var K = M - 1; K >= 0; K--) if (s[K] === w || g.indexOf(K) !== -1 || 0 === K) return K;
} else for (var Q = M; Q >= 0; Q--) if (c[Q - 1] === d || g.indexOf(Q) !== -1 || 0 === Q) return Q;
}
(Object.defineProperty(r, "__esModule", {
value: !0
}), r.default = t);
var n = [], o = "";
}, function (e, r, t) {
"use strict";
function n() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : a, t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, n = t.guide, u = void 0 === n || n, l = t.previousConformedValue, s = void 0 === l ? a : l, f = t.placeholderChar, d = void 0 === f ? i.placeholderChar : f, c = t.placeholder, v = void 0 === c ? ((0, o.convertMaskToPlaceholder))(r, d) : c, p = t.currentCaretPosition, h = t.keepCharPositions, g = u === !1 && void 0 !== s, m = e.length, y = s.length, b = v.length, C = r.length, P = m - y, x = P > 0, O = p + (x ? -P : 0), k = O + Math.abs(P);
if (h === !0 && !x) {
for (var j = a, M = O; M < k; M++) v[M] === d && (j += d);
e = e.slice(0, O) + j + e.slice(O, m);
}
for (var T = e.split(a).map(function (e, r) {
return {
char: e,
isNew: r >= O && r < k
};
}), w = m - 1; w >= 0; w--) {
var _ = T[w].char;
if (_ !== d) {
var V = w >= O && y === C;
_ === v[V ? w - P : w] && T.splice(w, 1);
}
}
var S = a, N = !1;
e: for (var E = 0; E < b; E++) {
var A = v[E];
if (A === d) {
if (T.length > 0) for (; T.length > 0; ) {
var R = T.shift(), I = R.char, J = R.isNew;
if (I === d && g !== !0) {
S += d;
continue e;
}
if (r[E].test(I)) {
if (h === !0 && J !== !1 && s !== a && u !== !1 && x) {
for (var q = T.length, F = null, L = 0; L < q; L++) {
var W = T[L];
if (W.char !== d && W.isNew === !1) break;
if (W.char === d) {
F = L;
break;
}
}
null !== F ? ((S += I, T.splice(F, 1))) : E--;
} else S += I;
continue e;
}
N = !0;
}
g === !1 && (S += v.substr(E, b));
break;
}
S += A;
}
if (g && x === !1) {
for (var z = null, B = 0; B < S.length; B++) v[B] === d && (z = B);
S = null !== z ? S.substr(0, z + 1) : a;
}
return {
conformedValue: S,
meta: {
someCharsRejected: N
}
};
}
(Object.defineProperty(r, "__esModule", {
value: !0
}), r.default = n);
var o = t(4), i = t(1), a = "";
}, function (e, r, t) {
"use strict";
function n() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : l, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : u.placeholderChar;
if (e.indexOf(r) !== -1) throw new Error("Placeholder character must not be used as part of the mask. Please specify a character that is not present in your mask as your placeholder character.\n\n" + ("The placeholder character that was received is: " + JSON.stringify(r) + "\n\n") + ("The mask that was received is: " + JSON.stringify(e)));
return e.map(function (e) {
return e instanceof RegExp ? r : e;
}).join("");
}
function o(e) {
return "string" == typeof e || e instanceof String;
}
function i(e) {
return "number" == typeof e && void 0 === e.length && !isNaN(e);
}
function a(e) {
for (var r = [], t = void 0; (t = e.indexOf(s), t !== -1); ) (r.push(t), e.splice(t, 1));
return {
maskWithoutCaretTraps: e,
indexes: r
};
}
(Object.defineProperty(r, "__esModule", {
value: !0
}), r.convertMaskToPlaceholder = n, r.isString = o, r.isNumber = i, r.processCaretTraps = a);
var u = t(1), l = [], s = "[]";
}, function (e, r, t) {
"use strict";
function n(e) {
return e && e.__esModule ? e : {
default: e
};
}
function o(e) {
var r = {
previousConformedValue: void 0,
previousPlaceholder: void 0
};
return {
state: r,
update: function (t) {
var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e, o = n.inputElement, s = n.mask, d = n.guide, m = n.pipe, b = n.placeholderChar, C = void 0 === b ? p.placeholderChar : b, P = n.keepCharPositions, x = void 0 !== P && P, O = n.showMask, k = void 0 !== O && O;
if (("undefined" == typeof t && (t = o.value), t !== r.previousConformedValue)) {
("undefined" == typeof s ? "undefined" : l(s)) === y && void 0 !== s.pipe && void 0 !== s.mask && ((m = s.pipe, s = s.mask));
var j = void 0, M = void 0;
if ((s instanceof Array && (j = ((0, v.convertMaskToPlaceholder))(s, C)), s !== !1)) {
var T = a(t), w = o.selectionEnd, _ = r.previousConformedValue, V = r.previousPlaceholder, S = void 0;
if (("undefined" == typeof s ? "undefined" : l(s)) === h) {
if ((M = s(T, {
currentCaretPosition: w,
previousConformedValue: _,
placeholderChar: C
}), M === !1)) return;
var N = ((0, v.processCaretTraps))(M), E = N.maskWithoutCaretTraps, A = N.indexes;
(M = E, S = A, j = ((0, v.convertMaskToPlaceholder))(M, C));
} else M = s;
var R = {
previousConformedValue: _,
guide: d,
placeholderChar: C,
pipe: m,
placeholder: j,
currentCaretPosition: w,
keepCharPositions: x
}, I = ((0, c.default))(T, M, R), J = I.conformedValue, q = ("undefined" == typeof m ? "undefined" : l(m)) === h, F = {};
q && ((F = m(J, u({
rawValue: T
}, R)), F === !1 ? F = {
value: _,
rejected: !0
} : ((0, v.isString))(F) && (F = {
value: F
})));
var L = q ? F.value : J, W = ((0, f.default))({
previousConformedValue: _,
previousPlaceholder: V,
conformedValue: L,
placeholder: j,
rawValue: T,
currentCaretPosition: w,
placeholderChar: C,
indexesOfPipedChars: F.indexesOfPipedChars,
caretTrapIndexes: S
}), z = L === j && 0 === W, B = k ? j : g, D = z ? B : L;
(r.previousConformedValue = D, r.previousPlaceholder = j, o.value !== D && ((o.value = D, i(o, W))));
}
}
}
};
}
function i(e, r) {
document.activeElement === e && (b ? C(function () {
return e.setSelectionRange(r, r, m);
}, 0) : e.setSelectionRange(r, r, m));
}
function a(e) {
if (((0, v.isString))(e)) return e;
if (((0, v.isNumber))(e)) return String(e);
if (void 0 === e || null === e) return g;
throw new Error("The 'value' provided to Text Mask needs to be a string or a number. The value received was:\n\n " + JSON.stringify(e));
}
Object.defineProperty(r, "__esModule", {
value: !0
});
var u = Object.assign || (function (e) {
for (var r = 1; r < arguments.length; r++) {
var t = arguments[r];
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
}
return e;
}), l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
return typeof e;
} : function (e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
r.default = o;
var s = t(2), f = n(s), d = t(3), c = n(d), v = t(4), p = t(1), h = "function", g = "", m = "none", y = "object", b = "undefined" != typeof navigator && (/Android/i).test(navigator.userAgent), C = "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : setTimeout;
}]);
});
return module.exports;
},
148: function (require, module, exports) {
!(function (e, t) {
"object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.textMaskAddons = t() : e.textMaskAddons = t();
})(this, function () {
return (function (e) {
function t(r) {
if (n[r]) return n[r].exports;
var o = n[r] = {
exports: {},
id: r,
loaded: !1
};
return (e[r].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports);
}
var n = {};
return (t.m = e, t.c = n, t.p = "", t(0));
})([function (e, t, n) {
"use strict";
function r(e) {
return e && e.__esModule ? e : {
default: e
};
}
Object.defineProperty(t, "__esModule", {
value: !0
});
var o = n(1);
Object.defineProperty(t, "createAutoCorrectedDatePipe", {
enumerable: !0,
get: function () {
return r(o).default;
}
});
var i = n(2);
Object.defineProperty(t, "createNumberMask", {
enumerable: !0,
get: function () {
return r(i).default;
}
});
var u = n(3);
Object.defineProperty(t, "emailMask", {
enumerable: !0,
get: function () {
return r(u).default;
}
});
}, function (e, t) {
"use strict";
function n() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "mm dd yyyy";
return function (t) {
var n = [], r = e.split(/[^dmy]+/), o = {
dd: 31,
mm: 12,
yy: 99,
yyyy: 9999
}, i = {
dd: 1,
mm: 1,
yy: 0,
yyyy: 1
}, u = t.split("");
r.forEach(function (t) {
var r = e.indexOf(t), i = parseInt(o[t].toString().substr(0, 1), 10);
parseInt(u[r], 10) > i && ((u[r + 1] = u[r], u[r] = 0, n.push(r)));
});
var c = r.some(function (n) {
var r = e.indexOf(n), u = n.length, c = t.substr(r, u).replace(/\D/g, ""), l = parseInt(c, 10);
return l > o[n] || c.length === u && l < i[n];
});
return !c && ({
value: u.join(""),
indexesOfPipedChars: n
});
};
}
(Object.defineProperty(t, "__esModule", {
value: !0
}), t.default = n);
}, function (e, t) {
"use strict";
function n() {
function e() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : c, t = e.length;
if (e === c || e[0] === h[0] && 1 === t) return h.split(c).concat([v]).concat(m.split(c));
if (e === S && M) return h.split(c).concat(["0", S, v]).concat(m.split(c));
var n = e.lastIndexOf(S), u = n !== -1, l = e[0] === s && I, a = void 0, g = void 0, b = void 0;
if ((e.slice(V * -1) === m && (e = e.slice(0, V * -1)), u && (M || D) ? ((a = e.slice(e.slice(0, $) === h ? $ : 0, n), g = e.slice(n + 1, t), g = r(g.replace(f, c)))) : a = e.slice(0, $) === h ? e.slice($) : e, N && ("undefined" == typeof N ? "undefined" : i(N)) === p)) {
var O = "." === _ ? "[.]" : "" + _, j = (a.match(new RegExp(O, "g")) || []).length;
a = a.slice(0, N + j * q);
}
return (a = a.replace(f, c), A || (a = a.replace(/^0+(0$|[^0])/, "$1")), a = x ? o(a, _) : a, b = r(a), (u && M || D === !0) && ((e[n - 1] !== S && b.push(y), b.push(S, y), g && ((("undefined" == typeof C ? "undefined" : i(C)) === p && (g = g.slice(0, C)), b = b.concat(g))), D === !0 && e[n - 1] === S && b.push(v))), $ > 0 && (b = h.split(c).concat(b)), l && ((b.length === $ && b.push(v), b = [d].concat(b))), m.length > 0 && (b = b.concat(m.split(c))), b);
}
var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = t.prefix, h = void 0 === n ? u : n, g = t.suffix, m = void 0 === g ? c : g, b = t.includeThousandsSeparator, x = void 0 === b || b, O = t.thousandsSeparatorSymbol, _ = void 0 === O ? l : O, j = t.allowDecimal, M = void 0 !== j && j, P = t.decimalSymbol, S = void 0 === P ? a : P, w = t.decimalLimit, C = void 0 === w ? 2 : w, k = t.requireDecimal, D = void 0 !== k && k, E = t.allowNegative, I = void 0 !== E && E, R = t.allowLeadingZeroes, A = void 0 !== R && R, L = t.integerLimit, N = void 0 === L ? null : L, $ = h && h.length || 0, V = m && m.length || 0, q = _ && _.length || 0;
return (e.instanceOf = "createNumberMask", e);
}
function r(e) {
return e.split(c).map(function (e) {
return v.test(e) ? v : e;
});
}
function o(e, t) {
return e.replace(/\B(?=(\d{3})+(?!\d))/g, t);
}
Object.defineProperty(t, "__esModule", {
value: !0
});
var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
return typeof e;
} : function (e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
t.default = n;
var u = "$", c = "", l = ",", a = ".", s = "-", d = /-/, f = /\D+/g, p = "number", v = /\d/, y = "[]";
}, function (e, t, n) {
"use strict";
function r(e) {
return e && e.__esModule ? e : {
default: e
};
}
function o(e, t) {
e = e.replace(O, v);
var n = t.placeholderChar, r = t.currentCaretPosition, o = e.indexOf(y), s = e.lastIndexOf(p), d = s < o ? -1 : s, f = i(e, o + 1, y), h = i(e, d - 1, p), g = u(e, o, n), m = c(e, o, d, n), b = l(e, d, n, r);
(g = a(g), m = a(m), b = a(b, !0));
var x = g.concat(f).concat(m).concat(h).concat(b);
return x;
}
function i(e, t, n) {
var r = [];
return (e[t] === n ? r.push(n) : r.push(h, n), r.push(h), r);
}
function u(e, t) {
return t === -1 ? e : e.slice(0, t);
}
function c(e, t, n, r) {
var o = v;
return (t !== -1 && (o = n === -1 ? e.slice(t + 1, e.length) : e.slice(t + 1, n)), o = o.replace(new RegExp("[\\s" + r + "]", m), v), o === y ? f : o.length < 1 ? g : o[o.length - 1] === p ? o.slice(0, o.length - 1) : o);
}
function l(e, t, n, r) {
var o = v;
return (t !== -1 && (o = e.slice(t + 1, e.length)), o = o.replace(new RegExp("[\\s" + n + ".]", m), v), 0 === o.length ? e[t - 1] === p && r !== e.length ? f : v : o);
}
function a(e, t) {
return e.split(v).map(function (e) {
return e === g ? e : t ? x : b;
});
}
Object.defineProperty(t, "__esModule", {
value: !0
});
var s = n(4), d = r(s), f = "*", p = ".", v = "", y = "@", h = "[]", g = " ", m = "g", b = /[^\s]/, x = /[^.\s]/, O = /\s/g;
t.default = {
mask: o,
pipe: d.default
};
}, function (e, t) {
"use strict";
function n(e, t) {
var n = t.currentCaretPosition, i = t.rawValue, f = t.previousConformedValue, p = t.placeholderChar, v = e;
v = r(v);
var y = v.indexOf(c), h = null === i.match(new RegExp("[^@\\s." + p + "]"));
if (h) return u;
if (v.indexOf(a) !== -1 || y !== -1 && n !== y + 1 || i.indexOf(o) === -1 && f !== u && i.indexOf(l) !== -1) return !1;
var g = v.indexOf(o), m = v.slice(g + 1, v.length);
return ((m.match(d) || s).length > 1 && v.substr(-1) === l && n !== i.length && (v = v.slice(0, v.length - 1)), v);
}
function r(e) {
var t = 0;
return e.replace(i, function () {
return (t++, 1 === t ? o : u);
});
}
(Object.defineProperty(t, "__esModule", {
value: !0
}), t.default = n);
var o = "@", i = /@/g, u = "", c = "@.", l = ".", a = "..", s = [], d = /\./g;
}]);
});
return module.exports;
},
155: function (require, module, exports) {
var DOM;
DOM = require(4);
module.exports = DOM.template(['*svg', {
attrs: {
width: '12px',
height: '12px',
viewBox: '5 7 12 12',
tabindex: -1,
focusable: false
},
style: {
width: '9px',
height: '9px'
}
}, ['*polyline', {
attrs: {
'stroke-width': '2',
'stroke-linecap': 'round',
'stroke-linejoin': 'round',
fill: 'none',
points: '7 13.8888889 9.66666667 17 15 9',
tabindex: -1,
focusable: false
}
}]]);
return module.exports;
},
156: function (require, module, exports) {
var DOM;
DOM = require(4);
module.exports = DOM.template(['*svg', {
attrs: {
width: '1792px',
height: '1792px',
viewBox: '0 0 1792 1792',
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
d: 'M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z'
}
}]]);
return module.exports;
},
157: function (require, module, exports) {
var DOM;
DOM = require(4);
module.exports = DOM.template(['*svg', {
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
}]]);
return module.exports;
},
158: function (require, module, exports) {
var DOM;
DOM = require(4);
module.exports = DOM.template(['*svg', {
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
d: 'M402 201c0 5-2 9-5 13l-128 128c-4 4-8 5-13 5s-9-1-13-5l-128-128c-3-4-5-8-5-13s2-9 5-13c4-3 8-5 13-5h256c5 0 9 2 13 5 3 4 5 8 5 13z'
}
}]]);
return module.exports;
},
159: function (require, module, exports) {
module.exports = function getProperties(object) {
var result = Object.getOwnPropertyNames(object);
function addProperty(property) {
if (result.indexOf(property) === -1) {
result.push(property);
}
}
var proto = Object.getPrototypeOf(object);
while (proto !== null) {
Object.getOwnPropertyNames(proto).forEach(addProperty);
proto = Object.getPrototypeOf(proto);
}
return result;
};
return module.exports;
},
160: function (require, module, exports) {
module.exports = function getEnumerableProperties(object) {
var result = [];
for (var name in object) {
result.push(name);
}
return result;
};
return module.exports;
}
}, this);
return require(0);
}).call(this, null, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : this);
