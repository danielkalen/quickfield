import IS_ from'@danielkalen/is';var IS;

IS = IS_.create('natives', 'dom');
IS.load({
  // field: (target)-> target and target instanceof Field
  regex: function (target) {
    return target instanceof RegExp;
  },
  objectable: function (target) {
    return IS.object(target) || IS.function(target);
  }
});
var IS$1 = IS;export default IS$1;