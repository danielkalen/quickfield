IS = import '@danielkalen/is'
SimplyBind = import '@danielkalen/simplybind'


class Condition
	constructor: (@field, @settings, @callback)->
		@satisfied = false
		@value = @settings.value
		@property = @settings.property or '_value'
		@property = '_value' if @settings.property is 'value'
		target = @field.allFields[@settings.target] or @settings.target	
		
		if IS.field(target)
			@target = target
		else
			return console.warn("condition target not found for the provided ID '#{condition.target}'", @field)

		property = if IS.array(@target[@property]) then "array:#{@property}" else @property

		SimplyBind(property, updateOnBind:false).of(@target)
			.and('visible').of(@target.state)
				.to(@callback)

		SimplyBind('satisfied', updateOnBind:false).of(@)
			.to (newValue, oldValue)=> @field.emit?('conditionChange', @) if oldValue?


	test: ()->
		if not @target.state.visible
			return false

		comparison = switch
			when IS.objectPlain(@value) then @value
			when IS.regex(@value) then '$regex':@value
			when @value is 'valid' and not @settings.property or not IS.defined(@value) then 'valid'
			else '$eq':@value

		if comparison is 'valid'
			return @target.validate()
		
		targetValue = do ()=>
			return @target.value if @property is '_value'
			propertyChain = @property.split('.')
			switch
				when propertyChain.length is 1
					@target[@property]

				when IS.defined(@target[@property])
					@target[@property]
				
				else
					nestedObject = @target
					while IS.object(nestedObject)
						nestedObject = nestedObject[propertyChain.pop()]

					return nestedObject

		comparisonOperators = Object.keys(comparison)
		passedComparisons = comparisonOperators.filter (operator)->
			seekedValue = comparison[operator]
			switch operator
				when '$eq'		then targetValue is seekedValue 
				when '$ne'		then targetValue isnt seekedValue
				when '$gt'		then targetValue > seekedValue
				when '$gte'		then targetValue >= seekedValue
				when '$lt'		then targetValue < seekedValue
				when '$lte'		then targetValue <= seekedValue
				when '$ct'		then helpers.includes(targetValue, seekedValue)
				when '$nct'		then not helpers.includes(targetValue, seekedValue)
				when '$regex'	then seekedValue.test(targetValue)
				when '$nregex'	then not seekedValue.test(targetValue)
				when '$mask'	then helpers.testMask(targetValue, seekedValue)
				else false

		return passedComparisons.length is comparisonOperators.length


	@validate: (conditions)-> if conditions
		validConditions = conditions.filter (condition)->
			condition.satisfied = condition.test()
		
		return validConditions.length is conditions.length


	@init: (field, conditions, callback)-> setTimeout ()=>
		callback ?= ()=> field.validateConditions()
		
		field.conditions = conditions.map (condition)->
			new Condition(field, condition, callback)

		callback()




module.exports = Condition