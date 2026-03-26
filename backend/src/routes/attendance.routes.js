const express = require("express");
const router = express.Router();
const controller = require("../controllers/attendance.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "employee"),
  controller.createAttendance,
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  controller.getEmployeeAttendance,
);

module.exports = router;
