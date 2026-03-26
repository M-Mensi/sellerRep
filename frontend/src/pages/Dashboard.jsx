import { useState, useEffect } from "react";
import { getAllDailyTracker } from "../api/dailyTracker.api";
import { getAllClients } from "../api/clients.api";
import { getAllAchievements } from "../api/achievements.api";
import "./Dashboard.css";

export default function Dashboard() {
  const [dailyTrackers, setDailyTrackers] = useState([]);
  const [clients, setClients] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [trackersRes, clientsRes, achievementsRes] = await Promise.all([
        getAllDailyTracker(),
        getAllClients(),
        getAllAchievements(),
      ]);
      setDailyTrackers(trackersRes.data);
      setClients(clientsRes.data);
      setAchievements(achievementsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Daily Trackers</h3>
          <p>{dailyTrackers.length}</p>
        </div>
        <div className="summary-card success-gradient">
          <h3>Clients</h3>
          <p>{clients.length}</p>
        </div>
        <div className="summary-card warning-gradient">
          <h3>Achievements</h3>
          <p>{achievements.length}</p>
        </div>
      </div>
      <div className="charts-section">
        <h3>Recent Activity</h3>
        <p>
          Welcome to your dashboard. Start tracking your daily activities and
          achievements.
        </p>
      </div>
    </div>
  );
}
