const AbstractModel = require("./AbstractModel");

module.exports = class MovieReview extends AbstractModel {
  static fields = {
    ...this.fields,

    name: {
      name: "name",
      type: this._dataType.char(255),
      unique: true,
      allowNull: false,
    },
    normalizeName: {
      name: "normalizeName",
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

    numberOfRate: {
      name: "numberOfRate",
      type: this._dataType.int,
      defaultValue: 0,
      allowNull: false,
    },
    description: { name: "description", type: this._dataType.string(4000) },
    categories: { name: "categories", type: this._dataType.json },
    releaseDate: { name: "releaseDate", type: this._dataType.date },
  };

  static rules = {};
};
