global.Promise = require('bluebird').config longStackTraces:process.env.PROMISE_DEBUG?
extend = require 'smart-extend'
packageInstall = require 'package-install'
fs = require 'fs-jetpack'
chalk = require 'chalk'
Path = require 'path'
process.env.SOURCE_MAPS ?= 1
buildModules = []
coverageModules = ['istanbul', 'badge-gen', 'coffee-coverage']
testModules = [
	'jquery', 'chance', 'mocha', 'p-event'
	'chai', 'chai-almost', 'chai-dom', 'chai-events', 'chai-style', 'chai-asserttype'
	'electron', 'karma@1.6.0', 'karma-mocha', 'karma-chrome-launcher', 'karma-coverage', 'karma-electron',
	'karma-firefox-launcher', 'karma-ie-launcher', 'karma-opera-launcher', 'karma-safari-launcher',
	'github:danielkalen/karma-sauce-launcher'
]
MEASURE_LOG = './.config/measure.json'
PACKAGE = './package.json'

option '-d', '--debug', 'run in debug mode'
option '-D', '--dry', 'run in dry mode'
option '-t', '--target [target]', 'target measure dir'


task 'build', ()->
	Promise.resolve()
		.then ()-> invoke 'install:build'
		.then ()-> invoke 'build:js'
		.then ()-> invoke 'build:test'


task 'build:js', (options)->
	console.log 'bundling lib'
	compileJS(require './.config/rollup.lib')

task 'build:test', (options)->
	console.log 'bundling test'
	await invoke 'install:test'
	compileJS(require './.config/rollup.test')



task 'watch', ()->
	Promise.resolve()
		.then ()-> invoke 'install:build'
		.then ()->
			invoke 'watch:js'
			invoke 'watch:test'



task 'watch:js', (options)->
	require('rollup').watch(require './.config/rollup.lib')
		.on 'event', handleWatchEvents

task 'watch:test', (options)->
	require('rollup').watch(require './.config/rollup.test')
		.on 'event', handleWatchEvents



task 'install', ()->
	Promise.resolve()
		.then ()-> invoke 'install:test'
		.then ()-> invoke 'install:coverage'
		.then ()-> invoke 'install:bench'

task 'install:build', ()-> packageInstall buildModules
task 'install:watch', ()-> packageInstall ['listr']
task 'install:test', ()-> packageInstall testModules
task 'install:coverage', ()-> packageInstall coverageModules
task 'install:measure', ()-> packageInstall ['gzipped', 'sugar']




task 'measure', (options)->
	Promise.resolve()
		.then ()-> fs.writeAsync(MEASURE_LOG, {}) if not fs.exists(MEASURE_LOG)
		.then ()-> invoke 'install:measure'
		.then ()->
			DIR = if options.target then options.target else 'build'
			measure {debug:"./#{DIR}/quickfield.js", release:"./#{DIR}/quickfield.min.js"}, options













handleWatchEvents = ({code})-> switch code
	when 'ERROR','FATAL' then console.error(arguments[0])



compileJS = (configs)->
	rollup = require 'rollup'

	for config,i in configs
		console.log "bundling config ##{i+1} (#{config.input})"
		bundle = await rollup.rollup(config)

		for dest in config.output
			await bundle.write(dest)



runTaskList = (tasks)->
	(new (require 'listr')(tasks, concurrent:true)).run()


measure = (file, options)->
	gzipped = Promise.promisifyAll require('gzipped')
	bytes = require 'sugar/number/bytes'
	isEqual = require 'sugar/object/isEqual'
	results = debug:null, release:null
	
	Promise.resolve()
		.then ()-> gzipped.calculateAsync fs.createReadStream(file.debug)
		.then (result)-> results.debug = 'orig':bytes(result.original,2), 'gzip':bytes(result.compressed,2)
		
		.then ()-> gzipped.calculateAsync fs.createReadStream(file.release)
		.then (result)-> results.release = 'orig':bytes(result.original,2), 'gzip':bytes(result.compressed,2)
		
		.then ()-> Promise.all [fs.readAsync(MEASURE_LOG,'json'), fs.readAsync(PACKAGE,'json').get('version')]
		.then ([log, version])->
			log[version] ?= []
			lastResult = log[version].slice(-1)[0]
			return log if lastResult and isEqual(lastResult, results)
			log[version].push(results)
			return log
		
		.then (updatedLog)-> fs.writeAsync MEASURE_LOG, updatedLog unless options.dry
		.then ()->
			console.log "#{chalk.dim 'DEBUG  '} #{chalk.green results.debug.gzip} (#{chalk.yellow results.debug.orig})"
			console.log "#{chalk.dim 'RELEASE'} #{chalk.green results.release.gzip} (#{chalk.yellow results.release.orig})"
			console.log '\n'



