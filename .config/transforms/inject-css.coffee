module.exports = ()->
	name: 'inject-css'
	transform: (content, id)->
		return null if not id.endsWith('.css')

		return """
			(function(){
				var css = #{JSON.stringify(content)};
				var head = document.getElementsByTagName('head')[0];
				var sheet = document.createElement('style');
				
				sheet.setAttribute('data-file', '#{id}')
				sheet.innerHTML = css;
				head.appendChild(sheet)
			})()
		"""