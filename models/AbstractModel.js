const database = require("../database");

module.exports = class AbstractModel {
  // constructor() {}

  // #d = "234";

  static _dataType = {
    char: (size) => `CHAR(${size})`,
    string: (size) => `VARCHAR(${size})`,
    int: "INT",
    float: "FLOAT",
    date_create: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    date_update:
      "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
  };

  static _statementTypes = {
    select: ({
      tableName,
      arrayOfFields = null,
      conditions = null,
      limit = null,
      nullable = true,
    }) => {
      let conditionStatement = generateConditions(conditions);

      let formatFields = arrayOfFields?.map((field) =>
        nullable ? field : `coalesce(${field},0)`
      );
      formatFields = arrayOfFields?.length > 0 ? formatFields : "*";

      return `SELECT ${formatFields} FROM ${tableName}  ${
        conditions != null ? "WHERE " + conditionStatement : ""
      } ${limit != null ? "LIMIT " + limit : ""};`;
    },

    update: ({
      tableName,
      fieldForUpdate,
      conditions = null,
      limit = null,
    }) => {
      let updateStatement = "";
      let conditionStatement = generateConditions(conditions);

      Object.keys(fieldForUpdate).forEach((key, index) => {
        if (index > 0) {
          updateStatement += ", ";
        }

        updateStatement += `${key}=('${fieldForUpdate[key]}')`;
      });

      // .includes(".")

      return `UPDATE ${tableName} SET ${updateStatement} ${
        conditions != null ? "WHERE " + conditionStatement : ""
      } ${limit != null ? "LIMIT " + limit : ""};`;
    },

    delete: ({ tableName, conditions = null, limit = null }) => {
      let conditionStatement = generateConditions(conditions);

      return `DELETE FROM ${tableName} ${
        conditions != null ? "WHERE " + conditionStatement : ""
      } ${limit != null ? "LIMIT " + limit : ""};`;
    },

    trigger: ({ triggerName, event, triggerTable, action }) => {
      return `CREATE TRIGGER IF NOT EXISTS ${triggerName}
      ${event}
      ON ${triggerTable}
      FOR EACH ROW
      ${action}`;
    },
  };

  static fields = {
    createAt: {
      name: "createAt",
      type: this._dataType.date_create,
    },
    updateAt: {
      name: "updateAt",
      type: this._dataType.date_update,
    },
  };

  static log() {
    console.log(this);
  }

  static async registerTable() {
    let rules = generateRules(this.rules);
    let fields = "";

    Object.keys(this.fields).forEach((key, index) => {
      if (this.fields[key].name == null || this.fields[key].type == null)
        return;
      fields += "," + generateField(this.fields[key]);
    });

    let statement = `CREATE TABLE IF NOT EXISTS ${this.name} (
        id INT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (id)
        ${fields}${rules}
        );`;

    statement = statement.replaceAll("\n", "");

    // console.log(statement);
    await database.execute(statement);

    this.triggers?.forEach(async (trigger, index) => {
      if (
        trigger.triggerName == null ||
        trigger.event == null ||
        trigger.triggerTable == null ||
        trigger.action == null
      )
        return;

      let currentTriggerStatement = this._statementTypes.trigger({
        triggerName: trigger.triggerName,
        event: trigger.event,
        triggerTable: trigger.triggerTable,
        action: trigger.action,
      });
      currentTriggerStatement = currentTriggerStatement.replaceAll("\n", "");
      console.log(currentTriggerStatement);
      await database.query(currentTriggerStatement);
    });
    // const res = await database.execute(`select * from OneRaTe`);
    // console.log(res);
  }

  static async create(values) {
    const statement = `INSERT INTO ${this.name} (${Object.keys(values)})
    VALUES (${Object.keys(values).map((key) => {
      return `${values[key] == null ? null : `'${values[key]}'`}`;
    })});`;

    console.log(statement);
    return await database.execute(statement);
  }

  static async findAvg(column, conditionObj) {
    const statement = this._statementTypes
      .select({
        tableName: this.name,
        arrayOfFields: [`avg(${column})`],
        conditions: conditionObj,
      })
      .replaceAll(";", "");

    const data = await database.execute(statement);
    return data[0];
  }

  static async findAll() {
    const statement = this._statementTypes.select({ tableName: this.name });
    console.log(statement);
    const data = await database.execute(statement);
    return data[0];
  }

  static async findById(id) {
    // id = replaceAllNotLetterOrNumber(id);
    const statement = this._statementTypes.select({
      tableName: this.name,
      conditions: { id },
    });
    return (await database.execute(statement))[0][0];
  }

  static async find(conditionObj) {
    // conditionObj = replaceAllNotLetterOrNumber(conditionObj);
    const statement = this._statementTypes.select({
      tableName: this.name,
      conditions: conditionObj,
    });
    return (await database.execute(statement))[0];
  }

  static async findOne(conditionObj) {
    const statement = this._statementTypes.select({
      tableName: this.name,
      conditions: conditionObj,
      limit: 1,
    });

    return (await database.execute(statement))[0][0];
  }

  static async update(conditionObj, updateFields) {
    const statement = this._statementTypes.update({
      tableName: this.name,
      fieldForUpdate: updateFields,
      conditions: conditionObj,
    });
    console.log(statement);
    await database.execute(statement);
  }

  static async updateOne(conditionObj, updateFields) {
    const statement = this._statementTypes.update({
      tableName: this.name,
      fieldForUpdate: updateFields,
      conditions: conditionObj,
      limit: 1,
    });
    console.log(statement);
    await database.execute(statement);
  }

  static async updateById(id, updateFields) {
    // id = replaceAllNotLetterOrNumber(id);
    // updateFields = replaceAllNotLetterOrNumber(updateFields);

    const statement = this._statementTypes.update({
      tableName: this.name,
      fieldForUpdate: updateFields,
      conditions: { id },
      limit: 1,
    });
    console.log(statement);
    await database.execute(statement);
  }

  static async delete(conditionObj) {
    const statement = this._statementTypes.delete({
      tableName: this.name,
      conditions: conditionObj,
    });
    await database.execute(statement);
  }

  static async deleteById(id) {
    // id = replaceAllNotLetterOrNumber(id);
    const statement = this._statementTypes.delete({
      tableName: this.name,
      conditions: { id },
      limit: 1,
    });
    await database.execute(statement);
  }

  static async deleteOne(conditionObj) {
    const statement = this._statementTypes.delete({
      tableName: this.name,
      conditions: conditionObj,
      limit: 1,
    });
    await database.execute(statement);
  }
};

const generateField = (fieldRules) => {
  let field = `${fieldRules.name} `;
  if (fieldRules?.type) field += `${fieldRules.type} `;
  if (!fieldRules?.allowNull && fieldRules?.allowNull != null)
    field += "NOT NULL ";

  if (fieldRules?.minLength != null)
    field += `CONSTRAINT minLength${fieldRules.name} CHECK (LENGTH(${fieldRules.name}) >= ${fieldRules?.minLength}) `;

  if (fieldRules?.maxLength != null)
    field += `CONSTRAINT maxLength${fieldRules.name} CHECK (LENGTH(${fieldRules.name}) <= ${fieldRules?.maxLength}) `;

  if (fieldRules?.defaultValue != null)
    field += `DEFAULT '${fieldRules?.defaultValue}'`;

  if (fieldRules?.fk)
    field += ` ,
      FOREIGN KEY (${fieldRules.name}) REFERENCES ${fieldRules.fk}(id) `;

  if (fieldRules?.unique) field += `,UNIQUE (${fieldRules.name})`;

  return field;
};

const generateRules = (rulesObj) => {
  let rules = "";
  if (rulesObj?.uniqueTogether?.length > 1)
    rules += `,CONSTRAINT uniqueTogether UNIQUE (${rulesObj.uniqueTogether.toString()})`;

  return rules;
};

const generateConditions = (condition) => {
  conditionStatement = "";
  if (condition != null) {
    Object.keys(condition).forEach((key, index) => {
      if (index > 0) {
        conditionStatement += " AND ";
      }

      conditionStatement += `${key}='${condition[key]}'`;
    });
  }
  return conditionStatement;
};

// Functions For Prevent Injection Attacks
const replaceAllNotLetterOrNumber = (value) => {
  if (typeof value == "object")
    return replaceAllNotLetterOrNumberForObject(value);
  else if (Array.isArray(value))
    return replaceAllNotLetterOrNumberForArray(value);
  else if (typeof value == "string") return replaceNoneLetterOrNumber(value);
  return value;
};

const replaceNoneLetterOrNumber = (value) => {
  const regexPattern = /[^A-Za-z0-9]/g;
  return value.replace(regexPattern, "");
};

const replaceAllNotLetterOrNumberForObject = (obj) => {
  const objCopy = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] == "string")
      objCopy[key] = replaceNoneLetterOrNumber(obj[key]);
    else objCopy[key] = obj[key];
  });
  return objCopy;
};

const replaceAllNotLetterOrNumberForArray = (array) => {
  return array.map((item) => {
    if (typeof item == "String") return replaceNoneLetterOrNumber(item);
    else return item;
  });
};
