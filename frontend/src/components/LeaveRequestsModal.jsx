import React, { useState, useEffect } from "react";
import { submitLeaveRequest } from "../api/leaveRequests.api";
import "../styles/FormModal.css";

export default function LeaveRequestsModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    leave_type: "sick",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await submitLeaveRequest(form);
      onSubmit?.(form);
      setForm({
        start_date: "",
        end_date: "",
        leave_type: "sick",
        reason: "",
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-panel">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <h2 id="modalTitle" className="modal-title">
          📅 Leave Request
        </h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="form-row">
              <label htmlFor="start_date">Start Date *</label>
              <input
                id="start_date"
                type="date"
                required
                value={form.start_date || ""}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label htmlFor="end_date">End Date *</label>
              <input
                id="end_date"
                type="date"
                required
                value={form.end_date || ""}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="leave_type">Leave Type *</label>
            <select
              id="leave_type"
              required
              value={form.leave_type || "sick"}
              onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
              className="form-input"
            >
              <option value="sick">Sick Leave</option>
              <option value="vacation">Vacation</option>
              <option value="personal">Personal</option>
              <option value="maternity">Maternity</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="reason">Reason for Leave *</label>
            <textarea
              id="reason"
              required
              placeholder="Enter reason for leave request..."
              value={form.reason || ""}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="form-input"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
