const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;

const db = getDatabase();

router.get("/login", (req, res) => {
  res.render("login", { msg: req.flash("login_msg"),type:'admin' });
});



module.exports = router;
