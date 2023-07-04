const AbstractModel = require("./AbstractModel");

const { oneField, _fieldsDataTypes, fkField } = require("./fields");

module.exports = class User extends AbstractModel {
  static fields = {
    ...this.fields,
    username: oneField({
      name: "username",
      unique: true,
      allowNull: false,
      type: _fieldsDataTypes.string(255),
      minLength: 8,
      maxLength: 20,
    }),
    password: oneField({
      name: "password",
      type: _fieldsDataTypes.string(255),
      allowNull: false,
    }),
  };
};
