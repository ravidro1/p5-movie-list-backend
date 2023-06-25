const AbstractModel = require("./AbstractModel");

module.exports = class OneRate extends AbstractModel {
  static fields = {
    user_id: {
      name: "user_id",
      type: this._dataType.int,
      fk: { table: "User", onDelete: "CASCADE" },
      allowNull: false,
    },
    movie_id: {
      name: "movie_id",
      type: this._dataType.int,
      fk: { table: "MovieReview", onDelete: "CASCADE" },
      allowNull: false,
    },
    rate: { name: "rate", type: this._dataType.float, defaultValue: 0 },
    allowNull: false,
  };

  // ON DELETE CASCADE

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
        ],
        statementConditions: ["moviereview.id=new.movie_id"],
      }),
    },
    // {
    //   triggerName: `${this.name}3`,
    //   event: "BEFORE DELETE",
    //   triggerTable: this.name,
    //   action: this._statementTypes.update({
    //     tableName: "MovieReview",
    //     statementFieldForUpdate: [
    //       `averageRateScore=${this._statementTypes.select({
    //         tableName: this.name,
    //         arrayOfFields: ["avg(rate)"],
    //         statementConditions: ["onerate.movie_id=moviereview.id"],
    //         nullable: false,
    //         semicolon: false,
    //       })}`,
    //     ],
    //     statementConditions: ["moviereview.id=onerate.movie_id"],
    //   }),
    // },
  ];
};

// {
//   triggerName: `${this.name}1`,
//   event: "AFTER UPDATE",
//   triggerTable: this.name,
//   action: this._statementTypes.ifExists({
//     condition: this._statementTypes
//       .select({
//         tableName: "MovieReview",
//         conditions: { name: "onerate.movie_name" },
//         semicolon: false,
//       })
//       .replaceAll("'", ""),
//     action: this._statementTypes
//       .update({
//         tableName: "MovieReview",
//         fieldForUpdate: {
//           averageRateScore: this._statementTypes.select({
//             tableName: this.name,
//             arrayOfFields: ["avg(rate)"],
//             conditions: { movie_name: "moviereview.name" },
//             nullable: false,
//             semicolon: false,
//           }),
//         },
//         conditions: { id: "new.movie_id" },
//         semicolon: false,
//       })
//       .replaceAll("'", ""),
//     elseAction: this._statementTypes.insert({
//       tableName: "MovieReview",
//       values: { name: "q", rate: 5 },
//     }),
//   }),
// },

// CREATE TRIGGER  tr1
// after insert
// ON onerate
// FOR each row
// update moviereview
// set averageRateScore= (SELECT coalesce(avg(rate) ,0 FROM onerate WHERE onerate.movie_id=moviereview.id)
// where moviereview.id=new.movie_id;
