const AbstractModel = require("./AbstractModel");

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
      type: this._dataType.int,
      fk: {
        table: "User",
        onDelete: "DELETE_WITH_TRIGGER",
      },
      allowNull: false,
    },
    movie_id: {
      name: "movie_id",
      type: this._dataType.int,
      fk: {
        table: "MovieReview",
        onDelete: "CASCADE",
      },
      allowNull: false,
    },
    rate: { name: "rate", type: this._dataType.float, defaultValue: 0 },
    allowNull: false,
  };

  static rules = {
    uniqueTogether: ["user_id", "movie_id"],
  };

  static triggers = [
    {
      triggerName: `${this.name}1`,
      event: "AFTER UPDATE",
      triggerTable: this.name,
      action: this._statementTypes.update({
        tableName: "MovieReview",
        statementFieldForUpdate: [
          `averageRateScore=${this._statementTypes.select({
            tableName: this.name,
            arrayOfFields: ["avg(rate)"],
            statementConditions: ["onerate.movie_id=moviereview.id"],
            nullable: false,
            semicolon: false,
          })}`,
          `numberOfRate=${this._statementTypes.select({
            tableName: this.name,
            arrayOfFields: ["count(rate)"],
            statementConditions: ["onerate.movie_id=moviereview.id"],
            nullable: false,
            semicolon: false,
          })}`,
        ],
        statementConditions: ["moviereview.id=new.movie_id"],
      }),
    },

    {
      triggerName: `${this.name}2`,
      event: "AFTER INSERT",
      triggerTable: this.name,
      action: this._statementTypes.update({
        tableName: "MovieReview",
        statementFieldForUpdate: [
          `averageRateScore=${this._statementTypes.select({
            tableName: this.name,
            arrayOfFields: ["avg(rate)"],
            statementConditions: ["onerate.movie_id=moviereview.id"],
            nullable: false,
            semicolon: false,
          })}`,
          `numberOfRate=${this._statementTypes.select({
            tableName: this.name,
            arrayOfFields: ["count(rate)"],
            statementConditions: ["onerate.movie_id=moviereview.id"],
            nullable: false,
            semicolon: false,
          })}`,
        ],
        statementConditions: ["moviereview.id=new.movie_id"],
      }),
    },

    {
      triggerName: `${this.name}3`,
      event: "AFTER DELETE",
      triggerTable: this.name,
      action: this._statementTypes.update({
        tableName: "MovieReview",
        statementFieldForUpdate: [
          `averageRateScore=${this._statementTypes.select({
            tableName: this.name,
            arrayOfFields: ["avg(rate)"],
            statementConditions: ["movie_id=moviereview.id"],
            nullable: false,
            semicolon: false,
          })}`,
          `numberOfRate=${this._statementTypes.select({
            tableName: this.name,
            arrayOfFields: ["count(rate)"],
            statementConditions: ["movie_id=moviereview.id"],
            nullable: false,
            semicolon: false,
          })}`,
        ],
        statementConditions: ["moviereview.id=old.movie_id"],
      }),
    },
  ];
};
