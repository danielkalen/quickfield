'conditions': (conditions)->
	if IS.objectPlain(conditions)
		{target, value} for target,value of conditions
	else if IS.array(conditions)
		conditions.map (item)-> if IS.string(item) then {target:item} else item

'choices': (choices)->
	if IS.objectPlain(choices)
		{label,value} for label,value of choices
	else if IS.array(choices)
		choices.map (item)-> if not IS.objectPlain(item) then {label:item, value:item} else item

'validWhenRegex': (regex)->
	if IS.string(regex) then new RegExp(regex) else regex