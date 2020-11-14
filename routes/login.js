const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("login", { msg: req.flash("error") });
});

router.post("/", (req, res) => {
  const { username, password } = req.body;

  // make query to database and authorize user
  // make sure to use bcryptjs

  res.end();
});

module.exports = router;
