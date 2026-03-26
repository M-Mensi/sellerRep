const Client = require("../models/client.model");

exports.createClient = async (req, res) => {
  try {
    await Client.createClient(req.body);
    res.status(201).json({ message: "Client created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClientsByEmployee = async (req, res) => {
  try {
    const employeeId =
      req.user.role === "employee"
        ? req.user.employee_id
        : req.params.employeeId;

    const [rows] = await Client.getClientsByEmployee(employeeId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const [rows] = await Client.getAllClients();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
