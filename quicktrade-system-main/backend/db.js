const sql = require("mssql");

const config = {
  user: "sa",
  password: "123456",
  server: "localhost",
  database: "quicktrade",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

sql.connect(config)
  .then(() => console.log("SQL Server Connected"))
  .catch(err => console.log("DB error:", err));

module.exports = sql;