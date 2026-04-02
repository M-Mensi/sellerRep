const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Auth = require("../models/auth.model");

// Callback-based login controller
exports.login = (req, res, next) => {
  console.log("Login request received with body:", req.body);
  const { email, password } = req.body;

  // Find user by email using callback
  Auth.findUserByEmail(email, (err, result) => {
    if (err) {
      console.error("Database error:", err.message);
      return next(err);
    }

    const rows = result.rows || [];
    console.log("User query result:", rows);

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    if (password === user.password_hash) {
      console.log("Password match (plaintext) for user:", email);
      // Generate JWT token
      console.log("Password match for user:", email);
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          employee_id: user.employee_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
      );

      console.log("Generated JWT token for user:", email);
      res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role },
      });
    }

    /*
    // Compare password with hashed password using bcrypt
    bcrypt.compare(password, user.password_hash, (bcryptErr, isMatch) => {
      if (bcryptErr) {
        console.error("Bcrypt error:", bcryptErr.message);
        return next(bcryptErr);
      }

      if (!isMatch) {
        console.log(
          "Password mismatch for user:",
          email,
          password,
          user.password_hash,
        );
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      console.log("Password match for user:", email);
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          employee_id: user.employee_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
      );

      console.log("Generated JWT token for user:", email);
      res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role },
      });
    });

    */
  });
};
