const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;
const resetSession = require("../middleware/middlewares").resetSession;

router.get("/", (req, res) => {
//   if (req.session.isAuth) {
//     res.redirect("/");
//   } else {
    res.render("edit-account", { msg: req.flash("edit_msg"), type: "user" });
//   }
});

// router.get("/logout", (req, res, next) => {
//   resetSession(req, res);
//   res.redirect("/");
// });

router.post("/", async (req, res) => {
    const {
        email,
        password,
        npassword,
        npassword2,
      } = req.body;
  const error = [];

  if (npassword !== npassword2) {
    error.push("New Passwords do not match");
  }

  const password_check = `SELECT * FROM user WHERE email = '${email}'`;
  var db = getDatabase();

  const [rows, fields] = await db.promise().query(password_check);
  if (error.length==0)
  {
  if (rows.length > 0) {
    const queried_pass = rows[0].password;
    console.log(queried_pass);
    console.log(password)
    const pass_cmpare = await bcrypt.compare(password, queried_pass);
    if (pass_cmpare) {
      req.session.isAuth = true;
      req.session.isUser = true;
      const salt = bcrypt.genSaltSync(10);
      const pass_hash = bcrypt.hashSync(npassword, salt);
      const edit_pass = `UPDATE user SET password ='${pass_hashs}' WHERE email = '${email}' `;
      db.query(edit_pass);
      error.push("Succusfully changed");
      req.flash("edit_msg", error);
      res.redirect("/user/edit-account");
    } else {
      error.push("Your password does not match your Email");
      req.flash("edit_msg", error);
      res.redirect("/user/edit-account");
    }
  } else {
    error.push(
      "You have entered Wrong Email!"
    );

  }}

  req.flash("edit_msg", error);
  res.redirect("/user/edit-account");

  res.end();
});

module.exports = router;
