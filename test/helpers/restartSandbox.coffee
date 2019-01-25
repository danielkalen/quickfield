import DOM from 'quickdom'

export default restartSandbox = ()->
	if window.sandbox
		delete quickfield.instances[id] for id,field of quickfield.instances
		window.sandbox.remove()
	
	window.sandbox = DOM.div(id:'sandbox', style:{border:'1px solid', padding:'20px', boxSizing:'border-box'}).appendTo(document.body)
