import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  getAllAttendance,
  getMyAttendance,
  markAttendance,
} from "../api/attendance.api";
import "./Attendance.css";

export default function Attendance() {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    check_in_time: "",
    check_out_time: "",
    status: "present",
    notes: "",
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const isAdmin = user?.role === "admin";
      const res = isAdmin ? await getAllAttendance() : await getMyAttendance();
      setAttendanceData(res.data?.data || []);
    } catch (err) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await markAttendance(formData);
      setFormData({
        check_in_time: "",
        check_out_time: "",
        status: "present",
        notes: "",
      });
      setShowForm(false);
      fetchAttendance();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      present: "green",
      absent: "red",
      late: "orange",
      leave: "blue",
      "half-day": "yellow",
    };
    return badges[status] || "gray";
  };

  if (loading)
    return (
      <div className="attendance-container">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h2>📍 Attendance</h2>
        {user?.role !== "admin" && (
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ Mark Today"}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="attendance-form">
          <div className="form-group">
            <label>Check-in Time</label>
            <input
              type="time"
              value={formData.check_in_time}
              onChange={(e) =>
                setFormData({ ...formData, check_in_time: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Check-out Time</label>
            <input
              type="time"
              value={formData.check_out_time}
              onChange={(e) =>
                setFormData({ ...formData, check_out_time: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="leave">Leave</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Optional notes"
            ></textarea>
          </div>
          <button type="submit" className="btn-primary">
            Mark Attendance
          </button>
        </form>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="attendance-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              {user?.role === "admin" && <th>Employee</th>}
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record) => (
              <tr key={record.id}>
                <td>{new Date(record.attendance_date).toLocaleDateString()}</td>
                {user?.role === "admin" && (
                  <td>{record.employee_name || "N/A"}</td>
                )}
                <td>{record.check_in_time || "—"}</td>
                <td>{record.check_out_time || "—"}</td>
                <td>
                  <span
                    className={`badge badge-${getStatusBadge(record.status)}`}
                  >
                    {record.status}
                  </span>
                </td>
                <td>{record.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
