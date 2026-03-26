import { useState, useEffect } from "react";
import {
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} from "../../api/employees.api";
import "./Employees.css";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getAllEmployees();
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (editingId) {
      await updateEmployee(editingId, form);
      alert("Employee updated!");
      setEditingId(null);
    }
    setForm({ name: "", email: "", phone: "", department: "", position: "" });
    await fetchEmployees();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteEmployee(id);
      alert("Employee deleted!");
      await fetchEmployees();
    }
  };

  const handleEdit = (employee) => {
    setForm(employee);
    setEditingId(employee.id);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="employees-container">
      <div className="employees-header">
        <h2>Employees Management</h2>
      </div>
      <div className="employee-form">
        <h3>{editingId ? "Edit Employee" : "Add New Employee"}</h3>
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter employee name"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                type="text"
                placeholder="Enter department"
                value={form.department || ""}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                id="position"
                type="text"
                placeholder="Enter position"
                value={form.position || ""}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              />
            </div>
          </div>
          <div className="button-group">
            <button className="submit-btn" onClick={handleSubmit}>
              {editingId ? "Update" : "Add"} Employee
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
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department}</td>
                <td>{emp.position}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(emp.id)}
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
