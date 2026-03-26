import { useState, useEffect } from "react";
import { getAllDailyTracker } from "../../api/dailyTracker.api";
import { getAllLeaveRequests } from "../../api/leaveRequests.api";
import { getAllAchievements } from "../../api/achievements.api";
import "./Reports.css";

export default function Reports() {
  const [dailyTrackers, setDailyTrackers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [trackersRes, leavesRes, achievementsRes] = await Promise.all([
        getAllDailyTracker(),
        getAllLeaveRequests(),
        getAllAchievements(),
      ]);
      setDailyTrackers(trackersRes.data);
      setLeaveRequests(leavesRes.data);
      setAchievements(achievementsRes.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const getTotalCalls = () => {
    return dailyTrackers.reduce(
      (sum, tracker) => sum + (tracker.calls || 0),
      0,
    );
  };

  const getTotalEmails = () => {
    return dailyTrackers.reduce(
      (sum, tracker) => sum + (tracker.emails || 0),
      0,
    );
  };

  const getPendingLeaves = () => {
    return leaveRequests.filter((leave) => leave.status === "pending").length;
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Reports & Analytics</h2>
      </div>
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === "daily-tracker" ? "active" : ""}`}
          onClick={() => setFilter("daily-tracker")}
        >
          Daily Tracker
        </button>
        <button
          className={`filter-btn ${filter === "leaves" ? "active" : ""}`}
          onClick={() => setFilter("leaves")}
        >
          Leave Requests
        </button>
        <button
          className={`filter-btn ${filter === "achievements" ? "active" : ""}`}
          onClick={() => setFilter("achievements")}
        >
          Achievements
        </button>
      </div>

      {(filter === "all" || filter === "daily-tracker") && (
        <div className="report-section">
          <h3>Daily Tracker Report</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Calls</div>
              <div className="stat-value">{getTotalCalls()}</div>
            </div>
            <div className="stat-card success">
              <div className="stat-label">Total Emails</div>
              <div className="stat-value">{getTotalEmails()}</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-label">Total Records</div>
              <div className="stat-value">{dailyTrackers.length}</div>
            </div>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Calls</th>
                  <th>Emails</th>
                  <th>Connects</th>
                  <th>New Clients</th>
                </tr>
              </thead>
              <tbody>
                {dailyTrackers.map((tracker) => (
                  <tr key={tracker.id}>
                    <td>{tracker.activity_date}</td>
                    <td>{tracker.calls}</td>
                    <td>{tracker.emails}</td>
                    <td>{tracker.connects}</td>
                    <td>{tracker.new_clients}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(filter === "all" || filter === "leaves") && (
        <div className="report-section">
          <h3>Leave Requests Report</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Pending Requests</div>
              <div className="stat-value">{getPendingLeaves()}</div>
            </div>
            <div className="stat-card success">
              <div className="stat-label">Total Requests</div>
              <div className="stat-value">{leaveRequests.length}</div>
            </div>
          </div>
        </div>
      )}

      {(filter === "all" || filter === "achievements") && (
        <div className="report-section">
          <h3>Achievements Report</h3>
          <div className="stats-grid">
            <div className="stat-card success">
              <div className="stat-label">Total Achievements</div>
              <div className="stat-value">{achievements.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
