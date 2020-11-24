const bcrypt = require("bcryptjs");
const getDatabase = require("../db/db").getDatabase;
const resetSession = require("../middleware/middlewares").resetSession;

module.exports.adminLoginGET = function (req, res) {
  if (req.session.isAuth) {
    res.redirect("/admin");
    res.end();
  } else {
    res.render("login", { msg: req.flash("login_msg"), type: "admin" });
  }
};

module.exports.adminLoginPOST = async (req, res) => {
  const { username, password } = req.body;

  const error = [];

  const password_check = `SELECT * FROM admin WHERE email = '${username}'`;
  var db = getDatabase();
  const [rows, fields] = await db.promise().query(password_check);

  if (rows.length > 0) {
    const queried_pass = rows[0].password;
    db = getDatabase();
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
};

module.exports.adminLogout = function (req, res) {
  resetSession(req, res);
  res.redirect("/admin");
};

module.exports.getDashboard = function (req, res) {
  res.render("admin/dashboard");
};
//Game Controllers
module.exports.showAddGameForm = function (req, res) {
  res.render("admin/games/add-game");
};

module.exports.addGame = async (req, res) => {
  console.log(req.body)
  //console.log(title)
  const stock = 0;
  const add_query = `INSERT INTO game
    (title, description, tags, sale_price, rent_price, platform, image_url, stock)
     VALUES ('${req.body.title}', '${req.body.description}', '${req.body.tags}', '${req.body.sale_price}', '${req.body.rent_price}', '${req.body.platform}', '${req.body.image}', '${stock}')`;
  var db = getDatabase();
  db.query(add_query, (err, result) => {
    if (err) throw err;
    console.log("Item added!");
  });

  //req.flash("login_msg", "Item added successfully!");
  res.redirect("/admin/add-game");
};

module.exports.allGames = (req,res)=>{
    res.render('admin/games/all-games')
}
//End Game Controllers


//Console Controllers
module.exports.showAddConsoleForm = (req, res) => {
  res.render("admin/consoles/add-console");
};

module.exports.addConsole = (req, res) => {
  const { name, sale_price, image, tags, description } = req.body;
  const stock = 0;

  const add_query = `INSERT INTO console
    (name, description, tags, sale_price,image_url, stock) 
    VALUES 
    ('${name}', '${description}', '${tags}', '${sale_price}', '${image}','${stock}')`;
  var db = getDatabase();

  db.query(add_query, (err, result) => {
    if (err) throw err;
    console.log("Item added!");
  });

  res.redirect("/admin/add-console");

};

module.exports.allConsoles = (req,res)=>{
    res.render('admin/consoles/all-consoles')
}

//End Console Controllers


module.exports.categories = (req, res) => {
  res.render("admin/games/categories");
};

module.exports.manufacturers = (req,res)=>{
    res.render("admin/consoles/manufacturers");
   
}