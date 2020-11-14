const mysql = require("mysql");
const config = require("config");
const path = require("path");
const sqlFile = path.join(__dirname, config.get("db_init_file"));
const fs = require("fs");

const db_config = {
  host: "localhost",
  user: `${config.get("db_user")}`,
  multipleStatements: true,
};

const connection = mysql.createConnection(db_config);

module.exports.connectToDatabase = function () {
  connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection to db success!");
  });

  const init_db = fs.readFileSync(sqlFile, "utf-8");
  console.log(init_db);

  connection.query(init_db, (err, res) => {
    if (err) throw err;
    console.log("Tables created");
  });
};

module.exports.getDatabase = function () {
  return connection;
};
