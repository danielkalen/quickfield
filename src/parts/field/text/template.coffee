{
	field: ['div', {
		passStateToChildren:false
		style:
			position: 'relative'
			display: 'none'
			backgroundColor: 'white'
			borderWidth: '1px'
			borderStyle: 'solid'
			borderColor: '#d3d3d3'
			borderRadius: '2px'
			boxSizing: 'border-box'
			width: (field)-> field.options.width
			height: '46px'
			transition: 'border-color 0.2s'
			$focus:
				borderColor: (field)-> field.options.color
	}]

	label: ['div', {
		style:
			position: 'absolute'
			top: '12px'
			left: '12px'
	}]
}