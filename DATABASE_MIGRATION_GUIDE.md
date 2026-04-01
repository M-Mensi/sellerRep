# Database Migration Guide - Update Your Existing Schema

This guide provides step-by-step SQL migrations to update your existing database to the new comprehensive schema without losing data.

## 📋 Quick Start

If you're starting fresh:

```sql
CREATE DATABASE seller_rep_db DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE seller_rep_db;
SOURCE DATABASE_SCHEMA.sql;
```

If you have existing data, follow the migrations below.

---

## Migration Steps

### Step 1: Backup Your Database (CRITICAL)

```bash
mysqldump -u root -p your_database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

**Always test migrations on a copy first!**

---

### Step 2: Verify Current Schema

```sql
-- See what tables exist
SHOW TABLES;

-- Check specific table structure
DESCRIBE Users;
DESCRIBE Employees;
-- etc.
```

---

### Step 3: Migrate Users Table

**If you don't have a Users table:**

```sql
CREATE TABLE Users (
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
```

**If you have a Users table, add missing columns:**

```sql
-- Check if columns exist before adding
ALTER TABLE Users ADD COLUMN IF NOT EXISTS role ENUM('employee', 'admin') NOT NULL DEFAULT 'employee';
ALTER TABLE Users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE Users ADD COLUMN IF NOT EXISTS last_login DATETIME;
ALTER TABLE Users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add indexes
ALTER TABLE Users ADD INDEX IF NOT EXISTS idx_role (role);
ALTER TABLE Users ADD INDEX IF NOT EXISTS idx_is_active (is_active);
```

---

### Step 4: Migrate Employees Table

**If you need to add user_id relationship:**

```sql
-- Add user_id column if it doesn't exist
ALTER TABLE Employees ADD COLUMN user_id INT UNIQUE AFTER id;

-- Create user records for existing employees (IMPORTANT!)
-- Option A: If employees have email and password in Employees table
INSERT INTO Users (email, password_hash, role)
SELECT DISTINCT email, password_hash, 'employee'
FROM Employees e
WHERE NOT EXISTS (SELECT 1 FROM Users u WHERE u.email = e.email);

-- Then update Employees with the new user_ids
UPDATE Employees e
SET e.user_id = (SELECT u.id FROM Users u WHERE u.email = e.email)
WHERE e.user_id IS NULL;

-- Make user_id NOT NULL
ALTER TABLE Employees MODIFY COLUMN user_id INT NOT NULL;

-- Add foreign key constraint
ALTER TABLE Employees ADD CONSTRAINT fk_employee_user
FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE;
```

**Add missing columns to Employees:**

```sql
ALTER TABLE Employees ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE Employees ADD COLUMN IF NOT EXISTS reporting_manager_id INT;
ALTER TABLE Employees ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500);
ALTER TABLE Employees ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE Employees ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add indexes if they don't exist
ALTER TABLE Employees ADD INDEX IF NOT EXISTS idx_department (department);
ALTER TABLE Employees ADD INDEX IF NOT EXISTS idx_hire_date (hire_date);
ALTER TABLE Employees ADD INDEX IF NOT EXISTS idx_is_active (is_active);
ALTER TABLE Employees ADD INDEX IF NOT EXISTS idx_reporting_manager (reporting_manager_id);

-- Add foreign key for manager
ALTER TABLE Employees ADD CONSTRAINT fk_reporting_manager
FOREIGN KEY (reporting_manager_id) REFERENCES Employees(id) ON DELETE SET NULL ON UPDATE CASCADE;
```

---

### Step 5: Migrate Achievements Table

**Update existing table:**

```sql
-- Add missing columns (use IF NOT EXISTS pattern)
ALTER TABLE Achievements
  ADD COLUMN IF NOT EXISTS category VARCHAR(100),
  ADD COLUMN IF NOT EXISTS impact ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  ADD COLUMN IF NOT EXISTS file_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS is_endorsed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS endorsed_by INT,
  ADD COLUMN IF NOT EXISTS endorsed_at DATETIME,
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Rename column if needed (achieved_on vs achievement_date)
-- Check current column name first
-- If it's 'created_on' or 'achievement_date':
-- ALTER TABLE Achievements RENAME COLUMN achievement_date TO achieved_on;

-- Add indexes
ALTER TABLE Achievements ADD INDEX IF NOT EXISTS idx_achieved_on (achieved_on);
ALTER TABLE Achievements ADD INDEX IF NOT EXISTS idx_is_endorsed (is_endorsed);
ALTER TABLE Achievements ADD INDEX IF NOT EXISTS idx_created_at (created_at);
ALTER TABLE Achievements ADD INDEX IF NOT EXISTS idx_employee_endorsed (employee_id, is_endorsed);

-- Add foreign key for endorsed_by
ALTER TABLE Achievements ADD CONSTRAINT fk_endorsed_by
FOREIGN KEY (endorsed_by) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE;
```

---

### Step 6: Migrate Attendance Table

**Update existing table:**

```sql
-- Rename column if needed (day → attendance_date)
-- ALTER TABLE Attendance RENAME COLUMN day TO attendance_date;

-- Add missing columns
ALTER TABLE Attendance
  ADD COLUMN IF NOT EXISTS check_in_time TIME AFTER attendance_date,
  ADD COLUMN IF NOT EXISTS check_out_time TIME AFTER check_in_time,
  ADD COLUMN IF NOT EXISTS approved_by INT,
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS approved_at DATETIME,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update status column (rename from existing structure if needed)
-- If you have 'sick_leave' column instead of status:
-- ALTER TABLE Attendance ADD COLUMN status ENUM('present', 'absent', 'late', 'leave', 'half-day');
-- UPDATE Attendance SET status = CASE WHEN sick_leave = 1 THEN 'leave' ELSE 'present' END;

-- Add unique constraint if it doesn't exist
ALTER TABLE Attendance ADD UNIQUE INDEX IF NOT EXISTS unique_employee_date (employee_id, attendance_date);

-- Add indexes
ALTER TABLE Attendance ADD INDEX IF NOT EXISTS idx_attendance_date (attendance_date);
ALTER TABLE Attendance ADD INDEX IF NOT EXISTS idx_status (status);
ALTER TABLE Attendance ADD INDEX IF NOT EXISTS idx_is_approved (is_approved);
ALTER TABLE Attendance ADD INDEX IF NOT EXISTS idx_date_status (attendance_date, status);

-- Add foreign key for approved_by
ALTER TABLE Attendance ADD CONSTRAINT fk_approved_by
FOREIGN KEY (approved_by) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE;
```

---

### Step 7: Migrate DailyTracker Table

**Update existing table:**

```sql
-- Add missing columns (rename if needed)
-- If your columns are 'calls', 'emails', 'connects', 'new_clients':
ALTER TABLE DailyTracker
  CHANGE COLUMN calls calls_count INT DEFAULT 0,
  CHANGE COLUMN emails emails_count INT DEFAULT 0,
  CHANGE COLUMN connects connections_count INT DEFAULT 0,
  CHANGE COLUMN new_clients new_clients_count INT DEFAULT 0;

-- Add missing columns
ALTER TABLE DailyTracker
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Ensure unique constraint exists
ALTER TABLE DailyTracker ADD UNIQUE INDEX IF NOT EXISTS unique_employee_date (employee_id, activity_date);

-- Add indexes
ALTER TABLE DailyTracker ADD INDEX IF NOT EXISTS idx_activity_date (activity_date);
ALTER TABLE DailyTracker ADD INDEX IF NOT EXISTS idx_created_at (created_at);
ALTER TABLE DailyTracker ADD INDEX IF NOT EXISTS idx_employee_date_range (employee_id, activity_date);
```

---

### Step 8: Migrate LeaveRequests Table

**Update existing table:**

```sql
-- Add missing columns
ALTER TABLE LeaveRequests
  ADD COLUMN IF NOT EXISTS end_date DATE AFTER start_date,
  ADD COLUMN IF NOT EXISTS request_type ENUM('leave', 'equipment', 'training', 'other')
    NOT NULL DEFAULT 'leave' AFTER employee_id,
  ADD COLUMN IF NOT EXISTS admin_comment TEXT,
  ADD COLUMN IF NOT EXISTS is_employee_notified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Ensure status has correct enum values
-- ALTER TABLE LeaveRequests MODIFY COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';

-- Add indexes
ALTER TABLE LeaveRequests ADD INDEX IF NOT EXISTS idx_request_type (request_type);
ALTER TABLE LeaveRequests ADD INDEX IF NOT EXISTS idx_priority (priority);
ALTER TABLE LeaveRequests ADD INDEX IF NOT EXISTS idx_start_date (start_date);
ALTER TABLE LeaveRequests ADD INDEX IF NOT EXISTS idx_created_at (created_at);
ALTER TABLE LeaveRequests ADD INDEX IF NOT EXISTS idx_employee_status_date (employee_id, status, created_at);

-- Add foreign key for reviewed_by
ALTER TABLE LeaveRequests ADD CONSTRAINT fk_reviewed_by
FOREIGN KEY (reviewed_by) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE;
```

---

### Step 9: Migrate Clients Table

**Update existing table:**

```sql
-- Add missing columns
ALTER TABLE Clients
  ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255),
  ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
  ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive', 'prospect') DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Ensure column name is correct
-- Rename if using 'email' instead of required structure
-- ALTER TABLE Clients CHANGE COLUMN contact_email email VARCHAR(255);

-- Add indexes
ALTER TABLE Clients ADD INDEX IF NOT EXISTS idx_email (email);
ALTER TABLE Clients ADD INDEX IF NOT EXISTS idx_status (status);
ALTER TABLE Clients ADD INDEX IF NOT EXISTS idx_industry (industry);
```

---

### Step 10: Migrate Errors Table

**Update if exists:**

```sql
-- Add missing columns
ALTER TABLE Errors
  ADD COLUMN IF NOT EXISTS is_still_faced BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS status ENUM('open', 'in-progress', 'resolved', 'closed') DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS assigned_to INT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add indexes
ALTER TABLE Errors ADD INDEX IF NOT EXISTS idx_category (category);
ALTER TABLE Errors ADD INDEX IF NOT EXISTS idx_severity (severity);
ALTER TABLE Errors ADD INDEX IF NOT EXISTS idx_status (status);
ALTER TABLE Errors ADD INDEX IF NOT EXISTS idx_is_still_faced (is_still_faced);
ALTER TABLE Errors ADD INDEX IF NOT EXISTS idx_created_at (created_at);
ALTER TABLE Errors ADD INDEX IF NOT EXISTS idx_employee_category_severity (employee_id, category, severity);

-- Add foreign key for assigned_to
ALTER TABLE Errors ADD CONSTRAINT fk_assigned_to
FOREIGN KEY (assigned_to) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE;
```

---

### Step 11: Create ErrorActions Table

**If it doesn't exist:**

```sql
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
```

---

### Step 12: Create Notifications Table

**Create new table:**

```sql
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
```

---

### Step 13: Create AuditLog Table

**Create new table:**

```sql
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
```

---

### Step 14: Create Views for Dashboards

```sql
-- Employee Statistics View
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

-- Dashboard Overview View
CREATE OR REPLACE VIEW vw_dashboard_overview AS
SELECT
  (SELECT COUNT(*) FROM Employees WHERE is_active = TRUE) as active_employees,
  (SELECT COUNT(*) FROM LeaveRequests WHERE status = 'pending') as pending_requests,
  (SELECT COUNT(*) FROM Errors WHERE status != 'closed') as open_errors,
  (SELECT COUNT(*) FROM Attendance WHERE attendance_date = CURDATE() AND status = 'present') as today_present,
  (SELECT AVG(calls_count) FROM DailyTracker WHERE activity_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) as avg_calls_week,
  (SELECT AVG(emails_count) FROM DailyTracker WHERE activity_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) as avg_emails_week,
  (SELECT COUNT(*) FROM Achievements WHERE DATE(created_at) = CURDATE()) as achievements_today;

-- Daily Performance View
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
```

---

## Step 15: Verify Migration

```sql
-- Check all tables exist
SHOW TABLES;

-- Verify key tables
DESCRIBE Users;
DESCRIBE Employees;
DESCRIBE Achievements;
DESCRIBE Attendance;
DESCRIBE DailyTracker;
DESCRIBE LeaveRequests;
DESCRIBE Clients;
DESCRIBE Errors;
DESCRIBE ErrorActions;
DESCRIBE Notifications;
DESCRIBE AuditLog;

-- Check views
SHOW FULL TABLES IN seller_rep_db WHERE TABLE_TYPE = 'VIEW';

-- Verify relationships
SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'seller_rep_db' AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME;

-- Check data integrity
SELECT COUNT(*) as employee_count FROM Employees;
SELECT COUNT(*) as achievement_count FROM Achievements;
SELECT COUNT(*) as total_records FROM DailyTracker;
```

---

## Step 16: Update Backend Models

After schema migration, update your Node.js models to use the new columns:

**Example: Updated Achievement Model**

```javascript
// backend/src/models/achievement.model.js
const db = require("../config/db");

exports.createAchievement = (data) => {
  return db.execute(
    `INSERT INTO Achievements 
     (employee_id, title, description, category, achieved_on, impact, file_url, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.employee_id,
      data.title,
      data.description,
      data.category,
      data.achieved_on,
      data.impact,
      data.file_url,
      data.image_url,
    ],
  );
};

exports.endorseAchievement = (id, adminId) => {
  return db.execute(
    `UPDATE Achievements 
     SET is_endorsed = TRUE, endorsed_by = ?, endorsed_at = NOW()
     WHERE id = ?`,
    [adminId, id],
  );
};

exports.getAchievementsByEmployee = (employeeId) => {
  return db.execute(
    `SELECT * FROM Achievements
     WHERE employee_id = ? AND is_deleted = FALSE
     ORDER BY achieved_on DESC`,
    [employeeId],
  );
};
```

---

## Rollback Plan (If Something Goes Wrong)

```bash
# Restore from backup
mysql -u root -p seller_rep_db < backup_20260329_120000.sql
```

---

## Testing Checklist

- [ ] All tables created/updated successfully
- [ ] No data loss during migration
- [ ] Foreign keys validated
- [ ] Indexes created and functioning
- [ ] Views working correctly
- [ ] Backend models updated
- [ ] API endpoints tested
- [ ] Frontend displays data correctly
- [ ] No duplicate/orphaned records

---

## Performance Recommendations

After migration:

```sql
-- Analyze tables for query optimization
ANALYZE TABLE Users, Employees, Achievements, Attendance, DailyTracker,
LeaveRequests, Clients, Errors, ErrorActions;

-- Check query performance
EXPLAIN SELECT * FROM vw_employee_statistics WHERE id = 1;
EXPLAIN SELECT * FROM Achievements INNER JOIN Employees ON ...;

-- Monitor slow queries
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

---

## Next Steps After Migration

1. **Update API Controllers** to handle new fields
2. **Create New API Endpoints** for Notifications and AuditLog
3. **Implement Real-time Updates** (WebSocket/SSE/Polling)
4. **Update Frontend Components** for new data
5. **Create Admin Dashboard** using new views
6. **Set up Automated Backups**
7. **Monitor Database Performance**
