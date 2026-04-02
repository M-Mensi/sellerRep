const ErrorModel = require("../models/error.model");
const ErrorAction = require("../models/errorAction.model");

// Callback-based controllers
exports.createError = (req, res, next) => {
  ErrorModel.createError(
    {
      ...req.body,
      employee_id: req.user.employee_id,
    },
    (err, result) => {
      if (err) return next(err);
      res.status(201).json({ message: "Issue reported successfully" });
    },
  );
};

exports.getErrors = (req, res, next) => {
  ErrorModel.getAllErrors((err, result) => {
    if (err) return next(err);
    const rows = result.rows || [];
    res.json(rows);
  });
};

exports.getErrorTimeline = (req, res, next) => {
  ErrorAction.getTimelineByError(req.params.id, (err, result) => {
    if (err) return next(err);
    const timeline = result.rows || [];
    res.json(timeline);
  });
};

exports.addErrorAction = (req, res, next) => {
  ErrorAction.addAction(
    {
      error_id: req.params.id,
      action_by: req.user.id,
      action_type: req.body.action_type || "comment",
      action_text: req.body.action,
    },
    (err, result) => {
      if (err) return next(err);

      if (req.body.status_after === "resolved") {
        ErrorModel.updateErrorStatus(req.params.id, "resolved", (updateErr) => {
          if (updateErr) return next(updateErr);
          res.status(201).json({ message: "Action added to timeline" });
        });
      } else {
        res.status(201).json({ message: "Action added to timeline" });
      }
    },
  );
};
