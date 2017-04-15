module.exports = keyCodes =
	delete: 8
	enter: 13
	esc: 27
	ctrl: 17
	alt: 18
	shift: 16
	super: 91
	super2: 93
	up: 38
	left: 37
	right: 39
	down: 40

	anyArrow: (code)->  code is keyCodes.up or code is keyCodes.down or code is keyCodes.left or code is keyCodes.right
	anyModifier: (code)-> code is keyCodes.ctrl or code is keyCodes.alt or code is keyCodes.shift or code is keyCodes.super or code is keyCodes.super2
