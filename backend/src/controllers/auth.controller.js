const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Auth = require("../models/auth.model");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [rows] = await Auth.findUserByEmail(email);

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    // Compare password with hashed password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        employee_id: user.employee_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};
