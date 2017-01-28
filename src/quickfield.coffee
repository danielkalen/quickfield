do ()->	
	### istanbul ignore next ###
	import * as CSS from 'quickcss'
	### istanbul ignore next ###
	import * as DOM from 'quickdom/src'
	### istanbul ignore next ###
	import * as extend from 'smart-extend'
	### istanbul ignore next ###
	import * as SimplyBind from '@danielkalen/simplybind'
	IS = DOM._checks

	
	QuickField = (options)->
		options = {} unless IS.object(options)
		options.type ?= 'text'

		return new Field[options.type](options)
		










	QuickField.version = import ../.config/.version
	
	
	### istanbul ignore next ###
	if exports?.module?
		module.exports = QuickField
	else if typeof define is 'function' and define.amd
		define ['quickfield'], ()-> QuickField
	else
		@Field = QuickField