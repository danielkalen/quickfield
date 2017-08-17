IS = import '@danielkalen/is'
IS = IS.create('natives','dom')
IS.load
	field: (target)-> target and target instanceof require('./field')
	regex: (target)-> target instanceof RegExp
	objectable: (target)-> IS.object(target) or IS.function(target)

module.exports = IS