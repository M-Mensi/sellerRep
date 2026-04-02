-- ============================================================================
-- SEED AND CLEAR DATA SCRIPT FOR SELLER REPRESENTATIVE MANAGEMENT SYSTEM
-- PostgreSQL Version
-- ============================================================================
-- This script:
-- 1. Deletes all existing data from tables (preserving table structure)
-- 2. Populates all tables with realistic test data
-- ============================================================================

-- ============================================================================
-- PART 1: DELETE ALL EXISTING DATA (Respecting Foreign Keys)
-- ============================================================================

-- Delete data in reverse order of foreign key dependencies
DELETE FROM "AuditLog";
DELETE FROM "ErrorActions";
DELETE FROM "Notifications";
DELETE FROM "Errors";
DELETE FROM "LeaveRequests";
DELETE FROM "DailyTracker";
DELETE FROM "Attendance";
DELETE FROM "Achievements";
DELETE FROM "Clients";
DELETE FROM "Employees";
DELETE FROM "Users";

-- Reset sequences to start from 1
ALTER SEQUENCE "Users_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Employees_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Achievements_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Attendance_id_seq" RESTART WITH 1;
ALTER SEQUENCE "DailyTracker_id_seq" RESTART WITH 1;
ALTER SEQUENCE "LeaveRequests_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Clients_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Errors_id_seq" RESTART WITH 1;
ALTER SEQUENCE "ErrorActions_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Notifications_id_seq" RESTART WITH 1;
ALTER SEQUENCE "AuditLog_id_seq" RESTART WITH 1;

-- ============================================================================
-- PART 2: INSERT SAMPLE DATA
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE - Authentication Users
-- ============================================================================
-- Passwords are hashed using bcryptjs with cost 10
-- admin@company.com: Admin@12345
-- employee1@company.com: Emp@12345
-- employee2@company.com: Emp@12345
INSERT INTO "Users" (email, password_hash, role, is_active, last_login) 
VALUES 
  ('admin@company.com', '$2b$10$examplehashedpassword1', 'admin', TRUE, CURRENT_TIMESTAMP),
  ('employee1@company.com', '$2b$10$examplehashedpassword2', 'employee', TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('employee2@company.com', '$2b$10$examplehashedpassword3', 'employee', TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ('manager@company.com', '$2b$10$examplehashedpassword4', 'employee', TRUE, CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ('sales1@company.com', '$2b$10$examplehashedpassword5', 'employee', TRUE, CURRENT_TIMESTAMP - INTERVAL '5 days')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 2. EMPLOYEES TABLE - Employee Profiles
-- ============================================================================
INSERT INTO "Employees" (user_id, name, email, phone, position, department, hire_date, manager_id, is_active) 
VALUES 
  (1, 'Admin User', 'admin@company.com', '+1-234-567-8901', 'System Administrator', 'IT', '2022-01-01', NULL, TRUE),
  (2, 'John Doe', 'employee1@company.com', '+1-234-567-8902', 'Sales Representative', 'Sales', '2023-01-15', NULL, TRUE),
  (3, 'Jane Smith', 'employee2@company.com', '+1-234-567-8903', 'Sales Representative', 'Sales', '2023-03-20', NULL, TRUE),
  (4, 'Robert Johnson', 'manager@company.com', '+1-234-567-8904', 'Sales Manager', 'Sales', '2022-06-10', NULL, TRUE),
  (5, 'Sarah Williams', 'sales1@company.com', '+1-234-567-8905', 'Senior Sales Rep', 'Sales', '2021-09-01', 4, TRUE)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 3. ACHIEVEMENTS TABLE - Employee Achievements
-- ============================================================================
INSERT INTO "Achievements" (employee_id, title, description, achieved_on, is_endorsed, endorsed_by, endorsement_date, impact) 
VALUES 
  (2, 'Q1 Sales Target Exceeded', 'Exceeded quarterly sales target by 25%', '2024-03-31', TRUE, 4, CURRENT_TIMESTAMP, 'high'),
  (2, 'New Client Acquisition', 'Successfully acquired 5 new enterprise clients', '2024-02-28', TRUE, 4, CURRENT_TIMESTAMP - INTERVAL '1 month', 'high'),
  (3, 'Customer Satisfaction Award', 'Achieved 95% customer satisfaction rating', '2024-03-15', TRUE, 4, CURRENT_TIMESTAMP - INTERVAL '15 days', 'medium'),
  (3, 'Process Improvement', 'Implemented new CRM workflow reducing time-to-close by 30%', '2024-01-20', FALSE, NULL, NULL, 'high'),
  (5, 'Team Leadership', 'Successfully mentored 2 junior sales representatives', '2023-12-15', TRUE, 4, CURRENT_TIMESTAMP - INTERVAL '3 months', 'medium'),
  (5, 'Revenue Growth', 'Generated $500K in additional revenue in 2024', '2024-03-31', TRUE, 4, CURRENT_TIMESTAMP, 'high')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. ATTENDANCE TABLE - Daily Attendance Records
-- ============================================================================
INSERT INTO "Attendance" (employee_id, attendance_date, status, time_in, time_out, hours_worked, is_approved, approved_by) 
VALUES 
  (2, CURRENT_DATE - INTERVAL '5 days', 'present', '09:00:00', '17:30:00', 8.5, TRUE, 1),
  (2, CURRENT_DATE - INTERVAL '4 days', 'present', '09:15:00', '17:45:00', 8.5, TRUE, 1),
  (2, CURRENT_DATE - INTERVAL '3 days', 'present', '09:00:00', '17:00:00', 8.0, TRUE, 1),
  (2, CURRENT_DATE - INTERVAL '2 days', 'half-day', '09:00:00', '12:30:00', 3.5, TRUE, 1),
  (2, CURRENT_DATE - INTERVAL '1 day', 'present', '09:00:00', '17:30:00', 8.5, TRUE, 1),
  (2, CURRENT_DATE, 'present', '09:00:00', NULL, NULL, FALSE, NULL),
  
  (3, CURRENT_DATE - INTERVAL '5 days', 'present', '08:45:00', '17:15:00', 8.5, TRUE, 1),
  (3, CURRENT_DATE - INTERVAL '4 days', 'present', '09:00:00', '17:30:00', 8.5, TRUE, 1),
  (3, CURRENT_DATE - INTERVAL '3 days', 'present', '09:00:00', '17:00:00', 8.0, TRUE, 1),
  (3, CURRENT_DATE - INTERVAL '2 days', 'present', '09:00:00', '17:30:00', 8.5, TRUE, 1),
  (3, CURRENT_DATE - INTERVAL '1 day', 'absent', NULL, NULL, 0, FALSE, NULL),
  (3, CURRENT_DATE, 'present', '09:00:00', NULL, NULL, FALSE, NULL),
  
  (5, CURRENT_DATE - INTERVAL '5 days', 'present', '08:30:00', '17:00:00', 8.5, TRUE, 1),
  (5, CURRENT_DATE - INTERVAL '4 days', 'present', '09:00:00', '17:30:00', 8.5, TRUE, 1),
  (5, CURRENT_DATE - INTERVAL '3 days', 'present', '09:00:00', '17:00:00', 8.0, TRUE, 1),
  (5, CURRENT_DATE - INTERVAL '2 days', 'present', '09:00:00', '17:30:00', 8.5, TRUE, 1),
  (5, CURRENT_DATE - INTERVAL '1 day', 'present', '09:00:00', '17:30:00', 8.5, TRUE, 1),
  (5, CURRENT_DATE, 'present', '09:00:00', NULL, NULL, FALSE, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. DAILY TRACKER TABLE - Daily Sales Activity
-- ============================================================================
INSERT INTO "DailyTracker" (employee_id, activity_date, calls_count, emails_count, connections_count, new_clients_count, notes) 
VALUES 
  (2, CURRENT_DATE - INTERVAL '5 days', 12, 18, 5, 2, 'Strong lead generation day'),
  (2, CURRENT_DATE - INTERVAL '4 days', 15, 22, 8, 3, 'Closed 2 deals'),
  (2, CURRENT_DATE - INTERVAL '3 days', 10, 16, 4, 1, 'Follow-up calls with prospects'),
  (2, CURRENT_DATE - INTERVAL '2 days', 8, 14, 3, 0, 'Client meeting and presentations'),
  (2, CURRENT_DATE - INTERVAL '1 day', 14, 20, 7, 2, 'Excellent activity day'),
  (2, CURRENT_DATE, 6, 10, 2, 0, 'Morning activity (still working)'),
  
  (3, CURRENT_DATE - INTERVAL '5 days', 10, 15, 4, 1, 'Regular activity'),
  (3, CURRENT_DATE - INTERVAL '4 days', 13, 19, 6, 2, 'Good lead conversion'),
  (3, CURRENT_DATE - INTERVAL '3 days', 11, 17, 5, 1, 'Client retention focus'),
  (3, CURRENT_DATE - INTERVAL '2 days', 9, 13, 3, 1, 'Administrative tasks'),
  (3, CURRENT_DATE - INTERVAL '1 day', 0, 0, 0, 0, 'Absent day'),
  (3, CURRENT_DATE, 12, 18, 5, 2, 'Back to work - catching up'),
  
  (5, CURRENT_DATE - INTERVAL '5 days', 16, 25, 9, 3, 'Team lead activities - mentoring'),
  (5, CURRENT_DATE - INTERVAL '4 days', 18, 28, 11, 4, 'High performers activity'),
  (5, CURRENT_DATE - INTERVAL '3 days', 14, 22, 8, 2, 'Strategic account management'),
  (5, CURRENT_DATE - INTERVAL '2 days', 15, 26, 10, 3, 'Pipeline development'),
  (5, CURRENT_DATE - INTERVAL '1 day', 17, 24, 9, 3, 'Excellent week closing'),
  (5, CURRENT_DATE, 8, 12, 4, 1, 'Week start activities')
ON CONFLICT (employee_id, activity_date) DO UPDATE SET 
  calls_count = EXCLUDED.calls_count,
  emails_count = EXCLUDED.emails_count,
  connections_count = EXCLUDED.connections_count,
  new_clients_count = EXCLUDED.new_clients_count,
  notes = EXCLUDED.notes,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================================
-- 6. LEAVE REQUESTS TABLE - Leave and Training Requests
-- ============================================================================
INSERT INTO "LeaveRequests" (employee_id, request_type, leave_type, start_date, end_date, duration_days, reason, status, approved_by, approval_date) 
VALUES 
  (2, 'leave', 'annual', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '14 days', 5, 'Planned vacation', 'approved', 1, CURRENT_TIMESTAMP - INTERVAL '5 days'),
  (2, 'training', NULL, CURRENT_DATE + INTERVAL '20 days', CURRENT_DATE + INTERVAL '22 days', 3, 'Advanced Sales Training', 'pending', NULL, NULL),
  
  (3, 'leave', 'sick', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day', 1, 'Medical appointment', 'approved', 1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  (3, 'leave', 'annual', CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE + INTERVAL '37 days', 8, 'Summer vacation', 'pending', NULL, NULL),
  
  (5, 'equipment', NULL, CURRENT_DATE - INTERVAL '2 days', NULL, 1, 'New laptop request', 'approved', 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  (5, 'training', NULL, CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '17 days', 3, 'Leadership Development Program', 'approved', 1, CURRENT_TIMESTAMP - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. CLIENTS TABLE - Client Management
-- ============================================================================
INSERT INTO "Clients" (employee_id, company_name, contact_person, email, phone, industry, location, status, notes) 
VALUES 
  (2, 'Tech Innovations Inc', 'Michael Chen', 'michael@techinnovations.com', '+1-555-0101', 'Technology', 'San Francisco, CA', 'active', 'Enterprise client, long-term contract'),
  (2, 'Global Retail Solutions', 'Emily Davis', 'emily@globalretail.com', '+1-555-0102', 'Retail', 'New York, NY', 'active', 'Major account, regular orders'),
  (2, 'Digital Marketing Pro', 'David Martinez', 'david@digitalmarketingpro.com', '+1-555-0103', 'Marketing', 'Austin, TX', 'potential', 'New prospect, initial meeting done'),
  
  (3, 'Financial Services Corp', 'Sarah Johnson', 'sarah@finservices.com', '+1-555-0104', 'Finance', 'Boston, MA', 'active', 'Steady revenue stream'),
  (3, 'Healthcare Solutions Ltd', 'Jennifer Wilson', 'jennifer@healthcaresol.com', '+1-555-0105', 'Healthcare', 'Chicago, IL', 'active', 'Quarterly meetings scheduled'),
  (3, 'Manufacturing Excellence', 'Robert Brown', 'robert@manufexcellence.com', '+1-555-0106', 'Manufacturing', 'Detroit, MI', 'inactive', 'No activity in 2 months'),
  
  (5, 'Enterprise Cloud Systems', 'Lisa Anderson', 'lisa@enterprisecloud.com', '+1-555-0107', 'Cloud Services', 'Seattle, WA', 'active', 'Strategic partnership'),
  (5, 'Business Consulting Group', 'James Thompson', 'james@businessconsulting.com', '+1-555-0108', 'Consulting', 'Atlanta, GA', 'active', 'Growing account'),
  (5, 'Logistics International', 'Maria Garcia', 'maria@logisticsintl.com', '+1-555-0109', 'Logistics', 'Houston, TX', 'potential', 'RFP phase')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. ERRORS TABLE - Issue/Error Tracking
-- ============================================================================
INSERT INTO "Errors" (employee_id, title, description, category, severity, status, assigned_to) 
VALUES 
  (2, 'Data discrepancy in Q1 report', 'Client reported missing transactions in uploaded data', 'Data Quality', 'high', 'open', 1),
  (2, 'Late delivery issue', 'Unable to deliver product by promised deadline', 'Operations', 'critical', 'in_progress', 4),
  
  (3, 'Incorrect pricing quoted', 'Price quote doesn''t match system pricing', 'System', 'medium', 'open', 1),
  (3, 'Email communication broken', 'Automated emails not being delivered to client', 'Technical', 'high', 'resolved', 1),
  
  (5, 'Contract terms misalignment', 'Contract terms discussed vs. signed document differ', 'Legal', 'high', 'in_progress', 1),
  (5, 'Training completeness gap', 'New employee not properly trained on procedures', 'Human Resources', 'medium', 'resolved', 4)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 9. ERROR ACTIONS TABLE - Error Timeline and Resolution Actions
-- ============================================================================
INSERT INTO "ErrorActions" (error_id, action_by, action_type, action_text) 
VALUES 
  (1, 1, 'comment', 'Received complaint from client - investigating data gaps'),
  (1, 1, 'status_change', 'Status changed to open'),
  
  (2, 4, 'comment', 'Analyzing root cause - vendor delay issue'),
  (2, 1, 'assignment', 'Assigned to Sales Manager for resolution'),
  
  (3, 1, 'comment', 'Validated pricing discrepancy in system'),
  (3, 1, 'status_change', 'Status changed to open'),
  
  (4, 1, 'comment', 'Email server issue identified and fixed'),
  (4, 1, 'status_change', 'Status changed to resolved'),
  (4, 1, 'resolution', 'Issue resolved on 2024-03-25'),
  
  (5, 1, 'comment', 'Review contract documents for discrepancies'),
  (5, 4, 'assignment', 'Assigned to Sales Manager'),
  
  (6, 4, 'comment', 'Scheduled additional training session'),
  (6, 4, 'status_change', 'Status changed to resolved')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 10. NOTIFICATIONS TABLE - System Notifications
-- ============================================================================
INSERT INTO "Notifications" (user_id, title, message, type, is_read, related_url) 
VALUES 
  (2, 'Leave Request Approved', 'Your leave request for 2024-04-10 has been approved', 'success', FALSE, '/leave-requests'),
  (2, 'New Error Assigned', 'A critical error has been assigned to you', 'warning', FALSE, '/errors/1'),
  
  (3, 'Achievement Endorsed', 'Your achievement "Customer Satisfaction Award" was endorsed', 'success', TRUE, '/achievements'),
  (3, 'Daily Report Due', 'Please submit your daily activity report', 'info', FALSE, '/daily-tracker'),
  
  (5, 'Team Performance', 'Your team exceeded monthly targets by 15%', 'success', TRUE, '/dashboard'),
  (5, 'Training Scheduled', 'Leadership development program scheduled for 2024-04-15', 'info', FALSE, '/training')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 11. AUDIT LOG TABLE - Data Change Audit Trail
-- ============================================================================
INSERT INTO "AuditLog" (user_id, table_name, operation, record_id, old_values, new_values, change_summary, ip_address) 
VALUES 
  (1, 'Achievements', 'INSERT', 1, NULL, '{"title":"Q1 Sales Target Exceeded", "impact":"high"}', 'New achievement created', '192.168.1.100'),
  (1, 'LeaveRequests', 'UPDATE', 1, '{"status":"pending"}', '{"status":"approved"}', 'Leave request approved', '192.168.1.100'),
  (1, 'Errors', 'INSERT', 1, NULL, '{"title":"Data discrepancy","severity":"high"}', 'New error logged', '192.168.1.100'),
  (1, 'DailyTracker', 'UPDATE', 1, '{"calls_count":10}', '{"calls_count":12}', 'Daily tracker updated', '192.168.1.100')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- FINAL VERIFICATION
-- ============================================================================
SELECT 'Data population complete!' AS status;

-- Count records in each table
SELECT 
  'Users' AS table_name, COUNT(*) AS row_count FROM "Users"
UNION ALL
SELECT 'Employees', COUNT(*) FROM "Employees"
UNION ALL
SELECT 'Achievements', COUNT(*) FROM "Achievements"
UNION ALL
SELECT 'Attendance', COUNT(*) FROM "Attendance"
UNION ALL
SELECT 'DailyTracker', COUNT(*) FROM "DailyTracker"
UNION ALL
SELECT 'LeaveRequests', COUNT(*) FROM "LeaveRequests"
UNION ALL
SELECT 'Clients', COUNT(*) FROM "Clients"
UNION ALL
SELECT 'Errors', COUNT(*) FROM "Errors"
UNION ALL
SELECT 'ErrorActions', COUNT(*) FROM "ErrorActions"
UNION ALL
SELECT 'Notifications', COUNT(*) FROM "Notifications"
UNION ALL
SELECT 'AuditLog', COUNT(*) FROM "AuditLog"
ORDER BY table_name;

-- ============================================================================
-- END OF SEED SCRIPT
-- ============================================================================
