DOM = import 'quickdom'

module.exports = ()->
	DOM.div(
		ref: 'testTitle'
		style: {marginTop:20}
	).appendTo(sandbox)
