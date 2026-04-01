# API Testing & Verification Guide

## Overview

This guide provides detailed instructions for testing all backend API endpoints to ensure they are functioning correctly and synchronized with the frontend and database.

---

## Prerequisites

1. **Backend Server Running**
   - Command: `cd c:\Cognizant\sellerRep\backend && node src/server.js`
   - Expected: Server listening on `http://localhost:3000`

2. **Database Connected**
   - Verify in `.env` file that all database credentials are set
   - SQL database: `sql7.freesqldatabase.com`

3. **Testing Tool** (Choose one)
   - Postman (recommended) - [Download here](https://www.postman.com/)
   - VS Code REST Client extension
   - cURL commands
   - Browser console (for GET requests)

---

## 📋 Test Data Setup

Before testing, use these credentials or create new ones:

### Admin User

```
Email: admin@example.com
Password: Admin@123456
```

### Employee User

```
Email: employee@example.com
Password: Emp@123456
```

---

## 🔐 Authentication

### 1. Login Endpoint

**Endpoint:** `POST /api/auth/login`
**Port:** `http://localhost:3000`

**Request Body:**

```json
{
  "email": "employee@example.com",
  "password": "Emp@123456"
}
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "employee@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "employee"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid credentials
- `422 Validation Error` - Invalid email format

**Testing Steps:**

1. In Postman, create new request
2. Method: POST
3. URL: `http://localhost:3000/api/auth/login`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON): Paste request body above
6. Click Send
7. Verify status is 200 and token is received
8. Copy token for subsequent requests

---

### 2. Using Authentication Token

**For all protected endpoints, include:**

```
Authorization: Bearer {token}
```

In Postman:

1. Go to Headers tab
2. Add: `Authorization` with value `Bearer {your_token}`

---

## 👥 Employee Management Endpoints

### 3. Get Employee Profile

**Endpoint:** `GET /api/employees/profile`
**Auth Required:** Yes
**Method:** GET

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "employee@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "employee",
    "department": "Sales",
    "profilePicture": null,
    "phone": "1234567890",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 4. Get All Employees (Admin Only)

**Endpoint:** `GET /api/employees`
**Auth Required:** Yes (Admin)
**Method:** GET

**Headers:**

```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "employee@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "employee",
      "department": "Sales"
    },
    {
      "id": 2,
      "email": "employee2@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "employee",
      "department": "Marketing"
    }
  ]
}
```

---

## 📊 Attendance Endpoints

### 5. Mark Attendance

**Endpoint:** `POST /api/attendance/mark`
**Auth Required:** Yes
**Method:** POST

**Request Body:**

```json
{
  "checkInTime": "2024-01-15T09:00:00Z",
  "checkOutTime": "2024-01-15T17:30:00Z",
  "status": "present",
  "notes": "Regular working day"
}
```

**Expected Response (201 Created):**

```json
{
  "success": true,
  "message": "Attendance recorded successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "date": "2024-01-15",
    "checkInTime": "2024-01-15T09:00:00Z",
    "checkOutTime": "2024-01-15T17:30:00Z",
    "status": "present",
    "notes": "Regular working day",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Valid Status Values:**

- `present` - Employee was present
- `absent` - Employee was absent
- `late` - Employee was late
- `leave` - Employee on leave
- `half-day` - Employee worked half day

---

### 6. Get My Attendance

**Endpoint:** `GET /api/attendance/mine`
**Auth Required:** Yes
**Method:** GET

**Query Parameters (Optional):**

```
?startDate=2024-01-01&endDate=2024-01-31&status=present
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "date": "2024-01-15",
      "checkInTime": "2024-01-15T09:00:00Z",
      "checkOutTime": "2024-01-15T17:30:00Z",
      "status": "present",
      "notes": "Regular working day"
    }
  ]
}
```

---

### 7. Get All Attendance (Admin Only)

**Endpoint:** `GET /api/attendance`
**Auth Required:** Yes (Admin)
**Method:** GET

**Query Parameters (Optional):**

```
?employeeId=1&startDate=2024-01-01&endDate=2024-01-31
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "date": "2024-01-15",
      "checkInTime": "2024-01-15T09:00:00Z",
      "checkOutTime": "2024-01-15T17:30:00Z",
      "status": "present",
      "notes": "Regular working day",
      "employee": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ]
}
```

---

## 🏆 Achievements Endpoints

### 8. Create Achievement

**Endpoint:** `POST /api/achievements`
**Auth Required:** Yes
**Method:** POST

**Request Body:**

```json
{
  "title": "Top Sales Performer",
  "description": "Achieved 150% of quarterly sales target",
  "category": "sales",
  "points": 100
}
```

**Expected Response (201 Created):**

```json
{
  "success": true,
  "message": "Achievement created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "Top Sales Performer",
    "description": "Achieved 150% of quarterly sales target",
    "category": "sales",
    "points": 100,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 9. Get My Achievements

**Endpoint:** `GET /api/achievements/mine`
**Auth Required:** Yes
**Method:** GET

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "title": "Top Sales Performer",
      "description": "Achieved 150% of quarterly sales target",
      "category": "sales",
      "points": 100,
      "endorsements": 5,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 10. Endorse Achievement

**Endpoint:** `POST /api/achievements/:id/endorse`
**Auth Required:** Yes
**Method:** POST

**URL:** `http://localhost:3000/api/achievements/1/endorse`

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "Achievement endorsed successfully",
  "data": {
    "id": 1,
    "endorsements": 6
  }
}
```

---

## 📅 Daily Tracker Endpoints

### 11. Log Daily Activity

**Endpoint:** `POST /api/daily-tracker/log`
**Auth Required:** Yes
**Method:** POST

**Request Body:**

```json
{
  "date": "2024-01-15",
  "callsAttended": 5,
  "emailsSent": 12,
  "clientsMet": 2,
  "newConnections": 3,
  "notes": "Good client interactions today"
}
```

**Expected Response (201 Created):**

```json
{
  "success": true,
  "message": "Daily activity logged successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "date": "2024-01-15",
    "callsAttended": 5,
    "emailsSent": 12,
    "clientsMet": 2,
    "newConnections": 3,
    "notes": "Good client interactions today",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 12. Get My Daily Tracker

**Endpoint:** `GET /api/daily-tracker/mine`
**Auth Required:** Yes
**Method:** GET

**Query Parameters (Optional):**

```
?startDate=2024-01-01&endDate=2024-01-31
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "date": "2024-01-15",
      "callsAttended": 5,
      "emailsSent": 12,
      "clientsMet": 2,
      "newConnections": 3,
      "notes": "Good client interactions today"
    }
  ]
}
```

---

## 🗂️ Leave Request Endpoints

### 13. Submit Leave Request

**Endpoint:** `POST /api/leave-requests`
**Auth Required:** Yes
**Method:** POST

**Request Body:**

```json
{
  "type": "vacation",
  "startDate": "2024-02-10",
  "endDate": "2024-02-15",
  "reason": "Family vacation",
  "alternateContact": "John Smith"
}
```

**Valid Leave Types:**

- `vacation` - Paid vacation time
- `sick` - Sick leave
- `personal` - Personal leave
- `equipment` - Equipment request
- `training` - Training request

**Expected Response (201 Created):**

```json
{
  "success": true,
  "message": "Leave request submitted successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "type": "vacation",
    "startDate": "2024-02-10",
    "endDate": "2024-02-15",
    "reason": "Family vacation",
    "alternateContact": "John Smith",
    "status": "pending",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 14. Get My Leave Requests

**Endpoint:** `GET /api/leave-requests/mine`
**Auth Required:** Yes
**Method:** GET

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "type": "vacation",
      "startDate": "2024-02-10",
      "endDate": "2024-02-15",
      "reason": "Family vacation",
      "alternateContact": "John Smith",
      "status": "pending",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 15. Review Leave Request (Admin Only)

**Endpoint:** `PATCH /api/leave-requests/:id/review`
**Auth Required:** Yes (Admin)
**Method:** PATCH

**URL:** `http://localhost:3000/api/leave-requests/1/review`

**Request Body:**

```json
{
  "status": "approved",
  "reviewNotes": "Approved for the requested period"
}
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "Leave request reviewed successfully",
  "data": {
    "id": 1,
    "status": "approved",
    "reviewedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

## 🏢 Client Management Endpoints

### 16. Create Client

**Endpoint:** `POST /api/clients`
**Auth Required:** Yes
**Method:** POST

**Request Body:**

```json
{
  "companyName": "Acme Corporation",
  "contactName": "John Smith",
  "email": "contact@acme.com",
  "phone": "1234567890",
  "address": "123 Business St, City, State 12345",
  "industry": "Technology"
}
```

**Expected Response (201 Created):**

```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "companyName": "Acme Corporation",
    "contactName": "John Smith",
    "email": "contact@acme.com",
    "phone": "1234567890",
    "address": "123 Business St, City, State 12345",
    "industry": "Technology",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 17. Get All Clients

**Endpoint:** `GET /api/clients`
**Auth Required:** Yes
**Method:** GET

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "companyName": "Acme Corporation",
      "contactName": "John Smith",
      "email": "contact@acme.com",
      "phone": "1234567890",
      "industry": "Technology"
    }
  ]
}
```

---

## ⚠️ Error Reporting Endpoints

### 18. Report Error

**Endpoint:** `POST /api/errors`
**Auth Required:** Yes
**Method:** POST

**Request Body:**

```json
{
  "category": "bug",
  "subCategory": "login",
  "description": "Login page shows blank after 5 seconds",
  "severity": "high",
  "isRecurring": false,
  "details": "Happens on Chrome browser specifically"
}
```

**Valid Categories:**

- `bug` - Software bug
- `ui` - User interface issue
- `performance` - Performance issue
- `security` - Security issue
- `other` - Other issue

**Valid Severity Levels:**

- `low` - Minor issue
- `medium` - Standard issue
- `high` - Critical issue
- `critical` - Blocking issue

**Expected Response (201 Created):**

```json
{
  "success": true,
  "message": "Error reported successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "category": "bug",
    "subCategory": "login",
    "description": "Login page shows blank after 5 seconds",
    "severity": "high",
    "isRecurring": false,
    "status": "open",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 19. Get All Errors

**Endpoint:** `GET /api/errors`
**Auth Required:** Yes (Admin)
**Method:** GET

**Query Parameters (Optional):**

```
?category=bug&severity=high&status=open
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "category": "bug",
      "subCategory": "login",
      "description": "Login page shows blank after 5 seconds",
      "severity": "high",
      "isRecurring": false,
      "status": "open",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 20. Get Error Timeline

**Endpoint:** `GET /api/errors/:id/timeline`
**Auth Required:** Yes (Admin)
**Method:** GET

**URL:** `http://localhost:3000/api/errors/1/timeline`

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "error": {
      "id": 1,
      "category": "bug",
      "description": "Login page shows blank after 5 seconds",
      "status": "open"
    },
    "actions": [
      {
        "id": 1,
        "errorId": 1,
        "action": "assigned",
        "description": "Assigned to John Smith for investigation",
        "status": "in-progress",
        "createdAt": "2024-01-15T10:00:00.000Z"
      },
      {
        "id": 2,
        "errorId": 1,
        "action": "comment",
        "description": "Found issue in JavaScript cache clearing logic",
        "status": "in-progress",
        "createdAt": "2024-01-15T11:00:00.000Z"
      }
    ]
  }
}
```

---

### 21. Add Error Action

**Endpoint:** `POST /api/errors/:id/action`
**Auth Required:** Yes (Admin)
**Method:** POST

**URL:** `http://localhost:3000/api/errors/1/action`

**Request Body:**

```json
{
  "action": "comment",
  "description": "Found issue in JavaScript cache clearing logic",
  "status": "in-progress"
}
```

**Valid Actions:**

- `assigned` - Error assigned to someone
- `comment` - Comment/update on error
- `resolved` - Error has been fixed
- `closed` - Error marked as closed
- `reopened` - Error reopened

**Expected Response (201 Created):**

```json
{
  "success": true,
  "message": "Action added successfully",
  "data": {
    "id": 2,
    "errorId": 1,
    "action": "comment",
    "description": "Found issue in JavaScript cache clearing logic",
    "status": "in-progress",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## 🧪 Complete Testing Workflow

Follow this sequence to test the entire system:

1. **Authentication (Step 1-2)**
   - [ ] Test login endpoint
   - [ ] Copy authentication token

2. **Employee (Step 3-4)**
   - [ ] Get personal profile
   - [ ] Get all employees (admin token)

3. **Attendance (Step 5-7)**
   - [ ] Mark attendance
   - [ ] Get personal attendance
   - [ ] Get all attendance (admin)

4. **Achievements (Step 8-10)**
   - [ ] Create achievement
   - [ ] Get achievements
   - [ ] Endorse achievement

5. **Daily Tracker (Step 11-12)**
   - [ ] Log daily activity
   - [ ] Get daily tracker history

6. **Leave Requests (Step 13-15)**
   - [ ] Submit leave request
   - [ ] Get leave requests
   - [ ] Review request (admin)

7. **Clients (Step 16-17)**
   - [ ] Create client
   - [ ] Get all clients

8. **Error Reporting (Step 18-21)**
   - [ ] Report error
   - [ ] Get errors (admin)
   - [ ] Get error timeline
   - [ ] Add error action

---

## 📝 Postman Collection Setup

To make testing easier, you can import a Postman collection:

1. **Create new collection** in Postman
2. **Add environment variables:**
   - `base_url`: `http://localhost:3000`
   - `token`: (leave blank, populate after login)

3. **Set up pre-request script** to update token after login:

```javascript
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("token", jsonData.token);
}
```

4. **Use variables in headers:**
   - `Authorization: Bearer {{token}}`
   - `Content-Type: application/json`

---

## ✅ Success Criteria

All endpoints should return:

- ✅ Correct HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- ✅ JSON responses with `success` property
- ✅ Data is persisted to database
- ✅ Authentication tokens are validated
- ✅ Admin endpoints reject non-admin users (403)
- ✅ Field validation errors are detailed
- ✅ Error messages are user-friendly

---

## 🐛 Troubleshooting

### Connection Refused

- Backend server not running
- Wrong port (should be 3000)
- Solution: `cd c:\Cognizant\sellerRep\backend && node src/server.js`

### 401 Unauthorized

- Missing or invalid token
- Token expired
- Solution: Get new token from login endpoint

### 403 Forbidden

- Using non-admin token for admin endpoint
- User doesn't have required role
- Solution: Use admin token

### 422 Validation Error

- Invalid request data format
- Missing required fields
- Check error details in response

### 500 Server Error

- Database connection issue
- Backend code error
- Check server console for error message

---

## 📊 Database Verification

After successful API tests, verify data was saved to database:

1. Connect to MySQL database
2. Database: `sql7821356`
3. Verify records in tables:
   - `Users` - Login records
   - `Employees` - Employee data
   - `Attendance` - Attendance records
   - `Achievements` - Achievement records
   - `DailyTracker` - Activity logs
   - `LeaveRequests` - Leave request records
   - `Clients` - Client records
   - `Errors` - Error reports
   - `ErrorActions` - Error action timeline
   - `AuditLog` - All operations logged

---

## 🎯 Next Steps

1. Run through complete testing workflow
2. Fix any failing endpoints
3. Document any deviations from expected responses
4. Deploy to production when all tests pass
5. Set up monitoring and logging

---
