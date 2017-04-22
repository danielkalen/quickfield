REGEX = import '../regex'
IS = import '@danielkalen/is'
helpers = import '../helpers'
stringDistance = import 'leven'
validPatternChars = ['1','#','a','A','*','^']

Mask = (@pattern, @placeholder, @guide)->
	@minRequiredCount = 0
	@optionalsOffset = 0
	@lastValid = null
	@lastInput = ''
	@valid = false
	@value = ''
	@valueRaw = ''
	@valueStrict = ''
	@prev = {}
	@literals = []
	@optionals = []
	@repeatables = []

	@_normalizePattern()
	@setValue('')
	return @


# Mask::keydown = (event)->
# 	switch event
# 		when 'left' then @caret -= 1
# 		when 'right' then @caret += 1
# 		when 'up' then @caret = 0
# 		when 'down' then @caret = Infinity
# 		when 'shift' then @modifier = true
# 		when 'caps lock' then @capsLock = true
# 		when 

# Mask::keyup = (event)->
# 	switch event
# 		when 'shift' then @modifier = false
# 		when 'caps lock' then @capsLock = false


Mask::_normalizePattern = ()->
	outputPattern = ''
	minRequiredCount = 0
	patternPos = 0
	offset = 0
	firstNonLiteral = 0
	
	while patternPos < @pattern.length
		patternChar = @pattern[patternPos]
		
		switch
			when isLiteral
				isLiteral = false
				@literals.push(patternPos - offset)
				outputPattern += patternChar
				firstNonLiteral++ if minRequiredCount is 0

			when patternChar is '\\'
				isLiteral = true
				offset++
			
			when patternChar is '['
				isOptional = true
				offset++
			
			when patternChar is ']'
				isOptional = false
				offset++
			
			when patternChar is '+'
				offset++
			
			else
				if not helpers.includes(validPatternChars, patternChar)
					@literals.push(patternPos - offset)
					firstNonLiteral++ if minRequiredCount is 0

				else if isOptional
					@optionals.push(patternPos - offset)

				else
					minRequiredCount++

				if @pattern[patternPos+1] is '+'
					@repeatables.push(patternPos - offset)

				outputPattern += patternChar

		patternPos++

	@minRequiredCount = minRequiredCount
	@firstNonLiteral = firstNonLiteral
	@pattern = outputPattern




Mask::setValue = (input)->
	changeIndex = helpers.getIndexOfFirstDiff(@value, input)
	changeDistance = stringDistance(@value, input)
	isBackwards = if input.length is 1 and @valueRaw.length is 0 then false else @value.length > input.length
	isForwards = not isBackwards
	lastInput = input.slice(changeIndex, changeIndex+changeDistance) if isForwards
	output = ''
	outputRaw = ''
	outputStrict = ''
	patternLength = @pattern.length
	patternPos = 0
	inputPos = 0
	return if not changeDistance and @value
	return if isBackwards and helpers.includes(@literals, changeIndex-@optionalsOffset) and changeIndex-@optionalsOffset > @firstNonLiteral

	while patternPos < patternLength
		patternPosCurrent = patternPos
		patternChar = @pattern[patternPos]
		inputChar = input[inputPos]
		isLiteral = helpers.includes(@literals, patternPos)
		isOptional = helpers.includes(@optionals, patternPos)
		isRepeatable = helpers.includes(@repeatables, patternPos)

		break if input and not inputChar and not @guide

		switch
			when isLiteral
				output += patternChar
				outputStrict += patternChar

				if patternChar is inputChar
					inputPos++ unless (helpers.includes(validPatternChars, patternChar) and isForwards) or (changeDistance >= @literals.length and changeDistance > 1 and @valueRaw.length)
				else if changeDistance is 1 and input[inputPos+1] is patternChar
					inputPos += 2
				
				patternPos++


			when helpers.includes(validPatternChars, patternChar)
				isValid = inputChar and @testCharAtPos(inputPos, inputChar, patternChar)

				if not isValid
					unless isForwards and changeDistance is 1 and @testCharAtPos(inputPos+1, input[inputPos+1], patternChar)
						patternPos++
						unless isOptional or not @guide
							output += @placeholder
							outputStrict += @placeholder

					else if isOptional
						inputPos++
					
					inputPos++ unless isOptional
				
				else
					inputChar = inputChar.toUpperCase() if patternChar is 'A' or patternChar is '^'
					output += inputChar
					outputRaw += inputChar
					outputStrict += inputChar unless (isOptional or isRepeatable) and prevPatternPos is patternPos
					nextIsValid = input[inputPos+1] and testChar(input[inputPos+1], patternChar)

					inputPos++
					patternPos++ unless nextIsValid and isRepeatable
					inputPos++ if isRepeatable and not nextIsValid and helpers.includes(@literals, patternPos) and input[inputPos] isnt @pattern[patternPos]

			# else
			# 	debugger

		prevPatternPos = patternPosCurrent

	
	@prev.value = @value
	@prev.valueRaw = @valueRaw
	@prev.valueStrict = @valueStrict
	
	@value = output
	@valueRaw = outputRaw
	@valueStrict = outputStrict
	@lastInput = lastInput if lastInput
	@optionalsOffset = stringDistance(output, outputStrict)
	@valid = @validate(input, true)
	return



Mask::getNearestLiteral = (inputPos)->
	for index in @literals
		return @pattern[index] if index >= inputPos
	return


Mask::validate = (input, storeLastValid)->
	return false if not IS.string(input) or input.length < @minRequiredCount
	patternLength = @pattern.length
	patternPos = 0
	inputPos = 0

	while patternPos < patternLength
		patternChar = @pattern[patternPos]
		inputChar = input[inputPos]
		isLiteral = helpers.includes(@literals, patternPos)
		isOptional = helpers.includes(@optionals, patternPos)
		isRepeatable = helpers.includes(@repeatables, patternPos)

		switch
			when isLiteral
				patternPos++
				inputPos++ if patternChar is inputChar and input[inputPos+1]?

			when helpers.includes(validPatternChars, patternChar)
				isValid = inputChar and testChar(inputChar, patternChar)
				
				if not isValid
					if isOptional
						patternPos++
					else
						if storeLastValid
							@lastValid = if inputPos-1 < 0 then null else inputPos-1
						return false
				else
					nextIsValid = input[inputPos+1] and testChar(input[inputPos+1], patternChar)

					inputPos++
					patternPos++ unless nextIsValid and isRepeatable

	@lastValid = inputPos if storeLastValid
	return true


Mask::normalizeCursorPos = (cursorPos, prevCursorPos)->
	isBackwards = prevCursorPos > cursorPos
	if cursorPos <= @firstNonLiteral
		diff = if @firstNonLiteral - cursorPos >= 1 and not isBackwards or @firstNonLiteral is 1 then 1 else 0
		prevCursorPos = @firstNonLiteral+diff + (prevCursorPos-cursorPos)
		cursorPos = @firstNonLiteral+diff
	offset = 0
	value = @value.slice(0, cursorPos)
	valueStrict = @valueStrict.slice(0, cursorPos)
	changeIndex = helpers.getIndexOfFirstDiff(@value, @prev.value)

	charPos = 0
	while charPos < cursorPos
		offset++ if value[charPos] isnt valueStrict[charPos-offset]
		charPos++

	if isBackwards
		if cursorPos is @firstNonLiteral
			return cursorPos

		if helpers.includes(@literals, cursorPos-1) or @value[cursorPos-1] is @placeholder
			return cursorPos-(if offset is 0 then 1 else 0)
	else
		if changeIndex is null
			if helpers.includes(@literals, cursorPos-offset-1) and valueStrict[cursorPos-offset-1] is @lastInput
				return cursorPos
			else
				return Math.max(cursorPos-1, @firstNonLiteral)
		
		if helpers.includes(@repeatables, cursorPos-offset)
			return cursorPos
		
		if helpers.includes(@repeatables, changeIndex-offset)
			return cursorPos
		
		if helpers.includes(@literals, cursorPos-offset)
			return cursorPos+(if offset is 0 then 1 else 0)
		
		if helpers.includes(@literals, changeIndex-1) and changeIndex is cursorPos
			return (cursorPos+1)#+offset

	return cursorPos



Mask::isLiteralAtPos = (targetPos)->
	helpers.includes(@literals, targetPos)


Mask::isRepeatableAtPos = (targetPos)->
	targetPos -= @optionalsOffset+1 unless targetPos is 0
	helpers.includes(@repeatables, targetPos)










Mask::testCharAtPos = (inputPos, inputChar, patternChar)->
	return false if @getNearestLiteral(inputPos) is inputChar
	return testChar(inputChar, patternChar)


testChar = (input, patternChar)-> switch patternChar
	when '1'		then REGEX.numeric.test(input)
	when '#'		then REGEX.widenumeric.test(input)
	when 'a','A'	then REGEX.letter.test(input)
	when '*','^'	then REGEX.alphanumeric.test(input)
	else false




module.exports = Mask