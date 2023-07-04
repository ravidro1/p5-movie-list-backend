const { checkArrayNotNull } = require("../../globalFunctions");
const Condition = require("./conditions");

class Select extends Condition {
  #fieldsData = null;
  #tableNameData = null;
  #limitData = null;
  #orderByData = null;

  constructor() {
    super();
  }

  // start fields //
  field_between = ({
    column,
    firstCell,
    lastCell,
    forCombineFunction = false,
    ifNullThen = null,
  }) => {
    if (checkArrayNotNull([column, firstCell, lastCell]))
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

  field_normalColumnOrExpression = ({
    columnOrExpression,
    ifNullThen = null,
  }) => {
    if (checkArrayNotNull([columnOrExpression]))
      throw new Error("columnOrExpression cant be null");

    if (!Array.isArray(this.#fieldsData)) this.#fieldsData = [];
    if (ifNullThen != null && !forCombineFunction)
      this.#fieldsData.push(`coalesce(${columnOrExpression},${ifNullThen})`);
    else this.#fieldsData.push(columnOrExpression);
    return this;
  };

  field_avg = ({ column, forCombineFunction = false, ifNullThen = null }) => {
    if (checkArrayNotNull([column]))
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

  field_sum = ({ column, forCombineFunction = false, ifNullThen = null }) => {
    if (checkArrayNotNull([column]))
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

  field_count = ({ column, forCombineFunction = false, ifNullThen = null }) => {
    if (checkArrayNotNull([column]))
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

  field_lower = ({ column, forCombineFunction = false, ifNullThen = null }) => {
    if (checkArrayNotNull([column]))
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

  field_upper = ({ column, forCombineFunction = false, ifNullThen = null }) => {
    if (checkArrayNotNull([column]))
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

  field_reverse = ({
    column,
    forCombineFunction = false,
    ifNullThen = null,
  }) => {
    if (checkArrayNotNull([column]))
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

  field_regexReplace = ({
    column,
    from,
    to,
    forCombineFunction = false,
    ifNullThen = null,
  }) => {
    if (checkArrayNotNull([column, from, to]))
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

  field_combine = ({ column, arrayOfFunctions, ifNullThen = null }) => {
    if (checkArrayNotNull([column, arrayOfFunctions]))
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

  table = (table) => {
    this.#tableNameData = table;
    return this;
  };

  limit = (limit) => {
    this.#limitData = limit;
    return this;
  };

  orderBy = ({ column, ASC_OR_DESC = "ASC" }) => {
    if (checkArrayNotNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this.#orderByData)) this.#orderByData = [];
    this.#orderByData.push(`${column} ${ASC_OR_DESC}`);

    return this;
  };

  // [obj = {<column>: <ASC_OR_DESC>}]
  orderByObj = (obj) => {
    if (typeof obj != "object") return this;

    Object.keys(obj).forEach((key) => {
      if (!Array.isArray(this.#orderByData)) this.#orderByData = [];
      this.#orderByData.push(`${key} ${obj[key]}`);
    });

    return this;
  };

  selectEnd = (isWithSemicolon = true) => {
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

    this._conditionData?.map((condition, index) => {
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
    this._conditionData = null;
    this.#limitData = null;
    this.#orderByData = null;

    return `(SELECT ${fieldsStatement} ${
      tableName ? `FROM ${tableName}` : ""
    }  ${conditionStatement ? "WHERE " + conditionStatement : ""} ${
      orderByStatement ? `ORDER BY ${orderByStatement}` : ""
    } ${limit != null ? "LIMIT " + limit : ""} )${isWithSemicolon ? ";" : ""}`;
  };
}

const newSelect = new Select();
module.exports = newSelect;
