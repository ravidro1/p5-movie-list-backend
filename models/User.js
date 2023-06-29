const AbstractModel = require("./AbstractModel");
const { _fieldsDataTypes } = require("./Models.Types");

module.exports = class User extends AbstractModel {
  static fields = {
    ...this.fields,
    username: {
      name: "username",
      unique: true,
      allowNull: false,
      type: _fieldsDataTypes.string(255),
      minLength: 8,
      maxLength: 20,
    },
    password: {
      name: "password",
      type: _fieldsDataTypes.string(255),
      allowNull: false,
    },
  };
};
