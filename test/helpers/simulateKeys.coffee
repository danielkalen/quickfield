Keysim = import 'keysim'
keyboard = Keysim.Keyboard.US_ENGLISH


module.exports = (target, keys, value)->
	target.value += if value? then (value or '') else keys
	keyboard.dispatchEventsForInput(keys, target)




