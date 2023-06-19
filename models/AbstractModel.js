const database = require("../database");

module.exports = class AbstractModel {
  constructor() {}

  static dataType = {
    char: (size) => `CHAR(${size})`,
    string: (size) => `VARCHAR(${size})`,
    int: "INT",
    float: "FLOAT",
    date_create: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    date_update:
      "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
  };

  static async registerTable() {
    let rules = generateRules(this.rules);
    let fields = "";

    Object.keys(this.fields).forEach((key, index) => {
      fields += "," + generateField(this.fields[key]);
    });

    let statement = `CREATE TABLE IF NOT EXISTS ${this.name} (
        id INT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (id)
        ${fields}${rules}
        );`;

    statement = statement.replaceAll("\n", "");

    console.log(statement);
    await database.execute(statement);
  }

  static async create(values) {
    values = replaceAllNotLetterOrNumber(values);

    const statement = `INSERT INTO ${this.name} (${Object.keys(values).map(
      (key, index) => {
        // let returnValue = "";
        // if (index > 0) returnValue += ",";
        // returnValue += key;
        // console.log(returnValue);
        // return returnValue;
        return key;
      }
    )})
    VALUES (${Object.keys(values).map((key) => {
      return `${values[key] == null ? null : `'${values[key]}'`}`;
    })});`;

    console.log(statement);
    return await database.execute(statement);
  }

  static async findAll() {
    const data = await database.execute(`SELECT * FROM ${this.name};`);
    return data[0];
  }

  static async findById(id) {
    id = replaceAllNotLetterOrNumber(id);

    const statement = `SELECT * FROM ${this.name} WHERE id=${id};`;
    return (await database.execute(statement))[0][0];
  }

  static async find(conditionObj) {
    conditionObj = replaceAllNotLetterOrNumber(conditionObj);

    let conditionStatement = "";

    Object.keys(conditionObj).forEach((key, index) => {
      if (index > 0) {
        conditionStatement += " AND ";
      }

      conditionStatement += `${key}='${conditionObj[key]}'`;
    });

    const statement = `SELECT * FROM ${this.name} WHERE ${conditionStatement};`;

    return (await database.execute(statement))[0];
  }

  static async findOne(conditionObj) {
    conditionObj = replaceAllNotLetterOrNumber(conditionObj);

    let conditionStatement = "";

    Object.keys(conditionObj).forEach((key, index) => {
      if (index > 0) {
        conditionStatement += " AND ";
      }

      conditionStatement += `${key}='${conditionObj[key]}'`;
    });

    const statement = `SELECT * FROM ${this.name} WHERE ${conditionStatement} LIMIT 1;`;

    return (await database.execute(statement))[0][0];
  }

  static async update(conditionObj) {
    conditionObj = replaceAllNotLetterOrNumber(conditionObj);

    let conditionStatement = "";
    let updateStatement = "";

    Object.keys(conditionObj).forEach((key, index) => {
      if (index > 0) {
        conditionStatement += " AND ";
      }

      conditionStatement += `${key}='${conditionObj[key]}'`;
    });

    Object.keys(updateFields).forEach((key, index) => {
      if (index > 0) {
        updateStatement += ", ";
      }

      updateStatement += `${key}='${updateFields[key]}'`;
    });

    const statement = `UPDATE ${this.name} SET ${updateStatement} WHERE ${conditionStatement};`;

    console.log(statement);
    await database.execute(statement);
  }

  static async updateOne(conditionObj, updateFields) {
    conditionObj = replaceAllNotLetterOrNumber(conditionObj);
    updateFields = replaceAllNotLetterOrNumber(updateFields);

    let conditionStatement = "";
    let updateStatement = "";

    Object.keys(conditionObj).forEach((key, index) => {
      if (index > 0) {
        conditionStatement += " AND ";
      }

      conditionStatement += `${key}='${conditionObj[key]}'`;
    });

    Object.keys(updateFields).forEach((key, index) => {
      if (index > 0) {
        updateStatement += ", ";
      }

      updateStatement += `${key}='${updateFields[key]}'`;
    });

    const statement = `UPDATE ${this.name} SET ${updateStatement} WHERE ${conditionStatement} LIMIT 1;`;

    console.log(statement);
    await database.execute(statement);
  }

  static async updateById(id, updateFields) {
    id = replaceAllNotLetterOrNumber(id);

    updateFields = replaceAllNotLetterOrNumber(updateFields);

    let updateStatement = "";

    Object.keys(updateFields).forEach((key, index) => {
      if (index > 0) {
        updateStatement += ", ";
      }

      updateStatement += `${key}='${updateFields[key]}'`;
    });

    const statement = `UPDATE ${this.name} SET ${updateStatement} WHERE id=${id} LIMIT 1;`;

    console.log(statement);
    await database.execute(statement);
  }

  static async delete(conditionObj) {
    conditionObj = replaceAllNotLetterOrNumber(conditionObj);

    let conditionStatement = "";

    Object.keys(conditionObj).forEach((key, index) => {
      if (index > 0) {
        conditionStatement += " AND ";
      }

      conditionStatement += `${key}='${conditionObj[key]}'`;
    });

    const statement = `DELETE FROM ${this.name} WHERE ${conditionStatement};`;

    await database.execute(statement);
  }

  static async deleteById(id) {
    id = replaceAllNotLetterOrNumber(id);

    const statement = `DELETE FROM ${this.name} WHERE id=${id};`;
    await database.execute(statement);
  }

  static async deleteOne(conditionObj) {
    conditionObj = replaceAllNotLetterOrNumber(conditionObj);

    let conditionStatement = "";

    Object.keys(conditionObj).forEach((key, index) => {
      if (index > 0) {
        conditionStatement += " AND ";
      }

      conditionStatement += `${key}='${conditionObj[key]}'`;
    });

    const statement = `DELETE FROM ${this.name} WHERE ${conditionStatement} LIMIT 1;`;

    await database.execute(statement);
  }
};

const generateField = (fieldRules) => {
  let field = `${fieldRules.name} `;
  if (fieldRules?.type) field += `${fieldRules.type} `;
  if (!fieldRules?.allowNull && fieldRules?.allowNull != null)
    field += "NOT NULL ";

  if (fieldRules?.minLength != null)
    field += `CONSTRAINT minLength CHECK (LENGTH(${fieldRules.name}) >= ${fieldRules?.minLength}) `;

  if (fieldRules?.maxLength != null)
    field += `CONSTRAINT maxLength CHECK (LENGTH(${fieldRules.name}) <= ${fieldRules?.maxLength}) `;

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
