const AbstractModel = require("./AbstractModel");
const { oneField, _fieldsDataTypes } = require("./fields");

const { Select, Trigger, Update } = require("./statements");

module.exports = class MovieReview extends AbstractModel {
  static fields = {
    ...this.fields,

    name: oneField({
      name: "name",
      type: _fieldsDataTypes.char(255),
      unique: true,
      allowNull: false,
    }),
    normalizeName: oneField({
      name: "normalizeName",
      type: _fieldsDataTypes.char(255),
      unique: true,
      // allowNull: false,
    }),
    averageRateScore: oneField({
      name: "averageRateScore",
      type: _fieldsDataTypes.float,
      defaultValue: 0,
      allowNull: false,
    }),

    numberOfRate: oneField({
      name: "numberOfRate",
      type: _fieldsDataTypes.int,
      defaultValue: 0,
      allowNull: false,
    }),
    description: oneField({
      name: "description",
      type: _fieldsDataTypes.string(4000),
    }),
    categories: oneField({ name: "categories", type: _fieldsDataTypes.json }),
    releaseDate: oneField({ name: "releaseDate", type: _fieldsDataTypes.date }),
    pictureURL: oneField({
      name: "pictureURL",
      type: _fieldsDataTypes.string(4000),
    }),
  };

  static triggers = [
    Trigger.table(this.name)
      .triggerEvent("BEFORE INSERT")
      .triggerName(`${this.name}1`)
      .triggerAction(
        Update.table(this.name)
          .update_equalStatement({
            column: "new.normalizeName",
            value: Select.table(this.name)
              .field_combine({
                column: "new.name",
                arrayOfFunctions: [
                  Select.field_lower({
                    forCombineFunction: true,
                    column: "new.name",
                  }),
                  Select.field_regexReplace({
                    forCombineFunction: true,
                    column: "new.name",
                    from: "[^0-9a-zA-Z ]",
                    to: "",
                  }),
                ],
              })
              .condition_equalStatement({ column: "id", value: "new.id" })
              .selectEnd(false),
          })
          .endUpdate(true, false)
      )
      .triggerEnd(),

    Trigger.table(this.name)
      .triggerEvent("BEFORE UPDATE")
      .triggerName(`${this.name}2`)
      .triggerAction(
        Update.table(this.name)
          .update_equalStatement({
            column: "new.normalizeName",
            value: Select.table(this.name)
              .field_combine({
                column: "new.name",
                arrayOfFunctions: [
                  Select.field_lower({
                    forCombineFunction: true,
                    column: "new.name",
                  }),
                  Select.field_regexReplace({
                    forCombineFunction: true,
                    column: "new.name",
                    from: "[^0-9a-zA-Z ]",
                    to: "",
                  }),
                ],
              })
              .condition_equalStatement({ column: "id", value: "new.id" })
              .selectEnd(false),
          })
          .endUpdate(true, false)
      )
      .triggerEnd(),
  ];
};
