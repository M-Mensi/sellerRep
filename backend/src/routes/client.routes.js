const express = require("express");
const router = express.Router();
const controller = require("../controllers/client.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const {
  validateClient,
  handleValidationErrors,
} = require("../middleware/validation.middleware");

// Admin & employee can create clients
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "employee"),
  validateClient,
  handleValidationErrors,
  controller.createClient,
);

// Employee → own clients | Admin → by employee id
router.get(
  "/employee/:employeeId",
  authenticate,
  authorizeRoles("admin", "employee"),
  controller.getClientsByEmployee,
);

// Employee & Admin → view all clients (for dashboards)
router.get(
  "/",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.getAllClients,
);

module.exports = router;
