const database = require("../database");

module.exports = class AbstractModel {
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
    insert: ({ INSERT_OR_REPLACE = "INSERT", tableName, values }) => {
      const keysInString = Object.keys(values).toString();
      const valuesInString = Object.values(values)
        .map((value) => {
          InvalidCharsError(value);
          return `${value == null ? null : `'${value}'`}`;
        })
        .toString();

      return `${INSERT_OR_REPLACE} INTO ${tableName} (${keysInString}) VALUES (${valuesInString});`;
    },

    select: ({
      tableName,
      arrayOfFields = null,
      objConditions = null,
      statementConditions = null,
      limit = null,
      nullable = true,
      semicolon = true,
      orderBy = null,
    }) => {
      let conditionStatement = generateConditions(
        objConditions,
        statementConditions
      );

      let formatFields = arrayOfFields?.map((field) =>
        nullable ? field : `coalesce(${field},0)`
      );
      formatFields = arrayOfFields?.length > 0 ? formatFields : "*";

      return `SELECT ${formatFields} FROM ${tableName}  ${
        conditionStatement ? "WHERE " + conditionStatement : ""
      } ${limit != null ? "LIMIT " + limit : ""} ${semicolon ? ";" : ""}`;
    },

    update: ({
      tableName,
      objFieldForUpdate = null,
      statementFieldForUpdate = null,
      objConditions = null,
      statementConditions = null,
      limit = null,
      semicolon = true,
    }) => {
      let updateStatement = generateUpdateFields(
        objFieldForUpdate,
        statementFieldForUpdate
      );
      let conditionStatement = generateConditions(
        objConditions,
        statementConditions
      );

      return `UPDATE ${tableName} SET ${updateStatement} ${
        conditionStatement ? "WHERE " + conditionStatement : ""
      } ${limit != null ? "LIMIT " + limit : ""}  ${semicolon ? ";" : ""}`;
    },

    delete: ({
      tableName,
      objConditions = null,
      statementConditions = null,
      limit = null,
      semicolon = true,
    }) => {
      let conditionStatement = generateConditions(
        objConditions,
        statementConditions
      );

      return `DELETE FROM ${tableName} ${
        conditionStatement != null ? "WHERE " + conditionStatement : ""
      } ${limit != null ? "LIMIT " + limit : ""} ${semicolon ? ";" : ""}`;
    },

    trigger: ({ triggerName, event, triggerTable, action }) => {
      return `CREATE TRIGGER IF NOT EXISTS ${triggerName}
      ${event}
      ON ${triggerTable}
      FOR EACH ROW
      ${action}`;
    },

    // selectIfExists: ({ condition, action, elseAction }) => {
    //   console.log(action);
    //   return `SELECT CASE WHEN EXISTS (${condition}) THEN ${action} ELSE ${elseAction} END;`;
    // },
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

  static async registerTable() {
    let rules = generateRules(this.rules);
    let fields = "";

    Object.keys(this.fields).forEach((key) => {
      if (this.fields[key].name == null || this.fields[key].type == null)
        return;
      fields += "," + generateField(this.fields[key]);

      const fk = this.fields[key].fk;
      if (fk?.onDelete == "DELETE_WITH_TRIGGER") {
        this.triggers.push({
          triggerName: `${this.name}fk${this.fields[key].name}OnDelete`,
          event: `BEFORE DELETE`,
          triggerTable: fk?.table,
          action: this._statementTypes.delete({
            tableName: this.name,
            statementConditions: [`${this.fields[key].name}=old.id`],
          }),
        });
      }
    });
    // SET FOREIGN_KEY_CHECKS = 1;

    let statement = `CREATE TABLE IF NOT EXISTS ${this.name} (
        id INT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (id)
        ${fields}${rules}
        );`;

    statement = statement.replaceAll("\n", "");

    // console.log("\n" + statement + "\n" + "\n" + "\n");
    await database.execute(statement);

    // console.log(this.triggers);

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
      // console.log(currentTriggerStatement);
      await database.query(currentTriggerStatement);
    });
  }

  static async create(values) {
    const statement = this._statementTypes.insert({
      tableName: this.name,
      values,
    });

    const res = await database.execute(statement);

    return this.findById(res[0].insertId);
  }

  static async findAvg(column, conditionObj) {
    const statement = this._statementTypes.select({
      tableName: this.name,
      arrayOfFields: [`avg(${column})`],
      conditions: conditionObj,
    });

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
      objConditions: { id },
    });
    return (await database.execute(statement))[0][0];
  }

  static async find(conditionObj) {
    // conditionObj = replaceAllNotLetterOrNumber(conditionObj);
    const statement = this._statementTypes.select({
      tableName: this.name,
      objConditions: conditionObj,
    });
    return (await database.execute(statement))[0];
  }

  static async findOne(conditionObj) {
    const statement = this._statementTypes.select({
      tableName: this.name,
      objConditions: conditionObj,
      limit: 1,
    });

    return (await database.execute(statement))[0][0];
  }

  static async update(conditionObj, updateFields) {
    const statement = this._statementTypes.update({
      tableName: this.name,
      objFieldForUpdate: updateFields,
      objConditions: conditionObj,
    });
    console.log(statement);
    await database.execute(statement);
  }

  static async updateOne(conditionObj, updateFields) {
    const statement = this._statementTypes.update({
      tableName: this.name,
      objFieldForUpdate: updateFields,
      objConditions: conditionObj,
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
      objFieldForUpdate: updateFields,
      objConditions: { id },
      limit: 1,
    });
    console.log(statement);
    const res = await database.execute(statement);
    return res[0].affectedRows;
  }

  static async delete(conditionObj) {
    const statement = this._statementTypes.delete({
      tableName: this.name,
      objConditions: conditionObj,
    });
    const res = await database.execute(statement);
    return res[0].affectedRows;
  }

  static async deleteById(id) {
    const statement = this._statementTypes.delete({
      tableName: this.name,
      objConditions: { id },
      limit: 1,
    });
    const res = await database.execute(statement);
    return res[0].affectedRows;
  }

  static async deleteOne(conditionObj) {
    const statement = this._statementTypes.delete({
      tableName: this.name,
      objConditions: conditionObj,
      limit: 1,
    });
    const res = await database.execute(statement);
    return res[0].affectedRows;
  }

  static log() {
    console.log(this);
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
      FOREIGN KEY (${fieldRules.name}) REFERENCES ${
      fieldRules?.fk?.table
    }(id) ${
      fieldRules?.fk?.onDelete == "CASCADE"
        ? `ON DELETE ${fieldRules?.fk?.onDelete}`
        : ""
    }`;

  if (fieldRules?.unique) field += `,UNIQUE (${fieldRules.name})`;

  return field;
};

const generateRules = (rulesObj) => {
  let rules = "";
  if (rulesObj?.uniqueTogether?.length > 1)
    rules += `,CONSTRAINT uniqueTogether UNIQUE (${rulesObj.uniqueTogether.toString()})`;

  return rules;
};

const generateConditions = (
  objConditions = null,
  statementConditions = null
) => {
  let conditionStatement = "";
  if (statementConditions) {
    statementConditions.forEach((condition, index) => {
      if (index > 0) {
        conditionStatement += " AND ";
      }

      InvalidCharsError(condition);

      const splitUpdateField = condition.split("=");
      const key = splitUpdateField[0];
      const value = splitUpdateField.slice(1).join("=");
      conditionStatement += `${key}=(${value})`;
    });
  }

  if (objConditions) {
    Object.keys(objConditions).forEach((key, index) => {
      if (index > 0 || conditionStatement) {
        conditionStatement += " AND ";
      }

      InvalidCharsError(objConditions[key]);

      if (Array.isArray(objConditions[key]))
        conditionStatement += `${key} BETWEEN ${objConditions[key][0]} AND ${objConditions[key][1]}`;
      // conditionStatement += `${key} BETWEEN ${objConditions[key].map(
      //   (value, i) => {
      //     const returnValue = "";
      //     if (i > 0) {
      //       returnValue += " AND ";
      //     }
      //     returnValue += value;
      //     return returnValue;
      //   }
      // )}`;
      else conditionStatement += `${key}='${objConditions[key]}'`;
    });
  }
  // console.log(conditionStatement, 1);
  return conditionStatement;
};

const generateUpdateFields = (
  objFieldForUpdate = null,
  statementFieldForUpdate = null
) => {
  let updateStatement = "";

  if (statementFieldForUpdate) {
    statementFieldForUpdate.forEach((updateField, index) => {
      if (index > 0) {
        updateStatement += ", ";
      }

      InvalidCharsError(updateField);

      const splitUpdateField = updateField.split("=");
      const key = splitUpdateField[0];
      const value = splitUpdateField.slice(1).join("=");
      updateStatement += `${key}=(${value})`;
    });
  }

  if (objFieldForUpdate) {
    Object.keys(objFieldForUpdate).forEach((key, index) => {
      if (index > 0 || updateStatement) {
        updateStatement += ", ";
      }

      InvalidCharsError(objFieldForUpdate[key]);

      updateStatement += `${key}='${objFieldForUpdate[key]}'`;
    });
  }

  return updateStatement;
};

const InvalidCharsError = (stringValue) => {
  if (typeof stringValue != "string") return;

  if (
    !/^[A-Za-z0-9=;_.-\s,()]*$/.test(stringValue) ||
    stringValue.includes("--")
  )
    throw new Error("Contain Invalid Chars");
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
