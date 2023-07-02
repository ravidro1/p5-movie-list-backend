const { checkArrayNull } = require("../../globalFunctions");

class Trigger {
  static #triggerNameData = null;
  static #eventData = null;
  static #triggerTableData = null;
  static #actionData = null;
  static #conditionData = null;

  //**************** start conditions ***************************//
  // static condition_equalString = ({ column, value }) => {
  //   if (checkArrayNull([column])) throw new Error("column cant be null");

  //   if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
  //   this.#conditionData.push(`${column}='${value}'`);

  //   return this;
  // };

  // static condition_equalNotString = ({ column, value }) => {
  //   if (checkArrayNull([column])) throw new Error("column cant be null");

  //   if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
  //   this.#conditionData.push(`${column}=(${value})`);

  //   return this;
  // };

  // static condition_findStringInJson = ({ column, keyOfJson = null, value }) => {
  //   if (checkArrayNull([column])) throw new Error("column cant be null");

  //   // StringInvalidCharsError(value);

  //   if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
  //   this.#conditionData.push(
  //     `'${value}' MEMBER OF(${column}->> ${
  //       keyOfJson ? `'$.${keyOfJson}'` : `'$'`
  //     })`
  //   );

  //   return this;
  // };

  // static condition_findNumberOrStatementInJson = ({
  //   column,
  //   keyOfJson = null,
  //   value,
  // }) => {
  //   if (checkArrayNull([column])) throw new Error("column cant be null");

  //   // StringInvalidCharsError(value);

  //   if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
  //   this.#conditionData.push(
  //     `${value} MEMBER OF(${column}->> ${
  //       keyOfJson ? `'$.${keyOfJson}'` : `'$'`
  //     })`
  //   );

  //   return this;
  // };

  // static condition_findArrayOfNumberAndStringInJson = ({
  //   column,
  //   values,
  //   AND_OR = "AND",
  // }) => {
  //   if (values == null || !Array.isArray(values))
  //     throw new Error("values cant be null, values must be array");

  //   values?.forEach((value, index) => {
  //     this.findStringInJson({ column, value });
  //   });

  //   return this;
  // };

  // static condition_isIncludesString = ({ column, value }) => {
  //   if (checkArrayNull([column, value])) throw new Error("column cant be null");

  //   // StringInvalidCharsError(value);

  //   if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
  //   this.#conditionData.push(`${key} LIKE '%${value}%'`);

  //   return this;
  // };
  //**************** end conditions ***************************//

  static triggerName = (triggerName) => {
    this.#triggerNameData = triggerName;
    return this;
  };

  static triggerEvent = (event) => {
    this.#eventData = event;
    return this;
  };

  static table = (triggerTable) => {
    this.#triggerTableData = triggerTable;
    return this;
  };

  static triggerAction = (action) => {
    this.#actionData = action;
    return this;
  };

  static returnTrigger = () => {
    return this;
  };

  static triggerEnd = () => {
    const triggerName = this.#triggerNameData;
    const event = this.#eventData;
    const triggerTable = this.#triggerTableData;
    const action = this.#actionData;

    if (checkArrayNull([triggerName, event, triggerTable, action])) return null;

    this.#triggerNameData = null;
    this.#eventData = null;
    this.#triggerTableData = null;
    this.#actionData = null;
    return `CREATE TRIGGER IF NOT EXISTS ${triggerName}
        ${event}
        ON ${triggerTable}
        FOR EACH ROW
        ${action}`;
  };
}

module.exports = {Trigger};
