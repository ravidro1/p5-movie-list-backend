const AbstractModel = require("./AbstractModel");
const { oneField, _fieldsDataTypes, fkField } = require("./fields");
const { Select, Trigger, Update } = require("./statements");

module.exports = class MovieComment extends AbstractModel {
  static fields = {
    ...this.fields,

    content: oneField({
      name: "content",
      type: _fieldsDataTypes.string(6000),
      allowNull: false,
    }),
    user_id: oneField({
      name: "user_id",
      type: _fieldsDataTypes.int,
      allowNull: false,
      fk: fkField({ table: "User", onDelete: "CASCADE" }),
    }),
    username: oneField({ name: "username", type: _fieldsDataTypes.char(255) }),

    movie_id: oneField({
      name: "movie_id",
      type: _fieldsDataTypes.int,
      allowNull: false,
      fk: fkField({ table: "MovieReview", onDelete: "CASCADE" }),
    }),
  };

  static triggers = [
    Trigger.table(this.name)
      .triggerEvent("BEFORE INSERT")
      .triggerName(`${this.name}1`)
      .triggerAction(
        Update.table(this.name)
          .update_equalStatement({
            column: "new.username",
            value: Select.table("User")
              .field_normalColumnOrExpression({
                columnOrExpression: "username",
              })
              .condition_equalStatement({ column: "id", value: "new.user_id" })
              .selectEnd(false),
          })
          .endUpdate(true, false)
      )
      .triggerEnd(),
  ];
};
