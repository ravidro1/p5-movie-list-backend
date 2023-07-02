const { checkArrayNull } = require("../../globalFunctions");

class Condition {
  // start conditions //
  _conditionData = null;

  condition_equalString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(`${column}='${value}'`);

    return this;
  };

  condition_equalNotString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(`${column}=(${value})`);

    return this;
  };

  condition_findStringInJson = ({ column, keyOfJson = null, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(
      `'${value}' MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  condition_findNumberOrStatementInJson = ({
    column,
    keyOfJson = null,
    value,
  }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(
      `${value} MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  condition_findArrayOfStringInJson = ({ column, values, AND_OR = "AND" }) => {
    // if (column == null ||values == null || !Array.isArray(values))
    //   throw new Error("values cant be null, values must be array");

    if (column == null)
      throw new Error("values cant be null, values must be array");

    if (!values || (Array.isArray(values) && values.length == 0)) return this;

    values?.forEach((value, index) => {
      this.condition_findStringInJson({ column, value });
    });

    return this;
  };

  condition_isIncludesString = ({ column, value }) => {
    if (checkArrayNull([column, value])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(`${column} LIKE '%${value}%'`);

    return this;
  };

  condition_obj = (obj) => {
    if (!obj) throw new Error("obj cant be null");

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "string")
        this.condition_equalString({ column: key, value: obj[key] });
      else this.condition_equalNotString({ column: key, value: obj[key] });
    });

    return this;
  };

  condition_columnInArrayOfValues = (column, array, AND_OR) => {
    if (!array) throw new Error("array cant be null");

    let statement = `${column} IN (${array.toString()})`;
    if (array.length > 0) {
      if (!Array.isArray(this._conditionData)) this._conditionData = [];
      this._conditionData.push(statement);
    }

    return this;
  };
  // end conditions //
}

module.exports = Condition;
