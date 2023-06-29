const AbstractModel = require("./AbstractModel");
const {
  _fieldsDataTypes,
  _updateTypes,
  _statementTypes,
  _selectFieldTypes,
} = require("./Models.Types");

module.exports = class MovieReview extends AbstractModel {
  static fields = {
    ...this.fields,

    name: {
      name: "name",
      type: _fieldsDataTypes.char(255),
      unique: true,
      allowNull: false,
    },
    normalizeName: {
      name: "normalizeName",
      type: _fieldsDataTypes.char(255),
      unique: true,
      // allowNull: false,
    },
    averageRateScore: {
      name: "averageRateScore",
      type: _fieldsDataTypes.float,
      defaultValue: 0,
      allowNull: false,
    },

    numberOfRate: {
      name: "numberOfRate",
      type: _fieldsDataTypes.int,
      defaultValue: 0,
      allowNull: false,
    },
    description: { name: "description", type: _fieldsDataTypes.string(4000) },
    categories: { name: "categories", type: _fieldsDataTypes.json },
    releaseDate: { name: "releaseDate", type: _fieldsDataTypes.date },
  };

  static rules = {};

  static triggers = [
    _statementTypes.trigger({
      triggerName: `${this.name}1`,
      event: "BEFORE INSERT",
      triggerTable: this.name,
      action: _statementTypes.update({
        tableName: this.name,
        withUpdateWord: false,
        statementFieldForUpdate: [
          _updateTypes.equal({
            key: { keyValue: "new.normalizeName" },
            value: {
              valueValue: _statementTypes.select({
                semicolon: false,
                formatFields: [
                  _selectFieldTypes.lower(
                    _selectFieldTypes.regexReplace({
                      field: "new.name",
                      from: "[^0-9a-zA-Z ]",
                      to: "",
                    })
                  ),
                ],
              }),
            },
          }),
        ],
      }),
    }),

    _statementTypes.trigger({
      triggerName: `${this.name}2`,
      event: "BEFORE UPDATE",
      triggerTable: this.name,
      action: _statementTypes.update({
        tableName: this.name,
        withUpdateWord: false,
        statementFieldForUpdate: [
          _updateTypes.equal({
            key: { keyValue: "new.normalizeName" },
            value: {
              valueValue: _statementTypes.select({
                semicolon: false,
                formatFields: [
                  _selectFieldTypes.lower(
                    _selectFieldTypes.regexReplace({
                      field: "new.name",
                      from: "[^0-9a-zA-Z ]",
                      to: "",
                    })
                  ),
                ],
              }),
            },
          }),
        ],
      }),
    }),
  ];
};
