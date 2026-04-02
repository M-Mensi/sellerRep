const { body, param, query, validationResult } = require("express-validator");

// Validation error handler
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth validations
exports.validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Daily Tracker validations
exports.validateDailyTracker = [
  body("activity_date").isISO8601().withMessage("Valid date is required"),
  body("calls")
    .isInt({ min: 0 })
    .withMessage("Calls must be a non-negative integer"),
  body("emails")
    .isInt({ min: 0 })
    .withMessage("Emails must be a non-negative integer"),
  body("connects")
    .isInt({ min: 0 })
    .withMessage("Connects must be a non-negative integer"),
  body("new_clients")
    .isInt({ min: 0 })
    .withMessage("New clients must be a non-negative integer"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be 500 characters or less"),
];

// Achievement validations
exports.validateAchievement = [
  body("achieved_on").isISO8601().withMessage("Valid date is required"),
  body("title")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Title must be between 3 and 255 characters"),
  body("description")
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage("Description must be between 5 and 1000 characters"),
  body("impact")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Impact must be low, medium, or high"),
];

// Leave Request validations
exports.validateLeaveRequest = [
  body("request_type")
    .isIn(["leave", "equipment", "training", "other"])
    .withMessage("Invalid request type"),
  body("start_date").isISO8601().withMessage("Valid start date is required"),
  body("end_date")
    .isISO8601()
    .withMessage("Valid end date is required")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.start_date)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("leave_type")
    .optional()
    .isIn(["annual", "sick", "unpaid", "maternity", "paternity"])
    .withMessage("Invalid leave type"),
  body("reason")
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Reason must be between 5 and 500 characters"),
];

// Client validations
exports.validateClient = [
  body("client_name")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Client name must be between 3 and 255 characters"),
  body("contact_person")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Contact person must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("phone")
    .trim()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage("Valid phone number is required"),
  body("industry")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Industry must be 100 characters or less"),
  body("status")
    .isIn(["active", "inactive", "prospect"])
    .withMessage("Status must be active, inactive, or prospect"),
];

// ID parameter validation
exports.validateId = [param("id").isInt({ min: 1 }).withMessage("Invalid ID")];
