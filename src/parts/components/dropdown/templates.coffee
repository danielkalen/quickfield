{
	container: DOM.template ['div', {
		style:
			position: 'absolute'
			top: (dropdown)-> if dropdown.field.type is 'text' then '-7px' else @parent.raw.style.height
			left: ()-> if @parent.rect.left - 10 < 0 then 0 else -10
			display: 'none'
			backgroundColor: helpers.hexToRGBA('f6f6f6', 0.9)
			boxShadow: "0px 6px 10px #{helpers.hexToRGBA('000000', 0.52)}"
			borderWidth: '1px'
			borderStyle: 'solid'
			borderColor: '#d1d1d1'
			borderRadius: '5px'
			boxSizing: 'border-box'
			padding: '3px 0'
			$isOpen:
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
			fontSize: '0'
			color: '#000000'
			userSelect: 'none'
			$selected:
				color: '#ffffff'
				backgroundColor: '#4C96FF'
			$hover:
				color: '#ffffff'
				backgroundColor: '#4C96FF'
	}
		DOM.template ['div', { # Checkmark
			style:
				display: 'inline-block'
				width: '20px'
				# height: ()-> @parent.raw.style.height
				lineHeight: ()-> @parent.raw.style.height
				fontSize: ()-> @parent.raw.style.height
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
			padding: '3px 12px 2px'
			color: 'rgba(0,0,0,0.75)'
			fontWeight: '500'
			fontSize: '12px'
			$showHelp:
				display: 'block'
	}]
}