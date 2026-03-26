import { useState } from "react";
import { submitLeaveRequest } from "../api/leaveRequests.api";
import "./LeaveRequests.css";

export default function LeaveRequests() {
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    leave_type: "sick",
    reason: "",
    status: "pending",
  });

  const submit = async () => {
    await submitLeaveRequest(form);
    alert("Leave request submitted!");
  };

  return (
    <div className="leave-requests-container">
      <div className="leave-requests-header">
        <h2>Leave Requests</h2>
      </div>
      <div className="leave-form">
        <h3>Submit New Leave Request</h3>
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>
              <input
                id="start_date"
                type="date"
                value={form.start_date || ""}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                id="end_date"
                type="date"
                value={form.end_date || ""}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="leave_type">Leave Type</label>
              <select
                id="leave_type"
                value={form.leave_type || "sick"}
                onChange={(e) =>
                  setForm({ ...form, leave_type: e.target.value })
                }
              >
                <option value="sick">Sick Leave</option>
                <option value="vacation">Vacation</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="reason">Reason</label>
            <textarea
              id="reason"
              placeholder="Enter reason for leave request"
              value={form.reason || ""}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>
          <button className="submit-btn" onClick={submit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
