const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;
const resetSession = require("../middleware/middlewares").resetSession;
const mysql = require("mysql2");
var exec = require("child_process").exec;
const fs = require("fs");
const spawn = require("child_process").spawn;
const dumpFileName = `vgs.dump.sql`;
const config = require("config");
const moment = require("moment");
const request = require("request");
function multiply() {
  a = Number(document.profit.people.value);
  b = Number(document.profi.price.value);
  c = a * b;
  document.profit.total.value = c;
}

module.exports.getCustomers = (req, res) => {
  const getCustomersQ =
    "SELECT id, first_name, last_name, email, address FROM user";
  const db = getDatabase();
  db.query(getCustomersQ, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.render("admin/customers", { data: result });
  });
};

module.exports.adminLoginGET = function (req, res) {
  if (req.session.isAuth) {
    res.redirect("/admin");
    res.end();
  } else {
    res.render("login", { msg: req.flash("login_msg"), type: "admin" });
  }
};

module.exports.adminLoginPOST = async (req, res) => {
  const { username, password } = req.body;

  const error = [];

  const password_check = `SELECT * FROM admin WHERE email = '${username}'`;
  var db = getDatabase();
  const [rows, fields] = await db.promise().query(password_check);

  if (rows.length > 0) {
    const queried_pass = rows[0].password;
    db = getDatabase();
    const pass_cmpare = await bcrypt.compare(password, queried_pass);
    if (pass_cmpare) {
      req.session.isAdmin = true;
      req.session.isAuth = true;
      res.redirect("/admin/dashboard");
    } else {
      error.push("Your password does not match your Email");
      req.flash("login_msg", error);
      res.redirect("/admin/login");
    }
  } else {
    error.push(
      "There is no user with this email, You might want to create an account"
    );
    req.flash("login_msg", error);
    res.redirect("/admin/login");
  }

  res.end();
};

module.exports.adminLogout = function (req, res) {
  resetSession(req, res);
  res.redirect("/admin/login");
};

module.exports.getDashboard = async (req, res) => {
  const totalsq = `SELECT COUNT(*) AS total_games FROM game;
                  SELECT COUNT(*) AS total_consoles FROM console;
                  SELECT COUNT(*) AS total_customers FROM user;`;
  const db = getDatabase();

  db.query(totalsq, (err, result) => {
    if (err) throw err;
    res.render("admin/dashboard", {
      msg: req.flash("admin_msg"),
      total_games: result[0][0].total_games,
      total_consoles: result[1][0].total_consoles,
      total_customers: result[2][0].total_customers,
    });
  });
};

module.exports.backup = async (req, res) => {
  const currDateTime = new Date();
  const backupfile =
    moment().format("D-M-Y-h-mm-ssa").toString() + "-vgsbackup.sql";

  const mysqldump = require("mysqldump");

  req.flash("admin_msg", {
    type: "alert-success",
    msg: "Database was backed up!",
  });

  const db_config = config.get("db_config_azure");

  mysqldump({
    connection: db_config,
    dumpToFile: backupfile,
  });

  res.redirect("/admin");
};
module.exports.showProfitForm = function (req, res) {
  //console.log(req.body);
  res.render("admin/profit");
};
module.exports.Profit = function (req, res) {
  //console.log(req.body)
  var start = mysql.escape(req.body.start);
  var end = mysql.escape(req.body.end);
  //console.log(start)
  //console.log(end)
  const add_query = `SELECT id, product_id, user_id, price, DATE_FORMAT(date_of_purchase, "%d/%m/%Y") as date, Type_of_transaction FROM transaction_history WHERE date_of_purchase BETWEEN ${start} AND ${end} ORDER BY date`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    else {
      const add_query_2 = `SELECT id, product_id, user_id, sum(price) as revenue, DATE_FORMAT(date_of_purchase, "%d/%m/%Y") as date, Type_of_transaction FROM transaction_history WHERE date_of_purchase BETWEEN ${start} AND ${end} ORDER BY date`;
      db.query(add_query_2, (err, result2) => {
        if (err) throw err;
        res.render("admin/showProfit", { data: result, data2: result2 });
      });
    }
  });
};
module.exports.showProfit = function (req, res) {
  res.render("admin/showProfit");
};
module.exports.showTrans = function (req, res) {
  //console.log(req.body)
  const add_query = `SELECT id, product_id, user_id, price, DATE_FORMAT(date_of_purchase, "%d/%m/%Y") as date, Type_of_transaction FROM transaction_history`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    res.render("admin/showTrans", { data: result });
  });
};
module.exports.sortTransDate = function (req, res) {
  //console.log(req.body)
  const add_query = `SELECT id, product_id, user_id, price, DATE_FORMAT(date_of_purchase, "%d/%m/%Y") as date, Type_of_transaction FROM transaction_history ORDER BY date_of_purchase`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    res.render("admin/showTrans", { data: result });
  });
};
module.exports.sortTransPrice = function (req, res) {
  //console.log(req.body)
  const add_query = `SELECT id, product_id, user_id, price, DATE_FORMAT(date_of_purchase, "%d/%m/%Y") as date, Type_of_transaction FROM transaction_history ORDER BY cast(price as unsigned) DESC`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    res.render("admin/showTrans", { data: result });
  });
};
module.exports.groupbyTrans = function (req, res) {
  //console.log(req.body)
  const add_query = `SELECT COUNT(Type_of_transaction) as number, SUM(cast(price as unsigned)) as sum, Type_of_transaction FROM transaction_history GROUP BY Type_of_transaction`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    res.render("admin/groupbyTrans", { data: result });
  });
};

//Game Controllers
module.exports.showAddGameForm = function (req, res) {
  var query = `SELECT * from category`;
  var db = getDatabase();
  db.query(query, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.render("admin/games/add-game", {
      categories: result,
      msg: req.flash("add_game_msg"),
    });
  });
};

module.exports.addGame = async (req, res) => {
  console.log("body", req.body);

  //console.log(title)
  const stock = 0;
  var {
    title,
    description,
    tags,
    sale_price,
    rent_price,
    platform,
    image,
    categories,
  } = req.body;
  title = mysql.escape(title);
  description = mysql.escape(description);
  tags = mysql.escape(tags);
  sale_price = mysql.escape(sale_price);
  rent_price = mysql.escape(rent_price);
  platform = mysql.escape(platform);
  image = mysql.escape(image);
  const add_query = `INSERT INTO game
    (title, description, tags, sale_price, rent_price, platform, image_url, stock)
     VALUES 
     (${title},
      ${description},
       ${tags},
        ${sale_price},
         ${rent_price},
          ${platform}, ${image}, ${stock});`;

  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) {
      req.flash("add_game_msg", {
        msg: "An Error occured! Please Try Again.",
        type: "alert-danger",
      });
      res.redirect("/admin/add-game");
    }
    if (!err) {
      req.flash("add_game_msg", {
        msg: "Successfully added game.",
        type: "alert-success",
      });
      res.redirect("/admin/add-game");
    }
    console.log("Item added!");
    console.log(result);
    categories = [...categories];
    categories.forEach((element) => {
      var addc = `INSERT INTO game_category VALUES(${result.insertId},${element})`;
      db.query(addc, (err, result2) => {
        if (err) throw err;
      });
    });
  });
};

//req.flash("login_msg", "Item added successfully!");

module.exports.deleteGame = async (req, res) => {
  console.log("delete game", req.params.id);

  const deleteQuer = `DELETE FROM game WHERE id = ${req.params.id}`;

  const db = getDatabase();

  db.query(deleteQuer, (err, res) => {
    if (err) throw err;
  });

  req.flash("all_games_msg", {
    msg: "Successfully Deleted the game!",
    type: "alert-success",
  });

  res.redirect("/admin/all-games");
};

module.exports.allGames = (req, res) => {
  const add_query = `SELECT * FROM game ORDER BY id DESC`;
  var db = getDatabase();

  db.query(add_query, (err, result) => {
    if (err) throw err;
    //console.log(result);
    res.render("admin/games/all-games", {
      data: result,
      msg: req.flash("all_games_msg"),
    });
  });
};

module.exports.getAddStockGame = async (req, res) => {
  const get_stock_q = "SELECT id, title,stock FROM game ORDER BY id DESC";

  const db = getDatabase();

  const [rows, fields] = await db.promise().query(get_stock_q);

  res.render("admin/games/add-stock", {
    msg: req.flash("error_updating_game_stock"),
    data: rows,
  });
};
module.exports.addStockGame = async (req, res) => {
  const { game_id, stock } = req.body;

  const check_q = `SELECT COUNT(*) AS n_id, stock FROM game WHERE id = ${game_id}`;
  var db = getDatabase();
  const [rows, fields] = await db.promise().query(check_q);

  if (rows[0].n_id == "0") {
    const err_msg = {
      msg: "Game does not exist",
      type: "alert-danger",
    };
    req.flash("error_updating_game_stock", err_msg);
  } else {
    const total = parseInt(stock) + parseInt(rows[0].stock);
    const update_stock = `UPDATE game SET stock = ${total} WHERE id = ${game_id}`;
    const succ_msg = {
      msg: "Stock updated",
      type: "alert-success",
    };
    req.flash("error_updating_game_stock", succ_msg);

    db.query(update_stock, (err, res) => {
      if (err) throw err;

      console.log("Stock Updated.");
    });
  }

  res.redirect("/admin/add-stock-game");
};

//End Game Controllers

//Console Controllers
module.exports.showAddConsoleForm = async (req, res) => {
  const get_manq = "SELECT * FROM manufacturer";
  const db = getDatabase();

  const [rows, fields] = await db.promise().query(get_manq);

  console.log(rows);

  res.render("admin/consoles/add-console", {
    manufacturers: rows,
    msg: req.flash("add_console_msg"),
  });
};

module.exports.addConsole = (req, res) => {
  var { name, sale_price, image, tags, description, manufacturer } = req.body;
  const stock = 0;

  name = mysql.escape(name);
  sale_price = mysql.escape(sale_price);
  image = mysql.escape(image);
  tags = mysql.escape(tags);
  description = mysql.escape(description);
  manufacturer = mysql.escape(manufacturer);

  const add_query = `INSERT INTO console
    (name, description, tags, sale_price,image_url, stock,manufacturer_id) 
    VALUES 
    (${name}, ${description}, ${tags}, ${sale_price}, ${image},${stock}, ${manufacturer})`;

  const db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) {
      req.flash("add_console_msg", {
        msg: "An Error occured! Please Try Again.",
        type: "alert-danger",
      });
      res.redirect("/admin/add-console");
    }
    if (!err) {
      req.flash("add_console_msg", {
        msg: "Successfully added console.",
        type: "alert-success",
      });
      res.redirect("/admin/add-console");
    }
  });
};

module.exports.deleteConsole = async (req, res) => {
  console.log("delete console", req.params.id);

  const deleteQuer = `DELETE FROM console WHERE id = ${req.params.id}`;

  const db = getDatabase();

  db.query(deleteQuer, (err, res) => {
    if (err) throw err;
  });

  req.flash("all_consoles_msg", {
    msg: "Successfully Deleted the console!",
    type: "alert-success",
  });

  res.redirect("/admin/all-consoles");
};

module.exports.allConsoles = (req, res) => {
  const add_query = `SELECT * FROM console ORDER BY id DESC`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    res.render("admin/consoles/all-consoles", {
      data: result,
      msg: req.flash("all_console_msg"),
    });
  });
};

// games-due
module.exports.dueGames = (req, res) => {
  const due_q = `
  SELECT
  user.email, 
  game.title, 
  DATE_FORMAT(rent.date_lent,"%d-%m-%Y") AS date_lent, 
  DATE_FORMAT(rent.date_due,"%d-%m-%Y") AS date_due 
  FROM (
  (rent INNER JOIN user ON rent.user_id = user.id) 
  INNER JOIN game ON rent.game_id = game.id)`;

  var db = getDatabase();

  db.query(due_q, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.render("admin/games-due", { data: result });
  });
};

module.exports.getAddStockConsole = async (req, res) => {
  const get_stock_q = "SELECT id, name, stock FROM console ORDER BY id DESC";

  const db = getDatabase();

  const [rows, fields] = await db.promise().query(get_stock_q);

  res.render("admin/consoles/add-stock", {
    msg: req.flash("error_updating_console_stock"),
    data: rows,
  });
};

module.exports.addStockConsole = async (req, res) => {
  const { console_id, stock } = req.body;
  const check_q = `SELECT COUNT(*) AS n_id, stock FROM console WHERE id = ${console_id}`;
  var db = getDatabase();
  const [rows, fields] = await db.promise().query(check_q);

  if (rows[0].n_id == "0") {
    const err_msg = {
      msg: "Console does not exist",
      type: "alert-danger",
    };
    req.flash("error_updating_console_stock", err_msg);
  } else {
    const total = parseInt(stock) + parseInt(rows[0].stock);
    const update_stock = `UPDATE console SET stock = ${total} WHERE id = ${console_id}`;
    const succ_msg = {
      msg: "Stock updated",
      type: "alert-success",
    };
    req.flash("error_updating_console_stock", succ_msg);

    db.query(update_stock, (err, res) => {
      if (err) throw err;

      console.log("Stock Updated.");
    });
  }

  console.log(console_id, stock);
  res.redirect("/admin/add-stock-console");
};

//End Console Controllers

module.exports.categories = (req, res) => {
  const add_query = `SELECT * FROM category`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    //console.log(result);
    res.render("admin/games/categories", {
      data: result,
      msg: req.flash("add_cat_msg"),
    });
  });
};

module.exports.addCategories = (req, res) => {
  const add_query = `INSERT INTO category
    (name) 
    VALUES 
    ('${req.body.title}')`;
  var db = getDatabase();

  db.query(add_query, (err, result) => {
    if (err) throw err;
    console.log("Category added!");
  });
  req.flash("add_cat_msg", {
    msg: "Category Added",
    type: "alert-success",
  });
  res.redirect("/admin/categories");
};

module.exports.deleteCategory = (req, res) => {
  const catid = req.params.id;
  const db = getDatabase();

  db.query(`DELETE FROM category WHERE id = ${catid}`, (err, result) => {
    if (err) throw err;
    req.flash("add_cat_msg", {
      msg: "Successfully deleted.",
      type: "alert-success",
    });
    res.redirect("/admin/categories");
  });
};

module.exports.deleteManufacture = (req, res) => {
  const manid = req.params.id;
  const db = getDatabase();

  db.query(`DELETE FROM manufacturer WHERE id = ${manid}`, (err, result) => {
    if (err) throw err;
    req.flash("man_msg", {
      msg: "Successfully deleted.",
      type: "alert-success",
    });
    res.redirect("/admin/manufacturers");
  });
};

module.exports.manufacturers = (req, res) => {
  const add_query = `SELECT * FROM manufacturer`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    //console.log(result);
    res.render("admin/consoles/manufacturers", {
      data: result,
      msg: req.flash("man_msg"),
    });
  });
};

module.exports.addManufacturers = (req, res) => {
  const add_query = `INSERT INTO manufacturer
    (name) 
    VALUES 
    ('${req.body.name}')`;
  var db = getDatabase();
  //console.log(req.body);
  db.query(add_query, (err, result) => {
    if (err) throw err;
    console.log("Manufacturer added!");
  });
  req.flash("man_msg", {
    msg: "Manufacture Added!",
    type: "alert-success",
  });
  res.redirect("/admin/manufacturers");
};

module.exports.adReturnGame = (req, res) => {
  //console.log("Logging bosssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss, ",req.params.id);
  const search_query = `SELECT * FROM returned_games WHERE transaction_id=${mysql.escape(
    req.params.id
  )}`;
  var db = getDatabase();
  db.query(search_query, (err, result) => {
    if (err) throw err;
    var T_ID = result[0].id;
    console.log("lol ", result[0].transaction_id);
    const search_query_2 = `SELECT * FROM game WHERE id=${result[0].game_id}`;
    db.query(search_query_2, (err, result2) => {
      if (err) throw err;
      console.log(result2);
      const update_query = `UPDATE game SET stock = ${
        result2[0].stock + 1
      } WHERE id=${result[0].game_id}`;
      db.query(update_query, (err, result3) => {
        if (err) throw err;
        const delete_query = `DELETE FROM returned_games WHERE game_id=${
          result[0].game_id
        } AND user_id=${result[0].user_id} AND transaction_id=${mysql.escape(
          req.params.id
        )}`;
        db.query(delete_query, (err, result4) => {
          console.log(result4);
          if (err) throw err;
          const search_query_3 = `SELECT credits FROM user WHERE id=${result[0].user_id}`;
          db.query(search_query_3, (err, result5) => {
            if (err) throw err;
            const update_query_2 = `UPDATE user SET credits = ${
              result5[0].credits + result2[0].sale_price
            } WHERE id=${result[0].user_id}`;
            db.query(update_query_2, (err, result6) => {
              if (err) throw err;
              const update_query_3 = `UPDATE transaction_history SET Type_of_transaction = 'Game/Returned' WHERE user_id=${
                result[0].user_id
              } AND id=${mysql.escape(req.params.id)}`;
              db.query(update_query_3, (err, result7) => {
                if (err) throw err;
                res.redirect("/admin/dashboard");
              });
            });
          });
        });
      });
    });
  });
};
module.exports.approve = (req, res) => {
  const search_query = `SELECT * FROM returned_games`;
  var db = getDatabase();
  db.query(search_query, (err, result) => {
    if (err) throw err;
    res.render("admin/return-games-ad", { data: result });
  });
};
module.exports.reject = (req, res) => {
  const delete_query = `DELETE FROM returned_games WHERE transaction_id = ${mysql.escape(
    req.params.id
  )}`;
  var db = getDatabase();
  db.query(delete_query, (err, result) => {
    if (err) throw err;
    res.redirect("/admin/dashboard");
  });
};

module.exports.getAddAdmin = (req, res) => {
  res.render("admin/add-admin", { msg: req.flash("add_admin_msg") });
};
module.exports.addAdmin = async (req, res) => {
  const { first_name, last_name, email, password, password2 } = req.body;

  const errors = [];

  if (password.length < 8) {
    errors.push("Length of the password must be atleast 8");
  }

  if (password !== password2) {
    errors.push("Passwords do not match");
  }

  //Check for a user with same email in the Database
  const existing_admin_q = `SELECT * FROM admin WHERE email = '${email}'`;
  var db = getDatabase();

  const [rows, fields] = await db.promise().query(existing_admin_q);

  if (rows.length > 0) {
    errors.push(
      "A admin with this Email already exists. Please use a different Email."
    );
  }
  ///

  if (errors.length > 0) {
    req.flash("add_admin_msg", errors);
    res.redirect("/admin/add-admin");
  } else {
    const salt = bcrypt.genSaltSync(10);
    const pass_hash = bcrypt.hashSync(password, salt);
    const register_query = `INSERT INTO admin
    (first_name, last_name, email, password)
     VALUES ('${first_name}', '${last_name}', '${email}', '${pass_hash}')`;
    db = getDatabase();

    db.query(register_query, (err, result) => {
      if (err) throw err;
      console.log("admin Registered!");
    });

    req.flash("add_admin_msg", "Congratulations! Admin added!");
    res.redirect("/admin/add-admin");
  }
};
