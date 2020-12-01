const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;
const mysql = require("mysql2");
const moment = require('moment');
const { Types } = require("mysql");

module.exports.getGame = async (req, res) => {
  const game_id = req.params.id;
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
    req.flash('login_msg','Making a transaction requires you to be logged in!')
    res.redirect("/login");
  } else {
    const user_id = req.session.user.id
    const game_id = req.params.id
    var date = new Date()
    date.setDate(date.getDate() + 7)
    console.log(date.toISOString())

    const sql_date = mysql.escape(date.toISOString())
    const db = getDatabase()
    const check_q = `SELECT * FROM rent WHERE user_id = ${user_id} AND game_id = ${game_id}`
    const [c,f] = await db.promise().query(check_q)
    if(c.length>0){
      req.flash('index_msg', "You already have this game rented!!")
      res.redirect('/')
    }
    else{

    
    const rentq = `INSERT INTO rent (user_id, game_id,date_due)
                   VALUES(${user_id}, ${game_id}, ${sql_date});
                   UPDATE game SET stock = stock - 1 WHERE id = ${game_id};
                   `
    db.query(rentq, (err, result)=>{
      if(err) throw err
    })

    res.send('goood')
  }

  }
};
