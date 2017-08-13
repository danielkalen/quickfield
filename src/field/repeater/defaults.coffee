import {inlineGroup, blockGroup} from './template'

module.exports =
	fields: null
	style: 'block'
	collapsable: true
	startCollapsed: false
	groupMargin: 10
	minItems: null
	maxItems: null
	draggable: false
	cloneable: false
	removeable: true
	singleMode: false
	numbering: false
	multiple: true
	groupSettings:
		inline:
			padding: 0
			fieldMargin: 0
			width: 'auto'
			collapsable: false
			templates: inlineGroup

		block:
			templates: blockGroup