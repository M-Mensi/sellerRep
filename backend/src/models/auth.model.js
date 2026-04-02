const db = require("../config/db");

// Callback-based query: findUserByEmail(email, callback)
exports.findUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM "Users" WHERE email = $1';
  db.query(sql, [email], callback);
};
