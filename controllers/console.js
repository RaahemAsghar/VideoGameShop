const getDatabase = require("../db/db").getDatabase;

module.exports.getConsole = async (req, res) => {
  const console_id = req.params.id;
  console.log(console_id)
  const get_q = `SELECT * FROM console WHERE id=${console_id}`;
  console.log(get_q)
  const db = getDatabase();
  const [rows, fields] = await db.promise().query(get_q);
  console.log(rows);
  if (rows.length > 0) {
    res.render("console", { data: rows[0] });
  } else {
    res.redirect("/");
  }
};
