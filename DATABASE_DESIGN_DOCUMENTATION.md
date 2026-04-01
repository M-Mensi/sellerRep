# Database Schema Design & Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Table Relationships](#table-relationships)
3. [Detailed Table Specifications](#detailed-table-specifications)
4. [Real-time Synchronization Strategy](#real-time-synchronization-strategy)
5. [Query Examples](#query-examples)
6. [Performance Optimization](#performance-optimization)
7. [Migration & Updates](#migration--updates)
8. [Best Practices](#best-practices)

---

## Overview

This database system manages a comprehensive employee performance tracking and management platform with features for:

- **Authentication & Authorization**: Role-based access control (employee/admin)
- **Employee Management**: Profile management, department tracking, reporting hierarchy
- **Achievement Tracking**: Achievement logs with admin endorsement system
- **Attendance Management**: Daily check-in/check-out tracking with approval workflow
- **Activity Logging**: Daily tracker for calls, emails, connections, new clients
- **Request Management**: Leave, equipment, training, and custom requests with approval workflow
- **Client Management**: Client database per employee with industry classification
- **Error Tracking**: Issue/error reporting with timeline-based resolution tracking
- **Real-time Notifications**: Event-based notification system for updates
- **Audit Logging**: Compliance tracking of all data changes

### Database Design Principles

- **Normalization**: 3NF to minimize redundancy and improve maintainability
- **Referential Integrity**: Foreign keys with appropriate cascade rules
- **Performance**: Strategic indexes on frequently queried columns
- **Scalability**: Supports thousands of employees and millions of records
- **Audit Trail**: Complete history of changes for compliance

---

## Table Relationships

```
Users (1) ─────┬───────────── (Many) Employees
               ├───────────── (Many) AuditLog
               ├───────────── (Many) LeaveRequests (reviewed_by)
               ├───────────── (Many) Achievements (endorsed_by)
               ├───────────── (Many) Attendance (approved_by)
               ├───────────── (Many) Errors (assigned_to)
               └───────────── (Many) ErrorActions (admin_id)

Employees (1) ──┬────────── (Many) Achievements
                ├────────── (Many) Attendance
                ├────────── (Many) DailyTracker
                ├────────── (Many) LeaveRequests
                ├────────── (Many) Clients
                ├────────── (Many) Errors
                └────────── (1) Employees (self-reference via reporting_manager_id)

Errors (1) ──────────────── (Many) ErrorActions
Notifications (Many) ◄─────── (1) Users
```

---

## Detailed Table Specifications

### 1. **Users Table**

**Purpose**: Core authentication and authorization

| Column        | Type                      | Constraints                  | Notes                            |
| ------------- | ------------------------- | ---------------------------- | -------------------------------- |
| id            | INT                       | PK, AUTO_INCREMENT           | System-generated ID              |
| email         | VARCHAR(255)              | UNIQUE, NOT NULL             | Login credential                 |
| password_hash | VARCHAR(255)              | NOT NULL                     | Bcrypt hashed (never plain text) |
| role          | ENUM('employee', 'admin') | NOT NULL, DEFAULT 'employee' | Access control                   |
| is_active     | BOOLEAN                   | DEFAULT TRUE                 | Soft delete flag                 |
| last_login    | DATETIME                  | NULL                         | Track user activity              |
| created_at    | TIMESTAMP                 | DEFAULT NOW()                | Record creation time             |
| updated_at    | TIMESTAMP                 | AUTO UPDATE                  | Track modifications              |

**Indexes**:

- `idx_email`: Speed up login queries
- `idx_role`: Filter by role for permission checks
- `idx_is_active`: Exclude inactive users from dashboards

**Foreign Keys**: None (root table)

**Cascade Rules**: ON DELETE CASCADE affects all child tables

---

### 2. **Employees Table**

**Purpose**: Employee profile and organizational structure

| Column               | Type         | Constraints        | Notes                                    |
| -------------------- | ------------ | ------------------ | ---------------------------------------- |
| id                   | INT          | PK, AUTO_INCREMENT | Employee ID                              |
| user_id              | INT          | FK→Users, UNIQUE   | Links to authentication record           |
| name                 | VARCHAR(255) | NOT NULL           | Display name                             |
| email                | VARCHAR(255) | UNIQUE, NOT NULL   | Corporate email                          |
| position             | VARCHAR(100) |                    | Job title (e.g., "Sales Rep", "Manager") |
| department           | VARCHAR(100) |                    | Department assignment                    |
| hire_date            | DATE         |                    | Used for seniority/reports               |
| phone_number         | VARCHAR(20)  |                    | Contact information                      |
| reporting_manager_id | INT          | FK→Employees       | Creates hierarchy (self-reference)       |
| profile_image_url    | VARCHAR(500) |                    | Avatar/profile picture                   |
| is_active            | BOOLEAN      | DEFAULT TRUE       | Soft deactivation                        |
| created_at           | TIMESTAMP    |                    |                                          |
| updated_at           | TIMESTAMP    |                    |                                          |

**Indexes**:

- `idx_email`: Find employee by email
- `idx_department`: Filter by department
- `idx_hire_date`: Seniority reports
- `idx_is_active`: Active employees only
- `idx_reporting_manager`: Organizational hierarchy

**Foreign Keys**:

- `user_id` → `Users.id` (CASCADE)
- `reporting_manager_id` → `Employees.id` (SET NULL)

**Use Cases**:

- Get all employees in a department
- Build organizational hierarchy
- Track employee tenure

---

### 3. **Achievements Table**

**Purpose**: Track employee accomplishments with endorsement system

| Column      | Type                          | Constraints        | Notes                                         |
| ----------- | ----------------------------- | ------------------ | --------------------------------------------- |
| id          | INT                           | PK, AUTO_INCREMENT | Achievement ID                                |
| employee_id | INT                           | FK→Employees       | Who achieved it                               |
| title       | VARCHAR(255)                  | NOT NULL           | Achievement title                             |
| description | TEXT                          |                    | Detailed description                          |
| category    | VARCHAR(100)                  |                    | Type (e.g., "Sales", "Service", "Innovation") |
| achieved_on | DATE                          | NOT NULL           | When it was achieved                          |
| impact      | ENUM('Low', 'Medium', 'High') | DEFAULT 'Medium'   | Business impact                               |
| file_url    | VARCHAR(500)                  |                    | Supporting document/proof                     |
| image_url   | VARCHAR(500)                  |                    | Achievement badge or screenshot               |
| is_endorsed | BOOLEAN                       | DEFAULT FALSE      | Admin verified/approved                       |
| endorsed_by | INT                           | FK→Users, NULL     | Which admin endorsed it                       |
| endorsed_at | DATETIME                      |                    | When endorsement happened                     |
| is_deleted  | BOOLEAN                       | DEFAULT FALSE      | Soft delete flag                              |
| created_at  | TIMESTAMP                     |                    |                                               |
| updated_at  | TIMESTAMP                     |                    |                                               |

**Indexes**:

- `idx_employee_id, idx_achieved_on`: Range queries by date
- `idx_is_endorsed`: Filter endorsed achievements
- `idx_employee_endorsed`: Combined employee + endorsement status

**Foreign Keys**:

- `employee_id` → `Employees.id` (CASCADE)
- `endorsed_by` → `Users.id` (SET NULL)

**Business Logic**:

- Employees can see their endorsed achievements on their dashboard
- Admins can endorse/unendorse achievements
- Soft delete preserves history

---

### 4. **Attendance Table**

**Purpose**: Daily presence and punctuality tracking

| Column          | Type      | Constraints        | Notes                              |
| --------------- | --------- | ------------------ | ---------------------------------- |
| id              | INT       | PK, AUTO_INCREMENT | Attendance record ID               |
| employee_id     | INT       | FK→Employees       | Which employee                     |
| attendance_date | DATE      | NOT NULL           | The day being tracked              |
| check_in_time   | TIME      |                    | When they arrived                  |
| check_out_time  | TIME      |                    | When they left                     |
| status          | ENUM      | DEFAULT 'present'  | present/absent/late/leave/half-day |
| notes           | TEXT      |                    | Reason for absence, etc.           |
| approved_by     | INT       | FK→Users, NULL     | Manager approval                   |
| is_approved     | BOOLEAN   | DEFAULT FALSE      | Supervisor verification            |
| approved_at     | DATETIME  |                    | When approved                      |
| created_at      | TIMESTAMP |                    |                                    |
| updated_at      | TIMESTAMP |                    |                                    |

**Unique Constraint**: One record per employee per day (`unique_employee_date`)

**Indexes**:

- `idx_employee_id, idx_attendance_date`: Find records for date range
- `idx_status`: Filter by presence status
- `idx_is_approved`: Show pending approvals
- `idx_date_status`: Dashboard: "today's attendance by status"

**Foreign Keys**:

- `employee_id` → `Employees.id` (CASCADE)
- `approved_by` → `Users.id` (SET NULL)

**Dashboard Queries**:

```sql
-- Today's attendance summary
SELECT status, COUNT(*) as count
FROM Attendance
WHERE attendance_date = CURDATE()
GROUP BY status;

-- Attendance rate last 7 days
SELECT
  ROUND(COUNT(CASE WHEN status='present' THEN 1 END) / COUNT(*) * 100, 2) as attendance_rate
FROM Attendance
WHERE attendance_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE();
```

---

### 5. **DailyTracker Table**

**Purpose**: Daily activity logging for sales/performance metrics

| Column            | Type      | Constraints        | Notes                       |
| ----------------- | --------- | ------------------ | --------------------------- |
| id                | INT       | PK, AUTO_INCREMENT | Record ID                   |
| employee_id       | INT       | FK→Employees       | Who tracked it              |
| activity_date     | DATE      | NOT NULL           | The day's activities        |
| calls_count       | INT       | DEFAULT 0          | Number of calls made        |
| emails_count      | INT       | DEFAULT 0          | Number of emails sent       |
| connections_count | INT       | DEFAULT 0          | Networking connections made |
| new_clients_count | INT       | DEFAULT 0          | New clients acquired        |
| notes             | TEXT      |                    | Additional notes            |
| created_at        | TIMESTAMP |                    |                             |
| updated_at        | TIMESTAMP |                    |                             |

**Unique Constraint**: One record per employee per day (`unique_employee_date`)

**Indexes**:

- `idx_employee_date_range`: Time-series queries
- `idx_activity_date`: Filter by date range

**Foreign Keys**:

- `employee_id` → `Employees.id` (CASCADE)

**Dashboard Features**:

```sql
-- Weekly average performance
SELECT
  e.name,
  ROUND(AVG(calls_count), 2) as avg_calls,
  ROUND(AVG(emails_count), 2) as avg_emails,
  ROUND(AVG(connections_count), 2) as avg_connections,
  SUM(new_clients_count) as new_clients
FROM DailyTracker dt
JOIN Employees e ON dt.employee_id = e.id
WHERE dt.activity_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()
GROUP BY e.id
ORDER BY new_clients DESC;
```

---

### 6. **LeaveRequests Table**

**Purpose**: Manage leave, equipment, training, and custom requests with approval workflow

| Column               | Type                                    | Constraints               | Notes                                        |
| -------------------- | --------------------------------------- | ------------------------- | -------------------------------------------- |
| id                   | INT                                     | PK, AUTO_INCREMENT        | Request ID                                   |
| employee_id          | INT                                     | FK→Employees              | Who submitted it                             |
| request_type         | ENUM                                    | NOT NULL, DEFAULT 'leave' | leave/equipment/training/other               |
| priority             | ENUM('low', 'medium', 'high')           | DEFAULT 'medium'          | Urgency level                                |
| start_date           | DATE                                    |                           | When it starts (NULL for non-dated requests) |
| end_date             | DATE                                    |                           | When it ends (for leave requests)            |
| is_start_flexible    | BOOLEAN                                 | DEFAULT FALSE             | Can start date be adjusted?                  |
| reason               | TEXT                                    | NOT NULL                  | Why they're requesting                       |
| status               | ENUM('pending', 'approved', 'rejected') | DEFAULT 'pending'         | Workflow state                               |
| reviewed_by          | INT                                     | FK→Users, NULL            | Which admin reviewed it                      |
| admin_comment        | TEXT                                    |                           | Feedback from admin                          |
| reviewed_at          | DATETIME                                |                           | When admin responded                         |
| is_employee_notified | BOOLEAN                                 | DEFAULT FALSE             | Track notification delivery                  |
| created_at           | TIMESTAMP                               |                           |                                              |
| updated_at           | TIMESTAMP                               |                           |                                              |

**Indexes**:

- `idx_employee_status_date`: "Employee's pending requests"
- `idx_status`: Dashboard: "All pending requests"
- `idx_priority`: Filter by urgency
- `idx_request_type`: Separate dashboards by type

**Foreign Keys**:

- `employee_id` → `Employees.id` (CASCADE)
- `reviewed_by` → `Users.id` (SET NULL)

**Validation Rules**:

- `end_date` must be >= `start_date` (if both provided)
- `reason` must be 5-500 characters
- Only pending requests can be updated

---

### 7. **Clients Table**

**Purpose**: Track clients per employee with contact information

| Column         | Type                                   | Constraints        | Notes                     |
| -------------- | -------------------------------------- | ------------------ | ------------------------- |
| id             | INT                                    | PK, AUTO_INCREMENT | Client ID                 |
| employee_id    | INT                                    | FK→Employees       | Which sales rep owns them |
| name           | VARCHAR(255)                           | NOT NULL           | Client name               |
| contact_person | VARCHAR(255)                           |                    | Primary contact name      |
| email          | VARCHAR(255)                           |                    | Contact email             |
| phone_number   | VARCHAR(20)                            |                    | Contact phone             |
| company        | VARCHAR(255)                           |                    | Organization              |
| industry       | VARCHAR(100)                           |                    | Industry classification   |
| status         | ENUM('active', 'inactive', 'prospect') | DEFAULT 'active'   | Relationship status       |
| notes          | TEXT                                   |                    | Internal notes            |
| created_at     | TIMESTAMP                              |                    |                           |
| updated_at     | TIMESTAMP                              |                    |                           |

**Indexes**:

- `idx_employee_id`: Get employee's clients
- `idx_email, idx_status`: Search/filter
- `idx_industry`: Analytics by industry

**Foreign Keys**:

- `employee_id` → `Employees.id` (CASCADE)

**Dashboard Insights**:

```sql
-- Industry breakdown
SELECT industry, COUNT(*) as client_count
FROM Clients
WHERE employee_id = ? AND status = 'active'
GROUP BY industry;
```

---

### 8. **Errors Table**

**Purpose**: Issue/error reporting and resolution tracking

| Column         | Type         | Constraints        | Notes                                  |
| -------------- | ------------ | ------------------ | -------------------------------------- |
| id             | INT          | PK, AUTO_INCREMENT | Error ID                               |
| employee_id    | INT          | FK→Employees       | Who reported it                        |
| category       | VARCHAR(100) | NOT NULL           | Error type (e.g., "System", "Process") |
| sub_category   | VARCHAR(100) |                    | More specific category                 |
| description    | TEXT         | NOT NULL           | What went wrong                        |
| is_repeated    | BOOLEAN      | DEFAULT FALSE      | Recurring issue?                       |
| severity       | ENUM         | DEFAULT 'medium'   | low/medium/high/critical               |
| is_still_faced | BOOLEAN      | DEFAULT TRUE       | Still occurring?                       |
| status         | ENUM         | DEFAULT 'open'     | open/in-progress/resolved/closed       |
| assigned_to    | INT          | FK→Users, NULL     | Admin handling it                      |
| created_at     | TIMESTAMP    |                    |                                        |
| updated_at     | TIMESTAMP    |                    |                                        |

**Indexes**:

- `idx_employee_category_severity`: Priority queue
- `idx_status`: Open issues dashboard
- `idx_created_at`: Recent errors

**Foreign Keys**:

- `employee_id` → `Employees.id` (CASCADE)
- `assigned_to` → `Users.id` (SET NULL)

---

### 9. **ErrorActions Table**

**Purpose**: Timeline of actions taken to resolve errors

| Column         | Type         | Constraints        | Notes                   |
| -------------- | ------------ | ------------------ | ----------------------- |
| id             | INT          | PK, AUTO_INCREMENT | Action ID               |
| error_id       | INT          | FK→Errors          | Which error             |
| admin_id       | INT          | FK→Users           | Which admin took action |
| action         | TEXT         | NOT NULL           | What was done           |
| status_after   | ENUM         |                    | State after this action |
| attachment_url | VARCHAR(500) |                    | Evidence/screenshots    |
| created_at     | TIMESTAMP    |                    |                         |

**Foreign Keys**:

- `error_id` → `Errors.id` (CASCADE)
- `admin_id` → `Users.id` (RESTRICT)

**Note**: RESTRICT on admin means you can't delete admin accounts while they have error actions

---

### 10. **Notifications Table**

**Purpose**: Real-time event notifications for users

| Column              | Type        | Constraints        | Notes                               |
| ------------------- | ----------- | ------------------ | ----------------------------------- |
| id                  | INT         | PK, AUTO_INCREMENT | Notification ID                     |
| user_id             | INT         | FK→Users           | Who receives it                     |
| notification_type   | ENUM        | NOT NULL           | Event type                          |
| related_entity_type | VARCHAR(50) |                    | "LeaveRequest", "Achievement", etc. |
| related_entity_id   | INT         |                    | ID of the entity                    |
| message             | TEXT        | NOT NULL           | Human-readable message              |
| is_read             | BOOLEAN     | DEFAULT FALSE      | User acknowledgment                 |
| read_at             | DATETIME    |                    | When user read it                   |
| created_at          | TIMESTAMP   |                    |                                     |

**Types**:

- `request_approved`: Admin approved employee's request
- `request_rejected`: Admin rejected employee's request
- `achievement_endorsed`: Admin endorsed achievement
- `error_resolved`: Error was marked resolved
- `system_alert`: General system notifications

---

### 11. **AuditLog Table**

**Purpose**: Compliance and security audit trail

| Column      | Type         | Constraints        | Notes                               |
| ----------- | ------------ | ------------------ | ----------------------------------- |
| id          | INT          | PK, AUTO_INCREMENT | Log ID                              |
| user_id     | INT          | FK→Users, NULL     | Who made the change                 |
| entity_type | VARCHAR(50)  | NOT NULL           | LeaveRequest, Achievement, etc.     |
| entity_id   | INT          | NOT NULL           | ID of changed entity                |
| action      | ENUM         | NOT NULL           | CREATE/UPDATE/DELETE/APPROVE/REJECT |
| old_values  | JSON         |                    | Previous state                      |
| new_values  | JSON         |                    | New state                           |
| ip_address  | VARCHAR(45)  |                    | Source IP                           |
| user_agent  | VARCHAR(500) |                    | Browser/app info                    |
| created_at  | TIMESTAMP    |                    |                                     |

**Foreign Keys**:

- `user_id` → `Users.id` (SET NULL)

---

## Real-time Synchronization Strategy

### Problem

When an admin approves a leave request, the employee should see the update without refreshing. When an admin endorses an achievement, it should appear immediately on the employee's dashboard.

### Solutions

#### Option 1: WebSocket-based Real-time Updates (Recommended)

```javascript
// Backend: Use Socket.io
io.on("connection", (socket) => {
  // When admin approves leave request
  socket.emit("leave_request_approved", {
    requestId: 123,
    status: "approved",
    timestamp: new Date(),
  });
});

// Frontend: Listen for updates
socket.on("leave_request_approved", (data) => {
  // Update UI immediately
  setLeaveRequests((prev) =>
    prev.map((req) =>
      req.id === data.requestId ? { ...req, status: "approved" } : req,
    ),
  );
});
```

#### Option 2: Server-Sent Events (SSE)

```javascript
// Backend: Stream events
app.get("/api/notifications/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  // Send events whenever data changes
});

// Frontend: Listen to events
const eventSource = new EventSource("/api/notifications/stream");
eventSource.addEventListener("request_approved", (e) => {
  const data = JSON.parse(e.data);
  updateUI(data);
});
```

#### Option 3: Polling (Simplest)

```javascript
// Frontend: Check for updates every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    fetch("/api/notifications?read=false")
      .then((res) => res.json())
      .then((notifications) => {
        if (notifications.length > 0) {
          updateUI(notifications);
          markAsRead(notifications);
        }
      });
  }, 30000); // 30 seconds
  return () => clearInterval(interval);
}, []);
```

### Implementation Strategy

1. **Create Notification Trigger** on backend when data changes:

   ```javascript
   // When approving leave request
   await LeaveRequest.update({ status: "approved" }, { id: requestId });
   await Notification.create({
     user_id: employeeId,
     notification_type: "request_approved",
     related_entity_type: "LeaveRequest",
     related_entity_id: requestId,
     message: "Your leave request was approved!",
   });
   ```

2. **Broadcast to Employee**:
   - WebSocket: `socket.emit('notification', notification)`
   - SSE: Stream the notification
   - Polling: Include in next check

3. **Frontend Update**:
   - Fetch the updated entity
   - Update local state
   - Show toast notification

---

## Query Examples

### Dashboard: Admin Overview

```sql
SELECT
  (SELECT COUNT(*) FROM Employees WHERE is_active = TRUE) as active_employees,
  (SELECT COUNT(*) FROM LeaveRequests WHERE status = 'pending') as pending_requests,
  (SELECT COUNT(*) FROM Errors WHERE status IN ('open', 'in-progress')) as active_errors,
  (SELECT COUNT(DISTINCT employee_id) FROM Attendance WHERE attendance_date = CURDATE()) as employees_today,
  (SELECT ROUND(AVG(calls_count), 0) FROM DailyTracker WHERE activity_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) as avg_calls_week,
  (SELECT COUNT(*) FROM Achievements WHERE is_endorsed = TRUE AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as recent_endorsed;
```

### Employee: My Submissions

```sql
-- Get all employee's submissions with status
SELECT 'achievement' as type, title as name, achieved_on as date, is_endorsed as status, id
FROM Achievements
WHERE employee_id = ? AND is_deleted = FALSE

UNION ALL

SELECT 'attendance', CONCAT(status, ' - ', attendance_date), attendance_date, is_approved, id
FROM Attendance
WHERE employee_id = ?

UNION ALL

SELECT 'leave_request', CONCAT(leave_type, ' - ', DATE(start_date)), start_date, status, id
FROM LeaveRequests
WHERE employee_id = ?

UNION ALL

SELECT 'daily_tracker', DATE(activity_date), activity_date, 'logged', id
FROM DailyTracker
WHERE employee_id = ?

ORDER BY date DESC;
```

### Admin: Pending Requests with Priority

```sql
SELECT
  lr.id,
  e.name,
  e.department,
  lr.request_type,
  lr.priority,
  lr.reason,
  lr.created_at,
  DATEDIFF(CURDATE(), DATE(lr.created_at)) as days_pending
FROM LeaveRequests lr
JOIN Employees e ON lr.employee_id = e.id
WHERE lr.status = 'pending'
ORDER BY
  FIELD(lr.priority, 'high', 'medium', 'low'),
  lr.created_at ASC;
```

### Performance: Top Performers (Last 30 Days)

```sql
SELECT
  e.id,
  e.name,
  e.department,
  COUNT(DISTINCT dt.id) as days_logged,
  SUM(dt.calls_count) as total_calls,
  SUM(dt.emails_count) as total_emails,
  COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_clients,
  COUNT(a.id) as achievements
FROM Employees e
LEFT JOIN DailyTracker dt ON e.id = dt.employee_id AND dt.activity_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
LEFT JOIN Clients c ON e.id = c.employee_id
LEFT JOIN Achievements a ON e.id = a.employee_id AND a.is_endorsed = TRUE AND a.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
WHERE e.is_active = TRUE
GROUP BY e.id
ORDER BY total_calls DESC;
```

---

## Performance Optimization

### Index Strategy

1. **Write Performance**: Minimal indexes on heavily updated tables (DailyTracker, Attendance)
2. **Read Performance**: Multiple indexes on query-heavy tables (Achievements, LeaveRequests)
3. **Composite Indexes**: For common WHERE + JOIN combinations

### Query Optimization Tips

1. **Use Views**: Pre-compute common metrics (vw_employee_statistics, vw_dashboard_overview)
2. **Partition by Date**: For large tables (DailyTracker, Attendance) after 1M+ records
3. **Archive Old Records**: Move records >2 years old to archive table
4. **Caching**: Cache dashboard stats updated hourly

### Database Maintenance

```sql
-- Analyze tables for query optimization
ANALYZE TABLE Employees, Achievements, LeaveRequests, DailyTracker;

-- Check index usage
SELECT * FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'seller_rep_db';

-- Remove unused indexes
DROP INDEX idx_unused ON table_name;
```

---

## Migration & Updates

### Adding New Column Safely

```sql
-- 1. Add column with default value (non-blocking)
ALTER TABLE Employees ADD COLUMN middle_name VARCHAR(100) DEFAULT '';

-- 2. Update existing rows (if needed)
UPDATE Employees SET middle_name = '' WHERE middle_name IS NULL;

-- 3. Remove default if making it required
ALTER TABLE Employees MODIFY COLUMN middle_name VARCHAR(100) NOT NULL;
```

### Renaming Column

```sql
-- MySQL 8.0+
ALTER TABLE Achievements RENAME COLUMN achieved_on TO achievement_date;
```

### Creating New Table with Relationship

```sql
CREATE TABLE Certifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  certification_name VARCHAR(255) NOT NULL,
  earned_date DATE NOT NULL,
  expiry_date DATE,
  FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_employee_id (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## Best Practices

### 1. Data Integrity

- **Always test migrations** on a backup first
- **Use transactions** for multi-table updates:
  ```sql
  START TRANSACTION;
  UPDATE LeaveRequests SET status = 'approved' WHERE id = ?;
  INSERT INTO Notifications (...) VALUES (...);
  COMMIT;
  ```
- **Validate at application level** before DB insertion

### 2. Security

- **Never store passwords** in plain text (use bcrypt)
- **Parameterized queries** to prevent SQL injection:
  ```javascript
  db.execute("SELECT * FROM Users WHERE email = ?", [email]);
  ```
- **Audit logging** for sensitive operations (LeaveRequest approvals, etc.)

### 3. Performance

- **Index on Foreign Keys** automatically in MySQL 8.0+
- **Avoid SELECT \*** in production; specify columns
- **Use EXPLAIN** to analyze query performance
- **Archive** old data (>2 years) to separate tables

### 4. Maintenance

- **Regular backups** (daily recommended)
- **Monitor slow queries** (set log_queries_not_using_indexes)
- **Review NULL values** – are they expected?
- **Document schema changes** in version control

---

## Execution Steps

### Step 1: Create Fresh Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE seller_rep_db DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE seller_rep_db;

# Execute the schema script
SOURCE /path/to/DATABASE_SCHEMA.sql;
```

### Step 2: Verify Tables

```sql
-- List all tables
SHOW TABLES;

-- Verify structure of a table
DESCRIBE Employees;

-- Check relationships
SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'seller_rep_db' AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### Step 3: Backup Data

```bash
mysqldump -u root -p seller_rep_db > backup.sql
```

### Step 4: Restore if Needed

```bash
mysql -u root -p seller_rep_db < backup.sql
```

---

## Next Steps

1. **Update Backend Models** to match new schema fields
2. **Create API Endpoints** for new Notifications table
3. **Implement WebSocket** or polling for real-time updates
4. **Build Admin Dashboard Views** using provided queries
5. **Add Audit Logging** middleware to track changes
6. **Performance Test** with sample data (100k+ records)
