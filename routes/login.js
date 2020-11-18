const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;

//const router = express.Router();
const db = getDatabase();

router.get("/", (req, res) => {
  res.render("login", { msg: req.flash("login_msg") });
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const error = [];
  

  const password_check = `SELECT * FROM user WHERE email = '${username}'`;
  const [rows, fields] = await db.promise().query(password_check);
  //console.log(rows);
  const queried_pass = rows[0].password;
  //console.log(queried_pass);
  if (rows.length > 0) {
  const pass_cmpare = bcrypt.compare(password,queried_pass);

  if(pass_cmpare)
  {
    res.redirect("/index");

  }else{
    errors.push(
      "Your password does not match your Email"
    );
    req.flash("login_msg", errors);
    res.redirect("/login");
  }
}else{
  errors.push(
    "There is no user with this email, You might want to create an account"
  );
  req.flash("login_msg", errors);
  res.redirect("/login");
}


  res.end();
});

module.exports = router;
