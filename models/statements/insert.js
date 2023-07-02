const { checkArrayNull } = require("../../globalFunctions");

class Insert {
  static #tableNameData = null;
  static #keysArray = null;
  static #valuesArray = null;

  static table = (table) => {
    this.#tableNameData = table;
    return this;
  };

  static keysAndValueObj = (obj) => {
    if (checkArrayNull([obj]))
      throw new Error("There must be at least one cell in the array");

    Object.keys(obj).forEach((key) => {
      if (obj[key] == null) return;
      if (!Array.isArray(this.#keysArray)) this.#keysArray = [];
      this.#keysArray.push(key);
      if (!Array.isArray(this.#valuesArray)) this.#valuesArray = [];
      if (typeof obj[key] == "string") this.#valuesArray.push(`'${obj[key]}'`);
      else this.#valuesArray.push(obj[key]);
    });

    return this;
  };

  static endInsert = (isWithSemicolon = true, INSERT_OR_REPLACE = "INSERT") => {
    const tableName = this.#tableNameData;

    const keys = this.#keysArray;
    const values = this.#valuesArray;

    this.#tableNameData = null;
    this.#keysArray = null;
    this.#valuesArray = null;

    return `${INSERT_OR_REPLACE} INTO ${tableName} (${keys}) VALUES (${values}) ${
      isWithSemicolon ? ";" : ""
    }`;
  };
}

module.exports = { Insert };
