const express = require("express");
const router = express.Router();
const controller = require("../controllers/leaveRequest.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const {
  validateLeaveRequest,
  validateId,
  handleValidationErrors,
} = require("../middleware/validation.middleware");

// Employee → submit leave
router.post(
  "/",
  authenticate,
  authorizeRoles("employee", "admin"),
  validateLeaveRequest,
  handleValidationErrors,
  controller.createLeaveRequest,
);

// Employee → view own requests
router.get(
  "/mine",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.getMyLeaveRequests,
);

// Employee & Admin → view all requests (for dashboards)
router.get(
  "/",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.getAllLeaveRequests,
);

// Admin only → approve / decline
router.patch(
  "/:id/review",
  authenticate,
  authorizeRoles("admin"),
  validateId,
  handleValidationErrors,
  controller.reviewLeaveRequest,
);

module.exports = router;
