import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import ThemeToggle from "./components/ThemeToggle";
import NavBar from "./components/NavBar";
import EmployeeDashboard from "./components/EmployeeDashboard";
import AdminDashboard from "./components/AdminDashboard";

import Login from "./pages/Login";
import DailyTracker from "./pages/DailyTracker";
import Achievements from "./pages/Achievements";
import LeaveRequests from "./pages/LeaveRequests";
import Clients from "./pages/Clients";
import AdminErrors from "./pages/Admin/Errors";
import Employees from "./pages/Admin/Employees";
import Reports from "./pages/Admin/Reports";

const AppShell = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="App">
      <ThemeToggle />
      {user && <NavBar />}
      <main className="content">{children}</main>
    </div>
  );
};

// Role-based Dashboard component
const Dashboard = () => {
  const { user } = useAuth();

  // Debug logging
  console.log("Dashboard - Current user:", user);
  console.log("Dashboard - User role:", user?.role);

  const isAdmin = user?.role === "admin";
  console.log("Dashboard - Is Admin:", isAdmin);

  return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />;
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
              path="/achievements"
              element={
                <ProtectedRoute roles={["employee", "admin"]}>
                  <Achievements />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leave-requests"
              element={
                <ProtectedRoute roles={["employee", "admin"]}>
                  <LeaveRequests />
                </ProtectedRoute>
              }
            />

            <Route
              path="/clients"
              element={
                <ProtectedRoute roles={["employee", "admin"]}>
                  <Clients />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Employees />
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

            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Reports />
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
