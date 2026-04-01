const Employee = require("../models/employee.model");

exports.createEmployee = async (req, res, next) => {
  try {
    await Employee.createEmployee(req.body);
    res.status(201).json({ message: "Employee created successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    const [rows] = await Employee.getAllEmployees();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
