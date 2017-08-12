DOM = import 'quickdom'

module.exports = (title)->
	DOM.div(
		ref: 'testTitle'
		style:{marginTop:20, fontSize:16, fontWeight:600, fontFamily:'system-ui, sans-serif'}
	,title).appendTo(sandbox)
