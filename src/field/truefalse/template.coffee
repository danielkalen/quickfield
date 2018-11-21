extend = import 'smart-extend'
import * as choiceFieldTemplates from '../choice/template'

extend.transform(
	(template)-> template.extend()
)(exports, choiceFieldTemplates)

export default exports.default
