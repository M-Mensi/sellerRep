const db = require("../config/db");

// Callback-based queries
exports.createClient = (client, callback) => {
  const sql = `
    INSERT INTO "Clients" (employee_id, company_name, contact_person, email, phone, industry, location, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;
  db.query(
    sql,
    [
      client.employee_id,
      client.company_name || client.company,
      client.contact_person || client.name,
      client.email,
      client.phone,
      client.industry,
      client.location,
      client.status || "active",
    ],
    callback,
  );
};

exports.getClientsByEmployee = (employeeId, callback) => {
  const sql = 'SELECT * FROM "Clients" WHERE employee_id = $1';
  db.query(sql, [employeeId], callback);
};

exports.getAllClients = (callback) => {
  const sql = `
    SELECT c.*, e.name AS employee_name
    FROM "Clients" c
    JOIN "Employees" e ON c.employee_id = e.id
  `;
  db.query(sql, [], callback);
};
