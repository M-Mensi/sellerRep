import { useState } from "react";
import { submitDailyTracker } from "../api/dailyTracker.api";
import "./DailyTracker.css";

export default function DailyTracker() {
  const [form, setForm] = useState({
    activity_date: "",
    calls: 0,
    emails: 0,
    connects: 0,
    new_clients: 0,
    notes: "",
  });

  const submit = async () => {
    await submitDailyTracker(form);
    alert("Saved!");
  };

  return (
    <div className="daily-tracker-container">
      <div className="tracker-card">
        <h2>Daily Tracker</h2>
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="activity_date">Activity Date</label>
              <input
                id="activity_date"
                type="date"
                value={form.activity_date || ""}
                onChange={(e) =>
                  setForm({ ...form, activity_date: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="calls">Calls</label>
              <input
                id="calls"
                type="number"
                placeholder="Number of calls"
                value={form.calls || 0}
                onChange={(e) =>
                  setForm({ ...form, calls: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="emails">Emails</label>
              <input
                id="emails"
                type="number"
                placeholder="Number of emails"
                value={form.emails || 0}
                onChange={(e) =>
                  setForm({ ...form, emails: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="connects">Connects</label>
              <input
                id="connects"
                type="number"
                placeholder="Number of connects"
                value={form.connects || 0}
                onChange={(e) =>
                  setForm({ ...form, connects: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="new_clients">New Clients</label>
              <input
                id="new_clients"
                type="number"
                placeholder="New clients acquired"
                value={form.new_clients || 0}
                onChange={(e) =>
                  setForm({
                    ...form,
                    new_clients: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              placeholder="Add any notes or comments"
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
