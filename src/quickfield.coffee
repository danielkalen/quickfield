do ()->	
	QuickField = ()->










	QuickField.version = import ../.config/.version
	
	### istanbul ignore next ###
	import * as CSS from 'quickcss'
	
	### istanbul ignore next ###
	import * as Dom from 'quickdom/src'
	
	### istanbul ignore next ###
	import * as extend from 'smart-extend'
	
	### istanbul ignore next ###
	if exports?.module?
		module.exports = QuickField
	else if typeof define is 'function' and define.amd
		define ['quickfield'], ()-> QuickField
	else
		@Field = QuickField