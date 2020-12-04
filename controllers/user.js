const bcrypt = require("bcryptjs");
const { get } = require("config");
const getDatabase = require("../db/db").getDatabase;
const resetSession = require("../middleware/middlewares").resetSession;
const mysql = require("mysql2");

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
    const add_query = `SELECT * FROM game`;
    var db = getDatabase();
  
    db.query(add_query, (err, result) => {
      if (err) throw err;
      //console.log(result);
      res.render("index", {data:result});
    });  
  };

  module.exports.userHistory = (req, res) => {
    const useHist_query = `SELECT game.title as title, T.price, T.date_of_purchase, T.Type_of_transaction FROM
     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Game/Buy' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN game ON T.game_id = game.id; 
      SELECT game.title as title, T.price, T.date_of_purchase, T.Type_of_transaction FROM
     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Game/Rent' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN game ON T.game_id = game.id;
      SELECT console.name as title, T.price, T.date_of_purchase, T.Type_of_transaction FROM
     (SELECT * FROM transaction_history WHERE Type_of_transaction = 'Console/Buy' AND user_id = '${req.session.user.id}') AS T
      INNER JOIN console ON T.game_id = console.id`
    var db = getDatabase();
  
    db.query(useHist_query, (err, result) => {
      if (err) throw err;
      //console.log(result);
      //var arr =[]

      console.log(result)
      res.render("user-history", {data1:result[0],data2:result[1],data3:result[2]});
    });  
  };