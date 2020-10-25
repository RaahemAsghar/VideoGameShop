const express = require("express");
const app = express();
const PORT = 5000;
const config = require("config");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const connectToDatabase = require("./db/db").connectToDatabase;
const db_conn = require("./db/db").getDatabase();
const authRouter = require("./routes/auth");
const { runInNewContext } = require("vm");

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

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(PORT, () => {
  console.log("Server started at port: ", PORT);
});
