import React, { useState, useEffect } from "react";
import { submitClient } from "../api/clients.api";
import "../styles/FormModal.css";

export default function ClientsModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    client_name: "",
    contact_person: "",
    email: "",
    phone: "",
    industry: "",
    status: "active",
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
      await submitClient(form);
      onSubmit?.(form);
      setForm({
        client_name: "",
        contact_person: "",
        email: "",
        phone: "",
        industry: "",
        status: "active",
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
          👥 Add Client
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
              <label htmlFor="client_name">Client Name *</label>
              <input
                id="client_name"
                type="text"
                required
                placeholder="Company or client name"
                value={form.client_name || ""}
                onChange={(e) =>
                  setForm({ ...form, client_name: e.target.value })
                }
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label htmlFor="contact_person">Contact Person *</label>
              <input
                id="contact_person"
                type="text"
                required
                placeholder="Primary contact name"
                value={form.contact_person || ""}
                onChange={(e) =>
                  setForm({ ...form, contact_person: e.target.value })
                }
                className="form-input"
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="form-row">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                required
                placeholder="Contact email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label htmlFor="phone">Phone *</label>
              <input
                id="phone"
                type="tel"
                required
                placeholder="Contact phone number"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="form-row">
              <label htmlFor="industry">Industry</label>
              <input
                id="industry"
                type="text"
                placeholder="e.g., Technology, Finance, Healthcare"
                value={form.industry || ""}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status || "active"}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="form-input"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="prospect">Prospect</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Add Client"}
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
