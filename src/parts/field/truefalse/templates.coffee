extend = import 'smart-extend'
ChoiceField = import '../choice'

module.exports = extend.clone.transform((field)-> field.extend())(ChoiceField._templates)