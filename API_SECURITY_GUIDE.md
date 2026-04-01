# API Documentation & Changes

## Login Endpoint Changes

### Before Optimization

```
POST /api/auth/login
Request: { email, password }
Response: { token }
Error: Password stored in plain text, no validation
```

### After Optimization

```
POST /api/auth/login
Request: { email, password }
Response: { token, user: { id, email, role } }
Features:
  - Password validated using bcrypt
  - Email validated with express-validator
  - Password minimum 6 characters
  - Rate limited to 5 attempts per 15 minutes
  - Consistent error message (no user enumeration)
```

## Authorization Changes by Endpoint

### Daily Tracker

```
POST   /api/daily-tracker
  Before: authorizeRoles("employee", "admin")
  After:  authorizeRoles("employee", "admin") ✓ UNCHANGED
  Validation: activity_date, calls, emails, connects, new_clients (all required, numeric)

GET    /api/daily-tracker (view all for dashboards)
  Before: No authorization check  ❌ VULNERABILITY
  After:  authorizeRoles("employee", "admin") ✓ FIXED
  Security: Both roles can view all data for analytics/dashboards

GET    /api/daily-tracker/mine
  Before: authorizeRoles("employee", "admin")
  After:  authorizeRoles("employee", "admin") ✓ UNCHANGED
```

### Achievements

```
POST   /api/achievements
  Before: authorizeRoles("employee", "admin")
  After:  authorizeRoles("employee", "admin") ✓ UNCHANGED
  Validation: achievement_date, title, description, category, impact (all required)

GET    /api/achievements (view all for dashboards)
  Before: No authorization check  ❌ VULNERABILITY
  After:  authorizeRoles("employee", "admin") ✓ FIXED
  Security: Both roles can view all data for analytics/dashboards

GET    /api/achievements/mine
  Before: authorizeRoles("employee", "admin")
  After:  authorizeRoles("employee", "admin") ✓ UNCHANGED
```

### Leave Requests

```
POST   /api/leave-requests
  Before: authorizeRoles("employee", "admin")
  After:  authorizeRoles("employee", "admin") ✓ UNCHANGED
  Validation: start_date, end_date, leave_type, reason (all required, typed)
 (view all for dashboards)
  Before: No authorization check  ❌ VULNERABILITY
  After:  authorizeRoles("employee", "admin") ✓ FIXED
  Security: Both roles can view all data for analytics/dashboardsin")  ❌ VULNERABILITY
  After:  authorizeRoles("admin") ✓ FIXED

GET    /api/leave-requests/mine
  Before: authorizeRoles("employee", "admin")
  After:  authorizeRoles("employee", "admin") ✓ UNCHANGED

PATCH  /apNo authorization check  ❌ VULNERABILITY
  After:  authorizeRoles("admin") ✓ FIXED
  Validation: ID parameter validation, status enum
  Security: Only admins can approve/decline requests
  Validation: ID parameter validation, status enum
```

### Clients

```
POST   /api/clients
  Before: authorizeRoles("admin", "employee")
  After:  authorizeRoles("admin", "employee") ✓ UNCHANGED
  Validation: clien (view all for dashboards)
  Before: No authorization check  ❌ VULNERABILITY
  After:  authorizeRoles("employee", "admin") ✓ FIXED
  Security: Both roles can view all clients for analytics/dashboards
  Before: authorizeRoles("employee", "admin")  ❌ VULNERABILITY
  After:  authorizeRoles("admin") ✓ FIXED

GET    /api/clients/employee/:employeeId
  Before: authorizeRoles("admin", "employee")
  After:  authorizeRoles("admin", "employee") ✓ UNCHANGED
```

### Errors

```
POST   /api/errors
  Before: authorizeRoles("employee", "admin")
  After:  authorizeRoles("employee", "admin") ✓ UNCHANGED

GET    /api/errors
  Before: No authorization check  ❌ VULNERABILITY
  After:  authorizeRoles("employee", "admin") ✓ FIXED
  Security: Both roles can view all errors for dashboards

GET    /api/errors/:id/timeline
  Before: No authorization check  ❌ VULNERABILITY
  After:  authorizeRoles("employee", "admin") ✓ FIXED
  Security: Both roles can view error timeline/history

POST   /api/errors/:id/actions (add timeline action)
  Before: No authorization check  ❌ VULNERABILITY
  After:  authorizeRoles("admin") ✓ FIXED
  Security: Only admins can add actions to error timeline
```

## HTTP Status Codes & Error Handling

### Authentication & Authorization

```
200 OK             - Request successful
201 Created        - Resource created successfully
400 Bad Request    - Validation error (invalid email format, missing fields, etc.)
401 Unauthorized   - Missing or invalid JWT token
403 Forbidden      - Authenticated but not authorized for this resource
429 Too Many Requests - Rate limit exceeded
500 Internal Server Error - Unexpected error (safe message returned to client)
```

### Error Response Format

```json
{
  "message": "User-friendly error message",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

## Validation Rules by Endpoint

### POST /api/auth/login

```
email:    Must be valid email format, normalized to lowercase
password: Must be 6+ characters
```

### POST /api/daily-tracker

```
activity_date: ISO8601 date (required)
calls:         Non-negative integer (required)
emails:        Non-negative integer (required)
connects:      Non-negative integer (required)
new_clients:   Non-negative integer (required)
notes:         String, max 500 chars (optional)
```

### POST /api/achievements

```
achievement_date: ISO8601 date (required)
title:            String, 3-255 chars (required)
description:      String, 5-1000 chars (required)
category:         String, max 100 chars (optional)
impact:           'High' | 'Medium' | 'Low' (required)
```

### POST /api/leave-requests

```
start_date:  ISO8601 date (required)
end_date:    ISO8601 date (required, must be >= start_date)
leave_type:  'Sick'|'Vacation'|'Personal'|'Maternity'|'Other' (required)
reason:      String, 5-500 chars (required)
```

### POST /api/clients

```
client_name:    String, 3-255 chars (required)
contact_person: String, 2-100 chars (required)
email:          Valid email format (required)
phone:          Valid phone format (required)
industry:       String, max 100 chars (optional)
status:         'active'|'inactive'|'prospect' (required)
```

## Frontend Changes Required

✅ **No changes needed** - Frontend is fully compatible with secured backend

### What the frontend gets:

1. Auth login returns both token + user info
2. Token automatically added to Authorization header by axios interceptor
3. 401 errors automatically trigger logout and redirect to /login
4. Validation errors shown to user with field-specific messages

## Testing the Endpoints

### Test Login

```bash
# Get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response:
# {
#   "token": "eyJhbGc...",
#   "user": {"id":1,"email":"user@example.com","role":"employee"}
# }
```

### Test Daily Tracker (as employee)

```bash
curl -X GET http://localhost:3000/api/daily-tracker/mine \
  -H "Authorization: Bearer <token>"

# Returns: [{ activity_date, calls, emails, connects, new_clients, notes }]
```

### Test Unauthorized Access (as employee)

```bash
# This should now return 403 (was returning data before - VULNERABILITY)
curl -X GET http://localhost:3000/api/daily-tracker \
  -H "Authorization: Bearer <employee-token>"

# Response: 403 Forbidden - Access denied
```

### Test Admin Access

```bash
curl -X GET http://localhost:3000/api/daily-tracker \
  -H "Authorization: Bearer <admin-token>"

# Returns: All employees' daily tracker data
```

## Security Headers Added

### Helmet.js Default Headers

- `X-Content-Type-Options: nosniff` - Prevent MIME type sniffing
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-XSS-Protection: 0` - Disable deprecated XSS protection
- `Strict-Transport-Security: max-age=15552000` - HTTPS enforcement
- `Content-Security-Policy` - Restrict resource loading

## Rate Limiting

### General APIs

- Window: 15 minutes
- Limit: 100 requests per IP
- Message: "Too many requests from this IP, please try again later"

### Login Endpoint

- Window: 15 minutes
- Limit: 5 failed attempts per IP
- Skips successful logins (doesn't count toward quota)
- Message: "Too many login attempts, please try again later"

## Request/Response Examples

### Successful Login

```
→ POST /api/auth/login
  { "email": "john@example.com", "password": "password123" }

← 200 OK
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "role": "employee"
    }
  }
```

### Failed Validation

```
→ POST /api/auth/login
  { "email": "invalid-email", "password": "short" }

← 400 Bad Request
  {
    "message": "Validation failed",
    "errors": [
      {
        "field": "email",
        "message": "Valid email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 6 characters"
      }
    ]
  }
```

### Unauthorized Access

```
→ GET /api/daily-tracker
  (No Authorization header)

← 401 Unauthorized
  {
    "message": "No token provided"
  }
```

### Forbidden Access

```
→ GET /api/daily-tracker
  Authorization: Bearer <employee-token>

← 403 Forbidden
  {
    "message": "Access denied"
  }
```

### Rate Limited

```
→ POST /api/auth/login (6th failed attempt in 15 minutes)
  { "email": "user@example.com", "password": "wrong" }

← 429 Too Many Requests
  {
    "message": "Too many login attempts, please try again later"
  }
```
