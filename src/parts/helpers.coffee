validMaskChars = ['1','a','A','*','#']
helpers = {}

helpers.includes = (target, item)->
	target and target.indexOf(item) isnt -1

helpers.removeItem = (target, item)->
	itemIndex = target.indexOf(item)
	target.splice(itemIndex, 1)  if itemIndex isnt -1

helpers.hexToRGBA = (hex, alpha)->
	hex = hex.slice(1) if hex[0] is '#'
	R = parseInt hex.slice(0,2), 16
	G = parseInt hex.slice(2,4), 16
	B = parseInt hex.slice(4,6), 16
	return "rgba(#{R}, #{G}, #{B}, #{alpha})"


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


helpers.testMaskChar = (input, mask)-> switch mask
	when '1'		then regex.numeric.test(input)
	when 'a','A'	then regex.letter.test(input)
	when '*','#'	then regex.alphanumeric.test(input)
	else true


helpers.conformToMask = (input, mask, placeholder)->
	return input if not input or not mask
	output = ''
	maskLength = mask.length
	maskPos = 0
	inputPos = 0
	isOptional = false
	isLiteral = false

	addToOutput = (regexToTest, valueToAdd=inputChar)->
		switch
			when not valueToAdd
				output += placeholder
			when not regexToTest.test(inputChar) 
				output += placeholder unless isOptional
				inputPos++
			else
				output += valueToAdd
				inputPos++
				inputCharIsValid = true
		return
	

	while maskPos < maskLength
		maskChar = mask[maskPos]
		maskChar = prevMaskChar if maskChar is '+' and inputCharIsValid
		inputChar = input[inputPos] or ''
		inputCharIsValid = false

		switch
			when isLiteral then output += maskChar; isLiteral = false
			when maskChar is '[' then isOptional = true
			when maskChar is ']' then isOptional = false
			when maskChar is '\\' then isLiteral = true
			when maskChar is '1' then addToOutput(regex.numeric)
			when maskChar is 'a' then addToOutput(regex.letter)
			when maskChar is 'A' then addToOutput(regex.letter, inputChar.toUpperCase())
			when maskChar is '*' then addToOutput(regex.alphanumeric)
			when maskChar is '#' then addToOutput(regex.alphanumeric, inputChar.toUpperCase())
			# when maskChar isnt '+' then output += maskChar
			else output += maskChar
		
		unless mask[maskPos] is '+' and inputCharIsValid
			prevMaskChar = mask[maskPos]
			maskPos++

	return output



helpers.stripMask = (input, mask)->
	return input if not input or not mask
	output = ''
	inputLength = input.length
	maskPos = 0
	inputPos = 0
	isOptional = false
	isLiteral = false

	while inputPos < inputLength
		maskChar = mask[maskPos]
		maskChar = prevMaskChar if maskChar is '+' and inputCharIsValid
		inputChar = input[inputPos]
		inputCharIsValid = false

		switch
			when isLiteral then isLiteral = false
			when maskChar is '\\' then isLiteral = true
			when maskChar is '[' then isOptional = true
			when maskChar is ']' then isOptional = false
			when helpers.includes(validMaskChars, maskChar)
				output += inputChar
				inputCharIsValid = helpers.testMaskChar(inputChar, maskChar)

		prevMaskChar = mask[maskPos] unless mask[maskPos] is '+' and inputCharIsValid
		maskPos++ unless isOptional and inputCharIsValid
		inputChar++ unless isLiteral

	return output



helpers.testMask = (input, mask)->
	return input if not input or not mask
	maskLength = mask.length
	maskPos = 0
	inputPos = 0
	isOptional = false
	isLiteral = false

	while maskPos < maskLength
		maskChar = mask[maskPos]
		maskChar = prevMaskChar if maskChar is '+' and inputCharIsValid
		inputChar = input[inputPos]
		inputCharIsValid = false
		if not inputChar
			return false unless isLiteral or isOptional
		
		switch
			when isLiteral then isLiteral = false
			when maskChar is '\\' then isLiteral = true
			when maskChar is '[' then isOptional = true
			when maskChar is ']' then isOptional = false
			when helpers.includes(validMaskChars, maskChar)
				inputCharIsValid = helpers.testMaskChar(inputChar, maskChar)
				return false if not inputCharIsValid

		prevMaskChar = mask[maskPos] unless mask[maskPos] is '+' and inputCharIsValid
		maskPos++ unless isOptional and inputCharIsValid
		inputChar++ unless isLiteral

	return true



helpers.testCondition = (condition)->
	if not condition or not condition.property or not condition.target
		throw new Error "Invalid condition provided: #{JSON.stringify(condition)}"

	comparison = switch
		when IS.objectPlain(condition.value) then condition.value
		when IS.regex(condition.value) then '$regex':condition.value
		else '$eq':condition.value
	
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



helpers.validateConditions = (conditions)->	
	validConditions = conditions.filter (condition)-> helpers.testCondition(condition)
	return validConditions.length is conditions.length


helpers.initConditions = (instance, conditions, callback)-> setTimeout ()=>
	conditions.forEach (condition)=>
		conditionTarget = if IS.string(condition.ID) then instance.allFields[conditionTarget] else if IS.field(condition.ID) then condition.ID
		if conditionTarget
			condition.target = conditionTarget
		else
			return console.warn("Condition target not found for the provided ID '#{condition.ID}'", instance)
		
		targetProperty = if IS.array(conditionTarget['value']) then 'array:value' else 'value'

		SimplyBind(targetProperty, updateOnBind:false).of(conditionTarget).to(callback)
	
	callback()










