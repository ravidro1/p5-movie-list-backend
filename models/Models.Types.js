const {
  StringInvalidCharsError,
  ArrayInvalidCharsError,
} = require("../globalFunctions");

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

const _conditionTypes = {
  between: ({ key, firstCell, lastCell }) => {
    if (!key || !firstCell || !lastCell) return null;
    ArrayInvalidCharsError([firstCell, lastCell]);

    if (typeof firstCell == "string" || typeof lastCell == "string")
      throw new Error("firstCell And lastCell must be number");
    return ` ${key} BETWEEN ${firstCell} AND ${lastCell} `;
  },

  equal: ({
    key: { isKeyString = false, keyValue },
    value: { isValueString = false, valueValue },
  }) => {
    if (keyValue == null || valueValue == null) return null;

    StringInvalidCharsError(valueValue);

    const keyStatement = isKeyString ? `'${keyValue}'` : `${keyValue}`;
    const valueStatement = isValueString
      ? `'${valueValue}'`
      : `(${valueValue})`;
    return ` ${keyStatement}=${valueStatement}`;
  },

  findArrayInJson: ({ field, values, AND_OR = "AND" }) => {
    if (values == null || !Array.isArray(values)) return null;

    return values?.map((value, index) => {
      let returnValue = _conditionTypes.findStringInJson({
        field,
        value,
      });
      if (index > 0 && index < values.length - 1) returnValue += ` ${AND_OR} `;
      return returnValue;
    });
  },

  findStringInJson: ({ field, keyOfJson = null, value }) => {
    if (field == null || value == null) return null;

    StringInvalidCharsError(value);

    return `'${value}' MEMBER OF(${field}->> ${
      keyOfJson ? `'$.${keyOfJson}'` : `'$'`
    })`;
  },

  findNumberInJson: ({ field, keyOfJson = null, value }) => {
    if (field == null || value == null) return null;

    StringInvalidCharsError(value);

    return `${value} MEMBER OF(${field}->> ${
      keyOfJson ? `'$.${keyOfJson}'` : `'$'`
    })`;
  },

  isIncludesString: ({ key, value }) => {
    if (key == null || value == null) return null;

    StringInvalidCharsError(value);

    return ` ${key} LIKE '%${value}%'`;
  },
};

const _updateTypes = {
  equal: ({
    key: { isKeyString = false, keyValue },
    value: { isValueString = false, valueValue },
  }) => {
    if (keyValue == null || valueValue == null) return null;

    StringInvalidCharsError(valueValue);

    const keyStatement = isKeyString ? `'${keyValue}'` : `${keyValue}`;
    const valueStatement = isValueString
      ? `'${valueValue}'`
      : `(${valueValue})`;

    return ` ${keyStatement}=${valueStatement}`;
  },
};

const _statementTypes = {
  insert: ({ INSERT_OR_REPLACE = "INSERT", tableName, values }) => {
    const keysInString = Object.keys(values).toString();
    const valuesInString = Object.values(values)
      .map((value) => {
        StringInvalidCharsError(value);
        return `${value == null ? null : `'${value}'`}`;
      })
      .toString();

    return `${INSERT_OR_REPLACE} INTO ${tableName} (${keysInString}) VALUES (${valuesInString});`;
  },

  selectFrom: ({
    tableName,
    arrayOfFields = null,
    objConditions = null,
    statementConditions = null,
    limit = null,
    nullable = true,
    semicolon = true,
    orderBy = null,
  }) => {
    let conditionStatement = generateConditions(
      objConditions,
      statementConditions
    );
    let formatFields = arrayOfFields?.map((field) =>
      nullable ? field : `coalesce(${field},0)`
    );

    formatFields = arrayOfFields?.length > 0 ? formatFields : "*";

    return `SELECT ${formatFields} FROM ${tableName}  ${
      conditionStatement ? "WHERE " + conditionStatement : ""
    } ${limit != null ? "LIMIT " + limit : ""} ${semicolon ? ";" : ""}`;
  },

  select: ({ formatFields, semicolon }) => {
    return `SELECT ${formatFields} ${semicolon ? ";" : ""}`;
  },

  update: ({
    tableName,
    objFieldForUpdate = null,
    statementFieldForUpdate = null,
    objConditions = null,
    statementConditions = null,
    limit = null,
    semicolon = true,
    withUpdateWord = true,
  }) => {
    let updateStatement = generateUpdateFields(
      objFieldForUpdate,
      statementFieldForUpdate
    );
    let conditionStatement = generateConditions(
      objConditions,
      statementConditions
    );

    return `${
      withUpdateWord ? `UPDATE ${tableName}` : ""
    } SET ${updateStatement} ${
      conditionStatement ? "WHERE " + conditionStatement : ""
    } ${limit != null ? "LIMIT " + limit : ""}  ${semicolon ? ";" : ""}`;
  },

  delete: ({
    tableName,
    objConditions = null,
    statementConditions = null,
    limit = null,
    semicolon = true,
  }) => {
    let conditionStatement = generateConditions(
      objConditions,
      statementConditions
    );

    return `DELETE FROM ${tableName} ${
      conditionStatement != null ? "WHERE " + conditionStatement : ""
    } ${limit != null ? "LIMIT " + limit : ""} ${semicolon ? ";" : ""}`;
  },

  trigger: ({ triggerName, event, triggerTable, action }) => {
    return `CREATE TRIGGER IF NOT EXISTS ${triggerName}
      ${event}
      ON ${triggerTable}
      FOR EACH ROW
      ${action}`;
  },
};

const _selectFieldTypes = {
  avg: (field) => {
    return `AVG(${field})`;
  },
  sum: (field) => {
    return `SUM(${field})`;
  },
  count: (field) => {
    return `COUNT(${field})`;
  },
  lower: (field) => {
    return `LOWER(${field})`;
  },
  upper: (field) => {
    return `UPPER(${field})`;
  },
  reverse: (field) => {
    return `REVERSE(${field})`;
  },
  regexReplace: ({ field, from, to }) => {
    return `REGEXP_REPLACE(${field},"${from}","${to}")`;
  },
};

module.exports = {
  _conditionTypes,
  _fieldsDataTypes,
  _updateTypes,
  _statementTypes,
  _selectFieldTypes,
};

const generateConditions = (
  objConditions = null,
  statementConditions = null
) => {
  let conditionsArray = [];
  if (Array.isArray(statementConditions))
    conditionsArray = [...statementConditions];

  if (objConditions) {
    Object.keys(objConditions).forEach((key, index) => {
      StringInvalidCharsError(objConditions[key]);
      if (objConditions[key] == null) return;

      conditionsArray.push(`${key}='${objConditions[key]}'`);
    });
  }
  // undefined

  let conditionsStatement = "";

  if (conditionsArray) {
    conditionsArray?.forEach((condition, index) => {
      if (condition != null) {
        if (index > 0 && conditionsStatement) conditionsStatement += " AND ";
        conditionsStatement += condition;
      }
    });
  }

  return conditionsStatement;
};

const generateUpdateFields = (
  objFieldForUpdate = null,
  statementFieldForUpdate = null
) => {
  let updateFieldsArray = [];
  if (Array.isArray()) updateFieldsArray = [...statementFieldForUpdate];

  if (objFieldForUpdate) {
    Object.keys(objFieldForUpdate).forEach((key) => {
      StringInvalidCharsError(objFieldForUpdate[key]);
      if (objFieldForUpdate[key] == null) return;
      updateFieldsArray.push(`${key}='${objFieldForUpdate[key]}'`);
    });
  }

  let updateFieldStatement = "";

  if (updateFieldsArray) {
    updateFieldsArray?.forEach((update, index) => {
      if (update != null) {
        if (index > 0 && updateFieldStatement) updateFieldStatement += ", ";
        updateFieldStatement += update;
      }
    });
  }

  return updateFieldStatement;
};
