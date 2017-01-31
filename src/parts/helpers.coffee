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

helpers.testCondition = (value, condition)->

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



helpers.stripMask = (input, mask, placeholder)->
	return input if not input or not mask
	output = ''
	inputLength = input.length
	maskPos = 0
	inputPos = 0
	isOptional = false
	isLiteral = false
	validMaskChars = ['1','a','A','*','#']

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
				inputCharIsValid = helpers.testMaskChar(inptuChar, maskChar)

		prevMaskChar = mask[maskPos] unless mask[maskPos] is '+' and inputCharIsValid
		maskPos++ unless isOptional and inputCharIsValid
		inputChar++

	return output











