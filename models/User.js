const database = require("../database");
const AbstractModel = require("./AbstractModel");

module.exports = class User extends AbstractModel {
  constructor() {
    super();
  }

  static fields = {
    username: {
      name: "username",
      // unique: true,
      allowNull: false,
      type: this.dataType.string(255),
      defaultValue: 1,
      // minLength: 5,
      // maxLength: 10,
    },
    password: {
      name: "password",
      type: this.dataType.string(255),
      allowNull: false,
      // unique: true,
    },
    otherUserID: {
      name: "otherUserID",
      allowNull: true,
      type: this.dataType.int,
      fk: "User",
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
//default getdate()
