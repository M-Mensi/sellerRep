import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DailyTracker from "./pages/DailyTracker";
import AdminErrors from "./pages/Admin/Errors";

const AppShell = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#fff",
        }}
      >
        <div>
          <Link to="/" style={{ marginRight: "1rem" }}>
            Dashboard
          </Link>
          <Link to="/daily-tracker" style={{ marginRight: "1rem" }}>
            Daily Tracker
          </Link>
          <Link to="/admin/errors" style={{ marginRight: "1rem" }}>
            Admin Errors
          </Link>
        </div>
        {user && (
          <button
            onClick={logout}
            style={{
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.35rem",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/daily-tracker"
              element={
                <ProtectedRoute roles={["employee", "admin"]}>
                  <DailyTracker />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/errors"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminErrors />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppShell>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
