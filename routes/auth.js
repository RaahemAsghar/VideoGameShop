const express = require("express");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login", { msg: req.flash("error") });
});

module.exports = router;
