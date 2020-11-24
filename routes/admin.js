const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;
const protectedRouteAdmin = require("../middleware/middlewares").protectedAdmin;
const resetSession = require("../middleware/middlewares").resetSession;

const db = getDatabase();

router.get("/login", (req, res) => {
  if (req.session.isAuth) {
    res.redirect("/admin");
    res.end();
  } else {
    res.render("login", { msg: req.flash("login_msg"), type: "admin" });
  }
});

router.get("/logout", (req, res) => {
  resetSession(req, res);
  res.redirect("/admin");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const error = [];

  const password_check = `SELECT * FROM admin WHERE email = '${username}'`;
  const [rows, fields] = await db.promise().query(password_check);

  if (rows.length > 0) {
    const queried_pass = rows[0].password;
    const pass_cmpare = await bcrypt.compare(password, queried_pass);
    if (pass_cmpare) {
      req.session.isAdmin = true;
      req.session.isAuth = true;
      res.redirect("/admin/dashboard");
    } else {
      error.push("Your password does not match your Email");
      req.flash("login_msg", error);
      res.redirect("/admin/login");
    }
  } else {
    error.push(
      "There is no user with this email, You might want to create an account"
    );
    req.flash("login_msg", error);
    res.redirect("/admin/login");
  }

  res.end();
});

router.get("/dashboard", /*protectedRouteAdmin,*/ (req, res) => {
  res.render("admin/dashboard");
});

router.get("/add-game", /*protectedRouteAdmin,*/ (req, res) => {
  res.render("admin/games/add-game");
});

<<<<<<< HEAD
router.get("/add-console", /*protectedRouteAdmin,*/ (req, res) => {
  res.render("admin/consoles/add-console");
=======
router.post("/add-game", async (req, res) => {
  //console.log(req.body.post_title)
  //console.log(title)
  const stock = 0;
  const add_query = `INSERT INTO game
    (title, description, tags, sale_price, rent_price, platform, image_url, stock)
     VALUES ('${req.body.title}', '${req.body.description}', '${req.body.tags}', '${req.body.sale_price}', '${req.body.rent_price}', '${req.body.platform}', '${req.body.image}', '${stock}')`;

    db.query(add_query, (err, result) => {
      if (err) throw err;
      console.log("Item added!");
    });

    //req.flash("login_msg", "Item added successfully!");
    res.redirect("/admin/add-game");
});

router.get("/consoles", /*protectedRouteAdmin,*/ (req, res) => {
  res.render("admin/consoles");
>>>>>>> fe5e760c211a64780c8c1ec38150f3da686850dc
});
router.get('/categories',(req,res)=>{
  res.render('admin/games/categories')
})

router.get("*", (req, res) => {
  res.redirect("/admin/dashboard");
});

module.exports = router;
