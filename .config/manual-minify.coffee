fs = require 'fs'
replacements = [
	# [/iterable/g, 'iT']
	# [/domEl/g, 'dE']
	# [/domText/g, 'dT']
	# [/domNode/g, 'dN']
	# [/quickDomEl/g, 'qE']
	# [/defined:/g, 'De:']
	# [/\.defined/g, '.De']
	# [/array:/g, 'Ar:']
	# [/\.array/g, '.Ar']
	# [/object:/g, 'Ob:']
	# [/\.object/g, '.Ob']
	# [/string:/g, 'St:']
	# [/\.string/g, '.St']
	# [/number:/g, 'Nu:']
	# [/\.number/g, '.Nu']
	
	# [/includes/g, 'In']
	# [/removeItem/g, 'R']
	# [/normalizeGivenEl/g, 'N']
	# [/_parsed/g, '_']
	# [/_parent/g, '_p']
	# [/_state/g, '_s']
	# [/_children/g, '_c']
	# [/_eventCallbacks/g, '_e']
	# [/_normalizeOptions/g, '_n']
	# [/_normalizeStyle/g, '_ns']
	# [/_applyOptions/g, '_a']
	# [/_attachStateEvents/g, '_ae']
	# [/_listenTo/g, '_l']
	# [/_removeChild/g, '_r']
]


fs.readFile 'dist/quickfield.js', {encoding:'utf8'}, (err, fileContent)-> if err then throw err else
	output = fileContent
	
	replacements.forEach (replacement)->
		source = replacement[0]
		dest = replacement[1]

		output = output.replace(source, dest)

	fs.writeFile 'dist/quickfield.js', output, (err)-> if err then throw err
