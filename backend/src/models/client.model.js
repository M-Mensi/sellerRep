const db = require("../config/db");

exports.createClient = (client) => {
  const sql = `
    INSERT INTO Clients (employee_id, name, email, phone, company, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return db.execute(sql, [
    client.employee_id,
    client.name,
    client.email,
    client.phone,
    client.company,
    client.notes,
  ]);
};

exports.getClientsByEmployee = (employeeId) => {
  return db.execute("SELECT * FROM Clients WHERE employee_id = ?", [
    employeeId,
  ]);
};

exports.getAllClients = () => {
  return db.execute(`
    SELECT c.*, e.name AS employee_name
    FROM Clients c
    JOIN Employees e ON c.employee_id = e.id
  `);
};
