pkg = require '../package'
# pkg.main = pkg.main.replace 'dist', 'build'
# pkg.module = pkg.module.replace 'dist', 'build'
# pkg.unpkg = pkg.unpkg.replace 'dist', 'build'


onwarn = (warning, warn)->
	return if warning.code is 'MISSING_GLOBAL_NAME'
	return if warning.code is 'THIS_IS_UNDEFINED'
	warn(warning)


config = ({input, output, external=[], minify, multiInput})->
	input: input
	output: [].concat(output).map (config)-> Object.assign {name:pkg.name, compact:true}, config
	external: [].concat Object.keys(pkg.dependencies or {})
	onwarn: onwarn
	plugins: [
		require('rollup-plugin-multi-input').default() if multiInput
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
# 	config
# 		input: 'src/index.coffee'
# 		output: [
# 			{file:pkg.main, format:'umd'}
# 			{file:pkg.module, format:'esm'}
# 			{file:pkg.module.replace('esm', 'debug'), format:'umd', sourcemap:'inline'}
# 		]
# ,
# 	config
# 		input: 'src/index.coffee'
# 		minify: true
# 		output: [
# 			{file:pkg.unpkg, format:'umd'}
# 		]
# ,
# 	config
# 		input: 'src/+(fields|field)/**/*.coffee'
# 		multiInput: true
# 		external: ['src/field/index.coffee']
# 		output: [
# 			{dir:'build', format:'esm'}
# 		]
# ,
	config
		input: 'src/**/*.coffee'
		multiInput: true
		output: [
			{dir:'build', format:'esm'}
		]
]
