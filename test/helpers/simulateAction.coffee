Keysim = import 'keysim'
keyboard = Keysim.Keyboard.US_ENGLISH


module.exports = (target, keys)->
	keyboard.dispatchEventsForAction(keys, target)




