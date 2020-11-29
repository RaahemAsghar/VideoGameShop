const bcrypt = require("bcryptjs");
const { get } = require("config");
const getDatabase = require("../db/db").getDatabase;
const resetSession = require("../middleware/middlewares").resetSession;
const mysql = require("mysql2");

module.exports.getAccount = (req,res)=>{
    res.render('my-account',{user:req.session.user})
}

module.exports.editAccount = (req,res)=>{
  res.render('edit-account',{user:req.session.user})
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