const loginRouter = require("../routes/login");
const registerRouter = require("../routes/register");
module.exports = function (app) {
  app.use("/login", loginRouter);

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.use("/register", registerRouter);

  app.get("*", (req, res) => {
    res.render("404");
  });
};
