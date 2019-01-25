import SimplyBind from '@danielkalen/simplybind'
import maskCore from 'text-mask-core'
import maskAddons from 'text-mask-addons'
import extend from 'smart-extend'
import IS from '../checks'
import REGEX from '../constants/regex'
import {repeat} from '../helpers'
defaultPatternChars = 
	'1': REGEX.numeric
	'#': REGEX.widenumeric
	'a': REGEX.letter
	'*': REGEX.any


class Mask
	constructor: (@field, @config)->
		@value = ''
		@prevValue = ''
		@cursor = 0
		@prevCursor = 0
		@pattern = @patternRaw = @config.pattern
		@patternSetter = @config.setter
		@placeholderChar = @config.placeholder
		@placeholderRegex = new RegExp('\\'+(@placeholderChar or '_'),'g')
		@guide = @config.guide
		@keepCharPositions = @config.keepCharPositions
		@chars = extend.clone defaultPatternChars, @config.customPatterns

		@setPattern(@pattern)


	getState: (pattern, rawValue)-> {
		rawValue, @guide, @placeholderChar, @keepCharPositions,
		currentCaretPosition: if @field.el then @field.selection().end else @cursor
		previousConformedValue: @prevValue
		placeholder: @getPlaceholder(pattern)
	}

	getPlaceholder: (pattern)->
		if IS.function(pattern)
			return
		else
			placeholder = ''
			for char in pattern
				if IS.regex(char)
					placeholder += @placeholderChar
				else
					placeholder += char

			return placeholder


	resolvePattern: (pattern, input, state)->
		pattern = 
			if typeof pattern is 'function'
				pattern(input, @getState(pattern, input))
			else
				pattern

		offset = 0
		trapIndexes = []
		copy = pattern.slice()
		for char,i in copy when char is '[]'
			trapIndexes.push(i-offset)
			pattern.splice(i-offset,1)
			offset++

		@prevPattern = @resolvedPattern
		@resolvedPattern = pattern
		return {pattern, caretTrapIndexes:trapIndexes}


	setPattern: (string, updateValue=true, updateField)->
		@patternRaw = string
		@pattern = @parsePattern(string)
		@transform = @parseTransform(string)

		if updateValue
			@value = @setValue(@value)
			@field.value = @value if updateField


	parsePattern: (string)-> switch
		when string is 'EMAIL'
			maskAddons.emailMask.mask

		when string is 'PHONE'
			@patternSetter = (value)-> repeat('#', Math.max 7,value.length)
			@guide = false
			return '#'

		when string is 'NAME'
			@patternSetter = (value)->
				value = value.replace(@placeholderRegex, '').trim()
				repeat('a', Math.max 2,value.length)

			return 'a'

		when string is 'FULLNAME'
			@patternSetter = (value)->
				if value[value.length-1] is ' ' then value += 'x'
				split = value.replace(@placeholderRegex,'').trim().split(/\s+/)
				return if split.length is 4
				split.map((part)-> repeat('a', Math.max 2,part.length)).join(' ')
			return 'a'

		when string is 'DATE'
			[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
		
		when string[0] is 'DATE' and IS.string(string[1])
			string[1].split('').map((char)=> if REGEX.letter.test(char) then /\d/ else char)
		
		when string is 'NUMBER'
			maskAddons.createNumberMask
				prefix: @config.prefix or ''
				suffix: @config.suffix or ''
				includeThousandsSeparator: if @config.sep then true else false
				thousandsSeparatorSymbol: if IS.string(@config.sep) then @config.sep
				allowDecimal: @config.decimal
				decimalLimit: if IS.number(@config.decimal) then @config.decimal
				integerLimit: if IS.number(@config.limit) then @config.limit

		when IS.array(string)
			return string

		else
			pattern = []

			for char,i in string
				if char is '\\'
					escaped = true
					continue
				
				pattern.push if escaped then char else (@chars[char] or char)
				escaped = false

			return pattern


	parseTransform: (string)-> switch
		when string is 'EMAIL'
			maskAddons.emailMask.pipe
		
		when string is 'DATE'
			maskAddons.createAutoCorrectedDatePipe('mm/dd/yyyy')
		
		when string[0] is 'DATE' and IS.string(string[1])
			maskAddons.createAutoCorrectedDatePipe(string[1])

		when @config.transform
			@config.transform



	setValue: (input)->
		if @patternSetter
			newPattern = @patternSetter(input) or @pattern
			@setPattern(newPattern, false) if newPattern isnt @patternRaw and newPattern isnt @pattern
		
		{caretTrapIndexes, pattern} = @resolvePattern(@pattern, input)
		return @value if pattern is false

		@prevValue = @value
		@prevCursor = @cursor
		state = @getState(pattern, input)
		{conformedValue} = maskCore.conformToMask(input, pattern, state)

		transformed = @transform(conformedValue, state) if @transform
		if transformed is false
			return @value
		if IS.string(transformed)
			conformedValue = transformed
		else if IS.object(transformed)
			indexesOfPipedChars = transformed.indexesOfPipedChars
			conformedValue = transformed.value


		@cursor = maskCore.adjustCaretPosition extend state, {
			indexesOfPipedChars, caretTrapIndexes, conformedValue
		}

		return @value = conformedValue


	validate: (input)->
		if input isnt @value and @patternSetter
			pattern = @patternSetter(input) or @pattern
		else
			pattern = @resolvedPattern
			{pattern} = @resolvePattern(@pattern, input) if not pattern

		return true if pattern is false
		
		for char,i in pattern
			switch
				when not input[i]
					return false
				when IS.regex(char) and not char.test(input[i])
					return false
				when IS.string(char) and input[i] isnt char
					return false

		return true

	isEmpty: ()->
		input = @value
		pattern = @resolvedPattern
		if not pattern
			pattern = @patternSetter(input) if @patternSetter
			{pattern} = @resolvePattern(pattern or @pattern, input)
		
		return true if input is @config.prefix or input is @config.suffix

		for char,i in pattern
			switch
				when not input[i]
					return true
				when IS.regex(char)
					return !char.test(input[i])
		return false







export default Mask