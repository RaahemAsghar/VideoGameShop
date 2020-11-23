const mysql = require("mysql2");
const config = require("config");
const path = require("path");
const sqlFile = path.join(__dirname, config.get("db_init_file"));
const fs = require("fs");

// const db_config = {
//   host: "localhost",
//   user: `${config.get("db_user")}`,
//   multipleStatements: true,
// };

const db_config = {
  host: "www.vgs.educationhost.cloud",
  user: "qmkvilgx_vgs",
  multipleStatements: true,
  database:"qmkvilgx_vgs",
  password:"VideoGameShop123"
};



var connection = mysql.createConnection(db_config);

module.exports.connectToDatabase = function () {
  console.log("Connection to db success!");

  const init_db = fs.readFileSync(sqlFile, "utf-8");

  connection.query(init_db, (err, res) => {
    if (err) throw err;
    console.log("Tables created");
  });
};

module.exports.getDatabase = function () {
  return connection;
};
