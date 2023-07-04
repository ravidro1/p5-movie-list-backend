const {
  checkArrayNotNull,
  parseIfString,
  convertCharsToSafeChars,
  checkArrayNotString,
} = require("../../globalFunctions");

class Condition {
  // start conditions //
  _conditionData = null;

  condition_equalString = ({ column, value }) => {
    if (checkArrayNotNull([column, value]))
      throw new Error("column,value cant be null");

    const [safeColumn, safeValue] = convertCharsToSafeChars([column, value]);

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(`${safeColumn}='${safeValue}'`);

    return this;
  };

  condition_equalStatement = ({ column, value }) => {
    if (checkArrayNotNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(`${column}=(${value})`);

    return this;
  };

  condition_equalNotString = ({ column, value }) => {
    const parseValue = parseIfString(value);

    if (checkArrayNotNull([column])) throw new Error("column cant be null");
    if (checkArrayNotString([parseValue]))
      throw new Error("value cant be String");

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(`${column}=(${parseValue})`);

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

  condition_findStringInJson = ({ column, keyOfJson = null, value }) => {
    if (checkArrayNotNull([column])) throw new Error("column cant be null");

    const [safeColumn, safeValue, safeKeyOfJson] = convertCharsToSafeChars([
      column,
      value,
      keyOfJson,
    ]);

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(
      `'${safeValue}' MEMBER OF(${safeColumn}->> ${
        safeKeyOfJson ? `'$.${safeKeyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  condition_findNotStringInJson = ({ column, keyOfJson = null, value }) => {
    const parseValue = parseIfString(value);

    if (checkArrayNotNull([column])) throw new Error("column cant be null");
    if (checkArrayNotString(parseValue)) throw new Error("column cant be null");

    const [safeColumn, safeValue, safeKeyOfJson] = convertCharsToSafeChars([
      column,
      value,
      keyOfJson,
    ]);

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(
      `(${safeValue}) MEMBER OF(${safeColumn}->> ${
        safeKeyOfJson ? `'$.${safeKeyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  condition_findStatementInJson = ({ column, keyOfJson = null, value }) => {
    if (checkArrayNotNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(
      `(${value}) MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  condition_findArrayOfStringInJson = ({ column, values, AND_OR = "AND" }) => {
    if (column == null)
      throw new Error("values cant be null, values must be array");

    if (!values || (Array.isArray(values) && values.length == 0)) return this;

    values?.forEach((value, index) => {
      this.condition_findStringInJson({ column, value });
    });

    return this;
  };

  condition_isIncludesString = ({ column, value }) => {
    if (checkArrayNotNull([column, value]))
      throw new Error("column cant be null");

    const [safeColumn, safeValue] = convertCharsToSafeChars([column, value]);

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(`${safeColumn} LIKE '%${safeValue}%'`);

    return this;
  };

  condition_columnInArrayOfValues = ({ column, array }) => {
    if (!Array.isArray(array)) throw new Error("array cant be null");

    const safeArray = convertCharsToSafeChars(array);

    let statement = `${column} IN (${safeArray.toString()})`;
    if (array.length > 0) {
      if (!Array.isArray(this._conditionData)) this._conditionData = [];
      this._conditionData.push(statement);
    }

    return this;
  };
  // end conditions //
}

module.exports = Condition;
