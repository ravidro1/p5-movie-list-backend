const AbstractModel = require("./AbstractModel");
const { _fieldsDataTypes } = require("./Models.Types");

const { Select, Trigger, Update } = require("./statements");

module.exports = class MovieComment extends AbstractModel {
  static fields = {
    ...this.fields,

    content: {
      name: "content",
      type: _fieldsDataTypes.string(6000),
      allowNull: false,
    },
    user_id: {
      name: "user_id",
      type: _fieldsDataTypes.int,
      allowNull: false,
      fk: {
        table: "User",
        onDelete: "CASCADE",
      },
    },
    username: { name: "username", type: _fieldsDataTypes.char(255) },

    movie_id: {
      name: "movie_id",
      type: _fieldsDataTypes.int,
      allowNull: false,
      fk: {
        table: "MovieReview",
        onDelete: "CASCADE",
      },
    },
  };

  static triggers = [
    Trigger.table(this.name)
      .triggerEvent("BEFORE INSERT")
      .triggerName(`${this.name}1`)
      .triggerAction(
        Update.table(this.name)
          .update_equalNotString({
            column: "new.username",
            value: Select.table("User")
              .field_normalColumnOrExpression({
                columnOrExpression: "username",
              })
              .condition_equalNotString({ column: "id", value: "new.user_id" })
              .selectEnd(false),
          })
          .endUpdate(true, false)
      )
      .triggerEnd(),
  ];
};
