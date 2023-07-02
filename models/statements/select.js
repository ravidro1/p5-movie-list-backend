const { checkArrayNull } = require("../../globalFunctions");

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

  static condition_findArrayOfStringInJson = ({
    column,
    values,
    AND_OR = "AND",
  }) => {
    // if (column == null ||values == null || !Array.isArray(values))
    //   throw new Error("values cant be null, values must be array");

    if (column == null)
      throw new Error("values cant be null, values must be array");

    if (!values || (Array.isArray(values) && values.length == 0)) return this;

    values?.forEach((value, index) => {
      this.condition_findStringInJson({ column, value });
    });

    return this;
  };

  static condition_isIncludesString = ({ column, value }) => {
    if (checkArrayNull([column, value])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this.#conditionData)) this.#conditionData = [];
    this.#conditionData.push(`${column} LIKE '%${value}%'`);

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

module.exports = { Select };
