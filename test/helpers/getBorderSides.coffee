export default (el)->
	top: el.style('borderTopWidth')
	bottom: el.style('borderBottomWidth')
	left: el.style('borderLeftWidth')
	right: el.style('borderRightWidth')