DOM = import 'quickdom'

module.exports = ()->
	margin = arguments[0]
	margin = 20 if isNaN(margin)
	DOM.div(
		ref: 'testTitle'
		style: {marginTop:margin, marginBottom:margin}
	).appendTo(sandbox)
