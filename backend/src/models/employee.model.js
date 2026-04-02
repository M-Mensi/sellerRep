const db = require("../config/db");

// Callback-based queries
exports.createEmployee = (employee, callback) => {
  const sql = `
    INSERT INTO "Employees" (name, email, position, department)
    VALUES ($1, $2, $3, $4)
  `;
  db.query(
    sql,
    [employee.name, employee.email, employee.position, employee.department],
    callback,
  );
};

exports.getAllEmployees = (callback) => {
  const sql = 'SELECT * FROM "Employees"';
  db.query(sql, [], callback);
};
