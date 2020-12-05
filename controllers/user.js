const bcrypt = require("bcryptjs");
const { get } = require("config");
const getDatabase = require("../db/db").getDatabase;
const resetSession = require("../middleware/middlewares").resetSession;
const mysql = require("mysql2");
const { showAddConsoleForm } = require("./admin");

module.exports.getAccount = (req,res)=>{
    res.render('my-account',{user:req.session.user})
}

module.exports.getsearchResults = (req,res)=>{
  // eval(require('locus'))
  var db = getDatabase();
  var inputSearch = req.query.search
  const Searchquery = `SELECT * FROM game WHERE title LIKE '%${inputSearch}%'` 

  db.query(Searchquery, (err, result) => {
    if (err) throw err;
  res.render('search-results',{user:req.session.user, data:result});
  });
}

module.exports.getEditAccount = (req,res)=>{
  res.render("edit-account", { msg: req.flash("edit_msg"), type: "user" });
}
module.exports.editAccount = async (req, res) => {
  const { email, password, npassword, npassword2 } = req.body;
  const error = [];

  const password_check = `SELECT * FROM user WHERE email = '${email}'`;
  var db = getDatabase();

  const [rows, fields] = await db.promise().query(password_check);

  if (npassword !== npassword2) {
    error.push("New Passwords do not match");
  }
  else if (rows.length > 0) {
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
}

module.exports.allGames = (req, res) => {
    const add_query = `SELECT * FROM game ORDER BY id DESC`;
    var db = getDatabase();
  
    db.query(add_query, (err, result) => {
      if (err) throw err;
      //console.log(result);
      res.render("index", {data:result, msg:req.flash('index_msg')});
    });  
  };

  module.exports.userHistory = (req, res) => {
    const useHist_query = `SELECT game.title as title, T.price, T.date_of_purchase, T.Type_of_transaction FROM
     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Game/Buy' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN game ON T.product_id = game.id; 
      SELECT game.title as title, T.price, T.date_of_purchase, T.Type_of_transaction FROM
     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Game/Rent' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN game ON T.product_id = game.id;
      SELECT console.name as title, T.price, T.date_of_purchase, T.Type_of_transaction FROM
     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Console/Buy' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN console ON T.product_id = console.id`
    var db = getDatabase();
  
    db.query(useHist_query, (err, result) => {
      if (err) throw err;
      //console.log(result);
      //var arr =[]

      console.log(result)
      res.render("user-history", {data1:result[0],data2:result[1],data3:result[2]});
    });  
   
  };
  module.exports.showReturnGame = (req,res)=>{
    res.render("return-game",{user:req.session.user});
  };
  module.exports.returnGameResult = (req,res)=>{
    res.render("return-game-result",{user:req.session.user});
  };
  module.exports.returnGame = (req,res)=>{
    console.log(req.body)
    var name = mysql.escape(req.body.title);
    var platform = mysql.escape(req.body.platform);
    var reason = mysql.escape(req.body.reason);
    const search_query = `SELECT * FROM game WHERE title=${name}`;
    var db = getDatabase();
    var id = ""
    var Tid=""
    var rees=""
    var rees2=""
    var credit = 0
    var success = ""
    db.query(search_query, (err, result) => {
      if (err) throw err;
      rees=result
      if (result!="")
      {
      const test_query = `SELECT id, product_id, user_id FROM transaction_history WHERE user_id=${req.session.user.id} AND product_id=${mysql.escape(result[0].id)}`;
      db.query(test_query, (err, result2) => {
        if (err) throw err;
        rees2=result2
        //console.log(result[0].id)
        //console.log(result2[0].id)
        //res.render("return-game-result",{user:req.session.user, data:result});
        if (result2!=""){
        const add_query = `INSERT INTO returned_games
     (game_id, reason_for_return, credit_returned, transaction_id, user_id)
      VALUES 
      (${mysql.escape(result[0].id)},
       ${reason},
      ${credit},
         ${mysql.escape(result2[0].id)},
          ${req.session.user.id})`;
          db.query(add_query, (err, result3) => {
          if (err) throw err;
          console.log("Item added!");

        });
        success="Y"
        res.render("return-game-result",{user:req.session.user, data:result, data2:result2, succ:success});
      }
      });
    }
    res.render("return-game-result",{user:req.session.user, data:result, data2:id, suc:success});
    });
    

    //
  };