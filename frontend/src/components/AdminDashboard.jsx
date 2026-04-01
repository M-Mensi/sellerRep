import React from "react";
import { Link } from "react-router-dom";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const adminLinks = [
    {
      title: "Manage Employees",
      description:
        "View and manage employee information, roles, and permissions.",
      icon: "👥",
      href: "/admin/employees",
    },
    {
      title: "Handle Issues",
      description: "Review and resolve reported issues and inquiries.",
      icon: "⚠️",
      href: "/admin/errors",
    },
    {
      title: "View Reports",
      description: "Access analytics and performance reports.",
      icon: "📊",
      href: "/admin/reports",
    },
    {
      title: "Manage Forms",
      description: "Configure available forms and workflows.",
      icon: "📋",
      href: "#",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage system settings and monitor activities</p>
      </div>

      <div className="admin-grid">
        {adminLinks.map((link, idx) =>
          link.href === "#" ? (
            <div
              key={idx}
              className="admin-card"
              style={{ cursor: "not-allowed", opacity: 0.6 }}
            >
              <div className="admin-icon">{link.icon}</div>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
              <span className="arrow">→</span>
            </div>
          ) : (
            <Link
              key={idx}
              to={link.href}
              className="admin-card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="admin-icon">{link.icon}</div>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
              <span className="arrow">→</span>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
