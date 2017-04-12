IS.field = (target)-> target instanceof Field
IS.regex = (target)-> target instanceof RegExp
IS.objectable = (target)-> IS.object(target) or IS.function(target)