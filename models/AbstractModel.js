const database = require("../database");

const { _fieldsDataTypes } = require("./Models.Types");

const { Insert, Delete, Select, Trigger, Update } = require("./statements");

const generateField = (fieldRules) => {
  let field = `${fieldRules.name} `;
  if (fieldRules?.type) field += `${fieldRules.type} `;
  if (!fieldRules?.allowNull && fieldRules?.allowNull != null)
    field += "NOT NULL ";

  if (fieldRules?.minLength != null)
    field += `CONSTRAINT minLength${fieldRules.name} CHECK (LENGTH(${fieldRules.name}) >= ${fieldRules?.minLength}) `;

  if (fieldRules?.maxLength != null)
    field += `CONSTRAINT maxLength${fieldRules.name} CHECK (LENGTH(${fieldRules.name}) <= ${fieldRules?.maxLength}) `;

  if (fieldRules?.defaultValue != null) {
    if (typeof fieldRules?.defaultValue == "string")
      field += `DEFAULT '${fieldRules?.defaultValue}'`;
    else field += `DEFAULT ${fieldRules?.defaultValue}`;
  }

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
      type: _fieldsDataTypes.date_timestamp_create,
    },
    updateAt: {
      name: "updateAt",
      type: _fieldsDataTypes.date_timestamp_update,
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
          Trigger.table(fk?.table)
            .triggerName(`${this.name}fk${this.fields[key].name}OnDelete`)
            .triggerEvent(`BEFORE DELETE`)
            .triggerAction(
              Delete.table(this.name)
                .condition_equalNotString({
                  column: this.fields[key].name,
                  value: "old.id",
                })
                .endDelete()
            )
            .triggerEnd()
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
      // console.log(trigger + "\n\n\n\n\n");
      await database.query(trigger.replaceAll("\n", ""));
    });
  }

  static async create(values) {
    const statement = Insert.table(this.name)
      .keysAndValueObj(values)
      .endInsert();

    const res = await database.execute(statement);
    return this.findById(res[0].insertId);
  }

  static async createOrUpdate(values) {
    const statement = Insert.table(this.name)
      .keysAndValueObj(values)
      .endInsert(true, "REPLACE");

    const res = await database.execute(statement);
    return this.findById(res[0].insertId);
  }

  static async findAll() {
    const statement = Select.table(this.name).selectEnd();
    const data = await database.execute(statement);
    return data[0];
  }

  static async findById(id) {
    const statement = Select.table(this.name)
      .condition_equalNotString({ column: "id", value: id })
      .limit(1)
      .selectEnd();

    return (await database.execute(statement))[0][0];
  }

  static async find({ conditionObj, limit }) {
    const statement = Select.table(this.name)
      .condition_obj(conditionObj)
      .limit(limit)
      .selectEnd();

    return (await database.execute(statement))[0];
  }

  static async findOne({ conditionObj }) {
    const statement = Select.table(this.name)
      .condition_obj(conditionObj)
      .limit(1)
      .selectEnd();

    return (await database.execute(statement))[0][0];
  }

  static async update({ conditionObj, updateFields }) {
    const statement = Update.table(this.name)
      .condition_obj(conditionObj)
      .update_obj(updateFields)
      .endUpdate();

    await database.execute(statement);
    // const statement2 = Select.table(this.name).condition_columnInArrayOfValues().selectEnd();
  }

  static async updateOne({ conditionObj, updateFields }) {
    const statement = Update.table(this.name)
      .condition_obj(conditionObj)
      .update_obj(updateFields)
      .limit(1)
      .endUpdate();

    await database.execute(statement);
  }

  static async updateById({ id, updateFields }) {
    const statement = Update.table(this.name)
      .condition_equalNotString({ column: "id", value: id })
      .update_obj(updateFields)
      .limit(1)
      .endUpdate();

    const res = await database.execute(statement);
    if (res[0].affectedRows < 1) return Promise.reject("Update Fail");

    const selectStatement = Select.table(this.name)
      .condition_equalNotString({ column: "id", value: id })
      .limit(1)
      .selectEnd();

    return (await database.execute(selectStatement))[0];
  }

  static async delete(conditionObj) {
    const statement = Delete.table(this.name)
      .condition_obj(conditionObj)
      .endDelete();
    // const statement = _statementTypes.delete({
    //   tableName: this.name,
    //   objConditions: conditionObj,
    // });
    const res = await database.execute(statement);
    return res[0].affectedRows;
  }

  static async deleteById(id) {
    // const statement = _statementTypes.delete({
    //   tableName: this.name,
    //   objConditions: { id },
    //   limit: 1,
    // });

    const statement = Delete.table(this.name)
      .condition_equalNotString({ column: "id", value: id })
      .limit(1)
      .endDelete();
    const res = await database.execute(statement);
    return res[0].affectedRows;
  }

  static async deleteOne(conditionObj) {
    const statement = Delete.table(this.name)
      .condition_obj(conditionObj)
      .limit(1)
      .endDelete();
    const res = await database.execute(statement);
    return res[0].affectedRows;
  }
};
