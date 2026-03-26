const Employee = require("../models/employee.model");

exports.createEmployee = async (req, res) => {
  try {
    await Employee.createEmployee(req.body);
    res.status(201).json({ message: "Employee created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const [rows] = await Employee.getAllEmployees();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
