const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;
const resetSession = require("../middleware/middlewares").resetSession;
const mysql = require("mysql2");
var exec = require('child_process').exec;
const fs = require('fs')
const spawn = require('child_process').spawn
const dumpFileName = `vgs.dump.sql`

function multiply(){
  a = Number(document.profit.people.value);
  b = Number(document.profi.price.value);
  c = a * b;
  document.profit.total.value=c;
}

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
  res.redirect("/admin");
};

module.exports.getDashboard = function (req, res) {
  res.render("admin/dashboard", {msg:req.flash("admin_msg")});
};

module.exports.backup = function (req, res) {
  var child = exec('mysqldump -u root -p vgs > vgs_backup.sql');
  req.flash('admin_msg',{type:'alert-success', msg:'Database was backed up!'})
  res.redirect('/admin')
};
module.exports.showProfitForm = function (req, res) {
  //console.log(req.body);
  res.render('admin/profit')
};
module.exports.Profit = function (req, res) {
  //console.log(req.body)
  res.render('admin/showProfit')
};
module.exports.showProfit = function (req, res) {
  res.render('admin/showProfit')
};
module.exports.showTrans = function (req, res) {
  //console.log(req.body)
  const add_query = `SELECT id, game_id, user_id, price, DATE_FORMAT(date_of_purchase, "%d/%m/%Y") as date, Type_of_transaction FROM transaction_history`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    res.render('admin/showTrans', {data:result});
  });
  
};
module.exports.sortTransDate = function (req, res) {
  //console.log(req.body)
  const add_query = `SELECT id, game_id, user_id, price, DATE_FORMAT(date_of_purchase, "%d/%m/%Y") as date, Type_of_transaction FROM transaction_history ORDER BY date_of_purchase`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    res.render('admin/showTrans', {data:result});
  });
};
module.exports.sortTransPrice = function (req, res) {
  //console.log(req.body)
  const add_query = `SELECT id, game_id, user_id, price, DATE_FORMAT(date_of_purchase, "%d/%m/%Y") as date, Type_of_transaction FROM transaction_history ORDER BY cast(price as unsigned) DESC`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    res.render('admin/showTrans', {data:result});
  });
};
module.exports.groupbyTrans = function (req, res) {
  //console.log(req.body)
  const add_query = `SELECT COUNT(Type_of_transaction) as number, SUM(cast(price as unsigned)) as sum, Type_of_transaction FROM transaction_history GROUP BY Type_of_transaction`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    res.render('admin/groupbyTrans', {data:result});
  });
};

//Game Controllers
module.exports.showAddGameForm = function (req, res) {
  res.render("admin/games/add-game");
};

module.exports.addGame = async (req, res) => {
  console.log(req.body)
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
          ${platform}, ${image}, ${stock})`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    console.log("Item added!");
  });

  //req.flash("login_msg", "Item added successfully!");
  res.redirect("/admin/add-game");
};

module.exports.deleteGame = async (req,res) => {
  console.log("delete game",req.params.id)

  const deleteQuer = `DELETE FROM game WHERE id = ${req.params.id}`

  const db = getDatabase()

  db.query(deleteQuer, (err, res)=>{
    if(err) throw err
  })
  
  res.redirect('/admin/all-games')
}


module.exports.allGames = (req, res) => {
  const add_query = `SELECT * FROM game ORDER BY id DESC`;
  var db = getDatabase();

  db.query(add_query, (err, result) => {
    if (err) throw err;
    //console.log(result);
    res.render("admin/games/all-games", {data:result});
  });  
};


module.exports.getAddStockGame = async (req, res) => {
  const get_stock_q = "SELECT id, stock FROM game";

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
  const get_manq = 'SELECT * FROM manufacturer'
  const db = getDatabase()

  const [rows,fields] = await db.promise().query(get_manq)

  console.log(rows)


  res.render("admin/consoles/add-console", { manufacturers:rows });
};

module.exports.addConsole = (req, res) => {
  var { name, sale_price, image, tags, description,manufacturer } = req.body;
  const stock = 0;

  name = mysql.escape(name);
  sale_price = mysql.escape(sale_price);
  image = mysql.escape(image);
  tags = mysql.escape(tags);
  description = mysql.escape(description);
  manufacturer = mysql.escape(manufacturer)

  const add_query = `INSERT INTO console
    (name, description, tags, sale_price,image_url, stock,manufacturer_id) 
    VALUES 
    (${name}, ${description}, ${tags}, ${sale_price}, ${image},${stock}, ${manufacturer})`;

  const db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    console.log("Item added!");
  });

  res.redirect("/admin/add-console");
};

module.exports.deleteConsole = async (req,res) => {
  console.log("delete console",req.params.id)

  const deleteQuer = `DELETE FROM console WHERE id = ${req.params.id}`

  const db = getDatabase()

  db.query(deleteQuer, (err, res)=>{
    if(err) throw err
  })
  
  res.redirect('/admin/all-consoles')
}


module.exports.allConsoles = (req, res) => {
  const add_query = `SELECT * FROM console ORDER BY id DESC`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    res.render("admin/consoles/all-consoles", {data:result});
  });
};

module.exports.getAddStockConsole = async (req, res) => {
  const get_stock_q = "SELECT id, stock FROM console";

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
    res.render("admin/games/categories", {data:result});
  });
};

module.exports.addCategories = (req, res) =>{
  const add_query = `INSERT INTO category
    (name) 
    VALUES 
    ('${req.body.title}')`;
  var db = getDatabase();

  db.query(add_query, (err, result) => {
    if (err) throw err;
    console.log("Category added!");
  });

  res.redirect("/admin/categories");
};

module.exports.manufacturers = (req, res) => {
  const add_query = `SELECT * FROM manufacturer`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    //console.log(result);
    res.render("admin/consoles/manufacturers", {data:result});
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
  res.redirect("/admin/manufacturers");
};
