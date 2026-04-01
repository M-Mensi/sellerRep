# Complete Feature Implementation Guide

This document provides detailed specifications for implementing all features in the seller representative management system.

---

## Table of Contents

1. [User Authentication & Authorization](#user-authentication--authorization)
2. [Employee Profile Management](#employee-profile-management)
3. [Achievements Module](#achievements-module)
4. [Attendance Tracking](#attendance-tracking)
5. [Daily Tracker (Activities Logging)](#daily-tracker-activities-logging)
6. [Leave Requests Management](#leave-requests-management)
7. [Client Management](#client-management)
8. [Error Tracking System](#error-tracking-system)
9. [Admin Dashboard](#admin-dashboard)
10. [Real-time Notifications](#real-time-notifications)
11. [Form Validation Rules](#form-validation-rules)

---

## User Authentication & Authorization

### Login Endpoint

**Endpoint**: `POST /api/auth/login`

**Request**:

```json
{
  "email": "employee@company.com",
  "password": "SecurePassword123"
}
```

**Validation Rules**:

- Email: Valid email format, exists in Users table
- Password: Minimum 6 characters, matches bcrypt hash

**Response** (Success - 200):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "employee@company.com",
    "name": "John Doe",
    "role": "employee",
    "position": "Sales Representative",
    "department": "Sales"
  }
}
```

**Response** (Error - 401):

```json
{
  "message": "Invalid email or password"
}
```

**Backend Implementation**:

```javascript
// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  validateLogin,
  handleValidationErrors,
} = require("../middleware/validation.middleware");

router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  authController.login,
);

module.exports = router;

// controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthModel = require("../models/auth.model");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [users] = await AuthModel.findUserByEmail(email);
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Get full employee details
    const [employees] = await EmployeeModel.getEmployeeByUserId(user.id);
    const employee = employees[0];

    const token = jwt.sign(
      { id: user.id, role: user.role, employeeId: employee.id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Update last login
    await AuthModel.updateLastLogin(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: employee.name,
        role: user.role,
        position: employee.position,
        department: employee.department,
      },
    });
  } catch (error) {
    next(error);
  }
};
```

---

## Employee Profile Management

### Get Employee Profile

**Endpoint**: `GET /api/employees/profile`

**Authorization**: Authenticated user (employee or admin)

**Response** (200):

```json
{
  "id": 2,
  "user_id": 2,
  "name": "John Doe",
  "email": "john@company.com",
  "position": "Sales Representative",
  "department": "Sales",
  "hire_date": "2023-01-15",
  "phone_number": "+1-555-123-4567",
  "reporting_manager_id": 1,
  "reporting_manager_name": "Jane Smith",
  "profile_image_url": "https://...",
  "is_active": true,
  "created_at": "2023-01-15T10:00:00Z",
  "updated_at": "2024-03-29T14:30:00Z"
}
```

### Update Employee Profile

**Endpoint**: `PATCH /api/employees/profile`

**Authorization**: Own profile or admin

**Request**:

```json
{
  "phone_number": "+1-555-987-6543",
  "profile_image_url": "https://..."
}
```

**Validation**:

- phone_number: Valid phone format (optional)
- profile_image_url: Valid URL (optional)
- Cannot change: email, role, hire_date (these can only be changed by admin)

**Response** (200):

```json
{
  "message": "Profile updated successfully",
  "employee": {
    /* updated fields */
  }
}
```

### Admin: Create Employee Account

**Endpoint**: `POST /api/employees`

**Authorization**: Admin only

**Request**:

```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "password": "InitialPassword123!",
  "position": "Senior Sales Rep",
  "department": "Sales",
  "hire_date": "2026-03-29",
  "reporting_manager_id": 1
}
```

**Validation**:

- name: 2-255 characters, required
- email: Valid email, unique, required
- password: Minimum 8 characters, at least one uppercase, one number, one special char
- position: 2-100 characters
- department: Selection from predefined list
- hire_date: Valid date, cannot be in future
- reporting_manager_id: Must be existing employee

**Response** (201):

```json
{
  "message": "Employee created successfully",
  "employee": {
    "id": 5,
    "user_id": 5,
    "name": "Jane Doe",
    "email": "jane@company.com",
    "position": "Senior Sales Rep",
    "department": "Sales"
  }
}
```

### Admin: Update Employee

**Endpoint**: `PATCH /api/employees/:id`

**Authorization**: Admin only

**Request**:

```json
{
  "position": "Sales Manager",
  "department": "Sales",
  "reporting_manager_id": 1,
  "is_active": true
}
```

### Admin: Deactivate Employee

**Endpoint**: `PATCH /api/employees/:id/deactivate`

**Authorization**: Admin only

**Response** (200):

```json
{
  "message": "Employee deactivated successfully",
  "employee": {
    /* with is_active: false */
  }
}
```

### View All Employees (Admin)

**Endpoint**: `GET /api/employees`

**Authorization**: Admin only

**Query Parameters**:

- `department`: Filter by department
- `is_active`: true/false
- `search`: Search by name or email
- `page`: Pagination
- `limit`: Records per page

**Response** (200):

```json
{
  "data": [
    {
      /* employee objects */
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

---

## Achievements Module

### Create Achievement

**Endpoint**: `POST /api/achievements`

**Authorization**: Employee or Admin

**Request**:

```json
{
  "title": "Closed Enterprise Deal",
  "description": "Successfully closed $500K enterprise deal with ABC Corp",
  "category": "Sales",
  "achieved_on": "2026-03-25",
  "impact": "High",
  "file_url": "https://drive.google.com/...",
  "image_url": "https://..."
}
```

**Validation**:

- title: 3-255 characters, required
- description: 5-1000 characters, required
- category: Selection from predefined list (Sales, Service, Innovation, Leadership)
- achieved_on: Valid date, not in future, required
- impact: 'Low', 'Medium', or 'High'
- file_url: Valid URL, supports PDF, DOC, PNG, JPG (optional)
- image_url: Valid image URL (optional)

**Response** (201):

```json
{
  "message": "Achievement created successfully",
  "achievement": {
    "id": 15,
    "employee_id": 2,
    "title": "Closed Enterprise Deal",
    "description": "...",
    "category": "Sales",
    "achieved_on": "2026-03-25",
    "impact": "High",
    "is_endorsed": false,
    "endorsed_by": null,
    "endorsed_at": null,
    "created_at": "2026-03-29T10:00:00Z"
  }
}
```

### View My Achievements

**Endpoint**: `GET /api/achievements/mine`

**Authorization**: Authenticated user

**Query Parameters**:

- `sort`: 'recent', 'endorsed', 'impact'
- `category`: Filter by category
- `endorsed_only`: true/false

**Response** (200):

```json
{
  "data": [
    {
      "id": 15,
      "title": "Closed Enterprise Deal",
      "category": "Sales",
      "impact": "High",
      "achieved_on": "2026-03-25",
      "is_endorsed": true,
      "endorsed_at": "2026-03-28T14:30:00Z",
      "created_at": "2026-03-29T10:00:00Z"
    }
  ],
  "total": 12,
  "endorsed_count": 8
}
```

### View All Achievements (Admin Dashboard)

**Endpoint**: `GET /api/achievements`

**Authorization**: Admin only

**Query Parameters**:

- `employee_id`: Filter by employee
- `endorsed_only`: true/false
- `category`: Filter by category

**Response** (200):

```json
{
  "data": [
    {
      "id": 15,
      "employee_id": 2,
      "employee_name": "John Doe",
      "title": "Closed Enterprise Deal",
      "achieved_on": "2026-03-25",
      "is_endorsed": false,
      "impact": "High"
    }
  ],
  "total": 156,
  "pending_endorsement": 24
}
```

### Admin: Endorse Achievement

**Endpoint**: `PATCH /api/achievements/:id/endorse`

**Authorization**: Admin only

**Response** (200):

```json
{
  "message": "Achievement endorsed successfully",
  "achievement": {
    "id": 15,
    "is_endorsed": true,
    "endorsed_by": 1,
    "endorsed_at": "2026-03-29T16:00:00Z"
  }
}
```

### Edit Achievement

**Endpoint**: `PATCH /api/achievements/:id`

**Authorization**: Own achievement or admin

**Restrictions**:

- Can only edit own unendorsed achievements
- Once endorsed, cannot edit
- Admin can edit any non-deleted achievement

### Delete Achievement

**Endpoint**: `DELETE /api/achievements/:id`

**Authorization**: Own achievement or admin

**Response** (200):

```json
{ "message": "Achievement deleted successfully" }
```

---

## Attendance Tracking

### Mark Attendance (Check-in/Check-out)

**Endpoint**: `POST /api/attendance/mark`

**Authorization**: Authenticated employee

**Request**:

```json
{
  "check_in_time": "09:00:00",
  "check_out_time": "17:30:00",
  "status": "present",
  "notes": "Worked from home"
}
```

**Validation**:

- check_in_time: Valid time format HH:MM:SS
- check_out_time: Must be after check_in_time (if provided)
- status: 'present', 'absent', 'late', 'leave', 'half-day'
- notes: Max 500 characters

**Response** (201):

```json
{
  "message": "Attendance marked successfully",
  "attendance": {
    "id": 42,
    "employee_id": 2,
    "attendance_date": "2026-03-29",
    "check_in_time": "09:00:00",
    "check_out_time": "17:30:00",
    "status": "present",
    "is_approved": false,
    "created_at": "2026-03-29T09:00:00Z"
  }
}
```

### View My Attendance Records

**Endpoint**: `GET /api/attendance/mine`

**Authorization**: Authenticated employee

**Query Parameters**:

- `from_date`: Start date (YYYY-MM-DD)
- `to_date`: End date (YYYY-MM-DD)
- `status`: Filter by status

**Response** (200):

```json
{
  "data": [
    {
      "id": 42,
      "attendance_date": "2026-03-29",
      "check_in_time": "09:00:00",
      "check_out_time": "17:30:00",
      "status": "present",
      "is_approved": true,
      "approved_at": "2026-03-29T18:00:00Z"
    }
  ],
  "statistics": {
    "total_days": 20,
    "present_days": 18,
    "absent_days": 0,
    "late_days": 2,
    "attendance_rate": "90%"
  }
}
```

### Admin: View All Attendance

**Endpoint**: `GET /api/attendance`

**Authorization**: Admin only

**Query Parameters**:

- `employee_id`: Filter by employee
- `from_date`: Start date
- `to_date`: End date
- `status`: Filter by status
- `is_approved`: true/false

### Admin: Approve/Reject Attendance

**Endpoint**: `PATCH /api/attendance/:id/approve`

**Authorization**: Admin only

**Request**:

```json
{
  "is_approved": true,
  "notes": "Approved"
}
```

**Response** (200):

```json
{
  "message": "Attendance approved successfully",
  "attendance": {
    /* updated record */
  }
}
```

---

## Daily Tracker (Activities Logging)

### Submit Daily Activity

**Endpoint**: `POST /api/daily-tracker`

**Authorization**: Authenticated employee

**Request**:

```json
{
  "activity_date": "2026-03-29",
  "calls_count": 12,
  "emails_count": 25,
  "connections_count": 3,
  "new_clients_count": 1,
  "notes": "Great day, closed one deal!"
}
```

**Validation**:

- activity_date: Valid date, not in future, required
- calls_count: Non-negative integer, default 0
- emails_count: Non-negative integer, default 0
- connections_count: Non-negative integer, default 0
- new_clients_count: Non-negative integer, default 0
- notes: Max 500 characters

**Response** (201):

```json
{
  "message": "Daily activity logged successfully",
  "tracker": {
    "id": 284,
    "employee_id": 2,
    "activity_date": "2026-03-29",
    "calls_count": 12,
    "emails_count": 25,
    "connections_count": 3,
    "new_clients_count": 1,
    "created_at": "2026-03-29T18:45:00Z"
  }
}
```

### View My Daily Tracker

**Endpoint**: `GET /api/daily-tracker/mine`

**Authorization**: Authenticated employee

**Query Parameters**:

- `from_date`: Start date
- `to_date`: End date
- `sort`: 'recent', 'calls', 'emails', 'new_clients'

**Response** (200):

```json
{
  "data": [
    {
      "activity_date": "2026-03-29",
      "calls_count": 12,
      "emails_count": 25,
      "connections_count": 3,
      "new_clients_count": 1
    }
  ],
  "statistics": {
    "total_calls": 245,
    "total_emails": 521,
    "total_connections": 45,
    "total_new_clients": 12,
    "avg_daily_calls": 12.25,
    "avg_daily_emails": 26.05,
    "period": "Last 30 days"
  }
}
```

### View All Daily Tracks (Admin)

**Endpoint**: `GET /api/daily-tracker`

**Authorization**: Admin only

**Query Parameters**:

- `employee_id`: Filter by employee
- `from_date`: Start date
- `to_date`: End date

**Response** (200):

```json
{
  "data": [
    {
      "id": 284,
      "employee_name": "John Doe",
      "activity_date": "2026-03-29",
      "calls_count": 12,
      "emails_count": 25,
      "connections_count": 3,
      "new_clients_count": 1
    }
  ],
  "dashboard": {
    "avg_calls_per_employee": 14.2,
    "avg_emails_per_employee": 28.5,
    "total_new_clients": 156,
    "top_performer": "John Doe",
    "top_performer_calls": 18
  }
}
```

---

## Leave Requests Management

### Submit Leave Request

**Endpoint**: `POST /api/leave-requests`

**Authorization**: Authenticated employee

**Request**:

```json
{
  "request_type": "leave",
  "leave_type": "vacation",
  "start_date": "2026-04-10",
  "end_date": "2026-04-15",
  "is_start_flexible": true,
  "priority": "medium",
  "reason": "Annual vacation to visit family"
}
```

**Validation**:

- request_type: 'leave', 'equipment', 'training', 'other', required
- leave_type: 'vacation', 'sick', 'personal', 'bereavement' (for leave type)
- start_date: Valid date, required
- end_date: Valid date, >= start_date, required for leave
- is_start_flexible: Boolean
- priority: 'low', 'medium', 'high'
- reason: 50-500 characters, required

**Response** (201):

```json
{
  "message": "Leave request submitted successfully",
  "request": {
    "id": 28,
    "employee_id": 2,
    "request_type": "leave",
    "start_date": "2026-04-10",
    "end_date": "2026-04-15",
    "priority": "medium",
    "status": "pending",
    "created_at": "2026-03-29T10:00:00Z"
  }
}
```

### View My Leave Requests

**Endpoint**: `GET /api/leave-requests/mine`

**Authorization**: Authenticated employee

**Query Parameters**:

- `status`: 'pending', 'approved', 'rejected'
- `from_date`: Start date
- `to_date`: End date

**Response** (200):

```json
{
  "data": [
    {
      "id": 28,
      "request_type": "leave",
      "start_date": "2026-04-10",
      "end_date": "2026-04-15",
      "status": "pending",
      "priority": "medium",
      "created_at": "2026-03-29T10:00:00Z"
    }
  ],
  "statistics": {
    "pending_count": 1,
    "approved_count": 3,
    "rejected_count": 0
  }
}
```

### View All Leave Requests (Admin)

**Endpoint**: `GET /api/leave-requests`

**Authorization**: Admin only

**Query Parameters**:

- `status`: 'pending', 'approved', 'rejected'
- `priority`: 'low', 'medium', 'high'
- `employee_id`: Filter by employee
- `from_date`: Start date
- `to_date`: End date

**Response** (200):

```json
{
  "data": [
    {
      "id": 28,
      "employee_id": 2,
      "employee_name": "John Doe",
      "request_type": "leave",
      "start_date": "2026-04-10",
      "end_date": "2026-04-15",
      "status": "pending",
      "priority": "medium",
      "created_at": "2026-03-29T10:00:00Z"
    }
  ],
  "pending_count": 5
}
```

### Admin: Review Leave Request

**Endpoint**: `PATCH /api/leave-requests/:id/review`

**Authorization**: Admin only

**Request**:

```json
{
  "status": "approved",
  "admin_comment": "Approved. Enjoy your vacation!"
}
```

**Validation**:

- status: 'approved' or 'rejected', required
- admin_comment: Max 500 characters (optional but recommended)

**Response** (200):

```json
{
  "message": "Leave request reviewed successfully",
  "request": {
    "id": 28,
    "status": "approved",
    "reviewed_by": 1,
    "reviewed_at": "2026-03-29T14:00:00Z",
    "admin_comment": "Approved. Enjoy your vacation!"
  }
}
```

**Notification**:

- Automatically create notification for employee
- Set `is_employee_notified = true`

### Edit Leave Request

**Endpoint**: `PATCH /api/leave-requests/:id`

**Authorization**: Own pending request or admin

**Restrictions**:

- Can only edit pending requests
- Cannot edit approved/rejected requests

---

## Client Management

### Create Client

**Endpoint**: `POST /api/clients`

**Authorization**: Employee or Admin

**Request**:

```json
{
  "name": "ABC Corporation",
  "contact_person": "Sarah Johnson",
  "email": "sarah@abccorp.com",
  "phone_number": "+1-555-234-5678",
  "company": "ABC Corporation Inc.",
  "industry": "Technology",
  "status": "active",
  "notes": "Key account, high value client"
}
```

**Validation**:

- name: 2-255 characters, required
- contact_person: 2-100 characters
- email: Valid email format
- phone_number: Valid phone format
- company: 2-255 characters
- industry: Selection from list (Tech, Finance, Retail, Healthcare, Manufacturing, Other)
- status: 'active', 'inactive', 'prospect'
- notes: Max 1000 characters

**Response** (201):

```json
{
  "message": "Client created successfully",
  "client": {
    "id": 45,
    "employee_id": 2,
    "name": "ABC Corporation",
    "contact_person": "Sarah Johnson",
    "industry": "Technology",
    "status": "active",
    "created_at": "2026-03-29T10:00:00Z"
  }
}
```

### View My Clients

**Endpoint**: `GET /api/clients/employee/:employeeId`

**Authorization**: Own clients or admin

**Query Parameters**:

- `status`: 'active', 'inactive', 'prospect'
- `industry`: Filter by industry
- `search`: Search by name or contact

**Response** (200):

```json
{
  "data": [
    {
      "id": 45,
      "name": "ABC Corporation",
      "contact_person": "Sarah Johnson",
      "email": "sarah@abccorp.com",
      "phone_number": "+1-555-234-5678",
      "industry": "Technology",
      "status": "active"
    }
  ],
  "statistics": {
    "total_clients": 24,
    "active_clients": 20,
    "by_industry": {
      "Technology": 8,
      "Finance": 5,
      "Retail": 4,
      "Healthcare": 3
    }
  }
}
```

### View All Clients (Admin)

**Endpoint**: `GET /api/clients`

**Authorization**: Admin only

**Response** (200):

```json
{
  "data": [
    {
      "id": 45,
      "employee_id": 2,
      "employee_name": "John Doe",
      "name": "ABC Corporation",
      "industry": "Technology",
      "status": "active"
    }
  ],
  "dashboard": {
    "total_clients": 524,
    "active_clients": 487,
    "industry_breakdown": {
      /* counts by industry */
    }
  }
}
```

### Update Client

**Endpoint**: `PATCH /api/clients/:id`

**Authorization**: Own client or admin

### Delete Client

**Endpoint**: `DELETE /api/clients/:id`

**Authorization**: Own client or admin

---

## Error Tracking System

### Report Error/Issue

**Endpoint**: `POST /api/errors`

**Authorization**: Authenticated employee

**Request**:

```json
{
  "category": "System",
  "sub_category": "Database",
  "description": "Cannot access customer database during business hours",
  "is_repeated": true,
  "severity": "high"
}
```

**Validation**:

- category: 'System', 'Process', 'Training', 'Other'
- sub_category: Text, 2-100 characters
- description: 20-1000 characters, required
- is_repeated: Boolean
- severity: 'low', 'medium', 'high', 'critical'

**Response** (201):

```json
{
  "message": "Error reported successfully",
  "error": {
    "id": 82,
    "employee_id": 2,
    "category": "System",
    "sub_category": "Database",
    "description": "...",
    "severity": "high",
    "status": "open",
    "created_at": "2026-03-29T10:00:00Z"
  }
}
```

### View All Errors (Admin)

**Endpoint**: `GET /api/errors`

**Authorization**: Admin only

**Query Parameters**:

- `status`: 'open', 'in-progress', 'resolved', 'closed'
- `severity`: 'low', 'medium', 'high', 'critical'
- `category`: Filter by category
- `is_still_faced`: true/false

**Response** (200):

```json
{
  "data": [
    {
      "id": 82,
      "employee_id": 2,
      "employee_name": "John Doe",
      "category": "System",
      "description": "...",
      "severity": "high",
      "status": "open",
      "created_at": "2026-03-29T10:00:00Z"
    }
  ],
  "dashboard": {
    "open_count": 12,
    "critical_count": 2,
    "by_severity": {
      /* counts */
    }
  }
}
```

### View Error Timeline

**Endpoint**: `GET /api/errors/:id/timeline`

**Authorization**: Employee (own error) or admin

**Response** (200):

```json
{
  "error": {
    "id": 82,
    "category": "System",
    "description": "...",
    "status": "in-progress",
    "severity": "high"
  },
  "timeline": [
    {
      "id": 1,
      "admin_id": 1,
      "admin_email": "admin@company.com",
      "action": "Assigned to Database team for investigation",
      "status_after": "in-progress",
      "created_at": "2026-03-29T11:00:00Z"
    },
    {
      "id": 2,
      "admin_id": 1,
      "admin_email": "admin@company.com",
      "action": "Found database connection pool exhaustion",
      "status_after": "in-progress",
      "created_at": "2026-03-29T14:00:00Z"
    }
  ]
}
```

### Admin: Add Error Action/Update

**Endpoint**: `POST /api/errors/:id/actions`

**Authorization**: Admin only

**Request**:

```json
{
  "action": "Increased database pool size from 10 to 50 connections",
  "status_after": "resolved",
  "attachment_url": "https://..."
}
```

**Validation**:

- action: 10-1000 characters, required
- status_after: 'open', 'in-progress', 'resolved', 'closed'
- attachment_url: Valid URL (optional)

**Response** (201):

```json
{
  "message": "Error action added successfully",
  "action": {
    "id": 2,
    "error_id": 82,
    "admin_id": 1,
    "action": "...",
    "status_after": "resolved",
    "created_at": "2026-03-29T14:00:00Z"
  }
}
```

---

## Admin Dashboard

### Dashboard Overview

**Endpoint**: `GET /api/admin/dashboard/overview`

**Authorization**: Admin only

**Response** (200):

```json
{
  "key_metrics": {
    "active_employees": 45,
    "pending_requests": 8,
    "open_errors": 12,
    "today_present": 42,
    "avg_calls_week": 14.5,
    "avg_emails_week": 28.3,
    "achievements_today": 2
  },
  "top_performers": [
    {
      "id": 2,
      "name": "John Doe",
      "total_calls": 245,
      "new_clients": 12,
      "endorsed_achievements": 8
    }
  ],
  "pending_requests": [
    {
      "id": 28,
      "employee_name": "John Doe",
      "request_type": "leave",
      "priority": "high",
      "days_pending": 3
    }
  ],
  "critical_errors": [
    {
      "id": 82,
      "category": "System",
      "severity": "critical",
      "reported_by": "Jane Smith"
    }
  ]
}
```

### Department Performance

**Endpoint**: `GET /api/admin/dashboard/departments`

**Authorization**: Admin only

**Response** (200):

```json
{
  "data": [
    {
      "department": "Sales",
      "employee_count": 25,
      "avg_calls_per_employee": 16.2,
      "total_new_clients": 89,
      "attendance_rate": "94%",
      "pending_requests": 3
    }
  ]
}
```

### Employee Leaderboard

**Endpoint**: `GET /api/admin/dashboard/leaderboard`

**Authorization**: Admin only

**Query Parameters**:

- `metric`: 'calls', 'emails', 'new_clients', 'achievements', 'attendance'
- `period`: 'week', 'month', 'quarter'

**Response** (200):

```json
{
  "metric": "new_clients",
  "period": "month",
  "data": [
    { "rank": 1, "name": "John Doe", "value": 18 },
    { "rank": 2, "name": "Jane Smith", "value": 15 },
    { "rank": 3, "name": "Mike Johnson", "value": 12 }
  ]
}
```

---

## Real-time Notifications

### Get User Notifications

**Endpoint**: `GET /api/notifications`

**Authorization**: Authenticated user

**Query Parameters**:

- `is_read`: true/false
- `notification_type`: filter by type

**Response** (200):

```json
{
  "data": [
    {
      "id": 1,
      "notification_type": "request_approved",
      "message": "Your leave request (Apr 10-15) has been approved!",
      "related_entity_type": "LeaveRequest",
      "related_entity_id": 28,
      "is_read": false,
      "created_at": "2026-03-29T14:00:00Z"
    }
  ],
  "unread_count": 3
}
```

### Mark Notification as Read

**Endpoint**: `PATCH /api/notifications/:id/read`

**Authorization**: Own notification

**Response** (200):

```json
{
  "message": "Notification marked as read",
  "notification": {
    /* updated */
  }
}
```

### Mark All as Read

**Endpoint**: `PATCH /api/notifications/read-all`

**Authorization**: Authenticated user

---

## Form Validation Rules

### Input Validation Middleware Specification

```javascript
// validation.middleware.js
const { body, validationResult } = require("express-validator");

exports.validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

exports.validateAchievement = [
  body("title")
    .isLength({ min: 3, max: 255 })
    .withMessage("Title must be 3-255 characters"),
  body("description")
    .isLength({ min: 5, max: 1000 })
    .withMessage("Description must be 5-1000 characters"),
  body("category")
    .isIn(["Sales", "Service", "Innovation", "Leadership"])
    .withMessage("Invalid category"),
  body("achieved_on")
    .isISO8601()
    .withMessage("Valid date required (YYYY-MM-DD)")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("Date cannot be in the future");
      }
      return true;
    }),
  body("impact")
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid impact level"),
];

exports.validateLeaveRequest = [
  body("request_type")
    .isIn(["leave", "equipment", "training", "other"])
    .withMessage("Invalid request type"),
  body("start_date").isISO8601().withMessage("Valid start date required"),
  body("end_date")
    .isISO8601()
    .withMessage("Valid end date required")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.start_date)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("reason")
    .isLength({ min: 10, max: 500 })
    .withMessage("Reason must be 10-500 characters"),
];

exports.validateDailyTracker = [
  body("activity_date")
    .isISO8601()
    .withMessage("Valid date required")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("Date cannot be in the future");
      }
      return true;
    }),
  body("calls_count")
    .isInt({ min: 0 })
    .withMessage("Calls must be non-negative integer"),
  body("emails_count")
    .isInt({ min: 0 })
    .withMessage("Emails must be non-negative integer"),
  body("connections_count")
    .isInt({ min: 0 })
    .withMessage("Connections must be non-negative integer"),
  body("new_clients_count")
    .isInt({ min: 0 })
    .withMessage("New clients must be non-negative integer"),
];

exports.validateClient = [
  body("name")
    .isLength({ min: 2, max: 255 })
    .withMessage("Client name must be 2-255 characters"),
  body("email").isEmail().withMessage("Valid email required"),
  body("phone_number")
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage("Valid phone number required"),
  body("industry")
    .isIn(["Tech", "Finance", "Retail", "Healthcare", "Manufacturing", "Other"])
    .withMessage("Invalid industry"),
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};
```

---

## Security Best Practices

1. **Rate Limiting**: Already implemented via helmet
2. **CSRF Protection**: Use CSRF tokens for state-changing operations
3. **Input Sanitization**: Use express-validator (already in place)
4. **Password Policy**:
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 number
   - At least 1 special character
5. **Token Expiration**: JWT expires in 24 hours
6. **Audit Logging**: Log all sensitive operations
7. **Data Privacy**:
   - Employees can't view other employees' personal attendance
   - Employees can see aggregated data (dashboards) but not details
   - Admin sees all data

---

## Frontend Requirements

### React Components Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── AuthContext.jsx
│   │   └── ProtectedRoute.jsx
│   ├── Employee/
│   │   ├── Profile.jsx
│   │   └── Dashboard.jsx
│   ├── Achievements/
│   │   ├── AchievementList.jsx
│   │   ├── AchievementForm.jsx
│   │   └── Endorse.jsx
│   ├── Attendance/
│   │   ├── CheckIn.jsx
│   │   ├── AttendanceHistory.jsx
│   │   └── Approval.jsx
│   ├── DailyTracker/
│   │   ├── LogActivity.jsx
│   │   └── PerformanceChart.jsx
│   ├── LeaveRequests/
│   │   ├── RequestForm.jsx
│   │   ├── RequestList.jsx
│   │   └── ReviewRequest.jsx
│   ├── Clients/
│   │   ├── ClientList.jsx
│   │   └── AddClient.jsx
│   ├── Errors/
│   │   ├── ReportError.jsx
│   │   ├── ErrorList.jsx
│   │   └── Timeline.jsx
│   └── Admin/
│       ├── Dashboard.jsx
│       ├── EmployeeManagement.jsx
│       ├── ApprovalQueue.jsx
│       └── Reports.jsx
├── api/
│   ├── achievements.api.js
│   ├── attendance.api.js
│   ├── dailyTracker.api.js
│   ├── leaveRequests.api.js
│   ├── clients.api.js
│   ├── errors.api.js
│   ├── admin.api.js
│   └── axios.js
└── hooks/
    ├── useAuth.js
    ├── useFetch.js
    └── useNotifications.js
```

---

## Testing Checklist

- [ ] User registration/login workflow
- [ ] Role-based access control (employee vs admin)
- [ ] Achievement creation and endorsement
- [ ] Attendance marking and approval
- [ ] Daily tracker logging and charts
- [ ] Leave request submission and review
- [ ] Client CRUD operations
- [ ] Error reporting and timeline
- [ ] Real-time notifications
- [ ] Admin dashboard metrics
- [ ] Form validation (all fields)
- [ ] API error handling
- [ ] Performance with 100k+ records
