const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3001", "http://192.168.1.10:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    maxAge: 3600,
  }),
);

// Body parser with size limits
app.use(express.json({ limit: "10kb" }));

// Rate limiting for general API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use("/api/", generalLimiter);

// Rate limiting for auth (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later",
  skipSuccessfulRequests: true,
});
app.use("/api/auth/login", authLimiter);

app.use("/api/employees", require("./routes/employee.routes"));
app.use("/api/attendance", require("./routes/attendance.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/clients", require("./routes/client.routes"));
app.use("/api/errors", require("./routes/error.routes"));
app.use("/api/leave-requests", require("./routes/leaveRequest.routes"));
app.use("/api/achievements", require("./routes/achievement.routes"));
app.use("/api/daily-tracker", require("./routes/dailyTracker.routes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  const statusCode = err.status || 500;
  const message =
    process.env.NODE_ENV === "production" ? "An error occurred" : err.message;
  res.status(statusCode).json({ error: message });
});

module.exports = app;
