const bcrypt = require("bcryptjs");
const { get } = require("config");
const getDatabase = require("../db/db").getDatabase;
const resetSession = require("../middleware/middlewares").resetSession;
const mysql = require("mysql2");
const { showAddConsoleForm } = require("./admin");

module.exports.getAccount = (req, res) => {
  var db = getDatabase();
  var inputSearch = req.query.search;
  const Searchquery = `SELECT * FROM user WHERE id = ${req.session.user.id}`;

  db.query(Searchquery, (err, result) => {
    if (err) throw err;
    res.render("my-account", { user: req.session.user, data: result });
  });
};

module.exports.groupByCategory = async (req, res) => {
  var db = getDatabase();

  var cat_id = req.params.id;

  var search = `SELECT * FROM category`;
  const [categories, f] = await db.promise().query(search);
  console.log(categories);

  const Searchquery = `SELECT
  *
FROM
  game_category
  INNER JOIN game ON game.id = game_category.game_id
WHERE
  game_category.category_id = '${cat_id}'`;
  db.query(Searchquery, (err, result) => {
    if (err) throw err;
    res.render("index", {
      user: req.session.user,
      categories,
      data: result,
      msg: req.flash("index_msg"),
    });
  });
};

module.exports.sortByPrice = async (req, res) => {
  var db = getDatabase();

  var search = `SELECT * FROM category`;
  const [categories, f] = await db.promise().query(search);
  console.log(categories);
  const Searchquery = `SELECT * FROM game ORDER BY sale_price ASC`;

  db.query(Searchquery, (err, result) => {
    if (err) throw err;
    res.render("index", {
      data: result,
      categories,
      msg: req.flash("index_msg"),
    });
  });
};

module.exports.getsearchResults = async (req, res) => {
  // eval(require('locus'))
  var db = getDatabase();
  var inputSearch = req.query.search;
  const Searchquery = `SELECT * FROM game WHERE title LIKE '%${inputSearch}%';
  SELECT * FROM game WHERE tags LIKE '%${inputSearch}%';
  SELECT * FROM console WHERE name LIKE '%${inputSearch}%'`;

  db.query(Searchquery, (err, result) => {
    if (err) throw err;
    var allresults = result[0].concat(result[1]);
    var noduplicates = [];
    var finalresults = []
    allresults.forEach((c) => {
      if (!noduplicates.includes(c.title)) {
          noduplicates.push(c.title);
          finalresults.push(c);
      }
  });
  console.log(finalresults)

  res.render('search-results',{ data:finalresults, data2:result[2]});
  });
};

module.exports.getEditAccount = (req, res) => {
  res.render("edit-account", { msg: req.flash("edit_msg"), type: "user" });
};
module.exports.editAccount = async (req, res) => {
  const { email, password, npassword, npassword2 } = req.body;
  const error = [];

  const password_check = `SELECT * FROM user WHERE email = '${email}'`;
  var db = getDatabase();

  const [rows, fields] = await db.promise().query(password_check);

  if (npassword !== npassword2) {
    error.push("New Passwords do not match");
  } else if (rows.length > 0) {
    const queried_pass = rows[0].password;
    console.log(queried_pass);
    console.log(password);
    const pass_cmpare = await bcrypt.compare(password, queried_pass);
    if (pass_cmpare) {
      req.session.isAuth = true;
      req.session.isUser = true;
      const salt = bcrypt.genSaltSync(10);
      const pass_hash = bcrypt.hashSync(npassword, salt);
      const edit_pass = `UPDATE user SET password ='${pass_hash}' WHERE email = '${email}' `;
      db.query(edit_pass);
      //error.push("Succusfully changed");
      req.flash("edit_msg", "Successfully Changed.");
      res.redirect("/user/edit-account");
    } else {
      error.push("Your password does not match your Email");
    }
  } else {
    error.push("You have entered Wrong Email!");
  }

  if (error.length > 0) {
    req.flash("edit_msg", error);
    res.redirect("/user/edit-account");

    res.end();
  }
};

module.exports.allGamesConsoles = async (req, res) => {
  const add_query = `SELECT * FROM game ORDER BY id DESC LIMIT 4;
    SELECT game.id, game.title, game.platform, game.image_url,game.sale_price, game.stock, T.count_product FROM 
    ( SELECT count(product_id) as count_product, product_id FROM transaction_history
    WHERE Type_of_transaction = 'Game/Buy' OR Type_of_transaction = 'Game/Rent' GROUP BY product_id )
    AS T INNER JOIN game ON T.product_id = game.id
    ORDER BY count_product DESC LIMIT 4`;
  const console_query = "SELECT * FROM console ORDER BY id DESC limit 4;";
  var db = getDatabase();

  var search = `SELECT * FROM category`;
  const [categories, f] = await db.promise().query(search);
  console.log(categories);

  db.query(add_query, (err, result) => {
    if (err) throw err;

    db.query(console_query, (err2, result2) => {
      if (err2) throw err2;

      res.render("index", {
        data1: result[0],
        msg: req.flash("index_msg"),
        data3: result2,
        categories,
        data2: result[1],
      });
    });
  });
};

module.exports.userHistory = (req, res) => {
  const useHist_query = `SELECT game.title as title, T.price, DATE_FORMAT(T.date_of_purchase, "%D %M %Y") AS date_of_purchase, T.Type_of_transaction FROM
     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Game/Buy' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN game ON T.product_id = game.id; 
      SELECT game.title as title, T.price, DATE_FORMAT(T.date_of_purchase, "%D %M %Y") AS date_of_purchase, T.Type_of_transaction FROM
     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Game/Rent' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN game ON T.product_id = game.id;

      SELECT game.title as title, T.price, T.date_of_purchase, T.Type_of_transaction FROM
     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Game/Returned' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN game ON T.product_id = game.id;
      SELECT console.name as title, T.price, T.date_of_purchase, T.Type_of_transaction FROM

     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Console/Buy' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN console ON T.product_id = console.id`;
  var db = getDatabase();

  db.query(useHist_query, (err, result) => {
    if (err) throw err;
    //console.log(result);
    //var arr =[]

    //console.log(result)
    var allhist = result[0].concat(result[1], result[2]);

    res.render("user-history", { data1: allhist });
  });
};
module.exports.showReturnGame = (req, res) => {
  const useHist_query = `SELECT game.title as title, T.id, T.price, T.date_of_purchase, T.Type_of_transaction FROM
     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Game/Buy' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN game ON T.product_id = game.id; 
      SELECT game.title as title, T.price, T.date_of_purchase, T.Type_of_transaction FROM
     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Game/Rent' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN game ON T.product_id = game.id;
      SELECT console.name as title, T.price, T.date_of_purchase, T.Type_of_transaction FROM
     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Console/Buy' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN console ON T.product_id = console.id`;
  var db = getDatabase();

  db.query(useHist_query, (err, result) => {
    if (err) throw err;
    //console.log(result);
    //var arr =[]

    console.log("KAMEHAMEHA ", result);
    res.render("return-game", {
      data1: result[0],
      data2: result[1],
      data3: result[2],
      user: req.session.user,
    });
  });
};
module.exports.returnGameResult = (req, res) => {
  const search_query = `SELECT * FROM transaction_history WHERE id=${mysql.escape(
    req.params.id
  )} AND Type_of_transaction = 'Game/Buy'`;
  //console.log("delete console",req.params.title)
  var db = getDatabase();
  db.query(search_query, (err, result) => {
    if (err) throw err;
    console.log(result);
    const search_query_2 = `SELECT * FROM game WHERE id=${result[0].product_id}`;
    db.query(search_query_2, (err, result2) => {
      if (err) throw err;
      res.render("return-game-result", {
        user: req.session.user,
        data: result,
        data2: result2,
      });
      //console.log(result);
      //var arr =[]
    });
    console.log(result);
  });
};
module.exports.returnGame = (req, res) => {
  console.log(req.body);
  const add_query = `INSERT INTO returned_games
    (game_id, reason_for_return, credit_returned, transaction_id, user_id)
     VALUES 
     (${mysql.escape(req.body.gameID)},
      ${mysql.escape(req.body.reason)},
       ${mysql.escape("0")},
        ${mysql.escape(req.body.transid)},
         ${mysql.escape(req.session.user.id)})`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    console.log("Item added!");
    res.render("Success");
  });
};
module.exports.success = (req, res) => {
  res.render("Success");
};
module.exports.gamesDue = (req, res) => {
  const search_query = `SELECT game.id as id, game.title as title, DATE_FORMAT(rent.date_lent, "%d/%m/%Y") as lent, DATE_FORMAT(rent.date_due, "%d/%m/%Y") as due, rent.user_id FROM
    game INNER JOIN rent on game.id=rent.game_id WHERE rent.user_id=${req.session.user.id}`;
  var db = getDatabase();
  db.query(search_query, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.render("games_due", { user: req.session.user, data: result });
  });
};
