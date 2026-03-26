const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3001", "http://192.168.1.10:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/employees", require("./routes/employee.routes"));
app.use("/api/attendance", require("./routes/attendance.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/clients", require("./routes/client.routes"));
app.use("/api/errors", require("./routes/error.routes"));
app.use("/api/leave-requests", require("./routes/leaveRequest.routes"));
app.use("/api/achievements", require("./routes/achievement.routes"));
app.use("/api/daily-tracker", require("./routes/dailyTracker.routes"));

module.exports = app;
