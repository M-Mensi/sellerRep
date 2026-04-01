import { useState, useEffect } from "react";
import {
  getAllErrors,
  getErrorTimeline,
  addErrorAction,
  createError,
} from "../api/errors.api";
import "./Errors.css";

export default function Errors() {
  const [errors, setErrors] = useState([]);
  const [selectedError, setSelectedError] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    sub_category: "",
    description: "",
    is_repeated: false,
    severity: "medium",
  });
  const [actionData, setActionData] = useState({
    action: "",
    status_after: "open",
  });

  useEffect(() => {
    fetchErrors();
  }, []);

  const fetchErrors = async () => {
    try {
      setLoading(true);
      const res = await getAllErrors();
      setErrors(res.data?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async (errorId) => {
    try {
      const res = await getErrorTimeline(errorId);
      setTimeline(res.data?.timeline || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReportError = async (e) => {
    e.preventDefault();
    try {
      await createError(formData);
      setFormData({
        category: "",
        sub_category: "",
        description: "",
        is_repeated: false,
        severity: "medium",
      });
      setShowForm(false);
      fetchErrors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddAction = async (e) => {
    e.preventDefault();
    try {
      await addErrorAction(selectedError.id, actionData);
      fetchTimeline(selectedError.id);
      setActionData({ action: "", status_after: "open" });
    } catch (err) {
      setError(err.message);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "blue",
      medium: "yellow",
      high: "orange",
      critical: "red",
    };
    return colors[severity] || "gray";
  };

  if (loading)
    return (
      <div className="errors-container">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="errors-container">
      <div className="errors-header">
        <h2>🐛 Error Tracking</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Report Error"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleReportError} className="error-form">
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              <option value="System">System</option>
              <option value="Process">Process</option>
              <option value="Training">Training</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Sub-Category</label>
            <input
              type="text"
              value={formData.sub_category}
              onChange={(e) =>
                setFormData({ ...formData, sub_category: e.target.value })
              }
              placeholder="e.g., Database, UI, Integration"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              placeholder="Describe the error in detail"
            ></textarea>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_repeated}
                onChange={(e) =>
                  setFormData({ ...formData, is_repeated: e.target.checked })
                }
              />
              Is this a recurring issue?
            </label>
          </div>
          <div className="form-group">
            <label>Severity</label>
            <select
              value={formData.severity}
              onChange={(e) =>
                setFormData({ ...formData, severity: e.target.value })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Report Error
          </button>
        </form>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="errors-list">
        {errors.map((err) => (
          <div key={err.id} className="error-card">
            <div className="error-header-card">
              <h3>
                {err.category} - {err.sub_category}
              </h3>
              <span className={`badge badge-${getSeverityColor(err.severity)}`}>
                {err.severity}
              </span>
            </div>
            <p>{err.description}</p>
            <div className="error-meta">
              <span>Status: {err.status}</span>
              <span>
                Reported: {new Date(err.created_at).toLocaleDateString()}
              </span>
              {err.is_repeated && (
                <span className="badge badge-orange">Recurring</span>
              )}
            </div>
            <div className="error-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setSelectedError(err);
                  fetchTimeline(err.id);
                  setShowTimeline(!showTimeline);
                }}
              >
                View Timeline
              </button>
            </div>

            {showTimeline && selectedError?.id === err.id && (
              <div className="timeline-section">
                <h4>Resolution Timeline</h4>
                <div className="timeline">
                  {timeline.map((action) => (
                    <div key={action.id} className="timeline-item">
                      <div className="timeline-date">
                        {new Date(action.created_at).toLocaleDateString()}
                      </div>
                      <div className="timeline-content">
                        <p>
                          <strong>{action.admin_email}</strong>
                        </p>
                        <p>{action.action}</p>
                        {action.status_after && (
                          <p className="status-badge">
                            Status: {action.status_after}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Admin Action Form */}
                <form onSubmit={handleAddAction} className="action-form">
                  <div className="form-group">
                    <label>Add Action</label>
                    <textarea
                      value={actionData.action}
                      onChange={(e) =>
                        setActionData({ ...actionData, action: e.target.value })
                      }
                      required
                      placeholder="Describe what was done to resolve..."
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Status After Action</label>
                    <select
                      value={actionData.status_after}
                      onChange={(e) =>
                        setActionData({
                          ...actionData,
                          status_after: e.target.value,
                        })
                      }
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary">
                    Add Action
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
