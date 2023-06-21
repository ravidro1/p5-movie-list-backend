const database = require("../database");
const AbstractModel = require("./AbstractModel");

module.exports = class User extends AbstractModel {
  // constructor() {
  //   super();
  // }

  static fields = {
    username: {
      name: "username",
      unique: true,
      allowNull: false,
      type: this.dataType.string(255),
      defaultValue: 1,
      minLength: 8,
      maxLength: 20,
    },
    password: {
      name: "password",
      type: this.dataType.string(255),
      allowNull: false,
    },
    createAt: {
      name: "createAt",
      type: this.dataType.date_create,
    },
    updateAt: {
      name: "updateAt",
      type: this.dataType.date_update,
    },
  };

  static rules = {
    // uniqueTogether: ["username", "password"],
  };
};
