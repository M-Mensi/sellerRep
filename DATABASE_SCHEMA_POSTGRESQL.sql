-- ============================================================================
-- COMPREHENSIVE DATABASE SCHEMA FOR SELLER REPRESENTATIVE MANAGEMENT SYSTEM
-- PostgreSQL Version
-- ============================================================================
-- This schema supports employee management, achievements, attendance tracking,
-- daily activities logging, leave requests, client management, and error tracking
-- with admin dashboards and real-time synchronization features.
--
-- Created: 2026-04-01
-- Database: PostgreSQL 12+
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE (Authentication & Role Management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Users" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'admin')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON "Users" (email);
CREATE INDEX idx_users_is_active ON "Users" (is_active);

-- ============================================================================
-- 2. EMPLOYEES TABLE (Employee Profiles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Employees" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  position VARCHAR(100),
  department VARCHAR(100),
  hire_date DATE,
  manager_id INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  reporting_manager_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_employees_user FOREIGN KEY (user_id) 
    REFERENCES "Users"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_employees_manager FOREIGN KEY (manager_id) 
    REFERENCES "Employees"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_employees_user_id ON "Employees" (user_id);
CREATE INDEX idx_employees_email ON "Employees" (email);
CREATE INDEX idx_employees_is_active ON "Employees" (is_active);
CREATE INDEX idx_employees_reporting_manager ON "Employees" (reporting_manager_id);

-- ============================================================================
-- 3. ACHIEVEMENTS TABLE (Employee Achievements & Endorsements)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Achievements" (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  achieved_on DATE NOT NULL,
  is_endorsed BOOLEAN DEFAULT FALSE,
  endorsed_by INTEGER,
  endorsement_date TIMESTAMP,
  impact VARCHAR(50) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_achievements_employee FOREIGN KEY (employee_id) 
    REFERENCES "Employees"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_achievements_endorsed_by FOREIGN KEY (endorsed_by) 
    REFERENCES "Employees"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_achievements_employee ON "Achievements" (employee_id);
CREATE INDEX idx_achievements_created_at ON "Achievements" (created_at);
CREATE INDEX idx_achievements_employee_endorsed ON "Achievements" (employee_id, is_endorsed);

-- ============================================================================
-- 4. ATTENDANCE TABLE (Daily Attendance Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Attendance" (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  attendance_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'leave', 'half-day')),
  time_in TIME,
  time_out TIME,
  hours_worked DECIMAL(5,2),
  notes TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  approved_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) 
    REFERENCES "Employees"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_attendance_approved_by FOREIGN KEY (approved_by) 
    REFERENCES "Employees"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_attendance_employee ON "Attendance" (employee_id);
CREATE INDEX idx_attendance_date ON "Attendance" (attendance_date);
CREATE INDEX idx_attendance_status ON "Attendance" (status);
CREATE INDEX idx_attendance_is_approved ON "Attendance" (is_approved);

-- ============================================================================
-- 5. DAILY TRACKER TABLE (Calls, Emails, Connections, New Clients)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "DailyTracker" (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  activity_date DATE NOT NULL,
  calls_count INTEGER DEFAULT 0,
  emails_count INTEGER DEFAULT 0,
  connections_count INTEGER DEFAULT 0,
  new_clients_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_daily_tracker_employee FOREIGN KEY (employee_id) 
    REFERENCES "Employees"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_daily_tracker_employee ON "DailyTracker" (employee_id);
CREATE INDEX idx_daily_tracker_date ON "DailyTracker" (activity_date);
CREATE INDEX idx_daily_tracker_employee_date_range ON "DailyTracker" (employee_id, activity_date);

-- ============================================================================
-- 6. LEAVE REQUESTS TABLE (Leave/Equipment/Training/Other Requests)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "LeaveRequests" (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('leave', 'equipment', 'training', 'other')),
  leave_type VARCHAR(50) CHECK (leave_type IN ('annual', 'sick', 'unpaid', 'maternity', 'paternity')),
  start_date DATE,
  end_date DATE,
  duration_days INTEGER,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by INTEGER,
  approval_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_leave_requests_employee FOREIGN KEY (employee_id) 
    REFERENCES "Employees"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_leave_requests_approved_by FOREIGN KEY (approved_by) 
    REFERENCES "Employees"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_leave_requests_employee ON "LeaveRequests" (employee_id);
CREATE INDEX idx_leave_requests_status ON "LeaveRequests" (status);
CREATE INDEX idx_leave_requests_created_at ON "LeaveRequests" (created_at);
CREATE INDEX idx_leave_requests_employee_status_date ON "LeaveRequests" (employee_id, status, created_at);

-- ============================================================================
-- 7. CLIENTS TABLE (Client Management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Clients" (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  industry VARCHAR(100),
  location VARCHAR(255),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'potential')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_clients_employee FOREIGN KEY (employee_id) 
    REFERENCES "Employees"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_clients_employee ON "Clients" (employee_id);
CREATE INDEX idx_clients_industry ON "Clients" (industry);
CREATE INDEX idx_clients_status ON "Clients" (status);

-- ============================================================================
-- 8. ERRORS TABLE (Error/Issue Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Errors" (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  CONSTRAINT fk_errors_employee FOREIGN KEY (employee_id) 
    REFERENCES "Employees"(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_errors_assigned_to FOREIGN KEY (assigned_to) 
    REFERENCES "Employees"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_errors_employee ON "Errors" (employee_id);
CREATE INDEX idx_errors_status ON "Errors" (status);
CREATE INDEX idx_errors_severity ON "Errors" (severity);
CREATE INDEX idx_errors_created_at ON "Errors" (created_at);
CREATE INDEX idx_errors_employee_category_severity ON "Errors" (employee_id, category, severity);

-- ============================================================================
-- 9. ERROR ACTIONS TABLE (Error Timeline & Resolution Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "ErrorActions" (
  id SERIAL PRIMARY KEY,
  error_id INTEGER NOT NULL,
  action_by INTEGER,
  action_type VARCHAR(50) CHECK (action_type IN ('comment', 'status_change', 'assignment', 'resolution')),
  action_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_error_actions_error FOREIGN KEY (error_id) 
    REFERENCES "Errors"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_error_actions_by FOREIGN KEY (action_by) 
    REFERENCES "Employees"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_error_actions_error ON "ErrorActions" (error_id);
CREATE INDEX idx_error_actions_created_at ON "ErrorActions" (created_at);

-- ============================================================================
-- 10. NOTIFICATIONS TABLE (Real-time Update Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Notifications" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_read BOOLEAN DEFAULT FALSE,
  related_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) 
    REFERENCES "Users"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_notifications_user ON "Notifications" (user_id);
CREATE INDEX idx_notifications_is_read ON "Notifications" (is_read);
CREATE INDEX idx_notifications_created_at ON "Notifications" (created_at);

-- ============================================================================
-- 11. AUDIT LOG TABLE (Track Data Changes for Compliance)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "AuditLog" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  table_name VARCHAR(100),
  operation VARCHAR(20) CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  change_summary TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_user ON "AuditLog" (user_id);
CREATE INDEX idx_audit_log_table ON "AuditLog" (table_name);
CREATE INDEX idx_audit_log_created_at ON "AuditLog" (created_at);

-- ============================================================================
-- VIEWS FOR DASHBOARD STATISTICS
-- ============================================================================

-- Admin Dashboard: Employee Statistics
CREATE OR REPLACE VIEW vw_employee_statistics AS
SELECT 
  e.id,
  e.name,
  e.email,
  e.position,
  e.department,
  COUNT(DISTINCT a.id) as total_achievements,
  COUNT(DISTINCT att.id) as total_attendance_records,
  COUNT(DISTINCT lr.id) as total_leave_requests,
  (SELECT COUNT(*) FROM "LeaveRequests" 
   WHERE employee_id = e.id AND status = 'pending') as pending_requests
FROM "Employees" e
LEFT JOIN "Achievements" a ON e.id = a.employee_id
LEFT JOIN "Attendance" att ON e.id = att.employee_id
LEFT JOIN "LeaveRequests" lr ON e.id = lr.employee_id
WHERE e.is_active = TRUE
GROUP BY e.id, e.name, e.email, e.position, e.department;

-- Overall Dashboard: System Statistics
CREATE OR REPLACE VIEW vw_dashboard_overview AS
SELECT 
  (SELECT COUNT(*) FROM "Employees" WHERE is_active = TRUE) as active_employees,
  (SELECT COUNT(*) FROM "Achievements" WHERE DATE(created_at) = CURRENT_DATE) as achievements_today,
  (SELECT COUNT(*) FROM "LeaveRequests" WHERE status = 'pending') as pending_leave_requests,
  (SELECT COUNT(*) FROM "Errors" WHERE status = 'open') as open_errors,
  (SELECT COUNT(*) FROM "Clients") as total_clients;

-- Daily Performance Metrics
CREATE OR REPLACE VIEW vw_daily_performance AS
SELECT 
  dt.activity_date,
  e.name,
  e.email,
  dt.calls_count,
  dt.emails_count,
  dt.connections_count,
  dt.new_clients_count,
  (dt.calls_count + dt.emails_count + dt.connections_count) as total_interactions
FROM "DailyTracker" dt
JOIN "Employees" e ON dt.employee_id = e.id
WHERE dt.activity_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY dt.activity_date DESC;

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample user accounts
INSERT INTO "Users" (email, password_hash, role, is_active) 
VALUES 
  ('admin@company.com', '$2b$10$hashedpassword123', 'admin', TRUE),
  ('employee1@company.com', '$2b$10$hashedpassword456', 'employee', TRUE),
  ('employee2@company.com', '$2b$10$hashedpassword789', 'employee', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert sample employees
INSERT INTO "Employees" (user_id, name, email, position, department, hire_date) 
VALUES 
  (2, 'John Doe', 'employee1@company.com', 'Sales Representative', 'Sales', '2023-01-15'),
  (3, 'Jane Smith', 'employee2@company.com', 'Sales Representative', 'Sales', '2023-03-20')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- EXECUTION INSTRUCTIONS FOR POSTGRESQL
-- ============================================================================
--
-- 1. CREATE NEW DATABASE:
--    CREATE DATABASE seller_rep_db
--      ENCODING 'UTF8'
--      LC_COLLATE 'en_US.UTF-8'
--      LC_CTYPE 'en_US.UTF-8';
--    
--    Then execute this script in pgAdmin or via psql.
--
-- 2. EXECUTE IN pgADMIN:
--    - Open pgAdmin
--    - Right-click on your database "defaultdb"
--    - Select "Query Tool"
--    - Copy and paste this entire SQL script
--    - Click "Execute" button
--
-- 3. EXECUTE VIA TERMINAL:
--    psql -h pg-d0deaeb-mensimohamed.h.aivencloud.com -U avnadmin -d defaultdb -f DATABASE_SCHEMA_POSTGRESQL.sql
--
-- 4. VERIFY TABLES:
--    \dt  (in psql)
--    
--    Or query:
--    SELECT table_name FROM information_schema.tables 
--    WHERE table_schema = 'public';
--
-- 5. CHECK TABLE STRUCTURE:
--    \d "Employees"  (in psql)
--    \d "LeaveRequests"
--
-- 6. CHECK ALL INDEXES:
--    SELECT * FROM pg_indexes WHERE schemaname = 'public';
--
-- 7. VERIFY RELATIONSHIPS:
--    SELECT * FROM information_schema.table_constraints 
--    WHERE table_schema = 'public' AND constraint_type = 'FOREIGN KEY';
--
-- 8. VIEW CREATION CONFIRMATION:
--    SELECT * FROM information_schema.views 
--    WHERE table_schema = 'public';
--
-- 9. DROP EVERYTHING TO START FRESH (if needed):
--    DROP SCHEMA public CASCADE;
--    CREATE SCHEMA public;
--    -- Then re-run this script
--    -- WARNING: This will delete all data!
--
-- ============================================================================
