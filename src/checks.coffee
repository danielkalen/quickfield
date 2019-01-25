import IS_ from '@danielkalen/is'
# import Field from './field'

IS = IS_.create('natives','dom')
IS.load
	# field: (target)-> target and target instanceof Field
	regex: (target)-> target instanceof RegExp
	objectable: (target)-> IS.object(target) or IS.function(target)

export default IS