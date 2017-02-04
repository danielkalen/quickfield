validPatternChars = ['1','a','A','*','#']

Mask = (@pattern, @placeholder)->
	@minRequiredCount = 0
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
	@prev.value = @value
	@prev.valueRaw = @valueRaw
	@prev.valueStrict = @valueStrict
	changeDistance = stringDistance(@value, input)
	isBackwards = changeDistance and @value.length > input.length
	output = ''
	outputRaw = ''
	outputStrict = ''
	patternLength = @pattern.length
	patternPos = 0
	inputPos = 0
	return if not changeDistance

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

				# if patternChar is inputChar and inputPos+changeDistance is patternPos
				# if patternChar is inputChar and not helpers.includes(validPatternChars, patternChar)
				if patternChar is inputChar
					inputPos++ #if not helpers.includes(validPatternChars, patternChar) or isBackwards #and inputPos+diff isnt patternPos
				else if changeDistance is 1 and input[inputPos+1] is patternChar
					inputPos += 2
				
				patternPos++


			when helpers.includes(validPatternChars, patternChar)
				isValid = inputChar and testChar(inputChar, patternChar)
				
				if not isValid
					unless changeDistance is 1 and testChar(input[inputPos+1], patternChar) and not isBackwards
						output = outputStrict += @placeholder unless isOptional
						patternPos++
				
					inputPos++
				
				else
					inputChar = inputChar.toUpperCase() if patternChar is 'A' or patternChar is '#'
					output += inputChar
					outputRaw += inputChar
					outputStrict += inputChar unless (isOptional or isRepeatable) and prevPatternPos is patternPos
					nextIsValid = input[inputPos+1] and testChar(input[inputPos+1], patternChar)

					inputPos++
					patternPos++ unless nextIsValid and (isRepeatable or isOptional)

			else
				debugger
				patternPos++

		prevPatternPos = patternPosCurrent
	debugger if output is 'My Name is My Kalen'
	debugger if output is 'My Name is Kalen Kalen'
	@value = output
	@valueRaw = outputRaw
	@valueStrict = outputStrict
	@valid = @validate(input)
	return





Mask::validate = (input)->
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
				inputPos++ if patternChar is inputChar

			when helpers.includes(validPatternChars, patternChar)
				isValid = inputChar and testChar(inputChar, patternChar)
				
				if not isValid
					return false
				else
					nextIsValid = input[inputPos+1] and testChar(input[inputPos+1], patternChar)

					inputPos++
					patternPos++ unless nextIsValid and (isRepeatable or isOptional)

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




