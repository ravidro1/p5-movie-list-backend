



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