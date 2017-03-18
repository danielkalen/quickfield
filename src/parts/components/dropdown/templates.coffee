{
	container: DOM.template ['div', {
		style:
			position: 'absolute'
			zIndex: 10
			top: (dropdown)-> if dropdown.field.type is 'text' then @parent.raw.style.height else '-7px'
			left: ()-> if @parent.rect.left - 5 < 0 then 0 else -5
			display: 'none'
			# backgroundColor: helpers.hexToRGBA('f6f6f6', 0.9)
			backgroundColor: '#f6f6f6'
			boxShadow: "0px 6px 10px #{helpers.hexToRGBA('000000', 0.32)}"
			borderWidth: '1px'
			borderStyle: 'solid'
			borderColor: '#d1d1d1'
			borderRadius: '5px'
			boxSizing: 'border-box'
			padding: '4px 0'
			$isOpen: $hasVisibleOptions:
				display: 'block'
	}]
	
	list: DOM.template ['div', {
		passStateToChildren: false
		style:
			overflow: 'scroll'
			overflowScrolling: 'touch'
	}]
	
	option: DOM.template ['div', {
		style:
			display: 'none'
			fontSize: '0'
			color: '#000000'
			userSelect: 'none'
			cursor: 'pointer'
			$visible:
				display: 'block'
			$hover:
				color: '#ffffff'
				backgroundColor: '#4C96FF'
	}
		DOM.template ['div', { # Checkmark
			style:
				display: 'inline-block'
				verticalAlign:'top'
				width: '20px'
				# height: ()-> @parent.raw.style.height
				# lineHeight: ()-> @parent.style('height')
				# fontSize: ()-> @parent.style('height')
				lineHeight: '20px'
				fontSize: '13px'
				textAlign: 'center'
				color: 'inherit'
				stroke: 'currentColor'
				visibility: 'hidden'
				$selected:
					visibility: 'visible'
		}, SVG.checkmark]
		
		DOM.template ['div', { # Text
			style:
				display: 'inline-block'
				overflow: 'hidden'
				textOverflow: 'ellipsis'
				whiteSpace: 'nowrap'
				wordWrap: 'normal'
				maxWidth: ()-> "calc(100% - #{@prev.raw.style.width})"
				paddingRight: '10px'
				lineHeight: '20px'
				fontSize: '11px'
				fontFamily: 'system-ui'
				color: 'inherit'
				boxSizing: 'border-box'
		}]
	]
	
	help: DOM.template ['div', {
		style:
			display: 'none'
			borderTop: '2px solid rgba(0,0,0,0.05)'
			padding: '4px 12px 1px'
			color: 'rgba(0,0,0,0.5)'
			fontWeight: '500'
			fontSize: '11px'
			userSelect: 'none'
			$showHelp:
				display: 'block'
	}]
}