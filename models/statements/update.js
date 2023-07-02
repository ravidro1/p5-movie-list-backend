const { checkArrayNull } = require("../../globalFunctions");
const Condition = require("./conditions");

class Update extends Condition {
  #updateFieldsData = null;
  #tableNameData = null;
  _conditionData = null;
  #limitData = null;

  constructor() {
    super();
  }

  //**************** start updateFields ***************************//

  update_equalString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(valueValue);

    if (!Array.isArray(this.#updateFieldsData)) this.#updateFieldsData = [];
    this.#updateFieldsData.push(
      `${column}=${value != null ? `'${value}'` : value}`
    );

    return this;
  };

  update_equalNotString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(valueValue);

    if (!Array.isArray(this.#updateFieldsData)) this.#updateFieldsData = [];
    this.#updateFieldsData.push(`${column}=(${value})`);

    return this;
  };

  // array = [{column, value, isStatement?}]
  //  update_Array = (array) => {
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

  update_obj = (obj) => {
    if (!obj) throw new Error("obj cant be null");

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "string")
        this.update_equalString({ column: key, value: obj[key] });
      else this.update_equalNotString({ column: key, value: obj[key] });
    });

    return this;
  };

  //**************** end updateFields ***************************//

  table = (table) => {
    this.#tableNameData = table;
    return this;
  };

  limit = (limit) => {
    this.#limitData = limit;
    return this;
  };

  endUpdate = (isWithSemicolon = true, withUpdateWord = true) => {
    const tableName = this.#tableNameData;
    const limit = this.#limitData;
    let updateFieldsStatement = null;
    let conditionStatement = null;

    this.#updateFieldsData?.map((update, index) => {
      if (index == 0) updateFieldsStatement = "";
      if (index > 0 && updateFieldsStatement) updateFieldsStatement += ", ";
      updateFieldsStatement += update;
    });

    this._conditionData?.map((condition, index) => {
      if (index == 0) conditionStatement = "";
      if (index > 0 && conditionStatement) conditionStatement += " AND ";
      conditionStatement += condition;
    });

    this.#updateFieldsData = null;
    this.#tableNameData = null;
    this._conditionData = null;
    this.#limitData = null;

    // console.log();
    return `${
      withUpdateWord ? `UPDATE ${tableName}` : ""
    } SET ${updateFieldsStatement} ${
      conditionStatement ? "WHERE " + conditionStatement : ""
    } ${limit != null ? "LIMIT " + limit : ""}  ${isWithSemicolon ? ";" : ""}`;
  };
}

const newUpdate = new Update()
module.exports = newUpdate;
