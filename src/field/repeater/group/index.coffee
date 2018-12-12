import defaults from './defaults'
import * as template from './template'


class Group extends require('event-lite')
	constructor: (settings)->
		super()
		@settings = extend.clone.deep(defaults, settings)



module.exports = Group