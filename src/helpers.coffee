IS = import '@danielkalen/is'
DOM = import 'quickdom'
SimplyBind = import '@danielkalen/simplybind'
regex = import './constants/regex'

helpers = exports
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


helpers.defaultColor = (color, defaultColor)->
	if color is 'transparent' or not color
		return defaultColor
	else
		return color


helpers.calcPadding = (desiredHeight, fontSize)->
	Math.ceil (desiredHeight - fontSize*1.231)/2


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


helpers.startsWith = (needle, haystack, caseSensitive)->
	unless caseSensitive
		needle = needle.toUpperCase()
		haystack = haystack.toUpperCase()

	if needle.length > haystack.length
		return false
	if needle.length is haystack.length
		return needle is haystack

	i = -1
	while needle[++i]
		return false if needle[i] isnt haystack[i]
	return true


helpers.getIndexOfFirstDiff = (sourceString, compareString)->
	currentPos = 0
	maxLength = Math.max(sourceString.length, compareString.length)
	
	while currentPos < maxLength
		return currentPos if sourceString[currentPos] isnt compareString[currentPos]
		currentPos++
	
	return null



helpers.parseCssShorthandValue = (string)->
	values = string.split(regex.whiteSpace).map(parseFloat)
	result = {}
	switch values.length
		when 1
			result.top = result.right = result.bottom = result.left = values[0]
		when 2
			result.top = result.bottom = values[0]
			result.right = result.left = values[1]
		when 3
			result.top = values[0]
			result.right = result.left = values[1]
			result.bottom = values[2]
		when 4
			result.top = values[0]
			result.right = values[1]
			result.bottom = values[2]
			result.left = values[3]

	return result


helpers.shorthandSideValue = (value, side)->
	switch typeof value
		when 'number' then value
		when 'string'
			values = helpers.parseCssShorthandValue(value)
			values[side]
		else 0



helpers.getKeyFromEvent = (event)-> switch
	when event.key
		event.key
	
	when event.which isnt 0 and IS.number(event.which)
		String.fromCharCode(event)

	else 0









