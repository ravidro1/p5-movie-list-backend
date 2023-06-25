const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.MY_SQL_HOST,
  user: process.env.MY_SQL_USER,
  password: process.env.MY_SQL_PASSWORD,
  database: process.env.MY_SQL_DATABASE,
  multipleStatements: false,
});

// pool.execute("SET SQL_SAFE_UPDATES = 0;");

module.exports = pool.promise();
