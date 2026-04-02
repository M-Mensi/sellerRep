const Client = require("../models/client.model");

// Callback-based controllers
exports.createClient = (req, res, next) => {
  Client.createClient(req.body, (err, result) => {
    if (err) return next(err);
    res.status(201).json({ message: "Client created successfully" });
  });
};

exports.getClientsByEmployee = (req, res, next) => {
  const employeeId =
    req.user.role === "employee" ? req.user.employee_id : req.params.employeeId;

  Client.getClientsByEmployee(employeeId, (err, result) => {
    if (err) return next(err);
    const rows = result.rows || [];
    res.json(rows);
  });
};

exports.getAllClients = (req, res, next) => {
  Client.getAllClients((err, result) => {
    if (err) return next(err);
    const rows = result.rows || [];
    res.json(rows);
  });
};
