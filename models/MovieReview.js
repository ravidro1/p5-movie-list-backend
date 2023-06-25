const AbstractModel = require("./AbstractModel");

module.exports = class MovieReview extends AbstractModel {
  static fields = {
    name: {
      name: "name",
      type: this._dataType.char(255),
      unique: true,
      allowNull: false,
    },
    averageRateScore: {
      name: "averageRateScore",
      type: this._dataType.float,
      defaultValue: 0,
      allowNull: false,
    },
    // numberOfRate: {
    //   name: "numberOfRate",
    //   type: this.dataType.int,
    //   defaultValue: 0,
    //   allowNull: false,
    // },
  };

  static rules = {};
};
