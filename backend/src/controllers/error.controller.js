const ErrorModel = require("../models/error.model");
const ErrorAction = require("../models/errorAction.model");

exports.createError = async (req, res) => {
  try {
    await ErrorModel.createError({
      ...req.body,
      employee_id: req.user.employee_id,
    });

    res.status(201).json({ message: "Issue reported successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getErrors = async (req, res) => {
  try {
    const [rows] = await ErrorModel.getAllErrors();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getErrorTimeline = async (req, res) => {
  try {
    const [timeline] = await ErrorAction.getTimelineByError(req.params.id);
    res.json(timeline);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addErrorAction = async (req, res) => {
  try {
    await ErrorAction.addAction({
      error_id: req.params.id,
      admin_id: req.user.id,
      action: req.body.action,
      status_after: req.body.status_after,
    });

    if (req.body.status_after === "resolved") {
      await ErrorModel.updateErrorStatus(req.params.id, false);
    }

    res.status(201).json({ message: "Action added to timeline" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
