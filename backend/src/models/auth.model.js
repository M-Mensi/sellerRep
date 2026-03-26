const db = require("../config/db");

exports.findUserByEmail = (email) => {
  return db.execute("SELECT * FROM Users WHERE email = ?", [email]);
};
