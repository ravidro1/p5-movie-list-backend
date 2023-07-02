///////////

class Trigger {
  static #triggerNameData = null;
  static #eventData = null;
  static #triggerTableData = null;
  static #actionData = null;
  static #conditionData = null;

  //**************** start conditions ***************************//
  // static condition_equalString = ({ column, value }) => {
  //   if (checkArrayNull([column])) throw new Error("column cant be null");

  //   if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
  //   this.#conditionData.push(`${column}='${value}'`);

  //   return this;
  // };

  // static condition_equalNotString = ({ column, value }) => {
  //   if (checkArrayNull([column])) throw new Error("column cant be null");

  //   if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
  //   this.#conditionData.push(`${column}=(${value})`);

  //   return this;
  // };

  // static condition_findStringInJson = ({ column, keyOfJson = null, value }) => {
  //   if (checkArrayNull([column])) throw new Error("column cant be null");

  //   // StringInvalidCharsError(value);

  //   if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
  //   this.#conditionData.push(
  //     `'${value}' MEMBER OF(${column}->> ${
  //       keyOfJson ? `'$.${keyOfJson}'` : `'$'`
  //     })`
  //   );

  //   return this;
  // };

  // static condition_findNumberOrStatementInJson = ({
  //   column,
  //   keyOfJson = null,
  //   value,
  // }) => {
  //   if (checkArrayNull([column])) throw new Error("column cant be null");

  //   // StringInvalidCharsError(value);

  //   if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
  //   this.#conditionData.push(
  //     `${value} MEMBER OF(${column}->> ${
  //       keyOfJson ? `'$.${keyOfJson}'` : `'$'`
  //     })`
  //   );

  //   return this;
  // };

  // static condition_findArrayOfNumberAndStringInJson = ({
  //   column,
  //   values,
  //   AND_OR = "AND",
  // }) => {
  //   if (values == null || !Array.isArray(values))
  //     throw new Error("values cant be null, values must be array");

  //   values?.forEach((value, index) => {
  //     this.findStringInJson({ column, value });
  //   });

  //   return this;
  // };

  // static condition_isIncludesString = ({ column, value }) => {
  //   if (checkArrayNull([column, value])) throw new Error("column cant be null");

  //   // StringInvalidCharsError(value);

  //   if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
  //   this.#conditionData.push(`${key} LIKE '%${value}%'`);

  //   return this;
  // };
  //**************** end conditions ***************************//

  static triggerName = (triggerName) => {
    this.#triggerNameData = triggerName;
    return this;
  };

  static triggerEvent = (event) => {
    this.#eventData = event;
    return this;
  };

  static table = (triggerTable) => {
    this.#triggerTableData = triggerTable;
    return this;
  };

  static triggerAction = (action) => {
    this.#actionData = action;
    return this;
  };

  static returnTrigger = () => {
    return this;
  };

  static triggerEnd = () => {
    const triggerName = this.#triggerNameData;
    const event = this.#eventData;
    const triggerTable = this.#triggerTableData;
    const action = this.#actionData;

    if (checkArrayNull([triggerName, event, triggerTable, action])) return null;

    this.#triggerNameData = null;
    this.#eventData = null;
    this.#triggerTableData = null;
    this.#actionData = null;
    return `CREATE TRIGGER IF NOT EXISTS ${triggerName}
      ${event}
      ON ${triggerTable}
      FOR EACH ROW
      ${action}`;
  };
}

class Insert {
  static #tableNameData = null;
  static #keysArray = null;
  static #valuesArray = null;

  static table = (table) => {
    this.#tableNameData = table;
    return this;
  };

  static keysAndValueObj = (obj) => {
    if (checkArrayNull([obj]))
      throw new Error("There must be at least one cell in the array");

    Object.keys(obj).forEach((key) => {
      if (obj[key] == null) return;
      if (!Array.isArray(this.#keysArray)) this.#keysArray = [];
      this.#keysArray.push(key);
      if (!Array.isArray(this.#valuesArray)) this.#valuesArray = [];
      if (typeof obj[key] == "string") this.#valuesArray.push(`'${obj[key]}'`);
      else this.#valuesArray.push(obj[key]);
    });

    return this;
  };

  static endInsert = (isWithSemicolon = true, INSERT_OR_REPLACE = "INSERT") => {
    const tableName = this.#tableNameData;

    const keys = this.#keysArray;
    const values = this.#valuesArray;

    this.#tableNameData = null;
    this.#keysArray = null;
    this.#valuesArray = null;

    return `${INSERT_OR_REPLACE} INTO ${tableName} (${keys}) VALUES (${values}) ${
      isWithSemicolon ? ";" : ""
    }`;
  };
}

class Update {
  static #updateFieldsData = null;
  static #tableNameData = null;
  static #conditionData = null;
  static #limitData = null;

  //**************** start conditions ***************************//
  static condition_equalString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(`${column}='${value}'`);

    return this;
  };

  static condition_equalNotString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(`${column}=(${value})`);

    return this;
  };

  static condition_findStringInJson = ({ column, keyOfJson = null, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(
      `'${value}' MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  static condition_findNumberOrStatementInJson = ({
    column,
    keyOfJson = null,
    value,
  }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(
      `${value} MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  static condition_findArrayOfNumberAndStringInJson = ({
    column,
    values,
    AND_OR = "AND",
  }) => {
    if (values == null || !Array.isArray(values))
      throw new Error("values cant be null, values must be array");

    values?.forEach((value, index) => {
      this.findStringInJson({ column, value });
    });

    return this;
  };

  static condition_isIncludesString = ({ column, value }) => {
    if (checkArrayNull([column, value])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(`${key} LIKE '%${value}%'`);

    return this;
  };

  static condition_obj = (obj) => {
    if (!obj) throw new Error("obj cant be null");

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "string")
        this.condition_equalString({ column: key, value: obj[key] });
      else this.condition_equalNotString({ column: key, value: obj[key] });
    });

    return this;
  };
  //**************** end conditions ***************************//

  //**************** start updateFields ***************************//

  static update_equalString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(valueValue);

    if (!Array.isArray(this.#updateFieldsData)) this.#updateFieldsData = [];
    this.#updateFieldsData.push(
      `${column}=${value != null ? `'${value}'` : value}`
    );

    return this;
  };

  static update_equalNotString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(valueValue);

    if (!Array.isArray(this.#updateFieldsData)) this.#updateFieldsData = [];
    this.#updateFieldsData.push(`${column}=(${value})`);

    return this;
  };

  // array = [{column, value, isStatement?}]
  // static update_Array = (array) => {
  //   if (!array) throw new Error("obj cant be null");

  //   array.forEach((obj) => {
  //     if (!obj?.column) return;
  //     if (typeof obj?.value == "string" && !obj?.isStatement)
  //       this.update_equalString({ column: obj?.column, value: obj?.value });
  //     else
  //       this.update_equalNotString({ column: obj?.column, value: obj?.value });
  //   });

  //   return this;
  // };

  static update_obj = (obj) => {
    if (!obj) throw new Error("obj cant be null");

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "string")
        this.update_equalString({ column: key, value: obj[key] });
      else this.update_equalNotString({ column: key, value: obj[key] });
    });

    return this;
  };

  //**************** end updateFields ***************************//

  static table = (table) => {
    this.#tableNameData = table;
    return this;
  };

  static limit = (limit) => {
    this.#limitData = limit;
    return this;
  };

  static endUpdate = (isWithSemicolon = true, withUpdateWord = true) => {
    const tableName = this.#tableNameData;
    const limit = this.#limitData;
    let updateFieldsStatement = null;
    let conditionStatement = null;

    this.#updateFieldsData?.map((update, index) => {
      if (index == 0) updateFieldsStatement = "";
      if (index > 0 && updateFieldsStatement) updateFieldsStatement += ", ";
      updateFieldsStatement += update;
    });

    this.#conditionData?.map((condition, index) => {
      if (index == 0) conditionStatement = "";
      if (index > 0 && conditionStatement) conditionStatement += " AND ";
      conditionStatement += condition;
    });

    this.#updateFieldsData = null;
    this.#tableNameData = null;
    this.#conditionData = null;
    this.#limitData = null;

    // console.log();
    return `${
      withUpdateWord ? `UPDATE ${tableName}` : ""
    } SET ${updateFieldsStatement} ${
      conditionStatement ? "WHERE " + conditionStatement : ""
    } ${limit != null ? "LIMIT " + limit : ""}  ${isWithSemicolon ? ";" : ""}`;
  };
}

class Select {
  static #fieldsData = null;
  static #tableNameData = null;
  static #conditionData = null;
  static #limitData = null;
  static #orderByData = null;

  //   static fields = (fields) => {
  //     this.#fieldsData = fields;
  //     return this;
  //   };

  // start fields //
  static field_between = ({
    column,
    firstCell,
    lastCell,
    forCombineFunction = false,
    ifNullThen = null,
  }) => {
    if (checkArrayNull([column, firstCell, lastCell]))
      throw new Error("column, firstCell, lastCell cant be null");

    if (!forCombineFunction) {
      if (!Array.isArray(this.#fieldsData)) this.#fieldsData = [];
      if (ifNullThen != null && !forCombineFunction)
        this.#fieldsData.push(
          `coalesce(${column} BETWEEN ${firstCell} AND ${lastCell},${ifNullThen})`
        );
      else
        this.#fieldsData.push(`${column} BETWEEN ${firstCell} AND ${lastCell}`);
      return this;
    }

    return `${column} BETWEEN ${firstCell} AND ${lastCell}`;
  };

  static field_normalColumnOrExpression = ({
    columnOrExpression,
    ifNullThen = null,
  }) => {
    if (checkArrayNull([columnOrExpression]))
      throw new Error("columnOrExpression cant be null");

    if (!Array.isArray(this.#fieldsData)) this.#fieldsData = [];
    if (ifNullThen != null && !forCombineFunction)
      this.#fieldsData.push(`coalesce(${columnOrExpression},${ifNullThen})`);
    else this.#fieldsData.push(columnOrExpression);
    return this;
  };

  static field_avg = ({
    column,
    forCombineFunction = false,
    ifNullThen = null,
  }) => {
    if (checkArrayNull([column]))
      throw new Error("column, firstCell, lastCell cant be null");

    if (!forCombineFunction) {
      if (!Array.isArray(this.#fieldsData)) this.#fieldsData = [];
      if (ifNullThen != null && !forCombineFunction)
        this.#fieldsData.push(`coalesce(AVG(${column}),${ifNullThen})`);
      else this.#fieldsData.push(`AVG(${column})`);
      return this;
    }
    return (columnPlace) => `AVG(${columnPlace})`;
  };

  static field_sum = ({
    column,
    forCombineFunction = false,
    ifNullThen = null,
  }) => {
    if (checkArrayNull([column]))
      throw new Error("column, firstCell, lastCell cant be null");

    if (!forCombineFunction) {
      if (!Array.isArray(this.#fieldsData)) this.#fieldsData = [];
      if (ifNullThen != null && !forCombineFunction)
        this.#fieldsData.push(`coalesce(SUM(${column}),${ifNullThen})`);
      else this.#fieldsData.push(`SUM(${column})`);
      return this;
    }
    return (columnPlace) => `SUM(${columnPlace})`;
  };

  static field_count = ({
    column,
    forCombineFunction = false,
    ifNullThen = null,
  }) => {
    if (checkArrayNull([column]))
      throw new Error("column, firstCell, lastCell cant be null");

    if (!forCombineFunction) {
      if (!Array.isArray(this.#fieldsData)) this.#fieldsData = [];
      if (ifNullThen != null && !forCombineFunction)
        this.#fieldsData.push(`coalesce(COUNT(${column}),${ifNullThen})`);
      else this.#fieldsData.push(`COUNT(${column})`);
      return this;
    }
    return (columnPlace) => `COUNT(${columnPlace})`;
  };

  static field_lower = ({
    column,
    forCombineFunction = false,
    ifNullThen = null,
  }) => {
    if (checkArrayNull([column]))
      throw new Error("column, firstCell, lastCell cant be null");

    if (!forCombineFunction) {
      if (!Array.isArray(this.#fieldsData)) this.#fieldsData = [];
      if (ifNullThen != null && !forCombineFunction)
        this.#fieldsData.push(`coalesce(LOWER(${column}),${ifNullThen})`);
      else this.#fieldsData.push(`LOWER(${column})`);
      return this;
    }
    return (columnPlace) => `LOWER(${columnPlace})`;
  };

  static field_upper = ({
    column,
    forCombineFunction = false,
    ifNullThen = null,
  }) => {
    if (checkArrayNull([column]))
      throw new Error("column, firstCell, lastCell cant be null");

    if (!forCombineFunction) {
      if (!Array.isArray(this.#fieldsData)) this.#fieldsData = [];
      if (ifNullThen != null && !forCombineFunction)
        this.#fieldsData.push(`coalesce(UPPER(${column}),${ifNullThen})`);
      else this.#fieldsData.push(`UPPER(${column})`);
      return this;
    }
    return (columnPlace) => `UPPER(${columnPlace})`;
  };

  static field_reverse = ({
    column,
    forCombineFunction = false,
    ifNullThen = null,
  }) => {
    if (checkArrayNull([column]))
      throw new Error("column, firstCell, lastCell cant be null");

    if (!forCombineFunction) {
      if (!Array.isArray(this.#fieldsData)) this.#fieldsData = [];
      if (ifNullThen != null && !forCombineFunction)
        this.#fieldsData.push(`coalesce(REVERSE(${column}),${ifNullThen})`);
      else this.#fieldsData.push(`REVERSE(${column})`);
      return this;
    }
    return (columnPlace) => `REVERSE(${columnPlace})`;
  };

  static field_regexReplace = ({
    column,
    from,
    to,
    forCombineFunction = false,
    ifNullThen = null,
  }) => {
    if (checkArrayNull([column, from, to]))
      throw new Error("column cant be null");

    if (!forCombineFunction) {
      if (!Array.isArray(this.#fieldsData)) this.#fieldsData = [];
      if (ifNullThen != null && !forCombineFunction)
        this.#fieldsData.push(
          `coalesce(REGEXP_REPLACE(${column}),${ifNullThen})`
        );
      else this.#fieldsData.push(`REGEXP_REPLACE(${column},"${from}","${to}")`);

      return this;
    }
    return (columnPlace) => `REGEXP_REPLACE(${columnPlace},"${from}","${to}")`;
  };

  static field_combine = ({ column, arrayOfFunctions, ifNullThen = null }) => {
    if (checkArrayNull([column, arrayOfFunctions]))
      throw new Error("column, arrayOfFunctions cant be null");

    let expression = "";

    arrayOfFunctions?.map((func, index) => {
      if (index == 0) expression = func(column);
      else expression = func(expression);
    });

    if (!Array.isArray(this.#fieldsData)) this.#fieldsData = [];
    if (ifNullThen != null && !forCombineFunction)
      this.#fieldsData.push(`coalesce(${expression},${ifNullThen})`);
    else this.#fieldsData.push(expression);
    return this;
  };

  // end fields //

  // start conditions //

  static condition_equalString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    if (ifNullThen != null && !forCombineFunction)
      this.#conditionData.push(`${column}='${value}'`);

    return this;
  };

  static condition_equalNotString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(`${column}=(${value})`);

    return this;
  };

  static condition_findStringInJson = ({ column, keyOfJson = null, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(
      `'${value}' MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  static condition_findNumberOrStatementInJson = ({
    column,
    keyOfJson = null,
    value,
  }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(
      `${value} MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  static condition_findArrayOfNumberAndStringInJson = ({
    column,
    values,
    AND_OR = "AND",
  }) => {
    if (values == null || !Array.isArray(values))
      throw new Error("values cant be null, values must be array");

    values?.forEach((value, index) => {
      this.findStringInJson({ column, value });
    });

    return this;
  };

  static condition_isIncludesString = ({ column, value }) => {
    if (checkArrayNull([column, value])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(`${key} LIKE '%${value}%'`);

    return this;
  };

  static condition_obj = (obj) => {
    if (!obj) throw new Error("obj cant be null");

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "string")
        this.condition_equalString({ column: key, value: obj[key] });
      else this.condition_equalNotString({ column: key, value: obj[key] });
    });

    return this;
  };

  static condition_columnInArrayOfValues = (column, array, AND_OR) => {
    if (!array) throw new Error("array cant be null");

    let statement = `${column} IN (${array.toString()})`;
    if (array.length > 0) {
      if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
      this.#conditionData.push(statement);
    }

    return this;
  };
  // end conditions //

  static table = (table) => {
    this.#tableNameData = table;
    return this;
  };

  static limit = (limit) => {
    this.#limitData = limit;
    return this;
  };

  static orderBy = ({ column, ASC_OR_DESC = "ASC" }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this.#orderByData)) this.#orderByData = [];
    this.#orderByData.push(`${column} ${ASC_OR_DESC}'`);

    return this;
  };

  static selectEnd = (isWithSemicolon = true) => {
    const tableName = this.#tableNameData;
    const limit = this.#limitData;
    let fieldsStatement = null;
    let conditionStatement = null;
    let orderByStatement = null;

    this.#fieldsData?.map((field, index) => {
      if (index == 0) fieldsStatement = "";
      if (index > 0 && fieldsStatement) fieldsStatement += ", ";
      fieldsStatement += field;
    });

    if (fieldsStatement == null) fieldsStatement = "*";

    this.#conditionData?.map((condition, index) => {
      if (index == 0) conditionStatement = "";
      if (index > 0 && conditionStatement) conditionStatement += " AND ";
      conditionStatement += condition;
    });

    this.#orderByData?.map((order, index) => {
      if (index == 0) orderByStatement = "";
      if (index > 0 && orderByStatement) orderByStatement += ", ";
      orderByStatement += order;
    });

    this.#fieldsData = null;
    this.#tableNameData = null;
    this.#conditionData = null;
    this.#limitData = null;
    this.#orderByData = null;

    return `(SELECT ${fieldsStatement} ${
      tableName ? `FROM ${tableName}` : ""
    }  ${conditionStatement ? "WHERE " + conditionStatement : ""} ${
      orderByStatement ? `ORDER BY ${orderByStatement}` : ""
    } ${limit != null ? "LIMIT " + limit : ""} )${isWithSemicolon ? ";" : ""}`;
  };

  //   static returnSelect = () => {
  //     const tableName = this.#tableNameData;
  //     const conditionStatement = this.#conditionData;
  //     const limit = this.#limitData;
  //     const fieldsData = this.#fieldsData;
  //     const semicolon = null;

  //     this.action = `SELECT ${fieldsData} FROM ${tableName}  ${
  //       conditionStatement ? "WHERE " + conditionStatement : ""
  //     } ${limit != null ? "LIMIT " + limit : ""} ${semicolon ? ";" : ""}`;

  //     return this;
  //   };
}

class Delete {
  static #conditionData = null;
  static #tableNameData = null;
  static #limitData = null;

  // start conditions //

  static condition_equalString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(`${column}='${value}'`);

    return this;
  };

  static condition_equalNotString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(`${column}=(${value})`);

    return this;
  };

  static condition_findStringInJson = ({ column, keyOfJson = null, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(
      `'${value}' MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  static condition_findNumberOrStatementInJson = ({
    column,
    keyOfJson = null,
    value,
  }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(
      `${value} MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  static condition_findArrayOfNumberAndStringInJson = ({
    column,
    values,
    AND_OR = "AND",
  }) => {
    if (values == null || !Array.isArray(values))
      throw new Error("values cant be null, values must be array");

    values?.forEach((value, index) => {
      this.findStringInJson({ column, value });
    });

    return this;
  };

  static condition_isIncludesString = ({ column, value }) => {
    if (checkArrayNull([column, value])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(`${key} LIKE '%${value}%'`);

    return this;
  };

  static condition_obj = (obj) => {
    if (!obj) throw new Error("array cant be null");

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "string")
        this.condition_equalString({ column: key, value: obj[key] });
      else this.condition_equalNotString({ column: key, value: obj[key] });
    });

    return this;
  };
  // end conditions //

  static table = (table) => {
    this.#tableNameData = table;
    return this;
  };

  static limit = (limit) => {
    this.#limitData = limit;
    return this;
  };

  static endDelete = (isWithSemicolon = true) => {
    const tableName = this.#tableNameData;
    const limit = this.#limitData;
    let conditionStatement = null;

    this.#conditionData?.map((condition, index) => {
      if (index == 0) conditionStatement = "";
      if (index > 0 && conditionStatement) conditionStatement += " AND ";
      conditionStatement += condition;
    });

    this.#conditionData = null;
    this.#tableNameData = null;
    this.#limitData = null;

    return `DELETE FROM ${tableName} ${
      conditionStatement != null ? "WHERE " + conditionStatement : ""
    } ${limit != null ? "LIMIT " + limit : ""} ${isWithSemicolon ? ";" : ""}`;
  };
}

async function main2() {
  // const test = { id: 4, column: 6 };
  // console.log(
  //   Update.update_Array([
  //     { column: "id", value: 4 },
  //     { column: "column1", value: "dsadsa" },
  //     { column: "column2", value: "select", isStatement: true },
  //   ]).endUpdate()
  // );
  // console.log(
  //   Insert.keysAndValueObj({ id: 5, name: "joe", statement: "hey" }).endInsert()
  // );
}

module.exports = { Trigger, Delete, Insert, Select, Update, main2 };

const checkArrayNull = (array) => {
  if (!Array.isArray(array)) return true;

  let returnValue = false;
  array.forEach((item) => {
    if (item == null) returnValue = true;
  });

  return returnValue;
};

// ArrayInvalidCharsError([firstCell, lastCell]);
