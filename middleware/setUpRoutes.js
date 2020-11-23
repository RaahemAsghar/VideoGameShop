const loginRouter = require("../routes/login");
const registerRouter = require("../routes/register");
const adminRouter = require("../routes/admin");
const bcrypt = require('bcryptjs')

const db = require('../db/db').getDatabase()


module.exports.setRoutes = function (app) {
  app.use("/login", loginRouter);

  app.get("/", (req, res) => {
    res.render("index");
  });
  app.use("/admin", adminRouter);
  app.use("/register", registerRouter);

  app.get("/make-admin", (req, res) => {
    const first_name = "vgs";
    const last_name = "shop";
    const email = "gameshopbyarsh@gmail.com";
    const password = "admin";

    const salt = bcrypt.genSaltSync(10);
    const pass_hash = bcrypt.hashSync(password, salt);
    const register_query = `INSERT INTO admin
      (first_name, last_name, email, password)
       VALUES ('${first_name}', '${last_name}', '${email}', '${pass_hash}')`;

    db.query(register_query, (err, result) => {
      if (err) throw err;
      console.log("Admin Registered!");
    });

    res.redirect('/')
  });

  app.get("*", (req, res) => {
    res.render("404");
  });
};
