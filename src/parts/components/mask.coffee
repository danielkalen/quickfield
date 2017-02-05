validPatternChars = ['1','a','A','*','#']

Mask = (@pattern, @placeholder)->
	@minRequiredCount = 0
	@optionalsOffset = 0
	@lastValid = null
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

				else if @pattern[patternPos+1] is '+'
					@repeatables.push(patternPos - offset)
					minRequiredCount++

				else
					minRequiredCount++

				outputPattern += patternChar

		patternPos++

	@minRequiredCount = minRequiredCount
	@firstNonLiteral = firstNonLiteral
	@pattern = outputPattern




Mask::setValue = (input)->
	changeIndex = helpers.getIndexOfFirstDiff(@value, input)
	changeDistance = stringDistance(@value, input)
	isBackwards = if input.length is 1 and @valueRaw.length is 0 then false else @value.length > input.length
	output = ''
	outputRaw = ''
	outputStrict = ''
	patternLength = @pattern.length
	patternPos = 0
	inputPos = 0
	return if not changeDistance
	return if isBackwards and helpers.includes(@literals, changeIndex-@optionalsOffset) and changeIndex-@optionalsOffset > @firstNonLiteral

	while patternPos < patternLength
		patternPosCurrent = patternPos
		patternChar = @pattern[patternPos]
		inputChar = input[inputPos]
		isLiteral = helpers.includes(@literals, patternPos)
		isOptional = helpers.includes(@optionals, patternPos)
		isRepeatable = helpers.includes(@repeatables, patternPos)

		switch
			when isLiteral
				output += patternChar
				outputStrict += patternChar

				if patternChar is inputChar
					inputPos++ unless helpers.includes(validPatternChars, patternChar) and not isBackwards
				else if changeDistance is 1 and input[inputPos+1] is patternChar
					inputPos += 2
				
				patternPos++


			when helpers.includes(validPatternChars, patternChar)
				isValid = inputChar and testChar(inputChar, patternChar)
				
				if not isValid
					unless changeDistance is 1 and testChar(input[inputPos+1], patternChar) and not isBackwards
						patternPos++
						unless isOptional
							output += @placeholder
							outputStrict += @placeholder
					
					inputPos++ unless isOptional
				
				else
					inputChar = inputChar.toUpperCase() if patternChar is 'A' or patternChar is '#'
					output += inputChar
					outputRaw += inputChar
					outputStrict += inputChar unless (isOptional or isRepeatable) and prevPatternPos is patternPos
					nextIsValid = input[inputPos+1] and testChar(input[inputPos+1], patternChar)

					inputPos++
					patternPos++ unless nextIsValid and isRepeatable

			else
				debugger

		prevPatternPos = patternPosCurrent

	
	@prev.value = @value
	@prev.valueRaw = @valueRaw
	@prev.valueStrict = @valueStrict
	
	@value = output
	@valueRaw = outputRaw
	@valueStrict = outputStrict
	@optionalsOffset = stringDistance(output, outputStrict)
	@valid = @validate(input, true)
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
	if cursorPos < @firstNonLiteral
		prevCursorPos = @firstNonLiteral + (prevCursorPos-cursorPos)
		cursorPos = @firstNonLiteral
	offset = 0
	value = @value.slice(0, cursorPos)
	valueStrict = @valueStrict.slice(0, cursorPos)
	changeIndex = helpers.getIndexOfFirstDiff(@value, @prev.value)
	isBackwards = prevCursorPos > cursorPos

	# console.log {cursorPos, prevCursorPos, changeIndex, isBackwards, newValue:@value, prevValue:@prev.value}
	charPos = 0
	while charPos < cursorPos
		offset++ if value[charPos+offset] isnt valueStrict[charPos] or helpers.includes(@repeatables, charPos)
		charPos++

	if isBackwards
		if cursorPos is @firstNonLiteral
			return cursorPos

		if helpers.includes(@literals, cursorPos-1) or @value[cursorPos-1] is @placeholder
			# changeAmount = if offset is 0 then 1 else 0
			# while helpers.includes(@literals, cursorPos-changeAmount)
			# 	changeAmount++
			# return cursorPos-changeAmount
			return cursorPos-(if offset is 0 then 1 else 0)
	else
		if changeIndex is null
			return Math.max(cursorPos-1, @firstNonLiteral)
		if helpers.includes(@repeatables, cursorPos-offset)
			return cursorPos+(if offset is 0 then 1 else 0)
		if helpers.includes(@literals, cursorPos)
			return (cursorPos+1)+offset
		if helpers.includes(@literals, changeIndex-1) and changeIndex is cursorPos
			return (cursorPos+1)+offset

	return cursorPos














testChar = (input, patternChar)-> switch patternChar
	when '1'		then regex.numeric.test(input)
	when 'a','A'	then regex.letter.test(input)
	when '*','#'	then regex.alphanumeric.test(input)
	else false




