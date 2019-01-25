import'@danielkalen/is';import IS from'../checks.js';import SimplyBind from'@danielkalen/simplybind';var Condition;
Condition = class Condition {
  constructor(field1, settings, callback1) {
    var property, target;
    this.field = field1;
    this.settings = settings;
    this.callback = callback1;
    this.satisfied = false;
    this.value = this.settings.value;
    this.property = this.settings.property || '_value';

    if (this.settings.property === 'value') {
      this.property = '_value';
    }

    target = this.field.allFields[this.settings.target];

    if (target) {
      this.target = target;
    } else {
      return console.warn(`condition target not found for the provided ID '${this.settings.target}'`, this.field);
    }

    property = IS.array(this.target[this.property]) ? `array:${this.property}` : this.property;
    SimplyBind(property, {
      updateOnBind: false
    }).of(this.target).and('visible').of(this.target.state).to(this.callback);
    SimplyBind('satisfied', {
      updateOnBind: false
    }).of(this).to((newValue, oldValue) => {
      var base;

      if (oldValue != null) {
        return typeof (base = this.field).emit === "function" ? base.emit('conditionChange', this) : void 0;
      }
    });
  }

  test() {
    var comparison, comparisonOperators, passedComparisons, ref, targetValue;

    if (!((ref = this.target) != null ? ref.state.visible : void 0)) {
      return false;
    }

    comparison = function () {
      switch (false) {
        case !IS.objectPlain(this.value):
          return this.value;

        case !IS.regex(this.value):
          return {
            '$regex': this.value
          };

        case !(this.value === 'valid' && !this.settings.property || !IS.defined(this.value)):
          return 'valid';

        default:
          return {
            '$eq': this.value
          };
      }
    }.call(this);

    if (comparison === 'valid') {
      return this.target.validate();
    }

    targetValue = (() => {
      var nestedObject, propertyChain;

      if (this.property === '_value') {
        return this.target.value;
      }

      propertyChain = this.property.split('.');

      switch (false) {
        case propertyChain.length !== 1:
          return this.target[this.property];

        case !IS.defined(this.target[this.property]):
          return this.target[this.property];

        default:
          nestedObject = this.target;

          while (IS.object(nestedObject)) {
            nestedObject = nestedObject[propertyChain.pop()];
          }

          return nestedObject;
      }
    })();

    comparisonOperators = Object.keys(comparison);
    passedComparisons = comparisonOperators.filter(function (operator) {
      var seekedValue;
      seekedValue = comparison[operator];

      switch (operator) {
        case '$eq':
          return targetValue === seekedValue;

        case '$ne':
          return targetValue !== seekedValue;

        case '$gt':
          return targetValue > seekedValue;

        case '$gte':
          return targetValue >= seekedValue;

        case '$lt':
          return targetValue < seekedValue;

        case '$lte':
          return targetValue <= seekedValue;

        case '$ct':
          return helpers.includes(targetValue, seekedValue);

        case '$nct':
          return !helpers.includes(targetValue, seekedValue);

        case '$regex':
          return seekedValue.test(targetValue);

        case '$nregex':
          return !seekedValue.test(targetValue);

        case '$mask':
          return helpers.testMask(targetValue, seekedValue);

        default:
          return false;
      }
    });
    return passedComparisons.length === comparisonOperators.length;
  }

  static validate(conditions) {
    var validConditions;

    if (conditions) {
      validConditions = conditions.filter(function (condition) {
        return condition.satisfied = condition.test();
      });
      return validConditions.length === conditions.length;
    }
  }

  static init(field, conditions, callback) {
    return setTimeout(() => {
      if (callback == null) {
        callback = () => {
          return field.validateConditions();
        };
      }

      field.conditions = conditions.map(function (condition) {
        return new Condition(field, condition, callback);
      });
      return callback();
    });
  }

};
var Condition$1 = Condition;export default Condition$1;