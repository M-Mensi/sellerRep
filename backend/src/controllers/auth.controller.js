const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Auth = require("../models/auth.model");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await Auth.findUserByEmail(email);
    console.log("User lookup result:", rows);
    console.log("Provided email:", email);
    console.log("Provided password:", password);

    if (!rows.length) return res.status(401).json({ message: "Invalid Email" });

    const user = rows[0];

    const isMatch = password === user.password; // For demonstration only. Use bcrypt in production.
    console.log("Password match result:", isMatch);

    if (!isMatch) return res.status(401).json({ message: "Invalid Password" });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        employee_id: user.employee_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
