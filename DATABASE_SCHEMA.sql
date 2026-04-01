-- ============================================================================
-- COMPREHENSIVE DATABASE SCHEMA FOR SELLER REPRESENTATIVE MANAGEMENT SYSTEM
-- ============================================================================
-- This schema supports employee management, achievements, attendance tracking,
-- daily activities logging, leave requests, client management, and error tracking
-- with admin dashboards and real-time synchronization features.
--
-- Created: 2026-03-29
-- Database: MySQL 8.0+
-- ============================================================================

-- Drop existing tables (optional - comment out if you want to preserve data)
-- DROP TABLE IF EXISTS ErrorActions;
-- DROP TABLE IF EXISTS Errors;
-- DROP TABLE IF EXISTS Notifications;
-- DROP TABLE IF EXISTS LeaveRequests;
-- DROP TABLE IF EXISTS DailyTracker;
-- DROP TABLE IF EXISTS Achievements;
-- DROP TABLE IF EXISTS Attendance;
-- DROP TABLE IF EXISTS Clients;
-- DROP TABLE IF EXISTS Employees;
-- DROP TABLE IF EXISTS Users;

-- ============================================================================
-- 1. USERS TABLE (Authentication & Role Management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('employee', 'admin') NOT NULL DEFAULT 'employee',
  is_active BOOLEAN DEFAULT TRUE,
  last_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. EMPLOYEES TABLE (Employee Profiles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS Employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  position VARCHAR(100),
  department VARCHAR(100),
  hire_date DATE,
  phone_number VARCHAR(20),
  reporting_manager_id INT,
  profile_image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (reporting_manager_id) REFERENCES Employees(id) ON DELETE SET NULL ON UPDATE CASCADE,
  
  INDEX idx_email (email),
  INDEX idx_department (department),
  INDEX idx_hire_date (hire_date),
  INDEX idx_is_active (is_active),
  INDEX idx_reporting_manager (reporting_manager_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. ACHIEVEMENTS TABLE (Employee Achievements & Endorsements)
-- ============================================================================
CREATE TABLE IF NOT EXISTS Achievements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  achieved_on DATE NOT NULL,
  impact ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  file_url VARCHAR(500),
  image_url VARCHAR(500),
  is_endorsed BOOLEAN DEFAULT FALSE,
  endorsed_by INT,
  endorsed_at DATETIME,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (endorsed_by) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  
  INDEX idx_employee_id (employee_id),
  INDEX idx_achieved_on (achieved_on),
  INDEX idx_is_endorsed (is_endorsed),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. ATTENDANCE TABLE (Daily Attendance Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS Attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  check_in_time TIME,
  check_out_time TIME,
  status ENUM('present', 'absent', 'late', 'leave', 'half-day') DEFAULT 'present',
  notes TEXT,
  approved_by INT,
  is_approved BOOLEAN DEFAULT FALSE,
  approved_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  
  UNIQUE KEY unique_employee_date (employee_id, attendance_date),
  INDEX idx_employee_id (employee_id),
  INDEX idx_attendance_date (attendance_date),
  INDEX idx_status (status),
  INDEX idx_is_approved (is_approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. DAILY TRACKER TABLE (Calls, Emails, Connections, New Clients)
-- ============================================================================
CREATE TABLE IF NOT EXISTS DailyTracker (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  activity_date DATE NOT NULL,
  calls_count INT DEFAULT 0,
  emails_count INT DEFAULT 0,
  connections_count INT DEFAULT 0,
  new_clients_count INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  UNIQUE KEY unique_employee_date (employee_id, activity_date),
  INDEX idx_employee_id (employee_id),
  INDEX idx_activity_date (activity_date),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. LEAVE REQUESTS TABLE (Leave/Equipment/Training/Other Requests)
-- ============================================================================
CREATE TABLE IF NOT EXISTS LeaveRequests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  request_type ENUM('leave', 'equipment', 'training', 'other') NOT NULL DEFAULT 'leave',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  is_start_flexible BOOLEAN DEFAULT FALSE,
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reviewed_by INT,
  admin_comment TEXT,
  reviewed_at DATETIME,
  is_employee_notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  
  INDEX idx_employee_id (employee_id),
  INDEX idx_status (status),
  INDEX idx_request_type (request_type),
  INDEX idx_priority (priority),
  INDEX idx_start_date (start_date),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. CLIENTS TABLE (Client Management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS Clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone_number VARCHAR(20),
  company VARCHAR(255),
  industry VARCHAR(100),
  status ENUM('active', 'inactive', 'prospect') DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  INDEX idx_employee_id (employee_id),
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_industry (industry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. ERRORS TABLE (Error/Issue Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS Errors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  sub_category VARCHAR(100),
  description TEXT NOT NULL,
  is_repeated BOOLEAN DEFAULT FALSE,
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  is_still_faced BOOLEAN DEFAULT TRUE,
  status ENUM('open', 'in-progress', 'resolved', 'closed') DEFAULT 'open',
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  
  INDEX idx_employee_id (employee_id),
  INDEX idx_category (category),
  INDEX idx_severity (severity),
  INDEX idx_status (status),
  INDEX idx_is_still_faced (is_still_faced),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. ERROR ACTIONS TABLE (Error Timeline & Resolution Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ErrorActions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  error_id INT NOT NULL,
  admin_id INT NOT NULL,
  action TEXT NOT NULL,
  status_after ENUM('open', 'in-progress', 'resolved', 'closed'),
  attachment_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (error_id) REFERENCES Errors(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES Users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  
  INDEX idx_error_id (error_id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. NOTIFICATIONS TABLE (Real-time Update Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS Notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  notification_type ENUM(
    'request_approved',
    'request_rejected',
    'achievement_endorsed',
    'error_resolved',
    'system_alert'
  ) NOT NULL,
  related_entity_type VARCHAR(50),
  related_entity_id INT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_notification_type (notification_type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 11. AUDIT LOG TABLE (Track Data Changes for Compliance)
-- ============================================================================
CREATE TABLE IF NOT EXISTS AuditLog (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  action ENUM('CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT') NOT NULL,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  
  INDEX idx_user_id (user_id),
  INDEX idx_entity_type (entity_type),
  INDEX idx_entity_id (entity_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  (SELECT COUNT(*) FROM Attendance WHERE employee_id = e.id AND status = 'present') as total_present,
  (SELECT COUNT(*) FROM Attendance WHERE employee_id = e.id AND status = 'absent') as total_absent,
  (SELECT COUNT(*) FROM DailyTracker WHERE employee_id = e.id) as total_daily_logs,
  (SELECT AVG(calls_count) FROM DailyTracker WHERE employee_id = e.id) as avg_calls,
  (SELECT AVG(emails_count) FROM DailyTracker WHERE employee_id = e.id) as avg_emails,
  (SELECT COUNT(*) FROM Achievements WHERE employee_id = e.id AND is_endorsed = TRUE) as endorsed_achievements,
  (SELECT COUNT(*) FROM LeaveRequests WHERE employee_id = e.id AND status = 'pending') as pending_requests
FROM Employees e;

-- Overall Dashboard: System Statistics
CREATE OR REPLACE VIEW vw_dashboard_overview AS
SELECT 
  (SELECT COUNT(*) FROM Employees WHERE is_active = TRUE) as active_employees,
  (SELECT COUNT(*) FROM LeaveRequests WHERE status = 'pending') as pending_requests,
  (SELECT COUNT(*) FROM Errors WHERE status != 'closed') as open_errors,
  (SELECT COUNT(*) FROM Attendance WHERE attendance_date = CURDATE() AND status = 'present') as today_present,
  (SELECT AVG(calls_count) FROM DailyTracker WHERE activity_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) as avg_calls_week,
  (SELECT AVG(emails_count) FROM DailyTracker WHERE activity_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) as avg_emails_week,
  (SELECT COUNT(*) FROM Achievements WHERE DATE(created_at) = CURDATE()) as achievements_today;

-- Daily Performance Metrics
CREATE OR REPLACE VIEW vw_daily_performance AS
SELECT 
  dt.activity_date,
  e.name,
  e.department,
  dt.calls_count,
  dt.emails_count,
  dt.connections_count,
  dt.new_clients_count,
  (dt.calls_count + dt.emails_count + dt.connections_count) as total_interactions
FROM DailyTracker dt
JOIN Employees e ON dt.employee_id = e.id
WHERE dt.activity_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY dt.activity_date DESC;

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample user accounts
INSERT IGNORE INTO Users (email, password_hash, role, is_active) VALUES
('admin@company.com', '$2b$10$hashedpassword123', 'admin', TRUE),
('employee1@company.com', '$2b$10$hashedpassword456', 'employee', TRUE),
('employee2@company.com', '$2b$10$hashedpassword789', 'employee', TRUE);

-- Insert sample employees
INSERT IGNORE INTO Employees (user_id, name, email, position, department, hire_date) VALUES
(2, 'John Doe', 'employee1@company.com', 'Sales Representative', 'Sales', '2023-01-15'),
(3, 'Jane Smith', 'employee2@company.com', 'Sales Representative', 'Sales', '2023-03-20');

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================
-- Additional composite indexes for common search patterns

ALTER TABLE Achievements ADD INDEX idx_employee_endorsed (employee_id, is_endorsed);
ALTER TABLE DailyTracker ADD INDEX idx_employee_date_range (employee_id, activity_date);
ALTER TABLE LeaveRequests ADD INDEX idx_employee_status_date (employee_id, status, created_at);
ALTER TABLE Errors ADD INDEX idx_employee_category_severity (employee_id, category, severity);
ALTER TABLE Attendance ADD INDEX idx_date_status (attendance_date, status);

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS & CASCADE RULES
-- ============================================================================
-- NOTE: All foreign keys are already defined in the CREATE TABLE statements above.
--
-- Cascade Rules Summary:
-- - CASCADE ON DELETE/UPDATE: User → Employees (user_id)
-- - CASCADE ON DELETE/UPDATE: Employee → Achievements, Attendance, DailyTracker, Clients, Errors
-- - SET NULL ON DELETE/UPDATE: Manager references, Endorsements, Error assignments
-- - RESTRICT ON DELETE/UPDATE: Error History (ErrorActions must be deleted first)
--
-- This ensures:
-- 1. Deleting a user deletes their employee record and all associated data
-- 2. Deleting an employee removes all their submissions
-- 3. Deleting approvers/managers doesn't orphan records

-- ============================================================================
-- EXECUTION INSTRUCTIONS
-- ============================================================================
--
-- 1. CREATE NEW DATABASE:
--    CREATE DATABASE seller_rep_db DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
--    USE seller_rep_db;
--    -- Then execute this entire script
--
-- 2. UPDATE EXISTING DATABASE:
--    USE your_existing_db;
--    -- Run this script (unchanged existing tables will be skipped due to IF NOT EXISTS)
--
-- 3. VERIFY TABLES:
--    SHOW TABLES;
--    SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'seller_rep_db';
--
-- 4. CHECK TABLE STRUCTURE:
--    DESCRIBE Employees;
--    DESCRIBE LeaveRequests;
--    -- etc.
--
-- 5. RESET DATABASE (if needed):
--    -- Uncomment the DROP TABLE statements at the top and re-run
--    -- WARNING: This will delete all data!
--
-- ============================================================================
