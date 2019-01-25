import {Keyboard} from 'keysim'
keyboard = Keyboard.US_ENGLISH


export default (target, keys, value)->
	target.focus() if target.focus
	target.value += if value? then (value or '') else keys
	keyboard.dispatchEventsForInput(keys, target)




