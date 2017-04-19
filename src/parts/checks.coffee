IS.field = (target)-> target and target.constructor.name is 'Field'
IS.regex = (target)-> target instanceof RegExp
IS.objectable = (target)-> IS.object(target) or IS.function(target)