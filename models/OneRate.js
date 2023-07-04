const AbstractModel = require("./AbstractModel");
const { _fieldsDataTypes } = require("./Models.Types");

const { Select, Trigger, Update } = require("./statements");

module.exports = class OneRate extends AbstractModel {
  static fields = {
    ...this.fields,

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
    Trigger.table(this.name)
      .triggerEvent("AFTER UPDATE")
      .triggerName(`${this.name}1`)
      .triggerAction(
        Update.table("MovieReview")
          .condition_equalStatement({
            column: "moviereview.id",
            value: "new.movie_id",
          })
          .update_equalStatement({
            column: "averageRateScore",
            value: Select.table(this.name)
              .field_avg({ column: "rate", ifNullThen: 0 })
              .condition_equalStatement({
                column: "onerate.movie_id",
                value: "moviereview.id",
              })
              .selectEnd(false),
          })
          .update_equalStatement({
            column: "numberOfRate",
            value: Select.table(this.name)
              .field_count({ column: "rate", ifNullThen: 0 })
              .condition_equalStatement({
                column: "onerate.movie_id",
                value: "moviereview.id",
              })
              .selectEnd(false),
          })
          .endUpdate()
      )
      .triggerEnd(),

    Trigger.table(this.name)
      .triggerEvent("AFTER INSERT")
      .triggerName(`${this.name}2`)
      .triggerAction(
        Update.table("MovieReview")
          .condition_equalStatement({
            column: "moviereview.id",
            value: "new.movie_id",
          })
          .update_equalStatement({
            column: "averageRateScore",
            value: Select.table(this.name)
              .field_avg({ column: "rate", ifNullThen: 0 })
              .condition_equalStatement({
                column: "onerate.movie_id",
                value: "moviereview.id",
              })
              .selectEnd(false),
          })
          .update_equalStatement({
            column: "numberOfRate",
            value: Select.table(this.name)
              .field_count({ column: "rate", ifNullThen: 0 })
              .condition_equalStatement({
                column: "onerate.movie_id",
                value: "moviereview.id",
              })
              .selectEnd(false),
          })
          .endUpdate()
      )
      .triggerEnd(),

    Trigger.table(this.name)
      .triggerEvent("AFTER DELETE")
      .triggerName(`${this.name}3`)
      .triggerAction(
        Update.table("MovieReview")
          .condition_equalStatement({
            column: "moviereview.id",
            value: "old.movie_id",
          })
          .update_equalStatement({
            column: "averageRateScore",
            value: Select.table(this.name)
              .field_avg({ column: "rate", ifNullThen: 0 })
              .condition_equalStatement({
                column: "movie_id",
                value: "moviereview.id",
              })
              .selectEnd(false),
          })
          .update_equalStatement({
            column: "numberOfRate",
            value: Select.table(this.name)
              .field_count({ column: "rate", ifNullThen: 0 })
              .condition_equalStatement({
                column: "movie_id",
                value: "moviereview.id",
              })
              .selectEnd(false),
          })
          .endUpdate()
      )
      .triggerEnd(),
  ];
};
