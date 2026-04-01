# Node.js Backend & Frontend Complete Integration Guide

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Backend Verification](#backend-verification)
3. [Frontend Verification](#frontend-verification)
4. [Testing API Endpoints](#testing-api-endpoints)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ installed
- MySQL database (sql7.freesqldatabase.com)
- Two terminal windows

### Step 1: Install Backend Dependencies

```bash
cd c:\Cognizant\sellerRep\backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd c:\Cognizant\sellerRep\frontend
npm install
```

### Step 3: Start Backend Server (Terminal 1)

```bash
cd c:\Cognizant\sellerRep\backend
node src/server.js
```

**Expected Output:**

```
[dotenv] injecting env (8) from .env
Server running on port 3000
```

### Step 4: Start Frontend Server (Terminal 2)

```bash
cd c:\Cognizant\sellerRep\frontend
npm start
```

**Expected Output:**

```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3001
```

### Step 5: Run Verification Tests

```bash
# In a third terminal
cd c:\Cognizant\sellerRep
node verify-setup.js
node test-api.js
```

---

## ✅ Backend Verification

### 1. Check Backend Structure

```bash
cd c:\Cognizant\sellerRep\backend
node verify-setup.js
```

This will verify:

- ✓ All required files present
- ✓ Environment variables configured
- ✓ Dependencies installed
- ✓ Middleware configured
- ✓ Routes registered

### 2. Verify Database Connection

```bash
# From backend folder
node -e "const db = require('./src/config/db'); db.execute('SELECT 1').then(() => console.log('✓ DB OK')).catch(e => console.log('✗ Error:', e.message))"
```

**Expected:** `✓ DB OK`

### 3. Verify Middleware Stack

Check `backend/src/app.js` contains:

- ✓ `helmet()` - Security headers
- ✓ `cors()` - CORS configuration
- ✓ `express.json()` - Body parser
- ✓ `rateLimit()` - Rate limiting
- ✓ Route registrations
- ✓ Error handlers

### 4. Verify Authentication Middleware

Check `backend/src/middleware/auth.middleware.js`:

```javascript
✓ Validate Authorization header
✓ Extract Bearer token
✓ Verify JWT signature
✓ Attach user to request
✓ Return 401 on invalid token
```

### 5. Verify Role-Based Access Control

Check `backend/src/middleware/role.middleware.js`:

```javascript
✓ Check user role in JWT payload
✓ Verify allowed roles
✓ Return 403 if unauthorized
```

### 6. Verify Input Validation

Check `backend/src/middleware/validation.middleware.js`:

```javascript
✓ validateLogin - Email and password
✓ validateDailyTracker - Activity data
✓ validateAchievement - Achievement data
✓ validateLeaveRequest - Leave request data
✓ validateClient - Client data
✓ handleValidationErrors - Error formatting
```

### 7. Test Backend Directly

Using cURL:

```bash
# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"employee@example.com\",\"password\":\"Emp@123456\"}"

# Expected: { "token": "...", "user": { ... } }
```

---

## ✅ Frontend Verification

### 1. Check Frontend Structure

```bash
cd c:\Cognizant\sellerRep\frontend
# Verify src/index.js exists and routes to App.js
# Verify src/App.js has all routes defined
# Verify src/api/axios.js configured with baseURL
```

### 2. Verify Entry Point

**src/index.js** should render App in root:

```javascript
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
```

**public/index.html** should have:

```html
<div id="root"></div>
```

### 3. Verify Axios Configuration

**src/api/axios.js** should have:

```javascript
✓ baseURL: "http://localhost:3000/api"
✓ Request interceptor adding token
✓ Response interceptor handling 401
✓ Auto-redirect to login on expiration
```

### 4. Verify Authentication Context

**src/auth/AuthContext.jsx** should:

```javascript
✓ Store token in localStorage
✓ Store user data in localStorage
✓ Have login(token) function
✓ Have logout() function
✓ Provide useAuth() hook
```

### 5. Verify Protected Routes

**src/auth/ProtectedRoute.jsx** should:

```javascript
✓ Check if user exists
✓ Check user role (if required)
✓ Redirect to /login if not authenticated
✓ Return children if authenticated
```

### 6. Verify Route Configuration

**src/App.js** should have:

```javascript
✓ BrowserRouter wrapping routes
✓ AuthProvider wrapping routes
✓ Login route (unprotected)
✓ Protected routes using ProtectedRoute
✓ Admin routes with role check
```

### 7. Test Frontend in Browser

1. Open http://localhost:3001
2. Should redirect to /login
3. Login form should be visible
4. Enter credentials:
   - Email: employee@example.com
   - Password: Emp@123456
5. Click Submit
6. Should redirect to Dashboard

**Expected:**

- ✓ Login request sent to backend
- ✓ Token stored in localStorage
- ✓ Redirected to Dashboard
- ✓ User info displayed in navbar

---

## 🧪 Testing API Endpoints

### Run Automated Test Suite

```bash
cd c:\Cognizant\sellerRep
node test-api.js
```

This will test:

- ✓ CORS configuration
- ✓ Authentication (login, token validation)
- ✓ Protected routes (require token)
- ✓ Role-based access (admin routes)
- ✓ Input validation
- ✓ All 15 API endpoints
- ✓ Error handling
- ✓ Rate limiting

### Manual Testing with Postman

#### 1. Test Login

**POST** `http://localhost:3000/api/auth/login`

```json
{
  "email": "employee@example.com",
  "password": "Emp@123456"
}
```

**Expected (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "employee@example.com",
    "role": "employee"
  }
}
```

#### 2. Test Protected Endpoint

**GET** `http://localhost:3000/api/employees/profile`

**Headers:**

```
Authorization: Bearer {token_from_step1}
```

**Expected (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "employee@example.com",
    "role": "employee"
  }
}
```

#### 3. Test Missing Token

**GET** `http://localhost:3000/api/employees/profile`
_(without Authorization header)_

**Expected (401 Unauthorized):**

```json
{
  "message": "No token provided"
}
```

#### 4. Test Admin Authorization

**GET** `http://localhost:3000/api/employees`

With Employee Token:
**Expected (403 Forbidden):**

```json
{
  "message": "Access denied"
}
```

With Admin Token:
**Expected (200 OK):**

```json
{
  "success": true,
  "data": [ ... ]
}
```

---

## 📊 Integration Verification Checklist

### Backend

- [ ] npm dependencies installed
- [ ] .env file with all 8 variables
- [ ] Database connection working
- [ ] app.js has all middleware
- [ ] Routes registered properly
- [ ] Controllers call models
- [ ] Models use promises
- [ ] Error handlers in place
- [ ] Server starts on port 3000

### Frontend

- [ ] npm dependencies installed
- [ ] index.js renders App
- [ ] App.js has BrowserRouter
- [ ] axios configured correctly
- [ ] AuthContext stores user/token
- [ ] ProtectedRoute checks auth
- [ ] All routes registered
- [ ] API files call axios
- [ ] npm start runs on port 3001

### Integration

- [ ] CORS allows frontend
- [ ] Login returns token
- [ ] Token works in protected routes
- [ ] Admin routes check role
- [ ] Validation rejects invalid input
- [ ] Rate limiting blocks excess
- [ ] Frontend can login
- [ ] Protected routes redirect
- [ ] Data persists to database
- [ ] Logout clears localStorage

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `Port 3000 already in use`

```bash
# Find process using port 3000
netstat -ano | findstr :3000
# Kill process
taskkill /PID {PID} /F
# Try again
node src/server.js
```

**Error:** `Module not found`

```bash
cd backend
npm install
```

**Error:** `Cannot find module 'dotenv'`

```bash
npm install dotenv
```

**Error:** `Database connection failed`

```bash
# Verify .env credentials
type .env
# Test connection manually
mysql -h sql7.freesqldatabase.com -u sql7821356 -p CB3a6hAWyT
```

### Frontend Won't Start

**Error:** `Port 3001 already in use`

```bash
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID {PID} /F
npm start
```

**Error:** `Failed to compile`

```bash
cd frontend
rm -rf node_modules
npm install
npm start
```

**Error:** `404 Not Found` for routes

```
Check that src/App.js has correct route paths
Verify component imports are correct
```

### API Calls Failing

**Error:** `Failed to fetch`

- Backend not running
- Wrong baseURL in axios.js
- CORS not configured

**Error:** `401 Unauthorized`

- Token not being sent
- Token expired
- Check Authorization header format

**Error:** `403 Forbidden`

- User doesn't have required role
- Check endpoint authorization

**Error:** `Network Error`

- Backend connection refused
- Firewall blocking ports

### Login Not Working

1. **Check backend is running**

   ```bash
   curl http://localhost:3000/api/auth/login
   ```

2. **Verify credentials in database**

   ```bash
   mysql -u sql7821356 -p sql7821356 sql7821356
   SELECT email, role FROM Users;
   ```

3. **Check password hashing**
   - Password must be hashed with bcrypt
   - Login compares with `bcrypt.compare()`

4. **Check token generation**
   - JWT secret from .env
   - Token expiry set to 24h

---

## 📈 Performance Tips

### Backend Optimization

1. **Add database indexes** for frequently queried columns
2. **Use connection pooling** (already configured in db.js)
3. **Cache static responses** with appropriate headers
4. **Monitor memory usage** with long-running connections

### Frontend Optimization

1. **Lazy load pages** using React.lazy()
2. **Debounce API calls** in search/filter inputs
3. **Cache API responses** in localStorage
4. **Minimize bundle size** with tree shaking

---

## 🔒 Security Checklist

- [x] CORS configured for specific origins
- [x] Helmet.js adds security headers
- [x] Rate limiting prevents DDoS
- [x] Passwords hashed with bcrypt
- [x] JWT tokens with expiry
- [x] Input validation prevents SQL injection
- [x] Error messages don't expose internals
- [x] HTTPS ready (set NODE_ENV=production)

---

## 📚 Documentation Files

| File                          | Purpose                           |
| ----------------------------- | --------------------------------- |
| NODE_JS_VERIFICATION_GUIDE.md | Complete verification guide       |
| COMPONENTS_HOOKS_GUIDE.md     | Shared components documentation   |
| API_TESTING_GUIDE.md          | Detailed API testing              |
| IMPLEMENTATION_CHECKLIST.md   | Project progress tracking         |
| verify-setup.js               | Automated structure verification  |
| test-api.js                   | Automated API integration testing |

---

## ✨ Summary

Your Node.js application is **production-ready** when:

✅ All files properly structured
✅ Dependencies installed
✅ Environment configured
✅ Middleware configured
✅ Database connected
✅ All endpoints responding
✅ Authentication working
✅ Frontend can login
✅ Data persisting
✅ Tests passing

---

## 🎯 Next Steps

1. **Verify Setup:** `node verify-setup.js`
2. **Test API:** `node test-api.js`
3. **Manual Testing:** Use Postman with API_TESTING_GUIDE.md
4. **Deploy:** Set NODE_ENV=production

---

**Status:** ✅ Ready for Production
**Last Updated:** 2026-03-29
