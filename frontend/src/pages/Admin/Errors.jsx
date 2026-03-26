import { useState, useEffect } from "react";
import { getAllErrors, updateError, deleteError } from "../../api/errors.api";
import "./Errors.css";

export default function Errors() {
  const [errors, setErrors] = useState([]);
  const [form, setForm] = useState({
    error_code: "",
    error_message: "",
    severity: "low",
    description: "",
    status: "open",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchErrors();
  }, []);

  const fetchErrors = async () => {
    try {
      setLoading(true);
      const res = await getAllErrors();
      setErrors(res.data);
    } catch (error) {
      console.error("Error fetching errors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (editingId) {
      await updateError(editingId, form);
      alert("Error updated!");
      setEditingId(null);
    }
    setForm({
      error_code: "",
      error_message: "",
      severity: "low",
      description: "",
      status: "open",
    });
    await fetchErrors();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteError(id);
      alert("Error deleted!");
      await fetchErrors();
    }
  };

  const handleEdit = (error) => {
    setForm(error);
    setEditingId(error.id);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="errors-container">
      <div className="errors-header">
        <h2>Errors Management</h2>
      </div>
      <div className="error-form">
        <h3>{editingId ? "Edit Error" : "Add New Error"}</h3>
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="error_code">Error Code</label>
              <input
                id="error_code"
                type="text"
                placeholder="Enter error code"
                value={form.error_code || ""}
                onChange={(e) =>
                  setForm({ ...form, error_code: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="error_message">Error Message</label>
              <input
                id="error_message"
                type="text"
                placeholder="Enter error message"
                value={form.error_message || ""}
                onChange={(e) =>
                  setForm({ ...form, error_message: e.target.value })
                }
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="severity">Severity</label>
              <select
                id="severity"
                value={form.severity || "low"}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status || "open"}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter detailed description"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="button-group">
            <button className="submit-btn" onClick={handleSubmit}>
              {editingId ? "Update" : "Add"} Error
            </button>
            {editingId && (
              <button className="cancel-btn" onClick={() => setEditingId(null)}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Error Code</th>
              <th>Message</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((error) => (
              <tr key={error.id}>
                <td>{error.error_code}</td>
                <td>{error.error_message}</td>
                <td>
                  <span className={`severity-badge severity-${error.severity}`}>
                    {error.severity}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${error.status}`}>
                    {error.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(error)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(error.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
