pkg = require '../package'

config = ({input, output, minify})->
	input: input
	output: [].concat(output).map (config)-> Object.assign {name:pkg.name, compact:true}, config
	plugins: [
		require('rollup-plugin-import-alias')(Paths:
			'@danielkalen/simplybind': './node_modules/@danielkalen/simplybind/dist/simplybind'
		)
		require('rollup-plugin-coffee-script')()
		require('rollup-plugin-node-resolve')(
			extensions: ['.js', '.coffee']
			jsnext: true
			preferBuiltins: true
			browser: true
		)
		require('rollup-plugin-commonjs')(extensions: ['.js', '.coffee'])
		require('rollup-plugin-json')()
		require('rollup-plugin-babel')(extensions: ['.js', '.coffee'])
		require('rollup-plugin-terser').terser() if minify
	]


module.exports = [
	config
		input: 'test/test.coffee'
		output: [
			{file:'test/test.js', format:'umd', sourcemap:'inline'}
		]
]
