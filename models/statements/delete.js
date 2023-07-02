const Condition = require("./conditions");

class Delete extends Condition {
  _conditionData = null;
  #tableNameData = null;
  #limitData = null;

  constructor() {
    super();
  }

  table = (table) => {
    this.#tableNameData = table;
    return this;
  };

  limit = (limit) => {
    this.#limitData = limit;
    return this;
  };

  endDelete = (isWithSemicolon = true) => {
    const tableName = this.#tableNameData;
    const limit = this.#limitData;
    let conditionStatement = null;

    this._conditionData?.map((condition, index) => {
      if (index == 0) conditionStatement = "";
      if (index > 0 && conditionStatement) conditionStatement += " AND ";
      conditionStatement += condition;
    });

    this._conditionData = null;
    this.#tableNameData = null;
    this.#limitData = null;

    return `DELETE FROM ${tableName} ${
      conditionStatement != null ? "WHERE " + conditionStatement : ""
    } ${limit != null ? "LIMIT " + limit : ""} ${isWithSemicolon ? ";" : ""}`;
  };
}

const newDelete = new Delete();
module.exports = newDelete;
