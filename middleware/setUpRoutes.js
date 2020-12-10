const loginRouter = require("../routes/login");
const registerRouter = require("../routes/register");
const adminRouter = require("../routes/admin");
const bcrypt = require('bcryptjs')
const userRouter = require("../routes/user");
const db = require('../db/db').getDatabase()
const usercontroller = require("../controllers/user");
const gameRouter = require('../routes/game')
const cartRouter = require('../routes/cart')
const consoleRouter = require('../routes/console')
const protectedUser = require('../middleware/middlewares').protectedUser

module.exports.setRoutes = function (app) {
  app.use("/login", loginRouter);
  //app.use("/user/edit-account", protectedUser,Accedit);

  app.get("/",usercontroller.allGamesConsoles);
  app.use("/admin", adminRouter);
  app.use('/user',userRouter)
  app.use("/register", registerRouter);
  app.use('/game', gameRouter)
  app.use('/cart', cartRouter)
  app.use('/console', consoleRouter)


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
    res.redirect('/');
  });
};
