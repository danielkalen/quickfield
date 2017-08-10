IS.field = (target)-> target and target instanceof require('./field')
IS.regex = (target)-> target instanceof RegExp
IS.objectable = (target)-> IS.object(target) or IS.function(target)