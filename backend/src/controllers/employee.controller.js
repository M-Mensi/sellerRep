const Employee = require("../models/employee.model");

// Callback-based controllers
exports.createEmployee = (req, res, next) => {
  Employee.createEmployee(req.body, (err, result) => {
    if (err) return next(err);
    res.status(201).json({ message: "Employee created successfully" });
  });
};

exports.getEmployees = (req, res, next) => {
  Employee.getAllEmployees((err, result) => {
    if (err) return next(err);
    const rows = result.rows || [];
    res.json(rows);
  });
};
