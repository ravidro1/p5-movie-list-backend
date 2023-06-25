const AbstractModel = require("./AbstractModel");

module.exports = class OneRate extends AbstractModel {
  static fields = {
    user_id: { name: "user_id", type: this._dataType.int, fk: "User" },
    movie_id: { name: "movie_id", type: this._dataType.int, fk: "MovieReview" },
    rate: { name: "rate", type: this._dataType.float, defaultValue: 0 },
  };

  static rules = {
    uniqueTogether: ["user_id", "movie_id"],
  };

  static triggers = [
    {
      triggerName: `${this.name}1`,
      event: "AFTER UPDATE",
      triggerTable: this.name,
      action: this._statementTypes
        .update({
          tableName: "MovieReview",
          fieldForUpdate: {
            averageRateScore: this._statementTypes
              .select({
                tableName: this.name,
                arrayOfFields: ["avg(rate)"],
                conditions: { movie_id: "moviereview.id" },
                nullable: false,
              })
              .replaceAll(";", ""),
          },
          conditions: { id: "new.movie_id" },
        })
        .replaceAll("'", ""),
    },
    {
      triggerName: `${this.name}2`,
      event: "AFTER INSERT",
      triggerTable: this.name,
      action: this._statementTypes
        .update({
          tableName: "MovieReview",
          fieldForUpdate: {
            averageRateScore: this._statementTypes
              .select({
                tableName: this.name,
                arrayOfFields: ["avg(rate)"],
                conditions: { movie_id: "moviereview.id" },
                nullable: false,
              })
              .replaceAll(";", ""),
          },
          conditions: { id: "new.movie_id" },
        })
        .replaceAll("'", ""),
    },
    {
      triggerName: "tr1232",
      event: "AFTER UPDATE",
      triggerTable: this.name,
      action: this._statementTypes
        .update({
          tableName: "MovieReview",
          fieldForUpdate: {
            averageRateScore: this._statementTypes
              .select({
                tableName: this.name,
                arrayOfFields: ["avg(rate)"],
                conditions: { movie_id: "moviereview.id" },
                nullable: false,
              })
              .replaceAll(";", ""),
          },
          conditions: { id: "new.movie_id" },
        })
        .replaceAll("'", ""),
    },
  ];
};

// CREATE TRIGGER  tr1
// after insert
// ON onerate
// FOR each row
// update moviereview
// set averageRateScore= (SELECT coalesce(avg(rate) ,0 FROM onerate WHERE onerate.movie_id=moviereview.id)
// where moviereview.id=new.movie_id;
