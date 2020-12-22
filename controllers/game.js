const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;
const mysql = require("mysql2");
const uuid = require("uuid");
const config = require('config')
module.exports.getGame = async (req, res) => {
  const game_id = req.params.gid;
  console.log(game_id);
  const get_q = `SELECT * FROM game WHERE id=${game_id}`;
  const db = getDatabase();
  const [rows, fields] = await db.promise().query(get_q);
  console.log(rows);
  if (rows.length > 0) {
    res.render("game", { data: rows[0] });
  } else {
    res.redirect("/");
  }
};

module.exports.rentGame = async (req, res) => {
  if (!req.session.isAuth) {
    req.flash(
      "login_msg",
      "Making a transaction requires you to be logged in!"
    );
    res.redirect("/login");
  } else {
    const user_id = req.session.user.id;
    const game_id = req.params.id;
    var date = new Date();
    date.setDate(date.getDate() + 30);
    console.log(date.toISOString());

    const sql_date = mysql.escape(date.toISOString());
    const db = getDatabase();
    const check_q = `SELECT * FROM rent WHERE user_id = ${user_id} AND game_id = ${game_id}`;
    const [c, f] = await db.promise().query(check_q);
    if (c.length > 0) {
      req.flash("index_msg", "You already have this game rented!!");
      res.redirect("/");
    } else {
      const transaction_id = uuid.v4();
      const rentq = `
                  INSERT INTO rent (user_id, game_id,date_due)
                  VALUES(${user_id}, ${game_id}, ${sql_date});

                  UPDATE game SET stock = stock - 1 WHERE id = ${game_id};

                  INSERT 
                  INTO transaction_history (
                  id,
                  product_id,
                  user_id, 
                  price, 
                  Type_of_transaction)
                  VALUES
                  (${mysql.escape(transaction_id)},${game_id}, ${user_id},
                  (SELECT rent_price FROM game WHERE id = ${game_id}),
                  ${mysql.escape("Game/Rent")});
                  INSERT INTO user_purchase_history(user_id, transaction_id)
                  VALUES(${user_id}, ${mysql.escape(transaction_id)});
                   `;
      db.query(rentq, (err, result) => {
        if (err) throw err;
      });

      req.flash(
        "index_msg",
        "You have successfully rented the game. Check 'Due Games' in My Account."
      );
      res.redirect("/");
    }
  }
};

module.exports.games = async (req, res, next) => {
  const gamesPerPage = config.get('products_per_page');
  const pageno = req.params.page - 1;
  const db = getDatabase();
  const [game_ids, fields] = await db
    .promise()
    .query("SELECT id FROM game ORDER BY id DESC");
  console.log(game_ids.length);
  var total_pages = Math.ceil(game_ids.length / gamesPerPage);
  //display gamesPerPage games per page
  if (pageno > total_pages - 1 || pageno < 0) {
    res.redirect("/");
    return
  } else {
    var games = [];
    var nextgames = game_ids.slice(
      pageno * gamesPerPage,
      pageno * gamesPerPage + gamesPerPage
    );
    console.log(nextgames.length);
    console.log(nextgames);
    for (var i = 0; i < nextgames.length; i++) {
      var getgame = `SELECT * FROM game WHERE id = ${nextgames[i].id}`;
      var [game, f] = await db.promise().query(getgame);
      games.push(game[0]);
    }
    var search = `SELECT * FROM category`;
    const [categories, g] = await db.promise().query(search);
    console.log(categories);

    console.log("tot:", total_pages);
    console.log("curr:", pageno);

    res.render("games", {
      data1: games,
      link: "game",
      totalPages: total_pages,
      categories,
      currpage: pageno + 1,
    });
  }
};

module.exports.gamesByCat = async (req, res, next) => {
  const gamesPerPage = config.get('products_per_page');
  const pageno = req.params.page - 1;
  const cat_id = req.params.cat;
  const db = getDatabase();
  const [game_ids, fields] = await db
    .promise()
    .query(
      `SELECT game_id AS id FROM game_category WHERE category_id = '${cat_id}'`
    );
  console.log(game_ids);
  var total_pages = Math.ceil(game_ids.length / gamesPerPage);
  if (pageno > total_pages - 1 || pageno < 0) {
    res.redirect("/");
    
  } else {
    var games = [];
    var nextgames = game_ids.slice(
      pageno * gamesPerPage,
      pageno * gamesPerPage + gamesPerPage
    );
    console.log(nextgames.length);
    console.log(nextgames);
    for (var i = 0; i < nextgames.length; i++) {
      var getgame = `SELECT * FROM game WHERE id = ${nextgames[i].id}`;
      console.log(getgame);
      var [game, f] = await db.promise().query(getgame);
      games.push(game[0]);
    }
    var search = `SELECT * FROM category`;
    const [categories, g] = await db.promise().query(search);
    console.log(categories);

    console.log("tot:", total_pages);
    console.log("curr:", pageno);

    res.render("games", {
      data1: games,
      link: "category",
      category: cat_id,
      totalPages: total_pages,
      categories,
      currpage: pageno + 1,
    });
  }
  // console.log(game_ids.length)
  // var total_pages = Math.ceil(game_ids.length / gamesPerPage);

  // var cat_id = req.params.id;

  // var search = `SELECT * FROM category`;
  // const [categories, f] = await db.promise().query(search);
  // console.log(categories);

  // const Searchquery = ;

  // db.query(Searchquery, (err, result) => {
  //   if (err) throw err;
  //   res.render('games', {data1:games, totalPages:total_pages, categories,currpage:pageno+1})
  // });
};

module.exports.sortByPriceGames = async (req, res, next) => {
  const gamesPerPage = config.get('products_per_page');;
  const pageno = req.params.page - 1;
  const db = getDatabase();
  const [game_ids, fields] = await db
    .promise()
    .query("SELECT id FROM game ORDER BY sale_price ASC");
  console.log(game_ids.length);
  console.log("hello");
  var total_pages = Math.ceil(game_ids.length / gamesPerPage);
  //display gamesPerPage games per page
  if (pageno > total_pages - 1 || pageno < 0) {
    res.redirect("/");
    
  } else {
    var games = [];
    var nextgames = game_ids.slice(
      pageno * gamesPerPage,
      pageno * gamesPerPage + gamesPerPage
    );
    console.log(nextgames.length);
    console.log(nextgames);
    for (var i = 0; i < nextgames.length; i++) {
      var getgame = `SELECT * FROM game WHERE id = ${nextgames[i].id}`;
      var [game, f] = await db.promise().query(getgame);
      games.push(game[0]);
    }
    var search = `SELECT * FROM category`;
    const [categories, g] = await db.promise().query(search);
    console.log(categories);

    console.log("tot:", total_pages);
    console.log("curr:", pageno);

    res.render("games", {
      data1: games,
      link: "price",
      totalPages: total_pages,
      categories,
      currpage: pageno + 1,
    });
  }
};
