import { useState, useEffect } from "react";
import { getAllLeaveRequests } from "../api/leaveRequests.api";
import LeaveRequestsModal from "../components/LeaveRequestsModal";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./LeaveRequests.css";

const STATUS_COLORS = {
  approved: "#39d98a",
  rejected: "#ff5d5d",
  pending: "#ffb020",
};

export default function LeaveRequests() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getAllLeaveRequests();
      setRequests(
        (res.data || []).sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date),
        ),
      );
    } catch (err) {
      setError(err.message || "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSuccess = () => {
    fetchRequests();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "approved";
      case "rejected":
        return "rejected";
      case "pending":
        return "pending";
      default:
        return "pending";
    }
  };

  // Calculate statistics
  const statusCounts = {
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    pending: requests.filter((r) => r.status === "pending").length,
  };

  const statusData = [
    {
      name: "Approved",
      value: statusCounts.approved,
      fill: STATUS_COLORS.approved,
    },
    {
      name: "Pending",
      value: statusCounts.pending,
      fill: STATUS_COLORS.pending,
    },
    {
      name: "Rejected",
      value: statusCounts.rejected,
      fill: STATUS_COLORS.rejected,
    },
  ];

  // Leave type breakdown
  const leaveTypeMap = {};
  requests.forEach((r) => {
    const type = r.leave_type || "Other";
    leaveTypeMap[type] = (leaveTypeMap[type] || 0) + 1;
  });

  const leaveTypeData = Object.entries(leaveTypeMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Calculate total days
  const totalDays = requests.reduce((sum, req) => {
    if (req.start_date && req.end_date) {
      const start = new Date(req.start_date);
      const end = new Date(req.end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return sum + days;
    }
    return sum;
  }, 0);

  return (
    <div className="leave-requests-container">
      <div className="leave-requests-header">
        <div>
          <h2>📅 Leave Requests</h2>
          <p>Manage your leave and time off requests</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + New Request
        </button>
      </div>

      <LeaveRequestsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitSuccess}
      />

      {!loading && !error && requests.length > 0 && (
        <>
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Requests</div>
              <div className="stat-value">{requests.length}</div>
              <div className="stat-subtext">all time</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Approved</div>
              <div className="stat-value highlight-approved">
                {statusCounts.approved}
              </div>
              <div className="stat-subtext">
                {((statusCounts.approved / requests.length) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending</div>
              <div className="stat-value highlight-pending">
                {statusCounts.pending}
              </div>
              <div className="stat-subtext">awaiting approval</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Days</div>
              <div className="stat-value highlight">{totalDays}</div>
              <div className="stat-subtext">days off requested</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <h3>Leave Analytics</h3>

            {/* Status Distribution */}
            <div className="chart-container">
              <h4>Request Status Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, fill }) => (
                      <span style={{ fill }}>
                        {name}: {value}
                      </span>
                    )}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.5rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Leave Type Breakdown */}
            {leaveTypeData.length > 0 && (
              <div className="chart-container">
                <h4>Requests by Leave Type</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leaveTypeData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="name"
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
                    <Bar dataKey="value" fill="#7cc0ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}

      <div className="requests-history">
        <h3>📋 Request History</h3>
        {loading && <p className="loading">Loading...</p>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && requests.length === 0 && (
          <div className="empty-state">
            <p>No leave requests yet. Click "New Request" to submit one.</p>
          </div>
        )}

        {!loading && requests.length > 0 && (
          <div className="requests-table">
            <table>
              <thead>
                <tr>
                  <th>📅 Start Date</th>
                  <th>📅 End Date</th>
                  <th>📋 Type</th>
                  <th>💬 Reason</th>
                  <th>✓ Status</th>
                </tr>
              </thead>
              <tbody>
                {requests
                  .slice()
                  .reverse()
                  .map((request, idx) => (
                    <tr key={idx}>
                      <td>{request.start_date || "—"}</td>
                      <td>{request.end_date || "—"}</td>
                      <td>{request.leave_type || "—"}</td>
                      <td className="reason-cell">{request.reason || "—"}</td>
                      <td>
                        <span
                          className={`status-badge status-${getStatusColor(request.status)}`}
                        >
                          {request.status || "pending"}
                        </span>
                      </td>
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
