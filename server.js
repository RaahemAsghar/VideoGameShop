const express = require("express");
const app = express();
const PORT = 5000;
const config = require("config");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const setRoutes = require("./middleware/setUpRoutes");
const connectToDatabase = require("./db/db").connectToDatabase;
const db_conn = require("./db/db").getDatabase();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: `${config.get("session_secret")}`,
    saveUninitialized: false,
    resave: true,
    cookie: { secure: true },
  })
);

app.use(flash());

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

const db = connectToDatabase();

setRoutes(app);

app.listen(PORT, () => {
  console.log("Server started at port: ", PORT);
});
