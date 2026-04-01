import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/NavBar.css";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          SellerRep
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            {isAdmin ? "Admin Dashboard" : "Dashboard"}
          </Link>

          {!isAdmin && (
            <>
              <Link to="/daily-tracker" className="nav-link">
                📝 Daily Tracker
              </Link>
              <Link to="/achievements" className="nav-link">
                🏆 Achievements
              </Link>
              <Link to="/leave-requests" className="nav-link">
                📅 Leave Requests
              </Link>
              <Link to="/clients" className="nav-link">
                👥 Client Feedback
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/employees" className="nav-link">
                👥 Employees
              </Link>
              <Link to="/admin/errors" className="nav-link">
                ⚠️ Issues
              </Link>
              <Link to="/admin/reports" className="nav-link">
                📊 Reports
              </Link>
            </>
          )}
        </div>

        <div className="navbar-user">
          {user && (
            <div className="user-info">
              <span className="user-name">{user.email || user.name}</span>
              <span className={`user-role ${isAdmin ? "admin" : "employee"}`}>
                {isAdmin ? "👤 Admin" : "👨‍💼 Employee"}
              </span>
            </div>
          )}
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
