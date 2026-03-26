const express = require("express");
const router = express.Router();
const controller = require("../controllers/leaveRequest.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

// Employee → submit leave
router.post(
  "/",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.createLeaveRequest,
);

// Employee → view own requests
router.get(
  "/mine",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.getMyLeaveRequests,
);

// Admin → view all requests
router.get(
  "/",
  authenticate,
  authorizeRoles("admin"),
  controller.getAllLeaveRequests,
);

// Admin → approve / decline
router.patch(
  "/:id/review",
  authenticate,
  authorizeRoles("admin"),
  controller.reviewLeaveRequest,
);

module.exports = router;
