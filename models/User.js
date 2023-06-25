const AbstractModel = require("./AbstractModel");

module.exports = class User extends AbstractModel {
  // constructor() {
  //   super();
  // }

  static fields = {
    ...this.fields,
    username: {
      name: "username",
      unique: true,
      allowNull: false,
      type: this._dataType.string(255),
      defaultValue: 1,
      minLength: 8,
      maxLength: 20,
    },
    password: {
      name: "password",
      type: this._dataType.string(255),
      allowNull: false,
    },
  };

  static rules = {
    // uniqueTogether: ["username", "password"],
  };
};
