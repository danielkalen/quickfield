import'@danielkalen/is';import IS from'../checks.js';var transformSettings = {
  conditions: function (conditions) {
    var results, target, value;

    if (IS.objectPlain(conditions)) {
      results = [];

      for (target in conditions) {
        value = conditions[target];
        results.push({
          target,
          value
        });
      }

      return results;
    } else if (IS.array(conditions)) {
      return conditions.map(function (item) {
        if (IS.string(item)) {
          return {
            target: item
          };
        } else {
          return item;
        }
      });
    }
  },
  choices: function (choices) {
    var label, results, value;

    if (IS.objectPlain(choices)) {
      results = [];

      for (label in choices) {
        value = choices[label];
        results.push({
          label,
          value
        });
      }

      return results;
    } else if (IS.array(choices)) {
      return choices.map(function (item) {
        if (!IS.objectPlain(item)) {
          return {
            label: item,
            value: item
          };
        } else {
          return item;
        }
      });
    }
  },
  validWhenRegex: function (regex) {
    if (IS.string(regex)) {
      return new RegExp(regex);
    } else {
      return regex;
    }
  }
};export default transformSettings;