import {Keyboard} from 'keysim'
keyboard = Keyboard.US_ENGLISH


export default (target, keys)->
	keyboard.dispatchEventsForAction(keys, target)




