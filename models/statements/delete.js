const { checkArrayNull } = require("../../globalFunctions");

class Delete {
  static #conditionData = null;
  static #tableNameData = null;
  static #limitData = null;

  // start conditions //

  static condition_equalString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(`${column}='${value}'`);

    return this;
  };

  static condition_equalNotString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(`${column}=(${value})`);

    return this;
  };

  static condition_findStringInJson = ({ column, keyOfJson = null, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(
      `'${value}' MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  static condition_findNumberOrStatementInJson = ({
    column,
    keyOfJson = null,
    value,
  }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(
      `${value} MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  static condition_findArrayOfNumberAndStringInJson = ({
    column,
    values,
    AND_OR = "AND",
  }) => {
    if (values == null || !Array.isArray(values))
      throw new Error("values cant be null, values must be array");

    values?.forEach((value, index) => {
      this.findStringInJson({ column, value });
    });

    return this;
  };

  static condition_isIncludesString = ({ column, value }) => {
    if (checkArrayNull([column, value])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(`${key} LIKE '%${value}%'`);

    return this;
  };

  static condition_obj = (obj) => {
    if (!obj) throw new Error("array cant be null");

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "string")
        this.condition_equalString({ column: key, value: obj[key] });
      else this.condition_equalNotString({ column: key, value: obj[key] });
    });

    return this;
  };
  // end conditions //

  static table = (table) => {
    this.#tableNameData = table;
    return this;
  };

  static limit = (limit) => {
    this.#limitData = limit;
    return this;
  };

  static endDelete = (isWithSemicolon = true) => {
    const tableName = this.#tableNameData;
    const limit = this.#limitData;
    let conditionStatement = null;

    this.#conditionData?.map((condition, index) => {
      if (index == 0) conditionStatement = "";
      if (index > 0 && conditionStatement) conditionStatement += " AND ";
      conditionStatement += condition;
    });

    this.#conditionData = null;
    this.#tableNameData = null;
    this.#limitData = null;

    return `DELETE FROM ${tableName} ${
      conditionStatement != null ? "WHERE " + conditionStatement : ""
    } ${limit != null ? "LIMIT " + limit : ""} ${isWithSemicolon ? ";" : ""}`;
  };
}

module.exports = { Delete };
