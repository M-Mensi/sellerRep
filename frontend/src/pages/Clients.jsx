import { useState, useEffect } from "react";
import { getAllClients } from "../api/clients.api";
import ClientsModal from "../components/ClientsModal";
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
import "./Clients.css";

const STATUS_COLORS = {
  active: "#39d98a",
  prospect: "#ffb020",
  inactive: "#6b7280",
};

export default function Clients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await getAllClients();
      setClients(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSuccess = () => {
    fetchClients();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "danger";
      case "prospect":
        return "warning";
      default:
        return "primary";
    }
  };

  // Calculate statistics
  const statusCounts = {
    active: clients.filter((c) => c.status === "active").length,
    prospect: clients.filter((c) => c.status === "prospect").length,
    inactive: clients.filter((c) => c.status === "inactive").length,
  };

  const statusData = [
    { name: "Active", value: statusCounts.active, fill: STATUS_COLORS.active },
    {
      name: "Prospect",
      value: statusCounts.prospect,
      fill: STATUS_COLORS.prospect,
    },
    {
      name: "Inactive",
      value: statusCounts.inactive,
      fill: STATUS_COLORS.inactive,
    },
  ];

  // Industry breakdown
  const industryMap = {};
  clients.forEach((c) => {
    const ind = c.industry || "Uncategorized";
    industryMap[ind] = (industryMap[ind] || 0) + 1;
  });

  const industryData = Object.entries(industryMap)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <div className="clients-container">
      <div className="clients-header">
        <div>
          <h2>👥 Client Feedback</h2>
          <p>Manage client relationships and feedback</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add Client
        </button>
      </div>

      <ClientsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitSuccess}
      />

      {!loading && !error && clients.length > 0 && (
        <>
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Clients</div>
              <div className="stat-value">{clients.length}</div>
              <div className="stat-subtext">all time</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active</div>
              <div className="stat-value highlight-active">
                {statusCounts.active}
              </div>
              <div className="stat-subtext">
                {((statusCounts.active / clients.length) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Prospects</div>
              <div className="stat-value highlight-prospect">
                {statusCounts.prospect}
              </div>
              <div className="stat-subtext">potential opportunities</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Industries</div>
              <div className="stat-value">
                {Object.keys(industryMap).length}
              </div>
              <div className="stat-subtext">sectors covered</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <h3>Client Analytics</h3>

            {/* Status Distribution */}
            <div className="chart-container">
              <h4>Client Status Distribution</h4>
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

            {/* Industry Breakdown */}
            {industryData.length > 0 && (
              <div className="chart-container">
                <h4>Top Industries</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={industryData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="var(--muted)"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
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

      <div className="clients-history">
        <h3>📋 Client List</h3>
        {loading && <p className="loading">Loading...</p>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && clients.length === 0 && (
          <div className="empty-state">
            <p>No clients added yet. Click "Add Client" to create one.</p>
          </div>
        )}

        {!loading && clients.length > 0 && (
          <div className="clients-table">
            <table>
              <thead>
                <tr>
                  <th>🏢 Client Name</th>
                  <th>👤 Contact</th>
                  <th>📧 Email</th>
                  <th>📱 Phone</th>
                  <th>🏭 Industry</th>
                  <th>✓ Status</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, idx) => (
                  <tr key={idx}>
                    <td className="strong">{client.client_name || "—"}</td>
                    <td>{client.contact_person || "—"}</td>
                    <td>{client.email || "—"}</td>
                    <td>{client.phone || "—"}</td>
                    <td>{client.industry || "—"}</td>
                    <td>
                      <span
                        className={`status-badge status-${getStatusColor(client.status)}`}
                      >
                        {client.status || "active"}
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
//                 type="text"
//                 placeholder="Enter industry"
//                 value={form.industry || ""}
//                 onChange={(e) => setForm({ ...form, industry: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="status">Status</label>
//               <select
//                 id="status"
//                 value={form.status || "active"}
//                 onChange={(e) => setForm({ ...form, status: e.target.value })}
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>
//           <button className="submit-btn" onClick={submit}>
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
