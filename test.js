const { checkArrayNull } = require("./globalFunctions");

class con {
  _conditionData = null;

  // start conditions //

  condition_equalString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(`${column}='${value}'`);

    return this;
  };

  condition_equalNotString = ({ column, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(`${column}=(${value})`);

    return this;
  };

  condition_findStringInJson = ({ column, keyOfJson = null, value }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(
      `'${value}' MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  condition_findNumberOrStatementInJson = ({
    column,
    keyOfJson = null,
    value,
  }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(
      `${value} MEMBER OF(${column}->> ${
        keyOfJson ? `'$.${keyOfJson}'` : `'$'`
      })`
    );

    return this;
  };

  condition_findArrayOfStringInJson = ({ column, values, AND_OR = "AND" }) => {
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

  condition_isIncludesString = ({ column, value }) => {
    if (checkArrayNull([column, value])) throw new Error("column cant be null");

    // StringInvalidCharsError(value);

    if (!Array.isArray(this._conditionData)) this._conditionData = [];
    this._conditionData.push(`${column} LIKE '%${value}%'`);

    return this;
  };

  condition_obj = (obj) => {
    if (!obj) throw new Error("obj cant be null");

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "string")
        this.condition_equalString({ column: key, value: obj[key] });
      else this.condition_equalNotString({ column: key, value: obj[key] });
    });

    return this;
  };

  condition_columnInArrayOfValues = (column, array, AND_OR) => {
    if (!array) throw new Error("array cant be null");

    let statement = `${column} IN (${array.toString()})`;
    if (array.length > 0) {
      if (!Array.isArray(this._conditionData)) this._conditionData = [];
      this._conditionData.push(statement);
    }

    return this;
  };
  // end conditions //

  loadThis = () => {
    return { ...se, ...this };
  };
}

class se extends con {
  constructor() {
    super();
  }
  #fieldsData = null;
  #tableNameData = null;
  #limitData = null;
  #orderByData = null;

  table = (table) => {
    this.#tableNameData = table;
    return this;
  };

  limit = (limit) => {
    this.#limitData = limit;
    return this;
  };

  orderBy = ({ column, ASC_OR_DESC = "ASC" }) => {
    if (checkArrayNull([column])) throw new Error("column cant be null");

    if (!Array.isArray(this.#orderByData)) this.#orderByData = [];
    this.#orderByData.push(`${column} ${ASC_OR_DESC}'`);

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

const main2 = () => {
  //   const select = { ...new se(), ...con };
  const ns = new se();
  console.log(
    // se.condition_equalNotString({ column: "ds", value: 1 })
    // select.condition_equalString({ column: "dsad", value: "ds" }).selectEnd()
    // select.condition_equalString({ column: "dsad", value: "dsada" }).selectEnd()
    ns.condition_equalString({ column: "dsa", value: "das" }).selectEnd()
  );
};

module.exports = main2;
