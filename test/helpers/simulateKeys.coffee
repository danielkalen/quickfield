Keysim = import 'keysim'
keyboard = Keysim.Keyboard.US_ENGLISH


module.exports = (target, keys, value)->
	target.focus() if target.focus
	target.value += if value? then (value or '') else keys
	keyboard.dispatchEventsForInput(keys, target)




