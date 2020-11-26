const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;


router.get("/", (req, res) => {
  if(req.session.isAuth){
    res.redirect('/')
  }
  else{
    res.render("register", { msg: req.flash("register_msg") });
  }
});

router.post("/", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    address,
    phone,
    password,
    password2,
  } = req.body;

  const errors = [];

  if (password.length < 8) {
    errors.push("Length of the password must be atleast 8");
  }

  if (password !== password2) {
    errors.push("Passwords do not match");
  }

  //Check for a user with same email in the Database
  const existing_user_q = `SELECT * FROM user WHERE email = '${email}'`;
  var db = getDatabase();

  const [rows, fields] = await db.promise().query(existing_user_q);

  if (rows.length > 0) {
    errors.push(
      "A user with this Email already exists. Please use a different Email."
    );
  }
  ///

  if (errors.length > 0) {
    req.flash("register_msg", errors);
    res.redirect("/register");
  } else {
    const salt = bcrypt.genSaltSync(10);
    const pass_hash = bcrypt.hashSync(password, salt);
    const register_query = `INSERT INTO user
    (first_name, last_name, email, password, address, phone_number, credits)
     VALUES ('${first_name}', '${last_name}', '${email}', '${pass_hash}', '${address}', '${phone}','0')`;
     db = getDatabase();

    db.query(register_query, (err, result) => {
      if (err) throw err;
      console.log("User Registered!");
    });

    req.flash("login_msg", "Congratulations! You can login now!");
    res.redirect("/login");
  }
});

module.exports = router;
