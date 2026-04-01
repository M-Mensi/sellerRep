import { useState, useEffect } from "react";
import { getAllAchievements } from "../api/achievements.api";
import AchievementsModal from "../components/AchievementsModal";
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
import "./Achievements.css";

const IMPACT_COLORS = {
  High: "#ffb020",
  Medium: "#39d98a",
  Low: "#7cc0ff",
};

export default function Achievements() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await getAllAchievements();
      setAchievements(
        (res.data || []).sort(
          (a, b) => new Date(a.achievement_date) - new Date(b.achievement_date),
        ),
      );
    } catch (err) {
      setError(err.message || "Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSuccess = () => {
    fetchAchievements();
  };

  // Calculate statistics
  const impactCounts = {
    High: achievements.filter((a) => a.impact === "High").length,
    Medium: achievements.filter((a) => a.impact === "Medium").length,
    Low: achievements.filter((a) => a.impact === "Low").length,
  };

  const impactData = [
    { name: "High Impact", value: impactCounts.High, fill: IMPACT_COLORS.High },
    {
      name: "Medium Impact",
      value: impactCounts.Medium,
      fill: IMPACT_COLORS.Medium,
    },
    { name: "Low Impact", value: impactCounts.Low, fill: IMPACT_COLORS.Low },
  ];

  // Category breakdown
  const categoryMap = {};
  achievements.forEach((a) => {
    const cat = a.category || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <div>
          <h2>🏆 Achievements</h2>
          <p>Log and track your accomplishments and successes</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Log Achievement
        </button>
      </div>

      <AchievementsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitSuccess}
      />

      {!loading && !error && achievements.length > 0 && (
        <>
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Achievements</div>
              <div className="stat-value">{achievements.length}</div>
              <div className="stat-subtext">all time</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">High Impact</div>
              <div className="stat-value highlight-high">
                {impactCounts.High}
              </div>
              <div className="stat-subtext">
                {((impactCounts.High / achievements.length) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Medium Impact</div>
              <div className="stat-value highlight-medium">
                {impactCounts.Medium}
              </div>
              <div className="stat-subtext">
                {((impactCounts.Medium / achievements.length) * 100).toFixed(0)}
                %
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Categories</div>
              <div className="stat-value">
                {Object.keys(categoryMap).length}
              </div>
              <div className="stat-subtext">different types</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <h3>Impact Analysis</h3>

            {/* Impact Distribution */}
            <div className="chart-container">
              <h4>Achievement Impact Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={impactData}
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
                    {impactData.map((entry, index) => (
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

            {/* Category Breakdown */}
            {categoryData.length > 0 && (
              <div className="chart-container">
                <h4>Achievements by Category</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
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

      <div className="achievements-history">
        <h3>📋 Achievement Log</h3>
        {loading && <p className="loading">Loading...</p>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && achievements.length === 0 && (
          <div className="empty-state">
            <p>
              No achievements logged yet. Click "Log Achievement" to add one.
            </p>
          </div>
        )}

        {!loading && achievements.length > 0 && (
          <div className="achievements-grid">
            {achievements
              .slice()
              .reverse()
              .map((achievement, idx) => (
                <div key={idx} className="achievement-card">
                  <div className="achievement-header">
                    <h4>{achievement.title || "Untitled"}</h4>
                    <span className="date">
                      {achievement.achievement_date || "—"}
                    </span>
                  </div>
                  <p className="description">
                    {achievement.description || "No description"}
                  </p>
                  <div className="achievement-meta">
                    {achievement.category && (
                      <span className="badge badge-primary">
                        {achievement.category}
                      </span>
                    )}
                    {achievement.impact && (
                      <span
                        className={`badge badge-${achievement.impact.toLowerCase()}`}
                      >
                        {achievement.impact} impact
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

//             />
//           </div>
//           <button className="submit-btn" onClick={submit}>
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
