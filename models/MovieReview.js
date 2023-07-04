const AbstractModel = require("./AbstractModel");
const { _fieldsDataTypes } = require("./Models.Types");

const { Select, Trigger, Update } = require("./statements");

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
    pictureURL: { name: "pictureURL", type: _fieldsDataTypes.string(4000) },
  };

  static rules = {};

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
