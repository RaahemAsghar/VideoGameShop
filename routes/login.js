const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;
const resetSession = require('../middleware/middlewares').resetSession

router.get("/", (req, res) => {
  if(req.session.isAuth){
    res.redirect('/')
  }
  else{
    res.render("login", { msg: req.flash("login_msg"), type: "user" });

  }
});

router.get("/logout", (req, res,next) => {

    resetSession(req,res)
    res.redirect('/')
  
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const error = [];

  const password_check = `SELECT * FROM user WHERE email = '${username}'`;
  var db = getDatabase()

  const [rows, fields] = await db.promise().query(password_check);

  if (rows.length > 0) {
    const queried_pass = rows[0].password;
    const pass_cmpare = await bcrypt.compare(password, queried_pass);
    if (pass_cmpare) {
      req.session.isAuth = true;
      req.session.isUser = true
      res.redirect("/");
    } else {
      error.push("Your password does not match your Email");
      req.flash("login_msg", error);
      res.redirect("/login");
    }
  } else {
    error.push(
      "There is no user with this email, You might want to create an account"
    );
    req.flash("login_msg", error);
    res.redirect("/login");
  }

  res.end();
});

module.exports = router;
