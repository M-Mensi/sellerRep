const Client = require("../models/client.model");

exports.createClient = async (req, res, next) => {
  try {
    await Client.createClient(req.body);
    res.status(201).json({ message: "Client created successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getClientsByEmployee = async (req, res, next) => {
  try {
    const employeeId =
      req.user.role === "employee"
        ? req.user.employee_id
        : req.params.employeeId;

    const [rows] = await Client.getClientsByEmployee(employeeId);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getAllClients = async (req, res, next) => {
  try {
    const [rows] = await Client.getAllClients();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
