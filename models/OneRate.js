const AbstractModel = require("./AbstractModel");
const { _fieldsDataTypes } = require("./Models.Types");
const { Trigger, Update, Select } = require("./statement");

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
    Trigger.table(this.name)
      .triggerEvent("AFTER UPDATE")
      .triggerName(`${this.name}1`)
      .triggerAction(
        Update.table("MovieReview")
          .condition_equalNotString({
            column: "moviereview.id",
            value: "new.movie_id",
          })
          .update_equalNotString({
            column: "averageRateScore",
            value: Select.table(this.name)
              .field_avg({ column: "rate", ifNullThen: 0 })
              .condition_equalNotString({
                column: "onerate.movie_id",
                value: "moviereview.id",
              })
              .selectEnd(false),
          })
          .update_equalNotString({
            column: "numberOfRate",
            value: Select.table(this.name)
              .field_count({ column: "rate", ifNullThen: 0 })
              .condition_equalNotString({
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
          .condition_equalNotString({
            column: "moviereview.id",
            value: "new.movie_id",
          })
          .update_equalNotString({
            column: "averageRateScore",
            value: Select.table(this.name)
              .field_avg({ column: "rate", ifNullThen: 0 })
              .condition_equalNotString({
                column: "onerate.movie_id",
                value: "moviereview.id",
              })
              .selectEnd(false),
          })
          .update_equalNotString({
            column: "numberOfRate",
            value: Select.table(this.name)
              .field_count({ column: "rate", ifNullThen: 0 })
              .condition_equalNotString({
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
          .condition_equalNotString({
            column: "moviereview.id",
            value: "old.movie_id",
          })
          .update_equalNotString({
            column: "averageRateScore",
            value: Select.table(this.name)
              .field_avg({ column: "rate", ifNullThen: 0 })
              .condition_equalNotString({
                column: "movie_id",
                value: "moviereview.id",
              })
              .selectEnd(false),
          })
          .update_equalNotString({
            column: "numberOfRate",
            value: Select.table(this.name)
              .field_count({ column: "rate", ifNullThen: 0 })
              .condition_equalNotString({
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
