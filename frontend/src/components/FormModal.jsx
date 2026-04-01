import React, { useEffect } from "react";
import "../styles/FormModal.css";

export default function FormModal({ form, isOpen, onClose }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !form) return null;

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
          title="Close"
        >
          ×
        </button>

        <h2 id="modalTitle" className="modal-title">
          {form.title}
        </h2>

        <form
          className="modal-form"
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: Handle form submission
            console.log("Form submitted:", form);
            alert(`Form "${form.title}" submitted successfully!`);
            onClose();
          }}
        >
          <div className="form-row">
            <label htmlFor="formName">Form Type</label>
            <input
              type="text"
              id="formName"
              value={form.title}
              readOnly
              className="form-input"
            />
          </div>

          <div className="form-row">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Provide details for this submission..."
              rows="5"
              className="form-input"
              required
            ></textarea>
          </div>

          <div className="form-row form-checkbox-group">
            <label className="form-checkbox">
              <input type="checkbox" name="urgent" />
              <span>Mark as urgent</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Submit
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
