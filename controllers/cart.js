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


  var results2 = [];
  for (var i = 0; i < consoles.length; i++) {
    var q = `SELECT * FROM console WHERE id = ${parseInt(consoles[i].id)}`;
    var [rows, fields] = await db.promise().query(q);
    results2.push({
      console: rows[0],
      amount: consoles[i].amount,
    });
  }

  res.render("cart", { data: results, data2:results2, msg:req.flash('cart_msg') });
};

module.exports.addToCartGame = async (req, res) => {
  const game_id = req.params.id;
  console.log("add game to cart")
  console.log("id",game_id)
  var cart = req.cookies.cart;
  console.log(cart)
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
  res.cookie("cart", JSON.stringify(cart), { expires: new Date(Date.now() + 900000)});
  console.log(cart);

  res.redirect("/");
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
  res.cookie("cart", JSON.stringify(cart),{ expires: new Date(Date.now() + 900000)});
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
  console.log("cart",cart);
  res.cookie("cart", JSON.stringify(cart),{ expires: new Date(Date.now() + 900000)});
  res.redirect("/cart");
};

//for console


module.exports.addToCartConsole = async (req, res) => {
  const console_id = req.params.id;
  var cart = req.cookies.cart;
  console.log("add to cart console")
  cart = JSON.parse(cart);

  let check = true;
  var console_cart = cart.consoles;
  console_cart.forEach((e) => {
    if (e.id == console_id) {
      check = false;
    }
  });

  if (check) {
    console_cart.push({
      id: console_id,
      amount: 1,
    });
  }
  cart.consoles = console_cart;
  res.cookie("cart", JSON.stringify(cart),{ expires: new Date(Date.now() + 900000)});
  console.log(cart);

  res.redirect("/");
};




module.exports.increaseConsole = async (req, res) => {
  const db = getDatabase();

  const console_id = req.params.id;
  const stockq = `SELECT stock FROM console WHERE id = ${console_id}`;
  const [row, field] = await db.promise().query(stockq);

  console.log(row);
  var cart = req.cookies.cart;
  cart = JSON.parse(cart);
  var consoles = cart.consoles;
  for (var i = 0; i < consoles.length; i++) {
    if (consoles[i].id == console_id) {
      if (row[0].stock == consoles[i].amount) {
        req.flash('cart_msg',"No more stock available for this particular console!")
      } else {
        consoles[i].amount = consoles[i].amount + 1;
        console.log(consoles[i].amount);
      }
    }
  }
  cart.consoles = consoles;
  console.log(cart);
  res.cookie("cart", JSON.stringify(cart),{ expires: new Date(Date.now() + 900000)});
  res.redirect("/cart");
};

module.exports.decreaseConsole = (req, res) => {
  const console_id = req.params.id;
  console.log(console_id);
  var cart = req.cookies.cart;
  cart = JSON.parse(cart);
  var consoles = cart.consoles;
  for (var i = 0; i < consoles.length; i++) {
    if (consoles[i].id == console_id && consoles[i].amount > 1) {
      consoles[i].amount = consoles[i].amount - 1;
      console.log(consoles[i].amount);
    } else {
      consoles.splice(i, 1);
    }
  }
  cart.consoles = consoles;
  console.log(cart);
  res.cookie("cart", JSON.stringify(cart),{ expires: new Date(Date.now() + 900000)});
  res.redirect("/cart");
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
      }),
      { expires: new Date(Date.now() + 900000)}
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
    const d_b = getDatabase();
    for (var i = 0; i < games.length; i++) {
      var game_id = parseInt(games[i].id);
      for (var j = 0; j < games[i].amount; j++) {
        
        var id = uuid.v4();
        console.log(id);
        // store credit start
        var price_query = `(SELECT sale_price FROM game WHERE id = ${game_id})`;
        d_b.query(price_query,(err,presult)=>
        {
          if(err) throw err;

          sum = sum + parseInt(presult[0].sale_price) ; 

        });
        
        
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

        d_b.query(buy_game_query, (err, result) => {
          if (err) throw err;
        });
      }
    }
// store credit

    const credit_query= `SELECT credits FROM user WHERE id = ${req.session.user.id}`;
        d_b.query(credit_query,(err,cresult)=>{
          if(err) throw err;
          
          console.log(sum);
          if(sum >= 5000 && count >= 2){
          sum = sum*0.1;
          var update_query = `UPDATE user SET credits = ${cresult[0].credits + sum} WHERE id = ${req.session.user.id}`;
          d_b.query(update_query,(err,result)=>
          {
            if(err) throw err;
            
          });

        }
        });
          
        
 // end
    //buy consoles
    var consoles = cart.consoles;
    for (var i = 0; i < consoles.length; i++) {
      var console_id = parseInt(consoles[i].id);
      for (var j = 0; j < consoles[i].amount; j++) {
        const db = getDatabase();
        var id = uuid.v4();
        console.log(id);
        var buy_console_query = `INSERT 
        INTO 
        transaction_history 
        (id,product_id,
        user_id, 
        price, 
        Type_of_transaction)
        VALUES
        (${mysql.escape(id)},${console_id}, ${req.session.user.id},
        (SELECT sale_price FROM console WHERE id = ${console_id}),
        ${mysql.escape("Console/Buy")});
        INSERT INTO user_purchase_history(user_id, transaction_id)
        VALUES(${req.session.user.id}, ${mysql.escape(id)});
        UPDATE console SET stock = stock - 1 WHERE id = ${console_id};
        `;

        db.query(buy_console_query, (err, result) => {
          if (err) throw err;
        });
      }
    }

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

    var results2 = [];
    for (var i = 0; i < consoles.length; i++) {
      var q = `SELECT * FROM console WHERE id = ${parseInt(consoles[i].id)}`;
      var [rows, fields] = await db.promise().query(q);
      results2.push({
        console: rows[0],
        amount: consoles[i].amount,
      });
    }

    res.render("order-confirmation", { data: results, data2:results2 });
  }
};