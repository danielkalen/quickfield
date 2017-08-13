DOM = import 'quickdom'

module.exports = (title, margin=20)->
	DOM.div(
		ref: 'testTitle'
		style:{marginTop:margin, marginBottom:margin, fontSize:16, fontWeight:600, fontFamily:'system-ui, sans-serif'}
	,title).appendTo(sandbox)
