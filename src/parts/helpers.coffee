helpers = {}

helpers.includes = (target, item)->
	target and target.indexOf(item) isnt -1

helpers.removeItem = (target, item)->
	itemIndex = target.indexOf(item)
	target.splice(itemIndex, 1)  if itemIndex isnt -1

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







