import React, { useState, useEffect } from "react";
import { submitDailyTracker } from "../api/dailyTracker.api";
import { useAuth } from "../auth/AuthContext";
import "../styles/FormModal.css";

export default function DailyTrackerModal({ isOpen, onClose, onSubmit }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    activity_date: "",
    calls: 0,
    emails: 0,
    connects: 0,
    new_clients: 0,
    notes: "",
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
    console.log("Handling form submission with data:", form);
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      console.log(
        "Submitting daily tracker with form data: DailyTrackerModal",
        form,
      );
      console.log("employee_id:", user?.employee_id);
      const formData = { ...form, employee_id: user?.employee_id };
      await submitDailyTracker(formData);
      onSubmit?.(formData);
      setForm({
        activity_date: "",
        calls: 0,
        emails: 0,
        connects: 0,
        new_clients: 0,
        notes: "",
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
          📝 Daily Tracker
        </h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="activity_date">Activity Date *</label>
            <input
              id="activity_date"
              type="date"
              required
              value={form.activity_date || ""}
              onChange={(e) =>
                setForm({ ...form, activity_date: e.target.value })
              }
              className="form-input"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="form-row">
              <label htmlFor="calls">Calls</label>
              <input
                id="calls"
                type="number"
                min="0"
                value={form.calls || 0}
                onChange={(e) =>
                  setForm({ ...form, calls: parseInt(e.target.value) || 0 })
                }
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label htmlFor="emails">Emails</label>
              <input
                id="emails"
                type="number"
                min="0"
                value={form.emails || 0}
                onChange={(e) =>
                  setForm({ ...form, emails: parseInt(e.target.value) || 0 })
                }
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label htmlFor="connects">Connects</label>
              <input
                id="connects"
                type="number"
                min="0"
                value={form.connects || 0}
                onChange={(e) =>
                  setForm({ ...form, connects: parseInt(e.target.value) || 0 })
                }
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label htmlFor="new_clients">New Clients</label>
              <input
                id="new_clients"
                type="number"
                min="0"
                value={form.new_clients || 0}
                onChange={(e) =>
                  setForm({
                    ...form,
                    new_clients: parseInt(e.target.value) || 0,
                  })
                }
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              placeholder="Add any notes or comments..."
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
