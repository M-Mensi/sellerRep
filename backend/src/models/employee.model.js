const db = require("../config/db");

exports.createEmployee = (employee) => {
  const sql = `
    INSERT INTO Employees (name, email, position, department)
    VALUES (?, ?, ?, ?)
  `;
  return db.execute(sql, [
    employee.name,
    employee.email,
    employee.position,
    employee.department,
  ]);
};

exports.getAllEmployees = () => {
  return db.execute("SELECT * FROM Employees");
};
