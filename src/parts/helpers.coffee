IS = import '@danielkalen/is'
DOM = import 'quickdom/src'
SimplyBind = import '@danielkalen/simplybind/debug'
regex = import './regex'

helpers = {}
helpers.noop = ()->

helpers.includes = (target, item)->
	target and target.indexOf(item) isnt -1

helpers.removeItem = (target, item)->
	itemIndex = target.indexOf(item)
	target.splice(itemIndex, 1)  if itemIndex isnt -1

helpers.find = (target, fn)->
	results = target.filter(fn)
	results[0]

helpers.diff = (source, comparee)->
	result = []
	maxLen = Math.max(source.length, comparee.length)
	i = -1
	
	while ++i < maxLen
		sourceVal = source[i]
		compareeVal = comparee[i]

		if sourceVal isnt compareeVal
			result.push(sourceVal) if IS.defined(sourceVal) and not helpers.includes(comparee, sourceVal)
			result.push(compareeVal) if IS.defined(compareeVal) and not helpers.includes(source, compareeVal)

	return result


helpers.hexToRGBA = (hex, alpha)->
	hex = hex.slice(1) if hex[0] is '#'
	R = parseInt hex.slice(0,2), 16
	G = parseInt hex.slice(2,4), 16
	B = parseInt hex.slice(4,6), 16
	return "rgba(#{R}, #{G}, #{B}, #{alpha})"



helpers.unlockScroll = (excludedEl)->
	window._isLocked = false
	DOM(window).off 'wheel.lock'


helpers.lockScroll = (excludedEl)-> unless window._isLocked
	window._isLocked = true
	DOM(window).on 'wheel.lock', (event)->
		if event.target is excludedEl.raw or DOM(event.target).parentMatching((parent)-> parent is excludedEl)
			if event.wheelDelta > 0 and excludedEl.raw.scrollTop is 0
				return event.preventDefault()

			if event.wheelDelta < 0 and excludedEl.raw.scrollHeight - excludedEl.raw.scrollTop is excludedEl.raw.clientHeight
				return event.preventDefault()

		else
			event.preventDefault()


helpers.fuzzyMatch = (needle, haystack, caseSensitive)->
	nLength = needle.length
	hLength = haystack.length
	unless caseSensitive
		needle = needle.toUpperCase()
		haystack = haystack.toUpperCase()

	if nLength > hLength
		return false
	if nLength is hLength
		return needle is haystack

	nI = hI = matchedCount =0
	while nI < nLength
		needleChar = needle[nI++]
		
		while hI < hLength
			if haystack[hI++] is needleChar
				matchedCount++
				break

	return matchedCount is nLength


helpers.getIndexOfFirstDiff = (sourceString, compareString)->
	currentPos = 0
	maxLength = Math.max(sourceString.length, compareString.length)
	
	while currentPos < maxLength
		return currentPos if sourceString[currentPos] isnt compareString[currentPos]
		currentPos++
	
	return null



helpers.testCondition = (condition)->
	if not condition or not condition.target
		throw new Error "Invalid condition provided: #{JSON.stringify(condition)}"

	if not condition.target.state.visible
		return false

	comparison = switch
		when IS.objectPlain(condition.value) then condition.value
		when IS.regex(condition.value) then '$regex':condition.value
		when condition.value is 'valid' and not condition.property or not IS.defined(condition.value) then 'valid'
		else '$eq':condition.value

	if comparison is 'valid'
		return condition.target.validate()
	
	targetValue = do ()->
		propertyChain = condition.property.split('.')
		switch
			when propertyChain.length is 1
				condition.target[condition.property]

			when IS.defined(condition.target[condition.property])
				condition.target[condition.property]
			
			else
				nestedObject = condition.target
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



helpers.validateConditions = (conditions)->	if conditions
	validConditions = conditions.filter (condition)-> helpers.testCondition(condition)
	return validConditions.length is conditions.length


helpers.initConditions = (instance, conditions, callback)-> setTimeout ()=>
	conditions.forEach (condition)=>
		conditionTarget = if IS.string(condition.target) then instance.allFields[condition.target] else if IS.field(condition.target) then condition.target
		if conditionTarget
			condition.target = conditionTarget
		else
			return console.warn("Condition target not found for the provided ID '#{condition.target}'", instance)
		
		targetProperty = if IS.array(conditionTarget['value']) then 'array:value' else 'value'

		SimplyBind(targetProperty, updateOnBind:false).of(conditionTarget)
			.and('visible').of(conditionTarget.state)
				.to(callback)
	
	callback()



helpers.parseCssShorthandValue = (string)->
	values = string.split(regex.whiteSpace).map(parseFloat)
	result = {}
	switch values.length
		when 1
			result.top = result.right = result.bottom = result.left = values[0]
		when 1
			result.top = result.bottom = values[0]
			result.right = result.left = values[1]
		when 2
			result.top = values[0]
			result.right = result.left = values[1]
			result.bottom = values[2]
		when 2
			result.top = values[0]
			result.right = values[1]
			result.bottom = values[2]
			result.left = values[3]

	return result











module.exports = helpers