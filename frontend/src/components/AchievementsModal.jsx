import React, { useState, useEffect } from "react";
import { submitAchievement } from "../api/achievements.api";
import "../styles/FormModal.css";

export default function AchievementsModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    achieved_on: "",
    title: "",
    description: "",
    impact: "",
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
      await submitAchievement(form);
      onSubmit?.(form);
      setForm({
        achieved_on: "",
        title: "",
        description: "",
        impact: "",
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
          🏆 Log Achievement
        </h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="achieved_on">Date *</label>
            <input
              id="achieved_on"
              type="date"
              required
              value={form.achieved_on || ""}
              onChange={(e) =>
                setForm({ ...form, achieved_on: e.target.value })
              }
              className="form-input"
            />
          </div>

          <div className="form-row">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              required
              placeholder="Achievement title"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1rem",
            }}
          >
            <div className="form-row">
              <label htmlFor="impact">Impact</label>
              <select
                id="impact"
                value={form.impact || ""}
                onChange={(e) => setForm({ ...form, impact: e.target.value })}
                className="form-input"
              >
                <option value="">Select impact level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              required
              placeholder="Describe your achievement in detail..."
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
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
