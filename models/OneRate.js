const AbstractModel = require("./AbstractModel");
const {
  _fieldsDataTypes,
  _statementTypes,
  _updateTypes,
  _conditionTypes,
} = require("./Models.Types");

module.exports = class OneRate extends AbstractModel {
  static fields = {
    ...this.fields,

    // fields:
    //? TYPES:
    // name:
    // type:
    // allowNull?:
    // defaultValue?:
    // minLength?:
    // maxLength?:
    // unique?:
    // fk? - create foreign key  {
    //    onDelete: {
    //!      DELETE_WITH_TRIGGER - delete all items with this fk but not working when current table have trigger for update the fk-table on this-table delete.
    //!      CASCADE - delete all items with this fk but does not activate the delete trigger of current table.
    //    }
    // }

    user_id: {
      name: "user_id",
      type: _fieldsDataTypes.int,
      fk: {
        table: "User",
        onDelete: "DELETE_WITH_TRIGGER",
      },
      allowNull: false,
    },
    movie_id: {
      name: "movie_id",
      type: _fieldsDataTypes.int,
      fk: {
        table: "MovieReview",
        onDelete: "CASCADE",
      },
      allowNull: false,
    },
    rate: { name: "rate", type: _fieldsDataTypes.float, defaultValue: 0 },
    allowNull: false,
  };

  static rules = {
    uniqueTogether: ["user_id", "movie_id"],
  };

  static triggers = [
    _statementTypes.trigger({
      triggerName: `${this.name}1`,
      event: "AFTER UPDATE",
      triggerTable: this.name,
      action: _statementTypes.update({
        tableName: "MovieReview",
        statementFieldForUpdate: [
          _updateTypes.equal({
            key: { keyValue: "averageRateScore" },
            value: {
              valueValue: _statementTypes.selectFrom({
                tableName: this.name,
                arrayOfFields: ["avg(rate)"],
                statementConditions: [
                  _conditionTypes.equal({
                    key: { keyValue: "onerate.movie_id" },
                    value: { valueValue: "moviereview.id" },
                  }),
                ],
                nullable: false,
                semicolon: false,
              }),
            },
          }),

          _updateTypes.equal({
            key: { keyValue: "numberOfRate" },
            value: {
              valueValue: _statementTypes.selectFrom({
                tableName: this.name,
                arrayOfFields: ["count(rate)"],
                statementConditions: [
                  _conditionTypes.equal({
                    key: { keyValue: "onerate.movie_id" },
                    value: { valueValue: "moviereview.id" },
                  }),
                ],
                nullable: false,
                semicolon: false,
              }),
            },
          }),
        ],

        statementConditions: [
          _conditionTypes.equal({
            key: { keyValue: "moviereview.id" },
            value: { valueValue: "new.movie_id" },
          }),
        ],
      }),
    }),

    _statementTypes.trigger({
      triggerName: `${this.name}2`,
      event: "AFTER INSERT",
      triggerTable: this.name,
      action: _statementTypes.update({
        tableName: "MovieReview",
        statementFieldForUpdate: [
          _updateTypes.equal({
            key: { keyValue: "averageRateScore" },
            value: {
              valueValue: _statementTypes.selectFrom({
                tableName: this.name,
                arrayOfFields: ["avg(rate)"],
                statementConditions: [
                  _conditionTypes.equal({
                    key: { keyValue: "onerate.movie_id" },
                    value: { valueValue: "moviereview.id" },
                  }),
                ],
                nullable: false,
                semicolon: false,
              }),
            },
          }),
          _updateTypes.equal({
            key: { keyValue: "numberOfRate" },
            value: {
              valueValue: _statementTypes.selectFrom({
                tableName: this.name,
                arrayOfFields: ["count(rate)"],
                statementConditions: [
                  _conditionTypes.equal({
                    key: { keyValue: "onerate.movie_id" },
                    value: { valueValue: "moviereview.id" },
                  }),
                ],
                nullable: false,
                semicolon: false,
              }),
            },
          }),
        ],
        statementConditions: [
          _conditionTypes.equal({
            key: { keyValue: "moviereview.id" },
            value: { valueValue: "new.movie_id" },
          }),
        ],
      }),
    }),

    _statementTypes.trigger({
      triggerName: `${this.name}3`,
      triggerTable: this.name,
      event: "AFTER DELETE",
      action: _statementTypes.update({
        tableName: "MovieReview",
        statementFieldForUpdate: [
          _updateTypes.equal({
            key: { keyValue: "averageRateScore" },
            value: {
              valueValue: _statementTypes.selectFrom({
                tableName: this.name,
                arrayOfFields: ["avg(rate)"],
                statementConditions: [
                  _conditionTypes.equal({
                    key: { keyValue: "movie_id" },
                    value: { valueValue: "moviereview.id" },
                  }),
                ],
                nullable: false,
                semicolon: false,
              }),
            },
          }),
          _updateTypes.equal({
            key: { keyValue: "numberOfRate" },
            value: {
              valueValue: _statementTypes.selectFrom({
                tableName: this.name,
                arrayOfFields: ["count(rate)"],
                statementConditions: [
                  _conditionTypes.equal({
                    key: { keyValue: "movie_id" },
                    value: { valueValue: "moviereview.id" },
                  }),
                ],
                nullable: false,
                semicolon: false,
              }),
            },
          }),
        ],
        statementConditions: [
          _conditionTypes.equal({
            key: { keyValue: "moviereview.id" },
            value: { valueValue: "old.movie_id" },
          }),
        ],
      }),
    }),
  ];
};
