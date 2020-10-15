const mysql = require("mysql");
const config = require("config");

const connection = mysql.createConnection({
  host: "localhost",
  user: `${config.get("db_user")}`,
});

module.exports.connectToDatabase = function () {
  connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection to db success!");
  });

  const createDBq = `CREATE DATABASE IF NOT EXISTS ${config.get("db_name")}`;

  connection.query(createDBq, (err, result) => {
    if (err) throw err;
    console.log("Database Connected!");
  });

  const usedb = `USE ${config.get("db_name")}`;
  connection.query(usedb, (err, res) => {
    if (err) throw err;
    console.log("Using VGS");
  });
};

module.exports.getDatabase = function () {
  return connection;
};
