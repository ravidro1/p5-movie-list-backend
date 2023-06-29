const database = require("../database");

const {
  _fieldsDataTypes,
  _statementTypes,
  _conditionTypes,
} = require("./Models.Types");

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

module.exports = class AbstractModel {
  // fields that every model have
  static fields = {
    createAt: {
      name: "createAt",
      type: _fieldsDataTypes.date_create,
    },
    updateAt: {
      name: "updateAt",
      type: _fieldsDataTypes.date_update,
    },
  };

  // Model Functions
  static async registerTable() {
    let rules = generateRules(this.rules);
    let fields = "";

    Object.keys(this.fields).forEach((key) => {
      if (this.fields[key].name == null || this.fields[key].type == null)
        return;
      fields += "," + generateField(this.fields[key]);

      const fk = this.fields[key].fk;
      if (fk?.onDelete == "DELETE_WITH_TRIGGER") {
        this.triggers.push(
          _statementTypes.trigger({
            triggerName: `${this.name}fk${this.fields[key].name}OnDelete`,
            event: `BEFORE DELETE`,
            triggerTable: fk?.table,
            action: _statementTypes.delete({
              tableName: this.name,
              statementConditions: [
                _conditionTypes.equal({
                  key: { keyValue: this.fields[key].name },
                  value: { valueValue: "old.id" },
                }),
              ],
            }),
          })
        );

        console.log(
          _statementTypes.trigger({
            triggerName: `${this.name}fk${this.fields[key].name}OnDelete`,
            event: `BEFORE DELETE`,
            triggerTable: fk?.table,
            action: _statementTypes.delete({
              tableName: this.name,
              statementConditions: [
                _conditionTypes.equal({
                  key: { keyValue: this.fields[key].name },
                  value: { valueValue: "old.id" },
                }),
              ],
            }),
          }),
          754
        );
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

    this.triggers?.forEach(async (trigger) => {
     // await database.query(trigger);
      await database.query(trigger.replaceAll("\n", ""));
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
    const statement = _statementTypes.select({
      tableName: this.name,
      arrayOfFields: [`avg(${column})`],
      conditions: conditionObj,
    });

    const data = await database.execute(statement);
    return data[0];
  }

  static async findAll() {
    const statement = _statementTypes.select({ tableName: this.name });
    console.log(statement);
    const data = await database.execute(statement);
    return data[0];
  }

  static async findById(id) {
    const statement = _statementTypes.select({
      tableName: this.name,
      objConditions: { id },
    });

    return (await database.execute(statement))[0][0];
  }

  static async find({ conditionObj, statementConditions, limit }) {
    const statement = _statementTypes.select({
      tableName: this.name,
      objConditions: conditionObj,
      statementConditions,
      limit,
    });

    return (await database.execute(statement))[0];
  }

  static async findOne({ conditionObj, statementConditions }) {
    const statement = _statementTypes.select({
      tableName: this.name,
      objConditions: conditionObj,
      statementConditions,
      limit: 1,
    });

    return (await database.execute(statement))[0][0];
  }

  static async update(conditionObj, updateFields) {
    const statement = _statementTypes.update({
      tableName: this.name,
      objFieldForUpdate: updateFields,
      objConditions: conditionObj,
    });
    console.log(statement);
    await database.execute(statement);
  }

  static async updateOne(conditionObj, updateFields) {
    const statement = _statementTypes.update({
      tableName: this.name,
      objFieldForUpdate: updateFields,
      objConditions: conditionObj,
      limit: 1,
    });
    console.log(statement);
    await database.execute(statement);
  }

  static async updateById(id, updateFields) {
    const statement = _statementTypes.update({
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
    const statement = _statementTypes.delete({
      tableName: this.name,
      objConditions: conditionObj,
    });
    const res = await database.execute(statement);
    return res[0].affectedRows;
  }

  static async deleteById(id) {
    const statement = _statementTypes.delete({
      tableName: this.name,
      objConditions: { id },
      limit: 1,
    });
    const res = await database.execute(statement);
    return res[0].affectedRows;
  }

  static async deleteOne(conditionObj) {
    const statement = _statementTypes.delete({
      tableName: this.name,
      objConditions: conditionObj,
      limit: 1,
    });
    const res = await database.execute(statement);
    return res[0].affectedRows;
  }
};
