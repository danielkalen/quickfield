export default keyCodes =
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
	hyphen: 45
	underscore: 95
	question: 63
	exclamation: 33
	frontslash: 47
	backslash: 92
	comma: 44
	period: 46
	space: 32

	anyArrow: (code)->
		code is keyCodes.up or
		code is keyCodes.down or
		code is keyCodes.left or
		code is keyCodes.right
	
	anyModifier: (code)->
		code is keyCodes.ctrl or
		code is keyCodes.alt or
		code is keyCodes.shift or
		code is keyCodes.super or
		code is keyCodes.super2
	
	anyAlpha: (code)->
		97 <= code <= 122 or
		65 <= code <= 90

	anyNumeric: (code)->
		48 <= code <= 57


	anyAlphaNumeric: (code)->
		keyCodes.anyAlpha(code) or
		keyCodes.anyNumeric(code)

	anyPrintable: (code)->
		keyCodes.anyAlpha(code) or
		keyCodes.anyNumeric(code) or
		code is keyCodes.hyphen or
		code is keyCodes.underscore or
		code is keyCodes.question or
		code is keyCodes.exclamation or
		code is keyCodes.frontslash or
		code is keyCodes.backslash or
		code is keyCodes.comma or
		code is keyCodes.period or 
		code is keyCodes.space



