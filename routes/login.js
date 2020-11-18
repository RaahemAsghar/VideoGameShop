const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;

const db = getDatabase();

router.get("/", (req, res) => {
  res.render("login", { msg: req.flash("login_msg") });
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const error = [];

  const password_check = `SELECT * FROM user WHERE email = '${username}'`;
  const [rows, fields] = await db.promise().query(password_check);

  if (rows.length > 0) {
    const queried_pass = rows[0].password;
    console.log(queried_pass);
    const pass_cmpare = await bcrypt.compare(password, queried_pass);
    console.log(pass_cmpare);
    if (pass_cmpare) {
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
