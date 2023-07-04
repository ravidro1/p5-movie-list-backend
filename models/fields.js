const _fieldsDataTypes = {
  json: "JSON",
  char: (size) => `CHAR(${size})`,
  string: (size) => `VARCHAR(${size})`,
  int: "INT",
  float: "FLOAT",
  date: "DATE",
  date_timestamp: "TIMESTAMP",
  date_timestamp_create: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  date_timestamp_update:
    "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
  boolean: "BOOLEAN",
};

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
