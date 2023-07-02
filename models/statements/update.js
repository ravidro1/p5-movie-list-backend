const { checkArrayNull } = require("../../globalFunctions");

class Update {
  static #updateFieldsData = null;
  static #tableNameData = null;
  static #conditionData = null;
  static #limitData = null;

  //**************** start conditions ***************************//
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
    if (!obj) throw new Error("obj cant be null");

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "string")
        this.condition_equalString({ column: key, value: obj[key] });
      else this.condition_equalNotString({ column: key, value: obj[key] });
    });

    return this;
  };
  //**************** end conditions ***************************//

  //**************** start updateFields ***************************//

  static update_equalString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(valueValue);

    if (!Array.isArray(this.#updateFieldsData)) this.#updateFieldsData = [];
    this.#updateFieldsData.push(
      `${column}=${value != null ? `'${value}'` : value}`
    );

    return this;
  };

  static update_equalNotString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(valueValue);

    if (!Array.isArray(this.#updateFieldsData)) this.#updateFieldsData = [];
    this.#updateFieldsData.push(`${column}=(${value})`);

    return this;
  };

  // array = [{column, value, isStatement?}]
  // static update_Array = (array) => {
  //   if (!array) throw new Error("obj cant be null");

  //   array.forEach((obj) => {
  //     if (!obj?.column) return;
  //     if (typeof obj?.value == "string" && !obj?.isStatement)
  //       this.update_equalString({ column: obj?.column, value: obj?.value });
  //     else
  //       this.update_equalNotString({ column: obj?.column, value: obj?.value });
  //   });

  //   return this;
  // };

  static update_obj = (obj) => {
    if (!obj) throw new Error("obj cant be null");

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "string")
        this.update_equalString({ column: key, value: obj[key] });
      else this.update_equalNotString({ column: key, value: obj[key] });
    });

    return this;
  };

  //**************** end updateFields ***************************//

  static table = (table) => {
    this.#tableNameData = table;
    return this;
  };

  static limit = (limit) => {
    this.#limitData = limit;
    return this;
  };

  static endUpdate = (isWithSemicolon = true, withUpdateWord = true) => {
    const tableName = this.#tableNameData;
    const limit = this.#limitData;
    let updateFieldsStatement = null;
    let conditionStatement = null;

    this.#updateFieldsData?.map((update, index) => {
      if (index == 0) updateFieldsStatement = "";
      if (index > 0 && updateFieldsStatement) updateFieldsStatement += ", ";
      updateFieldsStatement += update;
    });

    this.#conditionData?.map((condition, index) => {
      if (index == 0) conditionStatement = "";
      if (index > 0 && conditionStatement) conditionStatement += " AND ";
      conditionStatement += condition;
    });

    this.#updateFieldsData = null;
    this.#tableNameData = null;
    this.#conditionData = null;
    this.#limitData = null;

    // console.log();
    return `${
      withUpdateWord ? `UPDATE ${tableName}` : ""
    } SET ${updateFieldsStatement} ${
      conditionStatement ? "WHERE " + conditionStatement : ""
    } ${limit != null ? "LIMIT " + limit : ""}  ${isWithSemicolon ? ";" : ""}`;
  };
}

module.exports = { Update };
