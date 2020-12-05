const { sortBy } = require("async");
const bcrypt = require("bcryptjs");
const { get } = require("config");
const getDatabase = require("../db/db").getDatabase;
const resetSession = require("../middleware/middlewares").resetSession;
const mysql = require("mysql2");
const uuid = require("uuid");

module.exports.getCart = async (req, res) => {
  var cart = req.cookies.cart;
  cart = JSON.parse(cart);

  var games = cart.games;
  var consoles = cart.consoles;
  var results = [];
  const db = getDatabase();

  for (var i = 0; i < games.length; i++) {
    var q = `SELECT * FROM game WHERE id = ${parseInt(games[i].id)}`;
    var [rows, fields] = await db.promise().query(q);
    results.push({
      game: rows[0],
      amount: games[i].amount,
    });
  }

  res.render("cart", { data: results, msg:req.flash('cart_msg') });
};

module.exports.addToCartGame = async (req, res) => {
  const game_id = req.params.id;
  var cart = req.cookies.cart;
  cart = JSON.parse(cart);

  let check = true;
  var game_cart = cart.games;
  game_cart.forEach((e) => {
    if (e.id == game_id) {
      check = false;
    }
  });

  if (check) {
    game_cart.push({
      id: game_id,
      amount: 1,
    });
  }
  cart.games = game_cart;
  res.cookie("cart", JSON.stringify(cart));
  console.log(cart);

  res.redirect("/");
};

module.exports.checkout = async (req, res) => {
  if (!req.session.isAuth) {
    req.flash(
      "login_msg",
      "Making a transaction requires you to be logged in!"
    );
    res.redirect("/login");
  } else {
    var cart = JSON.parse(req.cookies.cart);
    res.cookie(
      "cart",
      JSON.stringify({
        games: [],
        consoles: [],
      })
    );
    req.cookies.cart = JSON.stringify({
      games: [],
      consoles: [],
    });

    res.locals.shoppingcart = {
      games: [],
      consoles: [],
    };

    //buy all games in cart
    var games = cart.games;
    var sum = 0;
    var count  = 0;
    for (var i = 0; i < games.length; i++) {
      var game_id = parseInt(games[i].id);
      for (var j = 0; j < games[i].amount; j++) {
        const db = getDatabase();
        var id = uuid.v4();
        console.log(id);
        // store credit start
        var price_query = `(SELECT sale_price FROM game WHERE id = ${game_id})`;
        var price = db.query(price_query);
        var sum = sum + price ; 
        count = count+1;
      
        // end 
        var buy_game_query = `INSERT 
        INTO 
        transaction_history 
        (id,product_id,
        user_id, 
        price, 
        Type_of_transaction)
        VALUES
        (${mysql.escape(id)},${game_id}, ${req.session.user.id},
        (SELECT sale_price FROM game WHERE id = ${game_id}),
        ${mysql.escape("Game/Buy")});
        INSERT INTO user_purchase_history(user_id, transaction_id)
        VALUES(${req.session.user.id}, ${mysql.escape(id)});
        UPDATE game SET stock = stock - 1 WHERE id = ${game_id};
        `;

        db.query(buy_game_query, (err, result) => {
          if (err) throw err;
        });
      }
    }
// store credit
    var credit_query= `SELECT credits FROM user WHERE id = ${req.session.user.id}`;
        var credit = db.query(credit_query);
        if(sum >= 5000 && count >= 2) 
        {
          sum = sum*0.1;
          var update_query = `UPDATE user SET credits = credit + sum WHERE id = ${req.session.user.id}`;
          db.query(update_query);
        }
 // end
    //buy consoles
    var consoles = cart.consoles;
    for (var i = 0; i < consoles.length; i++) {}

    var games = cart.games;
    var consoles = cart.consoles;
    var results = [];
    const db = getDatabase();

    for (var i = 0; i < games.length; i++) {
      var q = `SELECT * FROM game WHERE id = ${parseInt(games[i].id)}`;
      var [rows, fields] = await db.promise().query(q);
      results.push({
        game: rows[0],
        amount: games[i].amount,
      });
    }

    res.render("order-confirmation", { data: results });
  }
};

module.exports.increaseGame = async (req, res) => {
  const db = getDatabase();

  const game_id = req.params.id;
  const stockq = `SELECT stock FROM game WHERE id = ${game_id}`;
  const [row, field] = await db.promise().query(stockq);

  console.log(row);
  var cart = req.cookies.cart;
  cart = JSON.parse(cart);
  var games = cart.games;
  for (var i = 0; i < games.length; i++) {
    if (games[i].id == game_id) {
      if (row[0].stock == games[i].amount) {
        req.flash('cart_msg',"No more stock available for this particular game!")
      } else {
        games[i].amount = games[i].amount + 1;
        console.log(games[i].amount);
      }
    }
  }
  cart.games = games;
  console.log(cart);
  res.cookie("cart", JSON.stringify(cart));
  res.redirect("/cart");
};

module.exports.decreaseGame = (req, res) => {
  const game_id = req.params.id;
  console.log(game_id);
  var cart = req.cookies.cart;
  cart = JSON.parse(cart);
  var games = cart.games;
  for (var i = 0; i < games.length; i++) {
    if (games[i].id == game_id && games[i].amount > 1) {
      games[i].amount = games[i].amount - 1;
      console.log(games[i].amount);
    } else {
      games.splice(i, 1);
    }
  }
  cart.games = games;
  console.log(cart);
  res.cookie("cart", JSON.stringify(cart));
  res.redirect("/cart");
};
