const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const {
  validateLogin,
  handleValidationErrors,
} = require("../middleware/validation.middleware");

router.post("/login", validateLogin, handleValidationErrors, controller.login);

module.exports = router;
