const loginRouter = require("../routes/login");
const registerRouter = require("../routes/register");
const adminRouter = require("../routes/register");

module.exports = function (app) {
  app.use("/login", loginRouter);

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.use('/admin', (req, res)=>{

  })


  app.use("/register", registerRouter);
  app.get("/dashboard", (req, res) => {
    res.render("admin/dashboard");
  });
  app.get("*", (req, res) => {
    res.render("404");
  });
};
