import { useState, useEffect } from "react";
import { getAllDailyTracker } from "../api/dailyTracker.api";
import DailyTrackerModal from "../components/DailyTrackerModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import "./DailyTracker.css";

export default function DailyTracker() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackers, setTrackers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrackers();
  }, []);

  const fetchTrackers = async () => {
    try {
      setLoading(true);
      const res = await getAllDailyTracker();
      setTrackers(
        (res.data || []).sort(
          (a, b) => new Date(a.activity_date) - new Date(b.activity_date),
        ),
      );
    } catch (err) {
      setError(err.message || "Failed to load trackers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSuccess = () => {
    fetchTrackers();
  };

  // Calculate statistics
  const stats = {
    totalDays: trackers.length,
    totalCalls: trackers.reduce((sum, t) => sum + (t.calls_count || 0), 0),
    totalEmails: trackers.reduce((sum, t) => sum + (t.emails_count || 0), 0),
    totalConnects: trackers.reduce(
      (sum, t) => sum + (t.connections_count || 0),
      0,
    ),
    totalNewClients: trackers.reduce(
      (sum, t) => sum + (t.new_clients_count || 0),
      0,
    ),
    avgCallsPerDay: trackers.length
      ? (
          trackers.reduce((sum, t) => sum + (t.calls_count || 0), 0) /
          trackers.length
        ).toFixed(1)
      : 0,
    avgClientsPerDay: trackers.length
      ? (
          trackers.reduce((sum, t) => sum + (t.new_clients_count || 0), 0) /
          trackers.length
        ).toFixed(1)
      : 0,
  };

  const last7Days = trackers.slice(-7);

  return (
    <div className="daily-tracker-container">
      {/* Header */}
      <div className="daily-tracker-header">
        <div>
          <h2>📝 Daily Tracker</h2>
          <p>Track your daily activities and performance metrics</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + New Submission
        </button>
      </div>

      <DailyTrackerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitSuccess}
      />

      {!loading && !error && trackers.length > 0 && (
        <>
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Submissions</div>
              <div className="stat-value">{stats.totalDays}</div>
              <div className="stat-subtext">days tracked</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Calls</div>
              <div className="stat-value">{stats.totalCalls}</div>
              <div className="stat-subtext">
                {stats.avgCallsPerDay} per day avg
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Emails</div>
              <div className="stat-value">{stats.totalEmails}</div>
              <div className="stat-subtext">
                {(stats.totalEmails / stats.totalDays).toFixed(1)} per day avg
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">New Clients</div>
              <div className="stat-value highlight">
                {stats.totalNewClients}
              </div>
              <div className="stat-subtext">
                {stats.avgClientsPerDay} per day avg
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Connects</div>
              <div className="stat-value">{stats.totalConnects}</div>
              <div className="stat-subtext">
                {(stats.totalConnects / stats.totalDays).toFixed(1)} per day avg
              </div>
            </div>
          </div>

          {/* Charts Section */}
          {last7Days.length > 0 && (
            <div className="charts-section">
              <h3>Performance Trends (Last 7 Days)</h3>

              {/* Activity Chart */}
              <div className="chart-container">
                <h4>Daily Activity</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={last7Days}>
                    <defs>
                      <linearGradient
                        id="colorCalls"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#7cc0ff"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#7cc0ff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="activity_date"
                      stroke="var(--muted)"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="var(--muted)" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="calls_count"
                      stroke="#7cc0ff"
                      fillOpacity={1}
                      fill="url(#colorCalls)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Metrics Comparison */}
              <div className="chart-container">
                <h4>Key Metrics Comparison</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={last7Days}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="activity_date"
                      stroke="var(--muted)"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="var(--muted)" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend wrapperStyle={{ color: "var(--ink)" }} />
                    <Bar
                      dataKey="calls_count"
                      fill="#7cc0ff"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="emails_count"
                      fill="#39d98a"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="new_clients_count"
                      fill="#ffb020"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      {/* History Section */}
      <div className="tracker-history">
        <h3>📋 All Submissions</h3>
        {loading && <p className="loading">Loading...</p>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && trackers.length === 0 && (
          <div className="empty-state">
            <p>No submissions yet. Click "New Submission" to start tracking.</p>
          </div>
        )}

        {!loading && trackers.length > 0 && (
          <div className="submissions-table">
            <table>
              <thead>
                <tr>
                  <th>📅 Date</th>
                  <th>☎️ Calls</th>
                  <th>✉️ Emails</th>
                  <th>🔗 Connects</th>
                  <th>👥 New Clients</th>
                  <th>📝 Notes</th>
                </tr>
              </thead>
              <tbody>
                {trackers
                  .slice()
                  .reverse()
                  .map((tracker, idx) => (
                    <tr key={idx} className="table-row">
                      <td className="date-cell">
                        {tracker.activity_date || "—"}
                      </td>
                      <td className="metric-cell">
                        {tracker.calls_count || 0}
                      </td>
                      <td className="metric-cell">
                        {tracker.emails_count || 0}
                      </td>
                      <td className="metric-cell">
                        {tracker.connections_count || 0}
                      </td>
                      <td className="metric-cell highlight">
                        {tracker.new_clients_count || 0}
                      </td>
                      <td className="notes-cell">{tracker.notes || "—"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
